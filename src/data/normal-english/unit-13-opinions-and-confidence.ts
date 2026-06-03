import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 13: Opinions & Fluent Confidence — 10 unique lessons ───────────────
// Express yourself clearly: opinions, debates, humor, networking, and real talk.

const unit13: UnitBank = [
  buildLesson(
    "Sharing Opinions",
    "دەربڕینی بۆچوون",
    [
      { en: "In my opinion, we should start with the basics.", ku: "بەپێی بۆچوونم، دەبێت لە بنەڕەتەکانەوە دەست پێ بکەین." },
      { en: "I honestly think this is the better option.", ku: "بەڕاستی پێم وایە ئەمە هەڵبژاردەی باشترە." },
      { en: "From where I stand, the timing could be better.", ku: "لە ڕوانگەی منەوە، کاتەکە دەیتوانی باشتر بێت." },
      { en: "I see your point, but I respectfully disagree.", ku: "تێدەگەم مەبەستت چییە، بەڵام لەگەڵ ڕێزدا هاوڕا نیم." },
      { en: "If you ask me, we need more time to decide.", ku: "ئەگەر لە من بپرسیت، پێویستمان بە کاتی زیاترە بۆ بڕیاردان." },
      { en: "I'm not entirely convinced that's the right move.", ku: "بەتەواوی قەناعەتم نەکردووە کە ئەوە هەنگاوی دروست بێت." },
    ],
    {
      convos: [
        {
          situation: "لە کۆبوونەوەیەکی تیمدا لەسەر پلانێکی نوێ",
          theyAsk: "So should we launch this new feature this month or wait?",
          correct: "In my opinion, we should start with the basics and launch next month when we're fully ready.",
          wrong1: "Launch now no plan.",
          wrong2: "I don't care about launch.",
          wrong3: "Your idea is always wrong.",
          explanation: "'In my opinion' شێوازێکی زۆر باو و پیشەییە بۆ دەستپێکردنی پێشنیارێک بێ ئەوەی فەرز بێت",
        },
        {
          situation: "هاوڕێیەکت داوای بۆچوونت دەکات لەسەر بڕیارێکی گرنگ",
          theyAsk: "Do you think I should take the new job offer?",
          correct: "If you ask me, we need more time to decide — but it sounds like a great opportunity.",
          wrong1: "Yes take it immediately.",
          wrong2: "Jobs are all the same.",
          wrong3: "Don't ask me anything.",
          explanation: "'If you ask me' دەستپێکردنێکی نەرمە بۆ پێدانی ئامۆژگاری و ڕاگەیاندنی بۆچوون لە گفتوگۆی ئاساییدا",
        },
      ],
    },
  ),

  buildLesson(
    "Agreeing & Pushing Back",
    "ڕازیبوون و ناڕازیبوون (بە ئەدەبەوە)",
    [
      { en: "I couldn't agree with you more.", ku: "لەوە زیاتر ناتوانم لەگەڵت هاوڕا بم (تەواو هاوڕام)." },
      { en: "That's a fair point — I hadn't thought of that.", ku: "ئەوە خاڵێکی بەجێیە — من بیرم لەوە نەکردبووەوە." },
      { en: "You're absolutely right about the deadline.", ku: "تۆ بە تەواوی ڕاست دەکەیت دەربارەی وادەی کۆتایی." },
      { en: "I see what you mean, but I'm not sure yet.", ku: "تێدەگەم مەبەستت چییە، بەڵام هێشتا دڵنیا نیم." },
      { en: "I partly agree, though I'd add one thing.", ku: "بەشێکی هاوڕام، هەرچەندە حەز دەکەم شتێک زیاد بکەم." },
      { en: "Let's agree to disagree on this one.", ku: "با ڕازی بین لەسەر ئەوەی کە هاوڕا نین لەمەدا." },
    ],
    {
      convos: [
        {
          situation: "هاوکارێکت خاڵێکی زۆر باش دەخاتە ڕوو",
          theyAsk: "The deadline is too tight — we need more time to do this correctly.",
          correct: "You're absolutely right about the deadline. That's a fair point I hadn't thought of.",
          wrong1: "Deadline is fine stop complaining.",
          wrong2: "I don't work with deadlines.",
          wrong3: "Not my problem.",
          explanation: "'You're absolutely right' و 'fair point' — باشترین شێوازن بۆ پێدانی ماف بە کەسی بەرامبەر",
        },
        {
          situation: "جیاوازی بۆچوونێکی تەواو لەسەر بابەتێک",
          theyAsk: "I think we should spend our entire budget on marketing.",
          correct: "I partly agree, though I'd add one thing — we should improve the product first.",
          wrong1: "Marketing is waste of money.",
          wrong2: "Spend everything on ads.",
          wrong3: "I hate marketing talk.",
          explanation: "'Partly agree' بەکاردێت کاتێک دەتەوێت خاڵێکی تر زیاد بکەیت بەبێ ئەوەی بەتەواوی بۆچوونەکەی ڕەت بکەیتەوە",
        },
      ],
    },
  ),

  buildLesson(
    "Light Humor",
    "گاڵتەی سووک (ڕۆژانە)",
    [
      { en: "I'm just messing with you — don't worry.", ku: "تەنها گاڵتەت لەگەڵ دەکەم — نیگەران مەبە." },
      { en: "That went better than I expected, honestly.", ku: "ڕاستگۆ بم، لەوە باشتر ڕۆیشت کە چاوەڕێم دەکرد." },
      { en: "Well, that was awkward — let's move on.", ku: "باشە، ئەوە کەمێک شەرمەزارکەر (نەگونجاو) بوو — با تێپەڕین." },
      { en: "I have to admit, that was pretty funny.", ku: "دەبێت دان بەوەدا بنێم، ئەوە زۆر پێکەنیناوی بوو." },
      { en: "Classic me — always forgetting something.", ku: "ئەمە عادەتی خۆمە (کلاسیکی من) — هەمیشە شتێک لەبیر دەکەم." },
      { en: "You're killing me — that's hilarious.", ku: "دەمکوژیت لە پێکەنیندا — ئەوە زۆر کۆمیدییە." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت وایزانی قسەیەکەت بەڕاست بووە",
          theyAsk: "Wait, you're not actually making me pay for everything, right?",
          correct: "I'm just messing with you! Don't worry, we are splitting the bill.",
          wrong1: "Never joke with me again.",
          wrong2: "I don't understand jokes.",
          wrong3: "You are not funny person.",
          explanation: "'Just messing with you' زۆر باوتر و سروشتیترە لە وتنی 'I am joking'",
        },
        {
          situation: "تۆ بە هەڵە قاوەت ڕشت و دەتەوێت دۆخەکە ئاسایی بکەیتەوە",
          theyAsk: "Oh no! Did you just spill coffee all over your own desk?",
          correct: "Well, that was awkward. Classic me — always dropping or forgetting something.",
          wrong1: "Everyone is laughing at me.",
          wrong2: "Meeting is cancelled forever.",
          wrong3: "I leave country now.",
          explanation: "'Classic me' ڕێگەیەکی زۆر جوانە بۆ ئەوەی گاڵتە بە هەڵەی خۆت بکەیت و دۆخەکە نەرم بکەیتەوە",
        },
      ],
    },
  ),

  buildLesson(
    "Networking Small Talk",
    "دروستکردنی پەیوەندی لە کاردا",
    [
      { en: "What line of work are you in?", ku: "لە چ بوارێکی کاردا کار دەکەیت؟" },
      { en: "How did you get into this field?", ku: "چۆن دەستت بەم بوارە کرد (چۆن چوویتە ناوی)؟" },
      { en: "I'd love to stay in touch after this event.", ku: "حەز دەکەم دوای ئەم بۆنەیە لە پەیوەندیدا بمێنینەوە." },
      { en: "Do you mind if I connect with you on LinkedIn?", ku: "لات ئاساییە ئەگەر لە خزمەتگوزاری لینکدین پەیوەندیت لەگەڵ ببەستم؟" },
      { en: "It was great meeting you — here's my card.", ku: "زۆر خۆشحاڵ بووم بە ناسینت — فەرموو ئەمە کارتمە." },
      { en: "What brings you to this conference?", ku: "چی تۆی هێناوە بۆ ئەم کۆنفرانسە؟" },
    ],
    {
      convos: [
        {
          situation: "لە بۆنەیەکی پیشەییدا کەسێکی نوێ دەناسیت",
          theyAsk: "Hi, I'm Alex — I don't think we've met before.",
          correct: "Nice to meet you, Alex. What line of work are you in? I'd love to stay in touch after this event.",
          wrong1: "Who are you go away.",
          wrong2: "I don't talk to strangers.",
          wrong3: "Give me job now.",
          explanation: "'What line of work are you in?' زۆر باوتر و پیشەییترە لە پرسیارکردنی 'What is your job?'",
        },
        {
          situation: "کۆتاییهێنان بە گفتوگۆیەکی کورت لەگەڵ کەسێک کە کەمێک پێش ئێستا ناسیت",
          theyAsk: "Well, I should probably mingle a bit more and see the other booths.",
          correct: "It was great meeting you — here's my card. Do you mind if I connect with you on LinkedIn?",
          wrong1: "Bye no contact.",
          wrong2: "Your card is useless.",
          wrong3: "I hate LinkedIn.",
          explanation: "'Connect on LinkedIn' و 'here's my card' باشترین ڕێگان بۆ هێشتنەوەی پەیوەندی بە مەبەستی کار لە داهاتوودا",
        },
      ],
    },
  ),

  buildLesson(
    "Fluent Goodbye",
    "ماڵئاوایی ڕەوان",
    [
      { en: "It's been a pleasure talking with you.", ku: "زۆر خۆشحاڵ بووم بە قسەکردن لەگەڵت." },
      { en: "I really appreciate everything you've shared.", ku: "بەڕاستی سوپاسگوزارم بۆ هەموو ئەوەی کە باست کردووە." },
      { en: "Let's definitely keep in touch.", ku: "با بە دڵنیاییەوە لە پەیوەندیدا بمێنینەوە." },
      { en: "I feel much more confident speaking now.", ku: "ئێستا زۆر زیاتر متمانەم بە قسەکردنی خۆم هەیە." },
      { en: "Thanks for pushing me out of my comfort zone.", ku: "سوپاس بۆ ئەوەی هانت دام شتی نوێ تاقی بکەمەوە (لە بازنەی ئارامیم دەرمهێنای)." },
      { en: "Same time next week? I'd love that.", ku: "هەمان کاتی هەفتەی داهاتوو؟ زۆر حەز بەوە دەکەم." },
    ],
    {
      convos: [
        {
          situation: "کۆتایی گفتوگۆیەکی درێژ لەگەڵ هاوڕێیەکی بیانی",
          theyAsk: "Well, I should probably head out — great chat!",
          correct: "It's been a pleasure talking with you. Let's definitely keep in touch — same time next week?",
          wrong1: "Finally you leave.",
          wrong2: "Don't contact me again.",
          wrong3: "Chat was boring.",
          explanation: "'It's been a pleasure' و 'keep in touch' — ماڵئاواییەکی گەرم و زۆر باوە",
        },
        {
          situation: "دوای تەواوکردنی کۆرسێکی زمان و قسەکردن بە ئینگلیزی",
          theyAsk: "You've improved so much since we started chatting!",
          correct: "I feel much more confident speaking now. Thanks for pushing me out of my comfort zone.",
          wrong1: "English is impossible forever.",
          wrong2: "I learned nothing.",
          wrong3: "Delete the app.",
          explanation: "'Comfort zone' دەستەواژەیەکە بەکاردێت بۆ ئەو شتانەی کە مرۆڤ ڕاهاتووە لەسەریان و ئاسانن بۆی. هاتنە دەرەوە لێی واتە گەشەکردن",
        },
      ],
    },
  ),
];

export default unit13;