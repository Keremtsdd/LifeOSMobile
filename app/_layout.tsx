import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isReady, setIsReady] = useState<boolean>(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Uygulama ayağa kalktığında hazır olduğunu işaretle
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      checkInitialState();
    }
  }, [segments, isReady]);

  const checkInitialState = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      const rootSegment = segments[0];
      const subSegment = segments[1];

      // GİRİŞ YAPILMAMIŞSA
      if (!token) {
        if (hasSeenOnboarding !== "true") {
          // Tanıtım görülmediyse ve şu an orada değilsek oraya gönder
          if (subSegment !== "OnBoarding") {
            router.replace("/Auth/OnBoarding");
          }
        } else {
          // Tanıtım görüldü ama login değilse
          if (
            rootSegment !== "Auth" ||
            (subSegment !== "Login" && subSegment !== "Register")
          ) {
            router.replace("/Auth/Login");
          }
        }
      }
      // GİRİŞ YAPILMIŞSA
      else {
        // Eğer giriş yapılmışsa ve hala Auth sayfalarındaysak Dashboard'a (Home) at
        if (rootSegment === "Auth" || rootSegment !== "(tabs)") {
          // ÖNEMLİ: (tabs) bir grupsa direkt Home'a yönlendirilir
          router.replace("/Home");
        }
      }
    } catch (e) {
      console.error("Yönlendirme Hatası:", e);
    }
  };

  if (!isReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* İsimler klasör yapınla BİREBİR aynı olmalı (Büyük/Küçük harf dahil) */}
      <Stack.Screen name="Auth/OnBoarding" />
      <Stack.Screen name="Auth/Login" />
      <Stack.Screen name="Auth/Register" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
