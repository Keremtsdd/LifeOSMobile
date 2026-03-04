import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Tanıtım Sayfaları Verisi
const SLIDES = [
  {
    id: "1",
    title: "Hayatını Oyunlaştır",
    desc: "Tamamladığın her görev sana XP kazandırır. Seviye atla ve gerçek potansiyelini keşfet.",
    icon: "game-controller",
    color: "#6366f1",
  },
  {
    id: "2",
    title: "İstatistiklerini Takip Et",
    desc: "Gelişimini detaylı grafiklerle izle. Hangi günlerde daha verimlisin gör.",
    icon: "stats-chart",
    color: "#f59e0b",
  },
  {
    id: "3",
    title: "Serüvene Başla",
    desc: "Hazırsan kayıt ol ve ilk görevini tamamlamak için yola koyul!",
    icon: "rocket",
    color: "#10b981",
  },
];

export default function OnBoarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef < FlatList > null;

  // Tanıtımı bitiren ve hafızaya kaydeden fonksiyon
  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/Auth/Login");
    } catch (e) {
      console.error("Hata:", e);
    }
  };

  // Sonraki sayfaya geçiş veya Bitir
  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Üst Kısım: Atla Butonu */}
      <View className="h-10 px-6 justify-center items-end">
        <TouchableOpacity onPress={handleFinish}>
          <Text className="text-slate-500 font-bold text-base">Atla</Text>
        </TouchableOpacity>
      </View>

      {/* Orta Kısım: Kaydırılabilir İçerik */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const contentOffsetX = e.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffsetX / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center justify-center px-10">
            <View
              style={{ backgroundColor: `${item.color}20` }}
              className="p-10 rounded-full mb-10 border border-slate-800"
            >
              <Ionicons name={item.icon} size={100} color={item.color} />
            </View>
            <Text className="text-white text-3xl font-black text-center mb-4 uppercase italic tracking-tighter">
              {item.title}
            </Text>
            <Text className="text-slate-400 text-center text-lg leading-6">
              {item.desc}
            </Text>
          </View>
        )}
      />

      {/* Alt Kısım: Sayfa Belirteçleri ve Buton */}
      <View className="px-10 pb-12 flex-row justify-between items-center">
        {/* Noktalar (Paging Dots) */}
        <View className="flex-row">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full mx-1 ${i === currentIndex ? "w-8 bg-blue-500" : "w-2 bg-slate-800"}`}
            />
          ))}
        </View>

        {/* İleri/Başla Butonu */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-blue-600 px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/20"
        >
          <Text className="text-white font-black text-lg">
            {currentIndex === SLIDES.length - 1 ? "BAŞLA" : "İLERİ"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
