import { Avatar } from "@/components/ui/avatar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { JobChip } from "@/components/ui/job-chips";
import { FitTooltip } from "@/components/ui/fit-tooltip";
import { ApplicationSkeleton, JobCardSkeleton } from "@/components/ui/skeleton";
import { MessageSquare, Bookmark, BookmarkCheck, Calendar, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function DashboardMain() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set([1]));

  // Mock data
  const recentApps = [
    {
      id: 1,
      jobTitle: "Senior Sales Manager",
      company: "TechCorp GmbH",
      stage: "interview",
      stageLabel: "Interview",
      appliedAt: "vor 2 Tagen",
      logo: null
    },
    {
      id: 2,
      jobTitle: "Account Executive",
      company: "StartupXYZ",
      stage: "shortlist",
      stageLabel: "Shortlist",
      appliedAt: "vor 1 Woche",
      logo: null
    }
  ];

  const getStageClass = (stage: string) => {
    switch (stage) {
      case "beworben": return "tw-stage-beworben";
      case "shortlist": return "tw-stage-shortlist";
      case "interview": return "tw-stage-interview";
      case "eingestellt": return "tw-stage-eingestellt";
      default: return "tw-chip";
    }
  };

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const upcomingInterviews = [
    {
      id: 1,
      jobTitle: "Senior Sales Manager",
      company: "TechCorp GmbH",
      type: "Interview",
      date: "19.09. 14:00"
    }
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: "Enterprise Sales Manager",
      company: "Global Solutions AG",
      location: "München",
      hours: "40",
      commission: "12",
      leadType: "Warm",
      salesCycle: "3-6 Monate",
      fit: 92
    },
    {
      id: 2,
      title: "SaaS Account Executive",
      company: "CloudTech",
      location: "Remote",
      hours: "32",
      commission: "15",
      leadType: "Inbound",
      salesCycle: "1-3 Monate",
      fit: 88
    }
  ];

  return (
    <div className="lg:col-span-8 space-y-5">
      {/* Meine Bewerbungen */}
      <div className="tw-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-semibold">Meine Bewerbungen</h2>
          <button 
            onClick={() => navigate('/applications')}
            className="text-primary text-sm font-ui"
          >
            alle anzeigen →
          </button>
        </div>
        <ul className="divide-y divide-black/5">
          {recentApps.length > 0 ? recentApps.map((app) => (
            <li key={app.id}>
              <div className="grid grid-cols-[40px_1fr_auto] gap-3 items-center py-3">
                <Avatar className="w-10 h-10">
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                    {app.company.charAt(0)}
                  </div>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <button 
                      onClick={() => navigate(`/applications/${app.id}`)}
                      className="focus-ring font-medium truncate font-ui hover:text-primary"
                    >
                      {app.jobTitle}
                    </button>
                    <span className={getStageClass(app.stage)}>{app.stageLabel}</span>
                  </div>
                  <div className="text-sm text-foreground/60 truncate font-ui">
                    {app.company} · beworben {app.appliedAt}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="focus-ring tw-btn-outline"
                    onClick={() => navigate('/messages')}
                    aria-label="Nachricht senden"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button 
                    className="focus-ring tw-btn-secondary"
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </li>
          )) : (
            <li className="text-sm text-foreground/60 py-4 font-ui">
              Noch keine Bewerbungen – schau dir{" "}
              <button 
                onClick={() => navigate('/jobs')}
                className="focus-ring text-primary underline"
              >
                Jobs
              </button>{" "}
              an.
            </li>
          )}
        </ul>
      </div>

      {/* Anstehende Interviews */}
      <div className="tw-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-semibold">Anstehende Interviews</h2>
          <button 
            onClick={() => navigate('/calendar')}
            className="text-sm text-foreground/60 font-ui"
          >
            Kalender öffnen
          </button>
        </div>
        <ul className="divide-y divide-black/5">
          {upcomingInterviews.length > 0 ? upcomingInterviews.map((interview) => (
            <li key={interview.id} className="py-3 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate font-ui">{interview.jobTitle}</div>
                <div className="text-sm text-foreground/60 truncate font-ui">
                  {interview.company} · {interview.type}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-foreground/80 font-ui">{interview.date}</div>
                <div className="flex gap-2">
                  <button 
                    className="focus-ring tw-btn-outline"
                    aria-label="Termin bestätigen"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    className="focus-ring tw-btn-secondary"
                    aria-label="Neuen Slot vorschlagen"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          )) : (
            <li className="text-sm text-foreground/60 py-4 font-ui">
              Keine Termine in den nächsten 7 Tagen.
            </li>
          )}
        </ul>
      </div>

      {/* Empfohlene Jobs */}
      <div className="tw-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-semibold">Empfohlene Jobs</h2>
          <button 
            onClick={() => navigate('/jobs')}
            className="text-sm text-foreground/60 font-ui"
          >
            mehr Jobs
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
            <article key={job.id} className="tw-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-medium line-clamp-2 font-ui">{job.title}</div>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="focus-ring h-8 w-8 rounded-full hover:bg-black/5 flex items-center justify-center ml-2"
                      aria-pressed={savedJobs.has(job.id)}
                      aria-label={savedJobs.has(job.id) ? "Gespeichert" : "Job speichern"}
                    >
                      {savedJobs.has(job.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-foreground/60" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm text-foreground/60 font-ui">{job.company}</div>
                </div>
                <div className="relative">
                  <ProgressRing value={job.fit} size={40} label="FIT" />
                  <FitTooltip className="absolute -bottom-1 -right-1" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.location && <span className="tw-chip">{job.location}</span>}
                {job.hours && (
                  <JobChip variant="blue">{job.hours}h/Woche</JobChip>
                )}
                {job.commission && (
                  <JobChip variant="violet">Ø Prov. {job.commission}%</JobChip>
                )}
                {job.leadType && (
                  <JobChip variant="green">{job.leadType} Leads</JobChip>
                )}
                {job.salesCycle && (
                  <JobChip variant="orange">{job.salesCycle}</JobChip>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="focus-ring tw-btn-secondary flex-1"
                >
                  Details
                </button>
                <button 
                  onClick={() => navigate(`/jobs/${job.id}/apply`)}
                  className="focus-ring tw-btn-outline flex-1"
                >
                  Anfragen
                </button>
              </div>
            </article>
          )) : (
            <div className="text-sm text-foreground/60 font-ui">
              Keine Empfehlungen – {" "}
              <button 
                onClick={() => navigate('/assessment')}
                className="focus-ring text-primary underline"
              >
                Assessment
              </button>
              {" "}/{"  "}
              <button 
                onClick={() => navigate('/profile')}
                className="focus-ring text-primary underline"
              >
                Profil
              </button>
              {" "}ausfüllen.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}