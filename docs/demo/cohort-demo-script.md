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

The seed and this script assume the presenter is in **New York time (America/New_York)**. See
[Timezone](#timezone) if that changes.

> The previous cohort's localhost script is in this file's git history (`git log -- docs/demo/cohort-demo-script.md`).

---

## 0. Pre-flight checklist

Do this before the call, then do one full dry run.

1. **Freeze merges to `development`** at least an hour before the demo. Every merge redeploys dev and
   restarts the API.
2. **Check the deploy is green.** The latest _Deploy Orchestrator_ run on `development` should have
   succeeded with API, Admin, and Client deployed. Then open
   [api.dev.synth-tree.com/health](https://api.dev.synth-tree.com/health) and confirm it returns ok.
3. **Reset the demo data on the day of the demo.** Follow
   [Appendix A](#appendix-a--resetting-the-dev-demo-data). Do it **after** your dry run, because
   the dry run changes the data, and on the **same New York calendar day** as the demo (any time
   before the call is fine). The learner's streak ends "yesterday", so a reset the evening before
   would leave a gap and the first XP of the demo would drop the streak to 1.
4. **Reload every open tab after a reset.** Re-seeding recreates the courses with **new IDs**, so
   old course, node and editor URLs stop working. You no longer need to copy a lesson-editor URL:
   the Course Builder opens it (Segment 4).
5. **Open the tabs**, all signed in ahead of time:
   1. **Tab A: an incognito or guest window** on `dev.synth-tree.com/auth/signup`, for the signup
      segment. Have a fresh throwaway email ready, e.g. `demo-1007@example.com`. The password
      needs at least 10 characters.
   2. **Tab B:** the learner app, signed in as `learner@local.dev`, on Home.
   3. **Tab C:** the admin app, signed in as `admin@local.dev`, on **Courses**.
6. **Set up the display:** light mode, regular density, and a browser window **at least 1024px
   wide**. The admin Course Builder switches to tabs below 1024px, and the learner's XP and streak
   pills are hidden below 768px.

**Starting state after a reset.** `learner@local.dev` ("Dev Learner") has:

- 4 lessons done across three courses, with _Functional Groups_ in progress;
- **250 XP**, ranked **#5** of 8 on the leaderboard;
- a **4-day streak**, last active yesterday;
- the **First Step**, **Week Streak** and **Polyglot** achievements. **Perfect Quiz** is held back
  so the demo earns it live.

In the learner app that looks like:

- **Navbar pills:** 🔥 **4** and ⚡ **250**.
- **Home, right rail:**
  - **Today's goal:** `0/150 XP`, with "150 XP to keep your **4-day streak**." The learner's daily
    goal is 15 minutes, which the app shows as 150 XP.
  - **Your week:** one bar per day this week (Monday to Sunday), by the browser's local day. It only
    shows this week, so the seeded days before Monday don't appear:

    | Demo day      | Seeded bars before today                     |
    | ------------- | -------------------------------------------- |
    | Monday        | none (the chart is empty until the demo)     |
    | Tuesday       | Mon 50                                       |
    | Wednesday     | Mon 50, Tue 50                               |
    | Thursday      | Mon 100, Tue 50, Wed 50                      |
    | Friday–Sunday | four bars (50, 100, 50, 50) ending yesterday |

    Either way, the live flow adds a 150 XP bar for today, which ends up the tallest.

- **Home, course cards:** Organic Chemistry **14% complete**, Foundations of Physics **67%**, Cell
  Biology **50%**.
- **Profile:** Courses **3**, Nodes **4**, Quizzes **1**.

The seed also creates seven classmates for the leaderboard, with between 700 and 50 XP.

---

## 1. What this cohort shipped (feature → PR map)

Use this to credit the work; you don't need to read it aloud.

**Round 1**

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

**Round 2**

| Area         | Feature                                                                            | PR · author       |
| ------------ | ---------------------------------------------------------------------------------- | ----------------- |
| Onboarding   | Timezone captured at signup                                                        | #147 · Da In      |
| Learner home | Today's goal card + "Your week" XP chart                                           | #133 · Alfonso    |
| Learner home | Real empty state (no placeholder courses)                                          | #139 · Ernest     |
| Learner home | Recommended next hides draft and deleted courses                                   | #138 · Alfonso    |
| Navigation   | Catalog in the top nav and mobile tab bar; stub links removed                      | #140 · Alfonso    |
| Skill tree   | Node status (completed / in progress / unlocked / locked) worked out on the server | #131 · Komeh      |
| Progress     | Course progress on Home cards + real "XP earned" in the course sidebar             | #145 · Andrew     |
| Lessons      | Lesson-finish screen with "+N XP earned" (quiz XP included)                        | #132 · Ben        |
| Gamification | XP + streak pills in the navbar, updated live                                      | #146 · David      |
| Gamification | Achievements engine + Profile → Achievements tab                                   | #118 · Sorim      |
| Profile      | Real profile stats                                                                 | #142 · Komeh      |
| Leaderboard  | Dark mode, unnamed learners, error state                                           | #137 · Alfonso    |
| Admin        | Quiz authoring in the lesson editor                                                | #129 · Alfonso    |
| Admin        | "Edit lesson" from Course Builder nodes                                            | #150 · Komeh      |
| Admin        | Analytics page (stat cards + date range)                                           | #120 · Tony       |
| Admin        | New nodes placed on the canvas's 0–100% scale                                      | #136 · Alfonso    |
| Admin        | Courses list dark mode                                                             | #134 · Alfonso    |
| Admin        | Broken Profile item removed from the avatar menu                                   | #144 · Komeh      |
| Admin        | Straight to Courses after sign-in; wrong-password error shows                      | #148 · Andrew     |
| Security     | Quiz answer-key leaks closed                                                       | #135 · Alfonso    |
| Security     | Quiz explanations can't be probed through filters or sorting                       | #143 · Komeh      |
| Security     | Private user data, draft content and internal errors hidden                        | #149, #152 · Josh |
| Platform     | Client test runner, run in CI                                                      | #141 · Komeh      |
| Platform     | API build hotfix                                                                   | #151 · Josh       |

---

## 2. Segment 1 — Opening (~1 min)

> _"Last cohort we demoed on a laptop. This cohort, Synth Tree is live: everything you'll see runs
> on our dev environment at dev.synth-tree.com. Every merge is checked by CI and deployed
> automatically, with a matching production environment."_

Transition: _"Let's start where every learner starts."_

---

## 3. Segment 2 — A new learner signs up (~3 min) · Tab A

1. **Step 1, account.** Fill in a name, the throwaway email and a password → **Continue**. This
   creates a real Firebase account and saves the browser's timezone for streaks. (#73, #147)
2. **Step 2, interests.** Pick Chemistry and Physics → **Continue**. (#97)
3. **Step 3, daily goal.** Pick **Regular (15 min / day)** → **Start learning**. You land on Home.
   (#121)
   - _"A brand-new learner has no progress yet,"_ so there's no Continue card. Point out the
     **Browse catalog** button and the course grid.
   - The right rail already works: **Today's goal** reads `0/150 XP` ("150 XP to reach today's
     goal."), and **Your week** is empty. (#133)
4. Click **Browse catalog** to show the catalog grid. The top-nav **Catalog** link goes there too.
   (#140)
5. _Optional:_ if a learner leaves partway through signup, they're sent back to finish it the next
   time they sign in. (#121)

Transition: _"Now a learner who's been at it for a few days."_

---

## 4. Segment 3 — A returning learner learns (~9 min) · Tab B

This is the core of the demo. Keep an eye on the navbar pills (🔥 streak, ⚡ XP) throughout: they
update after each step. (#146)

1. **Home.**
   - **Continue · Organic Chemistry** shows _Functional Groups_ with a **Resume** button. (#106)
   - **Right rail:** **Today's goal** is `0/150 XP`, "150 XP to keep your **4-day streak**." Below
     it, **Your week** shows this week's XP by day (what's there depends on the weekday, see
     pre-flight). (#133)
   - **Recommended next** shows _Organelles_ and _Energy & Work_, the next unlocked lessons in
     courses they've started. (#138)
   - **Courses:** each card the learner has started shows its progress: Organic Chemistry 14%,
     Foundations of Physics 67%, Cell Biology 50%. (#145)
2. **Open Organic Chemistry** from the course grid. This is the course page with the **skill tree**.
   (#114, #124, #125)
   - **Node states,** now worked out on the server (#131): _Atoms & Bonding_ is completed (green),
     _Functional Groups_ is in progress (blue), and the rest are locked (grey). Solid edges show
     the path unlocked so far.
   - **Sidebar:** **Course progress 14%**, **Chapters passed 1/7**, **XP earned 50** (real XP from
     this course, #145) and **Continue learning →**.
   - **Click a locked node**, e.g. _Reaction Mechanisms_. A toast says _"Complete prerequisites
     first."_
3. **Click Continue learning →.** It opens _Functional Groups_. (#126)
   - Point out the course · chapter breadcrumb, the page progress bar and the Previous / Continue
     controls.
   - Click **Finish lesson**. The finish screen shows **Lesson complete!** and **+50 XP earned**.
     (#132) The pills change to 🔥 **5** and ⚡ **300**: _"that lesson just extended a 4-day
     streak to 5."_ (#116, #123, #146)
   - Click **Continue**. You're back on the tree:
     - _Functional Groups_ is now green;
     - **Isomerism** and **Nomenclature** are unlocked (outlined), and their edges turned solid;
     - the sidebar reads 29%, **Chapters passed 2/7** and **XP earned 100**.
4. **Open Atoms & Bonding** by clicking its green hex. It's a multi-page lesson. (#95, #127)
   - **Page 1:** formatted reading with a subheading, a **callout**, and a **diagram with a
     caption**. (#127)
   - **Continue → page 2:** an embedded **video**. (#86)
   - **Continue → page 3:** the **quiz**. It has three question types: single choice, multiple
     choice, and fill-in-the-blank. (#119, #113)
5. **Take the quiz. Answer the multiple-choice question wrong on purpose** first (leave out
   _Triple_). Click **Submit quiz**.
   - Each answer is marked **Correct.** or **Incorrect.**, with its **explanation**.
   - A **"Keep practicing"** banner says 1 question was incorrect. No XP is awarded. (#91, #119)
   - _"Grading happens on the server. The answer key and explanations aren't sent to the browser
     until you've submitted, and we closed the ways around that this round."_ (#135, #143)
   - Click **Retry** and answer everything correctly (answer key below). **Submit quiz** →
     **"You passed!"**. ⚡ becomes **400**. (#94, #103)
   - Click **Finish lesson**. The finish screen shows **+100 XP earned**: the quiz-pass XP, since
     the lesson itself was already complete. (#132) Click **Continue**. The sidebar now reads
     **XP earned 200**.
6. **Leaderboard** (top nav → _Leaderboard_). (#102, #137)
   - The learner's row is highlighted: **400 XP** and a **5-day streak**. **Your Rank** says
     **#3**, up from #5 at the start. They passed Priya (300) and are level with Leo (400), so both
     rows show rank 3.
   - _"Everything we just did moved them up the board."_
7. **Home again.** **Today's goal** reads `150/150 XP`: "Goal reached. Your **5-day streak** is
   safe." **Your week** has a new 150 XP bar for today. (#133)
8. **Profile.** (#142, #118)
   - The stat tiles are real now: **Courses 3**, **Nodes 5**, **Quizzes 2**.
   - Open the **Achievements** tab. **Perfect Quiz** ("Score 100% on a quiz") is at the top, earned
     today by that retry, next to First Step, Week Streak and Polyglot.
   - _Optional:_ back on the **Profile** tab, edit the name and click **Save Changes**.
9. _Optional, mobile:_ press Cmd+Shift+M in DevTools. Show the hamburger menu and the bottom tab
   bar (Home / Catalog / Profile); tap **Catalog** to open the course grid. (#140) The XP and streak
   pills are desktop-only.

**Answer key: Atoms & Bonding quick check**

| Question                                                  | Answer                                    |
| --------------------------------------------------------- | ----------------------------------------- |
| How many covalent bonds does a neutral carbon atom form?  | **4**                                     |
| Which of these are types of covalent bonds?               | **Single, Double, Triple** (not Magnetic) |
| A carbon at the end of a triple bond is \_\_\_-hybridized | **sp** (any case or spacing)              |

Transition: _"That's the learner side. Here's how an instructor builds it."_

---

## 5. Segment 4 — An instructor authors content (~7 min) · Tab C

1. **Courses.**
   - Status badges show 3 published courses and 2 drafts.
   - Use the **filter pills** (Published → Draft → All) and the **Grid / List** toggle.
   - _Optional:_ toggle dark mode in the top bar to show the page now follows the theme (#134),
     then switch back.
2. **Create a course.** Click **Create Course**, give it a title and description, and click
   **Create Course** in the **New Course** modal. It opens the **Course Builder**. (#100)
   - _"The empty canvas is where adding nodes lands next (SYN-65)."_
   - Click **All courses**, then on your new course's card open the **⋯** menu → **Delete
     course** → **Delete** to show the confirm dialog.
3. **Open Organic Chemistry** (click its card) → **Course Builder**, which has three panes: Meta,
   Tree Canvas, and Inspector. (#89)
   - **Meta:** edit the description, then click away. It saves automatically.
   - **Tree Canvas:** **drag a node** to a new spot, then refresh. The position is saved. (#115)
   - _Optional:_ refresh the course page in Tab B. The learner's tree shows the new layout.
4. **Lesson editor from the canvas.** Each node has a small round **⋯** button on its top-right
   corner. Click it on _Functional Groups_ → **Edit lesson**. (#150, #98)
   - Edit the text, **add a text block** (the round **+** between blocks → **Text**), **drag a
     block by its grip handle** to reorder, then click **Save lesson**. A "Lesson saved" toast
     confirms it.
   - In Tab B, **refresh the page** and reopen _Functional Groups_ from the tree. The learner sees
     the change.
5. **Add a quiz to Nomenclature.** (#129)
   - Click **Back to course**, then **⋯** on _Nomenclature_ → **Edit lesson**. Nomenclature has no
     quiz yet, so the bottom of the editor shows **+ Add a quiz**. Click it.
   - A **Quiz** section appears with one single-choice question ("New question", with _Answer 1_
     marked correct and _Answer 2_).
     - Change the prompt to _"What does the suffix -ol tell you?"_ and the answers to _An alcohol_
       (keep its radio selected as correct) and _An alkene_.
     - Optionally fill in **Explanation (shown after answering)**.
   - Under **Add question**, click **+ Fill in blank**. Set the prompt to _"CH₃CH₂OH is called
     \_\_\_."_ and the **Correct answer** to `ethanol`. Point out the hint: capital letters and
     extra spaces are ignored when it's graded.
   - Point at the other types: **+ Multiple choice** and **+ Open question** work; **+ Order** and
     **+ Match pairs** are "coming soon".
   - Leave **Learners must pass this quiz to complete the lesson** unticked, then click **Save
     lesson**.
   - _Optional:_ in Tab B, **refresh**, open Organic Chemistry → _Nomenclature_ (it unlocked when
     Functional Groups was finished) → **Continue**. The new quiz is page 2. Don't submit it unless
     you want to: a pass adds another +100 XP and moves the learner to #2.
6. **Analytics** (top nav → **Analytics**). (#120)
   - Four cards: **Active learners** and **Lessons completed** have real numbers for the last 7
     days, with the change vs. the previous 7 days (after a fresh seed, roughly 7 active learners
     and 30 lessons, both up on the previous week).
   - Switch the range: **7 days** → **30 days** → **90 days** → **All time**.
   - **Avg session** and **Course completion** say **"Not available"** ("Not currently
     measured"). _"We don't track those yet, so the page says so instead of showing a made-up
     number."_
   - The numbers refresh at most once a minute, so the lesson finished a minute ago may not show
     yet.
7. _Optional:_ **admin leaderboard.** Type `/leaderboard` into the admin URL. It shows the same XP
   data from the admin side.
8. _Optional:_ **theme.** Toggle dark mode and density on the Course Builder or the Courses list,
   then switch back.

---

## 6. Segment 5 — Under the hood (~2 min)

Narrate this, or use a slide. The dev GraphQL sandbox needs a Firebase token, so skip it live.

- **Gamification engine:**
  - XP is awarded exactly once per lesson and per quiz, inside the same transaction as completion.
    The finish screen shows exactly what that call awarded. (#116, #132)
  - Streaks follow each learner's local day, using the timezone saved at signup, and handle
    daylight-saving changes. (#123, #147)
  - **Achievements** are checked in the same transaction as lessons and quizzes: counts, streak
    milestones, a perfect quiz, finishing a branch, or learning across three branches. (#118)
  - **Daily quests** ("Earn 50 XP", "Complete 2 lessons", "Get 100% on a quiz") and **hearts** are
    built on the API. Their UI is next. (#96, #122, #101)
- **Server-side progress:** node status (completed / in progress / unlocked / locked) and course
  progress come from the API, so every screen agrees. (#131, #145)
- **Security hardening:**
  - Quiz answer keys and explanations stay hidden until a learner has attempted the quiz,
    including through attempts, filters and crafted queries. (#135, #143)
  - Other users' private data (email, progress, XP history) is no longer readable through
    course authors or quiz attempts. (#149)
  - Draft and deleted courses, lessons and quizzes are hidden from learners. (#149, #152)
  - Internal database errors no longer reach the browser. (#149)
- **Engineering:**
  - CI blocks merges on lint, type-check, builds, API tests against a real Postgres database, and
    now the learner app's tests too. (#112, #141)
  - Separate dev and prod environments, deployed from `development` and `main` (#104–#111).

---

## 7. Closing (~1 min)

> _"This cohort took Synth Tree from a local prototype to a deployed product. Learners can sign up,
> move through a real skill tree, study multi-page lessons, take graded quizzes, and earn XP,
> streaks and achievements that show up everywhere, live. Instructors can create courses, lay out
> trees, write lessons, author quizzes, and watch activity in analytics. It's all running on
> production-grade infrastructure with CI that actually gates."_

**What's next** (open in Jira):

- building trees in the admin: add child nodes (SYN-65), the chapter Inspector pane (SYN-67),
  prerequisites (SYN-68) and deleting nodes (SYN-69);
- lesson editor: image upload (SYN-71) and preview (SYN-73);
- more question types: order and match pairs (SYN-55, SYN-56);
- catalog search and filters (SYN-52);
- analytics charts and tables (SYN-80, SYN-81) and profile mastery stats (SYN-78);
- weekly leagues on the leaderboard (SYN-77);
- mobile layouts for lessons and the skill tree (SYN-82, SYN-83);
- a UI for daily quests and hearts, which already exist on the API.

---

## 8. Avoid-list (don't click these live)

**Learner app**

- **Isomerism quiz:** it's an open-response question that waits for manual review, which doesn't
  exist yet. There's no retry.
- **"Time spent"** in the course sidebar: always "—" (not tracked yet, SYN-78).
- **Forgot password:** disabled.
- **After an admin edit, the learner tab needs a refresh.** Lessons and quizzes are cached in the
  page, so a lesson reopened without a refresh still shows the old version.
- **Achievements** only appear on **Profile → Achievements**. There's no pop-up when one is
  earned, so go there to show it.
- **Don't re-seed the night before.** See pre-flight step 3.

**Admin**

- **Clicking a node** in the Course Builder only drags it. Use its **⋯** button for **Edit
  lesson**. The **Inspector** pane is static text.
- **Lesson editor on Atoms & Bonding:** it hides that lesson's image, page break and video. Stick to
  _Functional Groups_ and _Nomenclature_.
- **Disabled buttons:** the Heading, Image, Video and Embed block types, **Preview**, and the
  **+ Order** / **+ Match pairs** question types are "coming soon".
- **Open questions in a new quiz:** they wait for manual review, just like Isomerism, so the
  learner can't pass or retry that quiz.
- **"Remove quiz"** on a quiz learners have taken deletes their attempts when you save. Don't do it
  on Atoms & Bonding.
- **Analytics** is cached for a minute, so it won't reflect a click you just made.
- **Deleting a seeded course:** the dialog says an admin can undo it, but there's no restore UI, so
  you'd need to re-seed. **Also don't set Organic Chemistry to Draft** (Visibility in the Meta
  pane).
- **Google sign-in on admin:** new Google users get the learner role and can't load courses.

**General**

- **Don't merge to `development` near the demo.** Each merge redeploys dev.

---

## Appendix A — Resetting the dev demo data

`pnpm db:seed:demo` (`apps/api/scripts/seedDemoContent.ts`) can be re-run, and it doubles as a
reset button. It:

- creates or updates the eight achievement definitions;
- deletes and recreates all demo courses, so any admin edits (including an added Nomenclature quiz)
  are undone and **the IDs change**;
- recreates the seven classmates, with the achievements their activity earns;
- resets `learner@local.dev`'s progress, XP, streak, achievements and timezone to the starting
  state above.

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

**5. Run the seed** from the repo root. It should print `8 achievement definitions`, list the five
courses, then seven `classmate …` lines (Maya Chen 700 XP down to Ava Thompson 50 XP), then

```text
   • learner@local.dev: 250 XP, 4-day streak, achievements: first-step, week-streak, polyglot
✅ Demo content seeded.
```

Perfect Quiz is missing from that list on purpose.

```bash
cd apps/api && pnpm db:seed:demo
```

**6. Clean up.** Press Ctrl-C in tab 1 to close the tunnel, then run `unset DATABASE_URL` in tab 2.
Then reload your demo tabs (pre-flight step 4), because the IDs changed.

**Troubleshooting**

- **`TargetNotConnected`:** the bastion host is stopped or its SSM agent isn't registered. Check the
  instance tagged `synth-tree-dev-bastion-host` in the EC2 console.
- **`AccessDenied`:** your profile lacks SSM, Secrets Manager or CloudFormation permissions in that
  account.
- **Seed output looks wrong:** re-run it. Every run starts from a clean slate.
- **The streak shows 0 on Home, or drops to 1 after the first lesson:** the seed ran on an earlier
  New York day. Re-run it today.

### Timezone

The seed saves **America/New_York** as the learner's timezone and places its activity on New York
calendar days, at noon. The API counts the streak in that timezone, and the Home chart groups XP by
the **browser's** day, so run the demo from a computer set to New York time. For a presenter in
another timezone, change `LEARNER_TIMEZONE` in `seedDemoContent.ts` to theirs before seeding.

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
