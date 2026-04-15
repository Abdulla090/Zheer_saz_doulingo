import { UnitBank } from "../types";

// Helper to make a minimal but valid LessonBank quickly
// Unit 2: Daily Talk — 10 unique lessons
const unit02: UnitBank = [
  {
    topic: "Talking About Your Day", topicKu: "قسەکردن لەسەر ڕۆژەکەت",
    words: [
      { english: "Rough day",    kurdish: "ڕۆژێکی قورس"        },
      { english: "Killing it",   kurdish: "زۆر شازت کرد"       },
      { english: "Long day",     kurdish: "ڕۆژێکی درێژ"        },
      { english: "Went well",    kurdish: "باش بەڕێوەچوو"      },
      { english: "Not my day",   kurdish: "ئەمڕۆ ڕۆژی من نییە" },
    ],
    voices: [
      { prompt: "بەقورسی ڕۆژەکەت بڵێ",   target: "Man today was a rough one",        targetKurdish: "کابرا، ئەمڕۆ ڕۆژێکی قورس بوو"             },
      { prompt: "دەربڕینی دڵخۆشی بە ڕۆژەکەت", target: "Today actually went pretty well!",  targetKurdish: "ئەمڕۆ بەڕاستی باش بەڕێوەچوو!"          },
    ],
    sentences: [
      { english: ["Man",  "today",  "was",  "a",    "rough", "one"],     kurdish: "کابرا ئەمڕۆ ڕۆژێکی قورس بوو"       },
      { english: ["Today","actually","went","pretty","well"],             kurdish: "ئەمڕۆ بەڕاستی باش بەڕێوەچوو"    },
    ],
    fillBlanks: [
      { parts: ["Today",  "actually went pretty well!"],hint: "ئەمڕۆ بەڕاستی باش بەڕێوەچوو!",  answer: "just",    wrongs: ["kind of", "barely", "nearly"]  },
      { parts: ["Man it's such a", "today!"], hint: "کابرا، ئەمڕۆ ڕۆژێکی زۆر درێژە!", answer: "long day", wrongs: ["good day", "short one", "fine"] },
    ],
    conversations: [
      { situation: "هاوکارێک پرسیار دەکات", theyAsk: "How was your day?", correct: "Honestly, it was a rough one — but I'm pushing through!", wrong1: "It was not a good day.", wrong2: "My day was difficult.", wrong3: "The day presented many challenges.", explanation: "'Rough one — but I'm pushing through!' وەڵامێکی کورت و باوی ئینگلیزییە" },
    ],
  },

  {
    topic: "Morning Routine", topicKu: "ڕووتینی بەیانیان",
    words: [
      { english: "Wake up",      kurdish: "لەخەو هەستان"       },
      { english: "Hit snooze",   kurdish: "دواخستنی ئالارم"    },
      { english: "Grab coffee",  kurdish: "خواردنەوەی قاوە"    },
      { english: "Rushing out",  kurdish: "بەپەلە دەرچوون"     },
      { english: "Barely made it",kurdish: "بە زەحمەت گەشتمی"  },
    ],
    voices: [
      { prompt: "وەسفی بەیانییەکەت بکە",   target: "I hit snooze like three times this morning",  targetKurdish: "ئەم بەیانییە سێ جار زەنگی مۆبایلەکەمم دواخست" },
      { prompt: "بگەینە شوێنەکەت",        target: "I barely made it out the door on time",        targetKurdish: "بە زەحمەت لە کاتی خۆیدا توانیم لە دەرگاوە بچمە دەرەوە" },
    ],
    sentences: [
      { english: ["I",    "hit",   "snooze","like",  "three","times"],kurdish: "نزیکەی سێ جار زەنگی مۆبایلەکەم دواخست"  },
      { english: ["I",    "barely","made",  "it",    "on",  "time"],  kurdish: "بە زەحمەت لە کاتی خۆیدا گەیشتمم"        },
    ],
    fillBlanks: [
      { parts: ["I hit",  "at least three times"],    hint: "لانی کەم سێ جار زەنگی مۆبایلەکەمم دواخست",   answer: "snooze",   wrongs: ["pause", "stop", "sleep"]     },
      { parts: ["Barely", "it out of the house!"],     hint: "بە زەحمەت لە ماڵەوە دەرچووم!",               answer: "made",     wrongs: ["got", "came", "left"]        },
    ],
    conversations: [
      { situation: "دواکەوتن بەهۆی خەو", theyAsk: "Did you sleep in again?", correct: "Big time. Hit snooze three times and barely made it!", wrong1: "Yes I woke up late today.", wrong2: "I was late because of oversleeping.", wrong3: "My morning routine was disrupted.", explanation: "'Big time. Hit snooze and barely made it!' — وەڵامێکی کورت و خێرایە لە کاتی پەلەیدا" },
    ],
  },

  {
    topic: "Quick Replies", topicKu: "وەڵامە خێراکان",
    words: [
      { english: "Gotcha",       kurdish: "تێگەیشتم"           },
      { english: "Say what",     kurdish: "چیت وت؟"            },
      { english: "My bad",       kurdish: "هەڵەی من بوو"       },
      { english: "For real",     kurdish: "بەجدییەتی؟"         },
      { english: "True that",    kurdish: "ئەوەیان ڕاستە"      },
    ],
    voices: [
      { prompt: "دەربڕینی تێگەیشتن",   target: "Gotcha, got it — no worries",   targetKurdish: "تێگەیشتم، زانیم — کێشە نییە"       },
      { prompt: "دەربڕینی سەرسوڕمان",  target: "For real though, that's crazy",  targetKurdish: "بەڵام بەجدی، ئەوە شێتانەیە"       },
    ],
    sentences: [
      { english: ["Gotcha","got",  "it",   "no",    "worries"],     kurdish: "تێگەیشتم، زانیم، کێشە نییە"           },
      { english: ["For",   "real","though","that's","crazy"],       kurdish: "بەڵام بەجدی، ئەوە شێتانەیە"            },
    ],
    fillBlanks: [
      { parts: ["",     ", I totally get it!"],    hint: "گیرا، بەتەواوی تێدەگەم!",           answer: "Gotcha",  wrongs: ["Sure", "Okay", "Right"]      },
      { parts: ["My",   "for forgetting that!"],   hint: "هەڵەی من بوو کە ئەوەم بیرچوو!",         answer: "bad",     wrongs: ["fault", "mistake", "error"]   },
    ],
    conversations: [
      { situation: "کاتێک هەڵەیەک دەکەیت", theyAsk: "Hey you forgot to send me that file!", correct: "Oh my bad! Sending it right now, one sec.", wrong1: "Sorry I forgot to send the file.", wrong2: "I apologize for my oversight.", wrong3: "I acknowledge my error in forgetting.", explanation: "'Oh my bad! Sending it right now' — کورت، خێرا و سروشتییە بۆ داننان بە هەڵە" },
    ],
  },

  {
    topic: "Asking for Directions", topicKu: "پرسیارکردن دەربارەی ئاراستەکان",
    words: [
      { english: "Head straight",  kurdish: "ڕاستەوخۆ بڕۆ"      },
      { english: "Take a left",    kurdish: "بەرەو چەپ بپێچەوە"  },
      { english: "You can't miss", kurdish: "مەحاڵە نەیبینیت"    },
      { english: "Around the corner",kurdish: "لەولای پێچەکەیە"  },
      { english: "Just follow",    kurdish: "تەنها دوای کەوە"    },
    ],
    voices: [
      { prompt: "داوای ئاراستە بکە",     target: "Excuse me, where's the nearest pharmacy?", targetKurdish: "ببوورە، نزیکترین دەرمانخانە لە کوێیە؟"},
      { prompt: "ئاراستە پیشان بدە",     target: "Head straight then take a left — you can't miss it!", targetKurdish: "ڕاستەوخۆ بڕۆ و دواتر بەرەو چەپ بپێچەوە — مەحاڵە نەیبینیت!" },
    ],
    sentences: [
      { english: ["Head",   "straight","then","take","a",  "left"],    kurdish: "ڕاستەوخۆ بڕۆ پاشان بەرەو چەپ بپێچەوە"},
      { english: ["You",    "can't",   "miss","it,", "it's","right there"],kurdish: "مەحاڵە نەیبینیت، هەر لەوێیە"      },
    ],
    fillBlanks: [
      { parts: ["Head",    "and then turn left"],    hint: "ڕاستەوخۆ بڕۆ پاشان بەرەو چەپ بپێچەوە",   answer: "straight", wrongs: ["forward", "ahead", "through"]  },
      { parts: ["It's",    "the corner — easy!"],     hint: "لەولای پێچەکەیە — زۆر ئاسانە!",             answer: "around",   wrongs: ["beside", "past", "near"]      },
    ],
    conversations: [
      { situation: "کەسێک ون بووە", theyAsk: "Hey, is there a coffee shop near here?", correct: "Yeah! Head straight, take the first left — it's right around the corner!", wrong1: "Yes there is a coffee shop nearby.", wrong2: "Go straight and turn left to find it.", wrong3: "A coffee establishment is located to the left.", explanation: "'Head straight, take the first left — right around the corner!' ئینگلیزییەکی ئاسان و ڕۆژانەیە" },
    ],
  },

  {
    topic: "Talking About Food", topicKu: "قسەکردن لەسەر خواردن",
    words: [
      { english: "I'm starving",   kurdish: "لە برسا دەمەرم"     },
      { english: "That hits",      kurdish: "ئەوە زۆر شازە"      },
      { english: "So good",        kurdish: "زۆر خۆشە"           },
      { english: "Worth it",       kurdish: "هەقی خۆیەتی"        },
      { english: "Must try",       kurdish: "دەبێت تاقی بکەیتەوە"},
    ],
    voices: [
      { prompt: "وەسفی خواردنێک بکە",  target: "This is literally the best thing I've ever eaten!", targetKurdish: "بەڕاستی ئەمە باشترین شتە کە تا ئێستا خواردوومە!" },
      { prompt: "پێشنیاری بکە",        target: "You absolutely have to try this place",             targetKurdish: "بەدڵنیاییەوە دەبێت ئەم شوێنە تاقی بکەیتەوە"      },
    ],
    sentences: [
      { english: ["This","is",  "literally","the","best","I've","eaten"],kurdish: "بەڕاستی ئەمە باشترین شتە کە تا ئێستا خواردوومە"},
      { english: ["You", "have","to",       "try","this","place"],       kurdish: "دەبێت ئەم شوێنە تاقی بکەیتەوە"       },
    ],
    fillBlanks: [
      { parts: ["I'm",  "— when's lunch?!"],           hint: "زۆر برسییمە — کاتی نانی نیوەڕۆ کەیە؟!",   answer: "starving",  wrongs: ["hungry", "dying", "empty"]   },
      { parts: ["This", "place is absolutely worth it!"],hint: "ئەم شوێنە بەتەواوی هەقی خۆیەتی!", answer: "food",   wrongs: ["restaurant", "place", "dish"] },
    ],
    conversations: [
      { situation: "هاوڕێیەک خواردنێکی تام کردووە", theyAsk: "How's the pasta?", correct: "Bro, it literally hits different — you HAVE to try this!", wrong1: "The pasta is very good and delicious.", wrong2: "I recommend the pasta, it's nice.", wrong3: "The pasta quality is superior.", explanation: "'It hits different — you HAVE to try this!' — ئینگلیزییەکی باو و پێشکەوتووە بۆ پێشنیارکردنی خواردن" },
    ],
  },

  {
    topic: "At Work / School", topicKu: "لە کار / لە قوتابخانە",
    words: [
      { english: "Deadline",       kurdish: "دوا مۆڵەت"          },
      { english: "Behind on",      kurdish: "دواکەوتووم لە"      },
      { english: "On it",          kurdish: "خەریکیم / لەسەریم"  },
      { english: "Wrap it up",     kurdish: "تەواوی بکە"         },
      { english: "Run by you",     kurdish: "پێت پیشان بدەم"     },
    ],
    voices: [
      { prompt: "دواکەوتنت باس بکە",    target: "I'm kind of behind on this deadline",     targetKurdish: "کەمێک دواکەوتووم لەم کاتی دیاریکراوەدا" },
      { prompt: "داوای سەرنج بکە",      target: "Let me run this by you real quick",       targetKurdish: "با بە خێرایی ئەوەت پێ پیشان بدەم" },
    ],
    sentences: [
      { english: ["I'm",  "kind",  "of",    "behind","on",  "this"],  kurdish: "کەمێک لە کاتی دیاریکراو دواکەوتووم"   },
      { english: ["Let",  "me",    "run",   "this",  "by", "you"],    kurdish: "با ئەمەت پێ پیشان بدەم" },
    ],
    fillBlanks: [
      { parts: ["I'm",   "on the deadline — need help!"],   hint: "لە کاتی دیاریکراو دواکەوتووم — پێویستم بە یارمەتییە!", answer: "behind",  wrongs: ["late", "slow", "stuck"]      },
      { parts: ["Just",  "this for me real quick!"],         hint: "تەنها بە خێرایی بۆم کۆتایی پێ بهێنە!",              answer: "wrap up", wrongs: ["finish", "do", "solve"]       },
    ],
    conversations: [
      { situation: "هاوکارێک داوای یارمەتی دەکات", theyAsk: "Hey, can I run something by you?", correct: "Of course, I'm on it — what's up?", wrong1: "Yes please speak about your issue.", wrong2: "I am ready to assist you.", wrong3: "You may present your matter to me.", explanation: "'Of course, I'm on it — what's up?' — دەربڕینێکی سروشتییە بۆ ئامادەیی یارمەتیدان" },
    ],
  },

  {
    topic: "Shopping & Money", topicKu: "بازاڕکردن و پارە",
    words: [
      { english: "On sale",       kurdish: "داشکاندنی بۆ کراوە" },
      { english: "Broke",         kurdish: "پوولم پێ نییە"      },
      { english: "Treat yourself",kurdish: "پاداشتی خۆت بکە"    },
      { english: "Good deal",     kurdish: "مامەڵەیەکی باش"     },
      { english: "Splurge",       kurdish: "پارەی زیاد خەرجرد"  },
    ],
    voices: [
      { prompt: "بڵێ کە پارەت نییە",     target: "I'm totally broke until payday",   targetKurdish: "تا ڕۆژی وەرگرتنی مووچە بەتەواوی پوولم پێ نییە" },
      { prompt: "داوای پاداشتکردنی خۆی لێبکە", target: "Honestly just treat yourself, it's on sale!", targetKurdish: "بەڕاستی پاداشتی خۆت بکە، ئەوە داشکاندنی بۆ کراوە!"},
    ],
    sentences: [
      { english: ["I'm",  "totally","broke","until","payday"],              kurdish: "تا ڕۆژی وەرگرتنی مووچە بەتەواوی پوولم پێ نییە" },
      { english: ["Just", "treat",  "yourself","it's","on","sale"],          kurdish: "پاداشتی خۆت بکە ئەوە داشکاندنی بۆ کراوە"       },
    ],
    fillBlanks: [
      { parts: ["I'm so", "right now — can't spend a thing!"], hint: "لەم ساتەدا زۆر بێپارەم — ناتوانم هیچ خەرج بکەم!", answer: "broke",   wrongs: ["poor", "done", "spent"]     },
      { parts: ["That's a really", "deal!"], hint: "ئەوە بەڕاستی مامەڵەیەکی باشە!", answer: "good", wrongs: ["great", "nice", "amazing"] },
    ],
    conversations: [
      { situation: "کەسێک دوودڵە لە کڕین", theyAsk: "I really want those shoes but they're expensive.", correct: "They're on sale NOW though — honestly just treat yourself!", wrong1: "You should buy them if you want.", wrong2: "It is acceptable to purchase them.", wrong3: "The discount makes them more affordable.", explanation: "'They're on sale — just treat yourself!' دەربڕینێکی هاندەرانەیە بۆ کڕین" },
    ],
  },

  {
    topic: "Talking About Health", topicKu: "قسەکردن دەربارەی تەندروستی",
    words: [
      { english: "Under the weather",kurdish: "کەمێک نەخۆشم"       },
      { english: "Burning up",       kurdish: "تاوم زۆرە"          },
      { english: "Wiped out",        kurdish: "شەکەت بووم"         },
      { english: "Take it easy",     kurdish: "پشوو بدە"           },
      { english: "Pushing through",  kurdish: "بەردەوامم"          },
    ],
    voices: [
      { prompt: "باری تەندروستیت باس بکە", target: "I've been feeling really under the weather",  targetKurdish: "بەڕاستی هەست دەکەم سەرمام بووە و تەندروستیم باش نییە" },
      { prompt: "ئامۆژگاری بدە",         target: "Hey, take it easy — don't push too hard",    targetKurdish: "ئەی، کەمێک پشوو بدە — زۆر لە خۆت مەکە"  },
    ],
    sentences: [
      { english: ["I've", "been",    "feeling","under","the",  "weather"], kurdish: "هەست بە باشی ناکەم و تەندروستیم باش نییە" },
      { english: ["Just", "take",    "it",     "easy", "today"],           kurdish: "ئەمڕۆ تەنها پشوو بدە"    },
    ],
    fillBlanks: [
      { parts: ["I'm feeling under the", "today"], hint: "ئەمڕۆ تەندروستیم باش نییە", answer: "weather", wrongs: ["sky", "sun", "air"] },
      { parts: ["I'm totally","out today!"], hint: "ئەمڕۆ بەتەواوی شەکەت بووم!", answer: "wiped",   wrongs: ["burned", "stressed", "gone"] },
    ],
    conversations: [
      { situation: "هاوڕێیەک نەخۆشی پێوە دیارە", theyAsk: "You look tired today, you okay?", correct: "Honestly not great — been a bit under the weather. Trying to push through.", wrong1: "I am not feeling well today.", wrong2: "My health is not optimal.", wrong3: "I have been experiencing illness.", explanation: "'Under the weather. Trying to push through.' — بەکاربینانی ئیدیۆمێکی سروشتییە بۆ باش نەبوونی تەندروستی" },
    ],
  },

  {
    topic: "Transport & Commute", topicKu: "گواستنەوە و هاتوچۆ",
    words: [
      { english: "Stuck in traffic",  kurdish: "گیرخواردن لە قەرەباڵغیدا"},
      { english: "Take the subway",   kurdish: "مەترۆکە بەکاربهێنە"  },
      { english: "Uber it",           kurdish: "تەکسی بگرە"          },
      { english: "It's packed",       kurdish: "زۆر قەرەباڵغە"       },
      { english: "Next stop",         kurdish: "وێستگەی داهاتوو"     },
    ],
    voices: [
      { prompt: "باسکردنی قەرەباڵغی",    target: "I'm stuck in traffic — gonna be late!",   targetKurdish: "لە قەرەباڵغیدا گیرم خواردووە — دوا دەکەوم!" },
      { prompt: "پێشنیار بکە",           target: "Just take the subway, way faster",         targetKurdish: "تەنها مەترۆکە بەکاربهێنە، زۆر خێراترە" },
    ],
    sentences: [
      { english: ["I'm", "stuck",  "in",  "traffic", "gonna","be","late"],  kurdish: "لە قەرەباڵغیدا گیرم خواردووە، دوا دەکەوم" },
      { english: ["Just","take",   "the", "subway",   "way",  "faster"],    kurdish: "تەنها چارەسەرەکە مەترۆیە، خێراترە" },
    ],
    fillBlanks: [
      { parts: ["I'm",  "in traffic right now!"],   hint: "هەر ئێستا لە قەرەباڵغیدا گیرم خواردووە!",     answer: "stuck",    wrongs: ["trapped", "lost", "slow"]     },
      { parts: ["The",  "is absolutely packed!"],    hint: "مەترۆکە بەتەواوی پڕ بووە لە خەڵک!",          answer: "subway",   wrongs: ["bus", "train", "road"]        },
    ],
    conversations: [
      { situation: "هاوڕێیەک چاوەڕێت دەکات", theyAsk: "Where are you?? I'm at the restaurant!", correct: "Stuck in traffic — just gonna Uber it, be there in 10!", wrong1: "I am in traffic and will arrive soon.", wrong2: "Traffic is causing a delay for me.", wrong3: "I will take an alternative route shortly.", explanation: "'Stuck in traffic — gonna Uber it, be there in 10!' — شێوازێکی ڕۆژانە و خێرایە بۆ باسکردنی دواکەوتن" },
    ],
  },

  {
    topic: "Talking About the Weekend", topicKu: "قسەکردن لەسەر کاتی پشوو",
    words: [
      { english: "Slept in",       kurdish: "درەنگ لەخەو هەستام"  },
      { english: "Lazy day",       kurdish: "ڕۆژێکی تەمبەڵانە"    },
      { english: "Recharged",      kurdish: "وزەم بۆ گەڕایەوە"    },
      { english: "Much needed",    kurdish: "زۆر پێویست بوو"      },
      { english: "Flew by",        kurdish: "زۆر خێرا تێپەڕی"     },
    ],
    voices: [
      { prompt: "باسی پشووەکەت بکە",   target: "I slept in till noon — it was amazing",    targetKurdish: "تا نیوەڕۆ خەوتم — زۆر شاز بوو"    },
      { prompt: "خێرایی کاتەکە باس بکە", target: "The weekend flew by way too fast",         targetKurdish: "کۆتایی هەفتەکە زۆر بە خێرایی تێپەڕی" },
    ],
    sentences: [
      { english: ["I",    "slept", "in",   "till",  "noon",  "it","was","amazing"],  kurdish: "تا نیوەڕۆ خەوتم، زۆر خۆش بوو"    },
      { english: ["The",  "weekend","flew","by",    "way",   "too","fast"],           kurdish: "کۆتایی هەفتەکە زۆر بە خێرایی تێپەڕی" },
    ],
    fillBlanks: [
      { parts: ["I slept", "till noon this weekend!"],    hint: "ئەم کۆتایی هەفتەیە تا نیوەڕۆ خەوتم!",  answer: "in",      wrongs: ["out", "well", "hard"]        },
      { parts: ["It was",  "exactly what I needed!"],      hint: "ئەوە ڕێک ئەوە بوو کە پێویستم بوو!",    answer: "exactly", wrongs: ["just", "precisely", "really"] },
    ],
    conversations: [
      { situation: "کاتی نزیکبوونەوە لە هاوکاران", theyAsk: "Good weekend?", correct: "So good — slept in, recharged, did nothing. Honestly much needed!", wrong1: "Yes my weekend was very restful.", wrong2: "I spent the weekend resting at home.", wrong3: "The weekend was relaxing and recuperative.", explanation: "'Slept in, recharged, did nothing. Much needed!' — کورت و ئینگلیزییەکی خێرا و سەردەمیانەیە" },
    ],
  },
];

export default unit02;
