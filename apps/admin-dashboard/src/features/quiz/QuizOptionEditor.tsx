/**
 * QuizOptionEditor.tsx
 *
 * Editable row for a single quiz answer option.
 *
 * Renders:
 *  - Text input for the option label
 *  - Correct/incorrect toggle
 *  - FileUpload (images only) for an optional answer image (ST-118)
 *
 * After a successful image upload the component calls `setQuizOptionImage`
 * to persist the S3 URL to QuizOption.imageUrl.
 *
 * ### Usage
 * ```tsx
 * <QuizOptionEditor
 *   optionId="uuid-..."
 *   text={option.text}
 *   isCorrect={option.isCorrect}
 *   imageUrl={option.imageUrl ?? undefined}
 *   onTextChange={(t) => updateOption({ text: t })}
 *   onCorrectToggle={(v) => updateOption({ isCorrect: v })}
 *   onImageSaved={(url) => updateOption({ imageUrl: url })}
 * />
 * ```
 *
 * Integration: ST-70 (FileUpload) + ST-118 (quiz answer images)
 */

import { useState, useCallback } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { FileUpload } from "../../components/FileUpload";
import { useAuth } from "../../hooks/useAuth";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuizOptionEditorProps {
  /** ID of the QuizOption record to update. */
  optionId: string;

  /** Current answer text. */
  text: string;

  /** Whether this option is marked as a correct answer. */
  isCorrect: boolean;

  /** Existing image URL (edit mode). */
  imageUrl?: string;

  /** Called whenever the text field changes. */
  onTextChange: (value: string) => void;

  /** Called whenever the correct toggle changes. */
  onCorrectToggle: (value: boolean) => void;

  /**
   * Called after the image URL has been successfully persisted to the
   * QuizOption via `setQuizOptionImage`. Use this to update local state.
   */
  onImageSaved?: (url: string) => void;

  /** Called if the save step (after upload) fails. */
  onError?: (message: string) => void;

  /** Disable all editing controls. */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// GraphQL helper
// ---------------------------------------------------------------------------

const SET_QUIZ_OPTION_IMAGE = /* GraphQL */ `
  mutation SetQuizOptionImage($id: ID!, $imageUrl: String) {
    setQuizOptionImage(id: $id, imageUrl: $imageUrl) {
      id
      imageUrl
    }
  }
`;

async function callSetQuizOptionImage(
  id: string,
  imageUrl: string,
  authToken: string
): Promise<void> {
  const apiUrl =
    (import.meta as unknown as { env: Record<string, string> }).env
      .VITE_API_URL ?? "http://localhost:4000";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query: SET_QUIZ_OPTION_IMAGE,
      variables: { id, imageUrl },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed (HTTP ${response.status}): ${response.statusText}`
    );
  }

  const json = (await response.json()) as {
    data?: { setQuizOptionImage?: { id: string } };
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  if (!json.data?.setQuizOptionImage) {
    throw new Error("Unexpected empty response from setQuizOptionImage.");
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuizOptionEditor({
  optionId,
  text,
  isCorrect,
  imageUrl,
  onTextChange,
  onCorrectToggle,
  onImageSaved,
  onError,
  disabled = false,
}: QuizOptionEditorProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [savedImageUrl, setSavedImageUrl] = useState<string | undefined>(
    imageUrl
  );

  const handleImageUploadComplete = useCallback(
    async (publicUrl: string) => {
      setSaving(true);
      try {
        const token = (await user?.getIdToken()) ?? "";
        if (!token) throw new Error("Not authenticated — please log in again.");

        await callSetQuizOptionImage(optionId, publicUrl, token);
        setSavedImageUrl(publicUrl);
        onImageSaved?.(publicUrl);
      } catch (err) {
        const message = (err as Error).message;
        onError?.(message);
        console.error("[QuizOptionEditor] image save failed:", message);
      } finally {
        setSaving(false);
      }
    },
    [optionId, user, onImageSaved, onError]
  );

  const isDisabled = disabled || saving;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
      {/* Row: correct toggle + text input */}
      <div className="flex items-center gap-3">
        {/* Correct/incorrect toggle */}
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => onCorrectToggle(!isCorrect)}
          title={isCorrect ? "Mark as incorrect" : "Mark as correct"}
          className={[
            "flex-shrink-0 rounded-full p-1.5 transition-colors",
            isCorrect
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200",
            isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
        >
          {isCorrect ? <FiCheck size={16} /> : <FiX size={16} />}
        </button>

        {/* Option text */}
        <input
          type="text"
          value={text}
          disabled={isDisabled}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Answer option text…"
          className={[
            "flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-indigo-400",
            isDisabled ? "bg-zinc-50 text-zinc-400" : "bg-white text-zinc-800",
          ].join(" ")}
        />
      </div>

      {/* Image upload */}
      <div className="space-y-1">
        <span className="text-xs font-medium text-zinc-500">
          Optional answer image
        </span>
        <FileUpload
          accept="images"
          value={savedImageUrl}
          onUploadComplete={handleImageUploadComplete}
          disabled={isDisabled}
        />
        {saving && (
          <p className="text-xs text-zinc-500 animate-pulse">
            Saving image to option…
          </p>
        )}
      </div>
    </div>
  );
}

export default QuizOptionEditor;
