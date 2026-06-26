import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect, LinearGradient, Stop, Defs } from "react-native-svg";
import { F } from "../../constants/fonts";
import { useState } from "react";

const { width } = Dimensions.get("window");

// ── Icons ──────────────────────────────────────────────
const CheckIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff" />
  </Svg>
);

const PencilIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#ffffff" />
  </Svg>
);

const TrophyIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="#1d5152" />
  </Svg>
);

const StarIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2l1.5 5h5l-4 3.5 1.5 5-4-3-4 3 1.5-5-4-3.5h5z" stroke="#1d5152" strokeWidth="2" strokeLinejoin="round" fill="none" />
  </Svg>
);

const TargetIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#1d5152" strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke="#1d5152" strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill="#1d5152" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#1d5152" strokeWidth="2" />
    <Path d="M3 10h18M8 2v4M16 2v4" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const LightbulbIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M9 21h6v-1H9v1zm3-20C8.13 1 5 4.13 5 8c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-3.26C17.81 12.47 19 10.38 19 8c0-3.87-3.13-7-7-7z" fill="#CAB3FF" />
  </Svg>
);

const CogIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96a7.06 7.06 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.477.477 0 00-.59.22L2.74 8.87a.47.47 0 00.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.47.47 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 00-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="#1d5152" />
  </Svg>
);

const HelpIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="#1d5152" />
  </Svg>
);

const LogoutIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="#EF4444" />
  </Svg>
);

const ChevronRight = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="#6b7280" />
  </Svg>
);

const PlayIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M8 5v14l11-7L8 5z" fill="#fff" />
  </Svg>
);

const ClipboardIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="#CAB3FF" />
  </Svg>
);

// ── Data ───────────────────────────────────────────────
const achievements = [
  { id: 1, label: "Early Bird", Icon: StarIcon },
  { id: 2, label: "Night Owl", Icon: TrophyIcon },
  { id: 3, label: "Precision Master", Icon: TargetIcon },
  { id: 4, label: "10-Day Streak", Icon: CalendarIcon },
];

const progressItems = [
  { label: "PPSC Prep", value: 85 },
  { label: "FPSC Prep", value: 60 },
  { label: "CSS Core", value: 45 },
];

// ── Gradient Background Component ─────────────────────
const GradientCard = ({ children, style }) => (
  <View style={[styles.gradientWrapper, style]}>
    <View style={styles.gradientOverlay}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#CAB3FF" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#E0D9F0" stopOpacity="0.08" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#grad)" />
      </Svg>
    </View>
    {children}
  </View>
);

// ── Main Screen ────────────────────────────────────────
export default function Profile() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile Header - Enhanced */}
        <View style={styles.profileSection}>
          <View style={styles.profileBg}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>A</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <CheckIcon />
              </View>
            </View>
            <Text style={styles.profileName}>Aspirant Name</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>🏆 Level 12 · Elite Prep</Text>
            </View>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
              <PencilIcon />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats - Gradient Card */}
        <GradientCard style={styles.quickStatsRow}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>156</Text>
            <Text style={styles.quickStatLabel}>Tests Taken</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>82%</Text>
            <Text style={styles.quickStatLabel}>Avg. Score</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>15</Text>
            <Text style={styles.quickStatLabel}>Day Streak</Text>
          </View>
        </GradientCard>

        {/* Mastery & Progress - Redesigned with Gradient */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mastery & Progress</Text>
            <TouchableOpacity><Text style={styles.viewAll}>View All →</Text></TouchableOpacity>
          </View>
          <GradientCard style={styles.masteryCard}>
            <View style={styles.masteryLeft}>
              <View style={styles.masteryCircleContainer}>
                <View style={styles.masteryCircle}>
                  <Text style={styles.masteryCircleText}>72%</Text>
                  <Text style={styles.masteryCircleLabel}>Overall</Text>
                </View>
              </View>
              <View style={styles.masteryStats}>
                <View style={styles.masteryStat}>
                  <View style={[styles.masteryDot, { backgroundColor: '#1d5152' }]} />
                  <Text style={styles.masteryStatLabel}>Solved</Text>
                  <Text style={styles.masteryStatValue}>2,450</Text>
                </View>
                <View style={styles.masteryStat}>
                  <View style={[styles.masteryDot, { backgroundColor: '#CAB3FF' }]} />
                  <Text style={styles.masteryStatLabel}>Accuracy</Text>
                  <Text style={styles.masteryStatValue}>82%</Text>
                </View>
                <View style={styles.masteryStat}>
                  <View style={[styles.masteryDot, { backgroundColor: '#0f2022' }]} />
                  <Text style={styles.masteryStatLabel}>Streak</Text>
                  <Text style={styles.masteryStatValue}>15</Text>
                </View>
              </View>
            </View>
            <View style={styles.masteryRight}>
              {progressItems.map((item) => (
                <View key={item.label} style={styles.masteryProgressItem}>
                  <View style={styles.masteryProgressHeader}>
                    <Text style={styles.masteryProgressLabel}>{item.label}</Text>
                    <Text style={styles.masteryProgressValue}>{item.value}%</Text>
                  </View>
                  <View style={styles.masteryProgressBg}>
                    <View style={[styles.masteryProgressFill, { width: `${item.value}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </GradientCard>
        </View>

        {/* AI Insights - Gradient Card */}
        <View style={styles.section}>
          <GradientCard style={styles.insightCard}>
            <View style={styles.insightIconBg}>
              <LightbulbIcon />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>AI INSIGHTS</Text>
              <Text style={styles.insightText}>
                Improvement needed in <Text style={styles.bold}>Pakistan Affairs</Text> and <Text style={styles.bold}>Pedagogy</Text> based on your last 3 mock exams.
              </Text>
            </View>
          </GradientCard>
        </View>

        {/* Achievements - Gradient Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity><Text style={styles.viewAll}>View All →</Text></TouchableOpacity>
          </View>
          <View style={styles.achievementsWrapper}>
            <FlatList
              data={achievements}
              horizontal
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.achievementsList}
              renderItem={({ item }) => (
                <View style={styles.achievementItem}>
                  <View style={styles.achievementIcon}><item.Icon /></View>
                  <Text style={styles.achievementLabel}>{item.label}</Text>
                </View>
              )}
            />
          </View>
        </View>

        {/* Uncompleted Tests - Gradient Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <GradientCard style={styles.uncompletedCard}>
            <TouchableOpacity
              style={styles.uncompletedInner}
              activeOpacity={0.8}
              onPress={() => router.push("/Test")}
            >
              <View style={styles.uncompletedLeft}>
                <View style={styles.uncompletedIconBox}><ClipboardIcon /></View>
                <View style={styles.uncompletedInfo}>
                  <Text style={styles.uncompletedTitle}>Quantum Mechanics Quiz</Text>
                  <Text style={styles.uncompletedSub}>Physics · 13/20 questions</Text>
                  <View style={styles.uncompletedProgress}>
                    <View style={styles.uncompletedProgressBg}>
                      <View style={[styles.uncompletedProgressFill, { width: '65%' }]} />
                    </View>
                    <Text style={styles.uncompletedPercent}>65%</Text>
                  </View>
                </View>
              </View>
              <View style={styles.resumeBtn}>
                <Text style={styles.resumeBtnText}>Resume</Text>
              </View>
            </TouchableOpacity>
          </GradientCard>
        </View>

        {/* Daily Goal - Brand Color Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#ffffff' }]}>Daily Goal</Text>
          <View style={styles.dailyCard}>
            <View style={styles.dailyTop}>
              <View style={styles.dailyLeft}>
                <Text style={styles.dailyTitle}>Daily MCQ Challenge</Text>
                <Text style={styles.dailySubtitle}>Complete 50 MCQs to maintain your streak!</Text>
              </View>
              <View style={styles.circleSmall}>
                <Text style={styles.circleSmallText}>90%</Text>
              </View>
            </View>
            <View style={styles.dailyProgressRow}>
              <Text style={styles.dailyGoalText}>45 / 50 MCQs</Text>
              <Text style={styles.almostThere}>Almost there! 🎯</Text>
            </View>
            <View style={styles.dailyBarBg}>
              <View style={[styles.dailyBarFill, { width: "90%" }]} />
            </View>
            <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
              <PlayIcon />
              <Text style={styles.startBtnText}>Continue Challenge</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
            <View style={styles.menuIconBg}><CogIcon /></View>
            <Text style={styles.menuItemText}>Settings</Text>
            <ChevronRight />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
            <View style={styles.menuIconBg}><HelpIcon /></View>
            <Text style={styles.menuItemText}>Help & Support</Text>
            <ChevronRight />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.menuItemLogout]} activeOpacity={0.8}>
            <View style={styles.menuIconBgLogout}><LogoutIcon /></View>
            <Text style={[styles.menuItemText, styles.menuItemTextLogout]}>Logout</Text>
            <ChevronRight />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9f5ee" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 40 },

  gradientWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e3e1',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },

  profileSection: { 
    paddingVertical: 16, 
    marginBottom: 12,
  },
  profileBg: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e5e3e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  avatarContainer: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 100, 
    height: 100, 
    borderRadius: 50,
    backgroundColor: "#1d5152",
    justifyContent: "center", 
    alignItems: "center",
    borderWidth: 4, 
    borderColor: "#f9f5ee",
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarInitial: { fontSize: 38, fontFamily: F.bold, color: "#fff" },
  verifiedBadge: {
    position: "absolute", bottom: 2, right: 2,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#CAB3FF", 
    justifyContent: "center", 
    alignItems: "center",
    borderWidth: 3, 
    borderColor: "#ffffff",
    shadowColor: "#CAB3FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  profileName: { fontSize: 26, fontFamily: F.display, color: "#1a1a1a", marginBottom: 4 },
  levelBadge: { 
    backgroundColor: "#f9f5ee", 
    borderRadius: 999, 
    paddingHorizontal: 16, 
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e3e1",
    marginBottom: 14,
  },
  levelText: { fontSize: 12, fontFamily: F.semiBold, color: "#1d5152", letterSpacing: 0.6 },
  editButton: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 8,
    width: "100%", 
    paddingVertical: 14, 
    borderRadius: 999,
    backgroundColor: "#1d5152",
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: { fontSize: 15, fontFamily: F.semiBold, color: "#ffffff" },

  quickStatsRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e3e1",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  quickStat: { alignItems: "center" },
  quickStatNumber: { fontSize: 20, fontFamily: F.bold, color: "#1a1a1a" },
  quickStatLabel: { fontSize: 11, fontFamily: F.regular, color: "#6b7280", marginTop: 2 },
  quickStatDivider: { width: 1, height: 30, backgroundColor: "#e5e3e1" },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontFamily: F.bold, color: "#1a1a1a", marginBottom: 14 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  viewAll: { fontSize: 14, fontFamily: F.semiBold, color: "#1d5152" },

  masteryCard: {
    flexDirection: "column",
    padding: 20, 
    borderRadius: 16,
    borderWidth: 1, 
    borderColor: "#e5e3e1", 
    backgroundColor: "#ffffff", 
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  masteryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  masteryCircleContainer: {
    alignItems: "center",
  },
  masteryCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#CAB3FF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f5ee",
  },
  masteryCircleText: {
    fontSize: 20,
    fontFamily: F.extraBold,
    color: "#1a1a1a",
  },
  masteryCircleLabel: {
    fontSize: 8,
    fontFamily: F.regular,
    color: "#6b7280",
    marginTop: 1,
  },
  masteryStats: {
    flex: 1,
    gap: 6,
  },
  masteryStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  masteryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  masteryStatLabel: {
    fontSize: 12,
    fontFamily: F.regular,
    color: "#6b7280",
    flex: 1,
  },
  masteryStatValue: {
    fontSize: 13,
    fontFamily: F.bold,
    color: "#1a1a1a",
  },
  masteryRight: {
    borderTopWidth: 1,
    borderTopColor: "#f9f5ee",
    paddingTop: 14,
    gap: 10,
  },
  masteryProgressItem: {
    gap: 4,
  },
  masteryProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  masteryProgressLabel: {
    fontSize: 12,
    fontFamily: F.semiBold,
    color: "#4b5563",
  },
  masteryProgressValue: {
    fontSize: 12,
    fontFamily: F.bold,
    color: "#1a1a1a",
  },
  masteryProgressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f9f5ee",
    overflow: "hidden",
  },
  masteryProgressFill: {
    height: "100%",
    backgroundColor: "#1d5152",
    borderRadius: 3,
  },

  insightCard: {
    flexDirection: "row", 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: "#e5e3e1", 
    backgroundColor: "#ffffff", 
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  insightIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f5f0ff",
    justifyContent: "center",
    alignItems: "center",
  },
  insightContent: { flex: 1, gap: 4 },
  insightLabel: { fontSize: 10, fontFamily: F.semiBold, color: "#CAB3FF", letterSpacing: 1.2, textTransform: "uppercase" },
  insightText: { fontSize: 13, fontFamily: F.regular, color: "#4b5563", lineHeight: 20 },
  bold: { color: "#1a1a1a", fontFamily: F.semiBold },

  achievementsWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e3e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementsList: { flexDirection: "row", gap: 12 },
  achievementItem: { alignItems: "center", gap: 8, width: 85 },
  achievementIcon: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "#f9f5ee", 
    justifyContent: "center", 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e3e1",
  },
  achievementLabel: { fontSize: 10, fontFamily: F.medium, color: "#4b5563", textAlign: "center" },

  dailyCard: {
    padding: 20, 
    borderRadius: 16,
    borderWidth: 1, 
    borderColor: "#1d5152", 
    backgroundColor: "#1d5152", 
    gap: 14,
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  dailyTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  dailyLeft: { flex: 1 },
  dailyTitle: { fontSize: 16, fontFamily: F.bold, color: "#ffffff", marginBottom: 4 },
  dailySubtitle: { fontSize: 13, fontFamily: F.regular, color: "rgba(255,255,255,0.8)" },
  circleSmall: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 3, 
    borderColor: "#CAB3FF",
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "rgba(202, 179, 255, 0.1)",
  },
  circleSmallText: { fontSize: 12, fontFamily: F.bold, color: "#ffffff" },
  dailyProgressRow: { flexDirection: "row", justifyContent: "space-between" },
  dailyGoalText: { fontSize: 13, fontFamily: F.semiBold, color: "rgba(255,255,255,0.9)" },
  almostThere: { fontSize: 13, fontFamily: F.bold, color: "#CAB3FF" },
  dailyBarBg: { height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.2)", overflow: "hidden" },
  dailyBarFill: { height: "100%", backgroundColor: "#CAB3FF", borderRadius: 4 },
  startBtn: {
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    gap: 8,
    paddingVertical: 14, 
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "rgba(255,255,255,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  startBtnText: { fontSize: 15, fontFamily: F.semiBold, color: "#ffffff" },

  menuSection: { marginBottom: 24, gap: 6 },
  menuItem: {
    flexDirection: "row", 
    alignItems: "center", 
    gap: 14,
    paddingHorizontal: 16, 
    paddingVertical: 16,
    borderRadius: 14, 
    backgroundColor: "#ffffff",
    borderWidth: 1, 
    borderColor: "#e5e3e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f9f5ee",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIconBgLogout: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: { 
    flex: 1, 
    fontSize: 15, 
    fontFamily: F.regular, 
    color: "#1a1a1a"
  },
  menuItemLogout: { borderColor: "#fecaca" },
  menuItemTextLogout: { color: "#EF4444" },

  uncompletedCard: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    padding: 16, 
    borderRadius: 16,
    borderWidth: 1, 
    borderColor: "#e5e3e1", 
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  uncompletedInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  uncompletedLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  uncompletedIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "#f5f0ff", 
    justifyContent: "center", 
    alignItems: "center",
  },
  uncompletedInfo: { flex: 1, gap: 2 },
  uncompletedTitle: { fontSize: 14, fontFamily: F.semiBold, color: "#1a1a1a" },
  uncompletedSub: { fontSize: 12, fontFamily: F.regular, color: "#6b7280" },
  uncompletedProgress: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  uncompletedProgressBg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "#f9f5ee" },
  uncompletedProgressFill: { height: "100%", backgroundColor: "#CAB3FF", borderRadius: 2 },
  uncompletedPercent: { fontSize: 10, fontFamily: F.semiBold, color: "#CAB3FF" },
  resumeBtn: {
    backgroundColor: "#1d5152", 
    borderRadius: 999,
    paddingHorizontal: 18, 
    paddingVertical: 9,
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  resumeBtnText: { fontSize: 13, fontFamily: F.semiBold, color: "#ffffff" },
});