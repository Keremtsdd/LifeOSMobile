import { useRouter } from "expo-router";
import * as Icons from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Hayatını Oyunlaştır",
    desc: "Her aktivite sana XP kazandırır. Seviye atla ve geliş.",
    icon: "Gamepad2",
    color: "#6366f1",
  },
  {
    id: "2",
    title: "Zirveye Oyna",
    desc: "Liderlik tablosunda arkadaşlarınla yarış ve en iyisi ol.",
    icon: "Trophy",
    color: "#f59e0b",
  },
  {
    id: "3",
    title: "Sıfırdan Başla",
    desc: "Şimdi kayıt ol ve kendi serüvenini yazmaya başla.",
    icon: "Rocket",
    color: "#10b981",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View className="flex-1 bg-slate-950">
      {/* Atla Butonu */}
      <TouchableOpacity
        onPress={() => router.replace("/auth/register")}
        className="absolute top-16 right-6 z-10"
      >
        <Text className="text-slate-500 font-bold">Atla</Text>
      </TouchableOpacity>

      <FlatList
        data={SLIDES}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={(e) =>
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center justify-center px-10">
            <View
              className="p-10 rounded-full mb-10"
              style={{ backgroundColor: `${item.color}20` }}
            >
              {item.icon === "Gamepad2" && (
                <Icons.Gamepad2 color={item.color} size={100} />
              )}
              {item.icon === "Trophy" && (
                <Icons.Trophy color={item.color} size={100} />
              )}
              {item.icon === "Rocket" && (
                <Icons.Rocket color={item.color} size={100} />
              )}
            </View>
            <Text className="text-white text-3xl font-black text-center mb-4">
              {item.title}
            </Text>
            <Text className="text-slate-400 text-center text-lg">
              {item.desc}
            </Text>
          </View>
        )}
      />

      {/* Alt Bar */}
      <View className="pb-20 px-10 flex-row justify-between items-center">
        <View className="flex-row">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full mx-1 ${i === currentIndex ? "w-8 bg-blue-500" : "w-2 bg-slate-800"}`}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() =>
            currentIndex === 2 ? router.replace("/auth/register") : null
          }
          className="bg-blue-600 px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold">
            {currentIndex === 2 ? "Başla" : "Sonraki"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
