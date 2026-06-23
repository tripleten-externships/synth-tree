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
 * unpublish/delete these while logged in as admin@local.dev. If learner@local.dev
 * exists, a little progress is seeded for them so the "Recommended next" carousel
 * and progress have data.
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
  options?: { text: string; isCorrect?: boolean }[];
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
              html: "<h2>Atoms &amp; Bonding</h2><p>Organic chemistry is the study of carbon-based molecules. We start with the <strong>covalent bond</strong>: two atoms sharing a pair of electrons.</p><ul><li>Carbon forms four bonds.</li><li>Bonds can be single, double, or triple.</li></ul>",
            },
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
                options: [
                  { text: "2" },
                  { text: "4", isCorrect: true },
                  { text: "6" },
                ],
              },
              {
                type: QuestionType.MULTIPLE_CHOICE,
                prompt: "Which of these are types of covalent bonds? (select all)",
                options: [
                  { text: "Single", isCorrect: true },
                  { text: "Double", isCorrect: true },
                  { text: "Magnetic" },
                  { text: "Triple", isCorrect: true },
                ],
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

  // Collect the node ids of the flagship course so we can seed learner progress.
  let flagshipNodeIds: string[] = [];

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

    // Create nodes first (so prerequisites can reference real ids), with
    // distinct posX/posY to satisfy @@unique([treeId, posX, posY]).
    const nodeIds: string[] = [];
    for (const n of c.tree.nodes) {
      const node = await prisma.skillNode.create({
        data: {
          treeId: tree.id,
          title: n.title,
          step: n.step,
          orderInStep: n.orderInStep,
          posX: n.orderInStep * 200,
          posY: n.step * 200,
        },
      });
      nodeIds.push(node.id);

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
        for (let qi = 0; qi < n.quiz.questions.length; qi++) {
          const q = n.quiz.questions[qi];
          const question = await prisma.quizQuestion.create({
            data: { quizId: quiz.id, type: q.type, prompt: q.prompt, order: qi },
          });
          if (q.options?.length) {
            await prisma.quizOption.createMany({
              data: q.options.map((o) => ({
                questionId: question.id,
                text: o.text,
                isCorrect: o.isCorrect ?? false,
              })),
            });
          }
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

    if (c.title === "Organic Chemistry") flagshipNodeIds = nodeIds;
    console.log(`   • ${c.title} (${c.status}) — ${c.tree.nodes.length} node(s)`);
  }

  // 3. Seed a little progress for the real local learner (if it exists), so the
  //    "Recommended next" carousel and progress have realistic data on login.
  const learner = await prisma.user.findUnique({ where: { email: LEARNER_EMAIL } });
  if (learner && flagshipNodeIds.length >= 2) {
    await prisma.userNodeProgress.upsert({
      where: { userId_nodeId: { userId: learner.id, nodeId: flagshipNodeIds[0] } },
      update: { status: ProgressStatus.COMPLETED, completedAt: new Date() },
      create: {
        userId: learner.id,
        nodeId: flagshipNodeIds[0],
        status: ProgressStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
    await prisma.userNodeProgress.upsert({
      where: { userId_nodeId: { userId: learner.id, nodeId: flagshipNodeIds[1] } },
      update: { status: ProgressStatus.IN_PROGRESS },
      create: {
        userId: learner.id,
        nodeId: flagshipNodeIds[1],
        status: ProgressStatus.IN_PROGRESS,
      },
    });
    console.log(`   • seeded progress for ${LEARNER_EMAIL}`);
  } else {
    console.log(
      `   • (skipped learner progress — run 'pnpm db:seed:local-users' first to create ${LEARNER_EMAIL})`,
    );
  }

  console.log("✅ Demo content seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
