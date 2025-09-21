import React from "react";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "./application-card";
import { LayoutGrid } from "lucide-react";

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

interface KanbanColumnProps {
  id: string;
  title: string;
  status: Application['status'];
  applications: Application[];
  avgResponseTime?: string;
  onWithdraw: (id: string) => void;
  onMessage: (id: string) => void;
  onProposeInterview: (id: string) => void;
  onSaveJob: (id: string) => void;
  isDragOver?: boolean;
}

export function KanbanColumn({ 
  id,
  title, 
  status, 
  applications, 
  avgResponseTime,
  onWithdraw, 
  onMessage, 
  onProposeInterview,
  onSaveJob,
  isDragOver 
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `${status}-column`,
  });

  return (
    <section 
      ref={setNodeRef}
      className={`tw-lane ${isDragOver ? 'tw-dropok' : ''}`}
    >
      {/* Sticky Lane Header */}
      <header className="sticky top-0 z-10 bg-white px-3 pt-3 pb-2 border-b border-black/5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          <span className="tw-chip">{applications.length}</span>
        </div>
        {avgResponseTime && (
          <div className="text-xs text-black/60">
            Ø Antwortzeit: {avgResponseTime}
          </div>
        )}
      </header>
      
      {/* Scrollable Card Area */}
      <div className="p-3 space-y-3 overflow-y-auto flex-1">
        <SortableContext items={applications} strategy={verticalListSortingStrategy}>
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onWithdraw={onWithdraw}
              onMessage={onMessage}
              onProposeInterview={onProposeInterview}
              onSaveJob={onSaveJob}
            />
          ))}
        </SortableContext>
        
        {/* Drop Zone Highlight */}
        {isDragOver && (
          <div className="border-2 border-dashed border-primary/50 bg-primary/5 rounded-lg p-4 text-center">
            <span className="text-sm text-primary font-medium">
              Hier ablegen für "{title}"
            </span>
          </div>
        )}
        
        {/* Empty State */}
        {applications.length === 0 && !isDragOver && (
          <div className="text-sm text-black/40 italic text-center py-8">
            Keine Bewerbungen
          </div>
        )}
      </div>
    </section>
  );
}