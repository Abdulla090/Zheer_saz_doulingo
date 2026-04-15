import { UnitBank } from "../types";

// ── Unit 1: Hanging Out & Plans — 10 unique lessons ───────────────────────────
const unit01: UnitBank = [

  // Lesson 0: Inviting Friends
  {
    topic: "Inviting Friends", topicKu: "بانگهێشتکردنی هاوڕێیان",
    words: [
      { english: "Wanna hang",      kurdish: "با بچینە دەرەوە"    },
      { english: "Let's link up",   kurdish: "با یەکتر ببینین"    },
      { english: "Come through",    kurdish: "سەردانمان بکە"      },
      { english: "You down",        kurdish: "ئامادەی؟ / ڕازیت؟" },
      { english: "Let's roll",      kurdish: "کەوتینە ڕێ"         },
    ],
    voices: [
      { prompt: "بانگهێشتی هاوڕێیەک بکە",    target: "Hey wanna hang tonight?",       targetKurdish: "ئەی، ئەمشەو دەردەچیت؟"   },
      { prompt: "کۆبوونەوەی هاوڕێیان",      target: "Come through, we're all here!", targetKurdish: "وەرە بۆ ئێرە، هەموومان لێرەین!"},
    ],
    sentences: [
      { english: ["Hey",   "wanna",  "hang",   "tonight"],          kurdish: "ئەی، ئەمشەو دەردەچیت؟"    },
      { english: ["Come",  "through","we're",  "all",    "here"],   kurdish: "وەرە بۆ ئێرە، هەموومان لێرەین"},
    ],
    fillBlanks: [
      { parts: ["",      "through, it's gonna be fun!"],  hint: "وەرە بۆ ئێرە، خۆش دەبێت!",    answer: "Come",     wrongs: ["Go", "Get", "Walk"]          },
      { parts: ["You",   "for tonight?"],                  hint: "ئامادەی بۆ ئەمشەو؟",          answer: "down",     wrongs: ["up", "ready", "good"]        },
    ],
    conversations: [
      { situation: "لە نامەدا لەگەڵ هاوڕێیەک", theyAsk: "Hey, we're all hanging at Jake's place. You down?", correct: "Yeah I'm down! What time should I come through?", wrong1: "Yes I want to come to Jake's.", wrong2: "I will attend the gathering.", wrong3: "Affirmative, I shall be present.", explanation: "'Yeah I'm down! What time should I come through?' — وەڵامێکی گونجاو و باوە" },
    ],
  },

  // Lesson 1: Making Plans
  {
    topic: "Making Plans", topicKu: "دانانی پلان",
    words: [
      { english: "I'm down",        kurdish: "من ڕازیم"            },
      { english: "What time",       kurdish: "کاتژمێر چەند؟"       },
      { english: "Let's meet at",   kurdish: "با یەکتر ببینین لە"   },
      { english: "Count me in",     kurdish: "حیساب لەسەر منیش بکەن"},
      { english: "Pencil me in",    kurdish: "ناوم بنووسە"         },
    ],
    voices: [
      { prompt: "پلانێک دابنێ",         target: "Let's meet at seven — sound good?", targetKurdish: "با کاتژمێر حەوت یەکتر ببینین — باشە؟" },
      { prompt: "ڕازی بە",             target: "Count me in, I'll be there!",       targetKurdish: "حیساب لەسەر منیش بکەن، لەوێ دەبم!"  },
    ],
    sentences: [
      { english: ["Let's", "meet",   "at",    "seven"],            kurdish: "با کاتژمێر حەوت یەکتر ببینین"      },
      { english: ["Count", "me",     "in",    "I'll",   "be","there"],kurdish: "حیساب لەسەر من بکەن، لەوێ دەبم" },
    ],
    fillBlanks: [
      { parts: ["Count", "in, sounds like a plan!"],    hint: "حیساب لەسەر منیش بکەن",                answer: "me",       wrongs: ["us", "him", "them"]          },
      { parts: ["Let's", "at the coffee shop at 3"],     hint: "با یەکتر ببینین لە قاوەخانەکە کاتژمێر ٣", answer: "meet", wrongs: ["go", "be", "eat"]       },
    ],
    conversations: [
      { situation: "پلانی ئەمشەو", theyAsk: "So when are we meeting?", correct: "How about 7 at that new pizza place downtown?", wrong1: "We can meet at 7 o'clock.", wrong2: "Meeting time is seven in the evening.", wrong3: "I suggest 19:00 hours at the restaurant.", explanation: "'How about 7 at that new pizza place' — وەڵامێکی ئاسایی و سروشتییە" },
    ],
  },

  // Lesson 2: Cancelling Plans
  {
    topic: "Cancelling Plans", topicKu: "هەڵوەشاندنەوەی پلان",
    words: [
      { english: "Rain check",      kurdish: "با بۆ کاتێکی تر بێت" },
      { english: "Something came up",kurdish: "ئیشێکم بۆ دروست بوو" },
      { english: "Can we reschedule",kurdish: "دەتوانین کاتەکەی بگۆڕین؟"},
      { english: "I'm swamped",     kurdish: "زۆر سەرقاڵم"         },
      { english: "Bailing on you",  kurdish: "پەشیمانبوونەوە"      },
    ],
    voices: [
      { prompt: "پلانەکە بگۆڕە",         target: "Hey, something came up — can we reschedule?", targetKurdish: "ئەی، ئیشێکم بۆ دروست بوو — دەتوانین کاتەکەی بگۆڕین؟"},
      { prompt: "داوای لێبوردن بکە",     target: "I'm so sorry for bailing on you like this",    targetKurdish: "زۆر داوای لێبوردن دەکەم کە بەم شێوەیە پەشیمان بوومەوە"},
    ],
    sentences: [
      { english: ["Hey",  "something","came",  "up",    "can","we","reschedule"], kurdish: "ئەی، ئیشێکم بۆ دروست بوو، دەتوانین کاتەکەی بگۆڕین؟"},
      { english: ["I'm",  "so",       "sorry", "for",   "bailing","on","you"],   kurdish: "زۆر داوای لێبوردن دەکەم کە پەشیمان بوومەوە" },
    ],
    fillBlanks: [
      { parts: ["Can we take a",  "on this?"],       hint: "دەتوانین بیخەینە کاتێکی تر؟", answer: "rain check",wrongs: ["break", "pause", "wait"]    },
      { parts: ["Something",      "up — so sorry!"],  hint: "ئیشێکم بۆ دروست بوو",       answer: "came",      wrongs: ["showed", "popped", "turned"] },
    ],
    conversations: [
      { situation: "پلانی ئەمشەو لەگەڵ هاوڕێیەک", theyAsk: "Hey, we still on for tonight?", correct: "Ugh, I'm so sorry — something came up at work. Rain check?", wrong1: "Sorry I cannot come tonight.", wrong2: "I have to cancel our plans.", wrong3: "Tonight is not possible for me.", explanation: "'Something came up. Rain check?' — کورت، سروشتی، و بەڕێزانەیە" },
    ],
  },

  // Lesson 3: Being Late
  {
    topic: "Being Late", topicKu: "دواکەوتن",
    words: [
      { english: "Running late",    kurdish: "دواکەوتووم"          },
      { english: "On my way",       kurdish: "لە ڕێگام"            },
      { english: "Be there in",     kurdish: "دوای ... لەوێ دەبم"   },
      { english: "Give me five",    kurdish: "پێنج خولەکم پێبدە"   },
      { english: "Just leaving now",kurdish: "هەر ئێستا بەڕێکەوتم" },
    ],
    voices: [
      { prompt: "بڵێ کە دواکەوتوویت",   target: "Hey I'm running late — be there in 10!", targetKurdish: "ئەی من دواکەوتووم — ١٠ خولەکی تر لەوێ دەبم!"},
      { prompt: "ڕوونکردنەوەیەکی هێمنانە",target: "Just leaving now, give me like 15",    targetKurdish: "هەر ئێستا بەڕێکەوتم، کەمێک مۆڵەتم بدە نزیکەی ١٥ خولەک"},
    ],
    sentences: [
      { english: ["I'm",  "running", "late",  "be",    "there","in","ten"],kurdish: "دواکەوتووم، ١٠ خولەکی تر لەوێ دەبم" },
      { english: ["Just", "leaving", "now",   "give",  "me",    "fifteen"],kurdish: "هەر ئێستا بەڕێکەوتم، ١٥ خولەکم پێبدە" },
    ],
    fillBlanks: [
      { parts: ["I'm",   "late, so sorry!"],      hint: "دواکەوتووم، زۆر داوای لێبوردن دەکەم!",    answer: "running",   wrongs: ["getting", "being", "coming"]  },
      { parts: ["I'm on","— be there soon!"],      hint: "لە ڕێگام — بەمزووانە دەگەم!",         answer: "my way",    wrongs: ["the road", "it", "foot"]     },
    ],
    conversations: [
      { situation: "دواکەوتن بۆ قاوەخانە", theyAsk: "Bro, where are you?? We've been here for 20 mins!", correct: "I know I know, so sorry! Running late — be there in 5, I promise!", wrong1: "I am sorry I am running late.", wrong2: "My apologies I will arrive shortly.", wrong3: "Sorry for the delay I come soon.", explanation: "'I know I know, so sorry! Be there in 5!' — وەڵامێکی خێرا و سروشتییە" },
    ],
  },

  // Lesson 4: At a Party
  {
    topic: "At a Party", topicKu: "لە ئاهەنگێکدا",
    words: [
      { english: "This is lit",      kurdish: "ئەمە زۆر نایابە"    },
      { english: "Having a blast",   kurdish: "کاتێکی زۆر خۆش بەسەردەبەم"},
      { english: "Vibing",           kurdish: "لە جەوەکەدام"       },
      { english: "The crowd",        kurdish: "ئامادەبووان"        },
      { english: "Epic night",       kurdish: "شەوێکی مێژوویی"     },
    ],
    voices: [
      { prompt: "وەسفی ئاهەنگەکە بکە",  target: "Dude this party is absolutely lit!", targetKurdish: "کابرا ئەم ئاهەنگە بەڕاستی نایابە!" },
      { prompt: "دەربڕینی دڵخۆشی",      target: "I'm having such a blast right now",  targetKurdish: "لە ئێستادا کاتێکی زۆر خۆش بەسەردەبەم" },
    ],
    sentences: [
      { english: ["Dude",  "this",  "party", "is",    "lit"],           kurdish: "کابرا ئەم ئاهەنگە زۆر نایابە" },
      { english: ["I'm",   "having","such",  "a",     "blast"],         kurdish: "کاتێکی زۆر خۆش بەسەردەبەم"   },
    ],
    fillBlanks: [
      { parts: ["This",   "is absolutely lit!"],     hint: "ئەمە بەڕاستی نایابە!",               answer: "party",   wrongs: ["place", "night", "crowd"]    },
      { parts: ["I'm",    "such a good time!"],       hint: "کاتێکی زۆر خۆش بەسەردەبەم!",        answer: "having",  wrongs: ["getting", "taking", "doing"]  },
    ],
    conversations: [
      { situation: "لە ئاهەنگێک کەسێکی نوێ دەبینیت", theyAsk: "First time here? What do you think?", correct: "It's amazing! The vibe is great, I'm totally having a blast!", wrong1: "Yes it is good here I like it.", wrong2: "The party is nice and enjoyable.", wrong3: "I am experiencing positive emotions here.", explanation: "'The vibe is great, I'm totally having a blast!' — بەپەرۆش و سروشتییە" },
    ],
  },

  // Lesson 5: Texting Language
  {
    topic: "Texting & Shortcuts", topicKu: "کورتکراوە دەقییەکان",
    words: [
      { english: "BRB",     kurdish: "زوو دەگەڕێمەوە"      },
      { english: "OMG",     kurdish: "ئای خوایە"           },
      { english: "Lol",     kurdish: "پێکەنین"             },
      { english: "NGL",     kurdish: "ڕاستیت پێ بڵێم"      },
      { english: "TBH",     kurdish: "بۆ ئەوەی ڕاستگۆ بم"  },
    ],
    voices: [
      { prompt: "وەڵامدانەوەی نامە",  target: "BRB, I gotta take this call",    targetKurdish: "زوو دەگەڕێمەوە، دەبێت وەڵامی ئەم پەیوەندییە بدەمەوە"},
      { prompt: "ڕاستگۆیانە قسە بکە", target: "NGL that was actually hilarious",  targetKurdish: "ڕاستیت پێ بڵێم ئەوە بەڕاستی کۆمیدی بوو" },
    ],
    sentences: [
      { english: ["BRB",  "gotta",  "take",  "this",   "call"],     kurdish: "زوو دەگەڕێمەوە، دەبێت وەڵامی ئەم پەیوەندییە بدەمەوە"},
      { english: ["NGL",  "that",   "was",   "actually","hilarious"],kurdish: "ڕاستیت پێ بڵێم ئەوە بەڕاستی کۆمیدی بوو" },
    ],
    fillBlanks: [
      { parts: ["",      "that literally made me cry laughing!"], hint: "ئای خوایە! ئەوە وای لێکردم لە پێکەنینا بگریم", answer: "OMG",    wrongs: ["BRB", "NGL", "Lol"]         },
      { parts: ["",      ", she's actually right about this!"],   hint: "بۆ ئەوەی ڕاستگۆ بم، ئەو لەمەدا ڕاست دەکات!",    answer: "TBH",    wrongs: ["OMG", "BRB", "NGL"]          },
    ],
    conversations: [
      { situation: "گرووپی نامەگۆڕینەوەی هاوڕێیان", theyAsk: "Did you see what happened on the show last night?? 😭", correct: "OMG YES I screamed! NGL I did not see that coming at all!", wrong1: "Yes I saw it was very surprising.", wrong2: "I viewed the show and was shocked.", wrong3: "Affirmative, the event was unexpected.", explanation: "'OMG YES I screamed! NGL...' — شێوازی نامەگۆڕینەوەی باو و سروشتی" },
    ],
  },

  // Lesson 6: Watching TV/Movies
  {
    topic: "Watching TV & Movies", topicKu: "سەیرکردنی فیلم و زنجیرە",
    words: [
      { english: "Have you seen",    kurdish: "سەیرت کردووە؟"        },
      { english: "You gotta watch",  kurdish: "دەبێت سەیری بکەیت"    },
      { english: "Binge-watching",   kurdish: "بەردەوام سەیرکردن"    },
      { english: "Cliffhanger",      kurdish: "کۆتایی هەڵپەسێردراو"  },
      { english: "Plot twist",       kurdish: "گۆڕانکاری چاوەڕواننەکراو"},
    ],
    voices: [
      { prompt: "فیلمێک پێشنیار بکە",  target: "You HAVE to watch this show, it's that good!",  targetKurdish: "دەبێت سەیری ئەم زنجیرەیە بکەیت، زۆر شازە!" },
      { prompt: "زنجیرەیەکی نوێ",      target: "I've been binge-watching it all week",            targetKurdish: "هەموو هەفتەکە بەردەوام سەیرم کردووە" },
    ],
    sentences: [
      { english: ["You","have",   "to",   "watch",  "this","show"],   kurdish: "دەبێت سەیری ئەم زنجیرەیە بکەیت" },
      { english: ["I've","been",  "binge","watching","it",  "all","week"],kurdish: "هەموو هەفتەکە بەردەوام سەیرم کردووە" },
    ],
    fillBlanks: [
      { parts: ["Have you",    "Severance yet?"],             hint: "تا ئێستا سەیری سێڤرەنست کردووە؟",                   answer: "seen",        wrongs: ["watched", "found", "heard"]    },
      { parts: ["That",        "at the end blew my mind!"],  hint: "ئەو گۆڕانکارییە چاوەڕواننەکراوەی کۆتایی مێشکی وەستاندم!", answer: "plot twist",wrongs: ["ending", "scene", "part"]     },
    ],
    conversations: [
      { situation: "هاوڕێیەک پرسیار دەکات", theyAsk: "What are you watching these days?", correct: "I just started The Bear — you gotta watch it, it's insane!", wrong1: "I am watching a show called The Bear.", wrong2: "Currently my viewing is The Bear show.", wrong3: "The Bear is a show I recommend for you.", explanation: "'You gotta watch it, it's insane!' — شێوازێکی باوە بۆ پێشنیارکردن" },
    ],
  },

  // Lesson 7: Weekend Plans
  {
    topic: "Weekend Plans", topicKu: "پلانی کۆتایی هەفتە",
    words: [
      { english: "What are you up to",kurdish: "چی دەکەیت؟"            },
      { english: "Free this weekend", kurdish: "ئەم کۆتایی هەفتەیە کاتت هەیە؟"},
      { english: "Chilling at home",  kurdish: "لە ماڵەوە پشوودەدەم"   },
      { english: "Keeping it low key",kurdish: "بە هێمنی و نهێنی دەیهێڵمەوە"},
      { english: "Big weekend",       kurdish: "کۆتایی هەفتەی پڕ چالاکی"},
    ],
    voices: [
      { prompt: "پرسیار بکە",           target: "What are you up to this weekend?",      targetKurdish: "ئەم کۆتایی هەفتەیە بەتەمای چیت؟" },
      { prompt: "وەڵامێکی هێمنانە",      target: "Nothing much, just keeping it low key", targetKurdish: "هیچ شتێکی تایبەت، تەنها لە ماڵەوە پشوو دەدەم"},
    ],
    sentences: [
      { english: ["What",  "are",    "you",    "up",    "to","this","weekend"], kurdish: "ئەم کۆتایی هەفتەیە بەتەمای چیت؟" },
      { english: ["Just",  "keeping","it",     "low",   "key","at","home"],     kurdish: "تەنها بە هێمنی لە ماڵەوە دەمێنمەوە" },
    ],
    fillBlanks: [
      { parts: ["What are you",  "to this Saturday?"],       hint: "ئەم شەممەیە بەتەمای چیت؟",               answer: "up",         wrongs: ["doing", "planning", "having"]  },
      { parts: ["Just",          "low key — nothing crazy!"],hint: "تەنها بە هێمنی — هیچ شتێکی سەیر نییە!", answer: "keeping it", wrongs: ["taking it", "going", "doing"]  },
    ],
    conversations: [
      { situation: "ڕۆژی دووشەممە لە سەر کار", theyAsk: "How was your weekend?", correct: "Honestly, it was much needed — just chilled at home and recharged.", wrong1: "My weekend was good thank you.", wrong2: "I spent the weekend at home resting.", wrong3: "The weekend was relaxing and fine.", explanation: "'It was much needed — just chilled and recharged' — ئینگلیزییەکی هێمنانە و پێگەیشتووانەیە" },
    ],
  },

  // Lesson 8: Ending the Night
  {
    topic: "Ending the Night", topicKu: "کۆتایی شەو",
    words: [
      { english: "I'm heading out",  kurdish: "من دەڕۆم"            },
      { english: "Let's do this again",kurdish: "با دووبارەی بکەینەوە"},
      { english: "That was fun",     kurdish: "زۆر خۆش بوو"          },
      { english: "Safe drive home",  kurdish: "بە سەلامەتی بگەیتەوە" },
      { english: "Hit me up",        kurdish: "نامەم بۆ بنێرە"       },
    ],
    voices: [
      { prompt: "ماڵئاوایی بکە",         target: "Alright guys I'm heading out — great night!", targetKurdish: "باشە هاوڕێیان، من دەڕۆم — شەوێکی زۆر خۆش بوو!" },
      { prompt: "بە گەرمی ماڵئاوایی بکە", target: "Let's definitely do this again soon!",        targetKurdish: "بە دڵنیاییەوە با بەمزووانە دووبارەی بکەینەوە!" },
    ],
    sentences: [
      { english: ["Alright","guys",  "I'm",  "heading","out"],           kurdish: "باشە هاوڕێیان، من دەڕۆم" },
      { english: ["Let's",  "definitely","do","this",  "again","soon"],  kurdish: "بە دڵنیاییەوە با بەمزووانە دووبارەی بکەینەوە"},
    ],
    fillBlanks: [
      { parts: ["I'm",     "out — great seeing everyone!"],  hint: "من دەڕۆم — زۆر خۆشحاڵ بووم بە بینینی هەمووتان!", answer: "heading",    wrongs: ["going", "heading", "walking"] },
      { parts: ["That was","! Let's do it again!"],           hint: "ئەوە زۆر خۆش بوو! با دووبارەی بکەینەوە!",         answer: "so fun",      wrongs: ["nice", "good", "great"]       },
    ],
    conversations: [
      { situation: "کۆتایی شەو لەگەڵ هاوڕێیان", theyAsk: "This was honestly such a good night.", correct: "Right?! We should do this way more often. Hit me up next week!", wrong1: "Yes it was a good evening.", wrong2: "I agree the night was enjoyable.", wrong3: "The event was positive and successful.", explanation: "'Right?! We should do this more often!' — وزەبەخش و سروشتییە" },
    ],
  },

  // Lesson 9: Dealing with FOMO
  {
    topic: "FOMO & Missing Out", topicKu: "شەرمەزاری و بێبەشبوون",
    words: [
      { english: "FOMO",             kurdish: "ترسی بێبەشبوون لە شتێک"},
      { english: "Missed out",       kurdish: "بێبەش بووم"           },
      { english: "Should've been",   kurdish: "دەبوایە لەوێ بوومایە" },
      { english: "Next time for sure",kurdish: "جاری داهاتوو بە دڵنیاییەوە"},
      { english: "Fill me in",       kurdish: "بۆمی باس بکە"         },
    ],
    voices: [
      { prompt: "پەشیمانی دەربڕە",    target: "Ugh I have serious FOMO right now",       targetKurdish: "ئاهـ، ئێستا بەڕاستی هەست بە ترسی بێبەشبوون دەکەم" },
      { prompt: "داوای زانیاری بکە", target: "Fill me in! What did I miss?",             targetKurdish: "بۆمی باس بکە! چی ڕوویدا و لە چیم لەدەستدا؟"},
    ],
    sentences: [
      { english: ["I",    "have",   "serious","FOMO",   "right","now"],  kurdish: "لەم ساتەدا هەست بە ترسی بێبەشبوون دەکەم" },
      { english: ["Fill", "me",     "in",     "what",   "did", "I","miss"],kurdish: "بۆمی باس بکە، چیم لەدەستچوو؟" },
    ],
    fillBlanks: [
      { parts: ["I totally",  "out on last night!"],  hint: "بە تەواوی لە ئاهەنگەکەی دوێنێ شەو بێبەش بووم!", answer: "missed",     wrongs: ["slept", "passed", "stayed"]   },
      { parts: ["Next time",  "— I'll be there!"],    hint: "جاری داهاتوو بە دڵنیاییەوە — لەوێ دەبم!",       answer: "for sure",   wrongs: ["OK", "I promise", "definitely"] },
    ],
    conversations: [
      { situation: "دواکەوتن لە دەرچوونێک", theyAsk: "Dude you should've been there last night!", correct: "I know, the FOMO is REAL. Fill me in — what happened?", wrong1: "I am sorry I could not attend.", wrong2: "I missed the event unfortunately.", wrong3: "Please tell me the events of last night.", explanation: "'The FOMO is REAL. Fill me in!' — ئینگلیزییەکی باو و هاوچەرخە بۆ گەنجان" },
    ],
  },
];

export default unit01;
