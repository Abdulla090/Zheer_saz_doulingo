import type { UnitBank } from "../types";

// ── Kids Unit 3: Daily Routines (ڕووتینی ڕۆژانە) ─────────────────────────────
const kidsUnit3: UnitBank = [
  // Lesson 0: Good Morning
  {
    topic: "Good Morning", topicKu: "بەیانی باش",
    words: [
      { english: "Wake up", kurdish: "هەستان لە خەو" },
      { english: "Water", kurdish: "ئاو" },
      { english: "Face", kurdish: "دەموچاو" },
      { english: "Happy", kurdish: "دڵخۆش" },
      { english: "Morning", kurdish: "بەیانی" },
    ],
    voices: [
      { prompt: "بڵێ: هەڵسە لە خەو", target: "Wake up.", targetKurdish: "هەڵسە لە خەو." },
      { prompt: "بڵێ: دەموچاوم دەشۆم", target: "I wash my face.", targetKurdish: "دەموچاوم دەشۆم." },
    ],
    sentences: [
      { english: ["I", "wake", "up"], kurdish: "لە خەو هەڵدەستم" },
      { english: ["I", "wash", "my", "face"], kurdish: "دەموچاوم دەشۆم" },
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
  },
  // Lesson 1: Hungry
  {
    topic: "Hungry", topicKu: "برسی",
    words: [
      { english: "Hungry", kurdish: "برسیمە" },
      { english: "Apple", kurdish: "سێو" },
      { english: "Bread", kurdish: "نان" },
      { english: "Milk", kurdish: "شیر" },
      { english: "Eat", kurdish: "خواردن" },
    ],
    voices: [
      { prompt: "بڵێ: من برسیمە", target: "I am hungry.", targetKurdish: "من برسیمە." },
      { prompt: "بڵێ: شیر دەخۆمەوە", target: "I drink milk.", targetKurdish: "شیر دەخۆمەوە." },
    ],
    sentences: [
      { english: ["I", "am", "hungry"], kurdish: "من برسیمە" },
      { english: ["I", "eat", "an", "apple"], kurdish: "سێوێک دەخۆم" },
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
  },
  // Lesson 2: Play Time
  {
    topic: "Play Time", topicKu: "کاتی یاری",
    words: [
      { english: "Play", kurdish: "یاری" },
      { english: "Run", kurdish: "ڕاکردن" },
      { english: "Jump", kurdish: "بازدان" },
      { english: "Ball", kurdish: "تۆپ" },
      { english: "Fun", kurdish: "خۆش" },
    ],
    voices: [
      { prompt: "بڵێ: یاری دەکەین", target: "We play.", targetKurdish: "یاری دەکەین." },
      { prompt: "بڵێ: تۆپەکە هەڵدەدەم", target: "I throw the ball.", targetKurdish: "تۆپەکە هەڵدەدەم." },
    ],
    sentences: [
      { english: ["We", "play", "with", "a", "ball"], kurdish: "یاری بە تۆپ دەکەین" },
      { english: ["I", "can", "run", "fast"], kurdish: "دەتوانم خێرا ڕابکەم" },
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
  },
  // Lesson 3: My Clothes
  {
    topic: "My Clothes", topicKu: "جلوبەرگم",
    words: [
      { english: "Shirt", kurdish: "کراس" },
      { english: "Pants", kurdish: "پانتۆڵ" },
      { english: "Shoes", kurdish: "پێڵاو" },
      { english: "Cold", kurdish: "سەرما" },
      { english: "Wear", kurdish: "لەبەرکردن" },
    ],
    voices: [
      { prompt: "بڵێ: پێڵاوەکانم لەپێ دەکەم", target: "I wear my shoes.", targetKurdish: "پێڵاوەکانم لەپێ دەکەم." },
      { prompt: "بڵێ: من سەرمامە", target: "I am cold.", targetKurdish: "من سەرمامە." },
    ],
    sentences: [
      { english: ["I", "wear", "a", "shirt"], kurdish: "کراسێک لەبەر دەکەم" },
      { english: ["I", "am", "cold"], kurdish: "من سەرمامە" },
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
        explanation: "بڵێ: 'I will wear a shirt and pants.'",
      },
    ],
  },
  // Lesson 4: Family House
  {
    topic: "Family House", topicKu: "خانووی خێزان",
    words: [
      { english: "House", kurdish: "خانوو" },
      { english: "Door", kurdish: "دەرگا" },
      { english: "Mom", kurdish: "دایک" },
      { english: "Dad", kurdish: "باوک" },
      { english: "Home", kurdish: "ماڵەوە" },
    ],
    voices: [
      { prompt: "بڵێ: ئەمە ماڵی منە", target: "This is my home.", targetKurdish: "ئەمە ماڵی منە." },
      { prompt: "بڵێ: دەرگاکە بکەرەوە", target: "Open the door.", targetKurdish: "دەرگاکە بکەرەوە." },
    ],
    sentences: [
      { english: ["This", "is", "my", "house"], kurdish: "ئەمە خانووی منە" },
      { english: ["Open", "the", "door"], kurdish: "دەرگاکە بکەرەوە" },
    ],
    fillBlanks: [
      { parts: ["My", "and dad are here"], hint: "دایک و باوکم لێرەن", answer: "mom", wrongs: ["cat", "dog", "car"] },
      { parts: ["We go", "after school"], hint: "دوای قوتابخانە دەچینەوە ماڵەوە", answer: "home", wrongs: ["tree", "door", "house"] },
    ],
    conversations: [
      {
        situation: "لە بەردەم دەرگای ماڵەوەن",
        theyAsk: "Are we home?",
        correct: "Yes, open the door!",
        wrong1: "This is a house.",
        wrong2: "Mom is here.",
        wrong3: "We have arrived at our residence.",
        explanation: "بڵێ: 'Yes, open the door!'",
      },
    ],
  },
  // Lesson 5: Bath Time
  {
    topic: "Bath Time", topicKu: "کاتی خۆشتن",
    words: [
      { english: "Bath", kurdish: "خۆشتن" },
      { english: "Soap", kurdish: "سابوون" },
      { english: "Water", kurdish: "ئاو" },
      { english: "Clean", kurdish: "خاوێن" },
      { english: "Wash", kurdish: "شۆردن" },
    ],
    voices: [
      { prompt: "بڵێ: دەستەکانم دەشۆم", target: "I wash my hands.", targetKurdish: "دەستەکانم دەشۆم." },
      { prompt: "بڵێ: من خاوێنم", target: "I am clean.", targetKurdish: "من خاوێنم." },
    ],
    sentences: [
      { english: ["I", "take", "a", "bath"], kurdish: "خۆم دەشۆم" },
      { english: ["I", "wash", "my", "hands"], kurdish: "دەستەکانم دەشۆم" },
    ],
    fillBlanks: [
      { parts: ["I use", "and water"], hint: "سابوون و ئاو بەکار دەهێنم", answer: "soap", wrongs: ["apple", "bread", "shoe"] },
      { parts: ["Now I am very", ""], hint: "ئێستا زۆر خاوێنم", answer: "clean", wrongs: ["dirty", "sad", "mad"] },
    ],
    conversations: [
      {
        situation: "دایکت دەپرسێت بۆچی سابوون بەکار دەهێنیت",
        theyAsk: "Why do you use soap?",
        correct: "To be clean!",
        wrong1: "Soap is good.",
        wrong2: "Water is cold.",
        wrong3: "For hygienic purposes.",
        explanation: "وەڵامی سادە: 'To be clean!'",
      },
    ],
  },
  // Lesson 6: School Time
  {
    topic: "School Time", topicKu: "کاتی قوتابخانە",
    words: [
      { english: "School", kurdish: "قوتابخانە" },
      { english: "Teacher", kurdish: "مامۆستا" },
      { english: "Book", kurdish: "کتێب" },
      { english: "Read", kurdish: "خوێندنەوە" },
      { english: "Learn", kurdish: "فێربوون" },
    ],
    voices: [
      { prompt: "بڵێ: دەچم بۆ قوتابخانە", target: "I go to school.", targetKurdish: "دەچم بۆ قوتابخانە." },
      { prompt: "بڵێ: من کتێبێک دەخوێنمەوە", target: "I read a book.", targetKurdish: "من کتێبێک دەخوێنمەوە." },
    ],
    sentences: [
      { english: ["I", "go", "to", "school"], kurdish: "دەچم بۆ قوتابخانە" },
      { english: ["I", "read", "a", "book"], kurdish: "کتێبێک دەخوێنمەوە" },
    ],
    fillBlanks: [
      { parts: ["My", "is nice"], hint: "مامۆستاکەم باشە", answer: "teacher", wrongs: ["dog", "cat", "car"] },
      { parts: ["We", "English at school"], hint: "لە قوتابخانە فێری ئینگلیزی دەبین", answer: "learn", wrongs: ["eat", "sleep", "jump"] },
    ],
    conversations: [
      {
        situation: "لە قوتابخانەیت و مامۆستاکەت دێتە ژوورەوە",
        theyAsk: "Good morning class!",
        correct: "Good morning teacher!",
        wrong1: "I read a book.",
        wrong2: "School is fun.",
        wrong3: "Salutations educator.",
        explanation: "وەڵامێکی ڕێزدارانە: 'Good morning teacher!'",
      },
    ],
  },
  // Lesson 7: Helping at Home
  {
    topic: "Helping at Home", topicKu: "یارمەتیدان لە ماڵەوە",
    words: [
      { english: "Help", kurdish: "یارمەتیدان" },
      { english: "Clean", kurdish: "پاککردنەوە" },
      { english: "Room", kurdish: "ژوور" },
      { english: "Toy", kurdish: "یاری" },
      { english: "Box", kurdish: "سندوق" },
    ],
    voices: [
      { prompt: "بڵێ: یارمەتی دایکم دەدەم", target: "I help my mom.", targetKurdish: "یارمەتی دایکم دەدەم." },
      { prompt: "بڵێ: ژوورەکەم پاکدەکەمەوە", target: "I clean my room.", targetKurdish: "ژوورەکەم پاکدەکەمەوە." },
    ],
    sentences: [
      { english: ["I", "help", "my", "mom"], kurdish: "یارمەتی دایکم دەدەم" },
      { english: ["I", "clean", "my", "room"], kurdish: "ژوورەکەم پاکدەکەمەوە" },
    ],
    fillBlanks: [
      { parts: ["I put my", "in the box"], hint: "یارییەکانم دەخەمە سندوقەکەوە", answer: "toy", wrongs: ["dog", "cat", "apple"] },
      { parts: ["The toys go in the", ""], hint: "یارییەکان دەچنە سندوقەکەوە", answer: "box", wrongs: ["sky", "tree", "sun"] },
    ],
    conversations: [
      {
        situation: "دایکت دەپرسێت ئایا یارمەتیم دەدەیت",
        theyAsk: "Can you help me clean the room?",
        correct: "Yes, I can help!",
        wrong1: "I have a toy.",
        wrong2: "The box is empty.",
        wrong3: "I shall assist in organizing.",
        explanation: "بڵێ: 'Yes, I can help!'",
      },
    ],
  },
  // Lesson 8: Evening Routine
  {
    topic: "Evening Routine", topicKu: "ڕووتینی ئێوارە",
    words: [
      { english: "Evening", kurdish: "ئێوارە" },
      { english: "Dinner", kurdish: "نانی ئێوارە" },
      { english: "Family", kurdish: "خێزان" },
      { english: "Watch", kurdish: "سەیرکردن" },
      { english: "TV", kurdish: "تەلەفزیۆن" },
    ],
    voices: [
      { prompt: "بڵێ: نانی ئێوارە دەخۆین", target: "We eat dinner.", targetKurdish: "نانی ئێوارە دەخۆین." },
      { prompt: "بڵێ: سەیری تەلەفزیۆن دەکەین", target: "We watch TV.", targetKurdish: "سەیری تەلەفزیۆن دەکەین." },
    ],
    sentences: [
      { english: ["We", "eat", "dinner"], kurdish: "نانی ئێوارە دەخۆین" },
      { english: ["We", "watch", "TV"], kurdish: "سەیری تەلەفزیۆن دەکەین" },
    ],
    fillBlanks: [
      { parts: ["I am with my", ""], hint: "لەگەڵ خێزانەکەمم", answer: "family", wrongs: ["school", "teacher", "car"] },
      { parts: ["In the", "we eat dinner"], hint: "لە ئێوارەدا نانی ئێوارە دەخۆین", answer: "evening", wrongs: ["morning", "sky", "tree"] },
    ],
    conversations: [
      {
        situation: "باوکت دەپرسێت چیت دەوێت سەیری بکەیت",
        theyAsk: "What do you want to watch on TV?",
        correct: "I want to watch cartoons!",
        wrong1: "I watch TV.",
        wrong2: "Dinner is ready.",
        wrong3: "I desire to observe animation.",
        explanation: "بڵێ: 'I want to watch cartoons!'",
      },
    ],
  },
  // Lesson 9: Good Night
  {
    topic: "Good Night", topicKu: "شەوباش",
    words: [
      { english: "Night", kurdish: "شەو" },
      { english: "Bed", kurdish: "جێگا" },
      { english: "Sleep", kurdish: "خەوتن" },
      { english: "Tired", kurdish: "ماندوو" },
      { english: "Dream", kurdish: "خەون" },
    ],
    voices: [
      { prompt: "بڵێ: من ماندووم", target: "I am tired.", targetKurdish: "من ماندووم." },
      { prompt: "بڵێ: دەچم بۆ جێگاکەم", target: "I go to bed.", targetKurdish: "دەچم بۆ جێگاکەم." },
    ],
    sentences: [
      { english: ["I", "am", "tired"], kurdish: "من ماندووم" },
      { english: ["I", "go", "to", "bed"], kurdish: "دەچم بۆ جێگاکەم" },
    ],
    fillBlanks: [
      { parts: ["I want to", "now"], hint: "دەمەوێت ئێستا بخەوم", answer: "sleep", wrongs: ["run", "play", "eat"] },
      { parts: ["Have a good", ""], hint: "خەونێکی خۆش ببینیت", answer: "dream", wrongs: ["night", "car", "apple"] },
    ],
    conversations: [
      {
        situation: "کاتی خەوتنە و دایکت دەڵێت",
        theyAsk: "Good night! Sleep well.",
        correct: "Good night mom!",
        wrong1: "I am tired.",
        wrong2: "I go to bed.",
        wrong3: "Pleasant dreams.",
        explanation: "وەڵام بدەوە: 'Good night mom!'",
      },
    ],
  },
];

export default kidsUnit3;
