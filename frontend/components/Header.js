import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const logoImage = require('../assets/logo.png');

const COLORS = {
  BACKGROUND_LIGHT: '#F4F7FB',
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#2C3E50',
};

const isWeb = Platform.OS === 'web';

export default function Header() {
  const navigation = useNavigation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { label: 'HOME', route: 'Landing' },
    { label: 'SIGN UP', route: 'SignUp' },
    { label: 'LOGIN', route: 'SignIn' },
  ];

  return (
    <View style={styles.header}>
      <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />

      <View style={styles.nav}>
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.route)}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Text
              style={[
                styles.navItemDark,
                hoveredItem === index && isWeb && { color: COLORS.ACCENT_GOLD },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: isWeb ? 60 : 20,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderBottomWidth: isWeb ? 1 : 0,
    borderBottomColor: isWeb ? '#E0E0E0' : 'transparent',
  },
  logoImage: { width: isWeb ? 100 : 80, height: isWeb ? 100 : 80, borderRadius: 128 },
  nav: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginLeft: 'auto' },
  navItemDark: {
    color: COLORS.TEXT_DARK,
    marginHorizontal: isWeb ? 15 : 8,
    fontSize: isWeb ? 15 : 14,
    fontWeight: '500',
    marginVertical: 5,
    cursor: isWeb ? 'pointer' : 'default',
    transition: isWeb ? 'color 0.2s ease' : undefined,
  },
});
