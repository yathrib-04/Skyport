import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
const COLORS = {
  BACKGROUND_LIGHT: '#F7F8FC',      
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#333333',
  TEXT_LIGHT: '#FFFFFF',
  INPUT_BG: 'rgba(45, 75, 70, 0.05)',
  CARD_BG: '#FFFFFF',               
  STATUS_GREEN: '#4CAF50',
};

export default function VerifyOtpScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { phone } = route.params || {};
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
  if (!otp) {
    Alert.alert('Error', 'Please enter the OTP');
    return;
  }

  setLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/otp/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await response.json();

    if (response.ok) {
      Alert.alert('Success', data.message || 'OTP verified successfully');
      navigation.navigate('SignIn');
    } else {
      Alert.alert('Error', data.message || 'OTP verification failed');
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  } finally {
    setLoading(false); 
  }
};

  return (
    <LinearGradient 
      colors={[COLORS.BACKGROUND_LIGHT, COLORS.BACKGROUND_LIGHT]} 
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.logo}>SwiftLink</Text>
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {phone || 'your phone number'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="#999" 
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
<TouchableOpacity
  style={[styles.verifyBtn, loading && { opacity: 0.6 }]}
  onPress={handleVerifyOtp}
  disabled={loading} 
>
  <Text style={styles.verifyText}>{loading ? 'Verifying...' : 'Verify'}</Text>
</TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Didn’t receive the code?</Text>
              <TouchableOpacity onPress={() => Alert.alert('Info', 'Resend feature coming soon!')}>
                <Text style={styles.link}> Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND_LIGHT },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  card: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    color: COLORS.ACCENT_GOLD,
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: COLORS.TEXT_DARK,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
    lineHeight: 22,
  },
  input: {
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 10,
    padding: 15,
    color: COLORS.TEXT_DARK, 
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 4,
    fontSize: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(45, 75, 70, 0.1)',
  },
  verifyBtn: {
    backgroundColor: COLORS.ACCENT_GOLD, 
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: COLORS.ACCENT_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  verifyText: {
    color: COLORS.BACKGROUND_DARK, 
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: { color: COLORS.TEXT_DARK, fontSize: 14 },
  link: { color: COLORS.ACCENT_GOLD, fontWeight: 'bold', fontSize: 14 },
});
