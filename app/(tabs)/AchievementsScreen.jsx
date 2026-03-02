import * as Icons from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityService } from "../../Services/ActivityService";

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState([]);
  const [userLevel, setUserLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [achData, profData] = await Promise.all([
        ActivityService.getAchievements(),
        ActivityService.getUserProfile(),
      ]);
      setAchievements(achData || []);
      setUserLevel(profData?.level || 1);
    } catch (error) {
      console.error("Başarılar yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && achievements.length === 0) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950 px-6 pt-16">
      <View className="mb-8">
        <Text className="text-white text-3xl font-black tracking-tighter mb-2">
          Başarıların
        </Text>
        <Text className="text-slate-500 font-medium">
          Kazanılan ödüller ve sıradaki hedeflerin.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchData}
            tintColor="#3b82f6"
          />
        }
      >
        {achievements.length > 0 ? (
          achievements.map((ach) => {
            const isUnlocked = userLevel >= ach.requirementValue;
            const progress =
              Math.min(userLevel / ach.requirementValue, 1) * 100;

            return (
              <TouchableOpacity
                key={ach.id}
                activeOpacity={0.7}
                className={`mb-4 p-5 rounded-[30px] border flex-row items-center ${isUnlocked ? "bg-slate-900 border-blue-500/20" : "bg-slate-900/40 border-slate-800 opacity-60"}`}
              >
                {/* İkon Kutusu */}
                <View
                  className={`w-14 h-14 rounded-2xl items-center justify-center ${isUnlocked ? "bg-blue-500/10" : "bg-slate-800"}`}
                >
                  <Icons.Award
                    color={isUnlocked ? "#3b82f6" : "#475569"}
                    size={32}
                  />
                </View>

                {/* İçerik */}
                <View className="flex-1 ml-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text
                      className={`font-bold text-base ${isUnlocked ? "text-white" : "text-slate-500"}`}
                    >
                      {ach.name}
                    </Text>
                    {isUnlocked && (
                      <Icons.CheckCircle2 color="#3b82f6" size={16} />
                    )}
                  </View>

                  <Text className="text-slate-500 text-xs mb-3">
                    {isUnlocked
                      ? "Başarı kazanıldı!"
                      : `Seviye ${ach.requirementValue} olduğunda açılacak`}
                  </Text>

                  {!isUnlocked && (
                    <View className="bg-slate-800 h-1.5 rounded-full overflow-hidden w-full">
                      <View
                        className="bg-blue-500 h-full"
                        style={{ width: `${progress}%` }}
                      />
                    </View>
                  )}
                </View>

                {/* XP Ödülü */}
                <View className="ml-4 items-end">
                  <Text
                    className={`font-black ${isUnlocked ? "text-blue-400" : "text-slate-700"}`}
                  >
                    +{ach.xpReward || 500}
                  </Text>
                  <Text className="text-[8px] text-slate-600 font-bold uppercase">
                    XP
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text className="text-slate-500 text-center mt-10">
            Henüz başarı tanımlanmamış.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
