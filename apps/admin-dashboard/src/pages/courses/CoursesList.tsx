import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useAdminGetAllCoursesQuery, AdminGetAllCoursesDocument, CourseStatus } from "@synth-tree/api-types";
import type { AdminGetAllCoursesQuery } from "@synth-tree/api-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Plus,
  Eye,
  EyeOff,
  FlaskConical,
  LayoutGrid,
  List,
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
} from "@synth-tree/ui";

// ─── 1. GRAPHQL ───────────────────────────────────────────────────────────────

const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      id
    }
  }
`;

const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
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

type Course = NonNullable<AdminGetAllCoursesQuery["adminGetAllCourses"]>[number];

// ─── 3. HELPERS ───────────────────────────────────────────────────────────────

function relativeTime(dateInput: string | Date): string {
  const diffMs = Date.now() - new Date(dateInput).getTime();

  const minutes = Math.floor(diffMs / 60_000);
  const hours   = Math.floor(diffMs / 3_600_000);
  const days    = Math.floor(diffMs / 86_400_000);
  const weeks   = Math.floor(days / 7);
  const months  = Math.floor(days / 30);

  if (minutes < 1)  return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24)   return `${hours}h ago`;
  if (days < 7)     return `${days}d ago`;
  if (weeks < 5)    return `${weeks}w ago`;
  return `${months}mo ago`;
}

// ─── 4. SUB-COMPONENTS ────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: CourseStatus }) => {
  const isPublished = status === CourseStatus.Published;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded"
      style={
        isPublished
          ? { background: "hsl(142 70% 95%)", color: "hsl(142 60% 30%)" }
          : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
      }
    >
      {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      {isPublished ? "Published" : "Draft"}
    </span>
  );
};

const HexIcon = ({ size = 64 }: { size?: number }) => (
  <div
    className="bg-blue-500 flex items-center justify-center mb-4"
    style={{
      width: size,
      height: size,
      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    }}
  >
    <FlaskConical style={{ width: size * 0.5, height: size * 0.5 }} className="text-white" />
  </div>
);

const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-xl p-6 animate-pulse">
    <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4" />
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/3 mt-3" />
  </div>
);

const NewCourseCard = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow min-h-[220px] w-full text-gray-500 hover:text-gray-700"
  >
    <Plus className="w-7 h-7 mb-2" />
    <span className="text-base font-semibold">New course</span>
    <span className="text-xs mt-1 text-gray-400">Start from blank or template</span>
  </button>
);

// ─── 5. COURSE CARD ───────────────────────────────────────────────────────────

type CourseCardProps = {
  course: Course;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onEdit: (id: string) => void;
};

const CourseCard = ({ course, onDelete, onPublish, onEdit }: CourseCardProps) => (
  <div
    className="border border-gray-200 rounded-xl p-6 relative hover:shadow-md transition-shadow cursor-pointer"
    onClick={() => onEdit(course.id)}
  >
    <div className="absolute top-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(course.id); }}>
            Edit course
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPublish(course.id); }}>
            {course.status === CourseStatus.Published ? "Unpublish" : "Publish course"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(course.id); }}
          >
            Delete course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <HexIcon />
    <h3 style={{ fontSize: 17, fontWeight: 600, margin: "16px 0 14px" }}>{course.title}</h3>
    <div className="flex items-center justify-between">
      <StatusBadge status={course.status} />
      <span className="text-xs text-gray-400">edited {relativeTime(course.updatedAt)}</span>
    </div>
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
          <DialogTitle>New course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium block mb-1">
              Name <span className="text-red-500">*</span>
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
              {loading ? "Creating..." : "Create"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ─── 7. MAIN PAGE ─────────────────────────────────────────────────────────────

const CoursesList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const { data, loading, error } = useAdminGetAllCoursesQuery();

  const [deleteCourse] = useMutation(DELETE_COURSE, {
    refetchQueries: [{ query: AdminGetAllCoursesDocument }],
  });

  const [updateCourse] = useMutation(UPDATE_COURSE, {
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
    const newStatus = course.status === CourseStatus.Published ? CourseStatus.Draft : CourseStatus.Published;
    updateCourse({ variables: { id, input: { status: newStatus } } });
  };

  const handleEdit = (id: string) => {
    navigate(`/courses/${id}/edit`);
  };

  const courses = data?.adminGetAllCourses ?? [];
  const isEmpty = !loading && !error && courses.length === 0;

  return (
    <div className="flex flex-col ml-16 mt-16">

      {/* ── Header ── */}
      <div className="flex justify-between items-end mb-7">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          {!loading && !error && (
            <p className="text-sm text-gray-500 mt-1">
              {courses.length} courses · {courses.filter((c) => c.status === CourseStatus.Published).length} published
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            New course
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
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
        </div>
      )}

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
            New course
          </button>
        </div>
      )}

      {/* ── Grid / List ── */}
      {!loading && !error && courses.length > 0 && (
        viewMode === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
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
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Course</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Edited</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEdit(course.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="bg-blue-500 flex items-center justify-center flex-shrink-0"
                          style={{
                            width: 36,
                            height: 36,
                            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                          }}
                        >
                          <FlaskConical className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{course.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={course.status} /></td>
                    <td className="px-4 py-3 text-gray-400">{relativeTime(course.updatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(course.id); }}>
                            Edit course
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePublish(course.id); }}>
                            {course.status === CourseStatus.Published ? "Unpublish" : "Publish course"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={(e) => { e.stopPropagation(); handleDelete(course.id); }}
                          >
                            Delete course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
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
