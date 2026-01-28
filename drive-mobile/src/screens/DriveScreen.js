// src/screens/DriveScreen.js
import { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { listFiles, getFile, starFile, unstarFile, deleteFile, searchFiles } from "../api/api";

import DriveHeader from "../components/DriveHeader";
import SectionHeader from "../components/SectionHeader";
import BottomTabs from "../components/BottomTabs";
import NewFab from "../components/NewFab";
import FileCard from "../components/FileCard";
import DriveRow from "../components/DriveRow";
import Breadcrumbs from "../components/BreadCrumbs";
import FileDetailsModal from "../components/FileDetailsModal";
import { colors } from "../ui/tokens";

export default function DriveScreen() {
  const { logout } = useAuth();

const [activeView, setActiveView] = useState("home"); // home | starred | shared | recent | trash | my-drive
  const [parentId, setParentId] = useState("");
  const [crumbs, setCrumbs] = useState([{ id:"", name: "My Drive" }]);

  const [viewMode, setViewMode] = useState("grid"); // default grid like screenshot
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");

  const requestId = useRef(0);

  const filters = useMemo(() => {
    const pid = typeof parentId === "string" && parentId.trim() === "" ? null : parentId;
    if (activeView === "home") return { parentId: parentId ?? "" };
    return { view: activeView, parentId: parentId ?? "" };
  }, [activeView, parentId]);

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      const data = await listFiles(filters);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setSearchMode(false);
    setQ("");
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, parentId]);

  async function openItem(item) {
    if (item.type === "folder") {
      setParentId(item.id);
      setCrumbs((prev) => [...prev, { id: item.id, name: item.name }]);
      return;
    }

    setSelected(item);
    setDetailsOpen(true);
    setContent("");
    setContentError("");

    const id = ++requestId.current;
    try {
      const data = await getFile(item.id);
      if (requestId.current !== id) return;
      setContent(data?.content ?? "");
    } catch (e) {
      if (requestId.current !== id) return;
      setContentError(e?.message || "Failed to load file content");
    }
  }

  function onCrumbPress(idx) {
    const target = crumbs[idx];
    setCrumbs((prev) => prev.slice(0, idx + 1));
    setParentId(target.id ?? null);
  }

  async function doSearch() {
    const trimmed = String(q ?? "").trim();
    if (!trimmed) {
      setSearchMode(false);
      return refresh();
    }
    setErr("");
    setLoading(true);
    try {
      const res = await searchFiles(trimmed);
      setItems(Array.isArray(res) ? res : []);
      setSearchMode(true);
    } catch (e) {
      setErr(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStar() {
    if (!selected) return;
    try {
      if (selected.starred) await unstarFile(selected.id);
      else await starFile(selected.id);

      setSelected((s) => (s ? { ...s, starred: !s.starred } : s));
      setItems((prev) => prev.map((x) => (x.id === selected.id ? { ...x, starred: !x.starred } : x)));

      if (activeView === "starred") refresh();
    } catch (e) {
      setErr(e?.message || "Failed to update star");
    }
  }

  async function doDelete() {
    if (!selected) return;
    try {
      await deleteFile(selected.id);
      setDetailsOpen(false);
      setSelected(null);
      refresh();
    } catch (e) {
      setErr(e?.message || "Failed to delete");
    }
  }

function setViewFromBottomTab(key) {
  setActiveView(key);
  setParentId(null);
  setCrumbs([{ id: null, name: "My Drive" }]);
}


  const bottomActive = activeView;

  const renderItem = ({ item }) =>
    viewMode === "grid" ? (
      <FileCard item={item} onPress={() => openItem(item)} />
    ) : (
      <DriveRow item={item} onPress={() => openItem(item)} />
    );

  return (
    <SafeAreaView style={styles.root}>
      <DriveHeader
        searchValue={q}
        onChangeSearch={setQ}
        onSubmitSearch={doSearch}
        onOpenMenu={() => {}}
        onRightAction={() => {}}
        onAvatarPress={logout}
      />

      {crumbs.length > 1 ? (
        <View style={styles.crumbsWrap}>
          <Breadcrumbs crumbs={crumbs} onCrumbPress={onCrumbPress} />
        </View>
      ) : null}

      <SectionHeader title="Files" viewMode={viewMode} onToggleView={setViewMode} />

      {err ? (
        <View style={styles.errWrap}>
          <Text style={styles.errText}>{err}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ color: colors.muted }}>{searchMode ? "No results" : "No items"}</Text>
            </View>
          }
        />
      )}

      <NewFab onPress={() => {}} />

      <BottomTabs active={bottomActive} onChange={setViewFromBottomTab} />

      <FileDetailsModal
        open={detailsOpen}
        file={selected}
        content={content}
        contentError={contentError}
        onClose={() => setDetailsOpen(false)}
        onStarToggle={toggleStar}
        onDelete={doDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: "center" },
  crumbsWrap: { paddingHorizontal: 14, marginTop: 6 },
  errWrap: { paddingHorizontal: 14, marginTop: 10 },
  errText: { color: colors.danger, fontWeight: "700" },
  empty: { padding: 24, alignItems: "center" },
});
