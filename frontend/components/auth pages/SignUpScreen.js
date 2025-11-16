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
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Header from '../Header';
const COLORS = {
  BACKGROUND_LIGHT: '#F7F8FC',      
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#333333',
  TEXT_LIGHT: '#FFFFFF',
  INPUT_BG: 'rgba(45, 75, 70, 0.05)',
  CARD_BG: '#FFFFFF',               
};
export default function SignUpScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
const handleSignUp = async () => {
  if (!fullName || !email || !password || !phone || !nationalID || !role) {
    Alert.alert('Missing Information', 'Please fill in all fields before signing up.');
    return;
  }

  setLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, phone, nationalID, role }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Registration successful:', data);
      navigation.navigate('VerifyOtp', { phone });
    } else {
      console.error('Registration failed:', data.message || data);
      Alert.alert('Error', data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error registering:', error);
    Alert.alert('Error', 'An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <LinearGradient colors={[COLORS.BACKGROUND_LIGHT, COLORS.BACKGROUND_LIGHT]} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header />
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the SwiftLink network</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999" 
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="National ID"
              placeholderTextColor="#999"
              value={nationalID}
              onChangeText={setNationalID}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={[styles.pickerContainer, styles.input]}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
                dropdownIconColor={COLORS.ACCENT_GOLD}
              >
                <Picker.Item label="Select Role" value="" color="#999" />
                <Picker.Item label="Carrier" value="carrier" color={COLORS.TEXT_DARK} />
                <Picker.Item label="Sender" value="sender" color={COLORS.TEXT_DARK} />
                <Picker.Item label="Receiver" value="receiver" color={COLORS.TEXT_DARK} />
              </Picker>
            </View>
<TouchableOpacity
  style={[styles.signUpBtn, loading && { opacity: 0.6 }]}
  onPress={handleSignUp}
  disabled={loading} 
>
  <Text style={styles.signUpText}>
    {loading ? 'Signing Up...' : 'Sign Up'}
  </Text>
</TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.link}> Sign In</Text>
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
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
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
    marginBottom: 20
  },
  title: {
    color: COLORS.TEXT_DARK, 
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5
  },
  subtitle: {
    color: '#888', 
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 10,
    padding: 15,
    color: COLORS.TEXT_DARK,
    marginBottom: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(45, 75, 70, 0.1)',
  },
  pickerContainer: {
    height: 50,
    padding: 0,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: COLORS.TEXT_DARK,
    height: 50,
  },
  signUpBtn: {
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
  signUpText: {
    color: COLORS.BACKGROUND_DARK, 
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25
  },
  footerText: {
    color: COLORS.TEXT_DARK
  },
  link: {
    color: COLORS.ACCENT_GOLD, 
    fontWeight: 'bold'
  },
});