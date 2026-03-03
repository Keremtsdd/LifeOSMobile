import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { AuthService } from "../../Services/AuthService"; // Bunu oluşturacağız

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.fullName) {
      alert("Lütfen tüm alanları doldur!");
      return;
    }

    try {
      const result = await AuthService.register(form);
      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsun.");
      router.push("/auth/login"); // Kayıt sonrası login'e atıyoruz
    } catch (error) {
      alert("Kayıt başarısız: " + (error.message || "Bilinmeyen hata"));
    }
  };

  return (
    <View className="flex-1 bg-slate-950 p-8 justify-center">
      <Text className="text-white text-4xl font-black mb-2 italic">
        Katıl 🚀
      </Text>
      <Text className="text-slate-500 mb-10">
        Kendi efsaneni yazmaya başla.
      </Text>

      <TextInput
        placeholder="Ad Soyad"
        placeholderTextColor="#475569"
        className="bg-slate-900 p-5 rounded-2xl text-white mb-4 border border-slate-800"
        onChangeText={(v) => setForm({ ...form, fullName: v })}
      />
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#475569"
        className="bg-slate-900 p-5 rounded-2xl text-white mb-4 border border-slate-800"
        onChangeText={(v) => setForm({ ...form, email: v })}
      />
      <TextInput
        placeholder="Şifre"
        secureTextEntry
        placeholderTextColor="#475569"
        className="bg-slate-900 p-5 rounded-2xl text-white mb-8 border border-slate-800"
        onChangeText={(v) => setForm({ ...form, password: v })}
      />

      <TouchableOpacity
        onPress={handleRegister}
        className="bg-blue-600 p-5 rounded-2xl items-center shadow-xl shadow-blue-600/30"
      >
        <Text className="text-white font-black text-lg">Hesap Oluştur</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/login")}
        className="mt-6 items-center"
      >
        <Text className="text-slate-500">
          Zaten hesabın var mı?{" "}
          <Text className="text-blue-500 font-bold">Giriş Yap</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
