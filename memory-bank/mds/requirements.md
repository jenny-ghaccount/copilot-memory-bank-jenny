Great start. I turned your list into a structured PRD with user stories and acceptance criteria you can copy into your doc and iterate on. I’ve grouped stories into epics that map directly to your bullets.

Team Lunch App – PRD (draft v0.1)

1) Problem statement
- Teams waste time deciding where to go for lunch. Decisions often ignore distance/time, price, dietary needs, and recency (“we were just there”), leading to sub‑optimal choices and lower participation.

2) Goals
- Help a team pick a lunch spot quickly and fairly.
- Incorporate constraints: walking time/distance, price, dietary restrictions, and how recently a place was visited.
- Keep team history to avoid repeats and inform future choices.
- Make participation lightweight and inclusive.

3) Success metrics (MVP)
- Time to decision: median ≤ 3 minutes from “start vote” to “winner selected.”
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
- “How busy” is best‑effort (3rd‑party “popular times” or crowd input); data may be unavailable for some places.

6) Scope
- In scope (MVP): team creation, member management, suggest by name or cuisine, distance/time estimation (walking), dietary tags, upvote/pile‑on voting, price tiers, result selection with tie‑break, history, sort/filter, “haven’t been in awhile,” post‑lunch review.
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
  - Restaurants display compatibility as “Likely compatible,” “May be compatible,” “Unknown” based on available data/cuisine heuristics.
  - Privacy: dietary tags visible to team members only.

Epic B: Restaurant discovery and suggestions
B1. Suggest by name
- Story: As a team member, I want to suggest a specific restaurant.
- Acceptance:
  - Search returns name, address, price tier ($–$$$$), distance, cuisine tags.
  - Duplicate prevention: if a suggested place already exists in the poll, it’s de‑duplicated and the previous suggestion is surfaced.
  - If data incomplete, show “Unknown” label for missing fields.

B2. Suggest by style/cuisine (“sushi”, “pizza”)
- Story: As a team member, I want to suggest a style so the app pulls candidates.
- Acceptance:
  - Free‑text cuisine entry matched to known categories; returns top N (e.g., 10) nearby.
  - Member can pick one or multiple from the list to add to the poll.
  - Results filtered by team constraints (distance/time) if enabled.

B3. Add/remove restaurants from team list
- Story: As a team member, I want to add favorites or remove places from our saved list.
- Acceptance:
  - Team “Favorites” library: add/remove visible to all team members.
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
  - If a place lacks a price tier, it’s labeled Unknown and included unless filtered out.

C3. “Haven’t been in awhile” restriction
- Story: As an organizer, I want to deprioritize or exclude places we’ve been to recently.
- Acceptance:
  - Configurable window (e.g., 7, 14, 30 days).
  - Option 1: Exclude from poll; Option 2: Include but lower default rank or add warning.
  - History records visits automatically when a poll completes.

C4. Dietary compatibility influence
- Story: As a team member, I want dietary needs to influence suggestions.
- Acceptance:
  - Poll shows compatibility score based on team members’ restrictions.
  - Organizer can choose: filter incompatible, or display a warning badge.
  - Compatibility impact is documented in the results rationale.

Epic D: Voting and decisioning
D1. Create a poll
- Story: As an organizer, I want to start a poll for today’s lunch.
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
  - Sort options: distance, price, total votes, “times been,” dietary compatibility.
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
- Story: As a team member, I want to see where we’ve gone and when.
- Acceptance:
  - History shows date, winner, vote counts, participants, and post‑lunch rating.
  - “Times been” and “last visited” available per restaurant.

E2. Review ex post facto
- Story: As a team member, I want to rate and leave a short comment after lunch.
- Acceptance:
  - Simple 1–5 rating and optional 140‑character comment.
  - Aggregate team rating displayed on future polls/history.
  - Reviews are team‑internal and not public.

Epic F: Restaurant context and busyness
F1. Show “how busy” a restaurant is (best‑effort)
- Story: As a team member, I want to know if a place is crowded now.
- Acceptance:
  - If provider has “popular times/Live busyness,” show one of: Not busy, Typical, Busier than usual, Unknown.
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
- Suggest flow: search box for name; separate “Suggest by cuisine” chip.
- Poll list: cards with name, votes, time to walk, price, compatibility, busyness badge.
- Result screen: winner at top, tie‑break message if used, “Open in Maps.”
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
- Dietary accuracy: clearly communicate “best‑effort” and allow flagging issues.

13) Open questions for you
- Single team per user or users can belong to multiple teams?
- Is organizer role required or can any member start/close a poll?
- Do you want default constraints (e.g., always enforce 10‑minute walk) at team level?
- Preferred data provider(s) for places (Google, Yelp, OSM)? Any licensing constraints?
- How strict should dietary filtering be by default (exclude vs warn)?
- Should “haven’t been in awhile” exclude by default or just deprioritize?
- Any corporate SSO needed?
- Do you want notifications (email/Slack/push) in MVP?

Mapping your original list to stories above
1. Suggest restaurants → B1
1a. Suggest styles and pull from restaurants → B2
2. How close/how much time to walk → C1
3. Pile on to existing votes → D2
4. Everyone can vote → D3
5. Dietary restrictions influence choice → A3, C4
6. Tell us how busy it is → F1
7. Vote on price point → C2
8. Show results → D5
9. Sort by distance/price/votes/times been → D4
10. Set restriction (time, distance, haven’t been) → C1, C3
11. Display team history → E1
12. Add/remove people from team → A2
13. Add/remove restaurants → B3
14. Review restaurant ex post facto → E2

If you share how you want to handle the open questions, I can tailor the acceptance criteria and add wireframe-level flows for the key screens (start poll, suggest, vote, results, history).