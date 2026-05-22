import { UnitBank } from "../types";

// ── Unit 2: Work & Professional Life — 10 unique lessons ──────────────────────────
// Formal and polite English for the workplace, interviews, meetings, and business communication.

const normalUnit02: UnitBank = [

  // Lesson 0: Job Interviews
  {
    topic: "Job Interviews", topicKu: "چاوپێکەوتنی کار",
    words: [
      { english: "I have experience in", kurdish: "ئەزموونم هەیە لە..." },
      { english: "My strengths are",     kurdish: "خاڵە بەهێزەکانم بریتین لە..." },
      { english: "I am a quick learner", kurdish: "خێرام لە فێربووندا" },
      { english: "Looking forward to",   kurdish: "بە تامەزرۆم بۆ..." },
      { english: "Valuable asset",       kurdish: "سەرمایەیەکی بەنرخ (کەسێکی بەسوود بۆ کۆمپانیا)" },
    ],
    voices: [
      { prompt: "باسکردنی ئەزموون", target: "I have over five years of experience in marketing.", targetKurdish: "زیاتر لە پێنج ساڵ ئەزموونم لە بەبازاڕکردندا هەیە." },
      { prompt: "کۆتایی چاوپێکەوتن", target: "I am looking forward to hearing from you soon.", targetKurdish: "بە تامەزرۆم بۆ بیستنی هەواڵێک لە ئێوەوە بە زوویی." },
    ],
    sentences: [
      { english: ["I", "believe", "I", "can", "be", "a", "valuable", "asset"], kurdish: "پێم وایە دەتوانم کەسێکی زۆر بەسوود بم بۆ تیمەکە" },
      { english: ["I", "am", "a", "quick", "learner", "and", "a", "hard", "worker"], kurdish: "من خێرام لە فێربووندا و کەسێکی ماندوونەناسم" },
    ],
    fillBlanks: [
      { parts: ["I have a lot of", "in this field."], hint: "ئەزموونێکی زۆرم لەم بوارەدا هەیە.", answer: "experience", wrongs: ["work", "time", "job"] },
      { parts: ["I am looking", "to the opportunity to work here."], hint: "بە تامەزرۆم بۆ ئەو دەرفەتەی لێرە کار بکەم.", answer: "forward", wrongs: ["ahead", "front", "waiting"] },
    ],
    conversations: [
      { situation: "لە چاوپێکەوتنی کار لێت دەپرسن بۆچی تۆ هەڵبژێرن", theyAsk: "Why should we hire you for this position?", correct: "I have extensive experience in this field, and I am a quick learner. I believe I can be a valuable asset to your team.", wrong1: "I need money.", wrong2: "Give me job.", wrong3: "I am good boy.", explanation: "'valuable asset' و 'extensive experience' دەستەواژەی زۆر بەهێزن لە چاوپێکەوتندا کە متمانەبەخۆبوون پیشان دەدەن" },
    ],
  },

  // Lesson 1: Office Communication
  {
    topic: "Office Communication", topicKu: "پەیوەندیکردن لە ئۆفیس",
    words: [
      { english: "Can you send me",      kurdish: "دەتوانیت بۆم بنێریت؟" },
      { english: "I'll keep you posted", kurdish: "ئاگادارت دەکەمەوە (لە پێشهاتەکان)" },
      { english: "I'll look into it",    kurdish: "بەدواداچوونی بۆ دەکەم" },
      { english: "Get back to you",      kurdish: "وەڵامت دەدەمەوە (دواتر)" },
      { english: "Deadline",             kurdish: "دوا مۆڵەت" },
    ],
    voices: [
      { prompt: "بەڵێندان بە پێدانی زانیاری نوێ", target: "I don't have the answer yet, but I'll keep you posted.", targetKurdish: "هێشتا وەڵامەکەم لا نییە، بەڵام ئاگادارت دەکەمەوە لە پێشهاتەکان." },
      { prompt: "دواخستنی وەڵام بۆ بەدواداچوون", target: "I'll look into it and get back to you shortly.", targetKurdish: "بەدواداچوونی بۆ دەکەم و بە زوویی وەڵامت دەدەمەوە." },
    ],
    sentences: [
      { english: ["Could", "you", "send", "me", "the", "updated", "report"], kurdish: "دەتوانیت ڕاپۆرتە نوێکراوەکەم بۆ بنێریت؟" },
      { english: ["The", "deadline", "for", "this", "project", "is", "Friday"], kurdish: "دوا مۆڵەت بۆ ئەم پڕۆژەیە ڕۆژی هەینییە" },
    ],
    fillBlanks: [
      { parts: ["I'll keep you", "on any updates."], hint: "لە هەر پێشهاتێکی نوێ ئاگادارت دەکەمەوە.", answer: "posted", wrongs: ["told", "knowing", "seen"] },
      { parts: ["I'll check with the team and get", "to you."], hint: "لەگەڵ تیمەکە پرسیار دەکەم و وەڵامت دەدەمەوە.", answer: "back", wrongs: ["return", "reply", "answer"] },
    ],
    conversations: [
      { situation: "هاوپیشەیەک پرسیارت لێ دەکات دەربارەی بابەتێک کە نایزانیت", theyAsk: "Do you know if the client approved the final design?", correct: "I am not sure. I'll look into it and get back to you shortly.", wrong1: "I don't know.", wrong2: "Wait.", wrong3: "I check.", explanation: "'I'll look into it and get back to you' ڕێگەیەکی زۆر پیشەگەرانەیە بۆ ئەوەی بڵێیت نازانم بەڵام بەدواداچوونی بۆ دەکەیت" },
    ],
  },

  // Lesson 2: Leading & Participating in Meetings
  {
    topic: "Meetings", topicKu: "کۆبوونەوەکان",
    words: [
      { english: "Let's get started",    kurdish: "با دەست پێ بکەین" },
      { english: "I completely agree",   kurdish: "بەتەواوی هاوڕام" },
      { english: "From my perspective",  kurdish: "لە ڕوانگەی منەوە / بە ڕای من" },
      { english: "Let's move on to",     kurdish: "با بچینە سەر..." },
      { english: "Action items",         kurdish: "ئەو کارانەی کە دەبێت بکرێن (دوای کۆبوونەوە)" },
    ],
    voices: [
      { prompt: "دەستپێکردنی کۆبوونەوە", target: "Since everyone is here, let's get started.", targetKurdish: "لەبەرئەوەی هەمووان لێرەن، با دەست پێ بکەین." },
      { prompt: "گۆڕینی بابەت", target: "Let's move on to the next item on the agenda.", targetKurdish: "با بچینە سەر خاڵی داهاتوو لە بەرنامەی کارەکەدا." },
    ],
    sentences: [
      { english: ["From", "my", "perspective", "this", "is", "the", "best", "option"], kurdish: "لە ڕوانگەی منەوە ئەمە باشترین هەڵبژاردەیە" },
      { english: ["Let's", "review", "the", "action", "items", "before", "we", "finish"], kurdish: "با پێداچوونەوە بە کارە پێویستەکاندا بکەین پێش ئەوەی تەواو بین" },
    ],
    fillBlanks: [
      { parts: ["From my", ", we need to increase the budget."], hint: "لە ڕوانگەی منەوە، پێویستە بودجەکە زیاد بکەین.", answer: "perspective", wrongs: ["mind", "eyes", "seeing"] },
      { parts: ["Let's get", "with the meeting."], hint: "با دەست بکەین بە کۆبوونەوەکە.", answer: "started", wrongs: ["begin", "go", "ready"] },
    ],
    conversations: [
      { situation: "بەڕێوەبردنی کۆبوونەوەیەک کە کاتی کەمە", theyAsk: "Should we discuss the marketing budget now?", correct: "Yes, let's move on to the budget. From my perspective, we need more funds.", wrong1: "We talk budget.", wrong2: "Go to budget.", wrong3: "I think budget good.", explanation: "'Let's move on to...' ڕستەیەکی زۆر بەکارهاتووە لە کۆبوونەوەکاندا بۆ گۆڕینی بابەت بە شێوەیەکی ڕێکخراو" },
    ],
  },

  // Lesson 3: Phone Calls at Work
  {
    topic: "Professional Phone Calls", topicKu: "پەیوەندی تەلەفۆنی فەرمی",
    words: [
      { english: "Speaking",             kurdish: "فەرموو لەگەڵتم (کاتی وەڵامدانەوەی تەلەفۆن)" },
      { english: "May I ask who is calling", kurdish: "دەتوانم بپرسم کێ پەیوەندی کردووە؟" },
      { english: "Hold the line",        kurdish: "لەسەر هێڵ بە / چاوەڕێ بکە" },
      { english: "I'll put you through", kurdish: "پەیوەندییەکەت بۆ دەگوازمەوە" },
      { english: "Leave a message",      kurdish: "جێهێشتنی پەیام" },
    ],
    voices: [
      { prompt: "گواستنەوەی پەیوەندی", target: "Please hold the line, I'll put you through to the manager.", targetKurdish: "تکایە لەسەر هێڵ بە، پەیوەندییەکەت بۆ بەڕێوەبەر دەگوازمەوە." },
      { prompt: "پرسین لە ناوی پەیوەندیکار", target: "May I ask who is calling, please?", targetKurdish: "تکایە، دەتوانم بپرسم کێ پەیوەندی کردووە؟" },
    ],
    sentences: [
      { english: ["Would", "you", "like", "to", "leave", "a", "message"], kurdish: "دەتەوێت پەیامێک جێبهێڵیت؟" },
      { english: ["I'm", "afraid", "he", "is", "in", "a", "meeting"], kurdish: "بەداخەوەم (دەترسم) ئەو لە کۆبوونەوەدایە" },
    ],
    fillBlanks: [
      { parts: ["Please", "the line, I'm transferring you now."], hint: "تکایە لەسەر هێڵ بە، ئێستا پەیوەندییەکەت دەگوازمەوە.", answer: "hold", wrongs: ["stay", "keep", "wait"] },
      { parts: ["May I ask who is", "?"], hint: "دەتوانم بپرسم کێ پەیوەندی کردووە؟", answer: "calling", wrongs: ["speaking", "talking", "ringing"] },
    ],
    conversations: [
      { situation: "کەسێک بە تەلەفۆن داوای بەڕێوەبەرەکەت دەکات کە لە کۆبوونەوەدایە", theyAsk: "Hello, could I speak to Mr. Smith, please?", correct: "I'm afraid he's in a meeting right now. Would you like to leave a message?", wrong1: "He not here.", wrong2: "No Smith.", wrong3: "Say message.", explanation: "'I'm afraid he's in a meeting' زۆر پیشەگەرانەترە، و 'Would you like to leave a message' ئادابی ستانداردی سکرتێرییە" },
    ],
  },

  // Lesson 4: Dealing with Problems & Apologies
  {
    topic: "Solving Problems", topicKu: "چارەسەرکردنی کێشەکان",
    words: [
      { english: "We've run into a problem", kurdish: "تووشی کێشەیەک بووین" },
      { english: "I sincerely apologize", kurdish: "لە دڵەوە داوای لێبوردن دەکەم" },
      { english: "Let's figure this out", kurdish: "با چارەسەرێکی بۆ بدۆزینەوە" },
      { english: "Take care of it",      kurdish: "من چارەسەری دەکەم (ئەرکەکەی دەگرمە ئەستۆ)" },
      { english: "Inconvenience",        kurdish: "ناڕەحەتی / ئەزیەت" },
    ],
    voices: [
      { prompt: "ئاگادارکردنەوە لە کێشەیەک", target: "We've run into a minor problem with the server.", targetKurdish: "تووشی کێشەیەکی بچووک بووین لەگەڵ سێرڤەرەکەدا." },
      { prompt: "گرتنەئەستۆی کێشەیەک", target: "Don't worry, I will take care of it right away.", targetKurdish: "خەمت نەبێت، دەستبەجێ من ئەرکی چارەسەرکردنەکەی دەگرمە ئەستۆ." },
    ],
    sentences: [
      { english: ["I", "sincerely", "apologize", "for", "the", "inconvenience"], kurdish: "لە دڵەوە داوای لێبوردن دەکەم بۆ ئەو ئەزیەتەی پێمان گەیاندیت" },
      { english: ["Let's", "figure", "this", "out", "together"], kurdish: "با پێکەوە چارەسەرێکی بۆ بدۆزینەوە" },
    ],
    fillBlanks: [
      { parts: ["We've", "into a problem with the delivery."], hint: "تووشی کێشەیەک بووین لەگەڵ گەیاندنەکەدا.", answer: "run", wrongs: ["walked", "got", "had"] },
      { parts: ["Leave it to me, I will take", "of it."], hint: "بۆ منى جێبهێڵە، من ئەرکەکەی دەگرمە ئەستۆ.", answer: "care", wrongs: ["fix", "job", "work"] },
    ],
    conversations: [
      { situation: "کڕیارێک زۆر تووڕەیە چونکە کاڵاکەی دواکەوتووە", theyAsk: "My order is a week late! This is unacceptable.", correct: "I sincerely apologize for the inconvenience. Let me look into this and take care of it immediately.", wrong1: "Sorry.", wrong2: "I don't know.", wrong3: "Wait more.", explanation: "'I sincerely apologize' داوای لێبوردنێکی فەرمییە، و 'take care of it' پیشانی دەدات کە تۆ بەرپرسیارێتییەکە هەڵدەگریت" },
    ],
  },

  // Lesson 5: Email Etiquette & Follow-ups
  {
    topic: "Email Etiquette", topicKu: "ئادابی ئیمەیڵ ناردن",
    words: [
      { english: "Just following up on", kurdish: "تەنها بەدواداچوون دەکەم بۆ..." },
      { english: "Please find attached", kurdish: "تکایە هاوپێچکراوەکە ببینە" },
      { english: "Don't hesitate to reach out", kurdish: "دوودڵ مەبە لە پەیوەندیکردن" },
      { english: "As requested",         kurdish: "وەک چۆن داواتان کردبوو" },
      { english: "Looking forward to your reply", kurdish: "بە تامەزرۆم بۆ وەڵامەکەت" },
    ],
    voices: [
      { prompt: "بەدواداچوون بۆ ئیمەیڵێک", target: "I'm just following up on the email I sent yesterday.", targetKurdish: "تەنها بەدواداچوون دەکەم بۆ ئەو ئیمەیڵەی دوێنێ ناردم." },
      { prompt: "ئاماژەدان بە فایلێکی هاوپێچ", target: "Please find attached the report for this month.", targetKurdish: "تکایە ڕاپۆرتی ئەم مانگە ببینە کە هاوپێچ کراوە." },
    ],
    sentences: [
      { english: ["If", "you", "have", "any", "questions", "don't", "hesitate", "to", "reach", "out"], kurdish: "ئەگەر هەر پرسیارێکت هەیە دوودڵ مەبە لە پەیوەندیکردن پێمەوە" },
      { english: ["As", "requested", "here", "is", "the", "updated", "file"], kurdish: "وەک داوات کردبوو، فەرموو ئەمە فایلە نوێکراوەکەیە" },
    ],
    fillBlanks: [
      { parts: ["Just", "up on the invoice from last week."], hint: "تەنها بەدواداچوون دەکەم بۆ پسووڵەی هەفتەی ڕابردوو.", answer: "following", wrongs: ["checking", "asking", "seeing"] },
      { parts: ["Please find", "the document you asked for."], hint: "تکایە ئەو بەڵگەنامەیە ببینە کە داوات کردبوو (کە لکێنراوە بە ئیمەیڵەکەوە).", answer: "attached", wrongs: ["added", "included", "sent"] },
    ],
    conversations: [
      { situation: "ئیمەیڵێک دەنێریت کە فایلێکی تێدایە و دەتەوێت وەڵامیان هەبێت", theyAsk: "Hi, did you manage to finish the quarterly report?", correct: "Yes, as requested, please find attached the report. I am looking forward to your feedback.", wrong1: "Here is file.", wrong2: "I attach report.", wrong3: "Read the file.", explanation: "'Please find attached' ستانداردترین دەستەواژەی ئیمەیڵە کاتێک فایلێک دەنێریت" },
    ],
  },

  // Lesson 6: Giving Presentations
  {
    topic: "Presentations", topicKu: "پێشکەشکردنی بابەت (پریزێنتەیشن)",
    words: [
      { english: "I'd like to present",  kurdish: "دەمەوێت پێشکەشی بکەم" },
      { english: "As you can see here",  kurdish: "وەک لێرەدا دەیبینن" },
      { english: "To sum up",            kurdish: "بۆ پوختەکردنەوە / لە کۆتاییدا" },
      { english: "Any questions so far", kurdish: "تا ئێرە هیچ پرسیارێک هەیە؟" },
      { english: "Let's move to the next slide", kurdish: "با بچینە سەر سلایدی داهاتوو" },
    ],
    voices: [
      { prompt: "دەستپێکی پێشکەشکردن", target: "Today, I'd like to present our new marketing strategy.", targetKurdish: "ئەمڕۆ، دەمەوێت ستراتیژییە نوێیەکەی بەبازاڕکردنمان پێشکەش بکەم." },
      { prompt: "کۆتاییهێنان بە پێشکەشکردن", target: "To sum up, our sales have increased by twenty percent.", targetKurdish: "بۆ پوختەکردنەوە، فرۆشەکانمان سەدا بیست زیادیان کردووە." },
    ],
    sentences: [
      { english: ["As", "you", "can", "see", "here", "on", "the", "graph"], kurdish: "وەک لێرەدا لەسەر هێڵکارییەکە دەیبینن" },
      { english: ["Are", "there", "any", "questions", "so", "far"], kurdish: "تا ئێرە هیچ پرسیارێک هەیە؟" },
    ],
    fillBlanks: [
      { parts: ["Let's move to the next", "."], hint: "با بچینە سەر سلایدی داهاتوو.", answer: "slide", wrongs: ["page", "picture", "paper"] },
      { parts: ["To", "up, we need to focus on quality."], hint: "بۆ پوختەکردنەوە، پێویستە تەرکیز بکەینە سەر کوالێتی.", answer: "sum", wrongs: ["end", "close", "finish"] },
    ],
    conversations: [
      { situation: "لەکاتی پێشکەشکردندا دەتەوێت بپرسیت ئایا کەس پرسیاری هەیە", theyAsk: "...and that covers the technical details of the product.", correct: "Before we move to the next slide, are there any questions so far?", wrong1: "Who has question?", wrong2: "You want to ask?", wrong3: "I wait for questions.", explanation: "'Are there any questions so far?' زۆر بەئەدەبە و ڕێگە دەدات ئامادەبووان بە ئاسوودەیی پرسیار بکەن" },
    ],
  },

  // Lesson 7: Negotiating
  {
    topic: "Negotiating", topicKu: "گفتوگۆکردن (مامەڵەکردن لە کاردا)",
    words: [
      { english: "We can offer you",     kurdish: "دەتوانین پێت پێشکەش بکەین" },
      { english: "Is there any flexibility", kurdish: "ئایا هیچ نەرمی نواندنێک هەیە (لە نرخ/مەرج)؟" },
      { english: "Meet halfway",         kurdish: "ڕێککەوتن لە ناوەڕاستدا (هەردوولا کەمێک سازش بکەن)" },
      { english: "Bottom line",          kurdish: "خاڵی کۆتایی / کەمترین ئاست کە قبوڵ بکرێت" },
      { english: "Win-win situation",    kurdish: "بارودۆخێک هەردوولا براوە بن" },
    ],
    voices: [
      { prompt: "پرسین لە نەرمی نواندن", target: "Is there any flexibility with the price?", targetKurdish: "ئایا هیچ نەرمییەک هەیە لە نرخەکەدا؟" },
      { prompt: "پێشنیارکردنی سازش", target: "Let's meet halfway. How about ten percent discount?", targetKurdish: "با لە ناوەڕاستدا ڕێککەوین. چی دەڵێیت بۆ سەدا دە داشکاندن؟" },
    ],
    sentences: [
      { english: ["I", "think", "we", "can", "reach", "a", "win-win", "situation"], kurdish: "پێم وایە دەتوانین بگەینە بارودۆخێک کە هەردوولا براوە بین" },
      { english: ["My", "bottom", "line", "is", "fifty", "dollars"], kurdish: "دوا نرخم پەنجا دۆلارە (خوار ئەوە قبوڵ ناکەم)" },
    ],
    fillBlanks: [
      { parts: ["Is there any", "in your budget?"], hint: "ئایا هیچ نەرمییەک لە بودجەکەتاندا هەیە؟", answer: "flexibility", wrongs: ["change", "moving", "space"] },
      { parts: ["Let's meet", "and agree on this price."], hint: "با لە ناوەڕاستدا ڕێککەوین و لەسەر ئەم نرخە ڕازی بین.", answer: "halfway", wrongs: ["middle", "center", "between"] },
    ],
    conversations: [
      { situation: "دەتەوێت داشکاندنێک بکەیت بۆ کڕیارێک بەڵام ئەو زۆری دەوێت", theyAsk: "I want a 20% discount on this contract.", correct: "We can't do 20%, but let's meet halfway. We can offer you a 10% discount. That's our bottom line.", wrong1: "No 20%. I give 10%.", wrong2: "20 is too much.", wrong3: "I don't give discount.", explanation: "'Let's meet halfway' زاراوەیەکی زۆر باوی بازرگانییە کاتێک دەتەوێت بگەیتە ڕێککەوتنێک" },
    ],
  },

  // Lesson 8: Giving Feedback & Reviews
  {
    topic: "Giving Feedback", topicKu: "پێدانی هەڵسەنگاندن (فیدباک)",
    words: [
      { english: "Constructive feedback", kurdish: "هەڵسەنگاندنی بنیاتنەر (بۆ باشترکردن)" },
      { english: "You're doing great",   kurdish: "کارێکی زۆر باش دەکەیت" },
      { english: "Room for improvement", kurdish: "بواری بەرەوپێشچوون ماوە" },
      { english: "Keep up the good work", kurdish: "بەردەوام بە لەم کارە باشە" },
      { english: "Focus more on",        kurdish: "زیاتر تەرکیز بکەرە سەر..." },
    ],
    voices: [
      { prompt: "پێدانی فیدباکی ئەرێنی", target: "You're doing great, just keep up the good work.", targetKurdish: "کارێکی زۆر باش دەکەیت، تەنها بەردەوام بە لەم کارە باشە." },
      { prompt: "پێشنیارکردنی باشترکردن", target: "There is some room for improvement in your presentations.", targetKurdish: "بواری بەرەوپێشچوون ماوە لە پێشکەشکردنەکانتدا." },
    ],
    sentences: [
      { english: ["I", "have", "some", "constructive", "feedback", "for", "you"], kurdish: "چەند هەڵسەنگاندنێکی بنیاتنەرم هەیە بۆت" },
      { english: ["You", "need", "to", "focus", "more", "on", "details"], kurdish: "پێویستە زیاتر تەرکیز بکەیتە سەر وردەکارییەکان" },
    ],
    fillBlanks: [
      { parts: ["There is always", "for improvement."], hint: "هەمیشە بواری بەرەوپێشچوون ماوە.", answer: "room", wrongs: ["space", "place", "time"] },
      { parts: ["Keep up the good", "!"], hint: "بەردەوام بە لەم کارە باشە!", answer: "work", wrongs: ["job", "doing", "thing"] },
    ],
    conversations: [
      { situation: "هەڵسەنگاندنی کارمەندێک دەکەیت کە کارەکەی باشە بەڵام کەمێک خاوە", theyAsk: "How has my performance been this month?", correct: "You're doing great, but there's room for improvement with deadlines. Keep up the good work, just focus more on time management.", wrong1: "You are good but slow.", wrong2: "Work faster next time.", wrong3: "I don't like your speed.", explanation: "'room for improvement' ڕێگەیەکی زۆر نەرم و ئەرێنییە بۆ وتنی ئەوەی کە کەموکوڕییەک هەیە" },
    ],
  },

  // Lesson 9: Networking & Building Connections
  {
    topic: "Networking", topicKu: "دروستکردنی پەیوەندی پیشەیی",
    words: [
      { english: "Keep in touch",        kurdish: "لە پەیوەندیدا دەبین" },
      { english: "Exchange contact details", kurdish: "گۆڕینەوەی زانیاری پەیوەندی (ژمارە/ئیمەیڵ)" },
      { english: "Connect on LinkedIn",  kurdish: "پەیوەندیکردن لە لینکدین" },
      { english: "It was a pleasure",    kurdish: "جێگەی شانازی / خۆشحاڵی بوو" },
      { english: "Mutual contact",       kurdish: "ناسراوی هاوبەش" },
    ],
    voices: [
      { prompt: "داوای ژمارە یان ئیمەیڵ", target: "Should we exchange contact details?", targetKurdish: "ئایا باشە زانیاری پەیوەندیکردنمان بگۆڕینەوە؟" },
      { prompt: "کۆتاییهێنان بە قسەکردن لە کۆنفرانسێک", target: "It was a pleasure meeting you. Let's keep in touch.", targetKurdish: "ناسینت جێگەی خۆشحاڵی بوو. با لە پەیوەندیدا بین." },
    ],
    sentences: [
      { english: ["I", "think", "we", "have", "a", "mutual", "contact"], kurdish: "پێم وایە ناسراوێکی هاوبەشمان هەیە" },
      { english: ["Let's", "connect", "on", "LinkedIn", "later"], kurdish: "با دواتر لە لینکدین پەیوەندی بە یەکەوە بکەین" },
    ],
    fillBlanks: [
      { parts: ["Let's exchange contact", "before you leave."], hint: "با زانیاری پەیوەندیکردنمان بگۆڕینەوە پێش ئەوەی بڕۆیت.", answer: "details", wrongs: ["info", "papers", "numbers"] },
      { parts: ["It was a", "meeting you today."], hint: "ئەمڕۆ ناسینت جێگەی شانازی (خۆشحاڵی) بوو.", answer: "pleasure", wrongs: ["good", "happy", "nice"] },
    ],
    conversations: [
      { situation: "لە کۆنفرانسێکی بازرگانیدا کەسێک دەناسیت", theyAsk: "I need to go to the next session now. It was nice talking to you.", correct: "It was a pleasure meeting you too. Should we exchange contact details? I'd love to keep in touch.", wrong1: "Give me your number.", wrong2: "I want to talk more later.", wrong3: "Call me.", explanation: "'exchange contact details' و 'keep in touch' باشترین وشەکانن بۆ دروستکردنی پەیوەندی لە بۆنە فەرمییەکاندا" },
    ],
  },

];

export default normalUnit02;
