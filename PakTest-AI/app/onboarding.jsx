import { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, Animated, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Polygon, Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    bg: '#1d5152',
    accent: '#CAB3FF',
    tag: 'Career Ready',
    title: 'Explore\nJob Opportunities',
    desc: 'Browse thousands of government & private sector jobs. Get AI-matched roles based on your exam scores.',
    icon: 'jobs',
    bubbleColor: 'rgba(202,179,255,0.12)',
  },
  {
    id: '2',
    bg: '#0f2022',
    accent: '#5EEAD4',
    tag: 'CSS · PMS',
    title: 'Crack CSS & PMS\nWith Confidence',
    desc: 'Structured syllabus, topic-wise MCQs, and AI-generated essay outlines for Pakistan\'s toughest exams.',
    icon: 'css',
    bubbleColor: 'rgba(94,234,212,0.1)',
  },
  {
    id: '3',
    bg: '#1a1035',
    accent: '#CAB3FF',
    tag: 'Smart Practice',
    title: 'Adaptive MCQs\nPowered by AI',
    desc: 'Practice smarter — AI identifies your weak spots and serves targeted questions to boost your score fast.',
    icon: 'mcq',
    bubbleColor: 'rgba(202,179,255,0.1)',
  },
  {
    id: '4',
    bg: '#1d3a52',
    accent: '#FCD34D',
    tag: 'Past Papers',
    title: 'Solve Real\nPast Papers',
    desc: 'Access 10+ years of solved & unsolved past papers for PPSC, FPSC, NTS, CSS and more — all in one place.',
    icon: 'papers',
    bubbleColor: 'rgba(252,211,77,0.1)',
  },
];

// ── Slide Illustrations ──────────────────────────────────
function JobsIllustration({ accent }) {
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180" fill="none">
      {/* Building */}
      <Rect x="30" y="60" width="60" height="100" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <Rect x="40" y="72" width="12" height="12" rx="2" fill={accent} opacity="0.7" />
      <Rect x="60" y="72" width="12" height="12" rx="2" fill={accent} opacity="0.5" />
      <Rect x="40" y="92" width="12" height="12" rx="2" fill={accent} opacity="0.4" />
      <Rect x="60" y="92" width="12" height="12" rx="2" fill={accent} opacity="0.7" />
      <Rect x="40" y="112" width="12" height="12" rx="2" fill={accent} opacity="0.6" />
      <Rect x="60" y="112" width="12" height="12" rx="2" fill={accent} opacity="0.3" />
      <Rect x="48" y="138" width="14" height="22" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Briefcase */}
      <Rect x="110" y="80" width="60" height="44" rx="8" fill="rgba(255,255,255,0.1)" stroke={accent} strokeWidth="1.5" />
      <Path d="M125 80V72a6 6 0 0112 0v8" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M110 100h60" stroke={accent} strokeWidth="1" opacity="0.5" />
      <Circle cx="140" cy="100" r="4" fill={accent} opacity="0.8" />
      {/* Stars */}
      <Path d="M160 50L162 56h6l-5 3.5 2 6-5-3.5-5 3.5 2-6-5-3.5h6z" fill={accent} opacity="0.6" />
      <Path d="M50 30L51.5 34h4l-3.5 2.5 1.5 4-3.5-2.5-3.5 2.5 1.5-4-3.5-2.5h4z" fill={accent} opacity="0.4" />
    </Svg>
  );
}

function CSSIllustration({ accent }) {
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180" fill="none">
      {/* Scroll / certificate */}
      <Rect x="40" y="30" width="120" height="140" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <Rect x="40" y="30" width="120" height="20" rx="10" fill={accent} opacity="0.2" />
      <Path d="M60 70h80M60 88h60M60 106h70M60 124h50" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Seal */}
      <Circle cx="140" cy="148" r="18" fill="rgba(255,255,255,0.08)" stroke={accent} strokeWidth="1.5" />
      <Path d="M140 136l2.5 7.5h7.5l-6 4.5 2.5 7.5-6.5-4.5-6.5 4.5 2.5-7.5-6-4.5h7.5z" fill={accent} opacity="0.7" />
      {/* Pen */}
      <Path d="M55 145l30-30 8 8-30 30z" fill="rgba(255,255,255,0.1)" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
      <Path d="M83 117l8 8" stroke={accent} strokeWidth="1.5" />
      <Path d="M55 145l-6 6 6-1z" fill={accent} opacity="0.6" />
    </Svg>
  );
}

function MCQIllustration({ accent }) {
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180" fill="none">
      {/* Phone/tablet frame */}
      <Rect x="55" y="20" width="90" height="140" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      {/* MCQ rows */}
      {[50, 78, 106, 134].map((y, i) => (
        <Svg key={i}>
          <Circle cx="75" cy={y} r="7" fill={i === 0 ? accent : 'rgba(255,255,255,0.1)'} stroke={accent} strokeWidth="1.2" opacity={i === 0 ? 0.9 : 0.5} />
          {i === 0 && <Path d={`M71 ${y}l3 3 5-5`} stroke="#1a1035" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
          <Rect x="90" y={y - 5} width="45" height="10" rx="5" fill="rgba(255,255,255,0.08)" />
        </Svg>
      ))}
      {/* AI spark */}
      <Path d="M155 40L157 47h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" fill={accent} opacity="0.8" />
      <Circle cx="155" cy="40" r="14" fill="rgba(202,179,255,0.1)" stroke={accent} strokeWidth="1" opacity="0.5" />
    </Svg>
  );
}

function PapersIllustration({ accent }) {
  return (
    <Svg width={200} height={180} viewBox="0 0 200 180" fill="none">
      {/* Stacked papers */}
      <Rect x="55" y="50" width="90" height="110" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <Rect x="50" y="44" width="90" height="110" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <Rect x="45" y="38" width="90" height="110" rx="8" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      {/* Lines */}
      <Path d="M62 62h56M62 78h40M62 94h50M62 110h35" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      {/* Year badge */}
      <Rect x="100" y="118" width="44" height="22" rx="11" fill={accent} opacity="0.2" stroke={accent} strokeWidth="1" />
      <Path d="M108 129h28" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      {/* Clock */}
      <Circle cx="158" cy="42" r="16" fill="rgba(255,255,255,0.06)" stroke={accent} strokeWidth="1.5" />
      <Path d="M158 34v8l5 3" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const ICONS = { jobs: JobsIllustration, css: CSSIllustration, mcq: MCQIllustration, papers: PapersIllustration };

// ── Main Component ───────────────────────────────────────
export default function Onboarding() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const flatRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goTo = (index) => {
    if (index < 0 || index >= SLIDES.length) return;
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: index > current ? -30 : 30, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setCurrent(index);
      flatRef.current?.scrollToIndex({ index, animated: false });
      slideAnim.setValue(index > current ? 30 : -30);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    });
  };

  const finish = () => router.replace('/(tabs)');

  const slide = SLIDES[current];
  const IllustrationComp = ICONS[slide.icon];

  return (
    <View style={[styles.container, { backgroundColor: slide.bg }]}>
      {/* Background bubbles */}
      <View style={[styles.bubble1, { backgroundColor: slide.bubbleColor }]} />
      <View style={[styles.bubble2, { backgroundColor: slide.bubbleColor }]} />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={finish}>
        <Text style={[styles.skipText, { color: slide.accent }]}>Skip</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <Animated.View style={[styles.illustrationWrap, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        <View style={[styles.illustrationBg, { borderColor: `${slide.accent}30` }]}>
          <IllustrationComp accent={slide.accent} />
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        <View style={[styles.tagPill, { backgroundColor: `${slide.accent}20`, borderColor: `${slide.accent}40` }]}>
          <Text style={[styles.tagText, { color: slide.accent }]}>{slide.tag}</Text>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </Animated.View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goTo(i)}>
            <Animated.View
              style={[
                styles.dot,
                i === current && [styles.dotActive, { backgroundColor: slide.accent }],
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navRow}>
        {current > 0 ? (
          <TouchableOpacity style={[styles.backBtn, { borderColor: `${slide.accent}40` }]} onPress={() => goTo(current - 1)}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5M12 5l-7 7 7 7" stroke={slide.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: slide.accent }]}
          onPress={current === SLIDES.length - 1 ? finish : () => goTo(current + 1)}
        >
          <Text style={styles.nextText}>
            {current === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          {current < SLIDES.length - 1 && (
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <Path d="M5 12h14M12 5l7 7-7 7" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          )}
        </TouchableOpacity>
      </View>

      {/* Hidden FlatList for index tracking */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        renderItem={() => null}
        style={{ height: 0, width: 0, position: 'absolute' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  bubble1: {
    position: 'absolute',
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    top: -width * 0.3,
    right: -width * 0.3,
  },
  bubble2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    bottom: -width * 0.15,
    left: -width * 0.15,
  },

  skipBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  skipText: { fontSize: 14, fontWeight: '600' },

  illustrationWrap: {
    marginBottom: 40,
    marginTop: 20,
  },
  illustrationBg: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: { paddingHorizontal: 32, alignItems: 'center', marginBottom: 36 },
  tagPill: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    marginBottom: 16,
  },
  tagText: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  desc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },

  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    width: 28,
    borderRadius: 4,
  },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 48,
    paddingBottom: 20,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backPlaceholder: { width: 52 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  nextText: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
});
