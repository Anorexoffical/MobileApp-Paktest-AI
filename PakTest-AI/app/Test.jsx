import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Alert, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { F } from '../constants/fonts';

const { width, height } = Dimensions.get('window');
const s = (n) => Math.round((width / 375) * n);
const isTablet = width >= 768;
const isSmallPhone = width < 375;

// ── Icons ──────────────────────────────────────────────
const BackIcon = () => (
  <Svg width={s(24)} height={s(24)} viewBox="0 0 24 24" fill="none">
    <Path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#1d5152" />
  </Svg>
);

const LightbulbIcon = () => (
  <Svg width={s(18)} height={s(18)} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21h6v-1H9v1zm3-20C8.13 1 5 4.13 5 8c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-3.26C17.81 12.47 19 10.38 19 8c0-3.87-3.13-7-7-7zm2.85 11.1l-.85.6V16h-4v-3.3l-.85-.6A4.997 4.997 0 017 8c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" fill="#CAB3FF" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width={s(16)} height={s(16)} viewBox="0 0 24 24" fill="none">
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff" />
  </Svg>
);

const CloseIcon = () => (
  <Svg width={s(16)} height={s(16)} viewBox="0 0 24 24" fill="none">
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="#fff" />
  </Svg>
);

const SparkleIcon = () => (
  <Svg width={s(14)} height={s(14)} viewBox="0 0 14 14" fill="none">
    <Path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" fill="#CAB3FF" opacity="0.8" />
  </Svg>
);

const ChevronDown = () => (
  <Svg width={s(16)} height={s(16)} viewBox="0 0 24 24" fill="none">
    <Path d="M7 10l5 5 5-5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Quiz Data ──────────────────────────────────────────
const SUBJECT_QUIZZES = {
  'General Knowledge': [
    {
      id: 1,
      subject: 'General Knowledge',
      difficulty: 'EASY',
      topic: 'Pakistan Studies',
      question: 'What is the capital city of Pakistan?',
      options: ['Lahore', 'Karachi', 'Islamabad', 'Peshawar'],
      correct: 'C',
    },
    {
      id: 2,
      subject: 'General Knowledge',
      difficulty: 'MEDIUM',
      topic: 'World Geography',
      question: 'Which is the largest continent by area?',
      options: ['Africa', 'Asia', 'North America', 'Europe'],
      correct: 'B',
    },
    {
      id: 3,
      subject: 'General Knowledge',
      difficulty: 'EASY',
      topic: 'Current Affairs',
      question: 'In which year did Pakistan gain independence?',
      options: ['1945', '1947', '1949', '1950'],
      correct: 'B',
    },
  ],
  'English': [
    {
      id: 1,
      subject: 'English',
      difficulty: 'MEDIUM',
      topic: 'Grammar',
      question: 'Which of the following is a correct sentence?',
      options: [
        "She don't know the answer.",
        "She doesn't knows the answer.",
        "She doesn't know the answer.",
        "She not know the answer.",
      ],
      correct: 'C',
    },
    {
      id: 2,
      subject: 'English',
      difficulty: 'HARD',
      topic: 'Vocabulary',
      question: 'What is the synonym of "Benevolent"?',
      options: ['Cruel', 'Kind', 'Selfish', 'Greedy'],
      correct: 'B',
    },
  ],
  'Mathematics': [
    {
      id: 1,
      subject: 'Mathematics',
      difficulty: 'MEDIUM',
      topic: 'Arithmetic',
      question: 'If a train travels 300 km in 3 hours, what is its average speed?',
      options: ['50 km/h', '100 km/h', '150 km/h', '200 km/h'],
      correct: 'B',
    },
    {
      id: 2,
      subject: 'Mathematics',
      difficulty: 'HARD',
      topic: 'Algebra',
      question: 'What is the value of x in 2x + 5 = 15?',
      options: ['3', '5', '7', '10'],
      correct: 'B',
    },
    {
      id: 3,
      subject: 'Mathematics',
      difficulty: 'EASY',
      topic: 'Geometry',
      question: 'What is the area of a square with side length 5?',
      options: ['20', '25', '30', '35'],
      correct: 'B',
    },
  ],
  'Pakistan Studies': [
    {
      id: 1,
      subject: 'Pakistan Studies',
      difficulty: 'HARD',
      topic: 'Constitution',
      question: 'In which year was the current Constitution of Pakistan adopted?',
      options: ['1956', '1962', '1970', '1973'],
      correct: 'D',
    },
    {
      id: 2,
      subject: 'Pakistan Studies',
      difficulty: 'MEDIUM',
      topic: 'History',
      question: 'Who was the first Governor-General of Pakistan?',
      options: ['Liaquat Ali Khan', 'Muhammad Ali Jinnah', 'Khwaja Nazimuddin', 'Iskander Mirza'],
      correct: 'B',
    },
  ],
  'Computer Science': [
    {
      id: 1,
      subject: 'Computer Science',
      difficulty: 'EASY',
      topic: 'IT Basics',
      question: 'What does CPU stand for?',
      options: [
        'Central Processing Unit',
        'Central Program Utility',
        'Computer Processing Unit',
        'Core Processing Unit',
      ],
      correct: 'A',
    },
    {
      id: 2,
      subject: 'Computer Science',
      difficulty: 'MEDIUM',
      topic: 'Networking',
      question: 'What does IP stand for?',
      options: ['Internet Protocol', 'Intranet Protocol', 'Internal Protocol', 'International Protocol'],
      correct: 'A',
    },
  ],
};

const SUBJECT_LIST = Object.keys(SUBJECT_QUIZZES);
const LETTERS = ['A', 'B', 'C', 'D'];
const DIFF_COLOR = { EASY: '#1d5152', MEDIUM: '#F59E0B', HARD: '#EF4444' };
const DIFF_BG = { EASY: '#f0f7f7', MEDIUM: '#FEF3C7', HARD: '#fef2f2' };

export default function Test() {
  const router = useRouter();
  const [currentSubject, setCurrentSubject] = useState(SUBJECT_LIST[0]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [showHint, setShowHint] = useState(false);

  const questions = SUBJECT_QUIZZES[currentSubject] || [];
  const q = questions[current] || questions[0];
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    if (submitted || !q) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, q]);

  const handleSubjectChange = (subject) => {
    setCurrentSubject(subject);
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setTimeLeft(90);
    setAnsweredQuestions({});
    setShowSubjectModal(false);
  };

  const getOptionStyle = (letter) => {
    if (!submitted) {
      return selected === letter ? styles.optionSelected : styles.option;
    }
    if (letter === q.correct) return styles.optionCorrect;
    if (letter === selected && letter !== q.correct) return styles.optionWrong;
    return styles.option;
  };

  const getLetterStyle = (letter) => {
    if (!submitted) {
      return selected === letter ? styles.letterSelected : styles.letter;
    }
    if (letter === q.correct) return styles.letterCorrect;
    if (letter === selected && letter !== q.correct) return styles.letterWrong;
    return styles.letter;
  };

  const getLetterTextStyle = (letter) => {
    if (!submitted && selected === letter) return styles.letterTextSelected;
    if (submitted && (letter === q.correct || (letter === selected && letter !== q.correct))) return styles.letterTextSelected;
    return styles.letterText;
  };

  const handleSubmit = () => {
    if (!selected && !submitted) {
      Alert.alert('Select an answer', 'Please select an option before submitting.');
      return;
    }
    if (!submitted) {
      if (selected === q.correct) setScore((s) => s + 1);
      setSubmitted(true);
      setAnsweredQuestions(prev => ({ ...prev, [current]: true }));
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setSubmitted(false);
      setTimeLeft(90);
    } else {
      const finalScore = score + (submitted && selected === q.correct ? 1 : 0);
      Alert.alert(
        '🎉 Quiz Complete!',
        `You scored ${finalScore} out of ${questions.length} in ${currentSubject}`,
        [
          { text: 'Review Answers', onPress: () => setCurrent(0) },
          { text: 'Back to Home', onPress: () => router.back() },
        ]
      );
    }
  };

  const handleSkip = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setSubmitted(false);
      setTimeLeft(90);
    } else {
      Alert.alert('End of Quiz', 'You have reached the last question.');
    }
  };

  const goToQuestion = (index) => {
    setCurrent(index);
    setSelected(null);
    setSubmitted(false);
    setTimeLeft(90);
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  if (!q) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No questions available</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.subjectSelector} 
          onPress={() => setShowSubjectModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.subjectSelectorText} numberOfLines={1}>{currentSubject}</Text>
          <ChevronDown />
        </TouchableOpacity>

        <View style={[styles.timerBadge, timeLeft < 20 && styles.timerUrgent]}>
          <Text style={[styles.timerText, timeLeft < 20 && styles.timerTextUrgent]}>{mins}:{secs}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Counter + Score */}
        <View style={styles.rowBetween}>
          <Text style={styles.counterText}>Question {current + 1}/{questions.length}</Text>
          <View style={styles.scorePill}>
            <SparkleIcon />
            <Text style={styles.scoreText}>{score} / {questions.length}</Text>
          </View>
        </View>

        {/* Question Navigation Dots */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navDotsScroll}>
          <View style={styles.navDots}>
            {questions.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.navDot,
                  i === current && styles.navDotActive,
                  answeredQuestions[i] && styles.navDotAnswered,
                  i < current && !answeredQuestions[i] && styles.navDotVisited,
                ]}
                onPress={() => goToQuestion(i)}
              >
                <Text style={[
                  styles.navDotText,
                  i === current && styles.navDotTextActive,
                  answeredQuestions[i] && styles.navDotTextAnswered,
                ]}>{i + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Question Card */}
        <View style={styles.qCard}>
          {/* Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.subjectBadge}>
              <Text style={styles.subjectBadgeText}>{q.subject.toUpperCase()}</Text>
            </View>
            <View style={[styles.diffBadge, { backgroundColor: DIFF_BG[q.difficulty] }]}>
              <Text style={[styles.diffText, { color: DIFF_COLOR[q.difficulty] }]}>{q.difficulty}</Text>
            </View>
            <View style={styles.topicBadge}>
              <Text style={styles.topicBadgeText}>{q.topic}</Text>
            </View>
          </View>

          <Text style={styles.questionText}>{q.question}</Text>

          {/* Options */}
          <View style={styles.optionsList}>
            {q.options.map((opt, i) => {
              const letter = LETTERS[i];
              return (
                <TouchableOpacity
                  key={letter}
                  style={getOptionStyle(letter)}
                  onPress={() => !submitted && setSelected(letter)}
                  activeOpacity={submitted ? 1 : 0.8}
                >
                  <View style={getLetterStyle(letter)}>
                    {submitted && letter === q.correct ? (
                      <CheckIcon />
                    ) : submitted && letter === selected && letter !== q.correct ? (
                      <CloseIcon />
                    ) : (
                      <Text style={getLetterTextStyle(letter)}>{letter}</Text>
                    )}
                  </View>
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Feedback */}
          {submitted && (
            <View style={[styles.feedback, selected === q.correct ? styles.feedbackCorrect : styles.feedbackWrong]}>
              <Text style={styles.feedbackText}>
                {selected === q.correct
                  ? '✓ Correct! Well done.'
                  : `✗ Wrong. Correct answer is ${q.correct}. ${q.options[LETTERS.indexOf(q.correct)]}`}
              </Text>
            </View>
          )}
        </View>

        {/* AI Hint */}
        <TouchableOpacity style={styles.hintBtn} onPress={() => setShowHint(!showHint)} activeOpacity={0.8}>
          <LightbulbIcon />
          <Text style={styles.hintText}>AI Smart Hint</Text>
        </TouchableOpacity>

        {showHint && (
          <View style={styles.hintBox}>
            <Text style={styles.hintBoxText}>
              💡 Think about the key concepts in this topic. The answer is related to the main subject area.
              {q.difficulty === 'HARD' && ' This is a challenging question, read carefully!'}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {!submitted ? (
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
              <Text style={styles.submitText}>Submit Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextText}>
                {current < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Subject Selection Modal */}
      <Modal
        visible={showSubjectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubjectModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowSubjectModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subject</Text>
              <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
                <CloseIcon />
              </TouchableOpacity>
            </View>
            <FlatList
              data={SUBJECT_LIST}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    currentSubject === item && styles.modalItemActive,
                  ]}
                  onPress={() => handleSubjectChange(item)}
                >
                  <Text style={[
                    styles.modalItemText,
                    currentSubject === item && styles.modalItemTextActive,
                  ]}>{item}</Text>
                  {currentSubject === item && (
                    <View style={styles.modalItemCheck}>
                      <CheckIcon />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9f5ee" },

  header: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: s(16), 
    paddingVertical: s(12),
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e3e1',
    backgroundColor: '#ffffff',
    gap: s(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  backBtn: {
    width: s(40), 
    height: s(40), 
    borderRadius: s(20),
    backgroundColor: '#f9f5ee', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  subjectSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: s(10),
    paddingVertical: s(6),
    borderRadius: s(8),
    backgroundColor: '#f9f5ee',
    borderWidth: 1,
    borderColor: '#e5e3e1',
  },
  subjectSelectorText: {
    flex: 1,
    fontSize: s(14),
    fontFamily: F.semiBold,
    color: '#1a1a1a',
  },
  timerBadge: {
    paddingHorizontal: s(12), 
    paddingVertical: s(6),
    borderRadius: 999, 
    backgroundColor: '#f5f0ff',
    borderWidth: 1, 
    borderColor: '#e5d9ff',
    minWidth: s(60),
    alignItems: 'center',
  },
  timerUrgent: { 
    backgroundColor: '#fef2f2', 
    borderColor: '#EF4444' 
  },
  timerText: { 
    fontSize: s(13), 
    fontFamily: F.bold, 
    color: '#1d5152' 
  },
  timerTextUrgent: { 
    color: '#EF4444' 
  },

  progressBg: { 
    height: s(4), 
    backgroundColor: '#e5e3e1' 
  },
  progressFill: { 
    height: s(4), 
    backgroundColor: '#1d5152' 
  },

  scroll: { flex: 1 },
  content: { 
    padding: s(16), 
    gap: s(14), 
    paddingBottom: s(40) 
  },

  rowBetween: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  counterText: { 
    fontSize: s(13), 
    fontFamily: F.regular, 
    color: '#4b5563' 
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: '#1d5152', 
    borderRadius: 999,
    paddingHorizontal: s(12), 
    paddingVertical: s(5),
  },
  scoreText: { 
    fontSize: s(12), 
    fontFamily: F.bold, 
    color: '#ffffff' 
  },

  navDotsScroll: {
    flexGrow: 0,
  },
  navDots: {
    flexDirection: 'row',
    gap: s(6),
    paddingVertical: s(4),
  },
  navDot: {
    width: s(30),
    height: s(30),
    borderRadius: s(15),
    backgroundColor: '#e5e3e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navDotActive: {
    backgroundColor: '#1d5152',
    width: s(36),
    height: s(36),
    borderRadius: s(18),
  },
  navDotAnswered: {
    backgroundColor: '#CAB3FF',
  },
  navDotVisited: {
    backgroundColor: '#f0f7f7',
    borderWidth: 1,
    borderColor: '#d5e0e0',
  },
  navDotText: {
    fontSize: s(11),
    fontFamily: F.semiBold,
    color: '#6b7280',
  },
  navDotTextActive: {
    color: '#ffffff',
  },
  navDotTextAnswered: {
    color: '#1a1a1a',
  },

  qCard: {
    backgroundColor: '#ffffff', 
    borderRadius: s(16),
    borderWidth: 1, 
    borderColor: '#e5e3e1',
    padding: s(18), 
    gap: s(12),
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 8,
    elevation: 2,
  },
  badgeRow: { 
    flexDirection: 'row', 
    gap: s(8),
    flexWrap: 'wrap',
  },
  subjectBadge: {
    backgroundColor: '#f0f7f7', 
    borderRadius: 999,
    paddingHorizontal: s(10), 
    paddingVertical: s(3),
    borderWidth: 1,
    borderColor: '#d5e0e0',
  },
  subjectBadgeText: { 
    fontSize: s(10), 
    fontFamily: F.bold, 
    color: '#1d5152' 
  },
  diffBadge: { 
    borderRadius: 999, 
    paddingHorizontal: s(10), 
    paddingVertical: s(3) 
  },
  diffText: { 
    fontSize: s(10), 
    fontFamily: F.bold 
  },
  topicBadge: {
    backgroundColor: '#f9f5ee',
    borderRadius: 999,
    paddingHorizontal: s(10),
    paddingVertical: s(3),
    borderWidth: 1,
    borderColor: '#e5e3e1',
  },
  topicBadgeText: {
    fontSize: s(10),
    fontFamily: F.regular,
    color: '#6b7280',
  },
  questionText: { 
    fontSize: s(16), 
    fontFamily: F.semiBold, 
    color: '#1a1a1a', 
    lineHeight: s(26) 
  },

  optionsList: { 
    gap: s(10), 
    marginTop: s(4) 
  },

  option: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: s(12),
    padding: s(14), 
    borderRadius: s(12),
    borderWidth: 1.5, 
    borderColor: '#e5e3e1', 
    backgroundColor: '#fff',
  },
  optionSelected: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: s(12),
    padding: s(14), 
    borderRadius: s(12),
    borderWidth: 1.5, 
    borderColor: '#1d5152', 
    backgroundColor: '#f0f7f7',
  },
  optionCorrect: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: s(12),
    padding: s(14), 
    borderRadius: s(12),
    borderWidth: 1.5, 
    borderColor: '#1d5152', 
    backgroundColor: '#f0f7f7',
  },
  optionWrong: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: s(12),
    padding: s(14), 
    borderRadius: s(12),
    borderWidth: 1.5, 
    borderColor: '#EF4444', 
    backgroundColor: '#fef2f2',
  },

  letter: {
    width: s(36), 
    height: s(36), 
    borderRadius: s(8),
    backgroundColor: '#f9f5ee', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e3e1',
  },
  letterSelected: {
    width: s(36), 
    height: s(36), 
    borderRadius: s(8),
    backgroundColor: '#1d5152', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  letterCorrect: {
    width: s(36), 
    height: s(36), 
    borderRadius: s(8),
    backgroundColor: '#1d5152', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  letterWrong: {
    width: s(36), 
    height: s(36), 
    borderRadius: s(8),
    backgroundColor: '#EF4444', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  letterText: { 
    fontSize: s(13), 
    fontFamily: F.bold, 
    color: '#4b5563' 
  },
  letterTextSelected: { 
    fontSize: s(13), 
    fontFamily: F.bold, 
    color: '#fff' 
  },
  optionText: { 
    flex: 1, 
    fontSize: s(14), 
    fontFamily: F.regular, 
    color: '#1a1a1a', 
    lineHeight: s(20) 
  },

  feedback: {
    marginTop: s(4), 
    padding: s(12), 
    borderRadius: s(10),
  },
  feedbackCorrect: { 
    backgroundColor: '#f0f7f7',
    borderWidth: 1,
    borderColor: '#d5e0e0',
  },
  feedbackWrong: { 
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  feedbackText: { 
    fontSize: s(13), 
    fontFamily: F.semiBold, 
    color: '#1a1a1a', 
    lineHeight: s(20) 
  },

  hintBtn: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: s(8),
    paddingVertical: s(13), 
    borderRadius: s(12),
    borderWidth: 1, 
    borderColor: '#e5d9ff', 
    backgroundColor: '#ffffff',
  },
  hintText: { 
    fontSize: s(14), 
    fontFamily: F.semiBold, 
    color: '#CAB3FF' 
  },

  hintBox: {
    padding: s(14),
    borderRadius: s(12),
    backgroundColor: '#f5f0ff',
    borderWidth: 1,
    borderColor: '#e5d9ff',
  },
  hintBoxText: {
    fontSize: s(13),
    fontFamily: F.regular,
    color: '#4b5563',
    lineHeight: s(20),
  },

  actions: { 
    flexDirection: 'row', 
    gap: s(10) 
  },
  skipBtn: {
    paddingVertical: s(15), 
    paddingHorizontal: s(20), 
    borderRadius: s(999),
    borderWidth: 1, 
    borderColor: '#e5e3e1', 
    backgroundColor: '#ffffff', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  skipText: { 
    fontSize: s(14), 
    fontFamily: F.semiBold, 
    color: '#4b5563' 
  },
  submitBtn: {
    flex: 1, 
    paddingVertical: s(15), 
    borderRadius: s(999),
    backgroundColor: '#1d5152', 
    alignItems: 'center',
    shadowColor: '#1d5152',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: { 
    fontSize: s(14), 
    fontFamily: F.bold, 
    color: '#ffffff' 
  },
  nextBtn: {
    flex: 1, 
    paddingVertical: s(15), 
    borderRadius: s(999),
    backgroundColor: '#0f2022', 
    alignItems: 'center',
    shadowColor: '#0f2022',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextText: { 
    fontSize: s(14), 
    fontFamily: F.bold, 
    color: '#ffffff' 
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(20),
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: s(20),
    padding: s(20),
    width: isTablet ? s(400) : (width - s(40)),
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(16),
  },
  modalTitle: {
    fontSize: s(18),
    fontFamily: F.bold,
    color: '#1a1a1a',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: s(12),
    paddingHorizontal: s(4),
    borderBottomWidth: 1,
    borderBottomColor: '#f9f5ee',
  },
  modalItemActive: {
    backgroundColor: '#f0f7f7',
    paddingHorizontal: s(10),
    borderRadius: s(8),
  },
  modalItemText: {
    fontSize: s(15),
    fontFamily: F.regular,
    color: '#1a1a1a',
  },
  modalItemTextActive: {
    fontFamily: F.semiBold,
    color: '#1d5152',
  },
  modalItemCheck: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    backgroundColor: '#1d5152',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(20),
  },
  emptyText: {
    fontSize: s(18),
    fontFamily: F.regular,
    color: '#6b7280',
    marginBottom: s(16),
  },
  emptyBtn: {
    backgroundColor: '#1d5152',
    paddingHorizontal: s(24),
    paddingVertical: s(12),
    borderRadius: s(999),
  },
  emptyBtnText: {
    fontSize: s(14),
    fontFamily: F.semiBold,
    color: '#ffffff',
  },
});