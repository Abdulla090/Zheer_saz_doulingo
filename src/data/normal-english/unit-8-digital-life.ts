import { UnitBank } from "../types";

// ── Unit 8: Digital Life — 10 unique lessons ─────────────────────────────────
// Texting, social media, work chats, video calls, digital etiquette and boundaries.

const unit08: UnitBank = [
  {
    "topic": "Texting Basics",
    "topicKu": "نامەنووسینی ئاسایی",
    "topicAr": "اساسيات المراسلة",
    "words": [
      {
        "english": "Hey, are you free to talk later?",
        "kurdish": "سڵاو، ئایا دواتر کاتت هەیە بۆ قسەکردن؟",
        "arabic": "هلا، تكدر تحجي بعدين؟",
        "russian": "Привет, свободен поболтать позже?"
      },
      {
        "english": "Just checking in — how's your day going?",
        "kurdish": "تەنها دەمویست بزانم — ڕۆژەکەت چۆنە؟",
        "arabic": "ردت بس اتطمن — شلون يومك؟",
        "russian": "Просто узнать, как дела — как твой день проходит?"
      },
      {
        "english": "Sorry, I missed your call — what's up?",
        "kurdish": "ببوورە، پەیوەندیتم لەدەستدا — چی هەیە؟",
        "arabic": "اسف، فاتني اتصالك — شكو شصاير؟",
        "russian": "Прости, пропустил твой звонок — что случилось?"
      },
      {
        "english": "Can you send me the address when you get a chance?",
        "kurdish": "دەتوانیت ناونیشانەکەم بۆ بنێریت کاتێک بۆت هات؟",
        "arabic": "تكدر تدزلي العنوان من يصير عندك مجال؟",
        "russian": "Можешь скинуть адрес, как будет время?"
      },
      {
        "english": "Got it — I'll be there in ten minutes.",
        "kurdish": "تێگەیشتم — لە دە خولەکدا دەگەم.",
        "arabic": "افتهمت — عشر دقايق واكون يمك.",
        "russian": "Понял — буду минут через десять."
      },
      {
        "english": "Running a bit late, be there soon!",
        "kurdish": "کەمێک دواکەوتم، بەم زووانە دەگەم!",
        "arabic": "تأخرت شوية، راح اوصل قريب!",
        "russian": "Немного опаздываю, скоро буду!"
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "You up?",
        "targetKurdish": "بەخەبەری؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "كاعد؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Не спишь?"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Wrong number, sorry!",
        "targetKurdish": "ژمارەی هەڵە، ببوورە!",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "رقم غلط، اسف!",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Ошибся номером, извини!"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Call me when you land.",
        "targetKurdish": "کاتێک گەیشتی پەیوەندیم پێوە بکە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "خابرني من توصل.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Набери меня, как приземлишься."
      }
    ],
    "sentences": [
      {
        "english": [
          "My",
          "phone",
          "died",
          "earlier"
        ],
        "kurdish": "مۆبایلەکەم پێشتر باتریی نەما.",
        "arabic": "خلص شحن تلفوني قبل شوية.",
        "russian": "У меня раньше сел телефон"
      },
      {
        "english": [
          "Text",
          "me",
          "the",
          "details"
        ],
        "kurdish": "وردەکارییەکان بۆم بنێرە.",
        "arabic": "دزلي التفاصيل برسالة.",
        "russian": "Скинь мне подробности в сообщении"
      },
      {
        "english": [
          "I'll",
          "hit",
          "you",
          "up",
          "tomorrow"
        ],
        "kurdish": "سبەی پەیوەندیت پێوە دەکەم.",
        "arabic": "راح اتواصل وياك باجر.",
        "russian": "Я черкану тебе завтра"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Sorry, I ",
          " your call."
        ],
        "hint": "ببوورە، پەیوەندیتم لەدەست دا.",
        "answer": "missed",
        "wrongs": [
          "lost",
          "dropped",
          "failed"
        ],
        "arabicHint": "اسف، فاتني اتصالك.",
        "arabicParts": [
          "اسف، ",
          " اتصالك."
        ],
        "arabicAnswer": "فاتني",
        "arabicWrongs": [
          "ضاعت",
          "خلصت",
          "طارت"
        ],
        "russianHint": "Прости, я пропустил твой звонок.",
        "russianParts": [
          "Прости, я ",
          " твой звонок."
        ],
        "russianAnswer": "пропустил",
        "russianWrongs": [
          "потерял",
          "сбросил",
          "забыл"
        ]
      },
      {
        "parts": [
          "I'll ",
          " you back in five."
        ],
        "hint": "لە پێنج خولەکدا نامەت بۆ دەنێرمەوە.",
        "answer": "text",
        "wrongs": [
          "write",
          "speak",
          "answer"
        ],
        "arabicHint": "راح ادزلك رسالة بعد خمس دقايق.",
        "arabicParts": [
          "راح ",
          " رسالة بعد خمس دقايق."
        ],
        "arabicAnswer": "ادزلك",
        "arabicWrongs": [
          "اخابرك",
          "اقرالك",
          "اشوفك"
        ],
        "russianHint": "Я напишу тебе через пять минут.",
        "russianParts": [
          "Я ",
          " тебе через пять минут."
        ],
        "russianAnswer": "напишу",
        "russianWrongs": [
          "позвоню",
          "крикну",
          "скажу"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "هاوڕێیەکت نامەیەک دەنێرێت بۆ دڵنیابوونەوە",
        "situationAr": "صديقك يدز رسالة حتى يتأكد",
        "theyAsk": "Hey! Still good for lunch today?",
        "theyAskAr": "هلا! بعدنا على موعد الغدا اليوم؟",
        "correct": "Yep, still on! Running a bit late though — be there in ten minutes.",
        "correctAr": "اي، بعدنا على الاتفاق! بس متأخر شوية — عشر دقايق واكون يمك.",
        "wrong1": "I think lunch still works for me.",
        "wrong1Ar": "اتوقع الغدا بعده يناسبني.",
        "wrong2": "I may be a few minutes late.",
        "wrong2Ar": "يجوز اتأخر كم دقيقة.",
        "wrong3": "Can I confirm with you in a little while?",
        "wrong3Ar": "اكدر اكدلك بعد شوية؟",
        "explanation": "'Running a bit late' و 'be there soon' زۆر باون لە نامەنووسیدا بۆ دواکەوتن",
        "explanationAr": "'Running a bit late' و'be there soon' كلش شائعة بالرسايل حتى تعبر عن التأخير",
        "situationRu": "Друг пишет уточнить насчёт встречи",
        "theyAskRu": "Привет! Всё в силе насчёт обеда сегодня?",
        "correctRu": "Да, всё в силе! Только немного опаздываю — буду минут через десять.",
        "wrong1Ru": "Обед это хорошо.",
        "wrong2Ru": "Я не знаю где ты.",
        "wrong3Ru": "Может быть не приду.",
        "explanationRu": "'Running a bit late' (немного опаздываю) и 'be there soon' (скоро буду) — самые частые фразы в переписке."
      },
      {
        "situation": "هاوکارێک ناونیشانی شوێنی کۆبوونەوە داوات لێدەکات",
        "situationAr": "زميلك يطلب منك عنوان مكان الاجتماع",
        "theyAsk": "Where exactly are we meeting for the interview prep?",
        "theyAskAr": "وين بالضبط راح نلتقي حتى نتحضر للمقابلة؟",
        "correct": "Can you send me the address when you get a chance? I'll share it with the team.",
        "correctAr": "تكدر تدزلي العنوان من يصير عندك مجال؟ راح اشاركه ويا الفريق.",
        "wrong1": "I think we're meeting downtown.",
        "wrong1Ar": "اتوقع راح نلتقي بمركز المدينة.",
        "wrong2": "I don't have the exact address yet.",
        "wrong2Ar": "بعد ما عندي العنوان المضبوط.",
        "wrong3": "Let me look up the location.",
        "wrong3Ar": "خليني ادور على الموقع.",
        "explanation": "'When you get a chance' — شێوەیەکی نەرمە بۆ داواکردن لە نامەدا",
        "explanationAr": "'When you get a chance' — طريقة مؤدبة حتى تطلب شي بالرسايل",
        "situationRu": "Коллега спрашивает точное место встречи",
        "theyAskRu": "Где именно мы встречаемся для подготовки к собеседованию?",
        "correctRu": "Можешь скинуть мне адрес, как освободишься? Я перешлю его команде.",
        "wrong1Ru": "Адрес в интернете.",
        "wrong2Ru": "Я сам не знаю где это.",
        "wrong3Ru": "Найди адрес сам.",
        "explanationRu": "'When you get a chance' (как появится возможность) — вежливый способ попросить об услуге в сообщении."
      }
    ],
    "topicRu": "Основы переписки"
  },
  {
    "topic": "Quick Replies",
    "topicKu": "وەڵامە خێراکان",
    "topicAr": "الردود السريعة",
    "words": [
      {
        "english": "Sounds good — see you then!",
        "kurdish": "باشە — ئەو کاتە دەبینینەوە!",
        "arabic": "خوش حجي — اشوفك بذاك الوقت!",
        "russian": "Отлично — тогда до встречи!"
      },
      {
        "english": "On my way now.",
        "kurdish": "ئێستا لە ڕێگادام.",
        "arabic": "اني بالطريق هسة.",
        "russian": "Уже еду / уже в пути."
      },
      {
        "english": "Can't talk right now — I'll text you back.",
        "kurdish": "ئێستا ناتوانم قسە بکەم — دواتر نامەت دەنێرم.",
        "arabic": "ما اكدر احجي هسة — ادزلك رسالة بعدين.",
        "russian": "Сейчас не могу говорить — напишу позже."
      },
      {
        "english": "Thanks for letting me know!",
        "kurdish": "سوپاس بۆ ئاگادارکردنم!",
        "arabic": "شكرا لان بلغتني!",
        "russian": "Спасибо, что предупредил!"
      },
      {
        "english": "Will do — thanks!",
        "kurdish": "ئەنجام دەدەم — سوپاس!",
        "arabic": "راح اسويها — شكرا!",
        "russian": "Сделаю — спасибо!"
      },
      {
        "english": "LOL, that's hilarious.",
        "kurdish": "هاها، زۆر پێکەنیناویە.",
        "arabic": "هاها، كلش تضحك.",
        "russian": "Лол, это умора (очень смешно)."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Bet.",
        "targetKurdish": "باشە، ڕێککەوتین.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "اتفقنا.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Договорились. / Без базара."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "No worries at all.",
        "targetKurdish": "هیچ کێشەیەک نییە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "ماكو اي مشكلة.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Вообще никаких проблем."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Same here!",
        "targetKurdish": "منیش هەروەها!",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "واني همين!",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Взаимно! / У меня тоже!"
      }
    ],
    "sentences": [
      {
        "english": [
          "Yeah,",
          "for",
          "sure"
        ],
        "kurdish": "بەڵێ، بێگومان.",
        "arabic": "اي، اكيد.",
        "russian": "Да, сто процентов"
      },
      {
        "english": [
          "Let",
          "me",
          "get",
          "back",
          "to",
          "you"
        ],
        "kurdish": "با دواتر وەڵامت بدەمەوە.",
        "arabic": "خليني ارجعلك بالجواب.",
        "russian": "Дай мне вернуться к тебе с ответом"
      },
      {
        "english": [
          "That",
          "works",
          "for",
          "me"
        ],
        "kurdish": "ئەوە بۆ من گونجاوە.",
        "arabic": "هذا يفيدني.",
        "russian": "Мне это подходит"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "I'm ",
          " my way now."
        ],
        "hint": "ئێستا لە ڕێگادام.",
        "answer": "on",
        "wrongs": [
          "in",
          "at",
          "by"
        ],
        "arabicHint": "اني بالطريق هسة.",
        "arabicParts": [
          "اني ",
          " هسة."
        ],
        "arabicAnswer": "بالطريق",
        "arabicWrongs": [
          "بالبيت",
          "بالشغل",
          "بالسيارة"
        ],
        "russianHint": "Я уже в пути.",
        "russianParts": [
          "Я уже в ",
          " ."
        ],
        "russianAnswer": "пути",
        "russianWrongs": [
          "дороге",
          "доме",
          "машине"
        ]
      },
      {
        "parts": [
          "Sorry, I can't talk right ",
          " ."
        ],
        "hint": "ببوورە، ئێستا ناتوانم قسە بکەم.",
        "answer": "now",
        "wrongs": [
          "here",
          "then",
          "away"
        ],
        "arabicHint": "اسف، ما اكدر احجي هسة.",
        "arabicParts": [
          "اسف، ما اكدر احجي ",
          " ."
        ],
        "arabicAnswer": "هسة",
        "arabicWrongs": [
          "دائماً",
          "قبل",
          "هناك"
        ],
        "russianHint": "Извини, я прямо сейчас не могу говорить.",
        "russianParts": [
          "Извини, не могу говорить прямо ",
          " ."
        ],
        "russianAnswer": "сейчас",
        "russianWrongs": [
          "здесь",
          "тут",
          "сегодня"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "هاوڕێیەک کات و شوێنی کۆبوونەوە دەنێرێت",
        "situationAr": "صديقك يدز وقت ومكان اللقاء",
        "theyAsk": "Movie starts at 7:30 — meet at the lobby?",
        "theyAskAr": "الفيلم يبدي بالسبعة ونص — نلتقي بالصالة؟",
        "correct": "Sounds good — see you then! On my way now.",
        "correctAr": "خوش فكرة — اشوفك بذاك الوقت! اني بالطريق هسة.",
        "wrong1": "I thought the movie started at eight.",
        "wrong1Ar": "عبالي الفيلم يبدي بالثمانية.",
        "wrong2": "Could we meet by the entrance instead?",
        "wrong2Ar": "نكدر نلتقي يم المدخل بدالها؟",
        "wrong3": "I should be able to make it.",
        "wrong3Ar": "المفروض اكدر اوصل.",
        "explanation": "'On my way' و 'see you then' وەڵامە خێرا و ئاساییەکانن",
        "explanationAr": "'On my way' و'see you then' ردود سريعة وشائعة",
        "situationRu": "Друг уточняет время и место встречи",
        "theyAskRu": "Фильм начинается в 7:30 — встретимся в холле?",
        "correctRu": "Отлично — тогда до встречи! Я уже в пути.",
        "wrong1Ru": "Фильм идёт долго.",
        "wrong2Ru": "Холл слишком большой.",
        "wrong3Ru": "Я не люблю кинотеатры.",
        "explanationRu": "'On my way' и 'see you then' — классические быстрые ответы перед встречей."
      },
      {
        "situation": "مامۆستایەکت لە ڕێگادا نامە دەنێرێت",
        "situationAr": "استاذك يدزلك رسالة وانت بالطريق",
        "theyAsk": "Please submit your essay before midnight tonight.",
        "theyAskAr": "يا ريت تسلم المقال قبل نص الليل اليوم.",
        "correct": "Will do — thanks! I'll send it in a couple of hours.",
        "correctAr": "حاضر وتدلل — شكراً! راح ادزه خلال ساعتين.",
        "wrong1": "I'm still working on the essay.",
        "wrong1Ar": "بعدني دا اشتغل على المقال.",
        "wrong2": "I'll try to finish it before the deadline.",
        "wrong2Ar": "راح احاول اخلصه قبل الموعد.",
        "wrong3": "Thanks for the reminder.",
        "wrong3Ar": "شكراً على التذكير.",
        "explanation": "'Will do' واتای 'ئەنجام دەدەم' — کورت و پیشەیی",
        "explanationAr": "'Will do' تعني 'راح اسويها' — قصيرة ورسمية",
        "situationRu": "Преподаватель или начальник пишет напоминание",
        "theyAskRu": "Пожалуйста, сдайте эссе сегодня до полуночи.",
        "correctRu": "Сделаю — спасибо! Отправлю через пару часов.",
        "wrong1Ru": "Полночь это слишком поздно.",
        "wrong2Ru": "Я не хочу писать эссе.",
        "wrong3Ru": "Завтра сдам.",
        "explanationRu": "'Will do' означает 'будет сделано' — краткий и вежливый деловой ответ."
      }
    ],
    "topicRu": "Быстрые ответы"
  },
  {
    "topic": "Social Media Posts",
    "topicKu": "پۆستەکانی تۆڕە کۆمەڵایەتییەکان",
    "topicAr": "منشورات التواصل الاجتماعي",
    "words": [
      {
        "english": "So excited to share this news with you all!",
        "kurdish": "زۆر دڵخۆشم کە ئەم هەواڵە لەگەڵ هەمووتاندا هاوبەش دەکەم!",
        "arabic": "كلش متحمس اشارك هالخبر وياكم كلكم!",
        "russian": "Так рада поделиться с вами этой новостью!"
      },
      {
        "english": "Throwback to an amazing trip last summer.",
        "kurdish": "گەڕانەوە بۆ گەشتێکی ناوازەی هاوینەی پێشوو.",
        "arabic": "ذكرى سفرة تخبل بالصيف الراح.",
        "russian": "Воспоминания о потрясающей поездке прошлым летом."
      },
      {
        "english": "Grateful for everyone who showed up today.",
        "kurdish": "سوپاسگوزارم بۆ هەموو کەسێک کە ئەمڕۆ هات.",
        "arabic": "ممتن لكل اللي حضروا اليوم.",
        "russian": "Благодарен всем, кто сегодня пришёл."
      },
      {
        "english": "Can't believe how fast this year is going.",
        "kurdish": "باوەڕ ناکەم ئەم ساڵە چەندە خێرا تێدەپەڕێت.",
        "arabic": "ما اصدك شكد هالسنة دتمشي سريع.",
        "russian": "Не верится, как быстро летит этот год."
      },
      {
        "english": "Link in bio if you want to learn more.",
        "kurdish": "لینک لە بایۆدا هەیە ئەگەر دەتەوێت زیاتر بزانیت.",
        "arabic": "الرابط بالبايو اذا تريد تعرف اكثر.",
        "russian": "Ссылка в шапке профиля, если хотите узнать больше."
      },
      {
        "english": "Drop a comment if you've been here too!",
        "kurdish": "کۆمێنت بنووسە ئەگەر تۆش لێرە بوویت!",
        "arabic": "خلي تعليق اذا انت همين جنت هنا!",
        "russian": "Оставь комментарий, если тоже здесь бывал!"
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Swipe up for the full story.",
        "targetKurdish": "بۆ چیرۆکی تەواو بەرەو سەرەوە بیجوڵێنە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "اسحب لي فوك حتى تشوف القصة كاملة.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Смахни вверх, чтобы прочитать всю историю."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Tag someone who needs to see this.",
        "targetKurdish": "کەسێک تاگ بکە کە پێویستە ئەمە ببینێت.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "سوي تاك لشخص يحتاج يشوف هذا.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Отметь того, кому нужно это увидеть."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "New post, same old me.",
        "targetKurdish": "پۆستی نوێ، هەمان کەسی جاران.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "منشور جديد، واني نفس ما اني.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Новый пост, всё тот же я."
      }
    ],
    "sentences": [
      {
        "english": [
          "Happy",
          "birthday",
          "to",
          "my",
          "best",
          "friend"
        ],
        "kurdish": "ڕۆژی لەدایکبوونت پیرۆز، باشترین هاوڕێم.",
        "arabic": "عيد ميلاد سعيد لاعز اصدقائي.",
        "russian": "С днём рождения моего лучшего друга"
      },
      {
        "english": [
          "We",
          "finally",
          "made",
          "it",
          "official"
        ],
        "kurdish": "لە کۆتاییدا فەرمیمان کرد.",
        "arabic": "اخيرا اعلناها رسمي.",
        "russian": "Мы наконец-то объявили об этом официально"
      },
      {
        "english": [
          "Big",
          "things",
          "coming",
          "soon"
        ],
        "kurdish": "شتی گەورە بەم زووانە دێت.",
        "arabic": "اشياء جبيرة جاية قريب.",
        "russian": "Скоро будет кое-что грандиозное"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Link in ",
          " if you want the recipe."
        ],
        "hint": "ئەگەر ڕەچەتەکەت دەوێت، لینکەکە لە بایۆدایە.",
        "answer": "bio",
        "wrongs": [
          "page",
          "post",
          "story"
        ],
        "arabicHint": "الرابط بالبايو اذا تريد الوصفة.",
        "arabicParts": [
          "الرابط ",
          " اذا تريد الوصفة."
        ],
        "arabicAnswer": "بالبايو",
        "arabicWrongs": [
          "بالصفحة",
          "بالمنشور",
          "بالستوري"
        ],
        "russianHint": "Ссылка в описании профиля, если хочешь рецепт.",
        "russianParts": [
          "Ссылка в ",
          " профиля, если хочешь рецепт."
        ],
        "russianAnswer": "описании",
        "russianWrongs": [
          "посте",
          "тексте",
          "ленте"
        ]
      },
      {
        "parts": [
          "",
          " a comment and let me know!"
        ],
        "hint": "کۆمێنتێک بنووسە و پێم بڵێ!",
        "answer": "Drop",
        "wrongs": [
          "Fall",
          "Throw",
          "Put"
        ],
        "arabicHint": "اكتب تعليق وگلي!",
        "arabicParts": [
          "",
          " تعليق وگلي!"
        ],
        "arabicAnswer": "اكتب",
        "arabicWrongs": [
          "اقرأ",
          "احذف",
          "سوي"
        ],
        "russianHint": "Оставь комментарий и дай мне знать!",
        "russianParts": [
          "",
          " комментарий и дай мне знать!"
        ],
        "russianAnswer": "Оставь",
        "russianWrongs": [
          "Сбрось",
          "Кинь",
          "Пиши"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "هاوڕێیەکت دەپرسێت چۆن پۆستێکی ئاهەنگ بنووسیت",
        "situationAr": "صديقك يسألك شلون يكتب منشور لحفلة",
        "theyAsk": "How should I caption my birthday party photos?",
        "theyAskAr": "شنو اكتب كابشن على صور حفلة عيد ميلادي؟",
        "correct": "Something like 'Grateful for everyone who showed up today' — keep it warm and personal.",
        "correctAr": "اكتب شي مثل 'ممتن لكل شخص حضر اليوم' — خلي الكلام دافي ومقرب للكلب.",
        "wrong1": "You could simply write, 'Best birthday ever.'",
        "wrong1Ar": "تكدر ببساطة تكتب، 'احسن عيد ميلاد بالدنيا'.",
        "wrong2": "A short caption might work best.",
        "wrong2Ar": "كابشن قصير يجوز يكون احسن شي.",
        "wrong3": "You could use a quote that fits the photos.",
        "wrong3Ar": "تكدر تستخدم اقتباس يناسب الصور.",
        "explanation": "'Grateful for everyone who...' شێوازێکی گەرم و ڕاستەوخۆیە بۆ پۆست",
        "explanationAr": "'Grateful for everyone who...' اسلوب دافي وشخصي للمنشورات",
        "situationRu": "Друг спрашивает, какую подпись сделать к праздничным фото",
        "theyAskRu": "Как мне подписать фотки со дня рождения?",
        "correctRu": "Например: 'Благодарен всем, кто сегодня пришёл' — душевно и искренне.",
        "wrong1Ru": "Напиши просто 'Привет'.",
        "wrong2Ru": "Не пиши подпись вообще.",
        "wrong3Ru": "Напиши список гостей.",
        "explanationRu": "'Grateful for everyone who...' — тёплая и естественная подпись для личного блога."
      },
      {
        "situation": "بازرگانی بچووک داوای یارمەتی دەکات بۆ پۆستێکی بەرهەم",
        "situationAr": "مشروع صغير يطلب مساعدة بمنشور لمنتج",
        "theyAsk": "I want people to visit our new online store.",
        "theyAskAr": "اريد الناس يزورون متجرنا الالكتروني الجديد.",
        "correct": "Try 'Link in bio if you want to learn more' — it's short and works on every platform.",
        "correctAr": "جرب 'الرابط بالبايو لمعرفة المزيد' — عبارة قصيرة وترهم بكل المنصات.",
        "wrong1": "Try a direct line like, 'Shop our new collection now.'",
        "wrong1Ar": "جرب جملة مباشرة مثل، 'تسوق مجموعتنا الجديدة هسة'.",
        "wrong2": "Explain what makes the store different.",
        "wrong2Ar": "اشرح شنو اللي يميز متجرك.",
        "wrong3": "Mention that the store is now open.",
        "wrong3Ar": "اذكر انه المتجر انفتح هسة.",
        "explanation": "'Link in bio' زاراوەیەکی ستانداردە لە ئینستاگرام و تیکتۆک",
        "explanationAr": "'Link in bio' مصطلح كلش شائع بالانستغرام وتيك توك",
        "situationRu": "Малый бизнес просит совета по посту о новом товаре",
        "theyAskRu": "Я хочу, чтобы люди переходили в наш новый онлайн-магазин.",
        "correctRu": "Попробуй 'Ссылка в шапке профиля, если хотите узнать больше' — коротко и понятно на любой платформе.",
        "wrong1Ru": "Позвоните нам по телефону.",
        "wrong2Ru": "Магазин открыт с девяти.",
        "wrong3Ru": "Купите прямо сейчас.",
        "explanationRu": "'Link in bio' — стандартная фраза для призыва к переходу по ссылке в соцсетях."
      }
    ],
    "topicRu": "Посты в соцсетях"
  },
  {
    "topic": "Professional Email",
    "topicKu": "ئیمەیڵی پیشەیی",
    "topicAr": "الايميل الرسمي",
    "words": [
      {
        "english": "I hope this email finds you well.",
        "kurdish": "هیوادارم باش بیت.",
        "arabic": "اتمنى توصلك هالرسالة وانت بخير.",
        "russian": "Надеюсь, у вас всё благополучно. (Стандартное деловое приветствие)"
      },
      {
        "english": "Please find the attached document for your review.",
        "kurdish": "تکایە سەیری بەڵگەنامە هاوپێچکراوەکە بکە بۆ پێداچوونەوە.",
        "arabic": "يا ريت تشوف الملف المرفق وتراجعه.",
        "russian": "В приложении направляю документ на ознакомление."
      },
      {
        "english": "I'd appreciate your feedback by Friday if possible.",
        "kurdish": "سوپاسگوزار دەبم بۆ فیدباکەکەت تا ئەگەر بتوانن هەینی.",
        "arabic": "اكون ممتن اذا تنطيني ملاحظاتك قبل يوم الجمعة اذا تكدر.",
        "russian": "Буду признателен за обратную связь до пятницы, если возможно."
      },
      {
        "english": "Thank you for your time and consideration.",
        "kurdish": "سوپاس بۆ کات و سەرنجت.",
        "arabic": "شكرا لوقتك واهتمامك.",
        "russian": "Благодарю вас за уделённое время и внимание."
      },
      {
        "english": "Please let me know if you have any questions.",
        "kurdish": "تکایە پێم بڵێ ئەگەر هیچ پرسیارێکت هەیە.",
        "arabic": "يا ريت تبلغني اذا عندك اي اسئلة.",
        "russian": "Пожалуйста, дайте знать, если у вас возникнут вопросы."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Apologies for the delayed response.",
        "targetKurdish": "داوای لێبوردن دەکەم بۆ دواکەوتنی وەڵامەکە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "اعتذر عن التأخير بالرد.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Прошу прощения за задержку с ответом."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Looping in Sarah on this thread.",
        "targetKurdish": "سارا لەم گفتوگۆیەدا زیاد دەکەم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "راح اضيف سارة لهالمحادثة.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Подключаю Сару к этой переписке."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Let me know a time that works for you.",
        "targetKurdish": "کاتێکم پێ بڵێ کە بۆت گونجاوە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "گلي بوقت يفيدك.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Дайте знать, какое время вам удобно."
      }
    ],
    "sentences": [
      {
        "english": [
          "Best",
          "regards,",
          "Daniel"
        ],
        "kurdish": "لەگەڵ ڕێزی زۆر، دانیال.",
        "arabic": "مع اطيب التحيات، دانيال.",
        "russian": "С наилучшими пожеланиями, Дэниел"
      },
      {
        "english": [
          "I've",
          "copied",
          "my",
          "manager",
          "here"
        ],
        "kurdish": "بەڕێوەبەرەکەمم لێرەدا زیاد کردووە.",
        "arabic": "ضفت مديري بنسخة هنا.",
        "russian": "Я поставил своего руководителя в копию"
      },
      {
        "english": [
          "Just",
          "a",
          "quick",
          "reminder",
          "about",
          "tomorrow"
        ],
        "kurdish": "تەنها بیرخستنەوەیەکی خێرا دەربارەی سبەی.",
        "arabic": "بس تذكير سريع بخصوص باجر.",
        "russian": "Просто краткое напоминание о завтрашнем дне"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Please ",
          " the attached file for your review."
        ],
        "hint": "تکایە فایلی هاوپێچکراو ببینە بۆ پێداچوونەوە.",
        "answer": "find",
        "wrongs": [
          "look",
          "search",
          "watch"
        ],
        "arabicHint": "يا ريت تشوف الملف المرفق وتراجعه.",
        "arabicParts": [
          "يا ريت ",
          " الملف المرفق وتراجعه."
        ],
        "arabicAnswer": "تشوف",
        "arabicWrongs": [
          "تدور",
          "تباوع",
          "تسمع"
        ],
        "russianHint": "Ознакомьтесь с прикреплённым файлом.",
        "russianParts": [
          "Направляю документ во ",
          " для ознакомления."
        ],
        "russianAnswer": "вложении",
        "russianWrongs": [
          "ответе",
          "ссылке",
          "тексте"
        ]
      },
      {
        "parts": [
          "I'm writing to ",
          " up on our conversation."
        ],
        "hint": "دەنووسم بۆ بەدواداچوونی گفتوگۆکەمان.",
        "answer": "follow",
        "wrongs": [
          "catch",
          "call",
          "bring"
        ],
        "arabicHint": "دا اكتبلك حتى اتابع حديثنا.",
        "arabicParts": [
          "دا اكتبلك حتى ",
          " حديثنا."
        ],
        "arabicAnswer": "اتابع",
        "arabicWrongs": [
          "الغي",
          "انسى",
          "اغير"
        ],
        "russianHint": "Я пишу, чтобы вернуться к нашему разговору.",
        "russianParts": [
          "Пишу в продолжение нашего ",
          " ."
        ],
        "russianAnswer": "разговора",
        "russianWrongs": [
          "письма",
          "дела",
          "звонка"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "پاش گفتوگۆیەکی کار داوای بەدواداچوون دەکەیت",
        "situationAr": "بعد محادثة شغل تريد تتابع",
        "theyAsk": "Hi, what did you need from our call yesterday?",
        "theyAskAr": "مرحبا، شتحتاج بخصوص اتصالنا البارحة؟",
        "correct": "I'm writing to follow up on our conversation. Please find the attached document for your review.",
        "correctAr": "دا اكتبلك حتى اتابع موضوع محادثتنا. يا ريت تشوف الملف المرفق وتراجعه.",
        "wrong1": "I wanted to ask about the next steps from our call.",
        "wrong1Ar": "ردت اسأل عن الخطوات الجاية بعد اتصالنا.",
        "wrong2": "Thanks again for speaking with me yesterday.",
        "wrong2Ar": "شكراً مرة ثانية لان حجيت وياي البارحة.",
        "wrong3": "Could you review the document I mentioned?",
        "wrong3Ar": "تكدر تراجع المستند اللي ذكرته؟",
        "explanation": "'I'm writing to follow up' — دەستپێکی ستانداردی ئیمەیڵی پیشەیی",
        "explanationAr": "'I'm writing to follow up' — بداية اعتيادية بالايميل الرسمي",
        "situationRu": "После делового созвона нужно отправить материалы",
        "theyAskRu": "Привет, что тебе нужно было по итогам вчерашнего созвона?",
        "correctRu": "Я пишу в продолжение нашего вчерашнего разговора. Во вложении направляю документ на ознакомление.",
        "wrong1Ru": "Мне нужен ответ срочно.",
        "wrong2Ru": "Вчера было плохо слышно.",
        "wrong3Ru": "Ты забыл отправить файл.",
        "explanationRu": "'I'm writing to follow up' — классическое деловое начало письма после встречи или звонка."
      },
      {
        "situation": "ئیمەیڵێک بۆ کڕیار دەنێریت",
        "situationAr": "دتدز ايميل لعميل",
        "theyAsk": "Can you send over the proposal we discussed?",
        "theyAskAr": "تكدر تدزلي المقترح اللي تناقشنا بيه؟",
        "correct": "Please find the attached document for your review. I'd appreciate your feedback by Friday if possible.",
        "correctAr": "يا ريت تشوف الملف المرفق وتراجعه. اكون ممتن اذا تنطيني رأيك قبل يوم الجمعة اذا تكدر.",
        "wrong1": "I've attached the proposal we discussed.",
        "wrong1Ar": "ارفقت المقترح اللي حجينه بيه.",
        "wrong2": "I'll send the proposal later today.",
        "wrong2Ar": "راح ادز المقترح بوقت لاحق اليوم.",
        "wrong3": "Please review the proposal when you have time.",
        "wrong3Ar": "يا ريت تراجع المقترح من يصير عندك وكت.",
        "explanation": "'Please find attached' و 'I'd appreciate your feedback by...' زۆر فەرمی و پیشەیین",
        "explanationAr": "'Please find attached' و'I'd appreciate your feedback by...' كلش رسميات",
        "situationRu": "Отправка коммерческого предложения клиенту",
        "theyAskRu": "Можете прислать предложение, которое мы обсуждали?",
        "correctRu": "Во вложении направляю документ на ознакомление. Буду признателен за обратную связь до пятницы, если возможно.",
        "wrong1Ru": "Вот файл, читайте.",
        "wrong2Ru": "Жду ответ немедленно.",
        "wrong3Ru": "Надеюсь вы согласитесь.",
        "explanationRu": "'Please find attached' и 'I'd appreciate your feedback by...' — эталон вежливого делового тона."
      }
    ],
    "topicRu": "Деловая переписка"
  },
  {
    "topic": "Online Meetings",
    "topicKu": "کۆبوونەوەی ئۆنلاین",
    "topicAr": "الاجتماعات الاونلاين",
    "words": [
      {
        "english": "Can everyone see my screen?",
        "kurdish": "هەمووان دەتوانن شاشەکەم ببینن؟",
        "arabic": "الكل يكدر يشوف شاشتي؟",
        "russian": "Всем виден мой экран?"
      },
      {
        "english": "Can everyone hear me okay?",
        "kurdish": "دەتوانیت هەمووتان بە باشی بیستم؟",
        "arabic": "الكل يسمعني زين؟",
        "russian": "Меня всем хорошо слышно?"
      },
      {
        "english": "Sorry, my connection dropped for a second.",
        "kurdish": "ببوورە، پەیوەندییەکەم بۆ چرکەیەک پچڕا.",
        "arabic": "اسف، فصل النت عندي لحظة.",
        "russian": "Извините, у меня на секунду пропала связь."
      },
      {
        "english": "I'll drop off early but I'll read the notes.",
        "kurdish": "زوو دەچمە دەرەوە بەڵام تێبینییەکان دەخوێنمەوە.",
        "arabic": "راح اطلع من وكت بس راح اقرا الملاحظات.",
        "russian": "Я отключусь пораньше, но прочитаю протокол встречи."
      },
      {
        "english": "Let's take this offline and discuss separately.",
        "kurdish": "با ئەمە لە دەرەوەی ئێرە باسبکەین بە جیا.",
        "arabic": "خلي نناقش هذا برة الاجتماع بشكل منفصل.",
        "russian": "Давайте обсудим этот вопрос отдельно за рамками встречи."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Sorry, go ahead — you first.",
        "targetKurdish": "ببوورە، تۆ بەردەوام بە — تۆ پێشتر.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "اسف، تفضل انت اول.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Извини, говори — ты первый."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I have a hard stop at noon.",
        "targetKurdish": "دەبێت لە نیوەڕۆ بەتەواوی کۆتایی پێ بهێنم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "لازم اخلص الظهر.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Мне обязательно нужно отключиться ровно в полдень."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Can we circle back to that?",
        "targetKurdish": "دەتوانین دواتر بگەڕێینەوە بۆ ئەوە؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "نكدر نرجع لهذا الشي بعدين؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Можем вернуться к этому вопросу чуть позже?"
      }
    ],
    "sentences": [
      {
        "english": [
          "I'll",
          "put",
          "that",
          "in",
          "the",
          "chat"
        ],
        "kurdish": "ئەوە لە چاتەکەدا دادەنێم.",
        "arabic": "راح اخليها بالجات.",
        "russian": "Я скину это в чат"
      },
      {
        "english": [
          "My",
          "camera",
          "isn't",
          "working",
          "today"
        ],
        "kurdish": "کامێراکەم ئەمڕۆ کار ناکات.",
        "arabic": "الكاميرا مداتشتغل عندي اليوم.",
        "russian": "У меня сегодня не работает камера"
      },
      {
        "english": [
          "Who's",
          "taking",
          "notes",
          "for",
          "this",
          "one"
        ],
        "kurdish": "کێ تێبینی بۆ ئەمە دەنووسێت؟",
        "arabic": "منو راح يكتب ملاحظات هالاجتماع؟",
        "russian": "Кто ведёт записи на этой встрече?"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "You're on ",
          " — we can't hear you."
        ],
        "hint": "دەنگت داخراوە — نەتدەبیستین.",
        "answer": "mute",
        "wrongs": [
          "quiet",
          "silence",
          "pause"
        ],
        "arabicHint": "المايك مسدود — مدنسمعك.",
        "arabicParts": [
          "المايك ",
          " — مدنسمعك."
        ],
        "arabicAnswer": "مسدود",
        "arabicWrongs": [
          "مفتوح",
          "عالي",
          "خربان"
        ],
        "russianHint": "У тебя выключен микрофон — мы тебя не слышим.",
        "russianParts": [
          "У тебя выключен ",
          " — мы тебя не слышим."
        ],
        "russianAnswer": "микрофон",
        "russianWrongs": [
          "звук",
          "экран",
          "телефон"
        ]
      },
      {
        "parts": [
          "Let me ",
          " my screen real quick."
        ],
        "hint": "با خێرا شاشەکەم هاوبەش بکەم.",
        "answer": "share",
        "wrongs": [
          "show",
          "send",
          "open"
        ],
        "arabicHint": "خليني اشارك شاشتي بسرعة.",
        "arabicParts": [
          "خليني ",
          " شاشتي بسرعة."
        ],
        "arabicAnswer": "اشارك",
        "arabicWrongs": [
          "اسد",
          "احذف",
          "اطفي"
        ],
        "russianHint": "Давай я быстро расшарю свой экран.",
        "russianParts": [
          "Давай я быстро покажу свой ",
          " ."
        ],
        "russianAnswer": "экран",
        "russianWrongs": [
          "файл",
          "звук",
          "текст"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "لە Zoom کۆبوونەوەیەکدا کەسێک قسە دەکات بەڵام دەنگ نییە",
        "situationAr": "باجتماع زووم واحد يحجي بس ماكو صوت",
        "theyAsk": "So as I was saying about the budget...",
        "theyAskAr": "مثل ما جنت دا اكول بخصوص الميزانية...",
        "correct": "Sorry to interrupt — you're on mute, we can't hear you.",
        "correctAr": "اسف على المقاطعة — صوتك مسدود، مدنسمعك.",
        "wrong1": "Sorry, I can't hear you right now.",
        "wrong1Ar": "اسف، ما اكدر اسمعك هسة.",
        "wrong2": "Could you repeat the point about the budget?",
        "wrong2Ar": "تكدر تعيد النقطة الخاصة بالميزانية؟",
        "wrong3": "I think your microphone may be off.",
        "wrong3Ar": "اتوقع المايكروفون مالتك مسدود.",
        "explanation": "'You're on mute' گرنگترین ڕستەیە لە کۆبوونەوەی ئۆنلایندا",
        "explanationAr": "'You're on mute' اهم جملة بالاجتماعات الاونلاين",
        "situationRu": "Коллега говорит на созвоне в Zoom, но звука нет",
        "theyAskRu": "Итак, как я уже говорил по поводу бюджета...",
        "correctRu": "Извини, что перебиваю — ты на мьюте, мы тебя не слышим.",
        "wrong1Ru": "Говори громче.",
        "wrong2Ru": "Твой бюджет плохой.",
        "wrong3Ru": "Мы ничего не хотим слышать.",
        "explanationRu": "'You're on mute' (ты замьючен / на беззвучном) — главная фраза эпохи онлайн-конференций."
      },
      {
        "situation": "بابەتێک تەنها بۆ دوو کەس گرنگە",
        "situationAr": "موضوع يهم بس شخصين",
        "theyAsk": "Should we go over the salary details in this meeting?",
        "theyAskAr": "لازم نراجع تفاصيل الرواتب بهذا الاجتماع؟",
        "correct": "Let's take this offline and discuss separately — the rest of the team doesn't need to hear it.",
        "correctAr": "خلي نناقش هذا الموضوع برة الاجتماع بشكل منفصل — باقي الفريق ما يحتاج يسمع هذا الشي.",
        "wrong1": "Could we discuss the salary details after this meeting?",
        "wrong1Ar": "نكدر نناقش تفاصيل الرواتب بعد هذا الاجتماع؟",
        "wrong2": "I think that conversation should stay private.",
        "wrong2Ar": "اعتقد هاي المحادثة لازم تبقى خاصة.",
        "wrong3": "Let's schedule a separate call for that topic.",
        "wrong3Ar": "خلي نحدد مكالمة منفصلة لهذا الموضوع.",
        "explanation": "'Take this offline' واتای گفتوگۆ لە دەرەوەی کۆبوونەوە — زۆر باوە لە کاردا",
        "explanationAr": "'Take this offline' يعني نناقش الموضوع برة الاجتماع — كلش شائعة بالشغل",
        "situationRu": "Тема касается только двух участников звонка",
        "theyAskRu": "Стоит ли нам разобрать детали зарплат на этой общей встрече?",
        "correctRu": "Давайте вынесем это за рамки встречи и обсудим отдельно — остальным участникам это слушать ни к чему.",
        "wrong1Ru": "Да, говори всем зарплаты.",
        "wrong2Ru": "Мне не интересно.",
        "wrong3Ru": "Встреча закончена.",
        "explanationRu": "'Take this offline' означает обсудить узкий или чувствительный вопрос отдельно, не задерживая всех."
      }
    ],
    "topicRu": "Онлайн-встречи"
  },
  {
    "topic": "Comments & Reactions",
    "topicKu": "کۆمێنت و کاردانەوە",
    "topicAr": "التعليقات والتفاعلات",
    "words": [
      {
        "english": "That comment made my day.",
        "kurdish": "ئەو کۆمێنتە ڕۆژەکەمی خۆش کرد.",
        "arabic": "هالتعليق فرحني اليوم.",
        "russian": "Этот комментарий поднял мне настроение на весь день."
      },
      {
        "english": "Love this — where did you get it?",
        "kurdish": "زۆر حەزم لێیە — لە کوێت وەرگرت؟",
        "arabic": "حبيت هذا — منين جبته؟",
        "russian": "Обожаю это — где ты это взял?"
      },
      {
        "english": "Sending good vibes your way!",
        "kurdish": "هیوای باشت بۆ دەنێرم!",
        "arabic": "ادزلك طاقة ايجابية!",
        "russian": "Посылаю тебе лучи добра и позитива!"
      },
      {
        "english": "So proud of you — keep it up!",
        "kurdish": "زۆر شانازیم — بەردەوام بە!",
        "arabic": "كلش فخور بيك — استمر!",
        "russian": "Так горжусь тобой — продолжай в том же духе!"
      },
      {
        "english": "Great point — I hadn't thought about that.",
        "kurdish": "خاڵێکی باش — من بیرم لێ نەکردبوو.",
        "arabic": "خوش نقطة — مفكرت بيها.",
        "russian": "Отличная мысль — я об этом даже не подумал."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Okay, this is amazing.",
        "targetKurdish": "باشە، ئەمە نایابە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "زين، هذا يخبل.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Так, это просто потрясающе."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Not gonna lie, I'm jealous.",
        "targetKurdish": "درۆ ناکەم، ئیرەییم پێت دەبرێت.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "بصراحة، احسدك.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Не буду врать, я по-хорошему завидую."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Saving this for later!",
        "targetKurdish": "ئەمە بۆ دواتر هەڵدەگرم!",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "راح احفظها لبعدين!",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Сохраняю себе в закладки!"
      }
    ],
    "sentences": [
      {
        "english": [
          "This",
          "is",
          "so",
          "cool"
        ],
        "kurdish": "ئەمە زۆر سەرنجڕاکێشە.",
        "arabic": "هذا كلش حلو.",
        "russian": "Это так здорово"
      },
      {
        "english": [
          "You",
          "look",
          "so",
          "happy",
          "here"
        ],
        "kurdish": "لێرەدا زۆر دڵخۆش دیاری.",
        "arabic": "مبين كلش فرحان هنا.",
        "russian": "Ты здесь выглядишь такой счастливой"
      },
      {
        "english": [
          "Wait,",
          "tell",
          "me",
          "more"
        ],
        "kurdish": "چاوەڕێ بە، زیاتر پێم بڵێ!",
        "arabic": "اوكف، گلي اكثر!",
        "russian": "Погоди, расскажи поподробнее"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "",
          " — you totally deserve this!"
        ],
        "hint": "پیرۆزبایی — بەتەواوی شایەنی ئەمەی!",
        "answer": "Congrats",
        "wrongs": [
          "Congratulate",
          "Congratulation",
          "Welcome"
        ],
        "arabicHint": "مبروك — تستاهل هذا الشي كلش!",
        "arabicParts": [
          "",
          " — تستاهل هذا الشي كلش!"
        ],
        "arabicAnswer": "مبروك",
        "arabicWrongs": [
          "هلا",
          "عفواً",
          "صباح الخير"
        ],
        "russianHint": "Поздравляю — ты абсолютно это заслужил!",
        "russianParts": [
          "",
          " — ты абсолютно это заслужил!"
        ],
        "russianAnswer": "Поздравляю",
        "russianWrongs": [
          "Привет",
          "Спасибо",
          "Удачи"
        ]
      },
      {
        "parts": [
          "This made my ",
          " — thanks for sharing."
        ],
        "hint": "ئەمە ڕۆژەکەمی خۆش کرد — سوپاس بۆ هاوبەشکردنی.",
        "answer": "day",
        "wrongs": [
          "time",
          "week",
          "hour"
        ],
        "arabicHint": "هذا الشي فرحني اليوم — شكرا ع المشاركة.",
        "arabicParts": [
          "هذا الشي فرحني ",
          " — شكرا ع المشاركة."
        ],
        "arabicAnswer": "اليوم",
        "arabicWrongs": [
          "البارحة",
          "باجر",
          "العام"
        ],
        "russianHint": "Это сделало мой день — спасибо, что поделился.",
        "russianParts": [
          "Это сделало мой ",
          " — спасибо, что поделился."
        ],
        "russianAnswer": "день",
        "russianWrongs": [
          "год",
          "вечер",
          "час"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "هاوڕێیەک پۆستی بەرزکردنەوەی کار دەکات",
        "situationAr": "صديق ينشر انه ترقى بالشغل",
        "theyAsk": "I just got promoted to team lead!",
        "theyAskAr": "ترقيت هسة وصرت مسؤول الفريق!",
        "correct": "Congrats — you totally deserve this! So proud of you — keep it up!",
        "correctAr": "الف مبروك — تستاهلها بجدارة! كلش فخور بيك — استمر يا بطل!",
        "wrong1": "Congratulations on the promotion!",
        "wrong1Ar": "تهانينا على الترقية!",
        "wrong2": "That's great news—well done.",
        "wrong2Ar": "هاي اخبار حلوة — احسنت.",
        "wrong3": "You must be excited about the new role.",
        "wrong3Ar": "اكيد انت كلش متحمس للدور الجديد.",
        "explanation": "'You totally deserve this' و 'so proud of you' کۆمێntە گەرم و ڕاستەقینەکانن",
        "explanationAr": "'You totally deserve this' و'so proud of you' تعليقات دافية وصادقة",
        "situationRu": "Друг опубликовал пост о повышении по службе",
        "theyAskRu": "Меня только что повысили до тимлида!",
        "correctRu": "Поздравляю — ты абсолютно это заслужил! Так горжусь тобой — продолжай в том же духе!",
        "wrong1Ru": "Теперь будешь много работать.",
        "wrong2Ru": "Тимлидом быть тяжело.",
        "wrong3Ru": "Я тоже хотел это место.",
        "explanationRu": "'You totally deserve this' и 'so proud of you' — лучшие поддерживающие комментарии к успеху."
      },
      {
        "situation": "کەسێک وێنەی خواردن هاوبەش دەکات",
        "situationAr": "شخص يشارك صورة اكل",
        "theyAsk": "Tried a new recipe tonight — what do you think?",
        "theyAskAr": "جربت وصفة جديدة الليلة — شنو رأيك؟",
        "correct": "Love this — where did you get the recipe? This made my day.",
        "correctAr": "تخبل عاشت ايدك — منين جبت الوصفة؟ غيرتلي مودي وفرحتني.",
        "wrong1": "That looks interesting—how did it turn out?",
        "wrong1Ar": "شكلها ملفت — شلون طلعت بالنهاية؟",
        "wrong2": "I've never tried that recipe before.",
        "wrong2Ar": "عمري ما مجرب هاي الوصفة قبل.",
        "wrong3": "What ingredients did you use?",
        "wrong3Ar": "شنو المكونات اللي استخدمتها؟",
        "explanation": "'Love this' و 'where did you get it?' گفتوگۆ درێژ دەکەنەوە بە شێوەیەکی ئاسایی",
        "explanationAr": "'Love this' و'where did you get it?' تطول السالفة بشكل طبيعي",
        "situationRu": "Знакомый выложил фото необычного блюда",
        "theyAskRu": "Попробовал новый рецепт сегодня вечером — как вам?",
        "correctRu": "Обожаю такое — где ты нашёл этот рецепт? Это фото сделало мой вечер.",
        "wrong1Ru": "Еда выглядит странно.",
        "wrong2Ru": "Я такое не ем.",
        "wrong3Ru": "Слишком много калорий.",
        "explanationRu": "'Love this' и вопросы о подробностях показывают неподдельный интерес к публикации."
      }
    ],
    "topicRu": "Комментарии и реакции"
  },
  {
    "topic": "Group Chats",
    "topicKu": "گفتوگۆی گروپی",
    "topicAr": "محادثات الكروبات",
    "words": [
      {
        "english": "I muted the group for an hour.",
        "kurdish": "گرووپەکەم بۆ کاتژمێرێک بێدەنگ کرد.",
        "arabic": "سويت كتم للمجموعة ساعة.",
        "russian": "Я заглушил уведомления группы на час."
      },
      {
        "english": "Who's bringing snacks to the party?",
        "kurdish": "کێ خواردنی سووک دەهێنێت بۆ ئاهەنگ؟",
        "arabic": "منو راح يجيب الحبشكلات للحفلة؟",
        "russian": "Кто берёт с собой закуски на вечеринку?"
      },
      {
        "english": "Can we move this to a private message?",
        "kurdish": "دەتوانین ئەمە بگوازینەوە بۆ نامەی تایبەت؟",
        "arabic": "نكدر نحولها رسايل خاصة؟",
        "russian": "Можем перейти с этим в личные сообщения?"
      },
      {
        "english": "React with a thumbs up if you're in.",
        "kurdish": "بە پەنجە بەرز ڕێژە بدە ئەگەر بەشداری دەکەیت.",
        "arabic": "سوي لايك اذا انت موافق.",
        "russian": "Поставьте палец вверх (лайк), кто с нами."
      },
      {
        "english": "Let's pin the important info at the top.",
        "kurdish": "با زانیاری گرنگ لە سەرەوە جێگیر بکەین.",
        "arabic": "خلي نثبت المعلومات المهمة فوك.",
        "russian": "Давайте закрепим важную информацию наверху."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I'm down for Saturday.",
        "targetKurdish": "بۆ ڕۆژی شەممە ئامادەم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "اني موافق ع السبت.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Я за субботу."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Muting this until tomorrow, sorry!",
        "targetKurdish": "تا سبەی ئەمە بێدەنگ دەکەم، ببوورە!",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "راح اكتم هالجات لباجر، اسف!",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Ставлю чат на беззвучный режим до завтра, извиняйте!"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Somebody please explain what happened.",
        "targetKurdish": "تکایە کەسێک ڕوونی بکاتەوە چی ڕوویدا.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "فدوة واحد يشرحلي شصار.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Кто-нибудь, объясните, пожалуйста, что тут произошло."
      }
    ],
    "sentences": [
      {
        "english": [
          "Count",
          "me",
          "in"
        ],
        "kurdish": "منیش لەگەڵ.",
        "arabic": "حسبوني وياكم.",
        "russian": "Я в деле / запишите меня"
      },
      {
        "english": [
          "I'll",
          "bring",
          "the",
          "drinks"
        ],
        "kurdish": "من خواردنەوەکان دەهێنم.",
        "arabic": "اني اجيب المشروبات.",
        "russian": "Я возьму напитки"
      },
      {
        "english": [
          "Did",
          "anyone",
          "see",
          "my",
          "last",
          "message"
        ],
        "kurdish": "کەس نامەی کۆتاییم بینی؟",
        "arabic": "احد شاف رسالتي الاخيرة؟",
        "russian": "Кто-нибудь видел моё последнее сообщение?"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Sorry for the ",
          " — wrong chat!"
        ],
        "hint": "ببوورە بۆ ئەم نامە زۆرەکان — چاتی هەڵە!",
        "answer": "spam",
        "wrongs": [
          "noise",
          "trouble",
          "mess"
        ],
        "arabicHint": "اسف ع الرسايل الهواية — جات غلط!",
        "arabicParts": [
          "اسف ع ",
          " — جات غلط!"
        ],
        "arabicAnswer": "الازعاج",
        "arabicWrongs": [
          "الصوت",
          "الهدوء",
          "الضحك"
        ],
        "russianHint": "Извините за спам — не тот чат!",
        "russianParts": [
          "Извините за ",
          " — ошибся чатом!"
        ],
        "russianAnswer": "спам",
        "russianWrongs": [
          "шум",
          "флуд",
          "крик"
        ]
      },
      {
        "parts": [
          "I'll create a ",
          " so we can vote."
        ],
        "hint": "دەنگدانێک دروست دەکەم تا بتوانین دەنگ بدەین.",
        "answer": "poll",
        "wrongs": [
          "list",
          "note",
          "vote"
        ],
        "arabicHint": "راح اسوي تصويت حتى نكدر نختار.",
        "arabicParts": [
          "راح اسوي ",
          " حتى نكدر نختار."
        ],
        "arabicAnswer": "تصويت",
        "arabicWrongs": [
          "قائمة",
          "ملاحظة",
          "اتصال"
        ],
        "russianHint": "Я сделаю опрос, чтобы мы могли проголосовать.",
        "russianParts": [
          "Я создам ",
          " , чтобы мы могли проголосовать."
        ],
        "russianAnswer": "опрос",
        "russianWrongs": [
          "список",
          "пост",
          "файл"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "گروپێک پلانی ئاهەنگ دادەنێت",
        "situationAr": "كروب ديخطط لحفلة",
        "theyAsk": "Okay team — we need to figure out food for Saturday.",
        "theyAskAr": "يلا شباب — لازم نقرر شنو ناكل يوم السبت.",
        "correct": "Who's bringing snacks? I'll create a poll so we can vote on the main dishes too.",
        "correctAr": "منو راح يجيب السناكات؟ راح اسوي تصويت حتى نختار الاكلات الرئيسية همين.",
        "wrong1": "I can bring some snacks on Saturday.",
        "wrong1Ar": "اكدر اجيب شوية سناكات يوم السبت.",
        "wrong2": "Should we make a list of what everyone is bringing?",
        "wrong2Ar": "لازم نسوي قائمة باللي راح يجيبه كل واحد؟",
        "wrong3": "Let's decide on the food later today.",
        "wrong3Ar": "خلي نقرر بخصوص الاكل بوقت لاحق اليوم.",
        "explanation": "'Who's bringing...?' و 'create a poll' ڕێگەیەکی ڕێک و پێک بۆ گروپ",
        "explanationAr": "'Who's bringing...?' و'create a poll' طريقة مرتبة لادارة الكروب",
        "situationRu": "В чате планируют вечеринку на выходные",
        "theyAskRu": "Так, народ — нужно решить, что по еде в субботу.",
        "correctRu": "Кто возьмёт закуски? Я создам опрос, чтобы мы заодно проголосовали за основные блюда.",
        "wrong1Ru": "Каждый пусть ест дома.",
        "wrong2Ru": "Я не хочу скидываться.",
        "wrong3Ru": "Суббота не подходит.",
        "explanationRu": "'Create a poll' (сделать опрос) — самый удобный способ принять решение в группе без хаоса."
      },
      {
        "situation": "بابەتێکی تایبەت لە گروپی گشتی دەست پێدەکات",
        "situationAr": "موضوع شخصي يبدي بكروب عام",
        "theyAsk": "Hey, about that personal issue we talked about...",
        "theyAskAr": "مرحبا، بخصوص الموضوع الشخصي اللي حجينه بيه...",
        "correct": "Can we move this to a private message? The whole group doesn't need to see it.",
        "correctAr": "نكدر نحول هالموضوع للخاص؟ مو لازم الكروب كله يشوف هذا الشي.",
        "wrong1": "I'll message you separately about that.",
        "wrong1Ar": "راح ادزلك رسالة منفصلة بخصوص هذا.",
        "wrong2": "Could we continue this conversation one-on-one?",
        "wrong2Ar": "نكدر نكمل هالمحادثة بيناتنا بس؟",
        "wrong3": "Let's talk about the personal details later.",
        "wrong3Ar": "خلي نحجي بالتفاصيل الشخصية بعدين.",
        "explanation": "'Move this to a private message' — ئەدەبی دیجیتاڵ بۆ بابەتی تایبەت",
        "explanationAr": "'Move this to a private message' — من ذوقيات التواصل الرقمي للمواضيع الشخصية",
        "situationRu": "Кто-то начал писать личные подробности в общий чат",
        "theyAskRu": "Слушай, насчёт той личной проблемы, о которой мы говорили...",
        "correctRu": "Можем перейти в личные сообщения? Всему чату незачем это читать.",
        "wrong1Ru": "Расскажи всем подробнее.",
        "wrong2Ru": "Не пиши мне вообще.",
        "wrong3Ru": "Мне всё равно.",
        "explanationRu": "'Move this to DMs / private message' — цифровой этикет для переноса приватных тем из общего чата."
      }
    ],
    "topicRu": "Групповые чаты"
  },
  {
    "topic": "Digital Boundaries",
    "topicKu": "سنوورەکانی دیجیتاڵ",
    "topicAr": "الحدود الرقمية",
    "words": [
      {
        "english": "I don't check messages after work.",
        "kurdish": "دوای کار سەیری نامەکان ناکەم.",
        "arabic": "ما اشوف الرسايل بعد الدوام.",
        "russian": "Я не проверяю рабочие сообщения после окончания рабочего дня."
      },
      {
        "english": "I don't check work email after seven.",
        "kurdish": "دوای حەوت ئیمەیڵی کار ناپشکنم.",
        "arabic": "ما اجيك ايميل الشغل ورة السبعة.",
        "russian": "Я не проверяю рабочую почту после семи вечера."
      },
      {
        "english": "Let's schedule a call instead of texting back and forth.",
        "kurdish": "با پەیوەندییەک بخەینە خشتە لەجیاتی نامەنووسی.",
        "arabic": "خلي نحدد موعد مكالمة بدل ما نتبادل رسايل.",
        "russian": "Давай созвонимся вместо этой бесконечной переписки."
      },
      {
        "english": "I saw your message — I'll reply when I'm free.",
        "kurdish": "نامەکەم بینی — کاتێک کاتم هەبوو وەڵام دەدەمەوە.",
        "arabic": "شفت رسالتك — راح ارد من يصير عندي مجال.",
        "russian": "Я видел твоё сообщение — отвечу, как только освобожусь."
      },
      {
        "english": "Please don't share my number without asking.",
        "kurdish": "تکایە ژمارەکەم بەبێ پرسیار هاوبەش مەکە.",
        "arabic": "يا ريت متشاركون رقمي بدون ما تكلولي.",
        "russian": "Пожалуйста, не делись моим номером, не спросив меня."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I'm off the clock right now.",
        "targetKurdish": "ئێستا لە کاتی کاردا نیم.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "اني برة وقت الشغل هسة.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "У меня сейчас нерабочее время."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Let's pick this up Monday morning.",
        "targetKurdish": "با بەیانی دووشەممە بەردەوام بین لەسەری.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "خلي نكملها الصبح يوم الاثنين.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Давайте вернёмся к этому в понедельник утром."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "My notifications are off after nine.",
        "targetKurdish": "دوای نۆ ئاگادارکردنەوەکانم کوژاونەتەوە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "اسد الاشعارات ورة التسعة.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "У меня отключены уведомления после девяти вечера."
      }
    ],
    "sentences": [
      {
        "english": [
          "I",
          "need",
          "a",
          "break",
          "from",
          "my",
          "phone"
        ],
        "kurdish": "پێویستم بە پشوویەکە لە مۆبایلەکەم.",
        "arabic": "احتاج ريست من تلفوني.",
        "russian": "Мне нужно отдохнуть от телефона"
      },
      {
        "english": [
          "Weekends",
          "are",
          "for",
          "family"
        ],
        "kurdish": "کۆتایی هەفتە بۆ خێزانە.",
        "arabic": "العطلة مالت نهاية الاسبوع للعائلة.",
        "russian": "Выходные дни предназначены для семьи"
      },
      {
        "english": [
          "I",
          "unfollowed",
          "a",
          "few",
          "accounts"
        ],
        "kurdish": "چەند هەژمارێکم لە شوێنکەوتن لابرد.",
        "arabic": "لغيت متابعة كم حساب.",
        "russian": "Я отписался от нескольких аккаунтов"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Please only text me if it's ",
          " ."
        ],
        "hint": "تکایە تەنها کاتێک نامەم بۆ بنێرە کە پەلەیە.",
        "answer": "urgent",
        "wrongs": [
          "quick",
          "serious",
          "sudden"
        ],
        "arabicHint": "فدوة بس دزلي اذا الموضوع كلش ضروري.",
        "arabicParts": [
          "فدوة بس دزلي اذا الموضوع كلش ",
          " ."
        ],
        "arabicAnswer": "ضروري",
        "arabicWrongs": [
          "سريع",
          "عادي",
          "بسيط"
        ],
        "russianHint": "Пожалуйста, пиши мне только если это срочно.",
        "russianParts": [
          "Пожалуйста, пиши мне только если дело ",
          " ."
        ],
        "russianAnswer": "срочное",
        "russianWrongs": [
          "быстрое",
          "важное",
          "простое"
        ]
      },
      {
        "parts": [
          "I'm taking a social media ",
          " this week."
        ],
        "hint": "ئەم هەفتەیە پشوویەک لە تۆڕە کۆمەڵایەتییەکان وەردەگرم.",
        "answer": "break",
        "wrongs": [
          "stop",
          "rest",
          "pause"
        ],
        "arabicHint": "راح اخذ ريست من السوشيال ميديا هاسبوع.",
        "arabicParts": [
          "راح اخذ ",
          " من السوشيال ميديا هاسبوع."
        ],
        "arabicAnswer": "استراحة",
        "arabicWrongs": [
          "وقفة",
          "هدوء",
          "فاصل"
        ],
        "russianHint": "На этой неделе я беру перерыв от соцсетей (цифровой детокс).",
        "russianParts": [
          "Я беру ",
          " от соцсетей на этой неделе."
        ],
        "russianAnswer": "перерыв",
        "russianWrongs": [
          "отпуск",
          "паузу",
          "отдых"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "هاوکارێک نامە دەنێرێت دوای کاتژمێری کار",
        "situationAr": "زميل يدز رسالة ورة وقت الشغل",
        "theyAsk": "Sorry to bother you tonight — can you look at this report?",
        "theyAskAr": "اسف دازعجك بالليل — تكدر تشوف هذا التقرير؟",
        "correct": "I saw your message — I'll reply when I'm free tomorrow. I don't check work email after seven.",
        "correctAr": "شفت رسالتك — راح اجاوبك باجر من اكون فارغ. اني ما افتح ايميل الشغل ورة السبعة.",
        "wrong1": "I won't be able to review it until tomorrow.",
        "wrong1Ar": "ما راح اكدر اراجعه لحد باجر.",
        "wrong2": "I'll take a look first thing in the morning.",
        "wrong2Ar": "راح اشوفه اول شي الصبح.",
        "wrong3": "Could this wait until work hours tomorrow?",
        "wrong3Ar": "يكدر هذا الشي ينتظر ساعات الدوام باجر؟",
        "explanation": "ڕێکخستنی سنوور بە شێوەیەکی نەرم: 'I'll reply when I'm free' + ڕوونکردنەوەی سنوور",
        "explanationAr": "تخلي حدود بلطف: 'I'll reply when I'm free' + توضح الحدود",
        "situationRu": "Коллега пишет поздно вечером по рабочему вопросу",
        "theyAskRu": "Извини, что беспокою сегодня вечером — можешь взглянуть на этот отчёт?",
        "correctRu": "Я видел твоё сообщение — отвечу завтра, когда освобожусь. Я не проверяю рабочую почту после семи.",
        "wrong1Ru": "Зачем ты мне пишешь ночью?",
        "wrong2Ru": "Твой отчёт ужасен.",
        "wrong3Ru": "Никогда больше не пиши мне.",
        "explanationRu": "Мягкое, но твердое обозначение границ: 'I'll reply when I'm free' + четкое правило рабочего времени."
      },
      {
        "situation": "گفتوگۆیەک زۆر درێژ دەبێت لە نامەدا",
        "situationAr": "محادثة تصير كلش طويلة بالرسايل",
        "theyAsk": "We have like twenty messages about this bug already.",
        "theyAskAr": "صار عدنا فوك العشرين رسالة عن هذا الخلل لحد هسة.",
        "correct": "Let's schedule a call instead of texting back and forth — it'll be faster.",
        "correctAr": "خلي نحدد موعد مكالمة بدال ما نتبادل رسايل رايحة جاية — راح تكون اسرع بهواية.",
        "wrong1": "Could you summarize the issue in one message?",
        "wrong1Ar": "تكدر تلخص المشكلة برسالة وحدة؟",
        "wrong2": "Let's keep the updates in this thread.",
        "wrong2Ar": "خلي التحديثات تبقى بنفس هالمحادثة.",
        "wrong3": "I think a quick call would be easier.",
        "wrong3Ar": "اعتقد مكالمة سريعة تكون اسهل.",
        "explanation": "'Schedule a call instead' — چارەسەرێکی پیشەیی بۆ گفتوگۆی درێژ",
        "explanationAr": "'Schedule a call instead' — حل رسمي للمحادثات الطويلة",
        "situationRu": "Обсуждение проблемы затянулось в текстовых сообщениях",
        "theyAskRu": "У нас по этому багу уже штук двадцать сообщений набралось.",
        "correctRu": "Давай назначим короткий созвон вместо бесконечной переписки — так выйдет намного быстрее.",
        "wrong1Ru": "Перестань писать сообщения.",
        "wrong2Ru": "Я устал читать чат.",
        "wrong3Ru": "Баг не существует.",
        "explanationRu": "'Schedule a call instead of texting back and forth' экономит время при сложных обсуждениях."
      }
    ],
    "topicRu": "Цифровые границы"
  },
  {
    "topic": "Tech Troubleshooting",
    "topicKu": "چارەسەرکردنی کێشەی تەکنەلۆژیا",
    "topicAr": "حل المشاكل التقنية",
    "words": [
      {
        "english": "Try restarting the app first.",
        "kurdish": "سەرەتا هەوڵ بدە ئەپەکە دووبارە پێبکەیتەوە.",
        "arabic": "جرب بالبداية تعيد تشغيل التطبيق.",
        "russian": "Попробуй для начала перезапустить приложение."
      },
      {
        "english": "Have you tried turning it off and on again?",
        "kurdish": "تاقیت کردۆتەوە کوژاندنەوە و دووبارە داگیرساندنەوە؟",
        "arabic": "جربت طفيته وشغلته؟",
        "russian": "Пробовал выключить и снова включить?"
      },
      {
        "english": "Can you send me a screenshot of the error?",
        "kurdish": "دەتوانیت وێنەی شاشەی هەڵەکەم بۆ بنێریت؟",
        "arabic": "تكدر تدزلي سكرين شوت للخطأ؟",
        "russian": "Можешь прислать мне скриншот ошибки?"
      },
      {
        "english": "I think I need to update my phone.",
        "kurdish": "پێم وایە پێویستە مۆبایلەکەم نوێ بکەمەوە.",
        "arabic": "اتوقع احتاج احدث تلفوني.",
        "russian": "Кажется, мне нужно обновить прошивку телефона."
      },
      {
        "english": "Let me restart my router and try again.",
        "kurdish": "با ڕاوتەرەکەم دووبارە داگیرسێنمەوە و هەوڵ بدەمەوە.",
        "arabic": "خليني ارستر الراوتر واجرب مرة الخ.",
        "russian": "Дай я перезагружу роутер и попробую снова."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Try clearing your cache.",
        "targetKurdish": "هەوڵ بدە کاشەکەت پاک بکەیتەوە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "جرب تمسح الكاش.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Попробуй почистить кэш."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "It's been spinning for five minutes.",
        "targetKurdish": "پێنج خولەکە دەسووڕێتەوە.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "صارله خمس دقايق يفتر.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Колесико загрузки крутится уже пять минут."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Are you on the latest version?",
        "targetKurdish": "لەسەر دوایین وەشانیت؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "داتستخدم اخر تحديث؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "У тебя установлена последняя версия?"
      }
    ],
    "sentences": [
      {
        "english": [
          "My",
          "laptop",
          "is",
          "running",
          "really",
          "slow"
        ],
        "kurdish": "لاپتۆپەکەم زۆر خاو کار دەکات.",
        "arabic": "لابتوبي كلش بطيء.",
        "russian": "Мой ноутбук жутко тормозит"
      },
      {
        "english": [
          "I",
          "forgot",
          "my",
          "password",
          "again"
        ],
        "kurdish": "دووبارە وشەی نهێنیم لەبیر کرد.",
        "arabic": "نسيت الباسورد مرة الخ.",
        "russian": "Я снова забыл свой пароль"
      },
      {
        "english": [
          "The",
          "battery",
          "drains",
          "way",
          "too",
          "fast"
        ],
        "kurdish": "باتریەکە زۆر بە خێرایی تەواو دەبێت.",
        "arabic": "الشحن ديخلص كلش سريع.",
        "russian": "Батарея садится слишком быстро"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "My Wi-Fi keeps ",
          " out."
        ],
        "hint": "وای‌فایەکەم بەردەوام دەبڕێت.",
        "answer": "cutting",
        "wrongs": [
          "going",
          "turning",
          "falling"
        ],
        "arabicHint": "الواي فاي يفصل عندي كلش هواية.",
        "arabicParts": [
          "الواي فاي ",
          " عندي كلش هواية."
        ],
        "arabicAnswer": "يفصل",
        "arabicWrongs": [
          "يشتغل",
          "يقوى",
          "يطير"
        ],
        "russianHint": "Мой Wi-Fi постоянно отваливается (обрывается).",
        "russianParts": [
          "У меня постоянно ",
          " Wi-Fi."
        ],
        "russianAnswer": "отваливается",
        "russianWrongs": [
          "уходит",
          "падает",
          "ломается"
        ]
      },
      {
        "parts": [
          "The app ",
          " right when I was submitting."
        ],
        "hint": "ئەپەکە هەر لەو کاتەدا کە دەمنارد، کەوت.",
        "answer": "crashed",
        "wrongs": [
          "closed",
          "stopped",
          "ended"
        ],
        "arabicHint": "التطبيق وكف من جنت ادز.",
        "arabicParts": [
          "التطبيق ",
          " من جنت ادز."
        ],
        "arabicAnswer": "وكف",
        "arabicWrongs": [
          "اشتغل",
          "كمل",
          "فتح"
        ],
        "russianHint": "Приложение вылетело как раз в момент отправки.",
        "russianParts": [
          "Приложение ",
          " прямо во время отправки."
        ],
        "russianAnswer": "вылетело",
        "russianWrongs": [
          "закрылось",
          "упало",
          "зависло"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "هاوکارێک ناتوانێت بچێتە ناو ئەپەکە",
        "situationAr": "زميل ميكدر يفوت للتطبيق",
        "theyAsk": "The login page just spins forever — nothing loads.",
        "theyAskAr": "صفحة تسجيل الدخول بس تفتر للابد — ماكو شي ديحمل.",
        "correct": "Have you tried turning it off and on again? Also, can you send me a screenshot of the error?",
        "correctAr": "جربت تطفي وتشغل مرة ثانية؟ وهمين، تكدر تدزلي لقطة شاشة للخطأ؟",
        "wrong1": "Could you refresh the page and try again?",
        "wrong1Ar": "تكدر تسوي تحديث للصفحة وتجرب مرة ثانية؟",
        "wrong2": "Try signing out and back in.",
        "wrong2Ar": "جرب تسجل خروج وترجع تسجل دخول.",
        "wrong3": "Can you tell me which browser you're using?",
        "wrong3Ar": "تكدر تكلي يا متصفح دتستخدم؟",
        "explanation": "'Have you tried turning it off and on again?' — یەکەم پرسیاری IT لە هەموو شوێنێک",
        "explanationAr": "'Have you tried turning it off and on again?' — اول سؤال بالدعم التقني بكل مكان",
        "situationRu": "Коллега не может войти в рабочий сервис",
        "theyAskRu": "Страница входа просто бесконечно грузится — ничего не открывается.",
        "correctRu": "А ты пробовал перезагрузить устройство? И ещё: можешь прислать мне скриншот ошибки?",
        "wrong1Ru": "Это твоя проблема.",
        "wrong2Ru": "Сервер сгорел наверное.",
        "wrong3Ru": "Купи новый компьютер.",
        "explanationRu": "'Have you tried turning it off and on again?' — легендарная первая рекомендация любой техподдержки."
      },
      {
        "situation": "لە ماڵەوە کاری دوورەوە دەکەیت و ئینتەرنێت لاوازە",
        "situationAr": "تشتغل من البيت والنت ضعيف",
        "theyAsk": "Your video keeps freezing on the call.",
        "theyAskAr": "صورتك دتعلك بالمكالمة.",
        "correct": "Sorry — my Wi-Fi keeps cutting out. Let me restart my router and try again.",
        "correctAr": "اسف — الواي فاي ديقطع عندي. خليني ارستر الراوتر واجرب مرة ثانية.",
        "wrong1": "My connection seems unstable right now.",
        "wrong1Ar": "الاتصال عندي شكله مو مستقر هسة.",
        "wrong2": "I'll turn off my camera to improve the call.",
        "wrong2Ar": "راح اطفي الكاميرا حتى تتحسن المكالمة.",
        "wrong3": "Could we reconnect if the freezing continues?",
        "wrong3Ar": "نكدر نرجع نتصل اذا بقى التعليق؟",
        "explanation": "'Wi-Fi keeps cutting out' و 'restart my router' — زاراوەی ڕۆژانەی کێشەی ئینتەرنێت",
        "explanationAr": "'Wi-Fi keeps cutting out' و'restart my router' — مصطلحات يومية لمشاكل النت",
        "situationRu": "Работаешь из дома и интернет начал барахлить",
        "theyAskRu": "Твоё видео постоянно зависает на звонке.",
        "correctRu": "Простите — у меня постоянно обрывается Wi-Fi. Дайте мне перезагрузить роутер и переподключиться.",
        "wrong1Ru": "Ваши экраны плохие.",
        "wrong2Ru": "Я не хочу говорить.",
        "wrong3Ru": "Это у вас проблемы.",
        "explanationRu": "'Wi-Fi keeps cutting out' и 'restart my router' — естественные выражения для описания сетевых неполадок."
      }
    ],
    "topicRu": "Решение технических проблем"
  },
  {
    "topic": "Digital Etiquette",
    "topicKu": "ئەدەبی دیجیتاڵ",
    "topicAr": "ذوقيات الانترنت",
    "words": [
      {
        "english": "Ask before adding someone to a group.",
        "kurdish": "پێش زیادکردنی کەسێک بۆ گرووپ پرسیاری لێ بکە.",
        "arabic": "استأذن قبل لا تضيف احد للمجموعة.",
        "russian": "Спроси разрешения, прежде чем добавлять кого-то в группу."
      },
      {
        "english": "Thanks for adding me to the group!",
        "kurdish": "سوپاس بۆ زیادکردنم بۆ گروپ!",
        "arabic": "شكرا لان ضفتني للكروب!",
        "russian": "Спасибо, что добавили меня в группу!"
      },
      {
        "english": "Just a heads-up — I'll be offline tomorrow.",
        "kurdish": "تەنها بۆ ئاگادارکردنەوە — سبەی ئۆفلاین دەبم.",
        "arabic": "بس حتى ابلغكم — راح اكون اوفلاين باجر.",
        "russian": "Просто предупреждаю: завтра я буду не в сети."
      },
      {
        "english": "I prefer email over DMs for work stuff.",
        "kurdish": "بۆ کارەکان ئیمەیڵم پێ باشترە لە نامەی تایبەت.",
        "arabic": "افضل الايميل ع الرسايل الخاصة بشغلات الشغل.",
        "russian": "По рабочим вопросам я предпочитаю почту, а не личные сообщения."
      },
      {
        "english": "Thanks for tagging me — I'll respond soon.",
        "kurdish": "سوپاس بۆ تاگکردنم — بەم زووانە وەڵام دەدەمەوە.",
        "arabic": "شكرا ع التاك — راح ارد قريب.",
        "russian": "Спасибо, что тегнул меня — я скоро отвечу."
      }
    ],
    "voices": [
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Reply all was a mistake there.",
        "targetKurdish": "وەڵامدانەوە بۆ هەمووان لەوێ هەڵە بوو.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "الرد ع الكل جان غلطة هناك.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Ответить всем' здесь было ошибкой."
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "Mind if I record the call?",
        "targetKurdish": "کێشەت نییە پەیوەندییەکە تۆمار بکەم؟",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "عندك مانع اذا اسجل المكالمة؟",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Не против, если я запишу этот звонок?"
      },
      {
        "prompt": "چۆن دەڵێیت بە ئینگلیزی:",
        "target": "I'd keep that off the group chat.",
        "targetKurdish": "پێم باشە ئەوە لە چاتی گروپدا نەبێت.",
        "promptAr": "كيف تقول بالإنجليزية:",
        "targetArabic": "افضل هذا الشي مينطرح بكروب الجات.",
        "promptRu": "Как сказать по-английски:",
        "targetRussian": "Я бы не стал выносить это в общий чат."
      }
    ],
    "sentences": [
      {
        "english": [
          "Please",
          "don't",
          "screenshot",
          "this"
        ],
        "kurdish": "تکایە وێنەی شاشە بۆ ئەمە مەگرە.",
        "arabic": "فدوة لتاخذ سكرين لهذا الشي.",
        "russian": "Пожалуйста, не делай скриншот этого"
      },
      {
        "english": [
          "Keep",
          "the",
          "subject",
          "line",
          "short"
        ],
        "kurdish": "دێڕی بابەت کورت ڕابگرە.",
        "arabic": "خلي عنوان الرسالة قصير.",
        "russian": "Делай тему письма краткой"
      },
      {
        "english": [
          "All",
          "caps",
          "reads",
          "like",
          "shouting"
        ],
        "kurdish": "پیتی گەورە وەک هاوارکردن دەخوێندرێتەوە.",
        "arabic": "الاحرف الجبيرة تنقري جنها صياح.",
        "russian": "Текст капслоком воспринимается как крик"
      }
    ],
    "fillBlanks": [
      {
        "parts": [
          "Please use ",
          " when emailing the whole list."
        ],
        "hint": "تکایە کاتێک ئیمەیڵ بۆ هەموو لیستەکە دەنێریت BCC بەکاربهێنە.",
        "answer": "BCC",
        "wrongs": [
          "CC",
          "PDF",
          "URL"
        ],
        "arabicHint": "فدوة استخدم BCC من تدز ايميل للقائمة كلها.",
        "arabicParts": [
          "فدوة استخدم ",
          " من تدز ايميل للقائمة كلها."
        ],
        "arabicAnswer": "BCC",
        "arabicWrongs": [
          "CC",
          "PDF",
          "URL"
        ],
        "russianHint": "Пожалуйста, используйте скрытую копию (BCC) при рассылке по всему списку.",
        "russianParts": [
          "Пожалуйста, используйте ",
          " при рассылке по всему списку."
        ],
        "russianAnswer": "скрытую копию",
        "russianWrongs": [
          "открытую копию",
          "тему",
          "подпись"
        ]
      },
      {
        "parts": [
          "",
          " before you hit send."
        ],
        "hint": "پێش ئەوەی بنێریت دووبارە بپشکنە.",
        "answer": "Double-check",
        "wrongs": [
          "Double-take",
          "Double-book",
          "Double-cross"
        ],
        "arabicHint": "تأكد مرتين قبل ما تدز.",
        "arabicParts": [
          "",
          " قبل ما تدز."
        ],
        "arabicAnswer": "تأكد مرتين",
        "arabicWrongs": [
          "نام شوية",
          "امسح كلشي",
          "سد الشاشة"
        ],
        "russianHint": "Перепроверь всё, прежде чем нажать 'отправить'.",
        "russianParts": [
          "Всё ",
          " , прежде чем нажать 'отправить'."
        ],
        "russianAnswer": "перепроверь",
        "russianWrongs": [
          "прочитай",
          "посмотри",
          "сохрани"
        ]
      }
    ],
    "conversations": [
      {
        "situation": "ئیمەیڵێکت بۆ لیستێکی گەورە دەنێریت",
        "situationAr": "دتدز ايميل لقائمة جبيرة",
        "theyAsk": "Should I put everyone in the To field?",
        "theyAskAr": "لازم اخلي الكل بخانة المرسل إليه؟",
        "correct": "Please use BCC when emailing the whole list — it protects everyone's privacy.",
        "correctAr": "يا ريت تستخدم خاصية BCC من تدز ايميل لكل القائمة — هذا الشي يحمي خصوصية الكل.",
        "wrong1": "You could put the main contacts in the To field.",
        "wrong1Ar": "تكدر تخلي جهات الاتصال الرئيسية بخانة المرسل إليه.",
        "wrong2": "A separate message to each person would protect privacy.",
        "wrong2Ar": "رسالة منفصلة لكل شخص تحمي الخصوصية.",
        "wrong3": "Ask whether everyone is comfortable sharing addresses.",
        "wrong3Ar": "اسأل اذا الكل موافق يشارك ايميلاته.",
        "explanation": "BCC = Blind Copy — ئیمەیڵەکان نیشان نادرێن بۆ هەمووان",
        "explanationAr": "BCC = نسخة مخفية — عناوين الايميل متطلع للكل",
        "situationRu": "Отправка письма большой базе контактов",
        "theyAskRu": "Мне поставить всех получателей в поле 'Кому'?",
        "correctRu": "Пожалуйста, используй поле BCC (скрытая копия) — это защитит конфиденциальность контактов.",
        "wrong1Ru": "Да, поставь всех открыто.",
        "wrong2Ru": "Не отправляй письмо вообще.",
        "wrong3Ru": "Никто не читает почту.",
        "explanationRu": "BCC (Blind Carbon Copy) скрывает чужие адреса от других участников рассылки."
      },
      {
        "situation": "هاوکارێکت لە پۆستدا تاگت کردووە",
        "situationAr": "زميلك سوالك تاك بمنشور",
        "theyAsk": "Hey, can you review this draft when you get a chance?",
        "theyAskAr": "مرحبا، تكدر تراجع هاي المسودة من يصير عندك مجال؟",
        "correct": "Thanks for tagging me — I'll respond soon. Just a heads-up, I'll be offline tomorrow though.",
        "correctAr": "شكراً لان سويتلي تاك — راح ارد قريب. بس حبيت ابلغك اني راح اكون اوفلاين باجر.",
        "wrong1": "I'll review it when I have a chance.",
        "wrong1Ar": "راح اراجعها من يصير عندي وكت.",
        "wrong2": "Thanks for sending the draft over.",
        "wrong2Ar": "شكراً لان دزيت المسودة.",
        "wrong3": "I may not be able to respond until later.",
        "wrong3Ar": "يجوز ما اكدر ارد الا بوقت لاحق.",
        "explanation": "'Thanks for tagging me' + 'heads-up' — ئەدەبی پیشەیی لە تۆڕە کۆمەڵایەتییەکاندا",
        "explanationAr": "'Thanks for tagging me' + 'heads-up' — ذوقيات الشغل ع السوشيال ميديا",
        "situationRu": "Коллега упомянул тебя в посте для ревью",
        "theyAskRu": "Привет, сможешь посмотреть этот черновик, как будет минутка?",
        "correctRu": "Спасибо, что тегнул — скоро отвечу. Только предупреждаю: завтра я весь день офлайн.",
        "wrong1Ru": "Не тегай меня больше.",
        "wrong2Ru": "Черновик плохой.",
        "wrong3Ru": "Я занят другими вещами.",
        "explanationRu": "'Thanks for tagging me' и предупреждение 'heads-up' — признаки профессионального цифрового этикета."
      }
    ],
    "topicRu": "Сетевой этикет"
  }
];

export default unit08;
