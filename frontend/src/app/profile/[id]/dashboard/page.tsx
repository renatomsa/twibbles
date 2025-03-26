// app/dashboard/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
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

async function getInitialData(): Promise<number> {
  const response = await fetch('/api/auth/current-user');
  const { userId } = await response.json();
  return Number(userId);
}

// Helper function to format date in local timezone
const formatDateToLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DashboardPage({ params }: { params: { id: string } }) {
  const profileId = Number(params.id);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [period, setPeriod] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentId = await getInitialData();
        setCurrentUserId(currentId);
        setIsCurrentUser(currentId === profileId);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [profileId]);

  const { data, loading: dataLoading, error } = useDashboard(profileId, period);
  const loading = isLoading || dataLoading;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D] mx-auto"></div>
          <p className="mt-4 text-[#2D2D2D]">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Verifica se o usuário atual pode ver o dashboard (apenas o próprio usuário pode ver)
  if (!isCurrentUser && currentUserId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
        <div className="text-[#2D2D2D] text-center">
          <h2 className="text-xl font-semibold mb-4">Acesso negado</h2>
          <p>Você não tem permissão para visualizar este dashboard.</p>
        </div>
      </div>
    );
  }
  return (
    <main className="p-8 bg-[#FFFFFF] min-h-screen text-[#2D2D2D] mt-16">
      <div className="flex flex-col items-center max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-cyan-900">Estatísticas de desempenho</h1>
  
        {error && (
          <div className="bg-[#FFFFFF] text-white-600 px-6 py-4 rounded-lg">
            <p className="text-center">{error}</p>
          </div>
        )}
        
        {!loading && !error && (!data || chartData.length === 0) && (
          <div className="bg-[#2D2D2D] text-[#FFFFFF] px-6 py-4 rounded-lg">
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
                  ? "bg-[#2D2D2D] text-[#FFFFFF] shadow-sm" 
                  : "bg-[#E0E0E0] text-[#2D2D2D] hover:bg-[#D0D0D0]"
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