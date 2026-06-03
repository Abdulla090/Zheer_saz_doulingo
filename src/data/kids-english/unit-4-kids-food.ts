import type { UnitBank } from "../types";

// ── Kids Unit 4: Food & Drinks (خواردن و خواردنەوە) ─────────────────────────
const kidsUnit4: UnitBank = [
  // Lesson 0: Basic Foods
  {
    topic: "Basic Foods", topicKu: "خواردنە بنەڕەتییەکان",
    words: [
      { english: "Apple", kurdish: "سێو" },
      { english: "Bread", kurdish: "نان" },
      { english: "Milk", kurdish: "شیر" },
      { english: "Egg", kurdish: "هێلکە" },
      { english: "Banana", kurdish: "مۆز" },
    ],
    voices: [
      { prompt: "بڵێ: سێوێک دەخۆم", target: "I eat an apple.", targetKurdish: "سێوێک دەخۆم." },
      { prompt: "بڵێ: شیر دەخۆمەوە", target: "I drink milk.", targetKurdish: "شیر دەخۆمەوە." },
    ],
    sentences: [
      { english: ["I", "eat", "an", "apple"], kurdish: "سێوێک دەخۆم" },
      { english: ["I", "drink", "milk"], kurdish: "شیر دەخۆمەوە" },
    ],
    fillBlanks: [
      { parts: ["I eat", "for breakfast"], hint: "نان دەخۆم بۆ نانی بەیانی", answer: "bread", wrongs: ["milk", "water", "juice"] },
      { parts: ["The", "is yellow"], hint: "مۆزەکە زەردە", answer: "banana", wrongs: ["apple", "egg", "milk"] },
    ],
    conversations: [
      {
        situation: "لە کاتی نانخواردندا هاوڕێیەک دەپرسێت چی دەخۆیت",
        theyAsk: "What are you eating?",
        correct: "I am eating an apple!",
        wrong1: "I am eating.",
        wrong2: "The apple is good.",
        wrong3: "I consume fruit.",
        explanation: "بۆ منداڵان بە سادەیی بڵێ: 'I am eating an apple!'",
      },
    ],
  },
  // Lesson 1: Drinks
  {
    topic: "Drinks", topicKu: "خواردنەوەکان",
    words: [
      { english: "Water", kurdish: "ئاو" },
      { english: "Juice", kurdish: "شەربەت" },
      { english: "Tea", kurdish: "چا" },
      { english: "Drink", kurdish: "خواردنەوە" },
      { english: "Cold", kurdish: "سارد" },
    ],
    voices: [
      { prompt: "بڵێ: ئاو دەخۆمەوە", target: "I drink water.", targetKurdish: "ئاو دەخۆمەوە." },
      { prompt: "بڵێ: شەربەتەکە ساردە", target: "The juice is cold.", targetKurdish: "شەربەتەکە ساردە." },
    ],
    sentences: [
      { english: ["I", "drink", "water"], kurdish: "ئاو دەخۆمەوە" },
      { english: ["The", "juice", "is", "cold"], kurdish: "شەربەتەکە ساردە" },
    ],
    fillBlanks: [
      { parts: ["I like cold", ""], hint: "کەیفم بە ئاوی سارد دێت", answer: "water", wrongs: ["bread", "egg", "banana"] },
      { parts: ["He drinks", ""], hint: "ئەو چا دەخواتەوە", answer: "tea", wrongs: ["bread", "apple", "food"] },
    ],
    conversations: [
      {
        situation: "تینووتە و هاوڕێیەک دەپرسێت چی دەخۆیتەوە",
        theyAsk: "What do you drink?",
        correct: "I drink water!",
        wrong1: "I like water.",
        wrong2: "Water is liquid.",
        wrong3: "I prefer hydration.",
        explanation: "وەڵامێکی ئاسان: 'I drink water!'",
      },
    ],
  },
  // Lesson 2: Fruits
  {
    topic: "Fruits", topicKu: "میوەکان",
    words: [
      { english: "Orange", kurdish: "پرتەقاڵ" },
      { english: "Grape", kurdish: "ترێ" },
      { english: "Melon", kurdish: "کاڵەک" },
      { english: "Sweet", kurdish: "شیرین" },
      { english: "Fruit", kurdish: "میوە" },
    ],
    voices: [
      { prompt: "بڵێ: پرتەقاڵەکە شیرینە", target: "The orange is sweet.", targetKurdish: "پرتەقاڵەکە شیرینە." },
      { prompt: "بڵێ: کەیفم بە میوە دێت", target: "I like fruit.", targetKurdish: "کەیفم بە میوە دێت." },
    ],
    sentences: [
      { english: ["The", "orange", "is", "sweet"], kurdish: "پرتەقاڵەکە شیرینە" },
      { english: ["I", "like", "fruit"], kurdish: "کەیفم بە میوە دێت" },
    ],
    fillBlanks: [
      { parts: ["A", "is a fruit"], hint: "پرتەقاڵ میوەیە", answer: "orange", wrongs: ["water", "tea", "bread"] },
      { parts: ["The grapes are", ""], hint: "ترێیەکان شیرینن", answer: "sweet", wrongs: ["cold", "big", "sad"] },
    ],
    conversations: [
      {
        situation: "لە بازاڕدا هاوڕێیەک دەپرسێت ئایا کەیفت بە میوە دێت",
        theyAsk: "Do you like fruit?",
        correct: "Yes, I like fruit!",
        wrong1: "I like orange.",
        wrong2: "Fruit is sweet.",
        wrong3: "Indeed I consume fruits.",
        explanation: "وەڵامی ئاسان: 'Yes, I like fruit!'",
      },
    ],
  },
  // Lesson 3: Vegetables
  {
    topic: "Vegetables", topicKu: "سەوزەکان",
    words: [
      { english: "Tomato", kurdish: "تەماتە" },
      { english: "Carrot", kurdish: "گێزەر" },
      { english: "Potato", kurdish: "پەتاتە" },
      { english: "Green", kurdish: "سەوز" },
      { english: "Vegetable", kurdish: "سەوزە" },
    ],
    voices: [
      { prompt: "بڵێ: تەماتەکە سوورە", target: "The tomato is red.", targetKurdish: "تەماتەکە سوورە." },
      { prompt: "بڵێ: گێزەر دەخۆم", target: "I eat a carrot.", targetKurdish: "گێزەر دەخۆم." },
    ],
    sentences: [
      { english: ["The", "tomato", "is", "red"], kurdish: "تەماتەکە سوورە" },
      { english: ["I", "eat", "a", "carrot"], kurdish: "گێزەر دەخۆم" },
    ],
    fillBlanks: [
      { parts: ["Rabbits eat", ""], hint: "کەروێشک گێزەر دەخوات", answer: "carrot", wrongs: ["tomato", "potato", "water"] },
      { parts: ["A", "is a vegetable"], hint: "پەتاتە سەوزەیە", answer: "potato", wrongs: ["apple", "banana", "milk"] },
    ],
    conversations: [
      {
        situation: "دایکت دەپرسێت سەوزە دەخۆیت",
        theyAsk: "Do you eat vegetables?",
        correct: "Yes, I eat carrots!",
        wrong1: "Carrot is red.",
        wrong2: "I eat apple.",
        wrong3: "Vegetables provide nutrition.",
        explanation: "ڕستەیەکی تەواو: 'Yes, I eat carrots!'",
      },
    ],
  },
  // Lesson 4: Fast Food
  {
    topic: "Fast Food", topicKu: "خواردنی خێرا",
    words: [
      { english: "Pizza", kurdish: "پیتزا" },
      { english: "Burger", kurdish: "بەرگر" },
      { english: "Fries", kurdish: "پەتاتەی سورەوەکراو" },
      { english: "Hot", kurdish: "گەرم" },
      { english: "Yummy", kurdish: "بەتام" },
    ],
    voices: [
      { prompt: "بڵێ: پیتزاکە بەتامە", target: "The pizza is yummy.", targetKurdish: "پیتزاکە بەتامە." },
      { prompt: "بڵێ: بەرگر دەخۆم", target: "I eat a burger.", targetKurdish: "بەرگر دەخۆم." },
    ],
    sentences: [
      { english: ["The", "pizza", "is", "yummy"], kurdish: "پیتزاکە بەتامە" },
      { english: ["The", "fries", "are", "hot"], kurdish: "پەتاتەکان گەرمن" },
    ],
    fillBlanks: [
      { parts: ["I like", "and fries"], hint: "کەیفم بە بەرگر و پەتاتەیە", answer: "burger", wrongs: ["water", "tea", "apple"] },
      { parts: ["The pizza is very", ""], hint: "پیتزاکە زۆر بەتامە", answer: "yummy", wrongs: ["sad", "cold", "blue"] },
    ],
    conversations: [
      {
        situation: "لە چێشتخانەدا دەپرسن چیت دەوێت",
        theyAsk: "What do you want to eat?",
        correct: "I want pizza!",
        wrong1: "I want water.",
        wrong2: "Pizza is round.",
        wrong3: "I desire fast food.",
        explanation: "بە ئاسانی بڵێ: 'I want pizza!'",
      },
    ],
  },
  // Lesson 5: Meals
  {
    topic: "Meals", topicKu: "ژەمەکان",
    words: [
      { english: "Breakfast", kurdish: "نانی بەیانی" },
      { english: "Lunch", kurdish: "نانی نیوەڕۆ" },
      { english: "Dinner", kurdish: "نانی ئێوارە" },
      { english: "Morning", kurdish: "بەیانی" },
      { english: "Night", kurdish: "شەو" },
    ],
    voices: [
      { prompt: "بڵێ: نانی بەیانی دەخۆم", target: "I eat breakfast.", targetKurdish: "نانی بەیانی دەخۆم." },
      { prompt: "بڵێ: کاتی نانی ئێوارەیە", target: "It is time for dinner.", targetKurdish: "کاتی نانی ئێوارەیە." },
    ],
    sentences: [
      { english: ["I", "eat", "breakfast"], kurdish: "نانی بەیانی دەخۆم" },
      { english: ["It", "is", "time", "for", "dinner"], kurdish: "کاتی نانی ئێوارەیە" },
    ],
    fillBlanks: [
      { parts: ["We eat", "in the morning"], hint: "بەیانیان نانی بەیانی دەخۆین", answer: "breakfast", wrongs: ["dinner", "lunch", "night"] },
      { parts: ["I eat", "at night"], hint: "شەوانە نانی ئێوارە دەخۆم", answer: "dinner", wrongs: ["morning", "breakfast", "lunch"] },
    ],
    conversations: [
      {
        situation: "دایکت پێتدەڵێت وەرە نان بخۆ",
        theyAsk: "It is time for lunch!",
        correct: "I am coming!",
        wrong1: "I eat breakfast.",
        wrong2: "Lunch is at noon.",
        wrong3: "I will consume my midday meal.",
        explanation: "بڵێ 'I am coming!' (من دێم)",
      },
    ],
  },
  // Lesson 6: Sweets
  {
    topic: "Sweets", topicKu: "شیرینییەکان",
    words: [
      { english: "Cake", kurdish: "کێک" },
      { english: "Candy", kurdish: "نوقڵ" },
      { english: "Chocolate", kurdish: "چۆکۆلاتە" },
      { english: "Ice cream", kurdish: "ئایس کرێم" },
      { english: "Happy", kurdish: "دڵخۆش" },
    ],
    voices: [
      { prompt: "بڵێ: کێکەکە شیرینە", target: "The cake is sweet.", targetKurdish: "کێکەکە شیرینە." },
      { prompt: "بڵێ: کەیفم بە ئایس کرێم دێت", target: "I like ice cream.", targetKurdish: "کەیفم بە ئایس کرێم دێت." },
    ],
    sentences: [
      { english: ["The", "cake", "is", "sweet"], kurdish: "کێکەکە شیرینە" },
      { english: ["I", "like", "ice", "cream"], kurdish: "کەیفم بە ئایس کرێم دێت" },
    ],
    fillBlanks: [
      { parts: ["I eat", "on my birthday"], hint: "لە ڕۆژی لەدایکبوونمدا کێک دەخۆم", answer: "cake", wrongs: ["water", "carrot", "egg"] },
      { parts: ["The", "is cold"], hint: "ئایس کرێمەکە ساردە", answer: "Ice cream", wrongs: ["cake", "candy", "chocolate"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک شیرینیت پێشکەش دەکات",
        theyAsk: "Do you want some candy?",
        correct: "Yes, please!",
        wrong1: "Candy is sweet.",
        wrong2: "I want water.",
        wrong3: "I shall accept the confectionery.",
        explanation: "وەڵامێکی جوان: 'Yes, please!'",
      },
    ],
  },
  // Lesson 7: Hungry & Thirsty
  {
    topic: "Hungry & Thirsty", topicKu: "برسی و تینوو",
    words: [
      { english: "Hungry", kurdish: "برسی" },
      { english: "Thirsty", kurdish: "تینوو" },
      { english: "Want", kurdish: "ویستن" },
      { english: "Need", kurdish: "پێویستبوون" },
      { english: "Now", kurdish: "ئێستا" },
    ],
    voices: [
      { prompt: "بڵێ: من برسیمە", target: "I am hungry.", targetKurdish: "من برسیمە." },
      { prompt: "بڵێ: من تینوومە", target: "I am thirsty.", targetKurdish: "من تینوومە." },
    ],
    sentences: [
      { english: ["I", "am", "hungry"], kurdish: "من برسیمە" },
      { english: ["I", "want", "food", "now"], kurdish: "ئێستا خواردنم دەوێت" },
    ],
    fillBlanks: [
      { parts: ["I drink water because I am", ""], hint: "ئاو دەخۆمەوە چونکە تینوومە", answer: "thirsty", wrongs: ["hungry", "happy", "cold"] },
      { parts: ["I am", "I want an apple"], hint: "من برسیمە، سێوێکم دەوێت", answer: "hungry", wrongs: ["thirsty", "sad", "hot"] },
    ],
    conversations: [
      {
        situation: "دایکت دەپرسێت چۆنیت",
        theyAsk: "Are you hungry?",
        correct: "Yes, I am hungry!",
        wrong1: "I am thirsty.",
        wrong2: "Hungry is a feeling.",
        wrong3: "My stomach requires nourishment.",
        explanation: "وەڵامێکی ڕوون: 'Yes, I am hungry!'",
      },
    ],
  },
  // Lesson 8: Cooking
  {
    topic: "Cooking", topicKu: "چێشتلێنان",
    words: [
      { english: "Cook", kurdish: "چێشتلێنان" },
      { english: "Kitchen", kurdish: "چێشتخانە" },
      { english: "Make", kurdish: "دروستکردن" },
      { english: "Help", kurdish: "یارمەتیدان" },
      { english: "Mom", kurdish: "دایک" },
    ],
    voices: [
      { prompt: "بڵێ: یارمەتی دایکم دەدەم", target: "I help my mom.", targetKurdish: "یارمەتی دایکم دەدەم." },
      { prompt: "بڵێ: ئێمە خواردن دروست دەکەین", target: "We make food.", targetKurdish: "ئێمە خواردن دروست دەکەین." },
    ],
    sentences: [
      { english: ["I", "help", "my", "mom"], kurdish: "یارمەتی دایکم دەدەم" },
      { english: ["We", "make", "food"], kurdish: "ئێمە خواردن دروست دەکەین" },
    ],
    fillBlanks: [
      { parts: ["My mom is in the", ""], hint: "دایکم لە چێشتخانەیە", answer: "kitchen", wrongs: ["bedroom", "park", "school"] },
      { parts: ["I", "food with my mom"], hint: "خواردن دروست دەکەم لەگەڵ دایکم", answer: "make", wrongs: ["sleep", "jump", "run"] },
    ],
    conversations: [
      {
        situation: "دایکت لە چێشتخانەیە و بانگت دەکات",
        theyAsk: "Can you help me cook?",
        correct: "Yes, mom!",
        wrong1: "I am cooking.",
        wrong2: "Kitchen is for food.",
        wrong3: "I will assist in culinary preparations.",
        explanation: "وەڵامێکی ئاسان: 'Yes, mom!'",
      },
    ],
  },
  // Lesson 9: My Favorite Food
  {
    topic: "Favorite Food", topicKu: "خواردنی دڵخواز",
    words: [
      { english: "Favorite", kurdish: "دڵخواز" },
      { english: "Best", kurdish: "باشترین" },
      { english: "Love", kurdish: "خۆشویستن" },
      { english: "Chicken", kurdish: "مریشک" },
      { english: "Rice", kurdish: "برنج" },
    ],
    voices: [
      { prompt: "بڵێ: خواردنی دڵخوازم پیتزایە", target: "My favorite food is pizza.", targetKurdish: "خواردنی دڵخوازم پیتزایە." },
      { prompt: "بڵێ: من برنجم خۆش دەوێت", target: "I love rice.", targetKurdish: "من برنجم خۆش دەوێت." },
    ],
    sentences: [
      { english: ["My", "favorite", "food", "is", "pizza"], kurdish: "خواردنی دڵخوازم پیتزایە" },
      { english: ["I", "love", "chicken", "and", "rice"], kurdish: "کەیفم بە مریشک و برنج دێت" },
    ],
    fillBlanks: [
      { parts: ["My", "food is cake"], hint: "خواردنی دڵخوازم کێکە", answer: "favorite", wrongs: ["sad", "bad", "hot"] },
      { parts: ["I eat chicken and", ""], hint: "مریشک و برنج دەخۆم", answer: "rice", wrongs: ["water", "tea", "cake"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک دەپرسێت خواردنی دڵخوازت چییە",
        theyAsk: "What is your favorite food?",
        correct: "My favorite food is chicken!",
        wrong1: "I like food.",
        wrong2: "Chicken is an animal.",
        wrong3: "My preferred nourishment is poultry.",
        explanation: "ڕستەیەکی تەواو: 'My favorite food is chicken!'",
      },
    ],
  },
];

export default kidsUnit4;
