import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SIGNAL_CONFIG, SignalType } from "./SignalFilterBar";
import { WatchlistAccount, SignalEvent, getUrgencyLevel, formatRecency } from "./watchlistData";

const CompanyLogo = ({ domain, name }: { domain: string; name: string }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
      {!imgError ? (
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          className="w-full h-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-sm font-semibold text-muted-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

interface WatchlistAccountCardProps {
  account: WatchlistAccount;
  onSignalClick: (account: WatchlistAccount, signal: SignalEvent) => void;
  onRemove: (id: string) => void;
  onStartOutreach: (account: WatchlistAccount) => void;
}

export function WatchlistAccountCard({
  account,
  onSignalClick,
  onRemove,
  onStartOutreach,
}: WatchlistAccountCardProps) {
  const [hovered, setHovered] = useState(false);
  const urgency = getUrgencyLevel(account.signals);

  const urgencyBorder =
    urgency === "hot"
      ? "border-l-red-500"
      : urgency === "warm"
      ? "border-l-amber-500"
      : "border-l-border";

  const visibleSignals = account.signals.slice(0, 3);
  const extraCount = account.signals.length - 3;

  return (
    <div
      className={cn(
        "relative bg-card border border-border border-l-2 rounded-lg p-4 transition-all duration-150",
        urgencyBorder,
        hovered && "shadow-sm bg-muted/20"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Remove button — hover-revealed */}
      <button
        onClick={() => onRemove(account.id)}
        className={cn(
          "absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150",
          hovered ? "opacity-100" : "opacity-0"
        )}
        title="Remove from watchlist"
      >
        <Icon icon="solar:trash-bin-trash-linear" className="h-3.5 w-3.5" />
      </button>

      {/* Row 1: Logo + Name + urgency dot */}
      <div className="flex items-center gap-3 mb-2 pr-6">
        <CompanyLogo domain={account.domain} name={account.accountName} />
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-semibold text-foreground truncate">
            {account.accountName}
          </span>
          {urgency === "hot" && (
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-[urgency-pulse_3s_ease-in-out_infinite]" />
          )}
          {urgency === "warm" && (
            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Row 2: Meta */}
      <p className="text-[11px] text-muted-foreground mb-3 truncate">
        {account.industry}
        {account.revenue && <> · {account.revenue}</>}
        {account.employees && <> · {account.employees} emp</>}
        {account.location && <> · {account.location}</>}
      </p>

      {/* Row 3: Signal badges */}
      {account.signals.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {visibleSignals.map((sig) => {
            const cfg = SIGNAL_CONFIG[sig.type];
            return (
              <button
                key={sig.id}
                onClick={() => onSignalClick(account, sig)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border cursor-pointer transition-all duration-150 hover:scale-105",
                  cfg.bg,
                  cfg.text,
                  cfg.border
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
                {cfg.label}
                <span className="text-[10px] opacity-70 ml-0.5">{formatRecency(sig.detectedAt)}</span>
              </button>
            );
          })}
          {extraCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 text-[11px] text-muted-foreground">
              +{extraCount} more
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mb-3 text-[11px] text-muted-foreground">
          <Icon icon="solar:radar-linear" className="h-3.5 w-3.5" />
          No signals yet
        </div>
      )}

      {/* Row 4: Watching chips + actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[10px] text-muted-foreground mr-0.5">Watching:</span>
          {account.monitoredSignals.map((type) => {
            const cfg = SIGNAL_CONFIG[type];
            return (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-5 h-5 rounded-full border",
                      cfg.bg,
                      cfg.border
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {cfg.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => account.signals[0] && onSignalClick(account, account.signals[0])}
            disabled={account.signals.length === 0}
          >
            View Signals
          </Button>
          <Button
            variant={urgency === "hot" ? "default" : "outline"}
            size="sm"
            className="h-7 px-2 text-xs gap-1"
            onClick={() => onStartOutreach(account)}
          >
            <Icon icon="solar:letter-linear" className="h-3.5 w-3.5" />
            Start Outreach
          </Button>
        </div>
      </div>
    </div>
  );
}
