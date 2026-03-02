# Tech Context

## Architecture Decisions
- **Platform**: Next.js (App Router) + TypeScript + MUI
- **Hosting**: Vercel (EU region)
- **Database**: Supabase Postgres + PostGIS (EU region)
- **Cache**: Upstash Redis (EU region)
- **Authentication**: Auth.js with email magic links only
- **Maps/Location**: OSM/Overpass for places (Germany‑first), OpenRouteService (ORS) for walking times

## Data Model
- **users** (1..N) ←→ **team_members** ←→ (1..N) **teams**
- **teams** (1..N) ←→ **polls**
- **polls** (1..N) ←→ **poll_suggestions** ←→ **restaurants**
- **polls** (1..N) ←→ **poll_votes** ←→ **users**
- **teams** (1..N) ←→ **team_restaurants** ←→ **restaurants**
- **reviews**: user → (poll, restaurant) after close

## Key Technical Constraints
- EU-first data residency (GDPR compliance)
- Walking-focused distance calculations (4.5 km/h fallback)
- Rate limiting on external APIs (60/min per user)
- 12-hour cache TTL for restaurant data
- 24-hour cache TTL for walking time calculations

## External Dependencies
- **Overpass API**: Restaurant discovery and details
- **OpenRouteService**: Walking time calculations with fallback
- **Auth.js**: Email-based authentication
- **PostGIS**: Geospatial queries and indexing

## Performance Requirements
- Poll list loads within 1.5 seconds for 50 suggestions
- 5-second polling for vote totals (no SSE in MVP)
- Prefetch walking times for top 15 visible restaurants
- Graceful degradation when external APIs fail