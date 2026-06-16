import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
  useAdminGetAllCoursesQuery,
  AdminGetAllCoursesDocument,
} from "@synth-tree/api-types";
import type { AdminGetAllCoursesQuery, CourseStatus } from "@synth-tree/api-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Plus,
  Eye,
  TrendingDown,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  toast,
} from "@synth-tree/ui";
import { SkeletonList } from "../../components/SkeletonList";

// ─── 1. GRAPHQL ───────────────────────────────────────────────────────────────

const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      id
    }
  }
`;

const PUBLISH_COURSE = gql`
  mutation PublishCourse($id: ID!) {
    publishCourse(id: $id) {
      id
      status
    }
  }
`;

const UNPUBLISH_COURSE = gql`
  mutation UnpublishCourse($id: ID!) {
    unpublishCourse(id: $id) {
      id
      status
    }
  }
`;

const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
    }
  }
`;

// ─── 2. TYPES ─────────────────────────────────────────────────────────────────

type StatusFilter = "ALL" | CourseStatus;

type Course = NonNullable<AdminGetAllCoursesQuery["adminGetAllCourses"]>[number];

// ─── 3. HELPERS ───────────────────────────────────────────────────────────────

function relativeTime(dateInput: string | Date): string {
  const diffMs = Date.now() - new Date(dateInput).getTime();

  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  return `${months}mo ago`;
}

// ─── 4. SUB-COMPONENTS ────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: CourseStatus }) => {
  const isPublished = status === "PUBLISHED";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {isPublished ? <Eye className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPublished ? "Published" : "Draft"}
    </span>
  );
};

const HexIcon = ({ Icon = FlaskConical }: { Icon?: LucideIcon }) => (
  <div
    className="w-16 h-16 bg-blue-500 flex items-center justify-center mb-4"
    style={{
      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    }}
  >
    <Icon className="w-8 h-8 text-white" />
  </div>
);

const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-xl p-6 animate-pulse">
    <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4" />
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-full mb-1" />
    <div className="h-4 bg-gray-200 rounded w-1/3 mt-3" />
  </div>
);

const NewCourseCard = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow min-h-[180px] w-full"
  >
    <Plus className="w-6 h-6 mb-2 text-gray-500" />
    <span className="text-base font-medium text-gray-700">New course</span>
  </button>
);

// ─── 5. COURSE CARD ───────────────────────────────────────────────────────────

type CourseCardProps = {
  course: Course;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onEdit: (id: string) => void;
  Icon?: LucideIcon;
};

const CourseCard = ({ course, onDelete, onPublish, onEdit, Icon }: CourseCardProps) => (
  <div
    className="border border-gray-200 rounded-xl p-6 relative hover:shadow-md transition-shadow cursor-pointer"
    onClick={() => onEdit(course.id)}
  >
    <div className="absolute top-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit(course.id);
            }}
          >
            Edit course
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onPublish(course.id);
            }}
          >
            {course.status === "PUBLISHED" ? "Unpublish course" : "Publish course"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(course.id);
            }}
          >
            Delete course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <HexIcon Icon={Icon} />
    <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
    <p className="text-xs text-gray-400 mb-1">by {course.author.name ?? "Unknown"}</p>
    <p className="text-xs text-gray-400 mb-3">edited {relativeTime(course.updatedAt)}</p>

    <StatusBadge status={course.status} />
  </div>
);

// ─── 6. CREATE COURSE MODAL ───────────────────────────────────────────────────

type CreateCourseModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const CreateCourseModal = ({ open, onClose, onCreated }: CreateCourseModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [createCourse, { loading }] = useMutation(CREATE_COURSE, {
    refetchQueries: [{ query: AdminGetAllCoursesDocument }],
    onCompleted: () => {
      setTitle("");
      setDescription("");
      onCreated();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createCourse({ variables: { input: { title, description } } });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium block mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Organic Chemistry"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the course"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ─── 7. MAIN PAGE ─────────────────────────────────────────────────────────────

const CoursesList = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window === "undefined") {
      return "grid";
    }

    try {
      const savedView = window.localStorage.getItem("adminCoursesView");
      return savedView === "grid" || savedView === "list" ? savedView : "grid";
    } catch (error) {
      console.error("Failed to read admin courses view preference:", error);
      return "grid";
    }
  });

  const setAndPersistView = (v: "grid" | "list") => {
    setViewMode(v);
    try {
      window.localStorage.setItem("adminCoursesView", v);
    } catch (error) {
      console.error("Failed to persist admin courses view preference:", error);
    }
  };

  const { data, loading, error } = useAdminGetAllCoursesQuery();

  const [deleteCourse] = useMutation(DELETE_COURSE, {
    refetchQueries: [{ query: AdminGetAllCoursesDocument }],
  });

  const [publishCourse] = useMutation(PUBLISH_COURSE, {
    refetchQueries: [{ query: AdminGetAllCoursesDocument }],
  });

  const [unpublishCourse] = useMutation(UNPUBLISH_COURSE, {
    refetchQueries: [{ query: AdminGetAllCoursesDocument }],
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteCourse({ variables: { id } });
    }
  };

  const handlePublish = (id: string) => {
    const course = courses.find((c) => c.id === id);
    if (!course) return;

    if (course.status === "PUBLISHED") {
      unpublishCourse({ variables: { id } });

      toast("Success!", {
        description: `${course.title} unpublished`,
      });
    } else {
      publishCourse({ variables: { id } });

      toast("Success!", {
        description: `${course.title} published`,
      });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/courses/${id}/edit`);
  };

  const allCourses: Course[] = data?.adminGetAllCourses ?? [];

  const courses =
    statusFilter === "ALL"
      ? allCourses
      : allCourses.filter((c) => c.status === statusFilter);

  const isEmpty = !loading && !error && courses.length === 0;

  const filterOptions: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "ALL" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Draft", value: "DRAFT" },
  ];

  return (
    <div className="flex flex-col ml-16 mt-16">
      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Courses</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      {/* ── Filter pills + view toggle ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Status filter pills on the left */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {/* View toggle (grid / list) on the right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAndPersistView("grid")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setAndPersistView("list")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* ── Error state ── */}
      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          Failed to load courses. Please try again.
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading &&
        (viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <SkeletonList />
        ))}

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-500 text-lg mb-2">No courses yet</p>
          <p className="text-gray-400 text-sm mb-6">Get started by creating your first course.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Create First Course
          </button>
        </div>
      )}

      {/* ── Grid / List views ── */}
      {!loading && !error && courses.length > 0 && (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                  onEdit={handleEdit}
                />
              ))}
              <NewCourseCard onClick={() => setModalOpen(true)} />
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 font-medium">Course</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Chapters</th>
                    <th className="px-4 py-3 font-medium">Learners</th>
                    <th className="px-4 py-3 font-medium">Completion</th>
                    <th className="px-4 py-3 font-medium">Edited</th>
                    <th className="px-4 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-t">
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium text-gray-900">{course.title}</div>
                        <div className="text-xs text-gray-500">by {course.author.name ?? "Unknown"}</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <StatusBadge status={course.status} />
                      </td>
                      <td className="px-4 py-3 align-top">—</td>
                      <td className="px-4 py-3 align-top">—</td>
                      <td className="px-4 py-3 align-top">—</td>
                      <td className="px-4 py-3 align-top">{relativeTime(course.updatedAt)}</td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/courses/${course.id}/edit`)} className="text-sm text-blue-600">Open</button>
                          <button onClick={() => handlePublish(course.id)} className="text-sm text-gray-600">{course.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button>
                          <button onClick={() => handleDelete(course.id)} className="text-sm text-red-600">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Create Course Modal ── */}
      <CreateCourseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => setModalOpen(false)}
      />
    </div>
  );
};

export default CoursesList;
