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

export default function LogIn() {
  const router = useRouter();

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
          placeholder="Email"
        />

        <TextInput
          style={[styles.sharedText, styles.input]}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
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
