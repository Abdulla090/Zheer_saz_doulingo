import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 9: Relationships & Feelings — 10 unique lessons ───────────────────

const unit09: UnitBank = [
  buildLesson(
    "Making Friends",
    "هاوڕێیەتی دروستکردن",
    [
      { en: "I really enjoyed talking to you today.", ku: "زۆر چێژم لە قسەکردن لەگەڵت وەرگرت ئەمڕۆ." },
      { en: "We should hang out again sometime.", ku: "دەبێت جارێکی تر کاتێک بە یەکەوە بەسەر ببەین." },
      { en: "You seem like someone I'd get along with.", ku: "وا دیارە کەسێکیت کە لەگەڵدا ڕێکدەکەوم." },
      { en: "Want to grab coffee and chat more?", ku: "دەتەوێت قاوە بخۆین و زیاتر قسە بکەین؟" },
      { en: "I'm still pretty new here — nice to meet you.", ku: "هێشتا نوێم لێرە — خۆشحاڵم بە ناسینت." },
      { en: "Let's exchange numbers and keep in touch.", ku: "با ژمارەکانمان ئاڵوگۆڕ بکەین و پەیوەندمان هەبێت." },
    ],
    {
      convos: [
        {
          situation: "لە ڕووداوێکی کۆمەڵایەتیدا کەسێکی نوێ ناسیت",
          theyAsk: "It was great meeting you at the language exchange!",
          correct: "I really enjoyed talking to you too. We should hang out again sometime — want to grab coffee?",
          wrong1: "I don't want meet again.",
          wrong2: "You talk too much.",
          wrong3: "Goodbye forever.",
          explanation: "'We should hang out again' و 'want to grab coffee?' — ڕێگەی ئاسایی بۆ دروستکردنی هاوڕێیەتی",
        },
        {
          situation: "تازە گواستراوەتەوە شارێکی نوێ",
          theyAsk: "How are you settling in so far?",
          correct: "I'm still pretty new here, but everyone's been friendly. Nice to meet people like you!",
          wrong1: "I hate this city.",
          wrong2: "Nobody talks to me.",
          wrong3: "New city is scary.",
          explanation: "'Still pretty new here' — ڕێگەیەکی ڕاستەقینە بۆ دەربڕینی نوێبوون لە شوێنێک",
        },
      ],
    },
  ),

  buildLesson(
    "Expressing Feelings",
    "دەربڕینی هەستەکان",
    [
      { en: "I've been feeling a bit overwhelmed lately.", ku: "لەم دواییانە هەست بە قورسایی دەکەم." },
      { en: "Honestly, I'm really happy about this.", ku: "ڕاستی بڵێم، زۆر دڵخۆشم لەمە." },
      { en: "Something's been bothering me for a while.", ku: "شتێک ماوەیەکە ئازارم دەدات." },
      { en: "I didn't expect to feel this nervous.", ku: "چاوەڕوانی ئەوە نەدەکرد ئەوەندە دڵەڕاوکێ بم." },
      { en: "It's hard to put my feelings into words.", ku: "قورسە هەستەکانم بخەمە وشە." },
      { en: "I feel like a weight has been lifted.", ku: "هەست دەکەم بارێک لەسەرم هەڵگیراوە." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت دەپرسێت چۆنی",
          theyAsk: "You seem quiet today — everything okay?",
          correct: "Honestly, I've been feeling a bit overwhelmed lately. Something's been bothering me for a while.",
          wrong1: "I am fine nothing wrong.",
          wrong2: "Don't ask me questions.",
          wrong3: "Everything is perfect always.",
          explanation: "'Feeling overwhelmed' و 'something's been bothering me' — دەربڕینی هەست بە شێوەیەکی ڕاستەقینە",
        },
        {
          situation: "دوای چارەسەرکردنی کێشەیەک",
          theyAsk: "How do you feel now that it's resolved?",
          correct: "I feel like a weight has been lifted. I didn't expect to feel this relieved.",
          wrong1: "Still very angry.",
          wrong2: "Problem is same.",
          wrong3: "I don't feel anything.",
          explanation: "'A weight has been lifted' ئیدیۆمێکی بەناوبانگە بۆ ئازادبوون لە بارێکی دەروونی",
        },
      ],
    },
  ),

  buildLesson(
    "Showing Support",
    "پشتگیری کردن",
    [
      { en: "I'm here for you no matter what.", ku: "لە هەر بارودۆخێکدا لای تۆم." },
      { en: "That sounds really tough — I'm sorry.", ku: "زۆر قورس دەngە دەردەخات — ببوورە." },
      { en: "Take all the time you need to heal.", ku: "هەموو کاتێک کە پێویستتە بۆ چاکبوونەوە وەربگرە." },
      { en: "You're not alone in this.", ku: "تۆ لەم بارەدا بەتەنیا نیت." },
      { en: "I believe in you — you've got this.", ku: "باوەڕم پێیە — دەتوانیت." },
      { en: "Let me know if you need anything at all.", ku: "پێم بڵێ ئەگەر بە هیچ شتێک پێویستت بوو." },
    ],
    {
      convos: [
        {
          situation: "هاوڕێیەکت بەدەست هەستێکی قورسدا",
          theyAsk: "I just found out my grandma is in the hospital.",
          correct: "That sounds really tough — I'm sorry. I'm here for you no matter what. Let me know if you need anything.",
          wrong1: "Hospitals are normal.",
          wrong2: "Don't be sad.",
          wrong3: "I have no time to help.",
          explanation: "'That sounds really tough' + 'I'm here for you' — پشتگیری بەبێ بڕیاردان بە کەسەکە",
        },
        {
          situation: "هاوکارێk لە پێش چاوپێکewtinێki گرنگدا",
          theyAsk: "I'm so nervous about tomorrow's presentation.",
          correct: "I believe in you — you've got this. You're not alone — we can practice together tonight.",
          wrong1: "You will fail probably.",
          wrong2: "Presentations are easy.",
          wrong3: "Don't talk to me about work.",
          explanation: "'You've got this' = 'دەتوانیت' — هاندانی زۆr باو لە ئینگلیزی",
        },
      ],
    },
  ),

  buildLesson(
    "Dating & Romance",
    "خۆشەویستی و پەیwەندی",
    [
      { en: "I'd love to take you out sometime.", ku: "حەز دەکەم جارێk بە دەرەوە ببەین." },
      { en: "I had a really great time on our date.", ku: "کاتێki زۆr خۆشم لە دەرچوونەکەماندا بەسەر برد." },
      { en: "You make me smile every time we talk.", ku: "هەر جارێk قسە دەکەین پێکەنینم دەکەیت." },
      { en: "I'm not looking for anything serious right now.", ku: "ئێستا بەدوای شتێki جدی ناگەڕێم." },
      { en: "I think we'd make a great team.", ku: "پێم وایە تیمێki نایاب دەبین." },
      { en: "Can I be honest about how I feel?", ku: "دەتوانم ڕاستگۆ بم دەربارەی هەستەکانم؟" },
    ],
    {
      convos: [
        {
          situation: "دوای یەکەم دەرچوون",
          theyAsk: "Did you get home safely?",
          correct: "Yes, thanks! I had a really great time on our date. I'd love to do it again.",
          wrong1: "Date was boring.",
          wrong2: "Don't text me.",
          wrong3: "Home is far.",
          explanation: "'I had a really great time' — وەڵamێki گەرم دوای دەرچوون",
        },
        {
          situation: "دەتewێت ڕاستگۆ بیت دەrbارەی هەستەکانت",
          theyAsk: "We've been seeing each other for a few weeks now.",
          correct: "Can I be honest about how I feel? I think we'd make a great team — I really like where this is going.",
          wrong1: "I don't like you.",
          wrong2: "Stop seeing me.",
          wrong3: "Feelings are not important.",
          explanation: "'Can I be honest about how I feel?' — دەستpێki گفتوگۆیەکی کراوە و ڕێزدار",
        },
      ],
    },
  ),

  buildLesson(
    "Family Talk",
    "قسە لەسەر خێزان",
    [
      { en: "My parents are visiting next month.", ku: "دایk و باوkم مانگی داهاتوو سەردان دەکەن." },
      { en: "I need to call my sister back tonight.", ku: "پێویستە ئەمشew پەیwەndi بکemەوە بە خوشkم." },
      { en: "Family dinners can get pretty loud at our house.", ku: "خواردنی خێزانی لە ماڵەکەماندا زۆr دەng بەرz دەبێت." },
      { en: "I'm the oldest, so I help with the kids a lot.", ku: "من گەورەترینم، بۆیە زۆr یارmەتی منداڵان دەdەم." },
      { en: "We try to video call every Sunday.", ku: "هەوڵ دەdەین هەموو یekkshanbە پەیwەndiی ڤیدیۆیی بکەین." },
      { en: "My brother just got engaged — we're all thrilled.", ku: "براکەم تازە خطوبەی کرد — هەموومان دڵخۆشین." },
    ],
    {
      convos: [
        {
          situation: "هاwکارێk دەپرسێت بۆچی ئەم هەftەیە کاتت نییە",
          theyAsk: "Are you free to cover my shift this weekend?",
          correct: "Sorry, my parents are visiting next month and I need to get the house ready — this weekend is packed.",
          wrong1: "Family is not important.",
          wrong2: "I don't have parents.",
          wrong3: "Weekend I sleep only.",
          explanation: "باسکردنی خێزان بە شێwazi ئاسایی — 'parents are visiting' زۆr باوە",
        },
        {
          situation: "هاwڕێیەکt دەپرسێت چۆnە لەگەڵ برا/خوشk",
          theyAsk: "How's your relationship with your siblings?",
          correct: "Pretty good! My brother just got engaged — we're all thrilled. We try to video call every Sunday.",
          wrong1: "I hate my siblings.",
          wrong2: "Brother is bad person.",
          wrong3: "We never talk.",
          explanation: "'Got engaged' = خطوبە کر | 'video call every Sunday' — باسکردنی پەیwەندی خێزان",
        },
      ],
    },
  ),

  buildLesson(
    "Disagreements with Loved Ones",
    "ناکۆki لەگەڵ خۆشەویستەکان",
    [
      { en: "I hear what you're saying, but I disagree.", ku: "گوێم لێیە، بەڵam ڕazi نیم." },
      { en: "I didn't mean to hurt your feelings.", ku: "مەبەستم ئەوە نەبوو ئازارت bdەم." },
      { en: "Can we talk about this calmly?", ku: "دەتوانین بە ئarامی لەسەر ئەمە قسە bکەین؟" },
      { en: "I think we're both a little frustrated.", ku: "پێm وایە هەردومان کەmێk تووڕەین." },
      { en: "I want to understand your side better.", ku: "dەمewێت باشتر لایەنەکەت tێbگem." },
      { en: "Let's not go to bed angry.", ku: "با تووڕە nەbin بە خew." },
    ],
    {
      convos: [
        {
          situation: "هاwڕێیەکt لەسەر bڕiارێk nاکۆki dەکات",
          theyAsk: "I can't believe you didn't tell me about the trip!",
          correct: "I hear what you're saying, but I didn't mean to hurt your feelings. Can we talk about this calmly?",
          wrong1: "You are too sensitive.",
          wrong2: "Trip is my business only.",
          wrong3: "Stop talking to me.",
          explanation: "'I hear what you're saying' + 'didn't mean to hurt' — nاکۆki بە شێwazi ڕێzدار",
        },
        {
          situation: "lەگەڵ haوسەرەکەت nاکۆki",
          theyAsk: "You always leave the dishes for me!",
          correct: "I think we're both a little frustrated. I want to understand your side better — let's figure this out together.",
          wrong1: "Dishes are your job.",
          wrong2: "I do everything already.",
          wrong3: "Leave the house.",
          explanation: "'Understand your side' و 'figure this out together' — چarەسەرکردn لەجیati زیadکردنی nاکۆki",
        },
      ],
    },
  ),

  buildLesson(
    "Breakups & Moving On",
    "جدakردnەوە و بەردewамбوon",
    [
      { en: "We decided to go our separate ways.", ku: "bڕiarmandا ڕێgaman jia bکەین." },
      { en: "It's been hard, but I'm doing okay.", ku: "qورs بووە، بەڵam باشm." },
      { en: "I need some space to figure things out.", ku: "pێویستm بە بۆshاییە بۆ ڕwونکردnەوە." },
      { en: "No hard feelings — I wish you the best.", ku: "bێ تووڕەیی — sەرkewtنت دەxوazm." },
      { en: "I'm focusing on myself for a while.", ku: "bۆ mاوeyek sەرنج دەdەمە خۆm." },
      { en: "Time really does help with healing.", ku: "kات بەڕastی yارmەti چakبوonەوە dەdات." },
    ],
    {
      convos: [
        {
          situation: "haوڕێیەکt دەپرسێت چۆni دوai jدakردnەوە",
          theyAsk: "How are you holding up after the breakup?",
          correct: "It's been hard, but I'm doing okay. I'm focusing on myself for a while — time really does help.",
          wrong1: "I am destroyed forever.",
          wrong2: "Breakup is nothing.",
          wrong3: "Don't ask personal questions.",
          explanation: "'Doing okay' و 'focusing on myself' — دەrbڕini ئasایی دوai jدakردnەوە",
        },
        {
          situation: "pێshوویەکt دەپرسێت چۆnە",
          theyAsk: "Hey, I saw you're dating someone new.",
          correct: "Yeah — no hard feelings, I wish you the best. We decided to go our separate ways and I'm at peace with it.",
          wrong1: "I hate you now.",
          wrong2: "New person is bad.",
          wrong3: "We must get back together.",
          explanation: "'No hard feelings' و 'wish you the best' — kۆtaiyeki ڕێzدار",
        },
      ],
    },
  ),

  buildLesson(
    "Celebrating Together",
    "ئahەnggێrani پێkەوە",
    [
      { en: "I'm so proud of everything you've accomplished.", ku: "zۆr shanazim بە hەموu awەی bەdەstt hێnawە." },
      { en: "You deserve to celebrate — this is huge!", ku: "shayani ئahەnggێrani — ئemە gەwreyە!" },
      { en: "Let's raise a toast to your success!", ku: "ba gڵasێk bەرz bکەinewە bۆ sەرkewtnەکet!" },
      { en: "I knew you could do it all along.", ku: "lە sەرetawa dەzanm dەtoani." },
      { en: "This calls for a celebration!", ku: "ئemە shayani ئahەnggێraniyە!" },
      { en: "Happy birthday — hope your day is amazing!", ku: "bەڕێzkewtin — hیwadarm ڕۆjەکet nawazeyە bێت!" },
    ],
    {
      convos: [
        {
          situation: "haوڕێیەکt bڕwanamay wەرgrt",
          theyAsk: "I finally graduated!",
          correct: "I'm so proud of everything you've accomplished! This calls for a celebration — let's raise a toast!",
          wrong1: "Graduation is normal.",
          wrong2: "Now get job quickly.",
          wrong3: "I don't care.",
          explanation: "'This calls for a celebration' — دەستpێki ئahەnggێran | 'raise a toast' = gڵas bەرzکردnەوە",
        },
        {
          situation: "haوkarێk plە bەرzkrایەوە",
          theyAsk: "They offered me the manager position!",
          correct: "I knew you could do it all along! You deserve to celebrate — this is huge!",
          wrong1: "Manager job is hard.",
          wrong2: "You got lucky only.",
          wrong3: "Promotion means more work.",
          explanation: "'I knew you could do it all along' — hاندani ڕastەقینە بۆ sەرkewtn",
        },
      ],
    },
  ),

  buildLesson(
    "Long Distance",
    "دوور لە yekتر",
    [
      { en: "I miss you — wish you were here.", ku: "kەsit dەکem — xۆshm dەوێت lێrە bوayit." },
      { en: "The time difference makes it tough to call.", ku: "jiawazi kات qورs dەکat pەیwەndi bکەin." },
      { en: "Let's plan a visit soon — I need to see you.", ku: "ba bəm zwanە sەrdanێk plan bکەin — pێویستە bینit." },
      { en: "Sending you a big hug from far away.", ku: "bەغlێki gەwret dەنێrm lە dourەوە." },
      { en: "We'll make this work — I believe in us.", ku: "ئemە kardەکat — bawerim bە emeyە." },
      { en: "Counting down the days until we meet.", ku: "ڕۆjەکان dەژmێrm ta dەbininewە." },
    ],
    {
      convos: [
        {
          situation: "haوڕێیەکt lە welatێki trە",
          theyAsk: "It's been three months since we last saw each other.",
          correct: "I miss you — wish you were here. Let's plan a visit soon. Counting down the days until we meet!",
          wrong1: "Three months is nothing.",
          wrong2: "Don't visit me.",
          wrong3: "Forget our friendship.",
          explanation: "'Counting down the days' — dەڵێت bە pەلە چawerewey بینinewە",
        },
        {
          situation: "pەیwەndi dour lە yektr qورsە",
          theyAsk: "Sorry I couldn't call — work has been crazy.",
          correct: "No worries — the time difference makes it tough. We'll make this work. Sending you a big hug from far away!",
          wrong1: "You never call me.",
          wrong2: "Work is excuse.",
          wrong3: "End friendship now.",
          explanation: "'The time difference makes it tough' — tێgەیشتn lە kێshەی pەیwەndi dour",
        },
      ],
    },
  ),

  buildLesson(
    "Emotional Intelligence",
    "zirەکi sۆzdari",
    [
      { en: "I appreciate you opening up to me.", ku: "supasgozaram kە lەgەڵm kravet." },
      { en: "It's okay to not be okay sometimes.", ku: "katێk baش nەbit — asayiyە." },
      { en: "Your feelings are completely valid.", ku: "hەstekant bə tawawi drust u gringn." },
      { en: "I'm not trying to fix you — just listen.", ku: "hەوڵ nadem charaseri — tenha gue degrem." },
      { en: "Thank you for trusting me with this.", ku: "supas bō awey metmanet piyem krd." },
      { en: "Would it help to talk it through together?", ku: "yarmetider debet pikewa qsey le bkeyn?" },
    ],
    {
      convos: [
        {
          situation: "haوڕێیەکt دەستbەjێ ڕastgo debet dərbarey kێsheyek",
          theyAsk: "I've never told anyone this before...",
          correct: "Thank you for trusting me with this. I'm not trying to fix you — just listen. Your feelings are completely valid.",
          wrong1: "That is not a big problem.",
          wrong2: "You should not feel that way.",
          wrong3: "Tell someone else.",
          explanation: "'Your feelings are valid' + 'not trying to fix you' — guegirtni chalak",
        },
        {
          situation: "kەsێk dėlێت hەst bə xembarbun dەکat",
          theyAsk: "I feel like I should be over this by now.",
          correct: "It's okay to not be okay sometimes. Would it help to talk it through together?",
          wrong1: "Get over it faster.",
          wrong2: "Sadness is weakness.",
          wrong3: "Stop feeling sad.",
          explanation: "'It's okay to not be okay' — jumleyek bānawang bō pشتgiri sōzdari",
        },
      ],
    },
  ),
];

export default unit09;
