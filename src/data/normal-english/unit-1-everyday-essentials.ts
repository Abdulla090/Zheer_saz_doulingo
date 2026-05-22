import { UnitBank } from "../types";

// ── Unit 0: Everyday Essentials — 10 unique lessons ──────────────────────────
// Practical English for non-native speakers: the real-life language you actually need.

const normalUnit00: UnitBank = [

  // Lesson 0: Making Requests Politely
  {
    topic: "Polite Requests", topicKu: "داواکارییە بەئەدەبەکان",
    words: [
      { english: "Could you please",  kurdish: "تکایە دەتوانیت" },
      { english: "Would it be possible", kurdish: "ئایا دەکرێت" },
      { english: "I was wondering if",  kurdish: "دەمویست بزانم ئایا" },
      { english: "I'd appreciate it",   kurdish: "سوپاسگوزار دەبم" },
      { english: "If you don't mind",   kurdish: "ئەگەر پێت ناخۆش نەبێت" },
    ],
    voices: [
      { prompt: "داوایەکی بەئەدەب بکە", target: "Could you please send me the file?", targetKurdish: "تکایە دەتوانیت فایلەکەم بۆ بنێریت؟" },
      { prompt: "داوا بە شێوەی فەرمی", target: "I was wondering if you could help me with this.", targetKurdish: "دەمویست بزانم ئایا دەتوانیت لەمەدا یارمەتیم بدەیت." },
    ],
    sentences: [
      { english: ["Could", "you", "please", "explain", "this"], kurdish: "تکایە دەتوانیت ئەمە ڕوون بکەیتەوە؟" },
      { english: ["I'd", "appreciate", "it", "if", "you", "helped"], kurdish: "زۆر سوپاسگوزار دەبم ئەگەر یارمەتیم بدەیت" },
    ],
    fillBlanks: [
      { parts: ["Could you", "send me the report?"], hint: "تکایە ڕاپۆرتەکەم بۆ بنێرە؟", answer: "please", wrongs: ["kindly", "just", "maybe"] },
      { parts: ["I'd", "it if you could check this."], hint: "سوپاسگوزار دەبم ئەگەر ئەمە بپشکنیت.", answer: "appreciate", wrongs: ["prefer", "like", "want"] },
    ],
    conversations: [
      { situation: "لە شوێنی کار داوای یارمەتی دەکەیت", theyAsk: "What do you need?", correct: "I was wondering if you could review my work when you have a moment.", wrong1: "Please review my work.", wrong2: "Can you check my work now?", wrong3: "I need you to see my work.", explanation: "'I was wondering if you could...' — دەربڕینێکی زۆر بەئەدەب و پیشەییە بۆ داواکردن" },
    ],
  },

  // Lesson 1: Apologizing & Making Excuses
  {
    topic: "Apologizing", topicKu: "داوای لێبوردن کردن",
    words: [
      { english: "I sincerely apologize",  kurdish: "لە ناخەوە داوای لێبوردن دەکەم" },
      { english: "I take full responsibility", kurdish: "بەرپرسیارێتی تەواو لە ئەستۆ دەگرم" },
      { english: "It won't happen again",   kurdish: "جاری دیکە دووبارە نابێتەوە" },
      { english: "I should have",          kurdish: "دەبوایە..." },
      { english: "My mistake",             kurdish: "هەڵەی من بوو" },
    ],
    voices: [
      { prompt: "بە فەرمی داوای لێبوردن بکە", target: "I sincerely apologize for the inconvenience.", targetKurdish: "لە ناخەوە داوای لێبوردن دەکەم بۆ ئەم ناڕەحەتییە." },
      { prompt: "بەرپرسیارێتی هەڵبگرە", target: "I take full responsibility for this mistake.", targetKurdish: "بەرپرسیارێتی تەواو لە ئەستۆ دەگرم بۆ ئەم هەڵەیە." },
    ],
    sentences: [
      { english: ["I", "sincerely", "apologize", "for", "the", "delay"], kurdish: "لە ناخەوە داوای لێبوردن دەکەم بۆ دواکەوتنەکە" },
      { english: ["It", "won't", "happen", "again", "I", "promise"], kurdish: "بەڵێن دەدەم جاری دیکە دووبارە نابێتەوە" },
    ],
    fillBlanks: [
      { parts: ["I should", "asked for help sooner."], hint: "دەبوایە زووتر داوای یارمەتیم بکردایە.", answer: "have", wrongs: ["of", "to", "been"] },
      { parts: ["My", "— I completely forgot the meeting."], hint: "هەڵەی من بوو — تەواو کۆبوونەوەکەم لەبیر چوو.", answer: "mistake", wrongs: ["bad", "fault", "error"] },
    ],
    conversations: [
      { situation: "دواکەوتنی پڕۆژەیەک", theyAsk: "Why is the project late?", correct: "I sincerely apologize. I should have communicated the delay earlier — it won't happen again.", wrong1: "Sorry the project is late.", wrong2: "I am apologizing for being late.", wrong3: "It is late because of problems.", explanation: "'I sincerely apologize... it won't happen again' — قبووڵکردنی بەرپرسیارێتییە بەشێوەیەکی پیشەیی" },
    ],
  },

  // Lesson 2: Expressing Opinions Formally
  {
    topic: "Expressing Opinions", topicKu: "دەربڕینی بۆچوون",
    words: [
      { english: "In my view",           kurdish: "بە بڕوای من" },
      { english: "From my perspective",  kurdish: "لە ڕوانگەی منەوە" },
      { english: "I strongly believe",   kurdish: "بە توندی باوەڕم وایە" },
      { english: "Based on my experience", kurdish: "بەپێی ئەزموونی من" },
      { english: "It seems to me",       kurdish: "وا هەست دەکەم / پێم وایە" },
    ],
    voices: [
      { prompt: "بۆچوونت بە فەرمی دەرببڕە", target: "In my view, this approach is more effective.", targetKurdish: "بە بڕوای من، ئەم ڕێگەیە کاریگەرترە." },
      { prompt: "پشت بە ئەزموون ببەستە", target: "Based on my experience, communication is key.", targetKurdish: "بەپێی ئەزموونی من، پەیوەندیکردن گرنگترین شتە." },
    ],
    sentences: [
      { english: ["In", "my", "view", "this", "is", "the", "best", "option"], kurdish: "بە بڕوای من ئەمە باشترین هەڵبژاردەیە" },
      { english: ["From", "my", "perspective", "we", "need", "more", "time"], kurdish: "لە ڕوانگەی منەوە پێویستمان بە کاتی زیاترە" },
    ],
    fillBlanks: [
      { parts: ["In my", ", the second option is stronger."], hint: "بە بڕوای من، هەڵبژاردەی دووەم بەهێزترە.", answer: "view", wrongs: ["mind", "head", "opinion"] },
      { parts: ["I strongly", "that teamwork is essential."], hint: "بە توندی باوەڕم وایە کە کارکردن بەیەکەوە زۆر گرنگە.", answer: "believe", wrongs: ["think", "feel", "say"] },
    ],
    conversations: [
      { situation: "کۆبوونەوەی تیم", theyAsk: "What do you think we should do?", correct: "From my perspective, we should gather more data before deciding. Based on my experience, rushing leads to mistakes.", wrong1: "I think we need more data.", wrong2: "We should not rush I think.", wrong3: "My opinion is we need data first.", explanation: "'From my perspective... Based on my experience' — دوو دەربڕینی جوانن بۆ دەربڕینی بۆچوون" },
    ],
  },

  // Lesson 3: Asking for Clarification
  {
    topic: "Asking for Clarification", topicKu: "داوای ڕوونکردنەوە",
    words: [
      { english: "Could you clarify",    kurdish: "دەتوانیت ڕوونی بکەیتەوە" },
      { english: "What do you mean by", kurdish: "مەبەستت چییە لە" },
      { english: "Could you elaborate",  kurdish: "دەتوانیت زیاتر ڕوونی بکەیتەوە" },
      { english: "Just to confirm",      kurdish: "تەنها بۆ دڵنیابوون" },
      { english: "If I understand correctly", kurdish: "ئەگەر باش تێگەیشتبم" },
    ],
    voices: [
      { prompt: "داوای ڕوونکردنەوە بکە", target: "Could you clarify what you mean by 'urgent'?", targetKurdish: "دەتوانیت ڕوونی بکەیتەوە مەبەستت چییە لە 'بەپەلە'؟" },
      { prompt: "دڵنیا بەرەوە", target: "Just to confirm — the deadline is Friday, correct?", targetKurdish: "تەنها بۆ دڵنیابوون — وادەی کۆتایی هەینییە، ڕاستە؟" },
    ],
    sentences: [
      { english: ["Could", "you", "elaborate", "on", "that", "point"], kurdish: "دەتوانیت ئەو خاڵە زیاتر ڕوون بکەیتەوە؟" },
      { english: ["If", "I", "understand", "correctly", "you", "want", "changes"], kurdish: "ئەگەر باش تێگەیشتبم، دەتەوێت گۆڕانکاری بکرێت" },
    ],
    fillBlanks: [
      { parts: ["Could you", "on that last point?"], hint: "دەتوانیت ئەو خاڵەی کۆتایی زیاتر ڕوون بکەیتەوە؟", answer: "elaborate", wrongs: ["explain", "expand", "repeat"] },
      { parts: ["Just to", "— we meet at 3pm, right?"], hint: "تەنها بۆ دڵنیابوون — کاتژمێر ٣ کۆدەبینەوە، ڕاستە؟", answer: "confirm", wrongs: ["check", "verify", "know"] },
    ],
    conversations: [
      { situation: "دوای پێشکەشکردنێک", theyAsk: "Any questions about what I just said?", correct: "Yes — could you clarify what you mean by 'flexible timeline'? If I understand correctly, the dates can change?", wrong1: "What is flexible timeline?", wrong2: "I don't understand flexible timeline.", wrong3: "Can you explain the timeline?", explanation: "'Could you clarify... If I understand correctly' — باشترین ڕێگەن بۆ پرسیارکردن بەبێ ئەوەی بەرامبەر بێزار بکەیت" },
    ],
  },

  // Lesson 4: Talking About the Future
  {
    topic: "Future Plans & Goals", topicKu: "پلان و ئامانجەکانی داهاتوو",
    words: [
      { english: "I'm planning to",      kurdish: "پلانم هەیە بۆ" },
      { english: "I intend to",          kurdish: "نیازم وایە" },
      { english: "I'm hoping to",        kurdish: "هیوادارم بتوانم" },
      { english: "In the long run",      kurdish: "لە ماوەیەکی درێژخایەندا" },
      { english: "My goal is to",        kurdish: "ئامانجم ئەوەیە کە" },
    ],
    voices: [
      { prompt: "ئامانجەکەت باس بکە", target: "My goal is to improve my English within six months.", targetKurdish: "ئامانجم ئەوەیە کە ئینگلیزییەکەم لە ماوەی شەش مانگدا باشتر بکەم." },
      { prompt: "پلانی داهاتوو", target: "I'm planning to apply for a new position next year.", targetKurdish: "پلانم هەیە ساڵی داهاتوو پێشکەشی بکەم بۆ پۆستێکی نوێ." },
    ],
    sentences: [
      { english: ["I'm", "planning", "to", "study", "every", "day"], kurdish: "پلانم هەیە هەموو ڕۆژێک بخوێنم" },
      { english: ["In", "the", "long", "run", "I", "want", "to", "lead", "a", "team"], kurdish: "لە درێژخایەندا دەمەوێت ببمە سەرپەرشتیاری تیمێک" },
    ],
    fillBlanks: [
      { parts: ["My", "is to become fluent in two years."], hint: "ئامانجم ئەوەیە کە لە ماوەی دوو ساڵدا پاراو بم لە زمانەکە.", answer: "goal", wrongs: ["plan", "hope", "dream"] },
      { parts: ["I'm hoping", "finish this course by summer."], hint: "هیوادارم تا هاوین ئەم کۆرسە تەواو بکەم.", answer: "to", wrongs: ["for", "of", "about"] },
    ],
    conversations: [
      { situation: "چاوپێکەوتنی کار", theyAsk: "Where do you see yourself in five years?", correct: "In the long run, my goal is to lead a team. I'm planning to develop my leadership skills over the next two years.", wrong1: "I want to be a leader in 5 years.", wrong2: "My plan is to get promoted.", wrong3: "I hope to be successful in 5 years.", explanation: "'In the long run... I'm planning to' — وەڵامێکی زۆر گونجاو و پیشەییە بۆ ئەم پرسیارە" },
    ],
  },

  // Lesson 5: Describing Problems
  {
    topic: "Describing Problems", topicKu: "وەسفکردنی کێشەکان",
    words: [
      { english: "The issue is",         kurdish: "کێشەکە ئەوەیە کە" },
      { english: "We're facing",         kurdish: "ڕووبەڕووی ... دەبینەوە" },
      { english: "The main challenge",   kurdish: "گەورەترین ئاستەنگ" },
      { english: "This is causing",      kurdish: "ئەمە دەبێتە هۆی" },
      { english: "It's affecting",       kurdish: "کاریگەری دەکاتە سەر" },
    ],
    voices: [
      { prompt: "کێشەیەک باس بکە", target: "The issue is that we don't have enough resources.", targetKurdish: "کێشەکە ئەوەیە کە سەرچاوەی پێویستمان نییە." },
      { prompt: "باس لە کاریگەرییەکان بکە", target: "This is causing delays and affecting our deadline.", targetKurdish: "ئەمە دەبێتە هۆی دواکەوتن و کاریگەری دەکاتە سەر وادەکانمان." },
    ],
    sentences: [
      { english: ["The", "main", "challenge", "is", "lack", "of", "communication"], kurdish: "گەورەترین ئاستەنگ نەبوونی پەیوەندییە" },
      { english: ["We're", "facing", "a", "technical", "issue", "right", "now"], kurdish: "ئێستا ڕووبەڕووی کێشەیەکی تەکنیکی بووینەتەوە" },
    ],
    fillBlanks: [
      { parts: ["The", "is that we're understaffed right now."], hint: "کێشەکە ئەوەیە کە ئێستا کارمەندمان کەمە.", answer: "issue", wrongs: ["problem", "thing", "matter"] },
      { parts: ["This is", "our ability to deliver on time."], hint: "ئەمە کاریگەری دەکاتە سەر توانامان بۆ گەیاندن لە کاتی خۆیدا.", answer: "affecting", wrongs: ["causing", "changing", "hurting"] },
    ],
    conversations: [
      { situation: "ڕاپۆرتدانی کێشەیەک بۆ بەڕێوەبەر", theyAsk: "What seems to be the problem?", correct: "The main challenge is a lack of clear communication between teams. This is causing delays and affecting our deadlines.", wrong1: "Teams are not communicating well.", wrong2: "There are communication problems causing delays.", wrong3: "The problem is teams don't talk enough.", explanation: "'The main challenge... This is causing... affecting' — شێوازێکی زۆر باو و پیشەییە بۆ باسکردنی کێشەکان" },
    ],
  },

  // Lesson 6: Giving and Receiving Feedback
  {
    topic: "Giving Feedback", topicKu: "پێدانی ڕەخنە و پێشنیار",
    words: [
      { english: "I'd suggest",          kurdish: "پێشنیار دەکەم کە" },
      { english: "One thing to improve", kurdish: "یەک شت بۆ باشترکردن" },
      { english: "That said",            kurdish: "لەگەڵ ئەوەشدا" },
      { english: "Well done on",         kurdish: "دەستخۆشی بۆ" },
      { english: "Going forward",        kurdish: "لە داهاتوودا / بۆ پێشەوە" },
    ],
    voices: [
      { prompt: "پێشنیار بدە", target: "I'd suggest adding more examples to support your points.", targetKurdish: "پێشنیار دەکەم نموونەی زیاتر زیاد بکەیت بۆ پشتگیریکردنی خاڵەکانت." },
      { prompt: "دەستخۆشی بکە و ڕێنمایی بدە", target: "Well done on the structure — going forward, focus more on data.", targetKurdish: "دەستخۆشی بۆ پێکهاتەکە — لە داهاتوودا، زیاتر سەرنجت لەسەر داتا بێت." },
    ],
    sentences: [
      { english: ["Well", "done", "on", "the", "presentation", "it", "was", "clear"], kurdish: "دەستخۆشی بۆ پێشکەشکردنەکە، زۆر ڕوون بوو" },
      { english: ["Going", "forward", "try", "to", "be", "more", "concise"], kurdish: "لە داهاتوودا هەوڵبدە پوختتر بیت" },
    ],
    fillBlanks: [
      { parts: ["I'd", "starting with the conclusion next time."], hint: "پێشنیار دەکەم جاری داهاتوو بە دەرەنجامەکە دەست پێ بکەیت.", answer: "suggest", wrongs: ["recommend", "advise", "think"] },
      { parts: ["That", ", the core idea was very strong."], hint: "لەگەڵ ئەوەشدا، بیرۆکە سەرەکییەکە زۆر بەهێز بوو.", answer: "said", wrongs: ["done", "being", "noted"] },
    ],
    conversations: [
      { situation: "دوای پێشکەشکردنی هاوکارێک", theyAsk: "What did you think of my presentation?", correct: "Well done on the research — it was thorough. That said, I'd suggest making the slides less text-heavy going forward.", wrong1: "It was good but too much text.", wrong2: "Your slides had too many words.", wrong3: "Good research but slides need work.", explanation: "'Well done on... That said... I'd suggest...' — ئەمە پێی دەوترێت (ساندویچی فیدباک) کە زۆر پیشەییە" },
    ],
  },

  // Lesson 7: Numbers, Dates & Times
  {
    topic: "Numbers, Dates & Times", topicKu: "ژمارە، کات و بەروار",
    words: [
      { english: "As of",               kurdish: "تاکو ئێستا / هەر لە" },
      { english: "Approximately",       kurdish: "نزیکەی" },
      { english: "By the end of",       kurdish: "تاوەکو کۆتایی" },
      { english: "Quarter",             kurdish: "چارەک" },
      { english: "Ahead of schedule",   kurdish: "پێش وادەی دیاریکراو" },
    ],
    voices: [
      { prompt: "باسکردنی ڕێژە", target: "As of today, we've completed approximately 70 percent.", targetKurdish: "تاکو ئەمڕۆ، نزیکەی لەسەدا ٧٠مان تەواو کردووە." },
      { prompt: "کاتی تەواوبوون", target: "We're ahead of schedule — it'll be done by end of March.", targetKurdish: "ئێمە لە پێش وادەی دیاریکراوین — تا کۆتایی مانگی ئازار تەواو دەبێت." },
    ],
    sentences: [
      { english: ["We", "aim", "to", "finish", "by", "the", "end", "of", "Q2"], kurdish: "ئامانجمانە تاوەکو کۆتایی چارەکی دووەم تەواوی بکەین" },
      { english: ["Approximately", "half", "of", "the", "work", "is", "done"], kurdish: "نزیکەی نیوەی کارەکە تەواو بووە" },
    ],
    fillBlanks: [
      { parts: ["As of", ", the budget sits at $50,000."], hint: "تاکو ئەمڕۆ، بودجەکە ٥٠،٠٠٠ دۆلارە.", answer: "today", wrongs: ["now", "this moment", "yet"] },
      { parts: ["We finished", "of schedule — two days early."], hint: "پێش وادەی دیاریکراو تەواومان کرد — دوو ڕۆژ زووتر.", answer: "ahead", wrongs: ["before", "early", "under"] },
    ],
    conversations: [
      { situation: "نیشاندانی بەرەوپێشچوونی کار", theyAsk: "Where are we on the project?", correct: "As of today, we've completed approximately 60% of the work. We're actually ahead of schedule and expect to finish by the end of Q3.", wrong1: "We finished 60% of the project.", wrong2: "We are on track and ahead of time.", wrong3: "About 60% is done and we're early.", explanation: "'As of today... approximately... ahead of schedule' — شێوازێکی زۆر ڕێک و پێشەییە بۆ ڕاپۆرتدانی کار" },
    ],
  },

  // Lesson 8: Writing Emails
  {
    topic: "Email Phrases", topicKu: "دەستەواژەکانی ئیمەیڵ",
    words: [
      { english: "I hope this finds you well", kurdish: "هیوادارم باش بیت" },
      { english: "I am writing to",            kurdish: "مەبەستم لەم ئیمەیڵە ئەوەیە کە" },
      { english: "Please find attached",       kurdish: "تکایە بڕوانە هاوپێچکراوەکە" },
      { english: "Looking forward to",         kurdish: "بە تامەزرۆییەوە چاوەڕێی" },
      { english: "Best regards",              kurdish: "لەگەڵ ڕێزدا" },
    ],
    voices: [
      { prompt: "دەستپێکی ئیمەیڵ", target: "I hope this email finds you well. I am writing to follow up on our meeting.", targetKurdish: "هیوادارم ئەم ئیمەیڵە لە کاتێکدا پێتبگات کە باش بیت. مەبەستم لە نووسینی ئەم ئیمەیڵە بەدواداچوونە بۆ کۆبوونەوەکەمان." },
      { prompt: "کۆتایی ئیمەیڵ", target: "Looking forward to hearing from you. Best regards.", targetKurdish: "بە تامەزرۆییەوە چاوەڕێی وەڵامتم. لەگەڵ ڕێزدا." },
    ],
    sentences: [
      { english: ["I", "am", "writing", "to", "request", "a", "meeting"], kurdish: "مەبەستم لەم ئیمەیڵە داواکردنی کۆبوونەوەیەکە" },
      { english: ["Please", "find", "attached", "the", "document", "you", "requested"], kurdish: "تکایە بڕوانە ئەو بەڵگەنامەیەی کە داوات کردبوو، هاوپێچ کراوە" },
    ],
    fillBlanks: [
      { parts: ["I hope", "email finds you well."], hint: "هیوادارم ئەم ئیمەیڵە لە کاتێکدا پێتبگات کە باش بیت.", answer: "this", wrongs: ["the", "my", "your"] },
      { parts: ["Looking", "to your response."], hint: "بە تامەزرۆییەوە چاوەڕێی وەڵامتەم.", answer: "forward", wrongs: ["back", "out", "up"] },
    ],
    conversations: [
      { situation: "ناردنی ئیمەیڵێکی فەرمی", theyAsk: "Write me a professional email opening.", correct: "I hope this email finds you well. I am writing to request your feedback on the attached proposal.", wrong1: "Hello, I want your feedback on this.", wrong2: "Hi, please look at my proposal.", wrong3: "Good morning, can you check this for me?", explanation: "'I hope this finds you well. I am writing to...' — ستانداردی زێڕینە بۆ دەستپێکردنی ئیمەیڵی فەرمی" },
    ],
  },

  // Lesson 9: Handling Disagreements
  {
    topic: "Handling Disagreements", topicKu: "چارەسەرکردنی جیاوازیی بۆچوون",
    words: [
      { english: "I see your point, however", kurdish: "تێدەگەم مەبەستت چییە، بەڵام" },
      { english: "I respectfully disagree",   kurdish: "لەگەڵ ڕێزدا، من هاوڕا نیم" },
      { english: "With all due respect",      kurdish: "لەگەڵ هەموو ڕێزێکدا" },
      { english: "We may need to compromise", kurdish: "لەوانەیە پێویستمان بە سازشکردن بێت" },
      { english: "Let's find common ground",  kurdish: "با خاڵێکی هاوبەش بدۆزینەوە" },
    ],
    voices: [
      { prompt: "بە ڕێزەوە ڕەتی بکەرەوە", target: "I respectfully disagree — I see your point, however the data suggests otherwise.", targetKurdish: "لەگەڵ ڕێزدا من هاوڕا نیم — تێدەگەم مەبەستت چییە، بەڵام داتاکان شتێکی تر دەڵێن." },
      { prompt: "پێشنیاری چارەسەر بکە", target: "Let's find common ground — we may need to compromise on the timeline.", targetKurdish: "با خاڵێکی هاوبەش بدۆزینەوە — لەوانەیە پێویستمان بە سازشکردن بێت لەسەر کاتەکە." },
    ],
    sentences: [
      { english: ["I", "see", "your", "point", "however", "I", "disagree"], kurdish: "تێدەگەم مەبەستت چییە، بەڵام هاوڕا نیم" },
      { english: ["Let's", "find", "a", "solution", "that", "works", "for", "both"], kurdish: "با چارەسەرێک بدۆزینەوە کە بۆ هەردووکمان گونجاو بێت" },
    ],
    fillBlanks: [
      { parts: ["I see your point;", ", the budget is a real constraint."], hint: "تێدەگەم مەبەستت چییە؛ بەڵام، بودجەکە ئاستەنگێکی ڕاستەقینەیە.", answer: "however", wrongs: ["but", "yet", "though"] },
      { parts: ["With all due", ", I think we need a different approach."], hint: "لەگەڵ هەموو ڕێزێکدا، پێم وایە پێویستمان بە ڕێگەیەکی جیاوازە.", answer: "respect", wrongs: ["care", "regards", "consideration"] },
    ],
    conversations: [
      { situation: "جیاوازیی بۆچوون لە کۆبوونەوەیەکدا", theyAsk: "I think we should cut the marketing budget completely.", correct: "I see your point, however, I respectfully disagree. With all due respect, cutting it completely could harm our brand. Perhaps we could compromise and reduce it instead?", wrong1: "I don't think we should cut the budget.", wrong2: "That's not a good idea, marketing is important.", wrong3: "I disagree because marketing is necessary.", explanation: "'I see your point, however... respectfully disagree... could we compromise' — شێوازێکی زۆر نموونەییە بۆ مامەڵەکردن لەگەڵ جیاوازیی بۆچوون" },
    ],
  },
];

export default normalUnit00;
