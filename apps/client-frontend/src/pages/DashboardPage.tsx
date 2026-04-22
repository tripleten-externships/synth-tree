import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

// ─── GRAPHQL ──────────────────────────────────────────────────────────────────

const MY_PROGRESS = gql`
  query MyProgress {
    myProgress {
      id
      status
      updatedAt
      completedAt
      node {
        id
        title
        tree {
          id
          title
          course {
            id
            title
          }
        }
      }
    }
  }
`;

// ─── TYPES ────────────────────────────────────────────────────────────────────

type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

type NodeProgress = {
  id: string;
  status: ProgressStatus;
  updatedAt: string;
  completedAt?: string | null;
  node: {
    id: string;
    title: string;
    tree: {
      id: string;
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
};

type CourseGroup = {
  courseId: string;
  courseTitle: string;
  totalNodes: number;
  completedNodes: number;
  inProgressNodes: number;
  completionPercentage: number;
  lastUpdated: string;
  currentNode?: NodeProgress;
};

// ─── MOCK DATA (remove when auth is connected) ────────────────────────────────

const PREVIEW_MODE = true;

const MOCK_PROGRESS: NodeProgress[] = [
  {
    id: "p1",
    status: "COMPLETED",
    updatedAt: "2026-03-30T10:00:00Z",
    completedAt: "2026-03-30T10:00:00Z",
    node: {
      id: "n1",
      title: "Introduction to Atoms",
      tree: { id: "t1", title: "Foundations", course: { id: "c1", title: "Organic Chemistry" } },
    },
  },
  {
    id: "p2",
    status: "COMPLETED",
    updatedAt: "2026-03-31T09:00:00Z",
    completedAt: "2026-03-31T09:00:00Z",
    node: {
      id: "n2",
      title: "Covalent Bonds",
      tree: { id: "t1", title: "Foundations", course: { id: "c1", title: "Organic Chemistry" } },
    },
  },
  {
    id: "p3",
    status: "IN_PROGRESS",
    updatedAt: "2026-04-01T08:00:00Z",
    completedAt: null,
    node: {
      id: "n3",
      title: "Functional Groups",
      tree: { id: "t1", title: "Foundations", course: { id: "c1", title: "Organic Chemistry" } },
    },
  },
  {
    id: "p4",
    status: "COMPLETED",
    updatedAt: "2026-03-28T14:00:00Z",
    completedAt: "2026-03-28T14:00:00Z",
    node: {
      id: "n4",
      title: "The Periodic Table",
      tree: { id: "t2", title: "Core Concepts", course: { id: "c2", title: "Advanced Chemistry" } },
    },
  },
  {
    id: "p5",
    status: "IN_PROGRESS",
    updatedAt: "2026-03-29T11:00:00Z",
    completedAt: null,
    node: {
      id: "n5",
      title: "Electron Configuration",
      tree: { id: "t2", title: "Core Concepts", course: { id: "c2", title: "Advanced Chemistry" } },
    },
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Groups flat progress records by course
function groupByCourse(progressList: NodeProgress[]): CourseGroup[] {
  const map = new Map<string, CourseGroup>();

  for (const p of progressList) {
    const { id: courseId, title: courseTitle } = p.node.tree.course;

    if (!map.has(courseId)) {
      map.set(courseId, {
        courseId,
        courseTitle,
        totalNodes: 0,
        completedNodes: 0,
        inProgressNodes: 0,
        completionPercentage: 0,
        lastUpdated: p.updatedAt,
        currentNode: undefined,
      });
    }

    const group = map.get(courseId)!;
    group.totalNodes += 1;

    if (p.status === "COMPLETED") group.completedNodes += 1;
    if (p.status === "IN_PROGRESS") {
      group.inProgressNodes += 1;
      group.currentNode = p;
    }

    if (p.updatedAt > group.lastUpdated) group.lastUpdated = p.updatedAt;
  }

  // Calculate percentage and sort by most recently updated
  return Array.from(map.values())
    .map((g) => ({
      ...g,
      completionPercentage:
        g.totalNodes === 0 ? 0 : Math.round((g.completedNodes / g.totalNodes) * 100),
    }))
    .sort((a, b) => (a.lastUpdated > b.lastUpdated ? -1 : 1));
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

// Progress bar
const ProgressBar = ({ percentage }: { percentage: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
    <div
      className="bg-blue-500 h-2 rounded-full transition-all"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

// Course progress card
const CourseCard = ({ group }: { group: CourseGroup }) => (
  <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-1">
      <h3 className="font-semibold text-lg">{group.courseTitle}</h3>
      <span className="text-sm font-bold text-blue-600">{group.completionPercentage}%</span>
    </div>

    <ProgressBar percentage={group.completionPercentage} />

    <div className="flex gap-4 mt-3 text-xs text-gray-500">
      <span>{group.completedNodes} completed</span>
      <span>{group.inProgressNodes} in progress</span>
      <span>{group.totalNodes} total nodes</span>
    </div>

    {group.currentNode && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-1">Continue where you left off</p>
        <a
          href={`/skill-trees`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          {group.currentNode.node.title} →
        </a>
      </div>
    )}
  </div>
);

// Recently completed node row
const RecentNode = ({ progress }: { progress: NodeProgress }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div>
      <p className="text-sm font-medium">{progress.node.title}</p>
      <p className="text-xs text-gray-400">{progress.node.tree.course.title}</p>
    </div>
    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
      Completed
    </span>
  </div>
);              

// Loading skeleton
const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-xl p-6 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
    <div className="h-2 bg-gray-200 rounded w-full mb-3" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data, loading, error } = useQuery<{ myProgress: NodeProgress[] }>(MY_PROGRESS, {
    skip: PREVIEW_MODE,
  });

  const progressList: NodeProgress[] = PREVIEW_MODE ? MOCK_PROGRESS : (data?.myProgress ?? []);
  const courseGroups = groupByCourse(progressList);

  const recentlyCompleted = [...progressList]
    .filter((p) => p.status === "COMPLETED")
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
    .slice(0, 5);

  const isEmpty = !loading && !error && courseGroups.length === 0;

  return (
    <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* ── Error state ── */}
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            Failed to load progress. Please try again.
          </div>
        )}

        {/* ── Empty state ── */}
        {isEmpty && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg mb-2">No courses started yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Start a course to track your learning progress here.
            </p>
            <a
              href="/skill-trees"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Browse Courses
            </a>
          </div>
        )}

        {/* ── Course progress grid ── */}
        {(loading || courseGroups.length > 0) && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? [1, 2, 3].map((n) => <SkeletonCard key={n} />)
                : courseGroups.map((group) => (
                    <CourseCard key={group.courseId} group={group} />
                  ))}
            </div>
          </section>
        )}

        {/* ── Recently completed ── */}
        {recentlyCompleted.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Recently Completed</h2>
            <div className="border border-gray-200 rounded-xl px-6 divide-y divide-gray-100">
              {recentlyCompleted.map((p) => (
                <RecentNode key={p.id} progress={p} />
              ))}
            </div>
          </section>
        )}

    </div>
  );
}
