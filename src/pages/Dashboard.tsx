import { TrendingUp, Bot, Target, Users, Building2, Upload, Mail, Workflow, Lightbulb, Zap, FileSpreadsheet, ArrowRight, BarChart3, Layers, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import CampaignMetrics from "@/components/dashboard/CampaignMetrics";

const dashboardTiles = [{
  category: "Prospecting & Lead Enrichment",
  description: "Discover and enrich the right leads for your pipeline",
  icon: Target,
  accent: "bg-primary/10 text-primary",
  actions: [{
    title: "Lead Search / Insights",
    route: "/search",
    icon: Building2
  }, {
    title: "Lists / Saved Searches",
    route: "/lists",
    icon: FileSpreadsheet
  }, {
    title: "Enrich Leads",
    route: "/upload",
    icon: Upload
  }]
}, {
  category: "Personalization Agent",
  description: "Generate personalized outreach and campaigns at scale",
  icon: Bot,
  accent: "bg-violet-500/10 text-violet-400",
  actions: [{
    title: "Campaign / Sequence Builder",
    route: "/campaigns/create",
    icon: Workflow
  }, {
    title: "Campaign Analytics",
    route: "/campaigns",
    icon: BarChart3
  }, {
    title: "Content HQ",
    route: "/personalization",
    icon: Layers
  }]
}, {
  category: "Sales Intelligence",
  description: "Account research, intent signals, and opportunity playbooks",
  icon: Lightbulb,
  accent: "bg-emerald-500/10 text-emerald-400",
  actions: [{
    title: "Opportunity Playbook",
    route: "/opportunities",
    icon: Zap
  }, {
    title: "Account Intelligence",
    route: "/search",
    icon: TrendingUp
  }, {
    title: "Buying Signals",
    route: "/signals",
    icon: Radio
  }]
}];

const recentSearches = [{
  query: "RevOps in fintech",
  results: 1284,
  type: "Mixed"
}, {
  query: "Healthcare SaaS CMOs",
  results: 432,
  type: "Contacts"
}, {
  query: "Snowflake users US",
  results: 2156,
  type: "Accounts"
}];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full grid-bg-dark">
      {/* Campaigns Section */}
      <section className="px-6 pt-8 pb-6 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => navigate("/campaigns")}
              className="hover:opacity-75 transition-opacity"
            >
              <h2 className="text-lg font-semibold tracking-tight">Campaigns</h2>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/campaigns")}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <CampaignMetrics />
        </div>
      </section>

      {/* Main Dashboard Tiles */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {dashboardTiles.map(tile => (
            <Card
              key={tile.category}
              className="group border-border/60 hover:border-primary/30 transition-all duration-300 hover:shadow-primary bg-card/60"
            >
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 rounded-xl ${tile.accent} flex items-center justify-center mb-3`}>
                  <tile.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-semibold">{tile.category}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">{tile.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {tile.actions.map(action => (
                    <Button
                      key={action.title}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between hover:bg-accent text-xs font-medium h-8 px-3"
                      onClick={() => navigate(action.route)}
                    >
                      <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                        <action.icon className="h-3.5 w-3.5" />
                        {action.title}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Searches */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold tracking-tight mb-1">Recent Searches</h2>
              <p className="text-xs text-muted-foreground">Pick up where you left off</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/search")}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8"
            >
              New Search
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentSearches.map((search, idx) => (
              <Card
                key={idx}
                className="group cursor-pointer border-border/60 hover:border-primary/30 hover:shadow-primary transition-all duration-300 bg-card/60"
                onClick={() => navigate(`/insights?q=${encodeURIComponent(search.query)}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold border-border/60">
                      {search.type}
                    </Badge>
                    <div className="text-xl font-bold text-primary tabular-nums">
                      {search.results.toLocaleString()}
                    </div>
                  </div>
                  <CardTitle className="text-sm font-semibold">{search.query}</CardTitle>
                  <CardDescription className="text-xs">results found</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full justify-between group-hover:bg-accent text-xs h-8">
                    <span className="text-muted-foreground">View Results</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
