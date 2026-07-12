import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthProvider';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Floating particle component
function Particle({ delay, x, size, color }) {
  const y = useRef(new Animated.Value(height * 0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y, { toValue: height * 0.1, duration: 3000, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.7, duration: 600, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 2400, useNativeDriver: true }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(y, { toValue: height * 0.8, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY: y }],
      }}
    />
  );
}

const PARTICLES = [
  { delay: 0,    x: width * 0.1,  size: 6,  color: 'rgba(202,179,255,0.8)' },
  { delay: 400,  x: width * 0.25, size: 4,  color: 'rgba(255,255,255,0.5)' },
  { delay: 800,  x: width * 0.5,  size: 8,  color: 'rgba(202,179,255,0.6)' },
  { delay: 200,  x: width * 0.7,  size: 5,  color: 'rgba(255,255,255,0.4)' },
  { delay: 1000, x: width * 0.85, size: 6,  color: 'rgba(202,179,255,0.7)' },
  { delay: 600,  x: width * 0.4,  size: 4,  color: 'rgba(255,255,255,0.6)' },
];

export default function SplashScreen() {
  const { loading } = useAuth();
  const router = useRouter();

  const logoScale   = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity  = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  // Pulse ring
  const pulseScale   = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.5)).current;

  // Shimmer on text
  const shimmerX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    // Logo entrance
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 50, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(tagOpacity,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Pulse ring loop
    Animated.loop(
      Animated.parallel([
        Animated.timing(pulseScale,   { toValue: 2.2, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulseOpacity, { toValue: 0,   duration: 1600, useNativeDriver: true }),
      ])
    ).start();

    // Shimmer loop
    Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(shimmerX, { toValue: width * 1.5, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmerX, { toValue: -width,      duration: 0,   useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        router.replace('/onboarding');
      });
    }, 2800);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Background blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* Pulse ring behind logo */}
      <Animated.View
        style={[
          styles.pulseRing,
          { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
        ]}
      />

      {/* Logo */}
      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <Svg width={90} height={90} viewBox="0 0 60 60" fill="none">
          <Rect width="60" height="60" rx="18" fill="#ffffff" />
          <Path d="M30 10L12 21v10c0 7.5 4.5 14 12 16.5C31.5 45 36 38.5 36 31V21L30 10z" stroke="#1d5152" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M30 10L48 21v10c0 7.5-4.5 14-12 16.5C28.5 45 24 38.5 24 31V21L30 10z" stroke="#CAB3FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M30 26v7M26 30h8" stroke="#1d5152" strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      </Animated.View>

      {/* App name with shimmer overlay */}
      <Animated.View style={{ opacity: textOpacity, overflow: 'hidden' }}>
        <Text style={styles.appName}>PakTest AI</Text>
        <Animated.View
          style={[styles.shimmer, { transform: [{ translateX: shimmerX }] }]}
        />
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
        Master your exams with AI precision
      </Animated.Text>

      {/* Loading dots */}
      <Animated.View style={[styles.dotsRow, { opacity: tagOpacity }]}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d5152',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blob1: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: 'rgba(202,179,255,0.07)',
    top: -width * 0.25,
    right: -width * 0.25,
  },
  blob2: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -width * 0.15,
    left: -width * 0.15,
  },
  blob3: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(202,179,255,0.05)',
    bottom: height * 0.25,
    right: -width * 0.1,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(202,179,255,0.5)',
  },
  logoWrap: {
    width: 110,
    height: 110,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#CAB3FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    transform: [{ skewX: '-20deg' }],
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '400',
    letterSpacing: 0.3,
    marginBottom: 52,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 60,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#CAB3FF',
    borderRadius: 3,
  },
});
