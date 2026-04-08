import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

// Mock data
const performanceMetricsByPeriod = {
  last7days: [
    { title: "Total Campaigns", value: "8", change: "+14%", icon: "solar:layers-linear", color: "bg-primary/10 text-primary" },
    { title: "Avg Open Rate", value: "52.1%", change: "+8.2%", icon: "solar:graph-up-linear", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { title: "Avg Click Rate", value: "28.3%", change: "+6.5%", icon: "solar:cursor-linear", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    { title: "Avg Response Rate", value: "12.7%", change: "+4.2%", icon: "solar:chat-round-line-linear", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" }
  ],
  mtd: [
    { title: "Total Campaigns", value: "18", change: "+11%", icon: "solar:layers-linear", color: "bg-primary/10 text-primary" },
    { title: "Avg Open Rate", value: "49.8%", change: "+6.5%", icon: "solar:graph-up-linear", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { title: "Avg Click Rate", value: "26.1%", change: "+4.2%", icon: "solar:cursor-linear", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    { title: "Avg Response Rate", value: "11.3%", change: "+3.1%", icon: "solar:chat-round-line-linear", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" }
  ],
  last4weeks: [
    { title: "Total Campaigns", value: "24", change: "+12%", icon: "solar:layers-linear", color: "bg-primary/10 text-primary" },
    { title: "Avg Open Rate", value: "48.2%", change: "+5.3%", icon: "solar:graph-up-linear", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { title: "Avg Click Rate", value: "24.7%", change: "+3.1%", icon: "solar:cursor-linear", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    { title: "Avg Response Rate", value: "10.4%", change: "+2.8%", icon: "solar:chat-round-line-linear", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" }
  ],
  custom: [
    { title: "Total Campaigns", value: "15", change: "+9%", icon: "solar:layers-linear", color: "bg-primary/10 text-primary" },
    { title: "Avg Open Rate", value: "50.3%", change: "+7.1%", icon: "solar:graph-up-linear", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { title: "Avg Click Rate", value: "25.8%", change: "+4.8%", icon: "solar:cursor-linear", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    { title: "Avg Response Rate", value: "11.9%", change: "+3.5%", icon: "solar:chat-round-line-linear", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" }
  ]
};

const activeCampaigns = [
  { id: 1, clientId: "2", name: "Q1 SaaS Outreach", type: "Sales Outreach", totalLeads: 1200, contacted: 600, openRate: 45.2, clickRate: 24.1, createdDate: "2025-01-15" },
  { id: 2, clientId: "3", name: "Healthcare Lead Nurture", type: "Lead Nurture", totalLeads: 850, contacted: 420, openRate: 38.7, clickRate: 18.5, createdDate: "2025-01-10" },
  { id: 3, clientId: "1", name: "Event Follow-up", type: "Event Outreach", totalLeads: 650, contacted: 380, openRate: 52.1, clickRate: 28.3, createdDate: "2025-01-08" }
];

const draftCampaigns = [
  { id: 4, name: "Enterprise ABM Campaign", type: "ABM Outreach", totalLeads: 150, lastEdited: "2025-01-18", completion: 75 },
  { id: 5, name: "Product Launch Sequence", type: "Product Marketing", totalLeads: 2500, lastEdited: "2025-01-17", completion: 45 },
  { id: 6, name: "Re-engagement Campaign", type: "Lead Nurture", totalLeads: 890, lastEdited: "2025-01-16", completion: 60 }
];

const completedCampaigns = [
  { id: 7, name: "Q4 Enterprise Push", type: "Sales Outreach", totalLeads: 1800, contacted: 1800, openRate: 52.3, clickRate: 28.9, responseRate: 12.4, completedDate: "2025-01-05" },
  { id: 8, name: "Holiday Promotion", type: "Marketing", totalLeads: 3200, contacted: 3200, openRate: 41.2, clickRate: 19.8, responseRate: 8.7, completedDate: "2024-12-20" },
  { id: 9, name: "Partner Webinar Follow-up", type: "Event Outreach", totalLeads: 540, contacted: 540, openRate: 58.1, clickRate: 31.2, responseRate: 15.3, completedDate: "2024-12-15" }
];

export default function CampaignDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [timePeriod, setTimePeriod] = useState<"last7days" | "mtd" | "last4weeks" | "custom">("last7days");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });

  const performanceMetrics = performanceMetricsByPeriod[timePeriod];

  return (
    <div className="min-h-full">
      {/* Performance Metrics Section */}
      <section className="px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon icon="solar:chart-2-linear" className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Campaign Performance</h2>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as typeof timePeriod)}>
              <TabsList className="h-8">
                <TabsTrigger value="last7days" className="text-xs px-3">7 days</TabsTrigger>
                <TabsTrigger value="mtd" className="text-xs px-3">MTD</TabsTrigger>
                <TabsTrigger value="last4weeks" className="text-xs px-3">4 weeks</TabsTrigger>
                <TabsTrigger value="custom" className="text-xs px-3">Custom</TabsTrigger>
              </TabsList>
            </Tabs>

            {timePeriod === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-[200px] justify-start text-left text-xs",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <Icon icon="solar:calendar-linear" className="mr-2 h-3.5 w-3.5" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM d, y")
                      )
                    ) : (
                      <span>Pick dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            )}

            <Button
              size="sm"
              onClick={() => navigate("/campaigns/create")}
              className="bg-primary hover:bg-primary/90"
            >
              <Icon icon="solar:add-circle-linear" className="h-4 w-4 mr-1.5" />
              New Campaign
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {performanceMetrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", metric.color.split(" ")[0])}>
                    <Icon icon={metric.icon} className={cn("h-4 w-4", metric.color.split(" ").slice(1).join(" "))} />
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 text-xs">
                    {metric.change}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-0.5">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Campaign Tabs */}
      <section className="px-6 pb-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-9 mb-4">
            <TabsTrigger value="active" className="gap-1.5 text-xs px-4">
              <Icon icon="solar:play-circle-linear" className="h-3.5 w-3.5" />
              Active
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{activeCampaigns.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="draft" className="gap-1.5 text-xs px-4">
              <Icon icon="solar:pen-new-square-linear" className="h-3.5 w-3.5" />
              Drafts
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{draftCampaigns.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1.5 text-xs px-4">
              <Icon icon="solar:check-circle-linear" className="h-3.5 w-3.5" />
              Completed
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{completedCampaigns.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Active Campaigns */}
          <TabsContent value="active" className="space-y-3 mt-0">
            {activeCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="hover:bg-muted/30 transition-all cursor-pointer group"
                onClick={() => navigate(`/campaigns/${campaign.id}/analytics`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:letter-linear" className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-semibold">{campaign.name}</h3>
                          <Badge variant="outline" className="text-[10px]">{campaign.type}</Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon icon="solar:calendar-linear" className="h-3 w-3" />
                          Started {new Date(campaign.createdDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{campaign.totalLeads}</p>
                        <p className="text-[10px] text-muted-foreground">Leads</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{campaign.contacted}</p>
                        <p className="text-[10px] text-muted-foreground">Contacted</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{campaign.openRate}%</p>
                        <p className="text-[10px] text-muted-foreground">Open</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{campaign.clickRate}%</p>
                        <p className="text-[10px] text-muted-foreground">Click</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs flex-shrink-0"
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin-capacity/${campaign.clientId}`); }}
                      >
                        <Icon icon="solar:calendar-mark-linear" className="h-3.5 w-3.5" />
                        Calendar
                      </Button>
                      <Icon icon="solar:arrow-right-linear" className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Draft Campaigns */}
          <TabsContent value="draft" className="space-y-3 mt-0">
            {draftCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="hover:bg-muted/30 transition-all cursor-pointer group"
                onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:pen-new-square-linear" className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-semibold">{campaign.name}</h3>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
                            Draft
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">{campaign.type}</Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon icon="solar:calendar-linear" className="h-3 w-3" />
                          Edited {new Date(campaign.lastEdited).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{campaign.totalLeads}</p>
                        <p className="text-[10px] text-muted-foreground">Target</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500"
                              style={{ width: `${campaign.completion}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold">{campaign.completion}%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Complete</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        Continue
                        <Icon icon="solar:arrow-right-linear" className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Completed Campaigns */}
          <TabsContent value="completed" className="space-y-3 mt-0">
            {completedCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="hover:bg-muted/30 transition-all cursor-pointer group"
                onClick={() => navigate(`/campaigns/${campaign.id}/analytics`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:check-circle-linear" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-semibold">{campaign.name}</h3>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                            Completed
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">{campaign.type}</Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon icon="solar:calendar-linear" className="h-3 w-3" />
                          Completed {new Date(campaign.completedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{campaign.totalLeads}</p>
                        <p className="text-[10px] text-muted-foreground">Leads</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{campaign.openRate}%</p>
                        <p className="text-[10px] text-muted-foreground">Open</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{campaign.clickRate}%</p>
                        <p className="text-[10px] text-muted-foreground">Click</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{campaign.responseRate}%</p>
                        <p className="text-[10px] text-muted-foreground">Reply</p>
                      </div>
                      <Icon icon="solar:arrow-right-linear" className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
