import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText } from "lucide-react";
import { Scenario } from "@/data/assessment-questions";

interface ScenarioCardProps {
  scenario: Scenario;
  response: string;
  timeLeft: number;
  wordCount: number;
  onResponseChange: (response: string) => void;
}

export function ScenarioCard({
  scenario,
  response,
  timeLeft,
  wordCount,
  onResponseChange
}: ScenarioCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCountColor = () => {
    if (wordCount < 100) return 'text-red-600';
    if (wordCount > 150) return 'text-red-600';
    return 'text-green-600';
  };

  const getWordCountBadge = () => {
    if (wordCount < 100) return 'Zu wenig Wörter';
    if (wordCount > 150) return 'Zu viele Wörter';
    return 'Wortanzahl optimal';
  };

  return (
    <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              Szenario-Response
            </Badge>
            <div className={`flex items-center gap-2 text-sm ${getWordCountColor()}`}>
              <FileText className="h-4 w-4" />
              {wordCount}/150 Wörter
            </div>
          </div>
          <div className={`flex items-center gap-2 text-sm ${timeLeft <= 30 ? 'text-red-600' : 'text-muted-foreground'}`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {scenario.title}
          </h3>
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <p className="text-sm text-foreground">
              {scenario.prompt}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Textarea
            value={response}
            onChange={(e) => onResponseChange(e.target.value)}
            placeholder="Schreibe deine Antwort hier... (100-150 Wörter)"
            className="min-h-[200px] resize-none"
            maxLength={1000}
          />
          
          <div className="flex justify-between items-center text-xs">
            <Badge 
              variant={wordCount >= 100 && wordCount <= 150 ? "default" : "destructive"}
              className="text-xs"
            >
              {getWordCountBadge()}
            </Badge>
            <span className="text-muted-foreground">
              Schlüsselwörter: {scenario.keyWords.join(', ')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}