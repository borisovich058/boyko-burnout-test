import React, { useState } from 'react';
import './DemographicForm.css';

interface DemographicFormProps {
  onSubmit: (data: DemographicData) => void;
  onSkip: () => void;
}

export interface DemographicData {
  consent: boolean;
  gender?: string;
  age?: number;
  position?: string;
  otherPosition?: string;
  experience_years?: number;
  work_format?: string;
  work_hours?: string;
  overtime?: string;
}

export const DemographicForm: React.FC<DemographicFormProps> = ({ onSubmit, onSkip }) => {
  const [step, setStep] = useState<'consent' | 'demographics'>('consent');
  const [formData, setFormData] = useState<DemographicData>({ 
    consent: false,
    gender: '',
    position: '',
    work_format: '',
    work_hours: '',
    overtime: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DemographicData, string>>>({});

  const validateConsent = (): boolean => {
    if (!formData.consent) {
      setErrors({ consent: 'Для участия в исследовании необходимо дать согласие' });
      return false;
    }
    return true;
  };

  const validateDemographics = (): boolean => {
    const newErrors: Partial<Record<keyof DemographicData, string>> = {};

    if (formData.age !== undefined) {
      if (!formData.age) {
        newErrors.age = 'Укажите возраст';
      } else if (formData.age < 18 || formData.age > 100) {
        newErrors.age = 'Возраст должен быть от 18 до 100 лет';
      }
    }

    if (formData.experience_years !== undefined && formData.experience_years < 0) {
      newErrors.experience_years = 'Опыт не может быть отрицательным';
    }

    if (!formData.position) {
      newErrors.position = 'Укажите вашу должность';
    }

    if (!formData.work_format) {
      newErrors.work_format = 'Укажите формат работы';
    }

    if (!formData.work_hours) {
      newErrors.work_hours = 'Укажите продолжительность рабочего дня';
    }

    if (!formData.overtime) {
      newErrors.overtime = 'Укажите частоту работы сверхурочно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConsentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateConsent()) {
      setStep('demographics');
    }
  };

  const handleDemographicsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDemographics()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof DemographicData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const renderConsentStep = () => (
    <div className="consent-step">
      <div className="consent-header">
        <h2>Информированное согласие на участие в исследовании</h2>
        <div className="consent-icon">📋</div>
      </div>
      
      <div className="consent-content">
        <div className="consent-text">
          <h3>Цель исследования:</h3>
          <p>Изучение уровня эмоционального выгорания среди IT-специалистов с использованием методики В.В. Бойко.</p>
          
          <h3>Что от вас потребуется:</h3>
          <ul>
            <li>Ответить на 84 вопроса опросника</li>
            <li>Заполнить демографическую анкету</li>
            <li>Затраты времени: 15-20 минут</li>
          </ul>
          
          <h3>Конфиденциальность:</h3>
          <ul>
            <li>Все данные собираются анонимно</li>
            <li>Результаты используются только в агрегированном виде</li>
            <li>Ваши личные данные не передаются третьим лицам</li>
          </ul>
          
          <h3>Права участника:</h3>
          <ul>
            <li>Вы можете отказаться от участия в любой момент</li>
            <li>Вы можете пропустить любой вопрос</li>
            <li>Вы можете запросить удаление своих данных</li>
          </ul>
          
          <div className="contact-info">
            <p><strong>Контактная информация исследователя:</strong></p>
            <p>Если у вас есть вопросы, свяжитесь с нами: research@example.com</p>
          </div>
        </div>
        
        <form onSubmit={handleConsentSubmit} className="consent-form">
          <div className="consent-question">
            <div className="consent-label">
              Я ознакомился(лась) с информацией об исследовании и даю согласие на участие.*
            </div>
            <div className="consent-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="consent"
                  checked={formData.consent === true}
                  onChange={() => handleChange('consent', true)}
                />
                <span>Да</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="consent"
                  checked={formData.consent === false}
                  onChange={() => handleChange('consent', false)}
                />
                <span>Нет</span>
              </label>
            </div>
            {errors.consent && <div className="error-message">{errors.consent}</div>}
          </div>
          
          <div className="form-buttons">
            <button 
              type="button" 
              className="skip-btn"
              onClick={onSkip}
            >
              Не участвовать
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!formData.consent}
            >
              Дать согласие и продолжить
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderDemographicsStep = () => (
    <div className="demographics-step">
      <div className="step-header">
        <h2>Социо-демографические данные</h2>
        <p className="step-description">
          Данный этап направлен на уточнение ваших данных.
          Все поля обязательны для заполнения.
        </p>
      </div>
      
      <form onSubmit={handleDemographicsSubmit} className="demographics-form">
        <div className="form-section">
          <h3>Основная информация</h3>
          
          <div className="form-group">
            <label htmlFor="gender">Ваш пол:*</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={errors.gender ? 'error' : ''}
            >
              <option value="">Выберите пол</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="prefer_not_to_say">Не скажу</option>
            </select>
            {errors.gender && <div className="error-message">{errors.gender}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Ваш возраст (полных лет):*</label>
            <input
              id="age"
              type="number"
              min="18"
              max="100"
              value={formData.age || ''}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || undefined)}
              placeholder="Укажите ваш возраст"
              className={errors.age ? 'error' : ''}
            />
            {errors.age && <div className="error-message">{errors.age}</div>}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Профессиональные данные</h3>
          
          <div className="form-group">
            <label>Ваша должность в IT:*</label>
            <div className="radio-group">
              {[
                'Frontend-разработчик',
                'Backend-разработчик', 
                'QA / Тестировщик',
                'DevOps',
                'Аналитик',
                'Менеджер проекта / продукта',
                'Другое'
              ].map(position => (
                <label key={position} className="radio-option">
                  <input
                    type="radio"
                    name="position"
                    value={position}
                    checked={formData.position === position}
                    onChange={(e) => handleChange('position', e.target.value)}
                  />
                  <span>{position}</span>
                </label>
              ))}
            </div>
            {errors.position && <div className="error-message">{errors.position}</div>}
          </div>
          
          {formData.position === 'Другое' && (
            <div className="form-group">
              <label htmlFor="otherPosition">Укажите вашу должность:*</label>
              <input
                id="otherPosition"
                type="text"
                value={formData.otherPosition || ''}
                onChange={(e) => handleChange('otherPosition', e.target.value)}
                placeholder="Ваша должность"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="experience">Стаж работы в IT (в годах):*</label>
            <input
              id="experience"
              type="number"
              min="0"
              max="50"
              value={formData.experience_years || ''}
              onChange={(e) => handleChange('experience_years', parseInt(e.target.value) || undefined)}
              placeholder="Укажите стаж работы"
              className={errors.experience_years ? 'error' : ''}
            />
            {errors.experience_years && <div className="error-message">{errors.experience_years}</div>}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Условия работы</h3>
          
          <div className="form-group">
            <label>Формат работы:*</label>
            <div className="radio-group">
              {['Удалённый', 'Офисный', 'Гибридный'].map(format => (
                <label key={format} className="radio-option">
                  <input
                    type="radio"
                    name="work_format"
                    value={format}
                    checked={formData.work_format === format}
                    onChange={(e) => handleChange('work_format', e.target.value)}
                  />
                  <span>{format}</span>
                </label>
              ))}
            </div>
            {errors.work_format && <div className="error-message">{errors.work_format}</div>}
          </div>
          
          <div className="form-group">
            <label>Средняя продолжительность рабочего дня:*</label>
            <div className="radio-group">
              {[
                'До 8 часов',
                '8–9 часов', 
                '9–10 часов',
                'Более 10 часов'
              ].map(hours => (
                <label key={hours} className="radio-option">
                  <input
                    type="radio"
                    name="work_hours"
                    value={hours}
                    checked={formData.work_hours === hours}
                    onChange={(e) => handleChange('work_hours', e.target.value)}
                  />
                  <span>{hours}</span>
                </label>
              ))}
            </div>
            {errors.work_hours && <div className="error-message">{errors.work_hours}</div>}
          </div>
          
          <div className="form-group">
            <label>Работаете ли вы сверхурочно?*</label>
            <div className="radio-group">
              {[
                'Практически никогда',
                'Иногда', 
                'Часто',
                'Постоянно'
              ].map(freq => (
                <label key={freq} className="radio-option">
                  <input
                    type="radio"
                    name="overtime"
                    value={freq}
                    checked={formData.overtime === freq}
                    onChange={(e) => handleChange('overtime', e.target.value)}
                  />
                  <span>{freq}</span>
                </label>
              ))}
            </div>
            {errors.overtime && <div className="error-message">{errors.overtime}</div>}
          </div>
        </div>
        
        <div className="form-buttons">
          <button 
            type="button" 
            className="back-btn"
            onClick={() => setStep('consent')}
          >
            Назад
          </button>
          <button 
            type="submit" 
            className="submit-btn"
          >
            Сохранить и посмотреть результат
          </button>
        </div>
        
        <div className="privacy-note">
          <div className="privacy-icon">🔒</div>
          <div>
            <p><strong>Конфиденциальность гарантирована</strong></p>
            <p>Все данные анонимны и используются только для научного исследования.</p>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div className="demographic-form-overlay">
      <div className="demographic-form-container">
        {step === 'consent' ? renderConsentStep() : renderDemographicsStep()}
      </div>
    </div>
  );
};