// app/(tabs)/index.jsx
import { Activity, Calendar, MapPin, Trophy } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import "../../global.css";
import { ActivityService } from "../../Services/ActivityService";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, categoryData] = await Promise.all([
        ActivityService.getAllUsersStats(),
        ActivityService.getCategoryAnalytics(),
      ]);

      setStats(Array.isArray(statsData) ? statsData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (error) {
      console.error("Veri yükleme hatası!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const myData =
    stats && stats.length > 0
      ? stats.find((u) => u.email === "") || stats[0]
      : null;

  // GRAFİK VERİSİ HAZIRLAMA (Hata korumalı)
  const hasChartData = myData?.weeklyChart && myData.weeklyChart.length > 0;

  const chartData = {
    labels: hasChartData ? myData.weeklyChart.map((p) => p.day) : ["-"],
    datasets: [
      {
        data: hasChartData ? myData.weeklyChart.map((p) => p.xp) : [0],
      },
    ],
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadData}
          tintColor="#3b82f6"
        />
      }
    >
      {/* Üst Bilgi */}
      <View className="mt-8 mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-slate-400 text-sm">Hoş geldin,</Text>
          <Text className="text-white text-3xl font-bold">Kerem Taşdemir</Text>
        </View>
        <View className="bg-slate-900 p-2 rounded-full border border-slate-800">
          <Trophy size={28} color="#fbbf24" />
        </View>
      </View>

      {/* Ana XP Kartı */}
      <View className="bg-blue-600 rounded-[35px] p-6 shadow-2xl mb-8 overflow-hidden">
        <View className="flex-row items-center mb-2">
          <Activity size={20} color="#dbeafe" />
          <Text className="text-blue-100 ml-2 font-medium">Toplam Gelişim</Text>
        </View>
        <Text className="text-white text-6xl font-black">
          {myData?.totalXP || 0}
          <Text className="text-2xl font-normal opacity-80"> XP</Text>
        </Text>
        <View className="bg-blue-500/50 h-3 rounded-full mt-6">
          <View className="bg-white h-3 rounded-full w-[65%]" />
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-blue-200 text-xs">
            Level {myData?.level || 1}
          </Text>
          <Text className="text-white font-bold text-xs">Hedefe Devam!</Text>
        </View>
      </View>

      {/* Hızlı İstatistikler */}
      <View className="flex-row justify-between mb-8">
        <View className="bg-slate-900 w-[48%] p-5 rounded-3xl border border-slate-800 flex-row items-center">
          <View className="bg-blue-500/10 p-2 rounded-lg mr-3">
            <Calendar size={20} color="#3b82f6" />
          </View>
          <View>
            <Text className="text-slate-500 text-xs">Aktivite</Text>
            <Text className="text-white text-xl font-bold">
              {myData?.activityCount || 0}
            </Text>
          </View>
        </View>
        <View className="bg-slate-900 w-[48%] p-5 rounded-3xl border border-slate-800 flex-row items-center">
          <View className="bg-emerald-500/10 p-2 rounded-lg mr-3">
            <MapPin size={20} color="#10b981" />
          </View>
          <View>
            <Text className="text-slate-500 text-xs">Son Kayıt</Text>
            <Text
              className="text-white text-[10px] font-bold"
              numberOfLines={1}
            >
              {myData?.lastActivity || "Kayıt Yok"}
            </Text>
          </View>
        </View>
      </View>

      {/* Haftalık Grafik - Hata Korumalı Render */}
      <View className="bg-slate-900 p-4 rounded-[30px] border border-slate-800 mb-8">
        <Text className="text-white font-bold mb-4 ml-2">
          Haftalık Performans
        </Text>
        {hasChartData ? (
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 56}
            height={180}
            chartConfig={{
              backgroundColor: "#0f172a",
              backgroundGradientFrom: "#0f172a",
              backgroundGradientTo: "#0f172a",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
              propsForDots: { r: "6", strokeWidth: "2", stroke: "#3b82f6" },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        ) : (
          <View className="h-40 items-center justify-center bg-slate-950/50 rounded-2xl">
            <Text className="text-slate-600 italic text-xs">
              Veri henüz yüklenmedi...
            </Text>
          </View>
        )}
      </View>

      <View className="mb-8">
        <Text className="text-white text-xl font-bold mb-4">
          Kategori Odaklı Gelişim
        </Text>
        <View className="bg-slate-900 p-6 rounded-[30px] border border-slate-800">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <View key={index} className="mb-5">
                <View className="flex-row justify-between mb-3">
                  <Text className="text-slate-300 font-bold">
                    {cat.category || cat.categoryName}
                  </Text>
                  <Text className="text-green-600 font-bold">
                    {cat.totalMinutes} dk
                  </Text>
                </View>
                <View className="bg-slate-800 h-3 rounded-full overflow-hidden">
                  <View
                    className="bg-blue-500 h-3 rounded-full"
                    style={{
                      width: `${Math.min((cat.totalMinutes / 200) * 100, 100)}%`,
                    }}
                  />
                </View>
              </View>
            ))
          ) : (
            <Text className="text-slate-500 italic">
              Henüz kategori verisi yok.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
