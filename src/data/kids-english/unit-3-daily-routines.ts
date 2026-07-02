import type { UnitBank } from "../types";

// ── Kids Unit 3: Daily Routines (ڕووتینی ڕۆژانە) ─────────────────────────────
const kidsUnit3: UnitBank = [
  // Lesson 0: Good Morning
  {
    topic: "Good Morning", topicKu: "بەیانی باش", topicAr: "صباح الخير",
    words: [
      { english: "Wake up", kurdish: "هەستان لە خەو", arabic: "استيقظ" },
      { english: "Water", kurdish: "ئاو", arabic: "ماء" },
      { english: "Face", kurdish: "دەموچاو", arabic: "وجه" },
      { english: "Happy", kurdish: "دڵخۆش", arabic: "سعيد" },
      { english: "Morning", kurdish: "بەیانی", arabic: "صباح" },
    ],
    voices: [
      { prompt: "بڵێ: هەڵسە لە خەو", target: "Wake up.", targetKurdish: "هەڵسە لە خەو." },
      { prompt: "بڵێ: دەموچاو دەشۆم", target: "I wash my face.", targetKurdish: "دەموچاوم دەشۆم." },
    ],
    sentences: [
      { english: ["I", "wake", "up"], kurdish: "لە خەو هەڵدەستم", arabic: "أنا أستيقظ" },
      { english: ["I", "wash", "my", "face"], kurdish: "دەموچاوم دەشۆم", arabic: "أغسل وجهي" },
    ],
    fillBlanks: [
      { parts: ["I drink", "in the morning"], hint: "بەیانیان ئاو دەخۆمەوە", answer: "water", wrongs: ["face", "happy", "sleep"] },
      { parts: ["I feel very", ""], hint: "زۆر هەست بە دڵخۆشی دەکەم", answer: "happy", wrongs: ["sad", "mad", "water"] },
    ],
    conversations: [
      {
        situation: "دایکت بەیانی باش دەکات",
        theyAsk: "Good morning! Did you sleep well?",
        correct: "Yes, I am happy!",
        wrong1: "I wash face.",
        wrong2: "Wake up.",
        wrong3: "The morning is present.",
        explanation: "بڵێ: 'Yes, I am happy!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I wake up.", targetKurdish: "لە خەو هەڵدەستم.", imageRequire: require("../../../assets/images/games/kid_waking_up.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the glass of water!", correctId: "water", choices: [{ id: "water", emoji: "🥛", label: "Water" }, { id: "fire", emoji: "🔥", label: "Fire" }] },
      { kind: "bubble", prompt: "Pop the happy face!", correctId: "happy", choices: [{ id: "happy", emoji: "😀", label: "Happy" }, { id: "sad", emoji: "😢", label: "Sad" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Feed the child some clean water!", correctId: "water", choices: [{ id: "water", emoji: "🥛", label: "Water" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match sun and moon!", items: [{ id: "sun", emoji: "☀️", label: "Sun" }, { id: "moon", emoji: "🌙", label: "Moon" }] },
      { kind: "native", kurdishPrompt: "دەموچاو بدۆزەرەوە", correctId: "face", choices: [{ id: "face", emoji: "👦", label: "Face" }, { id: "hand", emoji: "🖐️", label: "Hand" }] },
      { kind: "simon", phrase: "Simon says, pick the sun!", correctId: "sun", choices: [{ id: "sun", emoji: "☀️", label: "Sun" }, { id: "cloud", emoji: "☁️", label: "Cloud" }] },
      { kind: "train", words: ["I", "wake", "up"], kurdishHint: "لە خەو هەڵدەستم" },
      { kind: "trick", showEmoji: "☀️", showLabel: "Sun", spokenWord: "Sun", matches: true },
      { kind: "treasure", correctId: "happy_star", pool: [{ id: "happy_star", emoji: "⭐️", label: "Happy Star" }, { id: "sad_cloud", emoji: "🌧️", label: "Rainy Cloud" }] }
    ],
  },

  // Lesson 1: Hungry
  {
    topic: "Hungry", topicKu: "برسی", topicAr: "جائع",
    words: [
      { english: "Hungry", kurdish: "برسیمە", arabic: "جائع" },
      { english: "Apple", kurdish: "سێو", arabic: "تفاحة" },
      { english: "Bread", kurdish: "نان", arabic: "خبز" },
      { english: "Milk", kurdish: "شیر", arabic: "حليب" },
      { english: "Eat", kurdish: "خواردن", arabic: "يأكل" },
    ],
    voices: [
      { prompt: "بڵێ: من برسیمە", target: "I am hungry.", targetKurdish: "من برسیمە." },
      { prompt: "بڵێ: شیر دەخۆمەوە", target: "I drink milk.", targetKurdish: "شیر دەخۆمەوە." },
    ],
    sentences: [
      { english: ["I", "am", "hungry"], kurdish: "من برسیمە", arabic: "أنا جائع" },
      { english: ["I", "eat", "an", "apple"], kurdish: "سێوێک دەخۆم", arabic: "أنا آكل تفاحة" },
    ],
    fillBlanks: [
      { parts: ["I eat", "for breakfast"], hint: "نان بۆ نانی بەیانی دەخۆم", answer: "bread", wrongs: ["milk", "water", "juice"] },
      { parts: ["I want to", "an apple"], hint: "دەمەوێت سێوێک بخۆم", answer: "eat", wrongs: ["drink", "sleep", "run"] },
    ],
    conversations: [
      {
        situation: "دایکت دەپرسێت چیت دەوێت",
        theyAsk: "Are you hungry?",
        correct: "Yes, I want an apple!",
        wrong1: "I am thirsty.",
        wrong2: "I want a car.",
        wrong3: "I desire nutrition.",
        explanation: "وەڵام بدەوە: 'Yes, I want an apple!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "What is he doing?", target: "I eat an apple.", targetKurdish: "سێوێک دەخۆم.", imageRequire: require("../../../assets/images/games/kid_eating_apple.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the red apple!", correctId: "apple", choices: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "bubble", prompt: "Pop the fresh milk!", correctId: "milk", choices: [{ id: "milk", emoji: "🥛", label: "Milk" }, { id: "juice", emoji: "🧃", label: "Juice" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Feed the hungry child some bread!", correctId: "bread", choices: [{ id: "bread", emoji: "🍞", label: "Bread" }, { id: "shoe", emoji: "👞", label: "Shoe" }] },
      { kind: "shadow", prompt: "Match apple and milk!", items: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "milk", emoji: "🥛", label: "Milk" }] },
      { kind: "native", kurdishPrompt: "سێو بدۆزەرەوە", correctId: "apple", choices: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "bread", emoji: "🍞", label: "Bread" }] },
      { kind: "simon", phrase: "Simon says, pick the bread!", correctId: "bread", choices: [{ id: "bread", emoji: "🍞", label: "Bread" }, { id: "cake", emoji: "🍰", label: "Cake" }] },
      { kind: "train", words: ["I", "am", "hungry"], kurdishHint: "من برسیمە" },
      { kind: "trick", showEmoji: "🍎", showLabel: "Apple", spokenWord: "Apple", matches: true },
      { kind: "treasure", correctId: "milk_glass", pool: [{ id: "milk_glass", emoji: "🥛", label: "Milk" }, { id: "empty_glass", emoji: "🫗", label: "Empty" }] }
    ],
  },

  // Lesson 2: Play Time
  {
    topic: "Play Time", topicKu: "کاتی یاری", topicAr: "وقت اللعب",
    words: [
      { english: "Play", kurdish: "یاری", arabic: "يلعب" },
      { english: "Run", kurdish: "ڕاکردن", arabic: "يجري" },
      { english: "Jump", kurdish: "بازدان", arabic: "يقفز" },
      { english: "Ball", kurdish: "تۆپ", arabic: "كرة" },
      { english: "Fun", kurdish: "خۆش", arabic: "ممتع" },
    ],
    voices: [
      { prompt: "بڵێ: یاری دەکەین", target: "We play.", targetKurdish: "یاری دەکەین." },
      { prompt: "بڵێ: تۆپەکە هەڵدەدەم", target: "I throw the ball.", targetKurdish: "تۆپەکە هەڵدەدەم." },
    ],
    sentences: [
      { english: ["We", "play", "with", "a", "ball"], kurdish: "یاری بە تۆپ دەکەین", arabic: "نلعب بالكرة" },
      { english: ["I", "can", "run", "fast"], kurdish: "دەتوانم خێرا ڕابکەم", arabic: "أستطيع الجري بسرعة" },
    ],
    fillBlanks: [
      { parts: ["I like to", "high"], hint: "حەزم لە بازدانی بەرزە", answer: "jump", wrongs: ["sleep", "eat", "drink"] },
      { parts: ["Playing is very", ""], hint: "یاریکردن زۆر خۆشە", answer: "fun", wrongs: ["sad", "bad", "mad"] },
    ],
    conversations: [
      {
        situation: "لە باخچەیت و هاوڕێیەک تۆپێکی پێیە",
        theyAsk: "Do you want to play?",
        correct: "Yes, let's play with the ball!",
        wrong1: "I jump.",
        wrong2: "Ball is round.",
        wrong3: "I am ready for physical activity.",
        explanation: "وەڵامی دروست: 'Yes, let's play with the ball!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "What are they doing?", target: "We play with a ball.", targetKurdish: "یاری بە تۆپ دەکەین.", imageRequire: require("../../../assets/images/games/kids_playing_ball.png") },
      { kind: "scene", scene: "playground", prompt: "Find the ball!", correctId: "ball", choices: [{ id: "ball", emoji: "⚽", label: "Ball" }, { id: "shoe", emoji: "👞", label: "Shoe" }] },
      { kind: "bubble", prompt: "Pop the running shoe!", correctId: "shoe", choices: [{ id: "shoe", emoji: "👟", label: "Shoe" }, { id: "sock", emoji: "🧦", label: "Sock" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the child the colorful ball!", correctId: "ball", choices: [{ id: "ball", emoji: "⚽", label: "Ball" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "shadow", prompt: "Match ball and shoe!", items: [{ id: "ball", emoji: "⚽", label: "Ball" }, { id: "shoe", emoji: "👟", label: "Shoe" }] },
      { kind: "native", kurdishPrompt: "تۆپەکە بدۆزەرەوە", correctId: "ball", choices: [{ id: "ball", emoji: "⚽", label: "Ball" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "simon", phrase: "Simon says, jump high!", correctId: "jump", choices: [{ id: "jump", emoji: "🦘", label: "Jump" }, { id: "sit", emoji: "🪑", label: "Sit" }] },
      { kind: "train", words: ["We", "play", "fun", "games"], kurdishHint: "یاری خۆش دەکەین" },
      { kind: "trick", showEmoji: "⚽", showLabel: "Ball", spokenWord: "Ball", matches: true },
      { kind: "treasure", correctId: "gold_medal", pool: [{ id: "gold_medal", emoji: "🥇", label: "Gold Medal" }, { id: "grey_rock", emoji: "🪨", label: "Rock" }] }
    ],
  },

  // Lesson 3: My Clothes
  {
    topic: "My Clothes", topicKu: "جلوبەرگم", topicAr: "ملابسي",
    words: [
      { english: "Shirt", kurdish: "کراس", arabic: "قميص" },
      { english: "Pants", kurdish: "پانتۆڵ", arabic: "بنطلون" },
      { english: "Shoes", kurdish: "پێڵاو", arabic: "حذاء" },
      { english: "Cold", kurdish: "سەرما", arabic: "برد" },
      { english: "Wear", kurdish: "لەبەرکردن", arabic: "يلبس" },
    ],
    voices: [
      { prompt: "بڵێ: پێڵاوەکانم لەپێ دەکەم", target: "I wear my shoes.", targetKurdish: "پێڵاوەکانم لەپێ دەکەم." },
      { prompt: "بڵێ: من سەرمامە", target: "I am cold.", targetKurdish: "من سەرمامە." },
    ],
    sentences: [
      { english: ["I", "wear", "a", "shirt"], kurdish: "کراسێک لەبەر دەکەم", arabic: "أنا ألبس قميصًا" },
      { english: ["I", "am", "cold"], kurdish: "من سەرمامە", arabic: "أشعر بالبرد" },
    ],
    fillBlanks: [
      { parts: ["I put on my blue", ""], hint: "پانتۆڵە شینەکەم لەبەر دەکەم", answer: "pants", wrongs: ["apple", "dog", "car"] },
      { parts: ["It is", "outside"], hint: "لە دەرەوە سەرمایە", answer: "cold", wrongs: ["hot", "happy", "sad"] },
    ],
    conversations: [
      {
        situation: "سەرمایە و دایکت پێت دەڵێت",
        theyAsk: "It is cold! What should you wear?",
        correct: "I will wear a shirt and pants.",
        wrong1: "I will wear an apple.",
        wrong2: "I wear shoes.",
        wrong3: "I shall clothe myself.",
        explanation: "بڵێ: 'I will wear a shirt and pants.'" ,
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the clothes:", target: "I wear a shirt.", targetKurdish: "کراسێک لەبەر دەکەم.", imageRequire: require("../../../assets/images/games/kid_wearing_shoes.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the shoes!", correctId: "shoes", choices: [{ id: "shoes", emoji: "👟", label: "Shoes" }, { id: "hat", emoji: "🧢", label: "Hat" }] },
      { kind: "bubble", prompt: "Pop the pants!", correctId: "pants", choices: [{ id: "pants", emoji: "👖", label: "Pants" }, { id: "shirt", emoji: "👕", label: "Shirt" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the cold child a warm shirt!", correctId: "shirt", choices: [{ id: "shirt", emoji: "👕", label: "Shirt" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match shirt and pants!", items: [{ id: "shirt", emoji: "👕", label: "Shirt" }, { id: "pants", emoji: "👖", label: "Pants" }] },
      { kind: "native", kurdishPrompt: "پێڵاوەکان بدۆزەرەوە", correctId: "shoes", choices: [{ id: "shoes", emoji: "👟", label: "Shoes" }, { id: "sock", emoji: "🧦", label: "Sock" }] },
      { kind: "simon", phrase: "Simon says, pick the shirt!", correctId: "shirt", choices: [{ id: "shirt", emoji: "👕", label: "Shirt" }, { id: "pants", emoji: "👖", label: "Pants" }] },
      { kind: "train", words: ["I", "am", "cold"], kurdishHint: "من سەرمامە" },
      { kind: "trick", showEmoji: "👕", showLabel: "Shirt", spokenWord: "Shirt", matches: true },
      { kind: "treasure", correctId: "blue_shoes", pool: [{ id: "blue_shoes", emoji: "👟", label: "Blue Shoes" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],
  },

  // Lesson 4: Family House
  {
    topic: "Family House", topicKu: "خانووی خێزان", topicAr: "بيت العائلة",
    words: [
      { english: "House", kurdish: "خانوو", arabic: "منزل" },
      { english: "Door", kurdish: "دەرگا", arabic: "باب" },
      { english: "Mom", kurdish: "دایک", arabic: "أمي" },
      { english: "Dad", kurdish: "باوک", arabic: "أبي" },
      { english: "Home", kurdish: "ماڵەوە", arabic: "بيت" },
    ],
    voices: [
      { prompt: "بڵێ: ئەمە ماڵی منە", target: "This is my home.", targetKurdish: "ئەمە ماڵی منە." },
      { prompt: "بڵێ: دایک و باوکم خۆشدەوێت", target: "I love my mom and dad.", targetKurdish: "دایک و باوکم خۆشدەوێت." },
    ],
    sentences: [
      { english: ["This", "is", "my", "home"], kurdish: "ئەمە ماڵی منە", arabic: "هذا بيتي" },
      { english: ["I", "love", "my", "mom"], kurdish: "دایکمم خۆشدەوێت", arabic: "أنا أحب أمي" },
    ],
    fillBlanks: [
      { parts: ["Open the", "please"], hint: "دەرگاکە بکەرەوە تکایە", answer: "door", wrongs: ["house", "mom", "dad"] },
      { parts: ["My", "is warm"], hint: "ماڵەکەم گەرمە", answer: "home", wrongs: ["door", "pants", "shoes"] },
    ],
    conversations: [
      {
        situation: "مامۆستا دەپرسێت لەگەڵ کێ دەژیت",
        theyAsk: "Who lives in your house?",
        correct: "My mom and dad!",
        wrong1: "I live in house.",
        wrong2: "Open the door.",
        wrong3: "My parental units live with me.",
        explanation: "بۆ منداڵ بڵێ: 'My mom and dad!'" ,
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "This is my family at home.", targetKurdish: "ئەمە خێزانەکەمە لە ماڵەوە.", imageRequire: require("../../../assets/images/games/family_at_home.png") },
      { kind: "scene", scene: "street", prompt: "Find the house!", correctId: "house", choices: [{ id: "house", emoji: "🏠", label: "House" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "bubble", prompt: "Pop the door!", correctId: "door", choices: [{ id: "door", emoji: "🚪", label: "Door" }, { id: "key", emoji: "🔑", label: "Key" }] },
      { kind: "feed", mascotEmoji: "👨", prompt: "Give Dad the key to the door!", correctId: "key", choices: [{ id: "key", emoji: "🔑", label: "Key" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match door and window!", items: [{ id: "door", emoji: "🚪", label: "Door" }, { id: "window", emoji: "🪟", label: "Window" }] },
      { kind: "native", kurdishPrompt: "دایک بدۆزەرەوە", correctId: "mom", choices: [{ id: "mom", emoji: "👩", label: "Mom" }, { id: "dad", emoji: "👨", label: "Dad" }] },
      { kind: "simon", phrase: "Simon says, pick the house!", correctId: "house", choices: [{ id: "house", emoji: "🏠", label: "House" }, { id: "tree", emoji: "🌳", label: "Tree" }] },
      { kind: "train", words: ["This", "is", "my", "home"], kurdishHint: "ئەمە ماڵی منە" },
      { kind: "trick", showEmoji: "🏠", showLabel: "House", spokenWord: "House", matches: true },
      { kind: "treasure", correctId: "home_key", pool: [{ id: "home_key", emoji: "🔑", label: "Key" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 5: Clean Up
  {
    topic: "Clean Up", topicKu: "پاککردنەوە", topicAr: "التنظيف",
    words: [
      { english: "Wash", kurdish: "شۆردن", arabic: "يغسل" },
      { english: "Clean", kurdish: "پاک", arabic: "نظيف" },
      { english: "Brush", kurdish: "فڵچەکردن", arabic: "فرشاة" },
      { english: "Soap", kurdish: "سابوون", arabic: "صابون" },
      { english: "Toothbrush", kurdish: "فڵچەی ددان", arabic: "فرشاة أسنان" },
    ],
    voices: [
      { prompt: "بڵێ: دەستەکانم دەشۆم", target: "I wash my hands.", targetKurdish: "دەستەکانم دەشۆم." },
      { prompt: "بڵێ: سابوونەکە پاکە", target: "The soap is clean.", targetKurdish: "سابوونەکە پاکە." },
    ],
    sentences: [
      { english: ["I", "wash", "my", "hands"], kurdish: "دەستەکانم دەشۆم", arabic: "أنا أغسل يدي" },
      { english: ["The", "soap", "is", "clean"], kurdish: "سابوونەکە پاکە", arabic: "الصابون نظيف" },
    ],
    fillBlanks: [
      { parts: ["I use", "to clean my teeth"], hint: "فڵچەی ددان بەکاردێنم بۆ پاککردنەوەی ددانەکانم", answer: "toothbrush", wrongs: ["soap", "wash", "door"] },
      { parts: ["I", "my face"], hint: "دەموچاوم دەشۆم", answer: "wash", wrongs: ["brush", "soap", "clean"] },
    ],
    conversations: [
      {
        situation: "مامۆستا پێش نانخواردن پێت دەڵێت",
        theyAsk: "Your hands are dirty! What should you do?",
        correct: "I will wash with soap!",
        wrong1: "I have toothbrush.",
        wrong2: "Clean house.",
        wrong3: "I shall sanitize my hands.",
        explanation: "بڵێ: 'I will wash with soap!'" ,
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the action:", target: "I wash my face.", targetKurdish: "دەموچاوم دەشۆم.", imageRequire: require("../../../assets/images/games/kid_taking_bath.png") },
      { kind: "scene", scene: "bathroom", prompt: "Find the toothbrush!", correctId: "toothbrush", choices: [{ id: "toothbrush", emoji: "🪥", label: "Toothbrush" }, { id: "cup", emoji: "🥛", label: "Cup" }] },
      { kind: "bubble", prompt: "Pop the soap bubble!", correctId: "soap", choices: [{ id: "soap", emoji: "🧼", label: "Soap" }, { id: "water", emoji: "💧", label: "Water" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the child the soap to wash!", correctId: "soap", choices: [{ id: "soap", emoji: "🧼", label: "Soap" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match soap and toothbrush!", items: [{ id: "soap", emoji: "🧼", label: "Soap" }, { id: "toothbrush", emoji: "🪥", label: "Toothbrush" }] },
      { kind: "native", kurdishPrompt: "سابوون بدۆزەرەوە", correctId: "soap", choices: [{ id: "soap", emoji: "🧼", label: "Soap" }, { id: "sponge", emoji: "🧽", label: "Sponge" }] },
      { kind: "simon", phrase: "Simon says, wash your hands!", correctId: "wash", choices: [{ id: "wash", emoji: "🧼", label: "Wash" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "train", words: ["I", "wash", "my", "hands"], kurdishHint: "دەستەکانم دەشۆم" },
      { kind: "trick", showEmoji: "🪥", showLabel: "Toothbrush", spokenWord: "Toothbrush", matches: true },
      { kind: "treasure", correctId: "clean_towel", pool: [{ id: "clean_towel", emoji: "🧼", label: "Clean Towel" }, { id: "dust", emoji: "💨", label: "Dust" }] }
    ],
  },

  // Lesson 6: Night Time
  {
    topic: "Night Time", topicKu: "کاتی شەو", topicAr: "وقت الليل",
    words: [
      { english: "Sleep", kurdish: "خەوتن", arabic: "ينام" },
      { english: "Bed", kurdish: "جێگای خەوتن", arabic: "سرير" },
      { english: "Night", kurdish: "شەو", arabic: "ليل" },
      { english: "Star", kurdish: "ئەستێرە", arabic: "نجمة" },
      { english: "Moon", kurdish: "مانگ", arabic: "قمر" },
    ],
    voices: [
      { prompt: "بڵێ: کاتی خەوتنە", target: "It is time to sleep.", targetKurdish: "کاتی خەوتنە." },
      { prompt: "بڵێ: مانگ و ئەستێرەکان دەبینم", target: "I see the moon and stars.", targetKurdish: "مانگ و ئەستێرەکان دەبینم." },
    ],
    sentences: [
      { english: ["It", "is", "night"], kurdish: "شەوە", arabic: "إنه الليل" },
      { english: ["I", "sleep", "in", "my", "bed"], kurdish: "لە جێگاکەمدا دەخەوم", arabic: "أنام في سريري" },
    ],
    fillBlanks: [
      { parts: ["The", "shines at night"], hint: "مانگەکە بە شەو دەدرەوشێتەوە", answer: "moon", wrongs: ["sun", "bed", "sleep"] },
      { parts: ["I go to", ""], hint: "دەچمە سەر جێگای خەوتنەکەم", answer: "bed", wrongs: ["star", "moon", "night"] },
    ],
    conversations: [
      {
        situation: "دایکت دەڵێت کاتی خەوتنە",
        theyAsk: "It is night! Are you ready for bed?",
        correct: "Yes, I want to sleep!",
        wrong1: "I see sun.",
        wrong2: "Good morning.",
        wrong3: "I shall commence sleep.",
        explanation: "بڵێ: 'Yes, I want to sleep!'" ,
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I read a book before bed.", targetKurdish: "پێش خەوتن کتێب دەخوێنمەوە.", imageRequire: require("../../../assets/images/games/kid_reading_book.png") },
      { kind: "scene", scene: "night", prompt: "Find the bed!", correctId: "bed", choices: [{ id: "bed", emoji: "🛏️", label: "Bed" }, { id: "chair", emoji: "🪑", label: "Chair" }] },
      { kind: "bubble", prompt: "Pop the yellow star!", correctId: "star", choices: [{ id: "star", emoji: "⭐️", label: "Star" }, { id: "cloud", emoji: "☁️", label: "Cloud" }] },
      { kind: "feed", mascotEmoji: "🦉", prompt: "Put the sleepy owl to bed!", correctId: "bed", choices: [{ id: "bed", emoji: "🛏️", label: "Bed" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match moon and star!", items: [{ id: "moon", emoji: "🌙", label: "Moon" }, { id: "star", emoji: "⭐️", label: "Star" }] },
      { kind: "native", kurdishPrompt: "مانگەکە بدۆزەرەوە", correctId: "moon", choices: [{ id: "moon", emoji: "🌙", label: "Moon" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "simon", phrase: "Simon says, pick the star!", correctId: "star", choices: [{ id: "star", emoji: "⭐️", label: "Star" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "train", words: ["It", "is", "night"], kurdishHint: "شەوە" },
      { kind: "trick", showEmoji: "🌙", showLabel: "Moon", spokenWord: "Moon", matches: true },
      { kind: "treasure", correctId: "crescent_moon", pool: [{ id: "crescent_moon", emoji: "🌙", label: "Crescent Moon" }, { id: "sun", emoji: "☀️", label: "Sun" }] }
    ],
  },

  // Lesson 7: My Body
  {
    topic: "My Body", topicKu: "جەستەم", topicAr: "جسدي",
    words: [
      { english: "Hand", kurdish: "دەست", arabic: "يد" },
      { english: "Foot", kurdish: "پێ", arabic: "قدم" },
      { english: "Eye", kurdish: "چاو", arabic: "عين" },
      { english: "Ear", kurdish: "گوێ", arabic: "أذن" },
      { english: "Nose", kurdish: "لووت", arabic: "أنف" },
    ],
    voices: [
      { prompt: "بڵێ: دوو چاوم هەیە", target: "I have two eyes.", targetKurdish: "دوو چاوم هەیە." },
      { prompt: "بڵێ: لووتم نیشان بدە", target: "Touch your nose.", targetKurdish: "لووتت نیشان بدە." },
    ],
    sentences: [
      { english: ["I", "have", "two", "eyes"], kurdish: "دوو چاوم هەیە", arabic: "لدي عينان" },
      { english: ["Touch", "your", "nose"], kurdish: "دەست لە لووتت بدە", arabic: "المس أنفك" },
    ],
    fillBlanks: [
      { parts: ["I wave my", ""], hint: "دەستم دەوەشێنم", answer: "hand", wrongs: ["foot", "eye", "ear"] },
      { parts: ["I listen with my", ""], hint: "بە گوێم گوێ دەگرم", answer: "ear", wrongs: ["eye", "nose", "foot"] },
    ],
    conversations: [
      {
        situation: "مامۆستا یاری جەستەت لەگەڵ دەکات",
        theyAsk: "What do you see with?",
        correct: "I see with my eyes!",
        wrong1: "I see with my hand.",
        wrong2: "Touch your ear.",
        wrong3: "I utilize my visual organs.",
        explanation: "بڵێ: 'I see with my eyes!'" ,
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I wash my hands.", targetKurdish: "دەستەکانم دەشۆم.", imageRequire: require("../../../assets/images/games/kid_taking_bath.png") },
      { kind: "scene", scene: "classroom", prompt: "Find the hand!", correctId: "hand", choices: [{ id: "hand", emoji: "🖐️", label: "Hand" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "bubble", prompt: "Pop the blue eye!", correctId: "eye", choices: [{ id: "eye", emoji: "👁️", label: "Eye" }, { id: "ear", emoji: "👂", label: "Ear" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the waving boy a high-five!", correctId: "hand", choices: [{ id: "hand", emoji: "🖐️", label: "Hand" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match eye and ear!", items: [{ id: "eye", emoji: "👁️", label: "Eye" }, { id: "ear", emoji: "👂", label: "Ear" }] },
      { kind: "native", kurdishPrompt: "لووت بدۆزەرەوە", correctId: "nose", choices: [{ id: "nose", emoji: "👃", label: "Nose" }, { id: "hand", emoji: "🖐️", label: "Hand" }] },
      { kind: "simon", phrase: "Simon says, touch your nose!", correctId: "nose", choices: [{ id: "nose", emoji: "👃", label: "Nose" }, { id: "foot", emoji: "🦶", label: "Foot" }] },
      { kind: "train", words: ["Wash", "your", "face"], kurdishHint: "دەموچاوت بشۆ" },
      { kind: "trick", showEmoji: "👃", showLabel: "Nose", spokenWord: "Nose", matches: true },
      { kind: "treasure", correctId: "left_hand", pool: [{ id: "left_hand", emoji: "🖐️", label: "Hand" }, { id: "boot", emoji: "🥾", label: "Boot" }] }
    ],
  },

  // Lesson 8: Daily Actions
  {
    topic: "Daily Actions", topicKu: "کردارەکانی ڕۆژانە", topicAr: "الأفعال اليومية",
    words: [
      { english: "Brush teeth", kurdish: "ددان شوشتن", arabic: "ينظف أسنانه" },
      { english: "Wash face", kurdish: "دەموچاو شوشتن", arabic: "يغسل وجهه" },
      { english: "Put on clothes", kurdish: "جلوبەرگ لەبەرکردن", arabic: "يرتدي ملابسه" },
      { english: "Go to sleep", kurdish: "چوون بۆ خەوتن", arabic: "يذهب للنوم" },
    ],
    voices: [
      { prompt: "بڵێ: ددانەکانم دەشۆم", target: "I brush my teeth.", targetKurdish: "ددانەکانم دەشۆم." },
      { prompt: "بڵێ: دەچم دەخەوم", target: "I go to sleep.", targetKurdish: "دەچم دەخەوم." },
    ],
    sentences: [
      { english: ["I", "brush", "my", "teeth"], kurdish: "ددانەکانم دەشۆم", arabic: "أنظف أسناني" },
      { english: ["I", "go", "to", "sleep"], kurdish: "دەچم دەخەوم", arabic: "أنا أذهب للنوم" },
    ],
    fillBlanks: [
      { parts: ["Every morning I", "my face"], hint: "هەموو بەیانییەک دەموچاوم دەشۆم", answer: "wash face", wrongs: ["brush teeth", "go to sleep", "put on clothes"] },
      { parts: ["Before bed I", "my teeth"], hint: "پێش خەوتن ددانەکانم دەشۆم", answer: "brush teeth", wrongs: ["wash face", "go to sleep", "put on clothes"] },
    ],
    conversations: [
      {
        situation: "باوکت دەپرسێت پێش خەوتن چی دەکەیت",
        theyAsk: "What do you do before bed?",
        correct: "I brush my teeth!",
        wrong1: "I put on clothes.",
        wrong2: "Good morning.",
        wrong3: "I perform dental hygiene.",
        explanation: "بۆ منداڵ بڵێ: 'I brush my teeth!'" ,
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the action:", target: "I read a book.", targetKurdish: "کتێب دەخوێنمەوە.", imageRequire: require("../../../assets/images/games/kid_reading_book.png") },
      { kind: "scene", scene: "bathroom", prompt: "Find the soap!", correctId: "soap", choices: [{ id: "soap", emoji: "🧼", label: "Soap" }, { id: "towel", emoji: "🧻", label: "Towel" }] },
      { kind: "bubble", prompt: "Pop the shirt!", correctId: "shirt", choices: [{ id: "shirt", emoji: "👕", label: "Shirt" }, { id: "toothbrush", emoji: "🪥", label: "Toothbrush" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the boy the toothbrush!", correctId: "toothbrush", choices: [{ id: "toothbrush", emoji: "🪥", label: "Toothbrush" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match comb and shirt!", items: [{ id: "comb", emoji: "🪮", label: "Comb" }, { id: "shirt", emoji: "👕", label: "Shirt" }] },
      { kind: "native", kurdishPrompt: "ددان شوشتن بدۆزەرەوە", correctId: "brush", choices: [{ id: "brush", emoji: "🪥", label: "Brush" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "simon", phrase: "Simon says, wash your face!", correctId: "wash", choices: [{ id: "wash", emoji: "🧼", label: "Wash" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "train", words: ["I", "brush", "my", "teeth"], kurdishHint: "ددانەکانم دەشۆم" },
      { kind: "trick", showEmoji: "🪥", showLabel: "Brush Teeth", spokenWord: "Brush teeth", matches: true },
      { kind: "treasure", correctId: "toothpaste", pool: [{ id: "toothpaste", emoji: "🪥", label: "Toothpaste" }, { id: "dirt", emoji: "🪨", label: "Dirt" }] }
    ],
  },

  // Lesson 9: Review Day
  {
    topic: "Review Day", topicKu: "پێداچوونەوەی ڕۆژ", topicAr: "مراجعة اليوم",
    words: [
      { english: "Good morning", kurdish: "بەیانی باش", arabic: "صباح الخير" },
      { english: "Good night", kurdish: "شەو باش", arabic: "تصبح على خير" },
      { english: "Happy", kurdish: "دڵخۆش", arabic: "سعيد" },
      { english: "Tired", kurdish: "ماندوو", arabic: "تعبان" },
      { english: "Sleepy", kurdish: "خەواڵوو", arabic: "نعسان" },
    ],
    voices: [
      { prompt: "بڵێ: بەیانی باش دایکە", target: "Good morning mom.", targetKurdish: "بەیانی باش دایکە." },
      { prompt: "بڵێ: شەو باش باوکە", target: "Good night dad.", targetKurdish: "شەو باش باوکە." },
    ],
    sentences: [
      { english: ["Good", "morning", "mom"], kurdish: "بەیانی باش دایکە", arabic: "صباح الخير يا أمي" },
      { english: ["Good", "night", "dad"], kurdish: "شەو باش باوکە", arabic: "تصبح على خير يا أبي" },
    ],
    fillBlanks: [
      { parts: ["I am", "I want to sleep"], hint: "من خەواڵووم، دەمەوێت بخەوم", answer: "sleepy", wrongs: ["happy", "morning", "night"] },
      { parts: ["I am very", "today"], hint: "من زۆر دڵخۆشم ئەمڕۆ", answer: "happy", wrongs: ["tired", "sleepy", "night"] },
    ],
    conversations: [
      {
        situation: "باوکت شەو باشیت لێدەکات",
        theyAsk: "Good night, sleep well!",
        correct: "Good night, dad!",
        wrong1: "Good morning.",
        wrong2: "I am happy.",
        wrong3: "I wish you a pleasant nocturnal rest.",
        explanation: "بڵێ: 'Good night, dad!'" ,
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the feeling:", target: "I feel very happy.", targetKurdish: "زۆر هەست بە دڵخۆشی دەکەم.", imageRequire: require("../../../assets/images/games/friendly_teacher.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the clock!", correctId: "clock", choices: [{ id: "clock", emoji: "⏰", label: "Clock" }, { id: "pillow", emoji: "🛋️", label: "Pillow" }] },
      { kind: "bubble", prompt: "Pop the sleeping emoji!", correctId: "sleepy", choices: [{ id: "sleepy", emoji: "😴", label: "Sleepy" }, { id: "happy", emoji: "😀", label: "Happy" }] },
      { kind: "feed", mascotEmoji: "🦉", prompt: "Put the tired owl to sleep!", correctId: "bed", choices: [{ id: "bed", emoji: "🛏️", label: "Bed" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "shadow", prompt: "Match sun and moon!", items: [{ id: "morning_sun", emoji: "☀️", label: "Morning" }, { id: "night_moon", emoji: "🌙", label: "Night" }] },
      { kind: "native", kurdishPrompt: "دڵخۆش بدۆزەرەوە", correctId: "happy", choices: [{ id: "happy", emoji: "😀", label: "Happy" }, { id: "tired", emoji: "🥱", label: "Tired" }] },
      { kind: "simon", phrase: "Simon says, say good night!", correctId: "goodnight", choices: [{ id: "goodnight", emoji: "👋", label: "Good Night" }, { id: "wake", emoji: "⏰", label: "Wake" }] },
      { kind: "train", words: ["I", "feel", "very", "happy"], kurdishHint: "من زۆر دڵخۆشم" },
      { kind: "trick", showEmoji: "😴", showLabel: "Sleepy", spokenWord: "Sleepy", matches: true },
      { kind: "treasure", correctId: "happy_star", pool: [{ id: "happy_star", emoji: "⭐️", label: "Happy Star" }, { id: "grey_rock", emoji: "🪨", label: "Rock" }] }
    ],
  },
];

export default kidsUnit3;
