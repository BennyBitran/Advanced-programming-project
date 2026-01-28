// src/components/SectionHeader.js
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../ui/tokens";

export default function SectionHeader({ title = "Files", viewMode, onToggleView }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.toggle}>
        <Pressable
          onPress={() => onToggleView("list")}
          style={[styles.toggleBtn, viewMode === "list" && styles.toggleBtnActive]}
        >
          <Text style={[styles.toggleIcon, viewMode === "list" && styles.toggleIconActive]}>≣</Text>
        </Pressable>

        <Pressable
          onPress={() => onToggleView("grid")}
          style={[styles.toggleBtn, viewMode === "grid" && styles.toggleBtnActive]}
        >
          <Text style={[styles.toggleIcon, viewMode === "grid" && styles.toggleIconActive]}>▦</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 10,
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: 18, fontWeight: "500", color: colors.text },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#F1F3F4",
    borderRadius: 16,
    padding: 4,
  },
  toggleBtn: {
    width: 40,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBtnActive: { backgroundColor: colors.searchPill },
  toggleIcon: { color: colors.muted, fontSize: 18 },
  toggleIconActive: { color: colors.text },
});
