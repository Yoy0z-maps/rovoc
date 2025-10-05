import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text, StyleSheet } from "react-native";

// expo icons
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            borderTopWidth: 2,
            borderTopColor: "#111111",
            backgroundColor: "#fff",
            paddingTop: 10,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="robot" size={25} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color, fontWeight: focused ? "bold" : "normal" },
              ]}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          headerShown: false,
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <AntDesign name="search" size={25} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color, fontWeight: focused ? "bold" : "normal" },
              ]}
            >
              Explore
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: "Game",
          tabBarIcon: ({ color }) => (
            <Ionicons name="game-controller" size={25} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color, fontWeight: focused ? "bold" : "normal" },
              ]}
            >
              Game
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={25} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={[
                styles.tabLabel,
                { color, fontWeight: focused ? "bold" : "normal" },
              ]}
            >
              Calendar
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    marginTop: 5,
    fontSize: 10,
    fontFamily: "Pretendard-Regular",
  },
});
