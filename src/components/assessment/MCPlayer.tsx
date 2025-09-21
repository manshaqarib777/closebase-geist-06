import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MCQuestion } from "@/data/assessment-questions";
import { Clock, CheckCircle } from "lucide-react";

interface MCPlayerProps {
  questions: MCQuestion[];
  currentIndex: number;
  selectedAnswers: Record<string, string>;
  questionTimeLeft: number;
  onAnswerSelect: (questionId: string, optionId: string) => void;
  onNext: () => void;
  onAutoAdvance: () => void;
}

export function MCPlayer({
  questions,
  currentIndex,
  selectedAnswers,
  questionTimeLeft,
  onAnswerSelect,
  onNext,
  onAutoAdvance
}: MCPlayerProps) {
  const currentQuestion = questions[currentIndex];
  const currentAnswer = selectedAnswers[currentQuestion?.id] || '';
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isTimeCritical = questionTimeLeft <= 5;

  // Auto-advance when timer reaches 0
  useEffect(() => {
    if (questionTimeLeft === 0) {
      onAutoAdvance();
    }
  }, [questionTimeLeft, onAutoAdvance]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (questionTimeLeft === 0) return;
      
      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const optionIndex = parseInt(e.key) - 1;
        const option = currentQuestion?.options[optionIndex];
        if (option) {
          onAnswerSelect(currentQuestion.id, option.id);
        }
      }
      if (e.key === 'Enter' && currentAnswer) {
        e.preventDefault();
        onNext();
      }
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, currentAnswer, onAnswerSelect, onNext, questionTimeLeft]);

  if (!currentQuestion) return null;

  const optionCircles = ['①', '②', '③', '④', '⑤'];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 bg-background/90 backdrop-blur border-b border-border/50 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 py-3 px-4">
          <div className="font-medium text-foreground">Elite-Vertriebler-Assessment</div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center h-7 px-3 rounded-full text-sm bg-muted text-muted-foreground">
              Teil 1 von 2
            </span>
            <span className="inline-flex items-center h-7 px-3 rounded-full text-sm bg-muted text-muted-foreground">
              Frage {currentIndex + 1}/20
            </span>
            <span 
              className={`inline-flex items-center h-7 px-3 rounded-full text-sm transition-all ${
                isTimeCritical 
                  ? 'bg-destructive/10 text-destructive animate-pulse' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Clock className="h-3 w-3 mr-1" />
              {questionTimeLeft}s
            </span>
          </div>
        </div>
        <div className="h-[3px] bg-muted/30">
          <div 
            className={`h-full transition-all duration-300 ${
              isTimeCritical ? 'bg-destructive' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 pt-6 pb-20">
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6">
          <h1 className="text-xl font-semibold text-card-foreground mb-6">
            {currentQuestion.question}
          </h1>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentAnswer === option.id;
              const isDisabled = questionTimeLeft === 0;
              
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isDisabled}
                  className={`w-full text-left flex items-center gap-3 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border/50 bg-card hover:border-primary/30 hover:shadow-sm'
                  } ${
                    isDisabled ? 'opacity-60 pointer-events-none' : ''
                  }`}
                  onClick={() => onAnswerSelect(currentQuestion.id, option.id)}
                >
                  <span 
                    className={`h-5 w-5 rounded-full border-2 grid place-items-center text-xs transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30'
                    }`}
                  >
                    {isSelected && <CheckCircle className="h-3 w-3" />}
                  </span>
                  
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-muted/50 text-xs font-medium text-muted-foreground">
                    {optionCircles[index]}
                  </span>
                  
                  <span className="text-[15px] leading-relaxed text-card-foreground">
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Keyboard Hints */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center h-6 px-2 rounded bg-muted/50">1–5</span>
          <span className="inline-flex items-center h-6 px-2 rounded bg-muted/50">S=Überspringen</span>
          <span className="inline-flex items-center h-6 px-2 rounded bg-muted/50">↵=Weiter</span>
        </div>

        {/* Question Progress Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index < currentIndex 
                  ? 'bg-green-500' 
                  : index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background/90 backdrop-blur border-t border-border/50 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between py-3">
          <div className="text-sm text-muted-foreground">
            {currentAnswer ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Antwort ausgewählt
              </span>
            ) : (
              'Wähle eine Option oder warte bis der Timer abläuft'
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onNext}
              disabled={questionTimeLeft === 0}
              className="hover:-translate-y-0.5 transition-transform"
            >
              Überspringen
            </Button>
            <Button
              onClick={onNext}
              disabled={!currentAnswer || questionTimeLeft === 0}
              className="hover:-translate-y-0.5 transition-transform"
            >
              Weiter ↵
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}