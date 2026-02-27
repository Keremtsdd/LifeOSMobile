import api from "./api";
const token =
  "eyJhbGciOiJFUzI1NiIsImtpZCI6IjJmNDg4OTFiLTlhODMtNGFlYy1hODBiLTQzZjUyYjllYTgxMSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3BienBnZXB3d2xnc3N0bm1vcGpiLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyNjg2N2U2Yy1iYjEzLTQ4NDMtYTI2MS04ZDBlMDNlMGQwMzgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzcyMTk4NTU1LCJpYXQiOjE3NzIxOTQ5NTUsImVtYWlsIjoidGFzdC5rZXJlbUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MjE5NDk1NX1dLCJzZXNzaW9uX2lkIjoiYjUxZWRlZTctMjAwMy00NTVlLTg5Y2MtNDQwNjM2YWI5MjU3IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.oIvCbeqYh47u7028J22dxgfRvGDEExj_oT-y8O_BZ3uDZUZOE6H4csatYAxt3My0pKQR8Oh72O6JGQP1XCnCkA";

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

  getUserProfile: async () => {
    const response = await api.get("/Activities/user-profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getMyActivities: async () => {
    try {
      const response = await api.get("/Activities/my-activities");
      return response.data;
    } catch (error) {
      console.error("My activities retrieval failed:", error);
      throw error;
    }
  },
};
