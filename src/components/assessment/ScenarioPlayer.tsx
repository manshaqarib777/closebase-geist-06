import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Scenario } from "@/data/assessment-questions";
import { Clock, FileText, Send, Lightbulb } from "lucide-react";

interface ScenarioPlayerProps {
  scenario: Scenario;
  response: string;
  timeLeft: number;
  onResponseChange: (response: string) => void;
  onSubmit: () => void;
}

export function ScenarioPlayer({
  scenario,
  response,
  timeLeft,
  onResponseChange,
  onSubmit
}: ScenarioPlayerProps) {
  const [wordCount, setWordCount] = useState(0);

  // Calculate word count
  useEffect(() => {
    const words = response.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [response]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      onSubmit();
    }
  }, [timeLeft, onSubmit]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (wordCount >= 10) {
          onSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onSubmit, wordCount]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCountStatus = () => {
    if (wordCount < 90) return { color: 'text-orange-600', label: 'Zu wenig', bg: 'bg-orange-500' };
    if (wordCount > 150) return { color: 'text-destructive', label: 'Zu viele', bg: 'bg-destructive' };
    return { color: 'text-green-600', label: 'Optimal', bg: 'bg-green-500' };
  };

  const wordStatus = getWordCountStatus();
  const wordProgress = Math.min((wordCount / 150) * 100, 100);
  const isTimeCritical = timeLeft <= 30;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 bg-background/90 backdrop-blur border-b border-border/50 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 py-3 px-4">
          <div className="font-medium text-foreground">Elite-Vertriebler-Assessment</div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center h-7 px-3 rounded-full text-sm bg-muted text-muted-foreground">
              Teil 2 von 2
            </span>
            <span 
              className={`inline-flex items-center h-7 px-3 rounded-full text-sm transition-all ${
                isTimeCritical 
                  ? 'bg-destructive/10 text-destructive animate-pulse' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="h-[3px] bg-muted/30">
          <div 
            className={`h-full transition-all duration-300 ${
              isTimeCritical ? 'bg-destructive' : 'bg-primary'
            }`}
            style={{ width: '100%' }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 pt-6 pb-20 space-y-5">
        {/* Prompt Card */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
          <h1 className="text-xl font-semibold text-card-foreground mb-2">
            {scenario.title}
          </h1>
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-card-foreground leading-relaxed">
              {scenario.prompt}
            </p>
          </div>
        </div>

        {/* Editor Card */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
          <div className="space-y-4">
            {/* Word Counter */}
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 text-sm font-medium ${wordStatus.color}`}>
                <FileText className="h-4 w-4" />
                Wörter {wordCount}/150
              </div>
              <div className="text-xs text-muted-foreground">
                {wordStatus.label}
              </div>
            </div>

            {/* Word Progress Bar */}
            <div className="h-[3px] bg-muted/30 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${wordStatus.bg}`}
                style={{ width: `${wordProgress}%` }}
              />
            </div>

            {/* Textarea */}
            <Textarea
              value={response}
              onChange={(e) => onResponseChange(e.target.value)}
              placeholder="Schreibe deine Antwort hier... (90-150 Wörter empfohlen)"
              className="min-h-60 leading-6 text-[15px] resize-none placeholder:text-muted-foreground/60"
              maxLength={1000}
            />

            {/* Keywords Hint */}
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Schlüsselwörter:</span> {scenario.keyWords.join(', ')}
            </div>
          </div>
        </div>

        {/* Guidelines Box */}
        <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-violet-900 dark:text-violet-100 mb-1">
                Struktur-Tipp
              </h3>
              <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
                Empathie → Bedarf → Nutzen → konkreter Termin (15–20 Min). Max. 150 Wörter.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background/90 backdrop-blur border-t border-border/50 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between py-3">
          <div className="text-sm text-muted-foreground">
            Tastenkürzel: Ctrl+Enter zum Absenden
          </div>
          
          <Button
            onClick={onSubmit}
            size="lg"
            disabled={wordCount < 10}
            className="gap-2 hover:-translate-y-0.5 transition-transform"
          >
            <Send className="h-4 w-4" />
            Assessment abschließen
          </Button>
        </div>
      </footer>
    </div>
  );
}