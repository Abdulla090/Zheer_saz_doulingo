import type { UnitBank } from "../types";

// ── Kids Unit 1: Animals (ئاژەڵەکان) ──────────────────────────────────────────
// Very simple, picture-book English for Kurdish children. Every game in a
// lesson reinforces the same handful of words so they truly stick.
const kidsUnit1: UnitBank = [
  // Lesson 0: Pets
  {
    topic: "Pets", topicKu: "ئاژەڵی ماڵی", topicAr: "الحيوانات الأليفة",
    words: [
      { english: "Dog", kurdish: "سەگ", arabic: "كلب" },
      { english: "Cat", kurdish: "پشیلە", arabic: "قطة" },
      { english: "Bird", kurdish: "باڵندە", arabic: "طائر" },
      { english: "Fish", kurdish: "ماسی", arabic: "سمكة" },
      { english: "Rabbit", kurdish: "کەروێشک", arabic: "أرنب" },
    ],
    voices: [
      { prompt: "بڵێ: ئەمە سەگە", target: "It is a dog.", targetKurdish: "ئەمە سەگە." },
      { prompt: "بڵێ: پشیلەم هەیە", target: "I have a cat.", targetKurdish: "پشیلەم هەیە." },
    ],
    sentences: [
      { english: ["It", "is", "a", "dog"], kurdish: "ئەمە سەگە", arabic: "هذا كلب" },
      { english: ["I", "have", "a", "cat"], kurdish: "پشیلەم هەیە", arabic: "لدي قطة" },
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
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I have a cat.", targetKurdish: "پشیلەم هەیە.", imageRequire: require("../../../assets/images/games/kids_playing_ball.png") },
      { kind: "scene", scene: "playground", prompt: "Find the dog!", correctId: "dog", choices: [{ id: "dog", emoji: "🐶", label: "Dog" }, { id: "cat", emoji: "🐱", label: "Cat" }] },
      { kind: "bubble", prompt: "Pop the fish!", correctId: "fish", choices: [{ id: "fish", emoji: "🐟", label: "Fish" }, { id: "bird", emoji: "🐦", label: "Bird" }] },
      { kind: "feed", mascotEmoji: "🐱", prompt: "Feed the cat a fish!", correctId: "fish", choices: [{ id: "fish", emoji: "🐟", label: "Fish" }, { id: "carrot", emoji: "🥕", label: "Carrot" }] },
      { kind: "shadow", prompt: "Match the pets!", items: [{ id: "dog", emoji: "🐶", label: "Dog" }, { id: "rabbit", emoji: "🐰", label: "Rabbit" }] },
      { kind: "native", kurdishPrompt: "کەروێشکەکە بدۆزەرەوە", correctId: "rabbit", choices: [{ id: "rabbit", emoji: "🐰", label: "Rabbit" }, { id: "bird", emoji: "🐦", label: "Bird" }] },
      { kind: "simon", phrase: "Simon says, pick the bird!", correctId: "bird", choices: [{ id: "bird", emoji: "🐦", label: "Bird" }, { id: "dog", emoji: "🐶", label: "Dog" }] },
      { kind: "train", words: ["It", "is", "a", "dog"], kurdishHint: "ئەمە سەگە" },
      { kind: "trick", showEmoji: "🐱", showLabel: "Cat", spokenWord: "Cat", matches: true },
      { kind: "treasure", correctId: "rabbit", pool: [{ id: "rabbit", emoji: "🐰", label: "Rabbit" }, { id: "fish", emoji: "🐟", label: "Fish" }] }
    ],
  },

  // Lesson 1: Farm Animals
  {
    topic: "Farm Animals", topicKu: "ئاژەڵی کێڵگە", topicAr: "حيوانات المزرعة",
    words: [
      { english: "Cow", kurdish: "مانگا", arabic: "بقرة" },
      { english: "Horse", kurdish: "ئەسپ", arabic: "حصان" },
      { english: "Sheep", kurdish: "مەڕ", arabic: "خروف" },
      { english: "Chicken", kurdish: "مریشک", arabic: "دجاجة" },
      { english: "Duck", kurdish: "مراوی", arabic: "بطة" },
    ],
    voices: [
      { prompt: "بڵێ: مانگاکە گەورەیە", target: "The cow is big.", targetKurdish: "مانگاکە گەورەیە." },
      { prompt: "بڵێ: ئەسپێک دەبینم", target: "I see a horse.", targetKurdish: "ئەسپێک دەبینم." },
    ],
    sentences: [
      { english: ["The", "cow", "is", "big"], kurdish: "مانگاکە گەورەیە", arabic: "البقرة كبيرة" },
      { english: ["I", "see", "a", "horse"], kurdish: "ئەسپێک دەبینم", arabic: "أرى حصانًا" },
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
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I see a horse.", targetKurdish: "ئەسپێک دەبینم.", imageRequire: require("../../../assets/images/games/magical_apple_tree.png") },
      { kind: "scene", scene: "yard", prompt: "Find the cow!", correctId: "cow", choices: [{ id: "cow", emoji: "🐮", label: "Cow" }, { id: "horse", emoji: "🐴", label: "Horse" }] },
      { kind: "bubble", prompt: "Pop the sheep!", correctId: "sheep", choices: [{ id: "sheep", emoji: "🐑", label: "Sheep" }, { id: "chicken", emoji: "🐔", label: "Chicken" }] },
      { kind: "feed", mascotEmoji: "🦆", prompt: "Feed the duck some corn!", correctId: "corn", choices: [{ id: "corn", emoji: "🌽", label: "Corn" }, { id: "meat", emoji: "🍖", label: "Meat" }] },
      { kind: "shadow", prompt: "Match the farm animals!", items: [{ id: "chicken", emoji: "🐔", label: "Chicken" }, { id: "sheep", emoji: "🐑", label: "Sheep" }] },
      { kind: "native", kurdishPrompt: "ئەسپەکە بدۆزەرەوە", correctId: "horse", choices: [{ id: "horse", emoji: "🐴", label: "Horse" }, { id: "duck", emoji: "🦆", label: "Duck" }] },
      { kind: "simon", phrase: "Simon says, pick the chicken!", correctId: "chicken", choices: [{ id: "chicken", emoji: "🐔", label: "Chicken" }, { id: "cow", emoji: "🐮", label: "Cow" }] },
      { kind: "train", words: ["The", "cow", "is", "big"], kurdishHint: "مانگاکە گەورەیە" },
      { kind: "trick", showEmoji: "🦆", showLabel: "Duck", spokenWord: "Duck", matches: true },
      { kind: "treasure", correctId: "cow", pool: [{ id: "cow", emoji: "🐮", label: "Cow" }, { id: "sheep", emoji: "🐑", label: "Sheep" }] }
    ],
  },

  // Lesson 2: Wild Animals
  {
    topic: "Wild Animals", topicKu: "ئاژەڵی کێوی", topicAr: "الحيوانات البرية",
    words: [
      { english: "Lion", kurdish: "شێر", arabic: "أسد" },
      { english: "Elephant", kurdish: "فیل", arabic: "فيل" },
      { english: "Monkey", kurdish: "مەیموون", arabic: "قرد" },
      { english: "Bear", kurdish: "ورچ", arabic: "دب" },
      { english: "Tiger", kurdish: "بەبر", arabic: "نمر" },
    ],
    voices: [
      { prompt: "بڵێ: شێرەکە گەورەیە", target: "The lion is big.", targetKurdish: "شێرەکە گەورەیە." },
      { prompt: "بڵێ: کەیفم بە مەیمون دێت", target: "I like the monkey.", targetKurdish: "کەیفم بە مەیمون دێت." },
    ],
    sentences: [
      { english: ["The", "lion", "is", "big"], kurdish: "شێرەکە گەورەیە", arabic: "الأسد كبير" },
      { english: ["I", "like", "the", "monkey"], kurdish: "کەیفم بە مەیمون دێت", arabic: "أحب القرد" },
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
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The lion is big.", targetKurdish: "شێرەکە گەورەیە.", imageRequire: require("../../../assets/images/games/kids_with_blocks.png") },
      { kind: "scene", scene: "playground", prompt: "Find the monkey!", correctId: "monkey", choices: [{ id: "monkey", emoji: "🐒", label: "Monkey" }, { id: "bear", emoji: "🐻", label: "Bear" }] },
      { kind: "bubble", prompt: "Pop the elephant!", correctId: "elephant", choices: [{ id: "elephant", emoji: "🐘", label: "Elephant" }, { id: "lion", emoji: "🦁", label: "Lion" }] },
      { kind: "feed", mascotEmoji: "🐻", prompt: "Feed the bear honey!", correctId: "honey", choices: [{ id: "honey", emoji: "🍯", label: "Honey" }, { id: "leaf", emoji: "🌿", label: "Leaf" }] },
      { kind: "shadow", prompt: "Match the wild animals!", items: [{ id: "lion", emoji: "🦁", label: "Lion" }, { id: "tiger", emoji: "🐯", label: "Tiger" }] },
      { kind: "native", kurdishPrompt: "ورچەکە بدۆزەرەوە", correctId: "bear", choices: [{ id: "bear", emoji: "🐻", label: "Bear" }, { id: "elephant", emoji: "🐘", label: "Elephant" }] },
      { kind: "simon", phrase: "Simon says, pick the monkey!", correctId: "monkey", choices: [{ id: "monkey", emoji: "🐒", label: "Monkey" }, { id: "tiger", emoji: "🐯", label: "Tiger" }] },
      { kind: "train", words: ["I", "like", "the", "monkey"], kurdishHint: "کەیفم بە مەیمون دێت" },
      { kind: "trick", showEmoji: "🐘", showLabel: "Elephant", spokenWord: "Elephant", matches: true },
      { kind: "treasure", correctId: "tiger", pool: [{ id: "tiger", emoji: "🐯", label: "Tiger" }, { id: "lion", emoji: "🦁", label: "Lion" }] }
    ],
  },

  // Lesson 3: Animals Can...
  {
    topic: "Animals Can", topicKu: "ئاژەڵ دەتوانن", topicAr: "الحيوانات تستطيع",
    words: [
      { english: "Run", kurdish: "ڕاکردن", arabic: "يجري" },
      { english: "Jump", kurdish: "بازدان", arabic: "يقفز" },
      { english: "Swim", kurdish: "مەلەکردن", arabic: "يسبح" },
      { english: "Fly", kurdish: "فڕین", arabic: "يطير" },
      { english: "Eat", kurdish: "خواردن", arabic: "يأكل" },
    ],
    voices: [
      { prompt: "بڵێ: باڵندەکە دەتوانێت بفڕێت", target: "The bird can fly.", targetKurdish: "باڵندەکە دەتوانێت بفڕێت." },
      { prompt: "بڵێ: ماسییەکە دەتوانێت مەلە بکات", target: "The fish can swim.", targetKurdish: "ماسییەکە دەتوانێت مەلە بکات." },
    ],
    sentences: [
      { english: ["The", "bird", "can", "fly"], kurdish: "باڵندەکە دەتوانێت بفڕێت", arabic: "الطائر يستطيع الطيران" },
      { english: ["The", "fish", "can", "swim"], kurdish: "ماسییەکە دەتوانێت مەلە بکات", arabic: "السمكة تستطيع السباحة" },
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
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The bird can fly.", targetKurdish: "باڵندەکە دەتوانێت بفڕێت.", imageRequire: require("../../../assets/images/games/kids_playing_ball.png") },
      { kind: "scene", scene: "playground", prompt: "Find jump!", correctId: "jump", choices: [{ id: "jump", emoji: "🦘", label: "Jump" }, { id: "swim", emoji: "🏊", label: "Swim" }] },
      { kind: "bubble", prompt: "Pop run!", correctId: "run", choices: [{ id: "run", emoji: "🏃", label: "Run" }, { id: "fly", emoji: "🕊️", label: "Fly" }] },
      { kind: "feed", mascotEmoji: "🐼", prompt: "Feed the panda bamboo!", correctId: "eat", choices: [{ id: "eat", emoji: "🎋", label: "Eat" }, { id: "run", emoji: "🏃", label: "Run" }] },
      { kind: "shadow", prompt: "Match the actions!", items: [{ id: "swim", emoji: "🏊", label: "Swim" }, { id: "fly", emoji: "🕊️", label: "Fly" }] },
      { kind: "native", kurdishPrompt: "مەلەکردن بدۆزەرەوە", correctId: "swim", choices: [{ id: "swim", emoji: "🏊", label: "Swim" }, { id: "jump", emoji: "🦘", label: "Jump" }] },
      { kind: "simon", phrase: "Simon says, pick jump!", correctId: "jump", choices: [{ id: "jump", emoji: "🦘", label: "Jump" }, { id: "eat", emoji: "🍕", label: "Eat" }] },
      { kind: "train", words: ["The", "fish", "can", "swim"], kurdishHint: "ماسییەکە دەتوانێت مەلە بکات" },
      { kind: "trick", showEmoji: "🕊️", showLabel: "Fly", spokenWord: "Fly", matches: true },
      { kind: "treasure", correctId: "run", pool: [{ id: "run", emoji: "🏃", label: "Run" }, { id: "swim", emoji: "🏊", label: "Swim" }] }
    ],
  },

  // Lesson 4: My Favorite Animal
  {
    topic: "Favorite Animal", topicKu: "ئاژەڵی دڵخواز", topicAr: "الحيوان المفضل",
    words: [
      { english: "Favorite", kurdish: "دڵخواز", arabic: "مفضل" },
      { english: "Big", kurdish: "گەورە", arabic: "كبير" },
      { english: "Small", kurdish: "بچووک", arabic: "صغير" },
      { english: "Cute", kurdish: "نازدار", arabic: "لطيف" },
      { english: "Animal", kurdish: "ئاژەڵ", arabic: "حيوان" },
    ],
    voices: [
      { prompt: "بڵێ: ئاژەڵی دڵخوازم پشیلەیە", target: "My favorite animal is the cat.", targetKurdish: "ئاژەڵی دڵخوازم پشیلەیە." },
      { prompt: "بڵێ: کەروێشکەکە نازدارە", target: "The rabbit is cute.", targetKurdish: "کەروێشکەکە نازدارە." },
    ],
    sentences: [
      { english: ["The", "dog", "is", "big"], kurdish: "سەگەکە گەورەیە", arabic: "الكلب كبير" },
      { english: ["The", "cat", "is", "cute"], kurdish: "پشیلەکە نازدارە", arabic: "القطة لطيفة" },
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
        explanation: "بۆ منداڵان بڵێ: 'My favorite animal is the cat!' — ڕستەیەکی تەواوی ئاسان.",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The rabbit is cute.", targetKurdish: "کەروێشکەکە نازدارە.", imageRequire: require("../../../assets/images/games/kids_hugging.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find small!", correctId: "small", choices: [{ id: "small", emoji: "🐭", label: "Small" }, { id: "big", emoji: "🐘", label: "Big" }] },
      { kind: "bubble", prompt: "Pop big!", correctId: "big", choices: [{ id: "big", emoji: "🦁", label: "Big" }, { id: "small", emoji: "🐜", label: "Small" }] },
      { kind: "feed", mascotEmoji: "🐶", prompt: "Feed the animal dog food!", correctId: "animal", choices: [{ id: "animal", emoji: "🍖", label: "Animal" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match sizes!", items: [{ id: "small", emoji: "🐭", label: "Small" }, { id: "cute", emoji: "🐰", label: "Cute" }] },
      { kind: "native", kurdishPrompt: "گەورە بدۆزەرەوە", correctId: "big", choices: [{ id: "big", emoji: "🐘", label: "Big" }, { id: "small", emoji: "🐜", label: "Small" }] },
      { kind: "simon", phrase: "Simon says, pick favorite!", correctId: "favorite", choices: [{ id: "favorite", emoji: "❤️", label: "Favorite" }, { id: "animal", emoji: "🦖", label: "Animal" }] },
      { kind: "train", words: ["The", "cat", "is", "cute"], kurdishHint: "پشیلەکە نازدارە" },
      { kind: "trick", showEmoji: "🐰", showLabel: "Cute", spokenWord: "Cute", matches: true },
      { kind: "treasure", correctId: "animal", pool: [{ id: "animal", emoji: "🐼", label: "Animal" }, { id: "stone", emoji: "🪨", label: "Stone" }] }
    ],
  },

  // Lesson 5: Birds
  {
    topic: "Birds", topicKu: "باڵندەکان", topicAr: "الطيور",
    words: [
      { english: "Eagle", kurdish: "هەڵۆ", arabic: "نسر" },
      { english: "Owl", kurdish: "کوندەپەپوو", arabic: "بومة" },
      { english: "Parrot", kurdish: "تووتی", arabic: "ببغاء" },
      { english: "Wing", kurdish: "باڵ", arabic: "جناح" },
      { english: "Sky", kurdish: "ئاسمان", arabic: "سماء" },
    ],
    voices: [
      { prompt: "بڵێ: هەڵۆکە دەفڕێت", target: "The eagle flies.", targetKurdish: "هەڵۆکە دەفڕێت." },
      { prompt: "بڵێ: تووتییەکە قسە دەکات", target: "The parrot talks.", targetKurdish: "تووتییەکە قسە دەکات." },
    ],
    sentences: [
      { english: ["The", "eagle", "flies"], kurdish: "هەڵۆکە دەفڕێت", arabic: "النسر يطير" },
      { english: ["The", "parrot", "talks"], kurdish: "تووتییەکە قسە دەکات", arabic: "الببغاء يتحدث" },
    ],
    fillBlanks: [
      { parts: ["A bird has two", ""], hint: "باڵندە دوو باڵی هەیە", answer: "wings", wrongs: ["legs", "eyes", "ears"] },
      { parts: ["The eagle is in the", ""], hint: "هەڵۆکە لە ئاسمانە", answer: "sky", wrongs: ["water", "house", "tree"] },
    ],
    conversations: [
      {
        situation: "باڵندەیەک دەبینیت و هاوڕێیەک دەپرسێت ئەوە چییە",
        theyAsk: "What kind of bird is that?",
        correct: "It is an eagle!",
        wrong1: "Eagle flies.",
        wrong2: "That is a sky.",
        wrong3: "I observe a predatory avian.",
        explanation: "وەڵامی ئاسان بۆ منداڵ: 'It is an eagle!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The eagle flies.", targetKurdish: "هەڵۆکە دەفڕێت.", imageRequire: require("../../../assets/images/games/colorful_parrot.png") },
      { kind: "scene", scene: "night", prompt: "Find sky!", correctId: "sky", choices: [{ id: "sky", emoji: "🌌", label: "Sky" }, { id: "owl", emoji: "🦉", label: "Owl" }] },
      { kind: "bubble", prompt: "Pop owl!", correctId: "owl", choices: [{ id: "owl", emoji: "🦉", label: "Owl" }, { id: "eagle", emoji: "🦅", label: "Eagle" }] },
      { kind: "feed", mascotEmoji: "🦜", prompt: "Feed the parrot seeds!", correctId: "seeds", choices: [{ id: "seeds", emoji: "🌻", label: "Seeds" }, { id: "stone", emoji: "🪨", label: "Stone" }] },
      { kind: "shadow", prompt: "Match the bird parts!", items: [{ id: "eagle", emoji: "🦅", label: "Eagle" }, { id: "wing", emoji: "🪶", label: "Wing" }] },
      { kind: "native", kurdishPrompt: "کوندەپەپوو بدۆزەرەوە", correctId: "owl", choices: [{ id: "owl", emoji: "🦉", label: "Owl" }, { id: "sky", emoji: "☁️", label: "Sky" }] },
      { kind: "simon", phrase: "Simon says, pick parrot!", correctId: "parrot", choices: [{ id: "parrot", emoji: "🦜", label: "Parrot" }, { id: "wing", emoji: "🪶", label: "Wing" }] },
      { kind: "train", words: ["The", "parrot", "talks"], kurdishHint: "تووتییەکە قسە دەکات" },
      { kind: "trick", showEmoji: "☁️", showLabel: "Sky", spokenWord: "Sky", matches: true },
      { kind: "treasure", correctId: "eagle", pool: [{ id: "eagle", emoji: "🦅", label: "Eagle" }, { id: "wing", emoji: "🪶", label: "Wing" }] }
    ],
  },

  // Lesson 6: Bugs & Insects
  {
    topic: "Bugs", topicKu: "مێرووەکان", topicAr: "الحشرات",
    words: [
      { english: "Ant", kurdish: "مێروولە", arabic: "نملة" },
      { english: "Bee", kurdish: "هەنگ", arabic: "نحلة" },
      { english: "Butterfly", kurdish: "پەپوولە", arabic: "فراشة" },
      { english: "Spider", kurdish: "جاڵجاڵۆکە", arabic: "عنكبوت" },
      { english: "Small", kurdish: "بچووک", arabic: "صغير" },
    ],
    voices: [
      { prompt: "بڵێ: مێروولەکە بچووکە", target: "The ant is small.", targetKurdish: "مێروولەکە بچووکە." },
      { prompt: "بڵێ: پەپوولەکە جوانە", target: "The butterfly is pretty.", targetKurdish: "پەپوولەکە جوانە." },
    ],
    sentences: [
      { english: ["The", "ant", "is", "small"], kurdish: "مێروولەکە بچووکە", arabic: "النملة صغيرة" },
      { english: ["The", "butterfly", "is", "pretty"], kurdish: "پەپوولەکە جوانە", arabic: "الفراشة جميلة" },
    ],
    fillBlanks: [
      { parts: ["A", "makes honey"], hint: "هەنگ هەنگوین دروست دەکات", answer: "bee", wrongs: ["ant", "spider", "fly"] },
      { parts: ["The", "has eight legs"], hint: "جاڵجاڵۆکە هەشت قاچی هەیە", answer: "spider", wrongs: ["bee", "ant", "butterfly"] },
    ],
    conversations: [
      {
        situation: "مێروویەک دەبینیت و هاوڕێیەک دەپرسێت لە چی دەترسیت",
        theyAsk: "Are you scared of the bug?",
        correct: "Yes, it is a spider!",
        wrong1: "Spider is small.",
        wrong2: "I see a butterfly.",
        wrong3: "Arachnids induce fear.",
        explanation: "بڵێ: 'Yes, it is a spider!'" ,
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The ant is small.", targetKurdish: "مێروولەکە بچووکە.", imageRequire: require("../../../assets/images/games/girl_helping_mother.png") },
      { kind: "scene", scene: "yard", prompt: "Find spider!", correctId: "spider", choices: [{ id: "spider", emoji: "🕷️", label: "Spider" }, { id: "ant", emoji: "🐜", label: "Ant" }] },
      { kind: "bubble", prompt: "Pop butterfly!", correctId: "butterfly", choices: [{ id: "butterfly", emoji: "🦋", label: "Butterfly" }, { id: "bee", emoji: "🐝", label: "Bee" }] },
      { kind: "feed", mascotEmoji: "🐝", prompt: "Feed the bee honey!", correctId: "honey", choices: [{ id: "honey", emoji: "🍯", label: "Honey" }, { id: "leaf", emoji: "🍂", label: "Leaf" }] },
      { kind: "shadow", prompt: "Match the bugs!", items: [{ id: "ant", emoji: "🐜", label: "Ant" }, { id: "bee", emoji: "🐝", label: "Bee" }] },
      { kind: "native", kurdishPrompt: "پەپوولەکە بدۆزەرەوە", correctId: "butterfly", choices: [{ id: "butterfly", emoji: "🦋", label: "Butterfly" }, { id: "spider", emoji: "🕷️", label: "Spider" }] },
      { kind: "simon", phrase: "Simon says, pick spider!", correctId: "spider", choices: [{ id: "spider", emoji: "🕷️", label: "Spider" }, { id: "ant", emoji: "🐜", label: "Ant" }] },
      { kind: "train", words: ["The", "ant", "is", "small"], kurdishHint: "مێروولەکە بچووکە" },
      { kind: "trick", showEmoji: "🦋", showLabel: "Butterfly", spokenWord: "Butterfly", matches: true },
      { kind: "treasure", correctId: "bee", pool: [{ id: "bee", emoji: "🐝", label: "Bee" }, { id: "spider", emoji: "🕷️", label: "Spider" }] }
    ],
  },

  // Lesson 7: Sea Animals
  {
    topic: "Sea Animals", topicKu: "ئاژەڵی دەریایی", topicAr: "حيوانات البحر",
    words: [
      { english: "Dolphin", kurdish: "دۆلفین", arabic: "دلفين" },
      { english: "Whale", kurdish: "نەهەنگ", arabic: "حوت" },
      { english: "Shark", kurdish: "قەرش", arabic: "قرش" },
      { english: "Turtle", kurdish: "کیسەڵ", arabic: "سلحفاة" },
      { english: "Ocean", kurdish: "زەریا", arabic: "محيط" },
    ],
    voices: [
      { prompt: "بڵێ: نەهەنگەکە زۆر گەورەیە", target: "The whale is very big.", targetKurdish: "نەهەنگەکە زۆر گەورەیە." },
      { prompt: "بڵێ: کیسەڵەکە هێواشە", target: "The turtle is slow.", targetKurdish: "کیسەڵەکە هێواشە." },
    ],
    sentences: [
      { english: ["The", "whale", "is", "very", "big"], kurdish: "نەهەنگەکە زۆر گەورەیە", arabic: "الحوت كبير جدًا" },
      { english: ["The", "turtle", "is", "slow"], kurdish: "کیسەڵەکە هێواشە", arabic: "السلحفاة بطيئة" },
    ],
    fillBlanks: [
      { parts: ["The", "jumps in the water"], hint: "دۆلفینەکە لە ئاودا بازدەدات", answer: "dolphin", wrongs: ["turtle", "shark", "bird"] },
      { parts: ["They live in the", ""], hint: "ئەوان لە زەریادا دەژین", answer: "ocean", wrongs: ["sky", "tree", "house"] },
    ],
    conversations: [
      {
        situation: "لە باخی ئاژەڵان دەچیتە بەشی ماسییەکان",
        theyAsk: "What is your favorite sea animal?",
        correct: "I love the dolphin!",
        wrong1: "Dolphin is sea.",
        wrong2: "I see a shark.",
        wrong3: "Marine mammals are my preference.",
        explanation: "وەڵامی ڕوون: 'I love the dolphin!'" ,
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The turtle is slow.", targetKurdish: "کیسەڵەکە هێواشە.", imageRequire: require("../../../assets/images/games/kids_playing_ball.png") },
      { kind: "scene", scene: "playground", prompt: "Find dolphin!", correctId: "dolphin", choices: [{ id: "dolphin", emoji: "🐬", label: "Dolphin" }, { id: "shark", emoji: "🦈", label: "Shark" }] },
      { kind: "bubble", prompt: "Pop shark!", correctId: "shark", choices: [{ id: "shark", emoji: "🦈", label: "Shark" }, { id: "whale", emoji: "🐋", label: "Whale" }] },
      { kind: "feed", mascotEmoji: "🐋", prompt: "Feed the whale small fish!", correctId: "fish", choices: [{ id: "fish", emoji: "🐟", label: "Fish" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match the sea animals!", items: [{ id: "dolphin", emoji: "🐬", label: "Dolphin" }, { id: "turtle", emoji: "🐢", label: "Turtle" }] },
      { kind: "native", kurdishPrompt: "قەرشەکە بدۆزەرەوە", correctId: "shark", choices: [{ id: "shark", emoji: "🦈", label: "Shark" }, { id: "dolphin", emoji: "🐬", label: "Dolphin" }] },
      { kind: "simon", phrase: "Simon says, pick ocean!", correctId: "ocean", choices: [{ id: "ocean", emoji: "🌊", label: "Ocean" }, { id: "turtle", emoji: "🐢", label: "Turtle" }] },
      { kind: "train", words: ["The", "whale", "is", "very", "big"], kurdishHint: "نەهەنگەکە زۆر گەورەیە" },
      { kind: "trick", showEmoji: "🐬", showLabel: "Dolphin", spokenWord: "Dolphin", matches: true },
      { kind: "treasure", correctId: "turtle", pool: [{ id: "turtle", emoji: "🐢", label: "Turtle" }, { id: "shark", emoji: "🦈", label: "Shark" }] }
    ],
  },

  // Lesson 8: Animal Babies
  {
    topic: "Animal Babies", topicKu: "بەچکەی ئاژەڵان", topicAr: "صغار الحيوانات",
    words: [
      { english: "Puppy", kurdish: "بەچکە سەگ", arabic: "جرو" },
      { english: "Kitten", kurdish: "بەچکە پشیلە", arabic: "هريرة" },
      { english: "Baby", kurdish: "بەچکە (یان منداڵ)", arabic: "طفل" },
      { english: "Play", kurdish: "یاریکردن", arabic: "يلعب" },
      { english: "Sleep", kurdish: "خەوتن", arabic: "ينام" },
    ],
    voices: [
      { prompt: "بڵێ: بەچکە سەگەکە یاری دەکات", target: "The puppy plays.", targetKurdish: "بەچکە سەگەکە یاری دەکات." },
      { prompt: "بڵێ: بەچکە پشیلەکە دەخەوێت", target: "The kitten sleeps.", targetKurdish: "بەچکە پشیلەکە دەخەوێت." },
    ],
    sentences: [
      { english: ["The", "puppy", "plays"], kurdish: "بەچکە سەگەکە یاری دەکات", arabic: "الجرو يلعب" },
      { english: ["The", "kitten", "sleeps"], kurdish: "بەچکە پشیلەکە دەخەوێت", arabic: "الهريرة تنام" },
    ],
    fillBlanks: [
      { parts: ["A baby dog is a", ""], hint: "بەچکەی سەگ پێی دەوترێت پۆپی", answer: "puppy", wrongs: ["kitten", "cat", "bird"] },
      { parts: ["A baby cat is a", ""], hint: "بەچکەی پشیلە پێی دەوترێت کیتن", answer: "kitten", wrongs: ["puppy", "dog", "bear"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەک بەچکە سەگێکت پیشان دەدات",
        theyAsk: "Look at the baby dog!",
        correct: "It is a cute puppy!",
        wrong1: "It is a dog.",
        wrong2: "Puppy sleeps.",
        wrong3: "That is a juvenile canine.",
        explanation: "وەڵامێکی دڵخۆشکەر: 'It is a cute puppy!'" ,
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The puppy plays.", targetKurdish: "بەچکە سەگەکە یاری دەکات.", imageRequire: require("../../../assets/images/games/kids_hugging.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find kitten!", correctId: "kitten", choices: [{ id: "kitten", emoji: "🐱", label: "Kitten" }, { id: "puppy", emoji: "🐶", label: "Puppy" }] },
      { kind: "bubble", prompt: "Pop puppy!", correctId: "puppy", choices: [{ id: "puppy", emoji: "🐶", label: "Puppy" }, { id: "baby", emoji: "👶", label: "Baby" }] },
      { kind: "feed", mascotEmoji: "👶", prompt: "Give the baby milk!", correctId: "milk", choices: [{ id: "milk", emoji: "🍼", label: "Milk" }, { id: "bone", emoji: "🦴", label: "Bone" }] },
      { kind: "shadow", prompt: "Match the baby actions!", items: [{ id: "play", emoji: "⚽", label: "Play" }, { id: "sleep", emoji: "💤", label: "Sleep" }] },
      { kind: "native", kurdishPrompt: "بەچکە پشیلەکە بدۆزەرەوە", correctId: "kitten", choices: [{ id: "kitten", emoji: "🐱", label: "Kitten" }, { id: "baby", emoji: "👶", label: "Baby" }] },
      { kind: "simon", phrase: "Simon says, pick sleep!", correctId: "sleep", choices: [{ id: "sleep", emoji: "💤", label: "Sleep" }, { id: "play", emoji: "🏀", label: "Play" }] },
      { kind: "train", words: ["The", "kitten", "sleeps"], kurdishHint: "بەچکە پشیلەکە دەخەوێت" },
      { kind: "trick", showEmoji: "⚽", showLabel: "Play", spokenWord: "Play", matches: true },
      { kind: "treasure", correctId: "puppy", pool: [{ id: "puppy", emoji: "🐶", label: "Puppy" }, { id: "kitten", emoji: "🐱", label: "Kitten" }] }
    ],
  },

  // Lesson 9: Zoo Animals
  {
    topic: "Zoo Animals", topicKu: "ئاژەڵی باخی ئاژەڵان", topicAr: "حيوانات حديقة الحيوان",
    words: [
      { english: "Zoo", kurdish: "باخی ئاژەڵان", arabic: "حديقة الحيوان" },
      { english: "Zebra", kurdish: "کەرەکێوی", arabic: "حمار وحشي" },
      { english: "Giraffe", kurdish: "زەڕافە", arabic: "زرافة" },
      { english: "Tall", kurdish: "باڵابەرز", arabic: "طويل" },
      { english: "Look", kurdish: "سەیرکردن", arabic: "ينظر" },
    ],
    voices: [
      { prompt: "بڵێ: ئێمە دەچین بۆ باخی ئاژەڵان", target: "We go to the zoo.", targetKurdish: "ئێمە دەچین بۆ باخی ئاژەڵان." },
      { prompt: "بڵێ: زەڕافەکە باڵابەرزە", target: "The giraffe is tall.", targetKurdish: "زەڕافەکە باڵابەرزە." },
    ],
    sentences: [
      { english: ["We", "go", "to", "the", "zoo"], kurdish: "ئێمە دەچین بۆ باخی ئاژەڵان", arabic: "نحن نذهب إلى حديقة الحيوان" },
      { english: ["The", "giraffe", "is", "tall"], kurdish: "زەڕافەکە باڵابەرزە", arabic: "الزرافة طويلة" },
    ],
    fillBlanks: [
      { parts: ["The", "has black and white stripes"], hint: "کەرەکێوی خەتی ڕەش و سپی هەیە", answer: "zebra", wrongs: ["horse", "lion", "bear"] },
      { parts: ["Look at the tall", ""], hint: "سەیری زەڕافە باڵابەرزەکە بکە", answer: "giraffe", wrongs: ["zebra", "lion", "monkey"] },
    ],
    conversations: [
      {
        situation: "لە باخی ئاژەڵان هاوڕێیەک دەپرسێت چیت دەوێت بیبینیت",
        theyAsk: "What do you want to see?",
        correct: "I want to see the zebra!",
        wrong1: "Zebra is black and white.",
        wrong2: "I want to see.",
        wrong3: "I desire to observe the striped equine.",
        explanation: "ڕستەیەکی تەواو بڵێ: 'I want to see the zebra!'",
      },
    ],
    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The giraffe is tall.", targetKurdish: "زەڕافەکە باڵابەرزە.", imageRequire: require("../../../assets/images/games/kids_playing_ball.png") },
      { kind: "scene", scene: "playground", prompt: "Find giraffe!", correctId: "giraffe", choices: [{ id: "giraffe", emoji: "🦒", label: "Giraffe" }, { id: "zebra", emoji: "🦓", label: "Zebra" }] },
      { kind: "bubble", prompt: "Pop zebra!", correctId: "zebra", choices: [{ id: "zebra", emoji: "🦓", label: "Zebra" }, { id: "zoo", emoji: "🦁", label: "Zoo" }] },
      { kind: "feed", mascotEmoji: "🦒", prompt: "Feed the giraffe green leaves!", correctId: "leaves", choices: [{ id: "leaves", emoji: "🌿", label: "Leaves" }, { id: "bone", emoji: "🦴", label: "Bone" }] },
      { kind: "shadow", prompt: "Match the zoo actions!", items: [{ id: "tall", emoji: "🦒", label: "Tall" }, { id: "look", emoji: "👀", label: "Look" }] },
      { kind: "native", kurdishPrompt: "کەرەکێوی بدۆزەرەوە", correctId: "zebra", choices: [{ id: "zebra", emoji: "🦓", label: "Zebra" }, { id: "giraffe", emoji: "🦒", label: "Giraffe" }] },
      { kind: "simon", phrase: "Simon says, look at the giraffe!", correctId: "look", choices: [{ id: "look", emoji: "👀", label: "Look" }, { id: "zoo", emoji: "🎪", label: "Zoo" }] },
      { kind: "train", words: ["We", "go", "to", "the", "zoo"], kurdishHint: "ئێمە دەچین بۆ باخی ئاژەڵان" },
      { kind: "trick", showEmoji: "🦒", showLabel: "Giraffe", spokenWord: "Giraffe", matches: true },
      { kind: "treasure", correctId: "giraffe", pool: [{ id: "giraffe", emoji: "🦒", label: "Giraffe" }, { id: "zebra", emoji: "🦓", label: "Zebra" }] }
    ],
  },
];

export default kidsUnit1;
