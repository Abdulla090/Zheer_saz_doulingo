import { UnitBank } from "../types";

// ── Unit 1: Basic Greetings & Introductions — 10 lessons ──────────────────────────
// Extremely basic, foundational English for absolute beginners, teaching core pronouns, verbs, and daily vocabulary in context.

const normalUnit00: UnitBank = [
  // Lesson 0: Basic Greetings & Hello
  {
    topic: "Greetings & Hello", topicKu: "سڵاوکردن", topicAr: "التحيات والترحيب",
    words: [
      { english: "Hello", kurdish: "سڵاو", arabic: "مرحبا" },
      { english: "Good morning", kurdish: "بەیانیت باش", arabic: "صباح الخير" },
      { english: "Good evening", kurdish: "ئێوارەت باش", arabic: "مساء الخير" },
      { english: "Goodbye", kurdish: "خوات لەگەڵ", arabic: "مع السلامة" },
      { english: "Yes", kurdish: "بەڵێ", arabic: "نعم" },
      { english: "No", kurdish: "نەخێر", arabic: "لا" },
      { english: "Please", kurdish: "تکایە", arabic: "من فضلك" },
      { english: "Thank you", kurdish: "سوپاس", arabic: "شكراً لك" },
    ],
    voices: [
      { prompt: "بڵێ: سڵاو، بەیانیت باش", target: "Hello, good morning.", targetKurdish: "سڵاو، بەیانیت باش.", promptAr: "قول: مرحبا، صباح الخير", targetArabic: "مرحبا، صباح الخير." },
      { prompt: "بەڕێزەوە بڵێ: نەخێر، سوپاس", target: "No, thank you.", targetKurdish: "نەخێر، سوپاس.", promptAr: "قل بأدب: لا، شكراً", targetArabic: "لا، شكراً لك." },
      { prompt: "بەڕێزەوە بڵێ: بەڵێ، تکایە", target: "Yes, please.", targetKurdish: "بەڵێ، تکایە.", promptAr: "قل بأدب: نعم، من فضلك", targetArabic: "نعم، من فضلك." },
    ],
    sentences: [
      { english: ["Hello", "good", "evening", "my", "friend"], kurdish: "سڵاو، ئێوارەت باش هاوڕێم", arabic: "مرحبا، مساء الخير يا صديقي" },
      { english: ["Goodbye", "and", "thank", "you", "very", "much"], kurdish: "خوات لەگەڵ و زۆر سوپاس", arabic: "مع السلامة وشكراً جزيلاً لك" },
      { english: ["Yes", "please", "come", "in"], kurdish: "بەڵێ، تکایە وەرە ژوورەوە", arabic: "نعم، تفضل بالدخول من فضلك" },
      { english: ["No", "thank", "you", "I", "am", "fine"], kurdish: "نەخێر، سوپاس من باشم", arabic: "لا، شكراً لك أنا بخير" },
    ],
    fillBlanks: [
      { parts: ["Good", ", my friend!"], hint: "بەیانیت باش، هاوڕێم!", answer: "morning", wrongs: ["evening", "goodbye", "please"], arabicHint: "صباح الخير، يا صديقي!", arabicParts: ["صباح", "، يا صديقي!"], arabicAnswer: "الخير", arabicWrongs: ["المساء", "الليل", "الظهر"] },
      { parts: ["No,", "you."], hint: "نەخێر، سوپاس.", answer: "thank", wrongs: ["please", "hello", "yes"], arabicHint: "لا، شكراً لك.", arabicParts: ["لا،", "لك."], arabicAnswer: "شكراً", arabicWrongs: ["من فضلك", "مرحبا", "نعم"] },
      { parts: ["Nice to", " you!"], hint: "خۆشحاڵم بە ناسینت!", answer: "meet", wrongs: ["met", "meeting", "meets"], arabicHint: "تشرفت بمعرفتك!", arabicParts: ["تشرفت", "!"], arabicAnswer: "بمعرفتك", arabicWrongs: ["بوداعك", "بمغادرتك", "بغيابك"] },
    ],
    conversations: [
      {
        situation: "سڵاوکردنی بەیانیان لە هاوڕێیەک",
        theyAsk: "Good morning! How are you?",
        correct: "Good morning! I am fine, thank you.",
        wrong1: "Goodbye, see you.",
        wrong2: "No, please.",
        wrong3: "Good evening, friend.",
        explanation: "بۆ سڵاوی بەیانیان بە 'Good morning' وەڵام دەدەیتەوە.",
        situationAr: "التحية الصباحية لصديق",
        theyAskAr: "صباح الخير! كيف حالك؟",
        correctAr: "صباح الخير! أنا بخير، شكراً لك.",
        wrong1Ar: "مع السلامة، أراك لاحقاً.",
        wrong2Ar: "لا، من فضلك.",
        wrong3Ar: "مساء الخير يا صديقي.",
        explanationAr: "للتحية الصباحية نرد بـ 'Good morning'."
      },
      {
        situation: "ڕەتکردنەوەی پێشنیاری چا یان قاوە بە ئەدەبەوە",
        theyAsk: "Do you want some tea?",
        correct: "No, thank you. I am fine.",
        wrong1: "Yes, goodbye.",
        wrong2: "Please hello.",
        wrong3: "Good evening.",
        explanation: "'No, thank you' جوانترین ڕێگەیە بۆ ڕەتکردنەوەی پێشنیار بە ئەدەبەوە.",
        situationAr: "رفض عرض شرب الشاي بأدب",
        theyAskAr: "هل تريد بعض الشاي؟",
        correctAr: "لا، شكراً لك. أنا بخير.",
        wrong1Ar: "نعم، مع السلامة.",
        wrong2Ar: "من فضلك مرحبا.",
        wrong3Ar: "مساء الخير.",
        explanationAr: "'No, thank you' هي الطريقة المثلى لرفض العروض بأدب."
      }
    ]
  },

  // Lesson 1: Introducing Yourself (Core Grammar: Pronouns & To Be)
  {
    topic: "Introducing Yourself", topicKu: "ناساندنی خۆت", topicAr: "التعريف بالنفس",
    words: [
      { english: "Name", kurdish: "ناو", arabic: "اسم" },
      { english: "I am", kurdish: "من ...م (بۆ خۆناساندن)", arabic: "أنا" },
      { english: "You are", kurdish: "تۆ ...یت", arabic: "أنت" },
      { english: "He is", kurdish: "ئەو (نێر) ...ە", arabic: "هو" },
      { english: "She is", kurdish: "ئەو (مێ) ...ە", arabic: "هي" },
      { english: "My name", kurdish: "ناوی من", arabic: "اسمي" },
      { english: "Your name", kurdish: "ناوی تۆ", arabic: "اسمك" },
      { english: "Nice to meet you", kurdish: "خۆشحاڵم بە ناسینت", arabic: "سررت بلقائك" },
    ],
    voices: [
      { prompt: "بڵێ ناوت چییە و خۆت بناسێنە", target: "My name is John. Nice to meet you.", targetKurdish: "ناوی من جۆنە. خۆشحاڵم بە ناسینت.", promptAr: "قل اسمي جون وسررت بلقائك", targetArabic: "اسمي جون. سررت بلقائك." },
      { prompt: "بڵێ ئەو هاوڕێی منە", target: "She is my friend.", targetKurdish: "ئەو هاوڕێی منە.", promptAr: "قل هي صديقتي", targetArabic: "هي صديقتي." },
      { prompt: "بڵێ ئەو مامۆستایە", target: "He is a teacher.", targetKurdish: "ئەو مامۆستایە.", promptAr: "قل هو معلم", targetArabic: "هو معلم." },
    ],
    sentences: [
      { english: ["What", "is", "your", "name"], kurdish: "ناوت چییە؟", arabic: "ما هو اسمك؟" },
      { english: ["I", "am", "a", "student", "and", "she", "is", "a", "teacher"], kurdish: "من قوتابیم و ئەویش مامۆستایە", arabic: "أنا طالب وهي معلمة" },
      { english: ["Nice", "to", "meet", "you", "my", "friend"], kurdish: "خۆشحاڵم بە ناسینت، هاوڕێم", arabic: "سررت بلقائك يا صديقي" },
      { english: ["He", "is", "my", "brother", "and", "she", "is", "my", "sister"], kurdish: "ئەو برای منە و ئەویش خوشکی منە", arabic: "هو أخي وهي أختي" },
    ],
    fillBlanks: [
      { parts: ["My", "is John."], hint: "ناوی من جۆنە.", answer: "name", wrongs: ["teacher", "student", "nice"], arabicHint: "اسمي جون.", arabicParts: ["اسمي", "جون."], arabicAnswer: "اسمي", arabicWrongs: ["معلم", "طالب", "جميل"] },
      { parts: ["Nice to", "you."], hint: "خۆشحاڵم بە ناسینت.", answer: "meet", wrongs: ["name", "friend", "is"], arabicHint: "سررت بلقائك.", arabicParts: ["سررت بـ", "ك."], arabicAnswer: "لقاء", arabicWrongs: ["اسم", "صديق", "يكون"] },
      { parts: ["She", "my friend."], hint: "ئەو هاوڕێی منە.", answer: "is", wrongs: ["am", "are", "meet"], arabicHint: "هي صديقتي.", arabicParts: ["هي", "صديقتي."], arabicAnswer: "صديقتي", arabicWrongs: ["أنا", "تكون", "لقاء"] },
    ],
    conversations: [
      {
        situation: "خۆناساندن بە هاوپۆلێکی نوێ",
        theyAsk: "Hello! My name is Sarah. What is your name?",
        correct: "Hi Sarah! My name is Karwan. Nice to meet you.",
        wrong1: "She is my friend.",
        wrong2: "Goodbye, my name is John.",
        wrong3: "No, thank you.",
        explanation: "لەسەرەتای خۆناساندندا دەڵێیت 'My name is...' و لە کۆتاییدا دەڵێیت 'Nice to meet you'.",
        situationAr: "التعريف بالنفس لزميل جديد",
        theyAskAr: "مرحبا! اسمي سارة. ما هو اسمك؟",
        correctAr: "مرحبا سارة! اسمي كاروان. سررت بلقائك.",
        wrong1Ar: "هي صديقتي.",
        wrong2Ar: "مع السلامة، اسمي جون.",
        wrong3Ar: "لا، شكراً لك.",
        explanationAr: "في بداية التعريف بالذات تقول 'My name is...' وفي النهاية 'Nice to meet you'."
      },
      {
        situation: "ناساندنی هاوڕێیەک بە کەسێکی تر",
        theyAsk: "Who is the boy next to you?",
        correct: "He is my brother. His name is Ahmed.",
        wrong1: "Nice to meet you brother.",
        wrong2: "I am a student.",
        wrong3: "Yes, please.",
        explanation: "بۆ ناساندنی کەسێکی تر دەڵێیت 'He is...' بۆ نێر و 'She is...' بۆ مێ.",
        situationAr: "تعريف شخص بصديقك",
        theyAskAr: "من الولد الذي بجانبك؟",
        correctAr: "هو أخي. اسمه أحمد.",
        wrong1Ar: "سررت بلقائك يا أخي.",
        wrong2Ar: "أنا طالب.",
        wrong3Ar: "نعم، من فضلك.",
        explanationAr: "لتعريف شخص آخر نستخدم 'He is...' للمذكر و 'She is...' للمؤنث."
      }
    ]
  },

  // Lesson 2: Basic Feelings & State
  {
    topic: "Feelings & State", topicKu: "هەستەکان", topicAr: "المشاعر والحالة",
    words: [
      { english: "Fine", kurdish: "باشم (ئاساییم)", arabic: "بخير" },
      { english: "Happy", kurdish: "دڵخۆش", arabic: "سعيد" },
      { english: "Sad", kurdish: "دڵتەنگ", arabic: "حزين" },
      { english: "Tired", kurdish: "ماندوو", arabic: "تعبان" },
      { english: "Angry", kurdish: "توڕە", arabic: "غاضب" },
      { english: "Good", kurdish: "باش", arabic: "جيد" },
      { english: "Bad", kurdish: "خراپ", arabic: "سيء" },
      { english: "Okay", kurdish: "ئاسایی (باش)", arabic: "بخير (لا بأس)" },
    ],
    voices: [
      { prompt: "بڵێ من باشم، سوپاس", target: "I am fine, thank you.", targetKurdish: "من باشم، سوپاس.", promptAr: "قل أنا بخير، شكراً لك", targetArabic: "أنا بخير، شكراً لك." },
      { prompt: "بڵێ ماندوویت", target: "I am tired today.", targetKurdish: "من ئەمڕۆ ماندووم.", promptAr: "قل أنا تعبان اليوم", targetArabic: "أنا تعبان اليوم." },
      { prompt: "بڵێ ئەو دڵخۆشە", target: "She is very happy.", targetKurdish: "ئەو زۆر دڵخۆشە.", promptAr: "قل هي سعيدة جداً", targetArabic: "هي سعيدة جداً." },
    ],
    sentences: [
      { english: ["How", "are", "you", "today", "my", "friend"], kurdish: "چۆنیت ئەمڕۆ هاوڕێم؟", arabic: "كيف حالك اليوم يا صديقي؟" },
      { english: ["I", "am", "sad", "because", "my", "dog", "is", "sick"], kurdish: "من دڵتەنگم چونکە سەگەکەم نەخۆشە", arabic: "أنا حزين لأن كلبي مريض" },
      { english: ["Are", "you", "okay", "or", "are", "you", "angry"], kurdish: "تۆ باشیت یان توڕەیت؟", arabic: "هل أنت بخير أم أنت غاضب؟" },
      { english: ["Everything", "is", "good", "thank", "you", "very", "much"], kurdish: "هەموو شتێک باشە، زۆر سوپاس", arabic: "كل شيء جيد، شكراً جزيلاً لك" },
    ],
    fillBlanks: [
      { parts: ["I am", ", thank you! And you?"], hint: "من باشم، سوپاس! ئەی تۆ؟", answer: "fine", wrongs: ["sad", "angry", "tired"], arabicHint: "أنا بخير، شكراً لك! وأنت؟", arabicParts: ["أنا", "، شكراً لك! وأنت؟"], arabicAnswer: "بخير", arabicWrongs: ["حزين", "غاضب", "تعبان"] },
      { parts: ["She is crying; she must be", "."], hint: "ئەو دەگری؛ دەبێت دڵتەنگ بێت.", answer: "sad", wrongs: ["happy", "fine", "good"], arabicHint: "هي تبكي؛ لا بد أنها حزينة.", arabicParts: ["هي تبكي؛ لا بد أنها", "."], arabicAnswer: "حزينة", arabicWrongs: ["سعيدة", "بخير", "جيدة"] },
      { parts: ["Are you", "after work?"], hint: "ئایا دوای کار ماندوویت؟", answer: "tired", wrongs: ["good", "happy", "okay"], arabicHint: "هل أنت تعبان بعد العمل؟", arabicParts: ["هل أنت", "بعد العمل؟"], arabicAnswer: "تعبان", arabicWrongs: ["جيد", "سعيد", "بخير"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن لە بارودۆخی کەسێک",
        theyAsk: "How are you doing today?",
        correct: "I am doing well, thank you. And you?",
        wrong1: "No, thank you.",
        wrong2: "Goodbye, see you.",
        wrong3: "Nice to meet you, I am tired.",
        explanation: "لە وەڵامی 'How are you' دەڵێیت 'I am doing well' یان 'I am fine' و دەتوانیت بپرسیتەوە 'And you?'.",
        situationAr: "السؤال عن حال شخص ما",
        theyAskAr: "كيف حالك اليوم؟",
        correctAr: "أنا بخير، شكراً لك. وأنت؟",
        wrong1Ar: "لا، شكراً لك.",
        wrong2Ar: "مع السلامة، أراك لاحقاً.",
        wrong3Ar: "سررت بلقائك، أنا تعبان.",
        explanationAr: "في جواب 'How are you' نقول 'I am fine' ونسأل المقابل عن حاله بـ 'And you?'."
      },
      {
        situation: "بینینی هاوڕێیەک کە کێشەی هەیە",
        theyAsk: "You look very tired.",
        correct: "Yes, I had a very long day at work.",
        wrong1: "Nice to meet you.",
        wrong2: "Good morning, thank you.",
        wrong3: "I am very happy and sad.",
        explanation: "کاتێک کەسێک دەڵێت ماندوویت، دەتوانیت بڵێیت 'Yes' و هۆکارەکەی کورت بکەیتەوە.",
        situationAr: "رؤية صديق يبدو عليه التعب",
        theyAskAr: "تبدو تعباناً جداً.",
        correctAr: "نعم، كان لدي يوم طويل جداً في العمل.",
        wrong1Ar: "سررت بلقائك.",
        wrong2Ar: "صباح الخير، شكراً لك.",
        wrong3Ar: "أنا سعيد وحزين جداً.",
        explanationAr: "عندما يلاحظ شخص تعبك، يمكنك تأكيد ذلك بـ 'Yes' وشرح السبب باختصار."
      }
    ]
  },

  // Lesson 3: Numbers & Age
  {
    topic: "Numbers & Age", topicKu: "ژمارە و تەمەن", topicAr: "الأرقام والعمر",
    words: [
      { english: "One", kurdish: "یەک", arabic: "واحد" },
      { english: "Two", kurdish: "دوو", arabic: "اثنان" },
      { english: "Three", kurdish: "سێ", arabic: "ثلاثة" },
      { english: "Four", kurdish: "چوار", arabic: "أربعة" },
      { english: "Five", kurdish: "پێنج", arabic: "خمسة" },
      { english: "Ten", kurdish: "دە", arabic: "عشرة" },
      { english: "Years old", kurdish: "ساڵ تەمەن", arabic: "سنة من العمر" },
      { english: "How old", kurdish: "تەمەن چەند", arabic: "كم عمر" },
    ],
    voices: [
      { prompt: "بڵێ تەمەنت دە ساڵە", target: "I am ten years old.", targetKurdish: "تەمەنم دە ساڵە.", promptAr: "قل عمري عشر سنوات", targetArabic: "عمري عشر سنوات." },
      { prompt: "بڵێ دوو پەرتووکت هەیە", target: "I have two books.", targetKurdish: "دوو پەرتووکم هەیە.", promptAr: "قل لدي كتابان", targetArabic: "لدي كتابان." },
      { prompt: "بپرس تەمەنی چەندە", target: "How old is your brother?", targetKurdish: "تەمەنی براکەت چەندە؟", promptAr: "اسأل عن عمر أخيه", targetArabic: "كم عمر أخيك؟" },
    ],
    sentences: [
      { english: ["How", "old", "are", "you"], kurdish: "تەمەنت چەند ساڵە؟", arabic: "كم عمرك؟" },
      { english: ["My", "sister", "is", "five", "years", "old"], kurdish: "خوشکەکەم تەمەنی پێنج ساڵە", arabic: "أختي تبلغ من العمر خمس سنوات" },
      { english: ["I", "see", "three", "cats", "and", "four", "dogs"], kurdish: "سێ پشیلە و چوار سەگ دەبینم", arabic: "أرى ثلاثة قطط وأربعة كلاب" },
      { english: ["One", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"], kurdish: "یەک، دوو، سێ، چوار، پێنج، شەش، حەوت، هەشت، نۆ، دە", arabic: "واحد، اثنان، ثلاثة، أربعة، خمسة، ستة، سبعة، ثمانية، تسعة، عشرة" },
    ],
    fillBlanks: [
      { parts: ["I am five", "old."], hint: "من تەمەنم پێنج ساڵە.", answer: "years", wrongs: ["old", "how", "brother"], arabicHint: "عمري خمس سنوات.", arabicParts: ["عمري خمس", "."], arabicAnswer: "سنوات", arabicWrongs: ["قديم", "كم", "أخي"] },
      { parts: ["How", "are you?"], hint: "تەمەنت چەندە؟", answer: "old", wrongs: ["years", "name", "are"], arabicHint: "كم عمرك؟", arabicParts: ["كم", "ك؟"], arabicAnswer: "عمر", arabicWrongs: ["سنوات", "اسم", "تكون"] },
      { parts: ["I have", "hands and ten fingers."], hint: "من دوو دەست و دە پەنجەم هەیە.", answer: "two", wrongs: ["one", "five", "years"], arabicHint: "لدي يدان وعشرة أصابع.", arabicParts: ["لدي", "يدان وعشرة أصابع."], arabicAnswer: "اثنان", arabicWrongs: ["واحد", "خمسة", "سنوات"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن لە تەمەنی کەسێک",
        theyAsk: "How old are you?",
        correct: "I am twenty years old. And you?",
        wrong1: "I am fine, thank you.",
        wrong2: "My name is John.",
        wrong3: "I have two hands.",
        explanation: "وەڵامی دروست بۆ پرسیاری تەمەن بە ژمارە دەبێت 'I am... years old'.",
        situationAr: "السؤال عن عمر شخص ما",
        theyAskAr: "كم عمرك؟",
        correctAr: "عمري عشرون سنة. وأنت؟",
        wrong1Ar: "أنا بخير، شكراً لك.",
        wrong2Ar: "اسمي جون.",
        wrong3Ar: "لدي يدان.",
        explanationAr: "الجواب الصحيح عن سؤال العمر يكون بالرقم وصيغة 'I am... years old'."
      },
      {
        situation: "پرسیارکردن لە ژمارەی منداڵەکان",
        theyAsk: "How many sisters do you have?",
        correct: "I have three sisters and one brother.",
        wrong1: "I am five years old.",
        wrong2: "Nice to meet you.",
        wrong3: "Yes, please.",
        explanation: "وەڵامی پرسیاری 'How many' پێویستی بە ژمارە هەیە (three, one).",
        situationAr: "السؤال عن عدد الأخوات",
        theyAskAr: "كم أخت لديك؟",
        correctAr: "لدي ثلاث أخوات وأخ واحد.",
        wrong1Ar: "عمري خمس سنوات.",
        wrong2Ar: "سررت بلقائك.",
        wrong3Ar: "نعم، من فضلك.",
        explanationAr: "الجواب عن سؤال 'How many' يتطلب استخدام الأرقام."
      }
    ]
  },

  // Lesson 4: Everyday Objects
  {
    topic: "Everyday Objects", topicKu: "کەلوپەلی ڕۆژانە", topicAr: "الأشياء اليومية",
    words: [
      { english: "Book", kurdish: "پەرتووک (کتێب)", arabic: "كتاب" },
      { english: "Pen", kurdish: "پێنوس", arabic: "قلم" },
      { english: "Key", kurdish: "کلیل", arabic: "مفتاح" },
      { english: "Phone", kurdish: "مۆبایل (تەلەفۆن)", arabic: "هاتف" },
      { english: "Bag", kurdish: "جانتا", arabic: "حقيبة" },
      { english: "Water", kurdish: "ئاو", arabic: "ماء" },
      { english: "Bread", kurdish: "نان", arabic: "خبز" },
      { english: "Coffee", kurdish: "قاوە", arabic: "قهوة" },
    ],
    voices: [
      { prompt: "بڵێ ئاو دەخۆیتەوە", target: "I drink water every day.", targetKurdish: "من هەموو ڕۆژێک ئاو دەخۆمەوە.", promptAr: "قل أنا أشرب الماء كل يوم", targetArabic: "أنا أشرب الماء كل يوم." },
      { prompt: "بپرس کلیلی من لەکوێیە", target: "Where is my key?", targetKurdish: "کلیلی من لەکوێیە؟", promptAr: "اسأل أين مفتاحي", targetArabic: "أين مفتاحي؟" },
      { prompt: "داوای قاوە بکە", target: "Do you want coffee or tea?", targetKurdish: "قاوەت دەوێت یان چا؟", promptAr: "اطلب قهوة", targetArabic: "هل تريد قهوة أم شاي؟" },
    ],
    sentences: [
      { english: ["Please", "put", "the", "book", "in", "my", "bag"], kurdish: "تکایە کتێبەکە بخەرە ناو جانتاکەمەوە", arabic: "من فضلك ضع الكتاب في حقيبتي" },
      { english: ["I", "need", "a", "pen", "to", "write", "my", "name"], kurdish: "پێویستم بە پێنوسێکە بۆ نووسینی ناوم", arabic: "أحتاج إلى قلم لكتابة اسمي" },
      { english: ["Here", "is", "some", "fresh", "bread", "and", "water"], kurdish: "ئەمەش کەمێک نانی تازە و ئاوە", arabic: "هذا بعض الخبز الطازج والماء" },
      { english: ["Where", "is", "your", "phone", "my", "friend"], kurdish: "مۆبایلەکەت لەکوێیە هاوڕێم؟", arabic: "أين هاتفك يا صديقي؟" },
    ],
    fillBlanks: [
      { parts: ["Where is my", "? I cannot open the door."], hint: "کلیلی من لەکوێیە؟ ناتوانم دەرگاکە بکەمەوە.", answer: "key", wrongs: ["pen", "bag", "water"], arabicHint: "أين مفتاحي؟ لا أستطيع فتح الباب.", arabicParts: ["أين", "؟ لا أستطيع فتح الباب."], arabicAnswer: "مفتاحي", arabicWrongs: ["قلمي", "حقيبتي", "مائي"] },
      { parts: ["I have a black", "for school."], hint: "جانتاکەم ڕەشە بۆ قوتابخانە.", answer: "bag", wrongs: ["key", "coffee", "phone"], arabicHint: "لدي حقيبة سوداء للمدرسة.", arabicParts: ["لدي", "سوداء للمدرسة."], arabicAnswer: "حقيبة", arabicWrongs: ["مفتاح", "قهوة", "هاتف"] },
      { parts: ["Would you like a glass of cold", "?"], hint: "پەرداخێک ئاوی ساردت دەوێت؟", answer: "water", wrongs: ["bread", "pen", "key"], arabicHint: "هل تريد كوباً من الماء البارد؟", arabicParts: ["هل تريد كوباً من", "البارد؟"], arabicAnswer: "الماء", arabicWrongs: ["الخبز", "القلم", "المفتاح"] },
    ],
    conversations: [
      {
        situation: "داواکردنی پێنوس بۆ نووسین",
        theyAsk: "Can you sign this document, please?",
        correct: "Yes, but I need a pen. Do you have one?",
        wrong1: "Where is my key?",
        wrong2: "I drink water every day.",
        wrong3: "The bag is black.",
        explanation: "بۆ نووسین یان واژووکردنی بەڵگەنامە، پێویستت بە پێنوس (pen) دەبێت.",
        situationAr: "طلب قلم للكتابة",
        theyAskAr: "هل يمكنك توقيع هذه الوثيقة من فضلك؟",
        correctAr: "نعم، ولكني أحتاج إلى قلم. هل لديك واحد؟",
        wrong1Ar: "أين مفتاحي؟",
        wrong2Ar: "أنا أشرب الماء كل يوم.",
        wrong3Ar: "الحقيبة سوداء.",
        explanationAr: "للكتابة أو التوقيع على الأوراق، ستحتاج إلى قلم (pen)."
      },
      {
        situation: "پێشنیاری نان و ئاو بۆ میوان",
        theyAsk: "I am very hungry after the journey.",
        correct: "Please sit down. Here is some fresh bread and water.",
        wrong1: "This is my phone.",
        wrong2: "Do you want coffee in your bag?",
        wrong3: "I have three keys.",
        explanation: "'fresh bread and water' وەڵامێکی گونجاو و لێبوردەییە بۆ برسییەتی میوان.",
        situationAr: "تقديم الخبز والماء للضيف",
        theyAskAr: "أنا جائع جداً بعد السفر.",
        correctAr: "تفضل بالجلوس. هذا بعض الخبز الطازج والماء.",
        wrong1Ar: "هذا هاتفي.",
        wrong2Ar: "هل تريد قهوة في حقيبتك؟",
        wrong3Ar: "لدي ثلاثة مفاتيح.",
        explanationAr: "تقديم الخبز والماء للضيف الجائع هو الرد اللائق والسريع."
      }
    ]
  },

  // Lesson 5: Simple Actions & Verbs
  {
    topic: "Simple Actions", topicKu: "کردارە سادەکان", topicAr: "الأفعال البسيطة",
    words: [
      { english: "Eat", kurdish: "خواردن", arabic: "أكل" },
      { english: "Drink", kurdish: "خواردنەوە", arabic: "شرب" },
      { english: "Go", kurdish: "ڕۆیشتن", arabic: "ذهاب" },
      { english: "Come", kurdish: "هاتن", arabic: "مجيء" },
      { english: "Want", kurdish: "ویستن (دەمەوێت)", arabic: "يريد" },
      { english: "Like", kurdish: "حەزلێبوون", arabic: "يحب (يعجبه)" },
      { english: "Have", kurdish: "هەبوونی شتێک", arabic: "لديه" },
      { english: "See", kurdish: "بینین", arabic: "يرى" },
    ],
    voices: [
      { prompt: "بڵێ حەزت لە قاوەیە", target: "I like coffee in the morning.", targetKurdish: "من حەزم لە قاوەیە لە بەیانیاندا.", promptAr: "قل أنا أحب القهوة صباحاً", targetArabic: "أنا أحب القهوة في الصباح." },
      { prompt: "بڵێ دەتەوێت بچیتە ماڵەوە", target: "I want to go home now.", targetKurdish: "دەمەوێت ئێستا بچمە ماڵەوە.", promptAr: "قل أريد الذهاب للمنزل الآن", targetArabic: "أريد الذهاب إلى المنزل الآن." },
      { prompt: "داوای هاتنە ژوورەوە بکە", target: "Come here and eat some bread.", targetKurdish: "وەرە ئێرە و کەمێک نان بخۆ.", promptAr: "اطلب منه المجيء والأكل", targetArabic: "تعال إلى هنا وكل بعض الخبز." },
    ],
    sentences: [
      { english: ["I", "want", "to", "drink", "a", "glass", "of", "cold", "water"], kurdish: "دەمەوێت پەرداخێک ئاوی سارد بخۆمەوە", arabic: "أريد أن أشرب كوباً من الماء البارد" },
      { english: ["Do", "you", "see", "the", "black", "cat", "in", "the", "garden"], kurdish: "ئایا پشیلە ڕەشەکە لە باخچەکەدا دەبینیت؟", arabic: "هل ترى القطة السوداء في الحديقة؟" },
      { english: ["We", "have", "a", "meeting", "at", "school", "today"], kurdish: "ئێمە ئەمڕۆ کۆبوونەوەیەکمان لە قوتابخانە هەیە", arabic: "لدينا اجتماع في المدرسة اليوم" },
      { english: ["Please", "go", "to", "the", "shop", "and", "buy", "bread"], kurdish: "تکایە بڕۆ بۆ دوکانەکە و نان بکڕە", arabic: "من فضلك اذهب إلى المتجر واشترِ خبزاً" },
    ],
    fillBlanks: [
      { parts: ["I", "coffee, but I love tea."], hint: "حەزم لە قاوە هەیە، بەڵام چام خۆش دەوێت.", answer: "like", wrongs: ["want", "go", "eat"], arabicHint: "يعجبني الشاي، لكني أحب القهوة.", arabicParts: ["أنا", "القهوة، لكني أحب الشاي."], arabicAnswer: "أحب", arabicWrongs: ["أريد", "أذهب", "آكل"] },
      { parts: ["I am hungry; I want to", "some food."], hint: "من برسیومە؛ دەمەوێت کەمێک خواردن بخۆم.", answer: "eat", wrongs: ["drink", "see", "come"], arabicHint: "أنا جائع؛ أريد أن آكل بعض الطعام.", arabicParts: ["أنا جائع؛ أريد أن", "بعض الطعام."], arabicAnswer: "آكل", arabicWrongs: ["أشرب", "أرى", "آتي"] },
      { parts: ["Do you", "a phone in your bag?"], hint: "ئایا مۆبایلت لەناو جانتاکەتدا هەیە؟", answer: "have", wrongs: ["go", "like", "see"], arabicHint: "هل لديك هاتف في حقيبتك؟", arabicParts: ["هل", "هاتف في حقيبتك؟"], arabicAnswer: "لديك", arabicWrongs: ["تذهب", "تحب", "ترى"] },
    ],
    conversations: [
      {
        situation: "کاتێک تینووتە و داوای ئاو دەکەیت",
        theyAsk: "Are you okay? You look thirsty.",
        correct: "Yes, I want to drink some water, please.",
        wrong1: "I want to go school.",
        wrong2: "I see the black cat.",
        wrong3: "I have a meeting.",
        explanation: "بۆ تینوویەتی، کردارەکە 'drink water' (ئاو خواردنەوە) دەبێت.",
        situationAr: "عندما تشعر بالعطش وتطلب الماء",
        theyAskAr: "هل أنت بخير؟ تبدو عطشاناً.",
        correctAr: "نعم، أريد أن أشرب بعض الماء من فضلك.",
        wrong1Ar: "أريد الذهاب للمدرسة.",
        wrong2Ar: "أنا أرى القطة السوداء.",
        wrong3Ar: "لدي اجتماع.",
        explanationAr: "للعطش، نستخدم الفعل 'drink' (يشرب) والماء."
      },
      {
        situation: "پێشنیارکردنی ڕۆیشتن بۆ پارک",
        theyAsk: "The weather is very good today.",
        correct: "I agree! Let's go to the park together.",
        wrong1: "Eat some bread please.",
        wrong2: "I want to see the key.",
        wrong3: "Come here and drink tea.",
        explanation: "لە کاتی وەڵامدانەوەی کەشوهەوای خۆش، ڕۆیشتن بۆ پارک 'go to the park' پێکەوە زۆر گونجاوە.",
        situationAr: "اقتراح الذهاب للحديقة بيوم مشمس",
        theyAskAr: "الطقس جميل جداً اليوم.",
        correctAr: "أنا أوافقك الرأي! لنذهب إلى الحديقة معاً.",
        wrong1Ar: "كل بعض الخبز من فضلك.",
        wrong2Ar: "أريد أن أرى المفتاح.",
        wrong3Ar: "تعال إلى هنا واشرب الشاي.",
        explanationAr: "عندما يكون الطقس جميلاً، فإن الذهاب للحديقة هو الاقتراح الأفضل."
      }
    ]
  },

  // Lesson 6: Colors
  {
    topic: "Colors", topicKu: "ڕەنگەکان", topicAr: "الألوان",
    words: [
      { english: "Red", kurdish: "سوور", arabic: "أحمر" },
      { english: "Blue", kurdish: "شین", arabic: "أزرق" },
      { english: "Green", kurdish: "سەوز", arabic: "أخضر" },
      { english: "Yellow", kurdish: "زەرد", arabic: "أصفر" },
      { english: "Black", kurdish: "ڕەش", arabic: "أسود" },
      { english: "White", kurdish: "سپى", arabic: "أبيض" },
      { english: "Orange", kurdish: "پرتەقاڵی", arabic: "برتقالي" },
      { english: "Favorite color", kurdish: "ڕەنگی دڵخواز", arabic: "اللون المفضل" },
    ],
    voices: [
      { prompt: "بڵێ حەزت لە ڕەنگی شینە", target: "My favorite color is blue.", targetKurdish: "ڕەنگی دڵخوازی من شینە.", promptAr: "قل لوني المفضل هو الأزرق", targetArabic: "لوني المفضل هو الأزرق." },
      { prompt: "وەسفی سێوێک بکە بە ڕەنگ", target: "This is a red apple.", targetKurdish: "ئەمە سێوێکی سوورە.", promptAr: "صف تفاحة باللون", targetArabic: "هذه تفاحة حمراء." },
      { prompt: "بڵێ ئۆتۆمبێلەکە ڕەشە", target: "The car is black and clean.", targetKurdish: "ئۆتۆمبێلەکە ڕەش و خاوێنە.", promptAr: "قل السيارة سوداء", targetArabic: "السيارة سوداء ونظيفة." },
    ],
    sentences: [
      { english: ["The", "sky", "is", "blue", "and", "the", "grass", "is", "green"], kurdish: "ئاسمان شینە و سەوزە گیاکەش سەوزە", arabic: "السماء زرقاء والعشب أخضر" },
      { english: ["Do", "you", "want", "the", "white", "bag", "or", "the", "yellow", "one"], kurdish: "جانتا سپییەکەت دەوێت یان زەردەکە؟", arabic: "هل تريد الحقيبة البيضاء أم الصفراء؟" },
      { english: ["Oranges", "are", "orange", "and", "bananas", "are", "yellow"], kurdish: "پرتەقاڵ پرتەقاڵییە و مۆز زەردە", arabic: "البرتقال برتقالي والموز أصفر" },
      { english: ["He", "has", "a", "black", "pen", "in", "his", "hand"], kurdish: "ئەو پێنوسێکی ڕەشی لە دەستدایە", arabic: "لديه قلم أسود في يده" },
    ],
    fillBlanks: [
      { parts: ["My favorite color is", "because I love the sky."], hint: "ڕەنگی دڵخوازم شینە چونکە حەزم لە ئاسمانە.", answer: "blue", wrongs: ["red", "black", "white"], arabicHint: "لوني المفضل هو الأزرق لأني أحب السماء.", arabicParts: ["لوني المفضل هو", "لأني أحب السماء."], arabicAnswer: "الأزرق", arabicWrongs: ["الأحمر", "الأسود", "الأبيض"] },
      { parts: ["Leaves are usually", "in summer."], hint: "گەڵاکان بە شێوەیەکی گشتی سەوزن لە هاویندا.", answer: "green", wrongs: ["yellow", "white", "black"], arabicHint: "الأوراق عادة خضراء في الصيف.", arabicParts: ["الأوراق عادة", "في الصيف."], arabicAnswer: "خضراء", arabicWrongs: ["صفراء", "بيضاء", "سوداء"] },
      { parts: ["This is a", "banana from the market."], hint: "ئەمە مۆزێکی زەردە لە بازاڕەکەوە.", answer: "yellow", wrongs: ["blue", "orange", "black"], arabicHint: "هذه موزة صفراء من السوق.", arabicParts: ["هذه موزة", "من السوق."], arabicAnswer: "صفراء", arabicWrongs: ["زرقاء", "برتقالية", "سوداء"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی ڕەنگی دڵخواز",
        theyAsk: "What is your favorite color?",
        correct: "My favorite color is blue. What about you?",
        wrong1: "The car is clean.",
        wrong2: "This is a red apple in the bag.",
        wrong3: "I have a black pen.",
        explanation: "وەڵامی ڕاست ڕاستەوخۆ ناوی ڕەنگەکە دەڵێت: 'My favorite color is blue'.",
        situationAr: "السؤال عن اللون المفضل",
        theyAskAr: "ما هو لونك المفضل؟",
        correctAr: "لوني المفضل هو الأزرق. ماذا عنك؟",
        wrong1Ar: "السيارة نظيفة.",
        wrong2Ar: "هذه تفاحة حمراء في الحقيبة.",
        wrong3Ar: "لدي قلم أسود.",
        explanationAr: "الجواب الصحيح يذكر اللون المفضل للمستخدم مباشرة."
      },
      {
        situation: "هەڵبژاردنی جانتا لە فرۆشگا",
        theyAsk: "We have this bag in white and black. Which one do you want?",
        correct: "I want the black bag, please. It stays clean longer.",
        wrong1: "The sky is blue.",
        wrong2: "Green grass is good.",
        wrong3: "Oranges are orange.",
        explanation: "هەڵبژاردنی ڕەنگی گونجاو لەگەڵ 'please' نیشانەی بازاڕکردنی دروستە.",
        situationAr: "اختيار حقيبة في المتجر",
        theyAskAr: "لدينا هذه الحقيبة باللونين الأبيض والأسود. أي واحد تريد؟",
        correctAr: "أريد الحقيبة السوداء من فضلك. تبقى نظيفة لفترة أطول.",
        wrong1Ar: "السماء زرقاء.",
        wrong2Ar: "العشب الأخضر جيد.",
        wrong3Ar: "البرتقال برتقالي.",
        explanationAr: "اختيار اللون المناسب مع كلمة 'من فضلك' هو الأسلوب الصحيح للتسوق."
      }
    ]
  },

  // Lesson 7: Family Members
  {
    topic: "Family Members", topicKu: "خێزان", topicAr: "أفراد العائلة",
    words: [
      { english: "Mother", kurdish: "دایک", arabic: "أم" },
      { english: "Father", kurdish: "باوک", arabic: "أب" },
      { english: "Brother", kurdish: "برا", arabic: "أخ" },
      { english: "Sister", kurdish: "خوشک", arabic: "أخت" },
      { english: "Son", kurdish: "کوڕ", arabic: "ابن" },
      { english: "Daughter", kurdish: "کچ", arabic: "ابنة" },
      { english: "Family", kurdish: "خێزان", arabic: "عائلة" },
      { english: "Parents", kurdish: "دایک و باوک (سەرپەرشتیار)", arabic: "الوالدان" },
    ],
    voices: [
      { prompt: "بڵێ خێزانەکەت خۆش دەوێت", target: "I love my family very much.", targetKurdish: "خێزانەکەمم زۆر خۆش دەوێت.", promptAr: "قل أنا أحب عائلتي كثيراً", targetArabic: "أنا أحب عائلتي كثيراً." },
      { prompt: "ناساندنی دایک", target: "This is my mother; her name is Sarah.", targetKurdish: "ئەمە دایکمە؛ ناوی سارایە.", promptAr: "تعريف بوالدتك", targetArabic: "هذه أمي؛ اسمها سارة." },
      { prompt: "بڵێ خوشکت هەیە", target: "I have one sister and two brothers.", targetKurdish: "یەک خوشک و دوو برام هەیە.", promptAr: "قل لديك أخت وأخوين", targetArabic: "لدي أخت واحدة وأخوين." },
    ],
    sentences: [
      { english: ["My", "father", "is", "a", "doctor", "at", "the", "hospital"], kurdish: "باوکم پزیشکە لە نەخۆشخانەکە", arabic: "أبي طبيب في المستشفى" },
      { english: ["Her", "daughter", "is", "five", "years", "old", "today"], kurdish: "کچەکەی تەمەنی پێنج ساڵە ئەمڕۆ", arabic: "ابنتها تبلغ من العمر خمس سنوات اليوم" },
      { english: ["They", "are", "my", "parents", "and", "I", "respect", "them"], kurdish: "ئەوان دایک و باوکمن و من ڕێزیان دەگرم", arabic: "هما والداي وأنا أحترمهما" },
      { english: ["My", "brother", "has", "a", "black", "dog", "at", "home"], kurdish: "براکەم سەگێکی ڕەشی لە ماڵەوە هەیە", arabic: "أخي لديه كلب أسود في المنزل" },
    ],
    fillBlanks: [
      { parts: ["My", "and father are my parents."], hint: "دایک و باوکم سەرپەرشتیارمن.", answer: "mother", wrongs: ["sister", "daughter", "family"], arabicHint: "أمي وأبي هما والداي.", arabicParts: ["", "وأبي هما والداي."], arabicAnswer: "أمي", arabicWrongs: ["أختي", "ابنتي", "عائلتي"] },
      { parts: ["He is my mother's son; he is my", "."], hint: "ئەو کوڕی دایکمە؛ ئەو برای منە.", answer: "brother", wrongs: ["father", "parents", "daughter"], arabicHint: "هو ابن أمي؛ إنه أخي.", arabicParts: ["هو ابن أمي؛ إنه", "."], arabicAnswer: "أخي", arabicWrongs: ["أبي", "والداي", "ابنتي"] },
      { parts: ["We live together; we are a happy", "."], hint: "ئێمە پێکەوە دەژین؛ ئێمە خێزانێکی دڵخۆشین.", answer: "family", wrongs: ["parents", "sister", "brother"], arabicHint: "نحن نعيش معاً؛ نحن عائلة سعيدة.", arabicParts: ["نحن نعيش معاً؛ نحن", "سعيدة."], arabicAnswer: "عائلة", arabicWrongs: ["والدان", "أخت", "أخ"] },
    ],
    conversations: [
      {
        situation: "ناساندنی باوک لە وێنەیەکدا",
        theyAsk: "Who is the tall man in this photo?",
        correct: "He is my father. He is a doctor at the hospital.",
        wrong1: "She is my mother, Sarah.",
        wrong2: "I love my family very much.",
        wrong3: "I have three sisters.",
        explanation: "بۆ ناساندنی باوک (نێر) دەڵێیت 'He is my father'.",
        situationAr: "تعريف بوالدك في صورة عائلية",
        theyAskAr: "من الرجل الطويل في هذه الصورة؟",
        correctAr: "هو أبي. إنه طبيب في المستشفى.",
        wrong1Ar: "هي أمي، سارة.",
        wrong2Ar: "أنا أحب عائلتي كثيراً.",
        wrong3Ar: "لدي ثلاث أخوات.",
        explanationAr: "لتعريف الأب (مذكر) نقول 'He is my father'."
      },
      {
        situation: "پرسیارکردن لە ئەندامانی خێزان",
        theyAsk: "Do you live alone in this big house?",
        correct: "No, I live with my parents and my younger sister.",
        wrong1: "My daughter is five years old.",
        wrong2: "Yes, I love my family.",
        wrong3: "He is my brother, John.",
        explanation: "'live with my parents' وەڵامێکی دروستە بۆ پرسیارکردنی دەربارەی نیشتەجێبوون.",
        situationAr: "السؤال عن السكن مع العائلة",
        theyAskAr: "هل تعيش بمفردك في هذا المنزل الكبير؟",
        correctAr: "لا، أنا أعيش مع والدي وأختي الصغيرة.",
        wrong1Ar: "ابنتي تبلغ من العمر خمس سنوات.",
        wrong2Ar: "نعم، أنا أحب عائلتي.",
        wrong3Ar: "هو أخي، جون.",
        explanationAr: "العيش مع الوالدين (live with my parents) رد مناسب على سؤال السكن."
      }
    ]
  },

  // Lesson 8: Basic Questions
  {
    topic: "Basic Questions", topicKu: "پرسیارە بنەڕەتییەکان", topicAr: "الأسئلة الأساسية",
    words: [
      { english: "Who", kurdish: "کێ", arabic: "من" },
      { english: "What", kurdish: "چی", arabic: "ماذا (ما)" },
      { english: "Where", kurdish: "لەکوێ", arabic: "أين" },
      { english: "Why", kurdish: "بۆچی", arabic: "لماذا" },
      { english: "When", kurdish: "کەی", arabic: "متى" },
      { english: "How", kurdish: "چۆن", arabic: "كيف" },
      { english: "Which", kurdish: "کام", arabic: "أي" },
      { english: "Whose", kurdish: "هی کێ", arabic: "لمن" },
    ],
    voices: [
      { prompt: "بپرس ناوت چییە", target: "What is your name?", targetKurdish: "ناوت چییە؟", promptAr: "اسأل ما هو اسمك", targetArabic: "ما هو اسمك؟" },
      { prompt: "بپرس کلیلی کێ لێرەیە", target: "Whose key is this on the table?", targetKurdish: "ئەم کلیلی کێیە لەسەر مێزەکە؟", promptAr: "اسأل لمن هذا المفتاح", targetArabic: "لمن هذا المفتاح على الطاولة؟" },
      { prompt: "بپرس بۆچی خەمبارە", target: "Why are you sad today?", targetKurdish: "بۆچی ئەمڕۆ دڵتەنگی؟", promptAr: "اسأل لماذا أنت حزين", targetArabic: "لماذا أنت حزين اليوم؟" },
    ],
    sentences: [
      { english: ["Where", "is", "the", "nearest", "shop", "my", "friend"], kurdish: "نزیکترین دوکان لەکوێیە، هاوڕێم؟", arabic: "أين أقرب متجر يا صديقي؟" },
      { english: ["When", "is", "your", "brother", "coming", "home"], kurdish: "کەی براکەت دەگەڕێتەوە بۆ ماڵەوە؟", arabic: "متى سيعود أخوك إلى المنزل؟" },
      { english: ["Which", "color", "do", "you", "prefer", "blue", "or", "red"], kurdish: "کام ڕەنگە پەسەند دەکەیت، شین یان سوور؟", arabic: "أي لون تفضل، الأزرق أم الأحمر؟" },
      { english: ["Who", "is the", "man", "in the", "black", "car"], kurdish: "ئەو پیاوە کێیە لەناو ئۆتۆمبێلە ڕەشەکەدا؟", arabic: "من هو الرجل في السيارة السوداء؟" },
    ],
    fillBlanks: [
      { parts: ["", "is my phone? I cannot find it."], hint: "مۆبایلەکەم لەکوێیە؟ ناتوانم بیدۆزمەوە.", answer: "Where", wrongs: ["Who", "Why", "When"], arabicHint: "أين هاتفي؟ لا يمكنني العثور عليه.", arabicParts: ["", "هاتفي؟ لا يمكنني العثور عليه."], arabicAnswer: "أين", arabicWrongs: ["من", "لماذا", "متى"] },
      { parts: ["", "are you laughing? Is it funny?"], hint: "بۆچی پێدەکەنی? ئایا کۆمیدییە؟", answer: "Why", wrongs: ["Who", "Where", "Whose"], arabicHint: "لماذا تضحك؟ هل الأمر مضحك؟", arabicParts: ["", "تضحك؟ هل الأمر مضحك؟"], arabicAnswer: "لماذا", arabicWrongs: ["من", "أين", "لمن"] },
      { parts: ["", "is that girl? She is nice."], hint: "ئەو کچە کێیە؟ ئەو کچێکی باشە.", answer: "Who", wrongs: ["What", "Which", "Why"], arabicHint: "من تلك الفتاة؟ إنها لطيفة.", arabicParts: ["", "تلك الفتاة؟ إنها لطيفة."], arabicAnswer: "من", arabicWrongs: ["ماذا", "أي", "لماذا"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی کاتی گەیشتن",
        theyAsk: "When is the English class?",
        correct: "It is at ten o'clock in the morning. Don't be late.",
        wrong1: "She is my mother, Sarah.",
        wrong2: "Because I am tired.",
        wrong3: "Which book do you want?",
        explanation: "وەڵامی پرسیاری 'When' (کەی) پێویستی بە کات و سەعات هەیە (ten o'clock).",
        situationAr: "السؤال عن موعد الدرس",
        theyAskAr: "متى يبدأ درس اللغة الإنجليزية؟",
        correctAr: "إنه في الساعة العاشرة صباحاً. لا تتأخر.",
        wrong1Ar: "هي أمي، سارة.",
        wrong2Ar: "لأني تعبان.",
        wrong3Ar: "أي كتاب تريد؟",
        explanationAr: "الجواب عن سؤال 'When' يتطلب تحديد وقت محدد."
      },
      {
        situation: "پرسیارکردن دەربارەی خاوەنی جانتاکە",
        theyAsk: "Whose bag is this in the room?",
        correct: "It is my sister's bag. She forgot it here.",
        wrong1: "Where is my phone?",
        wrong2: "What is your name?",
        wrong3: "Why are you sad?",
        explanation: "وەڵامی 'Whose' (هی کێ) خاوەندارێتی دیار دەکات (my sister's bag).",
        situationAr: "السؤال عن صاحب الحقيبة",
        theyAskAr: "لمن هذه الحقيبة في الغرفة؟",
        correctAr: "إنها حقيبة أختي. لقد نسيتها هنا.",
        wrong1Ar: "أين هاتفي؟",
        wrong2Ar: "ما هو اسمك؟",
        wrong3Ar: "لماذا أنت حزين؟",
        explanationAr: "الجواب عن 'Whose' يحدد ملكية الأشخاص للأشياء."
      }
    ]
  },

  // Lesson 9: Common Places
  {
    topic: "Common Places", topicKu: "شوێنە باوەکان", topicAr: "الأماكن الشائعة",
    words: [
      { english: "House", kurdish: "خانوو (ماڵ)", arabic: "منزل" },
      { english: "School", kurdish: "قوتابخانە", arabic: "مدرسة" },
      { english: "Shop", kurdish: "دوکان", arabic: "دكان (متجر)" },
      { english: "City", kurdish: "شار", arabic: "مدينة" },
      { english: "Work", kurdish: "کار (ئیش)", arabic: "عمل" },
      { english: "Room", kurdish: "ژوور", arabic: "غرفة" },
      { english: "Park", kurdish: "پارک", arabic: "حديقة" },
      { english: "Hospital", kurdish: "نەخۆشخانە", arabic: "مستشفى" },
    ],
    voices: [
      { prompt: "بڵێ دەچیت بۆ سەر کار", target: "I am going to work now.", targetKurdish: "من ئێستا دەچم بۆ سەر کار.", promptAr: "قل أنا ذاهب للعمل الآن", targetArabic: "أنا ذاهب إلى العمل الآن." },
      { prompt: "بڵێ لە ماڵەوەیت", target: "I am at home with my family.", targetKurdish: "من لە ماڵەوەم لەگەڵ خێزانەکەم.", promptAr: "قل أنا في المنزل مع عائلتي", targetArabic: "أنا في المنزل مع عائلتي." },
      { prompt: "بڵێ نەخۆشخانەکە دوورە", target: "The hospital is far from this city.", targetKurdish: "نەخۆشخانەکە لەم شارەوە دوورە.", promptAr: "قل المستشفى بعيد", targetArabic: "المستشفى بعيد عن هذه المدينة." },
    ],
    sentences: [
      { english: ["Let's", "walk", "in", "the", "green", "park", "this", "evening"], kurdish: "با ئەم ئێوارەیە لە پارکە سەوزەکەدا پیاسە بکەین", arabic: "لنلعب في الحديقة الخضراء هذا المساء" },
      { english: ["The", "shop", "is", "open", "until", "ten", "at", "night"], kurdish: "دوکانەکە تا کاتژمێر دە لە شەودا کراوەیە", arabic: "المحل مفتوح حتى العاشرة ليلاً" },
      { english: ["I", "live", "in", "a", "very", "beautiful", "and", "clean", "city"], kurdish: "من لە شارێکی زۆر جوان و خاوێندا دەژیم", arabic: "أنا أعيش في مدينة جميلة ونظيفة جداً" },
      { english: ["My", "sister", "is", "at", "school", "with", "her", "friends"], kurdish: "خوشکەکەم لە قوتابخانەیە لەگەڵ هاوڕێکانی", arabic: "أختي في المدرسة مع صديقاتها" },
    ],
    fillBlanks: [
      { parts: ["I am cleaning my", "because it is dirty."], hint: "ژوورەکەم پاکدەکەمەوە چونکە پیس بووە.", answer: "room", wrongs: ["city", "hospital", "work"], arabicHint: "أنا أنظف غرفتي لأنها متسخة.", arabicParts: ["أنا أنظف", "لأنها متسخة."], arabicAnswer: "غرفتي", arabicWrongs: ["مدينتي", "مستشفاي", "عملي"] },
      { parts: ["He works at the", "; he is a doctor."], hint: "ئەو لە نەخۆشخانەکە کار دەکات؛ ئەو پزیشکە.", answer: "hospital", wrongs: ["park", "shop", "school"], arabicHint: "يعمل في المستشفى؛ إنه طبيب.", arabicParts: ["يعمل في", "؛ إنه طبيب."], arabicAnswer: "المستشفى", arabicWrongs: ["الحديقة", "المتجر", "المدرسة"] },
      { parts: ["Let's meet at the coffee", "."], hint: "با لە دوکانی (کافی) قاوەکە یەکتر ببینین.", answer: "shop", wrongs: ["house", "park", "hospital"], arabicHint: "لنلتقِ في مقهى القهوة.", arabicParts: ["لنلتقِ في مقهى", "."], arabicAnswer: "القهوة", arabicWrongs: ["المنزل", "الحديقة", "المستشفى"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی شوێنی باوک",
        theyAsk: "Where is your father? Is he at home?",
        correct: "No, he is not. He is at work until ten tonight.",
        wrong1: "The city is beautiful.",
        wrong2: "Yes, I am cleaning my room.",
        wrong3: "He is a doctor at the hospital.",
        explanation: "وەڵامی گونجاو دیاریکردنی شوێنە کە کارە 'at work'.",
        situationAr: "السؤال عن مكان تواجد الأب",
        theyAskAr: "أين أبوك؟ هل هو في المنزل؟",
        correctAr: "لا، ليس كذلك. إنه في العمل حتى العاشرة ليلاً.",
        wrong1Ar: "المدينة جميلة.",
        wrong2Ar: "نعم، أنا أنظف غرفتي.",
        wrong3Ar: "هو طبيب في المستشفى.",
        explanationAr: "الرد المناسب يحدد مكان التواجد بالعمل 'at work'."
      },
      {
        situation: "بانگکردنی هاوڕێیەک بۆ بازاڕکردن",
        theyAsk: "I need to buy some fresh bread.",
        correct: "Let's go to the local shop. It is open now.",
        wrong1: "I live in a beautiful house.",
        wrong2: "The park is green.",
        wrong3: "I am going to school.",
        explanation: "بۆ کڕینی نان، چوون بۆ دوکان 'go to the shop' گونجاوترینە.",
        situationAr: "دعوة صديق للذهاب إلى المتجر لشراء الخبز",
        theyAskAr: "أحتاج لشراء بعض الخبز الطازج.",
        correctAr: "لنذهب إلى المتجر المحلي. إنه مفتوح الآن.",
        wrong1Ar: "أنا أعيش في منزل جميل.",
        wrong2Ar: "الحديقة خضراء.",
        wrong3Ar: "أنا ذاهب إلى المدرسة.",
        explanationAr: "لشراء الخبز، الاقتراح المناسب هو الذهاب إلى الدكان المحلي (go to the shop)."
      }
    ]
  }
];

export default normalUnit00;
