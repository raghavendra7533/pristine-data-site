import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Plus, 
  Mail, 
  TrendingUp, 
  MousePointer, 
  MessageSquare, 
  Calendar as CalendarIcon,
  Users,
  Target,
  ArrowRight,
  FileEdit,
  CheckCircle2,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const performanceMetricsByPeriod = {
  last7days: [
    {
      title: "Total Campaigns",
      value: "8",
      change: "+14%",
      icon: Layers,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Avg Open Rate",
      value: "52.1%",
      change: "+8.2%",
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Avg Click Rate",
      value: "28.3%",
      change: "+6.5%",
      icon: MousePointer,
      color: "from-violet-500 to-violet-600"
    },
    {
      title: "Avg Response Rate",
      value: "12.7%",
      change: "+4.2%",
      icon: MessageSquare,
      color: "from-fuchsia-500 to-fuchsia-600"
    }
  ],
  mtd: [
    {
      title: "Total Campaigns",
      value: "18",
      change: "+11%",
      icon: Layers,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Avg Open Rate",
      value: "49.8%",
      change: "+6.5%",
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Avg Click Rate",
      value: "26.1%",
      change: "+4.2%",
      icon: MousePointer,
      color: "from-violet-500 to-violet-600"
    },
    {
      title: "Avg Response Rate",
      value: "11.3%",
      change: "+3.1%",
      icon: MessageSquare,
      color: "from-fuchsia-500 to-fuchsia-600"
    }
  ],
  last4weeks: [
    {
      title: "Total Campaigns",
      value: "24",
      change: "+12%",
      icon: Layers,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Avg Open Rate",
      value: "48.2%",
      change: "+5.3%",
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Avg Click Rate",
      value: "24.7%",
      change: "+3.1%",
      icon: MousePointer,
      color: "from-violet-500 to-violet-600"
    },
    {
      title: "Avg Response Rate",
      value: "10.4%",
      change: "+2.8%",
      icon: MessageSquare,
      color: "from-fuchsia-500 to-fuchsia-600"
    }
  ],
  custom: [
    {
      title: "Total Campaigns",
      value: "15",
      change: "+9%",
      icon: Layers,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Avg Open Rate",
      value: "50.3%",
      change: "+7.1%",
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Avg Click Rate",
      value: "25.8%",
      change: "+4.8%",
      icon: MousePointer,
      color: "from-violet-500 to-violet-600"
    },
    {
      title: "Avg Response Rate",
      value: "11.9%",
      change: "+3.5%",
      icon: MessageSquare,
      color: "from-fuchsia-500 to-fuchsia-600"
    }
  ]
};

const activeCampaigns = [
  {
    id: 1,
    name: "Q1 SaaS Outreach",
    type: "Sales Outreach",
    totalLeads: 1200,
    contacted: 600,
    openRate: 45.2,
    clickRate: 24.1,
    createdDate: "2025-01-15"
  },
  {
    id: 2,
    name: "Healthcare Lead Nurture",
    type: "Lead Nurture",
    totalLeads: 850,
    contacted: 420,
    openRate: 38.7,
    clickRate: 18.5,
    createdDate: "2025-01-10"
  },
  {
    id: 3,
    name: "Event Follow-up",
    type: "Event Outreach",
    totalLeads: 650,
    contacted: 380,
    openRate: 52.1,
    clickRate: 28.3,
    createdDate: "2025-01-08"
  }
];

const draftCampaigns = [
  {
    id: 4,
    name: "Enterprise ABM Campaign",
    type: "ABM Outreach",
    totalLeads: 150,
    lastEdited: "2025-01-18",
    completion: 75
  },
  {
    id: 5,
    name: "Product Launch Sequence",
    type: "Product Marketing",
    totalLeads: 2500,
    lastEdited: "2025-01-17",
    completion: 45
  },
  {
    id: 6,
    name: "Re-engagement Campaign",
    type: "Lead Nurture",
    totalLeads: 890,
    lastEdited: "2025-01-16",
    completion: 60
  }
];

const completedCampaigns = [
  {
    id: 7,
    name: "Q4 Enterprise Push",
    type: "Sales Outreach",
    totalLeads: 1800,
    contacted: 1800,
    openRate: 52.3,
    clickRate: 28.9,
    responseRate: 12.4,
    completedDate: "2025-01-05"
  },
  {
    id: 8,
    name: "Holiday Promotion",
    type: "Marketing",
    totalLeads: 3200,
    contacted: 3200,
    openRate: 41.2,
    clickRate: 19.8,
    responseRate: 8.7,
    completedDate: "2024-12-20"
  },
  {
    id: 9,
    name: "Partner Webinar Follow-up",
    type: "Event Outreach",
    totalLeads: 540,
    contacted: 540,
    openRate: 58.1,
    clickRate: 31.2,
    responseRate: 15.3,
    completedDate: "2024-12-15"
  }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header with Gradient Band */}
      <section className="relative bg-gradient-hero px-6 py-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">
              Campaign Dashboard
            </h1>
            <p className="text-sm text-white/80">
              Manage and track all your outreach campaigns in one place
            </p>
          </div>
          <Button 
            size="lg"
            onClick={() => navigate("/campaigns/create")}
            className="gap-2 bg-white text-primary hover:bg-white/90"
          >
            <Plus className="h-5 w-5" />
            Create Campaign
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Campaign Performance */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Campaign Performance</h2>
            </div>
            <div className="flex items-center gap-3">
              <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as "last7days" | "mtd" | "last4weeks" | "custom")}>
                <TabsList className="h-10">
                  <TabsTrigger value="last7days" className="text-xs px-4">Last 7 days</TabsTrigger>
                  <TabsTrigger value="mtd" className="text-xs px-4">Month to date</TabsTrigger>
                  <TabsTrigger value="last4weeks" className="text-xs px-4">Last 4 weeks</TabsTrigger>
                  <TabsTrigger value="custom" className="text-xs px-4">Custom</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {timePeriod === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
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
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => (
              <Card key={metric.title} className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <metric.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                      {metric.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">{metric.title}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Campaign Tabs */}
        <section className="animate-fade-in">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="h-12">
                <TabsTrigger value="active" className="gap-2 px-6">
                  <Target className="h-4 w-4" />
                  Active Campaigns
                  <Badge variant="secondary" className="ml-2">{activeCampaigns.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="draft" className="gap-2 px-6">
                  <FileEdit className="h-4 w-4" />
                  Drafts
                  <Badge variant="secondary" className="ml-2">{draftCampaigns.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-2 px-6">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                  <Badge variant="secondary" className="ml-2">{completedCampaigns.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Active Campaigns */}
            <TabsContent value="active" className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <Card 
                  key={campaign.id} 
                  className="border-2 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/campaigns/${campaign.id}/analytics`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            <Badge variant="outline">{campaign.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            Started {new Date(campaign.createdDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 flex-shrink-0">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{campaign.totalLeads}</p>
                          <p className="text-xs text-muted-foreground">Total Leads</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{campaign.contacted}</p>
                          <p className="text-xs text-muted-foreground">Contacted</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{campaign.openRate}%</p>
                          <p className="text-xs text-muted-foreground">Open Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{campaign.clickRate}%</p>
                          <p className="text-xs text-muted-foreground">Click Rate</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Draft Campaigns */}
            <TabsContent value="draft" className="space-y-4">
              {draftCampaigns.map((campaign) => (
                <Card 
                  key={campaign.id} 
                  className="border-2 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                          <FileEdit className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                              Draft
                            </Badge>
                            <Badge variant="outline">{campaign.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            Last edited {new Date(campaign.lastEdited).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 flex-shrink-0">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{campaign.totalLeads}</p>
                          <p className="text-xs text-muted-foreground">Target Leads</p>
                        </div>
                        <div className="text-center min-w-[100px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500" 
                                style={{ width: `${campaign.completion}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">{campaign.completion}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Complete</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          Continue Editing
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Completed Campaigns */}
            <TabsContent value="completed" className="space-y-4">
              {completedCampaigns.map((campaign) => (
                <Card 
                  key={campaign.id} 
                  className="border-2 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/campaigns/${campaign.id}/analytics`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                              Completed
                            </Badge>
                            <Badge variant="outline">{campaign.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            Completed {new Date(campaign.completedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{campaign.totalLeads}</p>
                          <p className="text-xs text-muted-foreground">Total Leads</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{campaign.openRate}%</p>
                          <p className="text-xs text-muted-foreground">Open Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{campaign.clickRate}%</p>
                          <p className="text-xs text-muted-foreground">Click Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{campaign.responseRate}%</p>
                          <p className="text-xs text-muted-foreground">Response Rate</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
