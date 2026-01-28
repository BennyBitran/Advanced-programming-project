// src/components/DriveRow.js
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing } from "../ui/tokens";

export default function DriveRow({ item, onPress }) {
  const isFolder = item.type === "folder";

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{isFolder ? "📁" : "📄"}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>
        <Text style={styles.meta}>
          {isFolder ? "Folder" : "File"}
          {item.starred ? " • Starred" : ""}
        </Text>
      </View>

      {item.starred ? <Text style={styles.star}>★</Text> : <Text style={styles.starOff}>☆</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  icon: { fontSize: 18 },
  name: { fontSize: 14, fontWeight: "600", color: colors.text },
  meta: { marginTop: 2, fontSize: 12, color: colors.muted },
  star: { fontSize: 16, color: "#F9AB00", marginLeft: spacing.sm },
  starOff: { fontSize: 16, color: colors.border, marginLeft: spacing.sm },
});
