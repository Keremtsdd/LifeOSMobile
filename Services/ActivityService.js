import { Platform } from "react-native";
import api from "./api";
const token =
  "eyJhbGciOiJFUzI1NiIsImtpZCI6IjJmNDg4OTFiLTlhODMtNGFlYy1hODBiLTQzZjUyYjllYTgxMSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3BienBnZXB3d2xnc3N0bm1vcGpiLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyNjg2N2U2Yy1iYjEzLTQ4NDMtYTI2MS04ZDBlMDNlMGQwMzgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzcyNTM2NDUzLCJpYXQiOjE3NzI1MzI4NTMsImVtYWlsIjoidGFzdC5rZXJlbUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc3MjUzMjg1M31dLCJzZXNzaW9uX2lkIjoiOWYzYjc5MDAtOWI0Yi00ZmZjLWJiYTQtZDIwZWU0N2IxZjViIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.E4WHt42AVVOFEIdc3KELHeCpjKNOWG_z9I9poyQ_NR2uy0BXmKZXPXGNnXTeytjmhyn1ZzA9eLDJtMqi8UctCA";
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

  updateProfilePicture: async (uri) => {
    const formData = new FormData();

    formData.append("File", {
      uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
      name: `user_profile.jpg`, // Sabit bir isim verelim
      type: "image/jpeg",
    });

    try {
      const response = await api.post(
        "/User/update-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          transformRequest: (data) => data,
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        "Profil resmi yüklenirken hata oluştu:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  getLeaderboard: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/Activities/leaderboard`, {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Leaderboard retrieval failed:", error);
      throw error;
    }
  },
};
