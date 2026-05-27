import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 8: Digital Life — 10 unique lessons ─────────────────────────────────
// Texting, email, social media, and online communication — casual and professional.

const unit08: UnitBank = [
  buildLesson(
    "Texting Basics",
    "نامەنووسینی ئاسایی",
    [
      { en: "Hey, are you free to talk later?", ku: "سڵاو، ئایا دواتر کاتت هەیە بۆ قسەکردن؟" },
      { en: "Just checking in — how's your day going?", ku: "تەنها دەمویست بزانم — ڕۆژەکەت چۆنە؟" },
      { en: "Sorry, I missed your call — what's up?", ku: "ببوورە، پەیوەندیتم لەدەستدا — چی هەیە؟" },
      { en: "Can you send me the address when you get a chance?", ku: "دەتوانیت ناونیشانەکەم بۆ بنێریت کاتێک بۆت هات؟" },
      { en: "Got it — I'll be there in ten minutes.", ku: "تێگەیشتم — لە دە خولەکدا دەگەم." },
      { en: "Running a bit late, be there soon!", ku: "کەمێک دواکەوتم، بەم زووانە دەگەم!" },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت نامەیەک دەنێرێت بۆ دڵنیابوونەوە",
          theyAsk: "Hey! Still good for lunch today?",
          correct: "Yep, still on! Running a bit late though — be there in ten minutes.",
          wrong1: "I don't know about lunch.",
          wrong2: "Lunch is cancelled forever.",
          wrong3: "What is lunch?",
          explanation: "'Running a bit late' و 'be there soon' زۆر باون لە نامەنووسیدا بۆ دواکەوتن",
        },
        {
          situation: "هاوکارێک ناونیشانی شوێنی کۆبوونەوە داوات لێدەکات",
          theyAsk: "Where exactly are we meeting for the interview prep?",
          correct: "Can you send me the address when you get a chance? I'll share it with the team.",
          wrong1: "Meet somewhere in city.",
          wrong2: "I don't have address.",
          wrong3: "You find address yourself.",
          explanation: "'When you get a chance' — شێوەیەکی نەرمە بۆ داواکردن لە نامەدا",
        },
      ],
    },
  ),

  buildLesson(
    "Quick Replies",
    "وەڵامە خێراکان",
    [
      { en: "Sounds good — see you then!", ku: "باشە — ئەو کاتە دەبینینەوە!" },
      { en: "On my way now.", ku: "ئێستا لە ڕێگادام." },
      { en: "Can't talk right now — I'll text you back.", ku: "ئێستا ناتوانم قسە بکەم — دواتر نامەت دەنێرم." },
      { en: "Thanks for letting me know!", ku: "سوپاس بۆ ئاگادارکردنم!" },
      { en: "Will do — thanks!", ku: "ئەنجام دەدەم — سوپاس!" },
      { en: "LOL, that's hilarious.", ku: "هاها، زۆر پێکەنیناویە." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەک کات و شوێنی کۆبوونەوە دەنێرێت",
          theyAsk: "Movie starts at 7:30 — meet at the lobby?",
          correct: "Sounds good — see you then! On my way now.",
          wrong1: "Movie is at eight maybe.",
          wrong2: "I don't like lobby.",
          wrong3: "Maybe I come maybe not.",
          explanation: "'On my way' و 'see you then' وەڵامە خێرا و ئاساییەکانن",
        },
        {
          situation: "مامۆستایەکت لە ڕێگادا نامە دەنێرێت",
          theyAsk: "Please submit your essay before midnight tonight.",
          correct: "Will do — thanks! I'll send it in a couple of hours.",
          wrong1: "Essay is hard.",
          wrong2: "Midnight is too early.",
          wrong3: "I forget about essay.",
          explanation: "'Will do' واتای 'ئەنجام دەدەم' — کورت و پیشەیی",
        },
      ],
    },
  ),

  buildLesson(
    "Social Media Posts",
    "پۆستەکانی تۆڕە کۆمەڵایەتییەکان",
    [
      { en: "So excited to share this news with you all!", ku: "زۆر دڵخۆشم کە ئەم هەواڵە لەگەڵ هەمووتاندا هاوبەش دەکەم!" },
      { en: "Throwback to an amazing trip last summer.", ku: "گەڕانەوە بۆ گەشتێکی ناوازەی هاوینەی پێشوو." },
      { en: "Grateful for everyone who showed up today.", ku: "سوپاسگوزارم بۆ هەموو کەسێک کە ئەمڕۆ هات." },
      { en: "Can't believe how fast this year is going.", ku: "باوەڕ ناکەم ئەم ساڵە چەندە خێرا تێدەپەڕێت." },
      { en: "Link in bio if you want to learn more.", ku: "لینک لە بایۆدا هەیە ئەگەر دەتەوێت زیاتر بزانیت." },
      { en: "Drop a comment if you've been here too!", ku: "کۆمێنت بنووسە ئەگەر تۆش لێرە بوویت!" },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت دەپرسێت چۆن پۆستێکی ئاهەنگ بنووسیت",
          theyAsk: "How should I caption my birthday party photos?",
          correct: "Something like 'Grateful for everyone who showed up today' — keep it warm and personal.",
          wrong1: "Write only happy birthday me.",
          wrong2: "No caption is better.",
          wrong3: "Copy from famous person.",
          explanation: "'Grateful for everyone who...' شێوازێکی گەرم و ڕاستەوخۆیە بۆ پۆست",
        },
        {
          situation: "بازرگانی بچووک داوای یارمەتی دەکات بۆ پۆستێکی بەرهەم",
          theyAsk: "I want people to visit our new online store.",
          correct: "Try 'Link in bio if you want to learn more' — it's short and works on every platform.",
          wrong1: "Say buy now buy now.",
          wrong2: "Write long paragraph about store.",
          wrong3: "Don't tell about link.",
          explanation: "'Link in bio' زاراوەیەکی ستانداردە لە ئینستاگرام و تیکتۆک",
        },
      ],
    },
  ),

  buildLesson(
    "Professional Email",
    "ئیمەیڵی پیشەیی",
    [
      { en: "I hope this email finds you well.", ku: "هیوادارم ئەم ئیمەیڵە لە کاتێکی باشدا بگات بەت." },
      { en: "I'm writing to follow up on our conversation.", ku: "دەنووسم بۆ بەدواداچوون لە گفتوگۆکەمان." },
      { en: "Please find the attached document for your review.", ku: "تکایە بەڵگەنامەی پێوەلکاوە بۆ پێداچوونەوە." },
      { en: "I'd appreciate your feedback by Friday if possible.", ku: "سوپاسگوزار دەبم بۆ فیدباکەکەت تا ئەگەر بتوانن هەینی." },
      { en: "Thank you for your time and consideration.", ku: "سوپاس بۆ کات و سەرنجت." },
      { en: "Please let me know if you have any questions.", ku: "تکایە پێم بڵێ ئەگەر هیچ پرسیارێکت هەیە." },
    ],
    {
      convos: [
        {
          situation: "پاش گفتوگۆیەکی کار داوای بەدواداچوون دەکەیت",
          theyAsk: "Hi, what did you need from our call yesterday?",
          correct: "I'm writing to follow up on our conversation. Please find the attached document for your review.",
          wrong1: "Send me answer now.",
          wrong2: "Call was good thanks bye.",
          wrong3: "Where is my document?",
          explanation: "'I'm writing to follow up' — دەستپێکی ستانداردی ئیمەیڵی پیشەیی",
        },
        {
          situation: "ئیمەیڵێک بۆ کڕیار دەنێریت",
          theyAsk: "Can you send over the proposal we discussed?",
          correct: "Please find the attached document for your review. I'd appreciate your feedback by Friday if possible.",
          wrong1: "Proposal is in attachment look.",
          wrong2: "I send later maybe.",
          wrong3: "You must read today.",
          explanation: "'Please find attached' و 'I'd appreciate your feedback by...' زۆر فەرمی و پیشەیین",
        },
      ],
    },
  ),

  buildLesson(
    "Online Meetings",
    "کۆبوونەوەی ئۆنلاین",
    [
      { en: "Can everyone hear me okay?", ku: "دەتوانیت هەمووتان بە باشی بیستم؟" },
      { en: "You're on mute — we can't hear you.", ku: "دەنگت کوژاوەتەوە — ناتوانین بیستین." },
      { en: "Let me share my screen real quick.", ku: "با خێرا شاشەکەم هاوبەش بکەم." },
      { en: "Sorry, my connection dropped for a second.", ku: "ببوورە، پەیوەندییەکەم بۆ چرکەیەک پچڕا." },
      { en: "I'll drop off early but I'll read the notes.", ku: "زوو دەچمە دەرەوە بەڵام تێبینییەکان دەخوێنمەوە." },
      { en: "Let's take this offline and discuss separately.", ku: "با ئەمە لە دەرەوەی کۆبوونەوە بگفتین." },
    ],
    {
      convos: [
        {
          situation: "لە Zoom کۆبوونەوەیەکدا کەسێک قسە دەکات بەڵام دەنگ نییە",
          theyAsk: "So as I was saying about the budget...",
          correct: "Sorry to interrupt — you're on mute, we can't hear you.",
          wrong1: "Stop talking please.",
          wrong2: "Budget is not important.",
          wrong3: "I leave meeting now.",
          explanation: "'You're on mute' گرنگترین جملەیە لە کۆبوونەوەی ئۆنلایندا",
        },
        {
          situation: "بابەتێک تەنها بۆ دوو کەس گرنگە",
          theyAsk: "Should we go over the salary details in this meeting?",
          correct: "Let's take this offline and discuss separately — the rest of the team doesn't need to hear it.",
          wrong1: "Talk salary loud for everyone.",
          wrong2: "Never discuss salary.",
          wrong3: "End meeting immediately.",
          explanation: "'Take this offline' واتای گفتوگۆ لە دەرەوەی کۆبوونەوە — زۆر باوە لە کاردا",
        },
      ],
    },
  ),

  buildLesson(
    "Comments & Reactions",
    "کۆمێنت و کاردانەوە",
    [
      { en: "Congrats — you totally deserve this!", ku: "پیرۆزە — تۆ بە تەواوی شایانی ئەمەی!" },
      { en: "This made my day — thanks for sharing.", ku: "ڕۆژەکەم گۆڕی — سوپاس بۆ هاوبەشکردن." },
      { en: "Love this — where did you get it?", ku: "زۆر حەزم لێیە — لە کوێت وەرگرت؟" },
      { en: "Sending good vibes your way!", ku: "هیوای باشت بۆ دەنێرم!" },
      { en: "So proud of you — keep it up!", ku: "زۆر شانازیم — بەردەوام بە!" },
      { en: "Great point — I hadn't thought about that.", ku: "خاڵێکی باش — من بیرم لێ نەکردبوو." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەک پۆستی بەرزکردنەوەی کار دەکات",
          theyAsk: "I just got promoted to team lead!",
          correct: "Congrats — you totally deserve this! So proud of you — keep it up!",
          wrong1: "Promotion is normal thing.",
          wrong2: "Why you not promoted before?",
          wrong3: "I want promotion too.",
          explanation: "'You totally deserve this' و 'so proud of you' کۆمێntە گەرم و ڕاستەقینەکانن",
        },
        {
          situation: "کەسێک وێنەی خواردن هاوبەش دەکات",
          theyAsk: "Tried a new recipe tonight — what do you think?",
          correct: "Love this — where did you get the recipe? This made my day.",
          wrong1: "Food looks bad.",
          wrong2: "I don't eat food.",
          wrong3: "Recipe is wrong.",
          explanation: "'Love this' و 'where did you get it?' گفتوگۆ درێژ دەکەنەوە بە شێوەیەکی ئاسایی",
        },
      ],
    },
  ),

  buildLesson(
    "Group Chats",
    "گفتوگۆی گروپی",
    [
      { en: "Who's bringing snacks to the party?", ku: "کێ خواردنی سووک دەهێنێت بۆ ئاهەنگ؟" },
      { en: "I'll create a poll so we can vote.", ku: "ڕاپرسییەک دروست دەکەم تا دەنگ بدەین." },
      { en: "Sorry for the spam — wrong chat!", ku: "ببوورە بۆ نامە زۆر — چاتی هەڵەم!" },
      { en: "Can we move this to a private message?", ku: "دەتوانین ئەمە بگوازینەوە بۆ نامەی تایبەت؟" },
      { en: "React with a thumbs up if you're in.", ku: "بە پەنجە بەرز ڕێژە بدە ئەگەر بەشداری دەکەیت." },
      { en: "Let's pin the important info at the top.", ku: "با زانیاری گرنگ لە سەرەوە جێگیر بکەین." },
    ],
    {
      convos: [
        {
          situation: "گروپێک پلانی ئاهەنگ دادەنێت",
          theyAsk: "Okay team — we need to figure out food for Saturday.",
          correct: "Who's bringing snacks? I'll create a poll so we can vote on the main dishes too.",
          wrong1: "Everyone bring nothing.",
          wrong2: "Food is not needed.",
          wrong3: "Only I decide food.",
          explanation: "'Who's bringing...?' و 'create a poll' ڕێگەیەکی ڕێک و پێک بۆ گروپ",
        },
        {
          situation: "بابەتێکی تایبەت لە گروپی گشتی دەست پێدەکات",
          theyAsk: "Hey, about that personal issue we talked about...",
          correct: "Can we move this to a private message? The whole group doesn't need to see it.",
          wrong1: "Talk personal things here.",
          wrong2: "Leave group now.",
          wrong3: "Ignore the message.",
          explanation: "'Move this to a private message' — ئەدەبی دیجیتاڵ بۆ بابەتی تایبەت",
        },
      ],
    },
  ),

  buildLesson(
    "Digital Boundaries",
    "سنوورەکانی دیجیتاڵ",
    [
      { en: "I don't check work email after seven.", ku: "دوای حەوت ئیمەیڵی کار ناپشکنم." },
      { en: "Please only text me if it's urgent.", ku: "تکایە تەنها نامەم بنێرە ئەگەر بەپەلە بێت." },
      { en: "I'm taking a social media break this week.", ku: "ئەم هەفتەیە پشووم لە تۆڕە کۆمەڵایەتییەکان دەدەم." },
      { en: "Let's schedule a call instead of texting back and forth.", ku: "با پەیوەندییەک بخەینە خشتە لەجیاتی نامەنووسی." },
      { en: "I saw your message — I'll reply when I'm free.", ku: "نامەکەم بینی — کاتێک کاتم هەبوو وەڵام دەدەمەوە." },
      { en: "Please don't share my number without asking.", ku: "تکایە ژمارەکەم بەبێ پرسیار هاوبەش مەکە." },
    ],
    {
      convos: [
        {
          situation: "هاوکارێک نامە دەنێرێت دوای کاتژمێری کار",
          theyAsk: "Sorry to bother you tonight — can you look at this report?",
          correct: "I saw your message — I'll reply when I'm free tomorrow. I don't check work email after seven.",
          wrong1: "Why you text at night?",
          wrong2: "Report is not my job.",
          wrong3: "Never text me again.",
          explanation: "ڕێکخستنی سنوور بە شێوەیەکی نەرم: 'I'll reply when I'm free' + ڕوونکردنەوەی سنوور",
        },
        {
          situation: "گفتوگۆیەک زۆر درێژ دەبێت لە نامەدا",
          theyAsk: "We have like twenty messages about this bug already.",
          correct: "Let's schedule a call instead of texting back and forth — it'll be faster.",
          wrong1: "Send fifty more messages.",
          wrong2: "Bug is not important.",
          wrong3: "Ignore all messages.",
          explanation: "'Schedule a call instead' — چارەسەرێکی پیشەیی بۆ گفتوگۆی درێژ",
        },
      ],
    },
  ),

  buildLesson(
    "Tech Troubleshooting",
    "چارەسەرکردنی کێشەی تەکنەلۆژیا",
    [
      { en: "Have you tried turning it off and on again?", ku: "تاقیت کردۆتەوە کوژاندنەوە و دووبارە داگیرساندنەوە؟" },
      { en: "My Wi-Fi keeps cutting out.", ku: "وایفایەکەم بەردەوام پچڕانەوە." },
      { en: "The app crashed right when I was submitting.", ku: "ئەپەکە ڕووخا ڕاستەوخۆ کاتێک دەناردەم." },
      { en: "Can you send me a screenshot of the error?", ku: "دەتوانیت وێنەی شاشەی هەڵەکەم بۆ بنێریت؟" },
      { en: "I think I need to update my phone.", ku: "پێم وایە پێویستە مۆبایلەکەم نوێ بکەمەوە." },
      { en: "Let me restart my router and try again.", ku: "با ڕاوتەرەکەم دووبارە داگیرسێنمەوە و هەوڵ بدەمەوە." },
    ],
    {
      convos: [
        {
          situation: "هاوکارێک ناتوانێت بچێتە ناو ئەپەکە",
          theyAsk: "The login page just spins forever — nothing loads.",
          correct: "Have you tried turning it off and on again? Also, can you send me a screenshot of the error?",
          wrong1: "Buy new computer.",
          wrong2: "App is always broken.",
          wrong3: "Don't use app anymore.",
          explanation: "'Have you tried turning it off and on again?' — یەکەم پرسیاری IT لە هەموو شوێنێک",
        },
        {
          situation: "لە ماڵەوە کاری دوورەوە دەکەیت و ئینتەرنێت لاوازە",
          theyAsk: "Your video keeps freezing on the call.",
          correct: "Sorry — my Wi-Fi keeps cutting out. Let me restart my router and try again.",
          wrong1: "Your internet is bad not mine.",
          wrong2: "Video is not important.",
          wrong3: "I stop working forever.",
          explanation: "'Wi-Fi keeps cutting out' و 'restart my router' — زاراوەی ڕۆژانەی کێشەی ئینتەرنێت",
        },
      ],
    },
  ),

  buildLesson(
    "Digital Etiquette",
    "ئەدەبی دیجیتاڵ",
    [
      { en: "Thanks for adding me to the group!", ku: "سوپاس بۆ زیادکردنم بۆ گروپ!" },
      { en: "Just a heads-up — I'll be offline tomorrow.", ku: "تەنها ئاگاداری — سبەی لەسەر هێڵ نابم." },
      { en: "Please use BCC when emailing the whole list.", ku: "تکایە BCC بەکاربهێنە کاتێک بۆ هەموو لیستەکە ئیمەیڵ دەنێریت." },
      { en: "Double-check before you hit send.", ku: "دووبارە بپشکنە پێش ئەوەی بنێریت." },
      { en: "I prefer email over DMs for work stuff.", ku: "بۆ کارەکان ئیمەیڵم پێ باشترە لە نامەی تایبەت." },
      { en: "Thanks for tagging me — I'll respond soon.", ku: "سوپاس بۆ تاگکردنم — بەم زووانە وەڵام دەدەمەوە." },
    ],
    {
      convos: [
        {
          situation: "ئیمەیڵێکت بۆ لیستێکی گەورە دەنێریت",
          theyAsk: "Should I put everyone in the To field?",
          correct: "Please use BCC when emailing the whole list — it protects everyone's privacy.",
          wrong1: "Put all emails visible.",
          wrong2: "Send separate hundred emails.",
          wrong3: "Don't send email at all.",
          explanation: "BCC = Blind Copy — ئیمەیڵەکان نیشان نادرێن بۆ هەمووان",
        },
        {
          situation: "هاوکارێکت لە پۆستدا تاگت کردووە",
          theyAsk: "Hey, can you review this draft when you get a chance?",
          correct: "Thanks for tagging me — I'll respond soon. Just a heads-up, I'll be offline tomorrow though.",
          wrong1: "Don't tag me ever.",
          wrong2: "Draft is bad.",
          wrong3: "I never review things.",
          explanation: "'Thanks for tagging me' + 'heads-up' — ئەدەبی پیشەیی لە تۆڕە کۆمەڵایەتییەکاندا",
        },
      ],
    },
  ),
];

export default unit08;
