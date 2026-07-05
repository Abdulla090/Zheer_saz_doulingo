import { UnitBank } from "../types";

// ── Unit 2: Elementary Situations — 10 lessons ──────────────────────────
// Structured daily vocabulary, routines, and simple situational phrases for elementary learners in conversational context.

const normalUnit0B: UnitBank = [
  // Lesson 0: Daily Routines
  {
    topic: "Daily Routines", topicKu: "چالاکییەکانی ڕۆژانە", topicAr: "الروتين اليومي",
    words: [
      { english: "Wake up", kurdish: "بەخەبەر هاتن / هەستان لە خەو", arabic: "الاستيقاظ من النوم" },
      { english: "Brush teeth", kurdish: "شوشتنی ددانەکان", arabic: "غسل الأسنان" },
      { english: "Eat breakfast", kurdish: "نانی بەیانی خواردن", arabic: "تناول الفطور" },
      { english: "Go to school", kurdish: "چوون بۆ قوتابخانە", arabic: "الذهاب إلى المدرسة" },
      { english: "Wash face", kurdish: "شوشتنی دەموچاو", arabic: "غسل الوجه" },
      { english: "Get dressed", kurdish: "جلوبەرگ لەبەرکردن", arabic: "ارتداء الملابس" },
      { english: "Eat dinner", kurdish: "شێو خواردن (نانی ئێوارە)", arabic: "تناول العشاء" },
      { english: "Go to sleep", kurdish: "چوون بۆ خەوتن", arabic: "الذهاب للنوم" },
    ],
    voices: [
      { prompt: "بڵێ بەیانیان زوو بەخەبەر دێیت", target: "I wake up early in the morning.", targetKurdish: "بەیانیان زوو لە خەو هەڵدەستم.", promptAr: "قل أنا أستيقظ باكراً صباحاً", targetArabic: "أنا أستيقظ باكراً في الصباح." },
      { prompt: "بڵێ ددانەکانت دەشۆیت", target: "I brush my teeth after breakfast.", targetKurdish: "دوای نانی بەیانی ددانەکانم دەشۆم.", promptAr: "قل أنا أغسل أسناني بعد الفطور", targetArabic: "أنا أغسل أسناني بعد تناول الفطور." },
      { prompt: "بڵێ کەی دەخەویت", target: "I go to sleep at ten o'clock.", targetKurdish: "کاتژمێر دە دەچم بۆ خەوتن.", promptAr: "قل أذهب للنوم في العاشرة", targetArabic: "أذهب للنوم في الساعة العاشرة." },
    ],
    sentences: [
      { english: ["First", "I", "wash", "my", "face", "and", "then", "I", "get", "dressed"], kurdish: "سەرەتا دەموچاوم دەشۆم و پاشان جل لەبەر دەکەم", arabic: "أولاً أغسل وجهي ثم أرتدي ملابسي" },
      { english: ["We", "eat", "breakfast", "together", "every", "morning"], kurdish: "ئێمە هەموو بەیانییەک پێکەوە نانی بەیانی دەخۆین", arabic: "نحن نتناول الفطور معاً كل صباح" },
      { english: ["Children", "must", "go", "to", "school", "to", "learn", "English"], kurdish: "منداڵەکان دەبێت بچن بۆ قوتابخانە بۆ فێربوونی ئینگلیزی", arabic: "يجب على الأطفال الذهاب إلى المدرسة لتعلم الإنجليزية" },
      { english: ["He", "likes", "to", "eat", "dinner", "with", "his", "family"], kurdish: "ئەو حەز دەکات لەگەڵ خێزانەکەی نانی ئێوارە بخوات", arabic: "هو يحب تناول العشاء مع عائلته" },
    ],
    fillBlanks: [
      { parts: ["I always wash my", "when I wake up."], hint: "من هەمیشە دەموچاوم دەشۆم کاتێک لە خەو هەڵدەستم.", answer: "face", wrongs: ["teeth", "dinner", "school"], arabicHint: "أنا دائماً أغسل وجهي عندما أستيقظ.", arabicParts: ["أنا دائماً أغسل", "عندما أستيقظ."], arabicAnswer: "وجهي", arabicWrongs: ["أسناني", "العشاء", "المدرسة"] },
      { parts: ["After work, I eat", "and go to sleep."], hint: "دوای کار، نانی ئێوارە دەخۆم و دەچم بۆ خەوتن.", answer: "dinner", wrongs: ["breakfast", "dressed", "teeth"], arabicHint: "بعد العمل، أتناول العشاء وأذهب للنوم.", arabicParts: ["بعد العمل، أتناول", "وأذهب للنوم."], arabicAnswer: "العشاء", arabicWrongs: ["الفطور", "الملابس", "الأسنان"] },
      { parts: ["I need to get", "before I go to work."], hint: "پێویستە جلوبەرگم لەبەر بکەم پێش ئەوەی بچم بۆ کار.", answer: "dressed", wrongs: ["asleep", "brushed", "washed"], arabicHint: "يجب أن أرتدي ملابسي قبل الذهاب للعمل.", arabicParts: ["يجب أن", "ملابسي قبل الذهاب للعمل."], arabicAnswer: "أرتدي", arabicWrongs: ["أن خواب", "أنظف", "أغسل"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی ڕۆتینی بەیانیان",
        theyAsk: "What is your morning routine?",
        correct: "First I wake up, wash my face, and then eat breakfast.",
        wrong1: "I go to sleep at ten.",
        wrong2: "Goodbye, nice to meet you.",
        wrong3: "I have three sisters and brothers.",
        explanation: "بۆ ڕۆتینی بەیانیان، کردارەکان بە پێی کات بنووسە: wake up, wash face, eat breakfast.",
        situationAr: "السؤال عن الروتين الصباحي",
        theyAskAr: "ما هو روتينك الصباحي؟",
        correctAr: "أولاً أستيقظ، أغسل وجهي، ثم أتناول الفطور.",
        wrong1Ar: "أذهب للنوم في العاشرة.",
        wrong2Ar: "مع السلامة، سررت بلقائك.",
        wrong3Ar: "لدي ثلاث أخوات وإخوة.",
        explanationAr: "للروتين الصباحي، نذكر الأفعال متسلسلة زمنياً."
      },
      {
        situation: "کاتێک هاوڕێیەک پێشنیازی شێو خواردن دەکات",
        theyAsk: "Are you ready to eat dinner now?",
        correct: "Yes, I am. I want to eat and then go to sleep.",
        wrong1: "No, I must wash school.",
        wrong2: "My name is John from the shop.",
        wrong3: "I brush my teeth before dinner.",
        explanation: "وەڵامێکی ئاسایی بۆ نانی ئێوارە (dinner) و چوون بۆ خەوتن (go to sleep) پاش کار.",
        situationAr: "عندما يعرض صديق تناول العشاء",
        theyAskAr: "هل أنت مستعد لتناول العشاء الآن؟",
        correctAr: "نعم، أنا مستعد. أريد أن آكل ثم أذهب للنوم.",
        wrong1Ar: "لا، يجب أن أغسل المدرسة.",
        wrong2Ar: "اسمي جون من الدكان.",
        wrong3Ar: "أنا أغسل أسناني قبل العشاء.",
        explanationAr: "رد طبيعي يربط العشاء بالاستعداد للنوم بعد يوم طويل."
      }
    ]
  },

  // Lesson 1: Weather & Seasons
  {
    topic: "Weather & Seasons", topicKu: "کەشوهەوا و وەرزەکان", topicAr: "الطقس والفصول",
    words: [
      { english: "Sunny day", kurdish: "ڕۆژی خۆرەتاو", arabic: "يوم مشمس" },
      { english: "Rainy weather", kurdish: "کەشوهەوای باراناوی", arabic: "طقس ممطر" },
      { english: "Cold winter", kurdish: "زستانی سارد", arabic: "شتاء بارد" },
      { english: "Hot summer", kurdish: "هاوینی گەرم", arabic: "صيف حار" },
      { english: "Cloudy sky", kurdish: "ئاسمانی هەوراوی", arabic: "سماء غائمة" },
      { english: "Windy evening", kurdish: "ئێوارەیەک کە با لێی بێت", arabic: "مساء عاصف (فيه رياح)" },
      { english: "Spring flowers", kurdish: "گوڵەکانی بەهار", arabic: "زهور الربيع" },
      { english: "Autumn leaves", kurdish: "گەڵاکانی پایز", arabic: "أوراق الخريف" },
    ],
    voices: [
      { prompt: "بڵێ ئەمڕۆ زۆر گەرمە", target: "It is very hot this summer.", targetKurdish: "ئەم هاوینە زۆر گەرمە.", promptAr: "قل الطقس حار جداً هذا الصيف", targetArabic: "الطقس حار جداً هذا الصيف." },
      { prompt: "بڵێ حەزت لە وەرزی بەهارە", target: "I love the beautiful flowers in spring.", targetKurdish: "ئەو گوڵە جوانەکانم لە بەهاردا خۆش دەوێت.", promptAr: "قل أنا أحب زهور الربيع", targetArabic: "أنا أحب الزهور الجميلة في الربيع." },
      { prompt: "باسی کەشوهەوای باراناوی بکە", target: "The weather forecast predicts a rainy day.", targetKurdish: "پێشبینی کەشوهەوا ڕۆژێکی باراناوی پێشبینی دەکات.", promptAr: "تحدث عن طقس ممطر", targetArabic: "توقعات الطقس تشير إلى يوم ممطر." },
    ],
    sentences: [
      { english: ["The", "leaves", "turn", "yellow", "in", "autumn"], kurdish: "گەڵاکان لە پایزدا زەرد دەبن", arabic: "أوراق الشجر تصفر في الخريف" },
      { english: ["We", "have", "a", "cloudy", "sky", "and", "cold", "wind", "today"], kurdish: "ئەمڕۆ ئاسمانێکی هەوراوی و بایەکی ساردمان هەیە", arabic: "لدينا سماء غائمة ورياح باردة اليوم" },
      { english: ["I", "prefer", "a", "sunny", "day", "over", "a", "rainy", "one"], kurdish: "ڕۆژێکی خۆرەتاوم پێ باشترە بەسەر باراناویدا", arabic: "أفضل يوماً مشمساً على اليوم الممطر" },
      { english: ["Winter", "in", "this", "city", "is", "always", "very", "cold"], kurdish: "زستان لەم شارەدا هەمیشە زۆر ساردە", arabic: "الشتاء في هذه المدينة بارد جداً دائماً" },
    ],
    fillBlanks: [
      { parts: ["I need an umbrella because it is a", "day."], hint: "پێویستم بە چەترێکە چونکە ڕۆژێکی باراناوییە.", answer: "rainy", wrongs: ["sunny", "hot", "dry"], arabicHint: "أحتاج إلى مظلة لأنه يوم ممطر.", arabicParts: ["أحتاج لمظلة لأنه يوم", "."], arabicAnswer: "ممطر", arabicWrongs: ["مشمس", "حار", "جاف"] },
      { parts: ["We go to the beach in the hot", "."], hint: "ئێمە دەچین بۆ کەنار دەریا لە هاوینی گەرمدا.", answer: "summer", wrongs: ["winter", "autumn", "spring"], arabicHint: "نذهب إلى الشاطئ في الصيف الحار.", arabicParts: ["نذهب للشاطئ في الصيف", "."], arabicAnswer: "الحار", arabicWrongs: ["الشتاء", "الخريف", "الربيع"] },
      { parts: ["The sky is", "; it might rain soon."], hint: "ئاسمانەکە هەوراوییە؛ لەوانەیە بەم زووانە باران ببارێت.", answer: "cloudy", wrongs: ["sunny", "blue", "clear"], arabicHint: "السماء غائمة؛ قد تمطر قريباً.", arabicParts: ["السماء", "؛ قد تمطر قريباً."], arabicAnswer: "غائمة", arabicWrongs: ["مشمسة", "زرقاء", "صافية"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی کەشوهەوا لە دەرەوە",
        theyAsk: "How is the weather outside?",
        correct: "It is a beautiful sunny day, but a bit windy.",
        wrong1: "I like hot summer in the kitchen.",
        wrong2: "Goodbye, see you in spring.",
        wrong3: "I have five rainy leaves.",
        explanation: "وەڵامی دروست وەسفی ڕاستەوخۆی کەشوهەوایە: 'sunny day... windy'.",
        situationAr: "السؤال عن الطقس بالخارج",
        theyAskAr: "كيف حال الطقس بالخارج؟",
        correctAr: "إنه يوم مشمس جميل، ولكن مع بعض الرياح.",
        wrong1Ar: "أنا أحب الصيف الحار في المطبخ.",
        wrong2Ar: "مع السلامة، أراك في الربيع.",
        wrong3Ar: "لدي خمسة أوراق ممطرة.",
        explanationAr: "الرد الصحيح يصف الطقس بالخارج بشكل مباشر."
      },
      {
        situation: "پلاندانان بۆ سەیران بەپێی کەشوهەوا",
        theyAsk: "Should we go to the park this evening?",
        correct: "No, the sky is cloudy and the weather forecast predicts a rainy evening.",
        wrong1: "Yes, winter is very cold.",
        wrong2: "I love autumn leaves on my bed.",
        wrong3: "Bread and water are in the shop.",
        explanation: "ئەگەر کەشوهەوا باراناوی بێت، باشترە بڕۆیتە ژوورەوە یان گەشتەکە دوا بخەیت.",
        situationAr: "التخطيط لنزهة حسب أحوال الجو",
        theyAskAr: "هل نذهب إلى الحديقة هذا المساء؟",
        correctAr: "لا، السماء غائمة وتوقعات الطقس تشير إلى مساء ممطر.",
        wrong1Ar: "نعم، الشتاء بارد جداً.",
        wrong2Ar: "أنا أحب أوراق الخريف على سريري.",
        wrong3Ar: "الخبز والماء في الدكان.",
        explanationAr: "في حالة توقع المطر، يفضل إلغاء النزهات الخارجية."
      }
    ]
  },

  // Lesson 2: House & Furniture
  {
    topic: "House & Furniture", topicKu: "ماڵ و مۆبیلیات", topicAr: "المنزل والأثاث",
    words: [
      { english: "Comfortable bed", kurdish: "جێگەی خەوتنی ئاسوودە (بێد)", arabic: "سرير مريح" },
      { english: "Wooden table", kurdish: "مێزی دارین", arabic: "طاولة خشبية" },
      { english: "Sit on the chair", kurdish: "دانیشتن لەسەر کورسی", arabic: "الجلوس على الكرسي" },
      { english: "Close the door", kurdish: "داخستنی دەرگاکە", arabic: "إغلاق الباب" },
      { english: "Open the window", kurdish: "کردنەوەی پەنجەرەکە", arabic: "فتح النافذة" },
      { english: "Kitchen cabinet", kurdish: "کابینەی چێشتخانە", arabic: "خزانة المطبخ" },
      { english: "Soft sofa", kurdish: "قەنەفەی نەرم (سۆفە)", arabic: "أريكة ناعمة (قنفة)" },
      { english: "House keys", kurdish: "کلیلی ماڵەوە", arabic: "مفاتيح المنزل" },
    ],
    voices: [
      { prompt: "داوا بکە پەنجەرەکە بکاتەوە", target: "Could you please open the window?", targetKurdish: "تکایە دەتوانیت پەنجەرەکە بکەیتەوە؟", promptAr: "اطلب فتح النافذة", targetArabic: "هل يمكنك فتح النافذة من فضلك؟" },
      { prompt: "بڵێ لەسەر قەنەفەکە دانیشتوویت", target: "I am sitting on the soft sofa in the room.", targetKurdish: "من لەسەر قەنەفە نەرمەکە لە ژوورەکەدا دانیشتووم.", promptAr: "قل أنك تجلس على الأريكة", targetArabic: "أنا أجلس على الأريكة الناعمة في الغرفة." },
      { prompt: "داوای داخستنی دەرگا بکە چونکە ساردە", target: "Please close the door; it is cold outside.", targetKurdish: "تکایە دەرگاکە دابخە؛ لە دەرەوە ساردە.", promptAr: "اطلب إغلاق الباب لأن الجو بارد", targetArabic: "من فضلك أغلق الباب؛ الجو بارد بالخارج." },
    ],
    sentences: [
      { english: ["We", "have", "a", "large", "wooden", "table", "in", "the", "kitchen"], kurdish: "مێزێکی گەورەی دارینمان لە چێشتخانەکەدا هەیە", arabic: "ميزيكي كوري دارينمان له تشيشتخانكه دا هه يه" },
      { english: ["Put", "your", "bag", "and", "keys", "on", "the", "chair", "please"], kurdish: "تکایە جانتا و کلیلەکانت بخەرە سەر کورسییەکە", arabic: "من فضلك ضع حقيبتك ومفاتيحك على الكرسي" },
      { english: ["My", "bedroom", "has", "a", "very", "comfortable", "bed"], kurdish: "ژووری خەوتنەکەم جێگەی خەوتنی زۆر ئاسوودەی تێدایە", arabic: "غرفة نومي تحتوي على سرير مريح جداً" },
      { english: ["He", "forgot", "his", "house", "keys", "on", "the", "table"], kurdish: "ئەو کلیلی ماڵەکەی خۆی لەسەر مێزەکە لەبیرچوو", arabic: "لقد نسي مفاتيح منزله على الطاولة" },
    ],
    fillBlanks: [
      { parts: ["Please sit on the", "; do not stand."], hint: "تکایە لەسەر کورسییەکە دانیشە؛ مەوەستە.", answer: "chair", wrongs: ["door", "window", "cabinet"], arabicHint: "من فضلك اجلس على الكرسي؛ لا تقف.", arabicParts: ["من فضلك اجلس على", "؛ لا تقف."], arabicAnswer: "الكرسي", arabicWrongs: ["الباب", "النافذة", "الخزانة"] },
      { parts: ["We bought a new", "for the living room."], hint: "قەنەفەیەکی نوێمان بۆ ژووری میوانەکە کڕی.", answer: "sofa", wrongs: ["bed", "kitchen", "keys"], arabicHint: "اشترينا أريكة جديدة لغرفة المعيشة.", arabicParts: ["اشترينا", "جديدة لغرفة المعيشة."], arabicAnswer: "أريكة", arabicWrongs: ["سرير", "المطبخ", "المفاتيح"] },
      { parts: ["Do not forget to lock the", "when you leave."], hint: "لەبیرت نەچێت دەرگاکە قفڵ بکەیت کاتێک دەڕۆیت.", answer: "door", wrongs: ["table", "window", "bed"], arabicHint: "لا تنس إغلاق الباب عند المغادرة.", arabicParts: ["لا تنس إغلاق", "عند المغادرة."], arabicAnswer: "الباب", arabicWrongs: ["الطاولة", "النافذة", "السرير"] },
    ],
    conversations: [
      {
        situation: "داواکاری لە هاوسەرەکەت بۆ دۆزینەوەی کلیل",
        theyAsk: "Where are my house keys? I need to go to work.",
        correct: "They are on the wooden table in the kitchen, next to your bag.",
        wrong1: "Close the door, it is cold.",
        wrong2: "I want to open the window.",
        wrong3: "I am sitting on a comfortable bed.",
        explanation: "وەڵامی شوێنی کلیلەکان بە ڕوونی ئاراستە دەکات بۆ سەر مێزەکە 'on the wooden table'.",
        situationAr: "طلب المساعدة من زوجتك للعثور على المفاتيح",
        theyAskAr: "أين مفاتيح منزلي؟ أحتاج للذهاب للعمل.",
        correctAr: "إنها على الطاولة الخشبية في المطبخ، بجانب حقيبتك.",
        wrong1Ar: "أغلق الباب، الجو بارد.",
        wrong2Ar: "أريد فتح النافذة.",
        wrong3Ar: "أنا أجلس على سرير مريح.",
        explanationAr: "تحديد مكان المفاتيح بشكل واضح على الطاولة الخشبية."
      },
      {
        situation: "پێشنیارکردنی ئاسوودەیی ژوور بە میوان",
        theyAsk: "I am very tired after the long journey.",
        correct: "Please go to the bedroom. There is a very comfortable bed for you.",
        wrong1: "Sit on the wooden table.",
        wrong2: "Close the kitchen cabinet.",
        wrong3: "I have a soft sofa in my bag.",
        explanation: "بۆ ماندووبوونی میوان، پێشنیارکردنی جێگەی خەوتن 'comfortable bed' زۆر جوانە.",
        situationAr: "عرض الراحة للضيف المتعب",
        theyAskAr: "أنا تعبان جداً بعد السفر الطويل.",
        correctAr: "تفضل بالذهاب لغرفة النوم. هناك سرير مريح جداً لك.",
        wrong1Ar: "اجلس على الطاولة الخشبية.",
        wrong2Ar: "أغلق خزانة المطبخ.",
        wrong3Ar: "لدي أريكة ناعمة في حقيبتي.",
        explanationAr: "للضيف المتعب، الاقتراح الأفضل هو تقديم سرير مريح (comfortable bed) للنوم."
      }
    ]
  },

  // Lesson 3: Transport & Travel
  {
    topic: "Transport & Travel", topicKu: "گواستنەوە و گەشتکردن", topicAr: "النقل والسفر",
    words: [
      { english: "Buy a ticket", kurdish: "کڕینی بلیت (تیکت)", arabic: "شراء تذكرة" },
      { english: "Bus station", kurdish: "وێستگەی پاس", arabic: "محطة الحافلات" },
      { english: "Drive a car", kurdish: "لێخوڕینی ئۆتۆمبێل", arabic: "قيادة سيارة" },
      { english: "Ride a bicycle", kurdish: "سواربوونی پاسکیل", arabic: "ركوب دراجة هوائية" },
      { english: "Walk to work", kurdish: "پیاسەکردن (بەپێ چوون) بۆ سەر کار", arabic: "المشي إلى العمل" },
      { english: "Train schedule", kurdish: "خشتەی شەمەندەفەر", arabic: "جدول القطارات" },
      { english: "Traffic jam", kurdish: "قەرەباڵغی هاتووچۆ (ترافیک)", arabic: "ازدحام مروري" },
      { english: "Public transport", kurdish: "گواستنەوەی گشتی", arabic: "النقل العام" },
    ],
    voices: [
      { prompt: "بڵێ بەپێ دەچیت بۆ سەر کار", target: "I prefer to walk to work instead of driving.", targetKurdish: "پێم باشترە بەپێ بچم بۆ سەر کار لەبری لێخوڕین.", promptAr: "قل أنا أفضل المشي للعمل", targetArabic: "أفضل المشي إلى العمل بدلاً من القيادة." },
      { prompt: "بڵێ پاسەکە درەنگ کەوت بەهۆی ترافیک", target: "The bus is late due to a traffic jam.", targetKurdish: "پاسەکە دواکەوت بەهۆی ترافیکی هاتووچۆوە.", promptAr: "قل الحافلة متأخرة بسبب الازدحام", targetArabic: "الحافلة متأخرة بسبب الازدحام المروري." },
      { prompt: "داوای کڕینی بلیت بکە", target: "Where can I buy a ticket for the train?", targetKurdish: "لەکوێ دەتوانم بلیتێک بۆ شەمەندەفەرەکە بکڕم؟", promptAr: "اسأل أين تشتري تذكرة القطار", targetArabic: "أين يمكنني شراء تذكرة للقطار؟" },
    ],
    sentences: [
      { english: ["We", "must", "check", "the", "train", "schedule", "before", "we", "leave"], kurdish: "پێویستە خشتەی شەمەندەفەرەکە بپشکنین پێش ئەوەی بڕۆین", arabic: "يجب أن نتحقق من جدول القطارات قبل المغادرة" },
      { english: ["Using", "public", "transport", "is", "good", "for", "the", "planet"], kurdish: "بەکارهێنانی گواستنەوەی گشتی بۆ هەسارەکە باشە", arabic: "استخدام النقل العام جيد للكوكب" },
      { english: ["He", "learned", "how", "to", "ride", "a", "bicycle", "last", "year"], kurdish: "ئەو ساڵی ڕابردوو فێربوو چۆن پاسکیل سوار بێت", arabic: "تعلم كيفية ركوب الدراجة الهوائية العام الماضي" },
      { english: ["Do", "you", "want", "to", "drive", "my", "car", "to", "the", "shop"], kurdish: "دەتەوێت ئۆتۆمبێلەکەم لێبخوڕیت بۆ دوکانەکە؟", arabic: "هل تريد قيادة سيارتي إلى المتجر؟" },
    ],
    fillBlanks: [
      { parts: ["I missed the train; I must wait at the", "."], hint: "شەمەندەفەرەکەم لەدەست چوو؛ دەبێت لە وێستگەکە چاوەڕێ بکەم.", answer: "station", wrongs: ["ticket", "jam", "car"], arabicHint: "فاتني القطار؛ يجب أن أنتظر في المحطة.", arabicParts: ["فاتني القطار؛ يجب أن أنتظر في", "."], arabicAnswer: "المحطة", arabicWrongs: ["التذكرة", "الازدحام", "السيارة"] },
      { parts: ["We were stuck in a", "for two hours."], hint: "بۆ ماوەی دوو کاتژمێر لە قەرەباڵغی هاتووچۆدا گیرمان خوارد.", answer: "traffic jam", wrongs: ["public transport", "train schedule", "bicycle"], arabicHint: "علقنا في ازدحام مروري لمدة ساعتين.", arabicParts: ["علقنا في", "لمدة ساعتين."], arabicAnswer: "ازدحام مروري", arabicWrongs: ["النقل العام", "جدول القطارات", "دراجة هوائية"] },
      { parts: ["Do you have a", "for the bus?"], hint: "ئایا بلیتت پێیە بۆ پاسەکە؟", answer: "ticket", wrongs: ["station", "jam", "schedule"], arabicHint: "هل لديك تذكرة للحافلة؟", arabicParts: ["هل لديك", "لالحافلة؟"], arabicAnswer: "تذكرة", arabicWrongs: ["محطة", "ازدحام", "جدول"] },
    ],
    conversations: [
      {
        situation: "پرسیار دەربارەی شێوازی چوون بۆ ئۆفیس",
        theyAsk: "How do you get to work every morning?",
        correct: "I usually take public transport, but sometimes I walk to work.",
        wrong1: "I buy a ticket for the bed.",
        wrong2: "The train schedule is too salty.",
        wrong3: "I ride my car in the kitchen.",
        explanation: "وەڵامدانەوەی شێوازی چوون بە 'public transport' یان 'walk to work' وەڵامێکی باو و دروستە.",
        situationAr: "السؤال عن طريقة الذهاب للعمل",
        theyAskAr: "كيف تذهب إلى العمل كل صباح؟",
        correctAr: "عادة ما أستقل وسائل النقل العام، ولكني أحياناً أمشي إلى العمل.",
        wrong1Ar: "أشتري تذكرة للسرير.",
        wrong2Ar: "جدول القطارات مالح جداً.",
        wrong3Ar: "أركب سيارتي في المطبخ.",
        explanationAr: "شرح وسيلة النقل باستخدام 'public transport' أو 'walk to work' هو الأنسب."
      },
      {
        situation: "هاوڕێیەک لە ترافیکدا دواکەوتووە",
        theyAsk: "Sorry, I am late for our meeting.",
        correct: "No problem. I assume you were stuck in a traffic jam.",
        wrong1: "Buy a ticket now.",
        wrong2: "Ride a bicycle to the hospital.",
        wrong3: "The bus station is open until ten.",
        explanation: "'stuck in a traffic jam' هۆکارێکی زۆر باوە بۆ دواکەوتن لە شارەکاندا.",
        situationAr: "صديق يتأخر بسبب زحمة السير",
        theyAskAr: "آسف، أنا متأخر عن اجتماعنا.",
        correctAr: "لا مشكلة. أفترض أنك علقت في ازدحام مروري.",
        wrong1Ar: "اشترِ تذكرة الآن.",
        wrong2Ar: "اركب دراجة هوائية إلى المستشفى.",
        wrong3Ar: "محطة الحافلات مفتوحة حتى العاشرة.",
        explanationAr: "الازدحام المروري (traffic jam) عذر شائع ومقبول جداً للتأخر."
      }
    ]
  },

  // Lesson 4: In the Classroom
  {
    topic: "In the Classroom", topicKu: "لە ناو پۆلدا", topicAr: "في الصف الدراسي",
    words: [
      { english: "Teacher and student", kurdish: "مامۆستا و قوتابی", arabic: "معلم وطالب" },
      { english: "Wooden desk", kurdish: "مێزی خوێندنی دارین", arabic: "مقعد خشبي" },
      { english: "Write on the board", kurdish: "نووسین لەسەر تەختەکە", arabic: "الكتابة على السبورة" },
      { english: "Sheet of paper", kurdish: "پەڕەیەک کاغەز", arabic: "ورقة (صفحة)" },
      { english: "Ask a question", kurdish: "پرسیارکردن", arabic: "طرح سؤال" },
      { english: "Give the answer", kurdish: "وەڵام دانەوە", arabic: "تقديم الإجابة" },
      { english: "English lesson", kurdish: "وانەی ئینگلیزی", arabic: "درس اللغة الإنجليزية" },
      { english: "Pencil and eraser", kurdish: "پێنووسی دار و پاککەرەوە (لاستیک)", arabic: "قلم رصاص وممحاة" },
    ],
    voices: [
      { prompt: "پرسیار بکە لە مامۆستاکە", target: "Can I ask the teacher a question?", targetKurdish: "دەتوانم پرسیارێک لە مامۆستاکە بکەم؟", promptAr: "اسأل المعلم سؤالاً", targetArabic: "هل يمكنني طرح سؤال على المعلم؟" },
      { prompt: "بڵێ لەسەر تەختەکە دەنووسیت", target: "Please write the answer on the board.", targetKurdish: "تکایە وەڵامەکە لەسەر تەختەکە بنووسە.", promptAr: "اطلب كتابة الجواب على السبورة", targetArabic: "من فضلك اكتب الإجابة على السبورة." },
      { prompt: "داوای کاغەز بکە", target: "Do you have a sheet of paper for me?", targetKurdish: "ئایا پەڕەیەک کاغەزت بۆ من پێیە؟", promptAr: "اطلب ورقة كتابة", targetArabic: "هل لديك ورقة من أجلي؟" },
    ],
    sentences: [
      { english: ["The", "students", "are", "listening", "to", "the", "English", "lesson"], kurdish: "قوتابییەکان گوێ لە وانەی ئینگلیزییەکە دەگرن", arabic: "الطلاب يستمعون إلى درس اللغة الإنجليزية" },
      { english: ["He", "sat", "at", "his", "desk", "and", "took", "a", "pencil"], kurdish: "ئەو لەسەر مێزەکەی دانيشت و پێنووسێکی گرتە دەست", arabic: "جلس عند مقعده وأخذ قلماً رصاصاً" },
      { english: ["She", "gave", "the", "correct", "answer", "to the", "difficult", "question"], kurdish: "ئەو وەڵامە دروستەکەی دایەوە بۆ پرسیارە سەختەکە", arabic: "قدمت الإجابة الصحيحة على السؤال الصعب" },
      { english: ["Use", "the", "eraser", "if", "you", "make", "a", "mistake", "on", "paper"], kurdish: "پاککەرەوەکە بەکاربهێنە ئەگەر هەڵەت کرد لەسەر کاغەزەکە", arabic: "استخدم الممحاة إذا ارتكبت خطأ على الورق" },
    ],
    fillBlanks: [
      { parts: ["The teacher wrote the new words on the", "."], hint: "مامۆستاکە وشە نوێیەکانی لەسەر تەختەکە نووسی.", answer: "board", wrongs: ["desk", "paper", "eraser"], arabicHint: "كتب المعلم الكلمات الجديدة على السبورة.", arabicParts: ["كتب المعلم الكلمات الجديدة على", "."], arabicAnswer: "السبورة", arabicWrongs: ["المقعد", "الورقة", "الممحاة"] },
      { parts: ["I need a", "to correct my mistakes."], hint: "پێویستم بە پاککەرەوەیەک هەیە بۆ ڕاستکردنەوەی هەڵەکانم.", answer: "eraser", wrongs: ["pencil", "desk", "board"], arabicHint: "أحتاج لممحاة لتصحيح أخطائي.", arabicParts: ["أحتاج لـ", "لتصحيح أخطائي."], arabicAnswer: "ممحاة", arabicWrongs: ["قلم", "مقعد", "سبورة"] },
      { parts: ["Each student has a wooden", "in the classroom."], hint: "هەر قوتابییەک مێزێکی خوێندنی دارینی هەیە لە پۆلەکەدا.", answer: "desk", wrongs: ["board", "paper", "lesson"], arabicHint: "كل طالب لديه مقعد خشبي في الصف.", arabicParts: ["كل طالب لديه", "خشبي في الصف."], arabicAnswer: "مقعد", arabicWrongs: ["سبورة", "ورقة", "درس"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن لە هاوپۆلێک لە کاتی تاقیکردنەوەدا",
        theyAsk: "I made a mistake with my pencil. What should I do?",
        correct: "Use my eraser, and here is a clean sheet of paper if you need it.",
        wrong1: "Write on the board now.",
        wrong2: "Ask the teacher for a wooden desk.",
        wrong3: "The English lesson is too salty.",
        explanation: "بۆ هەڵەی پێنووسی دار, بەکارهێنانی پاککەرەوە (eraser) گونجاوترین چارەسەرە.",
        situationAr: "سؤال زميلك أثناء الاختبار بعد ارتكاب خطأ",
        theyAskAr: "ارتكبت خطأ بقلم الرصاص. ماذا يجب أن أفعل؟",
        correctAr: "استخدم ممحاتي، وتفضل ورقة نظيفة إذا احتجتها.",
        wrong1Ar: "اكتب على السبورة الآن.",
        wrong2Ar: "اطلب من المعلم مقعداً خشبياً.",
        wrong3Ar: "درس الإنجليزية مالح جداً.",
        explanationAr: "لتصحيح أخطاء قلم الرصاص، الممحاة (eraser) هي الحل المباشر."
      },
      {
        situation: "پرسیارکردن لە ناوەڕۆکی وانەکە",
        theyAsk: "Did you understand the English lesson today?",
        correct: "Yes, but I want to ask the teacher one more question about the answer.",
        wrong1: "No, the desk was wooden.",
        wrong2: "A sheet of paper was too tired.",
        wrong3: "My pencil is in the traffic jam.",
        explanation: "وەڵامدانەوەی تێگەیشتنی وانە بە پرسیارکردن لە مامۆستا پەیوەستە بە خوێندنەوە.",
        situationAr: "الاستفسار عن فهم الدرس اليوم",
        theyAskAr: "هل فهمت درس اللغة الإنجليزية اليوم؟",
        correctAr: "نعم، لكني أريد أن أطرح على المعلم سؤالاً آخر حول الإجابة.",
        wrong1Ar: "لا، المقعد كان خشبياً.",
        wrong2Ar: "الورقة كانت متعبة جداً.",
        wrong3Ar: "قلمي الرصاص في الازدحام المروري.",
        explanationAr: "النقاش حول الفهم الأكاديمي يرتبط بطرح الأسئلة (ask a question) على المعلم."
      }
    ]
  },

  // Lesson 5: Body Parts
  {
    topic: "Body Parts", topicKu: "پارچەکانی جەستە", topicAr: "أجزاء الجسم",
    words: [
      { english: "Head", kurdish: "سەر", arabic: "رأس" },
      { english: "Face", kurdish: "دەموچاو", arabic: "وجه" },
      { english: "Eyes", kurdish: "چاوەکان", arabic: "عيون" },
      { english: "Hand", kurdish: "دەست", arabic: "يد" },
      { english: "Foot", kurdish: "پێ", arabic: "قدم" },
      { english: "Arm", kurdish: "باڵ", arabic: "ذراع" },
      { english: "Leg", kurdish: "قاچ", arabic: "ساق" },
      { english: "Mouth", kurdish: "دەم", arabic: "فم" },
    ],
    voices: [
      { prompt: "بڵێ دەستت بشۆ", target: "Wash your hands before you eat dinner.", targetKurdish: "دەستەکانت بشۆ پێش ئەوەی نانی ئێوارە بخۆیت.", promptAr: "قل اغسل يديك قبل الأكل", targetArabic: "اغسل يديك قبل تناول العشاء." },
      { prompt: "بڵێ چاوت شینە", target: "She has beautiful blue eyes.", targetKurdish: "ئەو چاوگەلێکی شینی جوانی هەیە.", promptAr: "قل عيناها زرقاء وجميلة", targetArabic: "عيناها زرقاء وجميلة." },
      { prompt: "بڵێ سەرت دێشێت", target: "My head hurts; I need some water.", targetKurdish: "سەرم دێشێت؛ پێویستم بە کەمێک ئاوە.", promptAr: "قل رأسي يؤلمني", targetArabic: "رأسي يؤلمني؛ أحتاج إلى بعض الماء." },
    ],
    sentences: [
      { english: ["Wash", "your", "face", "with", "cold", "water", "in the", "morning"], kurdish: "بەیانیان دەموچاوت بە ئاوی سارد بشۆ", arabic: "اغسل وجهك بالماء البارد في الصباح" },
      { english: ["He", "broke", "his", "leg", "while", "playing", "football", "yesterday"], kurdish: "ئەو دوێنێ قاچی شکا لە کاتی یاریکردنی تۆپی پێدا", arabic: "لقد كسر ساقه أثناء لعب كرة القدم أمس" },
      { english: ["Keep", "your", "mouth", "closed", "while", "eating", "food"], kurdish: "دەمت بە داخراوی بهێڵەوە لە کاتی خواردندا", arabic: "حافظ على فمك مغلقاً أثناء تناول الطعام" },
      { english: ["Raise", "your", "arm", "if", "you know", "the", "correct", "answer"], kurdish: "باڵت بەرز بکەرەوە ئەگەر وەڵامە دروستەکە دەزانیت", arabic: "ارفع ذراعك إذا كنت تعرف الإجابة الصحيحة" },
    ],
    fillBlanks: [
      { parts: ["He kicked the football with his right", "."], hint: "تۆپەکەی بە قاچی ڕاستی کێشا (شەق لێدا).", answer: "foot", wrongs: ["hand", "face", "head"], arabicHint: "ركل كرة القدم بقدمه اليمنى.", arabicParts: ["ركل كرة القدم بـ", "اليمنى."], arabicAnswer: "قدمه", arabicWrongs: ["يده", "وجهه", "رأسه"] },
      { parts: ["Use your", "to write the lesson on paper."], hint: "دەستت بەکاربهێنە بۆ نووسینی وانەکە لەسەر کاغەزەکە.", answer: "hand", wrongs: ["leg", "eyes", "mouth"], arabicHint: "استخدم يدك لكتابة الدرس على الورق.", arabicParts: ["استخدم", "لكتابة الدرس على الورق."], arabicAnswer: "يدك", arabicWrongs: ["ساقك", "عينيك", "فمك"] },
      { parts: ["Open your", "and say ah for the doctor."], hint: "دەمت بکەرەوە و بڵێ ئا بۆ دکتۆرەکە.", answer: "mouth", wrongs: ["head", "leg", "arm"], arabicHint: "افتح فمك وقل آه للطبيب.", arabicParts: ["افتح", "وقل آه للطبيب."], arabicAnswer: "فمك", arabicWrongs: ["رأسك", "ساقك", "ذراعك"] },
    ],
    conversations: [
      {
        situation: "چوونە لای پزیشک بەهۆی ئازاری جەستە",
        theyAsk: "What is the problem? Where does it hurt?",
        correct: "My head hurts and I have a pain in my right leg.",
        wrong1: "Wash your face with a pencil.",
        wrong2: "Open your board and eraser.",
        wrong3: "I broken my hand keys.",
        explanation: "بۆ نەخۆشخانە، باس کردنی سەرئێشە (head hurts) و ئازاری قاچ (pain in leg) وەڵامێکی دروستە.",
        situationAr: "زيارة الطبيب بسبب آلام الجسد",
        theyAskAr: "ما هي المشكلة؟ أين تشعر بالألم؟",
        correctAr: "رأسي يؤلمني ولدي ألم في ساقي اليمنى.",
        wrong1Ar: "اغسل وجهك بقلم رصاص.",
        wrong2Ar: "افتح سبورتك وممحاة.",
        wrong3Ar: "لقد كسرت مفاتيح يدي.",
        explanationAr: "عند الطبيب، نقوم بوصف موضع الألم بدقة مثل الصداع (head hurts) أو ألم الساق (leg pain)."
      },
      {
        situation: "ئامۆژگاری پاکوخاوێنی پێش نانخواردن",
        theyAsk: "The dinner is ready on the table.",
        correct: "Great! Let's wash our hands and faces before we sit down.",
        wrong1: "Open the window with your foot.",
        wrong2: "Close the eyes, please.",
        wrong3: "I have a big mouth in my bag.",
        explanation: "شوشتنی دەستەکان (wash hands) پێش نان خواردن عاداتێکی تەندروستی گرنگە.",
        situationAr: "نصيحة النظافة قبل تناول الطعام",
        theyAskAr: "العشاء جاهز على الطاولة.",
        correctAr: "رائع! لنغسل أيدينا ووجوهنا قبل أن نجلس.",
        wrong1Ar: "افتح النافذة بقدمك.",
        wrong2Ar: "أغلق العينين من فضلك.",
        wrong3Ar: "لدي فم كبير في حقيبتي.",
        explanationAr: "غسل الأيدي (wash hands) قبل الأكل هو السلوك الصحي والاجتماعي المعتاد."
      }
    ]
  },

  // Lesson 6: Clothing & Dress
  {
    topic: "Clothing & Dress", topicKu: "جلوبەرگ", topicAr: "الملابس والملبس",
    words: [
      { english: "Shirt", kurdish: "کراس", arabic: "قميص" },
      { english: "Pants", kurdish: "پانتۆڵ", arabic: "بنطال" },
      { english: "Shoes", kurdish: "پێڵاوەکان", arabic: "أحذية" },
      { english: "Jacket", kurdish: "چاکەت", arabic: "سترة (جاكيت)" },
      { english: "Hat", kurdish: "کڵاو", arabic: "قبعة" },
      { english: "Socks", kurdish: "گۆرەوییەکان", arabic: "جوارب" },
      { english: "Wear clothes", kurdish: "جل لەبەرکردن", arabic: "ارتداء الملابس" },
      { english: "Buy shoes", kurdish: "کڕینی پێڵاو", arabic: "شراء أحذية" },
    ],
    voices: [
      { prompt: "بڵێ چاکەتەکەت لەبەر دەکەیت چونکە ساردە", target: "I will wear my jacket because it is cold.", targetKurdish: "چاکەتەکەم لەبەر دەکەم چونکە ساردە.", promptAr: "قل سأرتدي سترتي لأن الجو بارد", targetArabic: "سأرتدي سترتي لأن الجو بارد." },
      { prompt: "بڵێ پێڵاوی نوێت کڕیوە", target: "I bought new shoes for the meeting.", targetKurdish: "پێڵاوی نوێم بۆ کۆبوونەوەکە کڕی.", promptAr: "قل اشتريت حذاءً جديداً", targetArabic: "اشتريت حذاءً جديداً من أجل الاجتماع." },
      { prompt: "وەسفی کڵاوەکە بکە", target: "He has a black hat on his head.", targetKurdish: "کڵاوێکی ڕەشی لەسەر سەردایە.", promptAr: "صف القبعة", targetArabic: "لديه قبعة سوداء على رأسه." },
    ],
    sentences: [
      { english: ["Please", "put", "your", "socks", "and", "shoes", "near", "the", "door"], kurdish: "تکایە گۆرەوی و پێڵاوەکانت لە نزیک دەرگاکە دابنێ", arabic: "من فضلك ضع جواربك وحذاءك قرب الباب" },
      { english: ["This", "blue", "shirt", "looks", "very", "good", "on", "you"], kurdish: "ئەم کراسە شینە زۆر لێت دێت (جوانە)", arabic: "هذا القميص الأزرق يبدو رائعاً عليك" },
      { english: ["He", "needs", "new", "pants", "because", "these", "are", "dirty"], kurdish: "ئەو پێویستی بە پانتۆڵی نوێیە چونکە ئەمانە پیسن", arabic: "هو بحاجة إلى بنطال جديد لأن هذا متسخ" },
      { english: ["We", "wear", "warm", "clothes", "during", "the", "cold", "winter"], kurdish: "ئێمە جلی گەرم لەبەر دەکەین لە زستانی سارددا", arabic: "نحن نرتدي ملابس دافئة خلال الشتاء البارد" },
    ],
    fillBlanks: [
      { parts: ["Put on your", "because the ground is cold."], hint: "گۆرەوییەکانت لەبەر بکە چونکە زەوییەکە ساردە.", answer: "socks", wrongs: ["hat", "shirt", "jacket"], arabicHint: "ارتدِ جواربك لأن الأرض باردة.", arabicParts: ["ارتدِ", "لأن الأرض باردة."], arabicAnswer: "جواربك", arabicWrongs: ["قبعتك", "قميصك", "سترتك"] },
      { parts: ["I bought a warm black", "for winter."], hint: "چاکەتێکی گەرمی ڕەشم بۆ زستان کڕی.", answer: "jacket", wrongs: ["shirt", "shoes", "socks"], arabicHint: "اشتريت سترة سوداء دافئة للشتاء.", arabicParts: ["اشتريت", "سترة سوداء دافئة للشتاء."], arabicAnswer: "سترة", arabicWrongs: ["قميصاً", "أحذية", "جوارب"] },
      { parts: ["Do you prefer blue or black", "for work?"], hint: "پانتۆڵی شین یان ڕەش پەسەند دەکەیت بۆ سەر کار؟", answer: "pants", wrongs: ["socks", "hat", "shoes"], arabicHint: "هل تفضل البنطال الأزرق أم الأسود للعمل؟", arabicParts: ["هل تفضل", "الأزرق أم الأسود للعمل؟"], arabicAnswer: "البنطال", arabicWrongs: ["الجوارب", "القبعة", "الأحذية"] },
    ],
    conversations: [
      {
        situation: "ئامادەکاری بۆ چوونە دەرەوە لە زستاندا",
        theyAsk: "It is snowing outside. What should I wear?",
        correct: "You should wear your warm jacket, socks, and boots.",
        wrong1: "Put the shirt on the board.",
        wrong2: "Close the window with your pants.",
        wrong3: "I bought new shoes for the table.",
        explanation: "بۆ بەفربارین و سەرما، لەبەرکردنی چاکەت (jacket) و گۆرەوی (socks) پێویستە.",
        situationAr: "الاستعداد للخروج في الطقس البارد",
        theyAskAr: "إنها تثلج بالخارج. ماذا يجب أن أرتدي؟",
        correctAr: "يجب أن ترتدي سترتك الدافئة وجواربك وحذاءك الطويل.",
        wrong1Ar: "ضع القميص على السبورة.",
        wrong2Ar: "أغلق النافذة ببنطالك.",
        wrong3Ar: "اشتريت حذاءً جديداً للطاولة.",
        explanationAr: "في طقس مثلج، ارتداء السترة الدافئة (jacket) والجوارب أمر بديهي للحماية من البرد."
      },
      {
        situation: "پیاهەڵدان بە جلی نوێی هاوڕێیەک",
        theyAsk: "Do you like my new blue shirt?",
        correct: "Yes, it looks very good on you, and it matches your shoes.",
        wrong1: "No, the pants are dirty.",
        wrong2: "I wear socks near the door.",
        wrong3: "The winter is very cold.",
        explanation: "وەڵامێکی جوان بۆ وەسفکردنی کراسی نوێ (shirt) و گونجانی لەگەڵ پێڵاو (shoes).",
        situationAr: "مدح ملابس صديقك الجديدة",
        theyAskAr: "هل يعجبك قميصي الأزرق الجديد؟",
        correctAr: "نعم، يبدو رائعاً عليك، ويتناسب مع حذائك.",
        wrong1Ar: "لا، البنطال متسخ.",
        wrong2Ar: "أنا أرتدي الجوارب قرب الباب.",
        wrong3Ar: "الشتاء بارد جداً.",
        explanationAr: "الرد اللطيف يثني على المظهر وتناسق الألوان بين القميص (shirt) والحذاء (shoes)."
      }
    ]
  },

  // Lesson 7: Telling Time
  {
    topic: "Telling Time", topicKu: "کات و کاتژمێر", topicAr: "إخبار الوقت",
    words: [
      { english: "What time is it", kurdish: "کاتژمێر چەندە؟", arabic: "كم الساعة" },
      { english: "Ten o'clock", kurdish: "کاتژمێر دە", arabic: "الساعة العاشرة" },
      { english: "Half past", kurdish: "نیو (و نیو بۆ کات)", arabic: "النصف (ونصف)" },
      { english: "Quarter past", kurdish: "چارەک (و چارەک)", arabic: "الربع (وربع)" },
      { english: "Late for work", kurdish: "دواکەوتن بۆ سەر کار", arabic: "متأخر عن العمل" },
      { english: "Early morning", kurdish: "بەیانی زوو", arabic: "الصباح الباكر" },
      { english: "Hour and minute", kurdish: "کاتژمێر و خولەک", arabic: "ساعة ودقيقة" },
      { english: "Set the alarm", kurdish: "ڕێکخستنی زەنگ", arabic: "ضبط المنبه" },
    ],
    voices: [
      { prompt: "بپرس کاتژمێر چەندە", target: "What time is it right now?", targetKurdish: "کاتژمێر چەندە لەم چرکەیەدا؟", promptAr: "اسأل كم الساعة الآن", targetArabic: "كم الساعة الآن بالضبط؟" },
      { prompt: "بڵێ کاتژمێر نۆ و نیوە", target: "It is half past nine.", targetKurdish: "کاتژمێر نۆ و نیوە.", promptAr: "قل الساعة التاسعة والنصف", targetArabic: "إنها التاسعة والنصف." },
      { prompt: "بڵێ بۆ کۆبوونەوەکە دواکەوتوویت", target: "We are late for the meeting.", targetKurdish: "ئێمە بۆ کۆبوونەوەکە دواکەوتووین.", promptAr: "قل نحن متأخرون عن الاجتماع", targetArabic: "نحن متأخرون عن الاجتماع." },
    ],
    sentences: [
      { english: ["I", "must", "set", "the", "alarm", "for", "six", "in the", "morning"], kurdish: "پێویستە زەنگەکە بۆ کاتژمێر شەش لە بەیانیاندا ڕێکبخەم", arabic: "يجب أن أضبط المنبه على السادسة صباحاً" },
      { english: ["The", "train", "arrives", "at", "a", "quarter", "past", "ten"], kurdish: "شەمەندەفەرەکە لە دە و چارەک دەگات", arabic: "القطار يصل في العاشرة والربع" },
      { english: ["An", "hour", "has", "sixty", "minutes", "and", "a", "day", "has", "twenty-four", "hours"], kurdish: "کاتژمێرێک شەست خولەکە و ڕۆژێک بیست و چوار کاتژمێرە", arabic: "الساعة تحتوي على ستين دقيقة واليوم يحتوي على أربع وعشرين ساعة" },
      { english: ["He", "woke", "up", "early", "to", "study", "for", "the", "test"], kurdish: "ئەو زوو لە خەو هەڵسا بۆ ئەوەی بۆ تاقیکردنەوەکە بخوێنێت", arabic: "استيقظ باكراً للدراسة من أجل الاختبار" },
    ],
    fillBlanks: [
      { parts: ["Hurry up! We are going to be", "for school."], hint: "پەلە بکە! بۆ قوتابخانە دوا دەکەوین.", answer: "late", wrongs: ["early", "past", "alarm"], arabicHint: "أسرع! سنكون متأخرين عن المدرسة.", arabicParts: ["أسرع! سنكون", "عن المدرسة."], arabicAnswer: "متأخرين", arabicWrongs: ["مبكرين", "نصف", "منبه"] },
      { parts: ["It is a", "past eight; we have fifteen minutes."], hint: "کاتژمێر هەشت و چارەکە؛ پانزە خولەکمان هەیە.", answer: "quarter", wrongs: ["half", "hour", "alarm"], arabicHint: "إنها الثامنة والربع؛ لدينا خمس عشرة دقيقة.", arabicParts: ["إنها الثامنة و", "؛ لدينا خمس عشرة دقيقة."], arabicAnswer: "الربع", arabicWrongs: ["النصف", "ساعة", "منبه"] },
      { parts: ["I set my", "to wake up early."], hint: "زەنگەکەم ڕێکخست بۆ ئەوەی زوو لە خەو هەڵبستم.", answer: "alarm", wrongs: ["hour", "minute", "time"], arabicHint: "ضبطت منبهي لأستيقظ باكراً.", arabicParts: ["ضبطت", "لأستيقظ باكراً."], arabicAnswer: "منبهي", arabicWrongs: ["ساعتي", "دقيقتي", "وقتي"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردنی کات لە ناو فڕۆکەخانە",
        theyAsk: "Excuse me, do you know the time?",
        correct: "Yes, it is exactly ten o'clock. We are early.",
        wrong1: "No, I am late for work.",
        wrong2: "I set the alarm on my bed.",
        wrong3: "The train is a quarter past socks.",
        explanation: "وەڵامدانەوەی کات بە شێوازێکی فەرمی: 'exactly ten o'clock'.",
        situationAr: "السؤال عن الوقت في المطار",
        theyAskAr: "معذرة، هل تعرف كم الساعة؟",
        correctAr: "نعم، إنها العاشرة تماماً. نحن مبكرون.",
        wrong1Ar: "لا، أنا متأخر عن العمل.",
        wrong2Ar: "ضبطت المنبه على سريري.",
        wrong3Ar: "القطار في العاشرة والربع جوارب.",
        explanationAr: "الإجابة النموذجية عن سؤال الوقت تكون بذكر الساعة بشكل محدد."
      },
      {
        situation: "دواکەوتن بەهۆی نەبیستنی زەنگ",
        theyAsk: "Why were you late for the meeting today?",
        correct: "I forgot to set my alarm, and I woke up late.",
        wrong1: "Because it was half past ten.",
        wrong2: "An hour has sixty minutes.",
        wrong3: "I prefer early morning in the park.",
        explanation: "لەبیرچوونی زەنگ (forgot to set alarm) هۆکارێکی ڕاستەقینەیە بۆ درەنگ هەستان.",
        situationAr: "التأخر عن الاجتماع بسبب المنبه",
        theyAskAr: "لماذا تأخرت عن الاجتماع اليوم؟",
        correctAr: "لقد نسيت ضبط منبهي، واستيقظت متأخراً.",
        wrong1Ar: "لأنها كانت العاشرة والنصف.",
        wrong2Ar: "الساعة تحتوي على ستين دقيقة.",
        wrong3Ar: "أفضل الصباح الباكر في الحديقة.",
        explanationAr: "نسيان ضبط المنبه (forgot to set alarm) سبب مباشر وواضح للتأخر الصباحي."
      }
    ]
  },

  // Lesson 8: Simple Occupations
  {
    topic: "Occupations", topicKu: "پیشەکان", topicAr: "المهن والوظائف",
    words: [
      { english: "Doctor", kurdish: "پزیشک (دکتۆر)", arabic: "طبيب" },
      { english: "Teacher", kurdish: "مامۆستا", arabic: "معلم" },
      { english: "Driver", kurdish: "شۆفێر", arabic: "سائق" },
      { english: "Cook", kurdish: "شێف (چێشتلێنەر)", arabic: "طباخ" },
      { english: "Nurse", kurdish: "پەرستار", arabic: "ممرض" },
      { english: "Worker", kurdish: "کرێکار", arabic: "عامل" },
      { english: "Office job", kurdish: "کاری نووسینگە (ئۆفیس)", arabic: "وظيفة مكتبية" },
      { english: "Apply for a job", kurdish: "پێشکەشکردنی داواکاری بۆ کار", arabic: "التقدم لوظيفة" },
    ],
    voices: [
      { prompt: "بڵێ باوکت پزیشکە لە نەخۆشخانە", target: "My father is a doctor at the hospital.", targetKurdish: "باوکم پزیشکە لە نەخۆشخانەکە.", promptAr: "قل أبي طبيب في المستشفى", targetArabic: "أبي طبيب في المستشفى." },
      { prompt: "بڵێ خوشکت پەرستارە", target: "My sister works as a nurse in a clinic.", targetKurdish: "خوشکەکەم وەک پەرستار لە کلینیکێک کار دەکات.", promptAr: "قل أختي تعمل كممرضة", targetArabic: "أني أختي تعمل كممرضة في عيادة." },
      { prompt: "بڵێ حەزت لە کاری نووسینگەیە", target: "I want to apply for an office job.", targetKurdish: "دەمەوێت داواکاری بۆ کارێکی نووسینگە پێشکەش بکەم.", promptAr: "قل أريد التقديم لوظيفة مكتبية", targetArabic: "أريد التقدم لوظيفة مكتبية." },
    ],
    sentences: [
      { english: ["The", "cook", "made", "a", "very", "delicious", "dinner", "for", "us"], kurdish: "چێشتلێنەرەکە شێوێکی زۆر بەتامی بۆ دروست کردین", arabic: "الطهي أعد لنا عشاءً لذيذاً جداً" },
      { english: ["She", "is", "a", "popular", "English", "teacher", "at", "school"], kurdish: "ئەو مامۆستایەکی بەناوبانگی ئینگلیزییە لە قوتابخانە", arabic: "هي معلمة لغة إنجليزية محبوبة في المدرسة" },
      { english: ["He", "works", "as", "a", "bus", "driver", "in", "the", "city"], kurdish: "ئەو وەک شۆفێری پاس لە شارەکەدا کار دەکات", arabic: "هو يعمل كسائق حافلة في المدينة" },
      { english: ["Many", "workers", "helped", "build", "our", "new", "house"], kurdish: "زۆرێک لە کرێکاران یارمەتیدەر بوون لە دروستکردنی خانوە نوێیەکەمان", arabic: "ساعد العديد من العمال في بناء منزلنا الجديد" },
    ],
    fillBlanks: [
      { parts: ["The", "gave me medicine for my headache."], hint: "پزیشکەکە دەرمانی پێدام بۆ سەرئێشەکەم.", answer: "doctor", wrongs: ["driver", "cook", "worker"], arabicHint: "الطبيب أعطاني دواء لصداعي.", arabicParts: ["", "أعطاني دواء لصداعي."], arabicAnswer: "الطبيب", arabicWrongs: ["السائق", "الطباخ", "العامل"] },
      { parts: ["My brother is a taxi", "in the city."], hint: "براکەم شۆفێری تاکسییە لە شارەکەدا.", answer: "driver", wrongs: ["teacher", "nurse", "cook"], arabicHint: "أخي سائق سيارة أجرى في المدينة.", arabicParts: ["أخي", "سيارة أجرى في المدينة."], arabicAnswer: "سائق", arabicWrongs: ["معلم", "ممرض", "طباخ"] },
      { parts: ["I want to find a good", "to earn money."], hint: "دەمەوێت کارێکی باش بدۆزمەوە بۆ پەیداکردنی پارە.", answer: "job", wrongs: ["driver", "nurse", "teacher"], arabicHint: "أريد العثور على وظيفة جيدة لجني المال.", arabicParts: ["أريد العثور على", "جيدة لجني المال."], arabicAnswer: "وظيفة", arabicWrongs: ["سائق", "ممرض", "معلم"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن لە کاری کەسێک",
        theyAsk: "What do you do for a living?",
        correct: "I am an English teacher, and my brother is a driver.",
        wrong1: "I am applying for a hospital.",
        wrong2: "Yes, I am a very delicious cook.",
        wrong3: "I have a clinic in my bag.",
        explanation: "وەڵامی ڕاست ڕوونکردنەوەی پیشەکەیە: 'I am a...'.",
        situationAr: "السؤال عن طبيعة عمل شخص ما",
        theyAskAr: "ماذا تعمل لكسب عيشك؟",
        correctAr: "أنا معلم لغة إنجليزية، وأخي يعمل سائقاً.",
        wrong1Ar: "أنا أتقدم بطلب لمستشفى.",
        wrong2Ar: "نعم، أنا طباخ لذيذ جداً.",
        wrong3Ar: "لدي عيادة في حقيبتي.",
        explanationAr: "الرد الصحيح يوضح اسم الوظيفة والمهنة مباشرة."
      },
      {
        situation: "داواکاری کار لە کۆمپانیا",
        theyAsk: "Why are you here today?",
        correct: "I want to apply for the new office job in your company.",
        wrong1: "Because my father is a doctor.",
        wrong2: "To eat dinner with the cook.",
        wrong3: "I am a driver at school.",
        explanation: "بەکارهێنانی 'apply for a job' دەربڕینێکی یاسایی و فەرمی بازاڕی کارە.",
        situationAr: "التقدم لوظيفة في الشركة",
        theyAskAr: "لماذا أنت هنا اليوم؟",
        correctAr: "أريد التقدم للوظيفة المكتبية الجديدة في شركتكم.",
        wrong1Ar: "لأن أبي يعمل طبيباً.",
        wrong2Ar: "لتناول العشاء مع الطباخ.",
        wrong3Ar: "أنا سائق في المدرسة.",
        explanationAr: "استخدام 'التقدم لوظيفة' (apply for a job) هو التعبير الرسمي في مقابلات العمل."
      }
    ]
  },

  // Lesson 9: Weekend Activities
  {
    topic: "Weekend Activities", topicKu: "چالاکییەکانی کۆتایی هەفتە", topicAr: "أنشطة عطلة نهاية الأسبوع",
    words: [
      { english: "Play football", kurdish: "تۆپی پێ یاری کردن", arabic: "لعب كرة القدم" },
      { english: "Watch a movie", kurdish: "سەیرکردنی فیلم", arabic: "مشاهدة فيلم" },
      { english: "Read a book", kurdish: "خوێندنەوەی کتێب", arabic: "قراءة كتاب" },
      { english: "Walk in the park", kurdish: "پیاسەکردن لە پارکەکەدا", arabic: "المشي في الحديقة" },
      { english: "Sleep late", kurdish: "درەنگ خەوتن", arabic: "النوم متأخراً" },
      { english: "Meet friends", kurdish: "بینینی هاوڕێیان (چاوپێکەوتن)", arabic: "مقابلة الأصدقاء" },
      { english: "Cook dinner", kurdish: "شێو لێنان (ئامادەکردنی نانی ئێوارە)", arabic: "طبخ العشاء" },
      { english: "Clean the house", kurdish: "پاککردنەوەی خانوەکە", arabic: "تنظيف المنزل" },
    ],
    voices: [
      { prompt: "بڵێ لە کۆتایی هەفتەدا فیلم دەبینیت", target: "I want to watch a movie on the weekend.", targetKurdish: "دەمەوێت لە کۆتایی هەفتەدا سەیری فیلمێک بکەم.", promptAr: "قل أريد مشاهدة فيلم بالعطلة", targetArabic: "أريد مشاهدة فيلم في عطلة نهاية الأسبوع." },
      { prompt: "بڵێ لەگەڵ هاوڕێکانت کۆدەبیتەوە", target: "I will meet my friends in the park tomorrow.", targetKurdish: "بەیانی لە پارکەکە هاوڕێکانم دەبینم.", promptAr: "قل سأقابل أصدقائي بالحديقة غداً", targetArabic: "سأقابل أصدقائي في الحديقة غداً." },
      { prompt: "بڵێ حەزت لە خەوتنی زۆرە", target: "I love to sleep late on Saturday mornings.", targetKurdish: "حەزم لێیە بەیانیانی شەممە درەنگ بخەوم.", promptAr: "قل أحب النوم متأخراً أيام السبت", targetArabic: "أحب النوم متأخراً في صباح أيام السبت." },
    ],
    sentences: [
      { english: ["We", "usually", "clean", "the", "house", "on", "Friday", "mornings"], kurdish: "ئێمە بە شێوەیەکی گشتی بەیانیانی هەینی خانوەکە پاک دەکەینەوە", arabic: "نحن عادة ننظف المنزل صباح أيام الجمعة" },
      { english: ["He", "likes", "to", "play", "football", "with", "his", "brother", "after", "work"], kurdish: "ئەو حەز دەکات دوای کار لەگەڵ براکەی یاری تۆپی پێ بکات", arabic: "هو يحب لعب كرة القدم مع أخيه بعد العمل" },
      { english: ["She", "is", "going", "to", "cook", "a", "delicious", "dinner", "for", "us", "tonight"], kurdish: "ئەو ئەمشەو شێوێکی بەتاممان بۆ لێ دەنێت", arabic: "هي ستطبخ عشاءً لذيذاً لنا الليلة" },
      { english: ["I", "always", "read", "a", "book", "before", "I", "go", "to", "sleep"], kurdish: "من هەمیشە پێش خەوتن کتێبێک دەخوێنمەوە", arabic: "أنا دائماً أقرأ كتاباً قبل أن أذهب للنوم" },
    ],
    fillBlanks: [
      { parts: ["On Sundays, I like to", "friends at the cafe."], hint: "ڕۆژانی یەکشەممە، حەزم لێیە هاوڕێکانم لە کافتریایەکە ببینم.", answer: "meet", wrongs: ["clean", "watch", "sleep"], arabicHint: "أيام الأحد، أحب مقابلة الأصدقاء في المقهى.", arabicParts: ["أيام الأحد، أحب", "الأصدقاء في المقهى."], arabicAnswer: "مقابلة", arabicWrongs: ["تنظيف", "مشاهدة", "النوم"] },
      { parts: ["We need to", "the house before the guests arrive."], hint: "پێویستە پێش گەیشتنی میوانەکان خانوەکە پاک بکەینەوە.", answer: "clean", wrongs: ["play", "read", "sleep"], arabicHint: "نحن بحاجة لتنظيف المنزل قبل وصول الضيوف.", arabicParts: ["نحن بحاجة لـ", "المنزل قبل وصول الضيوف."], arabicAnswer: "تنظيف", arabicWrongs: ["لعب", "قراءة", "النوم"] },
      { parts: ["He is going to", "a movie on television tonight."], hint: "ئەو ئەمشەو سەیری فیلمێک دەکات لە تەلەفزیۆنەوە.", answer: "watch", wrongs: ["read", "play", "clean"], arabicHint: "هو سيشاهد فيلماً على التلفاز الليلة.", arabicParts: ["هو سـ", "فيلماً على التلفاز الليلة."], arabicAnswer: "يشاهد", arabicWrongs: ["يقرأ", "يلعب", "ينظف"] },
    ],
    conversations: [
      {
        situation: "پرسیار دەربارەی پلانەکانی کۆتایی هەفتە",
        theyAsk: "What are you doing this weekend?",
        correct: "I will meet my friends, and we will play football in the park.",
        wrong1: "I am late for work.",
        wrong2: "The train arrives at ten o'clock.",
        wrong3: "I clean my pencil on paper.",
        explanation: "وەڵامێکی دروست بۆ پلانی کۆتایی هەفتە (weekend) بە بینینی هاوڕێیان و یاریکردن.",
        situationAr: "السؤال عن خطط نهاية الأسبوع",
        theyAskAr: "ماذا ستفعل في عطلة نهاية الأسبوع؟",
        correctAr: "سأقابل أصدقائي، وسنلعب كرة القدم في الحديقة.",
        wrong1Ar: "أنا متأخر عن العمل.",
        wrong2Ar: "القطار يصل في الساعة العاشرة.",
        wrong3Ar: "أنا أنظف قلمي الرصاص على الورق.",
        explanationAr: "الجواب يعبر عن أنشطة ترفيهية تناسب عطلة نهاية الأسبوع."
      },
      {
        situation: "کاتێک هاوڕێیەک پێشنیازی خواردن دەکات لە ماڵەوە",
        theyAsk: "Should we go to the restaurant tonight?",
        correct: "No, let's stay home. I want to cook a delicious dinner and read a book.",
        wrong1: "Yes, I will sleep late on Sunday.",
        wrong2: "The doctor is at the hospital.",
        wrong3: "I have socks in my bag.",
        explanation: "مانەوە لە ماڵەوە بۆ لێنانی خواردن (cook dinner) بە شێوەیەکی ئاسایی و گونجاو پێشنیاز دەکرێت.",
        situationAr: "اقتراح البقاء في المنزل بدل المطعم",
        theyAskAr: "هل نذهب إلى المطعم الليلة؟",
        correctAr: "لا، فلنبقَ في المنزل. أريد طبخ عشاء لذيذ وقراءة كتاب.",
        wrong1Ar: "نعم، سأنام متأخراً يوم الأحد.",
        wrong2Ar: "الطبيب في المستشفى.",
        wrong3Ar: "لدي جوارب في حقيبتي.",
        explanationAr: "البقاء في المنزل لطبخ العشاء وقراءة كتاب هو بديل دافئ واقتصادي."
      }
    ]
  }
];

export default normalUnit0B;
