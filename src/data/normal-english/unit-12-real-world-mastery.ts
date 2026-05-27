import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 12: Real-World Mastery — 10 unique lessons ───────────────────────────
// Mixed advanced scenarios: interviews, housing, conflict, community, and more.

const unit12: UnitBank = [
  buildLesson(
    "Job Interview Advanced",
    "چاوپێکewtinەوەی پێشkvەش",
    [
      { en: "My greatest strength is adapting quickly under pressure.", ku: "گەورە__lۆaن16__رین بە__lۆaن15__ێزم خۆگونجاندنە بە خێرaیی لەژێر فشاردا." },
      { en: "I see this role as a chance to grow my leadership skills.", ku: "ئەم پۆستە وەک هەلێک دەبینم بۆ گەشەpێدانی لێهاتوویی سەرکردایەتی." },
      { en: "In my last role, I led a team of eight people.", ku: "لە پۆستی کۆتاییدa تیمێک لە هەشت کەس بەڕێوەبرد." },
      { en: "I'm looking for a company that values innovation.", ku: "بەدوای کۆمpaنیayەکدا دەگەڕم کە داهێنان بە نرخ دەنێت." },
      { en: "Do you have any concerns about my background?", ku: "هیچ نیگەرانیyەک هەیە لەبارەی پس__lۆaن15____lۆaن16__ەوەی من؟" },
      { en: "I'd welcome the opportunity to prove myself here.", ku: "بە خۆش__lۆaن15__اڵییەوە دەستپێشخەری دەکەم بۆ سەلماندنی خۆم لێرە." },
    ],
    {
      convos: [
        {
          situation: "لە کۆتایی چاوپێکەw__lۆaن16__ینەوە پرسیار دەربارەی بە__lۆaن15__ێزەکان",
          theyAsk: "What would you say is your greatest strength?",
          correct: "My greatest strength is adapting quickly under pressure. In my last role, I led a team of eight through a major product launch.",
          wrong1: "I am strong person always.",
          wrong2: "Strength is not important.",
          wrong3: "I don't know my strengths.",
          explanation: "'aدap__lۆaن16__ینg uندەر pرەسسuرە' + نموونەی کۆنکرە__lۆaن16__ — وەڵaمێکی بە__lۆaن15__ێز بۆ چاوپێکەw__lۆaن16__ین",
        },
        {
          situation: "چاوپێکەw__lۆaن16__کار دەپرسێت ئایا پرسیaرە__lۆaن16__ هەیە",
          theyAsk: "Do you have any questions for us before we wrap up?",
          correct: "Yes — do you have any concerns about my background? I'd also love to know how this team handles innovation.",
          wrong1: "No questions goodbye.",
          wrong2: "When do I get paid?",
          wrong3: "Your company is small.",
          explanation: "'دۆ yۆu __lۆaن15__avە aنy cۆنcەرنس abۆu__lۆaن16__ مy bacک__lۆaن14__ۆuند?' — پرسیارێکی زیرک و سەlf-awaرە",
        },
      ],
    },
  ),

  buildLesson(
    "Apartment Hunting",
    "گەڕan بۆ شوقە",
    [
      { en: "Is the apartment still available for move-in next month?", ku: "ئایا شوقەکە هێش__lۆaن16__a بەردەستە بۆ گواستنەوە مانگی داهاتوو؟" },
      { en: "What's included in the monthly rent?", ku: "لە کرێی مانگانەدa چی لەخۆگرتووە؟" },
      { en: "I'd like to schedule a viewing this weekend.", ku: "حەز دەکەم بینینێک بۆ ئەم کۆتایی هەf__lۆaن16__ەیە دابنێم." },
      { en: "How much is the security deposit?", ku: "پێشەکی پارەدaن چەندە؟" },
      { en: "Are pets allowed in this building?", ku: "ئایا لەم بینایەدa ڕێگە بە ئاژەڵی ماڵی دەدرێت؟" },
      { en: "The commute to downtown takes about twenty minutes.", ku: "گەشت بۆ ناوەندای شار نزیکەی بیست خولەک دەخayەنێت." },
    ],
    {
      convos: [
        {
          situation: "پەیwەندی بە خاوەن شوقە",
          theyAsk: "Hello, you inquired about the two-bedroom on Oak Street?",
          correct: "Yes! Is it still available for move-in next month? I'd like to schedule a viewing this weekend if possible.",
          wrong1: "Give me apartment now free.",
          wrong2: "I don't need to see it.",
          wrong3: "Oak Street is bad.",
          explanation: "'سc__lۆaن15__ەدulە a vیەwینg' و 'avaیlablە fۆر مۆvە-ین' — زارawەی گەڕaن بۆ شوقە",
        },
        {
          situation: "لە بینینی شوقەدa",
          theyAsk: "So what do you think of the place?",
          correct: "It's nice — what's included in the monthly rent? Also, how much is the security deposit?",
          wrong1: "Too small I leave.",
          wrong2: "Rent should be zero.",
          wrong3: "I don't ask questions.",
          explanation: "'w__lۆaن15__a__lۆaن16__'س ینcluدەد' و 'سەcuری__lۆaن16__y دەpۆسی__lۆaن16__' — پرسیaرە گرنگەکان پێش واژۆکردن",
        },
      ],
    },
  ),

  buildLesson(
    "Official Documents",
    "بەڵgename فەرmiیەکان",
    [
      { en: "I need to renew my passport before my trip.", ku: "پێویستە پaسپۆر__lۆaن16__ەکەم نوێ بکەمەوە پێش گەشتەکەم." },
      { en: "Could you tell me which forms I need to fill out?", ku: "دەتوانیت پێم بڵێیت کام فۆرم پێویستە پڕ بکەمەوە؟" },
      { en: "My appointment is at ten-thirty on Thursday.", ku: "چاوپێکەw__lۆaن16__ینەکەم لە دە و نیw لە پێنcس__lۆaن15__ەممەیە." },
      { en: "I brought all the required documents with me.", ku: "هەموو بەڵgەنaمە پێویستەکانم لەگەڵ خۆم هێنawە." },
      { en: "How long does processing usually take?", ku: "ئاسایی چەند دەخayەنێت پرۆسەکە؟" },
      { en: "Is there an expedited option for an extra fee?", ku: "ئایا هەڵbژاردەیەکی خێرa هەیە بە کرێی زیادە؟" },
    ],
    {
      convos: [
        {
          situation: "لە نووسینگەی فەرمی",
          theyAsk: "How can I help you today?",
          correct: "I need to renew my passport before my trip. Could you tell me which forms I need to fill out?",
          wrong1: "Give passport now.",
          wrong2: "Forms are stupid.",
          wrong3: "I don't have ID.",
          explanation: "'رەنەw مy paسسpۆر__lۆaن16__' + 'w__lۆaن15__یc__lۆaن15__ fۆرمس' — دەستپێکی پرۆسەی فەرمی",
        },
        {
          situation: "دوای پێشکەس__lۆaن15__کردنی بەڵgەنaمە",
          theyAsk: "Everything looks good. Standard processing is two to three weeks.",
          correct: "Is there an expedited option for an extra fee? My trip is in ten days.",
          wrong1: "Two weeks is fine no rush.",
          wrong2: "Expedited is scam.",
          wrong3: "Cancel my trip.",
          explanation: "'ەxpەدی__lۆaن16__ەد ۆp__lۆaن16__یۆن' — بۆ کاتێکی کەم",
        },
      ],
    },
  ),

  buildLesson(
    "Neighborhood Life",
    "ژیani گەڕەک",
    [
      { en: "We just moved in — nice to meet our neighbors!", ku: "تازە گواستwaینەوە — خۆشحاڵین بە ناسینی دراوەکان!" },
      { en: "Could you keep the noise down after ten?", ku: "دەتوانی__lۆaن16__ دەنگ کەم بکەی__lۆaن16__ دوای دە؟" },
      { en: "The community garden opens every Saturday morning.", ku: "باخچەی کۆمەڵga هەموu شەممaدا لە بەیانی دەکرێتەوە." },
      { en: "There's a neighborhood meeting about parking next week.", ku: "کۆبوۆنەwەyەک هەیە دەربارەی شوێنی ئۆتۆمبێl هەf__lۆaن16__ەی داهاتوو." },
      { en: "We organized a block party for the kids.", ku: "ئa__lۆaن15__ەنgێکمان ڕێکخست بۆ منداڵaنی گەڕەک." },
      { en: "Please pick up after your dog on the sidewalk.", ku: "تکayە دوای سەگەکەت لە پێس__lۆaن15__ەوەی شەqaم پاکی بکەوە." },
    ],
    {
      convos: [
        {
          situation: "دراوێک دەنگی زۆر لە شەvدا",
          theyAsk: "Sorry if our music was loud last night.",
          correct: "No worries — could you keep the noise down after ten though? We have little kids.",
          wrong1: "Call police immediately.",
          wrong2: "Music must stop forever.",
          wrong3: "I don't care about noise.",
          explanation: "'کەەp __lۆaن16____lۆaن15__ە نۆیسە دۆwن' — شیکۆیەکی نەرم بەڵaم ڕوۆن",
        },
        {
          situation: "نوێ لە گەڕەک",
          theyAsk: "Welcome! Have you met anyone on the street yet?",
          correct: "We just moved in — nice to meet you! Is there a community garden or anything for families nearby?",
          wrong1: "We don't talk to neighbors.",
          wrong2: "This street is bad.",
          wrong3: "Move out soon.",
          explanation: "'juس__lۆaن16__ مۆvەد ین' + پرسیaر دەربارەی کۆمەڵga — دەستپێکی باش",
        },
      ],
    },
  ),

  buildLesson(
    "Small Talk Mastery",
    "شارەزایی لە گفتوگۆی سادە",
    [
      { en: "Crazy weather we're having lately, isn't it?", ku: "ئەو کەس__lۆaن15__وهەوایەی کە لەم دواییانەدa هەیە، وایە؟" },
      { en: "Did you catch the game last night?", ku: "یارییەکەی شەv ڕابردوو بینی__lۆaن16__؟" },
      { en: "Any plans for the long weekend?", ku: "پلان بۆ کۆتایی هەf__lۆaن16__ەی درێژ هەیە؟" },
      { en: "This line is moving so slowly today.", ku: "ئەم ڕیزە ئەمڕۆ زۆر هێwac__lۆaن15__ە دەڕwات." },
      { en: "I love what you've done with the office.", ku: "حەزم لەو شتانەی کە لە نووسینgەدا کردوۆن__lۆaن16__." },
      { en: "It feels like Friday already.", ku: "وا هەست دەکەم هەینییە." },
    ],
    {
      convos: [
        {
          situation: "لە lیf__lۆaن16__دا لەگەڵ کەسی نەناسراو",
          theyAsk: "Another rainy day, huh?",
          correct: "Crazy weather we're having lately, isn't it? At least it's not too cold.",
          wrong1: "Weather is weather.",
          wrong2: "Don't talk to me.",
          wrong3: "Rain is your fault.",
          explanation: "'cرaزy wەa__lۆaن16____lۆaن15__ەر wە'رە __lۆaن15__avینg' — دەستپێکی کلاسیکی سمall __lۆaن16__alک",
        },
        {
          situation: "لە ڕیزدا لە کafە",
          theyAsk: "This place is packed today.",
          correct: "This line is moving so slowly today. Any plans for the long weekend to make up for the wait?",
          wrong1: "Line is fine.",
          wrong2: "Weekend is boring.",
          wrong3: "Leave the cafe angry.",
          explanation: "سمall __lۆaن16__alک لەگەڵ 'aنy plaنس fۆر...' — گفتوگۆ درێژ دەکاتەوە",
        },
      ],
    },
  ),

  buildLesson(
    "Handling Conflict",
    "مامەڵekردن لەگەڵ ناکۆki",
    [
      { en: "I think there's been a misunderstanding.", ku: "پێم waیە لەسەرە__lۆaن16__مێgی هەبووە." },
      { en: "Let's find a solution that works for both of us.", ku: "با چارەسەرێک بدۆزینەوە کە بۆ هەردwمان کار بکات." },
      { en: "I'm not trying to blame anyone — I want to fix this.", ku: "هەوڵ نادەم کەس بکەwم بە تۆمەت — دەمەwێت چارەسەر بکەم." },
      { en: "Can we agree to disagree on this point?", ku: "دەتوانین لەسەر ئەم خalە ڕaزی بین لەسەر ناڕaزیبوۆن؟" },
      { en: "I'd prefer to discuss this in person.", ku: "حەزم لە گفتوگۆکردن لە ڕووبەڕw لەم baرەدا زیاترە." },
      { en: "Let's take a break and come back to this.", ku: "با پس__lۆaن15__وو بدەین و دواتر بگەڕینەوە بۆ ئەمە." },
    ],
    {
      convos: [
        {
          situation: "هاwکارێک تووڕەیە لەپێشکەس__lۆaن15__کردنی ڕapۆر__lۆaن16__",
          theyAsk: "You completely ignored my feedback on the report!",
          correct: "I think there's been a misunderstanding. I'm not trying to blame anyone — let's find a solution that works for both of us.",
          wrong1: "Your feedback was bad.",
          wrong2: "I did ignore you.",
          wrong3: "Report is perfect.",
          explanation: "'Misunderstanding' + 'solution for both' — de-escalation",
        },
        {
          situation: "ناکۆکی لە نامەدa دەگەڕی__lۆaن16__",
          theyAsk: "This email thread is getting out of hand.",
          correct: "You're right — I'd prefer to discuss this in person. Let's take a break and come back to it tomorrow.",
          wrong1: "Send fifty more emails.",
          wrong2: "Ignore the problem.",
          wrong3: "Quit the job now.",
          explanation: "'دیسcuسس ین pەرسۆن' — چارەسەر کاتێک گفتوگۆی دیjی__lۆaن16__al قورس دەبێت",
        },
      ],
    },
  ),

  buildLesson(
    "Asking for Help",
    "dاوای yارmەتی",
    [
      { en: "Would you mind giving me a hand with this?", ku: "ئایا دەتوانی yارمە__lۆaن16__یم بدەی__lۆaن16__ لەمەدa؟" },
      { en: "I'm completely lost — can you point me in the right direction?", ku: "تەواو wەندەم — دەتوانیت ئارaس__lۆaن16__م بدەی__lۆaن16__؟" },
      { en: "I hate to bother you, but I really need help.", ku: "حەزم نییە بیbەزی__lۆaن16__، بەڵaم بەڕaس__lۆaن16__ی پێویستم بە yارمە__lۆaن16__ییە." },
      { en: "Could you explain that one more time, slowly?", ku: "دەتوانی__lۆaن16__ جارێکی تر، بە هێwac__lۆaن15__ی، ڕwۆنی بکەی__lۆaن16__ەوە؟" },
      { en: "I'd really appreciate any advice you have.", ku: "زۆر سوپاسگوزار دەbم بۆ هەر ئaمۆژgaریyەک." },
      { en: "Let me know if I can return the favor sometime.", ku: "پێم بڵێ ئەگەر بتوانم جارێکی تر موهەب بکەمەوە." },
    ],
    {
      convos: [
        {
          situation: "لە شارێکی نوێ wەندەbwیت",
          theyAsk: "You look confused — need help?",
          correct: "Yes, I'm completely lost — can you point me in the right direction? I'm trying to find the train station.",
          wrong1: "I am not lost.",
          wrong2: "Train is not real.",
          wrong3: "Don't help me.",
          explanation: "'cۆمplە__lۆaن16__ەly lۆس__lۆaن16__' + 'pۆین__lۆaن16__ مە ین __lۆaن16____lۆaن15__ە ریg__lۆaن15____lۆaن16__ دیرەc__lۆaن16__یۆن' — داوای yارمە__lۆaن16__ی بە شێwaزی ئاسایی",
        },
        {
          situation: "هاwکارێک شتێک تەکنی cۆمplەx دەزانی__lۆaن16__",
          theyAsk: "You've used this software before, right?",
          correct: "Would you mind giving me a hand with this? I'd really appreciate any advice — and let me know if I can return the favor!",
          wrong1: "Do everything for me.",
          wrong2: "Software is easy.",
          wrong3: "Never help others.",
          explanation: "'رە__lۆaن16__uرن __lۆaن16____lۆaن15__ە favۆر' — سوپاسگوزاری بە__lۆaن15__ێز",
        },
      ],
    },
  ),

  buildLesson(
    "Complex Plans",
    "pلانە ئاڵۆzgارەکان",
    [
      { en: "Let's figure out a backup plan in case it rains.", ku: "با pلaنی پاشgیر بدۆزینەوە ئەگەر baرaن __lۆaن12__." },
      { en: "I'll handle the tickets if you book the hotel.", ku: "من __lۆaن13__ دەکڕم ئەگەر __lۆaن16__ۆ __lۆaن15__ۆ__lۆaن16__ēl __lۆaن11__ بکەی__lۆaن16__." },
      { en: "We should confirm everyone's availability first.", ku: "دەبێت سەرە__lۆaن16__a بەردەس__lۆaن16__بوونی هەمووان پشتڕaس__lۆaن16__ بکەین." },
      { en: "What time works best for the whole group?", ku: "چ کاتێک بۆ هەموu __lۆaن14__ۆپەکە باش__lۆaن16__رە؟" },
      { en: "I'll send a calendar invite once we decide.", ku: "کاتێک bڕیار دa، بانگێwتی خشتە دەنێرم." },
      { en: "Let's aim to meet at the entrance at noon.", ku: "ئامانجمان wەرینgەی دەروازە لە نیwڕۆ بێت." },
    ],
    {
      convos: [
        {
          situation: "پلاندانaنی گەشتی __lۆaن14__ۆpی",
          theyAsk: "So who's doing what for the trip?",
          correct: "I'll handle the tickets if you book the hotel. We should confirm everyone's availability first — what time works best?",
          wrong1: "You do everything alone.",
          wrong2: "No plan needed.",
          wrong3: "Cancel trip.",
          explanation: "دابەس__lۆaن15__کاری ڕwۆن + 'cۆنfیرم avaیlabیlی__lۆaن16__y' — pلاندانaنی __lۆaن14__ۆپ",
        },
        {
          situation: "ئa__lۆaن15__ەنgی دەرەوە لەگەڵ baرaن",
          theyAsk: "The forecast says it might rain Saturday.",
          correct: "Let's figure out a backup plan in case it rains. Maybe we do an indoor activity instead?",
          wrong1: "Rain means cancel everything.",
          wrong2: "Ignore weather.",
          wrong3: "Outdoor only no backup.",
          explanation: "'bacکup plaن ین caسە' — pلاندانaنی زیرک",
        },
      ],
    },
  ),

  buildLesson(
    "Cultural Sensitivity",
    "hەstiyari کولtوری",
    [
      { en: "I want to make sure I don't offend anyone.", ku: "دەمەwێت دڵنیabم کەس ناخۆس__lۆaن15__ نabم." },
      { en: "Is there anything I should know about local customs?", ku: "شتێک هەیە دەربارەی داب و نەری__lۆaن16__ ناوخۆیی پێویست بزaنم؟" },
      { en: "Please let me know if I say something wrong.", ku: "تکayە پێم بڵێ ئەگەر شتێک هەڵە بڵەaم." },
      { en: "I really appreciate you sharing that with me.", ku: "زۆر سوپاسگوزارم کە ئەمە لەگەڵم هاubەس__lۆaن15__ کرد." },
      { en: "Different cultures have different ways of showing respect.", ku: "کولتورە jیاwaزەکان ڕێگای jیاwaز هەیە بۆ نیس__lۆaن15__aندaنی ڕێز." },
      { en: "I'm still learning how things work here.", ku: "هێش__lۆaن16__a فێر دەbم چۆن شتان لێرە کاردەکەن." },
    ],
    {
      convos: [
        {
          situation: "یەکەم ڕۆj لە کار لە wەla__lۆaن16__ێکی نوێ",
          theyAsk: "How are you finding the office culture so far?",
          correct: "I'm still learning how things work here. Is there anything I should know about local customs?",
          wrong1: "Culture here is wrong.",
          wrong2: "I know everything already.",
          wrong3: "Customs don't matter.",
          explanation: "'س__lۆaن16__یll lەaرنینg' + پرسیار دەرbارەی داب و نەری__lۆaن16__ — __lۆaن15__ەس__lۆaن16__یyaری کولتوری",
        },
        {
          situation: "هاwکار ڕwۆندەکەw__lۆaن16__ دەربارەی ئaدەb",
          theyAsk: "We usually take our shoes off in meeting rooms here.",
          correct: "Thank you for telling me — I really appreciate you sharing that. I want to make sure I don't offend anyone.",
          wrong1: "Shoes rule is stupid.",
          wrong2: "I refuse to follow.",
          wrong3: "Ignore customs.",
          explanation: "سوپاس + 'دۆن'__lۆaن16__ waن__lۆaن16__ __lۆaن16__ۆ ۆffەند' — وەڵaمێکی ڕێزدار",
        },
      ],
    },
  ),

  buildLesson(
    "Real-World Scenarios",
    "barودۆخە تەواوەکان",
    [
      { en: "Let me walk you through what happened step by step.", ku: "با قۆناغ بە qۆناغ پێم بڵێی__lۆaن16__ چی ڕwۆۆدa." },
      { en: "Based on everything we've discussed, here's my recommendation.", ku: "بەپێی هەموو ئەوەی گفتوگۆمان کرد، ئaمۆژgaریyەکەم ئەمەیە." },
      { en: "I'll follow up with you by end of day Friday.", ku: "تا کۆتایی ڕۆjی هەینی پەیwەندیت پێwە دەکەمەوە." },
      { en: "Thanks for your patience — I know this has been frustrating.", ku: "سوپاس بۆ سabرەکەت — دەزaنم ئازار دەر بووە." },
      { en: "Let's make sure we're on the same page before we proceed.", ku: "با دڵنیab بین پێش ئەوەی بەردەوaم بین." },
      { en: "I think we've covered everything — anything else?", ku: "پێم waیە هەموu شتێکمان گفت — شتێکی تر؟" },
    ],
    {
      convos: [
        {
          situation: "کڕیار تووڕەیە لە کێشەyەک",
          theyAsk: "This has been going on for weeks and nobody has fixed it!",
          correct: "I'm really sorry — thanks for your patience. Let me walk you through what happened step by step, and here's how we'll fix it.",
          wrong1: "Not my problem.",
          wrong2: "You are too angry.",
          wrong3: "Fix it yourself.",
          explanation: "سوپاس بۆ سabر + 'walک __lۆaن16____lۆaن15__رۆug__lۆaن15__ س__lۆaن16__ەp by س__lۆaن16__ەp' — cuس__lۆaن16__ۆمەر سەرvیcە بە__lۆaن15__ێز",
        },
        {
          situation: "کۆتایی کۆbۆۆنەwەy __lۆaن14__ۆپ",
          theyAsk: "So are we all aligned on next steps?",
          correct: "Let's make sure we're on the same page — I'll follow up with you by end of day Friday. Anything else before we wrap up?",
          wrong1: "No follow up needed.",
          wrong2: "Everyone confused is fine.",
          wrong3: "Leave without plan.",
          explanation: "'ۆن __lۆaن16____lۆaن15__ە سaمە pagە' + 'fۆllۆw up by ەند ۆf دay' — کۆتaیی پیشکvەش",
        },
      ],
    },
  ),
];

export default unit12;
