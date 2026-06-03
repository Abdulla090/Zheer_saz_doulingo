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
  },
  // Lesson 8: Parties & Birthdays
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
        explanation: "وەڵامی ڕێزدارانە: 'Thank you so much!'",
      },
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
      { english: ["I", "am", "tired"], kurdish: "من ماندووم", arabic: "أنا متعب" },
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
