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

  getCategories: async () => {
    try {
      const response = await api.get("/Activities/categories");
      return response.data;
    } catch (error) {
      console.error("Categories retrieval failed:", error);
      throw error;
    }
  },

  getStatsSummary: async () => {
    try {
      const token =
        "eyJhbGciOiJFUzI1NiIsImtpZCI6IjJmNDg4OTFiLTlhODMtNGFlYy1hODBiLTQzZjUyYjllYTgxMSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3BienBnZXB3d2xnc3N0bm1vcGpiLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyNjg2N2U2Yy1iYjEzLTQ4NDMtYTI2MS04ZDBlMDNlMGQwMzgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzcyMTk0MzQ2LCJpYXQiOjE3NzIxOTA3NDYsImVtYWlsIjoidGFzdC5rZXJlbUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MjE5MDc0Nn1dLCJzZXNzaW9uX2lkIjoiMjY0ZjgwYjktMzBjMC00NzVmLWEzYmItYmQ2MDA0NWY0ZDRlIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.gmZyC6yfqTit5SmVPFgrg2tm-L1pc71OmBZG69H4-ZNO2i61yBk6Xd8ILqFakfBeHgz164Vf_jdM21s9r8TsvA";

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

  addActivity: async (activityData) => {
    try {
      const token =
        "eyJhbGciOiJFUzI1NiIsImtpZCI6IjJmNDg4OTFiLTlhODMtNGFlYy1hODBiLTQzZjUyYjllYTgxMSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3BienBnZXB3d2xnc3N0bm1vcGpiLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyNjg2N2U2Yy1iYjEzLTQ4NDMtYTI2MS04ZDBlMDNlMGQwMzgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzcyMTk0MzQ2LCJpYXQiOjE3NzIxOTA3NDYsImVtYWlsIjoidGFzdC5rZXJlbUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MjE5MDc0Nn1dLCJzZXNzaW9uX2lkIjoiMjY0ZjgwYjktMzBjMC00NzVmLWEzYmItYmQ2MDA0NWY0ZDRlIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.gmZyC6yfqTit5SmVPFgrg2tm-L1pc71OmBZG69H4-ZNO2i61yBk6Xd8ILqFakfBeHgz164Vf_jdM21s9r8TsvA";

      const response = await api.post("/Activities/create", activityData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Aktivite ekleme servisi hatası:", error);
      throw error;
    }
  },
};
