import type { UnitBank } from "../types";

// ── Kids Unit 5: Family & Friends (خێزان و هاوڕێیان) ──────────────────────
const kidsUnit5: UnitBank = [
  // Lesson 0: Family Members
  {
    topic: "Family Members", topicKu: "ئەندامانی خێزان",
    words: [
      { english: "Family", kurdish: "خێزان" },
      { english: "Mom", kurdish: "دایک" },
      { english: "Dad", kurdish: "باوک" },
      { english: "Brother", kurdish: "برا" },
      { english: "Sister", kurdish: "خوشک" },
    ],
    voices: [
      { prompt: "بڵێ: ئەمە خێزانی منە", target: "This is my family.", targetKurdish: "ئەمە خێزانی منە." },
      { prompt: "بڵێ: من برایەکم هەیە", target: "I have a brother.", targetKurdish: "من برایەکم هەیە." },
    ],
    sentences: [
      { english: ["This", "is", "my", "family"], kurdish: "ئەمە خێزانی منە" },
      { english: ["I", "have", "a", "brother"], kurdish: "من برایەکم هەیە" },
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
  },
  // Lesson 1: Grandparents
  {
    topic: "Grandparents", topicKu: "باپیرە و نەنک",
    words: [
      { english: "Grandpa", kurdish: "باپیرە" },
      { english: "Grandma", kurdish: "نەنک" },
      { english: "Old", kurdish: "پیر" },
      { english: "Kind", kurdish: "میهرەبان" },
      { english: "Love", kurdish: "خۆشویستن" },
    ],
    voices: [
      { prompt: "بڵێ: باپیرەم پیرە", target: "My grandpa is old.", targetKurdish: "باپیرەم پیرە." },
      { prompt: "بڵێ: نەنکم میهرەبانە", target: "My grandma is kind.", targetKurdish: "نەنکم میهرەبانە." },
    ],
    sentences: [
      { english: ["My", "grandpa", "is", "old"], kurdish: "باپیرەم پیرە" },
      { english: ["My", "grandma", "is", "kind"], kurdish: "نەنکم میهرەبانە" },
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
  },
  // Lesson 2: Friends
  {
    topic: "Friends", topicKu: "هاوڕێیان",
    words: [
      { english: "Friend", kurdish: "هاوڕێ" },
      { english: "Play", kurdish: "یاریکردن" },
      { english: "Together", kurdish: "پێکەوە" },
      { english: "Fun", kurdish: "خۆش" },
      { english: "School", kurdish: "قوتابخانە" },
    ],
    voices: [
      { prompt: "بڵێ: ئەو هاوڕێمە", target: "He is my friend.", targetKurdish: "ئەو هاوڕێمە." },
      { prompt: "بڵێ: ئێمە پێکەوە یاری دەکەین", target: "We play together.", targetKurdish: "ئێمە پێکەوە یاری دەکەین." },
    ],
    sentences: [
      { english: ["He", "is", "my", "friend"], kurdish: "ئەو هاوڕێمە" },
      { english: ["We", "play", "together"], kurdish: "ئێمە پێکەوە یاری دەکەین" },
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
  },
  // Lesson 3: People
  {
    topic: "People", topicKu: "خەڵک",
    words: [
      { english: "Boy", kurdish: "کوڕ" },
      { english: "Girl", kurdish: "کچ" },
      { english: "Man", kurdish: "پیاو" },
      { english: "Woman", kurdish: "ژن" },
      { english: "Baby", kurdish: "منداڵ (سەر بێشکە)" },
    ],
    voices: [
      { prompt: "بڵێ: ئەو کوڕێکی باشە", target: "He is a good boy.", targetKurdish: "ئەو کوڕێکی باشە." },
      { prompt: "بڵێ: منداڵەکە دەگریت", target: "The baby is crying.", targetKurdish: "منداڵەکە دەگریت." },
    ],
    sentences: [
      { english: ["He", "is", "a", "good", "boy"], kurdish: "ئەو کوڕێکی باشە" },
      { english: ["The", "baby", "is", "crying"], kurdish: "منداڵەکە دەگریت" },
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
  },
  // Lesson 4: Pets as Family
  {
    topic: "Pets as Family", topicKu: "ئاژەڵی ماڵی وەک خێزان",
    words: [
      { english: "Pet", kurdish: "ئاژەڵی ماڵی" },
      { english: "Dog", kurdish: "سەگ" },
      { english: "Cat", kurdish: "پشیلە" },
      { english: "Love", kurdish: "خۆشویستن" },
      { english: "House", kurdish: "ماڵ" },
    ],
    voices: [
      { prompt: "بڵێ: سەگەکەم خۆشدەوێت", target: "I love my dog.", targetKurdish: "سەگەکەم خۆشدەوێت." },
      { prompt: "بڵێ: ئێمە پشیلەیەکمان هەیە", target: "We have a cat.", targetKurdish: "ئێمە پشیلەیەکمان هەیە." },
    ],
    sentences: [
      { english: ["I", "love", "my", "dog"], kurdish: "سەگەکەم خۆشدەوێت" },
      { english: ["We", "have", "a", "cat"], kurdish: "ئێمە پشیلەیەکمان هەیە" },
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
  },
  // Lesson 5: Sharing
  {
    topic: "Sharing", topicKu: "بەشکردن",
    words: [
      { english: "Share", kurdish: "بەشکردن" },
      { english: "Toy", kurdish: "یاری" },
      { english: "Give", kurdish: "پێدان" },
      { english: "Take", kurdish: "وەرگرتن" },
      { english: "Please", kurdish: "تکایە" },
    ],
    voices: [
      { prompt: "بڵێ: من یارییەکەم بەشدەکەم", target: "I share my toy.", targetKurdish: "من یارییەکەم بەشدەکەم." },
      { prompt: "بڵێ: تکایە یارییەکەم پێ بدە", target: "Please give me the toy.", targetKurdish: "تکایە یارییەکەم پێ بدە." },
    ],
    sentences: [
      { english: ["I", "share", "my", "toy"], kurdish: "من یارییەکەم بەشدەکەم" },
      { english: ["Please", "give", "me", "the", "toy"], kurdish: "تکایە یارییەکەم پێ بدە" },
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
  },
  // Lesson 6: Feelings
  {
    topic: "Feelings", topicKu: "هەستەکان",
    words: [
      { english: "Happy", kurdish: "دڵخۆش" },
      { english: "Sad", kurdish: "دڵتەنگ" },
      { english: "Mad", kurdish: "توڕە" },
      { english: "Smile", kurdish: "زەردەخەنە" },
      { english: "Cry", kurdish: "گریان" },
    ],
    voices: [
      { prompt: "بڵێ: من دڵخۆشم", target: "I am happy.", targetKurdish: "من دڵخۆشم." },
      { prompt: "بڵێ: ئەو دڵتەنگە", target: "He is sad.", targetKurdish: "ئەو دڵتەنگە." },
    ],
    sentences: [
      { english: ["I", "am", "happy"], kurdish: "من دڵخۆشم" },
      { english: ["He", "is", "sad"], kurdish: "ئەو دڵتەنگە" },
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
  },
  // Lesson 7: Helping out
  {
    topic: "Helping out", topicKu: "یارمەتیدان",
    words: [
      { english: "Help", kurdish: "یارمەتیدان" },
      { english: "Clean", kurdish: "پاککردنەوە" },
      { english: "Room", kurdish: "ژوور" },
      { english: "Good", kurdish: "باش" },
      { english: "Work", kurdish: "کار" },
    ],
    voices: [
      { prompt: "بڵێ: من ژوورەکەم پاکدەکەمەوە", target: "I clean my room.", targetKurdish: "من ژوورەکەم پاکدەکەمەوە." },
      { prompt: "بڵێ: باوکم یارمەتی دەدەم", target: "I help my dad.", targetKurdish: "باوکم یارمەتی دەدەم." },
    ],
    sentences: [
      { english: ["I", "clean", "my", "room"], kurdish: "من ژوورەکەم پاکدەکەمەوە" },
      { english: ["I", "help", "my", "dad"], kurdish: "باوکم یارمەتی دەدەم" },
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
  },
  // Lesson 8: Parties & Birthdays
  {
    topic: "Parties", topicKu: "ئاهەنگەکان",
    words: [
      { english: "Party", kurdish: "ئاهەنگ" },
      { english: "Birthday", kurdish: "لەدایکبوون" },
      { english: "Gift", kurdish: "دیاری" },
      { english: "Balloon", kurdish: "باڵۆن" },
      { english: "Sing", kurdish: "گۆرانی وتن" },
    ],
    voices: [
      { prompt: "بڵێ: ئەوە ئاهەنگی منە", target: "It is my party.", targetKurdish: "ئەوە ئاهەنگی منە." },
      { prompt: "بڵێ: ئێمە گۆرانی دەڵێین", target: "We sing a song.", targetKurdish: "ئێمە گۆرانی دەڵێین." },
    ],
    sentences: [
      { english: ["It", "is", "my", "party"], kurdish: "ئەوە ئاهەنگی منە" },
      { english: ["We", "sing", "a", "song"], kurdish: "ئێمە گۆرانی دەڵێین" },
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
        explanation: "وەڵامی ڕێزدارانە: 'Thank you so much!'",
      },
    ],
  },
  // Lesson 9: Bedtime
  {
    topic: "Bedtime", topicKu: "کاتی خەوتن",
    words: [
      { english: "Sleep", kurdish: "خەوتن" },
      { english: "Bed", kurdish: "جێگا" },
      { english: "Night", kurdish: "شەو" },
      { english: "Tired", kurdish: "ماندوو" },
      { english: "Story", kurdish: "چیرۆک" },
    ],
    voices: [
      { prompt: "بڵێ: من دەمەوێت بخەوم", target: "I want to sleep.", targetKurdish: "من دەمەوێت بخەوم." },
      { prompt: "بڵێ: من ماندووم", target: "I am tired.", targetKurdish: "من ماندووم." },
    ],
    sentences: [
      { english: ["I", "want", "to", "sleep"], kurdish: "من دەمەوێت بخەوم" },
      { english: ["I", "am", "tired"], kurdish: "من ماندووم" },
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
  },
];

export default kidsUnit5;
