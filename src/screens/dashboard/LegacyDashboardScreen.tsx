/* eslint-disable */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Search, Book, Gamepad2, Dumbbell, Shield, Trophy, CheckCircle2 } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { Animated as RNAnimated } from 'react-native';

// --- DYNAMIC DATA ---
const MOCK_DATA = {
  user: {
    firstName: "Arjun",
    streak: { current: 12, days: [true, true, true, true, true, false, true] },
    goal: { current: 2, total: 3 },
  },
  journey: {
    title: "AI Basics",
    progress: 60,
    status: "In Progress",
  },
  recommendation: {
    title: "Machine Learning\nfor Beginners",
    lessons: 5,
    level: "Beginner",
    progress: 40,
  }
};

// --- ANIMATED 3D COMPONENT (Standard React Native Animated to prevent web crashes) ---
const Pressable3D = ({ children, containerStyle, topStyle, edgeColor, onPress, depth = 6 }: any) => {
  const animatedValue = React.useRef(new RNAnimated.Value(0)).current;

  const handlePressIn = () => {
    RNAnimated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    RNAnimated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
    if (onPress) onPress();
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, depth],
  });

  return (
    <Pressable 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[containerStyle, { backgroundColor: edgeColor, paddingBottom: depth }]}
    >
      <RNAnimated.View style={[topStyle, { transform: [{ translateY }] }]}>
        {children}
      </RNAnimated.View>
    </Pressable>
  );
};

export const LegacyDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const [data] = useState(MOCK_DATA);

  const CircularProgress = ({ progress = 0.66, size = 68, strokeWidth = 6 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Circle stroke="#E2E8F0" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
          <Circle
            stroke="#58CC02"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      </View>
    );
  };

  const days = [
    { label: 'M', active: data.user.streak.days[0] },
    { label: 'T', active: data.user.streak.days[1] },
    { label: 'W', active: data.user.streak.days[2] },
    { label: 'T', active: data.user.streak.days[3] },
    { label: 'F', active: data.user.streak.days[4] },
    { label: 'S', active: data.user.streak.days[5] },
    { label: 'S', active: data.user.streak.days[6], star: true },
  ];

  // Replaced minimalist quick actions with a chunky bento grid in the render method

  const ASSETS = {
    dolphin: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dolphin.png",
    robot: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smileys/Robot.png",
    flame: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Fire.png",
    target: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Direct%20Hit.png"
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={['#E0F2FE', '#F8FAFC', '#F8FAFC']}
        locations={[0, 0.2, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        <View>
          
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greetingText}>Hi, {data.user.firstName}! 👋</Text>
              <Text style={styles.subGreetingText}>Ready to learn{'\n'}something amazing?</Text>
            </View>
            <View style={styles.headerRight}>
              <Pressable3D 
                containerStyle={styles.bell3DContainer} 
                topStyle={styles.bell3DTop} 
                edgeColor="#CBD5E1" 
                depth={4}
              >
                <Bell color="#1CB0F6" size={22} />
              </Pressable3D>
            </View>
            <Image source={{ uri: ASSETS.dolphin }} style={styles.headerDolphin} />
          </View>

          {/* Search Bar */}
          <Pressable3D
            containerStyle={styles.search3DContainer}
            topStyle={styles.search3DTop}
            edgeColor="#CBD5E1"
            depth={5}
          >
            <Search color="#94A3B8" size={22} />
            <Text style={styles.searchPlaceholder}>Search anything to learn...</Text>
            <View style={styles.searchActionCircle}>
              <Search color="#FFF" size={16} />
            </View>
          </Pressable3D>

          {/* Top Widgets Row */}
          <View style={styles.widgetsRow}>
            <Pressable3D
              containerStyle={styles.widget3DContainer}
              topStyle={styles.widget3DTop}
              edgeColor="#CBD5E1"
              depth={6}
            >
              <View style={styles.widgetHeader}>
                <Image source={{ uri: ASSETS.flame }} style={styles.widgetIcon3D} />
                <Text style={styles.widgetTitle}>Learning Streak</Text>
              </View>
              
              <View style={styles.streakInfoContainer}>
                <View style={styles.streakInfo}>
                  <Text style={styles.streakNumber}>{data.user.streak.current}</Text>
                  <Text style={styles.streakDays}>days</Text>
                </View>
                <Text style={styles.streakSub}>Keep it up!</Text>
              </View>

              <View style={styles.daysRow}>
                {days.map((day, idx) => (
                  <View key={idx} style={styles.dayCol}>
                    <Text style={styles.dayLabel}>{day.label}</Text>
                    <View style={[styles.dayCircle, day.active && styles.dayCircleActive, day.star && styles.dayCircleStar]}>
                      {day.active && !day.star && <CheckCircle2 size={12} color="#FFF" />}
                      {day.star && <Text style={{ fontSize: 9 }}>⭐</Text>}
                    </View>
                  </View>
                ))}
              </View>
            </Pressable3D>

            <Pressable3D
              containerStyle={styles.widget3DContainer}
              topStyle={[styles.widget3DTop, { paddingVertical: 18 }]}
              edgeColor="#CBD5E1"
              depth={6}
            >
              <View style={[styles.widgetHeader, { justifyContent: 'center', marginBottom: 16 }]}>
                <Image source={{ uri: ASSETS.target }} style={styles.widgetIcon3D} />
                <Text style={[styles.widgetTitle, { marginLeft: 6 }]}>Today's Goal</Text>
              </View>
              <View style={styles.goalContent}>
                <View style={styles.goalTextContainer}>
                  <Text style={styles.goalNumber}>{data.user.goal.current}<Text style={styles.goalTotal}>/{data.user.goal.total}</Text></Text>
                  <Text style={styles.goalText}>Lessons</Text>
                </View>
                <View style={styles.circularProgressWrapper}>
                  <CircularProgress progress={data.user.goal.current / data.user.goal.total} size={76} strokeWidth={8} />
                  <Image source={{ uri: ASSETS.dolphin }} style={styles.goalInnerDolphin} />
                </View>
              </View>
            </Pressable3D>
          </View>

          {/* Continue Your Journey */}
          <Pressable3D
            containerStyle={styles.journey3DContainer}
            topStyle={styles.journey3DTop}
            edgeColor="#1899D6"
            depth={8}
          >
            <LinearGradient colors={['#1CB0F6', '#1CB0F6']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            <View style={styles.journeyContent}>
              <Text style={styles.journeyTitle}>Continue Your Journey</Text>
              <View style={styles.journeyTopicRow}>
                <View style={styles.journeyTopicCheck}>
                  <CheckCircle2 color="#58CC02" fill="#FFF" size={24} />
                </View>
                <Text style={styles.journeyTopic}>{data.journey.title}</Text>
              </View>
              <Text style={styles.journeyStatus}>{data.journey.status}</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${data.journey.progress}%` }]} />
                <Text style={styles.progressText}>{data.journey.progress}%</Text>
              </View>
            </View>
            <Image source={{ uri: ASSETS.dolphin }} style={styles.journeyDolphin} />
          </Pressable3D>

          {/* Games & Learning Modes (Chunky Bento Grid) */}
          <Text style={styles.sectionTitle}>Learning Modes</Text>
          <View style={{ marginBottom: 32 }}>
            <View style={styles.bentoRow}>
              <View style={{ flex: 1 }}>
                <Pressable3D
                  containerStyle={styles.bentoCard3DContainer}
                  topStyle={styles.bentoCard3DTop}
                  edgeColor="#1899D6"
                  depth={8}
                >
                  <LinearGradient colors={['#1CB0F6', '#1CB0F6']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                  <Image source={{ uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png" }} style={styles.bentoIcon} />
                  <Text style={styles.bentoTitle}>Play Game</Text>
                  <Text style={styles.bentoSub}>Earn 20 XP</Text>
                </Pressable3D>
              </View>
              
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Pressable3D
                  containerStyle={styles.bentoCard3DContainer}
                  topStyle={styles.bentoCard3DTop}
                  edgeColor="#CC7800"
                  depth={8}
                >
                  <LinearGradient colors={['#FF9600', '#FF9600']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                  <Image source={{ uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20and%20body/Flexed%20Biceps.png" }} style={styles.bentoIcon} />
                  <Text style={styles.bentoTitle}>Practice</Text>
                  <Text style={styles.bentoSub}>Weak skills</Text>
                </Pressable3D>
              </View>
            </View>

            <View style={[styles.bentoRow, { marginTop: 16 }]}>
              <View style={{ flex: 1 }}>
                <Pressable3D
                  containerStyle={styles.bentoCard3DContainer}
                  topStyle={styles.bentoCard3DTop}
                  edgeColor="#A568CC"
                  depth={8}
                >
                  <LinearGradient colors={['#CE82FF', '#CE82FF']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                  <Image source={{ uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Crown.png" }} style={styles.bentoIcon} />
                  <Text style={styles.bentoTitle}>Leaderboard</Text>
                  <Text style={styles.bentoSub}>Rank #12</Text>
                </Pressable3D>
              </View>
              
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Pressable3D
                  containerStyle={styles.bentoCard3DContainer}
                  topStyle={styles.bentoCard3DTop}
                  edgeColor="#CC3C3C"
                  depth={8}
                >
                  <LinearGradient colors={['#FF4B4B', '#FF4B4B']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                  <Image source={{ uri: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png" }} style={styles.bentoIcon} />
                  <Text style={styles.bentoTitle}>Quizzes</Text>
                  <Text style={styles.bentoSub}>Review notes</Text>
                </Pressable3D>
              </View>
            </View>
          </View>

          {/* Recommended for You */}
          <View style={styles.recommendedHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <Pressable>
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          </View>
          
          <Pressable3D
            containerStyle={styles.recommended3DContainer}
            topStyle={styles.recommended3DTop}
            edgeColor="#CBD5E1"
            depth={6}
          >
            <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            <View style={styles.recommendedContent}>
              <Text style={styles.recommendedTitle}>{data.recommendation.title}</Text>
              <View style={styles.recommendedMeta}>
                <Text style={styles.metaText}>{data.recommendation.lessons} Lessons</Text>
                <View style={styles.metaDivider} />
                <Text style={styles.metaBadge}>{data.recommendation.level}</Text>
              </View>
              <View style={styles.recProgressBarContainer}>
                <View style={[styles.recProgressBarFill, { width: `${data.recommendation.progress}%` }]} />
                <Text style={styles.recProgressText}>{data.recommendation.progress}%</Text>
              </View>
            </View>
            <Image source={{ uri: ASSETS.robot }} style={styles.recommendedRobot} />
          </Pressable3D>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    zIndex: 10,
    position: 'relative',
  },
  headerTextContainer: {
    flex: 1,
    paddingTop: 10,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  subGreetingText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 32,
  },
  headerRight: {
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  bell3DContainer: {
    borderRadius: 20,
  },
  bell3DTop: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  headerDolphin: {
    width: 140,
    height: 140,
    position: 'absolute',
    top: -20,
    right: -20,
    resizeMode: 'contain',
    zIndex: -1,
  },
  
  // Search Bar
  search3DContainer: {
    borderRadius: 24,
    marginBottom: 28,
    marginTop: 24,
  },
  search3DTop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 14,
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  searchActionCircle: {
    backgroundColor: '#1CB0F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  widgetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 16,
  },

  // Widgets
  widget3DContainer: {
    flex: 1,
    borderRadius: 24,
  },
  widget3DTop: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flex: 1,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetIcon3D: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 6,
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  streakInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF9600',
  },
  streakDays: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 6,
  },
  streakSub: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: -2,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 6,
    fontWeight: '800',
  },
  dayCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#FF9600',
  },
  dayCircleStar: {
    backgroundColor: '#FFD900',
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  goalTextContainer: {
    alignItems: 'center',
  },
  goalNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1CB0F6',
  },
  goalTotal: {
    fontSize: 18,
    color: '#94A3B8',
  },
  goalText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  circularProgressWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
    height: 76,
  },
  goalInnerDolphin: {
    width: 48,
    height: 48,
    position: 'absolute',
    resizeMode: 'contain',
  },

  // Journey Card
  journey3DContainer: {
    borderRadius: 28,
    marginBottom: 32,
  },
  journey3DTop: {
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  journeyContent: {
    flex: 1,
    zIndex: 2,
  },
  journeyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 16,
  },
  journeyTopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  journeyTopicCheck: {
    marginRight: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  journeyTopic: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  journeyStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    position: 'absolute',
    right: -36,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  journeyDolphin: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    position: 'absolute',
    right: -10,
    bottom: -15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 20,
  },
  bentoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bentoCard3DContainer: {
    borderRadius: 28,
  },
  bentoCard3DTop: {
    borderRadius: 28,
    padding: 16,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  bentoIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  bentoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  bentoSub: {
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1CB0F6',
  },
  
  recommended3DContainer: {
    borderRadius: 24,
    marginBottom: 20,
  },
  recommended3DTop: {
    borderRadius: 24,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  recommendedContent: {
    flex: 1,
    zIndex: 2,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
    lineHeight: 24,
  },
  recommendedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
  metaDivider: {
    width: 2,
    height: 14,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
  metaBadge: {
    fontSize: 13,
    color: '#1CB0F6',
    fontWeight: '800',
  },
  recProgressBarContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
  },
  recProgressBarFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
  recProgressText: {
    position: 'absolute',
    right: -38,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '800',
  },
  recommendedRobot: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    position: 'absolute',
    right: 5,
    bottom: -10,
  },
});
