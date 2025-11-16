import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const logoImage = require('../../assets/logo.png'); 
const COLORS = {
  BACKGROUND_DARK: '#FFFFFF',
  ACCENT_GOLD: '#FFB733',
  TEXT_LIGHT: '#2D4B46',
};
export default function CarrierHeader({ user }) {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SupportChat', { userId: user?._id })}
        >
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Landing')}
        >
          <Text style={styles.actionText}>🏠 Home</Text>
          
        </TouchableOpacity>
<TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CarrierProfile')}
        >
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={() => logout()} 
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.BACKGROUND_DARK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 128,
    marginRight: 10,
  },
  title: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginHorizontal: 10,
  },
  actionText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: COLORS.ACCENT_GOLD,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
  },
});
