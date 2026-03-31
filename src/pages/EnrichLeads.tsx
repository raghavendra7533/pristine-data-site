import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Mock data for integrated apps
const integrationApps = [
  {
    id: "hubspot",
    name: "HubSpot",
    icon: "logos:hubspot",
    description: "Enrich contacts and companies from your HubSpot CRM",
    connected: true,
    totalRecords: 12450,
    lastSync: "2 hours ago",
    color: "bg-orange-500/10 border-orange-500/20",
    iconColor: "text-orange-600",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    icon: "logos:salesforce",
    description: "Sync and enrich leads from Salesforce",
    connected: true,
    totalRecords: 8920,
    lastSync: "4 hours ago",
    color: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    icon: "logos:pipedrive",
    description: "Import and enrich deals from Pipedrive",
    connected: false,
    totalRecords: 0,
    lastSync: null,
    color: "bg-slate-500/10 border-slate-500/20",
    iconColor: "text-slate-600",
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    icon: "logos:zoho",
    description: "Connect your Zoho CRM to enrich contacts",
    connected: false,
    totalRecords: 0,
    lastSync: null,
    color: "bg-yellow-500/10 border-yellow-500/20",
    iconColor: "text-yellow-600",
  },
  {
    id: "dynamics",
    name: "Microsoft Dynamics",
    icon: "logos:microsoft-icon",
    description: "Enrich records from Microsoft Dynamics 365",
    connected: true,
    totalRecords: 3450,
    lastSync: "1 day ago",
    color: "bg-sky-500/10 border-sky-500/20",
    iconColor: "text-sky-600",
  },
  {
    id: "outreach",
    name: "Outreach",
    icon: "simple-icons:outreach",
    description: "Sync prospects from Outreach sequences",
    connected: false,
    totalRecords: 0,
    lastSync: null,
    color: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-600",
  },
];

// Mock enrichment history
const enrichmentHistory = [
  {
    id: "1",
    name: "Q1 Lead Enrichment",
    source: "HubSpot",
    sourceIcon: "logos:hubspot",
    recordsEnriched: 2340,
    totalRecords: 2500,
    status: "Completed",
    date: "Jan 15, 2025",
  },
  {
    id: "2",
    name: "Tech Leads Import",
    source: "CSV Upload",
    sourceIcon: "solar:document-text-bold",
    recordsEnriched: 890,
    totalRecords: 1200,
    status: "In Progress",
    date: "Jan 14, 2025",
  },
  {
    id: "3",
    name: "Enterprise Accounts",
    source: "Salesforce",
    sourceIcon: "logos:salesforce",
    recordsEnriched: 1567,
    totalRecords: 1567,
    status: "Completed",
    date: "Jan 12, 2025",
  },
  {
    id: "4",
    name: "Marketing Contacts",
    source: "CSV Upload",
    sourceIcon: "solar:document-text-bold",
    recordsEnriched: 456,
    totalRecords: 500,
    status: "Completed",
    date: "Jan 10, 2025",
  },
];

const statusColors = {
  Completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  "In Progress": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Failed: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

export default function EnrichLeads() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichProgress, setEnrichProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    } else {
      toast.error("Please upload a CSV file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };

  const handleEnrichFile = () => {
    if (!uploadedFile) return;
    setIsEnriching(true);
    setEnrichProgress(0);

    // Simulate enrichment progress
    const interval = setInterval(() => {
      setEnrichProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsEnriching(false);
          toast.success("Enrichment complete! Your data is ready.");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleIntegrationEnrich = (appName: string) => {
    toast.success(`Starting enrichment from ${appName}...`);
  };

  const connectedApps = integrationApps.filter(app => app.connected);
  const totalRecordsAvailable = connectedApps.reduce((sum, app) => sum + app.totalRecords, 0);
  const completedEnrichments = enrichmentHistory.filter(e => e.status === "Completed").length;

  return (
    <div className="min-h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-primary/20 flex items-center justify-center">
                <Icon icon="solar:magic-stick-3-bold" className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Enrich Leads</h1>
                <p className="text-sm text-muted-foreground">
                  Enrich your leads with accurate contact and company data
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/integrations")}>
              <Icon icon="solar:settings-linear" className="h-4 w-4 mr-2" />
              Manage Integrations
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon icon="solar:link-round-linear" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{connectedApps.length}</p>
                  <p className="text-xs text-muted-foreground">Connected Apps</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:users-group-rounded-linear" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {totalRecordsAvailable.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Records Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Icon icon="solar:check-circle-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                    {completedEnrichments}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Icon icon="solar:bolt-linear" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {enrichmentHistory.filter(e => e.status === "In Progress").length}
                  </p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column - CSV Upload */}
          <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon icon="solar:upload-minimalistic-bold" className="w-5 h-5 text-primary" />
                  Upload CSV to Enrich
                </h3>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                        <Icon icon="solar:file-check-bold" className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      {isEnriching ? (
                        <div className="max-w-xs mx-auto space-y-2">
                          <Progress value={enrichProgress} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            Enriching... {enrichProgress}%
                          </p>
                        </div>
                      ) : enrichProgress === 100 ? (
                        <div className="flex items-center justify-center gap-2 text-emerald-600">
                          <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
                          <span className="font-medium">Enrichment Complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <Button onClick={handleEnrichFile}>
                            <Icon icon="solar:magic-stick-3-linear" className="w-4 h-4 mr-2" />
                            Start Enrichment
                          </Button>
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFile(null);
                              setEnrichProgress(0);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                        <Icon icon="solar:cloud-upload-linear" className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          Drop your CSV file here, or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Supports CSV files with contact or company data
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:check-circle-linear" className="w-3.5 h-3.5 text-emerald-500" />
                          Email addresses
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:check-circle-linear" className="w-3.5 h-3.5 text-emerald-500" />
                          Company domains
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:check-circle-linear" className="w-3.5 h-3.5 text-emerald-500" />
                          LinkedIn URLs
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Sample */}
                <div className="mt-4 flex items-center justify-center">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Icon icon="solar:download-minimalistic-linear" className="w-4 h-4 mr-2" />
                    Download sample CSV template
                  </Button>
                </div>
              </CardContent>
            </Card>

          {/* Right Column - Connected Integrations (tile grid) */}
          <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon icon="solar:link-round-bold" className="w-5 h-5 text-primary" />
                Enrich from Connected Apps
              </h3>

              <div className="grid grid-cols-3 grid-rows-2 gap-3 flex-1">
                {integrationApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => app.connected ? handleIntegrationEnrich(app.name) : navigate("/integrations")}
                    className={cn(
                      "group relative flex flex-col items-center justify-center gap-2.5 rounded-xl border transition-all cursor-pointer p-4",
                      app.connected
                        ? "hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm"
                        : "opacity-60 hover:opacity-80 bg-muted/20"
                    )}
                  >
                    {/* Status dot */}
                    <div className={cn(
                      "absolute top-2.5 right-2.5 w-2 h-2 rounded-full",
                      app.connected ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                    )} />

                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border",
                      app.color
                    )}>
                      <Icon icon={app.icon} className="w-7 h-7" />
                    </div>

                    <span className="text-xs font-medium text-foreground text-center leading-tight">{app.name}</span>

                    {app.connected && (
                      <span className="text-[10px] text-muted-foreground">{app.totalRecords.toLocaleString()} records</span>
                    )}
                    {!app.connected && (
                      <span className="text-[10px] text-muted-foreground">Connect</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Enrichment History */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon icon="solar:history-bold" className="w-5 h-5 text-primary" />
                Recent Enrichments
              </h3>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                        Enrichment Name
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                        Source
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                        Progress
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                        Date
                      </TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrichmentHistory.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={cn(
                          "group hover:bg-muted/30 transition-colors",
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon icon="solar:magic-stick-3-bold" className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium text-sm">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon icon={item.sourceIcon} className="w-4 h-4" />
                            <span className="text-sm text-muted-foreground">{item.source}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={(item.recordsEnriched / item.totalRecords) * 100}
                              className="w-20 h-2"
                            />
                            <span className="text-xs text-muted-foreground">
                              {item.recordsEnriched}/{item.totalRecords}
                            </span>
                          </div>
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
                          <span className="text-sm text-muted-foreground">{item.date}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Icon icon="solar:eye-linear" className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Icon icon="solar:download-minimalistic-linear" className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
