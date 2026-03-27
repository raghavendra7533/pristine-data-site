import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { campaignThemes } from "./campaignThemes";

interface TemplateEntryProps {
  onSelectTemplate: (
    templateSource: "prebuilt" | "saved" | "scratch",
    themeId?: string
  ) => void;
}

/**
 * Screen 0 -- Entry point when a user clicks "Create Campaign".
 * Presents three paths: pre-built templates, saved templates, or start from scratch.
 *
 * @example
 * <TemplateEntry onSelectTemplate={(source, themeId) => {
 *   if (source === "prebuilt") navigateToSetup(themeId);
 *   else if (source === "scratch") navigateToBlankEditor();
 * }} />
 */
const TemplateEntry = ({ onSelectTemplate }: TemplateEntryProps) => {
  return (
    <div className="animate-fade-in mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Create Campaign
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Choose how you want to get started
        </p>
      </header>

      {/* ── Section 1: Pre-built Templates ── */}
      <section className="mb-12">
        <h2 className="mb-1 text-lg font-semibold text-foreground">
          Pre-built Templates
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Pick a proven template and customize it to your needs.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaignThemes.map((theme, idx) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTemplate("prebuilt", theme.id)}
              className={cn(
                "group flex items-start gap-4 rounded-xl border border-border bg-card p-4 text-left",
                "transition-all duration-200 ease-out",
                "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              style={{
                animationDelay: `${idx * 40}ms`,
                animationFillMode: "backwards",
              }}
            >
              {/* Icon */}
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  theme.iconBg
                )}
              >
                <Icon
                  icon={theme.icon}
                  className={cn("h-5 w-5", theme.iconColor)}
                />
              </span>

              {/* Text */}
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {theme.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {theme.info}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Section 2: Saved Templates ── */}
      <section className="mb-12">
        <h2 className="mb-1 text-lg font-semibold text-foreground">
          Saved Templates
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Reuse a template you have saved from a previous campaign.
        </p>

        <div
          className={cn(
            "flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-5",
            "opacity-60 cursor-default select-none"
          )}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon
              icon="solar:bookmark-linear"
              className="h-5 w-5 text-muted-foreground"
            />
          </span>
          <span className="text-sm text-muted-foreground">
            You haven&apos;t saved a template yet. Complete a campaign and save
            it as a template.
          </span>
        </div>
      </section>

      {/* ── Section 3: Build from Scratch ── */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-foreground">
          Build from Scratch
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Start with a blank canvas and full creative freedom.
        </p>

        <button
          type="button"
          onClick={() => onSelectTemplate("scratch")}
          className={cn(
            "group flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-border bg-card p-5 text-left",
            "transition-all duration-200 ease-out",
            "hover:border-primary/50 hover:bg-primary/[0.03] hover:shadow-md hover:shadow-primary/5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              "bg-primary/10 text-primary transition-colors",
              "group-hover:bg-primary/15"
            )}
          >
            <Icon icon="solar:add-circle-linear" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              Start from Scratch
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Open a blank editor and write your email from the ground up.
            </span>
          </span>
        </button>
      </section>
    </div>
  );
};

export default TemplateEntry;
