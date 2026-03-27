import { useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/*
 * Usage:
 *
 * import AiAssistPanel from "@/components/campaign/AiAssistPanel";
 *
 * <AiAssistPanel onGenerate={(draft) => setEmailBody(draft)} />
 */

interface AiAssistPanelProps {
  onGenerate: (draft: string) => void;
}

const MOCK_DRAFT = `Hi {{first_name}},

I noticed that {{company}} has been expanding rapidly — congrats on the momentum!

Many teams at this stage start running into bottlenecks around outreach personalization and follow-up cadence. That is exactly what we help with.

Would you be open to a quick 15-minute call this week to see if there is a fit?

Best,
{{sender_name}}`;

const AiAssistPanel = ({ onGenerate }: AiAssistPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || generating) return;

    setGenerating(true);

    setTimeout(() => {
      onGenerate(MOCK_DRAFT);
      setGenerating(false);
      setExpanded(false);
      setPrompt("");
    }, 800);
  }, [prompt, generating, onGenerate]);

  const handleCancel = useCallback(() => {
    setExpanded(false);
    setPrompt("");
    setGenerating(false);
  }, []);

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className={cn(
          "w-full flex items-center gap-2 px-4 py-2.5 rounded-lg",
          "bg-blue-500/5 border border-blue-500/20",
          "text-sm text-blue-600 dark:text-blue-400 font-medium",
          "hover:bg-blue-500/10 hover:border-blue-500/30",
          "transition-all duration-200 cursor-pointer",
          "animate-in fade-in duration-200"
        )}
      >
        <Icon icon="solar:magic-stick-3-linear" className="h-4 w-4" />
        Write with AI
      </button>
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-blue-500/20 bg-blue-500/5 overflow-hidden",
        "animate-in fade-in slide-in-from-top-2 duration-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-blue-500/10">
        <Icon
          icon="solar:magic-stick-3-linear"
          className="h-4 w-4 text-blue-500"
        />
        <span className="text-sm font-semibold text-foreground">
          Write with AI
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Tell me what this email should do — rough notes, bullet points, anything."
          rows={3}
          disabled={generating}
          className={cn(
            "w-full resize-none rounded-md border border-blue-500/20 bg-background",
            "px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40",
            "transition-colors duration-150",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={generating}
            className={cn(
              "text-sm text-muted-foreground hover:text-foreground",
              "transition-colors duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Cancel
          </button>

          <Button
            type="button"
            size="sm"
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="gap-1.5"
          >
            {generating ? (
              <>
                <Icon
                  icon="solar:refresh-linear"
                  className="h-4 w-4 animate-spin"
                />
                Generating...
              </>
            ) : (
              <>
                <Icon icon="solar:magic-stick-3-linear" className="h-4 w-4" />
                Generate Draft
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistPanel;
