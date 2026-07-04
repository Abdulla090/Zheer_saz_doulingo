import { UnitBank } from "../types";

// ── Unit 0: Basic Greetings & Introductions — 10 unique A1/A2 lessons ──────────────────────────
// Simple, foundational vocabulary and daily phrases for absolute beginners.

const normalUnit00: UnitBank = [

  // Lesson 0: Basic Greetings
  {
    topic: "Basic Greetings", topicKu: "سڵاوکردنی سەرەتایی", topicAr: "التحيات البسيطة",
    words: [
      { english: "Hello", kurdish: "سڵاو", arabic: "هلو" },
      { english: "Good morning", kurdish: "بەیانیت باش", arabic: "صباح الخير" },
      { english: "Goodbye", kurdish: "خوات لەگەڵ", arabic: "مع السلامة" },
      { english: "Yes", kurdish: "بەڵێ", arabic: "اي" },
      { english: "No", kurdish: "نەخێر", arabic: "لا" },
    ],
    voices: [
      { prompt: "بڵێ: بەیانیت باش", target: "Good morning.", targetKurdish: "بەیانیت باش.", promptAr: "قول صباح الخير", targetArabic: "صباح الخير." },
      { prompt: "بڵێ: سڵاو، خوات لەگەڵ", target: "Hello, goodbye.", targetKurdish: "سڵاو، خوات لەگەڵ.", promptAr: "قول هلو، مع السلامة", targetArabic: "هلو، مع السلامة." },
    ],
    sentences: [
      { english: ["Good", "morning"], kurdish: "بەیانیت باش", arabic: "صباح الخير" },
      { english: ["Hello", "goodbye"], kurdish: "سڵاو، خوات لەگەڵ", arabic: "هلو، مع السلامة" },
    ],
    fillBlanks: [
      { parts: ["Good", "!"], hint: "بەیانیت باش", answer: "morning", wrongs: ["bye", "night", "hello"], arabicHint: "صباح الخير", arabicParts: ["صباح", "!"], arabicAnswer: "الخير", arabicWrongs: ["سلام", "ليل", "هلو"] },
      { parts: ["Hello,", "!"], hint: "سڵاو، خوات لەگەڵ", answer: "goodbye", wrongs: ["yes", "no", "morning"], arabicHint: "هلو، مع السلامة", arabicParts: ["هلو،", "!"], arabicAnswer: "مع السلامة", arabicWrongs: ["اي", "لا", "صباح"] },
    ],
    conversations: [
      { situation: "سڵاوکردن لە هاوڕێیەک", theyAsk: "Hello!", correct: "Hi! Good morning.", wrong1: "Goodbye.", wrong2: "No, thanks.", wrong3: "Yes, please.", explanation: "سڵاو بە سڵاو یان بەیانیت باش وەڵام دەدرێتەوە.", situationAr: "الترحيب بصديق", explanationAr: "التحية ترد بالتحية أو صباح الخير.", theyAskAr: "هلو!", correctAr: "هلو! صباح الخير.", wrong1Ar: "مع السلامة.", wrong2Ar: "لا شكراً.", wrong3Ar: "اي فدوة." },
    ],
  },

  // Lesson 1: Introducing Yourself
  {
    topic: "Introducing Yourself", topicKu: "خۆناساندن", topicAr: "التعريف بالنفس",
    words: [
      { english: "What is your name?", kurdish: "ناوت چییە؟", arabic: "شنو اسمك؟" },
      { english: "My name is", kurdish: "ناوی من...", arabic: "اسمي..." },
      { english: "Nice to meet you", kurdish: "خۆشحاڵم بە ناسینت", arabic: "فرصة سعيدة" },
      { english: "Friend", kurdish: "هاوڕێ", arabic: "صديق" },
      { english: "Teacher", kurdish: "مامۆستا", arabic: "استاذ" },
    ],
    voices: [
      { prompt: "بڵێ: ناوم ئەحمەدە", target: "My name is Ahmed.", targetKurdish: "ناوی من ئەحمەدە.", promptAr: "قول اسمي احمد", targetArabic: "اسمي احمد." },
      { prompt: "بڵێ: خۆشحاڵم بە ناسینت", target: "Nice to meet you.", targetKurdish: "خۆشحاڵم بە ناسینت.", promptAr: "قول فرصة سعيدة", targetArabic: "فرصة سعيدة." },
    ],
    sentences: [
      { english: ["My", "name", "is", "Ahmed"], kurdish: "ناوی من ئەحمەدە", arabic: "اسمي احمد" },
      { english: ["Nice", "to", "meet", "you"], kurdish: "خۆشحاڵم بە ناسینت", arabic: "فرصة سعيدة" },
    ],
    fillBlanks: [
      { parts: ["My", "is Ahmed."], hint: "ناوی من ئەحمەدە", answer: "name", wrongs: ["friend", "teacher", "meet"], arabicHint: "اسمي احمد", arabicParts: ["اسمي", "احمد."], arabicAnswer: "اسمي", arabicWrongs: ["صديقي", "استاذي", "فرصة"] },
      { parts: ["Nice to", "you."], hint: "خۆشحاڵم بە ناسینت", answer: "meet", wrongs: ["name", "friend", "say"], arabicHint: "فرصة سعيدة", arabicParts: ["فرصة", "بیک."], arabicAnswer: "سعيدة", arabicWrongs: ["شلونك", "صديقي", "استاذ"] },
    ],
    conversations: [
      { situation: "کەسێکی نوێ خۆت پێ دەناسێنێت", theyAsk: "My name is Sara. What is your name?", correct: "My name is Karwan. Nice to meet you!", wrong1: "Goodbye Sara.", wrong2: "Good morning friend.", wrong3: "No, thank you.", explanation: "کاتێک کەسێک ناوی خۆی دەڵێت، تۆش ناوی خۆت بڵێ و پاشان بڵێ خۆشحاڵم بە ناسینت.", situationAr: "شخص جديد يعرف نفسه لك", explanationAr: "عندما يذكر شخص اسمه، اذكر اسمك وقل فرصة سعيدة.", theyAskAr: "اسمي سارة. شنو اسمك؟", correctAr: "اسمي كاروان. فرصة سعيدة!", wrong1Ar: "مع السلامة سارة.", wrong2Ar: "صباح الخير صديقي.", wrong3Ar: "لا شكراً." },
    ],
  },

  // Lesson 2: How Are You?
  {
    topic: "How Are You?", topicKu: "چۆنێتیی باشبوون", topicAr: "كيف حالك؟",
    words: [
      { english: "How are you?", kurdish: "چۆنی؟", arabic: "شلونك؟" },
      { english: "I am fine", kurdish: "من باشم", arabic: "اني زين" },
      { english: "Thanks", kurdish: "سوپاس", arabic: "شكراً" },
      { english: "And you?", kurdish: "ئەی تۆ؟", arabic: "وانت؟" },
      { english: "Very good", kurdish: "زۆر باش", arabic: "كلش زين" },
    ],
    voices: [
      { prompt: "بپرس: چۆنیت؟", target: "How are you?", targetKurdish: "چۆنی؟", promptAr: "اسأل شلونك", targetArabic: "شلونك؟" },
      { prompt: "بڵێ: من باشم، سوپاس", target: "I am fine, thanks.", targetKurdish: "من باشم، سوپاس.", promptAr: "قول اني زين، شكراً", targetArabic: "اني زين، شكراً." },
    ],
    sentences: [
      { english: ["How", "are", "you"], kurdish: "چۆنی؟", arabic: "شلونك؟" },
      { english: ["I", "am", "fine", "thanks"], kurdish: "من باشم، سوپاس", arabic: "اني زين، شكراً" },
    ],
    fillBlanks: [
      { parts: ["I am", ", thanks."], hint: "من باشم، سوپاس", answer: "fine", wrongs: ["bad", "morning", "how"], arabicHint: "اني زين، شكراً", arabicParts: ["اني", "، شكراً."], arabicAnswer: "زين", arabicWrongs: ["مو زين", "الصبح", "شلونك"] },
      { parts: ["How are", "?"], hint: "چۆنی؟", answer: "you", wrongs: ["fine", "thanks", "me"], arabicHint: "شلونك؟", arabicParts: ["شلون", "؟"], arabicAnswer: "ك", arabicWrongs: ["زين", "شكراً", "اني"] },
    ],
    conversations: [
      { situation: "هاوڕێیەک دەپرسێت چۆنیت", theyAsk: "How are you?", correct: "I am fine, thanks! And you?", wrong1: "Nice to meet you.", wrong2: "My name is Karwan.", wrong3: "Good morning.", explanation: "لە وەڵامی 'How are you' دەڵێیت باشم و سوپاس، و دەتوانیت بپرسی ئەی تۆ؟", situationAr: "صديق يسألك عن حالك", explanationAr: "في جواب شلونك تقول اني زين وشكراً وتسأل وانت شلونك؟", theyAskAr: "شلونك؟", correctAr: "اني زين، شكراً! وانت؟", wrong1Ar: "فرصة سعيدة.", wrong2Ar: "اسمي كاروان.", wrong3Ar: "صباح الخير." },
    ],
  },

  // Lesson 3: Numbers 1-10
  {
    topic: "Numbers 1-10", topicKu: "ژمارەکان ١-١٠", topicAr: "الأرقام ١-١٠",
    words: [
      { english: "One", kurdish: "یەک", arabic: "واحد" },
      { english: "Two", kurdish: "دوو", arabic: "اثنين" },
      { english: "Three", kurdish: "سێ", arabic: "تلاثة" },
      { english: "Five", kurdish: "پێنج", arabic: "خمسة" },
      { english: "Ten", kurdish: "دە", arabic: "عشرة" },
    ],
    voices: [
      { prompt: "بڵێ: سێ پشیلە", target: "Three cats.", targetKurdish: "سێ پشیلە.", promptAr: "قول تلاث بزونات", targetArabic: "تلاث بزونات." },
      { prompt: "بڵێ: پێنج سەگ", target: "Five dogs.", targetKurdish: "پێنج سەگ.", promptAr: "قول خمس چلیب", targetArabic: "خمس چلیب." },
    ],
    sentences: [
      { english: ["I", "have", "three", "cats"], kurdish: "سێ پشیلەم هەیە", arabic: "عندي تلاث بزونات" },
      { english: ["I", "see", "five", "dogs"], kurdish: "پێنج سەگ دەبینم", arabic: "دا اشوف خمس چلیب" },
    ],
    fillBlanks: [
      { parts: ["I have", "dogs."], hint: "دوو سەگم هەیە", answer: "two", wrongs: ["one", "hello", "fine"], arabicHint: "عندي اثنين چلیب", arabicParts: ["عندي", "چلیب."], arabicAnswer: "اثنين", arabicWrongs: ["واحد", "هلو", "زين"] },
      { parts: ["Three cats and", "dogs."], hint: "سێ پشیلە و دە سەگ", answer: "ten", wrongs: ["five", "name", "bye"], arabicHint: "تلاث بزونات وعشرة چلیب", arabicParts: ["تلاث بزونات و", "چلیب."], arabicAnswer: "عشرة", arabicWrongs: ["خمسة", "اسمي", "باي"] },
    ],
    conversations: [
      { situation: "یەکێک ژمارەی ئاژەڵەکانت لێ دەپرسێت", theyAsk: "How many cats do you have?", correct: "I have two cats.", wrong1: "My name is Ahmed.", wrong2: "Good morning.", wrong3: "I am fine.", explanation: "کاتێک دەپرسرێت چەند، بە ژمارە وەڵام دەدەیتەوە: 'I have two cats.'", situationAr: "شخص يسألك عن عدد بزوناتك", explanationAr: "عند السؤال عن العدد، تجيب بالرقم: عندي اثنين بزونات.", theyAskAr: "كم بزونة عندك؟", correctAr: "عندي اثنين بزونات.", wrong1Ar: "اسمي احمد.", wrong2Ar: "صباح الخير.", wrong3Ar: "اني زين." },
    ],
  },

  // Lesson 4: Colors
  {
    topic: "Colors", topicKu: "ڕەنگەکان", topicAr: "الألوان",
    words: [
      { english: "Red", kurdish: "سوور", arabic: "احمر" },
      { english: "Blue", kurdish: "شین", arabic: "ازرك" },
      { english: "Green", kurdish: "سەوز", arabic: "اخضر" },
      { english: "Yellow", kurdish: "زەرد", arabic: "اصفر" },
      { english: "White", kurdish: "سپی", arabic: "ابيض" },
    ],
    voices: [
      { prompt: "بڵێ: پشیلەی سپی", target: "A white cat.", targetKurdish: "پشیلەیەکی سپی.", promptAr: "قول بزونة بيضة", targetArabic: "بزونة بيضة." },
      { prompt: "بڵێ: سەگی سوور", target: "A red dog.", targetKurdish: "سەگێکی سوور.", promptAr: "قول چلب احمر", targetArabic: "چلب احمر." },
    ],
    sentences: [
      { english: ["The", "car", "is", "blue"], kurdish: "ئۆتۆمبێلەکە شینە", arabic: "السيارة زركة" },
      { english: ["I", "like", "green"], kurdish: "حەزم لە سەوزە", arabic: "احب الاخضر" },
    ],
    fillBlanks: [
      { parts: ["The paper is", "."], hint: "کاغەزەکە سپییە", answer: "white", wrongs: ["blue", "yes", "hello"], arabicHint: "الورقة بيضة", arabicParts: ["الورقة", "."], arabicAnswer: "بيضة", arabicWrongs: ["زركة", "اي", "هلو"] },
      { parts: ["I want a", "pen."], hint: "پێنوسی سوورم دەوێت", answer: "red", wrongs: ["one", "thanks", "fine"], arabicHint: "اريد قلم احمر", arabicParts: ["اريد قلم", "."], arabicAnswer: "احمر", arabicWrongs: ["واحد", "شكراً", "زين"] },
    ],
    conversations: [
      { situation: "هاوڕێیەک پرسیاری ڕەنگی دڵخوازت دەکات", theyAsk: "What is your favorite color?", correct: "My favorite color is blue.", wrong1: "I have five cats.", wrong2: "Nice to meet you.", wrong3: "I am fine.", explanation: "بۆ وەڵامی ڕەنگی دڵخواز، ڕەنگێک دیاری دەکەیت: 'My favorite color is blue.'", situationAr: "صديق يسألك عن لونك المفضل", explanationAr: "للجواب عن اللون المفضل، تحدد لوناً: لوني المفضل الازرك.", theyAskAr: "شنو لونك المفضل؟", correctAr: "لوني المفضل ازرك.", wrong1Ar: "عندي خمس بزونات.", wrong2Ar: "فرصة سعيدة.", wrong3Ar: "اني زين." },
    ],
  },

  // Lesson 5: Family
  {
    topic: "Family", topicKu: "خێزان", topicAr: "العائلة",
    words: [
      { english: "Father", kurdish: "باوک", arabic: "ابويا" },
      { english: "Mother", kurdish: "دایک", arabic: "اميا" },
      { english: "Brother", kurdish: "برا", arabic: "اخويا" },
      { english: "Sister", kurdish: "خوشک", arabic: "اختي" },
      { english: "Family", kurdish: "خێزان", arabic: "عائلة" },
    ],
    voices: [
      { prompt: "بڵێ: ئەمە خوشکی منە", target: "This is my sister.", targetKurdish: "ئەمە خوشکی منە.", promptAr: "قول هاي اختي", targetArabic: "هاي اختي." },
      { prompt: "بڵێ: من برام هەیە", target: "I have a brother.", targetKurdish: "برام هەیە.", promptAr: "قول عندي اخويا", targetArabic: "عندي اخويا." },
    ],
    sentences: [
      { english: ["This", "is", "my", "father"], kurdish: "ئەمە باوکی منە", arabic: "هذا ابويا" },
      { english: ["I", "love", "my", "family"], kurdish: "خێزانەکەمم خۆش دەوێت", arabic: "احب عائلتي" },
    ],
    fillBlanks: [
      { parts: ["My", "is tall."], hint: "براکەم درێژە", answer: "brother", wrongs: ["mother", "sister", "hello"], arabicHint: "اخويا طويل", arabicParts: ["اخويا", "طويل."], arabicAnswer: "اخويا", arabicWrongs: ["اميا", "اختي", "هلو"] },
      { parts: ["I love my", "."], hint: "دایکمم خۆش دەوێت", answer: "mother", wrongs: ["father", "one", "fine"], arabicHint: "احب اميا", arabicParts: ["احب", "."], arabicAnswer: "اميا", arabicWrongs: ["ابويا", "واحد", "زين"] },
    ],
    conversations: [
      { situation: "هاوڕێیەک خوشکەکەت دەبینێت و دەپرسێت ئەمە کێیە", theyAsk: "Who is this?", correct: "This is my sister, Sara.", wrong1: "I am fine, thanks.", wrong2: "Nice to meet you Sara.", wrong3: "My name is Sara.", explanation: "کاتێک دەپرسن ئەمە کێیە، خزمەکەت دەناسێنیت: 'This is my sister, Sara.'", situationAr: "صديق يرى اختك ويسأل من هذه", explanationAr: "عند السؤال من هذه، تعرّف بقريبتك: هاي اختي سارة.", theyAskAr: "منو هاي؟", correctAr: "هاي اختي، سارة.", wrong1Ar: "اني زين، شكراً.", wrong2Ar: "فرصة سعيدة سارة.", wrong3Ar: "اسمي سارة." },
    ],
  },

  // Lesson 6: Basic Actions
  {
    topic: "Basic Actions", topicKu: "کردارە سەرەتاییەکان", topicAr: "الأفعال البسيطة",
    words: [
      { english: "Eat", kurdish: "خواردن", arabic: "ياكل" },
      { english: "Drink", kurdish: "خواردنەوە", arabic: "يشرب" },
      { english: "Sleep", kurdish: "خەوتن", arabic: "ينام" },
      { english: "Read", kurdish: "خوێندنەوە", arabic: "يقرا" },
      { english: "Walk", kurdish: "ڕۆشتن", arabic: "يمشي" },
    ],
    voices: [
      { prompt: "بڵێ: من نان دەخۆم", target: "I eat bread.", targetKurdish: "نان دەخۆم.", promptAr: "قول دا اكل خبز", targetArabic: "دا اكل خبز." },
      { prompt: "بڵێ: من ئاو دەخۆمەوە", target: "I drink water.", targetKurdish: "ئاو دەخۆمەوە.", promptAr: "قول دا اشرب مي", targetArabic: "دا اشرب مي." },
    ],
    sentences: [
      { english: ["I", "sleep", "at", "night"], kurdish: "شەوان دەخەوم", arabic: "انام بالليل" },
      { english: ["I", "read", "a", "book"], kurdish: "کتێبێک دەخوێنمەوە", arabic: "دا اقرا كتاب" },
    ],
    fillBlanks: [
      { parts: ["I", "water every day."], hint: "هەموو ڕۆژێک ئاو دەخۆمەوە", answer: "drink", wrongs: ["eat", "sleep", "walk"], arabicHint: "اشرب مي كل يوم", arabicParts: ["", "مي كل يوم."], arabicAnswer: "اشرب", arabicWrongs: ["اكل", "انام", "امشي"] },
      { parts: ["I want to", "a book."], hint: "دەمهەوێت کتێبێک بخوێنمەوە", answer: "read", wrongs: ["drink", "sleep", "eat"], arabicHint: "اريد اقرا كتاب", arabicParts: ["اريد", "كتاب."], arabicAnswer: "اقرا", arabicWrongs: ["اشرب", "انام", "اكل"] },
    ],
    conversations: [
      { situation: "هاوڕێیەک لە چێشتخانە دەپرسێت چی دەکەیت", theyAsk: "What do you want to do?", correct: "I want to eat lunch.", wrong1: "I have a sister.", wrong2: "Nice to meet you.", wrong3: "I am fine.", explanation: "بۆ وەڵامی چی دەکەیت، دەڵێیت دەمەوێت نان بخۆم: 'I want to eat lunch.'", situationAr: "صديق في المطعم يسألك ماذا تريد أن تفعل", explanationAr: "للجواب عن ماذا تفعل، تقول اريد اكل غدا.", theyAskAr: "شنو تريد تسوي؟", correctAr: "اريد اكل غدا.", wrong1Ar: "عندي اخت.", wrong2Ar: "فرصة سعيدة.", wrong3Ar: "اني زين." },
    ],
  },

  // Lesson 7: Simple Questions
  {
    topic: "Simple Questions", topicKu: "پرسیارە سادەکان", topicAr: "الأسئلة البسيطة",
    words: [
      { english: "What is this?", kurdish: "ئەمە چییە؟", arabic: "شنو هذا؟" },
      { english: "Where is it?", kurdish: "لەکوێیە؟", arabic: "وين صاير؟" },
      { english: "Who is that?", kurdish: "ئەوە کێیە؟", arabic: "منو هذاك؟" },
      { english: "Why?", kurdish: "بۆچی؟", arabic: "ليش؟" },
      { english: "When?", kurdish: "کەی؟", arabic: "شوكت؟" },
    ],
    voices: [
      { prompt: "بپرس: ئەمە چییە؟", target: "What is this?", targetKurdish: "ئەمە چییە؟", promptAr: "اسأل شنو هذا", targetArabic: "شنو هذا؟" },
      { prompt: "بپرس: لە کوێیە؟", target: "Where is it?", targetKurdish: "لەکوێیە؟", promptAr: "اسأل وين صاير", targetArabic: "وين صاير؟" },
    ],
    sentences: [
      { english: ["Who", "is", "that", "man"], kurdish: "ئەو پیاوە کێیە؟", arabic: "منو هذاك الرجال؟" },
      { english: ["When", "is", "the", "lesson"], kurdish: "وانەکە کەیە؟", arabic: "شوكت الدرس؟" },
    ],
    fillBlanks: [
      { parts: ["", "is my key?"], hint: "کلیلەکەم لەکوێیە؟", answer: "Where", wrongs: ["Who", "What", "Why"], arabicHint: "وين مفتاحي؟", arabicParts: ["", "مفتاحي؟"], arabicAnswer: "وين", arabicWrongs: ["منو", "شنو", "ليش"] },
      { parts: ["", "is this animal?"], hint: "ئەم ئاژەڵە چییە؟", answer: "What", wrongs: ["When", "Where", "Who"], arabicHint: "شنو هذا الحيوان؟", arabicParts: ["", "هذا الحيوان؟"], arabicAnswer: "شنو", arabicWrongs: ["شوكت", "وين", "منو"] },
    ],
    conversations: [
      { situation: "کلیلەکانت لێ ون بووە و دەپرسیت", theyAsk: "What are you looking for?", correct: "Where is my key?", wrong1: "Yes, I am fine.", wrong2: "Nice to meet you.", wrong3: "My name is Ahmed.", explanation: "کاتێک بۆ کلیل دەگەڕێیت، دەپرسیت: 'Where is my key?'", situationAr: "مفاتيحك ضائعة وتسأل عنها", explanationAr: "عند البحث عن المفتاح، تسأل: وين مفتاحي؟", theyAskAr: "عن شنو دا تدور؟", correctAr: "وين مفتاحي؟", wrong1Ar: "اي، اني زين.", wrong2Ar: "فرصة سعيدة.", wrong3Ar: "اسمي احمد." },
    ],
  },

  // Lesson 8: Common Objects
  {
    topic: "Common Objects", topicKu: "کەلوپەلە باوەکان", topicAr: "الأشياء الشائعة",
    words: [
      { english: "Book", kurdish: "کتێب", arabic: "كتاب" },
      { english: "Pen", kurdish: "پێنووس", arabic: "قلم" },
      { english: "Phone", kurdish: "مۆبایل", arabic: "تلفون" },
      { english: "Key", kurdish: "کلیل", arabic: "مفتاح" },
      { english: "Bag", kurdish: "جانتا", arabic: "جنطة" },
    ],
    voices: [
      { prompt: "بڵێ: ئەمە مۆبایلی منە", target: "This is my phone.", targetKurdish: "ئەمە مۆبایلی منە.", promptAr: "قول هذا تلفوني", targetArabic: "هذا تلفوني." },
      { prompt: "بڵێ: جانتای سپی", target: "A white bag.", targetKurdish: "جانتایەکی سپی.", promptAr: "قول جنطة بيضة", targetArabic: "جنطة بيضة." },
    ],
    sentences: [
      { english: ["I", "have", "the", "key"], kurdish: "کلیلەکەم لایە", arabic: "المفتاح عندي" },
      { english: ["The", "book", "is", "red"], kurdish: "کتێبەکە سوورە", arabic: "الكتاب احمر" },
    ],
    fillBlanks: [
      { parts: ["Where is my", "?"], hint: "مۆبایلەکەم لەکوێیە؟", answer: "phone", wrongs: ["yes", "hello", "fine"], arabicHint: "وين تلفوني؟", arabicParts: ["وين", "؟"], arabicAnswer: "تلفوني", arabicWrongs: ["اي", "هلو", "زين"] },
      { parts: ["I need a", "to write."], hint: "پێنووسێکم پێویستە بۆ نووسین", answer: "pen", wrongs: ["key", "book", "goodbye"], arabicHint: "اريد قلم حتى اكتب", arabicParts: ["اريد", "حتى اكتب."], arabicAnswer: "قلم", arabicWrongs: ["مفتاح", "كتاب", "مع السلامة"] },
    ],
    conversations: [
      { situation: "داوای پێنووس دەکەیت بۆ نووسین", theyAsk: "Do you need anything?", correct: "Yes, I need a pen, please.", wrong1: "No, goodbye.", wrong2: "Nice to meet you.", wrong3: "I have three cats.", explanation: "کاتێک پێویستت بە نووسین بێت، داوای پێنووس دەکەیت بە ئەدەبەوە.", situationAr: "تطلب قلماً لتكتب به", explanationAr: "عند الحاجة للكتابة، تطلب قلماً بأدب.", theyAskAr: "محتاج شي؟", correctAr: "اي، اريد قلم فدوة.", wrong1Ar: "لا، مع السلامة.", wrong2Ar: "فرصة سعيدة.", wrong3Ar: "عندي تلاث بزونات." },
    ],
  },

  // Lesson 9: Common Places
  {
    topic: "Common Places", topicKu: "شوێنە باوەکان", topicAr: "الأماكن الشائعة",
    words: [
      { english: "House", kurdish: "ماڵ", arabic: "بيت" },
      { english: "School", kurdish: "قوتابخانە", arabic: "مدرسة" },
      { english: "Market", kurdish: "بازاڕ", arabic: "سوق" },
      { english: "Street", kurdish: "شەقام", arabic: "شارع" },
      { english: "Work", kurdish: "کار", arabic: "شغل" },
    ],
    voices: [
      { prompt: "بڵێ: من لە ماڵەوەم", target: "I am at home.", targetKurdish: "من لە ماڵەوەم.", promptAr: "قول اني بالبيت", targetArabic: "اني بالبيت." },
      { prompt: "بڵێ: من دەچم بۆ قوتابخانە", target: "I go to school.", targetKurdish: "دەچم بۆ قوتابخانە.", promptAr: "قول دا اروح للمدرسة", targetArabic: "دا اروح للمدرسة." },
    ],
    sentences: [
      { english: ["The", "market", "is", "big"], kurdish: "بازاڕەکە گەورەیە", arabic: "السوق چبير" },
      { english: ["I", "am", "at", "work"], kurdish: "من لە سەر کارم", arabic: "اني بالشغل" },
    ],
    fillBlanks: [
      { parts: ["I go to", "every morning."], hint: "هەموو بەیانییەک دەچم بۆ سەر کار", answer: "work", wrongs: ["house", "hello", "fine"], arabicHint: "اروح للشغل كل صبح", arabicParts: ["اروح", "كل صبح."], arabicAnswer: "للشغل", arabicWrongs: ["للبيت", "هلو", "زين"] },
      { parts: ["This is my", "."], hint: "ئەمە ماڵەکەی منە", answer: "house", wrongs: ["street", "name", "bye"], arabicHint: "هذا بيتي", arabicParts: ["هذا", "."], arabicAnswer: "بيتي", arabicWrongs: ["شارعي", "اسمي", "باي"] },
    ],
    conversations: [
      { situation: "هاوڕێیەک لە تەلەفۆندا دەپرسێت لەکوێیت", theyAsk: "Where are you now?", correct: "I am at home.", wrong1: "Nice to meet you.", wrong2: "What is your name?", wrong3: "Good morning.", explanation: "لە وەڵامی پرسیاری شوێن، دەڵێیت لە ماڵەوەم: 'I am at home.'", situationAr: "صديق يسألك بالهاتف وينك", explanationAr: "جواباً عن السؤال عن المكان، تقول اني بالبيت.", theyAskAr: "وينك هسة؟", correctAr: "اني بالبيت.", wrong1Ar: "فرصة سعيدة.", wrong2Ar: "شنو اسمك؟", wrong3Ar: "صباح الخير." },
    ],
  },
];

export default normalUnit00;
