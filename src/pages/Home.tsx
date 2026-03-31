import { useState, useEffect } from "react";
import { 
  Sparkles, TrendingUp, Zap, Info, ArrowRight, Upload, Users, Building2, 
  Cpu, FileSpreadsheet, Mail, Target, Bot, Workflow, Lightbulb, Link2, ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import CampaignMetrics from "@/components/dashboard/CampaignMetrics";

const quickStarters = [
  "Companies in California with Revenue < $50 Million",
  "Companies that use Salesforce",
  "CMOs in Healthcare SaaS Companies",
  "Linkedin URL - http://www.linkedin.com/in/kylehollingsworth/",
];

const capabilities = [
  {
    category: "Prospecting & Lead Sourcing",
    description: "Discover the right accounts and contacts",
    icon: Target,
    color: "from-purple-500 to-purple-600",
    actions: [
      { title: "Account Search & Research", route: "/account-search", icon: Building2 },
      { title: "Contact Search", route: "/results/contacts", icon: Users },
      { title: "Upload Company List", route: "/upload", icon: Upload },
    ]
  },
  {
    category: "Lead & Data Enrichment",
    description: "Enrich with verified emails, phones, and company data",
    icon: FileSpreadsheet,
    color: "from-indigo-500 to-indigo-600",
    actions: [
      { title: "Enrich Contacts", route: "/enrich", icon: Users },
      { title: "Verify Emails", route: "/verify", icon: Mail },
    ]
  },
  {
    category: "AI Personalization & Messaging",
    description: "Generate personalized outreach at scale",
    icon: Bot,
    color: "from-violet-500 to-violet-600",
    actions: [
      { title: "Message Generator", route: "/messaging", icon: Sparkles },
      { title: "Sequence Builder", route: "/campaigns/create", icon: Workflow },
    ]
  },
  {
    category: "Campaign Execution",
    description: "Cold email infrastructure and deliverability",
    icon: Mail,
    color: "from-fuchsia-500 to-fuchsia-600",
    actions: [
      { title: "Campaigns", route: "/campaigns", icon: Mail },
      { title: "Domain Setup", route: "/domains", icon: Link2 },
    ]
  },
  {
    category: "Opportunity Intelligence",
    description: "Account research, intent signals, and triggers",
    icon: Lightbulb,
    color: "from-pink-500 to-pink-600",
    actions: [
      { title: "Account Intelligence", route: "/insights", icon: TrendingUp },
      { title: "Opportunity Triggers", route: "/triggers", icon: Zap },
    ]
  },
  {
    category: "Integrations",
    description: "CRM, email platforms, and omni-channel messaging",
    icon: Link2,
    color: "from-rose-500 to-rose-600",
    actions: [
      { title: "CRM Sync", route: "/integrations/crm", icon: Link2 },
      { title: "Email Platforms", route: "/integrations/email", icon: Mail },
    ]
  },
];

const recentSearches = [
  { query: "RevOps in fintech", results: 1284, type: "Mixed" },
  { query: "Healthcare SaaS CMOs", results: 432, type: "Contacts" },
  { query: "Snowflake users US", results: 2156, type: "Accounts" },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = 100; // Hide when within 100px of bottom
      
      setShowScrollIndicator(scrollPosition < documentHeight - threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePromptSubmit = async (customPrompt?: string) => {
    const queryText = customPrompt || prompt;
    if (queryText.trim()) {
      setIsAnalyzing(true);
      
      const lowerQuery = queryText.toLowerCase();
      
      // Check if query contains a LinkedIn URL
      const linkedinUrlPattern = /linkedin\.com\/in\/[\w-]+/i;
      if (linkedinUrlPattern.test(queryText)) {
        setTimeout(() => {
          const linkedinMatch = queryText.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?/i);
          const linkedinUrl = linkedinMatch ? linkedinMatch[0] : "";
          navigate(`/contact/profile?linkedin=${encodeURIComponent(linkedinUrl)}`);
        }, 1500);
        return;
      }
      
      // Detect if query contains contact/people terms
      const contactKeywords = [
        'cmo', 'ceo', 'cto', 'cfo', 'vp', 'director', 'manager', 'head of',
        'leader', 'executive', 'founder', 'president', 'chief',
        'contact', 'people', 'persona', 'buyer', 'decision maker'
      ];
      
      // Detect if query contains technographic terms
      const techKeywords = [
        'using', 'technology', 'tech', 'stack', 
        'platform', 'software', 'tool', 'crm', 'erp',
        'salesforce', 'hubspot', 'snowflake', 'aws', 'azure', 'google cloud',
        'slack', 'zoom', 'microsoft', 'oracle', 'sap', 'workday',
        'tableau', 'power bi', 'looker', 'databricks'
      ];
      
      // Detect firmographic terms
      const firmographicKeywords = [
        'company', 'companies', 'business', 'organization', 'firm',
        'industry', 'revenue', 'employee', 'size', 'location', 'region'
      ];
      
      const hasContact = contactKeywords.some(keyword => lowerQuery.includes(keyword));
      const hasTech = techKeywords.some(keyword => lowerQuery.includes(keyword));
      const hasFirmographic = firmographicKeywords.some(keyword => lowerQuery.includes(keyword));
      
      // Simulate AI parsing
      setTimeout(() => {
        // Flow 4: Full ICP (has both account AND contact criteria)
        if (hasContact && (hasFirmographic || hasTech)) {
          navigate(`/icp-funnel?q=${encodeURIComponent(queryText)}`);
        }
        // Flow 3: Contact + Account search (contact focused, but no clear account criteria)
        else if (hasContact) {
          navigate(`/account-search?q=${encodeURIComponent(queryText)}`);
        }
        // Flow 2: Account search with Technographics
        else if (hasTech) {
          navigate(`/account-search?q=${encodeURIComponent(queryText)}`);
        }
        // Flow 1: Firmographics only - go directly to results
        else {
          navigate(`/results/accounts?q=${encodeURIComponent(queryText)}&type=firmographic`);
        }
      }, 1500);
    }
  };

  const useQuickStarter = (text: string) => {
    setPrompt(text);
    handlePromptSubmit(text);
  };

  return (
    <div className="min-h-full">
      {/* Campaign Dashboard */}
      <section className="px-6 pt-8 pb-6 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <CampaignMetrics />
        </div>
      </section>

      {/* Hero Section - AI-First Prompt */}
      <section className="relative bg-gradient-hero px-6 py-12 md:py-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-4">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered ICP Discovery</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
              Your Complete GTM Platform
            </h1>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              From prospecting to personalization to campaign execution, all powered by AI.
            </p>
          </div>

          {/* Main Prompt Box */}
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && e.metaKey && handlePromptSubmit()}
                  placeholder="Describe what you're looking for... 

Examples:
• 'Find CMOs at B2B SaaS companies in California using HubSpot'
• 'Series B startups in fintech, 50-200 employees, using Snowflake'
• 'RevOps leaders at mid-market healthcare companies with recent funding'"
                  className="w-full px-6 py-6 text-lg border-0 focus:outline-none resize-none min-h-[180px] bg-background"
                  disabled={isAnalyzing}
                />
                
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-3 text-primary">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      <span className="text-lg font-medium">Analyzing your request...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-muted/50 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Info className="h-4 w-4" />
                        <span className="hidden sm:inline">How it works</span>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-semibold">AI Parsing</h4>
                        <p className="text-sm text-muted-foreground">
                          Our AI extracts filters from your description:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Company attributes (industry, size, location)</li>
                          <li>Technology stack</li>
                          <li>People criteria (titles, seniority)</li>
                        </ul>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                
                <Button 
                  onClick={() => handlePromptSubmit()}
                  disabled={!prompt.trim() || isAnalyzing}
                  size="lg"
                  className="gap-2 shadow-lg"
                >
                  <Sparkles className="h-4 w-4" />
                  Start Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Starters */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm mb-3">Quick starters:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickStarters.map((starter, idx) => (
                <Button
                  key={idx}
                  variant="secondary"
                  size="sm"
                  onClick={() => useQuickStarter(starter)}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                >
                  {starter}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Indicator - Below Hero */}
      {showScrollIndicator && (
        <div className="flex justify-center -mt-8 mb-8 relative z-10">
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 group"
            aria-label="Scroll down for more content"
          >
            <span className="text-sm font-medium">More below</span>
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 flex items-center justify-center group-hover:border-primary transition-colors">
              <ChevronDown className="h-5 w-5 text-primary animate-bounce" />
            </div>
          </button>
        </div>
      )}

      {/* Capabilities Grid */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-3">Everything You Need to Scale GTM</h2>
          <p className="text-muted-foreground text-lg">Six core capabilities. One unified platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {capabilities.map((capability) => (
            <Card
              key={capability.category}
              className="group hover:shadow-primary transition-all duration-300"
            >
              <CardHeader>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${capability.color} flex items-center justify-center mb-4`}
                >
                  <capability.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{capability.category}</CardTitle>
                <CardDescription className="text-base">{capability.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {capability.actions.map((action) => (
                    <Button
                      key={action.title}
                      variant="ghost"
                      className="w-full justify-between hover:bg-muted"
                      onClick={() => navigate(action.route)}
                    >
                      <span className="flex items-center gap-2">
                        <action.icon className="h-4 w-4" />
                        {action.title}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Recent Searches</h2>
              <p className="text-muted-foreground">Pick up where you left off</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentSearches.map((search, idx) => (
              <Card
                key={idx}
                className="group cursor-pointer hover:shadow-primary transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigate(`/insights?q=${encodeURIComponent(search.query)}`)}
              >
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
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="px-6 py-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Modern GTM Stack</h2>
            <p className="text-muted-foreground text-lg">
              Replace 10+ tools with one AI-powered platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle>AI-First Prospecting</CardTitle>
                <CardDescription>
                  Natural language search across firmographics, technographics, and buyer intent. No complex filters.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Intelligent Personalization</CardTitle>
                <CardDescription>
                  AI-generated messaging tailored to account context, pain points, and opportunity triggers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-4">
                  <Workflow className="h-6 w-6 text-white" />
                </div>
                <CardTitle>End-to-End Execution</CardTitle>
                <CardDescription>
                  From prospecting to enrichment to multi-channel campaigns. All in one workflow.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
