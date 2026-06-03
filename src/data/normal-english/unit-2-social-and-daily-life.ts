import { UnitBank } from "../types";

// ── Unit 1: Everyday Social & Practical English — 10 unique lessons ──────────
// Practical English for Kurdish speakers: Real-life scenarios, social interactions, and practical daily tasks.

const normalUnit01: UnitBank = [

  // Lesson 0: Greetings & Catching Up
  {
    topic: "Catching Up", topicKu: "هەواڵپرسین و بینینەوە",
    words: [
      { english: "How have you been",  kurdish: "چۆن بوویت؟ (بۆ ماوەیەک کە نەتبینیوە)" },
      { english: "It's been a while",  kurdish: "ماوەیەکە یەکمان نەدیوە" },
      { english: "What have you been up to", kurdish: "خەریکی چیت؟ (لەم ماوەیەدا)" },
      { english: "Let's catch up soon", kurdish: "با بە زوویی یەکتر ببینینەوە و قسە بکەین" },
      { english: "Taking it easy",     kurdish: "تەنها پشوو دەدەم / خۆم ماندوو ناکەم" },
    ],
    voices: [
      { prompt: "سڵاوکردن لە هاوڕێیەک دوای ماوەیەک", target: "Hi, how have you been? It's been a while.", targetKurdish: "سڵاو، چۆن بوویت؟ ماوەیەکە یەکمان نەدیوە." },
      { prompt: "کۆتایی پێهێنانی گفتوگۆیەکی کورت", target: "It was great seeing you. Let's catch up soon.", targetKurdish: "بینینت زۆر خۆش بوو. با بە زوویی یەکتر ببینینەوە." },
    ],
    sentences: [
      { english: ["What", "have", "you", "been", "up", "to", "lately"], kurdish: "لەم دواییانەدا خەریکی چی بوویت؟" },
      { english: ["I'm", "just", "taking", "it", "easy", "these", "days"], kurdish: "ئەم ڕۆژانە تەنها پشوو دەدەم و خۆم ماندوو ناکەم" },
    ],
    fillBlanks: [
      { parts: ["How have you", "lately?"], hint: "لەم دواییانەدا چۆن بوویت؟", answer: "been", wrongs: ["are", "is", "doing"] },
      { parts: ["Let's catch", "over coffee next week."], hint: "با هەفتەی داهاتوو لەسەر قاوەیەک یەکتر ببینینەوە و قسە بکەین.", answer: "up", wrongs: ["out", "in", "on"] },
    ],
    conversations: [
      { situation: "لە مۆڵێکدا بە ڕێکەوت هاوڕێیەکی کۆن دەبینیت", theyAsk: "Hey! I haven't seen you in months. How are you?", correct: "I've been great, thanks! What have you been up to these days?", wrong1: "I am fine.", wrong2: "I do nothing.", wrong3: "What are you doing now?", explanation: "'How have you been' و 'What have you been up to' ڕێگەیەکی زۆر سروشتی و باوە بۆ هەواڵپرسین لە کەسێک کە ماوەیەکە نەتبینیوە" },
    ],
  },

  // Lesson 1: Making Plans & Inviting
  {
    topic: "Making Plans", topicKu: "دانانی پلان و بانگهێشتکردن",
    words: [
      { english: "Are you free",         kurdish: "کاتت هەیە؟ / بەتاڵیت؟" },
      { english: "Do you want to grab",  kurdish: "دەتەوێت بچین بۆ (خواردن/خواردنەوە)؟" },
      { english: "Does that work for you", kurdish: "ئەوە بۆ تۆ گونجاوە؟" },
      { english: "Sounds like a plan",   kurdish: "بیرۆکەیەکی زۆر باشە (ڕازیبوون لەسەر پلانێک)" },
      { english: "I'm tied up",          kurdish: "دەستم گیراوە / سەرقاڵم" },
    ],
    voices: [
      { prompt: "پێشنیارکردنی چوونە دەرەوە", target: "Do you want to grab coffee tomorrow morning?", targetKurdish: "دەتەوێت بەیانی بچین قاوەیەک بخۆینەوە؟" },
      { prompt: "گونجاندنی کات", target: "Let's meet at six. Does that work for you?", targetKurdish: "با کاتژمێر شەش یەکتر ببینین. ئەوە بۆ تۆ گونجاوە؟" },
    ],
    sentences: [
      { english: ["Are", "you", "free", "to", "meet", "up", "this", "weekend"], kurdish: "کاتت هەیە ئەم کۆتایی هەفتەیە یەکتر ببینین؟" },
      { english: ["That", "sounds", "like", "a", "plan", "see", "you", "then"], kurdish: "بیرۆکەیەکی زۆر باشە، کەواتە دەتبینم" },
    ],
    fillBlanks: [
      { parts: ["Are you", "on Friday evening?"], hint: "ئێوارەی هەینی کاتت هەیە؟", answer: "free", wrongs: ["empty", "available", "good"] },
      { parts: ["I'd love to, but I'm", "up with work."], hint: "حەزم دەکرد بێم، بەڵام دەستم گیراوە بە کارەوە.", answer: "tied", wrongs: ["busy", "stuck", "held"] },
    ],
    conversations: [
      { situation: "دەتەوێت لەگەڵ هاوکارێکت بچیتە دەرەوە بۆ نانخواردن", theyAsk: "I'm getting hungry. Should we go eat?", correct: "Yeah, do you want to grab lunch at the new cafe? Does 1 PM work for you?", wrong1: "Yes, we eat lunch.", wrong2: "I want food at 1 PM.", wrong3: "We go cafe now.", explanation: "دەستەواژەی 'grab lunch/coffee' زۆر باوە لە ئینگلیزی ئاخاوتندا بۆ چوونە دەرەوەیەکی خێرا" },
    ],
  },

  // Lesson 2: Ordering at a Restaurant
  {
    topic: "Dining Out", topicKu: "نانخواردن لە دەرەوە",
    words: [
      { english: "I would like to order", kurdish: "دەمەوێت داوا بکەم" },
      { english: "Could I have the bill", kurdish: "دەکرێت پسووڵەکە (حسابەکە) بێنیت؟" },
      { english: "On the side",          kurdish: "لە تەنیشتییەوە (وەک خواردنی لاوەکی)" },
      { english: "I'll have the same",   kurdish: "منیش هەمان شت دەخۆم" },
      { english: "Keep the change",      kurdish: "باقیەکەی بۆ خۆت (وەک بەخشیش)" },
    ],
    voices: [
      { prompt: "داواکردنی خواردن بە شێوازێکی جوان", target: "I would like the grilled chicken with salad on the side, please.", targetKurdish: "تکایە، حەزم لە مریشکی برژاوەیە لەگەڵ زەڵاتە لە تەنیشتییەوە." },
      { prompt: "داواکردنی پسووڵەی پارە", target: "Could we get the bill, please? We're ready to pay.", targetKurdish: "تکایە، دەکرێت پسووڵەکەمان بۆ بێنیت؟ ئامادەین بۆ پارەدان." },
    ],
    sentences: [
      { english: ["Could", "I", "have", "the", "bill", "please"], kurdish: "دەکرێت پسووڵەکە بێنیت تکایە؟" },
      { english: ["I'll", "have", "the", "same", "as", "him"], kurdish: "منیش هەمان شتی ئەو دەخۆم" },
    ],
    fillBlanks: [
      { parts: ["I", "like to order the pasta."], hint: "حەزم لێیە پاستاکە داوا بکەم.", answer: "would", wrongs: ["want", "will", "can"] },
      { parts: ["Could we get some fries on the", "?"], hint: "دەکرێت کەمێک پەتاتەی سوورکراوە وەک خواردنی لاوەکی بێنین؟", answer: "side", wrongs: ["next", "plate", "part"] },
    ],
    conversations: [
      { situation: "نانخواردنەکەتان تەواو بووە و دەتەوێت بڕۆیت", theyAsk: "Can I get you anything else for dessert?", correct: "No, thank you. Could I have the bill, please?", wrong1: "Give me the check.", wrong2: "I want to pay now.", wrong3: "Bring the money paper.", explanation: "'Could I have the bill, please?' باوترین و بەئەدەبترین ڕێگەیە بۆ داواکردنی حسابی چێشتخانە" },
    ],
  },

  // Lesson 3: Shopping & Bargaining
  {
    topic: "Shopping", topicKu: "بازاڕکردن",
    words: [
      { english: "I'm just browsing",    kurdish: "تەنها سەیر دەکەم (نامەوێت شت بکڕم لە ئێستادا)" },
      { english: "Do you have this in",  kurdish: "ئەمەتان هەیە بە (قەبارە/ڕەنگ)...؟" },
      { english: "Can I try it on",      kurdish: "دەتوانم تاقی بکەمەوە؟" },
      { english: "Out of my budget",     kurdish: "لە سەرووی بودجەکەمەوەیە (گرانە)" },
      { english: "Is that your best price", kurdish: "ئەوە دوا نرختە؟ / داشکاندن دەکەیت؟" },
    ],
    voices: [
      { prompt: "کاتێک پێویستت بە یارمەتی فرۆشیار نییە", target: "No thank you, I'm just browsing for now.", targetKurdish: "نەخێر سوپاس، تەنها سەیر دەکەم بۆ ئێستا." },
      { prompt: "مامەڵەکردن لەسەر نرخ", target: "It's a bit out of my budget. Is that your best price?", targetKurdish: "کەمێک لە سەرووی بودجەکەمەوەیە. ئەوە باشترین نرختە؟" },
    ],
    sentences: [
      { english: ["Do", "you", "have", "this", "in", "a", "medium"], kurdish: "ئەمەتان هەیە بە قەبارەی مامناوەند (میدیەم)؟" },
      { english: ["Where", "is", "the", "fitting", "room", "please"], kurdish: "تکایە ژووری خۆگۆڕین لە کوێیە؟" },
    ],
    fillBlanks: [
      { parts: ["I'm just", ", thank you."], hint: "تەنها سەیر دەکەم، سوپاس.", answer: "browsing", wrongs: ["looking", "seeing", "watching"] },
      { parts: ["Is that your", "price?"], hint: "ئەوە باشترین نرختە؟ (بۆ مامەڵەکردن)", answer: "best", wrongs: ["last", "final", "good"] },
    ],
    conversations: [
      { situation: "جلێک تاقی دەکەیتەوە بەڵام نرخەکەی گرانە", theyAsk: "How did the jacket fit? It looks great on you.", correct: "It fits perfectly, but it's a bit out of my budget. Do you offer any discounts?", wrong1: "It's too expensive, lower the price.", wrong2: "I don't have money for this.", wrong3: "Make it cheaper for me.", explanation: "'A bit out of my budget' ڕێگەیەکی زۆر جوانە بۆ گوتنی ئەوەی کە شتێک گرانە بەبێ ئەوەی ڕاستەوخۆ بڵێیت گرانە" },
    ],
  },

  // Lesson 4: Asking for Directions
  {
    topic: "Asking for Directions", topicKu: "پرسین لە ناونیشان",
    words: [
      { english: "Could you point me to", kurdish: "دەتوانیت ڕێنماییم بکەیت بۆ..." },
      { english: "Walking distance",     kurdish: "دوورییەک کە بە پێ بڕۆیت" },
      { english: "I'm a bit lost",       kurdish: "کەمێک ون بووم" },
      { english: "Go straight ahead",    kurdish: "ڕاستەوخۆ بڕۆ پێشەوە" },
      { english: "Right around the corner", kurdish: "ڕێک لەو سووچەیە / زۆر نزیکە" },
    ],
    voices: [
      { prompt: "داوای یارمەتی بکە کاتێک ون بوویت", target: "Excuse me, I'm a bit lost. Could you point me to the train station?", targetKurdish: "ببوورە، کەمێک ون بووم. دەتوانیت ڕێنماییم بکەیت بۆ وێستگەی شەمەندەفەرەکە؟" },
      { prompt: "پرسین لە دووری شوێنێک", target: "Is the museum within walking distance from here?", targetKurdish: "ئایا مۆزەخانەکە بە پێ لێرەوە نزیکە؟" },
    ],
    sentences: [
      { english: ["Is", "it", "within", "walking", "distance", "from", "here"], kurdish: "ئایا لێرەوە ئەوەندە نزیکە کە بە پێ بڕۆین؟" },
      { english: ["Go", "straight", "ahead", "and", "take", "the", "second", "right"], kurdish: "ڕاستەوخۆ بڕۆ پێشەوە و بە دووەم لاڕێی لای ڕاستدا بڕۆ" },
    ],
    fillBlanks: [
      { parts: ["Could you", "me to the nearest bank?"], hint: "دەتوانیت ڕێنماییم بکەیت بۆ نزیکترین بانك؟", answer: "point", wrongs: ["show", "give", "tell"] },
      { parts: ["Don't worry, it's right around the", "."], hint: "خەمت نەبێت، ڕێک لەو سووچەیە (زۆر نزیکە).", answer: "corner", wrongs: ["street", "way", "block"] },
    ],
    conversations: [
      { situation: "لە شارێکی نوێیت و بەدوای میوانخانەکەدا دەگەڕێیت", theyAsk: "You look lost. Can I help you find something?", correct: "Yes, please. I'm looking for the Grand Hotel. Is it within walking distance?", wrong1: "Where is Grand Hotel?", wrong2: "I want to go to Grand Hotel now.", wrong3: "Point me to the hotel.", explanation: "'Is it within walking distance?' پرسیارێکی زۆر باوە بۆ زانینی ئەوەی ئایا پێویست بە تەکسی دەکات یان نا" },
    ],
  },

  // Lesson 5: Health & Seeing a Doctor
  {
    topic: "Health & Doctor", topicKu: "تەندروستی و سەردانی پزیشک",
    words: [
      { english: "I'm not feeling well", kurdish: "هەست بە باشی ناکەم" },
      { english: "Make an appointment",  kurdish: "دانانی کات بۆ بینین (مەوعید)" },
      { english: "I've been feeling dizzy", kurdish: "هەستم بە گێژبوونی سەر کردووە" },
      { english: "Sore throat",          kurdish: "قورگ ئێشە" },
      { english: "Prescription",         kurdish: "ڕەچەتەی پزیشک" },
    ],
    voices: [
      { prompt: "هەستکردن بە نەخۆشی", target: "I'm not feeling well today. I have a headache and a sore throat.", targetKurdish: "ئەمڕۆ هەست بە باشی ناکەم. سەرم دێشێت و قورگیشم دێشێت." },
      { prompt: "دانانی کات لای پزیشک", target: "I need to make an appointment. I've been feeling dizzy lately.", targetKurdish: "پێویستە کاتێک دابنێم. لەمدوایانەدا هەستم بە گێژبوون کردووە." },
    ],
    sentences: [
      { english: ["I", "need", "to", "make", "an", "appointment"], kurdish: "پێویستە کاتێک (مەوعیدێک) دابنێم" },
      { english: ["The", "doctor", "gave", "me", "a", "prescription"], kurdish: "پزیشکەکە ڕەچەتەیەکی پێدام" },
    ],
    fillBlanks: [
      { parts: ["I've been feeling a bit", "lately, like the room is spinning."], hint: "لەمدوایانەدا هەستم بە گێژبوون کردووە، وەک ئەوەی ژوورەکە بسوڕێتەوە.", answer: "dizzy", wrongs: ["tired", "sick", "weak"] },
      { parts: ["I need to drop off this", "at the pharmacy."], hint: "پێویستە ئەم ڕەچەتەیە ببەمە دەرمانخانەکە.", answer: "prescription", wrongs: ["paper", "medicine", "note"] },
    ],
    conversations: [
      { situation: "تەلەفۆن بۆ نۆرینگەی پزیشک دەکەیت", theyAsk: "City Clinic, how can I help you?", correct: "Hi, I'm not feeling well and I've had a sore throat for days. I'd like to make an appointment, please.", wrong1: "I am sick. I want doctor.", wrong2: "Give me a time to see the doctor.", wrong3: "My throat hurts.", explanation: "'I'd like to make an appointment' باشترین شێوازە. لە ئینگلیزیدا وشەی 'appointment' بەکاردێت بۆ دانانی کات لای پزیشک، نەک 'meeting' یان 'time'" },
    ],
  },

  // Lesson 6: Expressing Emotions & Empathy
  {
    topic: "Emotions & Empathy", topicKu: "هەستەکان و هاوسۆزی",
    words: [
      { english: "I'm absolutely thrilled", kurdish: "زۆر زۆر دڵخۆشم / بەپەرۆشم" },
      { english: "I'm so sorry to hear that", kurdish: "زۆر خەفەتم خوارد کە ئەوەم بیست" },
      { english: "It's so frustrating",   kurdish: "ئەمە زۆر بێزارکەرە (کاتێک شتێک بە دڵی تۆ ناڕوات)" },
      { english: "That's such a relief",  kurdish: "ئەوە جێگەی دڵنەواییە (سووکنایی)" },
      { english: "I can't believe it",    kurdish: "بڕوا ناکەم (لە سەرسووڕماندا)" },
    ],
    voices: [
      { prompt: "دڵخۆشییەکی زۆر دەرببڕە", target: "I'm absolutely thrilled about the new job!", targetKurdish: "زۆر زۆر دڵخۆشم بە کارە نوێیەکە!" },
      { prompt: "هاوسۆزی بۆ هەواڵێکی ناخۆش", target: "I'm so sorry to hear that you've been unwell.", targetKurdish: "زۆر خەفەتم خوارد کە بیستم نەخۆش بوویت." },
    ],
    sentences: [
      { english: ["That's", "such", "a", "relief", "to", "know"], kurdish: "ئەوە جێگەی دڵنەواییە کە ئەوە دەزانم" },
      { english: ["It's", "so", "frustrating", "when", "things", "go", "wrong"], kurdish: "زۆر بێزارکەرە کاتێک شتەکان هەڵە دەبن" },
    ],
    fillBlanks: [
      { parts: ["I'm absolutely", "to be joining your team!"], hint: "زۆر زۆر دڵخۆشم کە پەیوەندی بە تیمەکەتانەوە دەکەم!", answer: "thrilled", wrongs: ["happy", "glad", "good"] },
      { parts: ["That's such a", "— I thought I lost my wallet."], hint: "ئەوە جێگەی سووکناییە — پێم وابوو جزدانەکەم ون کردووە.", answer: "relief", wrongs: ["good thing", "luck", "break"] },
    ],
    conversations: [
      { situation: "هاوڕێیەکەت پێت دەڵێت کە تاقیکردنەوەیەکی قورسی دەرچووە", theyAsk: "I finally passed my driving test! I was so stressed.", correct: "That's such a relief! I'm absolutely thrilled for you.", wrong1: "Good for you.", wrong2: "I am happy.", wrong3: "Nice to hear.", explanation: "'That's such a relief' و 'absolutely thrilled' کاردانەوەی زۆر سروشتی و بەهێزن لە ئینگلیزیدا لەبری تەنها وتنێکی سادەی 'I am happy'" },
    ],
  },

  // Lesson 7: Travel & Airport English
  {
    topic: "Airport & Flights", topicKu: "فڕۆکەخانە و گەشتەکان",
    words: [
      { english: "Where is the check-in desk", kurdish: "مێزی پشکنین (چێک ئین) لە کوێیە؟" },
      { english: "Boarding pass",        kurdish: "بلیت یان کارتی سواربوون" },
      { english: "Any luggage to check", kurdish: "هیچ جانتایەکت هەیە بیدەیتە بار؟" },
      { english: "Gate number",          kurdish: "ژمارەی دەروازە" },
      { english: "Carry-on bag",         kurdish: "جانتای دەست (کە دەچێتە ناو فڕۆکە)" },
    ],
    voices: [
      { prompt: "پرسین لە مێزی پشکنین", target: "Excuse me, where is the check-in desk for this flight?", targetKurdish: "ببوورە، مێزی پشکنین بۆ ئەم گەشتە لە کوێیە؟" },
      { prompt: "پێدانی پاسپۆرت لە فڕۆکەخانە", target: "Here is my passport and ticket.", targetKurdish: "فەرموو ئەمە پاسپۆرت و بلیتەکەمە." },
    ],
    sentences: [
      { english: ["Do", "you", "have", "any", "luggage", "to", "check", "in"], kurdish: "هیچ جانتایەکت هەیە بۆ پشکنین (بار)؟" },
      { english: ["Your", "flight", "leaves", "from", "gate", "number", "five"], kurdish: "گەشتەکەت لە دەروازەی ژمارە پێنجەوە دەفڕێت" },
    ],
    fillBlanks: [
      { parts: ["Here is my", "pass and passport."], hint: "فەرموو ئەمە کارتی سواربوون و پاسپۆرتەکەمە.", answer: "boarding", wrongs: ["flying", "plane", "ticket"] },
      { parts: ["Is this your only", "bag?"], hint: "ئایا ئەمە تەنها جانتای دەستتە؟", answer: "carry-on", wrongs: ["hand", "small", "flight"] },
    ],
    conversations: [
      { situation: "لە مێزی پشکنین (Check-in) لە فڕۆکەخانە", theyAsk: "Can I see your passport and ticket, please? Are you checking any bags?", correct: "Here is my passport. Yes, I have one suitcase to check in, and this is my carry-on.", wrong1: "Here. I have big bag and small bag.", wrong2: "This is passport. Take my bag.", wrong3: "I have luggage for plane.", explanation: "وشەکانی 'suitcase', 'check in', و 'carry-on' وشەی بنەڕەتی و دروستن بۆ مامەڵەکردن لە فڕۆکەخانە" },
    ],
  },

  // Lesson 8: Checking into a Hotel
  {
    topic: "Hotel Check-in", topicKu: "وەرگرتنی ژوور لە هۆتێل",
    words: [
      { english: "I have a reservation", kurdish: "حجزێکم هەیە" },
      { english: "Under the name",       kurdish: "بە ناوی..." },
      { english: "Is breakfast included", kurdish: "ئایا نانی بەیانی لەگەڵدایە؟" },
      { english: "What time is check-out", kurdish: "کاتی جێهێشتنی ژوور کەییە؟" },
      { english: "Room key",             kurdish: "کلیلی ژوور" },
    ],
    voices: [
      { prompt: "پێدانی زانیاری حجزکردن", target: "I have a reservation for three nights under the name Ali.", targetKurdish: "حجزێکم هەیە بۆ سێ شەو بە ناوی عەلی." },
      { prompt: "پرسین لە کاتی جێهێشتن", target: "What time is check-out tomorrow morning?", targetKurdish: "سبەی بەیانی کاتی جێهێشتنی ژوور (چێک ئاوت) کەییە؟" },
    ],
    sentences: [
      { english: ["Is", "breakfast", "included", "in", "the", "room", "price"], kurdish: "ئایا نانی بەیانی لە نرخی ژوورەکەدا هەژمار کراوە؟" },
      { english: ["Could", "I", "get", "a", "wake-up", "call", "at", "seven"], kurdish: "دەکرێت کاتژمێر حەوت تەلەفۆنم بۆ بکەن بۆ لەخەوهەستان؟" },
    ],
    fillBlanks: [
      { parts: ["I have a", "for two nights."], hint: "حجزێکم هەیە بۆ دوو شەو.", answer: "reservation", wrongs: ["booking", "room", "place"] },
      { parts: ["Is breakfast", "?"], hint: "ئایا نانی بەیانی لەگەڵدایە؟", answer: "included", wrongs: ["with", "there", "free"] },
    ],
    conversations: [
      { situation: "گەیشتن بە هۆتێل و وەرگرتنی ژوور", theyAsk: "Welcome to the Grand Hotel. How can I help you?", correct: "Hello, I have a reservation for three nights under the name Ahmed. Is breakfast included?", wrong1: "I booked room. Name Ahmed.", wrong2: "I want my room.", wrong3: "Give me key, I have room.", explanation: "'I have a reservation under the name...' ڕستەیەکی زۆر ستاندارد و فەرمییە بۆ وەرگرتنی ژووری هۆتێل" },
    ],
  },

  // Lesson 9: Supermarket & Groceries
  {
    topic: "Supermarket & Groceries", topicKu: "بازاڕکردن لە سوپەرمارکێت",
    words: [
      { english: "Shopping cart",        kurdish: "عەرەبانەی بازاڕکردن" },
      { english: "Aisle",                kurdish: "ڕاڕەو (لەنێوان ڕەفەکاندا)" },
      { english: "On sale",              kurdish: "داشکاندنی بۆ کراوە" },
      { english: "Self-checkout",        kurdish: "ئامێری خۆ-حسابکردن" },
      { english: "Paper or plastic",     kurdish: "کیسی کاغەز یان پلاستیک؟" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە شوێنی شتێک", target: "Excuse me, which aisle is the milk in?", targetKurdish: "ببوورە، شیر لە کام ڕاڕەودایە؟" },
      { prompt: "پرسیارکردن لە نرخ", target: "Is this item on sale? I saw a sign outside.", targetKurdish: "ئایا داشکاندن بۆ ئەمە کراوە؟ لە دەرەوە تابلۆیەکم بینی." },
    ],
    sentences: [
      { english: ["Could", "you", "tell", "me", "where", "the", "baking", "aisle", "is"], kurdish: "دەتوانیت پێم بڵێیت ڕاڕەوی کەلوپەلی هەویرکاری لە کوێیە؟" },
      { english: ["I", "will", "use", "the", "self-checkout", "to", "save", "time"], kurdish: "ئامێری خۆ-حسابکردن بەکاردەهێنم بۆ ئەوەی کات بگەڕێنمەوە" },
    ],
    fillBlanks: [
      { parts: ["Excuse me, which", "is the bread in?"], hint: "ببوورە، نان لە کام ڕاڕەودایە؟", answer: "aisle", wrongs: ["hall", "path", "line"] },
      { parts: ["I need a shopping", "because I'm buying a lot."], hint: "پێویستم بە عەرەبانەیەکی بازاڕکردنە چونکە شتی زۆر دەکڕم.", answer: "cart", wrongs: ["bag", "box", "car"] },
    ],
    conversations: [
      { situation: "لە سوپەرمارکێت بەدوای شتێکدا دەگەڕێیت", theyAsk: "Do you need help finding anything?", correct: "Yes, please. Which aisle is the milk in? Also, are these apples on sale?", wrong1: "Where is milk? Is apple cheap?", wrong2: "I want milk. Sale for apple?", wrong3: "Which path for milk? Apple discount?", explanation: "وشەی 'aisle' (ڕاڕەو) زۆر گرنگە لە سوپەرمارکێتدا و پیتی (s) تێیدا ناخوێندرێتەوە" },
    ],
  },

];

export default normalUnit01;
