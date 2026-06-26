import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const s = (n) => Math.round((width / 375) * n);

// ── Icons ──────────────────────────────────────────────
const BackIcon = () => (
  <Svg width={s(24)} height={s(24)} viewBox="0 0 24 24" fill="none">
    <Path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#191C1E" />
  </Svg>
);
const LightbulbIcon = () => (
  <Svg width={s(18)} height={s(18)} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21h6v-1H9v1zm3-20C8.13 1 5 4.13 5 8c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-3.26C17.81 12.47 19 10.38 19 8c0-3.87-3.13-7-7-7zm2.85 11.1l-.85.6V16h-4v-3.3l-.85-.6A4.997 4.997 0 017 8c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" fill="#3980F4" />
  </Svg>
);
const CheckIcon = () => (
  <Svg width={s(18)} height={s(18)} viewBox="0 0 24 24" fill="none">
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff" />
  </Svg>
);
const CloseIcon = () => (
  <Svg width={s(16)} height={s(16)} viewBox="0 0 24 24" fill="none">
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="#fff" />
  </Svg>
);

// ── Dummy Quiz Data ────────────────────────────────────
const QUESTIONS = [
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
    subject: 'English',
    difficulty: 'MEDIUM',
    topic: 'Grammar',
    question: 'Which of the following is a correct sentence?',
    options: [
      'She don\'t know the answer.',
      'She doesn\'t knows the answer.',
      'She doesn\'t know the answer.',
      'She not know the answer.',
    ],
    correct: 'C',
  },
  {
    id: 3,
    subject: 'Math',
    difficulty: 'MEDIUM',
    topic: 'Arithmetic',
    question: 'If a train travels 300 km in 3 hours, what is its average speed?',
    options: ['50 km/h', '100 km/h', '150 km/h', '200 km/h'],
    correct: 'B',
  },
  {
    id: 4,
    subject: 'Pak Studies',
    difficulty: 'HARD',
    topic: 'Constitution',
    question: 'In which year was the current Constitution of Pakistan adopted?',
    options: ['1956', '1962', '1970', '1973'],
    correct: 'D',
  },
  {
    id: 5,
    subject: 'Computer',
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
];

const LETTERS = ['A', 'B', 'C', 'D'];
const DIFF_COLOR = { EASY: '#006C49', MEDIUM: '#F59E0B', HARD: '#BA1A1A' };
const DIFF_BG = { EASY: '#D1FAE5', MEDIUM: '#FEF3C7', HARD: '#FFDAD6' };

export default function Test() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);

  const q = QUESTIONS[current];
  const progress = ((current + 1) / QUESTIONS.length) * 100;

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

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
    }
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setSubmitted(false);
      setTimeLeft(90);
    } else {
      Alert.alert(
        'Quiz Complete! 🎉',
        `You scored ${score + (submitted && selected === q.correct ? 1 : 0)} out of ${QUESTIONS.length}`,
        [{ text: 'Back to Home', onPress: () => router.back() }]
      );
    }
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerSub}>PPSC MOCK TEST</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{q.subject}</Text>
        </View>
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
          <Text style={styles.counterText}>Question {current + 1}/{QUESTIONS.length}</Text>
          <View style={styles.scorePill}>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        </View>

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
          </View>

          <Text style={styles.topicText}>Topic: {q.topic}</Text>
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
        <TouchableOpacity style={styles.hintBtn} activeOpacity={0.8}>
          <LightbulbIcon />
          <Text style={styles.hintText}>AI Smart Hint</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => { setSelected(null); setSubmitted(false); setTimeLeft(90); if (current < QUESTIONS.length - 1) setCurrent((c) => c + 1); }}
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
                {current < QUESTIONS.length - 1 ? 'Next Question →' : 'Finish Quiz'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Question dots */}
        <View style={styles.dots}>
          {QUESTIONS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === current && styles.dotActive, i < current && styles.dotDone]}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FB' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: s(16), paddingVertical: s(12),
    borderBottomWidth: 1, borderBottomColor: '#E6E8EA',
    backgroundColor: '#fff', gap: s(10),
  },
  backBtn: {
    width: s(40), height: s(40), borderRadius: s(20),
    backgroundColor: '#F2F4F6', justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1 },
  headerSub: { fontSize: s(10), color: '#76777D', letterSpacing: 1, textTransform: 'uppercase' },
  headerTitle: { fontSize: s(15), fontWeight: '700', color: '#000' },
  timerBadge: {
    paddingHorizontal: s(12), paddingVertical: s(6),
    borderRadius: 999, backgroundColor: '#EEF2FF',
    borderWidth: 1, borderColor: '#C7D2FE',
  },
  timerUrgent: { backgroundColor: '#FFDAD6', borderColor: '#BA1A1A' },
  timerText: { fontSize: s(13), fontWeight: '700', color: '#3730A3' },
  timerTextUrgent: { color: '#BA1A1A' },

  progressBg: { height: s(5), backgroundColor: '#E6E8EA' },
  progressFill: { height: s(5), backgroundColor: '#3980F4' },

  scroll: { flex: 1 },
  content: { padding: s(16), gap: s(14), paddingBottom: s(40) },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counterText: { fontSize: s(13), color: '#45464D', fontWeight: '600' },
  scorePill: {
    backgroundColor: '#131B2E', borderRadius: 999,
    paddingHorizontal: s(12), paddingVertical: s(4),
  },
  scoreText: { fontSize: s(12), color: '#6CF8BB', fontWeight: '700' },

  qCard: {
    backgroundColor: '#fff', borderRadius: s(16),
    borderWidth: 1, borderColor: '#E6E8EA',
    padding: s(18), gap: s(12),
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
  },
  badgeRow: { flexDirection: 'row', gap: s(8) },
  subjectBadge: {
    backgroundColor: '#EEF2FF', borderRadius: 999,
    paddingHorizontal: s(10), paddingVertical: s(3),
  },
  subjectBadgeText: { fontSize: s(10), fontWeight: '700', color: '#4338CA' },
  diffBadge: { borderRadius: 999, paddingHorizontal: s(10), paddingVertical: s(3) },
  diffText: { fontSize: s(10), fontWeight: '700' },
  topicText: { fontSize: s(12), color: '#76777D' },
  questionText: { fontSize: s(16), color: '#191C1E', lineHeight: s(26), fontWeight: '500' },

  optionsList: { gap: s(10), marginTop: s(4) },

  option: {
    flexDirection: 'row', alignItems: 'center', gap: s(12),
    padding: s(14), borderRadius: s(12),
    borderWidth: 1.5, borderColor: '#E6E8EA', backgroundColor: '#fff',
  },
  optionSelected: {
    flexDirection: 'row', alignItems: 'center', gap: s(12),
    padding: s(14), borderRadius: s(12),
    borderWidth: 1.5, borderColor: '#3980F4', backgroundColor: '#EFF6FF',
  },
  optionCorrect: {
    flexDirection: 'row', alignItems: 'center', gap: s(12),
    padding: s(14), borderRadius: s(12),
    borderWidth: 1.5, borderColor: '#006C49', backgroundColor: '#D1FAE5',
  },
  optionWrong: {
    flexDirection: 'row', alignItems: 'center', gap: s(12),
    padding: s(14), borderRadius: s(12),
    borderWidth: 1.5, borderColor: '#BA1A1A', backgroundColor: '#FFDAD6',
  },

  letter: {
    width: s(36), height: s(36), borderRadius: s(8),
    backgroundColor: '#F2F4F6', justifyContent: 'center', alignItems: 'center',
  },
  letterSelected: {
    width: s(36), height: s(36), borderRadius: s(8),
    backgroundColor: '#3980F4', justifyContent: 'center', alignItems: 'center',
  },
  letterCorrect: {
    width: s(36), height: s(36), borderRadius: s(8),
    backgroundColor: '#006C49', justifyContent: 'center', alignItems: 'center',
  },
  letterWrong: {
    width: s(36), height: s(36), borderRadius: s(8),
    backgroundColor: '#BA1A1A', justifyContent: 'center', alignItems: 'center',
  },
  letterText: { fontSize: s(13), fontWeight: '700', color: '#45464D' },
  letterTextSelected: { fontSize: s(13), fontWeight: '700', color: '#fff' },
  optionText: { flex: 1, fontSize: s(14), color: '#191C1E', lineHeight: s(20) },

  feedback: {
    marginTop: s(4), padding: s(12), borderRadius: s(10),
  },
  feedbackCorrect: { backgroundColor: '#D1FAE5' },
  feedbackWrong: { backgroundColor: '#FFDAD6' },
  feedbackText: { fontSize: s(13), fontWeight: '600', color: '#191C1E', lineHeight: s(20) },

  hintBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8),
    paddingVertical: s(13), borderRadius: s(12),
    borderWidth: 1, borderColor: '#C7D2FE', backgroundColor: '#fff',
  },
  hintText: { fontSize: s(14), color: '#3980F4', fontWeight: '600' },

  actions: { flexDirection: 'row', gap: s(10) },
  skipBtn: {
    paddingVertical: s(15), paddingHorizontal: s(20), borderRadius: s(12),
    borderWidth: 1, borderColor: '#C6C6CD', backgroundColor: '#fff', alignItems: 'center',
  },
  skipText: { fontSize: s(14), color: '#45464D', fontWeight: '500' },
  submitBtn: {
    flex: 1, paddingVertical: s(15), borderRadius: s(12),
    backgroundColor: '#131B2E', alignItems: 'center',
  },
  submitText: { fontSize: s(14), color: '#fff', fontWeight: '700' },
  nextBtn: {
    flex: 1, paddingVertical: s(15), borderRadius: s(12),
    backgroundColor: '#3980F4', alignItems: 'center',
  },
  nextText: { fontSize: s(14), color: '#fff', fontWeight: '700' },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: s(6), paddingTop: s(4) },
  dot: { width: s(8), height: s(8), borderRadius: s(4), backgroundColor: '#E6E8EA' },
  dotActive: { backgroundColor: '#3980F4', width: s(20) },
  dotDone: { backgroundColor: '#006C49' },
});
