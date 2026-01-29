import { 
  BoykoQuestion, 
  BoykoResult, 
  Phase, 
  SymptomResult, 
  PhaseResult 
} from './types';
import { 
  SYMPTOM_QUESTIONS_MAP, 
  PHASE_SYMPTOMS_MAP, 
  SYMPTOM_MAX_SCORES 
} from './symptomMapping';

export const calculateBoykoResult = (
  answers: Record<number, boolean>,
  questions: BoykoQuestion[]
): BoykoResult => {
  // Создаем индекс вопросов для быстрого доступа
  const questionById = questions.reduce((acc, q) => {
    acc[q.id] = q;
    return acc;
  }, {} as Record<number, BoykoQuestion>);

  // Инициализируем структуру результатов
  const result: BoykoResult = {
    tension: { total: 0, symptoms: {}, level: 'not_formed', maxScore: 28 },
    resistance: { total: 0, symptoms: {}, level: 'not_formed', maxScore: 28 },
    exhaustion: { total: 0, symptoms: {}, level: 'not_formed', maxScore: 27 },
    overallScore: 0,
    burnoutLevel: 'low'
  };

  // Рассчитываем баллы по симптомам
  Object.entries(SYMPTOM_QUESTIONS_MAP).forEach(([symptom, questionIds]) => {
    let symptomScore = 0;
    
    questionIds.forEach(questionId => {
      const question = questionById[questionId];
      const answer = answers[questionId];
      
      if (question && answer !== undefined) {
        // Учитываем прямые и обратные вопросы
        if (question.reverse) {
          // Для обратных: "нет" = 1 балл
          if (answer === false) symptomScore += 1;
        } else {
          // Для прямых: "да" = 1 балл
          if (answer === true) symptomScore += 1;
        }
      }
    });

    // Определяем фазу симптома
    let phase: Phase | null = null;
    for (const [phaseKey, symptoms] of Object.entries(PHASE_SYMPTOMS_MAP)) {
      if (symptoms.includes(symptom)) {
        phase = phaseKey as Phase;
        break;
      }
    }

    if (phase) {
      // Добавляем результат симптома
      result[phase].symptoms[symptom] = {
        score: symptomScore,
        level: getSymptomLevel(symptomScore, symptom),
        maxScore: SYMPTOM_MAX_SCORES[symptom]
      };
      
      // Суммируем в общий балл фазы
      result[phase].total += symptomScore;
    }
  });

  // Определяем уровни для фаз
  (Object.keys(PHASE_SYMPTOMS_MAP) as Phase[]).forEach(phase => {
    result[phase].level = getPhaseLevel(result[phase].total, phase);
  });

  // Общий балл
  result.overallScore = 
    result.tension.total + 
    result.resistance.total + 
    result.exhaustion.total;

  // Общий уровень выгорания
  result.burnoutLevel = getOverallBurnoutLevel(result.overallScore);

  return result;
};

// Вспомогательные функции
const getSymptomLevel = (score: number, symptom: string): SymptomResult['level'] => {
  const maxScore = SYMPTOM_MAX_SCORES[symptom];
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 85) return 'formed';
  if (percentage >= 50) return 'forming';
  return 'not_formed';
};

const getPhaseLevel = (score: number, phase: Phase): PhaseResult['level'] => {
  const thresholds = {
    tension: { forming: 18, formed: 30 },
    resistance: { forming: 15, formed: 25 },
    exhaustion: { forming: 9, formed: 15 }
  };
  
  if (score >= thresholds[phase].formed) return 'formed';
  if (score >= thresholds[phase].forming) return 'forming';
  return 'not_formed';
};

const getOverallBurnoutLevel = (score: number): BoykoResult['burnoutLevel'] => {
  if (score >= 60) return 'critical';
  if (score >= 40) return 'high';
  if (score >= 20) return 'medium';
  return 'low';
};

// Хелпер для генерации случайного порядка вопросов
export const getRandomizedQuestions = (questions: BoykoQuestion[]): BoykoQuestion[] => {
  // Фиксированная перемешка для воспроизводимости
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};