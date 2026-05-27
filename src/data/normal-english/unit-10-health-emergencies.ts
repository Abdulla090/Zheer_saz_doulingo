import { buildLesson } from "./build-lesson";
import { UnitBank } from "../types";

// ── Unit 10: Health & Emergencies — 10 unique lessons ────────────────────────

const unit10: UnitBank = [
  buildLesson(
    "Describing Symptoms",
    "وەسفکردنی نیشانەکان",
    [
      { en: "I've had a headache since this morning.", ku: "لە بەیانییەوە سەرئێشەم هەیە." },
      { en: "My throat hurts when I swallow.", ku: "کاتێک قوت دەدەمم، گەرووم ئازار دەدات." },
      { en: "I feel dizzy whenever I stand up.", ku: "هەر کاتێک دەستپێدەکەم، سەرم دەسوڕێت." },
      { en: "I've been coughing a lot for three days.", ku: "سێ ڕۆژە زۆر کۆخم دەکەم." },
      { en: "I think I might have a fever.", ku: "پێم وایە تبم هەیە." },
      { en: "The pain comes and goes in waves.", ku: "ئازارەکە بە شەپۆل دێت و دەچێت." },
    ],
    {
      convos: [
        {
          situation: "پزیشک دەپرسێت چی هەیە",
          theyAsk: "What brings you in today?",
          correct: "I've had a headache since this morning, and I feel dizzy whenever I stand up. I think I might have a fever too.",
          wrong1: "I am sick very much.",
          wrong2: "Head is bad.",
          wrong3: "Don't know anything.",
          explanation: "وەسفکردنی نیشانەکان بە کات ('since this morning') و شێواز ('comes and goes') گرنگە",
        },
        {
          situation: "هاوڕێیەکت دەپرسێت بۆچی نەhat",
          theyAsk: "You missed class — are you okay?",
          correct: "Not really — my throat hurts when I swallow, and I've been coughing a lot for three days.",
          wrong1: "Class is boring.",
          wrong2: "I am lazy today.",
          wrong3: "No problem at all.",
          explanation: "'My throat hurts when I swallow' — وەسفکردنی ئاسایی نیشانەی ئازار",
        },
      ],
    },
  ),

  buildLesson(
    "At the Doctor",
    "لەلای پزیشk",
    [
      { en: "How long have you had these symptoms?", ku: "چەندە ئەم نیشانانەت هەیە؟" },
      { en: "I'm allergic to penicillin.", ku: "هەستیاریم بە penicillin هەیە." },
      { en: "Is this something I should worry about?", ku: "ئایا ئەمە شتێکە کە پێویستە نیگەران بم؟" },
      { en: "I'd like a second opinion if possible.", ku: "ئەگەر بکرێت، حەز دەکەم بیرۆکەیەکی دووەم وەrbگرم." },
      { en: "When should I come back for a follow-up?", ku: "کەی دەبێت بگەڕێمەوە بۆ پشکنینی دواتr؟" },
      { en: "Will I need any blood tests?", ku: "پێویستە هیچ تاقیکردنەوەیەکی خوێن بکرێت؟" },
    ],
    {
      convos: [
        {
          situation: "پzیشk پرsiar لە مێژووی تەندروستی دەکات",
          theyAsk: "Do you have any allergies I should know about?",
          correct: "Yes, I'm allergic to penicillin. Other than that, I'm generally healthy.",
          wrong1: "Allergies are secret.",
          wrong2: "I don't remember.",
          wrong3: "Penicillin is food.",
          explanation: "'I'm allergic to...' — گرنگترین جملەیە لە بینینی پzیشk",
        },
        {
          situation: "دوای پشکنین دەtewێت دڵنیabیت",
          theyAsk: "The results look normal, but I can run more tests.",
          correct: "Is this something I should worry about? When should I come back for a follow-up?",
          wrong1: "Tests are waste of time.",
          wrong2: "I don't trust doctors.",
          wrong3: "Results are wrong.",
          explanation: "'Follow-up' = سەردانی دواتr بۆ پشکنین",
        },
      ],
    },
  ),

  buildLesson(
    "At the Pharmacy",
    "لە دەرmanxانە",
    [
      { en: "I'd like to pick up my prescription, please.", ku: "حەز دەکەم دەرmanەکەم وەrbگرم، تکایە." },
      { en: "Do I take this with food or on an empty stomach?", ku: "ئەمە لەگەڵ خواردن دەخۆm یان لەسەر مەگەڕاو؟" },
      { en: "Are there any side effects I should know about?", ku: "ئایا کاریگەرییە لاوەکییەکان هەن کە پێویستە bizanm؟" },
      { en: "Can I get something over the counter for this?", ku: "دەتوانm شتێk بەبێ ڕsepeta بۆ ئەمە وەrbگرm؟" },
      { en: "How many times a day should I take it?", ku: "چەند جار لە ڕۆژێkda دەbێت bixom؟" },
      { en: "I'm looking for something to help me sleep.", ku: "بەدوای شتێkda دەgەڕm کە yarmەti xewtim bdat." },
    ],
    {
      convos: [
        {
          situation: "لە دەرmanxanە dەرman wەrdەgrit",
          theyAsk: "Do you have a prescription with you?",
          correct: "Yes — I'd like to pick up my prescription, please. How many times a day should I take it?",
          wrong1: "Give me any medicine.",
          wrong2: "Prescription is at home.",
          wrong3: "I don't need instructions.",
          explanation: "'Pick up my prescription' — زارawەی ستاندارد لە دەرmanxanە",
        },
        {
          situation: "dawای dەرmanێk bəbێ ڕsepeta dەکeit",
          theyAsk: "What symptoms are you trying to treat?",
          correct: "Can I get something over the counter for a sore throat? Are there any side effects I should know about?",
          wrong1: "Give strongest medicine.",
          wrong2: "I am doctor myself.",
          wrong3: "Medicine for everything.",
          explanation: "'Over the counter' = دەرman بەبێ ڕsepeta | 'side effects' = کاریگەرییە لاوەکییەکان",
        },
      ],
    },
  ),

  buildLesson(
    "Dental Care",
    "چawdێری ددان",
    [
      { en: "I have a sharp pain in my back molar.", ku: "ئازارێki tizi لە ddani dawam hەیە." },
      { en: "My gums bleed when I brush my teeth.", ku: "kاتێk ddanakanm deshoe، piesti ddanakanm xwen dەرژit." },
      { en: "I think I chipped a tooth eating something hard.", ku: "pێm waiە ddanekm shkand kاتێk shteki qursm xward." },
      { en: "How often should I get a dental cleaning?", ku: "chەnd jar dەbێت pakkrdnewey ddan bkam؟" },
      { en: "I'm really nervous about dental procedures.", ku: "zۆr dlerawkim lə prɔseye ddan." },
      { en: "Does this tooth need to be pulled?", ku: "aiya em ddane piewiste bkişretewe؟" },
    ],
    {
      convos: [
        {
          situation: "lە dktۆri ddan",
          theyAsk: "Where does it hurt when you bite down?",
          correct: "I have a sharp pain in my back molar — especially when I eat something cold.",
          wrong1: "All teeth hurt always.",
          wrong2: "Teeth are fine.",
          wrong3: "Pain is in my foot.",
          explanation: "'Back molar' = ddani dawae | 'sharp pain' = azari tiz",
        },
        {
          situation: "dktۆri ddan pişniari pakkrdnewe dəkat",
          theyAsk: "When was your last cleaning?",
          correct: "It's been over a year. How often should I get a dental cleaning? My gums bleed when I brush.",
          wrong1: "I never brush teeth.",
          wrong2: "Cleaning is not needed.",
          wrong3: "Teeth clean themselves.",
          explanation: "'Dental cleaning' و 'gums bleed' — zarawey asayi chawdiri ddan",
        },
      ],
    },
  ),

  buildLesson(
    "Mental Health",
    "tەndrusti deruni",
    [
      { en: "I've been feeling anxious for no clear reason.", ku: "bəbێ hokareki ron، həst bə dlerawki dəkem." },
      { en: "I'm having trouble sleeping at night.", ku: "kisham həyə lə shewda bxewm." },
      { en: "Work stress has been really getting to me.", ku: "stresi kar bərasti karigəri ləsərm krdwə." },
      { en: "I think talking to someone might help.", ku: "pێm waiə qsekrdn ləgəl kesek yarmeti dədات." },
      { en: "I don't feel like myself lately.", ku: "ləm duaiyanə wa həst nakem xom." },
      { en: "Is it normal to feel this way after a loss?", ku: "aiya asaiyə duai lədەstdan həst bəm shewazə bkam؟" },
    ],
    {
      convos: [
        {
          situation: "pزیشk dəpirset choni",
          theyAsk: "How have you been feeling emotionally lately?",
          correct: "I've been feeling anxious for no clear reason, and I'm having trouble sleeping at night. Work stress has been really getting to me.",
          wrong1: "Emotions are not real.",
          wrong2: "I feel perfect always.",
          wrong3: "Don't want to talk.",
          explanation: "'Getting to me' = karigəri ləsərm dəkat — zarawey asayi",
        },
        {
          situation: "hawre pişniari yarmeti dədات",
          theyAsk: "Have you thought about talking to a counselor?",
          correct: "Actually, yes — I think talking to someone might help. I don't feel like myself lately.",
          wrong1: "Counselors are useless.",
          wrong2: "I am fine no help.",
          wrong3: "Only weak people need help.",
          explanation: "'Don't feel like myself' — dərbirini bawi kishaye deruni",
        },
      ],
    },
  ),

  buildLesson(
    "Calling for Help",
    "pəywəndi bō yarmeti",
    [
      { en: "I need an ambulance — someone is unconscious.", ku: "piewistim bə ambulance — kesek bihushə." },
      { en: "There's been a car accident on Main Street.", ku: "ruodawek otomobil lə shəqami sereki ruoidawə." },
      { en: "My address is 42 Oak Lane, apartment three.", ku: "naunishanim 42 shəqami Oak، shuqe siye." },
      { en: "Please hurry — the bleeding won't stop.", ku: "takaye bəpela — xwen radanewa." },
      { en: "I don't know if they're breathing.", ku: "nazanm aya henasa dədەن." },
      { en: "How long until help arrives?", ku: "chənd dexayenit ta yarmeti degat؟" },
    ],
    {
      convos: [
        {
          situation: "pəywəndi bə 911 dəkait",
          theyAsk: "911, what's your emergency?",
          correct: "I need an ambulance — someone is unconscious. My address is 42 Oak Lane, apartment three. Please hurry!",
          wrong1: "Help me please.",
          wrong2: "Something bad happened.",
          wrong3: "I don't know address.",
          explanation: "lə pəywəndi friakewtinda: naunishan + jori friakewtn + 'please hurry'",
        },
        {
          situation: "ruodawek riga binit",
          theyAsk: "Can you describe what happened?",
          correct: "There's been a car accident on Main Street. I don't know if they're breathing — please send help quickly.",
          wrong1: "Car crash is normal.",
          wrong2: "Not my problem.",
          wrong3: "I hang up now.",
          explanation: "'Car accident on Main Street' — shwen u jori ruodaw ruon bkerewa",
        },
      ],
    },
  ),

  buildLesson(
    "First Aid Basics",
    "yarmetii yekem",
    [
      { en: "Let me clean the cut and put a bandage on it.", ku: "ba brineka pak bkam u pichan bxam." },
      { en: "Keep pressure on the wound until it stops bleeding.", ku: "pəstan bde ser brineka ta xwen radawestit." },
      { en: "Elevate your leg to reduce the swelling.", ku: "qacheket berz bkerewa bō kəmkrdnewey audri." },
      { en: "Do you have any allergies to medication?", ku: "həstiyarit həyə bə hich dərmanek؟" },
      { en: "Try to stay still — help is on the way.", ku: "hewll bde jegir bminy — yarmeti lə rigadaiə." },
      { en: "I'll apply an ice pack to bring the swelling down.", ku: "saholl sardim dəkem bō kəmkrdnewey audri." },
    ],
    {
      convos: [
        {
          situation: "hawre brindar buwə",
          theyAsk: "I cut my hand pretty badly — there's a lot of blood.",
          correct: "Keep pressure on the wound until it stops bleeding. Let me clean the cut and put a bandage on it.",
          wrong1: "Blood is not problem.",
          wrong2: "Run around quickly.",
          wrong3: "Don't touch wound ever.",
          explanation: "'Keep pressure on the wound' — yekem henqaw lə yarmetii yekem",
        },
        {
          situation: "kesek piy sprain krdwə",
          theyAsk: "I twisted my ankle and it's swelling up.",
          correct: "Elevate your leg to reduce the swelling. I'll apply an ice pack — try to stay still.",
          wrong1: "Walk on it more.",
          wrong2: "Swelling is good sign.",
          wrong3: "Ignore the pain.",
          explanation: "'Elevate your leg' + 'ice pack' — charesay sereatai sprain",
        },
      ],
    },
  ),

  buildLesson(
    "Insurance & Appointments",
    "bime u chawpikewtin",
    [
      { en: "Do you accept my insurance plan?", ku: "plani bimekam qebul dəkən؟" },
      { en: "I'd like to schedule an appointment for next week.", ku: "həz dəkem chawpikewtinek bō haftey dhatu dabinim." },
      { en: "Is this procedure covered by my insurance?", ku: "aiya em prɔseye ləzhir bimekmdaiə؟" },
      { en: "I need a referral to see a specialist.", ku: "piewistim bə rewankrdn bō binini pzishki pspor." },
      { en: "What is my copay for this visit?", ku: "bri parea beshdarim bō em sərdanə chəndə؟" },
      { en: "Can I get a copy of my medical records?", ku: "dətwanm kopiyek lə tɔmari pzishkim werbgrm؟" },
    ],
    {
      convos: [
        {
          situation: "pəywəndi bə klinik dəkait",
          theyAsk: "Thank you for calling — how can I help you?",
          correct: "I'd like to schedule an appointment for next week. Do you accept my insurance plan?",
          wrong1: "I am sick come now.",
          wrong2: "Insurance is not important.",
          wrong3: "Give me appointment free.",
          explanation: "'Schedule an appointment' u 'accept my insurance' — prsiarə serekiyekan",
        },
        {
          situation: "pzishk pişniari pspor dəkat",
          theyAsk: "You'll need to see a cardiologist for this.",
          correct: "I need a referral to see a specialist. Is this procedure covered by my insurance?",
          wrong1: "I don't want specialist.",
          wrong2: "Insurance pays everything always.",
          wrong3: "Referral is not needed.",
          explanation: "'Referral' = rewankrdn | 'covered by insurance'",
        },
      ],
    },
  ),

  buildLesson(
    "Emergency Room",
    "zhuori friakewtin",
    [
      { en: "I think I'm having a heart attack.", ku: "pێm waiə twushbuwm bə jengi dil." },
      { en: "The pain in my chest is getting worse.", ku: "azari singm xraptir dəbit." },
      { en: "How long is the wait in the ER?", ku: "chənd dexayenit lə zhuori friakewtin؟" },
      { en: "I was brought in by ambulance an hour ago.", ku: "pish katzhmirek bə ambulancem hinnan." },
      { en: "Can my family member stay with me?", ku: "dətwanit endameki xezanm lam bminit؟" },
      { en: "When will the test results be ready?", ku: "kay anjamakani taqikrdnewe amade dəbən؟" },
    ],
    {
      convos: [
        {
          situation: "lə beshi friakewtin",
          theyAsk: "What is your emergency today?",
          correct: "The pain in my chest is getting worse. I think I'm having a heart attack — it started about twenty minutes ago.",
          wrong1: "Chest is little pain.",
          wrong2: "I come for fun.",
          wrong3: "Don't know why I am here.",
          explanation: "lə ER da: 'getting worse' + kat + nishan — zor gringə",
        },
        {
          situation: "chawerewey anjamakan",
          theyAsk: "The doctor will be with you shortly.",
          correct: "When will the test results be ready? Can my family member stay with me while I wait?",
          wrong1: "Results don't matter.",
          wrong2: "Send family away.",
          wrong3: "I leave hospital now.",
          explanation: "'Test results' u 'stay with me' — prsiarə asaiyekan lə ER",
        },
      ],
    },
  ),

  buildLesson(
    "Recovery & Follow-up",
    "chakbuunewa u pshknini duatr",
    [
      { en: "I'm feeling much better than last week.", ku: "zۆr bashtrim lə haftey rabrdw." },
      { en: "I'm still taking the medication as prescribed.", ku: "hishata dərmaneka wək rsepeta dexom." },
      { en: "Should I avoid any activities while I recover?", ku: "lə kati chakbuunewa dəbət lə chalakiyakan dur bkemewa؟" },
      { en: "The physical therapy is really helping.", ku: "charesay jismani bərasti yarmeti dədات." },
      { en: "I have a follow-up appointment on Thursday.", ku: "chawpikewtineki duatrm həyə pencshemme." },
      { en: "Thank you for taking such good care of me.", ku: "supas bō aw chawdiri bashey kəm lə krd." },
    ],
    {
      convos: [
        {
          situation: "sərdani duatr lə pzishk",
          theyAsk: "How have you been since our last visit?",
          correct: "I'm feeling much better than last week. I'm still taking the medication as prescribed, and the physical therapy is really helping.",
          wrong1: "Same as before bad.",
          wrong2: "I stopped all medicine.",
          wrong3: "Don't remember last visit.",
          explanation: "'As prescribed' = wək rsepeta — gringə lə chakbuunewa",
        },
        {
          situation: "pzishk dəpirset dərbarey chalaki",
          theyAsk: "Are you able to exercise at all?",
          correct: "Not yet — should I avoid any activities while I recover? I have a follow-up appointment on Thursday.",
          wrong1: "I run marathon tomorrow.",
          wrong2: "Exercise is impossible forever.",
          wrong3: "No follow-up needed.",
          explanation: "'Avoid activities while I recover' — prsiarkrdni zirkanə lə chakbuunewa",
        },
      ],
    },
  ),
];

export default unit10;
