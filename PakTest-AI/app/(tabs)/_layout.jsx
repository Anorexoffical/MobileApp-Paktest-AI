import { Tabs } from 'expo-router';
import { Dimensions, Platform, View, Image, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { useAuth } from '../../context/AuthProvider';

const { width } = Dimensions.get('window');
const s = (n) => Math.round((width / 375) * n);

const HomeIcon = ({ color }) => (
  <Svg width={s(24)} height={s(24)} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.8042 21.0208 20.4125 21.4125C20.0208 21.8042 19.55 22 19 22H15V16H9V22H5C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V9.5Z" fill={color} />
  </Svg>
);

const TestIcon = ({ color }) => (
  <Svg width={s(24)} height={s(24)} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4H14L20 10V20C20 21.1 19.1 22 18 22H4C2.9 22 2 21.1 2 20V6C2 4.9 2.9 4 4 4ZM13 5.5V11H18.5L13 5.5ZM7 13V15H17V13H7ZM7 17V19H14V17H7Z" fill={color} />
  </Svg>
);

function ProfileTabIcon({ color, focused }) {
  const { user, getUserAvatar, getUserName } = useAuth();
  const avatar = getUserAvatar();
  const name = getUserName();
  const initials = name?.charAt(0)?.toUpperCase() || 'A';

  if (!user) {
    // Guest — plain icon
    return (
      <Svg width={s(24)} height={s(24)} viewBox="0 0 24 24" fill="none">
        <Path d="M12 12C13.1 12 14.0417 11.6083 14.825 10.825C15.6083 10.0417 16 9.1 16 8C16 6.9 15.6083 5.95833 14.825 5.175C14.0417 4.39167 13.1 4 12 4C10.9 4 9.95833 4.39167 9.175 5.175C8.39167 5.95833 8 6.9 8 8C8 9.1 8.39167 10.0417 9.175 10.825C9.95833 11.6083 10.9 12 12 12ZM4 20V17.2C4 16.65 4.14167 16.1458 4.425 15.6875C4.70833 15.2292 5.08333 14.875 5.55 14.625C6.55 14.1083 7.5625 13.7083 8.5875 13.425C9.6125 13.1417 10.7333 13 12 13C13.2667 13 14.3875 13.1417 15.4125 13.425C16.4375 13.7083 17.45 14.1083 18.45 14.625C18.9167 14.875 19.2917 15.2292 19.575 15.6875C19.8583 16.1458 20 16.65 20 17.2V20H4Z" fill={color} />
      </Svg>
    );
  }

  if (avatar) {
    return (
      <View style={[tabStyles.avatarRing, focused && tabStyles.avatarRingActive]}>
        <Image source={{ uri: avatar }} style={tabStyles.avatarImg} />
      </View>
    );
  }

  // Email login — initials avatar
  return (
    <View style={[tabStyles.initialsRing, focused && tabStyles.initialsRingActive]}>
      <Text style={tabStyles.initialsText}>{initials}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  avatarRing: {
    width: s(30), height: s(30), borderRadius: s(15),
    borderWidth: 2, borderColor: '#e5e3e1', overflow: 'hidden',
  },
  avatarRingActive: { borderColor: '#1d5152' },
  avatarImg: { width: '100%', height: '100%' },
  initialsRing: {
    width: s(30), height: s(30), borderRadius: s(15),
    backgroundColor: '#1d5152', borderWidth: 2, borderColor: '#e5e3e1',
    justifyContent: 'center', alignItems: 'center',
  },
  initialsRingActive: { borderColor: '#CAB3FF' },
  initialsText: { fontSize: s(12), color: '#fff', fontWeight: '700' },
});

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'Creolia':                   require('../../fonts/Creolia.ttf'),
    'PlusJakartaSans-Regular':   require('../../fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium':    require('../../fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-SemiBold':  require('../../fonts/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-Bold':      require('../../fonts/PlusJakartaSans-Bold.ttf'),
    'PlusJakartaSans-ExtraBold': require('../../fonts/PlusJakartaSans-ExtraBold.ttf'),
    'PlusJakartaSans-Light':     require('../../fonts/PlusJakartaSans-Light.ttf'),
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#fff' }} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1d5152',
        tabBarInactiveTintColor: '#76777D',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E6E8EA',
          borderTopWidth: 1,
          height: Platform.OS === 'android' ? s(60) : 84,
          paddingBottom: Platform.OS === 'android' ? s(8) : 28,
          paddingTop: s(8),
        },
        tabBarLabelStyle: {
          fontSize: s(11),
          fontFamily: 'PlusJakartaSans-SemiBold',
        },
      }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Home',      tabBarIcon: ({ color }) => <HomeIcon color={color} /> }} />
      <Tabs.Screen name="yourtest" options={{ title: 'Your Test', tabBarIcon: ({ color }) => <TestIcon color={color} /> }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profile',   tabBarIcon: ({ color, focused }) => <ProfileTabIcon color={color} focused={focused} /> }} />
    </Tabs>
  );
}
