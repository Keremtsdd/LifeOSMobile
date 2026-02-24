// app/(tabs)/index.jsx
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { ActivityService } from "../../Services/ActivityService";
import "../../global.css";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await ActivityService.getAllUsersStats();
      console.log("Gelen Ham Veri:", JSON.stringify(data, null, 2)); // Burayı kontrol et
      // Gelen veri bir dizi (Array) olmalı
      setStats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Backend bağlantı hatası! IP ve Portu kontrol et.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Kerem Taşdemir verisini bulalım
  const myData =
    stats && stats.length > 0
      ? stats.find((u) => u.email === "") || stats[0]
      : null;

  return (
    <ScrollView
      className="flex-1 bg-slate-950 p-4"
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadData}
          tintColor="#60a5fa"
        />
      }
    >
      <Text className="text-white text-2xl font-bold mb-6 mt-4">Dashboard</Text>

      <View className="bg-blue-600 rounded-3xl p-6 shadow-xl mb-6">
        <Text className="text-blue-100 text-lg">Toplam Gelişim</Text>
        <Text className="text-white text-5xl font-extrabold my-2">
          {myData?.totalXP || 0} XP
        </Text>
        <View className="bg-blue-500 h-2 rounded-full mt-4">
          <View className="bg-white h-2 rounded-full w-[57%]" />
        </View>
        <Text className="text-blue-100 mt-2 text-right">Seviye 1</Text>
      </View>

      <View className="flex-row justify-between mb-6">
        <View className="bg-slate-900 w-[48%] p-4 rounded-2xl border border-slate-800">
          <Text className="text-slate-400">Aktivite Sayısı</Text>
          <Text className="text-white text-xl font-bold">
            {myData?.activityCount || 0}
          </Text>
        </View>
        <View className="bg-slate-900 w-[48%] p-4 rounded-2xl border border-slate-800">
          <Text className="text-slate-400">Son Aktivite</Text>
          <Text className="text-white text-sm font-bold" numberOfLines={1}>
            {myData?.lastActivity || "Yok"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
