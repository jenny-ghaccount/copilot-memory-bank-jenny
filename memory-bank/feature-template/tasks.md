# Implementation Tasks

## Epic A: Teams and Membership

### A1. Create and manage team ⏳
**AC**: Create team, set/edit meeting point, private team access
- [ ] **DB**: Create tables (users, teams, team_members) + PostGIS indexes
- [ ] **BE**: POST/GET/PATCH /api/teams with validation
- [ ] **FE**: Team create page with map picker (Leaflet + OSM)
- [ ] **QA**: Meeting point validation, non-member access blocked

### A2. Invite and manage members ⏳
**AC**: Invite via link/email, leave/remove members, immediate updates
- [ ] **BE**: POST /api/invites (signed tokens), accept endpoint
- [ ] **BE**: DELETE /api/teams/:id/members/:userId (organizer only)
- [ ] **FE**: Invite dialog with email input, member management UI
- [ ] **QA**: Token expiration, role enforcement

### A3. Dietary preferences ⏳
**AC**: Store dietary tags, visible to team only
- [ ] **BE**: PATCH /api/users/me (update dietary_tags[])
- [ ] **FE**: Multi-select dietary preferences modal
- [ ] **QA**: Tag persistence, team-only visibility

## Epic B: Restaurant Discovery

### B1. Search by name ⏳
**AC**: Name search returns details, de-duplication
- [ ] **BE**: Overpass adapter for name search within bbox
- [ ] **BE**: GET /api/places/search with 12h Redis cache
- [ ] **FE**: Search field with results list, "Add" buttons
- [ ] **QA**: Overpass fixtures, de-dup within polls

### B2. Search by cuisine ⏳
**AC**: Cuisine search → top N nearby, multi-select add
- [ ] **BE**: Overpass cuisine search (amenity=restaurant AND cuisine~term)
- [ ] **FE**: Cuisine chips + search, multi-select interface
- [ ] **QA**: Bbox limits, cuisine tag display

## Epic C: Constraints & Filters

### C1. Walking time constraints ⏳
**AC**: Max walk cap, compute walking times
- [ ] **BE**: ORS Matrix adapter with 24h cache + fallback
- [ ] **BE**: Hard filter at winner selection (exclude > cap)
- [ ] **FE**: Max walk slider (5-20 min) in poll creation
- [ ] **QA**: ORS fixtures, fallback accuracy, cap enforcement

### C2. Recency tracking ⏳
**AC**: Deprioritize within 14 days (soft constraint)
- [ ] **BE**: Update team_restaurants on poll close
- [ ] **BE**: Flag recent=true in poll suggestions
- [ ] **FE**: "Recent" badge on list items
- [ ] **QA**: Flag accuracy, sort order with edge cases

## Epic D: Voting & Results

### D1. Create polls ⏳
**AC**: Set close time, max walk, accept suggestions until close
- [ ] **BE**: POST /api/polls with constraints_json
- [ ] **BE**: Auto-close via Vercel Cron (every minute)
- [ ] **FE**: Start poll modal with countdown timer
- [ ] **QA**: E2E poll lifecycle

### D2. Voting system ⏳
**AC**: One upvote per user per restaurant, change before close
- [ ] **BE**: POST/DELETE /api/polls/:id/votes with totals
- [ ] **FE**: Vote buttons with active state, 5s polling
- [ ] **QA**: Concurrency tests, late vote rejection

### D3. Results & tie-breaking ⏳
**AC**: Clear winner, documented tie-break
- [ ] **BE**: POST /api/polls/:id/close with random seed
- [ ] **FE**: Results page with rationale, "Open in Maps"
- [ ] **QA**: Tie scenarios, seed storage

## Epic E: History & Reviews

### E1. Team history ⏳
**AC**: Date, winner, vote counts, participant count
- [ ] **BE**: GET /api/teams/:id/history
- [ ] **FE**: History page with date filters
- [ ] **QA**: Accurate counts, pagination

### E2. Post-lunch reviews ⏳
**AC**: 1-5 rating + comment, team-internal
- [ ] **BE**: POST /api/polls/:id/reviews
- [ ] **FE**: Review dialog, aggregate rating display
- [ ] **QA**: Rating bounds, team visibility

## Cross-Cutting Concerns

### Security & Infrastructure ⏳
- [ ] Auth.js EmailProvider setup
- [ ] RBAC middleware on all routes
- [ ] Rate limiting (Redis-based)
- [ ] Vercel + Supabase + Upstash (EU) setup

### Testing & CI/CD ⏳
- [ ] Unit tests with recorded API fixtures
- [ ] Playwright E2E on preview deployments
- [ ] GitHub Actions pipeline
- [ ] Local dev seed script

**Legend**: ⏳ = Not Started | 🟡 = In Progress | ✅ = Complete