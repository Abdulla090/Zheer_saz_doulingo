export type SlangType = "Gen Z Slang" | "Idiom" | "Everyday Phrase" | "Street Slang" | "Business/Formal";

export interface SlangItem {
  id: string;
  phrase: string;
  pronunciation: string;
  kuMeaning: string;
  category: "Normal" | "Slang" | "Idioms" | "Business";
  type: SlangType;
  example: {
    speakerA: string;
    speakerB: string;
    kuA: string;
    kuB: string;
  };
}

export const SLANG_CATEGORIES = {
  Normal: { en: "Everyday Slang", ku: "سلاکی ڕۆژانە" },
  Slang: { en: "Gen Z & Street", ku: "سلاکی نوێ" },
  Idioms: { en: "Idioms", ku: "ئیدیۆمەکان" },
  Business: { en: "Business/Formal", ku: "فەرمی و کار" },
};

export const SLANG_DATA: SlangItem[] = [
  // =====================
  // EVERYDAY SLANG (Normal)
  // =====================
  {
    id: "hit_me_up",
    phrase: "Hit me up",
    pronunciation: "هیت می ئەپ",
    kuMeaning: "پەیوەندیم پێوە بکە / نامەم بۆ بنێرە",
    category: "Normal",
    type: "Everyday Phrase",
    example: {
      speakerA: "I'm free this weekend, hit me up if you want to hang out.",
      speakerB: "Will do! Let's get coffee.",
      kuA: "ئەم کۆتایی هەفتەیە کاتم هەیە، پەیوەندیم پێوە بکە ئەگەر ویستت بچینە دەرەوە.",
      kuB: "بێگومان! با بچین قاوەیەک بخۆینەوە.",
    },
  },
  {
    id: "whats_up",
    phrase: "What's up? (Sup)",
    pronunciation: "وەتس ئەپ؟",
    kuMeaning: "چ باسە؟ / چی هەیە نوێ؟",
    category: "Normal",
    type: "Everyday Phrase",
    example: {
      speakerA: "Hey man, what's up?",
      speakerB: "Not much, just chilling at home.",
      kuA: "سڵاو برا، چ باسە؟",
      kuB: "هیچی وا نییە، تەنها لە ماڵەوەم پشوو دەدەم.",
    },
  },
  {
    id: "my_bad",
    phrase: "My bad",
    pronunciation: "مای باد",
    kuMeaning: "هەڵەی من بوو / ببورە",
    category: "Normal",
    type: "Everyday Phrase",
    example: {
      speakerA: "You stepped on my shoe!",
      speakerB: "Oh, my bad! I didn't see you there.",
      kuA: "پێت نا بە پێڵاوەکەمدا!",
      kuB: "ئۆهـ، هەڵەی من بوو! لەوێ نەتبینیم.",
    },
  },
  {
    id: "chill_out",
    phrase: "Chill out",
    pronunciation: "چێڵ ئاوت",
    kuMeaning: "ئارام بەوە / هێمن بەوە",
    category: "Normal",
    type: "Everyday Phrase",
    example: {
      speakerA: "I can't believe I lost my keys again!",
      speakerB: "Hey, just chill out. We'll find them.",
      kuA: "باوەڕ ناکەم دووبارە کلیلەکانم ون کردووە!",
      kuB: "هێی، تەنها ئارام بەوە. دەیدۆزینەوە.",
    },
  },
  {
    id: "hang_out",
    phrase: "Hang out",
    pronunciation: "هانگ ئاوت",
    kuMeaning: "کات بەسەربردن لەگەڵ هاوڕێیاندا",
    category: "Normal",
    type: "Everyday Phrase",
    example: {
      speakerA: "Do you want to hang out after school?",
      speakerB: "Sure, let's go to the park.",
      kuA: "دەتەوێت دوای قوتابخانە پێکەوە کات بەسەر بەرین؟",
      kuB: "بێگومان، با بچین بۆ پاركەکە.",
    },
  },
  {
    id: "bummer",
    phrase: "Bummer",
    pronunciation: "بەمەر",
    kuMeaning: "ناخۆشە / جێی بێتاقەتییە",
    category: "Normal",
    type: "Everyday Phrase",
    example: {
      speakerA: "The concert got canceled due to the rain.",
      speakerB: "Oh man, that's such a bummer.",
      kuA: "کۆنسێرتەکە هەڵوەشایەوە بەهۆی بارانەوە.",
      kuB: "ئۆهـ برا، ئەوە زۆر ناخۆشە.",
    },
  },
  {
    id: "sick",
    phrase: "Sick",
    pronunciation: "سیك",
    kuMeaning: "زۆر شازە / زۆر نایابە (وەک وەسفێک)",
    category: "Normal",
    type: "Street Slang",
    example: {
      speakerA: "Look at my new car!",
      speakerB: "Whoa, that is sick!",
      kuA: "سەیری ئۆتۆمبێلە نوێیەکەم بکە!",
      kuB: "واو، ئەوە زۆر شازە!",
    },
  },
  {
    id: "no_big_deal",
    phrase: "No big deal (NBD)",
    pronunciation: "نۆ بیگ دیڵ",
    kuMeaning: "کێشە نییە / شتێکی گەورە نییە",
    category: "Normal",
    type: "Everyday Phrase",
    example: {
      speakerA: "I forgot to bring your book, I'm sorry.",
      speakerB: "It's no big deal, you can bring it tomorrow.",
      kuA: "بیرم چوو کتێبەکەت بهێنم، ببورە.",
      kuB: "کێشە نییە، دەتوانیت سبەی بیهێنیت.",
    },
  },
  {
    id: "rip_off",
    phrase: "Rip-off",
    pronunciation: "ڕیپ ئۆف",
    kuMeaning: "زۆر گرانە / فێڵکردنە لە نرخدا",
    category: "Normal",
    type: "Street Slang",
    example: {
      speakerA: "They charged me $50 for this t-shirt.",
      speakerB: "That's a total rip-off!",
      kuA: "٥٠ دۆلاریان لێ وەرگرتم بۆ ئەم تیشێرتە.",
      kuB: "ئەوە بە تەواوی فێڵکردنە! (زۆر گرانە)",
    },
  },
  {
    id: "bail",
    phrase: "Bail",
    pronunciation: "بەیڵ",
    kuMeaning: "ڕۆیشتن لەپڕ / جێهێشتنی شوێنێک زوو",
    category: "Normal",
    type: "Street Slang",
    example: {
      speakerA: "This party is boring, I think I'm gonna bail.",
      speakerB: "Yeah, let's get out of here.",
      kuA: "ئەم ئاهەنگە بێزارکەرە، پێم وایە من دەڕۆم.",
      kuB: "بەڵێ، با لێرە بڕۆین.",
    },
  },
  {
    id: "salty",
    phrase: "Salty",
    pronunciation: "سۆڵتی",
    kuMeaning: "توڕە یان دڵگران بەهۆی شتێکی بچووکەوە",
    category: "Normal",
    type: "Gen Z Slang",
    example: {
      speakerA: "He is still salty because he lost the game.",
      speakerB: "He needs to get over it.",
      kuA: "ئەو هێشتا توڕە و دڵگرانە چونکە یارییەکەی دۆڕاند.",
      kuB: "پێویستە لەبیری بکات و تێیپەڕێنێت.",
    },
  },
  {
    id: "sketchy",
    phrase: "Sketchy",
    pronunciation: "سکێچی",
    kuMeaning: "جێگای گومان / باوەڕپێنەکراو",
    category: "Normal",
    type: "Street Slang",
    example: {
      speakerA: "I don't trust that website, it looks sketchy.",
      speakerB: "Don't put your credit card info there.",
      kuA: "متمانەم بەو وێبسایتە نییە، جێگای گومانە.",
      kuB: "زانیاری کارتی بانکەکەت لەوێ دامەنێ.",
    },
  },

  // =====================
  // SLANG (Gen Z & Street)
  // =====================
  {
    id: "no_cap",
    phrase: "No cap",
    pronunciation: "نۆ کاپ",
    kuMeaning: "بەڕاستی / بەبێ درۆکردن",
    category: "Slang",
    type: "Gen Z Slang",
    example: {
      speakerA: "This food is the best I've ever had, no cap.",
      speakerB: "For real? I need to try it too!",
      kuA: "ئەم خواردنە باشترین شتە کە تا ئێستا خواردبێتم، بەبێ درۆ.",
      kuB: "بەڕاستی؟ منیش دەبێت تاقیی بکەمەوە!",
    },
  },
  {
    id: "lowkey",
    phrase: "Lowkey",
    pronunciation: "لۆوکی",
    kuMeaning: "بە نهێنی / کەمێک (حەزێک کە ناتەوێت زۆر ئاشکرای بکەیت)",
    category: "Slang",
    type: "Gen Z Slang",
    example: {
      speakerA: "I lowkey want to skip the party tonight.",
      speakerB: "Same here, I'm just too tired.",
      kuA: "کەمێک بە نهێنی حەز دەکەم ئەمشەو نەچم بۆ ئاهەنگەکە.",
      kuB: "منیش هەمان شتم، تەنها زۆر ماندووم.",
    },
  },
  {
    id: "bussin",
    phrase: "Bussin'",
    pronunciation: "بەسن",
    kuMeaning: "زۆر بەتامە (زیاتر بۆ خواردنی خۆش بەکاردێت)",
    category: "Slang",
    type: "Gen Z Slang",
    example: {
      speakerA: "Man, this burger is absolutely bussin'!",
      speakerB: "I told you! That sauce is amazing.",
      kuA: "براکەم، ئەم بەرگرە بە ڕاستی زۆر بەتام و نایابە!",
      kuB: "پێم وتیت! ئەو سۆسەی زۆر شازە.",
    },
  },
  {
    id: "rizz",
    phrase: "Rizz",
    pronunciation: "ڕیز",
    kuMeaning: "جازیبەی قسەکردن / توانای سەرنجڕاکێشانی خەڵک",
    category: "Slang",
    type: "Gen Z Slang",
    example: {
      speakerA: "Look at him talking to everyone. He has so much rizz.",
      speakerB: "No doubt, he is super charming.",
      kuA: "سەیری بکە چۆن قسە لەگەڵ هەمووان دەکات. خاوەن جازیبەیەکی زۆرە.",
      kuB: "بێ گومان، یەکجار سەرنجڕاکێشە.",
    },
  },
  {
    id: "ghost_someone",
    phrase: "Ghost someone",
    pronunciation: "گۆست سەموەن",
    kuMeaning: "بڕینی پەیوەندی بە بێدەنگی و دیار نەمانی لەپڕ",
    category: "Slang",
    type: "Street Slang",
    example: {
      speakerA: "Did you ever reply to Ahmed's messages?",
      speakerB: "No, I decided to ghost him. He was being too annoying.",
      kuA: "هیچ وەڵامی نامەکانی ئەحمەدت دایەوە؟",
      kuB: "نەخێر، بڕیارمدا لەپڕ دیار نەمێنم. زۆر بێزارکەر بوو.",
    },
  },
  {
    id: "spill_the_tea",
    phrase: "Spill the tea",
    pronunciation: "سپیل زە تی",
    kuMeaning: "قسە و باس گێڕانەوە / ئاشکراکردنی نهێنی",
    category: "Slang",
    type: "Gen Z Slang",
    example: {
      speakerA: "I heard what happened yesterday. Spill the tea!",
      speakerB: "Sit down, it's a long story.",
      kuA: "گوێم لێبوو دوێنێ چی ڕوویدا. باسی بکە!",
      kuB: "دابنیشە، چیرۆکێکی درێژە.",
    },
  },
  {
    id: "slay",
    phrase: "Slay",
    pronunciation: "سلەی",
    kuMeaning: "زۆر بە جوانی و سەرکەوتوویی دەرکەوتن",
    category: "Slang",
    type: "Gen Z Slang",
    example: {
      speakerA: "Your outfit today is amazing!",
      speakerB: "Thanks! I'm trying to slay today.",
      kuA: "جلەکانی ئەمڕۆت زۆر شازن!",
      kuB: "سوپاس! هەوڵ دەدەم ئەمڕۆ نایاب دەربکەوم.",
    },
  },
  {
    id: "bet",
    phrase: "Bet",
    pronunciation: "بێت",
    kuMeaning: "قبوڵە / باشە / دڵنیابە (بۆ ڕازیبوون لەسەر شتێک)",
    category: "Slang",
    type: "Street Slang",
    example: {
      speakerA: "I'll pick you up at 8 PM.",
      speakerB: "Bet. See you then.",
      kuA: "کاتژمێر ٨ی شەو دێم بە شوێنتدا.",
      kuB: "باشە، قبوڵە. ئەو کاتە دەتبینم.",
    },
  },
  {
    id: "flex",
    phrase: "Flex",
    pronunciation: "فلێکس",
    kuMeaning: "خۆ دەرخستن / فیز لێدان بە شتێکەوە",
    category: "Slang",
    type: "Gen Z Slang",
    example: {
      speakerA: "He bought a new watch just to flex on us.",
      speakerB: "Yeah, he likes to show off.",
      kuA: "سەعاتێکی نوێی کڕی تەنها بۆ فیز لێدان بەسەرماندا.",
      kuB: "بەڵێ، حەز بە خۆ دەرخستن دەکات.",
    },
  },
  {
    id: "shady",
    phrase: "Shady",
    pronunciation: "شەیدی",
    kuMeaning: "گوماناوی / کەسێک کە جێگای متمانە نییە",
    category: "Normal",
    type: "Street Slang",
    example: {
      speakerA: "I don't trust him, he acts so shady.",
      speakerB: "Yeah, keep your distance from him.",
      kuA: "متمانەم پێی نییە، ڕەفتارەکانی گوماناوین.",
      kuB: "بەڵێ، لێی دوور بکەوەرەوە.",
    },
  },
  {
    id: "lit",
    phrase: "Lit",
    pronunciation: "لیت",
    kuMeaning: "زۆر شازە / پڕ لە جۆش و خرۆشە (بۆ ئاهەنگ یان ڕووداو)",
    category: "Slang",
    type: "Gen Z Slang",
    example: {
      speakerA: "How was the party last night?",
      speakerB: "It was absolutely lit!",
      kuA: "ئاهەنگی شەوی ڕابردوو چۆن بوو؟",
      kuB: "بە تەواوی شاز بوو!",
    },
  },
  {
    id: "clout",
    phrase: "Clout",
    pronunciation: "کلاوت",
    kuMeaning: "ناوبانگ و کاریگەری (زیاتر لە سۆشیاڵ میدیا)",
    category: "Slang",
    type: "Gen Z Slang",
    example: {
      speakerA: "He only did that stunt for clout.",
      speakerB: "People do anything for followers these days.",
      kuA: "ئەو کارەی تەنها بۆ ناوبانگ کرد.",
      kuB: "خەڵکی ئەم ڕۆژانە هەموو شتێک دەکەن بۆ فۆڵۆوەر.",
    },
  },

  // =====================
  // IDIOMS
  // =====================
  {
    id: "piece_of_cake",
    phrase: "Piece of cake",
    pronunciation: "پیس ئۆف کەیك",
    kuMeaning: "زۆر ئاسان / ئاسان وەک ئاو خواردنەوە",
    category: "Idioms",
    type: "Idiom",
    example: {
      speakerA: "How was your math exam today?",
      speakerB: "It was a piece of cake! I finished in 20 minutes.",
      kuA: "ئەمڕۆ تاقیکردنەوەی بیرکارییەکەت چۆن بوو؟",
      kuB: "زۆر ئاسان بوو! لە ٢٠ خولەکدا تەواوم کرد.",
    },
  },
  {
    id: "under_the_weather",
    phrase: "Under the weather",
    pronunciation: "ئەندەر زە وێزەر",
    kuMeaning: "نەخۆش بوون / هەستکردن بە بێتاقەتی",
    category: "Idioms",
    type: "Idiom",
    example: {
      speakerA: "I won't be able to come to work today, I feel a bit under the weather.",
      speakerB: "Take some rest. Hope you feel better soon.",
      kuA: "ئەمڕۆ ناتوانم بێم بۆ سەر کار، هەست بە کەمێک نەخۆشی دەکەم.",
      kuB: "کەمێک پشوو بدە. بەهیوام زووتر باش بیتەوە.",
    },
  },
  {
    id: "bite_the_bullet",
    phrase: "Bite the bullet",
    pronunciation: "بایت زە بولێت",
    kuMeaning: "ڕووبەڕووبوونەوەی بارودۆخێکی قورس یان ناخۆش بە ئازایەتییەوە",
    category: "Idioms",
    type: "Idiom",
    example: {
      speakerA: "I really don't want to go to the dentist.",
      speakerB: "I know, but you just have to bite the bullet and go.",
      kuA: "بەڕاستی نامەوێت بچم بۆ لای پزیشکی ددان.",
      kuB: "دەزانم، بەڵام دەبێت خۆت بگرێت و بچیت (ڕووبەڕووی بیتەوە).",
    },
  },
  {
    id: "break_a_leg",
    phrase: "Break a leg",
    pronunciation: "برەیك ئە لێگ",
    kuMeaning: "بەهیوای سەرکەوتن / چانسێکی باش",
    category: "Idioms",
    type: "Idiom",
    example: {
      speakerA: "I'm so nervous about my presentation today.",
      speakerB: "You'll do great. Break a leg!",
      kuA: "زۆر شڵەژاوم بۆ پێشکەشکردنەکەم ئەمڕۆ.",
      kuB: "بە باشی ئەنجامی دەدەیت. بەهیوای سەرکەوتن!",
    },
  },
  {
    id: "call_it_a_day",
    phrase: "Call it a day",
    pronunciation: "کۆڵ ئت ئە دەی",
    kuMeaning: "کۆتایی هێنان بە کارکردن بۆ ئەو ڕۆژە",
    category: "Idioms",
    type: "Idiom",
    example: {
      speakerA: "We've been working on this code for 8 hours.",
      speakerB: "Let's call it a day and continue tomorrow.",
      kuA: "ماوەی ٨ کاتژمێرە کار لەسەر ئەم کۆدە دەکەین.",
      kuB: "با بۆ ئەمڕۆ کۆتایی پێ بهێنین و سبەی بەردەوام بین.",
    },
  },

  // =====================
  // BUSINESS / FORMAL
  // =====================
  {
    id: "think_outside_the_box",
    phrase: "Think outside the box",
    pronunciation: "سینك ئاوتساید زە بۆکس",
    kuMeaning: "بیرکردنەوە بە شێوەیەکی داهێنەرانە و جیاواز لە باو",
    category: "Business",
    type: "Business/Formal",
    example: {
      speakerA: "We need a new marketing strategy, something unique.",
      speakerB: "Let's try to think outside the box this time.",
      kuA: "پێویستمان بە ستراتیژییەکی نوێی بازاڕکردنە، شتێکی ناوازە.",
      kuB: "با هەوڵ بدەین ئەم جارە بە شێوەیەکی داهێنەرانە و جیاواز بیر بکەینەوە.",
    },
  },
  {
    id: "wrap_up",
    phrase: "Wrap up",
    pronunciation: "ڕاپ ئەپ",
    kuMeaning: "کۆتایی پێهێنان / تەواوکردنی کارێک یان کۆبوونەوەیەک",
    category: "Business",
    type: "Business/Formal",
    example: {
      speakerA: "Let's wrap up this meeting, we are running out of time.",
      speakerB: "Agreed. I will send the summary email shortly.",
      kuA: "با کۆتایی بەم کۆبوونەوەیە بهێنین، کاتمان خەریکە تەواو دەبێت.",
      kuB: "هاوڕام. بەم زووانە ئیمەیڵی کورتکراوەکە دەنێرم.",
    },
  },
  {
    id: "on_the_same_page",
    phrase: "On the same page",
    pronunciation: "ئۆن زە سەیم پەیج",
    kuMeaning: "لێکتێگەیشتن و هاوڕابوون لەسەر بابەتێک",
    category: "Business",
    type: "Business/Formal",
    example: {
      speakerA: "Before we start the project, let's make sure we are on the same page.",
      speakerB: "Yes, let's review the requirements together.",
      kuA: "پێش ئەوەی دەست بە پڕۆژەکە بکەین، با دڵنیابینەوە کە هەردووکمان لەسەر هەمان تێگەیشتنین.",
      kuB: "بەڵێ، با پێکەوە پێداچوونەوە بە داواکارییەکاندا بکەین.",
    },
  },
  {
    id: "touch_base",
    phrase: "Touch base",
    pronunciation: "تەچ بەیس",
    kuMeaning: "قسەکردن لەگەڵ کەسێک بۆ پێداچوونەوەی زانیاری نوێ",
    category: "Business",
    type: "Business/Formal",
    example: {
      speakerA: "I will finish this report by Friday.",
      speakerB: "Great, let's touch base on Monday morning.",
      kuA: "ئەم ڕاپۆرتە تا ڕۆژی هەینی تەواو دەکەم.",
      kuB: "زۆر باشە، با بەیانی ڕۆژی دووشەممە قسەی لەسەر بکەینەوە.",
    },
  },
  {
    id: "reach_out",
    phrase: "Reach out",
    pronunciation: "ڕیچ ئاوت",
    kuMeaning: "پەیوەندیکردن بە کەسێکەوە بۆ یارمەتی یان پرسیار",
    category: "Business",
    type: "Business/Formal",
    example: {
      speakerA: "If you have any questions, feel free to reach out.",
      speakerB: "Thank you, I will definitely contact you if I need help.",
      kuA: "ئەگەر هەر پرسیارێکت هەبوو، دوودڵ مەبە لە پەیوەندیکردن پێمەوە.",
      kuB: "سوپاس، ئەگەر پێویستم بە یارمەتی بوو بە دڵنیاییەوە پەیوەندیت پێوە دەکەم.",
    },
  }
];
