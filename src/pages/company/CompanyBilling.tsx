import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Zap, TrendingUp, Users, Calendar, Download, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "kostenlos",
    description: "Perfekt für den Einstieg",
    features: [
      "1 aktive Stellenanzeige",
      "Bis zu 50 Bewerbungen/Monat",
      "Basis Analytics",
      "E-Mail Support"
    ],
    limits: {
      jobs: { current: 1, max: 1 },
      applications: { current: 23, max: 50 },
      boosts: { current: 0, max: 0 },
      teamSeats: { current: 1, max: 1 }
    },
    current: true
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    period: "/Monat",
    description: "Für wachsende Unternehmen",
    features: [
      "5 aktive Stellenanzeigen",
      "Unbegrenzte Bewerbungen",
      "2 Boosts/Monat inklusive",
      "3 Team-Mitglieder",
      "Erweiterte Analytics",
      "Priority Support"
    ],
    limits: {
      jobs: { current: 0, max: 5 },
      applications: { current: 0, max: "∞" },
      boosts: { current: 0, max: 2 },
      teamSeats: { current: 0, max: 3 }
    },
    popular: true
  },
  {
    id: "scale",
    name: "Scale",
    price: 249,
    period: "/Monat",
    description: "Für große Recruiting-Teams",
    features: [
      "15 aktive Stellenanzeigen",
      "Unbegrenzte Bewerbungen",
      "5 Boosts/Monat inklusive",
      "10 Team-Mitglieder",
      "Premium Analytics",
      "Dedicated Account Manager",
      "API-Zugang"
    ],
    limits: {
      jobs: { current: 0, max: 15 },
      applications: { current: 0, max: "∞" },
      boosts: { current: 0, max: 5 },
      teamSeats: { current: 0, max: 10 }
    }
  }
];

const boostOptions = [
  {
    duration: 7,
    price: 49,
    pricePerDay: 7,
    recommended: false
  },
  {
    duration: 14,
    price: 89,
    pricePerDay: 6.36,
    recommended: true
  },
  {
    duration: 30,
    price: 179,
    pricePerDay: 5.97,
    recommended: false
  }
];

const activeJobs = [
  {
    id: "1",
    title: "Senior Sales Consultant B2B",
    views: 234,
    applications: 45,
    ctr: 19.2,
    qualityScore: 92,
    isBoosted: true,
    boostDaysLeft: 5
  },
  {
    id: "2",
    title: "Closer für High-Ticket Sales",
    views: 156,
    applications: 28,
    ctr: 17.9,
    qualityScore: 88,
    isBoosted: true,
    boostDaysLeft: 12
  },
  {
    id: "3",
    title: "Sales Development Rep",
    views: 445,
    applications: 67,
    ctr: 15.1,
    qualityScore: 76,
    isBoosted: false
  }
];

const invoices = [
  {
    id: "INV-2024-001",
    date: "2024-12-01",
    amount: 99,
    status: "paid",
    description: "Pro Plan - Dezember 2024"
  },
  {
    id: "INV-2024-002", 
    date: "2024-11-01",
    amount: 99,
    status: "paid",
    description: "Pro Plan - November 2024"
  },
  {
    id: "INV-2024-003",
    date: "2024-10-01", 
    amount: 49,
    status: "paid",
    description: "Boost 7 Tage"
  }
];

export default function CompanyBilling() {
  const currentPlan = plans.find(plan => plan.current);

  return (
    <AppLayout 
      breadcrumbs={[
        { label: "Abrechnung" }
      ]}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Abrechnung & Pläne
          </h1>
          <p className="text-muted-foreground font-ui">
            Verwalte dein Abonnement und kaufe Boosts für bessere Sichtbarkeit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Current Plan & Usage */}
        <div className="xl:col-span-2 space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Aktueller Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-heading font-bold text-foreground">
                    {currentPlan?.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentPlan?.price === 0 ? "Kostenlos" : `€${currentPlan?.price}${currentPlan?.period}`}
                  </p>
                </div>
                <Badge className="bg-cb-primary text-white">
                  Aktiv
                </Badge>
              </div>

              {currentPlan && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Stellenanzeigen</span>
                      <span className="text-sm font-ui font-medium">
                        {currentPlan.limits.jobs.current}/{currentPlan.limits.jobs.max}
                      </span>
                    </div>
                    <Progress 
                      value={(currentPlan.limits.jobs.current / currentPlan.limits.jobs.max) * 100} 
                      className="mb-4"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Bewerbungen</span>
                      <span className="text-sm font-ui font-medium">
                        {currentPlan.limits.applications.current}/{currentPlan.limits.applications.max}
                      </span>
                    </div>
                    <Progress 
                      value={currentPlan.limits.applications.max === "∞" ? 0 : (currentPlan.limits.applications.current / Number(currentPlan.limits.applications.max)) * 100} 
                      className="mb-4"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Boosts</span>
                      <span className="text-sm font-ui font-medium">
                        {currentPlan.limits.boosts.current}/{currentPlan.limits.boosts.max}
                      </span>
                    </div>
                    <Progress 
                      value={currentPlan.limits.boosts.max === 0 ? 0 : (currentPlan.limits.boosts.current / currentPlan.limits.boosts.max) * 100} 
                      className="mb-4"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Team-Mitglieder</span>
                      <span className="text-sm font-ui font-medium">
                        {currentPlan.limits.teamSeats.current}/{currentPlan.limits.teamSeats.max}
                      </span>
                    </div>
                    <Progress 
                      value={(currentPlan.limits.teamSeats.current / currentPlan.limits.teamSeats.max) * 100} 
                      className="mb-4"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Verfügbare Pläne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative p-6 border rounded-lg transition-smooth",
                      plan.current ? "border-cb-primary bg-cb-primary/5" : "border-border",
                      plan.popular && "ring-2 ring-cb-primary"
                    )}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cb-primary text-white">
                        Beliebt
                      </Badge>
                    )}

                    <div className="text-center mb-4">
                      <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                        {plan.name}
                      </h3>
                      <div className="mb-2">
                        <span className="text-3xl font-heading font-bold text-foreground">
                          €{plan.price}
                        </span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={cn(
                        "w-full",
                        plan.current 
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                          : "bg-cb-primary hover:bg-cb-primary/90"
                      )}
                      disabled={plan.current}
                    >
                      {plan.current ? "Aktueller Plan" : "Upgrade"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Boost Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cb-accent" />
                Job-Boosts kaufen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Boost deine Stellenanzeigen für maximale Sichtbarkeit und mehr qualifizierte Bewerbungen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {boostOptions.map((option) => (
                  <div
                    key={option.duration}
                    className={cn(
                      "relative p-4 border rounded-lg text-center transition-smooth hover:shadow-cb-md",
                      option.recommended ? "border-cb-accent ring-2 ring-cb-accent/20" : "border-border"
                    )}
                  >
                    {option.recommended && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cb-accent text-white">
                        Empfohlen
                      </Badge>
                    )}

                    <div className="text-2xl font-heading font-bold text-foreground mb-1">
                      {option.duration} Tage
                    </div>
                    <div className="text-3xl font-heading font-bold text-foreground mb-1">
                      €{option.price}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      €{option.pricePerDay.toFixed(2)}/Tag
                    </div>
                    <Button 
                      className="w-full bg-cb-accent hover:bg-cb-accent/90"
                      size="sm"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Kaufen
                    </Button>
                  </div>
                ))}
              </div>

              {/* Boost Impact Report */}
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-ui font-semibold text-foreground mb-3">
                  Boost Impact Report
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-heading font-bold text-cb-accent mb-1">
                      +187%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mehr Views
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-heading font-bold text-cb-accent mb-1">
                      +143%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mehr Bewerbungen
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-heading font-bold text-cb-accent mb-1">
                      +89%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Höhere Qualität
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Boosts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aktive Boosts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeJobs.filter(job => job.isBoosted).map((job) => (
                  <div key={job.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-ui font-medium text-sm text-foreground flex-1 leading-tight">
                        {job.title}
                      </h4>
                      <Badge className="bg-cb-accent text-white text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        {job.boostDaysLeft}d
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-muted-foreground" />
                        <span className="font-ui font-medium">{job.views}</span>
                        <span className="text-muted-foreground">Views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="font-ui font-medium">{job.applications}</span>
                        <span className="text-muted-foreground">Bew.</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zahlungsmethode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg mb-4">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-ui font-medium text-foreground">•••• 4242</p>
                  <p className="text-sm text-muted-foreground">Läuft ab 12/25</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                Zahlungsmethode ändern
              </Button>
            </CardContent>
          </Card>

          {/* Invoices */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Rechnungen</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Alle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-ui font-medium text-foreground">
                        {invoice.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-ui font-medium text-foreground">
                        €{invoice.amount}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        Bezahlt
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}