import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { F } from "../constants/fonts";

const { width } = Dimensions.get("window");
const s = (n) => Math.round((width / 375) * n);

// ── Icons ──────────────────────────────────────────────
const ArrowIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#1d5152" />
  </Svg>
);

const InfoIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#CAB3FF" />
  </Svg>
);

const AIIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path d="M8 13H10L10.15 11.75C10.2833 11.7 10.4042 11.6417 10.5125 11.575C10.6208 11.5083 10.7167 11.4333 10.8 11.35L11.95 11.85L12.95 10.15L11.95 9.4C11.9833 9.26667 12 9.13333 12 9C12 8.86667 11.9833 8.73333 11.95 8.6L12.95 7.85L11.95 6.15L10.8 6.65C10.7167 6.56667 10.6208 6.49167 10.5125 6.425C10.4042 6.35833 10.2833 6.3 10.15 6.25L10 5H8L7.85 6.25C7.71667 6.3 7.59583 6.35833 7.4875 6.425C7.37917 6.49167 7.28333 6.56667 7.2 6.65L6.05 6.15L5.05 7.85L6.05 8.6C6.01667 8.73333 6 8.86667 6 9C6 9.13333 6.01667 9.26667 6.05 9.4L5.05 10.15L6.05 11.85L7.2 11.35C7.28333 11.4333 7.37917 11.5083 7.4875 11.575C7.59583 11.6417 7.71667 11.7 7.85 11.75L8 13ZM9 10.5C8.58333 10.5 8.22917 10.3542 7.9375 10.0625C7.64583 9.77083 7.5 9.41667 7.5 9C7.5 8.58333 7.64583 8.22917 7.9375 7.9375C8.22917 7.64583 8.58333 7.5 9 7.5C9.41667 7.5 9.77083 7.64583 10.0625 7.9375C10.3542 8.22917 10.5 8.58333 10.5 9C10.5 9.41667 10.3542 9.77083 10.0625 10.0625C9.77083 10.3542 9.41667 10.5 9 10.5ZM3 20V15.7C2.05 14.8333 1.3125 13.8208 0.7875 12.6625C0.2625 11.5042 0 10.2833 0 9C0 6.5 0.875 4.375 2.625 2.625C4.375 0.875 6.5 0 9 0C11.0833 0 12.9292 0.6125 14.5375 1.8375C16.1458 3.0625 17.1917 4.65833 17.675 6.625L18.975 11.75C19.0583 12.0667 19 12.3542 18.8 12.6125C18.6 12.8708 18.3333 13 18 13H16V16C16 16.55 15.8042 17.0208 15.4125 17.4125C15.0208 17.8042 14.55 18 14 18H12V20H3Z" fill="#CAB3FF" />
  </Svg>
);

const CheckCircleIcon = () => (
  <Svg width="21" height="16" viewBox="0 0 21 16" fill="none">
    <Path d="M8.025 16C5.79167 16 3.89583 15.225 2.3375 13.675C0.779167 12.125 0 10.2333 0 8C0 5.76667 0.779167 3.875 2.3375 2.325C3.89583 0.775 5.79167 0 8.025 0H12.05C14.2833 0 16.1792 0.775 17.7375 2.325C19.2958 3.875 20.075 5.76667 20.075 8C20.075 10.2333 19.2958 12.125 17.7375 13.675C16.1792 15.225 14.2833 16 12.05 16H8.025ZM8.625 9.675L6.5 7.55C6.31667 7.35 6.0875 7.25 5.8125 7.25C5.5375 7.25 5.3 7.35 5.1 7.55C4.9 7.75 4.8 7.9875 4.8 8.2625C4.8 8.5375 4.9 8.76667 5.1 8.95L7.575 11.425C7.875 11.725 8.23333 11.875 8.65 11.875C9.06667 11.875 9.41667 11.725 9.7 11.425L15 6.125C15.2 5.94167 15.3 5.70833 15.3 5.425C15.3 5.14167 15.2 4.90833 15 4.725C14.8 4.525 14.5625 4.425 14.2875 4.425C14.0125 4.425 13.775 4.525 13.575 4.725L8.625 9.675Z" fill="#fff" />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="18" height="21" viewBox="0 0 18 21" fill="none">
    <Path d="M6 2V0H12V2H6ZM8 13H10V7H8V13ZM9 21C7.76667 21 6.60417 20.7625 5.5125 20.2875C4.42083 19.8125 3.46667 19.1667 2.65 18.35C1.83333 17.5333 1.1875 16.5792 0.7125 15.4875C0.2375 14.3958 0 13.2333 0 12C0 10.7667 0.2375 9.60417 0.7125 8.5125C1.1875 7.42083 1.83333 6.46667 2.65 5.65C3.46667 4.83333 4.42083 4.1875 5.5125 3.7125C6.60417 3.2375 7.76667 3 9 3C10.0333 3 11.025 3.16667 11.975 3.5C12.925 3.83333 13.8167 4.31667 14.65 4.95L16.05 3.55L17.45 4.95L16.05 6.35C16.6833 7.18333 17.1667 8.075 17.5 9.025C17.8333 9.975 18 10.9667 18 12C18 13.2333 17.7625 14.3958 17.2875 15.4875C16.8125 16.5792 16.1667 17.5333 15.35 18.35C14.5333 19.1667 13.5792 19.8125 12.4875 20.2875C11.3958 20.7625 10.2333 21 9 21Z" fill="#fff" />
  </Svg>
);

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#1d5152" />
  </Svg>
);

const SparkleIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" fill="#CAB3FF" opacity="0.8"/>
  </Svg>
);

const BookIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M4 6h16v12H4z" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 6l8 4 8-4" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Main Screen ────────────────────────────────────────
export default function Jobcategory() {
  const { title, category } = useLocalSearchParams();
  const router = useRouter();

  const testPatternItems = [
    { label: "Total MCQs", value: "100" },
    { label: "Time", value: "90m" },
    { label: "Subject", value: "80%" },
    { label: "GK/ENG", value: "20%" },
  ];

  const books = [
    { title: "FPSC Auditor's Guide", author: "Kashif Ali, 2024 Ed." },
    { title: "Adv. Accounting Vol II", author: "M. Hanif & Mukherjee" },
  ];

  const topics = ["Company Law", "Cost Accounting", "Grammar", "Constitution"];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || "Job Category"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBubble1} />
          <View style={styles.heroBubble2} />
          <View style={styles.chip}>
            <SparkleIcon />
            <Text style={styles.chipText}>FEDERAL PUBLIC SERVICE COMMISSION</Text>
          </View>
          <Text style={styles.heroTitle}>{title || "Job Category"}</Text>
          <Text style={styles.heroDesc}>
            Master the curriculum with AI-powered insights, comprehensive past papers, and specialized courses tailored for the upcoming recruitment cycle.
          </Text>
        </View>

        {/* Solved Past Papers */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => router.push({ pathname: "/solvedpastpaper", params: { title: title } })}>
          <View style={[styles.cardIconBox, { backgroundColor: "#1d5152" }]}>
            <CheckCircleIcon />
          </View>
          <Text style={styles.cardTitle}>Solved Past Papers</Text>
          <Text style={styles.cardDesc}>24 papers with detailed explanations and step-by-step solutions.</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>100% Verified</Text>
            <ArrowIcon />
          </View>
        </TouchableOpacity>

        {/* Unsolved Papers */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => router.push({ pathname: "/unsolvedpapers", params: { title: title } })}>
          <View style={[styles.cardIconBox, { backgroundColor: "#CAB3FF" }]}>
            <ClockIcon />
          </View>
          <Text style={styles.cardTitle}>Unsolved Papers</Text>
          <Text style={styles.cardDesc}>Timed mock exams to test your accuracy and speed under pressure.</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>48 Mock Tests</Text>
            <ArrowIcon />
          </View>
        </TouchableOpacity>

        {/* Prep Courses */}
        <View style={styles.courseCard}>
          <View style={styles.courseGradient} />
          <View style={styles.chipLight}>
            <SparkleIcon />
            <Text style={styles.chipTextLight}>PREMIUM CONTENT</Text>
          </View>
          <Text style={styles.courseTitle}>Comprehensive Prep Courses</Text>
          <Text style={styles.courseDesc}>
            Video lectures, PDF notes, and chapter-wise tests covering Accounting, Auditing, and GK.
          </Text>
          <TouchableOpacity style={styles.courseBtn} activeOpacity={0.8} onPress={() => router.push({ pathname: "/curriculum", params: { title: title } })}>
            <Text style={styles.courseBtnText}>EXPLORE CURRICULUM →</Text>
          </TouchableOpacity>
        </View>

        {/* Test Pattern - Redesigned Clean & Simple */}
        <View style={styles.patternCard}>
          <View style={styles.patternHeader}>
            <View>
              <Text style={styles.cardTitle}>Test Pattern</Text>
              <Text style={styles.patternSub}>Updated Oct 2023</Text>
            </View>
            <BookIcon />
          </View>
          <View style={styles.patternGrid}>
            {testPatternItems.map((item) => (
              <View key={item.label} style={styles.patternItem}>
                <Text style={styles.patternItemValue}>{item.value}</Text>
                <Text style={styles.patternItemLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <AIIcon />
            <Text style={styles.aiTitle}>Smart AI Insights</Text>
          </View>

          <View style={styles.weaknessBox}>
            <Text style={styles.weaknessLabel}>WEAKNESS DETECTED</Text>
            <Text style={styles.weaknessText}>
              Focus more on <Text style={{ fontWeight: "700", color: "#1d5152" }}>Auditing Standards</Text>. Your accuracy in this section is currently 42%.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RECOMMENDED BOOKS</Text>
            {books.map((book) => (
              <View key={book.title} style={styles.bookItem}>
                <View style={styles.bookCover} />
                <View>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TOPIC-WISE MCQS</Text>
            <View style={styles.topicsRow}>
              {topics.map((t) => (
                <View key={t} style={styles.topicChip}>
                  <Text style={styles.topicChipText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Ask AI Button */}
        <TouchableOpacity style={styles.aiBtn} activeOpacity={0.8} onPress={() => router.push("/Test")}>
          <SparkleIcon />
          <Text style={styles.aiBtnText}>Ask AI Assistant</Text>
        </TouchableOpacity>
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
  scrollContent: { padding: 16, gap: 14, paddingBottom: 40 },

  hero: {
    backgroundColor: "#1d5152", 
    borderRadius: 16,
    padding: 24, 
    overflow: "hidden", 
    gap: 10,
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  heroBubble1: {
    position: "absolute", right: -40, top: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: "#CAB3FF", opacity: 0.08,
  },
  heroBubble2: {
    position: "absolute", right: 60, bottom: -20,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "#CAB3FF", opacity: 0.12,
  },
  chip: {
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
  chipText: { color: "#fff", fontSize: 10, fontFamily: F.bold, letterSpacing: 0.6 },
  chipLight: {
    flexDirection: "row",
    alignSelf: "flex-start", 
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(202, 179, 255, 0.15)",
    borderRadius: 999, 
    paddingHorizontal: 12, 
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(202, 179, 255, 0.2)",
  },
  chipTextLight: { color: "#CAB3FF", fontSize: 10, fontFamily: F.bold, letterSpacing: 0.6 },
  heroTitle: { color: "#fff", fontSize: 28, fontFamily: F.display, lineHeight: 36 },
  heroDesc: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: F.regular, lineHeight: 20 },

  card: {
    backgroundColor: "#ffffff", 
    borderRadius: 16,
    borderWidth: 1, 
    borderColor: "#e5e3e1", 
    padding: 20, 
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 17, fontFamily: F.semiBold, color: "#1a1a1a" },
  cardDesc: { fontSize: 13, fontFamily: F.regular, color: "#4b5563", lineHeight: 20 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  cardFooterText: { fontSize: 12, fontFamily: F.medium, color: "#6b7280" },

  courseCard: {
    backgroundColor: "#1d5152", 
    borderRadius: 16,
    padding: 24, 
    overflow: "hidden", 
    gap: 10,
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  courseGradient: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(202, 179, 255, 0.08)',
  },
  courseTitle: { color: "#fff", fontSize: 24, fontFamily: F.display, lineHeight: 30 },
  courseDesc: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: F.regular, lineHeight: 20 },
  courseBtn: {
    alignSelf: "flex-start", 
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "rgba(255,255,255,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseBtnText: { color: "#ffffff", fontSize: 11, fontFamily: F.bold, letterSpacing: 0.6 },

  patternCard: {
    backgroundColor: "#ffffff", 
    borderRadius: 16,
    borderWidth: 1, 
    borderColor: "#e5e3e1", 
    padding: 20, 
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  patternHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 4,
  },
  patternSub: { fontSize: 12, fontFamily: F.regular, color: "#6b7280", marginTop: 2 },
  patternGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap",
    gap: 10,
  },
  patternItem: {
    flex: 1,
    minWidth: (width - 70) / 2,
    backgroundColor: "#f9f5ee", 
    borderRadius: 12, 
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center", 
    borderWidth: 1,
    borderColor: "#e5e3e1",
  },
  patternItemValue: { 
    fontSize: 20, 
    fontFamily: F.bold, 
    color: "#1a1a1a",
    marginBottom: 4,
  },
  patternItemLabel: { 
    fontSize: 10, 
    fontFamily: F.regular, 
    color: "#6b7280", 
    textAlign: "center",
  },

  aiCard: {
    backgroundColor: "#ffffff", 
    borderRadius: 16,
    borderWidth: 1, 
    borderColor: "#e5e3e1", 
    padding: 20, 
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  aiTitle: { fontSize: 17, fontFamily: F.semiBold, color: "#CAB3FF" },
  weaknessBox: {
    backgroundColor: "#f5f0ff", 
    borderRadius: 12,
    borderLeftWidth: 4, 
    borderLeftColor: "#CAB3FF", 
    padding: 14, 
    gap: 6,
  },
  weaknessLabel: { fontSize: 11, fontFamily: F.bold, color: "#1d5152", letterSpacing: 0.6 },
  weaknessText: { fontSize: 13, fontFamily: F.regular, color: "#4b5563", lineHeight: 20 },

  section: { borderTopWidth: 1, borderTopColor: "#f9f5ee", paddingTop: 12, gap: 10 },
  sectionLabel: { fontSize: 11, fontFamily: F.bold, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.6 },

  bookItem: { flexDirection: "row", alignItems: "center", gap: 14 },
  bookCover: { width: 40, height: 54, borderRadius: 6, backgroundColor: "#e5e3e1" },
  bookTitle: { fontSize: 14, fontFamily: F.semiBold, color: "#1a1a1a" },
  bookAuthor: { fontSize: 11, fontFamily: F.regular, color: "#6b7280", marginTop: 2 },

  topicsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  topicChip: { 
    backgroundColor: "#f9f5ee", 
    borderRadius: 999, 
    paddingHorizontal: 14, 
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e3e1",
  },
  topicChipText: { fontSize: 12, fontFamily: F.medium, color: "#1a1a1a" },

  aiBtn: {
    flexDirection: "row",
    borderWidth: 2, 
    borderColor: "#CAB3FF", 
    borderRadius: 999,
    paddingVertical: 16, 
    alignItems: "center", 
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#CAB3FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  aiBtnText: { fontSize: 15, fontFamily: F.semiBold, color: "#CAB3FF" },
});