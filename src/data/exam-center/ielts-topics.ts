import type { PreparationTopic } from "../../types/exam-center";

export const IELTS_PREPARATION_TOPICS: PreparationTopic[] = [
  // ==========================================
  // READING SECTION
  // ==========================================
  {
    id: "ielts-read-01",
    exam: "ielts",
    section: "reading",
    taskType: "true_false_not_given",
    difficulty: "beginner",
    title: "Mastering True / False / Not Given",
    subtitle: "Identify explicit facts vs contradictory claims vs unverified details",
    estimatedMinutes: 15,
    orderIndex: 1,
    learnContent: {
      overview:
        "True/False/Not Given (and Yes/No/Not Given) tests your ability to distinguish between what the passage strictly proves, what it directly contradicts, and what information is simply absent or cannot be confirmed.",
      strategyRules: [
        "TRUE: The statement agrees 100% with the information in the passage.",
        "FALSE: The passage explicitly states the opposite or contradicts the statement.",
        "NOT GIVEN: The passage mentions the topic or related keywords, but neither confirms nor denies the specific relationship claimed in the statement.",
        "Never assume or use outside real-world knowledge. Rely only on the text.",
        "Watch qualifying words: 'all', 'some', 'always', 'rarely', 'only', 'proven'.",
      ],
      stepByStepMethod: [
        "1. Read the statement first and highlight 2-3 key nouns or technical terms that cannot be easily paraphrased.",
        "2. Scan the reading passage to locate the exact sentence or paragraph where those terms appear.",
        "3. Read the surrounding 2-3 sentences with intense focus on verbs, adjectives, and qualifiers.",
        "4. Ask yourself: Does the text actively prove this (True), actively disprove it (False), or remain silent on this specific claim (Not Given)?",
      ],
      timeManagementRule:
        "Spend no more than 90 seconds per TFNG item. If stuck between False and Not Given after 60 seconds, check if the text contains a direct antonym/negation. If not, it is Not Given.",
      commonTraps: [
        "The Keyword Match Trap: Seeing all words from the question in the passage and assuming it must be TRUE.",
        "The 90% Match Trap: The statement is mostly true, but one qualifier (e.g. 'exclusively') is not confirmed.",
        "The Common Knowledge Trap: Choosing TRUE because the fact is scientifically true in real life, even though the text never said so.",
      ],
      usefulVocabulary: [
        {
          term: "Corroborate",
          phonetic: "/kəˈrɒb.ə.reɪt/",
          definition: "To confirm or give support to a statement, theory, or finding.",
          collocations: ["corroborate evidence", "fully corroborated by"],
          examExample: "The findings were corroborated by a subsequent longitudinal study.",
        },
        {
          term: "Plausible",
          phonetic: "/ˈplɔː.zə.bəl/",
          definition: "Seeming reasonable or probable.",
          collocations: ["plausible explanation", "highly plausible"],
          examExample: "While plausible, the hypothesis lacked empirical substantiation.",
        },
        {
          term: "Discrepancy",
          phonetic: "/dɪˈskrep.ən.si/",
          definition: "A lack of compatibility or similarity between two or more facts.",
          collocations: ["major discrepancy", "resolve discrepancies"],
          examExample: "Researchers noted a significant discrepancy between self-reported data and observed behavior.",
        },
      ],
      naturalPhrases: [
        "According to the author's account...",
        "The text expressly indicates that...",
        "There is no conclusive evidence presented to substantiate...",
        "The author draws a clear distinction between...",
      ],
      paraphrasingTechniques: [
        {
          technique: "Antonym with Negation",
          original: "The species is extremely rare in northern latitudes.",
          paraphrased: "The species is not commonly encountered in northern regions.",
          note: "Examiners frequently turn negative statements into affirmative antonyms in question stems.",
        },
        {
          technique: "Nominalization (Verb to Noun)",
          original: "Urban planners decided to restrict private vehicular access.",
          paraphrased: "The decision to impose restrictions on private vehicles was made by urban planners.",
          note: "Shifting action verbs into abstract nouns changes sentence structure while preserving meaning.",
        },
      ],
      comparativeExamples: {
        prompt:
          "Passage: 'Renewable energy adoption grew rapidly between 2015 and 2022, primarily driven by state subsidies for solar panel installations in residential neighborhoods.'\n\nStatement: 'Commercial businesses installed more solar panels than private homeowners between 2015 and 2022.'",
        weak: {
          text: "FALSE - Because the text says residential neighborhoods grew rapidly.",
          score: "Band 5.5 logic",
          explanation:
            "Confuses absence of evidence with direct contradiction. The passage never compared the exact volume of commercial vs residential installations.",
          identifiedErrors: [
            "Assumed contradiction without explicit comparative data in the text.",
          ],
        },
        good: {
          text: "NOT GIVEN - The text mentions residential installations but does not provide data comparing them to commercial installations.",
          score: "Band 7.0 logic",
          explanation: "Accurately identifies that the comparative claim cannot be verified from the passage alone.",
          strengths: ["Focused strictly on the evidence in the text."],
        },
        excellent: {
          text: "NOT GIVEN - The passage confirms that state subsidies for residential solar installations drove adoption, but it makes no comparison regarding commercial business installations. Because the relationship cannot be verified or falsified from the text, it is Not Given.",
          score: "Band 9.0 logic",
          explanation: "Flawless reasoning clearly identifying the unverified comparative variable.",
          keyHighlights: [
            "Identifies exact scope of provided facts.",
            "Pinpoints the unmentioned comparative metric.",
          ],
          examinerNote:
            "Candidate demonstrates rigorous analytical distinction between explicit refutation (False) and absence of data (Not Given).",
        },
      },
      examDayTip:
        "Questions in TFNG tasks almost always follow the chronological order of the passage. If you found Q1 in paragraph 2 and Q3 in paragraph 4, Q2 MUST be in paragraph 2 or 3.",
    },
    practiceTask: {
      id: "ielts-read-01-p",
      title: "TFNG Guided Analysis",
      instruction: "Read the excerpt below and determine whether the statement is TRUE, FALSE, or NOT GIVEN.",
      type: "multiple_choice",
      prompt:
        "Passage excerpt:\n'Recent archaeological digs in the Orkney Islands revealed Neolithic settlements equipped with sophisticated drainage systems and stone-built furniture. While early historians believed these communities lived in isolation, maritime trade artifacts suggest regular contact with mainland populations. However, evidence of formal governance structures remains elusive.'\n\nStatement:\n'Archaeologists have uncovered clear proof that Neolithic Orkney was ruled by an organized central authority.'",
      options: ["TRUE", "FALSE", "NOT GIVEN"],
      correctAnswer: 1, // FALSE (text says evidence remains elusive, which directly contradicts "uncovered clear proof")
      hints: [
        "Look at what the text says about 'formal governance structures'.",
        "Does 'remains elusive' agree with 'uncovered clear proof' or directly contradict it?",
      ],
      modelAnswer: "FALSE",
      sampleBreakdown:
        "The passage states that evidence of formal governance structures 'remains elusive' (unfound/absent). The statement claims archaeologists 'have uncovered clear proof' of an organized central authority. This is a direct contradiction of the findings stated in the text, so the answer is FALSE.",
    },
    quiz: [
      {
        id: "ielts-read-01-q1",
        question:
          "Passage: 'The European honeybee can perceive polarized sunlight, allowing it to navigate accurately even when the sky is overcast.'\n\nStatement: 'Cloud cover prevents European honeybees from navigating efficiently.'",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        correctIndex: 1,
        explanation:
          "The text says they can navigate accurately EVEN when overcast. The statement claims cloud cover prevents efficient navigation, which directly contradicts the text. Answer is FALSE.",
        skillTag: "reading_tfng_negation",
        trapWarning: "Watch out for 'overcast' vs 'cloud cover' synonymous phrasing.",
      },
      {
        id: "ielts-read-01-q2",
        question:
          "Passage: 'Acoustic monitoring of blue whales in the Antarctic revealed that vocalisations drop by 3 dB during winter feeding migrations.'\n\nStatement: 'Blue whales produce louder vocalisations when searching for potential mates.'",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        correctIndex: 2,
        explanation:
          "The passage discusses feeding migrations, but makes no mention of mating calls or their volume. Therefore, this statement is NOT GIVEN.",
        skillTag: "reading_tfng_not_given",
        trapWarning: "Do not invent plausible biology theories not in the text.",
      },
      {
        id: "ielts-read-01-q3",
        question:
          "Passage: 'Dr. Vance's team confirmed that synthetic polymers degraded significantly faster when exposed to targeted ultraviolet wavelengths than under ambient sunlight.'\n\nStatement: 'Targeted UV exposure accelerates the breakdown rate of synthetic polymers compared to normal outdoor lighting.'",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        correctIndex: 0,
        explanation:
          "Accelerates breakdown rate = degraded significantly faster; normal outdoor lighting = ambient sunlight. The statement completely agrees with the text. Answer is TRUE.",
        skillTag: "reading_tfng_paraphrase",
      },
    ],
  },

  {
    id: "ielts-read-02",
    exam: "ielts",
    section: "reading",
    taskType: "matching_headings",
    difficulty: "intermediate",
    title: "Matching Headings & Central Themes",
    subtitle: "Distinguish paragraph core themes from supporting examples and distractors",
    estimatedMinutes: 18,
    orderIndex: 2,
    learnContent: {
      overview:
        "Matching Headings tests your ability to identify the central argument or primary objective of a paragraph, filtering out auxiliary details, quotes, and illustrative examples.",
      strategyRules: [
        "Headings always represent the MAIN IDEA of the whole paragraph, not just one interesting sentence.",
        "There are always more headings in the list than paragraphs (usually 2-3 distractors).",
        "Never match based on a single identical keyword; examiners deliberately place passage keywords in incorrect distractor headings.",
        "Read the paragraph first with an eye for the 'Topic Sentence' (usually sentence 1, 2, or the concluding sentence) before looking at the heading list.",
      ],
      stepByStepMethod: [
        "1. Cross out any example headings already used in the test instructions.",
        "2. Skim the first paragraph to grasp its communicative purpose (e.g. problem introduction, historical overview, counterargument, future outlook).",
        "3. Summarize the paragraph in 3-4 words in your head before looking at the Roman numeral headings.",
        "4. Scan the heading options and select the one that encapsulates your mental summary.",
        "5. Verify that the heading covers the beginning, middle, and conclusion of the paragraph.",
      ],
      timeManagementRule:
        "Complete Matching Headings FIRST when a passage includes them. Understanding the structure of each paragraph will make subsequent detailed questions (MCQs, sentence completions) twice as fast.",
      commonTraps: [
        "The First Sentence Fallacy: Assuming the topic sentence is always sentence #1. If sentence 1 is a transition or hook, the core idea is often in sentence 2.",
        "The Specific Detail Lure: Picking a heading that accurately describes a statistic in line 4, but ignores the remaining 80% of the paragraph.",
      ],
      usefulVocabulary: [
        {
          term: "Impetus",
          phonetic: "/ˈɪm.pɪ.təs/",
          definition: "The force that makes something happen or happen more quickly.",
          collocations: ["provide the impetus", "primary impetus"],
          examExample: "Government subsidies provided the impetus for rapid wind farm development.",
        },
        {
          term: "Ubiquitous",
          phonetic: "/juːˈbɪk.wɪ.təs/",
          definition: "Present, appearing, or found everywhere.",
          collocations: ["ubiquitous presence", "become ubiquitous"],
          examExample: "Microplastic contamination has become virtually ubiquitous in marine ecosystems.",
        },
      ],
      naturalPhrases: [
        "The overarching objective of the initiative is...",
        "A compelling counterpoint to this hypothesis emerged when...",
        "This transitional phase was characterized by...",
      ],
      comparativeExamples: {
        prompt:
          "Paragraph: 'Although automated checkouts were initially heralded as a revolution in retail convenience, consumer satisfaction surveys reveal widespread frustration. Shoppers frequently report barcode scanning failures and unexpected item errors, leading over 40% of surveyed patrons to return to staffed registers.'",
        weak: {
          text: "Heading: 'How barcode scanning technology functions'",
          score: "Band 5.0",
          explanation: "Selected a minor technical detail mentioned in passing rather than the main theme.",
          identifiedErrors: ["Focused on a single noun instead of the author's message."],
        },
        good: {
          text: "Heading: 'Technical issues in modern supermarkets'",
          score: "Band 7.0",
          explanation: "Closer, but misses the central theme of consumer dissatisfaction vs initial expectations.",
          strengths: ["Captures the negative tone."],
        },
        excellent: {
          text: "Heading: 'The unexpected shortcomings of retail automation'",
          score: "Band 9.0",
          explanation: "Encompasses both the contrast with initial expectations ('heralded as a revolution') and the negative reality ('frustration, errors, return to staff').",
          keyHighlights: ["Synthesizes the complete narrative arc of the paragraph."],
          examinerNote: "Perfect summary of the paragraph's core communicative purpose.",
        },
      },
      examDayTip:
        "If two headings seem equally plausible for one paragraph, write both Roman numerals next to it, continue to the remaining paragraphs, and eliminate the one that fits another paragraph perfectly.",
    },
    practiceTask: {
      id: "ielts-read-02-p",
      title: "Heading Synthesis",
      instruction: "Select the most accurate heading for the paragraph below.",
      type: "multiple_choice",
      prompt:
        "Paragraph:\n'While early aviation pioneers focused almost exclusively on maximizing airspeed and altitude, contemporary aerospace engineers face entirely different constraints. Today's commercial aircraft designs are shaped overwhelmingly by fuel efficiency, acoustic footprint reduction for noise-sensitive airports, and the imperative to reduce lifetime carbon emissions.'",
      options: [
        "i. Early milestones in supersonic flight",
        "ii. The shifting priorities of aircraft design",
        "iii. Environmental regulations in European airports",
        "iv. Commercial strategies to increase passenger speed",
      ],
      correctAnswer: 1,
      hints: [
        "Notice the contrast word: 'While early aviation... contemporary aerospace engineers face entirely different constraints.'",
      ],
      modelAnswer: "ii. The shifting priorities of aircraft design",
      sampleBreakdown:
        "The paragraph contrasts historical priorities (airspeed/altitude) with modern imperatives (fuel economy, noise, emissions). The heading 'The shifting priorities of aircraft design' accurately captures this transition.",
    },
    quiz: [
      {
        id: "ielts-read-02-q1",
        question:
          "Which heading best fits a paragraph describing how a sudden drought in 1200 BCE caused harvest failures, which in turn triggered widespread social rebellion and the collapse of Bronze Age trade routes?",
        options: [
          "i. Methods of agricultural irrigation in antiquity",
          "ii. The domino effects of climatic disruption",
          "iii. Trade tariffs in the Mediterranean basin",
          "iv. Rebuilding civilisations after war",
        ],
        correctIndex: 1,
        explanation:
          "The paragraph describes a sequence of escalating consequences (drought -> harvest loss -> rebellion -> trade collapse). 'The domino effects of climatic disruption' captures this causal chain.",
        skillTag: "reading_headings_synthesis",
      },
    ],
  },

  // ==========================================
  // WRITING SECTION
  // ==========================================
  {
    id: "ielts-write-01",
    exam: "ielts",
    section: "writing",
    taskType: "writing_task2_essay",
    difficulty: "advanced",
    title: "IELTS Task 2: High-Band Essay Architecture & PEEL",
    subtitle: "Construct 250+ word academic essays with coherent argument chains and nuanced evaluation",
    estimatedMinutes: 25,
    orderIndex: 3,
    learnContent: {
      overview:
        "IELTS Writing Task 2 requires a formal discursive essay of at least 250 words written in 40 minutes. It accounts for 66% of your overall Writing band score. Examiners evaluate 4 strict criteria: Task Achievement (25%), Coherence & Cohesion (25%), Lexical Resource (25%), and Grammatical Range & Accuracy (25%).",
      strategyRules: [
        "Always spend the first 5 minutes planning: analyze the prompt, decide your thesis, and outline 2 clear body paragraph arguments.",
        "Include a clear overview / thesis statement in the introduction and restate it with nuanced vocabulary in the conclusion.",
        "Use the PEEL structure for each body paragraph: Point, Explanation, Example, Link.",
        "Never write a one-sentence paragraph. Aim for 4 distinct paragraphs: Introduction (40-50 words), Body 1 (90-100 words), Body 2 (90-100 words), Conclusion (35-45 words).",
        "Avoid informal idioms, contractions (don't, can't), and overly emotional rhetoric.",
      ],
      stepByStepMethod: [
        "Step 1 (Prompt Deconstruction): Identify the topic, the specific controversy, and the question type (Opinion, Discussion, Problem-Solution, Two-part).",
        "Step 2 (Introduction): Paraphrase the prompt in Sentence 1. Give your explicit thesis position in Sentence 2.",
        "Step 3 (Body Paragraph 1): Lead with a strong topic sentence (Point). Unpack the causal logic (Explanation). Provide an authentic, specific case or scenario (Example). Reconnect to the central thesis (Link).",
        "Step 4 (Body Paragraph 2): Present the second major argument or alternative perspective following the identical PEEL structure.",
        "Step 5 (Conclusion): Synthesize both main arguments without introducing new points. Reiterate your final stance with elevated lexical variety.",
      ],
      timeManagementRule:
        "Strict 40-minute breakdown: 5 min planning → 5 min introduction → 12 min Body 1 → 12 min Body 2 → 4 min conclusion → 2 min editing/proofreading.",
      commonTraps: [
        "Underlength Penalty: Writing fewer than 250 words results in an automatic penalty under Task Response.",
        "Memorized Template Fillers: Cliches like 'Since the dawn of time' or 'This essay will discuss both sides' receive low band scores.",
        "Over-General Examples: Using vague examples like 'For example in my country people do this' instead of concrete institutional or societal examples.",
        "Unbalanced Discussion: Writing 150 words for one side and only 40 words for the other in a 'Discuss both views' prompt.",
      ],
      usefulVocabulary: [
        {
          term: "Exacerbate",
          phonetic: "/ɪɡˈzæs.ə.beɪt/",
          definition: "To make a problem, bad situation, or negative feeling worse.",
          collocations: ["exacerbate inequalities", "greatly exacerbated by"],
          examExample: "Unregulated urbanization will exacerbate existing pressures on municipal water infrastructure.",
        },
        {
          term: "Mitigate",
          phonetic: "/ˈmɪt.ɪ.ɡeɪt/",
          definition: "To make something bad less severe, serious, or painful.",
          collocations: ["mitigate risks", "mitigate the impact of"],
          examExample: "Fiscal incentives for electric vehicles can mitigate urban air pollution.",
        },
        {
          term: "Paradigm",
          phonetic: "/ˈpær.ə.daɪm/",
          definition: "A typical example or pattern of something; a distinct conceptual model.",
          collocations: ["paradigm shift", "conventional paradigm"],
          examExample: "Remote employment represents a fundamental paradigm shift in corporate culture.",
        },
      ],
      naturalPhrases: [
        "Proponents of this approach argue that...",
        "A compelling justification for this view lies in...",
        "This phenomenon can be largely attributed to...",
        "Conversely, critics contend that such measures may inadvertently...",
        "Ultimately, the most viable resolution requires a synthesis of...",
      ],
      writingTemplates: [
        {
          name: "PEEL Body Paragraph Template",
          purpose: "Structuring high-coherence body paragraphs (Band 8+)",
          template:
            "[Point]: One primary argument in favor of [X] is [Core Claim]. [Explanation]: Specifically, when [Condition occurs], it inevitably leads to [Consequence], because [Underlying Reason]. [Example]: A prominent illustration of this is [Concrete Example], which demonstrated [Key Result]. [Link]: Consequently, this reinforces the view that [Reiterated Point].",
          sampleUsage:
            "One primary argument in favor of subsidizing public transit is its capacity to reduce commuter emissions. Specifically, when rail fares are kept affordable, commuters are disincentivized from driving private vehicles, thereby curtailing vehicular congestion during peak hours. A prominent illustration of this is Luxembourg, where zero-fare national transit produced a measurable downturn in inner-city carbon outputs. Consequently, targeted subsidies serve as an indispensable catalyst for urban sustainability.",
        },
      ],
      comparativeExamples: {
        prompt:
          "Some people believe that universities should focus solely on preparing students for future employment, while others argue that higher education should foster broad academic knowledge. Discuss both views and give your opinion.",
        weak: {
          text: "I agree universities must give jobs. Nowadays economy is very hard so if students don't get job they waste money. Also knowledge is good but jobs are more important because we need to pay rent.",
          score: "Band 5.0",
          explanation: "Colloquial vocabulary ('jobs', 'hard', 'waste money'), no paragraph structure, lacks academic hedging and cohesion.",
          identifiedErrors: [
            "Informal register",
            "Fails to discuss both views equally",
            "Simplistic sentence structures",
          ],
        },
        good: {
          text: "On the one hand, university education should be practical. Many graduates struggle to find employment because degrees are too theoretical. If universities teach technical skills, students can secure employment immediately after graduation, improving economic growth.",
          score: "Band 6.5",
          explanation: "Clear topic sentence and logical connection, but vocabulary is repetitive and argument remains somewhat basic.",
          strengths: ["Clear position", "Grammatically sound"],
        },
        excellent: {
          text: "Advocates of vocational orientation contend that higher education must align directly with the demands of the modern knowledge economy. In an era marked by rapid technological disruption and escalating tuition fees, tertiary institutions bear a fiduciary responsibility to equip graduates with marketable competencies. For instance, universities that integrate mandatory software engineering internships into their curriculum consistently report higher graduate employment rates. Consequently, tailoring academic coursework to corporate requirements ensures that educational investment translates into tangible economic mobility.",
          score: "Band 8.5 - 9.0",
          explanation: "Impeccable lexical resource ('fiduciary responsibility', 'marketable competencies', 'technological disruption'), flawless cohesion, and sophisticated exemplification.",
          keyHighlights: [
            "Advanced academic register without sounding artificial.",
            "Complete logical justification from premise to conclusion.",
          ],
          examinerNote:
            "Exemplary Task Response and Coherence. The candidate moves effortlessly from broad principle to empirical illustration.",
        },
      },
      examDayTip:
        "Always leave 3-4 minutes to check for agreement errors (singular/plural verbs), spelling of academic terms, and article omissions (a/an/the). Correcting 3 minor slips can lift your Grammar score from Band 6.5 to 7.5.",
    },
    practiceTask: {
      id: "ielts-write-01-p",
      title: "PEEL Paragraph Construction",
      instruction:
        "Write a single, polished 90-word PEEL body paragraph addressing the prompt below. Ensure you include a Point, Explanation, Example, and Link.",
      type: "essay_writing",
      prompt:
        "Prompt: Should governments impose taxes on sugar-sweetened beverages to reduce obesity?\nTask: Write Body Paragraph 1 supporting the implementation of a sugar tax.",
      hints: [
        "Point: State that financial disincentives curb consumption of unhealthy goods.",
        "Explanation: Explain how increased retail price shifts consumer buying habits toward healthier alternatives.",
        "Example: Reference the UK Soft Drinks Industry Levy or a similar national policy.",
        "Link: Conclude that fiscal measures are an effective preventative health tool.",
      ],
      minWords: 75,
      modelAnswer:
        "Imposing a fiscal levy on sugary beverages serves as a potent deterrent against unhealthy dietary choices. When governments introduce targeted taxation on high-sugar commodities, the resulting retail price increase directly alters consumer purchasing behavior by rendering healthier substitutes economically preferable. A notable case is the United Kingdom's Soft Drinks Industry Levy, which prompted beverage manufacturers to reduce sugar formulations by over 30% to avoid taxation tiers. Thus, fiscal disincentives represent an impactful mechanism for safeguarding public health.",
      sampleBreakdown:
        "The paragraph opens with a clear policy claim (Point), explains the economic psychology of price sensitivity (Explanation), cites the UK tax reduction outcome (Example), and summarizes the public health imperative (Link).",
    },
    quiz: [
      {
        id: "ielts-write-01-q1",
        question:
          "Which of the following sentences functions best as a formal academic thesis statement in an IELTS Task 2 essay on artificial intelligence in healthcare?",
        options: [
          "I think AI is super cool and doctors will use it a lot in the future.",
          "While AI integration offers undeniable diagnostic precision, its implementation must be tempered by rigorous ethical oversight to protect patient autonomy.",
          "In this essay I am going to write about the pros and cons of robots in hospitals.",
          "AI has become very ubiquitous nowadays and everyone is talking about healthcare.",
        ],
        correctIndex: 1,
        explanation:
          "Option B combines a complex sentence structure ('While...'), elevated academic vocabulary ('diagnostic precision', 'ethical oversight', 'patient autonomy'), and an unambiguous, nuanced thesis position.",
        skillTag: "writing_task2_thesis",
      },
      {
        id: "ielts-write-01-q2",
        question:
          "Which transitional phrase is most appropriate to introduce a contrasting academic perspective in Body Paragraph 2?",
        options: [
          "On the flip side of the coin...",
          "Notwithstanding these evident benefits, critics raise legitimate concerns regarding...",
          "But another thing to think about is...",
          "On other hand, there is bad things too...",
        ],
        correctIndex: 1,
        explanation:
          "'Notwithstanding these evident benefits...' provides high-band cohesive transition without resorting to cliché idioms like 'flip side of the coin' or informal language.",
        skillTag: "writing_task2_cohesion",
      },
    ],
  },

  // ==========================================
  // SPEAKING SECTION
  // ==========================================
  {
    id: "ielts-speak-01",
    exam: "ielts",
    section: "speaking",
    taskType: "speaking_part2_cue_card",
    difficulty: "intermediate",
    title: "IELTS Speaking Part 2: The 1-Minute Planning Blueprint",
    subtitle: "Deliver fluent, uninterrupted 2-minute long turns using structured storytelling frameworks",
    estimatedMinutes: 20,
    orderIndex: 4,
    learnContent: {
      overview:
        "In IELTS Speaking Part 2, the examiner gives you a task card (Cue Card) with 4 bullet points. You have exactly 1 minute to prepare notes and must speak continuously for 1 to 2 minutes without examiner interruption. You are judged on Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation.",
      strategyRules: [
        "Never write full sentences during your 1 minute of preparation; write 6-8 keywords, collocations, and an idiomatic anchor.",
        "Do not answer the bullet points mechanically like a robotic checklist ('First who, next where'). Tell a coherent chronological story with emotion and reflection.",
        "Aim to speak for a full 1 minute 50 seconds to 2 minutes until the examiner stops you.",
        "Use natural fillers for fluency when pausing: 'Let me think for a brief second...', 'What struck me most about that experience was...'",
        "Use a range of past tenses: Past Continuous ('I was wandering...'), Past Perfect ('I had never encountered...'), and Mixed Conditionals ('If I hadn't taken that detour...').",
      ],
      stepByStepMethod: [
        "1. Identify the core noun/event of the Cue Card within 5 seconds.",
        "2. Structure your notes vertically using the PPF framework: Past (Background/Context), Present (The Core Experience/Action), Future/Feeling (Reflection/Takeaway).",
        "3. Jot down 3 high-level adjectives or idioms you plan to incorporate naturally.",
        "4. Start speaking with an engaging hook instead of 'Today I want to talk about...'.",
        "5. Conclude your narrative with a philosophical or emotional reflection if you haven't been stopped by the 1:45 mark.",
      ],
      timeManagementRule:
        "During 1 min prep: 15s Context + 25s Details/Story + 20s Vocabulary & Reflection notes. While speaking: 30s Setup → 60s Main Climax/Event → 30s Reflection.",
      commonTraps: [
        "The 45-Second Silence Trap: Running out of things to say at 50 seconds because you gave brief factual answers instead of descriptive narrative.",
        "The Memorized Speech Trap: Reciting a pre-memorized speech. Examiners are trained to detect unnatural pacing and will change the prompt or dock your Fluency band.",
        "Monotone Delivery: Speaking without pitch modulation, stress on key words, or natural pauses.",
      ],
      usefulVocabulary: [
        {
          term: "Captivating",
          phonetic: "/ˈkæp.tɪ.veɪ.tɪŋ/",
          definition: "Capable of attracting and holding interest; charming.",
          collocations: ["captivating scenery", "utterly captivating"],
          examExample: "The historical architecture of the old quarter was utterly captivating.",
        },
        {
          term: "Nostalgic",
          phonetic: "/nɒsˈtæl.dʒɪk/",
          definition: "A feeling of pleasure and slight sadness when thinking about things in the past.",
          collocations: ["feel deeply nostalgic", "nostalgic reminder"],
          examExample: "Revisiting my childhood neighborhood evoked deeply nostalgic memories.",
        },
      ],
      naturalPhrases: [
        "If my memory serves me correctly...",
        "What truly set this apart from anything else was...",
        "Looking back on it in retrospect, I realize that...",
        "To put it into perspective...",
      ],
      speakingFrameworks: [
        {
          name: "The PPF Narrative Framework (Past - Present - Future/Feeling)",
          description: "Prevents drying up before 2 minutes while maintaining effortless coherence.",
          structure: [
            "1. Past (Background): Set the scene, when and why it happened (30s)",
            "2. Present/Plot (The Event): Describe the sensory details, interactions, and climax (60s)",
            "3. Future/Feeling (Reflection): How it shaped you and why it remains memorable (30s)",
          ],
          example:
            "Card: Describe a challenging journey.\n- Past: Backpacking in northern Norway during winter 2023.\n- Plot: Missed the last ferry due to a sudden blizzard; had to seek refuge in a fisherman's hut.\n- Reflection: Taught me resourcefulness and forged a lifelong appreciation for local hospitality.",
        },
      ],
      comparativeExamples: {
        prompt:
          "Cue Card: Describe an ambitious project you worked on.\nYou should say:\n- What the project was\n- Who you worked with\n- What challenges you faced\n- And explain how you felt after completing it.",
        weak: {
          text: "I did a project in school with my friend. It was about science. We had to make a model of solar system. Challenge was we don't have glue. We finish it and I felt happy.",
          score: "Band 5.0",
          explanation: "Too brief, lacks varied grammar and vocabulary, disjointed delivery.",
          identifiedErrors: ["Short disconnected sentences", "Elementary vocabulary", "No narrative expansion"],
        },
        good: {
          text: "I want to talk about a project I did at university two years ago. I worked with three classmates to build an automated greenhouse. The main difficulty was programming the temperature sensors. In the end, we got a top grade and I felt very proud of our teamwork.",
          score: "Band 6.5",
          explanation: "Covers all bullet points clearly with good grammar, but lacks idiomatic flair and complex sentence variety.",
          strengths: ["Clear sequencing", "Answers all prompts"],
        },
        excellent: {
          text: "If my memory serves me right, it was during the final semester of my undergraduate studies when my team embarked on designing an IoT-enabled hydroponic vertical garden. I collaborated with two close peers specializing in robotics. Our primary obstacle was reconciling conflicting sensor calibrations with real-time water flow rates—a hurdle that kept us in the lab well past midnight on multiple occasions. What struck me most was the collective adrenaline when the automated irrigation system finally triggered flawlessly. In retrospect, that endeavor not only honed my technical expertise but profoundly reshaped my approach to multidisciplinary problem-solving.",
          score: "Band 8.5 - 9.0",
          explanation: "Rich collocations ('IoT-enabled', 'reconciling conflicting calibrations', 'multidisciplinary problem-solving'), natural discourse markers, and engaging narrative rhythm.",
          keyHighlights: [
            "Seamless transition across the narrative arc.",
            "Sophisticated idiomatic expressions used in precise context.",
          ],
          examinerNote:
            "Candidate displays outstanding fluency with natural intonation, effortlessly sustaining complex thematic development for the full 2 minutes.",
        },
      },
      examDayTip:
        "Maintain eye contact with the examiner. If you make a small grammatical slip, do not panic; simply self-correct naturally ('or rather...') and keep moving forward smoothly.",
    },
    practiceTask: {
      id: "ielts-speak-01-p",
      title: "Part 2 Audio Response Simulation",
      instruction:
        "Prepare for 1 minute, then record your spoken answer for at least 90 seconds addressing the prompt below.",
      type: "speaking_recording",
      prompt:
        "Describe a skill that took you a significant amount of time to learn.\nYou should say:\n- What the skill is\n- Why you decided to learn it\n- How you practiced it\n- And explain how you feel now that you have mastered it.",
      hints: [
        "Use the PPF framework: When you started, the frustrating middle stage, and the rewarding outcome.",
        "Incorporate at least 2 elevated collocations: e.g., 'steep learning curve', 'tenacious persistence', 'immensely rewarding'.",
      ],
      targetTimeSeconds: 110,
      modelAnswer:
        "A skill that demanded an extraordinary degree of persistence from me was learning classical guitar fingerpicking. I was drawn to it after attending an acoustic concert where the soloist played intricate polyphonic melodies simultaneously. In the initial months, I faced a notoriously steep learning curve, as developing independent finger dexterity felt counterintuitive. I dedicated an hour every evening to metronome drills and muscle memory exercises. Looking back now, having achieved fluency with complex pieces, it has become an immensely rewarding creative sanctuary.",
      sampleBreakdown:
        "The response demonstrates a structured progression: initial inspiration -> technical hurdles & dedicated practice -> ultimate mastery & personal reflection.",
    },
    quiz: [
      {
        id: "ielts-speak-01-q1",
        question:
          "Which of the following is the most effective note-taking strategy during the 1-minute Part 2 preparation?",
        options: [
          "Writing out full sentences for the introduction and conclusion word-for-word.",
          "Writing 6-8 key conceptual bullet points, high-value collocations, and a structured story arc.",
          "Writing down the exact Kurdish or Arabic translations of difficult words.",
          "Sitting quietly and reciting the speech silently in your head without writing anything.",
        ],
        correctIndex: 1,
        explanation:
          "Writing concise keywords and collocations keeps your eyes free to engage with the examiner and prevents the unnatural, disjointed cadence that comes from trying to read whole written sentences.",
        skillTag: "speaking_part2_preparation",
      },
    ],
  },
];
