// LessonReadBlocks — read-mode renderer for one page of lesson blocks (SYN-32).
// HTML carries the text content (headings, paragraphs, lists, callouts as
// <blockquote>/<aside>) and is styled by `.lesson-prose` in index.css.
import DOMPurify from "dompurify";
import ReactPlayer from "react-player";
import type { LessonBlock } from "../lib/splitLessonPages";

const ALLOWED_EMBED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "vimeo.com",
  "www.vimeo.com",
  "player.vimeo.com",
  "codepen.io",
  "www.codepen.io",
]);

function Caption({ text }: { text?: string | null }) {
  if (!text) return null;
  return <figcaption className="mt-3 text-center text-sm text-muted-foreground">{text}</figcaption>;
}

function HtmlBlock({ html }: { html: string }) {
  return (
    <div className="lesson-prose" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
  );
}

function ImageBlock({ url, caption }: { url: string; caption?: string | null }) {
  return (
    <figure className="m-0">
      {/* Natural size, capped at the column width — never stretched. */}
      <img
        src={url}
        alt={caption || "Lesson image"}
        className="mx-auto block h-auto max-w-full rounded-xl border border-border"
      />
      <Caption text={caption} />
    </figure>
  );
}

function VideoBlock({ url, caption }: { url: string; caption?: string | null }) {
  return (
    <figure className="m-0">
      <div className="relative w-full overflow-hidden rounded-xl bg-black pt-[56.25%] shadow-md">
        <div className="absolute left-0 top-0 h-full w-full">
          <ReactPlayer src={url} controls width="100%" height="100%" />
        </div>
      </div>
      <Caption text={caption} />
    </figure>
  );
}

function EmbedBlock({ content }: { content: string }) {
  let src = "";
  let title = "Embedded content";
  let allow: string | undefined;

  if (content.trim().startsWith("<")) {
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ["iframe"],
      ALLOWED_ATTR: [
        "src",
        "title",
        "allow",
        "allowfullscreen",
        "frameborder",
        "loading",
        "referrerpolicy",
      ],
    });

    const iframe = new DOMParser().parseFromString(sanitized, "text/html").querySelector("iframe");
    if (!iframe) return null;

    src = iframe.getAttribute("src") ?? "";
    title = iframe.getAttribute("title") || "Embedded content";
    allow = iframe.getAttribute("allow") || undefined;
  } else {
    src = content;
  }

  if (!src) return null;

  let hostname: string;
  try {
    hostname = new URL(src).hostname;
  } catch {
    return null;
  }
  if (!ALLOWED_EMBED_HOSTS.has(hostname)) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-xl pt-[56.25%] shadow-md">
      <iframe
        src={src}
        title={title}
        className="absolute left-0 top-0 h-full w-full border-0"
        allow={allow}
        allowFullScreen
      />
    </div>
  );
}

function renderBlock(block: LessonBlock) {
  switch (block.type) {
    case "HTML":
      return <HtmlBlock html={block.html ?? ""} />;
    case "IMAGE":
      return block.url ? <ImageBlock url={block.url} caption={block.caption} /> : null;
    case "VIDEO":
      return block.url ? <VideoBlock url={block.url} caption={block.caption} /> : null;
    case "EMBED":
      return <EmbedBlock content={block.html ?? block.url ?? ""} />;
    default:
      return null;
  }
}

export default function LessonReadBlocks({ blocks }: { blocks: readonly LessonBlock[] }) {
  return (
    <div className="flex flex-col gap-8">
      {blocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}
    </div>
  );
}
