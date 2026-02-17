import { useMemo, useState } from "react";
import ReactPlayer from "react-player";
import DOMPurify from "dompurify";
import { ContentType } from "@skilltree/api-types"; // adjust path if needed

type EmbedProvider = "youtube" | "vimeo" | "codepen" | "iframe" | "unknown";
type EmbedMode = "image" | "video" | "embed" | null;

interface LessonBlock {
  contentType: ContentType.Embed;
  url: string; // original input
  meta: {
    provider: EmbedProvider;
    embedUrl: string;
    isIframe: boolean;
  };
}

// Domain whitelist:
const ALLOWED_DOMAINS = ["youtube.com", "youtu.be", "vimeo.com", "codepen.io"];

// Helpers:

function recognizeProvider(value: string): EmbedProvider {
  if (value.includes("youtube.com") || value.includes("youtu.be"))
    return "youtube";
  if (value.includes("vimeo.com")) return "vimeo";
  if (value.includes("codepen.io")) return "codepen";
  if (value.trim().startsWith("<iframe")) return "iframe";
  return "unknown";
}

function isAllowedDomain(src: string): boolean {
  try {
    const hostname = new URL(src).hostname;
    return ALLOWED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

function extractIframeSrc(html: string): string | null {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["iframe"],
    ALLOWED_ATTR: ["src", "allow", "allowfullscreen", "frameborder"],
  });

  const wrapper = document.createElement("div");
  wrapper.innerHTML = sanitized;

  const iframe = wrapper.querySelector("iframe");
  const src = iframe?.getAttribute("src");

  if (!src || !isAllowedDomain(src)) return null;
  return src;
}

function buildEmbedUrl(input: string, provider: EmbedProvider): string | null {
  switch (provider) {
    case "youtube":
    case "vimeo":
      return input;

    case "codepen":
      return input.replace("/pen/", "/embed/");

    case "iframe":
      return extractIframeSrc(input);

    default:
      return null;
  }
}

//Component:

export const EmbedInput = () => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<EmbedMode>(null);

  const block: LessonBlock | null = useMemo(() => {
    if (!input.trim()) return null;

    const provider = recognizeProvider(input);
    const embedUrl = buildEmbedUrl(input, provider);

    if (!embedUrl) return null;

    return {
      contentType: ContentType.Embed,
      url: input,
      meta: {
        provider,
        embedUrl,
        isIframe: provider === "iframe" || provider === "codepen",
      },
    };
  }, [input]);

  return (
    <div className="mx-auto flex flex-col gap-3 p-3 bg-white">
      {/* Toolbar */}
      <ul className="flex flex-row items-center gap-4 bg-[#f6f6f6] rounded-[8px] shadow-xl px-4 py-2 max-w-32">
        <li className="items-center self-center justify-center object-center m-auto max-h-6">
          {" "}
          <button
            onClick={() => {
              setMode("image");
              setInput("");
            }}
            className="hover:cursor-pointer"
            aria-label="add image"
          >
            {" "}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {" "}
              <path
                d="M16 5H22M19 2V8M21 11.5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H12.5M21 15L17.914 11.914C17.5389 11.5391 17.0303 11.3284 16.5 11.3284C15.9697 11.3284 15.4611 11.5391 15.086 11.914L6 21M11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9Z"
                stroke="#212121"
                stroke-opacity="0.5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />{" "}
            </svg>{" "}
          </button>{" "}
        </li>
        <li className="items-center self-center justify-center object-center m-auto max-h-6">
          {" "}
          <button
            onClick={() => {
              setMode("video");
              setInput("");
            }}
            className="hover:cursor-pointer"
            aria-label="add video"
          >
            {" "}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {" "}
              <path
                d="M2.50001 17C1.80143 13.7033 1.80143 10.2967 2.50001 7C2.5918 6.66521 2.76914 6.36007 3.01461 6.11461C3.26008 5.86914 3.56522 5.69179 3.90001 5.6C9.26346 4.71146 14.7366 4.71146 20.1 5.6C20.4348 5.69179 20.7399 5.86914 20.9854 6.11461C21.2309 6.36007 21.4082 6.66521 21.5 7C22.1986 10.2967 22.1986 13.7033 21.5 17C21.4082 17.3348 21.2309 17.6399 20.9854 17.8854C20.7399 18.1309 20.4348 18.3082 20.1 18.4C14.7366 19.2887 9.26344 19.2887 3.90001 18.4C3.56522 18.3082 3.26008 18.1309 3.01461 17.8854C2.76914 17.6399 2.5918 17.3348 2.50001 17Z"
                stroke="#212121"
                stroke-opacity="0.5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />{" "}
              <path
                d="M10 15L15 12L10 9V15Z"
                stroke="#212121"
                stroke-opacity="0.5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />{" "}
            </svg>{" "}
          </button>{" "}
        </li>

        <li className="items-center self-center justify-center object-center m-auto max-h-6">
          {" "}
          <button
            onClick={() => {
              setMode("embed");
              setInput("");
            }}
            className="hover:cursor-pointer"
            aria-label="add codepen"
          >
            {" "}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {" "}
              <path
                d="M10 9L7 12L10 15"
                stroke="#212121"
                stroke-opacity="0.5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />{" "}
              <path
                d="M14 15L17 12L14 9"
                stroke="#212121"
                stroke-opacity="0.5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />{" "}
              <path
                d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                stroke="#212121"
                stroke-opacity="0.5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />{" "}
            </svg>{" "}
          </button>{" "}
        </li>
      </ul>

      {/* Input */}
      {mode && (
        <textarea
          className="border rounded p-2"
          placeholder={
            mode === "image"
              ? "Paste image URL"
              : mode === "video"
                ? "Paste video URL"
                : "Paste embed URL or iframe HTML"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )}

      {/* Error */}
      {input && !block && (
        <div className="text-sm text-red-600">
          Unsupported or disallowed embed source.
        </div>
      )}

      {/* Preview */}
      {block && (
        <div className="border rounded p-2 bg-white">
          <div className="text-xs text-gray-500 mb-2">
            Provider: {block.meta.provider}
          </div>

          {(block.meta.provider === "youtube" ||
            block.meta.provider === "vimeo") && (
            <div style={{ width: "100%", height: "300px" }}>
              <ReactPlayer
                {...({
                  url: block.meta.embedUrl,
                  width: "100%",
                  height: "100%",
                  controls: true,
                } as any)}
              />
            </div>
          )}

          {(block.meta.provider === "codepen" || block.meta.isIframe) && (
            <iframe
              src={block.meta.embedUrl}
              width="100%"
              height="300"
              title="Embed preview"
              sandbox="allow-scripts allow-same-origin"
              allowFullScreen
            />
          )}
        </div>
      )}
    </div>
  );
};
