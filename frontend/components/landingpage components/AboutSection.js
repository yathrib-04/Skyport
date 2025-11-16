import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import COLORS from '../theme/colors';
import aboutimage from '../../assets/travlersimage.webp';

const isWeb = Platform.OS === 'web';

export default function AboutSection({ onContactPress }) {
  const highlights = [
    { title: 'Seamless Connections', desc: 'SwiftLink unites passengers, airlines, and logistics partners through a single intelligent platform.' },
    { title: 'Reliable Operations', desc: 'Real-time flight tracking and optimized scheduling ensure every journey is smooth and efficient.' },
    { title: 'Trusted Partnerships', desc: 'We collaborate with major airlines and service providers to deliver safe, scalable, and transparent air transport.' },
    { title: 'Innovative Vision', desc: 'Redefining the future of air mobility with smart, data-driven connectivity.' },
  ];

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={1000}
      easing="ease-out-cubic"
      style={styles.section}
    >
      <Animatable.Text animation="fadeInDown" delay={200} style={styles.heading}>
        About SwiftLink
      </Animatable.Text>

      <View style={styles.row}>
        <Animatable.View
          animation={isWeb ? 'fadeInLeft' : 'fadeIn'}
          delay={300}
          duration={1200}
          style={styles.imageContainer}
        >
          <Image
            source={aboutimage}
            style={styles.image}
            resizeMode="cover"
          />
        </Animatable.View>
        <Animatable.View
          animation={isWeb ? 'fadeInRight' : 'fadeInUp'}
          delay={500}
          duration={1200}
          style={styles.textContainer}
        >
          <Text style={styles.subHeading}>Bridging the Skies with Innovation</Text>
          <Text style={styles.description}>
            SwiftLink is transforming how airlines and passengers connect. From flight bookings to cargo coordination,
            our platform simplifies every stage of air travel through cutting-edge technology and reliable service.
          </Text>

          {highlights.map((item, index) => (
            <Animatable.View
              key={index}
              animation="fadeInUp"
              delay={700 + index * 150}
              style={styles.highlight}
            >
              <Animatable.View
                animation="bounceIn"
                delay={800 + index * 150}
                style={styles.dot}
              />
              <View>
                <Text style={styles.highlightTitle}>{item.title}</Text>
                <Text style={styles.highlightDesc}>{item.desc}</Text>
              </View>
            </Animatable.View>
          ))}

          <Animatable.View animation="pulse" iterationCount="infinite" delay={1500}>
            <TouchableOpacity style={styles.ctaButton} onPress={onContactPress}>
              <Text style={styles.ctaText}>Contact Our Team</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    padding: isWeb ? 80 : 25,
  },
  heading: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.TEXT_DARK,
    textAlign: 'center',
    marginBottom: 50,
  },
  row: {
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    marginRight: isWeb ? 40 : 0,
    marginBottom: isWeb ? 0 : 25,
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: isWeb ? 400 : 220,
  },
  textContainer: {
    flex: 1,
  },
  subHeading: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.ACCENT_GOLD,
    marginBottom: 15,
  },
  description: {
    color: COLORS.TEXT_DARK,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 25,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ACCENT_GOLD,
    marginTop: 7,
    marginRight: 12,
  },
  highlightTitle: {
    color: COLORS.TEXT_DARK,
    fontSize: 17,
    fontWeight: 'bold',
  },
  highlightDesc: {
    color: 'rgba(44, 62, 80, 0.8)',
    fontSize: 14,
  },
  ctaButton: {
    marginTop: 30,
    backgroundColor: COLORS.ACCENT_GOLD,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ctaText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
