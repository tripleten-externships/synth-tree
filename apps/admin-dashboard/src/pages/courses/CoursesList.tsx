import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
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
} from "@skilltree/ui";

// ─── 1. GRAPHQL ───────────────────────────────────────────────────────────────

const GET_ALL_COURSES = gql`
  query AdminGetAllCourses($status: CourseStatus) {
    adminGetAllCourses(status: $status) {
      id
      title
      description
      status
      author {
        id
        name
        email
      }
    }
  }
`;

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

type CourseStatus = "DRAFT" | "PUBLISHED";
type StatusFilter = "ALL" | CourseStatus;

type Course = {
  id: string;
  title: string;
  description?: string | null;
  status: CourseStatus;
  author: {
    id: string;
    name?: string | null;
    email: string;
  };
};

// ─── 3. SUB-COMPONENTS ────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: CourseStatus }) => {
  const isPublished = status === "PUBLISHED";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        isPublished
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {isPublished ? (
        <Eye className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
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

// ─── 4. COURSE CARD ───────────────────────────────────────────────────────────

type CourseCardProps = {
  course: Course;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  Icon?: LucideIcon;
};

const CourseCard = ({ course, onDelete, onPublish, Icon }: CourseCardProps) => (
  <div className="border border-gray-200 rounded-xl p-6 relative hover:shadow-md transition-shadow">
    <div className="absolute top-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded hover:bg-gray-100">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => alert("TODO: open edit modal")}>
            Edit course
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPublish(course.id)}>
            {course.status === "PUBLISHED" ? "Unpublish course" : "Publish course"}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(course.id)}
          >
            Delete course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <HexIcon Icon={Icon} />
    <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
    {course.description && (
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {course.description}
      </p>
    )}
    <p className="text-xs text-gray-400 mb-3">
      by {course.author.name ?? course.author.email}
    </p>
    <StatusBadge status={course.status} />
  </div>
);

// ─── 5. CREATE COURSE MODAL ───────────────────────────────────────────────────

type CreateCourseModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const CreateCourseModal = ({ open, onClose, onCreated }: CreateCourseModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [createCourse, { loading }] = useMutation(CREATE_COURSE, {
    refetchQueries: [{ query: GET_ALL_COURSES }],
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
            <label className="text-sm font-medium block mb-1">
              Description
            </label>
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

// ─── 6. MAIN PAGE ─────────────────────────────────────────────────────────────

const CoursesList = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  const { data, loading, error } = useQuery<{ adminGetAllCourses: Course[] }>(
    GET_ALL_COURSES,
    {
      variables: statusFilter !== "ALL" ? { status: statusFilter } : {},
    }
  );

  const [deleteCourse] = useMutation(DELETE_COURSE, {
    refetchQueries: [{ query: GET_ALL_COURSES }],
  });

  const [updateCourse] = useMutation(UPDATE_COURSE, {
    refetchQueries: [{ query: GET_ALL_COURSES }],
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteCourse({ variables: { id } });
    }
  };

  const handlePublish = (id: string) => {
    const course = courses.find((c) => c.id === id);
    if (!course) return;
    const newStatus = course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    updateCourse({ variables: { id, input: { status: newStatus } } });
  };

  const courses: Course[] = data?.adminGetAllCourses ?? [];
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

      {/* ── Filter pills ── */}
      <div className="flex gap-2 mb-6">
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

      {/* ── Error state ── */}
      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          Failed to load courses. Please try again.
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-500 text-lg mb-2">No courses yet</p>
          <p className="text-gray-400 text-sm mb-6">
            Get started by creating your first course.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Create First Course
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onDelete={handleDelete}
              onPublish={handlePublish}
            />
          ))}
          <NewCourseCard onClick={() => setModalOpen(true)} />
        </div>
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
