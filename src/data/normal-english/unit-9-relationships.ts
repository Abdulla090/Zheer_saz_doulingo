import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 9: Relationships & Feelings — 10 unique lessons ───────────────────
// How to express emotions, boundaries, support, and navigate relationships.

const unit09: UnitBank = [
  buildLesson(
    "Making Friends",
    "دروستکردنی هاوڕێیەتی",
    [
      { en: "I really enjoyed talking to you today.", ku: "ئەمڕۆ زۆر چێژم لە قسەکردن لەگەڵت وەرگرت." },
      { en: "We should hang out again sometime.", ku: "دەبێت جارێکی تر بێینە دەرەوە و کات بەسەر ببەین." },
      { en: "You seem like someone I'd get along with.", ku: "پێدەچێت کەسێک بیت کە بتوانم لەگەڵتدا بگونجێم." },
      { en: "Want to grab coffee and chat more?", ku: "دەتەوێت قاوەیەک بخۆینەوە و زیاتر قسە بکەین؟" },
      { en: "I'm still pretty new here — nice to meet you.", ku: "هێشتا لێرە نوێم — خۆشحاڵم بە ناسینت." },
      { en: "Let's exchange numbers and keep in touch.", ku: "با ژمارە ئاڵوگۆڕ بکەین و لە پەیوەندیدا بین." },
    ],
    {
      convos: [
        {
          situation: "لە بۆنەیەکی کۆمەڵایەتیدا کەسێکی نوێ دەناسیت",
          theyAsk: "It was great meeting you at the language exchange!",
          correct: "I really enjoyed talking to you too. We should hang out again sometime — want to grab coffee?",
          wrong1: "I don't want meet again.",
          wrong2: "You talk too much.",
          wrong3: "Goodbye forever.",
          explanation: "'We should hang out again' و 'want to grab coffee?' — باوترین ڕێگەیە بۆ پێشنیارکردنی بینینەوەیەکی تر",
        },
        {
          situation: "تازە گواستراویتەوە بۆ شارێکی نوێ",
          theyAsk: "How are you settling in so far?",
          correct: "I'm still pretty new here, but everyone's been friendly. Nice to meet people like you!",
          wrong1: "I hate this city.",
          wrong2: "Nobody talks to me.",
          wrong3: "New city is scary.",
          explanation: "'I'm still pretty new here' — ڕێگەیەکی زۆر سروشتییە بۆ ڕوونکردنەوەی بارودۆخەکەت",
        },
      ],
    },
  ),

  buildLesson(
    "Expressing Feelings",
    "دەربڕینی هەستەکان",
    [
      { en: "I've been feeling a bit overwhelmed lately.", ku: "لەم دواییانەدا کەمێک هەست بە پەستان (قورسایی) دەکەم." },
      { en: "Honestly, I'm really happy about this.", ku: "ڕاستی بڵێم، لەمە زۆر دڵخۆشم." },
      { en: "Something's been bothering me for a while.", ku: "ماوەیەکە شتێک بێزارم دەکات." },
      { en: "I didn't expect to feel this nervous.", ku: "چاوەڕێم نەدەکرد ئەوەندە شڵەژاو بم." },
      { en: "It's hard to put my feelings into words.", ku: "قورسە هەستەکانم بخەمە چوارچێوەی وشەوە." },
      { en: "I feel like a weight has been lifted.", ku: "هەست دەکەم بارێکی قورس لە کۆڵم بووەوە." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت دەپرسێت چۆنیت",
          theyAsk: "You seem quiet today — everything okay?",
          correct: "Honestly, I've been feeling a bit overwhelmed lately. Something's been bothering me for a while.",
          wrong1: "I am fine nothing wrong.",
          wrong2: "Don't ask me questions.",
          wrong3: "Everything is perfect always.",
          explanation: "'Feeling overwhelmed' — وشەیەکی زۆر باوە بۆ دەربڕینی هەستکردن بە قورسایی کار یان بیرکردنەوە",
        },
        {
          situation: "دوای چارەسەرکردنی کێشەیەکی گەورە",
          theyAsk: "How do you feel now that it's resolved?",
          correct: "I feel like a weight has been lifted. I didn't expect to feel this relieved.",
          wrong1: "Still very angry.",
          wrong2: "Problem is same.",
          wrong3: "I don't feel anything.",
          explanation: "'A weight has been lifted' ئیدیۆمێکی زۆر بەناوبانگە بە واتای ئارامبوونەوە لە دوای فشارێکی زۆر",
        },
      ],
    },
  ),

  buildLesson(
    "Showing Support",
    "پشتگیری کردنی کەسانی تر",
    [
      { en: "I'm here for you no matter what.", ku: "لە هەر بارودۆخێکدا بێت من لەگەڵتم." },
      { en: "That sounds really tough — I'm sorry.", ku: "ئەوە زۆر سەخت دیارە — زۆر بەداخەوەم." },
      { en: "Take all the time you need to heal.", ku: "هەموو ئەو کاتە وەربگرە کە پێویستتە بۆ چاکبوونەوە." },
      { en: "You're not alone in this.", ku: "تۆ لەمەدا بەتەنیا نیت." },
      { en: "I believe in you — you've got this.", ku: "متمانەم پێتە — تۆ دەتوانیت ئەمە بکەیت." },
      { en: "Let me know if you need anything at all.", ku: "ئەگەر هەر شتێکت پێویست بوو پێم بڵێ." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت بەدەست کێشەیەکەوە دەناڵێنێت",
          theyAsk: "I just found out my grandma is in the hospital.",
          correct: "That sounds really tough — I'm sorry. I'm here for you no matter what. Let me know if you need anything.",
          wrong1: "Hospitals are normal.",
          wrong2: "Don't be sad.",
          wrong3: "I have no time to help.",
          explanation: "'That sounds really tough' ڕێگەیەکی زۆر بەهێزە بۆ هاوسۆزی پێش ئەوەی ئامۆژگاری بدەیت",
        },
        {
          situation: "هاوکارێکت پێش چاوپێکەوتنێکی گرنگ شڵەژاوە",
          theyAsk: "I'm so nervous about tomorrow's presentation.",
          correct: "I believe in you — you've got this. You're not alone — we can practice together tonight.",
          wrong1: "You will fail probably.",
          wrong2: "Presentations are easy.",
          wrong3: "Don't talk to me about work.",
          explanation: "'You've got this' زاراوەیەکی زۆر باوە بۆ هاندانی کەسێک پێش ئەنجامدانی کارێکی قورس",
        },
      ],
    },
  ),

  buildLesson(
    "Dating & Romance",
    "خۆشەویستی و ژوان",
    [
      { en: "I'd love to take you out sometime.", ku: "حەز دەکەم کاتێک بتبەمە دەرەوە." },
      { en: "I had a really great time on our date.", ku: "کاتێکی زۆر خۆشم بەسەربرد لە ژوانەکەماندا." },
      { en: "You make me smile every time we talk.", ku: "هەر جارێک قسە دەکەین وام لێ دەکەیت زەردەخەنە بکەم." },
      { en: "I'm not looking for anything serious right now.", ku: "لە ئێستادا بەدوای پەیوەندییەکی جددیدا ناگەڕێم." },
      { en: "I think we'd make a great team.", ku: "پێم وایە ئێمە تیمێکی نایاب دەبین پێکەوە." },
      { en: "Can I be honest about how I feel?", ku: "دەتوانم ڕاستگۆ بم دەربارەی هەستەکانم؟" },
    ],
    {
      convos: [
        {
          situation: "دوای یەکەم ژوان (دەرچوون)",
          theyAsk: "Did you get home safely?",
          correct: "Yes, thanks! I had a really great time on our date. I'd love to do it again.",
          wrong1: "Date was boring.",
          wrong2: "Don't text me.",
          wrong3: "Home is far.",
          explanation: "'I had a really great time' باشترین وەڵامە ئەگەر دەتەوێت دووبارە کەسەکە ببینیەوە",
        },
        {
          situation: "دەتەوێت ڕاستگۆ بیت لەسەر هەستەکانت",
          theyAsk: "We've been seeing each other for a few weeks now.",
          correct: "Can I be honest about how I feel? I think we'd make a great team — I really like where this is going.",
          wrong1: "I don't like you.",
          wrong2: "Stop seeing me.",
          wrong3: "Feelings are not important.",
          explanation: "'Can I be honest about how I feel?' دەستپێکێکی نایابە بۆ قسەکردن لەسەر شتێکی هەستیار",
        },
      ],
    },
  ),

  buildLesson(
    "Family Talk",
    "قسەکردن لەسەر خێزان",
    [
      { en: "My parents are visiting next month.", ku: "دایک و باوكم مانگی داهاتوو سەردانم دەکەن." },
      { en: "I need to call my sister back tonight.", ku: "پێویستە ئەمشەو تەلەفۆن بۆ خوشکەکەم بکەمەوە." },
      { en: "Family dinners can get pretty loud at our house.", ku: "ئێوارەخوانەکانی خێزان لە ماڵماندا زۆر ژاوەژاوی تێدایە." },
      { en: "I'm the oldest, so I help with the kids a lot.", ku: "من گەورەترینم، بۆیە زۆر یارمەتی منداڵەکان دەدەم." },
      { en: "We try to video call every Sunday.", ku: "هەوڵ دەدەین هەموو یەکشەممەیەک بە ڤیدیۆ قسە بکەین." },
      { en: "My brother just got engaged — we're all thrilled.", ku: "براکەم تازە دەستگیرانداری کرد — هەموومان زۆر دڵخۆشین." },
    ],
    {
      convos: [
        {
          situation: "هاوکارێکت دەپرسێت بۆچی ئەم کۆتایی هەفتەیە سەرقاڵیت",
          theyAsk: "Are you free to cover my shift this weekend?",
          correct: "Sorry, my parents are visiting next month and I need to get the house ready — this weekend is packed.",
          wrong1: "Family is not important.",
          wrong2: "I don't have parents.",
          wrong3: "Weekend I sleep only.",
          explanation: "باسکردنی خێزان بە شێوازی ئاسایی — 'parents are visiting' زۆر باوە",
        },
        {
          situation: "هاوڕێیەکت دەپرسێت پەیوەندیت چۆنە لەگەڵ برا و خوشکەکانت",
          theyAsk: "How's your relationship with your siblings?",
          correct: "Pretty good! My brother just got engaged — we're all thrilled. We try to video call every Sunday.",
          wrong1: "I hate my siblings.",
          wrong2: "Brother is bad person.",
          wrong3: "We never talk.",
          explanation: "'Got engaged' بەکاردێت بۆ دەستگیرانداری | 'siblings' واتای برا و خوشکەکان پێکەوە دەگەیەنێت",
        },
      ],
    },
  ),

  buildLesson(
    "Disagreements",
    "ناکۆکی و لێک حاڵی نەبوون",
    [
      { en: "I hear what you're saying, but I disagree.", ku: "گوێم لە قسەکانتە، بەڵام هاوڕا نیم." },
      { en: "I didn't mean to hurt your feelings.", ku: "مەبەستم ئەوە نەبوو هەستت بریندار بکەم." },
      { en: "Can we talk about this calmly?", ku: "دەتوانین بە ئارامی لەسەر ئەمە قسە بکەین؟" },
      { en: "I think we're both a little frustrated.", ku: "پێم وایە هەردووکمان کەمێک بێزار بووین." },
      { en: "I want to understand your side better.", ku: "دەمەوێت باشتر لە لایەنەکەی تۆ تێبگەم." },
      { en: "Let's not go to bed angry.", ku: "با بە تووڕەییەوە نەخەوین." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت تووڕەیە چونکە شتێکت پێ نەوتووە",
          theyAsk: "I can't believe you didn't tell me about the trip!",
          correct: "I hear what you're saying, but I didn't mean to hurt your feelings. Can we talk about this calmly?",
          wrong1: "You are too sensitive.",
          wrong2: "Trip is my business only.",
          wrong3: "Stop talking to me.",
          explanation: "'I hear what you're saying' باشترین ڕێگەیە بۆ دامرکاندنەوەی تووڕەیی پێش ئەوەی وەڵام بدەیتەوە",
        },
        {
          situation: "لەگەڵ هاوسەرەکەت دەمەقاڵێتە لەسەر کاری ماڵ",
          theyAsk: "You always leave the dishes for me!",
          correct: "I think we're both a little frustrated. I want to understand your side better — let's figure this out together.",
          wrong1: "Dishes are your job.",
          wrong2: "I do everything already.",
          wrong3: "Leave the house.",
          explanation: "'Understand your side' و 'figure this out together' کێشەکە دەکاتە کێشەیەکی هاوبەش نەک شەڕ",
        },
      ],
    },
  ),

  buildLesson(
    "Emotional Intelligence",
    "زیرەکی سۆزداری",
    [
      { en: "I appreciate you opening up to me.", ku: "سوپاسگوزارم کە قسەی دڵت بۆ کردم (کراوە بوویت لەگەڵم)." },
      { en: "It's okay to not be okay sometimes.", ku: "ئاساییە کە هەندێک جار باش نەبیت." },
      { en: "Your feelings are completely valid.", ku: "هەستەکانت بەتەواوی ڕەوا و دروستن." },
      { en: "I'm not trying to fix you — just listen.", ku: "هەوڵ نادەم کێشەکەت چارەسەر بکەم — تەنها گوێت لێ دەگرم." },
      { en: "Thank you for trusting me with this.", ku: "سوپاس کە متمانەت پێم کرد بۆ وتنی ئەمە." },
      { en: "Would it help to talk it through together?", ku: "ئایا یارمەتیدەر دەبێت ئەگەر پێکەوە قسەی لەسەر بکەین؟" },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت نهێنییەکی قورس و هەستیارت پێ دەڵێت",
          theyAsk: "I've never told anyone this before...",
          correct: "Thank you for trusting me with this. I'm not trying to fix you — just listen. Your feelings are completely valid.",
          wrong1: "That is not a big problem.",
          wrong2: "You should not feel that way.",
          wrong3: "Tell someone else.",
          explanation: "'Opening up' و 'trusting me' نیشانی دەدەن کە تۆ بەڕاستی گرنگی دەدەیت و دادوەری ناکەیت",
        },
        {
          situation: "کەسێکی نزیکت هەست بە بێهیوایی دەکات لە خۆی",
          theyAsk: "I feel like I should be over this by now.",
          correct: "It's okay to not be okay sometimes. Would it help to talk it through together?",
          wrong1: "Get over it faster.",
          wrong2: "Sadness is weakness.",
          wrong3: "Stop feeling sad.",
          explanation: "'It's okay to not be okay' ئیدیۆمێکی زۆر بەناوبانگە لە دەروونناسیدا بۆ دڵنەواییدان",
        },
      ],
    },
  ),
];

export default unit09;
