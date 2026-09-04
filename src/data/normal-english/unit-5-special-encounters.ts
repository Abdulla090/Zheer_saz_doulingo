import { UnitBank } from "../types";

// ── Visible Unit 8: Special Encounters & Everyday Tasks — 10 unique lessons ─
// Practical English for specific life moments: banking, doctors, mechanics, and public services.

const normalUnit04: UnitBank = [

  // Lesson 0: At the Bank
  {
    topic: "At the Bank", topicKu: "لە بانک", topicAr: "في البنك", topicRu: "В банке",
    words: [
      { english: "Open an account", kurdish: "کردنەوەی هەژمار (حیساب)", arabic: "فتح حساب", russian: "Открыть счет" },
      { english: "Transfer money", kurdish: "حەواڵەکردنی پارە", arabic: "تحويل الأموال", russian: "Перевести деньги" },
      { english: "Interest rate", kurdish: "ڕێژەی سوود", arabic: "سعر الفائدة", russian: "Процентная ставка" },
      { english: "Make a deposit", kurdish: "خستنە سەر هەژمار (ئیداع)", arabic: "إيداع الأموال", russian: "Внести деньги на счет" },
      { english: "Withdraw cash", kurdish: "ڕاکێشانی پارە (بە کاش)", arabic: "سحب النقود", russian: "Снять наличные" },
    ],
    voices: [
      { prompt: "کردنەوەی هەژمارێکی نوێ", target: "I would like to open a savings account, please.", targetKurdish: "دەمەوێت هەژمارێکی پاشەکەوت بکەمەوە، تکایە.", promptAr: "فتح حساب جديد", targetArabic: "أود فتح حساب توفير، من فضلك.", promptRu: "Попроси открыть сберегательный счет", targetRussian: "Я бы хотел открыть сберегательный счет, пожалуйста." },
      { prompt: "حەواڵەکردنی پارە", target: "I need to transfer some money to another account.", targetKurdish: "پێویستە کەمێک پارە حەواڵەی هەژمارێکی تر بکەم.", promptAr: "تحويل الأموال", targetArabic: "أحتاج إلى تحويل بعض الأموال إلى حساب آخر.", promptRu: "Попроси перевести деньги", targetRussian: "Мне нужно перевести немного денег на другой счет." },
    ],
    sentences: [
      { english: ["Can","I","make","a","deposit","into","my","account"], kurdish: "دەتوانم پارە بخەمە سەر هەژمارەکەم؟", arabic: "هل يمكنني إيداع الأموال في حسابي؟", russian: "Могу ли я внести деньги на свой счет?" },
      { english: ["What","is","the","interest","rate","for","a","loan"], kurdish: "ڕێژەی سوود بۆ قەرزێک چەندە؟", arabic: "ما هو سعر الفائدة للقرض؟", russian: "Какова процентная ставка по кредиту?" },
    ],
    fillBlanks: [
      { parts: ["I need to","some cash from the ATM."], hint: "پێویستە کەمێک پارە (بە کاش) لە ئامێری ئەی تی ئێم ڕابکێشم.", answer: "withdraw", wrongs: ["take","get","pull"], arabicHint: "أحتاج إلى سحب بعض النقود من ماكينة الصراف الآلي.", arabicParts: ["أحتاج إلى","بعض النقود من ماكينة الصراف الآلي."], arabicAnswer: "سحب", arabicWrongs: ["أخذ","حصول","جر"], russianHint: "Мне нужно снять наличные в банкомате.", russianParts: ["Мне нужно","наличные в банкомате."], russianAnswer: "снять", russianWrongs: ["положить","перевести","потратить"] },
      { parts: ["I want to","a new checking account."], hint: "دەمەوێت هەژمارێکی نوێی جاری بکەمەوە.", answer: "open", wrongs: ["make","start","create"], arabicHint: "أريد فتح حساب جاري جديد.", arabicParts: ["أريد","حساب جاري جديد."], arabicAnswer: "فتح", arabicWrongs: ["صنع","بدء","إنشاء"], russianHint: "Я хочу открыть новый расчетный счет.", russianParts: ["Я хочу","новый расчетный счет."], russianAnswer: "открыть", russianWrongs: ["закрыть","снять","проверить"] },
    ],
    conversations: [
      {
        situation: "چوونە بانک بۆ ڕاکێشانی پارە",
        theyAsk: "How can I help you today, sir?",
        correct: "I would like to withdraw five hundred dollars from my savings account, please.",
        wrong1: "Give me 500 dollars from my money.",
        wrong2: "I want to take cash from my save.",
        wrong3: "I need to pull 500 dollars out.",
        explanation: "'Withdraw' وشەی فەرمی و دروستە بۆ ڕاکێشانی پارە لە بانک",
        situationAr: "الذهاب إلى البنك لسحب الأموال",
        explanationAr: "'Withdraw' هي الكلمة الرسمية والصحيحة لسحب الأموال من البنك.",
        theyAskAr: "شلون أگدر أساعدك اليوم، أستاذ؟",
        correctAr: "أريد أسحب خمسمية دولار من حساب التوفير مالتي، بلا زحمة.",
        wrong1Ar: "انطيني 500 دولار من فلوسي.",
        wrong2Ar: "أريد آخذ كاش من التوفير.",
        wrong3Ar: "محتاج أطلع 500 دولار برة.",
        situationRu: "Обращение в отделение банка для снятия наличных",
        theyAskRu: "Здравствуйте, чем я могу вам помочь?",
        correctRu: "Я бы хотел снять пятьсот долларов со своего сберегательного счета, пожалуйста.",
        wrong1Ru: "Дайте мне 500 долларов из моих денег.",
        wrong2Ru: "Я хочу взять кэш из копилки.",
        wrong3Ru: "Мне надо вытащить 500 долларов.",
        explanationRu: "«Withdraw» — общепринятый банковский термин для операции снятия наличных денежных средств."
      },
    ],
  },

  // Lesson 1: Renting an Apartment
  {
    topic: "Renting an Apartment", topicKu: "کرێکردنی شوقە", topicAr: "استئجار شقة", topicRu: "Аренда квартиры",
    words: [
      { english: "Sign the lease", kurdish: "واژۆکردنی گرێبەستی کرێ", arabic: "توقع عقد الإيجار", russian: "Подписать договор аренды" },
      { english: "Security deposit", kurdish: "پارەی بارمتە (تەئمینات)", arabic: "تأمين الإيجار", russian: "Залог (депозит)" },
      { english: "Are utilities included", kurdish: "ئایا خزمەتگوزارییەکان (ئاو/کارەبا) لەگەڵدایە؟", arabic: "الخدمات داخلة بالسعر؟", russian: "Коммунальные услуги включены?" },
      { english: "Fully furnished", kurdish: "ئەساسی تێدایە (موئەسەس)", arabic: "مفروشة كامل", russian: "Полностью меблированная" },
      { english: "Give notice", kurdish: "ئاگادارکردنەوەی پێشوەختە (بۆ چۆڵکردن)", arabic: "تنطي خبر من وكت", russian: "Уведомить о съезде" },
    ],
    voices: [
      { prompt: "پرسین لە خزمەتگوزارییەکان", target: "Are utilities like water and electricity included in the rent?", targetKurdish: "ئایا خزمەتگوزارییەکانی وەک ئاو و کارەبا لە نرخی کرێیەکەدا هەژمار کراون؟", promptAr: "تسأل عن الخدمات", targetArabic: "الخدمات مثل المي والكهرباء مشمولة بالإيجار؟", promptRu: "Уточни про оплату коммуналки", targetRussian: "Коммунальные услуги, такие как вода и электричество, включены в арендную плату?" },
      { prompt: "پێدانی بارمتە", target: "How much is the security deposit for this apartment?", targetKurdish: "پارەی بارمتە بۆ ئەم شوقەیە چەندە؟", promptAr: "دفع التأمين", targetArabic: "شكد مبلغ تأمين هاي الشقة؟", promptRu: "Спроси про сумму залога", targetRussian: "Каков размер залога за эту квартиру?" },
    ],
    sentences: [
      { english: ["We","are","ready","to","sign","the","lease","today"], kurdish: "ئێمە ئامادەین ئەمڕۆ گرێبەستەکە واژۆ بکەین", arabic: "احنة جاهزين نوقع عقد الإيجار اليوم", russian: "Мы готовы подписать договор аренды сегодня" },
      { english: ["You","must","give","thirty","days","notice","before","leaving"], kurdish: "دەبێت سی ڕۆژ پێشوەختە ئاگاداری بدەیت پێش چۆڵکردن", arabic: "لازم تنطي اشعار قبل ثلاثين يوم من تطلع", russian: "Вы обязаны уведомить за тридцать дней до выезда" },
    ],
    fillBlanks: [
      { parts: ["Is the apartment fully","or empty?"], hint: "ئایا شوقەکە بەتەواوی کەلوپەلی تێدایە یان بەتاڵە؟", answer: "furnished", wrongs: ["filled","ready","done"], arabicHint: "الشقة مفروشة كامل لو فارغة؟", arabicParts: ["الشقة","كامل لو فارغة؟"], arabicAnswer: "مفروشة", arabicWrongs: ["مليانة","جاهزة","خلصت"], russianHint: "Квартира полностью меблирована или пустая?", russianParts: ["Квартира полностью","или пустая?"], russianAnswer: "меблирована", russianWrongs: ["убрана","открыта","оплачена"] },
      { parts: ["I need to pay the first month's rent and the security","."], hint: "پێویستە کرێی مانگی یەکەم و پارەی بارمتەکە بدەم.", answer: "deposit", wrongs: ["money","payment","cash"], arabicHint: "احتاج ادفع إيجار الشهر الأول ومبلغ التأمين.", arabicParts: ["احتاج ادفع إيجار الشهر الأول ومبلغ","."], arabicAnswer: "التأمين", arabicWrongs: ["المال","الدفع","النقد"], russianHint: "Мне нужно оплатить аренду за первый месяц и залог.", russianParts: ["Мне нужно оплатить аренду за первый месяц и","."], russianAnswer: "залог", russianWrongs: ["счет","налог","штраф"] },
    ],
    conversations: [
      {
        situation: "سەیرکردنی شوقەیەک بۆ کرێکردن",
        theyAsk: "So, what do you think of the apartment?",
        correct: "It looks great, but I have a question. Are utilities included, or do I pay for electricity separately?",
        wrong1: "Does it have water and power free?",
        wrong2: "I want to know if I pay for lights.",
        wrong3: "Is electricity in the money?",
        explanation: "'Are utilities included?' پرسیارێکی زۆر ستانداردە کاتێک شوقەیەک بەکرێ دەگریت بۆ زانینی تێچووەکانی ئاو و کارەبا و هتد",
        situationAr: "تشوف شقة للإيجار",
        explanationAr: "'Are utilities included?' سؤال معتاد كلش لمن تأجر شقة حتى تعرف تكاليف المي والكهرباء.",
        theyAskAr: "ها، شنو رأيك بالشقة؟",
        correctAr: "تبين كلش حلوة، بس عندي سؤال. الخدمات مشمولة، لو أدفع للكهرباء وحدها؟",
        wrong1Ar: "بيها مي وكهرباء بلاش؟",
        wrong2Ar: "أريد أعرف إذا أدفع على الأضوية.",
        wrong3Ar: "الكهرباء داخلة بالفلوس؟",
        situationRu: "Осмотр потенциальной квартиры для аренды с риелтором",
        theyAskRu: "Итак, как вам эта квартира?",
        correctRu: "Она выглядит отлично, но у меня вопрос. Коммунальные услуги включены или за электричество нужно платить отдельно?",
        wrong1Ru: "Там вода и свет бесплатные?",
        wrong2Ru: "Я хочу знать, плачу ли я за лампочки.",
        wrong3Ru: "Электричество входит в деньги?",
        explanationRu: "Вопрос «Are utilities included?» — важнейший стандарт при аренде жилья за рубежом, чтобы избежать скрытых расходов."
      },
    ],
  },

  // Lesson 2: Car Troubles
  {
    topic: "Car Troubles", topicKu: "کێشەی ئۆتۆمبێل", topicAr: "مشاكل السيارة", topicRu: "Проблемы с автомобилем",
    words: [
      { english: "My car broke down", kurdish: "ئۆتۆمبێلەکەم پەکی کەوت", arabic: "سيارتي خربانة", russian: "Моя машина сломалась" },
      { english: "Flat tire", kurdish: "تایەی تەقیو / پەنجەر", arabic: "بنشر", russian: "Спущенное / пробитое колесо" },
      { english: "Making a weird noise", kurdish: "دەنگێکی سەیر دەدات", arabic: "يطلع صوت غريب", russian: "Издает странный звук" },
      { english: "Needs an oil change", kurdish: "پێویستی بە گۆڕینی ڕۆنە", arabic: "يحتاج تغيير دهن", russian: "Нужна замена масла" },
      { english: "Tow truck", kurdish: "ئۆتۆمبێلی ڕاکێشان (کڕێن)", arabic: "ونش", russian: "Эвакуатор" },
    ],
    voices: [
      { prompt: "پەیوەندیکردن بە فیتەرەوە", target: "My car broke down on the highway. I need a tow truck.", targetKurdish: "ئۆتۆمبێلەکەم لەسەر ڕێگا خێراکە پەکی کەوت. پێویستم بە ئۆتۆمبێلی ڕاکێشانە.", promptAr: "تتصل بالميكانيكي", targetArabic: "سيارتي خربانة على الطريق السريع. احتاج ونش.", promptRu: "Вызови эвакуатор на трассу", targetRussian: "Моя машина сломалась на шоссе. Мне нужен эвакуатор." },
      { prompt: "ڕوونکردنەوەی کێشەیەک", target: "The engine is making a weird noise when I start it.", targetKurdish: "بزوێنەرەکە دەنگێکی سەیر دەردەکات کاتێک ئیشی پێ دەکەم.", promptAr: "شرح مشكلة", targetArabic: "المحرك يطلع صوت غريب من اشغله.", promptRu: "Опиши шум в двигателе при запуске", targetRussian: "Двигатель издает странный звук при запуске." },
    ],
    sentences: [
      { english: ["I","have","a","flat","tire","and","no","spare"], kurdish: "تایەیەکم تەقیوە و یەدەگیشم پێ نییە", arabic: "عندي بنشر وما عندي سبير", russian: "У меня спустило колесо, а запаски нет" },
      { english: ["I","think","it","needs","an","oil","change","soon"], kurdish: "پێم وایە بە زوویی پێویستی بە گۆڕینی ڕۆن هەیە", arabic: "عبالي تحتاج تغيير دهن عن قريب", russian: "Думаю, в ближайшее время потребуется заменить масло" },
    ],
    fillBlanks: [
      { parts: ["My car","down in the middle of nowhere."], hint: "ئۆتۆمبێلەکەم لە شوێنێکی چۆڵدا پەکی کەوت.", answer: "broke", wrongs: ["stopped","died","failed"], arabicHint: "سيارتي خربت بمكان مقطوع.", arabicParts: ["سيارتي","بمكان مقطوع."], arabicAnswer: "خربت", arabicWrongs: ["وكفت","ماتت","فشلت"], russianHint: "Моя машина сломалась посреди глуши.", russianParts: ["Моя машина","посреди глуши."], russianAnswer: "сломалась", russianWrongs: ["остановилась","заглохла","разбилась"] },
      { parts: ["The brakes are making a","noise."], hint: "برێکەکان دەنگێکی سەیر دەردەکەن.", answer: "weird", wrongs: ["bad","loud","wrong"], arabicHint: "البريكات تطلع صوت غريب.", arabicParts: ["البريكات تطلع صوت","."], arabicAnswer: "غريب", arabicWrongs: ["سيء","عالي","غلط"], russianHint: "Тормоза издают странный звук.", russianParts: ["Тормоза издают","звук."], russianAnswer: "странный", russianWrongs: ["громкий","страшный","тихий"] },
    ],
    conversations: [
      {
        situation: "لە شوێنی چاککردنەوەی ئۆتۆمبێل (گەراج)",
        theyAsk: "What seems to be the problem with the vehicle?",
        correct: "It's making a weird noise when I brake, and I think it also needs an oil change.",
        wrong1: "Car goes squeak when stop.",
        wrong2: "Make sound bad and I want oil.",
        wrong3: "Fix the noise and change the oil.",
        explanation: "'Making a weird noise' باشترین ڕێگەیە بۆ وەسفکردنی کێشەیەک کە ناتوانیت دەستنیشانی بکەیت",
        situationAr: "في ورشة تصليح السيارات (الكراج)",
        explanationAr: "'Making a weird noise' هي أحسن طريقة توصف بيها مشكلة ما تكدر تحددها.",
        theyAskAr: "شنو المشكلة بالسيارة مبدئياً؟",
        correctAr: "ديطلع صوت غريب من أدوس بريك، وأعتقد همين تحتاج تغيير دهن.",
        wrong1Ar: "السيارة تسوي صوت تصفير من توگف.",
        wrong2Ar: "تطلع صوت مو زين وأريد دهن.",
        wrong3Ar: "صلح الصوت وبدل الدهن.",
        situationRu: "Объяснение поломки механику в автосервисе",
        theyAskRu: "На что жалуетесь? В чем проблема с автомобилем?",
        correctRu: "Она издает странный звук при торможении, и, думаю, пора поменять масло.",
        wrong1Ru: "Машина делает скрип, когда стоп.",
        wrong2Ru: "Звук плохой и я хочу масло.",
        wrong3Ru: "Почини шум и поменяй масло.",
        explanationRu: "«Making a weird noise» — естественное описание непонятной неисправности, понятное любому автомеханику."
      },
    ],
  },

  // Lesson 3: Personal Finances
  {
    topic: "Personal Finances", topicKu: "دارایی کەسی", topicAr: "المالية الشخصية", topicRu: "Личные финансы",
    words: [
      { english: "Living paycheck to paycheck", kurdish: "ژیان بەسەربردن لە مووچە بۆ مووچە (هیچ نامێنێتەوە)", arabic: "تعيش من راتب لراتب", russian: "Жить от зарплаты до зарплаты" },
      { english: "Stick to a budget", kurdish: "پابەندبوون بە بودجەوە (خەرجنەکردنی زیاتر لە سنوور)", arabic: "تلتزم بالميزانية", russian: "Придерживаться бюджета" },
      { english: "Pay off debt", kurdish: "دانەوەی قەرز", arabic: "تسدد ديونك", russian: "Выплатить долг" },
      { english: "Cut back on expenses", kurdish: "کەمکردنەوەی خەرجییەکان", arabic: "تقلل المصاريف", russian: "Сократить расходы" },
      { english: "Emergency fund", kurdish: "سندووقی باری لەناکاو (پارەی پاشەکەوتکراو بۆ کاتی پێویست)", arabic: "مبلغ للطوارئ", russian: "Подушка безопасности (резервный фонд)" },
    ],
    voices: [
      { prompt: "باسکردنی کەمکردنەوەی خەرجی", target: "We need to cut back on expenses to save more money.", targetKurdish: "پێویستە خەرجییەکانمان کەم بکەینەوە بۆ ئەوەی پارەی زیاتر پاشەکەوت بکەین.", promptAr: "تحچي عن تقليل المصاريف", targetArabic: "نحتاج نقلل المصاريف حتى نوفر فلوس اكثر.", promptRu: "Предложи урезать траты", targetRussian: "Нам нужно сократить расходы, чтобы откладывать больше денег." },
      { prompt: "ئامانجی دارایی", target: "My goal this year is to pay off all my debt.", targetKurdish: "ئامانجی ئەمساڵم ئەوەیە هەموو قەرزەکانم بدەمەوە.", promptAr: "هدف مالي", targetArabic: "هدفي هالسنة اخلص كل ديوني.", promptRu: "Озвучь цель рассчитаться с долгами", targetRussian: "Моя цель в этом году — полностью выплатить все долги." },
    ],
    sentences: [
      { english: ["It's","hard","living","paycheck","to","paycheck"], kurdish: "قورسە لە مووچە بۆ مووچە بژیت", arabic: "صعبة تعيش من راتب لراتب", russian: "Тяжело жить от зарплаты до зарплаты" },
      { english: ["I","am","trying","to","stick","to","a","strict","budget"], kurdish: "هەوڵدەدەم پابەند بم بە بودجەیەکی توندەوە", arabic: "احاول التزم بميزانية صارمة", russian: "Я стараюсь строго придерживаться бюджета" },
    ],
    fillBlanks: [
      { parts: ["Everyone should have an","fund for unexpected costs."], hint: "هەموو کەسێک پێویستە سندووقی باری لەناکاوی هەبێت بۆ تێچووە چاوەڕواننەکراوەکان.", answer: "emergency", wrongs: ["extra","save","backup"], arabicHint: "لازم يكون عند الكل مبلغ للطوارئ للمصاريف اللي ما تتوقعها.", arabicParts: ["لازم يكون عند الكل مبلغ","للمصاريف اللي ما تتوقعها."], arabicAnswer: "طوارئ", arabicWrongs: ["إضافي","توفير","احتياطي"], russianHint: "Каждому нужна финансовая подушка на случай непредвиденных трат.", russianParts: ["Каждому нужна финансовая","на случай непредвиденных трат."], russianAnswer: "подушка", russianWrongs: ["страховка","помощь","справка"] },
      { parts: ["I need to cut","on eating out so much."], hint: "پێویستە نانخواردنی دەرەوە کەم بکەمەوە.", answer: "back", wrongs: ["down","off","out"], arabicHint: "احتاج اقلل من الأكل بره هواية.", arabicParts: ["احتاج","من الأكل بره هواية."], arabicAnswer: "اقلل", arabicWrongs: ["انزل","اوقف","اقطع"], russianHint: "Мне нужно сократить траты на рестораны.", russianParts: ["Мне нужно","траты на походы по ресторанам."], russianAnswer: "сократить", russianWrongs: ["увеличить","забыть","оставить"] },
    ],
    conversations: [
      {
        situation: "قسەکردن لەگەڵ هاوڕێیەک دەربارەی پاشەکەوتکردن",
        theyAsk: "Do you want to go to that expensive concert next week?",
        correct: "I'd love to, but I'm trying to stick to a budget and pay off my debt. I really need to cut back on expenses.",
        wrong1: "I have no money, I am poor.",
        wrong2: "Concert is too much money for me.",
        wrong3: "I don't want to spend cash.",
        explanation: "'Stick to a budget' و 'cut back on expenses' ڕێگەیەکی زۆر مۆدێرن و باون بۆ باسکردنی ڕێکخستنی دارایی",
        situationAr: "تحچي ويه صاحبك عن التوفير",
        explanationAr: "'Stick to a budget' و 'cut back on expenses' طريقتين حديثة ومنتشرة كلش للحچي عن تنظيم الفلوس.",
        theyAskAr: "تريد تروح لهاي الحفلة الغالية الأسبوع الجاي؟",
        correctAr: "والله ياريت، بس دي أحاول ألتزم بالميزانية وأسدد ديوني. لازم أگصقص من المصاريف هالفترة.",
        wrong1Ar: "ما عندي فلوس، أني فقير.",
        wrong2Ar: "الحفلة فلوسها هواية عليه.",
        wrong3Ar: "ما أريد أصرف كاش.",
        situationRu: "Друг зовет на дорогой концерт, но вы экономите деньги",
        theyAskRu: "Хочешь пойти на тот дорогой концерт на следующей неделе?",
        correctRu: "С удовольствием бы, но я стараюсь держаться бюджета и погасить долги. Мне сейчас действительно нужно сократить расходы.",
        wrong1Ru: "У меня нет денег, я бедный.",
        wrong2Ru: "Концерт слишком много денег для меня.",
        wrong3Ru: "Я не хочу тратить наличку.",
        explanationRu: "«Stick to a budget» (придерживаться бюджета) и «cut back on expenses» (сократить расходы) — грамотные, зрелые формулировки финансовой дисциплины."
      },
    ],
  },

  // Lesson 4: Reporting to Authorities
  {
    topic: "Reporting to Authorities", topicKu: "مامەڵەکردن لەگەڵ دەسەڵات (پۆلیس/ئاسایش)", topicAr: "الإبلاغ عن السلطات", topicRu: "Заявление в полицию",
    words: [
      { english: "I'd like to report", kurdish: "دەمەوێت سکاڵا / ڕاپۆرت بکەم", arabic: "اريد ابلغ عن", russian: "Я бы хотел заявить о..." },
      { english: "My wallet was stolen", kurdish: "جزدانەکەم دزراوە", arabic: "انباكت محفظتي", russian: "У меня украли кошелек" },
      { english: "Fill out a form", kurdish: "پڕکردنەوەی فۆڕمێک", arabic: "تملي استمارة", russian: "Заполнить бланк заявления" },
      { english: "Provide a description", kurdish: "پێدانی وەسف (وەسفکردنی کەسێک یان شتێک)", arabic: "تنطي مواصفات", russian: "Предоставить описание (внешности)" },
      { english: "Lost and found", kurdish: "بەشی ونبوو و دۆزراوە", arabic: "المفقودات", russian: "Бюро находок" },
    ],
    voices: [
      { prompt: "ڕاپۆرتدانی دزی", target: "I'd like to report a crime. My wallet was stolen.", targetKurdish: "دەمەوێت سکاڵا لەسەر تاوانێک بکەم. جزدانەکەم دزراوە.", promptAr: "تبلغ عن سرقة", targetArabic: "اريد ابلغ عن جريمة. انباكت محفظتي.", promptRu: "Заяви о краже кошелька в полицию", targetRussian: "Я бы хотел заявить о преступлении. У меня украли кошелек." },
      { prompt: "بەشی ونبووەکان", target: "Did anyone turn in a bag to the lost and found?", targetKurdish: "ئایا کەس جانتایەکی ڕادەستی بەشی ونبوو و دۆزراوە کردووە؟", promptAr: "قسم المفقودات", targetArabic: "اكو احد سلم جنطة لقسم المفقودات؟", promptRu: "Спроси про потерянную сумку в бюро находок", targetRussian: "Никто не приносил сумку в бюро находок?" },
    ],
    sentences: [
      { english: ["You","will","need","to","fill","out","a","report","form"], kurdish: "پێویست دەکات فۆڕمێکی ڕاپۆرتکردن پڕ بکەیتەوە", arabic: "راح تحتاج تملي استمارة بلاغ", russian: "Вам потребуется заполнить бланк заявления о происшествии" },
      { english: ["Can","you","provide","a","description","of","the","man"], kurdish: "دەتوانیت وەسفی پیاوەکە بکەیت؟", arabic: "تكدر توصفلي الرجال؟", russian: "Можете ли вы описать внешность этого мужчины?" },
    ],
    fillBlanks: [
      { parts: ["My phone was","on the train this morning."], hint: "مۆبایلەکەم دزرا لەسەر شەمەندەفەرەکە ئەم بەیانییە.", answer: "stolen", wrongs: ["robbed","taken","lost"], arabicHint: "انباك تليفوني بالقطار هذا الصباح.", arabicParts: ["تليفوني","بالقطار هذا الصباح."], arabicAnswer: "انباك", arabicWrongs: ["انسرق","انأخذ","ضاع"], russianHint: "Мой телефон украли в поезде этим утром.", russianParts: ["Мой телефон","в поезде этим утром."], russianAnswer: "украли", russianWrongs: ["забыли","сломали","выронили"] },
      { parts: ["Please fill","this incident form."], hint: "تکایە ئەم فۆڕمی ڕووداوە پڕ بکەرەوە.", answer: "out", wrongs: ["in","up","down"], arabicHint: "بلا زحمة املي استمارة الحادث هاي.", arabicParts: ["بلا زحمة","استمارة الحادث هاي."], arabicAnswer: "املي", arabicWrongs: ["ادخال","رفع","تنزيل"], russianHint: "Пожалуйста, заполните этот бланк о происшествии.", russianParts: ["Пожалуйста,","этот бланк о происшествии."], russianAnswer: "заполните", russianWrongs: ["прочитайте","подпишите","отдайте"] },
    ],
    conversations: [
      {
        situation: "لە بنکەی پۆلیس",
        theyAsk: "How can we assist you today?",
        correct: "I'd like to report a theft. My wallet was stolen while I was at the cafe.",
        wrong1: "Someone take my money.",
        wrong2: "I lost wallet. Find it.",
        wrong3: "Thief stole my bag.",
        explanation: "'I'd like to report a theft/crime' شێوازی دروستی قسەکردنە لەگەڵ پۆلیس",
        situationAr: "بمركز الشرطة",
        explanationAr: "'I'd like to report a theft/crime' هي الطريقة الصحيحة حتى تحچي وية الشرطة.",
        theyAskAr: "شلون نگدر نساعدك اليوم؟",
        correctAr: "أريد أبلغ عن سرقة. انباگت محفظتي وأني چنت بالكوفي شوب.",
        wrong1Ar: "أحد أخذ فلوسي.",
        wrong2Ar: "ضاعت محفظتي. لگوها.",
        wrong3Ar: "حرامي باگ جنطتي.",
        situationRu: "Обращение к дежурному в полицейском участке",
        theyAskRu: "Здравствуйте, чем мы можем вам помочь?",
        correctRu: "Я хотел бы заявить о краже. У меня украли бумажник, пока я находился в кафе.",
        wrong1Ru: "Кто-то забрал мои деньги.",
        wrong2Ru: "Я потерял кошелек. Найдите его.",
        wrong3Ru: "Вор украл мою сумку.",
        explanationRu: "«I'd like to report a theft/crime» — установленная официальная формулировка для подачи заявления в правоохранительные органы."
      },
    ],
  },

  // Lesson 5: Parent-Teacher Meetings
  {
    topic: "Parent-Teacher Meetings", topicKu: "کۆبوونەوەی دایکوباوک و مامۆستا", topicAr: "اجتماعات أولياء الأمور والمعلمين", topicRu: "Родительское собрание",
    words: [
      { english: "Falling behind", kurdish: "دواکەوتن لە خوێندن (لاوازبوون)", arabic: "متأخر بالدراسة", russian: "Отставать по программе" },
      { english: "Paying attention", kurdish: "سەرنجدان / ئاگاداربوون لە پۆل", arabic: "ينتبه بالصف", russian: "Быть внимательным / слушать" },
      { english: "Room for improvement", kurdish: "هێشتا بواری بەرەوپێشچوونی هەیە", arabic: "يكدر يتحسن بعد", russian: "Есть куда расти (зона для улучшений)" },
      { english: "Gets along well with", kurdish: "پەیوەندی باشە لەگەڵ (هاوڕێیەتیان دەکات)", arabic: "يتوالم زين وية", russian: "Хорошо ладит с..." },
      { english: "Reaching their potential", kurdish: "گەیشتن بەو ئاستەی کە توانای هەیە", arabic: "يوصلون لمستواهم الحقيقي", russian: "Раскрывать свой потенциал" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە ئاستی منداڵ", target: "Is my son falling behind in math?", targetKurdish: "ئایا کوڕەکەم لە بیرکاریدا لاواز بووە و دواکەوتووە؟", promptAr: "تسأل عن مستوى الطفل", targetArabic: "ابني متأخر بالرياضيات؟", promptRu: "Уточни у учителя об успеваемости сына", targetRussian: "Мой сын отстает по математике?" },
      { prompt: "پەسەندکردنی هەڵسوکەوت", target: "She gets along well with the other children.", targetKurdish: "ئەو پەیوەندییەکی باشی هەیە لەگەڵ منداڵەکانی تردا.", promptAr: "تمدح السلوك", targetArabic: "هي تتوالم زين وية الجهال الباقين.", promptRu: "Отметь, как ребенок ладит со сверстниками", targetRussian: "Она отлично ладит с другими детьми." },
    ],
    sentences: [
      { english: ["He","is","smart","but","he","needs","to","pay","attention"], kurdish: "ئەو زیرەکە بەڵام پێویستە سەرنج بدات (گوێ بگرێت لە پۆل)", arabic: "هو ذكي بس يحتاج ينتبه", russian: "Он способный, но ему нужно быть внимательнее на уроках" },
      { english: ["There","is","definitely","room","for","improvement"], kurdish: "بێگومان هێشتا بواری بەرەوپێشچوون ماوە", arabic: "اكيد يكدر يتحسن بعد", russian: "Здесь определенно есть потенциал для улучшений" },
    ],
    fillBlanks: [
      { parts: ["Your daughter gets","very well with her classmates."], hint: "کچەکەت زۆر بەباشی هەڵدەکات لەگەڵ هاوپۆلەکانی.", answer: "along", wrongs: ["on","with","around"], arabicHint: "بنتك تتوالم زين وية زملائها بالصف.", arabicParts: ["بنتك","زين وية زملائها بالصف."], arabicAnswer: "تتوالم", arabicWrongs: ["تستمر","مع","حول"], russianHint: "Ваша дочь отлично ладит с одноклассниками.", russianParts: ["Ваша дочь отлично","с одноклассниками."], russianAnswer: "ладит", russianWrongs: ["дружит","играет","говорит"] },
      { parts: ["He is bright, but he is falling","in reading."], hint: "ئەو زیرەکە، بەڵام لە خوێندنەوەدا دواکەوتووە.", answer: "behind", wrongs: ["back","down","off"], arabicHint: "هو ذكي، بس متأخر بالقراءة.", arabicParts: ["هو ذكي، بس","بالقراءة."], arabicAnswer: "متأخر", arabicWrongs: ["يرجع","ينزل","يوكع"], russianHint: "Он смышленый, но немного отстает по чтению.", russianParts: ["Он смышленый, но немного","по чтению."], russianAnswer: "отстает", russianWrongs: ["спешит","молчит","ленится"] },
    ],
    conversations: [
      {
        situation: "قسەکردن لەگەڵ مامۆستای منداڵەکەت",
        theyAsk: "Do you have any specific concerns about Leo's progress?",
        correct: "Yes, I'm worried he might be falling behind in Science. Is he paying attention in class?",
        wrong1: "Is he bad at science?",
        wrong2: "Why he don't study science?",
        wrong3: "Does he sleep in class?",
        explanation: "'Falling behind' و 'paying attention' زاراوەی پەروەردەیی زۆر باون لەم کۆبوونەوانەدا",
        situationAr: "تحچي وية معلم طفلك",
        explanationAr: "'Falling behind' و 'paying attention' مصطلحات مال مدارس كلش شائعة بهاي الاجتماعات.",
        theyAskAr: "عندك أي قلق معين بخصوص مستوى ليو؟",
        correctAr: "إي، قلقان لا يكون متأخر بالعلوم. هو دي ينتبه بالصف؟",
        wrong1Ar: "هو مو زين بالعلوم؟",
        wrong2Ar: "ليش ما يدرس علوم؟",
        wrong3Ar: "هو ينام بالصف؟",
        situationRu: "Беседа с классным руководителем об успеваемости ребенка",
        theyAskRu: "Есть ли у вас какие-то конкретные вопросы по успехам Лео?",
        correctRu: "Да, меня беспокоит, не отстает ли он по естествознанию. Внимателен ли он на уроках?",
        wrong1Ru: "Он плох в науке?",
        wrong2Ru: "Почему он не учит науку?",
        wrong3Ru: "Он спит в классе?",
        explanationRu: "«Falling behind» (отставать по программе) и «paying attention» (быть внимательным) — общепринятая педагогическая лексика в англоязычных школах."
      },
    ],
  },

  // Lesson 6: Salon & Barbershop
  {
    topic: "Salon & Barbershop", topicKu: "لە سەرتاشخانە و ساڵۆن", topicAr: "في ��لصالون / صالون الحلاقة", topicRu: "В салоне и барбершопе",
    words: [
      { english: "Just a trim", kurdish: "تەنها کەمێک کورتکردنەوە (بۆ ڕێکخستن)", arabic: "زيان خفيف", russian: "Просто подровнять кончики" },
      { english: "Take a little off the top", kurdish: "کەمێک لە سەرەوەی کورت بکەرەوە", arabic: "اخذ شوية من فوك", russian: "Снять немного сверху" },
      { english: "Dye my hair", kurdish: "قژم بۆیە بکەم", arabic: "اصبغ شعري", russian: "Покрасить волосы" },
      { english: "Layers", kurdish: "بڕینی قژ بە شێوەی چین چین (مدرج)", arabic: "مدرج", russian: "Каскад / пряди слоями" },
      { english: "Fade on the sides", kurdish: "سووککردنی قژ لە تەنیشتەکان (تەدروج)", arabic: "تدرج من الصفاح", russian: "Фейд (плавный переход) по бокам" },
    ],
    voices: [
      { prompt: "داواکردنی ڕێکخستنی قژ", target: "I don't want it too short, just a trim please.", targetKurdish: "نامەوێت زۆر کورت بێت، تەنها کەمێک ڕێکی بخە تکایە.", promptAr: "تطلب تعديل الشعر", targetArabic: "ما اريده كلش قصير، بس خفيف بلا زحمة.", promptRu: "Попроси лишь слегка подровнять волосы", targetRussian: "Слишком коротко не надо, просто подровняйте, пожалуйста." },
      { prompt: "مۆدێلی پیاوانە", target: "Can you give me a fade on the sides and take a little off the top?", targetKurdish: "دەتوانیت تەنیشتەکانی بۆ سووک بکەیت و کەمێکیش لە سەرەوەی کورت بکەیتەوە؟", promptAr: "زيان رجالي", targetArabic: "تكدر تسويلي تدرج من الصفاح وتاخذ شوية من فوك؟", promptRu: "Опиши желаемую стрижку барберу", targetRussian: "Сделайте фейд по бокам и снимите немного сверху." },
    ],
    sentences: [
      { english: ["I","would","like","to","dye","my","hair","brown"], kurdish: "حەز دەکەم قژم بۆیە بکەم بە قاوەیی", arabic: "اريد اصبغ شعري جوزي", russian: "Я бы хотела покрасить волосы в каштановый цвет" },
      { english: ["Could","you","add","some","layers","in","the","back"], kurdish: "دەتوانیت لە دواوە بە شێوەی چین چین بیبڕیت؟", arabic: "تكدر تسويلي شوية مدرج ليورة؟", russian: "Не могли бы вы сделать сзади стрижку слоями?" },
    ],
    fillBlanks: [
      { parts: ["I just want a",", nothing too crazy."], hint: "تەنها ڕێکخستنێک (کەمێک کورتکردنەوەم) دەوێت، شتێکی زۆر سەیر نا.", answer: "trim", wrongs: ["cut","chop","style"], arabicHint: "اريد بس زيان خفيف، مو فد شي غريب.", arabicParts: ["اريد بس","، مو فد شي غريب."], arabicAnswer: "زيان خفيف", arabicWrongs: ["قص","تقطيع","تسريحة"], russianHint: "Я просто хочу немного подровнять, ничего кардинального.", russianParts: ["Я просто хочу немного",", ничего кардинального."], russianAnswer: "подровнять", russianWrongs: ["покороче","покрасить","сбрить"] },
      { parts: ["Keep the length, but add some","for volume."], hint: "درێژییەکەی بهێڵەرەوە، بەڵام کەمێک چین چینی (مدرج) تێ بکە بۆ ئەوەی پڕتر دەربکەوێت.", answer: "layers", wrongs: ["steps","parts","lines"], arabicHint: "بقي الطول، بس ضيف شوية مدرج حتى يبين ثخين.", arabicParts: ["بقي الطول، بس ضيف شوية","حتى يبين ثخين."], arabicAnswer: "مدرج", arabicWrongs: ["خطوات","اجزاء","خطوط"], russianHint: "Оставьте длину, но сделайте слои для объема.", russianParts: ["Оставьте длину, но сделайте","для объема."], russianAnswer: "слои", russianWrongs: ["линии","кудри","пряди"] },
    ],
    conversations: [
      {
        situation: "لەلای سەرتاشەکەت دانیشتوویت",
        theyAsk: "So, what are we doing today? A completely new style?",
        correct: "No, keep the length. Just a trim, and maybe take a little off the top. I like the current style.",
        wrong1: "Don't cut too much.",
        wrong2: "Make it small cut.",
        wrong3: "I want small hair.",
        explanation: "'Just a trim' و 'take a little off the top' باوترین دەستەواژەی سەرتاشخانەکانن",
        situationAr: "كاعد يم الحلاق",
        explanationAr: "'Just a trim' و 'take a little off the top' هيه اكثر الجمل الشائعة يم الحلاق.",
        theyAskAr: "ها، شنو راح نسوي اليوم؟ تسريحة جديدة تماماً؟",
        correctAr: "لا، خلي الطول نفسه. بس خفيف، وممكن تاخذ شوية من فوگ. عاجبني ستايلي الحالي.",
        wrong1Ar: "لا تگص هواية.",
        wrong2Ar: "سويها گصة صغيرة.",
        wrong3Ar: "أريد شعر صغير.",
        situationRu: "Обсуждение стрижки с мастером в барбершопе",
        theyAskRu: "Ну что, что делаем сегодня? Полностью новый стиль?",
        correctRu: "Нет, оставьте длину. Просто подровняйте и, может, снимите немного сверху. Текущая стрижка мне нравится.",
        wrong1Ru: "Не стриги слишком много.",
        wrong2Ru: "Сделай маленькую стрижку.",
        wrong3Ru: "Я хочу маленькие волосы.",
        explanationRu: "«Just a trim» (только подровнять) и «take a little off the top» (немного снять сверху) — профессиональные термины, которые поймет любой парикмахер."
      },
    ],
  },

  // Lesson 7: Home Repairs
  {
    topic: "Home Repairs", topicKu: "چاککردنەوەی ماڵ (کارەبا/بۆری)", topicAr: "إصلاحات المنزل", topicRu: "Ремонт и бытовые поломки",
    words: [
      { english: "The pipe is leaking", kurdish: "بۆرییەکە دڵۆپە دەکات", arabic: "البوري يخر", russian: "Труба протекает" },
      { english: "Power outage", kurdish: "بڕانی کارەبا", arabic: "انكطعت الكهرباء", russian: "Отключение электричества" },
      { english: "Clogged drain", kurdish: "گیرانی ئاوەڕۆ", arabic: "المجاري مسدودة", russian: "Засор в сливе / раковине" },
      { english: "Short circuit", kurdish: "شۆرتی کارەبا", arabic: "شورت كهرباء", russian: "Короткое замыкание" },
      { english: "Give me an estimate", kurdish: "خەمڵاندنێکم بۆ بکە (بۆ نرخەکە)", arabic: "انطيني سعر تقريبي", russian: "Рассчитать смету / назвать стоимость" },
    ],
    voices: [
      { prompt: "کێشەی بۆری ئاو", target: "The pipe under the sink is leaking. We need a plumber.", targetKurdish: "بۆری ژێر مەغسەلەکە دڵۆپە دەکات. پێویستمان بە بۆریچییەکە.", promptAr: "مشكلة ببوري المي", targetArabic: "البوري جوة المغسلة يخر. نحتاج سباك.", promptRu: "Сообщи о протечке трубы сантехнику", targetRussian: "Труба под раковиной протекает. Нам нужен сантехник." },
      { prompt: "داوای نرخی خەمڵێنراو", target: "Can you give me an estimate for the repairs?", targetKurdish: "دەتوانیت خەمڵاندنێکم بۆ بکەیت بۆ نرخەی چاککردنەوەکە؟", promptAr: "تطلب سعر تقريبي", targetArabic: "تكدر تنطيني سعر تقريبي للتصليحات؟", promptRu: "Попроси предварительную смету работ", targetRussian: "Можете ли вы назвать примерную стоимость ремонта?" },
    ],
    sentences: [
      { english: ["The","drain","is","clogged","and","water","won't","go","down"], kurdish: "ئاوەڕۆکە گیراوە و ئاوەکە ناڕوات", arabic: "المجاري مسدودة والمي ما ينزل", russian: "Слив засорился, и вода совсем не уходит" },
      { english: ["I","think","there","was","a","short","circuit","in","the","wall"], kurdish: "پێم وایە شۆرتی کارەبا هەبو لە دیوارەکەدا", arabic: "اعتقد صار شورت كهرباء بالحايط", russian: "Мне кажется, в стене произошло короткое замыкание" },
    ],
    fillBlanks: [
      { parts: ["Can you give me a rough","of the cost?"], hint: "دەتوانیت خەمڵاندنێکی زبری (گشتی) تێچووەکەم پێ بدەیت؟", answer: "estimate", wrongs: ["price","guess","number"], arabicHint: "تكدر تنطيني سعر تقريبي للتكلفة؟", arabicParts: ["تكدر تنطيني","تقريبي للتكلفة؟"], arabicAnswer: "سعر", arabicWrongs: ["رقم","تخمين","حساب"], russianHint: "Можете ли вы назвать примерную смету расходов?", russianParts: ["Можете ли вы назвать примерную","расходов?"], russianAnswer: "смету", russianWrongs: ["сумму","цену","плату"] },
      { parts: ["The sink is",", the water won't drain."], hint: "مەغسەلەکە گیراوە، ئاوەکە بەتاڵ نابێتەوە.", answer: "clogged", wrongs: ["stuck","blocked","closed"], arabicHint: "المغسلة مسدودة، والمي ما ينزل.", arabicParts: ["المغسلة","، والمي ما ينزل."], arabicAnswer: "مسدودة", arabicWrongs: ["علكانة","مكسورة","مقفولة"], russianHint: "Раковина засорилась, вода не стекает.", russianParts: ["Раковина",", вода не стекает."], russianAnswer: "засорилась", russianWrongs: ["сломалась","потрескалась","протекла"] },
    ],
    conversations: [
      {
        situation: "تەلەفۆن بۆ کارەباچییەک دەکەیت",
        theyAsk: "What seems to be the issue with the electricity?",
        correct: "Half the house has a power outage. I think there was a short circuit. Can you give me an estimate before coming?",
        wrong1: "No electricity in house.",
        wrong2: "Lights went boom. Tell me price.",
        wrong3: "Fix my wires. How much?",
        explanation: "'Power outage'، 'short circuit'، و 'estimate' وشەی زۆر پێویستن بۆ مامەڵەکردن لەگەڵ وەستاکان",
        situationAr: "تتصل بكهربائي",
        explanationAr: "'Power outage'، 'short circuit'، و 'estimate' كلمات ضرورية كلش حتى تحچي وية الفنيين.",
        theyAskAr: "شنو المشكلة اللي صايرة بالكهرباء؟",
        correctAr: "نص البيت مگطوعة الكهرباء عنه. أعتقد صار شورت بالحايط. تگدر تنطيني سعر تقريبي قبل ما تجي؟",
        wrong1Ar: "ماكو كهرباء بالبيت.",
        wrong2Ar: "الگلوبات طگت. گلي السعر.",
        wrong3Ar: "صلح وايراتي. بيش؟",
        situationRu: "Звонок электрику по поводу внезапно погасшего света",
        theyAskRu: "В чем именно заключается проблема с электричеством?",
        correctRu: "В половине дома погас свет. Кажется, произошло короткое замыкание. Не могли бы вы назвать примерную смету до приезда?",
        wrong1Ru: "Нет электричества в доме.",
        wrong2Ru: "Свет сделал бум. Скажи цену.",
        wrong3Ru: "Почини мои провода. Сколько?",
        explanationRu: "«Power outage» (отключение питания), «short circuit» (короткое замыкание) и «estimate» (предварительная смета) — ключевые слова для вызова мастера."
      },
    ],
  },

  // Lesson 8: Returns & Refunds
  {
    topic: "Returns & Refunds", topicKu: "گەڕاندنەوە و وەرگرتنەوەی پارە", topicAr: "الإرجاع واسترداد الأموال", topicRu: "Возврат товаров и денег",
    words: [
      { english: "It's defective", kurdish: "کەموکوڕی تێدایە (خراپە)", arabic: "بيه خلل", russian: "Товар с браком (дефектный)" },
      { english: "I'd like a refund", kurdish: "دەمەوێت پارەکەم وەربگرمەوە", arabic: "اريد ارجع فلوسي", russian: "Я бы хотел вернуть деньги" },
      { english: "Do you have the receipt", kurdish: "ئایا پسووڵەکەت (وەسڵەکەت) پێیە؟", arabic: "عندك الوصل؟", russian: "У вас сохранился чек?" },
      { english: "Exchange it for", kurdish: "بیگۆڕمەوە بە...", arabic: "ابدله بـ", russian: "Обменять на..." },
      { english: "Under warranty", kurdish: "لەژێر زەمانەتدایە", arabic: "عليه ضمان", russian: "На гарантии" },
    ],
    voices: [
      { prompt: "گەڕاندنەوەی شتێکی خراپ", target: "I bought this yesterday, but it's defective. I'd like a refund.", targetKurdish: "دوێنێ ئەمەم کڕی، بەڵام کەموکوڕی تێدایە. دەمەوێت پارەکەم وەربگرمەوە.", promptAr: "إرجاع شيء معيب", targetArabic: "اشتريت هذا بالأمس، لكنه معيب. أود استرداد أموالي.", promptRu: "Потребуй возврат денег за бракованную вещь", targetRussian: "Я купил это вчера, но товар оказался бракованным. Я хочу вернуть деньги." },
      { prompt: "گۆڕینەوەی کاڵایەک", target: "Can I exchange this for a larger size?", targetKurdish: "دەتوانم ئەمە بگۆڕمەوە بە قەبارەیەکی گەورەتر؟", promptAr: "تبديل غرض", targetArabic: "اكدر ابدل هذا بقياس اكبر؟", promptRu: "Спроси об обмене на больший размер", targetRussian: "Могу ли я обменять это на размер побольше?" },
    ],
    sentences: [
      { english: ["Do","you","still","have","the","original","receipt"], kurdish: "ئایا هێشتا پسووڵە ڕەسەنەکەت پێیە؟", arabic: "بعدك محتفظ بالوصل الأصلي؟", russian: "У вас сохранился оригинальный чек о покупке?" },
      { english: ["The","laptop","is","still","under","warranty","right"], kurdish: "لاپتۆپەکە هێشتا لەژێر زەمانەتدایە، ڕاستە؟", arabic: "اللابتوب بعده على الضمان، مو؟", russian: "Ноутбук ведь еще находится на гарантии, верно?" },
    ],
    fillBlanks: [
      { parts: ["This screen is broken. It's completely","."], hint: "ئەم شاشەیە شکاوە. بەتەواوی کەموکوڕی تێدایە (خراپە).", answer: "defective", wrongs: ["bad","wrong","fault"], arabicHint: "هاي الشاشة مكسورة. بيها خلل تماماً.", arabicParts: ["هاي الشاشة مكسورة. بيها","تماماً."], arabicAnswer: "خلل", arabicWrongs: ["سيئة","غلط","خطأ"], russianHint: "Экран разбит. Он полностью бракованный.", russianParts: ["Экран разбит. Он полностью","."], russianAnswer: "бракованный", russianWrongs: ["старый","грязный","дорогой"] },
      { parts: ["I'd like a full","to my credit card."], hint: "دەمەوێت بەتەواوی پارەکەم بۆ بگەڕێندرێتەوە سەر کارتی بانکییەکەم.", answer: "refund", wrongs: ["return","money","back"], arabicHint: "اريد ارجع المبلغ كامل على بطاقتي الائتمانية.", arabicParts: ["اريد","المبلغ كامل على بطاقتي الائتمانية."], arabicAnswer: "ارجع", arabicWrongs: ["ابقي","فلوس","عودة"], russianHint: "Я бы хотел полный возврат средств на карту.", russianParts: ["Я бы хотел полный","средств на банковскую карту."], russianAnswer: "возврат", russianWrongs: ["перевод","обмен","расчет"] },
    ],
    conversations: [
      {
        situation: "گەڕاندنەوەی تەلەڤیزیۆنێک بۆ فرۆشگاکە",
        theyAsk: "Is there something wrong with the item?",
        correct: "Yes, it's defective. The screen doesn't turn on. I have the receipt and it's under warranty. I'd like a refund.",
        wrong1: "TV is broken. Give my money.",
        wrong2: "It not work. Take it back.",
        wrong3: "I want refund because bad TV.",
        explanation: "'Defective', 'receipt', 'warranty', و 'refund' چوار وشەی ئاڵتوونین بۆ گەڕاندنەوەی کاڵا لە دەرەوەی وڵات",
        situationAr: "ترجع تلفزيون للمحل",
        explanationAr: "'Defective', 'receipt', 'warranty', و 'refund' اربع كلمات ذهبية حتى ترجع الأغراض برة البلد.",
        theyAskAr: "أكو شي خربان بالقطعة؟",
        correctAr: "إي، بيها خلل. الشاشة ما تشتغل أبد. وعندي الوصل وبعدها على الضمان. أريد أرجع فلوسي.",
        wrong1Ar: "التلفزيون مكسور. انطيني فلوسي.",
        wrong2Ar: "ما يشتغل. رجعه.",
        wrong3Ar: "أريد ترجيع لأن تلفزيون مو زين.",
        situationRu: "Возврат неработающего телевизора в магазин бытовой техники",
        theyAskRu: "С товаром что-то не так?",
        correctRu: "Да, он бракованный. Экран не включается. У меня есть чек, и товар на гарантии. Я хотел бы оформить возврат средств.",
        wrong1Ru: "Телевизор сломан. Отдайте деньги.",
        wrong2Ru: "Он не работает. Забирайте обратно.",
        wrong3Ru: "Хочу возврат денег, потому что ТВ плохой.",
        explanationRu: "«Defective» (бракованный), «receipt» (чек), «warranty» (гарантия) и «refund» (возврат денег) — четыре золотых термина при возврате покупок."
      },
    ],
  },

  // Lesson 9: Human Resources (HR)
  {
    topic: "Human Resources (HR)", topicKu: "سەرچاوە مرۆییەکان و ئیمتیازاتی کار", topicAr: "الموارد البشرية ومزايا العمل", topicRu: "Отдел кадров и льготы",
    words: [
      { english: "Paid time off", kurdish: "مۆڵەتی بە پارە (پشوو کە مووچەی لەگەڵدایە)", arabic: "اجازة مدفوعة الأجر", russian: "Оплачиваемый отпуск" },
      { english: "Health benefits", kurdish: "ئیمتیازاتی تەندروستی (دڵنیایی)", arabic: "مزايا صحية", russian: "Медицинская страховка (льготы)" },
      { english: "Performance review", kurdish: "هەڵسەنگاندنی ئاستی کارکردن", arabic: "تقييم الأداء", russian: "Оценка эффективности работы (ревью)" },
      { english: "Call in sick", kurdish: "پەیوەندیکردن بۆ وەرگرتنی مۆڵەتی نەخۆشی", arabic: "تخابر تاخذ اجازة مرضية", russian: "Взять больничный" },
      { english: "Maternity leave", kurdish: "مۆڵەتی دایکایەتی (بۆ منداڵبوون)", arabic: "اجازة امومة", russian: "Декретный отпуск" },
    ],
    voices: [
      { prompt: "پرسین لە مۆڵەت", target: "How many days of paid time off do we get a year?", targetKurdish: "ساڵانە چەند ڕۆژ مۆڵەتی بە پارەمان هەیە؟", promptAr: "تسأل عن الاجازة", targetArabic: "كم يوم اجازة مدفوعة الأجر نحصل بالسنة؟", promptRu: "Уточни количество дней оплачиваемого отпуска", targetRussian: "Сколько дней оплачиваемого отпуска нам положено в год?" },
      { prompt: "وەرگرتنی مۆڵەتی نەخۆشی", target: "I'm not feeling well. I need to call in sick today.", targetKurdish: "هەست بە باشی ناکەم. پێویستە ئەمڕۆ تەلەفۆن بکەم و مۆڵەتی نەخۆشی وەربگرم.", promptAr: "الحصول على إجازة مرضية", targetArabic: "ما احس نفسي زين. احتاج اخابر اخذ اجازة مرضية اليوم.", promptRu: "Предупреди о болезни и возьми отгул", targetRussian: "Я плохо себя чувствую. Мне нужно взять больничный на сегодня." },
    ],
    sentences: [
      { english: ["She","is","currently","on","maternity","leave","until","June"], kurdish: "ئەو لە ئێستادا لە مۆڵەتی دایکایەتیدایە تاوەکو مانگی حوزەیران", arabic: "هي هسة باجازة امومة لحد شهر حزيران", russian: "В настоящее время она находится в декретном отпуске до июня" },
      { english: ["We","have","excellent","health","benefits","at","this","company"], kurdish: "لەم کۆمپانیایەدا ئیمتیازاتی تەندروستی نایابمان هەیە", arabic: "عدنا مزايا صحية ممتازة بهاي الشركة", russian: "В нашей компании отличный социальный пакет и медицинская страховка" },
    ],
    fillBlanks: [
      { parts: ["I have the flu, so I have to","in sick today."], hint: "ئەنفلۆنزام هەیە، بۆیە دەبێت ئەمڕۆ پەیوەندی بکەم بۆ مۆڵەتی نەخۆشی.", answer: "call", wrongs: ["tell","say","take"], arabicHint: "عندي فلاونزا، فـ لازم اخابر حتى اخذ اجازة مرضية اليوم.", arabicParts: ["عندي فلاونزا، فـ لازم","حتى اخذ اجازة مرضية اليوم."], arabicAnswer: "اخابر", arabicWrongs: ["اكول","احچي","اخذ"], russianHint: "У меня грипп, поэтому сегодня мне придется взять больничный.", russianParts: ["У меня грипп, поэтому сегодня мне придется взять","."], russianAnswer: "больничный", russianWrongs: ["отпуск","отгул","выходной"] },
      { parts: ["We will discuss your salary during your performance","."], hint: "گفتوگۆ لەسەر مووچەکەت دەکەین لە کاتی هەڵسەنگاندنی ئاستی کارکردنەکەتدا.", answer: "review", wrongs: ["check","talk","meeting"], arabicHint: "راح نناقش راتبك من نسوي تقييم أدائك.", arabicParts: ["راح نناقش راتبك من نسوي","أدائك."], arabicAnswer: "تقييم", arabicWrongs: ["فحص","محادثة","اجتماع"], russianHint: "Мы обсудим вашу зарплату во время оценки эффективности.", russianParts: ["Мы обсудим вашу зарплату во время оценки","."], russianAnswer: "эффективности", russianWrongs: ["сложности","скорости","занятости"] },
    ],
    conversations: [
      {
        situation: "چاوپێکەوتن لەگەڵ بەشی HR بۆ زانینی ئیمتیازاتەکان",
        theyAsk: "Do you have any questions about the benefits package?",
        correct: "Yes. Could you explain the health benefits and how much paid time off is offered?",
        wrong1: "How many days I sleep at home with money?",
        wrong2: "Do you pay when I am sick?",
        wrong3: "I want to know about doctor money.",
        explanation: "'Paid time off' (PTO) و 'Health benefits' زاراوەی فەرمی و زۆر گرنگن لە هەر گرێبەستێکی کارکردندا",
        situationAr: "مقابلة وية قسم الموارد البشرية",
        explanationAr: "'Paid time off' (PTO) و 'Health benefits' مصطلحات رسمية ومهمة كلش بأي عقد عمل.",
        theyAskAr: "عندك أي سؤال بخصوص حزمة الامتيازات والمزايا؟",
        correctAr: "نعم. ممكن توضحلي المزايا الصحية وشگد إجازات مدفوعة الأجر تنطون؟",
        wrong1Ar: "كم يوم أنام بالبيت بفلوس؟",
        wrong2Ar: "تدفعون من أمرض؟",
        wrong3Ar: "أريد أعرف عن فلوس الدكتور.",
        situationRu: "Беседа со специалистом по персоналу о пакете льгот",
        theyAskRu: "У вас есть какие-либо вопросы по поводу предложенного соцпакета?",
        correctRu: "Да. Не могли бы вы подробнее рассказать о медицинской страховке и количестве дней оплачиваемого отпуска?",
        wrong1Ru: "Сколько дней я сплю дома с деньгами?",
        wrong2Ru: "Вы платите, когда я болею?",
        wrong3Ru: "Я хочу знать про деньги на доктора.",
        explanationRu: "«Paid time off» (оплачиваемый отпуск) и «health benefits» (медицинские льготы / страховка) — официальные корпоративные термины."
      },
    ],
  },

];

export default normalUnit04;
