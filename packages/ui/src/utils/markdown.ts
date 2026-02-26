import { marked } from "marked";
import DOMPurify from "dompurify";

// this is to convert mardown source to HTML & sanitize its output to prevent XSS

export function renderMarkdownToSafeHtml(mardown: string): string {
    // marked config for github markdown and readable line breaks
    const rawHtml = marked(mardown ?? "", {
        gfm: true,
        breaks: true,
    }) as string;

    // DOMPurify sanitization blocks scripts, event handler, js: URLs, etc.
    const safeHtml = DOMPurify.sanitize(rawHtml);

    return safeHtml;
}