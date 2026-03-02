import * as Icons from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ActivityService } from "../../Services/ActivityService";

// Backend URL
const BASE_URL = "http://192.168.1.157:5251";

export default function LeaderboardScreen() {
  const [data, setData] = useState(null); // Liderlik tablosu verisi
  const [profile, setProfile] = useState(null); // Senin güncel profil/XP verin
  const [loading, setLoading] = useState(true);

  // Verileri Çekme Fonksiyonu
  const fetchData = async () => {
    try {
      setLoading(true);
      // İki API'yi aynı anda çağırıyoruz (XP ve Resim garantisi için)
      const [leaderboardRes, profileRes] = await Promise.all([
        ActivityService.getLeaderboard(),
        ActivityService.getUserProfile(),
      ]);

      setData(leaderboardRes);
      setProfile(profileRes);
    } catch (error) {
      console.error("Liderlik tablosu veya profil yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Avatar/Resim Render Yardımcısı
  const renderAvatar = (user, size = "small") => {
    const initials = user?.fullName
      ? user.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";

    const imagePath = user?.profilePictureUrl;

    return (
      <View
        className={`${size === "large" ? "w-22 h-22" : "w-12 h-12"} bg-slate-800 rounded-full items-center justify-center overflow-hidden border border-slate-700`}
      >
        {imagePath ? (
          <Image
            source={{
              uri: `${BASE_URL}${imagePath.startsWith("/") ? imagePath : "/" + imagePath}?t=${new Date().getTime()}`,
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text
            className={`text-white font-bold ${size === "large" ? "text-xl" : "text-sm"}`}
          >
            {initials}
          </Text>
        )}
      </View>
    );
  };

  if (loading && !data)
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );

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
      {/* BAŞLIK */}
      <View className="pt-16 pb-8 px-6">
        <Text className="text-white text-3xl font-black tracking-tighter mb-2">
          Liderlik Tablosu
        </Text>
        <Text className="text-slate-500 font-medium">
          En aktif kullanıcılar arasında kaçıncı sıradasın?
        </Text>
      </View>

      {/* TOP 3 (PODYUM) */}
      {/* TOP 3 (PODYUM) */}
      <View className="flex-row items-end justify-center px-4 mb-10 h-44">
        {/* 2. SIRA */}
        <View className="items-center mx-1 flex-1">
          <View className="w-16 h-16 rounded-full border-2 border-slate-400 p-1 mb-2">
            {renderAvatar(data?.topUsers[1])}
          </View>
          <Text
            className="text-white text-[10px] font-bold text-center"
            numberOfLines={1}
          >
            {data?.topUsers[1]?.fullName}
          </Text>
          <Text className="text-slate-400 text-[8px]">
            {data?.topUsers[1]?.totalXP || data?.topUsers[1]?.TotalXP} XP
          </Text>
        </View>

        {/* 1. SIRA (ALTIN) */}
        <View className="items-center mx-1 flex-1 pb-4">
          <View className="relative">
            <View className="w-24 h-24 rounded-full border-4 border-yellow-500 p-1 mb-2 shadow-2xl shadow-yellow-500/40">
              {renderAvatar(data?.topUsers[0], "large")}
            </View>
            <View className="absolute -top-6 left-1/2 -ml-4">
              <Icons.Trophy color="#eab308" size={32} fill="#eab308" />
            </View>
          </View>
          <Text
            className="text-white text-xs font-black text-center"
            numberOfLines={1}
          >
            {data?.topUsers[0]?.fullName}
          </Text>
          <Text className="text-yellow-500 text-[10px] font-bold">
            {data?.topUsers[0]?.totalXP || data?.topUsers[0]?.TotalXP} XP
          </Text>
        </View>

        {/* 3. SIRA */}
        <View className="items-center mx-1 flex-1">
          <View className="w-16 h-16 rounded-full border-2 border-orange-700 p-1 mb-2">
            {renderAvatar(data?.topUsers[2])}
          </View>
          <Text
            className="text-white text-[10px] font-bold text-center"
            numberOfLines={1}
          >
            {data?.topUsers[2]?.fullName}
          </Text>
          <Text className="text-slate-400 text-[8px]">
            {data?.topUsers[2]?.totalXP || data?.topUsers[2]?.TotalXP} XP
          </Text>
        </View>
      </View>

      {/* TÜM LİSTE */}
      <View className="px-6 mb-4">
        {data?.topUsers.map((user, index) => (
          <View
            key={index}
            className="flex-row items-center bg-slate-900/50 p-4 rounded-3xl border border-slate-900 mb-3"
          >
            <Text className="text-slate-500 font-black w-6">{index + 1}</Text>
            <View className="mr-4">{renderAvatar(user)}</View>
            <View className="flex-1">
              <Text className="text-white font-bold text-sm">
                {user.fullName}
              </Text>
              <Text className="text-slate-500 text-[10px]">
                Seviye {user.level || user.Level}
              </Text>
            </View>
            <Text className="text-blue-400 font-black">
              {user.totalXP || user.TotalXP} XP
            </Text>
          </View>
        ))}
      </View>

      {/* BENİM SIRALAMAM (MAVİ KART) */}
      <View className="bg-blue-600 mx-6 p-5 rounded-[35px] flex-row items-center shadow-xl shadow-blue-600/20 mb-12">
        <Text className="text-white font-black text-2xl mr-4">
          #{data?.myRank > 0 ? data.myRank : "1"}
        </Text>
        <View className="flex-1">
          <Text className="text-white font-black text-lg">Senin Sıralaman</Text>
          <Text className="text-blue-100 font-bold">
            {/* profile state'inden veya leaderboard verisinden XP çekme */}
            {profile?.totalXP ||
              profile?.TotalXP ||
              data?.myInfo?.totalXP ||
              0}{" "}
            Toplam XP
          </Text>
        </View>
        <View className="w-14 h-14 rounded-full border-2 border-white/40 overflow-hidden bg-blue-700 items-center justify-center">
          {renderAvatar(profile, "small")}
        </View>
      </View>
    </ScrollView>
  );
}
