import re

file_path = "src/data/kids-english/unit-2-colors-and-numbers.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define the 10 kids games for each of the 10 lessons.
# We have 10 images generated. We will create a unique `kidsGames` array for each lesson.

games_data = [
    # Lesson 0
    """    kidsGames: [
      { kind: "echo", prompt: "Describe the image:", target: "The boy shares an apple.", targetKurdish: "کوڕەکە سێوێک بەش دەکات.", imageRequire: require("../../../assets/images/games/boy_sharing_apple.png") },
      { kind: "scene", scene: "playground", prompt: "Find the red ball!", correctId: "ball", choices: [{ id: "ball", emoji: "🔴", label: "Red Ball" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "bubble", prompt: "Pop the blue bubble!", correctId: "blue", choices: [{ id: "blue", emoji: "🔵", label: "Blue" }, { id: "red", emoji: "🔴", label: "Red" }] },
      { kind: "feed", mascotEmoji: "🦁", prompt: "Feed the lion!", correctId: "meat", choices: [{ id: "meat", emoji: "🍖", label: "Meat" }, { id: "grass", emoji: "🌿", label: "Grass" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "moon", emoji: "🌙", label: "Moon" }] },
      { kind: "native", kurdishPrompt: "سەگەکە بدۆزەرەوە", correctId: "dog", choices: [{ id: "dog", emoji: "🐶", label: "Dog" }, { id: "cat", emoji: "🐱", label: "Cat" }] },
      { kind: "simon", phrase: "Simon says, pick the yellow star!", correctId: "star", choices: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "train", words: ["The", "apple", "is", "red"], kurdishHint: "سێوەکە سوورە" },
      { kind: "trick", showEmoji: "🍎", showLabel: "Apple", spokenWord: "Apple", matches: true },
      { kind: "treasure", correctId: "gem", pool: [{ id: "gem", emoji: "💎", label: "Gem" }, { id: "rock", emoji: "🪨", label: "Rock" }] }
    ],""",
    # Lesson 1
    """    kidsGames: [
      { kind: "echo", prompt: "What do you see?", target: "A snowy landscape.", targetKurdish: "دیمەنێکی بەفراوی.", imageRequire: require("../../../assets/images/games/snowy_landscape.png") },
      { kind: "scene", scene: "yard", prompt: "Find the snowman!", correctId: "snowman", choices: [{ id: "snowman", emoji: "⛄", label: "Snowman" }, { id: "tree", emoji: "🌲", label: "Tree" }] },
      { kind: "bubble", prompt: "Pop the white bubble!", correctId: "white", choices: [{ id: "white", emoji: "⚪", label: "White" }, { id: "black", emoji: "⚫", label: "Black" }] },
      { kind: "feed", mascotEmoji: "🐧", prompt: "Feed the penguin!", correctId: "fish", choices: [{ id: "fish", emoji: "🐟", label: "Fish" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "cloud", emoji: "☁️", label: "Cloud" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "native", kurdishPrompt: "پشیلەکە بدۆزەرەوە", correctId: "cat", choices: [{ id: "cat", emoji: "🐱", label: "Cat" }, { id: "dog", emoji: "🐶", label: "Dog" }] },
      { kind: "simon", phrase: "Simon says, pick the cloud!", correctId: "cloud", choices: [{ id: "cloud", emoji: "☁️", label: "Cloud" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "train", words: ["The", "snow", "is", "white"], kurdishHint: "بەفرەکە سپییە" },
      { kind: "trick", showEmoji: "⛄", showLabel: "Snowman", spokenWord: "Snowman", matches: true },
      { kind: "treasure", correctId: "snowflake", pool: [{ id: "snowflake", emoji: "❄️", label: "Snowflake" }, { id: "fire", emoji: "🔥", label: "Fire" }] }
    ],""",
    # Lesson 2
    """    kidsGames: [
      { kind: "echo", prompt: "What is she doing?", target: "I will help my mother.", targetKurdish: "من یارمەتی دایکم دەدەم.", imageRequire: require("../../../assets/images/games/girl_helping_mother.png") },
      { kind: "scene", scene: "kitchen", prompt: "Find the apple!", correctId: "apple", choices: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "banana", emoji: "🍌", label: "Banana" }] },
      { kind: "bubble", prompt: "Pop the number one!", correctId: "one", choices: [{ id: "one", emoji: "1️⃣", label: "One" }, { id: "two", emoji: "2️⃣", label: "Two" }] },
      { kind: "feed", mascotEmoji: "👩", prompt: "Give mother a flower!", correctId: "flower", choices: [{ id: "flower", emoji: "🌸", label: "Flower" }, { id: "spider", emoji: "🕷️", label: "Spider" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "plate", emoji: "🍽️", label: "Plate" }, { id: "fork", emoji: "🍴", label: "Fork" }] },
      { kind: "native", kurdishPrompt: "مۆزەکە بدۆزەرەوە", correctId: "banana", choices: [{ id: "banana", emoji: "🍌", label: "Banana" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "simon", phrase: "Simon says, pick number two!", correctId: "two", choices: [{ id: "two", emoji: "2️⃣", label: "Two" }, { id: "three", emoji: "3️⃣", label: "Three" }] },
      { kind: "train", words: ["I", "have", "two", "cats"], kurdishHint: "دوو پشیلەم هەیە" },
      { kind: "trick", showEmoji: "🌸", showLabel: "Flower", spokenWord: "Flower", matches: true },
      { kind: "treasure", correctId: "heart", pool: [{ id: "heart", emoji: "❤️", label: "Heart" }, { id: "broken", emoji: "💔", label: "Broken Heart" }] }
    ],""",
    # Lesson 3
    """    kidsGames: [
      { kind: "echo", prompt: "What are they counting?", target: "We are counting stars.", targetKurdish: "ئێمە ئەستێرە دەژمێرین.", imageRequire: require("../../../assets/images/games/friends_counting_stars.png") },
      { kind: "scene", scene: "night", prompt: "Find the moon!", correctId: "moon", choices: [{ id: "moon", emoji: "🌙", label: "Moon" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "bubble", prompt: "Pop number ten!", correctId: "ten", choices: [{ id: "ten", emoji: "🔟", label: "Ten" }, { id: "five", emoji: "5️⃣", label: "Five" }] },
      { kind: "feed", mascotEmoji: "🦉", prompt: "Feed the owl!", correctId: "mouse", choices: [{ id: "mouse", emoji: "🐁", label: "Mouse" }, { id: "leaf", emoji: "🍃", label: "Leaf" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "cloud", emoji: "☁️", label: "Cloud" }] },
      { kind: "native", kurdishPrompt: "مانگەکە بدۆزەرەوە", correctId: "moon", choices: [{ id: "moon", emoji: "🌙", label: "Moon" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "simon", phrase: "Simon says, pick number seven!", correctId: "seven", choices: [{ id: "seven", emoji: "7️⃣", label: "Seven" }, { id: "eight", emoji: "8️⃣", label: "Eight" }] },
      { kind: "train", words: ["I", "have", "six", "pens"], kurdishHint: "شەش پێنووسم هەیە" },
      { kind: "trick", showEmoji: "⭐", showLabel: "Star", spokenWord: "Star", matches: true },
      { kind: "treasure", correctId: "telescope", pool: [{ id: "telescope", emoji: "🔭", label: "Telescope" }, { id: "book", emoji: "📖", label: "Book" }] }
    ],""",
    # Lesson 4
    """    kidsGames: [
      { kind: "echo", prompt: "Describe the bird:", target: "The parrot is colorful.", targetKurdish: "تووتییەکە ڕەنگاوڕەنگە.", imageRequire: require("../../../assets/images/games/colorful_parrot.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the bird!", correctId: "bird", choices: [{ id: "bird", emoji: "🦜", label: "Bird" }, { id: "cat", emoji: "🐱", label: "Cat" }] },
      { kind: "bubble", prompt: "Pop the question mark!", correctId: "question", choices: [{ id: "question", emoji: "❓", label: "Question" }, { id: "exclamation", emoji: "❗", label: "Exclamation" }] },
      { kind: "feed", mascotEmoji: "🦜", prompt: "Feed the parrot!", correctId: "seed", choices: [{ id: "seed", emoji: "🌻", label: "Seed" }, { id: "meat", emoji: "🍖", label: "Meat" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "bird", emoji: "🦜", label: "Bird" }, { id: "egg", emoji: "🥚", label: "Egg" }] },
      { kind: "native", kurdishPrompt: "تووتییەکە بدۆزەرەوە", correctId: "parrot", choices: [{ id: "parrot", emoji: "🦜", label: "Parrot" }, { id: "fish", emoji: "🐟", label: "Fish" }] },
      { kind: "simon", phrase: "Simon says, ask a question!", correctId: "question", choices: [{ id: "question", emoji: "❓", label: "Question" }, { id: "period", emoji: "⏺️", label: "Period" }] },
      { kind: "train", words: ["What", "color", "is", "it"], kurdishHint: "چ ڕەنگێکە؟" },
      { kind: "trick", showEmoji: "🦜", showLabel: "Parrot", spokenWord: "Parrot", matches: true },
      { kind: "treasure", correctId: "feather", pool: [{ id: "feather", emoji: "🪶", label: "Feather" }, { id: "leaf", emoji: "🍃", label: "Leaf" }] }
    ],""",
    # Lesson 5
    """    kidsGames: [
      { kind: "echo", prompt: "What are they doing?", target: "We play with blocks.", targetKurdish: "ئێمە یاری بە بلۆک دەکەین.", imageRequire: require("../../../assets/images/games/kids_with_blocks.png") },
      { kind: "scene", scene: "playground", prompt: "Find the circle!", correctId: "circle", choices: [{ id: "circle", emoji: "🔴", label: "Circle" }, { id: "square", emoji: "🟦", label: "Square" }] },
      { kind: "bubble", prompt: "Pop the square!", correctId: "square", choices: [{ id: "square", emoji: "🟦", label: "Square" }, { id: "triangle", emoji: "🔺", label: "Triangle" }] },
      { kind: "feed", mascotEmoji: "🤖", prompt: "Feed the robot a gear!", correctId: "gear", choices: [{ id: "gear", emoji: "⚙️", label: "Gear" }, { id: "apple", emoji: "🍎", label: "Apple" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "triangle", emoji: "🔺", label: "Triangle" }, { id: "square", emoji: "🟦", label: "Square" }] },
      { kind: "native", kurdishPrompt: "چوارگۆشەکە بدۆزەرەوە", correctId: "square", choices: [{ id: "square", emoji: "🟦", label: "Square" }, { id: "circle", emoji: "🔴", label: "Circle" }] },
      { kind: "simon", phrase: "Simon says, pick the triangle!", correctId: "triangle", choices: [{ id: "triangle", emoji: "🔺", label: "Triangle" }, { id: "circle", emoji: "🔴", label: "Circle" }] },
      { kind: "train", words: ["The", "ball", "is", "a", "circle"], kurdishHint: "تۆپەکە بازنەیە" },
      { kind: "trick", showEmoji: "🔺", showLabel: "Triangle", spokenWord: "Triangle", matches: true },
      { kind: "treasure", correctId: "star", pool: [{ id: "star", emoji: "⭐", label: "Star" }, { id: "moon", emoji: "🌙", label: "Moon" }] }
    ],""",
    # Lesson 6
    """    kidsGames: [
      { kind: "echo", prompt: "Describe the toy:", target: "The train is beautiful.", targetKurdish: "شەمەندەفەرەکە جوانە.", imageRequire: require("../../../assets/images/games/toy_train.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the train!", correctId: "train", choices: [{ id: "train", emoji: "🚂", label: "Train" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "bubble", prompt: "Pop the car!", correctId: "car", choices: [{ id: "car", emoji: "🚗", label: "Car" }, { id: "bus", emoji: "🚌", label: "Bus" }] },
      { kind: "feed", mascotEmoji: "🧸", prompt: "Give the bear a heart!", correctId: "heart", choices: [{ id: "heart", emoji: "❤️", label: "Heart" }, { id: "bone", emoji: "🦴", label: "Bone" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "train", emoji: "🚂", label: "Train" }, { id: "car", emoji: "🚗", label: "Car" }] },
      { kind: "native", kurdishPrompt: "ئۆتۆمبێلەکە بدۆزەرەوە", correctId: "car", choices: [{ id: "car", emoji: "🚗", label: "Car" }, { id: "plane", emoji: "✈️", label: "Plane" }] },
      { kind: "simon", phrase: "Simon says, pick the doll!", correctId: "doll", choices: [{ id: "doll", emoji: "🎎", label: "Doll" }, { id: "ball", emoji: "⚽", label: "Ball" }] },
      { kind: "train", words: ["My", "car", "is", "red"], kurdishHint: "ئۆتۆمبێلەکەم سوورە" },
      { kind: "trick", showEmoji: "🚂", showLabel: "Train", spokenWord: "Train", matches: true },
      { kind: "treasure", correctId: "gift", pool: [{ id: "gift", emoji: "🎁", label: "Gift" }, { id: "box", emoji: "📦", label: "Box" }] }
    ],""",
    # Lesson 7
    """    kidsGames: [
      { kind: "echo", prompt: "Look at the tree:", target: "The tree has many apples.", targetKurdish: "درەختەکە سێوی زۆری پێوەیە.", imageRequire: require("../../../assets/images/games/magical_apple_tree.png") },
      { kind: "scene", scene: "yard", prompt: "Find the tree!", correctId: "tree", choices: [{ id: "tree", emoji: "🌳", label: "Tree" }, { id: "flower", emoji: "🌸", label: "Flower" }] },
      { kind: "bubble", prompt: "Pop the twenty!", correctId: "twenty", choices: [{ id: "twenty", emoji: "2️⃣0️⃣", label: "Twenty" }, { id: "ten", emoji: "1️⃣0️⃣", label: "Ten" }] },
      { kind: "feed", mascotEmoji: "🐿️", prompt: "Feed the squirrel an acorn!", correctId: "acorn", choices: [{ id: "acorn", emoji: "🌰", label: "Acorn" }, { id: "fish", emoji: "🐟", label: "Fish" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "leaf", emoji: "🍃", label: "Leaf" }] },
      { kind: "native", kurdishPrompt: "سێوەکە بدۆزەرەوە", correctId: "apple", choices: [{ id: "apple", emoji: "🍎", label: "Apple" }, { id: "banana", emoji: "🍌", label: "Banana" }] },
      { kind: "simon", phrase: "Simon says, pick the tree!", correctId: "tree", choices: [{ id: "tree", emoji: "🌳", label: "Tree" }, { id: "bush", emoji: "🪴", label: "Bush" }] },
      { kind: "train", words: ["I", "have", "twenty", "apples"], kurdishHint: "بیست سێوم هەیە" },
      { kind: "trick", showEmoji: "🌳", showLabel: "Tree", spokenWord: "Tree", matches: true },
      { kind: "treasure", correctId: "basket", pool: [{ id: "basket", emoji: "🧺", label: "Basket" }, { id: "pot", emoji: "🍯", label: "Pot" }] }
    ],""",
    # Lesson 8
    """    kidsGames: [
      { kind: "echo", prompt: "What does the teacher say?", target: "I am a good student.", targetKurdish: "من قوتابییەکی باشم.", imageRequire: require("../../../assets/images/games/friendly_teacher.png") },
      { kind: "scene", scene: "bedroom", prompt: "Find the book!", correctId: "book", choices: [{ id: "book", emoji: "📖", label: "Book" }, { id: "pen", emoji: "🖊️", label: "Pen" }] },
      { kind: "bubble", prompt: "Pop the pen!", correctId: "pen", choices: [{ id: "pen", emoji: "🖊️", label: "Pen" }, { id: "bag", emoji: "🎒", label: "Bag" }] },
      { kind: "feed", mascotEmoji: "🎒", prompt: "Put a book in the bag!", correctId: "book", choices: [{ id: "book", emoji: "📖", label: "Book" }, { id: "shoe", emoji: "👞", label: "Shoe" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "chair", emoji: "🪑", label: "Chair" }, { id: "desk", emoji: "🪚", label: "Desk" }] },
      { kind: "native", kurdishPrompt: "پێنووسەکە بدۆزەرەوە", correctId: "pen", choices: [{ id: "pen", emoji: "🖊️", label: "Pen" }, { id: "book", emoji: "📖", label: "Book" }] },
      { kind: "simon", phrase: "Simon says, pick the chair!", correctId: "chair", choices: [{ id: "chair", emoji: "🪑", label: "Chair" }, { id: "bed", emoji: "🛏️", label: "Bed" }] },
      { kind: "train", words: ["I", "have", "three", "books"], kurdishHint: "سێ کتێبم هەیە" },
      { kind: "trick", showEmoji: "📖", showLabel: "Book", spokenWord: "Book", matches: true },
      { kind: "treasure", correctId: "medal", pool: [{ id: "medal", emoji: "🥇", label: "Medal" }, { id: "coin", emoji: "🪙", label: "Coin" }] }
    ],""",
    # Lesson 9
    """    kidsGames: [
      { kind: "echo", prompt: "What are they doing?", target: "I forgive my friend.", targetKurdish: "من لە هاوڕێکەم خۆش دەبم.", imageRequire: require("../../../assets/images/games/kids_hugging.png") },
      { kind: "scene", scene: "yard", prompt: "Find the sun!", correctId: "sun", choices: [{ id: "sun", emoji: "☀️", label: "Sun" }, { id: "moon", emoji: "🌙", label: "Moon" }] },
      { kind: "bubble", prompt: "Pop the flower!", correctId: "flower", choices: [{ id: "flower", emoji: "🌸", label: "Flower" }, { id: "tree", emoji: "🌳", label: "Tree" }] },
      { kind: "feed", mascotEmoji: "🐢", prompt: "Feed the turtle some grass!", correctId: "grass", choices: [{ id: "grass", emoji: "🌿", label: "Grass" }, { id: "meat", emoji: "🍖", label: "Meat" }] },
      { kind: "shadow", prompt: "Match the shape!", items: [{ id: "cloud", emoji: "☁️", label: "Cloud" }, { id: "sun", emoji: "☀️", label: "Sun" }] },
      { kind: "native", kurdishPrompt: "گوڵەکە بدۆزەرەوە", correctId: "flower", choices: [{ id: "flower", emoji: "🌸", label: "Flower" }, { id: "tree", emoji: "🌳", label: "Tree" }] },
      { kind: "simon", phrase: "Simon says, pick the grass!", correctId: "grass", choices: [{ id: "grass", emoji: "🌿", label: "Grass" }, { id: "flower", emoji: "🌸", label: "Flower" }] },
      { kind: "train", words: ["The", "tree", "is", "green"], kurdishHint: "درەختەکە سەوزە" },
      { kind: "trick", showEmoji: "☀️", showLabel: "Sun", spokenWord: "Sun", matches: true },
      { kind: "treasure", correctId: "rainbow", pool: [{ id: "rainbow", emoji: "🌈", label: "Rainbow" }, { id: "rain", emoji: "🌧️", label: "Rain" }] }
    ],"""
]

# We will find `conversations: [` block end `    ],` and insert `\nkidsGames: [...]`
segments = content.split("    ],")

new_content = ""
lesson_index = 0

for i, segment in enumerate(segments):
    if "conversations: [" in segment and lesson_index < len(games_data):
        new_content += segment + "    ],\n" + games_data[lesson_index]
        lesson_index += 1
    else:
        new_content += segment
        if i < len(segments) - 1:
            new_content += "    ],"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Added kidsGames to {lesson_index} lessons.")
