import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock data based on the screenshot reference
const mockOpportunities = [
  {
    id: "1",
    contactName: "Edgar Carrasco",
    contactTitle: "Revenue Growth Strategist",
    company: "Regpack",
    email: "edgar@regpacks.com",
    status: "Active",
    lastUpdated: "Sep 15 2025 • 7:38 am",
    summary: "Focused on expanding Regpack's market reach with 7-figure SaaS deals",
    stage: "Discovery"
  },
  {
    id: "2",
    contactName: "Sarah Chen",
    contactTitle: "VP of Sales",
    company: "TechFlow Solutions",
    email: "sarah.chen@techflow.com",
    status: "Active",
    lastUpdated: "Sep 14 2025 • 3:22 pm",
    summary: "Scaling sales operations for mid-market enterprise software",
    stage: "Proposal"
  },
  {
    id: "3",
    contactName: "Michael Rodriguez",
    contactTitle: "Director of Business Development",
    company: "DataSync Inc",
    email: "m.rodriguez@datasync.io",
    status: "On Hold",
    lastUpdated: "Sep 10 2025 • 11:15 am",
    summary: "Evaluating GTM tools for new product launch in Q1",
    stage: "Evaluation"
  },
  {
    id: "4",
    contactName: "Lisa Thompson",
    contactTitle: "Head of RevOps",
    company: "CloudScale",
    email: "lisa.t@cloudscale.com",
    status: "Active",
    lastUpdated: "Sep 8 2025 • 9:45 am",
    summary: "Building RevOps infrastructure for hypergrowth startup",
    stage: "Negotiation"
  }
];

const statusColors = {
  Active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  "On Hold": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  Closed: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
};

const stageColors = {
  Discovery: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Evaluation: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  Proposal: "bg-primary/10 text-primary border-primary/20",
  Negotiation: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
};

export default function Opportunities() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch = 
      opp.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.contactTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "active" && opp.status === "Active") ||
      (activeTab === "on-hold" && opp.status === "On Hold");
    
    return matchesSearch && matchesTab;
  });

  const activeCount = mockOpportunities.filter(o => o.status === "Active").length;
  const onHoldCount = mockOpportunities.filter(o => o.status === "On Hold").length;

  return (
    <div className="min-h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Icon icon="solar:bolt-bold" className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Opportunity Playbook</h1>
                <p className="text-sm text-muted-foreground">
                  Track and manage your active deal opportunities
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => navigate("/search")}>
              <Icon icon="solar:bolt-linear" className="h-4 w-4 mr-2" />
              Create New Playbook
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon icon="solar:folder-with-files-linear" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockOpportunities.length}</p>
                  <p className="text-xs text-muted-foreground">Total Playbooks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:play-circle-linear" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Icon icon="solar:pause-circle-linear" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{onHoldCount}</p>
                  <p className="text-xs text-muted-foreground">On Hold</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Icon icon="solar:chart-2-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">75%</p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, company, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="default">
                <Icon icon="solar:filter-linear" className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <Icon icon="solar:list-linear" className="h-4 w-4" />
              All ({mockOpportunities.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2">
              <Icon icon="solar:play-circle-linear" className="h-4 w-4" />
              Active ({activeCount})
            </TabsTrigger>
            <TabsTrigger value="on-hold" className="gap-2">
              <Icon icon="solar:pause-circle-linear" className="h-4 w-4" />
              On Hold ({onHoldCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Opportunity Cards */}
        <div className="space-y-3">
          {filteredOpportunities.map((opp) => (
            <Card
              key={opp.id}
              className="group hover:border-border/80 transition-all cursor-pointer"
              onClick={() => navigate(`/opportunities/${opp.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {opp.contactName.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm">{opp.contactName}</h3>
                          <Badge
                            variant="secondary"
                            className={cn("text-[10px] uppercase font-bold tracking-wide border", statusColors[opp.status as keyof typeof statusColors])}
                          >
                            {opp.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] uppercase font-medium", stageColors[opp.stage as keyof typeof stageColors])}
                          >
                            {opp.stage}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{opp.contactTitle}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                          View Playbook
                          <Icon icon="solar:arrow-right-up-linear" className="h-3.5 w-3.5 ml-1.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon icon="solar:buildings-2-linear" className="h-3.5 w-3.5" />
                        {opp.company}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon icon="solar:clock-circle-linear" className="h-3.5 w-3.5" />
                        {opp.lastUpdated}
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{opp.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Icon icon="solar:bolt-linear" className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                {searchQuery ? "Try adjusting your search query" : "Start by creating your first opportunity playbook"}
              </p>
              <Button onClick={() => navigate("/search")}>
                <Icon icon="solar:bolt-linear" className="h-4 w-4 mr-2" />
                Create Opportunity Playbook
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
