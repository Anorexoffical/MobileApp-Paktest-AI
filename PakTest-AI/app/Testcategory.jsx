import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { F } from "../constants/fonts";

const { width } = Dimensions.get("window");
const s = (n) => Math.round((width / 375) * n);

// ── Icons ──────────────────────────────────────────────
const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#1d5152" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <Path d="M5.01667 8.51667L9.12917 4.40417L8.3125 3.5875L5.01667 6.88333L3.35417 5.22083L2.5375 6.0375L5.01667 8.51667ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.83333 10.5C7.13611 10.5 8.23958 10.0479 9.14375 9.14375C10.0479 8.23958 10.5 7.13611 10.5 5.83333C10.5 4.53056 10.0479 3.42708 9.14375 2.52292C8.23958 1.61875 7.13611 1.16667 5.83333 1.16667C4.53056 1.16667 3.42708 1.61875 2.52292 2.52292C1.61875 3.42708 1.16667 4.53056 1.16667 5.83333C1.16667 7.13611 1.61875 8.23958 2.52292 9.14375C3.42708 10.0479 4.53056 10.5 5.83333 10.5Z" fill="#1d5152" />
  </Svg>
);

const SparkleIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" fill="#CAB3FF" opacity="0.8"/>
  </Svg>
);

const AccountantIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path d="M3 16V9H5V16H3ZM9 16V9H11V16H9ZM0 20V18H20V20H0ZM15 16V9H17V16H15ZM0 7V5L10 0L20 5V7H0ZM4.45 5H15.55L10 2.25L4.45 5Z" fill="#1d5152" />
  </Svg>
);

const TeacherIcon = () => (
  <Svg width="22" height="18" viewBox="0 0 22 18" fill="none">
    <Path d="M11 18L4 14.2V8.2L0 6L11 0L22 6V14H20V7.1L18 8.2V14.2L11 18ZM11 9.7L17.85 6L11 2.3L4.15 6L11 9.7ZM11 15.725L16 13.025V9.25L11 12L6 9.25V13.025L11 15.725Z" fill="#1d5152" />
  </Svg>
);

const NurseIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V6C0 5.45 0.195833 4.97917 0.5875 4.5875C0.979167 4.19583 1.45 4 2 4H6V2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0H12C12.55 0 13.0208 0.195833 13.4125 0.5875C13.8042 0.979167 14 1.45 14 2V4H18C18.55 4 19.0208 4.19583 19.4125 4.5875C19.8042 4.97917 20 5.45 20 6V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H2ZM2 18H18V6H2V18ZM8 4H12V2H8V4ZM9 13V16H11V13H14V11H11V8H9V11H6V13H9Z" fill="#1d5152" />
  </Svg>
);

const EngineerIcon = () => (
  <Svg width="22" height="18" viewBox="0 0 22 18" fill="none">
    <Path d="M0 18V15.2C0 14.65 0.141667 14.1333 0.425 13.65C0.708333 13.1667 1.1 12.8 1.6 12.55C2.45 12.1167 3.40833 11.75 4.475 11.45C5.54167 11.15 6.71667 11 8 11C9.28333 11 10.4583 11.15 11.525 11.45C12.5917 11.75 13.55 12.1167 14.4 12.55C14.9 12.8 15.2917 13.1667 15.575 13.65C15.8583 14.1333 16 14.65 16 15.2V18H0ZM8 10C6.9 10 5.95833 9.60833 5.175 8.825C4.39167 8.04167 4 7.1 4 6C4 4.9 4.39167 3.95833 5.175 3.175C5.95833 2.39167 6.9 2 8 2C9.1 2 10.0417 2.39167 10.825 3.175C11.6083 3.95833 12 4.9 12 6C12 7.1 11.6083 8.04167 10.825 8.825C10.0417 9.60833 9.1 10 8 10Z" fill="#1d5152" />
  </Svg>
);

// ── Data ───────────────────────────────────────────────
const jobPosts = [
  {
    id: 1,
    icon: <AccountantIcon />,
    title: "Accountant",
    department: "FINANCE DEPARTMENT",
    bpsLevel: "BPS-16",
    openSeats: "42 Positions",
    requirements: ["M.Com or MBA (Finance)", "Age: 21 - 28 (+5 Years Relaxation)"],
    isAiRecommended: true,
    category: "Finance",
  },
  {
    id: 2,
    icon: <TeacherIcon />,
    title: "Senior Secondary Teacher",
    department: "SCHOOL EDUCATION DEPT",
    bpsLevel: "BPS-16",
    openSeats: "156 Positions",
    requirements: ["Master's in Relevant Subject", "B.Ed / M.Ed degree"],
    isAiRecommended: false,
    category: "Education",
  },
  {
    id: 3,
    icon: <NurseIcon />,
    title: "Charge Nurse",
    department: "HEALTH DEPARTMENT",
    bpsLevel: "BPS-16",
    openSeats: "88 Positions",
    requirements: ["B.Sc Nursing (4 Years)", "PNC Registration Certificate"],
    isAiRecommended: false,
    category: "Healthcare",
  },
  {
    id: 4,
    icon: <EngineerIcon />,
    title: "Sub-Engineer (Civil)",
    department: "IRRIGATION DEPARTMENT",
    bpsLevel: "BPS-16",
    openSeats: "15 Positions",
    requirements: ["Diploma in Associate Engineering", "3 Years Professional Exp."],
    isAiRecommended: false,
    category: "Administration",
  },
];

const filters = ["All", "Finance", "Education", "Healthcare", "Administration"];

// ── Job Card ───────────────────────────────────────────
function JobCard({ post, onPrepare }) {
  return (
    <View style={[styles.card, post.isAiRecommended && styles.cardAi]}>
      {post.isAiRecommended && <View style={styles.aiBorder} />}

      <View style={styles.cardTop}>
        <View style={styles.iconBox}>{post.icon}</View>
        {post.isAiRecommended && (
          <View style={styles.aiBadge}>
            <SparkleIcon />
            <Text style={styles.aiBadgeText}>AI RECOMMENDED</Text>
          </View>
        )}
      </View>

      <Text style={styles.jobTitle}>{post.title}</Text>
      <Text style={styles.jobDept}>{post.department}</Text>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View>
          <Text style={styles.infoLabel}>BPS LEVEL</Text>
          <Text style={styles.infoValue}>{post.bpsLevel}</Text>
        </View>
        <View>
          <Text style={styles.infoLabel}>OPEN SEATS</Text>
          <Text style={styles.infoValue}>{post.openSeats}</Text>
        </View>
      </View>

      <Text style={styles.infoLabel}>REQUIREMENTS</Text>
      {post.requirements.map((r, i) => (
        <View key={i} style={styles.reqRow}>
          <CheckIcon />
          <Text style={styles.reqText}>{r}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.prepBtn, post.isAiRecommended ? styles.prepBtnAi : styles.prepBtnNormal]}
        onPress={onPrepare}
        activeOpacity={0.8}
      >
        <Text style={[styles.prepBtnText, post.isAiRecommended ? styles.prepBtnTextAi : styles.prepBtnTextNormal]}>
          Prepare Now →
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────
export default function Testcategory() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState(category || "All");

  const filtered = activeFilter === "All"
    ? jobPosts
    : jobPosts.filter((p) => p.category === activeFilter);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Listings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBubble1} />
          <View style={styles.heroBubble2} />
          <View style={styles.heroChip}>
            <SparkleIcon />
            <Text style={styles.heroChipText}>PPSC & FPSC PORTAL</Text>
          </View>
          <Text style={styles.heroTitle}>Latest Positions</Text>
          <Text style={styles.heroDesc}>
            Browse BPS-16 grade positions. Our AI-driven prep tracks help you master the exact syllabus for each department.
          </Text>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.chip, activeFilter === f ? styles.chipActive : styles.chipInactive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, activeFilter === f ? styles.chipTextActive : styles.chipTextInactive]}>
                {f === "All" ? "All Departments" : f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cards */}
        <View style={styles.cards}>
          {filtered.map((post) => (
            <JobCard
              key={post.id}
              post={post}
              onPrepare={() => router.push({ pathname: "/Jobcategory", params: { jobId: post.id, category: post.category, title: post.title } })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9f5ee" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

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

  hero: {
    backgroundColor: "#1d5152",
    margin: 16,
    borderRadius: 16,
    padding: 24,
    overflow: "hidden",
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  heroBubble1: {
    position: "absolute", right: -48, top: -48,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "#CAB3FF", opacity: 0.08,
  },
  heroBubble2: {
    position: "absolute", right: 60, bottom: -20,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "#CAB3FF", opacity: 0.12,
  },
  heroChip: {
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
    marginBottom: 12,
  },
  heroChipText: { 
    color: "#fff", 
    fontSize: 10, 
    fontFamily: F.bold, 
    letterSpacing: 1, 
    textTransform: "uppercase",
  },
  heroTitle: { color: "#fff", fontSize: 30, fontFamily: F.display, marginBottom: 10 },
  heroDesc: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: F.regular, lineHeight: 20 },

  filtersRow: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  chip: { 
    paddingHorizontal: 18, 
    paddingVertical: 9, 
    borderRadius: 999,
    borderWidth: 1,
  },
  chipActive: { 
    backgroundColor: "#0f2022",
    borderColor: "#0f2022",
  },
  chipInactive: { 
    backgroundColor: "#ffffff",
    borderColor: "#e5e3e1",
  },
  chipText: { fontSize: 13, fontFamily: F.semiBold },
  chipTextActive: { color: "#ffffff" },
  chipTextInactive: { color: "#4b5563" },

  cards: { padding: 16, gap: 14 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e3e1",
    backgroundColor: "#ffffff",
    padding: 20,
    gap: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardAi: { 
    borderColor: "#CAB3FF",
    shadowColor: "#CAB3FF",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  aiBorder: {
    position: "absolute", left: 0, top: 0, bottom: 0,
    width: 4,
    backgroundColor: "#CAB3FF",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  iconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    backgroundColor: "#f5f0ff", 
    justifyContent: "center", 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5d9ff",
  },
  aiBadge: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4, 
    backgroundColor: "#f5f0ff",
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5d9ff",
  },
  aiBadgeText: { 
    color: "#CAB3FF", 
    fontSize: 9, 
    fontFamily: F.bold, 
    textTransform: "uppercase", 
    letterSpacing: 0.5,
  },

  jobTitle: { fontSize: 17, fontFamily: F.semiBold, color: "#1a1a1a" },
  jobDept: { fontSize: 12, fontFamily: F.medium, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.4 },
  divider: { height: 1, backgroundColor: "#f9f5ee", marginVertical: 12 },

  infoRow: { flexDirection: "row", gap: 32, marginBottom: 12 },
  infoLabel: { fontSize: 10, fontFamily: F.bold, color: "#6b7280", textTransform: "uppercase", marginBottom: 2 },
  infoValue: { fontSize: 15, fontFamily: F.semiBold, color: "#1a1a1a" },

  reqRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 3 },
  reqText: { fontSize: 12, fontFamily: F.regular, color: "#4b5563" },

  prepBtn: { 
    marginTop: 12, 
    paddingVertical: 14, 
    borderRadius: 999, 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  prepBtnAi: { 
    backgroundColor: "#0f2022",
  },
  prepBtnNormal: { 
    backgroundColor: "#f9f5ee",
    borderWidth: 1,
    borderColor: "#e5e3e1",
  },
  prepBtnText: { fontSize: 14, fontFamily: F.semiBold },
  prepBtnTextAi: { color: "#ffffff" },
  prepBtnTextNormal: { color: "#1a1a1a" },
});