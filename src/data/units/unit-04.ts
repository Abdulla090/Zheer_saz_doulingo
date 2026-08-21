import { UnitBank } from "../types";

// ── Unit 4: Going Out, Parties & Fun — 10 unique lessons ──────────────────────────────
const unit04: UnitBank = [

  // Lesson 0: Making Plans
  {
    topic: "Making Plans", topicKu: "دانانی پلان",
    words: [
      { english: "Down for whatever", kurdish: "ئامادەم بۆ هەر شتێک (ڕازیم)" },
      { english: "Hit me up", kurdish: "پەیوەندیم پێوە بکە (نامەم بۆ بنێرە)" },
      { english: "Play it by ear", kurdish: "با بزانین چی دەبێت (بەبێ پلانی پێشوەختە)" },
      { english: "Flake", kurdish: "کەسێک کە پلان تێکدەدات (نایەت)" },
      { english: "Pencil it in", kurdish: "کاتیی دەینوسم (ڕەنگە بگۆڕێت)" },
    ],
    voices: [
      { prompt: "بڵێ ئامادەم بۆ هەر شتێک", target: "I'm down for whatever tonight.", targetKurdish: "ئەمشەو ئامادەم بۆ هەر شتێک." },
      { prompt: "بڵێ دواتر پەیوەندیم پێوە بکە", target: "Hit me up later when you're free.", targetKurdish: "دواتر نامەم بۆ بنێرە کاتێک کاتت هەبوو." },
    ],
    sentences: [
      { english: ["I'm", "down", "for", "whatever", "tonight"], kurdish: "ئەمشەو ئامادەم بۆ هەر شتێک" },
      { english: ["Hit", "me", "up", "later", "when", "you're", "free"], kurdish: "دواتر نامەم بۆ بنێرە کاتێک کاتت هەبوو" },
    ],
    fillBlanks: [
      { parts: ["Let's not make a strict plan, just play it by", "."], hint: "گوێ", answer: "ear", wrongs: ["nose", "jumping", "apple"] },
      { parts: ["Don't invite him, he's a", "and never shows up."], hint: "تێکدەری پلان (کرێش)", answer: "flake", wrongs: ["cake", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت دەپرسێت ئەمشەو چی دەکەیت",
        theyAsk: "What do you want to do tonight?",
        correct: "I don't know, I'm down for whatever.",
        wrong1: "I play it by nose.",
        wrong2: "The flake is snowing.",
        wrong3: "I hit up the wall.",
        explanation: "وەڵامێکی باو کاتێک پێت ئاساییە چی بکەن: 'I don't know, I'm down for whatever.'",
      },
    ],
  },

  // Lesson 1: Getting Ready
  {
    topic: "Getting Ready", topicKu: "خۆئامادەکردن",
    words: [
      { english: "Dressed to kill", kurdish: "زۆر جوان خۆی گۆڕیوە (بۆ سەرنجڕاکێشان)" },
      { english: "Fit", kurdish: "جلوبەرگ (کورتکراوەی ئاوتفیت)" },
      { english: "Freshen up", kurdish: "خۆ تازەکردنەوە (شوشتنی دەم و چاو)" },
      { english: "Drip", kurdish: "ستایلێکی زۆر جوان و سەرنجڕاکێش" },
      { english: "Ready to roll", kurdish: "ئامادەم بۆ ڕۆیشتن" },
    ],
    voices: [
      { prompt: "بڵێ جلەکانم زۆر شازن", target: "My fit is looking fresh today.", targetKurdish: "جلوبەرگەکەم ئەمڕۆ زۆر شاز دەردەکەوێت." },
      { prompt: "بڵێ ئامادەم بۆ ڕۆیشتن", target: "Alright, I'm ready to roll.", targetKurdish: "باشە، من ئامادەم بۆ ڕۆیشتن." },
    ],
    sentences: [
      { english: ["My", "fit", "is", "looking", "fresh", "today"], kurdish: "جلوبەرگەکەم ئەمڕۆ زۆر شاز دەردەکەوێت" },
      { english: ["Alright", "I'm", "ready", "to", "roll"], kurdish: "باشە، من ئامادەم بۆ ڕۆیشتن" },
    ],
    fillBlanks: [
      { parts: ["Give me five minutes to freshen", "."], hint: "سەرەوە", answer: "up", wrongs: ["down", "jumping", "apple"] },
      { parts: ["Look at his shoes, he's got so much", "."], hint: "دڵۆپە (ستایلی شاز)", answer: "drip", wrongs: ["drop", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت چاوەڕێت دەکات بڕۆنە دەرەوە",
        theyAsk: "Are you finally ready to go?",
        correct: "Yeah, just grabbed my keys. I'm ready to roll.",
        wrong1: "I roll the ball.",
        wrong2: "The drip is water.",
        wrong3: "I dress to heal.",
        explanation: "ئامادەیی بۆ ڕۆیشتن: 'Yeah, just grabbed my keys. I'm ready to roll.'",
      },
    ],
  },

  // Lesson 2: At the Party
  {
    topic: "The Party", topicKu: "ئاهەنگەکە",
    words: [
      { english: "Lit", kurdish: "زۆر شاز و بەجۆش (ئاهەنگ)" },
      { english: "Packed", kurdish: "زۆر قەرەباڵغ (پڕە لە خەڵک)" },
      { english: "Dead", kurdish: "بێزارکەر (هیچ خۆش نییە)" },
      { english: "Crash a party", kurdish: "چوونە ئاهەنگێک بەبێ بانگهێشتکردن" },
      { english: "Pre-game", kurdish: "خواردنەوە پێش چوونە ئاهەنگ" },
    ],
    voices: [
      { prompt: "بڵێ ئاهەنگەکە زۆر شازە", target: "This party is absolutely lit.", targetKurdish: "ئەم ئاهەنگە بەتەواوی شازە." },
      { prompt: "بڵێ شوێنەکە زۆر قەرەباڵغە", target: "The club is completely packed tonight.", targetKurdish: "یانەکە ئەمشەو بەتەواوی قەرەباڵغە." },
    ],
    sentences: [
      { english: ["This", "party", "is", "absolutely", "lit"], kurdish: "ئەم ئاهەنگە بەتەواوی شازە" },
      { english: ["The", "club", "is", "completely", "packed", "tonight"], kurdish: "یانەکە ئەمشەو بەتەواوی قەرەباڵغە" },
    ],
    fillBlanks: [
      { parts: ["Let's leave, this place is completely", "."], hint: "مردوو (بێزارکەر)", answer: "dead", wrongs: ["alive", "jumping", "apple"] },
      { parts: ["We didn't get invited, we're just going to", "it."], hint: "کێشان بە شتێکدا (چوون بەبێ بانگهێشت)", answer: "crash", wrongs: ["smash", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "لە ئاهەنگێکیت و هاوڕێیەکت دەپرسێت چۆنە",
        theyAsk: "How is the party going?",
        correct: "It's completely dead. We should leave.",
        wrong1: "The party is sleeping.",
        wrong2: "I pre-game the game.",
        wrong3: "Packed the suitcase.",
        explanation: "وەسفکردنی ئاهەنگێکی بێزارکەر: 'It's completely dead. We should leave.'",
      },
    ],
  },

  // Lesson 3: Having Fun
  {
    topic: "Having Fun", topicKu: "کاتبەسەربردن",
    words: [
      { english: "Have a blast", kurdish: "کاتێکی زۆر خۆش بەسەربردن" },
      { english: "Let loose", kurdish: "ئازادبوون (شەرم نەکردن لە کاتبەسەربردن)" },
      { english: "Wild", kurdish: "شێتانە (زۆر خۆش)" },
      { english: "Live it up", kurdish: "چێژوەرگرتن لە ژیان بە تەواوی" },
      { english: "Kill it", kurdish: "زۆر بەباشی کارێک کردن (لەسەر سەمایە)" },
    ],
    voices: [
      { prompt: "بڵێ کاتێکی زۆر خۆشمان بەسەربرد", target: "We had an absolute blast last night.", targetKurdish: "شەوی ڕابردوو کاتێکی زۆر خۆشمان بەسەربرد." },
      { prompt: "بڵێ تەنها پێویستە ئازاد بیت", target: "You just need to let loose and have fun.", targetKurdish: "تەنها پێویستە ئازاد بیت و چێژ وەرگریت." },
    ],
    sentences: [
      { english: ["We", "had", "an", "absolute", "blast", "last", "night"], kurdish: "شەوی ڕابردوو کاتێکی زۆر خۆشمان بەسەربرد" },
      { english: ["You", "just", "need", "to", "let", "loose", "and", "have", "fun"], kurdish: "تەنها پێویستە ئازاد بیت و چێژ وەرگریت" },
    ],
    fillBlanks: [
      { parts: ["The concert was completely", "!"], hint: "کێوی (شێتانە)", answer: "wild", wrongs: ["tame", "jumping", "apple"] },
      { parts: ["He is", "it on the dance floor!"], hint: "کوشتن (زۆر شاز سەما دەکات)", answer: "killing", wrongs: ["dying", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت دەپرسێت گەشتەکەت چۆن بوو",
        theyAsk: "How was your trip to Vegas?",
        correct: "It was crazy, we had a blast.",
        wrong1: "Vegas was a wild animal.",
        wrong2: "I let loose the dog.",
        wrong3: "I kill the dance floor.",
        explanation: "دەربڕینی کاتێکی خۆش: 'It was crazy, we had a blast.'",
      },
    ],
  },

  // Lesson 4: Getting Drunk
  {
    topic: "Drinking", topicKu: "خواردنەوە",
    words: [
      { english: "Wasted", kurdish: "زۆر سەرخۆش" },
      { english: "Tipsy", kurdish: "کەمێک سەرخۆش" },
      { english: "Blackout", kurdish: "لەهۆشخۆچوون بەهۆی خواردنەوە" },
      { english: "Designated driver", kurdish: "شۆفێری دیاریکراو (کە ناخواتەوە)" },
      { english: "Hangover", kurdish: "سەرئێشەی دوای خواردنەوە" },
    ],
    voices: [
      { prompt: "بڵێ من کەمێک سەرخۆشم", target: "I'm honestly feeling a little tipsy.", targetKurdish: "بەڕاستی هەست دەکەم کەمێک سەرخۆشم." },
      { prompt: "بڵێ ئەو بەتەواوی سەرخۆش بوو", target: "He was completely wasted last night.", targetKurdish: "ئەو شەوی ڕابردوو بەتەواوی سەرخۆش بوو." },
    ],
    sentences: [
      { english: ["I'm", "honestly", "feeling", "a", "little", "tipsy"], kurdish: "بەڕاستی هەست دەکەم کەمێک سەرخۆشم" },
      { english: ["He", "was", "completely", "wasted", "last", "night"], kurdish: "ئەو شەوی ڕابردوو بەتەواوی سەرخۆش بوو" },
    ],
    fillBlanks: [
      { parts: ["I can't drink, I have to be the designated", "."], hint: "شۆفێر", answer: "driver", wrongs: ["walker", "jumping", "apple"] },
      { parts: ["I have a terrible", "this morning."], hint: "ئازاری دوای خواردنەوە", answer: "hangover", wrongs: ["hangunder", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکت دەپرسێت ئایا دەتەوێت بخۆیتەوە",
        theyAsk: "Do you want another shot?",
        correct: "No thanks, I'm already a little tipsy.",
        wrong1: "I am wasted the time.",
        wrong2: "The blackout is dark.",
        wrong3: "I have a hangover tomorrow.",
        explanation: "ڕەتکردنەوەی خواردنەوە بەهۆی سەرخۆشی کەمەوە: 'No thanks, I'm already a little tipsy.'",
      },
    ],
  },

  // Lesson 5: Leaving Early
  {
    topic: "Leaving Early", topicKu: "زوو ڕۆیشتن",
    words: [
      { english: "Bail", kurdish: "جێهێشتن یان نەچوون بۆ شوێنێک" },
      { english: "Dip", kurdish: "ڕۆیشتنی خێرا لە شوێنێک" },
      { english: "Head out", kurdish: "دەرچوون و ڕۆیشتن" },
      { english: "Call it a night", kurdish: "کۆتاییهێنان بە شەو (ڕۆیشتنەوە)" },
      { english: "Ghost", kurdish: "ڕۆیشتن بەبێ ماڵئاوایی" },
    ],
    voices: [
      { prompt: "بڵێ پێویستە بڕۆین", target: "I think it's time to head out.", targetKurdish: "پێموایە کاتی ئەوەیە بڕۆین." },
      { prompt: "بڵێ با کۆتایی پێ بهێنین", target: "I'm exhausted, let's call it a night.", targetKurdish: "زۆر ماندووم، با کۆتایی پێ بهێنین (بڕۆینەوە)." },
    ],
    sentences: [
      { english: ["I", "think", "it's", "time", "to", "head", "out"], kurdish: "پێموایە کاتی ئەوەیە بڕۆین" },
      { english: ["I'm", "exhausted", "let's", "call", "it", "a", "night"], kurdish: "زۆر ماندووم، با کۆتایی پێ بهێنین" },
    ],
    fillBlanks: [
      { parts: ["This party is boring, let's just", "."], hint: "ڕۆیشتنی خێرا (نوقمبوون)", answer: "dip", wrongs: ["swim", "jumping", "apple"] },
      { parts: ["He totally", "on us and never showed up."], hint: "وازهێنان (بەجێهێشتن)", answer: "bailed", wrongs: ["sailed", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "لە ئاهەنگێک زۆر ماندوو بوویت",
        theyAsk: "Where are you going? The party just started!",
        correct: "Sorry, I'm really tired. I'm gonna call it a night.",
        wrong1: "I call the night on the phone.",
        wrong2: "I ghost the house.",
        wrong3: "Head out the door window.",
        explanation: "ڕۆیشتنەوە بەهۆی ماندوێتیەوە: 'Sorry, I'm really tired. I'm gonna call it a night.'",
      },
    ],
  },

  // Lesson 6: Music & Dancing
  {
    topic: "Music", topicKu: "مۆسیقا و سەما",
    words: [
      { english: "Banger", kurdish: "گۆرانییەکی زۆر خۆش" },
      { english: "Turn up", kurdish: "زیادکردنی دەنگ / بەجۆشکردن" },
      { english: "Vibe to", kurdish: "چێژوەرگرتن لە مۆسیقایەک" },
      { english: "Drop the beat", kurdish: "دەستپێکردنی مۆسیقای قورس" },
      { english: "Move to the rhythm", kurdish: "جوڵانەوە لەگەڵ ڕیتم" },
    ],
    voices: [
      { prompt: "بڵێ ئەم گۆرانییە زۆر خۆشە", target: "This song is an absolute banger.", targetKurdish: "ئەم گۆرانییە بەتەواوی شازە." },
      { prompt: "بڵێ دەنگی مۆسیقاکە بەرزبکەرەوە", target: "Turn the music up, I love this part.", targetKurdish: "دەنگی مۆسیقاکە بەرزبکەرەوە، ئەم بەشەم خۆشدەوێت." },
    ],
    sentences: [
      { english: ["This", "song", "is", "an", "absolute", "banger"], kurdish: "ئەم گۆرانییە بەتەواوی شازە" },
      { english: ["Turn", "the", "music", "up", "I", "love", "this", "part"], kurdish: "دەنگی مۆسیقاکە بەرزبکەرەوە، ئەم بەشەم خۆشدەوێت" },
    ],
    fillBlanks: [
      { parts: ["Everyone was", "to the music in the club."], hint: "چێژوەرگرتن (ڤایبینگ)", answer: "vibing", wrongs: ["driving", "jumping", "apple"] },
      { parts: ["Wait for the DJ to", "the beat."], hint: "خستنەخوارەوە", answer: "drop", wrongs: ["pick", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "گۆرانییەکی نوێ لە سەیارە لێدەدەیت",
        theyAsk: "What do you think of this new song?",
        correct: "Turn it up! It's a complete banger.",
        wrong1: "The banger is a sausage.",
        wrong2: "Drop the beat on the floor.",
        wrong3: "I move to the window.",
        explanation: "وەسفکردنی گۆرانییەکی خۆش: 'Turn it up! It's a complete banger.'",
      },
    ],
  },

  // Lesson 7: Late Night Food
  {
    topic: "Late Night Food", topicKu: "خواردنی درەنگانی شەو",
    words: [
      { english: "Munchies", kurdish: "ئارەزووی زۆری خواردن" },
      { english: "Greasy", kurdish: "چەور (وەک پیتزا یان بەرگر)" },
      { english: "Hit the spot", kurdish: "ڕێک ئەوەبوو کە دەمویست" },
      { english: "Drive-thru", kurdish: "کڕینی خواردن لەناو ئۆتۆمبێلەوە" },
      { english: "Midnight snack", kurdish: "خواردنی سووکی نیوەشەو" },
    ],
    voices: [
      { prompt: "بڵێ زۆر ئارەزووی خواردن دەکەم", target: "I've got the munchies so bad.", targetKurdish: "زۆر خراپ ئارەزووی خواردن دەکەم." },
      { prompt: "بڵێ با بڕۆین بۆ درایڤ سروو", target: "Let's hit the drive-thru really quick.", targetKurdish: "با زۆر بەخێرایی بڕۆین بۆ درایڤ سروو." },
    ],
    sentences: [
      { english: ["I've", "got", "the", "munchies", "so", "bad"], kurdish: "زۆر خراپ ئارەزووی خواردن دەکەم" },
      { english: ["Let's", "hit", "the", "drive-thru", "really", "quick"], kurdish: "با زۆر بەخێرایی بڕۆین بۆ درایڤ سروو" },
    ],
    fillBlanks: [
      { parts: ["This pizza really", "the spot."], hint: "لێدان (ڕێک ئەوە بوو)", answer: "hit", wrongs: ["punched", "jumping", "apple"] },
      { parts: ["I need a midnight", "before I sleep."], hint: "خواردنی سووک", answer: "snack", wrongs: ["snake", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "کاتژمێر دووی شەوە و برسیتە",
        theyAsk: "I'm starving. Should we get food?",
        correct: "Yeah, I got the munchies. Let's hit the drive-thru.",
        wrong1: "The drive-thru is a car.",
        wrong2: "Midnight snack the dog.",
        wrong3: "I hit the greasy spot.",
        explanation: "ڕازیکردنی کەسێک بۆ خواردنی درەنگانی شەو: 'Yeah, I got the munchies. Let's hit the drive-thru.'",
      },
    ],
  },

  // Lesson 8: Getting Lost
  {
    topic: "Getting Lost", topicKu: "ونبوون",
    words: [
      { english: "Lost", kurdish: "ونبوو" },
      { english: "Middle of nowhere", kurdish: "لە شوێنێکی چۆڵ (نەزانراو)" },
      { english: "Turn around", kurdish: "گەڕانەوە" },
      { english: "Shortcut", kurdish: "ڕێگەی کورتکراوە" },
      { english: "Dead end", kurdish: "کۆڵانی داخراو" },
    ],
    voices: [
      { prompt: "بڵێ ئێمە لە شوێنێکی چۆڵین", target: "We are in the middle of nowhere.", targetKurdish: "ئێمە لە ناوەڕاستی هیچ شوێنێکداین (شوێنی چۆڵ)." },
      { prompt: "بڵێ ئەمە کۆڵانێکی داخراوە", target: "We have to go back, it's a dead end.", targetKurdish: "پێویستە بگەڕێینەوە، ئەمە کۆڵانێکی داخراوە." },
    ],
    sentences: [
      { english: ["We", "are", "in", "the", "middle", "of", "nowhere"], kurdish: "ئێمە لە ناوەڕاستی هیچ شوێنێکداین (شوێنی چۆڵ)" },
      { english: ["We", "have", "to", "go", "back", "it's", "a", "dead", "end"], kurdish: "پێویستە بگەڕێینەوە، ئەمە کۆڵانێکی داخراوە" },
    ],
    fillBlanks: [
      { parts: ["I tried to take a", "but I got lost."], hint: "ڕێگەی کورت", answer: "shortcut", wrongs: ["longcut", "jumping", "apple"] },
      { parts: ["We need to turn", "and go the other way."], hint: "دەوروبەر (گەڕانەوە)", answer: "around", wrongs: ["square", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "لە ڕێگایەکی نەناسراو شۆفێری دەکەیت",
        theyAsk: "Do you know where we are?",
        correct: "No idea. I think we're in the middle of nowhere.",
        wrong1: "The nowhere is a middle.",
        wrong2: "Turn around the table.",
        wrong3: "Shortcut the dead end.",
        explanation: "داننان بە ونبوون: 'No idea. I think we're in the middle of nowhere.'",
      },
    ],
  },

  // Lesson 9: The Day After
  {
    topic: "The Next Day", topicKu: "ڕۆژی دواتر",
    words: [
      { english: "Rough", kurdish: "سەخت (باری تەندروستی خراپ)" },
      { english: "Recap", kurdish: "بیرهێنانەوەی ڕووداوەکان" },
      { english: "Regret", kurdish: "پەشیمانی" },
      { english: "Sleep it off", kurdish: "خەوتن بۆ چاکبوونەوە" },
      { english: "Piece it together", kurdish: "بیرکەوتنەوەی ڕووداوەکان وردە وردە" },
    ],
    voices: [
      { prompt: "بڵێ بەیانییەکی سەختە", target: "I am having a really rough morning.", targetKurdish: "بەیانییەکی بەڕاستی سەخت بەسەردەبەم." },
      { prompt: "بڵێ با خەوێک بکەم تا باشتر دەبم", target: "I'm just going to try and sleep it off.", targetKurdish: "تەنها هەوڵدەدەم بخەوم بۆ ئەوەی باشتر بم." },
    ],
    sentences: [
      { english: ["I", "am", "having", "a", "really", "rough", "morning"], kurdish: "بەیانییەکی بەڕاستی سەخت بەسەردەبەم" },
      { english: ["I'm", "just", "going", "to", "try", "and", "sleep", "it", "off"], kurdish: "تەنها هەوڵدەدەم بخەوم بۆ ئەوەی باشتر بم" },
    ],
    fillBlanks: [
      { parts: ["Can someone give me a", "of what happened last night?"], hint: "کورتەیەک (بیرهێنانەوە)", answer: "recap", wrongs: ["cap", "jumping", "apple"] },
      { parts: ["I deeply", "sending that text message."], hint: "پەشیمان", answer: "regret", wrongs: ["forget", "cloud", "shoe"] },
    ],
    conversations: [
      {
        situation: "ڕۆژی دوای ئاهەنگێکی گەورە لە خەو هەڵدەستیت",
        theyAsk: "How are you feeling this morning?",
        correct: "Rough. I just need to sleep it off.",
        wrong1: "I regret the sleep.",
        wrong2: "Piece it together the puzzle.",
        wrong3: "The recap is a hat.",
        explanation: "وەسفکردنی باری تەندروستی خراپ دوای ئاهەنگ: 'Rough. I just need to sleep it off.'",
      },
    ],
  },
];

export default unit04;
