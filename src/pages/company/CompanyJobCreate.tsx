import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { JobChip } from "@/components/ui/job-chips";
import { useState } from "react";
import { Eye, AlertTriangle, Users, Euro, Settings, CheckCircle, Clock, Target, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobFormData {
  title: string;
  role: string;
  seniority_min: string;
  employment_type: string;
  weekly_hours: number;
  work_mode: string;
  location: string;
  timezone: string;
  language_required: string;
  industries: string[];
  icp: string;
  price_band: string;
  sales_cycle: string;
  lead_type: string;
  leads_available: { yes: boolean; per_week?: number };
  tools: string[];
  comp_model: string;
  commission_percent?: number;
  commission_eur_year?: number;
  avg_deal_eur?: number;
  one_off_bonus_eur?: number;
  must_haves: string;
  responsibilities: string;
  benefits: string;
  start_date: string;
  engagement: string;
  screening_questions: string[];
  assessment_gate: { require_sci: boolean; min_score?: number };
}

const initialFormData: JobFormData = {
  title: "",
  role: "",
  seniority_min: "",
  employment_type: "",
  weekly_hours: 40,
  work_mode: "",
  location: "",
  timezone: "Europe/Berlin",
  language_required: "",
  industries: [],
  icp: "",
  price_band: "",
  sales_cycle: "",
  lead_type: "",
  leads_available: { yes: false },
  tools: [],
  comp_model: "",
  must_haves: "",
  responsibilities: "",
  benefits: "",
  start_date: "",
  engagement: "",
  screening_questions: ["", ""],
  assessment_gate: { require_sci: false, min_score: 70 }
};

const roleOptions = [
  { value: "setter", label: "Setter" },
  { value: "closer", label: "Closer" },
  { value: "full_cycle", label: "Full-Cycle" },
  { value: "consultant", label: "Consultant" }
];

const seniorityOptions = [
  { value: "rookie", label: "Rookie" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "expert", label: "Expert" }
];

const employmentTypeOptions = [
  { value: "freelance", label: "Freelance" },
  { value: "festanstellung", label: "Festanstellung" }
];

const workModeOptions = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" }
];

const languageOptions = [
  { value: "de-B2", label: "Deutsch B2" },
  { value: "de-C1", label: "Deutsch C1" },
  { value: "de-C2", label: "Deutsch C2" }
];

const industryOptions = [
  "SaaS", "Fintech", "E-Commerce", "Consulting", "Marketing", "PV", "Energie", "Immobilien", "Sonstiges"
];

const icpOptions = [
  { value: "smb", label: "SMB" },
  { value: "midmarket", label: "Mid-Market" },
  { value: "enterprise", label: "Enterprise" }
];

const priceBandOptions = [
  { value: "0.5-5k", label: "€0.5–5k" },
  { value: "5-10k", label: "€5–10k" },
  { value: "10-25k", label: "€10–25k" },
  { value: "25-50k", label: "€25–50k" },
  { value: ">50k", label: ">€50k" }
];

const salesCycleOptions = [
  { value: "1-7d", label: "1–7 Tage" },
  { value: "1-4w", label: "1–4 Wochen" },
  { value: "1-2m", label: "1–2 Monate" },
  { value: "2-6m", label: "2–6 Monate" },
  { value: "6-12m", label: "6–12 Monate" }
];

const leadTypeOptions = [
  { value: "warm", label: "Warm" },
  { value: "kalt", label: "Kalt" },
  { value: "mixed", label: "Mixed" }
];

const toolsOptions = [
  "HubSpot", "Salesforce", "Pipedrive", "Lemlist", "Aircall", "Zoom", "Sonstige"
];

const compModelOptions = [
  { value: "commission_only", label: "Commission-only" },
  { value: "base_plus_commission", label: "Base + Commission" },
  { value: "hourly", label: "Hourly/Day-Rate" }
];

export default function CompanyJobCreate() {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [qualityScore, setQualityScore] = useState(0);

  const calculateQualityScore = (data: JobFormData) => {
    let score = 0;

    // Core fields (40 points)
    if (data.title && data.title.length >= 10 && data.title.length <= 90) score += 8;
    if (data.role) score += 8;
    if (data.industries.length >= 1 && data.industries.length <= 3) score += 8;
    if (data.employment_type) score += 8;
    if (data.language_required) score += 8;

    // Sales context (30 points)
    if (data.icp) score += 6;
    if (data.price_band) score += 6;
    if (data.sales_cycle) score += 6;
    if (data.lead_type) score += 6;
    if (data.comp_model) score += 6;

    // Compensation (20 points)
    if (data.commission_percent || data.commission_eur_year) score += 20;

    // Requirements (10 points)
    const mustHavesBullets = data.must_haves.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).length;
    if (mustHavesBullets >= 3) score += 10;

    return Math.min(100, score);
  };

  const updateFormData = (updates: Partial<JobFormData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    setQualityScore(calculateQualityScore(newData));
  };

  const getScoreBadge = () => {
    if (qualityScore >= 80) return { label: "Exzellent", color: "bg-emerald-500", textColor: "text-white" };
    if (qualityScore >= 60) return { label: "Gut", color: "bg-blue-500", textColor: "text-white" };
    if (qualityScore >= 40) return { label: "Okay", color: "bg-amber-500", textColor: "text-white" };
    return { label: "Verbesserungsbedarf", color: "bg-red-500", textColor: "text-white" };
  };

  const getMissingFields = () => {
    const missing = [];
    if (!formData.title || formData.title.length < 10) missing.push("Stellentitel (10-90 Zeichen)");
    if (!formData.role) missing.push("Rolle");
    if (formData.industries.length === 0) missing.push("Branchen (1-3)");
    if (!formData.icp) missing.push("ICP");
    if (!formData.price_band) missing.push("Preis-Band");
    if (!formData.sales_cycle) missing.push("Sales-Zyklus");
    if (!formData.lead_type) missing.push("Lead-Typ");
    if (!formData.comp_model) missing.push("Vergütungsmodell");
    if (!formData.commission_percent && !formData.commission_eur_year) missing.push("Provision");
    if (!formData.employment_type) missing.push("Beschäftigungsart");
    if (!formData.language_required) missing.push("Deutsch-Level");
    const mustHavesBullets = formData.must_haves.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).length;
    if (mustHavesBullets < 3) missing.push("Muss-Kriterien (min. 3 Bullets)");
    return missing;
  };

  const scoreBadge = getScoreBadge();
  const missingFields = getMissingFields();
  const canSubmit = missingFields.length === 0;

  const handleIndustryToggle = (industry: string, checked: boolean) => {
    if (checked) {
      if (formData.industries.length < 3) {
        updateFormData({ industries: [...formData.industries, industry] });
      }
    } else {
      updateFormData({ industries: formData.industries.filter(i => i !== industry) });
    }
  };

  const handleToolToggle = (tool: string, checked: boolean) => {
    if (checked) {
      updateFormData({ tools: [...formData.tools, tool] });
    } else {
      updateFormData({ tools: formData.tools.filter(t => t !== tool) });
    }
  };

  const handleScreeningQuestionChange = (index: number, value: string) => {
    const questions = [...formData.screening_questions];
    questions[index] = value;
    updateFormData({ screening_questions: questions });
  };

  return (
    <AppLayout 
      breadcrumbs={[
        { label: "Stellenanzeigen", href: "/company/jobs" },
        { label: "Neue Stelle erstellen" }
      ]}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Stellenanzeige erstellen
            </h1>
            <p className="text-muted-foreground font-ui">
              Erstelle eine optimierte Stellenanzeige für besseres Matching.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Grunddaten */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Grunddaten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Stellentitel * (10–90 Zeichen)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="z.B. Senior Sales Consultant B2B"
                    className="mt-1"
                    maxLength={90}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{formData.title.length}/90 Zeichen</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Rolle *</Label>
                    <Select value={formData.role} onValueChange={(value) => updateFormData({ role: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Wähle Rolle" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Seniority (min.) *</Label>
                    <Select value={formData.seniority_min} onValueChange={(value) => updateFormData({ seniority_min: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Wähle Mindest-Seniority" />
                      </SelectTrigger>
                      <SelectContent>
                        {seniorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>Beschäftigungsart *</Label>
                    <Select value={formData.employment_type} onValueChange={(value) => updateFormData({ employment_type: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Wähle Art" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="weekly_hours">Wochenstunden *</Label>
                    <Input
                      id="weekly_hours"
                      type="number"
                      min="1"
                      max="60"
                      value={formData.weekly_hours || ""}
                      onChange={(e) => updateFormData({ weekly_hours: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Arbeitsort *</Label>
                    <Select value={formData.work_mode} onValueChange={(value) => updateFormData({ work_mode: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Wähle Modus" />
                      </SelectTrigger>
                      <SelectContent>
                        {workModeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(formData.work_mode === "hybrid" || formData.work_mode === "onsite") && (
                  <div>
                    <Label htmlFor="location">Stadt/Region</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => updateFormData({ location: e.target.value })}
                      placeholder="z.B. Berlin, Deutschland"
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label>Sprache *</Label>
                  <Select value={formData.language_required} onValueChange={(value) => updateFormData({ language_required: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Wähle Deutsch-Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Sales-Kontext */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Sales-Kontext
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Branchen * (1–3 auswählen)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {industryOptions.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox
                          id={industry}
                          checked={formData.industries.includes(industry)}
                          onCheckedChange={(checked) => handleIndustryToggle(industry, checked as boolean)}
                          disabled={!formData.industries.includes(industry) && formData.industries.length >= 3}
                        />
                        <Label htmlFor={industry} className="text-sm">
                          {industry}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.industries.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.industries.map((industry) => (
                        <JobChip key={industry} variant="violet">
                          {industry}
                        </JobChip>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>ICP *</Label>
                    <div className="space-y-2 mt-2">
                      {icpOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={option.value}
                            name="icp"
                            value={option.value}
                            checked={formData.icp === option.value}
                            onChange={(e) => updateFormData({ icp: e.target.value })}
                            className="w-4 h-4"
                          />
                          <Label htmlFor={option.value} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Produktpreis-Band *</Label>
                    <div className="space-y-2 mt-2">
                      {priceBandOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={option.value}
                            name="price_band"
                            value={option.value}
                            checked={formData.price_band === option.value}
                            onChange={(e) => updateFormData({ price_band: e.target.value })}
                            className="w-4 h-4"
                          />
                          <Label htmlFor={option.value} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Sales-Zyklus *</Label>
                    <div className="space-y-2 mt-2">
                      {salesCycleOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={option.value}
                            name="sales_cycle"
                            value={option.value}
                            checked={formData.sales_cycle === option.value}
                            onChange={(e) => updateFormData({ sales_cycle: e.target.value })}
                            className="w-4 h-4"
                          />
                          <Label htmlFor={option.value} className="text-sm">
                            <JobChip variant="orange">{option.label}</JobChip>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Lead-Typ *</Label>
                    <div className="space-y-2 mt-2">
                      {leadTypeOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={option.value}
                            name="lead_type"
                            value={option.value}
                            checked={formData.lead_type === option.value}
                            onChange={(e) => updateFormData({ lead_type: e.target.value })}
                            className="w-4 h-4"
                          />
                          <Label htmlFor={option.value} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <Switch
                      id="leads_available"
                      checked={formData.leads_available.yes}
                      onCheckedChange={(checked) => 
                        updateFormData({ 
                          leads_available: { 
                            yes: checked, 
                            per_week: checked ? formData.leads_available.per_week : undefined 
                          } 
                        })
                      }
                    />
                    <Label htmlFor="leads_available">Leads vorhanden?</Label>
                    {formData.leads_available.yes && (
                      <JobChip variant="green">
                        Leads verfügbar
                      </JobChip>
                    )}
                  </div>
                  
                  {formData.leads_available.yes && (
                    <div className="ml-8">
                      <Label htmlFor="per_week">Menge pro Woche</Label>
                      <Input
                        id="per_week"
                        type="number"
                        min="0"
                        value={formData.leads_available.per_week || ""}
                        onChange={(e) => 
                          updateFormData({ 
                            leads_available: { 
                              ...formData.leads_available, 
                              per_week: Number(e.target.value) 
                            } 
                          })
                        }
                        placeholder="z.B. 30"
                        className="mt-1 max-w-32"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Tools/Stack (Mehrfachauswahl)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {toolsOptions.map((tool) => (
                      <div key={tool} className="flex items-center space-x-2">
                        <Checkbox
                          id={tool}
                          checked={formData.tools.includes(tool)}
                          onCheckedChange={(checked) => handleToolToggle(tool, checked as boolean)}
                        />
                        <Label htmlFor={tool} className="text-sm">
                          {tool}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.tools.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tools.map((tool) => (
                        <JobChip key={tool} variant="blue">
                          {tool}
                        </JobChip>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vergütung */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-5 h-5" />
                  Vergütung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Vergütungsmodell *</Label>
                  <div className="space-y-2 mt-2">
                    {compModelOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={option.value}
                          name="comp_model"
                          value={option.value}
                          checked={formData.comp_model === option.value}
                          onChange={(e) => updateFormData({ comp_model: e.target.value })}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={option.value} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="commission_percent">Provision (%) *</Label>
                    <Input
                      id="commission_percent"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.commission_percent || ""}
                      onChange={(e) => updateFormData({ commission_percent: Number(e.target.value), commission_eur_year: undefined })}
                      placeholder="z.B. 15"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Entweder % oder €/Jahr</p>
                  </div>

                  <div>
                    <Label htmlFor="commission_eur_year">ODER Provision (€/Jahr) *</Label>
                    <Input
                      id="commission_eur_year"
                      type="number"
                      min="0"
                      value={formData.commission_eur_year || ""}
                      onChange={(e) => updateFormData({ commission_eur_year: Number(e.target.value), commission_percent: undefined })}
                      placeholder="z.B. 75000"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="avg_deal_eur">Ø Dealgröße (€, optional)</Label>
                    <Input
                      id="avg_deal_eur"
                      type="number"
                      min="0"
                      value={formData.avg_deal_eur || ""}
                      onChange={(e) => updateFormData({ avg_deal_eur: Number(e.target.value) })}
                      placeholder="z.B. 18000"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="one_off_bonus">Einmalige Zahlung (€, optional)</Label>
                    <Input
                      id="one_off_bonus"
                      type="number"
                      min="0"
                      value={formData.one_off_bonus_eur || ""}
                      onChange={(e) => updateFormData({ one_off_bonus_eur: Number(e.target.value) })}
                      placeholder="z.B. 5000"
                      className="mt-1"
                    />
                  </div>
                </div>

                {formData.commission_percent && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <JobChip variant="violet">
                      {formData.commission_percent}% Provision
                    </JobChip>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Anforderungen & Prozess */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Anforderungen & Prozess
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="must_haves">Muss-Kriterien * (min. 3 Bullets)</Label>
                  <Textarea
                    id="must_haves"
                    value={formData.must_haves}
                    onChange={(e) => updateFormData({ must_haves: e.target.value })}
                    placeholder="• 3+ Jahre B2B Closing Erfahrung&#10;• Deutsch C1 Level&#10;• HubSpot Erfahrung"
                    className="mt-1 min-h-32"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Verwende • oder - für Bullets. Aktuell: {formData.must_haves.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-')).length} Bullets
                  </p>
                </div>

                <div>
                  <Label htmlFor="responsibilities">Aufgaben (optional, max. 6 Bullets)</Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) => updateFormData({ responsibilities: e.target.value })}
                    placeholder="• Discovery & Demo Calls führen&#10;• Forecast & CRM Hygiene"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="benefits">Benefits (optional, max. 3 Bullets)</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => updateFormData({ benefits: e.target.value })}
                    placeholder="• Remote-first Arbeitsplatz&#10;• Weiterbildungsbudget&#10;• Flexible Arbeitszeiten"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="start_date">Startdatum</Label>
                    <Input
                      id="start_date"
                      value={formData.start_date}
                      onChange={(e) => updateFormData({ start_date: e.target.value })}
                      placeholder="ASAP oder Datum"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="engagement">Engagement</Label>
                    <Select value={formData.engagement} onValueChange={(value) => updateFormData({ engagement: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Wähle Dauer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Unbefristet</SelectItem>
                        <SelectItem value="project">Projekt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Eigene Screening-Fragen (max. 2, optional)</Label>
                  {formData.screening_questions.map((question, index) => (
                    <div key={index}>
                      <Input
                        value={question}
                        onChange={(e) => handleScreeningQuestionChange(index, e.target.value)}
                        placeholder={index === 0 ? "z.B. Warum passt du zu unserem ICP?" : "z.B. Beispiel deiner besten Closing-Story"}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    id="assessment_gate"
                    checked={formData.assessment_gate.require_sci}
                    onCheckedChange={(checked) => 
                      updateFormData({ 
                        assessment_gate: { 
                          ...formData.assessment_gate, 
                          require_sci: checked 
                        } 
                      })
                    }
                  />
                  <Label htmlFor="assessment_gate">SCI Assessment erforderlich</Label>
                  {formData.assessment_gate.require_sci && (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.assessment_gate.min_score || 70}
                      onChange={(e) => 
                        updateFormData({ 
                          assessment_gate: { 
                            ...formData.assessment_gate, 
                            min_score: Number(e.target.value) 
                          } 
                        })
                      }
                      className="w-20"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality Score Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Qualitäts-Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{qualityScore}</div>
                  <Badge className={cn("text-sm", scoreBadge.color, scoreBadge.textColor)}>
                    {scoreBadge.label}
                  </Badge>
                </div>

                <Progress value={qualityScore} className="h-2" />

                {missingFields.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Noch zu erledigen:
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {missingFields.map((field, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-amber-500 mt-0.5">•</span>
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t">
                  <Button variant="outline" className="w-full" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Vorschau
                  </Button>
                  
                  <Button 
                    className="w-full" 
                    disabled={!canSubmit}
                    size="sm"
                  >
                    Zur Prüfung einreichen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}