import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Trophy, 
  FileText, 
  Share2, 
  ExternalLink, 
  CheckCircle,
  Clock,
  BarChart3,
  Quote
} from "lucide-react";

interface AssessmentResult {
  id: string;
  assessment_title: string;
  score: number;
  badge: 'bronze' | 'silver' | 'gold' | 'platinum';
  percentile: number;
  completed_at: Date;
  rubrics: {
    name: string;
    score: number;
    max_score: number;
  }[];
  highlights: {
    task: string;
    quote: string;
  }[];
  recommendations: string[];
  is_processing: boolean;
}

const mockResult: AssessmentResult = {
  id: "1",
  assessment_title: "SCI Sales Assessment",
  score: 78,
  badge: 'gold',
  percentile: 75,
  completed_at: new Date('2024-01-15'),
  rubrics: [
    { name: "Struktur", score: 4, max_score: 5 },
    { name: "Nutzenklarheit", score: 5, max_score: 5 },
    { name: "Call-to-Action", score: 3, max_score: 5 },
    { name: "Sprachqualität", score: 4, max_score: 5 },
    { name: "Einwandbehandlung", score: 3, max_score: 5 },
    { name: "Fachwissen", score: 5, max_score: 5 }
  ],
  highlights: [
    {
      task: "Video-Pitch",
      quote: "Besonders überzeugte die klare Strukturierung mit Problem-Lösung-Nutzen."
    },
    {
      task: "Einwandbehandlung", 
      quote: "Empathische Herangehensweise beim Preis-Einwand demonstriert."
    },
    {
      task: "Sales-Quiz",
      quote: "Solides Verständnis von BANT und Discovery-Techniken."
    }
  ],
  recommendations: [
    "Einwandbehandlung durch mehr Beispiele und Stories verstärken",
    "Call-to-Action am Ende des Pitches präziser formulieren",
    "DSGVO-Kenntnisse für B2B-Vertrieb vertiefen"
  ],
  is_processing: false
};

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case 'bronze': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'silver': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'gold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'platinum': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getBadgeLabel = (badge: string) => {
  switch (badge) {
    case 'bronze': return 'Bronze';
    case 'silver': return 'Silber';
    case 'gold': return 'Gold';
    case 'platinum': return 'Platin';
    default: return 'Ausstehend';
  }
};

export default function AssessmentResult() {
  const [result, setResult] = useState<AssessmentResult>(mockResult);
  const [isPolling, setIsPolling] = useState(false);

  const breadcrumbs = [
    { label: "Übersicht", href: "/" },
    { label: "Assessment-Center", href: "/assessment" },
    { label: "Ergebnis" }
  ];

  // Poll for results if processing
  useEffect(() => {
    if (result.is_processing) {
      setIsPolling(true);
      const interval = setInterval(() => {
        // Mock API call - in reality would fetch from server
        console.log('Polling for assessment results...');
        
        // Simulate completion after 10 seconds
        setTimeout(() => {
          setResult(prev => ({ ...prev, is_processing: false }));
          setIsPolling(false);
          clearInterval(interval);
        }, 10000);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [result.is_processing]);

  const handleDownloadPDF = () => {
    // Generate and download PDF report
    console.log('Downloading PDF report...');
  };

  const handleShareResult = () => {
    // Share assessment result
    console.log('Sharing assessment result...');
  };

  const handleViewJobs = () => {
    window.location.href = '/jobs';
  };

  if (result.is_processing) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-[var(--color-primary)] animate-spin" />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                  Dein Assessment wird ausgewertet
                </h2>
                <p className="text-[var(--color-muted)]">
                  Die Bewertung dauert normalerweise 1-3 Minuten. Du erhältst eine 
                  detaillierte Analyse deiner Performance.
                </p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>

              <div className="text-sm text-[var(--color-muted)]">
                Diese Seite aktualisiert sich automatisch...
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Result Header */}
        <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  {result.assessment_title}
                </h2>
                <div className="text-[var(--color-muted)] mt-1">
                  Version v1 • {result.completed_at.toLocaleDateString('de-DE')}
                </div>
              </div>
              <Badge className={getBadgeColor(result.badge)}>
                {getBadgeLabel(result.badge)}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="text-center md:text-left">
                <div className="text-4xl font-bold text-[var(--color-text)] mb-2">
                  {result.score}/100
                </div>
                <div className="text-sm text-[var(--color-muted)]">
                  Top {100 - result.percentile}% aller Kandidaten
                </div>
              </div>

              <div className="space-y-3">
                {result.rubrics.map((rubric, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text)]">{rubric.name}</span>
                      <span className="text-[var(--color-muted)]">
                        {rubric.score}/{rubric.max_score}
                      </span>
                    </div>
                    <Progress 
                      value={(rubric.score / rubric.max_score) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Highlights */}
          <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Quote className="h-5 w-5 text-[var(--color-primary)]" />
                Top-Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.highlights.map((highlight, index) => (
                <div key={index} className="border-l-4 border-emerald-500 pl-4 py-2">
                  <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">
                    {highlight.task}
                  </div>
                  <p className="text-sm text-[var(--color-text)]">
                    "{highlight.quote}"
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-[var(--color-primary)]" />
                Empfehlungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-[var(--color-text)] flex-1">
                    {rec}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--color-accent-50)] border border-black/5 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">
                    Glückwunsch zu deinem {getBadgeLabel(result.badge)}-Badge!
                  </h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Zeige Unternehmen deine validierten Skills
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  onClick={handleDownloadPDF}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  PDF herunterladen
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleShareResult}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Assessment-Pass teilen
                </Button>
                <Button 
                  onClick={handleViewJobs}
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-700)] gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Jobs ansehen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Nächste Schritte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[var(--color-surface)] rounded-lg">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-medium text-[var(--color-text)] mb-1">
                  Profil optimieren
                </h4>
                <p className="text-xs text-[var(--color-muted)]">
                  Ergänze dein Profil mit den Assessment-Ergebnissen
                </p>
              </div>
              
              <div className="text-center p-4 bg-[var(--color-surface)] rounded-lg">
                <Trophy className="h-8 w-8 text-[var(--color-primary)] mx-auto mb-3" />
                <h4 className="font-medium text-[var(--color-text)] mb-1">
                  Badge nutzen
                </h4>
                <p className="text-xs text-[var(--color-muted)]">
                  Füge dein SCI-Badge zu Bewerbungen hinzu
                </p>
              </div>
              
              <div className="text-center p-4 bg-[var(--color-surface)] rounded-lg">
                <ExternalLink className="h-8 w-8 text-[var(--color-accent)] mx-auto mb-3" />
                <h4 className="font-medium text-[var(--color-text)] mb-1">
                  Jobs durchsuchen
                </h4>
                <p className="text-xs text-[var(--color-muted)]">
                  Finde passende Positionen mit deinem Skill-Level
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}