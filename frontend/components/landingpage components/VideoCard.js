import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoView } from 'expo-video';
import COLORS from '../theme/colors';

export default function VideoCard({ player }) {
  return (
    <View style={styles.videoCard}>
      <VideoView
        style={styles.videoContent}
        player={player}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoCard: {
    width: '100%',
    height: 380,
    backgroundColor: 'black',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  videoContent: { width: '100%', height: '100%' },
});
