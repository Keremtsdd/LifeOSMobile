// app/(tabs)/index.jsx
import * as Icons from "lucide-react-native";
import { Activity, Calendar, Clock, MapPin } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import "../../global.css";
import { ActivityService } from "../../Services/ActivityService";

// Dinamik İkon Render Bileşeni
const DynamicBadgeIcon = ({ iconName, color, size }) => {
  const iconKey = iconName
    ? iconName.charAt(0).toUpperCase() + iconName.slice(1)
    : "Trophy";

  // eslint-disable-next-line import/namespace
  const IconComponent = Icons[iconKey] || Icons.Trophy;
  return <IconComponent size={size} color={color} />;
};

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [lastCelebratedLevel, setLastCelebratedLevel] = useState(1);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, categoryData, achievementsData] = await Promise.all([
        ActivityService.getAllUsersStats(),
        ActivityService.getCategoryAnalytics(),
        ActivityService.getAchievements(),
      ]);

      setStats(Array.isArray(statsData) ? statsData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
    } catch (error) {
      console.error("Veri yükleme hatası!", error);
    } finally {
      setLoading(false);
    }
  };
  const formatLastActivity = (dateStr) => {
    if (!dateStr) return "Kayıt Yok";

    try {
      // Backend formatı: "25.02.2026 12:16"
      // Önce saat kısmını ayırıp sadece tarihi alalım
      const onlyDate = dateStr.split(" ")[0];
      const [day, month, year] = onlyDate.split(".");

      // JS'nin anlayacağı format: "2026-02-25"
      const dateObj = new Date(`${year}-${month}-${day}`);

      return dateObj.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        weekday: "long",
      });
    } catch (e) {
      return dateStr; // Hata olursa orijinal veriyi bas
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const myData =
    stats && stats.length > 0
      ? stats.find((u) => u.id === 6) || stats[0]
      : null;
  console.log("Gelen Kullanıcı Verisi:", JSON.stringify(myData, null, 2));

  // DİNAMİK LEVEL VE XP HESAPLAMA
  const currentXP = myData?.totalXP || 0;
  const currentLevel = Math.floor(currentXP / 1000) + 1;
  const nextLevelXP = currentLevel * 1000;
  const remainingXP = nextLevelXP - currentXP;
  const progressPercentage = (currentXP % 1000) / 10;

  // SEVİYE TAKİBİ VE MODAL TETİKLEME
  useEffect(() => {
    if (!loading && currentLevel > lastCelebratedLevel) {
      setShowLevelModal(true);
      setLastCelebratedLevel(currentLevel);
    }
  }, [currentLevel, loading]);

  // ROZET MANTIĞI
  const activeBadge = achievements
    .filter((a) => a.requirementValue <= currentLevel)
    .sort((a, b) => b.requirementValue - a.requirementValue)[0];

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
    <View className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Üst Bilgi & Rozet */}
        <View className="mt-8 mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-400 text-sm">Hoş geldin,</Text>
            <Text className="text-white text-3xl font-bold">
              Kerem Taşdemir
            </Text>
            {activeBadge && (
              <Text className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                {activeBadge.name} Unvanı
              </Text>
            )}
          </View>
          <View className="bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-lg">
            <DynamicBadgeIcon
              iconName={activeBadge?.iconUrl}
              color={currentLevel >= 2 ? "#fbbf24" : "#94a3b8"}
              size={32}
            />
          </View>
        </View>

        {/* Ana XP Kartı */}
        <View className="bg-blue-600 rounded-[35px] p-6 shadow-2xl mb-8 overflow-hidden">
          <View className="flex-row items-center mb-2">
            <Activity size={20} color="#dbeafe" />
            <Text className="text-blue-100 ml-2 font-medium">
              Toplam Gelişim
            </Text>
          </View>
          <Text className="text-white text-6xl font-black">
            {currentXP}
            <Text className="text-2xl font-normal opacity-80"> XP</Text>
          </Text>
          <View className="bg-blue-500/50 h-3 rounded-full mt-6">
            <View
              className="bg-white h-3 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-blue-200 text-xs font-bold">
              Level {currentLevel}
            </Text>
            <Text className="text-white font-bold text-xs">
              {remainingXP > 0
                ? ` Hedefe ${remainingXP} XP kaldı`
                : "Zirveye Ulaştın!"}
            </Text>
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
            <View className="flex-1">
              <Text className="text-slate-500 text-xs">Son Kayıt</Text>
              <Text
                className="text-white text-[10px] font-bold"
                numberOfLines={1}
              >
                {formatLastActivity(myData?.lastActivity)}
              </Text>
            </View>
          </View>
        </View>

        {/* Haftalık Performans Grafiği */}
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

        {/* SON AKTİVİTELER LİSTESİ */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4 px-2">
            <Text className="text-white text-xl font-bold">
              Son Aktiviteler
            </Text>
            <Text className="text-blue-500 text-xs font-bold">Hepsini Gör</Text>
          </View>
          <View className="bg-slate-900 p-4 rounded-[30px] border border-slate-800">
            {myData?.recentActivities && myData.recentActivities.length > 0 ? (
              myData.recentActivities.slice(0, 4).map((act, index) => (
                <View
                  key={index}
                  className={`flex-row items-center py-3 ${index !== 3 ? "border-b border-slate-800" : ""}`}
                >
                  <View className="bg-blue-500/10 p-3 rounded-2xl mr-4">
                    <Clock size={18} color="#3b82f6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-base">
                      {act.title}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {act.categoryName}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-blue-400 font-bold">
                      {act.durationMinutes} dk
                    </Text>
                    <Text className="text-slate-600 text-[10px]">
                      {act.date || "Bugün"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="py-4 items-center">
                <Text className="text-slate-500 italic text-sm">
                  Henüz bir kayıt yok.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Kategori Odaklı Gelişim */}
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
                Kategori verisi yok.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* --- TEBRİKLER MODALI --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLevelModal}
        statusBarTranslucent={true}
        onRequestClose={() => setShowLevelModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80 px-10">
          <View className="bg-slate-900 border-2 border-blue-500 p-8 rounded-[40px] items-center w-full shadow-2xl">
            <View className="bg-blue-600 p-5 rounded-full mb-6 shadow-lg shadow-blue-500/50">
              <DynamicBadgeIcon
                iconName={activeBadge?.iconUrl}
                color="#fff"
                size={50}
              />
            </View>

            <Text className="text-white text-3xl font-black text-center mb-1">
              TEBRİKLER!
            </Text>
            <Text className="text-blue-400 text-lg font-bold mb-4">
              SEVİYE {currentLevel} OLDUN
            </Text>

            <Text className="text-slate-300 text-center mb-8 leading-5 text-sm">
              Müthiş bir disiplinle ilerliyorsun!{" "}
              {activeBadge?.name
                ? `Artık "${activeBadge.name}" rütbesine yükseldin.`
                : "Yeni hedeflere hazırsın."}
            </Text>

            <Pressable
              onPress={() => setShowLevelModal(false)}
              className="bg-blue-600 py-4 px-12 rounded-2xl active:opacity-70 w-full"
            >
              <Text className="text-white font-bold text-center text-lg">
                Harika!
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
