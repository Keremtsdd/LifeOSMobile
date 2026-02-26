import api from "./api";
export const ActivityService = {
  getAllUsersStats: async () => {
    try {
      const response = await api.get("/AdminActivities/all-users-stats");
      return response.data;
    } catch (error) {
      console.error("Stats retrieval failed:", error);
      throw error;
    }
  },

  getCategoryAnalytics: async () => {
    try {
      const response = await api.get("/AdminActivities/category-analytics");
      return response.data;
    } catch (error) {
      console.error("Category analytics retrieval failed:", error);
      return [];
    }
  },

  getSystemSummary: async () => {
    try {
      const response = await api.get("/AdminActivities/system-summary");
      return response.data;
    } catch (error) {
      console.error("System summary retrieval failed:", error);
      throw error;
    }
  },

  getAchievements: async () => {
    try {
      const response = await api.get("/Activities/achievements");
      return response.data;
    } catch (error) {
      console.error("Achievements retrieval failed:", error);
      throw error;
    }
  },

  getStatsSummary: async () => {
    try {
      const token =
        "eyJhbGciOiJFUzI1NiIsImtpZCI6IjJmNDg4OTFiLTlhODMtNGFlYy1hODBiLTQzZjUyYjllYTgxMSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3BienBnZXB3d2xnc3N0bm1vcGpiLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyNjg2N2U2Yy1iYjEzLTQ4NDMtYTI2MS04ZDBlMDNlMGQwMzgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzcyMTE0NjI5LCJpYXQiOjE3NzIxMTEwMjksImVtYWlsIjoidGFzdC5rZXJlbUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MjExMTAyOX1dLCJzZXNzaW9uX2lkIjoiZjQ2Yjg1OTktYjFhMi00YmVkLTlmOTItMTJiYzMwNThlY2VlIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.YG3cgnnGprSkpGZ5fL18G0VbgyZuHMH4ygB5sDmNClHoiQsgJyX49mUkWO3GY2p3p-V0hXker2lt148Ksm1kog";

      const response = await api.get("/Activities/stats-summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Stats API Hatası:", error.response?.status);
      throw error;
    }
  },
};
