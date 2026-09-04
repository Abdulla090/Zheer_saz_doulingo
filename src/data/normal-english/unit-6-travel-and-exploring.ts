import { UnitBank } from "../types";

// ── Visible Unit 9: Travel & Exploring — 10 unique lessons ───────────────────
// Advanced travel vocabulary for navigating airports, cities, emergencies, and new cultures.

const normalUnit05: UnitBank = [
  {
    "topic": "Immigration & Customs",
    "topicKu": "پاسپۆرت و گومرگ (لە فڕۆکەخانە)",
    "topicAr": "الهجرة والكمارك",
    "words": [
      {
        "english": "Purpose of your visit",
        "kurdish": "مەبەست لە سەردانەکەت (گەشتەکەت)",
        "arabic": "شنو الغرض من زيارتك",
        "russian": "Цель вашего визита"
      },
      {
        "english": "Declare anything",
        "kurdish": "ئاشکراکردنی شتێک (بۆ گومرگ - شتێک کە باجی لەسەرە)",
        "arabic": "عندك شي تصرح عنه",
        "russian": "Декларировать что-либо (подлежащее пошлине)"
      },
      {
        "english": "Duration of stay",
        "kurdish": "ماوەی مانەوە",
        "arabic": "شكد راح تبقى",
        "russian": "Срок пребывания"
      },
      {
        "english": "Connecting flight",
        "kurdish": "گەشتی ترانزێت (گۆڕینی فڕۆکە)",
        "arabic": "رحلة ترانزيت",
        "russian": "Стыковочный рейс (пересадка)"
      },
      {
        "english": "Return ticket",
        "kurdish": "بلیتی گەڕانەوە",
        "arabic": "تكت رجعة",
        "russian": "Обратный билет"
      }
    ],
    "voices": [
      {
        "prompt": "پرسیاری پاسەوانی سنوور",
        "target": "What is the purpose of your visit to this country?",
        "targetKurdish": "مەبەست لە سەردانەکەت بۆ ئەم وڵاتە چییە؟",
        "promptAr": "سؤال شرطة الحدود",
        "targetArabic": "شنو الغرض من زيارتك لهل بلد؟",
        "promptRu": "Вопрос пограничника",
        "targetRussian": "Какова цель вашего визита в эту страну?"
      },
      {
        "prompt": "ئاماژەدان بە کاتی گەڕانەوە",
        "target": "I have a return ticket for the 15th of next month.",
        "targetKurdish": "بلیتی گەڕانەوەم هەیە بۆ ڕۆژی ١٥ی مانگی داهاتوو.",
        "promptAr": "توضيح وقت الرجعة",
        "targetArabic": "عندي تكت رجعة يوم 15 بالشهر الجاي.",
        "promptRu": "Указать дату возвращения",
        "targetRussian": "У меня есть обратный билет на 15-е число следующего месяца."
      }
    ],
    "sentences": [
      {
        "english": [
          "Do",
          "you",
          "have",
          "anything",
          "to",
          "declare",
          "at",
          "customs"
        ],
        "kurdish": "ئایا هیچ شتێکت پێیە کە پێویست بکات لە گومرگ ئاشکرای بکەیت؟",
        "arabic": "عندك شي تصرح عنه بالكمارك؟",
        "russian": "У вас есть что декларировать на таможне?"
      },
      {
        "english": [
          "My",
          "duration",
          "of",
          "stay",
          "will",
          "be",
          "two",
          "weeks"
        ],
        "kurdish": "ماوەی مانەوەکەم دوو هەفتە دەبێت",
        "arabic": "راح أبقى أسبوعين",
        "russian": "Срок моего пребывания составит две недели."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "I am here on vacation. The",
          "of my visit is tourism."
        ],
        "hint": "بۆ پشوو لێرەم. مەبەست لە گەشتەکەم گەشتیارییە.",
        "answer": "purpose",
        "wrongs": [
          "reason",
          "way",
          "idea"
        ],
        "arabicHint": "أني هنا بإجازة. الغرض من زيارتي هو السياحة.",
        "arabicParts": [
          "أني هنا بإجازة.",
          "من زيارتي هو السياحة."
        ],
        "arabicAnswer": "الغرض",
        "arabicWrongs": [
          "السبب",
          "الطريقة",
          "الفكرة"
        ],
        "russianHint": "Я здесь в отпуске. Цель моего визита — туризм.",
        "russianParts": [
          "Я здесь в отпуске. ",
          " моего визита — туризм."
        ],
        "russianAnswer": "Цель",
        "russianWrongs": [
          "Причина",
          "Способ",
          "Идея"
        ]
      },
      {
        "parts": [
          "I need to catch my",
          "flight to London at gate 4."
        ],
        "hint": "پێویستە بگەڕێمەوە بە گەشتی ترانزێتەکەم (گۆڕینی فڕۆکەکەم) بۆ لەندەن لە دەروازەی ٤.",
        "answer": "connecting",
        "wrongs": [
          "second",
          "next",
          "moving"
        ],
        "arabicHint": "لازم ألحگ على رحلة الترانزيت للندن ببوابة 4.",
        "arabicParts": [
          "لازم ألحگ على رحلة",
          "مالتي للندن ببوابة 4."
        ],
        "arabicAnswer": "الترانزيت",
        "arabicWrongs": [
          "الثانية",
          "التالية",
          "المتحركة"
        ],
        "russianHint": "Мне нужно успеть на стыковочный рейс в Лондон у выхода 4.",
        "russianParts": [
          "Мне нужно успеть на свой ",
          " рейс в Лондон у выхода 4."
        ],
        "russianAnswer": "стыковочный",
        "russianWrongs": [
          "второй",
          "следующий",
          "быстрый"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لە بەردەم ئەفسەری پاسپۆرت",
        "theyAsk": "Welcome. May I see your passport? What is the purpose of your visit?",
        "correct": "Here is my passport. The purpose of my visit is tourism. My duration of stay is exactly two weeks.",
        "wrong1": "I'm here on vacation for two weeks.",
        "wrong2": "I'm visiting the country as a tourist.",
        "wrong3": "I'll be staying for exactly two weeks.",
        "explanation": "'Purpose of your visit' و 'duration of stay' پرسیارە فەرمییەکانی هەموو فڕۆکەخانەیەکن",
        "situationAr": "كبال ضابط الجوازات",
        "theyAskAr": "أهلاً وسهلاً. أگدر أشوف جواز سفرك؟ شنو الغرض من زيارتك؟",
        "correctAr": "تفضل هذا جوازي. الغرض من زيارتي هو السياحة. ومدة إقامتي راح تكون أسبوعين بالضبط.",
        "wrong1Ar": "أني هنا بإجازة لمدة أسبوعين.",
        "wrong2Ar": "أني دي أزور البلد كسائح.",
        "wrong3Ar": "راح أبقى أسبوعين بالضبط.",
        "explanationAr": "'شنو الغرض من زيارتك' و 'شكد راح تبقى' هي أسئلة رسمية بكل المطارات",
        "situationRu": "Перед сотрудником паспортного контроля",
        "theyAskRu": "Добро пожаловать. Могу я взглянуть на ваш паспорт? Какова цель вашего визита?",
        "correctRu": "Вот мой паспорт. Цель моего визита — туризм. Срок моего пребывания — ровно две недели.",
        "wrong1Ru": "Я здесь в отпуске на две недели.",
        "wrong2Ru": "Я посещаю страну как турист.",
        "wrong3Ru": "Я пробуду здесь ровно две недели.",
        "explanationRu": "'Purpose of your visit' (цель визита) и 'duration of stay' (срок пребывания) — стандартные официальные вопросы в любом аэропорту."
      }
    ],
    "topicRu": "Иммиграционный и таможенный контроль"
  },
  {
    "topic": "Renting a Car",
    "topicKu": "کرێکردنی ئۆتۆمبێل (لە دەرەوەی وڵات)",
    "topicAr": "تأجير سيارة",
    "words": [
      {
        "english": "International driving permit",
        "kurdish": "مۆڵەتی شۆفێریی نێودەوڵەتی",
        "arabic": "إجازة سوق دولية",
        "russian": "Международное водительское удостоверение"
      },
      {
        "english": "Full coverage insurance",
        "kurdish": "دڵنیایی (تەئمینی) گشتگیر",
        "arabic": "تأمين شامل",
        "russian": "Полная страховка (КАСКО)"
      },
      {
        "english": "Unlimited mileage",
        "kurdish": "کیلۆمەتری بێسنوور (بۆ لێخوڕین)",
        "arabic": "كيلومترات مفتوحة",
        "russian": "Безлимитный пробег"
      },
      {
        "english": "Drop-off location",
        "kurdish": "شوێنی ڕادەستکردنەوە (دانانەوەی ئۆتۆمبێلەکە)",
        "arabic": "مكان التسليم",
        "russian": "Место возврата автомобиля"
      },
      {
        "english": "Manual or automatic",
        "kurdish": "گێڕی عادی یان ئۆتۆماتیک",
        "arabic": "عادي لو أوتوماتيك",
        "russian": "Механика или автомат"
      }
    ],
    "voices": [
      {
        "prompt": "پرسیارکردن دەربارەی دڵنیایی",
        "target": "I would like to add full coverage insurance to my rental.",
        "targetKurdish": "حەز دەکەم دڵنیایی گشتگیر (تەئمینی فول) زیاد بکەم بۆ کرێی ئۆتۆمبێلەکەم.",
        "promptAr": "السؤال عن التأمين",
        "targetArabic": "أريد أضيف تأمين شامل على السيارة اللي أجرتها.",
        "promptRu": "Спросить о страховке",
        "targetRussian": "Я бы хотел добавить полную страховку к аренде."
      },
      {
        "prompt": "شوێنی دانانەوەی ئۆتۆمبێل",
        "target": "Can I choose a different drop-off location?",
        "targetKurdish": "دەتوانم شوێنێکی جیاواز هەڵبژێرم بۆ ڕادەستکردنەوەی ئۆتۆمبێلەکە؟",
        "promptAr": "مكان تسليم السيارة",
        "targetArabic": "أكدر أختار مكان تسليم مختلف؟",
        "promptRu": "Место возврата машины",
        "targetRussian": "Могу ли я выбрать другое место возврата автомобиля?"
      }
    ],
    "sentences": [
      {
        "english": [
          "Do",
          "you",
          "need",
          "an",
          "international",
          "driving",
          "permit",
          "here"
        ],
        "kurdish": "لێرە پێویستت بە مۆڵەتی شۆفێریی نێودەوڵەتییە؟",
        "arabic": "تحتاج إجازة سوق دولية هنا؟",
        "russian": "Вам здесь требуется международное водительское удостоверение?"
      },
      {
        "english": [
          "Does",
          "this",
          "car",
          "come",
          "with",
          "unlimited",
          "mileage"
        ],
        "kurdish": "ئایا ئەم ئۆتۆمبێلە کیلۆمەتری بێسنووری لەگەڵدایە؟",
        "arabic": "هاي السيارة بيها كيلومترات مفتوحة؟",
        "russian": "У этого автомобиля безлимитный пробег?"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "I only know how to drive an",
          "transmission."
        ],
        "hint": "تەنها دەزانم ئۆتۆمبێلی گێڕ ئۆتۆماتیک لێبخوڕم.",
        "answer": "automatic",
        "wrongs": [
          "easy",
          "normal",
          "fast"
        ],
        "arabicHint": "أعرف أسوق بس سيارة أوتوماتيك.",
        "arabicParts": [
          "أعرف أسوق بس سيارة",
          "."
        ],
        "arabicAnswer": "أوتوماتيك",
        "arabicWrongs": [
          "سهل",
          "عادي",
          "سريع"
        ],
        "russianHint": "Я умею водить только машину с автоматической коробкой передач.",
        "russianParts": [
          "Я умею водить только коробку-",
          "."
        ],
        "russianAnswer": "автомат",
        "russianWrongs": [
          "механику",
          "стандарт",
          "спорт"
        ]
      },
      {
        "parts": [
          "Make sure you have full",
          "insurance just in case."
        ],
        "hint": "دڵنیابەرەوە کە دڵنیایی گشتگیرت (فول تەئمین) هەیە نەوەک شتێک ڕووبدات.",
        "answer": "coverage",
        "wrongs": [
          "cover",
          "money",
          "paper"
        ],
        "arabicHint": "تأكد إنو عندك تأمين شامل خاف يصير شي.",
        "arabicParts": [
          "تأكد إنو عندك",
          "شامل خاف يصير شي."
        ],
        "arabicAnswer": "تأمين",
        "arabicWrongs": [
          "غطاء",
          "مال",
          "ورق"
        ],
        "russianHint": "Убедитесь, что у вас есть полная страховка на всякий случай.",
        "russianParts": [
          "Убедитесь, что у вас есть полная ",
          " на всякий случай."
        ],
        "russianAnswer": "страховка",
        "russianWrongs": [
          "оплата",
          "бумага",
          "защита"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لە کۆمپانیای کرێدانی ئۆتۆمبێل",
        "theyAsk": "We have an SUV available. Would you like basic or full insurance?",
        "correct": "I'll take the full coverage insurance, please. Also, does the rental include unlimited mileage?",
        "wrong1": "I'd prefer the full insurance option.",
        "wrong2": "Does the full coverage include damage to the vehicle?",
        "wrong3": "Is there a mileage limit on the rental?",
        "explanation": "کۆمپانیاکانی کرێدانی ئۆتۆمبێل زاراوەی وەک 'Coverage' (دڵنیایی) و 'Mileage' (دووری) بەکاردەهێنن",
        "situationAr": "بشركة تأجير السيارات",
        "theyAskAr": "عدنا سيارة SUV متوفرة. تحب تأمين أساسي لو تأمين شامل؟",
        "correctAr": "راح آخذ التأمين الشامل، بلا زحمة. وهمين، الإيجار يشمل كيلومترات مفتوحة؟",
        "wrong1Ar": "أفضل خيار التأمين الكامل.",
        "wrong2Ar": "التغطية الكاملة تشمل الأضرار اللي تصير بالسيارة؟",
        "wrong3Ar": "أكو حد لعدد الأميال بالإيجار؟",
        "explanationAr": "شركات تأجير السيارات تستخدم مصطلحات مثل 'التغطية' (التأمين) و 'عدد الأميال' (المسافة)",
        "situationRu": "В офисе проката автомобилей",
        "theyAskRu": "У нас свободен внедорожник. Вы хотите базовую или полную страховку?",
        "correctRu": "Я возьму полную страховку, пожалуйста. И ещё: аренда включает безлимитный пробег?",
        "wrong1Ru": "Я предпочитаю вариант с полной страховкой.",
        "wrong2Ru": "Полное покрытие включает повреждения автомобиля?",
        "wrong3Ru": "Есть ли ограничение по пробегу при аренде?",
        "explanationRu": "Прокатные компании используют термины 'coverage' (страховое покрытие) и 'mileage' (пробег)."
      }
    ],
    "topicRu": "Аренда автомобиля"
  },
  {
    "topic": "Public Transport",
    "topicKu": "گواستنەوەی گشتی (مترۆ، پاس)",
    "topicAr": "المواصلات العامة",
    "words": [
      {
        "english": "Which line goes to",
        "kurdish": "کام هێڵ دەچێت بۆ...",
        "arabic": "يا خط يروح لـ...",
        "russian": "Какая линия идёт до..."
      },
      {
        "english": "Round trip ticket",
        "kurdish": "بلیتی چوون و هاتنەوە",
        "arabic": "تكت روحة ورجعة",
        "russian": "Билет туда и обратно"
      },
      {
        "english": "Mind the gap",
        "kurdish": "ئاگاداری بۆشاییەکە بە (نێوان شەمەندەفەر و سەکۆکە)",
        "arabic": "دير بالك من الفراغ",
        "russian": "Осторожно, зазор (между вагоном и платформой)"
      },
      {
        "english": "Rush hour",
        "kurdish": "کاتی قەرەباڵغی (کاتی چوونە سەر کار و گەڕانەوە)",
        "arabic": "وقت الازدحام",
        "russian": "Час пик"
      },
      {
        "english": "Transfer at the next stop",
        "kurdish": "گۆڕین (دابەزین بۆ هێڵێکی تر) لە وێستگەی داهاتوو",
        "arabic": "بدل الخط بالمحطة الجاية",
        "russian": "Пересадка на следующей остановке"
      }
    ],
    "voices": [
      {
        "prompt": "کڕینی بلیتی گەڕانەوە",
        "target": "I would like one round trip ticket to the city center.",
        "targetKurdish": "یەک بلیتی چوون و هاتنەوەم دەوێت بۆ سەنتەری شار.",
        "promptAr": "شراء تكت روحة ورجعة",
        "targetArabic": "أريد تكت روحة ورجعة لمركز المدينة.",
        "promptRu": "Купить билет туда и обратно",
        "targetRussian": "Я бы хотел один билет туда и обратно до центра города."
      },
      {
        "prompt": "پرسیارکردن لە ڕێگا",
        "target": "Excuse me, which line goes to the central station?",
        "targetKurdish": "ببوورە، کام هێڵ دەچێت بۆ وێستگەی ناوەندی؟",
        "promptAr": "السؤال عن الطريق",
        "targetArabic": "عفواً، يا خط يروح للمحطة المركزية؟",
        "promptRu": "Спросить дорогу",
        "targetRussian": "Извините, какая линия идёт до центрального вокзала?"
      }
    ],
    "sentences": [
      {
        "english": [
          "You",
          "need",
          "to",
          "transfer",
          "at",
          "the",
          "next",
          "stop"
        ],
        "kurdish": "پێویستە لە وێستگەی داهاتوو دابەزیت بۆ گۆڕینی هێڵەکە",
        "arabic": "لازم تبدل الخط بالمحطة الجاية",
        "russian": "Вам нужно сделать пересадку на следующей остановке."
      },
      {
        "english": [
          "The",
          "trains",
          "are",
          "very",
          "packed",
          "during",
          "rush",
          "hour"
        ],
        "kurdish": "شەمەندەفەرەکان زۆر قەرەباڵغن لە کاتی چونە سەر کاردا",
        "arabic": "القطارات كلش مزدحمة بوقت الازدحام",
        "russian": "Поезда сильно переполнены в час пик."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Please stand back and",
          "the gap."
        ],
        "hint": "تکایە بگەڕێرەوە دواوە و ئاگاداری بۆشاییەکە (نێوان شەمەندەفەر و وێستگەکە) بە.",
        "answer": "mind",
        "wrongs": [
          "watch",
          "look",
          "see"
        ],
        "arabicHint": "رجاءً ارجع ليورة ودير بالك من الفراغ.",
        "arabicParts": [
          "رجاءً ارجع ليورة و",
          "من الفراغ."
        ],
        "arabicAnswer": "دير بالك",
        "arabicWrongs": [
          "باوع",
          "شوف",
          "انتبه"
        ],
        "russianHint": "Пожалуйста, отойдите назад и будьте осторожны у края платформы.",
        "russianParts": [
          "Пожалуйста, отойдите назад и будьте осторожны, не оступитесь в ",
          "."
        ],
        "russianAnswer": "зазор",
        "russianWrongs": [
          "поезд",
          "дверь",
          "путь"
        ]
      },
      {
        "parts": [
          "A one-way ticket is $5, and a",
          "trip is $9."
        ],
        "hint": "بلیتی یەک ئاراستە ٥ دۆلارە، و بلیتی چوون و هاتنەوە ٩ دۆلارە.",
        "answer": "round",
        "wrongs": [
          "two",
          "both",
          "full"
        ],
        "arabicHint": "تكت الروحة بـ 5 دولارات، وتكت الروحة والرجعة بـ 9 دولارات.",
        "arabicParts": [
          "تكت الروحة بـ 5 دولارات، وتكت الروحة و",
          "بـ 9 دولارات."
        ],
        "arabicAnswer": "الرجعة",
        "arabicWrongs": [
          "اثنين",
          "كلاهما",
          "الكاملة"
        ],
        "russianHint": "Билет в один конец стоит 5 долларов, а туда и обратно — 9 долларов.",
        "russianParts": [
          "Билет в один конец стоит 5 долларов, а билет туда и ",
          " — 9 долларов."
        ],
        "russianAnswer": "обратно",
        "russianWrongs": [
          "вместе",
          "назад",
          "снова"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "پرسیارکردن لە کارمەندێکی میترۆ",
        "theyAsk": "Can I help you find your train?",
        "correct": "Yes, please. Which line goes to the museum? And do I need to transfer at the next stop?",
        "wrong1": "Yes, which train should I take to the museum?",
        "wrong2": "Could you tell me whether I need to change trains?",
        "wrong3": "Which subway line stops near the museum?",
        "explanation": "'Which line goes to' و 'Transfer' دوو وشەی سەرەکین لە سیستەمی گواستنەوەی وڵاتاندا",
        "situationAr": "سؤال موظف المترو",
        "theyAskAr": "أگدر أساعدك تندل قطارك؟",
        "correctAr": "إي، ياريت. يا خط يروح للمتحف؟ وهل لازم أبدل بالمحطة الجاية؟",
        "wrong1Ar": "إي، يا قطار لازم أركب للمتحف؟",
        "wrong2Ar": "تگدر تگلي إذا محتاج أبدل قطارات؟",
        "wrong3Ar": "يا خط مترو يوگف قريب المتحف؟",
        "explanationAr": "'يا خط يروح لـ' و 'بدل' كلمات أساسية بأنظمة النقل بالدول",
        "situationRu": "Разговор с сотрудником метро",
        "theyAskRu": "Помочь вам найти нужный поезд?",
        "correctRu": "Да, пожалуйста. Какая линия идёт до музея? И нужно ли пересаживаться на следующей остановке?",
        "wrong1Ru": "Да, на какой поезд мне сесть до музея?",
        "wrong2Ru": "Не подскажете, нужно ли мне менять поезда?",
        "wrong3Ru": "Какая линия метро останавливается около музея?",
        "explanationRu": "'Which line goes to' (какая линия идёт до) и 'transfer' (пересадка) — ключевые фразы в общественном транспорте."
      }
    ],
    "topicRu": "Общественный транспорт"
  },
  {
    "topic": "Lost Luggage",
    "topicKu": "ونبوونی جانتا (لە فڕۆکەخانە)",
    "topicAr": "الجنط الضايعة",
    "words": [
      {
        "english": "My luggage hasn't arrived",
        "kurdish": "جانتاکانم (کەلوپەلەکانم) نەگەیشتوون",
        "arabic": "جنطي ما وصلت",
        "russian": "Мой багаж не прибыл"
      },
      {
        "english": "Baggage claim",
        "kurdish": "شوێنی وەرگرتنەوەی جانتا",
        "arabic": "استلام الجنط",
        "russian": "Зона выдачи багажа"
      },
      {
        "english": "File a missing baggage report",
        "kurdish": "فۆڕمی ونبوونی جانتا پڕبکەرەوە",
        "arabic": "تقديم بلاغ عن جنط ضايعة",
        "russian": "Подать заявление об утере багажа"
      },
      {
        "english": "Luggage tag",
        "kurdish": "تاگی جانتا (ئەو لەزگەیەی بە جانتاکەوەیە)",
        "arabic": "تاك الجنطة",
        "russian": "Багажная бирка"
      },
      {
        "english": "Deliver it to my hotel",
        "kurdish": "بیگەیەنن بۆ هۆتێلەکەم",
        "arabic": "توصيلها لفندقي",
        "russian": "Доставить его в мой отель"
      }
    ],
    "voices": [
      {
        "prompt": "ڕاپۆرتکردنی ونبوون",
        "target": "My luggage hasn't arrived yet. Where can I file a report?",
        "targetKurdish": "جانتاکانم هێشتا نەگەیشتوون. لە کوێ دەتوانم ڕاپۆرت بکەم؟",
        "promptAr": "التبليغ عن الضياع",
        "targetArabic": "جنطي بعدهي ما وصلت. وين أكدر أقدم بلاغ؟",
        "promptRu": "Сообщить об утере",
        "targetRussian": "Мой багаж ещё не прибыл. Где я могу составить заявление?"
      },
      {
        "prompt": "داوای گەیاندن",
        "target": "When it is found, can you deliver it to my hotel?",
        "targetKurdish": "کاتێک دۆزرایەوە، دەتوانن بیگەیەنن بۆ هۆتێلەکەم؟",
        "promptAr": "طلب التوصيل",
        "targetArabic": "من تلكوها، تكدرون توصلوها لفندقي؟",
        "promptRu": "Запрос на доставку",
        "targetRussian": "Когда его найдут, вы сможете доставить его в мой отель?"
      }
    ],
    "sentences": [
      {
        "english": [
          "Here",
          "is",
          "my",
          "luggage",
          "tag",
          "and",
          "boarding",
          "pass"
        ],
        "kurdish": "فەرموو ئەمە تاگی جانتاکەم و بلیتی فڕۆکەکەمە",
        "arabic": "تفضل، هذا تاك جنطتي وبوردنك الطيارة",
        "russian": "Вот моя багажная бирка и посадочный талон."
      },
      {
        "english": [
          "I",
          "waited",
          "at",
          "baggage",
          "claim",
          "for",
          "an",
          "hour"
        ],
        "kurdish": "کاتژمێرێک لە شوێنی وەرگرتنەوەی جانتاکان چاوەڕێم کرد",
        "arabic": "انتظرت بمكان استلام الجنط لمدة ساعة",
        "russian": "Я прождал у зоны выдачи багажа целый час."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "I need to file a missing baggage",
          "immediately."
        ],
        "hint": "پێویستە دەستبەجێ فۆڕمی ڕاپۆرتی ونبوونی جانتا پڕبکەمەوە.",
        "answer": "report",
        "wrongs": [
          "paper",
          "form",
          "claim"
        ],
        "arabicHint": "لازم أقدم بلاغ عن جنط ضايعة فوراً.",
        "arabicParts": [
          "لازم أقدم",
          "عن جنط ضايعة فوراً."
        ],
        "arabicAnswer": "بلاغ",
        "arabicWrongs": [
          "ورقة",
          "نموذج",
          "مطالبة"
        ],
        "russianHint": "Мне нужно немедленно составить заявление об утере багажа.",
        "russianParts": [
          "Мне нужно немедленно составить ",
          " об утере багажа."
        ],
        "russianAnswer": "заявление",
        "russianWrongs": [
          "бумагу",
          "форму",
          "чек"
        ]
      },
      {
        "parts": [
          "Please check my luggage",
          "number."
        ],
        "hint": "تکایە ژمارەی تاگی جانتاکەم بپشکنە.",
        "answer": "tag",
        "wrongs": [
          "sticker",
          "paper",
          "mark"
        ],
        "arabicHint": "رجاءً تأكد من رقم تاك جنطتي.",
        "arabicParts": [
          "رجاءً تأكد من رقم",
          "جنطتي."
        ],
        "arabicAnswer": "تاك",
        "arabicWrongs": [
          "ملصق",
          "ورقة",
          "علامة"
        ],
        "russianHint": "Пожалуйста, проверьте номер моей багажной бирки.",
        "russianParts": [
          "Пожалуйста, проверьте номер моей багажной ",
          "."
        ],
        "russianAnswer": "бирки",
        "russianWrongs": [
          "наклейки",
          "бумажки",
          "карты"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لە بەشی جانتا ونبووەکانی فڕۆکەخانە",
        "theyAsk": "I'm sorry your bag isn't on the belt. Do you have your receipt?",
        "correct": "Yes, here is my luggage tag. My luggage hasn't arrived. I need to file a missing baggage report and have it delivered to my hotel.",
        "wrong1": "Yes, here's the luggage tag for my missing bag.",
        "wrong2": "My suitcase never arrived at baggage claim.",
        "wrong3": "Could you help me report the bag as missing?",
        "explanation": "'File a report' و پێدانی 'Luggage tag' پرۆسەی ڕەسمی فڕۆکەخانەکانە",
        "situationAr": "بقسم الجنط الضايعة بالمطار",
        "theyAskAr": "نعتذر لأن جنطتك مو على الحزام الناقل. عندك الوصل مالتها؟",
        "correctAr": "نعم، هذا تاگ الجنطة. جنطي ما وصلت. محتاج أقدم بلاغ عن جنط ضايعة وتوصلوها لفندقي.",
        "wrong1Ar": "إي، هذا تاگ الجنطة مالت جنطتي الضايعة.",
        "wrong2Ar": "جنطتي ما وصلت أبد لاستلام الجنط.",
        "wrong3Ar": "تگدر تساعدني أبلغ عن الجنطة مفقودة؟",
        "explanationAr": "'تقديم بلاغ' وإعطاء 'تاك الجنطة' هي إجراءات رسمية بالمطارات",
        "situationRu": "В отделе розыска багажа в аэропорту",
        "theyAskRu": "Сожалею, что вашей сумки нет на ленте. У вас есть квитанция?",
        "correctRu": "Да, вот моя багажная бирка. Мой багаж не прибыл. Мне нужно составить акт об утере багажа и оформить доставку в отель.",
        "wrong1Ru": "Да, вот бирка от моей пропавшей сумки.",
        "wrong2Ru": "Мой чемодан так и не появился в зоне выдачи багажа.",
        "wrong3Ru": "Не могли бы вы помочь мне заявить о пропаже багажа?",
        "explanationRu": "'File a report' (подать заявление) и предъявление 'luggage tag' (багажной бирки) — официальная процедура в аэропортах."
      }
    ],
    "topicRu": "Утерянный багаж"
  },
  {
    "topic": "Airbnb & Rentals",
    "topicKu": "وەرگرتنی ماڵی کرێی گەشتیاری (Airbnb)",
    "topicAr": "إير بي إن بي والإيجارات",
    "words": [
      {
        "english": "Self check-in instructions",
        "kurdish": "ڕێنماییەکانی وەرگرتنی ماڵ (بەبێ بینینی خاوەن ماڵ)",
        "arabic": "تعليمات الدخول الذاتي",
        "russian": "Инструкции по самостоятельному заселению"
      },
      {
        "english": "Lockbox code",
        "kurdish": "کۆدی سندووقی قفڵەکە (بۆ دەرکردنی کلیل)",
        "arabic": "رمز صندوق المفاتيح",
        "russian": "Код от сейфа с ключами (мини-сейфа)"
      },
      {
        "english": "House rules",
        "kurdish": "یاساکانی ماڵەکە",
        "arabic": "قوانين البيت",
        "russian": "Правила проживания в доме"
      },
      {
        "english": "Wi-Fi password",
        "kurdish": "وشەی نهێنی وایفای",
        "arabic": "باسورد الواي فاي",
        "russian": "Пароль от Wi-Fi"
      },
      {
        "english": "Leave a review",
        "kurdish": "جێهێشتنی هەڵسەنگاندن / کۆمێنت",
        "arabic": "تخلي تقييم",
        "russian": "Оставить отзыв"
      }
    ],
    "voices": [
      {
        "prompt": "پرسین لە ڕێنماییەکان",
        "target": "Could you send me the self check-in instructions?",
        "targetKurdish": "دەتوانیت ڕێنماییەکانی وەرگرتنی ماڵەکەم (بۆ خۆم) بۆ بنێریت؟",
        "promptAr": "السؤال عن التعليمات",
        "targetArabic": "تكدر تدزلي تعليمات الدخول الذاتي؟",
        "promptRu": "Спросить об инструкциях",
        "targetRussian": "Не могли бы вы прислать мне инструкции по самостоятельному заселению?"
      },
      {
        "prompt": "کۆدی کلیلەکە",
        "target": "The lockbox code is not working.",
        "targetKurdish": "کۆدی سندووقی قفڵەکە کار ناکات.",
        "promptAr": "رمز المفتاح",
        "targetArabic": "رمز صندوق المفاتيح ما ديشتغل.",
        "promptRu": "Код от ключей",
        "targetRussian": "Код от сейфа с ключами не подходит."
      }
    ],
    "sentences": [
      {
        "english": [
          "Please",
          "make",
          "sure",
          "to",
          "read",
          "the",
          "house",
          "rules"
        ],
        "kurdish": "تکایە دڵنیابەرەوە لەوەی کە یاساکانی ماڵەکە دەخوێنیتەوە",
        "arabic": "رجاءً تأكد تقره قوانين البيت",
        "russian": "Пожалуйста, обязательно ознакомьтесь с правилами дома."
      },
      {
        "english": [
          "Where",
          "can",
          "I",
          "find",
          "the",
          "Wi-Fi",
          "password"
        ],
        "kurdish": "لە کوێ دەتوانم وشەی نهێنی وایفایەکە بدۆزمەوە؟",
        "arabic": "وين أكدر الكي باسورد الواي فاي؟",
        "russian": "Где я могу найти пароль от Wi-Fi?"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "We had a great time and will definitely leave a positive",
          "."
        ],
        "hint": "کاتی زۆر خۆشمان بەسەربرد و بێگومان هەڵسەنگاندنێکی ئەرێنی جێدەهێڵین.",
        "answer": "review",
        "wrongs": [
          "message",
          "text",
          "word"
        ],
        "arabicHint": "كضينا وقت كلش حلو وأكيد راح نخلي تقييم إيجابي.",
        "arabicParts": [
          "كضينا وقت كلش حلو وأكيد راح نخلي",
          "إيجابي."
        ],
        "arabicAnswer": "تقييم",
        "arabicWrongs": [
          "رسالة",
          "نصاً",
          "كلمة"
        ],
        "russianHint": "Мы отлично провели время и обязательно оставим положительный отзыв.",
        "russianParts": [
          "Мы отлично провели время и обязательно оставим положительный ",
          "."
        ],
        "russianAnswer": "отзыв",
        "russianWrongs": [
          "комментарий",
          "сообщение",
          "текст"
        ]
      },
      {
        "parts": [
          "I couldn't open the door. What is the",
          "code again?"
        ],
        "hint": "نەمتوانی دەرگاکە بکەمەوە. کۆدی سندووقی قفڵەکە چی بوو؟",
        "answer": "lockbox",
        "wrongs": [
          "key",
          "safe",
          "door"
        ],
        "arabicHint": "ما كدرت أفتح الباب. شنو رمز صندوق المفاتيح مرة ثانية؟",
        "arabicParts": [
          "ما كدرت أفتح الباب. شنو رمز",
          "مرة ثانية؟"
        ],
        "arabicAnswer": "صندوق المفاتيح",
        "arabicWrongs": [
          "المفتاح",
          "الخزنة",
          "الباب"
        ],
        "russianHint": "Я не смог открыть дверь. Напомните код от сейфа для ключей?",
        "russianParts": [
          "Я не смог открыть дверь. Напомните код от ",
          " для ключей?"
        ],
        "russianAnswer": "сейфа",
        "russianWrongs": [
          "замка",
          "двери",
          "ящика"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "نامە ناردن بۆ خاوەن ماڵی کرێی گەشتیاری",
        "theyAsk": "Hi! You'll be arriving today. Let me know if you need anything.",
        "correct": "Hi! I just arrived. The lockbox code isn't working. Could you resend the self check-in instructions?",
        "wrong1": "Hi, I'm here, but I can't get inside.",
        "wrong2": "Could you tell me how to open the lockbox?",
        "wrong3": "I arrived, and the key box seems to be broken.",
        "explanation": "'Self check-in' و 'lockbox' زاراوەی تایبەتی خزمەتگوزارییەکانی وەک Airbnbـن",
        "situationAr": "تدز رسالة لصاحب مكان الإقامة السياحي",
        "theyAskAr": "مرحبا! راح توصل اليوم. خبرني إذا محتاج أي شي.",
        "correctAr": "هلو! هسة وصلت. رمز صندوق المفاتيح ما ديشتغل. تگدر ترجع تدزلي تعليمات الدخول الذاتي؟",
        "wrong1Ar": "هلو، أني هنا بس ما أگدر أدخل.",
        "wrong2Ar": "تگدر تگلي شلون أفتح صندوق المفاتيح؟",
        "wrong3Ar": "وصلت، وصندوق المفاتيح مبين عطلان.",
        "explanationAr": "'الدخول الذاتي' و 'صندوق المفاتيح' هي مصطلحات شائعة بخدمات مثل Airbnb",
        "situationRu": "Переписка с хозяином жилья",
        "theyAskRu": "Здравствуйте! Вы заселяетесь сегодня. Дайте знать, если что-то понадобится.",
        "correctRu": "Здравствуйте! Я только что приехал. Код от мини-сейфа не работает. Могли бы вы снова отправить инструкции по самостоятельному заселению?",
        "wrong1Ru": "Здравствуйте, я на месте, но не могу войти.",
        "wrong2Ru": "Не подскажете, как открыть сейф с ключом?",
        "wrong3Ru": "Я приехал, и коробка с ключами, кажется, сломана.",
        "explanationRu": "'Self check-in' (самозаселение) и 'lockbox' (бокс для ключей) — стандартные термины сервисов аренды вроде Airbnb."
      }
    ],
    "topicRu": "Airbnb и аренда жилья"
  },
  {
    "topic": "Medical Emergencies",
    "topicKu": "باری لەناکاوی پزیشکی لە دەرەوە",
    "topicAr": "حالات الطوارئ الطبية",
    "words": [
      {
        "english": "I need an ambulance",
        "kurdish": "پێویستم بە ئەمبولانسە (ئۆتۆمبێلی فریاکەوتن)",
        "arabic": "محتاج إسعاف",
        "russian": "Мне нужна скорая помощь"
      },
      {
        "english": "Travel insurance",
        "kurdish": "دڵنیایی گەشتکردن (بۆ نەخۆشی)",
        "arabic": "تأمين السفر",
        "russian": "Туристическая страховка"
      },
      {
        "english": "Prescription medication",
        "kurdish": "دەرمانی ڕەچەتە (بەپێی نووسراوی پزیشک)",
        "arabic": "دوه براچيتة",
        "russian": "Рецептурное лекарство"
      },
      {
        "english": "Allergic reaction",
        "kurdish": "کاردانەوەی هەستیاری (حەساسیەت)",
        "arabic": "حساسية",
        "russian": "Аллергическая реакция"
      },
      {
        "english": "Food poisoning",
        "kurdish": "ژەهراویبوونی خۆراک",
        "arabic": "تسمم غذائي",
        "russian": "Пищевое отравление"
      }
    ],
    "voices": [
      {
        "prompt": "داوای یارمەتی خێرا",
        "target": "Please call an ambulance, it's an emergency!",
        "targetKurdish": "تکایە تەلەفۆن بۆ ئەمبولانس بکەن، ئەمە حاڵەتێکی لەناکاوە!",
        "promptAr": "طلب مساعدة سريعة",
        "targetArabic": "رجاءً خابروا إسعاف، هاي حالة طارئة!",
        "promptRu": "Срочный вызов помощи",
        "targetRussian": "Пожалуйста, вызовите скорую, это экстренный случай!"
      },
      {
        "prompt": "باسکردنی کێشەی تەندروستی",
        "target": "I think I have severe food poisoning.",
        "targetKurdish": "پێم وایە ژەهراویبوونی خۆراکیی زۆر سەختم هەیە.",
        "promptAr": "وصف المشكلة الصحية",
        "targetArabic": "أتصور عندي تسمم غذائي قوي.",
        "promptRu": "Описать проблему со здоровьем",
        "targetRussian": "Кажется, у меня сильное пищевое отравление."
      }
    ],
    "sentences": [
      {
        "english": [
          "Does",
          "your",
          "travel",
          "insurance",
          "cover",
          "hospital",
          "visits"
        ],
        "kurdish": "ئایا دڵنیایی گەشتەکەت تێچووی نەخۆشخانە دەگرێتەوە؟",
        "arabic": "تأمين سفرك يغطي روحات المستشفى؟",
        "russian": "Покрывает ли ваша туристическая страховка посещение больницы?"
      },
      {
        "english": [
          "I",
          "am",
          "having",
          "a",
          "bad",
          "allergic",
          "reaction"
        ],
        "kurdish": "کاردانەوەیەکی هەستیاری (حەساسیەت)ی خراپم هەیە",
        "arabic": "عندي حساسية كلش قوية",
        "russian": "У меня сильная аллергическая реакция."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "You can't buy these pills here without a",
          "."
        ],
        "hint": "ناتوانیت ئەم حەبانە لێرە بکڕیت بەبێ ڕەچەتە (نووسراوی پزیشک).",
        "answer": "prescription",
        "wrongs": [
          "doctor",
          "paper",
          "note"
        ],
        "arabicHint": "ما تكدر تشتري هاي الحبوب هنا بدون راچيتة.",
        "arabicParts": [
          "ما تكدر تشتري هاي الحبوب هنا بدون",
          "."
        ],
        "arabicAnswer": "راچيتة",
        "arabicWrongs": [
          "دكتور",
          "ورقة",
          "ملاحظة"
        ],
        "russianHint": "Вы не можете купить эти таблетки здесь без рецепта.",
        "russianParts": [
          "Вы не можете купить эти таблетки здесь без ",
          "."
        ],
        "russianAnswer": "рецепта",
        "russianWrongs": [
          "врача",
          "бумаги",
          "справки"
        ]
      },
      {
        "parts": [
          "Make sure to buy",
          "insurance before you fly."
        ],
        "hint": "دڵنیابەرەوە لە کڕینی دڵنیایی گەشت پێش ئەوەی گەشت بکەیت.",
        "answer": "travel",
        "wrongs": [
          "flight",
          "ticket",
          "health"
        ],
        "arabicHint": "تأكد تشتري تأمين السفر قبل لا تسافر.",
        "arabicParts": [
          "تأكد تشتري تأمين",
          "قبل لا تسافر."
        ],
        "arabicAnswer": "السفر",
        "arabicWrongs": [
          "الرحلة",
          "التذكرة",
          "الصحة"
        ],
        "russianHint": "Обязательно купите туристическую страховку перед полётом.",
        "russianParts": [
          "Обязательно оформите туристическую ",
          " перед полётом."
        ],
        "russianAnswer": "страховку",
        "russianWrongs": [
          "путёвку",
          "карту",
          "визу"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لە دەرمانخانەیەک لە دەرەوەی وڵات",
        "theyAsk": "Are you okay? Do you need a doctor?",
        "correct": "I think I'm having an allergic reaction to something I ate. Do you have any medicine, or do I need a prescription?",
        "wrong1": "I think something I ate caused an allergic reaction.",
        "wrong2": "I have a rash and need something for the allergy.",
        "wrong3": "Can you tell me whether I need to see a doctor?",
        "explanation": "لە دەرەوەی وڵات جیاوازی زۆر هەیە لە نێوان دەرمانی ئاسایی و دەرمانی 'prescription' (کە تەنها بە وەرەقەی دکتۆر دەدرێت)",
        "situationAr": "بصيدلية خارج البلد",
        "theyAskAr": "أنت زين؟ محتاج دكتور؟",
        "correctAr": "أتصور صايرة عندي حساسية من شي أكلته. عندكم أي دوه، لو لازم وصفة دكتور؟",
        "wrong1Ar": "أعتقد شي أكلته سببلي حساسية.",
        "wrong2Ar": "عندي طفح جلدي ومحتاج شي للحساسية.",
        "wrong3Ar": "تگدر تگلي إذا لازم أشوف دكتور؟",
        "explanationAr": "بالخارج، اكو فرق جبير بين الأدوية العادية والأدوية اللي تحتاج 'راچيتة' (اللي تنصرف بس بوصفة دكتور)",
        "situationRu": "В аптеке за границей",
        "theyAskRu": "Вам плохо? Вам нужен врач?",
        "correctRu": "Кажется, у меня аллергическая реакция на то, что я съел. У вас есть лекарство, или мне нужен рецепт?",
        "wrong1Ru": "Думаю, съеденное вызвало у меня аллергию.",
        "wrong2Ru": "У меня сыпь, мне нужно что-нибудь от аллергии.",
        "wrong3Ru": "Не подскажете, нужно ли мне показаться врачу?",
        "explanationRu": "За границей есть строгое разделение между безрецептурными препаратами и лекарствами 'by prescription' (только по рецепту врача)."
      }
    ],
    "topicRu": "Неотложная медицинская помощь"
  },
  {
    "topic": "Haggling (Bargaining)",
    "topicKu": "مامەڵەکردن (کەمکردنەوەی نرخ)",
    "topicAr": "المكاسر",
    "words": [
      {
        "english": "Can you lower the price",
        "kurdish": "دەتوانیت نرخەکە دابەزێنیت؟",
        "arabic": "تكدر تنزل السعر؟",
        "russian": "Можете снизить цену?"
      },
      {
        "english": "That's a bit steep",
        "kurdish": "ئەوە کەمێک گرانە (زۆرە)",
        "arabic": "هذا غالي شوية",
        "russian": "Это дороговато (высокая цена)"
      },
      {
        "english": "What's your best price",
        "kurdish": "کۆتا نرخت چەندە؟ (باشترین نرخت)",
        "arabic": "شنو قفالته؟ (أحسن سعر)",
        "russian": "Какова ваша окончательная цена? (лучшая цена)"
      },
      {
        "english": "I'll give you",
        "kurdish": "ئەوەندەت دەدەمێ...",
        "arabic": "راح أنطيك...",
        "russian": "Я дам вам... (предлагаю сумму)"
      },
      {
        "english": "Rip-off",
        "kurdish": "فێڵلێکردن (فرۆشتن بە نرخی زۆر بەرز)",
        "arabic": "نصب / بوقة",
        "russian": "Грабеж среди бела дня (обдираловка)"
      }
    ],
    "voices": [
      {
        "prompt": "داوای دابەزاندنی نرخ",
        "target": "That's a bit steep. Can you lower the price?",
        "targetKurdish": "ئەوە کەمێک گرانە. دەتوانیت نرخەکە دابەزێنیت؟",
        "promptAr": "طلب تنزيل السعر",
        "targetArabic": "هذا غالي شوية. تكدر تنزل السعر؟",
        "promptRu": "Попросить снизить цену",
        "targetRussian": "Это дороговато. Не могли бы вы уступить в цене?"
      },
      {
        "prompt": "پرسیار لە نرخی کۆتایی",
        "target": "If I buy three, what's your best price?",
        "targetKurdish": "ئەگەر سیانیان لێ بکڕم، کۆتا نرخت چەندە؟",
        "promptAr": "السؤال عن السعر الأخير",
        "targetArabic": "إذا أشتري تلاثة، بيش تحسبهم؟ (شنو أحسن سعر)",
        "promptRu": "Спросить окончательную цену",
        "targetRussian": "Если я возьму три штуки, какую лучшую цену вы предложите?"
      }
    ],
    "sentences": [
      {
        "english": [
          "Don't",
          "buy",
          "it",
          "there",
          "it",
          "is",
          "a",
          "rip-off"
        ],
        "kurdish": "لەوێ مەیکڕە، ئەوە فێڵلێکردنە (زۆر گرانە)",
        "arabic": "لا تشتري من هناك، هذا نصب (كلش غالي)",
        "russian": "Не покупай это там, это чистой воды обдираловка."
      },
      {
        "english": [
          "I'll",
          "give",
          "you",
          "twenty",
          "dollars",
          "for",
          "it"
        ],
        "kurdish": "بیست دۆلارت پێ دەدەم بۆ ئەوە",
        "arabic": "راح أنطيك عشرين دولار بي",
        "russian": "Я дам вам за это двадцать долларов."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Fifty dollars? That's a bit",
          "for a small shirt."
        ],
        "hint": "پەنجا دۆلار؟ ئەوە کەمێک گرانە بۆ کراسێکی بچووک.",
        "answer": "steep",
        "wrongs": [
          "high",
          "much",
          "big"
        ],
        "arabicHint": "خمسين دولار؟ هذا غالي شوية على قميص صغير.",
        "arabicParts": [
          "خمسين دولار؟ هذا",
          "شوية على قميص صغير."
        ],
        "arabicAnswer": "غالي",
        "arabicWrongs": [
          "مرتفع",
          "كثير",
          "كبير"
        ],
        "russianHint": "Пятьдесят долларов? Это дороговато для маленькой рубашки.",
        "russianParts": [
          "Пятьдесят долларов? Это ",
          " для простой футболки."
        ],
        "russianAnswer": "дороговато",
        "russianWrongs": [
          "высоко",
          "много",
          "тяжело"
        ]
      },
      {
        "parts": [
          "$100 is a total",
          ". I saw it for $20 somewhere else."
        ],
        "hint": "١٠٠ دۆلار بەتەواوی فێڵلێکردنە (گرانە). لە شوێنێکی تر بە ٢٠ دۆلار بینیم.",
        "answer": "rip-off",
        "wrongs": [
          "scam",
          "bad",
          "fake"
        ],
        "arabicHint": "100 دولار نصبة. شفته بـ 20 دولار بغير مكان.",
        "arabicParts": [
          "100 دولار هي",
          "تماماً. شفته بـ 20 دولار بغير مكان."
        ],
        "arabicAnswer": "نصبة",
        "arabicWrongs": [
          "نصب",
          "سيء",
          "مزيف"
        ],
        "russianHint": "100 долларов — это чистый грабёж. Я видел это за 20 долларов в другом месте.",
        "russianParts": [
          "100 долларов — это чистый ",
          ". Я видел то же самое за 20 долларов в другом месте."
        ],
        "russianAnswer": "грабёж",
        "russianWrongs": [
          "обман",
          "плохо",
          "подделка"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لە بازاڕێکی میللیدایت و دەتەوێت دیارییەک بکڕیت",
        "theyAsk": "For you my friend, a special price: $50.",
        "correct": "That's a bit steep for a small souvenir. What's your best price? I'll give you $30.",
        "wrong1": "Fifty is more than I was hoping to spend.",
        "wrong2": "Would you consider taking thirty dollars?",
        "wrong3": "Is there any room to lower the price?",
        "explanation": "'That's a bit steep' و 'What's your best price' شێوازێکی زۆر باو و ڕێزدارانەن بۆ مامەڵەکردن و کەمکردنەوەی نرخ",
        "situationAr": "أنت بسوق شعبي وتريد تشتري هدية تذكارية",
        "theyAskAr": "لخاطرك يا صديقي، سعر خاص: 50 دولار.",
        "correctAr": "هذا غالي شوية على تذكار صغير. شنو قفالته من الأخير؟ أنطيك 30 دولار.",
        "wrong1Ar": "خمسين أكثر من اللي چنت ناوي أصرفه.",
        "wrong2Ar": "تقبل تاخذ ثلاثين دولار؟",
        "wrong3Ar": "أكو مجال تنزل السعر شوية؟",
        "explanationAr": "'هذا غالي شوية' و 'شنو قفالته' هي طرق شائعة ومحترمة للمكاسر وتنزيل السعر",
        "situationRu": "На восточном рынке покупаешь сувенир",
        "theyAskRu": "Только для тебя, друг мой, специальная цена: 50 долларов.",
        "correctRu": "Это дороговато для маленького сувенира. Какова ваша лучшая цена? Я отдам за него 30 долларов.",
        "wrong1Ru": "Пятьдесят — это больше, чем я рассчитывал потратить.",
        "wrong2Ru": "Согласитесь ли вы взять тридцать долларов?",
        "wrong3Ru": "Есть ли возможность немного уступить в цене?",
        "explanationRu": "'That's a bit steep' (дороговато) и 'What's your best price' (ваша лучшая цена) — вежливые и естественные обороты при торге."
      }
    ],
    "topicRu": "Торг на рынке"
  },
  {
    "topic": "Guided Tours",
    "topicKu": "گەشتی ڕێبەریکراو (لەگەڵ ڕێبەر/گاید)",
    "topicAr": "الجولات ويه مرشد",
    "words": [
      {
        "english": "Tour guide",
        "kurdish": "ڕێبەری گەشتیاری",
        "arabic": "مرشد سياحي",
        "russian": "Экскурсовод (гид)"
      },
      {
        "english": "Meeting point",
        "kurdish": "خاڵی کۆبوونەوە (شوێنی یەکتربینین)",
        "arabic": "نقطة التجمع",
        "russian": "Место встречи (сбора группы)"
      },
      {
        "english": "Free time",
        "kurdish": "کاتی سەربەست (بۆ گەڕان بەتەنیا)",
        "arabic": "وقت حر",
        "russian": "Свободное время"
      },
      {
        "english": "Admission fee",
        "kurdish": "کرێی چوونەژوورەوە",
        "arabic": "رسوم الدخول",
        "russian": "Входная плата (билет)"
      },
      {
        "english": "Skip the line",
        "kurdish": "پەڕینەوە لە ڕیزەکە (بێ سەرە گرتن)",
        "arabic": "تعبر السرة",
        "russian": "Проход без очереди"
      }
    ],
    "voices": [
      {
        "prompt": "پرسیارکردن لە ڕێبەرەکە",
        "target": "Excuse me, where is the meeting point after our free time?",
        "targetKurdish": "ببوورە، خاڵی کۆبوونەوەکە لە کوێیە دوای کاتە سەربەستەکەمان؟",
        "promptAr": "السؤال من المرشد",
        "targetArabic": "عفواً، وين نقطة التجمع بعد وقتنا الحر؟",
        "promptRu": "Спросить гида",
        "targetRussian": "Простите, где находится место сбора после нашего свободного времени?"
      },
      {
        "prompt": "کرێی شوێنەکان",
        "target": "Does the ticket include the admission fee for the museum?",
        "targetKurdish": "ئایا بلیتەکە کرێی چوونەژوورەوەی مۆزەخانەکەش لەخۆ دەگرێت؟",
        "promptAr": "رسوم الأماكن",
        "targetArabic": "التكت يشمل رسوم دخول المتحف؟",
        "promptRu": "Стоимость входа",
        "targetRussian": "Включает ли билет входную плату в музей?"
      }
    ],
    "sentences": [
      {
        "english": [
          "We",
          "bought",
          "skip",
          "the",
          "line",
          "tickets",
          "online"
        ],
        "kurdish": "ئێمە بلیتی (بێ سەرە گرتن)مان بە ئۆنلاین کڕی",
        "arabic": "اشترينا تكتات تعبر السرة من الإنترنت",
        "russian": "Мы купили билеты без очереди онлайн."
      },
      {
        "english": [
          "Our",
          "tour",
          "guide",
          "was",
          "very",
          "knowledgeable"
        ],
        "kurdish": "ڕێبەرە گەشتیارییەکەمان زۆر زانیاری هەبوو",
        "arabic": "مرشدنا السياحي چان كلش فاهم",
        "russian": "Наш экскурсовод был очень эрудированным."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "We will have 30 minutes of",
          "time to take photos."
        ],
        "hint": "ئێمە ٣٠ خولەک کاتی سەربەستمان دەبێت بۆ وێنەگرتن.",
        "answer": "free",
        "wrongs": [
          "empty",
          "good",
          "relax"
        ],
        "arabicHint": "راح يصير عدنا 30 دقيقة وقت حر حتى ناخذ صور.",
        "arabicParts": [
          "راح يصير عدنا 30 دقيقة من الوقت",
          "حتى ناخذ صور."
        ],
        "arabicAnswer": "الحر",
        "arabicWrongs": [
          "الفارغ",
          "الجيد",
          "الاسترخاء"
        ],
        "russianHint": "У нас будет 30 минут свободного времени, чтобы сделать фотографии.",
        "russianParts": [
          "У нас будет 30 минут ",
          " времени, чтобы сделать фотографии."
        ],
        "russianAnswer": "свободного",
        "russianWrongs": [
          "пустого",
          "хорошего",
          "лёгкого"
        ]
      },
      {
        "parts": [
          "The",
          "point for the bus is next to the fountain."
        ],
        "hint": "خاڵی کۆبوونەوە بۆ پاسەکە لە تەنیشت نافوورەکەیە.",
        "answer": "meeting",
        "wrongs": [
          "start",
          "see",
          "wait"
        ],
        "arabicHint": "نقطة التجمع للباص بصف النافورة.",
        "arabicParts": [
          "نقطة",
          "للباص بصف النافورة."
        ],
        "arabicAnswer": "التجمع",
        "arabicWrongs": [
          "البداية",
          "الرؤية",
          "الانتظار"
        ],
        "russianHint": "Место сбора на автобус находится рядом с фонтаном.",
        "russianParts": [
          "Место ",
          " на автобус находится рядом с фонтаном."
        ],
        "russianAnswer": "сбора",
        "russianWrongs": [
          "старта",
          "ожидания",
          "встреч"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "قسەکردن لەگەڵ ڕێبەری گەشتەکەت",
        "theyAsk": "We will go inside the castle now. Does everyone have their tickets?",
        "correct": "I have my ticket, but I wanted to ask: is the admission fee included, and do we skip the line?",
        "wrong1": "I have my ticket. Do we need to wait in the regular line?",
        "wrong2": "Does this ticket include the castle entrance?",
        "wrong3": "Where should I show my ticket?",
        "explanation": "'Skip the line' خزمەتگوزارییەکی زۆر باوە لە ئەوروپا کە بە پارەی زیاتر سەرە نادەگریت",
        "situationAr": "تحجي ويه مرشدك السياحي",
        "theyAskAr": "راح ندخل للقلعة هسة. الكل عنده تذاكرهم؟",
        "correctAr": "عندي تذكرتي، بس چنت أريد أسأل: رسوم الدخول مشمولة، وراح نعبر السرة؟",
        "wrong1Ar": "عندي تذكرتي. لازم ننتظر بالسرة العادي؟",
        "wrong2Ar": "هاي التذكرة تشمل الدخول للقلعة؟",
        "wrong3Ar": "وين لازم أشوف تذكرتي؟",
        "explanationAr": "'تعبر السرة' خدمة كلش شائعة بأوروبا تخليك تتجنب الانتظار مقابل مبلغ إضافي",
        "situationRu": "Разговор с гидом на экскурсии",
        "theyAskRu": "Сейчас мы зайдем в замок. У всех есть билеты?",
        "correctRu": "У меня есть билет, но я хотел спросить: входной билет включен, и мы проходим без очереди?",
        "wrong1Ru": "У меня есть билет. Нам нужно стоять в общей очереди?",
        "wrong2Ru": "Включает ли этот билет вход в замок?",
        "wrong3Ru": "Где мне нужно показать свой билет?",
        "explanationRu": "'Skip the line' (без очереди) — популярная услуга на туристических объектах, позволяющая пройти без ожидания."
      }
    ],
    "topicRu": "Экскурсии с гидом"
  },
  {
    "topic": "Street Food",
    "topicKu": "خواردنی سەر شەقام (لە وڵاتانی تر)",
    "topicAr": "أكل الشارع",
    "words": [
      {
        "english": "Is this spicy",
        "kurdish": "ئایا ئەمە توونە؟",
        "arabic": "هذا حار؟",
        "russian": "Это острое блюдо?"
      },
      {
        "english": "What is the local specialty",
        "kurdish": "تایبەتمەندی ناوچەکە چییە؟ (بەناوبانگترین خواردنی لۆکاڵی)",
        "arabic": "شنو أكلتكم المحلية المميزة؟",
        "russian": "Какое здесь местное фирменное блюдо?"
      },
      {
        "english": "Food stall",
        "kurdish": "عەرەبانەی خواردن / دوکانی سەر شەقام",
        "arabic": "عربانة أكل / كشك أكل",
        "russian": "Ларёк с уличной едой (киоск)"
      },
      {
        "english": "To go / Takeaway",
        "kurdish": "بۆ بردنەوە (نەخواردن لەوێ)",
        "arabic": "سفري",
        "russian": "На вынос (с собой)"
      },
      {
        "english": "Vegetarian options",
        "kurdish": "بژاردەی ڕووەکی",
        "arabic": "أكلات نباتية",
        "russian": "Вегетарианские блюда"
      }
    ],
    "voices": [
      {
        "prompt": "پرسیار لە خواردنی ناوچەکە",
        "target": "What is the local specialty here?",
        "targetKurdish": "تایبەتمەندی (بەناوبانگترین خواردنی) ناوچەکە چییە لێرە؟",
        "promptAr": "السؤال عن أكل المنطقة",
        "targetArabic": "شنو الأكلة المحلية المميزة هنا؟",
        "promptRu": "Спросить о местном блюде",
        "targetRussian": "Какое здесь фирменное местное блюдо?"
      },
      {
        "prompt": "داوای بردنەوە",
        "target": "I'll have two of these, to go please.",
        "targetKurdish": "دوو دانە لەمانەم دەوێت، بۆ بردنەوە تکایە.",
        "promptAr": "طلب الأكل سفري",
        "targetArabic": "راح آخذ ثنين من هاي، سفري بلا زحمة.",
        "promptRu": "Заказ с собой",
        "targetRussian": "Мне две порции вот этого с собой, пожалуйста."
      }
    ],
    "sentences": [
      {
        "english": [
          "Do",
          "you",
          "have",
          "any",
          "vegetarian",
          "options",
          "available"
        ],
        "kurdish": "ئایا هیچ بژاردەیەکی ڕووەکیتان بەردەستە؟",
        "arabic": "عدكم أي أكلات نباتية؟",
        "russian": "Есть ли у вас вегетарианские блюда?"
      },
      {
        "english": [
          "That",
          "food",
          "stall",
          "looks",
          "very",
          "popular",
          "with",
          "locals"
        ],
        "kurdish": "ئەو عەرەبانەی خواردنە وا دیارە زۆر لای خەڵکی ناوچەکە خۆشەویستە",
        "arabic": "عربانة الأكل هاي مبينة كلش مشهورة يم أهل المنطقة",
        "russian": "Тот уличный ларёк выглядит очень популярным среди местных жителей."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Can you make it not too",
          "? I can't handle chili."
        ],
        "hint": "دەتوانیت وا بکەیت زۆر توون نەبێت؟ بەرگەی بیبەر ناگرم.",
        "answer": "spicy",
        "wrongs": [
          "hot",
          "red",
          "strong"
        ],
        "arabicHint": "تكدر تخليها مو كلش حارة؟ ما أتحمل الفلفل.",
        "arabicParts": [
          "تكدر تخليها مو",
          "كلش؟ ما أتحمل الفلفل."
        ],
        "arabicAnswer": "حارة",
        "arabicWrongs": [
          "ساخناً",
          "أحمر",
          "قوياً"
        ],
        "russianHint": "Вы могли бы сделать не слишком острым? Я плохо переношу перец чили.",
        "russianParts": [
          "Вы могли бы сделать не слишком ",
          "? Я не переношу чили."
        ],
        "russianAnswer": "острым",
        "russianWrongs": [
          "горячим",
          "красным",
          "крепким"
        ]
      },
      {
        "parts": [
          "I want this sandwich",
          "go, please."
        ],
        "hint": "ئەم لەفەیەم بۆ بردنەوە دەوێت تکایە.",
        "answer": "to",
        "wrongs": [
          "for",
          "away",
          "take"
        ],
        "arabicHint": "أريد هاي اللفة سفري، بلا زحمة.",
        "arabicParts": [
          "أريد هاي اللفة",
          "، بلا زحمة."
        ],
        "arabicAnswer": "سفري",
        "arabicWrongs": [
          "لأجل",
          "بعيداً",
          "أخذ"
        ],
        "russianHint": "Я бы хотел этот сэндвич с собой, пожалуйста.",
        "russianParts": [
          "Мне этот сэндвич с ",
          ", пожалуйста."
        ],
        "russianAnswer": "собой",
        "russianWrongs": [
          "на вынос",
          "домой",
          "назад"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لەلای عەرەبانەیەکی خواردن لە بانکوک یان مەکسیک",
        "theyAsk": "Hi! What can I get for you today?",
        "correct": "I'd like to try the local specialty, but is it spicy? If so, can you make it mild? And I'll take it to go.",
        "wrong1": "What local dish would you recommend?",
        "wrong2": "I'd like something mild to take away.",
        "wrong3": "Could you make the specialty without much chili?",
        "explanation": "لە ئەمریکا دەڵێن 'to go'، لە بەریتانیا دەڵێن 'takeaway' بۆ خواردنێک کە لەگەڵ خۆت دەیبەیت",
        "situationAr": "يم عربانة أكل ببانكوك لو المكسيك",
        "theyAskAr": "أهلاً! شنو تحب أقدملك اليوم؟",
        "correctAr": "أريد أجرب الأكلة المشهورة هنا، بس هي حارة؟ إذا إي، تگدر تسويها مو حارة هواية؟ وأريدها سفري.",
        "wrong1Ar": "شنو الأكلة المحلية اللي تنصح بيها؟",
        "wrong2Ar": "أريد شي خفيف سفري.",
        "wrong3Ar": "تگدر تسوي الوجبة بدون فلفل هواية؟",
        "explanationAr": "بأمريكا يكولون 'to go'، وببريطانيا يكولون 'takeaway' للأكل اللي تاخذه وياك",
        "situationRu": "У уличного киоска с едой в Бангкоке или Мехико",
        "theyAskRu": "Привет! Что вам приготовить сегодня?",
        "correctRu": "Я хотел бы попробовать местное фирменное блюдо, но оно острое? Если да, можно сделать не слишком острым? И мне с собой.",
        "wrong1Ru": "Какое местное блюдо вы бы посоветовали?",
        "wrong2Ru": "Я бы хотел что-нибудь неострое навынос.",
        "wrong3Ru": "Не могли бы вы приготовить фирменное блюдо без большого количества перца чили?",
        "explanationRu": "В США говорят 'to go', а в Великобритании 'takeaway' для обозначения еды навынос."
      }
    ],
    "topicRu": "Уличная еда"
  },
  {
    "topic": "Meeting Other Travelers",
    "topicKu": "یەکترناسینی گەشتیارانی تر (لە هۆستێل و گەشتەکان)",
    "topicAr": "التعرف على مسافرين ثانين",
    "words": [
      {
        "english": "Where are you heading next",
        "kurdish": "دواتر بەرەو کوێ دەڕۆیت؟ (وێستگەی داهاتووت کوێیە)",
        "arabic": "وين راح تروح بعدين؟",
        "russian": "Куда направляетесь дальше?"
      },
      {
        "english": "How long have you been traveling",
        "kurdish": "چەندە گەشت دەکەیت؟ (ماوەی چەندە لە گەشتدایت)",
        "arabic": "صارلك شكد تسافر؟",
        "russian": "Как долго вы уже путешествуете?"
      },
      {
        "english": "Any recommendations",
        "kurdish": "هیچ پێشنیارێکت هەیە؟ (بۆ شوێن و خواردن)",
        "arabic": "عندك أي نصائح أو توصيات؟",
        "russian": "Есть какие-нибудь рекомендации?"
      },
      {
        "english": "Solo traveler",
        "kurdish": "گەشتیاری تاقانە (کەسێک بەتەنیا گەشت دەکات)",
        "arabic": "مسافر بوحده",
        "russian": "Путешественник-одиночка (соло-путешественник)"
      },
      {
        "english": "Keep in touch",
        "kurdish": "لە پەیوەندیدا دەبین (مانەوەی پەیوەندی)",
        "arabic": "خلينا على تواصل",
        "russian": "Быть на связи (поддерживать контакт)"
      }
    ],
    "voices": [
      {
        "prompt": "پرسیارکردن لە بەرنامەی داهاتوو",
        "target": "Where are you heading next on your trip?",
        "targetKurdish": "دواتر بەرەو کوێ دەڕۆیت لە گەشتەکەتدا؟",
        "promptAr": "السؤال عن الخطط الجاية",
        "targetArabic": "وين وجهتك الجاية بسفرتك؟",
        "promptRu": "Спросить о дальнейших планах",
        "targetRussian": "Куда ты держишь путь дальше в этой поездке?"
      },
      {
        "prompt": "خواحافیزی کردن لە هاوڕێی نوێ",
        "target": "It was great meeting you. Let's keep in touch!",
        "targetKurdish": "بینینت زۆر خۆش بوو. با لە پەیوەندیدا بین!",
        "promptAr": "توديع صديق جديد",
        "targetArabic": "فرصة سعيدة شفتك. خلينا على تواصل!",
        "promptRu": "Попрощаться с новым другом",
        "targetRussian": "Был очень рад познакомиться. Будем на связи!"
      }
    ],
    "sentences": [
      {
        "english": [
          "Do",
          "you",
          "have",
          "any",
          "recommendations",
          "for",
          "good",
          "restaurants"
        ],
        "kurdish": "هیچ پێشنیارێکت هەیە بۆ چێشتخانەی باش؟",
        "arabic": "عندك أي توصيات لمطاعم زينة؟",
        "russian": "У тебя есть рекомендации по хорошим ресторанам?"
      },
      {
        "english": [
          "I",
          "am",
          "a",
          "solo",
          "traveler",
          "exploring",
          "Europe"
        ],
        "kurdish": "من گەشتیارێکی تاقانەم بە ئەوروپادا دەگەڕێم",
        "arabic": "أني مسافر بوحدي أستكشف أوروبا",
        "russian": "Я соло-путешественник и исследую Европу."
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Where are you",
          "next after you leave here?"
        ],
        "hint": "دواتر بەرەو کوێ دەڕۆیت دوای ئەوەی لێرە دەڕۆیت؟",
        "answer": "heading",
        "wrongs": [
          "going",
          "travel",
          "visiting"
        ],
        "arabicHint": "وين راح تروح بعدين من تطلع منانه؟",
        "arabicParts": [
          "وين راح",
          "بعدين من تطلع منانه؟"
        ],
        "arabicAnswer": "تروح",
        "arabicWrongs": [
          "تذهب",
          "تسافر",
          "تزور"
        ],
        "russianHint": "Куда ты направляешься дальше после того, как уедешь отсюда?",
        "russianParts": [
          "Куда ты ",
          " дальше после того, как уедешь отсюда?"
        ],
        "russianAnswer": "направляешься",
        "russianWrongs": [
          "едешь",
          "путешествуешь",
          "гуляешь"
        ]
      },
      {
        "parts": [
          "I hope we cross paths again. Let's keep in",
          "."
        ],
        "hint": "هیوادارم دووبارە یەکتر ببینینەوە. با لە پەیوەندیدا بین.",
        "answer": "touch",
        "wrongs": [
          "contact",
          "talk",
          "message"
        ],
        "arabicHint": "أتمنى نلتقي مرة ثانية. خلينا على تواصل.",
        "arabicParts": [
          "أتمنى نلتقي مرة ثانية. خلينا على",
          "."
        ],
        "arabicAnswer": "تواصل",
        "arabicWrongs": [
          "اتصال",
          "حديث",
          "رسالة"
        ],
        "russianHint": "Надеюсь, наши пути ещё пересекутся. Давай оставаться на связи.",
        "russianParts": [
          "Надеюсь, мы ещё пересечемся. Давай оставаться на ",
          "."
        ],
        "russianAnswer": "связи",
        "russianWrongs": [
          "контакте",
          "беседе",
          "номере"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "قسەکردن لەگەڵ گەشتیارێکی تر لە هۆتێلەکە",
        "theyAsk": "I just got here yesterday. I've been traveling for a month.",
        "correct": "Wow, a whole month! I'm a solo traveler too. Where are you heading next? Do you have any recommendations for this city?",
        "wrong1": "A month is a long trip. Where are you going next?",
        "wrong2": "I'm traveling alone too. Any favorite places so far?",
        "wrong3": "Do you have any tips for someone new to the city?",
        "explanation": "'Where are you heading next' باوترین پرسیاری نێوان گەشتیارانە",
        "situationAr": "تحجي ويه مسافر ثاني بالفندق",
        "theyAskAr": "أني وصلت هنا البارحة بس. صارلي شهر أسافر.",
        "correctAr": "ما شاء الله، شهر كامل! أني همين مسافر بوحدي. وين وجهتك الجاية؟ وعندك أي نصائح أو أماكن بهالمدينة؟",
        "wrong1Ar": "شهر رحلة طويلة. وين رايح بعدين؟",
        "wrong2Ar": "أني همين مسافر وحدي. اكو أماكن مفضلة لحد هسة؟",
        "wrong3Ar": "عندك نصائح لشخص جديد بهالمدينة؟",
        "explanationAr": "'وين راح تروح بعدين' هو أكثر سؤال ينطرح بين المسافرين",
        "situationRu": "Разговор с другим путешественником в хостеле",
        "theyAskRu": "Я приехал сюда только вчера. Путешествую уже целый месяц.",
        "correctRu": "Ого, целый месяц! Я тоже путешествую один. Куда держишь путь дальше? Есть какие-нибудь советы по этому городу?",
        "wrong1Ru": "Месяц — это долгая поездка. Куда ты едешь дальше?",
        "wrong2Ru": "Я тоже путешествую в одиночку. Есть уже любимые места?",
        "wrong3Ru": "Есть какие-нибудь советы для новичка в этом городе?",
        "explanationRu": "'Where are you heading next' (куда направляешься дальше) — самый распространенный вопрос среди путешественников."
      }
    ],
    "topicRu": "Знакомство с другими путешественниками"
  }
];

export default normalUnit05;
