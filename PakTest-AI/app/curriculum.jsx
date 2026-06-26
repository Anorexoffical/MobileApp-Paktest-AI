import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { C, T, S, R, rs, shared } from "../constants/design";

// ── Icons ────────────────────────────────────────────────
const BackIcon = () => (
  <Svg width={rs(24)} height={rs(24)} viewBox="0 0 24 24" fill="none">
    <Path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill={C.text} />
  </Svg>
);

const PlayIcon = () => (
  <Svg width={rs(16)} height={rs(16)} viewBox="0 0 24 24" fill="none">
    <Path d="M8 5V19L19 12L8 5Z" fill={C.textInvert} />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={rs(14)} height={rs(14)} viewBox="0 0 24 24" fill="none">
    <Path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill={C.success} />
  </Svg>
);

const LockIcon = () => (
  <Svg width={rs(14)} height={rs(14)} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill={C.textMuted} />
  </Svg>
);

const BookIcon = () => (
  <Svg width={rs(18)} height={rs(18)} viewBox="0 0 24 24" fill="none">
    <Path d="M19 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM9 4H11V9L10 8.25L9 9V4ZM19 20H6V4H7V13L10 10.75L13 13V4H19V20Z" fill={C.primary} />
  </Svg>
);

const VideoIcon = () => (
  <Svg width={rs(18)} height={rs(18)} viewBox="0 0 24 24" fill="none">
    <Path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill={C.primary} />
  </Svg>
);

const QuizIcon = () => (
  <Svg width={rs(18)} height={rs(18)} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM13 14H15V12H17V10H15V8H13V10H11V12H13V14Z" fill={C.primary} />
  </Svg>
);

const AIIcon = () => (
  <Svg width={rs(18)} height={rs(18)} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11C11 9.75 14 10.1 14 8C14 6.9 13.1 6 12 6C10.9 6 10 6.9 10 8H8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8C16 10.5 13 10.75 13 13Z" fill={C.primary} />
  </Svg>
);

const StarIcon = ({ filled }) => (
  <Svg width={rs(14)} height={rs(14)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
      fill={filled ? "#F59E0B" : C.muted}
    />
  </Svg>
);

const ArrowRight = () => (
  <Svg width={rs(14)} height={rs(14)} viewBox="0 0 24 24" fill="none">
    <Path d="M9.29 6.71L10.71 5.29L17.41 12L10.71 18.71L9.29 17.29L14.59 12L9.29 6.71Z" fill={C.textInvert} />
  </Svg>
);

// ── Data ──────────────────────────────────────────────────
const MODULES = [
  {
    id: 1,
    title: "Financial Accounting",
    lessons: 12,
    duration: "4h 20m",
    progress: 100,
    locked: false,
    type: "video",
    topics: ["Double Entry System", "Trial Balance", "Final Accounts", "Bank Reconciliation"],
  },
  {
    id: 2,
    title: "Auditing Principles",
    lessons: 10,
    duration: "3h 45m",
    progress: 60,
    locked: false,
    type: "video",
    topics: ["Types of Audit", "Internal Controls", "Auditing Standards (ISA)", "Audit Reports"],
  },
  {
    id: 3,
    title: "Cost & Management Accounting",
    lessons: 8,
    duration: "3h 10m",
    progress: 0,
    locked: false,
    type: "book",
    topics: ["Job Costing", "Process Costing", "Marginal Costing", "Standard Costing"],
  },
  {
    id: 4,
    title: "Company Law & Taxation",
    lessons: 9,
    duration: "3h 30m",
    progress: 0,
    locked: true,
    type: "book",
    topics: ["Companies Act 2017", "Income Tax Ordinance", "Sales Tax", "FBR Procedures"],
  },
  {
    id: 5,
    title: "General Knowledge & Pakistan Affairs",
    lessons: 14,
    duration: "5h 00m",
    progress: 0,
    locked: true,
    type: "quiz",
    topics: ["Constitution 1973", "Geography", "Current Affairs", "Pakistan Studies"],
  },
  {
    id: 6,
    title: "English Grammar & Comprehension",
    lessons: 7,
    duration: "2h 30m",
    progress: 0,
    locked: true,
    type: "quiz",
    topics: ["Tenses & Modals", "Sentence Correction", "Comprehension Passages", "Vocabulary"],
  },
];

const INSTRUCTORS = [
  { name: "Prof. Kashif Ali", role: "CA, ACCA · 12 Yrs Exp.", rating: 5 },
  { name: "Ms. Sara Noor", role: "M.Ed · English Specialist", rating: 4 },
];

const STATS = [
  { label: "Total Lessons", value: "60" },
  { label: "Total Duration", value: "22h" },
  { label: "Avg. Score Boost", value: "+34%" },
  { label: "Enrolled", value: "8.4k" },
];

// ── Sub-components ────────────────────────────────────────
function ModuleTypeIcon({ type }) {
  if (type === "video") return <VideoIcon />;
  if (type === "quiz") return <QuizIcon />;
  return <BookIcon />;
}

function ProgressBar({ progress }) {
  return (
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>
  );
}

function ModuleCard({ mod, index }) {
  const done = mod.progress === 100;
  const inProgress = mod.progress > 0 && mod.progress < 100;

  return (
    <View style={[styles.moduleCard, mod.locked && styles.moduleCardLocked]}>
      {inProgress && <View style={styles.moduleActiveBorder} />}

      <View style={styles.moduleHeader}>
        <View style={styles.moduleNumBox}>
          {done
            ? <CheckIcon />
            : <Text style={styles.moduleNum}>{String(index + 1).padStart(2, "0")}</Text>}
        </View>
        <View style={styles.moduleHeaderMid}>
          <Text style={styles.moduleTitle} numberOfLines={1}>{mod.title}</Text>
          <Text style={styles.moduleMeta}>{mod.lessons} lessons · {mod.duration}</Text>
        </View>
        <View style={styles.moduleTypeBox}>
          <ModuleTypeIcon type={mod.type} />
        </View>
        {mod.locked && <LockIcon />}
      </View>

      {!mod.locked && (
        <>
          <View style={styles.topicsWrap}>
            {mod.topics.map((t) => (
              <View key={t} style={styles.topicChip}>
                <Text style={styles.topicText}>{t}</Text>
              </View>
            ))}
          </View>

          {mod.progress > 0 && (
            <View style={styles.progressRow}>
              <ProgressBar progress={mod.progress} />
              <Text style={styles.progressPct}>{mod.progress}%</Text>
            </View>
          )}

          <TouchableOpacity style={[styles.moduleBtn, done && styles.moduleBtnDone]} activeOpacity={0.8}>
            <PlayIcon />
            <Text style={styles.moduleBtnText}>
              {done ? "Review Module" : inProgress ? "Continue" : "Start Module"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {mod.locked && (
        <Text style={styles.lockedMsg}>Unlock after completing previous module</Text>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────
export default function Curriculum() {
  const { title } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("modules");

  const tabs = ["modules", "instructors", "overview"];

  return (
    <SafeAreaView style={shared.safe} edges={["top"]}>
      {/* Header */}
      <View style={shared.header}>
        <TouchableOpacity onPress={() => router.back()} style={shared.backBtn}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={shared.headerTitle} numberOfLines={1}>
          {title ? `${title} · Curriculum` : "Curriculum"}
        </Text>
        <View style={{ width: rs(40) }} />
      </View>

      <ScrollView style={shared.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={shared.heroCard}>
          <View style={shared.heroBubble1} />
          <View style={shared.heroBubble2} />
          <View style={shared.chip}>
            <Text style={shared.chipText}>PREMIUM CURRICULUM</Text>
          </View>
          <Text style={styles.heroTitle}>Comprehensive{"\n"}Prep Courses</Text>
          <Text style={styles.heroDesc}>
            Video lectures, PDF notes & chapter-wise tests covering the full FPSC syllabus — built for exam success.
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabsBar}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => setActiveTab(t)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── MODULES TAB ── */}
        {activeTab === "modules" && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Course Modules</Text>
            <Text style={styles.sectionSub}>{MODULES.length} modules · Complete in order</Text>
            {MODULES.map((mod, i) => (
              <ModuleCard key={mod.id} mod={mod} index={i} />
            ))}
          </View>
        )}

        {/* ── INSTRUCTORS TAB ── */}
        {activeTab === "instructors" && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Meet Your Instructors</Text>
            {INSTRUCTORS.map((inst) => (
              <View key={inst.name} style={styles.instructorCard}>
                <View style={styles.instructorAvatar}>
                  <Text style={styles.instructorInitial}>{inst.name[0]}</Text>
                </View>
                <View style={styles.instructorInfo}>
                  <Text style={styles.instructorName}>{inst.name}</Text>
                  <Text style={styles.instructorRole}>{inst.role}</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIcon key={i} filled={i <= inst.rating} />
                    ))}
                  </View>
                </View>
              </View>
            ))}

            {/* AI Tip */}
            <View style={styles.aiCard}>
              <View style={styles.aiCardHeader}>
                <AIIcon />
                <Text style={styles.aiCardLabel}>AI INSIGHTS</Text>
              </View>
              <Text style={styles.aiCardTitle}>Personalised Learning Path</Text>
              <Text style={styles.aiCardDesc}>
                Based on your performance, our AI recommends starting with Auditing Principles to address your 42% accuracy gap before moving to Taxation.
              </Text>
            </View>
          </View>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>What You'll Learn</Text>

            {[
              "Full FPSC/PPSC syllabus coverage with chapter-wise breakdowns",
              "Practice MCQs aligned to past papers from 2015–2024",
              "AI-driven weakness detection and targeted recommendations",
              "PDF notes downloadable for offline revision",
              "Mock tests timed exactly like real exam conditions",
            ].map((item, i) => (
              <View key={i} style={styles.outcomeRow}>
                <CheckIcon />
                <Text style={styles.outcomeText}>{item}</Text>
              </View>
            ))}

            <View style={styles.divider} />
            <Text style={styles.sectionHeading}>Requirements</Text>
            {[
              "Intermediate or equivalent qualification",
              "Basic understanding of accounting principles is a plus",
              "Access to a smartphone or tablet",
            ].map((item, i) => (
              <View key={i} style={styles.outcomeRow}>
                <View style={styles.bullet} />
                <Text style={styles.outcomeText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.8}>
          <Text style={styles.ctaBtnText}>Enroll Now — Free</Text>
          <ArrowRight />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: { padding: S.base, gap: S.md, paddingBottom: rs(40) },

  // Hero
  heroTitle: { ...T.display, color: C.textInvert },
  heroDesc:  { ...T.body, color: C.textDim },

  // Stats
  statsRow: {
    flexDirection: "row", backgroundColor: C.surface,
    borderRadius: R.lg, borderWidth: 1, borderColor: C.border,
    overflow: "hidden",
  },
  statBox: {
    flex: 1, alignItems: "center", paddingVertical: S.md,
    borderRightWidth: 1, borderRightColor: C.borderLight,
  },
  statValue: { ...T.heading, color: C.text },
  statLabel: { ...T.overline, color: C.textMuted, marginTop: rs(2), textTransform: "uppercase" },

  // Tabs
  tabsBar: {
    flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.borderLight, gap: S.lg,
  },
  tab: { paddingBottom: rs(10), borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: C.text },
  tabText: { ...T.label, color: C.textMuted, textTransform: "capitalize" },
  tabTextActive: { color: C.text, fontWeight: "700" },

  // Section
  section: { gap: S.md },
  sectionHeading: { ...T.title, color: C.text },
  sectionSub:     { ...T.body, color: C.textSub },

  // Module Card
  moduleCard: {
    backgroundColor: C.surface, borderRadius: R.lg,
    borderWidth: 1, borderColor: C.border,
    padding: S.lg, gap: S.sm, overflow: "hidden",
  },
  moduleCardLocked: { backgroundColor: C.subtle, borderColor: C.borderLight },
  moduleActiveBorder: {
    position: "absolute", left: 0, top: 0, bottom: 0,
    width: rs(4), backgroundColor: C.primary,
  },
  moduleHeader:    { flexDirection: "row", alignItems: "center", gap: S.sm },
  moduleNumBox: {
    width: rs(32), height: rs(32), borderRadius: R.sm,
    backgroundColor: C.subtle, justifyContent: "center", alignItems: "center",
  },
  moduleNum:       { ...T.label, fontWeight: "700", color: C.textSub },
  moduleHeaderMid: { flex: 1 },
  moduleTitle:     { ...T.title, color: C.text },
  moduleMeta:      { ...T.caption, color: C.textMuted, marginTop: rs(2) },
  moduleTypeBox: {
    width: rs(32), height: rs(32), borderRadius: R.sm,
    backgroundColor: C.primaryLight, justifyContent: "center", alignItems: "center",
  },
  topicsWrap:  { flexDirection: "row", flexWrap: "wrap", gap: S.xs },
  topicChip:   { backgroundColor: C.subtle, borderRadius: R.pill, paddingHorizontal: rs(10), paddingVertical: rs(4) },
  topicText:   { ...T.caption, color: C.textSub },
  progressRow: { flexDirection: "row", alignItems: "center", gap: S.sm },
  progressBg:  { flex: 1, height: rs(6), backgroundColor: C.muted, borderRadius: R.pill },
  progressFill: { height: rs(6), backgroundColor: C.primary, borderRadius: R.pill },
  progressPct: { ...T.caption, fontWeight: "700", color: C.text, width: rs(32), textAlign: "right" },
  moduleBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: S.sm, backgroundColor: C.primary,
    borderRadius: R.md, paddingVertical: rs(12),
  },
  moduleBtnDone:   { backgroundColor: C.success },
  moduleBtnText:   { ...T.label, color: C.textInvert, fontWeight: "600" },
  lockedMsg:       { ...T.caption, color: C.textMuted, fontStyle: "italic" },

  // Instructor
  instructorCard: {
    flexDirection: "row", alignItems: "center", gap: S.md,
    backgroundColor: C.surface, borderRadius: R.lg,
    borderWidth: 1, borderColor: C.border, padding: S.lg,
  },
  instructorAvatar: {
    width: rs(52), height: rs(52), borderRadius: rs(26),
    backgroundColor: C.dark, justifyContent: "center", alignItems: "center",
  },
  instructorInitial: { ...T.heading, color: C.accent },
  instructorInfo:    { flex: 1, gap: rs(3) },
  instructorName:    { ...T.title, color: C.text },
  instructorRole:    { ...T.body, color: C.textSub },
  starsRow:          { flexDirection: "row", gap: rs(3), marginTop: rs(2) },

  // AI Card
  aiCard: {
    backgroundColor: C.primaryLight, borderRadius: R.lg,
    borderWidth: 1, borderColor: `${C.primary}33`, padding: S.lg, gap: S.sm,
  },
  aiCardHeader: { flexDirection: "row", alignItems: "center", gap: S.xs },
  aiCardLabel:  { ...T.overline, color: C.primary },
  aiCardTitle:  { ...T.title, color: C.primaryDark },
  aiCardDesc:   { ...T.body, color: C.primaryDark },

  // Overview
  outcomeRow: { flexDirection: "row", alignItems: "flex-start", gap: S.sm },
  outcomeText: { ...T.body, color: C.textSub, flex: 1 },
  bullet: { width: rs(6), height: rs(6), borderRadius: rs(3), backgroundColor: C.textMuted, marginTop: rs(7) },
  divider: { height: 1, backgroundColor: C.borderLight },

  // CTA
  ctaBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: S.sm, backgroundColor: C.dark,
    borderRadius: R.lg, paddingVertical: rs(16),
  },
  ctaBtnText: { ...T.sub, color: C.textInvert, fontWeight: "700" },
});
