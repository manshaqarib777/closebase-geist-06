import { useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FitScoreChip } from "@/components/ui/fit-score-chip";
import { StatusBadge } from "@/components/ui/status-badge";
import { ApplyModal } from "@/components/jobs/apply-modal";
import { 
  MapPin, 
  Clock, 
  Euro, 
  Users, 
  Target, 
  Bookmark, 
  Share2,
  CheckCircle,
  ArrowRight
} from "lucide-react";

// Mock job data
const mockJobDetail = {
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
  is_bookmarked: false,
  
  // Extended details
  short_pitch: "Wir suchen einen erfahrenen Sales Manager für unsere schnell wachsende Fintech-Sparte. Sie übernehmen die Verantwortung für hochwertige B2B-Deals und bauen langfristige Kundenbeziehungen auf.",
  
  product_description: "Unsere KI-gestützte Versicherungsplattform revolutioniert die Art, wie Unternehmen ihre Versicherungsportfolios verwalten. Mit über 500 Unternehmenskunden und einem durchschnittlichen Deal-Volumen von €15.000 bieten wir innovative Lösungen für komplexe Versicherungsherausforderungen.",
  
  leads_process: "Sie erhalten täglich 5-8 qualifizierte Warm Leads über unser CRM-System. Unsere Marketing-Abteilung führt bereits Erstgespräche durch, sodass Sie direkt in die Bedarfsanalyse einsteigen können. Der typische Sales-Cycle beträgt 1-2 Monate.",
  
  compensation: {
    base_commission: 8,
    bonus_structure: "Zusätzlich 2% Bonus bei Übererfüllung der monatlichen Ziele",
    avg_monthly_deals: 8,
    avg_deal_value: 15000,
    payment_cycle: "Monatlich"
  },
  
  requirements: [
    "Mindestens 3 Jahre Erfahrung im B2B-Vertrieb",
    "Nachgewiesene Erfolge bei Deal-Größen >€10k",
    "Erfahrung mit CRM-Systemen (HubSpot bevorzugt)",
    "Verhandlungsgeschick und Abschlussstärke",
    "Sehr gute Deutschkenntnisse"
  ],
  
  framework: {
    working_hours: "30 Stunden/Woche, flexible Zeiten",
    remote_work: "100% Remote oder Hybrid (Berlin Office)",
    tools_provided: "Laptop, CRM-Zugang, Telefon-System",
    training: "2-wöchiges Onboarding + monatliche Schulungen"
  },
  
  why_us: [
    "Marktführer in der Insurtech-Branche",
    "Überdurchschnittliche Provisionen",
    "Flache Hierarchien und schnelle Entscheidungen",
    "Moderne Tools und Tech-Stack",
    "Starkes Marketing-Support"
  ],
  
  next_steps: [
    "Bewerbung über Closebase",
    "Kurzes Kennenlern-Gespräch (15 Min)",
    "Fachliches Interview mit Sales Director",
    "Probetag mit echten Kunden",
    "Vertragsabschluss und Onboarding"
  ],
  
  company_info: {
    founded: 2019,
    employees: "50-100",
    revenue: "€5-10M ARR",
    funding: "Series A",
    website: "techflow.de"
  }
};

export default function JobDetail() {
  const { id } = useParams();
  const [job] = useState(mockJobDetail);
  const [isBookmarked, setIsBookmarked] = useState(job.is_bookmarked);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const breadcrumbs = [
    { label: "Übersicht", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: job.title }
  ];

  const isBoosted = job.boost_until && new Date(job.boost_until) > new Date();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex gap-6 items-start">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={job.logo} />
                  <AvatarFallback className="text-lg">{job.company_name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl font-heading font-bold text-foreground">
                      {job.title}
                    </h1>
                    <p className="text-lg text-muted-foreground font-ui">
                      {job.company_name}
                    </p>
                    {job.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {isBoosted && (
                      <StatusBadge variant="boosted">Boosted</StatusBadge>
                    )}
                    <Badge>{job.role_needed === "closer" ? "Closer" : job.role_needed}</Badge>
                    {job.industries.slice(0, 2).map((industry) => (
                      <Badge key={industry} variant="secondary">
                        {industry === "insurance" ? "Versicherung" : 
                         industry === "finance" ? "Finanz" : industry}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4">
                <FitScoreChip score={job.fit_score} reasons={job.fit_reasons} />
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={isBookmarked ? "text-cb-primary" : ""}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setIsApplyModalOpen(true)} size="lg">
                    Jetzt bewerben
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Facts */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-cb-primary/10 rounded-lg mb-2 mx-auto">
                      <Euro className="h-6 w-6 text-cb-primary" />
                    </div>
                    <div className="text-lg font-semibold">{job.avg_commission_percent}%</div>
                    <div className="text-xs text-muted-foreground">Provision</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-cb-accent/10 rounded-lg mb-2 mx-auto">
                      <Target className="h-6 w-6 text-cb-accent" />
                    </div>
                    <div className="text-lg font-semibold">{formatCurrency(job.avg_commission_eur || 0)}</div>
                    <div className="text-xs text-muted-foreground">Ø Provision</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-cb-success/10 rounded-lg mb-2 mx-auto">
                      <Clock className="h-6 w-6 text-cb-success" />
                    </div>
                    <div className="text-lg font-semibold">{job.weekly_hours_needed}h</div>
                    <div className="text-xs text-muted-foreground">pro Woche</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-cb-warning/10 rounded-lg mb-2 mx-auto">
                      <Users className="h-6 w-6 text-cb-warning" />
                    </div>
                    <div className="text-lg font-semibold">{job.leads_type === "warm" ? "Warm" : "Cold"}</div>
                    <div className="text-xs text-muted-foreground">Leads</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Short Pitch */}
            <Card>
              <CardHeader>
                <CardTitle>Über diese Position</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {job.short_pitch}
                </p>
              </CardContent>
            </Card>

            {/* Product */}
            <Card>
              <CardHeader>
                <CardTitle>Produkt & Dienstleistung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {job.product_description}
                </p>
              </CardContent>
            </Card>

            {/* Leads & Process */}
            <Card>
              <CardHeader>
                <CardTitle>Leads & Verkaufsprozess</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {job.leads_process}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-cb-surface/80 rounded-lg border border-border/50">
                  <div>
                    <div className="text-sm font-medium text-foreground">Sales Cycle</div>
                    <div className="text-sm text-foreground/70">
                      {job.sales_cycle_band === "m_1_2" ? "1-2 Monate" : job.sales_cycle_band}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Lead-Typ</div>
                    <div className="text-sm text-foreground/70">
                      {job.leads_type === "warm" ? "Warm Leads" : "Cold Leads"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compensation */}
            <Card>
              <CardHeader>
                <CardTitle>Vergütung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Basis-Provision</div>
                    <div className="text-2xl font-bold text-cb-primary">
                      {job.compensation.base_commission}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Ø Monatseinkommen</div>
                    <div className="text-2xl font-bold text-cb-success">
                      {formatCurrency(job.avg_commission_eur || 0)}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Bonus-Struktur</div>
                  <p className="text-sm text-muted-foreground">
                    {job.compensation.bonus_structure}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Ø Deals/Monat:</span> {job.compensation.avg_monthly_deals}
                  </div>
                  <div>
                    <span className="font-medium">Ø Deal-Wert:</span> {formatCurrency(job.compensation.avg_deal_value)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Anforderungen</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-cb-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Framework */}
            <Card>
              <CardHeader>
                <CardTitle>Rahmenbedingungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Arbeitszeit</div>
                    <div className="text-sm text-muted-foreground">{job.framework.working_hours}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Remote-Arbeit</div>
                    <div className="text-sm text-muted-foreground">{job.framework.remote_work}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Ausstattung</div>
                    <div className="text-sm text-muted-foreground">{job.framework.tools_provided}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Schulungen</div>
                    <div className="text-sm text-muted-foreground">{job.framework.training}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Us */}
            <Card>
              <CardHeader>
                <CardTitle>Warum TechFlow?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.why_us.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-cb-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Nächste Schritte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {job.next_steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-cb-primary text-white text-xs font-bold rounded-full flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Über {job.company_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Gegründet</div>
                  <div className="text-sm text-muted-foreground">{job.company_info.founded}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Mitarbeiter</div>
                  <div className="text-sm text-muted-foreground">{job.company_info.employees}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Umsatz</div>
                  <div className="text-sm text-muted-foreground">{job.company_info.revenue}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Finanzierung</div>
                  <div className="text-sm text-muted-foreground">{job.company_info.funding}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Website</div>
                  <a 
                    href={`https://${job.company_info.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cb-primary hover:underline"
                  >
                    {job.company_info.website}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-gradient-primary text-white">
              <CardContent className="p-6 text-center">
                <h3 className="font-heading font-semibold mb-2">
                  Perfekte Übereinstimmung!
                </h3>
                <p className="text-sm text-white/90 mb-4">
                  Diese Position passt zu {job.fit_score}% zu Ihrem Profil.
                </p>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full"
                >
                  Jetzt bewerben
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </AppLayout>
  );
}