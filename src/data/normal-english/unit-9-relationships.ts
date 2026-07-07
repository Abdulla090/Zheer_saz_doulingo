import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 9: Relationships & Feelings — 10 unique lessons ───────────────────
// How to express emotions, boundaries, support, and navigate relationships.

const unit09: UnitBank = [
  buildLesson(
    "Making Friends",
    "دروستکردنی هاوڕێیەتی",
    [
      { en: "I really enjoyed talking to you today.", ku: "ئەمڕۆ زۆر چێژم لە قسەکردن لەگەڵت وەرگرت.", ar: "لقد استمتعتُ حقاً بالتحدّث معك اليوم." },
      { en: "We should hang out again sometime.", ku: "دەبێت جارێکی تر بێینە دەرەوە و کات بەسەر ببەین.", ar: "يجب أن نخرج معاً مرة أخرى." },
      { en: "You seem like someone I'd get along with.", ku: "پێدەچێت کەسێک بیت کە بتوانم لەگەڵتدا بگونجێم.", ar: "تبدو شخصاً يمكنني أن أنسجم معه." },
      { en: "Want to grab coffee and chat more?", ku: "دەتەوێت قاوەیەک بخۆینەوە و زیاتر قسە بکەین؟", ar: "هل تودّ أن نشرب قهوة ونتحدّث أكثر؟" },
      { en: "I'm still pretty new here — nice to meet you.", ku: "هێشتا لێرە نوێم — خۆشحاڵم بە ناسینت.", ar: "ما زلتُ جديداً هنا — سعيد بلقائك." },
      { en: "Let's exchange numbers and keep in touch.", ku: "با ژمارە ئاڵوگۆڕ بکەین و لە پەیوەندیدا بین.", ar: "لنتبادل الأرقام ونبقى على تواصل." },
    ],
    {
      convos: [
        {
          situation: "لە بۆنەیەکی کۆمەڵایەتیدا کەسێکی نوێ دەناسیت",
          situationAr: "تتعرّف على شخص جديد في مناسبة اجتماعية",
          theyAsk: "It was great meeting you at the language exchange!",
          correct: "I really enjoyed talking to you too. We should hang out again sometime — want to grab coffee?",
          wrong1: "I don't want meet again.",
          wrong2: "You talk too much.",
          wrong3: "Goodbye forever.",
          explanation: "'We should hang out again' و 'want to grab coffee?' — باوترین ڕێگەیە بۆ پێشنیارکردنی بینینەوەیەکی تر",
          explanationAr: "'We should hang out again' و 'want to grab coffee?' — أكثر الطرق شيوعاً لاقتراح لقاء آخر",
        },
        {
          situation: "تازە گواستراویتەوە بۆ شارێکی نوێ",
          situationAr: "انتقلتَ حديثاً إلى مدينة جديدة",
          theyAsk: "How are you settling in so far?",
          correct: "I'm still pretty new here, but everyone's been friendly. Nice to meet people like you!",
          wrong1: "I hate this city.",
          wrong2: "Nobody talks to me.",
          wrong3: "New city is scary.",
          explanation: "'I'm still pretty new here' — ڕێگەیەکی زۆر سروشتییە بۆ ڕوونکردنەوەی بارودۆخەکەت",
          explanationAr: "'I'm still pretty new here' — طريقة طبيعية جداً لوصف وضعك الحالي",
        },
      ],
    },
    "تكوين الصداقات",
  ),

  buildLesson(
    "Expressing Feelings",
    "دەربڕینی هەستەکان",
    [
      { en: "I've been feeling a bit overwhelmed lately.", ku: "لەم دواییانەدا کەمێک هەست بە پەستان (قورسایی) دەکەم.", ar: "شعرتُ بشيء من الإرهاق مؤخراً." },
      { en: "Honestly, I'm really happy about this.", ku: "ڕاستی بڵێم، لەمە زۆر دڵخۆشم.", ar: "بصراحة، أنا سعيد جداً بهذا." },
      { en: "Something's been bothering me for a while.", ku: "ماوەیەکە شتێک بێزارم دەکات.", ar: "هناك شيء يزعجني منذ فترة." },
      { en: "I didn't expect to feel this nervous.", ku: "چاوەڕێم نەدەکرد ئەوەندە شڵەژاو بم.", ar: "لم أتوقّع أن أشعر بهذا القدر من التوتّر." },
      { en: "It's hard to put my feelings into words.", ku: "قورسە هەستەکانم بخەمە چوارچێوەی وشەوە.", ar: "من الصعب أن أعبّر عن مشاعري بالكلمات." },
      { en: "I feel like a weight has been lifted.", ku: "هەست دەکەم بارێکی قورس لە کۆڵم بووەوە.", ar: "أشعر وكأنّ عبئاً ثقيلاً قد رُفع عن كاهلي." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت دەپرسێت چۆنیت",
          situationAr: "صديقك يسألك عن حالك",
          theyAsk: "You seem quiet today — everything okay?",
          correct: "Honestly, I've been feeling a bit overwhelmed lately. Something's been bothering me for a while.",
          wrong1: "I am fine nothing wrong.",
          wrong2: "Don't ask me questions.",
          wrong3: "Everything is perfect always.",
          explanation: "'Feeling overwhelmed' — وشەیەکی زۆر باوە بۆ دەربڕینی هەستکردن بە قورسایی کار یان بیرکردنەوە",
          explanationAr: "'Feeling overwhelmed' — تعبير شائع جداً للتعبير عن الشعور بضغط العمل أو التفكير",
        },
        {
          situation: "دوای چارەسەرکردنی کێشەیەکی گەورە",
          situationAr: "بعد حلّ مشكلة كبيرة",
          theyAsk: "How do you feel now that it's resolved?",
          correct: "I feel like a weight has been lifted. I didn't expect to feel this relieved.",
          wrong1: "Still very angry.",
          wrong2: "Problem is same.",
          wrong3: "I don't feel anything.",
          explanation: "'A weight has been lifted' ئیدیۆمێکی زۆر بەناوبانگە بە واتای ئارامبوونەوە لە دوای فشارێکی زۆر",
          explanationAr: "'A weight has been lifted' تعبير اصطلاحي شهير يعني الشعور بالراحة بعد ضغط كبير",
        },
      ],
    },
    "التعبير عن المشاعر",
  ),

  buildLesson(
    "Showing Support",
    "پشتگیری کردنی کەسانی تر",
    [
      { en: "I'm here for you no matter what.", ku: "لە هەر بارودۆخێکدا بێت من لەگەڵتم.", ar: "أنا هنا من أجلك مهما حصل." },
      { en: "That sounds really tough — I'm sorry.", ku: "ئەوە زۆر سەخت دیارە — زۆر بەداخەوەم.", ar: "يبدو ذلك صعباً حقاً — أنا آسف." },
      { en: "Take all the time you need to heal.", ku: "هەموو ئەو کاتە وەربگرە کە پێویستتە بۆ چاکبوونەوە.", ar: "خُذ كل الوقت الذي تحتاجه للتعافي." },
      { en: "You're not alone in this.", ku: "تۆ لەمەدا بەتەنیا نیت.", ar: "لستَ وحدك في هذا." },
      { en: "I believe in you — you've got this.", ku: "متمانەم پێتە — تۆ دەتوانیت ئەمە بکەیت.", ar: "أنا أؤمن بك — بإمكانك فعلها." },
      { en: "Let me know if you need anything at all.", ku: "ئەگەر هەر شتێکت پێویست بوو پێم بڵێ.", ar: "أخبرني إذا احتجتَ أيّ شيء على الإطلاق." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت بەدەست کێشەیەکەوە دەناڵێنێت",
          situationAr: "صديقك يتألّم بسبب مشكلة",
          theyAsk: "I just found out my grandma is in the hospital.",
          correct: "That sounds really tough — I'm sorry. I'm here for you no matter what. Let me know if you need anything.",
          wrong1: "Hospitals are normal.",
          wrong2: "Don't be sad.",
          wrong3: "I have no time to help.",
          explanation: "'That sounds really tough' ڕێگەیەکی زۆر بەهێزە بۆ هاوسۆزی پێش ئەوەی ئامۆژگاری بدەیت",
          explanationAr: "'That sounds really tough' طريقة قوية جداً لإظهار التعاطف قبل تقديم النصيحة",
        },
        {
          situation: "هاوکارێکت پێش چاوپێکەوتنێکی گرنگ شڵەژاوە",
          situationAr: "زميلك متوتّر قبل عرض تقديمي مهمّ",
          theyAsk: "I'm so nervous about tomorrow's presentation.",
          correct: "I believe in you — you've got this. You're not alone — we can practice together tonight.",
          wrong1: "You will fail probably.",
          wrong2: "Presentations are easy.",
          wrong3: "Don't talk to me about work.",
          explanation: "'You've got this' زاراوەیەکی زۆر باوە بۆ هاندانی کەسێک پێش ئەنجامدانی کارێکی قورس",
          explanationAr: "'You've got this' تعبير شائع جداً لتشجيع شخص قبل القيام بمهمة صعبة",
        },
      ],
    },
    "إظهار الدعم",
  ),

  buildLesson(
    "Dating & Romance",
    "خۆشەویستی و ژوان",
    [
      { en: "I'd love to take you out sometime.", ku: "حەز دەکەم کاتێک بتبەمە دەرەوە.", ar: "أودّ أن أدعوك للخروج في وقت ما." },
      { en: "I had a really great time on our date.", ku: "کاتێکی زۆر خۆشم بەسەربرد لە ژوانەکەماندا.", ar: "قضيتُ وقتاً رائعاً حقاً في موعدنا." },
      { en: "You make me smile every time we talk.", ku: "هەر جارێک قسە دەکەین وام لێ دەکەیت زەردەخەنە بکەم.", ar: "تجعلني أبتسم في كلّ مرة نتحدّث فيها." },
      { en: "I'm not looking for anything serious right now.", ku: "لە ئێستادا بەدوای پەیوەندییەکی جددیدا ناگەڕێم.", ar: "لا أبحث عن علاقة جدّية في الوقت الحالي." },
      { en: "I think we'd make a great team.", ku: "پێم وایە ئێمە تیمێکی نایاب دەبین پێکەوە.", ar: "أعتقد أنّنا سنُشكّل فريقاً رائعاً معاً." },
      { en: "Can I be honest about how I feel?", ku: "دەتوانم ڕاستگۆ بم دەربارەی هەستەکانم؟", ar: "هل يمكنني أن أكون صريحاً بشأن مشاعري؟" },
    ],
    {
      convos: [
        {
          situation: "دوای یەکەم ژوان (دەرچوون)",
          situationAr: "بعد الموعد الأوّل",
          theyAsk: "Did you get home safely?",
          correct: "Yes, thanks! I had a really great time on our date. I'd love to do it again.",
          wrong1: "Date was boring.",
          wrong2: "Don't text me.",
          wrong3: "Home is far.",
          explanation: "'I had a really great time' باشترین وەڵامە ئەگەر دەتەوێت دووبارە کەسەکە ببینیەوە",
          explanationAr: "'I had a really great time' أفضل إجابة إذا كنتَ تريد رؤية الشخص مرة أخرى",
        },
        {
          situation: "دەتەوێت ڕاستگۆ بیت لەسەر هەستەکانت",
          situationAr: "تريد أن تكون صريحاً بشأن مشاعرك",
          theyAsk: "We've been seeing each other for a few weeks now.",
          correct: "Can I be honest about how I feel? I think we'd make a great team — I really like where this is going.",
          wrong1: "I don't like you.",
          wrong2: "Stop seeing me.",
          wrong3: "Feelings are not important.",
          explanation: "'Can I be honest about how I feel?' دەستپێکێکی نایابە بۆ قسەکردن لەسەر شتێکی هەستیار",
          explanationAr: "'Can I be honest about how I feel?' بداية ممتازة للحديث عن موضوع حسّاس",
        },
      ],
    },
    "المواعدة والرومانسية",
  ),

  buildLesson(
    "Family Talk",
    "قسەکردن لەسەر خێزان",
    [
      { en: "My parents are visiting next week.", ku: "دایک و باوکم هەفتەی داهاتوو سەردانم دەکەن.", ar: "والداي سيزورانني الأسبوع القادم." },
      { en: "I need to call my sister back tonight.", ku: "پێویستە ئەمشەو تەلەفۆن بۆ خوشکەکەم بکەمەوە.", ar: "أحتاج أن أعيد الاتصال بأختي الليلة." },
      { en: "Family dinners can get pretty loud at our house.", ku: "ئێوارەخوانەکانی خێزان لە ماڵماندا زۆر ژاوەژاوی تێدایە.", ar: "عشاء العائلة يكون صاخباً جداً في بيتنا." },
      { en: "I'm the oldest, so I help with the kids a lot.", ku: "من گەورەترینم، بۆیە زۆر یارمەتی منداڵەکان دەدەم.", ar: "أنا الأكبر سنّاً، لذلك أساعد كثيراً مع الأطفال." },
      { en: "We try to video call every Sunday.", ku: "هەوڵ دەدەین هەموو یەکشەممەیەک بە ڤیدیۆ قسە بکەین.", ar: "نحاول إجراء مكالمة فيديو كلّ يوم أحد." },
      { en: "My brother just got engaged — we're all thrilled.", ku: "براکەم تازە دەستگیرانداری کرد — هەموومان زۆر دڵخۆشین.", ar: "أخي خُطب للتوّ — جميعنا في غاية السعادة." },
    ],
    {
      convos: [
        {
          situation: "هاوکارێکت دەپرسێت بۆچی ئەم کۆتایی هەفتەیە سەرقاڵیت",
          situationAr: "زميلك يسألك لماذا أنتَ مشغول نهاية هذا الأسبوع",
          theyAsk: "Are you free to cover my shift this weekend?",
          correct: "Sorry, my parents are visiting next week and I need to get the house ready — this weekend is packed.",
          wrong1: "Family is not important.",
          wrong2: "I don't have parents.",
          wrong3: "Weekend I sleep only.",
          explanation: "باسکردنی خێزان بە شێوازی ئاسایی — 'parents are visiting' زۆر باوە",
          explanationAr: "الحديث عن العائلة بأسلوب طبيعي — 'parents are visiting' تعبير شائع جداً",
        },
        {
          situation: "هاوڕێیەکت دەپرسێت پەیوەندیت چۆنە لەگەڵ برا و خوشکەکانت",
          situationAr: "صديقك يسألك عن علاقتك بإخوتك",
          theyAsk: "How's your relationship with your siblings?",
          correct: "Pretty good! My brother just got engaged — we're all thrilled. We try to video call every Sunday.",
          wrong1: "I hate my siblings.",
          wrong2: "Brother is bad person.",
          wrong3: "We never talk.",
          explanation: "'Got engaged' بەکاردێت بۆ دەستگیرانداری | 'siblings' واتای برا و خوشکەکان پێکەوە دەگەیەنێت",
          explanationAr: "'Got engaged' تُستخدم للخطوبة | 'siblings' تعني الإخوة والأخوات معاً",
        },
      ],
    },
    "الحديث عن العائلة",
  ),

  buildLesson(
    "Disagreements",
    "ناکۆکی و لێک حاڵی نەبوون",
    [
      { en: "I hear what you're saying, but I disagree.", ku: "گوێم لە قسەکانتە، بەڵام هاوڕا نیم.", ar: "أسمع ما تقوله، لكنّني لا أوافق." },
      { en: "I didn't mean to hurt your feelings.", ku: "مەبەستم ئەوە نەبوو هەستت بریندار بکەم.", ar: "لم أقصد أن أجرح مشاعرك." },
      { en: "Can we talk about this calmly?", ku: "دەتوانین بە ئارامی لەسەر ئەمە قسە بکەین؟", ar: "هل يمكننا أن نتحدّث عن هذا بهدوء؟" },
      { en: "I think we're both a little frustrated.", ku: "پێم وایە هەردووکمان کەمێک بێزار بووین.", ar: "أعتقد أنّنا كلانا محبطان قليلاً." },
      { en: "I want to understand your side better.", ku: "دەمەوێت باشتر لە لایەنەکەی تۆ تێبگەم.", ar: "أريد أن أفهم وجهة نظرك بشكل أفضل." },
      { en: "Let's not go to bed angry.", ku: "با بە دڵگرانییەوە نەخەوین.", ar: "دعنا لا ننام ونحن غاضبون." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت تووڕەیە چونکە شتێکت پێ نەوتووە",
          situationAr: "صديقك غاضب لأنّك لم تخبره بشيء",
          theyAsk: "I can't believe you didn't tell me about the trip!",
          correct: "I hear what you're saying, but I didn't mean to hurt your feelings. Can we talk about this calmly?",
          wrong1: "You are too sensitive.",
          wrong2: "Trip is my business only.",
          wrong3: "Stop talking to me.",
          explanation: "'I hear what you're saying' باشترین ڕێگەیە بۆ دامرکاندنەوەی تووڕەیی پێش ئەوەی وەڵام بدەیتەوە",
          explanationAr: "'I hear what you're saying' أفضل طريقة لتهدئة الغضب قبل أن تردّ",
        },
        {
          situation: "لەگەڵ هاوسەرەکەت دەمەقاڵێتە لەسەر کاری ماڵ",
          situationAr: "تتجادل مع شريك حياتك حول الأعمال المنزلية",
          theyAsk: "You always leave the dishes for me!",
          correct: "I think we're both a little frustrated. I want to understand your side better — let's figure this out together.",
          wrong1: "Dishes are your job.",
          wrong2: "I do everything already.",
          wrong3: "Leave the house.",
          explanation: "'Understand your side' و 'figure this out together' کێشەکە دەکاتە کێشەیەکی هاوبەش نەک شەڕ",
          explanationAr: "'Understand your side' و 'figure this out together' تحوّل المشكلة إلى قضية مشتركة بدلاً من شجار",
        },
      ],
    },
    "الخلافات",
  ),

  buildLesson(
    "Emotional Intelligence",
    "زیرەکی سۆزداری",
    [
      { en: "I appreciate you opening up to me.", ku: "سوپاس کە دڵی خۆتت بۆ کردمەوە.", ar: "أقدّر انفتاحك معي." },
      { en: "It's okay to not be okay sometimes.", ku: "ئاساییە کە هەندێک جار باش نەبیت.", ar: "لا بأس أن لا تكون بخير أحياناً." },
      { en: "Your feelings are completely valid.", ku: "هەستەکانت بەتەواوی ڕەوا و دروستن.", ar: "مشاعرك مشروعة تماماً." },
      { en: "I'm not trying to fix you — just listen.", ku: "هەوڵ نادەم کێشەکەت چارەسەر بکەم — تەنها گوێت لێ دەگرم.", ar: "لا أحاول إصلاحك — فقط أستمع إليك." },
      { en: "Thank you for trusting me with this.", ku: "سوپاس کە متمانەت پێم کرد بۆ وتنی ئەمە.", ar: "شكراً لثقتك بي في هذا الأمر." },
      { en: "Would it help to talk it through together?", ku: "ئایا یارمەتیدەر دەبێت ئەگەر پێکەوە قسەی لەسەر بکەین؟", ar: "هل سيساعد لو تحدّثنا عنه معاً؟" },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت نهێنییەکی قورس و هەستیارت پێ دەڵێت",
          situationAr: "صديقك يُخبرك بسرّ ثقيل وحسّاس",
          theyAsk: "I've never told anyone this before...",
          correct: "Thank you for trusting me with this. I'm not trying to fix you — just listen. Your feelings are completely valid.",
          wrong1: "That is not a big problem.",
          wrong2: "You should not feel that way.",
          wrong3: "Tell someone else.",
          explanation: "'Opening up' و 'trusting me' نیشانی دەدەن کە تۆ بەڕاستی گرنگی دەدەیت و دادوەری ناکەیت",
          explanationAr: "'Opening up' و 'trusting me' تُظهران أنّك تهتمّ حقاً ولا تُصدر أحكاماً",
        },
        {
          situation: "کەسێکی نزیکت هەست بە بێهیوایی دەکات لە خۆی",
          situationAr: "شخص قريب منك يشعر بالإحباط من نفسه",
          theyAsk: "I feel like I should be over this by now.",
          correct: "It's okay to not be okay sometimes. Would it help to talk it through together?",
          wrong1: "Get over it faster.",
          wrong2: "Sadness is weakness.",
          wrong3: "Stop feeling sad.",
          explanation: "'It's okay to not be okay' ئیدیۆمێکی زۆر بەناوبانگە لە دەروونناسیدا بۆ دڵنەواییدان",
          explanationAr: "'It's okay to not be okay' تعبير اصطلاحي شهير جداً في علم النفس للمواساة",
        },
      ],
    },
    "الذكاء العاطفي",
  ),
];

export default unit09;
