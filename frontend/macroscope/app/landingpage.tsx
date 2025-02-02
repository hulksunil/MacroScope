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

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.sharedText}>
        MacroScope
      </ThemedText>

      <View style={styles.sloganContainer}>
        <ThemedText style={styles.sharedText}>
          Through a lens, see your macros
        </ThemedText>
      </View>

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

        <TouchableOpacity
          style={styles.TouchableOpacityButton}
          onPress={() => router.push("/login")}
        >
          <Ionicons
            name="arrow-forward"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={[styles.sharedText, styles.buttonText]}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.TouchableOpacityButton}
          onPress={() => router.push("/login")}
        >
          <Ionicons name="create" size={24} color="black" style={styles.icon} />
          <Text style={[styles.sharedText, styles.buttonText]}>Sign up</Text>
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

  sloganContainer: {
    marginTop: 50,
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
