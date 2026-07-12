import { useRouter, useFocusEffect } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { F } from "../../constants/fonts";
import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthProvider";
import { getTestBodies } from "../../src/api/testBodiesApi";

const { width } = Dimensions.get("window");

const mapTestBodiesToCategories = (items = []) =>
  items.map((item) => ({
    name: item.shortName || item.name || "Test Body",
    full: item.fullName || item.description || item.name || "Test Body",
    category: "All",
  }));

const circumference = 2 * Math.PI * 45;
const dashOffset = circumference * 0.25;

// ── Icons ──────────────────────────────────────────────
const TrophyIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="#CAB3FF" />
  </Svg>
);

const SparkleIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" fill="#CAB3FF" opacity="0.8"/>
  </Svg>
);

export default function Index() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setFetchLoading(true);
      setFetchError("");
      const data = await getTestBodies();
      setCategories(mapTestBodiesToCategories(data));
    } catch (error) {
      setFetchError(error.message || "Unable to load test categories.");
      setCategories([]);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories]),
  );

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 4);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerLabel}>Candidate Dashboard</Text>
              <Text style={styles.headerTitle}>Master your exams{"\n"}with AI precision.</Text>
            </View>
            <TouchableOpacity style={styles.notificationBadge}>
              <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M13.73 21a2 2 0 01-3.46 0" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
            <Circle cx="11" cy="11" r="8" stroke="#6b7280" strokeWidth="2" />
            <Path d="M21 21l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exams (e.g., PPSC Mock, FPSC Past Papers)"
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#f0f7f7' }]}>
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <Rect x="3" y="8" width="18" height="13" rx="2" stroke="#1d5152" strokeWidth="2" />
                <Path d="M16 8V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v3" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Tests Today</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#f5f0ff' }]}>
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke="#CAB3FF" strokeWidth="2" />
                <Path d="M12 6v6l4 2" stroke="#CAB3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={styles.statNumber}>84%</Text>
            <Text style={styles.statLabel}>Avg. Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#f9f5ee' }]}>
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0f2022" strokeWidth="2" strokeLinejoin="round" />
                <Path d="M2 17l10 5 10-5" stroke="#0f2022" strokeWidth="2" strokeLinejoin="round" />
                <Path d="M2 12l10 5 10-5" stroke="#0f2022" strokeWidth="2" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Streak Days</Text>
          </View>
        </View>

        {/* Trending Insights */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Trending Insights</Text>
          <TouchableOpacity style={styles.analyticsBtn}>
            <Text style={styles.analyticsBtnText}>View Analytics →</Text>
          </TouchableOpacity>
        </View>

        {/* Featured AI Card - Gradient Banner */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredGradient} />
          <View style={styles.featuredContent}>
            <View style={styles.aiBadge}>
              <SparkleIcon />
              <Text style={styles.aiBadgeText}>AI Recommended</Text>
            </View>
            <Text style={styles.featuredTitle}>Advanced PPSC General{"\n"}Knowledge</Text>
            <Text style={styles.featuredDesc}>Personalized quiz based on your weak areas in Pakistan Studies.</Text>
            <TouchableOpacity style={styles.startBtn}>
              <Text style={styles.startBtnText}>Start Now →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.featuredDecoration}>
            <Svg width="120" height="120" viewBox="0 0 100 100" fill="none">
              <Circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <Circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <Circle cx="50" cy="50" r="20" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
            </Svg>
          </View>
        </View>

        {/* Daily IQ Challenge - Updated purple progress */}
        <View style={styles.challengeCard}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <View style={styles.challengeIconBox}>
                <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="12" r="9" stroke="#CAB3FF" strokeWidth="1.8" />
                  <Path d="M12 7v5l3 3" stroke="#CAB3FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.challengeTitle}>Daily IQ Challenge</Text>
                <Text style={styles.challengeDesc}>Quick 10-minute mental agility test for competitive edge.</Text>
              </View>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.challengeActive}>1.2k active</Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Test Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Test Categories</Text>
          <TouchableOpacity onPress={() => setShowAllCategories(!showAllCategories)}>
            <Text style={styles.viewMoreBtn}>
              {showAllCategories ? 'Show Less' : 'View More →'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoriesGrid}>
          {fetchLoading ? (
            <Text style={styles.categoryFull}>Loading test categories...</Text>
          ) : fetchError ? (
            <Text style={styles.categoryFull}>{fetchError}</Text>
          ) : displayedCategories.length === 0 ? (
            <Text style={styles.categoryFull}>No test categories found.</Text>
          ) : displayedCategories.map((cat) => (
            <TouchableOpacity
              key={cat.name}
              style={styles.categoryCard}
              onPress={() => router.push({ pathname: "/Testcategory", params: { category: cat.category } })}
              activeOpacity={0.8}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIconWrapper}>
                  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#1d5152" strokeWidth="2" strokeLinejoin="round" />
                    <Path d="M2 17l10 5 10-5" stroke="#1d5152" strokeWidth="2" strokeLinejoin="round" />
                    <Path d="M2 12l10 5 10-5" stroke="#1d5152" strokeWidth="2" strokeLinejoin="round" />
                  </Svg>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{cat.category}</Text>
                </View>
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryFull} numberOfLines={2}>{cat.full}</Text>
              <View style={styles.categoryFooter}>
                <View style={styles.categoryDot} />
                <Text style={styles.categoryCount}>12 tests</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Progress - Updated purple circle */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Weekly Progress</Text>
            <Text style={styles.progressSubtitle}>75% Complete</Text>
          </View>
          <View style={styles.progressCircleContainer}>
            <Svg width="144" height="144" viewBox="0 0 100 100" style={{ transform: [{ rotate: "-90deg" }] }}>
              <Circle cx="50" cy="50" r="45" fill="none" stroke="#d5d0cc" strokeWidth="8" />
              <Circle
                cx="50" cy="50" r="45"
                fill="none" stroke="#CAB3FF" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </Svg>
            <Text style={styles.progressPercent}>75%</Text>
          </View>
          <Text style={styles.progressDesc}>
            You're just 4 mock tests away from reaching your weekly mastery goal. Keep going, Aspirant!
          </Text>
          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <Text style={styles.pillIcon}>✓</Text>
              <Text style={styles.pillText}>340 Solved</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillIcon}>✦</Text>
              <Text style={styles.pillText}>82% Avg. Score</Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity style={styles.bottomCta}>
          <Text style={styles.bottomCtaText}>Start Your Test Now</Text>
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path d="M5 12h14M12 5l7 7-7 7" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9f5ee" },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },

  header: { paddingTop: 16, paddingBottom: 16 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  headerLabel: { fontSize: 11, fontFamily: F.semiBold, letterSpacing: 1.2, textTransform: "uppercase", color: "#1d5152", marginBottom: 6 },
  headerTitle: { fontSize: 28, fontFamily: F.display, color: "#1a1a1a", lineHeight: 36 },
  notificationBadge: { 
    position: "relative", 
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e3e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationDot: { 
    position: "absolute", 
    top: 6, 
    right: 6, 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#ffffff"
  },

  searchWrapper: { position: "relative", marginBottom: 20, justifyContent: "center" },
  searchIcon: { position: "absolute", left: 14, zIndex: 1 },
  searchInput: {
    paddingVertical: 13, paddingLeft: 42, paddingRight: 16,
    borderRadius: 14, borderWidth: 1, borderColor: "#e5e3e1",
    backgroundColor: "#ffffff", fontSize: 14, fontFamily: F.regular, color: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 24,
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
  statItem: { alignItems: "center" },
  statIconContainer: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    backgroundColor: "#f9f5ee", 
    justifyContent: "center", 
    alignItems: "center",
    marginBottom: 6 
  },
  statNumber: { fontSize: 20, fontFamily: F.bold, color: "#1a1a1a" },
  statLabel: { fontSize: 11, fontFamily: F.regular, color: "#6b7280", marginTop: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: "#e5e3e1" },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "center", flex: 1 },
  sectionTitle: { fontSize: 17, fontFamily: F.bold, color: "#1a1a1a" },
  analyticsBtn: { flexDirection: "row", alignItems: "center" },
  analyticsBtnText: { fontSize: 13, fontFamily: F.semiBold, color: "#1d5152" },

  featuredCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "#1d5152",
    position: "relative",
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  featuredGradient: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(202, 179, 255, 0.15)',
  },
  featuredContent: { position: "relative", zIndex: 2 },
  featuredDecoration: {
    position: "absolute",
    right: -30,
    top: -30,
    zIndex: 1,
    opacity: 0.5,
  },
  aiBadge: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(202, 179, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(202, 179, 255, 0.3)",
  },
  aiBadgeText: { color: "#fff", fontSize: 10, fontFamily: F.bold, letterSpacing: 0.5 },
  featuredTitle: { fontSize: 22, fontFamily: F.display, color: "#fff", lineHeight: 30, marginBottom: 8 },
  featuredDesc: { fontSize: 13, fontFamily: F.regular, color: "rgba(255,255,255,0.85)", marginBottom: 20 },
  startBtn: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "rgba(255,255,255,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  startBtnText: { fontSize: 14, fontFamily: F.bold, color: "#ffffff" },

  challengeCard: {
    backgroundColor: "#ffffff", 
    borderRadius: 20, 
    padding: 18,
    marginBottom: 28, 
    borderWidth: 1, 
    borderColor: "#e5e3e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  challengeIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "#f5f0ff", borderWidth: 1, borderColor: "#e5d9ff",
    justifyContent: "center", alignItems: "center",
  },
  challengeTitle: { fontSize: 14, fontFamily: F.bold, color: "#1a1a1a", marginBottom: 3 },
  challengeDesc: { fontSize: 12, fontFamily: F.regular, color: "#6b7280" },
  activeBadge: { 
    backgroundColor: "#f5f0ff", 
    borderRadius: 12, 
    paddingHorizontal: 10, 
    paddingVertical: 4 
  },
  challengeActive: { fontSize: 11, fontFamily: F.semiBold, color: "#CAB3FF" },
  progressBarBg: { height: 6, backgroundColor: "#f5f0ff", borderRadius: 4, marginTop: 12, overflow: "hidden" },
  progressBarFill: { height: 6, backgroundColor: "#CAB3FF", borderRadius: 4, width: "60%" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  viewMoreBtn: {
    fontSize: 13,
    fontFamily: F.semiBold,
    color: "#1d5152",
  },

  categoriesGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between", 
    marginBottom: 28 
  },
  categoryCard: {
    width: "48%", 
    backgroundColor: "#ffffff", 
    borderRadius: 16,
    padding: 16, 
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e3e1",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f9f5ee",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e3e1",
  },
  categoryBadge: {
    backgroundColor: "#0f2022",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontFamily: F.semiBold,
    color: "#ffffff",
  },
  categoryName: { 
    fontSize: 16, 
    fontFamily: F.bold, 
    color: "#1a1a1a", 
    marginBottom: 4,
  },
  categoryFull: { 
    fontSize: 11, 
    fontFamily: F.regular, 
    color: "#6b7280", 
    marginBottom: 12,
    lineHeight: 14,
  },
  categoryFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CAB3FF",
  },
  categoryCount: {
    fontSize: 11,
    fontFamily: F.regular,
    color: "#6b7280",
  },

  progressSection: {
    backgroundColor: "#e5e3e1",
    borderRadius: 24, 
    padding: 28,
    borderWidth: 1, 
    borderColor: "#d5d0cc", 
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "100%", 
    marginBottom: 16 
  },
  progressTitle: { fontSize: 17, fontFamily: F.bold, color: "#1a1a1a" },
  progressSubtitle: { fontSize: 14, fontFamily: F.semiBold, color: "#CAB3FF" },
  progressCircleContainer: { position: "relative", alignItems: "center", justifyContent: "center" },
  progressPercent: {
    position: "absolute",
    fontSize: 22,
    fontFamily: F.extraBold,
    color: "#1a1a1a",
  },
  progressDesc: { 
    fontSize: 13, 
    fontFamily: F.regular, 
    color: "#4b5563", 
    textAlign: "center", 
    maxWidth: 260, 
    marginTop: 16,
    marginBottom: 20 
  },
  pillsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap", justifyContent: "center" },
  pill: {
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "#ffffff", 
    borderWidth: 1, 
    borderColor: "#d5d0cc",
    borderRadius: 30, 
    paddingHorizontal: 16, 
    paddingVertical: 8,
  },
  pillIcon: { fontSize: 12, fontFamily: F.semiBold, color: "#CAB3FF", marginRight: 6 },
  pillText: { fontSize: 12, fontFamily: F.semiBold, color: "#4b5563" },

  bottomCta: {
    backgroundColor: "#CAB3FF",
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#CAB3FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    gap: 8,
  },
  bottomCtaText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontFamily: F.bold,
    letterSpacing: 0.5,
  },
});