import { UnitBank } from "../types";

// ── Unit 0: Street Greetings — 10 unique lessons ──────────────────────────────
const unit00: UnitBank = [

  // Lesson 0: Basic Greetings
  {
    topic: "Basic Greetings", topicKu: "سڵاوی سەرەکی",
    words: [
      { english: "Hey", kurdish: "سڵاو" },
      { english: "Hi", kurdish: "هەلۆ" },
      { english: "Hello", kurdish: "سڵاو (فەرمی)" },
      { english: "What's up", kurdish: "چ باسە / چۆنی" },
      { english: "Yo", kurdish: "چاکیت (نافەرمی)" },
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
      { situation: "لەسەر کوچەی ئاشنایەکت دەبینیت", theyAsk: "Hey! Long time no see!", correct: "I know, right? How've you been?", wrong1: "Yes it has been a while.", wrong2: "Hello I have not seen you.", wrong3: "Greetings, time has passed.", explanation: "'I know, right? How've you been?' ئینگلیزییەکی سروشتی و گەرمە" },
      { situation: "یەکەم جار کەسێک لە کار دەبینی", theyAsk: "Hey, I'm Alex — new here!", correct: "Oh nice! I'm Sam. Welcome to the team!", wrong1: "I am Sam, hello.", wrong2: "My name is Sam, welcome.", wrong3: "Hello Alex pleased to meet you.", explanation: "'Oh nice! I'm Sam. Welcome to the team!' بەخێرهێنانێکی گەرم و کەسایەتییە" },
    ],
  },

  // Lesson 1: Saying Goodbye
  {
    topic: "Saying Goodbye", topicKu: "ماڵئاوایی کردن",
    words: [
      { english: "Catch you later", kurdish: "دواتر دەتبینمەوە" },
      { english: "Take care", kurdish: "ئاگات لە خۆت بێت" },
      { english: "See you around", kurdish: "دەتبینمەوە لەم نزیکانە" },
      { english: "Peace out", kurdish: "خوات لەگەڵ (نافەرمی)" },
      { english: "Gotta run", kurdish: "دەبێت بڕۆم" },
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
      { situation: "ئامادەی بۆ چوونە ماڵەوە", theyAsk: "Alright, I gotta head out.", correct: "Okay! Catch you later, take care!", wrong1: "Okay goodbye please take care.", wrong2: "Farewell, I hope you are well.", wrong3: "Okay see you in the future.", explanation: "'Catch you later, take care!' بە تەواوی ئینگلیزی باو و ڕۆژانەیە" },
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
      { english: "Hanging in there", kurdish: "خۆم ڕاگرتووە / بەرگە دەگرم" },
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
      { situation: "هاوکارێک حاڵت دەپرسێت", theyAsk: "Hey, how are you doing today?", correct: "Honestly, pretty good! Had a great morning.", wrong1: "I am doing fine thank you.", wrong2: "My status is good today.", wrong3: "Quite well, I am functioning correctly.", explanation: "'Honestly, pretty good!' وەڵامێکی ئینگلیزی گەرم و زۆر سروشتییە" },
    ],
  },

  // Lesson 3: Introducing Yourself
  {
    topic: "Introducing Yourself", topicKu: "خۆت پێناسەکردن",
    words: [
      { english: "I'm from", kurdish: "من خەڵکی..." },
      { english: "Nice to meet", kurdish: "خۆشحاڵم بە ناسینت" },
      { english: "Call me", kurdish: "پێم بڵێ بانگم بکە" },
      { english: "I go by", kurdish: "بە ... بانگم دەکەن" },
      { english: "Originally", kurdish: "لە بنەڕەتدا" },
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
      { parts: ["I'm", "originally from Spain"], hint: "لە بنەڕەتدا من خەڵکی ئیسپانیام", answer: "actually", wrongs: ["really", "just", "born"] },
      { parts: ["Just", "me Alex"], hint: "تەنها پێم بڵێ ئەلێکس", answer: "call", wrongs: ["say", "name", "tell"] },
    ],
    conversations: [
      { situation: "لە ئاهەنگێکدا کەسێک ئاشنا دەبیت", theyAsk: "I don't think we've met — I'm Jordan!", correct: "Oh hey! I'm River, great to meet you!", wrong1: "Hello Jordan my name is River.", wrong2: "I am River, pleased to meet you.", wrong3: "Greetings, I have not met you before.", explanation: "'Oh hey! Great to meet you!' زۆر گەرم و سروشتییە لە ناسیندا" },
    ],
  },

  // Lesson 4: Compliments
  {
    topic: "Giving Compliments", topicKu: "پیاهەڵدان و دەستخۆشی",
    words: [
      { english: "You're killing it", kurdish: "زۆر شازت کرد" },
      { english: "That's fire", kurdish: "ئەوە زۆر شازە" },
      { english: "Looks good", kurdish: "جوان دیارە / خۆش دیارە" },
      { english: "Well done", kurdish: "ئافەرین / دەستخۆش" },
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
      { parts: ["That", "is absolutely fire!"], hint: "ئەو جلوبەرگە بەڕاستی شازە!", answer: "outfit", wrongs: ["work", "thing", "style"] },
    ],
    conversations: [
      { situation: "هاوڕێیەکت یەکەم کتێبی نووسی", theyAsk: "I just finished writing my first book!", correct: "No way! That's insane, props to you!", wrong1: "Congratulations that is very good.", wrong2: "Well done on your achievement.", wrong3: "I am happy for your success.", explanation: "'No way! Props to you!' دەربڕینێکی ئینگلیزی زۆر زیندوو و هاندەرانەیە" },
    ],
  },

  // Lesson 5: Agreeing & Disagreeing
  {
    topic: "Agree & Disagree", topicKu: "هاوڕابوون و ڕەتکردنەوە",
    words: [
      { english: "Totally", kurdish: "سەد لە سەد / بەتەواوی" },
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
      { situation: "لە گفتوگۆیەکی گروپیدا", theyAsk: "I think we should just cancel the trip.", correct: "I hear you, but I think we can still make it work.", wrong1: "No we should not cancel it.", wrong2: "I disagree with your cancellation idea.", wrong3: "Your opinion is noted but incorrect.", explanation: "'I hear you, but' ڕەتکردنەوەیەکی ئینگلیزی زۆر بەئاداب و بەڕێزانەیە" },
    ],
  },

  // Lesson 6: Asking for Help
  {
    topic: "Asking for Help", topicKu: "داواکردنی یارمەتی",
    words: [
      { english: "Excuse me", kurdish: "لێم ببورە / ببوورە" },
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
      { situation: "ونبوویت لە شارێکی نوێ", theyAsk: "Hey, are you lost?", correct: "Kind of! Any chance you know where the subway is?", wrong1: "Yes I am lost please help.", wrong2: "I require directions to subway.", wrong3: "Affirmative, I cannot find my way.", explanation: "'Kind of! Any chance...' داواکارییەکی زۆر ئاسان و نەرمە بۆ یارمەتی" },
    ],
  },

  // Lesson 7: Small Talk
  {
    topic: "Small Talk", topicKu: "قسەکردنی کورت (دەستپێکی گفتوگۆ)",
    words: [
      { english: "Nice weather", kurdish: "کەشوهەوایەکی خۆشە" },
      { english: "What's new", kurdish: "چی نوێ هەیە / چ باسە" },
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
      { situation: "ناسیاوێک دەبینیت لە شوێنی کار", theyAsk: "Hey, haven't seen you in a while! How's everything?", correct: "Can't complain! Things are good — been pretty busy actually.", wrong1: "Things are fine thank you.", wrong2: "My situation is acceptable.", wrong3: "Everything is functioning normally.", explanation: "'Can't complain! Things are good' وەڵامێکی زۆر باو و ڕاستەقینەیە" },
    ],
  },

  // Lesson 8: Reactions
  {
    topic: "Reactions & Expressions", topicKu: "کاردانەوە و دەربڕینەکان",
    words: [
      { english: "No way", kurdish: "نەخێر باوەڕ ناکەم" },
      { english: "Oh snap", kurdish: "ئەی وەی" },
      { english: "Seriously", kurdish: "بەڕاست؟ / بەجدی؟" },
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
      { situation: "هاوڕێیەک هەواڵێکی سەیرت پێ دەدات", theyAsk: "I just won a free trip to Japan!", correct: "No way! Oh snap, you're so lucky!", wrong1: "Congratulations on winning.", wrong2: "That is a good prize.", wrong3: "I am happy you received the trip.", explanation: "'No way! Oh snap!' کاردانەوەیەکی زۆر زیندوو و پڕ وزەیە" },
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
      { situation: "گفتوگۆکردن سەبارەت بە پلانێک", theyAsk: "So, what's your take on the new plan?", correct: "Honestly? I think it could work but we need to iron out a few things.", wrong1: "The plan is good I think.", wrong2: "My opinion is it could work.", wrong3: "I believe the plan has potential areas.", explanation: "'Honestly? I think it could work but...' دەربڕینێکی ئینگلیزی زۆر دروست و پێگەیشتووە" },
    ],
  },
];

export default unit00;
