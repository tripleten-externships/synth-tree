import { useState, useRef, useEffect } from "react";

type Props = {
  initialColor?: string;
  onConfirm: (hex: string) => void;
};

export function ColorPicker({ initialColor = "#ff0000", onConfirm }: Props) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [value, setValue] = useState(100);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Parse initialColor on mount
  useEffect(() => {
    const hsv = hexToHSV(initialColor);
    setHue(hsv.h);
    setSaturation(hsv.s);
    setValue(hsv.v);
  }, [initialColor]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        const hex = hsvToHex(hue, saturation, value);
        onConfirm(hex);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [hue, saturation, value, onConfirm]);

  const hexColor = hsvToHex(hue, saturation, value);

  return (
    <div ref={pickerRef} style={{ padding: 12, background: "#fff", borderRadius: 8 }}>
      {/* Gradient Square */}
      <div
        style={{
          width: 200,
          height: 200,
          position: "relative",
          background: `
            linear-gradient(to top, black, transparent),
            linear-gradient(to right, white, hsl(${hue}, 100%, 50%))
          `,
          cursor: "crosshair"
        }}
        onMouseDown={(e) => handleSquareDrag(e, setSaturation, setValue)}
      />

      {/* Hue Slider */}
      <div
        style={{
          marginTop: 12,
          height: 16,
          width: 200,
          background:
            "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)",
          position: "relative",
          cursor: "pointer"
        }}
        onMouseDown={(e) => handleHueDrag(e, setHue)}
      />

      {/* Preview + Hex */}
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: hexColor,
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        />
        <span>{hexColor}</span>
      </div>
    </div>
  );
}

function hsvToHex(h: number, s: number, v: number): string {
  s /= 100;
  v /= 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let [r, g, b] = [0, 0, 0];

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHSV(hex: string): { h: number; s: number; v: number } {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // Calculate Value
  const v = max;

  // Calculate Saturation
  const s = max === 0 ? 0 : delta / max;

  // Calculate Hue
  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / delta + 2) / 6;
    } else {
      h = ((r - g) / delta + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function handleSquareDrag(
  e: React.MouseEvent,
  setSaturation: (v: number) => void,
  setValue: (v: number) => void
) {
  const target = e.currentTarget as HTMLDivElement;
  const rect = target.getBoundingClientRect();

  function move(ev: MouseEvent) {
    const x = Math.min(Math.max(ev.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(ev.clientY - rect.top, 0), rect.height);

    const sat = Math.round((x / rect.width) * 100);
    const val = Math.round(100 - (y / rect.height) * 100);

    setSaturation(sat);
    setValue(val);
  }

  move(e as unknown as MouseEvent);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", move);
  }, { once: true });
}

function handleHueDrag(
  e: React.MouseEvent,
  setHue: (v: number) => void
) {
  const target = e.currentTarget as HTMLDivElement;
  const rect = target.getBoundingClientRect();

  function move(ev: MouseEvent) {
    const x = Math.min(Math.max(ev.clientX - rect.left, 0), rect.width);
    const hue = Math.round((x / rect.width) * 360);
    setHue(hue);
  }

  move(e as unknown as MouseEvent);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", move);
  }, { once: true });
}