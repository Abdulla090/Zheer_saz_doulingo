import { UnitBank } from "../types";

// ── Visible Unit 6: Social & Practical English — 10 unique lessons ────────────
// Practical English for Kurdish & Russian speakers: Real-life scenarios, social interactions, and practical daily tasks.

const normalUnit01: UnitBank = [

  // Lesson 0: Catching Up
  {
    topic: "Catching Up", topicKu: "هەواڵپرسین و بینینەوە", topicAr: "السؤال عن الحال واللقاء", topicRu: "Встреча и новости",
    words: [
      { english: "How have you been", kurdish: "چۆن بوویت؟ (بۆ ماوەیەک کە نەتبینیوە)", arabic: "شلونك؟ (صارلي هواي مشايفك)", russian: "Как твои дела?" },
      { english: "It's been a while", kurdish: "ماوەیەکە یەکمان نەدیوە", arabic: "صار هواية مشايفك", russian: "Давно не виделись" },
      { english: "What have you been up to", kurdish: "خەریکی چیت؟ (لەم ماوەیەدا)", arabic: "شجنت تسوي؟ (بالفترة الأخيرة)", russian: "Чем занимался всё это время?" },
      { english: "Let's catch up soon", kurdish: "با بە زوویی یەکتر ببینینەوە و قسە بکەین", arabic: "خلي نلتقي قريب ونسولف", russian: "Давай скоро увидимся и поболтаем" },
      { english: "Taking it easy", kurdish: "تەنها پشوو دەدەم / خۆم ماندوو ناکەم", arabic: "كاعد مرتاح / مماخذها بجدية", russian: "Отдыхаю / не напрягаюсь" },
    ],
    voices: [
      { prompt: "سڵاوکردن لە هاوڕێیەک دوای ماوەیەک", target: "Hi, how have you been? It's been a while.", targetKurdish: "سڵاو، چۆن بوویت؟ ماوەیەکە یەکمان نەدیوە.", promptAr: "تسلم على صديق بعد فترة", targetArabic: "هلا، شلونك؟ صار هواية مشايفك.", promptRu: "Поздоровайся с другом после долгой разлуки", targetRussian: "Привет, как твои дела? Давно не виделись." },
      { prompt: "کۆتایی پێهێنانی گفتوگۆیەکی کورت", target: "It was great seeing you. Let's catch up soon.", targetKurdish: "بینینت زۆر خۆش بوو. با بە زوویی یەکتر ببینینەوە.", promptAr: "تنهي محادثة قصيرة", targetArabic: "كلش فرحت بشوفتك. خلي نلتقي قريب.", promptRu: "Заверши короткий разговор", targetRussian: "Был очень рад тебя видеть. Давай скоро увидимся и поболтаем." },
    ],
    sentences: [
      { english: ["What","have","you","been","up","to","lately"], kurdish: "لەم دواییانەدا خەریکی چی بوویت؟", arabic: "شجنت تسوي بالفترة الأخيرة؟", russian: "Чем ты занимался в последнее время?" },
      { english: ["I'm","just","taking","it","easy","these","days"], kurdish: "ئەم ڕۆژانە تەنها پشوو دەدەم و خۆم ماندوو ناکەم", arabic: "بس كاعد مرتاح هالايام", russian: "В эти дни я просто отдыхаю и не напрягаюсь" },
    ],
    fillBlanks: [
      { parts: ["How have you","lately?"], hint: "لەم دواییانەدا چۆن بوویت؟", answer: "been", wrongs: ["are","is","doing"], arabicHint: "شلونك هالأيام؟", arabicParts: ["شلونك","هالأيام؟"], arabicAnswer: "حالك", arabicWrongs: ["انت","تكون","تسوي"], russianHint: "Как твои дела в последнее время?", russianParts: ["Как твои","в последнее время?"], russianAnswer: "дела", russianWrongs: ["планы","вещи","дни"] },
      { parts: ["Let's catch","over coffee next week."], hint: "با هەفتەی داهاتوو لەسەر قاوەیەک یەکتر ببینینەوە و قسە بکەین.", answer: "up", wrongs: ["out","in","on"], arabicHint: "خلي نلتقي ونسولف على كهوة السبوع الجاي.", arabicParts: ["خلي","ونسولف على كهوة السبوع الجاي."], arabicAnswer: "نلتقي", arabicWrongs: ["نطلع","ندخل","نروح"], russianHint: "Давай поболтаем за чашкой кофе на следующей неделе.", russianParts: ["Давай встретимся и","за чашкой кофе на следующей неделе."], russianAnswer: "поболтаем", russianWrongs: ["поработаем","подумаем","посмотрим"] },
    ],
    conversations: [
      {
        situation: "لە مۆڵێکدا بە ڕێکەوت هاوڕێیەکی کۆن دەبینیت",
        theyAsk: "Hey! I haven't seen you in months. How are you?",
        correct: "I've been great, thanks! What have you been up to these days?",
        wrong1: "I've been doing well, thanks.",
        wrong2: "Nothing much—how about you?",
        wrong3: "I'm good. What are you doing today?",
        explanation: "'How have you been' و 'What have you been up to' ڕێگەیەکی زۆر سروشتی و باوە بۆ هەواڵپرسین لە کەسێک کە ماوەیەکە نەتبینیوە",
        situationAr: "تلتقي بصديق قديم صدفة بمول",
        explanationAr: "'How have you been' و 'What have you been up to' هي طرق طبيعية وكلش شائعة حتى تسأل عن أحوال شخص صارلك هواية مشايفه.",
        theyAskAr: "هلا! صارلي أشهر مشايفك. شلونك؟",
        correctAr: "كلش تمام، شكراً! شجنت تسوي بهالفترة؟",
        wrong1Ar: "اموري زينة، شكراً.",
        wrong2Ar: "ماكو شي جديد—انت شلونك؟",
        wrong3Ar: "اني زين. شراح تسوي اليوم؟",
        situationRu: "Случайная встреча со старым знакомым в торговом центре",
        theyAskRu: "Привет! Не видел тебя сто лет. Как поживаешь?",
        correctRu: "Всё отлично, спасибо! Чем занимался в последнее время?",
        wrong1Ru: "У меня всё хорошо, спасибо.",
        wrong2Ru: "Ничего особенного — а ты как?",
        wrong3Ru: "Я в порядке. Что делаешь сегодня?",
        explanationRu: "«How have you been» и «What have you been up to» — естественные и очень популярные фразы, чтобы узнать о жизни человека, которого давно не видел."
      },
    ],
  },

  // Lesson 1: Making Plans
  {
    topic: "Making Plans", topicKu: "دانانی پلان و بانگهێشتکردن", topicAr: "ترتيب الطلعات والدعوات", topicRu: "Совместные планы",
    words: [
      { english: "Are you free", kurdish: "کاتت هەیە؟ / بەتاڵیت؟", arabic: "فارغ؟ / عندك وكت؟", russian: "Ты свободен?" },
      { english: "Do you want to grab", kurdish: "دەتەوێت بچین بۆ (خواردن/خواردنەوە)؟", arabic: "تريد نطلع ناكل/نشرب شي؟", russian: "Хочешь перекусить / выпить кофе?" },
      { english: "Does that work for you", kurdish: "ئەوە بۆ تۆ گونجاوە؟", arabic: "يناسبك هذا الشي؟", russian: "Тебе это подходит?" },
      { english: "Sounds like a plan", kurdish: "بیرۆکەیەکی زۆر باشە (ڕازیبوون لەسەر پلانێک)", arabic: "خوش فكرة (موافقة على خطة)", russian: "Отличная идея / Договорились" },
      { english: "I'm tied up", kurdish: "دەستم گیراوە / سەرقاڵم", arabic: "كلش مشغول / ملتهي", russian: "Я завален делами / занят" },
    ],
    voices: [
      { prompt: "پێشنیارکردنی چوونە دەرەوە", target: "Do you want to grab coffee tomorrow morning?", targetKurdish: "دەتەوێت بەیانی بچین قاوەیەک بخۆینەوە؟", promptAr: "تقترح تطلعون", targetArabic: "تريد نطلع نشرب كهوة باجر الصبح؟", promptRu: "Предложи выпить кофе утром", targetRussian: "Хочешь перекусить и выпить кофе завтра утром?" },
      { prompt: "گونجاندنی کات", target: "Let's meet at six. Does that work for you?", targetKurdish: "با کاتژمێر شەش یەکتر ببینین. ئەوە بۆ تۆ گونجاوە؟", promptAr: "تتفق على موعد", targetArabic: "خلي نلتقي بالستة. يناسبك؟", promptRu: "Согласуй время встречи", targetRussian: "Давай встретимся в шесть. Тебе это подходит?" },
    ],
    sentences: [
      { english: ["Are","you","free","to","meet","up","this","weekend"], kurdish: "کاتت هەیە ئەم کۆتایی هەفتەیە یەکتر ببینین؟", arabic: "فارغ نلتقي بنهاية هالاسبوع؟", russian: "Ты свободен встретиться на этих выходных?" },
      { english: ["That","sounds","like","a","plan","see","you","then"], kurdish: "بیرۆکەیەکی زۆر باشە، کەواتە دەتبینم", arabic: "خوش فكرة، اشوفك لعد", russian: "Договорились, отличная идея, до встречи!" },
    ],
    fillBlanks: [
      { parts: ["Are you","on Friday evening?"], hint: "ئێوارەی هەینی کاتت هەیە؟", answer: "free", wrongs: ["empty","available","good"], arabicHint: "فارغ يوم الجمعة بالليل؟", arabicParts: ["انت","يوم الجمعة بالليل؟"], arabicAnswer: "فارغ", arabicWrongs: ["خالي","موجود","زين"], russianHint: "Ты свободен в пятницу вечером?", russianParts: ["Ты","в пятницу вечером?"], russianAnswer: "свободен", russianWrongs: ["занят","готов","уверен"] },
      { parts: ["I'd love to, but I'm","up with work."], hint: "حەزم دەکرد بێم، بەڵام دەستم گیراوە بە کارەوە.", answer: "tied", wrongs: ["busy","stuck","held"], arabicHint: "ياريت، بس كلش ملتهي بالشغل.", arabicParts: ["ياريت، بس","كلش بالشغل."], arabicAnswer: "ملتهي", arabicWrongs: ["مشغول","مرتبط","محبوس"], russianHint: "С удовольствием, но я по уши завален работой.", russianParts: ["С удовольствием, но я по уши","работой."], russianAnswer: "завален", russianWrongs: ["доволен","увлечен","связан"] },
    ],
    conversations: [
      {
        situation: "دەتەوێت لەگەڵ هاوکارێکت بچیتە دەرەوە بۆ نانخواردن",
        theyAsk: "I'm getting hungry. Should we go eat?",
        correct: "Yeah, do you want to grab lunch at the new cafe? Does 1 PM work for you?",
        wrong1: "Sure, we could get lunch.",
        wrong2: "I'd like to eat around one.",
        wrong3: "Do you want to go to the cafe now?",
        explanation: "دەستەواژەی 'grab lunch/coffee' زۆر باوە لە ئینگلیزی ئاخاوتندا بۆ چوونە دەرەوەیەکی خێرا",
        situationAr: "تريد تطلع تتغدى وية زميلك",
        explanationAr: "عبارة 'grab lunch/coffee' كلش شائعة باللغة الانكليزية المحجية للطلعات السريعة.",
        theyAskAr: "بديت اجوع. نروح ناكل؟",
        correctAr: "اي، تريد نروح نتغدى بالكافيه الجديد؟ يناسبك بالوحدة؟",
        wrong1Ar: "اكيد، نكدر نروح نتغدى.",
        wrong2Ar: "احب اكل بحدود الساعة وحدة.",
        wrong3Ar: "تريد نروح للكافيه هسة؟",
        situationRu: "Хочешь пойти пообедать вместе с коллегой",
        theyAskRu: "Я проголодался. Пойдем поедим?",
        correctRu: "Да, давай пообедаем в новом кафе! Тебе подходит в час дня?",
        wrong1Ru: "Конечно, можно пообедать.",
        wrong2Ru: "Я бы хотел поесть около часа.",
        wrong3Ru: "Хочешь пойти в кафе прямо сейчас?",
        explanationRu: "Выражение «grab lunch/coffee» очень популярно в разговорном английском для спонтанного предложения перекусить."
      },
    ],
  },

  // Lesson 2: Dining Out
  {
    topic: "Dining Out", topicKu: "نانخواردن لە دەرەوە", topicAr: "الاكل برة", topicRu: "В ресторане",
    words: [
      { english: "I would like to order", kurdish: "دەمەوێت داوا بکەم", arabic: "اريد اطلب", russian: "Я бы хотел заказать..." },
      { english: "Could I have the bill", kurdish: "دەکرێت پسووڵەکە (حسابەکە) بێنیت؟", arabic: "تكدر تجيب القائمة (الحساب)؟", russian: "Можно мне счет?" },
      { english: "On the side", kurdish: "لە تەنیشتییەوە (وەک خواردنی لاوەکی)", arabic: "على صفحة (كطبق جانبي)", russian: "Отдельно (гарниром / соусом)" },
      { english: "I'll have the same", kurdish: "منیش هەمان شت دەخۆم", arabic: "راح اخذ نفس الشي", russian: "Мне то же самое" },
      { english: "Keep the change", kurdish: "باقیەکەی بۆ خۆت (وەک بەخشیش)", arabic: "خلي الباقي الك (اكرامية)", russian: "Сдачи не надо" },
    ],
    voices: [
      { prompt: "داواکردنی خواردن بە شێوازێکی جوان", target: "I would like the grilled chicken with salad on the side, please.", targetKurdish: "تکایە، حەزم لە مریشکی برژاوەیە لەگەڵ زەڵاتە لە تەنیشتییەوە.", promptAr: "تطلب اكل بطريقة محترمة", targetArabic: "اريد دجاج شوي وية زلاطة على صفحة بلا زحمة.", promptRu: "Сделай заказ в ресторане", targetRussian: "Я бы хотел курицу на гриле с салатом на гарнир, пожалуйста." },
      { prompt: "داواکردنی پسووڵەی پارە", target: "Could we get the bill, please? We're ready to pay.", targetKurdish: "تکایە، دەکرێت پسووڵەکەمان بۆ بێنیت؟ ئامادەین بۆ پارەدان.", promptAr: "تطلب القائمة (الحساب)", targetArabic: "نكدر ناخذ القائمة بلا زحمة؟ احنة جاهزين ندفع.", promptRu: "Попроси счет", targetRussian: "Можно нам счет, пожалуйста? Мы готовы оплатить." },
    ],
    sentences: [
      { english: ["Could","I","have","the","bill","please"], kurdish: "دەکرێت پسووڵەکە بێنیت تکایە؟", arabic: "تكدر تجيب القائمة بلا زحمة؟", russian: "Можно мне счет, пожалуйста?" },
      { english: ["I'll","have","the","same","as","him"], kurdish: "منیش هەمان شتی ئەو دەخۆم", arabic: "راح اخذ نفس الشي مثله.", russian: "Мне то же самое, что и ему" },
    ],
    fillBlanks: [
      { parts: ["I","like to order the pasta."], hint: "حەزم لێیە پاستاکە داوا بکەم.", answer: "would", wrongs: ["want","will","can"], arabicHint: "اريد اطلب معكرونة.", arabicParts: ["اني","اطلب معكرونة."], arabicAnswer: "اريد", arabicWrongs: ["احب","راح","اكدر"], russianHint: "Я бы хотел заказать пасту.", russianParts: ["Я бы","заказать пасту."], russianAnswer: "хотел", russianWrongs: ["думал","решил","стал"] },
      { parts: ["Could we get some fries on the","?"], hint: "دەکرێت کەمێک پەتاتەی سوورکراوە وەک خواردنی لاوەکی بێنین؟", answer: "side", wrongs: ["next","plate","part"], arabicHint: "نكدر نطلب شوية بتيتة مكلية على صفحة؟", arabicParts: ["نكدر نطلب شوية بتيتة مكلية على","؟"], arabicAnswer: "صفحة", arabicWrongs: ["اضافي","ماعون","جزء"], russianHint: "Можно нам картошку фри на гарнир?", russianParts: ["Можно нам картошку фри на","?"], russianAnswer: "гарнир", russianWrongs: ["десерт","заказ","обед"] },
    ],
    conversations: [
      {
        situation: "نانخواردنەکەتان تەواو بووە و دەتەوێت بڕۆیت",
        theyAsk: "Can I get you anything else for dessert?",
        correct: "No, thank you. Could I have the bill, please?",
        wrong1: "No, thanks. We're ready to pay.",
        wrong2: "Nothing else, thank you.",
        wrong3: "Could you bring the check when you have a moment?",
        explanation: "'Could I have the bill, please?' باوترین و بەئەدەبترین ڕێگەیە بۆ داواکردنی حسابی چێشتخانە",
        situationAr: "خلصت اكل وتريد تطلع",
        explanationAr: "'Could I have the bill, please?' هي الطريقة الاكثر شيوعا وكلش محترمة حتى تطلب بيها حساب المطعم.",
        theyAskAr: "اجيبلكم اي شي ثاني للتحلية؟",
        correctAr: "لا شكراً. تكدر تجيب القائمة (الحساب) بلا زحمة؟",
        wrong1Ar: "لا شكراً. احنا جاهزين ندفع.",
        wrong2Ar: "ماكو شي ثاني، شكراً.",
        wrong3Ar: "تكدر تجيب الحساب من يصير عندك وكت؟",
        situationRu: "Вы закончили ужинать и хотите уйти",
        theyAskRu: "Принести вам что-нибудь еще на десерт?",
        correctRu: "Нет, спасибо. Можно нам счет, пожалуйста?",
        wrong1Ru: "Нет, спасибо. Мы готовы оплатить.",
        wrong2Ru: "Больше ничего, спасибо.",
        wrong3Ru: "Не могли бы вы принести чек, когда освободитесь?",
        explanationRu: "«Could I have the bill, please?» — самый естественный и вежливый способ попросить счет в ресторане."
      },
    ],
  },

  // Lesson 3: Shopping
  {
    topic: "Shopping", topicKu: "بازاڕکردن", topicAr: "السوك والمكاسر", topicRu: "Покупки и торг",
    words: [
      { english: "I'm just browsing", kurdish: "تەنها سەیر دەکەم (نامەوێت شت بکڕم لە ئێستادا)", arabic: "بس داباوع (ما اريد اشتري هسة)", russian: "Я просто смотрю" },
      { english: "Do you have this in", kurdish: "ئەمەتان هەیە بە (قەبارە/ڕەنگ)...؟", arabic: "عدكم من هذا بـ (قياس/لون)...؟", russian: "У вас есть это в размере..." },
      { english: "Can I try it on", kurdish: "دەتوانم تاقی بکەمەوە؟", arabic: "اكدر اجربه (اقيسه)؟", russian: "Можно примерить?" },
      { english: "Out of my budget", kurdish: "لە سەرووی بودجەکەمەوەیە (گرانە)", arabic: "فوك ميزانيتي (غالي)", russian: "Выходит за рамки моего бюджета" },
      { english: "Is that your best price", kurdish: "ئەوە دوا نرختە؟ / داشکاندن دەکەیت؟", arabic: "هذا اخر سعر؟ / تسوي خصم؟", russian: "Это ваша окончательная цена?" },
    ],
    voices: [
      { prompt: "کاتێک پێویستت بە یارمەتی فرۆشیار نییە", target: "No thank you, I'm just browsing for now.", targetKurdish: "نەخێر سوپاس، تەنها سەیر دەکەم بۆ ئێستا.", promptAr: "من ما تحتاج مساعدة البياع", targetArabic: "لا شكراً، بس داباوع هسة.", promptRu: "Вежливо откажись от помощи продавца", targetRussian: "Нет, спасибо, я пока просто смотрю." },
      { prompt: "مامەڵەکردن لەسەر نرخ", target: "It's a bit out of my budget. Is that your best price?", targetKurdish: "کەمێک لە سەرووی بودجەکەمەوەیە. ئەوە باشترین نرختە؟", promptAr: "تكاسر على السعر", targetArabic: "هذا شوية فوك ميزانيتي. هذا اخر سعر؟", promptRu: "Попробуй снизить цену", targetRussian: "Это немного выходит за рамки моего бюджета. Это ваша лучшая цена?" },
    ],
    sentences: [
      { english: ["Do","you","have","this","in","a","medium"], kurdish: "ئەمەتان هەیە بە قەبارەی مامناوەند (میدیەم)؟", arabic: "عدكم من هذا بقياس وسط؟", russian: "У вас есть это в среднем размере (М)?" },
      { english: ["Where","is","the","fitting","room","please"], kurdish: "تکایە ژووری خۆگۆڕین لە کوێیە؟", arabic: "وين غرفة القياس بلا زحمة؟", russian: "Подскажите, пожалуйста, где примерочная?" },
    ],
    fillBlanks: [
      { parts: ["I'm just",", thank you."], hint: "تەنها سەیر دەکەم، سوپاس.", answer: "browsing", wrongs: ["looking","seeing","watching"], arabicHint: "بس داباوع، شكراً.", arabicParts: ["بس","، شكراً."], arabicAnswer: "داباوع", arabicWrongs: ["اباوع","اشوف","اتفرج"], russianHint: "Я просто смотрю, спасибо.", russianParts: ["Я пока просто",", спасибо."], russianAnswer: "смотрю", russianWrongs: ["покупаю","ищу","выбираю"] },
      { parts: ["Is that your","price?"], hint: "ئەوە باشترین نرختە؟ (بۆ مامەڵەکردن)", answer: "best", wrongs: ["last","final","good"], arabicHint: "هذا احسن سعر عندك؟", arabicParts: ["هذا","سعر عندك؟"], arabicAnswer: "احسن", arabicWrongs: ["اخر","نهائي","زين"], russianHint: "Это ваша окончательная цена?", russianParts: ["Это ваша","цена?"], russianAnswer: "окончательная", russianWrongs: ["хорошая","дорогая","быстрая"] },
    ],
    conversations: [
      {
        situation: "جلێک تاقی دەکەیتەوە بەڵام نرخەکەی گرانە",
        theyAsk: "How did the jacket fit? It looks great on you.",
        correct: "It fits perfectly, but it's a bit out of my budget. Do you offer any discounts?",
        wrong1: "It fits well, but it's more than I wanted to spend.",
        wrong2: "I like it, but the price is a little high for me.",
        wrong3: "Do you have a less expensive option?",
        explanation: "'A bit out of my budget' ڕێگەیەکی زۆر جوانە بۆ گوتنی ئەوەی کە شتێک گرانە بەبێ ئەوەی ڕاستەوخۆ بڵێیت گرانە",
        situationAr: "تقيس ملابس بس سعرها غالي",
        explanationAr: "'A bit out of my budget' هي طريقة كلش محترمة حتى تكول على شي غالي بدون ما تكولها بشكل مباشر.",
        theyAskAr: "شلونها السترة؟ كلش طالعة حلوة عليك.",
        correctAr: "قياسها مضبوط، بس شوية فوك ميزانيتي. عدكم اي خصم؟",
        wrong1Ar: "قياسها زين، بس اغلى مما جنت ناوي اصرف.",
        wrong2Ar: "عجبتني، بس السعر شوية غالي عليه.",
        wrong3Ar: "عدكم خيار ارخص؟",
        situationRu: "Примеряешь куртку, но она слишком дорогая",
        theyAskRu: "Как села куртка? Смотрится на вас отлично!",
        correctRu: "Села идеально, но это немного не в моем бюджете. У вас есть скидки?",
        wrong1Ru: "Села хорошо, но это дороже, чем я планировал потратить.",
        wrong2Ru: "Мне нравится, но цена для меня высоковата.",
        wrong3Ru: "У вас есть вариант подешевле?",
        explanationRu: "«A bit out of my budget» — очень деликатный и вежливый способ сказать, что вещь дорогая, не говоря об этом прямо."
      },
    ],
  },

  // Lesson 4: Asking for Directions
  {
    topic: "Asking for Directions", topicKu: "پرسین لە ناونیشان", topicAr: "تندل الطريق", topicRu: "Как пройти (ориентация в городе)",
    words: [
      { english: "Could you point me to", kurdish: "دەتوانیت ڕێنماییم بکەیت بۆ...", arabic: "تكدر تدليني على...", russian: "Не подскажете дорогу к..." },
      { english: "Walking distance", kurdish: "دوورییەک کە بە پێ بڕۆیت", arabic: "مسافة مشي (قريبة تكدر تروحلها مشي)", russian: "В пешей доступности" },
      { english: "I'm a bit lost", kurdish: "کەمێک ون بووم", arabic: "اني تايه شوية / مضيع الطريق", russian: "Я немного заблудился" },
      { english: "Go straight ahead", kurdish: "ڕاستەوخۆ بڕۆ پێشەوە", arabic: "امشي كبل", russian: "Идите прямо" },
      { english: "Right around the corner", kurdish: "ڕێک لەو سووچەیە / زۆر نزیکە", arabic: "بالركن بالضبط / كلش قريب", russian: "Прямо за углом" },
    ],
    voices: [
      { prompt: "داوای یارمەتی بکە کاتێک ون بوویت", target: "Excuse me, I'm a bit lost. Could you point me to the train station?", targetKurdish: "ببوورە، کەمێک ون بووم. دەتوانیت ڕێنماییم بکەیت بۆ وێستگەی شەمەندەفەرەکە؟", promptAr: "اطلب مساعدة من تتيه", targetArabic: "بلا زحمة، اني تايه شوية. تكدر تدليني على محطة القطار؟", promptRu: "Попроси подсказать дорогу к вокзалу", targetRussian: "Извините, я немного заблудился. Не подскажете дорогу к вокзалу?" },
      { prompt: "پرسین لە دووری شوێنێک", target: "Is the museum within walking distance from here?", targetKurdish: "ئایا مۆزەخانەکە بە پێ لێرەوە نزیکە؟", promptAr: "تسأل عن مسافة مكان", targetArabic: "المتحف قريب منا بحيث ينراحله مشي؟", promptRu: "Спроси, можно ли дойти пешком", targetRussian: "Музей находится в пешей доступности отсюда?" },
    ],
    sentences: [
      { english: ["Is","it","within","walking","distance","from","here"], kurdish: "ئایا لێرەوە ئەوەندە نزیکە کە بە پێ بڕۆین؟", arabic: "هذا قريب منا وينراحله مشي؟", russian: "До туда можно дойти пешком отсюда?" },
      { english: ["Go","straight","ahead","and","take","the","second","right"], kurdish: "ڕاستەوخۆ بڕۆ پێشەوە و بە دووەم لاڕێی لای ڕاستدا بڕۆ", arabic: "امشي كبل وبعدين لوف يمنى باللفة الثانية.", russian: "Идите прямо и на втором повороте сверните направо" },
    ],
    fillBlanks: [
      { parts: ["Could you","me to the nearest bank?"], hint: "دەتوانیت ڕێنماییم بکەیت بۆ نزیکترین بانك؟", answer: "point", wrongs: ["show","give","tell"], arabicHint: "تكدر تدليني على اقرب بنك؟", arabicParts: ["تكدر","على اقرب بنك؟"], arabicAnswer: "تدليني", arabicWrongs: ["تشوفني","تنطيني","تكلي"], russianHint: "Не подскажете дорогу к ближайшему банку?", russianParts: ["Не","дорогу к ближайшему банку?"], russianAnswer: "подскажете", russianWrongs: ["покажете","скажете","найдете"] },
      { parts: ["Don't worry, it's right around the","."], hint: "خەمت نەبێت، ڕێک لەو سووچەیە (زۆر نزیکە).", answer: "corner", wrongs: ["street","way","block"], arabicHint: "لا تدير بال، هو بالركن بالضبط.", arabicParts: ["لا تدير بال، هو بالضبط بالـ","."], arabicAnswer: "ركن", arabicWrongs: ["شارع","طريق","عمارة"], russianHint: "Не волнуйтесь, это прямо за углом.", russianParts: ["Не волнуйтесь, это прямо за","."], russianAnswer: "углом", russianWrongs: ["домом","парком","мостом"] },
    ],
    conversations: [
      {
        situation: "لە شارێکی نوێیت و بەدوای میوانخانەکەدا دەگەڕێیت",
        theyAsk: "You look lost. Can I help you find something?",
        correct: "Yes, please. I'm looking for the Grand Hotel. Is it within walking distance?",
        wrong1: "Yes, could you tell me where the Grand Hotel is?",
        wrong2: "I'm trying to get to the Grand Hotel.",
        wrong3: "Could you point me toward the hotel?",
        explanation: "'Is it within walking distance?' پرسیارێکی زۆر باوە بۆ زانینی ئەوەی ئایا پێویست بە تەکسی دەکات یان نا",
        situationAr: "انت بمدينة جديدة وتدور على الفندق",
        explanationAr: "'Is it within walking distance?' هو سؤال كلش شائع حتى تعرف اذا تحتاج تكسي لو لا.",
        theyAskAr: "مبين عليك تايه. اساعدك تندل شي؟",
        correctAr: "اي رجاءً. ادور على فندق كراند اوتيل. قريب منا وينراحله مشي؟",
        wrong1Ar: "اي، تكدر تكلي وين فندق كراند اوتيل؟",
        wrong2Ar: "دا احاول اوصل لفندق كراند اوتيل.",
        wrong3Ar: "تكدر تدليني على الفندق؟",
        situationRu: "Ты в незнакомом городе и ищешь свою гостиницу",
        theyAskRu: "Вы выглядите растерянным. Вам помочь что-то найти?",
        correctRu: "Да, пожалуйста. Я ищу отель «Гранд». До него можно дойти пешком?",
        wrong1Ru: "Да, не могли бы вы сказать, где отель «Гранд»?",
        wrong2Ru: "Я пытаюсь добраться до отеля «Гранд».",
        wrong3Ru: "Не подскажете направление к отелю?",
        explanationRu: "Вопрос «Is it within walking distance?» очень популярен у путешественников, чтобы понять, можно ли дойти пешком или нужно такси."
      },
    ],
  },

  // Lesson 5: Health & Doctor
  {
    topic: "Health & Doctor", topicKu: "تەندروستی و سەردانی پزیشک", topicAr: "الصحة وزيارة الدكتور", topicRu: "Здоровье и визит к врачу",
    words: [
      { english: "I'm not feeling well", kurdish: "هەست بە باشی ناکەم", arabic: "مدا احس نفسي زين / متخربط", russian: "Я плохо себя чувствую" },
      { english: "Make an appointment", kurdish: "دانانی کات بۆ بینین (مەوعید)", arabic: "تحجز موعد", russian: "Записаться на прием" },
      { english: "I've been feeling dizzy", kurdish: "هەستم بە گێژبوونی سەر کردووە", arabic: "جنت دايخ / احس بدوخة", russian: "У меня кружится голова" },
      { english: "Sore throat", kurdish: "قورگ ئێشە", arabic: "بلاعيم / التهاب بلاعيم", russian: "Болит горло" },
      { english: "Prescription", kurdish: "ڕەچەتەی پزیشک", arabic: "راجيتة (وصفة طبية)", russian: "Рецепт (на лекарство)" },
    ],
    voices: [
      { prompt: "هەستکردن بە نەخۆشی", target: "I'm not feeling well today. I have a headache and a sore throat.", targetKurdish: "ئەمڕۆ هەست بە باشی ناکەم. سەرم دێشێت و قورگیشم دێشێت.", promptAr: "تحس نفسك مريض", targetArabic: "مدا احس نفسي زين اليوم. عندي وجع راس وبلاعيمي توجعني.", promptRu: "Опиши симптомы болезни", targetRussian: "Я сегодня плохо себя чувствую. У меня болит голова и першит в горле." },
      { prompt: "دانانی کات لای پزیشک", target: "I need to make an appointment. I've been feeling dizzy lately.", targetKurdish: "پێویستە کاتێک دابنێم. لەمدوایانەدا هەستم بە گێژبوون کردووە.", promptAr: "تحجز موعد يم الدكتور", targetArabic: "احتاج احجز موعد. جنت احس بدوخة بالفترة الاخيرة.", promptRu: "Запишись к врачу", targetRussian: "Мне нужно записаться на прием. В последнее время у меня часто кружится голова." },
    ],
    sentences: [
      { english: ["I","need","to","make","an","appointment"], kurdish: "پێویستە کاتێک (مەوعیدێک) دابنێم", arabic: "احتاج احجز موعد", russian: "Мне нужно записаться на прием к врачу" },
      { english: ["The","doctor","gave","me","a","prescription"], kurdish: "پزیشکەکە ڕەچەتەیەکی پێدام", arabic: "انطاني الدكتور راجيتة", russian: "Врач выписал мне рецепт на лекарства" },
    ],
    fillBlanks: [
      { parts: ["I've been feeling a bit","lately, like the room is spinning."], hint: "لەمدوایانەدا هەستم بە گێژبوون کردووە، وەک ئەوەی ژوورەکە بسوڕێتەوە.", answer: "dizzy", wrongs: ["tired","sick","weak"], arabicHint: "جنت احس بدوخة بالفترة الاخيرة، عبالك الغرفة تفتر بيه.", arabicParts: ["جنت احس بشوية","بالفترة الاخيرة، عبالك الغرفة تفتر بيه."], arabicAnswer: "دوخة", arabicWrongs: ["تعب","مرض","ضعف"], russianHint: "В последнее время у меня кружится голова, будто комната плывет.", russianParts: ["В последнее время у меня кружится",", будто все плывет."], russianAnswer: "голова", russianWrongs: ["спина","нога","рука"] },
      { parts: ["I need to drop off this","at the pharmacy."], hint: "پێویستە ئەم ڕەچەتەیە ببەمە دەرمانخانەکە.", answer: "prescription", wrongs: ["paper","medicine","note"], arabicHint: "احتاج اودي هاي الراجيتة للصيدلية.", arabicParts: ["احتاج اودي هاي","للصيدلية."], arabicAnswer: "الراجيتة", arabicWrongs: ["الورقة","الدوا","الملاحظة"], russianHint: "Мне нужно отнести этот рецепт в аптеку.", russianParts: ["Мне нужно отнести этот","в аптеку."], russianAnswer: "рецепт", russianWrongs: ["билет","чек","документ"] },
    ],
    conversations: [
      {
        situation: "تەلەفۆن بۆ نۆرینگەی پزیشک دەکەیت",
        theyAsk: "City Clinic, how can I help you?",
        correct: "Hi, I'm not feeling well and I've had a sore throat for days. I'd like to make an appointment, please.",
        wrong1: "Hi, I'd like to schedule a doctor's appointment.",
        wrong2: "I've had a sore throat and don't feel well.",
        wrong3: "Do you have any appointments available today?",
        explanation: "'I'd like to make an appointment' باشترین شێوازە. لە ئینگلیزیدا وشەی 'appointment' بەکاردێت بۆ دانانی کات لای پزیشک، نەک 'meeting' یان 'time'",
        situationAr: "تخابر عيادة الدكتور",
        explanationAr: "'I'd like to make an appointment' هي احسن طريقة. بالانكليزي، تستخدم كلمة 'appointment' حتى تحجز موعد يم الدكتور، مو 'meeting' ولا 'time'.",
        theyAskAr: "عيادة المدينة، تفضل شلون اكدر اساعدك؟",
        correctAr: "مرحبا، مدا احس نفسي زين وبلاعيمي توجعني صارلها ايام. اريد احجز موعد بلا زحمة.",
        wrong1Ar: "مرحبا، اريد اسوي موعد يم الدكتور.",
        wrong2Ar: "بلاعيمي توجعني وما احس نفسي زين.",
        wrong3Ar: "عدكم اي موعد متوفر اليوم؟",
        situationRu: "Звонок в регистратуру поликлиники",
        theyAskRu: "Городская клиника, чем могу помочь?",
        correctRu: "Здравствуйте, я плохо себя чувствую, уже несколько дней болит горло. Я хотел бы записаться на прием к врачу.",
        wrong1Ru: "Здравствуйте, я хочу назначить визит к доктору.",
        wrong2Ru: "У меня болит горло и я плохо себя чувствую.",
        wrong3Ru: "У вас есть свободное время на сегодня?",
        explanationRu: "«I'd like to make an appointment» — идеальная формулировка. В английском для записи к врачу используется именно «appointment», а не «meeting» или «time»."
      },
    ],
  },

  // Lesson 6: Emotions & Empathy
  {
    topic: "Emotions & Empathy", topicKu: "هەستەکان و هاوسۆزی", topicAr: "التعبير عن المشاعر والمواساة", topicRu: "Эмоции и поддержка",
    words: [
      { english: "I'm absolutely thrilled", kurdish: "زۆر زۆر دڵخۆشم / بەپەرۆشم", arabic: "اني كلش فرحان / كلش متحمس", russian: "Я в полном восторге" },
      { english: "I'm so sorry to hear that", kurdish: "زۆر خەفەتم خوارد کە ئەوەم بیست", arabic: "كلش انقهرت من سمعت هيج", russian: "Мне так жаль это слышать" },
      { english: "It's so frustrating", kurdish: "ئەمە زۆر بێزارکەرە (کاتێک شتێک بە دڵی تۆ ناڕوات)", arabic: "هذا الشي كلش يقهر / يضوج", russian: "Это так досадно / раздражает" },
      { english: "That's such a relief", kurdish: "ئەوە جێگەی دڵنەواییە (سووکنایی)", arabic: "هذا الشي يريح الكلب / ارتاحيت", russian: "Какое облегчение!" },
      { english: "I can't believe it", kurdish: "بڕوا ناکەم (لە سەرسووڕماندا)", arabic: "مدا اصدك (متفاجئ)", russian: "Поверить не могу!" },
    ],
    voices: [
      { prompt: "دڵخۆشییەکی زۆر دەرببڕە", target: "I'm absolutely thrilled about the new job!", targetKurdish: "زۆر زۆر دڵخۆشم بە کارە نوێیەکە!", promptAr: "عبر عن فرحة چبيرة", targetArabic: "اني كلش فرحان بالشغل الجديد!", promptRu: "Вырази бурную радость", targetRussian: "Я в полном восторге от новой работы!" },
      { prompt: "هاوسۆزی بۆ هەواڵێکی ناخۆش", target: "I'm so sorry to hear that you've been unwell.", targetKurdish: "زۆر خەفەتم خوارد کە بیستم نەخۆش بوویت.", promptAr: "واسي شخص على خبر محلو", targetArabic: "كلش انقهرت من سمعت بيك جنت مريض.", promptRu: "Вырази сочувствие заболевшему", targetRussian: "Мне так жаль слышать, что ты приболел." },
    ],
    sentences: [
      { english: ["That's","such","a","relief","to","know"], kurdish: "ئەوە جێگەی دڵنەواییە کە ئەوە دەزانم", arabic: "ارتاحيت من عرفت بهالشي", russian: "Какое облегчение это узнать!" },
      { english: ["It's","so","frustrating","when","things","go","wrong"], kurdish: "زۆر بێزارکەرە کاتێک شتەکان هەڵە دەبن", arabic: "الوضع كلش يضوج من تتعقد الامور", russian: "Так досадно, когда всё идет не по плану" },
    ],
    fillBlanks: [
      { parts: ["I'm absolutely","to be joining your team!"], hint: "زۆر زۆر دڵخۆشم کە پەیوەندی بە تیمەکەتانەوە دەکەم!", answer: "thrilled", wrongs: ["happy","glad","good"], arabicHint: "اني كلش متحمس انضم لفريقكم!", arabicParts: ["اني كلش","انضم لفريقكم!"], arabicAnswer: "متحمس", arabicWrongs: ["فرحان","مسرور","زين"], russianHint: "Я в полном восторге от того, что присоединяюсь к вашей команде!", russianParts: ["Я в полном","от того, что присоединяюсь к вашей команде!"], russianAnswer: "восторге", russianWrongs: ["шоке","страхе","ужасе"] },
      { parts: ["That's such a","— I thought I lost my wallet."], hint: "ئەوە جێگەی سووکناییە — پێم وابوو جزدانەکەم ون کردووە.", answer: "relief", wrongs: ["good thing","luck","break"], arabicHint: "كلش ارتاحيت — عبالي ضيعت محفظتي.", arabicParts: ["كلش","— عبالي ضيعت محفظتي."], arabicAnswer: "ارتاحيت", arabicWrongs: ["شي زين","حظ","راحة"], russianHint: "Какое облегчение — я думал, что потерял кошелек.", russianParts: ["Какое","— я думал, что потерял кошелек."], russianAnswer: "облегчение", russianWrongs: ["счастье","горе","веселье"] },
    ],
    conversations: [
      {
        situation: "هاوڕێیەکەت پێت دەڵێت کە تاقیکردنەوەیەکی قورسی دەرچووە",
        theyAsk: "I finally passed my driving test! I was so stressed.",
        correct: "That's such a relief! I'm absolutely thrilled for you.",
        wrong1: "That's great news—congratulations!",
        wrong2: "I'm really happy for you.",
        wrong3: "You must be so relieved.",
        explanation: "'That's such a relief' و 'absolutely thrilled' کاردانەوەی زۆر سروشتی و بەهێزن لە ئینگلیزیدا لەبری تەنها وتنێکی سادەی 'I am happy'",
        situationAr: "صديقك يكلك انه نجح بامتحان صعب",
        explanationAr: "'That's such a relief' و 'absolutely thrilled' هي ردود فعل طبيعية وكلش قوية بالانكليزي بدال ما تكول بس 'I am happy'.",
        theyAskAr: "بالاخير نجحت بامتحان السياقة! جنت كلش متوتر.",
        correctAr: "الحمد لله ارتاحيت! اني كلش فرحان ومتحمس علمودك.",
        wrong1Ar: "هاي خوش اخبار—الف مبروك!",
        wrong2Ar: "اني كلش فرحان الك.",
        wrong3Ar: "اكيد هسة كلش ارتاحيت.",
        situationRu: "Друг делится радостью, что сдал сложный экзамен",
        theyAskRu: "Я наконец-то сдал на права! Я так сильно переживал.",
        correctRu: "Какое облегчение! Я просто в полном восторге за тебя!",
        wrong1Ru: "Отличные новости — мои поздравления!",
        wrong2Ru: "Я действительно рад за тебя.",
        wrong3Ru: "Ты, наверное, почувствовал такое облегчение.",
        explanationRu: "Фразы «That's such a relief» и «absolutely thrilled» звучат живо и выражают искреннюю поддержку, гораздо ярче простого «I am happy»."
      },
    ],
  },

  // Lesson 7: Airport & Flights
  {
    topic: "Airport & Flights", topicKu: "فڕۆکەخانە و گەشتەکان", topicAr: "المطار والطيارات", topicRu: "Аэропорт и перелеты",
    words: [
      { english: "Where is the check-in desk", kurdish: "مێزی پشکنین (چێک ئین) لە کوێیە؟", arabic: "وين مكتب الجيك ان (تسجيل الدخول)؟", russian: "Где стойка регистрации?" },
      { english: "Boarding pass", kurdish: "بلیت یان کارتی سواربوون", arabic: "البوردنك (بطاقة الطيارة)", russian: "Посадочный талон" },
      { english: "Any luggage to check", kurdish: "هیچ جانتایەکت هەیە بیدەیتە بار؟", arabic: "عندك جنط تريد تشحنها؟", russian: "Багаж для сдачи" },
      { english: "Gate number", kurdish: "ژمارەی دەروازە", arabic: "رقم البوابة", russian: "Номер выхода на посадку (гейта)" },
      { english: "Carry-on bag", kurdish: "جانتای دەست (کە دەچێتە ناو فڕۆکە)", arabic: "جنطة ايد (اللي تصعدها وياك للطيارة)", russian: "Ручная кладь" },
    ],
    voices: [
      { prompt: "پرسین لە مێزی پشکنین", target: "Excuse me, where is the check-in desk for this flight?", targetKurdish: "ببوورە، مێزی پشکنین بۆ ئەم گەشتە لە کوێیە؟", promptAr: "تسأل عن مكتب الجيك ان", targetArabic: "بلا زحمة، وين مكتب الجيك ان لهالرحلة؟", promptRu: "Спроси, где стойка регистрации", targetRussian: "Извините, подскажите, где стойка регистрации на этот рейс?" },
      { prompt: "پێدانی پاسپۆرت لە فڕۆکەخانە", target: "Here is my passport and ticket.", targetKurdish: "فەرموو ئەمە پاسپۆرت و بلیتەکەمە.", promptAr: "تنطي جوازك بالمطار", targetArabic: "تفضل، هذا جوازي وتذكرتي.", promptRu: "Предъяви документы", targetRussian: "Вот мой паспорт и билет." },
    ],
    sentences: [
      { english: ["Do","you","have","any","luggage","to","check","in"], kurdish: "هیچ جانتایەکت هەیە بۆ پشکنین (بار)؟", arabic: "عندك اي جنط تريد تشحنها؟", russian: "У вас есть багаж для сдачи?" },
      { english: ["Your","flight","leaves","from","gate","number","five"], kurdish: "گەشتەکەت لە دەروازەی ژمارە پێنجەوە دەفڕێت", arabic: "رحلتك تطلع من البوابة رقم خمسة.", russian: "Ваш рейс отправляется от выхода номер пять" },
    ],
    fillBlanks: [
      { parts: ["Here is my","pass and passport."], hint: "فەرموو ئەمە کارتی سواربوون و پاسپۆرتەکەمە.", answer: "boarding", wrongs: ["flying","plane","ticket"], arabicHint: "تفضل هذا البوردنك وجوازي.", arabicParts: ["تفضل","وجوازي."], arabicAnswer: "البوردنك", arabicWrongs: ["الطيران","الطيارة","التذكرة"], russianHint: "Вот мой посадочный талон и паспорт.", russianParts: ["Вот мой посадочный","и паспорт."], russianAnswer: "талон", russianWrongs: ["билет","номер","документ"] },
      { parts: ["Is this your only","bag?"], hint: "ئایا ئەمە تەنها جانتای دەستتە؟", answer: "carry-on", wrongs: ["hand","small","flight"], arabicHint: "هاي جنطة ايدك الوحيدة؟", arabicParts: ["هاي","الوحيدة؟"], arabicAnswer: "جنطة ايدك", arabicWrongs: ["جنطة صغيرة","جنطة طيران","جنطة"], russianHint: "Это ваша единственная ручная кладь?", russianParts: ["Это ваша единственная","кладь?"], russianAnswer: "ручная", russianWrongs: ["тяжелая","лишняя","дорожная"] },
    ],
    conversations: [
      {
        situation: "لە مێزی پشکنین (Check-in) لە فڕۆکەخانە",
        theyAsk: "Can I see your passport and ticket, please? Are you checking any bags?",
        correct: "Here is my passport. Yes, I have one suitcase to check in, and this is my carry-on.",
        wrong1: "Of course. I have one large bag and one small bag.",
        wrong2: "Here's my passport. I'd like to check this suitcase.",
        wrong3: "Yes, I'm checking one bag today.",
        explanation: "وشەکانی 'suitcase', 'check in', و 'carry-on' وشەی بنەڕەتی و دروستن بۆ مامەڵەکردن لە فڕۆکەخانە",
        situationAr: "بمكتب الجيك ان بالمطار",
        explanationAr: "كلمات 'suitcase', 'check in', و 'carry-on' هي كلمات اساسية وكلش مهمة حتى تتعامل بيها بالمطار.",
        theyAskAr: "ممكن اشوف جوازك وتذكرتك بلا زحمة؟ عندك اي جنط تريد تشحنها؟",
        correctAr: "تفضل هذا جوازي. اي، عندي جنطة وحدة للشحن، وهاي جنطة ايد اخذها وياي.",
        wrong1Ar: "اكيد. عندي جنطة جبيرة وجنطة صغيرة.",
        wrong2Ar: "هذا جوازي. اريد اشحن هاي الجنطة.",
        wrong3Ar: "اي، اريد اشحن جنطة وحدة اليوم.",
        situationRu: "На стойке регистрации в аэропорту",
        theyAskRu: "Пожалуйста, ваш паспорт и билет. Будете сдавать багаж?",
        correctRu: "Вот мой паспорт. Да, у меня один чемодан в багаж, а это ручная кладь.",
        wrong1Ru: "Конечно. У меня одна большая сумка и одна маленькая.",
        wrong2Ru: "Вот паспорт. Я хочу сдать этот чемодан.",
        wrong3Ru: "Да, я сдаю сегодня одну сумку.",
        explanationRu: "Термины «check in» (сдавать в багаж) и «carry-on» (ручная кладь) — международный стандарт для общения в аэропорту."
      },
    ],
  },

  // Lesson 8: Hotel Check-in
  {
    topic: "Hotel Check-in", topicKu: "وەرگرتنی ژوور لە هۆتێل", topicAr: "تسجيل الدخول بالفندق", topicRu: "Заселение в отель",
    words: [
      { english: "I have a reservation", kurdish: "حجزێکم هەیە", arabic: "عندي حجز", russian: "У меня бронь" },
      { english: "Under the name", kurdish: "بە ناوی...", arabic: "باسم...", russian: "На имя..." },
      { english: "Is breakfast included", kurdish: "ئایا نانی بەیانی لەگەڵدایە؟", arabic: "الريوك مشمول؟", russian: "Завтрак включен?" },
      { english: "What time is check-out", kurdish: "کاتی جێهێشتنی ژوور کەییە؟", arabic: "شوكت وقت الجيك اوت (الخروج)؟", russian: "Во сколько выезд (чек-аут)?" },
      { english: "Room key", kurdish: "کلیلی ژوور", arabic: "مفتاح الغرفة", russian: "Ключ от номера" },
    ],
    voices: [
      { prompt: "پێدانی زانیاری حجزکردن", target: "I have a reservation for three nights under the name Ali.", targetKurdish: "حجزێکم هەیە بۆ سێ شەو بە ناوی عەلی.", promptAr: "تنطي معلومات حجزك", targetArabic: "عندي حجز لثلاث ليالي باسم علي.", promptRu: "Назови бронь на ресепшене", targetRussian: "У меня забронирован номер на три ночи на имя Али." },
      { prompt: "پرسین لە کاتی جێهێشتن", target: "What time is check-out tomorrow morning?", targetKurdish: "سبەی بەیانی کاتی جێهێشتنی ژوور (چێک ئاوت) کەییە؟", promptAr: "تسأل عن وقت تسجيل الخروج (الجيك اوت)", targetArabic: "شوكت وقت الجيك اوت باجر الصبح؟", promptRu: "Уточни время выезда", targetRussian: "Подскажите, во сколько выезд завтра утром?" },
    ],
    sentences: [
      { english: ["Is","breakfast","included","in","the","room","price"], kurdish: "ئایا نانی بەیانی لە نرخی ژوورەکەدا هەژمار کراوە؟", arabic: "الريوك مشمول بسعر الغرفة؟", russian: "Включен ли завтрак в стоимость номера?" },
      { english: ["Could","I","get","a","wake-up","call","at","seven"], kurdish: "دەکرێت کاتژمێر حەوت تەلەفۆنم بۆ بکەن بۆ لەخەوهەستان؟", arabic: "تكدرون تخابروني وتكعدوني بسبعة؟", russian: "Не могли бы вы разбудить меня звонком в семь утра?" },
    ],
    fillBlanks: [
      { parts: ["I have a","for two nights."], hint: "حجزێکم هەیە بۆ دوو شەو.", answer: "reservation", wrongs: ["booking","room","place"], arabicHint: "عندي حجز لليلتين.", arabicParts: ["عندي","لليلتين."], arabicAnswer: "حجز", arabicWrongs: ["حجز مسبق","غرفة","مكان"], russianHint: "У меня бронь на две ночи.", russianParts: ["У меня","на две ночи."], russianAnswer: "бронь", russianWrongs: ["оплата","номер","ключ"] },
      { parts: ["Is breakfast","?"], hint: "ئایا نانی بەیانی لەگەڵدایە؟", answer: "included", wrongs: ["with","there","free"], arabicHint: "الريوك مشمول؟", arabicParts: ["الريوك","؟"], arabicAnswer: "مشمول", arabicWrongs: ["وية","هناك","بلاش"], russianHint: "Завтрак включен в стоимость?", russianParts: ["Завтрак","в стоимость?"], russianAnswer: "включен", russianWrongs: ["подан","готов","оплачен"] },
    ],
    conversations: [
      {
        situation: "گەیشتن بە هۆتێل و وەرگرتنی ژوور",
        theyAsk: "Welcome to the Grand Hotel. How can I help you?",
        correct: "Hello, I have a reservation for three nights under the name Ahmed. Is breakfast included?",
        wrong1: "Hi, I booked a room for three nights.",
        wrong2: "Hello, I'm here to check in.",
        wrong3: "I have a reservation under Ahmed.",
        explanation: "'I have a reservation under the name...' ڕستەیەکی زۆر ستاندارد و فەرمییە بۆ وەرگرتنی ژووری هۆتێل",
        situationAr: "توصل للفندق وتسجل دخول (جيك ان)",
        explanationAr: "'I have a reservation under the name...' جملة كلش ستاندر ورسمية حتى تسجل دخول بالفندق.",
        theyAskAr: "أهلاً بك في فندق كراند اوتيل. شلون اكدر اساعدك؟",
        correctAr: "مرحبا، عندي حجز لثلاث ليالي باسم احمد. الريوك مشمول؟",
        wrong1Ar: "مرحبا، حجزت غرفة لثلاث ليالي.",
        wrong2Ar: "مرحبا، اني هنا حتى اسوي جيك ان (تسجيل دخول).",
        wrong3Ar: "عندي حجز باسم احمد.",
        situationRu: "Прибытие в отель и регистрация",
        theyAskRu: "Добро пожаловать в отель «Гранд». Чем могу помочь?",
        correctRu: "Здравствуйте, у меня бронь на три ночи на имя Ахмед. Завтрак включен в стоимость?",
        wrong1Ru: "Привет, я забронировал комнату на три ночи.",
        wrong2Ru: "Здравствуйте, я пришел заселиться.",
        wrong3Ru: "У меня бронь на Ахмеда.",
        explanationRu: "«I have a reservation under the name...» — общепринятая стандартная вежливая фраза при заселении в отель."
      },
    ],
  },

  // Lesson 9: Supermarket & Groceries
  {
    topic: "Supermarket & Groceries", topicKu: "بازاڕکردن لە سوپەرمارکێت", topicAr: "السوبر ماركت والمسواك", topicRu: "Поход за продуктами",
    words: [
      { english: "Shopping cart", kurdish: "عەرەبانەی بازاڕکردن", arabic: "عربانة التسوق", russian: "Тележка для покупок" },
      { english: "Aisle", kurdish: "ڕاڕەو (لەنێوان ڕەفەکاندا)", arabic: "ممر (بين الرفوف)", russian: "Ряд / отдел в магазине" },
      { english: "On sale", kurdish: "داشکاندنی بۆ کراوە", arabic: "عليه تنزيلات / خصم", russian: "На скидке / по акции" },
      { english: "Self-checkout", kurdish: "ئامێری خۆ-حسابکردن", arabic: "الدفع الذاتي / تحاسب بنفسك", russian: "Касса самообслуживания" },
      { english: "Paper or plastic", kurdish: "کیسی کاغەز یان پلاستیک؟", arabic: "علاكة ورقية لو نايلون؟", russian: "Бумажный или пластиковый пакет" },
    ],
    voices: [
      { prompt: "پرسیارکردن لە شوێنی شتێک", target: "Excuse me, which aisle is the milk in?", targetKurdish: "ببوورە، شیر لە کام ڕاڕەودایە؟", promptAr: "تسأل على مكان شي", targetArabic: "بلا زحمة، بيا ممر الكى الحليب؟", promptRu: "Спроси, где находится отдел с молоком", targetRussian: "Извините, в каком ряду находится молоко?" },
      { prompt: "پرسیارکردن لە نرخ", target: "Is this item on sale? I saw a sign outside.", targetKurdish: "ئایا داشکاندن بۆ ئەمە کراوە؟ لە دەرەوە تابلۆیەکم بینی.", promptAr: "تسأل على السعر", targetArabic: "هذا عليه تنزيلات؟ شفت قطعة برة.", promptRu: "Уточни про скидку", targetRussian: "Этот товар со скидкой? Я видел вывеску на входе." },
    ],
    sentences: [
      { english: ["Could","you","tell","me","where","the","baking","aisle","is"], kurdish: "دەتوانیت پێم بڵێیت ڕاڕەوی کەلوپەلی هەویرکاری لە کوێیە؟", arabic: "تكدر تكلي وين ممر الخبز بلا زحمة؟", russian: "Не подскажете, где находится отдел для выпечки?" },
      { english: ["I","will","use","the","self-checkout","to","save","time"], kurdish: "ئامێری خۆ-حسابکردن بەکاردەهێنم بۆ ئەوەی کات بگەڕێنمەوە", arabic: "راح استخدم الدفع الذاتي حتى اختصر الوقت.", russian: "Я воспользуюсь кассой самообслуживания, чтобы сэкономить время" },
    ],
    fillBlanks: [
      { parts: ["Excuse me, which","is the bread in?"], hint: "ببوورە، نان لە کام ڕاڕەودایە؟", answer: "aisle", wrongs: ["hall","path","line"], arabicHint: "بلا زحمة، بيا ممر الكى الخبز؟", arabicParts: ["بلا زحمة، بيا","الكى الخبز؟"], arabicAnswer: "ممر", arabicWrongs: ["قاعة","طريق","خط"], russianHint: "Извините, в каком ряду лежит хлеб?", russianParts: ["Извините, в каком","лежит хлеб?"], russianAnswer: "ряду", russianWrongs: ["отделе","магазине","пакете"] },
      { parts: ["I need a shopping","because I'm buying a lot."], hint: "پێویستم بە عەرەبانەیەکی بازاڕکردنە چونکە شتی زۆر دەکڕم.", answer: "cart", wrongs: ["bag","box","car"], arabicHint: "احتاج عربانة تسوق لان راح اشتري هواية.", arabicParts: ["احتاج","تسوق لان راح اشتري هواية."], arabicAnswer: "عربانة", arabicWrongs: ["جنطة","صندوق","سيارة"], russianHint: "Мне нужна тележка для покупок, так как я покупаю много всего.", russianParts: ["Мне нужна","для покупок, так как я беру много всего."], russianAnswer: "тележка", russianWrongs: ["корзина","сумка","касса"] },
    ],
    conversations: [
      {
        situation: "لە سوپەرمارکێت بەدوای شتێکدا دەگەڕێیت",
        theyAsk: "Do you need help finding anything?",
        correct: "Yes, please. Which aisle is the milk in? Also, are these apples on sale?",
        wrong1: "Yes, I'm looking for the milk.",
        wrong2: "Could you show me where the dairy section is?",
        wrong3: "Are these apples discounted today?",
        explanation: "وشەی 'aisle' (ڕاڕەو) زۆر گرنگە لە سوپەرمارکێتدا و پیتی (s) تێیدا ناخوێندرێتەوە",
        situationAr: "تدور على شي بالسوبر ماركت",
        explanationAr: "كلمة 'aisle' (ممر) كلش مهمة بالسوبر ماركت وحرف (s) بيها ما ينلفظ.",
        theyAskAr: "تحتاج مساعدة حتى تندل اي شي؟",
        correctAr: "اي رجاءً. بيا ممر الكى الحليب؟ وهمين، هذا التفاح عليه تنزيلات؟",
        wrong1Ar: "اي، ادور على الحليب.",
        wrong2Ar: "تكدر تدليني وين قسم منتجات الالبان؟",
        wrong3Ar: "هذا التفاح عليه خصم اليوم؟",
        situationRu: "Ищешь нужные продукты в супермаркете",
        theyAskRu: "Вам помочь что-нибудь найти?",
        correctRu: "Да, пожалуйста. В каком ряду молоко? И еще, эти яблоки сейчас на скидке?",
        wrong1Ru: "Да, я ищу молоко.",
        wrong2Ru: "Не могли бы вы показать мне молочный отдел?",
        wrong3Ru: "На эти яблоки сегодня есть скидка?",
        explanationRu: "Слово «aisle» (ряд между полками) произносится без звука «s» [айл] и незаменимо для навигации в больших супермаркетах."
      },
    ],
  },

];

export default normalUnit01;
