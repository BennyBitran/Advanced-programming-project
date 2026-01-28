// src/components/BottomTabs.js
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../ui/tokens";

const TABS = [
  { key: "home", label: "Home", icon: "⌂" },
  { key: "starred", label: "Starred", icon: "☆" },
  { key: "shared", label: "Shared", icon: "👥" },
  { key: "recent", label: "Recents", icon: "🕒" },
];

export default function BottomTabs({ active, onChange }) {
  return (
    <View style={styles.wrap}>
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <Pressable key={t.key} onPress={() => onChange(t.key)} style={styles.tab}>
            <Text style={[styles.icon, on && styles.on]}>{t.icon}</Text>
            <Text style={[styles.label, on && styles.on]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 74,
    flexDirection: "row",
    backgroundColor: colors.searchPill,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
  },
  tab: { alignItems: "center", justifyContent: "center", width: "25%" },
  icon: { fontSize: 18, color: colors.muted },
  label: { marginTop: 4, fontSize: 12, color: colors.muted, fontWeight: "600" },
  on: { color: colors.text },
});
