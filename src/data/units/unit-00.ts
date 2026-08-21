import { UnitBank } from "../types";

// ── Unit 0: Street Greetings — 10 unique lessons ──────────────────────────────
const unit00: UnitBank = [

  // Lesson 0: Greetings & Meeting People
  {
    topic: "Greetings", topicKu: "سڵاوکردن",
    words: [
      { english: "What's good?", kurdish: "سڵاو / چۆنی؟" },
      { english: "Morning", kurdish: "بەیانیت باش" },
      { english: "How's it going?", kurdish: "چۆنی؟" },
      { english: "I'm good, you?", kurdish: "باشم، ئەی تۆ؟" },
      { english: "Good to meet you", kurdish: "خۆشحاڵم بە ناسینت" },
    ],
    voices: [
      { prompt: "بڵێ: سڵاو، چۆنی؟", target: "What's good? How's it going?", targetKurdish: "سڵاو، چۆنی؟" },
      { prompt: "بڵێ: باشم، سوپاس", target: "I'm doing good, thanks.", targetKurdish: "باشم، سوپاس." },
    ],
    sentences: [
      { english: ["What's", "good", "how's", "it", "going"], kurdish: "سڵاو، چۆنی؟" },
      { english: ["I'm", "doing", "good", "thanks"], kurdish: "باشم، سوپاس" },
    ],
    fillBlanks: [
      { parts: ["What's", "?"], hint: "چۆنی (سڵاوی نافەرمی)", answer: "good", wrongs: ["banana", "jump", "blue"] },
      { parts: ["I'm doing", ", thanks"], hint: "باشم، سوپاس", answer: "good", wrongs: ["shoe", "sadly", "cloud"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک سڵاوت لێ دەکات و دەپرسێت چۆنی",
        theyAsk: "Hey! How's it going?",
        correct: "I'm doing good! What about you?",
        wrong1: "I am going to the potato.",
        wrong2: "Fine dog is running.",
        wrong3: "Me is doing the goodest.",
        explanation: "وەڵامێکی ئاسایی ڕۆژانە: 'I'm doing good! What about you?' — وەڵامەکانی تر بێمانان یان هەڵەی ڕێزمانین.",
      },
      {
        situation: "کەسێکی نوێ دەناسیت و خۆی پێناسە دەکات",
        theyAsk: "Hey, I'm Sara. Good to meet you!",
        correct: "Good to meet you too, Sara! I'm Karwan.",
        wrong1: "Meet you nice tomato.",
        wrong2: "I am Sara too from moon.",
        wrong3: "Meeting is good pencil.",
        explanation: "وەڵامێکی سروشتی بۆ ناسین: 'Good to meet you too, Sara! I'm Karwan.' — وەڵامەکانی تر بەتەواوی بێمانان.",
      },
    ],
  },

  // Lesson 1: Saying Goodbye
  {
    topic: "Saying Goodbye", topicKu: "ماڵئاوایی کردن",
    words: [
      { english: "Catch you later", kurdish: "دواتر دەتبینمەوە" },
      { english: "I gotta run", kurdish: "دەبێت بڕۆم" },
      { english: "See ya", kurdish: "دەتبینمەوە" },
      { english: "Have a good one", kurdish: "ڕۆژێکی خۆش" },
      { english: "Take it easy", kurdish: "ئاگات لە خۆت بێت" },
    ],
    voices: [
      { prompt: "بڵێ: دەبێت بڕۆم، دەتبینمەوە", target: "I gotta run, see ya!", targetKurdish: "دەبێت بڕۆم، دەتبینمەوە!" },
      { prompt: "بڵێ: ئاگات لە خۆت بێت، ڕۆژێکی خۆشت هەبێت", target: "Take it easy, have a good one!", targetKurdish: "ئاگات لە خۆت بێت، ڕۆژێکی خۆشت هەبێت!" },
    ],
    sentences: [
      { english: ["Catch", "you", "later"], kurdish: "دواتر دەتبینمەوە" },
      { english: ["Have", "a", "good", "one"], kurdish: "ڕۆژێکی خۆشت هەبێت" },
    ],
    fillBlanks: [
      { parts: ["Catch you", ""], hint: "دواتر دەتبینمەوە", answer: "later", wrongs: ["apple", "chair", "sleep"] },
      { parts: ["Take it", ""], hint: "ئاگات لە خۆت بێت", answer: "easy", wrongs: ["hard", "car", "purple"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەڵێت دەبێت بڕوات",
        theyAsk: "I gotta run. See ya!",
        correct: "Alright, catch you later!",
        wrong1: "Running is for shoes.",
        wrong2: "I accept the see.",
        wrong3: "Bye bye airplane fly.",
        explanation: "وەڵامێکی ئاسایی بۆ ماڵئاوایی: 'Alright, catch you later!'",
      },
      {
        situation: "لە کۆتایی ڕۆژدا ماڵئاوایی دەکەیت",
        theyAsk: "Have a good one!",
        correct: "You too, take it easy!",
        wrong1: "I will have two good.",
        wrong2: "The sun is green.",
        wrong3: "You take hard the one.",
        explanation: "وەڵامێکی سروشتی: 'You too, take it easy!'",
      },
    ],
  },

  // Lesson 2: How Are You
  {
    topic: "How Are You", topicKu: "حاڵ و ئەحواڵ پرسین",
    words: [
      { english: "Can't complain", kurdish: "ناتوانم گلەیی بکەم (زۆر باشم)" },
      { english: "I'm beat", kurdish: "زۆر ماندووم" },
      { english: "Been better", kurdish: "دەمتوانی باشتر بم" },
      { english: "Same old", kurdish: "وەک هەمیشە" },
      { english: "Hanging in there", kurdish: "خۆم ڕاگرتووم" },
    ],
    voices: [
      { prompt: "وەڵامی 'چۆنی' بدەرەوە", target: "Can't complain, how about you?", targetKurdish: "زۆر باشم، ئەی تۆ چۆنی؟" },
      { prompt: "بڵێ زۆر ماندووم", target: "Honestly, I'm pretty beat.", targetKurdish: "بەڕاستی، زۆر ماندووم." },
    ],
    sentences: [
      { english: ["Can't", "complain", "how", "about", "you"], kurdish: "باشم، ئەی تۆ چۆنی؟" },
      { english: ["Honestly", "I'm", "pretty", "beat"], kurdish: "بەڕاستی، زۆر ماندووم" },
    ],
    fillBlanks: [
      { parts: ["Can't", "!"], hint: "ناتوانم گلەیی بکەم (زۆر باشم)!", answer: "complain", wrongs: ["eat", "table", "sing"] },
      { parts: ["I'm pretty", "today."], hint: "ئەمڕۆ زۆر ماندووم.", answer: "beat", wrongs: ["window", "book", "sky"] },
    ],
    conversations: [
      {
        situation: "هاوکارێک حاڵیت دەپرسێت",
        theyAsk: "Hey, how's it going?",
        correct: "Can't complain! What about you?",
        wrong1: "I am go to the water.",
        wrong2: "Yes dog is loud.",
        wrong3: "The fine is am.",
        explanation: "وەڵامێکی باو: 'Can't complain! What about you?'",
      },
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
      { parts: ["I'm originally from", ""], hint: "لە بنەڕەتدا من خەڵکی ئیسپانیام", answer: "Spain", wrongs: ["cat", "blue", "run"] },
      { parts: ["Just", "me Alex"], hint: "تەنها پێم بڵێ ئەلێکس", answer: "call", wrongs: ["jump", "door", "pizza"] },
    ],
    conversations: [
      {
        situation: "لە ئاهەنگێکدا کەسێکی نوێ دەبینیت",
        theyAsk: "I don't think we've met — I'm Jordan!",
        correct: "Oh hey! I'm River, good to meet you!",
        wrong1: "The meet is potato.",
        wrong2: "I am River water swimming.",
        wrong3: "Yes Jordan basketball shoe.",
        explanation: "وەڵامی ڕاست: 'Oh hey! I'm River, good to meet you!'",
      },
    ],
  },

  // Lesson 4: Compliments
  {
    topic: "Giving Compliments", topicKu: "پیاهەڵدان و دەستخۆشی",
    words: [
      { english: "You're killing it", kurdish: "زۆر شازت کرد" },
      { english: "That's fire", kurdish: "ئەوە زۆر شازە" },
      { english: "Looks dope", kurdish: "زۆر جوانە" },
      { english: "Nailed it", kurdish: "پێکتایپاند (زۆرت باش کرد)" },
      { english: "Props to you", kurdish: "دەستخۆشیت لێ دەکەم" },
    ],
    voices: [
      { prompt: "دەستخۆشییەکی گەرم بکە", target: "Dude, you're absolutely killing it!", targetKurdish: "کابرا، بەڕاستی زۆر شاز دەکەیت!" },
      { prompt: "کارێک بەرز بنرخێنە", target: "That is seriously fire.", targetKurdish: "ئەوە بەڕاستی شازە." },
    ],
    sentences: [
      { english: ["You're", "absolutely", "killing", "it"], kurdish: "بەڕاستی زۆر شاز دەکەیت" },
      { english: ["That", "is", "seriously", "fire"], kurdish: "ئەوە بەڕاستی شازە" },
    ],
    fillBlanks: [
      { parts: ["You're", "it today!"], hint: "ئەمڕۆ زۆر شازت کردووە!", answer: "killing", wrongs: ["eating", "shoeing", "sleeping"] },
      { parts: ["That", "is absolutely fire!"], hint: "ئەو جلوبەرگە بەڕاستی شازە!", answer: "outfit", wrongs: ["moon", "water", "sad"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت یەکەم کتێبی نووسیوە",
        theyAsk: "I just finished writing my first book!",
        correct: "No way! That's insane, props to you!",
        wrong1: "The book reads banana.",
        wrong2: "I am write pen table.",
        wrong3: "Congratulations paper.",
        explanation: "دەستخۆشییەکی گەرم: 'No way! That's insane, props to you!'",
      },
    ],
  },

  // Lesson 5: Agreeing & Disagreeing
  {
    topic: "Agree & Disagree", topicKu: "هاوڕابوون و ڕەتکردنەوە",
    words: [
      { english: "Say less", kurdish: "تەواو (پێویست ناکات زیاتر بڵێیت)" },
      { english: "No cap", kurdish: "بەڕاستمە / بێ درۆ" },
      { english: "I feel you", kurdish: "لە هەستت تێدەگەم" },
      { english: "Fair enough", kurdish: "ڕاست دەکەیت" },
      { english: "Not gonna lie", kurdish: "درۆ ناکەم" },
    ],
    voices: [
      { prompt: "بە تەواوی هاوڕا بە", target: "Say less, I'm totally down.", targetKurdish: "تەواو، من سەد لە سەد ڕازیم." },
      { prompt: "بە ئارامی ڕەتی بکەرەوە", target: "I feel you, but not gonna lie, I disagree.", targetKurdish: "لێت تێدەگەم، بەڵام درۆ ناکەم، هاوڕا نیم." },
    ],
    sentences: [
      { english: ["Say", "less", "I'm", "totally", "down"], kurdish: "تەواو، من سەد لە سەد ڕازیم" },
      { english: ["I", "feel", "you", "but", "no", "cap"], kurdish: "لێت تێدەگەم، بەڵام بەڕاستمە" },
    ],
    fillBlanks: [
      { parts: ["Say", ", I'm with you!"], hint: "تەواو، من لەگەڵتدام!", answer: "less", wrongs: ["more", "chicken", "lamp"] },
      { parts: ["Fair", ", I'll accept that."], hint: "ڕاست دەکەیت، ئەوەیان قبووڵ دەکەم.", answer: "enough", wrongs: ["car", "jump", "blue"] },
    ],
    conversations: [
      {
        situation: "لە گفتوگۆیەکی گروپدا",
        theyAsk: "I think we should just order pizza.",
        correct: "Say less, I'm starving.",
        wrong1: "Pizza is a triangle circle.",
        wrong2: "I disagree with the car.",
        wrong3: "Order the sky please.",
        explanation: "کاردانەوەی ئەرێنی و باو: 'Say less, I'm starving.'",
      },
    ],
  },

  // Lesson 6: Asking for Help
  {
    topic: "Asking for Help", topicKu: "داواکردنی یارمەتی",
    words: [
      { english: "My bad", kurdish: "هەڵەی من بوو / لێم ببورە" },
      { english: "Can you do me a solid?", kurdish: "دەتوانیت چاکەیەکم لەگەڵ بکەیت؟" },
      { english: "Give me a hand", kurdish: "یارمەتیم بدە" },
      { english: "Any chance", kurdish: "هیچ ڕێگەیەک هەیە" },
      { english: "I'm stuck", kurdish: "گیریم خواردووە" },
    ],
    voices: [
      { prompt: "داوای چاکەیەک بکە", target: "Hey, can you do me a solid?", targetKurdish: "سڵاو، دەتوانیت چاکەیەکم لەگەڵ بکەیت؟" },
      { prompt: "داوایەکی نافەرمی بکە", target: "Any chance you could give me a hand?", targetKurdish: "هیچ ڕێگەیەک هەیە یارمەتیم بدەیت؟" },
    ],
    sentences: [
      { english: ["Can", "you", "do", "me", "a", "solid"], kurdish: "دەتوانیت چاکەیەکم لەگەڵ بکەیت" },
      { english: ["Any", "chance", "you", "could", "give", "me", "a", "hand"], kurdish: "هیچ ڕێگەیەک هەیە یارمەتیم بدەیت" },
    ],
    fillBlanks: [
      { parts: ["Can you do me a", "?"], hint: "دەتوانیت چاکەیەکم لەگەڵ بکەیت؟", answer: "solid", wrongs: ["liquid", "cat", "run"] },
      { parts: ["Any", "you can help?"], hint: "هیچ ڕێگەیەک هەیە یارمەتی بدەیت؟", answer: "chance", wrongs: ["dog", "green", "pizza"] },
    ],
    conversations: [
      {
        situation: "لە کارێکدا گیریت خواردووە",
        theyAsk: "Hey, do you need help with that?",
        correct: "Yeah actually, I'm completely stuck. Can you give me a hand?",
        wrong1: "I need a foot.",
        wrong2: "The hand is yellow.",
        wrong3: "Yes solid water help.",
        explanation: "داوای یارمەتی بە شێوەیەکی باو: 'Yeah actually, I'm completely stuck. Can you give me a hand?'",
      },
    ],
  },

  // Lesson 7: Small Talk
  {
    topic: "Small Talk", topicKu: "قسەکردنی کورت (دەستپێکی گفتوگۆ)",
    words: [
      { english: "What's good?", kurdish: "چی هەیە؟ / چۆنی؟" },
      { english: "Not much", kurdish: "هیچی وا نا" },
      { english: "Been up to much?", kurdish: "سەرقاڵی چیت؟" },
      { english: "Just chilling", kurdish: "تەنها پشوودەدەم" },
      { english: "Same old", kurdish: "وەک هەمیشە" },
    ],
    voices: [
      { prompt: "گفتوگۆ دەستپێبکە", target: "So, been up to much lately?", targetKurdish: "بەڕاست ماوەی ئەم دواییە سەرقاڵی چی بوویت؟" },
      { prompt: "وەڵامێکی ئاسایی بدەرەوە", target: "Not much, just chilling.", targetKurdish: "هیچی وا نا، تەنها پشوودەدەم." },
    ],
    sentences: [
      { english: ["So", "been", "up", "to", "much", "lately"], kurdish: "بەڕاست ماوەی ئەم دواییە سەرقاڵی چی بوویت؟" },
      { english: ["Not", "much", "just", "chilling"], kurdish: "هیچی وا نا، تەنها پشوودەدەم" },
    ],
    fillBlanks: [
      { parts: ["Not much, just", "."], hint: "هیچی وا نا، تەنها پشوودەدەم.", answer: "chilling", wrongs: ["flying", "chairing", "blueing"] },
      { parts: ["Been up to", "lately?"], hint: "بەمدواییانە سەرقاڵی چیت؟", answer: "much", wrongs: ["apple", "jump", "sad"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەبینیت",
        theyAsk: "Hey! What's good? Been up to much?",
        correct: "Not much, just chilling at home.",
        wrong1: "I am up to the ceiling.",
        wrong2: "Good is potato.",
        wrong3: "Much to the running shoe.",
        explanation: "وەڵامێکی زۆر باو بۆ چی دەکەیت: 'Not much, just chilling at home.'",
      },
    ],
  },

  // Lesson 8: Reactions
  {
    topic: "Reactions & Expressions", topicKu: "کاردانەوە و دەربڕینەکان",
    words: [
      { english: "No shot", kurdish: "مەحاڵە / باوەڕ ناکەم" },
      { english: "That's wild", kurdish: "ئەوە شێتانەیە" },
      { english: "Driving me nuts", kurdish: "شێتم دەکات" },
      { english: "For real?", kurdish: "بەڕاست؟" },
      { english: "I'm dead", kurdish: "مردم لە پێکەنینا" },
    ],
    voices: [
      { prompt: "سەرسوڕمان پێشان بدە", target: "No shot, are you for real?", targetKurdish: "باوەڕ ناکەم، بەڕاستتە؟" },
      { prompt: "بڵێ شتێک بێزارت دەکات", target: "This is seriously driving me nuts.", targetKurdish: "ئەمە بەڕاستی شێتم دەکات." },
    ],
    sentences: [
      { english: ["No", "shot", "are", "you", "for", "real"], kurdish: "باوەڕ ناکەم، بەڕاستتە؟" },
      { english: ["This", "is", "driving", "me", "nuts"], kurdish: "ئەمە شێتم دەکات" },
    ],
    fillBlanks: [
      { parts: ["Are you for", "?"], hint: "بەڕاستتە؟", answer: "real", wrongs: ["fake", "shoe", "jump"] },
      { parts: ["This is driving me", "!"], hint: "ئەمە شێتم دەکات!", answer: "nuts", wrongs: ["cars", "apples", "blue"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک هەواڵێکی سەیرت پێ دەدات",
        theyAsk: "I just saw a monkey driving a car!",
        correct: "No shot! Are you for real?",
        wrong1: "The monkey is eat banana.",
        wrong2: "Driving the nuts car.",
        wrong3: "I am dead monkey.",
        explanation: "کاردانەوەی سەرسوڕمان: 'No shot! Are you for real?'",
      },
    ],
  },

  // Lesson 9: Asking for Opinions
  {
    topic: "Asking Opinions", topicKu: "پرسین بەدوای بۆچووندا",
    words: [
      { english: "What's the vibe?", kurdish: "هەست و کەشەکە چۆنە؟" },
      { english: "Your take?", kurdish: "تێڕوانینت؟" },
      { english: "How do you feel", kurdish: "هەستت چۆنە" },
      { english: "Thoughts?", kurdish: "بۆچوونەکانت؟" },
      { english: "We rocking with this?", kurdish: "ئەمەمان بەدڵە؟ (ڕازین پێی؟)" },
    ],
    voices: [
      { prompt: "بپرسە ئایا کەشەکە باشە", target: "What's the vibe here, we rocking with this?", targetKurdish: "کەشەکە لێرە چۆنە، ئێمە ئەمەمان بەدڵە؟" },
      { prompt: "داوای تێڕوانین بکە", target: "I need your take on this.", targetKurdish: "پێویستم بە تێڕوانینی تۆیە لەسەر ئەمە." },
    ],
    sentences: [
      { english: ["What's", "the", "vibe", "here"], kurdish: "کەشەکە لێرە چۆنە" },
      { english: ["Are", "we", "rocking", "with", "this"], kurdish: "ئێمە ئەمەمان بەدڵە؟" },
    ],
    fillBlanks: [
      { parts: ["What's the", "today?"], hint: "ئەمڕۆ کەشەکە چۆنە؟", answer: "vibe", wrongs: ["rock", "shoe", "jump"] },
      { parts: ["Are we", "with this plan?"], hint: "بەدڵمانە ئەم پلانە؟", answer: "rocking", wrongs: ["sleeping", "eating", "clouding"] },
    ],
    conversations: [
      {
        situation: "پرسیار دەربارەی شوێنێک دەکەیت",
        theyAsk: "So, what's the vibe of this place? We rocking with it?",
        correct: "Yeah, it's pretty chill. I like it.",
        wrong1: "The rock is very stone.",
        wrong2: "I vibe the television.",
        wrong3: "No, the guitar is loud.",
        explanation: "وەڵامێکی باو بۆ هەڵسەنگاندنی شوێنێک: 'Yeah, it's pretty chill. I like it.'",
      },
    ],
  },
];

export default unit00;
