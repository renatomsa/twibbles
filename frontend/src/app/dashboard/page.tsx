// app/dashboard/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import DashboardChart from "@/components/profile/dashboardChart";
import { useDashboard } from "@/lib/hooks/useDashboard";

interface PeriodOption {
  value: number;
  label: string;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 7, label: "Última Semana" },
  { value: 30, label: "Último Mês" },
  { value: 365, label: "Último Ano" }
];

// Helper function to format date in local timezone
const formatDateToLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DashboardPage() {
  const userId = 2007;
  const [period, setPeriod] = useState<number>(7);
  
  const { data, loading, error } = useDashboard(userId, period);

  const chartData = useMemo(() => {
    if (!data?.comments) return [];

    const commentMap = new Map(data.comments.map(([date, count]) => [date, count]));

    if (period === 7) {
      // Generate last 7 days
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return formatDateToLocal(date);
      }).reverse();

      return dates.map(date => ({
        label: date,
        commentCount: commentMap.get(date) || 0
      }));
    } else if (period === 30) {
      // Generate 30 points, one for each day
      const dates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return formatDateToLocal(date);
      }).reverse();

      return dates.map(date => ({
        label: date,
        commentCount: commentMap.get(date) || 0
      }));
    } else {
      // For yearly view, generate 13 points (12 months + 1 more point)
      const dates = Array.from({ length: 13 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return formatDateToLocal(date);
      }).reverse();

      return dates.map(date => {
        const dateObj = new Date(date);
        const nextDate = new Date(date);
        nextDate.setMonth(dateObj.getMonth() + 1);

        const totalComments = Array.from(commentMap.entries())
          .filter(([commentDate]) => {
            const commentDateObj = new Date(commentDate);
            return commentDateObj >= dateObj && commentDateObj < nextDate;
          })
          .reduce((sum, [_, count]) => sum + count, 0);

        return {
          label: date,
          commentCount: totalComments
        };
      });
    }
  }, [data, period]);

  return (
    <main className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="flex flex-col items-center max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-300">Estatísticas de desempenho</h1>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Carregando dados...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/30 text-red-300 px-6 py-4 rounded-lg">
            <p className="text-center">Erro: {error}</p>
          </div>
        )}
        
        {!loading && !error && (!data || chartData.length === 0) && (
          <div className="bg-gray-800/50 text-gray-400 px-6 py-4 rounded-lg">
            <p className="text-center">Nenhum dado disponível para o período selecionado</p>
          </div>
        )}
        
        {data && chartData.length > 0 && (
          <DashboardChart 
            data={chartData} 
            commentAvg={data.comment_avg} 
            period={period}
          />
        )}

        <div className="mt-8 flex space-x-4">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                period === option.value 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}