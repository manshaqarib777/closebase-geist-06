import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlotPickerModal } from "@/components/applications/slot-picker-modal";
import { 
  LayoutGrid, 
  Table as TableIcon, 
  Search,
  MessageSquare,
  Calendar,
  Eye,
  MoreVertical,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  DragOverEvent,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from "@/hooks/use-toast";
import { PipelineOverview } from "@/components/ui/pipeline-overview";
import { PipelineStepBar } from "@/components/ui/pipeline-step-bar";
import { Application, ApplicationStage } from "@/types/hiring";

interface ApplicationUI {
  id: string;
  job_title: string;
  company_name: string;
  company_logo?: string;
  status: ApplicationStage;
  applied_date: Date;
  last_update: Date;
  commission_percent: number;
  deal_band: string;
  fit_score: number;
  reply_rate?: number;
  archived?: boolean;
}

const mockApplications: ApplicationUI[] = [
  {
    id: "1",
    job_title: "Senior Sales Manager",
    company_name: "TechFlow GmbH",
    company_logo: "/placeholder.svg",
    status: "interview",
    applied_date: new Date('2024-01-10'),
    last_update: new Date('2024-01-15'),
    commission_percent: 8,
    deal_band: "€10k-25k",
    fit_score: 92,
    reply_rate: 85
  },
  {
    id: "2",
    job_title: "Business Development Rep",
    company_name: "SalesForce Pro",
    status: "shortlist",
    applied_date: new Date('2024-01-08'),
    last_update: new Date('2024-01-12'),
    commission_percent: 12,
    deal_band: "€5k-10k",
    fit_score: 87,
    reply_rate: 72
  },
  {
    id: "3",
    job_title: "Vertriebsberater",
    company_name: "SolarMax Solutions",
    status: "applied",
    applied_date: new Date('2024-01-12'),
    last_update: new Date('2024-01-12'),
    commission_percent: 6,
    deal_band: "€25k-50k",
    fit_score: 76,
    reply_rate: 60
  },
  {
    id: "4",
    job_title: "Key Account Manager",
    company_name: "DigitalFirst",
    status: "hired",
    applied_date: new Date('2024-01-05'),
    last_update: new Date('2024-01-18'),
    commission_percent: 10,
    deal_band: "€15k-30k",
    fit_score: 94,
    reply_rate: 90
  }
];

const statusTitles: Record<ApplicationStage, string> = {
  applied: "Beworben",
  shortlist: "Shortlist", 
  interview: "Interview",
  offer: "Angebot",
  hired: "Eingestellt",
  rejected: "Abgelehnt"
};

const avgResponseTimes: Record<ApplicationStage, string | undefined> = {
  applied: "2-3 Tage",
  shortlist: "3-5 Tage",
  interview: "1-2 Wochen",
  offer: "3-5 Tage",
  hired: undefined,
  rejected: undefined
};

function formatDate(date: Date) {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "vor 1 Tag";
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  if (diffDays < 30) return `vor ${Math.ceil(diffDays / 7)} Wochen`;
  return date.toLocaleDateString('de-DE');
}

function ApplicationCard({ 
  application, 
  onWithdraw, 
  onMessage, 
  onProposeInterview,
  onArchive,
  isArchived 
}: {
  application: ApplicationUI;
  onWithdraw: (id: string) => void;
  onMessage: (id: string) => void;
  onProposeInterview: (id: string) => void;
  onArchive?: (id: string) => void;
  isArchived?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`tw-card p-4 space-y-3 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={application.company_logo} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
            {application.company_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold leading-5 line-clamp-2 text-foreground">
            {application.job_title}
          </h3>
          <p className="text-sm text-black/60 mt-0.5">
            {application.company_name}
          </p>
        </div>
        
        <Badge variant="secondary" className="flex-shrink-0 text-xs">
          {statusTitles[application.status]}
        </Badge>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="tw-chip-fit text-xs font-medium">
          FIT {application.fit_score}
        </span>
        <span className="tw-chip text-xs">
          {application.deal_band}
        </span>
        {application.reply_rate && (
          <span className="tw-chip text-xs">
            {application.reply_rate}% Antwort
          </span>
        )}
        <span className="ml-auto text-xs text-black/50">
          {formatDate(application.applied_date)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-2">
          <button 
            className="tw-btn-outline text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onMessage(application.id);
            }}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Nachricht
          </button>
          
          <button 
            className="tw-btn-secondary text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onProposeInterview(application.id);
            }}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Interview
          </button>
          
          <button className="tw-btn-ghost text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Details
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!isArchived && onArchive && (
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(application.id);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Archivieren
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onWithdraw(application.id);
              }}
              className="text-destructive"
            >
              <X className="mr-2 h-4 w-4" />
              {isArchived ? "Endgültig löschen" : "Zurückziehen"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}

function KanbanColumn({ 
  id,
  title, 
  status, 
  applications, 
  avgResponseTime,
  onWithdraw, 
  onMessage, 
  onProposeInterview,
  onArchive,
  isDragOver,
  isArchived 
}: {
  id: string;
  title: string;
  status: ApplicationUI['status'];
  applications: ApplicationUI[];
  avgResponseTime?: string;
  onWithdraw: (id: string) => void;
  onMessage: (id: string) => void;
  onProposeInterview: (id: string) => void;
  onArchive?: (id: string) => void;
  isDragOver?: boolean;
  isArchived?: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: `${status}-column`,
  });

  return (
    <section 
      ref={setNodeRef}
      className={`tw-lane ${isDragOver ? 'tw-dropok' : ''}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white px-3 pt-3 pb-2 border-b border-black/5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">{title}</h2>
          <span className="tw-chip text-xs">{applications.length}</span>
        </div>
        {avgResponseTime && (
          <div className="text-xs text-black/60 mt-1">
            Ø Antwortzeit: {avgResponseTime}
          </div>
        )}
      </header>
      
      {/* Cards */}
      <div className="p-3 space-y-3 overflow-y-auto flex-1">
        <SortableContext items={applications} strategy={verticalListSortingStrategy}>
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onWithdraw={onWithdraw}
              onMessage={onMessage}
              onProposeInterview={onProposeInterview}
              onArchive={onArchive}
              isArchived={isArchived}
            />
          ))}
        </SortableContext>
        
        {applications.length === 0 && (
          <div className="text-sm text-black/40 italic text-center py-8">
            Keine Bewerbungen
          </div>
        )}
      </div>
    </section>
  );
}

export default function Applications() {
  const [applications, setApplications] = useState(mockApplications);
  const [view, setView] = useState<'board' | 'table'>('board');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'archived'>('all');
  const [isSlotPickerOpen, setIsSlotPickerOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over && String(over.id).includes('-column')) {
      setDragOverColumn(String(over.id));
    } else {
      setDragOverColumn(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragOverColumn(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeApplication = applications.find(app => app.id === activeId);
    if (!activeApplication) return;

    let newStatus: ApplicationUI['status'];
    if (overId.includes('applied')) newStatus = 'applied';
    else if (overId.includes('shortlist')) newStatus = 'shortlist';
    else if (overId.includes('interview')) newStatus = 'interview';
    else if (overId.includes('offer')) newStatus = 'offer';
    else if (overId.includes('hired')) newStatus = 'hired';
    else if (overId.includes('rejected')) newStatus = 'rejected';
    else return;

    if (newStatus === activeApplication.status) return;

    setApplications(prev =>
      prev.map(app =>
        app.id === activeId
          ? { ...app, status: newStatus, last_update: new Date() }
          : app
      )
    );

    toast({
      title: "Status aktualisiert",
      description: `Bewerbung wurde nach "${statusTitles[newStatus]}" verschoben.`,
    });
  };

  const handleWithdraw = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    toast({
      title: "Bewerbung zurückgezogen",
      description: "Die Bewerbung wurde erfolgreich zurückgezogen.",
    });
  };

  const handleArchive = (id: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, archived: true } : app
      )
    );
    toast({
      title: "Bewerbung archiviert",
      description: "Die Bewerbung wurde erfolgreich archiviert.",
    });
  };

  const handleMessage = (id: string) => {
    window.location.href = `/messages`;
  };

  const handleProposeInterview = (id: string) => {
    setSelectedApplicationId(id);
    setIsSlotPickerOpen(true);
  };

  const handleSubmitSlots = (applicationId: string, slots: string[]) => {
    toast({
      title: "Interview vorgeschlagen",
      description: `3 Zeitslots wurden an den Kandidaten gesendet.`,
    });
    setIsSlotPickerOpen(false);
    setSelectedApplicationId(null);
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'archived') return app.archived;
    return !app.archived;
  });

  const groupedApplications = {
    applied: filteredApplications.filter(app => app.status === 'applied'),
    shortlist: filteredApplications.filter(app => app.status === 'shortlist'),
    interview: filteredApplications.filter(app => app.status === 'interview'),
    offer: filteredApplications.filter(app => app.status === 'offer'),
    hired: filteredApplications.filter(app => app.status === 'hired'),
    rejected: filteredApplications.filter(app => app.status === 'rejected')
  };

  const activeApplication = activeId ? applications.find(app => app.id === activeId) : null;

  // Calculate pipeline statistics
  const pipelineStats = {
    applied: filteredApplications.filter(app => app.status === 'applied').length,
    shortlisted: filteredApplications.filter(app => app.status === 'shortlist').length,
    interview: filteredApplications.filter(app => app.status === 'interview').length,
    hired: filteredApplications.filter(app => app.status === 'hired').length,
    rejected: filteredApplications.filter(app => app.status === 'rejected').length,
    total: filteredApplications.length
  };

  const averageProgress = pipelineStats.total ? Math.round(
    ((pipelineStats.applied * 0) + (pipelineStats.shortlisted * 33) + (pipelineStats.interview * 66) + (pipelineStats.hired * 100)) / pipelineStats.total
  ) : 0;

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bewerbungen</h1>
            <p className="text-muted-foreground mt-1">
              Verwalten Sie Ihre Bewerbungen und verfolgen Sie den Status.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-black/10 rounded-xl p-1">
              <button
                onClick={() => setView('board')}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                  view === 'board' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Board
              </button>
              <button
                onClick={() => setView('table')}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                  view === 'table' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <TableIcon className="h-4 w-4" />
                Tabelle
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Step Bar with Progress */}
        {activeTab === 'all' && (
          <PipelineStepBar stats={pipelineStats} />
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'archived')}>
          <TabsList className="grid w-[300px] grid-cols-2 bg-cb-primary/10">
            <TabsTrigger value="all">Alle Bewerbungen</TabsTrigger>
            <TabsTrigger value="archived">Archiviert</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Toolbar */}
            <div className="tw-card p-3 flex items-center gap-3 flex-wrap">
              <div className="flex-1" />
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Brand / Jobtitel suchen…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="sent">Beworben</SelectItem>
                  <SelectItem value="shortlisted">Shortlist</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="hired">Eingestellt</SelectItem>
                  <SelectItem value="rejected">Abgelehnt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Kanban Board */}
            {view === 'board' && (
              <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-flow-col auto-cols-[360px] gap-5 overflow-x-auto pb-2">
                   <KanbanColumn
                     id="applied-column"
                     title="Beworben"
                     status="applied"
                     applications={groupedApplications.applied}
                     avgResponseTime={avgResponseTimes.applied}
                    onWithdraw={handleWithdraw}
                    onMessage={handleMessage}
                    onProposeInterview={handleProposeInterview}
                    onArchive={handleArchive}
                    isDragOver={dragOverColumn === 'applied-column'}
                  />
                   <KanbanColumn
                     id="shortlist-column"
                     title="Shortlist"
                     status="shortlist"
                     applications={groupedApplications.shortlist}
                     avgResponseTime={avgResponseTimes.shortlist}
                    onWithdraw={handleWithdraw}
                    onMessage={handleMessage}
                    onProposeInterview={handleProposeInterview}
                    onArchive={handleArchive}
                    isDragOver={dragOverColumn === 'shortlist-column'}
                  />
                  <KanbanColumn
                    id="interview-column"
                    title="Interview"
                    status="interview"
                    applications={groupedApplications.interview}
                    avgResponseTime={avgResponseTimes.interview}
                    onWithdraw={handleWithdraw}
                    onMessage={handleMessage}
                    onProposeInterview={handleProposeInterview}
                    onArchive={handleArchive}
                    isDragOver={dragOverColumn === 'interview-column'}
                  />
                  <KanbanColumn
                    id="hired-column"
                    title="Eingestellt"
                    status="hired"
                    applications={groupedApplications.hired}
                    onWithdraw={handleWithdraw}
                    onMessage={handleMessage}
                    onProposeInterview={handleProposeInterview}
                    onArchive={handleArchive}
                    isDragOver={dragOverColumn === 'hired-column'}
                  />
                  <KanbanColumn
                    id="rejected-column"
                    title="Abgelehnt"
                    status="rejected"
                    applications={groupedApplications.rejected}
                    onWithdraw={handleWithdraw}
                    onMessage={handleMessage}
                    onProposeInterview={handleProposeInterview}
                    onArchive={handleArchive}
                    isDragOver={dragOverColumn === 'rejected-column'}
                  />
                </div>

                <DragOverlay>
                  {activeApplication && (
                    <ApplicationCard
                      application={activeApplication}
                      onWithdraw={handleWithdraw}
                      onMessage={handleMessage}
                      onProposeInterview={handleProposeInterview}
                    />
                  )}
                </DragOverlay>
              </DndContext>
            )}

            {view === 'table' && (
              <div className="tw-card p-6 text-center">
                <p className="text-muted-foreground">Tabellen-Ansicht wird implementiert...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-6">
            <div className="tw-card p-6">
              <h3 className="text-lg font-semibold mb-4">Archivierte Bewerbungen</h3>
              {filteredApplications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Keine archivierten Bewerbungen vorhanden.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredApplications.map((application) => (
                    <div key={application.id} className="tw-card p-4 space-y-3 opacity-75">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={application.company_logo} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {application.company_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-semibold leading-5 line-clamp-2 text-foreground">
                            {application.job_title}
                          </h3>
                          <p className="text-sm text-black/60 mt-0.5">
                            {application.company_name}
                          </p>
                        </div>
                        
                        <Badge variant="secondary" className="flex-shrink-0 text-xs">
                          {statusTitles[application.status]}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="tw-chip-fit text-xs font-medium">
                          FIT {application.fit_score}
                        </span>
                        <span className="tw-chip text-xs">
                          {application.deal_band}
                        </span>
                        {application.reply_rate && (
                          <span className="tw-chip text-xs">
                            {application.reply_rate}% Antwort
                          </span>
                        )}
                        <span className="ml-auto text-xs text-black/50">
                          {formatDate(application.applied_date)}
                        </span>
                      </div>

                      <div className="flex items-center justify-end pt-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => handleWithdraw(application.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Endgültig löschen
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        {/* Slot Picker Modal */}
        {selectedApplicationId && (
          <SlotPickerModal
            isOpen={isSlotPickerOpen}
            onClose={() => {
              setIsSlotPickerOpen(false);
              setSelectedApplicationId(null);
            }}
            applicationId={selectedApplicationId}
            onSubmit={handleSubmitSlots}
          />
        )}
      </div>
    </AppLayout>
  );
}