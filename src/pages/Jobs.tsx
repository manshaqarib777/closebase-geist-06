import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobCard } from "@/components/jobs/job-card";
import { JobFilters, type JobFilters as JobFiltersType } from "@/components/jobs/job-filters";
import { ApplyModal } from "@/components/jobs/apply-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal } from "lucide-react";

// Mock data with screening questions
const mockJobs = [
  {
    id: "1",
    title: "Senior Sales Manager",
    company_name: "TechFlow GmbH",
    logo: "/placeholder.svg",
    location: "Berlin",
    role_needed: "closer",
    industries: ["insurance", "finance"],
    sales_cycle_band: "m_1_2",
    leads_type: "warm",
    avg_product_cost_band: "10001_25000",
    avg_commission_percent: 8,
    avg_commission_eur: 2400,
    weekly_hours_needed: 30,
    employment_type: "freelance",
    fit_score: 92,
    fit_reasons: ["Erfahrung im Finanzbereich", "Hohe Conversion Rate", "Branchenkenntnisse"],
    boost_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    is_bookmarked: true,
    screening_questions: [
      "Wie viele Jahre Erfahrung haben Sie im Versicherungsvertrieb?",
      "Welche CRM-Systeme haben Sie bereits verwendet?"
    ],
    status: "published"
  },
  {
    id: "2", 
    title: "Business Development Representative",
    company_name: "SalesForce Pro",
    logo: "/placeholder.svg",
    role_needed: "setter",
    industries: ["marketing", "digital_services"],
    sales_cycle_band: "w_1_4",
    leads_type: "cold",
    avg_product_cost_band: "5001_10000",
    avg_commission_percent: 12,
    avg_commission_eur: 1800,
    weekly_hours_needed: 25,
    employment_type: "employee",
    fit_score: 78,
    fit_reasons: ["Lead Generation Expertise", "CRM Kenntnisse"],
    is_bookmarked: false,
    status: "published"
  },
  {
    id: "3",
    title: "Vertriebsberater Photovoltaik",
    company_name: "SolarMax Solutions",
    logo: "/placeholder.svg",
    location: "München",
    role_needed: "full_cycle",
    industries: ["photovoltaic", "energy"],
    sales_cycle_band: "m_2_6",
    leads_type: "warm",
    avg_product_cost_band: "25001_50000",
    avg_commission_percent: 6,
    avg_commission_eur: 3200,
    weekly_hours_needed: 40,
    employment_type: "freelance",
    fit_score: 85,
    fit_reasons: ["Technisches Verständnis", "Beratungserfahrung", "Nachhaltigkeit"],
    is_bookmarked: false,
    screening_questions: ["Haben Sie Erfahrung im Bereich erneuerbare Energien?"],
    status: "published"
  }
];

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<JobFiltersType>({
    roles: [],
    industries: [],
    avg_product_cost_band: [],
    leads_type: [],
    sales_cycle_band: [],
    employment_type: [],
    only_new: false,
    sort: 'top'
  });
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeJobsTab, setActiveJobsTab] = useState<'all' | 'saved'>('all');

  // Load filters from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('jobs.filters.v1');
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters));
      } catch (e) {
        // Ignore invalid JSON
      }
    }
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem('jobs.filters.v1', JSON.stringify(filters));
  }, [filters]);

  const handleApply = (job: typeof mockJobs[0]) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleBookmark = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, is_bookmarked: !job.is_bookmarked }
        : job
    ));
  };

  const getActiveFiltersCount = () => {
    return (
      filters.roles.length +
      filters.industries.length +
      filters.avg_product_cost_band.length +
      filters.leads_type.length +
      filters.sales_cycle_band.length +
      filters.employment_type.length +
      (filters.only_new ? 1 : 0) +
      (filters.hours_min ? 1 : 0) +
      (filters.hours_max ? 1 : 0) +
      (filters.one_time_payment_min ? 1 : 0)
    );
  };

  const filteredJobs = jobs.filter(job => {
    if (activeJobsTab === 'saved') return job.is_bookmarked;
    return true;
  });

  const breadcrumbs = [
    { label: "Übersicht", href: "/" },
    { label: "Jobs" }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Jobs</h1>
            <p className="text-muted-foreground font-ui">
              Entdecken Sie passende Vertriebspositionen
            </p>
          </div>
        </div>

        {/* Job Tabs */}
        <Tabs value={activeJobsTab} onValueChange={(value) => setActiveJobsTab(value as 'all' | 'saved')}>
          <TabsList className="grid w-full max-w-sm grid-cols-2">
            <TabsTrigger value="all" className="text-sm">
              Alle Jobs ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-sm">
              Gespeichert ({jobs.filter(job => job.is_bookmarked).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeJobsTab} className="mt-6">
            {/* Search and Sort */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Jobs suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={filters.sort} onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Empfohlen</SelectItem>
                    <SelectItem value="newest">Neueste</SelectItem>
                    <SelectItem value="commission_pct">Provision %</SelectItem>
                    <SelectItem value="commission_eur">Provision €</SelectItem>
                    <SelectItem value="fit">Fit Score</SelectItem>
                  </SelectContent>
                </Select>

                <JobFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  activeFiltersCount={getActiveFiltersCount()}
                />
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={handleApply}
                    onBookmark={handleBookmark}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto max-w-md">
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                      {activeJobsTab === 'saved' ? 'Keine gespeicherten Jobs' : 'Keine Treffer'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {activeJobsTab === 'saved' 
                        ? 'Sie haben noch keine Jobs gespeichert.'
                        : 'Keine Jobs gefunden, die Ihren Suchkriterien entsprechen.'
                      }
                    </p>
                    {activeJobsTab !== 'saved' && (
                      <Button
                        variant="outline"
                        onClick={() => setFilters({
                          roles: [],
                          industries: [],
                          avg_product_cost_band: [],
                          leads_type: [],
                          sales_cycle_band: [],
                          employment_type: [],
                          only_new: false,
                          sort: 'top'
                        })}
                      >
                        Filter zurücksetzen
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Results count */}
            {filteredJobs.length > 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} gefunden
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ApplyModal
        job={selectedJob}
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setSelectedJob(null);
        }}
      />
    </AppLayout>
  );
}