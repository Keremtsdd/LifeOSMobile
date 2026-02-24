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
      throw error;
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
};
