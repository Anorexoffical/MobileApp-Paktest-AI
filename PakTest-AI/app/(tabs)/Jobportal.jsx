import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { F } from '../../constants/fonts';

const { width } = Dimensions.get('window');

const filters = ["All", "PPSC", "FPSC", "Teaching", "Medical"];

const jobs = [
  {
    id: 1,
    badge: { label: "2 DAYS LEFT", type: "closing" },
    org: { label: "PPSC", color: "ppsc" },
    title: "Lecturer Computer Science",
    department: "Higher Education Department",
    grade: "BPS-17",
    closing: "Oct 15, 2023",
    primaryBtn: { label: "Prepare with AI" },
    secondaryBtn: { label: "Ad", icon: "pdf" },
    match: 92,
  },
  {
    id: 2,
    badge: { label: "MATCHED FOR YOU", type: "matched" },
    org: { label: "FPSC", color: "fpsc" },
    title: "Assistant Director",
    department: "Federal Investigation Agency",
    grade: "BPS-17",
    closing: "Oct 22, 2023",
    primaryBtn: { label: "Prepare with AI" },
    secondaryBtn: { label: "Official Link", icon: "external" },
    match: 88,
  },
  {
    id: 3,
    badge: { label: "APPLIED", type: "applied" },
    org: { label: "PPSC", color: "ppsc" },
    title: "Medical Officer",
    department: "Primary & Secondary Health",
    grade: "BPS-17",
    closing: "Oct 30, 2023",
    primaryBtn: { label: "Application Submitted", disabled: true },
    secondaryBtn: { label: "Ad", icon: "pdf" },
    match: 0,
  },
];

// ==================== SVG Components ====================
const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#1d5152" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const BuildingIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 12 11" fill="none">
    <Path d="M0 10.5V0H5.83333V2.33333H11.6667V10.5H0ZM1.16667 9.33333H2.33333V8.16667H1.16667V9.33333ZM1.16667 7H2.33333V5.83333H1.16667V7ZM1.16667 4.66667H2.33333V3.5H1.16667V4.66667ZM1.16667 2.33333H2.33333V1.16667H1.16667V2.33333ZM3.5 9.33333H4.66667V8.16667H3.5V9.33333ZM3.5 7H4.66667V5.83333H3.5V7ZM3.5 4.66667H4.66667V3.5H3.5V4.66667ZM3.5 2.33333H4.66667V1.16667H3.5V2.33333ZM5.83333 9.33333H10.5V3.5H5.83333V4.66667H7V5.83333H5.83333V7H7V8.16667H5.83333V9.33333ZM8.16667 5.83333V4.66667H9.33333V5.83333H8.16667ZM8.16667 8.16667V7H9.33333V8.16667H8.16667Z" fill="#6b7280"/>
  </Svg>
);

const GradeIcon = () => (
  <Svg width="8" height="12" viewBox="0 0 6 12" fill="none">
    <Path d="M0 0H5.83333V4.57917C5.83333 4.80278 5.78472 5.00208 5.6875 5.17708C5.59028 5.35208 5.45417 5.49306 5.27917 5.6L3.20833 6.825L3.61667 8.16667H5.83333L4.025 9.45L4.725 11.6667L2.91667 10.2958L1.10833 11.6667L1.80833 9.45L0 8.16667H2.21667L2.625 6.825L0.554167 5.6C0.379167 5.49306 0.243056 5.35208 0.145833 5.17708C0.0486111 5.00208 0 4.80278 0 4.57917V0ZM1.16667 1.16667V4.57917L2.33333 5.27917V1.16667H1.16667ZM4.66667 1.16667H3.5V5.27917L4.66667 4.57917V1.16667Z" fill="#6b7280"/>
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 11 12" fill="none">
    <Path d="M1.16667 11.6667C0.845833 11.6667 0.571181 11.5524 0.342708 11.324C0.114236 11.0955 0 10.8208 0 10.5V2.33333C0 2.0125 0.114236 1.73785 0.342708 1.50937C0.571181 1.2809 0.845833 1.16667 1.16667 1.16667H1.75V0H2.91667V1.16667H7.58333V0H8.75V1.16667H9.33333C9.65417 1.16667 9.92882 1.2809 10.1573 1.50937C10.3858 1.73785 10.5 2.0125 10.5 2.33333V10.5C10.5 10.8208 10.3858 11.0955 10.1573 11.324C9.92882 11.5524 9.65417 11.6667 9.33333 11.6667H1.16667ZM1.16667 10.5H9.33333V4.66667H1.16667V10.5ZM1.16667 3.5H9.33333V2.33333H1.16667V3.5Z" fill="#6b7280"/>
  </Svg>
);

const BookmarkIcon = ({ filled }) => (
  <Svg width="16" height="18" viewBox="0 0 14 18" fill="none">
    <Path d="M0 18V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H12C12.55 0 13.0208 0.195833 13.4125 0.5875C13.8042 0.979167 14 1.45 14 2V18L7 15L0 18Z" fill={filled ? "#CAB3FF" : "#76777D"}/>
  </Svg>
);

const PDFIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 12 12" fill="none">
    <Path d="M4.08333 6.125H4.66667V4.95833H5.25C5.41528 4.95833 5.55382 4.90243 5.66563 4.79063C5.77743 4.67882 5.83333 4.54028 5.83333 4.375V3.79167C5.83333 3.62639 5.77743 3.48785 5.66563 3.37604C5.55382 3.26424 5.41528 3.20833 5.25 3.20833H4.08333V6.125ZM4.66667 4.375V3.79167H5.25V4.375H4.66667ZM6.41667 6.125H7.58333C7.74861 6.125 7.88715 6.0691 7.99896 5.95729C8.11076 5.84549 8.16667 5.70694 8.16667 5.54167V3.79167C8.16667 3.62639 8.11076 3.48785 7.99896 3.37604C7.88715 3.26424 7.74861 3.20833 7.58333 3.20833H6.41667V6.125ZM7 5.54167V3.79167H7.58333V5.54167H7ZM8.75 6.125H9.33333V4.95833H9.91667V4.375H9.33333V3.79167H9.91667V3.20833H8.75V6.125ZM3.5 9.33333C3.17917 9.33333 2.90451 9.2191 2.67604 8.99063C2.44757 8.76215 2.33333 8.4875 2.33333 8.16667V1.16667C2.33333 0.845833 2.44757 0.571181 2.67604 0.342708C2.90451 0.114236 3.17917 0 3.5 0H10.5C10.8208 0 11.0955 0.114236 11.324 0.342708C11.5524 0.571181 11.6667 0.845833 11.6667 1.16667V8.16667C11.6667 8.4875 11.5524 8.76215 11.324 8.99063C11.0955 9.2191 10.8208 9.33333 10.5 9.33333H3.5ZM3.5 8.16667H10.5V1.16667H3.5V8.16667ZM1.16667 11.6667C0.845833 11.6667 0.571181 11.5524 0.342708 11.324C0.114236 11.0955 0 10.8208 0 10.5V2.33333H1.16667V10.5H9.33333V11.6667H1.16667Z" fill="#1d5152"/>
  </Svg>
);

const ExternalLinkIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 11 11" fill="none">
    <Path d="M1.16667 10.5C0.845833 10.5 0.571181 10.3858 0.342708 10.1573C0.114236 9.92882 0 9.65417 0 9.33333V1.16667C0 0.845833 0.114236 0.571181 0.342708 0.342708C0.571181 0.114236 0.845833 0 1.16667 0H5.25V1.16667H1.16667V9.33333H9.33333V5.25H10.5V9.33333C10.5 9.65417 10.3858 9.92882 10.1573 10.1573C9.92882 10.3858 9.65417 10.5 9.33333 10.5H1.16667ZM3.90833 7.40833L3.09167 6.59167L8.51667 1.16667H6.41667V0H10.5V4.08333H9.33333V1.98333L3.90833 7.40833Z" fill="#1d5152"/>
  </Svg>
);

const AIIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path d="M8 13H10L10.15 11.75C10.2833 11.7 10.4042 11.6417 10.5125 11.575C10.6208 11.5083 10.7167 11.4333 10.8 11.35L11.95 11.85L12.95 10.15L11.95 9.4C11.9833 9.26667 12 9.13333 12 9C12 8.86667 11.9833 8.73333 11.95 8.6L12.95 7.85L11.95 6.15L10.8 6.65C10.7167 6.56667 10.6208 6.49167 10.5125 6.425C10.4042 6.35833 10.2833 6.3 10.15 6.25L10 5H8L7.85 6.25C7.71667 6.3 7.59583 6.35833 7.4875 6.425C7.37917 6.49167 7.28333 6.56667 7.2 6.65L6.05 6.15L5.05 7.85L6.05 8.6C6.01667 8.73333 6 8.86667 6 9C6 9.13333 6.01667 9.26667 6.05 9.4L5.05 10.15L6.05 11.85L7.2 11.35C7.28333 11.4333 7.37917 11.5083 7.4875 11.575C7.59583 11.6417 7.71667 11.7 7.85 11.75L8 13ZM9 10.5C8.58333 10.5 8.22917 10.3542 7.9375 10.0625C7.64583 9.77083 7.5 9.41667 7.5 9C7.5 8.58333 7.64583 8.22917 7.9375 7.9375C8.22917 7.64583 8.58333 7.5 9 7.5C9.41667 7.5 9.77083 7.64583 10.0625 7.9375C10.3542 8.22917 10.5 8.58333 10.5 9C10.5 9.41667 10.3542 9.77083 10.0625 10.0625C9.77083 10.3542 9.41667 10.5 9 10.5ZM3 20V15.7C2.05 14.8333 1.3125 13.8208 0.7875 12.6625C0.2625 11.5042 0 10.2833 0 9C0 6.5 0.875 4.375 2.625 2.625C4.375 0.875 6.5 0 9 0C11.0833 0 12.9292 0.6125 14.5375 1.8375C16.1458 3.0625 17.1917 4.65833 17.675 6.625L18.975 11.75C19.0583 12.0667 19 12.3542 18.8 12.6125C18.6 12.8708 18.3333 13 18 13H16V16C16 16.55 15.8042 17.0208 15.4125 17.4125C15.0208 17.8042 14.55 18 14 18H12V20H3Z" fill="#CAB3FF"/>
  </Svg>
);

const SearchIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#6b7280"/>
  </Svg>
);

const ClockIcon = () => (
  <Svg width="11" height="10" viewBox="0 0 11 10" fill="none">
    <Path d="M5.325 9.825C4.7 9.825 4.11458 9.70625 3.56875 9.46875C3.02292 9.23125 2.54792 8.91042 2.14375 8.50625C1.73958 8.10208 1.41875 7.62708 1.18125 7.08125C0.94375 6.53542 0.825 5.95 0.825 5.325C0.825 4.7 0.94375 4.11458 1.18125 3.56875C1.41875 3.02292 1.73958 2.54792 2.14375 2.14375C2.54792 1.73958 3.02292 1.41875 3.56875 1.18125C4.11458 0.94375 4.7 0.825 5.325 0.825C5.95 0.825 6.53542 0.94375 7.08125 1.18125C7.62708 1.41875 8.10208 1.73958 8.50625 2.14375C8.91042 2.54792 9.23125 3.02292 9.46875 3.56875C9.70625 4.11458 9.825 4.7 9.825 5.325C9.825 5.95 9.70625 6.53542 9.46875 7.08125C9.23125 7.62708 8.91042 8.10208 8.50625 8.50625C8.10208 8.91042 7.62708 9.23125 7.08125 9.46875C6.53542 9.70625 5.95 9.825 5.325 9.825ZM6.725 7.425L7.425 6.725L5.825 5.125V2.825H4.825V5.525L6.725 7.425ZM2.125 0L2.825 0.7L0.7 2.825L0 2.125L2.125 0ZM8.525 0L10.65 2.125L9.95 2.825L7.825 0.7L8.525 0ZM5.325 8.825C6.3 8.825 7.12708 8.48542 7.80625 7.80625C8.48542 7.12708 8.825 6.3 8.825 5.325C8.825 4.35 8.48542 3.52292 7.80625 2.84375C7.12708 2.16458 6.3 1.825 5.325 1.825C4.35 1.825 3.52292 2.16458 2.84375 2.84375C2.16458 3.52292 1.825 4.35 1.825 5.325C1.825 6.3 2.16458 7.12708 2.84375 7.80625C3.52292 8.48542 4.35 8.825 5.325 8.825Z" fill="#EF4444"/>
  </Svg>
);

const CheckIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <Path d="M4.3 7.3L7.825 3.775L7.125 3.075L4.3 5.9L2.875 4.475L2.175 5.175L4.3 7.3ZM5 10C4.30833 10 3.65833 9.86875 3.05 9.60625C2.44167 9.34375 1.9125 8.9875 1.4625 8.5375C1.0125 8.0875 0.65625 7.55833 0.39375 6.95C0.13125 6.34167 0 5.69167 0 5C0 4.30833 0.13125 3.65833 0.39375 3.05C0.65625 2.44167 1.0125 1.9125 1.4625 1.4625C1.9125 1.0125 2.44167 0.65625 3.05 0.39375C3.65833 0.13125 4.30833 0 5 0C5.69167 0 6.34167 0.13125 6.95 0.39375C7.55833 0.65625 8.0875 1.0125 8.5375 1.4625C8.9875 1.9125 9.34375 2.44167 9.60625 3.05C9.86875 3.65833 10 4.30833 10 5C10 5.69167 9.86875 6.34167 9.60625 6.95C9.34375 7.55833 8.9875 8.0875 8.5375 8.5375C8.0875 8.9875 7.55833 9.34375 6.95 9.60625C6.34167 9.86875 5.69167 10 5 10Z" fill="#6b7280"/>
  </Svg>
);

const StarIcon = () => (
  <Svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <Path d="M3.8 10.5L2.85 8.9L1.05 8.5L1.225 6.65L0 5.25L1.225 3.85L1.05 2L2.85 1.6L3.8 0L5.5 0.725L7.2 0L8.15 1.6L9.95 2L9.775 3.85L11 5.25L9.775 6.65L9.95 8.5L8.15 8.9L7.2 10.5L5.5 9.775L3.8 10.5ZM4.225 9.225L5.5 8.675L6.8 9.225L7.5 8.025L8.875 7.7L8.75 6.3L9.675 5.25L8.75 4.175L8.875 2.775L7.5 2.475L6.775 1.275L5.5 1.825L4.2 1.275L3.5 2.475L2.125 2.775L2.25 4.175L1.325 5.25L2.25 6.3L2.125 7.725L3.5 8.025L4.225 9.225ZM4.975 7.025L7.8 4.2L7.1 3.475L4.975 5.6L3.9 4.55L3.2 5.25L4.975 7.025Z" fill="white"/>
  </Svg>
);

const SparkleIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" fill="#CAB3FF" opacity="0.6"/>
  </Svg>
);

// ==================== Badge Components ====================
const ClosingSoonBadge = () => (
  <View style={styles.closingBadge}>
    <View style={styles.closingBadgeInner}>
      <ClockIcon />
      <Text style={styles.closingBadgeText}>2 DAYS LEFT</Text>
    </View>
  </View>
);

const MatchedBadge = () => (
  <View style={styles.matchedBadge}>
    <StarIcon />
    <Text style={styles.matchedBadgeText}>MATCHED FOR YOU</Text>
  </View>
);

const AppliedBadge = () => (
  <View style={styles.appliedBadge}>
    <CheckIcon />
    <Text style={styles.appliedBadgeText}>APPLIED</Text>
  </View>
);

const OrgBadge = ({ label, color }) => {
  if (color === "ppsc") {
    return (
      <View style={styles.orgBadgePPSC}>
        <Text style={styles.orgBadgeTextPPSC}>{label}</Text>
      </View>
    );
  }
  return (
    <View style={styles.orgBadgeFPSC}>
      <Text style={styles.orgBadgeTextFPSC}>{label}</Text>
    </View>
  );
};

// ==================== AI Smart Match Banner ====================
const AISmartMatchBanner = () => (
  <View style={styles.aiBanner}>
    <View style={styles.aiBannerGradient} />
    <View style={styles.aiBannerContent}>
      <View style={styles.aiBannerHeader}>
        <AIIcon />
        <Text style={styles.aiBannerLabel}>AI SMART MATCH</Text>
      </View>
      <Text style={styles.aiBannerTitle}>Perfect Match Found!</Text>
      <Text style={styles.aiBannerDescription}>
        Our AI analyzed your profile. You are a 92% match for 4 recent PPSC Lecturer positions.
      </Text>
      <View style={styles.aiBannerMatchRow}>
        <View style={styles.aiMatchCircle}>
          <Text style={styles.aiMatchText}>92%</Text>
        </View>
        <View style={styles.aiMatchBar}>
          <View style={[styles.aiMatchBarFill, { width: '92%' }]} />
        </View>
      </View>
      <TouchableOpacity style={styles.aiBannerButton}>
        <Text style={styles.aiBannerButtonText}>View All Matches →</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ==================== Job Card Component ====================
const JobCard = ({ job, showAIBanner }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <View style={styles.jobCard}>
        <View style={styles.jobCardHeader}>
          <View style={styles.jobCardTop}>
            <OrgBadge label={job.org.label} color={job.org.color} />
            {job.badge.type === "closing" && <ClosingSoonBadge />}
            {job.badge.type === "matched" && <MatchedBadge />}
            {job.badge.type === "applied" && <AppliedBadge />}
          </View>
          <TouchableOpacity onPress={() => setBookmarked(!bookmarked)} style={styles.bookmarkButton}>
            <BookmarkIcon filled={bookmarked} />
          </TouchableOpacity>
        </View>

        <Text style={styles.jobTitle}>{job.title}</Text>

        <View style={styles.jobDetails}>
          <View style={styles.jobDetailRow}>
            <BuildingIcon />
            <Text style={styles.jobDetailText}>{job.department}</Text>
          </View>
          <View style={styles.jobDetailRow}>
            <GradeIcon />
            <Text style={styles.jobDetailText}>{job.grade}</Text>
          </View>
          <View style={styles.jobDetailRow}>
            <CalendarIcon />
            <Text style={styles.jobDetailText}>Closing: {job.closing}</Text>
          </View>
        </View>

        {job.match > 0 && (
          <View style={styles.matchRow}>
            <SparkleIcon />
            <Text style={styles.matchText}>AI Match: <Text style={styles.matchHighlight}>{job.match}%</Text></Text>
          </View>
        )}

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            disabled={job.primaryBtn.disabled}
            style={[styles.primaryButton, job.primaryBtn.disabled && styles.primaryButtonDisabled]}
          >
            <Text style={[styles.primaryButtonText, job.primaryBtn.disabled && styles.primaryButtonTextDisabled]}>
              {job.primaryBtn.label}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            {job.secondaryBtn.icon === "pdf" ? <PDFIcon /> : <ExternalLinkIcon />}
            <Text style={styles.secondaryButtonText}>{job.secondaryBtn.label}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.expandText}>{expanded ? 'Show Less' : 'View Details'}</Text>
          </TouchableOpacity>
          <View style={styles.footerBadge}>
            <View style={styles.footerDot} />
            <Text style={styles.footerText}>Posted 2 days ago</Text>
          </View>
        </View>

        {expanded && (
          <View style={styles.expandedContent}>
            <View style={styles.expandedDivider} />
            <Text style={styles.expandedText}>
              • 5 years experience required
            </Text>
            <Text style={styles.expandedText}>
              • Master's degree in relevant field
            </Text>
            <Text style={styles.expandedText}>
              • Application deadline: {job.closing}
            </Text>
          </View>
        )}
      </View>
      {showAIBanner && <AISmartMatchBanner />}
    </>
  );
};

// ==================== Main Component ====================
export default function JobPostings({ onBack }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f5ee" />
      <View style={styles.container}>
        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <View style={styles.titlePinkLine} />
              <Text style={styles.mainTitle}>Latest Job Postings</Text>
              <Text style={styles.subtitle}>Browse current openings from PPSC & FPSC</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchIconContainer}>
                <SearchIcon />
              </View>
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search by job title or department..."
                placeholderTextColor="#6b7280"
              />
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
                    {activeFilter === f && <View style={styles.filterPinkDot} />}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Job Feed */}
            <View style={styles.jobFeed}>
              {jobs.map((job, idx) => (
                <JobCard key={job.id} job={job} showAIBanner={idx === 1} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ==================== Styles ====================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f5ee',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f5ee',
  },
  backButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    maxWidth: 480,
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
    paddingBottom: 32,
    width: '100%',
  },
  titleSection: {
    flexDirection: 'column',
    gap: 4,
    paddingTop: 8,
    paddingBottom: 16,
    position: 'relative',
  },
  titlePinkLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#CAB3FF',
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: F.display,
    lineHeight: 32,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: F.regular,
    lineHeight: 22,
    color: '#6b7280',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -9 }],
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    paddingVertical: 14,
    paddingLeft: 48,
    paddingRight: 16,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    fontSize: 15,
    fontFamily: F.regular,
    color: '#1a1a1a',
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
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    fontSize: 14,
    fontFamily: F.semiBold,
    lineHeight: 20,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  filterChipTextInactive: {
    color: '#4b5563',
  },
  filterPinkDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CAB3FF',
  },
  jobFeed: {
    flexDirection: 'column',
    gap: 16,
    paddingBottom: 16,
  },
  jobCard: {
    flexDirection: 'column',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e3e1',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  jobCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  jobTitle: {
    color: '#1a1a1a',
    fontSize: 18,
    fontFamily: F.bold,
    lineHeight: 24,
  },
  bookmarkButton: {
    padding: 4,
    marginTop: 2,
  },
  jobDetails: {
    flexDirection: 'column',
    gap: 6,
    paddingTop: 4,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobDetailText: {
    color: '#4b5563',
    fontSize: 14,
    fontFamily: F.regular,
    lineHeight: 20,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  matchText: {
    fontSize: 12,
    fontFamily: F.regular,
    color: '#6b7280',
  },
  matchHighlight: {
    fontFamily: F.bold,
    color: '#CAB3FF',
  },
  closingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closingBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  closingBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontFamily: F.bold,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  matchedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#1d5152',
  },
  matchedBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontFamily: F.bold,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#e5e3e1',
  },
  appliedBadgeText: {
    color: '#4b5563',
    fontSize: 9,
    fontFamily: F.bold,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  orgBadgePPSC: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#f0f7f7',
    borderWidth: 1,
    borderColor: '#d5e0e0',
  },
  orgBadgeTextPPSC: {
    color: '#1d5152',
    fontSize: 10,
    fontFamily: F.bold,
    lineHeight: 15,
    letterSpacing: 0.5,
  },
  orgBadgeFPSC: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#f5f0ff',
    borderWidth: 1,
    borderColor: '#e5d9ff',
  },
  orgBadgeTextFPSC: {
    color: '#CAB3FF',
    fontSize: 10,
    fontFamily: F.bold,
    lineHeight: 15,
    letterSpacing: 0.5,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#1d5152',
    alignItems: 'center',
    shadowColor: '#1d5152',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: '#e5e3e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: F.semiBold,
    lineHeight: 20,
    textAlign: 'center',
  },
  primaryButtonTextDisabled: {
    color: '#6b7280',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#CAB3FF',
    shadowColor: '#CAB3FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontFamily: F.semiBold,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f9f5ee',
  },
  expandText: {
    fontSize: 13,
    fontFamily: F.semiBold,
    color: '#CAB3FF',
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1d5152',
  },
  footerText: {
    fontSize: 11,
    fontFamily: F.regular,
    color: '#6b7280',
  },
  expandedContent: {
    gap: 6,
    paddingTop: 8,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: '#f9f5ee',
    marginBottom: 4,
  },
  expandedText: {
    fontSize: 13,
    fontFamily: F.regular,
    color: '#4b5563',
    lineHeight: 20,
  },
  aiBanner: {
    flexDirection: 'column',
    gap: 4,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#1d5152',
    borderWidth: 1,
    borderColor: '#d5e0e0',
    shadowColor: '#1d5152',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  aiBannerGradient: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(202, 179, 255, 0.1)',
  },
  aiBannerContent: {
    flexDirection: 'column',
    gap: 6,
    position: 'relative',
    zIndex: 1,
  },
  aiBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiBannerLabel: {
    color: '#CAB3FF',
    fontSize: 11,
    fontFamily: F.bold,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  aiBannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: F.display,
    lineHeight: 28,
  },
  aiBannerDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: F.regular,
    lineHeight: 20,
    paddingVertical: 4,
  },
  aiBannerMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  aiMatchCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CAB3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiMatchText: {
    color: '#1a1a1a',
    fontSize: 12,
    fontFamily: F.bold,
  },
  aiMatchBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  aiMatchBarFill: {
    height: '100%',
    backgroundColor: '#CAB3FF',
    borderRadius: 3,
  },
  aiBannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    marginTop: 4,
    shadowColor: 'rgba(255,255,255,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  aiBannerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: F.semiBold,
    lineHeight: 20,
  },
});