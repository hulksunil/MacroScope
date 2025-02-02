import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Link, useRouter } from "expo-router";

export default function Nutrients() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.TouchableOpacityButton}
          onPress={() => router.push("/(tabs)/camera")}
        >
          <Ionicons name="camera" size={24} color="black" style={styles.icon} />
          <Text style={[styles.sharedText, styles.buttonText]}>
            Open Camera
          </Text>
        </TouchableOpacity>
      </View>
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
  TouchableOpacityButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    height: 60,
    width: 300,
  },
  icon: {
    marginRight: 15,
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    paddingLeft: 10,
  },
});
