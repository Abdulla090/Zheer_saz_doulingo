import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { Bot, Play } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FILTERS = ['VOCABULARY', 'READING', 'VOICE', 'ALL'];

export function PlayScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = React.useState('ALL');

  // If the user wanted something to rotate in a circle, we can gently rotate the main bot icon
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [rotation]);

  const animatedBotStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Shapes */}
      <View style={styles.bgCircleTopLeft} />
      <View style={styles.bgCircleTopRight} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.arcadeText}>PHINGO ARCADE</Text>
          <Text style={styles.titleText}>Practice</Text>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Carousel / Cards */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.8 + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselScroll}
          >
            {/* Red Card (peeking) */}
            <View style={[styles.card, { backgroundColor: '#FF6B6B' }]} />

            {/* Blue Card (Main) */}
            <View style={[styles.card, { backgroundColor: '#1A4CE0' }]}>
              <View style={styles.cardHeader}>
                <View style={styles.botIconSmallWrapper}>
                  <Bot size={20} color="#fff" />
                </View>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              </View>

              <View style={styles.cardCenter}>
                <Animated.View style={[animatedBotStyle]}>
                  <Bot size={80} color="#fff" strokeWidth={1.5} />
                </Animated.View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.cardTitle}>Live Voice Tutor</Text>
                <Text style={styles.cardSubtitle}>Gemini Live — voice-only English tutor</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Launch Button */}
        <View style={styles.launchButtonContainer}>
          <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
            <LinearGradient
              colors={['#4F83F6', '#2A52E1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.launchButton}
            >
              <Text style={styles.launchButtonText}>LAUNCH VOICE TUTOR</Text>
              <Play size={20} color="#fff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB', // Very light grayish-blue background
  },
  bgCircleTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  bgCircleTopRight: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  header: {
    paddingHorizontal: 24,
  },
  arcadeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8B95A5',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -1.5,
  },
  filtersContainer: {
    marginTop: 24,
  },
  filtersScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterPill: {
    backgroundColor: '#EDF1F5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  filterPillActive: {
    backgroundColor: '#111827',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  carouselContainer: {
    marginTop: 32,
    height: width * 1.1, // Aspect ratio to make it look like a large card
  },
  carouselScroll: {
    paddingHorizontal: 24,
    gap: 20,
    paddingRight: 60, // extra padding so you can scroll to the end
  },
  card: {
    width: width * 0.8,
    height: '100%',
    borderRadius: 36,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#1A4CE0',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botIconSmallWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  cardCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    marginBottom: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
  },
  launchButtonContainer: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  launchButton: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2A52E1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  launchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
