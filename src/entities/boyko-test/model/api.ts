import {
  supabase,
  TestResultInsert,
} from "@/shared/api/supabase";
import { BoykoResult } from "./types";
import { DemographicData } from "../ui/DemographicForm";

export const testResultsApi = {
  // Сохранение результата теста
  async saveResult(
    result: BoykoResult,
    sessionDuration: number,
    demographics?: DemographicData,
  ) {
    const data: TestResultInsert = {
      // Обязательные поля
      tension_score: result.tension.total,
      resistance_score: result.resistance.total,
      exhaustion_score: result.exhaustion.total,
      overall_score: result.overallScore,
      burnout_level: result.burnoutLevel,
      symptoms: result,
      phases: {
        tension: result.tension,
        resistance: result.resistance,
        exhaustion: result.exhaustion,
      },
      session_duration: Math.round(sessionDuration / 1000),
      user_agent: navigator.userAgent,

      // Согласие и демографические данные
      consent: demographics?.consent ?? false,
      gender: demographics?.gender,
      age: demographics?.age,
      position: demographics?.position,
      other_position: demographics?.otherPosition,
      experience_years: demographics?.experience_years,
      work_format: demographics?.work_format,
      work_hours: demographics?.work_hours,
      overtime: demographics?.overtime,
    };

    const { data: savedResult, error } = await supabase
      .from("test_results")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error saving result:", error);
      throw error;
    }

    return savedResult;
  },

  // Получение агрегированной статистики
  async getAggregatedStats(days: number = 30) {
    const { data, error } = await supabase
      .from("aggregated_stats")
      .select("*")
      .order("date", { ascending: false })
      .limit(days);

    if (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }

    return (data || []).reverse(); // чтобы старые данные были первыми
  },

  // Получение общей статистики
  async getOverallStats() {
    const { data, error } = await supabase.from("test_results").select("*");

    if (error) {
      console.error("Error fetching overall stats:", error);
      throw error;
    }

    return data;
  },

  // Получение распределения по уровням
  async getBurnoutLevelDistribution() {
    const { data, error } = await supabase
      .from("test_results")
      .select("burnout_level");

    if (error) {
      console.error("Error fetching distribution:", error);
      throw error;
    }

    const distribution = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    data?.forEach((item) => {
      distribution[item.burnout_level as keyof typeof distribution]++;
    });

    return distribution;
  },

  // Получение средней длительности сессии
  async getAverageSessionDuration() {
    const { data, error } = await supabase
      .from("test_results")
      .select("session_duration");

    if (error) {
      console.error("Error fetching session durations:", error);
      throw error;
    }

    const durations =
      data?.filter((d) => d.session_duration).map((d) => d.session_duration) ||
      [];
    const average =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;

    return Math.round(average);
  },

  async getOverallStatistics() {
  const { data, error } = await supabase
    .from('test_results')
    .select('*');

  if (error) {
    console.error('Error fetching overall stats:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      totalTests: 0,
      avgOverallScore: 0,
      avgTensionScore: 0,
      avgResistanceScore: 0,
      avgExhaustionScore: 0,
      distribution: { low: 0, medium: 0, high: 0, critical: 0 }
    };
  }

  const totalTests = data.length;
  
  // Правильный расчет средних
  const totalOverall = data.reduce((sum, item) => sum + item.overall_score, 0);
  const totalTension = data.reduce((sum, item) => sum + item.tension_score, 0);
  const totalResistance = data.reduce((sum, item) => sum + item.resistance_score, 0);
  const totalExhaustion = data.reduce((sum, item) => sum + item.exhaustion_score, 0);

  // Распределение по уровням
  const distribution = {
    low: data.filter(item => item.burnout_level === 'low').length,
    medium: data.filter(item => item.burnout_level === 'medium').length,
    high: data.filter(item => item.burnout_level === 'high').length,
    critical: data.filter(item => item.burnout_level === 'critical').length
  };

  return {
    totalTests,
    avgOverallScore: totalOverall / totalTests,
    avgTensionScore: totalTension / totalTests,
    avgResistanceScore: totalResistance / totalTests,
    avgExhaustionScore: totalExhaustion / totalTests,
    distribution
  };
},
};
