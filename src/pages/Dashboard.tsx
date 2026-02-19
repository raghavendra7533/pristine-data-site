import { TrendingUp, Bot, Target, Users, Building2, Upload, Mail, Workflow, Lightbulb, Zap, FileSpreadsheet, ArrowRight, BarChart3, Layers, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import CampaignMetrics from "@/components/dashboard/CampaignMetrics";
const dashboardTiles = [{
  category: "Prospecting and Lead Enrichment",
  description: "Discover and enrich the right leads for your pipeline",
  icon: Target,
  color: "from-purple-500 to-purple-600",
  actions: [{
    title: "Lead Search/Insights",
    route: "/search",
    icon: Building2
  }, {
    title: "Lists/Saved Searches",
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
  color: "from-violet-500 to-violet-600",
  actions: [{
    title: "Campaign/Sequence Builder",
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
  color: "from-pink-500 to-pink-600",
  actions: [{
    title: "Opportunity Playbook & Deal Story",
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
  return <div className="min-h-full">
      {/* Campaign Dashboard */}
      <section className="px-6 pt-8 pb-6 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigate("/campaigns")}
              className="hover:opacity-80 transition-opacity"
            >
              <h2 className="text-2xl font-bold">Campaigns</h2>
            </button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/campaigns")}
              className="gap-2"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <CampaignMetrics />
        </div>
      </section>

      {/* Main Dashboard Tiles */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {dashboardTiles.map(tile => <Card key={tile.category} className="group hover:shadow-primary transition-all duration-300">
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center mb-4`}>
                  <tile.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{tile.category}</CardTitle>
                <CardDescription className="text-base">{tile.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tile.actions.map(action => <Button key={action.title} variant="ghost" className="w-full justify-between hover:bg-muted" onClick={() => navigate(action.route)}>
                      <span className="flex items-center gap-2">
                        <action.icon className="h-4 w-4" />
                        {action.title}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>)}
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Recent Searches</h2>
              <p className="text-muted-foreground">Pick up where you left off</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/search")} className="gap-2">
              New Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentSearches.map((search, idx) => <Card key={idx} className="group cursor-pointer hover:shadow-primary transition-all duration-300 hover:-translate-y-1" onClick={() => navigate(`/insights?q=${encodeURIComponent(search.query)}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {search.type}
                    </Badge>
                    <div className="text-2xl font-bold text-primary">
                      {search.results.toLocaleString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{search.query}</CardTitle>
                  <CardDescription>results found</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-muted">
                    View Results
                    <TrendingUp className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="px-6 py-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            
            
          </div>

          
        </div>
      </section>
    </div>;
}
