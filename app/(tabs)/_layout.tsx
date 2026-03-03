import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import "../../global.css";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#60a5fa", // Aktif ikon rengi (Mavi)
        tabBarInactiveTintColor: "#94a3b8", // Pasif ikon rengi (Gri)
        tabBarStyle: {
          backgroundColor: "#020617", // Arka plan: bg-slate-950 tonu
          borderTopWidth: 1,
          borderTopColor: "#1e293b",
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: "#020617",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Stats"
        options={{
          title: "Analiz",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Timer" // Bu sayfa aktivite başlatmak için
        options={{
          title: "Odaklan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
