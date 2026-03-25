import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { SignalFilterBar, SignalType } from "@/components/watchlist/SignalFilterBar";
import { WatchlistEmptyState } from "@/components/watchlist/WatchlistEmptyState";
import { WatchlistAccountCard } from "@/components/watchlist/WatchlistAccountCard";
import { AlertDrawer } from "@/components/watchlist/AlertDrawer";
import { AddAccountModal } from "@/components/watchlist/AddAccountModal";
import {
  MOCK_WATCHLIST,
  WatchlistAccount,
  SignalEvent,
  getUrgencyLevel,
} from "@/components/watchlist/watchlistData";

// Urgency score: hot=3, warm=2, cool=1, none=0; then by most recent signal
function urgencyScore(account: WatchlistAccount): number {
  const lvl = getUrgencyLevel(account.signals);
  const baseScore = { hot: 3, warm: 2, cool: 1, none: 0 }[lvl];
  const recent = account.signals.reduce((max, s) => {
    const t = new Date(s.detectedAt).getTime();
    return t > max ? t : max;
  }, 0);
  return baseScore * 1e15 + recent;
}

export default function Watchlist() {
  const [accounts, setAccounts] = useState<WatchlistAccount[]>(MOCK_WATCHLIST);
  const [activeFilters, setActiveFilters] = useState<SignalType[]>(["all"]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAccount, setDrawerAccount] = useState<WatchlistAccount | null>(null);
  const [drawerSignal, setDrawerSignal] = useState<SignalEvent | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Count signals per type across all accounts
  const signalCounts = useMemo(() => {
    const counts: Partial<Record<SignalType, number>> = {};
    for (const acc of accounts) {
      const types = new Set(acc.signals.map((s) => s.type));
      types.forEach((type) => {
        counts[type] = (counts[type] ?? 0) + 1;
      });
    }
    return counts;
  }, [accounts]);

  // Filter + sort
  const filteredAccounts = useMemo(() => {
    let list = [...accounts];

    if (!activeFilters.includes("all")) {
      list = list.filter((acc) =>
        acc.signals.some((s) => activeFilters.includes(s.type))
      );
    }

    list.sort((a, b) => urgencyScore(b) - urgencyScore(a));
    return list;
  }, [accounts, activeFilters]);

  const hotCount = accounts.filter((a) => getUrgencyLevel(a.signals) === "hot").length;

  const handleSignalClick = (account: WatchlistAccount, signal: SignalEvent) => {
    setDrawerAccount(account);
    setDrawerSignal(signal);
    setDrawerOpen(true);
  };

  const handleMarkSeen = (accountId: string, signalId: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? {
              ...acc,
              signals: acc.signals.map((s) =>
                s.id === signalId ? { ...s, seenAt: new Date().toISOString() } : s
              ),
            }
          : acc
      )
    );
  };

  const handleRemove = (id: string) => {
    const account = accounts.find((a) => a.id === id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    toast.success(`${account?.accountName ?? "Account"} removed from watchlist`);
  };

  const handleAdd = (newAccounts: WatchlistAccount[]) => {
    setAccounts((prev) => [...prev, ...newAccounts]);
  };

  const handleStartOutreach = (account: WatchlistAccount) => {
    if (account.signals.length > 0) {
      handleSignalClick(account, account.signals[0]);
    } else {
      toast.info("No signals yet — open campaign builder manually from Sequence Builder.");
    }
  };

  const subtitle = useMemo(() => {
    if (activeFilters.includes("all")) {
      return `${accounts.length} accounts monitored`;
    }
    return `Showing ${filteredAccounts.length} account${filteredAccounts.length !== 1 ? "s" : ""} with active filters`;
  }, [accounts.length, filteredAccounts.length, activeFilters]);

  return (
    <div className="min-h-full bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-semibold text-foreground">Watchlist</h1>
              {hotCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-xs font-semibold text-red-700 dark:text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[urgency-pulse_3s_ease-in-out_infinite]" />
                  {hotCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={() => toast.info("Signal configuration coming soon")}
            >
              <Icon icon="solar:settings-linear" className="h-3.5 w-3.5" />
              Configure Signals
            </Button>
            <Button
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={() => {
                if (accounts.length >= 50) {
                  toast.error(
                    "You've reached the 50-account limit. Remove an account to add a new one."
                  );
                  return;
                }
                setAddModalOpen(true);
              }}
            >
              <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5" />
              Add Account
            </Button>
          </div>
        </div>

        {/* Signal filter bar */}
        {accounts.length > 0 && (
          <div className="mt-4">
            <SignalFilterBar
              active={activeFilters}
              counts={signalCounts}
              total={accounts.length}
              onChange={setActiveFilters}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {accounts.length === 0 ? (
          <WatchlistEmptyState onAddAccount={() => setAddModalOpen(true)} />
        ) : filteredAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Icon icon="solar:filter-linear" className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No accounts match this filter</p>
            <p className="text-xs text-muted-foreground">
              Try selecting a different signal type or clear the filter.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-xs"
              onClick={() => setActiveFilters(["all"])}
            >
              Clear filter
            </Button>
          </div>
        ) : (
          <div className="space-y-2 max-w-3xl">
            <p className="text-[11px] text-muted-foreground mb-3 flex items-center gap-1">
              <Icon icon="solar:sort-vertical-linear" className="h-3 w-3" />
              Sorted by urgency
            </p>
            {filteredAccounts.map((account) => (
              <WatchlistAccountCard
                key={account.id}
                account={account}
                onSignalClick={handleSignalClick}
                onRemove={handleRemove}
                onStartOutreach={handleStartOutreach}
              />
            ))}
          </div>
        )}
      </div>

      {/* Alert Drawer */}
      <AlertDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        account={drawerAccount}
        signal={drawerSignal}
        onMarkSeen={handleMarkSeen}
      />

      {/* Add Account Modal */}
      <AddAccountModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAdd}
        existingIds={accounts.map((a) => a.id)}
      />
    </div>
  );
}
