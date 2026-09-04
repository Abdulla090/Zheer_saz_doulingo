import { UnitBank } from "../types";

// ── Unit 7: Idioms & Natural Slang — 10 unique lessons ───────────────────────
// Conversational idioms and everyday casual English — friendly, not vulgar.

const unit07: UnitBank = [
  {
    "topic": "No Worries",
    "topicKu": "نیگەران مەبە",
    "topicAr": "لا تقلق",
    "words": [
      {
        "english": "No worries, it happens to everyone.",
        "kurdish": "نیگەران مەبە، بۆ هەمووان ڕوودەدات.",
        "arabic": "لا تقلق، هذا يصير ويه الكل.",
        "russian": "Без проблем, такое со всеми бывает."
      },
      {
        "english": "Don't sweat it, seriously.",
        "kurdish": "خەمی مەخۆ، بەڕاستی.",
        "arabic": "لا تشيل هم، والله.",
        "russian": "Не парься, правда."
      },
      {
        "english": "You're good — I wasn't waiting long.",
        "kurdish": "هیچ کێشەیەک نییە — زۆر چاوەڕێم نەکرد.",
        "arabic": "عادي — ما انتظرت هواية.",
        "russian": "Всё нормально — я недолго ждал."
      },
      {
        "english": "It's all good, honestly.",
        "kurdish": "هەمووی باشە، بەڕاستی.",
        "arabic": "كلشي تمام، بصراحة.",
        "russian": "Всё отлично, честное слово."
      },
      {
        "english": "No biggie, I already handled it.",
        "kurdish": "شتێکی گەورە نییە، پێشتر چارەسەرم کرد.",
        "arabic": "مو مشكلة چبيرة، خلصتها من قبل.",
        "russian": "Ерунда, я уже сам всё решил."
      },
      {
        "english": "Please don't even think about it.",
        "kurdish": "تکایە تەنانەت بیریشی لێ مەکەرەوە.",
        "arabic": "بلا زحمة لا تفكر بيها أصلاً.",
        "russian": "Пожалуйста, даже не переживай об этом."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Hey, we've all been there.",
        "targetKurdish": "ئەی، هەموومان تووشی ئەمە بووین.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "يا عيني، كلنا مرينا بهيچي.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Эй, со всеми нами такое бывало."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Totally fine — I hadn't started yet.",
        "targetKurdish": "تەواو باشە — هێشتا دەستم پێ نەکردبوو.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "عادي كلش — چنت ما بادي بعدني.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Всё в полном порядке — я ещё даже не начинал."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Seriously, stop apologizing.",
        "targetKurdish": "بەڕاستی، وازبهێنە لە داوای لێبوردن.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "من صدگ، كافي تعتذر.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Серьёзно, прекрати извиняться."
      }
    ],
    "sentences": [
      {
        "english": [
          "Thanks",
          "for",
          "letting",
          "me",
          "know"
        ],
        "kurdish": "سوپاس کە ئاگادارت کردم.",
        "arabic": "شكراً لأن كلتلي.",
        "russian": "Спасибо, что предупредил."
      },
      {
        "english": [
          "We",
          "can",
          "push",
          "it",
          "to",
          "tomorrow"
        ],
        "kurdish": "دەتوانین بیخەینە سبەینێ.",
        "arabic": "نكدر نأجله لباجر.",
        "russian": "Мы можем перенести это на завтра."
      },
      {
        "english": [
          "It's",
          "really",
          "not",
          "a",
          "big",
          "deal"
        ],
        "kurdish": "بەڕاستی شتێکی گەورە نییە.",
        "arabic": "الموضوع مو مهم والله.",
        "russian": "В этом правда нет ничего страшного."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Don't ",
          " it — I already fixed the file."
        ],
        "hint": "خەمی مەخۆ — پێشتر فایلەکەم چاک کردەوە.",
        "answer": "sweat",
        "wrongs": [
          "sweaty",
          "sweating",
          "swept"
        ],
        "arabicHint": "لا تشيل هم — خلصت الملف من قبل.",
        "arabicParts": [
          "لا تشيل ",
          " — خلصت الملف من قبل."
        ],
        "arabicAnswer": "هم",
        "arabicWrongs": [
          "غم",
          "هموم",
          "تعب"
        ],
        "russianHint": "Не переживай — я уже исправил файл.",
        "russianParts": [
          "Не ",
          " — я уже исправил файл."
        ],
        "russianAnswer": "парься",
        "russianWrongs": [
          "бойся",
          "страдай",
          "думай"
        ]
      },
      {
        "parts": [
          "No ",
          " , I've got it covered."
        ],
        "hint": "نیگەران مەبە، من چارەسەری دەکەم.",
        "answer": "worries",
        "wrongs": [
          "worry",
          "worried",
          "worrying"
        ],
        "arabicHint": "لا تقلق، الموضوع يمي.",
        "arabicParts": [
          "لا ",
          " ، الموضوع يمي."
        ],
        "arabicAnswer": "تقلق",
        "arabicWrongs": [
          "تخاف",
          "تزعل",
          "تضوج"
        ],
        "russianHint": "Без проблем, я всё уладил.",
        "russianParts": [
          "Без ",
          " , я всё уладил."
        ],
        "russianAnswer": "проблем",
        "russianWrongs": [
          "вопросов",
          "сомнений",
          "паники"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "دوای ئەوەی بە هەڵە نامەیەکی درەنگ ناردیت",
        "situationAr": "بعد ما رسلت إيميل متأخر بالغلط",
        "theyAsk": "Oh man, I'm so sorry I sent that email late!",
        "correct": "No worries, it happens to everyone. We still have time to fix it.",
        "wrong1": "Yes, you are very late.",
        "wrong2": "Don't do that again please.",
        "wrong3": "I am angry about the email.",
        "explanation": "'No worries' وەڵامێکی گەرم و ئاساییە بۆ لێبوردن — واتای 'نیگەران مەبە'ە",
        "theyAskAr": "يا أخي، كلش أعتذر دزيت الإيميل متأخر!",
        "correctAr": "لا تقلق، هذا يصير ويه الكل. بعد عدنا وكت نصلحه.",
        "wrong1Ar": "إي، أنت كلش متأخر.",
        "wrong2Ar": "لا تسويها بعد رجاءً.",
        "wrong3Ar": "أني ضايج علمود الإيميل.",
        "explanationAr": "'No worries' رد حلو وعادي للاعتذار — يعني 'لا تقلق'",
        "situationRu": "Когда случайно отправил письмо позже, чем нужно",
        "theyAskRu": "Дружище, прости пожалуйста, что отправил письмо с опозданием!",
        "correctRu": "Без проблем, такое со всеми бывает. У нас ещё есть время всё исправить.",
        "wrong1Ru": "Да, ты сильно опоздал.",
        "wrong2Ru": "Не делай так больше, пожалуйста.",
        "wrong3Ru": "Я очень зол из-за письма.",
        "explanationRu": "'No worries' — естественный и дружелюбный ответ на извинения, означающий 'не переживай'."
      },
      {
        "situation": "هاوڕێیەکت داوای لێبوردن دەکات بۆ ئەوەی نەیتوانی بێت",
        "situationAr": "صديقك يعتذر لأن ما كدر يجي",
        "theyAsk": "I'm really sorry I couldn't make it to dinner last night.",
        "correct": "You're good — honestly, we've all been there. Let's try again next week.",
        "wrong1": "You should have come.",
        "wrong2": "Why you not come?",
        "wrong3": "I was waiting long time.",
        "explanation": "'You're good' لە ئەمریکادا واتای 'هیچ کێشەیەک نییە' — زۆر باوە لەناو هاوڕێکاندا",
        "theyAskAr": "كلش أعتذر لأن ما كدرت أجي على العشا البارحة بالليل.",
        "correctAr": "عادي كلش — بصراحة كلنا مرينا بهيچي. خلينا نجرب مرة ثانية الأسبوع الجاي.",
        "wrong1Ar": "چان لازم تجي.",
        "wrong2Ar": "ليش ما جيت؟",
        "wrong3Ar": "انتظرتك هواية وكت.",
        "explanationAr": "'You're good' بأمريكا تعني 'ماكو مشكلة أبد' — كلش دارجة بين الأصدقاء",
        "situationRu": "Друг извиняется за то, что не смог прийти",
        "theyAskRu": "Мне очень жаль, что я не смог прийти на ужин вчера вечером.",
        "correctRu": "Всё нормально, правда — со всеми случается. Давай на следующей неделе попробуем.",
        "wrong1Ru": "Тебе следовало прийти.",
        "wrong2Ru": "Почему ты не пришёл?",
        "wrong3Ru": "Я долго тебя ждал.",
        "explanationRu": "'You're good' в американском английском означает 'всё в порядке, никаких обид'."
      }
    ],
    "topicRu": "Без проблем"
  },
  {
    "topic": "My Bad",
    "topicKu": "هەڵەی من بوو",
    "topicAr": "غلطتي",
    "words": [
      {
        "english": "My bad, I sent the wrong file.",
        "kurdish": "هەڵەی من بوو، فایلی هەڵەم نارد.",
        "arabic": "غلطتي، دزيت الملف الغلط.",
        "russian": "Мой косяк, я отправил не тот файл."
      },
      {
        "english": "That one's on me.",
        "kurdish": "ئەوە لە ئەستۆی منە.",
        "arabic": "هاي عليه، صوچي اني.",
        "russian": "Это моя вина."
      },
      {
        "english": "Oops — wrong group chat.",
        "kurdish": "ئۆپس — چاتی گروپی هەڵە.",
        "arabic": "أوبس — كروب غلط.",
        "russian": "Упс — ошибся групповым чатом."
      },
      {
        "english": "Yeah, I messed that up.",
        "kurdish": "بەڵێ، ئەوەم تێکدا.",
        "arabic": "إي، خربطتها.",
        "russian": "Да, я тут напортачил."
      },
      {
        "english": "I owe you one for covering me.",
        "kurdish": "قەرزارتم کە جێگەی منت گرتەوە.",
        "arabic": "اطلبك وحدة لأنك سديت مكاني.",
        "russian": "С меня причитается за то, что прикрыл меня."
      },
      {
        "english": "I should've double-checked first.",
        "kurdish": "دەبوایە سەرەتا دووبارە بمپشکنیایە.",
        "arabic": "چان لازم أچيك مرتين بالبداية.",
        "russian": "Мне следовало сначала перепроверить."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "My bad — I totally spaced on that.",
        "targetKurdish": "هەڵەی من بوو — تەواو لەبیرم چوو.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "غلطتي — نسيت الموضوع بالكامل.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Моя вина — совсем вылетело из головы."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I dropped the ball on this one.",
        "targetKurdish": "لەمەدا کەمتەرخەم بووم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "قصرت بهالموضوع.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Я сплоховал в этот раз."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "That was one hundred percent me.",
        "targetKurdish": "ئەوە بە سەدا سەد هەڵەی من بوو.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "هاي غلطتي اني مية بالمية.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Это на все сто процентов моя ошибка."
      }
    ],
    "sentences": [
      {
        "english": [
          "I'll",
          "fix",
          "it",
          "before",
          "lunch"
        ],
        "kurdish": "پێش نانی نیوەڕۆ چاکی دەکەمەوە.",
        "arabic": "راح اصلحه قبل الغدا.",
        "russian": "Я исправлю это до обеда."
      },
      {
        "english": [
          "Let",
          "me",
          "redo",
          "that",
          "part",
          "real",
          "quick"
        ],
        "kurdish": "با بە خێرایی ئەو بەشە دووبارە بکەمەوە.",
        "arabic": "خليني أعيد هذاك الجزء على السريع.",
        "russian": "Давай я по-быстрому переделаю эту часть."
      },
      {
        "english": [
          "It",
          "won't",
          "happen",
          "again,",
          "I",
          "promise"
        ],
        "kurdish": "دووبارە ڕوونادات، بەڵێن دەدەم.",
        "arabic": "ما راح تنعاد، اوعدك.",
        "russian": "Это больше не повторится, обещаю."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Sorry, I totally ",
          " on our call yesterday."
        ],
        "hint": "ببوورە، تەواو پەیوەندییەکەی دوێنێم لەبیر چوو.",
        "answer": "spaced",
        "wrongs": [
          "space",
          "spacing",
          "spaces"
        ],
        "arabicHint": "آسف، نسيت مكالمتنا البارحة بالكامل.",
        "arabicParts": [
          "آسف، ",
          " مكالمتنا البارحة بالكامل."
        ],
        "arabicAnswer": "نسيت",
        "arabicWrongs": [
          "ذكرت",
          "عفت",
          "شفت"
        ],
        "russianHint": "Прости, наш вчерашний созвон совсем вылетел у меня из головы.",
        "russianParts": [
          "Прости, наш созвон вчера совсем ",
          " из головы."
        ],
        "russianAnswer": "вылетел",
        "russianWrongs": [
          "упал",
          "вышел",
          "пропал"
        ]
      },
      {
        "parts": [
          "That mistake is ",
          " me, not the team."
        ],
        "hint": "ئەو هەڵەیە لە ئەستۆی منە، نەک تیمەکە.",
        "answer": "on",
        "wrongs": [
          "at",
          "for",
          "by"
        ],
        "arabicHint": "هذاك الغلط صوچي اني، مو صوچ الفريق.",
        "arabicParts": [
          "هذاك الغلط ",
          " اني، مو صوچ الفريق."
        ],
        "arabicAnswer": "صوچي",
        "arabicWrongs": [
          "ذنبي",
          "شغلي",
          "حقي"
        ],
        "russianHint": "Эта ошибка на мне, а не на команде.",
        "russianParts": [
          "Эта ошибка лежит на ",
          " , а не на команде."
        ],
        "russianAnswer": "мне",
        "russianWrongs": [
          "нас",
          "них",
          "вам"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "فایلی هەڵەت ناردووە بۆ تیمەکەت",
        "situationAr": "دزيت الملف الغلط لفريقك",
        "theyAsk": "Hey, this document doesn't look like the right one.",
        "correct": "My bad, I sent the wrong file. I'll email the correct one now.",
        "wrong1": "The file is okay I think.",
        "wrong2": "You open wrong folder.",
        "wrong3": "Not my problem.",
        "explanation": "'My bad' ڕێگەیەکی زۆر ئاسایی و ڕاستەوخۆیە بۆ دانانی هەڵە — وەک 'هەڵەی من بوو'",
        "theyAskAr": "هلو، هذا الملف مبين مو هو الصح.",
        "correctAr": "غلطتي، دزيت الملف الغلط. هسة راح أدز الصح بالإيميل.",
        "wrong1Ar": "الملف زين أعتقد.",
        "wrong2Ar": "أنت فاتح فولدر غلط.",
        "wrong3Ar": "مو مشكلتي.",
        "explanationAr": "'My bad' طريقة عادية ومباشرة تعترف بالغلط — يعني 'غلطتي'",
        "situationRu": "Отправил команде не тот файл",
        "theyAskRu": "Эй, этот документ вроде бы не тот.",
        "correctRu": "Мой косяк, отправил не тот файл. Сейчас вышлю правильный по почте.",
        "wrong1Ru": "Файл вроде нормальный.",
        "wrong2Ru": "Ты открыл не ту папку.",
        "wrong3Ru": "Это не моя проблема.",
        "explanationRu": "'My bad' — популярная разговорная фраза, чтобы быстро и непринужденно признать свою оплошность."
      },
      {
        "situation": "بە هەڵە بە دوای کۆبوونەوەکە هاتووی",
        "situationAr": "وصلت متأخر على الاجتماع بالغلط",
        "theyAsk": "The meeting started twenty minutes ago.",
        "correct": "I totally spaced on that — that one's on me. Can you catch me up?",
        "wrong1": "Meeting is not important.",
        "wrong2": "Why meeting so early?",
        "wrong3": "I don't care about meeting.",
        "explanation": "'Spaced on it' واتای 'تەواو لەبیرم چوو' — لە قسەی ڕۆژانەدا زۆر باوە",
        "theyAskAr": "الاجتماع بده قبل عشرين دقيقة.",
        "correctAr": "نسيت الموضوع بالكامل — صوچي والله. تگدر تحچيلي شصار بسرعة؟",
        "wrong1Ar": "الاجتماع مو مهم.",
        "wrong2Ar": "ليش الاجتماع من وکت؟",
        "wrong3Ar": "ما يهمني الاجتماع.",
        "explanationAr": "'Spaced on it' يعني 'نسيت الموضوع بالكامل' — كلش دارجة بالحچي اليومي",
        "situationRu": "Случайно опоздал на встречу",
        "theyAskRu": "Встреча началась двадцать минут назад.",
        "correctRu": "Совсем вылетело из головы — виноват. Можешь ввести меня в курс дела?",
        "wrong1Ru": "Почему встреча началась так рано?",
        "wrong2Ru": "Я был занят другими делами.",
        "wrong3Ru": "Никто мне не напомнил.",
        "explanationRu": "'Spaced on' означает 'забыл' или 'вылетело из головы', а 'that's on me' — признание вины."
      }
    ],
    "topicRu": "Мой косяк"
  },
  {
    "topic": "Hang On",
    "topicKu": "چاوەڕێ بکە / وەستە",
    "topicAr": "انتظر شوية",
    "words": [
      {
        "english": "Hang on, let me grab my notebook.",
        "kurdish": "چاوەڕێ بکە، با دەفتەری تێبینییەکانم بهێنم.",
        "arabic": "انتظر شوية، خليني أجيب دفتري.",
        "russian": "Погоди секунду, дай я проверю."
      },
      {
        "english": "Give me a sec.",
        "kurdish": "چرکەیەکم پێ بدە.",
        "arabic": "انطيني ثانية.",
        "russian": "Придержи мысль на секунду."
      },
      {
        "english": "Hold up — say that again?",
        "kurdish": "وەستە — دووبارەی بکەرەوە؟",
        "arabic": "اوكف — عيدها مرة ثانية؟",
        "russian": "Дай мне буквально минутку."
      },
      {
        "english": "One second, I'm almost done.",
        "kurdish": "چرکەیەک، نزیکە تەواو بم.",
        "arabic": "ثانية وحدة، راح اخلص.",
        "russian": "Погоди, ты куда идёшь?"
      },
      {
        "english": "Wait, back up a little.",
        "kurdish": "وەستە، کەمێک بگەڕێرەوە دواوە.",
        "arabic": "انتظر، ارجع شوية لورة.",
        "russian": "Потерпите минутку, система тормозит."
      },
      {
        "english": "Bear with me for a minute.",
        "kurdish": "خۆڕاگر بە لەگەڵم بۆ خولەکێک.",
        "arabic": "تحملني دقيقة وحدة.",
        "russian": "Секундочку, я почти закончил."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Hang on, my phone's about to die.",
        "targetKurdish": "چاوەڕێ بکە، مۆبایلەکەم خەریکە کوێر دەبێت.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "انتظر، بطارية تلفوني راح تخلص.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Один момент, пожалуйста, сейчас открою этот файл."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Hold on, someone's at the door.",
        "targetKurdish": "وەستە، کەسێک لە دەرگایە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "لحظة، اكو واحد على الباب.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Погоди, кажется, у тебя выключен микрофон."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Hang tight, I'm pulling up the file.",
        "targetKurdish": "کەمێک ئارام بگرە، فایلەکە دەکەمەوە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "انتظر شوية، دافتح الملف.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Дай две секунды, захвачу ручку."
      }
    ],
    "sentences": [
      {
        "english": [
          "I'll",
          "be",
          "right",
          "with",
          "you"
        ],
        "kurdish": "دەستبەجێ لەگەڵت دەبم.",
        "arabic": "هسة اجيك.",
        "russian": "Извините за ожидание."
      },
      {
        "english": [
          "Let",
          "me",
          "finish",
          "this",
          "email",
          "first"
        ],
        "kurdish": "با سەرەتا ئەم ئیمەیلە تەواو بکەم.",
        "arabic": "خليني اخلص هذا الإيميل أول شي.",
        "russian": "Я сейчас вернусь к вам."
      },
      {
        "english": [
          "Can",
          "you",
          "give",
          "me",
          "two",
          "minutes"
        ],
        "kurdish": "دەتوانیت دوو خولەکم پێ بدەیت؟",
        "arabic": "تكدر تنطيني دقيقتين؟",
        "russian": "Спасибо за ваше терпение."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "",
          " on, I think I left my keys inside."
        ],
        "hint": "وەستە، پێم وایە کلیلەکانم لەناو ماوە.",
        "answer": "Hang",
        "wrongs": [
          "Hung",
          "Hanging",
          "Hangs"
        ],
        "arabicHint": "انتظر، عبالي نسيت مفاتيحي جوة.",
        "arabicParts": [
          "",
          " ، عبالي نسيت مفاتيحي جوة."
        ],
        "arabicAnswer": "انتظر",
        "arabicWrongs": [
          "روح",
          "امشي",
          "اركض"
        ],
        "russianHint": "Погоди секунду, у меня экран завис.",
        "russianParts": [
          "",
          " секунду, у меня экран завис."
        ],
        "russianAnswer": "Погоди",
        "russianWrongs": [
          "Стой",
          "Держи",
          "Жди"
        ]
      },
      {
        "parts": [
          "Bear ",
          " me — the page is still loading."
        ],
        "hint": "خۆڕاگر بە لەگەڵم — لاپەڕەکە هێشتا بار دەبێت.",
        "answer": "with",
        "wrongs": [
          "for",
          "to",
          "on"
        ],
        "arabicHint": "تحملني — الصفحة بعدها تحمل.",
        "arabicParts": [
          "تحملني — الصفحة بعدها ",
          " ."
        ],
        "arabicAnswer": "تحمل",
        "arabicWrongs": [
          "تفتح",
          "تشتغل",
          "تطلع"
        ],
        "russianHint": "Пожалуйста, подождите минутку, пока загружается страница.",
        "russianParts": [
          "Пожалуйста, ",
          " , пока страница загружается."
        ],
        "russianAnswer": "потерпите",
        "russianWrongs": [
          "сидите",
          "ждите",
          "стойте"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لە تەلەفۆندا کەسێک داوای یارمەتی دەکات",
        "situationAr": "واحد يطلب مساعدة على التلفون",
        "theyAsk": "Can you help me find the address right now?",
        "correct": "Hang on, let me grab my notebook. I'll look it up in one minute.",
        "wrong1": "I don't have time now.",
        "wrong2": "Find it yourself.",
        "wrong3": "Address is on internet.",
        "explanation": "'Hang on' واتای 'چرکەیەک چاوەڕێ بکە' — زۆر باوە لە قسەی ڕۆژانە",
        "theyAskAr": "تگدر تساعدني أندل العنوان هسة؟",
        "correctAr": "انتظر شوية، خليني أجيب دفتري. راح أشوفه بدقيقة وحدة.",
        "wrong1Ar": "ما عندي وكت هسة.",
        "wrong2Ar": "دور عليه بنفسك.",
        "wrong3Ar": "العنوان موجود بالإنترنت.",
        "explanationAr": "'Hang on' يعني 'انتظر شوية' — كلش دارجة بالحچي اليومي",
        "situationRu": "Коллега просит цифры прямо во время разговора",
        "theyAskRu": "У тебя готовы показатели продаж?",
        "correctRu": "Погоди секунду, сейчас открою файл. Так, вот они.",
        "wrong1Ru": "Нет, спроси кого-нибудь другого.",
        "wrong2Ru": "Я занят другими делами.",
        "wrong3Ru": "Подожди долго.",
        "explanationRu": "'Hang on a second' — естественный способ попросить собеседника подождать пару секунд."
      },
      {
        "situation": "هاوکارێکت پێشنیارێک دەدات و تۆ گومانت هەیە",
        "situationAr": "زميلك يقترح شي وانت عندك شك",
        "theyAsk": "So we should launch the app this Friday, right?",
        "correct": "Hold up — say that again? I thought we agreed on next week.",
        "wrong1": "Friday is good, yes.",
        "wrong2": "I don't know about app.",
        "wrong3": "Launch whenever you want.",
        "explanation": "'Hold up' لێرە واتای 'وەستە، با بیربکەمەوە' — بۆ گومانکردن یان ڕاستکردنەوە",
        "theyAskAr": "يعني لازم نطلق التطبيق هاي الجمعة، مو صح؟",
        "correctAr": "اوگف — عيدها مرة ثانية؟ عبالي اتفقنا على الأسبوع الجاي.",
        "wrong1Ar": "الجمعة يوم زين، إي.",
        "wrong2Ar": "ما أعرف شي عن التطبيق.",
        "wrong3Ar": "أطلقوه شوکت ما تريدون.",
        "explanationAr": "'Hold up' هنا يعني 'اوكف، خليني أفكر' — للتشكيك أو التصحيح",
        "situationRu": "Друг хочет рассказать новость, а ты отвлёкся",
        "theyAskRu": "Ты слышал, что случилось на общем собрании?",
        "correctRu": "Придержи мысль на секунду — выключу микрофон. Всё, рассказывай!",
        "wrong1Ru": "Не говори мне ничего.",
        "wrong2Ru": "Мне не интересно.",
        "wrong3Ru": "Говори быстрее.",
        "explanationRu": "'Hold that thought' говорят, когда нужно прерваться на миг, но вы хотите дослушать мысль."
      }
    ],
    "topicRu": "Минуточку"
  },
  {
    "topic": "That Makes Sense",
    "topicKu": "ئەوە لۆژیکییە / تێگەیشتم",
    "topicAr": "هذا منطقي",
    "words": [
      {
        "english": "Oh, that makes sense now.",
        "kurdish": "ئاهـ، ئێستا تێگەیشتم.",
        "arabic": "آه، هسة صار منطقي.",
        "russian": "Мне это кажется абсолютно логичным."
      },
      {
        "english": "Gotcha, that clears it up.",
        "kurdish": "تێگەیشتم، ئەوە ڕوونی کردەوە.",
        "arabic": "فهمت، هسة وضحت.",
        "russian": "А, дошло — теперь понимаю."
      },
      {
        "english": "Ah, okay — I follow you.",
        "kurdish": "ئاهـ، باشە — شوێنت کەوتم.",
        "arabic": "آه، أوكي — افتهمت عليك هسة.",
        "russian": "Да, всё сходится."
      },
      {
        "english": "That tracks, actually.",
        "kurdish": "بەڕاستی ئەوە لۆژیکییە.",
        "arabic": "هذا منطقي والله.",
        "russian": "Теперь я понимаю, что ты имеешь в виду."
      },
      {
        "english": "Right, I see what you mean.",
        "kurdish": "بەڵێ، دەبینم مەبەستت چییە.",
        "arabic": "صح، افتهمت شنو تقصد.",
        "russian": "Справедливо, я об этом не подумал."
      },
      {
        "english": "Okay, now I get it.",
        "kurdish": "باشە، ئێستا تێگەیشتم.",
        "arabic": "أوكي، هسة افتهمت.",
        "russian": "Теперь всё встало на свои места, спасибо."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "That makes sense given the deadline.",
        "targetKurdish": "بە لەبەرچاوگرتنی مۆڵەتەکە، ئەمە لۆژیکییە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "هذا منطقي بالنظر للموعد الأخير.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Понятно, это всё проясняет."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Wait, say more — I almost get it.",
        "targetKurdish": "وەستە، زیاتر بڵێ — نزیکم لە تێگەیشتن.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "انتظر، احچي أكثر — قريب افتهم.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Теперь я улавливаю твою мысль."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Yeah, no, I'm with you.",
        "targetKurdish": "بەڵێ، تێگەیشتم، لەگەڵتم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "إي، افتهمت، وياك.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Точно, это объясняет задержку."
      }
    ],
    "sentences": [
      {
        "english": [
          "Thanks",
          "for",
          "walking",
          "me",
          "through",
          "it"
        ],
        "kurdish": "سوپاس کە هەنگاو بە هەنگاو ڕوونت کردمەوە.",
        "arabic": "شكراً شرحتلي خطوة بخطوة.",
        "russian": "Спасибо, что объяснил это."
      },
      {
        "english": [
          "That",
          "explains",
          "a",
          "lot"
        ],
        "kurdish": "ئەوە زۆر شت ڕوون دەکاتەوە.",
        "arabic": "هذا يفسر هواية أشياء.",
        "russian": "До этого я был немного в замешательстве."
      },
      {
        "english": [
          "I",
          "was",
          "confused",
          "until",
          "just",
          "now"
        ],
        "kurdish": "تا ئێستا سەرم لێ شێوابوو.",
        "arabic": "چنت دايخ لحد هسة.",
        "russian": "Теперь мы на одной волне."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Oh, that ",
          " sense now that you explain it."
        ],
        "hint": "ئاهـ، ئێستا کە ڕوونت کردەوە لۆژیکییە.",
        "answer": "makes",
        "wrongs": [
          "make",
          "making",
          "made"
        ],
        "arabicHint": "آه، هسة صار منطقي بعد ما شرحته.",
        "arabicParts": [
          "آه، هسة صار ",
          " بعد ما شرحته."
        ],
        "arabicAnswer": "منطقي",
        "arabicWrongs": [
          "واضح",
          "سهل",
          "صحيح"
        ],
        "russianHint": "Это обретает полный смысл теперь, когда ты объяснил.",
        "russianParts": [
          "Теперь это звучит абсолютно ",
          " , раз ты объяснил."
        ],
        "russianAnswer": "логично",
        "russianWrongs": [
          "верно",
          "умно",
          "быстро"
        ]
      },
      {
        "parts": [
          "Gotcha — that ",
          " it up for me."
        ],
        "hint": "تێگەیشتم — ئەوە بۆ من ڕوونی کردەوە.",
        "answer": "clears",
        "wrongs": [
          "clear",
          "clearing",
          "cleared"
        ],
        "arabicHint": "فهمت — هذا وضحلي الموضوع.",
        "arabicParts": [
          "فهمت — هذا ",
          " الموضوع."
        ],
        "arabicAnswer": "وضحلي",
        "arabicWrongs": [
          "سهلي",
          "بينلي",
          "شرحلي"
        ],
        "russianHint": "А, понял! Я не знал, что это изменилось.",
        "russianParts": [
          "А, ",
          " ! Я и не знал, что это поменялось."
        ],
        "russianAnswer": "понял",
        "russianWrongs": [
          "знал",
          "видел",
          "слышал"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "مامۆستایەک ڕوونی دەکاتەوە بۆچی تاقیکردنەوە دواخست",
        "situationAr": "الأستاذ يوضح ليش تأجل الامتحان",
        "theyAsk": "We moved the test because half the class was sick.",
        "correct": "Oh, that makes sense now. Thanks for explaining.",
        "wrong1": "I don't like new date.",
        "wrong2": "Test should be today.",
        "wrong3": "Why sick people matter?",
        "explanation": "'That makes sense' دەڵێت کە تێگەیشتووی — واتای 'ئەوە لۆژیکی هەیە'",
        "theyAskAr": "أجلنا الامتحان لأن نص الطلاب چانوا مريضين.",
        "correctAr": "آه، هسة صار منطقي. شكراً لأن وضحت.",
        "wrong1Ar": "ما يعجبني الموعد الجديد.",
        "wrong2Ar": "لازم الامتحان چان اليوم.",
        "wrong3Ar": "شعليه بالطلاب المريضين؟",
        "explanationAr": "'That makes sense' يعني إنك افتهمت — بمعنى 'هذا منطقي'",
        "situationRu": "Менеджер объясняет изменение срока сдачи",
        "theyAskRu": "Мы перенесли дедлайн на пятницу, потому что клиент попросил дополнительные правки.",
        "correctRu": "Это абсолютно логично. Спасибо, что предупредил — мы готовы продолжать.",
        "wrong1Ru": "Почему вы это сделали?",
        "wrong2Ru": "Я не согласен с этим.",
        "wrong3Ru": "Это плохое решение.",
        "explanationRu": "'That makes sense' — лучший способ показать собеседнику, что вы поняли и приняли его логику."
      },
      {
        "situation": "هاوڕێیەکت دەڵێت بۆچی نەچووە بۆ ئاهەنگ",
        "situationAr": "صديقك يكلك ليش ما راح للحفلة",
        "theyAsk": "I skipped the party because I had to work early tomorrow.",
        "correct": "That tracks, actually. I would've done the exact same thing.",
        "wrong1": "Party was fun you missed.",
        "wrong2": "Work is not important.",
        "wrong3": "You always skip parties.",
        "explanation": "'That tracks' زاراوەیەکی نوێ و زۆر باوی ئەمریکییە بە واتای 'ئەوە لۆژیکییە'",
        "theyAskAr": "ما رحت للحفلة لأن چان لازم أگعد من الصبح للشغل باچر.",
        "correctAr": "هذا منطقي والله. چنت سويت نفس الشي بالضبط.",
        "wrong1Ar": "الحفلة چانت حلوة وفاتتك.",
        "wrong2Ar": "الشغل مو مهم.",
        "wrong3Ar": "أنت دائماً ما تروح للحفلات.",
        "explanationAr": "'That tracks' تعبير أمريكي جديد وكلش دارج بمعنى 'هذا منطقي'",
        "situationRu": "Разработчик объясняет причину бага",
        "theyAskRu": "Кнопка не работала, потому что пользователь не вошёл в аккаунт.",
        "correctRu": "А, понял — это всё проясняет. Я добавлю туда сообщение об ошибке.",
        "wrong1Ru": "Кнопка должна всегда работать.",
        "wrong2Ru": "Это странно очень.",
        "wrong3Ru": "Я не понял ничего.",
        "explanationRu": "'Gotcha' (от 'got you') — популярное неформальное выражение, означающее 'понял тебя'."
      }
    ],
    "topicRu": "Логично"
  },
  {
    "topic": "Sounds Good",
    "topicKu": "باشە / ڕازیم",
    "topicAr": "خوش فكرة",
    "words": [
      {
        "english": "Sounds good — let's meet at six.",
        "kurdish": "باشە — با لە شەشدا یەکتر ببینین.",
        "arabic": "خوش فكرة — خلينا نلتقي بـ الستة.",
        "russian": "Отличная идея, давай так и сделаем."
      },
      {
        "english": "Works for me.",
        "kurdish": "بۆ من گونجاوە.",
        "arabic": "هذا يناسبني.",
        "russian": "Мне подходит — до встречи."
      },
      {
        "english": "Bet, I'll see you there.",
        "kurdish": "باشە، لەوێ دەتبینم.",
        "arabic": "اتفقنا، اشوفك هناك.",
        "russian": "Я за любой вариант, как хочешь."
      },
      {
        "english": "I'm down for that.",
        "kurdish": "من ڕازیم بەوە.",
        "arabic": "اني موافق على هذا.",
        "russian": "Я в деле, звучит здорово."
      },
      {
        "english": "Yeah, let's do it.",
        "kurdish": "بەڵێ، با بیکەین.",
        "arabic": "إي، خلينا نسويها.",
        "russian": "Отличный план, идеально подходит."
      },
      {
        "english": "Perfect, that'll work.",
        "kurdish": "نایاب، ئەوە دەگونجێت.",
        "arabic": "ممتاز، هذا راح يشتغل.",
        "russian": "По рукам — давай так и утвердим."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Sounds good, I'll bring the drinks.",
        "targetKurdish": "باشە، من خواردنەوەکان دەهێنم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "خوش فكرة، راح اجيب المشروبات.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "По рукам, так и поступим."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "That works on my end.",
        "targetKurdish": "لە لای منەوە گونجاوە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "هذا مناسب من طرفي.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Я обеими руками за эту идею."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Count me in.",
        "targetKurdish": "منیش لەگەڵتان دام.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "احسبني وياكم.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Отлично, это идеально вписывается в моё расписание."
      }
    ],
    "sentences": [
      {
        "english": [
          "Just",
          "text",
          "me",
          "when",
          "you",
          "head",
          "out"
        ],
        "kurdish": "تەنها کاتێک بەڕێ دەکەویت نامەم بۆ بنێرە.",
        "arabic": "بس دزلي رسالة من تطلع.",
        "russian": "Я внесу это в свой календарь."
      },
      {
        "english": [
          "I'll",
          "grab",
          "us",
          "a",
          "table"
        ],
        "kurdish": "مێزێکمان بۆ دەگرم.",
        "arabic": "راح احجز النا ميز.",
        "russian": "Скинь мне адрес сообщением позже."
      },
      {
        "english": [
          "See",
          "you",
          "around",
          "seven",
          "then"
        ],
        "kurdish": "کەواتە نزیکەی حەوت دەتبینم.",
        "arabic": "اشوفك حوالي السبعة لعد.",
        "russian": "С нетерпением жду нашей встречи."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "That ",
          " good to me — let's lock it in."
        ],
        "hint": "ئەوە بۆ من باشە — با یەکلایی بکەینەوە.",
        "answer": "sounds",
        "wrongs": [
          "sound",
          "sounding",
          "sounded"
        ],
        "arabicHint": "هذا يبين خوش شي — خلينا نثبت الموعد.",
        "arabicParts": [
          "هذا يبين ",
          " شي — خلينا نثبت الموعد."
        ],
        "arabicAnswer": "خوش",
        "arabicWrongs": [
          "زين",
          "حلو",
          "عادي"
        ],
        "russianHint": "Мне подходит — увидимся в два.",
        "russianParts": [
          "Мне ",
          " — увидимся в два."
        ],
        "russianAnswer": "подходит",
        "russianWrongs": [
          "удобно",
          "нравится",
          "годится"
        ]
      },
      {
        "parts": [
          "Saturday ",
          " better for my schedule."
        ],
        "hint": "شەممە باشتر لەگەڵ خشتەکەم دەگونجێت.",
        "answer": "works",
        "wrongs": [
          "work",
          "working",
          "worked"
        ],
        "arabicHint": "السبت يناسب جدولي أكثر.",
        "arabicParts": [
          "السبت ",
          " جدولي أكثر."
        ],
        "arabicAnswer": "يناسب",
        "arabicWrongs": [
          "يرهم",
          "يوالم",
          "يطابق"
        ],
        "russianHint": "Я в деле, обожаю этот ресторан.",
        "russianParts": [
          "Я в ",
          " , обожаю этот ресторан."
        ],
        "russianAnswer": "деле",
        "russianWrongs": [
          "доле",
          "курсе",
          "теме"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "هاوڕێیەک پلانی کۆبوونەوە پێشنیار دەکات",
        "situationAr": "صديق يقترح خطة للقاء",
        "theyAsk": "How about we grab coffee after work around five?",
        "correct": "Sounds good — let's meet at the café near the office.",
        "wrong1": "I don't like coffee.",
        "wrong2": "Five is bad time.",
        "wrong3": "Maybe another day I think.",
        "explanation": "'Sounds good' ڕێگەیەکی سادەیە بۆ ڕازیبوون — واتای 'باشە، قبوڵە'",
        "theyAskAr": "شرايك نشرب قهوة ورا الدوام بحدود الساعة خمسة؟",
        "correctAr": "خوش فكرة — خلينا نلتقي بالكافيه اللي قريب من الشغل.",
        "wrong1Ar": "ما أحب القهوة.",
        "wrong2Ar": "الخمسة وكت مو زين.",
        "wrong3Ar": "يمكن بغير يوم أعتقد.",
        "explanationAr": "'Sounds good' طريقة بسيطة للموافقة — بمعنى 'ماشي، موافق'",
        "situationRu": "Друг предлагает встретиться за кофе",
        "theyAskRu": "Как насчёт выпить кофе завтра утром около десяти?",
        "correctRu": "Отличная мысль, давай. Мне как раз подходит по времени.",
        "wrong1Ru": "Кофе это нормально.",
        "wrong2Ru": "Я должен подумать.",
        "wrong3Ru": "Может быть когда-нибудь.",
        "explanationRu": "'Sounds good' — самый частый и естественный способ согласиться на предложение."
      },
      {
        "situation": "هاوکارێک پلانی پڕۆژە ڕوون دەکاتەوە",
        "situationAr": "زميل يشرح خطة المشروع",
        "theyAsk": "We'll draft the report today and review it together tomorrow morning.",
        "correct": "Works for me — count me in. I'll start the draft after lunch.",
        "wrong1": "I don't want draft.",
        "wrong2": "Tomorrow is too late.",
        "wrong3": "You do everything alone.",
        "explanation": "'Count me in' دەڵێت کە بە توندی بەشداری دەکەیت",
        "theyAskAr": "راح نكتب مسودة التقرير اليوم ونراجعه سوية باچر الصبح.",
        "correctAr": "يناسبني — احسبني وياكم. راح أبدي بالمسودة ورا الغدا.",
        "wrong1Ar": "ما أريد أسوي مسودة.",
        "wrong2Ar": "باچر كلش متأخر.",
        "wrong3Ar": "سووا كلشي وحدكم.",
        "explanationAr": "'Count me in' تعني إنك موافق بشدة وراح تشارك",
        "situationRu": "Коллеги зовут на концерт",
        "theyAskRu": "Мы тут собираемся на концерт в пятницу — пойдёшь с нами?",
        "correctRu": "Я в деле, звучит здорово! Скинь мне подробности позже.",
        "wrong1Ru": "Я не знаю вас хорошо.",
        "wrong2Ru": "Концерты слишком громкие.",
        "wrong3Ru": "Билеты дорогие наверное.",
        "explanationRu": "'Count me in' означает 'запишите меня' или 'я в деле'."
      }
    ],
    "topicRu": "Договорились"
  },
  {
    "topic": "Fair Enough",
    "topicKu": "قبوڵە / ڕاست دەکەیت",
    "topicAr": "حچيك منطقي",
    "words": [
      {
        "english": "Fair enough — I see your point.",
        "kurdish": "قبوڵە — لە مەبەستەکەت تێگەیشتم.",
        "arabic": "حچيك منطقي — افتهمت وجهة نظرك.",
        "russian": "Справедливо, тут ты прав."
      },
      {
        "english": "Yeah, that's fair.",
        "kurdish": "بەڵێ، ئەوە دادپەروەرانەیە.",
        "arabic": "إي، هذا عادل.",
        "russian": "Это совершенно справедливо."
      },
      {
        "english": "Okay, I'll give you that.",
        "kurdish": "باشە، ئەوەت بۆ دان دەنێم.",
        "arabic": "أوكي، راح اعترفلك بهاي.",
        "russian": "С таким компромиссом я согласен."
      },
      {
        "english": "Honestly, I can't argue with that.",
        "kurdish": "بەڕاستی ناتوانم دژایەتی ئەوە بکەم.",
        "arabic": "بصراحة، ما اكدر اجادل بهذا.",
        "russian": "Замечание принято, я подстроюсь."
      },
      {
        "english": "Alright, you've got a point.",
        "kurdish": "باشە، خاڵێکی دروستت هەیە.",
        "arabic": "أوكي، عندك وجهة نظر.",
        "russian": "С такой логикой не поспоришь."
      },
      {
        "english": "I hadn't looked at it that way.",
        "kurdish": "بەو شێوەیە سەیرم نەکردبوو.",
        "arabic": "ما باوعت للموضوع من هاي الزاوية.",
        "russian": "Справедливое решение — давай выберем твой вариант."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Fair enough, let's try it your way.",
        "targetKurdish": "قبوڵە، با بە ڕێگەی تۆ تاقیی بکەینەوە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "حچيك منطقي، خلينا نجرب طريقتك.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Веский довод, я понимаю твою точку зрения."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Okay, you win this one.",
        "targetKurdish": "باشە، ئەم جارە تۆ بردتەوە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "أوكي، انت فزت بهالمرة.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Я понимаю, почему ты так считаешь."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "That's a fair ask.",
        "targetKurdish": "ئەوە داواکارییەکی ڕەوایە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "هذا طلب معقول.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Это вполне разумная просьба."
      }
    ],
    "sentences": [
      {
        "english": [
          "I",
          "still",
          "think",
          "mine",
          "is",
          "faster"
        ],
        "kurdish": "هێشتا پێم وایە هی من خێراترە.",
        "arabic": "بعدني اعتقد طريقتي أسرع.",
        "russian": "Давай сойдёмся посередине."
      },
      {
        "english": [
          "Let's",
          "meet",
          "in",
          "the",
          "middle"
        ],
        "kurdish": "با لە ناوەڕاستدا ڕێک بکەوین.",
        "arabic": "خلينا نلتقي بنص الطريق.",
        "russian": "Можем сначала попробовать по-твоему."
      },
      {
        "english": [
          "We",
          "can",
          "revisit",
          "it",
          "next",
          "week"
        ],
        "kurdish": "دەتوانین هەفتەی داهاتوو بگەڕێینەوە بۆی.",
        "arabic": "نكدر نرجعله السبوع الجاي.",
        "russian": "Ценю твою честность."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "",
          " enough — I hadn't thought of that."
        ],
        "hint": "قبوڵە — بیرم لەوە نەکردبووەوە.",
        "answer": "Fair",
        "wrongs": [
          "Fairly",
          "Fairness",
          "Fairest"
        ],
        "arabicHint": "حچيك منطقي — ما فكرت بيها.",
        "arabicParts": [
          "حچيك ",
          " — ما فكرت بيها."
        ],
        "arabicAnswer": "منطقي",
        "arabicWrongs": [
          "صحيح",
          "واضح",
          "معقول"
        ],
        "russianHint": "Справедливо, ты работал над этим дольше меня.",
        "russianParts": [
          "",
          " , ты работал над этим дольше меня."
        ],
        "russianAnswer": "Справедливо",
        "russianWrongs": [
          "Честно",
          "Правильно",
          "Точно"
        ]
      },
      {
        "parts": [
          "Honestly, I can't ",
          " with that logic."
        ],
        "hint": "بەڕاستی ناتوانم دژی ئەو لۆژیکە بوەستم.",
        "answer": "argue",
        "wrongs": [
          "argued",
          "arguing",
          "argument"
        ],
        "arabicHint": "بصراحة، ما اكدر اجادل بهذا المنطق.",
        "arabicParts": [
          "بصراحة، ما أگدر ",
          " بهذا المنطق."
        ],
        "arabicAnswer": "أجادل",
        "arabicWrongs": [
          "أعترض",
          "أناقش",
          "أحچي"
        ],
        "russianHint": "С этим не поспоришь — цифры не врут.",
        "russianParts": [
          "Не ",
          " с этим — цифры не врут."
        ],
        "russianAnswer": "поспоришь",
        "russianWrongs": [
          "согласишься",
          "сравнишь",
          "скажешь"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "گفتوگۆیەک دەربارەی کێ پێشتر دەچێتە ماڵ",
        "situationAr": "نقاش حول من يروح للبيت أول",
        "theyAsk": "I worked late three nights this week, so I should leave early today.",
        "correct": "Fair enough — I see your point. I'll cover the afternoon shift.",
        "wrong1": "No, you stay late too.",
        "wrong2": "That is not fair.",
        "wrong3": "I don't care about your work.",
        "explanation": "'Fair enough' واتای 'قبوڵە، دادپەروەرانەیە' — کاتێک ڕازی دەبیت بە بیرۆکەی کەسێک",
        "theyAskAr": "اشتغلت لوكت متأخر تلاث ليالي هالأسبوع، فلازم أطلع من وكت اليوم.",
        "correctAr": "حچيك منطقي — افتهمت قصدك. أني راح أغطي شفت العصر.",
        "wrong1Ar": "لا، ابقى متأخر أنت همين.",
        "wrong2Ar": "هذا مو عدل.",
        "wrong3Ar": "ما يهمني شغلك.",
        "explanationAr": "'Fair enough' تعني 'مقبول، هذا عادل' — من توافق على فكرة شخص",
        "situationRu": "Коллега предлагает перенести запуск ради тестов",
        "theyAskRu": "Я бы предпочёл запуститься на следующей неделе, чтобы осталось время на тестирование.",
        "correctRu": "Справедливо, в твоих словах есть смысл. С такой логикой не поспоришь.",
        "wrong1Ru": "Нет, запускаем сейчас.",
        "wrong2Ru": "Тестирование не нужно.",
        "wrong3Ru": "Ты слишком медленный.",
        "explanationRu": "'Fair enough' означает признание правоты собеседника при обсуждении."
      },
      {
        "situation": "هاوڕێیەک ڕوونی دەکاتەوە بۆچی فیلمێکی جیاواز هەڵبژارد",
        "situationAr": "صديق يوضح ليش اختار فيلم مختلف",
        "theyAsk": "I picked the comedy because you've chosen the last three movies.",
        "correct": "Okay, I'll give you that — I hadn't looked at it that way. Let's watch your pick.",
        "wrong1": "I always choose movies.",
        "wrong2": "Comedy is boring.",
        "wrong3": "We watch nothing tonight.",
        "explanation": "'I'll give you that' واتای 'ئەو خاڵەت بۆ دان دەنێم' — دانپێدانانێکی ئاسایی",
        "theyAskAr": "اختارت الفيلم الكوميدي لأن أنت اختاريت آخر تلاث أفلام.",
        "correctAr": "أوكي، أسلملك بهالنقطة — ما باوعت للموضوع من هالعين. خلينا نشوف اختيارك.",
        "wrong1Ar": "أني دائماً أختار الأفلام.",
        "wrong2Ar": "الكوميديا مملة.",
        "wrong3Ar": "ما راح نباوع أي شي الليلة.",
        "explanationAr": "'I'll give you that' تعني 'اسلملك بهاي النقطة' — اعتراف عفوي",
        "situationRu": "Разделение счета в кафе",
        "theyAskRu": "Можем поделить счёт поровну, чтобы не высчитывать каждое блюдо?",
        "correctRu": "Это вполне справедливо — мне подходит. Спасибо, что без лишних сложностей.",
        "wrong1Ru": "Я съел меньше тебя.",
        "wrong2Ru": "Считай каждое блюдо.",
        "wrong3Ru": "Это нечестно.",
        "explanationRu": "'Completely fair' — естественный способ согласиться с разумным предложением."
      }
    ],
    "topicRu": "Справедливо"
  },
  {
    "topic": "Long Story Short",
    "topicKu": "کورت بڵێم",
    "topicAr": "بالمختصر",
    "words": [
      {
        "english": "Long story short, we missed the flight.",
        "kurdish": "کورت بڵێم، فڕۆکەکەمان لەدەستدا.",
        "arabic": "بالمختصر، فاتتنة الطيارة.",
        "russian": "Короче говоря, мы опоздали на рейс."
      },
      {
        "english": "To cut to the chase, she said yes.",
        "kurdish": "بۆ ئەوەی ڕاستەوخۆ بڵێم، ئەو ڕازی بوو.",
        "arabic": "حتى ادخل بصلب الموضوع، هي وافقت.",
        "russian": "Если в двух словах, всё сработало."
      },
      {
        "english": "Anyway, we're moving in June.",
        "kurdish": "بەهەرحاڵ، لە حوزەیراندا دەگوازرێینەوە.",
        "arabic": "على العموم، راح نعزل بشهر السادس.",
        "russian": "Суть в том, что нам нужно больше бюджета."
      },
      {
        "english": "Bottom line, it all worked out.",
        "kurdish": "کۆتا قسە، هەموو شتێک باش بوو.",
        "arabic": "الزبدة، كلشي مشى تمام.",
        "russian": "В конечном счёте, выбор за тобой."
      },
      {
        "english": "Basically, the deal fell through.",
        "kurdish": "بەکورتی، ڕێککەوتنەکە شکستی هێنا.",
        "arabic": "مختصر الحچي، الصفقة خربت.",
        "russian": "Короче говоря, всё обошлось благополучно."
      },
      {
        "english": "In a nutshell, we're starting over.",
        "kurdish": "بەکورتی، لە سەرەتاوە دەستپێدەکەینەوە.",
        "arabic": "بكلمة وحدة، راح نبدي من جديد.",
        "russian": "Вкратце: мы подписали сделку."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Long story short, I didn't see that coming.",
        "targetKurdish": "کورت بڵێم، ئەمەم چاوەڕوان نەکردبوو.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "بالمختصر، ما توقعت هذا الشي.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "По сути, нам пришлось начать всё сначала."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I'll spare you the details.",
        "targetKurdish": "وردەکارییەکانت پێ ناڵێم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "راح اعفيك من التفاصيل.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Главный вывод — нам нужно лучше коммуницировать."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "So here's the short version.",
        "targetKurdish": "کەواتە ئەمە وەشانە کورتەکەیە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "لعد هاي النسخة المختصرة.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "В общем и целом, неделя выдалась продуктивной."
      }
    ],
    "sentences": [
      {
        "english": [
          "It's",
          "a",
          "long",
          "story,",
          "honestly"
        ],
        "kurdish": "بەڕاستی چیرۆکێکی درێژە.",
        "arabic": "قصة طويلة، بصراحة.",
        "russian": "Не буду утомлять тебя подробностями."
      },
      {
        "english": [
          "I'll",
          "fill",
          "you",
          "in",
          "later"
        ],
        "kurdish": "دواتر ئاگادارت دەکەمەوە.",
        "arabic": "راح احچيلك التفاصيل بعدين.",
        "russian": "Вот краткая версия."
      },
      {
        "english": [
          "You",
          "kind",
          "of",
          "had",
          "to",
          "be",
          "there"
        ],
        "kurdish": "دەبوایە خۆت لەوێ بوایتایە.",
        "arabic": "چان لازم تكون هناك حتى تفتهم.",
        "russian": "В этом вся суть."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Long story ",
          " , we're back to square one."
        ],
        "hint": "کورت بڵێم، گەڕاینەوە بۆ خاڵی سفر.",
        "answer": "short",
        "wrongs": [
          "shortly",
          "shorter",
          "shortest"
        ],
        "arabicHint": "بالمختصر، رجعنا لنقطة البداية.",
        "arabicParts": [
          "",
          " ، رجعنا لنقطة البداية."
        ],
        "arabicAnswer": "بالمختصر",
        "arabicWrongs": [
          "بالطول",
          "بالتفصيل",
          "بالنهاية"
        ],
        "russianHint": "Короче говоря, в итоге мы поехали на поезде.",
        "russianParts": [
          "Короче ",
          " , в итоге мы поехали на поезде."
        ],
        "russianAnswer": "говоря",
        "russianWrongs": [
          "сказанное",
          "думая",
          "глядя"
        ]
      },
      {
        "parts": [
          "In a ",
          " , the whole trip was a disaster."
        ],
        "hint": "بەکورتی، هەموو گەشتەکە کارەسات بوو.",
        "answer": "nutshell",
        "wrongs": [
          "nutshells",
          "shell",
          "nut"
        ],
        "arabicHint": "مختصر الحچي، السفرة كلها چانت كارثة.",
        "arabicParts": [
          "مختصر الحچي، السفرة كلها چانت ",
          " ."
        ],
        "arabicAnswer": "كارثة",
        "arabicWrongs": [
          "حلوة",
          "طويلة",
          "تخبل"
        ],
        "russianHint": "В конечном счете, важен только результат.",
        "russianParts": [
          "В конечном ",
          " важен только результат."
        ],
        "russianAnswer": "счёте",
        "russianWrongs": [
          "итоге",
          "дне",
          "пути"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "هاوڕێیەکت دەپرسێت چۆن گەشتەکەت بوو",
        "situationAr": "صديقك يسألك شلون چانت سفرتك",
        "theyAsk": "So what happened on your trip? You look exhausted.",
        "correct": "Long story short, we missed the flight and had to stay an extra night. But it all worked out.",
        "wrong1": "Trip was bad and good.",
        "wrong2": "Many things happened.",
        "wrong3": "I don't want talk about trip.",
        "explanation": "'Long story short' بۆ کورتکردنەوەی چیرۆکێکی درێژە — 'کورت بڵێم'",
        "theyAskAr": "شصار بسفرتك؟ مبين عليك كلش تعبان.",
        "correctAr": "بالمختصر، فاتتنة الطيارة وبقينا ليلة إضافية. بس الحمد لله كلشي انحل.",
        "wrong1Ar": "السفرة چانت زينة ومو زينة.",
        "wrong2Ar": "صارت هواية أشياء.",
        "wrong3Ar": "ما أريد أحچي عن السفرة.",
        "explanationAr": "'Long story short' لاختصار قصة طويلة — بمعنى 'بالمختصر'",
        "situationRu": "Коллега спрашивает, как прошла долгая встреча",
        "theyAskRu": "Что там было на утренней встрече с клиентом?",
        "correctRu": "Короче говоря, мы подписали сделку. Если кратко — они были в восторге.",
        "wrong1Ru": "Встреча длилась три часа.",
        "wrong2Ru": "Они задавали много вопросов.",
        "wrong3Ru": "Мы пили кофе долго.",
        "explanationRu": "'Long story short' используется, чтобы сразу перейти к главному итогу длинной истории."
      },
      {
        "situation": "لە کۆبوونەوەی کاردا پرسیارت لێ دەکرێت دەربارەی کڕیارێک",
        "situationAr": "باجتماع الشغل يسألون عن واحد من العملاء",
        "theyAsk": "Can you update us on the client situation?",
        "correct": "To cut to the chase, she took another offer, so we're starting over with her replacement.",
        "wrong1": "Client is difficult person.",
        "wrong2": "Many emails were sent.",
        "wrong3": "Project is late because problems.",
        "explanation": "'Cut to the chase' واتای 'ڕاستەوخۆ بچۆ سەر بابەتەکە' — لە کاردا زۆر باوە",
        "theyAskAr": "تگدر تنطينا آخر تحديث عن موضوع العميل؟",
        "correctAr": "حتى أدخل بصلب الموضوع، راحت لعرض ثاني، فراح نبدي من جديد ويه بديلتها.",
        "wrong1Ar": "العميلة شخص صعب.",
        "wrong2Ar": "دزينا هواية إيميلات.",
        "wrong3Ar": "المشروع متأخر بسبب المشاكل.",
        "explanationAr": "'Cut to the chase' تعني 'ادخل بصلب الموضوع كبل' — دارجة كلش بالشغل",
        "situationRu": "Друг спрашивает, почему ты купил новый телефон",
        "theyAskRu": "А почему ты сменил телефон?",
        "correctRu": "Короче говоря, я уронил старый в воду. Он больше не включился.",
        "wrong1Ru": "Потому что телефоны новые выходят.",
        "wrong2Ru": "Старый телефон был в кармане.",
        "wrong3Ru": "Я пошёл в магазин вчера.",
        "explanationRu": "'Long story short' позволяет быстро объяснить причину без лишних предисловий."
      }
    ],
    "topicRu": "Короче говоря"
  },
  {
    "topic": "Take Your Time",
    "topicKu": "پەلە مەکە",
    "topicAr": "اخذ راحتك",
    "words": [
      {
        "english": "Take your time — there's no rush.",
        "kurdish": "کاتی خۆت وەربگرە — پەلە نییە.",
        "arabic": "اخذ راحتك — ماكو استعجال.",
        "russian": "Не торопись, спешить совершенно некуда."
      },
      {
        "english": "Whenever you're ready.",
        "kurdish": "هەر کاتێک ئامادە بوویت.",
        "arabic": "شوكت ما تكون جاهز.",
        "russian": "Не к спеху, как только будешь готов."
      },
      {
        "english": "No pressure at all.",
        "kurdish": "هیچ فشارێک نییە.",
        "arabic": "ماكو أي ضغط أصلاً.",
        "russian": "Удели этому столько времени, сколько потребуется."
      },
      {
        "english": "We're not in a hurry.",
        "kurdish": "ئێمە پەلەمان نییە.",
        "arabic": "احنة مو مستعجلين.",
        "russian": "Когда у тебя дойдут до этого руки."
      },
      {
        "english": "Take as long as you need.",
        "kurdish": "هەرچەندە پێویستتە کات وەربگرە.",
        "arabic": "اخذ الوقت اللي تحتاجه.",
        "russian": "Никакого давления, не спеши."
      },
      {
        "english": "Don't feel rushed on my account.",
        "kurdish": "لەبەر من هەست بە پەلە مەکە.",
        "arabic": "لا تستعجل بسببي.",
        "russian": "В своём темпе, без лишнего стресса."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Take your time with the form — it's long.",
        "targetKurdish": "لەگەڵ فۆڕمەکە پەلە مەکە — درێژە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "اخذ راحتك وية الفورمة — تراها طويلة.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Не спеша ознакомься с этим документом."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Seriously, no rush on my end.",
        "targetKurdish": "بەڕاستی، لە لای من پەلە نییە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "من صدگ، ماكو استعجال من جهتي.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Никакой спешки — сначала спокойно пообедай."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I'll wait right here.",
        "targetKurdish": "هەر لێرە چاوەڕێ دەکەم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "راح انتظر هنا بالضبط.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Когда тебе удобно, тогда и ладно."
      }
    ],
    "sentences": [
      {
        "english": [
          "Just",
          "let",
          "me",
          "know",
          "when",
          "you",
          "decide"
        ],
        "kurdish": "تەنها کاتێک بڕیارت دا پێم بڵێ.",
        "arabic": "بس كلي من تقرر.",
        "russian": "Я сегодня совершенно никуда не спешу."
      },
      {
        "english": [
          "There's",
          "no",
          "deadline",
          "on",
          "this"
        ],
        "kurdish": "هیچ مۆڵەتێکی کۆتایی بۆ ئەمە نییە.",
        "arabic": "ماكو موعد نهائي لهذا.",
        "russian": "Завези это, как только освободишься."
      },
      {
        "english": [
          "Sleep",
          "on",
          "it",
          "if",
          "you",
          "want"
        ],
        "kurdish": "ئەگەر دەتەوێت شەوێک بیری لێ بکەرەوە.",
        "arabic": "فكر بيها لباجر إذا تريد.",
        "russian": "Здесь нет жёсткого дедлайна."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Take your ",
          " — I'm not going anywhere."
        ],
        "hint": "کاتی خۆت وەربگرە — بۆ هیچ شوێنێک ناڕۆم.",
        "answer": "time",
        "wrongs": [
          "times",
          "timing",
          "timed"
        ],
        "arabicHint": "اخذ راحتك — اني ما راح اروح لأي مكان.",
        "arabicParts": [
          "اخذ ",
          " — اني ما راح اروح لأي مكان."
        ],
        "arabicAnswer": "راحتك",
        "arabicWrongs": [
          "وكتك",
          "بالك",
          "فرصتك"
        ],
        "russianHint": "Не торопись — у нас полно времени.",
        "russianParts": [
          "Не ",
          " — у нас полно времени."
        ],
        "russianAnswer": "торопись",
        "russianWrongs": [
          "беги",
          "спеши",
          "волнуйся"
        ]
      },
      {
        "parts": [
          "Honestly, there's no ",
          " at all."
        ],
        "hint": "بەڕاستی، هیچ پەلەیەک نییە.",
        "answer": "rush",
        "wrongs": [
          "rushed",
          "rushing",
          "rushes"
        ],
        "arabicHint": "بصراحة، ماكو أي استعجال.",
        "arabicParts": [
          "بصراحة، ماكو أي ",
          " ."
        ],
        "arabicAnswer": "استعجال",
        "arabicWrongs": [
          "تأخير",
          "ضغط",
          "خوف"
        ],
        "russianHint": "Не к спеху, отправь, как только закончишь.",
        "russianParts": [
          "Не к ",
          " , отправь, как только закончишь."
        ],
        "russianAnswer": "спеху",
        "russianWrongs": [
          "делу",
          "сроку",
          "месту"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "کڕیارێک لە فرۆشگادا بڕیار دەدات",
        "situationAr": "زبون بالمحل يحاول يختار",
        "theyAsk": "Sorry, I can't decide between these two jackets.",
        "correct": "Take your time — there's no rush. I'm happy to help whenever you're ready.",
        "wrong1": "Choose now please.",
        "wrong2": "Both jackets same.",
        "wrong3": "We close soon hurry.",
        "explanation": "'Take your time' و 'no rush' هەردووکیان دەڵێن پەلە مەکە — زۆر بەئەدەب",
        "theyAskAr": "آسف، ما ديطلع بيدي أختار بين هالقمصلتين.",
        "correctAr": "أخذ راحتك — ماكو أي استعجال. يسعدني أساعدك شوكت ما تكون جاهز.",
        "wrong1Ar": "اختار هسة رجاءً.",
        "wrong2Ar": "القمصلتين نفس الشي.",
        "wrong3Ar": "راح نسد المحل بسرعة.",
        "explanationAr": "'Take your time' و 'no rush' ثنينهم يكولون لا تستعجل — بأدب كلش",
        "situationRu": "Коллега долго проверяет важный документ",
        "theyAskRu": "Я сейчас вычитываю документ, прости, что это занимает время.",
        "correctRu": "Не торопись, спешить совершенно некуда. Как только дойдут руки.",
        "wrong1Ru": "Пожалуйста, быстрее читай.",
        "wrong2Ru": "Мне нужно это прямо сейчас.",
        "wrong3Ru": "Ты слишком долго читаешь.",
        "explanationRu": "'Take your time' и 'no rush' — вежливые фразы, снимающие напряжение и спешку."
      },
      {
        "situation": "هاوکارێکت داوای مۆڵەت دەکات بۆ بڕیار لەسەر پڕۆپۆزاڵ",
        "situationAr": "زميلك يطلب وقت حتى يقرر بخصوص العرض",
        "theyAsk": "Can I get back to you on the proposal tomorrow?",
        "correct": "Of course — no pressure at all. Sleep on it and let me know when you decide.",
        "wrong1": "Answer must be today.",
        "wrong2": "Why you need time?",
        "wrong3": "Proposal is simple decide now.",
        "explanation": "'Sleep on it' واتای 'شەوێک بیری لێ بکەرەوە پێش بڕیاردان' — ئیدیۆمێکی زۆر باو",
        "theyAskAr": "أگدر أرجعلك جواب بخصوص المقترح باچر؟",
        "correctAr": "أكيد — ماكو أي ضغط. فكر بيها لباچر وكلي شوكت ما تقرر.",
        "wrong1Ar": "الجواب لازم اليوم.",
        "wrong2Ar": "ليش محتاج وكت؟",
        "wrong3Ar": "المقترح بسيط قرر هسة.",
        "explanationAr": "'Sleep on it' تعني 'فكر بالموضوع لباجر قبل لا تقرر' — تعبير كلش دارج",
        "situationRu": "Собеседник обещает ответить до конца дня",
        "theyAskRu": "Я постараюсь ответить на твоё письмо до конца дня.",
        "correctRu": "Никакого давления, не спеши! Завтра тоже вполне подойдёт.",
        "wrong1Ru": "Ответь сегодня обязательно.",
        "wrong2Ru": "Я буду ждать ответа.",
        "wrong3Ru": "Конец дня это поздно.",
        "explanationRu": "'Zero pressure' подчеркивает, что дедлайн гибкий и срочности нет."
      }
    ],
    "topicRu": "Не торопись"
  },
  {
    "topic": "It Is What It Is",
    "topicKu": "ئیتر ئەوەیە کە هەیە",
    "topicAr": "هذا الموجود",
    "words": [
      {
        "english": "It is what it is — we can't change the past.",
        "kurdish": "ئیتر ئەوەیە کە هەیە — ناتوانین ڕابردوو بگۆڕین.",
        "arabic": "هذا الموجود — ما نكدر نغير الماضي.",
        "russian": "Что поделать, двигаемся дальше."
      },
      {
        "english": "There's nothing we can do about it now.",
        "kurdish": "ئێستا هیچ شتێک نییە بتوانین بیکەین.",
        "arabic": "ماكو شي نكدر نسويه هسة.",
        "russian": "Сейчас мы уже ничего не можем с этим поделать."
      },
      {
        "english": "Oh well, that's life.",
        "kurdish": "باشە، ژیان ئاوایە.",
        "arabic": "يالله، هاي هي الدنيا.",
        "russian": "Где-то находишь, где-то теряешь."
      },
      {
        "english": "You win some, you lose some.",
        "kurdish": "جارێک دەبەیتەوە، جارێک دەدۆڕێیت.",
        "arabic": "يوم الك ويوم عليك.",
        "russian": "Такое случается, жизнь есть жизнь."
      },
      {
        "english": "No use crying over it.",
        "kurdish": "سوودی نییە خەمی بۆ بخۆین.",
        "arabic": "ماكو فايدة من البچي عليه.",
        "russian": "Слезами горю не поможешь (что упало, то пропало)."
      },
      {
        "english": "It's out of our hands at this point.",
        "kurdish": "لەم قۆناغەدا لە دەستی ئێمە دەرچووە.",
        "arabic": "الموضوع طلع من ايدنا بهالمرحلة.",
        "russian": "Ну что ж — переходим к следующему."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "It is what it is — let's focus on what's next.",
        "targetKurdish": "ئیتر ئەوەیە کە هەیە — با سەرنج بدەینە داهاتوو.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "هذا الموجود — خلينا نركز على الجاي.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Не получилось, но мы хотя бы попытались."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I wish it were different, honestly.",
        "targetKurdish": "بەڕاستی خۆزگە جیاواز بووایە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "بصراحة، اتمنى لو چان الموضوع مختلف.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Нет смысла теперь из-за этого переживать."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "We'll adapt — we always do.",
        "targetKurdish": "خۆمان دەگونجێنین — هەمیشە وا دەکەین.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "راح نتأقلم — احنة دائماً نسوي هيچ.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Иногда всё идёт не по плану."
      }
    ],
    "sentences": [
      {
        "english": [
          "There's",
          "no",
          "point",
          "stressing",
          "about",
          "it"
        ],
        "kurdish": "بێسوودە خۆتی بۆ ماندوو بکەیت.",
        "arabic": "ماكو داعي تدوخ راسك بيها.",
        "russian": "В следующий раз сделаем лучше."
      },
      {
        "english": [
          "Let's",
          "make",
          "the",
          "best",
          "of",
          "it"
        ],
        "kurdish": "با باشترین کەڵکی لێ وەربگرین.",
        "arabic": "خلينا نستفاد منه شكد ما نكدر.",
        "russian": "Давай сосредоточимся на том, на что можем повлиять."
      },
      {
        "english": [
          "Tomorrow's",
          "a",
          "new",
          "day"
        ],
        "kurdish": "سبەینێ ڕۆژێکی نوێیە.",
        "arabic": "باجر يوم جديد.",
        "russian": "Отряхнёмся и пойдём дальше."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "It is what it ",
          " — let's move on."
        ],
        "hint": "ئیتر ئەوەیە کە هەیە — با تێپەڕین.",
        "answer": "is",
        "wrongs": [
          "was",
          "be",
          "are"
        ],
        "arabicHint": "هذا الموجود — خلينا نعبر السالفة.",
        "arabicParts": [
          "هذا ",
          " — خلينا نعبر السالفة."
        ],
        "arabicAnswer": "الموجود",
        "arabicWrongs": [
          "الصار",
          "الواقع",
          "المكتوب"
        ],
        "russianHint": "Что поделать — давай просто сосредоточимся на завтрашнем дне.",
        "russianParts": [
          "Что ",
          " — давай просто сосредоточимся на завтрашнем дне."
        ],
        "russianAnswer": "поделать",
        "russianWrongs": [
          "сказать",
          "думать",
          "ждать"
        ]
      },
      {
        "parts": [
          "We'll just have to ",
          " with it."
        ],
        "hint": "دەبێت تەنها خۆمان لەگەڵی بگونجێنین.",
        "answer": "roll",
        "wrongs": [
          "rolled",
          "rolling",
          "rolls"
        ],
        "arabicHint": "لازم بس نتأقلم وياه.",
        "arabicParts": [
          "لازم بس ",
          " وياه."
        ],
        "arabicAnswer": "نتأقلم",
        "arabicWrongs": [
          "نصبر",
          "نرضى",
          "نسكت"
        ],
        "russianHint": "Где-то выигрываешь, где-то проигрываешь.",
        "russianParts": [
          "Где-то выигрываешь, где-то ",
          " ."
        ],
        "russianAnswer": "проигрываешь",
        "russianWrongs": [
          "теряешь",
          "уступаешь",
          "отдаёшь"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "تیمەکەت گرێبەستێکی گەورەی لەدەستدا",
        "situationAr": "فريقك خسر عقد چبير",
        "theyAsk": "I can't believe we lost the contract after all that work.",
        "correct": "It is what it is — we can't change the past. Let's focus on what's next.",
        "wrong1": "We should cry about it.",
        "wrong2": "Contract was always ours.",
        "wrong3": "Forget everything and quit.",
        "explanation": "'It is what it is' قبوڵکردنی بارودۆخێکە کە ناتوانرێت بگۆڕدرێت",
        "theyAskAr": "ما أصدگ خسرنا العقد ورا كل هذا التعب والشغل.",
        "correctAr": "هذا الموجود — ما نگدر نغير الماضي. خلينا نركز على الجاي.",
        "wrong1Ar": "لازم نبچي عليه.",
        "wrong2Ar": "العقد چان إلنا أصلاً.",
        "wrong3Ar": "انسوا كلشي واستقيلوا.",
        "explanationAr": "'It is what it is' قبول لوضع ما ينكدر يتغير",
        "situationRu": "Команда проиграла тендер после долгих усилий",
        "theyAskRu": "Клиент решил выбрать другое агентство после всей проделанной нами работы.",
        "correctRu": "Что поделать, двигаемся дальше. Где-то находишь, где-то теряешь.",
        "wrong1Ru": "Это ужасно, я увольняюсь.",
        "wrong2Ru": "Почему они так поступили?",
        "wrong3Ru": "Мы потратили время зря.",
        "explanationRu": "'It is what it is' выражает философское принятие ситуации, которую нельзя изменить."
      },
      {
        "situation": "هاوڕێیەکت دەربارەی باران لە ڕۆژی پیکنیک",
        "situationAr": "صديقك يحچي عن المطر بيوم السفرة",
        "theyAsk": "The weather ruined our whole picnic plan.",
        "correct": "Oh well, that's life. There's no point stressing — we can do a movie night instead.",
        "wrong1": "Weather is your fault.",
        "wrong2": "Picnic must happen today.",
        "wrong3": "I hate rain always.",
        "explanation": "'Oh well, that's life' قبوڵکردنێکی سووکە بۆ شتێکی نەخوازراو",
        "theyAskAr": "الجو خرب كل خطتنا مالت السفرة.",
        "correctAr": "يالله، هاي هي الدنيا. ماكو داعي تدوخ راسك — نكدر نسوي سهرة أفلام بدالها.",
        "wrong1Ar": "الجو صوچك أنت.",
        "wrong2Ar": "السفرة لازم تصير اليوم.",
        "wrong3Ar": "أني أكره المطر دائماً.",
        "explanationAr": "'Oh well, that's life' قبول خفيف لشي ما مرغوب بيه",
        "situationRu": "Дождь сорвал мероприятие на свежем воздухе",
        "theyAskRu": "Пошёл дождь, и наше мероприятие на открытом воздухе отменили.",
        "correctRu": "Ну что ж, мы уже ничего не можем поделать. Давай перенесём.",
        "wrong1Ru": "Дождь испортил всю жизнь.",
        "wrong2Ru": "Надо было предусмотреть дождь.",
        "wrong3Ru": "Я ненавижу погоду.",
        "explanationRu": "'Nothing we can do about it' помогает отпустить ситуацию и сосредоточиться на следующих шагах."
      }
    ],
    "topicRu": "Что поделать"
  },
  {
    "topic": "Everyday Idioms Mix",
    "topicKu": "ئیدیۆمەکانی ڕۆژانە",
    "topicAr": "مزيج التعابير اليومية",
    "words": [
      {
        "english": "I'm all ears — tell me what happened.",
        "kurdish": "گوێم لێیە — پێم بڵێ چی ڕوویدا.",
        "arabic": "اني كلي آذان صاغية — كلي شصار.",
        "russian": "Ни пуха ни пера на презентации!"
      },
      {
        "english": "That's on me — I'll pay for dinner.",
        "kurdish": "ئەوە لە ئەستۆی منە — شێوخواردنەکە من دەیدەم.",
        "arabic": "هاي عليه — اني راح ادفع حساب العشة.",
        "russian": "Стисни зубы и сделай этот звонок."
      },
      {
        "english": "You're pulling my leg — seriously?",
        "kurdish": "گاڵتەم پێ دەکەیت — بەڕاستی؟",
        "arabic": "تتشاقى وياية — من صدگ؟",
        "russian": "Давайте закругляться — мы все устали."
      },
      {
        "english": "Let's call it a day and head home.",
        "kurdish": "با بۆ ئەمڕۆ کۆتایی پێ بهێنین و بگەڕێینەوە ماڵەوە.",
        "arabic": "خلينا ننهي يومنا ونرجع للبيت.",
        "russian": "Попал прямо в яблочко (в самую точку)."
      },
      {
        "english": "I'm beat — I need to crash early tonight.",
        "kurdish": "ماندووم — پێویستە ئەمشەو زوو بخەوم.",
        "arabic": "اني هلكان — أحتاج انام من وكت الليلة.",
        "russian": "Сэкономишь на качестве — заплатишь дважды."
      },
      {
        "english": "Keep me posted on how it goes.",
        "kurdish": "ئاگادارم بکەرەوە بزانم چۆن دەڕوات.",
        "arabic": "خليني على اطلاع باللي يصير.",
        "russian": "Будем действовать по обстановке."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "That totally slipped my mind.",
        "targetKurdish": "ئەوە تەواو لەبیرم چوو.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "هاي راحت من بالي تماماً.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Давайте на сегодня закончим и продолжим завтра."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I'm swamped this week.",
        "targetKurdish": "ئەم هەفتەیە زۆر سەرقاڵم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "اني كلش مشغول هالسبوع.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Ты попал в самую точку этим замечанием."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Let's play it by ear.",
        "targetKurdish": "با بەپێی بارودۆخ بڕیار بدەین.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "خلينا نشوف شراح يصير ونقرر بوكتها.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Я просто буду действовать по ситуации, в зависимости от погоды."
      }
    ],
    "sentences": [
      {
        "english": [
          "It's",
          "a",
          "piece",
          "of",
          "cake,",
          "honestly"
        ],
        "kurdish": "بەڕاستی زۆر ئاسانە.",
        "arabic": "تراها زلاطة، بصراحة.",
        "russian": "Пора стиснуть зубы и сделать это."
      },
      {
        "english": [
          "We're",
          "on",
          "the",
          "same",
          "page"
        ],
        "kurdish": "هەردووکمان یەک تێگەیشتنمان هەیە.",
        "arabic": "احنة على نفس الموجة.",
        "russian": "Не экономь на безопасности."
      },
      {
        "english": [
          "I'll",
          "touch",
          "base",
          "with",
          "you",
          "Monday"
        ],
        "kurdish": "دووشەممە پەیوەندیت پێوە دەکەم.",
        "arabic": "راح اتواصل وياك يوم الاثنين.",
        "russian": "Мы закончили в самый раз по графику."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Hang in ",
          " , it gets easier after the first week."
        ],
        "hint": "خۆڕاگر بە، دوای هەفتەی یەکەم ئاسانتر دەبێت.",
        "answer": "there",
        "wrongs": [
          "their",
          "here",
          "them"
        ],
        "arabicHint": "اصبر شوية، راح تصير أسهل ورا السبوع الأول.",
        "arabicParts": [
          "",
          " شوية، راح تصير أسهل ورا السبوع الأول."
        ],
        "arabicAnswer": "اصبر",
        "arabicWrongs": [
          "اتحمل",
          "انتظر",
          "اهدأ"
        ],
        "russianHint": "Мы работали шесть часов подряд — давайте закругляться.",
        "russianParts": [
          "Мы работали шесть часов подряд — давайте ",
          " ."
        ],
        "russianAnswer": "закругляться",
        "russianWrongs": [
          "расходиться",
          "заканчивать",
          "уходить"
        ]
      },
      {
        "parts": [
          "I'm not sure yet — let's play it by ",
          " ."
        ],
        "hint": "هێشتا دڵنیا نیم — با بەپێی بارودۆخ بڕیار بدەین.",
        "answer": "ear",
        "wrongs": [
          "ears",
          "hear",
          "year"
        ],
        "arabicHint": "ما متأكد بعد — خلينا نشوف شراح يصير ونقرر بوكتها.",
        "arabicParts": [
          "ما متأكد بعد — خلينا نشوف شراح يصير و",
          " بوكتها."
        ],
        "arabicAnswer": "نقرر",
        "arabicWrongs": [
          "نحچي",
          "نشوف",
          "نسوي"
        ],
        "russianHint": "У меня нет строгого плана, буду действовать по обстоятельствам.",
        "russianParts": [
          "У меня нет чёткого плана, буду действовать по ",
          " ."
        ],
        "russianAnswer": "ситуации",
        "russianWrongs": [
          "плану",
          "случаю",
          "карте"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "هاوڕێیەکت دەیەوێت چیرۆکێکی سەرنجڕاکێش بڵێت",
        "situationAr": "صديقك يريد يحچي قصة مثيرة",
        "theyAsk": "Okay, so something crazy happened at work today...",
        "correct": "I'm all ears — tell me what happened. I've got time.",
        "wrong1": "I don't want hear story.",
        "wrong2": "Work is always boring.",
        "wrong3": "Tell me later maybe.",
        "explanation": "'I'm all ears' واتای 'گوێم لێیە، بە توندی گوێ دەگرم'",
        "theyAskAr": "أسمع، اليوم صار فد شي يخبل بالشغل...",
        "correctAr": "كلي آذان صاغية — احچيلي شصار. عندي وكت ومفرغ نفسي.",
        "wrong1Ar": "ما أريد أسمع القصة.",
        "wrong2Ar": "الشغل دائماً ممل.",
        "wrong3Ar": "احچيلي بعدين بلكي.",
        "explanationAr": "'I'm all ears' تعني 'اني دا اسمع باهتمام كلش'",
        "situationRu": "Друг откладывает неприятный звонок",
        "theyAskRu": "Я всё утро откладываю этот трудный телефонный звонок.",
        "correctRu": "Просто стисни зубы и покончи с этим. Тебе сразу станет намного легче.",
        "wrong1Ru": "Продолжай откладывать звонок.",
        "wrong2Ru": "Не звони вообще никогда.",
        "wrong3Ru": "Это очень страшный звонок.",
        "explanationRu": "'Bite the bullet' означает решиться сделать что-то трудное или неприятное, но неизбежное."
      },
      {
        "situation": "دوای کاری درێژ هاوکاران دەڕۆن",
        "situationAr": "بعد يوم شغل طويل الزملاء ديطلعون",
        "theyAsk": "Should we finish this tonight or come back tomorrow?",
        "correct": "Let's call it a day and head home. I'm beat — we'll pick it up fresh tomorrow.",
        "wrong1": "Work all night no sleep.",
        "wrong2": "I go home you stay.",
        "wrong3": "Project never finish.",
        "explanation": "'Call it a day' = کاری ئەمڕۆ تەواو بکە | 'I'm beat' = زۆر ماندووم",
        "theyAskAr": "نخلص هذا الشغل الليلة لو نرجعله باچر؟",
        "correctAr": "خلينا ننهي اليوم ونرجع للبيت. أني هلكان وتعبان — نكمله بنشاط باچر الصبح.",
        "wrong1Ar": "اشتغلوا طول الليل بدون نوم.",
        "wrong2Ar": "أني أروح للبيت وأنت ابقى.",
        "wrong3Ar": "المشروع ما راح يخلص أبد.",
        "explanationAr": "'Call it a day' = خلص شغل اليوم | 'I'm beat' = اني كلش تعبان",
        "situationRu": "Команда устала в конце длинного рабочего дня",
        "theyAskRu": "Уже больше семи вечера, и команда теряет концентрацию.",
        "correctRu": "Давайте закругляться на сегодня. Утром со свежими силами продолжим.",
        "wrong1Ru": "Работайте до полуночи.",
        "wrong2Ru": "Нельзя останавливаться.",
        "wrong3Ru": "Сфокусируйтесь немедленно.",
        "explanationRu": "'Call it a day' — идиома, означающая 'закончить работу на сегодня'."
      }
    ],
    "topicRu": "Разговорные идиомы"
  }
];

export default unit07;
