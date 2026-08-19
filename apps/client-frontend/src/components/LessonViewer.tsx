import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import ReactPlayer from "react-player";
import { useMutation } from "@apollo/client/react";
import { useLessonBlocksByNodeQuery } from "@synth-tree/api-types";
import { START_NODE_PROGRESS } from "../graphql/mutations/startNodeProgress";

interface LessonViewerProps {
  nodeId: string;
  onNext: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ nodeId, onNext }) => {
  const { data, loading, error } = useLessonBlocksByNodeQuery({
    variables: { nodeId },
  });

  const [startNodeProgress] = useMutation(START_NODE_PROGRESS);

  // Mark this node as in-progress when the learner opens the lesson.
  // The mutation is idempotent server-side, so revisits / re-renders are safe.
  useEffect(() => {
    startNodeProgress({ variables: { nodeId } }).catch(() => {
      // Best-effort progress tracking — don't block the lesson on failure.
    });
  }, [nodeId, startNodeProgress]);

  if (loading) return <div>Loading lesson...</div>;
  if (error) return <div>Error loading lesson.</div>;

  const blocks = [...(data?.lessonBlocksByNode ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const renderHTML = (html: string) => (
    <div
      className="leading-relaxed text-gray-800"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );

  const renderImage = (url: string, caption?: string | null) => (
    <figure className="m-0 text-center">
      <img
        src={url}
        alt={caption || "Lesson image"}
        className="max-w-full h-auto rounded-lg shadow-md"
      />
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-500 italic">{caption}</figcaption>
      )}
    </figure>
  );

  const renderVideo = (url: string) => (
    <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-md">
      <div className="absolute top-0 left-0 w-full h-full">
        <ReactPlayer src={url} controls width="100%" height="100%" />
      </div>
    </div>
  );

  const renderEmbed = (url: string) => (
    <div className="relative pt-[56.25%] rounded-lg overflow-hidden shadow-md">
      <iframe
        src={url}
        title="Embedded content"
        className="absolute top-0 left-0 w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );

  const renderBlock = (block: (typeof blocks)[number]) => {
    switch (block.type) {
      case "HTML":
        return renderHTML(block.html ?? "");
      case "IMAGE":
        return renderImage(block.url ?? "", block.caption);
      case "VIDEO":
        return renderVideo(block.url ?? "");
      case "EMBED":
        return renderEmbed(block.url ?? "");
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {blocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}

      <button
        className="mt-8 px-8 py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold text-lg rounded-lg cursor-pointer transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
};
