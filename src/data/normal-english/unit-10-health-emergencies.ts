import { UnitBank } from "../types";

// ── Unit 10: Health, Medical & Emergencies — 10 unique lessons ───────────────
// Practical, life-saving, and real-world medical English.

const unit10: UnitBank = [
  {
    "topic": "Describing Symptoms",
    "topicKu": "وەسفکردنی نیشانەکان",
    "topicAr": "وصف الأعراض",
    "words": [
      {
        "english": "I've had a headache since this morning.",
        "kurdish": "لە بەیانییەوە سەرئێشەم هەیە.",
        "arabic": "عندي وجع راس من الصبح.",
        "russian": "У меня с самого утра болит голова."
      },
      {
        "english": "My throat hurts when I swallow.",
        "kurdish": "کاتێک قوت دەدەم، گەرووم ئازارم دەدات.",
        "arabic": "بلعومي يوجعني من أبلع.",
        "russian": "Мне больно глотать."
      },
      {
        "english": "I feel dizzy whenever I stand up.",
        "kurdish": "هەر کاتێک هەڵدەستمەوە سەرپێ، سەرم گێژ دەخوات.",
        "arabic": "أدوخ كلما أوكف.",
        "russian": "У меня кружится голова каждый раз, когда я встаю."
      },
      {
        "english": "I've been coughing a lot for three days.",
        "kurdish": "سێ ڕۆژە زۆر کۆکەم هەیە.",
        "arabic": "عندي كحة قوية صارلي تلاث أيام.",
        "russian": "Я сильно кашляю уже три дня."
      },
      {
        "english": "I think I might have a fever.",
        "kurdish": "پێم وایە لەوانەیە تایەکم هەبێت.",
        "arabic": "أتصور عندي صخونة.",
        "russian": "Кажется, у меня поднялась температура."
      },
      {
        "english": "The pain comes and goes in waves.",
        "kurdish": "ئازارەکە بە شەپۆل دێت و دەڕوات.",
        "arabic": "الوجع يجي ويروح.",
        "russian": "Боль накатывает приступами (волнами)."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "My stomach's been off since last night.",
        "targetKurdish": "لە شەوی ڕابردووەوە گەدەم بەجێی خۆی نییە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "معدتي مخربطة من البارحة بالليل.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "С со вчерашнего вечера желудок не в порядке."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "It's a sharp pain right here.",
        "targetKurdish": "ئازارێکی تیژە هەر لێرەدا.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "وجع قوي كلش هنا بالضبط.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Вот прямо здесь резкая боль."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I can barely keep any food down.",
        "targetKurdish": "بەزەحمەت دەتوانم خواردن لە گەدەمدا بمێنێتەوە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "بالكوة كاعد أگدر أبقي الأكل بمعدتي.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Еда вообще не держится в желудке."
      }
    ],
    "sentences": [
      {
        "english": [
          "It",
          "started",
          "out",
          "mild",
          "and",
          "got",
          "worse"
        ],
        "kurdish": "سەرەتا سووک بوو و خراپتر بوو.",
        "arabic": "بدى خفيف وبعدين صار أسوأ.",
        "russian": "Сначала боль была слабой, а затем усилилась"
      },
      {
        "english": [
          "I",
          "haven't",
          "been",
          "able",
          "to",
          "sleep",
          "through",
          "the",
          "night"
        ],
        "kurdish": "نەمتوانیوە بە درێژایی شەو بخەوم.",
        "arabic": "ما كدرت أنام طول الليل.",
        "russian": "Я не мог нормально спать всю ночь"
      },
      {
        "english": [
          "It",
          "hurts",
          "more",
          "when",
          "I",
          "move",
          "my",
          "arm"
        ],
        "kurdish": "کاتێک قۆڵم دەجوڵێنم زیاتر ئازارم دەدات.",
        "arabic": "يوجعني أكثر من أحرك إيدي.",
        "russian": "Болит сильнее, когда я двигаю рукой"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "I've been feeling under the ",
          " all week."
        ],
        "hint": "هەموو هەفتەکە هەستم بە نەخۆشی کردووە.",
        "answer": "weather",
        "wrongs": [
          "water",
          "wind",
          "cloud"
        ],
        "arabicHint": "أحس روحي مريض طول الأسبوع.",
        "arabicParts": [
          "أحس روحي ",
          " طول الأسبوع."
        ],
        "arabicAnswer": "مريض",
        "arabicWrongs": [
          "طاير",
          "مرتاح",
          "نايم"
        ],
        "russianHint": "Всю неделю я чувствую себя неважно (приболел).",
        "russianParts": [
          "Всю эту неделю я чувствую себя ",
          " ."
        ],
        "russianAnswer": "неважно",
        "russianWrongs": [
          "плохо",
          "больно",
          "слабо"
        ]
      },
      {
        "parts": [
          "The pain ",
          " down into my leg."
        ],
        "hint": "ئازارەکە بەرەو خوارەوە بۆ قاچم دەڕوات.",
        "answer": "shoots",
        "wrongs": [
          "shoot",
          "shot",
          "shooting"
        ],
        "arabicHint": "الوجع ينزل لرجلي.",
        "arabicParts": [
          "الوجع ",
          " لرجلي."
        ],
        "arabicAnswer": "ينزل",
        "arabicWrongs": [
          "يصعد",
          "يطير",
          "يكعد"
        ],
        "russianHint": "Боль стреляет вниз в ногу.",
        "russianParts": [
          "Боль ",
          " вниз прямо в ногу."
        ],
        "russianAnswer": "стреляет",
        "russianWrongs": [
          "идёт",
          "бьёт",
          "тянет"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "پزیشک دەپرسێت چی هەیە و چیت لێ هاتووە",
        "situationAr": "الدكتور يسألك شبيك وشنو جابك",
        "theyAsk": "What brings you in today?",
        "theyAskAr": "خيرك اليوم، شبيك؟ شنو اللي جابك؟",
        "correct": "I've had a headache since this morning, and I feel dizzy whenever I stand up. I think I might have a fever too.",
        "correctAr": "عندي وجع راس من الصبح، وأدوخ كلما أوكف. وأتصور همين عندي صخونة.",
        "wrong1": "I've been feeling sick since this morning.",
        "wrong1Ar": "حاس روحي مريض من الصبح.",
        "wrong2": "I have a headache and might have a fever.",
        "wrong2Ar": "عندي وجع راس ويجوز عندي صخونة.",
        "wrong3": "I feel dizzy when I stand up.",
        "wrong3Ar": "أدوخ من أوكف.",
        "explanation": "وەسفکردنی نیشانەکان بە کات ('since this morning') و شێواز ('whenever I stand up') زۆر گرنگە بۆ پزیشک",
        "explanationAr": "وصف الأعراض بتحديد الوقت ('since this morning') والطريقة ('whenever I stand up') كلش مهم للدكتور",
        "situationRu": "Врач спрашивает о причине визита",
        "theyAskRu": "Что вас привело сегодня?",
        "correctRu": "У меня с самого утра болит голова, и кружится голова каждый раз, когда я встаю. Кажется, ещё и температура поднялась.",
        "wrong1Ru": "Я просто пришёл проведать больницу.",
        "wrong2Ru": "У меня всё в полном порядке.",
        "wrong3Ru": "Не знаю, зачем я здесь.",
        "explanationRu": "Точное указание времени начала ('since this morning') и условий проявления ('whenever I stand up') помогает врачу поставить диагноз."
      },
      {
        "situation": "هاوڕێیەکت دەپرسێت بۆچی نەهاتیت بۆ پۆل",
        "situationAr": "صديقك يسألك ليش ما أجيت للصف",
        "theyAsk": "You missed class — are you okay?",
        "theyAskAr": "ما داومت اليوم — خيرك بيك شي؟",
        "correct": "Not really — my throat hurts when I swallow, and I've been coughing a lot for three days.",
        "correctAr": "والله مو تمام — بلعومي يوجعني من أبلع، وصارلي تلاث أيام أكح حيل.",
        "wrong1": "I haven't been feeling well today.",
        "wrong1Ar": "اليوم مو كلش زين.",
        "wrong2": "I stayed home because I was coughing.",
        "wrong2Ar": "بقيت بالبيت لأن كاعد أكح.",
        "wrong3": "I'm hoping I'll feel better tomorrow.",
        "wrong3Ar": "أتمنى أصير أحسن باجر.",
        "explanation": "'My throat hurts when I swallow' — وەسفکردنی زۆر دروست و باوە بۆ نیشانەکانی سەرما",
        "explanationAr": "'My throat hurts when I swallow' — وصف دقيق وشائع لأعراض النشلة",
        "situationRu": "Однокурсник или коллега интересуется твоим самочувствием",
        "theyAskRu": "Ты пропустил занятия — с тобой всё хорошо?",
        "correctRu": "Не совсем — мне очень больно глотать, и я сильно кашляю уже третий день.",
        "wrong1Ru": "Я просто проспал.",
        "wrong2Ru": "Учеба мне не нравится.",
        "wrong3Ru": "Ничего не болит.",
        "explanationRu": "'My throat hurts when I swallow' — стандартное описание боли в горле."
      }
    ],
    "topicRu": "Описание симптомов"
  },
  {
    "topic": "At the Doctor",
    "topicKu": "لەلای پزیشک",
    "topicAr": "يم الدكتور",
    "words": [
      {
        "english": "How long have you had these symptoms?",
        "kurdish": "چەندە ئەم نیشانانەت هەیە؟",
        "arabic": "صارلك شكد تعاني من هاي الأعراض؟",
        "russian": "Как давно у вас эти симптомы?"
      },
      {
        "english": "I'm allergic to penicillin.",
        "kurdish": "هەستیاریم (حەساسیەت) بە پەنیلیلین هەیە.",
        "arabic": "عندي حساسية من البنسلين.",
        "russian": "У меня аллергия на пенициллин."
      },
      {
        "english": "Is this something I should worry about?",
        "kurdish": "ئایا ئەمە شتێکە کە پێویستە نیگەران بم لێی؟",
        "arabic": "هذا الشي لازم أقلق منه؟",
        "russian": "Стоит ли мне беспокоиться по этому поводу?"
      },
      {
        "english": "I'd like a second opinion if possible.",
        "kurdish": "ئەگەر بکرێت، حەز دەکەم ڕای دکتۆرێکی تریش وەربگرم (بۆچوونی دووەم).",
        "arabic": "أريد رأي دكتور ثاني إذا ممكن.",
        "russian": "Я бы хотел получить второе мнение другого врача, если возможно."
      },
      {
        "english": "When should I come back for a follow-up?",
        "kurdish": "کەی دەبێت بگەڕێمەوە بۆ پشکنینی دواتر (بەدواداچوون)؟",
        "arabic": "شوكت لازم أرجع للمراجعة؟",
        "russian": "Когда мне нужно прийти на повторный приём?"
      },
      {
        "english": "Will I need any blood tests?",
        "kurdish": "ئایا پێویستم بە هیچ پشکنینێکی خوێن دەبێت؟",
        "arabic": "راح أحتاج تحاليل دم؟",
        "russian": "Понадобится ли мне сдавать анализы крови?"
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Am I okay to keep working out?",
        "targetKurdish": "ئایا باشە بەردەوام بم لە وەرزش؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "عادي أبقى أتمرن؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Можно ли мне продолжать тренировки?"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Does this run in families?",
        "targetKurdish": "ئایا ئەمە لە خێزانەکاندا باوە؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "هذا الشي وراثي بالعوائل؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Это наследственное заболевание?"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "What are my options besides medication?",
        "targetKurdish": "جگە لە دەرمان چ هەڵبژاردەیەکی ترم هەیە؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "شنو خياراتي غير الأدوية؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Какие есть варианты лечения, помимо лекарств?"
      }
    ],
    "sentences": [
      {
        "english": [
          "I",
          "brought",
          "a",
          "list",
          "of",
          "my",
          "medications"
        ],
        "kurdish": "لیستی دەرمانەکانم هێناوە.",
        "arabic": "جبت قائمة بأدويتي.",
        "russian": "Я принёс список препаратов, которые принимаю"
      },
      {
        "english": [
          "Could",
          "you",
          "write",
          "that",
          "down",
          "for",
          "me"
        ],
        "kurdish": "دەتوانیت ئەوە بۆم بنووسیت؟",
        "arabic": "تكدر تكتبلي هذا الشي؟",
        "russian": "Не могли бы вы записать это для меня?"
      },
      {
        "english": [
          "I'd",
          "rather",
          "try",
          "the",
          "least",
          "invasive",
          "option",
          "first"
        ],
        "kurdish": "پێم خۆشترە سەرەتا سووکترین هەڵبژاردە تاقی بکەمەوە.",
        "arabic": "أفضل أجرب الخيار الأسهل بالبداية.",
        "russian": "Я бы предпочёл сначала попробовать наименее инвазивный метод"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "I'm ",
          " to penicillin, so please note that."
        ],
        "hint": "هەستیاریم بە پەنیسیلین هەیە، تکایە ئەوە تۆمار بکە.",
        "answer": "allergic",
        "wrongs": [
          "allergy",
          "allergies",
          "allergen"
        ],
        "arabicHint": "عندي حساسية من البنسلين، ياريت تسجل هذا الشي.",
        "arabicParts": [
          "عندي ",
          " من البنسلين، ياريت تسجل هذا الشي."
        ],
        "arabicAnswer": "حساسية",
        "arabicWrongs": [
          "حرارة",
          "وجع",
          "صداع"
        ],
        "russianHint": "У меня аллергия на пенициллин, пожалуйста, отметьте это.",
        "russianParts": [
          "У меня ",
          " на пенициллин, отметьте это."
        ],
        "russianAnswer": "аллергия",
        "russianWrongs": [
          "реакция",
          "неприязнь",
          "болезнь"
        ]
      },
      {
        "parts": [
          "I'd like to get a second ",
          " before deciding."
        ],
        "hint": "پێش بڕیاردان دەمەوێت ڕای پزیشکێکی تر وەربگرم.",
        "answer": "opinion",
        "wrongs": [
          "opinions",
          "advice",
          "thought"
        ],
        "arabicHint": "أريد رأي دكتور ثاني قبل لا أقرر.",
        "arabicParts": [
          "أريد ",
          " دكتور ثاني قبل لا أقرر."
        ],
        "arabicAnswer": "رأي",
        "arabicWrongs": [
          "دوة",
          "فحص",
          "موعد"
        ],
        "russianHint": "Я бы хотел узнать второе мнение специалиста перед принятием решения.",
        "russianParts": [
          "Я бы хотел услышать второе ",
          " врача."
        ],
        "russianAnswer": "мнение",
        "russianWrongs": [
          "слово",
          "решение",
          "письмо"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "پزیشک پرسیار لە مێژووی تەندروستیت دەکات",
        "situationAr": "الدكتور يسألك عن تاريخك الصحي",
        "theyAsk": "Do you have any allergies I should know about?",
        "theyAskAr": "عندك أي حساسية من أدوية لازم أعرفها؟",
        "correct": "Yes, I'm allergic to penicillin. Other than that, I'm generally healthy.",
        "correctAr": "إي، عندي حساسية من البنسلين. عدا هذا، صحتي زينة بشكل عام.",
        "wrong1": "I have one medication allergy.",
        "wrong1Ar": "عندي حساسية من نوع واحد من الدوة.",
        "wrong2": "I think penicillin caused a reaction once.",
        "wrong2Ar": "أتذكر مرة البنسلين سوالي حساسية.",
        "wrong3": "I'm generally healthy apart from my allergies.",
        "wrong3Ar": "صحتي زينة عدا الحساسية اللي عندي.",
        "explanation": "'I'm allergic to...' — گرنگترین ڕستەیە لە کاتی سەردانی هەر پزیشکێک یان نەخۆشخانەیەک",
        "explanationAr": "'I'm allergic to...' — أهم جملة من تروح لأي دكتور أو مستشفى",
        "situationRu": "Врач собирает анамнез перед назначением",
        "theyAskRu": "Есть ли у вас аллергия на какие-либо препараты?",
        "correctRu": "Да, у меня аллергия на пенициллин. В остальном со здоровьем всё в порядке.",
        "wrong1Ru": "Аллергий нет совсем.",
        "wrong2Ru": "Я не знаю названий лекарств.",
        "wrong3Ru": "Мне всё равно, что вы назначите.",
        "explanationRu": "'I'm allergic to...' — жизненно важная фраза при любом медицинском визите."
      },
      {
        "situation": "پزیشک پشکنینی کردوویت بەڵام دەتەوێت دڵنیابیت",
        "situationAr": "فحصك الدكتور بس تريد تتأكد",
        "theyAsk": "The results look normal, but I can run more tests.",
        "theyAskAr": "النتائج تبين طبيعية، بس أكدر أسويلك بعد تحاليل.",
        "correct": "Is this something I should worry about? When should I come back for a follow-up?",
        "correctAr": "هذا الشي يستاهل أقلق منه؟ وشوكت لازم أرجع للمراجعة؟",
        "wrong1": "Would you recommend any additional tests?",
        "wrong1Ar": "تنصحني أسوي بعد تحاليل إضافية؟",
        "wrong2": "Could you explain what 'normal' means here?",
        "wrong2Ar": "تكدر توضحي شنو يعني طبيعية هنا؟",
        "wrong3": "Should I monitor anything at home?",
        "wrong3Ar": "لازم أراقب شي بالبيت؟",
        "explanation": "'Follow-up' وشەیەکی پزیشکی باوە بە واتای گەڕانەوە بۆ پشکنینی دواتر تا بزانرێت چاک بوویت یان نا",
        "explanationAr": "'Follow-up' مصطلح طبي معروف معناه ترجع لمراجعة حتى يشوفون إذا صرت زين لو لا",
        "situationRu": "Обсуждение результатов обследования",
        "theyAskRu": "Результаты в норме, но я могу назначить дополнительные тесты.",
        "correctRu": "Стоит ли мне переживать по этому поводу? Когда мне прийти на повторный приём?",
        "wrong1Ru": "Дополнительные тесты не нужны.",
        "wrong2Ru": "Я больше не приду.",
        "wrong3Ru": "Вы плохой врач.",
        "explanationRu": "'Follow-up' в медицине — контрольный повторный осмотр для отслеживания динамики."
      }
    ],
    "topicRu": "У врача"
  },
  {
    "topic": "At the Pharmacy",
    "topicKu": "لە دەرمانخانە",
    "topicAr": "بالصيدلية",
    "words": [
      {
        "english": "I'd like to pick up my prescription, please.",
        "kurdish": "دەمەوێت دەرمانەکانم وەربگرم، تکایە.",
        "arabic": "أريد أستلم الوصفة مالتي، بلا زحمة.",
        "russian": "Я бы хотел забрать лекарство по рецепту, пожалуйста."
      },
      {
        "english": "Do I take this with food or on an empty stomach?",
        "kurdish": "ئەمە لەگەڵ خواردن بخۆم یان لەسەر گەدەی بەتاڵ؟",
        "arabic": "أخذ هذا وي الأكل لو على معدة فارغة؟",
        "russian": "Принимать это во время еды или натощак?"
      },
      {
        "english": "Are there any side effects I should know about?",
        "kurdish": "ئایا هیچ کاریگەرییەکی لاوەکی هەیە کە پێویستە بیزانم؟",
        "arabic": "أكو أي أعراض جانبية لازم أعرفها؟",
        "russian": "Есть ли побочные эффекты, о которых мне следует знать?"
      },
      {
        "english": "Can I get something over the counter for this?",
        "kurdish": "دەتوانم شتێک بەبێ ڕەچەتەی پزیشک بۆ ئەمە وەربگرم؟",
        "arabic": "أكدر أحصل دوة بدون راچيتة لهذا الشي؟",
        "russian": "Можно ли купить от этого что-нибудь без рецепта?"
      },
      {
        "english": "How many times a day should I take it?",
        "kurdish": "چەند جار لە ڕۆژێکدا دەبێت بیخۆم؟",
        "arabic": "كم مرة باليوم لازم أخذه؟",
        "russian": "Сколько раз в день мне следует это принимать?"
      },
      {
        "english": "I'm looking for something to help me sleep.",
        "kurdish": "بەدوای شتێکدا دەگەڕێم یارمەتیم بدات بخەوم.",
        "arabic": "أدور على شي يساعدني أنام.",
        "russian": "Я ищу какое-нибудь средство, чтобы уснуть."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Is there a generic version of this?",
        "targetKurdish": "ئایا وەشانێکی هاوشێوەی هەرزانتری هەیە؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "أكو بديل أرخص لهذا الدوة؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Есть ли более дешёвый дженерик (аналог) этого препарата?"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Can I take this with my other prescription?",
        "targetKurdish": "دەتوانم ئەمە لەگەڵ دەرمانەکەی ترم بخۆم؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "أكدر أخذ هذا وي دواي الثاني؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Могу я принимать это вместе с другими моими рецептурными лекарствами?"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "How long until I start feeling better?",
        "targetKurdish": "چەند دەخایەنێت تا هەست بە باشتربوون بکەم؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "شكد ويطول حتى أحس روحي أحسن؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Через какое время мне должно стать лучше?"
      }
    ],
    "sentences": [
      {
        "english": [
          "My",
          "insurance",
          "should",
          "cover",
          "this",
          "one"
        ],
        "kurdish": "دەبێت دڵنیایی تەندروستیم ئەمە بگرێتەوە.",
        "arabic": "المفروض تأميني يغطي هذا الدوة.",
        "russian": "Моя страховка должна покрывать это лекарство"
      },
      {
        "english": [
          "I",
          "need",
          "a",
          "refill",
          "on",
          "my",
          "inhaler"
        ],
        "kurdish": "پێویستم بە پڕکردنەوەی ئینهەیلەرەکەمە.",
        "arabic": "أحتاج أترس بخاخ الربو مالتي.",
        "russian": "Мне нужно обновить рецепт на ингалятор"
      },
      {
        "english": [
          "Do",
          "you",
          "have",
          "anything",
          "for",
          "a",
          "sore",
          "throat"
        ],
        "kurdish": "هیچت هەیە بۆ ئازاری گەروو؟",
        "arabic": "عدكم شي لالتهاب البلعوم؟",
        "russian": "У вас есть что-нибудь от боли в горле?"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Can I get this over the ",
          " , or do I need a script?"
        ],
        "hint": "دەتوانم ئەمە بەبێ ڕەچەتە وەربگرم، یان پێویستم بە ڕەچەتەیە؟",
        "answer": "counter",
        "wrongs": [
          "desk",
          "table",
          "shelf"
        ],
        "arabicHint": "أكدر أشتري هذا بدون راچيتة، لو أحتاج راچيتة؟",
        "arabicParts": [
          "أكدر أشتري هذا بدون ",
          "، لو أحتاج راچيتة؟"
        ],
        "arabicAnswer": "راچيتة",
        "arabicWrongs": [
          "فلوس",
          "سؤال",
          "إذن"
        ],
        "russianHint": "Можно ли купить это без рецепта, или нужен рецепт врача?",
        "russianParts": [
          "Можно ли купить это без ",
          " , или нужен рецепт?"
        ],
        "russianAnswer": "рецепта",
        "russianWrongs": [
          "врача",
          "талона",
          "справки"
        ]
      },
      {
        "parts": [
          "Take one pill twice a day on an ",
          " stomach."
        ],
        "hint": "ڕۆژی دوو جار حەبێک لەسەر گەدەی بەتاڵ بخۆ.",
        "answer": "empty",
        "wrongs": [
          "empties",
          "emptied",
          "emptying"
        ],
        "arabicHint": "أخذ حباية مرتين باليوم على معدة فارغة.",
        "arabicParts": [
          "أخذ حباية مرتين باليوم على معدة ",
          "."
        ],
        "arabicAnswer": "فارغة",
        "arabicWrongs": [
          "مليانة",
          "ثقيلة",
          "تعبانة"
        ],
        "russianHint": "Принимайте по одной таблетке дважды в день натощак.",
        "russianParts": [
          "Принимайте по одной таблетке два раза в день ",
          " ."
        ],
        "russianAnswer": "натощак",
        "russianWrongs": [
          "с едой",
          "утром",
          "с водой"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لە دەرمانخانە دەرمان وەردەگریت",
        "situationAr": "تستلم دوة من الصيدلية",
        "theyAsk": "Do you have a prescription with you?",
        "theyAskAr": "شايل وياك راچيتة (وصفة طبية)؟",
        "correct": "Yes — I'd like to pick up my prescription, please. How many times a day should I take it?",
        "correctAr": "إي — أريد أستلم وصفتي فدوة. كم مرة باليوم لازم آخذ هذا الدوة؟",
        "wrong1": "Yes, I have the prescription with me.",
        "wrong1Ar": "إي، الراچيتة وياي.",
        "wrong2": "I'm here to collect a medication my doctor prescribed.",
        "wrong2Ar": "جاي أستلم دوة كتبلي ياه الدكتور.",
        "wrong3": "Could you check whether my prescription is ready?",
        "wrong3Ar": "تكدر تتأكد إذا وصفتي جاهزة؟",
        "explanation": "'Pick up my prescription' — زاراوەی ستانداردە کاتێک دەچیتە دەرمانخانە بۆ وەرگرتنی دەرمانی دکتۆر",
        "explanationAr": "'Pick up my prescription' — مصطلح معروف من تروح للصيدلية حتى تستلم الدوة مال الدكتور",
        "situationRu": "Получение лекарства по рецепту в аптеке",
        "theyAskRu": "У вас есть с собой рецепт от врача?",
        "correctRu": "Да — я бы хотел забрать лекарство по рецепту. Сколько раз в день мне нужно его принимать?",
        "wrong1Ru": "Рецепта нет, продайте так.",
        "wrong2Ru": "Я забыл, зачем пришёл.",
        "wrong3Ru": "Лекарства слишком дорогие.",
        "explanationRu": "'Pick up my prescription' — стандартная фраза при получении рецептурных препаратов в аптеке."
      },
      {
        "situation": "بەدوای دەرمانێکدا دەگەڕێیت بەبێ بینینی دکتۆر",
        "situationAr": "تدور على دوة بدون ما تروح للدكتور",
        "theyAsk": "What symptoms are you trying to treat?",
        "theyAskAr": "شنو الأعراض اللي تريد تعالجها؟",
        "correct": "Can I get something over the counter for a sore throat? Are there any side effects I should know about?",
        "correctAr": "أكدر أحصل شي بدون راچيتة لالتهاب البلعوم؟ وأكو أي أعراض جانبية لازم أعرفها؟",
        "wrong1": "I'm looking for something for a sore throat.",
        "wrong1Ar": "كاعد أدور على شي للبلعوم.",
        "wrong2": "What over-the-counter options do you recommend?",
        "wrong2Ar": "شنو تنصحني أدوية بدون راچيتة؟",
        "wrong3": "Is there anything I can take without a prescription?",
        "wrong3Ar": "أكو شي أكدر آخذه بدون وصفة؟",
        "explanation": "'Over the counter' ئاماژەیە بۆ ئەو دەرمانانەی کە بەبێ ڕەچەتەی پزیشک دەفرۆشرێن وەکو حەبی سەرئێشە",
        "explanationAr": "'Over the counter' يقصدون بيها الأدوية اللي تنباع بدون راچيتة مثل براسيتول وجماعته",
        "situationRu": "Покупка лекарства от простуды без рецепта",
        "theyAskRu": "От каких симптомов вы ищете средство?",
        "correctRu": "Можно мне что-нибудь безрецептурное от боли в горле? Есть ли побочные эффекты, о которых стоит знать?",
        "wrong1Ru": "Дайте мне самые сильные антибиотики.",
        "wrong2Ru": "У меня всё болит везде.",
        "wrong3Ru": "Никакие симптомы не беспокоят.",
        "explanationRu": "'Over the counter' (OTC) означает безрецептурные препараты, доступные в свободной продаже."
      }
    ],
    "topicRu": "В аптеке"
  },
  {
    "topic": "Emergency Room",
    "topicKu": "ژووری فریاکەوتن (ER)",
    "topicAr": "بالطوارئ",
    "words": [
      {
        "english": "I think I'm having a heart attack.",
        "kurdish": "پێم وایە تووشی جەڵتەی دڵ دەبم.",
        "arabic": "أتصور راح تجيني جلطة قلبية.",
        "russian": "Кажется, у меня сердечный приступ."
      },
      {
        "english": "The pain in my chest is getting worse.",
        "kurdish": "ئازاری سینگم بەرەو خراپتر دەڕوات.",
        "arabic": "الوجع بصدري كاعد يزيد.",
        "russian": "Боль в груди усиливается."
      },
      {
        "english": "How long is the wait in the ER?",
        "kurdish": "چاوەڕوانییەکە لە ژووری فریاکەوتندا چەند دەخایەنێت؟",
        "arabic": "شكد الانتظار بالطوارئ؟",
        "russian": "Сколько времени занимает ожидание в приёмном покое?"
      },
      {
        "english": "I was brought in by ambulance an hour ago.",
        "kurdish": "کاتژمێرێک لەمەوپێش بە ئەمبولانس هێنرام بۆ ئێرە.",
        "arabic": "جابوني بالإسعاف قبل ساعة.",
        "russian": "Меня привезли на скорой час назад."
      },
      {
        "english": "Can my family member stay with me?",
        "kurdish": "دەتوانێت ئەندامێکی خێزانەکەم لەگەڵم بمێنێتەوە؟",
        "arabic": "يكدر واحد من أهلي يبقى وياي؟",
        "russian": "Может ли член моей семьи остаться со мной?"
      },
      {
        "english": "When will the test results be ready?",
        "kurdish": "کەی ئەنجامی پشکنینەکان ئامادە دەبن؟",
        "arabic": "شوكت تطلع نتائج التحاليل؟",
        "russian": "Когда будут готовы результаты анализов?"
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "She hit her head and blacked out.",
        "targetKurdish": "سەری کێشا و بێهۆش بوو.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "انضربت براسها وفقدت الوعي.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Она ударилась головой и потеряла сознание."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "He's having trouble breathing.",
        "targetKurdish": "کێشەی هەناسەدانی هەیە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "عنده صعوبة بالتنفس.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Ему трудно дышать."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Has anyone been in to see him yet?",
        "targetKurdish": "هێشتا هیچ کەس نەهاتووە بۆ بینینی؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "أكو أحد إجه شافه لحد هسه؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "К нему уже кто-нибудь подходил из врачей?"
      }
    ],
    "sentences": [
      {
        "english": [
          "He's",
          "on",
          "blood",
          "thinners,",
          "just",
          "so",
          "you",
          "know"
        ],
        "kurdish": "ئەو دەرمانی تەنککەری خوێن دەخوات، بۆ زانیاری.",
        "arabic": "هو ياخذ مسيلات دم، بس حتى تعرفون.",
        "russian": "Он принимает препараты, разжижающие кровь, просто к сведению"
      },
      {
        "english": [
          "This",
          "started",
          "about",
          "twenty",
          "minutes",
          "ago"
        ],
        "kurdish": "ئەمە نزیکەی بیست خولەک لەمەوپێش دەستی پێکرد.",
        "arabic": "بدى هذا الشي قبل حوالي عشرين دقيقة.",
        "russian": "Это началось примерно двадцать минут назад"
      },
      {
        "english": [
          "Please",
          "tell",
          "me",
          "what's",
          "happening"
        ],
        "kurdish": "تکایە پێم بڵێ چی ڕوودەدات.",
        "arabic": "فدوة كلي شديصير.",
        "russian": "Пожалуйста, скажите мне, что происходит"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "We need to see someone right ",
          " — this is urgent."
        ],
        "hint": "پێویستە یەکسەر کەسێک بمانبینێت — ئەمە فریاگوزارییە.",
        "answer": "away",
        "wrongs": [
          "ago",
          "now",
          "then"
        ],
        "arabicHint": "نحتاج واحد يشوفنا هسه — الموضوع مستعجل.",
        "arabicParts": [
          "نحتاج دكتور يشوفنا ",
          " — الموضوع كلش مستعجل."
        ],
        "arabicAnswer": "هسه",
        "arabicWrongs": [
          "باجر",
          "عكبه",
          "بعدين"
        ],
        "russianHint": "Нам нужно, чтобы нас осмотрели прямо сейчас — это срочно.",
        "russianParts": [
          "Нам нужен врач прямо ",
          " — это срочно."
        ],
        "russianAnswer": "сейчас",
        "russianWrongs": [
          "тут",
          "здесь",
          "быстро"
        ]
      },
      {
        "parts": [
          "He was ",
          " in by ambulance an hour ago."
        ],
        "hint": "کاتژمێرێک لەمەوپێش بە ئەمبولانس هێنرا بۆ ئێرە.",
        "answer": "brought",
        "wrongs": [
          "bring",
          "bringing",
          "brings"
        ],
        "arabicHint": "جابوه بالإسعاف قبل ساعة.",
        "arabicParts": [
          "جابوه ",
          " قبل ساعة."
        ],
        "arabicAnswer": "بالإسعاف",
        "arabicWrongs": [
          "بالتكسي",
          "بالطيارة",
          "بالباص"
        ],
        "russianHint": "Его привезли на скорой час назад.",
        "russianParts": [
          "Его ",
          " на скорой помощи час назад."
        ],
        "russianAnswer": "привезли",
        "russianWrongs": [
          "доставили",
          "забрали",
          "положили"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لە بەشی فریاکەوتن (هەواڵدان بە حاڵەتی خێرا)",
        "situationAr": "بالطوارئ (تبلغ عن حالة مستعجلة)",
        "theyAsk": "What is your emergency today?",
        "theyAskAr": "شنو الحالة الطارئة عندكم اليوم؟",
        "correct": "The pain in my chest is getting worse. I think I'm having a heart attack — it started about twenty minutes ago.",
        "correctAr": "الوجع بصدري كاعد يزيد. أتصور تجيني جلطة قلبية — بدى قبل حوالي عشرين دقيقة.",
        "wrong1": "I've had chest pain for about twenty minutes.",
        "wrong1Ar": "صارلي عشرين دقيقة صدري يوجعني.",
        "wrong2": "The pain is getting worse and I'm short of breath.",
        "wrong2Ar": "الوجع ديزيد وعندي ضيق نفس.",
        "wrong3": "I'm worried this may be serious.",
        "wrong3Ar": "قلقان لا يكون الموضوع خطير.",
        "explanation": "لە کاتی باری لەناکاودا، دیاریکردنی جۆری ئازارەکە ('getting worse') و کاتی دەستپێکردنەکەی زۆر گرنگە",
        "explanationAr": "بحالات الطوارئ، تحدد نوع الوجع ووقت بدايته كلش مهم",
        "situationRu": "В регистратуре отделения неотложной помощи (ER)",
        "theyAskRu": "Что у вас за экстренная ситуация?",
        "correctRu": "Боль в груди усиливается. Мне кажется, у меня сердечный приступ — это началось около двадцати минут назад.",
        "wrong1Ru": "Я просто пришёл посидеть в очереди.",
        "wrong2Ru": "У меня немного чешется палец.",
        "wrong3Ru": "Боль в груди пустяковая.",
        "explanationRu": "При боли в груди критично сразу сообщить характер боли ('getting worse') и точное время начала ('twenty minutes ago')."
      },
      {
        "situation": "چاوەڕوانی ئەنجامی پشکنین دەکەیت",
        "situationAr": "تنتظر نتائج التحاليل",
        "theyAsk": "The doctor will be with you shortly.",
        "theyAskAr": "الدكتور راح يجيك بعد شوية.",
        "correct": "When will the test results be ready? Can my family member stay with me while I wait?",
        "correctAr": "شوكت تطلع نتائج التحاليل؟ ويكدر واحد من أهلي يبقى وياي بين ما أنتظر؟",
        "wrong1": "Do you know how much longer the wait might be?",
        "wrong1Ar": "تعرف شكد بعد لازم ننتظر؟",
        "wrong2": "Could you tell me when the results are expected?",
        "wrong2Ar": "تكدر تكلي شوكت متوقع تطلع النتائج؟",
        "wrong3": "May my family member wait here with me?",
        "wrong3Ar": "يكدر أحد من أهلي ينتظر وياي هنا؟",
        "explanation": "'Test results' بۆ ئەنجامی خوێن و تیشک بەکاردێت | 'stay with me' بۆ مانەوەی هاوەڵێک",
        "explanationAr": "'Test results' يستعملوها لنتائج الدم والأشعة | 'stay with me' حتى يبقى شخص وياك",
        "situationRu": "Ожидание в палате приёмного покоя",
        "theyAskRu": "Доктор скоро подойдёт к вам.",
        "correctRu": "Когда будут готовы результаты обследования? Может ли мой родственник остаться со мной в палате?",
        "wrong1Ru": "Я ухожу домой прямо сейчас.",
        "wrong2Ru": "Врачи слишком заняты.",
        "wrong3Ru": "Мне не нужны анализы.",
        "explanationRu": "'Test results' охватывает анализы и снимки; просьба 'stay with me' разрешает присутствие близкого."
      }
    ],
    "topicRu": "Отделение неотложной помощи"
  },
  {
    "topic": "First Aid & Calling for Help",
    "topicKu": "یارمەتی سەرەتایی و داوای فریاگوزاری",
    "topicAr": "الإسعافات الأولية وشلون تطلب مساعدة",
    "words": [
      {
        "english": "I need an ambulance — someone is unconscious.",
        "kurdish": "پێویستم بە ئەمبولانسە — کەسێک بێهۆش بووە.",
        "arabic": "أحتاج إسعاف — أكو واحد فاقد الوعي.",
        "russian": "Мне нужна скорая помощь — человек без сознания."
      },
      {
        "english": "There's been a car accident on Main Street.",
        "kurdish": "ڕووداوێکی ئۆتۆمبێل (پێکدادان) لە شەقامی سەرەکی ڕوویداوە.",
        "arabic": "صار حادث سيارة بالشارع الرئيسي.",
        "russian": "На Главной улице произошла автомобильная авария."
      },
      {
        "english": "Keep pressure on the wound until it stops bleeding.",
        "kurdish": "پەستان بخەرە سەر برینەکە تاوەکو خوێنبەربوونەکە دەوەستێت.",
        "arabic": "اضغط على الجرح لحد ما يوكف النزيف.",
        "russian": "Прижимайте рану, пока не остановится кровотечение."
      },
      {
        "english": "Elevate your leg to reduce the swelling.",
        "kurdish": "قاچت بەرز بکەرەوە بۆ کەمکردنەوەی ئاوسانەکە.",
        "arabic": "ارفع رجلك حتى يقل الورم.",
        "russian": "Приподнимите ногу выше, чтобы уменьшить отёк."
      },
      {
        "english": "Please hurry — the bleeding won't stop.",
        "kurdish": "تکایە پەلە بکەن — خوێنبەربوونەکە ناوەستێت.",
        "arabic": "استعجلوا فدوة — النزيف ما ديوكف.",
        "russian": "Пожалуйста, быстрее — кровотечение не прекращается."
      },
      {
        "english": "Try to stay still — help is on the way.",
        "kurdish": "هەوڵ بدە نەجوڵێیت — یارمەتی لە ڕێگایە.",
        "arabic": "حاول لا تتحرك — المساعدة بالطريق.",
        "russian": "Постарайтесь не двигаться — помощь уже в пути."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Does anyone here know CPR?",
        "targetKurdish": "هیچ کەسێک لێرە فێری فریاگوزاری دڵ و هەناسەیە؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "أكو أحد هنا يعرف يسوي تنفس اصطناعي؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Кто-нибудь здесь умеет делать сердечно-лёгочную реанимацию (СЛР)?"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Grab the first aid kit from the kitchen.",
        "targetKurdish": "سندووقی فریاگوزاری لە چێشتخانە بهێنە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "جيب جنطة الإسعافات الأولية من المطبخ.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Принеси аптечку первой помощи с кухни."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Don't move him — he might have hurt his neck.",
        "targetKurdish": "مەیجوڵێنە — لەوانەیە ملی بریندار بووبێت.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "لا تحركه — يجوز ركبته متأذية.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Не двигай его — возможно, у него травма шеи."
      }
    ],
    "sentences": [
      {
        "english": [
          "I'm",
          "putting",
          "you",
          "on",
          "speaker"
        ],
        "kurdish": "دەخەمە سەر بڵندگۆ.",
        "arabic": "راح أخليك على السبيكر.",
        "russian": "Я перевожу вас на громкую связь"
      },
      {
        "english": [
          "We're",
          "at",
          "the",
          "corner",
          "of",
          "Fifth",
          "and",
          "Oak"
        ],
        "kurdish": "لە سووچی شەقامی پێنجەم و ئۆکداین.",
        "arabic": "إحنا بتقاطع الشارع الخامس وشارع أوك.",
        "russian": "Мы на перекрёстке Пятой улицы и Оук"
      },
      {
        "english": [
          "He's",
          "breathing",
          "but",
          "not",
          "responding"
        ],
        "kurdish": "هەناسە دەدات بەڵام وەڵام نادات.",
        "arabic": "ديتنفس بس ماكو أي استجابة.",
        "russian": "Он дышит, но не реагирует на слова"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Keep ",
          " on the wound until the bleeding stops."
        ],
        "hint": "پەستان لەسەر برینەکە ڕابگرە تا خوێنبەربوونەکە دەوەستێت.",
        "answer": "pressure",
        "wrongs": [
          "press",
          "pressing",
          "pressed"
        ],
        "arabicHint": "ابقى ضاغط على الجرح لحد ما يوكف النزيف.",
        "arabicParts": [
          "ابقى ",
          " على الجرح لحد ما يوكف النزيف."
        ],
        "arabicAnswer": "ضاغط",
        "arabicWrongs": [
          "نايم",
          "تفرك",
          "تغسل"
        ],
        "russianHint": "Продолжайте давить на рану, пока кровь не остановится.",
        "russianParts": [
          "Оказывайте ",
          " на рану, пока кровотечение не остановится."
        ],
        "russianAnswer": "давление",
        "russianWrongs": [
          "внимание",
          "нажатие",
          "тяжесть"
        ]
      },
      {
        "parts": [
          "Stay on the ",
          " with me until they arrive."
        ],
        "hint": "لەگەڵم لەسەر خەت بمێنەرەوە تا دەگەن.",
        "answer": "line",
        "wrongs": [
          "lines",
          "lining",
          "lined"
        ],
        "arabicHint": "ابقى وياي عالخط لحد ما يوصلون.",
        "arabicParts": [
          "ابقى وياي ",
          " لحد ما يوصلون."
        ],
        "arabicAnswer": "عالخط",
        "arabicWrongs": [
          "بالشارع",
          "بالبيت",
          "بالسيارة"
        ],
        "russianHint": "Оставайтесь со мной на линии, пока они не приедут.",
        "russianParts": [
          "Оставайтесь на ",
          " со мной, пока бригада не прибудет."
        ],
        "russianAnswer": "линии",
        "russianWrongs": [
          "связи",
          "месте",
          "телефоне"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "پەیوەندی بە ژمارەی فریاگوزاری (٩١١) دەکەیت",
        "situationAr": "تتصل برقم الطوارئ (٩١١)",
        "theyAsk": "911, what's your emergency?",
        "theyAskAr": "طوارئ ٩١١، شنو الحالة الطارئة عندكم؟",
        "correct": "I need an ambulance — someone is unconscious. My address is 42 Oak Lane. Please hurry!",
        "correctAr": "أحتاج إسعاف — أكو شخص فاقد الوعي. العنوان ٤٢ شارع أوك. استعجلوا فدوة!",
        "wrong1": "Please send an ambulance as soon as possible.",
        "wrong1Ar": "فدوة دزولنا إسعاف بأسرع وقت.",
        "wrong2": "Someone here is unconscious and needs help.",
        "wrong2Ar": "أكو شخص هنا فاقد الوعي ومحتاج مساعدة.",
        "wrong3": "We're at 42 Oak Lane.",
        "wrong3Ar": "إحنا برقم ٤٢ شارع أوك.",
        "explanation": "لە کاتی پەیوەندی فریاگوزاریدا: ناونیشان + جۆری کێشەکە (unconscious) گرنگترین زانیارین",
        "explanationAr": "من تتصل بالطوارئ: العنوان + نوع المشكلة (unconscious) هي أهم المعلومات",
        "situationRu": "Звонок диспетчеру службы спасения 911",
        "theyAskRu": "Служба 911, что у вас произошло?",
        "correctRu": "Мне нужна скорая — человек без сознания. Наш адрес: Оук-лейн, 42. Пожалуйста, скорее!",
        "wrong1Ru": "Я просто проверяю связь.",
        "wrong2Ru": "Ничего страшного, кажется.",
        "wrong3Ru": "Адрес я не помню.",
        "explanationRu": "При звонке в 911 в первую очередь четко называют состояние пострадавшего ('unconscious') и точный адрес."
      },
      {
        "situation": "هاوڕێیەک بریندار بووە و خوێنی لێ دەڕوات",
        "situationAr": "صديقك انجرح ودينزف",
        "theyAsk": "I cut my hand pretty badly — there's a lot of blood.",
        "theyAskAr": "جرحت إيدي حيل — ديطلع دم هواية.",
        "correct": "Keep firm pressure on the wound. I'm calling 911 now—stay still while we wait for help.",
        "correctAr": "اضغط حيل على الجرح. آني دا أتصل بـ ٩١١ هسه — ابقى بمكانك ولا تتحرك لحد ما تجينا مساعدة.",
        "wrong1": "Put a clean cloth on it and keep steady pressure.",
        "wrong1Ar": "خلي وصلة نظيفة واضغط عليها باستمرار.",
        "wrong2": "Let's sit down while I get the first-aid kit.",
        "wrong2Ar": "تعال نكعد بين ما أجيب جنطة الإسعافات.",
        "wrong3": "Keep your hand raised while we wait for help.",
        "wrong3Ar": "ارفع إيدك بين ما ننتظر المساعدة.",
        "explanation": "بۆ خوێنبەربوونی زۆر: یەکسەر فشاری جێگیر بخەرە سەر برینەکە، پەیوەندی بە فریاگوزاری بکە و تا گەیشتنی یارمەتی لەگەڵ کەسەکە بمێنەوە",
        "explanationAr": "من يصير نزيف قوي: اضغط على الجرح حيل، وخابر الطوارئ، وابقى وي المصاب لحد ما توصل المساعدة",
        "situationRu": "Оказание помощи при сильном порезе",
        "theyAskRu": "Я сильно порезал руку — тут очень много крови.",
        "correctRu": "Плотно прижимай повязку к ране. Я уже звоню в 911 — не двигайся, пока ждём скорую.",
        "wrong1Ru": "Просто помой рану водой.",
        "wrong2Ru": "Кровь сама остановится через час.",
        "wrong3Ru": "Ничего страшного, это всего лишь кровь.",
        "explanationRu": "При сильном кровотечении главное действие — прямое постоянное давление на рану ('firm pressure')."
      }
    ],
    "topicRu": "Первая помощь и вызов экстренных служб"
  },
  {
    "topic": "Health Insurance & Billing",
    "topicKu": "دڵنیایی تەندروستی و پسووڵەی پزیشکی",
    "topicAr": "التأمين الصحي وقوائم المستشفى",
    "words": [
      {
        "english": "Do you accept my insurance plan?",
        "kurdish": "ئایا پلانی دڵنیایی تەندروستیی من وەردەگرن؟",
        "arabic": "تقبلون خطة التأمين الصحي مالتي؟",
        "russian": "Вы принимаете мой страховой план?"
      },
      {
        "english": "Is this provider in network?",
        "kurdish": "ئایا ئەم پزیشکە لە تۆڕی دڵنیاییەکەمە؟",
        "arabic": "هذا الدكتور مشمول بشبكة التأمين؟",
        "russian": "Входит ли этот врач в сеть моей страховки (in-network)?"
      },
      {
        "english": "How much is the copay for this visit?",
        "kurdish": "هاوبەشی پارەدان بۆ ئەم سەردانە چەندە؟",
        "arabic": "شكد راح أدفع بهاي الزيارة؟",
        "russian": "Какова фиксированная доплата (copay) за этот приём?"
      },
      {
        "english": "Could I get an itemized bill, please?",
        "kurdish": "تکایە دەتوانم پسووڵەیەکی وردکراوە وەربگرم؟",
        "arabic": "أكدر أحصل فاتورة مفصلة، بلا زحمة؟",
        "russian": "Не могли бы вы предоставить мне детализированный счёт?"
      },
      {
        "english": "Was this claim denied or still pending?",
        "kurdish": "ئایا ئەم داواکارییە ڕەت کرایەوە یان هێشتا چاوەڕوانە؟",
        "arabic": "انرفضت هاي المطالبة لو بعدهم ديدرسوها؟",
        "russian": "Страховая отклонила этот счёт или он ещё на рассмотрении?"
      },
      {
        "english": "Can I set up a payment plan?",
        "kurdish": "دەتوانم پلانی پارەدان دابنێم؟",
        "arabic": "أكدر أسوي خطة دفع (أقساط)؟",
        "russian": "Могу ли я оформить план рассрочки платежа?"
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "What's my deductible for the year?",
        "targetKurdish": "بڕی خۆبەشداریم بۆ ئەم ساڵە چەندە؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "شكد لازم أدفع من جيبي بالسنة؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Какова сумма моей франшизы (deductible) на этот год?"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "This charge doesn't look right to me.",
        "targetKurdish": "ئەم بڕە پارە بەلامەوە دروست نییە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "هاي الفلوس أحسها مو صحيحة.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Эта сумма счёта кажется мне неверной."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Do I need a referral to see a specialist?",
        "targetKurdish": "پێویستم بە ناردنی پزیشکە بۆ بینینی پسپۆڕ؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "أحتاج تحويل حتى أشوف دكتور أخصائي؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Нужно ли мне направление терапевта, чтобы попасть к профильному специалисту?"
      }
    ],
    "sentences": [
      {
        "english": [
          "I",
          "never",
          "received",
          "a",
          "bill",
          "for",
          "that",
          "visit"
        ],
        "kurdish": "هیچ پسووڵەیەک بۆ ئەو سەردانە پێم نەگەیشت.",
        "arabic": "أبد ما استلمت فاتورة لهذيج الزيارة.",
        "russian": "Я так и не получил счёт за тот визит к врачу"
      },
      {
        "english": [
          "Can",
          "you",
          "check",
          "what",
          "my",
          "plan",
          "covers"
        ],
        "kurdish": "دەتوانیت بپشکنیت پلانەکەم چی دەگرێتەوە؟",
        "arabic": "تكدر تتأكد شنو اللي يغطيه التأمين مالتي؟",
        "russian": "Не могли бы вы проверить, что покрывает мой страховой полис?"
      },
      {
        "english": [
          "I'd",
          "like",
          "to",
          "appeal",
          "that",
          "decision"
        ],
        "kurdish": "دەمەوێت تانە لەو بڕیارە بدەم.",
        "arabic": "أريد أقدم استئناف على هذا القرار.",
        "russian": "Я хочу оспорить это решение страховой компании"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Is this doctor in ",
          " with my insurance?"
        ],
        "hint": "ئایا ئەم پزیشکە لە تۆڕی دڵنیاییەکەمدایە؟",
        "answer": "network",
        "wrongs": [
          "networks",
          "networking",
          "networked"
        ],
        "arabicHint": "هذا الدكتور ضمن شبكة التأمين مالتي؟",
        "arabicParts": [
          "هذا الدكتور ضمن ",
          " التأمين مالتي؟"
        ],
        "arabicAnswer": "شبكة",
        "arabicWrongs": [
          "مكتب",
          "عيادة",
          "غرفة"
        ],
        "russianHint": "Входит ли этот врач в сеть моей страховки?",
        "russianParts": [
          "Входит ли этот врач в ",
          " моей страховки?"
        ],
        "russianAnswer": "сеть",
        "russianWrongs": [
          "список",
          "план",
          "базу"
        ]
      },
      {
        "parts": [
          "How much is the ",
          " for today's visit?"
        ],
        "hint": "هاوبەشی پارەدان بۆ سەردانی ئەمڕۆ چەندە؟",
        "answer": "copay",
        "wrongs": [
          "copays",
          "coping",
          "copy"
        ],
        "arabicHint": "شكد راح أدفع لزيارة اليوم؟",
        "arabicParts": [
          "شكد راح ",
          " لزيارة اليوم؟"
        ],
        "arabicAnswer": "أدفع",
        "arabicWrongs": [
          "أركض",
          "أبيع",
          "أشتري"
        ],
        "russianHint": "Сколько составляет доплата (copay) за сегодняшний приём?",
        "russianParts": [
          "Сколько составляет ",
          " за сегодняшний приём?"
        ],
        "russianAnswer": "доплата",
        "russianWrongs": [
          "оплата",
          "взнос",
          "чек"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "پێش دانانی کاتی پزیشک دڵنیایی دەکەیتەوە لە دڵنیایی تەندروستی",
        "situationAr": "تتأكد من التأمين قبل لا تحجز موعد",
        "theyAsk": "Would you like to schedule with Dr. Lee on Tuesday?",
        "theyAskAr": "تحب نحجزلك موعد وي دكتور لي يوم الثلاثاء؟",
        "correct": "Before I schedule, could you confirm whether Dr. Lee is in network and how much my copay will be?",
        "correctAr": "قبل لا أحجز، تكدر تتأكد إذا دكتور لي مشمول بشبكة تأميني وشكد راح أدفع من جيبي؟",
        "wrong1": "Before I book, can you tell me whether you accept my insurance?",
        "wrong1Ar": "قبل ما أحجز، تكدر تكلي إذا تقبلون التأمين مالتي؟",
        "wrong2": "Could you check what my plan covers?",
        "wrong2Ar": "تكدر تتأكد شنو اللي يغطيه تأميني؟",
        "wrong3": "How much does a regular visit usually cost?",
        "wrong3Ar": "المراجعة العادية شكد تكلف بالعالم؟",
        "explanation": "لە ئەمریکادا 'in network' و 'copay' دوو زاراوەی سەرەکین کە پێش سەردان پارەی ڕاستەقینە دیاری دەکەن",
        "explanationAr": "بأمريكا، كلمات 'in network' و 'copay' كلش مهمة حتى تعرف شكد راح تدفع قبل الزيارة",
        "situationRu": "Запись на приём к новому врачу в клинике",
        "theyAskRu": "Хотите записаться к доктору Ли на вторник?",
        "correctRu": "Перед записью уточните, пожалуйста: входит ли доктор Ли в сеть моей страховки и какова будет моя доплата?",
        "wrong1Ru": "Мне не важно, сколько это стоит.",
        "wrong2Ru": "Запишите меня на любой день.",
        "wrong3Ru": "Страховки у меня нет.",
        "explanationRu": "'In network' (в сети) и 'copay' (соплатеж/доплата) — обязательные вопросы для избежания неожиданных счетов."
      },
      {
        "situation": "پسووڵەیەکی پزیشکی گەورەت پێگەیشتووە",
        "situationAr": "وصلتك فاتورة مال مستشفى غالية",
        "theyAsk": "I can see a balance of $640 on your account.",
        "theyAskAr": "طالع عندي بحسابك باقي ٦٤٠ دولار لازم تدفعها.",
        "correct": "Could I get an itemized bill and check whether the insurance claim was denied or is still pending?",
        "correctAr": "أكدر أحصل فاتورة مفصلة، وتتأكدون إذا مطالبة التأمين انرفضت لو بعدها معلقة؟",
        "wrong1": "Could you explain what the $640 charge covers?",
        "wrong1Ar": "تكدر توضحلي الـ ٦٤٠ دولار هاي مال شنو؟",
        "wrong2": "Has my insurance processed this bill yet?",
        "wrong2Ar": "التأمين مالتي مشى هاي الفاتورة لو بعده؟",
        "wrong3": "Is a payment plan available for this balance?",
        "wrong3Ar": "أكو نظام أقساط لهذا المبلغ؟",
        "explanation": "'Itemized bill' هەر خزمەتگوزارییەک بە جیا نیشان دەدات و یارمەتیت دەدات هەڵەی پسووڵە بدۆزیتەوە",
        "explanationAr": "الفاتورة المفصلة تطلعلك كل خدمة وحد وتساعدك تلزم الغلط بالفاتورة",
        "situationRu": "Получение крупного медицинского счета по почте",
        "theyAskRu": "В вашей учетной записи числится задолженность в 640 долларов.",
        "correctRu": "Могу ли я получить детализированный счёт с кодами услуг и узнать, отклонила ли страховая покрытие или вопрос ещё на рассмотрении?",
        "wrong1Ru": "Я заплачу прямо сейчас всю сумму.",
        "wrong2Ru": "Я выкину этот счёт.",
        "wrong3Ru": "Это слишком дёшево.",
        "explanationRu": "Запрос 'itemized bill' (детализированного счёта) часто снижает сумму медицинского счёта или выявляет ошибки биллинга."
      }
    ],
    "topicRu": "Медицинская страховка и счета"
  },
  {
    "topic": "Mental Health Care",
    "topicKu": "چاودێری تەندروستی دەروونی",
    "topicAr": "الصحة النفسية",
    "words": [
      {
        "english": "I'd like to schedule an appointment with a therapist.",
        "kurdish": "دەمەوێت کاتێک لەگەڵ چارەسەرکاری دەروونی دابنێم.",
        "arabic": "أريد أحجز موعد وي دكتور نفسي.",
        "russian": "Я хотел бы записаться на приём к психотерапевту."
      },
      {
        "english": "I've been feeling anxious and overwhelmed lately.",
        "kurdish": "لە دواییانەدا هەست بە نیگەرانی و فشارێکی زۆر دەکەم.",
        "arabic": "أحس بقلق وتعب نفسي هالفترة.",
        "russian": "В последнее время я чувствую постоянную тревогу и перегруженность."
      },
      {
        "english": "It's starting to affect my sleep and work.",
        "kurdish": "خەریکە کاریگەری لە خەو و کارم دەکات.",
        "arabic": "بدى هالشي يأثر على نومي وشغلي.",
        "russian": "Это начинает сказываться на моём сне и работе."
      },
      {
        "english": "I'm not in immediate danger, but I need support.",
        "kurdish": "لە مەترسیی دەستبەجێدا نیم، بەڵام پێویستم بە پشتگیرییە.",
        "arabic": "آني مو بخطر هسه، بس محتاج مساعدة.",
        "russian": "Мне не угрожает непосредственная опасность, но мне нужна поддержка."
      },
      {
        "english": "Is what I share here confidential?",
        "kurdish": "ئایا ئەوەی لێرە دەیڵێم نهێنی دەمێنێتەوە؟",
        "arabic": "الكلام اللي أكوله هنا يبقى سر؟",
        "russian": "Останется ли конфиденциальным всё, чем я здесь поделюсь?"
      },
      {
        "english": "What should I do if my symptoms get worse?",
        "kurdish": "ئەگەر نیشانەکانم خراپتر بوون چی بکەم؟",
        "arabic": "شسوي إذا حالتي صارت أسوأ؟",
        "russian": "Что мне делать, если мои симптомы обострятся?"
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Do you take my insurance for therapy?",
        "targetKurdish": "ئایا دڵنیایی تەندروستیم بۆ چارەسەری دەروونی وەردەگرن؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "تقبلون التأمين مالتي للعلاج النفسي؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Принимаете ли вы мою страховку для оплаты психотерапии?"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I'd prefer someone who does virtual sessions.",
        "targetKurdish": "پێم خۆشترە کەسێک بێت کە دانیشتنی ئۆنڵاین ئەنجام بدات.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "أفضل شخص يسوي جلسات أونلاين.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Я бы предпочёл специалиста, который проводит онлайн-сессии."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "How soon could I get in?",
        "targetKurdish": "چەند زوو دەتوانم کاتێک وەربگرم؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "شوكت أقرب موعد أكدر أحصله؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Как скоро я смогу попасть на первую консультацию?"
      }
    ],
    "sentences": [
      {
        "english": [
          "I've",
          "been",
          "isolating",
          "myself",
          "from",
          "friends"
        ],
        "kurdish": "خۆم لە هاوڕێکانم دوور خستووەتەوە.",
        "arabic": "جنت أعزل روحي عن أصدقائي.",
        "russian": "Я стал отдаляться и закрываться от друзей"
      },
      {
        "english": [
          "Talking",
          "to",
          "someone",
          "would",
          "really",
          "help"
        ],
        "kurdish": "قسەکردن لەگەڵ کەسێک بەڕاستی یارمەتیدەر دەبێت.",
        "arabic": "اذا حجيت وي أحد هالشي راح يفيدني صدك.",
        "russian": "Разговор со специалистом мне действительно поможет"
      },
      {
        "english": [
          "I",
          "want",
          "to",
          "learn",
          "how",
          "to",
          "cope",
          "better"
        ],
        "kurdish": "دەمەوێت فێر بم چۆن باشتر بەرگە بگرم.",
        "arabic": "أريد أتعلم شلون أتأقلم أحسن.",
        "russian": "Я хочу научиться лучше справляться со стрессом"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Is everything I say here kept ",
          " ?"
        ],
        "hint": "ئایا هەموو ئەوەی لێرە دەیڵێم بە نهێنی دەمێنێتەوە؟",
        "answer": "confidential",
        "wrongs": [
          "confidence",
          "confident",
          "confidently"
        ],
        "arabicHint": "كلشي أكوله هنا يبقى سر؟",
        "arabicParts": [
          "كلشي أكوله هنا يبقى ",
          "؟"
        ],
        "arabicAnswer": "سر",
        "arabicWrongs": [
          "معلن",
          "طالع",
          "واضح"
        ],
        "russianHint": "Останется ли всё сказанное мной строго конфиденциальным?",
        "russianParts": [
          "Останется ли всё сказанное мной строго ",
          " ?"
        ],
        "russianAnswer": "конфиденциальным",
        "russianWrongs": [
          "секретным",
          "закрытым",
          "тихим"
        ]
      },
      {
        "parts": [
          "I've been struggling to ",
          " with the stress."
        ],
        "hint": "کێشەم هەبووە لە بەرگەگرتنی فشارەکە.",
        "answer": "cope",
        "wrongs": [
          "coped",
          "coping",
          "copes"
        ],
        "arabicHint": "كاعد أعاني حتى أتحمل الضغط.",
        "arabicParts": [
          "كاعد أعاني حتى ",
          " الضغط."
        ],
        "arabicAnswer": "أتحمل",
        "arabicWrongs": [
          "أزيد",
          "أنسى",
          "أفرح"
        ],
        "russianHint": "Мне тяжело справляться с таким уровнем стресса.",
        "russianParts": [
          "Мне тяжело ",
          " с этим стрессом."
        ],
        "russianAnswer": "справляться",
        "russianWrongs": [
          "бороться",
          "жить",
          "мириться"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "پەیوەندی بە ناوەندێکی تەندروستی دەروونی دەکەیت",
        "situationAr": "تتصل بمركز للصحة النفسية",
        "theyAsk": "Can you briefly tell me what kind of support you're looking for?",
        "theyAskAr": "تكدر تكلي باختصار شنو نوع المساعدة اللي كاعد تدور عليها؟",
        "correct": "I've been feeling anxious and overwhelmed lately, and it's starting to affect my sleep and work. I'd like to speak with a therapist.",
        "correctAr": "أحس بقلق وتعب نفسي هالفترة، وبدى يأثر على نومي وشغلي. أريد أحجي وي دكتور نفسي.",
        "wrong1": "I've been under a lot of stress and would like some support.",
        "wrong1Ar": "عندي ضغط نفسي كلش قوي ومحتاج مساعدة.",
        "wrong2": "I'd like to ask about your therapy services.",
        "wrong2Ar": "حبيت أسأل عن خدمات العلاج النفسي عدكم.",
        "wrong3": "I'm having trouble sleeping and concentrating.",
        "wrong3Ar": "عندي صعوبة بالنوم والتركيز.",
        "explanation": "باشترین وەڵام نیشانەکان، ماوەکە و کاریگەرییان لە ژیانی ڕۆژانە بە ڕوونی دەڵێت",
        "explanationAr": "أحسن جواب يوضح الأعراض وشكد صارلها وتأثيرها بحياتك اليومية",
        "situationRu": "Первое обращение в психологическую службу",
        "theyAskRu": "Не могли бы вы кратко описать, какую поддержку вы ищете?",
        "correctRu": "В последнее время я чувствую тревогу и перегруженность, это мешает сну и работе. Я хотел бы проконсультироваться с психотерапевтом.",
        "wrong1Ru": "Мне никто не может помочь.",
        "wrong2Ru": "У меня нет никаких проблем.",
        "wrong3Ru": "Психотерапия бесполезна.",
        "explanationRu": "Четкое описание симптомов и их влияния на повседневную жизнь ('affect my sleep and work') помогает подобрать нужного специалиста."
      },
      {
        "situation": "چارەسەرکار دەپرسێت ئایا بارودۆخەکەت خێرایە",
        "situationAr": "الدكتور يسألك إذا حالتك مستعجلة",
        "theyAsk": "Are you in immediate danger of hurting yourself or someone else?",
        "theyAskAr": "أكو أي خطر مباشر تأذي بي نفسك أو أحد ثاني؟",
        "correct": "No, I'm not in immediate danger, but I do need support. What should I do if my symptoms get worse?",
        "correctAr": "لا، ماكو خطر مباشر، بس محتاج مساعدة ودعم صدك. شسوي إذا حالتي صارت أسوأ؟",
        "wrong1": "No, but I'd still like the earliest appointment available.",
        "wrong1Ar": "لا، بس همين أريد أقرب موعد متوفر.",
        "wrong2": "I'm safe right now, but I've been struggling.",
        "wrong2Ar": "آني بأمان هسه، بس كاعد أعاني.",
        "wrong3": "No. Could you tell me what support is available?",
        "wrong3Ar": "لا. تكدر تكلي شنو الدعم المتوفر؟",
        "explanation": "وەڵامی ڕاستگۆ و ڕاستەوخۆ یارمەتی پیشەییەکان دەدات ئاستی پێویستییەکەت بە دروستی هەڵبسەنگێنن",
        "explanationAr": "الجواب الصريح والمباشر يساعد الدكاترة يقيمون حالتك ومساعدتك بضبط",
        "situationRu": "Специалист горячей линии оценивает уровень кризиса",
        "theyAskRu": "Угрожает ли вам сейчас непосредственная опасность причинить вред себе или другим?",
        "correctRu": "Нет, непосредственной опасности нет, но поддержка мне очень нужна. Что делать, если состояние ухудшится?",
        "wrong1Ru": "Не знаю, может быть.",
        "wrong2Ru": "Не задавайте таких вопросов.",
        "wrong3Ru": "Мне всё равно.",
        "explanationRu": "Честный и спокойный ответ о безопасности позволяет получить плановую поддержку нужного профиля."
      }
    ],
    "topicRu": "Психологическая помощь"
  },
  {
    "topic": "Preventive Care",
    "topicKu": "چاودێری پێشگیری",
    "topicAr": "الفحوصات الوقائية",
    "words": [
      {
        "english": "I'm due for my annual checkup.",
        "kurdish": "کاتی پشکنینی ساڵانەم هاتووە.",
        "arabic": "إجه وكت فحصي السنوي.",
        "russian": "Мне пора пройти ежегодный профилактический осмотр."
      },
      {
        "english": "Are there any screenings I need at my age?",
        "kurdish": "ئایا لەم تەمەنەدا پێویستم بە هیچ پشکنینێکی پێشوەختە هەیە؟",
        "arabic": "أحتاج أي تحاليل بهالعمر؟",
        "russian": "Нужно ли мне проходить какие-то скрининги в моём возрасте?"
      },
      {
        "english": "Am I up to date on my vaccines?",
        "kurdish": "ئایا هەموو ڤاکسینەکانم لە کاتی خۆیاندا وەرگرتووە؟",
        "arabic": "كل لقاحاتي ماخذها بوكتها؟",
        "russian": "Все ли прививки у меня сделаны вовремя?"
      },
      {
        "english": "What changes would have the biggest impact?",
        "kurdish": "کام گۆڕانکاری زۆرترین کاریگەری دەبێت؟",
        "arabic": "شنو التغييرات اللي راح تفيدني أكثر شي؟",
        "russian": "Какие изменения в образе жизни дадут наибольший оздоровительный эффект?"
      },
      {
        "english": "When should I schedule my next screening?",
        "kurdish": "کەی پشکنینی داهاتووم دابنێم؟",
        "arabic": "شوكت لازم أحجز موعد فحصي الجاي؟",
        "russian": "Когда мне следует записаться на следующий скрининг?"
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I skipped my checkup last year, honestly.",
        "targetKurdish": "بەڕاستی ساڵی ڕابردوو پشکنینەکەم نەکرد.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "بصراحة، ما سويت فحصي مال العام.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Честно говоря, в прошлом году я пропустил плановый чекап."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I've cut way back on soda.",
        "targetKurdish": "زۆر کەمم کردووەتەوە لە خواردنەوەی گازدار.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "كلش قللت من المشروبات الغازية (البيبسي).",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Я сильно сократил потребление сладкой газировки."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I walk about three miles a day now.",
        "targetKurdish": "ئێستا ڕۆژانە نزیکەی پێنج کیلۆمەتر پیاسە دەکەم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "هسه كمت أمشي حوالي خمس كيلومترات باليوم.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Сейчас я прохожу пешком около пяти километров каждый день."
      }
    ],
    "sentences": [
      {
        "english": [
          "My",
          "dad",
          "had",
          "heart",
          "problems",
          "in",
          "his",
          "fifties"
        ],
        "kurdish": "باوکم لە پەنجاکانیدا کێشەی دڵی هەبوو.",
        "arabic": "أبوية جان عنده مشاكل بالقلب بالخمسينات من عمره.",
        "russian": "У моего отца были проблемы с сердцем после пятидесяти"
      },
      {
        "english": [
          "I'd",
          "like",
          "to",
          "get",
          "my",
          "cholesterol",
          "checked"
        ],
        "kurdish": "دەمەوێت کۆلیسترۆلم بپشکنرێت.",
        "arabic": "أريد أفحص الكوليسترول مالتي.",
        "russian": "Я бы хотел сдать анализ на уровень холестерина"
      },
      {
        "english": [
          "Sleep",
          "is",
          "honestly",
          "my",
          "biggest",
          "problem"
        ],
        "kurdish": "بەڕاستی خەو گەورەترین کێشەمە.",
        "arabic": "بصراحة النوم هو أكبر مشكلة عندي.",
        "russian": "Качественный сон — честно говоря, моя главная проблема"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "I'm ",
          " for my annual physical this month."
        ],
        "hint": "ئەم مانگە کاتی پشکنینی ساڵانەم هاتووە.",
        "answer": "due",
        "wrongs": [
          "dues",
          "duly",
          "dued"
        ],
        "arabicHint": "إجه وكت فحصي السنوي هذا الشهر.",
        "arabicParts": [
          "إجه وكت فحصي السنوي هذا ",
          "."
        ],
        "arabicAnswer": "الشهر",
        "arabicWrongs": [
          "البيت",
          "الشارع",
          "الدرس"
        ],
        "russianHint": "В этом месяце мне пора пройти ежегодный медосмотр.",
        "russianParts": [
          "В этом месяце мне пора пройти ежегодный ",
          " ."
        ],
        "russianAnswer": "медосмотр",
        "russianWrongs": [
          "осмотр",
          "тест",
          "приём"
        ]
      },
      {
        "parts": [
          "High blood pressure ",
          " in my family."
        ],
        "hint": "فشاری خوێنی بەرز لە خێزانەکەماندا باوە.",
        "answer": "runs",
        "wrongs": [
          "run",
          "running",
          "ran"
        ],
        "arabicHint": "الضغط العالي منتشر بعائلتنا.",
        "arabicParts": [
          "الضغط العالي ",
          " بعائلتنا."
        ],
        "arabicAnswer": "منتشر",
        "arabicWrongs": [
          "ممنوع",
          "غالي",
          "مفقود"
        ],
        "russianHint": "Высокое артериальное давление — это семейное у нас.",
        "russianParts": [
          "Повышенное давление — это ",
          " черта в семье."
        ],
        "russianAnswer": "семейная",
        "russianWrongs": [
          "частая",
          "простая",
          "личная"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لە پشکنینی ساڵانەداییت",
        "situationAr": "أنت دتسوي فحصك السنوي",
        "theyAsk": "Is there anything in your family history we should discuss?",
        "theyAskAr": "أكو أي مرض وراثي بالعائلة لازم نحجي عنه؟",
        "correct": "Yes, high blood pressure runs in my family. Are there any screenings I need at my age?",
        "correctAr": "إي، الضغط العالي وراثي بعائلتنا. أكو أي فحوصات دورية أحتاجها بهالعمر؟",
        "wrong1": "Several relatives have high blood pressure.",
        "wrong1Ar": "كم واحد من كرايبي عندهم ضغط عالي.",
        "wrong2": "I'd like to know which tests you recommend.",
        "wrong2Ar": "أريد أعرف شنو التحاليل اللي تنصح بيها.",
        "wrong3": "I haven't had any major health problems.",
        "wrong3Ar": "ما جانت عندي أي مشاكل صحية جبيرة.",
        "explanation": "'Runs in my family' دەربڕینێکی زۆر باوی ئەمریکییە بۆ نەخۆشی یان دۆخێکی بۆماوەیی",
        "explanationAr": "'Runs in my family' مصطلح أمريكي معروف للأمراض الوراثية بالعائلة",
        "situationRu": "На ежегодном профилактическом приеме у терапевта",
        "theyAskRu": "Есть ли в истории болезней вашей семьи что-то, что нам стоит учесть?",
        "correctRu": "Да, у нас в семье распространена гипертония. Есть ли скрининги или обследования, которые мне положены по возрасту?",
        "wrong1Ru": "Моя семья никогда не болела.",
        "wrong2Ru": "Я ничего не знаю о родственниках.",
        "wrong3Ru": "Семейная история не имеет значения.",
        "explanationRu": "'Runs in my family' указывает на наследственную предрасположенность к болезням."
      },
      {
        "situation": "پزیشک پێشنیاری گۆڕینی شێوازی ژیان دەکات",
        "situationAr": "الدكتور يقترح تغيرات بنمط حياتك",
        "theyAsk": "More exercise and better sleep would both help.",
        "theyAskAr": "الرياضة الأكثر والنوم الأحسن ثنينهم راح يفيدوك.",
        "correct": "That makes sense. Which change would have the biggest impact, and what is a realistic first step?",
        "correctAr": "كلام منطقي. يا تغيير راح يكون إله أكبر أثر، وشنو أول خطوة واقعية أكدر أبدأ بيها؟",
        "wrong1": "Which change should I focus on first?",
        "wrong1Ar": "يا تغيير لازم أركز عليه بالبداية؟",
        "wrong2": "How much exercise would you recommend?",
        "wrong2Ar": "شكد رياضة تنصحني أسوي؟",
        "wrong3": "Could we set one goal for the next month?",
        "wrong3Ar": "نكدر نحدد هدف واحد للشهر الجاي؟",
        "explanation": "پرسیارکردن لە 'realistic first step' ڕاوێژێکی گشتی دەگۆڕێت بۆ کردارێکی دیاریکراو",
        "explanationAr": "السؤال عن 'خطوة أولى واقعية' يحول النصيحة لشي تكدر تسويه صدك",
        "situationRu": "Врач советует скорректировать образ жизни",
        "theyAskRu": "Больше физической активности и здоровый сон пойдут вам на пользу.",
        "correctRu": "Логично. Какое из изменений даст максимальный эффект и с какого реалистичного шага лучше начать?",
        "wrong1Ru": "Я не буду ничего менять.",
        "wrong2Ru": "Спорт вреден для здоровья.",
        "wrong3Ru": "Дайте мне просто таблетку.",
        "explanationRu": "Вопрос о 'realistic first step' превращает общие рекомендации в конкретный выполнимый план оздоровления."
      }
    ],
    "topicRu": "Профилактика и чекап"
  },
  {
    "topic": "Managing Ongoing Conditions",
    "topicKu": "بەڕێوەبردنی دۆخی تەندروستی بەردەوام",
    "topicAr": "متابعة الأمراض المزمنة",
    "words": [
      {
        "english": "My symptoms have been stable since my last visit.",
        "kurdish": "لە دوای دوا سەردانەوە نیشانەکانم جێگیر بوون.",
        "arabic": "أعراضي مستقرة من آخر مراجعة.",
        "russian": "С прошлого визита мои симптомы остаются стабильными."
      },
      {
        "english": "I've been tracking my blood pressure at home.",
        "kurdish": "لە ماڵەوە فشاری خوێنم تۆمار دەکەم.",
        "arabic": "كاعد أتابع ضغطي بالبيت.",
        "russian": "Я веду регулярный дневник давления дома."
      },
      {
        "english": "I missed two doses last week.",
        "kurdish": "هەفتەی ڕابردوو دوو جار دەرمانەکەم لەبیر چوو.",
        "arabic": "نسيت جرعتين الأسبوع الفات.",
        "russian": "На прошлой неделе я пропустил два приёма таблеток."
      },
      {
        "english": "This medication makes me feel tired.",
        "kurdish": "ئەم دەرمانە هەستم بە ماندوویی دەکات.",
        "arabic": "هذا الدوة يخليني أحس بتعب.",
        "russian": "От этого лекарства я чувствую сильную сонливость."
      },
      {
        "english": "Should we adjust the dose or timing?",
        "kurdish": "ئایا پێویستە بڕ یان کاتی دەرمانەکە بگۆڕین؟",
        "arabic": "لازم نغير الجرعة لو وكتها؟",
        "russian": "Стоит ли нам скорректировать дозировку или время приёма?"
      },
      {
        "english": "What warning signs should I watch for?",
        "kurdish": "ئاگاداری کام نیشانە مەترسیدارانە بم؟",
        "arabic": "شنو العلامات الخطر اللي لازم أنتبه عليها؟",
        "russian": "На какие тревожные симптомы мне следует обращать внимание?"
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "The morning dose knocks me out.",
        "targetKurdish": "دۆزی بەیانی بێهێزم دەکات.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "جرعة الصبح تهد حيلي.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Утренняя доза буквально сбивает меня с ног от усталости."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "My numbers have been creeping up.",
        "targetKurdish": "ژمارەکانم بەرەبەرە بەرز دەبنەوە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "أرقامي كاعد تصعد شوية شوية.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Показатели сахара в крови постепенно ползут вверх."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I keep a log on my phone.",
        "targetKurdish": "تۆمارێک لەسەر مۆبایلەکەم هەڵدەگرم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "مسوي سجل بموبايلي.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Я веду подробный журнал измерений в телефоне."
      }
    ],
    "sentences": [
      {
        "english": [
          "It's",
          "been",
          "manageable",
          "most",
          "days"
        ],
        "kurdish": "زۆربەی ڕۆژان بەڕێوەبردنی کراوە.",
        "arabic": "أكدر أتحمله بأكثر الأيام.",
        "russian": "В большинстве дней с этим вполне можно жить"
      },
      {
        "english": [
          "I",
          "can",
          "send",
          "you",
          "the",
          "readings",
          "before",
          "my",
          "visit"
        ],
        "kurdish": "دەتوانم پێش سەردانەکەم ئەنجامەکانت بۆ بنێرم.",
        "arabic": "أكدر أدزلك القراءات قبل ما أجيك.",
        "russian": "Я могу прислать вам показатели измерений до консультации"
      },
      {
        "english": [
          "I'd",
          "rather",
          "not",
          "add",
          "another",
          "pill"
        ],
        "kurdish": "پێم خۆش نییە حەبێکی تر زیاد بکەم.",
        "arabic": "أفضل ما أضيف حباية ثانية.",
        "russian": "Я бы предпочёл не добавлять ещё одну таблетку в схему"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "I ",
          " two doses last week by accident."
        ],
        "hint": "هەفتەی ڕابردوو بە هەڵە دوو دۆزم لەبیر چوو.",
        "answer": "missed",
        "wrongs": [
          "miss",
          "missing",
          "misses"
        ],
        "arabicHint": "نسيت جرعتين الأسبوع الفات بدون قصد.",
        "arabicParts": [
          "نسيت ",
          " الأسبوع الفات بدون قصد."
        ],
        "arabicAnswer": "جرعتين",
        "arabicWrongs": [
          "دينارين",
          "يومين",
          "ساعتين"
        ],
        "russianHint": "На прошлой неделе я случайно пропустил две дозы препарата.",
        "russianParts": [
          "На прошлой неделе я случайно ",
          " две дозы."
        ],
        "russianAnswer": "пропустил",
        "russianWrongs": [
          "забыл",
          "потерял",
          "бросил"
        ]
      },
      {
        "parts": [
          "Should we ",
          " the dose or change the timing?"
        ],
        "hint": "ئایا بڕەکە ڕێک بخەین یان کاتەکەی بگۆڕین؟",
        "answer": "adjust",
        "wrongs": [
          "adjusts",
          "adjusted",
          "adjusting"
        ],
        "arabicHint": "نغير الجرعة لو نبدل وكتها؟",
        "arabicParts": [
          "نغير ",
          " لو نبدل وكتها؟"
        ],
        "arabicAnswer": "الجرعة",
        "arabicWrongs": [
          "المستشفى",
          "الدكتور",
          "البيت"
        ],
        "russianHint": "Стоит ли нам скорректировать дозу или изменить время приёма?",
        "russianParts": [
          "Стоит ли нам ",
          " дозировку препарата?"
        ],
        "russianAnswer": "скорректировать",
        "russianWrongs": [
          "изменить",
          "снять",
          "поднять"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "پزیشک دەپرسێت دەرمانەکەت چۆن بەکاردەهێنیت",
        "situationAr": "الدكتور يسألك عن التزامك بالدوة",
        "theyAsk": "Have you been able to take the medication every day?",
        "theyAskAr": "كدرت تاخذ الدوة كل يوم بانتظام؟",
        "correct": "Most days, yes, but I missed two doses last week. This medication also makes me feel tired.",
        "correctAr": "أكثر الأيام إي، بس نسيت جرعتين الأسبوع الفات. وهمين هذا الدوة ديخليني أحس بتعب وخمول.",
        "wrong1": "I usually take it, but I missed a couple of doses.",
        "wrong1Ar": "عادة آخذه، بس نسيت كم جرعة.",
        "wrong2": "I've noticed some fatigue since I started it.",
        "wrong2Ar": "لاحظت شوية تعب من بديت آخذه.",
        "wrong3": "I try to take it at the same time each day.",
        "wrong3Ar": "أحاول آخذه بنفس الوقت كل يوم.",
        "explanation": "پزیشک پێویستی بە زانیاری ڕاستەقینەی دۆز و کاریگەریی لاوەکی هەیە؛ شاردنەوەی دۆزی لەبیرکراو یارمەتیدەر نییە",
        "explanationAr": "الدكتور يحتاج معلومات مضبوطة عن الجرعات والأعراض الجانبية؛ إذا ضميت الجرعات المنسية ما راح يفيد",
        "situationRu": "Врач проверяет соблюдение режима приёма терапии",
        "theyAskRu": "Удается ли вам принимать лекарство каждый день без пропусков?",
        "correctRu": "Почти всегда да, но на прошлой неделе я пропустил два приёма. Кроме того, от этого препарата я постоянно чувствую вялость.",
        "wrong1Ru": "Я бросил пить лекарства совсем.",
        "wrong2Ru": "Принимаю когда вспомню раз в месяц.",
        "wrong3Ru": "Никогда ничего не пропускаю.",
        "explanationRu": "Честное признание пропусков ('missed two doses') помогает врачу скорректировать дозу без вреда здоровью."
      },
      {
        "situation": "لە سەردانی بەدواداچووندا داتای ماڵەوە پیشان دەدەیت",
        "situationAr": "تراوي قراءاتك مال البيت بمراجعتك",
        "theyAsk": "How has your blood pressure been since we last met?",
        "theyAskAr": "شلون كان ضغطك من آخر مرة التقينا بيها؟",
        "correct": "I've been tracking it at home. It's mostly stable, but it was higher than usual three times this week.",
        "correctAr": "كاعد أقيسه بالبيت. أغلبه مستقر، بس صعد أعلى من الطبيعي تلاث مرات هذا الأسبوع.",
        "wrong1": "It's usually stable, but I noticed a few higher readings.",
        "wrong1Ar": "هو بالعالم مستقر، بس لاحظت كم قراءة عالية.",
        "wrong2": "I brought my home readings with me.",
        "wrong2Ar": "جبت قراءاتي مال البيت وياي.",
        "wrong3": "The numbers vary depending on the time of day.",
        "wrong3Ar": "الأرقام تختلف حسب وقت اليوم.",
        "explanation": "ژمارە، دووبارەبوونەوە و ماوە زانیارییە گشتییەکان دەگۆڕن بۆ داتای بەکارهاتوو بۆ پزیشک",
        "explanationAr": "الأرقام وكم مرة والمدة تحول الكلام العام لمعلومات تفيد الدكتور",
        "situationRu": "Контрольный осмотр хронического заболевания",
        "theyAskRu": "Как вело себя ваше артериальное давление со времени нашей прошлой встречи?",
        "correctRu": "Я регулярно вел дневник замеров дома. В целом показатели стабильны, но трижды за эту неделю давление поднималось выше нормы.",
        "wrong1Ru": "Я ни разу не мерил давление.",
        "wrong2Ru": "Давление как давление.",
        "wrong3Ru": "Тонометр сломался.",
        "explanationRu": "Данные домашнего мониторинга ('tracking at home') дают врачу объективную картину между приемами."
      }
    ],
    "topicRu": "Контроль хронических заболеваний"
  },
  {
    "topic": "Recovery & Caregiving",
    "topicKu": "چاکبوونەوە و چاودێریکردنی نەخۆش",
    "topicAr": "التعافي والمداراة",
    "words": [
      {
        "english": "What activities should I avoid while I recover?",
        "kurdish": "لە کاتی چاکبوونەوەدا خۆم لە کام چالاکییانە بدزەمەوە؟",
        "arabic": "شنو الأشياء اللي لازم أتجنبها فترة العلاج؟",
        "russian": "Каких нагрузок мне следует избегать во время реабилитации?"
      },
      {
        "english": "How often should I change the dressing?",
        "kurdish": "چەند جار جلەسەرپێچەکە بگۆڕم؟",
        "arabic": "كم مرة لازم أبدل الضماد؟",
        "russian": "Как часто мне нужно менять повязку?"
      },
      {
        "english": "The swelling has gone down since yesterday.",
        "kurdish": "ئاوسانەکە لە دوێنێوە کەمتر بووە.",
        "arabic": "الورم خف من البارحة.",
        "russian": "Отёк заметно спал со вчерашнего дня."
      },
      {
        "english": "Call me if the pain gets worse.",
        "kurdish": "ئەگەر ئازارەکە خراپتر بوو پەیوەندیم پێوە بکە.",
        "arabic": "خابرني إذا زاد الوجع.",
        "russian": "Позвони мне, если боль начнет усиливаться."
      },
      {
        "english": "Do you need help getting around the house?",
        "kurdish": "ئایا بۆ جووڵانەوە لە ماڵدا پێویستت بە یارمەتییە؟",
        "arabic": "تحتاج مساعدة حتى تمشي بالبيت؟",
        "russian": "Тебе помочь дойти до кухни или комнаты?"
      },
      {
        "english": "Let's write down the discharge instructions.",
        "kurdish": "با ڕێنماییەکانی دەرچوون لە نەخۆشخانە بنووسینەوە.",
        "arabic": "خلي نكتب تعليمات الطلعة من المستشفى.",
        "russian": "Давайте запишем все выписные рекомендации врача."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "When can I drive again?",
        "targetKurdish": "کەی دەتوانمەوە شۆفێری بکەم؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "شوكت أكدر أسوق مرة ثانية؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Когда мне можно будет снова сесть за руль?"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I can pick up your groceries this week.",
        "targetKurdish": "ئەم هەفتەیە دەتوانم کەلوپەلی خواردنت بۆ بکڕم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "أكدر أتسوكلك هذا الأسبوع.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Я могу заехать в магазин за продуктами для тебя на этой неделе."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Are you comfortable, or do you need another pillow?",
        "targetKurdish": "ئاسوودەیت، یان سەرینێکی تر دەوێت؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "مرتاح هيج، لو تحتاج مخدة ثانية؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Тебе удобно лежать или подложить ещё одну подушку?"
      }
    ],
    "sentences": [
      {
        "english": [
          "I'll",
          "set",
          "an",
          "alarm",
          "for",
          "your",
          "next",
          "dose"
        ],
        "kurdish": "کاتژمێرێک بۆ دۆزی داهاتووت دادەنێم.",
        "arabic": "راح أوقت منبه لجرعتك الجاية.",
        "russian": "Я заведу будильник к следующему приёму твоего лекарства"
      },
      {
        "english": [
          "You're",
          "getting",
          "stronger",
          "every",
          "day"
        ],
        "kurdish": "ڕۆژ لەدوای ڕۆژ بەهێزتر دەبیت.",
        "arabic": "كاعد تصير أقوى يوم بعد يوم.",
        "russian": "Ты крепнешь с каждым днём"
      },
      {
        "english": [
          "Don't",
          "push",
          "yourself",
          "too",
          "hard",
          "yet"
        ],
        "kurdish": "هێشتا خۆت زۆر ماندوو مەکە.",
        "arabic": "لا تتعب نفسك هواية هسه.",
        "russian": "Не перенапрягайся пока что слишком сильно"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "The swelling has gone ",
          " a lot since yesterday."
        ],
        "hint": "ئاوسانەکە لە دوێنێوە زۆر کەم بووەتەوە.",
        "answer": "down",
        "wrongs": [
          "downs",
          "downed",
          "downing"
        ],
        "arabicHint": "الورم خف كلش من البارحة.",
        "arabicParts": [
          "الورم ",
          " كلش من البارحة."
        ],
        "arabicAnswer": "خف",
        "arabicWrongs": [
          "زاد",
          "طفر",
          "رجع"
        ],
        "russianHint": "Отёк заметно спал со вчерашнего дня.",
        "russianParts": [
          "Отёк заметно ",
          " со вчерашнего дня."
        ],
        "russianAnswer": "спал",
        "russianWrongs": [
          "ушёл",
          "прошёл",
          "упал"
        ]
      },
      {
        "parts": [
          "Let's go over the ",
          " instructions together."
        ],
        "hint": "با پێکەوە ڕێنماییەکانی دەرچوون بخوێنینەوە.",
        "answer": "discharge",
        "wrongs": [
          "discharged",
          "discharges",
          "discharging"
        ],
        "arabicHint": "خلي نراجع تعليمات الطلعة من المستشفى سوة.",
        "arabicParts": [
          "خلي نراجع تعليمات ",
          " من المستشفى سوة."
        ],
        "arabicAnswer": "الطلعة",
        "arabicWrongs": [
          "النومة",
          "الدخلة",
          "العملية"
        ],
        "russianHint": "Давай вместе внимательно изучим выписные рекомендации.",
        "russianParts": [
          "Давай разберём выписные ",
          " вместе."
        ],
        "russianAnswer": "рекомендации",
        "russianWrongs": [
          "советы",
          "записки",
          "правила"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "پێش دەرچوون لە نەخۆشخانە ڕێنمایی وەردەگریت",
        "situationAr": "تستلم التعليمات قبل لا تطلع من المستشفى",
        "theyAsk": "You can go home today. Do you have any questions?",
        "theyAskAr": "تكدر تطلع للبيت اليوم. عندك أي سؤال؟",
        "correct": "Yes. What activities should I avoid, how often should I change the dressing, and what warning signs mean I should call?",
        "correctAr": "إي. شنو النشاطات اللي لازم أتجنبها، كم مرة أبدل الضماد، وشنو علامات الخطر اللي لازم أخابركم عليها؟",
        "wrong1": "Could you go over the recovery instructions once more?",
        "wrong1Ar": "تكدر تراجع وياي تعليمات التعافي مرة ثانية؟",
        "wrong2": "When can I return to my normal routine?",
        "wrong2Ar": "شوكت أكدر أرجع لروتيني الطبيعي؟",
        "wrong3": "Who should I call if I have a problem?",
        "wrong3Ar": "منو أخابر إذا صارت عندي مشكلة؟",
        "explanation": "پرسیاری باش سێ شت ڕوون دەکاتەوە: سنووری چالاکی، چاودێری برین و نیشانەکانی پەیوەندیکردنی خێرا",
        "explanationAr": "السؤال الزين يوضح ثلاث أشياء: حدود الحركة، الاهتمام بالجرح، والعلامات اللي لازم تخابر بيها",
        "situationRu": "Выписка из стационара после операции",
        "theyAskRu": "Сегодня вы можете ехать домой. Есть ли у вас какие-то вопросы?",
        "correctRu": "Да. Каких движений и нагрузок мне избегать, как часто менять повязку и при каких симптомах срочно звонить в клинику?",
        "wrong1Ru": "Вопросов нет, я побежал играть в футбол.",
        "wrong2Ru": "Выпишите меня молча.",
        "wrong3Ru": "Я не хочу домой.",
        "explanationRu": "Три главных вопроса при выписке: ограничения подвижности, уход за швом/раной и красные флаги для тревоги."
      },
      {
        "situation": "چاودێری کەسێکی خێزان دەکەیت کە لە نەشتەرگەری چاک دەبێتەوە",
        "situationAr": "تداري واحد من قرايبك مسوي عملية",
        "theyAsk": "I hate asking for help, but moving around still hurts.",
        "theyAskAr": "ما أحب أطلب مساعدة، بس الحركة بعدهي تأذيني.",
        "correct": "You don't have to do everything alone. Do you need help getting around the house or picking up your medication?",
        "correctAr": "مو لازم تسوي كلشي وحدك. تحتاج مساعدة حتى تتحرك بالبيت أو أجيبلك دواك؟",
        "wrong1": "Let me know which task would help the most.",
        "wrong1Ar": "كلي يا شغلة تساعدك أكثر شي.",
        "wrong2": "I can stay for a while if you'd like.",
        "wrong2Ar": "أكدر أبقى شوية إذا تحب.",
        "wrong3": "We can take things one step at a time.",
        "wrong3Ar": "نكدر نمشي خطوة خطوة على كيفنا.",
        "explanation": "پێشنیاری دیاریکراو وەک گواستنەوە یان وەرگرتنی دەرمان لە 'ئەگەر شتێکت ویست پێم بڵێ' بەسوودترە",
        "explanationAr": "من تعرض مساعدة بشي معين مثل المشية لو تجيبله الدوة أحسن من ما تكول 'كلي إذا تحتاج شي'",
        "situationRu": "Помощь восстанавливающемуся после болезни члену семьи",
        "theyAskRu": "Терпеть не могу просить о помощи, но передвигаться всё ещё больно.",
        "correctRu": "Тебе не нужно справляться в одиночку. Помочь тебе передвигаться по дому или сходить в аптеку за лекарствами?",
        "wrong1Ru": "Вставай и иди сам.",
        "wrong2Ru": "Ты слишком капризный.",
        "wrong3Ru": "Мне некогда помогать.",
        "explanationRu": "Предложение конкретных видов помощи ('help getting around' / 'picking up medication') снимает с больного неловкость."
      }
    ],
    "topicRu": "Восстановление и уход за больным"
  }
];

export default unit10;
