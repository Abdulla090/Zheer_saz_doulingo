import { buildLesson, fill } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 11: Money & Shopping — 10 unique lessons ────────────────────────────
// Practical interactions for stores, banks, budgets, and bills.

const unit11: UnitBank = [
  buildLesson(
    "At the Store",
    "لە فرۆشگا",
    [
      { en: "I'm just browsing — thanks though.", ku: "تەنها سەیر دەکەم — سوپاس.", ar: "بس دا أباوع — شكراً.", ru: "Я просто смотрю — но всё равно спасибо." },
      { en: "Do you have this in a smaller size?", ku: "ئەمەتان بە قیاسێکی بچووکتر هەیە؟", ar: "عدكم هذا بقياس أصغر؟", ru: "У вас есть это размером поменьше?" },
      { en: "Where can I find the checkout counter?", ku: "کاشێرەکە لە کوێیە؟", ar: "وين الكاشير؟", ru: "Где находится касса?" },
      { en: "Is this item on sale this week?", ku: "ئەم هەفتەیە داشکاندن لەسەر ئەمە هەیە؟", ar: "أكو تنزيلات على هاي القطعة هالاسبوع؟", ru: "На этот товар есть скидка на этой неделе?" },
      { en: "I'd like to try this on, please.", ku: "حەز دەکەم ئەمە تاقی بکەمەوە، تکایە.", ar: "أريد أقيس هذا بلا زحمة.", ru: "Я хотел бы это примерить, пожалуйста." },
      { en: "Could you hold this at the register for me?", ku: "دەتوانیت ئەمە لەلای کاشێرەکە بۆم بپارێزیت تا دەگەڕێمەوە؟", ar: "تكدر تخلي هذا يم الكاشير لحد ما أرجع؟", ru: "Не могли бы вы отложить это для меня на кассе?" },
    ],
    {
      speakPhrases: [
        { en: "Do you guys carry these in black?", ku: "ئەمانەتان بە ڕەنگی ڕەش هەیە؟", ar: "عدكم من هذا باللون الأسود؟", ru: "У вас есть такие же чёрные?" },
        { en: "What time do you close tonight?", ku: "ئەمشەو کاتژمێر چەند دادەخەن؟", ar: "بيش الساعة تعزلون اليوم؟", ru: "Во сколько вы сегодня закрываетесь?" },
        { en: "Is there a line for the fitting rooms?", ku: "ڕیز هەیە بۆ ژووری خۆگۆڕین؟", ar: "أكو سره على غرف القياس؟", ru: "Есть ли очередь в примерочные?" },
      ],
      sentencePhrases: [
        { en: "I'll take this one.", ku: "ئەمە دەبەم.", ar: "راح آخذ هاي.", ru: "Я возьму это." },
        { en: "Can I get a gift receipt?", ku: "دەتوانم پسووڵەی دیاری وەربگرم؟", ar: "أكدر آخذ وصل هدية؟", ru: "Можно мне подарочный чек?" },
        { en: "That's a little out of my price range.", ku: "ئەمە کەمێک لە توانای نرخی منەوە دوورە.", ar: "هذا شويه أغلى من ميزانيتي.", ru: "Это немного дороговато для меня." },
      ],
      fills: [
        fill(
          "Do these shoes ___ in a size nine?",
          "come",
          ["arrive", "reach", "stay"],
          "ئایا ئەم پێڵاوانە بە قیاسی نۆ هەن؟",
          "هذا الحذاء متوفر بقياس تسعة؟",
          undefined,
          "Бывают ли эти туфли девятого размера?",
          {
            sentence: "Бывают ли эти туфли ___ размера?",
            answer: "девятого",
            wrongs: ["десятого", "восьмого", "седьмого"]
          }
        ),
        fill(
          "Honestly, that price seems a little ___ to me.",
          "steep",
          ["tall", "deep", "heavy"],
          "ڕاستییەکەی، ئەو نرخە کەمێک گران دێتە بەرچاوم.",
          "بصراحة، أحس السعر شوية غالي.",
          undefined,
          "Честно говоря, эта цена кажется мне немного высокой.",
          {
            sentence: "Честно говоря, эта цена кажется мне немного ___.",
            answer: "высокой",
            wrongs: ["низкой", "тяжелой", "глубокой"]
          }
        ),
      ],
      convos: [
        {
          situation: "فرۆشیار دەپرسێت ئایا یارمەتیت دەوێت",
          situationAr: "البياع يسأل إذا تحتاج مساعدة",
          situationRu: "Продавец спрашивает, нужна ли вам помощь",
          theyAsk: "Can I help you find something today?",
          theyAskRu: "Могу я помочь вам что-нибудь найти сегодня?",
          correct: "I'm just browsing for now, thanks. Though — do you have this jacket in a smaller size?",
          correctRu: "Я пока просто смотрю, спасибо. Хотя — у вас есть эта куртка размером поменьше?",
          wrong1: "Go away I don't need you.",
          wrong1Ru: "Уйди, ты мне не нужен.",
          wrong2: "Give me everything free.",
          wrong2Ru: "Отдай мне всё бесплатно.",
          wrong3: "Store is too big.",
          wrong3Ru: "Магазин слишком большой.",
          explanation: "'Just browsing' = تەنها سەیر دەکەم — باوترین و بەئەدەبترین وەڵامە بۆ فرۆشیار کاتێک یارمەتیت ناوێت",
          explanationAr: "'Just browsing' = بس دا أباوع — أكثر جواب شائع ومهذب للبياع من ما تحتاج مساعدة",
          explanationRu: "'Just browsing' = Я просто смотрю — самый частый и вежливый ответ продавцу, когда помощь не нужна."
        },
        {
          situation: "دەتەوێت جلوبەرگ تاقی بکەیتەوە",
          situationAr: "تريد تقيس ملابس",
          situationRu: "Вы хотите примерить одежду",
          theyAsk: "Would you like to try that on?",
          theyAskRu: "Хотите примерить?",
          correct: "Yes, I'd like to try this on, please. Where are the fitting rooms?",
          correctRu: "Да, я хотел бы это примерить, пожалуйста. Где находятся примерочные?",
          wrong1: "No try I buy blind.",
          wrong1Ru: "Не буду мерить, покупаю вслепую.",
          wrong2: "Fitting room is bad.",
          wrong2Ru: "Примерочная плохая.",
          wrong3: "Clothes always fit.",
          wrong3Ru: "Одежда всегда подходит.",
          explanation: "'Try this on' = تاقیکردنەوەی جل | 'Fitting rooms' = ژووری خۆگۆڕین لە فرۆشگادا",
          explanationAr: "'Try this on' = تقيس الملابس | 'Fitting rooms' = غرف القياس بالمحل",
          explanationRu: "'Try this on' = примерить | 'Fitting rooms' = примерочные в магазине"
        },
      ],
    },
    "بالمحل",
    "В магазине"
  ),

  buildLesson(
    "Returns & Refunds",
    "گەڕاندنەوە و وەرگرتنەوەی پارە",
    [
      { en: "I'd like to return this item, please.", ku: "حەز دەکەم ئەم کاڵایە بگەڕێنمەوە، تکایە.", ar: "أريد أرجع هذا المنتج بلا زحمة.", ru: "Я хотел бы вернуть этот товар, пожалуйста." },
      { en: "It doesn't fit — can I exchange it?", ku: "قەبارەکەی ناگونجێت — دەتوانم بیگۆڕمەوە؟", ar: "القياس مو مناسب — أكدر أبدله؟", ru: "Он не подходит по размеру — могу я его обменять?" },
      { en: "I have the receipt from last Tuesday.", ku: "پسووڵەکەم (وەسڵەکەم) پێیە لە سێشەممەی ڕابردووەوە.", ar: "عندي الوصل من يوم الثلاثاء الراح.", ru: "У меня есть чек с прошлого вторника." },
      { en: "The product arrived damaged in the box.", ku: "بەرهەمەکە لەناو سندوقەکەدا بە شکاوی (تێکچووی) گەیشت.", ar: "المنتج وصل مكسور بالكرتونة.", ru: "Товар прибыл поврежденным в коробке." },
      { en: "How long do I have to return this?", ku: "ماوەی چەند ڕۆژم هەیە بۆ گەڕاندنەوەی ئەمە؟", ar: "شكد عندي وكت حتى أرجع هذا؟", ru: "Сколько у меня времени на возврат?" },
      { en: "Can I get a refund to my original card?", ku: "دەتوانم پارەکە بگەڕێندرێتەوە بۆ هەمان کارت کە پێم کڕیوە؟", ar: "أكدر أرجع الفلوس لنفس بطاقتي؟", ru: "Могу ли я получить возврат средств на ту же карту?" },
    ],
    {
      speakPhrases: [
        { en: "I never opened it — the tags are still on.", ku: "هەرگیز نەمکردۆتەوە — لەیبڵەکانی هێشتا لەسەرییەتی.", ar: "أبد ما فتحته — والتاكات بعدها عليه.", ru: "Я его даже не открывал — бирки всё ещё на месте." },
        { en: "Can you put it back on the card I used?", ku: "دەتوانیت بیگەڕێنیتەوە سەر ئەو کارتەی بەکارم هێنا؟", ar: "تكدر ترجع الفلوس للبطاقة اللي استعملتها؟", ru: "Вы можете вернуть деньги на ту карту, которой я платил?" },
        { en: "Store credit works for me, that's fine.", ku: "کریدیتی فرۆشگا بۆم باشە، کێشە نییە.", ar: "رصيد بالمحل يوالمي، ماكو مشكلة.", ru: "Кредит магазина меня устраивает, без проблем." },
      ],
      sentencePhrases: [
        { en: "The zipper broke the second day.", ku: "زنجیرەکەی ڕۆژی دووەم شکا.", ar: "السحاب انكسر ثاني يوم.", ru: "Молния сломалась на второй день." },
        { en: "I ordered a large but they sent a medium.", ku: "قەبارەی گەورەم داوا کرد بەڵام مامناوەندیان نارد.", ar: "طلبت قياس كبير بس دزولي وسط.", ru: "Я заказывал большой размер, но они прислали средний." },
        { en: "Do I need to print the shipping label?", ku: "پێویستە لەیبڵی ناردنەکە چاپ بکەم؟", ar: "لازم أطبع ليبل الشحن؟", ru: "Мне нужно распечатывать транспортную этикетку?" },
      ],
      fills: [
        fill(
          "It's still under ___ , so the repair is free.",
          "warranty",
          ["promise", "insurance", "contract"],
          "هێشتا لەژێر گەرەنتیدایە، بۆیە چاککردنەوەکەی بەخۆڕاییە.",
          "بعده عالضمان، فالتصليح ببلاش.",
          undefined,
          "Он всё ещё на гарантии, поэтому ремонт бесплатный.",
          {
            sentence: "Он всё ещё на ___ , поэтому ремонт бесплатный.",
            answer: "гарантии",
            wrongs: ["обещании", "страховке", "контракте"]
          }
        ),
        fill(
          "The refund should ___ up in three business days.",
          "show",
          ["stand", "look", "wake"],
          "پارەکە دەبێت لە ماوەی سێ ڕۆژی کاردا دەربکەوێت.",
          "المفروض تطلع الفلوس خلال تلاث أيام عمل.",
          undefined,
          "Возврат должен появиться в течение трех рабочих дней.",
          {
            sentence: "Возврат должен ___ в течение трех рабочих дней.",
            answer: "появиться",
            wrongs: ["встать", "посмотреть", "проснуться"]
          }
        ),
      ],
      convos: [
        {
          situation: "لە بەشی خزمەتگوزاری کڕیار بۆ گەڕاندنەوەی جلێک",
          situationAr: "بقسم خدمة الزبائن حتى ترجع قطعة ملابس",
          situationRu: "В отделе обслуживания клиентов для возврата одежды",
          theyAsk: "What seems to be the problem with your purchase?",
          theyAskRu: "В чём проблема с вашей покупкой?",
          correct: "I'd like to return this item — it doesn't fit. I have the receipt from last Tuesday.",
          correctRu: "Я хотел бы вернуть эту вещь — она не подошла по размеру. У меня есть чек с прошлого вторника.",
          wrong1: "Product is fine I want money.",
          wrong1Ru: "Товар нормальный, я хочу деньги.",
          wrong2: "No receipt but return anyway.",
          wrong2Ru: "Чека нет, но всё равно верните.",
          wrong3: "I stole this item.",
          wrong3Ru: "Я украл эту вещь.",
          explanation: "'Return this item' و 'have the receipt' دوو خاڵی سەرەکین بۆ گەڕاندنەوەی هەر شتێک",
          explanationAr: "'Return this item' و 'have the receipt' نقطتين أساسية حتى ترجع أي منتج",
          explanationRu: "'Return this item' (вернуть этот товар) и 'have the receipt' (есть чек) — два ключевых момента при возврате."
        },
        {
          situation: "کڕینی ئۆنلاین بە تێکچووی گەیشتووە",
          situationAr: "طلبية من النت وصلت مكسورة",
          situationRu: "Онлайн-заказ прибыл поврежденным",
          theyAsk: "Was the package opened when it arrived?",
          theyAskRu: "Посылка была вскрыта, когда прибыла?",
          correct: "Yes — the product arrived damaged in the box. Can I get a refund to my original card?",
          correctRu: "Да — товар прибыл поврежденным в коробке. Могу ли я получить возврат средств на ту же карту?",
          wrong1: "Package was perfect.",
          wrong1Ru: "Посылка была идеальной.",
          wrong2: "I broke it myself.",
          wrong2Ru: "Я сам его сломал.",
          wrong3: "Refund is not possible ever.",
          wrong3Ru: "Возврат вообще невозможен.",
          explanation: "'Arrived damaged' واتای ئەوەیە لە ڕێگا تێکچووە، وە داوای 'refund' واتە پارەکەم دەوێتەوە نەک گۆڕینەوە",
          explanationAr: "'Arrived damaged' يعني خربت بالشحن، وطلب 'refund' يعني ترجع الفلوس مو تبديل",
          explanationRu: "'Arrived damaged' означает, что товар повредился в пути, а 'refund' — запрос на возврат денег, а не обмен."
        },
      ],
    },
    "الترجيع وترجيع الفلوس",
    "Возвраты и возмещение средств"
  ),

  buildLesson(
    "Banking Basics",
    "بنچینەکانی بانک",
    [
      { en: "I'd like to open a checking account.", ku: "حەز دەکەم هەژمارێکی جاری (checking) بکەمەوە.", ar: "أريد أفتح حساب جاري.", ru: "Я хотел бы открыть расчетный счет." },
      { en: "What's the minimum balance required?", ku: "کەمترین بڕی پارە (باڵانس) کە پێویستە لە هەژمارەکەدا بێت چەندە؟", ar: "شكد أقل رصيد مطلوب؟", ru: "Какой минимальный остаток требуется?" },
      { en: "Can I set up direct deposit for my salary?", ku: "دەتوانم دانانی ڕاستەوخۆ (direct deposit) بۆ مووچەکەم ڕێکبخەم؟", ar: "أكدر أسوي إيداع مباشر لراتبي؟", ru: "Могу ли я настроить прямое зачисление моей зарплаты?" },
      { en: "I need to transfer money to another account.", ku: "پێویستە پارە حەواڵە بکەم بۆ هەژمارێکی تر.", ar: "أحتاج أحول فلوس لحساب ثاني.", ru: "Мне нужно перевести деньги на другой счет." },
      { en: "My card was declined at the store.", ku: "کارتەکەم لە فرۆشگاکە ڕەتکرایەوە (پارەی لێ ڕانەکێشرا).", ar: "بطاقتي انرفضت بالمحل.", ru: "Моя карта была отклонена в магазине." },
      { en: "Is there a fee for international transfers?", ku: "ئایا هیچ عمولەیەک (کرێیەک) هەیە بۆ حەواڵەی نێودەوڵەتی؟", ar: "أكو عمولة عالتحويلات الدولية؟", ru: "Есть ли комиссия за международные переводы?" },
    ],
    {
      speakPhrases: [
        { en: "Do you charge a monthly maintenance fee?", ku: "کرێی مانگانەی بەڕێوەبردن دەگرن؟", ar: "تاخذون أجور صيانة شهرية؟", ru: "Взимаете ли вы ежемесячную плату за обслуживание?" },
        { en: "I'd rather not deal with overdraft fees.", ku: "پێم باشترە مامەڵە لەگەڵ کرێی زیادەڕۆیی نەکەم.", ar: "أفضل ما أتعامل ويه عمولات السحب عالمكشوف.", ru: "Я бы предпочел не связываться с комиссиями за овердрафт." },
        { en: "Which ATMs can I use for free?", ku: "کام ئای‌تی‌ئێمەکان دەتوانم بەخۆڕایی بەکاربهێنم؟", ar: "يا صراف آلي أكدر أستعمله ببلاش؟", ru: "Какими банкоматами я могу пользоваться бесплатно?" },
      ],
      sentencePhrases: [
        { en: "My paycheck hits on the first.", ku: "مووچەکەم ڕۆژی یەکەم دێت.", ar: "راتبي ينزل يوم واحد بالشهر.", ru: "Моя зарплата приходит первого числа." },
        { en: "I bank mostly through the app.", ku: "زۆرتر بە ئەپەکە مامەڵەی بانکی دەکەم.", ar: "أكثر معاملاتي البنكية أسويها بالتطبيق.", ru: "В основном я пользуюсь банковским приложением." },
        { en: "Can I add my wife to this account?", ku: "دەتوانم هاوسەرەکەم بۆ ئەم هەژمارە زیاد بکەم؟", ar: "أكدر أضيف مرتي لهذا الحساب؟", ru: "Могу ли я добавить свою жену к этому счету?" },
      ],
      fills: [
        fill(
          "I need to ___ a check for two hundred dollars.",
          "deposit",
          ["borrow", "spend", "count"],
          "پێویستە چەکێکی دووسەد دۆلاری دابنێم.",
          "أحتاج أودع صك بميتين دولار.",
          undefined,
          "Мне нужно внести чек на двести долларов.",
          {
            sentence: "Мне нужно ___ чек на двести долларов.",
            answer: "внести",
            wrongs: ["занять", "потратить", "посчитать"]
          }
        ),
        fill(
          "My account is ___ eighty dollars until Friday.",
          "short",
          ["small", "late", "empty"],
          "هەژمارەکەم تا ڕۆژی هەینی هەشتا دۆلار کەمە.",
          "حسابي ناقص ثمانين دولار ليوم الجمعة.",
          undefined,
          "На моем счету не хватает восьмидесяти долларов до пятницы.",
          {
            sentence: "На моем счету не ___ восьмидесяти долларов до пятницы.",
            answer: "хватает",
            wrongs: ["мало", "поздно", "пусто"]
          }
        ),
      ],
      convos: [
        {
          situation: "یەکەم جار دەچیتە بانک بۆ کردنەوەی حساب",
          situationAr: "أول مرة تروح للبنك تفتح حساب",
          situationRu: "Первый раз идёте в банк открывать счет",
          theyAsk: "How can I help you with your banking today?",
          theyAskRu: "Чем могу помочь вам с банковскими услугами сегодня?",
          correct: "I'd like to open a checking account. What's the minimum balance required? Also, can I set up direct deposit?",
          correctRu: "Я хотел бы открыть расчетный счет. Какой минимальный остаток требуется? И можно ли настроить прямое зачисление зарплаты?",
          wrong1: "Give me all bank money.",
          wrong1Ru: "Отдайте мне все деньги банка.",
          wrong2: "Banks are bad.",
          wrong2Ru: "Банки — это плохо.",
          wrong3: "I don't need account.",
          wrong3Ru: "Мне не нужен счет.",
          explanation: "'Checking account' ئەو حسابەیە کە بۆ کڕین و مامەڵەی ڕۆژانە بەکاردێت. 'Direct deposit' واتە مووچەکەت ڕاستەوخۆ بێتە سەر حسابەکەت",
          explanationAr: "'Checking account' هو الحساب الجاري للمعاملات اليومية. 'Direct deposit' يعني راتبك ينزل كبل بحسابك",
          explanationRu: "'Checking account' — это текущий/расчетный счет для повседневных трат. 'Direct deposit' — прямое зачисление зарплаты на счет."
        },
        {
          situation: "کارتەکەت کاری نەکردووە کاتێک ویستووتە شت بکڕیت",
          situationAr: "بطاقتك ما اشتغلت من ردت تشتري",
          situationRu: "Ваша карта не сработала при попытке покупки",
          theyAsk: "Did you recently make a large purchase?",
          theyAskRu: "Вы недавно делали крупную покупку?",
          correct: "Yes — my card was declined at the store. I need to transfer money to another account or increase my limit.",
          correctRu: "Да — моя карта была отклонена в магазине. Мне нужно перевести деньги на другой счет или увеличить лимит.",
          wrong1: "Card is broken forever.",
          wrong1Ru: "Карта сломана навсегда.",
          wrong2: "Store is wrong not bank.",
          wrong2Ru: "Магазин ошибся, а не банк.",
          wrong3: "I don't use cards.",
          wrong3Ru: "Я не пользуюсь картами.",
          explanation: "'Card was declined' واتە ئامێرەکە کارتی قبوڵ نەکرد، جا لەبەر نەبوونی پارە بێت یان کێشەی بانک",
          explanationAr: "'Card was declined' يعني الجهاز رفض البطاقة، لو ماكو رصيد كافي لو مشكلة بالبنك",
          explanationRu: "'Card was declined' означает, что терминал отклонил карту (из-за нехватки средств или проблемы в банке)."
        },
      ],
    },
    "أساسيات البنك",
    "Основы банковского дела"
  ),

  buildLesson(
    "Rent & Housing",
    "کرێ و نیشتەجێبوون",
    [
      { en: "When is the rent due each month?", ku: "کرێ هەموو مانگێک کەی دەبێت بدرێت؟", ar: "شوكت يندفع الإيجار كل شهر؟", ru: "Какого числа нужно платить за аренду каждый месяц?" },
      { en: "The landlord said the lease renews in June.", ku: "خاوەن ماڵەکە وتی گرێبەستەکە لە حوزەیراندا نوێ دەبێتەوە.", ar: "صاحب الملك كال عقد الإيجار يتجدد بشهر السادس.", ru: "Домовладелец сказал, что договор аренды продлевается в июне." },
      { en: "There's a leak in the bathroom ceiling.", ku: "دڵۆپە هەیە لە بنمیچی (سەقفی) گەرماوەکەدا.", ar: "أكو خرير بسكف الحمام.", ru: "С потолка в ванной течет вода." },
      { en: "Can we negotiate the security deposit?", ku: "دەتوانین مامەڵە بکەین لەسەر پارەی بارمتەکە (پێشەکییەکە)؟", ar: "نكدر نتفاوض على مبلغ التأمين؟", ru: "Мы можем обсудить размер страхового депозита?" },
      { en: "Utilities are not included in the rent.", ku: "تێچووی ئاو و کارەبا (Utilities) لە کرێیەکەدا هەژمار نەکراون.", ar: "فواتير الخدمات مو من ضمن الإيجار.", ru: "Коммунальные услуги не включены в арендную плату." },
      { en: "I'm looking for a two-bedroom apartment.", ku: "بەدوای شوقەیەکی دوو نوستندا دەگەڕێم.", ar: "أدور على شقة بيها غرفتين نوم.", ru: "Я ищу квартиру с двумя спальнями." },
    ],
    {
      speakPhrases: [
        { en: "Is parking included or is that extra?", ku: "شوێنی ئۆتۆمبێل هەژمارکراوە یان زیادەیە؟", ar: "موقف السيارة مشمول لو إضافي؟", ru: "Парковка включена или за нее нужно платить отдельно?" },
        { en: "How much notice do I need to give before I move out?", ku: "چەند ڕۆژ پێشتر پێویستە ئاگادار بکەم پێش ئەوەی بڕۆم؟", ar: "شكد لازم أبلغكم قبل ما أطلع؟", ru: "За сколько времени мне нужно предупредить перед тем, как я съеду?" },
        { en: "Are pets allowed in the building?", ku: "ئاژەڵی ماڵی لە بینایەکە ڕێپێدراوە؟", ar: "مسموح الحيوانات الأليفة بالبناية؟", ru: "Разрешено ли держать домашних животных в здании?" },
      ],
      sentencePhrases: [
        { en: "The heat stopped working last night.", ku: "گەرمکەرەوەکە دوێنێ شەو کاری نەکرد.", ar: "التدفئة وكفت البارحة بالليل.", ru: "Отопление перестало работать прошлой ночью." },
        { en: "My roommate covers half the rent.", ku: "هاوژووریەکەم نیوەی کرێیەکە دەدات.", ar: "شريكي بالغرفة يدفع نص الإيجار.", ru: "Мой сосед по комнате оплачивает половину аренды." },
        { en: "We signed a twelve-month lease.", ku: "گرێبەستی دوانزە مانگمان واژۆ کرد.", ar: "وقعنا عقد إيجار لمدة اثنعش شهر.", ru: "Мы подписали договор аренды на двенадцать месяцев." },
      ],
      fills: [
        fill(
          "The rent is ___ on the first of the month.",
          "due",
          ["ready", "open", "full"],
          "کرێیەکە ڕۆژی یەکەمی مانگ دەبێت بدرێت.",
          "لازم يندفع الإيجار أول يوم بالشهر.",
          undefined,
          "Арендная плата вносится первого числа каждого месяца.",
          {
            sentence: "Арендная плата ___ первого числа каждого месяца.",
            answer: "вносится",
            wrongs: ["готова", "открыта", "полна"]
          }
        ),
        fill(
          "I get my ___ back if I leave the place clean.",
          "deposit",
          ["payment", "receipt", "salary"],
          "ئەگەر شوێنەکە پاک بەجێبهێڵم، بارمتەکەم دەگەڕێتەوە.",
          "ترجعلي فلوس التأمين إذا عفت المكان نظيف.",
          undefined,
          "Я получу свой депозит обратно, если оставлю место чистым.",
          {
            sentence: "Я получу свой ___ обратно, если оставлю место чистым.",
            answer: "депозит",
            wrongs: ["платеж", "чек", "оклад"]
          }
        ),
      ],
      convos: [
        {
          situation: "پرسیارکردن دەربارەی شوقەیەک بۆ کرێ",
          situationAr: "تستفسر عن شقة للإيجار",
          situationRu: "Спрашиваете о квартире в аренду",
          theyAsk: "This unit is twelve hundred a month — interested?",
          theyAskRu: "Эта квартира стоит тысячу двести в месяц — интересно?",
          correct: "When is the rent due each month? Also, are utilities included or separate?",
          correctRu: "Какого числа нужно платить за аренду каждый месяц? И включены ли коммунальные услуги, или они оплачиваются отдельно?",
          wrong1: "Rent is too cheap suspicious.",
          wrong1Ru: "Аренда слишком дешевая, подозрительно.",
          wrong2: "I pay whenever I want.",
          wrong2Ru: "Я плачу, когда хочу.",
          wrong3: "Apartment size doesn't matter.",
          wrong3Ru: "Размер квартиры не имеет значения.",
          explanation: "'Rent due' = وادەی دانی کرێ | 'Utilities included' پرسیارێکی زۆر گرنگە بۆ زانینی تێچووی مانگانە",
          explanationAr: "'Rent due' = موعد الإيجار | 'Utilities included' سؤال كلش مهم حتى تعرف التكلفة الشهرية المضبوطة",
          explanationRu: "'Rent due' = срок оплаты аренды | 'Utilities included' — очень важный вопрос, чтобы узнать реальные ежемесячные расходы."
        },
        {
          situation: "پەیوەندی بە خاوەن ماڵ بۆ کێشەیەکی ناو شوقەکە",
          situationAr: "تتواصل ويه صاحب الملك على مشكلة بالشقة",
          situationRu: "Звоните домовладельцу из-за проблемы в квартире",
          theyAsk: "What seems to be the issue with the apartment?",
          theyAskRu: "В чём проблема с квартирой?",
          correct: "There's a leak in the bathroom ceiling — it started after the last rain. Can someone come fix it soon?",
          correctRu: "С потолка в ванной течет вода — началось после последнего дождя. Может кто-нибудь прийти и починить это в ближайшее время?",
          wrong1: "Apartment is perfect no problems.",
          wrong1Ru: "Квартира идеальна, проблем нет.",
          wrong2: "I break things myself.",
          wrong2Ru: "Я сам ломаю вещи.",
          wrong3: "Fix it yourself landlord.",
          wrong3Ru: "Чини сам, домовладелец.",
          explanation: "'Leak in the ceiling' کێشەیەکی باوی کرێنشینانە کە خاوەن ماڵ دەبێت چارەسەری بکات",
          explanationAr: "'Leak in the ceiling' خرير بالسكف مشكلة شائعة لازم صاحب الملك يصلحها",
          explanationRu: "'Leak in the ceiling' (протечка в потолке) — распространенная проблема жильцов, которую должен устранять домовладелец."
        },
      ],
    },
    "الإيجار والسكن",
    "Аренда и жилье"
  ),

  buildLesson(
    "Restaurant Bills & Tipping",
    "پسووڵەی چێشتخانە و بەخشیش",
    [
      { en: "Could we get the check, please?", ku: "دەتوانین پسووڵەکەمان پێ بدەیت، تکایە؟", ar: "ممكن الوصل بلا زحمة؟", ru: "Можно нам счет, пожалуйста?" },
      { en: "Can we split the bill evenly?", ku: "دەتوانین پسووڵەکە بە یەکسانی دابەش بکەین (بۆ پارەدان)؟", ar: "نكدر نقسم القائمة بالتساوي؟", ru: "Мы можем разделить счет поровну?" },
      { en: "I'll cover dinner tonight — my treat.", ku: "ئەمشەو پارەی نانخواردنەکە من دەیدەم — لەسەر حسابی منە.", ar: "أني راح أدفع العشا اليوم — على حسابي.", ru: "Я оплачу сегодняшний ужин — я угощаю." },
      { en: "I always tip at least twenty percent.", ku: "هەمیشە لانیکەم بیست لەسەد بەخشیش دەدەم.", ar: "دائماً أخلي بخشيش مو أقل من عشرين بالمية.", ru: "Я всегда оставляю чаевые не меньше двадцати процентов." },
      { en: "Is the service charge included?", ku: "ئایا کرێی خزمەتگوزاری (سێرڤس) لە پسووڵەکەدا هەژمار کراوە؟", ar: "أجور الخدمة مشمولة بالقائمة؟", ru: "Сбор за обслуживание включен?" },
      { en: "Do you take card or cash only?", ku: "کارت قبوڵ دەکەن یان تەنها کاش؟", ar: "تقبلون بطاقة لو بس كاش؟", ru: "Вы принимаете карты или только наличные?" },
    ],
    {
      speakPhrases: [
        { en: "Can we get separate checks?", ku: "دەتوانین پسووڵەی جیاواز وەربگرین؟", ar: "نكدر ناخذ قوائم منفصلة؟", ru: "Можно нам раздельные счета?" },
        { en: "I think they forgot to take off the appetizer.", ku: "پێم وایە خواردنی پێش‌خواردنەکەیان لەبیر کردووە لابەرن.", ar: "أعتقد نسوا يشيلون المقبلات.", ru: "Я думаю, они забыли вычеркнуть закуску." },
        { en: "Twenty on the card and the rest in cash.", ku: "بیست بە کارت و ئەوەی مایە بە کاش.", ar: "عشرين بالبطاقة والباقي كاش.", ru: "Двадцать с карты, а остальное наличными." },
      ],
      sentencePhrases: [
        { en: "The tip is already on there.", ku: "بەخشیشەکە پێشتر لەسەرییەتی.", ar: "البخشيش مضيوف من قاعها.", ru: "Чаевые уже включены." },
        { en: "Lunch is on me today.", ku: "نانی نیوەڕۆ ئەمڕۆ لەسەر منە.", ar: "غده اليوم على حسابي.", ru: "Обед сегодня за мой счет." },
        { en: "Do you validate parking here?", ku: "لێرە پسووڵەی پارکینگ پەسەند دەکەن؟", ar: "تختمون تذكرة الكراج هنا؟", ru: "Вы здесь отмечаете парковочные талоны?" },
      ],
      fills: [
        fill(
          "Let's just ___ it three ways.",
          "split",
          ["cut", "share", "break"],
          "با بە سێ بەش دابەشی بکەین.",
          "خل نقسمها على تلاثة وبس.",
          undefined,
          "Давайте просто разделим это на троих.",
          {
            sentence: "Давайте просто ___ это на троих.",
            answer: "разделим",
            wrongs: ["порежем", "поделимся", "разобьем"]
          }
        ),
        fill(
          "I usually ___ around twenty percent.",
          "tip",
          ["give", "add", "pay"],
          "زۆرتر نزیکەی بیست لەسەد بەخشیش دەدەم.",
          "بالعادة أخلي بخشيش حوالي عشرين بالمية.",
          undefined,
          "Обычно я оставляю около двадцати процентов чаевых.",
          {
            sentence: "Обычно я оставляю около двадцати процентов ___.",
            answer: "чаевых",
            wrongs: ["даю", "добавляю", "плачу"]
          }
        ),
      ],
      convos: [
        {
          situation: "دوای تەواوبوونی نانخواردن لە چێشتخانە",
          situationAr: "ورا ما تكملون أكل بالمطعم",
          situationRu: "После завершения ужина в ресторане",
          theyAsk: "Did you save room for dessert?",
          theyAskRu: "Оставили место для десерта?",
          correct: "No thanks — could we get the check, please? Can we split the bill evenly?",
          correctRu: "Нет, спасибо — можно нам счет, пожалуйста? Мы можем разделить его поровну?",
          wrong1: "We don't pay today.",
          wrong1Ru: "Мы сегодня не платим.",
          wrong2: "Bill is wrong always.",
          wrong2Ru: "Счет всегда неправильный.",
          wrong3: "Run without paying.",
          wrong3Ru: "Бежим, не заплатив.",
          explanation: "'Get the check' وشەی باوی ئەمریکییە بۆ حساب | 'Split the bill' واتە هەرکەسە و بەشی خۆی دەدات",
          explanationAr: "'Get the check' تعبير أمريكي دارج لطلب الفاتورة | 'Split the bill' يعني كل واحد يدفع حصته",
          explanationRu: "'Get the check' — обычное американское выражение для запроса счета | 'Split the bill' означает оплату каждый за себя."
        },
        {
          situation: "دەتەوێت ببیت بە میوانداری هاوڕێکەت",
          situationAr: "تريد تعزم صديقك",
          situationRu: "Вы хотите угостить своего друга",
          theyAsk: "Are we splitting or is someone covering tonight?",
          theyAskRu: "Мы делим счет или кто-то платит сегодня?",
          correct: "I'll cover dinner tonight — my treat. You can get drinks next time!",
          correctRu: "Я оплачу ужин сегодня — я угощаю. А ты можешь купить напитки в следующий раз!",
          wrong1: "Everyone pays maximum.",
          wrong1Ru: "Каждый платит по максимуму.",
          wrong2: "My treat means you pay.",
          wrong2Ru: "Я угощаю, значит платишь ты.",
          wrong3: "No one pays ever.",
          wrong3Ru: "Никто никогда не платит.",
          explanation: "'My treat' دەستەواژەیەکە بەکاردێت کاتێک دەتەوێت شتێک بکڕیت یان پارەی شتێک بدەیت بۆ کەسێکی تر (لە سەر حسابی منە)",
          explanationAr: "'My treat' تنكال من تريد تدفع الحساب عن شخص ثاني (على حسابي)",
          explanationRu: "'My treat' — выражение, используемое, когда вы хотите за кого-то заплатить (я угощаю / за мой счет)."
        },
      ],
    },
    "قوائم المطاعم والبخشيش",
    "Счета в ресторанах и чаевые"
  ),

  buildLesson(
    "Grocery Shopping",
    "کڕینی کەلوپەلی خواردن",
    [
      { en: "Excuse me, which aisle has the pasta?", ku: "ببورە، پاستا لە کام ڕیزدایە؟", ar: "العفو، بيا ممر ألكي المعكرونة؟", ru: "Извините, в каком ряду макароны?" },
      { en: "Is there a store-brand version that's cheaper?", ku: "جۆرێکی براندی خودی فرۆشگاکە هەیە کە هەرزانتر بێت؟", ar: "أكو نوعية أرخص تابعة للمحل؟", ru: "Есть ли более дешевая версия от бренда магазина?" },
      { en: "Could I get half a pound of turkey, sliced thin?", ku: "دەتوانم نیو پاوەند گۆشتی قەلەڕەش وەربگرم، بە باریکی ببڕدرێت؟", ar: "أكدر آخذ نص باوند لحم ديك رومي مقطع شرايح خفيفة؟", ru: "Можно мне полфунта индейки, тонко нарезанной?" },
      { en: "This coupon says it expires tomorrow.", ku: "لەسەر ئەم کوپۆنە نووسراوە سبەی بەسەر دەچێت.", ar: "مكتوب على هاي الكوبون يخلص باجر.", ru: "На этом купоне написано, что он истекает завтра." },
      { en: "I think this rang up at the wrong price.", ku: "پێم وایە ئەمە لە کاشێر بە نرخێکی هەڵە هەژمار کرا.", ar: "أعتقد هذا انحسب بالكاشير بسعر غلط.", ru: "Мне кажется, это пробили по неправильной цене." },
      { en: "Can I leave the bags here while I get my car?", ku: "دەتوانم جانتاکان لێرە جێبهێڵم تا ئۆتۆمبێلەکەم دێنم؟", ar: "أكدر أخلي العلاليك هنا لحد ما أجيب سيارتي؟", ru: "Могу я оставить пакеты здесь, пока сбегаю за машиной?" },
    ],
    {
      speakPhrases: [
        { en: "Are these bananas ripe enough for tonight?", ku: "ئەم مۆزەکان بەقەدەر پێگەیشتوون بۆ ئەمشەو؟", ar: "هذا الموز مستوي زين لليوم؟", ru: "Эти бананы достаточно спелые для сегодняшнего вечера?" },
        { en: "I'm just grabbing a few things.", ku: "تەنها چەند شتێک دەبەم.", ar: "راح آخذ كم شغلة وبس.", ru: "Я просто возьму пару вещей." },
        { en: "Do you have any more of these in the back?", ku: "لە پشتەوە زیاتر لەمانە هەتان هەیە؟", ar: "عدكم بعد من هذا بالمخزن؟", ru: "У вас есть еще такие на складе?" },
      ],
      sentencePhrases: [
        { en: "Paper bags, please.", ku: "جانتای کاغەز، تکایە.", ar: "علاليك ورقية، بلا زحمة.", ru: "Бумажные пакеты, пожалуйста." },
        { en: "The milk expires on Sunday.", ku: "شیرەکە ڕۆژی یەکشەممە بەسەر دەچێت.", ar: "صلاحية الحليب تخلص يوم الأحد.", ru: "Срок годности молока истекает в воскресенье." },
        { en: "I forgot my reusable bags in the car.", ku: "جانتاکانی دووبارە بەکارهێنانم لە ئۆتۆمبێلەکە بەجێهێشت.", ar: "نسيت علاليقي بالسيارة.", ru: "Я забыл свои многоразовые сумки в машине." },
      ],
      fills: [
        fill(
          "Which ___ is the pasta in?",
          "aisle",
          ["shelf", "corner", "line"],
          "پاستا لە کام ڕیزدایە؟",
          "بيا ممر المعكرونة؟",
          undefined,
          "В каком ряду макароны?",
          {
            sentence: "В каком ___ макароны?",
            answer: "ряду",
            wrongs: ["полке", "углу", "очереди"]
          }
        ),
        fill(
          "This coupon ___ tomorrow, so let's use it today.",
          "expires",
          ["finishes", "closes", "leaves"],
          "ئەم کوپۆنە سبەی بەسەر دەچێت، بۆیە ئەمڕۆ بەکاری بهێنین.",
          "هذا الكوبون يخلص باجر، فخل نستعمله اليوم.",
          undefined,
          "Этот купон истекает завтра, так что давай используем его сегодня.",
          {
            sentence: "Этот купон ___ завтра, так что давай используем его сегодня.",
            answer: "истекает",
            wrongs: ["заканчивается", "закрывается", "уходит"]
          }
        ),
      ],
      convos: [
        {
          situation: "کاڵایەک لەسەر تەختەکە داشکاندنی هەیە، بەڵام لە کاشێر نرخەکە جیاوازە",
          situationAr: "منتج عليه تخفيض عالرف بس سعره يختلف يم الكاشير",
          situationRu: "На товар есть скидка на полке, но на кассе цена другая",
          theyAsk: "Your total is $43.18. Will that be cash or card?",
          theyAskRu: "С вас $43.18. Оплата наличными или картой?",
          correct: "Card, please—but I think this rang up at the wrong price. The shelf tag said $3.49.",
          correctRu: "Картой, пожалуйста — но, кажется, это пробили по неправильной цене. На ценнике было $3.49.",
          wrong1: "Card, and I don't need the receipt.",
          wrong1Ru: "Картой, и чек мне не нужен.",
          wrong2: "Could you tell me where the pasta is?",
          wrong2Ru: "Не подскажете, где макароны?",
          wrong3: "I'll come back after the store closes.",
          wrong3Ru: "Я вернусь после закрытия магазина.",
          explanation: "'Rang up at the wrong price' دەربڕینێکی ئاسایی ئەمریکییە بۆ هەڵەی نرخ لە کاشێر؛ نرخی سەر تەختەکە بە ڕوونی بڵێ.",
          explanationAr: "تعبير 'rang up at the wrong price' أمريكي دارج لخطأ السعر بالكاشير؛ اذكر سعر الرف بوضوح.",
          explanationRu: "Выражение 'rang up at the wrong price' означает, что товар пробили по неверной цене; назовите цену с полки для ясности."
        },
        {
          situation: "لە بەشی گۆشتی ئامادەکراودا داواکارییەکی ورد دەکەیت",
          situationAr: "تطلب شي محدد من قسم اللحوم الباردة",
          situationRu: "Вы делаете точный заказ в мясном отделе",
          theyAsk: "How would you like the turkey sliced?",
          theyAskRu: "Как вам нарезать индейку?",
          correct: "Thin, please. Could I get half a pound?",
          correctRu: "Тонко, пожалуйста. Можно мне полфунта?",
          wrong1: "The frozen vegetables are in aisle six.",
          wrong1Ru: "Замороженные овощи в шестом ряду.",
          wrong2: "I paid with a coupon yesterday.",
          wrong2Ru: "Я расплатился купоном вчера.",
          wrong3: "No bag is fine for the bread.",
          wrong3Ru: "Для хлеба пакет не нужен.",
          explanation: "لە ئەمریکا گۆشتی deli زۆرجار بە پاوەند داوا دەکرێت؛ 'thin, please' قەبارەی بڕینەکە دیاری دەکات.",
          explanationAr: "بأمريكا لحوم الـ deli تنطلب عادةً بالباوند؛ وجملة 'thin, please' تحدد ثخن الشريحة.",
          explanationRu: "В США мясную нарезку (deli) часто заказывают в фунтах; фраза 'thin, please' уточняет толщину нарезки."
        },
      ],
    },
    "المسواك",
    "Покупка продуктов"
  ),

  buildLesson(
    "Comparing Prices & Subscriptions",
    "بەراوردکردنی نرخ و ئابوونە",
    [
      { en: "What's included in the monthly price?", ku: "لە نرخی مانگانەدا چی لەخۆدەگرێت؟", ar: "شنو المشمول بالسعر الشهري؟", ru: "Что включено в ежемесячную стоимость?" },
      { en: "Is there a discount if I pay annually?", ku: "ئەگەر ساڵانە پارە بدەم، داشکاندن هەیە؟", ar: "أكو خصم إذا دفعت سنوي؟", ru: "Есть ли скидка при оплате за год?" },
      { en: "The free trial converts to a paid plan on Friday.", ku: "تاقیکردنەوەی بەخۆڕایی ڕۆژی هەینی دەبێتە پلانی بەرامبەر پارە.", ar: "التجربة المجانية تصير بفلوس يوم الجمعة.", ru: "В пятницу бесплатная пробная версия перейдет в платный тариф." },
      { en: "Can I cancel anytime without a fee?", ku: "دەتوانم هەر کاتێک بێ کرێی زیادە هەڵیوەشێنمەوە؟", ar: "أكدر ألغي بأي وكت بدون غرامة؟", ru: "Могу ли я отменить в любое время без штрафов?" },
      { en: "This plan costs more, but it includes support.", ku: "ئەم پلانە گرانترە، بەڵام پشتگیری لەخۆدەگرێت.", ar: "هاي الخطة أغلى، بس بيها دعم.", ru: "Этот план стоит дороже, но он включает поддержку." },
      { en: "I'd like an itemized breakdown before I decide.", ku: "پێش بڕیاردان وردەکارییەکی دابەشکراوی نرخەکانم دەوێت.", ar: "أريد تفصيل نقطة بنقطة قبل ما أقرر.", ru: "Я хотел бы получить подробную детализацию, прежде чем решу." },
    ],
    {
      speakPhrases: [
        { en: "Does the cheaper tier still let me stream in HD?", ku: "پلانە هەرزانەکە هێشتا ڕێگەم دەدات بە HD تەماشا بکەم؟", ar: "الخطة الأرخص تخليني أشوف بجودة عالية؟", ru: "Позволяет ли более дешевый уровень смотреть в HD?" },
        { en: "I'd rather pay month to month for now.", ku: "ئێستا پێم باشترە مانگ بە مانگ پارە بدەم.", ar: "أفضل أدفع شهر بشهر هسه.", ru: "Я бы предпочел пока платить помесячно." },
        { en: "How many people can share one account?", ku: "چەند کەس دەتوانن یەک هەژمار بەکاربهێنن؟", ar: "كم واحد يكدر يشارك حساب واحد؟", ru: "Сколько человек могут пользоваться одним аккаунтом?" },
      ],
      sentencePhrases: [
        { en: "I'm paying for three things I never use.", ku: "پارە بۆ سێ شت دەدەم کە هەرگیز بەکاریان ناهێنم.", ar: "دا أدفع على تلاث شغلات أبد ما أستعملها.", ru: "Я плачу за три вещи, которыми никогда не пользуюсь." },
        { en: "They raised the price without telling me.", ku: "نرخەکەیان بەرز کردەوە بێ ئەوەی پێم بڵێن.", ar: "صعدوا السعر بدون ما يكولولي.", ru: "Они подняли цену, не сказав мне." },
        { en: "Let me compare the two before I sign up.", ku: "با هەردووکیان بەراورد بکەم پێش ئەوەی خۆم تۆمار بکەم.", ar: "خل أقارن بيناتهم قبل ما أشترك.", ru: "Дай мне сравнить их, прежде чем я подпишусь." },
      ],
      fills: [
        fill(
          "The free trial ___ automatically unless I cancel.",
          "renews",
          ["returns", "repeats", "reminds"],
          "تاقیکردنەوە بەخۆڕاییەکە خۆکارانە نوێ دەبێتەوە مەگەر هەڵیوەشێنمەوە.",
          "التجربة المجانية تتجدد تلقائياً إذا ما لغيتها.",
          undefined,
          "Бесплатная пробная версия продлевается автоматически, если я ее не отменю.",
          {
            sentence: "Бесплатная пробная версия ___ автоматически, если я ее не отменю.",
            answer: "продлевается",
            wrongs: ["возвращается", "повторяется", "напоминает"]
          }
        ),
        fill(
          "It's cheaper in the long ___ if I pay yearly.",
          "run",
          ["time", "way", "term"],
          "ئەگەر ساڵانە پارە بدەم، لە درێژخایەندا هەرزانترە.",
          "يطلع أرخص على المدى الطويل إذا دفعت سنوي.",
          undefined,
          "В долгосрочной перспективе это дешевле, если платить за год.",
          {
            sentence: "В долгосрочной ___ это дешевле, если платить за год.",
            answer: "перспективе",
            wrongs: ["времени", "пути", "сроке"]
          }
        ),
      ],
      convos: [
        {
          situation: "بەرنامەیەک دەتەوێت دوای تاقیکردنەوەی بەخۆڕایی پارەت لێ بسێنێت",
          situationAr: "خدمة راح تبدي تاخذ فلوس ورا التجربة المجانية",
          situationRu: "Сервис начнет взимать плату после бесплатной пробной версии",
          theyAsk: "Would you like to start your 14-day free trial?",
          theyAskRu: "Хотите начать 14-дневную бесплатную пробную версию?",
          correct: "Maybe. When does it convert to a paid plan, and can I cancel anytime without a fee?",
          correctRu: "Возможно. Когда она перейдет в платный план, и смогу ли я отменить ее в любое время без штрафов?",
          wrong1: "Yes, the annual plan has more storage.",
          wrong1Ru: "Да, в годовом плане больше памяти.",
          wrong2: "No, I bought groceries this morning.",
          wrong2Ru: "Нет, я купил продукты сегодня утром.",
          wrong3: "Please charge every card on my account.",
          wrong3Ru: "Пожалуйста, спишите деньги со всех моих карт.",
          explanation: "پێش free trial دوو پرسیاری گرنگ: کەی پارەیی دەبێت و مەرجی cancel چییە.",
          explanationAr: "قبل أي تجربة مجانية اسأل سؤالين: شوكت تصير بفلوس وشنو شروط الإلغاء؟",
          explanationRu: "Перед любой бесплатной пробной версией задайте два вопроса: когда она станет платной и каковы условия отмены."
        },
        {
          situation: "نێوان دوو پلانی خزمەتگوزاری بەراورد دەکەیت",
          situationAr: "تقارن بين خطتين لخدمة معينة",
          situationRu: "Вы сравниваете два тарифных плана",
          theyAsk: "The premium plan is twelve dollars more per month. Want that one?",
          theyAskRu: "Премиум-план стоит на двенадцать долларов дороже в месяц. Хотите его?",
          correct: "What does the extra twelve dollars include? I'd like an itemized breakdown before I decide.",
          correctRu: "Что включают в себя эти лишние двенадцать долларов? Я бы хотел получить подробную детализацию, прежде чем решу.",
          wrong1: "Twelve is my favorite number.",
          wrong1Ru: "Двенадцать — мое любимое число.",
          wrong2: "Please cancel a plan I haven't purchased.",
          wrong2Ru: "Пожалуйста, отмените план, который я не покупал.",
          wrong3: "The monthly price is on the receipt.",
          wrong3Ru: "Месячная цена указана в чеке.",
          explanation: "'What does the extra ... include?' یارمەتیت دەدات نرخ بەرامبەر بەها بەراورد بکەیت، نەک تەنها گرانترین هەڵبژێریت.",
          explanationAr: "سؤال 'What does the extra ... include?' يساعدك تقارن السعر بالقيمة بدل ما تختار الأغلى قبل.",
          explanationRu: "Вопрос 'What does the extra ... include?' помогает сравнить цену и ценность, а не просто выбрать самое дорогое."
        },
      ],
    },
    "مقارنة الأسعار والاشتراكات",
    "Сравнение цен и подписок"
  ),

  buildLesson(
    "Phone & Utility Bills",
    "پسووڵەی مۆبایل و خزمەتگوزارییەکان",
    [
      { en: "My bill is higher than it was last month.", ku: "پسووڵەکەم لە مانگی ڕابردوو بەرزترە.", ar: "قائمتي أعلى من الشهر الراح.", ru: "Мой счет больше, чем в прошлом месяце." },
      { en: "Could you explain this additional charge?", ku: "دەتوانیت ئەم کرێیە زیادەیە ڕوون بکەیتەوە؟", ar: "تكدر توضحلي هاي الأجور الإضافية؟", ru: "Не могли бы вы объяснить эту дополнительную плату?" },
      { en: "I didn't authorize an upgrade to my plan.", ku: "من ڕێگەم نەداوە پلانەکەم بەرز بکرێتەوە.", ar: "أني ما وافقت على ترقية خطتي.", ru: "Я не разрешал улучшать мой тарифный план." },
      { en: "Is there a cheaper plan with the same data limit?", ku: "پلانێکی هەرزانتر بە هەمان سنووری داتا هەیە؟", ar: "أكو خطة أرخص وبنفس حجم البيانات؟", ru: "Есть ли более дешевый план с таким же лимитом данных?" },
      { en: "When will the credit appear on my account?", ku: "کەی بڕی پارەی گەڕێندراو لە هەژمارەکەم دەردەکەوێت؟", ar: "شوكت تنزل الفلوس الراجعة بحسابي؟", ru: "Когда деньги появятся на моем счету?" },
      { en: "Please email me a confirmation of the change.", ku: "تکایە پشتڕاستکردنەوەی گۆڕانکارییەکە بە ئیمەیڵ بۆم بنێرە.", ar: "دزلي تأكيد التغيير بالإيميل بلا زحمة.", ru: "Пожалуйста, отправьте мне подтверждение изменений на почту." },
    ],
    {
      speakPhrases: [
        { en: "Can you walk me through this line by line?", ku: "دەتوانیت دێڕ بە دێڕ بۆم ڕوونی بکەیتەوە؟", ar: "تكدر تشرحلياه سطر سطر؟", ru: "Можете пройтись по этому счету строка за строкой?" },
        { en: "I've been a customer for six years.", ku: "شەش ساڵە کڕیارتانم.", ar: "صارلي ست سنين زبون عدكم.", ru: "Я являюсь вашим клиентом уже шесть лет." },
        { en: "Is there any promotion I qualify for?", ku: "هیچ داشکاندنێک هەیە کە شایستەی بم؟", ar: "أكو أي عرض يرهملي؟", ru: "Есть ли какие-нибудь акции, под которые я подхожу?" },
      ],
      sentencePhrases: [
        { en: "My internet keeps dropping in the evening.", ku: "ئینتەرنێتەکەم لە ئێواراندا بەردەوام دەبڕێت.", ar: "النت مالتي كلش يفصل بالليل.", ru: "Вечерами у меня постоянно пропадает интернет." },
        { en: "I never signed up for that add-on.", ku: "هەرگیز خۆم بۆ ئەو زیادکردنە تۆمار نەکردووە.", ar: "أبد ما اشتركت بهاي الإضافة.", ru: "Я никогда не подписывался на эту услугу." },
        { en: "Put me through to billing, please.", ku: "تکایە پەیوەندیم بدە بە بەشی پسووڵە.", ar: "حولني على قسم الفواتير بلا زحمة.", ru: "Переключите меня на отдел счетов, пожалуйста." },
      ],
      fills: [
        fill(
          "There's a twenty-five dollar ___ I don't recognize.",
          "charge",
          ["price", "cost", "money"],
          "بڕی بیست و پێنج دۆلار هەیە کە ناناسمەوە.",
          "أكو مبلغ خمسة وعشرين دولار ما أعرفه.",
          undefined,
          "Тут есть списание на двадцать пять долларов, которое я не узнаю.",
          {
            sentence: "Тут есть ___ на двадцать пять долларов, которое я не узнаю.",
            answer: "списание",
            wrongs: ["цена", "стоимость", "деньги"]
          }
        ),
        fill(
          "Could you ___ that fee from my account?",
          "remove",
          ["delete", "clean", "cancel"],
          "دەتوانیت ئەو کرێیە لە هەژمارەکەم لاببەیت؟",
          "تكدر تشيل هاي الأجور من حسابي؟",
          undefined,
          "Не могли бы вы убрать эту комиссию с моего счета?",
          {
            sentence: "Не могли бы вы ___ эту комиссию с моего счета?",
            answer: "убрать",
            wrongs: ["удалить", "почистить", "отменить"]
          }
        ),
      ],
      convos: [
        {
          situation: "پەیوەندی بە کۆمپانیای مۆبایل دەکەیت چونکە پسووڵەکەت زیاد بووە",
          situationAr: "تخابر شركة التليفون لأن قائمتك إجتي عالية",
          situationRu: "Вы звоните в телефонную компанию, потому что счет вырос",
          theyAsk: "I see the bill. What would you like me to review?",
          theyAskRu: "Я вижу счет. Что бы вы хотели, чтобы я проверил?",
          correct: "It's higher than last month. Could you explain the $25 additional charge on line four?",
          correctRu: "Он больше, чем в прошлом месяце. Не могли бы вы объяснить дополнительную плату в $25 в четвертой строке?",
          wrong1: "I need a new phone in a different color.",
          wrong1Ru: "Мне нужен новый телефон другого цвета.",
          wrong2: "The internet worked well yesterday.",
          wrong2Ru: "Вчера интернет работал хорошо.",
          wrong3: "Just make every future bill free.",
          wrong3Ru: "Просто сделайте каждый будущий счет бесплатным.",
          explanation: "بڕ و ژمارەی دێڕەکە بڵێ تا نوێنەر بتوانێت خێرا هەڵەکە بدۆزێتەوە.",
          explanationAr: "اذكر المبلغ ورقم السطر حتى الموظف يلكي المشكلة بسرعة.",
          explanationRu: "Назовите сумму и номер строки, чтобы оператор мог быстро найти ошибку."
        },
        {
          situation: "نوێنەرەکە گۆڕانکارییەکەی چاک کردووە و دەتەوێت بەڵگە هەبێت",
          situationAr: "الموظف صلح التغيير وتريد إثبات مكتوب",
          situationRu: "Оператор исправил ошибку, и вы хотите письменное подтверждение",
          theyAsk: "I've removed the upgrade and added a credit. Anything else?",
          theyAskRu: "Я убрал повышение тарифа и начислил деньги. Что-нибудь еще?",
          correct: "Thanks. When will the credit appear, and could you email me confirmation of the change?",
          correctRu: "Спасибо. Когда деньги появятся на счету, и не могли бы вы отправить мне подтверждение изменений на почту?",
          wrong1: "Yes, please upgrade it again next week.",
          wrong1Ru: "Да, пожалуйста, повысьте тариф снова на следующей неделе.",
          wrong2: "No, I don't know my email address.",
          wrong2Ru: "Нет, я не знаю свой адрес электронной почты.",
          wrong3: "The grocery store closes at nine.",
          wrong3Ru: "Продуктовый магазин закрывается в девять.",
          explanation: "Written confirmation بەڵگەیەکە ئەگەر هەڵەکە لە پسووڵەی داهاتوودا دووبارە بووەوە.",
          explanationAr: "التأكيد المكتوب يحميك إذا تكرر الغلط بقائمة جاية.",
          explanationRu: "Письменное подтверждение (written confirmation) защитит вас, если ошибка повторится в следующем счете."
        },
      ],
    },
    "قوائم التليفون والخدمات",
    "Счета за телефон и коммунальные услуги"
  ),

  buildLesson(
    "Paychecks & Taxes",
    "مووچە و باج",
    [
      { en: "My take-home pay is lower than I expected.", ku: "مووچەی خاوێنم لەوەی چاوەڕوانم دەکرد کەمترە.", ar: "صافي راتبي أقل من المتوقع.", ru: "Моя зарплата на руки меньше, чем я ожидал." },
      { en: "This deduction is for health insurance.", ku: "ئەم کەمکردنەوەیە بۆ بیمەی تەندروستییە.", ar: "هذا الاستقطاع مال التأمين الصحي.", ru: "Это удержание — за медицинскую страховку." },
      { en: "Could payroll correct the hours on this check?", ku: "دەتوانێت بەشی مووچە کاتژمێرەکانی ئەم چەکە ڕاست بکاتەوە؟", ar: "يكدر قسم الرواتب يصحح الساعات بهذا الصك؟", ru: "Может ли бухгалтерия исправить часы в этом чеке?" },
      { en: "I need a copy of last year's W-2.", ku: "کۆپی فۆڕمی W-2ی ساڵی ڕابردووم پێویستە.", ar: "أحتاج نسخة من فورم W-2 مال العام.", ru: "Мне нужна копия прошлогодней формы W-2." },
      { en: "Do I qualify for this tax credit?", ku: "ئایا من شایستەی ئەم بڕە داشکاندنەی باجم؟", ar: "أني مشمول بهذا الائتمان الضريبي؟", ru: "Подхожу ли я под этот налоговый вычет?" },
      { en: "I'd rather have a professional file my return.", ku: "پێم باشترە پسپۆڕێک ڕاپۆرتی باجەکەم پێشکەش بکات.", ar: "أفضل شخص مختص يقدم تقريري الضريبي.", ru: "Я бы предпочел, чтобы мою декларацию подал специалист." },
    ],
    {
      speakPhrases: [
        { en: "How much is coming out for retirement?", ku: "چەند بۆ خانەنشینی دەبڕدرێت؟", ar: "شكد ينكص للتقاعد؟", ru: "Сколько удерживается на пенсию?" },
        { en: "I picked up two overtime shifts last week.", ku: "هەفتەی ڕابردوو دوو شیفتی زیادەم وەرگرت.", ar: "أخذت شفتين إضافية الأسبوع الراح.", ru: "На прошлой неделе я взял две смены сверхурочно." },
        { en: "Should I be claiming a different number?", ku: "پێویستە ژمارەیەکی جیاواز داوا بکەم؟", ar: "لازم أصرح برقم مختلف؟", ru: "Стоит ли мне указать другое количество иждивенцев?" },
      ],
      sentencePhrases: [
        { en: "I get paid every other Friday.", ku: "هەموو دوو هەفتە جارێک ڕۆژی هەینی مووچە وەردەگرم.", ar: "أستلم راتبي كل جمعة ورا أسبوعين.", ru: "Я получаю зарплату каждую вторую пятницу." },
        { en: "The refund went straight to savings.", ku: "پارە گەڕاوەکە ڕاستەوخۆ چووە سەر پاشەکەوت.", ar: "فلوس الاسترداد راحت كبل للتوفير.", ru: "Возврат налога пошел прямо на сберегательный счет." },
        { en: "My side job counts as income too.", ku: "کاری لاوەکیشم بە داهات دەژمێردرێت.", ar: "شغلي الإضافي هم ينحسب دخل.", ru: "Моя подработка тоже считается доходом." },
      ],
      fills: [
        fill(
          "Taxes are ___ out before I ever see the money.",
          "taken",
          ["given", "brought", "held"],
          "باج دەبڕدرێت پێش ئەوەی هەرگیز پارەکە ببینم.",
          "الضريبة تنكص قبل لا أشوف الفلوس أصلاً.",
          undefined,
          "Налоги вычитаются до того, как я вообще увижу деньги.",
          {
            sentence: "Налоги ___ до того, как я вообще увижу деньги.",
            answer: "вычитаются",
            wrongs: ["даются", "приносятся", "держатся"]
          }
        ),
        fill(
          "I need to ___ my taxes before April fifteenth.",
          "file",
          ["send", "write", "make"],
          "پێویستە پێش پازدەی نیسان ڕاپۆرتی باجەکەم پێشکەش بکەم.",
          "لازم أقدم تقريري الضريبي قبل خمسطعش نيسان.",
          undefined,
          "Мне нужно подать налоговую декларацию до пятнадцатого апреля.",
          {
            sentence: "Мне нужно ___ налоговую декларацию до пятнадцатого апреля.",
            answer: "подать",
            wrongs: ["послать", "написать", "сделать"]
          }
        ),
      ],
      convos: [
        {
          situation: "لە مووچەکەتدا چەند کاتژمێرێک دیار نییە",
          situationAr: "بعض ساعات الشغل ما موجودة براتبك",
          situationRu: "Некоторые часы работы отсутствуют в вашей зарплате",
          theyAsk: "What looks incorrect on your pay stub?",
          theyAskRu: "Что не так в вашем расчетном листке?",
          correct: "It only shows 72 hours, but I worked 80. Could payroll correct the hours on this check?",
          correctRu: "Там указано только 72 часа, но я отработал 80. Может ли бухгалтерия исправить часы в этом чеке?",
          wrong1: "I want a different job title on the stub.",
          wrong1Ru: "Я хочу другую должность в расчетном листке.",
          wrong2: "Health insurance is useful sometimes.",
          wrong2Ru: "Медицинская страховка иногда полезна.",
          wrong3: "Please estimate whatever number seems right.",
          wrong3Ru: "Пожалуйста, укажите любую сумму, которая кажется правильной.",
          explanation: "ژمارەی تۆمارکراو و ژمارەی ڕاست بەراورد بکە؛ داواکارییەکە ورد و بەڵگەدار دەبێت.",
          explanationAr: "قارن عدد الساعات المسجلة بالعدد الصحيح؛ هذا يخلي طلبك واضح ويكدرون يتأكدون منه.",
          explanationRu: "Сравните записанное и реальное количество часов; это делает запрос точным и обоснованным."
        },
        {
          situation: "لەسەر فۆڕمێکی باجی ئەمریکی پرسیارت هەیە",
          situationAr: "عندك سؤال عن نموذج ضريبي أمريكي",
          situationRu: "У вас есть вопрос об американской налоговой форме",
          theyAsk: "Are you filing the return yourself this year?",
          theyAskRu: "Вы сами подаете декларацию в этом году?",
          correct: "Probably not. I'd rather have a professional file it, and I need a copy of last year's W-2.",
          correctRu: "Наверное, нет. Я бы предпочел, чтобы ее подал специалист, и мне нужна копия прошлогодней формы W-2.",
          wrong1: "I receive my paycheck every other Friday.",
          wrong1Ru: "Я получаю зарплату каждую вторую пятницу.",
          wrong2: "My phone plan includes unlimited data.",
          wrong2Ru: "Мой тариф на телефон включает безлимитный интернет.",
          wrong3: "Taxes are optional if the form is confusing.",
          wrong3Ru: "Налоги необязательны, если форма запутанная.",
          explanation: "'File a return' واتە ڕاپۆرتی باج پێشکەشکردن؛ W-2 فۆڕمی مووچە و باجی وەرگیراوی کارمەندە لە ئەمریکا.",
          explanationAr: "'file a return' يعني تقدم التقرير الضريبي؛ و W-2 هو نموذج الأجور والضرائب المستقطعة للموظف بأمريكا.",
          explanationRu: "'File a return' означает подачу налоговой декларации; W-2 — это американская форма о доходах и удержанных налогах."
        },
      ],
    },
    "الرواتب والضرائب",
    "Зарплата и налоги"
  ),

  buildLesson(
    "Fraud & Disputed Charges",
    "فێڵ و مامەڵەی ناڕوون",
    [
      { en: "I don't recognize this charge on my statement.", ku: "ئەم بڕە پارەیە لە ڕاپۆرتی هەژمارەکەم ناناسمەوە.", ar: "ما أعرف هاي العملية بكشف حسابي.", ru: "Я не узнаю эту операцию в своей выписке." },
      { en: "My card is still with me, so it may be fraud.", ku: "کارتەکەم هەر لەلای خۆمە، بۆیە ڕەنگە فێڵ بێت.", ar: "بطاقتي بعدها عندي، فيمكن العملية نصب.", ru: "Карта все еще у меня, так что, возможно, это мошенничество." },
      { en: "Please freeze the card while you investigate.", ku: "تکایە تا لێکۆڵینەوە دەکەن کارتەكە ڕابگرن.", ar: "جمدوا البطاقة بلا زحمة بوكت التحقيق.", ru: "Пожалуйста, заморозьте карту на время расследования." },
      { en: "How long does the dispute process usually take?", ku: "پرۆسەی ناڕەزایی زۆرجار چەند دەخایەنێت؟", ar: "شكد تطول إجراءات الاعتراض بالعادي؟", ru: "Сколько обычно длится процесс оспаривания?" },
      { en: "Will I receive a temporary credit?", ku: "ئایا بڕێکی کاتی لە هەژمارەکەم زیاد دەکرێت؟", ar: "راح ينزل لي رصيد مؤقت؟", ru: "Получу ли я временное возмещение средств?" },
      { en: "Could you send the case number by text?", ku: "دەتوانیت ژمارەی کەیسەکە بە نامە بۆم بنێریت؟", ar: "تكدر تدزلي رقم القضية برسالة؟", ru: "Не могли бы вы прислать номер дела в смс?" },
    ],
    {
      speakPhrases: [
        { en: "Someone tried to use my card in another state.", ku: "کەسێک هەوڵی داوە کارتەکەم لە ویلایەتێکی تر بەکاربهێنێت.", ar: "أكو واحد حاول يستعمل بطاقتي بولاية ثانية.", ru: "Кто-то пытался использовать мою карту в другом штате." },
        { en: "Go ahead and send me a new card.", ku: "تکایە کارتێکی نوێم بۆ بنێرە.", ar: "بلا زحمة دزلي بطاقة جديدة.", ru: "Да, отправьте мне новую карту." },
        { en: "I've already changed my password.", ku: "پێشتر وشەی نهێنیم گۆڕیوە.", ar: "أني أصلا غيرت الباسورد.", ru: "Я уже изменил свой пароль." },
      ],
      sentencePhrases: [
        { en: "The charge went through at two in the morning.", ku: "پارەکە کاتژمێر دووی بەیانی کێشرا.", ar: "العملية صارت بـ ثنتين بالليل.", ru: "Платеж прошел в два часа ночи." },
        { en: "I got a text alert right away.", ku: "دەستبەجێ ئاگادارییەکی نامەم پێگەیشت.", ar: "وصلني تنبيه برسالة كبل.", ru: "Я сразу же получил текстовое уведомление." },
        { en: "Turn off international purchases for me.", ku: "کڕینی نێودەوڵەتیم بۆ بکوژێنەوە.", ar: "وكف مشتريات النت الدولية بلا زحمة.", ru: "Отключите мне международные покупки." },
      ],
      fills: [
        fill(
          "I'd like to ___ this charge.",
          "dispute",
          ["argue", "refuse", "complain"],
          "دەمەوێت ناڕەزایی لەم بڕە پارەیە دەربڕم.",
          "أريد أعترض على هاي العملية.",
          undefined,
          "Я хотел бы оспорить это списание.",
          {
            sentence: "Я хотел бы ___ это списание.",
            answer: "оспорить",
            wrongs: ["поспорить", "отказать", "пожаловаться"]
          }
        ),
        fill(
          "Please ___ the card so nothing else goes through.",
          "freeze",
          ["stop", "hold", "close"],
          "تکایە کارتەکە ڕابگرە تا هیچی تر نەکێشرێت.",
          "بلا زحمة جمد البطاقة حتى ما تصير أي عملية ثانية.",
          undefined,
          "Пожалуйста, заморозьте карту, чтобы больше ничего не списалось.",
          {
            sentence: "Пожалуйста, ___ карту, чтобы больше ничего не списалось.",
            answer: "заморозьте",
            wrongs: ["остановите", "придержите", "закройте"]
          }
        ),
      ],
      convos: [
        {
          situation: "مامەڵەیەکی نەناسراو لە کارتی بانکیت دەبینیت",
          situationAr: "تشوف عملية غريبة على بطاقتك البنكية",
          situationRu: "Вы видите неизвестную операцию на своей банковской карте",
          theyAsk: "Do you still have the physical card with you?",
          theyAskRu: "У вас все еще есть с собой физическая карта?",
          correct: "Yes, it's still with me, and I don't recognize the charge. Please freeze the card while you investigate.",
          correctRu: "Да, она все еще у меня, и я не узнаю это списание. Пожалуйста, заморозьте карту на время расследования.",
          wrong1: "Yes, and I used it at that store last year.",
          wrong1Ru: "Да, и я пользовался ею в этом магазине в прошлом году.",
          wrong2: "No, but the monthly fee seems reasonable.",
          wrong2Ru: "Нет, но ежемесячная плата кажется разумной.",
          wrong3: "Leave the card active until more charges appear.",
          wrong3Ru: "Оставьте карту активной, пока не появятся новые списания.",
          explanation: "کارت لەلای تۆیە بەڵام مامەڵەکە هی تۆ نییە: ئەمە زانیارییەکی گرنگە بۆ دەستپێکردنی fraud claim.",
          explanationAr: "وجود البطاقة يمك وأنت مسويت العملية معلومة مهمة حتى تبلّغ عن النصب.",
          explanationRu: "Наличие карты при себе, когда вы не совершали операцию, — важная информация для начала расследования о мошенничестве."
        },
        {
          situation: "بانکەکە ناڕەزاییەکەت تۆمار کردووە و دەتەوێت بەدواداچوون بکەیت",
          situationAr: "البنك سجل اعتراضك وتريد تتابع القضية",
          situationRu: "Банк зарегистрировал ваше возражение, и вы хотите узнать о дальнейших шагах",
          theyAsk: "The dispute has been opened. Is there anything else you need?",
          theyAskRu: "Процесс оспаривания начат. Вам нужно что-нибудь еще?",
          correct: "Yes—how long does the process usually take, and could you text me the case number?",
          correctRu: "Да — сколько обычно длится процесс, и не могли бы вы прислать мне номер дела в смс?",
          wrong1: "Please close it before anyone reviews it.",
          wrong1Ru: "Пожалуйста, закройте его до того, как кто-нибудь рассмотрит.",
          wrong2: "I'd like to open a checking account too.",
          wrong2Ru: "Я бы хотел также открыть расчетный счет.",
          wrong3: "The charge must be correct because it is pending.",
          wrong3Ru: "Списание должно быть правильным, потому что оно в обработке.",
          explanation: "ژمارەی کەیس و ماوەی چاوەڕوانی بپرسە تا بتوانیت بەدواداچوون بکەیت.",
          explanationAr: "اطلب رقم القضية والوكت المتوقع حتى تكدر تتابعها زين.",
          explanationRu: "Спросите номер дела и ожидаемое время, чтобы вы могли следить за процессом."
        },
      ],
    },
    "النصب والعمليات المعترض عليها",
    "Мошенничество и оспариваемые операции"
  ),
];

export default unit11;
