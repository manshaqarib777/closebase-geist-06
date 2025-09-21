import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { FitScoreChip } from "@/components/ui/fit-score-chip";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ApplyModal } from "@/components/jobs/apply-modal";
import { MapPin, Clock, Euro, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const recommendedJobs = [
  {
    id: 1,
    title: "Senior Account Manager",
    company: "InnovateTech",
    location: "München",
    type: "SaaS",
    commission: "25-40k",
    salesCycle: "3-6 Monate", 
    fitScore: 94,
    fitReasons: [
      "5+ Jahre B2B SaaS Erfahrung",
      "Erfahrung mit Enterprise Kunden",
      "Track Record in München"
    ],
    isBoosted: true,
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=60&h=60&fit=crop&crop=entropy"
  },
  {
    id: 2,
    title: "Business Development Lead",
    company: "ScaleUp Solutions",
    location: "Berlin",
    type: "FinTech",
    commission: "30-50k",
    salesCycle: "2-4 Monate",
    fitScore: 87,
    fitReasons: [
      "Fintech Background",
      "Startup Mentalität",
      "Lead Generation Skills"
    ],
    isBoosted: false,
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop&crop=entropy"
  },
  {
    id: 3,
    title: "Sales Director DACH",
    company: "Global Enterprise",
    location: "Frankfurt",
    type: "Enterprise",
    commission: "40-80k",
    salesCycle: "6-12 Monate",
    fitScore: 82,
    fitReasons: [
      "Leadership Erfahrung",
      "DACH Markt Expertise", 
      "Enterprise Sales"
    ],
    isBoosted: false,
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=60&h=60&fit=crop&crop=entropy"
  }
];

export function RecommendedJobs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<{
    id: string;
    title: string;
    company_name: string;
    logo?: string;
  } | null>(null);

  const handleViewDetails = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleApplyToJob = (job: typeof recommendedJobs[0]) => {
    setSelectedJob({
      id: job.id.toString(),
      title: job.title,
      company_name: job.company,
      logo: job.logo
    });
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  return (
    <GlassCard variant="surface" className="mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Empfohlene Jobs
        </h2>
        <p className="text-sm text-muted-foreground font-ui">
          Basierend auf deinem Profil und deinen Präferenzen
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendedJobs.map((job) => (
          <div 
            key={job.id}
            className="relative bg-card border border-border/50 rounded-lg p-6 hover:shadow-cb-md transition-smooth"
          >
            {job.isBoosted && (
              <StatusBadge variant="boosted" className="absolute top-3 right-3">
                Boosted
              </StatusBadge>
            )}
            
            <div className="flex items-start gap-4 mb-4">
              <img 
                src={job.logo}
                alt={job.company}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-ui font-semibold text-foreground mb-1">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm font-ui">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="font-medium text-foreground">{job.type}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm font-ui">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Euro className="w-4 h-4" />
                  {job.commission}
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {job.salesCycle}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <FitScoreChip 
                score={job.fitScore} 
                reasons={job.fitReasons}
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 font-ui"
                onClick={() => handleViewDetails(job.id)}
              >
                Details
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-cb-primary hover:bg-cb-primary-700 text-white font-ui"
                onClick={() => handleApplyToJob(job)}
              >
                Anfragen
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <ApplyModal 
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={handleCloseModal}
      />
    </GlassCard>
  );
}