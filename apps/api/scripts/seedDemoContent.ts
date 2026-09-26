#!/usr/bin/env ts-node
/**
 * Seed realistic demo CONTENT (courses → trees → nodes → lessons → quizzes,
 * plus some learner progress) for local development and the cohort demo.
 *
 * Idempotent: it removes any content owned by the synthetic demo author and
 * recreates it from scratch, so re-running gives the same clean dataset.
 *
 * This is content only — it does NOT create auth/Firebase users. Run the user
 * seed first if you want to log in:
 *   pnpm db:seed:local-users   # creates admin@local.dev + learner@local.dev
 *   pnpm db:seed:demo          # this script
 *
 * The demo courses are authored by a synthetic "Demo Author" user. Admins see
 * and manage all courses (admin bypasses ownership checks), so you can publish/
 * unpublish/delete these while logged in as admin@local.dev.
 *
 * It also seeds learner ACTIVITY so the app looks lived-in:
 *   - seven synthetic classmates (ids "demo-learner-*", no Firebase accounts)
 *     with progress, quiz attempts, XP and streaks, so the leaderboard has a field;
 *   - if learner@local.dev exists: progress across all three published courses,
 *     250 XP and a 4-day streak. Its XP/streak are RESET on every run. Atoms &
 *     Bonding is left without a quiz pass, so passing that quiz in a demo still
 *     awards +100 XP, extends the streak and moves the learner up a rank.
 */

import "dotenv/config";

import {
  ContentType,
  LessonStatus,
  QuestionType,
  CourseStatus,
  ProgressStatus,
  Role,
} from "@prisma/client";

import { prisma } from "../src/lib/prisma";

// Stable id for the synthetic author so re-runs are idempotent (delete-by-author).
const DEMO_AUTHOR_ID = "demo-author";
const DEMO_AUTHOR_EMAIL = "demo-author@local.dev";
const LEARNER_EMAIL = "learner@local.dev";

type LessonSeed = {
  type: ContentType;
  html?: string;
  url?: string;
  caption?: string;
};

type QuestionSeed = {
  type: QuestionType;
  prompt: string;
  explanation?: string;
  options?: { text: string; isCorrect?: boolean }[];
  // FILL only: the graded answer key (trimmed, case-insensitive).
  canonicalAnswer?: string;
};

type NodeSeed = {
  title: string;
  step: number;
  orderInStep: number;
  lessons: LessonSeed[];
  quiz?: { title: string; required?: boolean; questions: QuestionSeed[] };
  /** indices (within this tree's node list) this node depends on */
  prereqs?: number[];
};

type CourseSeed = {
  title: string;
  description: string;
  status: CourseStatus;
  tree?: { title: string; description: string; nodes: NodeSeed[] };
};

const COURSES: CourseSeed[] = [
  {
    title: "Organic Chemistry",
    description:
      "Master the fundamentals of organic chemistry — structure, bonding, and reactions — through a guided path of theory and quizzes.",
    status: CourseStatus.PUBLISHED,
    tree: {
      title: "Foundations of Organic Chemistry",
      description: "Work from atoms and bonds up to your first named reactions.",
      nodes: [
        {
          title: "Atoms & Bonding",
          step: 1,
          orderInStep: 0,
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Atoms &amp; Bonding</h2><p>Organic chemistry is the study of carbon-based molecules. We start with the <strong>covalent bond</strong>: two atoms sharing a pair of electrons.</p><ul><li>Carbon forms four bonds.</li><li>Bonds can be single, double, or triple.</li></ul><h3>Hybrid orbitals</h3><p>To make those bonds, carbon mixes its outer orbitals into <strong>hybrid orbitals</strong>. How many it mixes sets the shape of the molecule: sp is linear, sp² is trigonal planar, and sp³ is tetrahedral.</p><blockquote>Tip: count the atoms and lone pairs around a carbon. Two means sp, three means sp², four means sp³.</blockquote>",
            },
            {
              // Served by the learner app (apps/client-frontend/public/demo) so
              // the demo seed doesn't depend on an external image host.
              type: ContentType.IMAGE,
              url: "/demo/hybrid-orbitals.svg",
              caption: "sp, sp², and sp³ hybrid orbitals",
            },
            // Page break: splits this lesson into two pages (SYN-60 multi-page demo).
            { type: ContentType.PAGE_BREAK },
            {
              type: ContentType.VIDEO,
              url: "https://www.youtube.com/watch?v=FSyAehMdpyI",
              caption: "Introduction to covalent bonding",
            },
          ],
          quiz: {
            title: "Atoms & Bonding — quick check",
            required: true,
            questions: [
              {
                type: QuestionType.SINGLE_CHOICE,
                prompt: "How many covalent bonds does a neutral carbon atom form?",
                explanation: "A neutral carbon atom has four valence electrons and typically forms four covalent bonds to complete its valence shell.",
                options: [{ text: "2" }, { text: "4", isCorrect: true }, { text: "6" }],
              },
              {
                type: QuestionType.MULTIPLE_CHOICE,
                prompt: "Which of these are types of covalent bonds? (select all)",
                explanation:
                  "Single, double, and triple bonds are all types of covalent bonds, which involve atoms sharing one or more pairs of electrons.",
                options: [
                  { text: "Single", isCorrect: true },
                  { text: "Double", isCorrect: true },
                  { text: "Magnetic" },
                  { text: "Triple", isCorrect: true },
                ],
              },
              {
                // FILL sample. Grading trims + lowercases, so "sp" is accepted
                // against the canonical "SP " (SYN-53 acceptance).
                type: QuestionType.FILL,
                prompt:
                  "A carbon atom at the end of a triple bond is ___-hybridized. Fill in the blank (e.g. sp, sp2, sp3).",
                canonicalAnswer: "SP ",
              },
            ],
          },
        },
        {
          title: "Functional Groups",
          step: 1,
          orderInStep: 1,
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Functional Groups</h2><p>A <strong>functional group</strong> is a specific arrangement of atoms that gives a molecule its characteristic reactions — e.g. hydroxyl (-OH), carbonyl (C=O), and carboxyl (-COOH).</p>",
            },
          ],
        },
        {
          title: "Isomerism",
          step: 2,
          orderInStep: 0,
          prereqs: [0, 1],
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Isomerism</h2><p><strong>Isomers</strong> share a molecular formula but differ in structure. Structural isomers differ in connectivity; stereoisomers differ in spatial arrangement.</p>",
            },
          ],
          quiz: {
            title: "Isomerism — reflection",
            required: false,
            questions: [
              {
                type: QuestionType.OPEN_QUESTION,
                prompt:
                  "In your own words, explain the difference between a structural isomer and a stereoisomer.",
                explanation:
                  "Structural isomers have the same molecular formula but differ in how their atoms are connected, while stereoisomers have the same connectivity but differ in the three-dimensional arrangement of their atoms.",
              },
            ],
          },
        },
        {
          title: "Your First Reaction",
          step: 3,
          orderInStep: 0,
          prereqs: [2],
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Your First Reaction</h2><p>Substitution, addition, and elimination are the three reaction families you'll meet first. We'll trace electrons through each.</p>",
            },
          ],
        },
        {
          title: "Nomenclature",
          step: 2,
          orderInStep: 1,
          prereqs: [1],
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Nomenclature</h2><p>IUPAC names are built from three parts: a <strong>parent chain</strong>, <strong>substituents</strong>, and a <strong>suffix</strong> for the main functional group.</p><ol><li>Find the longest carbon chain.</li><li>Number it so substituents get the lowest locants.</li><li>List substituents alphabetically.</li></ol><blockquote>Example: CH₃CH₂OH is <em>ethanol</em> — a two-carbon chain (eth-) with an alcohol suffix (-ol).</blockquote>",
            },
          ],
        },
        {
          title: "Stereochemistry",
          step: 3,
          orderInStep: 1,
          prereqs: [2],
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Stereochemistry</h2><p>A carbon bonded to four different groups is a <strong>stereocenter</strong>. Its two mirror-image arrangements are <em>enantiomers</em>: same connectivity, different handedness.</p><ul><li>Assign priorities with the Cahn–Ingold–Prelog rules.</li><li>Label each stereocenter <em>R</em> or <em>S</em>.</li></ul>",
            },
          ],
        },
        {
          title: "Reaction Mechanisms",
          step: 4,
          orderInStep: 0,
          prereqs: [3, 4],
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Reaction Mechanisms</h2><p>A mechanism is the step-by-step story of a reaction: which bonds break, which form, and in what order. Curved arrows track electron pairs from <strong>nucleophile</strong> to <strong>electrophile</strong>.</p><blockquote>Tip: every arrow starts at electrons — a lone pair or a bond — never at a positive charge.</blockquote>",
            },
          ],
        },
      ],
    },
  },
  {
    title: "Foundations of Physics",
    description:
      "Build intuition for motion, forces, and energy with bite-sized lessons and checkpoints.",
    status: CourseStatus.PUBLISHED,
    tree: {
      title: "Classical Mechanics Basics",
      description: "From kinematics to conservation of energy.",
      nodes: [
        {
          title: "Kinematics",
          step: 1,
          orderInStep: 0,
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Kinematics</h2><p>Kinematics describes motion: position, velocity, and acceleration — without yet asking <em>why</em> things move.</p>",
            },
          ],
          quiz: {
            title: "Kinematics — quick check",
            required: true,
            questions: [
              {
                type: QuestionType.SINGLE_CHOICE,
                prompt: "Velocity is the rate of change of…",
                explanation:
                  "Velocity describes how an object's position changes over time, while acceleration describes how velocity changes over time.",
                options: [
                  { text: "Position", isCorrect: true },
                  { text: "Acceleration" },
                  { text: "Mass" },
                ],
              },
            ],
          },
        },
        {
          title: "Newton's Laws",
          step: 2,
          orderInStep: 0,
          prereqs: [0],
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Newton's Laws</h2><p>Three laws connect force and motion. The second, <strong>F = ma</strong>, is the workhorse of mechanics.</p>",
            },
          ],
        },
        {
          title: "Energy & Work",
          step: 3,
          orderInStep: 0,
          prereqs: [1],
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Energy &amp; Work</h2><p>Work transfers energy. In a closed system, total mechanical energy is conserved.</p>",
            },
          ],
        },
      ],
    },
  },
  {
    title: "Cell Biology",
    description:
      "Explore the building blocks of life — from organelles to the processes that keep cells alive.",
    status: CourseStatus.PUBLISHED,
    tree: {
      title: "Inside the Cell",
      description: "A tour of the eukaryotic cell.",
      nodes: [
        {
          title: "The Cell Membrane",
          step: 1,
          orderInStep: 0,
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>The Cell Membrane</h2><p>The phospholipid bilayer is selectively permeable, controlling what enters and leaves the cell.</p>",
            },
          ],
        },
        {
          title: "Organelles",
          step: 2,
          orderInStep: 0,
          prereqs: [0],
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Organelles</h2><p>The nucleus, mitochondria, and ER each play a specialized role — like rooms in a factory.</p>",
            },
          ],
        },
      ],
    },
  },
  {
    title: "Linear Algebra",
    description: "Vectors, matrices, and transformations. (In development.)",
    status: CourseStatus.DRAFT,
    tree: {
      title: "Vectors & Matrices",
      description: "Draft outline.",
      nodes: [
        {
          title: "Vectors",
          step: 1,
          orderInStep: 0,
          lessons: [
            {
              type: ContentType.HTML,
              html: "<h2>Vectors</h2><p>Draft lesson — coming soon.</p>",
            },
          ],
        },
      ],
    },
  },
  {
    title: "Web Accessibility",
    description: "Build interfaces everyone can use. (In development.)",
    status: CourseStatus.DRAFT,
  },
];

// ---------------------------------------------------------------------------
// Demo activity: classmates for the leaderboard + the local learner's history
// ---------------------------------------------------------------------------

type SeededQuestion = {
  id: string;
  type: QuestionType;
  correctOptionIds: string[];
  canonicalAnswer: string | null;
};
type SeededNode = {
  id: string;
  xpReward: number;
  quiz?: { id: string; required: boolean; questions: SeededQuestion[] };
};
type SeededContent = Map<string, Map<string, SeededNode>>;

// Mirrors the API's awards: completing a node pays node.xpReward
// ("node_completion"); passing a quiz pays QUIZ_PASS_XP ("quiz_pass",
// apps/api/src/graphql/mutations/quiz.mutations.ts).
const QUIZ_PASS_XP = 100;

type Completion = {
  course: string;
  node: string;
  // Complete via a passing quiz attempt (quiz XP) instead of node-completion
  // XP. Defaults to true when the node has a required quiz.
  viaQuiz?: boolean;
};

type ActivityPlan = {
  // Oldest first. The most recent `streak` completions land on consecutive
  // days ending `lastActiveDaysAgo`; earlier ones are spaced out before that.
  completed: Completion[];
  inProgress?: { course: string; node: string }[];
  streak: number;
  longestStreak: number;
  lastActiveDaysAgo: number;
};

// Synthetic classmates (no Firebase accounts; they only appear on the
// leaderboard). Removed and recreated on every run.
const DEMO_LEARNER_ID_PREFIX = "demo-learner-";

const OC = "Organic Chemistry";
const PHY = "Foundations of Physics";
const BIO = "Cell Biology";
const ORGANIC_PATH = [
  "Atoms & Bonding",
  "Functional Groups",
  "Isomerism",
  "Nomenclature",
  "Your First Reaction",
  "Stereochemistry",
  "Reaction Mechanisms",
].map((node) => ({ course: OC, node }));
const PHYSICS_PATH = ["Kinematics", "Newton's Laws", "Energy & Work"].map((node) => ({
  course: PHY,
  node,
}));
const BIOLOGY_PATH = ["The Cell Membrane", "Organelles"].map((node) => ({ course: BIO, node }));

const DEMO_CLASSMATES: { slug: string; name: string; interests: string[]; plan: ActivityPlan }[] = [
  {
    slug: "maya",
    name: "Maya Chen",
    interests: ["Chemistry", "Biology"],
    plan: {
      completed: [...ORGANIC_PATH, ...PHYSICS_PATH, ...BIOLOGY_PATH],
      streak: 21,
      longestStreak: 21,
      lastActiveDaysAgo: 0,
    },
  },
  {
    slug: "jordan",
    name: "Jordan Ellis",
    interests: ["Chemistry", "Physics"],
    plan: {
      completed: [...ORGANIC_PATH.slice(0, 5), ...PHYSICS_PATH.slice(0, 2)],
      streak: 12,
      longestStreak: 15,
      lastActiveDaysAgo: 0,
    },
  },
  {
    slug: "leo",
    name: "Leo Martins",
    interests: ["Physics", "Mathematics"],
    plan: {
      completed: [...PHYSICS_PATH, ORGANIC_PATH[0], ORGANIC_PATH[1], ORGANIC_PATH[3]],
      // Lapsed streak: last active almost a week ago.
      streak: 0,
      longestStreak: 8,
      lastActiveDaysAgo: 6,
    },
  },
  {
    // Sits just above the local learner (300 vs 250 XP), so passing the Atoms &
    // Bonding quiz live in the demo (+100 XP) moves the learner up a rank.
    slug: "priya",
    name: "Priya Raman",
    interests: ["Physics", "Biology"],
    plan: {
      completed: [...PHYSICS_PATH, ...BIOLOGY_PATH],
      streak: 7,
      longestStreak: 7,
      lastActiveDaysAgo: 1,
    },
  },
  {
    slug: "sam",
    name: "Sam Okafor",
    interests: ["Chemistry", "Biology"],
    plan: {
      completed: [ORGANIC_PATH[0], ORGANIC_PATH[1], BIOLOGY_PATH[0]],
      inProgress: [{ course: OC, node: "Isomerism" }],
      streak: 3,
      longestStreak: 5,
      lastActiveDaysAgo: 0,
    },
  },
  {
    slug: "noah",
    name: "Noah Kim",
    interests: ["Chemistry"],
    plan: {
      completed: [ORGANIC_PATH[0], ORGANIC_PATH[1]],
      streak: 2,
      longestStreak: 4,
      lastActiveDaysAgo: 1,
    },
  },
  {
    slug: "ava",
    name: "Ava Thompson",
    interests: ["Biology", "Earth science"],
    plan: {
      completed: [BIOLOGY_PATH[0]],
      inProgress: [{ course: BIO, node: "Organelles" }],
      streak: 1,
      longestStreak: 1,
      lastActiveDaysAgo: 0,
    },
  },
];

// The local learner: 250 XP across all three published courses and a 4-day
// streak last extended yesterday, with Functional Groups in progress (the
// Continue card). Atoms & Bonding is complete but its quiz has no attempt, so
// passing that quiz during the demo still awards XP and extends the streak.
const LEARNER_PLAN: ActivityPlan = {
  completed: [
    { course: OC, node: "Atoms & Bonding", viaQuiz: false },
    { course: PHY, node: "Kinematics" },
    { course: PHY, node: "Newton's Laws" },
    { course: BIO, node: "The Cell Membrane" },
  ],
  inProgress: [{ course: OC, node: "Functional Groups" }],
  streak: 4,
  longestStreak: 9,
  lastActiveDaysAgo: 1,
};

// Mid-afternoon UTC `daysAgo` days back; "today" is a few minutes ago.
function dayAt(daysAgo: number): Date {
  if (daysAgo <= 0) return new Date(Date.now() - 5 * 60 * 1000);
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(16, 0, 0, 0);
  return d;
}

// Same bucketing as awardXp (apps/api/src/services/xp.ts): Monday, UTC.
function weekKey(date: Date): string {
  const day = date.getUTCDay();
  const weekStart = new Date(date);
  weekStart.setUTCDate(date.getUTCDate() - (day === 0 ? 6 : day - 1));
  return weekStart.toISOString().slice(0, 10);
}

function lookupNode(content: SeededContent, course: string, node: string): SeededNode {
  const found = content.get(course)?.get(node);
  if (!found) throw new Error(`Demo activity references unknown node "${course} / ${node}"`);
  return found;
}

// Writes progress, quiz attempts, XP events, UserXp and UserStreak for one
// user, the way the API would have recorded them.
async function seedUserActivity(userId: string, plan: ActivityPlan, content: SeededContent) {
  const events: { amount: number; at: Date }[] = [];
  const total = plan.completed.length;
  const streakRun = Math.min(plan.streak, total);

  for (let i = 0; i < total; i++) {
    const { course, node: title, viaQuiz } = plan.completed[i];
    const node = lookupNode(content, course, title);

    const fromNewest = total - 1 - i;
    const daysAgo =
      plan.lastActiveDaysAgo +
      (fromNewest < streakRun ? fromNewest : streakRun + (fromNewest - streakRun + 1) * 2);
    const at = dayAt(daysAgo);

    await prisma.userNodeProgress.create({
      data: {
        userId,
        nodeId: node.id,
        status: ProgressStatus.COMPLETED,
        completedAt: at,
        createdAt: at,
        updatedAt: at,
      },
    });

    if (node.quiz && (viaQuiz ?? node.quiz.required)) {
      await prisma.quizAttempt.create({
        data: {
          quizId: node.quiz.id,
          userId,
          passed: true,
          takenAt: at,
          answers: {
            create: node.quiz.questions.map((q) => ({
              questionId: q.id,
              answer:
                q.type === QuestionType.FILL
                  ? { text: (q.canonicalAnswer ?? "").trim() }
                  : { selectedOptionIds: q.correctOptionIds },
              isCorrect: true,
            })),
          },
        },
      });
      await prisma.xpEvent.create({
        data: {
          userId,
          amount: QUIZ_PASS_XP,
          reason: "quiz_pass",
          rewardKey: node.quiz.id,
          metadata: { quizId: node.quiz.id },
          createdAt: at,
        },
      });
      events.push({ amount: QUIZ_PASS_XP, at });
    } else {
      await prisma.xpEvent.create({
        data: {
          userId,
          amount: node.xpReward,
          reason: "node_completion",
          rewardKey: node.id,
          metadata: { nodeId: node.id },
          createdAt: at,
        },
      });
      events.push({ amount: node.xpReward, at });
    }
  }

  for (const { course, node: title } of plan.inProgress ?? []) {
    const at = dayAt(plan.lastActiveDaysAgo);
    await prisma.userNodeProgress.create({
      data: {
        userId,
        nodeId: lookupNode(content, course, title).id,
        status: ProgressStatus.IN_PROGRESS,
        createdAt: at,
        updatedAt: at,
      },
    });
  }

  if (events.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const weeklyXp: Record<string, number> = {};
  for (const e of events) weeklyXp[weekKey(e.at)] = (weeklyXp[weekKey(e.at)] ?? 0) + e.amount;
  const totalXp = events.reduce((sum, e) => sum + e.amount, 0);
  const latest = events.reduce((a, b) => (b.at > a.at ? b : a)).at;

  await prisma.userXp.create({
    data: {
      userId,
      totalXp,
      todayXp: events
        .filter((e) => e.at.toISOString().slice(0, 10) === today)
        .reduce((sum, e) => sum + e.amount, 0),
      todayAsOf: latest,
      weeklyXp,
    },
  });
  await prisma.userStreak.create({
    data: {
      userId,
      currentDays: plan.streak,
      longestDays: Math.max(plan.longestStreak, plan.streak),
      lastActive: latest,
    },
  });

  return totalXp;
}

async function seedDemoActivity(content: SeededContent) {
  // Classmates: remove and recreate (cascades to their progress, XP, streaks).
  await prisma.user.deleteMany({ where: { id: { startsWith: DEMO_LEARNER_ID_PREFIX } } });
  for (const c of DEMO_CLASSMATES) {
    const user = await prisma.user.create({
      data: {
        id: `${DEMO_LEARNER_ID_PREFIX}${c.slug}`,
        email: `${c.slug}.demo@local.dev`,
        name: c.name,
        role: Role.USER,
        interests: c.interests,
        dailyGoalMinutes: 15,
        onboardingComplete: true,
      },
    });
    const xp = await seedUserActivity(user.id, c.plan, content);
    console.log(`   • classmate ${c.name}: ${xp} XP, ${c.plan.streak}-day streak`);
  }

  const learner = await prisma.user.findUnique({ where: { email: LEARNER_EMAIL } });
  if (!learner) {
    console.log(
      `   • (skipped learner activity — run 'pnpm db:seed:local-users' first to create ${LEARNER_EMAIL})`,
    );
    return;
  }

  // Reset the learner's gamification state so re-runs give the same starting
  // point (their progress and quiz attempts on demo content were already
  // removed with the old demo courses).
  await prisma.xpEvent.deleteMany({ where: { userId: learner.id } });
  await prisma.userXp.deleteMany({ where: { userId: learner.id } });
  await prisma.userStreak.deleteMany({ where: { userId: learner.id } });
  await prisma.user.update({
    where: { id: learner.id },
    data: {
      interests: ["Chemistry", "Physics", "Biology"],
      dailyGoalMinutes: 15,
      onboardingComplete: true,
    },
  });

  const xp = await seedUserActivity(learner.id, LEARNER_PLAN, content);
  console.log(`   • ${LEARNER_EMAIL}: ${xp} XP, ${LEARNER_PLAN.streak}-day streak`);
}

async function main() {
  console.log("➡️  Seeding demo content…");

  // 1. Synthetic author (admins can manage these courses regardless of author).
  const author = await prisma.user.upsert({
    where: { id: DEMO_AUTHOR_ID },
    update: {},
    create: {
      id: DEMO_AUTHOR_ID,
      email: DEMO_AUTHOR_EMAIL,
      name: "Demo Author",
      role: Role.ADMIN,
    },
  });

  // 2. Clean any prior demo content (cascades to trees/nodes/lessons/quizzes/progress).
  const removed = await prisma.course.deleteMany({ where: { authorId: author.id } });
  if (removed.count) console.log(`   cleaned ${removed.count} existing demo course(s)`);

  // Everything created below, keyed by course title then node title, so the
  // activity seed (step 3) can reference real ids.
  const seeded = new Map<string, Map<string, SeededNode>>();

  for (const c of COURSES) {
    const course = await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        status: c.status,
        authorId: author.id,
      },
    });

    if (!c.tree) {
      console.log(`   • ${c.title} (${c.status})`);
      continue;
    }

    const tree = await prisma.skillTree.create({
      data: { courseId: course.id, title: c.tree.title, description: c.tree.description },
    });

    // Create nodes first (so prerequisites can reference real ids). posX/posY
    // are percentages (0-100) of the builder canvas, laid out on a 5% grid and
    // kept in bounds. Distinct per (orderInStep, step), which satisfies
    // @@unique([treeId, posX, posY]).
    const nodeIds: string[] = [];
    const seededNodes = new Map<string, SeededNode>();
    for (const n of c.tree.nodes) {
      const node = await prisma.skillNode.create({
        data: {
          treeId: tree.id,
          title: n.title,
          step: n.step,
          orderInStep: n.orderInStep,
          posX: Math.min(90, 20 + n.orderInStep * 20),
          posY: Math.min(90, 15 + n.step * 15),
        },
      });
      nodeIds.push(node.id);
      const seededNode: SeededNode = { id: node.id, xpReward: node.xpReward ?? 50 };
      seededNodes.set(n.title, seededNode);

      // Lessons
      await prisma.lessonBlocks.createMany({
        data: n.lessons.map((l, i) => ({
          nodeId: node.id,
          type: l.type,
          html: l.html ?? null,
          url: l.url ?? null,
          caption: l.caption ?? null,
          order: i,
          status: LessonStatus.PUBLISHED,
        })),
      });

      // Quiz + questions + options
      if (n.quiz) {
        const quiz = await prisma.quiz.create({
          data: { nodeId: node.id, title: n.quiz.title, required: n.quiz.required ?? false },
        });
        seededNode.quiz = { id: quiz.id, required: quiz.required, questions: [] };
        for (let qi = 0; qi < n.quiz.questions.length; qi++) {
          const q = n.quiz.questions[qi];
          const question = await prisma.quizQuestion.create({
            data: {
              quizId: quiz.id,
              type: q.type,
              prompt: q.prompt,
              explanation: q.explanation,
              canonicalAnswer: q.canonicalAnswer ?? null,
              order: qi,
            },
          });
          let correctOptionIds: string[] = [];
          if (q.options?.length) {
            const options = await prisma.quizOption.createManyAndReturn({
              data: q.options.map((o) => ({
                questionId: question.id,
                text: o.text,
                isCorrect: o.isCorrect ?? false,
              })),
            });
            correctOptionIds = options.filter((o) => o.isCorrect).map((o) => o.id);
          }
          seededNode.quiz.questions.push({
            id: question.id,
            type: q.type,
            correctOptionIds,
            canonicalAnswer: q.canonicalAnswer ?? null,
          });
        }
      }
    }

    // Prerequisites (gating) now that all node ids exist.
    for (let i = 0; i < c.tree.nodes.length; i++) {
      for (const dep of c.tree.nodes[i].prereqs ?? []) {
        await prisma.skillNodePrerequisite.create({
          data: { nodeId: nodeIds[i], dependsOnNodeId: nodeIds[dep] },
        });
      }
    }

    seeded.set(c.title, seededNodes);
    console.log(`   • ${c.title} (${c.status}) — ${c.tree.nodes.length} node(s)`);
  }

  // 3. Learner activity: demo classmates (so the leaderboard has a field) and
  //    progress / XP / streak for the real local learner.
  await seedDemoActivity(seeded);

  console.log("✅ Demo content seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
