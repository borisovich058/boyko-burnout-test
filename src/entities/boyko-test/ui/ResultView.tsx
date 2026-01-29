import React from 'react';
import { BoykoResult, Phase } from '../model/types';
import './ResultView.css';

interface ResultViewProps {
  result: BoykoResult;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const getPhaseName = (phase: Phase): string => {
    switch (phase) {
      case 'tension': return 'Фаза напряжения';
      case 'resistance': return 'Фаза резистенции';
      case 'exhaustion': return 'Фаза истощения';
    }
  };

  const getLevelName = (level: string): string => {
    switch (level) {
      case 'not_formed': return 'Не сформирован';
      case 'forming': return 'Формирующийся';
      case 'formed': return 'Сформированный';
      default: return level;
    }
  };

  const getBurnoutDescription = (level: string): string => {
    switch (level) {
      case 'low': return 'Низкий уровень выгорания';
      case 'medium': return 'Средний уровень выгорания';
      case 'high': return 'Высокий уровень выгорания';
      case 'critical': return 'Критический уровень выгорания';
      default: return '';
    }
  };

  return (
    <div className="result-container">
      <h2 className="result-title">Результаты тестирования</h2>
      
      <div className="overall-result">
        <div className={`burnout-card ${result.burnoutLevel}`}>
          <h3>Общий результат</h3>
          <p className="total-score">
            Общий балл: <strong>{result.overallScore}/84</strong>
          </p>
          <p className="burnout-level">
            {getBurnoutDescription(result.burnoutLevel)}
          </p>
        </div>
      </div>

      {(['tension', 'resistance', 'exhaustion'] as Phase[]).map((phase, index) => {
        const phaseResult = result[phase];
        
        return (
          <div key={phase} className="phase-result">
            <h3 className="phase-title">{getPhaseName(phase)}</h3>
            <div className="phase-header">
              <span>Баллы: {phaseResult.total}/{phaseResult.maxScore}</span>
              <span className={`phase-level ${phaseResult.level}`}>
                {getLevelName(phaseResult.level)}
              </span>
            </div>
            
            <div className="symptoms-grid">
              {Object.entries(phaseResult.symptoms).map(([symptom, data]) => (
                <div 
                  key={symptom} 
                  className="symptom-card"
                  data-level={data.level}
                >
                  <h4 className="symptom-name">{symptom}</h4>
                  <div className="symptom-score">
                    <span className="score">{data.score}</span>
                    <span className="max-score">/{data.maxScore}</span>
                  </div>
                  <div className={`symptom-level ${data.level}`}>
                    {getLevelName(data.level)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <button className="reset-btn" onClick={onReset}>
        Пройти тест заново
      </button>
    </div>
  );
};