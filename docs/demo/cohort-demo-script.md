# Synth Tree — Cohort Demo Script

A click-through script for the end-of-cohort stakeholder demo. It is written for **one presenter**
sharing their screen and runs on the **deployed dev environment**, not localhost:

| Surface     | URL                                                                    | Sign in as          |
| ----------- | ---------------------------------------------------------------------- | ------------------- |
| Learner app | [dev.synth-tree.com](https://dev.synth-tree.com)                       | `learner@local.dev` |
| Admin       | [admin.dev.synth-tree.com](https://admin.dev.synth-tree.com)           | `admin@local.dev`   |
| API         | [api.dev.synth-tree.com/health](https://api.dev.synth-tree.com/health) | —                   |

Both accounts use the seeded dev password `Local123!` (see `docs/engineering/local-auth.md`).

The demo covers five segments: opening → new learner signs up → returning learner learns →
instructor authors content → under the hood. Target length is about 20–25 minutes.

> The previous cohort's localhost script is in this file's git history (`git log -- docs/demo/cohort-demo-script.md`).

---

## 0. Pre-flight checklist

Do this before the call, then do one full dry run.

1. **Freeze merges to `development`** at least an hour before the demo. Every merge redeploys dev and
   restarts the API.
2. **Check the deploy is green.** The latest _Deploy Orchestrator_ run on `development` should have
   succeeded with API, Admin, and Client deployed. Then open
   [api.dev.synth-tree.com/health](https://api.dev.synth-tree.com/health) and confirm it returns ok.
3. **Reset the demo data.** Follow [Appendix A](#appendix-a--resetting-the-dev-demo-data). Do this
   **after** your dry run, because the dry run changes the data. Re-seeding recreates the courses
   with **new IDs**, so do step 4 afterwards.
4. **Grab the lesson-editor link.**
   - In the learner app, click **Resume** on the Continue card. That opens _Functional Groups_.
   - Copy the node ID from the URL, which looks like `/courses/<courseId>/nodes/<nodeId>`.
   - Press **Back**. **Don't** click _Finish lesson_.
5. **Open the tabs**, all signed in ahead of time:
   1. **Tab A: an incognito or guest window** on `dev.synth-tree.com/auth/signup`, for the signup
      segment. Have a fresh throwaway email ready, e.g. `demo-0930@example.com`. The password
      needs at least 10 characters.
   2. **Tab B:** the learner app, signed in as `learner@local.dev`.
   3. **Tab C:** the admin app, signed in as `admin@local.dev`, on **Courses**.
   4. **Tab D:** the admin lesson editor at `admin.dev.synth-tree.com/lessons/<nodeId>/edit`, using
      the node ID from step 4.
6. **Set up the display:** light mode, regular density, and a browser window **at least 1024px
   wide** (the admin Course Builder switches to tabs below that).

**Starting state after a reset.** `learner@local.dev` has:

- 4 lessons done across three courses;
- _Functional Groups_ in progress;
- **250 XP**, ranked **#5** of 8 on the leaderboard;
- a **4-day streak**, last active yesterday.

The seed also creates seven classmates for the leaderboard, with between 700 and 50 XP.

---

## 1. What this cohort shipped (feature → PR map)

Use this to credit the work; you don't need to read it aloud.

| Area         | Feature                                                    | PR · author            |
| ------------ | ---------------------------------------------------------- | ---------------------- |
| Onboarding   | Sign up step 1 (account)                                   | #73 · Nick             |
| Onboarding   | Learner sign-in page                                       | #93 · Alfonso          |
| Onboarding   | Sign up step 2 — interests picker                          | #97 · Alfonso          |
| Onboarding   | Sign up step 3 — daily goal + onboarding redirect          | #121 · Alfonso         |
| Learner home | "Continue where you left off" card                         | #106 · David           |
| Skill tree   | Learner course-tree GraphQL query                          | #90 · Da In            |
| Skill tree   | SVG skill tree canvas (hexes + bezier edges)               | #114 · Andrew          |
| Skill tree   | Node states + click navigation; course detail page         | #124, #125 · Josh      |
| Lessons      | Multi-page lessons                                         | #95 · Alfonso          |
| Lessons      | Video + embed blocks                                       | #86 · Komeh            |
| Lessons      | Lesson page shell + read-mode typography                   | #126, #127 · Josh      |
| Quizzes      | Quiz submission + server-side grading                      | #94, #99 · Ernest      |
| Quizzes      | Results + retry                                            | #91 · Komeh            |
| Quizzes      | Single- and multiple-choice question UI                    | #119 · Joyce           |
| Quizzes      | Fill-in-the-blank question type                            | #113 · Alfonso         |
| Progress     | Mark lesson completed when its quiz passes                 | #103 · Da In           |
| Gamification | Award XP on lesson completion + quiz pass                  | #116 · Da In           |
| Gamification | Daily streaks (per-user timezone, DST-safe)                | #123 · Da In           |
| Gamification | Daily quests backend; "Earn 50 XP" quest                   | #96, #122 · Komeh      |
| Gamification | Hearts model with refill-on-read                           | #101 · Andrew          |
| Gamification | Global leaderboard + your rank                             | #102 · Sorim           |
| Admin        | 3-pane Course Builder                                      | #89 · Ben              |
| Admin        | New-course modal + create flow                             | #100 · Ben             |
| Admin        | Drag nodes to reposition (persists)                        | #115 · Alfonso         |
| Admin        | Block-based lesson editor                                  | #98 · Joyce            |
| Platform     | CI that actually gates PRs + Postgres-backed API tests     | #112 · Daniel Q.       |
| Platform     | README refresh                                             | #87 · Andrew           |
| Platform     | Dev + prod environments, deploy pipeline, dev data seeding | #104–#111, #128 · Josh |

---

## 2. Segment 1 — Opening (~1 min)

> _"Last cohort we demoed on a laptop. This cohort, Synth Tree is live: everything you'll see runs
> on our dev environment at dev.synth-tree.com. Every merge is checked by CI and deployed
> automatically, with a matching production environment."_

Transition: _"Let's start where every learner starts."_

---

## 3. Segment 2 — A new learner signs up (~3 min) · Tab A

1. **Step 1, account.** Fill in a name, the throwaway email and a password → **Continue**. This
   creates a real Firebase account. (#73)
2. **Step 2, interests.** Pick Chemistry and Physics → **Continue**. (#97)
3. **Step 3, daily goal.** Pick **15 minutes a day** and finish signup. You land on Home. (#121)
   - _"A brand-new learner has no progress yet,"_ so there's no Continue card. Point out the
     **Browse catalog** button and the published course grid.
4. Click **Browse catalog** to show the catalog grid.
5. _Optional:_ if a learner leaves partway through signup, they're sent back to finish it the next
   time they sign in. (#121)

Transition: _"Now a learner who's been at it for a few days."_

---

## 4. Segment 3 — A returning learner learns (~8 min) · Tab B

This is the core of the demo, and everything in it is new since the last one.

1. **Home.**
   - **Continue where you left off** shows _Functional Groups · Organic Chemistry_. (#106)
   - Scroll to **Recommended next**. It shows _Energy & Work_ and _Organelles_, which are the next
     unlocked lessons in courses they've started.
   - Point at the course grid below.
2. **Open Organic Chemistry** from the course grid. This is the course page with the **skill tree**.
   (#114, #124, #125)
   - **Node states:** _Atoms & Bonding_ is completed (green), _Functional Groups_ is in progress
     (blue), and the rest are locked (grey). Solid edges show the path unlocked so far.
   - **Sidebar:** course progress (1/7 chapters) and **Continue learning**.
   - **Click a locked node**, e.g. _Reaction Mechanisms_. A toast says _"Complete prerequisites
     first."_
3. **Click Continue learning.** It opens _Functional Groups_. (#126)
   - Point out the course · chapter breadcrumb, the page progress bar and the Previous / Continue
     controls.
   - Click **Finish lesson**. You're back on the tree:
     - _Functional Groups_ is now green;
     - **Isomerism** and **Nomenclature** have unlocked, and their edges turned solid;
     - progress reads 2/7.
   - _"That lesson just earned 50 XP and extended a 4-day streak to 5, in the background."_ (#116, #123)
4. **Open Atoms & Bonding** by clicking its green hex. It's a multi-page lesson. (#95, #127)
   - **Page 1:** formatted reading with a subheading, a **callout**, and a **diagram with a
     caption**. (#127)
   - **Continue → page 2:** an embedded **video**. (#86)
   - **Continue → page 3:** the **quiz**. It has three question types: single choice, multiple
     choice, and fill-in-the-blank. (#119, #113)
5. **Take the quiz. Answer the multiple-choice question wrong on purpose** first (leave out
   _Triple_). Submit.
   - Each answer is marked right or wrong, with its **explanation**.
   - A **"Keep practicing"** banner appears. (#91, #119)
   - _"Grading happens on the server. The answers and explanations aren't sent to the browser
     until you've submitted."_
   - Click **Retry** and answer correctly. The answer key is below. Submit → **"You passed!"**
     (+100 XP). (#94, #103)
   - Click **Finish lesson**.
6. **Leaderboard** (top nav → _Leaderboard_). (#102)
   - The learner's row is highlighted: **400 XP**, a **5-day streak**, and **Your Rank #3**, up
     from #5 at the start.
   - _"Everything we just did moved them up past two classmates."_
7. **Profile.** Edit the display name → **Save**. Stay on light mode. If you want to show dark mode,
   toggle it on Home, not on the leaderboard.
8. _Optional, mobile:_ press Cmd+Shift+M in DevTools. Show the hamburger menu and the bottom tab
   bar (Home / Profile).

**Answer key: Atoms & Bonding quick check**

| Question                                                  | Answer                                    |
| --------------------------------------------------------- | ----------------------------------------- |
| How many covalent bonds does a neutral carbon atom form?  | **4**                                     |
| Which of these are types of covalent bonds?               | **Single, Double, Triple** (not Magnetic) |
| A carbon at the end of a triple bond is \_\_\_-hybridized | **sp** (any case or spacing)              |

Transition: _"That's the learner side. Here's how an instructor builds it."_

---

## 5. Segment 4 — An instructor authors content (~6 min) · Tabs C–D

1. **Courses** (Tab C).
   - Status badges show 3 published courses and 2 drafts.
   - Use the **filter pills** (Published → Draft → All) and the **grid ↔ list** toggle.
2. **Create a course.** Click **Create Course**, give it a title and description, and submit the
   **new-course modal**. It opens the **Course Builder**. (#100)
   - _"The empty canvas is where adding nodes lands next (SYN-65)."_
   - Go back to Courses → **⋯ → Delete** your new course to show the confirm dialog.
3. **Open Organic Chemistry → Course Builder**, which has three panes: Meta, Tree, and Inspector. (#89)
   - **Meta:** edit the description, then click away. It saves automatically.
   - **Tree:** **drag a node** to a new spot, then refresh. The position is saved. (#115)
   - _Optional:_ refresh the course page in Tab B. The learner's tree shows the new layout.
4. **Lesson editor** (Tab D, _Functional Groups_). (#98)
   - Edit the text, **add a text block**, **drag to reorder**, then **Save lesson**.
   - In Tab B, reopen _Functional Groups_ from the tree. The learner sees the change immediately.
5. _Optional:_ **admin leaderboard.** Type `/leaderboard` into the admin URL. It shows the same XP
   data from the admin side.
6. _Optional:_ **theme.** Toggle dark mode and density **on the Course Builder**, not the Courses
   list, then switch back.

---

## 6. Segment 5 — Under the hood (~2 min)

Narrate this, or use a slide. The dev GraphQL sandbox needs a Firebase token, so skip it live.

- **Gamification engine:**
  - XP is awarded exactly once per lesson and per quiz, inside the same transaction as completion.
  - Streaks follow each learner's local day and handle daylight-saving changes.
  - **Daily quests** ("Earn 50 XP", "Complete 2 lessons", "Get 100% on a quiz") and **hearts** are
    built on the API. Their UI is next. (#96, #122, #101)
- **Security hardening:** quiz answer keys and explanations stay hidden until a learner has
  attempted the quiz, including against crafted queries.
- **Engineering:**
  - CI now blocks merges on lint, type-check, builds and API tests, run against a real Postgres
    database (#112).
  - Separate dev and prod environments, deployed from `development` and `main` (#104–#111).

---

## 7. Closing (~1 min)

> _"This cohort took Synth Tree from a local prototype to a deployed product. Learners can sign up,
> move through a real skill tree, study multi-page lessons, take graded quizzes of three types, and
> earn XP and streaks on a live leaderboard. Instructors can create courses, lay out trees, and edit
> lessons. It's all running on production-grade infrastructure with CI that actually gates."_

**What's next** (in flight):

- quiz authoring in the admin editor (SYN-72, #129);
- admin analytics (SYN-79);
- achievements (SYN-42, #118);
- XP and streak pills in the top bar (SYN-44);
- adding nodes in the builder (SYN-65).

---

## 8. Avoid-list (don't click these live)

**Learner app**

- **Nav stubs:** **Dashboard**, **Lessons** and **Skill Trees** in the top nav are placeholders.
  The mobile **Catalog** tab also opens a placeholder. (SYN-132)
- **Recommended next → "Vectors":** it belongs to a **draft** course and opens "Course not found".
  (SYN-130)
- **Isomerism quiz:** it's an open-response question that waits for manual review, which doesn't
  exist yet. There's no retry.
- **Leaderboard in dark mode:** hard to read. (SYN-133)
- **Profile stat tiles:** they don't show real numbers yet. (SYN-134)
- **Forgot password:** disabled.

**Admin**

- **Avatar → Profile:** opens a blank page. (SYN-135)
- **Clicking nodes in the Course Builder:** does nothing yet. The **Inspector** pane is static text.
- **Lesson editor on Atoms & Bonding:** it hides that lesson's image, page break and video. Stick to
  _Functional Groups_.
- **Disabled block types:** Heading, Image, Video, Embed and **Preview** are disabled "coming soon"
  buttons.
- **Courses list in dark mode:** looks rough. (SYN-137)
- **Deleting a seeded course:** there's no restore UI, so you'd need to re-seed.
  **Also don't unpublish Organic Chemistry.**
- **Google sign-in on admin:** new Google users get the learner role and can't load courses.

**General**

- **Don't merge to `development` near the demo.** Each merge redeploys dev.

---

## Appendix A — Resetting the dev demo data

`pnpm db:seed:demo` (`apps/api/scripts/seedDemoContent.ts`) can be re-run, and it doubles as a
reset button. It:

- deletes and recreates all demo courses, so any admin edits are undone and **the IDs change**;
- recreates the seven classmates;
- resets `learner@local.dev`'s progress, XP and streak to the starting state above.

It only touches Postgres; Firebase accounts are unaffected. It **does not** remove learner accounts
created during a signup rehearsal. Those are harmless.

> ⚠️ Only ever point this at **dev**. Every name below contains `synth-tree-dev`. Running it against
> prod would replace real course content.

You need AWS access to the dev account (**516217144302**, `us-east-1`), the AWS CLI with the
**Session Manager plugin**, `psql`, Node, and a `development` checkout with `pnpm install` done. Use
two terminal tabs. The tunnel uses local port **5433**, so it won't collide with a local Postgres on 5432.

**1. Pick the AWS profile** in both tabs, and confirm the account is `516217144302`. If you get a
token or expiry error, run `aws sso login` first.

```bash
export AWS_PROFILE=<your-profile> AWS_REGION=us-east-1
aws sts get-caller-identity
```

**2. Tab 1: open the tunnel through the bastion host.** Leave it running once it prints
`Waiting for connections...`.

```bash
BASTION_ID=$(aws cloudformation describe-stacks --stack-name synth-tree-dev-Database \
  --query "Stacks[0].Outputs[?OutputKey=='BastionInstanceId'].OutputValue" --output text)
DB_HOST=$(aws ssm get-parameter --name /synth-tree/synth-tree-dev/database/endpoint \
  --query Parameter.Value --output text)
aws ssm start-session --target "$BASTION_ID" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters "{\"host\":[\"$DB_HOST\"],\"portNumber\":[\"5432\"],\"localPortNumber\":[\"5433\"]}"
```

**3. Tab 2: build `DATABASE_URL` from Secrets Manager.** The password is URL-encoded and never
printed.

```bash
export DATABASE_URL=$(aws secretsmanager get-secret-value \
  --secret-id synth-tree-dev/database/credentials --query SecretString --output text \
  | node -e 'const s=JSON.parse(require("fs").readFileSync(0,"utf8"));process.stdout.write(`postgresql://${encodeURIComponent(s.username)}:${encodeURIComponent(s.password)}@localhost:5433/synthtree`)')
```

**4. Check the connection.** Both seeded accounts should be listed. If `learner@local.dev` is
missing, the seed skips the learner's progress. It's recreated when the dev API restarts
(`seedDevUsers`).

```bash
psql "$DATABASE_URL" -c "select email, role from \"User\" where email in ('admin@local.dev','learner@local.dev');"
```

**5. Run the seed** from the repo root. It should list the courses, then seven `classmate …` lines,
then `learner@local.dev: 250 XP, 4-day streak`, then `✅ Demo content seeded.`

```bash
cd apps/api && pnpm db:seed:demo
```

**6. Clean up.** Press Ctrl-C in tab 1 to close the tunnel, then run `unset DATABASE_URL` in tab 2.
Then redo pre-flight step 4, because the node IDs changed.

**Troubleshooting**

- **`TargetNotConnected`:** the bastion host is stopped or its SSM agent isn't registered. Check the
  instance tagged `synth-tree-dev-bastion-host` in the EC2 console.
- **`AccessDenied`:** your profile lacks SSM, Secrets Manager or CloudFormation permissions in that
  account.
- **Seed output looks wrong:** re-run it. Every run starts from a clean slate.

---

## Appendix B — Local fallback (if dev is down)

```bash
git checkout development && git pull && pnpm install
pnpm db:start && pnpm db:migrate:dev
pnpm db:seed:local-users   # admin@local.dev + learner@local.dev (Local123!)
pnpm db:seed:demo          # same demo data as dev
pnpm dev                   # API :4000, admin :5173, learner :5174
```

Then follow the same script, using `localhost:5174` in place of dev.synth-tree.com and
`localhost:5173` in place of admin.dev.synth-tree.com.
