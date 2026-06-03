import type { KidsChoice } from "../kids-games";
import type { UnitBank } from "../types";

const c = (id: string, emoji: string, label: string): KidsChoice => ({
  id,
  emoji,
  label,
});

// ── Kids Unit 3: Daily Routines (10-game interactive flow per lesson) ─────────

const kidsUnit3: UnitBank = [
  {
    topic: "Good Morning!",
    topicKu: "بەیانی باش!",
    words: [
      { english: "Wake up", kurdish: "هەستان لە خەو" },
      { english: "Water", kurdish: "ئاو" },
      { english: "Face", kurdish: "دەموچاو" },
      { english: "Happy", kurdish: "دڵخۆش" },
    ],
    voices: [],
    sentences: [],
    fillBlanks: [],
    conversations: [],
    kidsGames: [
      {
        kind: "scene",
        scene: "bedroom",
        prompt: "Tap the Water.",
        correctId: "water",
        choices: [
          c("water", "💧", "Water"),
          c("wake", "⏰", "Wake up"),
          c("face", "😊", "Face"),
          c("sun", "☀️", "Sun"),
        ],
      },
      {
        kind: "bubble",
        prompt: "Catch the Happy face.",
        correctId: "happy",
        choices: [
          c("happy", "😊", "Happy"),
          c("water", "💧", "Water"),
          c("wake", "🛏️", "Wake up"),
          c("face", "🪞", "Face"),
        ],
      },
      {
        kind: "feed",
        mascotEmoji: "🦉",
        prompt: "I want Water.",
        correctId: "water",
        choices: [
          c("water", "💧", "Water"),
          c("happy", "😊", "Happy"),
          c("wake", "⏰", "Wake up"),
        ],
      },
      {
        kind: "shadow",
        prompt: "Match each picture to its shadow.",
        items: [
          c("sun", "☀️", "Sun"),
          c("water", "💧", "Water"),
          c("happy", "😊", "Happy"),
        ],
      },
      {
        kind: "native",
        kurdishPrompt: "هەستان لە خەو",
        correctId: "wake",
        choices: [
          c("wake", "🛏️", "Wake up"),
          c("water", "💧", "Water"),
          c("happy", "😊", "Happy"),
          c("face", "🧼", "Wash face"),
        ],
      },
      {
        kind: "simon",
        phrase: "Wash your face!",
        correctId: "wash",
        choices: [
          c("wash", "🧼", "Wash face"),
          c("wake", "⏰", "Wake up"),
          c("water", "🥤", "Drink"),
          c("sleep", "😴", "Sleep"),
        ],
      },
      {
        kind: "train",
        words: ["Happy", "Face"],
        kurdishHint: "دڵخۆش · دەموچاو",
        extraWords: ["Sad", "Hand"],
      },
      {
        kind: "trick",
        showEmoji: "💧",
        showLabel: "Water",
        spokenWord: "Face",
        matches: false,
      },
      {
        kind: "echo",
        prompt: "بڵێ: Wake up!",
        target: "Wake up!",
        targetKurdish: "هەستان لە خەو!",
      },
      {
        kind: "treasure",
        correctId: "water",
        pool: [
          c("wake", "⏰", "Wake up"),
          c("water", "💧", "Water"),
          c("face", "😊", "Face"),
          c("happy", "😁", "Happy"),
        ],
      },
    ],
  },

  {
    topic: "I am Hungry",
    topicKu: "برسیمە",
    words: [
      { english: "Hungry", kurdish: "برسیمە" },
      { english: "Apple", kurdish: "سێو" },
      { english: "Bread", kurdish: "نان" },
      { english: "Milk", kurdish: "شیر" },
    ],
    voices: [],
    sentences: [],
    fillBlanks: [],
    conversations: [],
    kidsGames: [
      {
        kind: "scene",
        scene: "kitchen",
        prompt: "Tap the Bread.",
        correctId: "bread",
        choices: [
          c("bread", "🍞", "Bread"),
          c("apple", "🍎", "Apple"),
          c("milk", "🥛", "Milk"),
          c("hungry", "😋", "Hungry"),
        ],
      },
      {
        kind: "bubble",
        prompt: "Catch the Milk.",
        correctId: "milk",
        choices: [
          c("milk", "🥛", "Milk"),
          c("apple", "🍎", "Apple"),
          c("bread", "🍞", "Bread"),
          c("hungry", "😋", "Hungry"),
        ],
      },
      {
        kind: "feed",
        mascotEmoji: "🐻",
        prompt: "I am Hungry! Give an Apple.",
        correctId: "apple",
        choices: [
          c("apple", "🍎", "Apple"),
          c("bread", "🍞", "Bread"),
          c("milk", "🥛", "Milk"),
        ],
      },
      {
        kind: "shadow",
        prompt: "Match the snacks to their shadows.",
        items: [
          c("apple", "🍎", "Apple"),
          c("bread", "🍞", "Bread"),
          c("milk", "🥛", "Milk"),
        ],
      },
      {
        kind: "native",
        kurdishPrompt: "برسیمە",
        correctId: "hungry",
        choices: [
          c("hungry", "😋", "Hungry"),
          c("apple", "🍎", "Apple"),
          c("milk", "🥛", "Milk"),
          c("bread", "🍞", "Bread"),
        ],
      },
      {
        kind: "simon",
        phrase: "Drink Milk!",
        correctId: "drink",
        choices: [
          c("drink", "🥛", "Drink"),
          c("eat", "🍽️", "Eat"),
          c("run", "🏃", "Run"),
          c("sleep", "😴", "Sleep"),
        ],
      },
      {
        kind: "train",
        words: ["Eat", "Bread"],
        kurdishHint: "بخۆ · نان",
        extraWords: ["Drink", "Apple"],
      },
      {
        kind: "trick",
        showEmoji: "🍎",
        showLabel: "Apple",
        spokenWord: "Apple",
        matches: true,
      },
      {
        kind: "echo",
        prompt: "بڵێ: Milk!",
        target: "Milk!",
        targetKurdish: "شیر!",
      },
      {
        kind: "treasure",
        correctId: "bread",
        pool: [
          c("hungry", "😋", "Hungry"),
          c("apple", "🍎", "Apple"),
          c("bread", "🍞", "Bread"),
          c("milk", "🥛", "Milk"),
        ],
      },
    ],
  },

  {
    topic: "Play Time!",
    topicKu: "کاتی یاری!",
    words: [
      { english: "Play", kurdish: "یاری" },
      { english: "Run", kurdish: "ڕاکردن" },
      { english: "Jump", kurdish: "بازدان" },
      { english: "Ball", kurdish: "تۆپ" },
    ],
    voices: [],
    sentences: [],
    fillBlanks: [],
    conversations: [],
    kidsGames: [
      {
        kind: "scene",
        scene: "playground",
        prompt: "Tap the Ball.",
        correctId: "ball",
        choices: [
          c("ball", "⚽", "Ball"),
          c("jump", "🤸", "Jump"),
          c("run", "🏃", "Run"),
          c("play", "🎮", "Play"),
        ],
      },
      {
        kind: "bubble",
        prompt: "Catch the kid who can Jump.",
        correctId: "jump",
        choices: [
          c("jump", "🤸", "Jump"),
          c("run", "🏃", "Run"),
          c("ball", "⚽", "Ball"),
          c("sit", "🪑", "Sit"),
        ],
      },
      {
        kind: "feed",
        mascotEmoji: "🦊",
        prompt: "I want to Play! Give the Ball.",
        correctId: "ball",
        choices: [
          c("ball", "⚽", "Ball"),
          c("run", "👟", "Run"),
          c("jump", "🤸", "Jump"),
        ],
      },
      {
        kind: "shadow",
        prompt: "Match play things to shadows.",
        items: [
          c("ball", "⚽", "Ball"),
          c("run", "👟", "Run"),
          c("jump", "🤸", "Jump"),
        ],
      },
      {
        kind: "native",
        kurdishPrompt: "ڕاکردن",
        correctId: "run",
        choices: [
          c("run", "🏃", "Run"),
          c("jump", "🤸", "Jump"),
          c("ball", "⚽", "Ball"),
          c("play", "🎮", "Play"),
        ],
      },
      {
        kind: "simon",
        phrase: "Jump high!",
        correctId: "jump",
        choices: [
          c("jump", "🤸", "Jump high"),
          c("run", "🏃", "Run"),
          c("ball", "⚽", "Kick ball"),
          c("sleep", "😴", "Sleep"),
        ],
      },
      {
        kind: "train",
        words: ["Play", "Ball"],
        kurdishHint: "یاری · تۆپ",
        extraWords: ["Run", "Jump"],
      },
      {
        kind: "trick",
        showEmoji: "😴",
        showLabel: "Sleeping cat",
        spokenWord: "Run",
        matches: false,
      },
      {
        kind: "echo",
        prompt: "بڵێ: Jump!",
        target: "Jump!",
        targetKurdish: "بازدان!",
      },
      {
        kind: "treasure",
        correctId: "play",
        pool: [
          c("play", "🎮", "Play"),
          c("run", "🏃", "Run"),
          c("jump", "🤸", "Jump"),
          c("ball", "⚽", "Ball"),
        ],
      },
    ],
  },

  {
    topic: "My Clothes",
    topicKu: "جلوبەرگم",
    words: [
      { english: "Shirt", kurdish: "کراس" },
      { english: "Pants", kurdish: "پانتۆڵ" },
      { english: "Shoes", kurdish: "پێڵاو" },
      { english: "Cold", kurdish: "سەرما" },
    ],
    voices: [],
    sentences: [],
    fillBlanks: [],
    conversations: [],
    kidsGames: [
      {
        kind: "scene",
        scene: "closet",
        prompt: "Tap the Shoes.",
        correctId: "shoes",
        choices: [
          c("shoes", "👟", "Shoes"),
          c("shirt", "👕", "Shirt"),
          c("pants", "👖", "Pants"),
          c("cold", "🥶", "Cold"),
        ],
      },
      {
        kind: "bubble",
        prompt: "Catch the Pants.",
        correctId: "pants",
        choices: [
          c("pants", "👖", "Pants"),
          c("shirt", "👕", "Shirt"),
          c("shoes", "👟", "Shoes"),
          c("cold", "🥶", "Cold"),
        ],
      },
      {
        kind: "feed",
        mascotEmoji: "🐧",
        prompt: "I am Cold! Give a Shirt.",
        correctId: "shirt",
        choices: [
          c("shirt", "👕", "Shirt"),
          c("pants", "👖", "Pants"),
          c("shoes", "👟", "Shoes"),
        ],
      },
      {
        kind: "shadow",
        prompt: "Match clothes to shadows.",
        items: [
          c("shirt", "👕", "Shirt"),
          c("pants", "👖", "Pants"),
          c("shoes", "👟", "Shoes"),
        ],
      },
      {
        kind: "native",
        kurdishPrompt: "سەرما",
        correctId: "cold",
        choices: [
          c("cold", "🥶", "Cold"),
          c("shirt", "👕", "Shirt"),
          c("shoes", "👟", "Shoes"),
          c("pants", "👖", "Pants"),
        ],
      },
      {
        kind: "simon",
        phrase: "Put on shoes!",
        correctId: "shoes",
        choices: [
          c("shoes", "👟", "Tie shoes"),
          c("shirt", "👕", "Shirt"),
          c("hat", "🧢", "Hat"),
          c("cold", "🥶", "Cold"),
        ],
      },
      {
        kind: "train",
        words: ["Blue", "Shirt"],
        kurdishHint: "شین · کراس",
        extraWords: ["Red", "Pants"],
      },
      {
        kind: "trick",
        showEmoji: "👕",
        showLabel: "Shirt",
        spokenWord: "Shirt",
        matches: true,
      },
      {
        kind: "echo",
        prompt: "بڵێ: Shoes!",
        target: "Shoes!",
        targetKurdish: "پێڵاو!",
      },
      {
        kind: "treasure",
        correctId: "pants",
        pool: [
          c("shirt", "👕", "Shirt"),
          c("pants", "👖", "Pants"),
          c("shoes", "👟", "Shoes"),
          c("cold", "🥶", "Cold"),
        ],
      },
    ],
  },

  {
    topic: "Family House",
    topicKu: "خانووی خێزان",
    words: [
      { english: "Mom", kurdish: "دایک" },
      { english: "Dad", kurdish: "باوک" },
      { english: "House", kurdish: "خانوو" },
      { english: "Door", kurdish: "دەرگا" },
    ],
    voices: [],
    sentences: [],
    fillBlanks: [],
    conversations: [],
    kidsGames: [
      {
        kind: "scene",
        scene: "yard",
        prompt: "Tap the Door.",
        correctId: "door",
        choices: [
          c("door", "🚪", "Door"),
          c("house", "🏠", "House"),
          c("mom", "👩", "Mom"),
          c("dad", "👨", "Dad"),
        ],
      },
      {
        kind: "bubble",
        prompt: "Catch Mom.",
        correctId: "mom",
        choices: [
          c("mom", "👩", "Mom"),
          c("dad", "👨", "Dad"),
          c("door", "🚪", "Door"),
          c("house", "🏠", "House"),
        ],
      },
      {
        kind: "feed",
        mascotEmoji: "🏠",
        prompt: "Open the Door! Use the key.",
        correctId: "key",
        choices: [
          c("key", "🔑", "Key"),
          c("door", "🚪", "Door"),
          c("mom", "👩", "Mom"),
        ],
      },
      {
        kind: "shadow",
        prompt: "Match home things to shadows.",
        items: [
          c("house", "🏠", "House"),
          c("door", "🚪", "Door"),
          c("key", "🔑", "Keys"),
        ],
      },
      {
        kind: "native",
        kurdishPrompt: "باوک",
        correctId: "dad",
        choices: [
          c("dad", "👨", "Dad"),
          c("mom", "👩", "Mom"),
          c("house", "🏠", "House"),
          c("door", "🚪", "Door"),
        ],
      },
      {
        kind: "simon",
        phrase: "Hug Mom!",
        correctId: "hug",
        choices: [
          c("hug", "🤗", "Hug"),
          c("run", "🏃", "Run"),
          c("door", "🚪", "Door"),
          c("dad", "👨", "Dad"),
        ],
      },
      {
        kind: "train",
        words: ["My", "House"],
        kurdishHint: "خانووەکەم",
        extraWords: ["Your", "Door"],
      },
      {
        kind: "trick",
        showEmoji: "👨",
        showLabel: "Dad",
        spokenWord: "Mom",
        matches: false,
      },
      {
        kind: "echo",
        prompt: "بڵێ: House!",
        target: "House!",
        targetKurdish: "خانوو!",
      },
      {
        kind: "treasure",
        correctId: "mom",
        pool: [
          c("mom", "👩", "Mom"),
          c("dad", "👨", "Dad"),
          c("house", "🏠", "House"),
          c("door", "🚪", "Door"),
        ],
      },
    ],
  },
];

export default kidsUnit3;
