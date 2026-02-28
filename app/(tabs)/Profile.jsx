import * as ImagePicker from "expo-image-picker";
import * as Icons from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityService } from "../../Services/ActivityService";

const BASE_URL = "http://192.168.1.157:5251";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [myActivities, setMyActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Backend path -> full URL çevirici
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const [profData, achData, actData] = await Promise.all([
        ActivityService.getUserProfile(),
        ActivityService.getAchievements(),
        ActivityService.getMyActivities(),
      ]);

      setProfile(profData);
      setAchievements(achData);
      setMyActivities(actData);

      if (profData?.profilePictureUrl) {
        const fullUrl = buildImageUrl(profData.profilePictureUrl);
        setImage(fullUrl);
      } else {
        setImage(null);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pickImage = async (mode) => {
    let result;
    const settings = {
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    };

    try {
      if (mode === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted")
          return Alert.alert("Hata", "Kamera izni gerekli!");
        result = await ImagePicker.launchCameraAsync(settings);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(settings);
      }

      if (!result.canceled) {
        const localUri = result.assets[0].uri;

        // Anında ekranda göster (optimistic UI)
        setImage(localUri);
        setUploading(true);

        const response = await ActivityService.updateProfilePicture(localUri);

        if (response?.profilePictureUrl) {
          const fullUrl = buildImageUrl(response.profilePictureUrl);
          setImage(fullUrl);
        }

        Alert.alert("Başarılı", "Profil fotoğrafın güncellendi!");
      }
    } catch (error) {
      console.error("Upload hatası:", error);
      Alert.alert("Hata", "Fotoğraf yüklenemedi.");
      fetchData(); // rollback
    } finally {
      setUploading(false);
    }
  };

  const showImageOptions = () => {
    const options = ["İptal", "Fotoğraf Çek", "Galeriden Seç"];

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 0 },
        (i) => {
          if (i === 1) pickImage("camera");
          if (i === 2) pickImage("library");
        },
      );
    } else {
      Alert.alert("Profil Fotoğrafı", "Bir seçenek seçin", [
        { text: "İptal", style: "cancel" },
        { text: "Kamera", onPress: () => pickImage("camera") },
        { text: "Galeri", onPress: () => pickImage("library") },
      ]);
    }
  };

  const renderAchievementIcon = (iconName, isUnlocked) => {
    if (!iconName)
      return (
        <Icons.Award color={isUnlocked ? "#3b82f6" : "#475569"} size={32} />
      );

    const formattedName = iconName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("")
      .replace(".png", "");

    const IconComponent = Icons[formattedName] || Icons.Award;

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
      contentContainerStyle={{ paddingBottom: 120 }}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchData}
          tintColor="#3b82f6"
        />
      }
    >
      <View className="items-center mt-16 px-6">
        <TouchableOpacity onPress={showImageOptions} activeOpacity={0.8}>
          <View className="w-32 h-32 rounded-full border-4 border-blue-500 p-1">
            <View className="w-full h-full bg-slate-800 rounded-full items-center justify-center overflow-hidden">
              {image ? (
                <>
                  <Image
                    source={{ uri: image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  {uploading && (
                    <View className="absolute inset-0 bg-black/50 items-center justify-center">
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
                </>
              ) : (
                <Text className="text-white text-4xl font-black italic">
                  {profile?.fullName
                    ? profile.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "KT"}
                </Text>
              )}
            </View>
          </View>

          <View className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full border-4 border-slate-950">
            <Icons.Camera color="white" size={18} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        <View className="mt-6 items-center">
          <Text className="text-white text-3xl font-black">
            {profile?.fullName || "Kerem Taşdemir"}
          </Text>
        </View>
      </View>

      <View className="mt-10 px-8">
        <View className="flex-row justify-between mb-3">
          <Text className="text-slate-400 text-[10px] font-bold uppercase">
            Seviye İlerlemesi
          </Text>
          <Text className="text-blue-400 text-[10px] font-bold">
            {profile?.currentLevelXp || 0} / {profile?.nextLevelXp || 1000} XP
          </Text>
        </View>

        <View className="bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
          <View
            className="bg-blue-500 h-full"
            style={{
              width: `${
                profile
                  ? (profile.currentLevelXp / profile.nextLevelXp) * 100
                  : 0
              }%`,
            }}
          />
        </View>
      </View>

      <View className="mt-12">
        <Text className="text-white font-black text-xl px-8 mb-6">
          Başarıların
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 32, paddingRight: 20 }}
        >
          {achievements.map((ach) => (
            <View
              key={ach.id}
              className={`p-6 rounded-[35px] border items-center mr-4 w-38 ${
                (profile?.level || 1) >= ach.requirementValue
                  ? "bg-slate-900 border-blue-500/30"
                  : "bg-slate-900/40 border-slate-900 opacity-40"
              }`}
            >
              <View className="p-4 rounded-full mb-3 bg-slate-800">
                {renderAchievementIcon(
                  ach.iconUrl,
                  (profile?.level || 1) >= ach.requirementValue,
                )}
              </View>

              <Text
                className="text-white font-bold text-[11px] text-center"
                numberOfLines={1}
              >
                {ach.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
