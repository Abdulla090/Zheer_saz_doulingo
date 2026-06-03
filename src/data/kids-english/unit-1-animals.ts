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
        explanation: "بڵێ: 'My favorite animal is the cat!' — ڕستەیەکی تەواوی ئاسان.",
      },
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
        explanation: "بڵێ: 'Yes, it is a spider!'",
      },
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
        explanation: "وەڵامی ڕوون: 'I love the dolphin!'",
      },
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
        explanation: "وەڵامێکی دڵخۆشکەر: 'It is a cute puppy!'",
      },
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
  },
];

export default kidsUnit1;
