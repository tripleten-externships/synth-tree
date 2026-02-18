import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";

import { cn } from "@/utils";
import { renderMarkdownToSafeHtml } from "@/utils";

import { Button } from "./button";

type PreviewMode = "split" | "toggle";

export type MarkdownEditorProps = {
  // controlled editor value, store markdown src string
  value: string;

  // controlled editor change handler, persist markdown src into state/store
  onChange: (next: string) => void;

  // layout mode for preview rendering
  //  split -> editor & preview visible together, toggle -> radix tabs switch b/w editor & preview
  previewMode?: PreviewMode;

  // optional ui overrides
  className?: string;
  placeholder?: string;
  minRows?: number;
  disabled?: boolean;
};

// read selection ranges from textarea & support toolbar commands
function getSelection(textarea: HTMLTextAreaElement) {
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const selected = textarea.value.slice(start, end);
  return { start, end, selected };
}

// wrap selection w left/right tokens
function applyWrap(
  textarea: HTMLTextAreaElement,
  current: string,
  opts: { left: string; right?: string; placeholder?: string },
) {
  const { start, end, selected } = getSelection(textarea);

  const left = opts.left;
  const right = opts.right ?? opts.left;

  const hasSelection = selected.length > 0;
  const content = hasSelection ? selected : (opts.placeholder ?? "");

  const next =
    current.slice(0, start) + left + content + right + current.slice(end);

  const cursorStart = start + left.length;
  const cursorEnd = start + left.length + content.length;

  return { next, cursorStart, cursorEnd };
}

// prefix each selected line w a token
function applyLinePrefix(
  textarea: HTMLTextAreaElement,
  current: string,
  prefix: string,
) {
  const { start, end } = getSelection(textarea);

  const before = current.slice(0, start);
  const selected = current.slice(start, end);
  const after = current.slice(end);

  const lines = selected.length > 0 ? selected.split("\n") : [""];
  const nextSelected = lines.map((line) => `${prefix}${line}`).join("\n");

  const next = before + nextSelected + after;

  const cursorStart = start + prefix.length;
  const cursorEnd = start + nextSelected.length;

  return { next, cursorStart, cursorEnd };
}

// prefix each selected line w a token
function applyHeading(
  textarea: HTMLTextAreaElement,
  current: string,
  level: 1 | 2 | 3,
) {
  const prefix = `${"#".repeat(level)} `;

  return applyLinePrefix(textarea, current, prefix);
}

// link insert: result -> [text](https://)
function applyLink(textarea: HTMLTextAreaElement, current: string) {
  const { start, end, selected } = getSelection(textarea);

  const text = selected.length > 0 ? selected : "link text";
  const insert = `[${text}](https://)`;

  const next = current.slice(0, start) + insert + current.slice(end);

  const urlStart = start + insert.indexOf("https://");
  const urlEnd = urlStart + "https://".length;

  return { next, cursorStart: urlStart, cursorEnd: urlEnd };
}

// code block insert
function applyCodeBlock(textarea: HTMLTextAreaElement, current: string) {
  const { start, end, selected } = getSelection(textarea);

  const content = selected.length > 0 ? selected : "code";
  const insert = `\n\`\`\`\n${content}\n\`\`\`\n`;

  const next = current.slice(0, start) + insert + current.slice(end);

  const contentStart = start + insert.indexOf(content);
  const contentEnd = contentStart + content.length;

  return { next, cursorStart: contentStart, cursorEnd: contentEnd };
}

// MarkdownEditor component
//  provides: markdown input area, toolbar for common markdown formatting,
//            preview rendered as sanitized html, split or toggle preview modes
export function MarkdownEditor({
  value,
  onChange,
  previewMode = "split",
  className,
  placeholder = "Write lesson content in Markdown...",
  minRows = 14,
  disabled = false,
}: MarkdownEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // local state for prev mode toggle
  const [mode, setMode] = React.useState<PreviewMode>(previewMode);

  // sync mode when prop changes
  React.useEffect(() => {
    setMode(previewMode);
  }, [previewMode]);

  // render & sanitize prev html
  const safeHtml = React.useMemo(() => {
    return renderMarkdownToSafeHtml(value);
  }, [value]);

  // fn to update controlled value & restore selection range after react re-render
  function updateWithSelection(result: {
    next: string;
    cursorStart: number;
    cursorEnd: number;
  }) {
    const textarea = textareaRef.current;

    onChange(result.next);

    // selection restoration req next tick
    window.setTimeout(() => {
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(result.cursorStart, result.cursorEnd);
    }, 0);
  }

  // fn to guard for diasbled state & missing textarea el
  function requireTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) return null;
    if (disabled) return null;
    return textarea;
  }

  // fns for toolbar actions (bold, italic, headings, lists, links, codeblocks)
  function onBold() {
    const textarea = requireTextarea();
    if (!textarea) return;
    updateWithSelection(
      applyWrap(textarea, value, { left: "**", placeholder: "bold text" }),
    );
  }

  function onItalic() {
    const textarea = requireTextarea();
    if (!textarea) return;
    updateWithSelection(
      applyWrap(textarea, value, { left: "*", placeholder: "italic text" }),
    );
  }

  function onInlineCode() {
    const textarea = requireTextarea();
    if (!textarea) return;
    updateWithSelection(
      applyWrap(textarea, value, { left: "`", placeholder: "code" }),
    );
  }

  function onCodeBlock() {
    const textarea = requireTextarea();
    if (!textarea) return;
    updateWithSelection(applyCodeBlock(textarea, value));
  }

  function onH1() {
    const textarea = requireTextarea();
    if (!textarea) return;
    updateWithSelection(applyHeading(textarea, value, 1));
  }

  function onH2() {
    const textarea = requireTextarea();
    if (!textarea) return;
    updateWithSelection(applyHeading(textarea, value, 2));
  }

  function onH3() {
    const textarea = requireTextarea();
    if (!textarea) return;
    updateWithSelection(applyHeading(textarea, value, 3));
  }

  function onBullets() {
    const textarea = requireTextarea();
    if (!textarea) return;
    updateWithSelection(applyLinePrefix(textarea, value, "- "));
  }

  function onNumbers() {
    const textarea = requireTextarea();
    if (!textarea) return;

    const { start, end } = getSelection(textarea);
    const before = value.slice(0, start);
    const selected = value.slice(start, end);
    const after = value.slice(end);

    const lines = selected.length > 0 ? selected.split("\n") : [""];
    const nextSelected = lines
      .map((line, idx) => `${idx + 1}. ${line}`)
      .join("\n");

    const next = before + nextSelected + after;

    const cursorStart = start + "1. ".length;
    const cursorEnd = start + nextSelected.length;

    updateWithSelection({ next, cursorStart, cursorEnd });
  }

  function onLink() {
    const textarea = requireTextarea();
    if (!textarea) return;
    updateWithSelection(applyLink(textarea, value));
  }

  // toolbar + textarea editor ui
  const editorPane = (
    <div className="flex flex-col gap-2">
      {/* toolbar row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* inline formatting */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onBold}
            disabled={disabled}
          >
            Bold
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onItalic}
            disabled={disabled}
          >
            Italic
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onInlineCode}
            disabled={disabled}
          >
            Inline code
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCodeBlock}
            disabled={disabled}
          >
            Code block
          </Button>
        </div>

        {/* divider */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* heading */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onH1}
            disabled={disabled}
          >
            H1
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onH2}
            disabled={disabled}
          >
            H2
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onH3}
            disabled={disabled}
          >
            H3
          </Button>
        </div>

        {/* divider */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* link & list */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onBullets}
            disabled={disabled}
          >
            Bullets
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onNumbers}
            disabled={disabled}
          >
            Numbered
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onLink}
            disabled={disabled}
          >
            Link
          </Button>
        </div>

        {/* preview mode control */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Preview Mode</span>

          {/* radix toggle for mode selection */}
          <ToggleGroup.Root
            type="single"
            value={mode}
            onValueChange={(next) => {
              if (next === "split" || next === "toggle") setMode(next);
            }}
            className="inline-flex rounded-md border bg-background"
            aria-label="Preview mode selection"
          >
            <ToggleGroup.Item
              value="split"
              className={cn(
                "px-2 py-1 text-xs",
                mode === "split" ? "bg-accent" : "",
              )}
              aria-label="Split view"
            >
              Split
            </ToggleGroup.Item>

            <ToggleGroup.Item
              value="toggle"
              className={cn(
                "px-2 py-1 text-xs border-l",
                mode === "toggle" ? "bg-accent" : "",
              )}
              aria-label="Toggle view"
            >
              Toggle
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      </div>

      {/* markdown input */}
      <textarea
        ref={textareaRef}
        id="markdown-editor"
        name="markdown"
        aria-label="Markdown editor"
        className={cn(
          "w-full resize-y rounded-md border bg-background p-3 font-sans text-sm leading-6 outline-none",
          "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
          disabled ? "opacity-60 cursor-not-allowed" : "",
        )}
        rows={minRows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );

  // preview ui
  const previewPane = (
    <div className="rounded-md border bg-background p-3">
      <div
        className={cn(
          "space-y-3 text-sm",
          "leading-6",
          "[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-tight",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-tight",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-tight",
          "[&_p]:my-2",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2",
          "[&_code]:rounded [&_code]:bg-muted [&_code]:text-slate-600 [&_code]:py-0.5",
          "[&_pre]:rounded [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:overflow-auto",
          "[&_a]:underline [&_a]:text-blue-500 visited:[&_a]:text-purple-500",
        )}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </div>
  );

  // split mode layout
  if (mode === "split") {
    return (
      <div className={cn("grid grid-cols-1 gap-3 md:grid-cols-2", className)}>
        <div className="min-w-0">{editorPane}</div>
        <div className="min-w-0">{previewPane}</div>
      </div>
    );
  }

  // toggle mode layout
  if (mode === "toggle") {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <Tabs.Root defaultValue="edit">
          <Tabs.List className="inline-flex w-fit rounded-md border bg-background">
            <Tabs.Trigger
              value="edit"
              className="px-3 py-2 text-sm border-r data-[state=active]:bg-accent"
            >
              Edit
            </Tabs.Trigger>
            <Tabs.Trigger
              value="preview"
              className="px-3 py-2 text-sm data-[state=active]:bg-accent"
            >
              Preview
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="edit" className="mt-3">
            {editorPane}
          </Tabs.Content>

          <Tabs.Content value="preview" className="mt-3">
            {previewPane}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    );
  }
}
