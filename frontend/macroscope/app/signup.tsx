import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";

export default function SignUp() {
  const fontsLoaded = useFonts({
    WorkSans: require("../assets/fonts/WorkSans-VariableFont_wght.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  //   const [activitylvl, setActivitylvl] = React.useState("");
  const [goals, setGoals] = useState({ protein: "", calories: "" });
  const [age, setAge] = useState("");

  const handleSignup = async () => {
    const passedUserData = {
      email: email,
      username: username,
      password: password,
      age: age,
      height: height,
      weight: weight,
      protein: goals.protein,
      calories: goals.calories,
    };

    axios.post("http://localhost:3000/signup", passedUserData).then((res) => {
      if (!res.data.ERROR && res.status === 200) {
        alert("Logged in successfully");
        router.push("/nutrients");
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }
    });
  };

  const validateInput = () => {
    if (
      email === "" ||
      password === "" ||
      height === "" ||
      weight === "" ||
      username === "" ||
      //   activitylvl === "" ||
      goals.protein === "" ||
      goals.calories === "" ||
      age === ""
    ) {
      alert("Please fill in all fields");
      return false;
    } else {
      //api call to create account
      alert("Account Crated!");
      router.push("/nutrients");
      return true;
    }
  };

  const updateGoals = (userInput: string, goal: string) => {
    if (goal === "protein") {
      setGoals((prevGoals: any) => ({
        ...prevGoals,
        protein: userInput ? parseInt(userInput) || 0 : 0,
      }));
    } else if (goal === "calories") {
      setGoals((prevGoals: any) => ({
        ...prevGoals,
        calories: userInput ? parseInt(userInput) || 0 : 0,
      }));
    }
  };

  const validatePersonalInfo = (userInput: string, modifier: string) => {
    if (modifier === "height") {
      setHeight(userInput ? (parseInt(userInput) || 0).toString() : "0");
    } else if (modifier === "weight") {
      setWeight(userInput ? (parseInt(userInput) || 0).toString() : "0");
    } else if (modifier === "age") {
      if (parseInt(userInput) < 0 || parseInt(userInput) > 100) {
        alert("Please enter a valid age");
        setAge("0");
      } else {
        setAge(userInput ? (parseInt(userInput) || 0).toString() : "0");
      }
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <ThemedText type="title" style={styles.sharedText}>
          Sign Up
        </ThemedText>

        <SafeAreaView>
          <TextInput
            style={[styles.sharedText, styles.input]}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
          />

          <TextInput
            style={[styles.sharedText, styles.input]}
            onChangeText={setUsername}
            value={username}
            placeholder="Username"
          />

          <TextInput
            style={[styles.sharedText, styles.input]}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
          />

          <TextInput
            style={[styles.sharedText, styles.input]}
            onChangeText={(value) => {
              validatePersonalInfo(value, "age");
            }}
            value={parseInt(age) == 0 ? "" : age}
            placeholder="Age (years)"
          />

          <TextInput
            style={[styles.sharedText, styles.input]}
            onChangeText={(value) => {
              validatePersonalInfo(value, "height");
            }}
            value={parseInt(height) == 0 ? "" : height}
            placeholder="Height (cm)"
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.sharedText, styles.input]}
            onChangeText={(value) => {
              validatePersonalInfo(value, "weight");
            }}
            value={parseInt(weight) == 0 ? "" : weight}
            placeholder="Weight (kgs)"
            keyboardType="numeric"
          />

          <ThemedText style={styles.sharedText}>Goals</ThemedText>
          <TextInput
            style={[styles.sharedText, styles.input]}
            onChangeText={(value) => {
              updateGoals(value, "protein");
            }}
            value={parseInt(goals.protein) == 0 ? "" : goals.protein}
            placeholder="Protien (g)"
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.sharedText, styles.input]}
            onChangeText={(value) => {
              updateGoals(value, "calories");
            }}
            value={parseInt(goals.calories) == 0 ? "" : goals.calories}
            placeholder="Calories"
            keyboardType="numeric"
          />
        </SafeAreaView>

        <TouchableOpacity
          style={styles.TouchableOpacityButton}
          onPress={validateInput}
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
    </ScrollView>
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
