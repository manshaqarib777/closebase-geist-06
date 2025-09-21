import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, TrendingUp, Calendar, MessageSquare, Zap, Target, Clock, Users, Eye, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Utility function for relative time formatting
const formatRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `vor ${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `vor ${Math.floor(diffInMinutes / 60)}h`;
  return `vor ${Math.floor(diffInMinutes / 1440)}d`;
};

const kpis = [
  {
    title: "Aktive Jobs",
    value: 8,
    subtitle: "3 geboostet",
    trend: { value: 25, isPositive: true }
  },
  {
    title: "Bewerbungen",
    value: 156,
    subtitle: "Diese Woche",
    trend: { value: 18, isPositive: true }
  },
  {
    title: "Ø Antwortzeit",
    value: "4,2 Std.",
    subtitle: "Auf Bewerbungen",
    trend: { value: 15, isPositive: false }
  },
  {
    title: "Conversion Rate",
    value: "12%",
    subtitle: "Bewerbung → Hire",
    trend: { value: 3, isPositive: true }
  }
];

const recentApplications = [
  {
    id: "1",
    candidateName: "Sarah Müller",
    jobTitle: "Senior Sales Consultant",
    status: "sent" as const,
    fitScore: 94,
    appliedAt: "vor 2 Std.",
    sciScore: "Platin",
    dealBand: "5K-25K"
  },
  {
    id: "2", 
    candidateName: "Thomas Weber",
    jobTitle: "Closer B2B SaaS",
    status: "sent" as const,
    fitScore: 87,
    appliedAt: "vor 5 Std.",
    sciScore: "Gold",
    dealBand: "10K-50K"
  },
  {
    id: "3",
    candidateName: "Anna Schmidt",
    jobTitle: "Sales Development Rep",
    status: "sent" as const,
    fitScore: 76,
    appliedAt: "vor 1 Tag",
    sciScore: "Silber",
    dealBand: "1K-5K"
  }
];

const activeJobs = [
  {
    id: "1",
    title: "Senior Sales Consultant",
    applicationsCount: 45,
    viewCount: 234,
    ctr: "19%",
    qualityScore: 92,
    daysOnline: 14,
    isBoosted: true,
    boostDaysLeft: 5
  },
  {
    id: "2",
    title: "Closer B2B SaaS",
    applicationsCount: 28,
    viewCount: 156,
    ctr: "18%",
    qualityScore: 88,
    daysOnline: 7,
    isBoosted: true,
    boostDaysLeft: 12
  },
  {
    id: "3",
    title: "Sales Development Rep",
    applicationsCount: 67,
    viewCount: 445,
    ctr: "15%",
    qualityScore: 76,
    daysOnline: 28,
    isBoosted: false
  }
];

const proTips = [
  "Antwort in <24h erhöht Hire-Rate um 34%",
  "Füge KPIs hinzu → Qualitätsscore +12 Punkte",
  "Boost am Montag bringt 43% mehr Views"
];

export default function CompanyDashboard() {
  const navigate = useNavigate();

  return (
    <AppLayout 
      breadcrumbs={[
        { label: "Dashboard" }
      ]}
    >
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">
            TechFlow Talent Hub 🚀
          </h1>
          <p className="text-sm text-muted-foreground font-ui">
            Willkommen zurück! Hier ist was heute passiert.
          </p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <Button 
            onClick={() => navigate("/company/jobs/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Neue Stelle ausschreiben
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/company/billing")}
          >
            <Zap className="w-4 h-4 mr-2" />
            Boost kaufen
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {kpis.map((kpi, index) => (
          <StatCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            trend={kpi.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <CardHeader className="p-0 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-heading">Neueste Bewerbungen</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground font-ui">Die letzten 5 eingegangenen Bewerbungen</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/company/candidates")}
                >
                  Alle anzeigen
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/50">
              {recentApplications.map((application) => (
                <div 
                  key={application.id} 
                  className="grid grid-cols-[48px_1fr_auto_auto] items-center gap-3 p-3 rounded-xl hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary transition-smooth cursor-pointer group"
                  onClick={() => navigate(`/company/candidates/${application.id}`)}
                >
                  {/* Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-ui font-semibold">
                      {application.candidateName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Textblock */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-[15px] text-foreground truncate">
                        {application.candidateName}
                      </span>
                      <Badge variant="secondary" className="text-xs font-ui">
                        {application.sciScore}
                      </Badge>
                      <Badge variant="default" className="text-xs font-ui bg-primary">
                        Neu
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {application.jobTitle}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="inline-flex items-center h-6 px-2.5 rounded-full text-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {application.dealBand}
                      </span>
                      <span className="inline-flex items-center h-6 px-2.5 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                        {application.appliedAt}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 pr-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-9 px-3 border-primary text-primary hover:bg-primary/5"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/company/messages/${application.id}`);
                            }}
                            title="Nachricht"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Nachricht senden</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-9 px-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle shortlist/interview logic
                            }}
                            title="Shortlist / Interview vorschlagen"
                          >
                            <Calendar className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Shortlist / Interview vorschlagen</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-9 px-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => navigate(`/company/candidates/${application.id}`)}
                        >
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle reject logic
                          }}
                        >
                          Ablehnen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* FIT-Ring */}
                  <div className="pr-3">
                    <ProgressRing value={application.fitScore} size={40} label="FIT" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Active Jobs */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-xl font-heading">Aktive Jobs</CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-ui">Performance deiner Stellenanzeigen</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-ui font-medium text-sm text-foreground leading-tight">
                      {job.title}
                    </h4>
                    {job.isBoosted && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-cb-accent text-white text-xs ml-2 font-ui">
                              <Zap className="w-3 h-3 mr-1" />
                              {job.boostDaysLeft}d
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Boost endet in {job.boostDaysLeft} Tagen</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-ui">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{job.applicationsCount}</span>
                      <span className="text-muted-foreground">Bew.</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 cursor-help">
                            <TrendingUp className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">{job.ctr}</span>
                            <span className="text-muted-foreground">CTR</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Click-Through-Rate: Bewerbungen pro View</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 cursor-help">
                            <Target className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">{job.qualityScore}</span>
                            <span className="text-muted-foreground">Qualität</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Stellenqualität von 0-100 basierend auf Vollständigkeit</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{job.daysOnline}</span>
                      <span className="text-muted-foreground">Tage</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-xl font-heading">Pro-Tipps 💡</CardTitle>
              <CardDescription className="text-sm text-muted-foreground font-ui">Optimiere deine Hiring-Performance</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {proTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-cb-primary mt-2 flex-shrink-0" />
                  <p className="font-ui text-foreground leading-relaxed">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}