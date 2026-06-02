import { UnitBank } from "../types";

const unit03: UnitBank = [
  {
    topic: "Ordering Coffee", topicKu: "داواکردنی قاوە",
    words: [
      { english: "Can I get", kurdish: "دەتوانم ... داوا بکەم" }, 
      { english: "Large", kurdish: "گەورە" }, 
      { english: "Oat milk", kurdish: "شیری شۆفان (Oat)" }, 
      { english: "To go", kurdish: "بۆ بردننەدەرەوە" }, 
      { english: "For here", kurdish: "بۆ خواردنەوەی لێرە" }
    ],
    voices: [
      { prompt: "قاوە داوا بکه", target: "Can I get a large oat milk latte to go?", targetKurdish: "دەتوانم لاتەیەکی گەورە بە شیری شۆفان بۆ بردنە دەرەوە داوا بکەم؟" }, 
      { prompt: "پرسیار لەسەر مێنو بکە", target: "What's good here today?", targetKurdish: "ئەمڕۆ چی باشە بۆ خواردن/خواردنەوە لێرە؟" }
    ],
    sentences: [
      { english: ["Can", "I", "get", "a", "large", "coffee"], kurdish: "دەتوانم قاوەیەکی گەورە داوا بکەم؟" }, 
      { english: ["Is", "this", "for", "here", "or", "to", "go"], kurdish: "بۆ لێرەیە یان دەیبەیتە دەرەوە؟" }
    ],
    fillBlanks: [
      { parts: ["Can I", "a large latte please?"], hint: "دەتوانم لاتەیەکی گەورە داوا بکەم؟", answer: "get", wrongs: ["have", "take", "want"] }, 
      { parts: ["Is it for", "or to go?"], hint: "بۆ لێرەیە یان دەیبەیتە دەرەوە؟", answer: "here", wrongs: ["dine", "eat", "stay"] }
    ],
    conversations: [
      { situation: "لە کافێیەکیدایت", theyAsk: "What can I get for you?", correct: "Can I get a large oat milk latte, to go, please?", wrong1: "Coffee. Large size.", wrong2: "I would like to order a beverage.", wrong3: "Do you have tea instead?", explanation: "'Can I get a large oat milk latte, to go?' — شێوازی سروشتی داواکردن لە کافێ" }
    ],
  },
  {
    topic: "Fast Food Order", topicKu: "داواکردنی خواردنی خێرا",
    words: [
      { english: "Combo", kurdish: "کۆمبۆ (ژەم)" }, 
      { english: "Upsize", kurdish: "قەبارەکەی گەورەترکە" }, 
      { english: "Extra sauce", kurdish: "سۆسی زیادە" }, 
      { english: "Hold the", kurdish: "بەبێ" }, 
      { english: "Add on", kurdish: "زیادکردنی..." }
    ],
    voices: [
      { prompt: "ژەمێکی گەورە داوا بکە", target: "Can I get the number two combo upsize?", targetKurdish: "دەتوانم کۆمبۆی ژمارە دوو قەبارەکەی گەورەتر بکەم؟" }, 
      { prompt: "گۆڕانکاری لە داواکاریەکەت بکە", target: "Hold the pickles and extra sauce on the side please", targetKurdish: "بەبێ خەیار شۆر، و تکایە سۆسی زیادەش لە پەلەوە دابنێ" }
    ],
    sentences: [
      { english: ["Can", "I", "get", "the", "combo", "upsize"], kurdish: "دەتوانم قەبارەی کۆمبۆکە گەورەتر بکەم؟" }, 
      { english: ["Hold", "the", "onions", "please"], kurdish: "تکایە بەبێ پیاز بیهێنە" }
    ],
    fillBlanks: [
      { parts: ["Can I", "some extra sauce please?"], hint: "تکایە دەتوانم کەمێک سۆسی زیادە داوا بکەم؟", answer: "get", wrongs: ["have", "add", "want"] }, 
      { parts: ["", "the onions, thanks!"], hint: "بەبێ پیاز تکایە، سوپاس!", answer: "Hold", wrongs: ["Take", "Remove", "Skip"] }
    ],
    conversations: [
      { situation: "لە ماکدۆنالدز داواکاری دەکەیت", theyAsk: "Any modifications?", correct: "Yes — hold the pickles, and can I add extra fries?", wrong1: "No modifications. It is fine.", wrong2: "I do not understand your question.", wrong3: "Please change everything on the menu.", explanation: "'Hold the pickles, can I add extra fries?' — زمانێکی باو لە fast food" }
    ],
  },
  {
    topic: "Splitting the Bill", topicKu: "دابەشکردنی پارەی خواردن",
    words: [
      { english: "Split it", kurdish: "بەشکردنی پارەکە (دابەشکردن)" }, 
      { english: "Go Dutch", kurdish: "هەرکەسە و هی خۆی بدات" }, 
      { english: "I've got this", kurdish: "لە ئەستۆی من" }, 
      { english: "Tip", kurdish: "بەخشش (تیپ)" }, 
      { english: "On me", kurdish: "لەسەر هەژماری منە" }
    ],
    voices: [
      { prompt: "پێشنیاری دابەشکردنی پارەکە بکە", target: "Should we just split it down the middle?", targetKurdish: "پارەکە نیوە بە نیوەی بکەین باشە؟" }, 
      { prompt: "داوا بکە بەتەنها پارەکە بدەیت", target: "No no — this one's on me!", targetKurdish: "نەخێر نەخێر — ئەمەیان لەسەر منە!" }
    ],
    sentences: [
      { english: ["Should", "we", "just", "split", "it"], kurdish: "باشترە پارەکە دابەش بکەین لەنێوان خۆمان؟" }, 
      { english: ["This", "one", "is", "on", "me"], kurdish: "ئەمەیان لە ئەستۆی منە" }
    ],
    fillBlanks: [
      { parts: ["Should we", "it down the middle?"], hint: "ئایا نیوە بە نیوە دابەشی بکەین؟", answer: "split", wrongs: ["divide", "share", "cut"] }, 
      { parts: ["No, this one's", "me!"], hint: "نەخێر، ئەمە لەسەر منە!", answer: "on", wrongs: ["for", "by", "with"] }
    ],
    conversations: [
      { situation: "وەسڵەکە هاتووە بۆ مێزەکە", theyAsk: "How do you want to handle the bill?", correct: "Let's just split it — makes it way easier!", wrong1: "I will pay for everyone tonight.", wrong2: "You should pay the entire bill.", wrong3: "I do not have enough money.", explanation: "'Let's just split it — makes it way easier!' — سروشتی بۆ دابەشکردنی پارە" }
    ],
  },
  {
    topic: "Complaining About Food", topicKu: "گلەییکردن لە خواردن",
    words: [
      { english: "Overcooked", kurdish: "زۆر برژاوە / سووتاوە" }, 
      { english: "Send it back", kurdish: "بۆم بگەڕێنەوە دواوە" }, 
      { english: "Not what I ordered", kurdish: "ئەمە داواکارییەکەی من نییە" }, 
      { english: "Undercooked", kurdish: "کەم کوڵاوە / کاڵە" }, 
      { english: "Excuse me", kurdish: "لێم ببوورە" }
    ],
    voices: [
      { prompt: "گلەیی لە سووتانی بکە", target: "Excuse me, I think this is overcooked", targetKurdish: "لێم ببوورە، پێم وایە ئەمە زۆر برژاوە" }, 
      { prompt: "هەڵەی داواکاری ڕاستکەرەوە", target: "This isn't what I ordered — could you fix this?", targetKurdish: "ئەمە ئەوە نییە کە داوام کردبوو — دەتوانیت ئەمەم بۆ چاک بکەیتەوە؟" }
    ],
    sentences: [
      { english: ["Excuse", "me", "I", "think", "this", "is", "overcooked"], kurdish: "لێم ببوورە، پێم وایە ئەمە زۆر برژاوە" }, 
      { english: ["This", "isn't", "what", "I", "ordered"], kurdish: "ئەمە ئەوە نییە کە داوام کردبوو" }
    ],
    fillBlanks: [
      { parts: ["Excuse me, this isn't", "I ordered"], hint: "لێم ببوورە، ئەمە ئەوە نییە کە داوام کردبوو", answer: "what", wrongs: ["how", "which", "that"] }, 
      { parts: ["Could you", "this for me?"], hint: "دەتوانیت ئەمەم بۆ چاک بکەیتەوە؟", answer: "fix", wrongs: ["change", "redo", "replace"] },
    ],
    conversations: [
      { situation: "خواردنەکەت وادیارە بە تەواوی نەبەراوە", theyAsk: "How is everything tasting?", correct: "Actually, I think mine is a bit undercooked — could you send it back?", wrong1: "Everything is perfect. Thank you.", wrong2: "The food tastes excellent.", wrong3: "I have no complaints about the meal.", explanation: "'A bit undercooked — could you send it back?' — ڕێزدار و ڕاستەوخۆ" }
    ],
  },
  {
    topic: "Tipping & Payment", topicKu: "پارەدان و بەخششەوەدان",
    words: [
      { english: "Keep the change", kurdish: "باقییەکەی بۆ خۆت" }, 
      { english: "Card or cash", kurdish: "بە کارت یان بە کاش؟" }, 
      { english: "Service charge", kurdish: "کرێی خزمەتگوزاری" }, 
      { english: "Receipt", kurdish: "وەسڵ" }, 
      { english: "Contactless", kurdish: "بێ بەریەککەوتن (کارت)" }
    ],
    voices: [
      { prompt: "بەخششێک بدە", target: "Keep the change — the service was great!", targetKurdish: "باقییەکەی بۆ خۆت — خزمەتگوزارییەکەتان زۆر شاز بوو!" }, 
      { prompt: "پرسیار لەسەر جۆری پارەدان بکە", target: "Can I pay by card?", targetKurdish: "دەتوانم بە کارت پارەکە ببژێرم؟" }
    ],
    sentences: [
      { english: ["Keep", "the", "change", "service", "was", "great"], kurdish: "باقییەکەی بۆ خۆت، خزمەتگوزارییەکەتان زۆر شاز بوو" }, 
      { english: ["Can", "I", "pay", "by", "card"], kurdish: "دەتوانم بە کارت پارەکە ببژێرم؟" }
    ],
    fillBlanks: [
      { parts: ["Keep the", "— you were amazing!"], hint: "باقییەکەی بۆ خۆت — زۆر نایاب بووی!", answer: "change", wrongs: ["rest", "money", "tip"] }, 
      { parts: ["Can I pay", "contactless?"], hint: "دەتوانم لە ڕێگەی کارتی بێ بەریەککەوتنەوە پارەکە بدەم؟", answer: "by", wrongs: ["with", "through", "using"] }
    ],
    conversations: [
      { situation: "کۆتایی نانخواردنە و پارە دەدەیت", theyAsk: "How would you like to pay?", correct: "Card please — and keep the change, the food was fantastic!", wrong1: "Cash only. I have no card.", wrong2: "I need a discount before I pay.", wrong3: "The food was not good.", explanation: "'Keep the change, the food was fantastic!' — گەرم و سروشتی لە کۆتایی خواردن" }
    ],
  },
  {
    topic: "Café Small Talk", topicKu: "قسەکردنی کورت لە کافێ",
    words: [
      { english: "What's your usual", kurdish: "بە زۆری چی داوا دەکەیت؟" }, 
      { english: "Packed today", kurdish: "ئەمڕۆ زۆر قەرەباڵغە" }, 
      { english: "Good spot", kurdish: "جێگەیەکی خۆشە" }, 
      { english: "Caught up", kurdish: "سەرقاڵ بووم / گیرم خواردبوو" }, 
      { english: "Cozy", kurdish: "ئارام و خنجیلانە" }
    ],
    voices: [
      { prompt: "سەرسامی خۆت بە کافێکە دەرببڕە", target: "This place is so cozy I love it", targetKurdish: "ئەم شوێنە زۆر ئارام و خنجیلانەیە، زۆرم بەدڵە" }, 
      { prompt: "پرسیار لەسەر داواکاری هەمیشەیی کەسێک بکە", target: "What do you usually get here?", targetKurdish: "بەگشتی چی داوا دەکەیت لێرە؟" }
    ],
    sentences: [
      { english: ["This", "place", "is", "so", "cozy"], kurdish: "ئەم شوێنە زۆر ئارام و خنجیلانەیە" }, 
      { english: ["What", "do", "you", "usually", "get", "here"], kurdish: "بەگشتی چی داوا دەکەیت لێرە؟" }
    ],
    fillBlanks: [
      { parts: ["This place is so", "and quiet!"], hint: "ئەم شوێنە زۆر ئارام و خنجیلانە و بێدەنگە!", answer: "cozy", wrongs: ["nice", "good", "warm"] }, 
      { parts: ["It's really", "today — everywhere's full!"], hint: "بەڕاستی ئەمڕۆ زۆر قەرەباڵغە — هەموو جێگەیەک پڕە!", answer: "packed", wrongs: ["busy", "full", "crowded"] }
    ],
    conversations: [
      { situation: "لە کافێیەکی نوێ کەسێک دەبینیت", theyAsk: "First time here?", correct: "Yeah! It's so cozy — what do you usually get?", wrong1: "No, I come here every day.", wrong2: "I do not like this café.", wrong3: "First time. I have nothing to say.", explanation: "'It's so cozy — what do you usually get?' — گفتوگۆی گەرم و دۆستانە" }
    ],
  },
  {
    topic: "Food Allergies", topicKu: "هەستیاری بە خواردن",
    words: [
      { english: "Allergic to", kurdish: "هەستیاریم هەیە بە" }, 
      { english: "Does it contain", kurdish: "ئایا تیایدایە...؟" }, 
      { english: "Dairy free", kurdish: "بەبێ شیرەمەنی" }, 
      { english: "Gluten free", kurdish: "بەبێ گلۆتین" }, 
      { english: "Vegan", kurdish: "ڕووەکی" }
    ],
    voices: [
      { prompt: "پرسیار لەسەر پێکهاتە بکە و هەستیاریت ڕوون بکەرەوە", target: "Does this have any dairy in it? I'm lactose intolerant", targetKurdish: "ئایا ئەمە هیچ شیرەمەنییەکی تێدایە؟ من هەستیاریم بە لاکتۆز هەیە" }, 
      { prompt: "بۆ بژاردەی بێ گلۆتین بگەڕێ", target: "Do you have anything gluten free?", targetKurdish: "ئایا هیچ شتێکتان هەیە بەبێ گلۆتین بێت؟" }
    ],
    sentences: [
      { english: ["Does", "this", "have", "any", "dairy", "in", "it"], kurdish: "ئایا هیچ شیرەمەنییەکی تێدایە؟" }, 
      { english: ["I'm", "allergic", "to", "nuts", "unfortunately"], kurdish: "بەداخەوە من هەستیاریم بە چەرەسات هەیە" }
    ],
    fillBlanks: [
      { parts: ["I'm", "to peanuts — is that okay?"], hint: "من هەستیاریم بە فستقی سوودانی هەیە — ئایا ئەوە کێشە نییە؟", answer: "allergic", wrongs: ["sensitive", "reactive", "opposed"] }, 
      { parts: ["Do you have a", "free option?"], hint: "ئایا بژاردەی بێ گلۆتینتان هەیە؟", answer: "gluten", wrongs: ["dairy", "nut", "sugar"] }
    ],
    conversations: [
      { situation: "کاتێک گارسۆن پرسیار لەسەر جۆری خواردن دەکات", theyAsk: "Any dietary requirements?", correct: "Yeah, I'm actually vegan — any plant-based options?", wrong1: "No dietary requirements at all.", wrong2: "I eat everything on the menu.", wrong3: "I am allergic to water.", explanation: "'I'm actually vegan — any plant-based options?' — ڕوون و ڕێزدار" }
    ],
  },
  {
    topic: "Restaurant Booking", topicKu: "حجزکردنی چێشتخانە",
    words: [
      { english: "Reservation", kurdish: "حجزکردن (بڕین)" }, 
      { english: "Party of", kurdish: "میوانی... کەسی" }, 
      { english: "Indoor seating", kurdish: "دانیشتنی ناوەوە" }, 
      { english: "Window table", kurdish: "مێزێک لای پەنجەرەکە" }, 
      { english: "Walk in", kurdish: "ژەمێکی بێ حجزکرن" }
    ],
    voices: [
      { prompt: "بە تەلەفۆن حجز بکە", target: "I'd like to make a reservation for two please", targetKurdish: "دەمەوێت مێزێک بۆ دوو کەس حجز بکەم تکایە" }, 
      { prompt: "پرسیار لەسەر شوێنی بەتاڵ بکە", target: "Do you have any tables available for tonight?", targetKurdish: "ئەمشەو هیچ مێزێکی بەتاڵتان هەیە؟" }
    ],
    sentences: [
      { english: ["I'd", "like", "to", "make", "a", "reservation"], kurdish: "دەمەوێت مێزێک حجز بکەم" }, 
      { english: ["Party", "of", "four", "for", "tonight"], kurdish: "بۆ چوار کەسە بۆ ئەمشەو" }
    ],
    fillBlanks: [
      { parts: ["I'd like a", "for four for tonight"], hint: "دەمەوێت حجزێک بۆ چوار کەس بکەم بۆ ئەمشەو", answer: "reservation", wrongs: ["table", "booking", "spot"] }, 
      { parts: ["Do you have a", "table available?"], hint: "ئایا مێزێکی لای پەنجەرەتان بەتاڵە؟", answer: "window", wrongs: ["corner", "quiet", "indoor"] }
    ],
    conversations: [
      { situation: "بە تەلەفۆن مێزێک حجز دەکەیت", theyAsk: "Good evening, Bella Notte, how can I help?", correct: "Hi! I'd like to book a table for two for tonight at eight, please.", wrong1: "I want food. Two people.", wrong2: "Are you open right now?", wrong3: "Cancel my reservation from last week.", explanation: "'I'd like to book a table for two at eight' — فۆرمی سروشتی حجزکردن" }
    ],
  },
  {
    topic: "Street Food & Markets", topicKu: "خواردنی سەر شەقام و بازاڕەکان",
    words: [
      { english: "Street food", kurdish: "خواردنی سەر شەقام" }, 
      { english: "Cash only", kurdish: "تەنها بە کاش" }, 
      { english: "Queue", kurdish: "ڕیز (سەرە)" }, 
      { english: "Fresh made", kurdish: "تازە ئامادەکراو" }, 
      { english: "Sample", kurdish: "نموونەی تاقیکردنەوە" }
    ],
    voices: [
      { prompt: "دوو دانە لە خواردنێک داوا بکە", target: "Can I get two of those fresh tacos please?", targetKurdish: "دەتوانم دوو دانە لەو تاکۆ تازەیە داوا بکەم تکایە؟" }, 
      { prompt: "پرسیار سەبارەت بە پارەدان بکە", target: "Do you guys take card or cash only?", targetKurdish: "کارت قبوڵ دەکەن یان تەنها بە کاش مامەڵە دەکەن؟" }
    ],
    sentences: [
      { english: ["Can", "I", "try", "a", "sample", "first"], kurdish: "دەتوانم سەرەتا تامی نموونەیەکی کەم بکەم؟" }, 
      { english: ["How", "much", "for", "three"], kurdish: "سێ دانەی بە چەندە؟" }
    ],
    fillBlanks: [
      { parts: ["Is it", "only or can I use card?"], hint: "ئایا تەنها بە کاشە یان دەتوانم کارت بەکاربهێنم؟", answer: "cash", wrongs: ["card", "money", "coins"] }, 
      { parts: ["Can I", "a sample first?"], hint: "دەتوانم سەرەتا تامی نموونەیەکی بکەم؟", answer: "try", wrongs: ["have", "taste", "take"] }
    ],
    conversations: [
      { situation: "لە بازاڕێکی خواردنی سەر شەقامدا", theyAsk: "What would you like?", correct: "Can I get two of those please? And can I try a sample first?", wrong1: "I will take everything you have.", wrong2: "How much does one cost?", wrong3: "I do not want anything today.", explanation: "'Can I get two? Can I try a sample first?' — سروشتی بازاڕی سەر شەقام" }
    ],
  },
  {
    topic: "Leftovers & Takeout", topicKu: "خواردنی ماوەی و بردنە دەرەوە",
    words: [
      { english: "Doggy bag", kurdish: "قوتووی خواردن بۆ ماڵەوە" }, 
      { english: "Leftovers", kurdish: "خواردنی ماوە" }, 
      { english: "Still good", kurdish: "هێشتا باشە" }, 
      { english: "Reheat", kurdish: "گەرمکردنەوە" }, 
      { english: "Call it in", kurdish: "بە تەلەفۆن داواکاریەکە بکە" }
    ],
    voices: [
      { prompt: "داوای قوتووێک بکە بۆ خواردنە ماوەکەت", target: "Can I get a box for the rest of this?", targetKurdish: "دەتوانم قوتوویەکم بۆ ماوەی ئەم خواردنە بدەیتێ؟" }, 
      { prompt: "داواکارییەک بە تەلەفۆن تۆمار بکە", target: "I'd like to call in an order for pickup", targetKurdish: "دەمەوێت بە تەلەفۆن داواکارییەک بکەم بۆ ئەوەی بیبەمەوە" }
    ],
    sentences: [
      { english: ["Can", "I", "get", "a", "box", "for", "this"], kurdish: "دەتوانم قوتوویەک بۆ ئەمە وەربگرم؟" }, 
      { english: ["I'll", "reheat", "the", "leftovers", "tomorrow"], kurdish: "سبەینێ خواردنە ماوەکە دووبارە گەرم دەکەمەوە" }
    ],
    fillBlanks: [
      { parts: ["Can I get a", "for the rest of this?"], hint: "دەتوانم قوتوویەک وەرگرم بۆ ماوەی ئەم خواردنە؟", answer: "box", wrongs: ["bag", "wrap", "container"] }, 
      { parts: ["The", "from last night are still good!"], hint: "خواردنە ماوەکەی دوێنێ شەو هێشتا باشە!", answer: "leftovers", wrongs: ["food", "meal", "dinner"] }
    ],
    conversations: [
      { situation: "خواردنەکەت زۆر ماوەتەوە", theyAsk: "Are you finished with this?", correct: "Almost — could I get a box for the rest? Don't wanna waste it!", wrong1: "Yes, I am completely finished.", wrong2: "No, I want to throw it away.", wrong3: "Please take the plate now.", explanation: "'Could I get a box? Don't wanna waste it!' — ڕێزدار و باو لە چێشتخانە" }
    ],
  },
];

export default unit03;
