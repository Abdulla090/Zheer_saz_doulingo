import { UnitBank } from "../types";

// ── Unit 1: Basic Greetings & Introductions — 10 lessons ──────────────────────────
// Extremely basic, foundational English for absolute beginners, teaching core pronouns, verbs, and daily vocabulary in context.

const normalUnit00: UnitBank = [
  // Lesson 0: Basic Greetings & Hello
  {
    topic: "Greetings & Hello", topicKu: "سڵاوکردن", topicAr: "التحيات والترحيب",
    words: [
      { english: "Hello", kurdish: "سڵاو", arabic: "هلا" },
      { english: "Good morning", kurdish: "بەیانیت باش", arabic: "صباح الخير" },
      { english: "Good evening", kurdish: "ئێوارەت باش", arabic: "مسا الخير" },
      { english: "Goodbye", kurdish: "خوات لەگەڵ", arabic: "في أمان الله" },
      { english: "Yes", kurdish: "بەڵێ", arabic: "إي" },
      { english: "No", kurdish: "نەخێر", arabic: "لا" },
      { english: "Please", kurdish: "تکایە", arabic: "عفية" },
      { english: "Thank you", kurdish: "سوپاس", arabic: "شكراً" },
    ],
    voices: [
      { prompt: "بڵێ: سڵاو، بەیانیت باش", target: "Hello, good morning.", targetKurdish: "سڵاو، بەیانیت باش.", promptAr: "قول: هلا، صباح الخير", targetArabic: "هلا، صباح الخير." },
      { prompt: "بەڕێزەوە بڵێ: نەخێر، سوپاس", target: "No, thank you.", targetKurdish: "نەخێر، سوپاس.", promptAr: "قل بأدب: لا، شكراً", targetArabic: "لا، شكراً." },
      { prompt: "بەڕێزەوە بڵێ: بەڵێ، تکایە", target: "Yes, please.", targetKurdish: "بەڵێ، تکایە.", promptAr: "قل بأدب: إي، عفية", targetArabic: "إي، عفية." },
    ],
    sentences: [
      { english: ["Hello", "good", "evening", "my", "friend"], kurdish: "سڵاو، ئێوارەت باش هاوڕێم", arabic: "هلا، مسا الخير يا صاحبي" },
      { english: ["Goodbye", "and", "thank", "you", "very", "much"], kurdish: "خوات لەگەڵ و زۆر سوپاس", arabic: "في أمان الله وشكراً هواية" },
      { english: ["Yes", "please", "come", "in"], kurdish: "بەڵێ، تکایە وەرە ژوورەوە", arabic: "إي، تفضل فوت عفية" },
      { english: ["No", "thank", "you", "I", "am", "fine"], kurdish: "نەخێر، سوپاس من باشم", arabic: "لا، شكراً آني زين" },
    ],
    fillBlanks: [
      { parts: ["Good", ", my friend!"], hint: "بەیانیت باش، هاوڕێم!", answer: "morning", wrongs: ["evening", "goodbye", "please"], arabicHint: "صباح الخير، يا صاحبي!", arabicParts: ["صباح", "، يا صاحبي!"], arabicAnswer: "الخير", arabicWrongs: ["المساء", "الليل", "الظهر"] },
      { parts: ["No,", "you."], hint: "نەخێر، سوپاس.", answer: "thank", wrongs: ["please", "hello", "yes"], arabicHint: "لا، شكراً.", arabicParts: ["لا،", "لك."], arabicAnswer: "شكراً", arabicWrongs: ["عفية", "هلا", "إي"] },
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
        theyAskAr: "صباح الخير! شلونك؟",
        correctAr: "صباح الخير! آني زين، شكراً.",
        wrong1Ar: "في أمان الله، أراك لاحقاً.",
        wrong2Ar: "لا، عفية.",
        wrong3Ar: "مسا الخير يا صاحبي.",
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
        theyAskAr: "تريد شوية چاي؟",
        correctAr: "لا، شكراً. آني زين.",
        wrong1Ar: "إي، في أمان الله.",
        wrong2Ar: "عفية هلا.",
        wrong3Ar: "مسا الخير.",
        explanationAr: "'No, thank you' هي الطريقة المثلى لرفض العروض بأدب."
      }
    ]
  },

  // Lesson 1: Introducing Yourself (Core Grammar: Pronouns & To Be)
  {
    topic: "Introducing Yourself", topicKu: "ناساندنی خۆت", topicAr: "التعريف بالنفس",
    words: [
      { english: "Name", kurdish: "ناو", arabic: "اسم" },
      { english: "I am", kurdish: "من ...م (بۆ خۆناساندن)", arabic: "آني" },
      { english: "You are", kurdish: "تۆ ...یت", arabic: "أنت" },
      { english: "He is", kurdish: "ئەو (نێر) ...ە", arabic: "هو" },
      { english: "She is", kurdish: "ئەو (مێ) ...ە", arabic: "هي" },
      { english: "My name", kurdish: "ناوی من", arabic: "اسمي" },
      { english: "Your name", kurdish: "ناوی تۆ", arabic: "اسمك" },
      { english: "Nice to meet you", kurdish: "خۆشحاڵم بە ناسینت", arabic: "فرصة سعيدة" },
    ],
    voices: [
      { prompt: "بڵێ ناوت چییە و خۆت بناسێنە", target: "My name is John. Nice to meet you.", targetKurdish: "ناوی من جۆنە. خۆشحاڵم بە ناسینت.", promptAr: "قل اسمي جون وفرصة سعيدة", targetArabic: "اسمي جون. فرصة سعيدة." },
      { prompt: "بڵێ ئەو هاوڕێی منە", target: "She is my friend.", targetKurdish: "ئەو هاوڕێی منە.", promptAr: "قل هي صديقتي", targetArabic: "هي صديقتي." },
      { prompt: "بڵێ ئەو مامۆستایە", target: "He is a teacher.", targetKurdish: "ئەو مامۆستایە.", promptAr: "قل هو معلم", targetArabic: "هو معلم." },
    ],
    sentences: [
      { english: ["What", "is", "your", "name"], kurdish: "ناوت چییە؟", arabic: "شنو اسمك؟" },
      { english: ["I", "am", "a", "student", "and", "she", "is", "a", "teacher"], kurdish: "من قوتابیم و ئەویش مامۆستایە", arabic: "آني طالب وهي معلمة" },
      { english: ["Nice", "to", "meet", "you", "my", "friend"], kurdish: "خۆشحاڵم بە ناسینت، هاوڕێم", arabic: "فرصة سعيدة يا صاحبي" },
      { english: ["He", "is", "my", "brother", "and", "she", "is", "my", "sister"], kurdish: "ئەو برای منە و ئەویش خوشکی منە", arabic: "هو أخي وهي أختي" },
    ],
    fillBlanks: [
      { parts: ["My", "is John."], hint: "ناوی من جۆنە.", answer: "name", wrongs: ["teacher", "student", "nice"], arabicHint: "اسمي جون.", arabicParts: ["", " جون."], arabicAnswer: "اسمي", arabicWrongs: ["معلم", "طالب", "جميل"] },
      { parts: ["Nice to", "you."], hint: "خۆشحاڵم بە ناسینت.", answer: "meet", wrongs: ["name", "friend", "is"], arabicHint: "فرصة سعيدة.", arabicParts: ["سررت بـ", "ك."], arabicAnswer: "لقاء", arabicWrongs: ["اسم", "صديق", "يكون"] },
      { parts: ["She", "my friend."], hint: "ئەو هاوڕێی منە.", answer: "is", wrongs: ["am", "are", "meet"], arabicHint: "هي صديقتي.", arabicParts: ["هي", "صديقتي."], arabicAnswer: "صديقتي", arabicWrongs: ["آني", "تكون", "لقاء"] },
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
        theyAskAr: "هلا! اسمي سارة. شنو اسمك؟",
        correctAr: "هلا سارة! اسمي كاروان. فرصة سعيدة.",
        wrong1Ar: "هي صديقتي.",
        wrong2Ar: "في أمان الله، اسمي جون.",
        wrong3Ar: "لا، شكراً.",
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
        wrong1Ar: "فرصة سعيدة يا أخي.",
        wrong2Ar: "آني طالب.",
        wrong3Ar: "إي، عفية.",
        explanationAr: "لتعريف شخص آخر نستخدم 'He is...' للمذكر و 'She is...' للمؤنث."
      }
    ]
  },

  // Lesson 2: Basic Feelings & State
  {
    topic: "Feelings & State", topicKu: "هەستەکان", topicAr: "المشاعر والحالة",
    words: [
      { english: "Fine", kurdish: "باشم (ئاساییم)", arabic: "زين" },
      { english: "Happy", kurdish: "دڵخۆش", arabic: "سعيد" },
      { english: "Sad", kurdish: "دڵتەنگ", arabic: "حزين" },
      { english: "Tired", kurdish: "ماندوو", arabic: "تعبان" },
      { english: "Angry", kurdish: "توڕە", arabic: "عصبي" },
      { english: "Good", kurdish: "باش", arabic: "زين" },
      { english: "Bad", kurdish: "خراپ", arabic: "مو زين" },
      { english: "Okay", kurdish: "ئاسایی (باش)", arabic: "زين (لا بأس)" },
    ],
    voices: [
      { prompt: "بڵێ من باشم، سوپاس", target: "I am fine, thank you.", targetKurdish: "من باشم، سوپاس.", promptAr: "قل آني زين، شكراً", targetArabic: "آني زين، شكراً." },
      { prompt: "بڵێ ماندوویت", target: "I am tired today.", targetKurdish: "من ئەمڕۆ ماندووم.", promptAr: "قل آني تعبان اليوم", targetArabic: "آني تعبان اليوم." },
      { prompt: "بڵێ ئەو دڵخۆشە", target: "She is very happy.", targetKurdish: "ئەو زۆر دڵخۆشە.", promptAr: "قل هي سعيدة كلش", targetArabic: "هي سعيدة كلش." },
    ],
    sentences: [
      { english: ["How", "are", "you", "today", "my", "friend"], kurdish: "چۆنیت ئەمڕۆ هاوڕێم؟", arabic: "شلونك اليوم يا صاحبي؟" },
      { english: ["I", "am", "sad", "because", "my", "dog", "is", "sick"], kurdish: "من دڵتەنگم چونکە سەگەکەم نەخۆشە", arabic: "آني حزين لأن جلبي مريض" },
      { english: ["Are", "you", "okay", "or", "are", "you", "angry"], kurdish: "تۆ باشیت یان توڕەیت؟", arabic: "هل أنت زين أم أنت عصبي؟" },
      { english: ["Everything", "is", "good", "thank", "you", "very", "much"], kurdish: "هەموو شتێک باشە، زۆر سوپاس", arabic: "كل شيء زين، شكراً هواية" },
    ],
    fillBlanks: [
      { parts: ["I am", ", thank you! And you?"], hint: "من باشم، سوپاس! ئەی تۆ؟", answer: "fine", wrongs: ["sad", "angry", "tired"], arabicHint: "آني زين، شكراً! وأنت؟", arabicParts: ["آني", "، شكراً! وأنت؟"], arabicAnswer: "زين", arabicWrongs: ["حزين", "عصبي", "تعبان"] },
      { parts: ["She is crying; she must be", "."], hint: "ئەو دەگری؛ دەبێت دڵتەنگ بێت.", answer: "sad", wrongs: ["happy", "fine", "good"], arabicHint: "هي تبكي؛ لا بد أنها حزينة.", arabicParts: ["هي تبكي؛ لا بد أنها", "."], arabicAnswer: "حزينة", arabicWrongs: ["سعيدة", "زين", "زينة"] },
      { parts: ["Are you", "after work?"], hint: "ئایا دوای کار ماندوویت؟", answer: "tired", wrongs: ["good", "happy", "okay"], arabicHint: "هل أنت تعبان بعد العمل؟", arabicParts: ["هل أنت", "بعد العمل؟"], arabicAnswer: "تعبان", arabicWrongs: ["زين", "سعيد", "عصبي"] },
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
        theyAskAr: "شلونك اليوم؟",
        correctAr: "آني زين، شكراً. وأنت؟",
        wrong1Ar: "لا، شكراً.",
        wrong2Ar: "في أمان الله، أراك لاحقاً.",
        wrong3Ar: "فرصة سعيدة، آني تعبان.",
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
        theyAskAr: "تبدو تعباناً كلش.",
        correctAr: "إي، كان لدي يوم طويل كلش في العمل.",
        wrong1Ar: "فرصة سعيدة.",
        wrong2Ar: "صباح الخير، شكراً.",
        wrong3Ar: "آني سعيد وحزين كلش.",
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
      { english: "How old", kurdish: "تەمەن چەند", arabic: "شكد عمر" },
    ],
    voices: [
      { prompt: "بڵێ تەمەنت دە ساڵە", target: "I am ten years old.", targetKurdish: "تەمەنم دە ساڵە.", promptAr: "قل عمري عشر سنين.", targetArabic: "عمري عشر سنين." },
      { prompt: "بڵێ دوو پەرتووکت هەیە", target: "I have two books.", targetKurdish: "دوو پەرتووکم هەیە.", promptAr: "قل لدي كتابان", targetArabic: "لدي كتابان." },
      { prompt: "بپرس تەمەنی چەندە", target: "How old is your brother?", targetKurdish: "تەمەنی براکەت چەندە؟", promptAr: "اسأل عن عمر أخوه", targetArabic: "شكد عمر أخوك؟" },
    ],
    sentences: [
      { english: ["How", "old", "are", "you"], kurdish: "تەمەنت چەند ساڵە؟", arabic: "شكد عمرك؟" },
      { english: ["My", "sister", "is", "five", "years", "old"], kurdish: "خوشکەکەم تەمەنی پێنج ساڵە", arabic: "أختي تبلغ من العمر خمس سنين" },
      { english: ["I", "see", "three", "cats", "and", "four", "dogs"], kurdish: "سێ پشیلە و چوار سەگ دەبینم", arabic: "أرى ثلاثة بزازين وأربعة جلاب" },
      { english: ["One", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"], kurdish: "یەک، دوو، سێ، چوار، پێنج، شەش، حەوت، هەشت، نۆ، دە", arabic: "واحد، اثنان، ثلاثة، أربعة، خمسة، ستة، سبعة، ثمانية، تسعة، عشرة" },
    ],
    fillBlanks: [
      { parts: ["I am five", "old."], hint: "من تەمەنم پێنج ساڵە.", answer: "years", wrongs: ["old", "how", "brother"], arabicHint: "عمري خمس سنين.", arabicParts: ["عمري خمس", "."], arabicAnswer: "سنين", arabicWrongs: ["قديم", "كم", "أخي"] },
      { parts: ["How", "are you?"], hint: "تەمەنت چەندە؟", answer: "old", wrongs: ["years", "name", "are"], arabicHint: "شكد عمرك؟", arabicParts: ["كم", "ك؟"], arabicAnswer: "عمر", arabicWrongs: ["سنين", "اسم", "تكون"] },
      { parts: ["I have", "hands and ten fingers."], hint: "من دوو دەست و دە پەنجەم هەیە.", answer: "two", wrongs: ["one", "five", "years"], arabicHint: "لدي يدان وعشرة أصابع.", arabicParts: ["لدي", "يدان وعشرة أصابع."], arabicAnswer: "اثنان", arabicWrongs: ["واحد", "خمسة", "سنين"] },
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
        theyAskAr: "شكد عمرك؟",
        correctAr: "عمري عشرون سنة. وأنت؟",
        wrong1Ar: "آني زين، شكراً.",
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
        wrong1Ar: "عمري خمس سنين.",
        wrong2Ar: "فرصة سعيدة.",
        wrong3Ar: "إي، عفية.",
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
      { english: "Coffee", kurdish: "قاوە", arabic: "گهوة" },
    ],
    voices: [
      { prompt: "بڵێ ئاو دەخۆیتەوە", target: "I drink water every day.", targetKurdish: "من هەموو ڕۆژێک ئاو دەخۆمەوە.", promptAr: "قل آني أشرب المي كل يوم", targetArabic: "آني أشرب المي كل يوم." },
      { prompt: "بپرس کلیلی من لەکوێیە", target: "Where is my key?", targetKurdish: "کلیلی من لەکوێیە؟", promptAr: "اسأل وين مفتاحي", targetArabic: "وين مفتاحي؟" },
      { prompt: "داوای قاوە بکە", target: "Do you want coffee or tea?", targetKurdish: "قاوەت دەوێت یان چا؟", promptAr: "اطلب گهوة", targetArabic: "هل تريد گهوة أم شاي؟" },
    ],
    sentences: [
      { english: ["Please", "put", "the", "book", "in", "my", "bag"], kurdish: "تکایە کتێبەکە بخەرە ناو جانتاکەمەوە", arabic: "عفية ضع الكتاب في حقيبتي" },
      { english: ["I", "need", "a", "pen", "to", "write", "my", "name"], kurdish: "پێویستم بە پێنوسێکە بۆ نووسینی ناوم", arabic: "أحتاج إلى قلم لكتابة اسمي" },
      { english: ["Here", "is", "some", "fresh", "bread", "and", "water"], kurdish: "ئەمەش کەمێک نانی تازە و ئاوە", arabic: "هذا بعض الخبز الطازج والمي" },
      { english: ["Where", "is", "your", "phone", "my", "friend"], kurdish: "مۆبایلەکەت لەکوێیە هاوڕێم؟", arabic: "وين هاتفك يا صاحبي؟" },
    ],
    fillBlanks: [
      { parts: ["Where is my", "? I cannot open the door."], hint: "کلیلی من لەکوێیە؟ ناتوانم دەرگاکە بکەمەوە.", answer: "key", wrongs: ["pen", "bag", "water"], arabicHint: "وين مفتاحي؟ لا أستطيع فتح الباب.", arabicParts: ["وين", "؟ لا أستطيع فتح الباب."], arabicAnswer: "مفتاحي", arabicWrongs: ["قلمي", "حقيبتي", "مائي"] },
      { parts: ["I have a black", "for school."], hint: "جانتاکەم ڕەشە بۆ قوتابخانە.", answer: "bag", wrongs: ["key", "coffee", "phone"], arabicHint: "لدي حقيبة سوداء للمدرسة.", arabicParts: ["لدي", "سوداء للمدرسة."], arabicAnswer: "حقيبة", arabicWrongs: ["مفتاح", "گهوة", "هاتف"] },
      { parts: ["Would you like a glass of cold", "?"], hint: "پەرداخێک ئاوی ساردت دەوێت؟", answer: "water", wrongs: ["bread", "pen", "key"], arabicHint: "هل تريد كوباً من المي البارد؟", arabicParts: ["هل تريد كوباً من", "البارد؟"], arabicAnswer: "المي", arabicWrongs: ["الخبز", "القلم", "المفتاح"] },
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
        theyAskAr: "هل يمكنك توقيع هذه الوثيقة عفية؟",
        correctAr: "إي، ولكني أحتاج إلى قلم. هل لديك واحد؟",
        wrong1Ar: "وين مفتاحي؟",
        wrong2Ar: "آني أشرب المي كل يوم.",
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
        situationAr: "تقديم الخبز والمي للضيف",
        theyAskAr: "آني جائع كلش بعد السفر.",
        correctAr: "تفضل بالجلوس. هذا بعض الخبز الطازج والمي.",
        wrong1Ar: "هذا هاتفي.",
        wrong2Ar: "هل تريد گهوة في حقيبتك؟",
        wrong3Ar: "لدي ثلاثة مفاتيح.",
        explanationAr: "تقديم الخبز والمي للضيف الجائع هو الرد اللائق والسريع."
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
      { prompt: "بڵێ حەزت لە قاوەیە", target: "I like coffee in the morning.", targetKurdish: "من حەزم لە قاوەیە لە بەیانیاندا.", promptAr: "قل آني أحب الگهوة صباحاً", targetArabic: "آني أحب الگهوة في الصباح." },
      { prompt: "بڵێ دەتەوێت بچیتە ماڵەوە", target: "I want to go home now.", targetKurdish: "دەمەوێت ئێستا بچمە ماڵەوە.", promptAr: "قل أريد الذهاب للمنزل هسة", targetArabic: "أريد الذهاب إلى المنزل هسة." },
      { prompt: "داوای هاتنە ژوورەوە بکە", target: "Come here and eat some bread.", targetKurdish: "وەرە ئێرە و کەمێک نان بخۆ.", promptAr: "اطلب منه يجي يأكل", targetArabic: "تعال هنا وأكل شوية خبز." },
    ],
    sentences: [
      { english: ["I", "want", "to", "drink", "a", "glass", "of", "cold", "water"], kurdish: "دەمەوێت پەرداخێک ئاوی سارد بخۆمەوە", arabic: "أريد أشرب گلاص مي بارد" },
      { english: ["Do", "you", "see", "the", "black", "cat", "in", "the", "garden"], kurdish: "ئایا پشیلە ڕەشەکە لە باخچەکەدا دەبینیت؟", arabic: "تشوف البزونة السودة بالحديقة؟" },
      { english: ["We", "have", "a", "meeting", "at", "school", "today"], kurdish: "ئێمە ئەمڕۆ کۆبوونەوەیەکمان لە قوتابخانە هەیە", arabic: "عدنا اجتماع بالمدرسة اليوم" },
      { english: ["Please", "go", "to", "the", "shop", "and", "buy", "bread"], kurdish: "تکایە بڕۆ بۆ دوکانەکە و نان بکڕە", arabic: "عفية اذهب إلى المتجر واشترِ خبزاً" },
    ],
    fillBlanks: [
      { parts: ["I", "coffee, but I love tea."], hint: "حەزم لە قاوە هەیە، بەڵام چام خۆش دەوێت.", answer: "like", wrongs: ["want", "go", "eat"], arabicHint: "يعجبني الشاي، لكني أحب الگهوة.", arabicParts: ["آني", "الگهوة، لكني أحب الشاي."], arabicAnswer: "أحب", arabicWrongs: ["أريد", "أذهب", "آكل"] },
      { parts: ["I am hungry; I want to", "some food."], hint: "من برسیومە؛ دەمەوێت کەمێک خواردن بخۆم.", answer: "eat", wrongs: ["drink", "see", "come"], arabicHint: "آني جائع؛ أريد أن آكل بعض الطعام.", arabicParts: ["آني جائع؛ أريد أن", "بعض الطعام."], arabicAnswer: "آكل", arabicWrongs: ["أشرب", "أرى", "آتي"] },
      { parts: ["Do you", "a phone in your bag?"], hint: "ئایا مۆبایلت لەناو جانتاکەتدا هەیە؟", answer: "have", wrongs: ["go", "like", "see"], arabicHint: "عندك تليفون بجنطتك؟", arabicParts: ["هل", "هاتف في حقيبتك؟"], arabicAnswer: "لديك", arabicWrongs: ["تذهب", "تحب", "ترى"] },
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
        situationAr: "عندما تشعر بالعطش وتطلب المي",
        theyAskAr: "هل أنت زين؟ تبدو عطشاناً.",
        correctAr: "إي، أريد أن أشرب بعض المي عفية.",
        wrong1Ar: "أريد الذهاب للمدرسة.",
        wrong2Ar: "آني أرى البزونة السوداء.",
        wrong3Ar: "لدي اجتماع.",
        explanationAr: "للعطش، نستخدم الفعل 'drink' (يشرب) والمي."
      },
      {
        situation: "پێشنیارکردنی ڕۆیشتن بۆ پارک",
        theyAsk: "The weather is very good today.",
        correct: "I agree! Let's go to the park together.",
        wrong1: "Eat some bread please.",
        wrong2: "I want to see the key.",
        wrong3: "Come here and drink tea.",
        explanation: "لە کاتی وەڵامدانەوەی کەشوهەوای خۆش، ڕۆیشتن بۆ پارک 'go to the park' پێکەوە زۆر گونجاوە.",
        situationAr: "اقتراح الروحة للحديقة بيوم مشمس",
        theyAskAr: "الجو كلش حلو اليوم.",
        correctAr: "آني أتفق وياك! خلي نروح للحديقة سوه.",
        wrong1Ar: "كل بعض الخبز عفية.",
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
      { prompt: "وەسفی سێوێک بکە بە ڕەنگ", target: "This is a red apple.", targetKurdish: "ئەمە سێوێکی سوورە.", promptAr: "صف تفاحة باللون", targetArabic: "هاي تفاحة حمرة." },
      { prompt: "بڵێ ئۆتۆمبێلەکە ڕەشە", target: "The car is black and clean.", targetKurdish: "ئۆتۆمبێلەکە ڕەش و خاوێنە.", promptAr: "قل السيارة سوداء", targetArabic: "السيارة سودة ونظيفة." },
    ],
    sentences: [
      { english: ["The", "sky", "is", "blue", "and", "the", "grass", "is", "green"], kurdish: "ئاسمان شینە و سەوزە گیاکەش سەوزە", arabic: "السما زرگة والعشب أخضر" },
      { english: ["Do", "you", "want", "the", "white", "bag", "or", "the", "yellow", "one"], kurdish: "جانتا سپییەکەت دەوێت یان زەردەکە؟", arabic: "تريد الجنطة البيضة لو الصفرة؟" },
      { english: ["Oranges", "are", "orange", "and", "bananas", "are", "yellow"], kurdish: "پرتەقاڵ پرتەقاڵییە و مۆز زەردە", arabic: "البرتقال برتقالي والموز أصفر" },
      { english: ["He", "has", "a", "black", "pen", "in", "his", "hand"], kurdish: "ئەو پێنوسێکی ڕەشی لە دەستدایە", arabic: "بإيده قلم أسود" },
    ],
    fillBlanks: [
      { parts: ["My favorite color is", "because I love the sky."], hint: "ڕەنگی دڵخوازم شینە چونکە حەزم لە ئاسمانە.", answer: "blue", wrongs: ["red", "black", "white"], arabicHint: "لوني المفضل هو الأزرق لأني أحب السماء.", arabicParts: ["لوني المفضل هو", "لأني أحب السماء."], arabicAnswer: "الأزرق", arabicWrongs: ["الأحمر", "الأسود", "الأبيض"] },
      { parts: ["Leaves are usually", "in summer."], hint: "گەڵاکان بە شێوەیەکی گشتی سەوزن لە هاویندا.", answer: "green", wrongs: ["yellow", "white", "black"], arabicHint: "الأوراق عادة خضرة بالصيف.", arabicParts: ["الأوراق عادة", "في الصيف."], arabicAnswer: "خضراء", arabicWrongs: ["صفراء", "بيضاء", "سوداء"] },
      { parts: ["This is a", "banana from the market."], hint: "ئەمە مۆزێکی زەردە لە بازاڕەکەوە.", answer: "yellow", wrongs: ["blue", "orange", "black"], arabicHint: "هاي موزة صفرة من السوگ.", arabicParts: ["هذه موزة", "من السوق."], arabicAnswer: "صفراء", arabicWrongs: ["زرقاء", "برتقالية", "سوداء"] },
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
        theyAskAr: "شنو لونك المفضل؟",
        correctAr: "لوني المفضل هو الأزرق. وأنت شنو؟",
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
        theyAskAr: "لدينا هذه الحقيبة باللونين الأبيض والأسود. يا هو تريد؟",
        correctAr: "أريد الحقيبة السوداء عفية. تبقى نظيفة لفترة أطول.",
        wrong1Ar: "السماء زرقاء.",
        wrong2Ar: "العشب الأخضر زين.",
        wrong3Ar: "البرتقال برتقالي.",
        explanationAr: "اختيار اللون المناسب مع كلمة 'عفية' هو الأسلوب الصحيح للتسوق."
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
      { prompt: "بڵێ خێزانەکەت خۆش دەوێت", target: "I love my family very much.", targetKurdish: "خێزانەکەمم زۆر خۆش دەوێت.", promptAr: "قل آني أحب عائلتي هواية", targetArabic: "آني أحب عائلتي هواية." },
      { prompt: "ناساندنی دایک", target: "This is my mother; her name is Sarah.", targetKurdish: "ئەمە دایکمە؛ ناوی سارایە.", promptAr: "تعريف بوالدتك", targetArabic: "هاي أمي؛ اسمها سارة." },
      { prompt: "بڵێ خوشکت هەیە", target: "I have one sister and two brothers.", targetKurdish: "یەک خوشک و دوو برام هەیە.", promptAr: "قل لديك أخت وأخوين", targetArabic: "عندي أخت وحدة وأخوين." },
    ],
    sentences: [
      { english: ["My", "father", "is", "a", "doctor", "at", "the", "hospital"], kurdish: "باوکم پزیشکە لە نەخۆشخانەکە", arabic: "أبويا دكتور بالمستشفى" },
      { english: ["Her", "daughter", "is", "five", "years", "old", "today"], kurdish: "کچەکەی تەمەنی پێنج ساڵە ئەمڕۆ", arabic: "ابنتها تبلغ من العمر خمس سنين اليوم" },
      { english: ["They", "are", "my", "parents", "and", "I", "respect", "them"], kurdish: "ئەوان دایک و باوکمن و من ڕێزیان دەگرم", arabic: "هما والداي وآني أحترمهما" },
      { english: ["My", "brother", "has", "a", "black", "dog", "at", "home"], kurdish: "براکەم سەگێکی ڕەشی لە ماڵەوە هەیە", arabic: "أخي لديه جلب أسود في المنزل" },
    ],
    fillBlanks: [
      { parts: ["My", "and father are my parents."], hint: "دایک و باوکم سەرپەرشتیارمن.", answer: "mother", wrongs: ["sister", "daughter", "family"], arabicHint: "أمي وأبويا هم أهلي.", arabicParts: ["", "وأبي هما والداي."], arabicAnswer: "أمي", arabicWrongs: ["أختي", "ابنتي", "عائلتي"] },
      { parts: ["He is my mother's son; he is my", "."], hint: "ئەو کوڕی دایکمە؛ ئەو برای منە.", answer: "brother", wrongs: ["father", "parents", "daughter"], arabicHint: "هو ابن أمي؛ إنه أخي.", arabicParts: ["هو ابن أمي؛ إنه", "."], arabicAnswer: "أخي", arabicWrongs: ["أبي", "والداي", "ابنتي"] },
      { parts: ["We live together; we are a happy", "."], hint: "ئێمە پێکەوە دەژین؛ ئێمە خێزانێکی دڵخۆشین.", answer: "family", wrongs: ["parents", "sister", "brother"], arabicHint: "إحنا نعيش معاً؛ إحنا عائلة سعيدة.", arabicParts: ["إحنا نعيش معاً؛ إحنا", "سعيدة."], arabicAnswer: "عائلة", arabicWrongs: ["والدان", "أخت", "أخ"] },
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
        theyAskAr: "منو الرجال الطويل بهالصورة؟",
        correctAr: "هو أبويا. هو دكتور بالمستشفى.",
        wrong1Ar: "هي أمي، سارة.",
        wrong2Ar: "آني أحب عائلتي هواية.",
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
        theyAskAr: "تعيش وحدك بهالبيت الجبير؟",
        correctAr: "لا، آني أعيش مع والدي وأختي الصغيرة.",
        wrong1Ar: "ابنتي تبلغ من العمر خمس سنين.",
        wrong2Ar: "إي، آني أحب عائلتي.",
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
      { english: "What", kurdish: "چی", arabic: "شنو (ما)" },
      { english: "Where", kurdish: "لەکوێ", arabic: "وين" },
      { english: "Why", kurdish: "بۆچی", arabic: "لشنو" },
      { english: "When", kurdish: "کەی", arabic: "شوكت" },
      { english: "How", kurdish: "چۆن", arabic: "شلون" },
      { english: "Which", kurdish: "کام", arabic: "أي" },
      { english: "Whose", kurdish: "هی کێ", arabic: "لمن" },
    ],
    voices: [
      { prompt: "بپرس ناوت چییە", target: "What is your name?", targetKurdish: "ناوت چییە؟", promptAr: "اسأل ما هو اسمك", targetArabic: "شنو اسمك؟" },
      { prompt: "بپرس کلیلی کێ لێرەیە", target: "Whose key is this on the table?", targetKurdish: "ئەم کلیلی کێیە لەسەر مێزەکە؟", promptAr: "اسأل لمن هذا المفتاح", targetArabic: "لمن هذا المفتاح عالطاولة؟" },
      { prompt: "بپرس بۆچی خەمبارە", target: "Why are you sad today?", targetKurdish: "بۆچی ئەمڕۆ دڵتەنگی؟", promptAr: "اسأل لشنو أنت حزين", targetArabic: "لشنو أنت حزين اليوم؟" },
    ],
    sentences: [
      { english: ["Where", "is", "the", "nearest", "shop", "my", "friend"], kurdish: "نزیکترین دوکان لەکوێیە، هاوڕێم؟", arabic: "وين أقرب متجر يا صاحبي؟" },
      { english: ["When", "is", "your", "brother", "coming", "home"], kurdish: "کەی براکەت دەگەڕێتەوە بۆ ماڵەوە؟", arabic: "شوكت سيعود أخوك إلى المنزل؟" },
      { english: ["Which", "color", "do", "you", "prefer", "blue", "or", "red"], kurdish: "کام ڕەنگە پەسەند دەکەیت، شین یان سوور؟", arabic: "يا لون تفضل، الأزرق لو الأحمر؟" },
      { english: ["Who", "is the", "man", "in the", "black", "car"], kurdish: "ئەو پیاوە کێیە لەناو ئۆتۆمبێلە ڕەشەکەدا؟", arabic: "منو الرجال بالسيارة السودة؟" },
    ],
    fillBlanks: [
      { parts: ["", "is my phone? I cannot find it."], hint: "مۆبایلەکەم لەکوێیە؟ ناتوانم بیدۆزمەوە.", answer: "Where", wrongs: ["Who", "Why", "When"], arabicHint: "وين هاتفي؟ لا يمكنني العثور عليه.", arabicParts: ["", "هاتفي؟ لا يمكنني العثور عليه."], arabicAnswer: "وين", arabicWrongs: ["من", "لشنو", "شوكت"] },
      { parts: ["", "are you laughing? Is it funny?"], hint: "بۆچی پێدەکەنی? ئایا کۆمیدییە؟", answer: "Why", wrongs: ["Who", "Where", "Whose"], arabicHint: "لشنو تضحك؟ هل الأمر مضحك؟", arabicParts: ["", "تضحك؟ هل الأمر مضحك؟"], arabicAnswer: "لشنو", arabicWrongs: ["من", "وين", "لمن"] },
      { parts: ["", "is that girl? She is nice."], hint: "ئەو کچە کێیە؟ ئەو کچێکی باشە.", answer: "Who", wrongs: ["What", "Which", "Why"], arabicHint: "منو ذيچ البنية؟ كلش لطيفة.", arabicParts: ["", "تلك الفتاة؟ إنها لطيفة."], arabicAnswer: "من", arabicWrongs: ["شنو", "أي", "لشنو"] },
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
        theyAskAr: "شوكت يبدأ درس اللغة الإنجليزية؟",
        correctAr: "بالعشرة الصبح. لا تتأخر.",
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
        theyAskAr: "لمن هاي الجنطة بالغرفة؟",
        correctAr: "هاي جنطة أختي. نستها هنا.",
        wrong1Ar: "وين هاتفي؟",
        wrong2Ar: "شنو اسمك؟",
        wrong3Ar: "لشنو أنت حزين؟",
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
      { prompt: "بڵێ دەچیت بۆ سەر کار", target: "I am going to work now.", targetKurdish: "من ئێستا دەچم بۆ سەر کار.", promptAr: "قل آني ذاهب للعمل هسة", targetArabic: "آني ذاهب إلى العمل هسة." },
      { prompt: "بڵێ لە ماڵەوەیت", target: "I am at home with my family.", targetKurdish: "من لە ماڵەوەم لەگەڵ خێزانەکەم.", promptAr: "قل آني في المنزل مع عائلتي", targetArabic: "آني في المنزل مع عائلتي." },
      { prompt: "بڵێ نەخۆشخانەکە دوورە", target: "The hospital is far from this city.", targetKurdish: "نەخۆشخانەکە لەم شارەوە دوورە.", promptAr: "قل المستشفى بعيد", targetArabic: "المستشفى بعيدة عن هالمدينة." },
    ],
    sentences: [
      { english: ["Let's", "walk", "in", "the", "green", "park", "this", "evening"], kurdish: "با ئەم ئێوارەیە لە پارکە سەوزەکەدا پیاسە بکەین", arabic: "خلي نلعب بالحديقة الخضرة هالمسا" },
      { english: ["The", "shop", "is", "open", "until", "ten", "at", "night"], kurdish: "دوکانەکە تا کاتژمێر دە لە شەودا کراوەیە", arabic: "المحل مفتوح للعشرة بالليل" },
      { english: ["I", "live", "in", "a", "very", "beautiful", "and", "clean", "city"], kurdish: "من لە شارێکی زۆر جوان و خاوێندا دەژیم", arabic: "آني أعيش في مدينة جميلة ونظيفة كلش" },
      { english: ["My", "sister", "is", "at", "school", "with", "her", "friends"], kurdish: "خوشکەکەم لە قوتابخانەیە لەگەڵ هاوڕێکانی", arabic: "أختي بالمدرسة ويه صديقاتها" },
    ],
    fillBlanks: [
      { parts: ["I am cleaning my", "because it is dirty."], hint: "ژوورەکەم پاکدەکەمەوە چونکە پیس بووە.", answer: "room", wrongs: ["city", "hospital", "work"], arabicHint: "آني أنظف غرفتي لأنها متسخة.", arabicParts: ["آني أنظف", "لأنها متسخة."], arabicAnswer: "غرفتي", arabicWrongs: ["مدينتي", "مستشفاي", "عملي"] },
      { parts: ["He works at the", "; he is a doctor."], hint: "ئەو لە نەخۆشخانەکە کار دەکات؛ ئەو پزیشکە.", answer: "hospital", wrongs: ["park", "shop", "school"], arabicHint: "يشتغل بالمستشفى؛ هو دكتور.", arabicParts: ["يعمل في", "؛ إنه طبيب."], arabicAnswer: "المستشفى", arabicWrongs: ["الحديقة", "المتجر", "المدرسة"] },
      { parts: ["Let's meet at the coffee", "."], hint: "با لە دوکانی (کافی) قاوەکە یەکتر ببینین.", answer: "shop", wrongs: ["house", "park", "hospital"], arabicHint: "لنلتقِ في مقهى الگهوة.", arabicParts: ["لنلتقِ في مقهى", "."], arabicAnswer: "الگهوة", arabicWrongs: ["المنزل", "الحديقة", "المستشفى"] },
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
        theyAskAr: "وين أبوك؟ هل هو في المنزل؟",
        correctAr: "لا، مو بالبيت. هو بالشغل للعشرة بالليل.",
        wrong1Ar: "المدينة جميلة.",
        wrong2Ar: "إي، آني أنظف غرفتي.",
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
        theyAskAr: "أحتاج أشتري شوية خبز حار.",
        correctAr: "لنذهب إلى المتجر المحلي. إنه مفتوح هسة.",
        wrong1Ar: "آني أعيش في منزل جميل.",
        wrong2Ar: "الحديقة خضراء.",
        wrong3Ar: "آني ذاهب إلى المدرسة.",
        explanationAr: "لشراء الخبز، الاقتراح المناسب هو الذهاب إلى الدكان المحلي (go to the shop)."
      }
    ]
  }
];

export default normalUnit00;
