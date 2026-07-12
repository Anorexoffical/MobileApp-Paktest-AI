import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { F } from "../constants/fonts";
import { useAuth } from "../context/AuthProvider";

const { width, height } = Dimensions.get("window");
const s = (n) => Math.round((width / 375) * n);
const isTablet = width >= 768;
const isSmallPhone = width < 375;

// ── Icons ──────────────────────────────────────────────
const BackIcon = () => (
  <Svg width={s(24)} height={s(24)} viewBox="0 0 24 24" fill="none">
    <Path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#1d5152" />
  </Svg>
);

const PlayIcon = () => (
  <Svg width={s(16)} height={s(16)} viewBox="0 0 24 24" fill="none">
    <Path d="M8 5V19L19 12L8 5Z" fill="#fff" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={s(14)} height={s(14)} viewBox="0 0 24 24" fill="none">
    <Path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#1d5152" />
  </Svg>
);

const AIIcon = () => (
  <Svg width={s(18)} height={s(18)} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11C11 9.75 14 10.1 14 8C14 6.9 13.1 6 12 6C10.9 6 10 6.9 10 8H8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8C16 10.5 13 10.75 13 13Z" fill="#CAB3FF" />
  </Svg>
);

const SparkleIcon = () => (
  <Svg width={s(14)} height={s(14)} viewBox="0 0 14 14" fill="none">
    <Path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" fill="#CAB3FF" opacity="0.8" />
  </Svg>
);

const CloseIcon = () => (
  <Svg width={s(20)} height={s(20)} viewBox="0 0 24 24" fill="none">
    <Path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#1a1a1a" />
  </Svg>
);

const ReadIcon = () => (
  <Svg width={s(16)} height={s(16)} viewBox="0 0 24 24" fill="none">
    <Path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#1d5152" />
  </Svg>
);

const CheckBoxIcon = ({ checked }) => (
  <Svg width={s(20)} height={s(20)} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" stroke={checked ? "#1d5152" : "#d5d0cc"} strokeWidth="2" fill={checked ? "#1d5152" : "none"} />
    {checked && <Path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>
);

// ── Data ──────────────────────────────────────────────
const SUBJECTS = [
  {
    id: "islamyat",
    name: "Islamyat",
    icon: "🕌",
    color: "#1d5152",
    books: [
      { id: "islamyat-1", title: "Islamyat for CSS", author: "Dr. Tahir-ul-Qadri", pages: 320, mcqs: 450 },
      { id: "islamyat-2", title: "Basic Islamic Studies", author: "Prof. Ahmad Khan", pages: 180, mcqs: 250 },
      { id: "islamyat-3", title: "Seerat-un-Nabi (PBUH)", author: "Dr. Israr Ahmed", pages: 240, mcqs: 300 },
    ],
  },
  {
    id: "gk",
    name: "General Knowledge",
    icon: "🌍",
    color: "#CAB3FF",
    books: [
      { id: "gk-1", title: "World Geography", author: "Majid Hussain", pages: 400, mcqs: 500 },
      { id: "gk-2", title: "Current Affairs 2024", author: "CSS Team", pages: 280, mcqs: 350 },
      { id: "gk-3", title: "Everyday Science", author: "Dr. M. Ali", pages: 200, mcqs: 280 },
    ],
  },
  {
    id: "history",
    name: "History",
    icon: "📜",
    color: "#0f2022",
    books: [
      { id: "history-1", title: "Pakistan History", author: "Prof. S.M. Zafar", pages: 350, mcqs: 400 },
      { id: "history-2", title: "World History", author: "Dr. A. Malik", pages: 300, mcqs: 380 },
    ],
  },
  {
    id: "english",
    name: "English",
    icon: "📚",
    color: "#8B5CF6",
    books: [
      { id: "english-1", title: "English Grammar", author: "Wren & Martin", pages: 450, mcqs: 550 },
      { id: "english-2", title: "CSS English Essay", author: "Prof. Hassan", pages: 200, mcqs: 220 },
    ],
  },
  {
    id: "urdu",
    name: "Urdu",
    icon: "📖",
    color: "#10B981",
    books: [
      { id: "urdu-1", title: "Urdu Grammar", author: "Dr. F. Malik", pages: 250, mcqs: 300 },
      { id: "urdu-2", title: "Urdu Adab", author: "Prof. N. Ahmad", pages: 300, mcqs: 350 },
    ],
  },
  {
    id: "pakstudy",
    name: "Pakistan Studies",
    icon: "🇵🇰",
    color: "#F59E0B",
    books: [
      { id: "pakstudy-1", title: "Pakistan Studies", author: "Dr. Safdar", pages: 380, mcqs: 420 },
      { id: "pakstudy-2", title: "Constitution of Pakistan", author: "Hamid Khan", pages: 280, mcqs: 320 },
    ],
  },
];

// ── Main Component ──────────────────────────────────────
export default function Curriculum() {
  const { title } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);

  const requireLogin = (action) => {
    if (!user) { setShowLoginModal(true); return false; }
    return true;
  };

  const toggleSubject = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
    setSelectedBooks([]);
  };

  const toggleBookSelection = (bookId) => {
    setSelectedBooks(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleAIQuiz = (subject) => {
    if (!requireLogin()) return;
    if (selectedBooks.length === 0) {
      alert("Please select at least one book for the AI test.");
      return;
    }
    setCurrentSubject(subject);
    setShowAIModal(true);
  };

  const handleReadBook = (book) => {
    // Reading is free — no login required
    router.push({
      pathname: "/bookreader",
      params: { bookId: book.id, title: book.title, author: book.author, pages: book.pages.toString() },
    });
  };

  const handleSingleBookAI = (subject, book) => {
    if (!requireLogin()) return;
    setCurrentSubject(subject);
    setSelectedBooks([book.id]);
    setShowAIModal(true);
  };

  const startAITest = () => {
    if (!currentSubject) {
      alert("Please select a subject first.");
      return;
    }
    
    const books = currentSubject.books.filter(b => selectedBooks.includes(b.id));
    if (books.length === 0) {
      alert("Please select at least one book.");
      return;
    }
    
    setShowAIModal(false);
    router.push({
      pathname: "/Test",
      params: {
        subject: currentSubject.name,
        books: books.map(b => b.title).join(", "),
        totalMCQs: books.reduce((sum, b) => sum + b.mcqs, 0),
        bookIds: books.map(b => b.id).join(","),
      },
    });
  };

  const SubjectCard = ({ subject }) => {
    const isExpanded = expandedSubject === subject.id;
    const books = subject.books;

    return (
      <View style={styles.subjectWrapper}>
        <TouchableOpacity
          style={[styles.subjectHeader, isExpanded && styles.subjectHeaderExpanded]}
          activeOpacity={0.8}
          onPress={() => toggleSubject(subject.id)}
        >
          <View style={styles.subjectHeaderLeft}>
            <View style={[styles.subjectIconBox, { backgroundColor: subject.color + '15' }]}>
              <Text style={styles.subjectIcon}>{subject.icon}</Text>
            </View>
            <View>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectBookCount}>{books.length} Books</Text>
            </View>
          </View>
          <View style={[styles.subjectExpand, isExpanded && styles.subjectExpandActive]}>
            <Text style={styles.subjectExpandText}>{isExpanded ? '−' : '+'}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.booksContainer}>
            {books.map((book) => (
              <View key={book.id} style={styles.bookItem}>
                <TouchableOpacity
                  style={styles.bookItemLeft}
                  onPress={() => toggleBookSelection(book.id)}
                  activeOpacity={0.7}
                >
                  <CheckBoxIcon checked={selectedBooks.includes(book.id)} />
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    <View style={styles.bookMeta}>
                      <Text style={styles.bookMetaText}>{book.pages} pages</Text>
                      <Text style={styles.bookMetaDot}>•</Text>
                      <Text style={styles.bookMetaText}>{book.mcqs} MCQs</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.bookActions}>
                  <TouchableOpacity
                    style={styles.readBtn}
                    onPress={() => handleReadBook(book)}
                    activeOpacity={0.7}
                  >
                    <ReadIcon />
                    <Text style={styles.readBtnText}>Read</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.aiBtn}
                    onPress={() => handleSingleBookAI(subject, book)}
                    activeOpacity={0.7}
                  >
                    <SparkleIcon />
                    <Text style={styles.aiBtnText}>AI MCQs</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {books.length > 0 && (
              <TouchableOpacity
                style={styles.aiAllBtn}
                onPress={() => handleAIQuiz(subject)}
                activeOpacity={0.8}
              >
                <AIIcon />
                <Text style={styles.aiAllBtnText}>
                  AI Test on Selected Books ({selectedBooks.length})
                </Text>
                <Text style={styles.aiAllSub}>
                  {selectedBooks.length > 0
                    ? `${selectedBooks.reduce((sum, id) => sum + books.find(b => b.id === id)?.mcqs || 0, 0)} MCQs`
                    : 'Select books above'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  // Get selected books data for modal
  const getSelectedBooksData = () => {
    if (!currentSubject) return [];
    return currentSubject.books.filter(b => selectedBooks.includes(b.id));
  };

  const selectedBooksData = getSelectedBooksData();
  const totalMCQs = selectedBooksData.reduce((sum, b) => sum + b.mcqs, 0);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title ? `${title} · Curriculum` : "Curriculum"}
        </Text>
        <View style={{ width: s(40) }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBubble1} />
          <View style={styles.heroBubble2} />
          <View style={styles.heroChip}>
            <SparkleIcon />
            <Text style={styles.heroChipText}>PREMIUM CURRICULUM</Text>
          </View>
          <Text style={styles.heroTitle}>Comprehensive{"\n"}Prep Courses</Text>
          <Text style={styles.heroDesc}>
            Select a subject, browse books, and generate AI MCQs from specific books or combine multiple books.
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Subjects</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>16</Text>
            <Text style={styles.statLabel}>Books</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4.2k+</Text>
            <Text style={styles.statLabel}>MCQs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>AI</Text>
            <Text style={styles.statLabel}>Powered</Text>
          </View>
        </View>

        {/* Subjects List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Subject</Text>
          <Text style={styles.sectionSub}>Tap to expand and browse books</Text>

          <View style={styles.subjectsList}>
            {SUBJECTS.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Login Required Modal */}
      <Modal visible={showLoginModal} transparent animationType="slide" onRequestClose={() => setShowLoginModal(false)}>
        <TouchableOpacity style={styles.loginOverlay} activeOpacity={1} onPress={() => setShowLoginModal(false)}>
          <View style={styles.loginModal}>
            <View style={styles.loginModalHandle} />
            <View style={styles.loginModalIconBox}>
              <Svg width={s(32)} height={s(32)} viewBox="0 0 24 24" fill="none">
                <Path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 110 4 2 2 0 010-4z" fill="#1d5152" />
              </Svg>
            </View>
            <Text style={styles.loginModalTitle}>Login Required</Text>
            <Text style={styles.loginModalDesc}>You need to login to access AI MCQs and take tests.</Text>
            <TouchableOpacity style={styles.loginModalBtn} onPress={() => { setShowLoginModal(false); router.push("/login"); }} activeOpacity={0.8}>
              <Text style={styles.loginModalBtnText}>Login to enjoy better experience</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLoginModal(false)}>
              <Text style={styles.loginModalCancel}>Maybe later</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* AI Quiz Modal */}
      <Modal
        visible={showAIModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAIModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.aiModalContent}>
            <View style={styles.aiModalHeader}>
              <View style={styles.aiModalIcon}>
                <AIIcon />
              </View>
              <TouchableOpacity onPress={() => setShowAIModal(false)} style={styles.aiModalClose}>
                <CloseIcon />
              </TouchableOpacity>
            </View>

            <Text style={styles.aiModalTitle}>AI MCQs Ready!</Text>
            <Text style={styles.aiModalSub}>
              {currentSubject?.name || 'Subject'} • {selectedBooks.length} book{selectedBooks.length > 1 ? 's' : ''} selected
            </Text>

            <View style={styles.aiModalStats}>
              <View style={styles.aiModalStat}>
                <Text style={styles.aiModalStatValue}>{totalMCQs}</Text>
                <Text style={styles.aiModalStatLabel}>Total MCQs</Text>
              </View>
              <View style={styles.aiModalStat}>
                <Text style={styles.aiModalStatValue}>30 min</Text>
                <Text style={styles.aiModalStatLabel}>Time Limit</Text>
              </View>
              <View style={styles.aiModalStat}>
                <Text style={styles.aiModalStatValue}>AI</Text>
                <Text style={styles.aiModalStatLabel}>Generated</Text>
              </View>
            </View>

            <View style={styles.aiModalBooks}>
              <Text style={styles.aiModalBooksTitle}>Selected Books:</Text>
              {selectedBooksData.length > 0 ? (
                selectedBooksData.map((book) => (
                  <View key={book.id} style={styles.aiModalBookItem}>
                    <CheckIcon />
                    <Text style={styles.aiModalBookText}>{book.title}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.aiModalEmptyText}>No books selected</Text>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.aiModalStartBtn, selectedBooksData.length === 0 && styles.aiModalStartBtnDisabled]} 
              onPress={startAITest}
              disabled={selectedBooksData.length === 0}
            >
              <PlayIcon />
              <Text style={styles.aiModalStartBtnText}>Start AI Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.aiModalCancel} onPress={() => setShowAIModal(false)}>
              <Text style={styles.aiModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Fully Responsive Styles ─────────────────────────────
const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#f9f5ee" 
  },
  scroll: { 
    flex: 1 
  },
  scrollContent: { 
    padding: s(16), 
    gap: s(16), 
    paddingBottom: s(40),
    maxWidth: isTablet ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: s(16),
    paddingVertical: s(isTablet ? 16 : 12),
    borderBottomWidth: 1,
    borderBottomColor: "#e5e3e1",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  backBtn: { 
    width: s(44), 
    height: s(44), 
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { 
    flex: 1, 
    fontSize: s(isTablet ? 20 : 17), 
    fontFamily: F.semiBold, 
    color: "#1a1a1a", 
    textAlign: "center",
  },

  // Hero
  hero: {
    backgroundColor: "#1d5152",
    borderRadius: s(16),
    padding: s(isTablet ? 32 : 24),
    overflow: "hidden",
    gap: s(10),
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  heroBubble1: {
    position: "absolute",
    right: s(-40),
    top: s(-40),
    width: s(180),
    height: s(180),
    borderRadius: s(90),
    backgroundColor: "#CAB3FF",
    opacity: 0.08,
  },
  heroBubble2: {
    position: "absolute",
    right: s(60),
    bottom: s(-20),
    width: s(120),
    height: s(120),
    borderRadius: s(60),
    backgroundColor: "#CAB3FF",
    opacity: 0.12,
  },
  heroChip: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: s(6),
    backgroundColor: "rgba(202, 179, 255, 0.2)",
    borderRadius: 999,
    paddingHorizontal: s(12),
    paddingVertical: s(5),
    borderWidth: 1,
    borderColor: "rgba(202, 179, 255, 0.3)",
  },
  heroChipText: { 
    color: "#fff", 
    fontSize: s(isSmallPhone ? 8 : 10), 
    fontFamily: F.bold, 
    letterSpacing: 0.6 
  },
  heroTitle: { 
    color: "#fff", 
    fontSize: s(isTablet ? 32 : isSmallPhone ? 20 : 24), 
    fontFamily: F.display, 
    lineHeight: s(isTablet ? 40 : isSmallPhone ? 28 : 32) 
  },
  heroDesc: { 
    color: "rgba(255,255,255,0.8)", 
    fontSize: s(isTablet ? 15 : isSmallPhone ? 11 : 13), 
    fontFamily: F.regular, 
    lineHeight: s(isTablet ? 24 : isSmallPhone ? 18 : 20) 
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: "#e5e3e1",
    paddingVertical: s(isTablet ? 20 : 16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    flexWrap: 'wrap',
  },
  statBox: { 
    flex: 1, 
    alignItems: "center",
    minWidth: isSmallPhone ? '25%' : 'auto',
  },
  statDivider: { 
    width: 1, 
    height: s(isTablet ? 40 : 30), 
    backgroundColor: "#e5e3e1" 
  },
  statValue: { 
    fontSize: s(isTablet ? 22 : isSmallPhone ? 14 : 18), 
    fontFamily: F.bold, 
    color: "#1a1a1a" 
  },
  statLabel: { 
    fontSize: s(isTablet ? 12 : isSmallPhone ? 8 : 10), 
    fontFamily: F.regular, 
    color: "#6b7280", 
    marginTop: s(2) 
  },

  // Section
  section: { 
    gap: s(isTablet ? 12 : 8) 
  },
  sectionTitle: { 
    fontSize: s(isTablet ? 22 : 18), 
    fontFamily: F.bold, 
    color: "#1a1a1a" 
  },
  sectionSub: { 
    fontSize: s(isTablet ? 15 : 13), 
    fontFamily: F.regular, 
    color: "#6b7280" 
  },

  subjectsList: { 
    gap: s(10), 
    marginTop: s(8) 
  },

  // Subject Card
  subjectWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: "#e5e3e1",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: s(isTablet ? 20 : 16),
    backgroundColor: "#ffffff",
  },
  subjectHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: "#f9f5ee",
  },
  subjectHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(12),
    flex: 1,
  },
  subjectIconBox: {
    width: s(isTablet ? 52 : 44),
    height: s(isTablet ? 52 : 44),
    borderRadius: s(12),
    justifyContent: "center",
    alignItems: "center",
  },
  subjectIcon: { 
    fontSize: s(isTablet ? 28 : 22) 
  },
  subjectName: { 
    fontSize: s(isTablet ? 18 : 15), 
    fontFamily: F.bold, 
    color: "#1a1a1a" 
  },
  subjectBookCount: { 
    fontSize: s(isTablet ? 13 : 11), 
    fontFamily: F.regular, 
    color: "#6b7280" 
  },
  subjectExpand: {
    width: s(isTablet ? 32 : 28),
    height: s(isTablet ? 32 : 28),
    borderRadius: s(isTablet ? 16 : 14),
    backgroundColor: "#f9f5ee",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e3e1",
  },
  subjectExpandActive: {
    backgroundColor: "#1d5152",
    borderColor: "#1d5152",
  },
  subjectExpandText: {
    fontSize: s(isTablet ? 20 : 18),
    fontFamily: F.bold,
    color: "#1a1a1a",
  },

  // Books Container
  booksContainer: {
    padding: s(isTablet ? 16 : 12),
    gap: s(10),
    backgroundColor: "#f9f5ee",
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: s(12),
    padding: s(isTablet ? 14 : 12),
    borderWidth: 1,
    borderColor: "#e5e3e1",
    flexWrap: 'wrap',
    gap: s(8),
  },
  bookItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(10),
    flex: 1,
    minWidth: s(120),
  },
  bookInfo: { 
    flex: 1,
    minWidth: s(80),
  },
  bookTitle: { 
    fontSize: s(isTablet ? 16 : 14), 
    fontFamily: F.semiBold, 
    color: "#1a1a1a" 
  },
  bookAuthor: { 
    fontSize: s(isTablet ? 13 : 11), 
    fontFamily: F.regular, 
    color: "#6b7280" 
  },
  bookMeta: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: s(4), 
    marginTop: s(2),
    flexWrap: 'wrap',
  },
  bookMetaText: { 
    fontSize: s(isTablet ? 12 : 10), 
    fontFamily: F.regular, 
    color: "#6b7280" 
  },
  bookMetaDot: { 
    fontSize: s(isTablet ? 12 : 10), 
    color: "#6b7280" 
  },

  // Book Actions
  bookActions: {
    flexDirection: "row",
    gap: s(6),
    flexWrap: 'wrap',
  },
  readBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(4),
    backgroundColor: "#f9f5ee",
    borderRadius: s(8),
    paddingHorizontal: s(10),
    paddingVertical: s(6),
    borderWidth: 1,
    borderColor: "#e5e3e1",
  },
  readBtnText: { 
    fontSize: s(isTablet ? 13 : 11), 
    fontFamily: F.semiBold, 
    color: "#1d5152" 
  },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(4),
    backgroundColor: "#CAB3FF",
    borderRadius: s(8),
    paddingHorizontal: s(10),
    paddingVertical: s(6),
  },
  aiBtnText: { 
    fontSize: s(isTablet ? 13 : 11), 
    fontFamily: F.semiBold, 
    color: "#1a1a1a" 
  },

  // AI All Button
  aiAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
    backgroundColor: "#1d5152",
    borderRadius: s(12),
    padding: s(isTablet ? 16 : 14),
    marginTop: s(4),
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    flexWrap: 'wrap',
  },
  aiAllBtnText: { 
    fontSize: s(isTablet ? 16 : 14), 
    fontFamily: F.semiBold, 
    color: "#ffffff", 
    flex: 1,
    minWidth: s(100),
  },
  aiAllSub: { 
    fontSize: s(isTablet ? 13 : 11), 
    fontFamily: F.regular, 
    color: "rgba(255,255,255,0.7)" 
  },

  // AI Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: s(16),
  },
  aiModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: s(24),
    padding: s(isTablet ? 32 : 24),
    width: isTablet ? s(500) : (width - s(40)),
    maxWidth: s(500),
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  aiModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: s(12),
  },
  aiModalIcon: {
    width: s(48),
    height: s(48),
    borderRadius: s(14),
    backgroundColor: "#f5f0ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5d9ff",
  },
  aiModalClose: { 
    padding: s(4) 
  },
  aiModalTitle: { 
    fontSize: s(isTablet ? 26 : 22), 
    fontFamily: F.display, 
    color: "#1a1a1a" 
  },
  aiModalSub: { 
    fontSize: s(isTablet ? 16 : 14), 
    fontFamily: F.regular, 
    color: "#6b7280", 
    marginBottom: s(16) 
  },

  aiModalStats: {
    flexDirection: "row",
    backgroundColor: "#f9f5ee",
    borderRadius: s(12),
    padding: s(isTablet ? 16 : 12),
    gap: s(12),
    marginBottom: s(16),
    borderWidth: 1,
    borderColor: "#e5e3e1",
    flexWrap: 'wrap',
  },
  aiModalStat: { 
    flex: 1, 
    alignItems: "center",
    minWidth: s(60),
  },
  aiModalStatValue: { 
    fontSize: s(isTablet ? 20 : 18), 
    fontFamily: F.bold, 
    color: "#1a1a1a" 
  },
  aiModalStatLabel: { 
    fontSize: s(isTablet ? 12 : 10), 
    fontFamily: F.regular, 
    color: "#6b7280", 
    marginTop: s(2) 
  },

  aiModalBooks: { 
    gap: s(6), 
    marginBottom: s(20) 
  },
  aiModalBooksTitle: { 
    fontSize: s(isTablet ? 15 : 13), 
    fontFamily: F.semiBold, 
    color: "#4b5563", 
    marginBottom: s(4) 
  },
  aiModalBookItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: s(8) 
  },
  aiModalBookText: { 
    fontSize: s(isTablet ? 15 : 13), 
    fontFamily: F.regular, 
    color: "#4b5563" 
  },
  aiModalEmptyText: { 
    fontSize: s(isTablet ? 15 : 13), 
    fontFamily: F.regular, 
    color: "#6b7280", 
    fontStyle: "italic" 
  },

  aiModalStartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(8),
    backgroundColor: "#1d5152",
    borderRadius: s(999),
    paddingVertical: s(isTablet ? 16 : 14),
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  aiModalStartBtnDisabled: {
    backgroundColor: "#e5e3e1",
    shadowOpacity: 0,
    elevation: 0,
  },
  aiModalStartBtnText: { 
    fontSize: s(isTablet ? 18 : 16), 
    fontFamily: F.bold, 
    color: "#ffffff" 
  },

  aiModalCancel: {
    paddingVertical: s(10),
    alignItems: "center",
    marginTop: s(8),
  },
  aiModalCancelText: { 
    fontSize: s(isTablet ? 16 : 14), 
    fontFamily: F.regular, 
    color: "#6b7280" 
  },

  // Login Modal
  loginOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  loginModal: {
    backgroundColor: "#ffffff", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, paddingBottom: 40, alignItems: "center", gap: 12,
  },
  loginModalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#e5e3e1", marginBottom: 8 },
  loginModalIconBox: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#f0f7f7", justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#d5e0e0", marginBottom: 4,
  },
  loginModalTitle: { fontSize: 22, fontFamily: F.display, color: "#1a1a1a" },
  loginModalDesc: { fontSize: 14, fontFamily: F.regular, color: "#6b7280", textAlign: "center", lineHeight: 22 },
  loginModalBtn: {
    width: "100%", backgroundColor: "#1d5152", borderRadius: 999,
    paddingVertical: 15, alignItems: "center", marginTop: 4,
    shadowColor: "#1d5152", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  loginModalBtnText: { fontSize: 15, fontFamily: F.bold, color: "#ffffff" },
  loginModalCancel: { fontSize: 14, fontFamily: F.regular, color: "#6b7280", marginTop: 4 },
});