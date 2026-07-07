import { UnitBank } from "../types";

// ── Unit 6: Food, Dining, & Storytelling — 10 lessons ──────────────────────────
// Practical A2-B1 vocabulary and sentence structures for dining out, cooking, and talking about past activities.

const normalUnit06: UnitBank = [
  // Lesson 0: Table Talk
  {
    topic: "Table Talk", topicKu: "گفتوگۆی سەر مێز", topicAr: "حديث المائدة",
    words: [
      { english: "Could you pass the salt", kurdish: "دەتوانیت خوێەکەم پێ بدەیت", arabic: "هل يمكنك مناولتي الملح" },
      { english: "Fork and knife", kurdish: "چەتاڵ و چەقۆ", arabic: "شوكة وسكين" },
      { english: "Here is your napkin", kurdish: "ئەمەش دەسڕەکەتە", arabic: "تفضل منديلك" },
      { english: "Pour the water", kurdish: "ئاوتێکردن (ڕشتنی ئاو)", arabic: "صب الماء" },
      { english: "Set the table", kurdish: "ڕێکخستنی مێزەکە", arabic: "ترتيب الطاولة" },
      { english: "Delicious smell", kurdish: "بۆنی خۆش", arabic: "رائحة لذيذة" },
      { english: "Another glass of water", kurdish: "پەرداخێکی تری ئاو", arabic: "كوب آخر من الماء" },
      { english: "Please help yourself", kurdish: "فەرموو لێی بخۆ (بێشەرم بە)", arabic: "تفضل وخدم نفسك بنفسك" },
    ],
    voices: [
      { prompt: "داوای خوێ بکە لەسەر مێزەکە", target: "Could you please pass the salt?", targetKurdish: "تکایە دەتوانیت خوێەکەم پێ بدەیت؟", promptAr: "اطلب الملح على الطاولة", targetArabic: "هل يمكنك تمرير الملح من فضلك؟" },
      { prompt: "بە میوانەکەت بڵێ لێی بخوات", target: "Please help yourself to the food.", targetKurdish: "تکایە فەرموو لە خواردنەکە بخۆ.", promptAr: "أخبر ضيفك أن يتفضل بالأكل", targetArabic: "من فضلك تفضل وخذ ما تحتاجه من الطعام." },
      { prompt: "داوای پەرداخێک ئاو بکە", target: "Could I have another glass of water?", targetKurdish: "دەکرێت پەرداخێکی تری ئاوم دەست بکەوێت؟", promptAr: "اطلب كوباً آخر من الماء", targetArabic: "هل يمكنني الحصول على كوب آخر من الماء؟" },
    ],
    sentences: [
      { english: ["Could", "you", "pass", "me", "the", "napkin"], kurdish: "دەتوانیت دەسڕەکەم پێ بدەیت؟", arabic: "هل يمكنك تمريري المنديل لي؟" },
      { english: ["We", "need", "to", "set", "the", "table", "now"], kurdish: "پێویستە ئێستا مێزەکە ڕێکبخەین", arabic: "نحن بحاجة إلى ترتيب الطاولة الآن" },
      { english: ["The", "soup", "has", "a", "delicious", "smell"], kurdish: "شۆرباکە بۆنێکی خۆشی هەیە", arabic: "الحساء له رائحة لذيذة" },
      { english: ["Please", "pour", "some", "water", "into", "my", "glass"], kurdish: "تکایە کەمێک ئاو بکە پەرداخەکەمەوە", arabic: "من فضلك صب بعض الماء في كوبي" },
    ],
    fillBlanks: [
      { parts: ["Could you please", "the salt?"], hint: "تکایە دەتوانیت خوێەکەم پێ بدەیت؟", answer: "pass", wrongs: ["pour", "set", "help"], arabicHint: "هل يمكنك تمرير الملح من فضلك؟", arabicParts: ["هل يمكنك", "الملح من فضلك؟"], arabicAnswer: "تمرير", arabicWrongs: ["صب", "ترتيب", "تفضل"] },
      { parts: ["Please help", "to the salad."], hint: "تکایە فەرموو لە زەڵاتەکە بخۆ.", answer: "yourself", wrongs: ["myself", "himself", "them"], arabicHint: "من فضلك تفضل وخذ من السلطة بنفسك.", arabicParts: ["من فضلك تفضل وخذ من السلطة", "."], arabicAnswer: "بنفسك", arabicWrongs: ["بنفسي", "بنفسه", "بأنفسهم"] },
      { parts: ["Who is going to", "the table for dinner?"], hint: "کێ مێزەکە بۆ شێو ڕێکدەخات؟", answer: "set", wrongs: ["pass", "pour", "smell"], arabicHint: "من سيقوم بترتيب الطاولة للعشاء؟", arabicParts: ["من سيقوم بـ", "الطاولة للعشاء؟"], arabicAnswer: "ترتيب", arabicWrongs: ["تمرير", "صب", "رائحة"] },
    ],
    conversations: [
      {
        situation: "داواکردنی دەسڕ لە کاتی نانخواردن",
        theyAsk: "Do you need anything else?",
        correct: "Could you pass me the napkin, please?",
        wrong1: "Set the table now.",
        wrong2: "Here is your napkin.",
        wrong3: "I want another glass of water.",
        explanation: "بۆ داواکردنی شتێک بە شێوەیەکی جوان، بەکاربهێنە: 'Could you pass me... please'",
        situationAr: "طلب منديل أثناء الأكل",
        theyAskAr: "هل تحتاج إلى أي شيء آخر؟",
        correctAr: "هل يمكنك تمرير المنديل لي من فضلك؟",
        wrong1Ar: "رتب الطاولة الآن.",
        wrong2Ar: "تفضل منديلك.",
        wrong3Ar: "أريد كوباً آخر من الماء.",
        explanationAr: "لطلب شيء بشكل لطيف، استخدم: 'Could you pass me... please'"
      },
      {
        situation: "بانگکردنی میوان بۆ سەر مێزی نانخواردن",
        theyAsk: "Everything looks so good!",
        correct: "Thank you, please help yourself to anything you like.",
        wrong1: "Pass me the salt.",
        wrong2: "Set the table quickly.",
        wrong3: "Pour the water.",
        explanation: "'Please help yourself...' دەربڕینێکی باشە بۆ بانگهێشتکردنی کەسێک بۆ خواردن.",
        situationAr: "دعوة الضيف إلى طاولة الطعام",
        theyAskAr: "كل شيء يبدو رائعاً!",
        correctAr: "شكراً لك، تفضل وتناول أي شيء يعجبك.",
        wrong1Ar: "مرر لي الملح.",
        wrong2Ar: "رتب الطاولة بسرعة.",
        wrong3Ar: "صب الماء.",
        explanationAr: "'Please help yourself...' تعبير رائع لدعوة شخص لبدء الأكل."
      }
    ]
  },

  // Lesson 1: Ordering Food
  {
    topic: "Ordering Food", topicKu: "داواکردنی خواردن", topicAr: "طلب الطعام",
    words: [
      { english: "Are you ready to order", kurdish: "ئامادەن بۆ داواکردن؟", arabic: "هل أنتم مستعدون للطلب" },
      { english: "I will have the chicken", kurdish: "مریشکەکەم دەوێت (داوا دەکەم)", arabic: "سآخذ الدجاج" },
      { english: "Could we see the menu", kurdish: "دەکرێت مێنیووەکە ببینین؟", arabic: "هل يمكننا رؤية القائمة" },
      { english: "Check please", kurdish: "تکایە پسوولەی حسابەکە", arabic: "الفاتورة من فضلك" },
      { english: "Appetizer and main course", kurdish: "پێشخۆراک و ژەمی سەرەکی", arabic: "المقبلات والطبق الرئيسي" },
      { english: "Any recommendations", kurdish: "هیچ پێشنیازێکت هەیە؟", arabic: "أي توصيات" },
      { english: "Allergic to nuts", kurdish: "حەساسییەتم بە چەرەسات هەیە", arabic: "حساسية من المكسرات" },
      { english: "Table for two", kurdish: "مێزێک بۆ دوو کەس", arabic: "طاولة لشخصين" },
    ],
    voices: [
      { prompt: "داوای بینینی مێنیووەکە بکە", target: "Could we see the menu, please?", targetKurdish: "دەکرێت تکایە مێنیووەکە ببینین؟", promptAr: "اطلب رؤية قائمة الطعام", targetArabic: "هل يمكننا رؤية القائمة من فضلك؟" },
      { prompt: "بڵێ ئامادەی بۆ داواکردن", target: "We are ready to order now.", targetKurdish: "ئێمە ئێستا ئامادەین بۆ داواکردن.", promptAr: "قل نحن مستعدون للطلب", targetArabic: "نحن جاهزون للطلب الآن." },
      { prompt: "ئاماژە بە حەساسییەتەکەت بکە", target: "I am allergic to nuts.", targetKurdish: "حەساسییەتم بە چەرەسات هەیە.", promptAr: "أشر إلى وجود حساسية لديك", targetArabic: "لدي حساسية من المكسرات." },
    ],
    sentences: [
      { english: ["I", "will", "have", "the", "steak", "for", "my", "main", "course"], kurdish: "من گۆشتی ستەیک بۆ ژەمی سەرەکیم دەوێت", arabic: "سآخذ شريحة لحم كطبق رئيسي" },
      { english: ["Could", "we", "get", "the", "check", "please"], kurdish: "دەکرێت پسوولەی حسابەکەم بۆ بهێنیت تکایە؟", arabic: "هل يمكننا الحصول على الفاتورة من فضلك؟" },
      { english: ["We", "would", "like", "a", "table", "for", "two"], kurdish: "مێزێکمان بۆ دوو کەس دەوێت", arabic: "نرغب في طاولة لشخصين" },
      { english: ["Do", "you", "have", "any", "recommendations", "for", "us"], kurdish: "ئایا هیچ پێشنیازێکت بۆمان هەیە؟", arabic: "هل لديك أي توصيات لنا؟" },
    ],
    fillBlanks: [
      { parts: ["Are you ready to", "now?"], hint: "ئامادەن بۆ داواکردن ئێستا؟", answer: "order", wrongs: ["menu", "check", "eat"], arabicHint: "هل أنت مستعد للطلب الآن؟", arabicParts: ["هل أنت مستعد لـ", "الآن؟"], arabicAnswer: "الطلب", arabicWrongs: ["القائمة", "الحساب", "الأكل"] },
      { parts: ["Excuse me, could we have the", "please?"], hint: "ببوورە، دەکرێت حسابەکەمان بۆ بهێنیت تکایە؟", answer: "check", wrongs: ["order", "table", "waiter"], arabicHint: "معذرة، هل يمكننا الحصول على الحساب من فضلك؟", arabicParts: ["معذرة، هل يمكننا الحصول على", "من فضلك؟"], arabicAnswer: "الحساب", arabicWrongs: ["الطلب", "الطاولة", "النادل"] },
      { parts: ["I would like soup as my", "."], hint: "شۆربام وەک پێشخۆراک دەوێت.", answer: "appetizer", wrongs: ["main", "steak", "menu"], arabicHint: "أود الحصول على الحساء كمقبلات.", arabicParts: ["أود الحصول على الحساء كـ", "."], arabicAnswer: "مقبلات", arabicWrongs: ["طبق رئيسي", "لحم", "قائمة"] },
    ],
    conversations: [
      {
        situation: "کاتێک نادلەکە دێت بۆ داواکردن",
        theyAsk: "Are you ready to order, or do you need a few more minutes?",
        correct: "We are ready. I will have the fish, please.",
        wrong1: "Give me the menu.",
        wrong2: "Check please, I am leaving.",
        wrong3: "I am allergic to nuts.",
        explanation: "ئەگەر ئامادە بوویت بڵێ 'We are ready' و دواتر ناوی خواردنەکە بڵێ.",
        situationAr: "عندما يأتي النادل لأخذ الطلب",
        theyAskAr: "هل أنتم مستعدون للطلب، أم تحتاجون لمزيد من الوقت؟",
        correctAr: "نحن مستعدون. سآخذ السمك من فضلك.",
        wrong1Ar: "أعطني قائمة الطعام.",
        wrong2Ar: "الحساب من فضلك، أنا مغادر.",
        wrong3Ar: "لدي حساسية من المكسرات.",
        explanationAr: "إذا كنت جاهزاً قل 'We are ready' ثم اذكر وجبتك."
      },
      {
        situation: "پرسیارکردن دەربارەی خواردنی باش لە چێشتخانە",
        theyAsk: "Welcome! What can I get for you today?",
        correct: "Do you have any recommendations for the main course?",
        wrong1: "Here is your napkin.",
        wrong2: "Table for two, please.",
        wrong3: "Could you pass the salt?",
        explanation: "ئەمە ڕستەیەکی زۆر نایابە بۆ پرسیارکردن لە پێشنیازی نادلەکە.",
        situationAr: "السؤال عن طبق مميز في المطعم",
        theyAskAr: "أهلاً بك! ماذا يمكنني أن أقدم لك اليوم؟",
        correctAr: "هل لديك أي توصيات للطبق الرئيسي؟",
        wrong1Ar: "تفضل منديلك.",
        wrong2Ar: "طاولة لشخصين من فضلك.",
        wrong3Ar: "هل يمكنك تمرير الملح؟",
        explanationAr: "هذا سؤال ممتاز لطلب توصيات من النادل حول الوجبات."
      }
    ]
  },

  // Lesson 2: Describing Taste
  {
    topic: "Describing Taste", topicKu: "وەسفکردنی تام", topicAr: "وصف الطعم",
    words: [
      { english: "This steak is delicious", kurdish: "ئەم ستەیکە زۆر بەتامە", arabic: "شريحة اللحم هذه لذيذة" },
      { english: "Too salty for me", kurdish: "بۆ من زۆر سوێرە", arabic: "مالح جداً بالنسبة لي" },
      { english: "Sweet and sour chicken", kurdish: "مریشکی ترش و شیرین", arabic: "دجاج حلو وحامض" },
      { english: "Spicy food", kurdish: "خواردنی توند (توون)", arabic: "طعام حار" },
      { english: "Bitter taste", kurdish: "تامی تاڵ", arabic: "طعم مر" },
      { english: "Rich and creamy soup", kurdish: "شۆربای خەست و کرێمی", arabic: "حساء غني ودسم" },
      { english: "Fresh fruit salad", kurdish: "زەڵاتەی میوەی تازە", arabic: "سلطة فواكه طازجة" },
      { english: "A bit bland", kurdish: "کەمێک بێ تامە (خوێی کەمە)", arabic: "بلا طعم تقريباً (خفيف)" },
    ],
    voices: [
      { prompt: "بڵێ خواردنەکە توندە", target: "This curry is very spicy.", targetKurdish: "ئەم کارییە زۆر توندە.", promptAr: "قل الطعام حار جداً", targetArabic: "هذا الكاري حار جداً." },
      { prompt: "وەسفی تامی زەڵاتەکە بکە", target: "The fruit salad is fresh and sweet.", targetKurdish: "زەڵاتەی میوەکە تازە و شیرینە.", promptAr: "صف طعم السلطة", targetArabic: "سلطة الفواكه طازجة وحلوة." },
      { prompt: "بڵێ شۆرباکە خوێی زۆرە", target: "The soup is a bit too salty.", targetKurdish: "شۆرباکە کەمێک زۆر سوێرە.", promptAr: "قل الحساء مالح قليلاً", targetArabic: "الحساء مالح قليلاً." },
    ],
    sentences: [
      { english: ["I", "love", "sweet", "and", "sour", "sauce", "on", "my", "rice"], kurdish: "حەزم لە سۆسی ترش و شیرینە لەسەر برنجەکەم", arabic: "أحب الصلصة الحلوة والحامضة على الأرز الخاص بي" },
      { english: ["This", "coffee", "has", "a", "very", "bitter", "taste"], kurdish: "ئەم قاوەیە تامی زۆر تاڵە", arabic: "هذه القهوة لها طعم مر جداً" },
      { english: ["The", "pasta", "is", "delicious", "and", "very", "creamy"], kurdish: "پاستاکە بەتامە و زۆر کرێمییە", arabic: "المعكرونة لذيذة ودسمة جداً" },
      { english: ["The", "chicken", "is", "a", "bit", "bland", "without", "spices"], kurdish: "مریشکەکە کەمێک بێ تامە بەبێ بەهارات", arabic: "الدجاج بلا طعم تقريباً بدون بهارات" },
    ],
    fillBlanks: [
      { parts: ["I cannot eat this because it is too", "!"], hint: "ناتوانم ئەمە بخۆم چونکە زۆر توندە!", answer: "spicy", wrongs: ["sweet", "fresh", "bland"], arabicHint: "لا أستطيع أكل this لأنه حار جداً!", arabicParts: ["لا أستطيع أكل this لأنه", "جداً!"], arabicAnswer: "حار", arabicWrongs: ["حلو", "طازج", "خفيف"] },
      { parts: ["This dessert is", "and delicious."], hint: "ئەم شیرینییە زۆر شیرین و بەتامە.", answer: "sweet", wrongs: ["bitter", "salty", "bland"], arabicHint: "هذه الحلوى حلوة ولذيذة.", arabicParts: ["هذه الحلوى", "ولذيذة."], arabicAnswer: "حلوة", arabicWrongs: ["مرة", "مالحة", "بلا طعم"] },
      { parts: ["The soup needs salt; it is a bit", "."], hint: "شۆرباکە پێویستی بە خوێیە؛ کەمێک بێ تامە.", answer: "bland", wrongs: ["delicious", "spicy", "creamy"], arabicHint: "الحساء يحتاج ملحاً؛ إنه خفيف قليلاً.", arabicParts: ["الحساء يحتاج ملحاً؛ إنه", "قليلاً."], arabicAnswer: "خفيف", arabicWrongs: ["لذيذ", "حار", "دسم"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی تامی خواردنەکە",
        theyAsk: "How is your steak?",
        correct: "It is delicious! Perfectly cooked and very rich.",
        wrong1: "Too bitter for me.",
        wrong2: "It is sweet and sour chicken.",
        wrong3: "I want a fresh salad.",
        explanation: "وەڵامی 'delicious' باشترینە بۆ دەربڕینی ڕەزامەندی لە خواردنێکی بەتام.",
        situationAr: "السؤال عن طعم الوجبة",
        theyAskAr: "كيف تجد شريحة اللحم الخاصة بك؟",
        correctAr: "إنها لذيذة! مطبوخة بشكل مثالي وغنية بالنكهة.",
        wrong1Ar: "مرة جداً بالنسبة لي.",
        wrong2Ar: "إنه دجاج حلو وحامض.",
        wrong3Ar: "أريد سلطة طازجة.",
        explanationAr: "الرد بـ 'delicious' هو الأنسب للتعبير عن إعجابك بالطعام."
      },
      {
        situation: "ئاگادارکردنەوەی هاوڕێیەک لە توندی خواردنێک",
        theyAsk: "Should I try this soup?",
        correct: "Be careful, it is extremely spicy!",
        wrong1: "Yes, it is very bland.",
        wrong2: "No, it is too sweet.",
        wrong3: "It is fresh fruit.",
        explanation: "ئەگەر شتێک توند بوو، باشە بڵێی 'extremely spicy' وەک ئاگادارکردنەوە.",
        situationAr: "تحذير صديق من طعام حار",
        theyAskAr: "هل يجب أن أجرب هذا الحساء؟",
        correctAr: "احذر، إنه حار للغاية!",
        wrong1Ar: "نعم، إنه خفيف المذاق.",
        wrong2Ar: "لا، إنه حلو جداً.",
        wrong3Ar: "إنها فاكهة طازجة.",
        explanationAr: "إذا كان الطعام حاراً، فمن الجيد استخدام 'extremely spicy' للتحذير."
      }
    ]
  },

  // Lesson 3: Cooking at Home
  {
    topic: "Cooking at Home", topicKu: "لێنان لە ماڵەوە", topicAr: "الطبخ في المنزل",
    words: [
      { english: "Follow the recipe", kurdish: "جێبەجێکردنی ڕەچەتەکە", arabic: "اتباع الوصفة" },
      { english: "Boil the water", kurdish: "کوڵاندنی ئاوەکە", arabic: "غلي الماء" },
      { english: "Fry the onions", kurdish: "سوورکردنەوەی پیازەکان", arabic: "قلي البصل" },
      { english: "Bake a cake", kurdish: "برژاندنی کێک لە فڕن", arabic: "خبز كعكة" },
      { english: "Chop the vegetables", kurdish: "وردکردنی سەوزەواتەکان", arabic: "تقطيع الخضار" },
      { english: "Stir the soup", kurdish: "تێکدانی شۆرباکە", arabic: "تحريك الحساء" },
      { english: "Preheat the oven", kurdish: "پێشوەختە گەرمکردنی فڕنەکە", arabic: "تسخين الفرن مسبقاً" },
      { english: "Tablespoon of olive oil", kurdish: "کەوچکێکی گەورە لە زەیتی زەیتوون", arabic: "ملعقة كبيرة من زيت الزيتون" },
    ],
    voices: [
      { prompt: "پێشنیاری کوڵاندنی ئاو بکە بۆ پاستا", target: "First, you need to boil the water for pasta.", targetKurdish: "سەرەتا، پێویستە ئاوەکە بۆ پاستاکە بکوڵێنیت.", promptAr: "اقترح غلي الماء للمعكرونة", targetArabic: "أولاً، عليك غلي الماء للمعكرونة." },
      { prompt: "بڵێ خەریکی کەرەستە وردکردنی", target: "I am chopping the vegetables for dinner.", targetKurdish: "خەریکم سەوزەواتەکان بۆ شێو ورد دەکەم.", promptAr: "قل أنك تقطع الخضار", targetArabic: "أنا أقطع الخضار للعشاء." },
      { prompt: "داوای تێکدانی خواردن بکە", target: "Please stir the soup while it cooks.", targetKurdish: "تکایە شۆرباکە تێک بدە کاتێک دەکوڵێت.", promptAr: "اطلب تحريك الطعام", targetArabic: "من فضلك حرك الحساء أثناء طهيه." },
    ],
    sentences: [
      { english: ["We", "must", "follow", "the", "recipe", "to", "make", "this", "bread"], kurdish: "پێویستە پەیڕەوی ڕێچکەکە بکەین بۆ دروستکردنی ئەم نانە", arabic: "يجب أن نتبع الوصفة لصنع هذا الخبز" },
      { english: ["Fry", "the", "onions", "in", "a", "tablespoon", "of", "olive", "oil"], kurdish: "پیازەکان لە کەوچکێکی گەورە لە زەیتی زەیتوون سوور بکەرەوە", arabic: "اقلِ البصل في ملعقة كبيرة من زيت الزيتون" },
      { english: ["Remember", "to", "preheat", "the", "oven", "to", "two", "hundred", "degrees"], kurdish: "لەبیرت بێت فڕنەکە گەرم بکەیت بۆ دووسەد پلە", arabic: "تذكر تسخين الفرن مسبقاً إلى مئتي درجة" },
      { english: ["I", "love", "to", "bake", "cookies", "on", "weekends"], kurdish: "حەزم لێیە لە کۆتایی هەفتەدا کێک و بسکیت ببرژێنم", arabic: "أحب خبز البسكويت في عطلة نهاية الأسبوع" },
    ],
    fillBlanks: [
      { parts: ["Please", "the vegetables into small pieces."], hint: "تکایە سەوزەواتەکان بۆ پارچەی بچووک ورد بکە.", answer: "chop", wrongs: ["boil", "fry", "bake"], arabicHint: "من فضلك قطع الخضار إلى قطع صغيرة.", arabicParts: ["من فضلك", "الخضار إلى قطع صغيرة."], arabicAnswer: "قطع", arabicWrongs: ["اغلِ", "اقلِ", "اخبز"] },
      { parts: ["Before you bake the cake, you must preheat the", "."], hint: "پێش ئەوەی کێکەکە ببرژێنیت، پێویستە فڕنەکە گەرم بکەیت.", answer: "oven", wrongs: ["recipe", "soup", "oil"], arabicHint: "قبل خبز الكعكة، يجب تسخين الفرن.", arabicParts: ["قبل خبز الكعكة، يجب تسخين", "."], arabicAnswer: "الفرن", arabicWrongs: ["الوصفة", "الحساء", "الزيت"] },
      { parts: ["We need to", "the water before adding pasta."], hint: "پێویستە ئاوەکە بکوڵێنین پێش زیادکردنی پاستا.", answer: "boil", wrongs: ["chop", "fry", "stir"], arabicHint: "نحن بحاجة لغلي الماء قبل إضافة المعكرونة.", arabicParts: ["نحن بحاجة لـ", "الماء قبل إضافة المعكرونة."], arabicAnswer: "غلي", arabicWrongs: ["تقطيع", "قلي", "تحريك"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی شێوازی دروستکردنی خواردنێک",
        theyAsk: "This cake tastes amazing! How did you make it?",
        correct: "I just followed a simple recipe I found online.",
        wrong1: "Preheat the oven now.",
        wrong2: "I fried the onions yesterday.",
        wrong3: "Boil the water first.",
        explanation: "وەڵامی پەیڕەوکردنی ڕێچکە (recipe) گونجاوترینە بۆ وەڵامدانەوەی چۆنێتی دروستکردن.",
        situationAr: "السؤال عن طريقة صنع الكعكة",
        theyAskAr: "طعم هذه الكعكة مذهل! كيف صنعتها؟",
        correctAr: "لقد اتبعت فقط وصفة بسيطة وجدتها على الإنترنت.",
        wrong1Ar: "سخن الفرن الآن.",
        wrong2Ar: "لقد قلیت البصل بالأمس.",
        wrong3Ar: "اغلِ الماء أولاً.",
        explanationAr: "الرد باتباع الوصفة (recipe) هو الأنسب لشرح كيفية التحضير."
      },
      {
        situation: "هاوکاری لە چێشتخانەدا",
        theyAsk: "How can I help you with dinner?",
        correct: "Could you chop the carrots while I fry the onions?",
        wrong1: "Follow the recipe immediately.",
        wrong2: "Bake a cake please.",
        wrong3: "The water is boiling.",
        explanation: "دابەشکردنی کارەکان وەک وردکردنی گێزەر و سوورکردنەوەی پیاز لە کاتی لێناندا باوە.",
        situationAr: "تقديم المساعدة في المطبخ",
        theyAskAr: "كيف يمكنني مساعدتك في العشاء؟",
        correctAr: "هل يمكنك تقطيع الجزر بينما أقوم بقلي البصل؟",
        wrong1Ar: "اتبع الوصفة فوراً.",
        wrong2Ar: "اخبز كعكة من فضلك.",
        wrong3Ar: "الماء يغلي.",
        explanationAr: "توزيع المهام مثل تقطيع الجزر وقلي البصل أمر معتاد أثناء الطبخ."
      }
    ]
  },

  // Lesson 4: Fruit & Veg Market
  {
    topic: "Fruit & Veg Market", topicKu: "بازاری میوە و سەوزە", topicAr: "سوق الفواكه والخضار",
    words: [
      { english: "Bunch of bananas", kurdish: "دەستە مۆز", arabic: "موزة (مجموعة موز)" },
      { english: "Ripe tomatoes", kurdish: "تەماتەی گەییو", arabic: "طماطم ناضجة" },
      { english: "Fresh apples and grapes", kurdish: "سێو و ترێی تازە", arabic: "تفاح وعنب طازج" },
      { english: "Bag of carrots", kurdish: "کیسەیەک گێزەر", arabic: "كيس من الجزر" },
      { english: "Onions and garlic", kurdish: "پیاز و سیر", arabic: "بصل وثوم" },
      { english: "Sweet watermelon", kurdish: "شوتیی شیرین", arabic: "رقي حلو (بطيخ أحمر)" },
      { english: "Local strawberries", kurdish: "فراولەی خۆماڵی", arabic: "فراولة محلية" },
      { english: "Green lettuce", kurdish: "خەسی سەوز", arabic: "خس أخضر" },
    ],
    voices: [
      { prompt: "داوای کڕینی فراولە بکە", target: "I want to buy a box of local strawberries.", targetKurdish: "دەمەوێت سندوقێک فراولەی خۆماڵی بکڕم.", promptAr: "اطلب شراء فراولة", targetArabic: "أريد شراء علبة من الفراولة المحلية." },
      { prompt: "باسی مۆزەکان بکە", target: "This bunch of bananas is not ripe yet.", targetKurdish: "ئەم دەستە مۆزە هێشتا نەگەیشتووە.", promptAr: "تحدث عن الموز", targetArabic: "مجموعة الموز هذه لم تنضج بعد." },
      { prompt: "بڵێ حەزت لە شوتییە", target: "Watermelon is my favorite fruit in summer.", targetKurdish: "شوتی میوەی دڵخوازی منە لە هاویندا.", promptAr: "قل أنك تحب البطيخ", targetArabic: "الرقي (البطيخ الأحمر) هو فاكهتي المفضلة في الصيف." },
    ],
    sentences: [
      { english: ["Please", "put", "the", "onions", "and", "garlic", "in", "the", "bag"], kurdish: "تکایە پیاز و سیرەکە بخەرە ناو کیسەکەوە", arabic: "من فضلك ضع البصل والثوم في الكيس" },
      { english: ["These", "ripe", "tomatoes", "are", "perfect", "for", "the", "sauce"], kurdish: "ئەم تەماتە گەییوانە زۆر باشن بۆ سۆسەکە", arabic: "هذه الطماطم الناضجة مثالية للصلصة" },
      { english: ["Add", "some", "green", "lettuce", "to", "the", "salad"], kurdish: "کەمێک خەسی سەوز زیاد بکە بۆ زەڵاتەکە", arabic: "أضف بعض الخس الأخضر إلى السلطة" },
      { english: ["We", "need", "fresh", "apples", "and", "grapes", "from", "the", "market"], kurdish: "پێویستمان بە سێو و ترێی تازە هەیە لە بازارەکەوە", arabic: "نحن بحاجة إلى تفاح وعنب طازج من السوق" },
    ],
    fillBlanks: [
      { parts: ["I bought a", "of fresh carrots."], hint: "کیسەیەک گێزەری تازەم کڕی.", answer: "bag", wrongs: ["bunch", "ripe", "lettuce"], arabicHint: "اشتريت كيساً من الجزر الطازج.", arabicParts: ["اشتريت", "من الجزر الطازج."], arabicAnswer: "كيساً", arabicWrongs: ["مجموعة", "ناضج", "خس"] },
      { parts: ["The red strawberries are very", "and sweet."], hint: "فراولە سوورەکان زۆر گەییو و شیرینن.", answer: "ripe", wrongs: ["bag", "lettuce", "garlic"], arabicHint: "الفراولة الحمراء ناضجة جداً وحلوة.", arabicParts: ["الفراولة الحمراء", "جداً وحلوة."], arabicAnswer: "ناضجة", arabicWrongs: ["كيس", "خس", "ثوم"] },
      { parts: ["We need a", "of bananas for breakfast."], hint: "پێویستمان بە دەستە مۆزێکە بۆ نانی بەیانی.", answer: "bunch", wrongs: ["bag", "garlic", "lettuce"], arabicHint: "نحن بحاجة لمجموعة من الموز للفطور.", arabicParts: ["نحن بحاجة لـ", "من الموز للفطور."], arabicAnswer: "مجموعة", arabicWrongs: ["كيس", "ثوم", "خس"] },
    ],
    conversations: [
      {
        situation: "داواکاری کڕینی میوە لە بازار",
        theyAsk: "How can I help you today, sir?",
        correct: "I would like a bunch of bananas and a sweet watermelon, please.",
        wrong1: "The tomatoes are rotten.",
        wrong2: "Chop the garlic now.",
        wrong3: "Preheat the oven.",
        explanation: "بەکارهێنانی 'I would like... please' شێوازێکی جوانە بۆ بازاڕکردن لە دەکان.",
        situationAr: "طلب شراء فاكهة في السوق",
        theyAskAr: "كيف يمكنني مساعدتك اليوم يا سيدي؟",
        correctAr: "أود الحصول على مجموعة من الموز ورقي (بطيخ) حلو، من فضلك.",
        wrong1Ar: "الطماطم تالفة.",
        wrong2Ar: "قطع الثوم الآن.",
        wrong3Ar: "سخن الفرن مسبقاً.",
        explanationAr: "استخدام 'I would like... please' أسلوب مهذب للشراء في المتجر."
      },
      {
        situation: "هەڵبژاردنی تەماتەی باش",
        theyAsk: "Which tomatoes should we use for salad?",
        correct: "Choose the ripe tomatoes, they have a better taste.",
        wrong1: "Put the garlic in the bag.",
        wrong2: "We need green lettuce.",
        wrong3: "Fry the onions first.",
        explanation: "تەماتەی گەییو (ripe tomatoes) باشترینە بۆ زەڵاتە.",
        situationAr: "اختيار الطماطم الجيدة",
        theyAskAr: "أي طماطم يجب أن نستخدمها للسلطة؟",
        correctAr: "اختر الطماطم الناضجة، فطعمها أفضل.",
        wrong1Ar: "ضع الثوم في الكيس.",
        wrong2Ar: "نحن بحاجة إلى خس أخضر.",
        wrong3Ar: "اقلِ البصل أولاً.",
        explanationAr: "الطماطم الناضجة (ripe tomatoes) هي الأفضل للسلطة."
      }
    ]
  },

  // Lesson 5: Past Activities
  {
    topic: "Past Activities", topicKu: "چالاکییەکانی ڕابردوو", topicAr: "نشاطات الماضي",
    words: [
      { english: "Yesterday afternoon", kurdish: "دوێنێ دوانیوەڕۆ", arabic: "أمس بعد الظهر" },
      { english: "Watched a movie", kurdish: "سەیری فیلمێکم کرد", arabic: "شاهدت فيلماً" },
      { english: "Played football", kurdish: "تۆپی پێم یاری کرد", arabic: "لعبت كرة القدم" },
      { english: "Enjoyed the dinner", kurdish: "چێژم لە شێوەکە بینی", arabic: "استمتعت بالعشاء" },
      { english: "Visited my family", kurdish: "سەردانی خێزانەکەمم کرد", arabic: "زرت عائلتي" },
      { english: "Walked in the park", kurdish: "پیاسەم کرد لە پارکەکە", arabic: "مشيت في الحديقة" },
      { english: "Cleaned my room", kurdish: "ژوورەکەمم پاککردەوە", arabic: "نظفت غرفتي" },
      { english: "Talked to a friend", kurdish: "قسەم لەگەڵ هاوڕێیەک کرد", arabic: "تحدثت مع صديق" },
    ],
    voices: [
      { prompt: "بڵێ دوێنێ سەردانی ماڵی خێزانت کردووە", target: "Yesterday afternoon, I visited my family.", targetKurdish: "دوێنێ دوانیوەڕۆ، سەردانی خێزانەکەمم کرد.", promptAr: "قل أنك زرت عائلتك أمس", targetArabic: "أمس بعد الظهر، زرت عائلتي." },
      { prompt: "بڵێ لە پارک پیاسەت کردووە", target: "We walked in the park for an hour.", targetKurdish: "بۆ ماوەی کاتژمێرێک لە پارکەکە پیاسەمان کرد.", promptAr: "قل أنكم مشيتم في الحديقة", targetArabic: "مشينا في الحديقة لمدة ساعة." },
      { prompt: "بڵێ فیلمت بینیوە", target: "Last night, I watched a movie with my brother.", targetKurdish: "شەوی ڕابردوو، لەگەڵ برام سەیری فیلمێکم کرد.", promptAr: "قل أنك شاهدت فيلماً", targetArabic: "الليلة الماضية، شاهدت فيلماً مع أخي." },
    ],
    sentences: [
      { english: ["I", "talked", "to", "my", "friend", "on", "the", "phone", "yesterday"], kurdish: "دوێنێ بە تەلەفۆن قسەم لەگەڵ هاوڕێیەکەم کرد", arabic: "تحدثت مع صديقي على الهاتف أمس" },
      { english: ["We", "really", "enjoyed", "the", "delicious", "dinner"], kurdish: "ئێمە بەڕاستی چێژمان لەو شێو بەتامە بینی", arabic: "لقد استمتعنا حقاً بالعشاء اللذيذ" },
      { english: ["He", "cleaned", "his", "room", "this", "morning"], kurdish: "ئەو ئەم بەیانییە ژوورەکەی خۆی پاککردەوە", arabic: "هو نظف غرفته هذا الصباح" },
      { english: ["They", "played", "football", "after", "school"], kurdish: "ئەوان دوای قوتابخانە یاری تۆپی پێیان کرد", arabic: "لعبوا كرة القدم بعد المدرسة" },
    ],
    fillBlanks: [
      { parts: ["Last night, we", "a great action movie."], hint: "شەوی ڕابردوو سەیری فیلمێکی ئەکشنی نایابمان کرد.", answer: "watched", wrongs: ["watched", "visiting", "walks"], arabicHint: "الليلة الماضية، شاهدنا فيلماً رائعاً.", arabicParts: ["الليلة الماضية،", "فيلماً رائعاً."], arabicAnswer: "شاهدنا", arabicWrongs: ["شاهد", "يزور", "يمشي"] },
      { parts: ["Yesterday afternoon, I", "in the green park."], hint: "دوێنێ دوانیوەڕۆ، لە پارکە سەوزەکەدا پیاسەم کرد.", answer: "walked", wrongs: ["talked", "cleaned", "visited"], arabicHint: "أمس بعد الظهر، مشيت في الحديقة الخضراء.", arabicParts: ["أمس بعد الظهر،", "في الحديقة الخضراء."], arabicAnswer: "مشيت", arabicWrongs: ["تحدثت", "نظفت", "زرت"] },
      { parts: ["She", "her family last weekend."], hint: "ئەو کۆتایی هەفتەی ڕابردوو سەردانی خێزانەکەی کرد.", answer: "visited", wrongs: ["cleaned", "enjoyed", "played"], arabicHint: "هي زارت عائلتها عطلة نهاية الأسبوع الماضي.", arabicParts: ["هي", "عائلتها عطلة نهاية الأسبوع الماضي."], arabicAnswer: "زارت", arabicWrongs: ["نظفت", "استمتعت", "لعبت"] },
    ],
    conversations: [
      {
        situation: "وەڵامدانەوەی پرسیار دەربارەی دوێنێ",
        theyAsk: "What did you do yesterday afternoon?",
        correct: "I visited my family and then we enjoyed a delicious dinner.",
        wrong1: "I am going to school.",
        wrong2: "Please preheat the oven.",
        wrong3: "I want a box of strawberries.",
        explanation: "پرسیارەکە بە ڕابردوو کراوە (What did you do...) بۆیە وەڵامەکەش دەبێت کردارەکانی لە ڕابردوودا بێت (visited, enjoyed).",
        situationAr: "الإجابة على سؤال حول يوم أمس",
        theyAskAr: "ماذا فعلت أمس بعد الظهر؟",
        correctAr: "زرت عائلتي ثم استمتعنا بعشاء لذيذ.",
        wrong1Ar: "أنا ذاهب إلى المدرسة.",
        wrong2Ar: "يرجى تسخين الفرن مسبقاً.",
        wrong3Ar: "أريد علبة فراولة.",
        explanationAr: "السؤال في الماضي (What did you do...) لذا يجب أن يكون الجواب بأفعال ماضية."
      },
      {
        situation: "قسەکردن دەربارەی کۆتایی هەفتە",
        theyAsk: "Did you have a good weekend?",
        correct: "Yes, I talked to a friend and we walked in the park.",
        wrong1: "No, the tomatoes are ripe.",
        wrong2: "I should follow the recipe.",
        wrong3: "Boil the water now.",
        explanation: "وەڵامێکی ئاسایی و گونجاوە بۆ ڕوونکردنەوەی چالاکییەکانی کۆتایی هەفتە.",
        situationAr: "التحدث عن عطلة نهاية الأسبوع",
        theyAskAr: "هل قضيت عطلة نهاية أسبوع جيدة؟",
        correctAr: "نعم، تحدثت مع صديق ومشينا في الحديقة.",
        wrong1Ar: "لا، الطماطم ناضجة.",
        wrong2Ar: "يجب أن أتبع الوصفة.",
        wrong3Ar: "اغلِ الماء الآن.",
        explanationAr: "هذا جواب طبيعي لشرح ما قمت به خلال العطلة."
      }
    ]
  },

  // Lesson 6: Social Dining
  {
    topic: "Social Dining", topicKu: "نانخواردنی کۆمەڵایەتی", topicAr: "العشاء الاجتماعي",
    words: [
      { english: "Cheers to our health", kurdish: "بە سڵامەتی تەندروستیمان (لە کاتی پێکدادان)", arabic: "بصحتنا (في نخ الخبز)" },
      { english: "Thank you for hosting", kurdish: "سوپاس بۆ میوانداریکردنتان", arabic: "شكراً على الاستضافة" },
      { english: "Everything was delicious", kurdish: "هەموو شتێک زۆر بەتام بوو", arabic: "كل شيء كان لذيذاً" },
      { english: "Are you full", kurdish: "تێر بوویت؟", arabic: "هل شبعت" },
      { english: "Just a small portion", kurdish: "تەنها بەشێکی بچووک (کەمێک خواردن)", arabic: "حصة صغيرة فقط" },
      { english: "Pass the water jug", kurdish: "تەنگەی (جەگ) ئاوەکە بنێرە", arabic: "مرر إبريق الماء" },
      { english: "Table manners", kurdish: "ئادابەکانی سەر مێزی نانخواردن", arabic: "آداب المائدة" },
      { english: "Refill your glass", kurdish: "پڕکردنەوەی پەرداخەکەت", arabic: "إعادة ملء كوبك" },
    ],
    voices: [
      { prompt: "سوپاسی میواندارەکە بکە", target: "Thank you so much for hosting us tonight.", targetKurdish: "زۆر سوپاس بۆ میوانداریکردنمان لەم شەوەدا.", promptAr: "اشكر المضيف", targetArabic: "شكراً جزيلاً لك على استضافتنا الليلة." },
      { prompt: "داوای کەمێک خواردن بکە", target: "Just a small portion of rice, please.", targetKurdish: "تەنها بەشێکی بچووک لە برنج، تکایە.", promptAr: "اطلب حصة صغيرة من الطعام", targetArabic: "حصة صغيرة من الأرز فقط، من فضلك." },
      { prompt: "بڵێ تەواو تێر بوویت", target: "No more for me, thank you, I am full.", targetKurdish: "بۆ من بەسە، سوپاس، تێر بووم.", promptAr: "قل أنك شبعت تماماً", targetArabic: "لا أريد المزيد، شكراً لك، لقد شبعت." },
    ],
    sentences: [
      { english: ["Cheers", "to", "a", "great", "evening", "with", "good", "friends"], kurdish: "سڵامەت بێت بۆ ئێوارەیەکی نایاب لەگەڵ هاوڕێیانی باش", arabic: "نخب أمسية رائعة مع أصدقاء طيبين" },
      { english: ["Everything", "we", "ate", "tonight", "was", "absolutely", "delicious"], kurdish: "هەموو ئەو شتانەی ئەمشەو خواردمان بەڕاستی بەتام بوو", arabic: "كل شيء أكلناه الليلة كان لذيذاً للغاية" },
      { english: ["Can", "I", "refill", "your", "glass", "with", "some", "juice"], kurdish: "دەتوانم پەرداخەکەت بە کەمێک شەربەت پڕ بکەمەوە؟", arabic: "هل يمكنني إعادة ملء كوبك ببعض العصير؟" },
      { english: ["Good", "table", "manners", "are", "important", "during", "dinner"], kurdish: "ئادابە باشەکانی سەر مێز گرنگن لە کاتی نانخواردنی ئێوارەدا", arabic: "آداب المائدة الجيدة مهمة أثناء العشاء" },
    ],
    fillBlanks: [
      { parts: ["Thank you for", "us, we had a great time."], hint: "سوپاس بۆ میوانداریکردنمان، کاتێکی خۆشمان بەسەر برد.", answer: "hosting", wrongs: ["refilling", "dining", "drinking"], arabicHint: "شكراً لاستضافتنا، لقد قضينا وقتاً رائعاً.", arabicParts: ["شكراً لـ", "، لقد قضينا وقتاً رائعاً."], arabicAnswer: "استضافتنا", arabicWrongs: ["ملئنا", "أكلنا", "شربنا"] },
      { parts: ["Would you like me to", "your glass?"], hint: "دەتەوێت پەرداخەکەت بۆ پڕ بکەمەوە؟", answer: "refill", wrongs: ["host", "pass", "taste"], arabicHint: "هل تريدني أن أعيد ملء كوبك؟", arabicParts: ["هل تريدني أن", "كوبك؟"], arabicAnswer: "أعيد ملء", arabicWrongs: ["أستضيف", "أمرر", "أتذوق"] },
      { parts: ["I am already", ", the food was amazing."], hint: "من پێشتر تێر بووم، خواردنەکە سەرسوڕهێنەر بوو.", answer: "full", wrongs: ["delicious", "salty", "hosting"], arabicHint: "لقد شبعت بالفعل، الطعام كان مذهلاً.", arabicParts: ["لقد", "بالفعل، الطعام كان مذهلاً."], arabicAnswer: "شبعت", arabicWrongs: ["لذيذ", "مالح", "الاستضافة"] },
    ],
    conversations: [
      {
        situation: "میواندارەکە پێشنیازی خواردنی زیاترت بۆ دەکات",
        theyAsk: "Would you like some more meat?",
        correct: "No, thank you. I am completely full. Everything was delicious!",
        wrong1: "Cheers to our health!",
        wrong2: "Thank you for hosting me yesterday.",
        wrong3: "Pass the water jug quickly.",
        explanation: "ڕەتکردنەوەی بەئەدەب کاتێک تێریت بەکاردهێنرێت: 'No, thank you. I am completely full...'",
        situationAr: "المضيف يعرض عليك المزيد من الطعام",
        theyAskAr: "هل ترغب في بعض اللحم الإضافي؟",
        correctAr: "لا شكراً لك. لقد شبعت تماماً. كل شيء كان لذيذاً!",
        wrong1Ar: "بصحتنا جميعاً!",
        wrong2Ar: "شكراً على استضافتي بالأمس.",
        wrong3Ar: "مرر إبريق الماء بسرعة.",
        explanationAr: "الرفض المهذب عند الشبع يكون بـ: 'No, thank you. I am completely full...'"
      },
      {
        situation: "ئەنجامدانی نخب (پێکدادان) لەسەر مێزەکە",
        theyAsk: "Let's make a toast to our friendship!",
        correct: "Cheers! To many more years of friendship.",
        wrong1: "Everything was delicious.",
        wrong2: "Table manners are important.",
        wrong3: "Refill my glass.",
        explanation: "لە کاتی دروستکردنی پێکدادان یان نخب بۆ هاوڕێیەتی، وشەی 'Cheers' بەکاردێت.",
        situationAr: "رفع نخب الصداقة على المائدة",
        theyAskAr: "لنرفع نخباً لصداقتنا!",
        correctAr: "بصحتنا! لسنوات عديدة أخرى من الصداقة.",
        wrong1Ar: "كل شيء كان لذيذاً.",
        wrong2Ar: "آداب المائدة مهمة.",
        wrong3Ar: "أعد ملء كوبي.",
        explanationAr: "عند رفع النخب (toast) للصداقة، تستخدم كلمة 'Cheers'."
      }
    ]
  },

  // Lesson 7: Diet & Health
  {
    topic: "Diet & Health", topicKu: "ڕێجیم و تەندروستی", topicAr: "الحمية والصحة",
    words: [
      { english: "Healthy eating habits", kurdish: "عاداتی نانخواردنی تەندروست", arabic: "عادات الأكل الصحية" },
      { english: "Low in calories", kurdish: "کالۆری کەم", arabic: "منخفض السعرات الحرارية" },
      { english: "Avoid processed sugar", kurdish: "دوورکەوتنەوە لە شەکرە دەستکردەکان", arabic: "تجنب السكر المصنع" },
      { english: "Source of protein", kurdish: "سەرچاوەی پرۆتین", arabic: "مصدر للبروتين" },
      { english: "Fresh organic food", kurdish: "خواردنی ئۆرگانیکی تازە", arabic: "طعام عضوي طازج" },
      { english: "Balanced diet", kurdish: "سیستەمی خۆراکی هاوسەنگ", arabic: "حمية غذائية متوازنة" },
      { english: "Stay hydrated", kurdish: "بە شێداری مانەوە (خواردنەوەی ئاوی پێویست)", arabic: "الحفاظ على رطوبة الجسم (شرب الماء)" },
      { english: "Vegetarian options", kurdish: "بژاردە ڕووەکییەکان", arabic: "خيارات نباتية" },
    ],
    voices: [
      { prompt: "بڵێ ئاو خواردنەوە گرنگە", target: "It is important to drink water and stay hydrated.", targetKurdish: "گرنگە ئاو بخۆیتەوە و بە شێداری بمێنیتەوە.", promptAr: "قل أن شرب الماء مهم", targetArabic: "من المهم شرب الماء والحفاظ على رطوبة الجسم." },
      { prompt: "باسی گرنگی سیستەمی خۆراک بکە", target: "A balanced diet helps you stay strong.", targetKurdish: "سیستەمی خۆراکی هاوسەنگ یارمەتیدەرە بۆ بەهێز مانەوەت.", promptAr: "تحدث عن أهمية النظام الغذائي", targetArabic: "الحمية الغذائية المتوازنة تساعدك على البقاء قوياً." },
      { prompt: "بڵێ هێلکە پرۆتینی تێدایە", target: "Eggs are a great source of protein.", targetKurdish: "هێلکە سەرچاوەیەکی زۆر باشی پرۆتینە.", promptAr: "قل أن البيض يحتوي على بروتين", targetArabic: "البيض مصدر رائع للبروتين." },
    ],
    sentences: [
      { english: ["We", "should", "always", "try", "to", "avoid", "processed", "sugar"], kurdish: "دەبێت هەمیشە هەوڵ بدەین خۆمان لە شەکری دروستکراو دوور بخەینەوە", arabic: "ينبغي علينا دائماً محاولة تجنب السكر المصنع" },
      { english: ["Organic", "vegetables", "are", "very", "healthy", "for", "you"], kurdish: "سەوزەواتە ئۆرگانیکییەکان زۆر تەندروستن بۆ تۆ", arabic: "الخضار العضوية صحية جداً بالنسبة لك" },
      { english: ["This", "yogurt", "is", "very", "low", "in", "calories"], kurdish: "ئەم ماستە کالۆری زۆر کەمە", arabic: "هذا اللبن منخفض جداً في السعرات الحرارية" },
      { english: ["Does", "this", "restaurant", "have", "any", "vegetarian", "options"], kurdish: "ئایا ئەم چێشتخانەیە هیچ بژاردەیەکی ڕووەکی هەیە؟", arabic: "هل يحتوي هذا المطعم على أي خيارات نباتية؟" },
    ],
    fillBlanks: [
      { parts: ["Eating vegetables is a good", "habit."], hint: "خواردنی سەوزە عاداتێکی باشی تەندروستە.", answer: "healthy", wrongs: ["processed", "salty", "bitter"], arabicHint: "أكل الخضار عادة صحية جيدة.", arabicParts: ["أكل الخضار عادة", "جيدة."], arabicAnswer: "صحية", arabicWrongs: ["مصنعة", "مالحة", "مرة"] },
      { parts: ["Try to eat a", "diet with enough protein."], hint: "هەوڵ بدە سیستەمێکی خۆراکی هاوسەنگ بخۆیت کە پرۆتینی پێویستی تێدابێت.", answer: "balanced", wrongs: ["creamy", "ripe", "sweet"], arabicHint: "حاول تناول حمية متوازنة مع بروتين كافٍ.", arabicParts: ["حاول تناول حمية", "مع بروتين كافٍ."], arabicAnswer: "متوازنة", arabicWrongs: ["دسمة", "ناضجة", "حلوة"] },
      { parts: ["Fish is an excellent", "of protein."], hint: "ماسی سەرچاوەیەکی زۆر باشی پرۆتینە.", answer: "source", wrongs: ["diet", "sugar", "option"], arabicHint: "السمك مصدر ممتاز للبروتين.", arabicParts: ["السمك", "ممتاز للبروتين."], arabicAnswer: "مصدر", arabicWrongs: ["حمية", "سكر", "خيار"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی بژاردەی خۆراکی لە چێشتخانە",
        theyAsk: "What would you like to eat today?",
        correct: "Do you have any vegetarian options? I prefer healthy organic food.",
        wrong1: "Avoid processed sugar immediately.",
        wrong2: "Cheers to our health!",
        wrong3: "Refill my glass with cola.",
        explanation: "بۆ کەسێک کە گۆشت ناخوات، پرسیارکردن لە 'vegetarian options' زۆر گونجاوە.",
        situationAr: "السؤال عن خيارات الطعام في المطعم",
        theyAskAr: "ماذا تحب أن تأكل اليوم؟",
        correctAr: "هل لديكم أي خيارات نباتية؟ أنا أفضل الطعام العضوي الصحي.",
        wrong1Ar: "تجنب السكر المصنع فوراً.",
        wrong2Ar: "بصحتنا جميعاً!",
        wrong3Ar: "أعد ملء كوبي بالكولا.",
        explanationAr: "للشخص الذي لا يأكل اللحم، السؤال عن 'vegetarian options' هو الأنسب."
      },
      {
        situation: "ئامۆژگاری هاوڕێیەک بۆ کێش دابەزاندن",
        theyAsk: "I want to lose weight, what should I eat?",
        correct: "You should eat meals that are low in calories and avoid processed sugar.",
        wrong1: "Drink more creamy soup.",
        wrong2: "Follow a salty recipe.",
        wrong3: "I visited my family yesterday.",
        explanation: "ئامۆژگاری تەندروست بۆ کێش دابەزاندن خواردنی کالۆری کەم (low in calories) و دوورکەوتنەوە لە شەکرەیە.",
        situationAr: "نصيحة صديق لإنقاص الوزن",
        theyAskAr: "أريد إنقاص وزني، ماذا يجب أن آكل؟",
        correctAr: "يجب أن تتناول وجبات منخفضة السعرات وتتجنب السكر المصنع.",
        wrong1Ar: "تناول المزيد من الحساء الدسم.",
        wrong2Ar: "اتبع وصفة طعام مالحة.",
        wrong3Ar: "لقد زرت عائلتي بالأمس.",
        explanationAr: "النصيحة الصحية لإنقاص الوزن تشمل تناول سعرات حرارية منخفضة وتجنب السكر."
      }
    ]
  },

  // Lesson 8: Coffee Shop
  {
    topic: "Coffee Shop", topicKu: "کافتریا", topicAr: "المقهى",
    words: [
      { english: "Espresso and latte", kurdish: "ئێسپێرسۆ و لاتی (جۆرەکانی قاوە)", arabic: "إسبريسو ولاتيه" },
      { english: "Decaf option", kurdish: "قاوەی بێ کافاین (دیکاف)", arabic: "خيار خالي من الكافيين" },
      { english: "Large ceramic mug", kurdish: "ماگێکی گەورەی سیرامیک", arabic: "كوب سيراميك كبير" },
      { english: "Pastry and croissants", kurdish: "شیرینی و کرۆسان", arabic: "المعجنات والكرواسون" },
      { english: "Coffee bean blend", kurdish: "تێکەڵەی دەنکە قاوەکان", arabic: "خليط حبوب البن" },
      { english: "Sugar and milk", kurdish: "شەکر و شیر", arabic: "سكر وحليب" },
      { english: "To-go cup", kurdish: "پەرداخی سەفەری (بۆ بردنە دەرەوە)", arabic: "كوب سفري (لأخذه معك)" },
      { english: "Hot chocolate", kurdish: "شۆکۆلاتەی گەرم", arabic: "شوكولاتة ساخنة" },
    ],
    voices: [
      { prompt: "قاوەیەکی لاتی داوا بکە", target: "I would like a large latte with sugar, please.", targetKurdish: "لاتییەکی گەورە لەگەڵ شەکر دەوێت، تکایە.", promptAr: "اطلب قهوة لاتيه", targetArabic: "أود الحصول على لاتيه كبير مع السكر، من فضلك." },
      { prompt: "بپرس ئایا قاوەی بێ کافاینیان هەیە", target: "Do you have a decaf option for this coffee?", targetKurdish: "ئایا بژاردەی بێ کافاینتان هەیە بۆ ئەم قاوەیە؟", promptAr: "اسأل عن قهوة منزوعة الكافيين", targetArabic: "هل لديكم خيار خالٍ من الكافيين لهذه القهوة؟" },
      { prompt: "داوای شیرینی بکە لەگەڵ قاوەکە", target: "I want to get a croissant with my hot chocolate.", targetKurdish: "دەمەوێت کرۆسانێک لەگەڵ شۆکۆلاتە گەرمەکەم وەربگرم.", promptAr: "اطلب معجنات مع القهوة", targetArabic: "أريد الحصول على كرواسون مع الشوكولاتة الساخنة الخاصة بي." },
    ],
    sentences: [
      { english: ["We", "use", "a", "special", "blend", "of", "coffee", "beans"], kurdish: "ئێمە تێکەڵەیەکی تایبەت لە دەنکە قاوە بەکاردەهێنین", arabic: "نحن نستخدم خليطاً خاصاً من حبوب البن" },
      { english: ["Please", "put", "the", "hot", "coffee", "in", "a", "to-go", "cup"], kurdish: "تکایە قاوە گەرمەکە بخەرە ناو پەرداخێکی سەفەرییەوە", arabic: "من فضلك ضع القهوة الساخنة في كوب سفري" },
      { english: ["I", "prefer", "a", "large", "ceramic", "mug", "over", "plastic"], kurdish: "ماگێکی گەورەی سیرامیک بەسەر پلاستیکدا پەسەند دەکەم", arabic: "أفضل كوباً سيراميكياً كبيراً على البلاستيك" },
      { english: ["Do", "you", "want", "any", "sugar", "or", "milk", "in", "your", "latte"], kurdish: "هیچ شەکر یان شیرت لەناو لاتییەکەتدا دەوێت؟", arabic: "هل تريد أي سكر أو حليب في اللاتيه الخاص بك؟" },
    ],
    fillBlanks: [
      { parts: ["I ordered a", "croissant from the pastry menu."], hint: "کرۆسانێکی تازەم لە مێنیووی شیرینییەکان داوا کرد.", answer: "fresh", wrongs: ["decaf", "salty", "bitter"], arabicHint: "طلبت كرواسون طازجاً من قائمة المعجنات.", arabicParts: ["طلبت كرواسون", "من قائمة المعجنات."], arabicAnswer: "طازجاً", arabicWrongs: ["خالٍ من الكافيين", "مالح", "مر"] },
      { parts: ["If you cannot sleep, you should order a", "coffee."], hint: "ئەگەر ناتوانیت بخەویت، دەبێت قاوەیەکی بێ کافاین داوا بکەیت.", answer: "decaf", wrongs: ["spicy", "creamy", "blend"], arabicHint: "إذا كنت لا تستطيع النوم، يجب أن تطلب قهوة منزوعة الكافيين.", arabicParts: ["إذا كنت لا تستطيع النوم، يجب أن تطلب قهوة", "."], arabicAnswer: "منزوعة الكافيين", arabicWrongs: ["حارة", "دسمة", "خليط"] },
      { parts: ["Put the hot chocolate in a", "cup because I am in a hurry."], hint: "شۆکۆلاتە گەرمەکە بخەرە پەرداخی سەفەری چونکە پەلەمە.", answer: "to-go", wrongs: ["mug", "blend", "organic"], arabicHint: "ضع الشوكولاتة الساخنة في كوب سفري لأنني في عجلة من أمري.", arabicParts: ["ضع الشوكولاتة الساخنة في كوب", "لأنني في عجلة من أمري."], arabicAnswer: "سفري", arabicWrongs: ["سيراميك", "خليط", "عضوي"] },
    ],
    conversations: [
      {
        situation: "داواکردنی قاوە لە کافتریا",
        theyAsk: "What can I get started for you today?",
        correct: "Can I have a large latte in a to-go cup, please?",
        wrong1: "Bake a cake please.",
        wrong2: "The tomatoes are ripe.",
        wrong3: "I fried the onions yesterday.",
        explanation: "پەرداخی سەفەری (to-go cup) زۆر باو بەکاردێت لە کافتریاکاندا.",
        situationAr: "طلب القهوة في المقهى",
        theyAskAr: "ما الذي يمكنني أن أبدأ بتقديمه لك اليوم؟",
        correctAr: "هل يمكنني الحصول على لاتيه كبير في كوب سفري، من فضلك؟",
        wrong1Ar: "اخبز كعكة من فضلك.",
        wrong2Ar: "الطماطم ناضجة.",
        wrong3Ar: "لقد قلیت البصل بالأمس.",
        explanationAr: "الكوب السفري (to-go cup) شائع جداً استخدامه في المقاهي."
      },
      {
        situation: "کاتێک هاوڕێیەک قاوەت بۆ دەکڕێت",
        theyAsk: "Do you want some sugar or milk in your espresso?",
        correct: "Just a little milk, and make it a decaf option if possible.",
        wrong1: "Avoid processed sugar immediately.",
        wrong2: "Cheers to our health!",
        wrong3: "I want to set the table.",
        explanation: "دەتوانیت بژاردەی بێ کافاین (decaf option) و کەمێک شیر هەڵبژێریت.",
        situationAr: "عندما يشتري لك صديق قهوة",
        theyAskAr: "هل تريد بعض السكر أو الحليب في قهوتك الإسبريسو؟",
        correctAr: "قليلاً من الحليب فقط، واجعلها خالية من الكافيين إن أمكن.",
        wrong1Ar: "تجنب السكر المصنع فوراً.",
        wrong2Ar: "بصحتنا جميعاً!",
        wrong3Ar: "أريد ترتيب الطاولة.",
        explanationAr: "يمكنك دائماً طلب خيار خالٍ من الكافيين (decaf option) مع القليل من الحليب."
      }
    ]
  },

  // Lesson 9: A Great Day (Storytelling)
  {
    topic: "A Great Day", topicKu: "ڕۆژێکی نایاب (چیرۆک)", topicAr: "يوم رائع (سرد)",
    words: [
      { english: "Morning walk", kurdish: "پیاسەی بەیانیان", arabic: "مشوار الصباح" },
      { english: "Met my friends", kurdish: "هاوڕێکانم بینی", arabic: "قابلت أصدقائي" },
      { english: "Laughed a lot", kurdish: "زۆرمان پێدەکەنی (پێکەنین)", arabic: "ضحكنا كثيراً" },
      { english: "Went back home", kurdish: "گەڕامەوە بۆ ماڵەوە", arabic: "عدت إلى المنزل" },
      { english: "Perfect sunny weather", kurdish: "کەشوهەوای خۆرەتاوی بێخەوش", arabic: "طقس مشمس مثالي" },
      { english: "Had a great conversation", kurdish: "گفتوگۆیەکی نایابمان هەبوو", arabic: "حظينا بمحادثة رائعة" },
      { english: "Shared some stories", kurdish: "هەندێک چیرۆکمان گێڕایەوە", arabic: "شاركنا بعض القصص" },
      { english: "Time flew by", kurdish: "کات خێرا ڕۆیشت", arabic: "الوقت مر بسرعة (طار الوقت)" },
    ],
    voices: [
      { prompt: "بڵێ دوێنێ کەشوهەوا خۆش بوو و هاوڕێکانت بینی", target: "Yesterday, the weather was perfect and I met my friends.", targetKurdish: "دوێنێ کەشوهەوا بێخەوش بوو و هاوڕێکانم بینی.", promptAr: "قل أن الطقس كان مثالياً وقابلت أصدقاءك أمس", targetArabic: "أمس، كان الطقس مثالياً وقابلت أصدقائي." },
      { prompt: "بڵێ لەگەڵ هاوڕێکانت پێکەنیویت", target: "We sat in the cafe and laughed a lot.", targetKurdish: "لە کافتریایەکە دانیشتین و زۆرمان پێدەکەنی.", promptAr: "قل أنكم ضحكتم كثيراً في المقهى", targetArabic: "جلسنا في المقهى وضحكنا كثيراً." },
      { prompt: "بڵێ کات زۆر خێرا ڕۆیشت", target: "We had so much fun that time flew by.", targetKurdish: "ئەوەندە کاتمان خۆش بوو کە کات زۆر خێرا ڕۆیشت.", promptAr: "قل أن الوقت مر بسرعة كبيرة", targetArabic: "استمتعنا كثيراً لدرجة أن الوقت طار بسرعة." },
    ],
    sentences: [
      { english: ["After", "the", "morning", "walk", "I", "went", "back", "home"], kurdish: "دوای پیاسەی بەیانیان، گەڕامەوە بۆ ماڵەوە", arabic: "بعد مشوار الصباح عدت إلى المنزل" },
      { english: ["We", "shared", "some", "stories", "about", "our", "school", "days"], kurdish: "هەندێک چیرۆکی ڕۆژانی قوتابخانەمان گێڕایەوە", arabic: "شاركنا بعض القصص عن أيام المدرسة" },
      { english: ["It", "was", "a", "perfect", "sunny", "day", "for", "a", "picnic"], kurdish: "ڕۆژێکی خۆرەتاوی بێخەوش بوو بۆ سەیران", arabic: "كان يوماً مشمساً مثالياً للنزهة" },
      { english: ["We", "had", "a", "great", "conversation", "about", "healthy", "diet"], kurdish: "گفتوگۆیەکی نایابمان هەبوو دەربارەی سیستەمی خۆراکی تەندروست", arabic: "حظينا بمحادثة رائعة عن الحمية الصحية" },
    ],
    fillBlanks: [
      { parts: ["We talked for hours and", "a lot together."], hint: "بۆ چەندین کاتژمێر قسەمان کرد و زۆر پێکەوە پێکەنین.", answer: "laughed", wrongs: ["met", "walked", "baked"], arabicHint: "تحدثنا لساعات وضحكنا كثيراً معاً.", arabicParts: ["تحدثنا لساعات و", "كثيراً معاً."], arabicAnswer: "ضحكنا", arabicWrongs: ["قابلنا", "مشينا", "خبزنا"] },
      { parts: ["I", "my old classmate at the coffee shop yesterday."], hint: "دوێنێ لە کافتریایەکە هاوپۆلی پێشووم بینی (چاوم پێ کەوت).", answer: "met", wrongs: ["laughed", "went", "boiled"], arabicHint: "قابلت زميل دراستي القديم في المقهى أمس.", arabicParts: ["", "زميل دراستي القديم في المقهى أمس."], arabicAnswer: "قابلت", arabicWrongs: ["ضحكت", "ذهبت", "غليت"] },
      { parts: ["We enjoyed the day so much that", "flew by."], hint: "ئەوەندە چێژمان لە ڕۆژەکە بینی کە کات زۆر خێرا ڕۆیشت.", answer: "time", wrongs: ["weather", "conversation", "walk"], arabicHint: "استمتعنا باليوم كثيراً لدرجة أن الوقت طار.", arabicParts: ["استمتعنا باليوم كثيراً لدرجة أن", "طار."], arabicAnswer: "الوقت", arabicWrongs: ["الطقس", "المحادثة", "المشوار"] },
    ],
    conversations: [
      {
        situation: "گێڕانەوەی ڕۆژەکەت بۆ هاوژینت یان هاوڕێیەک",
        theyAsk: "How was your day off yesterday?",
        correct: "It was amazing! The weather was perfect, I met my friends, and we laughed a lot.",
        wrong1: "I set the table and preheated the oven.",
        wrong2: "Do you have any decaf options?",
        wrong3: "I should follow the recipe.",
        explanation: "ئەمە گێڕانەوەیەکی زۆر جوان و ئەرێنییە بۆ ڕۆژێکی خۆش لەگەڵ هاوڕێیان.",
        situationAr: "سرد تفاصيل يومك لصديق",
        theyAskAr: "كيف كان يوم عطلتك أمس؟",
        correctAr: "كان رائعاً! الطقس كان مثالياً، قابلت أصدقائي وضحكنا كثيراً.",
        wrong1Ar: "رتبت الطاولة وسخنت الفرن.",
        wrong2Ar: "هل لديكم أي خيارات خالية من الكافيين؟",
        wrong3Ar: "يجب أن أتبع الوصفة.",
        explanationAr: "هذا سرد ممتاز وإيجابي ليوم رائع قضيته مع الأصدقاء."
      },
      {
        situation: "کاتێک هاوڕێیەک دەڵێت بۆچی زوو ڕۆیشتیت",
        theyAsk: "Why did you leave the cafe early?",
        correct: "We had a great conversation but time flew by, and I had to go back home.",
        wrong1: "Because it was too salty.",
        wrong2: "Please chop the garlic.",
        wrong3: "The strawberries were local.",
        explanation: "ڕوونکردنەوەی ئەوەی کە کات خێرا ڕۆیشتووە (time flew by) هۆکارێکی گونجاوە بۆ ڕۆیشتن.",
        situationAr: "عندما يسألك صديق لماذا غادرت باكراً",
        theyAskAr: "لماذا غادرت المقهى مبكراً؟",
        correctAr: "حظينا بمحادثة رائعة ولكن الوقت طار بسرعة، وكان عليّ العودة للمنزل.",
        wrong1Ar: "لأن الطعام كان مالحاً جداً.",
        wrong2Ar: "من فضلك قطع الثوم.",
        wrong3Ar: "الفراولة كانت محلية.",
        explanationAr: "شرح أن الوقت مر بسرعة (time flew by) مبرر طبيعي ولطيف للمغادرة."
      }
    ]
  }
];

export default normalUnit06;
