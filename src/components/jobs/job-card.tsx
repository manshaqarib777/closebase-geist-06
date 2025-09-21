import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FitScoreChip } from "@/components/ui/fit-score-chip";
import { StatusBadge } from "@/components/ui/status-badge";
import { JobChip } from "@/components/ui/job-chips";
import { Bookmark, MapPin } from "lucide-react";
import { ApplyButton } from "@/components/jobs/apply-button";

interface Job {
  id: string;
  title: string;
  company_name: string;
  logo?: string;
  location?: string;
  role_needed: string;
  industries: string[];
  sales_cycle_band: string;
  leads_type: string;
  avg_product_cost_band: string;
  avg_commission_percent: number;
  avg_commission_eur?: number;
  weekly_hours_needed: number;
  employment_type: string;
  fit_score: number;
  fit_reasons: string[];
  boost_until?: Date;
  is_bookmarked?: boolean;
}

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onBookmark: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const roleLabels: Record<string, string> = {
  setter: 'Setter',
  closer: 'Closer',
  consultant: 'Berater',
  full_cycle: 'Full Cycle'
};

const industryLabels: Record<string, string> = {
  insurance: 'Versicherung',
  finance: 'Finanz',
  marketing: 'Marketing',
  social_media: 'Social Media',
  digital_services: 'Digital Services',
  ecommerce: 'E-Commerce',
  photovoltaic: 'Photovoltaik',
  consulting: 'Beratung',
  energy: 'Energie',
  real_estate: 'Immobilien',
  other: 'Sonstige'
};

const cycleLabels: Record<string, string> = {
  'd_1_7': '1-7 Tage',
  'w_1_4': '1-4 Wochen',
  'm_1_2': '1-2 Monate',
  'm_2_6': '2-6 Monate',
  'm_6_12': '6-12 Monate'
};

const leadsLabels: Record<string, string> = {
  warm: 'Warm Leads',
  cold: 'Cold Leads'
};

const employmentLabels: Record<string, string> = {
  freelance: 'Freelance',
  employee: 'Angestellt'
};

const costBandLabels: Record<string, string> = {
  '500_5000': '€500-5k',
  '5001_10000': '€5k-10k',
  '10001_25000': '€10k-25k',
  '25001_50000': '€25k-50k',
  'gt_50001': '>€50k'
};

export function JobCard({ job, onApply, onBookmark }: JobCardProps) {
  const isBoosted = job.boost_until && new Date(job.boost_until) > new Date();

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start gap-6">
        <div className="flex gap-4 items-start flex-1">
          <Avatar className="h-12 w-12">
            <AvatarImage src={job.logo} />
            <AvatarFallback>{job.company_name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-heading font-semibold text-foreground truncate">
              {job.title}
            </h3>
            <div className="text-sm text-muted-foreground font-ui">
              {job.company_name}
            </div>
            {job.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </div>
            )}
            
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <Badge variant="default">{roleLabels[job.role_needed]}</Badge>
              {job.industries.slice(0, 3).map((industry) => (
                <Badge key={industry} variant="secondary">
                  {industryLabels[industry]}
                </Badge>
              ))}
              <Badge variant="outline">{cycleLabels[job.sales_cycle_band]}</Badge>
              <Badge variant="outline">{leadsLabels[job.leads_type]}</Badge>
            </div>
            
            {/* Key Data - Colorful Chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {job.avg_commission_percent && (
                <JobChip variant="violet">
                  Ø Prov. {job.avg_commission_percent}%
                </JobChip>
              )}
              {job.weekly_hours_needed && (
                <JobChip variant="blue">
                  {job.weekly_hours_needed}h/Woche
                </JobChip>
              )}
              {job.leads_type && (
                <JobChip variant="green">
                  {leadsLabels[job.leads_type]}
                </JobChip>
              )}
              {job.sales_cycle_band && (
                <JobChip variant="orange">
                  {cycleLabels[job.sales_cycle_band]}
                </JobChip>
              )}
              {job.avg_commission_eur && (
                <JobChip variant="violet">
                  Ø {formatCurrency(job.avg_commission_eur)}
                </JobChip>
              )}
            </div>
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-end gap-2">
            {isBoosted && (
              <StatusBadge variant="boosted">Boosted</StatusBadge>
            )}
            <FitScoreChip 
              score={job.fit_score} 
              reasons={job.fit_reasons}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onBookmark(job.id)}
              className={job.is_bookmarked ? "text-cb-primary" : ""}
            >
              <Bookmark className={`h-4 w-4 ${job.is_bookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" asChild>
              <a href={`/jobs/${job.id}`}>Details</a>
            </Button>
            <ApplyButton job={job} onApply={onApply} />
          </div>
        </div>
      </div>
    </Card>
  );
}