import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import COLORS from '../theme/colors';
import client1 from '../../assets/person1.png';
import client2 from '../../assets/person2.png';
import client3 from '../../assets/person3.png';

const { width } = Dimensions.get('window');

export default function StatsAndTestimonials() {
  const stats = [
    { label: 'Satisfied Customers', value: '5000+' },
    { label: 'Flight Routes', value: '50+' },
    { label: 'Airline Partners', value: '10+' },
    { label: '24/7 Support', value: 'Always' },
  ];

  const testimonials = [
    {
      id: '1',
      name: 'meaza',
      feedback: 'FlyBridg made booking flights effortless. Highly recommended!',
      avatar: client1,
    },
    {
      id: '2',
      name: 'Abebe',
      feedback: 'Working with FlyBridg streamlined our operations significantly.',
      avatar: client2,
    },
    {
      id: '3',
      name: 'kebede',
      feedback: 'Reliable, fast, and user-friendly. FlyBridg rocks!',
      avatar: client3,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Statistics Section */}
      <Animatable.View animation="fadeInUp" duration={1200} style={styles.statsContainer}>
        {stats.map((item, index) => (
          <Animatable.View
            key={index}
            animation="zoomIn"
            delay={index * 200}
            style={styles.statCard}
          >
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </Animatable.View>
        ))}
      </Animatable.View>

      {/* Testimonials Section */}
      <Animatable.Text animation="fadeInDown" delay={800} style={styles.testimonialHeading}>
        What Our Clients Say
      </Animatable.Text>
      <View style={styles.testimonialContainer}>
        {testimonials.map((item, index) => (
          <Animatable.View
            key={item.id}
            animation="fadeInUp"
            delay={index * 300}
            style={styles.testimonialCard}
          >
            <Image source={item.avatar} style={styles.avatar} resizeMode="contain" />
            <Text style={styles.feedback}>"{item.feedback}"</Text>
            <Text style={styles.clientName}>- {item.name}</Text>
          </Animatable.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.CARD_BG,
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.ACCENT_GOLD,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    color: COLORS.TEXT_DARK,
    textAlign: 'center',
  },
  testimonialHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
    textAlign: 'center',
    marginBottom: 25,
  },
  testimonialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  testimonialCard: {
    width: '32%', // three cards in a row
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 15,
  },
  feedback: {
    fontSize: 15,
    color: COLORS.TEXT_DARK,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
  },
  clientName: {
    fontSize: 14,
    color: COLORS.ACCENT_GOLD,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
