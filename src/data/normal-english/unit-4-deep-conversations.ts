import { UnitBank } from "../types";

// ── Unit 3: Advanced Conversations & Discussions — 10 unique lessons ──────────
// High-level English for deeper conversations, abstract ideas, and nuanced expressions.

const normalUnit03: UnitBank = [

  // Lesson 0: Persuading and Convincing
  {
    topic: "Persuading Others", topicKu: "قایڵکردنی کەسانی تر",
    words: [
      { english: "Hear me out",          kurdish: "گوێم لێ بگرە (تا کۆتایی قسەکانم)" },
      { english: "Look at it this way",  kurdish: "بەو شێوەیە سەیری بکە کە" },
      { english: "I'm convinced that",   kurdish: "دڵنیام / قایڵم بەوەی کە" },
      { english: "Doesn't it make sense", kurdish: "ئایا لۆژیکی نییە کە...؟" },
      { english: "Take my word for it",  kurdish: "بڕوام پێ بکە (قسەم لێ وەربگرە)" },
    ],
    voices: [
      { prompt: "داوای گوێگرتن بۆ ڕوونکردنەوە", target: "Just hear me out before you make a decision.", targetKurdish: "تەنها گوێم لێ بگرە پێش ئەوەی بڕیار بدەیت." },
      { prompt: "گۆڕینی تێڕوانین", target: "Look at it this way, we're actually saving money.", targetKurdish: "بەو شێوەیە سەیری بکە کە لە ڕاستیدا ئێمە پارە دەگەڕێنینەوە." },
    ],
    sentences: [
      { english: ["I'm", "convinced", "that", "this", "is", "the", "right", "path"], kurdish: "دڵنیام لەوەی کە ئەمە ڕێگە دروستەکەیە" },
      { english: ["Doesn't", "it", "make", "sense", "to", "wait", "a", "bit"], kurdish: "ئایا لۆژیکیتر نییە کە کەمێک چاوەڕێ بکەین؟" },
    ],
    fillBlanks: [
      { parts: ["Take my", "for it, this is the best option."], hint: "قسەی من وەرگرە (بڕوام پێ بکە)، ئەمە باشترین هەڵبژاردەیە.", answer: "word", wrongs: ["voice", "talk", "say"] },
      { parts: ["Hear me", "before you say no."], hint: "گوێم لێ بگرە پێش ئەوەی بڵێیت نەخێر.", answer: "out", wrongs: ["up", "in", "to"] },
    ],
    conversations: [
      { situation: "دەتەوێت هاوکارێکت قایڵ بکەیت بە بیرۆکەیەک", theyAsk: "I don't think we should change the design right now.", correct: "Just hear me out. Look at it this way: the new design will attract more young users. Doesn't it make sense to try it?", wrong1: "You are wrong. New design is better.", wrong2: "Listen to me, I know the best design.", wrong3: "Why you say no? Design is good.", explanation: "'Hear me out' و 'Look at it this way' ڕێگەیەکی زۆر زیرەکانەن بۆ نەرمکردنی بەرامبەر پێش ئەوەی قایڵی بکەیت" },
    ],
  },

  // Lesson 1: Complaining Constructively
  {
    topic: "Constructive Complaints", topicKu: "سکاڵاکردن بە شێوازێکی بنیاتنەر",
    words: [
      { english: "I'm not entirely satisfied", kurdish: "بەتەواوی ڕازی نیم" },
      { english: "There seems to be a mistake", kurdish: "وادیارە هەڵەیەک ڕوویداوە" },
      { english: "It falls short of",    kurdish: "لە ئاستی پێویستدا نییە بۆ..." },
      { english: "I expected better",    kurdish: "چاوەڕوانی شتی باشترم دەکرد" },
      { english: "Look into this matter", kurdish: "بەدواداچوون بۆ ئەم بابەتە" },
    ],
    voices: [
      { prompt: "دەربڕینی ناڕەزایی نەرم", target: "I'm not entirely satisfied with the quality of this product.", targetKurdish: "بەتەواوی ڕازی نیم لە کوالێتی ئەم بەرهەمە." },
      { prompt: "ئاماژەدان بە هەڵەیەک", target: "There seems to be a mistake on my bill.", targetKurdish: "وادیارە هەڵەیەک لە پسووڵەی پارەکەمدا ڕوویداوە." },
    ],
    sentences: [
      { english: ["Could", "you", "please", "look", "into", "this", "matter"], kurdish: "تکایە دەتوانیت بەدواداچوون بۆ ئەم بابەتە بکەیت؟" },
      { english: ["The", "service", "falls", "short", "of", "my", "expectations"], kurdish: "خزمەتگوزارییەکە لە ئاست چاوەڕوانییەکانی مندا نییە" },
    ],
    fillBlanks: [
      { parts: ["I'm not entirely", "with how this was handled."], hint: "بەتەواوی ڕازی نیم بە چۆنیەتی مامەڵەکردن لەگەڵ ئەمەدا.", answer: "satisfied", wrongs: ["happy", "good", "pleased"] },
      { parts: ["There", "to be a mistake with my order."], hint: "وادیارە هەڵەیەک لە داواکارییەکەمدا ڕوویداوە.", answer: "seems", wrongs: ["looks", "feels", "shows"] },
    ],
    conversations: [
      { situation: "پەیوەندی بە خزمەتگوزاری کڕیارانەوە دەکەیت", theyAsk: "How can I assist you with your recent purchase?", correct: "Hi, I'm calling because I'm not entirely satisfied. There seems to be a mistake with the delivery, and it falls short of what I expected.", wrong1: "Your delivery is bad. I hate it.", wrong2: "You made a big mistake. Fix it.", wrong3: "I want my money. Delivery is wrong.", explanation: "'I'm not entirely satisfied' و 'There seems to be a mistake' شێوازی سکاڵاکردنی کەسانی پێگەیشتوو و پیشەییە" },
    ],
  },

  // Lesson 2: Giving Advice in Difficult Situations
  {
    topic: "Delicate Advice", topicKu: "ئامۆژگاری هەستیار",
    words: [
      { english: "Have you considered",  kurdish: "بیرت لەوە کردووەتەوە کە...؟" },
      { english: "It might be wise to",  kurdish: "لەوانەیە کارێکی ژیرانە بێت کە" },
      { english: "I wouldn't recommend", kurdish: "پێشنیاری ئەوە ناکەم کە" },
      { english: "Sleep on it",          kurdish: "بیرکردنەوەیەکی قووڵ (تا بەیانی بڕیار نەدان)" },
      { english: "Weigh your options",   kurdish: "هەڵسەنگاندن بۆ بژاردەکانت" },
    ],
    voices: [
      { prompt: "پێشنیارکردنی بیرکردنەوە", target: "Don't rush. It might be wise to sleep on it first.", targetKurdish: "پەلە مەکە. لەوانەیە کارێکی ژیرانە بێت کە سەرەتا (تا بەیانی) بیری لێ بکەیتەوە." },
      { prompt: "ئامۆژگاری بۆ هەڵسەنگاندن", target: "You should weigh your options before deciding.", targetKurdish: "دەبێت هەڵسەنگاندن بۆ بژاردەکانت بکەیت پێش بڕیاردان." },
    ],
    sentences: [
      { english: ["Have", "you", "considered", "talking", "to", "him", "directly"], kurdish: "بیرت لەوە کردووەتەوە ڕاستەوخۆ قسەی لەگەڵ بکەیت؟" },
      { english: ["I", "wouldn't", "recommend", "quitting", "just", "yet"], kurdish: "پێشنیاری ئەوە ناکەم کە هەر ئێستا واز بهێنیت" },
    ],
    fillBlanks: [
      { parts: ["Take your time and", "your options carefully."], hint: "کاتی خۆت وەربگرە و بە وریاییەوە بژاردەکانت هەڵسەنگێنە.", answer: "weigh", wrongs: ["think", "look", "see"] },
      { parts: ["It's a big choice, you should", "on it."], hint: "بڕیارێکی گەورەیە، دەبێت (تا بەیانی) بیری لێ بکەیتەوە.", answer: "sleep", wrongs: ["wait", "rest", "stop"] },
    ],
    conversations: [
      { situation: "هاوڕێیەکەت دەیەوێت بەپەلە واز لە کارەکەی بهێنێت", theyAsk: "I'm so angry at my boss. I'm going to quit tomorrow!", correct: "I understand you're upset, but I wouldn't recommend quitting just yet. It might be wise to sleep on it and weigh your options first.", wrong1: "Don't quit, it is bad.", wrong2: "You are wrong to quit.", wrong3: "I tell you not to quit.", explanation: "'sleep on it' ئیدیۆمێکی زۆر بەکارهاتووە بە واتای (پەلە مەکە و کاتی زیاتر بدە بە خۆت بۆ بیرکردنەوە لە بڕیارێک)" },
    ],
  },

  // Lesson 3: Hypothetical Situations
  {
    topic: "Hypothetical Situations", topicKu: "بارودۆخە گریمانەییەکان",
    words: [
      { english: "If I were in your shoes", kurdish: "ئەگەر لە جێگەی تۆ بوومایە" },
      { english: "What if we",           kurdish: "چی دەبێت ئەگەر ئێمە" },
      { english: "Suppose that",         kurdish: "گریمانەی ئەوە بکە کە" },
      { english: "In a perfect world",   kurdish: "لە جیهانێکی بێگەرددا (ئەگەر هەموو شتێک ڕێک بووایە)" },
      { english: "Worst-case scenario",  kurdish: "خراپترین ئەگەری پێشبینیکراو" },
    ],
    voices: [
      { prompt: "خۆخستنە جێگەی کەسێک", target: "If I were in your shoes, I would ask for a raise.", targetKurdish: "ئەگەر لە جێگەی تۆ بوومایە، داوای زیادکردنی مووچەم دەکرد." },
      { prompt: "باسکردنی خراپترین ئەگەر", target: "What is the worst-case scenario if we fail?", targetKurdish: "خراپترین ئەگەری پێشبینیکراو چییە ئەگەر سەرنەکەوین؟" },
    ],
    sentences: [
      { english: ["What", "if", "we", "tried", "a", "different", "approach"], kurdish: "چی دەبێت ئەگەر ڕێگەیەکی جیاواز تاقی بکەینەوە؟" },
      { english: ["Suppose", "that", "they", "reject", "our", "offer"], kurdish: "گریمانەی ئەوە بکە کە ئەوان پێشنیارەکەمان ڕەتدەکەنەوە" },
    ],
    fillBlanks: [
      { parts: ["If I were in your", ", I wouldn't worry so much."], hint: "ئەگەر لە جێگەی تۆ بوومایە، ئەوەندە خەمی لێ نەدەخوارد.", answer: "shoes", wrongs: ["place", "position", "mind"] },
      { parts: ["In a", "world, this project would be done by now."], hint: "لە جیهانێکی بێگەرددا، ئەم پڕۆژەیە تا ئێستا تەواو دەبوو.", answer: "perfect", wrongs: ["good", "great", "best"] },
    ],
    conversations: [
      { situation: "تیمەکەت پێشبینی کێشەیەک دەکات لە پڕۆژەیەکدا", theyAsk: "I'm worried the client might not like the proposal.", correct: "Suppose that happens. What's the worst-case scenario? We just revise it. If I were in your shoes, I'd stay positive.", wrong1: "Don't think bad.", wrong2: "If they don't like, we cry.", wrong3: "Client is always right.", explanation: "'If I were in your shoes' زۆر باوتر و جوانترە لە وتنی 'If I were you'" },
    ],
  },

  // Lesson 4: Expressing Probability
  {
    topic: "Probability & Certainty", topicKu: "ئەگەرەکان و دڵنیایی",
    words: [
      { english: "It's highly likely",   kurdish: "ئەگەرێکی زۆری هەیە" },
      { english: "There's no doubt that", kurdish: "هیچ گومانێک لەوەدا نییە کە" },
      { english: "Chances are",          kurdish: "ئەگەرەکان وا دەردەخەن / پێدەچێت" },
      { english: "I bet that",           kurdish: "گرەو دەکەم کە / دڵنیام کە" },
      { english: "It's a long shot",     kurdish: "ئەگەرێکی زۆر لاوازە (قورسە ڕووبدات)" },
    ],
    voices: [
      { prompt: "دەربڕینی دڵنیایی", target: "There's no doubt that she will get the promotion.", targetKurdish: "هیچ گومانێک لەوەدا نییە کە ئەو پلەبەرزکردنەوەکە وەردەگرێت." },
      { prompt: "ئاماژەدان بە ئەگەرێکی لاواز", target: "Winning the lottery is a long shot.", targetKurdish: "بردنەوەی یانسیب ئەگەرێکی زۆر لاوازە." },
    ],
    sentences: [
      { english: ["Chances", "are", "it", "will", "rain", "tomorrow"], kurdish: "پێدەچێت بەیانی باران ببارێت" },
      { english: ["It's", "highly", "likely", "that", "we", "will", "win"], kurdish: "ئەگەرێکی زۆری هەیە کە ئێمە ببەینەوە" },
    ],
    fillBlanks: [
      { parts: ["It's a long", ", but we might still win the game."], hint: "ئەگەرێکی زۆر لاوازە، بەڵام لەوانەیە هێشتا یارییەکە ببەینەوە.", answer: "shot", wrongs: ["chance", "way", "run"] },
      { parts: ["There's no", "that he is the best player."], hint: "هیچ گومانێک لەوەدا نییە کە ئەو باشترین یاریزانە.", answer: "doubt", wrongs: ["question", "thinking", "sure"] },
    ],
    conversations: [
      { situation: "پێشبینیکردنی ئەنجامی چاوپێکەوتنێکی کار", theyAsk: "Do you think Sarah will get the job?", correct: "There's no doubt that she's qualified, but getting it is a long shot since there are so many applicants. However, chances are she'll at least get a second interview.", wrong1: "She will get job.", wrong2: "I think maybe she wins.", wrong3: "Job is hard.", explanation: "'It's a long shot' دەستەواژەیەکی نایابە بۆ شتێک کە ئەگەری ڕوودانی کەمە بەڵام مەحاڵ نییە" },
    ],
  },

  // Lesson 5: Changing the Subject
  {
    topic: "Changing the Subject", topicKu: "گۆڕینی بابەتی گفتوگۆ",
    words: [
      { english: "Speaking of which",    kurdish: "بە قسە بێت (مادام باسی ئەوەت کرد)" },
      { english: "That reminds me",      kurdish: "ئەوەی بیرخستمەوە" },
      { english: "On a different note",  kurdish: "لە بابەتێکی جیاوازدا / با بێینە سەر شتێکی تر" },
      { english: "By the way",           kurdish: "لەبیرم چوو بڵێم / هەر لە ناو قسەکاندا" },
      { english: "Going off on a tangent", kurdish: "لادان لە بابەتە سەرەکییەکە" },
    ],
    voices: [
      { prompt: "بیرکەوتنەوەی شتێک", target: "That reminds me, I need to call my mother.", targetKurdish: "ئەوەی بیرخستمەوە، پێویستە تەلەفۆن بۆ دایکم بکەم." },
      { prompt: "گۆڕینی بابەتەکە بەتەواوی", target: "On a different note, how was your vacation?", targetKurdish: "با بێینە سەر شتێکی تر، پشووەکەت چۆن بوو؟" },
    ],
    sentences: [
      { english: ["Speaking", "of", "which", "did", "you", "see", "the", "news"], kurdish: "بە قسە بێت، هەواڵەکانت بینی؟" },
      { english: ["Sorry", "for", "going", "off", "on", "a", "tangent"], kurdish: "ببوورە کە لە بابەتەکە لامدا" },
    ],
    fillBlanks: [
      { parts: ["That", "me, we have a meeting at 2 PM."], hint: "ئەوەی بیرخستمەوە، کاتژمێر ٢ کۆبوونەوەمان هەیە.", answer: "reminds", wrongs: ["makes", "shows", "tells"] },
      { parts: ["On a different", ", what are we having for dinner?"], hint: "لە بابەتێکی جیاوازدا، چی دەخۆین بۆ نانی ئێوارە؟", answer: "note", wrongs: ["topic", "subject", "thing"] },
    ],
    conversations: [
      { situation: "لە ناوەڕاستی گفتوگۆیەکدا دەتەوێت باسی شتێکی تر بکەیت کە بیرت کەوتووەتەوە", theyAsk: "Yeah, the traffic today was terrible near the new restaurant.", correct: "Speaking of which! That reminds me, I wanted to ask if you want to go to that restaurant this Friday?", wrong1: "I want to go to restaurant Friday.", wrong2: "Traffic is bad. Friday restaurant?", wrong3: "I change subject. Let's go Friday.", explanation: "'Speaking of which' یان 'That reminds me' باشترین پردن بۆ پەڕینەوە لە نێوان بابەتەکاندا بەبێ پچڕاندنی گفتوگۆکە" },
    ],
  },

  // Lesson 6: Justifying & Excuses
  {
    topic: "Making Excuses", topicKu: "هێنانەوەی پاساو",
    words: [
      { english: "The reason being",     kurdish: "هۆکارەکەی ئەوەیە کە" },
      { english: "Due to unforeseen circumstances", kurdish: "بەهۆی بارودۆخێکی پێشبینینەکراوەوە" },
      { english: "It was out of my hands", kurdish: "لە دەسەڵاتی مندا نەبوو" },
      { english: "I didn't mean to",     kurdish: "مەبەستم نەبوو کە..." },
      { english: "Let me explain",       kurdish: "با ڕوونی بکەمەوە" },
    ],
    voices: [
      { prompt: "لابردنی تاوان لەسەر خۆت", target: "I apologize, but the delay was completely out of my hands.", targetKurdish: "داوای لێبوردن دەکەم، بەڵام دواکەوتنەکە بەتەواوی لە دەسەڵاتی مندا نەبوو." },
      { prompt: "پاساوی فەرمی", target: "Due to unforeseen circumstances, we must cancel the event.", targetKurdish: "بەهۆی بارودۆخێکی پێشبینینەکراوەوە، دەبێت بۆنەکە هەڵبوەشێنینەوە." },
    ],
    sentences: [
      { english: ["I", "didn't", "mean", "to", "offend", "you", "let", "me", "explain"], kurdish: "مەبەستم نەبوو دڵت بشکێنم، با ڕوونی بکەمەوە" },
      { english: ["I", "was", "late", "the", "reason", "being", "heavy", "traffic"], kurdish: "دواکەوتم، هۆکارەکەی قەرەباڵغییەکی زۆر بوو" },
    ],
    fillBlanks: [
      { parts: ["It wasn't my fault, it was", "of my hands."], hint: "هەڵەی من نەبوو، لە دەسەڵاتی مندا نەبوو.", answer: "out", wrongs: ["away", "far", "gone"] },
      { parts: ["Due to", "circumstances, the flight is delayed."], hint: "بەهۆی بارودۆخێکی پێشبینینەکراوەوە، گەشتەکە دواکەوتووە.", answer: "unforeseen", wrongs: ["bad", "sudden", "unknown"] },
    ],
    conversations: [
      { situation: "پڕۆژەیەک دواکەوتووە بەهۆی کێشەی کۆمپیوتەرەوە", theyAsk: "Why wasn't the report submitted on time yesterday?", correct: "Let me explain. The server crashed entirely. I wanted to finish it, but it was completely out of my hands.", wrong1: "Computer bad, not me.", wrong2: "I didn't do it because of server.", wrong3: "Not my fault, server stopped.", explanation: "'Out of my hands' ئیدیۆمێکی زۆر بەهێزە بۆ وتنی ئەوەی کە دەسەڵاتت بەسەر کێشەکەدا نەبووە" },
    ],
  },

  // Lesson 7: Warning and Instructing
  {
    topic: "Warning & Instructing", topicKu: "ئاگادارکردنەوە و ڕێنماییدان",
    words: [
      { english: "Make sure you",        kurdish: "دڵنیابەرەوە لەوەی کە..." },
      { english: "Watch out for",        kurdish: "ئاگاداری ... بە" },
      { english: "Bear in mind",         kurdish: "لەبیری مەکە / ڕەچاوی ئەوە بکە" },
      { english: "Take precautions",     kurdish: "ڕێکاری خۆپارێزی بگرەبەر" },
      { english: "Better safe than sorry", kurdish: "خۆپاراستن باشترە لە پەشیمانی" },
    ],
    voices: [
      { prompt: "ئاگادارکردنەوە لە مەترسی", target: "Watch out for the wet floor. Better safe than sorry.", targetKurdish: "ئاگاداری زەوییە تەڕەکە بە. خۆپاراستن باشترە لە پەشیمانی." },
      { prompt: "پێدانی ڕێنمایی ورد", target: "Make sure you lock the door and bear in mind the alarm code.", targetKurdish: "دڵنیابەرەوە لەوەی دەرگاکە قفڵ بکەیت و کۆدی زەنگەکەش لەبیر مەکە." },
    ],
    sentences: [
      { english: ["You", "should", "always", "take", "precautions", "when", "traveling"], kurdish: "دەبێت هەمیشە ڕێکاری خۆپارێزی بگریتەبەر کاتێک گەشت دەکەیت" },
      { english: ["Bear", "in", "mind", "that", "the", "deadline", "is", "strict"], kurdish: "لەیادت بێت کە وادەی کۆتایی توندە (ناگۆڕدرێت)" },
    ],
    fillBlanks: [
      { parts: ["Bear in", "that things might change tomorrow."], hint: "لەیادت بێت (ڕەچاوی ئەوە بکە) کە لەوانەیە سبەی شتەکان بگۆڕێن.", answer: "mind", wrongs: ["head", "brain", "thought"] },
      { parts: ["Bring an umbrella. Better", "than sorry."], hint: "چەترێک بهێنە. خۆپاراستن باشترە لە پەشیمانی.", answer: "safe", wrongs: ["good", "dry", "careful"] },
    ],
    conversations: [
      { situation: "ڕێنماییدانی کارمەندێکی نوێ سەبارەت بە سەلامەتی", theyAsk: "Is there anything else I need to know before using this machine?", correct: "Yes, watch out for the sharp edges. Make sure you wear gloves—better safe than sorry.", wrong1: "Machine is dangerous.", wrong2: "Wear gloves or you bleed.", wrong3: "Take care of edges.", explanation: "'Better safe than sorry' پەندێکی زۆر بەناوبانگ و باوی ئینگلیزییە بۆ هاندان لەسەر وریایی" },
    ],
  },

  // Lesson 8: Discussing News & Current Events
  {
    topic: "Current Events", topicKu: "ڕووداوەکانی ڕۆژ و هەواڵ",
    words: [
      { english: "Did you hear about",   kurdish: "ئایا بیستت دەربارەی...؟" },
      { english: "It's all over the news", kurdish: "لە هەموو هەواڵەکاندا بڵاوبووەتەوە" },
      { english: "According to reports", kurdish: "بەپێی ڕاپۆرتەکان" },
      { english: "It's a controversial topic", kurdish: "بابەتێکی مشتومڕ لەسەرە" },
      { english: "Keep up with the news", kurdish: "ئاگاداربوون لە دواین هەواڵەکان" },
    ],
    voices: [
      { prompt: "کردنەوەی باسی هەواڵێک", target: "Did you hear about the election? It's all over the news.", targetKurdish: "ئایا گوێت لە هەواڵی هەڵبژاردنەکە بوو؟ لە هەموو هەواڵەکاندا بڵاوبووەتەوە." },
      { prompt: "گواستنەوەی زانیاری", target: "According to reports, the economy is improving.", targetKurdish: "بەپێی ڕاپۆرتەکان، ئابووری ڕوو لە باشبوونە." },
    ],
    sentences: [
      { english: ["I", "try", "to", "keep", "up", "with", "the", "local", "news"], kurdish: "هەوڵدەدەم ئاگاداری دواین هەواڵە ناوخۆییەکان بم" },
      { english: ["That", "is", "a", "very", "controversial", "topic", "lately"], kurdish: "لەم دواییانەدا ئەوە بابەتێکی پڕ مشتومڕ بووە" },
    ],
    fillBlanks: [
      { parts: ["It's hard to keep", "with all the tech news."], hint: "قورسە ئاگاداری (بەدواداچوون بۆ) هەموو هەواڵەکانی تەکنەلۆژیا بکەیت.", answer: "up", wrongs: ["on", "in", "down"] },
      { parts: ["According", "recent reports, housing prices dropped."], hint: "بەپێی ڕاپۆرتەکانی ئەم دواییە، نرخی خانوو دابەزیوە.", answer: "to", wrongs: ["by", "with", "from"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ هاوکارێک سەبارەت بە ڕووداوێکی نوێ", theyAsk: "I haven't checked my phone all day. Has anything happened?", correct: "Did you hear about the big merger? It's all over the news! According to reports, it's going to change the whole industry.", wrong1: "Yes, big company buy another.", wrong2: "News say merger is happen.", wrong3: "I saw on TV about company.", explanation: "'It's all over the news' و 'According to reports' دەستەواژەی زۆر باون بۆ باسکردنی ڕووداوە گەرمەکانی ڕۆژ" },
    ],
  },

  // Lesson 9: Summarizing and Concluding
  {
    topic: "Summarizing", topicKu: "پوختەکردنەوە و کۆتاییهێنان",
    words: [
      { english: "Long story short",     kurdish: "بۆ ئەوەی درێژەی پێ نەدەم (بە کورتی)" },
      { english: "In a nutshell",        kurdish: "بە کورتی و پوختی (لە توێکڵی گوێزێکدا)" },
      { english: "To wrap things up",    kurdish: "بۆ کۆتاییهێنان بە بابەتەکە" },
      { english: "The bottom line is",   kurdish: "خاڵە سەرەکییەکە ئەوەیە کە / کورتەی کەلام" },
      { english: "At the end of the day", kurdish: "لەکۆتاییدا (دەرەنجامی کۆتایی شتەکە)" },
    ],
    voices: [
      { prompt: "پوختەکردنەوەی چیرۆکێک", target: "Long story short, we missed the flight and had to stay another night.", targetKurdish: "بۆ ئەوەی درێژەی پێ نەدەم، گەشتەکەمان لەدەستدا و ناچار بووین شەوێکی تر بمێنینەوە." },
      { prompt: "کۆتاییهێنان بە کۆبوونەوەیەک", target: "To wrap things up, the bottom line is we need more sales.", targetKurdish: "بۆ کۆتاییهێنان، کورتەی کەلام ئەوەیە کە پێویستمان بە فرۆشی زیاترە." },
    ],
    sentences: [
      { english: ["In", "a", "nutshell", "the", "movie", "was", "terrible"], kurdish: "بە کورتی و پوختی، فیلمەکە زۆر خراپ بوو" },
      { english: ["At", "the", "end", "of", "the", "day", "family", "is", "most", "important"], kurdish: "لەکۆتاییدا (لە دەرەنجامدا)، خێزان لە هەموو شتێک گرنگترە" },
    ],
    fillBlanks: [
      { parts: ["In a", ", the new software is faster but harder to use."], hint: "بە کورتی و پوختی، سۆفتوێرە نوێیەکە خێراترە بەڵام بەکارهێنانی قورسترە.", answer: "nutshell", wrongs: ["box", "word", "second"] },
      { parts: ["Let's", "things up so we can all go home."], hint: "با کۆتایی بە بابەتەکان بهێنین بۆ ئەوەی هەموومان بڕۆینەوە ماڵەوە.", answer: "wrap", wrongs: ["close", "finish", "end"] },
    ],
    conversations: [
      { situation: "هاوڕێیەکەت پرسیاری فیلمێکی درێژت لێ دەکات", theyAsk: "I missed the 3-hour documentary. Can you tell me what happened?", correct: "Well, to put it in a nutshell, the planet is warming up fast. The bottom line is we need to act now.", wrong1: "It was about earth getting hot.", wrong2: "Short story: earth is hot.", wrong3: "I tell you short: it's warming.", explanation: "'In a nutshell' و 'The bottom line is' زۆر بەکاردێن بۆ پوختەکردنەوەی زانیاری زۆر بە چەند وشەیەکی کەم" },
    ],
  },

];

export default normalUnit03;
