import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { F } from "../constants/fonts";

const { width } = Dimensions.get("window");
const s = (n) => Math.round((width / 375) * n);

const years = ["All Years", "2024", "2023", "2022", "2021", "2020", "2019"];

// ── Icons ──────────────────────────────────────────────
const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#1d5152" />
  </Svg>
);

const SearchIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#6b7280" />
  </Svg>
);

const VerifiedIcon = () => (
  <Svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <Path d="M4.43333 12.25L3.325 10.3833L1.225 9.91667L1.42917 7.75833L0 6.125L1.42917 4.49167L1.225 2.33333L3.325 1.86667L4.43333 0L6.41667 0.845833L8.4 0L9.50833 1.86667L11.6083 2.33333L11.4042 4.49167L12.8333 6.125L11.4042 7.75833L11.6083 9.91667L9.50833 10.3833L8.4 12.25L6.41667 11.4042L4.43333 12.25ZM5.80417 8.19583L9.1 4.9L8.28333 4.05417L5.80417 6.53333L4.55 5.30833L3.73333 6.125L5.80417 8.19583Z" fill="#fff" />
  </Svg>
);

const SparkleIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" fill="#CAB3FF" opacity="0.8"/>
  </Svg>
);

const DocumentIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path d="M4 14H11V12H4V14ZM4 10H14V8H4V10ZM4 6H14V4H4V6ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM2 16H16V2H2V16Z" fill="#6b7280" />
  </Svg>
);

const ArrowIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <Path d="M9.13125 6.75H0V5.25H9.13125L4.93125 1.05L6 0L12 6L6 12L4.93125 10.95L9.13125 6.75Z" fill="white" />
  </Svg>
);

const TrendUpIcon = () => (
  <Svg width="15" height="9" viewBox="0 0 15 9" fill="none">
    <Path d="M1.05 9L0 7.95L5.55 2.3625L8.55 5.3625L12.45 1.5H10.5V0H15V4.5H13.5V2.55L8.55 7.5L5.55 4.5L1.05 9Z" fill="#CAB3FF" />
  </Svg>
);

const DifficultyIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <Path d="M0 12V7.5H2.25V12H0ZM4.5 12V3.75H6.75V12H4.5ZM9 12V0H11.25V12H9Z" fill="#6b7280" />
  </Svg>
);

const DurationIcon = () => (
  <Svg width="14" height="16" viewBox="0 0 14 16" fill="none">
    <Path d="M4.5 1.5V0H9V1.5H4.5ZM6 9.75H7.5V5.25H6V9.75ZM6.75 15.75C5.825 15.75 4.95313 15.5719 4.13438 15.2156C3.31563 14.8594 2.6 14.375 1.9875 13.7625C1.375 13.15 0.890625 12.4344 0.534375 11.6156C0.178125 10.7969 0 9.925 0 9C0 8.075 0.178125 7.20313 0.534375 6.38438C0.890625 5.56563 1.375 4.85 1.9875 4.2375C2.6 3.625 3.31563 3.14062 4.13438 2.78437C4.95313 2.42812 5.825 2.25 6.75 2.25C7.525 2.25 8.26875 2.375 8.98125 2.625C9.69375 2.875 10.3625 3.2375 10.9875 3.7125L12.0375 2.6625L13.0875 3.7125L12.0375 4.7625C12.5125 5.3875 12.875 6.05625 13.125 6.76875C13.375 7.48125 13.5 8.225 13.5 9C13.5 9.925 13.3219 10.7969 12.9656 11.6156C12.6094 12.4344 12.125 13.15 11.5125 13.7625C10.9 14.375 10.1844 14.8594 9.36563 15.2156C8.54688 15.5719 7.675 15.75 6.75 15.75ZM6.75 14.25C8.2 14.25 9.4375 13.7375 10.4625 12.7125C11.4875 11.6875 12 10.45 12 9C12 7.55 11.4875 6.3125 10.4625 5.2875C9.4375 4.2625 8.2 3.75 6.75 3.75C5.3 3.75 4.0625 4.2625 3.0375 5.2875C2.0125 6.3125 1.5 7.55 1.5 9C1.5 10.45 2.0125 11.6875 3.0375 12.7125C4.0625 13.7375 5.3 14.25 6.75 14.25Z" fill="#6b7280" />
  </Svg>
);

// ── Data ───────────────────────────────────────────────
const papers = [
  { id: 1, title: "PPSC IT Instructor 2023", difficulty: "Moderate", duration: "90 Mins", mcqs: "100 MCQs" },
  { id: 2, title: "FPSC Computer Instructor 2022", difficulty: "Expert", duration: "120 Mins", mcqs: "120 MCQs" },
  { id: 3, title: "SPSC IT Lecturer 2024 (Mock)", difficulty: "Moderate", duration: "90 Mins", mcqs: null },
];

// ── Main Component ──────────────────────────────────────
export default function SolvedPastPapers() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = papers.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solved Past Papers</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleBlock}>
          <View style={styles.titleLine} />
          <Text style={styles.pageTitle}>Solved Past Papers</Text>
          <Text style={styles.pageSubtitle}>IT Instructor (BPS-17) Professional Cadre</Text>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchIconPos}><SearchIcon /></View>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by paper title or subject keyword..."
            placeholderTextColor="#6B7280"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {years.map((y) => (
            <TouchableOpacity
              key={y}
              onPress={() => setSelectedYear(y)}
              style={[styles.chip, selectedYear === y ? styles.chipActive : styles.chipInactive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, selectedYear === y ? styles.chipTextActive : styles.chipTextInactive]}>{y}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.aiBanner}>
          <View style={styles.aiIconBox}><SparkleIcon /></View>
          <View style={styles.aiContent}>
            <Text style={styles.aiLabel}>AI ANALYSIS</Text>
            <Text style={styles.aiText}>
              Data Structures and OS concepts accounted for 42% of the questions in the last 3 years of IT Instructor papers. Prioritize these modules.
            </Text>
          </View>
        </View>

        {filtered.map((paper) => (
          <View key={paper.id} style={styles.paperCard}>
            <View style={styles.paperCardHeader}>
              <View style={styles.verifiedBadge}>
                <VerifiedIcon />
                <Text style={styles.verifiedText}>Solved & Verified</Text>
              </View>
              <DocumentIcon />
            </View>
            <Text style={styles.paperTitle}>{paper.title}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}><DifficultyIcon /><Text style={styles.metaText}>{paper.difficulty}</Text></View>
              <View style={styles.metaItem}><DurationIcon /><Text style={styles.metaText}>{paper.duration}</Text></View>
              {paper.mcqs && <View style={styles.metaItem}><Text style={styles.metaText}>{paper.mcqs}</Text></View>}
            </View>
            <View style={styles.cardFooter}>
              {paper.mcqs ? (
                <View style={styles.avatarPlaceholder} />
              ) : (
                <Text style={styles.updateText}>Updated 2 days ago</Text>
              )}
              <TouchableOpacity style={styles.viewBtn} activeOpacity={0.8}>
                <Text style={styles.viewBtnText}>View Solutions</Text>
                <ArrowIcon />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.aiCuratedCard}>
          <View style={styles.aiCuratedBadge}>
            <SparkleIcon />
            <Text style={styles.aiCuratedBadgeText}>AI Curated Selection</Text>
          </View>
          <Text style={styles.aiCuratedTitle}>Most Repeated IT Concepts</Text>
          <Text style={styles.aiCuratedDesc}>
            A comprehensive compilation of the most frequent technical questions from 2015-2024 across all boards.
          </Text>
          <View style={styles.aiCuratedFooter}>
            <View style={styles.trendRow}>
              <TrendUpIcon />
              <Text style={styles.trendText}>Highly Recommended</Text>
            </View>
            <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
              <Text style={styles.startBtnText}>Start Review →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9f5ee" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#e5e3e1",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: F.semiBold, color: "#1a1a1a", textAlign: "center" },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 40 },

  titleBlock: { gap: 4, position: 'relative' },
  titleLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#CAB3FF",
    marginBottom: 6,
  },
  pageTitle: { fontSize: 24, fontFamily: F.display, color: "#1a1a1a", letterSpacing: -0.24 },
  pageSubtitle: { fontSize: 14, fontFamily: F.regular, color: "#6b7280" },

  searchWrapper: { position: "relative", justifyContent: "center" },
  searchIconPos: { position: "absolute", left: 14, zIndex: 1 },
  searchInput: {
    paddingVertical: 14, paddingLeft: 42, paddingRight: 16,
    borderRadius: 14, backgroundColor: "#ffffff",
    fontSize: 14, fontFamily: F.regular, color: "#1a1a1a",
    borderWidth: 1, borderColor: "#e5e3e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  chipsRow: { flexDirection: "row", gap: 8 },
  chip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 999, borderWidth: 1 },
  chipActive: { backgroundColor: "#0f2022", borderColor: "#0f2022" },
  chipInactive: { backgroundColor: "#ffffff", borderColor: "#e5e3e1" },
  chipText: { fontSize: 13, fontFamily: F.semiBold },
  chipTextActive: { color: "#ffffff" },
  chipTextInactive: { color: "#4b5563" },

  aiBanner: {
    flexDirection: "row", alignItems: "flex-start", gap: 14,
    padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: "#e5d9ff",
    backgroundColor: "#f5f0ff",
    shadowColor: "#CAB3FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  aiIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "#ffffff",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5d9ff",
  },
  aiContent: { flex: 1, gap: 4 },
  aiLabel: { fontSize: 10, fontFamily: F.bold, color: "#CAB3FF", textTransform: "uppercase", letterSpacing: 0.8 },
  aiText: { fontSize: 13, fontFamily: F.regular, color: "#4b5563", lineHeight: 20 },

  paperCard: {
    backgroundColor: "#ffffff", borderRadius: 16,
    borderWidth: 1, borderColor: "#e5e3e1", padding: 20, gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  paperCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  verifiedBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#1d5152", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4,
  },
  verifiedText: { fontSize: 11, fontFamily: F.semiBold, color: "#ffffff" },
  paperTitle: { fontSize: 17, fontFamily: F.bold, color: "#1a1a1a" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, fontFamily: F.regular, color: "#4b5563" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 4 },
  avatarPlaceholder: { width: 32, height: 32 },
  updateText: { fontSize: 12, fontFamily: F.regular, color: "#6b7280", fontStyle: "italic" },
  viewBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#0f2022", borderRadius: 999, paddingHorizontal: 20, paddingVertical: 10,
    shadowColor: "#0f2022",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  viewBtnText: { fontSize: 13, fontFamily: F.semiBold, color: "#ffffff" },

  aiCuratedCard: {
    backgroundColor: "#1d5152", borderRadius: 16,
    padding: 20, gap: 12,
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  aiCuratedBadge: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(202, 179, 255, 0.2)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(202, 179, 255, 0.3)",
  },
  aiCuratedBadgeText: { fontSize: 10, fontFamily: F.bold, color: "#ffffff", letterSpacing: 0.5 },
  aiCuratedTitle: { fontSize: 18, fontFamily: F.display, color: "#ffffff" },
  aiCuratedDesc: { fontSize: 13, fontFamily: F.regular, color: "rgba(255,255,255,0.8)", lineHeight: 20 },
  aiCuratedFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  trendRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  trendText: { fontSize: 12, fontFamily: F.semiBold, color: "#CAB3FF" },
  startBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "rgba(255,255,255,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startBtnText: { fontSize: 13, fontFamily: F.semiBold, color: "#ffffff" },
});