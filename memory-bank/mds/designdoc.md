Locked—thanks for confirming:
- Show only aggregate vote counts during a poll (no per‑voter visibility).
- Members can upvote multiple restaurants; at most one upvote per restaurant.

I’ve finalized the design (v1.1) and included concise implementation artifacts you can paste into your repo: ERD (text), initial SQL migration, and sample integration snippets.

Team Lunch App – Design Doc v1.1 (final MVP)

Decisions
- Platform: Next.js (App Router) + TypeScript + MUI.
- Hosting/regions: Vercel (EU). Supabase Postgres + PostGIS (EU). Upstash Redis (EU).
- Auth: Auth.js email magic links only.
- Data providers: OSM/Overpass for places (Germany‑first). OpenRouteService (ORS) for walking times.
- Omitted in MVP: price, busyness, Slack; no admin toggles.
- Voting UX: aggregate totals visible to all during the poll; no per‑voter info. Users may upvote multiple restaurants, one vote per restaurant. 5‑second polling for totals (no SSE).

Scope (MVP)
- Teams + invites, meeting point.
- Polls: create with close time and max walk minutes; suggest by cuisine or name; de‑dup per provider_id; vote; results with tie‑break.
- Constraints: max walk (hard), recency deprioritize within 14 days (soft), dietary “warn” (soft).
- History and simple reviews.

Key logic (unchanged from v1.0, clarified for voting)
- A user can cast at most one vote per (poll, restaurant). They can vote for multiple restaurants in the same poll and can withdraw/change before close.
- During poll, GET /api/polls/:id returns totals only (map of restaurantId → count). UI shows counts but not who voted.
- Winner selection applies hard max-walk filter (include unknown times in MVP), then picks the highest vote total; ties resolved randomly with stored seed.

Text ERD (concise)
- users (1..N) —< team_members >— (1..N) teams
- teams (1..N) —< polls
- polls (1..N) —< poll_suggestions >— restaurants
- polls (1..N) —< poll_votes >— users
- teams (1..N) —< team_restaurants >— restaurants
- reviews: user —> (poll, restaurant) after close

Initial SQL migration (Postgres + PostGIS)
Use this as 0001_init.sql.

```sql
-- Extensions
create extension if not exists postgis;
create extension if not exists pgcrypto; -- for gen_random_uuid()

-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  dietary_tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Teams
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  meeting_point geography(Point,4326) not null,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index teams_meeting_point_gix on teams using gist (meeting_point);

-- Membership
create table team_members (
  team_id uuid not null references teams(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('organizer','member')),
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

-- Restaurants (OSM is the provider for MVP)
create table restaurants (
  id uuid primary key default gen_random_uuid(),
  provider text not null,                                -- 'osm'
  provider_id text not null,                             -- e.g., 'node/12345'
  name text,
  location geography(Point,4326),
  address jsonb,
  cuisine_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_id)
);
create index restaurants_location_gix on restaurants using gist (location);

-- Team-specific restaurant history
create table team_restaurants (
  team_id uuid not null references teams(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  last_visited_at timestamptz,
  times_visited int not null default 0,
  primary key (team_id, restaurant_id)
);

-- Polls
create table polls (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  status text not null check (status in ('open','closed')),
  close_time timestamptz not null,
  constraints_json jsonb not null,                       -- {max_walk_minutes, recency_days:14, dietary_mode:'warn', include_unknown_time:true}
  created_at timestamptz not null default now(),
  winner_restaurant_id uuid references restaurants(id)
);
create index polls_team_idx on polls(team_id);

-- Suggestions
create table poll_suggestions (
  poll_id uuid not null references polls(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  suggested_by uuid not null references users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (poll_id, restaurant_id)
);

-- Votes (multiple restaurants per user; one vote per restaurant)
create table poll_votes (
  poll_id uuid not null references polls(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (poll_id, user_id, restaurant_id)
);
create index poll_votes_poll_idx on poll_votes(poll_id);

-- Reviews (after poll closes; attached to winner)
create table reviews (
  poll_id uuid not null references polls(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  primary key (poll_id, user_id)
);
```

Representative endpoint contracts (stable)
- Vote (multiple upvotes allowed; one per restaurant)
  - POST /api/polls/:id/votes body { restaurantId } → { ok:true, totals:{ [restaurantId]: count, ... } }
  - DELETE /api/polls/:id/votes/:restaurantId → { ok:true, totals:{ ... } }
- Poll fetch with totals (5‑sec polling)
  - GET /api/polls/:id → {
    id, status, closeTime, constraints,
    suggestions:[{ restaurant, walkTimeSeconds|null, flags:{ recent:boolean, dietary:'ok'|'warn'|'unknown' } }],
    totals:{ restaurantId:string -> count:number }
  }

Overpass/ORS adapter notes (MVP)
- Cuisine search (bbox around meeting point, limit 30)
  - Query pattern: amenity=restaurant AND cuisine~"{term}" within bbox; normalize node/way/rel; store to restaurants; cache 12h.
- Name search (same bbox)
  - amenity=restaurant AND name~"{term}"
- ORS Matrix
  - Origin: meeting point; Destinations: current suggestions; profile=foot-walking; cache 24h. If ORS fails, compute straight‑line distance and estimate minutes at 4.5 km/h; mark “~”.

Frontend behavior (voting visibility)
- During poll: list shows name, votes (aggregate count), walk time (or “~”), compatibility badge, “recent” badge.
- No UI reveals which member voted for which restaurant.
- After close: results page still shows only totals and winner; no per‑voter breakdown.

What’s next
- I can generate:
  - A minimal Prisma schema or Drizzle models mirroring the SQL.
  - A Next.js Route Handler scaffold for /api/polls with vote upsert logic.
  - Overpass and ORS adapter stubs.

If you want those code stubs now, tell me your preferred ORM (Prisma, Drizzle, or SQL via Supabase client), and I’ll provide ready‑to‑paste files.