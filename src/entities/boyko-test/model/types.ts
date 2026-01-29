export type Phase = 'tension' | 'resistance' | 'exhaustion';

export interface BoykoQuestion {
  id: number;
  text: string;
  phase: Phase;
  symptom: string;
  reverse?: boolean;
}

export interface SymptomResult {
  score: number;
  level: 'not_formed' | 'forming' | 'formed';
  maxScore: number;
}

export interface PhaseResult {
  total: number;
  symptoms: Record<string, SymptomResult>;
  level: 'not_formed' | 'forming' | 'formed';
  maxScore: number;
}

export interface BoykoResult {
  tension: PhaseResult;
  resistance: PhaseResult;
  exhaustion: PhaseResult;
  overallScore: number;
  burnoutLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface TestState {
  answers: Record<number, boolean>;
  currentQuestionIndex: number;
  isCompleted: boolean;
  result: BoykoResult | null;
}