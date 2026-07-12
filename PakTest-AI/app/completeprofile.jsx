import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { F } from "../constants/fonts";
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthProvider';

const { width } = Dimensions.get("window");
const s = (n) => Math.round((width / 375) * n);

// ── Icons ──────────────────────────────────────────────
const UserIcon = ({ color = "#6b7280" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EducationIcon = ({ color = "#6b7280" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M12 6L3 10l9 4 9-4-9-4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 10v6l9 4 9-4v-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SparkleIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" fill="#CAB3FF" />
  </Svg>
);

const AwardIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="6" stroke="#CAB3FF" strokeWidth="2" />
    <Path d="M12 14v6M9 20h6" stroke="#CAB3FF" strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 17l-4 4M16 17l4 4" stroke="#CAB3FF" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ArrowRightIcon = ({ color = "#fff" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowLeftIcon = ({ color = "#1d5152" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function CompleteProfile() {
  const router = useRouter();
  const { completeProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [fullName, setFullName] = useState("");
  const [education, setEducation] = useState("");
  const [selectedExams, setSelectedExams] = useState([]);
  const [experience, setExperience] = useState("");
  const [city, setCity] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const examOptions = [
    { id: "nts", label: "NTS", icon: "📝", color: "#4F46E5" },
    { id: "ppsc", label: "PPSC", icon: "🎯", color: "#7C3AED" },
    { id: "fpsc", label: "FPSC", icon: "🏛️", color: "#2563EB" },
    { id: "spsc", label: "SPSC", icon: "📚", color: "#059669" },
    { id: "kppsc", label: "KPPSC", icon: "🏆", color: "#D97706" },
    { id: "bpsc", label: "BPSC", icon: "🎓", color: "#DC2626" },
  ];

  const educationLevels = [
    "Bachelor's (14-16 years)",
    "Master's (16-18 years)",
    "M.Phil / MS",
    "PhD",
    "Post Doctorate",
    "Other",
  ];

  const steps = [
    { title: "Welcome! Let's Get to Know You", subtitle: "Tell us your name so we can personalize your experience", icon: "👋" },
    { title: "Your Educational Background", subtitle: "What's your highest level of education?", icon: "🎓" },
    { title: "Exam Preferences", subtitle: "Which exams are you preparing for? (Select all that apply)", icon: "📋" },
    { title: "Almost Done!", subtitle: "Tell us about your experience and location", icon: "🚀" },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();

    Animated.timing(progressAnim, { toValue: (currentStep + 1) / steps.length, duration: 400, useNativeDriver: false }).start();
  }, [currentStep]);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentStep === 2 && selectedExams.length === 0) {
      alert("Please select at least one exam you're preparing for.");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      fadeAnim.setValue(0);
      slideAnim.setValue(-50);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);
    try {
      await completeProfile({ fullName, education, selectedExams, experience, city });
      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExam = (examId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedExams(prev => prev.includes(examId) ? prev.filter(id => id !== examId) : [...prev, examId]);
  };

  const renderStep = () => {
    const step = steps[currentStep];

    return (
      <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateX: slideAnim }, { scale: scaleAnim }] }]}>
        <View style={styles.stepHeader}>
          <View style={styles.stepIconContainer}>
            <Text style={styles.stepIcon}>{step.icon}</Text>
          </View>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
        </View>

        <View style={styles.stepContent}>
          {currentStep === 0 && (
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIconLeft}><UserIcon color="#1d5152" /></View>
                <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="#9ca3af" value={fullName} onChangeText={setFullName} autoFocus />
              </View>
              <View style={styles.hintContainer}>
                <SparkleIcon />
                <Text style={styles.hintText}>This helps us personalize your learning experience</Text>
              </View>
            </View>
          )}

          {currentStep === 1 && (
            <View style={styles.inputGroup}>
              <View style={styles.educationGrid}>
                {educationLevels.map((level) => (
                  <TouchableOpacity key={level} style={[styles.educationOption, education === level && styles.educationOptionActive]} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEducation(level); }} activeOpacity={0.7}>
                    <View style={styles.educationOptionContent}>
                      <EducationIcon color={education === level ? "#fff" : "#6b7280"} />
                      <Text style={[styles.educationOptionText, education === level && styles.educationOptionTextActive]}>{level}</Text>
                      {education === level && <View style={styles.checkBadge}><CheckIcon /></View>}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {currentStep === 2 && (
            <View style={styles.inputGroup}>
              <View style={styles.examGrid}>
                {examOptions.map((exam) => {
                  const isSelected = selectedExams.includes(exam.id);
                  return (
                    <TouchableOpacity key={exam.id} style={[styles.examOption, isSelected && styles.examOptionActive, isSelected && { borderColor: exam.color }]} onPress={() => toggleExam(exam.id)} activeOpacity={0.7}>
                      <View style={styles.examOptionContent}>
                        <Text style={styles.examEmoji}>{exam.icon}</Text>
                        <Text style={[styles.examOptionText, isSelected && styles.examOptionTextActive]}>{exam.label}</Text>
                        {isSelected && <View style={[styles.examCheckBadge, { backgroundColor: exam.color }]}><CheckIcon /></View>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.hintContainer}>
                <AwardIcon />
                <Text style={styles.hintText}>Select all exams you're currently preparing for</Text>
              </View>
            </View>
          )}

          {currentStep === 3 && (
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Years of Experience</Text>
                <TextInput style={styles.input} placeholder="e.g., 2 years, Fresher, 5+ years" placeholderTextColor="#9ca3af" value={experience} onChangeText={setExperience} />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Your City</Text>
                <TextInput style={styles.input} placeholder="e.g., Lahore, Karachi, Islamabad" placeholderTextColor="#9ca3af" value={city} onChangeText={setCity} />
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>📋 Profile Summary</Text>
                <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Name:</Text><Text style={styles.summaryValue}>{fullName || "Not provided"}</Text></View>
                <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Education:</Text><Text style={styles.summaryValue}>{education || "Not selected"}</Text></View>
                <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Exams:</Text><Text style={styles.summaryValue}>{selectedExams.length > 0 ? selectedExams.map(id => examOptions.find(e => e.id === id)?.label).join(", ") : "None selected"}</Text></View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
              <ArrowLeftIcon />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={[styles.nextButton, ((!fullName && currentStep === 0) || (!education && currentStep === 1) || (currentStep === 3 && (!experience || !city))) && styles.nextButtonDisabled]} onPress={handleNext} activeOpacity={0.8} disabled={(currentStep === 0 && !fullName) || (currentStep === 1 && !education) || (currentStep === 3 && (!experience || !city))}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={styles.nextButtonText}>{currentStep === steps.length - 1 ? "Complete Profile" : "Continue"}</Text>
                <ArrowRightIcon />
              </>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f5ee" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>Complete Profile</Text>
          <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) }]} />
          </View>
          <View style={styles.progressSteps}>
            {steps.map((_, index) => (
              <View key={index} style={[styles.progressDot, index <= currentStep && styles.progressDotActive]}>
                {index < currentStep && <CheckIcon />}
              </View>
            ))}
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>{renderStep()}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9f5ee" },
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#e5e3e1", backgroundColor: "#ffffff" },
  headerTitle: { fontSize: 17, fontFamily: F.semiBold, color: "#1a1a1a" },
  skipBtn: { width: 40, alignItems: "flex-end" },
  skipText: { fontSize: 14, fontFamily: F.semiBold, color: "#1d5152" },
  progressContainer: { paddingHorizontal: 24, paddingVertical: 20, backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  progressBar: { height: 4, backgroundColor: "#e5e3e1", borderRadius: 2, overflow: "hidden", marginBottom: 12 },
  progressFill: { height: "100%", backgroundColor: "#1d5152", borderRadius: 2 },
  progressSteps: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 4 },
  progressDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#e5e3e1", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "transparent" },
  progressDotActive: { backgroundColor: "#1d5152", borderColor: "#CAB3FF" },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20 },
  content: { flex: 1 },
  stepContainer: { flex: 1, gap: 24 },
  stepHeader: { alignItems: "center", gap: 8 },
  stepIconContainer: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#f5f0ff", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#e5d9ff", marginBottom: 4 },
  stepIcon: { fontSize: 32 },
  stepTitle: { fontSize: 24, fontFamily: F.display, color: "#1a1a1a", textAlign: "center", letterSpacing: -0.5 },
  stepSubtitle: { fontSize: 15, fontFamily: F.regular, color: "#6b7280", textAlign: "center" },
  stepContent: { flex: 1, paddingVertical: 8 },
  inputGroup: { gap: 16 },
  inputWrapper: { position: "relative", justifyContent: "center", borderRadius: 14, backgroundColor: "#ffffff", borderWidth: 2, borderColor: "#e5e3e1", paddingHorizontal: 14, paddingVertical: 0 },
  inputIconLeft: { position: "absolute", left: 14, zIndex: 1 },
  input: { paddingVertical: 14, paddingLeft: 44, paddingRight: 14, backgroundColor: "transparent", fontSize: 14, fontFamily: F.regular, color: "#1a1a1a" },
  inputLabel: { fontSize: 14, fontFamily: F.semiBold, color: "#1a1a1a", marginLeft: 4 },
  educationGrid: { gap: 10 },
  educationOption: { backgroundColor: "#ffffff", borderRadius: 12, borderWidth: 2, borderColor: "#e5e3e1", padding: 14 },
  educationOptionActive: { backgroundColor: "#1d5152", borderColor: "#1d5152" },
  educationOptionContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  educationOptionText: { flex: 1, fontSize: 14, fontFamily: F.regular, color: "#1a1a1a" },
  educationOptionTextActive: { color: "#ffffff" },
  examGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  examOption: { flex: 1, minWidth: width / 3 - 28, backgroundColor: "#ffffff", borderRadius: 12, borderWidth: 2, borderColor: "#e5e3e1", padding: 14, alignItems: "center" },
  examOptionActive: { backgroundColor: "#f5f0ff", borderColor: "#CAB3FF" },
  examOptionContent: { alignItems: "center", gap: 6 },
  examEmoji: { fontSize: 24 },
  examOptionText: { fontSize: 13, fontFamily: F.semiBold, color: "#1a1a1a" },
  examOptionTextActive: { color: "#1d5152" },
  checkBadge: { position: "absolute", top: -8, right: -8, width: 20, height: 20, borderRadius: 10, backgroundColor: "#1d5152", justifyContent: "center", alignItems: "center" },
  examCheckBadge: { position: "absolute", top: -8, right: -8, width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  hintContainer: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#f5f0ff", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#e5d9ff" },
  hintText: { flex: 1, fontSize: 13, fontFamily: F.regular, color: "#4b5563", lineHeight: 18 },
  summaryCard: { backgroundColor: "#f8fafc", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e5e3e1", gap: 10 },
  summaryTitle: { fontSize: 16, fontFamily: F.semiBold, color: "#1a1a1a", marginBottom: 4 },
  summaryItem: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  summaryLabel: { fontSize: 14, fontFamily: F.regular, color: "#6b7280", minWidth: 80 },
  summaryValue: { flex: 1, fontSize: 14, fontFamily: F.semiBold, color: "#1a1a1a" },
  navigationContainer: { flexDirection: "row", gap: 12, paddingTop: 8 },
  backButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 999, borderWidth: 2, borderColor: "#e5e3e1", backgroundColor: "#ffffff" },
  backButtonText: { fontSize: 14, fontFamily: F.semiBold, color: "#1d5152" },
  nextButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1d5152", borderRadius: 999, paddingVertical: 14, shadowColor: "#1d5152", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
  nextButtonDisabled: { opacity: 0.5 },
  nextButtonText: { fontSize: 16, fontFamily: F.bold, color: "#ffffff" },
});
