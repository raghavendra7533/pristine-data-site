import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import AiContentField from "./AiContentField";

export interface ConditionalBlock {
  id: string;
  attribute: string;
  rows: { condition: string; content: string }[];
  fallback: string;
}

interface ConditionalBlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingBlock?: ConditionalBlock | null;
  onSave: (block: ConditionalBlock) => void;
}

const CONDITION_ATTRIBUTES = [
  { value: "industry",       label: "Industry" },
  { value: "job_title",      label: "Job Title" },
  { value: "company_size",   label: "Company Size" },
  { value: "annual_revenue", label: "Annual Revenue" },
  { value: "custom",         label: "Custom" },
];

// Distinct values per attribute — in production these come from the contact list
const ATTRIBUTE_VALUES: Record<string, string[]> = {
  industry: ["Healthcare", "SaaS", "Financial Services", "Fintech", "E-commerce", "Cybersecurity", "Manufacturing", "Education", "Real Estate", "Logistics"],
  job_title: ["VP Engineering", "CTO", "Director", "VP Marketing", "Head of Growth", "CEO", "Founder", "COO", "Head of Sales", "VP Product"],
  company_size: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"],
  annual_revenue: ["<$1M", "$1M-$5M", "$5M-$20M", "$20M-$50M", "$50M-$100M", "$100M+"],
  custom: [],
};

// Sample contacts for the Work List Preview (mirrors mock data in CampaignPreview)
const SAMPLE_CONTACTS: Record<string, Record<string, string>> = {
  "josh@compscience.com": {
    name: "Josh",
    company: "CompScience",
    industry: "Healthcare",
    job_title: "VP Engineering",
    company_size: "51-200",
    annual_revenue: "$5M-$20M",
    custom: "",
  },
  "michael@springventuregroup.com": {
    name: "Michael",
    company: "Spring Venture",
    industry: "SaaS",
    job_title: "CTO",
    company_size: "201-500",
    annual_revenue: "$20M-$50M",
    custom: "",
  },
  "thamilton@unitedfiregroup.com": {
    name: "T. Hamilton",
    company: "United Fire Group",
    industry: "Financial Services",
    job_title: "Director",
    company_size: "501-1000",
    annual_revenue: "$100M+",
    custom: "",
  },
};

const MAX_ROWS = 10;
const MIN_ROWS = 1;
const generateId = () => `cb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

/* ── Render content with AI tokens as blue pills ── */
const AI_TOKEN_RE = /(\{\{ai:\s*.+?\}\})/g;
const AI_LABEL_RE = /\{\{ai:\s*(.+?)\}\}/;

const RenderContent = ({ text, maxLen }: { text: string; maxLen?: number }) => {
  const parts = text.split(AI_TOKEN_RE);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(AI_LABEL_RE);
        if (m) {
          const label = m[1].length > 28 ? m[1].slice(0, 28) + "..." : m[1];
          return (
            <span
              key={i}
              className="variable-chip variable-chip--ai_paragraph"
              style={{ fontSize: 10, lineHeight: "16px", padding: "0px 6px 0px 4px" }}
            >
              <Icon icon="solar:magic-stick-3-linear" className="h-2.5 w-2.5 mr-0.5" />
              AI: {label}
            </span>
          );
        }
        const display = maxLen && part.length > maxLen ? part.slice(0, maxLen) + "..." : part;
        return <span key={i}>{display}</span>;
      })}
    </>
  );
};

const ConditionalBlockModal = ({
  open,
  onOpenChange,
  existingBlock,
  onSave,
}: ConditionalBlockModalProps) => {
  const [attribute, setAttribute] = useState(existingBlock?.attribute ?? "industry");
  const [rows, setRows] = useState<{ condition: string; content: string }[]>(
    existingBlock?.rows ?? [{ condition: "", content: "" }]
  );
  const [fallback, setFallback] = useState(existingBlock?.fallback ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const attributeLabel = CONDITION_ATTRIBUTES.find((a) => a.value === attribute)?.label ?? "Value";

  const resetForm = useCallback(() => {
    setAttribute(existingBlock?.attribute ?? "industry");
    setRows(existingBlock?.rows ?? [{ condition: "", content: "" }]);
    setFallback(existingBlock?.fallback ?? "");
    setErrors({});
  }, [existingBlock]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) resetForm();
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetForm]
  );

  const addRow = useCallback(() => {
    if (rows.length >= MAX_ROWS) return;
    setRows((prev) => [...prev, { condition: "", content: "" }]);
  }, [rows.length]);

  const removeRow = useCallback(
    (index: number) => {
      if (rows.length <= MIN_ROWS) return;
      setRows((prev) => prev.filter((_, i) => i !== index));
    },
    [rows.length]
  );

  const updateRow = useCallback(
    (index: number, field: "condition" | "content", value: string) => {
      setRows((prev) =>
        prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
      );
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`row_${index}_${field}`];
        return next;
      });
    },
    []
  );

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!attribute) newErrors.attribute = "Select a condition attribute";
    rows.forEach((row, i) => {
      if (!row.condition.trim()) newErrors[`row_${i}_condition`] = "Required";
      if (!row.content.trim()) newErrors[`row_${i}_content`] = "Required";
    });
    if (!fallback.trim()) newErrors.fallback = "A fallback is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [attribute, rows, fallback]);

  const handleSave = useCallback(() => {
    if (!validate()) return;
    const block: ConditionalBlock = {
      id: existingBlock?.id ?? generateId(),
      attribute,
      rows: rows.map((r) => ({ condition: r.condition.trim(), content: r.content.trim() })),
      fallback: fallback.trim(),
    };
    onSave(block);
    onOpenChange(false);
  }, [validate, existingBlock, attribute, rows, fallback, onSave, onOpenChange]);

  // Work List Preview — resolve each sample contact against current rows
  const hasPreview = attribute && rows.some((r) => r.condition.trim() && r.content.trim());

  const resolveForContact = (contact: Record<string, string>): { matched: boolean; content: string } => {
    const attrValue = contact[attribute] ?? "";
    const match = rows.find(
      (r) => r.condition.trim().toLowerCase() === attrValue.toLowerCase()
    );
    if (match?.content.trim()) return { matched: true, content: match.content.trim() };
    return { matched: false, content: fallback.trim() || "Default fallback" };
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Icon icon="solar:table-linear" className="h-4 w-4 text-primary" />
            Define Conditional Content
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Build a lookup table: for each attribute value a prospect has, insert matching content.
            The system performs an inner join at send time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* ── Condition Attribute ── */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Join Key (Attribute)</Label>
            <Select value={attribute} onValueChange={setAttribute}>
              <SelectTrigger className={cn("h-9 w-56", errors.attribute && "border-destructive")}>
                <SelectValue placeholder="Select attribute" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {CONDITION_ATTRIBUTES.map((attr) => (
                  <SelectItem key={attr.value} value={attr.value} className="cursor-pointer">
                    {attr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.attribute && (
              <p className="text-xs text-destructive">{errors.attribute}</p>
            )}
          </div>

          {/* ── Supplemental Table ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Supplemental Table</Label>
              <span className="text-xs text-muted-foreground">{rows.length} / {MAX_ROWS} rules</span>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground w-[38%]">
                      When {attributeLabel} is
                    </th>
                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                      Insert this content
                    </th>
                    <th className="w-9" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={index}
                      className={cn(
                        "border-b border-border/50",
                        index % 2 === 0 ? "bg-background" : "bg-muted/10"
                      )}
                    >
                      <td className="px-2 py-2 align-top">
                        {(ATTRIBUTE_VALUES[attribute] ?? []).length > 0 ? (
                          <Select
                            value={row.condition}
                            onValueChange={(val) => updateRow(index, "condition", val)}
                          >
                            <SelectTrigger className={cn("h-8 text-sm", errors[`row_${index}_condition`] && "border-destructive")}>
                              <SelectValue placeholder={`Select ${attributeLabel}`} />
                            </SelectTrigger>
                            <SelectContent className="bg-popover max-h-[200px]">
                              {(ATTRIBUTE_VALUES[attribute] ?? []).map((val) => (
                                <SelectItem key={val} value={val} className="cursor-pointer text-sm">
                                  {val}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            placeholder={`Enter ${attributeLabel}`}
                            value={row.condition}
                            onChange={(e) => updateRow(index, "condition", e.target.value)}
                            className={cn("h-8 text-sm", errors[`row_${index}_condition`] && "border-destructive")}
                          />
                        )}
                        {errors[`row_${index}_condition`] && (
                          <p className="text-[10px] text-destructive mt-0.5">Required</p>
                        )}
                      </td>
                      <td className="px-2 py-2 align-top">
                        <AiContentField
                          value={row.content}
                          onChange={(val) => updateRow(index, "content", val)}
                          placeholder="Content to insert for this match..."
                          hasError={!!errors[`row_${index}_content`]}
                        />
                        {errors[`row_${index}_content`] && (
                          <p className="text-[10px] text-destructive mt-0.5">Required</p>
                        )}
                      </td>
                      <td className="px-1 py-2 align-top">
                        {rows.length > MIN_ROWS && (
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            aria-label={`Remove rule ${index + 1}`}
                          >
                            <Icon icon="solar:close-linear" className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Fallback row — always last */}
                  <tr className="bg-amber-500/5 border-t-2 border-amber-500/20">
                    <td className="px-3 py-3 align-middle">
                      <div className="flex items-center gap-1.5">
                        <Icon icon="solar:shield-check-linear" className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Default (if no match)
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2" colSpan={2}>
                      <AiContentField
                        value={fallback}
                        onChange={(val) => {
                          setFallback(val);
                          setErrors((prev) => { const next = { ...prev }; delete next.fallback; return next; });
                        }}
                        placeholder="Fallback content shown when no condition matches..."
                        hasError={!!errors.fallback}
                      />
                      {errors.fallback && (
                        <p className="text-[10px] text-destructive mt-0.5">{errors.fallback}</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {rows.length < MAX_ROWS && (
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors mt-1"
              >
                <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5" />
                Add Rule
              </button>
            )}
          </div>

          {/* ── Campaign Work List Preview ── */}
          {hasPreview && (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-muted/40 px-3 py-2.5 border-b border-border flex items-center gap-2">
                <Icon icon="solar:link-linear" className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">
                  Campaign Work List Preview
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  — how the join resolves for sample contacts
                </span>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-[30%]">
                      Contact
                    </th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-[20%]">
                      {attributeLabel}
                    </th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Gets
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(SAMPLE_CONTACTS).map(([email, contact], i) => {
                    const { matched, content } = resolveForContact(contact);
                    const attrValue = contact[attribute] ?? "—";
                    return (
                      <tr
                        key={email}
                        className={cn(
                          "border-b border-border/50 last:border-0",
                          i % 2 === 0 ? "bg-background" : "bg-muted/10"
                        )}
                      >
                        <td className="px-3 py-2.5">
                          <span className="text-xs font-medium text-foreground">{contact.name}</span>
                          <span className="text-xs text-muted-foreground"> · {contact.company}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-xs font-medium text-foreground">{attrValue}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          {content ? (
                            <span
                              className={cn(
                                "text-xs",
                                matched
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-muted-foreground italic"
                              )}
                            >
                              <RenderContent text={content} maxLen={70} />
                              {!matched && (
                                <span className="ml-1.5 text-[10px] bg-amber-500/10 text-amber-600 rounded px-1 py-0.5 not-italic">
                                  fallback
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            {existingBlock ? "Update Block" : "Insert Block"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConditionalBlockModal;
