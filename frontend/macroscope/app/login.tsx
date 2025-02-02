import { StyleSheet, SafeAreaView } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Link } from "expo-router";

export default function LogIn() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.sharedText}>
        Log In
      </ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sharedText: {
    fontFamily: "Roboto",
    color: "white",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#172a4a",
    alignItems: "center",
    justifyContent: "center",
  },
});
