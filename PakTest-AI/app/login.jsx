import { useState } from "react";
import { useAuth } from '../context/AuthContext';
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { F } from "../constants/fonts";

const { width, height } = Dimensions.get("window");
const s = (n) => Math.round((width / 375) * n);

// ── Icons ──────────────────────────────────────────────
const EmailIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 6l-10 7L2 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LockIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EyeIcon = ({ show }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {!show && (
      <Path d="M3 3l18 18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </Svg>
);

const GoogleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

const FacebookIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
  </Svg>
);

const AppleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#000000" />
  </Svg>
);

const LogoIcon = () => (
  <Svg width="60" height="60" viewBox="0 0 60 60" fill="none">
    <Rect width="60" height="60" rx="16" fill="#1d5152" />
    <Path d="M30 14L14 24v10c0 7 4 13.5 10 15.5 6-2 10-8.5 10-15.5V24L30 14z" stroke="#CAB3FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M30 14L46 24v10c0 7-4 13.5-10 15.5-6-2-10-8.5-10-15.5V24L30 14z" stroke="#CAB3FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M30 29v6M24 32h12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

const SparkleIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" fill="#CAB3FF" opacity="0.8"/>
  </Svg>
);

const ArrowRightIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── Main Component ──────────────────────────────────────
export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/completeprofile");
    } catch (error) {
      alert('Invalid credentials. Use admin/admin to login.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResetPassword(false);
      setResetEmail("");
      alert("Password reset link sent to your email!");
    }, 1500);
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      await login(`${provider}@example.com`, 'social');
      router.replace("/completeprofile");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (showResetPassword) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setShowResetPassword(false)} style={styles.backBtn}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#1d5152" />
              </Svg>
            </TouchableOpacity>

            <View style={styles.resetContainer}>
              <View style={styles.resetIconBox}>
                <Svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#CAB3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M22 6l-10 7L2 6" stroke="#CAB3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <Text style={styles.resetTitle}>Reset Password</Text>
              <Text style={styles.resetSubtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              <View style={styles.inputWrapper}>
                <View style={styles.inputIconLeft}>
                  <EmailIcon />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#6b7280"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={styles.loginBtn}
                onPress={handleResetPassword}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginBtnText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowResetPassword(false)}>
                <Text style={styles.backToLoginText}>← Back to Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo & Brand */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <LogoIcon />
              <View style={styles.logoSparkle}>
                <SparkleIcon />
              </View>
            </View>
            <Text style={styles.brandTitle}>Welcome Back</Text>
            <Text style={styles.brandSubtitle}>Sign in to continue your exam preparation</Text>
          </View>

          {/* Social Login */}
          <View style={styles.socialSection}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => handleSocialLogin("Google")}
              activeOpacity={0.8}
            >
              <GoogleIcon />
              <Text style={styles.socialBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => handleSocialLogin("Facebook")}
              activeOpacity={0.8}
            >
              <FacebookIcon />
              <Text style={styles.socialBtnText}>Continue with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => handleSocialLogin("Apple")}
              activeOpacity={0.8}
            >
              <AppleIcon />
              <Text style={styles.socialBtnText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Form */}
          <View style={styles.formSection}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconLeft}>
                <EmailIcon />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputIconLeft}>
                <LockIcon />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.inputIconRight}
                onPress={() => setShowPassword(!showPassword)}
              >
                <EyeIcon show={showPassword} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && (
                    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <Path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  )}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowResetPassword(true)}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Sign In</Text>
                  <ArrowRightIcon />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9f5ee" },
  container: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: 24, 
    paddingVertical: 40,
    justifyContent: "center",
  },

  brandSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 20,
  },
  logoSparkle: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ffffff",
    borderRadius: 999,
    padding: 4,
    shadowColor: "#CAB3FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 28,
    fontFamily: F.display,
    color: "#1a1a1a",
    marginBottom: 6,
  },
  brandSubtitle: {
    fontSize: 15,
    fontFamily: F.regular,
    color: "#6b7280",
  },

  socialSection: {
    gap: 12,
    marginBottom: 24,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e5e3e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  socialBtnText: {
    fontSize: 14,
    fontFamily: F.semiBold,
    color: "#1a1a1a",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e3e1",
  },
  dividerText: {
    fontSize: 12,
    fontFamily: F.regular,
    color: "#6b7280",
  },

  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  inputIconLeft: {
    position: "absolute",
    left: 14,
    zIndex: 1,
  },
  inputIconRight: {
    position: "absolute",
    right: 14,
    zIndex: 1,
  },
  input: {
    paddingVertical: 14,
    paddingLeft: 44,
    paddingRight: 44,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    fontSize: 14,
    fontFamily: F.regular,
    color: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#e5e3e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#e5e3e1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  checkboxActive: {
    backgroundColor: "#1d5152",
    borderColor: "#1d5152",
  },
  rememberMeText: {
    fontSize: 13,
    fontFamily: F.regular,
    color: "#4b5563",
  },
  forgotPassword: {
    fontSize: 13,
    fontFamily: F.semiBold,
    color: "#1d5152",
  },

  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1d5152",
    borderRadius: 999,
    paddingVertical: 16,
    shadowColor: "#1d5152",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  loginBtnText: {
    fontSize: 16,
    fontFamily: F.bold,
    color: "#ffffff",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    fontFamily: F.regular,
    color: "#6b7280",
  },
  signUpText: {
    fontSize: 14,
    fontFamily: F.bold,
    color: "#1d5152",
  },

  // Reset Password Styles
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 24,
  },
  resetContainer: {
    alignItems: "center",
    gap: 16,
  },
  resetIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f5f0ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5d9ff",
    marginBottom: 8,
  },
  resetTitle: {
    fontSize: 24,
    fontFamily: F.display,
    color: "#1a1a1a",
  },
  resetSubtitle: {
    fontSize: 14,
    fontFamily: F.regular,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 8,
  },
  backToLoginText: {
    fontSize: 14,
    fontFamily: F.semiBold,
    color: "#1d5152",
    marginTop: 8,
  },
});