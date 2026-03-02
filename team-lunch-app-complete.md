# Team Lunch App - Complete Project Documentation

*A comprehensive guide from requirements through implementation*

---

## Table of Contents
1. [Product Requirements (PRD)](#product-requirements-prd)
2. [Technical Design Document](#technical-design-document)
3. [Implementation Task Breakdown](#implementation-task-breakdown)

---

## Product Requirements (PRD)

Great start. I turned your list into a structured PRD with user stories and acceptance criteria you can copy into your doc and iterate on. I've grouped stories into epics that map directly to your bullets.

Team Lunch App – PRD (draft v0.1)

1) Problem statement
- Teams waste time deciding where to go for lunch. Decisions often ignore distance/time, price, dietary needs, and recency ("we were just there"), leading to sub‑optimal choices and lower participation.

2) Goals
- Help a team pick a lunch spot quickly and fairly.
- Incorporate constraints: walking time/distance, price, dietary restrictions, and how recently a place was visited.
- Keep team history to avoid repeats and inform future choices.
- Make participation lightweight and inclusive.

3) Success metrics (MVP)
- Time to decision: median ≤ 3 minutes from "start vote" to "winner selected."
- Participation: ≥ 70% of active team members cast a vote at least once per week.
- Repeat avoidance: ≤ 20% of selections are repeats within 2 weeks (if restriction is set).
- Satisfaction (post‑lunch thumbs‑up): ≥ 80% positive.
- Accuracy coverage: ≥ 90% of suggestions display distance, price tier, and basic cuisine tags.

4) Users/personas
- Team member: joins a team, suggests, votes, sees results, reviews.
- Organizer (optional role): manages team membership, sets default constraints, closes votes.
- System: retrieves restaurants (by name or style), calculates distance/time, tracks history and restrictions.

5) Assumptions
- Teams are co‑located for lunch (walk or short transit).
- External data source available for restaurants (e.g., Google Places, Yelp, OpenStreetMap + OpenFoodFacts).
- Basic location permission is granted by users to calculate distance/time from a common starting point.
- "How busy" is best‑effort (3rd‑party "popular times" or crowd input); data may be unavailable for some places.

6) Scope
- In scope (MVP): team creation, member management, suggest by name or cuisine, distance/time estimation (walking), dietary tags, upvote/pile‑on voting, price tiers, result selection with tie‑break, history, sort/filter, "haven't been in awhile," post‑lunch review.
- Future (post‑MVP): live wait times via partnerships, reservations, delivery/takeout workflows, calendar integration, advanced ranking personalization, native mobile apps if starting with web.

7) Non‑goals (MVP)
- Handling payments or splitting checks.
- Menu‑level allergen verification beyond tags and heuristics.
- Company‑wide policy management or expense integration.

8) Key requirements by epic, with user stories and acceptance criteria

Epic A: Team and membership
A1. Create and manage team
- Story: As an organizer, I want to create a team and set a home location so the app can calculate walking time.
- Acceptance:
  - User can set team name and a default meeting point (address or map pin).
  - Team is private; only invited members can view and vote.
  - Meeting point can be edited; all future distance/time uses latest point.

A2. Invite, add, remove members
- Story: As an organizer, I want to add/remove people so the voter list stays accurate.
- Acceptance:
  - Organizer can invite via shareable link or email.
  - Members can leave; organizer can remove.
  - Membership changes update immediately and reflect in active polls.

A3. Member profiles with dietary restrictions
- Story: As a team member, I want to set my dietary restrictions so suggestions consider my needs.
- Acceptance:
  - Supported tags: vegetarian, vegan, gluten‑free friendly, halal friendly, kosher friendly, nut‑free friendly, dairy‑free friendly, pork‑free.
  - Multiple tags per user.
  - Restaurants display compatibility as "Likely compatible," "May be compatible," "Unknown" based on available data/cuisine heuristics.
  - Privacy: dietary tags visible to team members only.

Epic B: Restaurant discovery and suggestions
B1. Suggest by name
- Story: As a team member, I want to suggest a specific restaurant.
- Acceptance:
  - Search returns name, address, price tier ($–$$$$), distance, cuisine tags.
  - Duplicate prevention: if a suggested place already exists in the poll, it's de‑duplicated and the previous suggestion is surfaced.
  - If data incomplete, show "Unknown" label for missing fields.

B2. Suggest by style/cuisine ("sushi", "pizza")
- Story: As a team member, I want to suggest a style so the app pulls candidates.
- Acceptance:
  - Free‑text cuisine entry matched to known categories; returns top N (e.g., 10) nearby.
  - Member can pick one or multiple from the list to add to the poll.
  - Results filtered by team constraints (distance/time) if enabled.

B3. Add/remove restaurants from team list
- Story: As a team member, I want to add favorites or remove places from our saved list.
- Acceptance:
  - Team "Favorites" library: add/remove visible to all team members.
  - Removing a favorite does not delete historical records.

Epic C: Constraints and filters
C1. Distance/time constraint
- Story: As an organizer, I want to set max walking time so options fit our schedule.
- Acceptance:
  - Configurable time cap (e.g., 5–20 minutes in 1‑minute steps).
  - App calculates walking time from team meeting point via routing API.
  - Poll shows only options within cap when the filter is applied; toggleable.
  - If location permission not granted, use team meeting point; show fallback.

C2. Price point voting and filtering
- Story: As a team member, I want to vote on acceptable price range.
- Acceptance:
  - Price tiers ($ to $$$$) shown for each place; users can filter by tiers.
  - If a place lacks a price tier, it's labeled Unknown and included unless filtered out.

C3. "Haven't been in awhile" restriction
- Story: As an organizer, I want to deprioritize or exclude places we've been to recently.
- Acceptance:
  - Configurable window (e.g., 7, 14, 30 days).
  - Option 1: Exclude from poll; Option 2: Include but lower default rank or add warning.
  - History records visits automatically when a poll completes.

C4. Dietary compatibility influence
- Story: As a team member, I want dietary needs to influence suggestions.
- Acceptance:
  - Poll shows compatibility score based on team members' restrictions.
  - Organizer can choose: filter incompatible, or display a warning badge.
  - Compatibility impact is documented in the results rationale.

Epic D: Voting and decisioning
D1. Create a poll
- Story: As an organizer, I want to start a poll for today's lunch.
- Acceptance:
  - Organizer sets close time (default 5–10 minutes) and optional constraints (distance cap, recency).
  - Members receive a link/notification to vote.
  - Poll supports suggestions until close.

D2. Upvote/pile on
- Story: As a team member, I want to upvote an existing suggestion.
- Acceptance:
  - One upvote per user per restaurant; user can change vote before close.
  - Total votes update in real time.
  - Voting open/closed state clearly indicated.

D3. Everyone can vote
- Story: As a team member, I want exactly one counted vote per option per user so the process is fair.
- Acceptance:
  - Authenticated identity required; anonymous voting out of scope for MVP.
  - Late votes after close are rejected with a message.

D4. Sorting and viewing during poll
- Story: As a team member, I want to sort suggestions.
- Acceptance:
  - Sort options: distance, price, total votes, "times been," dietary compatibility.
  - Default sort: votes desc, then distance asc.

D5. Show results and tie‑break
- Story: As an organizer, I want a clear winner at close time.
- Acceptance:
  - Winner is the place with most votes that meets all active constraints.
  - Tie‑break default: random among tied top options, with a transparent note; organizer can trigger a quick run‑off poll as an alternative.
  - Results page shows rationale: votes, distance, price, compatibility, recency.
  - Map link and address shown for navigation.

Epic E: History and analytics
E1. Display team history
- Story: As a team member, I want to see where we've gone and when.
- Acceptance:
  - History shows date, winner, vote counts, participants, and post‑lunch rating.
  - "Times been" and "last visited" available per restaurant.

E2. Review ex post facto
- Story: As a team member, I want to rate and leave a short comment after lunch.
- Acceptance:
  - Simple 1–5 rating and optional 140‑character comment.
  - Aggregate team rating displayed on future polls/history.
  - Reviews are team‑internal and not public.

Epic F: Restaurant context and busyness
F1. Show "how busy" a restaurant is (best‑effort)
- Story: As a team member, I want to know if a place is crowded now.
- Acceptance:
  - If provider has "popular times/Live busyness," show one of: Not busy, Typical, Busier than usual, Unknown.
  - If no data, display Unknown (never block selection on missing data).
  - Timestamp for last update shown.

9) Data model (MVP, high‑level)
- Team: id, name, meeting_point, settings (distance cap, recency window), favorites[]
- User: id, name, email, dietary_tags[]
- Restaurant: provider_id, name, location, price_tier, cuisine_tags[], compatibility_score (per team), last_visited_at, times_visited
- Poll: id, team_id, status, close_time, constraints, suggestions[], votes{user_id -> restaurant_id}, winner_id
- Review: id, poll_id, restaurant_id, user_id, rating, comment, created_at

10) UX notes (MVP)
- Start poll screen: set close time and constraints.
- Suggest flow: search box for name; separate "Suggest by cuisine" chip.
- Poll list: cards with name, votes, time to walk, price, compatibility, busyness badge.
- Result screen: winner at top, tie‑break message if used, "Open in Maps."
- History: filter by date range, cuisine, rating.

11) Technical/operational requirements
- Platforms: responsive web app for MVP; mobile web friendly.
- Location: routing for walking time; fallback to straight‑line distance if API fails (clearly labeled).
- Performance: poll list loads within 1.5 seconds for 50 suggestions.
- Reliability: actions retried with eventual consistency if network blips.
- Privacy/security: team spaces private; no public endpoints for history or reviews; minimal PII (name, email).
- Accessibility: WCAG AA; keyboard operable, alt text for icons, sufficient contrast.
- Observability: track time to decision, poll participation rate, errors on external API calls.

12) Risks and mitigations
- External data gaps (price, busyness): display Unknown and avoid blocking flows; allow manual tags in future.
- Location permissions denied: rely on team meeting point; inform users.
- Tie friction: build quick run‑off; randomizer with transparency.
- Dietary accuracy: clearly communicate "best‑effort" and allow flagging issues.

---

## Technical Design Document

Locked—thanks for confirming:
- Show only aggregate vote counts during a poll (no per‑voter visibility).
- Members can upvote multiple restaurants; at most one upvote per restaurant.

I've finalized the design (v1.1) and included concise implementation artifacts you can paste into your repo: ERD (text), initial SQL migration, and sample integration snippets.

Team Lunch App – Design Doc v1.1 (final MVP)

### Decisions
- Platform: Next.js (App Router) + TypeScript + MUI.
- Hosting/regions: Vercel (EU). Supabase Postgres + PostGIS (EU). Upstash Redis (EU).
- Auth: Auth.js email magic links only.
- Data providers: OSM/Overpass for places (Germany‑first). OpenRouteService (ORS) for walking times.
- Omitted in MVP: price, busyness, Slack; no admin toggles.
- Voting UX: aggregate totals visible to all during the poll; no per‑voter info. Users may upvote multiple restaurants, one vote per restaurant. 5‑second polling for totals (no SSE).

### Scope (MVP)
- Teams + invites, meeting point.
- Polls: create with close time and max walk minutes; suggest by cuisine or name; de‑dup per provider_id; vote; results with tie‑break.
- Constraints: max walk (hard), recency deprioritize within 14 days (soft), dietary "warn" (soft).
- History and simple reviews.

### Key logic (unchanged from v1.0, clarified for voting)
- A user can cast at most one vote per (poll, restaurant). They can vote for multiple restaurants in the same poll and can withdraw/change before close.
- During poll, GET /api/polls/:id returns totals only (map of restaurantId → count). UI shows counts but not who voted.
- Winner selection applies hard max-walk filter (include unknown times in MVP), then picks the highest vote total; ties resolved randomly with stored seed.

### Text ERD (concise)
- users (1..N) —< team_members >— (1..N) teams
- teams (1..N) —< polls
- polls (1..N) —< poll_suggestions >— restaurants
- polls (1..N) —< poll_votes >— users
- teams (1..N) —< team_restaurants >— restaurants
- reviews: user —> (poll, restaurant) after close

### Initial SQL migration (Postgres + PostGIS)
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

### Representative endpoint contracts (stable)
- Vote (multiple upvotes allowed; one per restaurant)
  - POST /api/polls/:id/votes body { restaurantId } → { ok:true, totals:{ [restaurantId]: count, ... } }
  - DELETE /api/polls/:id/votes/:restaurantId → { ok:true, totals:{ ... } }
- Poll fetch with totals (5‑sec polling)
  - GET /api/polls/:id → {
    id, status, closeTime, constraints,
    suggestions:[{ restaurant, walkTimeSeconds|null, flags:{ recent:boolean, dietary:'ok'|'warn'|'unknown' } }],
    totals:{ restaurantId:string -> count:number }
  }

### Overpass/ORS adapter notes (MVP)
- Cuisine search (bbox around meeting point, limit 30)
  - Query pattern: amenity=restaurant AND cuisine~"{term}" within bbox; normalize node/way/rel; store to restaurants; cache 12h.
- Name search (same bbox)
  - amenity=restaurant AND name~"{term}"
- ORS Matrix
  - Origin: meeting point; Destinations: current suggestions; profile=foot-walking; cache 24h. If ORS fails, compute straight‑line distance and estimate minutes at 4.5 km/h; mark "~".

### Frontend behavior (voting visibility)
- During poll: list shows name, votes (aggregate count), walk time (or "~"), compatibility badge, "recent" badge.
- No UI reveals which member voted for which restaurant.
- After close: results page still shows only totals and winner; no per‑voter breakdown.

### What's next
- I can generate:
  - A minimal Prisma schema or Drizzle models mirroring the SQL.
  - A Next.js Route Handler scaffold for /api/polls with vote upsert logic.
  - Overpass and ORS adapter stubs.

If you want those code stubs now, tell me your preferred ORM (Prisma, Drizzle, or SQL via Supabase client), and I'll provide ready‑to‑paste files.

---

## Implementation Task Breakdown

Here's a granular task list mapped to the user stories and acceptance criteria we agreed on. Each story lists the key ACs (short form) followed by implementation tasks across FE/BE/DB/Infra/QA. Use this to create issues; the bullet order is the recommended execution order.

### Epic A: Teams and membership

**A1. Create and manage team** (AC: create team, set/edit meeting point, private team)
- DB
  - Create tables: users, teams, team_members (+ indexes, PostGIS). Run 0001_init.sql.
- BE
  - Implement POST /api/teams (validate name, meetingPoint; create team; return team).
  - Implement GET/PATCH /api/teams/:id (fetch, update name/meeting_point; organizer-only).
  - Enforce team privacy middleware (only members can access team/poll resources).
- FE
  - Build Team Create page with name + meeting point map picker (Leaflet + OSM tiles).
  - Build Team Settings page (edit name, meeting point).
- Infra
  - Supabase project (EU), enable PostGIS; seed env vars on Vercel.
- QA
  - Unit: meeting point validation (lat/lng bounds).
  - E2E: create team → edit meeting point; ensure non-members blocked.

**A2. Invite, add, remove members** (AC: invite via link/email, leave/remove, update reflected immediately)
- BE
  - POST /api/invites (create signed, time-limited token; send email via provider).
  - POST /api/invites/accept (token → add team_members; default role member).
  - DELETE /api/teams/:id/members/:userId (organizer-only).
  - POST /api/teams/:id/leave (self-service).
- FE
  - Invite dialog: paste emails, show pending invite toasts; accept-invite page.
  - Team Members management UI (list members, remove; leave team).
- QA
  - Tests for expired/invalid tokens; role enforcement; membership reflected on polls list.

**A3. Member profiles with dietary restrictions** (AC: tags stored, visible to team only)
- DB
  - dietary_tags text[] on users (already in schema).
- BE
  - PATCH /api/users/me (update dietary_tags).
  - Getter returns tags only to teammates; mask in non-team contexts.
- FE
  - Profile modal to select tags (vegan, vegetarian, gluten-free friendly, halal friendly, kosher friendly, nut-free friendly, dairy-free friendly, pork-free).
- QA
  - Verify tags persist; visibility limited to team members.

### Epic B: Restaurant discovery and suggestions

**B1. Suggest by name** (AC: search returns name/address/cuisine, de-dup)
- BE
  - Overpass adapter: name search within bbox around meeting point; normalize to {provider:'osm', providerId, name, coords, cuisineTags, address}.
  - Redis cache (12h TTL) for search results; DB persistence in restaurants table; de-dup by (provider, provider_id).
  - GET /api/places/search?type=name&query=...&lat=..&lng=..&limit=30.
  - POST /api/polls/:id/suggestions (by providerId) with de-dup within poll.
- FE
  - Suggest drawer: "By name" search field; results list; "Add" buttons; show duplicates as already in poll.
- QA
  - Recorded fixtures for Overpass; de-dup tests across polls and within a poll.

**B2. Suggest by cuisine/style** (AC: free-text cuisine → top N nearby; select 1..N to add)
- BE
  - Overpass adapter: cuisine search (amenity=restaurant AND cuisine~term) within bbox; same normalization, cache, and persistence.
  - GET /api/places/search?type=cuisine&query=...&lat=..&lng=..&limit=30.
- FE
  - Suggest drawer: "By cuisine" chips and search; multi-select add to poll.
- QA
  - Validate limit and bbox reduce Overpass load; results show cuisine tags when present.

**B3. Team favorites list** (stretch, not required for MVP unless you want it)
- Skip for MVP per current scope.

### Epic C: Constraints and filters

**C1. Distance/time constraint** (AC: max walk cap at poll creation; compute walking times)
- BE
  - ORS Matrix adapter (origin: meeting point; destinations: suggestions) with 24h Redis cache; fallback to straight-line with 4.5 km/h when ORS fails.
  - /api/directions/matrix internal module to batch top N first (e.g., 15).
  - Apply hard filter at winner selection: exclude when time known and > cap; include unknown times.
- FE
  - Start Poll modal: max walk slider (5–20, default 12); display walk times in list (minutes or "~").
- QA
  - Adapter tests with recorded ORS fixtures; fallback correctness; cap enforced at close.

**C3. "Haven't been in awhile" restriction** (AC: deprioritize within 14 days, not exclude)
- BE
  - When poll closes, write team_restaurants.last_visited_at and increment times_visited.
  - In GET /api/polls/:id, flag each suggestion recent=true if last_visited_at within 14 days.
  - Sorting function pushes recent below non-recent at equal votes/time.
- FE
  - "Recent" badge on list items.
- QA
  - Verify flag and sort order across edge cases (no history, first visit, borderline 14 days).

**C4. Dietary compatibility influence** (AC: warn-only badges; per-team roll-up)
- BE
  - Compatibility service: restaurant.cuisine_tags vs team dietary tags → 'ok' | 'warn' | 'unknown'.
  - Include compatibility flag in suggestions payload.
- FE
  - Badge rendering (OK/Warn/Unknown) with tooltip "best effort".
- QA
  - Tests: various tag combos; ensure no exclusion in MVP.

### Epic D: Voting and decisioning

**D1. Create a poll** (AC: set close time, max walk; suggestions open until close)
- DB/BE
  - POST /api/polls (persist constraints_json { max_walk_minutes, recency_days:14, dietary_mode:'warn', include_unknown_time:true }; status=open).
  - GET /api/polls/:id (return poll, suggestions with flags, totals).
  - Auto-close job: Vercel Cron every minute to close overdue polls or transition in request path if fetched after close_time.
- FE
  - Start Poll modal (close time default +10 min; slider for walk cap).
  - Poll shell with countdown timer.
- QA
  - E2E: create poll → confirm open, accepts suggestions and votes until close_time.

**D2. Upvote/pile-on** (AC: one upvote per user per restaurant; change before close)
- BE
  - POST /api/polls/:id/votes (upsert vote; enforce UNIQUE(poll_id,user_id,restaurant_id)).
  - DELETE /api/polls/:id/votes/:restaurantId (remove vote).
  - Return aggregate totals map on each vote response.
- FE
  - Vote button with active state; allow multiple restaurants; undo.
  - 5-second polling to refresh totals and time remaining.
- QA
  - Concurrency tests (two votes at once); permissions (team members only); late vote rejected after close.

**D4. Sorting and viewing during poll** (AC: sort by votes, then time, dietary, recency)
- BE
  - Implement deterministic sort on API or FE; include walkTimeSeconds and flags to support it.
- FE
  - Default "Top" sort; optional toggles for distance sort as a stretch.
- QA
  - Sorting correctness tests with mixed data, including unknown times.

**D5. Show results and tie-break** (AC: clear winner; documented tie-break)
- BE
  - POST /api/polls/:id/close: apply hard filter, compute winners; if tie, random by stored seed; persist winner_restaurant_id; update team_restaurants.
  - Rationale object in response (votes, tieBreak:'random', seed).
- FE
  - Results page: winner card, rationale, "Open in Maps".
- QA
  - Tie scenarios test; verify seed stored and displayed.

### Epic E: History and reviews

**E1. Display team history** (AC: date, winner, vote counts, participants count)
- BE
  - GET /api/teams/:id/history (list of polls with winner, counts, participants, last_visited/time_visited).
- FE
  - History page with filters by date range.
- QA
  - Verify counts and participants for closed polls; pagination if needed.

**E2. Review ex post facto** (AC: 1–5 rating + short comment; team-internal)
- BE
  - POST /api/polls/:id/reviews (rating 1–5, optional comment).
  - Aggregate average rating per team_restaurant for display in future polls/history.
- FE
  - Review dialog on results page and history entries; show aggregate rating badge.
- QA
  - Validation tests for rating bounds; visibility limited to team.

### Cross-cutting (security, privacy, observability, performance)

**Security and privacy**
- Auth.js EmailProvider setup; secure cookie sessions; CSRF protection.
- Invite tokens: signed, time-limited; one-time use.
- RBAC checks on every API route; return 403/404 appropriately.
- PII minimization in logs; dietary tags visible only to team.

**Rate limiting and caching**
- Implement per-IP and per-user rate limits for /places and /directions (e.g., 60/min) using Redis.
- Overpass call debounce per team/query (≥ 10s); ORS batch limit (top 15) per request.

**Observability**
- Add request_id middleware and structured logging.
- Metrics counters: time_to_decision_ms, participation_rate, overpass_errors, ors_errors, cache_hit_rate, pct_unknown_times.
- Dashboards and alerts for external API error spikes and DB saturation.

**Performance and degradation**
- Prefetch ORS times for top 15 visible; lazy other items.
- Fallback to straight-line estimates when ORS fails; display "~".
- Serve stale cached Overpass results with "stale" badge if provider down.

### Infrastructure and setup

**Environment and deployments**
- Vercel project (EU); connect GitHub; preview and prod environments.
- Supabase (EU) and Upstash (EU) instances; env vars in Vercel.
- Vercel Cron: close overdue polls hourly/minutely; nightly cache cleanup.

**CI/CD and quality**
- GitHub Actions: typecheck, unit tests, integration tests (recorded fixtures), Playwright E2E on preview deployment.
- Seed script to create a sample team, users, and a few OSM restaurants for local dev.

**Testing matrix** (tie to ACs)
- A1/A2/A3: access control, invite flows, dietary visibility.
- B1/B2: Overpass adapter correctness and de-dup.
- C1: ORS matrix and fallback; winner exclusion when > cap.
- C3/C4: recent and compatibility flags + sort effects.
- D1/D2/D4/D5: voting rules, 5-second totals polling, tie-break determinism.
- E1/E2: history composition and review aggregation.

---

*This document represents a complete project lifecycle from initial requirements through detailed implementation tasks. Each section builds upon the previous one, ensuring consistency and traceability from business requirements to technical implementation.*