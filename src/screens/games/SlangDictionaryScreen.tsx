import { PressableScale } from "@/components/animations";
import { AppText } from "@/components/ui/AppText";
import {
  HomeLiquidCard,
  HomeMeshBackground,
  HomePalette as C,
} from "@/components/ui/ios-liquid-home";
import { SLANG_CATEGORIES, SLANG_DATA, type SlangItem } from "@/data/slang-dictionary";
import { useTTS } from "@/hooks/use-tts";
import { useI18n } from "@/hooks/useI18n";
import { useProgressStore } from "@/stores/useProgressStore";
import { crossShadow } from "@/utils/shadows";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Trophy,
  Volume2,
  X,
  XCircle,
} from "lucide-react-native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Premium styling overrides
const ThemeColors = {
  cardBg: "rgba(255, 255, 255, 0.85)",
  accentBlue: "#2B59F3",
  darkNavy: "#0F1A30",
  slate: "#4B5563",
  lightSlate: "#9CA3AF",
  successGreen: "#10B981",
  errorRed: "#EF4444",
  warningGold: "#F59E0B",
  quizBg: "#0B0F19",
};

const getTypeBadgeStyle = (type: string) => {
  switch (type) {
    case "Gen Z Slang":
      return { backgroundColor: "rgba(139, 92, 246, 0.15)", borderColor: "rgba(139, 92, 246, 0.3)" };
    case "Idiom":
      return { backgroundColor: "rgba(245, 158, 11, 0.15)", borderColor: "rgba(245, 158, 11, 0.3)" };
    case "Everyday Phrase":
      return { backgroundColor: "rgba(16, 185, 129, 0.15)", borderColor: "rgba(16, 185, 129, 0.3)" };
    case "Street Slang":
      return { backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "rgba(239, 68, 68, 0.3)" };
    case "Business/Formal":
      return { backgroundColor: "rgba(59, 130, 246, 0.15)", borderColor: "rgba(59, 130, 246, 0.3)" };
    default:
      return { backgroundColor: "rgba(107, 114, 128, 0.15)", borderColor: "rgba(107, 114, 128, 0.3)" };
  }
};

const getTypeBadgeTextStyle = (type: string) => {
  switch (type) {
    case "Gen Z Slang": return { color: "#8B5CF6" }; // Purple
    case "Idiom": return { color: "#D97706" }; // Amber/Orange
    case "Everyday Phrase": return { color: "#059669" }; // Emerald
    case "Street Slang": return { color: "#DC2626" }; // Red
    case "Business/Formal": return { color: "#2563EB" }; // Blue
    default: return { color: "#4B5563" }; // Gray
  }
};

const SlangCategoryHeader = React.memo(function SlangCategoryHeader({
  categoriesList,
  selectedCategory,
  onSelectCategory,
  isKurdish,
}: {
  categoriesList: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isKurdish: boolean;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.chipsContainer, { paddingRight: isKurdish ? 0 : 16, paddingLeft: isKurdish ? 16 : 0, flexDirection: isKurdish ? "row-reverse" : "row" }]}
      style={styles.chipsList}
    >
      {(isKurdish ? [...categoriesList].reverse() : categoriesList).map((item) => {
        const cat = SLANG_CATEGORIES[item as keyof typeof SLANG_CATEGORIES];
        const labelText = isKurdish ? cat.ku : cat.en;
        const isSelected = selectedCategory === item;

        return (
          <View key={item}>
            <PressableScale
              onPress={() => {
                if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelectCategory(item);
              }}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <AppText style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {labelText}
              </AppText>
            </PressableScale>
          </View>
        );
      })}
    </ScrollView>
  );
});

const SlangItemRow = React.memo(function SlangItemRow({
  item,
  isExpanded,
  isItemSpeaking,
  onToggleExpand,
  onSpeak,
  isKurdish,
  t,
  speaking,
  activeId,
}: {
  item: SlangItem;
  isExpanded: boolean;
  isItemSpeaking: boolean;
  onToggleExpand: (id: string) => void;
  onSpeak: (phrase: string, id: string) => void;
  isKurdish: boolean;
  t: any;
  speaking: boolean;
  activeId: string | null;
}) {
  return (
    <HomeLiquidCard style={styles.cardShell} contentStyle={styles.cardContent}>
      <PressableScale onPress={() => onToggleExpand(item.id)} scaleDown={0.99}>
        <View style={[styles.itemHeader, { flexDirection: isKurdish ? "row-reverse" : "row" }]}>
          <View style={[styles.phraseCol, { alignItems: isKurdish ? "flex-end" : "flex-start" }]}>
            <View style={[styles.badgeRow, { flexDirection: isKurdish ? "row-reverse" : "row" }]}>
              <View style={[styles.typeBadge, getTypeBadgeStyle(item.type)]}>
                <AppText style={[styles.typeBadgeText, getTypeBadgeTextStyle(item.type)]} forceLatinFont>
                  {item.type}
                </AppText>
              </View>
            </View>
            <AppText style={styles.slangPhrase} forceLatinFont>
              {item.phrase}
            </AppText>
            <AppText style={styles.slangSubtitle} forceKurdishFont numberOfLines={1}>
              {item.pronunciation}
            </AppText>
          </View>

          <View style={[styles.actionRow, { flexDirection: isKurdish ? "row-reverse" : "row" }]}>
            <PressableScale
              onPress={() => onSpeak(item.phrase, item.id)}
              style={[styles.speakerBtn, isItemSpeaking && styles.speakerBtnSpeaking]}
            >
              <Volume2
                size={20}
                color={isItemSpeaking ? "#FFFFFF" : ThemeColors.accentBlue}
              />
            </PressableScale>
            {isExpanded ? (
              <ChevronUp size={20} color={ThemeColors.slate} />
            ) : (
              <ChevronDown size={20} color={ThemeColors.slate} />
            )}
          </View>
        </View>
      </PressableScale>

      {isExpanded && (
        <View style={styles.itemExpanded}>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <AppText style={styles.detailLabel} forceKurdishFont>
              {isKurdish ? "خوێندنەوە" : "Pronunciation"}
            </AppText>
            <AppText style={styles.detailValue} forceKurdishFont>
              {item.pronunciation}
            </AppText>
          </View>

          <View style={styles.detailRow}>
            <AppText style={styles.detailLabel} forceKurdishFont>
              {isKurdish ? "واتا" : "Meaning"}
            </AppText>
            <AppText style={[styles.detailValue, styles.detailFigurative]} forceKurdishFont>
              {item.kuMeaning}
            </AppText>
          </View>

          <View style={styles.detailRow}>
            <AppText style={styles.detailLabel} forceKurdishFont>
              {t("slang.example")}
            </AppText>
            <View style={styles.dialogueBox}>
              {/* Dialogue Bubble A */}
              <View style={[styles.dialogueLine, { flexDirection: isKurdish ? "row-reverse" : "row" }]}>
                <View style={styles.dialogueMarkerA}>
                  <AppText style={styles.dialogueMarkerText} forceLatinFont>
                    A
                  </AppText>
                </View>
                <View style={[styles.dialogueContent, { alignItems: isKurdish ? "flex-end" : "flex-start" }]}>
                  <AppText style={styles.dialogueEn} forceLatinFont>
                    {item.example.speakerA}
                  </AppText>
                  <AppText style={styles.dialogueKu} forceKurdishFont>
                    {item.example.kuA}
                  </AppText>
                </View>
                <PressableScale
                  onPress={() => onSpeak(item.example.speakerA, `${item.id}_a`)}
                  style={[
                    styles.miniSpeakerBtn,
                    speaking && activeId === `${item.id}_a` && styles.speakerBtnSpeaking,
                  ]}
                >
                  <Volume2
                    size={14}
                    color={speaking && activeId === `${item.id}_a` ? "#FFFFFF" : ThemeColors.slate}
                  />
                </PressableScale>
              </View>

              {/* Dialogue Bubble B */}
              <View style={[styles.dialogueLine, { flexDirection: isKurdish ? "row-reverse" : "row" }]}>
                <View style={styles.dialogueMarkerB}>
                  <AppText style={styles.dialogueMarkerText} forceLatinFont>
                    B
                  </AppText>
                </View>
                <View style={[styles.dialogueContent, { alignItems: isKurdish ? "flex-end" : "flex-start" }]}>
                  <AppText style={styles.dialogueEn} forceLatinFont>
                    {item.example.speakerB}
                  </AppText>
                  <AppText style={styles.dialogueKu} forceKurdishFont>
                    {item.example.kuB}
                  </AppText>
                </View>
                <PressableScale
                  onPress={() => onSpeak(item.example.speakerB, `${item.id}_b`)}
                  style={[
                    styles.miniSpeakerBtn,
                    speaking && activeId === `${item.id}_b` && styles.speakerBtnSpeaking,
                  ]}
                >
                  <Volume2
                    size={14}
                    color={speaking && activeId === `${item.id}_b` ? "#FFFFFF" : ThemeColors.slate}
                  />
                </PressableScale>
              </View>
            </View>
          </View>
        </View>
      )}
    </HomeLiquidCard>
  );
});

export function SlangDictionaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { speak, stop, speaking, activeId } = useTTS();
  const awardXp = useProgressStore((s) => s.awardXp);

  const isKurdish = locale === "ku";

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Normal");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Quiz Modal States
  const [quizVisible, setQuizVisible] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<{
    slang: SlangItem;
    choices: string[];
    correctIndex: number;
  }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Select Slang of the Day (seeded by current day of the month)
  const slangOfTheDay = useMemo(() => {
    const day = new Date().getDate();
    const index = day % SLANG_DATA.length;
    return SLANG_DATA[index];
  }, []);

  // Filter slang list
  const filteredSlang = useMemo(() => {
    return SLANG_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.phrase.toLowerCase().includes(q) ||
        item.pronunciation.toLowerCase().includes(q) ||
        item.kuMeaning.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleBack = useCallback(() => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const handleSpeak = useCallback(
    (text: string, id: string) => {
      if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (speaking && activeId === id) {
        void stop();
      } else {
        void speak(text, "en", id);
      }
    },
    [speaking, activeId, speak, stop]
  );

  const toggleExpand = useCallback((id: string) => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // Start Slang Matcher Mini-game
  const startQuiz = useCallback(() => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Shuffle slang data and select 5 items
    const shuffled = [...SLANG_DATA].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    const questions = selected.map((item) => {
      // Find 3 distractors from the remaining slang items
      const distractors = SLANG_DATA.filter((s) => s.id !== item.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((s) => s.kuMeaning);

      // Combine correct answer and distractors, then shuffle
      const choices = [item.kuMeaning, ...distractors].sort(() => 0.5 - Math.random());
      const correctIndex = choices.indexOf(item.kuMeaning);

      return {
        slang: item,
        choices,
        correctIndex,
      };
    });

    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedChoiceIndex(null);
    setIsAnswerChecked(false);
    setQuizScore(0);
    setQuizCompleted(false);
    setQuizVisible(true);
  }, []);

  const handleSelectChoice = useCallback((index: number) => {
    if (isAnswerChecked) return;
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedChoiceIndex(index);
  }, [isAnswerChecked]);

  const handleCheckAnswer = useCallback(() => {
    if (selectedChoiceIndex === null || isAnswerChecked) return;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedChoiceIndex === currentQuestion.correctIndex;

    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(
        isCorrect
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error
      );
    }

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }

    setIsAnswerChecked(true);
  }, [selectedChoiceIndex, isAnswerChecked, quizQuestions, currentQuestionIndex]);

  const handleNextQuestion = useCallback(() => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoiceIndex(null);
      setIsAnswerChecked(false);
    } else {
      setQuizCompleted(true);
      if (Platform.OS !== "web") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [currentQuestionIndex, quizQuestions.length]);

  const handleClaimXp = useCallback(() => {
    // Award 10 XP
    awardXp(10, "Slang Matcher Quiz");
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setQuizVisible(false);
  }, [awardXp]);

  const categoriesList = useMemo(() => Object.keys(SLANG_CATEGORIES), []);

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      {/* Screen Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, flexDirection: isKurdish ? "row-reverse" : "row" }]}>
        <PressableScale onPress={handleBack} style={styles.backBtn}>
          <View style={{ transform: [{ scaleX: isKurdish ? -1 : 1 }] }}>
            <ArrowLeft size={22} color={ThemeColors.darkNavy} />
          </View>
        </PressableScale>
        <AppText style={styles.headerTitle} forceKurdishFont>
          {t("slang.title")}
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <FlashList
        data={filteredSlang}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SlangItemRow
            item={item}
            isExpanded={expandedId === item.id}
            isItemSpeaking={speaking && activeId === item.id}
            onToggleExpand={toggleExpand}
            onSpeak={handleSpeak}
            isKurdish={isKurdish}
            t={t}
            speaking={speaking}
            activeId={activeId}
          />
        )}
        extraData={{ expandedId, activeId, speaking }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        ListHeaderComponent={
          <>
            {/* Slang of the Day Spotlight */}
            <HomeLiquidCard
              style={[styles.spotlightCard, crossShadow({ color: ThemeColors.accentBlue, opacity: 0.12, offsetY: 10, blur: 24, elevation: 6 })]}
              contentStyle={styles.spotlightContent}
            >
              <View style={{ flexDirection: isKurdish ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <View style={[styles.spotlightBadge, { flexDirection: isKurdish ? "row-reverse" : "row", alignSelf: isKurdish ? "flex-end" : "flex-start" }]}>
                  <Sparkles size={14} color="#FFFFFF" />
                  <AppText style={styles.spotlightBadgeText} forceKurdishFont>
                    {t("slang.slangOfTheDay")}
                  </AppText>
                </View>
                <View style={[styles.typeBadge, getTypeBadgeStyle(slangOfTheDay.type), { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)" }]}>
                  <AppText style={[styles.typeBadgeText, { color: "#FFFFFF" }]} forceLatinFont>
                    {slangOfTheDay.type}
                  </AppText>
                </View>
              </View>

              <View style={[styles.spotlightMain, { flexDirection: isKurdish ? "row-reverse" : "row" }]}>
                <View style={{ flex: 1, alignItems: isKurdish ? "flex-end" : "flex-start" }}>
                  <AppText style={styles.spotlightPhrase} forceLatinFont>
                    {slangOfTheDay.phrase}
                  </AppText>
                  <AppText style={styles.spotlightTranslation} forceKurdishFont>
                    {slangOfTheDay.pronunciation}
                  </AppText>
                </View>
                <PressableScale
                  onPress={() => handleSpeak(slangOfTheDay.phrase, `spotlight_${slangOfTheDay.id}`)}
                  style={[
                    styles.spotlightSpeakBtn,
                    speaking && activeId === `spotlight_${slangOfTheDay.id}` && styles.speakerBtnSpeaking,
                  ]}
                >
                  <Volume2
                    size={22}
                    color={speaking && activeId === `spotlight_${slangOfTheDay.id}` ? "#FFFFFF" : "#FFFFFF"}
                  />
                </PressableScale>
              </View>

              <AppText style={styles.spotlightDescription} forceKurdishFont>
                {slangOfTheDay.kuMeaning}
              </AppText>
            </HomeLiquidCard>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { flexDirection: isKurdish ? "row-reverse" : "row" }]}>
              <Search size={18} color={ThemeColors.lightSlate} style={[styles.searchIcon, { marginRight: isKurdish ? 0 : 8, marginLeft: isKurdish ? 8 : 0 }]} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t("slang.searchPlaceholder")}
                placeholderTextColor={ThemeColors.lightSlate}
                style={[styles.searchInput, isKurdish && styles.searchInputRtl]}
              />
              {searchQuery ? (
                <PressableScale onPress={() => setSearchQuery("")} style={styles.clearSearchBtn}>
                  <X size={16} color={ThemeColors.slate} />
                </PressableScale>
              ) : null}
            </View>

            {/* Category Filters — small set; avoid nested FlashList */}
            <SlangCategoryHeader
              categoriesList={categoriesList}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              isKurdish={isKurdish}
            />
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <BookOpen size={48} color={ThemeColors.lightSlate} />
            <AppText style={styles.emptyText} forceKurdishFont>
              هیچ ئەنجامێک نەدۆزرایەوە
            </AppText>
          </View>
        }
      />

      {/* Floating Mini Game Banner */}
      <View style={[styles.bottomFloatingPanel, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <PressableScale
          onPress={startQuiz}
          style={[styles.gameLaunchBtn, { flexDirection: isKurdish ? "row-reverse" : "row" }, crossShadow({ color: ThemeColors.accentBlue, opacity: 0.25, offsetY: 6, blur: 16, elevation: 4 })]}
        >
          <Trophy size={18} color="#FFFFFF" style={{ marginRight: isKurdish ? 0 : 6, marginLeft: isKurdish ? 6 : 0 }} />
          <AppText style={styles.gameLaunchBtnLabel} forceKurdishFont>
            {t("slang.quizStart")}
          </AppText>
        </PressableScale>
      </View>

      {/* Slang Quiz Matcher Modal */}
      <Modal visible={quizVisible} animationType="slide" transparent={false}>
        <View style={styles.quizRoot}>
          {/* Custom Mesh Background */}
          <HomeMeshBackground />

          <View style={[styles.quizHeader, { paddingTop: insets.top + 8 }]}>
            <AppText style={styles.quizHeaderTitle} forceKurdishFont>
              {t("slang.quizTitle")}
            </AppText>
            <PressableScale
              onPress={() => setQuizVisible(false)}
              style={styles.quizCloseBtn}
            >
              <X size={20} color={ThemeColors.slate} />
            </PressableScale>
          </View>

          {!quizCompleted ? (
            <View style={styles.quizBody}>
              {/* Question Progress bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarActive,
                    { width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` },
                  ]}
                />
              </View>

              <View style={styles.quizQuestionCard}>
                <AppText style={styles.quizQuestionNum} forceLatinFont>
                  {`${currentQuestionIndex + 1} / ${quizQuestions.length}`}
                </AppText>
                <AppText style={styles.quizQuestionText} forceKurdishFont>
                  واتای ئەم دەستەواژەیە چییە؟
                </AppText>
                <View style={styles.quizTargetContainer}>
                  <AppText style={styles.quizTargetSlang} forceLatinFont>
                    {quizQuestions[currentQuestionIndex]?.slang.phrase}
                  </AppText>
                  <PressableScale
                    onPress={() =>
                      handleSpeak(
                        quizQuestions[currentQuestionIndex]?.slang.phrase,
                        `quiz_${quizQuestions[currentQuestionIndex]?.slang.id}`
                      )
                    }
                    style={styles.quizSpeakerBtn}
                  >
                    <Volume2 size={18} color={ThemeColors.accentBlue} />
                  </PressableScale>
                </View>
              </View>

              {/* Choices */}
              <ScrollView style={styles.choicesList} showsVerticalScrollIndicator={false}>
                {quizQuestions[currentQuestionIndex]?.choices.map((choice, index) => {
                  const isSelected = selectedChoiceIndex === index;
                  const isCorrectAnswer =
                    index === quizQuestions[currentQuestionIndex].correctIndex;

                  let cardStyle: any = styles.choiceCard;
                  let textStyle: any = styles.choiceText;

                  if (isSelected) {
                    cardStyle = [styles.choiceCard, styles.choiceCardSelected];
                    textStyle = [styles.choiceText, styles.choiceTextSelected];
                  }

                  if (isAnswerChecked) {
                    if (isCorrectAnswer) {
                      cardStyle = [styles.choiceCard, styles.choiceCardCorrect];
                      textStyle = [styles.choiceText, styles.choiceTextCorrect];
                    } else if (isSelected) {
                      cardStyle = [styles.choiceCard, styles.choiceCardWrong];
                      textStyle = [styles.choiceText, styles.choiceTextWrong];
                    }
                  }

                  return (
                    <PressableScale
                      key={index}
                      onPress={() => handleSelectChoice(index)}
                      style={cardStyle}
                      scaleDown={0.98}
                    >
                      <View style={styles.choiceInner}>
                        <AppText style={textStyle} forceKurdishFont>
                          {choice}
                        </AppText>
                        {isAnswerChecked && isCorrectAnswer && (
                          <CheckCircle2 size={18} color="#FFFFFF" />
                        )}
                        {isAnswerChecked && isSelected && !isCorrectAnswer && (
                          <XCircle size={18} color="#FFFFFF" />
                        )}
                      </View>
                    </PressableScale>
                  );
                })}
              </ScrollView>

              {/* Feedback Area */}
              <View style={styles.feedbackArea}>
                {!isAnswerChecked ? (
                  <PressableScale
                    onPress={handleCheckAnswer}
                    style={[
                      styles.checkBtn,
                      selectedChoiceIndex === null && styles.checkBtnDisabled,
                    ]}
                    disabled={selectedChoiceIndex === null}
                  >
                    <AppText style={styles.checkBtnLabel} forceKurdishFont>
                      پشکنین
                    </AppText>
                  </PressableScale>
                ) : (
                  <View style={styles.nextStepWrapper}>
                    <View style={styles.resultNotification}>
                      {selectedChoiceIndex ===
                      quizQuestions[currentQuestionIndex].correctIndex ? (
                        <AppText style={styles.resultTextCorrect} forceKurdishFont>
                          {t("slang.quizCorrect")}
                        </AppText>
                      ) : (
                        <AppText style={styles.resultTextWrong} forceKurdishFont>
                          {t("slang.quizWrong")}
                        </AppText>
                      )}
                    </View>
                    <PressableScale onPress={handleNextQuestion} style={styles.nextBtn}>
                      <AppText style={styles.nextBtnLabel} forceKurdishFont>
                        بەردەوامبە
                      </AppText>
                    </PressableScale>
                  </View>
                )}
              </View>
            </View>
          ) : (
            // Quiz Complete Screen
            <View style={styles.completionContainer}>
              <View style={styles.trophyWrapper}>
                <Trophy size={80} color={ThemeColors.warningGold} />
              </View>

              <AppText style={styles.completionTitle} forceKurdishFont>
                {t("slang.quizComplete")}
              </AppText>
              <AppText style={styles.completionSub} forceKurdishFont>
                {t("slang.quizCompleteSub")}
              </AppText>

              <View style={styles.scoreRow}>
                <AppText style={styles.scoreLabel} forceKurdishFont>
                  ئەنجام:
                </AppText>
                <AppText style={styles.scoreValue} forceLatinFont>
                  {`${quizScore} / ${quizQuestions.length}`}
                </AppText>
              </View>

              <PressableScale onPress={handleClaimXp} style={styles.claimXpBtn}>
                <AppText style={styles.claimXpBtnLabel} forceKurdishFont>
                  {t("slang.claimXp")}
                </AppText>
              </PressableScale>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.meshBottom,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: ThemeColors.darkNavy,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  spotlightCard: {
    backgroundColor: ThemeColors.darkNavy,
    borderColor: "rgba(43, 89, 243, 0.3)",
    borderWidth: 1.5,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  spotlightContent: {
    padding: 20,
    backgroundColor: ThemeColors.darkNavy,
  },
  spotlightBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.accentBlue,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
    marginBottom: 14,
  },
  spotlightBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  spotlightMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  spotlightPhrase: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  spotlightTranslation: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.65)",
    fontWeight: "600",
    marginTop: 2,
  },
  spotlightSpeakBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  spotlightDescription: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.divider,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: ThemeColors.darkNavy,
    fontWeight: "600",
    fontFamily: "DINNextRoundedMedium",
    textAlign: "left",
    paddingVertical: 0,
  },
  searchInputRtl: {
    textAlign: "right",
  },
  clearSearchBtn: {
    padding: 4,
  },
  chipsList: {
    marginBottom: 16,
    maxHeight: 40,
  },
  chipsContainer: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: C.divider,
  },
  chipSelected: {
    backgroundColor: ThemeColors.accentBlue,
    borderColor: ThemeColors.accentBlue,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: ThemeColors.slate,
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  slangList: {
    gap: 12,
  },
  cardShell: {
    backgroundColor: ThemeColors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.divider,
  },
  cardContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phraseCol: {
    flex: 1,
    gap: 2,
  },
  slangPhrase: {
    fontSize: 19,
    fontWeight: "800",
    color: ThemeColors.darkNavy,
    letterSpacing: -0.2,
  },
  slangSubtitle: {
    fontSize: 14,
    color: ThemeColors.slate,
    fontWeight: "500",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  speakerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(43, 89, 243, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  speakerBtnSpeaking: {
    backgroundColor: ThemeColors.accentBlue,
  },
  itemExpanded: {
    marginTop: 14,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: ThemeColors.lightSlate,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    color: ThemeColors.darkNavy,
    fontWeight: "600",
  },
  detailFigurative: {
    color: ThemeColors.accentBlue,
    fontSize: 15,
  },
  dialogueBox: {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
    padding: 12,
    gap: 12,
    marginTop: 4,
  },
  dialogueLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  dialogueMarkerA: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(43, 89, 243, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  dialogueMarkerB: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  dialogueMarkerText: {
    fontSize: 11,
    fontWeight: "900",
    color: ThemeColors.darkNavy,
  },
  dialogueContent: {
    flex: 1,
    gap: 2,
  },
  dialogueEn: {
    fontSize: 14,
    fontWeight: "700",
    color: ThemeColors.darkNavy,
    lineHeight: 18,
  },
  dialogueKu: {
    fontSize: 13,
    color: ThemeColors.slate,
    fontWeight: "500",
    lineHeight: 18,
  },
  miniSpeakerBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: ThemeColors.lightSlate,
    fontWeight: "600",
  },
  bottomFloatingPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  gameLaunchBtn: {
    backgroundColor: ThemeColors.accentBlue,
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  gameLaunchBtnLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // Quiz Modal Styles
  quizRoot: {
    flex: 1,
    backgroundColor: "#0B0F19",
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  quizHeaderTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  quizCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  quizBody: {
    flex: 1,
    paddingHorizontal: 16,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    marginBottom: 20,
  },
  progressBarActive: {
    height: "100%",
    backgroundColor: ThemeColors.accentBlue,
    borderRadius: 3,
  },
  quizQuestionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  quizQuestionNum: {
    color: ThemeColors.lightSlate,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  quizQuestionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  quizTargetContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quizTargetSlang: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  quizSpeakerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  choicesList: {
    flex: 1,
    marginBottom: 16,
  },
  choiceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  choiceCardSelected: {
    borderColor: ThemeColors.accentBlue,
    backgroundColor: "rgba(43, 89, 243, 0.15)",
  },
  choiceCardCorrect: {
    borderColor: ThemeColors.successGreen,
    backgroundColor: ThemeColors.successGreen,
  },
  choiceCardWrong: {
    borderColor: ThemeColors.errorRed,
    backgroundColor: ThemeColors.errorRed,
  },
  choiceInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  choiceText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  choiceTextSelected: {
    color: "#FFFFFF",
  },
  choiceTextCorrect: {
    color: "#FFFFFF",
  },
  choiceTextWrong: {
    color: "#FFFFFF",
  },
  feedbackArea: {
    paddingBottom: 24,
  },
  checkBtn: {
    backgroundColor: ThemeColors.accentBlue,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBtnDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  checkBtnLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  nextStepWrapper: {
    gap: 12,
  },
  resultNotification: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  resultTextCorrect: {
    fontSize: 18,
    fontWeight: "800",
    color: ThemeColors.successGreen,
  },
  resultTextWrong: {
    fontSize: 18,
    fontWeight: "800",
    color: ThemeColors.errorRed,
  },
  nextBtn: {
    backgroundColor: ThemeColors.accentBlue,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  completionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  trophyWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  completionSub: {
    fontSize: 15,
    color: ThemeColors.lightSlate,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
  },
  scoreLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  scoreValue: {
    fontSize: 22,
    color: ThemeColors.warningGold,
    fontWeight: "900",
  },
  claimXpBtn: {
    backgroundColor: ThemeColors.warningGold,
    height: 52,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  claimXpBtnLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
