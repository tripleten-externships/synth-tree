# Synth Tree — Cohort Demo Script

A click-through script for the stakeholder demo. Designed for **one presenter**
sharing their screen, moving through **four surfaces in order** to minimize
switching: HTML mocks → Admin dashboard → Learner app → Storybook.

Target length: ~20–25 min.

> **Dependency note.** Segments 1, 2, and 4 work on `main` today. Segment 3
> (the learner deep-flow: login, course detail, lessons, quiz) depends on the
> **demo-enablement PR** (learner Firebase login, course-detail wired to the
> API, a lesson/quiz view, and the `db:seed:demo` script). A "works-today
> fallback" for Segment 3 is at the end if that PR hasn't merged yet.

---

## 0. Pre-flight checklist (do this before the call, then dry-run once)

```bash
git checkout main && git pull
pnpm install
pnpm db:start            # Postgres in Docker
pnpm db:migrate:dev      # apply migrations
pnpm db:seed:local-users # admin@local.dev + learner@local.dev (password: Local123!)
pnpm db:seed:demo        # demo courses/trees/lessons/quizzes + learner progress
pnpm dev                 # API :4000, admin :5173, client :5174
pnpm storybook           # :6006 (separate terminal)
```

Then in the browser, set up **four tabs** and sign in ahead of time so nothing
stalls live:

1. `docs/design/desktop-mocks.html` (open the file directly) — and have
   `mobile-mocks.html` ready.
2. `http://localhost:5173` — **admin**, logged in as `admin@local.dev`.
3. `http://localhost:5174` — **learner**, logged in as `learner@local.dev`.
4. `http://localhost:6006` — **Storybook**.

Start in **light mode**. Keep the GraphQL playground (`:4000`) closed unless a
technical stakeholder asks to see the API.

---

## 1. What this cohort shipped (feature → PR map)

Use this to credit the work; you don't need to read it aloud.

| Area | Feature | PR · author |
|---|---|---|
| Admin | Courses page wired to GraphQL + status badges | #74 · Gabriela |
| Admin | Grid/list view toggle | #76 · Seyonce |
| Admin | Publish / unpublish course + toast | #65 · Christian |
| Admin | Soft-delete with confirm dialog | #77 · Seydou |
| Admin | Dark mode + density selector | #70 · Ken |
| Admin | Course Builder shell route | #67 · Christian |
| Admin | Forgot-password flow | #72 · Adam |
| Learner | Recommended-next carousel | #79 · Christian |
| Learner | Catalog page + CourseCard | #71 · Walker |
| Learner | Mobile bottom tab bar | #78 · Christian |
| Learner | Start node progress on lesson open | #80 · Angel |
| Design system | Hex node icons (status states) | #66 · Adam |
| Design system | Shared Icon library | #69 · Adam |
| Design system | Progress component | #67 · Christian |
| Design system | HSL theme tokens | #64 · Ken |
| API | Open-question quiz grading | #81 · Seyonce |
| API | XP / streak persistence models | #75 · Rduffard |

---

## 2. Segment 1 — The vision: HTML mocks (~3 min) · Tab 1

> *"Before the live app, here's the design direction the team is building
> toward — you haven't seen these yet."*

1. Open `desktop-mocks.html`. Walk the key screens (course catalog, course
   detail, the skill-tree, a lesson). Keep it high-level — this is the "north star."
2. Switch to `mobile-mocks.html`. *"The product is designed mobile-first too."*

Transition: *"Now let's see how much of this is already real."*

---

## 3. Segment 2 — Admin dashboard (~8 min) · Tab 2 · `:5173`

This is the most complete surface — a full course-authoring lifecycle.

1. **Login page → dark mode.** Click the moon/sun icon to toggle dark mode
   (persists). Toggle back. *"Theming is centralized — one toggle re-themes the
   whole app."* (#64/#70)
2. **Log in** as `admin@local.dev` → lands on **Courses**.
3. **Courses list.** Point out **status badges** (Published/Draft), and each
   card's "by <author> · edited <time> ago". (#74)
4. **Grid ↔ List** toggle (top-right of the list). (#76)
5. **Filter pills** — click **Published**, then **Draft**, then **All**. (#74)
6. **Create a course.** Click **Create Course** → title "Cellular Respiration",
   a short description → **Create**. It appears instantly. (#74)
7. **Publish it.** ⋯ menu → **Publish course** → green toast; badge flips to
   Published. (#65)
8. **Density.** In the header, open the density control → switch
   **compact / comfy** to show spacing respond live. (#70)
9. **Soft delete.** ⋯ menu on the course you just made → **Delete** → the
   **styled confirm dialog** appears → confirm. *"Deletes are soft — recoverable,
   not destructive."* (#77)
10. **Course Builder.** Click a course (or ⋯ → Edit) → the **Course Builder**
    shell (Meta / Tree Canvas / Inspector). *"This is the authoring surface in
    progress — the layout's in place, editing lands next."* (#67)

Nothing here is a dead-end; move confidently.

Transition: *"That's the instructor side. Now the learner experience."*

---

## 4. Segment 3 — Learner app (~8 min) · Tab 3 · `:5174`

> Requires the **demo-enablement PR**. Fallback at the end if not merged.

1. **Log in** as `learner@local.dev` (do this pre-call). 
2. **Home.** Top is the **Recommended next** carousel — because we seeded
   progress, it shows the learner's next nodes. Below: the published course grid,
   then a **Browse catalog** card. (#79/#71)
3. **Browse catalog** → the catalog grid of all published courses. (#71)
4. **Open a course.** Click **Organic Chemistry** → the course detail page shows
   the course and its **skill-tree nodes** (Atoms & Bonding → Functional Groups →
   Isomerism → Your First Reaction), pulled live from the API.
5. **Open a lesson.** Click **Atoms & Bonding** → the lesson renders (formatted
   text + an embedded video). *"Opening a lesson automatically marks it in
   progress."* (#80 fires `startNodeProgress` here.)
6. **Take the quiz.** Scroll to the quiz → answer the questions → **Submit** →
   the server grades it and shows **Passed**. *"Grading runs on the API,
   including open-response handling."* (#81)
7. **Back to Home** → the **Recommended next** carousel has updated now that this
   node is complete. *"Recommendations react to real progress."* (#79/#80)
8. **Mobile.** Open DevTools device toolbar (Cmd+Shift+M) → the **bottom tab
   bar** (Home / Catalog / Profile) appears. Tap between tabs. (#78)
9. **Profile** → show the learner profile (name/photo edit).

Transition: *"All of that sits on a shared design system the team built."*

---

## 5. Segment 4 — Design system: Storybook (~3 min) · Tab 4 · `:6006`

> *"These are the reusable building blocks behind both apps."*

- **Hex** — the skill-node icon with status states
  (locked / unlocked / current / completed). (#66)
- **Icon** — the shared subject-icon library. (#69)
- **Progress** — the progress bar component. (#67)
- **Color Picker / theme tokens** — the theming foundation. (#64)

---

## 6. Closing (~1 min)

> *"In three weeks the cohort delivered a working course-authoring dashboard, a
> learner experience from catalog through lessons and graded quizzes, a shared
> design system, and the data model for XP and streaks that powers what's next."*

Optional, for a technical stakeholder: open the GraphQL playground (`:4000`) and
run a query to show the API depth (e.g. `publicGetAllCourses`, or a
`courseProgress` aggregate).

---

## 7. Avoid-list (don't click these live)

- **Admin** → the avatar dropdown **Profile** link if it isn't wired (confirm at
  dry-run).
- **Learner** → the **Dashboard / Lessons / Skill Trees** top-nav items — they're
  placeholder stubs.
- Any course detail for an **unseeded** id.

---

## 8. Works-today fallback (if the demo-enablement PR isn't merged)

Without it, the learner app has **no login** and lessons/quiz/progress/carousel
are auth-gated (they'll error or show empty). For Segment 3, instead:

1. **Home** — show the course grid + **Browse catalog** card (these are public
   and work). The carousel will show its "all caught up" empty state.
2. **Catalog** — the published-courses grid (public). 
3. **Profile** + **mobile bottom tab bar** — both work.
4. **Do not** click into a course card (the detail page is mock data) or the
   lessons/quiz flow.
5. Cover lessons, quiz grading (#81), progress (#80), and recommendations (#79)
   by **narrating** them and showing them in the **GraphQL playground** +
   **Storybook**.
