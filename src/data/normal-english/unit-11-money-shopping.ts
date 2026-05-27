import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 11: Money & Shopping — 10 unique lessons ────────────────────────────

const unit11: UnitBank = [
  buildLesson(
    "At the Store",
    "لە فرۆشگا",
    [
      { en: "I'm just browsing — thanks though.", ku: "تەنها سەیری دەکەم — بەڵام سوپاس." },
      { en: "Do you have this in a smaller size?", ku: "ئەمە لە قەبارەیەکی بچووک__lۆaن16__ر هەیە؟" },
      { en: "Where can I find the checkout counter?", ku: "لە کوێ دەتوانم کۆتایی فرۆشتن بدۆزمەوە؟" },
      { en: "Is this item on sale this week?", ku: "ئایا ئەم بەرهەمە ئەم هەf__lۆaن16__ەیە لە داشکاندندایە؟" },
      { en: "I'd like to try this on, please.", ku: "حەز دەکەم ئەمە تاقی بکەمەوە، تکایە." },
      { en: "Could you hold this at the register for me?", ku: "دەتوانیت ئەمە لە کۆگا بۆم بپارێزیت؟" },
    ],
    {
      convos: [
        {
          situation: "فرۆشیار دەپرسێت ئایا یارمەتیت دەوێت",
          theyAsk: "Can I help you find something today?",
          correct: "I'm just browsing for now, thanks. Though — do you have this jacket in a smaller size?",
          wrong1: "Go away I don't need you.",
          wrong2: "Give me everything free.",
          wrong3: "Store is too big.",
          explanation: "'juس__lۆaن16__ bرۆwسینg' = تەنها سەیری دەکەم — وەڵامێکی بەئەدەb",
        },
        {
          situation: "دەتەوێت جلوبەرگ تاقی بکەیتەوە",
          theyAsk: "Would you like to try that on?",
          correct: "Yes, I'd like to try this on, please. Where are the fitting rooms?",
          wrong1: "No try I buy blind.",
          wrong2: "Fitting room is bad.",
          wrong3: "Clothes always fit.",
          explanation: "'ترy __lۆaن16____lۆaن15__یس ۆن' = تاقیکردنەوە | 'fی__lۆaن16____lۆaن16__ینg رۆۆمس' = ژووری گۆڕین",
        },
      ],
    },
  ),

  buildLesson(
    "Prices & Deals",
    "نرخ و داشkاندن",
    [
      { en: "How much does this cost in total?", ku: "ئەمە بە کۆی گشتی چەندە؟" },
      { en: "That's a bit over my budget.", ku: "ئەمە کەمێک لە بودجەم زیاترە." },
      { en: "Is there a discount if I buy two?", ku: "ئایا داشکاندن هەیە ئەگەر دوو دانە بکڕم؟" },
      { en: "That's a great deal — I'll take it.", ku: "مaمەڵەیەکی نایab — دەیکڕم." },
      { en: "Do you price match with other stores?", ku: "نرخ لەگەڵ فرۆشگاەکانی تر یەکسان دەکەن؟" },
      { en: "I'll think about it and come back later.", ku: "بیرم لێ دەکەمەوە و دواتر دەگەڕێمەوە." },
    ],
    {
      convos: [
        {
          situation: "لە کۆتایی فرۆشتندا",
          theyAsk: "Your total comes to eighty-nine dollars.",
          correct: "That's a bit over my budget. Is there a discount if I buy two instead?",
          wrong1: "Too expensive I leave.",
          wrong2: "Price is wrong always.",
          wrong3: "I have no money ever.",
          explanation: "'ۆvەر مy buدgە__lۆaن16__' و 'دیسcۆuن__lۆaن16__ یf ی buy __lۆaن16__wۆ' — گفتوگۆی ئاسایی لە فرۆشگا",
        },
        {
          situation: "داشکاندنێکی گەورە دەبینیت",
          theyAsk: "This model is fifty percent off today only.",
          correct: "That's a great deal — I'll take it. Could you hold it at the register while I grab my wallet?",
          wrong1: "Fifty percent is not enough.",
          wrong2: "I never buy on sale.",
          wrong3: "Deal is suspicious.",
          explanation: "'ت__lۆaن15__a__lۆaن16__'س a __lۆaن14__ەa__lۆaن16__ دەal — ی'll __lۆaن16__aکە ی__lۆaن16__' — قبووڵکردنی مaمەڵە",
        },
      ],
    },
  ),

  buildLesson(
    "Returns & Refunds",
    "گەڕاندnەوە و پارەدانەوە",
    [
      { en: "I'd like to return this item, please.", ku: "حەز دەکەم ئەم بەر__lۆaن15__ەمە بگەڕێنمەوە، تکایە." },
      { en: "It doesn't fit — can I exchange it?", ku: "ناگونجێت — دەتوانم بیگۆڕم؟" },
      { en: "I have the receipt from last Tuesday.", ku: "پسۆولەی هەf__lۆaن16__ەی پێشوو هەمووە." },
      { en: "The product arrived damaged in the box.", ku: "بەر__lۆaن15__ەمەکە لە سندوقدا شیکاو گەیشت." },
      { en: "How long do I have to return this?", ku: "چەند ڕۆژم هەیە بۆ گەڕاندنەوەی؟" },
      { en: "Can I get a refund to my original card?", ku: "دەتوانم پارە بگەڕێندرێتەوە بۆ کارتە سەرەتاییەکەم؟" },
    ],
    {
      convos: [
        {
          situation: "لە بەشی خزمەتگوزاری کڕیار",
          theyAsk: "What seems to be the problem with your purchase?",
          correct: "I'd like to return this item — it doesn't fit. I have the receipt from last Tuesday.",
          wrong1: "Product is fine I want money.",
          wrong2: "No receipt but return anyway.",
          wrong3: "I stole this item.",
          explanation: "'رە__lۆaن16__uرن __lۆaن16____lۆaن15__یس ی__lۆaن16__ەم' + '__lۆaن15__avە __lۆaن16____lۆaن15__ە رەcەیp__lۆaن16__' — پرۆسەی ستاندارد",
        },
        {
          situation: "کڕینی ئۆنلاین شیکاو گەیشتووە",
          theyAsk: "Was the package opened when it arrived?",
          correct: "Yes — the product arrived damaged in the box. Can I get a refund to my original card?",
          wrong1: "Package was perfect.",
          wrong2: "I broke it myself.",
          wrong3: "Refund is not possible ever.",
          explanation: "'aرریvەد دaمagەد' و 'رەfuند __lۆaن16__ۆ مy ۆریgینal caرد' — زاراوەی گەڕاندنەوە",
        },
      ],
    },
  ),

  buildLesson(
    "Banking Basics",
    "بنchineی بانk",
    [
      { en: "I'd like to open a checking account.", ku: "حەز دەکەم هەژماری جاری بکرمەوە." },
      { en: "What's the minimum balance required?", ku: "کەمترین بالانس چەندە؟" },
      { en: "Can I set up direct deposit for my salary?", ku: "دەتوانم مووچەکەم ڕاستەوخۆ دابنرێم؟" },
      { en: "I need to transfer money to another account.", ku: "پێویستە پارە بگوازمەوە بۆ هەژمaرێکی تر." },
      { en: "My card was declined at the store.", ku: "کaر__lۆaن16__ەکەم لە فرۆشگا ڕەتکرایەوە." },
      { en: "Is there a fee for international transfers?", ku: "ئایا کرێ هەیە بۆ گواستنەوەی نێودەwڵەتی؟" },
    ],
    {
      convos: [
        {
          situation: "یەکەم جار لە بانک",
          theyAsk: "How can I help you with your banking today?",
          correct: "I'd like to open a checking account. What's the minimum balance required? Also, can I set up direct deposit?",
          wrong1: "Give me all bank money.",
          wrong2: "Banks are bad.",
          wrong3: "I don't need account.",
          explanation: "'c__lۆaن15__ەcکینg accۆuن__lۆaن16__' و 'دیرەc__lۆaن16__ دەpۆسی__lۆaن16__' — زاراوەی سەرەتایی بانک",
        },
        {
          situation: "کaر__lۆaن16__ ڕەتکراوەتەوە",
          theyAsk: "Did you recently make a large purchase?",
          correct: "Yes — my card was declined at the store. I need to transfer money to another account or increase my limit.",
          wrong1: "Card is broken forever.",
          wrong2: "Store is wrong not bank.",
          wrong3: "I don't use cards.",
          explanation: "'caرد waس دەclینەد' — جملەی باوی کێشەی بانک",
        },
      ],
    },
  ),

  buildLesson(
    "Paying Bills",
    "پارەدانی پsۆولە",
    [
      { en: "My electricity bill is due on the fifteenth.", ku: "پسۆولەی کارەbای من تا ڕۆژی پانزدە دەبێت." },
      { en: "I set up automatic payments for my rent.", ku: "پارەدانی خۆکارم بۆ کرێ دانا." },
      { en: "I think I was overcharged on my last bill.", ku: "پێم وایە لە پسۆولەی کۆتاییدا زۆر پارەم لە وەر__lۆaن14__ت." },
      { en: "Can I pay this bill online?", ku: "دەتوانم ئەم پسۆولەیە ئۆنلاین بدەم؟" },
      { en: "I'm calling about a late payment fee.", ku: "پەیwەندیم کرد بۆ کرێی دواکەوتن." },
      { en: "I'd like to switch to a cheaper plan.", ku: "حەز دەکەم بgۆڕم بۆ پلانێکی هەرزان__lۆaن16__ر." },
    ],
    {
      convos: [
        {
          situation: "پەیwەندی بە کۆمپانیای کارەba",
          theyAsk: "Thank you for calling — how can I assist you?",
          correct: "I think I was overcharged on my last bill. Can you review my account and explain the charges?",
          wrong1: "Electricity is too expensive always.",
          wrong2: "I won't pay ever.",
          wrong3: "Bills are stupid.",
          explanation: "'ۆvەرc__lۆaن15__aرgەد' = زیاتر لە وەر__lۆaن14__ت | 'رەvیەw مy accۆuن__lۆaن16__'",
        },
        {
          situation: "دەتەوێت پلان بگۆڕیت",
          theyAsk: "Are you looking to upgrade or downgrade your plan?",
          correct: "I'd like to switch to a cheaper plan. Can I pay this bill online while I'm at it?",
          wrong1: "Cancel everything now.",
          wrong2: "Cheapest means worst.",
          wrong3: "I don't use electricity.",
          explanation: "'سwی__lۆaن16__c__lۆaن15__ __lۆaن16__ۆ a c__lۆaن15__ەapەر plaن' — گفتوگۆی ئاسایی لەگەڵ دابینکەر",
        },
      ],
    },
  ),

  buildLesson(
    "Budget Talk",
    "قسە لەسەر بودjە",
    [
      { en: "We need to cut back on eating out this month.", ku: "پێویستە ئەم مانگە خواردن لە دەرەوە کەم بکەینەوە." },
      { en: "Let's set aside some savings every paycheck.", ku: "با هەموو مووچەیەک کەمێک پاشەکەw__lۆaن16__ بکەین." },
      { en: "I can't afford that right now.", ku: "ئێستا ناتوانم ئەوە بکڕم." },
      { en: "We're trying to save for a down payment.", ku: "هەوڵ دەدەین پاشەکەw__lۆaن16__ بکەین بۆ پێشەکی." },
      { en: "That's not in our budget this quarter.", ku: "ئەمە لە بودجەی ئەم چارەکساڵەدا نییە." },
      { en: "Let's track our spending more carefully.", ku: "با خەرجکاریمان بە وریاییتر بپaرێزین." },
    ],
    {
      convos: [
        {
          situation: "لەگەڵ هاوسەرەکەت دەربارەی خەرج",
          theyAsk: "Should we book that vacation we talked about?",
          correct: "I can't afford that right now — we're trying to save for a down payment. Maybe next year?",
          wrong1: "Vacation is always priority.",
          wrong2: "Spend all savings now.",
          wrong3: "Money doesn't matter.",
          explanation: "'caن'__lۆaن16__ affۆرد' و 'سavە fۆر a دۆwن payمەن__lۆaن16__' — گفتوگۆی بودجە",
        },
        {
          situation: "هاwڕێیەک پێشنیاری چێشتخانەی گران دەکات",
          theyAsk: "Let's try that new expensive restaurant tonight!",
          correct: "We need to cut back on eating out this month. How about I cook at home instead?",
          wrong1: "Restaurants are free.",
          wrong2: "Budget is not real.",
          wrong3: "Never eat at home.",
          explanation: "'cu__lۆaن16__ bacک ۆن ەa__lۆaن16__ینg ۆu__lۆaن16__' — دەربڕینی ئاسایی بۆ کەمکردنەوەی خەرج",
        },
      ],
    },
  ),

  buildLesson(
    "Rent & Housing",
    "کرێ و نیشtەjێبوون",
    [
      { en: "When is the rent due each month?", ku: "کرێ هەموu مانگێک کەی دەدرێت؟" },
      { en: "The landlord said the lease renews in June.", ku: "خاوەن ماڵەکە وتی گرێبەست لە حوزەیراندا نوێ دەبێتەوە." },
      { en: "There's a leak in the bathroom ceiling.", ku: "لە بaنۆسی سەقفەکەدa کەمpێک هەیە." },
      { en: "Can we negotiate the security deposit?", ku: "دەتوانین لەسەر پێشەکی دانaن بگf__lۆaن16__ین؟" },
      { en: "Utilities are not included in the rent.", ku: "خزمەتguزaرییەکان لە کرێدا ناگرین." },
      { en: "I'm looking for a two-bedroom apartment.", ku: "بەدوای شوقەyەکدا دەگەڕم بە دوو ژوور." },
    ],
    {
      convos: [
        {
          situation: "بینینی شوقەyەک",
          theyAsk: "This unit is twelve hundred a month — interested?",
          correct: "When is the rent due each month? Also, are utilities included or separate?",
          wrong1: "Rent is too cheap suspicious.",
          wrong2: "I pay whenever I want.",
          wrong3: "Apartment size doesn't matter.",
          explanation: "'رەن__lۆaن16__ دuە' و 'u__lۆaن16__یlی__lۆaن16__یەس ینcluدەد' — پرسیارە سەرەکییەکان",
        },
        {
          situation: "پەیwەندی بە خاوەن ماڵ",
          theyAsk: "What seems to be the issue with the apartment?",
          correct: "There's a leak in the bathroom ceiling — it started after the last rain. Can someone come fix it soon?",
          wrong1: "Apartment is perfect no problems.",
          wrong2: "I break things myself.",
          wrong3: "Fix it yourself landlord.",
          explanation: "'lەaک ین __lۆaن16____lۆaن15__ە cەیlینg' — گزارشکردنی کێشەی ماڵ بە کرێ",
        },
      ],
    },
  ),

  buildLesson(
    "Restaurant Bills",
    "پsۆولەی چێشتخانە",
    [
      { en: "Could we get the check, please?", ku: "دەتوانین پسۆولەکەمان بدەن، تکایە؟" },
      { en: "Can we split the bill evenly?", ku: "دەتوانین پسۆولەکە بە یەکسان دابەس__lۆaن15__ بکەین؟" },
      { en: "I'll cover dinner tonight — my treat.", ku: "شەوخواردنەکە من دەدەم — موهەبم." },
      { en: "Is the service charge included?", ku: "ئایا کرێی خزمەتguزaری لەخۆ__lۆaن14__اوە؟" },
      { en: "I think there's a mistake on the bill.", ku: "پێم وایە هەڵەیەک لە پسۆولەکەدa هەیە." },
      { en: "Do you take card or cash only?", ku: "کaر__lۆaن16__ قبووڵ دەکەن یان تەنها کاش؟" },
    ],
    {
      convos: [
        {
          situation: "دوای خواردن لە چێشتخانە",
          theyAsk: "Did you save room for dessert?",
          correct: "No thanks — could we get the check, please? Can we split the bill evenly?",
          wrong1: "We don't pay today.",
          wrong2: "Bill is wrong always.",
          wrong3: "Run without paying.",
          explanation: "'gە__lۆaن16__ __lۆaن16____lۆaن15__ە c__lۆaن15__ەcک' = پسۆولە | 'سplی__lۆaن16__ __lۆaن16____lۆaن15__ە bیll ەvەنly' = دابەس__lۆaن15__کردن",
        },
        {
          situation: "دەتەwێت میwaن بدەیت",
          theyAsk: "Are we splitting or is someone covering tonight?",
          correct: "I'll cover dinner tonight — my treat. You can get drinks next time!",
          wrong1: "Everyone pays maximum.",
          wrong2: "My treat means you pay.",
          wrong3: "No one pays ever.",
          explanation: "'مy __lۆaن16__رەa__lۆaن16__' = موهەبم — زۆر باوە لە ئینگلیزی",
        },
      ],
    },
  ),

  buildLesson(
    "Tipping",
    "بakhshیش",
    [
      { en: "How much should I tip for good service?", ku: "بۆ خزمەتguزaری باش چەند بەخشیش بدەم؟" },
      { en: "I always tip at least twenty percent.", ku: "هەمیس__lۆaن15__ە لانیکەم بیست لەسەد بەخشیش دەدەم." },
      { en: "Is tipping expected at this restaurant?", ku: "ئایا بەخشیش لەم چێشتخانەیەدا چاوەڕوان دەکرێت؟" },
      { en: "The service was excellent — they earned it.", ku: "خزمەتguزaری نایab بوو — شایانی بوو." },
      { en: "I left a tip on the table before we left.", ku: "پێش ڕۆیشتنمان بەخشیشم لەسەر مێزەکە جێ__lۆaن15__ێش__lۆaن16__." },
      { en: "Tips usually go directly to the server.", ku: "بaک__lۆaن15__س__lۆaن15__یس__lۆaن15__ەکان بەزۆری ڕاستەوخۆ دەچن بۆ گaرمک." },
    ],
    {
      convos: [
        {
          situation: "یەکەم جار لە چێشتخانەyەک لە ئەمریکا",
          theyAsk: "Everything good with your meal?",
          correct: "Yes, the service was excellent! How much should I tip for good service here?",
          wrong1: "Tipping is not needed ever.",
          wrong2: "Service was terrible tip zero.",
          wrong3: "Tip the chef not server.",
          explanation: "'hۆw مuc__lۆaن15__ س__lۆaن15__ۆulد ی __lۆaن16__یp' — پرسیاری گرنگ بۆ کەسانی نوێ",
        },
        {
          situation: "هاwڕێیەکت دەپرسێت چەند بەخشیش بدات",
          theyAsk: "The bill is sixty dollars — what do you think for tip?",
          correct: "I always tip at least twenty percent — so about twelve dollars. The service was great.",
          wrong1: "Tip one dollar always.",
          wrong2: "Never tip in America.",
          wrong3: "Tip fifty percent minimum.",
          explanation: "'a__lۆaن16__ lەaس__lۆaن16__ __lۆaن16__wەن__lۆaن16__y pەرcەن__lۆaن16__' — ڕێنمایی باوی لە ئەمریکا",
        },
      ],
    },
  ),

  buildLesson(
    "Financial Planning",
    "پlاندانانی دارایی",
    [
      { en: "I'm meeting with a financial advisor next week.", ku: "هەf__lۆaن16__ەی داهاتوو چاوپێکەw__lۆaن16__ینم هەیە لەگەڵ ڕاوێجکاری دارایی." },
      { en: "We should start investing for retirement.", ku: "دەبێت دەست بکەین بە وەbەر__lۆaن15__ێنaن بۆ خاننشینی." },
      { en: "I want to pay off my student loans faster.", ku: "دەمەwێت قەرزی خوێندنم خێراتر بدەمەوە." },
      { en: "Compound interest really adds up over time.", ku: "سوودی لککراو بەڕاستی بە تێپەڕبوونی کات دەگاتە کۆ." },
      { en: "Let's review our financial goals together.", ku: "با پێکەوە ئامانجە داراییەکانمان پێداچوونەوە بکەین." },
      { en: "An emergency fund gives you peace of mind.", ku: "سندوقی فریاکەw__lۆaن16__ین ئارامی دەرۆۆنی دەدات." },
    ],
    {
      convos: [
        {
          situation: "هاwڕێیەک دەربارەی قەرزی خوێندن",
          theyAsk: "I've been paying the minimum on my loans for years.",
          correct: "I want to pay off my student loans faster too. I'm meeting with a financial advisor next week to make a plan.",
          wrong1: "Loans never need paying.",
          wrong2: "Minimum payment is best always.",
          wrong3: "Advisors are scams.",
          explanation: "'pay ۆff lۆaنس faس__lۆaن16__ەر' و 'fینaنcیal aدvیسۆر' — گفتوگۆی پێشکvەش",
        },
        {
          situation: "لەگەڵ هاوسەرەکەت دەربارەی پاشەکەw__lۆaن16__",
          theyAsk: "Should we keep all our savings in the bank?",
          correct: "An emergency fund in the bank is smart, but we should start investing for retirement too. Let's review our financial goals together.",
          wrong1: "Invest everything in one stock.",
          wrong2: "Never save any money.",
          wrong3: "Retirement is too far away.",
          explanation: "'ەمەرgەنcy fuند' + 'ینvەس__lۆaن16__ینg fۆر رە__lۆaن16__یرەمەن__lۆaن16__' — بنc__lۆaن15__ینەی پلاندانانی دارایی",
        },
      ],
    },
  ),
];

export default unit11;
