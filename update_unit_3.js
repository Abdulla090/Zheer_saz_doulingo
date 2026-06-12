const fs = require('fs');

const brainPath = "C:\\\\Users\\\\TOTAL TECH\\\\.gemini\\\\antigravity\\\\brain\\\\a390a759-0c0e-4ab0-9fe9-e5b5e8fea6b2\\\\";
const assetsPath = "assets/images/games/";

const imageMappings = {
  "kid_waking_up.png": "kid_waking_up_1781300410228.png",
  "kid_eating_apple.png": "kid_eating_apple_1781300420618.png",
  "kids_playing_ball.png": "kids_playing_ball_1781300431138.png",
  "kid_wearing_shoes.png": "kid_wearing_shoes_1781300440006.png",
  "family_at_home.png": "family_at_home_1781300459658.png",
  "kid_taking_bath.png": "kid_taking_bath_1781300473083.png",
  "kid_reading_book.png": "kid_reading_book_1781300484012.png"
};

for (const [dest, src] of Object.entries(imageMappings)) {
  fs.copyFileSync(brainPath + src, assetsPath + dest);
}

const filePath = "src/data/kids-english/unit-3-daily-routines.ts";
let content = fs.readFileSync(filePath, 'utf-8');

const gamesData = [
  // Lesson 0: Good Morning
  `    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "I wake up.", targetKurdish: "لە خەو هەڵدەستم.", imageRequire: require("../../../assets/images/games/kid_waking_up.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the water!", correctId: "water", choices: [{ id: "water", emoji: "💧", label: "Water" }, { id: "fire", emoji: "🔥", label: "Fire" }] },
      { kind: "bubble", prompt: "Pop the happy face!", correctId: "happy", choices: [{ id: "happy", emoji: "😀", label: "Happy" }, { id: "sad", emoji: "😢", label: "Sad" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the child water!", correctId: "water", choices: [{ id: "water", emoji: "💧", label: "Water" }, { id: "rock", emoji: "🪨", label: "Rock" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "sun", emoji: "☀️", label: "Sun" }, { id: "moon", emoji: "🌙", label: "Moon" }] },
      { kind: "native", kurdishPrompt: "دەموچاو بدۆزەرەوە", correctId: "face", choices: [{ id: "face", emoji: "👦", label: "Face" }, { id: "hand", emoji: "🖐️", label: "Hand" }] },
      { kind: "simon", phrase: "Simon says, pick the sun!", correctId: "sun", choices: [{ id: "sun", emoji: "☀️", label: "Sun" }, { id: "cloud", emoji: "☁️", label: "Cloud" }] },
      { kind: "train", words: ["I", "wake", "up"], kurdishHint: "لە خەو هەڵدەستم" },
      { kind: "trick", showEmoji: "☀️", showLabel: "Sun", spokenWord: "Sun", matches: true },
      { kind: "treasure", correctId: "star", pool: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],`,
  // Lesson 1: Hungry
  `    kidsGames: [
      { kind: "echo", prompt: "What is he doing?", target: "I eat an apple.", targetKurdish: "سێوێک دەخۆم.", imageRequire: require("../../../assets/images/games/kid_eating_apple.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the apple!", correctId: "apple", choices: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "bread", emoji: "🍞", label: "Bread" }] },
      { kind: "bubble", prompt: "Pop the milk!", correctId: "milk", choices: [{ id: "milk", emoji: "🥛", label: "Milk" }, { id: "juice", emoji: "🧃", label: "Juice" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the child bread!", correctId: "bread", choices: [{ id: "bread", emoji: "🍞", label: "Bread" }, { id: "rock", emoji: "🪨", label: "Rock" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "milk", emoji: "🥛", label: "Milk" }] },
      { kind: "native", kurdishPrompt: "سێوەکە بدۆزەرەوە", correctId: "apple", choices: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "banana", emoji: "🍌", label: "Banana" }] },
      { kind: "simon", phrase: "Simon says, pick the bread!", correctId: "bread", choices: [{ id: "bread", emoji: "🍞", label: "Bread" }, { id: "cake", emoji: "🍰", label: "Cake" }] },
      { kind: "train", words: ["I", "am", "hungry"], kurdishHint: "من برسیمە" },
      { kind: "trick", showEmoji: "🍎", showLabel: "Apple", spokenWord: "Apple", matches: true },
      { kind: "treasure", correctId: "coin", pool: [{ id: "coin", emoji: "🪙", label: "Coin" }, { id: "shoe", emoji: "👞", label: "Shoe" }] }
    ],`,
  // Lesson 2: Play Time
  `    kidsGames: [
      { kind: "echo", prompt: "What are they doing?", target: "We play with a ball.", targetKurdish: "یاری بە تۆپ دەکەین.", imageRequire: require("../../../assets/images/games/kids_playing_ball.png") },
      { kind: "scene", scene: "playground", prompt: "Find the ball!", correctId: "ball", choices: [{ id: "ball", emoji: "⚽", label: "Ball" }, { id: "shoe", emoji: "👞", label: "Shoe" }] },
      { kind: "bubble", prompt: "Pop the running shoe!", correctId: "shoe", choices: [{ id: "shoe", emoji: "👟", label: "Shoe" }, { id: "sock", emoji: "🧦", label: "Sock" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the child a ball!", correctId: "ball", choices: [{ id: "ball", emoji: "⚽", label: "Ball" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "ball", emoji: "⚽", label: "Ball" }, { id: "kite", emoji: "🪁", label: "Kite" }] },
      { kind: "native", kurdishPrompt: "تۆپەکە بدۆزەرەوە", correctId: "ball", choices: [{ id: "ball", emoji: "⚽", label: "Ball" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "simon", phrase: "Simon says, jump high!", correctId: "jump", choices: [{ id: "jump", emoji: "🦘", label: "Jump" }, { id: "sit", emoji: "🪑", label: "Sit" }] },
      { kind: "train", words: ["We", "play", "fun", "games"], kurdishHint: "یاری خۆش دەکەین" },
      { kind: "trick", showEmoji: "⚽", showLabel: "Ball", spokenWord: "Ball", matches: true },
      { kind: "treasure", correctId: "medal", pool: [{ id: "medal", emoji: "🥇", label: "Medal" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],`,
  // Lesson 3: My Clothes
  `    kidsGames: [
      { kind: "echo", prompt: "Describe the clothes:", target: "I wear a shirt.", targetKurdish: "کراسێک لەبەر دەکەم.", imageRequire: require("../../../assets/images/games/kid_wearing_shoes.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the shoes!", correctId: "shoes", choices: [{ id: "shoes", emoji: "👟", label: "Shoes" }, { id: "hat", emoji: "🧢", label: "Hat" }] },
      { kind: "bubble", prompt: "Pop the pants!", correctId: "pants", choices: [{ id: "pants", emoji: "👖", label: "Pants" }, { id: "shirt", emoji: "👕", label: "Shirt" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the child a shirt!", correctId: "shirt", choices: [{ id: "shirt", emoji: "👕", label: "Shirt" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "shirt", emoji: "👕", label: "Shirt" }, { id: "pants", emoji: "👖", label: "Pants" }] },
      { kind: "native", kurdishPrompt: "پێڵاوەکان بدۆزەرەوە", correctId: "shoes", choices: [{ id: "shoes", emoji: "👟", label: "Shoes" }, { id: "sock", emoji: "🧦", label: "Sock" }] },
      { kind: "simon", phrase: "Simon says, pick the shirt!", correctId: "shirt", choices: [{ id: "shirt", emoji: "👕", label: "Shirt" }, { id: "pants", emoji: "👖", label: "Pants" }] },
      { kind: "train", words: ["I", "am", "cold"], kurdishHint: "من سەرمامە" },
      { kind: "trick", showEmoji: "👕", showLabel: "Shirt", spokenWord: "Shirt", matches: true },
      { kind: "treasure", correctId: "gem", pool: [{ id: "gem", emoji: "💎", label: "Gem" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],`,
  // Lesson 4: Family House
  `    kidsGames: [
      { kind: "echo", prompt: "What is this?", target: "This is my house.", targetKurdish: "ئەمە خانووی منە.", imageRequire: require("../../../assets/images/games/family_at_home.png") },
      { kind: "scene", scene: "yard", prompt: "Find the door!", correctId: "door", choices: [{ id: "door", emoji: "🚪", label: "Door" }, { id: "window", emoji: "🪟", label: "Window" }] },
      { kind: "bubble", prompt: "Pop the house!", correctId: "house", choices: [{ id: "house", emoji: "🏠", label: "House" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "feed", mascotEmoji: "👩", prompt: "Give Mom a flower!", correctId: "flower", choices: [{ id: "flower", emoji: "🌸", label: "Flower" }, { id: "rock", emoji: "🪨", label: "Rock" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "door", emoji: "🚪", label: "Door" }, { id: "house", emoji: "🏠", label: "House" }] },
      { kind: "native", kurdishPrompt: "خانووەکە بدۆزەرەوە", correctId: "house", choices: [{ id: "house", emoji: "🏠", label: "House" }, { id: "tree", emoji: "🌳", label: "Tree" }] },
      { kind: "simon", phrase: "Simon says, open the door!", correctId: "door", choices: [{ id: "door", emoji: "🚪", label: "Door" }, { id: "window", emoji: "🪟", label: "Window" }] },
      { kind: "train", words: ["Open", "the", "door"], kurdishHint: "دەرگاکە بکەرەوە" },
      { kind: "trick", showEmoji: "🏠", showLabel: "House", spokenWord: "House", matches: true },
      { kind: "treasure", correctId: "key", pool: [{ id: "key", emoji: "🗝️", label: "Key" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],`,
  // Lesson 5: Bath Time
  `    kidsGames: [
      { kind: "echo", prompt: "What is the child doing?", target: "I take a bath.", targetKurdish: "خۆم دەشۆم.", imageRequire: require("../../../assets/images/games/kid_taking_bath.png") },
      { kind: "scene", scene: "bathroom", prompt: "Find the soap!", correctId: "soap", choices: [{ id: "soap", emoji: "🧼", label: "Soap" }, { id: "towel", emoji: "🛁", label: "Towel" }] },
      { kind: "bubble", prompt: "Pop the water drop!", correctId: "water", choices: [{ id: "water", emoji: "💧", label: "Water" }, { id: "fire", emoji: "🔥", label: "Fire" }] },
      { kind: "feed", mascotEmoji: "🦆", prompt: "Give the duck some soap!", correctId: "soap", choices: [{ id: "soap", emoji: "🧼", label: "Soap" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "soap", emoji: "🧼", label: "Soap" }, { id: "duck", emoji: "🦆", label: "Duck" }] },
      { kind: "native", kurdishPrompt: "سابوونەکە بدۆزەرەوە", correctId: "soap", choices: [{ id: "soap", emoji: "🧼", label: "Soap" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "simon", phrase: "Simon says, pick the duck!", correctId: "duck", choices: [{ id: "duck", emoji: "🦆", label: "Duck" }, { id: "cat", emoji: "🐱", label: "Cat" }] },
      { kind: "train", words: ["I", "wash", "my", "hands"], kurdishHint: "دەستەکانم دەشۆم" },
      { kind: "trick", showEmoji: "🧼", showLabel: "Soap", spokenWord: "Soap", matches: true },
      { kind: "treasure", correctId: "bubble", pool: [{ id: "bubble", emoji: "🫧", label: "Bubble" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],`,
  // Lesson 6: School Time
  `    kidsGames: [
      { kind: "echo", prompt: "What is he doing?", target: "I read a book.", targetKurdish: "کتێبێک دەخوێنمەوە.", imageRequire: require("../../../assets/images/games/kid_reading_book.png") },
      { kind: "scene", scene: "classroom", prompt: "Find the book!", correctId: "book", choices: [{ id: "book", emoji: "📖", label: "Book" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "bubble", prompt: "Pop the teacher!", correctId: "teacher", choices: [{ id: "teacher", emoji: "👩‍🏫", label: "Teacher" }, { id: "policeman", emoji: "👮", label: "Policeman" }] },
      { kind: "feed", mascotEmoji: "🧒", prompt: "Give the child a book!", correctId: "book", choices: [{ id: "book", emoji: "📖", label: "Book" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "book", emoji: "📖", label: "Book" }, { id: "pencil", emoji: "✏️", label: "Pencil" }] },
      { kind: "native", kurdishPrompt: "کتێبەکە بدۆزەرەوە", correctId: "book", choices: [{ id: "book", emoji: "📖", label: "Book" }, { id: "shoe", emoji: "👟", label: "Shoe" }] },
      { kind: "simon", phrase: "Simon says, pick the pencil!", correctId: "pencil", choices: [{ id: "pencil", emoji: "✏️", label: "Pencil" }, { id: "pen", emoji: "🖊️", label: "Pen" }] },
      { kind: "train", words: ["I", "go", "to", "school"], kurdishHint: "دەچم بۆ قوتابخانە" },
      { kind: "trick", showEmoji: "📖", showLabel: "Book", spokenWord: "Book", matches: true },
      { kind: "treasure", correctId: "star", pool: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],`,
  // Lesson 7: Helping at Home
  `    kidsGames: [
      { kind: "echo", prompt: "What is the child doing?", target: "I clean my room.", targetKurdish: "ژوورەکەم پاکدەکەمەوە." },
      { kind: "scene", scene: "bedroom", prompt: "Find the toy box!", correctId: "box", choices: [{ id: "box", emoji: "📦", label: "Box" }, { id: "bed", emoji: "🛏️", label: "Bed" }] },
      { kind: "bubble", prompt: "Pop the toy!", correctId: "toy", choices: [{ id: "toy", emoji: "🧸", label: "Toy" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "feed", mascotEmoji: "📦", prompt: "Put a toy in the box!", correctId: "toy", choices: [{ id: "toy", emoji: "🧸", label: "Toy" }, { id: "water", emoji: "💧", label: "Water" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "toy", emoji: "🧸", label: "Toy" }, { id: "box", emoji: "📦", label: "Box" }] },
      { kind: "native", kurdishPrompt: "یارییەکە بدۆزەرەوە", correctId: "toy", choices: [{ id: "toy", emoji: "🧸", label: "Toy" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "simon", phrase: "Simon says, clean up!", correctId: "broom", choices: [{ id: "broom", emoji: "🧹", label: "Broom" }, { id: "spoon", emoji: "🥄", label: "Spoon" }] },
      { kind: "train", words: ["I", "help", "my", "mom"], kurdishHint: "یارمەتی دایکم دەدەم" },
      { kind: "trick", showEmoji: "🧸", showLabel: "Toy", spokenWord: "Toy", matches: true },
      { kind: "treasure", correctId: "coin", pool: [{ id: "coin", emoji: "🪙", label: "Coin" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],`,
  // Lesson 8: Evening Routine
  `    kidsGames: [
      { kind: "echo", prompt: "What are they doing?", target: "We eat dinner.", targetKurdish: "نانی ئێوارە دەخۆین." },
      { kind: "scene", scene: "livingroom", prompt: "Find the TV!", correctId: "tv", choices: [{ id: "tv", emoji: "📺", label: "TV" }, { id: "window", emoji: "🪟", label: "Window" }] },
      { kind: "bubble", prompt: "Pop the family!", correctId: "family", choices: [{ id: "family", emoji: "👨‍👩‍👧", label: "Family" }, { id: "dog", emoji: "🐶", label: "Dog" }] },
      { kind: "feed", mascotEmoji: "📺", prompt: "Turn on the TV!", correctId: "remote", choices: [{ id: "remote", emoji: "📱", label: "Remote" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "tv", emoji: "📺", label: "TV" }, { id: "couch", emoji: "🛋️", label: "Couch" }] },
      { kind: "native", kurdishPrompt: "تەلەفزیۆنەکە بدۆزەرەوە", correctId: "tv", choices: [{ id: "tv", emoji: "📺", label: "TV" }, { id: "bed", emoji: "🛏️", label: "Bed" }] },
      { kind: "simon", phrase: "Simon says, eat dinner!", correctId: "plate", choices: [{ id: "plate", emoji: "🍽️", label: "Plate" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "train", words: ["We", "watch", "TV"], kurdishHint: "سەیری تەلەفزیۆن دەکەین" },
      { kind: "trick", showEmoji: "📺", showLabel: "TV", spokenWord: "TV", matches: true },
      { kind: "treasure", correctId: "star", pool: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],`,
  // Lesson 9: Good Night
  `    kidsGames: [
      { kind: "echo", prompt: "What does the child do?", target: "I go to bed.", targetKurdish: "دەچم بۆ جێگاکەم." },
      { kind: "scene", scene: "bedroom", prompt: "Find the bed!", correctId: "bed", choices: [{ id: "bed", emoji: "🛏️", label: "Bed" }, { id: "chair", emoji: "🪑", label: "Chair" }] },
      { kind: "bubble", prompt: "Pop the moon!", correctId: "moon", choices: [{ id: "moon", emoji: "🌙", label: "Moon" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "feed", mascotEmoji: "🛏️", prompt: "Put a pillow on the bed!", correctId: "pillow", choices: [{ id: "pillow", emoji: "🛌", label: "Pillow" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "moon", emoji: "🌙", label: "Moon" }, { id: "star", emoji: "⭐", label: "Star" }] },
      { kind: "native", kurdishPrompt: "جێگاکە بدۆزەرەوە", correctId: "bed", choices: [{ id: "bed", emoji: "🛏️", label: "Bed" }, { id: "table", emoji: "🪚", label: "Table" }] },
      { kind: "simon", phrase: "Simon says, go to sleep!", correctId: "bed", choices: [{ id: "bed", emoji: "🛏️", label: "Bed" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "train", words: ["I", "am", "tired"], kurdishHint: "من ماندووم" },
      { kind: "trick", showEmoji: "🌙", showLabel: "Moon", spokenWord: "Moon", matches: true },
      { kind: "treasure", correctId: "dream", pool: [{ id: "dream", emoji: "💭", label: "Dream" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],`
];

const segments = content.split("    ],");
let newContent = "";
let lessonIndex = 0;

for (let i = 0; i < segments.length; i++) {
  const segment = segments[i];
  if (segment.includes("conversations: [") && lessonIndex < gamesData.length) {
    newContent += segment + "    ],\n" + gamesData[lessonIndex];
    lessonIndex++;
  } else {
    newContent += segment;
    if (i < segments.length - 1) {
      newContent += "    ],";
    }
  }
}

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log("Added kidsGames to " + lessonIndex + " lessons in unit 3.");
