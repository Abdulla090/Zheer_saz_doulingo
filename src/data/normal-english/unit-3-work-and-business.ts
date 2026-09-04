import { UnitBank } from "../types";

// ── Unit 2: Work & Professional Life — 10 unique lessons ──────────────────────────
// Formal and polite English for the workplace, interviews, meetings, and business communication.

const normalUnit02: UnitBank = [

  // Lesson 0: Job Interviews
  {
    topic: "Job Interviews", topicKu: "چاوپێکەوتنی کار", topicAr: "مقابلات العمل", topicRu: "Собеседование на работу",
    words: [
      { english: "I have experience in", kurdish: "ئەزموونم هەیە لە...", arabic: "عندي خبرة بـ", russian: "У меня есть опыт в..." },
      { english: "My strengths are", kurdish: "خاڵە بەهێزەکانم بریتین لە...", arabic: "نقاط قوتي هي", russian: "Мои сильные стороны — это..." },
      { english: "I am a quick learner", kurdish: "خێرام لە فێربووندا", arabic: "اني سريع التعلم", russian: "Я быстро обучаюсь / схватываю на лету" },
      { english: "Looking forward to", kurdish: "بە تامەزرۆم بۆ...", arabic: "متحمس / منتظر", russian: "С нетерпением жду..." },
      { english: "Valuable asset", kurdish: "سەرمایەیەکی بەنرخ (کەسێکی بەسوود بۆ کۆمپانیا)", arabic: "شخص مفيد / اضافة للفريق", russian: "Ценный сотрудник / ценный актив" },
    ],
    voices: [
      { prompt: "باسکردنی ئەزموون", target: "I have over five years of experience in marketing.", targetKurdish: "زیاتر لە پێنج ساڵ ئەزموونم لە بەبازاڕکردندا هەیە.", promptAr: "وصف الخبرة", targetArabic: "عندي اكثر من خمس سنين خبرة بالتسويق.", promptRu: "Расскажи о профессиональном опыте", targetRussian: "У меня более пяти лет опыта работы в сфере маркетинга." },
      { prompt: "کۆتایی چاوپێکەوتن", target: "I am looking forward to hearing from you soon.", targetKurdish: "بە تامەزرۆم بۆ بیستنی هەواڵێک لە ئێوەوە بە زوویی.", promptAr: "نهاية المقابلة", targetArabic: "منتظر اسمع منكم قريب.", promptRu: "Вежливо заверши собеседование", targetRussian: "С нетерпением жду возможности получить от вас ответ." },
    ],
    sentences: [
      { english: ["I","believe","I","can","be","a","valuable","asset"], kurdish: "پێم وایە دەتوانم کەسێکی زۆر بەسوود بم بۆ تیمەکە", arabic: "اعتقد اكدر اكون اضافة قوية للفريق", russian: "Я верю, что смогу стать ценным сотрудником для команды" },
      { english: ["I","am","a","quick","learner","and","a","hard","worker"], kurdish: "من خێرام لە فێربووندا و کەسێکی ماندوونەناسم", arabic: "اني سريع التعلم وشغيل", russian: "Я быстро учусь и умею усердно работать" },
    ],
    fillBlanks: [
      { parts: ["I have a lot of","in this field."], hint: "ئەزموونێکی زۆرم لەم بوارەدا هەیە.", answer: "experience", wrongs: ["work","time","job"], arabicHint: "عندي هواية خبرة بهالمجال.", arabicParts: ["عندي هواية","بهالمجال."], arabicAnswer: "خبرة", arabicWrongs: ["شغل","وقت","وظيفة"], russianHint: "У меня большой опыт в этой области.", russianParts: ["У меня большой","в этой области."], russianAnswer: "опыт", russianWrongs: ["план","стаж","интерес"] },
      { parts: ["I am looking","to the opportunity to work here."], hint: "بە تامەزرۆم بۆ ئەو دەرفەتەی لێرە کار بکەم.", answer: "forward", wrongs: ["ahead","front","waiting"], arabicHint: "اني متحمس لفرصة الشغل هنا.", arabicParts: ["اني","لفرصة الشغل هنا."], arabicAnswer: "متحمس", arabicWrongs: ["اتقدم","كدام","انتظر"], russianHint: "Я с нетерпением жду возможности работать здесь.", russianParts: ["Я с нетерпением","возможности работать здесь."], russianAnswer: "жду", russianWrongs: ["хочу","прошу","думаю"] },
    ],
    conversations: [
      { situation: "لە چاوپێکەوتنی کار لێت دەپرسن بۆچی تۆ هەڵبژێرن", theyAsk: "Why should we hire you for this position?", correct: "I have extensive experience in this field, and I am a quick learner. I believe I can be a valuable asset to your team.", wrong1: "I need money.", wrong2: "Give me job.", wrong3: "I am good boy.", explanation: "'valuable asset' و 'extensive experience' دەستەواژەی زۆر بەهێزن لە چاوپێکەوتندا کە متمانەبەخۆبوون پیشان دەدەن", situationAr: "بمقابلة شغل، يسألوك ليش لازم يعينوك", theyAskAr: "ليش لازم نعينك بهالمنصب؟", correctAr: "عندي خبرة واسعة بهالمجال، واني سريع بالتعلم. اعتقد اكدر اكون اضافة كلش قوية ومفيدة لفريقكم.", wrong1Ar: "احتاج فلوس.", wrong2Ar: "انطوني شغل.", wrong3Ar: "اني خوش ولد.", explanationAr: "'اضافة قوية' و 'خبرة واسعة' عبارات كلش قوية بالمقابلات تبين الثقة بالنفس", situationRu: "На собеседовании вас спрашивают, почему именно вы подходите на должность", theyAskRu: "Почему мы должны нанять именно вас на эту позицию?", correctRu: "У меня обширный опыт в этой сфере, и я быстро обучаюсь. Уверен, что смогу стать ценным сотрудником для вашей команды.", wrong1Ru: "Мне нужны деньги.", wrong2Ru: "Дайте мне работу.", wrong3Ru: "Я хороший парень.", explanationRu: "«Valuable asset» (ценный сотрудник) и «extensive experience» (обширный опыт) — мощные профессиональные формулировки, демонстрирующие зрелость и уверенность." },
    ],
  },

  // Lesson 1: Office Communication
  {
    topic: "Office Communication", topicKu: "پەیوەندیکردن لە ئۆفیس", topicAr: "التواصل بالمكتب", topicRu: "Общение в офисе",
    words: [
      { english: "Can you send me", kurdish: "دەتوانیت بۆم بنێریت؟", arabic: "تكدر تدزلي", russian: "Не могли бы вы прислать мне..." },
      { english: "I'll keep you posted", kurdish: "ئاگادارت دەکەمەوە (لە پێشهاتەکان)", arabic: "راح اخليك بالصورة", russian: "Буду держать вас в курсе" },
      { english: "I'll look into it", kurdish: "بەدواداچوونی بۆ دەکەم", arabic: "راح اتابع الموضوع", russian: "Я разберусь с этим" },
      { english: "Get back to you", kurdish: "وەڵامت دەدەمەوە (دواتر)", arabic: "راح اردلك / راح ارجعلك خبر", russian: "Вернусь к вам с ответом" },
      { english: "Deadline", kurdish: "دوا مۆڵەت", arabic: "الديدلاين / اخر موعد", russian: "Дедлайн (крайний срок)" },
    ],
    voices: [
      { prompt: "بەڵێندان بە پێدانی زانیاری نوێ", target: "I don't have the answer yet, but I'll keep you posted.", targetKurdish: "هێشتا وەڵامەکەم لا نییە، بەڵام ئاگادارت دەکەمەوە لە پێشهاتەکان.", promptAr: "وعد بمعلومات جديدة", targetArabic: "ما عندي الجواب هسة، بس راح اخليك بالصورة.", promptRu: "Пообещай держать в курсе новостей", targetRussian: "У меня пока нет ответа, но я буду держать вас в курсе." },
      { prompt: "دواخستنی وەڵام بۆ بەدواداچوون", target: "I'll look into it and get back to you shortly.", targetKurdish: "بەدواداچوونی بۆ دەکەم و بە زوویی وەڵامت دەدەمەوە.", promptAr: "تأجيل الرد للمتابعة", targetArabic: "راح اتابع الموضوع وارجعلك خبر قريب.", promptRu: "Пообещай разобраться и дать ответ", targetRussian: "Я разберусь с этим вопросом и скоро вернусь к вам с ответом." },
    ],
    sentences: [
      { english: ["Could","you","send","me","the","updated","report"], kurdish: "دەتوانیت ڕاپۆرتە نوێکراوەکەم بۆ بنێریت؟", arabic: "تكدر تدزلي التقرير المحدث", russian: "Не могли бы вы прислать мне обновленный отчет?" },
      { english: ["The","deadline","for","this","project","is","Friday"], kurdish: "دوا مۆڵەت بۆ ئەم پڕۆژەیە ڕۆژی هەینییە", arabic: "الديدلاين لهالمشروع يوم الجمعة", russian: "Крайний срок по этому проекту — пятница" },
    ],
    fillBlanks: [
      { parts: ["I'll keep you","on any updates."], hint: "لە هەر پێشهاتێکی نوێ ئاگادارت دەکەمەوە.", answer: "posted", wrongs: ["told","knowing","seen"], arabicHint: "راح اخليك بالصورة بأي تحديثات.", arabicParts: ["راح اخليك","بأي تحديثات."], arabicAnswer: "بالصورة", arabicWrongs: ["علم","معرفة","رؤية"], russianHint: "Я буду держать вас в курсе любых обновлений.", russianParts: ["Я буду держать вас в","любых новостей."], russianAnswer: "курсе", russianWrongs: ["плане","деле","мыслях"] },
      { parts: ["I'll check with the team and get","to you."], hint: "لەگەڵ تیمەکە پرسیار دەکەم و وەڵامت دەدەمەوە.", answer: "back", wrongs: ["return","reply","answer"], arabicHint: "راح اسأل الفريق و ارجعلك خبر.", arabicParts: ["راح اسأل الفريق و","خبر."], arabicAnswer: "ارجعلك", arabicWrongs: ["ارجع","ارد","اجاوب"], russianHint: "Я уточню у команды и вернусь к вам с ответом.", russianParts: ["Я уточню у команды и","к вам с ответом."], russianAnswer: "вернусь", russianWrongs: ["приду","напишу","сообщу"] },
    ],
    conversations: [
      { situation: "هاوپیشەیەک پرسیارت لێ دەکات دەربارەی بابەتێک کە نایزانیت", theyAsk: "Do you know if the client approved the final design?", correct: "I am not sure. I'll look into it and get back to you shortly.", wrong1: "I don't know.", wrong2: "Wait.", wrong3: "I check.", explanation: "'I'll look into it and get back to you' ڕێگەیەکی زۆر پیشەگەرانەیە بۆ ئەوەی بڵێیت نازانم بەڵام بەدواداچوونی بۆ دەکەیت", situationAr: "زميلك بالشغل يسألك عن موضوع متعرفه", theyAskAr: "تعرف اذا العميل وافق عالتصميم النهائي؟", correctAr: "ما متأكد. راح اتابع الموضوع وارجعلك خبر بأقرب وكت.", wrong1Ar: "ما اعرف.", wrong2Ar: "انتظر.", wrong3Ar: "اشوف واكلك.", explanationAr: "'راح اتابع الموضوع وارجعلك خبر' طريقة كلش احترافية تكول بيها ما اعرف بس راح اتابع", situationRu: "Коллега спрашивает о вопросе, в котором вы пока не уверены", theyAskRu: "Ты не знаешь, согласовал ли клиент окончательный дизайн?", correctRu: "Я пока не уверен. Я разберусь с этим и скоро вернусь к тебе с ответом.", wrong1Ru: "Я не знаю.", wrong2Ru: "Жди.", wrong3Ru: "Я проверю.", explanationRu: "«I'll look into it and get back to you» — идеальный деловой ответ, когда у вас нет информации, но вы берете инициативу разобраться." },
    ],
  },

  // Lesson 2: Meetings
  {
    topic: "Meetings", topicKu: "کۆبوونەوەکان", topicAr: "الاجتماعات", topicRu: "Деловые встречи и совещания",
    words: [
      { english: "Let's get started", kurdish: "با دەست پێ بکەین", arabic: "خلي نبدي", russian: "Давайте начнем" },
      { english: "I completely agree", kurdish: "بەتەواوی هاوڕام", arabic: "اني متفق تماماً", russian: "Я полностью согласен" },
      { english: "From my perspective", kurdish: "لە ڕوانگەی منەوە / بە ڕای من", arabic: "برأيي", russian: "С моей точки зрения" },
      { english: "Let's move on to", kurdish: "با بچینە سەر...", arabic: "خلي ننتقل لـ", russian: "Давайте перейдем к..." },
      { english: "Action items", kurdish: "ئەو کارانەی کە دەبێت بکرێن (دوای کۆبوونەوە)", arabic: "الشغلات اللي لازم نسويها", russian: "Пункты плана действий (задачи)" },
    ],
    voices: [
      { prompt: "دەستپێکردنی کۆبوونەوە", target: "Since everyone is here, let's get started.", targetKurdish: "لەبەرئەوەی هەمووان لێرەن، با دەست پێ بکەین.", promptAr: "بداية الاجتماع", targetArabic: "بما انو الكل هنا، خلي نبدي.", promptRu: "Открой рабочее совещание", targetRussian: "Поскольку все в сборе, давайте начнем." },
      { prompt: "گۆڕینی بابەت", target: "Let's move on to the next item on the agenda.", targetKurdish: "با بچینە سەر خاڵی داهاتوو لە بەرنامەی کارەکەدا.", promptAr: "تغيير الموضوع", targetArabic: "خلي ننتقل للنقطة الجاية بجدول الاعمال.", promptRu: "Перейди к следующему пункту повестки", targetRussian: "Давайте перейдем к следующему пункту повестки дня." },
    ],
    sentences: [
      { english: ["From","my","perspective","this","is","the","best","option"], kurdish: "لە ڕوانگەی منەوە ئەمە باشترین هەڵبژاردەیە", arabic: "برأيي هذا احسن خيار", russian: "С моей точки зрения, это наилучший вариант" },
      { english: ["Let's","review","the","action","items","before","we","finish"], kurdish: "با پێداچوونەوە بە کارە پێویستەکاندا بکەین پێش ئەوەی تەواو بین", arabic: "خلي نراجع الشغلات قبل ما نخلص", russian: "Давайте пройдемся по списку задач, прежде чем закончить" },
    ],
    fillBlanks: [
      { parts: ["From my",", we need to increase the budget."], hint: "لە ڕوانگەی منەوە، پێویستە بودجەکە زیاد بکەین.", answer: "perspective", wrongs: ["mind","eyes","seeing"], arabicHint: "برأيي، لازم نزيد الميزانية.", arabicParts: ["برأيي","، لازم نزيد الميزانية."], arabicAnswer: "برأيي", arabicWrongs: ["عقلي","عيني","رؤيتي"], russianHint: "С моей точки зрения, нам нужно увеличить бюджет.", russianParts: ["С моей","зрения, нам нужно увеличить бюджет."], russianAnswer: "точки", russianWrongs: ["стороны","позиции","линии"] },
      { parts: ["Let's get","with the meeting."], hint: "با دەست بکەین بە کۆبوونەوەکە.", answer: "started", wrongs: ["begin","go","ready"], arabicHint: "خلي نبدي الاجتماع.", arabicParts: ["خلي","الاجتماع."], arabicAnswer: "نبدي", arabicWrongs: ["نشرع","نروح","نستعد"], russianHint: "Давайте начнем собрание.", russianParts: ["Давайте","собрание."], russianAnswer: "начнем", russianWrongs: ["откроем","продолжим","закроем"] },
    ],
    conversations: [
      { situation: "بەڕێوەبردنی کۆبوونەوەیەک کە کاتی کەمە", theyAsk: "Should we discuss the marketing budget now?", correct: "Yes, let's move on to the budget. From my perspective, we need more funds.", wrong1: "We talk budget.", wrong2: "Go to budget.", wrong3: "I think budget good.", explanation: "'Let's move on to...' ڕستەیەکی زۆر بەکارهاتووە لە کۆبوونەوەکاندا بۆ گۆڕینی بابەت بە شێوەیەکی ڕێکخراو", situationAr: "ادارة اجتماع بوقت محدود", theyAskAr: "نناقش ميزانية التسويق هسة؟", correctAr: "اي، خلي ننتقل للميزانية. برأيي، نحتاج تمويل اكثر.", wrong1Ar: "نحجي بالميزانية.", wrong2Ar: "روح للميزانية.", wrong3Ar: "اعتقد الميزانية زينة.", explanationAr: "'خلي ننتقل لـ...' جملة كلش شائعة بالاجتماعات لتغيير الموضوع بطريقة منظمة", situationRu: "Ведение совещания при ограниченном времени", theyAskRu: "Стоит ли нам обсудить маркетинговый бюджет прямо сейчас?", correctRu: "Да, давайте перейдем к бюджету. С моей точки зрения, нам требуется больше средств.", wrong1Ru: "Мы говорим о бюджете.", wrong2Ru: "Иди к бюджету.", wrong3Ru: "Я думаю бюджет хороший.", explanationRu: "«Let's move on to...» — общепринятая фраза для четкого и структурированного перехода между темами на встречах." },
    ],
  },

  // Lesson 3: Professional Phone Calls
  {
    topic: "Professional Phone Calls", topicKu: "پەیوەندی تەلەفۆنی فەرمی", topicAr: "المكالمات التلفونية بالعمل", topicRu: "Деловые звонки",
    words: [
      { english: "Speaking", kurdish: "فەرموو لەگەڵتم (کاتی وەڵامدانەوەی تەلەفۆن)", arabic: "تفضل، اني وياك", russian: "Слушаю (у аппарата)" },
      { english: "May I ask who is calling", kurdish: "دەتوانم بپرسم کێ پەیوەندی کردووە؟", arabic: "اكدر اعرف منو يتصل؟", russian: "Могу я узнать, кто звонит?" },
      { english: "Hold the line", kurdish: "لەسەر هێڵ بە / چاوەڕێ بکە", arabic: "بلا زحمة انطر على الخط", russian: "Оставайтесь на линии" },
      { english: "I'll put you through", kurdish: "پەیوەندییەکەت بۆ دەگوازمەوە", arabic: "راح احولك عليه", russian: "Я вас соединю" },
      { english: "Leave a message", kurdish: "جێهێشتنی پەیام", arabic: "تترك رسالة", russian: "Оставить сообщение" },
    ],
    voices: [
      { prompt: "گواستنەوەی پەیوەندی", target: "Please hold the line, I'll put you through to the manager.", targetKurdish: "تکایە لەسەر هێڵ بە، پەیوەندییەکەت بۆ بەڕێوەبەر دەگوازمەوە.", promptAr: "تحويل المكالمة", targetArabic: "بلا زحمة انطر على الخط، راح احولك على المدير.", promptRu: "Попроси подождать на линии и соедини с начальником", targetRussian: "Пожалуйста, оставайтесь на линии, я соединю вас с руководителем." },
      { prompt: "پرسین لە ناوی پەیوەندیکار", target: "May I ask who is calling, please?", targetKurdish: "تکایە، دەتوانم بپرسم کێ پەیوەندی کردووە؟", promptAr: "السؤال عن اسم المتصل", targetArabic: "بلا زحمة، اكدر اعرف منو يتصل؟", promptRu: "Вежливо спроси, кто звонит", targetRussian: "Подскажите, пожалуйста, с кем я говорю?" },
    ],
    sentences: [
      { english: ["Would","you","like","to","leave","a","message"], kurdish: "دەتەوێت پەیامێک جێبهێڵیت؟", arabic: "تريد تترك رسالة؟", russian: "Не желаете ли оставить сообщение?" },
      { english: ["I'm","afraid","he","is","in","a","meeting"], kurdish: "بەداخەوەم (دەترسم) ئەو لە کۆبوونەوەدایە", arabic: "للأسف هو باجتماع", russian: "Боюсь, в данный момент он на совещании" },
    ],
    fillBlanks: [
      { parts: ["Please","the line, I'm transferring you now."], hint: "تکایە لەسەر هێڵ بە، ئێستا پەیوەندییەکەت دەگوازمەوە.", answer: "hold", wrongs: ["stay","keep","wait"], arabicHint: "بلا زحمة انطر على الخط، هسة احولك.", arabicParts: ["بلا زحمة","على الخط، هسة احولك."], arabicAnswer: "انطر", arabicWrongs: ["ابقى","حافظ","ترقب"], russianHint: "Пожалуйста, оставайтесь на линии, я перевожу звонок.", russianParts: ["Пожалуйста, оставайтесь на",", я перевожу звонок."], russianAnswer: "линии", russianWrongs: ["связи","проводе","месте"] },
      { parts: ["May I ask who is","?"], hint: "دەتوانم بپرسم کێ پەیوەندی کردووە؟", answer: "calling", wrongs: ["speaking","talking","ringing"], arabicHint: "اكدر اعرف منو يتصل؟", arabicParts: ["اكدر اعرف منو","؟"], arabicAnswer: "يتصل", arabicWrongs: ["يحجي","يحكي","يدگ"], russianHint: "Могу я спросить, кто звонит?", russianParts: ["Могу я спросить, кто","?"], russianAnswer: "звонит", russianWrongs: ["говорит","спрашивает","просит"] },
    ],
    conversations: [
      { situation: "کەسێک بە تەلەفۆن داوای بەڕێوەبەرەکەت دەکات کە لە کۆبوونەوەدایە", theyAsk: "Hello, could I speak to Mr. Smith, please?", correct: "I'm afraid he's in a meeting right now. Would you like to leave a message?", wrong1: "He not here.", wrong2: "No Smith.", wrong3: "Say message.", explanation: "'I'm afraid he's in a meeting' زۆر پیشەگەرانەترە، و 'Would you like to leave a message' ئادابی ستانداردی سکرتێرییە", situationAr: "واحد يتصل ويريد مديرك اللي باجتماع", theyAskAr: "ألو، اكدر احجي ويه استاذ سميث بلا زحمة؟", correctAr: "للأسف هو باجتماع هسة. تحب تتركله رسالة؟", wrong1Ar: "هو مو هنا.", wrong2Ar: "ماكو سميث.", wrong3Ar: "كول الرسالة.", explanationAr: "'للأسف هو باجتماع' اكثر احترافية، و 'تريد تترك رسالة' هي اداب سكرتارية معتادة", situationRu: "Звонящий просит к телефону руководителя, который занят на встрече", theyAskRu: "Здравствуйте, могу я поговорить с мистером Смитом, пожалуйста?", correctRu: "Боюсь, он сейчас на совещании. Хотите оставить для него сообщение?", wrong1Ru: "Его нет.", wrong2Ru: "Смита нет.", wrong3Ru: "Скажи сообщение.", explanationRu: "«I'm afraid he's in a meeting» звучит профессионально и тактично, а предложение оставить сообщение («leave a message») — стандарт делового этикета." },
    ],
  },

  // Lesson 4: Solving Problems
  {
    topic: "Solving Problems", topicKu: "چارەسەرکردنی کێشەکان", topicAr: "حل المشاكل", topicRu: "Решение рабочих проблем",
    words: [
      { english: "We've run into a problem", kurdish: "توشی کێشەیەک بووین", arabic: "طلعتلنا مشكلة", russian: "Мы столкнулись с проблемой" },
      { english: "I sincerely apologize", kurdish: "لە دڵەوە داوای لێبوردن دەکەم", arabic: "كلش اعتذر", russian: "Приношу искренние извинения" },
      { english: "Let's figure this out", kurdish: "با چارەسەرێکی بۆ بدۆزینەوە", arabic: "خلي نلكيلها حل", russian: "Давайте разберемся с этим" },
      { english: "Take care of it", kurdish: "من چارەسەری دەکەم (ئەرکەکەی دەگرمە ئەستۆ)", arabic: "اني استلم الموضوع", russian: "Взять на себя / уладить" },
      { english: "Inconvenience", kurdish: "ناڕەحەتی / ئەزیەت", arabic: "ازعاج", russian: "Неудобство" },
    ],
    voices: [
      { prompt: "ئاگادارکردنەوە لە کێشەیەک", target: "We've run into a minor problem with the server.", targetKurdish: "تووشی کێشەیەکی بچووک بووین لەگەڵ سێرڤەرەکەدا.", promptAr: "التبليغ عن مشكلة", targetArabic: "طلعتلنا مشكلة بسيطة بالسيرفر.", promptRu: "Сообщи о технической проблеме", targetRussian: "У нас возникла небольшая проблема с сервером." },
      { prompt: "گرتنەئەستۆی کێشەیەک", target: "Don't worry, I will take care of it right away.", targetKurdish: "خەمت نەبێت، دەستبەجێ من ئەرکی چارەسەرکردنەکەی دەگرمە ئەستۆ.", promptAr: "استلام مسؤولية المشكلة", targetArabic: "لا تشيل هم، اني استلم الموضوع هسة.", promptRu: "Успокой и пообещай решить вопрос", targetRussian: "Не волнуйтесь, я немедленно займусь этим вопросом." },
    ],
    sentences: [
      { english: ["I","sincerely","apologize","for","the","inconvenience"], kurdish: "لە دڵەوە داوای لێبوردن دەکەم بۆ ئەو ئەزیەتەی پێمان گەیاندیت", arabic: "كلش اعتذر على الازعاج", russian: "Я искренне извиняюсь за доставленные неудобства" },
      { english: ["Let's","figure","this","out","together"], kurdish: "با پێکەوە چارەسەرێکی بۆ بدۆزینەوە", arabic: "خلي نلكيلها حل سوية", russian: "Давайте разберемся в этом вместе" },
    ],
    fillBlanks: [
      { parts: ["We've","into a problem with the delivery."], hint: "تووشی کێشەیەک بووین لەگەڵ گەیاندنەکەدا.", answer: "run", wrongs: ["walked","got","had"], arabicHint: "طلعتلنا مشكلة بالتوصيل.", arabicParts: ["طلعتلنا","بالتوصيل."], arabicAnswer: "مشكلة", arabicWrongs: ["سالفة","قصة","حجية"], russianHint: "Мы столкнулись с проблемой при доставке.", russianParts: ["Мы","с проблемой при доставке."], russianAnswer: "столкнулись", russianWrongs: ["встретились","оказались","попали"] },
      { parts: ["Leave it to me, I will take","of it."], hint: "بۆ منى جێبهێڵە، من ئەرکەکەی دەگرمە ئەستۆ.", answer: "care", wrongs: ["fix","job","work"], arabicHint: "عوف الموضوع عليه، اني استلمه.", arabicParts: ["عوف الموضوع عليه، اني","."], arabicAnswer: "استلمه", arabicWrongs: ["اسوي","اخلصه","ارتبه"], russianHint: "Предоставьте это мне, я обо всем позабочусь.", russianParts: ["Предоставьте это мне, я обо всем","."], russianAnswer: "позабочусь", russianWrongs: ["подумаю","узнаю","посмотрю"] },
    ],
    conversations: [
      { situation: "کڕیارێک زۆر تووڕەیە چونکە کاڵاکەی دواکەوتووە", theyAsk: "My order is a week late! This is unacceptable.", correct: "I sincerely apologize for the inconvenience. Let me look into this and take care of it immediately.", wrong1: "Sorry.", wrong2: "I don't know.", wrong3: "Wait more.", explanation: "'I sincerely apologize' داوای لێبوردنێکی فەرمییە، و 'take care of it' پیشانی دەدات کە تۆ بەرپرسیارێتییەکە هەڵدەگریت", situationAr: "زبون كلش ضايج لان غراضه تأخرت", theyAskAr: "طلبيتي متأخرة اسبوع كامل! هذا الشي ابد ما مقبول.", correctAr: "كلش اعتذر على هذا الازعاج. خليني اتابع الموضوع واستلمه فوراً.", wrong1Ar: "اسف.", wrong2Ar: "ما ادري.", wrong3Ar: "انتظر بعد.", explanationAr: "'كلش اعتذر' اعتذار رسمي، و 'اني استلم الموضوع' تبين انك تتحمل المسؤولية", situationRu: "Клиент крайне недоволен недельной задержкой заказа", theyAskRu: "Мой заказ задерживается уже на неделю! Это неприемлемо.", correctRu: "Приношу искренние извинения за доставленные неудобства. Позвольте мне сейчас же разобраться и все уладить.", wrong1Ru: "Извините.", wrong2Ru: "Я не знаю.", wrong3Ru: "Ждите еще.", explanationRu: "«I sincerely apologize» — формальное и вежливое извинение, а «take care of it» показывает клиенту, что вы лично берете решение проблемы в свои руки." },
    ],
  },

  // Lesson 5: Email Etiquette
  {
    topic: "Email Etiquette", topicKu: "ئادابی ئیمەیڵ ناردن", topicAr: "اداب الايميل", topicRu: "Деловая переписка по email",
    words: [
      { english: "Just following up on", kurdish: "تەنها بەدواداچوون دەکەم بۆ...", arabic: "بس داتابع بخصوص", russian: "Пишу по поводу / в продолжение..." },
      { english: "Please find attached", kurdish: "تکایە هاوپێچکراوەکە ببینە", arabic: "بلا زحمة شوف المرفق", russian: "Во вложении находится..." },
      { english: "Don't hesitate to reach out", kurdish: "دوودڵ مەبە لە پەیوەندیکردن", arabic: "لا تتردد تتواصل وياي", russian: "Не стесняйтесь обращаться" },
      { english: "As requested", kurdish: "وەک چۆن داواتان کردبوو", arabic: "مثل ما طلبت", russian: "Как вы и просили..." },
      { english: "Looking forward to your reply", kurdish: "بە تامەزرۆم بۆ وەڵامەکەت", arabic: "منتظر ردك", russian: "С нетерпением жду вашего ответа" },
    ],
    voices: [
      { prompt: "بەدواداچوون بۆ ئیمەیڵێک", target: "I'm just following up on the email I sent yesterday.", targetKurdish: "تەنها بەدواداچوون دەکەم بۆ ئەو ئیمەیڵەی دوێنێ ناردم.", promptAr: "متابعة بريد إلكتروني", targetArabic: "اني بس داتابع الايميل اللي دزيته البارحة.", promptRu: "Напомни о вчерашнем письме", targetRussian: "Я пишу в продолжение письма, которое отправил вам вчера." },
      { prompt: "ئاماژەدان بە فایلێکی هاوپێچ", target: "Please find attached the report for this month.", targetKurdish: "تکایە ڕاپۆرتی ئەم مانگە ببینە کە هاوپێچ کراوە.", promptAr: "الإشارة إلى ملف مرفق", targetArabic: "بلا زحمة شوف التقرير المرفق مال هذا الشهر.", promptRu: "Прикрепи отчет к письму", targetRussian: "Направляю во вложении отчет за текущий месяц." },
    ],
    sentences: [
      { english: ["If","you","have","any","questions","don't","hesitate","to","reach","out"], kurdish: "ئەگەر هەر پرسیارێکت هەیە دوودڵ مەبە لە پەیوەندیکردن پێمەوە", arabic: "اذا عندك اي اسئلة، لا تتردد تتواصل وياي", russian: "Если у вас возникнут вопросы, без колебаний обращайтесь ко мне" },
      { english: ["As","requested","here","is","the","updated","file"], kurdish: "وەک داوات کردبوو، فەرموو ئەمە فایلە نوێکراوەکەیە", arabic: "مثل ما طلبت، هذا الملف المحدث", russian: "Как вы и просили, прикрепляю обновленный файл" },
    ],
    fillBlanks: [
      { parts: ["Just","up on the invoice from last week."], hint: "تەنها بەدواداچوون دەکەم بۆ پسووڵەی هەفتەی ڕابردوو.", answer: "following", wrongs: ["checking","asking","seeing"], arabicHint: "بس داتابع فاتورة الاسبوع الراح.", arabicParts: ["بس","فاتورة الاسبوع الراح."], arabicAnswer: "داتابع", arabicWrongs: ["اشيك","اسأل","اشوف"], russianHint: "Пишу по поводу счета от прошлой недели.", russianParts: ["Пишу в","письма по поводу счета за прошлую неделю."], russianAnswer: "продолжение", russianWrongs: ["завершение","дополнение","соответствие"] },
      { parts: ["Please find","the document you asked for."], hint: "تکایە ئەو بەڵگەنامەیە ببینە کە داوات کردبوو (کە لکێنراوە بە ئیمەیڵەکەوە).", answer: "attached", wrongs: ["added","included","sent"], arabicHint: "بلا زحمة شوف الملف المرفق اللي طلبته.", arabicParts: ["بلا زحمة شوف الملف","اللي طلبته."], arabicAnswer: "المرفق", arabicWrongs: ["المضاف","المتضمن","المرسل"], russianHint: "Во вложении находится документ, который вы запрашивали.", russianParts: ["Во","находится документ, который вы запрашивали."], russianAnswer: "вложении", russianWrongs: ["письме","отчете","ответе"] },
    ],
    conversations: [
      { situation: "ئیمەیڵێک دەنێریت کە فایلێکی تێدایە و دەتەوێت وەڵامیان هەبێت", theyAsk: "Hi, did you manage to finish the quarterly report?", correct: "Yes, as requested, please find attached the report. I am looking forward to your feedback.", wrong1: "Here is file.", wrong2: "I attach report.", wrong3: "Read the file.", explanation: "'Please find attached' ستانداردترین دەستەواژەی ئیمەیڵە کاتێک فایلێک دەنێریت", situationAr: "تدز ايميل بي ملف وتريد ردهم", theyAskAr: "مرحبا، لحكت تخلص التقرير الفصلي؟", correctAr: "اي، مثل ما طلبت، بلا زحمة شوف التقرير المرفق. منتظر ملاحظاتكم.", wrong1Ar: "هذا الملف.", wrong2Ar: "اني ارفق التقرير.", wrong3Ar: "اقرا الملف.", explanationAr: "'بلا زحمة شوف المرفق' هي العبارة الاكثر استخدام بالايميل من تدز ملف", situationRu: "Вы отправляете готовый квартальный отчет коллеге", theyAskRu: "Привет, тебе удалось закончить квартальный отчет?", correctRu: "Да, как вы и просили, отчет находится во вложении. Буду очень признателен за обратную связь.", wrong1Ru: "Вот файл.", wrong2Ru: "Я прикрепил отчет.", wrong3Ru: "Прочитай этот файл.", explanationRu: "«Please find attached» — общепринятый стандарт деловой переписки при отправке документов." },
    ],
  },

  // Lesson 6: Presentations
  {
    topic: "Presentations", topicKu: "پێشکەشکردنی بابەت (پریزێنتەیشن)", topicAr: "العروض التقديمية", topicRu: "Проведение презентаций",
    words: [
      { english: "I'd like to present", kurdish: "دەمەوێت پێشکەشی بکەم", arabic: "اريد اقدم / اراويكم", russian: "Я хотел бы представить..." },
      { english: "As you can see here", kurdish: "وەک لێرەدا دەیبینن", arabic: "مثل مدتشوفون هنا", russian: "Как вы можете видеть здесь..." },
      { english: "To sum up", kurdish: "بۆ پوختەکردنەوە / لە کۆتاییدا", arabic: "حتى نلخص الموضوع", russian: "Подводя итог..." },
      { english: "Any questions so far", kurdish: "تا ئێرە هیچ پرسیارێک هەیە؟", arabic: "اكو اي اسئلة لحد الان؟", russian: "Есть ли вопросы на данном этапе?" },
      { english: "Let's move to the next slide", kurdish: "با بچینە سەر سلایدی داهاتوو", arabic: "خلي ننتقل للسلايد الجاي", russian: "Давайте перейдем к следующему слайду" },
    ],
    voices: [
      { prompt: "دەستستپێکی پێشکەشکردن", target: "Today, I'd like to present our new marketing strategy.", targetKurdish: "ئەمڕۆ، دەمەوێت ستراتیژییە نوێیەکەی بەبازاڕکردنمان پێشکەش بکەم.", promptAr: "بداية العرض التقديمي", targetArabic: "اليوم، اريد اقدم استراتيجيتنا التسويقية الجديدة.", promptRu: "Объяви тему презентации", targetRussian: "Сегодня я хотел бы представить нашу новую маркетинговую стратегию." },
      { prompt: "کۆتاییهێنان بە پێشکەشکردن", target: "To sum up, our sales have increased by twenty percent.", targetKurdish: "بۆ پوختەکردنەوە، فرۆشەکانمان سەدا بیست زیادیان کردووە.", promptAr: "إنهاء العرض التقديمي", targetArabic: "حتى نلخص الموضوع، مبيعاتنا زادت بنسبة عشرين بالمية.", promptRu: "Подведи итог росту продаж", targetRussian: "Подводя итог, наши продажи выросли на двадцать процентов." },
    ],
    sentences: [
      { english: ["As","you","can","see","here","on","the","graph"], kurdish: "وەک لێرەدا لەسەر هێڵکارییەکە دەیبینن", arabic: "مثل مدتشوفون هنا على الرسم البياني", russian: "Как вы можете видеть на этом графике..." },
      { english: ["Are","there","any","questions","so","far"], kurdish: "تا ئێرە هیچ پرسیارێک هەیە؟", arabic: "اكو اي اسئلة لحد الان؟", russian: "Есть ли какие-либо вопросы на данный момент?" },
    ],
    fillBlanks: [
      { parts: ["Let's move to the next","."], hint: "با بچینە سەر سلایدی داهاتوو.", answer: "slide", wrongs: ["page","picture","paper"], arabicHint: "خلي ننتقل للسلايد الجاي.", arabicParts: ["خلي ننتقل للـ","الجاي."], arabicAnswer: "سلايد", arabicWrongs: ["صفحة","صورة","ورقة"], russianHint: "Давайте перейдем к следующему слайду.", russianParts: ["Давайте перейдем к следующему","."], russianAnswer: "слайду", russianWrongs: ["листу","экрану","пункту"] },
      { parts: ["To","up, we need to focus on quality."], hint: "بۆ پوختەکردنەوە، پێویستە تەرکیز بکەینە سەر کوالێتی.", answer: "sum", wrongs: ["end","close","finish"], arabicHint: "حتى نلخص الموضوع، لازم نركز على الجودة.", arabicParts: ["حتى نلخص الـ","، لازم نركز على الجودة."], arabicAnswer: "موضوع", arabicWrongs: ["شغلة","نهاية","فكرة"], russianHint: "Подводя итоги, нам необходимо сосредоточиться на качестве.", russianParts: ["Подводя",", нам необходимо сосредоточиться на качестве."], russianAnswer: "итоги", russianWrongs: ["планы","черту","конец"] },
    ],
    conversations: [
      { situation: "لەکاتی پێشکەشکردندا دەتەوێت بپرسیت ئایا کەس پرسیاری هەیە", theyAsk: "...and that covers the technical details of the product.", correct: "Before we move to the next slide, are there any questions so far?", wrong1: "Who has question?", wrong2: "You want to ask?", wrong3: "I wait for questions.", explanation: "'Are there any questions so far?' زۆر بەئەدەبە و ڕێگە دەدات ئامادەبووان بە ئاسوودەیی پرسیار بکەن", situationAr: "بخلال البرزنتيشن، تريد تسأل اذا احد عنده اسئلة", theyAskAr: "...وهذا كلشي يخص التفاصيل التقنية للمنتج.", correctAr: "قبل ما ننتقل للسلايد الجاي، اكو اي اسئلة لحد الان؟", wrong1Ar: "منو عنده سؤال؟", wrong2Ar: "تريد تسأل؟", wrong3Ar: "اني انتظر الاسئلة.", explanationAr: "'اكو اي اسئلة لحد الان؟' كلش مؤدبة وتخلي الحضور يسألون براحتهم", situationRu: "Во время презентации вы делаете паузу для вопросов слушателей", theyAskRu: "...и на этом мы завершили разбор технических характеристик продукта.", correctRu: "Прежде чем мы перейдем к следующему слайду, есть ли у кого-то вопросы по сказанному?", wrong1Ru: "У кого есть вопрос?", wrong2Ru: "Хотите спросить?", wrong3Ru: "Я жду вопросов.", explanationRu: "«Are there any questions so far?» — очень вежливый и профессиональный оборот, приглашающий слушателей задать вопросы без неловкости." },
    ],
  },

  // Lesson 7: Negotiating
  {
    topic: "Negotiating", topicKu: "گفتوگۆکردن (مامەڵەکردن لە کاردا)", topicAr: "التفاوض", topicRu: "Переговоры и компромиссы",
    words: [
      { english: "We can offer you", kurdish: "دەتوانین پێت پێشکەش بکەین", arabic: "نكدر نقدم لك", russian: "Мы можем предложить вам..." },
      { english: "Is there any flexibility", kurdish: "ئایا هیچ نەرمی نواندنێک هەیە (لە نرخ/مەرج)؟", arabic: "اكو اي مجال / مرونة؟", russian: "Есть ли возможность гибкости (в цене)?" },
      { english: "Meet halfway", kurdish: "ڕێککەوتن لە ناوەڕاستدا (هەردوولا کەمێک سازش بکەن)", arabic: "نتفق بالنص / نلتقي بالنص", russian: "Пойти на взаимные уступки (встретиться на полпути)" },
      { english: "Bottom line", kurdish: "خاڵی کۆتایی / کەمترین ئاست کە قبوڵ بکرێت", arabic: "الحد الادنى / من الاخير", russian: "Минимальная граница / окончательное условие" },
      { english: "Win-win situation", kurdish: "بارودۆخێک هەردوولا براوە بن", arabic: "وضع يفيد الطرفين", russian: "Взаимовыгодная ситуация (обоюдная выгода)" },
    ],
    voices: [
      { prompt: "پرسین لە نەرمی نواندن", target: "Is there any flexibility with the price?", targetKurdish: "ئایا هیچ نەرمییەک هەیە لە نرخەکەدا؟", promptAr: "السؤال عن المرونة", targetArabic: "اكو اي مرونة بالسعر؟", promptRu: "Спроси о возможности скидки", targetRussian: "Возможна ли какая-либо гибкость в плане цены?" },
      { prompt: "پێشنیارکردنی سازش", target: "Let's meet halfway. How about ten percent discount?", targetKurdish: "با لە ناوەڕاستدا ڕێککەوین. چی دەڵێیت بۆ سەدا دە داشکاندن؟", promptAr: "اقتراح تسوية", targetArabic: "خلي نلتقي بالنص. شتكول على خصم عشرة بالمية؟", promptRu: "Предложи компромиссное решение", targetRussian: "Давайте пойдем на взаимные уступки. Как насчет десятипроцентной скидки?" },
    ],
    sentences: [
      { english: ["I","think","we","can","reach","a","win-win","situation"], kurdish: "پێم وایە دەتوانین بگەینە بارودۆخێک کە هەردوولا براوە بین", arabic: "اعتقد نكدر نوصل لوضع يفيد الطرفين", russian: "Я считаю, что мы можем достичь взаимовыгодного решения" },
      { english: ["My","bottom","line","is","fifty","dollars"], kurdish: "دوا نرخم پەنجا دۆلارە (خوار ئەوە قبوڵ ناکەم)", arabic: "من الاخير، سعري خمسين دولار", russian: "Моя крайняя цена — пятьдесят долларов" },
    ],
    fillBlanks: [
      { parts: ["Is there any","in your budget?"], hint: "ئایا هیچ نەرمییەک لە بودجەکەتاندا هەیە؟", answer: "flexibility", wrongs: ["change","moving","space"], arabicHint: "اكو اي مرونة بميزانيتك؟", arabicParts: ["اكو اي","بميزانيتك؟"], arabicAnswer: "مرونة", arabicWrongs: ["تغيير","حركة","مساحة"], russianHint: "Есть ли какая-то гибкость в вашем бюджете?", russianParts: ["Есть ли какая-то","в вашем бюджете?"], russianAnswer: "гибкость", russianWrongs: ["разница","польза","сумма"] },
      { parts: ["Let's meet","and agree on this price."], hint: "با لە ناوەڕاستدا ڕێککەوین و لەسەر ئەم نرخە ڕازی بین.", answer: "halfway", wrongs: ["middle","center","between"], arabicHint: "خلي نلتقي بالنص ونوافق على هالسعر.", arabicParts: ["خلي نلتقي بالـ","ونوافق على هالسعر."], arabicAnswer: "نص", arabicWrongs: ["وسط","مركز","بين"], russianHint: "Давайте пойдем на взаимные уступки и согласуем эту цену.", russianParts: ["Давайте пойдем на взаимные","и согласуем эту цену."], russianAnswer: "уступки", russianWrongs: ["шаги","траты","риски"] },
    ],
    conversations: [
      { situation: "دەتەوێت داشکاندنێک بکەیت بۆ کڕیارێک بەڵام ئەو زۆری دەوێت", theyAsk: "I want a 20% discount on this contract.", correct: "We can't do 20%, but let's meet halfway. We can offer you a 10% discount. That's our bottom line.", wrong1: "No 20%. I give 10%.", wrong2: "20 is too much.", wrong3: "I don't give discount.", explanation: "'Let's meet halfway' زاراوەیەکی زۆر باوی بازرگانییە کاتێک دەتەوێت بگەیتە ڕێککەوتنێک", situationAr: "تريد تنطي خصم لزبون بس هو يريد هواية", theyAskAr: "اريد خصم 20% على هذا العقد.", correctAr: "ما نكدر على 20%، بس خلي نلتقي بالنص. نكدر نقدملك خصم 10%. وهذا اخر سعر عدنا من الاخير.", wrong1Ar: "ماكو 20%. انطي 10%.", wrong2Ar: "20 كلش هواية.", wrong3Ar: "ما انطي خصم.", explanationAr: "'خلي نلتقي بالنص' مصطلح تجاري كلش شائع من تريد توصل لاتفاق", situationRu: "Клиент требует слишком большую скидку, и вы ищете компромисс", theyAskRu: "Я хочу скидку 20% по этому контракту.", correctRu: "Мы не можем предоставить 20%, но давайте пойдем на взаимные уступки. Мы можем предложить 10% — это наш крайний предел.", wrong1Ru: "Никаких 20%. Я даю 10%.", wrong2Ru: "20 — это слишком много.", wrong3Ru: "Я не даю скидок.", explanationRu: "«Meet halfway» — ключевой термин деловых переговоров, обозначающий компромисс, при котором обе стороны делают шаг навстречу." },
    ],
  },

  // Lesson 8: Giving Feedback
  {
    topic: "Giving Feedback", topicKu: "پێدانی هەڵسەنگاندن (فیدباک)", topicAr: "تقديم الملاحظات", topicRu: "Конструктивная обратная связь",
    words: [
      { english: "Constructive feedback", kurdish: "هەڵسەنگاندنی بنیاتنەر (بۆ باشترکردن)", arabic: "ملاحظات بنّاءة", russian: "Конструктивная обратная связь" },
      { english: "You're doing great", kurdish: "کارێکی زۆر باش دەکەیت", arabic: "شغلك كلش زين", russian: "Ты отлично справляешься" },
      { english: "Room for improvement", kurdish: "بواری بەرەوپێشچوون ماوە", arabic: "مجال تتحسن", russian: "Есть куда расти (пространство для улучшений)" },
      { english: "Keep up the good work", kurdish: "بەردەوام بە لەم کارە باشە", arabic: "كمل على هالشغل الحلو", russian: "Продолжай в том же духе" },
      { english: "Focus more on", kurdish: "زیاتر تەرکیز بکەرە سەر...", arabic: "ركز اكثر على", russian: "Уделять больше внимания чему-либо" },
    ],
    voices: [
      { prompt: "پێدانی فیدباکی ئەرێنی", target: "You're doing great, just keep up the good work.", targetKurdish: "کارێکی زۆر باش دەکەیت، تەنها بەردەوام بە لەم کارە باشە.", promptAr: "تقديم ملاحظات إيجابية", targetArabic: "شغلك كلش زين، بس كمل على هالشغل الحلو.", promptRu: "Поддержи сотрудника добрым словом", targetRussian: "Ты отлично справляешься, продолжай в том же духе!" },
      { prompt: "پێشنیارکردنی باشترکردن", target: "There is some room for improvement in your presentations.", targetKurdish: "بواری بەرەوپێشچوون ماوە لە پێشکەشکردنەکانتدا.", promptAr: "اقتراح تحسين", targetArabic: "اكو مجال تتحسن بعروضك التقديمية.", promptRu: "Мягко укажи на зону роста", targetRussian: "В твоих презентациях еще есть пространство для улучшений." },
    ],
    sentences: [
      { english: ["I","have","some","constructive","feedback","for","you"], kurdish: "چەند هەڵسەنگاندنێکی بنیاتنەرم هەیە بۆت", arabic: "عندي شوية ملاحظات بنّاءة الك", russian: "У меня есть для тебя конструктивная обратная связь" },
      { english: ["You","need","to","focus","more","on","details"], kurdish: "پێویستە زیاتر تەرکیز بکەیتە سەر وردەکارییەکان", arabic: "لازم تركز اكثر على التفاصيل", russian: "Тебе нужно уделять больше внимания деталям" },
    ],
    fillBlanks: [
      { parts: ["There is always","for improvement."], hint: "هەمیشە بواری بەرەوپێشچوون ماوە.", answer: "room", wrongs: ["space","place","time"], arabicHint: "دائماً اكو مجال للتحسين.", arabicParts: ["دائماً اكو","للتحسين."], arabicAnswer: "مجال", arabicWrongs: ["مساحة","مكان","وقت"], russianHint: "Всегда есть пространство для улучшений.", russianParts: ["Всегда есть","для улучшений."], russianAnswer: "пространство", russianWrongs: ["время","место","желание"] },
      { parts: ["Keep up the good","!"], hint: "بەردەوام بە لەم کارە باشە!", answer: "work", wrongs: ["job","doing","thing"], arabicHint: "كمل على الشغل الحلو!", arabicParts: ["كمل على","الحلو!"], arabicAnswer: "الشغل", arabicWrongs: ["الوظيفة","الفعل","الشيء"], russianHint: "Продолжай в том же духе!", russianParts: ["Продолжай в том же","!"], russianAnswer: "духе", russianWrongs: ["виде","тоне","стиле"] },
    ],
    conversations: [
      { situation: "هەڵسەنگاندنی کارمەندێک دەکەیت کە کارەکەی باشە بەڵام کەمێک خاوە", theyAsk: "How has my performance been this month?", correct: "You're doing great, but there's room for improvement with deadlines. Keep up the good work, just focus more on time management.", wrong1: "You are good but slow.", wrong2: "Work faster next time.", wrong3: "I don't like your speed.", explanation: "'room for improvement' ڕێگەیەکی زۆر نەرم و ئەرێنییە بۆ وتنی ئەوەی کە کەموکوڕییەک هەیە", situationAr: "تقيم موظف شغله زين بس شوية بطيء", theyAskAr: "شلون كان ادائي هذا الشهر؟", correctAr: "شغلك كلش زين، بس اكو مجال تتحسن بخصوص الالتزام بالمواعيد. كمل على هالشغل الحلو، بس ركز اكثر على تنظيم الوقت.", wrong1Ar: "انت زين بس بطيء.", wrong2Ar: "اشتغل اسرع المرة الجاية.", wrong3Ar: "ما تعجبني سرعتك.", explanationAr: "'مجال تتحسن' طريقة كلش لطيفة وايجابية حتى تكول اكو نقص", situationRu: "Сотрудник хорошо справляется с работой, но немного отстает по срокам", theyAskRu: "Как вы оцениваете мои результаты в этом месяце?", correctRu: "Ты отлично справляешься, но есть куда расти в соблюдении дедлайнов. Продолжай в том же духе, просто удели больше внимания тайм-менеджменту.", wrong1Ru: "Ты молодец, но медленный.", wrong2Ru: "Работай быстрее в следующий раз.", wrong3Ru: "Мне не нравится твоя скорость.", explanationRu: "«Room for improvement» (пространство для роста) — деликатный и конструктивный способ указать на недочеты, сохраняя мотивацию сотрудника." },
    ],
  },

  // Lesson 9: Networking
  {
    topic: "Networking", topicKu: "دروستکردنی پەیوەندی پیشەیی", topicAr: "بناء العلاقات المهنية", topicRu: "Деловой нетворкинг",
    words: [
      { english: "Keep in touch", kurdish: "لە پەیوەندیدا دەبین", arabic: "خلي نبقى على تواصل", russian: "Оставаться на связи" },
      { english: "Exchange contact details", kurdish: "گۆڕینەوەی زانیاری پەیوەندی (ژمارە/ئیمەیڵ)", arabic: "نتبادل ارقام التواصل", russian: "Обменяться контактами" },
      { english: "Connect on LinkedIn", kurdish: "پەیوەندیکردن لە لینکدین", arabic: "تواصل على لينكد ان", russian: "Добавиться в деловой сети" },
      { english: "It was a pleasure", kurdish: "جێگەی شانازی / خۆشحاڵی بوو", arabic: "كلش تشرفت", russian: "Было очень приятно познакомиться" },
      { english: "Mutual contact", kurdish: "ناسراوی هاوبەش", arabic: "معرفة مشتركة", russian: "Общий знакомый / контакт" },
    ],
    voices: [
      { prompt: "داوای ژمارە یان ئیمەیڵ", target: "Should we exchange contact details?", targetKurdish: "ئایا باشە زانیاری پەیوەندیکردنمان بگۆڕینەوە؟", promptAr: "طلب رقم أو بريد إلكتروني", targetArabic: "نتبادل ارقام التواصل؟", promptRu: "Предложи обменяться контактами", targetRussian: "Может, обменяемся контактами?" },
      { prompt: "کۆتاییهێنان بە قسەکردن لە کۆنفرانسێک", target: "It was a pleasure meeting you. Let's keep in touch.", targetKurdish: "ناسینت جێگەی خۆشحاڵی بوو. با لە پەیوەندیدا بین.", promptAr: "إنهاء المحادثة في مؤتمر", targetArabic: "كلش تشرفت بيك. خلي نبقى على تواصل.", promptRu: "Вырази удовольствие от знакомства", targetRussian: "Было очень приятно познакомиться. Давайте оставаться на связи!" },
    ],
    sentences: [
      { english: ["I","think","we","have","a","mutual","contact"], kurdish: "پێم وایە ناسراوێکی هاوبەشمان هەیە", arabic: "اعتقد عدنا معرفة مشتركة", russian: "Мне кажется, у нас есть общий знакомый" },
      { english: ["Let's","connect","on","LinkedIn","later"], kurdish: "با دواتر لە لینکدین پەیوەندی بە یەکەوە بکەین", arabic: "خلي نتواصل على لينكد ان بعدين", russian: "Давай позже спишемся в деловой сети" },
    ],
    fillBlanks: [
      { parts: ["Let's exchange contact","before you leave."], hint: "با زانیاری پەیوەندیکردنمان بگۆڕینەوە پێش ئەوەی بڕۆیت.", answer: "details", wrongs: ["info","papers","numbers"], arabicHint: "خلي نتبادل ارقام التواصل قبل ما تروح.", arabicParts: ["خلي نتبادل","التواصل قبل ما تروح."], arabicAnswer: "ارقام", arabicWrongs: ["معلومات","اوراق","عناوين"], russianHint: "Давайте обменяемся контактами перед вашим уходом.", russianParts: ["Давайте обменяемся","перед вашим уходом."], russianAnswer: "контактами", russianWrongs: ["визитками","номерами","словами"] },
      { parts: ["It was a","meeting you today."], hint: "ئەمڕۆ ناسینت جێگەی شانازی (خۆشحاڵی) بوو.", answer: "pleasure", wrongs: ["good","happy","nice"], arabicHint: "كلش تشرفت بيك اليوم.", arabicParts: ["كلش","بيك اليوم."], arabicAnswer: "تشرفت", arabicWrongs: ["فرحت","سعدت","انبسطت"], russianHint: "Было очень приятно познакомиться с вами сегодня.", russianParts: ["Было очень","познакомиться с вами сегодня."], russianAnswer: "приятно", russianWrongs: ["полезно","весело","важно"] },
    ],
    conversations: [
      { situation: "لە کۆنفرانسێکی بازرگانیدا کەسێک دەناسیت", theyAsk: "I need to go to the next session now. It was nice talking to you.", correct: "It was a pleasure meeting you too. Should we exchange contact details? I'd love to keep in touch.", wrong1: "Give me your number.", wrong2: "I want to talk more later.", wrong3: "Call me.", explanation: "'exchange contact details' و 'keep in touch' باشترین وشەکانن بۆ دروستکردنی پەیوەندی لە بۆنە فەرمییەکاندا", situationAr: "بمؤتمر شغل، تتعرف على واحد", theyAskAr: "لازم اروح للجلسة الجاية هسة. جانت فرصة حلوة انو حجيت وياك.", correctAr: "اني هم كلش تشرفت بيك. نتبادل ارقام التواصل؟ احب نبقى على تواصل.", wrong1Ar: "انطيني رقمك.", wrong2Ar: "اريد احجي وياك بعدين.", wrong3Ar: "خابرني.", explanationAr: "'نتبادل ارقام التواصل' و 'نبقى على تواصل' هي احسن كلمات لبناء العلاقات بالمناسبات الرسمية", situationRu: "Знакомство с коллегой на бизнес-конференции", theyAskRu: "Мне пора идти на следующее выступление. Было очень приятно пообщаться!", correctRu: "Мне тоже было очень приятно познакомиться! Давайте обменяемся контактами? Буду рад оставаться на связи.", wrong1Ru: "Дай мне свой номер.", wrong2Ru: "Я хочу поговорить позже.", wrong3Ru: "Позвони мне.", explanationRu: "«Exchange contact details» (обменяться контактами) и «keep in touch» (оставаться на связи) — золотой стандарт нетворкинга на официальных мероприятиях." },
    ],
  },

];

export default normalUnit02;
