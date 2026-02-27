// app/(tabs)/stats.jsx
import {
  BarChart2,
  PieChart as PieIcon,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { ActivityService } from "../../Services/ActivityService";

export default function StatsScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await ActivityService.getStatsSummary();
      setData(response);
    } catch (error) {
      console.error("Stats yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // 1. Güvenli Veri Erişimi
  const distribution = useMemo(() => {
    return data?.categoryDistribution || data?.CategoryDistribution || [];
  }, [data]);

  const weeklyData = useMemo(() => {
    return data?.WeeklyXp || data?.weeklyXp || [];
  }, [data]);

  // 2. Hesaplamaları useMemo içine alarak "undefined" hatalarını engelledik
  const totalMinutes = useMemo(() => {
    return distribution.reduce(
      (acc, curr) => acc + (curr.totalMinutes || curr.TotalMinutes || 0),
      0,
    );
  }, [distribution]);

  const topCat = useMemo(() => {
    if (distribution.length === 0) return null;
    return [...distribution].sort(
      (a, b) =>
        (b.totalMinutes || b.TotalMinutes || 0) -
        (a.totalMinutes || a.TotalMinutes || 0),
    )[0];
  }, [distribution]);

  const dailyRecord = useMemo(() => {
    if (weeklyData.length === 0) return 0;
    return Math.max(...weeklyData.map((d) => d.TotalXP || d.totalXP || 0), 0);
  }, [weeklyData]);

  // 3. Pasta Grafiği Verisi
  const pieData = useMemo(() => {
    return distribution.map((item, index) => ({
      name: item.categoryName || item.CategoryName,
      population: item.totalMinutes || item.TotalMinutes || 0,
      color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5],
      legendFontColor: "#94a3b8",
      legendFontSize: 12,
    }));
  }, [distribution]);

  return (
    <ScrollView
      className="flex-1 bg-slate-950 p-4"
      contentContainerStyle={{ paddingBottom: 60 }}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadStats}
          tintColor="#3b82f6"
        />
      }
    >
      <Text className="text-white text-3xl font-bold mt-10 mb-6 px-2">
        Analiz Merkezi
      </Text>

      {/* Özet Kartları */}
      <View className="flex-row justify-between mb-6 px-2">
        <View className="bg-slate-900 p-5 rounded-[30px] border border-slate-800 w-[48%] items-center shadow-lg">
          <TrendingUp color="#3b82f6" size={24} />
          <Text className="text-slate-500 text-[10px] mt-2 uppercase font-bold">
            Toplam Süre
          </Text>
          <Text className="text-white text-2xl font-black mt-1">
            {totalMinutes} <Text className="text-xs font-normal">dk</Text>
          </Text>
        </View>
        <View className="bg-slate-900 p-5 rounded-[30px] border border-slate-800 w-[48%] items-center shadow-lg">
          <Target color="#10b981" size={24} />
          <Text className="text-slate-500 text-[10px] mt-2 uppercase font-bold">
            Kategoriler
          </Text>
          <Text className="text-white text-2xl font-black mt-1">
            {pieData.length}
          </Text>
        </View>
      </View>

      {/* Favori Odak & Rekor Kartları */}
      <View className="flex-row justify-between mb-8 px-2">
        <View className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-[30px] w-[48%]">
          <Trophy color="#10b981" size={24} />
          <Text className="text-emerald-500 text-[10px] font-bold uppercase mt-3">
            Favori Odak
          </Text>
          <Text
            className="text-white text-lg font-black mt-1"
            numberOfLines={1}
          >
            {topCat?.categoryName || topCat?.CategoryName || "Veri Yok"}
          </Text>
        </View>

        <View className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-[30px] w-[48%]">
          <Zap color="#a855f7" size={24} />
          <Text className="text-purple-500 text-[10px] font-bold uppercase mt-3">
            Günlük Rekor
          </Text>
          <Text className="text-white text-lg font-black mt-1">
            {dailyRecord} <Text className="text-xs">XP</Text>
          </Text>
        </View>
      </View>

      {/* Pasta Grafiği */}
      <View className="bg-slate-900 p-6 rounded-[35px] border border-slate-800 mb-8 items-center shadow-xl mx-2">
        <View className="flex-row items-center self-start mb-6">
          <View className="bg-blue-500/10 p-2 rounded-xl">
            <PieIcon color="#3b82f6" size={20} />
          </View>
          <Text className="text-white font-bold ml-3 text-lg">
            Zaman Dağılımı
          </Text>
        </View>

        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={Dimensions.get("window").width - 80}
            height={200}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute
            chartConfig={{ color: (opacity = 1) => `white` }}
          />
        ) : (
          <Text className="text-slate-600 italic py-10">
            Analiz edilecek veri bulunamadı.
          </Text>
        )}
      </View>

      {/* Haftalık Yoğunluk Bar */}
      {/* Haftalık Yoğunluk Bar */}
      <View className="bg-slate-900 p-6 rounded-[35px] border border-slate-800 mb-8 mx-2">
        <Text className="text-white font-bold mb-10 text-lg">
          Haftalık Aktivite Yoğunluğu
        </Text>
        <View className="flex-row justify-between items-end h-24 px-2">
          {daysOfWeek.map((dayName, index) => {
            // Backend'den gelen tarihleri güvenli bir şekilde eşleştiriyoruz
            const dayData = weeklyData.find((d) => {
              const dateStr = d.Day || d.day;
              if (!dateStr) return false;

              // "25/02" formatını parçala
              const parts = dateStr.includes("/")
                ? dateStr.split("/")
                : dateStr.split(".");
              const [dPart, mPart] = parts;

              // Mevcut yılın bu tarihindeki gün indexini bul (0:Pazar, 1:Pazartesi...)
              const dateObj = new Date(
                new Date().getFullYear(),
                parseInt(mPart) - 1,
                parseInt(dPart),
              );

              // Pzt:0, Sal:1... indexine çevirmek için kaydırma yapıyoruz
              const jsDay = dateObj.getDay();
              const normalizedJsDay = jsDay === 0 ? 6 : jsDay - 1; // Pzt=0, Paz=6

              return normalizedJsDay === index;
            });

            const xpValue = dayData?.TotalXP || dayData?.totalXP || 0;
            // 1000 XP'yi tam boy (100%) kabul ediyoruz
            const barHeight =
              xpValue > 0 ? Math.min((xpValue / 1000) * 100, 100) : 10;

            return (
              <View key={index} className="items-center">
                {xpValue > 0 && (
                  <Text className="text-blue-400 text-[8px] mb-1 font-bold">
                    {xpValue}
                  </Text>
                )}
                <View
                  className={`w-8 rounded-t-lg ${xpValue > 0 ? "bg-blue-500" : "bg-slate-800"}`}
                  style={{ height: `${barHeight}%` }}
                />
                <Text className="text-slate-500 text-[10px] mt-2 font-bold">
                  {dayName}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Detaylı Liste */}
      <View className="px-2 mb-10">
        <View className="flex-row items-center mb-6">
          <View className="bg-emerald-500/10 p-2 rounded-xl">
            <BarChart2 color="#10b981" size={20} />
          </View>
          <Text className="text-white font-bold ml-3 text-lg">
            Kategori Detayları
          </Text>
        </View>
        <View className="bg-slate-900 p-6 rounded-[35px] border border-slate-800">
          {distribution.map((item, index) => {
            const minutes = item.totalMinutes || item.TotalMinutes || 0;
            const percent =
              totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0;
            return (
              <View key={index} className="mb-6">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-slate-300 font-bold">
                    {item.categoryName || item.CategoryName}
                  </Text>
                  <Text className="text-blue-400 font-black">%{percent}</Text>
                </View>
                <View className="bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <View
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
