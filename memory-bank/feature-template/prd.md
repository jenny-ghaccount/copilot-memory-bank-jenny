# Team Lunch App - PRD

## Problem Statement
Teams waste time deciding where to go for lunch. Decisions often ignore distance/time, price, dietary needs, and recency ("we were just there"), leading to sub‑optimal choices and lower participation.

## Goals
- Help a team pick a lunch spot quickly and fairly
- Incorporate constraints: walking time/distance, price, dietary restrictions, and how recently a place was visited
- Keep team history to avoid repeats and inform future choices
- Make participation lightweight and inclusive

## Success Metrics (MVP)
- Time to decision: median ≤ 3 minutes from "start vote" to "winner selected"
- Participation: ≥ 70% of active team members cast a vote at least once per week
- Repeat avoidance: ≤ 20% of selections are repeats within 2 weeks (if restriction is set)
- Satisfaction (post‑lunch thumbs‑up): ≥ 80% positive
- Accuracy coverage: ≥ 90% of suggestions display distance, price tier, and basic cuisine tags

## Key User Stories

### Epic A: Team Management
- **A1**: As an organizer, I want to create a team and set a home location so the app can calculate walking time
- **A2**: As an organizer, I want to add/remove people so the voter list stays accurate
- **A3**: As a team member, I want to set my dietary restrictions so suggestions consider my needs

### Epic B: Restaurant Discovery
- **B1**: As a team member, I want to suggest a specific restaurant
- **B2**: As a team member, I want to suggest a style so the app pulls candidates

### Epic C: Smart Constraints
- **C1**: As an organizer, I want to set max walking time so options fit our schedule
- **C2**: As an organizer, I want to deprioritize places we've been to recently
- **C3**: As a team member, I want dietary needs to influence suggestions

### Epic D: Voting & Results
- **D1**: As an organizer, I want to start a poll for today's lunch
- **D2**: As a team member, I want to upvote existing suggestions
- **D3**: As a team member, I want to see a clear winner with transparent tie-breaking

### Epic E: History & Reviews
- **E1**: As a team member, I want to see where we've gone and when
- **E2**: As a team member, I want to rate and comment after lunch