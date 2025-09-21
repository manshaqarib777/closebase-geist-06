import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AssessmentResult as Result } from "@/utils/assessment-scoring";
import { Trophy, Target, Brain, Zap, CheckCircle, XCircle, Download, Share2, Eye, Sparkles } from "lucide-react";

interface AssessmentResultProps {
  result: Result;
  mcRawScore?: number;
  onContinue?: () => void;
  onRetry?: () => void;
  canRetry?: boolean;
  retryDate?: Date;
}

export function AssessmentResult({
  result,
  mcRawScore = 0,
  onContinue,
  onRetry,
  canRetry = false,
  retryDate
}: AssessmentResultProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (result.passed) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [result.passed]);

  const scorePercentage = (result.totalScore / 27) * 100;
  
  const getBadgeVariant = () => {
    if (!result.passed) return "destructive";
    if (scorePercentage >= 90) return "default";
    if (scorePercentage >= 80) return "secondary";
    return "outline";
  };

  const getBadgeLabel = () => {
    if (!result.passed) return "Nicht bestanden";
    if (scorePercentage >= 90) return "Ausgezeichnet";
    if (scorePercentage >= 80) return "Sehr gut";
    return "Bestanden";
  };

  const categoryIcons = {
    empathie: Brain,
    akquise: Target,
    resilienz: Zap,
    konfliktmanagement: Trophy
  };

  const categoryLabels = {
    empathie: "Empathie",
    akquise: "Akquise", 
    resilienz: "Resilienz",
    konfliktmanagement: "Konfliktmanagement"
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="flex items-center justify-center h-full">
              <div className="text-6xl animate-bounce">🎉</div>
            </div>
          </div>
        )}

        {/* Hero Score Card */}
        <Card className={`text-center relative overflow-hidden ${result.passed ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20' : ''}`}>
          <div className={`absolute inset-0 ${result.passed ? 'bg-gradient-to-br from-green-500/5 to-green-600/10' : 'bg-gradient-to-br from-muted/50 to-muted/20'}`} />
          <CardContent className="pt-8 pb-8 relative">
            <div className="space-y-6">
              {/* Main Score */}
              <div className="space-y-3">
                <div className="text-5xl font-bold text-foreground tracking-tight">
                  {result.totalScore}<span className="text-2xl text-muted-foreground">/27</span>
                </div>
                <Badge 
                  variant={getBadgeVariant()} 
                  className="text-base px-6 py-2 font-medium"
                >
                  {result.passed ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2" />
                  )}
                  {getBadgeLabel()}
                </Badge>
              </div>
              
              {/* Breakdown */}
              <div className="text-muted-foreground">
                <span className="font-medium">MC:</span> {result.part1Score}/20 ({mcRawScore} → {result.part1Score})
                <span className="mx-2 text-muted-foreground/50">•</span>
                <span className="font-medium">Szenario:</span> {result.part2Score}/7
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto space-y-2">
                <Progress value={scorePercentage} className="h-4" />
                <div className="text-sm text-muted-foreground">
                  {Math.round(scorePercentage)}% der Gesamtpunkte erreicht
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Kompetenzprofil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(result.categories).map(([category, score]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                const label = categoryLabels[category as keyof typeof categoryLabels];
                const percentage = Math.min(score, 100);
                
                return (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      <span className="text-sm font-mono text-muted-foreground">{score}%</span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {result.passed ? (
            <>
              <Button 
                onClick={onContinue} 
                size="lg" 
                className="flex-1 hover:-translate-y-0.5 transition-transform"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Profil freischalten & fortfahren
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hover:-translate-y-0.5 transition-transform"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hover:-translate-y-0.5 transition-transform"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Teilen
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 hover:-translate-y-0.5 transition-transform"
              >
                <Eye className="h-4 w-4 mr-2" />
                Tipps ansehen
              </Button>
              {canRetry ? (
                <Button 
                  onClick={onRetry} 
                  size="lg"
                  className="hover:-translate-y-0.5 transition-transform"
                >
                  Erneut versuchen
                </Button>
              ) : (
                <Button disabled size="lg">
                  {retryDate ? 
                    `Neuer Versuch in ${Math.ceil((retryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Tagen` : 
                    'Neuer Versuch nicht verfügbar'
                  }
                </Button>
              )}
            </>
          )}
        </div>

        {/* Next Steps (Success Only) */}
        {result.passed && (
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  🎉 Herzlichen Glückwunsch! Nächste Schritte:
                </h3>
                <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Vervollständige dein Profil für bessere Job-Matches
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Nutze deine Assessment-Badge in Bewerbungen
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Entdecke passende Vertriebsjobs in deiner Nähe
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}