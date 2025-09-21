import React from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FitScoreChip } from "@/components/ui/fit-score-chip";
import { 
  GripVertical, 
  MessageSquare, 
  Calendar, 
  Eye, 
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Application {
  id: string;
  job_title: string;
  company_name: string;
  company_logo?: string;
  status: 'sent' | 'shortlisted' | 'interview' | 'hired' | 'rejected';
  applied_date: Date;
  last_update: Date;
  commission_percent: number;
  deal_band: string;
  fit_score: number;
  reply_rate?: number;
  is_boosted?: boolean;
}

interface ApplicationCardProps {
  application: Application;
  onWithdraw: (id: string) => void;
  onMessage: (id: string) => void;
  onProposeInterview: (id: string) => void;
  onSaveJob: (id: string) => void;
}

const statusLabels = {
  sent: "Beworben",
  shortlisted: "Shortlist", 
  interview: "Interview",
  hired: "Eingestellt",
  rejected: "Abgelehnt"
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

export function ApplicationCard({ 
  application, 
  onWithdraw, 
  onMessage, 
  onProposeInterview,
  onSaveJob 
}: ApplicationCardProps) {
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
    opacity: isDragging ? 0.8 : 1,
  };

  const canWithdraw = application.status === 'sent' || application.status === 'shortlisted';

  return (
    <article 
      ref={setNodeRef}
      style={style}
      className="bg-card border border-border rounded-lg p-4 space-y-3 group shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
      aria-label="Bewerbungskarte"
      draggable="true"
      {...attributes}
      {...listeners}
    >

      {/* Top Row: Avatar, Title, Company, Status */}
      <div className="tw-flex tw-items-start tw-gap-3">
        <Avatar className="tw-h-10 tw-w-10 tw-shrink-0">
          <AvatarImage src={application.company_logo || "/placeholder.svg"} />
          <AvatarFallback className="tw-text-sm tw-font-medium">
            {application.company_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="tw-flex-1 tw-min-w-0">
          <h3 className="tw-text-[15px] tw-font-semibold tw-leading-5 tw-line-clamp-2">
            {application.job_title}
          </h3>
          <div className="text-sm text-muted-foreground">
            {application.company_name}
          </div>
        </div>
        
        <Badge 
          variant="secondary" 
          className="tw-shrink-0 tw-text-xs"
        >
          {statusLabels[application.status]}
        </Badge>
      </div>

      {/* Meta Row: FIT Score, Deal Band, Reply Rate */}
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="secondary" className="bg-primary/10 text-primary font-medium text-xs">
          FIT {application.fit_score}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {application.deal_band}
        </Badge>
        {application.reply_rate && (
          <Badge variant="outline" className="text-xs">
            {application.reply_rate}% Antwort
          </Badge>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          beworben {formatDate(application.applied_date)}
        </span>
      </div>

      {/* Action Bar - Always Visible */}
      <div className="tw-flex tw-items-center tw-justify-between">
        <div className="tw-flex tw-flex-wrap tw-gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="tw-text-xs tw-h-7 tw-px-2"
            onClick={(e) => {
              e.stopPropagation();
              onMessage(application.id);
            }}
          >
            <MessageSquare className="tw-h-3 tw-w-3 tw-mr-1" />
            Nachricht
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm"
            className="tw-text-xs tw-h-7 tw-px-2"
            onClick={(e) => {
              e.stopPropagation();
              onProposeInterview(application.id);
            }}
          >
            <Calendar className="tw-h-3 tw-w-3 tw-mr-1" />
            Interview
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="tw-text-xs tw-h-7 tw-px-2"
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to job details or open details modal
              window.location.href = `/jobs/${application.id}`;
            }}
          >
            <Eye className="tw-h-3 tw-w-3 tw-mr-1" />
            Details
          </Button>
        </div>

        {/* Kebab Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="tw-h-8 tw-w-8 tw-p-0 tw-text-muted-foreground hover:tw-text-foreground"
            >
              <MoreHorizontal className="tw-h-4 tw-w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="tw-w-48">
            {canWithdraw && (
              <DropdownMenuItem 
                onClick={() => onWithdraw(application.id)}
                className="tw-text-destructive focus:tw-text-destructive"
              >
                Bewerbung zurückziehen
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}