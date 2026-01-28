import { useState } from "react";
import { SafeAreaView, Text, Button, View, TextInput } from "react-native";
import { loginUser, setToken } from "../api/api"; // adjust path if needed

export default function Login({ goHome, onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLogin() {
    setErr("");
    setLoading(true);
    try {
      const data = await loginUser({ username, password });

      // IMPORTANT: must match your backend response key
      const token = data?.token;
      if (!token) throw new Error("Token missing in response");

      await setToken(token);

      // tell App.js: logged in
      if (onLoggedIn) onLoggedIn();
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Login</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="username"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 12 }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 12 }}
      />

      {err ? <Text style={{ color: "red", marginBottom: 12 }}>{err}</Text> : null}

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={doLogin}
        disabled={loading}
      />

      <View style={{ height: 12 }} />
      <Button title="Back to Home" onPress={goHome} />
    </SafeAreaView>
  );
}
