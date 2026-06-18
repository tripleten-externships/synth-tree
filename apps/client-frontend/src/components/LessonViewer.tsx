import React, { useState } from "react";
import DOMPurify from "dompurify";
import ReactPlayer from "react-player";
import { useQuery } from "@apollo/client/react";
import type { ContentType } from "@synth-tree/api-types";
import { LESSON_BLOCKS_QUERY } from "../graphql/queries/lessonBlocks";

interface LessonBlock {
  id: string;
  type: ContentType;
  html?: string | null;
  url?: string | null;
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

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  if (loading) return <div>Loading lesson...</div>;
  if (error) return <div>Error loading lesson.</div>;
  if (!data) return <div>No lesson data found.</div>;

  const blocks = [...data.lessonBlocks].sort((a, b) => a.order - b.order);

  const pages = blocks.reduce<LessonBlock[][]>(
    (acc, block) => {
      if (block.type === "PAGE_BREAK") {
        acc.push([]);
        return acc;
      }

      acc[acc.length - 1].push(block);
      return acc;
    },
    [[]],
  );

  const currentPageBlocks = pages[currentPageIndex] ?? [];
  const isLastPage = currentPageIndex === pages.length - 1;

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
        src={block.url ?? ""}
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
      case "HTML":
  return renderHTML(block.html ?? "");
      case "IMAGE":
        return renderImage(block);
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
    <div className="flex gap-2" aria-label="Lesson progress">
      {pages.map((_, index) => (
        <div
          key={index}
          className={`h-2 flex-1 rounded-full ${
            index <= currentPageIndex ? "bg-[#667eea]" : "bg-gray-200"
          }`}
        />
      ))}
    </div>

    <p className="text-sm text-gray-500">
      Page {currentPageIndex + 1} of {pages.length}
    </p>

    {currentPageBlocks.map((block) => (
      <div key={block.id}>{renderBlock(block)}</div>
    ))}

    <button
      className="mt-8 px-8 py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold text-lg rounded-lg cursor-pointer transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
      onClick={() => {
        if (currentPageIndex < pages.length - 1) {
          setCurrentPageIndex(currentPageIndex + 1);
          return;
        }

        onNext();
      }}
    >
      {isLastPage ? "Next" : "Next Page"}
    </button>
    </div>
  );
};
