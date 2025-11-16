import React, { useState, useEffect, useCallback,useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  FlatList,
  Alert,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import * as WebBrowser from 'expo-web-browser';
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
};
const screenWidth = Dimensions.get('window').width;
const contentPadding = 30;
const cardSpacing = 15;
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
const MemoizedShipmentModal = React.memo(({
  isModalVisible,
  setIsModalVisible,
  selectedFlight,
  itemWeight,
  setItemWeight,
  acceptorName,
  setAcceptorName,
  acceptorPhone,
  setAcceptorPhone,
  acceptorNationalID,
  setAcceptorNationalID,
  itemDescription,
  setItemDescription,
  isSubmitting,
  handleCreateShipment,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Shipment Request</Text>
          {selectedFlight && (
            <Text style={styles.modalSubtitle}>
              Flight: **{selectedFlight.from}** to **{selectedFlight.to}** (Max {selectedFlight.availableKg} kg)
            </Text>
          )}
          <ScrollView style={{ maxHeight: 400, width: '100%', paddingHorizontal: 10 }}>
            <Text style={styles.label}>Item Weight (Kg): **{itemWeight} kg**</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={selectedFlight ? selectedFlight.availableKg : 50}
              step={1}
              minimumTrackTintColor={COLORS.ACCENT_GOLD}
              maximumTrackTintColor="#ccc"
              thumbTintColor={COLORS.ACCENT_GOLD}
              value={itemWeight}
              onValueChange={setItemWeight}
            />
            <Text style={styles.sectionHeader}>Recipient Details (Item Acceptor)</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.SECONDARY_TEXT}
              value={acceptorName}
              onChangeText={setAcceptorName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={COLORS.SECONDARY_TEXT}
              value={acceptorPhone}
              onChangeText={setAcceptorPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="National ID (Required for verification)"
              placeholderTextColor={COLORS.SECONDARY_TEXT}
              value={acceptorNationalID}
              onChangeText={setAcceptorNationalID}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Item Description (Optional)"
              placeholderTextColor={COLORS.SECONDARY_TEXT}
              value={itemDescription}
              onChangeText={setItemDescription}
              multiline={true}
            />
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleCreateShipment}
              disabled={isSubmitting}
            >
              <Text style={styles.submitText}>
                {isSubmitting ? 'Submitting...' : `Pay & Request Shipment`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});
export default function SenderDashboard({ route }) {
  const navigation = useNavigation();
  const { user, token } = useContext(AuthContext);
  const [activeMenu, setActiveMenu] = useState('SHIPMENTS');
  const [flights, setFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [itemWeight, setItemWeight] = useState(5);
  const [acceptorName, setAcceptorName] = useState('');
  const [acceptorPhone, setAcceptorPhone] = useState('');
  const [acceptorNationalID, setAcceptorNationalID] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [points, setPoints] = useState(0);

  const fetchFlights = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/sender/flights', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setFlights(data);
      } else {
        console.error('Error fetching flights:', data.message);
      }
    } catch (err) {
      console.error('Network Error fetching flights:', err);
    }
  }, [token]);
  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]); 
  const resetForm = () => {
    setSelectedFlight(null);
    setItemWeight(5);
    setAcceptorName('');
    setAcceptorPhone('');
    setAcceptorNationalID('');
    setItemDescription('');
  };
  const handleCreateShipment = useCallback(async () => {
  if (!selectedFlight) return Alert.alert('Error', 'Please select a flight first.');
  if (!acceptorName || !acceptorPhone || !acceptorNationalID) {
    return Alert.alert('Missing Details', 'Recipient name, phone, and ID are required.');
  }
  if (itemWeight <= 0 || itemWeight > selectedFlight.availableKg) {
    return Alert.alert('Weight Error', 'Invalid weight or exceeds flight capacity.');
  }

  setIsSubmitting(true);

  try {
    const shipmentRes = await fetch('http://localhost:5000/api/sender/shipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        flightId: selectedFlight.id,
        itemWeight: parseFloat(itemWeight),
        acceptorName,
        acceptorPhone,
        acceptorNationalID,
        itemDescription,
      }),
    });

    const shipmentData = await shipmentRes.json();

    if (!shipmentRes.ok) {
      return Alert.alert('Error', shipmentData.message || 'Failed to create shipment.');
    }
    const paymentRes = await fetch('http://localhost:5000/api/payment/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipmentId: shipmentData.shipment.id,   
        amount: 50, 
        currency: 'ETB',
        customerName: 'Sender Name',
        customerEmail: 'sender@email.com',
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentRes.ok) {
      return Alert.alert('Error', paymentData.message || 'Payment initialization failed.');
    }
    if (paymentData.checkoutUrl) {
      await WebBrowser.openBrowserAsync(paymentData.checkoutUrl);
      Alert.alert('Payment Started', 'Please complete payment in the browser.');
    }

    setIsModalVisible(false);
    resetForm();
    fetchFlights();

  } catch (err) {
    console.error('Shipment creation error:', err);
    Alert.alert('Error', 'Something went wrong. Check your connection.');
  } finally {
    setIsSubmitting(false);
  }
}, [
  selectedFlight,
  itemWeight,
  acceptorName,
  acceptorPhone,
  acceptorNationalID,
  itemDescription,
  token,
  fetchFlights,
]);

  const openShipmentModal = (flight) => {
    setSelectedFlight(flight);
    setItemWeight(Math.min(5, flight.availableKg)); 
    setIsModalVisible(true);
  };
  const filteredFlights = flights.filter(f =>
    f.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.to.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const FlightCard = ({ item }) => {
    const isSelected = selectedFlight && selectedFlight.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.flightCard, isSelected && styles.selectedFlightCard]}
        onPress={() => openShipmentModal(item)}
      >
        <View style={styles.flightHeader}>
          <Text style={styles.flightRoute}>
            {item.from} → {item.to}
          </Text>
          <Text style={styles.flightCarrier}>
  {item.carrier.fullName} ({item.carrier.points ?? 0} ⭐)
</Text>

        </View>

        <View style={styles.flightDetails}>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Date:</Text> {new Date(item.departureDate).toLocaleString()}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Available KG:</Text>
            <Text style={styles.availableKg}>{item.availableKg} kg</Text>
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.flightStatusText}>{item.status.toUpperCase()}</Text>
          </Text>
        </View>
        <Text style={styles.selectPrompt}>{isSelected ? 'SELECTED' : 'SELECT FLIGHT'}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <LinearGradient colors={[COLORS.BACKGROUND_LIGHT, COLORS.BACKGROUND_LIGHT]} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DashboardHeader />
      <View style={styles.mainWrapper}>
        <View style={styles.sidebar}>
          <View style={styles.profileContainer}>
            <View style={styles.profileImagePlaceholder} />
             <Text style={styles.profileName}>{user?.fullName || 'Sender'}</Text>
            <Text style={styles.profileEmail}>{user?.email || '---'}</Text>
          </View>
          <SidebarLink text="DASHBOARD" isActive={activeMenu === 'DASHBOARD'} onPress={() => setActiveMenu('DASHBOARD')} />
           <TouchableOpacity
                     onPress={() => navigation.navigate('SupportChat', { userId: '68eca3cb4d9377eea1b91b46' })}
                   
                     style={{
                       backgroundColor: "",
                       padding: 2,
                       borderRadius: 8,
                       marginTop: 10,
                     }}
                   >
                     <Text style={{ color: "white", fontWeight: "bold" }}>HELP</Text>
                   </TouchableOpacity>
          <SidebarLink text="SETTINGS" isActive={activeMenu === 'SETTINGS'} onPress={() => setActiveMenu('SETTINGS')} />
        </View>
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Text style={styles.pageTitle}>Browse Available Flights</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by From or To location..."
              placeholderTextColor={COLORS.SECONDARY_TEXT}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity onPress={fetchFlights} style={styles.refreshBtn}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {filteredFlights.length === 0 ? (
            <View style={styles.noFlightsContainer}>
              <Text style={styles.noFlightsText}>
                {searchTerm ? `No flights found matching "${searchTerm}".` : 'No flights are currently available.'}
              </Text>
              <TouchableOpacity onPress={fetchFlights} style={styles.addBtn}>
                <Text style={styles.addText}>Try Refreshing</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredFlights}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <FlightCard item={item} />}
              contentContainerStyle={styles.flightList}
              columnWrapperStyle={styles.flightListRow}
              numColumns={Platform.OS === 'web' ? 3 : 1}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
      <MemoizedShipmentModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedFlight={selectedFlight}
        itemWeight={itemWeight}
        setItemWeight={setItemWeight}
        acceptorName={acceptorName}
        setAcceptorName={setAcceptorName}
        acceptorPhone={acceptorPhone}
        setAcceptorPhone={setAcceptorPhone}
        acceptorNationalID={acceptorNationalID}
        setAcceptorNationalID={setAcceptorNationalID}
        itemDescription={itemDescription}
        setItemDescription={setItemDescription}
        isSubmitting={isSubmitting}
        handleCreateShipment={handleCreateShipment}
      />
    </LinearGradient>
  );
}
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
    backgroundColor: COLORS.ACCENT_GOLD,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 10,
    ...(Platform.OS !== 'web' && { display: 'none' }),
  },
  content: {
    flexGrow: 1,
    padding: Platform.OS === 'web' ? contentPadding : 20,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 15,
  },
  topBar: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: Platform.OS === 'web' ? 1 : 0,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 10,
    padding: 12,
    marginRight: Platform.OS === 'web' ? 15 : 0,
    maxWidth: Platform.OS === 'web' ? 300 : '100%',
    marginVertical: Platform.OS !== 'web' ? 10 : 0,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  refreshBtn: {
    backgroundColor: COLORS.ACCENT_GOLD,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  refreshText: {
    color: COLORS.BACKGROUND_DARK,
    fontWeight: 'bold',
  },
  flightList: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  flightListRow: {
    justifyContent: Platform.OS === 'web' ? 'space-between' : 'center',
    marginBottom: cardSpacing,
  },
  flightCard: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 15,
    padding: 20,
    width: Platform.OS === 'web' ? (screenWidth - 180 - contentPadding * 2 - cardSpacing * 2) / 3 : '100%',
    minHeight: 150,
    marginRight: Platform.OS === 'web' ? cardSpacing : 0,
    marginBottom: Platform.OS !== 'web' ? cardSpacing : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
    justifyContent: 'space-between',
  },
  selectedFlightCard: {
    borderLeftColor: COLORS.ACCENT_GOLD,
    backgroundColor: '#FFFBEB',
  },
  flightHeader: {
    marginBottom: 10,
  },
  flightRoute: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 5,
  },
  flightCarrier: {
    fontSize: 12,
    color: COLORS.SECONDARY_TEXT,
  },
  flightDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.TEXT_DARK,
    marginBottom: 3,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: COLORS.SECONDARY_TEXT,
  },
  availableKg: {
    color: COLORS.SUCCESS,
    fontWeight: 'bold',
  },
  flightStatusText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  selectPrompt: {
    alignSelf: 'flex-end',
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.ACCENT_GOLD,
  },
  noFlightsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  noFlightsText: {
    fontSize: 18,
    color: COLORS.SECONDARY_TEXT,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: Platform.OS === 'web' ? '40%' : '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.SECONDARY_TEXT,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: COLORS.TEXT_DARK,
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 15,
  },
  label: {
    color: COLORS.BACKGROUND_DARK,
    marginBottom: 5,
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND_DARK,
    marginTop: 10,
    marginBottom: 15,
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ACCENT_GOLD,
    paddingBottom: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelBtn: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  cancelText: {
    color: COLORS.TEXT_DARK,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: COLORS.ACCENT_GOLD,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 2,
    shadowColor: COLORS.ACCENT_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitText: {
    color: COLORS.BACKGROUND_DARK,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: COLORS.BACKGROUND_DARK,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});