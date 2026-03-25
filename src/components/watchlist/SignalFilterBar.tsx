import { cn } from "@/lib/utils";

export type SignalType =
  | "all"
  | "new_funding"
  | "hiring_surge"
  | "new_office"
  | "new_product"
  | "cost_cutting"
  | "intent_surge";

export const SIGNAL_CONFIG: Record<
  SignalType,
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  all: {
    label: "All",
    dot: "bg-primary",
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/30",
  },
  new_funding: {
    label: "New Funding",
    dot: "bg-green-500",
    bg: "bg-green-50 dark:bg-green-500/10",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-500/30",
  },
  hiring_surge: {
    label: "Hiring Surge",
    dot: "bg-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/30",
  },
  new_office: {
    label: "New Office",
    dot: "bg-purple-500",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-500/30",
  },
  new_product: {
    label: "New Product",
    dot: "bg-orange-500",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-500/30",
  },
  cost_cutting: {
    label: "Cost Cutting",
    dot: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-500/30",
  },
  intent_surge: {
    label: "Intent Surge",
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/30",
  },
};

const ALL_TYPES: SignalType[] = [
  "all",
  "new_funding",
  "hiring_surge",
  "new_office",
  "new_product",
  "cost_cutting",
  "intent_surge",
];

interface SignalFilterBarProps {
  active: SignalType[];
  counts: Partial<Record<SignalType, number>>;
  total: number;
  onChange: (types: SignalType[]) => void;
}

export function SignalFilterBar({ active, counts, total, onChange }: SignalFilterBarProps) {
  const toggle = (type: SignalType) => {
    if (type === "all") {
      onChange(["all"]);
      return;
    }
    const withoutAll = active.filter((t) => t !== "all");
    if (withoutAll.includes(type)) {
      const next = withoutAll.filter((t) => t !== type);
      onChange(next.length === 0 ? ["all"] : next);
    } else {
      onChange([...withoutAll, type]);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {ALL_TYPES.map((type) => {
        const cfg = SIGNAL_CONFIG[type];
        const isActive =
          type === "all" ? active.includes("all") : active.includes(type);
        const count = type === "all" ? total : (counts[type] ?? 0);
        const disabled = type !== "all" && count === 0;

        return (
          <button
            key={type}
            onClick={() => !disabled && toggle(type)}
            disabled={disabled}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
              isActive
                ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                : disabled
                ? "bg-muted/40 text-muted-foreground border-border/40 cursor-not-allowed opacity-50"
                : "bg-background text-muted-foreground border-border hover:border-border/80 hover:text-foreground"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
            {cfg.label}
            <span
              className={cn(
                "ml-0.5 text-[10px] font-semibold",
                isActive ? cfg.text : "text-muted-foreground"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
