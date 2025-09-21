import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, Play, RotateCcw, FileText, Share2 } from "lucide-react";
import { AssessmentGate } from "@/components/assessment/assessment-gate";

interface AssessmentResult {
  id: string;
  score: number;
  badge: 'bronze' | 'silver' | 'gold' | 'platinum';
  completed_at: Date;
  strengths: string[];
  recommendations: string[];
}

interface Assessment {
  id: string;
  key: string;
  title: string;
  duration_min: number;
  description: string;
  is_available: boolean;
  next_retake_date?: Date;
}

const mockResult: AssessmentResult = {
  id: "1",
  score: 78,
  badge: 'gold',
  completed_at: new Date('2024-01-15'),
  strengths: [
    "Strukturierte Präsentation",
    "Klare Nutzenargumentation",
    "Professionelle Sprache"
  ],
  recommendations: [
    "Einwandbehandlung vertiefen",
    "Mehr Beispiele verwenden"
  ]
};

const mockAssessment: Assessment = {
  id: "sci_light_v1",
  key: "sci_light_v1",
  title: "SCI-Light Assessment",
  duration_min: 15,
  description: "Beweise deine Sales Skills in 3 kompakten Aufgaben",
  is_available: true
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

export default function AssessmentHub() {
  const [hasResult] = useState(true);
  const [hasActiveDraft] = useState(false);
  const [attemptsUsed] = useState(0); // Mock: User has used 0 of 2 attempts

  const breadcrumbs = [
    { label: "Übersicht", href: "/" },
    { label: "Assessment-Center" }
  ];

  const handleStartAssessment = async () => {
    // Check if user has reached attempt limit
    if (attemptsUsed >= 2) {
      return; // Prevent submission if already at limit
    }

    try {
      // Create new attempt via POST
      const response = await fetch(`/api/assessments/${mockAssessment.id}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      
      if (response.ok) {
        const result = await response.json();
        window.location.href = `/assessment/play?attempt=${result.attempt_id}&step=1`;
      } else {
        // Fallback for development
        const attemptId = Math.random().toString(36).substr(2, 9);
        window.location.href = `/assessment/play?attempt=${attemptId}&step=1`;
      }
    } catch (error) {
      // Fallback for development
      const attemptId = Math.random().toString(36).substr(2, 9);
      window.location.href = `/assessment/play?attempt=${attemptId}&step=1`;
    }
  };

  const handleViewResult = () => {
    window.location.href = `/assessment/result/${mockResult.id}`;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] font-heading">
            Assessment-Center
          </h1>
          <p className="text-[var(--color-muted)] mt-1 font-ui">
            Beweise deine Skills und erhalte ein SCI-Badge.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assessment Gate with attempt limiting */}
          <div>
            <AssessmentGate 
              onStart={handleStartAssessment}
              currentAttempts={attemptsUsed}
              maxAttempts={2}
              canRetry={false}
            />
          </div>

          {/* Status Card */}
          {hasResult && (
            <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[var(--color-text)]">
                    Dein SCI-Score
                  </CardTitle>
                  <Badge className={getBadgeColor(mockResult.badge)}>
                    {mockResult.badge.charAt(0).toUpperCase() + mockResult.badge.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="text-4xl font-bold text-[var(--color-text)]">
                    {mockResult.score}/100
                  </div>
                  <div className="flex-1">
                    <Progress value={mockResult.score} className="h-2" />
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      Top 25% aller Kandidaten
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-[var(--color-text)] mb-2">
                      Top-Stärken
                    </h4>
                    <ul className="space-y-1">
                      {mockResult.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-[var(--color-muted)] flex items-start gap-2">
                          <Trophy className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[var(--color-text)] mb-2">
                      Empfehlungen
                    </h4>
                    <ul className="space-y-1">
                      {mockResult.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-[var(--color-muted)] flex items-start gap-2">
                          <span className="w-1 h-1 bg-[var(--color-muted)] rounded-full mt-2 shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    size="sm" 
                    onClick={handleViewResult}
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-700)]"
                  >
                    Ergebnis ansehen
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Draft Card */}
          {hasActiveDraft && (
            <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[var(--color-text)]">
                  Assessment fortsetzen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[var(--color-muted)]" />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      SCI-Light Assessment
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      Schritt 2 von 3 • Noch 8 Minuten
                    </p>
                  </div>
                </div>
                
                <div>
                  <Progress value={66} className="h-2 mb-2" />
                  <p className="text-xs text-[var(--color-muted)]">
                    Zuletzt gespeichert vor 2 Minuten
                  </p>
                </div>

                <Button 
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-700)]"
                  onClick={handleStartAssessment}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Fortsetzen
                </Button>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--color-accent-50)] border border-black/5 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shrink-0">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-2">
                  Warum ein SCI-Badge?
                </h3>
                <div className="text-sm text-[var(--color-muted)] space-y-1">
                  <p>• Zeige Unternehmen deine validierten Sales-Skills</p>
                  <p>• Erhalte prioritären Zugang zu Top-Positionen</p>
                  <p>• Verbessere deine Bewerbungschancen um 3x</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}