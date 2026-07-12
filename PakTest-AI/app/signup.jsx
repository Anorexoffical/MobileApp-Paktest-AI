import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { F } from "../constants/fonts";

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

const UserIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EyeIcon = ({ show }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {!show && <Path d="M3 3l18 18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>
);

const GoogleIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

const LogoIcon = () => (
  <Svg width="56" height="56" viewBox="0 0 60 60" fill="none">
    <Rect width="60" height="60" rx="16" fill="#1d5152" />
    <Path d="M30 14L14 24v10c0 7 4 13.5 10 15.5 6-2 10-8.5 10-15.5V24L30 14z" stroke="#CAB3FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M30 14L46 24v10c0 7-4 13.5-10 15.5-6-2-10-8.5-10-15.5V24L30 14z" stroke="#CAB3FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M30 29v6M24 32h12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

const CheckIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function Signup() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim()) return alert("Please enter your name");
    if (!email.trim()) return alert("Please enter your email");
    if (password.length < 8) return alert("Password must be at least 8 characters");
    if (password !== confirmPassword) return alert("Passwords don't match");
    if (!agreeTerms) return alert("Please accept Terms & Conditions");

    setLoading(true);
    try {
      const res = await signup(fullName.trim(), email.trim(), password);
      if (res?.error) {
        alert(res.error.message || "Signup failed");
        return;
      }
      router.replace("/completeprofile");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      router.replace("/completeprofile");
    } catch (err) {
      alert("Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6l12 12" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>

          <View style={styles.brand}>
            <LogoIcon />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your exam preparation journey</Text>
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignup} activeOpacity={0.8} disabled={loading}>
            <GoogleIcon />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with email</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <View style={styles.iconLeft}><UserIcon /></View>
              <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#9ca3af" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
            </View>

            <View style={styles.inputWrap}>
              <View style={styles.iconLeft}><EmailIcon /></View>
              <TextInput style={styles.input} placeholder="Email address" placeholderTextColor="#9ca3af" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputWrap}>
              <View style={styles.iconLeft}><LockIcon /></View>
              <TextInput style={styles.input} placeholder="Password (min 8 chars)" placeholderTextColor="#9ca3af" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity style={styles.iconRight} onPress={() => setShowPassword(!showPassword)}>
                <EyeIcon show={showPassword} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrap}>
              <View style={styles.iconLeft}><LockIcon /></View>
              <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#9ca3af" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirm} />
              <TouchableOpacity style={styles.iconRight} onPress={() => setShowConfirm(!showConfirm)}>
                <EyeIcon show={showConfirm} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.termsRow} onPress={() => setAgreeTerms(!agreeTerms)} activeOpacity={0.7}>
              <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                {agreeTerms && <CheckIcon />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} activeOpacity={0.8} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupBtnText}>Create Account</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9f5ee" },
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 },
  closeBtn: { alignSelf: 'flex-end', padding: 4, marginBottom: 8 },

  brand: { alignItems: "center", marginBottom: 32, gap: 10 },
  title: { fontSize: 26, fontFamily: F.display, color: "#1a1a1a" },
  subtitle: { fontSize: 14, fontFamily: F.regular, color: "#6b7280" },

  googleBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    backgroundColor: "#ffffff", borderRadius: 12, paddingVertical: 14,
    borderWidth: 1, borderColor: "#e5e3e1",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    marginBottom: 20,
  },
  googleBtnText: { fontSize: 14, fontFamily: F.semiBold, color: "#1a1a1a" },

  divider: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e5e3e1" },
  dividerText: { fontSize: 12, fontFamily: F.regular, color: "#9ca3af" },

  form: { gap: 14, marginBottom: 24 },
  inputWrap: { position: "relative", justifyContent: "center" },
  iconLeft: { position: "absolute", left: 14, zIndex: 1 },
  iconRight: { position: "absolute", right: 14, zIndex: 1 },
  input: {
    paddingVertical: 14, paddingLeft: 44, paddingRight: 44,
    borderRadius: 12, backgroundColor: "#ffffff",
    fontSize: 14, fontFamily: F.regular, color: "#1a1a1a",
    borderWidth: 1, borderColor: "#e5e3e1",
  },

  termsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 2,
    borderColor: "#e5e3e1", justifyContent: "center", alignItems: "center", backgroundColor: "#fff",
  },
  checkboxActive: { backgroundColor: "#1d5152", borderColor: "#1d5152" },
  termsText: { flex: 1, fontSize: 13, fontFamily: F.regular, color: "#4b5563" },
  termsLink: { fontFamily: F.semiBold, color: "#1d5152" },

  signupBtn: {
    backgroundColor: "#1d5152", borderRadius: 999, paddingVertical: 15,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#1d5152", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  signupBtnText: { fontSize: 16, fontFamily: F.bold, color: "#ffffff" },

  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6 },
  footerText: { fontSize: 14, fontFamily: F.regular, color: "#6b7280" },
  footerLink: { fontSize: 14, fontFamily: F.bold, color: "#1d5152" },
});
