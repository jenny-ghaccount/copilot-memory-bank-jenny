Here’s a granular task list mapped to the user stories and acceptance criteria we agreed on. Each story lists the key ACs (short form) followed by implementation tasks across FE/BE/DB/Infra/QA. Use this to create issues; the bullet order is the recommended execution order.

Epic A: Teams and membership

A1. Create and manage team (AC: create team, set/edit meeting point, private team)
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

A2. Invite, add, remove members (AC: invite via link/email, leave/remove, update reflected immediately)
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

A3. Member profiles with dietary restrictions (AC: tags stored, visible to team only)
- DB
  - dietary_tags text[] on users (already in schema).
- BE
  - PATCH /api/users/me (update dietary_tags).
  - Getter returns tags only to teammates; mask in non-team contexts.
- FE
  - Profile modal to select tags (vegan, vegetarian, gluten-free friendly, halal friendly, kosher friendly, nut-free friendly, dairy-free friendly, pork-free).
- QA
  - Verify tags persist; visibility limited to team members.

Epic B: Restaurant discovery and suggestions

B1. Suggest by name (AC: search returns name/address/cuisine, de-dup)
- BE
  - Overpass adapter: name search within bbox around meeting point; normalize to {provider:'osm', providerId, name, coords, cuisineTags, address}.
  - Redis cache (12h TTL) for search results; DB persistence in restaurants table; de-dup by (provider, provider_id).
  - GET /api/places/search?type=name&query=...&lat=..&lng=..&limit=30.
  - POST /api/polls/:id/suggestions (by providerId) with de-dup within poll.
- FE
  - Suggest drawer: “By name” search field; results list; “Add” buttons; show duplicates as already in poll.
- QA
  - Recorded fixtures for Overpass; de-dup tests across polls and within a poll.

B2. Suggest by cuisine/style (AC: free-text cuisine → top N nearby; select 1..N to add)
- BE
  - Overpass adapter: cuisine search (amenity=restaurant AND cuisine~term) within bbox; same normalization, cache, and persistence.
  - GET /api/places/search?type=cuisine&query=...&lat=..&lng=..&limit=30.
- FE
  - Suggest drawer: “By cuisine” chips and search; multi-select add to poll.
- QA
  - Validate limit and bbox reduce Overpass load; results show cuisine tags when present.

B3. Team favorites list (stretch, not required for MVP unless you want it)
- Skip for MVP per current scope.

Epic C: Constraints and filters

C1. Distance/time constraint (AC: max walk cap at poll creation; compute walking times)
- BE
  - ORS Matrix adapter (origin: meeting point; destinations: suggestions) with 24h Redis cache; fallback to straight-line with 4.5 km/h when ORS fails.
  - /api/directions/matrix internal module to batch top N first (e.g., 15).
  - Apply hard filter at winner selection: exclude when time known and > cap; include unknown times.
- FE
  - Start Poll modal: max walk slider (5–20, default 12); display walk times in list (minutes or “~”).
- QA
  - Adapter tests with recorded ORS fixtures; fallback correctness; cap enforced at close.

C3. “Haven’t been in awhile” restriction (AC: deprioritize within 14 days, not exclude)
- BE
  - When poll closes, write team_restaurants.last_visited_at and increment times_visited.
  - In GET /api/polls/:id, flag each suggestion recent=true if last_visited_at within 14 days.
  - Sorting function pushes recent below non-recent at equal votes/time.
- FE
  - “Recent” badge on list items.
- QA
  - Verify flag and sort order across edge cases (no history, first visit, borderline 14 days).

C4. Dietary compatibility influence (AC: warn-only badges; per-team roll-up)
- BE
  - Compatibility service: restaurant.cuisine_tags vs team dietary tags → 'ok' | 'warn' | 'unknown'.
  - Include compatibility flag in suggestions payload.
- FE
  - Badge rendering (OK/Warn/Unknown) with tooltip “best effort”.
- QA
  - Tests: various tag combos; ensure no exclusion in MVP.

Epic D: Voting and decisioning

D1. Create a poll (AC: set close time, max walk; suggestions open until close)
- DB/BE
  - POST /api/polls (persist constraints_json { max_walk_minutes, recency_days:14, dietary_mode:'warn', include_unknown_time:true }; status=open).
  - GET /api/polls/:id (return poll, suggestions with flags, totals).
  - Auto-close job: Vercel Cron every minute to close overdue polls or transition in request path if fetched after close_time.
- FE
  - Start Poll modal (close time default +10 min; slider for walk cap).
  - Poll shell with countdown timer.
- QA
  - E2E: create poll → confirm open, accepts suggestions and votes until close_time.

D2. Upvote/pile-on (AC: one upvote per user per restaurant; change before close)
- BE
  - POST /api/polls/:id/votes (upsert vote; enforce UNIQUE(poll_id,user_id,restaurant_id)).
  - DELETE /api/polls/:id/votes/:restaurantId (remove vote).
  - Return aggregate totals map on each vote response.
- FE
  - Vote button with active state; allow multiple restaurants; undo.
  - 5-second polling to refresh totals and time remaining.
- QA
  - Concurrency tests (two votes at once); permissions (team members only); late vote rejected after close.

D4. Sorting and viewing during poll (AC: sort by votes, then time, dietary, recency)
- BE
  - Implement deterministic sort on API or FE; include walkTimeSeconds and flags to support it.
- FE
  - Default “Top” sort; optional toggles for distance sort as a stretch.
- QA
  - Sorting correctness tests with mixed data, including unknown times.

D5. Show results and tie-break (AC: clear winner; documented tie-break)
- BE
  - POST /api/polls/:id/close: apply hard filter, compute winners; if tie, random by stored seed; persist winner_restaurant_id; update team_restaurants.
  - Rationale object in response (votes, tieBreak:'random', seed).
- FE
  - Results page: winner card, rationale, “Open in Maps”.
- QA
  - Tie scenarios test; verify seed stored and displayed.

Epic E: History and reviews

E1. Display team history (AC: date, winner, vote counts, participants count)
- BE
  - GET /api/teams/:id/history (list of polls with winner, counts, participants, last_visited/time_visited).
- FE
  - History page with filters by date range.
- QA
  - Verify counts and participants for closed polls; pagination if needed.

E2. Review ex post facto (AC: 1–5 rating + short comment; team-internal)
- BE
  - POST /api/polls/:id/reviews (rating 1–5, optional comment).
  - Aggregate average rating per team_restaurant for display in future polls/history.
- FE
  - Review dialog on results page and history entries; show aggregate rating badge.
- QA
  - Validation tests for rating bounds; visibility limited to team.

Cross-cutting (security, privacy, observability, performance)

Security and privacy
- Auth.js EmailProvider setup; secure cookie sessions; CSRF protection.
- Invite tokens: signed, time-limited; one-time use.
- RBAC checks on every API route; return 403/404 appropriately.
- PII minimization in logs; dietary tags visible only to team.

Rate limiting and caching
- Implement per-IP and per-user rate limits for /places and /directions (e.g., 60/min) using Redis.
- Overpass call debounce per team/query (≥ 10s); ORS batch limit (top 15) per request.

Observability
- Add request_id middleware and structured logging.
- Metrics counters: time_to_decision_ms, participation_rate, overpass_errors, ors_errors, cache_hit_rate, pct_unknown_times.
- Dashboards and alerts for external API error spikes and DB saturation.

Performance and degradation
- Prefetch ORS times for top 15 visible; lazy other items.
- Fallback to straight-line estimates when ORS fails; display “~”.
- Serve stale cached Overpass results with “stale” badge if provider down.

Infrastructure and setup

Environment and deployments
- Vercel project (EU); connect GitHub; preview and prod environments.
- Supabase (EU) and Upstash (EU) instances; env vars in Vercel.
- Vercel Cron: close overdue polls hourly/minutely; nightly cache cleanup.

CI/CD and quality
- GitHub Actions: typecheck, unit tests, integration tests (recorded fixtures), Playwright E2E on preview deployment.
- Seed script to create a sample team, users, and a few OSM restaurants for local dev.

Testing matrix (tie to ACs)
- A1/A2/A3: access control, invite flows, dietary visibility.
- B1/B2: Overpass adapter correctness and de-dup.
- C1: ORS matrix and fallback; winner exclusion when > cap.
- C3/C4: recent and compatibility flags + sort effects.
- D1/D2/D4/D5: voting rules, 5-second totals polling, tie-break determinism.
- E1/E2: history composition and review aggregation.

Cutlines if schedule tight (lower priority)
- History filters and ratings aggregation badge (show raw reviews first).
- Multi-cuisine chip presets; keep only free-text cuisine search.
- Map tile theming (use default OSM tiles).

If you want, I can turn this into ~30 GitHub issues with labels (FE/BE/DB/INFRA/QA) and dependencies noted.