import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 13: Opinions & Fluent Confidence — 10 unique lessons ───────────────
// Express yourself clearly: opinions, debates, humor, networking, and real talk.

const unit13: UnitBank = [
  buildLesson(
    "Sharing Opinions",
    "ڕاگەیاندنی بۆچوون",
    [
      { en: "In my opinion, we should start with the basics.", ku: "بەپێی بۆچوونم، دەبێت لە بنەڕەتەکانەوە دەست پێ بکەین." },
      { en: "I honestly think this is the better option.", ku: "ڕاستگۆیانە پێم وایە ئەمە بژاردەی باشترە." },
      { en: "From where I stand, the timing could be better.", ku: "لە ڕوانگەی منەوە، کاتەکە دەتوانێت باشتر بێت." },
      { en: "I see your point, but I respectfully disagree.", ku: "تێدەگەم مەبەستت چییە، بەڵام بە ڕێز جیاوازم." },
      { en: "If you ask me, we need more time to decide.", ku: "ئەگەر لێم بپرسیت، پێویستمان بە کاتی زیاترە بۆ بڕیاردان." },
      { en: "I'm not entirely convinced that's the right move.", ku: "تەواو قەناعتم پێ نەبووە کە ئەوە هەنگاوی دروستە." },
    ],
    {
      convos: [
        {
          situation: "لە کۆبوونەوەیەکی تیمدا لەسەر پلانێک",
          theyAsk: "So should we launch this month or wait?",
          correct: "In my opinion, we should start with the basics and launch next month when we're ready.",
          wrong1: "Launch now no plan.",
          wrong2: "I don't care about launch.",
          wrong3: "Your idea is always wrong.",
          explanation: "'In my opinion' و 'respectfully disagree' — شێوازێکی پیشەییە بۆ بۆچوون بە ڕێز",
        },
        {
          situation: "هاوڕێیەکت داوای بۆچوونت دەکات",
          theyAsk: "Do you think I should take the new job?",
          correct: "If you ask me, we need more time to decide — but it sounds like a great opportunity.",
          wrong1: "Yes take it immediately.",
          wrong2: "Jobs are all the same.",
          wrong3: "Don't ask me anything.",
          explanation: "'If you ask me' دەستپێکردنێکی نەرمە بۆ ڕاگەیاندنی بۆچوون",
        },
      ],
    },
  ),

  buildLesson(
    "Agreeing & Pushing Back",
    "ڕازیبوون و دوورکەوتنەوە",
    [
      { en: "I couldn't agree with you more.", ku: "زیاتر لەوەش ناتوانم لەگەڵت ڕازی بم." },
      { en: "That's a fair point — I hadn't thought of that.", ku: "ئەوە خاڵێکی دادپەروەرانەیە — من بیرم لێ نەکردبوو." },
      { en: "You're absolutely right about the deadline.", ku: "تۆ بە تەواوی ڕاست دەڵێیت دەربارەی کۆتایی کات." },
      { en: "I see what you mean, but I'm not sure yet.", ku: "تێدەگەم مەبەستت چییە، بەڵام هێشتا دڵنیا نیم." },
      { en: "I partly agree, though I'd add one thing.", ku: "بەشێکی ڕازیم، هەرچۆنێک شتێکی تر زیاد دەکەم." },
      { en: "Let's agree to disagree on this one.", ku: "با لەم بابەتەدا ڕازی بین لەسەر ناڕازیبوون." },
    ],
    {
      convos: [
        {
          situation: "هاوکارێکت ڕاستی دەکاتەوە",
          theyAsk: "The deadline is too tight — we need more time.",
          correct: "You're absolutely right about the deadline. That's a fair point I hadn't thought of.",
          wrong1: "Deadline is fine stop complaining.",
          wrong2: "I don't work with deadlines.",
          wrong3: "Not my problem.",
          explanation: "'You're absolutely right' و 'fair point' — ڕازیبوون بە شێوەیەکی گەرم",
        },
        {
          situation: "جیاوازی بۆچوون لەسەر باج",
          theyAsk: "I think we should spend more on marketing.",
          correct: "I partly agree, though I'd add one thing — we should fix the product first.",
          wrong1: "Marketing is waste of money.",
          wrong2: "Spend everything on ads.",
          wrong3: "I hate marketing talk.",
          explanation: "'Partly agree' و 'agree to disagree' — بۆ جیاوازی بە ڕێز",
        },
      ],
    },
  ),

  buildLesson(
    "Light Humor",
    "گاڵتەی سوک",
    [
      { en: "I'm just messing with you — don't worry.", ku: "تەنها گاڵتەت پێ دەکەم — نیگەران مەبە." },
      { en: "That went better than I expected, honestly.", ku: "بە ڕاستی باشتر ڕۆیشت لەوەی چاوەڕێم دەکرد." },
      { en: "Well, that was awkward — let's move on.", ku: "باش، ئەوە سەیر بوو — با بگوزەرین." },
      { en: "I have to admit, that was pretty funny.", ku: "دەبێت دان بەوەدا بنێم، ئەوە زۆر پێکەنیناوی بوو." },
      { en: "Classic me — always forgetting something.", ku: "کلاسیک من — هەمیشە شتێک لەبیر دەکەم." },
      { en: "You're killing me — that's hilarious.", ku: "دەمخوڕێنیت — زۆر خۆشە." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت گاڵتەیەکی کرد و تووڕە بوویت",
          theyAsk: "Wait, you know I was joking, right?",
          correct: "I'm just messing with you too — I have to admit, that was pretty funny.",
          wrong1: "Never joke with me again.",
          wrong2: "I don't understand jokes.",
          wrong3: "You are not funny person.",
          explanation: "'Just messing with you' و 'pretty funny' — گاڵتە بە شێوەیەکی ئاسایی",
        },
        {
          situation: "شتێک سەیر ڕوودەدات لە کۆبوونەوەکە",
          theyAsk: "Did that just happen in front of everyone?",
          correct: "Well, that was awkward — let's move on. Classic me, honestly.",
          wrong1: "Everyone is laughing at me.",
          wrong2: "Meeting is cancelled forever.",
          wrong3: "I leave country now.",
          explanation: "'That was awkward' و 'let's move on' — بۆ کەسێتی سوک و ئاسایی",
        },
      ],
    },
  ),

  buildLesson(
    "Networking Small Talk",
    "قسەی کەم لە پەیوەندی پیشەیی",
    [
      { en: "What line of work are you in?", ku: "لە چ بوارێکی کاردا دەگەڕێیت؟" },
      { en: "How did you get into this field?", ku: "چۆن چوویتە ناو ئەم بوارە؟" },
      { en: "I'd love to stay in touch after this event.", ku: "حەز دەکەم دوای ئەم بۆنەیە پەیوەندیم پێوە بمێنێت." },
      { en: "Do you mind if I connect with you on LinkedIn?", ku: "ئایا کێشەت نییە لە LinkedIn پەیوەندیمان بێت؟" },
      { en: "It was great meeting you — here's my card.", ku: "زۆر خۆشحاڵ بووم بە ناسینت — ئەمە کارتمە." },
      { en: "What brings you to this conference?", ku: "چی دەهێنێت بۆ ئەم کۆنفرانسە؟" },
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
          explanation: "'What line of work' و 'stay in touch' — زارawەی networking",
        },
        {
          situation: "کۆتایی گفتوگۆی کورت",
          theyAsk: "Well, I should probably mingle a bit more.",
          correct: "It was great meeting you — here's my card. Do you mind if I connect with you on LinkedIn?",
          wrong1: "Bye no contact.",
          wrong2: "Your card is useless.",
          wrong3: "I hate LinkedIn.",
          explanation: "'Here's my card' و 'connect on LinkedIn' — کۆتایی پیشەیی بە شێوەیەکی گونجاو",
        },
      ],
    },
  ),

  buildLesson(
    "Parent & School Talk",
    "قسەی دایک/باوک و قوتابخانە",
    [
      { en: "How is my child doing in class?", ku: "مناڵەکەم لە پۆلدا چۆنە؟" },
      { en: "Is there anything we should work on at home?", ku: "ئایا شتێک هەیە کە لە ماڵەوە لەسەری کار بکەین؟" },
      { en: "Thank you for taking the time to meet with us.", ku: "سوپاس بۆ ئەوەی کاتت بۆ کۆبوونەوەمان تەرخان کرد." },
      { en: "We've noticed some improvement lately.", ku: "لە ماوەی دواییە باشتر بوونێکمان بینیوە." },
      { en: "What can we do to support learning at home?", ku: "چی دەتوانین بکەین بۆ پشتگیری فێربوون لە ماڵەوە؟" },
      { en: "We want to make sure she stays on track.", ku: "دەمانەوێت دڵنیابین لەسەر ڕێڕەوی دروست." },
    ],
    {
      convos: [
        {
          situation: "چاوپێکەوتن لەگەڵ مامۆستا",
          theyAsk: "Your son has been doing well overall this term.",
          correct: "Thank you for taking the time to meet with us. Is there anything we should work on at home?",
          wrong1: "He is perfect no problems.",
          wrong2: "Teacher is wrong about him.",
          wrong3: "School is waste of time.",
          explanation: "پرسیارکردن بە شێوەیەکی ڕێز — 'work on at home' و 'stay on track'",
        },
        {
          situation: "دەربارەی پێشکەوتنی منداڵ",
          theyAsk: "Has he mentioned any struggles with homework?",
          correct: "We've noticed some improvement lately, but we want to make sure he stays on track.",
          wrong1: "Homework is stupid.",
          wrong2: "He never does homework.",
          wrong3: "Not my job to help.",
          explanation: "'Noticed improvement' و 'stay on track' — قسەی بەرپرسیارانەی دایک و باوک",
        },
      ],
    },
  ),

  buildLesson(
    "Volunteering & Community",
    "خۆبەخشی و کۆمەڵگا",
    [
      { en: "I'd like to volunteer for the weekend event.", ku: "حەز دەکەم بۆ بۆنەی کۆتایی هەفتە خۆبەخش بم." },
      { en: "How can I sign up to help?", ku: "چۆن دەتوانم ناوم تۆمار بکەم بۆ یارمەتی؟" },
      { en: "Count me in — what time should I arrive?", ku: "منیش بەشداری دەکەم — چ کاتێک بگەم؟" },
      { en: "Is there anything I should bring with me?", ku: "ئایا شتێک هەیە کە لەگەڵ خۆم بهێنم؟" },
      { en: "It feels good to give back to the community.", ku: "هەستێکی باشە گەڕاندنەوە بۆ کۆمەڵگا." },
      { en: "Let me know if you need an extra pair of hands.", ku: "پێم بڵێ ئەگەر پێویستت بە یارمەتی زیاتر بوو." },
    ],
    {
      convos: [
        {
          situation: "لە ڕێکخراوێکی خێرخوازی",
          theyAsk: "We're looking for volunteers for Saturday's food drive.",
          correct: "I'd like to volunteer for the weekend event. How can I sign up to help?",
          wrong1: "I want money not volunteer.",
          wrong2: "Saturday I sleep only.",
          wrong3: "Food drive is not real.",
          explanation: "'Volunteer' و 'sign up to help' — زارawەی خۆبەخشی",
        },
        {
          situation: "ڕێکخەری بۆنەکە پێی دەڵێت",
          theyAsk: "Great — we start at nine in the morning.",
          correct: "Count me in — what time should I arrive? Is there anything I should bring with me?",
          wrong1: "Nine is too early goodbye.",
          wrong2: "I bring nothing.",
          wrong3: "You do all work alone.",
          explanation: "'Count me in' — ڕازیبوونێکی گەرم و ئاسایی بۆ بەشداری",
        },
      ],
    },
  ),

  buildLesson(
    "Presenting Ideas",
    "پێشکەشکردنی بیرۆکە",
    [
      { en: "Let me walk you through the main points.", ku: "با سەرەکیترین خاڵەکان بۆت ڕوون بکەمەوە." },
      { en: "The key takeaway here is simplicity.", ku: "گرنگترین شت لێرە ئاسانکارییە." },
      { en: "To sum up, we have three clear next steps.", ku: "کورتە، سێ هەنگاوی ڕوونی داهاتوومان هەیە." },
      { en: "Does anyone have questions before we wrap up?", ku: "کەس پرسیار هەیە پێش ئەوەی کۆتایی بکەین؟" },
      { en: "I'll keep this brief — about five minutes.", ku: "کورت دەمێنمەوە — نزیکەی پێنج خولەک." },
      { en: "Feel free to jump in if something's unclear.", ku: "ئازادانە قسە بکە ئەگەر شتێک ڕوون نەبوو." },
    ],
    {
      convos: [
        {
          situation: "پێشکەشکردنی پلانێک لە پۆل یان کار",
          theyAsk: "Okay, we're all ears — go ahead.",
          correct: "I'll keep this brief — about five minutes. Let me walk you through the main points.",
          wrong1: "Listen to me one hour talk.",
          wrong2: "I have no plan.",
          wrong3: "Don't ask questions ever.",
          explanation: "'Walk you through' و 'keep this brief' — دەستپێکردنی پێشکەشێکی ڕوون",
        },
        {
          situation: "کۆتایی پێشکەش",
          theyAsk: "So what's the bottom line?",
          correct: "To sum up, we have three clear next steps. Does anyone have questions before we wrap up?",
          wrong1: "No summary needed.",
          wrong2: "I am finished go home.",
          wrong3: "Questions are banned.",
          explanation: "'To sum up' و 'wrap up' — کۆتایی پیشەیی و ڕوون",
        },
      ],
    },
  ),

  buildLesson(
    "Handling Complaints",
    "مامەڵەکردن لەگەڵ سکاڵا",
    [
      { en: "I'm sorry you've had this experience.", ku: "ببوورە ئەم ئەزمونەت بەسەر هاتووە." },
      { en: "Let me look into this and get back to you.", ku: "با لێی بپشکنم و وەڵامت بدەمەوە." },
      { en: "I understand why you're frustrated.", ku: "تێدەگەم بۆچی تووڕەیت." },
      { en: "What would make this right for you?", ku: "چی ئەمە بۆت دروست دەکاتەوە؟" },
      { en: "I'll escalate this to my manager right away.", ku: "دەستبەجێ ئەمە بۆ بەڕێوەبەرەکەم دەنێرم." },
      { en: "Thank you for bringing this to our attention.", ku: "سوپاس بۆ ئەوەی ئەمەمان خستە بەردەست." },
    ],
    {
      convos: [
        {
          situation: "کڕیارێک سکاڵا لە خزمەتگوزاری دەکات",
          theyAsk: "I've been waiting three weeks and still no response!",
          correct: "I'm sorry you've had this experience. I understand why you're frustrated — let me look into this and get back to you today.",
          wrong1: "Wait more weeks.",
          wrong2: "Not my department.",
          wrong3: "You are too angry.",
          explanation: "'Look into this' و 'get back to you' — وەڵامی پیشەیی بۆ سکاڵا",
        },
        {
          situation: "داوای چارەسەر دەکات",
          theyAsk: "So what are you actually going to do about it?",
          correct: "What would make this right for you? I'll escalate this to my manager if needed.",
          wrong1: "Nothing we can do.",
          wrong2: "Your fault not ours.",
          wrong3: "Stop complaining please.",
          explanation: "'What would make this right' — پرسیارکردن بۆ چارەسەری گونجاو",
        },
      ],
    },
  ),

  buildLesson(
    "Future Plans & Dreams",
    "پلانی داهاتوو و خەون",
    [
      { en: "I'm working toward becoming fluent in English.", ku: "بۆ شێوەپێدان بە ئینگلیزی کار دەکەم." },
      { en: "My long-term goal is to study abroad.", ku: "ئامانجی درێژخایەنم خوێندن لە دەرەوەیە." },
      { en: "I'm taking it one step at a time.", ku: "هەنگاو بە هەنگاو پێش دەچم." },
      { en: "It's been a dream of mine for years.", ku: "ساڵانە خەونی من بووە." },
      { en: "I'm not there yet, but I'm getting closer.", ku: "هێشتا نەگەیشتووم، بەڵام نزیکترم." },
      { en: "What about you — any big plans coming up?", ku: "تۆ چی — هیچ پلانی گەورەیەک لە پێشە؟" },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت دەپرسێت دەربارەی داهاتوو",
          theyAsk: "So where do you see yourself in five years?",
          correct: "My long-term goal is to study abroad, but I'm taking it one step at a time. Right now I'm working toward becoming fluent in English.",
          wrong1: "I see nothing in future.",
          wrong2: "Five years is too long think.",
          wrong3: "I don't have goals.",
          explanation: "'Long-term goal' و 'one step at a time' — قسەی ئامانج بە شێوەیەکی سروشت",
        },
        {
          situation: "گفتوگۆی ئاهەنگخواز",
          theyAsk: "Do you think you'll actually make it happen?",
          correct: "I'm not there yet, but I'm getting closer. It's been a dream of mine for years.",
          wrong1: "Dreams never happen.",
          wrong2: "I will fail for sure.",
          wrong3: "Don't talk about dreams.",
          explanation: "'Getting closer' و 'dream of mine' — هەستی ئومێد و ڕاستگۆیی",
        },
      ],
    },
  ),

  buildLesson(
    "Fluent Goodbye",
    "وداعێکی ڕەوان",
    [
      { en: "It's been a pleasure talking with you.", ku: "خۆشحاڵ بووم بە قسەکردن لەگەڵت." },
      { en: "I really appreciate everything you've shared.", ku: "ڕاستی وایە سوپاسگوزارم بۆ هەموو ئەوەی بەشدار کرد." },
      { en: "Let's definitely keep in touch.", ku: "با بە دڵنیاییەوە پەیوەندیمان بمێنێت." },
      { en: "I feel much more confident speaking now.", ku: "ئێستا زۆر زیاتر متمانەم بە قسەکردن هەیە." },
      { en: "Thanks for pushing me out of my comfort zone.", ku: "سوپاس بۆ ئەوەی لە ناوچەی ئارامیم دەرم کرد." },
      { en: "Same time next week? I'd love that.", ku: "هەمان کات هەفتەی داهاتوو؟ زۆر حەز دەکەم." },
    ],
    {
      convos: [
        {
          situation: "کۆتایی گفتوگۆیەکی درێژ لەگەڵ هاوڕێی ئینگلیزی",
          theyAsk: "Well, I should probably head out — great chat!",
          correct: "It's been a pleasure talking with you. Let's definitely keep in touch — same time next week?",
          wrong1: "Finally you leave.",
          wrong2: "Don't contact me again.",
          wrong3: "Chat was boring.",
          explanation: "'Pleasure talking' و 'keep in touch' — کۆتایی گەرم و ئاسایی",
        },
        {
          situation: "دوای تەواوکردنی یەکەی فێربوون",
          theyAsk: "You made it through the whole unit — how do you feel?",
          correct: "I feel much more confident speaking now. Thanks for pushing me out of my comfort zone.",
          wrong1: "English is impossible forever.",
          wrong2: "I learned nothing.",
          wrong3: "Units are too hard delete app.",
          explanation: "'More confident' و 'comfort zone' — زارawەی گەشە و سەرکەوتن",
        },
      ],
    },
  ),
];

export default unit13;
