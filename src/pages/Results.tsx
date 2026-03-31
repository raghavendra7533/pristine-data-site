import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FirmographicFilters from "@/components/search/FirmographicFilters";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const mockAccounts = [{
  id: "1",
  name: "Acme Corp",
  domain: "acmecorp.com",
  industry: "Fintech",
  revenue: "$10M-$25M",
  employees: "150",
  location: "San Francisco, CA",
  source: "both" as const
}, {
  id: "2",
  name: "Beta Systems",
  domain: "betasystems.com",
  industry: "Fintech",
  revenue: "$25M-$50M",
  employees: "250",
  location: "New York, NY",
  source: "firmo" as const
}, {
  id: "3",
  name: "Gamma Tech",
  domain: "gammatech.io",
  industry: "Fintech",
  revenue: "$5M-$10M",
  employees: "75",
  location: "Austin, TX",
  source: "tech" as const
}, {
  id: "4",
  name: "Delta Innovations",
  domain: "deltainnovations.com",
  industry: "Fintech",
  revenue: "$50M-$100M",
  employees: "400",
  location: "Chicago, IL",
  source: "both" as const
}, {
  id: "5",
  name: "Epsilon Labs",
  domain: "epsilonlabs.io",
  industry: "Fintech",
  revenue: "$10M-$25M",
  employees: "180",
  location: "Seattle, WA",
  source: "firmo" as const
}];

const mockContacts = [{
  id: "1",
  name: "Sarah Johnson",
  title: "Director of Revenue Operations",
  company: "Acme Corp",
  domain: "acmecorp.com",
  location: "San Francisco, CA",
  email: "sarah.j@acmecorp.com"
}, {
  id: "2",
  name: "Michael Chen",
  title: "VP of Revenue Operations",
  company: "Beta Systems",
  domain: "betasystems.com",
  location: "New York, NY",
  email: "m.chen@betasystems.com"
}, {
  id: "3",
  name: "Emily Rodriguez",
  title: "Head of RevOps",
  company: "Gamma Tech",
  domain: "gammatech.io",
  location: "Austin, TX",
  email: "e.rodriguez@gammatech.io"
}, {
  id: "4",
  name: "David Park",
  title: "Chief Revenue Officer",
  company: "Delta Innovations",
  domain: "deltainnovations.com",
  location: "Chicago, IL",
  email: "d.park@deltainnovations.com"
}, {
  id: "5",
  name: "Jessica Martinez",
  title: "VP Revenue Operations",
  company: "Epsilon Labs",
  domain: "epsilonlabs.io",
  location: "Seattle, WA",
  email: "j.martinez@epsilonlabs.io"
}];

const sourceColors = {
  both: "bg-primary/10 text-primary border-primary/20",
  firmo: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  tech: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
};

// Company Logo component with Clearbit fallback
const CompanyLogo = ({ domain, name, className }: { domain: string; name: string; className?: string }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={cn(
      "w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden flex-shrink-0",
      className
    )}>
      {!imgError ? (
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          className="w-full h-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-sm font-medium text-muted-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default function Results() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = window.location.pathname.includes("/contacts") ? "contacts" : "accounts";
  const hasTechPicks = searchParams.get("techPicks");
  const isFirmographicSearch = searchParams.get("type") === "firmographic";
  const initialQuery = searchParams.get("q") || "";
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [blendMode, setBlendMode] = useState<"intersect" | "union" | "exclude">("union");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(true);
  const [firmographicFilters, setFirmographicFilters] = useState({
    locations: [] as string[],
    industries: [] as string[],
    industryKeywords: [] as string[],
    employeeSize: [] as string[],
    revenue: [] as string[]
  });
  const [activeFilters, setActiveFilters] = useState([{
    id: "1",
    label: "Fintech"
  }, {
    id: "2",
    label: "Mid-market"
  }, {
    id: "3",
    label: "US"
  }]);
  const [liveMatchCount, setLiveMatchCount] = useState(0);
  const [isCountingMatches, setIsCountingMatches] = useState(false);

  useEffect(() => {
    if (isFirmographicSearch && initialQuery) {
      setTimeout(() => {
        setFirmographicFilters({
          locations: ["United States"],
          industries: ["Technology", "SaaS"],
          industryKeywords: ["B2B"],
          employeeSize: ["100-500"],
          revenue: ["$10M-$50M"]
        });
        toast.success("Filters extracted from your query");
      }, 500);
    }
  }, [isFirmographicSearch, initialQuery]);

  useEffect(() => {
    if (filterSheetOpen) {
      setIsCountingMatches(true);

      const timer = setTimeout(() => {
        const baseCount = 5000;
        const locationMultiplier = firmographicFilters.locations.length > 0
          ? Math.pow(0.5, firmographicFilters.locations.length)
          : 1;
        const industryMultiplier = firmographicFilters.industries.length > 0
          ? Math.pow(0.4, firmographicFilters.industries.length)
          : 1;
        const keywordMultiplier = firmographicFilters.industryKeywords.length > 0
          ? Math.pow(0.6, firmographicFilters.industryKeywords.length)
          : 1;
        const employeeMultiplier = firmographicFilters.employeeSize.length > 0
          ? 0.4 / firmographicFilters.employeeSize.length
          : 1;
        const revenueMultiplier = firmographicFilters.revenue.length > 0
          ? 0.5 / firmographicFilters.revenue.length
          : 1;
        const calculatedCount = Math.floor(
          baseCount *
          locationMultiplier *
          industryMultiplier *
          keywordMultiplier *
          employeeMultiplier *
          revenueMultiplier
        );
        setLiveMatchCount(Math.max(calculatedCount, 5));
        setIsCountingMatches(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [firmographicFilters, filterSheetOpen]);

  const handleApplyFilters = () => {
    toast.success("Filters updated", {
      description: "Results refreshed with new criteria"
    });
    setFilterSheetOpen(false);
  };

  const data = type === "accounts" ? mockAccounts : mockContacts;

  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(query) ||
      (type === "accounts" && (item as any).industry?.toLowerCase().includes(query)) ||
      (type === "contacts" && ((item as any).title?.toLowerCase().includes(query) || (item as any).company?.toLowerCase().includes(query)));
  });

  const toggleSelection = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                type === "accounts" ? "bg-primary/10" : "bg-violet-500/10"
              )}>
                <Icon
                  icon={type === "accounts" ? "solar:buildings-2-bold" : "solar:users-group-two-rounded-bold"}
                  className={cn(
                    "h-6 w-6",
                    type === "accounts" ? "text-primary" : "text-violet-600 dark:text-violet-400"
                  )}
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {type === "accounts" ? "Account Results" : "Contact Results"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {filteredData.length.toLocaleString()} {type} found matching your criteria
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Icon icon="solar:download-linear" className="h-4 w-4 mr-2" />
                Export
              </Button>
              {type === "accounts" && (
                <Button size="sm">
                  <Icon icon="solar:users-group-two-rounded-linear" className="h-4 w-4 mr-2" />
                  Find Contacts
                </Button>
              )}
              {type === "contacts" && (
                <Button size="sm">
                  <Icon icon="solar:letter-linear" className="h-4 w-4 mr-2" />
                  Start Campaign
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Row - Compact */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold">{filteredData.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Selected:</span>
            <span className="font-semibold text-primary">{selected.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Filters:</span>
            <span className="font-semibold">{activeFilters.length}</span>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${type} by name${type === "accounts" ? ", industry" : ", title, company"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {isFirmographicSearch ? (
                <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="default">
                      <Icon icon="solar:settings-linear" className="h-4 w-4 mr-2" />
                      Edit Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Edit Search Filters</SheetTitle>
                      <SheetDescription>
                        Adjust your firmographic criteria to refine results
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-6 pb-32">
                      <FirmographicFilters filters={firmographicFilters} onChange={setFirmographicFilters} />
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">
                              {isCountingMatches ? (
                                <span className="animate-pulse">Calculating...</span>
                              ) : (
                                `${liveMatchCount.toLocaleString()} ${type}`
                              )}
                            </span>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px] uppercase font-bold tracking-wide border",
                                liveMatchCount === 0
                                  ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                                  : liveMatchCount < 100
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                                    : liveMatchCount < 1000
                                      ? "bg-primary/10 text-primary border-primary/20"
                                      : "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20"
                              )}
                            >
                              {liveMatchCount === 0 ? "Too Narrow" : liveMatchCount < 100 ? "Highly Targeted" : liveMatchCount < 1000 ? "Well Balanced" : "Large Audience"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Results update as you adjust filters
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setFilterSheetOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={handleApplyFilters} className="flex-1" disabled={isCountingMatches}>
                          Apply Filters ({liveMatchCount.toLocaleString()})
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button variant="outline" size="default">
                  <Icon icon="solar:tuning-2-linear" className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <span className="text-sm text-muted-foreground">Active Filters:</span>
            {activeFilters.map(filter => (
              <Badge
                key={filter.id}
                variant="secondary"
                className="px-3 py-1.5 gap-2 cursor-pointer hover:bg-secondary/80 transition-colors text-xs"
              >
                {filter.label}
                <Icon
                  icon="solar:close-circle-linear"
                  className="h-3.5 w-3.5 cursor-pointer hover:text-destructive"
                  onClick={() => removeFilter(filter.id)}
                />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Clear all
            </Button>
          </div>
        )}

        {/* Blend Control - only for accounts with tech picks */}
        {type === "accounts" && hasTechPicks && (
          <Card className="mb-6 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:layers-linear" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Blend Mode:</span>
                </div>
                <Tabs value={blendMode} onValueChange={(v) => setBlendMode(v as any)}>
                  <TabsList>
                    <TabsTrigger value="intersect" className="text-xs">
                      <Icon icon="solar:link-linear" className="h-3.5 w-3.5 mr-1.5" />
                      Intersect
                    </TabsTrigger>
                    <TabsTrigger value="union" className="text-xs">
                      <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5 mr-1.5" />
                      Union
                    </TabsTrigger>
                    <TabsTrigger value="exclude" className="text-xs">
                      <Icon icon="solar:minus-circle-linear" className="h-3.5 w-3.5 mr-1.5" />
                      Exclude
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="ml-auto text-sm text-muted-foreground flex items-center gap-2">
                  <Icon icon="solar:info-circle-linear" className="h-4 w-4" />
                  Combining Firmographics + Tech Picks
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selection Header */}
        <Card className="sticky top-0 z-10 shadow-sm mb-4">
          <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selected.length === filteredData.length && filteredData.length > 0}
                onCheckedChange={checked => setSelected(checked ? filteredData.map(d => d.id) : [])}
              />
              <span className="text-sm font-medium">
                {selected.length > 0 ? `${selected.length} selected` : `Select all ${filteredData.length}`}
              </span>
            </div>

            {selected.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2">
                  <Icon icon="solar:clipboard-list-linear" className="h-4 w-4" />
                  <span className="hidden sm:inline">Save as List</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Icon icon="solar:download-linear" className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                {type === "accounts" && (
                  <Button size="sm" className="gap-2">
                    <Icon icon="solar:users-group-two-rounded-linear" className="h-4 w-4" />
                    Find Contacts
                    <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
                  </Button>
                )}
                {type === "contacts" && (
                  <Button size="sm" className="gap-2">
                    <Icon icon="solar:letter-linear" className="h-4 w-4" />
                    Start Campaign
                    <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Table + Filter Sidebar */}
        <div className="flex gap-4">
          {/* Table */}
          <div className="flex-1 min-w-0">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-10">
                        <Checkbox
                          checked={selected.length === filteredData.length && filteredData.length > 0}
                          onCheckedChange={checked => setSelected(checked ? filteredData.map(d => d.id) : [])}
                        />
                      </TableHead>
                      {type === "accounts" ? (
                        <>
                          <TableHead className="text-xs font-semibold text-muted-foreground">Company</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground">Industry</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground">Revenue</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground">Employees</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground">Location</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground text-right">Actions</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="text-xs font-semibold text-muted-foreground">Name</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground">Title</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground">Company</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground">Email</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground">Location</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground text-right">Actions</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Icon icon={type === "accounts" ? "solar:buildings-2-linear" : "solar:users-group-two-rounded-linear"} className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">No {type} found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map(item => (
                        <TableRow key={item.id} className="group hover:bg-muted/20">
                          <TableCell className="w-10">
                            <Checkbox
                              checked={selected.includes(item.id)}
                              onCheckedChange={() => toggleSelection(item.id)}
                            />
                          </TableCell>
                          {type === "accounts" ? (
                            <>
                              <TableCell>
                                <div className="flex items-center gap-2.5">
                                  <CompanyLogo domain={(item as any).domain} name={item.name} className="w-8 h-8 rounded" />
                                  <span className="text-sm font-medium">{item.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs">{(item as any).industry}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{(item as any).revenue}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{(item as any).employees}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{(item as any).location}</TableCell>
                              <TableCell>
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate(`/results/contacts?account=${item.id}`)}>
                                    Find Contacts
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <Icon icon="solar:arrow-right-up-linear" className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>
                                <div className="flex items-center gap-2.5">
                                  <Avatar className="h-7 w-7">
                                    <AvatarImage src={`https://i.pravatar.cc/28?u=${item.id}`} />
                                    <AvatarFallback className="text-[10px]">
                                      {item.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{item.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{(item as any).title}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{(item as any).company}</TableCell>
                              <TableCell className="text-sm text-muted-foreground truncate max-w-[180px]">{(item as any).email}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{(item as any).location}</TableCell>
                              <TableCell>
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <Icon icon="solar:letter-linear" className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate(`/contact/profile?email=${(item as any).email}`)}>
                                    View Profile
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Right Filter Sidebar */}
          {filterSidebarOpen && (
            <div className="w-72 shrink-0 space-y-4 animate-in slide-in-from-right-2 duration-200">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:filter-linear" className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Filters</span>
                    </div>
                    <button onClick={() => setFilterSidebarOpen(false)} className="p-1 rounded hover:bg-muted">
                      <Icon icon="solar:close-circle-linear" className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Active filters */}
                  <div className="space-y-3">
                    {activeFilters.map(f => (
                      <div key={f.id} className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">{f.label}</Badge>
                        <button onClick={() => removeFilter(f.id)} className="p-0.5 rounded hover:bg-muted">
                          <Icon icon="solar:close-circle-linear" className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border mt-3 pt-3 space-y-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                        Location
                      </label>
                      <Input placeholder="Add location..." className="h-8 text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                        Industry
                      </label>
                      <Input placeholder="Add industry..." className="h-8 text-xs" />
                    </div>
                    {type === "contacts" && (
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                          Job Title
                        </label>
                        <Input placeholder="e.g. VP, Director..." className="h-8 text-xs" />
                      </div>
                    )}
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                        Employee Size
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {["1-50", "51-200", "201-500", "500+"].map(size => (
                          <Badge key={size} variant="outline" className="text-[10px] cursor-pointer hover:bg-muted">{size}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                        Technologies
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {["Snowflake", "HubSpot", "Salesforce", "AWS"].map(tech => (
                          <Badge key={tech} variant="outline" className="text-[10px] cursor-pointer hover:bg-muted">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4" size="sm">
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Show filters toggle when sidebar is closed */}
        {!filterSidebarOpen && (
          <button
            onClick={() => setFilterSidebarOpen(true)}
            className="fixed right-4 top-1/2 -translate-y-1/2 bg-card border border-border shadow-lg rounded-lg p-2 hover:bg-muted transition-colors z-20"
          >
            <Icon icon="solar:filter-linear" className="h-4 w-4 text-primary" />
          </button>
        )}
      </div>
    </div>
  );
}
