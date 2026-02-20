import React from "react";
import DOMPurify from "dompurify";
import ReactPlayer from "react-player";
import { useQuery } from "@apollo/client/react";
import { ContentType } from "@skilltree/api-types";
import { LESSON_BLOCKS_QUERY } from "../graphql/queries/lessonBlocks";

interface LessonBlock {
  id: string;
  type: ContentType;
  content: string;
  caption?: string | null;
  order: number;
}

interface LessonBlocksData {
  lessonBlocks: LessonBlock[];
}

interface LessonViewerProps {
  nodeId: string;
  onNext: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ nodeId, onNext }) => {
  const { data, loading, error } = useQuery<LessonBlocksData>(LESSON_BLOCKS_QUERY, {
    variables: { nodeId },
  });

  if (loading) return <div>Loading lesson...</div>;
  if (error) return <div>Error loading lesson.</div>;
  if (!data) return <div>No lesson data found.</div>;

  const blocks = [...data.lessonBlocks].sort((a, b) => a.order - b.order);

  const renderHTML = (html: string) => (
    <div
      className="leading-relaxed text-gray-800"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html),
      }}
    />
  );

  const renderImage = (block: LessonBlock) => (
    <figure className="m-0 text-center">
      <img
        src={block.content}
        alt={block.caption || "Lesson image"}
        className="max-w-full h-auto rounded-lg shadow-md"
      />
      {block.caption && (
        <figcaption className="mt-3 text-sm text-gray-500 italic">{block.caption}</figcaption>
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

  const renderBlock = (block: LessonBlock) => {
    switch (block.type) {
      case ContentType.Html:
        return renderHTML(block.content);
      case ContentType.Image:
        return renderImage(block);
      case ContentType.Video:
        return renderVideo(block.content);
      case ContentType.Embed:
        return renderEmbed(block.content);
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
