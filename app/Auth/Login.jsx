import { useRouter } from "expo-router";
import * as Icons from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthService } from "../../Services/AuthService";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      // Daha önce yazdığımız servisi çağırıyoruz
      const result = await AuthService.login(email, password);

      // Başarılıysa Dashboard'a yönlendir
      // Not: Senin klasör yapına göre '(tabs)/Home' veya 'Dashboard' olarak güncelle
      router.replace("/(tabs)/Home");
    } catch (error) {
      Alert.alert("Hata", "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-950 p-8 justify-center"
    >
      <View className="items-center mb-10">
        <View className="bg-blue-600/20 p-5 rounded-3xl mb-4">
          <Icons.User color="#3b82f6" size={50} />
        </View>
        <Text className="text-white text-4xl font-black italic">
          Tekrar Merhaba! ⚡
        </Text>
        <Text className="text-slate-500 mt-2">
          Kaldığın yerden devam etmeye hazır mısın?
        </Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-slate-400 mb-2 ml-1 font-bold">E-posta</Text>
          <TextInput
            placeholder="ornek@mail.com"
            placeholderTextColor="#475569"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-slate-900 p-5 rounded-2xl text-white border border-slate-800 focus:border-blue-500"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="mt-4">
          <Text className="text-slate-400 mb-2 ml-1 font-bold">Şifre</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#475569"
            secureTextEntry
            className="bg-slate-900 p-5 rounded-2xl text-white border border-slate-800 focus:border-blue-500"
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-blue-600 p-5 rounded-2xl items-center mt-10 shadow-xl shadow-blue-600/30"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-black text-lg uppercase tracking-widest">
            Giriş Yap
          </Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center mt-8">
        <Text className="text-slate-500">Henüz bir hesabın yok mu? </Text>
        <TouchableOpacity onPress={() => router.push("/Auth/Register")}>
          <Text className="text-blue-500 font-bold">Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
