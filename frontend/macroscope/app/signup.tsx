import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Link, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";


export default function SignUp() {
  const router = useRouter();
  const fontsLoaded = useFonts({
    'Worksans': require('/Users/moses/Desktop/Perso_Projects/Hackathon/MacroScope/frontend/macroscope/assets/fonts/WorkSans-VariableFont_wght.ttf'),})
    if (!fontsLoaded) {
      return null;
    }
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [activitylvl, setActivitylvl] = React.useState("");
  const [goals, setgoals] = React.useState({ protien: 0, calories: 0 });

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.sharedText}>
        Sign Up
      </ThemedText>

      <SafeAreaView>
        <TextInput
          style={[styles.sharedText, styles.input]}
          onChangeText={setEmail}
          value={email}
          placeholder="Username"
          placeholderTextColor={"white"}
        />

        <TextInput
          style={[styles.sharedText, styles.input]}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor={"white"}
        />

        <TextInput
          style={[styles.sharedText, styles.input]}
          onChangeText={setHeight}
          value={height}
          placeholder="Height (cm)"
        />

        <TextInput
          style={[styles.sharedText, styles.input]}
          onChangeText={setWeight}
          value={weight}
          placeholder="Weight (kgs)"
        />

        <ThemedText style={styles.sharedText}>Goals</ThemedText>
        <TextInput
          style={[styles.sharedText, styles.input]}
          onChangeText={setWeight}
          value={weight}
          placeholder="Protien (g)"
        />

        <TextInput
          style={[styles.sharedText, styles.input]}
          onChangeText={setWeight}
          value={weight}
          placeholder="Calories"
        />
      </SafeAreaView>

      <TouchableOpacity
        style={styles.TouchableOpacityButton}
        onPress={() => router.push("/")}
      >
        <Ionicons
          name="arrow-forward"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={[styles.sharedText, styles.buttonText]}>Sign Up</Text>
      </TouchableOpacity>
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
    color: "black",
    fontSize: 20,
    paddingLeft: 10,
  },
  input: {
    height: 50,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlign: "left",
    borderColor: "white",
  },
});
