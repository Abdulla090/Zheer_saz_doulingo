import { UnitBank } from "../types";

// ── Unit 5: Travel & Exploring the World — 10 unique lessons ──────────
// Advanced travel vocabulary for navigating airports, cities, emergencies, and new cultures.

const normalUnit05: UnitBank = [

  // Lesson 0: Immigration & Customs
  {
    topic: "Immigration & Customs", topicKu: "پاسپۆرت و گومرگ (لە فڕۆکەخانە)",
    words: [
      { english: "Purpose of your visit", kurdish: "مەبەست لە سەردانەکەت (گەشتەکەت)" },
      { english: "Declare anything",     kurdish: "ئاشکراکردنی شتێک (بۆ گومرگ - شتێک کە باجی لەسەرە)" },
      { english: "Duration of stay",     kurdish: "ماوەی مانەوە" },
      { english: "Connecting flight",    kurdish: "گەشتی ترانزێت (گۆڕینی فڕۆکە)" },
      { english: "Return ticket",        kurdish: "بلیتی گەڕانەوە" },
    ],
    voices: [
      { prompt: "پرسیاری پاسەوانی سنوور", target: "What is the purpose of your visit to this country?", targetKurdish: "مەبەست لە سەردانەکەت بۆ ئەم وڵاتە چییە؟" },
      { prompt: "ئاماژەدان بە کاتی گەڕانەوە", target: "I have a return ticket for the 15th of next month.", targetKurdish: "بلیتی گەڕانەوەم هەیە بۆ ڕۆژی ١٥ی مانگی داهاتوو." },
    ],
    sentences: [
      { english: ["Do", "you", "have", "anything", "to", "declare", "at", "customs"], kurdish: "ئایا هیچ شتێکت پێیە کە پێویست بکات لە گومرگ ئاشکرای بکەیت؟" },
      { english: ["My", "duration", "of", "stay", "will", "be", "two", "weeks"], kurdish: "ماوەی مانەوەکەم دوو هەفتە دەبێت" },
    ],
    fillBlanks: [
      { parts: ["I am here on vacation. The", "of my visit is tourism."], hint: "بۆ پشوو لێرەم. مەبەست لە گەشتەکەم گەشتیارییە.", answer: "purpose", wrongs: ["reason", "way", "idea"] },
      { parts: ["I need to catch my", "flight to London at gate 4."], hint: "پێویستە بگەڕێمەوە بە گەشتی ترانزێتەکەم (گۆڕینی فڕۆکەکەم) بۆ لەندەن لە دەروازەی ٤.", answer: "connecting", wrongs: ["second", "next", "moving"] },
    ],
    conversations: [
      { situation: "لە بەردەم ئەفسەری پاسپۆرت", theyAsk: "Welcome. May I see your passport? What is the purpose of your visit?", correct: "Here is my passport. The purpose of my visit is tourism. My duration of stay is exactly two weeks.", wrong1: "I come to see things. Two weeks.", wrong2: "Passport here. I am tourist.", wrong3: "I visit for holiday.", explanation: "'Purpose of your visit' و 'duration of stay' پرسیارە فەرمییەکانی هەموو فڕۆکەخانەیەکن" },
    ],
  },

  // Lesson 1: Renting a Car Abroad
  {
    topic: "Renting a Car", topicKu: "کرێکردنی ئۆتۆمبێل (لە دەرەوەی وڵات)",
    words: [
      { english: "International driving permit", kurdish: "مۆڵەتی شۆفێریی نێودەوڵەتی" },
      { english: "Full coverage insurance", kurdish: "دڵنیایی (تەئمینی) گشتگیر" },
      { english: "Unlimited mileage",    kurdish: "کیلۆمەتری بێسنوور (بۆ لێخوڕین)" },
      { english: "Drop-off location",    kurdish: "شوێنی ڕادەستکردنەوە (دانانەوەی ئۆتۆمبێلەکە)" },
      { english: "Manual or automatic",  kurdish: "گێڕی عادی یان ئۆتۆماتیک" },
    ],
    voices: [
      { prompt: "پرسیارکردن دەربارەی دڵنیایی", target: "I would like to add full coverage insurance to my rental.", targetKurdish: "حەز دەکەم دڵنیایی گشتگیر (تەئمینی فول) زیاد بکەم بۆ کرێی ئۆتۆمبێلەکەم." },
      { prompt: "شوێنی دانانەوەی ئۆتۆمبێل", target: "Can I choose a different drop-off location?", targetKurdish: "دەتوانم شوێنێکی جیاواز هەڵبژێرم بۆ ڕادەستکردنەوەی ئۆتۆمبێلەکە؟" },
    ],
    sentences: [
      { english: ["Do", "you", "need", "an", "international", "driving", "permit", "here"], kurdish: "لێرە پێویستت بە مۆڵەتی شۆفێریی نێودەوڵەتییە؟" },
      { english: ["Does", "this", "car", "come", "with", "unlimited", "mileage"], kurdish: "ئایا ئەم ئۆتۆمبێلە کیلۆمەتری بێسنووری لەگەڵدایە؟" },
    ],
    fillBlanks: [
      { parts: ["I only know how to drive an", "transmission."], hint: "تەنها دەزانم ئۆتۆمبێلی گێڕ ئۆتۆماتیک لێبخوڕم.", answer: "automatic", wrongs: ["easy", "normal", "fast"] },
      { parts: ["Make sure you have full", "insurance just in case."], hint: "دڵنیابەرەوە کە دڵنیایی گشتگیرت (فول تەئمین) هەیە نەوەک شتێک ڕووبدات.", answer: "coverage", wrongs: ["cover", "money", "paper"] },
    ],
    conversations: [
      { situation: "لە کۆمپانیای کرێدانی ئۆتۆمبێل", theyAsk: "We have an SUV available. Would you like basic or full insurance?", correct: "I'll take the full coverage insurance, please. Also, does the rental include unlimited mileage?", wrong1: "Give me good insurance and free drive.", wrong2: "I want full protect and no kilometer limit.", wrong3: "Yes full insurance. Unlimited distance?", explanation: "کۆمپانیاکانی کرێدانی ئۆتۆمبێل زاراوەی وەک 'Coverage' (دڵنیایی) و 'Mileage' (دووری) بەکاردەهێنن" },
    ],
  },

  // Lesson 2: Navigating Public Transport
  {
    topic: "Public Transport", topicKu: "گواستنەوەی گشتی (مترۆ، پاس)",
    words: [
      { english: "Which line goes to",   kurdish: "کام هێڵ دەچێت بۆ..." },
      { english: "Round trip ticket",    kurdish: "بلیتی چوون و هاتنەوە" },
      { english: "Mind the gap",         kurdish: "ئاگاداری بۆشاییەکە بە (نێوان شەمەندەفەر و ڕێگاکە)" },
      { english: "Rush hour",            kurdish: "کاتی قەرەباڵغی (کاتی چوونە سەر کار و گەڕانەوە)" },
      { english: "Transfer at the next stop", kurdish: "گۆڕین (دابەزین بۆ هێڵێکی تر) لە وێستگەی داهاتوو" },
    ],
    voices: [
      { prompt: "کڕینی بلیتی گەڕانەوە", target: "I would like one round trip ticket to the city center.", targetKurdish: "یەک بلیتی چوون و هاتنەوەم دەوێت بۆ سەنتەری شار." },
      { prompt: "پرسیارکردن لە ڕێگا", target: "Excuse me, which line goes to the central station?", targetKurdish: "ببوورە، کام هێڵ دەچێت بۆ وێستگەی ناوەندی؟" },
    ],
    sentences: [
      { english: ["You", "need", "to", "transfer", "at", "the", "next", "stop"], kurdish: "پێویستە لە وێستگەی داهاتوو دابەزیت بۆ گۆڕینی هێڵەکە" },
      { english: ["The", "trains", "are", "very", "packed", "during", "rush", "hour"], kurdish: "شەمەندەفەرەکان زۆر قەرەباڵغن لە کاتی چونە سەر کاردا" },
    ],
    fillBlanks: [
      { parts: ["Please stand back and", "the gap."], hint: "تکایە بگەڕێرەوە دواوە و ئاگاداری بۆشاییەکە (نێوان شەمەندەفەر و وێستگەکە) بە.", answer: "mind", wrongs: ["watch", "look", "see"] },
      { parts: ["A one-way ticket is $5, and a", "trip is $9."], hint: "بلیتی یەک ئاراستە ٥ دۆلارە، و بلیتی چوون و هاتنەوە ٩ دۆلارە.", answer: "round", wrongs: ["two", "both", "full"] },
    ],
    conversations: [
      { situation: "پرسیارکردن لە کارمەندێکی میترۆ", theyAsk: "Can I help you find your train?", correct: "Yes, please. Which line goes to the museum? And do I need to transfer at the next stop?", wrong1: "Where is museum train? Do I change?", wrong2: "I want museum. Tell me train.", wrong3: "Which subway to museum?", explanation: "'Which line goes to' و 'Transfer' دوو وشەی سەرەکین لە سیستەمی گواستنەوەی وڵاتاندا" },
    ],
  },

  // Lesson 3: Dealing with Lost Luggage
  {
    topic: "Lost Luggage", topicKu: "ونبوونی جانتا (لە فڕۆکەخانە)",
    words: [
      { english: "My luggage hasn't arrived", kurdish: "جانتاکانم (کەلوپەلەکانم) نەگەیشتوون" },
      { english: "Baggage claim",        kurdish: "شوێنی وەرگرتنەوەی جانتا" },
      { english: "File a missing baggage report", kurdish: "فۆڕمی ونبوونی جانتا پڕبکەرەوە" },
      { english: "Luggage tag",          kurdish: "تاگی جانتا (ئەو لەزگەیەی بە جانتاکەوەیە)" },
      { english: "Deliver it to my hotel", kurdish: "بیگەیەنن بۆ هۆتێلەکەم" },
    ],
    voices: [
      { prompt: "ڕاپۆرتکردنی ونبوون", target: "My luggage hasn't arrived yet. Where can I file a report?", targetKurdish: "جانتاکانم هێشتا نەگەیشتوون. لە کوێ دەتوانم ڕاپۆرت بکەم؟" },
      { prompt: "داوای گەیاندن", target: "When it is found, can you deliver it to my hotel?", targetKurdish: "کاتێک دۆزرایەوە، دەتوانن بیگەیەنن بۆ هۆتێلەکەم؟" },
    ],
    sentences: [
      { english: ["Here", "is", "my", "luggage", "tag", "and", "boarding", "pass"], kurdish: "فەرموو ئەمە تاگی جانتاکەم و بلیتی فڕۆکەکەمە" },
      { english: ["I", "waited", "at", "baggage", "claim", "for", "an", "hour"], kurdish: "کاتژمێرێک لە شوێنی وەرگرتنەوەی جانتاکان چاوەڕێم کرد" },
    ],
    fillBlanks: [
      { parts: ["I need to file a missing baggage", "immediately."], hint: "پێویستە دەستبەجێ فۆڕمی ڕاپۆرتی ونبوونی جانتا پڕبکەمەوە.", answer: "report", wrongs: ["paper", "form", "claim"] },
      { parts: ["Please check my luggage", "number."], hint: "تکایە ژمارەی تاگی جانتاکەم بپشکنە.", answer: "tag", wrongs: ["sticker", "paper", "mark"] },
    ],
    conversations: [
      { situation: "لە بەشی جانتا ونبووەکانی فڕۆکەخانە", theyAsk: "I'm sorry your bag isn't on the belt. Do you have your receipt?", correct: "Yes, here is my luggage tag. My luggage hasn't arrived. I need to file a missing baggage report and have it delivered to my hotel.", wrong1: "Bag is lost. Bring to hotel.", wrong2: "I no have bag. Where is it?", wrong3: "Find my bag. Here is sticker.", explanation: "'File a report' و پێدانی 'Luggage tag' پرۆسەی ڕەسمی فڕۆکەخانەکانە" },
    ],
  },

  // Lesson 4: Checking into an Airbnb
  {
    topic: "Airbnb & Rentals", topicKu: "وەرگرتنی ماڵی کرێی گەشتیاری (Airbnb)",
    words: [
      { english: "Self check-in instructions", kurdish: "ڕێنماییەکانی وەرگرتنی ماڵ (بەبێ بینینی خاوەن ماڵ)" },
      { english: "Lockbox code",         kurdish: "کۆدی سندووقی قفڵەکە (بۆ دەرکردنی کلیل)" },
      { english: "House rules",          kurdish: "یاساکانی ماڵەکە" },
      { english: "Wi-Fi password",       kurdish: "وشەی نهێنی وایفای" },
      { english: "Leave a review",       kurdish: "جێهێشتنی هەڵسەنگاندن / کۆمێنت" },
    ],
    voices: [
      { prompt: "پرسین لە ڕێنماییەکان", target: "Could you send me the self check-in instructions?", targetKurdish: "دەتوانیت ڕێنماییەکانی وەرگرتنی ماڵەکەم (بۆ خۆم) بۆ بنێریت؟" },
      { prompt: "کۆدی کلیلەکە", target: "The lockbox code is not working.", targetKurdish: "کۆدی سندووقی قفڵەکە کار ناکات." },
    ],
    sentences: [
      { english: ["Please", "make", "sure", "to", "read", "the", "house", "rules"], kurdish: "تکایە دڵنیابەرەوە لەوەی کە یاساکانی ماڵەکە دەخوێنیتەوە" },
      { english: ["Where", "can", "I", "find", "the", "Wi-Fi", "password"], kurdish: "لە کوێ دەتوانم وشەی نهێنی وایفایەکە بدۆزمەوە؟" },
    ],
    fillBlanks: [
      { parts: ["We had a great time and will definitely leave a positive", "."], hint: "کاتی زۆر خۆشمان بەسەربرد و بێگومان هەڵسەنگاندنێکی ئەرێنی جێدەهێڵین.", answer: "review", wrongs: ["message", "text", "word"] },
      { parts: ["I couldn't open the door. What is the", "code again?"], hint: "نەمتوانی دەرگاکە بکەمەوە. کۆدی سندووقی قفڵەکە چی بوو؟", answer: "lockbox", wrongs: ["key", "safe", "door"] },
    ],
    conversations: [
      { situation: "نامە ناردن بۆ خاوەن ماڵی کرێی گەشتیاری", theyAsk: "Hi! You'll be arriving today. Let me know if you need anything.", correct: "Hi! I just arrived. The lockbox code isn't working. Could you resend the self check-in instructions?", wrong1: "Door is closed. I need code.", wrong2: "How I open the box?", wrong3: "I am here. Box is broken.", explanation: "'Self check-in' و 'Lockbox' زاراوەی تایبەتی خزمەتگوزارییەکانی وەک Airbnbـن" },
    ],
  },

  // Lesson 5: Medical Emergencies Abroad
  {
    topic: "Medical Emergencies", topicKu: "باری لەناکاوی پزیشکی لە دەرەوە",
    words: [
      { english: "I need an ambulance",  kurdish: "پێویستم بە ئەمبولانسە (ئۆتۆمبێلی فریاکەوتن)" },
      { english: "Travel insurance",     kurdish: "دڵنیایی گەشتکردن (بۆ نەخۆشی)" },
      { english: "Prescription medication", kurdish: "دەرمانی ڕەچەتە (بەپێی نووسراوی پزیشک)" },
      { english: "Allergic reaction",    kurdish: "کاردانەوەی هەستیاری (حەساسیەت)" },
      { english: "Food poisoning",       kurdish: "ژەهراویبوونی خۆراک" },
    ],
    voices: [
      { prompt: "داوای یارمەتی خێرا", target: "Please call an ambulance, it's an emergency!", targetKurdish: "تکایە تەلەفۆن بۆ ئەمبولانس بکەن، ئەمە حاڵەتێکی لەناکاوە!" },
      { prompt: "باسکردنی کێشەی تەندروستی", target: "I think I have severe food poisoning.", targetKurdish: "پێم وایە ژەهراویبوونی خۆراکیی زۆر سەختم هەیە." },
    ],
    sentences: [
      { english: ["Does", "your", "travel", "insurance", "cover", "hospital", "visits"], kurdish: "ئایا دڵنیایی گەشتەکەت تێچووی نەخۆشخانە دەگرێتەوە؟" },
      { english: ["I", "am", "having", "a", "bad", "allergic", "reaction"], kurdish: "کاردانەوەیەکی هەستیاری (حەساسیەت)ی خراپم هەیە" },
    ],
    fillBlanks: [
      { parts: ["You can't buy these pills here without a", "."], hint: "ناتوانیت ئەم حەبانە لێرە بکڕیت بەبێ ڕەچەتە (نووسراوی پزیشک).", answer: "prescription", wrongs: ["doctor", "paper", "note"] },
      { parts: ["Make sure to buy", "insurance before you fly."], hint: "دڵنیابەرەوە لە کڕینی دڵنیایی گەشت پێش ئەوەی گەشت بکەیت.", answer: "travel", wrongs: ["flight", "ticket", "health"] },
    ],
    conversations: [
      { situation: "لە دەرمانخانەیەک لە دەرەوەی وڵات", theyAsk: "Are you okay? Do you need a doctor?", correct: "I think I'm having an allergic reaction to something I ate. Do you have any medicine, or do I need a prescription?", wrong1: "I sick from food. Give pill.", wrong2: "My body red. Medicine please.", wrong3: "I have allergy. I need drugs.", explanation: "لە دەرەوەی وڵات جیاوازی زۆر هەیە لە نێوان دەرمانی ئاسایی و دەرمانی 'prescription' (کە تەنها بە وەرەقەی دکتۆر دەدرێت)" },
    ],
  },

  // Lesson 6: Haggling & Buying Souvenirs
  {
    topic: "Haggling (Bargaining)", topicKu: "مامەڵەکردن (کەمکردنەوەی نرخ)",
    words: [
      { english: "Can you lower the price", kurdish: "دەتوانیت نرخەکە دابەزێنیت؟" },
      { english: "That's a bit steep",   kurdish: "ئەوە کەمێک گرانە (زۆرە)" },
      { english: "What's your best price", kurdish: "کۆتا نرخت چەندە؟ (باشترین نرخت)" },
      { english: "I'll give you",        kurdish: "ئەوەندەت دەدەمێ..." },
      { english: "Rip-off",              kurdish: "فێڵلێکردن (فرۆشتن بە نرخی زۆر بەرز)" },
    ],
    voices: [
      { prompt: "داوای دابەزاندنی نرخ", target: "That's a bit steep. Can you lower the price?", targetKurdish: "ئەوە کەمێک گرانە. دەتوانیت نرخەکە دابەزێنیت؟" },
      { prompt: "پرسیار لە نرخی کۆتایی", target: "If I buy three, what's your best price?", targetKurdish: "ئەگەر سیانیان لێ بکڕم، کۆتا نرخت چەندە؟" },
    ],
    sentences: [
      { english: ["Don't", "buy", "it", "there", "it", "is", "a", "rip-off"], kurdish: "لەوێ مەیکڕە، ئەوە فێڵلێکردنە (زۆر گرانە)" },
      { english: ["I'll", "give", "you", "twenty", "dollars", "for", "it"], kurdish: "بیست دۆلارت پێ دەدەم بۆ ئەوە" },
    ],
    fillBlanks: [
      { parts: ["Fifty dollars? That's a bit", "for a small shirt."], hint: "پەنجا دۆلار؟ ئەوە کەمێک گرانە بۆ کراسێکی بچووک.", answer: "steep", wrongs: ["high", "much", "big"] },
      { parts: ["$100 is a total", ". I saw it for $20 somewhere else."], hint: "١٠٠ دۆلار بەتەواوی فێڵلێکردنە (گرانە). لە شوێنێکی تر بە ٢٠ دۆلار بینیم.", answer: "rip-off", wrongs: ["scam", "bad", "fake"] },
    ],
    conversations: [
      { situation: "لە بازاڕێکی میللیدایت و دەتەوێت دیارییەک بکڕیت", theyAsk: "For you my friend, a special price: $50.", correct: "That's a bit steep for a small souvenir. What's your best price? I'll give you $30.", wrong1: "Too much money. I give 30.", wrong2: "Make it cheap. 50 is bad.", wrong3: "I want 30. 50 is rip-off.", explanation: "'That's a bit steep' و 'What's your best price' شێوازێکی زۆر باو و ڕێزدارانەن بۆ مامەڵەکردن و کەمکردنەوەی نرخ" },
    ],
  },

  // Lesson 7: Taking a Guided Tour
  {
    topic: "Guided Tours", topicKu: "گەشتی ڕێبەریکراو (لەگەڵ ڕێبەر/گاید)",
    words: [
      { english: "Tour guide",           kurdish: "ڕێبەری گەشتیاری" },
      { english: "Meeting point",        kurdish: "خاڵی کۆبوونەوە (شوێنی یەکتربینین)" },
      { english: "Free time",            kurdish: "کاتی سەربەست (بۆ گەڕان بەتەنیا)" },
      { english: "Admission fee",        kurdish: "کرێی چوونەژوورەوە" },
      { english: "Skip the line",        kurdish: "پەڕینەوە لە ڕیزەکە (بێ سەرە گرتن)" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە ڕێبەرەکە", target: "Excuse me, where is the meeting point after our free time?", targetKurdish: "ببوورە، خاڵی کۆبوونەوەکە لە کوێیە دوای کاتە سەربەستەکەمان؟" },
      { prompt: "کرێی شوێنەکان", target: "Does the ticket include the admission fee for the museum?", targetKurdish: "ئایا بلیتەکە کرێی چوونەژوورەوەی مۆزەخانەکەش لەخۆ دەگرێت؟" },
    ],
    sentences: [
      { english: ["We", "bought", "skip", "the", "line", "tickets", "online"], kurdish: "ئێمە بلیتی (بێ سەرە گرتن)مان بە ئۆنلاین کڕی" },
      { english: ["Our", "tour", "guide", "was", "very", "knowledgeable"], kurdish: "ڕێبەرە گەشتیارییەکەمان زۆر زانیاری هەبوو" },
    ],
    fillBlanks: [
      { parts: ["We will have 30 minutes of", "time to take photos."], hint: "ئێمە ٣٠ خولەک کاتی سەربەستمان دەبێت بۆ وێنەگرتن.", answer: "free", wrongs: ["empty", "good", "relax"] },
      { parts: ["The", "point for the bus is next to the fountain."], hint: "خاڵی کۆبوونەوە بۆ پاسەکە لە تەنیشت نافوورەکەیە.", answer: "meeting", wrongs: ["start", "see", "wait"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ ڕێبەری گەشتەکەت", theyAsk: "We will go inside the castle now. Does everyone have their tickets?", correct: "I have my ticket, but I wanted to ask: is the admission fee included, and do we skip the line?", wrong1: "Do we wait in line? Is money paid?", wrong2: "I have ticket. I go in now?", wrong3: "Ticket here. No line?", explanation: "'Skip the line' خزمەتگوزارییەکی زۆر باوە لە ئەوروپا کە بە پارەی زیاتر سەرە نادەگریت" },
    ],
  },

  // Lesson 8: Eating at Street Food Stalls
  {
    topic: "Street Food", topicKu: "خواردنی سەر شەقام (لە وڵاتانی تر)",
    words: [
      { english: "Is this spicy",        kurdish: "ئایا ئەمە توونە؟" },
      { english: "What is the local specialty", kurdish: "تایبەتمەندی ناوچەکە چییە؟ (بەناوبانگترین خواردنی لۆکاڵی)" },
      { english: "Food stall",           kurdish: "عەرەبانەی خواردن / دوکانی بچووک لە شەقام" },
      { english: "To go / Takeaway",     kurdish: "بۆ بردنەوە (نەخواردن لەوێ)" },
      { english: "Vegetarian options",   kurdish: "بژاردەی ڕووەکی" },
    ],
    voices: [
      { prompt: "پرسیار لە خواردنی ناوچەکە", target: "What is the local specialty here?", targetKurdish: "تایبەتمەندی (بەناوبانگترین خواردنی) ناوچەکە چییە لێرە؟" },
      { prompt: "داوای بردنەوە", target: "I'll have two of these, to go please.", targetKurdish: "دوو دانە لەمانەم دەوێت، بۆ بردنەوە تکایە." },
    ],
    sentences: [
      { english: ["Do", "you", "have", "any", "vegetarian", "options", "available"], kurdish: "ئایا هیچ بژاردەیەکی ڕووەکیتان بەردەستە؟" },
      { english: ["That", "food", "stall", "looks", "very", "popular", "with", "locals"], kurdish: "ئەو عەرەبانەی خواردنە وا دیارە زۆر لای خەڵکی ناوچەکە خۆشەویستە" },
    ],
    fillBlanks: [
      { parts: ["Can you make it not too", "? I can't handle chili."], hint: "دەتوانیت وا بکەیت زۆر توون نەبێت؟ بەرگەی بیبەر ناگرم.", answer: "spicy", wrongs: ["hot", "red", "strong"] },
      { parts: ["I want this sandwich", "go, please."], hint: "ئەم لەفەیەم بۆ بردنەوە دەوێت تکایە.", answer: "to", wrongs: ["for", "away", "take"] },
    ],
    conversations: [
      { situation: "لەلای عەرەبانەیەکی خواردن لە بانکوک یان مەکسیک", theyAsk: "Hi! What can I get for you today?", correct: "I'd like to try the local specialty, but is it spicy? If so, can you make it mild? And I'll take it to go.", wrong1: "Give me good food. No chili.", wrong2: "I want best food. Make it takeaway.", wrong3: "What is local food? I take away.", explanation: "لە ئەمریکا دەڵێن 'to go'، لە بەریتانیا دەڵێن 'takeaway' بۆ خواردنێک کە لەگەڵ خۆت دەیبەیت" },
    ],
  },

  // Lesson 9: Meeting Other Travelers
  {
    topic: "Meeting Other Travelers", topicKu: "یەکترناسینی گەشتیارانی تر (لە هۆستێل و گەشتەکان)",
    words: [
      { english: "Where are you heading next", kurdish: "دواتر بەرەو کوێ دەڕۆیت؟ (وێستگەی داهاتووت کوێیە)" },
      { english: "How long have you been traveling", kurdish: "چەندە گەشت دەکەیت؟ (ماوەی چەندە لە گەشتدایت)" },
      { english: "Any recommendations",  kurdish: "هیچ پێشنیارێکت هەیە؟ (بۆ شوێن و خواردن)" },
      { english: "Solo traveler",        kurdish: "گەشتیاری تاقانە (کەسێک بەتەنیا گەشت دەکات)" },
      { english: "Keep in touch",        kurdish: "لە پەیوەندیدا دەبین (مانەوەی پەیوەندی)" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە بەرنامەی داهاتوو", target: "Where are you heading next on your trip?", targetKurdish: "دواتر بەرەو کوێ دەڕۆیت لە گەشتەکەتدا؟" },
      { prompt: "خواحافیزی کردن لە هاوڕێی نوێ", target: "It was great meeting you. Let's keep in touch!", targetKurdish: "بینینت زۆر خۆش بوو. با لە پەیوەندیدا بین!" },
    ],
    sentences: [
      { english: ["Do", "you", "have", "any", "recommendations", "for", "good", "restaurants"], kurdish: "هیچ پێشنیارێکت هەیە بۆ چێشتخانەی باش؟" },
      { english: ["I", "am", "a", "solo", "traveler", "exploring", "Europe"], kurdish: "من گەشتیارێکی تاقانەم بە ئەوروپادا دەگەڕێم" },
    ],
    fillBlanks: [
      { parts: ["Where are you", "next after you leave here?"], hint: "دواتر بەرەو کوێ دەڕۆیت دوای ئەوەی لێرە دەڕۆیت؟", answer: "heading", wrongs: ["going", "travel", "visiting"] },
      { parts: ["I hope we cross paths again. Let's keep in", "."], hint: "هیوادارم دووبارە یەکتر ببینینەوە. با لە پەیوەندیدا بین.", answer: "touch", wrongs: ["contact", "talk", "message"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ گەشتیارێکی تر لە هۆتێلەکە", theyAsk: "I just got here yesterday. I've been traveling for a month.", correct: "Wow, a whole month! I'm a solo traveler too. Where are you heading next? Do you have any recommendations for this city?", wrong1: "You travel long. Where you go?", wrong2: "I am alone. Tell me good places.", wrong3: "Where to next? Give me tips.", explanation: "'Where are you heading next' باوترین پرسیاری نێوان گەشتیارانە" },
    ],
  },

];

export default normalUnit05;
