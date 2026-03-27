import { useState, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import type { StageContent } from "@/pages/CreateCampaign";

interface StageNavigatorProps {
  stages: StageContent[];
  activeStage: number;
  maxStages?: number;
  onStageSelect: (index: number) => void;
  onStageAdd: () => void;
  onStageTitleChange: (index: number, title: string) => void;
  onStageRemove: (index: number) => void;
}

/* ─── Inline-editable title ─── */

interface InlineTitleProps {
  value: string;
  onChange: (value: string) => void;
}

function InlineTitle({ value, onChange }: InlineTitleProps) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = useCallback(() => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onChange(trimmed);
    } else {
      setDraft(value);
    }
  }, [draft, value, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputRef.current?.blur();
      }
      if (e.key === "Escape") {
        setDraft(value);
        inputRef.current?.blur();
      }
    },
    [value],
  );

  // Keep draft in sync when parent value changes
  // (e.g. stage reorder or external rename)
  if (value !== draft && document.activeElement !== inputRef.current) {
    setDraft(value);
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
      aria-label="Stage title"
      className={cn(
        "w-full truncate bg-transparent text-sm font-medium",
        "border border-transparent rounded px-1 -mx-1",
        "outline-none transition-colors duration-150",
        "focus:border-border focus:bg-background",
        "text-foreground placeholder:text-muted-foreground",
      )}
    />
  );
}

/* ─── Stage item ─── */

interface StageItemProps {
  stage: StageContent;
  index: number;
  isActive: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onTitleChange: (title: string) => void;
  onRemove: () => void;
}

function StageItem({
  stage,
  index,
  isActive,
  canDelete,
  onSelect,
  onTitleChange,
  onRemove,
}: StageItemProps) {
  const hasContent = stage.body.trim().length > 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? "true" : undefined}
      aria-label={`Stage ${index + 1}: ${stage.title}`}
      className={cn(
        "group relative flex w-full items-start gap-2.5 rounded-md px-3 py-2.5",
        "text-left transition-colors duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isActive
          ? "border-l-2 border-l-primary bg-accent/50"
          : "border-l-2 border-l-transparent hover:bg-accent/30",
      )}
    >
      {/* Number badge */}
      <span
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150",
          isActive
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {index + 1}
      </span>

      {/* Title + status */}
      <div className="min-w-0 flex-1">
        <InlineTitle value={stage.title} onChange={onTitleChange} />

        {/* Status indicator */}
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-block h-1.5 w-1.5 rounded-full transition-colors duration-150",
              hasContent ? "bg-emerald-500" : "bg-muted-foreground/40",
            )}
            aria-hidden="true"
          />
          <span className="text-[11px] text-muted-foreground">
            {hasContent ? "Has content" : "Empty"}
          </span>
        </div>
      </div>

      {/* Delete button */}
      {canDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove stage ${index + 1}`}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded",
            "text-muted-foreground/60 opacity-0 transition-all duration-150",
            "hover:bg-destructive/10 hover:text-destructive",
            "focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring",
            "group-hover:opacity-100",
          )}
        >
          <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
        </button>
      )}
    </button>
  );
}

/* ─── Stage Navigator ─── */

const StageNavigator = ({
  stages,
  activeStage,
  maxStages = 5,
  onStageSelect,
  onStageAdd,
  onStageTitleChange,
  onStageRemove,
}: StageNavigatorProps) => {
  const canAdd = stages.length < maxStages;
  const canDelete = stages.length > 1;

  return (
    <aside
      className={cn(
        "flex w-60 shrink-0 flex-col border-r border-border bg-card",
        "h-full overflow-hidden",
      )}
      aria-label="Stage navigator"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Stages</h2>
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5",
            "bg-muted text-[11px] font-medium text-muted-foreground",
          )}
        >
          {stages.length}
        </span>
      </div>

      {/* Stage list */}
      <nav
        className="flex-1 space-y-0.5 overflow-y-auto p-2"
        aria-label="Campaign stages"
      >
        {stages.map((stage, index) => (
          <StageItem
            key={stage.stageNumber}
            stage={stage}
            index={index}
            isActive={index === activeStage}
            canDelete={canDelete}
            onSelect={() => onStageSelect(index)}
            onTitleChange={(title) => onStageTitleChange(index, title)}
            onRemove={() => onStageRemove(index)}
          />
        ))}
      </nav>

      {/* Add stage button */}
      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={onStageAdd}
          disabled={!canAdd}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2",
            "text-sm font-medium transition-colors duration-150",
            "border border-dashed border-border",
            canAdd
              ? "text-foreground hover:bg-accent hover:border-solid cursor-pointer"
              : "cursor-not-allowed text-muted-foreground/50",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          )}
          aria-label={
            canAdd
              ? "Add a new stage"
              : `Maximum of ${maxStages} stages reached`
          }
        >
          <Icon icon="solar:add-circle-linear" className="h-4 w-4" />
          Add Stage
        </button>
      </div>
    </aside>
  );
};

export default StageNavigator;
