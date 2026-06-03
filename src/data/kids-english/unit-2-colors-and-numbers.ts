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
];

export default kidsUnit2;
