import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

/* ─── Filter options ─── */

const jobTitleOptions = ["C-Suite", "VP", "Director", "Manager", "Head of", "Individual Contributor"];
const industryOptions = ["SaaS / Software", "Fintech", "Healthcare", "E-commerce", "Cybersecurity", "AI / ML", "EdTech", "Manufacturing"];
const locationOptions = ["United States", "California", "New York", "Texas", "Canada", "United Kingdom", "Germany", "India", "Australia"];
const companySizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"];
const technologyOptions = ["Salesforce", "HubSpot", "Snowflake", "AWS", "Azure", "Google Cloud", "Slack", "Tableau", "Databricks"];
const fundingOptions = ["Seed", "Series A", "Series B", "Series C+", "Public", "Bootstrapped"];

export default function Search() {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchMode, setSearchMode] = useState<"people" | "companies">("people");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const navigate = useNavigate();

  // Filter state
  const [selectedJobTitles, setSelectedJobTitles] = useState<Set<string>>(new Set());
  const [selectedIndustries, setSelectedIndustries] = useState<Set<string>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [selectedCompanySizes, setSelectedCompanySizes] = useState<Set<string>>(new Set());
  const [selectedTechnologies, setSelectedTechnologies] = useState<Set<string>>(new Set());
  const [selectedFunding, setSelectedFunding] = useState<Set<string>>(new Set());
  const [revenueRange, setRevenueRange] = useState("");

  const totalFilters =
    selectedJobTitles.size +
    selectedIndustries.size +
    selectedLocations.size +
    selectedCompanySizes.size +
    selectedTechnologies.size +
    selectedFunding.size +
    (revenueRange ? 1 : 0);

  const toggleFilter = (set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setFn(next);
  };

  const clearAllFilters = () => {
    setSelectedJobTitles(new Set());
    setSelectedIndustries(new Set());
    setSelectedLocations(new Set());
    setSelectedCompanySizes(new Set());
    setSelectedTechnologies(new Set());
    setSelectedFunding(new Set());
    setRevenueRange("");
  };

  const handlePromptSubmit = async (customPrompt?: string) => {
    const queryText = customPrompt || prompt;
    if (queryText.trim() || totalFilters > 0) {
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

      const contactKeywords = ['cmo', 'ceo', 'cto', 'cfo', 'vp', 'director', 'manager', 'head of', 'leader', 'executive', 'founder', 'president', 'chief', 'contact', 'people', 'persona', 'buyer', 'decision maker'];

      const hasContact = contactKeywords.some(keyword => lowerQuery.includes(keyword));

      setTimeout(() => {
        if (searchMode === "people" || hasContact) {
          navigate(`/results/contacts?q=${encodeURIComponent(queryText)}`);
        } else {
          navigate(`/results/accounts?q=${encodeURIComponent(queryText)}&type=firmographic`);
        }
      }, 1500);
    }
  };

  const handleApplyFilters = () => {
    const route = searchMode === "people" ? "/results/contacts" : "/results/accounts";
    const params = new URLSearchParams();
    if (prompt.trim()) params.set("q", prompt);
    if (selectedJobTitles.size) params.set("titles", Array.from(selectedJobTitles).join(","));
    if (selectedIndustries.size) params.set("industries", Array.from(selectedIndustries).join(","));
    if (selectedLocations.size) params.set("locations", Array.from(selectedLocations).join(","));
    if (selectedCompanySizes.size) params.set("sizes", Array.from(selectedCompanySizes).join(","));
    if (selectedTechnologies.size) params.set("tech", Array.from(selectedTechnologies).join(","));
    if (selectedFunding.size) params.set("funding", Array.from(selectedFunding).join(","));
    if (revenueRange) params.set("revenue", revenueRange);
    navigate(`${route}?${params.toString()}`);
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

        {/* Search Mode Toggle */}
        <div className="flex items-center justify-center gap-1 mb-4">
          <div className="inline-flex items-center bg-muted/50 rounded-lg border border-border p-0.5">
            <button
              onClick={() => setSearchMode("people")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                searchMode === "people"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon icon="solar:user-rounded-linear" className="h-3.5 w-3.5" />
              People
            </button>
            <button
              onClick={() => setSearchMode("companies")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                searchMode === "companies"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon icon="solar:buildings-2-linear" className="h-3.5 w-3.5" />
              Companies
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden relative">
          <div className="p-4 flex items-center gap-3">
            <Icon icon="solar:magnifer-linear" className="text-muted-foreground shrink-0 h-5 w-5" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={searchMode === "people" ? "e.g., CMOs at B2B SaaS companies in California using HubSpot" : "e.g., Series B startups in fintech, 50-200 employees, using Snowflake"}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
              disabled={isAnalyzing}
            />
            <button
              onClick={() => handlePromptSubmit()}
              disabled={(!prompt.trim() && totalFilters === 0) || isAnalyzing}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              <span>{isAnalyzing ? "Searching..." : "Search"}</span>
              <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="mt-4 bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
            {/* Filter header */}
            <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <Icon icon="solar:tuning-2-linear" className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Filters</span>
                {totalFilters > 0 && (
                  <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                    {totalFilters} active
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {totalFilters > 0 && (
                  <button onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Clear all
                  </button>
                )}
                <button onClick={() => setFiltersOpen(false)} className="p-1 rounded hover:bg-muted transition-colors">
                  <Icon icon="solar:close-circle-linear" className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-5">
              {/* Job Title (people mode) */}
              {searchMode === "people" && (
                <FilterSection
                  title="Job Title"
                  icon="solar:case-round-linear"
                  options={jobTitleOptions}
                  selected={selectedJobTitles}
                  onToggle={(v) => toggleFilter(selectedJobTitles, setSelectedJobTitles, v)}
                />
              )}

              {/* Industry */}
              <FilterSection
                title="Industry"
                icon="solar:buildings-2-linear"
                options={industryOptions}
                selected={selectedIndustries}
                onToggle={(v) => toggleFilter(selectedIndustries, setSelectedIndustries, v)}
              />

              {/* Location */}
              <FilterSection
                title="Location"
                icon="solar:map-point-linear"
                options={locationOptions}
                selected={selectedLocations}
                onToggle={(v) => toggleFilter(selectedLocations, setSelectedLocations, v)}
              />

              {/* Company Size */}
              <FilterSection
                title="Company Size"
                icon="solar:users-group-rounded-linear"
                options={companySizeOptions}
                selected={selectedCompanySizes}
                onToggle={(v) => toggleFilter(selectedCompanySizes, setSelectedCompanySizes, v)}
              />

              {/* Technologies */}
              <FilterSection
                title="Technologies"
                icon="solar:code-square-linear"
                options={technologyOptions}
                selected={selectedTechnologies}
                onToggle={(v) => toggleFilter(selectedTechnologies, setSelectedTechnologies, v)}
              />

              {/* Funding Stage */}
              <FilterSection
                title="Funding Stage"
                icon="solar:money-bag-linear"
                options={fundingOptions}
                selected={selectedFunding}
                onToggle={(v) => toggleFilter(selectedFunding, setSelectedFunding, v)}
              />

              {/* Revenue */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon icon="solar:chart-2-linear" className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">Revenue</span>
                </div>
                <Select value={revenueRange} onValueChange={setRevenueRange}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Any revenue" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="any">Any revenue</SelectItem>
                    <SelectItem value="0-1m">$0 - $1M</SelectItem>
                    <SelectItem value="1m-10m">$1M - $10M</SelectItem>
                    <SelectItem value="10m-50m">$10M - $50M</SelectItem>
                    <SelectItem value="50m-100m">$50M - $100M</SelectItem>
                    <SelectItem value="100m+">$100M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Apply button */}
            <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {totalFilters > 0 ? `${totalFilters} filter${totalFilters > 1 ? "s" : ""} selected` : "No filters selected"}
              </span>
              <Button
                size="sm"
                onClick={handleApplyFilters}
                disabled={totalFilters === 0 && !prompt.trim()}
                className="gap-1.5"
              >
                <Icon icon="solar:magnifer-linear" className="h-3.5 w-3.5" />
                Apply & Search
              </Button>
            </div>
          </div>
        )}

        {/* Tabs Section */}
        {!filtersOpen && (
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
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon icon="solar:tuning-2-linear" className="h-4 w-4" />
                <span>Advanced Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Reusable filter section with checkboxes ─── */

function FilterSection({
  title,
  icon,
  options,
  selected,
  onToggle,
}: {
  title: string;
  icon: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? options : options.slice(0, 4);

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon icon={icon} className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">{title}</span>
        {selected.size > 0 && (
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20">
            {selected.size}
          </Badge>
        )}
      </div>
      <div className="space-y-1.5">
        {visible.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={selected.has(opt)}
              onCheckedChange={() => onToggle(opt)}
              className="h-3.5 w-3.5"
            />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{opt}</span>
          </label>
        ))}
      </div>
      {options.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-primary hover:text-primary/80 mt-1.5 transition-colors"
        >
          {expanded ? "Show less" : `+${options.length - 4} more`}
        </button>
      )}
    </div>
  );
}
