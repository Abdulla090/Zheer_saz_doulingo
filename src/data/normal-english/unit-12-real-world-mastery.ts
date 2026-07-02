import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 12: Real-World Mastery — 10 unique lessons ───────────────────────────
// Mixed advanced scenarios: interviews, official documents, neighborhood life.

const unit12: UnitBank = [
  buildLesson(
    "Job Interview Advanced",
    "چاوپێکەوتنی کاری پێشکەوتوو",
    [
      { en: "My greatest strength is adapting quickly under pressure.", ku: "گەورەترین خاڵی بەهێزم خۆگونجاندنە بە خێرایی لەژێر فشاردا.", ar: "أعظم نقاط قوتي هي التكيّف بسرعة تحت الضغط." },
      { en: "I see this role as a chance to grow my leadership skills.", ku: "ئەم پۆستە وەک هەلێک دەبینم بۆ گەشەپێدانی لێهاتوویی سەرکردایەتیم.", ar: "أرى هذا المنصب فرصةً لتطوير مهاراتي القيادية." },
      { en: "In my last role, I led a team of eight people.", ku: "لە کارەکەی پێشوومدا، سەرپەرشتی تیمێکی هەشت کەسیم دەکرد.", ar: "في منصبي السابق، قُدتُ فريقاً مؤلفاً من ثمانية أشخاص." },
      { en: "I'm looking for a company that values innovation.", ku: "بەدوای کۆمپانیایەکدا دەگەڕێم کە بەهای داهێنان دەزانێت.", ar: "أبحث عن شركة تُقدّر الابتكار." },
      { en: "Do you have any concerns about my background?", ku: "ئایا هیچ نیگەرانییەکتان هەیە سەبارەت بە پێشینەی کارکردنم؟", ar: "هل لديكم أي مخاوف بشأن خلفيتي المهنية؟" },
      { en: "I'd welcome the opportunity to prove myself here.", ku: "خۆشحاڵ دەبم بەم دەرفەتە بۆ سەلماندنی خۆم لێرە.", ar: "أرحّب بالفرصة لإثبات نفسي هنا." },
    ],
    {
      convos: [
        {
          situation: "لە کۆتایی چاوپێکەوتنەوە پرسیار دەربارەی خاڵی بەهێز",
          situationAr: "في نهاية المقابلة يُسأل عن نقاط القوة",
          theyAsk: "What would you say is your greatest strength?",
          correct: "My greatest strength is adapting quickly under pressure. In my last role, I led a team of eight through a major product launch.",
          wrong1: "I am strong person always.",
          wrong2: "Strength is not important.",
          wrong3: "I don't know my strengths.",
          explanation: "پێدانی نموونەیەکی کۆنکرێتی دوای باسکردنی خاڵی بەهێزت باشترین شێوازی وەڵامدانەوەیە لە چاوپێکەوتندا",
          explanationAr: "تقديم مثال ملموس بعد ذكر نقطة قوتك هو أفضل أسلوب للإجابة في المقابلات",
        },
        {
          situation: "چاوپێکەوتکار دەپرسێت ئایا تۆ پرسیارت هەیە بۆ ئەوان",
          situationAr: "المُحاوِر يسأل إن كانت لديك أسئلة لهم",
          theyAsk: "Do you have any questions for us before we wrap up?",
          correct: "Yes — do you have any concerns about my background? I'd also love to know how this team handles innovation.",
          wrong1: "No questions goodbye.",
          wrong2: "When do I get paid?",
          wrong3: "Your company is small.",
          explanation: "پرسیارکردن لە نیگەرانییەکانیان دەرفەتت پێدەدات کەموکوڕییەکانت ڕوون بکەیتەوە پێش ئەوەی بڕیار بدەن",
          explanationAr: "السؤال عن مخاوفهم يمنحك فرصة لتوضيح أي نقاط ضعف قبل أن يتخذوا قرارهم",
        },
      ],
    },
    "مقابلة العمل المتقدمة",
  ),

  buildLesson(
    "Official Documents",
    "بەڵگەنامە فەرمییەکان",
    [
      { en: "I need to renew my passport before my trip.", ku: "پێویستە پاسپۆرتەکەم نوێ بکەمەوە پێش گەشتەکەم.", ar: "أحتاج إلى تجديد جواز سفري قبل رحلتي." },
      { en: "Could you tell me which forms I need to fill out?", ku: "دەتوانیت پێم بڵێیت چ فۆرمێک پێویستە پڕ بکەمەوە؟", ar: "هل يمكنك إخباري أيّ النماذج يجب أن أملأها؟" },
      { en: "My appointment is at ten-thirty on Thursday.", ku: "کاتی مەوعیدەکەم لە کاتژمێر دە و نیوە لە ڕۆژی پێنجشەممە.", ar: "موعدي في العاشرة والنصف يوم الخميس." },
      { en: "I brought all the required documents with me.", ku: "هەموو بەڵگەنامە پێویستەکانم لەگەڵ خۆم هێناوە.", ar: "أحضرتُ جميع الوثائق المطلوبة معي." },
      { en: "How long does processing usually take?", ku: "بەزۆری مامەڵەکە (پرۆسەکە) چەند دەخایەنێت؟", ar: "كم يستغرق إتمام المعاملة عادةً؟" },
      { en: "Is there an expedited option for an extra fee?", ku: "ئایا بژاردەیەکی خێرا هەیە بە بڕە پارەی زیاتر؟", ar: "هل يوجد خيار مُستعجَل برسوم إضافية؟" },
    ],
    {
      convos: [
        {
          situation: "لە نووسینگەی پاسپۆرت یان حکومی",
          situationAr: "في مكتب الجوازات أو مكتب حكومي",
          theyAsk: "How can I help you today?",
          correct: "I need to renew my passport before my trip. Could you tell me which forms I need to fill out?",
          wrong1: "Give passport now.",
          wrong2: "Forms are stupid.",
          wrong3: "I don't have ID.",
          explanation: "'Renew my passport' و پرسیارکردن لە 'forms' دەستپێکی زۆربەی مامەڵە فەرمییەکانن لە دەرەوەی وڵات",
          explanationAr: "عبارة 'Renew my passport' والسؤال عن 'forms' هما بداية معظم المعاملات الرسمية في الخارج",
        },
        {
          situation: "کاتت کەمە و دەتەوێت مامەڵەکەت خێرا بێت",
          situationAr: "وقتك ضيّق وتريد إنجاز المعاملة بسرعة",
          theyAsk: "Everything looks good. Standard processing is two to three weeks.",
          correct: "Is there an expedited option for an extra fee? My trip is in ten days.",
          wrong1: "Two weeks is fine no rush.",
          wrong2: "Expedited is scam.",
          wrong3: "Cancel my trip.",
          explanation: "'Expedited option' ئەو بژاردەیەیە کە پارەی زیاتر دەدەیت تا مامەڵەکەت (پاسپۆرت، ڤیزا) زووتر تەواو بێت",
          explanationAr: "'Expedited option' هو الخيار الذي تدفع فيه رسوماً إضافية لإنجاز معاملتك (جواز السفر، التأشيرة) بشكل أسرع",
        },
      ],
    },
    "الوثائق الرسمية",
  ),

  buildLesson(
    "Neighborhood Life",
    "ژیانی گەڕەک و دراوسێیەتی",
    [
      { en: "We just moved in — nice to meet our neighbors!", ku: "تازە گواستمانەوە بۆ ئێرە — خۆشحاڵین بە ناسینی دراوسێکانمان!", ar: "انتقلنا للتو — سعداء بالتعرّف على جيراننا!" },
      { en: "Could you keep the noise down after ten?", ku: "دەتوانیت دوای کاتژمێر دە دەنگەکان کەم بکەیتەوە؟", ar: "هل يمكنك تخفيف الضوضاء بعد العاشرة؟" },
      { en: "The community garden opens every Saturday morning.", ku: "باخچەی گەڕەکەکە هەموو بەیانییەکی شەممە دەکرێتەوە.", ar: "حديقة الحيّ تفتح كل صباح سبت." },
      { en: "We organized a block party for the kids.", ku: "ئاهەنگێکی گەڕەکمان ڕێکخست بۆ منداڵەکان.", ar: "نظّمنا حفلة حيّ للأطفال." },
      { en: "Please pick up after your dog on the sidewalk.", ku: "تکایە پاشماوەی سەگەکەت پاک بکەرەوە لەسەر شۆستەکە.", ar: "من فضلك نظّف مخلّفات كلبك على الرصيف." },
      { en: "Let me know if you need help taking out the trash.", ku: "پێم بڵێ ئەگەر یارمەتیت پێویستە بۆ فڕێدانی زبڵەکان.", ar: "أخبرني إذا كنتَ تحتاج مساعدة في إخراج القمامة." },
    ],
    {
      convos: [
        {
          situation: "دراوسێکەت لە شەودا ژاوەژاوی زۆرە",
          situationAr: "جارك يُصدر ضجيجاً في الليل",
          theyAsk: "Sorry if our music was loud last night.",
          correct: "No worries — could you keep the noise down after ten though? We have little kids.",
          wrong1: "Call police immediately.",
          wrong2: "Music must stop forever.",
          wrong3: "I don't care about noise.",
          explanation: "'Keep the noise down' شێوازێکی زۆر نەرم و ئاساییە بۆ داواکردنی بێدەنگی بێ ئەوەی کێشە دروست بکەیت",
          explanationAr: "عبارة 'Keep the noise down' طريقة مهذبة جداً لطلب الهدوء دون إثارة مشاكل",
        },
        {
          situation: "نوێیت لە گەڕەکێکدا و کەسێک دەناسیت",
          situationAr: "أنت جديد في الحيّ وتتعرّف على أحدهم",
          theyAsk: "Welcome to the neighborhood! Have you met anyone on the street yet?",
          correct: "We just moved in — nice to meet you! Is there a community park or anything for families nearby?",
          wrong1: "We don't talk to neighbors.",
          wrong2: "This street is bad.",
          wrong3: "Move out soon.",
          explanation: "'We just moved in' دەستەواژەی ناساندنی سەرەتاییە بۆ کەسێکی نوێ لە گەڕەک",
          explanationAr: "عبارة 'We just moved in' هي عبارة تعريف أولية لشخص جديد في الحيّ",
        },
      ],
    },
    "حياة الحيّ والجوار",
  ),

  buildLesson(
    "Handling Conflict",
    "مامەڵەکردن لەگەڵ ناکۆکی",
    [
      { en: "I think there's been a misunderstanding.", ku: "پێم وایە لێکتێگەیشتنی هەڵە هەبووە (بەهەڵە تێگەیشتووین).", ar: "أعتقد أنه حصل سوء تفاهم." },
      { en: "Let's find a solution that works for both of us.", ku: "با چارەسەرێک بدۆزینەوە کە بۆ هەردووکمان گونجاو بێت.", ar: "لنجد حلاً يناسب كلينا." },
      { en: "I'm not trying to blame anyone — I want to fix this.", ku: "هەوڵ نادەم تاوان بخەمە پاڵ کەس — دەمەوێت ئەمە چارەسەر بکەم.", ar: "لا أحاول إلقاء اللوم على أحد — أريد حلّ هذا الأمر." },
      { en: "Can we agree to disagree on this point?", ku: "دەتوانین لەسەر ئەوە ڕازی بین کە بۆچوونمان جیاوازە؟", ar: "هل يمكننا أن نتقبّل اختلاف وجهات نظرنا في هذه النقطة؟" },
      { en: "I'd prefer to discuss this in person.", ku: "پێم باشترە ئەمە ڕووبەڕوو گفتوگۆ بکەین.", ar: "أفضّل مناقشة هذا الأمر وجهاً لوجه." },
      { en: "Let's take a break and come back to this.", ku: "با پشوو بدەین و دواتر بگەڕێینەوە سەر ئەم بابەتە.", ar: "لنأخذ استراحة ونعود إلى هذا الموضوع لاحقاً." },
    ],
    {
      convos: [
        {
          situation: "هاوکارێک تووڕەیە و پێی وایە گوێت لە بۆچوونی نەگرتووە",
          situationAr: "زميل غاضب ويعتقد أنك تجاهلت ملاحظاته",
          theyAsk: "You completely ignored my feedback on the report!",
          correct: "I think there's been a misunderstanding. I'm not trying to blame anyone — let's find a solution that works for both of us.",
          wrong1: "Your feedback was bad.",
          wrong2: "I did ignore you.",
          wrong3: "Report is perfect.",
          explanation: "بەکارهێنانی وشەی 'misunderstanding' کێشەکە دەکاتە هەڵەیەکی بێمەبەست لەبری هێرشێکی کەسی",
          explanationAr: "استخدام كلمة 'misunderstanding' يحوّل المشكلة إلى خطأ غير مقصود بدلاً من هجوم شخصي",
        },
        {
          situation: "ناکۆکییەک لە نامەدا گەورە بووە و خەریکە دەبێتە کێشە",
          situationAr: "خلاف عبر البريد الإلكتروني تصاعد وأوشك أن يصبح مشكلة",
          theyAsk: "This email thread is getting out of hand. We are just arguing.",
          correct: "You're right — I'd prefer to discuss this in person. Let's take a break and come back to it tomorrow.",
          wrong1: "Send fifty more emails.",
          wrong2: "Ignore the problem.",
          wrong3: "Quit the job now.",
          explanation: "'Discuss this in person' باشترین چارەسەرە کاتێک گفتوگۆی ئۆنلاین لێکدانەوەی هەڵەی بۆ دەکرێت",
          explanationAr: "'Discuss this in person' هو أفضل حلّ عندما تؤدي المحادثات الإلكترونية إلى سوء فهم",
        },
      ],
    },
    "التعامل مع الخلافات",
  ),

  buildLesson(
    "Asking for Help",
    "داوای یارمەتی کردن",
    [
      { en: "Would you mind giving me a hand with this?", ku: "پێت ناخۆش نییە (یارمەتیم بدەیت) لەمەدا؟", ar: "هل تمانع في مساعدتي في هذا الأمر؟" },
      { en: "I'm completely lost — can you point me in the right direction?", ku: "تەواو وێڵم (سەرم لێ شێواوە) — دەتوانیت ئاراستە دروستەکەم پێشان بدەیت؟", ar: "أنا تائه تماماً — هل يمكنك دلّي على الاتجاه الصحيح؟" },
      { en: "I hate to bother you, but I really need help.", ku: "حەزم نییە بێزارت بکەم، بەڵام بەڕاستی پێویستم بە یارمەتییە.", ar: "أكره إزعاجك، لكنني بحاجة ماسّة إلى المساعدة." },
      { en: "Could you explain that one more time, slowly?", ku: "دەتوانیت جارێکی تر ئەوە ڕوون بکەیتەوە، بە هێواشی؟", ar: "هل يمكنك شرح ذلك مرة أخرى، ببطء؟" },
      { en: "I'd really appreciate any advice you have.", ku: "زۆر سوپاسگوزار دەبم بۆ هەر ئامۆژگارییەک کە هەتە.", ar: "سأكون ممتنّاً جداً لأيّ نصيحة لديك." },
      { en: "Let me know if I can return the favor sometime.", ku: "پێم بڵێ ئەگەر بتوانم کاتێک ئەم چاکەیەت بۆ بگەڕێنمەوە.", ar: "أخبرني إن كان بإمكاني ردّ الجميل يوماً ما." },
    ],
    {
      convos: [
        {
          situation: "لە شارێکی نوێدا بەتەواوی ڕێگات ون کردووە",
          situationAr: "في مدينة جديدة وقد ضللت الطريق تماماً",
          theyAsk: "You look confused — need help?",
          correct: "Yes, I'm completely lost — can you point me in the right direction? I'm trying to find the train station.",
          wrong1: "I am not lost.",
          wrong2: "Train is not real.",
          wrong3: "Don't help me.",
          explanation: "'Completely lost' و 'point me in the right direction' زاراوەی زۆر باون بۆ پرسین لە ناونیشان",
          explanationAr: "عبارتا 'Completely lost' و'point me in the right direction' شائعتان جداً عند السؤال عن الاتجاهات",
        },
        {
          situation: "هاوکارێک یارمەتیتی داوە لە کێشەیەکی کۆمپیوتەردا",
          situationAr: "زميل ساعدك في حلّ مشكلة في الحاسوب",
          theyAsk: "There you go, the software should be working properly now.",
          correct: "Thank you! I really appreciate your help. Let me know if I can return the favor sometime.",
          wrong1: "Do everything for me.",
          wrong2: "Software is easy.",
          wrong3: "Never help others.",
          explanation: "'Return the favor' دەستەواژەیەکە بەکاردێت کاتێک کەسێک چاکەیەکت لەگەڵ دەکات و دەتەوێت تۆش لە داهاتوودا چاکەیەکی بۆ بکەیت",
          explanationAr: "عبارة 'Return the favor' تُستخدم عندما يقدّم لك شخص معروفاً وتريد أن تردّ له الجميل مستقبلاً",
        },
      ],
    },
    "طلب المساعدة",
  ),
];

export default unit12;