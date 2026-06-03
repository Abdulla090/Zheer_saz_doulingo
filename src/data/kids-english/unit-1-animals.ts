import type { UnitBank } from "../types";

// ── Kids Unit 1: Animals (ئاژەڵەکان) ──────────────────────────────────────────
// Very simple, picture-book English for Kurdish children. Every game in a
// lesson reinforces the same handful of words so they truly stick.
const kidsUnit1: UnitBank = [
  // Lesson 0: Pets
  {
    topic: "Pets", topicKu: "ئاژەڵی ماڵی",
    words: [
      { english: "Dog", kurdish: "سەگ" },
      { english: "Cat", kurdish: "پشیلە" },
      { english: "Bird", kurdish: "باڵندە" },
      { english: "Fish", kurdish: "ماسی" },
      { english: "Rabbit", kurdish: "کەروێشک" },
    ],
    voices: [
      { prompt: "بڵێ: ئەمە سەگە", target: "It is a dog.", targetKurdish: "ئەمە سەگە." },
      { prompt: "بڵێ: پشیلەم هەیە", target: "I have a cat.", targetKurdish: "پشیلەم هەیە." },
    ],
    sentences: [
      { english: ["It", "is", "a", "dog"], kurdish: "ئەمە سەگە" },
      { english: ["I", "have", "a", "cat"], kurdish: "پشیلەم هەیە" },
    ],
    fillBlanks: [
      { parts: ["The", "says woof"], hint: "سەگ دەوەڕێت", answer: "dog", wrongs: ["cat", "bird", "fish"] },
      { parts: ["A", "says meow"], hint: "پشیلە میاو دەکات", answer: "cat", wrongs: ["dog", "fish", "bird"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک ئاژەڵێکت پیشان دەدات و دەپرسێت ئەمە چییە",
        theyAsk: "What is this animal?",
        correct: "It's a dog!",
        wrong1: "It is a dog.",
        wrong2: "This animal is a canine.",
        wrong3: "The creature is a domestic dog species.",
        explanation: "بۆ منداڵان بە سادەیی بڵێ: 'It's a dog!' — وشە گەورە و ئاڵۆزەکان وەک 'canine' پێویست نین.",
      },
    ],
  },

  // Lesson 1: Farm Animals
  {
    topic: "Farm Animals", topicKu: "ئاژەڵی کێڵگە",
    words: [
      { english: "Cow", kurdish: "مانگا" },
      { english: "Horse", kurdish: "ئەسپ" },
      { english: "Sheep", kurdish: "مەڕ" },
      { english: "Chicken", kurdish: "مریشک" },
      { english: "Duck", kurdish: "مراوی" },
    ],
    voices: [
      { prompt: "بڵێ: مانگاکە گەورەیە", target: "The cow is big.", targetKurdish: "مانگاکە گەورەیە." },
      { prompt: "بڵێ: ئەسپێک دەبینم", target: "I see a horse.", targetKurdish: "ئەسپێک دەبینم." },
    ],
    sentences: [
      { english: ["The", "cow", "is", "big"], kurdish: "مانگاکە گەورەیە" },
      { english: ["I", "see", "a", "horse"], kurdish: "ئەسپێک دەبینم" },
    ],
    fillBlanks: [
      { parts: ["The", "gives milk"], hint: "مانگا شیر دەدات", answer: "cow", wrongs: ["horse", "sheep", "duck"] },
      { parts: ["A", "says baa"], hint: "مەڕ باڕە دەکات", answer: "sheep", wrongs: ["cow", "chicken", "horse"] },
    ],
    conversations: [
      {
        situation: "لە کێڵگەدا هاوڕێیەک ئاژەڵێک پیشان دەدات",
        theyAsk: "Look! What is that?",
        correct: "It's a cow!",
        wrong1: "That is a cow.",
        wrong2: "That appears to be a cow.",
        wrong3: "I believe that is a bovine animal.",
        explanation: "بە دڵخۆشی بڵێ: 'It's a cow!' — کورت و ئاسان بۆ منداڵان.",
      },
    ],
  },

  // Lesson 2: Wild Animals
  {
    topic: "Wild Animals", topicKu: "ئاژەڵی کێوی",
    words: [
      { english: "Lion", kurdish: "شێر" },
      { english: "Elephant", kurdish: "فیل" },
      { english: "Monkey", kurdish: "مەیموون" },
      { english: "Bear", kurdish: "ورچ" },
      { english: "Tiger", kurdish: "بەبر" },
    ],
    voices: [
      { prompt: "بڵێ: شێرەکە گەورەیە", target: "The lion is big.", targetKurdish: "شێرەکە گەورەیە." },
      { prompt: "بڵێ: حەزم لە مەیموونە", target: "I like the monkey.", targetKurdish: "حەزم لە مەیموونە." },
    ],
    sentences: [
      { english: ["The", "lion", "is", "big"], kurdish: "شێرەکە گەورەیە" },
      { english: ["I", "like", "the", "monkey"], kurdish: "حەزم لە مەیموونە" },
    ],
    fillBlanks: [
      { parts: ["The", "is the king"], hint: "شێر شای ئاژەڵانە", answer: "lion", wrongs: ["bear", "tiger", "monkey"] },
      { parts: ["The", "has a long nose"], hint: "فیل لووتی درێژی هەیە", answer: "elephant", wrongs: ["lion", "bear", "tiger"] },
    ],
    conversations: [
      {
        situation: "لە باخی ئاژەڵاندا هاوڕێیەک پرسیار دەکات",
        theyAsk: "Which animal do you like?",
        correct: "I like the lion!",
        wrong1: "I like the lion.",
        wrong2: "My preference is the lion.",
        wrong3: "The animal I find most agreeable is the lion.",
        explanation: "بۆ منداڵان بڵێ: 'I like the lion!' — سادە و دڵخۆش.",
      },
    ],
  },

  // Lesson 3: Animals Can...
  {
    topic: "Animals Can", topicKu: "ئاژەڵ دەتوانن",
    words: [
      { english: "Run", kurdish: "ڕاکردن" },
      { english: "Jump", kurdish: "بازدان" },
      { english: "Swim", kurdish: "مەلەکردن" },
      { english: "Fly", kurdish: "فڕین" },
      { english: "Eat", kurdish: "خواردن" },
    ],
    voices: [
      { prompt: "بڵێ: باڵندەکە دەتوانێت بفڕێت", target: "The bird can fly.", targetKurdish: "باڵندەکە دەتوانێت بفڕێت." },
      { prompt: "بڵێ: ماسییەکە دەتوانێت مەلە بکات", target: "The fish can swim.", targetKurdish: "ماسییەکە دەتوانێت مەلە بکات." },
    ],
    sentences: [
      { english: ["The", "bird", "can", "fly"], kurdish: "باڵندەکە دەتوانێت بفڕێت" },
      { english: ["The", "fish", "can", "swim"], kurdish: "ماسییەکە دەتوانێت مەلە بکات" },
    ],
    fillBlanks: [
      { parts: ["Birds can", "high"], hint: "باڵندەکان دەتوانن بەرز بفڕن", answer: "fly", wrongs: ["swim", "run", "eat"] },
      { parts: ["Fish can", "in water"], hint: "ماسییەکان دەتوانن لە ئاودا مەلە بکەن", answer: "swim", wrongs: ["fly", "jump", "run"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت باڵندە چی دەکات",
        theyAsk: "What can a bird do?",
        correct: "A bird can fly!",
        wrong1: "A bird can fly.",
        wrong2: "Birds are capable of flight.",
        wrong3: "The avian creature possesses the ability to fly.",
        explanation: "بڵێ: 'A bird can fly!' — وشەی ئاسان بۆ منداڵ باشترە.",
      },
    ],
  },

  // Lesson 4: My Favorite Animal
  {
    topic: "Favorite Animal", topicKu: "ئاژەڵی دڵخواز",
    words: [
      { english: "Favorite", kurdish: "دڵخواز" },
      { english: "Big", kurdish: "گەورە" },
      { english: "Small", kurdish: "بچووک" },
      { english: "Cute", kurdish: "نازدار" },
      { english: "Animal", kurdish: "ئاژەڵ" },
    ],
    voices: [
      { prompt: "بڵێ: ئاژەڵی دڵخوازم پشیلەیە", target: "My favorite animal is the cat.", targetKurdish: "ئاژەڵی دڵخوازم پشیلەیە." },
      { prompt: "بڵێ: کەروێشکەکە نازدارە", target: "The rabbit is cute.", targetKurdish: "کەروێشکەکە نازدارە." },
    ],
    sentences: [
      { english: ["The", "dog", "is", "big"], kurdish: "سەگەکە گەورەیە" },
      { english: ["The", "cat", "is", "cute"], kurdish: "پشیلەکە نازدارە" },
    ],
    fillBlanks: [
      { parts: ["My favorite", "is the dog"], hint: "ئاژەڵی دڵخوازم سەگە", answer: "animal", wrongs: ["color", "number", "food"] },
      { parts: ["The cat is very", ""], hint: "پشیلەکە زۆر نازدارە", answer: "cute", wrongs: ["big", "old", "tall"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت ئاژەڵی دڵخوازت چییە",
        theyAsk: "What is your favorite animal?",
        correct: "My favorite animal is the cat!",
        wrong1: "I like the cat.",
        wrong2: "My preferred animal is the feline.",
        wrong3: "The animal I favor most is the domestic cat.",
        explanation: "بڵێ: 'My favorite animal is the cat!' — ڕستەیەکی تەواوی ئاسان.",
      },
    ],
  },
];

export default kidsUnit1;
