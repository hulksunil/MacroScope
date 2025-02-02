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
import { useFonts } from "expo-font";
import { Colors } from "@/constants/Colors";

export default function Nutrients() {
  const router = useRouter();

  const fontsLoaded = useFonts({
    WorkSans: require("../assets/fonts/WorkSans-VariableFont_wght.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

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
    fontFamily: "WorkSans",
    color: Colors.terciary_colors,
    textAlign: "center",
  },

  container: {
    flex: 1,
    backgroundColor: Colors.primary_colors,
    alignItems: "center",
    justifyContent: "center",
  },
  TouchableOpacityButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary_colors,
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
    color: "white",
    fontSize: 20,
    paddingLeft: 10,
  },
});
