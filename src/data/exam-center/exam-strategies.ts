import type { StrategyItem } from "../../types/exam-center";

export const EXAM_STRATEGY_LIBRARY: StrategyItem[] = [
  // ==========================================
  // IELTS STRATEGIES
  // ==========================================
  {
    id: "strat-ielts-r-01",
    exam: "ielts",
    section: "reading",
    taskType: "true_false_not_given",
    difficulty: "beginner",
    title: "The 3-Way Logic Filter for True / False / Not Given",
    summary:
      "A systematic method to eliminate confusion between FALSE (direct contradiction) and NOT GIVEN (unverified detail or missing comparison).",
    highValueRules: [
      "Rule 1: Always underline 2 unchangeable anchor words (names, dates, specialized nouns) to locate the target sentence.",
      "Rule 2: Check for 100% semantic equivalence for TRUE. If 1 word contradicts, it is FALSE. If 1 detail is missing, it is NOT GIVEN.",
      "Rule 3: Beware of absolute quantifiers (all, never, exclusively, only) vs probabilistic qualifiers (some, often, can, may).",
    ],
    timeManagementFormula:
      "Max 80-90 seconds per question. Allocate: 20s scan & locate → 40s sentence analysis → 20s validation.",
    commonMistakesAndTraps: [
      "Assuming TRUE because the statement is factually true in the real world.",
      "Choosing FALSE when the passage simply fails to mention the comparison (it is NOT GIVEN).",
      "Over-analyzing and inventing hypothetical scenarios not stated in the text.",
    ],
    usefulCollocationsAndIdioms: [
      "empirical substantiation",
      "corroborated by findings",
      "paucity of evidence",
      "diametrically opposed",
      "draw a distinction between",
    ],
    examinerRubricFocus:
      "Tests precision in reading for detailed factual information and identifying author claims.",
    lastMinuteTip:
      "If you are running out of time on the last 3 TFNG questions, look for extreme words like 'always/never/all'. Statements with extreme words are statistically FALSE or NOT GIVEN more frequently than TRUE.",
  },
  {
    id: "strat-ielts-r-02",
    exam: "ielts",
    section: "reading",
    taskType: "matching_headings",
    difficulty: "intermediate",
    title: "Skimming for Core Communicative Purpose in Headings",
    summary:
      "How to rapidly distill paragraph topic sentences, ignore deceptive detail keywords, and map overarching themes to Roman numeral headings.",
    highValueRules: [
      "Rule 1: Solve Matching Headings FIRST before answering detailed questions for that passage.",
      "Rule 2: Formulate your own 3-word summary of the paragraph BEFORE reading the list of headings.",
      "Rule 3: Look for discourse markers that signal transitions (However, On the other hand, By contrast, Consequently).",
    ],
    timeManagementFormula:
      "Allocate 1 minute per paragraph heading. 6 paragraphs = 6-7 minutes total.",
    commonMistakesAndTraps: [
      "Matching a heading because it shares an identical keyword with line 3 of the paragraph.",
      "Ignoring the conclusion of the paragraph where the actual argument crystallizes.",
    ],
    usefulCollocationsAndIdioms: [
      "catalyst for change",
      "shift in perspective",
      "underlying rationale",
      "impending crisis",
      "unforeseen ramifications",
    ],
    examinerRubricFocus:
      "Tests the ability to recognize main ideas and distinguish main themes from supporting details.",
    lastMinuteTip:
      "Cross off used headings immediately so your cognitive load decreases with every paragraph you complete.",
  },
  {
    id: "strat-ielts-l-01",
    exam: "ielts",
    section: "listening",
    taskType: "form_completion",
    difficulty: "beginner",
    title: "Listening Prediction & Distractor Traps in Section 1",
    summary:
      "Techniques to predict word forms (noun/date/number) before the audio plays and survive the classic 'correction distractor'.",
    highValueRules: [
      "Rule 1: Use the 30-second silent prep time to predict the exact data type required for each blank.",
      "Rule 2: The Correction Trap: Speakers in Section 1 almost always state a number or name, then correct themselves ('Oh wait, that was my old postcode, my new one is...'). Always write the final confirmed version.",
      "Rule 3: Strict word count compliance: 'NO MORE THAN TWO WORDS AND/OR A NUMBER' means 3 words is an automatic zero.",
    ],
    timeManagementFormula:
      "Spend all 30s prep looking ahead at blanks. Do not check past answers during the prep time for the next section.",
    commonMistakesAndTraps: [
      "Writing the first number you hear before the speaker corrects themselves.",
      "Misspelling days of the week, months, or common British place names.",
      "Plural vs singular errors (e.g. writing 'car' when the recording clearly said 'cars').",
    ],
    usefulCollocationsAndIdioms: [
      "provisional booking",
      "annual subscription",
      "dietary requirements",
      "postal address",
    ],
    examinerRubricFocus:
      "Tests accuracy in spelling, number transcription, and filtering conversational self-corrections.",
    lastMinuteTip:
      "British alphabet pronunciations: 'A' (/eɪ/), 'E' (/iː/), 'I' (/aɪ/), 'J' (/dʒeɪ/), 'G' (/dʒiː/). Review these before test day.",
  },
  {
    id: "strat-ielts-w-01",
    exam: "ielts",
    section: "writing",
    taskType: "writing_task2_essay",
    difficulty: "advanced",
    title: "The PEEL Paragraph & 40-Minute Essay Engine",
    summary:
      "A systematic architecture for drafting 270-300 word essays that score Band 8+ in Task Achievement and Coherence & Cohesion.",
    highValueRules: [
      "Rule 1: Spend 5 full minutes planning. An essay planned for 5 minutes is 1.5 bands higher than one started immediately.",
      "Rule 2: Write a 2-sentence introduction: Sentence 1 = Paraphrase prompt; Sentence 2 = Explicit thesis statement.",
      "Rule 3: Use PEEL for Body Paragraphs: Point (Topic sentence) -> Explanation (Causal logic) -> Example (Specific scenario) -> Link (Reconnect to thesis).",
      "Rule 4: Conclusion: 2 sentences summarizing main arguments. Never introduce new arguments in the conclusion.",
    ],
    timeManagementFormula:
      "5 min Planning → 5 min Intro → 12 min Body 1 → 12 min Body 2 → 4 min Conclusion → 2 min Proofreading.",
    commonMistakesAndTraps: [
      "Writing under 250 words (immediate Task Response penalty).",
      "Overusing simplistic connectors like 'Firstly, Secondly, In a nutshell'.",
      "Failing to provide an explicit opinion when the prompt asks 'To what extent do you agree?'.",
    ],
    usefulCollocationsAndIdioms: [
      "foster social cohesion",
      "exert a profound influence on",
      "fiduciary responsibility",
      "catalyze economic growth",
      "warrant urgent attention",
      "mitigate adverse effects",
    ],
    examinerRubricFocus:
      "Coherence and Cohesion (25%), Task Response (25%), Lexical Resource (25%), Grammatical Range and Accuracy (25%).",
    templateSnippet:
      "Intro:\nIt is widely contended that [Topic]. While some argue that [Perspective A], I subscribe to the view that [Perspective B] due to [Reason 1] and [Reason 2].\n\nBody 1:\nTo begin with, [Point 1]. Specifically, [Explanation 1]. A case in point is [Example 1]. Therefore, [Link 1].\n\nBody 2:\nFurthermore, [Point 2]. This is because [Explanation 2]. For instance, [Example 2]. Consequently, [Link 2].\n\nConclusion:\nIn conclusion, despite the merits of [Perspective A], [Reiterate Thesis] remains paramount owing to [Summary of Points].",
    lastMinuteTip:
      "Count your lines during practice so you know what 260 words looks like in your handwriting or screen layout without stopping to count words during the real exam.",
  },
  {
    id: "strat-ielts-s-01",
    exam: "ielts",
    section: "speaking",
    taskType: "speaking_part3_discussion",
    difficulty: "advanced",
    title: "The AREA Method for Part 3 Abstract Discussions",
    summary:
      "How to expand short answers into sophisticated, analytical discourse using the AREA framework without memorized robotic templates.",
    highValueRules: [
      "Rule 1: Part 3 is about SOCIETY, INSTITUTIONS, and BROAD TRENDS, not your personal life. Use 'people in general', 'governments', 'societies'.",
      "Rule 2: Use AREA: Answer directly -> Reason -> Example / Evidence -> Alternative perspective / Nuance.",
      "Rule 3: Buy thinking time naturally: 'That's a multifaceted question. I suppose there are two principal dimensions to consider...'",
    ],
    timeManagementFormula:
      "Aim for 35 to 45 seconds per response (4 to 5 substantial sentences).",
    commonMistakesAndTraps: [
      "Giving a 1-sentence answer like in Part 1.",
      "Talking exclusively about yourself or your family instead of societal trends.",
      "Freezing when asked an unfamiliar abstract question.",
    ],
    usefulCollocationsAndIdioms: [
      "double-edged sword",
      "at the forefront of",
      "polarize public opinion",
      "tangible repercussions",
      "strike a delicate balance",
    ],
    examinerRubricFocus:
      "Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation.",
    lastMinuteTip:
      "If you don't understand an abstract word the examiner used, ask naturally: 'Could you rephrase that question for me, please?' This does not lower your score.",
  },

  // ==========================================
  // DET STRATEGIES
  // ==========================================
  {
    id: "strat-det-l-01",
    exam: "det",
    section: "reading",
    taskType: "read_and_select",
    difficulty: "beginner",
    title: "Morphological Verification in Read and Select",
    summary:
      "Eliminate penalty deductions in Read and Select by filtering out pseudo-words constructed with deceptive English affixes.",
    highValueRules: [
      "Rule 1: Never guess. Selecting 1 fake word cancels the credit earned from 1 correct word.",
      "Rule 2: Beware of prefix-root mismatches: 'un-' vs 'in-' vs 'im-' vs 'dis-' (e.g. 'unpolitely' [fake] vs 'impolitely' [real]).",
      "Rule 3: Verify the exact spelling of silent letters and double consonants ('accommodate', 'privilege', 'embarrass').",
    ],
    timeManagementFormula:
      "60 seconds total: 0-20s select high-frequency certain words → 20-45s evaluate intermediate roots → 45-60s check for accidental misclicks.",
    commonMistakesAndTraps: [
      "Clicking a word because it 'sounds like a real word' in your head.",
      "Panic-clicking words in the last 3 seconds.",
    ],
    usefulCollocationsAndIdioms: [
      "pragmatic approach",
      "syntactic structure",
      "morphological root",
      "orthographic accuracy",
    ],
    examinerRubricFocus:
      "Literacy and Comprehension subscores. High penalties for false positives.",
    lastMinuteTip:
      "If you cannot use the word in a sentence with a clear meaning within 3 seconds, leave it unselected.",
  },
  {
    id: "strat-det-w-01",
    exam: "det",
    section: "writing",
    taskType: "write_about_photo",
    difficulty: "intermediate",
    title: "Spatial Prepositions & 3-Sentence Photo Mastery",
    summary:
      "How to write high-scoring 40-50 word descriptions in 60 seconds with spatial clauses, descriptive modifiers, and logical deductions.",
    highValueRules: [
      "Rule 1: Never write only one basic sentence. Always write 2 to 3 compound/complex sentences.",
      "Rule 2: Sentence 1 = Foreground subject & action; Sentence 2 = Background & atmosphere; Sentence 3 = Contextual inference.",
      "Rule 3: Use spatial prepositions: 'In the foreground', 'situated adjacently', 'in the backdrop', 'flanked by'.",
    ],
    timeManagementFormula:
      "0-10s observe scene → 10-35s write S1 & S2 → 35-50s write S3 → 50-60s proofread spelling.",
    commonMistakesAndTraps: [
      "Writing 'There is a...' for every sentence.",
      "Inventing fictional character names or drama not visible in the picture.",
      "Leaving typos from fast typing.",
    ],
    usefulCollocationsAndIdioms: [
      "in the immediate foreground",
      "bathed in natural light",
      "bustling urban thoroughfare",
      "conveys a sense of serenity",
      "meticulously organized",
    ],
    examinerRubricFocus:
      "Production and Literacy subscores. Evaluates vocabulary richness, sentence complexity, and grammatical accuracy.",
    templateSnippet:
      "In the foreground, [Subject] is [Participial Action] amidst [Setting Detail]. The backdrop features [Background Elements], suggesting that [Plausible Inference].",
    lastMinuteTip:
      "Keep your typing hands positioned on home row as the timer counts down so you begin typing at second 0:02.",
  },
  {
    id: "strat-det-s-01",
    exam: "det",
    section: "speaking",
    taskType: "speak_about_photo",
    difficulty: "advanced",
    title: "The 4-Phase Vision Framework for 90-Second Speaking",
    summary:
      "A step-by-step spoken narration system that ensures 80+ seconds of uninterrupted, fluent acoustic speech with advanced topic vocabulary.",
    highValueRules: [
      "Rule 1: Speak for at least 75 to 85 seconds. Stopping at 30 seconds severely reduces your Production subscore.",
      "Rule 2: Follow the 4 phases: Macro Scene (15s) -> Central Subject (25s) -> Backdrop & Lighting (25s) -> Thematic Inference (20s).",
      "Rule 3: Modulate your pitch and use natural pauses. Do not speak in a flat monotone.",
    ],
    timeManagementFormula:
      "20s silent prep → 0-20s Phase 1 → 20-45s Phase 2 → 45-70s Phase 3 → 70-85s Phase 4.",
    commonMistakesAndTraps: [
      "Freezing at 35 seconds because of a lack of pre-planned structure.",
      "Staring away from the webcam (triggers DET proctoring flag).",
      "Repeatedly saying 'uhm, uhm, and yeah'.",
    ],
    usefulCollocationsAndIdioms: [
      "focal point of the composition",
      "exudes an air of professionalism",
      "illuminated by ambient daylight",
      "reasonable to deduce that",
      "striking visual contrast",
    ],
    examinerRubricFocus:
      "Conversation and Production subscores. Evaluates acoustic fluency, grammatical complexity, and lexical range.",
    lastMinuteTip:
      "Always look straight into the camera lens while speaking to project confidence and maintain proctoring compliance.",
  },
];
