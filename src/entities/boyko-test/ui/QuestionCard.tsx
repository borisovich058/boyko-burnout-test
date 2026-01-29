import React from 'react';
import { BoykoQuestion } from '../model/types';
import './QuestionCard.css';

interface QuestionCardProps {
  question: BoykoQuestion;
  answer?: boolean;
  onAnswer: (value: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onAnswer,
  questionNumber,
  totalQuestions
}) => {
  return (
    <div className="question-card">
      <div className="question-progress">
        {questionNumber} / {totalQuestions}
      </div>
      
      <div className="question-text">
        {question.text}
      </div>
      
      <div className="answer-options">
        <button
          className={`answer-btn ${answer === true ? 'selected' : ''}`}
          onClick={() => onAnswer(true)}
          data-value="true"
        >
          Да
        </button>
        
        <button
          className={`answer-btn ${answer === false ? 'selected' : ''}`}
          onClick={() => onAnswer(false)}
          data-value="false"
        >
          Нет
        </button>
      </div>
    </div>
  );
};