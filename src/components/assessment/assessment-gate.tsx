import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Target } from "lucide-react";

interface AssessmentGateProps {
  onStart: () => void;
  maxAttempts?: number;
  currentAttempts?: number;
  canRetry?: boolean;
  retryDate?: Date;
}

export function AssessmentGate({ 
  onStart, 
  maxAttempts = 2, 
  currentAttempts = 0,
  canRetry = true,
  retryDate 
}: AssessmentGateProps) {
  const [remainingAttempts, setRemainingAttempts] = useState(maxAttempts - currentAttempts);
  
  const isBlocked = remainingAttempts <= 0 && !canRetry;
  const hasAttemptsLeft = remainingAttempts > 0;

  const formatRetryDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-bold">Elite-Vertriebler-Assessment</h2>
          </div>
          <p className="text-muted-foreground">
            20 Multiple-Choice Fragen + 1 Szenario-Aufgabe • ~10 Minuten
          </p>
        </div>

        {/* Attempt Counter */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Verfügbare Versuche:</span>
          <Badge variant={hasAttemptsLeft ? "default" : "destructive"}>
            {remainingAttempts}/{maxAttempts}
          </Badge>
        </div>

        {/* Assessment Description */}
        <div className="bg-muted/50 rounded-lg p-4 text-left">
          <h3 className="font-semibold mb-2">Was wird gemessen?</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• <strong>Empathie:</strong> Kundenverstehen und Beziehungsaufbau</li>
            <li>• <strong>Akquise:</strong> Neukundengewinnung und Lead-Generierung</li>
            <li>• <strong>Zyklus-Komfort:</strong> Umgang mit verschiedenen Sales-Zyklen</li>
            <li>• <strong>Resilienz:</strong> Umgang mit Ablehnung und Durchhaltevermögen</li>
          </ul>
        </div>

        {/* Status Messages */}
        {isBlocked && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Maximale Anzahl Versuche erreicht. 
              {retryDate && (
                <span className="block">Nächster Versuch möglich ab: {formatRetryDate(retryDate)}</span>
              )}
            </span>
          </div>
        )}

        {!isBlocked && remainingAttempts === 1 && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Dies ist Ihr letzter Versuch. Bereiten Sie sich gut vor!
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 pt-4">
          {hasAttemptsLeft && (
            <Button 
              onClick={onStart}
              className="px-8"
            >
              Assessment starten
            </Button>
          )}
          
          {currentAttempts > 0 && (
            <Button variant="outline">
              Letztes Ergebnis ansehen
            </Button>
          )}
        </div>

        {/* Legal Note */}
        <p className="text-xs text-muted-foreground">
          Ihre Daten werden vertraulich behandelt und nur zur Verbesserung 
          der Job-Matching-Qualität verwendet.
        </p>
      </div>
    </Card>
  );
}