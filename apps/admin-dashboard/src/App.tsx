import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthFeature } from "./features/auth";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { ColorPicker } from "./components/Colorpicker";
import { CreateCoursePage } from "./pages/CreateCoursePage";
import { CreateSkillNodePage } from "./pages/CreateSkillNodePage";
import { ColorPickerDemoPage } from "./pages/ColorPickerDemoPage";
import { ToastProvider } from "./components/Toast";
import { useState } from "react";

function DashboardPage() {
  const [selectedColor, setSelectedColor] = useState("#ff0000");
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
        Dashboard - Admin Panel
      </h1>

      {/* Navigation Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <a
          href="/courses/create"
          style={{
            display: "block",
            padding: "1.5rem",
            background: "white",
            border: "2px solid #3b82f6",
            borderRadius: "0.5rem",
            textDecoration: "none",
            color: "#1f2937",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            Create Course
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Create a new course with custom branding colors
          </p>
        </a>

        <a
          href="/nodes/create"
          style={{
            display: "block",
            padding: "1.5rem",
            background: "white",
            border: "2px solid #10b981",
            borderRadius: "0.5rem",
            textDecoration: "none",
            color: "#1f2937",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎯</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            Create Skill Node
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Add a new skill node with custom colors to your tree
          </p>
        </a>
      </div>

      <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
      
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Color Picker Test
      </h2>
      
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          style={{
            padding: "0.5rem 1rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          {showPicker ? "Hide" : "Show"} Color Picker
        </button>
      </div>

      {showPicker && (
        <div style={{ marginBottom: "1rem" }}>
          <ColorPicker
            initialColor={selectedColor}
            onConfirm={(hex) => {
              setSelectedColor(hex);
              setShowPicker(false);
              alert(`Color selected: ${hex}`);
            }}
          />
        </div>
      )}

      <div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
          Selected Color:
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              background: selectedColor,
              borderRadius: "0.5rem",
              border: "2px solid #ccc",
            }}
          />
          <span style={{ fontSize: "1.5rem", fontFamily: "monospace" }}>
            {selectedColor}
          </span>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public demo route - no auth required */}
            <Route path="/demo" element={<ColorPickerDemoPage />} />
            <Route path="/auth/*" element={<AuthFeature />} />
            <Route
              path="/*"
              element={
                <ProtectedRoutes>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/courses/create" element={<CreateCoursePage />} />
                    <Route path="/nodes/create" element={<CreateSkillNodePage />} />
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </ProtectedRoutes>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
