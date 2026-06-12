const fs = require('fs');
const path = require('path');

const file2 = path.join(__dirname, 'src/data/kids-english/unit-2-colors-and-numbers.ts');
const file3 = path.join(__dirname, 'src/data/kids-english/unit-3-daily-routines.ts');

const sentences = [
  { prompt: 'What is she doing?', target: 'I will help my mother.', targetKurdish: 'من یارمەتی دایکم دەدەم.', imageRequire: 'require("../../../assets/images/games/girl_helping_mother.png")' },
  { prompt: 'What do you say?', target: 'I forgive my friend.', targetKurdish: 'من لە هاوڕێکەم خۆش دەبم.', imageRequire: 'require("../../../assets/images/games/kids_hugging.png")' },
  { prompt: 'What are they doing?', target: 'We share our toys.', targetKurdish: 'ئێمە یارییەکانمان بەش دەکەین.', imageRequire: 'require("../../../assets/images/games/kids_playing_ball.png")' },
  { prompt: 'What is he saying?', target: 'Thank you very much.', targetKurdish: 'زۆر سوپاس.', imageRequire: 'require("../../../assets/images/games/friendly_teacher.png")' },
  { prompt: 'What should we do?', target: 'I clean my room.', targetKurdish: 'من ژوورەکەم خاوێن دەکەمەوە.', imageRequire: 'require("../../../assets/images/games/kids_with_blocks.png")' },
  { prompt: 'What do you say?', target: 'Please help me.', targetKurdish: 'تکایە یارمەتیم بدە.', imageRequire: 'require("../../../assets/images/games/boy_sharing_apple.png")' },
  { prompt: 'What is she doing?', target: 'She is reading a book.', targetKurdish: 'ئەو کتێبێک دەخوێنێتەوە.', imageRequire: 'require("../../../assets/images/games/kid_reading_book.png")' },
  { prompt: 'What are they saying?', target: 'Good morning teacher.', targetKurdish: 'بەیانی باش مامۆستا.', imageRequire: 'require("../../../assets/images/games/friendly_teacher.png")' },
  { prompt: 'What do you do?', target: 'I wash my hands.', targetKurdish: 'من دەستەکانم دەشۆم.', imageRequire: 'require("../../../assets/images/games/kid_taking_bath.png")' },
  { prompt: 'What do you say?', target: 'I am sorry.', targetKurdish: 'من داوای لێبوردن دەکەم.', imageRequire: 'require("../../../assets/images/games/kids_hugging.png")' }
];

const newGames = '    kidsGames: [\n' + sentences.map(s => 
  `      { kind: "echo", prompt: "${s.prompt}", target: "${s.target}", targetKurdish: "${s.targetKurdish}", imageRequire: ${s.imageRequire} }`
).join(',\n') + '\n    ],';

for (const file of [file2, file3]) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    code = code.replace(/    kidsGames: \[\n?([\s\S]*?)\n    \],?/g, newGames);
    fs.writeFileSync(file, code);
  }
}
