import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

export default function LandingPage() {
  const openCamera = () => {
    console.log("Open Camera");
    window.alert("Open Camera");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.appTitle}>
        MacroScope
      </ThemedText>

      <View style={styles.sloganContainer}>
        <ThemedText>Through a lens, see your macros</ThemedText>

        <TouchableOpacity
          style={styles.TouchableOpacityButton}
          onPress={() => alert("Button Clicked")}
        >
          <Ionicons name="camera" size={24} color="black" style={styles.icon} />
          <Text>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.TouchableOpacityButton}
          onPress={() => alert("Button Clicked")}
        >
          <Ionicons
            name="arrow-forward"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.TouchableOpacityButton}
          onPress={() => alert("Button Clicked")}
        >
          <Ionicons name="create" size={25} color="black" style={styles.icon} />
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#172a4a",
    alignItems: "center",
    justifyContent: "center",
  },

  sloganContainer: {
    marginTop: 50,
  },
  appTitle: {
    color: "white",
  },

  TouchableOpacityButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    height: 100,
    width: 300,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 25,
  },
});
