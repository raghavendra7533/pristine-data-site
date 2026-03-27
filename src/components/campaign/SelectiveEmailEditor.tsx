import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import type { DynamicVariable } from "@/pages/CreateCampaign";
import ConditionalBlockModal from "./ConditionalBlockModal";
import type { ConditionalBlock } from "./ConditionalBlockModal";

/* ─── Slash-menu item definitions ─── */

type EditorScope = "body" | "subject" | "merge_only";

interface SlashMenuItem {
  id: string;
  icon: string;
  label: string;
  description: string;
  category: "personalization" | "dynamic";
  type: "merge" | "conditional" | "ai_paragraph" | "ai_subject_line";
  token?: string;
  /** Which scopes this item appears in. Defaults to all. */
  scopes?: EditorScope[];
}

const SLASH_MENU_ITEMS: SlashMenuItem[] = [
  { id: "first_name", icon: "solar:user-rounded-linear", label: "First Name", description: "Contact's first name", category: "personalization", type: "merge", token: "firstName" },
  { id: "last_name", icon: "solar:user-rounded-linear", label: "Last Name", description: "Contact's last name", category: "personalization", type: "merge", token: "lastName" },
  { id: "company_name", icon: "solar:buildings-2-linear", label: "Company Name", description: "Contact's company", category: "personalization", type: "merge", token: "companyName" },
  { id: "job_title", icon: "solar:case-round-linear", label: "Job Title", description: "Contact's role", category: "personalization", type: "merge", token: "jobTitle" },
  { id: "industry", icon: "solar:chart-square-linear", label: "Industry", description: "Contact's industry", category: "personalization", type: "merge", token: "industry" },
  { id: "ai_subject_line", icon: "solar:magic-stick-3-linear", label: "AI Subject Line", description: "AI writes a subject line per contact", category: "dynamic", type: "ai_subject_line", scopes: ["subject"] },
  { id: "ai_paragraph", icon: "solar:magic-stick-3-linear", label: "AI Paragraph", description: "AI writes a paragraph per contact", category: "dynamic", type: "ai_paragraph", scopes: ["body"] },
  { id: "conditional", icon: "solar:routing-2-linear", label: "Conditional Block", description: "Different content by attribute", category: "dynamic", type: "conditional", scopes: ["body"] },
];

/* ─── Icon SVGs (inlined so they work inside contenteditable spans) ─── */

const CHIP_ICON_SVG: Record<string, string> = {
  merge: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-right:3px;flex-shrink:0"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  ai_paragraph: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-right:3px;flex-shrink:0"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></svg>`,
  ai_subject_line: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-right:3px;flex-shrink:0"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></svg>`,
  conditional: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px;margin-right:3px;flex-shrink:0"><path d="M6 3v12"/><path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M15 6a9 9 0 0 0-9 9"/></svg>`,
};

/* ─── Get caret pixel position inside a contenteditable ─── */

function getCaretRect(): DOMRect | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0).cloneRange();
  range.collapse(true);
  const rect = range.getClientRects()[0];
  return rect ?? null;
}

/* ─── Helpers to serialize the contenteditable HTML ─── */

function serializeEditor(el: HTMLElement): {
  body: string;
  variables: DynamicVariable[];
} {
  const variables: DynamicVariable[] = [];

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return escapeHTML(node.textContent ?? "");
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const element = node as HTMLElement;
    const tag = element.tagName;

    if (tag === "BR") return "<br>";

    if (element.dataset.varId) {
      const varData: DynamicVariable = {
        id: element.dataset.varId,
        type: element.dataset.varType as DynamicVariable["type"],
        token: element.dataset.varToken ?? "",
        label: element.dataset.varLabel ?? "",
      };
      if (element.dataset.varAiInstruction) varData.aiInstruction = element.dataset.varAiInstruction;
      if (element.dataset.varAttribute) varData.attribute = element.dataset.varAttribute;
      variables.push(varData);
      return varData.token;
    }

    const inner = Array.from(node.childNodes).map(walk).join("");

    switch (tag) {
      case "B": case "STRONG": return `<b>${inner}</b>`;
      case "I": case "EM": return `<i>${inner}</i>`;
      case "U": return `<u>${inner}</u>`;
      case "S": case "STRIKE": case "DEL": return `<s>${inner}</s>`;
      case "A": return `<a href="${escapeAttr(element.getAttribute("href") ?? "")}">${inner}</a>`;
      case "UL": return `<ul>${inner}</ul>`;
      case "OL": return `<ol>${inner}</ol>`;
      case "LI": return `<li>${inner}</li>`;
      case "DIV": case "P": return `<br>${inner}`;
      default: return inner;
    }
  }

  let body = Array.from(el.childNodes).map(walk).join("");
  if (body.startsWith("<br>")) body = body.slice(4);

  const seen = new Set<string>();
  const uniqueVars = variables.filter((v) => {
    if (seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  });
  return { body, variables: uniqueVars };
}

/* ─── Build HTML for initial render ─── */

function buildInitialHTML(emailBody: string, dynamicVariables: DynamicVariable[]): string {
  if (!emailBody) return "";
  let html = emailBody;
  for (const v of dynamicVariables) {
    html = html.replaceAll(v.token, buildChipHTML(v));
  }
  return html;
}

function buildChipHTML(v: DynamicVariable): string {
  const displayLabel = (v.type === "ai_paragraph" || v.type === "ai_subject_line") && v.aiInstruction
    ? `AI: ${v.aiInstruction.length > 30 ? v.aiInstruction.slice(0, 30) + "..." : v.aiInstruction}`
    : v.label;
  const iconSvg = CHIP_ICON_SVG[v.type] ?? CHIP_ICON_SVG.merge;
  return `<span contenteditable="false" data-var-id="${v.id}" data-var-type="${v.type}" data-var-token="${escapeAttr(v.token)}" data-var-label="${escapeAttr(v.label)}"${v.aiInstruction ? ` data-var-ai-instruction="${escapeAttr(v.aiInstruction)}"` : ""}${v.attribute ? ` data-var-attribute="${escapeAttr(v.attribute)}"` : ""} class="variable-chip variable-chip--${v.type}">${iconSvg}${escapeHTML(displayLabel)}</span>`;
}

function escapeAttr(s: string) { return s.replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
function escapeHTML(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

/* ─── Component ─── */

interface SelectiveEmailEditorProps {
  emailBody: string;
  dynamicVariables: DynamicVariable[];
  onEmailBodyChange: (body: string) => void;
  onVariablesChange: (vars: DynamicVariable[]) => void;
  mergeOnly?: boolean;
  /** Controls which slash-menu items appear. Defaults to "body". "merge_only" is equivalent to mergeOnly=true. */
  scope?: EditorScope;
  /** Hide formatting toolbar and hint — used for compact fields like subject lines */
  compact?: boolean;
}

const SelectiveEmailEditor = ({
  emailBody,
  dynamicVariables,
  onEmailBodyChange,
  onVariablesChange,
  mergeOnly = false,
  scope: scopeProp,
  compact = false,
}: SelectiveEmailEditorProps) => {
  // Derive effective scope: explicit scope prop takes priority, then mergeOnly fallback
  const scope: EditorScope = scopeProp ?? (mergeOnly ? "merge_only" : "body");
  const editorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);

  // Slash menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [menuFilter, setMenuFilter] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // AI prompt
  const [aiPromptActive, setAiPromptActive] = useState(false);
  const [aiPromptValue, setAiPromptValue] = useState("");
  const [aiPromptPos, setAiPromptPos] = useState({ top: 0, left: 0 });

  // Chip popover (edit on click)
  const [chipPopover, setChipPopover] = useState<{
    el: HTMLElement;
    varData: DynamicVariable;
    rect: DOMRect;
  } | null>(null);
  const [chipEditPrompt, setChipEditPrompt] = useState("");
  const chipPopoverRef = useRef<HTMLDivElement>(null);

  // Conditional block modal
  const [conditionalOpen, setConditionalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ConditionalBlock | null>(null);

  // Saved cursor range
  const savedRangeRef = useRef<Range | null>(null);
  const hydratedRef = useRef(false);

  // Formatting toolbar
  const [formatState, setFormatState] = useState({ bold: false, italic: false, underline: false, strikethrough: false });
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  // Hydrate editor once
  useEffect(() => {
    if (editorRef.current && !hydratedRef.current) {
      const html = buildInitialHTML(emailBody, dynamicVariables);
      if (html) editorRef.current.innerHTML = html;
      hydratedRef.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Filtered menu items ─── */
  const baseItems = useMemo(
    () => {
      if (scope === "merge_only") return SLASH_MENU_ITEMS.filter((i) => i.type === "merge");
      return SLASH_MENU_ITEMS.filter((i) => !i.scopes || i.scopes.includes(scope));
    },
    [scope]
  );
  const filteredItems = useMemo(() => {
    if (!menuFilter) return baseItems;
    const q = menuFilter.toLowerCase();
    return baseItems.filter((item) => item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  }, [menuFilter, baseItems]);

  useEffect(() => { setActiveIndex(0); }, [filteredItems.length]);

  /* ─── Sync editor → parent ─── */
  const syncToParent = useCallback(() => {
    if (!editorRef.current) return;
    const { body, variables } = serializeEditor(editorRef.current);
    onEmailBodyChange(body);
    onVariablesChange(variables);
  }, [onEmailBodyChange, onVariablesChange]);

  /* ─── Remove slash trigger ─── */
  const removeSlashTrigger = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const textNode = range.startContainer;
    if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
      const offset = range.startOffset;
      const text = textNode.textContent;
      const slashPos = text.lastIndexOf("/", offset - 1);
      if (slashPos >= 0) {
        textNode.textContent = text.slice(0, slashPos) + text.slice(offset);
        const newRange = document.createRange();
        newRange.setStart(textNode, slashPos);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
    }
  }, []);

  /* ─── Save / Restore cursor ─── */
  const saveEditorRange = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current?.contains(range.startContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  }, []);

  const restoreEditorRange = useCallback(() => {
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
    if (sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).startContainer)) return;

    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  /* ─── Formatting toolbar ─── */

  useEffect(() => {
    const update = () => {
      const sel = window.getSelection();
      if (!sel || !editorRef.current) return;
      if (!editorRef.current.contains(sel.anchorNode)) return;
      setFormatState({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikethrough: document.queryCommandState("strikethrough"),
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  const execFormat = useCallback((cmd: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false);
    syncToParent();
  }, [syncToParent]);

  const openLinkPopover = useCallback(() => {
    saveEditorRange();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const anchor = (sel.anchorNode?.nodeType === Node.ELEMENT_NODE
        ? sel.anchorNode as HTMLElement
        : sel.anchorNode?.parentElement
      )?.closest("a");
      setLinkUrl(anchor?.getAttribute("href") ?? "https://");
    } else {
      setLinkUrl("https://");
    }
    setLinkPopoverOpen(true);
    setTimeout(() => linkInputRef.current?.focus(), 0);
  }, [saveEditorRange]);

  const confirmLink = useCallback(() => {
    const url = linkUrl.trim();
    if (!url) { setLinkPopoverOpen(false); return; }
    restoreEditorRange();
    document.execCommand("createLink", false, url);
    const editor = editorRef.current;
    if (editor) {
      editor.querySelectorAll("a").forEach((a) => {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      });
    }
    setLinkUrl("");
    setLinkPopoverOpen(false);
    syncToParent();
  }, [linkUrl, restoreEditorRange, syncToParent]);

  const removeLink = useCallback(() => {
    restoreEditorRange();
    document.execCommand("unlink", false);
    setLinkPopoverOpen(false);
    syncToParent();
  }, [restoreEditorRange, syncToParent]);

  /* ─── Create a chip DOM element ─── */
  const createChipElement = useCallback((v: DynamicVariable): HTMLSpanElement => {
    const chip = document.createElement("span");
    chip.contentEditable = "false";
    chip.dataset.varId = v.id;
    chip.dataset.varType = v.type;
    chip.dataset.varToken = v.token;
    chip.dataset.varLabel = v.label;
    if (v.aiInstruction) chip.dataset.varAiInstruction = v.aiInstruction;
    if (v.attribute) chip.dataset.varAttribute = v.attribute;
    chip.className = `variable-chip variable-chip--${v.type}`;

    const displayLabel = (v.type === "ai_paragraph" || v.type === "ai_subject_line") && v.aiInstruction
      ? `AI: ${v.aiInstruction.length > 30 ? v.aiInstruction.slice(0, 30) + "..." : v.aiInstruction}`
      : v.label;

    chip.innerHTML = (CHIP_ICON_SVG[v.type] ?? CHIP_ICON_SVG.merge) + escapeHTML(displayLabel);
    return chip;
  }, []);

  /* ─── Insert a chip at cursor ─── */
  const insertChip = useCallback((v: DynamicVariable) => {
    const editor = editorRef.current;
    if (!editor) return;
    restoreEditorRange();

    const chip = createChipElement(v);
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
  }, [syncToParent, restoreEditorRange, createChipElement]);

  /* ─── Handle slash-menu item selection ─── */
  const handleMenuSelect = useCallback((item: SlashMenuItem) => {
    removeSlashTrigger();
    setMenuOpen(false);
    setMenuFilter("");

    if (item.type === "merge") {
      insertChip({
        id: `merge_${item.token}_${Date.now()}`,
        type: "merge",
        token: `{{${item.token}}}`,
        label: item.label,
      });
    } else if (item.type === "ai_paragraph" || item.type === "ai_subject_line") {
      saveEditorRange();
      const rect = getCaretRect();
      const editorRect = editorRef.current?.getBoundingClientRect();
      if (rect && editorRect) {
        setAiPromptPos({
          top: rect.bottom - editorRect.top + 4,
          left: Math.min(rect.left - editorRect.left, 300),
        });
      }
      setAiPromptValue("");
      setAiPromptActive(true);
      setTimeout(() => aiInputRef.current?.focus(), 0);
    } else if (item.type === "conditional") {
      saveEditorRange();
      setEditingBlock(null);
      setConditionalOpen(true);
    }
  }, [removeSlashTrigger, insertChip, saveEditorRange]);

  /* ─── AI prompt confirm ─── */
  const confirmAiPrompt = useCallback(() => {
    const prompt = aiPromptValue.trim();
    if (!prompt) { setAiPromptActive(false); editorRef.current?.focus(); return; }
    const id = `ai_${Date.now()}`;
    const isSubjectAi = scope === "subject";
    setAiPromptActive(false);
    setAiPromptValue("");
    insertChip({
      id,
      type: isSubjectAi ? "ai_subject_line" as DynamicVariable["type"] : "ai_paragraph",
      token: `{{ai:${id}}}`,
      label: isSubjectAi ? "AI Subject Line" : "AI Paragraph",
      aiInstruction: prompt,
    });
  }, [aiPromptValue, insertChip, scope]);

  /* ─── Conditional save ─── */
  const handleConditionalSave = useCallback((block: ConditionalBlock) => {
    insertChip({
      id: block.id, type: "conditional", token: `{{conditional:${block.id}}}`,
      label: `If ${block.attribute}...`, attribute: block.attribute,
      rows: block.rows, fallback: block.fallback,
    });
    setConditionalOpen(false);
    setEditingBlock(null);
  }, [insertChip]);

  /* ─── Chip click → popover ─── */
  const handleEditorClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Walk up to find a chip (the click could be on the SVG icon inside)
    const chip = target.closest("[data-var-id]") as HTMLElement | null;
    if (!chip) { setChipPopover(null); return; }

    const varData: DynamicVariable = {
      id: chip.dataset.varId!,
      type: chip.dataset.varType as DynamicVariable["type"],
      token: chip.dataset.varToken ?? "",
      label: chip.dataset.varLabel ?? "",
      aiInstruction: chip.dataset.varAiInstruction,
      attribute: chip.dataset.varAttribute,
    };
    setChipEditPrompt(varData.aiInstruction ?? "");
    setChipPopover({ el: chip, varData, rect: chip.getBoundingClientRect() });
  }, []);

  /* ─── Close chip popover on outside click ─── */
  useEffect(() => {
    if (!chipPopover) return;
    const handler = (e: MouseEvent) => {
      if (chipPopoverRef.current && !chipPopoverRef.current.contains(e.target as Node) &&
          !(e.target as HTMLElement).closest("[data-var-id]")) {
        setChipPopover(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [chipPopover]);

  /* ─── Chip popover actions ─── */
  const handleChipDelete = useCallback(() => {
    if (!chipPopover) return;
    chipPopover.el.remove();
    setChipPopover(null);
    syncToParent();
  }, [chipPopover, syncToParent]);

  const handleChipUpdateAi = useCallback(() => {
    if (!chipPopover) return;
    const prompt = chipEditPrompt.trim();
    if (!prompt) return;
    // Update the DOM element in place
    chipPopover.el.dataset.varAiInstruction = prompt;
    const displayLabel = `AI: ${prompt.length > 30 ? prompt.slice(0, 30) + "..." : prompt}`;
    const iconKey = chipPopover.varData.type === "ai_subject_line" ? "ai_subject_line" : "ai_paragraph";
    chipPopover.el.innerHTML = CHIP_ICON_SVG[iconKey] + escapeHTML(displayLabel);
    setChipPopover(null);
    syncToParent();
  }, [chipPopover, chipEditPrompt, syncToParent]);

  const handleChipEditConditional = useCallback(() => {
    if (!chipPopover) return;
    // Read the current conditional data from dynamicVariables
    const existing = dynamicVariables.find((v) => v.id === chipPopover.varData.id);
    setEditingBlock({
      id: chipPopover.varData.id,
      attribute: existing?.attribute ?? chipPopover.varData.attribute ?? "industry",
      rows: existing?.rows ?? [{ condition: "", content: "" }],
      fallback: existing?.fallback ?? "",
    });
    saveEditorRange();
    setChipPopover(null);
    setConditionalOpen(true);
  }, [chipPopover, dynamicVariables, saveEditorRange]);

  /* ─── Editor keyboard handling ─── */
  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Close chip popover on any key
    if (chipPopover) setChipPopover(null);

    if (menuOpen) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filteredItems.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); if (filteredItems[activeIndex]) handleMenuSelect(filteredItems[activeIndex]); }
      else if (e.key === "Escape") { e.preventDefault(); setMenuOpen(false); setMenuFilter(""); }
      else if (e.key === "Backspace") { if (!menuFilter) setMenuOpen(false); else setMenuFilter((f) => f.slice(0, -1)); }
      else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setMenuFilter((f) => f + e.key); }
      return;
    }

    // Ctrl/Cmd+K → insert/edit link
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openLinkPopover();
      return;
    }

    // "/"  → open slash menu
    if (e.key === "/") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const textNode = range.startContainer;
      const offset = range.startOffset;
      let charBefore = "";
      if (textNode.nodeType === Node.TEXT_NODE && offset > 0) charBefore = textNode.textContent?.[offset - 1] ?? "";
      const atBlockStart = offset === 0 || charBefore === "\n" || charBefore === " " || charBefore === "\u00A0";
      if (atBlockStart) {
        setTimeout(() => {
          const rect = getCaretRect();
          const editorRect = editorRef.current?.getBoundingClientRect();
          if (rect && editorRect) setMenuPos({ top: rect.bottom - editorRect.top + 4, left: Math.max(rect.left - editorRect.left - 8, 0) });
          setMenuFilter(""); setActiveIndex(0); setMenuOpen(true);
        }, 0);
      }
    }

    // Backspace → delete adjacent chip
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
      if (prevNode && prevNode.nodeType === Node.ELEMENT_NODE && (prevNode as HTMLElement).dataset?.varId) {
        e.preventDefault();
        (prevNode as HTMLElement).remove();
        syncToParent();
      }
    }
  }, [menuOpen, menuFilter, filteredItems, activeIndex, handleMenuSelect, syncToParent, chipPopover, openLinkPopover]);

  /* ─── Close slash menu on outside click ─── */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          editorRef.current && !editorRef.current.contains(e.target as Node)) {
        setMenuOpen(false); setMenuFilter("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    menuRef.current.querySelector("[data-active='true']")?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, menuOpen]);

  const personalItems = filteredItems.filter((i) => i.category === "personalization");
  const dynamicItems = filteredItems.filter((i) => i.category === "dynamic");

  /* ─── Chip popover position (portal to body so it's not clipped) ─── */
  const chipPopoverStyle = chipPopover ? {
    position: "fixed" as const,
    top: chipPopover.rect.bottom + 6,
    left: chipPopover.rect.left + chipPopover.rect.width / 2 - 120,
    zIndex: 9999,
  } : undefined;

  return (
    <div className="space-y-3">
      {/* Hint bar */}
      {!compact && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          Type{" "}
          <kbd className="px-1.5 py-0.5 rounded-md bg-muted border border-border text-[10px] font-mono font-semibold">/</kbd>
          {" "}{scope === "merge_only" ? "to insert personalization tokens" : scope === "subject" ? "to insert tokens or AI subject line" : "to insert variables, AI paragraphs, or conditional blocks"}
        </div>
      )}

      {/* ─── Editor with Toolbar ─── */}
      <div className="relative">
        <div className="rounded-lg border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
          {/* Formatting Toolbar */}
          {!compact && <div className="flex items-center gap-0.5 px-1.5 py-1 bg-muted/30 border-b border-border flex-wrap">
            {([
              { cmd: "bold", icon: "solar:text-bold-linear", label: "Bold (Ctrl+B)", key: "bold" as const },
              { cmd: "italic", icon: "solar:text-italic-linear", label: "Italic (Ctrl+I)", key: "italic" as const },
              { cmd: "underline", icon: "solar:text-underline-linear", label: "Underline (Ctrl+U)", key: "underline" as const },
              { cmd: "strikeThrough", icon: "solar:text-cross-linear", label: "Strikethrough", key: "strikethrough" as const },
            ] as const).map((item) => (
              <button
                key={item.cmd}
                type="button"
                title={item.label}
                onMouseDown={(e) => { e.preventDefault(); execFormat(item.cmd); }}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  formatState[item.key]
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon icon={item.icon} className="h-3.5 w-3.5" />
              </button>
            ))}

            <div className="w-px h-4 bg-border mx-0.5" />

            {/* Link */}
            <div className="relative">
              <button
                type="button"
                title="Link (Ctrl+K)"
                onMouseDown={(e) => { e.preventDefault(); openLinkPopover(); }}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  linkPopoverOpen
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon icon="solar:link-linear" className="h-3.5 w-3.5" />
              </button>
              {linkPopoverOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                  <div className="bg-popover border border-border rounded-lg shadow-xl w-[280px] overflow-hidden">
                    <div className="px-3 py-2 space-y-2">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">URL</label>
                      <input
                        ref={linkInputRef}
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { e.preventDefault(); confirmLink(); }
                          else if (e.key === "Escape") { e.preventDefault(); setLinkPopoverOpen(false); }
                        }}
                        placeholder="https://example.com"
                        className="w-full px-2 py-1.5 rounded-md border border-input bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                      />
                      <div className="flex items-center gap-1.5">
                        <button
                          onMouseDown={(e) => { e.preventDefault(); confirmLink(); }}
                          disabled={!linkUrl.trim()}
                          className={cn(
                            "flex-1 text-xs font-medium py-1.5 rounded-md transition-colors",
                            linkUrl.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                          )}
                        >
                          Apply
                        </button>
                        <button
                          onMouseDown={(e) => { e.preventDefault(); removeLink(); }}
                          className="px-2 py-1.5 rounded-md text-xs text-destructive hover:bg-destructive/10 transition-colors"
                          title="Remove link"
                        >
                          <Icon icon="solar:link-broken-linear" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-border mx-0.5" />

            {/* Lists */}
            <button
              type="button"
              title="Bullet List"
              onMouseDown={(e) => { e.preventDefault(); execFormat("insertUnorderedList"); }}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon icon="solar:list-linear" className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Numbered List"
              onMouseDown={(e) => { e.preventDefault(); execFormat("insertOrderedList"); }}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon icon="solar:list-1-minimalistic-linear" className="h-3.5 w-3.5" />
            </button>
          </div>}

          {/* Editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => syncToParent()}
            onKeyDown={handleEditorKeyDown}
            onClick={handleEditorClick}
            data-placeholder={compact
              ? (scope === "subject" ? "Type / to insert tokens or AI subject line..." : "Type / to insert tokens...")
              : scope === "merge_only"
              ? "Start writing your email here...\n\nType / to insert personalization tokens like First Name or Company Name."
              : "Start writing your email here...\n\nType / anywhere to insert a personalization variable, an AI-generated paragraph, or a conditional content block."}
            className={cn(
              "w-full bg-background px-4 py-3",
              compact ? "min-h-[36px] py-2 text-sm" : "min-h-[320px]",
              "text-sm leading-relaxed text-foreground",
              "focus:outline-none",
              "overflow-y-auto",
              "email-editor-content",
              "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:whitespace-pre-line empty:before:pointer-events-none"
            )}
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          />
        </div>

        {/* ─── Slash Command Menu ─── */}
        {menuOpen && (
          <div ref={menuRef} className="absolute z-30 animate-in fade-in slide-in-from-top-1 duration-100" style={{ top: menuPos.top, left: menuPos.left }}>
            <div className="bg-popover border border-border rounded-xl shadow-xl w-[280px] overflow-hidden">
              {menuFilter && (
                <div className="px-3 py-2 border-b border-border bg-muted/30">
                  <span className="text-xs text-muted-foreground">Filtering: </span>
                  <span className="text-xs font-medium text-foreground">{menuFilter}</span>
                </div>
              )}
              <div className="max-h-[320px] overflow-y-auto py-1.5">
                {personalItems.length > 0 && (
                  <div>
                    <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Personalization</p>
                    {personalItems.map((item) => {
                      const idx = filteredItems.indexOf(item);
                      return (
                        <button key={item.id} data-active={idx === activeIndex} onMouseEnter={() => setActiveIndex(idx)}
                          onMouseDown={(e) => { e.preventDefault(); handleMenuSelect(item); }}
                          className={cn("w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors", idx === activeIndex ? "bg-accent" : "hover:bg-accent/50")}>
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0 bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                            <Icon icon={item.icon} className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {dynamicItems.length > 0 && (
                  <div>
                    {personalItems.length > 0 && <div className="border-t border-border my-1" />}
                    <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Dynamic Content</p>
                    {dynamicItems.map((item) => {
                      const idx = filteredItems.indexOf(item);
                      const iconBg = item.type === "ai_paragraph" || item.type === "ai_subject_line"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                        : "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400";
                      return (
                        <button key={item.id} data-active={idx === activeIndex} onMouseEnter={() => setActiveIndex(idx)}
                          onMouseDown={(e) => { e.preventDefault(); handleMenuSelect(item); }}
                          className={cn("w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors", idx === activeIndex ? "bg-accent" : "hover:bg-accent/50")}>
                          <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0", iconBg)}>
                            <Icon icon={item.icon} className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {filteredItems.length === 0 && <p className="px-3 py-4 text-xs text-muted-foreground text-center">No matching commands</p>}
              </div>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/30 border-t border-border">
                <span className="text-[10px] text-muted-foreground"><kbd className="px-1 py-0.5 rounded bg-background border border-border font-mono text-[9px]">&uarr;&darr;</kbd> navigate</span>
                <span className="text-[10px] text-muted-foreground"><kbd className="px-1 py-0.5 rounded bg-background border border-border font-mono text-[9px]">&crarr;</kbd> select</span>
                <span className="text-[10px] text-muted-foreground"><kbd className="px-1 py-0.5 rounded bg-background border border-border font-mono text-[9px]">esc</kbd> close</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── Floating AI Prompt ─── */}
        {aiPromptActive && (
          <div className="absolute z-30 animate-in fade-in slide-in-from-top-1 duration-100" style={{ top: aiPromptPos.top, left: aiPromptPos.left }}>
            <div className="bg-popover border border-blue-500/30 rounded-xl shadow-xl w-[360px] overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-500/5 border-b border-blue-500/10">
                <Icon icon="solar:magic-stick-3-linear" className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs font-semibold text-foreground">What should AI write here?</span>
              </div>
              <div className="px-3 py-2.5">
                <input ref={aiInputRef} type="text" value={aiPromptValue}
                  onChange={(e) => setAiPromptValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); confirmAiPrompt(); }
                    else if (e.key === "Escape") { e.preventDefault(); setAiPromptActive(false); editorRef.current?.focus(); }
                  }}
                  onBlur={() => setTimeout(() => { if (aiPromptActive) { setAiPromptActive(false); editorRef.current?.focus(); } }, 150)}
                  placeholder='e.g., "Reference their recent funding round"'
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none" />
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-t border-border">
                <p className="text-[10px] text-muted-foreground">Unique paragraph per contact</p>
                <button onMouseDown={(e) => { e.preventDefault(); confirmAiPrompt(); }} disabled={!aiPromptValue.trim()}
                  className={cn("text-[10px] font-semibold px-2 py-0.5 rounded transition-colors", aiPromptValue.trim() ? "text-blue-600 hover:bg-blue-500/10" : "text-muted-foreground/40 cursor-not-allowed")}>
                  Insert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Chip Edit Popover (portaled to body) ─── */}
      {chipPopover && createPortal(
        <div ref={chipPopoverRef} style={chipPopoverStyle} className="animate-in fade-in zoom-in-95 duration-100">
          <div className="bg-popover border border-border rounded-xl shadow-xl w-[240px] overflow-hidden">
            {/* ── Merge token popover ── */}
            {chipPopover.varData.type === "merge" && (
              <div className="p-2 space-y-1">
                <p className="text-xs font-semibold text-foreground px-1">{chipPopover.varData.label}</p>
                <p className="text-[10px] text-muted-foreground px-1">This will be replaced with the contact's {chipPopover.varData.label.toLowerCase()} at send time.</p>
                <div className="border-t border-border mt-1.5 pt-1.5">
                  <button onClick={handleChipDelete} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-destructive hover:bg-destructive/10 transition-colors">
                    <Icon icon="solar:trash-bin-minimalistic-linear" className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* ── AI paragraph / AI subject line popover ── */}
            {(chipPopover.varData.type === "ai_paragraph" || chipPopover.varData.type === "ai_subject_line") && (
              <div className="p-2 space-y-2">
                <p className="text-xs font-semibold text-foreground px-1 flex items-center gap-1.5">
                  <Icon icon="solar:magic-stick-3-linear" className="h-3.5 w-3.5 text-blue-500" />
                  {chipPopover.varData.type === "ai_subject_line" ? "AI Subject Line" : "AI Paragraph"}
                </p>
                <div className="px-1">
                  <label className="text-[10px] font-medium text-muted-foreground">Prompt</label>
                  <input
                    type="text" value={chipEditPrompt} onChange={(e) => setChipEditPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleChipUpdateAi(); } }}
                    className="w-full mt-1 px-2 py-1.5 rounded-md border border-input bg-background text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                    placeholder="What should AI write?"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-1.5 px-1">
                  <button onClick={handleChipUpdateAi} disabled={!chipEditPrompt.trim()}
                    className={cn("flex-1 text-xs font-medium py-1.5 rounded-md transition-colors", chipEditPrompt.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed")}>
                    Save
                  </button>
                  <button onClick={handleChipDelete} className="px-2 py-1.5 rounded-md text-xs text-destructive hover:bg-destructive/10 transition-colors">
                    <Icon icon="solar:trash-bin-minimalistic-linear" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ── Conditional popover ── */}
            {chipPopover.varData.type === "conditional" && (
              <div className="p-2 space-y-1">
                <p className="text-xs font-semibold text-foreground px-1 flex items-center gap-1.5">
                  <Icon icon="solar:routing-2-linear" className="h-3.5 w-3.5 text-amber-500" />
                  Conditional Block
                </p>
                <p className="text-[10px] text-muted-foreground px-1">Content varies by contact attribute</p>
                <div className="border-t border-border mt-1.5 pt-1.5 space-y-0.5">
                  <button onClick={handleChipEditConditional} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-accent transition-colors">
                    <Icon icon="solar:pen-new-round-linear" className="h-3.5 w-3.5" />
                    Edit Rules
                  </button>
                  <button onClick={handleChipDelete} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-destructive hover:bg-destructive/10 transition-colors">
                    <Icon icon="solar:trash-bin-minimalistic-linear" className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Conditional Block Modal */}
      <ConditionalBlockModal open={conditionalOpen} onOpenChange={setConditionalOpen} existingBlock={editingBlock} onSave={handleConditionalSave} />
    </div>
  );
};

export default SelectiveEmailEditor;
