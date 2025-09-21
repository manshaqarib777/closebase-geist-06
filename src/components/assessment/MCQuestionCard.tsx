import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { MCQuestion } from "@/data/assessment-questions";

interface MCQuestionCardProps {
  question: MCQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string;
  timeLeft: number;
  onAnswerSelect: (optionId: string) => void;
}

export function MCQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  timeLeft,
  onAnswerSelect
}: MCQuestionCardProps) {
  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  return (
    <Card className="bg-white rounded-[var(--radius-lg)] border border-black/5 shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            Frage {questionNumber} von {totalQuestions}
          </Badge>
          <div className={`flex items-center gap-2 text-sm ${timeLeft <= 5 ? 'text-red-600' : 'text-muted-foreground'}`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {question.question}
          </h3>

          <RadioGroup
            value={selectedAnswer}
            onValueChange={onAnswerSelect}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label 
                  htmlFor={option.id}
                  className="text-sm cursor-pointer flex-1 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {selectedAnswer && (
          <div className="pt-4 text-center">
            <Badge variant="secondary" className="text-xs">
              Antwort ausgewählt ✓
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}