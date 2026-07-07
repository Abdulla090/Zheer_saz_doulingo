import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 13: Opinions & Fluent Confidence — 10 unique lessons ───────────────
// Express yourself clearly: opinions, debates, humor, networking, and real talk.

const unit13: UnitBank = [
  buildLesson(
    "Sharing Opinions",
    "دەربڕینی بۆچوون",
    [
      { en: "In my opinion, we should start with the basics.", ku: "بەڕای من، باشترە لە بنەڕەتەکانەوە دەست پێبکەین.", ar: "برأيي، يجب أن نبدأ بالأساسيات." },
      { en: "I honestly think this is the better option.", ku: "بەڕاستی پێم وایە ئەمە هەڵبژاردەی باشترە.", ar: "بصراحة، أعتقد أن هذا هو الخيار الأفضل." },
      { en: "From where I stand, the timing could be better.", ku: "لە ڕوانگەی منەوە، کاتەکە دەیتوانی باشتر بێت.", ar: "من وجهة نظري، كان يمكن أن يكون التوقيت أفضل." },
      { en: "I see your point, but I respectfully disagree.", ku: "تێدەگەم مەبەستت چییە، بەڵام لەگەڵ ڕێزدا هاوڕا نیم.", ar: "أفهم وجهة نظرك، لكنني أختلف معك باحترام." },
      { en: "If you ask me, we need more time to decide.", ku: "ئەگەر لە من بپرسیت، پێویستمان بە کاتی زیاترە بۆ بڕیاردان.", ar: "إن سألتني، نحتاج إلى مزيد من الوقت لاتخاذ القرار." },
      { en: "I'm not entirely convinced that's the right move.", ku: "بەتەواوی قەناعەتم نەکردووە کە ئەوە هەنگاوی دروست بێت.", ar: "لست مقتنعاً تماماً بأن هذه هي الخطوة الصحيحة." },
    ],
    {
      convos: [
        {
          situation: "لە کۆبوونەوەیەکی تیمدا لەسەر پلانێکی نوێ",
          situationAr: "في اجتماع فريق حول خطة جديدة",
          theyAsk: "So should we launch this new feature this month or wait?",
          correct: "In my opinion, we should start with the basics and launch next month when we're fully ready.",
          wrong1: "Launch now no plan.",
          wrong2: "I don't care about launch.",
          wrong3: "Your idea is always wrong.",
          explanation: "'In my opinion' شێوازێکی زۆر باو و پیشەییە بۆ دەستپێکردنی پێشنیارێک بێ ئەوەی فەرز بێت",
          explanationAr: "'In my opinion' تعبير شائع ومهني لبدء اقتراح دون فرضه على الآخرين",
        },
        {
          situation: "هاوڕێیەکت داوای بۆچوونت دەکات لەسەر بڕیارێکی گرنگ",
          situationAr: "صديقك يطلب رأيك في قرار مهم",
          theyAsk: "Do you think I should take the new job offer?",
          correct: "If you ask me, we need more time to decide — but it sounds like a great opportunity.",
          wrong1: "Yes take it immediately.",
          wrong2: "Jobs are all the same.",
          wrong3: "Don't ask me anything.",
          explanation: "'If you ask me' دەستپێکردنێکی نەرمە بۆ پێدانی ئامۆژگاری و ڕاگەیاندنی بۆچوون لە گفتوگۆی ئاساییدا",
          explanationAr: "'If you ask me' مقدمة لطيفة لتقديم النصيحة والتعبير عن الرأي في المحادثات اليومية",
        },
      ],
    },
    "مشاركة الآراء",
  ),

  buildLesson(
    "Agreeing & Pushing Back",
    "ڕازیبوون و ناڕازیبوون (بە ئەدەبەوە)",
    [
      { en: "I couldn't agree with you more.", ku: "سەد لە سەد لەگەڵت هاوڕام.", ar: "أتفق معك تماماً." },
      { en: "That's a fair point — I hadn't thought of that.", ku: "ئەوە خاڵێکی بەجێیە — من بیرم لەوە نەکردبووەوە.", ar: "هذه نقطة وجيهة — لم أفكر في ذلك." },
      { en: "You're absolutely right about the deadline.", ku: "تۆ بە تەواوی ڕاست دەکەیت دەربارەی وادەی کۆتایی.", ar: "أنت محق تماماً بشأن الموعد النهائي." },
      { en: "I see what you mean, but I'm not sure yet.", ku: "تێدەگەم مەبەستت چییە، بەڵام هێشتا دڵنیا نیم.", ar: "أفهم ما تعنيه، لكنني لست متأكداً بعد." },
      { en: "I partly agree, though I'd add one thing.", ku: "بەشێکی هاوڕام، هەرچەندە حەز دەکەم شتێک زیاد بکەم.", ar: "أوافق جزئياً، لكنني أود أن أضيف شيئاً واحداً." },
      { en: "Let's agree to disagree on this one.", ku: "با ڕازی بین لەسەر ئەوەی کە هاوڕا نین لەمەدا.", ar: "لنتفق على أننا نختلف في هذا الأمر." },
    ],
    {
      convos: [
        {
          situation: "هاوکارێکت خاڵێکی زۆر باش دەخاتە ڕوو",
          situationAr: "زميلك يطرح نقطة جيدة جداً",
          theyAsk: "The deadline is too tight — we need more time to do this correctly.",
          correct: "You're absolutely right about the deadline. That's a fair point I hadn't thought of.",
          wrong1: "Deadline is fine stop complaining.",
          wrong2: "I don't work with deadlines.",
          wrong3: "Not my problem.",
          explanation: "'You're absolutely right' و 'fair point' — باشترین شێوازن بۆ پێدانی ماف بە کەسی بەرامبەر",
          explanationAr: "'You're absolutely right' و'fair point' — أفضل التعبيرات للاعتراف بصواب الطرف الآخر",
        },
        {
          situation: "جیاوازی بۆچوونێکی تەواو لەسەر بابەتێک",
          situationAr: "اختلاف تام في الرأي حول موضوع ما",
          theyAsk: "I think we should spend our entire budget on marketing.",
          correct: "I partly agree, though I'd add one thing — we should improve the product first.",
          wrong1: "Marketing is waste of money.",
          wrong2: "Spend everything on ads.",
          wrong3: "I hate marketing talk.",
          explanation: "'Partly agree' بەکاردێت کاتێک دەتەوێت خاڵێکی تر زیاد بکەیت بەبێ ئەوەی بەتەواوی بۆچوونەکەی ڕەت بکەیتەوە",
          explanationAr: "'Partly agree' يُستخدم عندما تريد إضافة نقطة أخرى دون رفض رأي الآخر بالكامل",
        },
      ],
    },
    "الموافقة والاعتراض بأدب",
  ),

  buildLesson(
    "Light Humor",
    "گاڵتەی سووک (ڕۆژانە)",
    [
      { en: "I'm just messing with you — don't worry.", ku: "تەنیا گاڵتەت لەگەڵ دەکەم — خەمت نەبێت.", ar: "أنا أمزح معك فقط — لا تقلق." },
      { en: "That went better than I expected, honestly.", ku: "ڕاستگۆ بم، لەوە باشتر ڕۆیشت کە چاوەڕێم دەکرد.", ar: "بصراحة، سار الأمر أفضل مما توقعت." },
      { en: "Well, that was awkward — let's move on.", ku: "باشە، ئەوە کەمێک شەرمەزارکەر (نەگونجاو) بوو — با تێپەڕین.", ar: "حسناً، كان ذلك محرجاً — لننتقل إلى شيء آخر." },
      { en: "I have to admit, that was pretty funny.", ku: "دەبێت دان بەوەدا بنێم، ئەوە زۆر پێکەنیناوی بوو.", ar: "يجب أن أعترف، كان ذلك مضحكاً جداً." },
      { en: "Classic me — always forgetting something.", ku: "ئەمە عادەتی خۆمە (کلاسیکی من) — هەمیشە شتێک لەبیر دەکەم.", ar: "هذا أنا كعادتي — دائماً أنسى شيئاً ما." },
      { en: "You're killing me — that's hilarious.", ku: "دەمکوژیت لە پێکەنیندا — ئەوە زۆر کۆمیدییە.", ar: "ستقتلني من الضحك — هذا مضحك للغاية." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت وایزانی قسەیەکەت بەڕاست بووە",
          situationAr: "صديقك ظنّ أنك كنت جاداً فيما قلته",
          theyAsk: "Wait, you're not actually making me pay for everything, right?",
          correct: "I'm just messing with you! Don't worry, we are splitting the bill.",
          wrong1: "Never joke with me again.",
          wrong2: "I don't understand jokes.",
          wrong3: "You are not funny person.",
          explanation: "'Just messing with you' زۆر باوتر و سروشتیترە لە وتنی 'I am joking'",
          explanationAr: "'Just messing with you' أكثر شيوعاً وطبيعية من قول 'I am joking'",
        },
        {
          situation: "تۆ بە هەڵە قاوەت ڕشت و دەتەوێت دۆخەکە ئاسایی بکەیتەوە",
          situationAr: "سكبتَ القهوة بالخطأ وتريد تخفيف الموقف",
          theyAsk: "Oh no! Did you just spill coffee all over your own desk?",
          correct: "Well, that was awkward. Classic me — always dropping or forgetting something.",
          wrong1: "Everyone is laughing at me.",
          wrong2: "Meeting is cancelled forever.",
          wrong3: "I leave country now.",
          explanation: "'Classic me' ڕێگەیەکی زۆر جوانە بۆ ئەوەی گاڵتە بە هەڵەی خۆت بکەیت و دۆخەکە نەرم بکەیتەوە",
          explanationAr: "'Classic me' طريقة رائعة للسخرية من أخطائك وتخفيف حدة الموقف",
        },
      ],
    },
    "الفكاهة الخفيفة",
  ),

  buildLesson(
    "Networking Small Talk",
    "دروستکردنی پەیوەندی لە کاردا",
    [
      { en: "What line of work are you in?", ku: "لە چ بوارێکی کاردا کار دەکەیت؟", ar: "في أي مجال تعمل؟" },
      { en: "How did you get into this field?", ku: "چۆن دەستت بەم بوارە کرد (چۆن چوویتە ناوی)؟", ar: "كيف دخلت هذا المجال؟" },
      { en: "I'd love to stay in touch after this event.", ku: "حەز دەکەم دوای ئەم بۆنەیە لە پەیوەندیدا بمێنینەوە.", ar: "أودّ أن نبقى على تواصل بعد هذا الحدث." },
      { en: "Do you mind if I connect with you on LinkedIn?", ku: "لات ئاساییە ئەگەر لە خزمەتگوزاری لینکدین پەیوەندیت لەگەڵ ببەستم؟", ar: "هل تمانع إذا تواصلت معك على لينكدإن؟" },
      { en: "It was great meeting you — here's my card.", ku: "زۆر خۆشحاڵ بووم بە ناسینت — فەرموو ئەمە کارتمە.", ar: "سعدت بلقائك — تفضّل هذه بطاقتي." },
      { en: "What brings you to this conference?", ku: "چی تۆی هێناوە بۆ ئەم کۆنفرانسە؟", ar: "ما الذي أتى بك إلى هذا المؤتمر؟" },
    ],
    {
      convos: [
        {
          situation: "لە بۆنەیەکی پیشەییدا کەسێکی نوێ دەناسیت",
          situationAr: "تتعرف على شخص جديد في مناسبة مهنية",
          theyAsk: "Hi, I'm Alex — I don't think we've met before.",
          correct: "Nice to meet you, Alex. What line of work are you in? I'd love to stay in touch after this event.",
          wrong1: "Who are you go away.",
          wrong2: "I don't talk to strangers.",
          wrong3: "Give me job now.",
          explanation: "'What line of work are you in?' زۆر باوتر و پیشەییترە لە پرسیارکردنی 'What is your job?'",
          explanationAr: "'What line of work are you in?' أكثر شيوعاً واحترافية من سؤال 'What is your job?'",
        },
        {
          situation: "کۆتایی‌هێنان بە گفتوگۆیەکی کورت لەگەڵ کەسێک کە کەمێک پێش ئێستا ناسیت",
          situationAr: "إنهاء محادثة قصيرة مع شخص تعرفت عليه قبل قليل",
          theyAsk: "Well, I should probably mingle a bit more and see the other booths.",
          correct: "It was great meeting you — here's my card. Do you mind if I connect with you on LinkedIn?",
          wrong1: "Bye no contact.",
          wrong2: "Your card is useless.",
          wrong3: "I hate LinkedIn.",
          explanation: "'Connect on LinkedIn' و 'here's my card' باشترین ڕێگان بۆ هێشتنەوەی پەیوەندی بە مەبەستی کار لە داهاتوودا",
          explanationAr: "'Connect on LinkedIn' و'here's my card' أفضل الطرق للحفاظ على التواصل المهني مستقبلاً",
        },
      ],
    },
    "المحادثات القصيرة في بناء العلاقات المهنية",
  ),

  buildLesson(
    "Fluent Goodbye",
    "ماڵئاوایی ڕەوان",
    [
      { en: "It's been a pleasure talking with you.", ku: "زۆر خۆشحاڵ بووم بە قسەکردن لەگەڵت.", ar: "كان من دواعي سروري التحدث معك." },
      { en: "I really appreciate everything you've shared.", ku: "بەڕاستی سوپاسگوزارم بۆ هەموو ئەوەی کە باست کردووە.", ar: "أقدّر حقاً كل ما شاركته معي." },
      { en: "Let's definitely keep in touch.", ku: "با بە دڵنیاییەوە لە پەیوەندیدا بمێنینەوە.", ar: "لنبقَ على تواصل بالتأكيد." },
      { en: "I feel much more confident speaking now.", ku: "ئێستا زۆر زیاتر متمانەم بە قسەکردنی خۆم هەیە.", ar: "أشعر بثقة أكبر بكثير في التحدث الآن." },
      { en: "Thanks for pushing me out of my comfort zone.", ku: "سوپاس بۆ ئەوەی هانت دام شتی نوێ تاقی بکەمەوە (لە بازنەی ئارامیم دەرمهێنای).", ar: "شكراً لأنك دفعتني للخروج من منطقة راحتي." },
      { en: "Same time next week? I'd love that.", ku: "هەمان کاتی هەفتەی داهاتوو؟ زۆر حەز بەوە دەکەم.", ar: "في نفس الوقت الأسبوع القادم؟ سأحب ذلك." },
    ],
    {
      convos: [
        {
          situation: "کۆتایی گفتوگۆیەکی درێژ لەگەڵ هاوڕێیەکی بیانی",
          situationAr: "إنهاء محادثة طويلة مع صديق أجنبي",
          theyAsk: "Well, I should probably head out — great chat!",
          correct: "It's been a pleasure talking with you. Let's definitely keep in touch — same time next week?",
          wrong1: "Finally you leave.",
          wrong2: "Don't contact me again.",
          wrong3: "Chat was boring.",
          explanation: "'It's been a pleasure' و 'keep in touch' — ماڵئاواییەکی گەرم و زۆر باوە",
          explanationAr: "'It's been a pleasure' و'keep in touch' — وداع دافئ وشائع جداً",
        },
        {
          situation: "دوای تەواوکردنی کۆرسێکی زمان و قسەکردن بە ئینگلیزی",
          situationAr: "بعد إتمام دورة لغوية والتحدث بالإنجليزية",
          theyAsk: "You've improved so much since we started chatting!",
          correct: "I feel much more confident speaking now. Thanks for pushing me out of my comfort zone.",
          wrong1: "English is impossible forever.",
          wrong2: "I learned nothing.",
          wrong3: "Delete the app.",
          explanation: "'Comfort zone' دەستەواژەیەکە بەکاردێت بۆ ئەو شتانەی کە مرۆڤ ڕاهاتووە لەسەریان و ئاسانن بۆی. هاتنە دەرەوە لێی واتە گەشەکردن",
          explanationAr: "'Comfort zone' تعبير يُستخدم للأشياء التي اعتاد عليها المرء وأصبحت سهلة. الخروج منها يعني النمو والتطور",
        },
      ],
    },
    "الوداع بطلاقة",
  ),
];

export default unit13;