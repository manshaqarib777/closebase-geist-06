import { MCQuestion, Scenario } from "@/data/assessment-questions";

export interface AssessmentResult {
  part1Score: number; // 0-100, scaled from actual points
  part2Score: number; // 0-7
  totalScore: number; // 0-27
  passed: boolean; // >= 16 points
  categories: {
    empathie: number;
    feindseligkeit: number;
    akquise: number;
    resilienz: number;
  };
}

export interface MCAnswer {
  questionId: string;
  selectedOption: string;
  points: number;
}

export interface ScenarioAnswer {
  scenarioId: string;
  response: string;
  score: number;
  details: {
    keyWordScore: number; // max 4
    sentimentScore: number; // max 1
    strategyScore: number; // max 1
    engagementScore: number; // max 1
  };
}

// Scoring for Part 1 (MC Questions) - Elite Assessment
export function scoreMCQuestions(answers: MCAnswer[]): { rawScore: number; scaledScore: number } {
  const totalPoints = answers.reduce((sum, answer) => sum + answer.points, 0);
  const maxPossiblePoints = answers.length * 5; // Each question max 5 points
  const rawScore = Math.round((totalPoints / maxPossiblePoints) * 100);
  
  // Scale to 20 points maximum, minimum 80 raw points required
  const scaledScore = rawScore >= 80 ? Math.round((rawScore / 100) * 20) : 0;
  
  return { rawScore, scaledScore };
}

// NLP-based scoring for Part 2 (Elite Scenario) - Enhanced heuristics
export function scoreScenarioResponse(response: string, scenario: Scenario): ScenarioAnswer {
  const text = response.toLowerCase();
  
  // Keywords (max 4 points) - any of need/value/meeting/understanding
  const keywordGroups = [
    ['bedarf', 'ziel', 'problem', 'pain', 'herausforderung'],
    ['nutzen', 'value', 'wert', 'vorteil', 'mehrwert'],
    ['termin', 'meeting', 'call', 'gespräch', 'treffen'],
    ['verstehen', 'verständnis', 'nachvollziehen', 'empathie']
  ];
  
  let keyWordScore = 0;
  keywordGroups.forEach(group => {
    if (group.some(keyword => text.includes(keyword))) {
      keyWordScore++;
    }
  });
  keyWordScore = Math.min(4, keyWordScore);
  
  // Sentiment analysis (max 1 point) - positive without hostile terms
  const positiveWords = ['gern', 'freue', 'danke', 'spannend', 'gemeinsam', 'helfen', 'unterstützen'];
  const hostileWords = ['nervig', 'keine zeit', 'spam', 'störung', 'weg'];
  
  const hasPositive = positiveWords.some(word => text.includes(word));
  const hasHostile = hostileWords.some(word => text.includes(word));
  const sentimentScore = hasPositive && !hasHostile ? 1 : 0;
  
  // Strategy detection (max 1 point) - strategic approach patterns
  const strategyPatterns = [
    'nächster schritt', '2 option', 'poc', 'test', 'agenda', 
    'kurzes gespräch', 'unverbindlich', 'pilot'
  ];
  const hasStrategy = strategyPatterns.some(pattern => text.includes(pattern));
  const strategyScore = hasStrategy ? 1 : 0;
  
  // Engagement detection (max 1 point) - direct question + concrete CTA
  const hasQuestion = /\?/.test(response);
  const hasConcreteTime = /(diese|kommende) woche|15 ?min|20 ?min|morgen|übermorgen/.test(text);
  const engagementScore = hasQuestion && hasConcreteTime ? 1 : 0;
  
  const totalScore = keyWordScore + sentimentScore + strategyScore + engagementScore;
  
  return {
    scenarioId: scenario.id,
    response,
    score: totalScore,
    details: {
      keyWordScore,
      sentimentScore,
      strategyScore,
      engagementScore
    }
  };
}

// Calculate categories based on question types
export function calculateCategories(mcAnswers: MCAnswer[]): AssessmentResult['categories'] {
  // Simple categorization based on question content
  // In a real implementation, each question would be tagged with categories
  
  const empathieQuestions = ['q2', 'q3', 'q6', 'q7', 'q8', 'q18']; // Understanding, empathy
  const feindseligkeitQuestions = ['q1', 'q13', 'q17']; // Handling hostility
  const akquiseQuestions = ['q4', 'q5', 'q9', 'q11', 'q16', 'q19']; // Acquisition skills
  const resilienzQuestions = ['q10', 'q12', 'q14', 'q15', 'q20']; // Resilience, persistence
  
  const calculateCategoryScore = (questionIds: string[]) => {
    const relevantAnswers = mcAnswers.filter(answer => questionIds.includes(answer.questionId));
    if (relevantAnswers.length === 0) return 0;
    
    const totalPoints = relevantAnswers.reduce((sum, answer) => sum + answer.points, 0);
    const maxPoints = relevantAnswers.length * 5;
    return Math.round((totalPoints / maxPoints) * 100);
  };
  
  return {
    empathie: calculateCategoryScore(empathieQuestions),
    feindseligkeit: calculateCategoryScore(feindseligkeitQuestions),
    akquise: calculateCategoryScore(akquiseQuestions),
    resilienz: calculateCategoryScore(resilienzQuestions)
  };
}

// Main scoring function - Elite Assessment
export function calculateAssessmentResult(
  mcAnswers: MCAnswer[],
  scenarioAnswer: ScenarioAnswer
): AssessmentResult {
  const mcResult = scoreMCQuestions(mcAnswers);
  const part1Score = mcResult.rawScore;
  const part1Scaled = mcResult.scaledScore;
  const part2Score = scenarioAnswer.score;
  const totalScore = part1Scaled + part2Score;
  
  // Pass criteria: rawScore >= 80 AND scenario >= 4 AND total >= 16
  const passed = mcResult.rawScore >= 80 && part2Score >= 4 && totalScore >= 16;
  const categories = calculateCategories(mcAnswers);
  
  return {
    part1Score: part1Scaled,
    part2Score,
    totalScore,
    passed,
    categories
  };
}

// Assessment state management
export interface AssessmentAttempt {
  id: string;
  userId: string;
  status: 'draft' | 'in_progress' | 'submitted' | 'scored';
  mcQuestions: MCQuestion[];
  scenario: Scenario;
  currentPart: 1 | 2;
  currentQuestionIndex: number;
  mcAnswers: Record<string, string>;
  scenarioResponse: string;
  timeStarted: number;
  partTimeLeft: number;
  questionTimeLeft: number;
  proctorFlags: {
    focusChanges: number;
    pasteCount: number;
  };
}

// Auto-submit handlers
export function handleAutoSubmit(attempt: AssessmentAttempt): Partial<AssessmentAttempt> {
  if (attempt.currentPart === 1) {
    // Auto-advance to next question or part 2
    if (attempt.currentQuestionIndex < attempt.mcQuestions.length - 1) {
      return {
        currentQuestionIndex: attempt.currentQuestionIndex + 1,
        questionTimeLeft: 21
      };
    } else {
      return {
        currentPart: 2,
        partTimeLeft: 180, // 3 minutes for scenario
        currentQuestionIndex: 0
      };
    }
  } else {
    // Submit entire assessment
    return { status: 'submitted' };
  }
}

// Random question selection
export function selectRandomQuestions(questions: MCQuestion[], count: number): MCQuestion[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Random scenario selection
export function selectRandomScenario(scenarios: Scenario[]): Scenario {
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  return scenarios[randomIndex];
}