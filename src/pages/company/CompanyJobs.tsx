import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Users, TrendingUp, Target, Zap, Calendar, MoreHorizontal, Edit, Copy, Archive, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const jobs = [
  {
    id: "1",
    title: "Senior Sales Consultant B2B",
    status: "published" as const,
    roleNeeded: "consultant",
    industries: ["SaaS", "Fintech"],
    location: "Remote",
    employmentType: "employee",
    qualityScore: 92,
    applicationsCount: 45,
    viewsCount: 234,
    ctr: 19.2,
    createdAt: "2024-12-15",
    updatedAt: "2024-12-20",
    isBoosted: true,
    boostUntil: "2025-01-05",
    avgCommissionEur: 75000,
    weeklyHours: 40
  },
  {
    id: "2", 
    title: "Closer für High-Ticket Sales",
    status: "published" as const,
    roleNeeded: "closer",
    industries: ["Software", "Beratung"],
    location: "Berlin",
    employmentType: "freelance",
    qualityScore: 88,
    applicationsCount: 28,
    viewsCount: 156,
    ctr: 17.9,
    createdAt: "2024-12-10",
    updatedAt: "2024-12-18",
    isBoosted: true,
    boostUntil: "2025-01-15",
    avgCommissionEur: 120000,
    weeklyHours: 30
  },
  {
    id: "3",
    title: "Sales Development Representative",
    status: "draft" as const,
    roleNeeded: "setter",
    industries: ["E-Commerce"],
    location: "Remote",
    employmentType: "employee",
    qualityScore: 76,
    applicationsCount: 0,
    viewsCount: 0,
    ctr: 0,
    createdAt: "2024-12-22",
    updatedAt: "2024-12-22",
    isBoosted: false,
    avgCommissionEur: 45000,
    weeklyHours: 40
  },
  {
    id: "4",
    title: "Full-Cycle Sales Manager",
    status: "pending_review" as const,
    roleNeeded: "full_cycle",
    industries: ["B2B", "SaaS"],
    location: "München",
    employmentType: "employee",
    qualityScore: 85,
    applicationsCount: 0,
    viewsCount: 0,
    ctr: 0,
    createdAt: "2024-12-20",
    updatedAt: "2024-12-21",
    isBoosted: false,
    avgCommissionEur: 90000,
    weeklyHours: 40
  }
];

const roleLabels = {
  setter: "Setter",
  closer: "Closer", 
  consultant: "Consultant",
  full_cycle: "Full-Cycle"
};

const statusLabels = {
  draft: "Entwurf",
  pending_review: "In Prüfung",
  published: "Veröffentlicht",
  paused: "Pausiert",
  closed: "Geschlossen"
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "published": return "boosted" as const;
    case "pending_review": return "interview" as const;
    case "draft": return "applied" as const;
    case "paused": return "shortlist" as const;
    case "closed": return "rejected" as const;
    default: return "applied" as const;
  }
};

export default function CompanyJobs() {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (boostUntil: string) => {
    const today = new Date();
    const endDate = new Date(boostUntil);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <AppLayout 
      breadcrumbs={[
        { label: "Stellenanzeigen" }
      ]}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">
            Stellenanzeigen
          </h1>
          <p className="text-sm text-muted-foreground font-ui">
            Verwalte deine offenen Positionen und analysiere deren Performance.
          </p>
        </div>
        <Button 
          onClick={() => navigate("/company/jobs/create")}
          className="mt-4 lg:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neue Stelle erstellen
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-6 mb-6">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Jobs durchsuchen..." 
                className="pl-10 font-ui"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="published">Veröffentlicht</SelectItem>
                <SelectItem value="draft">Entwurf</SelectItem>
                <SelectItem value="pending_review">In Prüfung</SelectItem>
                <SelectItem value="paused">Pausiert</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Rollen</SelectItem>
                <SelectItem value="setter">Setter</SelectItem>
                <SelectItem value="closer">Closer</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
                <SelectItem value="full_cycle">Full-Cycle</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sortieren" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Neueste</SelectItem>
                <SelectItem value="ctr">CTR</SelectItem>
                <SelectItem value="quality">Qualität</SelectItem>
                <SelectItem value="applications">Bewerbungen</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-cb-md transition-smooth">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-heading font-semibold text-foreground">
                          {job.title}
                        </h3>
                        <StatusBadge variant={getStatusVariant(job.status)}>
                          {statusLabels[job.status as keyof typeof statusLabels]}
                        </StatusBadge>
                        {job.isBoosted && job.boostUntil && (
                          <Badge className="bg-cb-accent text-white">
                            <Zap className="w-3 h-3 mr-1" />
                            {getDaysRemaining(job.boostUntil)}d Boost
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span>📍 {job.location}</span>
                        <span>💼 {roleLabels[job.roleNeeded as keyof typeof roleLabels]}</span>
                        <span>⏰ {job.weeklyHours}h/Woche</span>
                        <span>💰 {formatCurrency(job.avgCommissionEur)}/Jahr</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.industries.map((industry) => (
                          <Badge key={industry} variant="secondary" className="text-xs">
                            {industry}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs">
                          {job.employmentType === "employee" ? "Anstellung" : "Freelance"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                {job.status === "published" && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:w-80">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                        <Eye className="w-3 h-3" />
                        <span className="font-ui">Views</span>
                      </div>
                      <p className="font-ui font-semibold text-foreground">{job.viewsCount}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                        <Users className="w-3 h-3" />
                        <span className="font-ui">Bewerbungen</span>
                      </div>
                      <p className="font-ui font-semibold text-foreground">{job.applicationsCount}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-ui">CTR</span>
                      </div>
                      <p className="font-ui font-semibold text-foreground">{job.ctr}%</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                        <Target className="w-3 h-3" />
                        <span className="font-ui">Qualität</span>
                      </div>
                      <p className="font-ui font-semibold text-foreground">{job.qualityScore}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Anzeigen
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/company/jobs/${job.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Bearbeiten
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => navigate(`/company/jobs/create?duplicate=${job.id}`)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplizieren
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        if (window.confirm('Möchten Sie diese Stellenanzeige wirklich archivieren?')) {
                          console.log('Archiving job:', job.id);
                          // TODO: Implement archive functionality
                        }
                      }}>
                        <Archive className="w-4 h-4 mr-2" />
                        Archivieren
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Erstellt: {formatDate(job.createdAt)}</span>
                  <span>Aktualisiert: {formatDate(job.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>Qualitätsscore: {job.qualityScore}/100</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}