import { previewLessonQuestions } from "../../data/lesson-content";
import { getUnitsForPath } from "../../data/content-access";
import type { LessonBank, LessonPathMode } from "../../data/types";
import { deepClone } from "../../utils/deep-clone";
import {
  AdminButton,
  AdminCard,
  AdminField,
} from "./admin-ui";
import { AppText } from "../../components/ui/AppText";
import { useContentAdminStore } from "../../stores/useContentAdminStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabId =
  | "overview"
  | "words"
  | "voices"
  | "sentences"
  | "fillBlanks"
  | "conversations"
  | "preview";

type InlinePreview = {
  title: string;
  lines: string[];
} | null;

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "words", label: "Words" },
  { id: "voices", label: "Voice" },
  { id: "sentences", label: "Sentences" },
  { id: "fillBlanks", label: "Fill blank" },
  { id: "conversations", label: "Convo" },
  { id: "preview", label: "Preview" },
];

export default function AdminLessonScreen() {
  const params = useLocalSearchParams<{ mode?: string; unit?: string; lesson?: string }>();
  const mode = (params.mode === "normal" ? "normal" : "street") as LessonPathMode;
  const unitIndex = Math.max(0, Number(params.unit ?? 0));
  const lessonIndex = Math.max(0, Number(params.lesson ?? 0));
  const pathOverride = useContentAdminStore((s) => s.overrides[mode]);

  const sourceLesson = getUnitsForPath(mode)[unitIndex]?.[lessonIndex];

  if (!sourceLesson) {
    return (
      <View style={styles.empty}>
        <AppText forceLatinFont>Lesson not found.</AppText>
      </View>
    );
  }

  return (
    <AdminLessonEditor
      key={`${mode}-${unitIndex}-${lessonIndex}-${pathOverride ? "custom" : "bundled"}`}
      mode={mode}
      unitIndex={unitIndex}
      lessonIndex={lessonIndex}
      initialLesson={sourceLesson}
    />
  );
}

function AdminLessonEditor({
  mode,
  unitIndex,
  lessonIndex,
  initialLesson,
}: {
  mode: LessonPathMode;
  unitIndex: number;
  lessonIndex: number;
  initialLesson: LessonBank;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const updateLesson = useContentAdminStore((s) => s.updateLesson);

  const [draft, setDraft] = useState<LessonBank>(() => deepClone(initialLesson));
  const [tab, setTab] = useState<TabId>("overview");
  const [dirty, setDirty] = useState(false);
  const [inlinePreview, setInlinePreview] = useState<InlinePreview>(null);

  const setLesson = useCallback((updater: (prev: LessonBank) => LessonBank) => {
    setDraft((prev) => {
      if (!prev) return prev;
      setDirty(true);
      return updater(prev);
    });
  }, []);

  const save = (quiet = false) => {
    updateLesson(mode, unitIndex, lessonIndex, draft);
    setDirty(false);
    if (!quiet) {
      Alert.alert(
        "Saved",
        "Admin changes are active now. Open the user lesson to verify the same saved content.",
      );
    }
  };

  const previewGames = useMemo(() => {
    return previewLessonQuestions(draft, unitIndex, lessonIndex, mode);
  }, [draft, unitIndex, lessonIndex, mode]);

  if (!draft) {
    return null;
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AdminButton
          label="← Lessons"
          variant="ghost"
          small
          onPress={() => {
            if (dirty) {
              Alert.alert("Unsaved changes", "Save before leaving?", [
                { text: "Discard", style: "destructive", onPress: () => router.back() },
                { text: "Save", onPress: () => { save(true); router.back(); } },
                { text: "Cancel", style: "cancel" },
              ]);
              return;
            }
            router.back();
          }}
        />
        <View style={styles.headerText}>
          <AppText style={styles.title} forceLatinFont numberOfLines={1}>
            {draft.topic}
          </AppText>
          {dirty && (
            <AppText style={styles.dirty} forceLatinFont>
              Unsaved
            </AppText>
          )}
        </View>
        <AdminButton label="Save" small onPress={save} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {TABS.map((t) => (
          <AdminButton
            key={t.id}
            label={t.label}
            small
            variant={tab === t.id ? "primary" : "ghost"}
            onPress={() => setTab(t.id)}
          />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {inlinePreview ? (
          <AdminCard
            title={`Question preview · ${inlinePreview.title}`}
            actions={
              <AdminButton
                label="Close"
                variant="ghost"
                small
                onPress={() => setInlinePreview(null)}
              />
            }
          >
            {inlinePreview.lines.filter(Boolean).map((line, index) => (
              <AppText
                key={`${inlinePreview.title}-${index}`}
                style={styles.inlinePreviewText}
                forceLatinFont={/^[\x00-\x7F\s.,!?'"—:;()/_-]+$/.test(line)}
                forceKurdishFont={!/^[\x00-\x7F\s.,!?'"—:;()/_-]+$/.test(line)}
              >
                {line}
              </AppText>
            ))}
          </AdminCard>
        ) : null}

        {tab === "overview" && (
          <AdminCard title="Lesson info">
            <AdminField
              label="Topic (English)"
              value={draft.topic}
              onChangeText={(topic) => setLesson((l) => ({ ...l, topic }))}
            />
            <AdminField
              label="Topic (Kurdish)"
              value={draft.topicKu}
              onChangeText={(topicKu) => setLesson((l) => ({ ...l, topicKu }))}
            />
          </AdminCard>
        )}

        {tab === "words" && (
          <WordEditor lesson={draft} setLesson={setLesson} showPreview={setInlinePreview} />
        )}

        {tab === "voices" && (
          <VoiceEditor lesson={draft} setLesson={setLesson} showPreview={setInlinePreview} />
        )}

        {tab === "sentences" && (
          <SentenceEditor lesson={draft} setLesson={setLesson} showPreview={setInlinePreview} />
        )}

        {tab === "fillBlanks" && (
          <FillBlankEditor lesson={draft} setLesson={setLesson} showPreview={setInlinePreview} />
        )}

        {tab === "conversations" && (
          <ConversationEditor lesson={draft} setLesson={setLesson} showPreview={setInlinePreview} />
        )}

        {tab === "preview" && (
          <AdminCard title="Verify user lesson output">
            <AppText style={styles.hint} forceLatinFont>
              This preview uses the same game generator as the user lesson. Save, then open
              the lesson to verify the user panel changed.
            </AppText>
            {previewGames.map((g, i) => (
              <View key={i} style={styles.previewRow}>
                <View style={styles.previewHeader}>
                  <View style={styles.previewText}>
                    <AppText style={styles.previewType} forceLatinFont>
                      {i + 1}. {g.type}
                    </AppText>
                    <AppText style={styles.previewDetail} forceLatinFont numberOfLines={2}>
                      {previewSummary(g)}
                    </AppText>
                  </View>
                  <AdminButton
                    label="Show"
                    small
                    variant="ghost"
                    onPress={() => {
                      save(true);
                      router.push({
                        pathname: "/lesson",
                        params: {
                          id: String(unitIndex),
                          li: String(lessonIndex),
                          pi: "0",
                          q: String(i),
                          mode,
                        },
                      });
                    }}
                  />
                </View>
              </View>
            ))}
            <AdminButton
              label="Save and open user lesson"
              onPress={() => {
                save(true);
                router.push({
                  pathname: "/lesson",
                  params: {
                    id: String(unitIndex),
                    li: String(lessonIndex),
                    pi: "0",
                    mode,
                  },
                });
              }}
            />
          </AdminCard>
        )}
      </ScrollView>
    </View>
  );
}

function previewSummary(g: ReturnType<typeof previewLessonQuestions>[number]): string {
  switch (g.type) {
    case "pair_match":
      return g.pairs.map((p) => `${p.english}↔${p.kurdish}`).join(", ");
    case "multiple_choice":
      return g.prompt.slice(0, 60);
    case "voice":
      return `${g.prompt} → ${g.targetWord}`;
    case "sentence_builder":
      return g.kurdishSentence;
    case "fill_blank":
      return `${g.sentenceParts[0]}_${g.sentenceParts[1]}`;
    case "conversation_pick":
      return g.situation;
    default:
      return "";
  }
}

type EditorProps = {
  lesson: LessonBank;
  setLesson: (fn: (prev: LessonBank) => LessonBank) => void;
  showPreview: (preview: InlinePreview) => void;
};

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function WordEditor({ lesson, setLesson, showPreview }: EditorProps) {
  return (
    <>
      <AdminButton
        label="+ Add word pair"
        onPress={() =>
          setLesson((l) => ({
            ...l,
            words: [...l.words, { english: "", kurdish: "" }],
          }))
        }
      />
      {lesson.words.map((w, i) => (
        <AdminCard
          key={`word-${i}`}
          title={`Word ${i + 1}`}
          actions={
            <View style={styles.itemActions}>
              <AdminButton
                label="See"
                variant="ghost"
                small
                onPress={() =>
                  showPreview({
                    title: "Word",
                    lines: [
                    "Pair match / Multiple choice",
                    `Kurdish: ${w.kurdish || "—"}`,
                    `English answer: ${w.english || "—"}`,
                    "User will choose or match this English meaning.",
                    ],
                  })
                }
              />
              <AdminButton
                label="↑"
                variant="ghost"
                small
                onPress={() =>
                  setLesson((l) => ({ ...l, words: moveItem(l.words, i, -1) }))
                }
              />
              <AdminButton
                label="↓"
                variant="ghost"
                small
                onPress={() =>
                  setLesson((l) => ({ ...l, words: moveItem(l.words, i, 1) }))
                }
              />
              <AdminButton
                label="Delete"
                variant="danger"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    words: l.words.filter((_, j) => j !== i),
                  }))
                }
              />
            </View>
          }
        >
          <AdminField
            label="English"
            value={w.english}
            onChangeText={(english) =>
              setLesson((l) => {
                const words = [...l.words];
                words[i] = { ...words[i], english };
                return { ...l, words };
              })
            }
          />
          <AdminField
            label="Kurdish"
            value={w.kurdish}
            onChangeText={(kurdish) =>
              setLesson((l) => {
                const words = [...l.words];
                words[i] = { ...words[i], kurdish };
                return { ...l, words };
              })
            }
          />
        </AdminCard>
      ))}
    </>
  );
}

function VoiceEditor({ lesson, setLesson, showPreview }: EditorProps) {
  return (
    <>
      <AdminButton
        label="+ Add voice prompt"
        onPress={() =>
          setLesson((l) => ({
            ...l,
            voices: [
              ...l.voices,
              { prompt: "", target: "", targetKurdish: "" },
            ],
          }))
        }
      />
      {lesson.voices.map((v, i) => (
        <AdminCard
          key={`voice-${i}`}
          title={`Voice ${i + 1}`}
          actions={
            <View style={styles.itemActions}>
              <AdminButton
                label="See"
                variant="ghost"
                small
                onPress={() =>
                  showPreview({
                    title: "Voice",
                    lines: [
                    v.prompt || "—",
                    `Shown meaning: ${v.targetKurdish || "—"}`,
                    `User must say in English: ${v.target || "—"}`,
                    ],
                  })
                }
              />
              <AdminButton
                label="↑"
                variant="ghost"
                small
                onPress={() =>
                  setLesson((l) => ({ ...l, voices: moveItem(l.voices, i, -1) }))
                }
              />
              <AdminButton
                label="↓"
                variant="ghost"
                small
                onPress={() =>
                  setLesson((l) => ({ ...l, voices: moveItem(l.voices, i, 1) }))
                }
              />
              <AdminButton
                label="Delete"
                variant="danger"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    voices: l.voices.filter((_, j) => j !== i),
                  }))
                }
              />
            </View>
          }
        >
          <AdminField
            label="Prompt (Kurdish)"
            value={v.prompt}
            onChangeText={(prompt) =>
              setLesson((l) => {
                const voices = [...l.voices];
                voices[i] = { ...voices[i], prompt };
                return { ...l, voices };
              })
            }
          />
          <AdminField
            label="Target phrase (English — spoken)"
            value={v.target}
            onChangeText={(target) =>
              setLesson((l) => {
                const voices = [...l.voices];
                voices[i] = { ...voices[i], target };
                return { ...l, voices };
              })
            }
          />
          <AdminField
            label="Meaning (Kurdish — shown to user)"
            value={v.targetKurdish}
            onChangeText={(targetKurdish) =>
              setLesson((l) => {
                const voices = [...l.voices];
                voices[i] = { ...voices[i], targetKurdish };
                return { ...l, voices };
              })
            }
          />
        </AdminCard>
      ))}
    </>
  );
}

function SentenceEditor({ lesson, setLesson, showPreview }: EditorProps) {
  return (
    <>
      <AdminButton
        label="+ Add sentence"
        onPress={() =>
          setLesson((l) => ({
            ...l,
            sentences: [...l.sentences, { english: [], kurdish: "" }],
          }))
        }
      />
      {lesson.sentences.map((s, i) => (
        <AdminCard
          key={`sent-${i}`}
          title={`Sentence ${i + 1}`}
          actions={
            <View style={styles.itemActions}>
              <AdminButton
                label="See"
                variant="ghost"
                small
                onPress={() =>
                  showPreview({
                    title: "Order words",
                    lines: [
                    `Question: ${s.kurdish || "—"}`,
                    `Blanks answer: ${s.english.join(" ") || "—"}`,
                    `Word tiles: ${s.english.join(", ") || "—"}`,
                    ],
                  })
                }
              />
              <AdminButton
                label="↑"
                variant="ghost"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    sentences: moveItem(l.sentences, i, -1),
                  }))
                }
              />
              <AdminButton
                label="↓"
                variant="ghost"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    sentences: moveItem(l.sentences, i, 1),
                  }))
                }
              />
              <AdminButton
                label="Delete"
                variant="danger"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    sentences: l.sentences.filter((_, j) => j !== i),
                  }))
                }
              />
            </View>
          }
        >
          <AdminField
            label="Kurdish sentence"
            value={s.kurdish}
            onChangeText={(kurdish) =>
              setLesson((l) => {
                const sentences = [...l.sentences];
                sentences[i] = { ...sentences[i], kurdish };
                return { ...l, sentences };
              })
            }
          />
          <AdminField
            label="English words (comma-separated, order matters)"
            value={s.english.join(", ")}
            onChangeText={(text) =>
              setLesson((l) => {
                const sentences = [...l.sentences];
                sentences[i] = {
                  ...sentences[i],
                  english: text
                    .split(",")
                    .map((w) => w.trim())
                    .filter(Boolean),
                };
                return { ...l, sentences };
              })
            }
          />
        </AdminCard>
      ))}
    </>
  );
}

function FillBlankEditor({ lesson, setLesson, showPreview }: EditorProps) {
  return (
    <>
      <AdminButton
        label="+ Add fill blank"
        onPress={() =>
          setLesson((l) => ({
            ...l,
            fillBlanks: [
              ...l.fillBlanks,
              {
                parts: ["", ""] as [string, string],
                hint: "",
                answer: "",
                wrongs: ["", "", ""] as [string, string, string],
              },
            ],
          }))
        }
      />
      {lesson.fillBlanks.map((f, i) => (
        <AdminCard
          key={`fill-${i}`}
          title={`Fill blank ${i + 1}`}
          actions={
            <View style={styles.itemActions}>
              <AdminButton
                label="See"
                variant="ghost"
                small
                onPress={() =>
                  showPreview({
                    title: "Fill blank",
                    lines: [
                    `Question: ${f.hint || "—"}`,
                    `${f.parts[0]} ___ ${f.parts[1]}`,
                    `Correct: ${f.answer || "—"}`,
                    `Wrong options: ${f.wrongs.filter(Boolean).join(", ") || "—"}`,
                    ],
                  })
                }
              />
              <AdminButton
                label="↑"
                variant="ghost"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    fillBlanks: moveItem(l.fillBlanks, i, -1),
                  }))
                }
              />
              <AdminButton
                label="↓"
                variant="ghost"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    fillBlanks: moveItem(l.fillBlanks, i, 1),
                  }))
                }
              />
              <AdminButton
                label="Delete"
                variant="danger"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    fillBlanks: l.fillBlanks.filter((_, j) => j !== i),
                  }))
                }
              />
            </View>
          }
        >
          <AdminField
            label="Text before blank"
            value={f.parts[0]}
            onChangeText={(before) =>
              setLesson((l) => {
                const fillBlanks = [...l.fillBlanks];
                fillBlanks[i] = {
                  ...fillBlanks[i],
                  parts: [before, fillBlanks[i].parts[1]],
                };
                return { ...l, fillBlanks };
              })
            }
          />
          <AdminField
            label="Text after blank"
            value={f.parts[1]}
            onChangeText={(after) =>
              setLesson((l) => {
                const fillBlanks = [...l.fillBlanks];
                fillBlanks[i] = {
                  ...fillBlanks[i],
                  parts: [fillBlanks[i].parts[0], after],
                };
                return { ...l, fillBlanks };
              })
            }
          />
          <AdminField
            label="Kurdish hint"
            value={f.hint}
            onChangeText={(hint) =>
              setLesson((l) => {
                const fillBlanks = [...l.fillBlanks];
                fillBlanks[i] = { ...fillBlanks[i], hint };
                return { ...l, fillBlanks };
              })
            }
          />
          <AdminField
            label="Correct answer"
            value={f.answer}
            onChangeText={(answer) =>
              setLesson((l) => {
                const fillBlanks = [...l.fillBlanks];
                fillBlanks[i] = { ...fillBlanks[i], answer };
                return { ...l, fillBlanks };
              })
            }
          />
          {f.wrongs.map((w, wi) => (
            <AdminField
              key={wi}
              label={`Wrong option ${wi + 1}`}
              value={w}
              onChangeText={(wrong) =>
                setLesson((l) => {
                  const fillBlanks = [...l.fillBlanks];
                  const wrongs = [...fillBlanks[i].wrongs] as [
                    string,
                    string,
                    string,
                  ];
                  wrongs[wi] = wrong;
                  fillBlanks[i] = { ...fillBlanks[i], wrongs };
                  return { ...l, fillBlanks };
                })
              }
            />
          ))}
        </AdminCard>
      ))}
    </>
  );
}

function ConversationEditor({ lesson, setLesson, showPreview }: EditorProps) {
  return (
    <>
      <AppText style={styles.hint} forceLatinFont>
        Tier mapping: correct = great · wrong1 = good · wrong2 = bad · wrong3 = terrible
      </AppText>
      <AdminButton
        label="+ Add conversation"
        onPress={() =>
          setLesson((l) => ({
            ...l,
            conversations: [
              ...l.conversations,
              {
                situation: "",
                theyAsk: "",
                correct: "",
                wrong1: "",
                wrong2: "",
                wrong3: "",
                explanation: "",
              },
            ],
          }))
        }
      />
      {lesson.conversations.map((c, i) => (
        <AdminCard
          key={`convo-${i}`}
          title={`Conversation ${i + 1}`}
          actions={
            <View style={styles.itemActions}>
              <AdminButton
                label="See"
                variant="ghost"
                small
                onPress={() =>
                  showPreview({
                    title: "Conversation",
                    lines: [
                    `Situation: ${c.situation || "—"}`,
                    `They say: ${c.theyAsk || "—"}`,
                    `Great: ${c.correct || "—"}`,
                    `Good: ${c.wrong1 || "—"}`,
                    `Bad: ${c.wrong2 || "—"}`,
                    `Terrible: ${c.wrong3 || "—"}`,
                    ],
                  })
                }
              />
              <AdminButton
                label="↑"
                variant="ghost"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    conversations: moveItem(l.conversations, i, -1),
                  }))
                }
              />
              <AdminButton
                label="↓"
                variant="ghost"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    conversations: moveItem(l.conversations, i, 1),
                  }))
                }
              />
              <AdminButton
                label="Delete"
                variant="danger"
                small
                onPress={() =>
                  setLesson((l) => ({
                    ...l,
                    conversations: l.conversations.filter((_, j) => j !== i),
                  }))
                }
              />
            </View>
          }
        >
          {(
            [
              ["Situation (Kurdish)", "situation"],
              ["They say (English)", "theyAsk"],
              ["Best answer — great", "correct"],
              ["Good answer", "wrong1"],
              ["Bad answer", "wrong2"],
              ["Terrible answer", "wrong3"],
              ["Explanation (Kurdish)", "explanation"],
            ] as const
          ).map(([label, key]) => (
            <AdminField
              key={key}
              label={label}
              value={c[key]}
              onChangeText={(value) =>
                setLesson((l) => {
                  const conversations = [...l.conversations];
                  conversations[i] = { ...conversations[i], [key]: value };
                  return { ...l, conversations };
                })
              }
            />
          ))}
        </AdminCard>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F7FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  headerText: { flex: 1 },
  title: { fontSize: 17, fontWeight: "800", color: "#152238" },
  dirty: { fontSize: 11, color: "#F59E0B", fontWeight: "700" },
  tabBar: { maxHeight: 48, marginBottom: 4 },
  tabBarContent: { paddingHorizontal: 12, gap: 6, alignItems: "center" },
  scroll: { padding: 16, paddingBottom: 48 },
  previewRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8EDFF",
    paddingVertical: 10,
    gap: 4,
  },
  previewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  previewText: { flex: 1 },
  previewType: { fontWeight: "800", color: "#2B59F3", fontSize: 13 },
  previewDetail: { color: "#64748B", fontSize: 12 },
  hint: { fontSize: 12, color: "#64748B", marginBottom: 12 },
  inlinePreviewText: {
    fontSize: 14,
    color: "#152238",
    lineHeight: 22,
    marginBottom: 8,
  },
  itemActions: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
});
