import React from "react";
import DOMPurify from "dompurify";
import ReactPlayer from "react-player";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ContentType } from "@skilltree/api-types";
import "./LessonViewer.css";

const LESSON_BLOCKS_QUERY = gql`
  query LessonBlocks($nodeId: ID!) {
    lessonBlocks(nodeId: $nodeId) {
      id
      type
      content
      caption
      order
    }
  }
`;

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
      className="lesson-html"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html),
      }}
    />
  );

  const renderImage = (block: LessonBlock) => (
    <figure className="lesson-image">
      <img src={block.content} alt={block.caption || "Lesson image"} />
      {block.caption && <figcaption>{block.caption}</figcaption>}
    </figure>
  );

  const renderVideo = (url: string) => {
    return (
      <div className="lesson-video">
        <div className="lesson-video-wrapper">
          <ReactPlayer src={url} controls width="100%" height="100%" />
        </div>
      </div>
    );
  };

  const renderEmbed = (url: string) => (
    <div className="lesson-embed" style={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        src={url}
        title="Embedded content"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
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
    <div className="lesson-viewer">
      {blocks.map((block) => (
        <div key={block.id} className="lesson-block">
          {renderBlock(block)}
        </div>
      ))}

      <button className="next-button" onClick={onNext}>
        Next
      </button>
    </div>
  );
};