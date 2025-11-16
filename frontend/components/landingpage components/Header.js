import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../theme/colors';

const isWeb = Platform.OS === 'web';
const logoImage = require('../../assets/logo.png');

export default function Header({ onServicesPress, onAboutPress }) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
      <View style={styles.nav}>
        <TouchableOpacity onPress={onServicesPress}>
          <Text style={styles.navItemDark}>SERVICES</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAboutPress}>
          <Text style={styles.navItemDark}>ABOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.getStartedBtn}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 10,
    paddingHorizontal: isWeb ? 60 : 20,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderBottomWidth: isWeb ? 1 : 0, 
    borderBottomColor: '#E0E0E0',
  },
  logoImage: { width: isWeb ? 100 : 80, height: isWeb ? 100 : 80, borderRadius: 128 },
  nav: { flexDirection: 'row', alignItems: 'center' },
  navItemDark: { color: COLORS.TEXT_DARK, marginHorizontal: 15, fontSize: 15, fontWeight: '600' },
  getStartedBtn: { 
    backgroundColor: COLORS.ACCENT_GOLD, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    marginLeft: 20, 
    shadowColor: COLORS.ACCENT_GOLD, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 5, 
    elevation: 5 
  },
  getStartedText: { color: COLORS.BACKGROUND_DARK, fontWeight: 'bold', fontSize: 16 },
});
