import { UnitBank } from "../types";

// ── Unit 3: Relationships, Drama & Dating — 10 unique lessons ──────────────────────────────
const unit03: UnitBank = [

  // Lesson 0: Making Friends
  {
    topic: "Friendship", topicKu: "هاوڕێیەتی",
    words: [
      { english: "Bestie", kurdish: "باشترین هاوڕێ" },
      { english: "Hit it off", kurdish: "ڕێککەوتن (زۆر زوو بوون بە هاوڕێ)" },
      { english: "Click", kurdish: "لە یەک تێگەیشتن و گونجان" },
      { english: "Squad", kurdish: "گروپی هاوڕێیان (دەستە)" },
      { english: "Ride or die", kurdish: "هاوڕێی گیانی بە گیانی (تا مردن)" },
    ],
    voices: [
      { prompt: "بڵێ زۆر زوو بووین بە هاوڕێ", target: "We just instantly hit it off.", targetKurdish: "ئێمە زۆر بە خێرایی بووین بە هاوڕێ (گونجاین)." },
      { prompt: "بڵێ ئەو باشترین هاوڕێمە", target: "She is my absolute bestie.", targetKurdish: "ئەو بەتەواوی باشترین هاوڕێمە." },
    ],
    sentences: [
      { english: ["We", "just", "instantly", "hit", "it", "off"], kurdish: "ئێمە زۆر بە خێرایی بووین بە هاوڕێ" },
      { english: ["She", "is", "my", "absolute", "bestie"], kurdish: "ئەو بەتەواوی باشترین هاوڕێمە" },
    ],
    fillBlanks: [
      { parts: ["We met at a party and just", "immediately."], hint: "کرتە (گونجان)", answer: "clicked", wrongs: ["clucked", "jumping", "apple"] },
      { parts: ["He is my", "or die, I trust him with anything."], hint: "لێخوڕین", answer: "ride", wrongs: ["walk", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "باسی کەسێکی نوێ دەکەیت کە ناسیووتە",
        theyAsk: "How did your meeting with the new guy go?",
        correct: "Great! We really hit it off.",
        wrong1: "The hit is a baseball.",
        wrong2: "We clicked the mouse.",
        wrong3: "I ride the new guy.",
        explanation: "وەسفکردنی دروستبوونی پەیوەندییەکی باش: 'Great! We really hit it off.'",
      },
    ],
  },

  // Lesson 1: Dating & Crushes
  {
    topic: "Crushes", topicKu: "خۆشەویستی و سەرنجڕاکێشان",
    words: [
      { english: "Have a crush", kurdish: "کەسێکت بەدڵە (بە دزییەوە)" },
      { english: "Ask out", kurdish: "داوای چوونە دەرەوە (ژوان)" },
      { english: "Out of my league", kurdish: "لە ئاستی مندا نییە (زۆر لە من باشترە)" },
      { english: "Shoot your shot", kurdish: "هەوڵی خۆت بدە (دەرفەت بقۆزەوە)" },
      { english: "Play hard to get", kurdish: "خۆگرانکردن (لە خۆشەویستیدا)" },
    ],
    voices: [
      { prompt: "بڵێ ئەو لە ئاستی مندا نییە", target: "She's totally out of my league.", targetKurdish: "ئەو بەتەواوی لە ئاستی مندا نییە." },
      { prompt: "بڵێ تەنها هەوڵی خۆت بدە", target: "You should just shoot your shot.", targetKurdish: "پێویستە تەنها هەوڵی خۆت بدەیت." },
    ],
    sentences: [
      { english: ["She's", "totally", "out", "of", "my", "league"], kurdish: "ئەو بەتەواوی لە ئاستی مندا نییە" },
      { english: ["You", "should", "just", "shoot", "your", "shot"], kurdish: "پێویستە تەنها هەوڵی خۆت بدەیت" },
    ],
    fillBlanks: [
      { parts: ["I've had a huge", "on him for years."], hint: "تێکشکاندن (خۆشەویستی)", answer: "crush", wrongs: ["smash", "jumping", "apple"] },
      { parts: ["I finally asked her", "on a date."], hint: "دەرەوە", answer: "out", wrongs: ["in", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت دەترسێت قسە لەگەڵ کچێک بکات",
        theyAsk: "I don't know if I should talk to her, she's amazing.",
        correct: "Just shoot your shot! What do you have to lose?",
        wrong1: "Shoot a gun at her.",
        wrong2: "The league is playing football.",
        wrong3: "I have a crush on the chair.",
        explanation: "هاندان بۆ قسەکردن: 'Just shoot your shot! What do you have to lose?'",
      },
    ],
  },

  // Lesson 2: Falling in Love
  {
    topic: "Falling in Love", topicKu: "کەوتنە ناو خۆشەویستی",
    words: [
      { english: "Catch feelings", kurdish: "دروستبوونی هەست بۆ کەسێک" },
      { english: "Head over heels", kurdish: "تەواو ئاشقبوون (سەرەوژێر)" },
      { english: "The one", kurdish: "ئەو کەسەی کە بۆت گونجاوە" },
      { english: "Wifed up / Hubbied up", kurdish: "چوونە ناو پەیوەندییەکی جدی (هاوسەرگیری)" },
      { english: "Butterflies", kurdish: "هەستی پەپولە لە سکدا (شڵەژانی خۆشەویستی)" },
    ],
    voices: [
      { prompt: "بڵێ خەریکە هەستم بۆی دروست دەبێت", target: "I think I'm starting to catch feelings.", targetKurdish: "پێموایە خەریکە هەستم بۆی دروست دەبێت." },
      { prompt: "بڵێ بەتەواوی ئاشقی بووم", target: "I am head over heels for him.", targetKurdish: "بەتەواوی ئاشقی ئەو بووم." },
    ],
    sentences: [
      { english: ["I", "think", "I'm", "starting", "to", "catch", "feelings"], kurdish: "پێموایە خەریکە هەستم بۆی دروست دەبێت" },
      { english: ["I", "am", "head", "over", "heels", "for", "him"], kurdish: "بەتەواوی ئاشقی ئەو بووم" },
    ],
    fillBlanks: [
      { parts: ["Whenever I see her, I get", "in my stomach."], hint: "پەپولە", answer: "butterflies", wrongs: ["birds", "jumping", "apple"] },
      { parts: ["I really think she might be the", "."], hint: "یەک (تاکە کەس)", answer: "one", wrongs: ["two", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "باسی کەسێک دەکەیت کە تازە ناسیووتە",
        theyAsk: "So, how are things going with Sarah?",
        correct: "Honestly? I think I'm starting to catch feelings.",
        wrong1: "I catch the baseball feeling.",
        wrong2: "She is head over the table.",
        wrong3: "I have the one butterflies.",
        explanation: "داننان بە دروستبوونی هەست: 'Honestly? I think I'm starting to catch feelings.'",
      },
    ],
  },

  // Lesson 3: Relationship Drama
  {
    topic: "Drama", topicKu: "کێشە و دراما",
    words: [
      { english: "Red flag", kurdish: "نیشانەی مەترسی (لە پەیوەندیدا)" },
      { english: "Toxic", kurdish: "ژەهراوی (زیانبەخش)" },
      { english: "Leading someone on", kurdish: "یاریکردن بە هەستی کەسێک (هیوای درۆ)" },
      { english: "Gaslight", kurdish: "شێواندنی ڕاستییەکان بۆ گومانی کەسەکە لە خۆی" },
      { english: "Baggage", kurdish: "کێشەی دەروونی پێشوو (بارگە)" },
    ],
    voices: [
      { prompt: "بڵێ ئەوە نیشانەیەکی مەترسی گەورەیە", target: "That is a massive red flag.", targetKurdish: "ئەوە نیشانەیەکی مەترسی زۆر گەورەیە." },
      { prompt: "بڵێ پەیوەندییەکەیان زۆر زیانبەخشە", target: "Their relationship is super toxic.", targetKurdish: "پەیوەندییەکەیان زۆر زیانبەخشە (تۆکسیکە)." },
    ],
    sentences: [
      { english: ["That", "is", "a", "massive", "red", "flag"], kurdish: "ئەوە نیشانەیەکی مەترسی زۆر گەورەیە" },
      { english: ["Their", "relationship", "is", "super", "toxic"], kurdish: "پەیوەندییەکەیان زۆر زیانبەخشە" },
    ],
    fillBlanks: [
      { parts: ["He is totally", "you on, he doesn't like you."], hint: "پێشەنگی (ڕێنمایی درۆ)", answer: "leading", wrongs: ["reading", "jumping", "apple"] },
      { parts: ["Stop trying to", "me, I know what I saw!"], hint: "ڕووناکی غاز (تێکدانی مێشک)", answer: "gaslight", wrongs: ["flashlight", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت باسی ڕەفتاری خراپی خۆشەویستەکەی دەکات",
        theyAsk: "He completely lied to me and then said I was crazy.",
        correct: "Girl, that's a massive red flag. Leave him.",
        wrong1: "The flag is red and white.",
        wrong2: "Gaslight the room please.",
        wrong3: "I carry the baggage to the plane.",
        explanation: "ئاگادارکردنەوە لە نیشانەی مەترسی: 'Girl, that's a massive red flag. Leave him.'",
      },
    ],
  },

  // Lesson 4: Arguments & Fights
  {
    topic: "Fighting", topicKu: "شەڕ و دەمەقاڵێ",
    words: [
      { english: "Blow up", kurdish: "تەقینەوە (زۆر توڕەبوون لەپڕ)" },
      { english: "Silent treatment", kurdish: "قسەنەکردن لەگەڵ کەسێک وەک سزادان" },
      { english: "Hold a grudge", kurdish: "لە دڵدا گرتن (کینە)" },
      { english: "Overreact", kurdish: "کاردانەوەی زیاد لە پێویست" },
      { english: "Clear the air", kurdish: "پاککردنەوەی کەشەکە (ئاشتبوونەوە و قسەکردن)" },
    ],
    voices: [
      { prompt: "بڵێ من کاردانەوەی زیادم هەبوو", target: "I think I definitely overreacted.", targetKurdish: "پێموایە من دڵنیایەن کاردانەوەی زیاد لە پێویستم هەبوو." },
      { prompt: "بڵێ با قسە بکەین بۆ ئاشتبوونەوە", target: "We really need to clear the air.", targetKurdish: "بەڕاستی پێویستە قسە بکەین و کەشەکە پاک بکەینەوە." },
    ],
    sentences: [
      { english: ["I", "think", "I", "definitely", "overreacted"], kurdish: "پێموایە من دڵنیایەن کاردانەوەی زیاد لە پێویستم هەبوو" },
      { english: ["We", "really", "need", "to", "clear", "the", "air"], kurdish: "بەڕاستی پێویستە قسە بکەین و کەشەکە پاک بکەینەوە" },
    ],
    fillBlanks: [
      { parts: ["He gave me the", "treatment all day."], hint: "بێدەنگ", answer: "silent", wrongs: ["loud", "jumping", "apple"] },
      { parts: ["Don't", "a grudge, just forgive him."], hint: "گرتن", answer: "hold", wrongs: ["drop", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "دوای دەمەقاڵێیەک لەگەڵ هاوڕێیەک",
        theyAsk: "Are you still mad at me about yesterday?",
        correct: "A little, but we should talk and clear the air.",
        wrong1: "The air is very dirty.",
        wrong2: "I blow up the balloon.",
        wrong3: "I hold a grudge on the table.",
        explanation: "هەوڵدان بۆ چارەسەری کێشە: 'A little, but we should talk and clear the air.'",
      },
    ],
  },

  // Lesson 5: Breakups
  {
    topic: "Breakups", topicKu: "جیابوونەوە",
    words: [
      { english: "Dump someone", kurdish: "وازهێنان لە کەسێک (فڕێدان)" },
      { english: "It's over", kurdish: "کۆتایی هات" },
      { english: "Heartbroken", kurdish: "دڵشکاو" },
      { english: "Move on", kurdish: "تێپەڕاندن (لەبیرکردن)" },
      { english: "Get back together", kurdish: "ئاشتبوونەوە (گەڕانەوە بۆ یەک)" },
    ],
    voices: [
      { prompt: "بڵێ ئەو وازی لێهێنام", target: "She completely dumped me.", targetKurdish: "ئەو بەتەواوی وازی لێهێنام." },
      { prompt: "بڵێ کاتی ئەوەیە لەبیری بکەم", target: "It's time for me to move on.", targetKurdish: "کاتی ئەوەیە کە من تێیبپەڕێنم." },
    ],
    sentences: [
      { english: ["She", "completely", "dumped", "me"], kurdish: "ئەو بەتەواوی وازی لێهێنام" },
      { english: ["It's", "time", "for", "me", "to", "move", "on"], kurdish: "کاتی ئەوەیە کە من تێیبپەڕێنم" },
    ],
    fillBlanks: [
      { parts: ["I think it's really", "this time."], hint: "کۆتایی / بەسەرچوو", answer: "over", wrongs: ["under", "jumping", "apple"] },
      { parts: ["Are they trying to get", "together?"], hint: "دواوە", answer: "back", wrongs: ["front", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت تازە جیابووەتەوە",
        theyAsk: "I just can't stop thinking about him.",
        correct: "I know it's hard, but you need to try and move on.",
        wrong1: "I move on the chair.",
        wrong2: "The heartbroken is fixing.",
        wrong3: "Dump the garbage out.",
        explanation: "ئامۆژگاری بۆ تێپەڕاندن: 'I know it's hard, but you need to try and move on.'",
      },
    ],
  },

  // Lesson 6: Gossip & Secrets
  {
    topic: "Gossip", topicKu: "قسەوقسەڵۆک و نهێنی",
    words: [
      { english: "Spill the tea", kurdish: "باسکردنی قسەوقسەڵۆکەکە (ڕشتنی چاکە)" },
      { english: "Behind someone's back", kurdish: "لە پشتەوەی کەسێک (بە نهێنی)" },
      { english: "Keep it low", kurdish: "بە نهێنی بیهێڵەوە" },
      { english: "Word travels fast", kurdish: "قسە زوو بڵاودەبێتەوە" },
      { english: "Spreading rumors", kurdish: "بڵاوکردنەوەی دەنگۆ" },
    ],
    voices: [
      { prompt: "بڵێ دەی قسەکانم بۆ بکە", target: "Come on, you gotta spill the tea.", targetKurdish: "دەی، دەبێت قسەکانم بۆ بکەیت (چاکە بڕێژیت)." },
      { prompt: "بڵێ قسە زوو بڵاودەبێتەوە", target: "Around here, word travels fast.", targetKurdish: "لێرەدا، قسە زوو بڵاودەبێتەوە." },
    ],
    sentences: [
      { english: ["Come", "on", "you", "gotta", "spill", "the", "tea"], kurdish: "دەی، دەبێت قسەکانم بۆ بکەیت" },
      { english: ["Around", "here", "word", "travels", "fast"], kurdish: "لێرەدا، قسە زوو بڵاودەبێتەوە" },
    ],
    fillBlanks: [
      { parts: ["She's always talking", "my back."], hint: "پشتەوە", answer: "behind", wrongs: ["front", "jumping", "apple"] },
      { parts: ["Who is spreading these", "about me?"], hint: "دەنگۆ", answer: "rumors", wrongs: ["tumors", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت دەڵێت هەواڵێکی هەیە",
        theyAsk: "I heard something crazy about John and Sarah.",
        correct: "No way! Sit down and spill the tea.",
        wrong1: "I drink the tea hot.",
        wrong2: "The word travels on a plane.",
        wrong3: "I keep it low on the floor.",
        explanation: "پەرۆشی بۆ بیستنی هەواڵەکە: 'No way! Sit down and spill the tea.'",
      },
    ],
  },

  // Lesson 7: Making Amends
  {
    topic: "Apologies", topicKu: "لێبوردن خواستن",
    words: [
      { english: "My bad", kurdish: "هەڵەی من بوو" },
      { english: "Mess up", kurdish: "هەڵەکردن (تێکدان)" },
      { english: "Make it up to you", kurdish: "قەرەبووی دەکەمەوە بۆت" },
      { english: "Bury the hatchet", kurdish: "کۆتاییهێنان بە دوژمنایەتی" },
      { english: "No hard feelings", kurdish: "هیچ کینەیەک نییە (دڵگرانی نییە)" },
    ],
    voices: [
      { prompt: "بڵێ زۆر هەڵەم کرد", target: "I completely messed up, my bad.", targetKurdish: "بەتەواوی هەڵەم کرد، هەڵەی من بوو." },
      { prompt: "بڵێ قەرەبووی دەکەمەوە", target: "I promise I will make it up to you.", targetKurdish: "بەڵێن دەدەم قەرەبووی دەکەمەوە بۆت." },
    ],
    sentences: [
      { english: ["I", "completely", "messed", "up", "my", "bad"], kurdish: "بەتەواوی هەڵەم کرد، هەڵەی من بوو" },
      { english: ["I", "promise", "I", "will", "make", "it", "up", "to", "you"], kurdish: "بەڵێن دەدەم قەرەبووی دەکەمەوە بۆت" },
    ],
    fillBlanks: [
      { parts: ["It's fine, no", "feelings."], hint: "قورس / سەخت", answer: "hard", wrongs: ["soft", "jumping", "apple"] },
      { parts: ["Let's just", "the hatchet and be friends."], hint: "شاردنەوە (ناشتن)", answer: "bury", wrongs: ["dig", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "لەبیرت چووە بچیت بۆ ئاهەنگی هاوڕێیەک",
        theyAsk: "I was really sad you didn't come to my party.",
        correct: "I completely messed up. I'll make it up to you, I swear.",
        wrong1: "The party was a hatchet.",
        wrong2: "My bad the dog.",
        wrong3: "I mess up the kitchen.",
        explanation: "داننان بە هەڵە و داوای لێبوردن: 'I completely messed up. I'll make it up to you, I swear.'",
      },
    ],
  },

  // Lesson 8: Trust & Loyalty
  {
    topic: "Trust", topicKu: "متمانە و وەفاداری",
    words: [
      { english: "Have your back", kurdish: "پشتت دەگرم (پشتگیریت دەکەم)" },
      { english: "Keep a secret", kurdish: "پاراستنی نهێنی" },
      { english: "Stab in the back", kurdish: "خیانەتکردن (لە پشتەوە چەقۆ لێدان)" },
      { english: "True colors", kurdish: "ڕووی ڕاستەقینە" },
      { english: "Count on someone", kurdish: "پشت بەستن بە کەسێک" },
    ],
    voices: [
      { prompt: "بڵێ دەتوانیت پشتم پێ ببەستیت", target: "You know you can always count on me.", targetKurdish: "دەزانیت کە هەمیشە دەتوانیت پشتم پێ ببەستیت." },
      { prompt: "بڵێ ڕووی ڕاستەقینەی خۆی پێشاندا", target: "He finally showed his true colors.", targetKurdish: "لە کۆتاییدا ڕووی ڕاستەقینەی خۆی پێشاندا." },
    ],
    sentences: [
      { english: ["You", "know", "you", "can", "always", "count", "on", "me"], kurdish: "دەزانیت کە هەمیشە دەتوانیت پشتم پێ ببەستیت" },
      { english: ["He", "finally", "showed", "his", "true", "colors"], kurdish: "لە کۆتاییدا ڕووی ڕاستەقینەی خۆی پێشاندا" },
    ],
    fillBlanks: [
      { parts: ["Don't worry, I always have your", "."], hint: "پشت", answer: "back", wrongs: ["front", "jumping", "apple"] },
      { parts: ["She totally", "me in the back."], hint: "چەقۆ لێدان", answer: "stabbed", wrongs: ["grabbed", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت کێشەی هەیە و پێویستی بە یارمەتییە",
        theyAsk: "I'm in a lot of trouble right now.",
        correct: "Don't worry, I've got your back no matter what.",
        wrong1: "I will stab you in the back.",
        wrong2: "The true colors are red.",
        wrong3: "I count the numbers.",
        explanation: "دڵنیاییدان لە پشتگیری: 'Don't worry, I've got your back no matter what.'",
      },
    ],
  },

  // Lesson 9: Reconnecting
  {
    topic: "Reconnecting", topicKu: "پەیوەندیکردنەوە",
    words: [
      { english: "Catch up", kurdish: "پێگەیشتنەوە (باسکردنی هەواڵەکان)" },
      { english: "Long time no see", kurdish: "ماوەیەکی زۆرە نەمدیویت" },
      { english: "Touch base", kurdish: "پەیوەندیکردن بۆ هەواڵپرسی" },
      { english: "Lose touch", kurdish: "لەدەستدانی پەیوەندی" },
      { english: "Run into someone", kurdish: "بە ڕێکەوت بینینی کەسێک" },
    ],
    voices: [
      { prompt: "بڵێ ماوەیەکی زۆرە نەمدیویت", target: "Wow, long time no see!", targetKurdish: "واو، ماوەیەکی زۆرە نەمدیویت!" },
      { prompt: "بڵێ با یەکتر ببینین و قسە بکەین", target: "We definitely need to catch up soon.", targetKurdish: "دڵنیایەن پێویستە بەمزووانە یەکتر ببینین و قسە بکەین." },
    ],
    sentences: [
      { english: ["Wow", "long", "time", "no", "see"], kurdish: "واو، ماوەیەکی زۆرە نەمدیویت!" },
      { english: ["We", "definitely", "need", "to", "catch", "up", "soon"], kurdish: "دڵنیایەن پێویستە بەمزووانە یەکتر ببینین و قسە بکەین" },
    ],
    fillBlanks: [
      { parts: ["We completely lost", "after college."], hint: "بەریەککەوتن (پەیوەندی)", answer: "touch", wrongs: ["smell", "jumping", "apple"] },
      { parts: ["I just", "into an old friend at the store."], hint: "ڕاکردن (بە ڕێکەوت)", answer: "ran", wrongs: ["walked", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکی کۆن بە ڕێکەوت دەبینیت",
        theyAsk: "Oh my god, I haven't seen you in years!",
        correct: "I know, long time no see! We have to catch up.",
        wrong1: "I lose touch the wall.",
        wrong2: "Run into the car.",
        wrong3: "Touch the base in baseball.",
        explanation: "وەڵامێکی ئاسایی بۆ بینینی هاوڕێیەکی کۆن: 'I know, long time no see! We have to catch up.'",
      },
    ],
  },
];

export default unit03;
