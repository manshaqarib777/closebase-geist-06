import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useToast } from "@/hooks/use-toast";
import { MC_QUESTIONS, SCENARIOS, MCQuestion, Scenario } from "@/data/assessment-questions";
import { 
  selectRandomQuestions, 
  selectRandomScenario, 
  calculateAssessmentResult, 
  MCAnswer, 
  ScenarioAnswer, 
  scoreScenarioResponse,
  AssessmentAttempt,
  handleAutoSubmit
} from "@/utils/assessment-scoring";
import { AssessmentShell } from "@/components/assessment/AssessmentShell";
import { MCPlayer } from "@/components/assessment/MCPlayer";
import { ScenarioPlayer } from "@/components/assessment/ScenarioPlayer";
import { AssessmentResult } from "@/components/assessment/AssessmentResult";

// Elite Assessment Player - 10 minutes, auto-submit, randomized

export default function AssessmentPlayer() {
  // URL params for navigation
  const urlParams = new URLSearchParams(window.location.search);
  const attemptId = urlParams.get('attempt') || '1';
  const initialPart = parseInt(urlParams.get('part') || '1') as 1 | 2;
  const initialQuestionIndex = parseInt(urlParams.get('q') || '0');
  
  // Assessment state
  const [attempt, setAttempt] = useState<AssessmentAttempt>({
    id: attemptId,
    userId: 'user1', // Would come from auth
    status: 'in_progress',
    mcQuestions: [],
    scenario: SCENARIOS[0], // Will be randomized
    currentPart: initialPart,
    currentQuestionIndex: initialQuestionIndex,
    mcAnswers: {},
    scenarioResponse: '',
    timeStarted: Date.now(),
    partTimeLeft: initialPart === 1 ? 420 : 180, // 7 min MC, 3 min scenario
    questionTimeLeft: 21,
    proctorFlags: { focusChanges: 0, pasteCount: 0 }
  });
  
  const [showResult, setShowResult] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);
  
  const { toast } = useToast();

  // Initialize assessment on mount
  useEffect(() => {
    if (attempt.mcQuestions.length === 0) {
      const randomQuestions = selectRandomQuestions(MC_QUESTIONS, 20);
      const randomScenario = selectRandomScenario(SCENARIOS);
      
      setAttempt(prev => ({
        ...prev,
        mcQuestions: randomQuestions,
        scenario: randomScenario
      }));
    }
  }, []);

  // Auto-save functionality
  const saveAttempt = useCallback(async (updatedAttempt: AssessmentAttempt) => {
    try {
      // In real app: POST /api/assessments/{attemptId}/save
      // await fetch(`/api/assessments/${attemptId}/save`, {
      //   method: 'POST',
      //   body: JSON.stringify(updatedAttempt)
      // });
      
      console.log('Auto-saved attempt:', updatedAttempt);
    } catch (error) {
      console.error('Failed to save attempt:', error);
    }
  }, []);

  // Part timer (overall time for current part)
  useEffect(() => {
    if (attempt.partTimeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setAttempt(prev => {
          const newTimeLeft = prev.partTimeLeft - 1;
          if (newTimeLeft <= 0) {
            // Auto-submit current part
            if (prev.currentPart === 1) {
              // Move to part 2
              return {
                ...prev,
                currentPart: 2,
                partTimeLeft: 180, // 3 minutes for scenario
                currentQuestionIndex: 0
              };
            } else {
              // Submit entire assessment
              handleFinalSubmit(prev);
              return { ...prev, status: 'submitted' };
            }
          }
          return { ...prev, partTimeLeft: newTimeLeft };
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [attempt.partTimeLeft, showResult]);

  // Question timer (21 seconds per MC question)
  useEffect(() => {
    if (attempt.currentPart === 1 && attempt.questionTimeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setAttempt(prev => {
          const newTimeLeft = prev.questionTimeLeft - 1;
          if (newTimeLeft <= 0) {
            // Auto-advance to next question
            return handleQuestionAutoAdvance(prev);
          }
          return { ...prev, questionTimeLeft: newTimeLeft };
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [attempt.questionTimeLeft, attempt.currentPart, showResult]);

  // Proctor monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAttempt(prev => ({
          ...prev,
          proctorFlags: {
            ...prev.proctorFlags,
            focusChanges: prev.proctorFlags.focusChanges + 1
          }
        }));
      }
    };

    const handlePaste = () => {
      setAttempt(prev => ({
        ...prev,
        proctorFlags: {
          ...prev.proctorFlags,
          pasteCount: prev.proctorFlags.pasteCount + 1
        }
      }));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  // Auto-advance question logic
  const handleQuestionAutoAdvance = (currentAttempt: AssessmentAttempt): AssessmentAttempt => {
    if (currentAttempt.currentQuestionIndex < currentAttempt.mcQuestions.length - 1) {
      // Next question
      return {
        ...currentAttempt,
        currentQuestionIndex: currentAttempt.currentQuestionIndex + 1,
        questionTimeLeft: 21
      };
    } else {
      // Move to part 2
      return {
        ...currentAttempt,
        currentPart: 2,
        partTimeLeft: 180,
        currentQuestionIndex: 0
      };
    }
  };

  // Handle MC answer selection
  const handleMCAnswer = (questionId: string, optionId: string) => {
    setAttempt(prev => {
      const updatedAttempt = {
        ...prev,
        mcAnswers: { ...prev.mcAnswers, [questionId]: optionId }
      };
      saveAttempt(updatedAttempt);
      return updatedAttempt;
    });
  };

  // Handle next question manually
  const handleNextQuestion = () => {
    setAttempt(prev => handleQuestionAutoAdvance(prev));
  };

  // Handle scenario response
  const handleScenarioChange = (response: string) => {
    setAttempt(prev => {
      const updatedAttempt = { ...prev, scenarioResponse: response };
      saveAttempt(updatedAttempt);
      return updatedAttempt;
    });
  };

  // Calculate final result and show result page
  const handleFinalSubmit = (finalAttempt: AssessmentAttempt) => {
    // Convert answers to scoring format
    const mcAnswers: MCAnswer[] = Object.entries(finalAttempt.mcAnswers).map(([questionId, selectedOption]) => {
      const question = finalAttempt.mcQuestions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.id === selectedOption);
      return {
        questionId,
        selectedOption,
        points: option?.points || 0
      };
    });

    const scenarioAnswer = scoreScenarioResponse(finalAttempt.scenarioResponse, finalAttempt.scenario);
    const result = calculateAssessmentResult(mcAnswers, scenarioAnswer);

    setFinalResult({
      ...result,
      mcRawScore: mcAnswers.reduce((sum, ans) => sum + ans.points, 0),
      attempt: finalAttempt
    });
    setShowResult(true);

    // In real app: trigger API hooks for passed assessments
    if (result.passed) {
      console.log('Assessment passed - would trigger unlock API');
    }
  };

  // Submit scenario manually
  const handleScenarioSubmit = () => {
    handleFinalSubmit(attempt);
  };

  // Navigation handlers
  const handleContinue = () => {
    window.location.href = '/onboarding/complete';
  };

  const handleRetry = () => {
    // Reset attempt after 30 days check
    window.location.href = '/assessment/invite/new-token';
  };

  const breadcrumbs = [
    { label: "Übersicht", href: "/" },
    { label: "Assessment-Center", href: "/assessment" },
    { label: "Elite-Vertriebler-Assessment" }
  ];

  // Show result page
  if (showResult && finalResult) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <AssessmentResult
            result={finalResult}
            mcRawScore={finalResult.mcRawScore}
            onContinue={handleContinue}
            onRetry={handleRetry}
            canRetry={false}
            retryDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
          />
        </div>
      </AppLayout>
    );
  }

  // Show assessment player
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <AssessmentShell
        currentPart={attempt.currentPart}
        currentQuestionIndex={attempt.currentQuestionIndex}
        totalQuestions={attempt.mcQuestions.length}
        timeLeft={attempt.partTimeLeft}
        questionTimeLeft={attempt.currentPart === 1 ? attempt.questionTimeLeft : undefined}
        proctorFlags={attempt.proctorFlags}
      >
        {attempt.currentPart === 1 ? (
          <MCPlayer
            questions={attempt.mcQuestions}
            currentIndex={attempt.currentQuestionIndex}
            selectedAnswers={attempt.mcAnswers}
            questionTimeLeft={attempt.questionTimeLeft}
            onAnswerSelect={handleMCAnswer}
            onNext={handleNextQuestion}
            onAutoAdvance={() => setAttempt(prev => handleQuestionAutoAdvance(prev))}
          />
        ) : (
          <ScenarioPlayer
            scenario={attempt.scenario}
            response={attempt.scenarioResponse}
            timeLeft={attempt.partTimeLeft}
            onResponseChange={handleScenarioChange}
            onSubmit={handleScenarioSubmit}
          />
        )}
      </AssessmentShell>
    </AppLayout>
  );
}