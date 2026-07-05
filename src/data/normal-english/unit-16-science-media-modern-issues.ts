import { UnitBank } from "../types";

// ── Unit 14: Science, Media, & Modern Issues — 10 lessons ──────────────────────────
// Practical B2-C1 vocabulary and sentence structures for science, environment, news media, social networks, technology, and global issues.

const normalUnit14: UnitBank = [
  // Lesson 0: Scientific Discovery
  {
    topic: "Scientific Discovery", topicKu: "دۆزینەوەی زانستی", topicAr: "الاكتشاف العلمي",
    words: [
      { english: "Conduct research", kurdish: "ئەنجامدانی توێژینەوە", arabic: "إجراء البحوث" },
      { english: "Scientific theory", kurdish: "تیۆری زانستی", arabic: "نظرية علمية" },
      { english: "Perform an experiment", kurdish: "ئەنجامدانی تاقیکردنەوەیەک", arabic: "إجراء تجربة" },
      { english: "Discover a solution", kurdish: "دۆزینەوەی چارەسەرێک", arabic: "اكتشاف حل" },
      { english: "Prove the hypothesis", kurdish: "سەلماندنی گریمانەکە", arabic: "إثبات الفرضية" },
      { english: "Analyze the data", kurdish: "شیکردنەوەی زانیارییەکان (داتا)", arabic: "تحليل البيانات" },
      { english: "Laboratory equipment", kurdish: "کەرەستەی تاقیگە", arabic: "معدات المختبر" },
      { english: "Breakthrough", kurdish: "پێشکەوتنێکی گەورە (دەستکەوتی زانستی)", arabic: "طفرة علمية (إنجاز)" },
    ],
    voices: [
      { prompt: "بڵێ زاناکان توێژینەوە دەکەن", target: "Scientists conduct research to prove their theories.", targetKurdish: "زاناکان توێژینەوە ئەنجام دەدەن بۆ سەلماندنی تیۆرییەکانیان.", promptAr: "قل العلماء يجرون البحوث لإثبات نظرياتهم", targetArabic: "العلماء يجرون البحوث لإثبات نظرياتهم." },
      { prompt: "بڵێ دەبێت داتاکان شی بکەینەوە", target: "We must analyze the data from the experiment carefully.", targetKurdish: "پێویستە زانیارییەکانی تاقیکردنەوەکە بە وریاییەوە شی بکەینەوە.", promptAr: "قل يجب تحليل بيانات التجربة بحذر", targetArabic: "يجب علينا تحليل البيانات من التجربة بعناية." },
      { prompt: "بڵێ ئەمە پێشکەوتنێکی گەورەیە", target: "This discovery is a major breakthrough in medicine.", targetKurdish: "ئەم دۆزینەوەیە پێشکەوتنێکی گەورەیە لە بواری پزیشکیدا.", promptAr: "قل هذا الاكتشاف يمثل طفرة طبية", targetArabic: "هذا الاكتشاف يمثل طفرة كبيرة في مجال الطب." },
    ],
    sentences: [
      { english: ["They", "used", "new", "laboratory", "equipment", "for", "the", "study"], kurdish: "ئەوان کەرەستەی نوێی تاقیگەیان بۆ توێژینەوەکە بەکارھێنا", arabic: "استخدموا معدات مختبر جديدة للدراسة" },
      { english: ["We", "hope", "to", "discover", "a", "solution", "to", "this", "disease", "soon"], kurdish: "هیوادارین بەم زووانە چارەسەرێک بۆ ئەم نەخۆشییە بدۆزینەوە", arabic: "نأمل في اكتشاف حل لهذا المرض قريباً" },
      { english: ["His", "scientific", "theory", "was", "difficult", "to", "understand"], kurdish: "تیۆرییە زانستییەکەی ئەو سەخت بوو بۆ تێگەیشتن", arabic: "نظريته العلمية كانت صعبة الفهم" },
      { english: ["How", "did", "you", "prove", "the", "hypothesis", "without", "data"], kurdish: "چۆن بەبێ داتا گریمانەکەت سەلماند؟", arabic: "كيف أثبت الفرضية بدون بيانات؟" },
    ],
    fillBlanks: [
      { parts: ["Before we write the report, we must", "the data."], hint: "پێش ئەوەی ڕاپۆرتەکە بنووسین، پێویستە داتاکان شی بکەینەوە.", answer: "analyze", wrongs: ["conduct", "prove", "discover"], arabicHint: "قبل كتابة التقرير، يجب علينا تحليل البيانات.", arabicParts: ["قبل كتابة التقرير، يجب علينا", "البيانات."], arabicAnswer: "تحليل", arabicWrongs: ["إجراء", "إثبات", "اكتشاف"] },
      { parts: ["The research team will", "an experiment tomorrow."], hint: "تیمی توێژینەوەکە بەیانی تاقیکردنەوەیەک ئەنجام دەدەن.", answer: "perform", wrongs: ["prove", "analyze", "discover"], arabicHint: "فريق البحث سيجري تجربة غداً.", arabicParts: ["فريق البحث سـ", "تجربة غداً."], arabicAnswer: "يجري", arabicWrongs: ["يثبت", "يحلل", "يكتشف"] },
      { parts: ["Finding a cure for cancer would be a historic", "."], hint: "دۆزینەوەی چارەسەر بۆ شێرپەنجە دەبێتە دەستکەوتێکی (پێشکەوتنێکی) مێژوویی.", answer: "breakthrough", wrongs: ["equipment", "hypothesis", "theory"], arabicHint: "العثور على علاج للسرطان سيكون إنجازاً تاريخياً.", arabicParts: ["العثور على علاج للسرطان سيكون", "تاريخياً."], arabicAnswer: "إنجازاً", arabicWrongs: ["معدات", "فرضية", "نظرية"] },
    ],
    conversations: [
      {
        situation: "گفتوگۆ لەگەڵ پرۆفیسۆر دەربارەی تاقیکردنەوەکە",
        theyAsk: "Did your team prove the hypothesis during the research?",
        correct: "Yes, we analyzed the data and performed a final experiment in the laboratory.",
        wrong1: "No, we used processed sugar as laboratory equipment.",
        wrong2: "A balanced breakthrough is highly unlikely.",
        wrong3: "I want to preheat the laboratory oven.",
        explanation: "'Prove the hypothesis', 'analyze data' و 'laboratory' دەستەواژەی گونجاون بۆ توێژینەوەی ئەکادیمی.",
        situationAr: "نقاش مع بروفيسور حول التجربة",
        theyAskAr: "هل أثبت فريقكم الفرضية أثناء البحث؟",
        correctAr: "نعم، قمنا بتحليل البيانات وأجرينا تجربة نهائية في المختبر.",
        wrong1Ar: "لا، استخدمنا السكر المصنع كمعدات مختبر.",
        wrong2Ar: "إنجاز متوازن غير مرجح للغاية.",
        wrong3Ar: "أريد تسخين فرن المختبر مسبقاً.",
        explanationAr: "استخدام كلمات إثبات الفرضية، تحليل البيانات والمختبر هو الأنسب للنقاش الأكاديمي."
      },
      {
        situation: "پرسیار دەربارەی هەواڵی پزیشکی نوێ",
        theyAsk: "Have you heard about the new medicine?",
        correct: "Yes, it is a major scientific breakthrough that could cure many patients.",
        wrong1: "No, we must avoid processed research.",
        wrong2: "This leads to a simple laboratory equipment.",
        wrong3: "I prefer to compile theories rather than eat watermelon.",
        explanation: "وەڵامی 'breakthrough' (دەستکەوتی زانستی/پێشکەوتنی گەورە) وەسفی زۆر باشی کەرتی پزیشکییە.",
        situationAr: "السؤال عن خبر طبي جديد",
        theyAskAr: "هل سمعت عن الدواء الجديد؟",
        correctAr: "نعم، إنه إنجاز علمي كبير يمكن أن يعالج الكثير من المرضى.",
        wrong1Ar: "لا، يجب أن نتجنب البحوث المصنعة.",
        wrong2Ar: "هذا يؤدي إلى معدات مختبر بسيطة.",
        wrong3Ar: "أفضل صياغة النظريات على أكل الرقي.",
        explanationAr: "كلمة 'breakthrough' (طفرة/إنجاز) هي الوصف الأمثل للاكتشافات الطبية الهامة."
      }
    ]
  },

  // Lesson 1: Environmental Awareness
  {
    topic: "Environmental Awareness", topicKu: "هۆشیاری ژینگەیی", topicAr: "الوعي البيئي",
    words: [
      { english: "Protect the planet", kurdish: "پاراستنی هەسارەکە", arabic: "حماية الكوكب" },
      { english: "Reduce pollution", kurdish: "کەمکردنەوەی پیسبوونی ژینگە", arabic: "تقليل التلوث" },
      { english: "Recycle waste", kurdish: "دووبارە بەکارهێنانەوەی پاشماوەکان", arabic: "إعادة تدوير النفايات" },
      { english: "Sustainable energy", kurdish: "وزەی بەردەوام (ژینگە دۆست)", arabic: "طاقة مستدامة" },
      { english: "Climate change", kurdish: "گۆڕانی کەشوهەوا (کلیمەت چەینج)", arabic: "تغير المناخ" },
      { english: "Carbon footprint", kurdish: "پێگەی کاربۆنی (ڕێژەی زیان بە ژینگە)", arabic: "البصمة الكربونية" },
      { english: "Renewable resources", kurdish: "سەرچاوە نوێبووەوەکان", arabic: "مصادر متجددة" },
      { english: "Eco-friendly products", kurdish: "بەرهەمە ژینگەدۆستەکان", arabic: "منتجات صديقة للبيئة" },
    ],
    voices: [
      { prompt: "بڵێ دەبێت ژینگە بپارێزین", target: "We must protect the planet for future generations.", targetKurdish: "پێویستە هەسارەکەمان بۆ نەوەکانی داهاتوو بپارێزین.", promptAr: "قل يجب حماية الكوكب لأجيالنا القادمة", targetArabic: "يجب علينا حماية الكوكب لأجيالنا القادمة." },
      { prompt: "پێشنیازی بەکارهێنانەوەی پاشماوە بکە", target: "Everyone should recycle waste to reduce pollution.", targetKurdish: "پێویستە هەمووان پاشماوەکان دووبارە بەکاربهێننەوە بۆ کەمکردنەوەی پیسبوونی ژینگە.", promptAr: "انصح بإعادة تدوير النفايات", targetArabic: "ينبغي على الجميع إعادة تدوير النفايات لتقليل التلوث." },
      { prompt: "باسی وزەی نوێبووەوە بکە", target: "Solar power is a great source of sustainable energy.", targetKurdish: "وزەی خۆر سەرچاوەیەکی زۆر باشی وزەی بەردەوامە.", promptAr: "تحدث عن الطاقة المتجددة", targetArabic: "الطاقة الشمسية مصدر رائع للطاقة المستدامة." },
    ],
    sentences: [
      { english: ["Climate", "change", "is", "a", "serious", "threat", "to", "our", "world"], kurdish: "گۆڕانی کەشوهەوا مەترسییەکی جدییە بۆ سەر جیهانەکەمان", arabic: "تغير المناخ تهديد خطير لعالمنا" },
      { english: ["Using", "eco-friendly", "products", "reduces", "your", "carbon", "footprint"], kurdish: "بەکارهێنانی بەرهەمە ژینگەدۆستەکان پێگەی کاربۆنیت کەم دەکاتەوە", arabic: "استخدام المنتجات الصديقة للبيئة يقلل من بصمتك الكربونية" },
      { english: ["We", "need", "to", "rely", "more", "on", "renewable", "resources"], kurdish: "پێویستە زیاتر پشت بە سەرچاوە نوێبووەوەکان ببەستین", arabic: "نحن بحاجة إلى الاعتماد أكثر على المصادر المتجددة" },
      { english: ["Small", "changes", "can", "help", "reduce", "pollution", "in", "cities"], kurdish: "گۆڕانکاری بچووک دەتوانێت یارمەتیدەر بێت لە کەمکردنەوەی پیسبوونی ژینگە لە شارەکاندا", arabic: "التغييرات الصغيرة يمكن أن تساعد في تقليل التلوث في المدن" },
    ],
    fillBlanks: [
      { parts: ["We must use", "energy to stop climate change."], hint: "پێویستە وزەی بەردەوام بەکاربهێنین بۆ ڕاگرتنی گۆڕانی کەشوهەوا.", answer: "sustainable", wrongs: ["salty", "processed", "skeptical"], arabicHint: "يجب أن نستخدم الطاقة المستدامة لوقف تغير المناخ.", arabicParts: ["يجب أن نستخدم الطاقة", "لوقف تغير المناخ."], arabicAnswer: "المستدامة", arabicWrongs: ["المالحة", "المصنعة", "المشككة"] },
      { parts: ["You can reduce your", "by walking instead of driving."], hint: "دەتوانیت پێگەی کاربۆنیت کەم بکەیتەوە بە پیاسەکردن لەبری لێخوڕینی ئۆتۆمبێل.", answer: "carbon footprint", wrongs: ["renewable resource", "climate change", "eco-friendly"], arabicHint: "يمكنك تقليل بصمتك الكربونية بالمشي بدلاً من القيادة.", arabicParts: ["يمكنك تقليل", "بالمشي بدلاً من القيادة."], arabicAnswer: "بصمتك الكربونية", arabicWrongs: ["مورد متجدد", "تغير المناخ", "صديق للبيئة"] },
      { parts: ["Plastic bottles are easy to", "."], hint: "بوتڵە پلاستیکییەکان ئاسانن بۆ دووبارە بەکارهێنانەوە.", answer: "recycle", wrongs: ["reduce", "protect", "prove"], arabicHint: "الزجاجات البلاستيكية سهلة التدوير.", arabicParts: ["الزجاجات البلاستيكية سهلة لـ", "."], arabicAnswer: "إعادة التدوير", arabicWrongs: ["التقليل", "الحماية", "الإثبات"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی شێوازی پاراستنی ژینگە",
        theyAsk: "What can we do at home to help the environment?",
        correct: "We should recycle waste, reduce energy use, and buy eco-friendly products.",
        wrong1: "We must preheat the planet to two hundred degrees.",
        wrong2: "Avoid healthy organic diet in order to reduce pollution.",
        wrong3: "I visited my carbon footprint yesterday afternoon.",
        explanation: "بەکارهێنانی 'recycle waste' و 'eco-friendly products' وەڵامێکی نایابە بۆ پرسیاری ژینگەیی.",
        situationAr: "السؤال عن كيفية حماية البيئة من المنزل",
        theyAskAr: "ماذا يمكننا أن نفعل في المنزل لمساعدة البيئة؟",
        correctAr: "ينبغي علينا إعادة تدوير النفايات، وتقليل استهلاك الطاقة، وشراء منتجات صديقة للبيئة.",
        wrong1Ar: "يجب علينا تسخين الكوكب مسبقاً إلى مئتي درجة.",
        wrong2Ar: "تجنب النظام الغذائي العضوي الصحي لتقليل التلوث.",
        wrong3Ar: "لقد زرت بصمتي الكربونية أمس بعد الظهر.",
        explanationAr: "إعادة التدوير (recycle) وشراء المنتجات البيئية (eco-friendly) هو الرد الأفضل للمساهمة في البيئة."
      },
      {
        situation: "شیکردنەوەی مەترسی گۆڕانی کەشوهەوا",
        theyAsk: "Why is everyone talking about renewable resources?",
        correct: "Because using renewable resources is essential to fight climate change and protect the planet.",
        wrong1: "Because it was too salty for the city.",
        wrong2: "To increase our processed sugar levels.",
        wrong3: "It is a sign of bitter laboratory equipment.",
        explanation: "سەرچاوە نوێبووەوەکان (renewable resources) هۆکاری سەرەکین بۆ بەرەنگاربوونی گۆڕانی کەشوهەوا.",
        situationAr: "نقاش حول أهمية الطاقة المتجددة",
        theyAskAr: "لماذا يتحدث الجميع عن المصادر المتجددة؟",
        correctAr: "لأن استخدام المصادر المتجددة ضروري لمكافحة تغير المناخ وحماية الكوكب.",
        wrong1Ar: "لأنها كانت مالحة جداً بالنسبة للمدينة.",
        wrong2Ar: "لزيادة مستويات السكر المصنع لدينا.",
        wrong3Ar: "إنها علامة على معدات مختبر مرة.",
        explanationAr: "المصادر المتجددة (renewable resources) هي المفتاح لمكافحة تغير المناخ وحفظ الكوكب."
      }
    ]
  },

  // Lesson 2: Reading the News
  {
    topic: "Reading the News", topicKu: "خوێندنەوەی هەواڵەکان", topicAr: "قراءة الأخبار",
    words: [
      { english: "Read the headlines", kurdish: "خوێندنەوەی سەردێڕی هەواڵەکان", arabic: "قراءة العناوين الرئيسية" },
      { english: "Reliable source", kurdish: "سەرچاوەی باوەڕپێکراو", arabic: "مصدر موثوق" },
      { english: "Journalism standards", kurdish: "پێوەرەکانی ڕۆژنامەنووسی", arabic: "معايير الصحافة" },
      { english: "Media bias", kurdish: "لایەنگری میدیایی (بایەس)", arabic: "الانحياز الإعلامي" },
      { english: "Fake news and rumors", kurdish: "هەواڵی درۆ و دەنگۆکان", arabic: "الأخبار الكاذبة والشائعات" },
      { english: "Investigate the article", kurdish: "کۆڵینەوە لە وتارەکە", arabic: "التحقيق في المقال" },
      { english: "Publish a report", kurdish: "بڵاوکردنەوەی ڕاپۆرتێک", arabic: "نشر تقرير" },
      { english: "Public opinion", kurdish: "ڕای گشتی", arabic: "الرأي العام" },
    ],
    voices: [
      { prompt: "بڵێ دەبێت سەرچاوەی باوەڕپێکراو بەکاربهێنین", target: "We must get our news from a reliable source.", targetKurdish: "پێویستە هەواڵەکانمان لە سەرچاوەیەکی باوەڕپێکراوەوە وەربگرین.", promptAr: "قل يجب الحصول على الأخبار من مصدر موثوق", targetArabic: "يجب أن نحصل على أخبارنا من مصدر موثوق." },
      { prompt: "ئاماژە بە لایەنگری میدیایی بکە", target: "Many articles show clear media bias.", targetKurdish: "زۆرێک لە وتارەکان لایەنگرییەکی ڕوونی میدیایی نیشان دەدەن.", promptAr: "أشر إلى الانحياز الإعلامي", targetArabic: "كثير من المقالات تظهر انحيازاً إعلامياً واضحاً." },
      { prompt: "بڵێ هەواڵی درۆ زۆر بڵاوە", target: "Fake news spreads quickly on social media.", targetKurdish: "هەواڵی درۆ بە خێرایی لە تۆڕە کۆمەڵایەتییەکاندا بڵاو دەبێتەوە.", promptAr: "قل الأخبار الكاذبة تنتشر بسرعة", targetArabic: "الأخبار الكاذبة تنتشر بسرعة على وسائل التواصل الاجتماعي." },
    ],
    sentences: [
      { english: ["I", "always", "read", "the", "headlines", "before", "I", "buy", "the", "newspaper"], kurdish: "من هەمیشە پێش کڕینی ڕۆژنامەکە سەردێڕەکان دەخوێنمەوە", arabic: "أنا دائماً أقرأ العناوين الرئيسية قبل شراء الصحيفة" },
      { english: ["The", "journalist", "refused", "to", "publish", "unconfirmed", "rumors"], kurdish: "ڕۆژنامەنووسەکە ڕەتی کردەوە دەنگۆی پشتڕاستنەکراو بڵاو بکاتەوە", arabic: "رفض الصحفي نشر شائعات غير مؤكدة" },
      { english: ["It", "is", "our", "duty", "to", "investigate", "the", "facts", "of", "this", "report"], kurdish: "ئەرکی ئێمەیە کە کۆڵینەوە لە ڕاستییەکانی ئەم ڕاپۆرتە بکەین", arabic: "من واجبنا التحقيق في حقائق هذا التقرير" },
      { english: ["Media", "bias", "can", "easily", "influence", "public", "opinion"], kurdish: "لایەنگری میدیایی دەتوانێت بە ئاسانی کاریگەری لەسەر ڕای گشتی دروست بکات", arabic: "الانحياز الإعلامي يمكن أن يؤثر بسهولة على الرأي العام" },
    ],
    fillBlanks: [
      { parts: ["Always check the facts; do not trust", "on the internet."], hint: "هەمیشە ڕاستییەکان بپشکنە؛ متمانە بە هەواڵی درۆ مەکە لەسەر ئینتەرنێت.", answer: "fake news", wrongs: ["headlines", "reliable sources", "opinion"], arabicHint: "تحقق دائماً من الحقائق؛ لا تثق بالأخبار الكاذبة على الإنترنت.", arabicParts: ["تحقق دائماً من الحقائق؛ لا تثق بـ", "على الإنترنت."], arabicAnswer: "الأخبار الكاذبة", arabicWrongs: ["العناوين", "المصادر الموثوقة", "الرأي"] },
      { parts: ["Make sure the news comes from a", "source before sharing."], hint: "دڵنیابەوە کە هەواڵەکە لە سەرچاوەیەکی باوەڕپێکراوەوە دێت پێش هاوبەشکردنی.", answer: "reliable", wrongs: ["bias", "fake", "tentative"], arabicHint: "تأكد من أن الخبر يأتي من مصدر موثوق قبل مشاركته.", arabicParts: ["تأكد من أن الخبر يأتي من مصدر", "قبل مشاركته."], arabicAnswer: "موثوق", arabicWrongs: ["منحاز", "كاذب", "مؤقت"] },
      { parts: ["The newspaper decided to", "the investigation report."], hint: "ڕۆژنامەکە بڕیاریدا ڕاپۆرتی کۆڵینەوەکە بڵاو بکاتەوە.", answer: "publish", wrongs: ["read", "investigate", "prove"], arabicHint: "قررت الصحيفة نشر تقرير التحقيق.", arabicParts: ["قررت الصحيفة", "تقرير التحقيق."], arabicAnswer: "نشر", arabicWrongs: ["قراءة", "التحقيق في", "إثبات"] },
    ],
    conversations: [
      {
        situation: "گفتوگۆ لەسەر هەواڵێکی فەیسبووک",
        theyAsk: "Did you read the shocking article about the economy?",
        correct: "Yes, but I am skeptical because that website is not a reliable source.",
        wrong1: "No, I only read the local strawberries.",
        wrong2: "I want to publish a fake recipe for dinner.",
        wrong3: "The journalist was too salty for my taste.",
        explanation: "کاتێک هاوڕێیەک وتارێکی گوماناوی باس دەکات، وەڵامی 'not a reliable source' دروستترینە.",
        situationAr: "نقاش حول خبر صادم في فيسبوك",
        theyAskAr: "هل قرأت المقال الصادم عن الاقتصاد؟",
        correctAr: "نعم، لكني متشكك لأن هذا الموقع ليس مصدراً موثوقاً.",
        wrong1Ar: "لا، أنا أقرأ فقط الفراولة المحلية.",
        wrong2Ar: "أريد نشر وصفة طعام كاذبة للعشاء.",
        wrong3Ar: "الصحفي كان مالحاً جداً بالنسبة لذوقي.",
        explanationAr: "عندما يذكر صديق مقالاً مشكوكاً فيه، فإن الرد بـ 'not a reliable source' هو الأنسب."
      },
      {
        situation: "ڕوونکردنەوەی مەترسی لایەنگری میدیایی",
        theyAsk: "Why does this channel report differently from others?",
        correct: "Because of media bias. They publish reports designed to influence public opinion.",
        wrong1: "Owing to processed sugar on the headlines.",
        wrong2: "In order to set the table, yes.",
        wrong3: "Unlike the previous version, they have a decaf option.",
        explanation: "لایەنگری میدیایی (media bias) ڕوونی دەکاتەوە بۆچی کەناڵەکان جیاواز هەواڵ دەگوازنەوە.",
        situationAr: "توضيح اختلاف تغطية القنوات الإخبارية",
        theyAskAr: "لماذا تنقل هذه القناة الأخبار بشكل مختلف عن غيرها؟",
        correctAr: "بسبب الانحياز الإعلامي. هم ينشرون تقارير مصممة للتأثير على الرأي العام.",
        wrong1Ar: "بسبب السكر المصنع في العناوين الرئيسية.",
        wrong2Ar: "من أجل ترتيب الطاولة، نعم.",
        wrong3Ar: "على عكس النسخة السابقة، لديهم خيار خالي من الكافيين.",
        explanationAr: "الانحياز الإعلامي (media bias) يفسر اختلاف التغطية الإخبارية بهدف التأثير على الرأي العام."
      }
    ]
  },

  // Lesson 3: Social Media Impact
  {
    topic: "Social Media", topicKu: "تۆڕە کۆمەڵایەتییەکان", topicAr: "وسائل التواصل الاجتماعي",
    words: [
      { english: "Online influence", kurdish: "کاریگەری ئۆنلاین", arabic: "التأثير عبر الإنترنت" },
      { english: "Understand the algorithm", kurdish: "تێگەیشتن لە ئەلگۆریتمەکە", arabic: "فهم الخوارزمية" },
      { english: "Follow and share", kurdish: "فۆڵۆ و هاوبەشکردن (شەیر)", arabic: "المتابعة والمشاركة" },
      { english: "Go viral", kurdish: "بڵاوبوونەوەی خێرا (ڤایرۆس ئاسا)", arabic: "ينتشر بسرعة كبيرة (يصبح تريند)" },
      { english: "Protect your privacy", kurdish: "پاراستنی تایبەتمەندێتی خۆت", arabic: "حماية خصوصيتك" },
      { english: "Digital footprint", kurdish: "شوێنپێی دیجیتاڵی", arabic: "البصمة الرقمية" },
      { english: "Screen time limits", kurdish: "مۆڵەتی کاتی بەکارهێنانی شاشە", arabic: "حدود وقت الشاشة" },
      { english: "Cyberbullying concerns", kurdish: "نیگەرانییەکانی چەوسانەوەی ئەلیکترۆنی", arabic: "مخاوف التنمر الإلكتروني" },
    ],
    voices: [
      { prompt: "بڵێ دەبێت زانیاری کەسی بپارێزیت", target: "You must protect your privacy by using strong passwords.", targetKurdish: "پێویستە تایبەتمەندێتی خۆت بپارێزیت بە بەکارهێنانی پاسوۆردی بەهێز.", promptAr: "قل يجب حماية خصوصيتك بكلمات مرور قوية", targetArabic: "يجب عليك حماية خصوصيتك باستخدام كلمات مرور قوية." },
      { prompt: "بڵێ ڤیدیۆکە زۆر بڵاو بووەوە", target: "Her funny video went viral in just one day.", targetKurdish: "ڤیدیۆ کۆمیدییەکەی ئەو تەنها لە یەک ڕۆژدا زۆر بڵاو بووەوە.", promptAr: "قل الفيديو انتشر كالنار في الهشيم", targetArabic: "انتشر مقطع الفيديو المضحك الخاص بها بشكل كبير في يوم واحد فقط." },
      { prompt: "ئامۆژگاری کەمکردنەوەی بەکارهێنانی مۆبایل بکە", target: "We should set screen time limits for our kids.", targetKurdish: "پێویستە مۆڵەتی بەکارهێنانی کاتی شاشە بۆ منداڵەکانمان دیار بکەین.", promptAr: "انصح بتحديد وقت استخدام الشاشة", targetArabic: "ينبغي علينا تحديد أوقات استخدام الشاشة لأطفالنا." },
    ],
    sentences: [
      { english: ["Everything", "you", "post", "becomes", "part", "of", "your", "digital", "footprint"], kurdish: "هەموو شتێک کە بڵاوی دەکەیتەوە دەبێتە بەشێک لە شوێنپێی دیجیتاڵیت", arabic: "كل شيء تنشره يصبح جزءاً من بصمتك الرقمية" },
      { english: ["The", "algorithm", "shows", "content", "based", "on", "your", "past", "clicks"], kurdish: "ئەلگۆریتمەکە بەپێی کلیکەکانی پێشووت ناوەڕۆک نیشان دەدات", arabic: "الخوارزمية تعرض المحتوى بناءً على نقراتك السابقة" },
      { english: ["She", "has", "a", "lot", "of", "online", "influence", "on", "young", "people"], kurdish: "ئەو کاریگەرییەکی زۆری ئۆنلاینی هەیە لەسەر گەنجان", arabic: "لديها الكثير من التأثير عبر الإنترنت على الشباب" },
      { english: ["Remember", "to", "follow", "and", "share", "if", "you", "enjoyed", "this"], kurdish: "لەبیرت بێت فۆڵۆ و شەیر بکەیت ئەگەر چێژت لێ بینی", arabic: "تذكر المتابعة والمشاركة إذا استمتعت بهذا" },
    ],
    fillBlanks: [
      { parts: ["Be careful what you post; your", "lasts forever."], hint: "وریابە چی بڵاودەکەیتەوە؛ شوێنپێی دیجیتاڵیت بۆ هەمیشە دەمێنێتەوە.", answer: "digital footprint", wrongs: ["screen time", "online influence", "privacy"], arabicHint: "كن حذراً فيما تنشره؛ فبصمتك الرقمية تدوم للأبد.", arabicParts: ["كن حذراً فيما تنشره؛ فـ", "تدوم للأبد."], arabicAnswer: "بصمتك الرقمية", arabicWrongs: ["وقت الشاشة", "التأثير عبر الإنترنت", "الخصوصية"] },
      { parts: ["We must protect our personal data to keep our", "safe."], hint: "پێویستە زانیارییە کەسییەکانمان بپارێزین بۆ هێشتنەوەی تایبەتمەندێتیمان بە سەلامەتی.", answer: "privacy", wrongs: ["algorithm", "footprint", "rumors"], arabicHint: "يجب علينا حماية بياناتنا الشخصية للحفاظ على خصوصيتنا آمنة.", arabicParts: ["يجب حماية بياناتنا الشخصية للحفاظ على", "آمنة."], arabicAnswer: "خصوصيتنا", arabicWrongs: ["الخوارزمية", "البصمة", "الشائعات"] },
      { parts: ["Her post on environment is starting to", "."], hint: "پۆستەکەی ئەو لەسەر ژینگە خەریکە زۆر بڵاودەبێتەوە (ڤایرۆس ئاسا).", answer: "go viral", wrongs: ["follow and share", "protect", "analyze"], arabicHint: "منشورها عن البيئة بدأ ينتشر بشكل كبير.", arabicParts: ["منشورها عن البيئة بدأ يـ", "."], arabicAnswer: "ينتشر كتريند", arabicWrongs: ["يتابع ويشارك", "يحمي", "يحلل"] },
    ],
    conversations: [
      {
        situation: "نیگەرانی دایکێک دەربارەی منداڵەکەی لەسەر مۆبایل",
        theyAsk: "My son spends six hours a day on social media. I am worried.",
        correct: "You should set screen time limits to protect his mental health.",
        wrong1: "Help him to go viral immediately.",
        wrong2: "Make sure his digital footprint is salty.",
        wrong3: "Follow and share the table manners.",
        explanation: "دیاریکردنی کاتی بەکارهێنانی شاشە (screen time limits) باشترین پێشنیازە بۆ چارەسەری بەکارهێنانی زۆری مۆبایل.",
        situationAr: "قلق أم على ابنها بسبب استخدام الهاتف",
        theyAskAr: "ابني يقضي ست ساعات يومياً على وسائل التواصل. أنا قلقة.",
        correctAr: "يجب عليك تحديد وقت استخدام الشاشة لحماية صحته العقلية.",
        wrong1Ar: "ساعديه ليصبح تريند فوراً.",
        wrong2Ar: "تأكدي من أن بصمته الرقمية مالحة.",
        wrong3Ar: "تابعي وشاركي آداب المائدة.",
        explanationAr: "تحديد وقت الشاشة (screen time limits) هو النصيحة الأفضل لتقنين استخدام الهواتف للأطفال."
      },
      {
        situation: "ڕوونکردنەوەی چۆنێتی کارکردنی ئینستاگرام",
        theyAsk: "Why do I see so many ads for shoes online?",
        correct: "Because you clicked on a shoe store yesterday. That is how the algorithm works.",
        wrong1: "To protect your privacy, yes.",
        wrong2: "Because of cyberbullying concerns.",
        wrong3: "Unlike the previous version of organic bananas.",
        explanation: "ئەلگۆریتمەکان (algorithms) بەپێی کلیک و هەڵسوکەوتی پێشوو ڕیکلام نیشان دەدەن.",
        situationAr: "توضيح كيفية ظهور الإعلانات المخصصة",
        theyAskAr: "لماذا أرى الكثير من إعلانات الأحذية عبر الإنترنت؟",
        correctAr: "لأنك نقرت على متجر أحذية بالأمس. هذه هي طريقة عمل الخوارزمية.",
        wrong1Ar: "لحماية خصوصيتك، نعم.",
        wrong2Ar: "بسبب مخاوف التنمر الإلكتروني.",
        wrong3Ar: "على عكس النسخة السابقة من الموز العضوي.",
        explanationAr: "الخوارزميات (algorithms) تعرض الإعلانات بناءً على اهتمامات المستخدم السابقة."
      }
    ]
  },

  // Lesson 4: Technology & AI
  {
    topic: "Technology & AI", topicKu: "تەکنەلۆژیا و ژیری دەستکرد", topicAr: "التكنولوجيا والذكاء الاصطناعي",
    words: [
      { english: "Artificial intelligence trends", kurdish: "ئاڕاستەکانی ژیری دەستکرد (ئەی ئای)", arabic: "اتجاهات الذكاء الاصطناعي" },
      { english: "Smart device automation", kurdish: "ئۆتۆماتیکردنی ئامێرە زیرەکەکان", arabic: "أتمتة الأجهزة الذكية" },
      { english: "Software development", kurdish: "گەشەپێدانی نەرمەکاڵا (سۆفتوێر)", arabic: "تطوير البرمجيات" },
      { english: "Virtual reality gaming", kurdish: "یارییەکانی واقیعی گریمانەیی (ڤی ئاڕ)", arabic: "ألعاب الواقع الافتراضي" },
      { english: "Data privacy regulations", kurdish: "یاساکانی پاراستنی داتا", arabic: "لوائح خصوصية البيانات" },
      { english: "Cloud storage backup", kurdish: "یەدەگی کۆگای هەوری (کڵاود ستۆرج)", arabic: "نسخ احتياطي للتخزين السحابي" },
      { english: "User interface design", kurdish: "دیزاینی ڕووکاری بەکارهێنەر (یو ئای)", arabic: "تصميم واجهة المستخدم" },
      { english: "High-tech innovation", kurdish: "داهێنانی تەکنەلۆژیای بەرز", arabic: "ابتكار تكنولوجي متطور" },
    ],
    voices: [
      { prompt: "بڵێ ژیری دەستکرد کارەکان دەگۆڕێت", target: "Artificial intelligence is changing the future of software development.", targetKurdish: "ژیری دەستکرد داهاتووی گەشەپێدانی نەرمەکاڵا دەگۆڕێت.", promptAr: "قل الذكاء الاصطناعي يغير مستقبل البرمجيات", targetArabic: "الذكاء الاصطناعي يغير مستقبل تطوير البرمجيات." },
      { prompt: "باسی پاراستنی داتا بکە لە کۆمپانیاکاندا", target: "Companies must follow strict data privacy regulations.", targetKurdish: "پێویستە کۆمپانیاکان پەیڕەوی یاسای توندی پاراستنی داتا بکەن.", promptAr: "تحدث عن قوانين خصوصية البيانات", targetArabic: "يجب على الشركات اتباع لوائح صارمة لخصوصية البيانات." },
      { prompt: "پێشنیازی یەدەگکردنی وێنەکان بکە", target: "You should use cloud storage to backup your photos.", targetKurdish: "پێویستە کۆگای هەوری بەکاربهێنیت بۆ پاراستنی وێنەکانت بە یەدەگی.", promptAr: "انصح بالنسخ الاحتياطي السحابي", targetArabic: "يجب عليك استخدام التخزين السحابي لنسخ صورك احتياطياً." },
    ],
    sentences: [
      { english: ["Automation", "makes", "our", "daily", "tasks", "much", "easier", "to", "complete"], kurdish: "ئۆتۆماتیکردن کارە ڕۆژانەکانمان زۆر ئاسانتر دەکات بۆ تەواوکردن", arabic: "الأتمتة تجعل مهامنا اليومية أسهل بكثير في الإكمال" },
      { english: ["Virtual", "reality", "technology", "is", "improving", "very", "fast"], kurdish: "تەکنەلۆژیای واقیعی گریمانەیی زۆر خێرا گەشە دەکات", arabic: "تكنولوجيا الواقع الافتراضي تتحسن بسرعة كبيرة" },
      { english: ["The", "new", "user", "interface", "design", "is", "simple", "and", "clean"], kurdish: "دیزاینە نوێیەکەی ڕووکاری بەکارهێنەر سادە و پاکە", arabic: "تصميم واجهة المستخدم الجديد بسيط ونظيف" },
      { english: ["This", "company", "is", "famous", "for", "its", "high-tech", "innovations"], kurdish: "ئەم کۆمپانیا بەناوبانگە بە داهێنانە تەکنەلۆژییە بەرزەکانی", arabic: "هذه الشركة مشهورة بابتكاراتها التكنولوجية المتطورة" },
    ],
    fillBlanks: [
      { parts: ["We must update our", "design to attract more users."], hint: "پێویستە دیزاینی ڕووکاری بەکارهێنەرمان (یو ئای) نوێ بکەینەوە بۆ ڕاکێشانی بەکارهێنەری زیاتر.", answer: "user interface", wrongs: ["artificial intelligence", "cloud storage", "high-tech"], arabicHint: "يجب علينا تحديث تصميم واجهة المستخدم لجذب المزيد من المستخدمين.", arabicParts: ["يجب علينا تحديث تصميم", "لجذب المزيد من المستخدمين."], arabicAnswer: "واجهة المستخدم", arabicWrongs: ["الذكاء الاصطناعي", "التخزين السحابي", "التكنولوجيا المتطورة"] },
      { parts: ["Make sure you have a", "for your files in case of computer failure."], hint: "دڵنیابەوە کە یەدەگێکی کۆگای هەوریت هەیە بۆ فایلەکانت لە کاتی تێکچوونی کۆمپیوتەردا.", answer: "cloud storage backup", wrongs: ["virtual reality", "user interface", "data privacy"], arabicHint: "تأكد من أن لديك نسخة احتياطية سحابية لملفاتك في حال تعطل الكمبيوتر.", arabicParts: ["تأكد من أن لديك", "لملفاتك."], arabicAnswer: "نسخة احتياطية سحابية", arabicWrongs: ["واقع افتراضي", "واجهة مستخدم", "خصوصية بيانات"] },
      { parts: ["The system uses", "to automate smart devices."], hint: "سیستمەکە ژیری دەستکرد بەکاردەهێنێت بۆ ئۆتۆماتیکردنی ئامێرە زیرەکەکان.", answer: "artificial intelligence", wrongs: ["software development", "user interface", "screen time"], arabicHint: "النظام يستخدم الذكاء الاصطناعي لأتمتة الأجهزة الذكية.", arabicParts: ["النظام يستخدم", "لأتمتة الأجهزة الذكية."], arabicAnswer: "الذكاء الاصطناعي", arabicWrongs: ["تطوير البرمجيات", "واجهة المستخدم", "وقت الشاشة"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی دواین داهێنانی سۆفتوێر",
        theyAsk: "What is the key focus of your tech company this year?",
        correct: "We are focusing on software development and smart device automation using AI.",
        wrong1: "We only sell ripe laboratory equipment.",
        wrong2: "To preheat the virtual reality oven.",
        wrong3: "I have reservations about processed sugar in software.",
        explanation: "'Software development' و 'automation using AI' وەڵامێکی زۆر باش و تەکنەلۆژییە.",
        situationAr: "السؤال عن تركيز شركة التكنولوجيا هذا العام",
        theyAskAr: "ما هو التركيز الأساسي لشركتكم التكنولوجية هذا العام؟",
        correctAr: "نحن نركز على تطوير البرمجيات وأتمتة الأجهزة الذكية باستخدام الذكاء الاصطناعي.",
        wrong1Ar: "نحن نبيع فقط معدات مختبر ناضجة.",
        wrong2Ar: "لتسخين فرن الواقع الافتراضي مسبقاً.",
        wrong3Ar: "لدي تحفظات بشأن السكر المصنع في البرمجيات.",
        explanationAr: "تطوير البرمجيات وأتمتة الأجهزة الذكية باستخدام الذكاء الاصطناعي هو الرد الأمثل لشركات التقنية."
      },
      {
        situation: "نیگەرانی هاوپۆلێک دەربارەی دزەپێکردنی زانیاری کەسی",
        theyAsk: "I am worried about my photos on this application.",
        correct: "Don't worry, they follow strict data privacy regulations and encrypt your cloud storage backup.",
        wrong1: "They want to reduce pollution in the user interface.",
        wrong2: "Because of climate change in virtual reality.",
        wrong3: "Otherwise, you must follow the recipe of high-tech.",
        explanation: "پاراستنی زانیارییەکان بە یاساکانی پاراستنی داتا (data privacy regulations) دەبێت.",
        situationAr: "قلق زميل من تسريب بياناته على تطبيق",
        theyAskAr: "أنا قلق بشأن صوري على هذا التطبيق.",
        correctAr: "لا تقلق، هم يتبعون لوائح صارمة لخصوصية البيانات ويشفرون نسخك الاحتياطي السحابي.",
        wrong1Ar: "يريدون تقليل التلوث في واجهة المستخدم.",
        wrong2Ar: "بسبب تغير المناخ في الواقع الافتراضي.",
        wrong3Ar: "وإلا، يجب عليك اتباع وصفة التكنولوجيا المتطورة.",
        explanationAr: "الحماية الحقيقية للبيانات تكون باتباع لوائح خصوصية البيانات (data privacy regulations)."
      }
    ]
  },

  // Lesson 5: Global Issues
  {
    topic: "Global Issues", topicKu: "کێشە جیهانییەکان", topicAr: "القضايا العالمية",
    words: [
      { english: "Global economic crisis", kurdish: "قەیرانی ئابووری جیهانی", arabic: "أزمة اقتصادية عالمية" },
      { english: "Poverty reduction", kurdish: "کەمکردنەوەی هەژاری", arabic: "الحد من الفقر" },
      { english: "International trade barriers", kurdish: "بەربەستەکانی بازرگانی نێودەوڵەتی", arabic: "عوائق التجارة الدولية" },
      { english: "Humanitarian aid", kurdish: "یارمەتی مرۆیی", arabic: "مساعدات إنسانية" },
      { english: "Develop sustainable solutions", kurdish: "دروستکردنی چارەسەری بەردەوام", arabic: "تطوير حلول مستدامة" },
      { english: "Global population growth", kurdish: "گەشەی دانیشتوانی جیهان", arabic: "النمو السكاني العالمي" },
      { english: "Resource scarcity", kurdish: "کەمی سەرچاوە سروشتییەکان", arabic: "ندرة الموارد" },
      { english: "Resolve conflicts peacefully", kurdish: "چارەسەرکردنی ئاشتیانەی ناکۆکییەکان", arabic: "حل النزاعات سلمياً" },
    ],
    voices: [
      { prompt: "بڵێ دەبێت کێشەکان بە ئاشتی چارەسەر بکەین", target: "Nations must work together to resolve conflicts peacefully.", targetKurdish: "پێویستە نەتەوەکان پێکەوە کار بکەن بۆ چارەسەرکردنی ئاشتیانەی ناکۆکییەکان.", promptAr: "قل يجب حل النزاعات سلمياً بالتعاون", targetArabic: "يجب على الدول العمل معاً لحل النزاعات سلمياً." },
      { prompt: "باسی قەیرانی ئابووری بکە", target: "The global economic crisis affected many families.", targetKurdish: "قەیرانە ئابوورییە جیهانییەکە کاریگەری لەسەر زۆر خێزان دروست کرد.", promptAr: "تحدث عن الأزمة الاقتصادية", targetArabic: "الأزمة الاقتصادية العالمية أثرت على الكثير من العائلات." },
      { prompt: "بڵێ چارەسەری بەردەواممان پێویستە", target: "We need to develop sustainable solutions for resource scarcity.", targetKurdish: "پێویستە چارەسەری بەردەوام بۆ کەمی سەرچاوەکان پەرە پێ بدەین.", promptAr: "قل نحتاج لحلول مستدامة لندرة الموارد", targetArabic: "نحن بحاجة لتطوير حلول مستدامة لندرة الموارد." },
    ],
    sentences: [
      { english: ["Poverty", "reduction", "is", "the", "most", "important", "goal", "for", "the", "organization"], kurdish: "کەمکردنەوەی هەژاری گرنگترین ئامانجە بۆ ڕێکخراوەکە", arabic: "الحد من الفقر هو الهدف الأهم للمنظمة" },
      { english: ["Many", "countries", "sent", "humanitarian", "aid", "to", "the", "war", "zone"], kurdish: "زۆرێک لە وڵاتان هاوکاری مرۆییان بۆ ناوچەی جەنگەکە نارد", arabic: "أرسلت دول عديدة مساعدات إنسانية إلى منطقة الحرب" },
      { english: ["International", "trade", "barriers", "can", "harm", "local", "businesses"], kurdish: "بەربەستەکانی بازرگانی نێودەوڵەتی دەتوانن زیان بە کارە ناوخۆییەکان بگەیەنن", arabic: "عوائق التجارة الدولية يمكن أن تضر بالأعمال المحلية" },
      { english: ["Rapid", "global", "population", "growth", "causes", "many", "social", "challenges"], kurdish: "گەشەی خێرای دانیشتوانی جیهان دەبێتە هۆی زۆر کێشەی کۆمەڵایەتی", arabic: "النمو السكاني العالمي السريع يسبب العديد من التحديات الاجتماعية" },
    ],
    fillBlanks: [
      { parts: ["We must find ways to resolve our", "peacefully."], hint: "پێویستە ڕێگەیەک بدۆزینەوە بۆ چارەسەرکردنی ناکۆکییەکانمان بە ئاشتی.", answer: "conflicts", wrongs: ["aid", "poverty", "scarcity"], arabicHint: "يجب أن نجد طرقاً لحل نزاعاتنا سلمياً.", arabicParts: ["يجب أن نجد طرقاً لحل", "سلمياً."], arabicAnswer: "نزاعاتنا", arabicWrongs: ["مساعداتنا", "فقرنا", "ندرتنا"] },
      { parts: ["Sending", "can save millions of lives in crisis zones."], hint: "ناردنی هاوکاری مرۆیی دەتوانێت ژیانی ملیۆنان کەس لە ناوچەکانی قەیراندا ڕزگار بکات.", answer: "humanitarian aid", wrongs: ["economic crisis", "trade barriers", "population growth"], arabicHint: "إرسال المساعدات الإنسانية يمكن أن ينقذ ملايين الأرواح.", arabicParts: ["إرسال", "يمكن أن ينقذ ملايين الأرواح."], arabicAnswer: "المساعدات الإنسانية", arabicWrongs: ["الأزمة الاقتصادية", "العوائق التجارية", "النمو السكاني"] },
      { parts: ["Climate change contributes to water", "in Africa."], hint: "گۆڕانی کەشوهەوا دەبێتە هۆی کەمی ئاو لە ئەفریقا.", answer: "scarcity", wrongs: ["aid", "reduction", "solutions"], arabicHint: "تغير المناخ يساهم في ندرة المياه في إفريقيا.", arabicParts: ["تغير المناخ يساهم في", "المياه في إفريقيا."], arabicAnswer: "ندرة", arabicWrongs: ["مساعدات", "تقليل", "حلول"] },
    ],
    conversations: [
      {
        situation: "گفتوگۆ لەسەر هەواڵی نێودەوڵەتی",
        theyAsk: "Why are so many organizations protesting today?",
        correct: "They want to demand poverty reduction and resolve global conflicts peacefully.",
        wrong1: "To protect processed sugar in the economy.",
        wrong2: "Because they enjoyed the bitter dinner yesterday.",
        wrong3: "Unlike the previous version of trade barriers.",
        explanation: "کەمکردنەوەی هەژاری (poverty reduction) و چارەسەری ئاشتیانە داواکاری هەمیشەیی ڕێکخراوە مرۆییەکانن.",
        situationAr: "نقاش حول مظاهرات دولية",
        theyAskAr: "لماذا تتظاهر العديد من المنظمات اليوم؟",
        correctAr: "هم يريدون المطالبة بالحد من الفقر وحل النزاعات العالمية سلمياً.",
        wrong1Ar: "لحماية السكر المصنع في الاقتصاد.",
        wrong2Ar: "لأنهم استمتعوا بالعشاء المر بالأمس.",
        wrong3Ar: "على عكس النسخة السابقة من العوائق التجارية.",
        explanationAr: "الحد من الفقر والحلول السلمية (peaceful resolution) هي المطالب التقليدية للمنظمات الإنسانية."
      },
      {
        situation: "شیکردنەوەی هۆکاری کەمی ئاو",
        theyAsk: "What is causing the water shortage in these regions?",
        correct: "Global population growth and resource scarcity are the primary causes.",
        wrong1: "Because the laboratory equipment is too salty.",
        wrong2: "Owing to screen time limits on water.",
        wrong3: "We must preheat the water forecast.",
        explanation: "کەمی سەرچاوەکان (resource scarcity) و گەشەی دانیشتوان هۆکاری سەرەکین بۆ کەمی ئاو.",
        situationAr: "تحليل أسباب شح المياه",
        theyAskAr: "ما الذي يسبب شح المياه في هذه المناطق؟",
        correctAr: "النمو السكاني العالمي وندرة الموارد هما السببان الرئيسيان.",
        wrong1Ar: "لأن معدات المختبر مالحة جداً.",
        wrong2Ar: "نظراً لحدود وقت الشاشة على المياه.",
        wrong3Ar: "يجب تسخين توقعات الطقس للمياه مسبقاً.",
        explanationAr: "ندرة الموارد (resource scarcity) مع النمو السكاني هي العوامل الأساسية لشح المياه."
      }
    ]
  },

  // Lesson 6: Medical Science
  {
    topic: "Medical Science", topicKu: "زانستی پزیشکی", topicAr: "العلوم الطبية",
    words: [
      { english: "Develop a vaccine", kurdish: "پەرەپێدانی ڤاکسینێک", arabic: "تطوير لقاح" },
      { english: "Cure a disease", kurdish: "چارەسەرکردنی نەخۆشییەک", arabic: "علاج مرض" },
      { english: "Analyze the symptoms", kurdish: "شیکردنەوەی نیشانەکانی نەخۆشی", arabic: "تحليل الأعراض" },
      { english: "Medical treatment", kurdish: "چارەسەری پزیشکی", arabic: "علاج طبي" },
      { english: "Research laboratory", kurdish: "تاقیگەی توێژینەوە", arabic: "مختبر أبحاث" },
      { english: "Clinical trials", kurdish: "تاقیکردنەوە کلینیکییەکان", arabic: "تجارب سريرية" },
      { english: "Genetic research", kurdish: "توێژینەوەی جینەتیکی", arabic: "أبحاث جينية" },
      { english: "Preventative medicine", kurdish: "پزیشکی خۆپارێزی", arabic: "الطب الوقائي" },
    ],
    voices: [
      { prompt: "بڵێ زاناکان دەیانەوێت ڤاکسین دروست بکەن", target: "Scientists are working hard to develop a vaccine.", targetKurdish: "زاناکان زۆر کار دەکەن بۆ پەرەپێدانی ڤاکسینێک.", promptAr: "قل العلماء يعملون لتطوير لقاح", targetArabic: "العلماء يعملون بجد لتطوير لقاح." },
      { prompt: "بڵێ پزیشک نیشانەکان دەپشکنێت", target: "The doctor will analyze the symptoms before prescribing medicine.", targetKurdish: "پزیشکەکە نیشانەکان شی دەکاتەوە پێش نووسینی دەرمان.", promptAr: "قل الطبيب يحلل الأعراض قبل الدواء", targetArabic: "سيقوم الطبيب بتحليل الأعراض قبل وصف الدواء." },
      { prompt: "باسی تاقیکردنەوەی کلینیکی بکە", target: "The new drug is currently in clinical trials.", targetKurdish: "دەرمانە نوێیەکە ئێستا لە قۆناغی تاقیکردنەوە کلینیکییەکاندایە.", promptAr: "تحدث عن التجارب السريرية", targetArabic: "الدواء الجديد حالياً في مرحلة التجارب السريرية." },
    ],
    sentences: [
      { english: ["Genetic", "research", "helps", "us", "understand", "hereditary", "diseases"], kurdish: "توێژینەوەی جینەتیکی یارمەتیمان دەدات لە نەخۆشییە بۆماوەییەکان تێبگەین", arabic: "الأبحاث الجينية تساعدنا على فهم الأمراض الوراثية" },
      { english: ["Preventative", "medicine", "focuses", "on", "healthy", "lifestyle", "choices"], kurdish: "پزیشکی خۆپارێزی تەرکیز دەکاتە سەر هەڵبژاردنی شێوازی ژیانی تەندروست", arabic: "الطب الوقائي يركز على خيارات نمط الحياة الصحي" },
      { english: ["She", "works", "in", "a", "highly", "advanced", "medical", "research", "laboratory"], kurdish: "ئەو لە تاقیگەیەکی توێژینەوەی پزیشکی زۆر پێشکەوتوودا کار دەکات", arabic: "هي تعمل في مختبر أبحاث طبية متطور للغاية" },
      { english: ["They", "found", "an", "effective", "medical", "treatment", "for", "the", "infection"], kurdish: "ئەوان چارەسەرێکی پزیشکی کاریگەریان بۆ هەوکردنەکە دۆزییەوە", arabic: "وجدوا علاجاً طبياً فعالاً للعدوى" },
    ],
    fillBlanks: [
      { parts: ["We need to", "the symptoms to diagnose the illness."], hint: "پێویستە نیشانەکانی نەخۆشییەکە شی بکەینەوە بۆ ناسینەوەی نەخۆشییەکە.", answer: "analyze", wrongs: ["develop", "cure", "recycle"], arabicHint: "نحن بحاجة لتحليل الأعراض لتشخيص المرض.", arabicParts: ["نحن بحاجة لـ", "الأعراض لتشخيص المرض."], arabicAnswer: "تحليل", arabicWrongs: ["تطوير", "علاج", "إعادة تدوير"] },
      { parts: ["The company spent millions to develop a", "for the virus."], hint: "کۆمپانیاکە ملیۆنان دۆلاری خەرج کرد بۆ پەرەپێدانی ڤاکسینێک بۆ ڤایرۆسەکە.", answer: "vaccine", wrongs: ["treatment", "symptom", "laboratory"], arabicHint: "أنفقت الشركة الملايين لتطوير لقاح للفيروس.", arabicParts: ["أنفقت الشركة الملايين لتطوير", "للفيروس."], arabicAnswer: "لقاح", arabicWrongs: ["علاج", "عرض", "مختبر"] },
      { parts: ["This therapy is used to", "the disease completely."], hint: "ئەم چارەسەرە بەکاردێت بۆ بنبڕکردنی (چارەسەرکردنی) نەخۆشییەکە بە تەواوی.", answer: "cure", wrongs: ["analyze", "develop", "publish"], arabicHint: "يستخدم هذا العلاج للشفاء من المرض تماماً.", arabicParts: ["يستخدم هذا العلاج لـ", "المرض تماماً."], arabicAnswer: "الشفاء من", arabicWrongs: ["تحليل", "تطوير", "نشر"] },
    ],
    conversations: [
      {
        situation: "پرسیارکردن دەربارەی دۆزینەوەی دەرمانی نوێ",
        theyAsk: "How long will it take to release the new drug?",
        correct: "It is currently in clinical trials, so it might take a few more months to analyze the symptoms.",
        wrong1: "It went viral in a research laboratory yesterday.",
        wrong2: "Because of economic trade barriers in medicine.",
        wrong3: "To protect your digital footprint from viruses.",
        explanation: "دەرمانە نوێیەکان پێش بڵاوبوونەوە دەچنە قۆناغی تاقیکردنەوەی کلینیکی (clinical trials).",
        situationAr: "السؤال عن موعد طرح الدواء الجديد",
        theyAskAr: "كم من الوقت سيستغرق إطلاق الدواء الجديد؟",
        correctAr: "إنه حالياً في مرحلة التجارب السريرية، لذا قد يستغرق الأمر بضعة أشهر أخرى لتحليل الأعراض.",
        wrong1Ar: "لقد انتشر كتريند في مختبر أبحاث بالأمس.",
        wrong2Ar: "بسبب العوائق التجارية الاقتصادية في الطب.",
        wrong3Ar: "لحماية بصمتك الرقمية من الفيروسات.",
        explanationAr: "الأدوية الجديدة تمر بفترة تجارب سريرية (clinical trials) قبل الموافقة على نشرها."
      },
      {
        situation: "قسەکردن لەسەر ڕۆڵی الطب الوقائي",
        theyAsk: "Why do you focus so much on eating healthy and exercising?",
        correct: "Because preventative medicine is the best way to cure diseases before they start.",
        wrong1: "Owing to heavy rain in the research laboratory.",
        wrong2: "Consequently we developed a vaccine for sugar.",
        wrong3: "In contrast to local strawberries of genetic research.",
        explanation: "پزیشکی خۆپارێزی (preventative medicine) تەرکیز دەکاتە سەر ڕێگری لە نەخۆشی.",
        situationAr: "الحديث عن أهمية الطب الوقائي",
        theyAskAr: "لماذا تركز كثيراً على الأكل الصحي وممارسة الرياضة؟",
        correctAr: "لأن الطب الوقائي هو أفضل طريقة للوقاية من الأمراض قبل أن تبدأ.",
        wrong1Ar: "نظراً للمطر الغزير في مختبر الأبحاث.",
        wrong2Ar: "وبالتالي طورنا لقاحاً للسكر.",
        wrong3Ar: "على النقيض من الفراولة المحلية للأبحاث الجينية.",
        explanationAr: "الطب الوقائي (preventative medicine) يعنى بالحفاظ على الصحة لمنع الإصابة بالأمراض."
      }
    ]
  },

  // Lesson 7: Space & Exploration
  {
    topic: "Space & Exploration", topicKu: "گەردوون و گەڕان", topicAr: "الفضاء والاستكشاف",
    words: [
      { english: "Explore the universe", kurdish: "گەڕان لە گەردووندا", arabic: "استكشاف الكون" },
      { english: "Distant galaxy", kurdish: "گەلەئەستێرەی دوور", arabic: "مجرة بعيدة" },
      { english: "Launch a rocket", kurdish: "هاویشتنی ڕۆکێتێک", arabic: "إطلاق صاروخ" },
      { english: "Enter the orbit", kurdish: "چوونە ناو خولگە", arabic: "دخول المدار" },
      { english: "Astronaut mission", kurdish: "ئەرکی کەشتیوانی ئاسمانی", arabic: "مهمة رواد الفضاء" },
      { english: "Discover another planet", kurdish: "دۆزینەوەی هەسارەیەکی تر", arabic: "اكتشاف كوكب آخر" },
      { english: "Space station crew", kurdish: "تیمی وێستگەی ئاسمانی", arabic: "طاقم محطة الفضاء" },
      { english: "Telescope image", kurdish: "وێنەی تەلەسکۆپ", arabic: "صورة التلسكوب" },
    ],
    voices: [
      { prompt: "بڵێ ئامانجی ئەرکەکە گەڕانە لە گەردوون", target: "The goal of the mission is to explore the universe.", targetKurdish: "ئامانجی ئەرکەکە گەڕانە لە گەردووندا.", promptAr: "قل هدف المهمة هو استكشاف الكون", targetArabic: "هدف المهمة هو استكشاف الكون." },
      { prompt: "بڵێ ڕۆکێت هاوێژرا", target: "They will launch a rocket into space tomorrow morning.", targetKurdish: "بەیانی زوو ڕۆکێتێک بەرەو ئاسمان هاوێژ دەکەن.", promptAr: "قل سيطلقون صاروخاً غداً", targetArabic: "سيطلقون صاروخاً إلى الفضاء صباح الغد." },
      { prompt: "باسی وێنەی نوێی تەلەسکۆپ بکە", target: "The telescope captured a beautiful image of a distant galaxy.", targetKurdish: "تەلەسکۆپەکە وێنەیەکی جوانی گەلەئەستێرەیەکی دووری گرتووە.", promptAr: "تحدث عن صورة المجرة البعيدة", targetArabic: "التقط التلسكوب صورة جميلة لمجرة بعيدة." },
    ],
    sentences: [
      { english: ["The", "satellite", "is", "about", "to", "enter", "the", "earth", "orbit"], kurdish: "مانگە دەستکردەکە خەریکە دەچێتە ناو خولگەی زەوییەوە", arabic: "الأقمار الصناعية على وشك دخول مدار الأرض" },
      { english: ["Two", "astronauts", "completed", "a", "dangerous", "mission", "yesterday"], kurdish: "دوو کەشتیوانی ئاسمانی دوێنێ ئەرکێکی مەترسیداریان تەواو کرد", arabic: "أكمل رائدا فضاء مهمة خطيرة أمس" },
      { english: ["Scientists", "hope", "to", "discover", "another", "habitable", "planet", "soon"], kurdish: "زاناکان هیوادارن بەم زووانە هەسارەیەکی تری شیاو بۆ ژیان بدۆزنەوە", arabic: "يأمل العلماء في اكتشاف كوكب آخر صالح للسكن قريباً" },
      { english: ["The", "space", "station", "crew", "conducted", "several", "important", "experiments"], kurdish: "تیمی وێستگەی ئاسمانی چەندین تاقیکردنەوەی گرنگیان ئەنجامدا", arabic: "أجرى طاقم محطة الفضاء عدة تجارب مهمة" },
    ],
    fillBlanks: [
      { parts: ["The rocket was designed to", "into the orbit."], hint: "ڕۆکێتەکە بۆ چوونە ناو خولگەکەوە دیزاین کرابوو.", answer: "enter", wrongs: ["launch", "explore", "discover"], arabicHint: "تم تصميم الصاروخ لدخول المدار.", arabicParts: ["تم تصميم الصاروخ لـ", "المدار."], arabicAnswer: "دخول", arabicWrongs: ["إطلاق", "استكشاف", "اكتشاف"] },
      { parts: ["We used a large telescope to view the distant", "."], hint: "تەلەسکۆپێکی گەورەمان بەکارهێنا بۆ بینینی گەلەئەستێرە دوورەکە.", answer: "galaxy", wrongs: ["orbit", "astronaut", "rocket"], arabicHint: "استخدمنا تلسكوباً كبيراً لرؤية المجرة البعيدة.", arabicParts: ["استخدمنا تلسكوباً كبيراً لرؤية", "البعيدة."], arabicAnswer: "المجرة", arabicWrongs: ["المدار", "رائد الفضاء", "الصاروخ"] },
      { parts: ["Being an", "requires years of training and study."], hint: "بوون بە کەشتیوانی ئاسمانی پێویستی بە چەندین ساڵ ڕاهێنان و خوێندن هەیە.", answer: "astronaut", wrongs: ["orbit", "galaxy", "rocket"], arabicHint: "كونك رائد فضاء يتطلب سنوات من التدريب والدراسة.", arabicParts: ["كونك", "يتطلب سنوات من التدريب."], arabicAnswer: "رائد فضاء", arabicWrongs: ["مدار", "مجرة", "صاروخ"] },
    ],
    conversations: [
      {
        situation: "پرسیار دەربارەی بەشی نوێی ئاسمان",
        theyAsk: "What did the space station crew discover yesterday?",
        correct: "They captured telescope images of a distant galaxy that might contain another planet.",
        wrong1: "They launched a processed vaccine into the orbit.",
        wrong2: "They preheated the space station to two hundred degrees.",
        wrong3: "Unlike the previous version of healthy organic space.",
        explanation: "بەکارهێنانی 'telescope images', 'galaxy' و 'planet' وەڵامێکی زانستی و دروستە بۆ پرسیارەکە.",
        situationAr: "السؤال عن اكتشاف طاقم محطة الفضاء",
        theyAskAr: "ماذا اكتشف طاقم محطة الفضاء بالأمس؟",
        correctAr: "التقطوا صوراً بالتلسكوب لمجرة بعيدة قد تحتوي على كوكب آخر.",
        wrong1Ar: "أطلقوا لقاحاً مصنعاً في المدار.",
        wrong2Ar: "قاموا بتسخين محطة الفضاء مسبقاً إلى مئتي درجة.",
        wrong3Ar: "على عكس النسخة السابقة من الفضاء العضوي الصحي.",
        explanationAr: "استخدام صور التلسكوب والمجرة والكوكب يعطي تفسيراً علمياً متناسقاً للاكتشاف."
      },
      {
        situation: "قسەکردن لەسەر هەواڵی ناردنی کەشتیوان",
        theyAsk: "Why are they launching a rocket next week?",
        correct: "For an astronaut mission to explore the universe and repair the satellite.",
        wrong1: "Because of a global economic carbon footprint.",
        wrong2: "To reduce pollution in the distant galaxy.",
        wrong3: "Otherwise, we must follow the recipe of orbit.",
        explanation: "هاویشتنی ڕۆکێت (launching a rocket) بۆ گەشت و ئەرکی کەشتیوانان (astronaut mission) دەبێت.",
        situationAr: "الاستفسار عن سبب إطلاق الصاروخ",
        theyAskAr: "لماذا يطلقون صاروخاً الأسبوع المقبل؟",
        correctAr: "لمهمة رواد فضاء لاستكشاف الكون وإصلاح القمر الصناعي.",
        wrong1Ar: "بسبب بصمة كربونية اقتصادية عالمية.",
        wrong2Ar: "لتقليل التلوث في المجرة البعيدة.",
        wrong3Ar: "وإلا، يجب أن نتبع وصفة المدار.",
        explanationAr: "إطلاق الصاروخ (launching a rocket) يرتبط عادة بمهمات رواد الفضاء (astronaut mission) الاستكشافية."
      }
    ]
  },

  // Lesson 8: Advertising & Influence
  {
    topic: "Advertising", topicKu: "ڕیکلام و کاریگەری", topicAr: "الإعلانات والتأثير",
    words: [
      { english: "Promote a brand", kurdish: "برەودان بە براندێک (ڕیکلام بۆ کردن)", arabic: "ترويج لعلامة تجارية" },
      { english: "Consumer behavior", kurdish: "ڕەفتاری کڕیار (کۆنسومەر)", arabic: "سلوك المستهلك" },
      { english: "Marketing campaign", kurdish: "کەمپینی مارکێتینگ (بازاڕکردن)", arabic: "حملة تسويقية" },
      { english: "Persuade the audience", kurdish: "قەناعەتپێکردنی بینەران", arabic: "إقناع الجمهور" },
      { english: "Target market", kurdish: "بازاڕی ئامانج (کڕیارانی مەبەست)", arabic: "السوق المستهدف" },
      { english: "Sponsorship deal", kurdish: "ڕێککەوتنی سپۆنسەری", arabic: "صفقة رعاية" },
      { english: "Influencer marketing", kurdish: "مارکێتینگ لە ڕێگەی مۆدێلەکانەوە (ئینفلۆنسەر)", arabic: "التسويق عبر المؤثرين" },
      { english: "Brand loyalty", kurdish: "دڵسۆزی بۆ براندەکە (دڵسۆزی کڕیار)", arabic: "الولاء للعلامة التجارية" },
    ],
    voices: [
      { prompt: "بڵێ کەمپینەکە بۆ ڕیکلامی براندەکەیە", target: "We launched a marketing campaign to promote our new brand.", targetKurdish: "کەمپینێکی مارکێتینگمان دەستپێکرد بۆ ناساندن و برەودان بە براندە نوێیەکەمان.", promptAr: "قل بدأنا حملة ترويجية لعلامتنا الجديدة", targetArabic: "بدأنا حملة تسويقية لترويج علامتنا التجارية الجديدة." },
      { prompt: "بڵێ ڕیکلام دەیەوێت کاریگەری دروست بکات", target: "Advertisements try to persuade the audience to buy products.", targetKurdish: "ڕیکلامەکان هەوڵ دەدەن قەناعەت بە بینەران بهێنن بۆ کڕینی بەرهەمەکان.", promptAr: "قل الإعلانات تحاول إقناع الجمهور", targetArabic: "تحاول الإعلانات إقناع الجمهور بشراء المنتجات." },
      { prompt: "باسی ئینفلۆنسەر مارکێتینگ بکە", target: "Influencer marketing is very effective for the target market.", targetKurdish: "مارکێتینگ لە ڕێگەی ئینفلۆنسەرەکانەوە زۆر کاریگەرە بۆ بازاڕی ئامانج.", promptAr: "تحدث عن التسويق عبر المؤثرين", targetArabic: "التسويق عبر المؤثرين فعال جداً للسوق المستهدف." },
    ],
    sentences: [
      { english: ["They", "signed", "a", "large", "sponsorship", "deal", "with", "the", "athlete"], kurdish: "ئەوان ڕێککەوتنێکی گەورەی سپۆنسەرییان لەگەڵ یاریزانەکە واژوو کرد", arabic: "وقعوا صفقة رعاية كبيرة مع الرياضي" },
      { english: ["Understanding", "consumer", "behavior", "helps", "improve", "the", "product"], kurdish: "تێگەیشتن لە ڕەفتاری کڕیار یارمەتیدەرە بۆ باشترکردنی بەرهەمەکە", arabic: "فهم سلوك المستهلك يساعد في تحسين المنتج" },
      { english: ["Excellent", "customer", "service", "builds", "strong", "brand", "loyalty"], kurdish: "خزمەتگوزاری نایابی کڕیاران دڵسۆزییەکی بەهێز بۆ براندەکە دروست دەکات", arabic: "خدمة العملاء الممتازة تبني ولاءً قوياً للعلامة التجارية" },
      { english: ["Who", "is", "the", "primary", "target", "market", "for", "this", "app"], kurdish: "بازاڕی ئامانجی سەرەکی بۆ ئەم ئەپە کێیە؟", arabic: "من هو السوق المستهدف الرئيسي لهذا التطبيق؟" },
    ],
    fillBlanks: [
      { parts: ["We need to design ads that", "the target market."], hint: "پێویستە ڕیکلامێک دیزاین بکەین کە قەناعەت بە بازاڕی ئامانج بهێنێت.", answer: "persuade", wrongs: ["promote", "sponsor", "recycle"], arabicHint: "نحن بحاجة لتصميم إعلانات تقنع السوق المستهدف.", arabicParts: ["نحن بحاجة لتصميم إعلانات", "السوق المستهدف."], arabicAnswer: "تقنع", arabicWrongs: ["تروج", "ترعى", "تعيد تدوير"] },
      { parts: ["The soccer player signed a new", "with a shoe brand."], hint: "یاریزانی تۆپی پێیەکە ڕێککەوتنێکی نوێی سپۆنسەری لەگەڵ براندێکی پێڵاو واژوو کرد.", answer: "sponsorship deal", wrongs: ["consumer behavior", "target market", "brand loyalty"], arabicHint: "وقع لاعب كرة القدم صفقة رعاية جديدة مع علامة تجارية للأحذية.", arabicParts: ["وقع لاعب كرة القدم", "جديدة مع علامة تجارية للأحذية."], arabicAnswer: "صفقة رعاية", arabicWrongs: ["سلوك المستهلك", "السوق المستهدف", "الولاء للعلامة"] },
      { parts: ["Social media is the best way to", "your business today."], hint: "تۆڕە کۆمەڵایەتییەکان باشترین ڕێگان بۆ برەودان بە کارەکەت لە ئەمڕۆدا.", answer: "promote", wrongs: ["persuade", "analyze", "recycle"], arabicHint: "وسائل التواصل هي أفضل طريقة لترويج عملك اليوم.", arabicParts: ["وسائل التواصل هي أفضل طريقة لـ", "عملك اليوم."], arabicAnswer: "ترويج", arabicWrongs: ["إقناع", "تحليل", "إعادة تدوير"] },
    ],
    conversations: [
      {
        situation: "پلان بۆ ناساندنی بەرهەمێکی نوێ",
        theyAsk: "How are we going to launch our new software next month?",
        correct: "We will start a marketing campaign and use influencer marketing to reach our target market.",
        wrong1: "We should promote a decaf option for the astronaut.",
        wrong2: "Because of public opinion about processed sugar.",
        wrong3: "Unlike the previous version of carbon footprint.",
        explanation: "بەکارهێنانی 'marketing campaign' و 'influencer marketing' ڕێگەی زۆر باون بۆ بڵاوکردنەوەی بەرهەمی تەکنەلۆژی.",
        situationAr: "خطة إطلاق منتج جديد للشركة",
        theyAskAr: "كيف سنطلق برنامجنا الجديد الشهر المقبل؟",
        correctAr: "سنبدأ حملة تسويقية ونستخدم التسويق عبر المؤثرين للوصول إلى سوقنا المستهدف.",
        wrong1Ar: "يجب أن نروج لخيار خالٍ من الكافيين لرائد الفضاء.",
        wrong2Ar: "بسبب الرأي العام حول السكر المصنع.",
        wrong3Ar: "على عكس النسخة السابقة من البصمة الكربونية.",
        explanationAr: "الحملات التسويقية (marketing campaigns) والتسويق عبر المؤثرين هما الأسلوب الأحدث للوصول للعملاء."
      },
      {
        situation: "پرسیارکردن دەربارەی دڵسۆزی کڕیاران",
        theyAsk: "Why do people keep buying from this brand if it is so expensive?",
        correct: "Because they have built strong brand loyalty through high quality and great service.",
        wrong1: "Owing to media bias on target market.",
        wrong2: "Consequently we signed a sponsorship deal with processed food.",
        wrong3: "In order to persuade the audience to eat watermelon.",
        explanation: "دڵسۆزی کڕیاران (brand loyalty) هۆکاری کڕینەوەی هەمیشەیی بەرهەمەکانە تەنانەت ئەگەر گران بن.",
        situationAr: "الاستفسار عن ولاء المستهلكين لشركة غالية",
        theyAskAr: "لماذا يستمر الناس في الشراء من هذه العلامة رغم أنها غالية جداً؟",
        correctAr: "لأنهم بنوا ولاءً قوياً للعلامة التجارية من خلال الجودة العالية والخدمة الممتازة.",
        wrong1Ar: "بسبب الانحياز الإعلامي في السوق المستهدف.",
        wrong2Ar: "وبالتالي وقعنا صفقة رعاية مع الأغذية المصنعة.",
        wrong3Ar: "من أجل إقناع الجمهور بأكل الرقي (البطيخ).",
        explanationAr: "الولاء للعلامة التجارية (brand loyalty) هو القوة الدافعة لتكرار الشراء رغم ارتفاع الأسعار."
      }
    ]
  },

  // Lesson 9: Debate on Future (Modern Issues)
  {
    topic: "Debate on Future", topicKu: "گفتوگۆ لەسەر داهاتوو", topicAr: "جدل حول المستقبل",
    words: [
      { english: "Future challenges", kurdish: "تەحەددییەکانی داهاتوو", arabic: "تحديات المستقبل" },
      { english: "Resource management", kurdish: "بەڕێوبردنی سەرچاوەکان", arabic: "إدارة الموارد" },
      { english: "Overpopulation risks", kurdish: "مەترسییەکانی چڕی دانیشتوان (زۆری ژمارە)", arabic: "مخاطر الاكتظاظ السكاني" },
      { english: "Survival of humanity", kurdish: "مانەوەی مرۆڤایەتی", arabic: "بقاء البشرية" },
      { english: "Innovative solutions", kurdish: "چارەسەرە داهێنەرانەکان", arabic: "حلول مبتكرة" },
      { english: "Optimistic outlook", kurdish: "ڕوانگەی گەشبینانە", arabic: "نظرة متفائلة" },
      { english: "Pessimistic view", kurdish: "ڕوانگەی ڕەشبینانە", arabic: "نظرة متشائمة" },
      { english: "Joint responsibility", kurdish: "بەرپرسیارێتی بەکۆمەڵ (هاوبەش)", arabic: "مسؤولية مشتركة" },
    ],
    voices: [
      { prompt: "بڵێ پاراستنی زەوی بەرپرسیارێتییەکی هاوبەشە", target: "Protecting our planet is a joint responsibility for all nations.", targetKurdish: "پاراستنی هەسارەکەمان بەرپرسیارێتییەکی هاوبەشە بۆ هەموو نەتەوەکان.", promptAr: "قل حماية كوكبنا مسؤولية مشتركة", targetArabic: "حماية كوكبنا هي مسؤولية مشتركة لجميع الأمم." },
      { prompt: "بڵێ گەشبینیت بە داهاتوو", target: "I have an optimistic outlook on the future of technology.", targetKurdish: "من ڕوانگەیەکی گەشبینانەم هەیە بەرامبەر بە داهاتووی تەکنەلۆژیا.", promptAr: "قل لديك نظرة متفائلة للمستقبل", targetArabic: "لدي نظرة متفائلة بمستقبل التكنولوجيا." },
      { prompt: "بڵێ چارەسەری داهێنەرانەمان پێویستە", target: "We must find innovative solutions for overpopulation risks.", targetKurdish: "پێویستە چارەسەری داهێنەرانە بۆ مەترسییەکانی زۆری دانیشتوان بدۆزینەوە.", promptAr: "قل نحتاج لحلول مبتكرة للاكتظاظ", targetArabic: "يجب أن نجد حلولاً مبتكرة لمخاطر الاكتظاظ السكاني." },
    ],
    sentences: [
      { english: ["The", "survival", "of", "humanity", "depends", "on", "resource", "management"], kurdish: "مانەوەی مرۆڤایەتی بەستراوەتەوە بە بەڕێوبردنی سەرچاوەکانەوە", arabic: "بقاء البشرية يعتمد على إدارة الموارد" },
      { english: ["She", "has", "a", "very", "pessimistic", "view", "about", "global", "economy"], kurdish: "ئەو ڕوانگەیەکی زۆر ڕەشبینانەی هەیە دەربارەی ئابووری جیهان", arabic: "لديها نظرة متشائمة للغاية حول الاقتصاد العالمي" },
      { english: ["Future", "challenges", "will", "require", "global", "cooperation", "to", "solve"], kurdish: "تەحەددییەکانی داهاتوو پێویستیان بە هاوکاری جیهانی دەبێت بۆ چارەسەرکردن", arabic: "تحديات المستقبل تتطلب تعاوناً عالمياً لحلها" },
      { english: ["We", "should", "develop", "innovative", "solutions", "for", "energy"], kurdish: "دەبێت چارەسەری داهێنەرانە بۆ وزە دروست بکەین", arabic: "ينبغي لنا تطوير حلول مبتكرة للطاقة" },
    ],
    fillBlanks: [
      { parts: ["Protecting the environment is a", "responsibility of everyone."], hint: "پاراستنی ژینگە بەرپرسیارێتییەکی هاوبەشی (بەکۆمەڵی) هەمووانە.", answer: "joint", wrongs: ["pessimistic", "optimistic", "eventual"], arabicHint: "حماية البيئة هي مسؤولية مشتركة للجميع.", arabicParts: ["حماية البيئة هي مسؤولية", "للجميع."], arabicAnswer: "مشتركة", arabicWrongs: ["متشائمة", "متفائلة", "نهائية"] },
      { parts: ["Despite the challenges, I have an", "outlook on our progress."], hint: "سەرەڕای تەحەددییەکان، من ڕوانگەیەکی گەشبینانەم هەیە لەسەر پێشکەوتنەکانمان.", answer: "optimistic", wrongs: ["pessimistic", "joint", "salty"], arabicHint: "على الرغم من التحديات، لدي نظرة متفائلة بتقدمنا.", arabicParts: ["على الرغم من التحديات، لدي نظرة", "بتقدمنا."], arabicAnswer: "متفائلة", arabicWrongs: ["متشائمة", "مشتركة", "مالحة"] },
      { parts: ["We must improve our", "to avoid future shortages of food."], hint: "پێویستە بەڕێوبردنی سەرچاوەکانمان باشتر بکەین بۆ خۆلادان لە کەمی خواردن لە داهاتوودا.", answer: "resource management", wrongs: ["future challenges", "innovative solutions", "overpopulation risks"], arabicHint: "يجب أن نحسن إدارة الموارد لتجنب النقص المستقبلي في الغذاء.", arabicParts: ["يجب أن نحسن", "لتجنب النقص المستقبلي."], arabicAnswer: "إدارة الموارد", arabicWrongs: ["تحديات المستقبل", "الحلول المبتكرة", "مخاطر الاكتظاظ"] },
    ],
    conversations: [
      {
        situation: "دیبەیت دەربارەی مەترسی زۆری دانیشتوان",
        theyAsk: "Are you worried about the future population of the earth?",
        correct: "Yes, overpopulation risks are real, but I believe we can find innovative solutions.",
        wrong1: "No, I am completely full of resource management.",
        wrong2: "Cheers to our joint responsibility and processed sugar.",
        wrong3: "I have a pessimistic view about the weather forecast of strawberries.",
        explanation: "وەڵامێکی گونجاوە کە نیگەرانی نیشان دەدات بەڵام چارەسەری داهێنەرانەش (innovative solutions) پێشنیاز دەکات.",
        situationAr: "جدل حول مخاطر الزيادة السكانية",
        theyAskAr: "هل أنت قلق بشأن تعداد سكان الأرض في المستقبل؟",
        correctAr: "نعم، مخاطر الاكتظاظ السكاني حقيقية، لكني أعتقد أننا سنعثر على حلول مبتكرة.",
        wrong1Ar: "لا، أنا ممتلئ تماماً بإدارة الموارد.",
        wrong2Ar: "نخب مسؤوليتنا المشتركة والسكر المصنع.",
        wrong3Ar: "لدي نظرة متشائمة حول توقعات الطقس للفراولة.",
        explanationAr: "رد متوازن يعترف بالمشكلة لكنه يطرح التطلع للحلول المبتكرة (innovative solutions)."
      },
      {
        situation: "پرسیارکردن دەربارەی داهاتووی هەسارەکەمان",
        theyAsk: "Do you think we will survive the climate crisis?",
        correct: "If we accept it as a joint responsibility, we can develop sustainable solutions for our survival.",
        wrong1: "Because it was far superior to last year's headlines.",
        wrong2: "We should assume the worst about local bananas.",
        wrong3: "Otherwise we will enter the orbit of space stations.",
        explanation: "'joint responsibility' و 'sustainable solutions' باشترین کلیلن بۆ پێشبینی داهاتووی مرۆڤایەتی.",
        situationAr: "تساؤل حول نجاة البشرية من أزمة المناخ",
        theyAskAr: "هل تعتقد أننا سننجو من أزمة المناخ؟",
        correctAr: "إذا قبلنا الأمر كمسؤولية مشتركة، يمكننا تطوير حلول مستدامة لبقائنا.",
        wrong1Ar: "لأنه كان متفوقاً بكثير على عناوين العام الماضي.",
        wrong2Ar: "يجب أن نفترض الأسوأ بخصوص الموز المحلي.",
        wrong3Ar: "وإلا سندخل مدار المحطات الفضائية.",
        explanationAr: "المسؤولية المشتركة (joint responsibility) هي الحل الوحيد لضمان بقاء البشرية ومواجهة أزمة المناخ."
      }
    ]
  }
];

export default normalUnit14;
