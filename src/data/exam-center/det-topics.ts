import type { PreparationTopic } from "../../types/exam-center";

export const DET_PREPARATION_TOPICS: PreparationTopic[] = [
  // ==========================================
  // DET LITERACY & COMPREHENSION
  // ==========================================
  {
    id: "det-read-01",
    exam: "det",
    section: "reading",
    taskType: "read_and_select",
    difficulty: "beginner",
    title: "Read and Select: Identifying Real English Words",
    subtitle: "Distinguish authentic English lexical items from convincing morphological pseudo-words",
    estimatedMinutes: 12,
    orderIndex: 1,
    learnContent: {
      overview:
        "In 'Read and Select', you are presented with a grid of words (some real, some artificial pseudo-words designed with legitimate English prefixes/suffixes). You have 1 minute to select only the real English words. Incorrect guesses receive negative scoring penalties, so guessing blindly destroys your score.",
      strategyRules: [
        "Select ONLY words you are 100% certain exist in English. Do not guess words that simply 'look or sound English'.",
        "Pseudo-words are created using real affixes on non-existent roots (e.g. 'unpolitely', 'discomprehend', 'profection').",
        "Pay special attention to silent letters and subtle misspellings (e.g. 'existance' vs 'existence', 'accomodate' vs 'accommodate').",
        "Keep your finger or cursor steady: clicking randomly in the final 5 seconds is the #1 cause of score drops.",
      ],
      stepByStepMethod: [
        "1. Scan the whole word grid quickly and click all the immediate, obvious everyday words first.",
        "2. Conduct a second pass on intermediate academic words: check root, prefix, and suffix validity.",
        "3. For unfamiliar words, ask: 'Can I define this or use it in a sentence right now?' If no, leave it UNSELECTED.",
        "4. Do not click 'Next' before the timer expires; double check for inadvertent misclicks.",
      ],
      timeManagementRule:
        "You have exactly 60 seconds. Spend 20s on immediate high-frequency words, 25s verifying intermediate words, and 15s quality-checking without impulsive guessing.",
      commonTraps: [
        "The Plausible Suffix Trap: Words like 'sensibility' are real, but pseudo-words like 'sensivity' or 'responsation' mimic real suffixes to trick you.",
        "The Double-Consonant Trap: Misspellings like 'embaras' or 'commitee'.",
        "The Over-Selection Penalty: Selecting 1 fake word cancels out the score earned from 1 correct word.",
      ],
      usefulVocabulary: [
        {
          term: "Substantiate",
          phonetic: "/səbˈstæn.ʃi.eɪt/",
          definition: "Provide evidence to support or prove the truth of.",
          collocations: ["substantiate claims", "fully substantiated"],
          examExample: "The researcher provided empirical data to substantiate her hypothesis.",
        },
        {
          term: "Incongruous",
          phonetic: "/ɪnˈkɒŋ.ɡru.əs/",
          definition: "Not in harmony or keeping with the surroundings or other aspects of something.",
          collocations: ["incongruous element", "seem incongruous"],
          examExample: "The modern glass tower looked incongruous amidst the historical stone buildings.",
        },
      ],
      naturalPhrases: [
        "A verifiable morphological construct...",
        "A clear distinction in English orthography...",
      ],
      comparativeExamples: {
        prompt: "Grid item: 'undeniably' vs 'unpolitely' vs 'perseverance' vs 'reconcept'",
        weak: {
          text: "Selected: undeniably, unpolitely, perseverance, reconcept (Selected all 4 because they sound English)",
          score: "Score: -20% penalty",
          explanation:
            "'unpolitely' is not standard English (the real word is 'impolitely') and 'reconcept' is a pseudo-word. Selecting both wiped out the points earned from 'undeniably' and 'perseverance'.",
          identifiedErrors: ["Guessed words based on plausible affixes without confirming actual usage."],
        },
        good: {
          text: "Selected: undeniably, perseverance (Left unpolitely and reconcept unselected)",
          score: "Score: 100% on this item",
          explanation: "Selected only authentic verified English vocabulary, strictly avoiding the pseudo-word traps.",
          strengths: ["Disciplined risk management", "Accurate lexical recognition"],
        },
        excellent: {
          text: "Selected: undeniably, perseverance. (Rejected unpolitely due to incorrect negative prefix 'un-' instead of 'im-', and rejected reconcept as a non-standard blend).",
          score: "Score: 100% with Mastery",
          explanation: "Candidate displays precise understanding of derivational morphology and orthographic accuracy.",
          keyHighlights: ["Zero false-positive selections.", "Maximized Literacy subscore efficiency."],
          examinerNote: "Demonstrates high-level lexical precision without speculative penalties.",
        },
      },
      examDayTip:
        "When in doubt, DO NOT select the word. The scoring algorithm penalizes false positives much more severely than omissions.",
    },
    practiceTask: {
      id: "det-read-01-p",
      title: "Read and Select Simulation",
      instruction: "Select ALL the real English words from the list below. Do NOT select fake words.",
      type: "word_selection",
      prompt: "Review the following words and identify the real English words:",
      options: [
        "infrastructure",
        "disunderstand",
        "meticulous",
        "precedental",
        "equilibrium",
        "satisfactorious",
      ],
      correctAnswer: [0, 2, 4], // infrastructure, meticulous, equilibrium
      hints: [
        "Is 'disunderstand' real, or is the actual word 'misunderstand'?",
        "Is 'satisfactorious' real, or is the actual word 'satisfactory'?",
      ],
      modelAnswer: "Selected: infrastructure, meticulous, equilibrium.",
      sampleBreakdown:
        "'infrastructure' (noun - physical/organizational systems), 'meticulous' (adj - showing great attention to detail), and 'equilibrium' (noun - state of balance) are standard English words. 'disunderstand', 'precedental', and 'satisfactorious' are artificial pseudo-words.",
    },
    quiz: [
      {
        id: "det-read-01-q1",
        question: "Which of the following contains ONLY authentic, valid English words?",
        options: [
          "rehabilitation, unpossible, cognitive",
          "flourish, ambiguous, longevity",
          "conveniently, beautification, overconfidate",
          "irregardless, authentic, distinctful",
        ],
        correctIndex: 1,
        explanation:
          "'flourish', 'ambiguous', and 'longevity' are all 100% standard English words. In other choices, 'unpossible', 'overconfidate', and 'distinctful' are non-existent pseudo-words.",
        skillTag: "det_lexical_recognition",
      },
    ],
  },

  {
    id: "det-read-02",
    exam: "det",
    section: "reading",
    taskType: "fill_in_the_blanks",
    difficulty: "intermediate",
    title: "Fill in the Blanks: C-Test Mastery & Contextual Clues",
    subtitle: "Complete partially omitted words in academic passages using syntactic and semantic constraints",
    estimatedMinutes: 15,
    orderIndex: 2,
    learnContent: {
      overview:
        "In the C-Test (Read and Complete), you are given a short passage where the second half of every second or third word is missing. You have 3 minutes to complete all blanks. This tests your reading comprehension, grammar mastery, collocation awareness, and vocabulary precision.",
      strategyRules: [
        "First, read the complete first sentence without typing anything. The first sentence is ALWAYS intact and establishes the context and topic.",
        "Look at the word class required: Is the blank a noun, verb, adjective, preposition, or conjunction?",
        "Check grammatical agreements: If a noun follows 'these', it must be plural. If a verb follows 'has been', it is likely a past participle (-ed/-en) or -ing.",
        "Count the missing letters! The input box gives you the EXACT number of characters needed.",
      ],
      stepByStepMethod: [
        "1. Read the first intact sentence to understand the subject (e.g. marine biology, renewable energy, ancient history).",
        "2. Tackle grammar/function words first: articles, pronouns, prepositions, conjunctions ('th___' -> 'that/this', 'wh___' -> 'which/while').",
        "3. Tackle content words: use the visible initial letters + letter count + sentence meaning to deduce the root word.",
        "4. Conduct a final read-through to ensure the completed paragraph flows naturally with zero grammatical breaks.",
      ],
      timeManagementRule:
        "You have 3 minutes per passage (usually 10-12 blanks). Allocate: 30s initial contextual read → 90s filling blanks → 60s final grammar & spelling verification.",
      commonTraps: [
        "The Letter-Count Mismatch: Typing a synonym that has 5 letters when the blank only allows 4 letters.",
        "Tense Inconsistency: Writing a present tense verb when the surrounding narrative is in the past tense ('stud___' -> 'studied' vs 'studies').",
      ],
      usefulVocabulary: [
        {
          term: "Prevalent",
          phonetic: "/ˈprev.əl.ənt/",
          definition: "Widespread in a particular area or at a particular time.",
          collocations: ["increasingly prevalent", "prevalent among"],
          examExample: "Sedentary lifestyles have become increasingly prevalent in modern urban centers.",
        },
      ],
      naturalPhrases: [
        "As a direct consequence of...",
        "Researchers have long observed that...",
      ],
      comparativeExamples: {
        prompt:
          "Passage: 'Solar energy has become increasingly pop____ as the co___ of photovoltaic pan____ continues to decline.'",
        weak: {
          text: "populary, cost, panals",
          score: "Score: 1/3",
          explanation: "'populary' is not an English adjective (needed 'popular'), 'panals' is misspelled (needed 'panels').",
          identifiedErrors: ["Part of speech mismatch", "Spelling error"],
        },
        good: {
          text: "popular, cost, panels",
          score: "Score: 3/3",
          explanation: "Accurately completed all three blanks with correct word forms, matching exact letter counts.",
          strengths: ["Grammatically and syntactically flawless"],
        },
        excellent: {
          text: "popular, cost, panels (Verified against sentence syntax: adjective modifying energy + singular noun + plural noun).",
          score: "Score: 3/3 Mastery",
          explanation: "Perfect execution backed by grammatical verification.",
          keyHighlights: ["Exact letter counts filled.", "Zero morphological errors."],
          examinerNote: "Demonstrates strong syntactic fluency under time constraints.",
        },
      },
      examDayTip:
        "The first letter of every blank is given to you. If a blank starts with 'wh' and has 3 letters missing, test 'which' (wh + 3 = 5 total) vs 'where' (wh + 3 = 5 total) based on whether it refers to a thing or a place.",
    },
    practiceTask: {
      id: "det-read-02-p",
      title: "C-Test Guided Practice",
      instruction: "Fill in the missing letters for each partially blank word in the passage below.",
      type: "fill_blanks",
      prompt:
        "Passage:\n'Forest ecosystems play a cru____ [crucial] role in mitigating climate change. They ab____ [absorb] vast quantities of carbon dioxide from the atm_______ [atmosphere] through the process of photosynthesis.'",
      correctAnswer: ["cial", "sorb", "osphere"],
      hints: [
        "cru____ (4 letters): an adjective meaning essential or of utmost importance.",
        "ab____ (4 letters): a verb meaning to take in or soak up.",
        "atm_______ (7 letters): the envelope of gases surrounding the earth.",
      ],
      modelAnswer: "crucial, absorb, atmosphere",
      sampleBreakdown:
        "'crucial' (cru + cial = 7 letters), 'absorb' (ab + sorb = 6 letters), 'atmosphere' (atm + osphere = 10 letters).",
    },
    quiz: [
      {
        id: "det-read-02-q1",
        question:
          "Sentence: 'The government dec____ to allocate additional fu____ to public transportation.' What are the two correct word completions?",
        options: [
          "decided / funds",
          "declaring / function",
          "decision / funding",
          "decrease / fuels",
        ],
        correctIndex: 0,
        explanation:
          "'decided' (past tense verb) and 'funds' (plural noun for money) fit both the syntactic structure and the policy context perfectly.",
        skillTag: "det_c_test_syntax",
      },
    ],
  },

  // ==========================================
  // DET PRODUCTION: SPEAKING & WRITING
  // ==========================================
  {
    id: "det-prod-01",
    exam: "det",
    section: "writing",
    taskType: "write_about_photo",
    difficulty: "intermediate",
    title: "Write About the Photo: Rich Imagery & Spatial Precision",
    subtitle: "Write sophisticated, multifaceted descriptions of images in 60 seconds",
    estimatedMinutes: 15,
    orderIndex: 3,
    learnContent: {
      overview:
        "In 'Write About the Photo', an image appears and you have exactly 60 seconds to write a description. While the minimum requirement is one sentence, scoring in the 120-150 range requires 2-3 complex sentences detailing the foreground, background, actions, and plausible inferences.",
      strategyRules: [
        "Never write a simplistic single sentence like 'There is a woman sitting in a library.' That caps your score around 70-80.",
        "Write 2 to 3 compound-complex sentences with precise spatial prepositions (in the foreground, situated adjacently, in the backdrop).",
        "Incorporate descriptive adjectives and adverbs: specify materials (timber, stainless steel), lighting (sun-drenched, dimly lit), and expressions (deep in concentration).",
        "Make a plausible contextual deduction: '...suggesting they may be collaborating on an academic project.'",
      ],
      stepByStepMethod: [
        "0-10s: Identify the primary subject, the setting, and key atmospheric or background elements.",
        "10-35s (Sentence 1): Describe the primary action and foreground subject using a participial or relative clause.",
        "35-50s (Sentence 2): Describe the backdrop, setting, and spatial arrangement with elevated vocabulary.",
        "50-60s (Sentence 3 or Editing): Add a plausible contextual deduction and check spelling of key terms.",
      ],
      timeManagementRule:
        "60 seconds total. Aim for 35 to 50 words. Do not spend more than 10 seconds thinking before you begin typing.",
      commonTraps: [
        "The Bare Minimum Trap: Submitting 7 words ('A man is cooking some food').",
        "The Hallucination Trap: Inventing wild fictional backstories that have no visual basis in the photograph.",
        "Spelling Typos under Time Pressure: Misspelling everyday descriptive words due to rushed typing.",
      ],
      usefulVocabulary: [
        {
          term: "Foreground",
          phonetic: "/ˈfɔː.ɡraʊnd/",
          definition: "The part of a view that is nearest to the observer.",
          collocations: ["in the immediate foreground", "prominently situated in the foreground"],
          examExample: "In the immediate foreground, a vintage bicycle rests against a weathered brick wall.",
        },
        {
          term: "Meticulously",
          phonetic: "/məˈtɪk.jə.ləs.li/",
          definition: "In a way that shows great attention to detail; very thoroughly.",
          collocations: ["meticulously arranged", "meticulously crafted"],
          examExample: "The scientific apparatus was meticulously arranged across the lab workbench.",
        },
      ],
      naturalPhrases: [
        "In the immediate foreground, a...",
        "The background features an array of...",
        "Judging by their posture and attire, it appears that...",
        "The scene conveys an atmosphere of serene productivity...",
      ],
      comparativeExamples: {
        prompt:
          "Image: An architect looking at blueprints on a large wooden table inside a bright modern studio with drafting tools around.",
        weak: {
          text: "A man is looking at paper. He is in an office.",
          score: "Score: 65 - 75",
          explanation: "Extremely rudimentary, short sentences, elementary vocabulary, zero spatial description.",
          identifiedErrors: ["Underdeveloped content", "No lexical variety", "Simplistic syntax"],
        },
        good: {
          text: "A focused architect is reviewing detailed building blueprints spread across a large wooden desk in a sunlit studio. In the background, various drafting tools and architectural models are neatly organized on the shelves.",
          score: "Score: 110 - 120",
          explanation: "Clear compound structure, good descriptive vocabulary ('sunlit studio', 'drafting tools'), accurate spatial organization.",
          strengths: ["Strong sentence variety", "Good topic vocabulary"],
        },
        excellent: {
          text: "In the immediate foreground, an architect is meticulously examining detailed blueprints spread across an expansive wooden drafting table. The sun-drenched studio in the backdrop features specialized design instruments and structural scale models, conveying an atmosphere of intense creative collaboration.",
          score: "Score: 135 - 150",
          explanation: "Outstanding lexical resource ('meticulously examining', 'sun-drenched studio', 'structural scale models'), sophisticated spatial phrasing, and evocative contextual inference.",
          keyHighlights: [
            "Flawless grammar with participial descriptors.",
            "Advanced spatial prepositional phrases.",
          ],
          examinerNote:
            "Exemplary Production and Literacy subscore performance. Rich imagery created in under 50 words.",
        },
      },
      examDayTip:
        "Practice typing with your eyes on the screen, not your keyboard. DET's proctoring AI tracks your gaze, and fast touch-typing leaves you 10 seconds to catch typos.",
    },
    practiceTask: {
      id: "det-prod-01-p",
      title: "Write About Photo Practice",
      instruction:
        "Describe the image below in 2-3 sophisticated sentences within 60 seconds.",
      type: "text_entry",
      prompt:
        "Image Description Prompt: A marine biologist in a wetsuit holding a waterproof digital tablet while diving alongside a vibrant coral reef teeming with tropical fish.",
      hints: [
        "Sentence 1: Describe the diver's action and specialized gear (wetsuit, waterproof tablet).",
        "Sentence 2: Describe the marine environment (vibrant coral reef, diverse marine fauna).",
        "Sentence 3: Add a deduction regarding ecological research or biodiversity monitoring.",
      ],
      minWords: 30,
      modelAnswer:
        "Submerged in turquoise waters, a marine researcher equipped with specialized diving gear records environmental data on a waterproof tablet. The surrounding aquatic landscape showcases a thriving coral reef populated by diverse tropical fish, suggesting an ongoing ecological monitoring expedition.",
      sampleBreakdown:
        "Features participial clause ('Submerged in...'), specialized vocabulary ('aquatic landscape', 'ecological monitoring expedition'), and flawless sentence cohesion.",
    },
    quiz: [
      {
        id: "det-prod-01-q1",
        question:
          "Which of the following responses will achieve the HIGHEST Production score in DET 'Write About the Photo'?",
        options: [
          "There is a chef who is cooking pasta in a big restaurant kitchen.",
          "In the foreground, an experienced chef is expertly plating a gourmet pasta dish inside a bustling commercial kitchen, while stainless steel cookware gleams under ambient lighting in the background.",
          "A chef cooks food. Food is hot. Kitchen is very clean and many people are eating there today.",
          "This image represents the philosophical relationship between modern culinary arts and agricultural sustainability in the post-industrial era.",
        ],
        correctIndex: 1,
        explanation:
          "Option B contains precise spatial orientation ('In the foreground', 'in the background'), vivid vocabulary ('expertly plating', 'gourmet', 'bustling commercial kitchen'), and two complex, well-balanced sentences describing both subject and setting.",
        skillTag: "det_photo_description_production",
      },
    ],
  },

  {
    id: "det-prod-02",
    exam: "det",
    section: "speaking",
    taskType: "speak_about_photo",
    difficulty: "advanced",
    title: "Speak About the Photo: 90-Second Spontaneous Narration",
    subtitle: "Deliver fluent, continuous spoken descriptions of visual scenes using the 4-Phase Vision Framework",
    estimatedMinutes: 18,
    orderIndex: 4,
    learnContent: {
      overview:
        "In 'Speak About the Photo', you are shown an image for 20 seconds of silent prep, after which recording begins automatically. You MUST speak for between 30 and 90 seconds. You are scored on pronunciation, acoustic fluency, lexical sophistication, grammatical variety, and task completion.",
      strategyRules: [
        "Do not stop speaking at 35 seconds! Aim to speak until at least the 75-85 second mark to demonstrate sustained acoustic fluency.",
        "Use the 4-Phase Vision Framework: Overview (15s) → Subject Detail (25s) → Background & Atmosphere (25s) → Inference/Hypothesis (20s).",
        "Vary your sentence starters: avoid beginning every sentence with 'I can see...' or 'There is...'.",
        "Use natural spoken discourse connectors: 'Notably...', 'Upon closer inspection...', 'What catches the eye is...'",
      ],
      stepByStepMethod: [
        "Phase 1 (Overview - 15s): Deliver a high-level summary of the overall scene and setting.",
        "Phase 2 (Central Subject - 25s): Describe the primary individuals/objects, their posture, expressions, and immediate actions.",
        "Phase 3 (Setting & Atmosphere - 25s): Detail the backdrop, lighting, weather/interior design, and secondary items.",
        "Phase 4 (Contextual Inference - 20s): Speculate on the backstory, relationship, or purpose of the scenario.",
      ],
      timeManagementRule:
        "20s prep (silent visual breakdown) → Speak from 0:00 to 1:20 (80 seconds total). Speak at a steady, measured pace rather than rushing.",
      commonTraps: [
        "The Early Silence Trap: Stopping after 25 seconds when you run out of things to describe.",
        "Repetitive Vocabulary: Using the word 'look' or 'picture' 10 times in 60 seconds.",
        "Robotic Pitch: Speaking without pitch modulation or natural stress pauses.",
      ],
      usefulVocabulary: [
        {
          term: "Panoramic",
          phonetic: "/ˌpæn.əˈræm.ɪk/",
          definition: "With a wide view of an extensive area in all directions.",
          collocations: ["panoramic vista", "panoramic view"],
          examExample: "The hikers paused to admire the panoramic mountain vista.",
        },
        {
          term: "Convivial",
          phonetic: "/kənˈvɪv.i.əl/",
          definition: "Friendly, lively, and enjoyable (atmosphere or event).",
          collocations: ["convivial atmosphere", "convivial gathering"],
          examExample: "The outdoor café was filled with patrons enjoying a convivial evening.",
        },
      ],
      naturalPhrases: [
        "Dominating the center of the frame is...",
        "Upon closer observation, one can discern...",
        "The lighting infuses the composition with a sense of...",
        "It is reasonable to infer that...",
      ],
      speakingFrameworks: [
        {
          name: "The 4-Phase Vision Framework",
          description: "Ensures seamless, fluent speech for the full 90 seconds without awkward silences.",
          structure: [
            "1. Macro Overview (15s): Setting the stage and broad genre",
            "2. Micro Focus (25s): Core figures, facial expressions, attire, actions",
            "3. Environmental Context (25s): Background objects, spatial layout, lighting",
            "4. Speculative Synthesis (20s): Purpose, emotion, outcome",
          ],
          example:
            "Scene: Farmers market.\n- Macro: A lively, bustling open-air market on a sunny morning.\n- Micro: A vendor in an apron handing organic heirloom tomatoes to a customer with a canvas tote.\n- Environment: Wooden crates brimming with colorful produce, canopies shading the walkway.\n- Speculative: Fosters community connection and sustainable farm-to-table consumption.",
        },
      ],
      comparativeExamples: {
        prompt:
          "Image: A group of university students gathered around a whiteboard in a high-tech study space, brainstorming diagrams with laptops open.",
        weak: {
          text: "I see students. They are four people. They have computers and they look at whiteboard. They write on it. The room is modern. That is all I see.",
          score: "Score: 70 - 80",
          explanation: "Speech halted at 20 seconds, monotone cadence, elementary syntax, abrupt finish.",
          identifiedErrors: ["Severe underlength", "Elementary grammar", "Lack of descriptive detail"],
        },
        good: {
          text: "This image depicts a group of four university students working together in a modern study lounge. In the center, a woman is writing a flowchart on a large whiteboard while her peers look at their laptops. The room has large windows with bright daylight coming in. They seem to be preparing for a group presentation.",
          score: "Score: 110 - 120",
          explanation: "Speaks for ~50 seconds, good cohesive flow, clear pronunciation, covers all major elements.",
          strengths: ["Good fluency", "Clear descriptive sequence"],
        },
        excellent: {
          text: "Dominating the composition is a collaborative study session among four university students inside a state-of-the-art academic facility. In the foreground, an individual is actively diagramming an intricate flowchart on a floor-to-ceiling whiteboard, while her teammates are seated around a contemporary conference table with open laptops, seemingly cross-referencing research data. The room is illuminated by ample natural daylight streaming through expansive glass facades. Based on their focused demeanor and animated body language, it is reasonable to deduce that they are finalizing a high-stakes engineering project.",
          score: "Score: 140 - 155",
          explanation: "Flawless acoustic fluency for 80+ seconds, sophisticated collocations ('state-of-the-art academic facility', 'animated body language', 'cross-referencing research data'), and natural intonation curves.",
          keyHighlights: [
            "Seamless transition across all 4 visual phases.",
            "Advanced discourse markers throughout.",
          ],
          examinerNote:
            "Demonstrates exceptional Conversation and Production mastery. Effortless lexical agility and natural speech rhythm.",
        },
      },
      examDayTip:
        "If you stumble on a word, take a brief breath, say 'specifically...' or 'that is to say...', and smoothly continue. The scoring model values natural self-recovery over sudden frozen silence.",
    },
    practiceTask: {
      id: "det-prod-02-p",
      title: "Speak About Photo Simulation",
      instruction:
        "View the prompt, prepare for 20 seconds, and speak for at least 75 seconds using the 4-Phase Vision Framework.",
      type: "speaking_recording",
      prompt:
        "Visual Prompt: An elderly craftsman in an artisan woodworking workshop carefully carving a piece of polished timber with specialized chisels, surrounded by shavings and hanging vintage hand tools.",
      hints: [
        "Phase 1: Setting and atmosphere (traditional artisan carpentry studio).",
        "Phase 2: The artisan (focused expression, dexterous hands, wood carving).",
        "Phase 3: The workshop (wood shavings, rack of vintage chisels, ambient warmth).",
        "Phase 4: Reflection (preservation of heritage craftsmanship in an era of mass automation).",
      ],
      targetTimeSeconds: 80,
      modelAnswer:
        "The image captures an intimate scene inside a traditional woodworking atelier, where a master artisan is absorbed in his craft. In the foreground, he delicately guides a fine-tipped chisel across a curved timber workpiece, surrounded by curly wood shavings scattered across the workbench. The backdrop showcases an impressive array of vintage hand saws, planes, and measuring gauges meticulously mounted on wooden racks. The entire scene radiates an aura of quiet mastery, illustrating the enduring beauty of heritage craftsmanship amidst our increasingly automated world.",
      sampleBreakdown:
        "Covers macro scene -> artisan micro action -> workshop environment -> philosophical reflection, sustaining advanced discourse for 80 seconds.",
    },
    quiz: [
      {
        id: "det-prod-02-q1",
        question:
          "What is the single most important strategy to prevent running out of things to say in DET 'Speak About the Photo'?",
        options: [
          "Repeat your opening sentence 3 times using different synonyms.",
          "Follow the 4-Phase Vision Framework: Macro Overview -> Subject Details -> Setting/Atmosphere -> Speculative Deduction.",
          "Describe only the colors of every single shirt and wall in the picture.",
          "Stop speaking immediately after 30 seconds to avoid making grammatical mistakes.",
        ],
        correctIndex: 1,
        explanation:
          "The 4-Phase framework guarantees you always have structured, progressive content to speak about, easily filling 75-85 seconds with rich, varied vocabulary and natural discourse markers.",
        skillTag: "det_speaking_photo_strategy",
      },
    ],
  },
];
