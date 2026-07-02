import type { UnitBank } from "../types";

// ── Kids Unit 4: Food & Drinks (خواردن و خواردنەوە) ─────────────────────────
const kidsUnit4: UnitBank = [
  // Lesson 0: Basic Foods
  {
    topic: "Basic Foods", topicKu: "خواردنە بنەڕەتییەکان", topicAr: "الأطعمة الأساسية",
    words: [
      { english: "Apple", kurdish: "سێو", arabic: "تفاحة" },
      { english: "Bread", kurdish: "نان", arabic: "خبز" },
      { english: "Milk", kurdish: "شیر", arabic: "حليب" },
      { english: "Egg", kurdish: "هێلکە", arabic: "بيضة" },
      { english: "Banana", kurdish: "مۆز", arabic: "موز" },
    ],
    voices: [
      { prompt: "بڵێ: سێوێک دەخۆم", target: "I eat an apple.", targetKurdish: "سێوێک دەخۆم." },
      { prompt: "بڵێ: شیر دەخۆمەوە", target: "I drink milk.", targetKurdish: "شیر دەخۆمەوە." },
    ],
    sentences: [
      { english: ["I", "eat", "an", "apple"], kurdish: "سێوێک دەخۆم", arabic: "أنا آكل تفاحة" },
      { english: ["I", "drink", "milk"], kurdish: "شیر دەخۆمەوە", arabic: "أنا أشرب الحليب" },
    ],
    fillBlanks: [
      { parts: ["I eat", "for breakfast"], hint: "نان دەخۆم بۆ نانی بەیانی", answer: "bread", wrongs: ["milk", "water", "juice"] },
      { parts: ["The", "is yellow"], hint: "مۆزەکە زەردە", answer: "banana", wrongs: ["apple", "egg", "milk"] },
    ],
    conversations: [
      {
        situation: "لە کاتی نانخواردندا هاوڕێیەک دەپرسێت چی دەخۆیت",
        theyAsk: "What are you eating?",
        correct: "I am eating an apple!",
        wrong1: "I am eating.",
        wrong2: "The apple is good.",
        wrong3: "I consume fruit.",
        explanation: "بۆ منداڵان بە سادەیی بڵێ: 'I am eating an apple!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I eat an apple.", targetKurdish: "سێوێک دەخۆم.", imageRequire: require("../../../assets/images/games/kid_eating_apple.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the red apple!", correctId: "apple", choices: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "bubble", prompt: "Pop the milk glass!", correctId: "milk", choices: [{ id: "milk", emoji: "🥛", label: "Milk" }, { id: "juice", emoji: "🧃", label: "Juice" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Feed the child bread!", correctId: "bread", choices: [{ id: "bread", emoji: "🍞", label: "Bread" }, { id: "shoe", emoji: "👞", label: "Shoe" }] },
      { kind: "shadow", prompt: "Match apple and banana!", items: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "banana", emoji: "🍌", label: "Banana" }] },
      { kind: "native", kurdishPrompt: "هێلکە بدۆزەرەوە", correctId: "egg", choices: [{ id: "egg", emoji: "🥚", label: "Egg" }, { id: "milk", emoji: "🥛", label: "Milk" }] },
      { kind: "simon", phrase: "Simon says, pick the banana!", correctId: "banana", choices: [{ id: "banana", emoji: "🍌", label: "Banana" }, { id: "bread", emoji: "🍞", label: "Bread" }] },
      { kind: "train", words: ["I", "eat", "an", "apple"], kurdishHint: "سێوێک دەخۆم" },
      { kind: "trick", showEmoji: "🍎", showLabel: "Apple", spokenWord: "Apple", matches: true },
      { kind: "treasure", correctId: "white_egg", pool: [{ id: "white_egg", emoji: "🥚", label: "Egg" }, { id: "box", emoji: "📦", label: "Box" }] }
    ],
  },

  // Lesson 1: Drinks
  {
    topic: "Drinks", topicKu: "خواردنەوەکان", topicAr: "المشروبات",
    words: [
      { english: "Water", kurdish: "ئاو", arabic: "ماء" },
      { english: "Juice", kurdish: "شەربەت", arabic: "عصير" },
      { english: "Tea", kurdish: "چا", arabic: "شاي" },
      { english: "Drink", kurdish: "خواردنەوە", arabic: "يشرب" },
      { english: "Cold", kurdish: "سارد", arabic: "بارد" },
    ],
    voices: [
      { prompt: "بڵێ: ئاو دەخۆمەوە", target: "I drink water.", targetKurdish: "ئاو دەخۆمەوە." },
      { prompt: "بڵێ: شەربەتەکە ساردە", target: "The juice is cold.", targetKurdish: "شەربەتەکە ساردە." },
    ],
    sentences: [
      { english: ["I", "drink", "water"], kurdish: "ئاو دەخۆمەوە", arabic: "أنا أشرب الماء" },
      { english: ["The", "juice", "is", "cold"], kurdish: "شەربەتەکە ساردە", arabic: "العصير بارد" },
    ],
    fillBlanks: [
      { parts: ["I like cold", ""], hint: "کەیفم بە ئاوی سارد دێت", answer: "water", wrongs: ["bread", "egg", "banana"] },
      { parts: ["He drinks", ""], hint: "ئەو چا دەخواتەوە", answer: "tea", wrongs: ["bread", "apple", "food"] },
    ],
    conversations: [
      {
        situation: "تینووتە و هاوڕێیەک دەپرسێت چی دەخۆیتەوە",
        theyAsk: "What do you drink?",
        correct: "I drink water!",
        wrong1: "I like water.",
        wrong2: "Water is liquid.",
        wrong3: "I prefer hydration.",
        explanation: "وەڵامێکی ئاسان: 'I drink water!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I drink water.", targetKurdish: "ئاو دەخۆمەوە.", imageRequire: require("../../../assets/images/games/kid_waking_up.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the cold juice!", correctId: "juice", choices: [{ id: "juice", emoji: "🧃", label: "Juice" }, { id: "bread", emoji: "🍞", label: "Bread" }] },
      { kind: "bubble", prompt: "Pop the cold water!", correctId: "water", choices: [{ id: "water", emoji: "🥛", label: "Water" }, { id: "cookie", emoji: "🍪", label: "Cookie" }] },
      { kind: "feed", mascotEmoji: "🦜", prompt: "Give the parrot water!", correctId: "water", choices: [{ id: "water", emoji: "🥛", label: "Water" }, { id: "meat", emoji: "🍖", label: "Meat" }] },
      { kind: "shadow", prompt: "Match water and tea!", items: [{ id: "water", emoji: "🥛", label: "Water" }, { id: "tea", emoji: "🍵", label: "Tea" }] },
      { kind: "native", kurdishPrompt: "خواردنەوە بدۆزەرەوە", correctId: "drink", choices: [{ id: "drink", emoji: "🥛", label: "Drink" }, { id: "cake", emoji: "🍰", label: "Cake" }] },
      { kind: "simon", phrase: "Simon says, pick the tea!", correctId: "tea", choices: [{ id: "tea", emoji: "🍵", label: "Tea" }, { id: "bread", emoji: "🍞", label: "Bread" }] },
      { kind: "train", words: ["I", "drink", "water"], kurdishHint: "ئاو دەخۆمەوە" },
      { kind: "trick", showEmoji: "🧃", showLabel: "Juice", spokenWord: "Juice", matches: true },
      { kind: "treasure", correctId: "orange_juice", pool: [{ id: "orange_juice", emoji: "🧃", label: "Juice" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 2: Fruits
  {
    topic: "Fruits", topicKu: "میوەکان", topicAr: "الفواكه",
    words: [
      { english: "Orange", kurdish: "پرتەقاڵ", arabic: "برتقال" },
      { english: "Grape", kurdish: "ترێ", arabic: "عنب" },
      { english: "Melon", kurdish: "کاڵەک", arabic: "بطيخ" },
      { english: "Sweet", kurdish: "شیرین", arabic: "حلو" },
      { english: "Fruit", kurdish: "میوە", arabic: "فاكهة" },
    ],
    voices: [
      { prompt: "بڵێ: پرتەقاڵەکە شیرینە", target: "The orange is sweet.", targetKurdish: "پرتەقاڵەکە شیرینە." },
      { prompt: "بڵێ: کەیفم بە میوە دێت", target: "I like fruit.", targetKurdish: "کەیفم بە میوە دێت." },
    ],
    sentences: [
      { english: ["The", "orange", "is", "sweet"], kurdish: "پرتەقاڵەکە شیرینە", arabic: "البرتقالة حلوة" },
      { english: ["I", "like", "fruit"], kurdish: "کەیفم بە میوە دێت", arabic: "أحب الفاكهة" },
    ],
    fillBlanks: [
      { parts: ["A", "is a fruit"], hint: "پرتەقاڵ میوەیە", answer: "orange", wrongs: ["water", "tea", "bread"] },
      { parts: ["The grapes are", ""], hint: "ترێیەکان شیرینن", answer: "sweet", wrongs: ["cold", "big", "sad"] },
    ],
    conversations: [
      {
        situation: "لە بازاڕدا هاوڕێیەک دەپرسێت ئایا کەیفت بە میوە دێت",
        theyAsk: "Do you like fruit?",
        correct: "Yes, I like fruit!",
        wrong1: "I like orange.",
        wrong2: "Fruit is sweet.",
        wrong3: "Indeed I consume fruits.",
        explanation: "وەڵامی ئاسان: 'Yes, I like fruit!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I eat fruit.", targetKurdish: "میوە دەخۆم.", imageRequire: require("../../../assets/images/games/kid_eating_apple.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the sweet orange!", correctId: "orange", choices: [{ id: "orange", emoji: "🍊", label: "Orange" }, { id: "egg", emoji: "🥚", label: "Egg" }] },
      { kind: "bubble", prompt: "Pop the purple grape!", correctId: "grape", choices: [{ id: "grape", emoji: "🍇", label: "Grape" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "feed", mascotEmoji: "🐒", prompt: "Feed the monkey a sweet banana!", correctId: "banana", choices: [{ id: "banana", emoji: "🍌", label: "Banana" }, { id: "meat", emoji: "🍖", label: "Meat" }] },
      { kind: "shadow", prompt: "Match orange and grape!", items: [{ id: "orange", emoji: "🍊", label: "Orange" }, { id: "grape", emoji: "🍇", label: "Grape" }] },
      { kind: "native", kurdishPrompt: "میوە بدۆزەرەوە", correctId: "fruit", choices: [{ id: "fruit", emoji: "🍇", label: "Fruit" }, { id: "bread", emoji: "🍞", label: "Bread" }] },
      { kind: "simon", phrase: "Simon says, pick the melon!", correctId: "melon", choices: [{ id: "melon", emoji: "🍉", label: "Melon" }, { id: "cake", emoji: "🍰", label: "Cake" }] },
      { kind: "train", words: ["The", "orange", "is", "sweet"], kurdishHint: "پرتەقاڵەکە شیرینە" },
      { kind: "trick", showEmoji: "🍇", showLabel: "Grape", spokenWord: "Grape", matches: true },
      { kind: "treasure", correctId: "yellow_melon", pool: [{ id: "yellow_melon", emoji: "🍉", label: "Melon" }, { id: "coal", emoji: "⬛", label: "Coal" }] }
    ],
  },

  // Lesson 3: Vegetables
  {
    topic: "Vegetables", topicKu: "سەوزەکان", topicAr: "الخضروات",
    words: [
      { english: "Tomato", kurdish: "تەماتە", arabic: "طماطم" },
      { english: "Carrot", kurdish: "گێزەر", arabic: "جزر" },
      { english: "Potato", kurdish: "پەتاتە", arabic: "بطاطس" },
      { english: "Green", kurdish: "سەوز", arabic: "أخضر" },
      { english: "Vegetable", kurdish: "سەوزە", arabic: "خضار" },
    ],
    voices: [
      { prompt: "بڵێ: تەماتەکە سوورە", target: "The tomato is red.", targetKurdish: "تەماتەکە سوورە." },
      { prompt: "بڵێ: گێزەر دەخۆم", target: "I eat a carrot.", targetKurdish: "گێزەر دەخۆم." },
    ],
    sentences: [
      { english: ["The", "tomato", "is", "red"], kurdish: "تەماتەکە سوورە", arabic: "الطماطم حمراء" },
      { english: ["I", "eat", "a", "carrot"], kurdish: "گێزەر دەخۆم", arabic: "أنا آكل جزرة" },
    ],
    fillBlanks: [
      { parts: ["Rabbits eat", ""], hint: "کەروێشک گێزەر دەخوات", answer: "carrot", wrongs: ["tomato", "potato", "water"] },
      { parts: ["A", "is a vegetable"], hint: "پەتاتە سەوزەیە", answer: "potato", wrongs: ["apple", "banana", "milk"] },
    ],
    conversations: [
      {
        situation: "دایکت دەپرسێت سەوزە دەخۆیت",
        theyAsk: "Do you eat vegetables?",
        correct: "Yes, I eat carrots!",
        wrong1: "Carrot is red.",
        wrong2: "I eat apple.",
        wrong3: "Vegetables provide nutrition.",
        explanation: "ڕستەیەکی تەواو: 'Yes, I eat carrots!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I eat a carrot.", targetKurdish: "گێزەر دەخۆم.", imageRequire: require("../../../assets/images/games/girl_helping_mother.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the red tomato!", correctId: "tomato", choices: [{ id: "tomato", emoji: "🍅", label: "Tomato" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "bubble", prompt: "Pop the orange carrot!", correctId: "carrot", choices: [{ id: "carrot", emoji: "🥕", label: "Carrot" }, { id: "milk", emoji: "🥛", label: "Milk" }] },
      { kind: "feed", mascotEmoji: "🐰", prompt: "Feed the rabbit the carrot!", correctId: "carrot", choices: [{ id: "carrot", emoji: "🥕", label: "Carrot" }, { id: "bone", emoji: "🦴", label: "Bone" }] },
      { kind: "shadow", prompt: "Match tomato and potato!", items: [{ id: "tomato", emoji: "🍅", label: "Tomato" }, { id: "potato", emoji: "🥔", label: "Potato" }] },
      { kind: "native", kurdishPrompt: "سەوزە بدۆزەرەوە", correctId: "veg", choices: [{ id: "veg", emoji: "🥗", label: "Vegetable" }, { id: "bread", emoji: "🍞", label: "Bread" }] },
      { kind: "simon", phrase: "Simon says, pick the potato!", correctId: "potato", choices: [{ id: "potato", emoji: "🥔", label: "Potato" }, { id: "banana", emoji: "🍌", label: "Banana" }] },
      { kind: "train", words: ["The", "tomato", "is", "red"], kurdishHint: "تەماتەکە سوورە" },
      { kind: "trick", showEmoji: "🥕", showLabel: "Carrot", spokenWord: "Carrot", matches: true },
      { kind: "treasure", correctId: "potato", pool: [{ id: "potato", emoji: "🥔", label: "Potato" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 4: Fast Food
  {
    topic: "Fast Food", topicKu: "خواردنی خێرا", topicAr: "الوجبات السريعة",
    words: [
      { english: "Pizza", kurdish: "پیتزا", arabic: "بيتزا" },
      { english: "Burger", kurdish: "بەرگر", arabic: "برجر" },
      { english: "Fries", kurdish: "پەتاتەی سورەوەکراو", arabic: "بطاطس مقلية" },
      { english: "Hot", kurdish: "گەرم", arabic: "ساخن" },
      { english: "Yummy", kurdish: "بەتام", arabic: "لذيذ" },
    ],
    voices: [
      { prompt: "بڵێ: پیتزاکە بەتامە", target: "The pizza is yummy.", targetKurdish: "پیتزاکە بەتامە." },
      { prompt: "بڵێ: بەرگر دەخۆم", target: "I eat a burger.", targetKurdish: "بەرگر دەخۆم." },
    ],
    sentences: [
      { english: ["The", "pizza", "is", "yummy"], kurdish: "پیتزاکە بەتامە", arabic: "البيتزا لذيذة" },
      { english: ["The", "fries", "are", "hot"], kurdish: "پەتاتەکان گەرمن", arabic: "البطاطس المقلية ساخنة" },
    ],
    fillBlanks: [
      { parts: ["I like", "and fries"], hint: "کەیفم بە بەرگر و پەتاتەیە", answer: "burger", wrongs: ["water", "tea", "apple"] },
      { parts: ["The pizza is very", ""], hint: "پیتزاکە زۆر بەتامە", answer: "yummy", wrongs: ["sad", "cold", "blue"] },
    ],
    conversations: [
      {
        situation: "لە چێشتخانەدا دەپرسن چیت دەوێت",
        theyAsk: "What do you want to eat?",
        correct: "I want pizza!",
        wrong1: "I want water.",
        wrong2: "Pizza is round.",
        wrong3: "I desire fast food.",
        explanation: "بە ئاسانی بڵێ: 'I want pizza!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I play with blocks.", targetKurdish: "یاری بە بلۆک دەکەین.", imageRequire: require("../../../assets/images/games/kids_with_blocks.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the yummy pizza!", correctId: "pizza", choices: [{ id: "pizza", emoji: "🍕", label: "Pizza" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "bubble", prompt: "Pop the hot fries!", correctId: "fries", choices: [{ id: "fries", emoji: "🍟", label: "Fries" }, { id: "ice", emoji: "🧊", label: "Ice" }] },
      { kind: "feed", mascotEmoji: "🦁", prompt: "Feed the lion a big burger!", correctId: "burger", choices: [{ id: "burger", emoji: "🍔", label: "Burger" }, { id: "grass", emoji: "🌿", label: "Grass" }] },
      { kind: "shadow", prompt: "Match burger and fries!", items: [{ id: "burger", emoji: "🍔", label: "Burger" }, { id: "fries", emoji: "🍟", label: "Fries" }] },
      { kind: "native", kurdishPrompt: "بەتام بدۆزەرەوە", correctId: "yummy", choices: [{ id: "yummy", emoji: "😋", label: "Yummy" }, { id: "sad", emoji: "😢", label: "Sad" }] },
      { kind: "simon", phrase: "Simon says, pick the burger!", correctId: "burger", choices: [{ id: "burger", emoji: "🍔", label: "Burger" }, { id: "pizza", emoji: "🍕", label: "Pizza" }] },
      { kind: "train", words: ["The", "pizza", "is", "yummy"], kurdishHint: "پیتزاکە بەتامە" },
      { kind: "trick", showEmoji: "🍕", showLabel: "Pizza", spokenWord: "Pizza", matches: true },
      { kind: "treasure", correctId: "hot_fries", pool: [{ id: "hot_fries", emoji: "🍟", label: "Hot Fries" }, { id: "cold_water", emoji: "💧", label: "Cold Water" }] }
    ],
  },

  // Lesson 5: Meals
  {
    topic: "Meals", topicKu: "ژەمەکان", topicAr: "الوجبات",
    words: [
      { english: "Breakfast", kurdish: "نانی بەیانی", arabic: "إفطار" },
      { english: "Lunch", kurdish: "نانی نیوەڕۆ", arabic: "غداء" },
      { english: "Dinner", kurdish: "نانی ئێوارە", arabic: "عشاء" },
      { english: "Morning", kurdish: "بەیانی", arabic: "صباح" },
      { english: "Night", kurdish: "شەو", arabic: "ليل" },
    ],
    voices: [
      { prompt: "بڵێ: نانی بەیانی دەخۆم", target: "I eat breakfast.", targetKurdish: "نانی بەیانی دەخۆم." },
      { prompt: "بڵێ: کاتی نانی ئێوارەیە", target: "It is time for dinner.", targetKurdish: "کاتی نانی ئێوارەیە." },
    ],
    sentences: [
      { english: ["I", "eat", "breakfast"], kurdish: "نانی بەیانی دەخۆم", arabic: "أنا أتناول الإفطار" },
      { english: ["It", "is", "time", "for", "dinner"], kurdish: "کاتی نانی ئێوارەیە", arabic: "حان وقت العشاء" },
    ],
    fillBlanks: [
      { parts: ["We eat", "in the morning"], hint: "بەیانیان نانی بەیانی دەخۆین", answer: "breakfast", wrongs: ["dinner", "lunch", "night"] },
      { parts: ["I eat", "at night"], hint: "شەوانە نانی ئێوارە دەخۆم", answer: "dinner", wrongs: ["morning", "breakfast", "lunch"] },
    ],
    conversations: [
      {
        situation: "دایکت پێتدەڵێت وەرە نان بخۆ",
        theyAsk: "It is time for lunch!",
        correct: "I am coming!",
        wrong1: "I eat breakfast.",
        wrong2: "Lunch is at noon.",
        wrong3: "I will consume my midday meal.",
        explanation: "بڵێ 'I am coming!' (من دێم)",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I wake up.", targetKurdish: "لە خەو هەڵدەستم.", imageRequire: require("../../../assets/images/games/kid_waking_up.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the breakfast egg!", correctId: "egg", choices: [{ id: "egg", emoji: "🥚", label: "Breakfast Egg" }, { id: "toy", emoji: "🧸", label: "Toy" }] },
      { kind: "bubble", prompt: "Pop the lunch burger!", correctId: "lunch", choices: [{ id: "lunch", emoji: "🍔", label: "Lunch Burger" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "feed", mascotEmoji: "👨", prompt: "Give Dad his dinner plate!", correctId: "dinner", choices: [{ id: "dinner", emoji: "🍛", label: "Dinner Plate" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "shadow", prompt: "Match breakfast and dinner!", items: [{ id: "breakfast", emoji: "🍳", label: "Breakfast" }, { id: "dinner", emoji: "🍲", label: "Dinner" }] },
      { kind: "native", kurdishPrompt: "نانی نیوەڕۆ بدۆزەرەوە", correctId: "lunch", choices: [{ id: "lunch", emoji: "🍛", label: "Lunch" }, { id: "breakfast", emoji: "🍳", label: "Breakfast" }] },
      { kind: "simon", phrase: "Simon says, pick breakfast!", correctId: "breakfast", choices: [{ id: "breakfast", emoji: "🍳", label: "Breakfast" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "train", words: ["I", "eat", "breakfast"], kurdishHint: "نانی بەیانی دەخۆم" },
      { kind: "trick", showEmoji: "🍳", showLabel: "Breakfast", spokenWord: "Breakfast", matches: true },
      { kind: "treasure", correctId: "dinner_soup", pool: [{ id: "dinner_soup", emoji: "🍲", label: "Dinner Soup" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 6: Sweets
  {
    topic: "Sweets", topicKu: "شیرینییەکان", topicAr: "الحلويات",
    words: [
      { english: "Cake", kurdish: "کێک", arabic: "كعكة" },
      { english: "Candy", kurdish: "نوقڵ", arabic: "حلوى" },
      { english: "Chocolate", kurdish: "چۆکۆلاتە", arabic: "شوكولاتة" },
      { english: "Ice cream", kurdish: "ئایس کرێم", arabic: "آيس كريم" },
      { english: "Happy", kurdish: "دڵخۆش", arabic: "سعيد" },
    ],
    voices: [
      { prompt: "بڵێ: کێکەکە شیرینە", target: "The cake is sweet.", targetKurdish: "کێکەکە شیرینە." },
      { prompt: "بڵێ: کەیفم بە ئایس کرێم دێت", target: "I like ice cream.", targetKurdish: "کەیفم بە ئایس کرێم دێت." },
    ],
    sentences: [
      { english: ["The", "cake", "is", "sweet"], kurdish: "کێکەکە شیرینە", arabic: "الكعكة حلوة" },
      { english: ["I", "like", "ice", "cream"], kurdish: "کەیفم بە ئایس کرێم دێت", arabic: "أحب الآيس كريم" },
    ],
    fillBlanks: [
      { parts: ["I eat", "on my birthday"], hint: "لە ڕۆژی لەدایکبوونمدا کێک دەخۆم", answer: "cake", wrongs: ["water", "carrot", "egg"] },
      { parts: ["The", "is cold"], hint: "ئایس کرێمەکە ساردە", answer: "Ice cream", wrongs: ["cake", "candy", "chocolate"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک شیرینیت پێشکەش دەکات",
        theyAsk: "Do you want some candy?",
        correct: "Yes, please!",
        wrong1: "Candy is sweet.",
        wrong2: "I want water.",
        wrong3: "I shall accept the confectionery.",
        explanation: "وەڵامێکی جوان: 'Yes, please!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I read a book.", targetKurdish: "کتێب دەخوێنمەوە.", imageRequire: require("../../../assets/images/games/friendly_teacher.png") },
      { kind: "scene", scene: "playground", prompt: "Find the sweet cake!", correctId: "cake", choices: [{ id: "cake", emoji: "🍰", label: "Cake" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "bubble", prompt: "Pop the cold ice cream!", correctId: "icecream", choices: [{ id: "icecream", emoji: "🍦", label: "Ice Cream" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "feed", mascotEmoji: "🧸", prompt: "Feed the teddy bear chocolate!", correctId: "chocolate", choices: [{ id: "chocolate", emoji: "🍫", label: "Chocolate" }, { id: "wood", emoji: "🪵", label: "Wood" }] },
      { kind: "shadow", prompt: "Match cake and candy!", items: [{ id: "cake", emoji: "🍰", label: "Cake" }, { id: "candy", emoji: "🍬", label: "Candy" }] },
      { kind: "native", kurdishPrompt: "ئایس کرێم بدۆزەرەوە", correctId: "icecream", choices: [{ id: "icecream", emoji: "🍦", label: "Ice Cream" }, { id: "chocolate", emoji: "🍫", label: "Chocolate" }] },
      { kind: "simon", phrase: "Simon says, pick the candy!", correctId: "candy", choices: [{ id: "candy", emoji: "🍬", label: "Candy" }, { id: "cake", emoji: "🍰", label: "Cake" }] },
      { kind: "train", words: ["The", "cake", "is", "sweet"], kurdishHint: "کێکەکە شیرینە" },
      { kind: "trick", showEmoji: "🍫", showLabel: "Chocolate", spokenWord: "Chocolate", matches: true },
      { kind: "treasure", correctId: "sweet_candy", pool: [{ id: "sweet_candy", emoji: "🍬", label: "Candy" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 7: Hungry & Thirsty
  {
    topic: "Hungry & Thirsty", topicKu: "برسی و تینوو", topicAr: "جائع وعطشان",
    words: [
      { english: "Hungry", kurdish: "برسی", arabic: "جائع" },
      { english: "Thirsty", kurdish: "تینوو", arabic: "عطشان" },
      { english: "Want", kurdish: "ویستن", arabic: "يريد" },
      { english: "Need", kurdish: "پێویستبوون", arabic: "يحتاج" },
      { english: "Now", kurdish: "ئێستا", arabic: "الآن" },
    ],
    voices: [
      { prompt: "بڵێ: من برسیمە", target: "I am hungry.", targetKurdish: "من برسیمە." },
      { prompt: "بڵێ: من تینوومە", target: "I am thirsty.", targetKurdish: "من تینوومە." },
    ],
    sentences: [
      { english: ["I", "am", "hungry"], kurdish: "من برسیمە", arabic: "أنا جائع" },
      { english: ["I", "want", "food", "now"], kurdish: "ئێستا خواردنم دەوێت", arabic: "أريد طعامًا الآن" },
    ],
    fillBlanks: [
      { parts: ["I drink water because I am", ""], hint: "ئاو دەخۆمەوە چونکە تینوومە", answer: "thirsty", wrongs: ["hungry", "happy", "cold"] },
      { parts: ["I am", "I want an apple"], hint: "من برسیمە، سێوێکم دەوێت", answer: "hungry", wrongs: ["thirsty", "sad", "hot"] },
    ],
    conversations: [
      {
        situation: "دایکت دەپرسێت چۆنیت",
        theyAsk: "Are you hungry?",
        correct: "Yes, I am hungry!",
        wrong1: "I am thirsty.",
        wrong2: "Hungry is a feeling.",
        wrong3: "My stomach requires nourishment.",
        explanation: "وەڵامێکی ڕوون: 'Yes, I am hungry!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I eat an apple.", targetKurdish: "سێوێک دەخۆم.", imageRequire: require("../../../assets/images/games/kid_eating_apple.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the water for the thirsty girl!", correctId: "water", choices: [{ id: "water", emoji: "🥛", label: "Water" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "bubble", prompt: "Pop the food plate!", correctId: "food", choices: [{ id: "food", emoji: "🍛", label: "Food Plate" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "feed", mascotEmoji: "🦁", prompt: "Feed the hungry lion some meat!", correctId: "meat", choices: [{ id: "meat", emoji: "🍖", label: "Meat" }, { id: "grass", emoji: "🌿", label: "Grass" }] },
      { kind: "shadow", prompt: "Match food and water!", items: [{ id: "food", emoji: "🍛", label: "Food" }, { id: "water", emoji: "🥛", label: "Water" }] },
      { kind: "native", kurdishPrompt: "تینوو بدۆزەرەوە", correctId: "thirsty", choices: [{ id: "thirsty", emoji: "🥵", label: "Thirsty" }, { id: "happy", emoji: "😀", label: "Happy" }] },
      { kind: "simon", phrase: "Simon says, pick food now!", correctId: "food", choices: [{ id: "food", emoji: "🍛", label: "Food" }, { id: "toy", emoji: "🧸", label: "Toy" }] },
      { kind: "train", words: ["I", "want", "food", "now"], kurdishHint: "ئێستا خواردنم دەوێت" },
      { kind: "trick", showEmoji: "🥵", showLabel: "Thirsty", spokenWord: "Thirsty", matches: true },
      { kind: "treasure", correctId: "fresh_juice", pool: [{ id: "fresh_juice", emoji: "🧃", label: "Fresh Juice" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 8: Cooking
  {
    topic: "Cooking", topicKu: "چێشتلێنان", topicAr: "الطبخ",
    words: [
      { english: "Cook", kurdish: "چێشتلێنان", arabic: "يطبخ" },
      { english: "Kitchen", kurdish: "چێشتخانە", arabic: "مطبخ" },
      { english: "Make", kurdish: "دروستکردن", arabic: "يصنع" },
      { english: "Help", kurdish: "یارمەتیدان", arabic: "يساعد" },
      { english: "Mom", kurdish: "دایک", arabic: "أمي" },
    ],
    voices: [
      { prompt: "بڵێ: یارمەتی دایکم دەدەم", target: "I help my mom.", targetKurdish: "یارمەتی دایکم دەدەم." },
      { prompt: "بڵێ: ئێمە خواردن دروست دەکەین", target: "We make food.", targetKurdish: "ئێمە خواردن دروست دەکەین." },
    ],
    sentences: [
      { english: ["I", "help", "my", "mom"], kurdish: "یارمەتی دایکم دەدەم", arabic: "أساعد أمي" },
      { english: ["We", "make", "food"], kurdish: "ئێمە خواردن دروست دەکەین", arabic: "نحن نصنع الطعام" },
    ],
    fillBlanks: [
      { parts: ["My mom is in the", ""], hint: "دایکم لە چێشتخانەیە", answer: "kitchen", wrongs: ["bedroom", "park", "school"] },
      { parts: ["I", "food with my mom"], hint: "خواردن دروست دەکەم لەگەڵ دایکم", answer: "make", wrongs: ["sleep", "jump", "run"] },
    ],
    conversations: [
      {
        situation: "دایکت لە چێشتخانەیە و بانگت دەکات",
        theyAsk: "Can you help me cook?",
        correct: "Yes, mom!",
        wrong1: "I am cooking.",
        wrong2: "Kitchen is for food.",
        wrong3: "I will assist in culinary preparations.",
        explanation: "وەڵامێکی ئاسان: 'Yes, mom!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I help my mom.", targetKurdish: "یارمەتی دایکم دەدەم.", imageRequire: require("../../../assets/images/games/girl_helping_mother.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the cooking pot!", correctId: "pot", choices: [{ id: "pot", emoji: "🍲", label: "Pot" }, { id: "toy", emoji: "🧸", label: "Toy" }] },
      { kind: "bubble", prompt: "Pop the kitchen bowl!", correctId: "bowl", choices: [{ id: "bowl", emoji: "🥣", label: "Bowl" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "feed", mascotEmoji: "👩", prompt: "Help Mom make the yummy soup!", correctId: "soup", choices: [{ id: "soup", emoji: "🍲", label: "Yummy Soup" }, { id: "dirt", emoji: "🪨", label: "Dirt" }] },
      { kind: "shadow", prompt: "Match mom and dad!", items: [{ id: "mom", emoji: "👩", label: "Mom" }, { id: "dad", emoji: "👨", label: "Dad" }] },
      { kind: "native", kurdishPrompt: "چێشتخانە بدۆزەرەوە", correctId: "kitchen", choices: [{ id: "kitchen", emoji: "🍳", label: "Kitchen" }, { id: "bedroom", emoji: "🛏️", label: "Bedroom" }] },
      { kind: "simon", phrase: "Simon says, help Mom!", correctId: "help", choices: [{ id: "help", emoji: "🤝", label: "Help" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "train", words: ["I", "help", "my", "mom"], kurdishHint: "یارمەتی دایکم دەدەم" },
      { kind: "trick", showEmoji: "🍳", showLabel: "Kitchen", spokenWord: "Kitchen", matches: true },
      { kind: "treasure", correctId: "wooden_spoon", pool: [{ id: "wooden_spoon", emoji: "🥄", label: "Spoon" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 9: My Favorite Food
  {
    topic: "Favorite Food", topicKu: "خواردنی دڵخواز", topicAr: "الطعام المفضل",
    words: [
      { english: "Favorite", kurdish: "دڵخواز", arabic: "مفضل" },
      { english: "Best", kurdish: "باشترین", arabic: "أفضل" },
      { english: "Love", kurdish: "خۆشویستن", arabic: "يحب" },
      { english: "Chicken", kurdish: "مریشک", arabic: "دجاج" },
      { english: "Rice", kurdish: "برنج", arabic: "أرز" },
    ],
    voices: [
      { prompt: "بڵێ: خواردنی دڵخوازم پیتزایە", target: "My favorite food is pizza.", targetKurdish: "خواردنی دڵخوازم پیتزایە." },
      { prompt: "بڵێ: من برنجم خۆش دەوێت", target: "I love rice.", targetKurdish: "من برنجم خۆش دەوێت." },
    ],
    sentences: [
      { english: ["My", "favorite", "food", "is", "pizza"], kurdish: "خواردنی دڵخوازم پیتزایە", arabic: "طعامي المفضل هو البيتزا" },
      { english: ["I", "love", "chicken", "and", "rice"], kurdish: "کەیفم بە مریشک و برنج دێت", arabic: "أحب الدجاج والأرز" },
    ],
    fillBlanks: [
      { parts: ["My", "food is cake"], hint: "خواردنی دڵخوازم کێکە", answer: "favorite", wrongs: ["sad", "bad", "hot"] },
      { parts: ["I eat chicken and", ""], hint: "مریشک و برنج دەخۆم", answer: "rice", wrongs: ["water", "tea", "cake"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت خواردنی دڵخوازت چییە",
        theyAsk: "What is your favorite food?",
        correct: "My favorite food is chicken!",
        wrong1: "I like food.",
        wrong2: "Chicken is an animal.",
        wrong3: "My preferred nourishment is poultry.",
        explanation: "ڕستەیەکی تەواو: 'My favorite food is chicken!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "We play with a ball.", targetKurdish: "یاری بە تۆپ دەکەین.", imageRequire: require("../../../assets/images/games/kids_playing_ball.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the delicious chicken!", correctId: "chicken", choices: [{ id: "chicken", emoji: "🍗", label: "Chicken" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "bubble", prompt: "Pop the white rice bowl!", correctId: "rice", choices: [{ id: "rice", emoji: "🍚", label: "Rice" }, { id: "water", emoji: "🥛", label: "Water" }] },
      { kind: "feed", mascotEmoji: "🐶", prompt: "Feed the puppy yummy chicken!", correctId: "chicken", choices: [{ id: "chicken", emoji: "🍗", label: "Chicken" }, { id: "grass", emoji: "🌿", label: "Grass" }] },
      { kind: "shadow", prompt: "Match chicken and rice!", items: [{ id: "chicken", emoji: "🍗", label: "Chicken" }, { id: "rice", emoji: "🍚", label: "Rice" }] },
      { kind: "native", kurdishPrompt: "مریشک بدۆزەرەوە", correctId: "chicken", choices: [{ id: "chicken", emoji: "🍗", label: "Chicken" }, { id: "fish", emoji: "🐟", label: "Fish" }] },
      { kind: "simon", phrase: "Simon says, pick the rice!", correctId: "rice", choices: [{ id: "rice", emoji: "🍚", label: "Rice" }, { id: "cake", emoji: "🍰", label: "Cake" }] },
      { kind: "train", words: ["I", "love", "chicken", "and", "rice"], kurdishHint: "برنج و مریشکم خۆش دەوێت" },
      { kind: "trick", showEmoji: "🍗", showLabel: "Chicken", spokenWord: "Chicken", matches: true },
      { kind: "treasure", correctId: "rice_bowl", pool: [{ id: "rice_bowl", emoji: "🍚", label: "Rice Bowl" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },
];

export default kidsUnit4;
