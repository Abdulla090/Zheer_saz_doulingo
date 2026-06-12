import type { UnitBank } from "../types";

// ── Kids Unit 2: Colors & Numbers (ڕەنگ و ژمارە) ──────────────────────────────
const kidsUnit2: UnitBank = [
  // Lesson 0: Colors 1
  {
    topic: "Colors 1", topicKu: "ڕەنگەکان ١", topicAr: "الألوان ١",
    words: [
      { english: "Red", kurdish: "سوور", arabic: "أحمر" },
      { english: "Blue", kurdish: "شین", arabic: "أزرق" },
      { english: "Green", kurdish: "سەوز", arabic: "أخضر" },
      { english: "Yellow", kurdish: "زەرد", arabic: "أصفر" },
      { english: "Black", kurdish: "ڕەش", arabic: "أسود" },
    ],
    voices: [
      { prompt: "بڵێ: سێوەکە سوورە", target: "The apple is red.", targetKurdish: "سێوەکە سوورە." },
      { prompt: "بڵێ: ئاسمان شینە", target: "The sky is blue.", targetKurdish: "ئاسمان شینە." },
    ],
    sentences: [
      { english: ["The", "apple", "is", "red"], kurdish: "سێوەکە سوورە", arabic: "التفاحة حمراء" },
      { english: ["The", "sky", "is", "blue"], kurdish: "ئاسمان شینە", arabic: "السماء زرقاء" },
    ],
    fillBlanks: [
      { parts: ["The grass is", ""], hint: "گیاکە سەوزە", answer: "green", wrongs: ["red", "blue", "black"] },
      { parts: ["The sun is", ""], hint: "خۆرەکە زەردە", answer: "yellow", wrongs: ["blue", "green", "red"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک تۆپێک پیشان دەدات و دەپرسێت چ ڕەنگێکە",
        theyAsk: "What color is the ball?",
        correct: "It's red!",
        wrong1: "The ball is red.",
        wrong2: "The ball's color is red.",
        wrong3: "The chromatic shade of the ball is red.",
        explanation: "بۆ منداڵان بڵێ: 'It's red!' — کورت و ئاسان.",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The boy shares an apple.", targetKurdish: "کوڕەکە سێوێک بەش دەکات.", imageRequire: require("../../../assets/images/games/boy_sharing_apple.png") },
      { kind: "scene", scene: "playground", prompt: "Find the red ball!", correctId: "ball", choices: [{ id: "ball", emoji: "🔴", label: "Red Ball" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "bubble", prompt: "Pop the blue bubble!", correctId: "blue", choices: [{ id: "blue", emoji: "🔵", label: "Blue" }, { id: "red", emoji: "🔴", label: "Red" }] },
      { kind: "feed", mascotEmoji: "🦁", prompt: "Feed the lion!", correctId: "meat", choices: [{ id: "meat", emoji: "🍖", label: "Meat" }, { id: "grass", emoji: "🌿", label: "Grass" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "moon", emoji: "🌙", label: "Moon" }] },
      { kind: "native", kurdishPrompt: "سەگەکە بدۆزەرەوە", correctId: "dog", choices: [{ id: "dog", emoji: "🐶", label: "Dog" }, { id: "cat", emoji: "🐱", label: "Cat" }] },
      { kind: "simon", phrase: "Simon says, pick the yellow star!", correctId: "star", choices: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "train", words: ["The", "apple", "is", "red"], kurdishHint: "سێوەکە سوورە" },
      { kind: "trick", showEmoji: "🍎", showLabel: "Apple", spokenWord: "Apple", matches: true },
      { kind: "treasure", correctId: "gem", pool: [{ id: "gem", emoji: "💎", label: "Gem" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],
  },

  // Lesson 1: Colors 2
  {
    topic: "Colors 2", topicKu: "ڕەنگەکان ٢", topicAr: "الألوان ٢",
    words: [
      { english: "White", kurdish: "سپی", arabic: "أبيض" },
      { english: "Orange", kurdish: "پرتەقاڵی", arabic: "برتقالي" },
      { english: "Pink", kurdish: "پەمەیی", arabic: "وردي" },
      { english: "Purple", kurdish: "مۆر", arabic: "بنفسجي" },
      { english: "Brown", kurdish: "قاوەیی", arabic: "بني" },
    ],
    voices: [
      { prompt: "بڵێ: بەفرەکە سپییە", target: "The snow is white.", targetKurdish: "بەفرەکە سپییە." },
      { prompt: "بڵێ: حەزم لە ڕەنگی مۆرە", target: "I like purple.", targetKurdish: "حەزم لە ڕەنگی مۆرە." },
    ],
    sentences: [
      { english: ["The", "snow", "is", "white"], kurdish: "بەفرەکە سپییە", arabic: "الثلج أبيض" },
      { english: ["I", "like", "purple"], kurdish: "حەزم لە ڕەنگی مۆرە", arabic: "أحب اللون البنفسجي" },
    ],
    fillBlanks: [
      { parts: ["The snow is", ""], hint: "بەفرەکە سپییە", answer: "white", wrongs: ["black", "brown", "pink"] },
      { parts: ["The orange is", ""], hint: "پرتەقاڵەکە پرتەقاڵییە", answer: "orange", wrongs: ["purple", "pink", "white"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت حەزت لە چ ڕەنگێکە",
        theyAsk: "What color do you like?",
        correct: "I like pink!",
        wrong1: "I like pink.",
        wrong2: "My favored color is pink.",
        wrong3: "The hue I find most pleasing is pink.",
        explanation: "بڵێ: 'I like pink!' — سادە و ڕاستەوخۆ.",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "What do you see?", target: "A snowy landscape.", targetKurdish: "دیمەنێکی بەفراوی.", imageRequire: require("../../../assets/images/games/snowy_landscape.png") },
      { kind: "scene", scene: "yard", prompt: "Find the snowman!", correctId: "snowman", choices: [{ id: "snowman", emoji: "⛄", label: "Snowman" }, { id: "tree", emoji: "🌲", label: "Tree" }] },
      { kind: "bubble", prompt: "Pop the white bubble!", correctId: "white", choices: [{ id: "white", emoji: "⚪", label: "White" }, { id: "black", emoji: "⚫", label: "Black" }] },
      { kind: "feed", mascotEmoji: "🐧", prompt: "Feed the penguin!", correctId: "fish", choices: [{ id: "fish", emoji: "🐟", label: "Fish" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "cloud", emoji: "☁️", label: "Cloud" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "native", kurdishPrompt: "پشیلەکە بدۆزەرەوە", correctId: "cat", choices: [{ id: "cat", emoji: "🐱", label: "Cat" }, { id: "dog", emoji: "🐶", label: "Dog" }] },
      { kind: "simon", phrase: "Simon says, pick the cloud!", correctId: "cloud", choices: [{ id: "cloud", emoji: "☁️", label: "Cloud" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "train", words: ["The", "snow", "is", "white"], kurdishHint: "بەفرەکە سپییە" },
      { kind: "trick", showEmoji: "⛄", showLabel: "Snowman", spokenWord: "Snowman", matches: true },
      { kind: "treasure", correctId: "snowflake", pool: [{ id: "snowflake", emoji: "❄️", label: "Snowflake" }, { id: "fire", emoji: "🔥", label: "Fire" }] }
    ],
  },

  // Lesson 2: Numbers 1-5
  {
    topic: "Numbers 1-5", topicKu: "ژمارە ١-٥", topicAr: "الأرقام ١-٥",
    words: [
      { english: "One", kurdish: "یەک", arabic: "واحد" },
      { english: "Two", kurdish: "دوو", arabic: "اثنان" },
      { english: "Three", kurdish: "سێ", arabic: "ثلاثة" },
      { english: "Four", kurdish: "چوار", arabic: "أربعة" },
      { english: "Five", kurdish: "پێنج", arabic: "خمسة" },
    ],
    voices: [
      { prompt: "بڵێ: دوو پشیلەم هەیە", target: "I have two cats.", targetKurdish: "دوو پشیلەم هەیە." },
      { prompt: "بڵێ: سێ باڵندە دەبینم", target: "I see three birds.", targetKurdish: "سێ باڵندە دەبینم." },
    ],
    sentences: [
      { english: ["I", "have", "two", "cats"], kurdish: "دوو پشیلەم هەیە", arabic: "عندي قطتان" },
      { english: ["I", "see", "three", "birds"], kurdish: "سێ باڵندە دەبینم", arabic: "أرى ثلاثة طيور" },
    ],
    fillBlanks: [
      { parts: ["I have", "apple"], hint: "یەک سێوم هەیە", answer: "one", wrongs: ["two", "five", "four"] },
      { parts: ["I have", "fingers on one hand"], hint: "پێنج پەنجەم لە یەک دەستدا هەیە", answer: "five", wrongs: ["one", "two", "three"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت چەند سێوت هەیە",
        theyAsk: "How many apples do you have?",
        correct: "I have two!",
        wrong1: "I have two apples.",
        wrong2: "I am in possession of two apples.",
        wrong3: "The quantity of apples I hold is two.",
        explanation: "بڵێ: 'I have two!' — وەڵامی کورت و ئاسان.",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "What is she doing?", target: "I will help my mother.", targetKurdish: "من یارمەتی دایکم دەدەم.", imageRequire: require("../../../assets/images/games/girl_helping_mother.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the apple!", correctId: "apple", choices: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "banana", emoji: "🍌", label: "Banana" }] },
      { kind: "bubble", prompt: "Pop the number one!", correctId: "one", choices: [{ id: "one", emoji: "1️⃣", label: "One" }, { id: "two", emoji: "2️⃣", label: "Two" }] },
      { kind: "feed", mascotEmoji: "👩", prompt: "Give mother a flower!", correctId: "flower", choices: [{ id: "flower", emoji: "🌸", label: "Flower" }, { id: "spider", emoji: "🕷️", label: "Spider" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "plate", emoji: "🍽️", label: "Plate" }, { id: "fork", emoji: "🍴", label: "Fork" }] },
      { kind: "native", kurdishPrompt: "مۆزەکە بدۆزەرەوە", correctId: "banana", choices: [{ id: "banana", emoji: "🍌", label: "Banana" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "simon", phrase: "Simon says, pick number two!", correctId: "two", choices: [{ id: "two", emoji: "2️⃣", label: "Two" }, { id: "three", emoji: "3️⃣", label: "Three" }] },
      { kind: "train", words: ["I", "have", "two", "cats"], kurdishHint: "دوو پشیلەم هەیە" },
      { kind: "trick", showEmoji: "🌸", showLabel: "Flower", spokenWord: "Flower", matches: true },
      { kind: "treasure", correctId: "heart", pool: [{ id: "heart", emoji: "❤️", label: "Heart" }, { id: "broken", emoji: "💔", label: "Broken Heart" }] }
    ],
  },

  // Lesson 3: Numbers 6-10
  {
    topic: "Numbers 6-10", topicKu: "ژمارە ٦-١٠", topicAr: "الأرقام ٦-١٠",
    words: [
      { english: "Six", kurdish: "شەش", arabic: "ستة" },
      { english: "Seven", kurdish: "حەوت", arabic: "سبعة" },
      { english: "Eight", kurdish: "هەشت", arabic: "ثمانية" },
      { english: "Nine", kurdish: "نۆ", arabic: "تسعة" },
      { english: "Ten", kurdish: "دە", arabic: "عشرة" },
    ],
    voices: [
      { prompt: "بڵێ: شەش پێنووسم هەیە", target: "I have six pens.", targetKurdish: "شەش پێنووسم هەیە." },
      { prompt: "بڵێ: من دە پەنجەم هەیە", target: "I have ten fingers.", targetKurdish: "من دە پەنجەم هەیە." },
    ],
    sentences: [
      { english: ["I", "have", "six", "pens"], kurdish: "شەش پێنووسم هەیە", arabic: "عندي ستة أقلام" },
      { english: ["I", "have", "ten", "fingers"], kurdish: "دە پەنجەم هەیە", arabic: "لدي عشرة أصابع" },
    ],
    fillBlanks: [
      { parts: ["I have", "fingers"], hint: "دە پەنجەم هەیە", answer: "ten", wrongs: ["six", "eight", "nine"] },
      { parts: ["I am", "years old"], hint: "تەمەنم حەوت ساڵە", answer: "seven", wrongs: ["ten", "six", "eight"] },
    ],
    conversations: [
      {
        situation: "کەسێک تەمەنت دەپرسێت",
        theyAsk: "How old are you?",
        correct: "I am seven!",
        wrong1: "I am seven years old.",
        wrong2: "My age is seven years.",
        wrong3: "I have existed for seven years.",
        explanation: "بۆ منداڵ بڵێ: 'I am seven!' — کورت و ئاسایی.",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "What are they counting?", target: "We are counting stars.", targetKurdish: "ئێمە ئەستێرە دەژمێرین.", imageRequire: require("../../../assets/images/games/friends_counting_stars.png") },
      { kind: "scene", scene: "night", prompt: "Find the moon!", correctId: "moon", choices: [{ id: "moon", emoji: "🌙", label: "Moon" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "bubble", prompt: "Pop number ten!", correctId: "ten", choices: [{ id: "ten", emoji: "🔟", label: "Ten" }, { id: "five", emoji: "5️⃣", label: "Five" }] },
      { kind: "feed", mascotEmoji: "🦉", prompt: "Feed the owl!", correctId: "mouse", choices: [{ id: "mouse", emoji: "🐁", label: "Mouse" }, { id: "leaf", emoji: "🍃", label: "Leaf" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "cloud", emoji: "☁️", label: "Cloud" }] },
      { kind: "native", kurdishPrompt: "مانگەکە بدۆزەرەوە", correctId: "moon", choices: [{ id: "moon", emoji: "🌙", label: "Moon" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "simon", phrase: "Simon says, pick number seven!", correctId: "seven", choices: [{ id: "seven", emoji: "7️⃣", label: "Seven" }, { id: "eight", emoji: "8️⃣", label: "Eight" }] },
      { kind: "train", words: ["I", "have", "six", "pens"], kurdishHint: "شەش پێنووسم هەیە" },
      { kind: "trick", showEmoji: "⭐", showLabel: "Star", spokenWord: "Star", matches: true },
      { kind: "treasure", correctId: "telescope", pool: [{ id: "telescope", emoji: "🔭", label: "Telescope" }, { id: "book", emoji: "📖", label: "Book" }] }
    ],
  },

  // Lesson 4: Colors & Numbers Together
  {
    topic: "Ask & Answer", topicKu: "پرسیار و وەڵام", topicAr: "سؤال وجواب",
    words: [
      { english: "How many", kurdish: "چەند", arabic: "كم عدد" },
      { english: "What color", kurdish: "چ ڕەنگ", arabic: "ما لون" },
      { english: "This", kurdish: "ئەمە", arabic: "هذا" },
      { english: "That", kurdish: "ئەو", arabic: "ذلك" },
      { english: "Ball", kurdish: "تۆپ", arabic: "كرة" },
    ],
    voices: [
      { prompt: "بڵێ: چ ڕەنگێکە؟", target: "What color is it?", targetKurdish: "چ ڕەنگێکە؟" },
      { prompt: "بڵێ: چەند پشیلە؟", target: "How many cats?", targetKurdish: "چەند پشیلە؟" },
    ],
    sentences: [
      { english: ["What", "color", "is", "it"], kurdish: "چ ڕەنگێکە؟", arabic: "ما هو لونه؟" },
      { english: ["How", "many", "cats"], kurdish: "چەند پشیلە؟", arabic: "كم عدد القطط؟" },
    ],
    fillBlanks: [
      { parts: ["What", "is the ball?"], hint: "تۆپەکە چ ڕەنگێکە؟", answer: "color", wrongs: ["number", "animal", "name"] },
      { parts: ["How", "apples?"], hint: "چەند سێو؟", answer: "many", wrongs: ["much", "old", "big"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک تۆپێکی سوورت پیشان دەدات",
        theyAsk: "What color is this ball?",
        correct: "It's red!",
        wrong1: "This ball is red.",
        wrong2: "The color of this ball is red.",
        wrong3: "This spherical object is red in color.",
        explanation: "بڵێ: 'It's red!' — وەڵامی کورت و ڕوون بۆ منداڵ.",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the bird:", target: "The parrot is colorful.", targetKurdish: "تووتییەکە ڕەنگاوڕەنگە.", imageRequire: require("../../../assets/images/games/colorful_parrot.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the bird!", correctId: "bird", choices: [{ id: "bird", emoji: "🦜", label: "Bird" }, { id: "cat", emoji: "🐱", label: "Cat" }] },
      { kind: "bubble", prompt: "Pop the question mark!", correctId: "question", choices: [{ id: "question", emoji: "❓", label: "Question" }, { id: "exclamation", emoji: "❗", label: "Exclamation" }] },
      { kind: "feed", mascotEmoji: "🦜", prompt: "Feed the parrot!", correctId: "seed", choices: [{ id: "seed", emoji: "🌻", label: "Seed" }, { id: "meat", emoji: "🍖", label: "Meat" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "bird", emoji: "🦜", label: "Bird" }, { id: "egg", emoji: "🥚", label: "Egg" }] },
      { kind: "native", kurdishPrompt: "تووتییەکە بدۆزەرەوە", correctId: "parrot", choices: [{ id: "parrot", emoji: "🦜", label: "Parrot" }, { id: "fish", emoji: "🐟", label: "Fish" }] },
      { kind: "simon", phrase: "Simon says, ask a question!", correctId: "question", choices: [{ id: "question", emoji: "❓", label: "Question" }, { id: "period", emoji: "⏺️", label: "Period" }] },
      { kind: "train", words: ["What", "color", "is", "it"], kurdishHint: "چ ڕەنگێکە؟" },
      { kind: "trick", showEmoji: "🦜", showLabel: "Parrot", spokenWord: "Parrot", matches: true },
      { kind: "treasure", correctId: "feather", pool: [{ id: "feather", emoji: "🪶", label: "Feather" }, { id: "leaf", emoji: "🍃", label: "Leaf" }] }
    ],
  },

  // Lesson 5: Shapes
  {
    topic: "Shapes", topicKu: "شێوەکان", topicAr: "الأشكال",
    words: [
      { english: "Circle", kurdish: "بازنە", arabic: "دائرة" },
      { english: "Square", kurdish: "چوارگۆشە", arabic: "مربع" },
      { english: "Triangle", kurdish: "سێگۆشە", arabic: "مثلث" },
      { english: "Star", kurdish: "ئەستێرە", arabic: "نجمة" },
      { english: "Shape", kurdish: "شێوە", arabic: "شكل" },
    ],
    voices: [
      { prompt: "بڵێ: تۆپەکە بازنەیە", target: "The ball is a circle.", targetKurdish: "تۆپەکە بازنەیە." },
      { prompt: "بڵێ: من ئەستێرەیەک دەبینم", target: "I see a star.", targetKurdish: "من ئەستێرەیەک دەبینم." },
    ],
    sentences: [
      { english: ["The", "ball", "is", "a", "circle"], kurdish: "تۆپەکە بازنەیە", arabic: "الكرة دائرة" },
      { english: ["I", "see", "a", "star"], kurdish: "من ئەستێرەیەک دەبینم", arabic: "أرى نجمة" },
    ],
    fillBlanks: [
      { parts: ["A pizza is a", ""], hint: "پیتزا بازنەیە", answer: "circle", wrongs: ["square", "star", "triangle"] },
      { parts: ["The", "is in the sky"], hint: "ئەستێرە لە ئاسمانە", answer: "star", wrongs: ["circle", "square", "triangle"] },
    ],
    conversations: [
      {
        situation: "مامۆستا دەپرسێت شێوەی خۆر چییە",
        theyAsk: "What shape is the sun?",
        correct: "It is a circle!",
        wrong1: "It is a square.",
        wrong2: "The sun is yellow.",
        wrong3: "I see a star.",
        explanation: "بڵێ: 'It is a circle!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "What are they doing?", target: "We play with blocks.", targetKurdish: "ئێمە یاری بە بلۆک دەکەین.", imageRequire: require("../../../assets/images/games/kids_with_blocks.png") },
      { kind: "scene", scene: "playground", prompt: "Find the circle!", correctId: "circle", choices: [{ id: "circle", emoji: "🔴", label: "Circle" }, { id: "square", emoji: "🟦", label: "Square" }] },
      { kind: "bubble", prompt: "Pop the square!", correctId: "square", choices: [{ id: "square", emoji: "🟦", label: "Square" }, { id: "triangle", emoji: "🔺", label: "Triangle" }] },
      { kind: "feed", mascotEmoji: "🤖", prompt: "Feed the robot a gear!", correctId: "gear", choices: [{ id: "gear", emoji: "⚙️", label: "Gear" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "triangle", emoji: "🔺", label: "Triangle" }, { id: "square", emoji: "🟦", label: "Square" }] },
      { kind: "native", kurdishPrompt: "چوارگۆشەکە بدۆزەرەوە", correctId: "square", choices: [{ id: "square", emoji: "🟦", label: "Square" }, { id: "circle", emoji: "🔴", label: "Circle" }] },
      { kind: "simon", phrase: "Simon says, pick the triangle!", correctId: "triangle", choices: [{ id: "triangle", emoji: "🔺", label: "Triangle" }, { id: "circle", emoji: "🔴", label: "Circle" }] },
      { kind: "train", words: ["The", "ball", "is", "a", "circle"], kurdishHint: "تۆپەکە بازنەیە" },
      { kind: "trick", showEmoji: "🔺", showLabel: "Triangle", spokenWord: "Triangle", matches: true },
      { kind: "treasure", correctId: "star", pool: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "moon", emoji: "🌙", label: "Moon" }] }
    ],
  },

  // Lesson 6: Toys & Colors
  {
    topic: "Toys & Colors", topicKu: "یارییەکان و ڕەنگەکان", topicAr: "الألعاب والألوان",
    words: [
      { english: "Car", kurdish: "ئۆتۆمبێل", arabic: "سيارة" },
      { english: "Doll", kurdish: "بووکەڵە", arabic: "دمية" },
      { english: "Block", kurdish: "بلۆک (یاری مکەعەب)", arabic: "مكعب" },
      { english: "Train", kurdish: "شەمەندەفەر", arabic: "قطار" },
      { english: "Toy", kurdish: "یاری", arabic: "لعبة" },
    ],
    voices: [
      { prompt: "بڵێ: ئۆتۆمبێلەکەم سوورە", target: "My car is red.", targetKurdish: "ئۆتۆمبێلەکەم سوورە." },
      { prompt: "بڵێ: بووکەڵەکەم پەمەییە", target: "My doll is pink.", targetKurdish: "بووکەڵەکەم پەمەییە." },
    ],
    sentences: [
      { english: ["My", "car", "is", "red"], kurdish: "ئۆتۆمبێلەکەم سوورە", arabic: "سيارتي حمراء" },
      { english: ["My", "doll", "is", "pink"], kurdish: "بووکەڵەکەم پەمەییە", arabic: "دميتي وردية" },
    ],
    fillBlanks: [
      { parts: ["I play with my red", ""], hint: "یاری بە ئۆتۆمبێلە سوورەکەم دەکەم", answer: "car", wrongs: ["apple", "dog", "block"] },
      { parts: ["The", "is blue"], hint: "شەمەندەفەرەکە شینە", answer: "train", wrongs: ["doll", "car", "star"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت ئۆتۆمبێلەکەت چ ڕەنگێکە",
        theyAsk: "What color is your car?",
        correct: "My car is red!",
        wrong1: "It is a car.",
        wrong2: "I play with a car.",
        wrong3: "The vehicle is red in color.",
        explanation: "وەڵامێکی ئاسان: 'My car is red!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the toy:", target: "The train is beautiful.", targetKurdish: "شەمەندەفەرەکە جوانە.", imageRequire: require("../../../assets/images/games/toy_train.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the train!", correctId: "train", choices: [{ id: "train", emoji: "🚂", label: "Train" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "bubble", prompt: "Pop the car!", correctId: "car", choices: [{ id: "car", emoji: "🚗", label: "Car" }, { id: "bus", emoji: "🚌", label: "Bus" }] },
      { kind: "feed", mascotEmoji: "🧸", prompt: "Give the bear a heart!", correctId: "heart", choices: [{ id: "heart", emoji: "❤️", label: "Heart" }, { id: "bone", emoji: "🦴", label: "Bone" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "train", emoji: "🚂", label: "Train" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "native", kurdishPrompt: "ئۆتۆمبێلەکە بدۆزەرەوە", correctId: "car", choices: [{ id: "car", emoji: "🚗", label: "Car" }, { id: "plane", emoji: "✈️", label: "Plane" }] },
      { kind: "simon", phrase: "Simon says, pick the doll!", correctId: "doll", choices: [{ id: "doll", emoji: "🎎", label: "Doll" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "train", words: ["My", "car", "is", "red"], kurdishHint: "ئۆتۆمبێلەکەم سوورە" },
      { kind: "trick", showEmoji: "🚂", showLabel: "Train", spokenWord: "Train", matches: true },
      { kind: "treasure", correctId: "gift", pool: [{ id: "gift", emoji: "🎁", label: "Gift" }, { id: "box", emoji: "📦", label: "Box" }] }
    ],
  },

  // Lesson 7: Numbers 11-20
  {
    topic: "Numbers 11-20", topicKu: "ژمارە ١١-٢٠", topicAr: "الأرقام ١١-٢٠",
    words: [
      { english: "Eleven", kurdish: "یازدە", arabic: "أحد عشر" },
      { english: "Twelve", kurdish: "دوانزە", arabic: "اثنا عشر" },
      { english: "Fifteen", kurdish: "پازدە", arabic: "خمسة عشر" },
      { english: "Twenty", kurdish: "بیست", arabic: "عشرون" },
      { english: "Count", kurdish: "ژماردن", arabic: "يعد" },
    ],
    voices: [
      { prompt: "بڵێ: من دەتوانم بژمێرم", target: "I can count.", targetKurdish: "من دەتوانم بژمێرم." },
      { prompt: "بڵێ: بیست سێوم هەیە", target: "I have twenty apples.", targetKurdish: "بیست سێوم هەیە." },
    ],
    sentences: [
      { english: ["I", "can", "count"], kurdish: "من دەتوانم بژمێرم", arabic: "أنا أستطيع العد" },
      { english: ["I", "have", "twenty", "apples"], kurdish: "بیست سێوم هەیە", arabic: "لدي عشرون تفاحة" },
    ],
    fillBlanks: [
      { parts: ["I can", "to twenty"], hint: "دەتوانم تا بیست بژمێرم", answer: "count", wrongs: ["play", "run", "eat"] },
      { parts: ["Ten and ten is", ""], hint: "دە و دە دەکاتە بیست", answer: "twenty", wrongs: ["twelve", "eleven", "fifteen"] },
    ],
    conversations: [
      {
        situation: "مامۆستا دەپرسێت دەتوانیت تا بیست بژمێریت",
        theyAsk: "Can you count to twenty?",
        correct: "Yes, I can!",
        wrong1: "I count.",
        wrong2: "Twenty is a number.",
        wrong3: "I am capable of enumerating.",
        explanation: "وەڵامێکی ئەرێنی: 'Yes, I can!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Look at the tree:", target: "The tree has many apples.", targetKurdish: "درەختەکە سێوی زۆری پێوەیە.", imageRequire: require("../../../assets/images/games/magical_apple_tree.png") },
      { kind: "scene", scene: "yard", prompt: "Find the tree!", correctId: "tree", choices: [{ id: "tree", emoji: "🌳", label: "Tree" }, { id: "flower", emoji: "🌸", label: "Flower" }] },
      { kind: "bubble", prompt: "Pop the twenty!", correctId: "twenty", choices: [{ id: "twenty", emoji: "2️⃣0️⃣", label: "Twenty" }, { id: "ten", emoji: "1️⃣0️⃣", label: "Ten" }] },
      { kind: "feed", mascotEmoji: "🐿️", prompt: "Feed the squirrel an acorn!", correctId: "acorn", choices: [{ id: "acorn", emoji: "🌰", label: "Acorn" }, { id: "fish", emoji: "🐟", label: "Fish" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "leaf", emoji: "🍃", label: "Leaf" }] },
      { kind: "native", kurdishPrompt: "سێوەکە بدۆزەرەوە", correctId: "apple", choices: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "banana", emoji: "🍌", label: "Banana" }] },
      { kind: "simon", phrase: "Simon says, pick the tree!", correctId: "tree", choices: [{ id: "tree", emoji: "🌳", label: "Tree" }, { id: "bush", emoji: "🪴", label: "Bush" }] },
      { kind: "train", words: ["I", "have", "twenty", "apples"], kurdishHint: "بیست سێوم هەیە" },
      { kind: "trick", showEmoji: "🌳", showLabel: "Tree", spokenWord: "Tree", matches: true },
      { kind: "treasure", correctId: "basket", pool: [{ id: "basket", emoji: "🧺", label: "Basket" }, { id: "pot", emoji: "🍯", label: "Pot" }] }
    ],
  },

  // Lesson 8: Counting Things
  {
    topic: "Counting Things", topicKu: "ژماردنی شتەکان", topicAr: "عد الأشياء",
    words: [
      { english: "Book", kurdish: "کتێب", arabic: "كتاب" },
      { english: "Pen", kurdish: "پێنووس", arabic: "قلم" },
      { english: "Bag", kurdish: "جانتا", arabic: "حقيبة" },
      { english: "Desk", kurdish: "مێز", arabic: "مكتب" },
      { english: "Chair", kurdish: "کورسی", arabic: "كرسي" },
    ],
    voices: [
      { prompt: "بڵێ: سێ کتێبم هەیە", target: "I have three books.", targetKurdish: "سێ کتێبم هەیە." },
      { prompt: "بڵێ: چوار کورسی دەبینم", target: "I see four chairs.", targetKurdish: "چوار کورسی دەبینم." },
    ],
    sentences: [
      { english: ["I", "have", "three", "books"], kurdish: "سێ کتێبم هەیە", arabic: "لدي ثلاثة كتب" },
      { english: ["I", "see", "four", "chairs"], kurdish: "چوار کورسی دەبینم", arabic: "أرى أربعة كراسي" },
    ],
    fillBlanks: [
      { parts: ["I have a red", ""], hint: "جانتایەکی سوورم هەیە", answer: "bag", wrongs: ["pen", "desk", "chair"] },
      { parts: ["The", "is brown"], hint: "مێزەکە قاوەییە", answer: "desk", wrongs: ["apple", "star", "bag"] },
    ],
    conversations: [
      {
        situation: "مامۆستا دەپرسێت چەند پێنووست پێیە",
        theyAsk: "How many pens do you have?",
        correct: "I have two pens!",
        wrong1: "I have a pen.",
        wrong2: "Pens are blue.",
        wrong3: "I possess a couple of writing instruments.",
        explanation: "بڵێ: 'I have two pens!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "What does the teacher say?", target: "I am a good student.", targetKurdish: "من قوتابییەکی باشم.", imageRequire: require("../../../assets/images/games/friendly_teacher.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the book!", correctId: "book", choices: [{ id: "book", emoji: "📖", label: "Book" }, { id: "pen", emoji: "🖊️", label: "Pen" }] },
      { kind: "bubble", prompt: "Pop the pen!", correctId: "pen", choices: [{ id: "pen", emoji: "🖊️", label: "Pen" }, { id: "bag", emoji: "🎒", label: "Bag" }] },
      { kind: "feed", mascotEmoji: "🎒", prompt: "Put a book in the bag!", correctId: "book", choices: [{ id: "book", emoji: "📖", label: "Book" }, { id: "shoe", emoji: "👞", label: "Shoe" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "chair", emoji: "🪑", label: "Chair" }, { id: "desk", emoji: "🪚", label: "Desk" }] },
      { kind: "native", kurdishPrompt: "پێنووسەکە بدۆزەرەوە", correctId: "pen", choices: [{ id: "pen", emoji: "🖊️", label: "Pen" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "simon", phrase: "Simon says, pick the chair!", correctId: "chair", choices: [{ id: "chair", emoji: "🪑", label: "Chair" }, { id: "bed", emoji: "🛏️", label: "Bed" }] },
      { kind: "train", words: ["I", "have", "three", "books"], kurdishHint: "سێ کتێبم هەیە" },
      { kind: "trick", showEmoji: "📖", showLabel: "Book", spokenWord: "Book", matches: true },
      { kind: "treasure", correctId: "medal", pool: [{ id: "medal", emoji: "🥇", label: "Medal" }, { id: "coin", emoji: "🪙", label: "Coin" }] }
    ],
  },

  // Lesson 9: Colors in Nature
  {
    topic: "Colors in Nature", topicKu: "ڕەنگەکان لە سروشتدا", topicAr: "الألوان في الطبيعة",
    words: [
      { english: "Tree", kurdish: "درەخت", arabic: "شجرة" },
      { english: "Flower", kurdish: "گوڵ", arabic: "زهرة" },
      { english: "Sun", kurdish: "خۆر", arabic: "شمس" },
      { english: "Grass", kurdish: "گیا", arabic: "عشب" },
      { english: "Cloud", kurdish: "هەور", arabic: "سحابة" },
    ],
    voices: [
      { prompt: "بڵێ: درەختەکە سەوزە", target: "The tree is green.", targetKurdish: "درەختەکە سەوزە." },
      { prompt: "بڵێ: گوڵەکە پەمەییە", target: "The flower is pink.", targetKurdish: "گوڵەکە پەمەییە." },
    ],
    sentences: [
      { english: ["The", "tree", "is", "green"], kurdish: "درەختەکە سەوزە", arabic: "الشجرة خضراء" },
      { english: ["The", "flower", "is", "pink"], kurdish: "گوڵەکە پەمەییە", arabic: "الزهرة وردية" },
    ],
    fillBlanks: [
      { parts: ["The", "is yellow"], hint: "خۆرەکە زەردە", answer: "sun", wrongs: ["cloud", "tree", "grass"] },
      { parts: ["The", "is white"], hint: "هەورەکە سپییە", answer: "cloud", wrongs: ["sun", "grass", "tree"] },
    ],
    conversations: [
      {
        situation: "لە باخچەیەکدایت و گوڵێک دەبینیت",
        theyAsk: "What color is this flower?",
        correct: "The flower is red!",
        wrong1: "It is a flower.",
        wrong2: "The tree is green.",
        wrong3: "This blossom's hue is red.",
        explanation: "ڕستەیەکی ڕوون: 'The flower is red!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "What are they doing?", target: "I forgive my friend.", targetKurdish: "من لە هاوڕێکەم خۆش دەبم.", imageRequire: require("../../../assets/images/games/kids_hugging.png") },
      { kind: "scene", scene: "yard", prompt: "Find the sun!", correctId: "sun", choices: [{ id: "sun", emoji: "☀️", label: "Sun" }, { id: "moon", emoji: "🌙", label: "Moon" }] },
      { kind: "bubble", prompt: "Pop the flower!", correctId: "flower", choices: [{ id: "flower", emoji: "🌸", label: "Flower" }, { id: "tree", emoji: "🌳", label: "Tree" }] },
      { kind: "feed", mascotEmoji: "🐢", prompt: "Feed the turtle some grass!", correctId: "grass", choices: [{ id: "grass", emoji: "🌿", label: "Grass" }, { id: "meat", emoji: "🍖", label: "Meat" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "cloud", emoji: "☁️", label: "Cloud" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "native", kurdishPrompt: "گوڵەکە بدۆزەرەوە", correctId: "flower", choices: [{ id: "flower", emoji: "🌸", label: "Flower" }, { id: "tree", emoji: "🌳", label: "Tree" }] },
      { kind: "simon", phrase: "Simon says, pick the grass!", correctId: "grass", choices: [{ id: "grass", emoji: "🌿", label: "Grass" }, { id: "flower", emoji: "🌸", label: "Flower" }] },
      { kind: "train", words: ["The", "tree", "is", "green"], kurdishHint: "درەختەکە سەوزە" },
      { kind: "trick", showEmoji: "☀️", showLabel: "Sun", spokenWord: "Sun", matches: true },
      { kind: "treasure", correctId: "rainbow", pool: [{ id: "rainbow", emoji: "🌈", label: "Rainbow" }, { id: "rain", emoji: "🌧️", label: "Rain" }] }
    ],
  },
];

export default kidsUnit2;
