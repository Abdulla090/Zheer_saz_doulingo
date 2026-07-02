import type { UnitBank } from "../types";

// ── Kids Unit 5: Family & Friends (خێزان و هاوڕێیان) ──────────────────────
const kidsUnit5: UnitBank = [
  // Lesson 0: Family Members
  {
    topic: "Family Members", topicKu: "ئەندامانی خێزان", topicAr: "أفراد العائلة",
    words: [
      { english: "Family", kurdish: "خێزان", arabic: "عائلة" },
      { english: "Mom", kurdish: "دایک", arabic: "أمي" },
      { english: "Dad", kurdish: "باوک", arabic: "أبي" },
      { english: "Brother", kurdish: "برا", arabic: "أخ" },
      { english: "Sister", kurdish: "خوشک", arabic: "أخت" },
    ],
    voices: [
      { prompt: "بڵێ: ئەمە خێزانی منە", target: "This is my family.", targetKurdish: "ئەمە خێزانی منە." },
      { prompt: "بڵێ: من برایەکم هەیە", target: "I have a brother.", targetKurdish: "من برایەکم هەیە." },
    ],
    sentences: [
      { english: ["This", "is", "my", "family"], kurdish: "ئەمە خێزانی منە", arabic: "هذه عائلتي" },
      { english: ["I", "have", "a", "brother"], kurdish: "من برایەکم هەیە", arabic: "عندي أخ" },
    ],
    fillBlanks: [
      { parts: ["My", "is tall"], hint: "باوکم باڵابەرزە", answer: "dad", wrongs: ["dog", "cat", "apple"] },
      { parts: ["She is my", ""], hint: "ئەو خوشکمە", answer: "sister", wrongs: ["brother", "dad", "boy"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک وێنەی خێزانەکەت دەبینێت",
        theyAsk: "Who is in this picture?",
        correct: "This is my family!",
        wrong1: "It is a picture.",
        wrong2: "Family is good.",
        wrong3: "These are my relatives.",
        explanation: "بڵێ: 'This is my family!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "This is my family at home.", targetKurdish: "ئەمە خێزانەکەمە لە ماڵەوە.", imageRequire: require("../../../assets/images/games/family_at_home.png") },
      { kind: "scene", scene: "street", prompt: "Find the brother!", correctId: "brother", choices: [{ id: "brother", emoji: "👦", label: "Brother" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "bubble", prompt: "Pop the sister!", correctId: "sister", choices: [{ id: "sister", emoji: "👧", label: "Sister" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "feed", mascotEmoji: "👩", prompt: "Give Mom a beautiful flower!", correctId: "flower", choices: [{ id: "flower", emoji: "🌸", label: "Flower" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match mom and dad!", items: [{ id: "mom", emoji: "👩", label: "Mom" }, { id: "dad", emoji: "👨", label: "Dad" }] },
      { kind: "native", kurdishPrompt: "خوشک بدۆزەرەوە", correctId: "sister", choices: [{ id: "sister", emoji: "👧", label: "Sister" }, { id: "brother", emoji: "👦", label: "Brother" }] },
      { kind: "simon", phrase: "Simon says, pick Dad!", correctId: "dad", choices: [{ id: "dad", emoji: "👨", label: "Dad" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "train", words: ["This", "is", "my", "family"], kurdishHint: "ئەمە خێزانی منە" },
      { kind: "trick", showEmoji: "👩", showLabel: "Mom", spokenWord: "Mom", matches: true },
      { kind: "treasure", correctId: "family_photo", pool: [{ id: "family_photo", emoji: "🖼️", label: "Family Photo" }, { id: "box", emoji: "📦", label: "Box" }] }
    ],
  },

  // Lesson 1: Grandparents
  {
    topic: "Grandparents", topicKu: "باپیرە و نەنک", topicAr: "الجد والجدة",
    words: [
      { english: "Grandpa", kurdish: "باپیرە", arabic: "جد" },
      { english: "Grandma", kurdish: "نەنک", arabic: "جدة" },
      { english: "Old", kurdish: "پیر", arabic: "عجوز" },
      { english: "Kind", kurdish: "میهرەبان", arabic: "لطيف" },
      { english: "Love", kurdish: "خۆشویستن", arabic: "حب" },
    ],
    voices: [
      { prompt: "بڵێ: باپیرەم پیرە", target: "My grandpa is old.", targetKurdish: "باپیرەم پیرە." },
      { prompt: "بڵێ: نەنکم میهرەبانە", target: "My grandma is kind.", targetKurdish: "نەنکم میهرەبانە." },
    ],
    sentences: [
      { english: ["My", "grandpa", "is", "old"], kurdish: "باپیرەم پیرە", arabic: "جدي عجوز" },
      { english: ["My", "grandma", "is", "kind"], kurdish: "نەنکم میهرەبانە", arabic: "جدتي لطيفة" },
    ],
    fillBlanks: [
      { parts: ["I love my", ""], hint: "باپیرەم خۆشدەوێت", answer: "grandpa", wrongs: ["cat", "dog", "apple"] },
      { parts: ["My", "makes good food"], hint: "نەنکم خواردنی خۆش دروست دەکات", answer: "grandma", wrongs: ["dog", "cat", "bird"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت ئایا نەنکت لەگەڵت دەژی",
        theyAsk: "Does your grandma live here?",
        correct: "Yes, she does!",
        wrong1: "Grandma is kind.",
        wrong2: "I love grandma.",
        wrong3: "My grandmother resides in this domicile.",
        explanation: "وەڵامێکی ئاسان: 'Yes, she does!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "My grandma is kind.", targetKurdish: "نەنکم میهرەبانە.", imageRequire: require("../../../assets/images/games/friendly_teacher.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the grandpa!", correctId: "grandpa", choices: [{ id: "grandpa", emoji: "👴", label: "Grandpa" }, { id: "toy", emoji: "🧸", label: "Toy" }] },
      { kind: "bubble", prompt: "Pop the grandma bubble!", correctId: "grandma", choices: [{ id: "grandma", emoji: "👵", label: "Grandma" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "feed", mascotEmoji: "👵", prompt: "Give Grandma the warm tea!", correctId: "tea", choices: [{ id: "tea", emoji: "🍵", label: "Warm Tea" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match grandpa and grandma!", items: [{ id: "grandpa", emoji: "👴", label: "Grandpa" }, { id: "grandma", emoji: "👵", label: "Grandma" }] },
      { kind: "native", kurdishPrompt: "باپیرە بدۆزەرەوە", correctId: "grandpa", choices: [{ id: "grandpa", emoji: "👴", label: "Grandpa" }, { id: "brother", emoji: "👦", label: "Brother" }] },
      { kind: "simon", phrase: "Simon says, pick Grandma!", correctId: "grandma", choices: [{ id: "grandma", emoji: "👵", label: "Grandma" }, { id: "cat", emoji: "🐱", label: "Cat" }] },
      { kind: "train", words: ["My", "grandpa", "is", "old"], kurdishHint: "باپیرەم پیرە" },
      { kind: "trick", showEmoji: "👵", showLabel: "Grandma", spokenWord: "Grandma", matches: true },
      { kind: "treasure", correctId: "love_heart", pool: [{ id: "love_heart", emoji: "❤️", label: "Love" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 2: Friends
  {
    topic: "Friends", topicKu: "هاوڕێیان", topicAr: "الأصدقاء",
    words: [
      { english: "Friend", kurdish: "هاوڕێ", arabic: "صديق" },
      { english: "Play", kurdish: "یاریکردن", arabic: "يلعب" },
      { english: "Together", kurdish: "پێکەوە", arabic: "معًا" },
      { english: "Fun", kurdish: "خۆش", arabic: "ممتع" },
      { english: "School", kurdish: "قوتابخانە", arabic: "مدرسة" },
    ],
    voices: [
      { prompt: "بڵێ: ئەو هاوڕێمە", target: "He is my friend.", targetKurdish: "ئەو هاوڕێمە." },
      { prompt: "بڵێ: ئێمە پێکەوە یاری دەکەین", target: "We play together.", targetKurdish: "ئێمە پێکەوە یاری دەکەین." },
    ],
    sentences: [
      { english: ["He", "is", "my", "friend"], kurdish: "ئەو هاوڕێمە", arabic: "هو صديقي" },
      { english: ["We", "play", "together"], kurdish: "ئێمە پێکەوە یاری دەکەین", arabic: "نحن نلعب معًا" },
    ],
    fillBlanks: [
      { parts: ["She is my best", ""], hint: "ئەو باشترین هاوڕێمە", answer: "friend", wrongs: ["mom", "dad", "dog"] },
      { parts: ["We play at", ""], hint: "لە قوتابخانە یاری دەکەین", answer: "school", wrongs: ["water", "food", "kitchen"] },
    ],
    conversations: [
      {
        situation: "دایکت دەپرسێت لەگەڵ کێ یاری دەکەیت",
        theyAsk: "Who are you playing with?",
        correct: "I am playing with my friend!",
        wrong1: "I am playing.",
        wrong2: "Friend is nice.",
        wrong3: "I am engaging in recreation with a peer.",
        explanation: "بڵێ: 'I am playing with my friend!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "We play with a ball.", targetKurdish: "یاری بە تۆپ دەکەین.", imageRequire: require("../../../assets/images/games/kids_playing_ball.png") },
      { kind: "scene", scene: "playground", prompt: "Find the friend!", correctId: "friend", choices: [{ id: "friend", emoji: "🧒", label: "Friend" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "bubble", prompt: "Pop the school bag!", correctId: "school", choices: [{ id: "school", emoji: "🎒", label: "School Bag" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the friend a balloon!", correctId: "balloon", choices: [{ id: "balloon", emoji: "🎈", label: "Balloon" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "shadow", prompt: "Match friend and school!", items: [{ id: "friend", emoji: "🧒", label: "Friend" }, { id: "school", emoji: "🏫", label: "School" }] },
      { kind: "native", kurdishPrompt: "قوتابخانە بدۆزەرەوە", correctId: "school", choices: [{ id: "school", emoji: "🏫", label: "School" }, { id: "house", emoji: "🏠", label: "House" }] },
      { kind: "simon", phrase: "Simon says, play together!", correctId: "play", choices: [{ id: "play", emoji: "⚽", label: "Play" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "train", words: ["We", "play", "together"], kurdishHint: "ئێمە پێکەوە یاری دەکەین" },
      { kind: "trick", showEmoji: "🏫", showLabel: "School", spokenWord: "School", matches: true },
      { kind: "treasure", correctId: "toy_block", pool: [{ id: "toy_block", emoji: "🧱", label: "Toy Block" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],
  },

  // Lesson 3: People
  {
    topic: "People", topicKu: "خەڵک", topicAr: "الناس",
    words: [
      { english: "Boy", kurdish: "کوڕ", arabic: "ولد" },
      { english: "Girl", kurdish: "کچ", arabic: "بنت" },
      { english: "Man", kurdish: "پیاو", arabic: "رجل" },
      { english: "Woman", kurdish: "ژن", arabic: "امرأة" },
      { english: "Baby", kurdish: "منداڵ (سەر بێشکە)", arabic: "رضيع" },
    ],
    voices: [
      { prompt: "بڵێ: ئەو کوڕێکی باشە", target: "He is a good boy.", targetKurdish: "ئەو کوڕێکی باشە." },
      { prompt: "بڵێ: منداڵەکە دەگریت", target: "The baby is crying.", targetKurdish: "منداڵەکە دەگریت." },
    ],
    sentences: [
      { english: ["He", "is", "a", "good", "boy"], kurdish: "ئەو کوڕێکی باشە", arabic: "هو ولد جيد" },
      { english: ["The", "baby", "is", "crying"], kurdish: "منداڵەکە دەگریت", arabic: "الرضيع يبكي" },
    ],
    fillBlanks: [
      { parts: ["The", "is playing"], hint: "کچەکە یاری دەکات", answer: "girl", wrongs: ["man", "woman", "cat"] },
      { parts: ["That", "is my dad"], hint: "ئەو پیاوە باوکمە", answer: "man", wrongs: ["baby", "girl", "woman"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت کێ لەوێیە",
        theyAsk: "Who is that baby?",
        correct: "That is my sister!",
        wrong1: "Baby is crying.",
        wrong2: "It is a baby.",
        wrong3: "That infant is my female sibling.",
        explanation: "وەڵام بدەوە: 'That is my sister!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The baby is crying.", targetKurdish: "منداڵەکە دەگریت.", imageRequire: require("../../../assets/images/games/friendly_teacher.png") },
      { kind: "scene", scene: "classroom", prompt: "Find the baby!", correctId: "baby", choices: [{ id: "baby", emoji: "👶", label: "Baby" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "bubble", prompt: "Pop the girl bubble!", correctId: "girl", choices: [{ id: "girl", emoji: "👧", label: "Girl" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "feed", mascotEmoji: "👶", prompt: "Give the crying baby a milk bottle!", correctId: "milk", choices: [{ id: "milk", emoji: "🍼", label: "Milk Bottle" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match boy and girl!", items: [{ id: "boy", emoji: "👦", label: "Boy" }, { id: "girl", emoji: "👧", label: "Girl" }] },
      { kind: "native", kurdishPrompt: "منداڵی ساوا بدۆزەرەوە", correctId: "baby", choices: [{ id: "baby", emoji: "👶", label: "Baby" }, { id: "man", emoji: "👨", label: "Man" }] },
      { kind: "simon", phrase: "Simon says, pick the boy!", correctId: "boy", choices: [{ id: "boy", emoji: "👦", label: "Boy" }, { id: "woman", emoji: "👩", label: "Woman" }] },
      { kind: "train", words: ["He", "is", "a", "boy"], kurdishHint: "ئەو کوڕە" },
      { kind: "trick", showEmoji: "👶", showLabel: "Baby", spokenWord: "Baby", matches: true },
      { kind: "treasure", correctId: "baby_bottle", pool: [{ id: "baby_bottle", emoji: "🍼", label: "Baby Bottle" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],
  },

  // Lesson 4: Pets as Family
  {
    topic: "Pets as Family", topicKu: "ئاژەڵی ماڵی وەک خێزان", topicAr: "الحيوانات الأليفة كعائلة",
    words: [
      { english: "Pet", kurdish: "ئاژەڵی ماڵی", arabic: "حيوان أليف" },
      { english: "Dog", kurdish: "سەگ", arabic: "كلب" },
      { english: "Cat", kurdish: "پشیلە", arabic: "قطة" },
      { english: "Love", kurdish: "خۆشویستن", arabic: "يحب" },
      { english: "House", kurdish: "ماڵ", arabic: "منزل" },
    ],
    voices: [
      { prompt: "بڵێ: سەگەکەم خۆشدەوێت", target: "I love my dog.", targetKurdish: "سەگەکەم خۆشدەوێت." },
      { prompt: "بڵێ: ئێمە پشیلەیەکمان هەیە", target: "We have a cat.", targetKurdish: "ئێمە پشیلەیەکمان هەیە." },
    ],
    sentences: [
      { english: ["I", "love", "my", "dog"], kurdish: "سەگەکەم خۆشدەوێت", arabic: "أنا أحب كلبي" },
      { english: ["We", "have", "a", "cat"], kurdish: "ئێمە پشیلەیەکمان هەیە", arabic: "عندنا قطة" },
    ],
    fillBlanks: [
      { parts: ["My", "is part of the family"], hint: "ئاژەڵە ماڵییەکەم بەشێکە لە خێزان", answer: "pet", wrongs: ["car", "book", "apple"] },
      { parts: ["The dog is in the", ""], hint: "سەگەکە لە ماڵەوەیە", answer: "house", wrongs: ["moon", "sun", "sky"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت ئایا ئاژەڵی ماڵیت هەیە",
        theyAsk: "Do you have a pet?",
        correct: "Yes, I have a dog!",
        wrong1: "Pet is good.",
        wrong2: "I have a house.",
        wrong3: "I possess a domesticated animal.",
        explanation: "بڵێ: 'Yes, I have a dog!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I love my dog.", targetKurdish: "سەگەکەم خۆشدەوێت.", imageRequire: require("../../../assets/images/games/kid_wearing_shoes.png") },
      { kind: "scene", scene: "yard", prompt: "Find the dog!", correctId: "dog", choices: [{ id: "dog", emoji: "🐶", label: "Dog" }, { id: "tree", emoji: "🌳", label: "Tree" }] },
      { kind: "bubble", prompt: "Pop the cat bubble!", correctId: "cat", choices: [{ id: "cat", emoji: "🐱", label: "Cat" }, { id: "fish", emoji: "🐟", label: "Fish" }] },
      { kind: "feed", mascotEmoji: "🐶", prompt: "Feed the puppy a tasty bone!", correctId: "bone", choices: [{ id: "bone", emoji: "🦴", label: "Bone" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match dog and cat!", items: [{ id: "dog", emoji: "🐶", label: "Dog" }, { id: "cat", emoji: "🐱", label: "Cat" }] },
      { kind: "native", kurdishPrompt: "پشیلە بدۆزەرەوە", correctId: "cat", choices: [{ id: "cat", emoji: "🐱", label: "Cat" }, { id: "bird", emoji: "🐦", label: "Bird" }] },
      { kind: "simon", phrase: "Simon says, pick the pet!", correctId: "pet", choices: [{ id: "pet", emoji: "🐶", label: "Pet" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "train", words: ["I", "love", "my", "dog"], kurdishHint: "سەگەکەم خۆشدەوێت" },
      { kind: "trick", showEmoji: "🐶", showLabel: "Dog", spokenWord: "Dog", matches: true },
      { kind: "treasure", correctId: "collar", pool: [{ id: "collar", emoji: "🦮", label: "Dog Collar" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 5: Sharing
  {
    topic: "Sharing", topicKu: "بەشکردن", topicAr: "المشاركة",
    words: [
      { english: "Share", kurdish: "بەشکردن", arabic: "يشارك" },
      { english: "Toy", kurdish: "یاری", arabic: "لعبة" },
      { english: "Give", kurdish: "پێدان", arabic: "يعطي" },
      { english: "Take", kurdish: "وەرگرتن", arabic: "يأخذ" },
      { english: "Please", kurdish: "تکایە", arabic: "من فضلك" },
    ],
    voices: [
      { prompt: "بڵێ: من یارییەکەم بەشدەکەم", target: "I share my toy.", targetKurdish: "من یارییەکەم بەشدەکەم." },
      { prompt: "بڵێ: تکایە یارییەکەم پێ بدە", target: "Please give me the toy.", targetKurdish: "تکایە یارییەکەم پێ بدە." },
    ],
    sentences: [
      { english: ["I", "share", "my", "toy"], kurdish: "من یارییەکەم بەشدەکەم", arabic: "أنا أشارك لعبتي" },
      { english: ["Please", "give", "me", "the", "toy"], kurdish: "تکایە یارییەکەم پێ بدە", arabic: "من فضلك أعطني اللعبة" },
    ],
    fillBlanks: [
      { parts: ["Can I", "this toy?"], hint: "دەتوانم ئەم یارییە وەرگرم؟", answer: "take", wrongs: ["eat", "drink", "sleep"] },
      { parts: ["I", "my toys with my brother"], hint: "یارییەکانم لەگەڵ برام بەش دەکەم", answer: "share", wrongs: ["eat", "drink", "run"] },
    ],
    conversations: [
      {
        situation: "برات یارییەکی دەوێت",
        theyAsk: "Can I play with your toy?",
        correct: "Yes, we can share!",
        wrong1: "Toy is mine.",
        wrong2: "I play.",
        wrong3: "You may utilize my plaything.",
        explanation: "وەڵامێکی جوان: 'Yes, we can share!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The boy shares an apple.", targetKurdish: "کوڕەکە سێوێک بەش دەکات.", imageRequire: require("../../../assets/images/games/boy_sharing_apple.png") },
      { kind: "scene", scene: "playground", prompt: "Find the toy train!", correctId: "train", choices: [{ id: "train", emoji: "🚂", label: "Toy Train" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "bubble", prompt: "Pop the gift box!", correctId: "gift", choices: [{ id: "gift", emoji: "🎁", label: "Gift Box" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "feed", mascotEmoji: "🐼", prompt: "Share the sweet apple with the panda!", correctId: "apple", choices: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match toy and gift!", items: [{ id: "toy", emoji: "🧸", label: "Toy" }, { id: "gift", emoji: "🎁", label: "Gift" }] },
      { kind: "native", kurdishPrompt: "یاری بدۆزەرەوە", correctId: "toy", choices: [{ id: "toy", emoji: "🧸", label: "Toy" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "simon", phrase: "Simon says, share the toy!", correctId: "share", choices: [{ id: "share", emoji: "🤝", label: "Share" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "train", words: ["I", "share", "my", "toy"], kurdishHint: "من یارییەکەم بەشدەکەم" },
      { kind: "trick", showEmoji: "🧸", showLabel: "Toy", spokenWord: "Toy", matches: true },
      { kind: "treasure", correctId: "toy_block", pool: [{ id: "toy_block", emoji: "🧱", label: "Toy Block" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],
  },

  // Lesson 6: Feelings
  {
    topic: "Feelings", topicKu: "هەستەکان", topicAr: "المشاعر",
    words: [
      { english: "Happy", kurdish: "دڵخۆش", arabic: "سعيد" },
      { english: "Sad", kurdish: "دڵتەنگ", arabic: "حزين" },
      { english: "Mad", kurdish: "توڕە", arabic: "غاضب" },
      { english: "Smile", kurdish: "زەردەخەنە", arabic: "يبتسم" },
      { english: "Cry", kurdish: "گریان", arabic: "يبكي" },
    ],
    voices: [
      { prompt: "بڵێ: من دڵخۆشم", target: "I am happy.", targetKurdish: "من دڵخۆشم." },
      { prompt: "بڵێ: ئەو دڵتەنگە", target: "He is sad.", targetKurdish: "ئەو دڵتەنگە." },
    ],
    sentences: [
      { english: ["I", "am", "happy"], kurdish: "من دڵخۆشم", arabic: "أنا سعيد" },
      { english: ["He", "is", "sad"], kurdish: "ئەو دڵتەنگە", arabic: "هو حزين" },
    ],
    fillBlanks: [
      { parts: ["When I am happy, I", ""], hint: "کاتێک دڵخۆشم زەردەخەنە دەکەم", answer: "smile", wrongs: ["cry", "run", "eat"] },
      { parts: ["She is", "because her toy broke"], hint: "ئەو دڵتەنگە چونکە یارییەکەی شکا", answer: "sad", wrongs: ["happy", "mad", "smile"] },
    ],
    conversations: [
      {
        situation: "دایکت دەبینێت دڵتەنگیت",
        theyAsk: "Why are you sad?",
        correct: "I lost my toy.",
        wrong1: "I am happy.",
        wrong2: "Sad is bad.",
        wrong3: "I am experiencing melancholy.",
        explanation: "هۆکارەکە بڵێ: 'I lost my toy.'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I feel very happy.", targetKurdish: "زۆر هەست بە دڵخۆشی دەکەم.", imageRequire: require("../../../assets/images/games/friendly_teacher.png") },
      { kind: "scene", scene: "playground", prompt: "Find the happy smiling face!", correctId: "happy", choices: [{ id: "happy", emoji: "😀", label: "Happy" }, { id: "mad", emoji: "😡", label: "Mad" }] },
      { kind: "bubble", prompt: "Pop the sad face!", correctId: "sad", choices: [{ id: "sad", emoji: "😢", label: "Sad" }, { id: "smile", emoji: "😀", label: "Smile" }] },
      { kind: "feed", mascotEmoji: "🦉", prompt: "Give the sad owl a warm heart!", correctId: "heart", choices: [{ id: "heart", emoji: "❤️", label: "Heart" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match smile and cry!", items: [{ id: "smile", emoji: "😀", label: "Smile" }, { id: "cry", emoji: "😭", label: "Cry" }] },
      { kind: "native", kurdishPrompt: "دڵخۆش بدۆزەرەوە", correctId: "happy", choices: [{ id: "happy", emoji: "😀", label: "Happy" }, { id: "sad", emoji: "😢", label: "Sad" }] },
      { kind: "simon", phrase: "Simon says, show a smile!", correctId: "smile", choices: [{ id: "smile", emoji: "😀", label: "Smile" }, { id: "cry", emoji: "😭", label: "Cry" }] },
      { kind: "train", words: ["I", "am", "happy"], kurdishHint: "من دڵخۆشم" },
      { kind: "trick", showEmoji: "😀", showLabel: "Smile", spokenWord: "Smile", matches: true },
      { kind: "treasure", correctId: "happy_star", pool: [{ id: "happy_star", emoji: "⭐️", label: "Happy Star" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 7: Helping out
  {
    topic: "Helping out", topicKu: "یارمەتیدان", topicAr: "المساعدة",
    words: [
      { english: "Help", kurdish: "یارمەتیدان", arabic: "يساعد" },
      { english: "Clean", kurdish: "پاککردنەوە", arabic: "ينظف" },
      { english: "Room", kurdish: "ژوور", arabic: "غرفة" },
      { english: "Good", kurdish: "باش", arabic: "جيد" },
      { english: "Work", kurdish: "کار", arabic: "عمل" },
    ],
    voices: [
      { prompt: "بڵێ: من ژوورەکەم پاکدەکەمەوە", target: "I clean my room.", targetKurdish: "من ژوورەکەم پاکدەکەمەوە." },
      { prompt: "بڵێ: باوکم یارمەتی دەدەم", target: "I help my dad.", targetKurdish: "باوکم یارمەتی دەدەم." },
    ],
    sentences: [
      { english: ["I", "clean", "my", "room"], kurdish: "من ژوورەکەم پاکدەکەمەوە", arabic: "أنا أنظف غرفتي" },
      { english: ["I", "help", "my", "dad"], kurdish: "باوکم یارمەتی دەدەم", arabic: "أساعد أبي" },
    ],
    fillBlanks: [
      { parts: ["I am a", "boy"], hint: "من کوڕێکی باشم", answer: "good", wrongs: ["bad", "sad", "mad"] },
      { parts: ["We do good", ""], hint: "ئێمە کاری باش دەکەین", answer: "work", wrongs: ["food", "water", "apple"] },
    ],
    conversations: [
      {
        situation: "باوکت داوای یارمەتی دەکات",
        theyAsk: "Can you help me clean?",
        correct: "Yes, I will help!",
        wrong1: "I clean.",
        wrong2: "Room is clean.",
        wrong3: "I shall assist in sanitation.",
        explanation: "بڵێ: 'Yes, I will help!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I clean my room.", targetKurdish: "من ژوورەکەم پاکدەکەمەوە.", imageRequire: require("../../../assets/images/games/kid_reading_book.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the broom!", correctId: "broom", choices: [{ id: "broom", emoji: "🧹", label: "Broom" }, { id: "toy", emoji: "🧸", label: "Toy" }] },
      { kind: "bubble", prompt: "Pop the clean cloth!", correctId: "clean", choices: [{ id: "clean", emoji: "🧽", label: "Clean" }, { id: "dirt", emoji: "🪨", label: "Dirt" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Help the child clean up!", correctId: "clean", choices: [{ id: "clean", emoji: "🧹", label: "Clean" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match clean and work!", items: [{ id: "clean", emoji: "🧹", label: "Clean" }, { id: "work", emoji: "💼", label: "Work" }] },
      { kind: "native", kurdishPrompt: "باش بدۆزەرەوە", correctId: "good", choices: [{ id: "good", emoji: "👍", label: "Good" }, { id: "bad", emoji: "👎", label: "Bad" }] },
      { kind: "simon", phrase: "Simon says, clean the room!", correctId: "clean", choices: [{ id: "clean", emoji: "🧹", label: "Clean" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "train", words: ["I", "clean", "my", "room"], kurdishHint: "من ژوورەکەم پاک دەکەمەوە" },
      { kind: "trick", showEmoji: "🧹", showLabel: "Clean", spokenWord: "Clean", matches: true },
      { kind: "treasure", correctId: "clean_towel", pool: [{ id: "clean_towel", emoji: "🧼", label: "Clean Towel" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 8: Parties
  {
    topic: "Parties", topicKu: "ئاهەنگەکان", topicAr: "الحفلات",
    words: [
      { english: "Party", kurdish: "ئاهەنگ", arabic: "حفلة" },
      { english: "Birthday", kurdish: "لەدایکبوون", arabic: "عيد ميلاد" },
      { english: "Gift", kurdish: "دیاری", arabic: "هدية" },
      { english: "Balloon", kurdish: "باڵۆن", arabic: "بالون" },
      { english: "Sing", kurdish: "گۆرانی وتن", arabic: "يغني" },
    ],
    voices: [
      { prompt: "بڵێ: ئەوە ئاهەنگی منە", target: "It is my party.", targetKurdish: "ئەوە ئاهەنگی منە." },
      { prompt: "بڵێ: ئێمە گۆرانی دەڵێین", target: "We sing a song.", targetKurdish: "ئێمە گۆرانی دەڵێین." },
    ],
    sentences: [
      { english: ["It", "is", "my", "party"], kurdish: "ئەوە ئاهەنگی منە", arabic: "إنها حفلتي" },
      { english: ["We", "sing", "a", "song"], kurdish: "ئێمە گۆرانی دەڵێین", arabic: "نحن نغني أغنية" },
    ],
    fillBlanks: [
      { parts: ["I got a birthday", ""], hint: "دیاری لەدایکبوونم وەرگرت", answer: "gift", wrongs: ["dog", "cat", "water"] },
      { parts: ["The", "is red"], hint: "باڵۆنەکە سوورە", answer: "balloon", wrongs: ["gift", "sing", "party"] },
    ],
    conversations: [
      {
        situation: "لە ئاهەنگی لەدایکبوونەکەتدایت و هاوڕێیەک دیارییەکت پێدەدات",
        theyAsk: "Happy Birthday! Here is a gift.",
        correct: "Thank you so much!",
        wrong1: "It is a gift.",
        wrong2: "I like party.",
        wrong3: "I accept your offering.",
        explanation: "وەڵامێکی ڕێزدارانە: 'Thank you so much!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "It is my party.", targetKurdish: "ئەوە ئاهەنگی منە.", imageRequire: require("../../../assets/images/games/kids_hugging.png") },
      { kind: "scene", scene: "playground", prompt: "Find the colorful balloons!", correctId: "balloon", choices: [{ id: "balloon", emoji: "🎈", label: "Balloon" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "bubble", prompt: "Pop the gift box!", correctId: "gift", choices: [{ id: "gift", emoji: "🎁", label: "Gift" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the birthday boy a birthday cake!", correctId: "cake", choices: [{ id: "cake", emoji: "🎂", label: "Cake" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match gift and balloon!", items: [{ id: "gift", emoji: "🎁", label: "Gift" }, { id: "balloon", emoji: "🎈", label: "Balloon" }] },
      { kind: "native", kurdishPrompt: "باڵۆن بدۆزەرەوە", correctId: "balloon", choices: [{ id: "balloon", emoji: "🎈", label: "Balloon" }, { id: "gift", emoji: "🎁", label: "Gift" }] },
      { kind: "simon", phrase: "Simon says, sing a song!", correctId: "sing", choices: [{ id: "sing", emoji: "🎤", label: "Sing" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "train", words: ["It", "is", "my", "party"], kurdishHint: "ئەوە ئاهەنگی منە" },
      { kind: "trick", showEmoji: "🎈", showLabel: "Balloon", spokenWord: "Balloon", matches: true },
      { kind: "treasure", correctId: "birthday_gift", pool: [{ id: "birthday_gift", emoji: "🎁", label: "Birthday Gift" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 9: Bedtime
  {
    topic: "Bedtime", topicKu: "کاتی خەوتن", topicAr: "وقت النوم",
    words: [
      { english: "Sleep", kurdish: "خەوتن", arabic: "ينام" },
      { english: "Bed", kurdish: "جێگا", arabic: "سرير" },
      { english: "Night", kurdish: "شەو", arabic: "ليل" },
      { english: "Tired", kurdish: "ماندوو", arabic: "متعب" },
      { english: "Story", kurdish: "چیرۆک", arabic: "قصة" },
    ],
    voices: [
      { prompt: "بڵێ: من دەمەوێت بخەوم", target: "I want to sleep.", targetKurdish: "من دەمەوێت بخەوم." },
      { prompt: "بڵێ: من ماندووم", target: "I am tired.", targetKurdish: "من ماندووم." },
    ],
    sentences: [
      { english: ["I", "want", "to", "sleep"], kurdish: "من دەمەوێت بخەوم", arabic: "أريد أن أنام" },
      { english: ["I", "am", "tired"], kurdish: "من متعب", arabic: "أنا متعب" },
    ],
    fillBlanks: [
      { parts: ["Mom reads me a", ""], hint: "دایکم چیرۆکێکم بۆ دەخوێنێتەوە", answer: "story", wrongs: ["bed", "sleep", "night"] },
      { parts: ["I go to", ""], hint: "دەچم بۆ جێگا", answer: "bed", wrongs: ["night", "tired", "story"] },
    ],
    conversations: [
      {
        situation: "شەوە و کاتی خەوە",
        theyAsk: "It is time for bed. Good night!",
        correct: "Good night, mom!",
        wrong1: "I sleep.",
        wrong2: "Bed is soft.",
        wrong3: "Have a pleasant evening.",
        explanation: "بڵێ: 'Good night, mom!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I read a book before bed.", targetKurdish: "پێش خەوتن چیرۆک دەخوێنمەوە.", imageRequire: require("../../../assets/images/games/kid_reading_book.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the bed!", correctId: "bed", choices: [{ id: "bed", emoji: "🛏️", label: "Bed" }, { id: "toy", emoji: "🧸", label: "Toy" }] },
      { kind: "bubble", prompt: "Pop the moon!", correctId: "moon", choices: [{ id: "moon", emoji: "🌙", label: "Moon" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "feed", mascotEmoji: "🦉", prompt: "Give the sleepy owl the storybook!", correctId: "book", choices: [{ id: "book", emoji: "📖", label: "Storybook" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "shadow", prompt: "Match bed and pillow!", items: [{ id: "bed", emoji: "🛏️", label: "Bed" }, { id: "pillow", emoji: "🛋️", label: "Pillow" }] },
      { kind: "native", kurdishPrompt: "خەوتن بدۆزەرەوە", correctId: "sleep", choices: [{ id: "sleep", emoji: "💤", label: "Sleep" }, { id: "play", emoji: "⚽", label: "Play" }] },
      { kind: "simon", phrase: "Simon says, go to sleep!", correctId: "sleep", choices: [{ id: "sleep", emoji: "💤", label: "Sleep" }, { id: "wake", emoji: "⏰", label: "Wake" }] },
      { kind: "train", words: ["I", "want", "to", "sleep"], kurdishHint: "دەمەوێت بخەوم" },
      { kind: "trick", showEmoji: "😴", showLabel: "Tired", spokenWord: "Tired", matches: true },
      { kind: "treasure", correctId: "starry_night", pool: [{ id: "starry_night", emoji: "🌌", label: "Starry Night" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },
];

export default kidsUnit5;
