import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastMessage({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: "#10b981", border: "#059669" },
    error: { bg: "#ef4444", border: "#dc2626" },
    info: { bg: "#3b82f6", border: "#2563eb" },
  };

  const { bg, border } = colors[toast.type];

  return (
    <div
      style={{
        background: bg,
        color: "white",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        border: `2px solid ${border}`,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        minWidth: "250px",
        maxWidth: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "1.25rem",
          padding: "0",
          lineHeight: 1,
        }}
        aria-label="Close"
      >
        ×
      </button>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
