import { useRouter } from "expo-router";
import * as Icons from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityService } from "../../Services/ActivityService";

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(25);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Kategorileri API'den Çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await ActivityService.getCategories();
        setCategories(data);
        if (data.length > 0) setSelectedCat(data[0]);
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 2. Dinamik İkon Eşleştirme
  const renderIcon = (iconName, color) => {
    // API'den gelen ikon ismini Lucide içinden bul (Örn: "Code" -> Icons.Code)
    const IconComponent = Icons[iconName] || Icons.HelpCircle;
    return <IconComponent color={color} size={24} />;
  };

  // 3. API'den gelen xpMultiplier'a göre XP Hesaplama
  const estimatedXp = useMemo(() => {
    if (!selectedCat) return 0;
    return Math.round(
      duration * (selectedCat.xpMultiplier || selectedCat.XpMultiplier || 0),
    );
  }, [duration, selectedCat]);

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-950"
    >
      <ScrollView
        className="flex-1 p-6"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-white text-3xl font-black mt-12 mb-2">
          Odaklanma Vakti
        </Text>
        <Text className="text-slate-500 mb-8">Neye emek harcayacaksın?</Text>

        {/* KATEGORİ SEÇİMİ (API'DEN GELEN) */}
        <Text className="text-slate-400 font-bold mb-4 uppercase text-xs tracking-widest">
          Kategori Seç
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-10"
        >
          {categories.map((cat) => {
            const isSelected = selectedCat?.id === cat.id;
            const catColor = cat.colorHex || cat.ColorHex || "#3b82f6";

            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCat(cat)}
                className={`mr-4 items-center p-4 rounded-[30px] border-2 w-24 ${
                  isSelected
                    ? "bg-slate-900"
                    : "bg-slate-900/50 border-transparent"
                }`}
                style={{ borderColor: isSelected ? catColor : "transparent" }}
              >
                <View
                  className="p-3 rounded-2xl mb-2"
                  style={{
                    backgroundColor: isSelected ? catColor : "#1e293b",
                  }}
                >
                  {renderIcon(
                    cat.icon || cat.Icon,
                    isSelected ? "white" : "#64748b",
                  )}
                </View>
                <Text
                  className={`text-[10px] font-bold ${isSelected ? "text-white" : "text-slate-500"}`}
                >
                  {cat.name || cat.Name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* AKTİVİTE ADI */}
        <View className="mb-8">
          <Text className="text-slate-400 font-bold mb-4 uppercase text-xs tracking-widest">
            Aktivite Detayı
          </Text>
          <View className="bg-slate-900 border border-slate-800 rounded-[25px] p-5">
            <TextInput
              placeholder="Neye odaklanacaksın?"
              placeholderTextColor="#475569"
              className="text-white font-medium text-lg"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        {/* SÜRE VE XP TAHMİNİ */}
        <View className="flex-row justify-between mb-10">
          <View className="bg-slate-900 border border-slate-800 rounded-[25px] p-5 w-[48%] items-center">
            <Icons.Clock color="#3b82f6" size={20} />
            <Text className="text-slate-500 text-[10px] mt-2 font-bold uppercase">
              Süre (Dakika)
            </Text>
            <View className="flex-row items-center mt-2">
              <TouchableOpacity
                onPress={() => setDuration(Math.max(5, duration - 5))}
              >
                <Text className="text-blue-500 text-2xl font-bold px-3">-</Text>
              </TouchableOpacity>
              <Text className="text-white text-xl font-black mx-2">
                {duration}
              </Text>
              <TouchableOpacity onPress={() => setDuration(duration + 5)}>
                <Text className="text-blue-500 text-2xl font-bold px-3">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-purple-600/10 border border-purple-500/20 rounded-[25px] p-5 w-[48%] items-center">
            <Icons.Zap color="#a855f7" size={20} />
            <Text className="text-purple-500 text-[10px] mt-2 font-bold uppercase">
              Tahmini XP
            </Text>
            <Text className="text-white text-2xl font-black mt-2">
              +{estimatedXp}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BAŞLAT BUTONU */}
      <View className="absolute bottom-10 left-6 right-6">
        <TouchableOpacity
          className="bg-blue-600 p-6 rounded-[30px] flex-row items-center justify-center shadow-2xl shadow-blue-500/40"
          onPress={() => {
            if (!title) {
              alert("Lütfen bir aktivite adı gir!");
              return;
            }

            router.push({
              pathname: "/Timer",
              params: {
                title: title,
                duration: duration,
                catId: selectedCat.id,
                catName: selectedCat.name,
                xp: estimatedXp,
              },
            });
          }}
        >
          <Icons.Play color="white" size={20} fill="white" />
          <Text className="text-white font-black text-lg ml-3 uppercase">
            Seansı Başlat
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
