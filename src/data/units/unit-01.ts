import { UnitBank } from "../types";

// ── Unit 1: Money, Numbers & Deals — 10 unique lessons ──────────────────────────────
const unit01: UnitBank = [

  // Lesson 0: Basic Numbers & Counting
  {
    topic: "Numbers & Counting", topicKu: "ژمارە و ژماردن",
    words: [
      { english: "A couple", kurdish: "چەند دانەیەک (دوو سێ دانە)" },
      { english: "A dozen", kurdish: "دەرزەنێک (دوانزە)" },
      { english: "Half", kurdish: "نیوە" },
      { english: "Zero", kurdish: "سفر" },
      { english: "A hundred", kurdish: "سەد" },
    ],
    voices: [
      { prompt: "بڵێ چەند دانەیەکم پێویستە", target: "I just need a couple of them.", targetKurdish: "تەنها چەند دانەیەکم پێویستە." },
      { prompt: "بڵێ نیوەی ئەوەیە", target: "It's about half of that.", targetKurdish: "نزیکەی نیوەی ئەوەیە." },
    ],
    sentences: [
      { english: ["I", "just", "need", "a", "couple"], kurdish: "تەنها چەند دانەیەکم پێویستە" },
      { english: ["It's", "about", "half", "of", "that"], kurdish: "نزیکەی نیوەی ئەوەیە" },
    ],
    fillBlanks: [
      { parts: ["Can I get a", "eggs?"], hint: "چەند دانەیەک (دوو سێ)", answer: "couple", wrongs: ["laptop", "running", "cloud"] },
      { parts: ["I'll take", "of it."], hint: "نیوە", answer: "half", wrongs: ["shoe", "jumping", "blue"] },
    ],
    conversations: [
      {
        situation: "لە دوکانێکیت و شت دەکڕیت",
        theyAsk: "How many of these do you want?",
        correct: "Just a couple, thanks.",
        wrong1: "I am wanting a television.",
        wrong2: "The number is running.",
        wrong3: "I am taking the zero.",
        explanation: "وەڵامێکی دروست بۆ ژمارەیەکی کەم: 'Just a couple, thanks.'",
      },
    ],
  },

  // Lesson 1: Money & Prices
  {
    topic: "Money Slang", topicKu: "پارە و نرخ",
    words: [
      { english: "Bucks", kurdish: "دۆلار (پارە)" },
      { english: "Broke", kurdish: "بێ پارە (موفلیس)" },
      { english: "Loaded", kurdish: "زەنگین (پارەدار)" },
      { english: "Cash", kurdish: "کاش (نەخت)" },
      { english: "Change", kurdish: "باقی (پارەی وردە)" },
    ],
    voices: [
      { prompt: "بڵێ بیست دۆلارە", target: "It costs twenty bucks.", targetKurdish: "بیست دۆلاری تێدەچێت." },
      { prompt: "بڵێ ئێستا بێ پارەم", target: "I'm totally broke right now.", targetKurdish: "لە ئێستادا بەتەواوی بێ پارەم (موفلیسم)." },
    ],
    sentences: [
      { english: ["It", "costs", "twenty", "bucks"], kurdish: "بیست دۆلاری تێدەچێت" },
      { english: ["I'm", "totally", "broke", "right", "now"], kurdish: "لە ئێستادا بەتەواوی بێ پارەم" },
    ],
    fillBlanks: [
      { parts: ["Can I borrow ten", "?"], hint: "دۆلار (وشەی سەر شەقام)", answer: "bucks", wrongs: ["dogs", "clouds", "shoes"] },
      { parts: ["I can't go, I'm", "."], hint: "بێ پارە (موفلیس)", answer: "broke", wrongs: ["fixed", "jumping", "blue"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت داوات لێ دەکات بچنە دەرەوە بۆ نانخواردن",
        theyAsk: "Wanna go grab some food? My treat.",
        correct: "Good, because I'm completely broke.",
        wrong1: "The food is a chair.",
        wrong2: "I am broke the window.",
        wrong3: "Bucks are jumping high.",
        explanation: "وەڵامێکی ئاسایی کاتێک کەسێک پارەت بۆ دەدات و تۆ بێ پارەیت: 'Good, because I'm completely broke.'",
      },
    ],
  },

  // Lesson 2: Buying & Shopping
  {
    topic: "Shopping Deals", topicKu: "بازاڕیکردن و مامەڵە",
    words: [
      { english: "A steal", kurdish: "زۆر هەرزانە (وەک ئەوەی دزیبێتت)" },
      { english: "Rip-off", kurdish: "نرخی زۆر گرانە (فێڵە)" },
      { english: "Pricey", kurdish: "گرانبەها" },
      { english: "On sale", kurdish: "لە داشکاندن" },
      { english: "Worth it", kurdish: "شایەنیەتی" },
    ],
    voices: [
      { prompt: "بڵێ نرخەکەی زۆر گرانە", target: "That's a total rip-off.", targetKurdish: "ئەوە بەتەواوی فێڵە (زۆر گرانە)." },
      { prompt: "بڵێ نرخێکی زۆر باشە", target: "Wow, that's an absolute steal.", targetKurdish: "واو، ئەوە زۆر هەرزانە." },
    ],
    sentences: [
      { english: ["That's", "a", "total", "rip-off"], kurdish: "ئەوە بەتەواوی فێڵە (زۆر گرانە)" },
      { english: ["Wow", "that's", "an", "absolute", "steal"], kurdish: "واو، ئەوە زۆر هەرزانە" },
    ],
    fillBlanks: [
      { parts: ["Fifty dollars for water? That's a", "!"], hint: "فێڵ / گرانی بێمانا", answer: "rip-off", wrongs: ["shoe-on", "dog-out", "jump-in"] },
      { parts: ["Only five bucks? That's a", "!"], hint: "نرخێکی زۆر هەرزان (هەلێکی باش)", answer: "steal", wrongs: ["run", "cloud", "pizza"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت پێڵاوێکی گرانبەهای کڕیوە",
        theyAsk: "I paid five hundred for these shoes. What do you think?",
        correct: "Dude, that's a total rip-off.",
        wrong1: "The steal is running away.",
        wrong2: "I like the shoe on the ceiling.",
        wrong3: "Five hundred is a good dog.",
        explanation: "کاردانەوەیەک بۆ شتێکی زۆر گران: 'Dude, that's a total rip-off.'",
      },
    ],
  },

  // Lesson 3: Paying the Bill
  {
    topic: "Paying Up", topicKu: "پاردان و حسێب",
    words: [
      { english: "Split it", kurdish: "بەشکردنی (پارەکە)" },
      { english: "It's on me", kurdish: "لەسەر منە (من پارەکە دەدەم)" },
      { english: "My treat", kurdish: "من میوانداریت دەکەم" },
      { english: "Cover it", kurdish: "پارەکەی دەدەم" },
      { english: "Chip in", kurdish: "بەشداری کردن لە پارەدان" },
    ],
    voices: [
      { prompt: "بڵێ با پارەکە بەش بکەین", target: "Let's just split it.", targetKurdish: "با تەنها بەشی بکەین." },
      { prompt: "بڵێ من پارەکە دەدەم", target: "Put your money away, it's on me.", targetKurdish: "پارەکەت دابنێوە، لەسەر منە." },
    ],
    sentences: [
      { english: ["Let's", "just", "split", "it"], kurdish: "با تەنها بەشی بکەین" },
      { english: ["Put", "your", "money", "away", "it's", "on", "me"], kurdish: "پارەکەت دابنێوە، لەسەر منە" },
    ],
    fillBlanks: [
      { parts: ["Don't worry, it's", "me."], hint: "لەسەر", answer: "on", wrongs: ["under", "jumping", "apple"] },
      { parts: ["Let's", "the bill."], hint: "بەشکردن", answer: "split", wrongs: ["break", "cloud", "sad"] },
    ],
    conversations: [
      {
        situation: "لە چێشتخانەیەکیت و پسوڵەی پارەکە هاتووە",
        theyAsk: "How much do I owe you for dinner?",
        correct: "Don't worry about it, it's on me.",
        wrong1: "I am splitting the table.",
        wrong2: "The dinner is a shoe.",
        wrong3: "I owe you the sky.",
        explanation: "وەڵامێکی باو کاتێک دەتەوێت پارەکە بدەیت: 'Don't worry about it, it's on me.'",
      },
    ],
  },

  // Lesson 4: Dealing with Debt
  {
    topic: "Owing Money", topicKu: "قەرزداری",
    words: [
      { english: "I owe you", kurdish: "قەرزداری تۆم" },
      { english: "Pay you back", kurdish: "پارەکەت دەدەمەوە" },
      { english: "Square up", kurdish: "پاکتاوکردنی قەرز (یەکلاکردنەوە)" },
      { english: "Short on cash", kurdish: "پارەم کەمە" },
      { english: "Spot me", kurdish: "پارەم بۆ بدە (قەرزێکی کاتی)" },
    ],
    voices: [
      { prompt: "بڵێ پارەکەت دەدەمەوە", target: "I'll pay you back tomorrow.", targetKurdish: "سبەی پارەکەت دەدەمەوە." },
      { prompt: "داوای پارە بکە کاتی", target: "Can you spot me a twenty?", targetKurdish: "دەتوانیت بیست دۆلارم بۆ بدەیت؟" },
    ],
    sentences: [
      { english: ["I'll", "pay", "you", "back", "tomorrow"], kurdish: "سبەی پارەکەت دەدەمەوە" },
      { english: ["Can", "you", "spot", "me", "a", "twenty"], kurdish: "دەتوانیت بیست دۆلارم بۆ بدەیت؟" },
    ],
    fillBlanks: [
      { parts: ["I'll pay you", "on Friday."], hint: "گەڕاندنەوەی پارە", answer: "back", wrongs: ["front", "jumping", "cloud"] },
      { parts: ["Can you", "me a few bucks?"], hint: "پێدانی کاتی (قەرزدان)", answer: "spot", wrongs: ["dot", "apple", "shoe"] },
    ],
    conversations: [
      {
        situation: "لە قاوەخانەیەکیت و پارەی کاشت پێ نییە",
        theyAsk: "The total is five dollars.",
        correct: "I forgot my wallet, can you spot me?",
        wrong1: "The wallet is running.",
        wrong2: "Square up the circle.",
        wrong3: "I pay back the water.",
        explanation: "داواکردنی پارە بە قەرز لە هاوڕێیەک: 'I forgot my wallet, can you spot me?'",
      },
    ],
  },

  // Lesson 5: Large Numbers & Slang
  {
    topic: "Big Money", topicKu: "پارەی زۆر",
    words: [
      { english: "A grand", kurdish: "هەزار دۆلار / گەڵایەک" },
      { english: "Six figures", kurdish: "شەش ژمارە (سەروو سەد هەزار)" },
      { english: "Making bank", kurdish: "پارەی زۆر پەیدا دەکات" },
      { english: "Ballin'", kurdish: "دەوڵەمەند (وەک یاریزانەکان دەژی)" },
      { english: "Stacked", kurdish: "پارەیەکی زۆری هەیە (کۆکراوەی پارە)" },
    ],
    voices: [
      { prompt: "بڵێ هەزار دۆلاری تێدەچێت", target: "It costs a grand.", targetKurdish: "هەزار دۆلاری تێدەچێت." },
      { prompt: "بڵێ ئەو پارەیەکی زۆر پەیدا دەکات", target: "He is making bank right now.", targetKurdish: "ئەو ئێستا پارەیەکی زۆر پەیدا دەکات." },
    ],
    sentences: [
      { english: ["It", "costs", "about", "a", "grand"], kurdish: "نزیکەی هەزار دۆلاری تێدەچێت" },
      { english: ["He", "is", "making", "bank", "right", "now"], kurdish: "ئەو ئێستا پارەیەکی زۆر پەیدا دەکات" },
    ],
    fillBlanks: [
      { parts: ["That car costs fifty", "."], hint: "هەزار (وشەی سەر شەقام)", answer: "grand", wrongs: ["baby", "jumping", "apple"] },
      { parts: ["She got a new job and she's making", "."], hint: "پارەیەکی زۆر", answer: "bank", wrongs: ["river", "shoe", "cloud"] },
    ],
    conversations: [
      {
        situation: "باسی ئیشی نوێی هاوڕێیەکت دەکەیت",
        theyAsk: "Did you hear Alex got a job at the tech company?",
        correct: "Yeah, I heard he's making bank now.",
        wrong1: "Alex is a bank building.",
        wrong2: "The grand is a piano.",
        wrong3: "He makes the jump fast.",
        explanation: "وەسفکردنی کەسێک کە پارەی زۆر پەیدا دەکات: 'Yeah, I heard he's making bank now.'",
      },
    ],
  },

  // Lesson 6: Hustling & Working
  {
    topic: "The Hustle", topicKu: "هەوڵدان و ئیشکردن",
    words: [
      { english: "Hustle", kurdish: "هەوڵدانی زۆر بۆ پارە (کۆشش)" },
      { english: "Grind", kurdish: "ئیشکردنی قورس و بەردەوام" },
      { english: "Gig", kurdish: "ئیشی کاتی (پڕۆژە)" },
      { english: "Side hustle", kurdish: "ئیشی لاوەکی" },
      { english: "Paycheck", kurdish: "موچە (چەکی پارە)" },
    ],
    voices: [
      { prompt: "بڵێ خەریکی هەوڵدانم", target: "I respect the hustle.", targetKurdish: "ڕێز لە هەوڵدانەکە دەگرم." },
      { prompt: "بڵێ ئیشێکی لاوەکیم هەیە", target: "I got a new side hustle.", targetKurdish: "ئیشێکی لاوەکی نوێم دەستکەوتووە." },
    ],
    sentences: [
      { english: ["I", "respect", "the", "hustle"], kurdish: "ڕێز لە هەوڵدانەکە دەگرم" },
      { english: ["I", "got", "a", "new", "side", "hustle"], kurdish: "ئیشێکی لاوەکی نوێم دەستکەوتووە" },
    ],
    fillBlanks: [
      { parts: ["Back to the daily", "."], hint: "ئیشکردنی قورس (ڕۆژانە)", answer: "grind", wrongs: ["coffee", "jumping", "blue"] },
      { parts: ["I need a side", "to make extra money."], hint: "ئیشی لاوەکی", answer: "hustle", wrongs: ["dance", "apple", "cloud"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت باسی ئەوە دەکات کە زۆر ئیش دەکات",
        theyAsk: "I'm working two jobs and selling art online.",
        correct: "I respect the hustle, man. Keep it up.",
        wrong1: "The hustle is a dance.",
        wrong2: "I grind the coffee beans.",
        wrong3: "Two jobs are sleeping.",
        explanation: "پێزانین بۆ ئیشی قورس: 'I respect the hustle, man. Keep it up.'",
      },
    ],
  },

  // Lesson 7: Budgeting & Saving
  {
    topic: "Saving Money", topicKu: "پاشەکەوتکردنی پارە",
    words: [
      { english: "Tight", kurdish: "توند (پارەی کەمە)" },
      { english: "Save up", kurdish: "پاشەکەوتکردن" },
      { english: "On a budget", kurdish: "لەسەر بودجەیەکی دیاریکراو" },
      { english: "Cut back", kurdish: "کەمکردنەوەی خەرجی" },
      { english: "Strapped for cash", kurdish: "گیرخواردوو بێ پارە" },
    ],
    voices: [
      { prompt: "بڵێ پارەم کەمە ئەم مانگە", target: "Things are a little tight this month.", targetKurdish: "ئەم مانگە بارودۆخ (پارە) کەمێک قورسە." },
      { prompt: "بڵێ پاشەکەوت دەکەم بۆ ئۆتۆمبێلێک", target: "I'm trying to save up for a car.", targetKurdish: "هەوڵدەدەم پاشەکەوت بکەم بۆ ئۆتۆمبێلێک." },
    ],
    sentences: [
      { english: ["Things", "are", "a", "little", "tight", "this", "month"], kurdish: "ئەم مانگە بارودۆخ (پارە) کەمێک قورسە" },
      { english: ["I'm", "trying", "to", "save", "up", "for", "a", "car"], kurdish: "هەوڵدەدەم پاشەکەوت بکەم بۆ ئۆتۆمبێلێک" },
    ],
    fillBlanks: [
      { parts: ["I can't go out, things are", "tight right now."], hint: "توند (پارەی کەم)", answer: "tight", wrongs: ["loose", "jumping", "blue"] },
      { parts: ["I need to", "back on buying coffee."], hint: "کەمکردنەوە (بڕین)", answer: "cut", wrongs: ["paste", "apple", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت پێشنیاری گەشتێک دەکات",
        theyAsk: "We should go on a trip to Miami next month!",
        correct: "I can't, I'm on a strict budget right now.",
        wrong1: "Miami is a tight pants.",
        wrong2: "The budget is a bird.",
        wrong3: "I cut back the tree.",
        explanation: "ڕەتکردنەوە بەهۆی نەبوونی پارە: 'I can't, I'm on a strict budget right now.'",
      },
    ],
  },

  // Lesson 8: Making Deals
  {
    topic: "Deals & Bargaining", topicKu: "مامەڵە و ڕێککەوتن",
    words: [
      { english: "A deal", kurdish: "ڕێککەوتن (هەلێکی باش)" },
      { english: "Knock off", kurdish: "کەمکردنەوە (لە نرخ)" },
      { english: "Lowball", kurdish: "نرخی زۆر کەم پێشکەشکردن" },
      { english: "Meet halfway", kurdish: "لە نیوەی ڕێگا ڕێکبکەوین (سازشکردن)" },
      { english: "Final offer", kurdish: "کۆتا نرخ" },
    ],
    voices: [
      { prompt: "بڵێ با لە نیوەی ڕێگا ڕێکبکەوین", target: "Let's just meet halfway.", targetKurdish: "با تەنها لە نیوەی ڕێگا ڕێکبکەوین." },
      { prompt: "بڵێ نرخی زۆر کەم مەدە", target: "Don't try to lowball me.", targetKurdish: "هەوڵمەدە نرخی زۆر کەمم پێ بدەیت." },
    ],
    sentences: [
      { english: ["Let's", "just", "meet", "halfway"], kurdish: "با تەنها لە نیوەی ڕێگا ڕێکبکەوین" },
      { english: ["Don't", "try", "to", "lowball", "me"], kurdish: "هەوڵمەدە نرخی زۆر کەمم پێ بدەیت" },
    ],
    fillBlanks: [
      { parts: ["That's my", "offer, take it or leave it."], hint: "کۆتایی", answer: "final", wrongs: ["first", "jumping", "blue"] },
      { parts: ["Can you", "off ten bucks?"], hint: "لێدان / کەمکردنەوە", answer: "knock", wrongs: ["punch", "apple", "cloud"] },
    ],
    conversations: [
      {
        situation: "ئۆتۆمبێلەکەت دەفرۆشیت و کڕیارێک مامەڵەت لەگەڵ دەکات",
        theyAsk: "I'll give you two thousand for the car.",
        correct: "Don't lowball me. My final offer is three thousand.",
        wrong1: "The car is a halfway deal.",
        wrong2: "I knock off the door.",
        wrong3: "The lowball is playing tennis.",
        explanation: "وەڵامێکی توند بۆ کەسێک کە نرخی زۆر کەم دەدات: 'Don't lowball me. My final offer is three thousand.'",
      },
    ],
  },

  // Lesson 9: Financial Trouble
  {
    topic: "Financial Trouble", topicKu: "کێشەی دارایی",
    words: [
      { english: "In the red", kurdish: "قەرزدار (لە زیاندا)" },
      { english: "Scrape by", kurdish: "بە سەختی دەژی (بە زۆر بەشی دەکات)" },
      { english: "Drowning in debt", kurdish: "نقومبووە لە قەرزدا" },
      { english: "Maxed out", kurdish: "گەیشتووەتە کۆتا ئاست (کارتەکەی)" },
      { english: "Bust", kurdish: "شکستخواردوو (مایەپووچ)" },
    ],
    voices: [
      { prompt: "بڵێ کارتم گەیشتووەتە کۆتایی", target: "My credit card is maxed out.", targetKurdish: "کارتی کرێدیتەکەم گەیشتووەتە کۆتا ئاست." },
      { prompt: "بڵێ بە زەحمەت دەژین", target: "We're just barely scraping by.", targetKurdish: "ئێمە تەنها بە سەختی دەژین (پارەمان بەشی ناکات)." },
    ],
    sentences: [
      { english: ["My", "credit", "card", "is", "maxed", "out"], kurdish: "کارتی کرێدیتەکەم گەیشتووەتە کۆتا ئاست" },
      { english: ["We're", "just", "barely", "scraping", "by"], kurdish: "ئێمە تەنها بە سەختی دەژین" },
    ],
    fillBlanks: [
      { parts: ["My credit card is", "out."], hint: "کۆتایی هاتووە (پڕبووە)", answer: "maxed", wrongs: ["minned", "jumping", "apple"] },
      { parts: ["He is completely drowning in", "."], hint: "قەرز", answer: "debt", wrongs: ["water", "shoe", "cloud"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت باسی کێشەی دارایی دەکات",
        theyAsk: "I have so many bills to pay this month.",
        correct: "I know the feeling. I'm barely scraping by myself.",
        wrong1: "The debt is swimming in the pool.",
        wrong2: "I max out the gym.",
        wrong3: "The red color is running.",
        explanation: "هاوسۆزی دەربڕین بۆ کێشەی دارایی: 'I know the feeling. I'm barely scraping by myself.'",
      },
    ],
  },
];

export default unit01;
