import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

// expo icons
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="robot" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore/page"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <AntDesign name="search1" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore/[id]/page"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => null,
        }}
      />
      <Tabs.Screen
        name="game/page"
        options={{
          title: "Game",
          tabBarIcon: ({ color }) => (
            <Ionicons name="game-controller" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="game/[id]/page"
        options={{
          title: "Game",
          tabBarIcon: ({ color }) => null,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
