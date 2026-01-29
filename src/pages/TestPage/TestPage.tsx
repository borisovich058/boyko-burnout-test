import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TestState } from '../../entities/boyko-test/model/types';
import { BOYKO_QUESTIONS } from '../../entities/boyko-test/model/questions';
import { calculateBoykoResult, getRandomizedQuestions } from '../../entities/boyko-test/model/calculateResult';
import { testResultsApi } from '../../entities/boyko-test/model/api';
import { QuestionCard } from '../../entities/boyko-test/ui/QuestionCard';
import { ResultView } from '../../entities/boyko-test/ui/ResultView';
import { DemographicForm, DemographicData } from '../../entities/boyko-test/ui/DemographicForm';
import toast, { Toaster } from 'react-hot-toast';
import './TestPage.css';

export const TestPage: React.FC = () => {
  const [state, setState] = useState<TestState>({
    answers: {},
    currentQuestionIndex: 0,
    isCompleted: false,
    result: null
  });

  const [showDemographicForm, setShowDemographicForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const testStartTime = useRef<number>(Date.now());

  // Генерируем случайный порядок вопросов при монтировании
  const randomizedQuestions = useMemo(() => 
    getRandomizedQuestions(BOYKO_QUESTIONS), 
    []
  );

  const currentQuestion = randomizedQuestions[state.currentQuestionIndex];

  const handleAnswer = (value: boolean) => {
  const newAnswers = {
    ...state.answers,
    [currentQuestion.id]: value
  };

  const isLastQuestion = state.currentQuestionIndex === randomizedQuestions.length - 1;
  
  if (isLastQuestion) {
    const result = calculateBoykoResult(newAnswers, BOYKO_QUESTIONS);
    setState(prev => ({
      ...prev,
      answers: newAnswers,
      result
    }));
    
    // НЕ показываем форму демографии сразу
    // Сначала пользователь должен дать согласие
    setShowDemographicForm(true);
  } else {
    setState(prev => ({
      ...prev,
      answers: newAnswers,
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
  }
};

  const saveResult = async (demographics?: DemographicData) => {
    if (!state.result || isSaving) return;

    setIsSaving(true);
    const sessionDuration = Date.now() - testStartTime.current;

    try {
      await toast.promise(
        testResultsApi.saveResult(state.result, sessionDuration, demographics),
        {
          loading: 'Сохраняем результат...',
          success: 'Результат сохранен!',
          error: 'Ошибка при сохранении'
        }
      );

      setState(prev => ({ ...prev, isCompleted: true }));
      setShowDemographicForm(false);
    } catch (error) {
      console.error('Failed to save result:', error);
      // Все равно показываем результат даже при ошибке сохранения
      setState(prev => ({ ...prev, isCompleted: true }));
      setShowDemographicForm(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDemographicSubmit = (data: DemographicData) => {
    saveResult(data);
  };

  const handleSkipDemographic = () => {
    saveResult();
  };

  const handleReset = () => {
    testStartTime.current = Date.now();
    setState({
      answers: {},
      currentQuestionIndex: 0,
      isCompleted: false,
      result: null
    });
    setShowDemographicForm(false);
  };

  // Если тест завершен и есть результат, но еще не показана форма демографии
  useEffect(() => {
    if (state.result && !state.isCompleted && !showDemographicForm) {
      setShowDemographicForm(true);
    }
  }, [state.result, state.isCompleted, showDemographicForm]);

  if (showDemographicForm) {
    return (
      <>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <DemographicForm
          onSubmit={handleDemographicSubmit}
          onSkip={handleSkipDemographic}
        />
      </>
    );
  }

  if (state.isCompleted && state.result) {
    return (
      <>
        <Toaster position="top-right" />
        <ResultView result={state.result} onReset={handleReset} />
      </>
    );
  }

  const progress = ((state.currentQuestionIndex + 1) / randomizedQuestions.length) * 100;

  return (
    <div className="test-container">
      <Toaster position="top-right" />
      
      <header className="test-header">
        <h1>Опросник эмоционального выгорания В.В. Бойко</h1>
        <p className="test-description">
          Методика диагностики уровня эмоционального выгорания, 
          содержащая 84 утверждения и три фазы: напряжение, резистенция, истощение.
        </p>
      </header>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="test-content">
        <QuestionCard
          question={currentQuestion}
          answer={state.answers[currentQuestion.id]}
          onAnswer={handleAnswer}
          questionNumber={state.currentQuestionIndex + 1}
          totalQuestions={randomizedQuestions.length}
        />
      </div>

      <div className="test-instructions">
        <h3>Инструкция:</h3>
        <p>Внимательно прочитайте каждое утверждение и выберите ответ "Да" или "Нет".</p>
        <p>Отвечайте искренне, первый пришедший в голову ответ обычно наиболее верный.</p>
        <p className="privacy-notice">
          🔒 Ваши ответы анонимны и будут использованы только для статистического анализа.
        </p>
      </div>

      <div className="test-stats">
        <small>
          Пройдено вопросов: {Object.keys(state.answers).length} из {randomizedQuestions.length}
        </small>
      </div>
    </div>
  );
};