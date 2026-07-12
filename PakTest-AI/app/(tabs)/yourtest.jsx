import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { F } from '../../constants/fonts';
import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';

const { width } = Dimensions.get('window');
const s = (n) => Math.round((width / 375) * n);

// ── Icons ──────────────────────────────────────────────
const PlayIcon = () => (
  <Svg width={s(18)} height={s(18)} viewBox="0 0 24 24" fill="none">
    <Path d="M8 5v14l11-7L8 5z" fill="#fff" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={s(16)} height={s(16)} viewBox="0 0 24 24" fill="none">
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff" />
  </Svg>
);

const ClockIcon = () => (
  <Svg width={s(16)} height={s(16)} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#1d5152" strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrophyIcon = () => (
  <Svg width={s(20)} height={s(20)} viewBox="0 0 24 24" fill="none">
    <Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="#CAB3FF" />
  </Svg>
);

const BookOpenIcon = () => (
  <Svg width={s(20)} height={s(20)} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6h16v12H4z" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 6l8 4 8-4" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TargetIcon = () => (
  <Svg width={s(20)} height={s(20)} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#CAB3FF" strokeWidth="2" />
    <Circle cx="12" cy="12" r="6" stroke="#CAB3FF" strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill="#CAB3FF" />
  </Svg>
);

const FilterIcon = () => (
  <Svg width={s(18)} height={s(18)} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M6 12h12M9 18h6" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SearchIcon = () => (
  <Svg width={s(18)} height={s(18)} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#6b7280" strokeWidth="2" />
    <Path d="M21 21l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ArrowRight = () => (
  <Svg width={s(14)} height={s(14)} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Data ───────────────────────────────────────────────
const TESTS = [
  { id: 1, title: 'Quantum Mechanics Quiz', subject: 'Physics', progress: 65, done: 13, total: 20, status: 'incomplete' },
  { id: 2, title: 'Pakistan Affairs Mock', subject: 'General Knowledge', progress: 100, done: 20, total: 20, status: 'completed' },
  { id: 3, title: 'CSS English Paper', subject: 'English', progress: 30, done: 6, total: 20, status: 'incomplete' },
  { id: 4, title: 'PPSC Math Test', subject: 'Mathematics', progress: 0, done: 0, total: 20, status: 'new' },
];

const STATUS_COLOR = { incomplete: '#1d5152', completed: '#CAB3FF', new: '#0f2022' };
const STATUS_BG = { incomplete: '#f0f7f7', completed: '#f5f0ff', new: '#f9f5ee' };
const STATUS_LABEL = { incomplete: 'In Progress', completed: 'Completed', new: 'Start Now' };
const STATUS_ICON = { incomplete: '📝', completed: '✅', new: '🚀' };

const filters = ['All', 'In Progress', 'Completed', 'New'];

// ── Stats Card ──────────────────────────────────────────
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <View style={[styles.statCard, { borderColor: color + '30' }]}>
    <View style={[styles.statIconWrapper, { backgroundColor: color + '15' }]}>
      <Icon />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ── Main Component ──────────────────────────────────────
export default function YourTest() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');

  // Guest screen
  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Tests</Text>
        </View>
        <View style={styles.guestContainer}>
          <View style={styles.guestIconBox}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path d="M4 4H14L20 10V20C20 21.1 19.1 22 18 22H4C2.9 22 2 21.1 2 20V6C2 4.9 2.9 4 4 4ZM13 5.5V11H18.5L13 5.5ZM7 13V15H17V13H7ZM7 17V19H14V17H7Z" fill="#CAB3FF" />
            </Svg>
          </View>
          <Text style={styles.guestTitle}>Your tests will appear here</Text>
          <Text style={styles.guestSubtitle}>
            Login to track your progress, resume tests, and see your results.
          </Text>
          <TouchableOpacity style={styles.guestBtn} onPress={() => router.push('/login')} activeOpacity={0.8}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.guestBtnText}>Login to enjoy better experience</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const filteredTests = TESTS.filter(test => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'In Progress') return test.status === 'incomplete';
    if (activeFilter === 'Completed') return test.status === 'completed';
    if (activeFilter === 'New') return test.status === 'new';
    return true;
  });

  const stats = {
    total: TESTS.length,
    inProgress: TESTS.filter(t => t.status === 'incomplete').length,
    completed: TESTS.filter(t => t.status === 'completed').length,
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Tests</Text>
          <Text style={styles.headerSub}>{stats.inProgress} tests in progress</Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <TrophyIcon />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatsCard icon={BookOpenIcon} label="Total Tests" value={stats.total} color="#1d5152" />
          <StatsCard icon={ClockIcon} label="In Progress" value={stats.inProgress} color="#CAB3FF" />
          <StatsCard icon={TargetIcon} label="Completed" value={stats.completed} color="#0f2022" />
        </View>

        {/* Gradient Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerBadge}>🎯 SMART RECOMMENDATION</Text>
            <Text style={styles.bannerTitle}>Complete your pending tests</Text>
            <Text style={styles.bannerDesc}>
              You have {stats.inProgress} tests in progress. Finish them to unlock your next level!
            </Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>View All Tests</Text>
              <ArrowRight />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchFilterRow}>
          <View style={styles.searchBox}>
            <SearchIcon />
            <Text style={styles.searchPlaceholder}>Search tests...</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <FilterIcon />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterContainer}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, activeFilter === f ? styles.filterChipActive : styles.filterChipInactive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterChipText, activeFilter === f ? styles.filterChipTextActive : styles.filterChipTextInactive]}>
                  {f}
                </Text>
                {activeFilter === f && <View style={styles.filterDot} />}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Test Cards */}
        <View style={styles.testList}>
          {filteredTests.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={[styles.card, test.status === 'completed' && styles.cardCompleted]}
              activeOpacity={0.8}
              onPress={() => router.push('/Test')}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardInfo}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{test.title}</Text>
                    <Text style={styles.cardEmoji}>{STATUS_ICON[test.status]}</Text>
                  </View>
                  <Text style={styles.cardSubject}>{test.subject}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[test.status] }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLOR[test.status] }]}>
                    {STATUS_LABEL[test.status]}
                  </Text>
                </View>
              </View>

              {test.status !== 'new' && (
                <View style={styles.progressSection}>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>{test.done}/{test.total} Questions</Text>
                    <Text style={styles.progressPct}>{test.progress}%</Text>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${test.progress}%`, backgroundColor: STATUS_COLOR[test.status] }]} />
                  </View>
                </View>
              )}

              {test.status === 'new' && (
                <View style={styles.newTestInfo}>
                  <Text style={styles.newTestText}>🎯 Ready to begin</Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  test.status === 'completed' ? styles.actionBtnCompleted : 
                  test.status === 'incomplete' ? styles.actionBtnIncomplete : 
                  styles.actionBtnNew
                ]}
                onPress={() => router.push('/Test')}
                activeOpacity={0.8}
              >
                {test.status !== 'completed' && <PlayIcon />}
                {test.status === 'completed' && <CheckIcon />}
                <Text style={[
                  styles.actionText,
                  test.status === 'completed' ? styles.actionTextCompleted : styles.actionTextDefault
                ]}>
                  {test.status === 'completed' ? 'Review Answers' : 
                   test.status === 'incomplete' ? 'Resume Test' : 
                   'Start Test'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f5ee' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: s(16),
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e3e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(32),
    gap: s(16),
  },
  guestIconBox: {
    width: s(88),
    height: s(88),
    borderRadius: s(24),
    backgroundColor: '#f5f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5d9ff',
    marginBottom: s(4),
  },
  guestTitle: {
    fontSize: s(20),
    fontFamily: F.display,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: s(14),
    fontFamily: F.regular,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: s(22),
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    backgroundColor: '#1d5152',
    borderRadius: s(999),
    paddingVertical: s(14),
    paddingHorizontal: s(24),
    marginTop: s(4),
    shadowColor: '#1d5152',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  guestBtnText: {
    fontSize: s(14),
    fontFamily: F.semiBold,
    color: '#ffffff',
  },
  headerTitle: { fontSize: s(24), fontFamily: F.display, color: '#1a1a1a' },
  headerSub: { fontSize: s(13), fontFamily: F.regular, color: '#6b7280', marginTop: s(2) },
  headerAction: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: '#f5f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5d9ff',
  },

  content: { padding: s(16), gap: s(14), paddingBottom: s(40) },

  statsRow: {
    flexDirection: 'row',
    gap: s(10),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: s(14),
    padding: s(12),
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconWrapper: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: s(6),
  },
  statValue: {
    fontSize: s(18),
    fontFamily: F.bold,
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: s(10),
    fontFamily: F.regular,
    color: '#6b7280',
    marginTop: s(1),
  },

  banner: {
    borderRadius: s(16),
    overflow: 'hidden',
    backgroundImage: 'linear-gradient(135deg, rgb(202, 179, 255) 1%, rgb(224, 217, 240))',
    backgroundColor: '#CAB3FF',
    padding: s(20),
    shadowColor: '#CAB3FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  bannerContent: {
    gap: s(6),
  },
  bannerBadge: {
    fontSize: s(10),
    fontFamily: F.bold,
    color: '#1d5152',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: s(20),
    fontFamily: F.display,
    color: '#1a1a1a',
    lineHeight: s(28),
  },
  bannerDesc: {
    fontSize: s(13),
    fontFamily: F.regular,
    color: '#4b5563',
    lineHeight: s(20),
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    backgroundColor: '#1d5152',
    borderRadius: s(999),
    paddingHorizontal: s(20),
    paddingVertical: s(12),
    alignSelf: 'flex-start',
    marginTop: s(4),
    shadowColor: '#1d5152',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerBtnText: {
    fontSize: s(14),
    fontFamily: F.semiBold,
    color: '#ffffff',
  },

  searchFilterRow: {
    flexDirection: 'row',
    gap: s(10),
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    backgroundColor: '#ffffff',
    borderRadius: s(12),
    paddingHorizontal: s(14),
    paddingVertical: s(12),
    borderWidth: 1,
    borderColor: '#e5e3e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchPlaceholder: {
    fontSize: s(13),
    fontFamily: F.regular,
    color: '#6b7280',
  },
  filterBtn: {
    width: s(46),
    height: s(46),
    borderRadius: s(12),
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e3e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  filterScroll: {
    flexDirection: 'row',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: s(8),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: s(16),
    paddingVertical: s(8),
    borderRadius: s(999),
  },
  filterChipActive: {
    backgroundColor: '#0f2022',
  },
  filterChipInactive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e3e1',
  },
  filterChipText: {
    fontSize: s(13),
    fontFamily: F.semiBold,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  filterChipTextInactive: {
    color: '#4b5563',
  },
  filterDot: {
    width: s(4),
    height: s(4),
    borderRadius: s(2),
    backgroundColor: '#CAB3FF',
  },

  testList: {
    gap: s(12),
    paddingBottom: s(8),
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: '#e5e3e1',
    padding: s(16),
    gap: s(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardCompleted: {
    borderColor: '#CAB3FF',
    backgroundColor: '#fcfaff',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: s(10),
  },
  cardInfo: { flex: 1, gap: s(3) },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  cardTitle: {
    fontSize: s(15),
    fontFamily: F.bold,
    color: '#1a1a1a',
    flex: 1,
  },
  cardEmoji: {
    fontSize: s(14),
  },
  cardSubject: {
    fontSize: s(12),
    fontFamily: F.regular,
    color: '#6b7280',
  },
  statusBadge: {
    borderRadius: s(999),
    paddingHorizontal: s(10),
    paddingVertical: s(4),
  },
  statusText: {
    fontSize: s(10),
    fontFamily: F.bold,
  },

  progressSection: { gap: s(6) },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: s(12), fontFamily: F.regular, color: '#4b5563' },
  progressPct: { fontSize: s(12), fontFamily: F.bold, color: '#1a1a1a' },
  barBg: { height: s(6), backgroundColor: '#f9f5ee', borderRadius: s(3), overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: s(3) },

  newTestInfo: {
    paddingVertical: s(4),
  },
  newTestText: {
    fontSize: s(13),
    fontFamily: F.regular,
    color: '#6b7280',
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: s(13),
    borderRadius: s(999),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnIncomplete: {
    backgroundColor: '#1d5152',
  },
  actionBtnCompleted: {
    backgroundColor: '#f5f0ff',
    borderWidth: 1,
    borderColor: '#CAB3FF',
  },
  actionBtnNew: {
    backgroundColor: '#0f2022',
  },
  actionText: {
    fontSize: s(14),
    fontFamily: F.bold,
  },
  actionTextDefault: {
    color: '#ffffff',
  },
  actionTextCompleted: {
    color: '#CAB3FF',
  },
});