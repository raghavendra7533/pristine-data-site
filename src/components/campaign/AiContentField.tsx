import { useState, useRef, useCallback, useEffect } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

/**
 * A contenteditable field that supports "/" to insert AI-generated paragraph
 * pills inline. Used inside ConditionalBlockModal content cells.
 *
 * Serializes to plain text with {{ai: <instruction>}} tokens embedded.
 */

interface AiContentFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
}

const AI_TOKEN_REGEX = /\{\{ai:\s*(.+?)\}\}/g;

const AI_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-right:3px;flex-shrink:0"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></svg>`;

/* ─── Serialize contenteditable → plain text with tokens ─── */

function serialize(el: HTMLElement): string {
  let out = "";
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent ?? "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.tagName === "BR") { out += "\n"; continue; }
      if (element.dataset.aiToken) {
        out += element.dataset.aiToken;
        continue;
      }
      if (element.tagName === "DIV" || element.tagName === "P") {
        if (out.length > 0 && !out.endsWith("\n")) out += "\n";
      }
      out += serialize(element);
    }
  }
  return out;
}

/* ─── Build HTML from plain text with tokens ─── */

function buildHTML(value: string): string {
  if (!value) return "";
  let html = escapeHTML(value);
  // Replace {{ai: instruction}} with chip spans
  html = html.replace(/\{\{ai:\s*(.+?)\}\}/g, (_match, instruction) => {
    const full = `{{ai: ${instruction}}}`;
    const label = instruction.length > 30 ? instruction.slice(0, 30) + "..." : instruction;
    return `<span contenteditable="false" data-ai-token="${escapeAttr(full)}" class="variable-chip variable-chip--ai_paragraph" style="font-size:12px;line-height:20px;padding:1px 8px 1px 6px">${AI_ICON_SVG}AI: ${escapeHTML(label)}</span>`;
  });
  html = html.replace(/\n/g, "<br>");
  return html;
}

function escapeHTML(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
function escapeAttr(s: string) { return s.replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

/* ─── Component ─── */

const AiContentField = ({
  value,
  onChange,
  placeholder = "Content to insert for this match...",
  className,
  hasError = false,
}: AiContentFieldProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hydratedRef = useRef(false);
  const savedRangeRef = useRef<Range | null>(null);

  // Slash prompt state
  const [promptActive, setPromptActive] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const [promptPos, setPromptPos] = useState({ top: 0, left: 0 });

  // Hydrate once
  useEffect(() => {
    if (editorRef.current && !hydratedRef.current) {
      const html = buildHTML(value);
      if (html) editorRef.current.innerHTML = html;
      hydratedRef.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (promptActive && inputRef.current) inputRef.current.focus();
  }, [promptActive]);

  const syncToParent = useCallback(() => {
    if (!editorRef.current) return;
    onChange(serialize(editorRef.current).trimEnd());
  }, [onChange]);

  const saveRange = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.getRangeAt(0).startContainer)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreRange = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const sel = window.getSelection();
    if (!sel) return;
    if (savedRangeRef.current) {
      editor.focus();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
      savedRangeRef.current = null;
      return;
    }
    editor.focus();
    // Fallback: end of content
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const insertAiChip = useCallback((instruction: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    restoreRange();

    const chip = document.createElement("span");
    chip.contentEditable = "false";
    const token = `{{ai: ${instruction}}}`;
    chip.dataset.aiToken = token;
    chip.className = "variable-chip variable-chip--ai_paragraph";
    chip.style.fontSize = "12px";
    chip.style.lineHeight = "20px";
    chip.style.padding = "1px 8px 1px 6px";
    const label = instruction.length > 30 ? instruction.slice(0, 30) + "..." : instruction;
    chip.innerHTML = AI_ICON_SVG + escapeHTML(`AI: ${label}`);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(chip);
      const space = document.createTextNode("\u00A0");
      chip.after(space);
      const newRange = document.createRange();
      newRange.setStartAfter(space);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      editor.appendChild(chip);
      editor.appendChild(document.createTextNode("\u00A0"));
    }
    syncToParent();
  }, [restoreRange, syncToParent]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "/") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const node = range.startContainer;
      const offset = range.startOffset;
      let charBefore = "";
      if (node.nodeType === Node.TEXT_NODE && offset > 0) charBefore = node.textContent?.[offset - 1] ?? "";
      const atStart = offset === 0 || charBefore === "\n" || charBefore === " " || charBefore === "\u00A0";

      if (atStart) {
        e.preventDefault();
        saveRange();

        const editorRect = editorRef.current?.getBoundingClientRect();
        const wrapperRect = wrapperRef.current?.getBoundingClientRect();
        if (editorRect && wrapperRect) {
          setPromptPos({
            top: editorRect.bottom - wrapperRect.top + 4,
            left: 0,
          });
        }
        setPromptValue("");
        setPromptActive(true);
      }
    }

    // Backspace to delete chip
    if (e.key === "Backspace") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (!range.collapsed) return;
      const node = range.startContainer;
      const offset = range.startOffset;
      let prevNode: Node | null = null;
      if (node.nodeType === Node.TEXT_NODE && offset === 0) prevNode = node.previousSibling;
      else if (node.nodeType === Node.ELEMENT_NODE && offset > 0) prevNode = node.childNodes[offset - 1];
      if (prevNode && prevNode.nodeType === Node.ELEMENT_NODE && (prevNode as HTMLElement).dataset?.aiToken) {
        e.preventDefault();
        (prevNode as HTMLElement).remove();
        syncToParent();
      }
    }
  }, [saveRange, syncToParent]);

  const confirmPrompt = useCallback(() => {
    const prompt = promptValue.trim();
    if (!prompt) {
      setPromptActive(false);
      editorRef.current?.focus();
      return;
    }
    setPromptActive(false);
    setPromptValue("");
    insertAiChip(prompt);
  }, [promptValue, insertAiChip]);

  const dismissPrompt = useCallback(() => {
    setPromptActive(false);
    setPromptValue("");
    editorRef.current?.focus();
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => syncToParent()}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className={cn(
          "w-full min-h-[56px] px-3 py-2 rounded-md border border-input bg-background text-sm",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none",
          hasError && "border-destructive",
          className
        )}
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      />

      {/* Hint */}
      <div className="flex items-center gap-1 mt-1">
        <span className="text-[9px] text-muted-foreground/60">
          Type <kbd className="px-0.5 rounded bg-muted border border-border text-[8px] font-mono">/</kbd> for AI content
        </span>
      </div>

      {/* Floating AI Prompt */}
      {promptActive && (
        <div
          className="absolute z-50 animate-in fade-in slide-in-from-top-1 duration-100"
          style={{ top: promptPos.top, left: promptPos.left }}
        >
          <div className="bg-popover border border-blue-500/30 rounded-xl shadow-xl w-[300px] overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border-b border-blue-500/10">
              <Icon icon="solar:magic-stick-3-linear" className="h-3 w-3 text-blue-500" />
              <span className="text-[11px] font-semibold text-foreground">What should AI write?</span>
            </div>
            <div className="px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); confirmPrompt(); }
                  else if (e.key === "Escape") { e.preventDefault(); dismissPrompt(); }
                }}
                onBlur={() => setTimeout(() => { if (promptActive) dismissPrompt(); }, 150)}
                placeholder='e.g., "Pain point for their industry"'
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
            </div>
            <div className="flex items-center justify-between px-3 py-1 bg-muted/30 border-t border-border">
              <span className="text-[9px] text-muted-foreground">
                <kbd className="px-0.5 py-0.5 rounded bg-background border border-border font-mono text-[8px]">&#x23CE;</kbd> insert
              </span>
              <button
                onMouseDown={(e) => { e.preventDefault(); confirmPrompt(); }}
                disabled={!promptValue.trim()}
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded transition-colors",
                  promptValue.trim() ? "text-blue-600 hover:bg-blue-500/10" : "text-muted-foreground/40 cursor-not-allowed"
                )}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiContentField;
