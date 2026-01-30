import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColorPicker } from "../components/Colorpicker";
import { graphqlClient } from "../lib/graphql";
import { useToast } from "../components/Toast";

const GET_MY_SKILL_TREES = `
  query GetMySkillTrees {
    adminMySkillTrees(limit: 100) {
      id
      title
      course {
        id
        title
      }
    }
  }
`;

const CREATE_FIRST_SKILL_NODE_MUTATION = `
  mutation CreateFirstSkillNode($input: CreateFirstSkillNodeInput!) {
    createFirstSkillNode(input: $input) {
      id
      title
      color
      step
      orderInStep
    }
  }
`;

interface SkillTree {
  id: string;
  title: string;
  course: {
    id: string;
    title: string;
  };
}

interface GetMySkillTreesResponse {
  adminMySkillTrees: SkillTree[];
}

interface CreateFirstSkillNodeResponse {
  createFirstSkillNode: {
    id: string;
    title: string;
    color: string | null;
    step: number;
    orderInStep: number;
  };
}

export function CreateSkillNodePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    treeId: "",
    description: "",
    nodeColor: "#10b981",
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTrees, setLoadingTrees] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skillTrees, setSkillTrees] = useState<SkillTree[]>([]);

  useEffect(() => {
    loadSkillTrees();
  }, []);

  const loadSkillTrees = async () => {
    try {
      const response = await graphqlClient.query<GetMySkillTreesResponse>(
        GET_MY_SKILL_TREES
      );
      setSkillTrees(response.adminMySkillTrees || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load skill trees";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoadingTrees(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await graphqlClient.mutation<CreateFirstSkillNodeResponse>(
        CREATE_FIRST_SKILL_NODE_MUTATION,
        {
          input: {
            treeId: formData.treeId,
            title: formData.title,
            color: formData.nodeColor,
          },
        }
      );

      showToast(`Skill Node "${response.createFirstSkillNode.title}" created successfully!`, "success");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create skill node";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
        Create New Skill Node
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

        {/* Tree Selection */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="treeId"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            Skill Tree *
          </label>
          <select
            id="treeId"
            required
            value={formData.treeId}
            onChange={(e) =>
              setFormData({ ...formData, treeId: e.target.value })
            }
            disabled={loadingTrees || loading}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "0.375rem",
              fontSize: "1rem",
            }}
          >
            <option value="">
              {loadingTrees ? "Loading skill trees..." : "Select a skill tree..."}
            </option>
            {skillTrees.map((tree) => (
              <option key={tree.id} value={tree.id}>
                {tree.course.title} → {tree.title}
              </option>
            ))}
          </select>
        </div>

        {/* Node Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="title"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            Node Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., HTML Basics"
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
            placeholder="What will students learn in this node?"
            rows={3}
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

        {/* Node Color */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            Node Color
          </label>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.75rem" }}>
            This color will be used in the skill tree visualization
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{
                width: "60px",
                height: "60px",
                background: formData.nodeColor,
                borderRadius: "0.5rem",
                border: "2px solid #ccc",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              title="Click to change color"
            />
            <div>
              <div style={{ fontFamily: "monospace", fontSize: "1.125rem" }}>
                {formData.nodeColor}
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
                initialColor={formData.nodeColor}
                onConfirm={(hex) => {
                  setFormData({ ...formData, nodeColor: hex });
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
            disabled={loading || loadingTrees}
            style={{
              padding: "0.75rem 1.5rem",
              background: loading || loadingTrees ? "#9ca3af" : formData.nodeColor,
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: loading || loadingTrees ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            {loading ? "Creating..." : "Create Node"}
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
          Node Preview
        </h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "150px",
              height: "150px",
              background: formData.nodeColor,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.125rem",
              textAlign: "center",
              padding: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            {formData.title || "Node"}
          </div>
        </div>
        {formData.description && (
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            {formData.description}
          </p>
        )}
      </div>
    </div>
  );
}
