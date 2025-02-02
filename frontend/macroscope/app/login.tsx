import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";

export default function LogIn() {
  const router = useRouter();
  const fontsLoaded = useFonts({
    WorkSans: require("../assets/fonts/WorkSans-VariableFont_wght.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const validateInput = () => {
    if (email === "" || password === "") {
      alert("Please fill in all fields");
      return false;
    }
    alert(email + " " + password);
    router.push("/nutrients"); // naviage to the page after log in
    return true;
  };

  const handleLogin = async () => {
    const passedUserData = {
      email: email,
      password: password,
    };
    axios.post("http://localhost:3000/login", passedUserData).then((res) => {
      if (!res.data.ERROR && res.status === 200) {
        alert("Logged in successfully");
        router.push("/nutrients");
      } else {
        alert("Invalid username or password");
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.sharedText}>
        Log In
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
        <Text style={[styles.sharedText, styles.buttonText]}>Log in</Text>
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
    color: "white",
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
