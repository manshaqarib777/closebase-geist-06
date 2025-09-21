import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, MessageSquare, Calendar, Eye, X, Filter, Sliders, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const candidateColumns = [
  { id: "sent", title: "Neu", count: 12, avgResponse: "1,2 Std." },
  { id: "shortlisted", title: "Shortlist", count: 8, avgResponse: "3,5 Std." },
  { id: "interview", title: "Interview", count: 5, avgResponse: "1,8 Tage" },
  { id: "offer", title: "Angebot", count: 2, avgResponse: "2,3 Tage" },
  { id: "hired", title: "Eingestellt", count: 1, avgResponse: "5,1 Tage" },
  { id: "rejected", title: "Abgelehnt", count: 7, avgResponse: "4,2 Std." }
];

const candidatesData = {
  sent: [
    {
      id: "1",
      name: "Sarah Müller",
      role: "Senior Sales Consultant",
      seniority: "Senior Level",
      sciScore: "Platin",
      fitScore: 94,
      dealBand: "5K-25K",
      experienceYears: "8",
      lastActivity: "2 Std.",
      appliedAt: "vor 2 Std.",
      jobTitle: "Senior Sales Consultant B2B",
      avatar: "SM"
    },
    {
      id: "2", 
      name: "Thomas Weber",
      role: "Closer",
      seniority: "Mid Level",
      sciScore: "Gold",
      fitScore: 87,
      dealBand: "10K-50K",
      experienceYears: "5",
      lastActivity: "5 Std.",
      appliedAt: "vor 5 Std.",
      jobTitle: "Closer für High-Ticket Sales",
      avatar: "TW"
    }
  ],
  shortlisted: [
    {
      id: "3",
      name: "Anna Schmidt",
      role: "Sales Development Rep",
      seniority: "Junior Level",
      sciScore: "Silber",
      fitScore: 76,
      dealBand: "1K-5K",
      experienceYears: "2",
      lastActivity: "1 Tag",
      appliedAt: "vor 1 Tag",
      jobTitle: "SDR B2B SaaS",
      avatar: "AS"
    }
  ],
  interview: [
    {
      id: "4",
      name: "Michael Johnson",
      role: "Full-Cycle",
      seniority: "Senior Level",
      sciScore: "Gold",
      fitScore: 91,
      dealBand: "25K+",
      experienceYears: "10",
      lastActivity: "3 Tage",
      appliedAt: "vor 3 Tagen",
      jobTitle: "Full-Cycle Sales Manager",
      avatar: "MJ"
    }
  ],
  offer: [
    {
      id: "5",
      name: "Lisa Chen",
      role: "Consultant",
      seniority: "Senior Level",
      sciScore: "Platin",
      fitScore: 96,
      dealBand: "10K-25K",
      experienceYears: "7",
      lastActivity: "1 Woche",
      appliedAt: "vor 1 Woche",
      jobTitle: "Senior Sales Consultant",
      avatar: "LC"
    }
  ],
  hired: [
    {
      id: "6",
      name: "David Martinez",
      role: "Closer",
      seniority: "Mid Level",
      sciScore: "Gold",
      fitScore: 89,
      dealBand: "5K-25K",
      experienceYears: "4",
      lastActivity: "2 Wochen",
      appliedAt: "vor 2 Wochen",
      jobTitle: "Closer B2B SaaS",
      avatar: "DM"
    }
  ],
  rejected: [
    {
      id: "7",
      name: "Elena Popov",
      role: "Setter",
      seniority: "Entry Level",
      sciScore: "Bronze",
      fitScore: 54,
      dealBand: "500-5K",
      experienceYears: "1",
      lastActivity: "3 Tage",
      appliedAt: "vor 3 Tagen",
      jobTitle: "Sales Development Rep",
      avatar: "EP"
    }
  ]
};

const getSciScoreColor = (score: string) => {
  switch (score) {
    case "Platin": return "bg-purple-100 text-purple-800 border-purple-200";
    case "Gold": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Silber": return "bg-gray-100 text-gray-800 border-gray-200";
    case "Bronze": return "bg-orange-100 text-orange-800 border-orange-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getNextAction = (lane: string) => {
  switch(lane) {
    case 'sent': return { label: 'Shortlisten', event: 'to-shortlist' };
    case 'shortlisted': return { label: 'Interview einladen', event: 'to-interview' };
    case 'interview': return { label: 'Angebot senden', event: 'to-offer' };
    case 'offer': return { label: 'Einstellen', event: 'to-hired' };
    default: return null;
  }
};

const CandidateCard = ({ candidate, lane, onAction }: { candidate: any; lane: string; onAction: (action: string, candidate: any) => void }) => {
  const nextAction = getNextAction(lane);
  
  return (
    <Card className="bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/15 text-primary font-medium text-sm border border-primary/20">
              {candidate.avatar}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-[15px] font-semibold text-foreground truncate">
                {candidate.name}
              </h3>
              {candidate.sciScore && (
                <Badge variant="secondary" className={`text-xs ${getSciScoreColor(candidate.sciScore)}`}>
                  {candidate.sciScore}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {candidate.role} · {candidate.seniority}
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              <span className="inline-flex items-center h-6 px-2.5 rounded-full text-sm bg-primary/10 text-primary font-medium border border-primary/20">
                FIT {candidate.fitScore}
              </span>
              <span className="inline-flex items-center h-6 px-2.5 rounded-full text-sm text-foreground/70 border border-border" style={{backgroundColor: 'hsl(var(--surface))'}}>
                {candidate.experienceYears} Jahre
              </span>
              {candidate.lastActivity && (
                <span className="inline-flex items-center h-6 px-2.5 rounded-full text-sm text-foreground/70 border border-border" style={{backgroundColor: 'hsl(var(--surface))'}}>
                  vor {candidate.lastActivity}
                </span>
              )}
            </div>
          </div>
          
          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction("view", candidate)}>
                <Eye className="w-4 h-4 mr-2" />
                Details
              </DropdownMenuItem>
              {lane === "sent" && (
                <DropdownMenuItem onClick={() => onAction("to-shortlist", candidate)}>
                  <Star className="w-4 h-4 mr-2" />
                  Shortlisten
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onAction("message", candidate)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Nachricht senden
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("reject", candidate)} className="text-destructive">
                <X className="w-4 h-4 mr-2" />
                Ablehnen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action Bar - Always Visible */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 px-3 text-xs border-primary text-primary hover:bg-primary/5"
              onClick={() => onAction("message", candidate)}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Nachricht
            </Button>
            
            {nextAction && (
              <Button 
                size="sm" 
              className="h-8 px-3 text-xs border border-border text-foreground" style={{backgroundColor: 'hsl(var(--surface))'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--surface) / 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--surface))'}
                onClick={() => onAction(nextAction.event, candidate)}
              >
                {nextAction.label}
              </Button>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 text-xs text-foreground/80"
            style={{transition: 'background-color 0.2s'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--surface) / 0.5)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => onAction("view", candidate)}
          >
            <Eye className="w-3 h-3 mr-1" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CompanyCandidates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState("all");
  const [density, setDensity] = useState<"Komfort" | "Kompakt">("Komfort");
  const navigate = useNavigate();

  const handleCandidateAction = (action: string, candidate: any) => {
    switch (action) {
      case "message":
        // Navigate to messages with candidate
        navigate(`/company/messages?candidate=${candidate.id}`);
        break;
      case "view":
        // Navigate to candidate details (you can create this page later)
        navigate(`/company/candidate/${candidate.id}`);
        break;
      case "to-shortlist":
        // Move candidate to shortlist
        toast.success(`${candidate.name} wurde zur Shortlist hinzugefügt`);
        // TODO: Implement backend call to move candidate
        break;
      case "to-interview":
        // Move candidate to interview stage
        toast.success(`Interview-Einladung für ${candidate.name} wurde gesendet`);
        // TODO: Implement backend call to schedule interview
        break;
      case "to-offer":
        // Move candidate to offer stage
        toast.success(`Angebot für ${candidate.name} wurde erstellt`);
        // TODO: Implement backend call to create offer
        break;
      case "to-hired":
        // Move candidate to hired
        toast.success(`${candidate.name} wurde eingestellt!`);
        // TODO: Implement backend call to mark as hired
        break;
      case "reject":
        // Reject candidate
        toast.success(`${candidate.name} wurde abgelehnt`);
        // TODO: Implement backend call to reject candidate
        break;
      default:
        console.log(`Action: ${action} for candidate:`, candidate);
    }
  };

  const handleDensityToggle = (newDensity: "Komfort" | "Kompakt") => {
    setDensity(newDensity);
  };

  const boardHeight = density === "Kompakt" ? "calc(100vh - 160px)" : "calc(100vh - 180px)";

  return (
    <AppLayout 
      breadcrumbs={[
        { label: "Kandidaten" }
      ]}
    >
      <div className={`max-w-[1300px] mx-auto px-4 py-6 space-y-4 ${density === "Kompakt" ? "compact" : ""}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-1">
              Kandidaten-Pipeline
            </h1>
            <p className="text-sm text-muted-foreground">
              Verwalte deine Bewerbungen und führe Kandidaten durch den Auswahlprozess.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <Card className="p-3 bg-card border border-border shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Kandidaten durchsuchen..." 
                  className="pl-10 bg-background border-border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger className="w-48 bg-background border-border">
                  <SelectValue placeholder="Nach Job filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Jobs</SelectItem>
                  <SelectItem value="job1">Senior Sales Consultant B2B</SelectItem>
                  <SelectItem value="job2">Closer für High-Ticket Sales</SelectItem>
                  <SelectItem value="job3">Sales Development Rep</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" className="text-foreground" style={{transition: 'background-color 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--surface))'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Sliders className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <div className="ml-auto flex gap-2">
                <div className="flex rounded-lg p-1 border border-border" style={{backgroundColor: 'hsl(var(--surface))'}}>
                  {["Komfort", "Kompakt"].map((option) => (
                    <button
                      key={option}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        density === option 
                          ? "bg-background text-foreground shadow-sm border border-border" 
                          : "text-foreground/70 hover:text-foreground hover:bg-background/50"
                      }`}
                      onClick={() => handleDensityToggle(option as "Komfort" | "Kompakt")}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lanes: horizontal scroll; each lane scrolls vertically */}
        <div 
          className="grid grid-flow-col auto-cols-[380px] gap-5 overflow-x-auto pb-2"
          role="list" 
          aria-label="Kandidaten-Pipeline"
          style={{ height: boardHeight }}
        >
          {candidateColumns.map((column) => (
            <section 
              key={column.id} 
              className="bg-card border border-border shadow-sm rounded-2xl flex flex-col min-w-[360px] w-[380px]"
              style={{ height: boardHeight }}
            >
              {/* Sticky Header */}
              <header className="sticky top-0 z-10 bg-card px-3 pt-3 pb-2 border-b border-border rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">{column.title}</h2>
                  <span className="inline-flex items-center h-6 px-2.5 rounded-full text-sm bg-primary/10 text-primary font-medium border border-primary/20">
                    {column.count}
                  </span>
                </div>
                <div className="text-xs text-foreground/60">
                  Ø Antwortzeit: {column.avgResponse}
                </div>
              </header>

              {/* Cards */}
              <div className={`p-3 space-y-3 overflow-y-auto ${density === "Kompakt" ? "space-y-2" : ""}`}>
                {candidatesData[column.id as keyof typeof candidatesData]?.length > 0 ? (
                  candidatesData[column.id as keyof typeof candidatesData]?.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      lane={column.id}
                      onAction={handleCandidateAction}
                    />
                  ))
                ) : (
                  <div className="text-sm text-foreground/40 italic text-center py-8">
                    Keine Kandidaten
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}