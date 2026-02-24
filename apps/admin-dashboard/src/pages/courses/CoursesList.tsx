// apps/admin-dashboard/src/pages/courses/CoursesList.tsx
import { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Menu } from "@headlessui/react";

// ================= GraphQL Queries & Mutations =================
const ADMIN_GET_ALL_COURSES = gql`
  query AdminGetAllCourses($status: CourseStatus, $page: Int, $limit: Int) {
    adminGetAllCourses(status: $status, page: $page, limit: $limit) {
      id
      title
      description
      status
      createdAt
      author {
        name
      }
    }
  }
`;

const ADMIN_DELETE_COURSE = gql`
  mutation AdminDeleteCourse($id: ID!) {
    adminDeleteCourse(id: $id) {
      id
      deletedAt
    }
  }
`;

const ADMIN_CREATE_COURSE = gql`
  mutation AdminCreateCourse(
    $title: String!
    $description: String!
    $status: CourseStatus!
  ) {
    adminCreateCourse(
      data: { title: $title, description: $description, status: $status }
    ) {
      id
      title
      description
      status
      createdAt
      author {
        name
      }
    }
  }
`;

// ================= Component =================
const CoursesList = () => {
  const [statusFilter, setStatusFilter] = useState<
    "DRAFT" | "PUBLISHED" | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    status: "DRAFT",
  });

  const { data, loading, error, refetch } = useQuery(ADMIN_GET_ALL_COURSES, {
    variables: { status: statusFilter, page: 1, limit: 20 },
  });

  const [deleteCourse] = useMutation(ADMIN_DELETE_COURSE, {
    onCompleted: () => refetch(),
  });

  const [createCourse, { loading: creating }] = useMutation(
    ADMIN_CREATE_COURSE,
    {
      onCompleted: () => {
        refetch();
        setIsModalOpen(false);
        setNewCourse({ title: "", description: "", status: "DRAFT" });
      },
    },
  );

  const courses = data?.adminGetAllCourses ?? [];
  const statusColors = {
    DRAFT: "bg-yellow-100 text-yellow-700",
    PUBLISHED: "bg-green-100 text-green-700",
  };
  const hexStyle = {
    clipPath:
      "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsModalOpen(true)}>
          Create Course
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {(["All", "DRAFT", "PUBLISHED"] as const).map((status) => (
          <button
            key={status}
            className={`px-3 py-1 rounded ${
              (
                status === "All"
                  ? statusFilter === undefined
                  : statusFilter === status
              )
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() =>
              setStatusFilter(status === "All" ? undefined : status)
            }>
            {status}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-4 shadow-sm animate-pulse">
              <div
                className="w-16 h-16 mb-4 bg-gray-200 flex items-center justify-center"
                style={hexStyle}
              />
              <div className="h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500 text-center mt-10">
          Something went wrong.
        </div>
      )}

      {/* Empty State */}
      {!loading && courses.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <p>No courses found.</p>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsModalOpen(true)}>
            Create First Course
          </button>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="border rounded-xl p-4 shadow-sm relative">
              {/* Hex Icon */}
              <div
                className="w-16 h-16 mb-4 bg-gray-200 flex items-center justify-center text-white font-bold"
                style={hexStyle}>
                {course.title[0]}
              </div>

              <h2 className="font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-500 mt-2">{course.description}</p>
              <p className="text-xs mt-1">Author: {course.author?.name}</p>

              {/* Status Badge */}
              <span
                className={`inline-block mt-4 px-3 py-1 text-xs rounded-full ${statusColors[course.status]}`}>
                {course.status}
              </span>

              {/* Kebab Menu */}
              <Menu as="div" className="absolute top-2 right-2">
                <Menu.Button className="text-gray-500 hover:text-gray-700">
                  ⋮
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-28 bg-white shadow-lg border rounded">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full text-left px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                        onClick={() => console.log("Edit course", course.id)}>
                        Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full text-left px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                        onClick={() =>
                          deleteCourse({ variables: { id: course.id } })
                        }>
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Course</h2>
            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Title"
              value={newCourse.title}
              onChange={(e) =>
                setNewCourse({ ...newCourse, title: e.target.value })
              }
            />
            <textarea
              className="w-full border p-2 rounded mb-3"
              placeholder="Description"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
            />
            <select
              className="w-full border p-2 rounded mb-3"
              value={newCourse.status}
              onChange={(e) =>
                setNewCourse({ ...newCourse, status: e.target.value })
              }>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border"
                onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={() => createCourse({ variables: { ...newCourse } })}
                disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
