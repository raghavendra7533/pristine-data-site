import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

// Mock data for accounts
const mockAccountLists = [
  {
    id: "1",
    listName: "Enterprise Tech Companies Q1",
    source: "enterprise_tech_q1.csv",
    listStatus: "Enriched",
    status: "Completed",
    createdDate: "Jan 15, 2025",
    totalRecords: 1250,
  },
  {
    id: "2",
    listName: "Mid-Market SaaS Prospects",
    source: "midmarket_saas.csv",
    listStatus: "Processing",
    status: "Pending",
    createdDate: "Jan 12, 2025",
    totalRecords: 890,
  },
  {
    id: "3",
    listName: "Healthcare Vertical Accounts",
    source: "healthcare_accounts.csv",
    listStatus: "Enriched",
    status: "Completed",
    createdDate: "Jan 10, 2025",
    totalRecords: 456,
  },
  {
    id: "4",
    listName: "Retail Industry Expansion",
    source: "retail_expansion.csv",
    listStatus: "Validating",
    status: "Pending",
    createdDate: "Jan 8, 2025",
    totalRecords: 723,
  },
  {
    id: "5",
    listName: "Financial Services Targets",
    source: "finserv_targets.csv",
    listStatus: "Enriched",
    status: "Completed",
    createdDate: "Jan 5, 2025",
    totalRecords: 312,
  },
];

// Mock data for contacts
const mockContactLists = [
  {
    id: "1",
    listName: "VP Sales Decision Makers",
    source: "vp_sales_contacts.csv",
    listStatus: "Enriched",
    status: "Completed",
    createdDate: "Jan 14, 2025",
    totalRecords: 2340,
  },
  {
    id: "2",
    listName: "CMO & Marketing Leaders",
    source: "cmo_marketing.csv",
    listStatus: "Processing",
    status: "Pending",
    createdDate: "Jan 11, 2025",
    totalRecords: 1567,
  },
  {
    id: "3",
    listName: "IT Directors Tech Stack",
    source: "it_directors.csv",
    listStatus: "Enriched",
    status: "Completed",
    createdDate: "Jan 9, 2025",
    totalRecords: 892,
  },
  {
    id: "4",
    listName: "Procurement Officers",
    source: "procurement_list.csv",
    listStatus: "Validating",
    status: "Pending",
    createdDate: "Jan 7, 2025",
    totalRecords: 445,
  },
];

// Mock data for saved searches
const mockSavedSearches = [
  {
    id: "1",
    listName: "Series B+ SaaS Companies",
    source: "Saved Search",
    listStatus: "Auto-refresh",
    status: "Completed",
    createdDate: "Jan 13, 2025",
    totalRecords: 3200,
  },
  {
    id: "2",
    listName: "NYC Tech Startups 50-200 emp",
    source: "Saved Search",
    listStatus: "Auto-refresh",
    status: "Completed",
    createdDate: "Jan 6, 2025",
    totalRecords: 1890,
  },
  {
    id: "3",
    listName: "Recently Funded Companies",
    source: "Saved Search",
    listStatus: "Auto-refresh",
    status: "Completed",
    createdDate: "Jan 3, 2025",
    totalRecords: 567,
  },
];

const statusColors = {
  Completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
};

const listStatusColors = {
  Enriched: "bg-primary/10 text-primary border-primary/20",
  Processing: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Validating: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  "Auto-refresh": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
};

interface ListItem {
  id: string;
  listName: string;
  source: string;
  listStatus: string;
  status: string;
  createdDate: string;
  totalRecords: number;
}

interface ListTableProps {
  data: ListItem[];
  searchQuery: string;
  type: "accounts" | "contacts" | "saved";
}

const ListTable = ({ data, searchQuery, type }: ListTableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((item) =>
    item.listName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                List Name
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                Source
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                List Status
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                Created Date
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Icon icon="solar:folder-open-linear" className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No lists found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={item.id}
                  onClick={() => navigate(`/lists/${item.id}`)}
                  className={cn(
                    "group hover:bg-muted/30 transition-colors cursor-pointer",
                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon
                          icon={type === "saved" ? "solar:bookmark-bold" : "solar:document-text-bold"}
                          className="w-4 h-4 text-primary"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.listName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.totalRecords.toLocaleString()} records
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:file-text-linear" className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.source}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] uppercase font-bold tracking-wide border",
                        listStatusColors[item.listStatus as keyof typeof listStatusColors]
                      )}
                    >
                      {item.listStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] uppercase font-bold tracking-wide border",
                        statusColors[item.status as keyof typeof statusColors]
                      )}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{item.createdDate}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Icon icon="solar:eye-linear" className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Icon icon="solar:download-minimalistic-linear" className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                        <Icon icon="solar:trash-bin-minimalistic-linear" className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} items
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8"
            >
              <Icon icon="solar:arrow-left-linear" className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8"
            >
              <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Lists() {
  const [activeTab, setActiveTab] = useState("accounts");
  const [searchQuery, setSearchQuery] = useState("");

  const getTabCounts = () => ({
    accounts: mockAccountLists.length,
    contacts: mockContactLists.length,
    saved: mockSavedSearches.length,
  });

  const counts = getTabCounts();

  const getButtonLabels = () => {
    switch (activeTab) {
      case "accounts":
        return { download: "Download Account Sample", upload: "Upload Account List" };
      case "contacts":
        return { download: "Download Contact Sample", upload: "Upload Contact List" };
      default:
        return { download: "Download Sample", upload: "Create Saved Search" };
    }
  };

  const buttonLabels = getButtonLabels();

  return (
    <div className="min-h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon icon="solar:folder-with-files-bold" className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Lists</h1>
                <p className="text-sm text-muted-foreground">
                  Whether you're introducing a new solution, re-engaging old leads, or expanding into new markets.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Icon icon="solar:download-minimalistic-linear" className="h-4 w-4 mr-2" />
                {buttonLabels.download}
              </Button>
              <Button size="sm">
                <Icon icon="solar:upload-minimalistic-linear" className="h-4 w-4 mr-2" />
                {buttonLabels.upload}
              </Button>
            </div>
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
                  <p className="text-2xl font-bold">
                    {counts.accounts + counts.contacts + counts.saved}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Lists</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:buildings-2-linear" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {counts.accounts}
                  </p>
                  <p className="text-xs text-muted-foreground">Account Lists</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Icon icon="solar:users-group-rounded-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                    {counts.contacts}
                  </p>
                  <p className="text-xs text-muted-foreground">Contact Lists</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Icon icon="solar:bookmark-linear" className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {counts.saved}
                  </p>
                  <p className="text-xs text-muted-foreground">Saved Searches</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="accounts" className="gap-2">
                <Icon icon="solar:buildings-2-linear" className="h-4 w-4" />
                Accounts ({counts.accounts})
              </TabsTrigger>
              <TabsTrigger value="contacts" className="gap-2">
                <Icon icon="solar:users-group-rounded-linear" className="h-4 w-4" />
                Contacts ({counts.contacts})
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <Icon icon="solar:bookmark-linear" className="h-4 w-4" />
                Saved Search ({counts.saved})
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Icon
                  icon="solar:magnifer-linear"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <Input
                  placeholder="Search your list name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[280px]"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Icon icon="solar:filter-linear" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          <Card>
            <CardContent className="p-0">
              <TabsContent value="accounts" className="m-0 p-4">
                <ListTable data={mockAccountLists} searchQuery={searchQuery} type="accounts" />
              </TabsContent>
              <TabsContent value="contacts" className="m-0 p-4">
                <ListTable data={mockContactLists} searchQuery={searchQuery} type="contacts" />
              </TabsContent>
              <TabsContent value="saved" className="m-0 p-4">
                <ListTable data={mockSavedSearches} searchQuery={searchQuery} type="saved" />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
