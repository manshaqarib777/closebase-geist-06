import React from "react";
import { AlertTriangle } from "lucide-react";

interface AssessmentShellProps {
  children: React.ReactNode;
  currentPart: 1 | 2;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  timeLeft: number;
  questionTimeLeft?: number;
  proctorFlags?: {
    focusChanges: number;
    pasteCount: number;
  };
  onExit?: () => void;
}

export function AssessmentShell({
  children,
  currentPart,
  currentQuestionIndex = 0,
  totalQuestions = 20,
  timeLeft,
  questionTimeLeft,
  proctorFlags,
  onExit
}: AssessmentShellProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {children}

      {/* Critical Time Warning */}
      {timeLeft <= 60 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                <div className="text-sm">
                  <p className="font-medium text-destructive">
                    Weniger als 1 Minute verbleibend!
                  </p>
                  <p className="text-muted-foreground">
                    Deine Antworten werden automatisch übermittelt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}