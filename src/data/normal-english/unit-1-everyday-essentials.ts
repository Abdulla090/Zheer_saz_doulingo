import { UnitBank } from "../types";

// ── Visible Unit 5: Everyday Essentials — 10 unique lessons ──────────────────
// Practical English for non-native speakers: the real-life language you actually need.

const normalUnit00: UnitBank = [

  // Lesson 0: Making Requests Politely
  {
    topic: "Polite Requests", topicKu: "داواکارییە بەئەدەبەکان", topicAr: "الطلبات المؤدبة", topicRu: "Вежливые просьбы",
    words: [
      { english: "Could you please",  kurdish: "تکایە دەتوانیت", arabic: "تكدر فدوة", russian: "Не могли бы вы" },
      { english: "Would it be possible", kurdish: "ئایا دەکرێت", arabic: "يصير / ممكن", russian: "Можно ли" },
      { english: "I was wondering if",  kurdish: "دەمویست بزانم ئایا", arabic: "جنت داسأل اذا", russian: "Я хотел узнать, можно ли" },
      { english: "I'd appreciate it",   kurdish: "سوپاسگوزار دەبم", arabic: "اكون ممنون", russian: "Был бы признателен" },
      { english: "If you don't mind",   kurdish: "ئەگەر پێت ناخۆش نەبێت", arabic: "اذا ما تمانع", russian: "Если вы не возражаете" },
    ],
    voices: [
      { prompt: "داوایەکی بەئەدەب بکە", target: "Could you please send me the file?", targetKurdish: "تکایە دەتوانیت فایلەکەم بۆ بنێریت؟", promptAr: "اطلب بأدب", targetArabic: "تكدر فدوة تدزلي الملف؟", promptRu: "Вежливо попроси", targetRussian: "Не мог бы ты отправить мне файл, пожалуйста?" },
      { prompt: "داوا بە شێوەی فەرمی", target: "I was wondering if you could help me with this.", targetKurdish: "دەمویست بزانم ئایا دەتوانیت لەمەدا یارمەتیم بدەیت.", promptAr: "اطلب بشكل رسمي", targetArabic: "جنت داسأل اذا تكدر تساعدني بهالشي.", promptRu: "Официальная просьба", targetRussian: "Я хотел спросить, не мог бы ты мне с этим помочь." },
    ],
    sentences: [
      { english: ["Could", "you", "please", "explain", "this"], kurdish: "تکایە دەتوانیت ئەمە ڕوون بکەیتەوە؟", arabic: "تكدر فدوة تشرحلي هذا؟", russian: "Не мог бы ты это объяснить, пожалуйста?" },
      { english: ["I'd", "appreciate", "it", "if", "you", "helped"], kurdish: "زۆر سوپاسگوزار دەبم ئەگەر یارمەتیم بدەیت", arabic: "اكون ممنون كلش اذا ساعدتني", russian: "Был бы признателен, если бы ты помог" },
    ],
    fillBlanks: [
      { parts: ["Could you", "send me the report?"], hint: "تکایە ڕاپۆرتەکەم بۆ بنێرە؟", answer: "please", wrongs: ["kindly", "just", "maybe"], arabicHint: "تكدر فدوة تدزلي التقرير؟", arabicParts: ["تكدر", "تدزلي التقرير؟"], arabicAnswer: "فدوة", arabicWrongs: ["بلطف", "بس", "يجوز"], russianHint: "Не мог бы ты отправить мне отчет, пожалуйста?", russianParts: ["Не мог бы ты", "отправить мне отчет?"], russianAnswer: "пожалуйста", russianWrongs: ["добро", "просто", "может"] },
      { parts: ["I'd", "it if you could check this."], hint: "سوپاسگوزار دەبم ئەگەر ئەمە بپشکنیت.", answer: "appreciate", wrongs: ["prefer", "like", "want"], arabicHint: "اكون ممنون اذا تكدر تجيك هذا.", arabicParts: ["اكون", "اذا تكدر تجيك هذا."], arabicAnswer: "ممنون", arabicWrongs: ["افضل", "احب", "اريد"], russianHint: "Я был бы благодарен, если бы ты это проверил.", russianParts: ["Я был бы", "если бы ты это проверил."], russianAnswer: "благодарен", russianWrongs: ["предпочел", "хотел", "рад"] },
    ],
    conversations: [
      { situation: "لە شوێنی کار داوای یارمەتی دەکەیت", theyAsk: "What do you need?", correct: "I was wondering if you could review my work when you have a moment.", wrong1: "Please review my work.", wrong2: "Can you check my work now?", wrong3: "I need you to see my work.", explanation: "'I was wondering if you could...' — دەربڕینێکی زۆر بەئەدەب و پیشەییە بۆ داواکردن", situationAr: "تطلب مساعدة بمكان الشغل", explanationAr: "'I was wondering if you could...' — تعبير كلش مؤدب واحترافي حتى تطلب شي", theyAskAr: "شتحتاج؟", correctAr: "جنت داسأل اذا تكدر تراجع شغلي من يصير عندك وكت.", wrong1Ar: "فدوة راجع شغلي.", wrong2Ar: "تكدر تجيك شغلي هسة؟", wrong3Ar: "احتاجك تشوف شغلي.", situationRu: "Просишь помощи на работе", theyAskRu: "Что тебе нужно?", correctRu: "Я хотел узнать, не мог бы ты проверить мою работу, когда будет минутка.", wrong1Ru: "Пожалуйста, проверь мою работу.", wrong2Ru: "Можешь проверить мою работу сейчас?", wrong3Ru: "Мне нужно, чтобы ты посмотрел мою работу.", explanationRu: "'I was wondering if you could...' — это очень вежливый и профессиональный способ попросить" },
    ],
  },

  // Lesson 1: Apologizing & Making Excuses
  {
    topic: "Apologizing", topicKu: "داوای لێبوردن کردن", topicAr: "الاعتذار", topicRu: "Извинения",
    words: [
      { english: "I sincerely apologize",  kurdish: "لە ناخەوە داوای لێبوردن دەکەم", arabic: "اعتذر من كل كلبي", russian: "Искренне извиняюсь" },
      { english: "I take full responsibility", kurdish: "بەرپرسیارێتی تەواو لە ئەستۆ دەگرم", arabic: "اتحمل المسؤولية كاملة", russian: "Я беру на себя полную ответственность" },
      { english: "It won't happen again",   kurdish: "جاری دیکە دووبارە نابێتەوە", arabic: "بعد ما تنعاد", russian: "Этого больше не повторится" },
      { english: "I should have",          kurdish: "دەبوایە...", arabic: "جان لازم", russian: "Надо было" },
      { english: "My mistake",             kurdish: "هەڵەی من بوو", arabic: "غلطتي", russian: "Моя вина" },
    ],
    voices: [
      { prompt: "بە فەرمی داوای لێبوردن بکە", target: "I sincerely apologize for the inconvenience.", targetKurdish: "لە ناخەوە داوای لێبوردن دەکەم بۆ ئەم ناڕەحەتییە.", promptAr: "اعتذر بشكل رسمي", targetArabic: "اعتذر من كل كلبي على الازعاج.", promptRu: "Официально извинись", targetRussian: "Искренне извиняюсь за неудобства." },
      { prompt: "بەرپرسیارێتی هەڵبگرە", target: "I take full responsibility for this mistake.", targetKurdish: "بەرپرسیارێتی تەواو لە ئەستۆ دەگرم بۆ ئەم هەڵەیە.", promptAr: "تحمل المسؤولية", targetArabic: "اتحمل المسؤولية كاملة عن هذا الغلط.", promptRu: "Возьми на себя ответственность", targetRussian: "Я беру на себя полную ответственность за эту ошибку." },
    ],
    sentences: [
      { english: ["I", "sincerely", "apologize", "for", "the", "delay"], kurdish: "لە ناخەوە داوای لێبوردن دەکەم بۆ دواکەوتنەکە", arabic: "اعتذر من كل كلبي على التأخير", russian: "Искренне извиняюсь за задержку" },
      { english: ["It", "won't", "happen", "again", "I", "promise"], kurdish: "بەڵێن دەدەم جاری دیکە دووبارە نابێتەوە", arabic: "بعد ما تنعاد، اوعدك", russian: "Обещаю, этого больше не повторится" },
    ],
    fillBlanks: [
      { parts: ["I should", "asked for help sooner."], hint: "دەبوایە زووتر داوای یارمەتیم بکردایە.", answer: "have", wrongs: ["of", "to", "been"], arabicHint: "جان لازم اطلب المساعدة من وكت.", arabicParts: ["جان لازم", "المساعدة من وكت."], arabicAnswer: "اطلب", arabicWrongs: ["اسأل", "اشوف", "ادور"], russianHint: "Надо было попросить о помощи раньше.", russianParts: ["Надо было", "попросить о помощи раньше."], russianAnswer: "Надо было", russianWrongs: ["в", "к", "о"] },
      { parts: ["My", "— I completely forgot the meeting."], hint: "هەڵەی من بوو — تەواو کۆبوونەوەکەم لەبیر چوو.", answer: "mistake", wrongs: ["bad", "fault", "error"], arabicHint: "غلطتي — نسيت الاجتماع كلش.", arabicParts: ["", "— نسيت الاجتماع كلش."], arabicAnswer: "غلطتي", arabicWrongs: ["سيء", "ذنب", "غلط"], russianHint: "Моя вина — я совсем забыл про собрание.", russianParts: ["Моя", "— я совсем забыл про собрание."], russianAnswer: "вина", russianWrongs: ["плохо", "косяк", "ошибка"] },
    ],
    conversations: [
      { situation: "دواکەوتنی پڕۆژەیەک", theyAsk: "Why is the project late?", correct: "I sincerely apologize. I should have communicated the delay earlier — it won't happen again.", wrong1: "I'm sorry the project is late.", wrong2: "I apologize for not communicating sooner.", wrong3: "We ran into several unexpected problems.", explanation: "'I sincerely apologize... it won't happen again' — قبووڵکردنی بەرپرسیارێتییە بەشێوەیەکی پیشەیی", situationAr: "تأخير مشروع", explanationAr: "'I sincerely apologize... it won't happen again' — تقبل المسؤولية بطريقة احترافية", theyAskAr: "ليش المشروع متأخر؟", correctAr: "اعتذر من كل كلبي. جان لازم ابلغ عن التأخير كبل — بعد ما تنعاد.", wrong1Ar: "اسف لان المشروع متأخر.", wrong2Ar: "اني اعتذر على التأخير.", wrong3Ar: "تأخر بسبب مشاكل.", situationRu: "Задержка проекта", theyAskRu: "Почему проект задерживается?", correctRu: "Искренне извиняюсь. Надо было сообщить о задержке раньше — этого больше не повторится.", wrong1Ru: "Извините, проект задерживается.", wrong2Ru: "Я извиняюсь, что не сообщил раньше.", wrong3Ru: "Мы столкнулись с непредвиденными проблемами.", explanationRu: "'I sincerely apologize... it won't happen again' — принятие ответственности в профессиональной манере" },
    ],
  },

  // Lesson 2: Expressing Opinions Formally
  {
    topic: "Expressing Opinions", topicKu: "دەربڕینی بۆچوون", topicAr: "التعبير عن الآراء", topicRu: "Выражение мнения",
    words: [
      { english: "In my view",           kurdish: "بە بڕوای من", arabic: "برأيي", russian: "На мой взгляд" },
      { english: "From my perspective",  kurdish: "لە ڕوانگەی منەوە", arabic: "من وجهة نظري", russian: "С моей точки зрения" },
      { english: "I strongly believe",   kurdish: "بە توندی باوەڕم وایە", arabic: "اعتقد كلش", russian: "Я твердо убежден" },
      { english: "Based on my experience", kurdish: "بەپێی ئەزموونی من", arabic: "حسب خبرتي", russian: "Опираясь на мой опыт" },
      { english: "It seems to me",       kurdish: "وا هەست دەکەم / پێم وایە", arabic: "يبينلي / احس انه", russian: "Мне кажется" },
    ],
    voices: [
      { prompt: "بۆچوونت بە فەرمی دەرببڕە", target: "In my view, this approach is more effective.", targetKurdish: "بە بڕوای من، ئەم ڕێگەیە کاریگەرترە.", promptAr: "عبر عن رأيك بشكل رسمي", targetArabic: "برأيي، هالطريقة تفيد اكثر.", promptRu: "Вырази мнение официально", targetRussian: "На мой взгляд, этот подход эффективнее." },
      { prompt: "پشت بە ئەزموون ببەستە", target: "Based on my experience, communication is key.", targetKurdish: "بەپێی ئەزموونی من، پەیوەندیکردن گرنگترین شتە.", promptAr: "اعتمد على الخبرة", targetArabic: "حسب خبرتي، التواصل هو الأساس.", promptRu: "Опирайся на опыт", targetRussian: "Исходя из моего опыта, общение — это главное." },
    ],
    sentences: [
      { english: ["In", "my", "view", "this", "is", "the", "best", "option"], kurdish: "بە بڕوای من ئەمە باشترین هەڵبژاردەیە", arabic: "برأيي، هذا احسن خيار", russian: "На мой взгляд, это лучший вариант" },
      { english: ["From", "my", "perspective", "we", "need", "more", "time"], kurdish: "لە ڕوانگەی منەوە پێویستمان بە کاتی زیاترە", arabic: "من وجهة نظري، نحتاج وكت اكثر", russian: "С моей точки зрения, нам нужно больше времени" },
    ],
    fillBlanks: [
      { parts: ["In my", ", the second option is stronger."], hint: "بە بڕوای من، هەڵبژاردەی دووەم بەهێزترە.", answer: "view", wrongs: ["mind", "head", "opinion"], arabicHint: "برأيي، الخيار الثاني أقوى.", russianHint: "На мой взгляд, второй вариант сильнее.", russianParts: ["На мой", ", второй вариант сильнее."], russianAnswer: "взгляд", russianWrongs: ["ум", "голова", "мнение"] },
      { parts: ["I strongly", "that teamwork is essential."], hint: "بە توندی باوەڕم وایە کە کارکردن بەیەکەوە زۆر گرنگە.", answer: "believe", wrongs: ["think", "feel", "say"], arabicHint: "اعتقد كلش انه العمل الجماعي ضروري.", russianHint: "Я твердо убежден, что командная работа необходима.", russianParts: ["Я твердо", ", что командная работа необходима."], russianAnswer: "убежден", russianWrongs: ["думаю", "чувствую", "говорю"] },
    ],
    conversations: [
      { situation: "کۆبوونەوەی تیم", theyAsk: "What do you think we should do?", correct: "From my perspective, we should gather more data before deciding. Based on my experience, rushing leads to mistakes.", wrong1: "I think we need more data.", wrong2: "I don't think we should rush this decision.", wrong3: "In my opinion, we need the data first.", explanation: "'From my perspective... Based on my experience' — دوو دەربڕینی جوانن بۆ دەربڕینی بۆچوون", situationAr: "اجتماع الفريق", explanationAr: "'From my perspective... Based on my experience' — تعبيرين كلش زينات حتى تعبر عن رأيك", situationRu: "Собрание команды", theyAskRu: "Как думаешь, что нам делать?", correctRu: "С моей точки зрения, нам нужно собрать больше данных перед принятием решения. Исходя из моего опыта, спешка приводит к ошибкам.", wrong1Ru: "Думаю, нам нужно больше данных.", wrong2Ru: "Не думаю, что нам стоит торопиться с этим решением.", wrong3Ru: "По-моему, нам сначала нужны данные.", explanationRu: "'From my perspective... Based on my experience' — два отличных выражения, чтобы высказать свое мнение" },
    ],
  },

  // Lesson 3: Asking for Clarification
  {
    topic: "Asking for Clarification", topicKu: "داوای ڕوونکردنەوە", topicAr: "طلب التوضيح", topicRu: "Просьба пояснить",
    words: [
      { english: "Could you clarify",    kurdish: "دەتوانیت ڕوونی بکەیتەوە", arabic: "تكدر توضح", russian: "Не могли бы вы пояснить" },
      { english: "What do you mean by", kurdish: "مەبەستت چییە لە", arabic: "شتقصد بـ", russian: "Что вы имеете в виду под" },
      { english: "Could you elaborate",  kurdish: "دەتوانیت زیاتر ڕوونی بکەیتەوە", arabic: "تكدر تشرح اكثر", russian: "Не могли бы вы рассказать подробнее" },
      { english: "Just to confirm",      kurdish: "تەنها بۆ دڵنیابوون", arabic: "بس حتى اتأكد", russian: "Просто чтобы убедиться" },
      { english: "If I understand correctly", kurdish: "ئەگەر باش تێگەیشتبم", arabic: "اذا فهمت صح", russian: "Если я правильно понял" },
    ],
    voices: [
      { prompt: "داوای ڕوونکردنەوە بکە", target: "Could you clarify what you mean by 'urgent'?", targetKurdish: "دەتوانیت ڕوونی بکەیتەوە مەبەستت چییە لە 'بەپەلە'؟", promptAr: "اطلب توضيح", targetArabic: "تكدر توضح شتقصد بـ 'عاجل'؟", promptRu: "Попроси пояснить", targetRussian: "Не мог бы ты пояснить, что имеешь в виду под «срочно»?" },
      { prompt: "دڵنیا بەرەوە", target: "Just to confirm — the deadline is Friday, correct?", targetKurdish: "تەنها بۆ دڵنیابوون — وادەی کۆتایی هەینییە، ڕاستە؟", promptAr: "تأكد", targetArabic: "بس حتى اتأكد — الموعد النهائي يوم الجمعة، مو؟", promptRu: "Убедись", targetRussian: "Просто чтобы убедиться — дедлайн в пятницу, верно?" },
    ],
    sentences: [
      { english: ["Could", "you", "elaborate", "on", "that", "point"], kurdish: "دەتوانیت ئەو خاڵە زیاتر ڕوون بکەیتەوە؟", arabic: "تكدر تشرح اكثر عن هاي النقطة؟", russian: "Не мог бы ты рассказать об этом поподробнее?" },
      { english: ["If", "I", "understand", "correctly", "you", "want", "changes"], kurdish: "ئەگەر باش تێگەیشتبم، دەتەوێت گۆڕانکاری بکرێت", arabic: "اذا فهمت صح، انت تريد تغييرات", russian: "Если я правильно понял, ты хочешь внести изменения" },
    ],
    fillBlanks: [
      { parts: ["Could you", "on that last point?"], hint: "دەتوانیت ئەو خاڵەی کۆتایی زیاتر ڕوون بکەیتەوە؟", answer: "elaborate", wrongs: ["explain", "expand", "repeat"], arabicHint: "تكدر تشرح اكثر عن النقطة الاخيرة؟", russianHint: "Не мог бы ты остановиться на этом последнем пункте поподробнее?", russianParts: ["Не мог бы ты рассказать", "об этом последнем пункте?"], russianAnswer: "поподробнее", russianWrongs: ["объяснить", "расширить", "повторить"] },
      { parts: ["Just to", "— we meet at 3pm, right?"], hint: "تەنها بۆ دڵنیابوون — کاتژمێر ٣ کۆدەبینەوە، ڕاستە؟", answer: "confirm", wrongs: ["check", "verify", "know"], arabicHint: "بس حتى اتأكد — نلتقي بـ 3، مو؟", russianHint: "Просто чтобы убедиться — мы встречаемся в 3 часа, верно?", russianParts: ["Просто чтобы", "— мы встречаемся в 3 часа, верно?"], russianAnswer: "убедиться", russianWrongs: ["проверить", "узнать", "спросить"] },
    ],
    conversations: [
      { situation: "دوای پێشکەشکردنێک", theyAsk: "Any questions about what I just said?", correct: "Yes — could you clarify what you mean by 'flexible timeline'? If I understand correctly, the dates can change?", wrong1: "What does 'flexible timeline' mean?", wrong2: "I don't understand what you mean by a flexible timeline.", wrong3: "Can you explain the timeline?", explanation: "'Could you clarify... If I understand correctly' — باشترین ڕێگەن بۆ پرسیارکردن بەبێ ئەوەی بەرامبەر بێزار بکەیت", situationAr: "بعد تقديم", explanationAr: "'Could you clarify... If I understand correctly' — احسن الطرق تسأل بيها بدون ما تزعج المقابل", situationRu: "После презентации", theyAskRu: "Есть вопросы по тому, что я только что сказал?", correctRu: "Да — не мог бы ты пояснить, что имеешь в виду под «гибкими сроками»? Если я правильно понял, даты могут меняться?", wrong1Ru: "Что значит «гибкие сроки»?", wrong2Ru: "Я не понимаю, что ты имеешь в виду под гибкими сроками.", wrong3Ru: "Можешь объяснить сроки?", explanationRu: "'Could you clarify... If I understand correctly' — лучший способ задать вопрос, не раздражая собеседника" },
    ],
  },

  // Lesson 4: Talking About the Future
  {
    topic: "Future Plans & Goals", topicKu: "پلان و ئامانجەکانی داهاتوو", topicAr: "خطط وأهداف المستقبل", topicRu: "Планы и цели на будущее",
    words: [
      { english: "I'm planning to",      kurdish: "پلانم هەیە بۆ", arabic: "مخطط لـ / ناوي", russian: "Я планирую" },
      { english: "I intend to",          kurdish: "نیازم وایە", arabic: "ناوي", russian: "Я намерен" },
      { english: "I'm hoping to",        kurdish: "هیوادارم بتوانم", arabic: "اتمنى", russian: "Я надеюсь" },
      { english: "In the long run",      kurdish: "لە ماوەیەکی درێژخایەندا", arabic: "على المدى الطويل", russian: "В долгосрочной перспективе" },
      { english: "My goal is to",        kurdish: "ئامانجم ئەوەیە کە", arabic: "هدفي انه", russian: "Моя цель —" },
    ],
    voices: [
      { prompt: "ئامانجەکەت باس بکە", target: "My goal is to improve my English within six months.", targetKurdish: "ئامانجم ئەوەیە کە ئینگلیزییەکەم لە ماوەی شەش مانگدا باشتر بکەم.", promptAr: "احجي عن هدفك", targetArabic: "هدفي احسن لغتي الانكليزية خلال ست اشهر.", promptRu: "Расскажи о цели", targetRussian: "Моя цель — подтянуть английский за шесть месяцев." },
      { prompt: "پلانی داهاتوو", target: "I'm planning to apply for a new position next year.", targetKurdish: "پلانم هەیە ساڵی داهاتوو پێشکەشی بکەم بۆ پۆستێکی نوێ.", promptAr: "خطة للمستقبل", targetArabic: "ناوي اقدم على وظيفة جديدة السنة الجاية.", promptRu: "Планы на будущее", targetRussian: "Я планирую подать заявку на новую должность в следующем году." },
    ],
    sentences: [
      { english: ["I'm", "planning", "to", "study", "every", "day"], kurdish: "پلانم هەیە هەموو ڕۆژێک بخوێنم", arabic: "ناوي ادرس كل يوم", russian: "Я планирую заниматься каждый день" },
      { english: ["In", "the", "long", "run", "I", "want", "to", "lead", "a", "team"], kurdish: "لە درێژخایەندا دەمەوێت ببمە سەرپەرشتیاری تیمێک", arabic: "على المدى الطويل، اريد اقود فريق", russian: "В долгосрочной перспективе я хочу руководить командой" },
    ],
    fillBlanks: [
      { parts: ["My", "is to become fluent in two years."], hint: "ئامانجم ئەوەیە کە لە ماوەی دوو ساڵدا پاراو بم لە زمانەکە.", answer: "goal", wrongs: ["plan", "hope", "dream"], arabicHint: "هدفي احجي بطلاقة خلال سنتين.", russianHint: "Моя цель — свободно заговорить через два года.", russianParts: ["Моя", "— свободно заговорить через два года."], russianAnswer: "цель", russianWrongs: ["план", "надежда", "мечта"] },
      { parts: ["I'm hoping", "finish this course by summer."], hint: "هیوادارم تا هاوین ئەم کۆرسە تەواو بکەم.", answer: "to", wrongs: ["for", "of", "about"], arabicHint: "اتمنى اخلص هالدورة قبل الصيف.", russianHint: "Надеюсь закончить этот курс к лету.", russianParts: ["Надеюсь", "закончить этот курс к лету."], russianAnswer: "успеть", russianWrongs: ["для", "о", "про"] },
    ],
    conversations: [
      { situation: "چاوپێکەوتنی کار", theyAsk: "Where do you see yourself in five years?", correct: "In the long run, my goal is to lead a team. I'm planning to develop my leadership skills over the next two years.", wrong1: "I want to be a leader in 5 years.", wrong2: "My plan is to get promoted.", wrong3: "I hope to be successful in 5 years.", explanation: "'In the long run... I'm planning to' — وەڵامێکی زۆر گونجاو و پیشەییە بۆ ئەم پرسیارە", situationAr: "مقابلة شغل", explanationAr: "'In the long run... I'm planning to' — جواب كلش مناسب واحترافي لهالسؤال", situationRu: "Собеседование на работу", theyAskRu: "Кем вы видите себя через пять лет?", correctRu: "В долгосрочной перспективе моя цель — руководить командой. Я планирую развивать лидерские качества в ближайшие два года.", wrong1Ru: "Я хочу быть лидером через 5 лет.", wrong2Ru: "Мой план — получить повышение.", wrong3Ru: "Надеюсь стать успешным через 5 лет.", explanationRu: "'In the long run... I'm planning to' — очень подходящий и профессиональный ответ на этот вопрос" },
    ],
  },

  // Lesson 5: Describing Problems
  {
    topic: "Describing Problems", topicKu: "وەسفکردنی کێشەکان", topicAr: "وصف المشاكل", topicRu: "Описание проблем",
    words: [
      { english: "The issue is",         kurdish: "کێشەکە ئەوەیە کە", arabic: "المشكلة هي", russian: "Проблема в том, что" },
      { english: "We're facing",         kurdish: "ڕووبەڕووی ... دەبینەوە", arabic: "دنواجه", russian: "Мы столкнулись с" },
      { english: "The main challenge",   kurdish: "گەورەترین ئاستەنگ", arabic: "التحدي الرئيسي", russian: "Главная трудность" },
      { english: "This is causing",      kurdish: "ئەمە دەبێتە هۆی", arabic: "هذا ديسبب", russian: "Это вызывает" },
      { english: "It's affecting",       kurdish: "کاریگەری دەکاتە سەر", arabic: "ديأثر على", russian: "Это влияет на" },
    ],
    voices: [
      { prompt: "کێشەیەک باس بکە", target: "The issue is that we don't have enough resources.", targetKurdish: "کێشەکە ئەوەیە کە سەرچاوەی پێویستمان نییە.", promptAr: "اذكر مشكلة", targetArabic: "المشكلة هي انه ما عدنا موارد كافية.", promptRu: "Опиши проблему", targetRussian: "Проблема в том, что у нас недостаточно ресурсов." },
      { prompt: "باس لە کاریگەرییەکان بکە", target: "This is causing delays and affecting our deadline.", targetKurdish: "ئەمە دەبێتە هۆی دواکەوتن و کاریگەری دەکاتە سەر وادەکانمان.", promptAr: "احجي عن التأثيرات", targetArabic: "هذا ديسبب تأخيرات ويأثر على موعدنا النهائي.", promptRu: "Расскажи о последствиях", targetRussian: "Это вызывает задержки и влияет на наши сроки." },
    ],
    sentences: [
      { english: ["The", "main", "challenge", "is", "lack", "of", "communication"], kurdish: "گەورەترین ئاستەنگ نەبوونی پەیوەندییە", arabic: "التحدي الرئيسي هو قلة التواصل", russian: "Главная трудность — недостаток общения" },
      { english: ["We're", "facing", "a", "technical", "issue", "right", "now"], kurdish: "ئێستا ڕووبەڕووی کێشەیەکی تەکنیکی بووینەتەوە", arabic: "دنواجه مشكلة تقنية هسة", russian: "Прямо сейчас мы столкнулись с технической проблемой" },
    ],
    fillBlanks: [
      { parts: ["The", "is that we're understaffed right now."], hint: "کێشەکە ئەوەیە کە ئێستا کارمەندمان کەمە.", answer: "issue", wrongs: ["problem", "thing", "matter"], arabicHint: "المشكلة هي انه الموظفين قليلين هسة.", russianHint: "Проблема в том, что нам сейчас не хватает сотрудников.", russianParts: ["", "в том, что нам сейчас не хватает сотрудников."], russianAnswer: "Проблема", russianWrongs: ["Беда", "Вещь", "Суть"] },
      { parts: ["This is", "our ability to deliver on time."], hint: "ئەمە کاریگەری دەکاتە سەر توانامان بۆ گەیاندن لە کاتی خۆیدا.", answer: "affecting", wrongs: ["causing", "changing", "hurting"], arabicHint: "هذا ديأثر على كدرتنا نسلم بالموعد.", russianHint: "Это влияет на нашу способность сдать работу вовремя.", russianParts: ["Это", "на нашу способность сдать работу вовремя."], russianAnswer: "влияет", russianWrongs: ["вызывает", "меняет", "портит"] },
    ],
    conversations: [
      { situation: "ڕاپۆرتدانی کێشەیەک بۆ بەڕێوەبەر", theyAsk: "What seems to be the problem?", correct: "The main challenge is a lack of clear communication between teams. This is causing delays and affecting our deadlines.", wrong1: "Teams are not communicating well.", wrong2: "There are communication problems causing delays.", wrong3: "The problem is teams don't talk enough.", explanation: "'The main challenge... This is causing... affecting' — شێوازێکی زۆر باو و پیشەییە بۆ باسکردنی کێشەکان", situationAr: "تبليغ المدير عن مشكلة", explanationAr: "'The main challenge... This is causing... affecting' — طريقة كلش شائعة واحترافية حتى توصف المشاكل", situationRu: "Сообщение о проблеме менеджеру", theyAskRu: "В чем, собственно, проблема?", correctRu: "Главная трудность — недостаток четкой коммуникации между командами. Это вызывает задержки и влияет на наши сроки.", wrong1Ru: "Команды плохо общаются.", wrong2Ru: "Есть проблемы с общением, вызывающие задержки.", wrong3Ru: "Проблема в том, что команды мало разговаривают.", explanationRu: "'The main challenge... This is causing... affecting' — очень распространенный и профессиональный способ описать проблемы" },
    ],
  },

  // Lesson 6: Giving and Receiving Feedback
  {
    topic: "Giving Feedback", topicKu: "پێدانی ڕەخنە و پێشنیار", topicAr: "تقديم الملاحظات", topicRu: "Обратная связь",
    words: [
      { english: "I'd suggest",          kurdish: "پێشنیار دەکەم کە", arabic: "اقترح", russian: "Я бы предложил" },
      { english: "One thing to improve", kurdish: "یەک شت بۆ باشترکردن", arabic: "شي واحد حتى يتحسن", russian: "Что можно улучшить, так это" },
      { english: "That said",            kurdish: "لەگەڵ ئەوەشدا", arabic: "ويه هذا", russian: "Тем не менее" },
      { english: "Well done on",         kurdish: "دەستخۆشی بۆ", arabic: "عاشت ايدك على", russian: "Отличная работа с" },
      { english: "Going forward",        kurdish: "لە داهاتوودا / بۆ پێشەوە", arabic: "بالمستقبل / لقدام", russian: "В дальнейшем" },
    ],
    voices: [
      { prompt: "پێشنیار بدە", target: "I'd suggest adding more examples to support your points.", targetKurdish: "پێشنیار دەکەم نموونەی زیاتر زیاد بکەیت بۆ پشتگیریکردنی خاڵەکانت.", promptAr: "انطي اقتراح", targetArabic: "اقترح تضيف امثلة اكثر حتى تدعم نقاطك.", promptRu: "Предложи", targetRussian: "Я бы предложил добавить больше примеров для подтверждения ваших мыслей." },
      { prompt: "دەستخۆشی بکە و ڕێنمایی بدە", target: "Well done on the structure — going forward, focus more on data.", targetKurdish: "دەستخۆشی بۆ پێکهاتەکە — لە داهاتوودا، زیاتر سەرنجت لەسەر داتا بێت.", promptAr: "امدح وانطي توجيه", targetArabic: "عاشت ايدك عالترتيب — لقدام، ركز اكثر على البيانات.", promptRu: "Похвали и направь", targetRussian: "Отличная работа со структурой — в дальнейшем уделяй больше внимания данным." },
    ],
    sentences: [
      { english: ["Well", "done", "on", "the", "presentation", "it", "was", "clear"], kurdish: "دەستخۆشی بۆ پێشکەشکردنەکە، زۆر ڕوون بوو", arabic: "عاشت ايدك عالتقديم، جان واضح", russian: "Отличная работа с презентацией, всё было ясно" },
      { english: ["Going", "forward", "try", "to", "be", "more", "concise"], kurdish: "لە داهاتوودا هەوڵبدە پوختتر بیت", arabic: "لقدام، حاول تختصر اكثر", russian: "В дальнейшем постарайся быть более кратким" },
    ],
    fillBlanks: [
      { parts: ["I'd", "starting with the conclusion next time."], hint: "پێشنیار دەکەم جاری داهاتوو بە دەرەنجامەکە دەست پێ بکەیت.", answer: "suggest", wrongs: ["recommend", "advise", "think"], arabicHint: "اقترح تبلش بالخلاصة المرة الجاية.", russianHint: "Я бы предложил в следующий раз начать с выводов.", russianParts: ["Я бы", "в следующий раз начать с выводов."], russianAnswer: "предложил", russianWrongs: ["посоветовал", "порекомендовал", "подумал"] },
      { parts: ["That", ", the core idea was very strong."], hint: "لەگەڵ ئەوەشدا، بیرۆکە سەرەکییەکە زۆر بەهێز بوو.", answer: "said", wrongs: ["done", "being", "noted"], arabicHint: "ويه هذا، الفكرة الأساسية جانت كلش قوية.", russianHint: "Тем не менее, основная идея была очень сильной.", russianParts: ["Тем не", ", основная идея была очень сильной."], russianAnswer: "менее", russianWrongs: ["сделано", "судя", "отмечено"] },
    ],
    conversations: [
      { situation: "دوای پێشکەشکردنی هاوکارێک", theyAsk: "What did you think of my presentation?", correct: "Well done on the research — it was thorough. That said, I'd suggest making the slides less text-heavy going forward.", wrong1: "It was good but too much text.", wrong2: "Your slides had too many words.", wrong3: "Good research but slides need work.", explanation: "'Well done on... That said... I'd suggest...' — ئەمە پێی دەوترێت (ساندویچی فیدباک) کە زۆر پیشەییە", situationAr: "بعد تقديم مال زميل", explanationAr: "'Well done on... That said... I'd suggest...' — هذا يسمونه (ساندويتش الملاحظات) وهو كلش احترافي", situationRu: "После презентации коллеги", theyAskRu: "Что скажешь о моей презентации?", correctRu: "Отличная работа с исследованием — оно было тщательным. Тем не менее, я бы предложил в дальнейшем делать слайды менее перегруженными текстом.", wrong1Ru: "Было хорошо, но слишком много текста.", wrong2Ru: "На твоих слайдах было слишком много слов.", wrong3Ru: "Хорошее исследование, но над слайдами надо поработать.", explanationRu: "'Well done on... That said... I'd suggest...' — это называется «сэндвич обратной связи», и это очень профессионально" },
    ],
  },

  // Lesson 7: Numbers, Dates & Times
  {
    topic: "Numbers, Dates & Times", topicKu: "ژمارە، کات و بەروار", topicAr: "الأرقام والتواريخ والأوقات", topicRu: "Числа, даты и время",
    words: [
      { english: "As of",               kurdish: "تاکو ئێستا / هەر لە", arabic: "من هسة / لحد الان", russian: "На данный момент" },
      { english: "Approximately",       kurdish: "نزیکەی", arabic: "تقريباً", russian: "Примерно" },
      { english: "By the end of",       kurdish: "تاوەکو کۆتایی", arabic: "بنهاية", russian: "К концу" },
      { english: "Quarter",             kurdish: "چارەک", arabic: "ربع", russian: "Квартал" },
      { english: "Ahead of schedule",   kurdish: "پێش وادەی دیاریکراو", arabic: "قبل الموعد", russian: "С опережением графика" },
    ],
    voices: [
      { prompt: "باسکردنی ڕێژە", target: "As of today, we've completed approximately 70 percent.", targetKurdish: "تاکو ئەمڕۆ، نزیکەی لەسەدا ٧٠مان تەواو کردووە.", promptAr: "ذكر النسبة", targetArabic: "لحد اليوم، خلصنا تقريباً 70 بالمية.", promptRu: "Назови процент", targetRussian: "На сегодняшний день мы выполнили примерно 70 процентов." },
      { prompt: "کاتی تەواوبوون", target: "We're ahead of schedule — it'll be done by end of March.", targetKurdish: "ئێمە لە پێش وادەی دیاریکراوین — تا کۆتایی مانگی ئازار تەواو دەبێت.", promptAr: "وكت الانتهاء", targetArabic: "احنا متقدمين عالجدول — راح يخلص بنهاية شهر الثالث.", promptRu: "Время окончания", targetRussian: "Мы идем с опережением графика — всё будет готово к концу марта." },
    ],
    sentences: [
      { english: ["We", "aim", "to", "finish", "by", "the", "end", "of", "Q2"], kurdish: "ئامانجمانە تاوەکو کۆتایی چارەکی دووەم تەواوی بکەین", arabic: "هدفنا نخلص بنهاية الربع الثاني", russian: "Мы стремимся закончить к концу второго квартала" },
      { english: ["Approximately", "half", "of", "the", "work", "is", "done"], kurdish: "نزیکەی نیوەی کارەکە تەواو بووە", arabic: "خلصنا تقريباً نص الشغل", russian: "Примерно половина работы выполнена" },
    ],
    fillBlanks: [
      { parts: ["As of", ", the budget sits at $50,000."], hint: "تاکو ئەمڕۆ، بودجەکە ٥٠،٠٠٠ دۆلارە.", answer: "today", wrongs: ["now", "this moment", "yet"], arabicHint: "لحد اليوم، الميزانية 50,000 دولار.", russianHint: "На сегодняшний день бюджет составляет 50 000 долларов.", russianParts: ["На сегодняшний", "бюджет составляет 50 000 долларов."], russianAnswer: "день", russianWrongs: ["сейчас", "момент", "пока"] },
      { parts: ["We finished", "of schedule — two days early."], hint: "پێش وادەی دیاریکراو تەواومان کرد — دوو ڕۆژ زووتر.", answer: "ahead", wrongs: ["before", "early", "under"], arabicHint: "خلصنا الشغل قبل الموعد بيومين.", russianHint: "Мы закончили с опережением графика — на два дня раньше.", russianParts: ["Мы закончили с", "графика — на два дня раньше."], russianAnswer: "опережением", russianWrongs: ["до", "рано", "под"] },
    ],
    conversations: [
      { situation: "نیشاندانی بەرەوپێشچوونی کار", theyAsk: "Where are we on the project?", correct: "As of today, we've completed approximately 60% of the work. We're actually ahead of schedule and expect to finish by the end of Q3.", wrong1: "We finished 60% of the project.", wrong2: "We are on track and ahead of time.", wrong3: "About 60% is done and we're early.", explanation: "'As of today... approximately... ahead of schedule' — شێوازێکی زۆر ڕێک و پێشەییە بۆ ڕاپۆرتدانی کار", situationAr: "عرض تقدم الشغل", explanationAr: "'As of today... approximately... ahead of schedule' — طريقة كلش مرتبة واحترافية للتبليغ عن الشغل", situationRu: "Демонстрация прогресса работы", theyAskRu: "На каком этапе проект?", correctRu: "На сегодняшний день мы выполнили примерно 60% работы. На самом деле мы идем с опережением графика и планируем закончить к концу третьего квартала.", wrong1Ru: "Мы закончили 60% проекта.", wrong2Ru: "Мы идем по плану и опережаем время.", wrong3Ru: "Около 60% готово, и мы идем раньше срока.", explanationRu: "'As of today... approximately... ahead of schedule' — очень четкий и профессиональный способ отчета о работе" },
    ],
  },

  // Lesson 8: Texting & Phone Calls (Casual)
  {
    topic: "Texting & Calling", topicKu: "نامەگۆڕینەوە و تەلەفۆن (ڕۆژانە)", topicAr: "الرسائل النصية والمكالمات (غير رسمية)", topicRu: "Переписки и звонки",
    words: [
      { english: "Give me a ring",           kurdish: "تەلەفۆنم بۆ بکە", arabic: "خابرني", russian: "Звякни мне" },
      { english: "My battery is dying",      kurdish: "شەحنی مۆبایلەکەم خەریکە دادەبەزێت", arabic: "شحني راح يخلص", russian: "У меня садится батарея" },
      { english: "Left me on read",          kurdish: "نامەکەی خوێندەوە و وەڵامی نەدایەوە (سین کرد)", arabic: "خلاني عالسين", russian: "Проигнорил (оставил на прочитанном)" },
      { english: "I'll text you the details",kurdish: "وردەکارییەکانت بە نامە بۆ دەنێرم", arabic: "راح ادزلك التفاصيل برسالة", russian: "Скину подробности в сообщении" },
      { english: "Drop me a message",        kurdish: "نامەیەکم بۆ بنێرە", arabic: "دزلي رسالة", russian: "Черкни мне" },
    ],
    voices: [
      { prompt: "کۆتاییهێنان بە پەیوەندییەک", target: "My battery is dying, I'll text you later.", targetKurdish: "شەحنم خەریکە دادەبەزێت، دواتر نامەت بۆ دەنێرم.", promptAr: "تنهي مكالمة", targetArabic: "شحني راح يخلص، راح ادزلك رسالة بعدين.", promptRu: "Заверши разговор", targetRussian: "У меня садится батарея, напишу позже." },
      { prompt: "داوای پەیوەندی کردن", target: "Give me a ring when you are free.", targetKurdish: "کاتێک کاتت هەبوو تەلەفۆنم بۆ بکە.", promptAr: "تطلب اتصال", targetArabic: "خابرني من تفرغ.", promptRu: "Попроси позвонить", targetRussian: "Звякни мне, когда освободишься." },
    ],
    sentences: [
      { english: ["I", "will", "text", "you", "the", "details", "later"], kurdish: "دواتر وردەکارییەکانت بە نامە بۆ دەنێرم", arabic: "راح ادزلك التفاصيل برسالة بعدين", russian: "Я скину тебе подробности в сообщении позже" },
      { english: ["Why", "did", "you", "leave", "me", "on", "read"], kurdish: "بۆچی نامەکەت سین کرد و وەڵامت نەدامەوە؟", arabic: "ليش خليتني عالسين؟", russian: "Почему ты прочитал и проигнорил?" },
    ],
    fillBlanks: [
      { parts: ["Drop me a", "when you get home safely."], hint: "کاتێک گەیشتیتەوە ماڵەوە بە سەلامەتی نامەیەکم بۆ بنێرە.", answer: "message", wrongs: ["text", "letter", "call"], arabicHint: "دزلي رسالة من توصل للبيت بالسلامة.", russianHint: "Напиши мне, как благополучно доберешься домой.", russianParts: ["", "мне, как благополучно доберешься домой."], russianAnswer: "Напиши", russianWrongs: ["Текст", "Письмо", "Звонок"] },
      { parts: ["My battery is", ", I have to go."], hint: "شەحنی مۆبایلەکەم خەریکە دادەبەزێت، دەبێت بڕۆم.", answer: "dying", wrongs: ["dead", "low", "ending"], arabicHint: "شحني راح يخلص، لازم اروح.", russianHint: "У меня садится батарея, мне пора.", russianParts: ["У меня", "батарея, мне пора."], russianAnswer: "садится", russianWrongs: ["мертва", "низкая", "заканчивается"] },
    ],
    conversations: [
      { situation: "قسەکردن لەگەڵ هاوڕێیەک کە کاتی نییە ئێستا قسە بکات", theyAsk: "I'm a bit busy right now, can we talk later?", correct: "Sure! Drop me a message or give me a ring when you're free. I'll text you the details in the meantime.", wrong1: "Sure, call me when you have time.", wrong2: "No problem—we can talk later.", wrong3: "Text me when you're free.", explanation: "'Drop me a message' و 'Give me a ring' زۆر زۆر باون لە زمانی ڕۆژانەی ئینگلیزیدا", situationAr: "تحجي ويه صديق ما عنده وكت هسة", explanationAr: "'Drop me a message' و 'Give me a ring' كلش شائعة بالانكليزية اليومية", situationRu: "Общение с другом, которому сейчас некогда говорить", theyAskRu: "Я сейчас немного занят, можем поговорить позже?", correctRu: "Конечно! Напиши или звякни мне, когда освободишься. А пока скину тебе подробности.", wrong1Ru: "Конечно, позвони, когда будет время.", wrong2Ru: "Без проблем — поговорим позже.", wrong3Ru: "Напиши, когда освободишься.", explanationRu: "'Drop me a message' и 'Give me a ring' очень часто используются в повседневном английском" },
    ],
  },

  // Lesson 9: Handling Disagreements
  {
    topic: "Handling Disagreements", topicKu: "چارەسەرکردنی جیاوازیی بۆچوون", topicAr: "التعامل مع الخلافات", topicRu: "Разрешение разногласий",
    words: [
      { english: "I see your point, however", kurdish: "تێدەگەم مەبەستت چییە، بەڵام", arabic: "افتهم قصدك، بس", russian: "Я понимаю твою мысль, но" },
      { english: "I respectfully disagree",   kurdish: "لەگەڵ ڕێزدا، من هاوڕا نیم", arabic: "مع احترامي، اني ما اتفق", russian: "При всем уважении, я не согласен" },
      { english: "With all due respect",      kurdish: "لەگەڵ هەموو ڕێزێکدا", arabic: "مع كل الاحترام", russian: "Со всем должным уважением" },
      { english: "We may need to compromise", kurdish: "لەوانەیە پێویستمان بە سازشکردن بێت", arabic: "يجوز نحتاج نتفق على حل وسط", russian: "Возможно, нам придется пойти на компромисс" },
      { english: "Let's find common ground",  kurdish: "با خاڵێکی هاوبەش بدۆزینەوە", arabic: "خلي نلكي نقطة مشتركة", russian: "Давай найдем точки соприкосновения" },
    ],
    voices: [
      { prompt: "بە ڕێزەوە ڕەتی بکەرەوە", target: "I respectfully disagree — I see your point, however the data suggests otherwise.", targetKurdish: "لەگەڵ ڕێزدا من هاوڕا نیم — تێدەگەم مەبەستت چییە، بەڵام داتاکان شتێکی تر دەڵێن.", promptAr: "ارفض باحترام", targetArabic: "مع احترامي، اني ما اتفق — افتهم قصدك، بس البيانات تكول غير شي.", promptRu: "Вежливо откажи", targetRussian: "При всем уважении, я не согласен — понимаю твою мысль, но данные говорят об обратном." },
      { prompt: "پێشنیاری چارەسەر بکە", target: "Let's find common ground — we may need to compromise on the timeline.", targetKurdish: "با خاڵێکی هاوبەش بدۆزینەوە — لەوانەیە پێویستمان بە سازشکردن بێت لەسەر کاتەکە.", promptAr: "اقترح حل", targetArabic: "خلي نلكي نقطة مشتركة — يجوز نحتاج نتفق على حل وسط بخصوص الجدول.", promptRu: "Предложи решение", targetRussian: "Давай найдем точки соприкосновения — возможно, придется пойти на компромисс по срокам." },
    ],
    sentences: [
      { english: ["I", "see", "your", "point", "however", "I", "disagree"], kurdish: "تێدەگەم مەبەستت چییە، بەڵام هاوڕا نیم", arabic: "افتهم قصدك، بس ما اتفق", russian: "Я понимаю твою мысль, но я не согласен" },
      { english: ["Let's", "find", "a", "solution", "that", "works", "for", "both"], kurdish: "با چارەسەرێک بدۆزینەوە کە بۆ هەردووکمان گونجاو بێت", arabic: "خلي نلكي حل يفيد الطرفين", russian: "Давай найдем решение, которое устроит обоих" },
    ],
    fillBlanks: [
      { parts: ["I see your point;", ", the budget is a real constraint."], hint: "تێدەگەم مەبەستت چییە؛ بەڵام، بودجەکە ئاستەنگێکی ڕاستەقینەیە.", answer: "however", wrongs: ["but", "yet", "though"], arabicHint: "افتهم قصدك؛ بس الميزانية صدك عائق.", russianHint: "Понимаю твою мысль; однако, бюджет — это реальное ограничение.", russianParts: ["Понимаю твою мысль;", ", бюджет — это реальное ограничение."], russianAnswer: "однако", russianWrongs: ["но", "пока", "хотя"] },
      { parts: ["With all due", ", I think we need a different approach."], hint: "لەگەڵ هەموو ڕێزێکدا، پێم وایە پێویستمان بە ڕێگەیەکی جیاوازە.", answer: "respect", wrongs: ["care", "regards", "consideration"], arabicHint: "مع كل الاحترام، اعتقد نحتاج طريقة مختلفة.", russianHint: "Со всем должным уважением, думаю, нам нужен другой подход.", russianParts: ["Со всем должным", ", думаю, нам нужен другой подход."], russianAnswer: "уважением", russianWrongs: ["заботой", "приветом", "вниманием"] },
    ],
    conversations: [
      { situation: "جیاوازیی بۆچوون لە کۆبوونەوەیەکدا", theyAsk: "I think we should cut the marketing budget completely.", correct: "I see your point, however, I respectfully disagree. With all due respect, cutting it completely could harm our brand. Perhaps we could compromise and reduce it instead?", wrong1: "I don't think we should cut the budget.", wrong2: "That's not a good idea, marketing is important.", wrong3: "I disagree because marketing is necessary.", explanation: "'I see your point, however... respectfully disagree... could we compromise' — شێوازێکی زۆر نموونەییە بۆ مامەڵەکردن لەگەڵ جیاوازیی بۆچوون", situationAr: "خلاف بالرأي باجتماع", explanationAr: "'I see your point, however... respectfully disagree... could we compromise' — طريقة كلش نموذجية حتى تتعامل ويه الاختلاف بالرأي", situationRu: "Разногласия на собрании", theyAskRu: "Думаю, нам нужно полностью урезать маркетинговый бюджет.", correctRu: "Я понимаю вашу мысль, но, при всем уважении, не согласен. Со всем должным уважением, полное урезание может навредить нашему бренду. Возможно, мы могли бы пойти на компромисс и вместо этого сократить его?", wrong1Ru: "Не думаю, что нам нужно урезать бюджет.", wrong2Ru: "Это не лучшая идея, маркетинг важен.", wrong3Ru: "Я не согласен, потому что маркетинг необходим.", explanationRu: "'I see your point, however... respectfully disagree... could we compromise' — идеальный способ справляться с разногласиями" },
    ],
  },
];

export default normalUnit00;
