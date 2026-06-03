import type { UnitBank } from "../types";

// ── Kids Unit 2: Colors & Numbers (ڕەنگ و ژمارە) ──────────────────────────────
const kidsUnit2: UnitBank = [
  // Lesson 0: Colors 1
  {
    topic: "Colors 1", topicKu: "ڕەنگەکان ١",
    words: [
      { english: "Red", kurdish: "سوور" },
      { english: "Blue", kurdish: "شین" },
      { english: "Green", kurdish: "سەوز" },
      { english: "Yellow", kurdish: "زەرد" },
      { english: "Black", kurdish: "ڕەش" },
    ],
    voices: [
      { prompt: "بڵێ: سێوەکە سوورە", target: "The apple is red.", targetKurdish: "سێوەکە سوورە." },
      { prompt: "بڵێ: ئاسمان شینە", target: "The sky is blue.", targetKurdish: "ئاسمان شینە." },
    ],
    sentences: [
      { english: ["The", "apple", "is", "red"], kurdish: "سێوەکە سوورە" },
      { english: ["The", "sky", "is", "blue"], kurdish: "ئاسمان شینە" },
    ],
    fillBlanks: [
      { parts: ["The grass is", ""], hint: "گیاکە سەوزە", answer: "green", wrongs: ["red", "blue", "black"] },
      { parts: ["The sun is", ""], hint: "خۆرەکە زەردە", answer: "yellow", wrongs: ["blue", "green", "red"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک تۆپێک پیشان دەدات و دەپرسێت چ ڕەنگێکە",
        theyAsk: "What color is the ball?",
        correct: "It's red!",
        wrong1: "The ball is red.",
        wrong2: "The ball's color is red.",
        wrong3: "The chromatic shade of the ball is red.",
        explanation: "بۆ منداڵان بڵێ: 'It's red!' — کورت و ئاسان.",
      },
    ],
  },

  // Lesson 1: Colors 2
  {
    topic: "Colors 2", topicKu: "ڕەنگەکان ٢",
    words: [
      { english: "White", kurdish: "سپی" },
      { english: "Orange", kurdish: "پرتەقاڵی" },
      { english: "Pink", kurdish: "پەمەیی" },
      { english: "Purple", kurdish: "مۆر" },
      { english: "Brown", kurdish: "قاوەیی" },
    ],
    voices: [
      { prompt: "بڵێ: بەفرەکە سپییە", target: "The snow is white.", targetKurdish: "بەفرەکە سپییە." },
      { prompt: "بڵێ: حەزم لە ڕەنگی مۆرە", target: "I like purple.", targetKurdish: "حەزم لە ڕەنگی مۆرە." },
    ],
    sentences: [
      { english: ["The", "snow", "is", "white"], kurdish: "بەفرەکە سپییە" },
      { english: ["I", "like", "purple"], kurdish: "حەزم لە ڕەنگی مۆرە" },
    ],
    fillBlanks: [
      { parts: ["The snow is", ""], hint: "بەفرەکە سپییە", answer: "white", wrongs: ["black", "brown", "pink"] },
      { parts: ["The orange is", ""], hint: "پرتەقاڵەکە پرتەقاڵییە", answer: "orange", wrongs: ["purple", "pink", "white"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت حەزت لە چ ڕەنگێکە",
        theyAsk: "What color do you like?",
        correct: "I like pink!",
        wrong1: "I like pink.",
        wrong2: "My favored color is pink.",
        wrong3: "The hue I find most pleasing is pink.",
        explanation: "بڵێ: 'I like pink!' — سادە و ڕاستەوخۆ.",
      },
    ],
  },

  // Lesson 2: Numbers 1-5
  {
    topic: "Numbers 1-5", topicKu: "ژمارە ١-٥",
    words: [
      { english: "One", kurdish: "یەک" },
      { english: "Two", kurdish: "دوو" },
      { english: "Three", kurdish: "سێ" },
      { english: "Four", kurdish: "چوار" },
      { english: "Five", kurdish: "پێنج" },
    ],
    voices: [
      { prompt: "بڵێ: دوو پشیلەم هەیە", target: "I have two cats.", targetKurdish: "دوو پشیلەم هەیە." },
      { prompt: "بڵێ: سێ باڵندە دەبینم", target: "I see three birds.", targetKurdish: "سێ باڵندە دەبینم." },
    ],
    sentences: [
      { english: ["I", "have", "two", "cats"], kurdish: "دوو پشیلەم هەیە" },
      { english: ["I", "see", "three", "birds"], kurdish: "سێ باڵندە دەبینم" },
    ],
    fillBlanks: [
      { parts: ["I have", "apple"], hint: "یەک سێوم هەیە", answer: "one", wrongs: ["two", "five", "four"] },
      { parts: ["I have", "fingers on one hand"], hint: "پێنج پەنجەم لە یەک دەستدا هەیە", answer: "five", wrongs: ["one", "two", "three"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت چەند سێوت هەیە",
        theyAsk: "How many apples do you have?",
        correct: "I have two!",
        wrong1: "I have two apples.",
        wrong2: "I am in possession of two apples.",
        wrong3: "The quantity of apples I hold is two.",
        explanation: "بڵێ: 'I have two!' — وەڵامی کورت و ئاسان.",
      },
    ],
  },

  // Lesson 3: Numbers 6-10
  {
    topic: "Numbers 6-10", topicKu: "ژمارە ٦-١٠",
    words: [
      { english: "Six", kurdish: "شەش" },
      { english: "Seven", kurdish: "حەوت" },
      { english: "Eight", kurdish: "هەشت" },
      { english: "Nine", kurdish: "نۆ" },
      { english: "Ten", kurdish: "دە" },
    ],
    voices: [
      { prompt: "بڵێ: شەش پێنووسم هەیە", target: "I have six pens.", targetKurdish: "شەش پێنووسم هەیە." },
      { prompt: "بڵێ: من دە پەنجەم هەیە", target: "I have ten fingers.", targetKurdish: "من دە پەنجەم هەیە." },
    ],
    sentences: [
      { english: ["I", "have", "six", "pens"], kurdish: "شەش پێنووسم هەیە" },
      { english: ["I", "have", "ten", "fingers"], kurdish: "دە پەنجەم هەیە" },
    ],
    fillBlanks: [
      { parts: ["I have", "fingers"], hint: "دە پەنجەم هەیە", answer: "ten", wrongs: ["six", "eight", "nine"] },
      { parts: ["I am", "years old"], hint: "تەمەنم حەوت ساڵە", answer: "seven", wrongs: ["ten", "six", "eight"] },
    ],
    conversations: [
      {
        situation: "کەسێک تەمەنت دەپرسێت",
        theyAsk: "How old are you?",
        correct: "I am seven!",
        wrong1: "I am seven years old.",
        wrong2: "My age is seven years.",
        wrong3: "I have existed for seven years.",
        explanation: "بۆ منداڵ بڵێ: 'I am seven!' — کورت و ئاسایی.",
      },
    ],
  },

  // Lesson 4: Colors & Numbers Together
  {
    topic: "Ask & Answer", topicKu: "پرسیار و وەڵام",
    words: [
      { english: "How many", kurdish: "چەند" },
      { english: "What color", kurdish: "چ ڕەنگ" },
      { english: "This", kurdish: "ئەمە" },
      { english: "That", kurdish: "ئەو" },
      { english: "Ball", kurdish: "تۆپ" },
    ],
    voices: [
      { prompt: "بڵێ: چ ڕەنگێکە؟", target: "What color is it?", targetKurdish: "چ ڕەنگێکە؟" },
      { prompt: "بڵێ: چەند پشیلە؟", target: "How many cats?", targetKurdish: "چەند پشیلە؟" },
    ],
    sentences: [
      { english: ["What", "color", "is", "it"], kurdish: "چ ڕەنگێکە؟" },
      { english: ["How", "many", "cats"], kurdish: "چەند پشیلە؟" },
    ],
    fillBlanks: [
      { parts: ["What", "is the ball?"], hint: "تۆپەکە چ ڕەنگێکە؟", answer: "color", wrongs: ["number", "animal", "name"] },
      { parts: ["How", "apples?"], hint: "چەند سێو؟", answer: "many", wrongs: ["much", "old", "big"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک تۆپێکی سوورت پیشان دەدات",
        theyAsk: "What color is this ball?",
        correct: "It's red!",
        wrong1: "This ball is red.",
        wrong2: "The color of this ball is red.",
        wrong3: "This spherical object is red in color.",
        explanation: "بڵێ: 'It's red!' — وەڵامی کورت و ڕوون بۆ منداڵ.",
      },
    ],
  },

  // Lesson 5: Shapes
  {
    topic: "Shapes", topicKu: "شێوەکان",
    words: [
      { english: "Circle", kurdish: "بازنە" },
      { english: "Square", kurdish: "چوارگۆشە" },
      { english: "Triangle", kurdish: "سێگۆشە" },
      { english: "Star", kurdish: "ئەستێرە" },
      { english: "Shape", kurdish: "شێوە" },
    ],
    voices: [
      { prompt: "بڵێ: تۆپەکە بازنەیە", target: "The ball is a circle.", targetKurdish: "تۆپەکە بازنەیە." },
      { prompt: "بڵێ: من ئەستێرەیەک دەبینم", target: "I see a star.", targetKurdish: "من ئەستێرەیەک دەبینم." },
    ],
    sentences: [
      { english: ["The", "ball", "is", "a", "circle"], kurdish: "تۆپەکە بازنەیە" },
      { english: ["I", "see", "a", "star"], kurdish: "من ئەستێرەیەک دەبینم" },
    ],
    fillBlanks: [
      { parts: ["A pizza is a", ""], hint: "پیتزا بازنەیە", answer: "circle", wrongs: ["square", "star", "triangle"] },
      { parts: ["The", "is in the sky"], hint: "ئەستێرە لە ئاسمانە", answer: "star", wrongs: ["circle", "square", "triangle"] },
    ],
    conversations: [
      {
        situation: "مامۆستا دەپرسێت شێوەی خۆر چییە",
        theyAsk: "What shape is the sun?",
        correct: "It is a circle!",
        wrong1: "It is a square.",
        wrong2: "The sun is yellow.",
        wrong3: "I see a star.",
        explanation: "بڵێ: 'It is a circle!'",
      },
    ],
  },

  // Lesson 6: Toys & Colors
  {
    topic: "Toys & Colors", topicKu: "یارییەکان و ڕەنگەکان",
    words: [
      { english: "Car", kurdish: "ئۆتۆمبێل" },
      { english: "Doll", kurdish: "بووکەڵە" },
      { english: "Block", kurdish: "بلۆک (یاری مکەعەب)" },
      { english: "Train", kurdish: "شەمەندەفەر" },
      { english: "Toy", kurdish: "یاری" },
    ],
    voices: [
      { prompt: "بڵێ: ئۆتۆمبێلەکەم سوورە", target: "My car is red.", targetKurdish: "ئۆتۆمبێلەکەم سوورە." },
      { prompt: "بڵێ: بووکەڵەکەم پەمەییە", target: "My doll is pink.", targetKurdish: "بووکەڵەکەم پەمەییە." },
    ],
    sentences: [
      { english: ["My", "car", "is", "red"], kurdish: "ئۆتۆمبێلەکەم سوورە" },
      { english: ["My", "doll", "is", "pink"], kurdish: "بووکەڵەکەم پەمەییە" },
    ],
    fillBlanks: [
      { parts: ["I play with my red", ""], hint: "یاری بە ئۆتۆمبێلە سوورەکەم دەکەم", answer: "car", wrongs: ["apple", "dog", "block"] },
      { parts: ["The", "is blue"], hint: "شەمەندەفەرەکە شینە", answer: "train", wrongs: ["doll", "car", "star"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت ئۆتۆمبێلەکەت چ ڕەنگێکە",
        theyAsk: "What color is your car?",
        correct: "My car is red!",
        wrong1: "It is a car.",
        wrong2: "I play with a car.",
        wrong3: "The vehicle is red in color.",
        explanation: "وەڵامێکی ئاسان: 'My car is red!'",
      },
    ],
  },

  // Lesson 7: Numbers 11-20
  {
    topic: "Numbers 11-20", topicKu: "ژمارە ١١-٢٠",
    words: [
      { english: "Eleven", kurdish: "یازدە" },
      { english: "Twelve", kurdish: "دوانزە" },
      { english: "Fifteen", kurdish: "پازدە" },
      { english: "Twenty", kurdish: "بیست" },
      { english: "Count", kurdish: "ژماردن" },
    ],
    voices: [
      { prompt: "بڵێ: من دەتوانم بژمێرم", target: "I can count.", targetKurdish: "من دەتوانم بژمێرم." },
      { prompt: "بڵێ: بیست سێوم هەیە", target: "I have twenty apples.", targetKurdish: "بیست سێوم هەیە." },
    ],
    sentences: [
      { english: ["I", "can", "count"], kurdish: "من دەتوانم بژمێرم" },
      { english: ["I", "have", "twenty", "apples"], kurdish: "بیست سێوم هەیە" },
    ],
    fillBlanks: [
      { parts: ["I can", "to twenty"], hint: "دەتوانم تا بیست بژمێرم", answer: "count", wrongs: ["play", "run", "eat"] },
      { parts: ["Ten and ten is", ""], hint: "دە و دە دەکاتە بیست", answer: "twenty", wrongs: ["twelve", "eleven", "fifteen"] },
    ],
    conversations: [
      {
        situation: "مامۆستا دەپرسێت دەتوانیت تا بیست بژمێریت",
        theyAsk: "Can you count to twenty?",
        correct: "Yes, I can!",
        wrong1: "I count.",
        wrong2: "Twenty is a number.",
        wrong3: "I am capable of enumerating.",
        explanation: "وەڵامێکی ئەرێنی: 'Yes, I can!'",
      },
    ],
  },

  // Lesson 8: Counting Things
  {
    topic: "Counting Things", topicKu: "ژماردنی شتەکان",
    words: [
      { english: "Book", kurdish: "کتێب" },
      { english: "Pen", kurdish: "پێنووس" },
      { english: "Bag", kurdish: "جانتا" },
      { english: "Desk", kurdish: "مێز" },
      { english: "Chair", kurdish: "کورسی" },
    ],
    voices: [
      { prompt: "بڵێ: سێ کتێبم هەیە", target: "I have three books.", targetKurdish: "سێ کتێبم هەیە." },
      { prompt: "بڵێ: چوار کورسی دەبینم", target: "I see four chairs.", targetKurdish: "چوار کورسی دەبینم." },
    ],
    sentences: [
      { english: ["I", "have", "three", "books"], kurdish: "سێ کتێبم هەیە" },
      { english: ["I", "see", "four", "chairs"], kurdish: "چوار کورسی دەبینم" },
    ],
    fillBlanks: [
      { parts: ["I have a red", ""], hint: "جانتایەکی سوورم هەیە", answer: "bag", wrongs: ["pen", "desk", "chair"] },
      { parts: ["The", "is brown"], hint: "مێزەکە قاوەییە", answer: "desk", wrongs: ["apple", "star", "bag"] },
    ],
    conversations: [
      {
        situation: "مامۆستا دەپرسێت چەند پێنووست پێیە",
        theyAsk: "How many pens do you have?",
        correct: "I have two pens!",
        wrong1: "I have a pen.",
        wrong2: "Pens are blue.",
        wrong3: "I possess a couple of writing instruments.",
        explanation: "بڵێ: 'I have two pens!'",
      },
    ],
  },

  // Lesson 9: Colors in Nature
  {
    topic: "Colors in Nature", topicKu: "ڕەنگەکان لە سروشتدا",
    words: [
      { english: "Tree", kurdish: "درەخت" },
      { english: "Flower", kurdish: "گوڵ" },
      { english: "Sun", kurdish: "خۆر" },
      { english: "Grass", kurdish: "گیا" },
      { english: "Cloud", kurdish: "هەور" },
    ],
    voices: [
      { prompt: "بڵێ: درەختەکە سەوزە", target: "The tree is green.", targetKurdish: "درەختەکە سەوزە." },
      { prompt: "بڵێ: گوڵەکە پەمەییە", target: "The flower is pink.", targetKurdish: "گوڵەکە پەمەییە." },
    ],
    sentences: [
      { english: ["The", "tree", "is", "green"], kurdish: "درەختەکە سەوزە" },
      { english: ["The", "flower", "is", "pink"], kurdish: "گوڵەکە پەمەییە" },
    ],
    fillBlanks: [
      { parts: ["The", "is yellow"], hint: "خۆرەکە زەردە", answer: "sun", wrongs: ["cloud", "tree", "grass"] },
      { parts: ["The", "is white"], hint: "هەورەکە سپییە", answer: "cloud", wrongs: ["sun", "grass", "tree"] },
    ],
    conversations: [
      {
        situation: "لە باخچەیەکدایت و گوڵێک دەبینیت",
        theyAsk: "What color is this flower?",
        correct: "The flower is red!",
        wrong1: "It is a flower.",
        wrong2: "The tree is green.",
        wrong3: "This blossom's hue is red.",
        explanation: "ڕستەیەکی ڕوون: 'The flower is red!'",
      },
    ],
  },
];

export default kidsUnit2;
