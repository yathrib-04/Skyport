import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './components/LandingPage';
import SignUpScreen from './components/auth pages/SignUpScreen';
import SignInScreen from './components/auth pages/SignInScreen';
import VerifyOtpScreen from './components/auth pages/VerifyOtpScreen';
import CarrierDashboard from './components/carrier/CarrierDashboard';
import SenderDashboard from './components/sender/senderDashboard';
import ReceiverDashboard from './components/receiver/ReceiverDashboard';
import SupportChat from './components/ChatScreen';
import AgentDashboard from './components/agent/AgentChat';
import { AuthProvider, AuthContext } from './components/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import CarrierProfileScreen from './components/carrier/CarrierProfileScreen';

const Stack = createNativeStackNavigator();
function AppNavigator() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFB733" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          {user.role === 'carrier' && (
  <>
    <Stack.Screen name="CarrierDashboard" component={CarrierDashboard} />
    <Stack.Screen name="CarrierProfile" component={CarrierProfileScreen} />
  </>
)}
          {user.role === 'sender' && (
            <Stack.Screen name="SenderDashboard" component={SenderDashboard} />
          )}
          {user.role === 'receiver' && (
            <Stack.Screen name="ReceiverDashboard" component={ReceiverDashboard} />
          )}
          {user.role === 'agent' && (
            <Stack.Screen name="AgentDashboard" component={AgentDashboard} />
          )}
          <Stack.Screen name="SupportChat" component={SupportChat} />
        </>
      ) : (
        <>
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
