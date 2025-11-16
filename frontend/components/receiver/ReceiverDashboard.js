import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  Modal, 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardHeader from '../dashboardheader';
import { AuthContext } from '../context/AuthContext';

const COLORS = {
  BACKGROUND_LIGHT: '#F7F8FC',
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#333333',
  TEXT_LIGHT: '#FFFFFF',
  CARD_BG: '#FFFFFF',
  SECONDARY_TEXT: '#888',
  SUCCESS: '#4CAF50',
  WARNING: '#FFC107',
  INFO: '#17A2B8',
  DANGER: '#DC3545',
  INPUT_BG: 'rgba(45, 75, 70, 0.05)', 
};
<DashboardHeader />
const SidebarLink = ({ text, isActive, onPress }) => (
  <TouchableOpacity
    style={[
      styles.sidebarLink,
      isActive && styles.activeSidebarLink,
    ]}
    onPress={onPress}
  >
    <Text style={[styles.sidebarText, isActive && styles.activeSidebarText]}>
      {text}
    </Text>
  </TouchableOpacity>
);

const getStatusStyle = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
    case 'REQUESTED':
      return { color: COLORS.WARNING };
    case 'ACCEPTED':
    case 'IN_TRANSIT':
      return { color: COLORS.INFO };
    case 'DELIVERED':
      return { color: COLORS.SUCCESS };
    case 'CANCELLED':
      return { color: COLORS.DANGER };
    default:
      return { color: COLORS.SECONDARY_TEXT };
  }
};
const ConfirmDeliveryModal = ({ isVisible, onClose, onConfirm, shipment }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Confirm Delivery</Text>
          <Text style={modalStyles.modalText}>
            Are you sure you want to confirm receipt for shipment:
          </Text>
          <Text style={modalStyles.trackingCodeText}>
            {shipment?.trackingCode || 'N/A'}?
          </Text>
          <Text style={modalStyles.modalText}>
            This action will release payment to the sender.
          </Text>

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={modalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.confirmButton]}
              onPress={() => onConfirm(shipment)}
            >
              <Text style={modalStyles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default function ReceiverDashboard() {
  const navigation = useNavigation();
  const { user, token } = useContext(AuthContext);

  const [activeMenu, setActiveMenu] = useState('TRACK');
  const [trackingCode, setTrackingCode] = useState('');
  const [shipmentDetails, setShipmentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [shipmentToConfirm, setShipmentToConfirm] = useState(null);
  const handleTrackShipment = useCallback(async () => {
    if (!trackingCode.trim()) {
      return Alert.alert('Missing Code', 'Please enter a tracking code.');
    }
    setIsLoading(true);
    setShipmentDetails(null);
    try {
      const res = await fetch(`http://localhost:5000/api/receiver/track/${trackingCode.trim()}`);
      const data = await res.json();
      if (res.ok) {
        setShipmentDetails(data);
      } else {
        Alert.alert('Tracking Failed', data.message || 'Could not find shipment. Please check the code.');
        setShipmentDetails(null);
      }
    } catch (err) {
      console.error('Tracking network error:', err);
      Alert.alert('Network Error', 'Something went wrong. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [trackingCode]);
  const showConfirmationModal = (shipment) => {
    setShipmentToConfirm(shipment);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmDelivery = async (shipment) => {
    setIsConfirmModalVisible(false); 
    
    if (!shipment) {
      Alert.alert("Error", "No shipment selected for confirmation.");
      return;
    }

    try {
      setIsLoading(true);
      const API_BASE = "http://localhost:5000";
      const trackingCode = shipment?.trackingCode;

      console.log("Sending confirmation request for:", trackingCode);

      const res = await fetch(`${API_BASE}/api/receiver/confirm/${trackingCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("Confirm delivery response:", data);

      if (res.ok) {
        Alert.alert(`Success`, `✅ Payment released: $${data.amountReleased}`);
        setShipmentDetails(prevDetails => ({
            ...prevDetails,
            ...data.shipment
        }));
      } else {
        Alert.alert(`Error`, `❌ ${data.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Confirm delivery error:", err);
      Alert.alert("Network Error", "⚠️ Network or server error");
    } finally {
      setIsLoading(false);
      setShipmentToConfirm(null); 
    }
  };

  const TrackingResultCard = ({ shipment }) => {
    if (!shipment) return null;

    const flight = shipment?.flight || {};
    const sender = shipment?.sender || {};
    const carrier = shipment?.carrier || {};

    const flightDate = flight?.departureDate
      ? new Date(flight.departureDate).toLocaleString()
      : "Not Available";

    const statusStyle = getStatusStyle(shipment.status);
    const isConfirmationDisabled = isLoading || shipment.status?.toUpperCase() === 'DELIVERED' || shipment.status?.toUpperCase() === 'CANCELLED';

    return (
      <View style={styles.resultCard}>
        <Text style={styles.cardHeader}>Shipment Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tracking Code:</Text>
          <Text style={styles.detailValue}>{shipment.trackingCode || "N/A"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Item Weight:</Text>
          <Text style={styles.detailValue}>
            {shipment.itemWeight ? `${shipment.itemWeight} kg` : "N/A"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Shipment Status:</Text>
          <Text
            style={[styles.detailValue, { fontWeight: "bold" }, statusStyle]}
          >
            {shipment.status?.toUpperCase().replace("_", " ") || "UNKNOWN"}
          </Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.cardSubHeader}>Flight Information</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Route:</Text>
          <Text style={styles.detailValue}>
            {flight.from || "N/A"} → {flight.to || "N/A"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Departure:</Text>
          <Text style={styles.detailValue}>{flightDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Flight Status:</Text>
          <Text
            style={[styles.detailValue, getStatusStyle(flight?.status)]}
          >
            {flight?.status?.toUpperCase() || "UNKNOWN"}
          </Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.cardSubHeader}>Sender & Carrier</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Sender:</Text>
          <Text style={styles.detailValue}>
            {sender.fullName
              ? `${sender.fullName} (${sender.phone})`
              : "Unknown Sender"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Carrier:</Text>
          <Text style={styles.detailValue}>
            {carrier.fullName
              ? `${carrier.fullName} (${carrier.phone})`
              : "Unknown Carrier"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => showConfirmationModal(shipment)} 
          style={{
            backgroundColor: isConfirmationDisabled ? COLORS.SECONDARY_TEXT : COLORS.ACCENT_GOLD,
            padding: 10,
            borderRadius: 10,
            marginTop: 15,
            alignItems: "center",
          }}
          disabled={isConfirmationDisabled}
        >
          <Text
            style={{ color: COLORS.BACKGROUND_DARK, fontWeight: "bold" }}
          >
            {shipment.status?.toUpperCase() === 'DELIVERED' ? 'DELIVERY CONFIRMED' : 'Confirm Delivery'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <LinearGradient colors={[COLORS.BACKGROUND_LIGHT, COLORS.BACKGROUND_LIGHT]} style={styles.container}>
      <StatusBar barStyle="dark-content" />
       <DashboardHeader user={user} />
      <View style={styles.mainWrapper}>
        <View style={styles.sidebar}>
          {Platform.OS === 'web' ? (
            <View style={styles.profileContainer}>
              <View style={styles.profileImagePlaceholder} />
              <Text style={styles.profileName}>{user?.fullName || 'Receiver'}</Text>
<Text style={styles.profileEmail}>{user?.email || '---'}</Text>
            </View>
          ) : null}
          <SidebarLink text="TRACK DELIVERY" isActive={activeMenu === 'TRACK'} onPress={() => setActiveMenu('TRACK')} />
     <TouchableOpacity
  onPress={() => navigation.navigate('SupportChat', { userId: '68eca0dbcbe52ca522fe826d' })}

  style={{
    backgroundColor: "",
    padding: 0,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  }}
>
  <Text style={{ color: "white", fontWeight: "bold" }}>HELP</Text>
</TouchableOpacity>

        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.pageTitle}>Track Your Shipment</Text>
          <View style={styles.trackingArea}>
            <TextInput
              style={styles.trackingInput}
              placeholder="Enter Shipment Tracking Code"
              placeholderTextColor={COLORS.SECONDARY_TEXT}
              value={trackingCode}
              onChangeText={setTrackingCode}
              autoCapitalize="none"
              keyboardType="default"
            />
            <TouchableOpacity
              onPress={handleTrackShipment}
              style={styles.trackBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.BACKGROUND_DARK} />
              ) : (
                <Text style={styles.trackText}>Track Now</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20 }}>
            {shipmentDetails ? (
              <TrackingResultCard shipment={shipmentDetails} />
            ) : (
              !isLoading && (
                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>
                    Enter a valid tracking code above to check the status of your item.
                  </Text>
                </View>
              )
            )}
          </View>
          
        </ScrollView>
      </View>
      <ConfirmDeliveryModal 
        isVisible={isConfirmModalVisible} 
        onClose={() => setIsConfirmModalVisible(false)}
        onConfirm={handleConfirmDelivery}
        shipment={shipmentToConfirm}
      />
    </LinearGradient>
  );
}
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 15,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    color: COLORS.TEXT_DARK,
    fontSize: 14,
  },
  trackingCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.ACCENT_GOLD,
    marginBottom: 20,
    padding: 5,
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.SECONDARY_TEXT,
  },
  confirmButton: {
    backgroundColor: COLORS.ACCENT_GOLD,
  },
  cancelButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButtonText: {
    color: COLORS.BACKGROUND_DARK,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND_LIGHT },
  mainWrapper: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flex: 1
  },
  sidebar: {
    width: Platform.OS === 'web' ? 180 : '100%',
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingTop: Platform.OS === 'web' ? 50 : 20,
    paddingHorizontal: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    ...(Platform.OS !== 'web' && { height: 60, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10, borderBottomRightRadius: 0, borderTopRightRadius: 0 }),
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    ...(Platform.OS !== 'web' && { display: 'none' }),
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.ACCENT_GOLD,
  },
  profileName: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
  },
  sidebarLink: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  activeSidebarLink: {
    backgroundColor: COLORS.TEXT_LIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sidebarText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
    fontSize: 13,
    ...(Platform.OS !== 'web' && { fontSize: 10, textAlign: 'center' }),
  },
  activeSidebarText: {
    color: COLORS.BACKGROUND_DARK,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    marginVertical: 15,
  },
  content: {
    flexGrow: 1,
    padding: Platform.OS === 'web' ? 30 : 20, 
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 20,
  },
  trackingArea: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
    marginBottom: 30,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  trackingInput: {
    flex: Platform.OS === 'web' ? 1 : 0,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginRight: Platform.OS === 'web' ? 15 : 0,
    marginBottom: Platform.OS !== 'web' ? 10 : 0,
    borderWidth: 1,
    borderColor: '#eee',
    color: COLORS.TEXT_DARK,
  },
  trackBtn: {
    backgroundColor: COLORS.ACCENT_GOLD,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackText: {
    color: COLORS.BACKGROUND_DARK,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.BACKGROUND_DARK,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 15,
  },
  cardSubHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 10,
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.SECONDARY_TEXT,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.TEXT_DARK,
    textAlign: 'right',
    flexShrink: 1,
  },
  infoContainer: {
    backgroundColor: '#E6EAEB',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    color: COLORS.SECONDARY_TEXT,
    fontSize: 16,
    textAlign: 'center',
  }
});