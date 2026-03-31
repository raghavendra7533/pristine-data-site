import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

/* ─── Mock 50 contacts (Apollo-style) ─── */

const firstNames = ["Murat", "Christian", "Marcos", "Ryan", "Ian", "Scott", "Titania", "Gadi", "Simone", "Asma", "Ali", "Malte", "Pablo", "Chang", "Leslie", "Paulie", "Sam", "Alexander", "Nathan", "Alex", "Cathyelle", "Tom", "Lev", "Sarah", "Emily", "David", "Jessica", "Michael", "Rachel", "Andrew", "Nicole", "James", "Olivia", "Daniel", "Sophia", "Chris", "Megan", "Kevin", "Amanda", "Brandon", "Lauren", "Tyler", "Victoria", "Jason", "Michelle", "Justin", "Natalie", "Brian", "Heather", "Robert"];
const lastNames = ["Bozfakioglu", "Ramirez", "Machado", "Bonnici", "Kennedy", "Holden", "Jordan", "Benmark", "Rocha", "Mohamed", "Amohamedi", "Landwehr", "Sagrado Alvarez", "Liu", "Berland", "Dery", "Owens", "Wulsch", "Valadares", "Gitsik", "Schroeder", "Wentworth", "Kerzhner", "Johnson", "Rodriguez", "Park", "Martinez", "Chen", "Kim", "Thompson", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "White", "Harris", "Martin", "Jackson", "Lee", "Walker", "Hall", "Young", "Allen", "King", "Wright", "Lopez", "Hill", "Scott"];
const companies = ["GSC International", "IMMERSE", "GCB Investimentos", "Later", "OUTsurance Ireland", "Vanta", "Tourist App", "Scale Venture Partners", "Bark", "Leena AI", "CTS Consultoria", "Nile Harvest for Export", "LipusPlus", "Peec AI", "Vyootrip", "Selmedico", "Verizon", "AG1", "Freezing Point", "OMHU", "Oxus Finance", "Soft2Bet", "Riachuelo", "incident.io", "Autonomy AI", "Stripe", "Notion", "Linear", "Vercel", "Figma", "Retool", "Amplitude", "Mixpanel", "Datadog", "PagerDuty", "Confluent", "HashiCorp", "Snyk", "LaunchDarkly", "Miro", "Loom", "Calendly", "Gong", "Outreach", "Salesloft", "Apollo", "ZoomInfo", "Clearbit", "6sense", "Clari"];
const domains = companies.map(c => c.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com");
const titles = ["CMO", "VP Marketing", "Head of Growth", "Director of Marketing", "Chief Marketing Officer", "SVP Marketing", "VP of Demand Gen", "Head of Brand", "CMO", "VP Marketing", "Director of Content", "Head of Marketing Ops", "CMO", "VP Digital Marketing", "Head of Product Marketing"];

function generateContacts(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `contact-${i + 1}`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    initials: firstNames[i % firstNames.length][0] + lastNames[i % lastNames.length][0],
    jobTitle: titles[i % titles.length],
    company: companies[i % companies.length],
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase().split(" ")[0]}@${domains[i % domains.length]}`,
    phone: i % 3 === 0 ? `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : null,
    hasPhone: i % 3 === 0,
  }));
}

const allContacts = generateContacts(50);

export default function ListDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const listName = id === "1" ? "Enterprise Tech Companies Q1" : id === "2" ? "VP Sales Decision Makers" : "Contact List";

  const filtered = allContacts.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.company} ${c.jobTitle} ${c.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

  const allSelected = paginated.length > 0 && paginated.every((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    if (allSelected) {
      const newSet = new Set(selectedIds);
      paginated.forEach((c) => newSet.delete(c.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      paginated.forEach((c) => newSet.add(c.id));
      setSelectedIds(newSet);
    }
  };

  const toggleOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/lists")}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-foreground">{listName}</h1>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  <Icon icon="solar:users-group-rounded-linear" className="h-3 w-3 mr-1" />
                  People
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{filtered.length} records</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Import
              </Button>
              <Button size="sm">
                <Icon icon="solar:user-plus-linear" className="h-3.5 w-3.5 mr-1.5" />
                Add records to list
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-border bg-card px-6 py-2.5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Icon icon="solar:magnifer-linear" className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="h-8 w-56 pl-8 text-xs"
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Icon icon="solar:filter-linear" className="h-3.5 w-3.5" />
              Show Filters
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedIds.size} selected
              </Badge>
            )}
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Icon icon="solar:sort-from-top-to-bottom-linear" className="h-3.5 w-3.5" />
              Sort
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Icon icon="solar:settings-linear" className="h-3.5 w-3.5" />
              View options
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-[1400px] mx-auto">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    Name
                    <Icon icon="solar:add-circle-linear" className="h-3 w-3 opacity-40" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  <Icon icon="solar:case-round-linear" className="h-3 w-3 inline mr-1 opacity-50" />
                  Job title
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  <Icon icon="solar:buildings-2-linear" className="h-3 w-3 inline mr-1 opacity-50" />
                  Company
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  <Icon icon="solar:letter-linear" className="h-3 w-3 inline mr-1 opacity-50" />
                  Emails
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  <Icon icon="solar:phone-linear" className="h-3 w-3 inline mr-1 opacity-50" />
                  Phone numbers
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  + Add column
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((contact) => (
                <TableRow
                  key={contact.id}
                  className={cn(
                    "group hover:bg-muted/20 transition-colors cursor-pointer",
                    selectedIds.has(contact.id) && "bg-primary/5"
                  )}
                >
                  <TableCell className="w-10">
                    <Checkbox
                      checked={selectedIds.has(contact.id)}
                      onCheckedChange={() => toggleOne(contact.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                        {contact.initials}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {contact.firstName} {contact.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{contact.jobTitle}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-muted flex items-center justify-center">
                        <Icon icon="solar:buildings-2-linear" className="h-2.5 w-2.5 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">{contact.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Icon icon="solar:letter-linear" className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">{contact.email}</span>
                      {contact.hasPhone && (
                        <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">+1</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.phone ? (
                      <span className="text-sm text-muted-foreground">{contact.phone}</span>
                    ) : (
                      <button className="text-xs text-muted-foreground/50 hover:text-primary transition-colors flex items-center gap-1">
                        Request phone number
                        {contact.hasPhone && <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">+1</Badge>}
                      </button>
                    )}
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground min-w-16 text-center">{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
            >
              <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            {startIdx + 1} - {Math.min(startIdx + itemsPerPage, filtered.length)} of {filtered.length}
          </span>
        </div>
      </div>
    </div>
  );
}
