import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { SIGNAL_CONFIG, SignalType } from "./SignalFilterBar";
import { SEARCH_ACCOUNTS, WatchlistAccount } from "./watchlistData";
import { toast } from "sonner";

const SIGNAL_TYPES: { type: SignalType; description: string }[] = [
  { type: "new_funding", description: "Tracks Series A–D rounds, grants, and debt financing" },
  { type: "hiring_surge", description: "Detects rapid headcount growth in Sales, Eng, or all depts" },
  { type: "new_office", description: "Monitors new office openings and geographic expansion" },
  { type: "new_product", description: "Tracks product launches, partnerships, and announcements" },
  { type: "cost_cutting", description: "Identifies restructurings, layoffs, and efficiency programs" },
  { type: "intent_surge", description: "Bombora intent — high or very high research activity" },
];

interface SearchAccount {
  id: string;
  accountName: string;
  domain: string;
  industry: string;
  employees: string;
  location: string;
}

interface AddAccountModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (accounts: WatchlistAccount[]) => void;
  existingIds: string[];
}

const CompanyLogo = ({ domain, name }: { domain: string; name: string }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="w-7 h-7 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
      {!imgError ? (
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          className="w-full h-full object-contain p-0.5"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-xs font-semibold text-muted-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export function AddAccountModal({
  open,
  onClose,
  onAdd,
  existingIds,
}: AddAccountModalProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SearchAccount | null>(null);
  const [signals, setSignals] = useState<SignalType[]>([
    "new_funding",
    "hiring_surge",
    "new_office",
    "new_product",
    "cost_cutting",
    "intent_surge",
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(null);
      setSignals(["new_funding", "hiring_surge", "new_office", "new_product", "cost_cutting", "intent_surge"]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const filtered = query.trim().length > 0
    ? SEARCH_ACCOUNTS.filter(
        (a) =>
          !existingIds.includes(a.id) &&
          (a.accountName.toLowerCase().includes(query.toLowerCase()) ||
            a.domain.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  const toggleSignal = (type: SignalType) => {
    setSignals((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const allSelected = signals.length === SIGNAL_TYPES.length;
  const toggleAll = () => {
    setSignals(allSelected ? [] : SIGNAL_TYPES.map((s) => s.type));
  };

  const handleAdd = () => {
    if (!selected || signals.length === 0) return;

    const newAccount: WatchlistAccount = {
      id: `wa_${Date.now()}`,
      accountName: selected.accountName,
      domain: selected.domain,
      industry: selected.industry,
      revenue: "–",
      employees: selected.employees,
      location: selected.location,
      addedAt: new Date().toISOString(),
      monitoredSignals: signals,
      signals: [],
    };

    onAdd([newAccount]);
    toast.success(
      `${selected.accountName} added to watchlist. Monitoring: ${signals.map((s) => SIGNAL_CONFIG[s].label).join(", ")}.`
    );

    // Reset for next account without closing
    setQuery("");
    setSelected(null);
    setSignals(["new_funding", "hiring_surge", "new_office", "new_product", "cost_cutting", "intent_surge"]);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const canAdd = selected !== null && signals.length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border">
          <DialogTitle className="text-sm font-semibold">Add Account to Watchlist</DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search for an account, then choose which signals to monitor.
          </p>
        </DialogHeader>

        <div className="p-5 space-y-5">
          {/* Search */}
          <div>
            <div className="relative">
              <Icon
                icon="solar:magnifer-linear"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              />
              <Input
                ref={inputRef}
                placeholder="Search by company name or domain..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(null);
                }}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Results */}
            {filtered.length > 0 && (
              <div className="mt-2 border border-border rounded-lg overflow-hidden">
                {filtered.map((account, i) => (
                  <button
                    key={account.id}
                    onClick={() => {
                      setSelected(account);
                      setQuery(account.accountName);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
                      i > 0 && "border-t border-border/50",
                      selected?.id === account.id && "bg-primary/5"
                    )}
                  >
                    <CompanyLogo domain={account.domain} name={account.accountName} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{account.accountName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {account.industry} · {account.location}
                      </p>
                    </div>
                    {selected?.id === account.id && (
                      <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {query.trim().length > 0 && filtered.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2 px-1">No results found for "{query}"</p>
            )}
          </div>

          {/* Signal selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-foreground">Which signals to monitor?</p>
              <button
                onClick={toggleAll}
                className="text-xs text-primary hover:underline"
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="space-y-1.5">
              {SIGNAL_TYPES.map(({ type, description }) => {
                const cfg = SIGNAL_CONFIG[type];
                const checked = signals.includes(type);
                return (
                  <label
                    key={type}
                    className={cn(
                      "flex items-start gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-150",
                      checked ? `${cfg.bg} ${cfg.border}` : "border-border hover:bg-muted/40"
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleSignal(type)}
                      className="mt-0.5"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
                        <span className={cn("text-xs font-medium", checked ? cfg.text : "text-foreground")}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center gap-2.5">
          <Button
            className="flex-1 gap-2"
            disabled={!canAdd}
            onClick={handleAdd}
          >
            <Icon icon="solar:add-circle-linear" className="h-4 w-4" />
            Add to Watchlist
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
