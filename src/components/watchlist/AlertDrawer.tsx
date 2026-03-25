import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SIGNAL_CONFIG } from "./SignalFilterBar";
import { WatchlistAccount, SignalEvent, formatRecency } from "./watchlistData";
import { toast } from "sonner";

const OUTREACH_TEMPLATES: Record<string, string> = {
  new_funding:
    "Congrats on the Series A — this is usually when teams start thinking about scaling pipeline. We help companies like yours build GTM intelligence on top of their existing stack. Worth a quick conversation?",
  hiring_surge:
    "Noticed you're scaling the GTM team fast — congrats! That's usually when RevOps starts feeling the data quality pain. We might be able to help. Worth 15 minutes?",
  new_office:
    "Saw the news about your new office expansion — exciting! As you scale into new markets, data quality and outreach precision become critical. Would love to show you how we approach this.",
  new_product:
    "Congrats on the launch! New products often mean new ICP segments to reach. We help teams build precise prospect lists quickly. Would a quick demo make sense?",
  cost_cutting:
    "Saw the news about your restructuring. Many RevOps leaders in similar situations have found that consolidating onto a single GTM intelligence platform cuts tool costs significantly. Might be timely to talk?",
  intent_surge:
    "Our data shows your team has been actively researching GTM intelligence tools. I'd rather you evaluate us with full context — happy to walk you through what makes us different. Would this week work?",
  all: "I came across your company and think there's a strong fit with what we do. Would a quick call make sense?",
};

interface AlertDrawerProps {
  open: boolean;
  onClose: () => void;
  account: WatchlistAccount | null;
  signal: SignalEvent | null;
  onMarkSeen: (accountId: string, signalId: string) => void;
}

export function AlertDrawer({
  open,
  onClose,
  account,
  signal,
  onMarkSeen,
}: AlertDrawerProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [outreachText, setOutreachText] = useState("");

  const cfg = signal ? SIGNAL_CONFIG[signal.type] : null;

  // Populate template when signal changes
  const getTemplate = () => {
    if (!signal) return "";
    return OUTREACH_TEMPLATES[signal.type] ?? OUTREACH_TEMPLATES.all;
  };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && signal) {
      setOutreachText(getTemplate());
    }
    if (!isOpen) onClose();
  };

  const handleStartOutreach = () => {
    if (!account || !signal) return;
    toast.success(`Opening campaign builder for ${account.accountName}`);
    onClose();
    navigate(
      `/campaigns/create?account=${encodeURIComponent(account.accountName)}&theme=sales-outreach&signal=${signal.type}`
    );
  };

  const handleMarkSeen = () => {
    if (!account || !signal) return;
    onMarkSeen(account.id, signal.id);
    toast.success("Signal marked as seen");
    onClose();
  };

  const handleCopySummary = () => {
    if (!signal) return;
    navigator.clipboard.writeText(signal.summary).then(() => {
      toast.success("Signal summary copied to clipboard");
    });
  };

  if (!account || !signal || !cfg) return null;

  const relatedSignals = account.signals.filter((s) => s.id !== signal.id);

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent side="right" className="w-[420px] max-w-full p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="p-5 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
              {!imgError ? (
                <img
                  src={`https://logo.clearbit.com/${account.domain}`}
                  alt={account.accountName}
                  className="w-full h-full object-contain p-1"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">
                  {account.accountName.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-sm font-semibold text-foreground">
                {account.accountName}
              </SheetTitle>
              <p className="text-xs text-muted-foreground truncate">{account.domain}</p>
            </div>
          </div>

          {/* Signal type badge */}
          <div className="mt-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border",
                cfg.bg,
                cfg.text,
                cfg.border
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", cfg.dot)} />
              {cfg.label}
              <span className="text-xs font-normal opacity-70">
                · {formatRecency(signal.detectedAt)}
              </span>
            </span>
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Event summary */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              What Happened
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{signal.summary}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[11px] text-muted-foreground">
                Source: {signal.source}
              </p>
              <button
                onClick={handleCopySummary}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <Icon icon="solar:copy-linear" className="h-3 w-3" />
                Copy
              </button>
            </div>
          </div>

          {/* Account stats */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Account Context
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: "Industry", value: account.industry },
                { label: "Revenue", value: account.revenue },
                { label: "Employees", value: account.employees },
                { label: "Location", value: account.location },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="text-xs font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related signals */}
          {relatedSignals.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Related Signals
              </h4>
              <div className="space-y-1.5">
                {relatedSignals.map((rel) => {
                  const relCfg = SIGNAL_CONFIG[rel.type];
                  return (
                    <div
                      key={rel.id}
                      className={cn(
                        "flex items-start gap-2 px-3 py-2 rounded-lg border text-xs",
                        relCfg.bg,
                        relCfg.border
                      )}
                    >
                      <span className={cn("w-2 h-2 rounded-full mt-0.5 flex-shrink-0", relCfg.dot)} />
                      <div className="min-w-0">
                        <span className={cn("font-medium", relCfg.text)}>{relCfg.label}</span>
                        <span className="text-muted-foreground ml-1.5">{formatRecency(rel.detectedAt)}</span>
                        <p className="text-muted-foreground mt-0.5 line-clamp-1">{rel.summary}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended action */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Suggested Opener
            </h4>
            <p className="text-[10px] text-muted-foreground mb-1.5">
              Edit before sending — this is pre-populated based on the signal type.
            </p>
            <Textarea
              value={outreachText}
              onChange={(e) => setOutreachText(e.target.value)}
              className="text-sm min-h-[100px] resize-none"
              placeholder="Your personalized opener..."
            />
          </div>
        </div>

        {/* Sticky footer */}
        <div className="flex-shrink-0 border-t border-border p-4 space-y-2 bg-card">
          <Button
            className="w-full gap-2"
            onClick={handleStartOutreach}
          >
            <Icon icon="solar:letter-linear" className="h-4 w-4" />
            Start Outreach
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 text-xs h-8 gap-1"
              onClick={() => {
                toast.success(`${account.accountName} added to list`);
              }}
            >
              <Icon icon="solar:documents-linear" className="h-3.5 w-3.5" />
              Add to List
            </Button>
            {!signal.seenAt && (
              <button
                onClick={handleMarkSeen}
                className="flex-1 text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                Mark as seen
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
