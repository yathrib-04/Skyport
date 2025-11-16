import React, { useState, useEffect,useContext } from 'react';
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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import DashboardHeader from '../dashboardheader';
import { AuthContext } from '../context/AuthContext';
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

const screenWidth = Dimensions.get('window').width;
const contentPadding = 20;
const cardSpacing = 15;
const summaryCardWidth = (screenWidth - 150 - contentPadding * 2 - cardSpacing * 3) / 4;

export default function CarrierDashboard({ route }) {
  const navigation = useNavigation();
  const { user, token } = useContext(AuthContext);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableKg, setAvailableKg] = useState(5);
  const [flights, setFlights] = useState([]);
  const [activeMenu, setActiveMenu] = useState('REPORTS'); 
  const [shipments, setShipments] = useState([]);
  const [points, setPoints] = useState(0);
  const [userInfo, setUserInfo] = useState({ fullName: '', email: '' });
  const [selectedFlight, setSelectedFlight] = useState(null);
const [datePickerVisible, setDatePickerVisible] = useState(false);


 useEffect(() => {
  if (route.params?.token) {
    setToken(route.params.token);
  }
  fetchFlights();
}, [route.params?.token]);

useEffect(() => {
  if (token) {
    fetchShipments();
    fetchUserPoints(); 
    const interval = setInterval(fetchShipments, 30000);
    return () => clearInterval(interval);
  }
}, [token]);
  const fetchFlights = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/flights/get');
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      console.error('Error fetching flights:', err);
    }
  };

  const fetchShipments = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/flights/shipments', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      setShipments(data);
    } else {
      console.error("Failed to fetch shipments:", data.message);
    }
  } catch (err) {
    console.error('Error fetching shipments:', err);
  }
};
const fetchUserPoints = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/points/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setPoints(data.points || 0);
  } catch (err) {
    console.error("Error fetching user points:", err);
  }
};

  const handleAddFlight = async () => {
    if (!from || !to || !departureDate || !availableKg) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/flights/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          from,
          to,
          departureDate: departureDate.toISOString(),
          availableKg: parseFloat(availableKg),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Flight added successfully! ✈️');
        setFrom('');
        setTo('');
        setAvailableKg(5);
        fetchFlights();
      } else {
        Alert.alert('Error', data.message || 'Failed to add flight');
      }
    } catch (err) {
      console.error('Error adding flight:', err);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  };

  const renderFlight = ({ item }) => (
    <View style={styles.flightCard}>
      <Text style={styles.flightTextBold}>{item.from} - {item.to}</Text>
      <View style={styles.flightDetailsRow}>
        <Text style={styles.flightTextDetail}>Departure: {new Date(item.departureDate).toLocaleString()}</Text>
        <Text style={styles.flightTextDetail}>Available: **{item.availableKg} Kg**</Text>
        <Text style={[styles.flightTextStatus, { color: item.status === 'Active' ? '#4CAF50' : '#FFB733' }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );
  const LastTripsCard = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Last Trips</Text>
      <Text style={styles.cardSubtitle}>Overview of latest month</Text>
      <View style={{ marginTop: 10 }}>
        <Text style={styles.placeholderText}>- Julia Doe (Qatar) - $50</Text>
        <Text style={styles.placeholderText}>- Mario Latino (Emirates) - $80</Text>
      </View>
    </View>
  );

  const FlightStatisticsCard = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Statistics</Text>
      <View style={styles.chartPlaceholder}><Text style={styles.placeholderText}>Bar Chart Placeholder</Text></View>
    </View>
  );

  const FlightShareCard = () => (
    <View style={[styles.card, { flex: 1 }]}>
      <Text style={styles.cardTitle}>Flights Share</Text>
      <View style={styles.chartPlaceholder}><Text style={styles.placeholderText}>Donut Chart Placeholder</Text></View>
    </View>
  );

  const FlightScheduleCard = () => (
    <View style={[styles.card, { flex: 2, marginLeft: cardSpacing }]}>
      <Text style={styles.cardTitle}>Flights Schedule</Text>
      <View style={styles.chartPlaceholder}><Text style={styles.placeholderText}>Line Chart Placeholder</Text></View>
    </View>
  );

  return (
    <LinearGradient colors={['#F7F8FC', '#F7F8FC']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DashboardHeader />
      <View style={styles.mainWrapper}>
        <View style={styles.sidebar}>
          <View style={styles.profileContainer}>
            <View style={styles.profileImagePlaceholder}>
            </View>
            <Text style={styles.profileName}>{user?.fullName || 'Carrier'}</Text>
           <Text style={styles.profileEmail}>{user?.email || '---'}</Text>
          </View>
          <SidebarLink text="DASHBOARD" isActive={activeMenu === 'DASHBOARD'} onPress={() => setActiveMenu('DASHBOARD')} />
         <TouchableOpacity
           onPress={() => navigation.navigate('SupportChat', { userId: '68eb15ad2961325b5b181310' })}
         
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
          <Text style={styles.profilePoints}>🏆 Points: {points}</Text>

          <View style={{ flex: 1 }} />
          <View style={styles.activeUsersContainer}>
            <Text style={styles.activeUsersTitle}>ACTIVE USERS</Text>
            <View style={styles.activeUsersPlaceholder} />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.mainGridRow}>
            <View style={styles.leftColumn}>
              <LastTripsCard />
              <View style={[styles.card, { marginTop: cardSpacing }]}>
                <Text style={styles.cardTitle}>Add New Flight</Text>
                <TextInput style={styles.input} placeholder="From" placeholderTextColor="#999" value={from} onChangeText={setFrom} />
                <TextInput style={styles.input} placeholder="To" placeholderTextColor="#999" value={to} onChangeText={setTo} />
                <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateText}>Departure: {departureDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={departureDate}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDepartureDate(selectedDate);
                    }}
                  />
                )}
                <Text style={styles.label}>Available Kg: {availableKg}</Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={50}
                  step={1}
                  minimumTrackTintColor="#4CAF50"
                  maximumTrackTintColor="#ccc"
                  thumbTintColor="#4CAF50"
                  value={availableKg}
                  onValueChange={(value) => setAvailableKg(value)}
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleAddFlight}>
                  <Text style={styles.addText}>Add Flight</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.rightColumn}>
              <FlightStatisticsCard />
            </View>
          </View>
          <View style={styles.secondaryGridRow}>
            <FlightShareCard />
            <FlightScheduleCard />
          </View>
          <Text style={styles.subtitle}>Your Recent Flights</Text>
          <FlatList
            data={flights}
            keyExtractor={(item) => item.from + item.to + item.departureDate}
            renderItem={renderFlight}
            scrollEnabled={false} 
            style={{ width: '100%', marginTop: cardSpacing }}
          />
          <Text style={styles.subtitle}>Shipment Requests</Text>
{shipments.length === 0 ? (
  <Text style={{ color: '#888', marginTop: 10 }}>No shipment requests yet.</Text>
) : (
  <FlatList
    data={shipments}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.shipmentCard}>
        <Text style={styles.shipmentTitle}>
          {item.sender.fullName} → {item.flight.from} to {item.flight.to}
        </Text>
        <Text style={styles.shipmentDetail}>
          Weight: {item.itemWeight} Kg | Status: {item.acceptorVerified ? 'Verified' : 'Pending'}
        </Text>
        <Text style={styles.shipmentDetail}>
          Receiver: {item.acceptorName} ({item.acceptorPhone})
        </Text>
        <Text style={styles.shipmentDetail}>
          Departure: {new Date(item.flight.departureDate).toLocaleString()}
        </Text>
      </View>
    )}
    scrollEnabled={false}
    style={{ width: '100%', marginTop: 10 }}
  />
)}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' }, 
  mainWrapper: { flexDirection: 'row', flex: 1 },
  sidebar: {
    width: 180, 
    backgroundColor: '#2D4B46', 
    paddingTop: 50,
    paddingHorizontal: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FFB733', 
  },
  profilePoints: {
  color: '#FFD700', 
  fontSize: 12,
  marginTop: 5,
  fontWeight: 'bold',
},
  profileName: {
    color: '#fff',
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
    backgroundColor: '#E0E0E0', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sidebarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  activeSidebarText: {
    color: '#2D4B46', 
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 10,
  },
  activeUsersContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  activeUsersTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginBottom: 5,
  },
  activeUsersPlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  content: {
    flexGrow: 1,
    padding: contentPadding,
  },
  topSummaryGrid: {
    flexDirection: 'row',
    marginBottom: cardSpacing,
    width: '100%',
    alignItems: 'center',
  },
  topSummaryCard: {
    flex: 1.5, 
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  topSummaryCardRight: {
    flex: 2, 
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginLeft: cardSpacing,
    justifyContent: 'center',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  topCardTitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },
  topCardValue: {
    color: '#2D4B46',
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
  },
  cardTitle: {
    color: '#2D4B46',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
  },
  placeholderText: {
    color: '#ccc',
    fontSize: 12,
  },
  chartPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainGridRow: {
    flexDirection: 'row',
    marginBottom: cardSpacing,
    width: '100%',
  },
  leftColumn: {
    flex: 2, 
  },
  rightColumn: {
    flex: 1, 
    marginLeft: cardSpacing,
  },
  secondaryGridRow: {
    flexDirection: 'row',
    marginBottom: cardSpacing,
    width: '100%',
  },
  input: {
    backgroundColor: '#F5F5F5', 
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    color: '#333',
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
  },
  dateBtn: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  dateText: {
    color: '#333',
  },
  label: {
    color: '#888',
    marginBottom: 5,
    alignSelf: 'flex-start',
    fontSize: 12,
  },
  addBtn: {
    backgroundColor: '#FFB733',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
    shadowColor: '#FFB733',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addText: {
    color: '#2D4B46', 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#2D4B46',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  flightCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  flightTextBold: {
    color: '#2D4B46',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  flightDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flightTextDetail: {
    color: '#888',
    fontSize: 12,
    marginRight: 10,
  },
  flightTextStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  shipmentCard: {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 15,
  marginBottom: 10,
  width: '100%',
  borderLeftWidth: 5,
  borderLeftColor: '#FFB733',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 2,
},
shipmentTitle: {
  color: '#2D4B46',
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 5,
},
shipmentDetail: {
  color: '#888',
  fontSize: 12,
  marginBottom: 2,
},

});