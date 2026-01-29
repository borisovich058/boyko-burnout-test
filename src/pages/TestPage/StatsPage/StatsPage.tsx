import React, { useState, useEffect } from "react";
import { testResultsApi } from "@/entities/boyko-test/model/api";
import { AggregatedStats } from "@/shared/api/supabase";
import "./StatsPage.css";

export const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<AggregatedStats[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalTests: 0,
    avgOverallScore: 0,
    avgTensionScore: 0,
    avgResistanceScore: 0,
    avgExhaustionScore: 0,
    distribution: { low: 0, medium: 0, high: 0, critical: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [aggregatedStats, overall] = await Promise.all([
        testResultsApi.getAggregatedStats(7),
        testResultsApi.getOverallStatistics(),
      ]);
      setStats(aggregatedStats);
      setOverallStats(overall);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const latestDay = stats[stats.length - 1];
  const totalParticipants = overallStats.totalTests;
  const { distribution } = overallStats;

  return (
    <div className="stats-container">
      <header className="stats-header">
        <h1>📊 Статистика результатов</h1>
        <p>Анализ данных по всем пройденным тестам</p>
      </header>

      <div className="stats-summary">
        <div className="summary-card">
          <h3>Всего тестов</h3>
          <p className="summary-value">{totalParticipants}</p>
        </div>

        <div className="summary-card">
          <h3>Средний балл</h3>
          <p className="summary-value">
            {overallStats.avgOverallScore.toFixed(1)}/84
          </p>
        </div>

        <div className="summary-card">
          <h3>За сегодня</h3>
          <p className="summary-value">{latestDay?.total_tests || 0}</p>
        </div>
      </div>

      <div className="detailed-stats">
        <div className="stat-box">
          <h3>Средние баллы по фазам</h3>
          <div className="phase-scores">
            <div className="phase-score">
              <span className="phase-label">Напряжение:</span>
              <span className="phase-value">
                {overallStats.avgTensionScore.toFixed(1)}/36
              </span>
            </div>
            <div className="phase-score">
              <span className="phase-label">Резистенция:</span>
              <span className="phase-value">
                {overallStats.avgResistanceScore.toFixed(1)}/30
              </span>
            </div>
            <div className="phase-score">
              <span className="phase-label">Истощение:</span>
              <span className="phase-value">
                {overallStats.avgExhaustionScore.toFixed(1)}/27
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="distribution-section">
        <h2>Распределение по уровням выгорания</h2>
        <div className="distribution-grid">
          <div className="level-card low">
            <h4>Низкий</h4>
            <p className="level-count">{distribution.low}</p>
            <div className="level-bar">
              <div
                className="level-fill"
                style={{
                  width:
                    totalParticipants > 0
                      ? `${(distribution.low / totalParticipants) * 100}%`
                      : "0%",
                }}
              ></div>
            </div>
            <p className="level-percentage">
              {totalParticipants > 0
                ? `${((distribution.low / totalParticipants) * 100).toFixed(1)}%`
                : "0%"}
            </p>
          </div>

          <div className="level-card medium">
            <h4>Средний</h4>
            <p className="level-count">{distribution.medium}</p>
            <div className="level-bar">
              <div
                className="level-fill"
                style={{
                  width:
                    totalParticipants > 0
                      ? `${(distribution.medium / totalParticipants) * 100}%`
                      : "0%",
                }}
              ></div>
            </div>
            <p className="level-percentage">
              {totalParticipants > 0
                ? `${((distribution.medium / totalParticipants) * 100).toFixed(1)}%`
                : "0%"}
            </p>
          </div>

          <div className="level-card high">
            <h4>Высокий</h4>
            <p className="level-count">{distribution.high}</p>
            <div className="level-bar">
              <div
                className="level-fill"
                style={{
                  width:
                    totalParticipants > 0
                      ? `${(distribution.high / totalParticipants) * 100}%`
                      : "0%",
                }}
              ></div>
            </div>
            <p className="level-percentage">
              {totalParticipants > 0
                ? `${((distribution.high / totalParticipants) * 100).toFixed(1)}%`
                : "0%"}
            </p>
          </div>

          <div className="level-card critical">
            <h4>Критический</h4>
            <p className="level-count">{distribution.critical}</p>
            <div className="level-bar">
              <div
                className="level-fill"
                style={{
                  width:
                    totalParticipants > 0
                      ? `${(distribution.critical / totalParticipants) * 100}%`
                      : "0%",
                }}
              ></div>
            </div>
            <p className="level-percentage">
              {totalParticipants > 0
                ? `${((distribution.critical / totalParticipants) * 100).toFixed(1)}%`
                : "0%"}
            </p>
          </div>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="chart-section">
          <h2>Активность за последние 7 дней</h2>
          <div className="chart">
            {stats.map((day) => {
              const maxTests = Math.max(...stats.map((s) => s.total_tests), 1);
              return (
                <div key={day.date} className="chart-day">
                  <div className="chart-bar-container">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${Math.max(10, (day.total_tests / maxTests) * 100)}%`,
                      }}
                      title={`${day.date}: ${day.total_tests} тестов`}
                    >
                      <span className="chart-value">{day.total_tests}</span>
                    </div>
                  </div>
                  <div className="chart-label">
                    {new Date(day.date).toLocaleDateString("ru-RU", {
                      weekday: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button className="refresh-btn" onClick={loadStats} disabled={loading}>
        {loading ? "Обновление..." : "🔄 Обновить статистику"}
      </button>
    </div>
  );
};
