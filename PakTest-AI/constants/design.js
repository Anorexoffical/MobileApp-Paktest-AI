import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

// Responsive scale
export const rs = (n) => Math.round((width / 375) * n);

// Screen dimensions
export const W = width;
export const H = height;

// Colors
export const C = {
  primary:      "#3980F4",
  primaryDark:  "#004395",
  primaryLight: "#D8E2FF",
  accent:       "#6CF8BB",
  success:      "#00714D",
  dark:         "#131B2E",
  text:         "#191C1E",
  textInvert:   "#FFFFFF",
  textSub:      "#45464D",
  textMuted:    "#76777D",
  textDim:      "#7C839B",
  surface:      "#FFFFFF",
  subtle:       "#F2F4F6",
  muted:        "#E0E3E5",
  border:       "#C6C6CD",
  borderLight:  "#E6E8EA",
  bg:           "#F7F9FB",
};

// Typography
export const T = {
  display:  { fontSize: rs(26), fontWeight: "700", lineHeight: rs(34) },
  heading:  { fontSize: rs(20), fontWeight: "700" },
  title:    { fontSize: rs(17), fontWeight: "600" },
  sub:      { fontSize: rs(15), fontWeight: "600" },
  label:    { fontSize: rs(14), fontWeight: "500" },
  body:     { fontSize: rs(13), lineHeight: rs(20) },
  caption:  { fontSize: rs(12) },
  overline: { fontSize: rs(11), fontWeight: "700", letterSpacing: 0.6 },
};

// Spacing
export const S = {
  xs:   rs(4),
  sm:   rs(8),
  md:   rs(12),
  base: rs(16),
  lg:   rs(20),
  xl:   rs(28),
  xxl:  rs(40),
};

// Border radii
export const R = {
  sm:   rs(6),
  md:   rs(10),
  lg:   rs(14),
  xl:   rs(20),
  pill: rs(999),
};

// Shared layout styles (used via shared.xxx)
export const shared = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  scroll:      { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: S.base, paddingVertical: rs(12),
    borderBottomWidth: 1, borderBottomColor: C.borderLight, backgroundColor: C.bg,
  },
  backBtn:     { width: rs(40), height: rs(40), justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: rs(17), fontWeight: "700", color: C.text, textAlign: "center" },
  heroCard: {
    backgroundColor: C.dark, borderRadius: R.xl,
    padding: S.xl, overflow: "hidden", gap: S.sm,
  },
  heroBubble1: {
    position: "absolute", right: -48, top: -48,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: C.accent, opacity: 0.08,
  },
  heroBubble2: {
    position: "absolute", right: 60, bottom: -20,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: C.primary, opacity: 0.15,
  },
  chip: {
    alignSelf: "flex-start", backgroundColor: C.accent,
    borderRadius: R.pill, paddingHorizontal: rs(12), paddingVertical: rs(4),
  },
  chipText: { color: C.success, fontSize: rs(10), fontWeight: "700", letterSpacing: 0.6 },
});
