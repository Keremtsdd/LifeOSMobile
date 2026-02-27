import * as Icons from "lucide-react-native";
import { Star, Trophy } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ActivityService } from "../../Services/ActivityService";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [myActivities, setMyActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Tüm verileri paralel olarak API'den çekiyoruz
      const [profData, achData, actData] = await Promise.all([
        ActivityService.getUserProfile(),
        ActivityService.getAchievements(),
        ActivityService.getMyActivities(),
      ]);

      setProfile(profData);
      setAchievements(achData);
      setMyActivities(actData);
    } catch (error) {
      console.error("Profil verileri yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // API'den gelen ikon ismini Lucide bileşenine çevirir
  const renderAchievementIcon = (iconName, isUnlocked) => {
    const IconComponent = Icons[iconName] || Icons.Award;
    return (
      <IconComponent color={isUnlocked ? "#3b82f6" : "#475569"} size={32} />
    );
  };

  if (loading && !profile) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchData}
          tintColor="#3b82f6"
        />
      }
    >
      {/* 1. ÜST KISIM: AVATAR VE LEVEL */}
      <View className="items-center mt-16 px-6">
        <View className="relative">
          <View className="w-32 h-32 rounded-full border-4 border-blue-500 p-1 shadow-2xl shadow-blue-500/20">
            <View className="w-full h-full bg-slate-800 rounded-full items-center justify-center">
              <Text className="text-white text-4xl font-black">KT</Text>
            </View>
          </View>
          <View className="absolute -bottom-2 -right-2 bg-blue-600 px-3 py-1 rounded-full border-4 border-slate-950">
            <Text className="text-white font-black text-xs text-center">
              LVL {profile?.level || 1}
            </Text>
          </View>
        </View>
        <Text className="text-white text-2xl font-black mt-6 tracking-tight">
          Kerem Taşdemir
        </Text>
        <Text className="text-slate-500 font-medium text-sm">
          Geleceğin Yazılımcısı
        </Text>
      </View>

      {/* 2. SEVİYE PROGRESS BAR */}
      <View className="mt-10 px-8">
        <View className="flex-row justify-between mb-3">
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Seviye İlerlemesi
          </Text>
          <Text className="text-blue-400 text-[10px] font-bold">
            {profile?.currentLevelXp || 0} / {profile?.nextLevelXp || 1000} XP
          </Text>
        </View>
        <View className="bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
          <View
            className="bg-blue-500 h-full rounded-full shadow-lg shadow-blue-500"
            style={{ width: `${(profile?.progress || 0) * 100}%` }}
          />
        </View>
      </View>

      {/* 3. ÖZET İSTATİSTİKLER */}
      <View className="flex-row justify-between px-6 mt-10">
        <View className="bg-slate-900 p-5 rounded-[30px] w-[48%] border border-slate-800 items-center">
          <Trophy color="#f59e0b" size={24} />
          <Text className="text-white text-xl font-black mt-2">
            {profile?.totalXp || 0}
          </Text>
          <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">
            Toplam XP
          </Text>
        </View>
        <View className="bg-slate-900 p-5 rounded-[30px] w-[48%] border border-slate-800 items-center">
          <Star color="#3b82f6" size={24} />
          <Text className="text-white text-xl font-black mt-2">
            {myActivities.length}
          </Text>
          <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">
            Tamamlanan
          </Text>
        </View>
      </View>

      {/* 4. ROZETLER (YATAY KAYDIRMALI) */}
      <View className="mt-12">
        <Text className="text-white font-black text-xl px-8 mb-6 tracking-tight">
          Başarıların
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 32, paddingRight: 20 }}
          className="flex-row"
        >
          {achievements.length > 0 ? (
            achievements.map((ach, index) => (
              <View
                key={index}
                className={`p-6 rounded-[35px] border items-center mr-4 w-32 ${ach.isUnlocked ? "bg-slate-900 border-blue-500/30" : "bg-slate-900/40 border-slate-900 opacity-60"}`}
              >
                <View
                  className={`p-4 rounded-full mb-3 ${ach.isUnlocked ? "bg-blue-500/10" : "bg-slate-800"}`}
                >
                  {renderAchievementIcon(ach.icon, ach.isUnlocked)}
                </View>
                <Text
                  className="text-white font-bold text-[11px] text-center"
                  numberOfLines={1}
                >
                  {ach.title}
                </Text>
                <Text
                  className={`text-[8px] font-black mt-2 uppercase ${ach.isUnlocked ? "text-blue-500" : "text-slate-600"}`}
                >
                  {ach.isUnlocked ? "Kazanıldı" : "Kilitli"}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-slate-600 italic px-8">
              Rozet verisi bulunamadı.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* 5. SON AKTİVİTELER (MY ACTIVITIES) */}
      <View className="mt-12 px-8 mb-20">
        <Text className="text-white font-black text-xl mb-6 tracking-tight">
          Son Aktivitelerin
        </Text>
        {myActivities.length > 0 ? (
          myActivities.map((act, index) => (
            <View
              key={index}
              className="bg-slate-900/50 p-5 rounded-[25px] border border-slate-900 mb-3 flex-row justify-between items-center shadow-sm"
            >
              <View className="flex-1 pr-4">
                <Text
                  className="text-white font-bold text-base"
                  numberOfLines={1}
                >
                  {act.title}
                </Text>
                <Text className="text-slate-500 text-xs mt-1">
                  {act.categoryName || "Genel"} • {act.durationMinutes} dk
                </Text>
              </View>
              <View className="bg-blue-500/10 px-4 py-2 rounded-2xl border border-blue-500/20">
                <Text className="text-blue-500 font-black text-xs">
                  +{act.earnedXP} XP
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-slate-900/30 p-10 rounded-[35px] border border-dashed border-slate-800 items-center">
            <Text className="text-slate-600 italic font-medium">
              Henüz bir aktivite tamamlanmadı.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
