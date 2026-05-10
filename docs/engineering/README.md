# Engineering docs

Reference docs for the Synth Tree engineering team.

| Doc | What's in it |
|---|---|
| [`local-auth.md`](./local-auth.md) | Local Firebase setup, env-var layout, and how to create / seed test users via the API's CLI scripts. |
| [`database-schema.md`](./database-schema.md) | Walkthrough of the Prisma schema (Users, Courses, SkillTrees, SkillNodes, LessonBlocks, Quizzes) with the rationale for each model and relation. |
| [`database-migrations.md`](./database-migrations.md) | How to author, run, and review Prisma migrations locally and in CI. |
| [`infra-flatten-migration.md`](./infra-flatten-migration.md) | One-time migration steps to move from the old nested-stack CDK layout to the current top-level stack layout. Read this before redeploying dev or prod for the first time after the cutover. |

For the high-level project README and quickstart, see the [root `README.md`](../../README.md). For contribution rules and branch conventions, see [`CONTRIBUTING.md`](../../CONTRIBUTING.md).
