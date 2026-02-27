import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, X, Zap } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, Dimensions, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ActivityService } from "../../Services/ActivityService";

const { width } = Dimensions.get("window");
const SIZE = width * 0.75;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;

export default function TimerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // NaN hatasını engellemek için güvenli süre hesabı
  const totalSeconds = useMemo(() => {
    const d = parseInt(params.duration);
    return isNaN(d) ? 25 * 60 : d * 60;
  }, [params.duration]);

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(true);

  // Sayfa ilk açıldığında timeLeft'i güncelle
  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      clearInterval(interval);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Mavi halkanın ne kadarının görüneceğini hesaplayan offset
  const strokeDashoffset = useMemo(() => {
    return CIRCUMFERENCE - (CIRCUMFERENCE * timeLeft) / totalSeconds;
  }, [timeLeft, totalSeconds]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleComplete = async () => {
    try {
      setIsActive(false);

      // Gönderilen veriyi konsola yazdır (Hata ayıklama için)
      const payload = {
        title: params.title || "İsimsiz Aktivite",
        categoryId: parseInt(params.catId),
        durationMinutes: parseInt(params.duration),
      };
      console.log("Giden Veri:", payload);

      await ActivityService.addActivity(payload);

      Alert.alert("Tebrikler!", `${params.xp || 0} XP Kazandın!`, [
        { text: "Harika!" },
      ]);
    } catch (error) {
      // Hatayı detaylı görmek için:
      console.error("Backend Hatası:", error.response?.data || error.message);
      Alert.alert(
        "Hata",
        `Aktivite kaydedilemedi: ${error.response?.status || "Server Hatası"}`,
      );
      setIsActive(true);
    }
  };

  return (
    <View className="flex-1 bg-slate-950 items-center justify-center p-6">
      {/* Üst Bilgi */}
      <View className="items-center mb-10">
        <Text className="text-blue-500 uppercase tracking-[4px] font-black text-xs mb-2">
          {params.catName || "Odaklanma"} MODU
        </Text>
        <Text className="text-white text-3xl font-bold text-center px-4">
          {params.title || "Hazırlanıyor..."}
        </Text>
      </View>

      {/* Dinamik Animasyonlu Çember */}
      <View className="items-center justify-center mb-16 shadow-2xl shadow-blue-500/20">
        <Svg width={SIZE} height={SIZE}>
          {/* Sabit Arka Plan Halkası */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#1e293b"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          {/* Zamanla Azalan Mavi Halka */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#3b82f6"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        {/* Tam Ortadaki Zaman */}
        <View className="absolute items-center">
          <Text className="text-white text-7xl font-black tracking-tighter">
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      {/* Hedef XP Kartı */}
      <View className="flex-row items-center bg-blue-500/10 border border-blue-500/20 px-6 py-3 rounded-full mb-12">
        <Zap color="#3b82f6" size={18} fill="#3b82f6" />
        <Text className="text-blue-400 font-bold ml-2 tracking-wide">
          HEDEF: +{params.xp || 0} XP
        </Text>
      </View>

      {/* Kontrol Butonları */}
      <View className="flex-row w-full justify-evenly px-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-slate-900 w-20 h-20 items-center justify-center rounded-full border border-slate-800"
        >
          <X color="#ef4444" size={30} strokeWidth={3} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleComplete}
          className="bg-blue-600 w-20 h-20 items-center justify-center rounded-full shadow-lg shadow-blue-500/50"
        >
          <CheckCircle color="white" size={35} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
