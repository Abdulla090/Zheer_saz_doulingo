import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 10: Health & Emergencies — 10 unique lessons ────────────────────────
// Medical symptoms, doctors, pharmacy, insurance, and emergency situations.

const unit10: UnitBank = [
  buildLesson(
    "Describing Symptoms",
    "وەسفکردنی نیشانەکان",
    [
      { en: "I've had a headache since this morning.", ku: "لە بەیانییەوە سەرئێشەم هەیە." },
      { en: "My throat hurts when I swallow.", ku: "کاتێک قوت دەدەم، گەرووم ئازارم دەدات." },
      { en: "I feel dizzy whenever I stand up.", ku: "هەر کاتێک هەڵدەستمەوە سەرپێ، سەرم گێژ دەخوات." },
      { en: "I've been coughing a lot for three days.", ku: "سێ ڕۆژە زۆر کۆکەم هەیە." },
      { en: "I think I might have a fever.", ku: "پێم وایە لەوانەیە تایەکم هەبێت." },
      { en: "The pain comes and goes in waves.", ku: "ئازارەکە بە شەپۆل دێت و دەڕوات." },
    ],
    {
      convos: [
        {
          situation: "پزیشک دەپرسێت چی هەیە و چیت لێ هاتووە",
          theyAsk: "What brings you in today?",
          correct: "I've had a headache since this morning, and I feel dizzy whenever I stand up. I think I might have a fever too.",
          wrong1: "I am sick very much.",
          wrong2: "Head is bad.",
          wrong3: "Don't know anything.",
          explanation: "وەسفکردنی نیشانەکان بە کات ('since this morning') و شێواز ('whenever I stand up') زۆر گرنگە بۆ پزیشک",
        },
        {
          situation: "هاوڕێیەکت دەپرسێت بۆچی نەهاتیت بۆ پۆل",
          theyAsk: "You missed class — are you okay?",
          correct: "Not really — my throat hurts when I swallow, and I've been coughing a lot for three days.",
          wrong1: "Class is boring.",
          wrong2: "I am lazy today.",
          wrong3: "No problem at all.",
          explanation: "'My throat hurts when I swallow' — وەسفکردنێکی زۆر دروست و باوە بۆ نیشانەکانی سەرما",
        },
      ],
    },
  ),

  buildLesson(
    "At the Doctor",
    "لەلای پزیشک",
    [
      { en: "How long have you had these symptoms?", ku: "چەندە ئەم نیشانانەت هەیە؟" },
      { en: "I'm allergic to penicillin.", ku: "هەستیاریم (حەساسیەت) بە پەنیلیلین هەیە." },
      { en: "Is this something I should worry about?", ku: "ئایا ئەمە شتێکە کە پێویستە نیگەران بم لێی؟" },
      { en: "I'd like a second opinion if possible.", ku: "ئەگەر بکرێت، حەز دەکەم ڕای دکتۆرێکی تریش وەربگرم (بۆچوونی دووەم)." },
      { en: "When should I come back for a follow-up?", ku: "کەی دەبێت بگەڕێمەوە بۆ پشکنینی دواتر (بەدواداچوون)؟" },
      { en: "Will I need any blood tests?", ku: "ئایا پێویستم بە هیچ پشکنینێکی خوێن دەبێت؟" },
    ],
    {
      convos: [
        {
          situation: "پزیشک پرسیار لە مێژووی تەندروستیت دەکات",
          theyAsk: "Do you have any allergies I should know about?",
          correct: "Yes, I'm allergic to penicillin. Other than that, I'm generally healthy.",
          wrong1: "Allergies are secret.",
          wrong2: "I don't remember.",
          wrong3: "Penicillin is food.",
          explanation: "'I'm allergic to...' — گرنگترین ڕستەیە لە کاتی سەردانی هەر پزیشکێک یان نەخۆشخانەیەک",
        },
        {
          situation: "پزیشک پشکنینی کردوویت بەڵام دەتەوێت دڵنیابیت",
          theyAsk: "The results look normal, but I can run more tests.",
          correct: "Is this something I should worry about? When should I come back for a follow-up?",
          wrong1: "Tests are waste of time.",
          wrong2: "I don't trust doctors.",
          wrong3: "Results are wrong.",
          explanation: "'Follow-up' وشەیەکی پزیشکی باوە بە واتای گەڕانەوە بۆ پشکنینی دواتر تا بزانرێت چاک بوویت یان نا",
        },
      ],
    },
  ),

  buildLesson(
    "At the Pharmacy",
    "لە دەرمانخانە",
    [
      { en: "I'd like to pick up my prescription, please.", ku: "حەز دەکەم ڕەچەتەکەم (دەرمانەکانم) وەربگرم، تکایە." },
      { en: "Do I take this with food or on an empty stomach?", ku: "ئەمە لەگەڵ خواردن بخۆم یان لەسەر گەدەی بەتاڵ؟" },
      { en: "Are there any side effects I should know about?", ku: "ئایا هیچ کاریگەرییەکی لاوەکی هەیە کە پێویستە بیزانم؟" },
      { en: "Can I get something over the counter for this?", ku: "دەتوانم شتێک بەبێ ڕەچەتەی پزیشک بۆ ئەمە وەربگرم؟" },
      { en: "How many times a day should I take it?", ku: "چەند جار لە ڕۆژێکدا دەبێت بیخۆم؟" },
      { en: "I'm looking for something to help me sleep.", ku: "بەدوای شتێکدا دەگەڕێم یارمەتیم بدات بخەوم." },
    ],
    {
      convos: [
        {
          situation: "لە دەرمانخانە دەرمان وەردەگریت",
          theyAsk: "Do you have a prescription with you?",
          correct: "Yes — I'd like to pick up my prescription, please. How many times a day should I take it?",
          wrong1: "Give me any medicine.",
          wrong2: "Prescription is at home.",
          wrong3: "I don't need instructions.",
          explanation: "'Pick up my prescription' — زاراوەی ستانداردە کاتێک دەچیتە دەرمانخانە بۆ وەرگرتنی دەرمانی دکتۆر",
        },
        {
          situation: "بەدوای دەرمانێکدا دەگەڕێیت بەبێ بینینی دکتۆر",
          theyAsk: "What symptoms are you trying to treat?",
          correct: "Can I get something over the counter for a sore throat? Are there any side effects I should know about?",
          wrong1: "Give strongest medicine.",
          wrong2: "I am doctor myself.",
          wrong3: "Medicine for everything.",
          explanation: "'Over the counter' ئاماژەیە بۆ ئەو دەرمانانەی کە بەبێ ڕەچەتەی پزیشک دەفرۆشرێن وەکو حەبی سەرئێشە",
        },
      ],
    },
  ),

  buildLesson(
    "Emergency Room",
    "ژووری فریاکەوتن (ER)",
    [
      { en: "I think I'm having a heart attack.", ku: "پێم وایە تووشی جەڵتەی دڵ بووم." },
      { en: "The pain in my chest is getting worse.", ku: "ئازاری سینگم بەرەو خراپتر دەڕوات." },
      { en: "How long is the wait in the ER?", ku: "چاوەڕوانییەکە لە ژووری فریاکەوتندا چەند دەخایەنێت؟" },
      { en: "I was brought in by ambulance an hour ago.", ku: "کاتژمێرێک لەمەوپێش بە ئەمبولانس هێنرام بۆ ئێرە." },
      { en: "Can my family member stay with me?", ku: "دەتوانێت ئەندامێکی خێزانەکەم لەگەڵم بمێنێتەوە؟" },
      { en: "When will the test results be ready?", ku: "کەی ئەنجامی پشکنینەکان ئامادە دەبن؟" },
    ],
    {
      convos: [
        {
          situation: "لە بەشی فریاکەوتن (هەواڵدان بە حاڵەتی خێرا)",
          theyAsk: "What is your emergency today?",
          correct: "The pain in my chest is getting worse. I think I'm having a heart attack — it started about twenty minutes ago.",
          wrong1: "Chest is little pain.",
          wrong2: "I come for fun.",
          wrong3: "Don't know why I am here.",
          explanation: "لە کاتی باری لەناکاودا، دیاریکردنی جۆری ئازارەکە ('getting worse') و کاتی دەستپێکردنەکەی زۆر گرنگە",
        },
        {
          situation: "چاوەڕوانی ئەنجامی پشکنین دەکەیت",
          theyAsk: "The doctor will be with you shortly.",
          correct: "When will the test results be ready? Can my family member stay with me while I wait?",
          wrong1: "Results don't matter.",
          wrong2: "Send family away.",
          wrong3: "I leave hospital now.",
          explanation: "'Test results' بۆ ئەنجامی خوێن و تیشک بەکاردێت | 'stay with me' بۆ مانەوەی هاوەڵێک",
        },
      ],
    },
  ),

  buildLesson(
    "First Aid & Calling for Help",
    "یارمەتی سەرەتایی و داوای فریاگوزاری",
    [
      { en: "I need an ambulance — someone is unconscious.", ku: "پێویستم بە ئەمبولانسە — کەسێک بێهۆش بووە." },
      { en: "There's been a car accident on Main Street.", ku: "ڕووداوێکی ئۆتۆمبێل (پێکدادان) لە شەقامی سەرەکی ڕوویداوە." },
      { en: "Keep pressure on the wound until it stops bleeding.", ku: "پەستان بخەرە سەر برینەکە تاوەکو خوێنبەربوونەکە دەوەستێت." },
      { en: "Elevate your leg to reduce the swelling.", ku: "قاچت بەرز بکەرەوە بۆ کەمکردنەوەی ئاوسانەکە." },
      { en: "Please hurry — the bleeding won't stop.", ku: "تکایە پەلە بکەن — خوێنبەربوونەکە ناوەستێت." },
      { en: "Try to stay still — help is on the way.", ku: "هەوڵ بدە نەجوڵێیت — یارمەتی لە ڕێگایە." },
    ],
    {
      convos: [
        {
          situation: "پەیوەندی بە ژمارەی فریاگوزاری (٩١١) دەکەیت",
          theyAsk: "911, what's your emergency?",
          correct: "I need an ambulance — someone is unconscious. My address is 42 Oak Lane. Please hurry!",
          wrong1: "Help me please.",
          wrong2: "Something bad happened.",
          wrong3: "I don't know address.",
          explanation: "لە کاتی پەیوەندی فریاگوزاریدا: ناونیشان + جۆری کێشەکە (unconscious) گرنگترین زانیارین",
        },
        {
          situation: "هاوڕێیەک بریندار بووە و خوێنی لێ دەڕوات",
          theyAsk: "I cut my hand pretty badly — there's a lot of blood.",
          correct: "Keep pressure on the wound until it stops bleeding. Let me clean the cut and put a bandage on it.",
          wrong1: "Blood is not problem.",
          wrong2: "Run around quickly.",
          wrong3: "Don't touch wound ever.",
          explanation: "'Keep pressure on the wound' یەکەم هەنگاوی ستانداردە بۆ ڕاگرتنی خوێنبەربوون لە یارمەتییە سەرەتاییەکاندا",
        },
      ],
    },
  ),
];

export default unit10;