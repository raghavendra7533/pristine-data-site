import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface WatchlistEmptyStateProps {
  onAddAccount: () => void;
}

export function WatchlistEmptyState({ onAddAccount }: WatchlistEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <Icon icon="solar:eye-linear" className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">
        Your watchlist is empty
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Add the accounts you care about most. When something changes, you'll see it here first.
      </p>
      <Button onClick={onAddAccount} className="gap-2">
        <Icon icon="solar:add-circle-linear" className="h-4 w-4" />
        Add Your First Account
      </Button>
    </div>
  );
}
