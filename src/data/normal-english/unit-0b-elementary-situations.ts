import { UnitBank } from "../types";

// ── Unit 0B: Elementary Situations — 10 unique A2 lessons ──────────────────────────
// Simple, structured daily vocabulary and activities for elementary learners.

const normalUnit0B: UnitBank = [

  // Lesson 0: Daily Routines
  {
    topic: "Daily Routines", topicKu: "چالاکییەکانی ڕۆژانە", topicAr: "الروتين اليومي",
    words: [
      { english: "Wake up", kurdish: "بەخەبەر هاتن / هەستان لە خەو", arabic: "اكعد من النوم" },
      { english: "Brush teeth", kurdish: "شوشتنی ددانەکان", arabic: "اغسل سنوني" },
      { english: "Breakfast", kurdish: "نانی بەیانی", arabic: "رياك" },
      { english: "Go to school", kurdish: "چوون بۆ قوتابخانە", arabic: "اروح للمدرسة" },
      { english: "Do homework", kurdish: "ئەنجامدانی ئەرکی ماڵەوە", arabic: "اكتب الواجب" },
    ],
    voices: [
      { prompt: "بڵێ: من بەیانیان زوو لە خەو هەڵدەستم", target: "I wake up early in the morning.", targetKurdish: "من بەیانیان زوو لە خەو هەڵدەستم.", promptAr: "قول اكعد من الوكت الصبح", targetArabic: "اني اكعد من الوكت الصبح." },
      { prompt: "بڵێ: من نانی بەیانی دەخۆم", target: "I eat breakfast.", targetKurdish: "من نانی بەیانی دەخۆم.", promptAr: "قول اتسوق رياك", targetArabic: "اني اكل رياك." },
    ],
    sentences: [
      { english: ["I", "brush", "my", "teeth", "daily"], kurdish: "هەموو ڕۆژێک ددانەکانم دەشۆم", arabic: "اغسل سنوني كل يوم" },
      { english: ["I", "go", "to", "school", "at", "eight"], kurdish: "سەعات هەشت دەچم بۆ قوتابخانە", arabic: "اروح للمدرسة ساعه ثمانية" },
    ],
    fillBlanks: [
      { parts: ["I", "up at seven o'clock."], hint: "سەعات حەوت لە خەو هەڵدەستم", answer: "wake", wrongs: ["go", "do", "brush"], arabicHint: "اكعد ساعه سبعة", arabicParts: ["", "ساعه سبعة."], arabicAnswer: "اكعد", arabicWrongs: ["اروح", "اكتب", "اغسل"] },
      { parts: ["I do my", "in the evening."], hint: "ئێواران ئەرکی ماڵەوەم دەکەم", answer: "homework", wrongs: ["breakfast", "teeth", "school"], arabicHint: "اكتب واجبي بالعصر", arabicParts: ["اكتب", "بالعصر."], arabicAnswer: "واجبي", arabicWrongs: ["رياك", "سنوني", "مدرستي"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ هاوڕێیەک لەسەر کاتی خەبەرهاتن", theyAsk: "What time do you wake up?", correct: "I wake up at six o'clock.", wrong1: "I go to school.", wrong2: "Breakfast is good.", wrong3: "I brush my teeth.", explanation: "کاتێک پرسیاری کات دەکرێت، بە دەربڕینی کات وەک 'at six o'clock' وەڵام دەدەیتەوە.", situationAr: "الكلام مع صديق عن وقت الاستيقاظ", explanationAr: "عند السؤال عن الوقت، تجيب بذكر الساعة.", theyAskAr: "يا ساعه تكعد؟", correctAr: "اكعد ساعه ستة.", wrong1Ar: "اروح للمدرسة.", wrong2Ar: "الرياك طيب.", wrong3Ar: "اغسل سنوني." },
    ],
  },

  // Lesson 1: Weather & Clothes
  {
    topic: "Weather & Clothes", topicKu: "کەشوهەوا و جلوبەرگ", topicAr: "الطقس والملابس",
    words: [
      { english: "Sunny", kurdish: "خۆرهەتاو", arabic: "شمس" },
      { english: "Raining", kurdish: "باراناوی", arabic: "دا تمطر" },
      { english: "Cold", kurdish: "سارد", arabic: "بارد" },
      { english: "Coat", kurdish: "پاڵتۆ", arabic: "قمصلة" },
      { english: "T-shirt", kurdish: "تیشێرت", arabic: "تيشيرت" },
    ],
    voices: [
      { prompt: "بڵێ: ئەمڕۆ باران دەبارێت، پاڵتۆکەت لەبەر بکە", target: "It is raining today, wear your coat.", targetKurdish: "ئەمڕۆ باران دەبارێت، پاڵتۆکەت لەبەر بکە.", promptAr: "قول اليوم تمطر البس قمصلتك", targetArabic: "اليوم تمطر، البس قمصلتك." },
      { prompt: "بڵێ: کەشەکە گەرم و خۆرهەتاوە", target: "It is hot and sunny.", targetKurdish: "کەشەکە گەرم و خۆرهەتاوە.", promptAr: "قول الجو حار وشمس", targetArabic: "الجو حار وشمس." },
    ],
    sentences: [
      { english: ["Wear", "a", "coat", "it", "is", "cold"], kurdish: "پاڵتۆیەکی لەبەر بکە، ساردە", arabic: "البس قمصلة الجو بارد" },
      { english: ["I", "like", "sunny", "days"], kurdish: "حەزم لە ڕۆژانی خۆرهەتاوە", arabic: "احب الايام المشمسة" },
    ],
    fillBlanks: [
      { parts: ["Put on your", ", it is cold."], hint: "پاڵتۆکەت لەبەر بکە، ساردە", answer: "coat", wrongs: ["T-shirt", "sunny", "raining"], arabicHint: "البس قمصلتك الجو بارد", arabicParts: ["البس", "، الجو بارد."], arabicAnswer: "قمصلتك", arabicWrongs: ["تيشيرتك", "شمس", "تمطر"] },
      { parts: ["It is", "today. I need an umbrella."], hint: "ئەمڕۆ باراناوییە. پێویستم بە چەترێکە", answer: "raining", wrongs: ["sunny", "cold", "coat"], arabicHint: "تمطر اليوم. اريد شمسية", arabicParts: ["", "اليوم. اريد شمسية."], arabicAnswer: "تمطر", arabicWrongs: ["شمس", "بارد", "قمصلة"] },
    ],
    conversations: [
      { situation: "ڕاوێژکردن لەگەڵ هاوڕێیەک لەسەر جلوبەرگ پێش چوونە دەرەوە", theyAsk: "How is the weather outside?", correct: "It is cold, you need a coat.", wrong1: "I wear a T-shirt.", wrong2: "Sunny days are good.", wrong3: "I have five coats.", explanation: "کاتێک دەڵێن بارانە یان ساردە، ئامۆژگاریی لەبەرکردنی پاڵتۆ دەدەیت.", situationAr: "الاستشارة مع صديق عن الملابس قبل الخروج", explanationAr: "عندما يكون الجو بارداً، تنصح بلبس قمصلة.", theyAskAr: "شلون الجو برة؟", correctAr: "بارد، تحتاج قمصلة.", wrong1Ar: "البس تيشيرت.", wrong2Ar: "الايام المشمسة حلوة.", wrong3Ar: "عندي خمس قماصل." },
    ],
  },

  // Lesson 2: Hobbies & Free Time
  {
    topic: "Hobbies & Free Time", topicKu: "خولیایی و کاتی بەتاڵ", topicAr: "الهوايات ووقت الفراغ",
    words: [
      { english: "Play football", kurdish: "تۆپی پێ یاریکردن", arabic: "العب طوبة" },
      { english: "Watch TV", kurdish: "سەیرکردنی تەلەفزیۆن", arabic: "اشوف تلفزيون" },
      { english: "Listen to music", kurdish: "گوێگرتن لە مۆسیقا", arabic: "اسمع اغاني" },
      { english: "Play games", kurdish: "یاری کردن (کۆمپیوتەر/مۆبایل)", arabic: "العب العاب" },
      { english: "Draw", kurdish: "وێنەکێشان", arabic: "ارسم" },
    ],
    voices: [
      { prompt: "بڵێ: من حەزم لە یاریکردنی تۆپی پێیە", target: "I like to play football.", targetKurdish: "من حەزم لە یاریکردنی تۆپی پێیە.", promptAr: "قول احب العب طوبة", targetArabic: "احب العب طوبة." },
      { prompt: "بڵێ: خوشکەکەم گوێ لە مۆسیقا دەگرێت", target: "My sister listens to music.", targetKurdish: "خوشکەکەم گوێ لە مۆسیقا دەگرێت.", promptAr: "قول اختي تسمع اغاني", targetArabic: "اختي تسمع اغاني." },
    ],
    sentences: [
      { english: ["We", "play", "games", "on", "weekends"], kurdish: "کۆتایی هەفتە یاری دەکەین", arabic: "نلعب العاب بعطلة نهاية الاسبوع" },
      { english: ["I", "want", "to", "draw", "a", "picture"], kurdish: "دەمهەوێت وێنەیەک بکێشم", arabic: "اريد ارسم صورة" },
    ],
    fillBlanks: [
      { parts: ["I like to", "music."], hint: "حەزم لە گوێگرتنە لە مۆسیقا", answer: "listen to", wrongs: ["play", "watch", "draw"], arabicHint: "احب اسمع اغاني", arabicParts: ["احب", "اغاني."], arabicAnswer: "اسمع", arabicWrongs: ["العب", "اشوف", "ارسم"] },
      { parts: ["Do you want to", "football?"], hint: "دەتەوێت تۆپی پێ یاری بکەین؟", answer: "play", wrongs: ["watch", "read", "sleep"], arabicHint: "تريد نلعب طوبة؟", arabicParts: ["تريد", "طوبة؟"], arabicAnswer: "نلعب", arabicWrongs: ["نشوف", "نقرا", "ننام"] },
    ],
    conversations: [
      { situation: "پلاندانان بۆ چالاکییەکی کاتی بەتاڵ", theyAsk: "What do you want to do today?", correct: "I want to play football with friends.", wrong1: "I listen to music.", wrong2: "I am fine.", wrong3: "My sister draws.", explanation: "کاتێک پرسیاری ویست دەکرێت بۆ کاتی بەتاڵ، بە 'I want to...' وەڵام دەدەرێتەوە.", situationAr: "التخطيط لنشاط في وقت الفراغ", explanationAr: "عند السؤال عما تريد فعله، تجيب بـ 'اريد العب طوبة'.", theyAskAr: "شنو تريد نسوي اليوم؟", correctAr: "اريد العب طوبة وية ربعي.", wrong1Ar: "اسمع اغاني.", wrong2Ar: "اني زين.", wrong3Ar: "اختي ترسم." },
    ],
  },

  // Lesson 3: Animals & Pets
  {
    topic: "Animals & Pets", topicKu: "ئاژەڵان و ئاژەڵی ماڵی", topicAr: "الحيوانات والأليفة",
    words: [
      { english: "Dog", kurdish: "سەگ", arabic: "چلب" },
      { english: "Cat", kurdish: "پشیلە", arabic: "بزونة" },
      { english: "Horse", kurdish: "ئەسپ", arabic: "حصان" },
      { english: "Bird", kurdish: "باڵندە / مەل", arabic: "طير" },
      { english: "Fish", kurdish: "ماسی", arabic: "سمچة" },
    ],
    voices: [
      { prompt: "بڵێ: ئەمە پشیلەیەکی جوانە", target: "This is a beautiful cat.", targetKurdish: "ئەمە پشیلەیەکی جوانە.", promptAr: "قول هاي خوش بزونة", targetArabic: "هاي خوش بزونة." },
      { prompt: "بڵێ: ماسییەکە لە ئاودا مەلە دەکات", target: "The fish swims in the water.", targetKurdish: "ماسییەکە لە ئاودا مەلە دەکات.", promptAr: "قول السمچة تسبح بالمي", targetArabic: "السمچة تسبح بالمي." },
    ],
    sentences: [
      { english: ["My", "dog", "can", "run", "fast"], kurdish: "سەگەکەم دەتوانێت زۆر خێرا ڕابکات", arabic: "چلب مالتي يركض سريع" },
      { english: ["I", "see", "a", "bird", "in", "the", "tree"], kurdish: "باڵندەیەک لەسەر دارەکە دەبینم", arabic: "دا اشوف طير بالشجرة" },
    ],
    fillBlanks: [
      { parts: ["A", "can fly in the sky."], hint: "باڵندە دەتوانێت بفڕێت لە ئاسماندا", answer: "bird", wrongs: ["cat", "fish", "dog"], arabicHint: "الطير يطير بالسما", arabicParts: ["", "يطير بالسما."], arabicAnswer: "الطير", arabicWrongs: ["البزونة", "السمچة", "الچلب"] },
      { parts: ["He rides a", "."], hint: "ئەو سواری ئەسپ دەبێت", answer: "horse", wrongs: ["dog", "fish", "cat"], arabicHint: "هو يركب حصان", arabicParts: ["هو يركب", "."], arabicAnswer: "حصان", arabicWrongs: ["چلب", "سمچة", "بزونة"] },
    ],
    conversations: [
      { situation: "ناساندنی ئاژەڵە ماڵییەکەت بە هاوڕێیەک", theyAsk: "What pet do you have?", correct: "I have a small cat. Her name is Lulu.", wrong1: "A fish swims.", wrong2: "I like horses.", wrong3: "This is a bird.", explanation: "بۆ ناساندنی ئاژەڵی ماڵی، دەڵێیت پشیلەم هەیە و ناوی دەهێنیت.", situationAr: "تعريف صديقك بحيوانك الأليف", explanationAr: "لتعريف صديقك بحيوانك الأليف، تذكر نوعه واسمه.", theyAskAr: "يا حيوان اليف عندك؟", correctAr: "عندي بزونة صغيرة. اسمها لولو.", wrong1Ar: "السمچة تسبح.", wrong2Ar: "احب الحصونة.", wrong3Ar: "هذا طير." },
    ],
  },

  // Lesson 4: Body & Feelings
  {
    topic: "Body & Feelings", topicKu: "لۆش و هەستەکان", topicAr: "الجسم والمشاعر",
    words: [
      { english: "Head", kurdish: "سەر", arabic: "راس" },
      { english: "Hand", kurdish: "دەست", arabic: "ايد" },
      { english: "Foot", kurdish: "پێ", arabic: "رجل" },
      { english: "Hungry", kurdish: "برسی", arabic: "جوعان" },
      { english: "Tired", kurdish: "ماندوو", arabic: "تعبان" },
    ],
    voices: [
      { prompt: "بڵێ: سەرم دێشێت و زۆر ماندووم", target: "My head hurts and I am very tired.", targetKurdish: "سەرم دێشێت و زۆر ماندووم.", promptAr: "قول راسي ياذيني وكلش تعبان", targetArabic: "راسي ياذيني وكلش تعبان." },
      { prompt: "بڵێ: من برسی نیم، بەڵام تینوومە", target: "I am not hungry, but I am thirsty.", targetKurdish: "من برسی نیم، بەڵام تینوومە.", promptAr: "قول اني ما جوعان بس عطشان", targetArabic: "اني ما جوعان بس عطشان." },
    ],
    sentences: [
      { english: ["Wash", "your", "hands", "before", "eating"], kurdish: "دەستەکانت بشۆ پێش نان خواردن", arabic: "اغسل ايدك قبل الاكل" },
      { english: ["I", "feel", "tired", "after", "work"], kurdish: "دوای ئیش ماندووم", arabic: "احس بتعب ورا الشغل" },
    ],
    fillBlanks: [
      { parts: ["I am", ", I want pizza."], hint: "من برسیومە، پیتزام دەوێت", answer: "hungry", wrongs: ["tired", "head", "hand"], arabicHint: "اني جوعان اريد بيتزا", arabicParts: ["اني", "اريد بيتزا."], arabicAnswer: "جوعان", arabicWrongs: ["تعبان", "راس", "ايد"] },
      { parts: ["My left", "hurts."], hint: "دەستی چەپم دێشێت", answer: "hand", wrongs: ["foot", "hungry", "tired"], arabicHint: "ايدي اليسرى تاذيني", arabicParts: ["", "اليسرى تاذيني."], arabicAnswer: "ايدي", arabicWrongs: ["رجلي", "جوعان", "تعبان"] },
    ],
    conversations: [
      { situation: "پێگەیاندنی هەستەکانت بە هاوڕێیەک لە کاتی کاردا", theyAsk: "Are you okay?", correct: "No, I am very tired. My head hurts.", wrong1: "Yes, I am hungry.", wrong2: "Wash your hands.", wrong3: "I have two feet.", explanation: "ئەگەر باش نەبوویت، هۆکارەکەی دەڵێیت: ماندووم و سەرم دێشێت.", situationAr: "إخبار صديق بمشاعرك أثناء العمل", explanationAr: "إذا لم تكن بخير، تذكر السبب: تعبان وراسي ياذيني.", theyAskAr: "انت زين؟", correctAr: "لا، كلش تعبان وراسي ياذيني.", wrong1Ar: "اي، اني جوعان.", wrong2Ar: "اغسل ايدك.", wrong3Ar: "عندي رجلين." },
    ],
  },

  // Lesson 5: Food & Drinks
  {
    topic: "Food & Drinks", topicKu: "خواردن و خواردنەوەکان", topicAr: "الطعام والشراب",
    words: [
      { english: "Pizza", kurdish: "پیتزا", arabic: "بيتزا" },
      { english: "Apple", kurdish: "سێو", arabic: "تفاحة" },
      { english: "Tea", kurdish: "چای", arabic: "چاي" },
      { english: "Milk", kurdish: "شیر", arabic: "حليب" },
      { english: "Bread", kurdish: "نان", arabic: "خبز" },
    ],
    voices: [
      { prompt: "بڵێ: من حەزم لە چایە بە نانەوە", target: "I like tea with bread.", targetKurdish: "حەزم لە چایە بە نانەوە.", promptAr: "قول احب الچاي وية الخبز", targetArabic: "احب الچاي وية الخبز." },
      { prompt: "بڵێ: سێوێکی سوور و پەرداخێک شیر", target: "A red apple and a glass of milk.", targetKurdish: "سێوێکی سوور و پەرداخێک شیر.", promptAr: "قول تفاحة حمرة وكلاص حليب", targetArabic: "تفاحة حمرة وكلاص حليب." },
    ],
    sentences: [
      { english: ["I", "eat", "pizza", "for", "dinner"], kurdish: "بۆ نانی ئێوارە پیتزا دەخۆم", arabic: "اكل بيتزا على العشا" },
      { english: ["Drink", "milk", "for", "good", "health"], kurdish: "بۆ تەندروستی باش شیر بخۆوە", arabic: "اشرب حليب للصحة الزينة" },
    ],
    fillBlanks: [
      { parts: ["I want to drink warm", "."], hint: "دەمهەوێت چایەکی گەرم بخۆمەوە", answer: "tea", wrongs: ["apple", "bread", "pizza"], arabicHint: "اريد اشرب چاي حار", arabicParts: ["اريد اشرب", "حار."], arabicAnswer: "چاي", arabicWrongs: ["تفاحة", "خبز", "بيتزا"] },
      { parts: ["This", "is fresh."], hint: "ئەم نانە تازەیە", answer: "bread", wrongs: ["milk", "apple", "tea"], arabicHint: "هذا الخبز حار", arabicParts: ["هذا", "حار."], arabicAnswer: "الخبز", arabicWrongs: ["الحليب", "التفاح", "الچاي"] },
    ],
    conversations: [
      { situation: "داواکردنی خواردن لە ماڵی هاوڕێیەک", theyAsk: "What do you want to eat?", correct: "I want to eat pizza, please.", wrong1: "I drink milk.", wrong2: "An apple is red.", wrong3: "I like tea.", explanation: "کاتێک دەپرسن چی دەخۆیت، بە شێوازی 'I want to eat... please' داوا دەکەیت.", situationAr: "طلب طعام في بيت صديقك", explanationAr: "عند السؤال ماذا تأكل، تطلب بأسلوب مهذب: اريد اكل بيتزا فدوة.", theyAskAr: "شنو تريد تاكل؟", correctAr: "اريد اكل بيتزا فدوة.", wrong1Ar: "اشرب حليب.", wrong2Ar: "التفاحة حمرة.", wrong3Ar: "احب الچاي." },
    ],
  },

  // Lesson 6: School & Classroom
  {
    topic: "School & Classroom", topicKu: "قوتابخانە و پۆل", topicAr: "المدرسة والصف",
    words: [
      { english: "Teacher", kurdish: "مامۆستا", arabic: "معلم" },
      { english: "Student", kurdish: "قوتابی", arabic: "طالب" },
      { english: "Classroom", kurdish: "پۆل", arabic: "صف" },
      { english: "Book", kurdish: "کتێب", arabic: "كتاب" },
      { english: "Pencil", kurdish: "پێنووس (قەڵەم ڕەساس)", arabic: "قلم رصاص" },
    ],
    voices: [
      { prompt: "بڵێ: مامۆستاکە لە ناو پۆلدایە", target: "The teacher is in the classroom.", targetKurdish: "مامۆستاکە لە ناو پۆلدایە.", promptAr: "قول المعلم بالصف", targetArabic: "المعلم بالصف." },
      { prompt: "بڵێ: من پێنووس و کتێبم هەیە", target: "I have a pencil and a book.", targetKurdish: "من پێنووس و کتێبم هەیە.", promptAr: "قول عندي قلم رصاص وكتاب", targetArabic: "عندي قلم رصاص وكتاب." },
    ],
    sentences: [
      { english: ["The", "students", "are", "reading", "books"], kurdish: "قوتابییەکان کتێب دەخوێننەوە", arabic: "الطلاب دا يقرون كتب" },
      { english: ["Where", "is", "my", "pencil"], kurdish: "قەڵەمەکەم لەکوێیە؟", arabic: "وين قلمي الرصاص؟" },
    ],
    fillBlanks: [
      { parts: ["The", "writes on the board."], hint: "مامۆستاکە لەسەر تەختەکە دەنووسێت", answer: "teacher", wrongs: ["student", "pencil", "classroom"], arabicHint: "المعلم يكتب على السبورة", arabicParts: ["", "يكتب على السبورة."], arabicAnswer: "المعلم", arabicWrongs: ["الطالب", "القلم", "الصف"] },
      { parts: ["This is a large", "."], hint: "ئەمە پۆلێکی گەورەیە", answer: "classroom", wrongs: ["book", "pencil", "student"], arabicHint: "هذا الصف چبير", arabicParts: ["هذا", "چبير."], arabicAnswer: "الصف", arabicWrongs: ["كتاب", "قلم", "طالب"] },
    ],
    conversations: [
      { situation: "قوتابییەک لە هاوپۆلەکەی دەپرسێت بۆ قەڵەم", theyAsk: "Can I borrow your pencil?", correct: "Yes, here is my pencil.", wrong1: "The classroom is big.", wrong2: "No, I am a teacher.", wrong3: "I have a book.", explanation: "کاتێک داوای قەڵەم دەکەن، دەڵێیت فەرموو قەڵەمەکەم: 'Yes, here is my pencil.'", situationAr: "طالب يسأل زميله عن قلم رصاص", explanationAr: "عند طلب القلم، تقول تفضل القلم: اي تفضل قلمي.", theyAskAr: "داينطيني قلمك الرصاص فدوة؟", correctAr: "اي، تفضل هذا قلمي.", wrong1Ar: "الصف چبير.", wrong2Ar: "لا، اني معلم.", wrong3Ar: "عندي كتاب." },
    ],
  },

  // Lesson 7: Telling Time & Seasons
  {
    topic: "Time & Seasons", topicKu: "کات و وەرزەکان", topicAr: "الوقت والفصول",
    words: [
      { english: "Clock", kurdish: "کاتژمێر (دیوار)", arabic: "ساعة" },
      { english: "Time", kurdish: "کات", arabic: "وكت" },
      { english: "Summer", kurdish: "هاوین", arabic: "صيف" },
      { english: "Winter", kurdish: "زستان", arabic: "شتا" },
      { english: "Morning", kurdish: "بەیانی", arabic: "صبح" },
    ],
    voices: [
      { prompt: "بڵێ: لە هاویندا کەشەکە زۆر گەرمە", target: "In summer, the weather is very hot.", targetKurdish: "لە هاویندا کەشەکە زۆر گەرمە.", promptAr: "قول بالصيف الجو كلش حار", targetArabic: "بالصيف الجو كلش حار." },
      { prompt: "بڵێ: لە زستاندا بەفر دەبارێت", target: "In winter, it snows.", targetKurdish: "لە زستاندا بەفر دەبارێت.", promptAr: "قول بالشتا تثلج", targetArabic: "بالشتا تثلج." },
    ],
    sentences: [
      { english: ["What", "time", "is", "it", "now"], kurdish: "ئێستا سەعات چەندە؟", arabic: "يا ساعه هسة؟" },
      { english: ["I", "study", "in", "the", "morning"], kurdish: "بەیانیان دەخوێنم", arabic: "اقرا الصبح" },
    ],
    fillBlanks: [
      { parts: ["Look at the", "to see the time."], hint: "سەیری سەعاتەکە بکە بۆ زانینی کاتەکە", answer: "clock", wrongs: ["summer", "winter", "morning"], arabicHint: "باوع على الساعة حتى تشوف الوكت", arabicParts: ["باوع على", "حتى تشوف الوكت."], arabicAnswer: "الساعة", arabicWrongs: ["الصيف", "الشتا", "الصبح"] },
      { parts: ["We go to the beach in", "."], hint: "لە هاویندا دەچین بۆ کەنار دەریا", answer: "summer", wrongs: ["winter", "morning", "clock"], arabicHint: "نروح للبحر بالصيف", arabicParts: ["نروح للبحر", "."], arabicAnswer: "بالصيف", arabicWrongs: ["بالشتا", "الصبح", "الساعة"] },
    ],
    conversations: [
      { situation: "هاوڕێیەک لە شەقامەکەدا کاتت لێ دەپرسێت", theyAsk: "Do you know the time?", correct: "Yes, it is three o'clock.", wrong1: "It is winter.", wrong2: "Morning is cold.", wrong3: "I see a clock.", explanation: "بۆ وەڵامدانەوەی کاتەکە، کاتژمێری دیاریکراو دەڵێیت.", situationAr: "صديق يسألك عن الوقت في الشارع", explanationAr: "للإجابة عن الوقت، تذكر الساعة المحددة.", theyAskAr: "تعرف الساعة شگد؟", correctAr: "اي، هسة ساعة تلاثة.", wrong1Ar: "الجو شتا.", wrong2Ar: "الصبح بارد.", wrong3Ar: "اشوف ساعة." },
    ],
  },

  // Lesson 8: Transport & Vehicles
  {
    topic: "Transport", topicKu: "هۆکارەکانی گواستنەوە", topicAr: "المواصلات",
    words: [
      { english: "Car", kurdish: "ئۆتۆمبێل", arabic: "سيارة" },
      { english: "Bus", kurdish: "پاس", arabic: "باص" },
      { english: "Train", kurdish: "شەمەندەفەر", arabic: "قطار" },
      { english: "Bicycle", kurdish: "پایسکل", arabic: "بايسكل" },
      { english: "Plane", kurdish: "فڕۆکە", arabic: "طيارة" },
    ],
    voices: [
      { prompt: "بڵێ: من بە ئۆتۆمبێل دەچم بۆ سەر کار", target: "I go to work by car.", targetKurdish: "من بە ئۆتۆمبێل دەچم بۆ سەر کار.", promptAr: "قول اروح للشغل بالسيارة", targetArabic: "اروح للشغل بالسيارة." },
      { prompt: "بڵێ: باوکم پایسکلێکی نوێی کڕی", target: "My father bought a new bicycle.", targetKurdish: "باوکم پایسکلێکی نوێی کڕی.", promptAr: "قول ابويا اشترى بايسكل جديد", targetArabic: "ابويا اشترى بايسكل جديد." },
    ],
    sentences: [
      { english: ["The", "train", "arrives", "on", "time"], kurdish: "شەمەندەفەرەکە لە کاتی خۆیدا دەگات", arabic: "القطار يوصل بالوكت" },
      { english: ["We", "travel", "by", "plane"], kurdish: "بە فڕۆکە گەشت دەکەین", arabic: "نسافر بالطيارة" },
    ],
    fillBlanks: [
      { parts: ["I wait for the", "at the station."], hint: "لە وێستگەکە چاوەڕێی پاسەکە دەکەم", answer: "bus", wrongs: ["car", "bicycle", "plane"], arabicHint: "انتظر الباص بالمحطة", arabicParts: ["انتظر", "بالمحطة."], arabicAnswer: "الباص", arabicWrongs: ["السيارة", "البايسكل", "الطيارة"] },
      { parts: ["He drives a blue", "."], hint: "ئەو ئۆتۆمبێلێکی شین لێدەخوڕێت", answer: "car", wrongs: ["train", "plane", "bicycle"], arabicHint: "هو يسوق سيارة زركة", arabicParts: ["هو يسوق", "زركة."], arabicAnswer: "سيارة", arabicWrongs: ["قطار", "طيارة", "بايسكل"] },
    ],
    conversations: [
      { situation: "پرسیارکردن لە هاوڕێیەک لەسەر چۆنێتی سەفەرکردن بۆ قوتابخانە", theyAsk: "How do you go to school?", correct: "I go to school by bus.", wrong1: "I have a bicycle.", wrong2: "The plane is big.", wrong3: "I drive a car.", explanation: "کاتێک دەپرسن چۆن دەچیت، بە 'by bus' یان 'by car' وەڵام دەدەیتەوە.", situationAr: "سؤال صديق عن كيفية ذهابه للمدرسة", explanationAr: "عند السؤال كيف تذهب، تجيب بـ بالباص أو بالسيارة.", theyAskAr: "شلون تروح للمدرسة؟", correctAr: "اروح للمدرسة بالباص.", wrong1Ar: "عندي بايسكل.", wrong2Ar: "الطيارة چبيرة.", wrong3Ar: "يسوق سيارة." },
    ],
  },

  // Lesson 9: Rooms in a House
  {
    topic: "Rooms in a House", topicKu: "ژوورەکانی ناو ماڵ", topicAr: "غرف المنزل",
    words: [
      { english: "House", kurdish: "ماڵ / خانوو", arabic: "بيت" },
      { english: "Bedroom", kurdish: "ژووری نووستن", arabic: "غرفة نوم" },
      { english: "Kitchen", kurdish: "مەتبەخ / چێشتخانە", arabic: "مطبخ" },
      { english: "Bathroom", kurdish: "حەمام / ئاودەست", arabic: "حمام" },
      { english: "Garden", kurdish: "باخچە", arabic: "حديقة" },
    ],
    voices: [
      { prompt: "بڵێ: دایکم لە مەتبەخەکەدا خواردن دروست دەکات", target: "My mother is cooking in the kitchen.", targetKurdish: "دایکم لە مەتبەخەکەدا خواردن دروست دەکات.", promptAr: "قول امي تطبخ بالمطبخ", targetArabic: "امي تطبخ بالمطبخ." },
      { prompt: "بڵێ: باخچەکە پڕە لە گوڵی جوان", target: "The garden is full of beautiful flowers.", targetKurdish: "باخچەکە پڕە لە گوڵی جوان.", promptAr: "قول الحديقة متروسة ورد حلو", targetArabic: "الحديقة متروسة ورد حلو." },
    ],
    sentences: [
      { english: ["I", "sleep", "in", "my", "bedroom"], kurdish: "لە ژووری نووستنەکەم دەخەوم", arabic: "انام بغرفتي مال النوم" },
      { english: ["Where", "is", "the", "bathroom"], kurdish: "حەمامەکە لەکوێیە؟", arabic: "وين الحمام؟" },
    ],
    fillBlanks: [
      { parts: ["We cook food in the", "."], hint: "لە مەتبەخدا خواردن دروست دەکەین", answer: "kitchen", wrongs: ["bedroom", "bathroom", "garden"], arabicHint: "نطبخ الاكل بالمطبخ", arabicParts: ["نطبخ الاكل", "."], arabicAnswer: "بالمطبخ", arabicWrongs: ["بغرفة النوم", "بالحمام", "بالحديقة"] },
      { parts: ["The kids play in the", "."], hint: "مناڵەکان لە باخچەکەدا یاری دەکەن", answer: "garden", wrongs: ["kitchen", "bathroom", "bedroom"], arabicHint: "الجهال يلعبون بالحديقة", arabicParts: ["الجهال يلعبون", "."], arabicAnswer: "بالحديقة", arabicWrongs: ["بالمطبخ", "بالحمام", "بغرفة النوم"] },
    ],
    conversations: [
      { situation: "مێوانێک دەپرسێت لە شوێنی حەمامەکە", theyAsk: "Excuse me, where is the bathroom?", correct: "The bathroom is next to the bedroom.", wrong1: "I am in the kitchen.", wrong2: "The garden is beautiful.", wrong3: "I have a big house.", explanation: "بۆ نیشاندانی شوێنی حەمامەکە، ئاڕاستەی دەدەیت بە شێوازێکی سادە.", situationAr: "ضيف يسأل عن مكان الحمام", explanationAr: "لتوضيح مكان الحمام، تعطي اتجاهاً بسيطاً.", theyAskAr: "فدوة، وين الحمام؟", correctAr: "الحمام صاير بصف غرفة النوم.", wrong1Ar: "اني بالمطبخ.", wrong2Ar: "الحديقة حلوة.", wrong3Ar: "عندي بيت چبير." },
    ],
  },
];

export default normalUnit0B;
