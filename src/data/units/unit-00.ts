import { UnitBank } from "../types";

// ── Unit 0: Street Greetings — 10 unique lessons ──────────────────────────────
const unit00: UnitBank = [

  // Lesson 0: Basic Greetings
  {
    topic: "Basic Greetings", topicKu: "سڵاوی سەرەکی",
    words: [
      { english: "Hello", kurdish: "سڵاو" },
      { english: "What's up", kurdish: "چ باسە" },
      { english: "How are you?", kurdish: "چۆنی" },
      { english: "Good morning", kurdish: "بەیانی باش" },
      { english: "Nice to meet you", kurdish: "خۆشحاڵم بە ناسینت" },
    ],
    voices: [
      { prompt: "بە شیرینی سڵاو بکە", target: "Hey, how's it going?", targetKurdish: "سڵاو، باشیت؟" },
      { prompt: "ئارامانەی سڵاو بکە", target: "Hi there, good to see you", targetKurdish: "سڵاو، خۆشحاڵم بە بینینت" },
    ],
    sentences: [
      { english: ["Hey", "how's", "it", "going"], kurdish: "سڵاو، چۆنی، باشیت؟" },
      { english: ["Hi", "good", "to", "see", "you"], kurdish: "سڵاو، خۆشحاڵم بە بینینت" },
    ],
    fillBlanks: [
      { parts: ["", "there, what's up?"], hint: "سڵاو، چ باسە؟", answer: "Hey", wrongs: ["Bye", "Oh", "No"] },
      { parts: ["What's", "?"], hint: "چ باسە / چۆنی؟", answer: "up", wrongs: ["down", "new", "in"] },
    ],
    conversations: [
      { situation: "لە کۆڵاندا ئاشنایەکت دەبینیت", theyAsk: "Hey! Long time no see!", correct: "I know, right? How've you been?", wrong1: "Yeah, it's been a while.", wrong2: "Good to see you again. How have you been lately?", wrong3: "Hello. We have not seen each other in some time.", explanation: "وەڵامی گەرم: 'I know, right? How've you been?' — نەک تەنها دانپەدان بە کاتی دووربوون" },
      { situation: "یەکەم جار کەسێک لە کاردا دەبینیت", theyAsk: "Hey, I'm Alex — new here!", correct: "Oh nice! I'm Sam. Welcome to the team!", wrong1: "Hello. My name is Sam.", wrong2: "Welcome to the office, Alex.", wrong3: "Pleased to make your acquaintance, Alex.", explanation: "'Oh nice! I'm Sam. Welcome to the team!' — خۆت پێناسە بکە و بە گەرمی بەخێر بیهێنە" },
    ],
  },

  // Lesson 1: Saying Goodbye
  {
    topic: "Saying Goodbye", topicKu: "ماڵئاوایی کردن",
    words: [
      { english: "Goodbye", kurdish: "خوات لەگەڵ" },
      { english: "See you tomorrow", kurdish: "سبەی دەتبینمەوە" },
      { english: "Take care", kurdish: "ئاگات لە خۆت بێت" },
      { english: "I have to go", kurdish: "دەبێت بڕۆم" },
      { english: "Until next time", kurdish: "تا جارێکی تر" },
    ],
    voices: [
      { prompt: "خوات لەگەڵی گەرم بکە", target: "Catch you later man!", targetKurdish: "دواتر دەتبینمەوە براکە!" },
      { prompt: "خوات لەگەڵی ئارامانە بکە", target: "Take care, see you soon!", targetKurdish: "ئاگات لە خۆت بێت، زوو دەتبینمەوە!" },
    ],
    sentences: [
      { english: ["Catch", "you", "later", "man"], kurdish: "دواتر دەتبینمەوە براکە" },
      { english: ["Take", "care", "see", "you", "soon"], kurdish: "ئاگات لە خۆت بێت، زوو دەتبینمەوە" },
    ],
    fillBlanks: [
      { parts: ["Catch you", "!"], hint: "دواتر دەتبینمەوە!", answer: "later", wrongs: ["soon", "here", "next"] },
      { parts: ["Take", "everyone!"], hint: "ئاگاتان لە خۆتان بێت هەمووان", answer: "care", wrongs: ["note", "time", "it"] },
    ],
    conversations: [
      { situation: "ئامادەیت بۆ گەڕانەوە ماڵەوە", theyAsk: "Alright, I gotta head out.", correct: "Okay! Catch you later, take care!", wrong1: "Okay. Goodbye, and take care.", wrong2: "Farewell. I hope you have a safe journey.", wrong3: "I will see you again at a later date.", explanation: "'Catch you later, take care!' — کورت و ئینگلیزی ڕۆژانەیە بۆ ماڵئاوایی" },
    ],
  },

  // Lesson 2: How Are You
  {
    topic: "How Are You", topicKu: "حاڵ و ئەحواڵ پرسین",
    words: [
      { english: "Not bad", kurdish: "خراپ نیم" },
      { english: "Pretty good", kurdish: "زۆر باشم" },
      { english: "Could be worse", kurdish: "دەیتوانی خراپتریش بێت" },
      { english: "Living the dream", kurdish: "ژیانێکی شاز دەژیم" },
      { english: "Hanging in there", kurdish: "خۆم ڕاگرتووم" },
    ],
    voices: [
      { prompt: "وەڵامی 'چۆنی' بدەرەوە", target: "Not bad at all, thanks for asking!", targetKurdish: "هەرگیز خراپ نیم، سوپاس بۆ پرسینی حاڵم!" },
      { prompt: "بە گەرمی پێشوازی بکە", target: "Pretty good! How about you?", targetKurdish: "زۆر باشم! ئەی تۆ چۆنی؟" },
    ],
    sentences: [
      { english: ["Not", "bad", "at", "all"], kurdish: "بە هیچ شێوەیەک خراپ نیم" },
      { english: ["Pretty", "good", "how", "about", "you"], kurdish: "زۆر باشم، ئەی حاڵی تۆ چۆنە؟" },
    ],
    fillBlanks: [
      { parts: ["Not", "at all!"], hint: "هەرگیز خراپ نیم!", answer: "bad", wrongs: ["good", "well", "fine"] },
      { parts: ["Pretty", "! And you?"], hint: "زۆر باشم! ئەی تۆ؟", answer: "good", wrongs: ["bad", "okay", "fine"] },
    ],
    conversations: [
      { situation: "هاوکارێک حاڵیت دەپرسێت", theyAsk: "Hey, how are you doing today?", correct: "Honestly, pretty good! Had a great morning.", wrong1: "I am fine, thank you for asking.", wrong2: "My day is proceeding satisfactorily.", wrong3: "I am well. How are you doing?", explanation: "'Honestly, pretty good! Had a great morning.' — گەرم و سروشتی، نەک وەڵامی فەرمی" },
    ],
  },

  // Lesson 3: Introducing Yourself
  {
    topic: "Introducing Yourself", topicKu: "خۆت پێناسەکردن",
    words: [
      { english: "I'm from Kurdistan", kurdish: "من خەڵکی کوردستانم" },
      { english: "Nice to meet you", kurdish: "خۆشحاڵم بە ناسینت" },
      { english: "Just call me Alex", kurdish: "تەنها پێم بڵێ ئەلێکس" },
      { english: "I go by Alex", kurdish: "بە ئەلێکس بانگم دەکەن" },
      { english: "Originally from Spain", kurdish: "لە بنەڕەتدا خەڵکی ئیسپانیام" },
    ],
    voices: [
      { prompt: "خۆت پێناسەبکە", target: "Hey I'm Alex, nice to meet you!", targetKurdish: "سڵاو من ئەلێکسم، خۆشحاڵم بە ناسینت!" },
      { prompt: "شوێنی خۆت بڵێ", target: "I'm originally from Chicago", targetKurdish: "لە بنەڕەتدا من خەڵکی شیکاگۆم" },
    ],
    sentences: [
      { english: ["I'm", "Alex", "nice", "to", "meet", "you"], kurdish: "ئەلێکسم، خۆشحاڵم بە ناسینت" },
      { english: ["I'm", "originally", "from", "Chicago"], kurdish: "لە بنەڕەتدا من خەڵکی شیکاگۆم" },
    ],
    fillBlanks: [
      { parts: ["I'm originally from", ""], hint: "لە بنەڕەتدا من خەڵکی ئیسپانیام", answer: "Spain", wrongs: ["France", "Italy", "Mexico"] },
      { parts: ["Just", "me Alex"], hint: "تەنها پێم بڵێ ئەلێکس", answer: "call", wrongs: ["say", "name", "tell"] },
    ],
    conversations: [
      { situation: "لە ئاهەنگێکدا کەسێکی نوێ دەبینیت", theyAsk: "I don't think we've met — I'm Jordan!", correct: "Oh hey! I'm River, great to meet you!", wrong1: "Hello, Jordan. My name is River.", wrong2: "It is a pleasure to meet you, Jordan.", wrong3: "Greetings. I do not believe we have met.", explanation: "'Oh hey! I'm River, great to meet you!' — گەرم و کورت بۆ ناسین لە ئاهەنگدا" },
    ],
  },

  // Lesson 4: Compliments
  {
    topic: "Giving Compliments", topicKu: "پیاهەڵدان و دەستخۆشی",
    words: [
      { english: "You're killing it", kurdish: "زۆر شازت کرد" },
      { english: "That's fire", kurdish: "ئەوە زۆر شازە" },
      { english: "Looks good", kurdish: "جوان دیارە" },
      { english: "Well done", kurdish: "ئافەرین" },
      { english: "Props to you", kurdish: "دەستخۆشیت لێ دەکەم" },
    ],
    voices: [
      { prompt: "دەستخۆشییەکی گەرم بکە", target: "Dude you're absolutely killing it!", targetKurdish: "کابرا، بەڕاستی زۆر شاز دەکەیت!" },
      { prompt: "کارێک بەرز بنرخێنە", target: "That was seriously fire work", targetKurdish: "ئەوە بەڕاستی کارێکی شاز بوو" },
    ],
    sentences: [
      { english: ["You're", "absolutely", "killing", "it"], kurdish: "بەڕاستی زۆر شاز دەکەیت" },
      { english: ["That", "was", "seriously", "fire"], kurdish: "ئەوە بەڕاستی کارێکی شاز بوو" },
    ],
    fillBlanks: [
      { parts: ["You're", "it today!"], hint: "ئەمڕۆ زۆر شازت کردووە!", answer: "killing", wrongs: ["doing", "making", "having"] },
      { parts: ["That", "is absolutely on fire!"], hint: "ئەو جلوبەرگە بەڕاستی شازە!", answer: "outfit", wrongs: ["hairstyle", "vibe", "look"] },
    ],
    conversations: [
      { situation: "هاوڕێیەکت یەکەم کتێبی نووسیوە", theyAsk: "I just finished writing my first book!", correct: "No way! That's insane, props to you!", wrong1: "Congratulations. That is very impressive.", wrong2: "Well done on completing your book.", wrong3: "I am happy to hear about your success.", explanation: "'No way! That's insane, props to you!' — کاردانەوەی بەپەرۆش، نەک تەنها پیرۆزبایی فەرمی" },
    ],
  },

  // Lesson 5: Agreeing & Disagreeing
  {
    topic: "Agree & Disagree", topicKu: "هاوڕابوون و ڕەتکردنەوە",
    words: [
      { english: "Totally", kurdish: "سەد لە سەد" },
      { english: "No way", kurdish: "مەحاڵە" },
      { english: "I hear you", kurdish: "لێت تێدەگەم" },
      { english: "Fair enough", kurdish: "ڕاست دەکەیت" },
      { english: "I beg to differ", kurdish: "من جیاواز دەیبینم" },
    ],
    voices: [
      { prompt: "بە تەواوی هاوڕا بە", target: "Totally, I couldn't agree more", targetKurdish: "سەد لە سەد، تەواو هاوڕام لەگەڵت" },
      { prompt: "بە ئارامی ڕەتی بکەرەوە", target: "I hear you, but I see it differently", targetKurdish: "لێت تێدەگەم، بەڵام من جیاواز دەیبینم" },
    ],
    sentences: [
      { english: ["Totally", "I", "couldn't", "agree", "more"], kurdish: "سەد لە سەد، تەواو هاوڕام" },
      { english: ["I", "hear", "you", "but", "I", "disagree"], kurdish: "لێت تێدەگەم، بەڵام هاوڕا نیم" },
    ],
    fillBlanks: [
      { parts: ["", "I'm with you on that!"], hint: "بەتەواوی، من لەگەڵت دام لەسەر ئەوە!", answer: "Totally", wrongs: ["Maybe", "Barely", "Rarely"] },
      { parts: ["Fair", "I'll accept that"], hint: "ڕاست دەکەیت، ئەوەیان قبووڵ دەکەم", answer: "enough", wrongs: ["deal", "point", "game"] },
    ],
    conversations: [
      { situation: "لە گفتوگۆیەکی گروپدا", theyAsk: "I think we should just cancel the trip.", correct: "I hear you, but I think we can still make it work.", wrong1: "No. We should definitely not cancel.", wrong2: "I disagree. Canceling is a bad idea.", wrong3: "I understand, but I fully support canceling.", explanation: "'I hear you, but...' — ڕەتکردنەوەی نەرم: سەرەتا گوێ بگرە، دواتر بۆچوونەکەت بڵێ" },
    ],
  },

  // Lesson 6: Asking for Help
  {
    topic: "Asking for Help", topicKu: "داواکردنی یارمەتی",
    words: [
      { english: "Excuse me", kurdish: "لێم ببورە" },
      { english: "Could you", kurdish: "دەتوانیت" },
      { english: "Would you mind", kurdish: "پێت ناخۆش نابێت" },
      { english: "Any chance", kurdish: "هیچ ڕێگەیەک هەیە" },
      { english: "I was wondering", kurdish: "دەمویست بپرسم" },
    ],
    voices: [
      { prompt: "بەڕێزانە داوا بکە", target: "Excuse me, could you help me out?", targetKurdish: "لێم ببوورە، دەتوانیت یارمەتیم بدەیت؟" },
      { prompt: "داوایەکی نافەرمی بکە", target: "Any chance you could show me the way?", targetKurdish: "هیچ ڕێگەیەک هەیە ڕێگەم پێ نیشان بدەیت؟" },
    ],
    sentences: [
      { english: ["Excuse", "me", "could", "you", "help", "me"], kurdish: "لێم ببورە، دەتوانیت یارمەتیم بدەیت" },
      { english: ["Would", "you", "mind", "showing", "me the way"], kurdish: "پێت ناخۆش نابێت ڕێگەم پێ نیشان بدەیت" },
    ],
    fillBlanks: [
      { parts: ["", "me, where's the bathroom?"], hint: "لێم ببوورە، گەرماوەکە لە کوێیە؟", answer: "Excuse", wrongs: ["Sorry", "Pardon", "Wait"] },
      { parts: ["Would you", "showing me around?"], hint: "پێت ناخۆش نابێت بمگەڕێنیت؟", answer: "mind", wrongs: ["care", "help", "like"] },
    ],
    conversations: [
      { situation: "لە شارێکی نوێدا ونبوویت", theyAsk: "Hey, are you lost?", correct: "Kind of! Any chance you know where the subway is?", wrong1: "Yes. Where is the subway station, please?", wrong2: "I am lost. Could you provide directions?", wrong3: "Please assist me. I cannot locate the subway.", explanation: "'Kind of! Any chance you know where the subway is?' — نەرم و سروشتی بۆ داوای یارمەتی" },
    ],
  },

  // Lesson 7: Small Talk
  {
    topic: "Small Talk", topicKu: "قسەکردنی کورت (دەستپێکی گفتوگۆ)",
    words: [
      { english: "Nice weather", kurdish: "کەشوهەوایەکی خۆشە" },
      { english: "What's new", kurdish: "چی نوێ هەیە" },
      { english: "Been up to much", kurdish: "سەرقاڵی چیت؟" },
      { english: "Same old", kurdish: "وەک هەمیشە" },
      { english: "Can't complain", kurdish: "ناتوانم گلەیی بکەم (زۆر باشم)" },
    ],
    voices: [
      { prompt: "گفتوگۆ دەستپێبکە", target: "So what have you been up to lately?", targetKurdish: "بەڕاست ماوەی ئەم دواییە سەرقاڵی چی بوویت؟" },
      { prompt: "وەڵامێکی ئاسایی بدەرەوە", target: "Can't complain, same old same old", targetKurdish: "گلەیی ناکەم، هەمان شتی باو و هەمیشەییە" },
    ],
    sentences: [
      { english: ["So", "what", "have", "you", "been", "up", "to"], kurdish: "باشە ماوەی ئەم دواییە سەرقاڵی چی بوویت؟" },
      { english: ["Can't", "complain", "same", "old", "same", "old"], kurdish: "ناتوانم گلەیی بکەم، هەمان دووبارەی هەمیشەیە" },
    ],
    fillBlanks: [
      { parts: ["What's", "with you lately?"], hint: "چی نوێ هەیە لات بەم دواییانە؟", answer: "new", wrongs: ["up", "happening", "going"] },
      { parts: ["Can't", ", everything's good!"], hint: "ناتوانم گلەیی بکەم، هەموو شتێک باشە!", answer: "complain", wrongs: ["lie", "say", "talk"] },
    ],
    conversations: [
      { situation: "لە شوێنی کار ناسیاوێک دەبینیت", theyAsk: "Hey, haven't seen you in a while! How's everything?", correct: "Can't complain! Things are good — been pretty busy actually.", wrong1: "Everything is fine. Thank you for asking.", wrong2: "My circumstances are satisfactory at present.", wrong3: "I have been occupied with work recently.", explanation: "'Can't complain! Been pretty busy actually.' — وەڵامی گفتوگۆی کورت و باو" },
    ],
  },

  // Lesson 8: Reactions
  {
    topic: "Reactions & Expressions", topicKu: "کاردانەوە و دەربڕینەکان",
    words: [
      { english: "No way", kurdish: "نەخێر باوەڕ ناکەم" },
      { english: "Oh snap", kurdish: "ئەی وەی" },
      { english: "Seriously", kurdish: "بەڕاست؟" },
      { english: "That's wild", kurdish: "ئەوە شێتانەیە" },
      { english: "I can't even", kurdish: "مێشکم نایبڕێت" },
    ],
    voices: [
      { prompt: "سەرسوڕمان پێشان بدە", target: "No way, are you serious right now?", targetKurdish: "باوەڕ ناکەم، بەڕاستتە ئێستا؟" },
      { prompt: "کاردانەوەیەکی سەرسوڕهێنەر پێشان بدە", target: "Oh snap, that's absolutely wild!", targetKurdish: "ئەی وەی، ئەوە بەتەواوی شێتانەیە!" },
    ],
    sentences: [
      { english: ["No", "way", "are", "you", "serious"], kurdish: "نەخێر باوەڕ ناکەم، بەڕاستتە؟" },
      { english: ["Oh", "snap", "that's", "absolutely", "wild"], kurdish: "ئەی وەی، ئەوە بەتەواوی شێتانەیە" },
    ],
    fillBlanks: [
      { parts: ["", ", I can't believe it!"], hint: "نەخێر باوەڕ ناکەم، ناتوانم بڕوا بکەم!", answer: "No way", wrongs: ["Really", "Wow", "Sure"] },
      { parts: ["That's", "! I had no idea!"], hint: "ئەوە شێتانەیە! هیچ زانیاریم لێ نەبوو!", answer: "wild", wrongs: ["crazy", "bad", "good"] },
    ],
    conversations: [
      { situation: "هاوڕێیەک هەواڵێکی سەیرت پێ دەدات", theyAsk: "I just won a free trip to Japan!", correct: "No way! Oh snap, you're so lucky!", wrong1: "Congratulations on winning the trip.", wrong2: "That sounds like a wonderful prize.", wrong3: "I am pleased that you won a vacation.", explanation: "'No way! Oh snap, you're so lucky!' — کاردانەوەی سەرسوڕهێنەر، نەک تەنها پیرۆزبایی فەرمی" },
    ],
  },

  // Lesson 9: Asking for Opinions
  {
    topic: "Asking Opinions", topicKu: "پرسین بەدوای بۆچووندا",
    words: [
      { english: "What do you think", kurdish: "تۆ چی دەڵێیت؟" },
      { english: "In your opinion", kurdish: "بەلای تۆوە" },
      { english: "How do you feel", kurdish: "هەستت چۆنە" },
      { english: "Take on this", kurdish: "تێڕوانینت بۆ ئەمە" },
      { english: "Your two cents", kurdish: "بۆچوونی تۆ (ڕای کەم)" },
    ],
    voices: [
      { prompt: "ڕای کەسێک بپرسە بە جدی", target: "What do you honestly think about this?", targetKurdish: "بە ڕاستی ڕای تۆ لەسەر ئەمە چییە؟" },
      { prompt: "داوای تێڕوانین بکە", target: "I'd love to hear your take on this", targetKurdish: "حەز دەکەم تێڕوانینی تۆ بۆ ئەمە بزانم" },
    ],
    sentences: [
      { english: ["What", "do", "you", "honestly", "think"], kurdish: "بە ڕاستی پێت وایە چی؟" },
      { english: ["I'd", "love", "to", "hear", "your", "take"], kurdish: "حەز دەکەم تێڕوانینی تۆ ببیستم" },
    ],
    fillBlanks: [
      { parts: ["What", "you think about this?"], hint: "تۆ چی دەڵێیت دەربارەی ئەمە؟", answer: "do", wrongs: ["are", "is", "can"] },
      { parts: ["I'd", "your two cents on this!"], hint: "حەز دەکەم بۆچوونی تۆ لەسەر ئەمە بزانم!", answer: "love", wrongs: ["like", "want", "need"] },
    ],
    conversations: [
      { situation: "گفتوگۆ دەکەیت دەربارەی پلانێک", theyAsk: "So, what's your take on the new plan?", correct: "Honestly? I think it could work but we need to iron out a few things.", wrong1: "I think the plan is completely perfect.", wrong2: "The plan will not work at all.", wrong3: "I have no opinion about the plan.", explanation: "'Honestly? It could work but we need to iron out a few things.' — بۆچوونێکی هاوسەنگ و سروشتی" },
    ],
  },
];

export default unit00;
