# Admin analytics (SYN-79)

## Request flow

The admin Analytics page sends ADMIN_ANALYTICS_QUERY through Apollo. GraphQL validates its enum argument and selected fields against the schema. The Pothos resolver checks authentication and admin access, then calls getAdminAnalytics. That service checks its cache and uses Prisma to read PostgreSQL. Apollo renders the returned metrics in four cards.

Pothos is the schema source of truth. Do not hand-edit apps/api/src/graphql/schema.graphql or packages/api-types/src/graphql.ts; regenerate them using the API codegen script.

## API contract

Each metric is a non-null object with nullable Float fields: current, previous, percentChange. Float supports both whole counts and future fractional durations/rates. A null current value means unavailable, not zero activity.

Public enum values SEVEN_DAYS, THIRTY_DAYS, NINETY_DAYS and ALL map to internal 7d, 30d, 90d and all. Omitting the argument defaults to 7d. Invalid enum values and explicit null are rejected before resolver execution.

Percentage change is (current - previous) / previous \* 100, rounded to one decimal. Previous = 0 produces null, including when current = 0. Unavailable values also produce null.

## Metric definitions and limitations

- Active learners: count User rows with role USER and at least one qualifying progress timestamp, XP event, or quiz attempt in the window. Counting users with OR/some relation filters avoids counting the same learner multiple times. Profile edits alone and admins do not count. NOT_STARTED progress rows are excluded.
- Progress activity: createdAt, updatedAt, or completedAt on started/completed progress. createdAt retains the initial activity when updatedAt moves to a later period. This is the activity history available in the current model: intermediate progress updates are not retained, and manual progress edits cannot be distinguished from learning activity. Exact historical event analytics would require append-only activity tracking. XP events and quiz attempts preserve their individual timestamps.
- Lessons completed: COMPLETED UserNodeProgress rows for USER accounts, filtered by completedAt. One node is the unit of lesson completion in this application. An updatedAt change does not move an old completion into the current period.
- Average session and course completion: all fields are null, as explicitly permitted in the PR review. Session duration is not tracked. A course completion denominator/cohort is not agreed. The UI displays Not available instead of fabricated values.
- Windows: rolling 7/30/90 times 24 hours, not calendar dates. Use [start, end), meaning inclusive start and exclusive end. Capture one now for the request so boundary events cannot fall into both periods. Future timestamps are excluded.
- All time: no lower date bound, with previous and percentChange null because there is no preceding comparable period. This is an implementation convention to confirm during review.

## Caching and consistency

The in-process cache is keyed by Prisma client and range. Authentication runs before cache access. Entries expire 60 seconds after computation finishes. A repeatable-read transaction keeps all counts on one database snapshot. Each server process has its own cache; this is not a shared distributed cache. The frontend uses network-only so switching back to a range still checks the server's TTL instead of retaining an older Apollo result indefinitely.

## Verification

From apps/api:

- pnpm generate
- pnpm codegen
- pnpm type-check
- pnpm exec jest --runInBand --runTestsByPath src/services/**tests**/analytics.contract.test.ts

For database tests, start local PostgreSQL and set TEST_DATABASE_URL to its connection string. Then run:

    pnpm exec jest --runInBand --runTestsByPath src/services/__tests__/analytics.integration.test.ts

The integration suite is skipped unless TEST*DATABASE_URL is set. It accepts only localhost addresses, creates a unique analytics_test* schema, pushes the Prisma schema into that isolated namespace, and drops only that namespace afterward. It does not reset the application's public schema. The fixtures have a fixed clock and explicit dates. Independent SQL counts are compared with hand-counted expected results and the real GraphQL response. Cases cover all ranges, duplicate activity sources, admins, profile edits, NOT_STARTED rows, current/previous boundaries, future events, old data beyond five years, null metrics, zero denominators, authorization, invalid input, and cache expiry.

From apps/admin-dashboard, run pnpm type-check and pnpm build. To check the UI with a real admin session, open /analytics, switch through all four ranges, and compare the displayed counts and previous values with the seeded expectations. Loading hides the old range's values; request failures show a retry button.

## Explaining the implementation in review

1. Why separate the resolver and service? The resolver owns the GraphQL contract and authorization. The service owns calculations and cache behavior, making database tests possible without HTTP or Firebase login.
2. What does Prisma some mean? There exists at least one related row satisfying the filter. OR allows any activity source to qualify; the outer user count counts each learner once.
3. Why not User.updatedAt? A profile edit is not evidence of learning. Its timestamp belongs to the account, not learner activity.
4. Why not use updatedAt for completions? Editing a completed progress row would incorrectly change when the completion is counted.
5. Why null instead of zero? Zero claims a measurement. Null preserves the distinction between no activity, unavailable instrumentation, and an undefined percentage comparison.
6. What does codegen prove? The frontend query agrees with the generated API schema. It does not prove the metrics are correct; seeded database and SQL comparisons serve that purpose.
7. Why not implement session duration from completion minus creation? That interval can include hours or days away from the application. It is elapsed lesson time, not measured active session time.
8. What remains a limitation? Progress timestamps are mutable, role filtering uses the user's current role, cached results may lag by one minute, and two metrics are unavailable by design.
