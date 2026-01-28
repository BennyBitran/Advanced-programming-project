// src/components/DriveHeader.js
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../ui/tokens";

export default function DriveHeader({
  searchValue,
  onChangeSearch,
  onSubmitSearch,
  onOpenMenu,
  onRightAction,   // sparkle
  onAvatarPress,
}) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onOpenMenu} hitSlop={10} style={styles.iconBtn}>
        <Text style={styles.icon}>≡</Text>
      </Pressable>

      <View style={styles.searchPill}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={searchValue}
          onChangeText={onChangeSearch}
          placeholder="Search in Drive"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={onSubmitSearch}
          autoCapitalize="none"
        />
      </View>

      <Pressable onPress={onRightAction} hitSlop={10} style={styles.iconBtn}>
        <Text style={styles.icon}>✦</Text>
      </Pressable>

      <Pressable onPress={onAvatarPress} hitSlop={10} style={styles.avatar}>
        <Text style={styles.avatarText}>λ</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bg,
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 18, color: colors.text },

  searchPill: {
    flex: 1,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.searchPill,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  searchIcon: { color: colors.muted, fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 0 },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  avatarText: { color: colors.primary, fontWeight: "900" },
});
