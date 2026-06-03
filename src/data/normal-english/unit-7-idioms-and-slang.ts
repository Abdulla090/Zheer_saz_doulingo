import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 7: Idioms & Natural Slang — 10 unique lessons ───────────────────────
// Conversational idioms and everyday casual English — friendly, not vulgar.

const unit07: UnitBank = [
  buildLesson(
    "No Worries",
    "نیگەران مەبە",
    [
      { en: "No worries, it happens to everyone.", ku: "نیگەران مەبە، بۆ هەمووان ڕوودەدات." },
      { en: "No worries at all — I completely forgot too.", ku: "هیچ نیگەرانییەک نییە — منیش تەواو لەبیرم چوو." },
      { en: "Don't stress about it, no worries.", ku: "لەسەر ئەمە مەخنکە، نیگەران مەبە." },
      { en: "Thanks for understanding, no worries.", ku: "سوپاس بۆ تێگەیشتنت، نیگەران مەبە." },
      { en: "No worries, we can figure it out later.", ku: "نیگەران مەبە، دواتر دەتوانین چارەسەری بکەین." },
      { en: "It's totally fine — no worries on my end.", ku: "تەواو باشە — لە لای من هیچ کێشەیەک نییە." },
    ],
    {
      convos: [
        {
          situation: "دوای ئەوەی بە هەڵە نامەیەکی درەنگ ناردیت",
          theyAsk: "Oh man, I'm so sorry I sent that email late!",
          correct: "No worries, it happens to everyone. We still have time to fix it.",
          wrong1: "Yes, you are very late.",
          wrong2: "Don't do that again please.",
          wrong3: "I am angry about the email.",
          explanation: "'No worries' وەڵامێکی گەرم و ئاساییە بۆ لێبوردن — واتای 'نیگەران مەبە'ە",
        },
        {
          situation: "هاوڕێیەکت داوای لێبوردن دەکات بۆ ئەوەی نەیتوانی بێت",
          theyAsk: "I'm really sorry I couldn't make it to dinner last night.",
          correct: "No worries at all — I completely forgot you were busy too.",
          wrong1: "You should have come.",
          wrong2: "Why you not come?",
          wrong3: "I was waiting long time.",
          explanation: "'No worries at all' بە توندی دەڵێت کە هیچ کێشەیەک نییە",
        },
      ],
    },
  ),

  buildLesson(
    "My Bad",
    "هەڵەی من بوو",
    [
      { en: "My bad, I sent the wrong file.", ku: "هەڵەی من بوو، فایلی هەڵەم نارد." },
      { en: "My bad — I totally misread the schedule.", ku: "هەڵەی من بوو — تەواو خشتەکەم هەڵە خوێندەوە." },
      { en: "Sorry, my bad for not calling you back.", ku: "ببوورە، هەڵەی من بوو کە پەیوەندیم پێوە نەکردەوە." },
      { en: "My bad, I thought the meeting was tomorrow.", ku: "هەڵەی من بوو، پێم وابوو کۆبوونەوەکە سبەیە." },
      { en: "That was my bad, I should have double-checked.", ku: "ئەوە هەڵەی من بوو، دەبوایە دووبارە بپشکنم." },
      { en: "My bad — I'll fix it right away.", ku: "هەڵەی من بوو — دەستبەجێ چارەسەری دەکەم." },
    ],
    {
      convos: [
        {
          situation: "فایلی هەڵەت ناردووە بۆ تیمەکەت",
          theyAsk: "Hey, this document doesn't look like the right one.",
          correct: "My bad, I sent the wrong file. I'll email the correct one now.",
          wrong1: "The file is okay I think.",
          wrong2: "You open wrong folder.",
          wrong3: "Not my problem.",
          explanation: "'My bad' ڕێگەیەکی زۆر ئاسایی و ڕاستەوخۆیە بۆ دانانی هەڵە — وەک 'هەڵەی من بوو'",
        },
        {
          situation: "بە هەڵە بە دوای کۆبوونەوەکە هاتووی",
          theyAsk: "The meeting started twenty minutes ago.",
          correct: "My bad — I totally misread the schedule. Can you catch me up?",
          wrong1: "Meeting is not important.",
          wrong2: "Why meeting so early?",
          wrong3: "I don't care about meeting.",
          explanation: "'Totally misread' بە توندی دەڵێت کە بە هەڵە تێگەیشتووی",
        },
      ],
    },
  ),

  buildLesson(
    "Hang On",
    "چاوەڕێ بکە / وەستە",
    [
      { en: "Hang on, let me grab my notebook.", ku: "چاوەڕێ بکە، با تێبینییەکەم بهێنم." },
      { en: "Hang on a second — I'm almost ready.", ku: "چرکەیەک چاوەڕێ بکە — نزیکم لە ئامادەبوون." },
      { en: "Can you hang on while I check that?", ku: "دەتوانیت چاوەڕێ بکەیت تا ئەوە بپشکنم؟" },
      { en: "Hang on, I think I left my keys inside.", ku: "وەستە، پێم وایە کلیلەکانم لەناو ماوە." },
      { en: "Hang on — that doesn't sound right to me.", ku: "چاوەڕێ بکە — ئەوە بە دروستی وادیار ناکات." },
      { en: "Just hang on, the page is still loading.", ku: "تەنها چاوەڕێ بکە، لاپەڕەکە هێشتا بار دەبێت." },
    ],
    {
      convos: [
        {
          situation: "لە تەلەفۆندا کەسێک داوای یارمەتی دەکات",
          theyAsk: "Can you help me find the address right now?",
          correct: "Hang on, let me grab my notebook. I'll look it up in one minute.",
          wrong1: "I don't have time now.",
          wrong2: "Find it yourself.",
          wrong3: "Address is on internet.",
          explanation: "'Hang on' واتای 'چرکەیەک چاوەڕێ بکە' — زۆر باوە لە قسەی ڕۆژانە",
        },
        {
          situation: "هاوکارێکت پێشنیارێک دەدات و تۆ گومانت هەیە",
          theyAsk: "So we should launch the app this Friday, right?",
          correct: "Hang on — that doesn't sound right to me. Didn't we agree on next week?",
          wrong1: "Friday is good, yes.",
          wrong2: "I don't know about app.",
          wrong3: "Launch whenever you want.",
          explanation: "'Hang on' لێرە واتای 'وەستە، با بیربکەمەوە' — بۆ گومانکردن یان ڕاستکردنەوە",
        },
      ],
    },
  ),

  buildLesson(
    "That Makes Sense",
    "ئەوە مەعنا هەیە / تێگەیشتم",
    [
      { en: "Oh, that makes sense now.", ku: "ئا، ئێستا مەعنا هەیە." },
      { en: "That makes sense — thanks for explaining.", ku: "مەعنا هەیە — سوپاس بۆ ڕوونکردنەوە." },
      { en: "Yeah, that makes total sense to me.", ku: "بەڵێ، بۆ من تەواو مەعنا هەیە." },
      { en: "It makes sense why you were frustrated.", ku: "مەعنا هەیە بۆچی تووڕە بوویت." },
      { en: "That makes sense given the deadline.", ku: "بەبەر ئەو مۆڵەتە مەعنا هەیە." },
      { en: "Now it all makes sense — I get it.", ku: "ئێستا هەموو شتێک مەعنا هەیە — تێگەیشتم." },
    ],
    {
      convos: [
        {
          situation: "مامۆستایەک ڕوونی دەکاتەوە بۆچی تاقیکردنەوە دواخست",
          theyAsk: "We moved the test because half the class was sick.",
          correct: "Oh, that makes sense now. Thanks for explaining.",
          wrong1: "I don't like new date.",
          wrong2: "Test should be today.",
          wrong3: "Why sick people matter?",
          explanation: "'That makes sense' دەڵێت کە تێگەیشتووی — واتای 'ئەوە لۆژیکی هەیە'",
        },
        {
          situation: "هاوڕێیەکت دەڵێت بۆچی نەچووە بۆ ئاهەنگ",
          theyAsk: "I skipped the party because I had to work early tomorrow.",
          correct: "Yeah, that makes total sense to me. I would've done the same.",
          wrong1: "Party was fun you missed.",
          wrong2: "Work is not important.",
          wrong3: "You always skip parties.",
          explanation: "'Makes total sense' بە توندی پشتگیری لە بڕیارەکە دەکات",
        },
      ],
    },
  ),

  buildLesson(
    "Sounds Good",
    "باشە / ڕازی م",
    [
      { en: "Sounds good — let's meet at six.", ku: "باشە — با لە شەشدا بینین." },
      { en: "That sounds good to me.", ku: "بۆ من باشە." },
      { en: "Sounds good, I'll bring the drinks.", ku: "باشە، من خواردنەوە دەهێنم." },
      { en: "Yeah, sounds good — see you then.", ku: "بەڵێ، باشە — ئەو کاتە دەبینینەوە." },
      { en: "Sounds good, just text me when you leave.", ku: "باشە، تەنها کاتێک دەڕۆیت نامەم بۆ بنێرە." },
      { en: "That plan sounds good — I'm in.", ku: "ئەو پلانە باشە — من بەشداری دەکەم." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەک پلانی کۆبوونەوە پێشنیار دەکات",
          theyAsk: "How about we grab coffee after work around five?",
          correct: "Sounds good — let's meet at the café near the office.",
          wrong1: "I don't like coffee.",
          wrong2: "Five is bad time.",
          wrong3: "Maybe another day I think.",
          explanation: "'Sounds good' ڕێگەیەکی سادەیە بۆ ڕازیبوون — واتای 'باشە، قبوڵە'",
        },
        {
          situation: "هاوکارێک پلانی پڕۆژە ڕوون دەکاتەوە",
          theyAsk: "We'll draft the report today and review it together tomorrow morning.",
          correct: "That plan sounds good — I'm in. I'll start the draft after lunch.",
          wrong1: "I don't want draft.",
          wrong2: "Tomorrow is too late.",
          wrong3: "You do everything alone.",
          explanation: "'I'm in' لەگەڵ 'sounds good' دەڵێت کە بە توندی بەشداری دەکەیت",
        },
      ],
    },
  ),

  buildLesson(
    "Fair Enough",
    "دادپەروەرانە / قبوڵە",
    [
      { en: "Fair enough — I see your point.", ku: "دادپەروەرانە — تێگەیشتم لە قسەکەت." },
      { en: "Fair enough, we can try it your way.", ku: "قبوڵە، دەتوانین بە ڕێگەکەت تاقی بکەینەوە." },
      { en: "Yeah, fair enough — I hadn't thought of that.", ku: "بەڵێ، ڕاستە — من بیرم لێ نەکردبوو." },
      { en: "Fair enough, you win this argument.", ku: "قبوڵە، ئەم جارە تۆ سەرکەوتیت." },
      { en: "That's fair enough given the circumstances.", ku: "بەبەر ئەو بارودۆخە دادپەروەرانەیە." },
      { en: "Fair enough — let's compromise on this.", ku: "قبوڵە — با لەسەر ئەمە ڕێک بکەین." },
    ],
    {
      convos: [
        {
          situation: "گفتوگۆیەک دەربارەی کێ پێشتر دەچێتە ماڵ",
          theyAsk: "I worked late three nights this week, so I should leave early today.",
          correct: "Fair enough — I see your point. I'll cover the afternoon shift.",
          wrong1: "No, you stay late too.",
          wrong2: "That is not fair.",
          wrong3: "I don't care about your work.",
          explanation: "'Fair enough' واتای 'قبوڵە، دادپەروەرانەیە' — کاتێک ڕازی دەبیت بە بیرۆکەی کەسێک",
        },
        {
          situation: "هاوڕێیەک ڕوونی دەکاتەوە بۆچی فیلمێکی جیاواز هەڵبژارد",
          theyAsk: "I picked the comedy because you've chosen the last three movies.",
          correct: "Yeah, fair enough — I hadn't thought of that. Let's watch your pick.",
          wrong1: "I always choose movies.",
          wrong2: "Comedy is boring.",
          wrong3: "We watch nothing tonight.",
          explanation: "'Fair enough' نیشانی دەدات کە قبوڵت کردووە بەڵام بە شێوەیەکی ئاسایی",
        },
      ],
    },
  ),

  buildLesson(
    "Long Story Short",
    "کورت بڵێم",
    [
      { en: "Long story short, we missed the flight.", ku: "کورت بڵێم، فڕۆکەکەمان لەدەستدا." },
      { en: "Long story short, it all worked out.", ku: "کورت بڵێم، هەموو شتێک باش بوو." },
      { en: "To make a long story short, she got the job.", ku: "بۆ کورتکردنەوە، ئەو کارەکەی وەرگرت." },
      { en: "Long story short, I didn't see that coming.", ku: "کورت بڵێم، ئەمە چاوەڕوان نەکردبووم." },
      { en: "Long story short, we're starting over.", ku: "کورت بڵێم، دووبارە دەستپێدەکەینەوە." },
      { en: "Anyway, long story short — we're moving in June.", ku: "بەهەرحاڵ، کورت بڵێم — لە حوزەیراندا دەگوازرێینەوە." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت دەپرسێت چۆن گەشتەکەت بوو",
          theyAsk: "So what happened on your trip? You look exhausted.",
          correct: "Long story short, we missed the flight and had to stay an extra night. But it all worked out.",
          wrong1: "Trip was bad and good.",
          wrong2: "Many things happened.",
          wrong3: "I don't want talk about trip.",
          explanation: "'Long story short' بۆ کورتکردنەوەی چیرۆکێکی درێژە — 'کورت بڵێم'",
        },
        {
          situation: "لە کۆبوونەوەی کار پرسیار دەکرێت بۆچی پڕۆژەکە دواکەوت",
          theyAsk: "Can you update us on the client situation?",
          correct: "To make a long story short, she got the promotion and we're starting fresh with her replacement.",
          wrong1: "Client is difficult person.",
          wrong2: "Many emails were sent.",
          wrong3: "Project is late because problems.",
          explanation: "'To make a long story short' هەمان ئیدیۆمە بە شێوەیەکی کەمێک فەرمیتر",
        },
      ],
    },
  ),

  buildLesson(
    "Take Your Time",
    "کاتت هەبێت / پەلە مەکە",
    [
      { en: "Take your time — there's no rush.", ku: "کاتت هەبێت — پەلە نییە." },
      { en: "No rush, take your time deciding.", ku: "پەلە نییە، کاتت هەبێت بۆ بڕیاردان." },
      { en: "Take your time and let me know later.", ku: "کاتت هەبێت و دواتر پێم بڵێ." },
      { en: "Sure, take your time — I'll wait here.", ku: "باشە، کاتت هەبێت — لێرە چاوەڕێ دەکەم." },
      { en: "Don't worry, take all the time you need.", ku: "نیگەران مەبە، هەموو کاتێک کە پێویستتە وەربگرە." },
      { en: "Take your time with the form — it's long.", ku: "لەگەڵ فۆڕمەکە کاتت هەبێت — درێژە." },
    ],
    {
      convos: [
        {
          situation: "کڕیارێک لە فرۆشگادا بڕیار دەدات",
          theyAsk: "Sorry, I can't decide between these two jackets.",
          correct: "Take your time — there's no rush. I'm happy to help whenever you're ready.",
          wrong1: "Choose now please.",
          wrong2: "Both jackets same.",
          wrong3: "We close soon hurry.",
          explanation: "'Take your time' و 'no rush' هەردووکیان دەڵێن پەلە مەکە — زۆر بەئەدەب",
        },
        {
          situation: "هاوکارێکت داوای مۆڵەت دەکات بۆ بڕیار لەسەر پڕۆپۆزاڵ",
          theyAsk: "Can I get back to you on the proposal tomorrow?",
          correct: "Sure, take your time — I'll wait. Just let me know when you've decided.",
          wrong1: "Answer must be today.",
          wrong2: "Why you need time?",
          wrong3: "Proposal is simple decide now.",
          explanation: "'Let me know when you've decided' بە شێوەیەکی پیشەیی کات دەدات بە کەسەکە",
        },
      ],
    },
  ),

  buildLesson(
    "It Is What It Is",
    "ئەوە ئەوە — چارەسەر نییە",
    [
      { en: "It is what it is — we can't change the past.", ku: "ئەوە ئەوە — ناتوانین ڕابردوو بگۆڕین." },
      { en: "Well, it is what it is at this point.", ku: "باش، لەم قۆناغەدا ئەوە ئەوەیە." },
      { en: "It is what it is — let's focus on what's next.", ku: "ئەوە ئەوە — با سەرنج بدەینە ئەوەی داهاتوو." },
      { en: "I wish it were different, but it is what it is.", ku: "خۆشم دەوێت جیاواز بوایە، بەڵام ئەوە ئەوەیە." },
      { en: "It is what it is — no point stressing about it.", ku: "ئەوە ئەوە — فائیدەی نییە لەسەر ئەمە بخنکیت." },
      { en: "Yeah, it is what it is — we'll adapt.", ku: "بەڵێ، ئەوە ئەوە — خۆمان دەگونجێنین." },
    ],
    {
      convos: [
        {
          situation: "تیمەکەت لە پێشبڕکێدا دۆڕاند",
          theyAsk: "I can't believe we lost the contract after all that work.",
          correct: "It is what it is — we can't change the past. Let's focus on what's next.",
          wrong1: "We should cry about it.",
          wrong2: "Contract was always ours.",
          wrong3: "Forget everything and quit.",
          explanation: "'It is what it is' قبوڵکردنی بارودۆخێکە کە ناتوانرێت بگۆڕدرێت",
        },
        {
          situation: "هاوڕێیەکت دەربارەی باران لە ڕۆژی پیکنیک",
          theyAsk: "The weather ruined our whole picnic plan.",
          correct: "Yeah, it is what it is — no point stressing. We can do a movie night instead.",
          wrong1: "Weather is your fault.",
          wrong2: "Picnic must happen today.",
          wrong3: "I hate rain always.",
          explanation: "لەگەڵ 'no point stressing' — دەڵێت کە نیگەران بوون فائیدەی نییە",
        },
      ],
    },
  ),

  buildLesson(
    "Everyday Idioms Mix",
    "ئیدیۆمەکانی ڕۆژانە",
    [
      { en: "I'm all ears — tell me what happened.", ku: "گوێم لێیە — پێم بڵێ چی ڕوویدا." },
      { en: "That's on me — I'll pay for dinner.", ku: "ئەوە لە ئەستۆی منە — شەوخواردنەکە من دەدەم." },
      { en: "You're pulling my leg — seriously?", ku: "گاڵتە دەکەیت — بەڕاستی؟" },
      { en: "Let's call it a day and head home.", ku: "با ئەمڕۆ تەواو بکەین و بگەڕێینەوە ماڵ." },
      { en: "I'm beat — I need to crash early tonight.", ku: "مردوم لە ماندوێتی — پێویستە ئەمشەو زوو بخەوێم." },
      { en: "Keep me posted on how it goes.", ku: "ئاگادارم بکەرەوە چۆن دەڕوات." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت دەیەوێت چیرۆکێکی سەرنجڕاکێش بڵێت",
          theyAsk: "Okay, so something crazy happened at work today...",
          correct: "I'm all ears — tell me what happened. I've got time.",
          wrong1: "I don't want hear story.",
          wrong2: "Work is always boring.",
          wrong3: "Tell me later maybe.",
          explanation: "'I'm all ears' واتای 'گوێم لێیە، بە توندی گوێ دەگرم'",
        },
        {
          situation: "دوای کاری درێژ هاوکاران دەڕۆن",
          theyAsk: "Should we finish this tonight or come back tomorrow?",
          correct: "Let's call it a day and head home. I'm beat — we'll pick it up fresh tomorrow.",
          wrong1: "Work all night no sleep.",
          wrong2: "I go home you stay.",
          wrong3: "Project never finish.",
          explanation: "'Call it a day' = کاری ئەمڕۆ تەواو بکە | 'I'm beat' = زۆر ماندووام",
        },
      ],
    },
  ),
];

export default unit07;
