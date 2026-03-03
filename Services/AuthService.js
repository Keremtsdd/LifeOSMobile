import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Kendi bilgisayarının IP adresini veya API URL'ini buraya yaz
// Not: Android Emulator kullanıyorsan localhost yerine 10.0.2.2 kullanmalısın
const API_URL = "http://192.168.1.157:5251/api/Auth";

export const AuthService = {
  // KAYIT OLMA (Register)
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      console.error("Register Hatası:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // GİRİŞ YAPMA (Login)
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password,
      });

      // Giriş başarılıysa Token'ı telefona kaydet
      if (response.data.token) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("userName", response.data.fullName || "");
      }

      return response.data;
    } catch (error) {
      console.error("Login Hatası:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // ÇIKIŞ YAPMA (Logout)
  logout: async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userName");
  },

  // TOKEN KONTROLÜ (Kullanıcı zaten giriş yapmış mı?)
  getToken: async () => {
    return await AsyncStorage.getItem("userToken");
  },
};
