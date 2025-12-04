# Synth Tree — Minimal Viable Database Schema

_Path: `docs/database-schema.md`_

**Project:** synth-tree (hierarchical course learning platform)

**Scope:** Courses contain one or more Skill Trees (typically one). Skill Trees contain gated Skill Nodes laid out in a logical order (and optionally positioned for UI). Each Skill Node hosts rich-content Lessons (as ordered blocks) and at most one Quiz (optional) with multiple Questions and Attempts. Learners progress node-by-node; successors unlock when prerequisites are met.

## Executive Summary

This document defines the initial relational schema for Synth Tree using PostgreSQL + Prisma. It focuses on the smallest set of tables that let the team ship the end-to-end flow:

- **Authoring:** Create Courses → Trees → Nodes → LessonBlocks + (optional) Quiz with Questions/Options.
- **Learning:** Users start a Node, complete its lesson content, take the Quiz if required, and progress.
- **Gating:** Nodes can declare prerequisites using a compact self-relation table.

Deliberately no numeric scoring in v1; an attempt is simply passed/failed based on the auto-gradable questions (single/multiple choice). Open questions are stored, not graded. This keeps the system simple while leaving room to extend later (badges, leaderboards, partial credit, etc.).

## Author’s Notes & Considerations (from ST-13 + Figma)

I used the Figma design and the Jira ticket ST-13 to reverse-engineer what’s needed for the schema and which Prisma operations are most natural for creating courses, skill trees, skill nodes, lesson blocks, quizzes, and users.

I intentionally removed quiz/node/lesson points for v1 to avoid premature gamification complexity. I still want to gamify the app more (badges, streaks, XP) in later sprints—but not block v1.

I’m aiming for minimal but extensible. If anything here feels over-modeled or under-modeled, please comment in the PR. The team will be building directly on this, so feedback is very welcome.

## Core Entity Overview

Course → authoring container; holds one or more SkillTrees.

SkillTree → ordered, gated graph of SkillNodes for a course.

SkillNode → one learning step; contains LessonBlocks and optionally one Quiz.

LessonBlocks → ordered blocks of content (IMAGE, VIDEO, EMBED, HTML) attached to a node.

Quiz → optional assessment per node; has Questions, Options, Attempts, and AttemptAnswers.

UserNodeProgress → one row per (user, node) with basic status + completion timestamp.

Prerequisites → SkillNodePrerequisite maps “Node B requires Node A.”

## Model Reference Overview

### User

- **Key Fields:** `id` (Firebase UID), `email`, optional profile metadata (`name`, `photoUrl`), `role` (`ADMIN` or `USER`).
- **Relationships:** Authors `Course` records, maintains progress via `UserNodeProgress`, and accumulates quiz `QuizAttempt`s.

### Course

- **Key Fields:** `id`, `title`, optional `description`, `authorId`, lifecycle `status`, soft-delete `deletedAt`.
- **Relationships:** Owned by a `User`; parent container for one or more `SkillTree`s.

### SkillTree

- **Key Fields:** `id`, `courseId`, `title`, optional `description`, audit timestamps, optional soft delete.
- **Relationships:** Belongs to a `Course`; produces the ordered collection of `SkillNode`s.

### SkillNode

- **Key Fields:** `id`, `treeId`, `title`, logical ordering (`step`, `orderInStep`), optional layout coordinates (`posX`, `posY`).
- **Relationships:** Parent for `LessonBlocks`, optional single `Quiz`, prerequisite edges via `SkillNodePrerequisite`, and learner progress via `UserNodeProgress`.

### SkillNodePrerequisite

- **Key Fields:** Composite primary key on `nodeId` and `dependsOnNodeId`.
- **Purpose:** Defines gating edges from prerequisite nodes to dependent nodes within the same `SkillTree`.

### LessonBlocks

- **Key Fields:** `id`, `nodeId`, `type` (`IMAGE`, `VIDEO`, `EMBED`, `HTML`), content payload (`url` or `html`), optional `caption`, `order`, flexible `meta`, publication `status`.
- **Purpose:** Ordered, typed content units rendered for each `SkillNode`.

### Quiz

- **Key Fields:** `id`, `nodeId` (unique 1:1 with `SkillNode`), optional `title`, `required` flag, timestamps.
- **Relationships:** Contains `QuizQuestion`s and captures learner `QuizAttempt`s.

### QuizQuestion

- **Key Fields:** `id`, `quizId`, `type` (`SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `OPEN_QUESTION`), `prompt`, `order`.
- **Relationships:** Surfaces answer options via `QuizOption` and stores learner responses in `QuizAttemptAnswer`.

### QuizOption

- **Key Fields:** `id`, `questionId`, `text`, `isCorrect`.
- **Purpose:** Enumerates possible responses and correctness for choice-based questions.

### QuizAttempt

- **Key Fields:** `id`, `quizId`, `userId`, `passed`, `takenAt`.
- **Purpose:** Records each learner submission and overall pass/fail outcome per quiz.

### QuizAttemptAnswer

- **Key Fields:** `id`, `attemptId`, `questionId`, structured `answer` JSON, nullable `isCorrect`.
- **Purpose:** Stores per-question responses and correctness evaluation for a given attempt.

### UserNodeProgress

- **Key Fields:** `id`, `userId`, `nodeId`, `status`, optional `completedAt`, audit timestamps.
- **Purpose:** Drives gating logic and tracking of learner status within a `SkillTree`.

## Quiz & Grading Semantics (v1)

Exactly one quiz per node (Quiz.nodeId @unique).

Question types:

SINGLE_CHOICE → exactly one correct option.

MULTIPLE_CHOICE → one or more correct options; answer is correct only if it exactly matches the correct set.

OPEN_QUESTION → captured as free text; not auto-graded (store only).

Attempts: passed is true iff all auto-gradable questions are correct (or true if no auto-gradable questions exist).

Required quizzes: Quiz.required indicates the quiz must be taken for node completion (policy enforced in app logic).

## Diagram

Interactive ERD (DrawSQL) -- for reference:
**[View Diagram on DrawSQL](https://drawsql.app/teams/overtech-1/diagrams/synth-tree)**

> ℹ️ Note: GitHub Markdown won’t render iframes; open the link for the interactive view.

---

## Prisma Schema (Canonical)

Below is the canonical Prisma schema snapshot that implements the above design. It uses PostgreSQL, UUID primary keys, referential actions, updated timestamps, and soft deletes where warranted.

```prisma
// ================================================================
// Generators & Datasource
// ================================================================
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ================================================================
// Enums
// - Keep these small for v1. We can add ARCHIVED etc. later.
// ================================================================
enum Role {
  ADMIN
  USER
}

enum QuestionType {
  SINGLE_CHOICE      // one correct option; answer stored as selectedOptionIds[1]
  MULTIPLE_CHOICE    // multiple correct options; answer stored as selectedOptionIds[]
  OPEN_QUESTION      // free text; not auto-graded in v1
}

enum ContentType {
  IMAGE              // url -> image asset; meta can hold width/height, alt, etc.
  VIDEO              // url -> provider link; meta can hold provider, duration, etc.
  EMBED              // url -> external embed (e.g., CodePen, Figma); meta for provider
  HTML               // html -> inline HTML snippet (sanitized on write)
}

enum LessonStatus {
  DRAFT
  PUBLISHED
}

enum CourseStatus {
  DRAFT
  PUBLISHED
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

// ================================================================
// User
// - Firebase UID as canonical primary key (string).
// - Authors create courses; learners produce progress and quiz attempts.
// ================================================================
model User {
  id        String   @id                       // Firebase UID (auth layer)
  email     String   @unique
  name      String?
  photoUrl  String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Authoring:
  coursesAuthored Course[]         @relation("CourseAuthor")

  // Learning:
  nodeProgress    UserNodeProgress[]  // 1 row per (user,node)
  quizAttempts    QuizAttempt[]       // all attempts across quizzes

  // NOTE: If we later separate "Author" and "Learner" personas,
  // Role can gate UI while the schema stays the same.
}

// ================================================================
// Course
// - Author-owned content container for one or more SkillTrees.
// - Soft delete included to allow recoverability.
// ================================================================
model Course {
  id          String        @id @default(uuid()) @db.Uuid
  title       String
  description String?
  authorId    String
  status      CourseStatus  @default(DRAFT)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  deletedAt   DateTime?

  author  User       @relation("CourseAuthor", fields: [authorId], references: [id], onDelete: Restrict)
  trees   SkillTree[]

  @@index([title]) // lightweight browse/search
}

// ================================================================
// SkillTree
// - A course may have >1 tree; most courses likely use just one.
// - Deleting a tree cascades to nodes and their content/quiz data.
// ================================================================
model SkillTree {
  id          String     @id @default(uuid()) @db.Uuid
  courseId    String     @db.Uuid
  title       String
  description String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  deletedAt   DateTime?

  course Course     @relation(fields: [courseId], references: [id], onDelete: Cascade)
  nodes  SkillNode[]

  @@index([courseId])
  @@index([title])
}

// ================================================================
// SkillNode
// - A single learning step in a tree.
// - Two orderings:
//   1) Logical order: (step, orderInStep) used for gating.
//   2) Visual layout: (posX, posY) for the editor canvas.
// - Exactly one (optional) Quiz per node (enforced on Quiz.nodeId).
// ================================================================
model SkillNode {
  id           String   @id @default(uuid()) @db.Uuid
  treeId       String   @db.Uuid
  title        String
  step         Int      @default(1)  // logical level/layer (e.g., column)
  orderInStep  Int      @default(0)  // order within the step
  posX         Int?     @default(0)  // optional: UI layout
  posY         Int?     @default(0)  // optional: UI layout
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  deletedAt    DateTime?

  tree   SkillTree @relation(fields: [treeId], references: [id], onDelete: Cascade)

  // Content & assessment
  lessons LessonBlocks[]     // ordered blocks of mixed media for this node
  quiz    Quiz?              // 0..1 quiz per node (Quiz.nodeId is unique)

  // Gating (self-relation). Example: "To start this node, complete Node A".
  prerequisites SkillNodePrerequisite[] @relation("NodePrereq_node")
  requiredFor   SkillNodePrerequisite[] @relation("NodePrereq_depends")

  // Progress (per user, per node)
  progresses UserNodeProgress[]

  @@index([treeId])
  @@unique([treeId, step, orderInStep]) // unique logical position
  @@unique([treeId, posX, posY])        // unique canvas coordinates (optional)
}

// ================================================================
// SkillNodePrerequisite
// - Composite PK identifies edges in the prerequisite graph.
// - Deleting the depended/parent or child node cascades to edges.
// ================================================================
model SkillNodePrerequisite {
  nodeId          String @db.Uuid        // the node being gated (child)
  dependsOnNodeId String @db.Uuid        // prerequisite (parent)

  node      SkillNode @relation("NodePrereq_node",    fields: [nodeId],          references: [id], onDelete: Cascade)
  dependsOn SkillNode @relation("NodePrereq_depends", fields: [dependsOnNodeId], references: [id], onDelete: Cascade)

  @@id([nodeId, dependsOnNodeId])
}

// ================================================================
// LessonBlocks
// - Rich content is modeled as ordered blocks for flexibility.
// - For non-HTML types, use `url`; for HTML, use `html`.
// - `meta` JSON holds provider-specific data without schema churn.
// ================================================================
model LessonBlocks {
  id        String       @id @default(uuid()) @db.Uuid
  nodeId    String       @db.Uuid
  type      ContentType
  url       String?      // IMAGE/VIDEO/EMBED: remote asset link
  html      String?      // HTML: inline HTML snippet (sanitized on write)
  caption   String?
  order     Int          @default(0) // render ordering within node
  meta      Json?        // optional structured payload (e.g., provider, dims)
  status    LessonStatus @default(DRAFT)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  deletedAt DateTime?

  node SkillNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)

  @@index([nodeId])
  @@index([type])
  @@index([status])
}

// ================================================================
// Quiz
// - At most one quiz per node (nodeId is unique).
// - `required` means the quiz must be taken for completion logic,
//   but grading uses only booleans in v1 (no numeric scores).
// ================================================================
model Quiz {
  id        String   @id @default(uuid()) @db.Uuid
  nodeId    String   @unique @db.Uuid     // 1:1 with SkillNode
  title     String?
  required  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  node      SkillNode      @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  questions QuizQuestion[]
  attempts  QuizAttempt[]
}

// ================================================================
// QuizQuestion
// - For open questions, `options` may be empty and we do not auto-grade.
// - Keep ordering stable for rendering.
// ================================================================
model QuizQuestion {
  id        String       @id @default(uuid()) @db.Uuid
  quizId    String       @db.Uuid
  type      QuestionType
  prompt    String
  order     Int          @default(0)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  quiz     Quiz               @relation(fields: [quizId], references: [id], onDelete: Cascade)
  options  QuizOption[]       // SINGLE/MULTIPLE; optional for OPEN_QUESTION
  answers  QuizAttemptAnswer[]// backrefs for per-attempt answers

  @@index([quizId])
}

// ================================================================
// QuizOption
// - Correctness flags live at the option level.
// - For MULTIPLE_CHOICE, multiple options may be correct.
// ================================================================
model QuizOption {
  id          String   @id @default(uuid()) @db.Uuid
  questionId  String   @db.Uuid
  text        String
  isCorrect   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  question QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@index([questionId])
}

// ================================================================
// QuizAttempt
// - v1 grading is boolean: passed/failed, no numeric score.
// - Application logic determines "passed" by checking that all
//   auto-gradable answers are correct (or true if none exist).
// ================================================================
model QuizAttempt {
  id       String   @id @default(uuid()) @db.Uuid
  quizId   String   @db.Uuid
  userId   String
  passed   Boolean
  takenAt  DateTime @default(now())

  quiz     Quiz                 @relation(fields: [quizId], references: [id], onDelete: Cascade)
  user     User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers  QuizAttemptAnswer[]

  @@index([quizId])
  @@index([userId])
}

// ================================================================
// QuizAttemptAnswer
// - Stores the raw user answer and computed correctness (if applicable).
// - JSON `answer` shapes (v1):
//   SINGLE_CHOICE   -> { selectedOptionIds: ["opt-uuid"] }
//   MULTIPLE_CHOICE -> { selectedOptionIds: ["opt-uuid", ...] }
//   OPEN_QUESTION   -> { text: "free response" }
// - `isCorrect` is null for OPEN_QUESTION in v1.
// ================================================================
model QuizAttemptAnswer {
  id         String   @id @default(uuid()) @db.Uuid
  attemptId  String   @db.Uuid
  questionId String   @db.Uuid
  answer     Json?
  isCorrect  Boolean? // computed for choice questions; null for OPEN_QUESTION

  attempt  QuizAttempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@unique([attemptId, questionId]) // exactly one answer per question per attempt
  @@index([questionId])
}

// ================================================================
// UserNodeProgress
// - Single row per (user, node) drives dashboards & gating checks.
// - Completion timestamp is optional and set when finished.
// ================================================================
model UserNodeProgress {
  id          String         @id @default(uuid()) @db.Uuid
  userId      String
  nodeId      String         @db.Uuid
  status      ProgressStatus @default(NOT_STARTED)
  completedAt DateTime?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  user User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  node SkillNode @relation(fields: [nodeId], references: [id], onDelete: Cascade)

  @@unique([userId, nodeId])     // canonical progress row
  @@index([userId, status])      // "what's in progress/completed for this user?"
  @@index([nodeId, status])      // "how many users completed this node?"
}
```

---

## Relationships & Foreign Keys

- **Course (1) — (N) SkillTree** via `SkillTree.courseId` (Cascade delete)
- **SkillTree (1) — (N) SkillNode** via `SkillNode.treeId` (Cascade delete)
- **SkillNode (1) — (N) LessonBlocks** via `LessonBlocks.nodeId` (Cascade delete)
- **SkillNode (1) — (0/1) Quiz** via `Quiz.nodeId` (Unique + Cascade)
- **Quiz (1) — (N) QuizQuestion** via `QuizQuestion.quizId` (Cascade)
- **QuizQuestion (1) — (N) QuizOption** via `QuizOption.questionId` (Cascade)
- **Quiz (1) — (N) QuizAttempt** via `QuizAttempt.quizId` (Cascade)
- **QuizAttempt (1) — (N) QuizAttemptAnswer** via `QuizAttemptAnswer.attemptId` (Cascade)
- **SkillNode (N) — (N) SkillNode (prereqs)** via `SkillNodePrerequisite(nodeId, dependsOnNodeId)` (Composite PK)
- **User (1) — (N) UserNodeProgress** via `UserNodeProgress.userId` (Cascade)

---

## Enum Types

- `LessonStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `ProgressStatus`: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`
- `ContentType`: `IMAGE`, `VIDEO`, `EMBED`, `HTML`
- `QuestionType`: `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `OPEN_QUESTION`
- (Authoring/Admin) `CourseStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`
- (Gamification) `Gated Nodes`

---

## Indexes & Constraints (Common Queries)

- `Course`: `@@index([title])` for search/browse
- `SkillTree`: `@@index([courseId])`, `@@index([title])`
- `SkillNode`: `@@index([treeId])` for listing nodes by tree
  Unique logical order: `@@unique([treeId, step, orderInStep])`
  Unique layout coordinates: `@@unique([treeId, posX, posY])`
- `LessonBlocks`: `@@index([nodeId])`, `@@index([type])`, `@@index([status])`
- `QuizQuestion`: `@@index([quizId])`; `QuizOption`: `@@index([questionId])`
- `QuizAttempt`: `@@index([quizId])`, `@@index([userId])`
- `QuizAttemptAnswer`: `@@unique([attemptId, questionId])`, `@@index([questionId])`
- `UserNodeProgress`: `@@unique([userId, nodeId])`, `@@index([userId, status])`, `@@index([nodeId, status])`

> **Rationale:**
>
> - List nodes by tree and step/order (learning flow)
> - Query progress by user + status (dashboards)
> - Query progress by node + status (node completion analytics)
> - Fast quiz/question traversal; per‑attempt deduping with composite unique key

---

## Prisma ORM Showcase (Create Courses, Gate Nodes, Lessons & Quizzes)

> File: `scripts/demo.ts` — end-to-end sample of how the prisma.schema will be utilized.

```ts
// scripts/demo.ts
import {
  PrismaClient,
  QuestionType,
  ProgressStatus,
  ContentType,
  LessonStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ---------------------------------------------------------------------------
  // 0) Ensure a user exists (Firebase UID as canonical id)
  // ---------------------------------------------------------------------------
  const user = await prisma.user.upsert({
    where: { id: "uid_123" },
    update: {},
    create: { id: "uid_123", email: "learner@example.com" },
  });

  // ---------------------------------------------------------------------------
  // 1) CREATE: Course → SkillTree → SkillNodes (+ prerequisite gating)
  // ---------------------------------------------------------------------------
  const course = await prisma.course.create({
    data: {
      title: "Intro to Web",
      description: "Basics of web development",
      authorId: user.id,
      status: "DRAFT",
    },
  });

  const tree = await prisma.skillTree.create({
    data: {
      courseId: course.id,
      title: "Frontend Foundations",
      description: "HTML/CSS/JS basics",
    },
  });

  // Node A (step 1) and Node B (step 2) — Node B requires Node A
  const nodeA = await prisma.skillNode.create({
    data: {
      treeId: tree.id,
      title: "HTML Basics",
      step: 1,
      orderInStep: 0,
    },
  });

  const nodeB = await prisma.skillNode.create({
    data: {
      treeId: tree.id,
      title: "CSS Fundamentals",
      step: 2,
      orderInStep: 0,
    },
  });

  await prisma.skillNodePrerequisite.create({
    data: { nodeId: nodeB.id, dependsOnNodeId: nodeA.id }, // Gate: B depends on A
  });

  // ---------------------------------------------------------------------------
  // 2) LESSONS: Add rich content blocks to Node A (IMAGE/VIDEO/HTML/EMBED)
  // ---------------------------------------------------------------------------
  await prisma.lessonBlocks.createMany({
    data: [
      {
        nodeId: nodeA.id,
        type: ContentType.IMAGE,
        url: "https://cdn.example.com/lesson/html-logo.png",
        caption: "HTML logo",
        order: 0,
        status: LessonStatus.PUBLISHED,
        meta: { width: 512, height: 512 },
      },
      {
        nodeId: nodeA.id,
        type: ContentType.VIDEO,
        url: "https://video.example.com/watch?v=abc123",
        caption: "HTML tags overview",
        order: 1,
        status: LessonStatus.PUBLISHED,
        meta: { provider: "ExampleVideo" },
      },
      {
        nodeId: nodeA.id,
        type: ContentType.HTML,
        html: "<p>Try typing <code>&lt;h1&gt;Hello&lt;/h1&gt;</code> in your editor.</p>",
        order: 2,
        status: LessonStatus.PUBLISHED,
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // 3) QUIZ: Exactly one quiz per node — create quiz, questions, and options
  //     No numeric scores; "required" means required to take.
  // ---------------------------------------------------------------------------
  const quizA = await prisma.quiz.create({
    data: {
      nodeId: nodeA.id, // 1:1 with SkillNode (enforced by @unique)
      title: "HTML Basics Quiz",
      required: true,
      questions: {
        create: [
          {
            type: QuestionType.SINGLE_CHOICE,
            prompt: "Which tag creates a top-level heading?",
            order: 0,
            options: {
              create: [
                { text: "<p>", isCorrect: false },
                { text: "<h1>", isCorrect: true },
                { text: "<head>", isCorrect: false },
              ],
            },
          },
          {
            type: QuestionType.MULTIPLE_CHOICE,
            prompt: "Which tags are valid inline elements?",
            order: 1,
            options: {
              create: [
                { text: "<span>", isCorrect: true },
                { text: "<div>", isCorrect: false },
                { text: "<a>", isCorrect: true },
                { text: "<section>", isCorrect: false },
              ],
            },
          },
          {
            type: QuestionType.OPEN_QUESTION,
            prompt: "Explain the difference between block and inline elements.",
            order: 2,
            // OPEN_QUESTION may have 0 options; it's not auto-graded
          },
        ],
      },
    },
    include: { questions: { include: { options: true } } },
  });

  // ---------------------------------------------------------------------------
  // 4) INIT PROGRESS: One row per (user,node)
  // ---------------------------------------------------------------------------
  await prisma.userNodeProgress.createMany({
    data: [
      { userId: user.id, nodeId: nodeA.id, status: ProgressStatus.NOT_STARTED },
      { userId: user.id, nodeId: nodeB.id, status: ProgressStatus.NOT_STARTED },
    ],
    skipDuplicates: true,
  });

  // ---------------------------------------------------------------------------
  // 5) GATED FLOW: helper to check if all prerequisites are completed
  // ---------------------------------------------------------------------------
  async function isNodeUnlocked(
    userId: string,
    nodeId: string
  ): Promise<boolean> {
    const prereqs = await prisma.skillNodePrerequisite.findMany({
      where: { nodeId },
    });
    if (prereqs.length === 0) return true;

    const completed = await prisma.userNodeProgress.findMany({
      where: {
        userId,
        status: ProgressStatus.COMPLETED,
        nodeId: { in: prereqs.map((p) => p.dependsOnNodeId) },
      },
      select: { nodeId: true },
    });

    const completedSet = new Set(completed.map((c) => c.nodeId));
    return prereqs.every((p) => completedSet.has(p.dependsOnNodeId));
  }

  // ---------------------------------------------------------------------------
  // 6) LEARNER TAKES NODE A → QUIZ → GRADING (no scores) → UNLOCK NODE B
  // ---------------------------------------------------------------------------

  // a) Start Node A
  await prisma.userNodeProgress.update({
    where: { userId_nodeId: { userId: user.id, nodeId: nodeA.id } },
    data: { status: ProgressStatus.IN_PROGRESS },
  });

  // b) Load the full quiz
  const fullQuiz = await prisma.quiz.findUnique({
    where: { id: quizA.id },
    include: { questions: { include: { options: true } } },
  });
  if (!fullQuiz) throw new Error("Quiz not found");

  // c) Simulate user selections:
  // - SINGLE_CHOICE: choose the correct option
  // - MULTIPLE_CHOICE: choose all correct options
  // - OPEN_QUESTION: free text
  const userSelections: Record<string, string[] | { text: string }> = {};
  for (const q of fullQuiz.questions) {
    if (q.type === QuestionType.SINGLE_CHOICE) {
      const correct = q.options.find((o) => o.isCorrect)!;
      userSelections[q.id] = [correct.id];
    } else if (q.type === QuestionType.MULTIPLE_CHOICE) {
      userSelections[q.id] = q.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);
    } else {
      userSelections[q.id] = {
        text: "Block elements start on new lines; inline elements do not.",
      };
    }
  }

  // d) Grade (choice types only). "Pass" = all auto-gradable Qs correct.
  function gradeChoiceQuestion(
    selectedIds: string[] | undefined,
    options: { id: string; isCorrect: boolean }[]
  ): boolean {
    const correctSet = new Set(
      options.filter((o) => o.isCorrect).map((o) => o.id)
    );
    const chosen = new Set(selectedIds ?? []);
    return (
      correctSet.size === chosen.size &&
      [...correctSet].every((id) => chosen.has(id))
    );
  }

  const gradable = fullQuiz.questions.filter(
    (q) => q.type !== QuestionType.OPEN_QUESTION
  );
  const allGradableCorrect = gradable.every((q) =>
    gradeChoiceQuestion(userSelections[q.id] as string[] | undefined, q.options)
  );
  const passed = gradable.length === 0 ? true : allGradableCorrect;

  // e) Persist attempt + per-question answers (store correctness per choice Q)
  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: fullQuiz.id,
      userId: user.id,
      passed,
      answers: {
        create: fullQuiz.questions.map((q) => {
          if (q.type === QuestionType.OPEN_QUESTION) {
            return {
              questionId: q.id,
              answer: userSelections[q.id] as { text: string },
              isCorrect: null, // not auto-graded
            };
          }
          const isCorrect = gradeChoiceQuestion(
            userSelections[q.id] as string[] | undefined,
            q.options
          );
          return {
            questionId: q.id,
            answer: {
              selectedOptionIds: [
                ...((userSelections[q.id] as string[] | undefined) ?? []),
              ],
            },
            isCorrect,
          };
        }),
      },
    },
  });

  // f) Complete Node A on pass and (if unlocked) move Node B to IN_PROGRESS
  if (passed) {
    await prisma.userNodeProgress.update({
      where: { userId_nodeId: { userId: user.id, nodeId: nodeA.id } },
      data: { status: ProgressStatus.COMPLETED, completedAt: new Date() },
    });

    const unlocked = await isNodeUnlocked(user.id, nodeB.id);
    if (unlocked) {
      await prisma.userNodeProgress.update({
        where: { userId_nodeId: { userId: user.id, nodeId: nodeB.id } },
        data: { status: ProgressStatus.IN_PROGRESS },
      });
    }
  }

  console.log("Setup + attempt complete:", {
    course: course.id,
    tree: tree.id,
    nodeA: nodeA.id,
    nodeB: nodeB.id,
    quizA: quizA.id,
    attemptId: attempt.id,
    passed,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

**End of document.**
