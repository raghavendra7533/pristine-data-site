import { useState } from "react";
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

// Mock data for charts
const emailPerformanceData = [
  { date: "Jan 1", sent: 120, opened: 78, clicked: 32, replied: 12 },
  { date: "Jan 8", sent: 180, opened: 112, clicked: 48, replied: 18 },
  { date: "Jan 15", sent: 240, opened: 156, clicked: 72, replied: 28 },
  { date: "Jan 22", sent: 200, opened: 134, clicked: 58, replied: 22 },
  { date: "Jan 29", sent: 280, opened: 182, clicked: 86, replied: 34 },
  { date: "Feb 5", sent: 320, opened: 218, clicked: 98, replied: 42 },
  { date: "Feb 12", sent: 360, opened: 252, clicked: 118, replied: 48 },
];

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

const weeklyActivityData = [
  { day: "Mon", emails: 145, meetings: 8 },
  { day: "Tue", emails: 189, meetings: 12 },
  { day: "Wed", emails: 167, meetings: 10 },
  { day: "Thu", emails: 198, meetings: 14 },
  { day: "Fri", emails: 156, meetings: 9 },
  { day: "Sat", emails: 42, meetings: 2 },
  { day: "Sun", emails: 28, meetings: 1 },
];

const recentSearches = [
  { query: "RevOps in fintech", results: 1284, type: "Mixed" },
  { query: "Healthcare SaaS CMOs", results: 432, type: "Contacts" },
  { query: "Snowflake users US", results: 2156, type: "Accounts" },
];

const activeCampaigns = [
  { name: "Q1 SaaS Outreach", status: "Active", progress: 65, leads: 1200 },
  { name: "Healthcare Lead Nurture", status: "Active", progress: 42, leads: 850 },
  { name: "Event Follow-up", status: "Paused", progress: 88, leads: 650 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCampaign, setSelectedCampaign] = useState("all");

  return (
    <div className="min-h-full">
      {/* Stats Overview */}
      <section className="px-6 pt-8 pb-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Sent</p>
                  <p className="text-2xl font-bold text-foreground">12,847</p>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                    <Icon icon="solar:arrow-up-linear" className="h-3 w-3" />
                    +12.5% from last month
                  </p>
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
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Avg. Open Rate</p>
                  <p className="text-2xl font-bold text-foreground">48.6%</p>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                    <Icon icon="solar:arrow-up-linear" className="h-3 w-3" />
                    +3.2% from last month
                  </p>
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
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Avg. Click Rate</p>
                  <p className="text-2xl font-bold text-foreground">22.4%</p>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                    <Icon icon="solar:arrow-up-linear" className="h-3 w-3" />
                    +1.8% from last month
                  </p>
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
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Meetings Booked</p>
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                    <Icon icon="solar:arrow-up-linear" className="h-3 w-3" />
                    +8 from last week
                  </p>
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
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger className="h-7 w-[140px] text-xs">
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
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={emailPerformanceData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                </AreaChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={185}>
                <AreaChart data={weeklyActivityData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
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
              {activeCampaigns.map((campaign, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/campaigns/${idx + 1}`)}
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
