import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorPicker } from "../components/Colorpicker";
import { graphqlClient } from "../lib/graphql";
import { useToast } from "../components/Toast";

const CREATE_COURSE_MUTATION = `
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      description
      brandColor
      status
    }
  }
`;

interface CreateCourseResponse {
  createCourse: {
    id: string;
    title: string;
    description: string | null;
    brandColor: string | null;
    status: string;
  };
}

export function CreateCoursePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    brandColor: "#3b82f6",
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await graphqlClient.mutation<CreateCourseResponse>(
        CREATE_COURSE_MUTATION,
        {
          input: {
            title: formData.title,
            description: formData.description || null,
            brandColor: formData.brandColor,
          },
        }
      );

      showToast(`Course "${response.createCourse.title}" created successfully!`, "success");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create course";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
        Create New Course
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "#fee2e2",
              border: "1px solid #ef4444",
              borderRadius: "0.375rem",
              color: "#dc2626",
            }}
          >
            {error}
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="title"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            Course Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., Frontend Foundations"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.375rem",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="description"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your course..."
            rows={4}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.375rem",
              fontSize: "1rem",
              resize: "vertical",
            }}
          />
        </div>

        {/* Brand Color */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            Brand Color
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{
                width: "60px",
                height: "60px",
                background: formData.brandColor,
                borderRadius: "0.5rem",
                border: "2px solid #ccc",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              title="Click to change color"
            />
            <div>
              <div style={{ fontFamily: "monospace", fontSize: "1.125rem" }}>
                {formData.brandColor}
              </div>
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                style={{
                  marginTop: "0.25rem",
                  padding: "0.25rem 0.75rem",
                  background: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                {showColorPicker ? "Close Picker" : "Change Color"}
              </button>
            </div>
          </div>

          {showColorPicker && (
            <div style={{ marginTop: "1rem", position: "relative" }}>
              <ColorPicker
                initialColor={formData.brandColor}
                onConfirm={(hex) => {
                  setFormData({ ...formData, brandColor: hex });
                  setShowColorPicker(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              background: loading ? "#9ca3af" : formData.brandColor,
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Preview */}
      <div
        style={{
          marginTop: "3rem",
          padding: "1.5rem",
          background: "#f9fafb",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
          Preview
        </h2>
        <div
          style={{
            padding: "1.5rem",
            background: "white",
            borderRadius: "0.5rem",
            borderLeft: `4px solid ${formData.brandColor}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
            {formData.title || "Course Title"}
          </h3>
          <p style={{ color: "#6b7280" }}>
            {formData.description || "Course description will appear here..."}
          </p>
        </div>
      </div>
    </div>
  );
}
