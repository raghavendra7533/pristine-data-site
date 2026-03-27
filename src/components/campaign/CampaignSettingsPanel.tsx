import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
import type { CampaignData } from "@/pages/CreateCampaign";

/* ─── Props ─── */

interface CampaignSettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CampaignData;
  onUpdate: (data: CampaignData) => void;
}

/* ─── Mock contact lists ─── */

const CONTACT_LISTS = [
  { id: "list-1", name: "Enterprise Prospects Q1 2024", count: 1234 },
  { id: "list-2", name: "Event Attendees - TechConf 2024", count: 856 },
  { id: "list-3", name: "Product Launch Beta Users", count: 432 },
  { id: "list-4", name: "Competitor Accounts - Top 500", count: 500 },
  { id: "list-5", name: "Nurture List - Warm Leads", count: 2150 },
] as const;

/* ─── Component ─── */

const CampaignSettingsPanel = ({
  open,
  onOpenChange,
  data,
  onUpdate,
}: CampaignSettingsPanelProps) => {
  const handleChange = <K extends keyof CampaignData>(
    field: K,
    value: CampaignData[K],
  ) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon
              icon="solar:settings-linear"
              className="h-5 w-5 text-muted-foreground"
            />
            Campaign Settings
          </SheetTitle>
          <SheetDescription>
            Configure the core details for your campaign.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* ── Campaign Name ── */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              placeholder="e.g. Q1 Product Launch Outreach"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* ── Contact List ── */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-list">
              Contact List{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </Label>
            <Select
              value={data.contactList}
              onValueChange={(value) => handleChange("contactList", value)}
            >
              <SelectTrigger id="contact-list" className={cn("w-full")}>
                <SelectValue placeholder="Select a contact list" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_LISTS.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    <span className="flex items-center gap-2">
                      <Icon
                        icon="solar:users-group-rounded-linear"
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                      />
                      <span className="truncate">{list.name}</span>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                        {list.count.toLocaleString()}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ── Additional Instructions ── */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="campaign-instructions">Hint (Optional)</Label>
            <Textarea
              id="campaign-instructions"
              placeholder="Add any specific requirements, tone preferences, or audience details..."
              className="min-h-[120px] resize-y"
              value={data.instructions}
              onChange={(e) => handleChange("instructions", e.target.value)}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CampaignSettingsPanel;
