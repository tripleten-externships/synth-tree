import { useState } from "react";
import { ColorPicker } from "../components/Colorpicker";

export function ColorPickerDemoPage() {
  const [selectedColor, setSelectedColor] = useState("#ff0000");
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "2rem",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ 
        maxWidth: "800px", 
        margin: "0 auto",
        background: "white",
        borderRadius: "1rem",
        padding: "2rem",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
      }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "bold", 
          marginBottom: "0.5rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          🎨 Color Picker Demo
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          Interactive HSV color picker with gradient selector and hue slider
        </p>

        {/* Color Picker Section */}
        <div style={{ 
          padding: "2rem", 
          background: "#f9fafb", 
          borderRadius: "0.75rem",
          marginBottom: "2rem"
        }}>
          <button
            onClick={() => setShowPicker(!showPicker)}
            style={{
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              boxShadow: "0 4px 6px rgba(102, 126, 234, 0.4)",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {showPicker ? "Hide" : "Show"} Color Picker
          </button>

          {showPicker && (
            <div style={{ marginTop: "1.5rem", display: "inline-block" }}>
              <ColorPicker
                initialColor={selectedColor}
                onConfirm={(hex) => {
                  setSelectedColor(hex);
                  setShowPicker(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Selected Color Display */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
            Selected Color
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "auto 1fr",
            gap: "1.5rem",
            alignItems: "center"
          }}>
            <div
              style={{
                width: "150px",
                height: "150px",
                background: selectedColor,
                borderRadius: "1rem",
                border: "4px solid white",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              }}
            />
            <div>
              <div style={{ 
                fontFamily: "monospace", 
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "0.5rem"
              }}>
                {selectedColor}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ 
                  padding: "0.25rem 0.75rem", 
                  background: "#e5e7eb", 
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem"
                }}>
                  HEX: {selectedColor}
                </span>
                <span style={{ 
                  padding: "0.25rem 0.75rem", 
                  background: "#e5e7eb", 
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem"
                }}>
                  RGB: {hexToRgb(selectedColor)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ 
          padding: "1.5rem", 
          background: "#f0fdf4", 
          border: "2px solid #86efac",
          borderRadius: "0.75rem"
        }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
            ✨ Features
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", lineHeight: "1.8" }}>
            <li>2D gradient square for saturation/lightness selection</li>
            <li>1D hue spectrum slider (full 360° range)</li>
            <li>Live color preview with hex code</li>
            <li>Click outside to confirm selection</li>
            <li>Parses initial color on mount</li>
            <li>Lightweight - no external dependencies</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "Invalid";
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `${r}, ${g}, ${b}`;
}
