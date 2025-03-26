// src/lib/hooks/useDashboard.ts
import { useState, useEffect } from "react";
import { apiService } from "../api";

interface DashboardData {
  comment_avg: number;
  comments: Array<[string, number]>; // Now we're sure it's a string from backend
}
export const useDashboard = (userId: number, period: number) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await apiService.get<DashboardData>(
          `/post/${userId}/dashboard/${period}`
        );

        console.log('Raw API Response:', response);

        if (response.status_code === 200) {
          if (!response.data) {
            console.log('Response data is null or undefined');
          }
          setData(response.data);
        } else if (response.status_code === 404) {
          setError('Nenhum dado encontrado para o período selecionado');
        } else {
          throw new Error(response.message || 'Erro ao carregar dados');
        }
      } catch (err: any) {
        console.error('Error details:', err);
        setError(err?.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [userId, period]);

  return { data, loading, error };
};
