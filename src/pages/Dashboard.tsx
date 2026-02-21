import { useState, CSSProperties } from "react";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Campaign options for dropdown
const campaignOptions = [
  { id: "all", name: "All Campaigns" },
  { id: "q1-saas", name: "Q1 SaaS Outreach" },
  { id: "healthcare", name: "Healthcare Lead Nurture" },
  { id: "event", name: "Event Follow-up" },
  { id: "product", name: "Product Launch" },
];

// Campaign-specific performance data
const campaignPerformanceData: Record<string, { date: string; sent: number; opened: number; clicked: number; replied: number }[]> = {
  all: [
    { date: "Jan 1", sent: 120, opened: 78, clicked: 32, replied: 12 },
    { date: "Jan 8", sent: 180, opened: 112, clicked: 48, replied: 18 },
    { date: "Jan 15", sent: 240, opened: 156, clicked: 72, replied: 28 },
    { date: "Jan 22", sent: 200, opened: 134, clicked: 58, replied: 22 },
    { date: "Jan 29", sent: 280, opened: 182, clicked: 86, replied: 34 },
    { date: "Feb 5", sent: 320, opened: 218, clicked: 98, replied: 42 },
    { date: "Feb 12", sent: 360, opened: 252, clicked: 118, replied: 48 },
  ],
  "q1-saas": [
    { date: "Jan 1", sent: 45, opened: 32, clicked: 14, replied: 6 },
    { date: "Jan 8", sent: 68, opened: 48, clicked: 22, replied: 9 },
    { date: "Jan 15", sent: 92, opened: 71, clicked: 35, replied: 14 },
    { date: "Jan 22", sent: 78, opened: 58, clicked: 28, replied: 11 },
    { date: "Jan 29", sent: 105, opened: 82, clicked: 42, replied: 18 },
    { date: "Feb 5", sent: 125, opened: 98, clicked: 52, replied: 22 },
    { date: "Feb 12", sent: 142, opened: 115, clicked: 62, replied: 26 },
  ],
  "healthcare": [
    { date: "Jan 1", sent: 35, opened: 22, clicked: 8, replied: 3 },
    { date: "Jan 8", sent: 52, opened: 34, clicked: 12, replied: 5 },
    { date: "Jan 15", sent: 68, opened: 45, clicked: 18, replied: 7 },
    { date: "Jan 22", sent: 58, opened: 38, clicked: 15, replied: 6 },
    { date: "Jan 29", sent: 82, opened: 56, clicked: 24, replied: 10 },
    { date: "Feb 5", sent: 95, opened: 68, clicked: 28, replied: 12 },
    { date: "Feb 12", sent: 108, opened: 78, clicked: 34, replied: 14 },
  ],
  "event": [
    { date: "Jan 1", sent: 25, opened: 18, clicked: 8, replied: 2 },
    { date: "Jan 8", sent: 38, opened: 28, clicked: 12, replied: 3 },
    { date: "Jan 15", sent: 52, opened: 42, clicked: 18, replied: 5 },
    { date: "Jan 22", sent: 45, opened: 35, clicked: 14, replied: 4 },
    { date: "Jan 29", sent: 62, opened: 48, clicked: 22, replied: 6 },
    { date: "Feb 5", sent: 72, opened: 58, clicked: 26, replied: 8 },
    { date: "Feb 12", sent: 78, opened: 62, clicked: 28, replied: 8 },
  ],
  "product": [
    { date: "Jan 1", sent: 15, opened: 6, clicked: 2, replied: 1 },
    { date: "Jan 8", sent: 22, opened: 12, clicked: 4, replied: 1 },
    { date: "Jan 15", sent: 28, opened: 18, clicked: 6, replied: 2 },
    { date: "Jan 22", sent: 19, opened: 13, clicked: 4, replied: 1 },
    { date: "Jan 29", sent: 31, opened: 22, clicked: 8, replied: 2 },
    { date: "Feb 5", sent: 28, opened: 18, clicked: 6, replied: 2 },
    { date: "Feb 12", sent: 32, opened: 22, clicked: 8, replied: 2 },
  ],
};

// Campaign-specific stats
const campaignStats: Record<string, { totalSent: string; openRate: string; clickRate: string; meetings: string; sentChange: string; openChange: string; clickChange: string; meetingChange: string }> = {
  all: { totalSent: "12,847", openRate: "48.6%", clickRate: "22.4%", meetings: "156", sentChange: "+12.5%", openChange: "+3.2%", clickChange: "+1.8%", meetingChange: "+8" },
  "q1-saas": { totalSent: "4,255", openRate: "52.3%", clickRate: "28.6%", meetings: "68", sentChange: "+18.2%", openChange: "+5.1%", clickChange: "+3.4%", meetingChange: "+12" },
  "healthcare": { totalSent: "3,498", openRate: "45.8%", clickRate: "19.2%", meetings: "42", sentChange: "+8.4%", openChange: "+2.1%", clickChange: "+0.8%", meetingChange: "+5" },
  "event": { totalSent: "2,872", openRate: "56.2%", clickRate: "24.8%", meetings: "32", sentChange: "+15.6%", openChange: "+4.8%", clickChange: "+2.2%", meetingChange: "+6" },
  "product": { totalSent: "2,222", openRate: "38.4%", clickRate: "15.6%", meetings: "14", sentChange: "+5.2%", openChange: "-1.2%", clickChange: "-0.4%", meetingChange: "+2" },
};

const aiInsights = [
  {
    company: "Acme Group",
    signal: "Hired a new CRO",
    type: "hiring",
    time: "2 hours ago",
  },
  {
    company: "Gucci",
    signal: "Looking to expand marketing to AEO/GEO",
    type: "expansion",
    time: "5 hours ago",
  },
  {
    company: "Stripe",
    signal: "Announced Series D funding round",
    type: "funding",
    time: "Yesterday",
  },
  {
    company: "Notion",
    signal: "Opened new office in London",
    type: "expansion",
    time: "2 days ago",
  },
];

// Campaign-specific weekly activity data
const campaignWeeklyActivityData: Record<string, { day: string; emails: number; meetings: number }[]> = {
  all: [
    { day: "Mon", emails: 145, meetings: 8 },
    { day: "Tue", emails: 189, meetings: 12 },
    { day: "Wed", emails: 167, meetings: 10 },
    { day: "Thu", emails: 198, meetings: 14 },
    { day: "Fri", emails: 156, meetings: 9 },
    { day: "Sat", emails: 42, meetings: 2 },
    { day: "Sun", emails: 28, meetings: 1 },
  ],
  "q1-saas": [
    { day: "Mon", emails: 62, meetings: 4 },
    { day: "Tue", emails: 78, meetings: 6 },
    { day: "Wed", emails: 71, meetings: 5 },
    { day: "Thu", emails: 85, meetings: 7 },
    { day: "Fri", emails: 68, meetings: 5 },
    { day: "Sat", emails: 18, meetings: 1 },
    { day: "Sun", emails: 12, meetings: 0 },
  ],
  "healthcare": [
    { day: "Mon", emails: 38, meetings: 2 },
    { day: "Tue", emails: 52, meetings: 3 },
    { day: "Wed", emails: 45, meetings: 2 },
    { day: "Thu", emails: 58, meetings: 4 },
    { day: "Fri", emails: 42, meetings: 2 },
    { day: "Sat", emails: 12, meetings: 0 },
    { day: "Sun", emails: 8, meetings: 0 },
  ],
  "event": [
    { day: "Mon", emails: 28, meetings: 1 },
    { day: "Tue", emails: 35, meetings: 2 },
    { day: "Wed", emails: 32, meetings: 2 },
    { day: "Thu", emails: 38, meetings: 2 },
    { day: "Fri", emails: 30, meetings: 1 },
    { day: "Sat", emails: 8, meetings: 1 },
    { day: "Sun", emails: 5, meetings: 1 },
  ],
  "product": [
    { day: "Mon", emails: 17, meetings: 1 },
    { day: "Tue", emails: 24, meetings: 1 },
    { day: "Wed", emails: 19, meetings: 1 },
    { day: "Thu", emails: 17, meetings: 1 },
    { day: "Fri", emails: 16, meetings: 1 },
    { day: "Sat", emails: 4, meetings: 0 },
    { day: "Sun", emails: 3, meetings: 0 },
  ],
};

const recentSearches = [
  { query: "RevOps in fintech", results: 1284, type: "Mixed" },
  { query: "Healthcare SaaS CMOs", results: 432, type: "Contacts" },
  { query: "Snowflake users US", results: 2156, type: "Accounts" },
];

const activeCampaigns = [
  { id: "q1-saas", name: "Q1 SaaS Outreach", status: "Active", progress: 65, leads: 1200 },
  { id: "healthcare", name: "Healthcare Lead Nurture", status: "Active", progress: 42, leads: 850 },
  { id: "event", name: "Event Follow-up", status: "Paused", progress: 88, leads: 650 },
];

// Skeleton loader component with breathing effect
const SkeletonLoader = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
  <div
    className={`animate-shimmer rounded ${className}`}
    style={style}
  />
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Handle campaign change with loading effect
  const handleCampaignChange = (campaignId: string) => {
    if (campaignId === selectedCampaign) return;
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setSelectedCampaign(campaignId);
      setIsLoading(false);
    }, 800);
  };

  // Get current campaign data
  const currentStats = campaignStats[selectedCampaign] || campaignStats.all;
  const currentChartData = campaignPerformanceData[selectedCampaign] || campaignPerformanceData.all;
  const currentWeeklyActivityData = campaignWeeklyActivityData[selectedCampaign] || campaignWeeklyActivityData.all;
  const selectedCampaignName = campaignOptions.find(c => c.id === selectedCampaign)?.name || "All Campaigns";

  // Helper to determine if change is positive
  const isPositive = (change: string) => change.startsWith("+");

  return (
    <div className="min-h-full">
      {/* Stats Overview */}
      <section className="px-6 pt-8 pb-4 max-w-7xl mx-auto">
        {/* Campaign Selector Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">Performance Overview</h2>
            {selectedCampaign !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {selectedCampaignName}
              </Badge>
            )}
          </div>
          <Select value={selectedCampaign} onValueChange={handleCampaignChange} disabled={isLoading}>
            <SelectTrigger className="h-8 w-[180px] text-xs">
              <SelectValue placeholder="Select campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaignOptions.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id} className="text-xs">
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">Total Sent</p>
                  {isLoading ? (
                    <>
                      <SkeletonLoader className="h-8 w-24 mt-1" />
                      <SkeletonLoader className="h-4 w-32 mt-2" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-foreground">{currentStats.totalSent}</p>
                      <p className={`text-xs flex items-center gap-1 mt-1 ${isPositive(currentStats.sentChange) ? "text-emerald-600" : "text-red-500"}`}>
                        <Icon icon={isPositive(currentStats.sentChange) ? "solar:arrow-up-linear" : "solar:arrow-down-linear"} className="h-3 w-3" />
                        {currentStats.sentChange} from last month
                      </p>
                    </>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon icon="solar:letter-linear" className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">Avg. Open Rate</p>
                  {isLoading ? (
                    <>
                      <SkeletonLoader className="h-8 w-20 mt-1" />
                      <SkeletonLoader className="h-4 w-32 mt-2" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-foreground">{currentStats.openRate}</p>
                      <p className={`text-xs flex items-center gap-1 mt-1 ${isPositive(currentStats.openChange) ? "text-emerald-600" : "text-red-500"}`}>
                        <Icon icon={isPositive(currentStats.openChange) ? "solar:arrow-up-linear" : "solar:arrow-down-linear"} className="h-3 w-3" />
                        {currentStats.openChange} from last month
                      </p>
                    </>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Icon icon="solar:eye-linear" className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">Avg. Click Rate</p>
                  {isLoading ? (
                    <>
                      <SkeletonLoader className="h-8 w-20 mt-1" />
                      <SkeletonLoader className="h-4 w-32 mt-2" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-foreground">{currentStats.clickRate}</p>
                      <p className={`text-xs flex items-center gap-1 mt-1 ${isPositive(currentStats.clickChange) ? "text-emerald-600" : "text-red-500"}`}>
                        <Icon icon={isPositive(currentStats.clickChange) ? "solar:arrow-up-linear" : "solar:arrow-down-linear"} className="h-3 w-3" />
                        {currentStats.clickChange} from last month
                      </p>
                    </>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Icon icon="solar:cursor-linear" className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">Meetings Booked</p>
                  {isLoading ? (
                    <>
                      <SkeletonLoader className="h-8 w-16 mt-1" />
                      <SkeletonLoader className="h-4 w-28 mt-2" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-foreground">{currentStats.meetings}</p>
                      <p className={`text-xs flex items-center gap-1 mt-1 ${isPositive(currentStats.meetingChange) ? "text-emerald-600" : "text-red-500"}`}>
                        <Icon icon={isPositive(currentStats.meetingChange) ? "solar:arrow-up-linear" : "solar:arrow-down-linear"} className="h-3 w-3" />
                        {currentStats.meetingChange} from last week
                      </p>
                    </>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Icon icon="solar:calendar-linear" className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts Section */}
      <section className="px-6 py-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Email Performance Over Time */}
          <Card className="h-[320px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-base font-semibold">Email Performance</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-[10px] text-muted-foreground">Sent</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-muted-foreground">Opened</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                      <span className="text-[10px] text-muted-foreground">Clicked</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isLoading ? (
                <div className="h-[250px] flex flex-col justify-end gap-2 px-4">
                  <div className="flex items-end gap-3 h-full pt-8">
                    {[40, 60, 80, 55, 75, 90, 100].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col gap-1">
                        <SkeletonLoader className="w-full rounded-t-sm" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between px-2">
                    {["Jan 1", "Jan 8", "Jan 15", "Jan 22", "Jan 29", "Feb 5", "Feb 12"].map((d, i) => (
                      <span key={i} className="text-[10px] text-muted-foreground/50">{d}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={currentChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorClicked" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickMargin={2} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} width={35} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area type="monotone" dataKey="sent" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSent)" strokeWidth={2} />
                    <Area type="monotone" dataKey="opened" stroke="#10b981" fillOpacity={1} fill="url(#colorOpened)" strokeWidth={2} />
                    <Area type="monotone" dataKey="clicked" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorClicked)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="h-[320px] flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:bolt-bold" className="h-4 w-4 text-amber-500" />
                  <CardTitle className="text-base font-semibold">AI Insights</CardTitle>
                </div>
                <button
                  onClick={() => navigate("/signals")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  View all
                  <Icon icon="solar:arrow-right-linear" className="h-3 w-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 overflow-y-auto scrollbar-minimal flex-1">
              {aiInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/account-search?company=${encodeURIComponent(insight.company)}`)}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    insight.type === "hiring" ? "bg-emerald-500/20" :
                    insight.type === "funding" ? "bg-violet-500/20" :
                    "bg-amber-500/20"
                  }`}>
                    <Icon
                      icon={
                        insight.type === "hiring" ? "solar:user-plus-linear" :
                        insight.type === "funding" ? "solar:dollar-linear" :
                        "solar:graph-up-linear"
                      }
                      className={`h-4 w-4 ${
                        insight.type === "hiring" ? "text-emerald-600" :
                        insight.type === "funding" ? "text-violet-600" :
                        "text-amber-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-foreground">{insight.company}</p>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{insight.time}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.signal}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity */}
          <Card className="h-[260px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Weekly Activity</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] text-muted-foreground">Emails</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[10px] text-muted-foreground">Meetings</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isLoading ? (
                <div className="h-[185px] flex flex-col justify-between py-4 px-2">
                  {/* Horizontal line skeletons for wave effect */}
                  <div className="flex-1 flex flex-col justify-center gap-3">
                    <div className="flex items-center gap-2">
                      <SkeletonLoader className="h-2 flex-1 rounded-full" style={{ maxWidth: '70%' }} />
                      <div className="w-2 h-2 rounded-full animate-shimmer" />
                    </div>
                    <div className="flex items-center gap-2">
                      <SkeletonLoader className="h-2 flex-1 rounded-full" style={{ maxWidth: '90%' }} />
                      <div className="w-2 h-2 rounded-full animate-shimmer" />
                    </div>
                    <div className="flex items-center gap-2">
                      <SkeletonLoader className="h-2 flex-1 rounded-full" style={{ maxWidth: '60%' }} />
                      <div className="w-2 h-2 rounded-full animate-shimmer" />
                    </div>
                    <div className="flex items-center gap-2">
                      <SkeletonLoader className="h-2 flex-1 rounded-full" style={{ maxWidth: '85%' }} />
                      <div className="w-2 h-2 rounded-full animate-shimmer" />
                    </div>
                    <div className="flex items-center gap-2">
                      <SkeletonLoader className="h-2 flex-1 rounded-full" style={{ maxWidth: '45%' }} />
                      <div className="w-2 h-2 rounded-full animate-shimmer" />
                    </div>
                  </div>
                  <div className="flex justify-between px-1 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                      <span key={i} className="text-[10px] text-muted-foreground/50">{d}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={185}>
                  <AreaChart data={currentWeeklyActivityData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} tickMargin={2} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} width={30} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area type="monotone" dataKey="emails" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorEmails)" strokeWidth={2} />
                    <Area type="monotone" dataKey="meetings" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMeetings)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <Card className="h-[260px] flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Active Campaigns</CardTitle>
                <button
                  onClick={() => navigate("/campaigns")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  View all
                  <Icon icon="solar:arrow-right-linear" className="h-3 w-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 overflow-y-auto scrollbar-minimal flex-1">
              {activeCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/campaigns?campaign=${campaign.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{campaign.name}</p>
                      <Badge
                        variant={campaign.status === "Active" ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{campaign.leads} leads</span>
                      <span>{campaign.progress}% complete</span>
                    </div>
                  </div>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Searches */}
          <Card className="h-[260px] flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Searches</CardTitle>
                <button
                  onClick={() => navigate("/search")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  New search
                  <Icon icon="solar:add-circle-linear" className="h-3 w-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 overflow-y-auto scrollbar-minimal flex-1">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/insights?q=${encodeURIComponent(search.query)}`)}
                  className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px]">{search.type}</Badge>
                    <span className="text-sm font-bold text-primary">{search.results.toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-medium truncate">{search.query}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
