import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const examples = [
  "Find CMOs at B2B SaaS companies in California using HubSpot",
  "Series B startups in fintech, 50-200 employees, using Snowflake",
  "VP Sales at companies in Canada using Salesforce",
  "Directors of Marketing at e-commerce companies with 100+ employees",
];

const recentSearches = [
  { query: "VP Engineering at Series A startups in healthcare", time: "2 hours ago", results: 342 },
  { query: "CMOs at B2B SaaS companies in California using HubSpot", time: "Yesterday", results: 1247 },
  { query: "Series B fintech startups, 50-200 employees", time: "3 days ago", results: 89 },
  { query: "VP Sales at companies in Canada using Salesforce", time: "Last week", results: 567 },
];

const savedSearches = [
  { query: "Enterprise SaaS Decision Makers", date: "Saved Jan 15", results: 2341 },
  { query: "Healthcare Tech Founders", date: "Saved Dec 28", results: 456 },
];

export default function Search() {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

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
      const contactKeywords = ['cmo', 'ceo', 'cto', 'cfo', 'vp', 'director', 'manager', 'head of', 'leader', 'executive', 'founder', 'president', 'chief', 'contact', 'people', 'persona', 'buyer', 'decision maker'];
      const techKeywords = ['using', 'technology', 'tech', 'stack', 'platform', 'software', 'tool', 'crm', 'erp', 'salesforce', 'hubspot', 'snowflake', 'aws', 'azure', 'google cloud', 'slack', 'zoom', 'microsoft', 'oracle', 'sap', 'workday', 'tableau', 'power bi', 'looker', 'databricks'];
      const firmographicKeywords = ['company', 'companies', 'business', 'organization', 'firm', 'industry', 'revenue', 'employee', 'size', 'location', 'region'];

      const hasContact = contactKeywords.some(keyword => lowerQuery.includes(keyword));
      const hasTech = techKeywords.some(keyword => lowerQuery.includes(keyword));
      const hasFirmographic = firmographicKeywords.some(keyword => lowerQuery.includes(keyword));

      setTimeout(() => {
        if (hasContact) {
          // Contact-based searches go to results page with contacts
          navigate(`/results/contacts?q=${encodeURIComponent(queryText)}`);
        } else if (hasTech || hasFirmographic) {
          // Tech or firmographic searches go to account results
          navigate(`/results/accounts?q=${encodeURIComponent(queryText)}&type=firmographic`);
        } else {
          navigate(`/results/accounts?q=${encodeURIComponent(queryText)}&type=firmographic`);
        }
      }, 1500);
    }
  };

  const fillSearchInput = (text: string) => {
    setPrompt(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePromptSubmit();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
            <Icon icon="solar:bolt-linear" className="text-primary h-4 w-4" />
            <span className="text-xs font-medium text-primary">AI-Powered ICP Discovery</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-3 tracking-tight">
          Find Your Ideal Customers
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground text-center text-sm md:text-base mb-8 max-w-lg mx-auto">
          Describe what you're looking for in natural language. Our AI will handle the rest.
        </p>

        {/* Search Input */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden relative">
          <div className="p-4 flex items-center gap-3">
            <Icon icon="solar:magnifer-linear" className="text-muted-foreground shrink-0 h-5 w-5" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you're looking for..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
              disabled={isAnalyzing}
            />
            <button
              onClick={() => handlePromptSubmit()}
              disabled={!prompt.trim() || isAnalyzing}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              <span>{isAnalyzing ? "Searching..." : "Search"}</span>
              <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <Tabs defaultValue="examples" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
              <TabsTrigger
                value="examples"
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon icon="solar:lightbulb-linear" className="h-4 w-4" />
                Examples
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon icon="solar:clock-circle-linear" className="h-4 w-4" />
                Recent Searches
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon icon="solar:bookmark-linear" className="h-4 w-4" />
                Saved
              </TabsTrigger>
            </TabsList>

            {/* Examples Tab */}
            <TabsContent value="examples" className="p-5 mt-0">
              <div className="space-y-2">
                {examples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => fillSearchInput(example)}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-accent border border-transparent hover:border-border transition-all group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon icon="solar:magnifer-linear" className="text-primary h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                        {example}
                      </p>
                    </div>
                    <Icon icon="solar:arrow-right-linear" className="text-border group-hover:text-primary transition-colors h-4 w-4" />
                  </button>
                ))}
              </div>
            </TabsContent>

            {/* Recent Searches Tab */}
            <TabsContent value="recent" className="p-5 mt-0">
              <div className="space-y-2">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => fillSearchInput(search.query)}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-accent border border-transparent hover:border-border transition-all group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon icon="solar:clock-circle-linear" className="text-muted-foreground h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground truncate">
                        {search.query}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {search.time} &bull; {search.results.toLocaleString()} results
                      </p>
                    </div>
                    <Icon icon="solar:arrow-right-linear" className="text-border group-hover:text-primary transition-colors h-4 w-4" />
                  </button>
                ))}
              </div>
            </TabsContent>

            {/* Saved Tab */}
            <TabsContent value="saved" className="p-5 mt-0">
              <div className="space-y-2">
                {savedSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => fillSearchInput(search.query)}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-accent border border-transparent hover:border-border transition-all group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Icon icon="solar:bookmark-bold" className="text-amber-500 h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground truncate">
                        {search.query}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {search.date} &bull; {search.results.toLocaleString()} results
                      </p>
                    </div>
                    <Icon icon="solar:arrow-right-linear" className="text-border group-hover:text-primary transition-colors h-4 w-4" />
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="px-5 py-3 bg-muted/50 border-t border-border flex items-center justify-between">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Icon icon="solar:question-circle-linear" className="h-4 w-4" />
              <span>How it works</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Icon icon="solar:tuning-2-linear" className="h-4 w-4" />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
