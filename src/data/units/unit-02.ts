import { UnitBank } from "../types";

// ── Unit 2: Daily Life, Food & Chilling — 10 unique lessons ──────────────────────────────
const unit02: UnitBank = [

  // Lesson 0: Morning Routine
  {
    topic: "Mornings", topicKu: "بەیانیان",
    words: [
      { english: "Sleep in", kurdish: "درەنگ هەستان لە خەو" },
      { english: "Early bird", kurdish: "کەسێک کە زوو هەڵدەستێت" },
      { english: "Coffee fix", kurdish: "پێویستی بە قاوە" },
      { english: "Groggy", kurdish: "خەواڵوو (تازە هەستاوە)" },
      { english: "Hit the snooze", kurdish: "دواخستنی زەنگی مۆبایل" },
    ],
    voices: [
      { prompt: "بڵێ دەمەوێت درەنگ هەستم", target: "I'm gonna sleep in tomorrow.", targetKurdish: "سبەی دەمەوێت درەنگ هەستم." },
      { prompt: "بڵێ پێویستم بە قاوەیە", target: "I desperately need my coffee fix.", targetKurdish: "بە سەختی پێویستم بە قاوەکەمە." },
    ],
    sentences: [
      { english: ["I'm", "gonna", "sleep", "in", "tomorrow"], kurdish: "سبەی دەمەوێت درەنگ هەستم" },
      { english: ["I", "desperately", "need", "my", "coffee", "fix"], kurdish: "بە سەختی پێویستم بە قاوەکەمە" },
    ],
    fillBlanks: [
      { parts: ["I'm totally", "without my coffee."], hint: "خەواڵوو / سەرلێشێواو", answer: "groggy", wrongs: ["froggy", "jumping", "blue"] },
      { parts: ["I", "the snooze button three times."], hint: "لێدان (داگرتن)", answer: "hit", wrongs: ["punch", "apple", "cloud"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت بەیانی زوو پەیوەندیت پێوە دەکات",
        theyAsk: "Why do you sound so tired?",
        correct: "I just woke up, I'm still super groggy.",
        wrong1: "The bird is eating coffee.",
        wrong2: "I sleep in the ceiling.",
        wrong3: "My fix is hitting the tree.",
        explanation: "وەڵامێکی سروشتی بۆ کەسێک کە تازە لە خەو هەستاوە: 'I just woke up, I'm still super groggy.'",
      },
    ],
  },

  // Lesson 1: Eating Out
  {
    topic: "Getting Food", topicKu: "نانخواردنی دەرەوە",
    words: [
      { english: "Grab a bite", kurdish: "نانخواردنێکی خێرا" },
      { english: "Starving", kurdish: "زۆر برسی" },
      { english: "Craving", kurdish: "ئارەزووی خواردنێک (ئیشتیها)" },
      { english: "Takeout", kurdish: "خواردنی بردنە دەرەوە (سەفەری)" },
      { english: "Stuffed", kurdish: "تێر (زۆر خواردووە)" },
    ],
    voices: [
      { prompt: "بڵێ با شتێک بخۆین", target: "Let's go grab a bite.", targetKurdish: "با بڕۆین شتێک بخۆین." },
      { prompt: "بڵێ ئارەزووی پیتزا دەکەم", target: "I'm really craving pizza right now.", targetKurdish: "لە ئێستادا بەڕاستی ئارەزووی پیتزا دەکەم." },
    ],
    sentences: [
      { english: ["Let's", "go", "grab", "a", "bite"], kurdish: "با بڕۆین شتێک بخۆین" },
      { english: ["I'm", "really", "craving", "pizza", "right", "now"], kurdish: "لە ئێستادا بەڕاستی ئارەزووی پیتزا دەکەم" },
    ],
    fillBlanks: [
      { parts: ["Wanna go", "a bite?"], hint: "گرتن / بردن", answer: "grab", wrongs: ["throw", "jumping", "apple"] },
      { parts: ["I can't eat anymore, I'm completely", "."], hint: "تێر (پڕبووە)", answer: "stuffed", wrongs: ["pillowed", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت دەپرسێت ئایا برسیتە",
        theyAsk: "Are you hungry? I can make some food.",
        correct: "Yes please, I am absolutely starving.",
        wrong1: "I am stuffed with the chair.",
        wrong2: "Craving the takeout window.",
        wrong3: "I grab the bite tree.",
        explanation: "دەربڕینی برسێتی زۆر: 'Yes please, I am absolutely starving.'",
      },
    ],
  },

  // Lesson 2: Cooking at Home
  {
    topic: "Cooking", topicKu: "چێشتلێنان",
    words: [
      { english: "Whip up", kurdish: "دروستکردنی خواردن بە خێرایی" },
      { english: "From scratch", kurdish: "لە سفرەوە دروستکردن" },
      { english: "Leftovers", kurdish: "خواردنی ماوە (ی پێشوو)" },
      { english: "Burnt", kurdish: "سوتاو" },
      { english: "Hit the spot", kurdish: "ڕێک ئەوە بوو کە دەمویست (بەتامبوو)" },
    ],
    voices: [
      { prompt: "بڵێ شتێک بە خێرایی دروست دەکەم", target: "I'll whip up something quick.", targetKurdish: "خواردنێک بە خێرایی دروست دەکەم." },
      { prompt: "بڵێ خواردنەکە زۆر بەتام بوو", target: "Man, that really hit the spot.", targetKurdish: "کابرا، ئەوە بەڕاستی ڕێک ئەوە بوو کە دەمویست." },
    ],
    sentences: [
      { english: ["I'll", "whip", "up", "something", "quick"], kurdish: "خواردنێک بە خێرایی دروست دەکەم" },
      { english: ["Man", "that", "really", "hit", "the", "spot"], kurdish: "ئەوە بەڕاستی ڕێک ئەوە بوو کە دەمویست" },
    ],
    fillBlanks: [
      { parts: ["Did you make this from", "?"], hint: "سفرەوە / بنچینە", answer: "scratch", wrongs: ["itch", "jumping", "apple"] },
      { parts: ["We can just eat", "from last night."], hint: "خواردنی ماوە", answer: "leftovers", wrongs: ["rightovers", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت خواردنێکی خۆشی بۆ دروستکردویت",
        theyAsk: "How was the burger I made?",
        correct: "It was amazing, it really hit the spot.",
        wrong1: "The spot is burnt the leftovers.",
        wrong2: "I whip up the car.",
        wrong3: "Scratch the burger window.",
        explanation: "وەسفکردنی خواردنێکی خۆش: 'It was amazing, it really hit the spot.'",
      },
    ],
  },

  // Lesson 3: Drinks & Coffee
  {
    topic: "Coffee & Drinks", topicKu: "قاوە و خواردنەوە",
    words: [
      { english: "On the rocks", kurdish: "بە سەهۆڵەوە" },
      { english: "A round", kurdish: "یەک دەورە (خواردنەوە بۆ هەمووان)" },
      { english: "Watered down", kurdish: "ئاوەڵە (بێتام بووە بەهۆی ئاوەوە)" },
      { english: "Boozy", kurdish: "کحولی (مەستکەر)" },
      { english: "Chug", kurdish: "بە یەک جار خواردنەوە (نۆش)" },
    ],
    voices: [
      { prompt: "داوای خواردنەوەیەک بە سەهۆڵ بکە", target: "I'll take an iced coffee, on the rocks.", targetKurdish: "قاوەیەکی سارد دەخۆمەوە، بە سەهۆڵەوە." },
      { prompt: "بڵێ من دەورەیەک دەکڕم", target: "The next round is on me.", targetKurdish: "دەورەی داهاتوو لەسەر منە." },
    ],
    sentences: [
      { english: ["I'll", "take", "an", "iced", "coffee", "on", "the", "rocks"], kurdish: "قاوەیەکی سارد دەخۆمەوە، بە سەهۆڵەوە" },
      { english: ["The", "next", "round", "is", "on", "me"], kurdish: "دەورەی داهاتوو لەسەر منە" },
    ],
    fillBlanks: [
      { parts: ["This coffee is completely", "down."], hint: "ئاو تێکراو / لاواز", answer: "watered", wrongs: ["fired", "jumping", "apple"] },
      { parts: ["Just", "the whole thing right now!"], hint: "بە یەک جار خواردنەوە", answer: "chug", wrongs: ["hug", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "لە قاوەخانەیەکیت و خواردنەوەیەک داوا دەکەیت",
        theyAsk: "How would you like your drink?",
        correct: "Just on the rocks, please.",
        wrong1: "I will chug the round.",
        wrong2: "Make it watered down table.",
        wrong3: "Boozy rock for my dog.",
        explanation: "داواکردنی خواردنەوە بە سەهۆڵ: 'Just on the rocks, please.'",
      },
    ],
  },

  // Lesson 4: Working Out
  {
    topic: "The Gym", topicKu: "وەرزش و هۆڵی لەشجوانی",
    words: [
      { english: "Pumped", kurdish: "پەرۆش / ماسولکە پڕبوو" },
      { english: "Shredded", kurdish: "لەشڕێک و ماسولکەدار" },
      { english: "Sore", kurdish: "ئازار (پاش وەرزش)" },
      { english: "Spot me", kurdish: "چاودێریم بکە (لە کاتی بەرزکردنەوەدا)" },
      { english: "Cardio", kurdish: "وەرزشی دڵ (ڕاکردن)" },
    ],
    voices: [
      { prompt: "بڵێ پێویستم بە کەسێکە چاودێریم بکات", target: "Hey, can you spot me on this set?", targetKurdish: "دەتوانیت چاودێریم بکەیت لەم سێتەدا؟" },
      { prompt: "بڵێ قاچەکانم ئازاریان هەیە", target: "My legs are so sore today.", targetKurdish: "ئەمڕۆ قاچەکانم زۆر ئازاریان هەیە." },
    ],
    sentences: [
      { english: ["Hey", "can", "you", "spot", "me", "on", "this", "set"], kurdish: "دەتوانیت چاودێریم بکەیت لەم سێتەدا؟" },
      { english: ["My", "legs", "are", "so", "sore", "today"], kurdish: "ئەمڕۆ قاچەکانم زۆر ئازاریان هەیە" },
    ],
    fillBlanks: [
      { parts: ["He works out every day, he is completely", "."], hint: "لەشڕێک (دڕاو)", answer: "shredded", wrongs: ["papered", "jumping", "apple"] },
      { parts: ["I hate doing", "on the treadmill."], hint: "وەرزشی دڵ / ڕاکردن", answer: "cardio", wrongs: ["radio", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "لە هۆڵی وەرزشیت و قورسایی بەرز دەکەیتەوە",
        theyAsk: "You need help with that weight?",
        correct: "Yeah, can you spot me?",
        wrong1: "The weight is sore shredded.",
        wrong2: "I am pumped the cardio.",
        wrong3: "Spot the dog outside.",
        explanation: "داوای یارمەتی لە کاتی قورسایی بەرزکردنەوە: 'Yeah, can you spot me?'",
      },
    ],
  },

  // Lesson 5: Chilling at Home
  {
    topic: "Relaxing", topicKu: "پشوودان لە ماڵەوە",
    words: [
      { english: "Binge-watch", kurdish: "سەیرکردنی زنجیرەیەک بەسەریەکەوە" },
      { english: "Couch potato", kurdish: "کەسێکی تەمبەڵ (هەر دادەنیشێت)" },
      { english: "Unwind", kurdish: "حەساندنەوە (لابردنی سترێس)" },
      { english: "Low-key", kurdish: "ئارام / بە بێدەنگی" },
      { english: "Doze off", kurdish: "خەو لێکەوتن (بێ مەبەست)" },
    ],
    voices: [
      { prompt: "بڵێ دەمەوێت لە ماڵەوە بمێنمەوە", target: "I'm just gonna keep it low-key tonight.", targetKurdish: "ئەمشەو تەنها بە ئارامی لە ماڵەوە دەمێنمەوە." },
      { prompt: "بڵێ زنجیرەیەکم بەسەریەکەوە سەیرکرد", target: "I binge-watched the whole show.", targetKurdish: "تەواوی زنجیرەکەم بەسەریەکەوە سەیرکرد." },
    ],
    sentences: [
      { english: ["I'm", "just", "gonna", "keep", "it", "low-key", "tonight"], kurdish: "ئەمشەو تەنها بە ئارامی لە ماڵەوە دەمێنمەوە" },
      { english: ["I", "binge-watched", "the", "whole", "show"], kurdish: "تەواوی زنجیرەکەم بەسەریەکەوە سەیرکرد" },
    ],
    fillBlanks: [
      { parts: ["I was so tired, I started to", "off on the couch."], hint: "خەولێکەوتن (کورت)", answer: "doze", wrongs: ["froze", "jumping", "apple"] },
      { parts: ["After work, I just need to", "and relax."], hint: "حەساندنەوە / کردنەوە", answer: "unwind", wrongs: ["wind", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت دەپرسێت ئەمشەو چی دەکەیت",
        theyAsk: "Are you going to the party tonight?",
        correct: "Nah, I'm just gonna keep it low-key at home.",
        wrong1: "The potato is jumping couch.",
        wrong2: "I unwind the party door.",
        wrong3: "Binge-watch the music club.",
        explanation: "مانەوە لە ماڵەوە بە ئارامی: 'Nah, I'm just gonna keep it low-key at home.'",
      },
    ],
  },

  // Lesson 6: Technology & Phones
  {
    topic: "Tech & Phones", topicKu: "تەکنەلۆژیا و مۆبایل",
    words: [
      { english: "Dying", kurdish: "شەحنەکەیم خەریکە تەواو دەبێت" },
      { english: "Glitching", kurdish: "هەڵەی تێدایە (تێکچووە)" },
      { english: "Ghosting", kurdish: "وەڵامنەدانەوەی نامە" },
      { english: "Leave on read", kurdish: "خوێندنەوەی نامە بێ وەڵامدانەوە" },
      { english: "Scroll", kurdish: "هێنانەخوارەوەی شاشە (سەیرکردن)" },
    ],
    voices: [
      { prompt: "بڵێ مۆبایلەکەم شەحنی نامێنێت", target: "My phone is dying, I need a charger.", targetKurdish: "مۆبایلەکەم شەحنی خەریکە تەواو دەبێت، پێویستم بە بارگاویکەرێکە." },
      { prompt: "بڵێ نامەکەی خوێندەوە و وەڵامی نەدایەوە", target: "He completely left me on read.", targetKurdish: "بە تەواوی نامەکەی خوێندەوە و وەڵامی نەدامەوە." },
    ],
    sentences: [
      { english: ["My", "phone", "is", "dying", "I", "need", "a", "charger"], kurdish: "مۆبایلەکەم شەحنی خەریکە تەواو دەبێت، پێویستم بە بارگاویکەرێکە" },
      { english: ["He", "completely", "left", "me", "on", "read"], kurdish: "بە تەواوی نامەکەی خوێندەوە و وەڵامی نەدامەوە" },
    ],
    fillBlanks: [
      { parts: ["My app keeps", "out and closing."], hint: "تێکچوون / هەڵە", answer: "glitching", wrongs: ["stitching", "jumping", "apple"] },
      { parts: ["Why is she", "me? She won't reply."], hint: "وەڵامنەدانەوە وەک خێوەت", answer: "ghosting", wrongs: ["hosting", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "مۆبایلەکەت شەحنی خەریکە تەواو دەبێت",
        theyAsk: "Can you send me that picture?",
        correct: "In a minute, my phone is dying right now.",
        wrong1: "The phone is ghosting the tree.",
        wrong2: "I scroll the charger up.",
        wrong3: "Read the dying battery.",
        explanation: "ئاگادارکردنەوەی کەسێک کە مۆبایلەکەت شەحنی کەمە: 'In a minute, my phone is dying right now.'",
      },
    ],
  },

  // Lesson 7: Weather & Outside
  {
    topic: "Weather", topicKu: "کەشوهەوا",
    words: [
      { english: "Freezing", kurdish: "زۆر سارد (بەستەڵەک)" },
      { english: "Boiling", kurdish: "زۆر گەرم (کوڵاو)" },
      { english: "Pouring", kurdish: "بارانی زۆر (لێزمە)" },
      { english: "Breezy", kurdish: "باوبۆرانێکی کەم (فێنک)" },
      { english: "Gloomy", kurdish: "تاریک و هەوراوی (دڵتەنگ)" },
    ],
    voices: [
      { prompt: "بڵێ دەرەوە زۆر ساردە", target: "It is absolutely freezing outside.", targetKurdish: "لە دەرەوە بەتەواوی بەستەڵەکە." },
      { prompt: "بڵێ بارانێکی زۆر دەبارێت", target: "It's pouring down rain right now.", targetKurdish: "ئێستا لێزمەی بارانە." },
    ],
    sentences: [
      { english: ["It", "is", "absolutely", "freezing", "outside"], kurdish: "لە دەرەوە بەتەواوی بەستەڵەکە" },
      { english: ["It's", "pouring", "down", "rain", "right", "now"], kurdish: "ئێستا لێزمەی بارانە" },
    ],
    fillBlanks: [
      { parts: ["Turn on the AC, it's", "in here!"], hint: "زۆر گەرم (کوڵاو)", answer: "boiling", wrongs: ["oiling", "jumping", "apple"] },
      { parts: ["The sky is so gray and", "today."], hint: "تاریک و هەوراوی", answer: "gloomy", wrongs: ["roomy", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "دەتەوێت بچیتە دەرەوە بەڵام بارانێکی زۆرە",
        theyAsk: "Are we still going for a walk?",
        correct: "Look outside, it's completely pouring!",
        wrong1: "The freezing is a hot day.",
        wrong2: "I am boiling the rain.",
        wrong3: "The walk is a breezy door.",
        explanation: "وەسفکردنی بارانی زۆر: 'Look outside, it's completely pouring!'",
      },
    ],
  },

  // Lesson 8: Sleep & Tiredness
  {
    topic: "Sleeping", topicKu: "خەو و ماندوێتی",
    words: [
      { english: "Out cold", kurdish: "خەوی قووڵ (وەک بێهۆش)" },
      { english: "Toss and turn", kurdish: "سوڕانەوە لەناو جێگە (خەونەچوون)" },
      { english: "Crash", kurdish: "خەوتنی خێرا لە ماندوێتی" },
      { english: "Nap", kurdish: "خەوێکی کورت (خەوی ڕۆژ)" },
      { english: "Sleep on it", kurdish: "بیرکردنەوە تا بەیانی (دواخستنی بڕیار)" },
    ],
    voices: [
      { prompt: "بڵێ دەمەوێت بخەوم", target: "I'm just gonna crash on the couch.", targetKurdish: "تەنها لەسەر قەنەفەکە دەخەوم (لە ماندوێتیا)." },
      { prompt: "بڵێ با تا بەیانی بیری لێبکەمەوە", target: "Let me sleep on it and tell you tomorrow.", targetKurdish: "با تا بەیانی بیری لێبکەمەوە و سبەی پێت دەڵێم." },
    ],
    sentences: [
      { english: ["I'm", "just", "gonna", "crash", "on", "the", "couch"], kurdish: "تەنها لەسەر قەنەفەکە دەخەوم" },
      { english: ["Let", "me", "sleep", "on", "it", "and", "tell", "you", "tomorrow"], kurdish: "با تا بەیانی بیری لێبکەمەوە و سبەی پێت دەڵێم" },
    ],
    fillBlanks: [
      { parts: ["He was so tired, he was out", "as soon as he lay down."], hint: "سارد (واتا خەوی قووڵ)", answer: "cold", wrongs: ["hot", "jumping", "apple"] },
      { parts: ["I couldn't sleep, I was just", "and turning all night."], hint: "فڕێدان (سوڕانەوە)", answer: "tossing", wrongs: ["bossing", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "بڕیارێکی گرنگ دەدەیت",
        theyAsk: "Do you want to accept the job offer?",
        correct: "I'm not sure yet. Let me sleep on it.",
        wrong1: "I crash the couch cold.",
        wrong2: "The job is tossing and turning.",
        wrong3: "I take a nap on the offer.",
        explanation: "دواخستنی بڕیار بۆ ڕۆژی دواتر: 'I'm not sure yet. Let me sleep on it.'",
      },
    ],
  },

  // Lesson 9: Moods & Feelings
  {
    topic: "Moods", topicKu: "میزاج و هەستەکان",
    words: [
      { english: "Bummed out", kurdish: "دڵتەنگ و بێتاقەت" },
      { english: "Fired up", kurdish: "زۆر پەرۆش و بەجۆش" },
      { english: "Hangry", kurdish: "توڕە بەهۆی برسێتییەوە" },
      { english: "On edge", kurdish: "شڵەژاو و سترێساوی" },
      { english: "Vibing", kurdish: "لە کەشێکی ئارام و خۆشدا" },
    ],
    voices: [
      { prompt: "بڵێ زۆر پەرۆشم بۆ ئەمە", target: "I am absolutely fired up for this.", targetKurdish: "بەتەواوی بۆ ئەمە بەجۆش و پەرۆشم." },
      { prompt: "بڵێ کەمێک بێتاقەتم", target: "I'm honestly a little bummed out.", targetKurdish: "بەڕاستی کەمێک بێتاقەتم." },
    ],
    sentences: [
      { english: ["I", "am", "absolutely", "fired", "up", "for", "this"], kurdish: "بەتەواوی بۆ ئەمە بەجۆش و پەرۆشم" },
      { english: ["I'm", "honestly", "a", "little", "bummed", "out"], kurdish: "بەڕاستی کەمێک بێتاقەتم" },
    ],
    fillBlanks: [
      { parts: ["Feed him, he gets really", "when he doesn't eat."], hint: "برسی + توڕە", answer: "hangry", wrongs: ["angry", "jumping", "apple"] },
      { parts: ["She's been on", "all day because of the test."], hint: "لێوار (شڵەژاو)", answer: "edge", wrongs: ["ledge", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "یارییەکی گرنگ دەستپێدەکات",
        theyAsk: "Are you ready for the championship game?",
        correct: "Oh yeah, I am completely fired up!",
        wrong1: "The game is bummed out.",
        wrong2: "I am hangry for the ball.",
        wrong3: "I edge the television.",
        explanation: "دەربڕینی پەرۆشی زۆر: 'Oh yeah, I am completely fired up!'",
      },
    ],
  },
];

export default unit02;
