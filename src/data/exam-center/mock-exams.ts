import type { MockExamDefinition } from "../../types/exam-center";

export const IELTS_FULL_MOCK_EXAM: MockExamDefinition = {
  id: "ielts-mock-full-01",
  exam: "ielts",
  title: "IELTS Academic Full Mock Exam (Practice Test 1)",
  version: "2026.1",
  totalDurationMinutes: 165,
  sections: [
    {
      id: "ielts-sec-listening",
      section: "listening",
      title: "Section 1: Listening (4 Parts / Timed)",
      instruction:
        "You will listen to recordings and answer questions based on the audio. Write no more than TWO WORDS AND/OR A NUMBER for completion tasks.",
      durationMinutes: 30,
      questions: [
        {
          id: "ielts-m-l-q1",
          exam: "ielts",
          section: "listening",
          taskType: "form_completion",
          type: "text_entry",
          instruction: "Complete the notes below. Write NO MORE THAN TWO WORDS.",
          prompt:
            "Audio Scenario: Customer calling a community sports center.\nStaff: 'Welcome to Westbridge Sports. May I take your full name?'\nCustomer: 'Yes, it's Julian Sterling.'\nStaff: 'And your contact telephone number?'\nCustomer: 'It's 07946 228190.'\nStaff: 'Which membership tier are you interested in?'\nCustomer: 'I'd like to register for the Premium Aquatics package.'\n\nNotes:\n- Customer Name: Julian Sterling\n- Contact Number: 07946 228190\n- Package Requested: [Blank 1]",
          correctAnswer: "Premium Aquatics",
          timeLimitSeconds: 60,
          skillTag: "listening_form_completion",
          difficultyWeight: 1,
        },
        {
          id: "ielts-m-l-q2",
          exam: "ielts",
          section: "listening",
          taskType: "multiple_choice",
          type: "multiple_choice",
          instruction: "Choose the correct letter, A, B, or C.",
          prompt:
            "Audio Scenario: University lecture on urban microclimates.\nProfessor: 'While early researchers attributed urban heat islands strictly to dark asphalt surfaces, our recent satellite infrared surveys indicate that the loss of vegetative transpiration contributes over 60% of the localized thermal variance.'\n\nQuestion:\nAccording to the lecturer, what is the primary contributor to urban heat island intensity?",
          options: [
            "A. The prevalence of dark asphalt road surfaces",
            "B. The depletion of plant and tree transpiration",
            "C. Excessive heat emitted by air conditioning units",
          ],
          correctAnswer: 1, // B
          timeLimitSeconds: 60,
          skillTag: "listening_mcq_academic_lecture",
          difficultyWeight: 2,
        },
      ],
    },
    {
      id: "ielts-sec-reading",
      section: "reading",
      title: "Section 2: Reading (3 Academic Passages)",
      instruction:
        "Read the academic passages carefully and answer questions 1-40 within 60 minutes.",
      durationMinutes: 60,
      questions: [
        {
          id: "ielts-m-r-q1",
          exam: "ielts",
          section: "reading",
          taskType: "true_false_not_given",
          type: "multiple_choice",
          instruction: "Do the following statements agree with the information in the text?",
          prompt:
            "Passage Excerpt: 'The discovery of hydrothermal vent ecosystems in 1977 overturned the biological dogma that all complex life on Earth depends ultimately on solar photosynthesis. Instead, these deep-sea chemosynthetic organisms derive energy entirely from sulfur compounds spewing from geothermal fissures.'\n\nStatement: 'Prior to 1977, mainstream scientific consensus held that sunlight was indispensable for sustaining all complex life forms.'",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correctAnswer: 0, // TRUE
          timeLimitSeconds: 90,
          skillTag: "reading_tfng_dogma_paraphrase",
          difficultyWeight: 2,
        },
        {
          id: "ielts-m-r-q2",
          exam: "ielts",
          section: "reading",
          taskType: "matching_headings",
          type: "multiple_choice",
          instruction: "Choose the correct heading for the paragraph.",
          prompt:
            "Paragraph: 'Throughout the 19th century, urban expansion swallowed agricultural perimeters at an unprecedented rate. However, rather than generating municipal wealth as anticipated, the rapid influx of rural migrants overwhelmed sanitation infrastructures, causing recurrent cholera outbreaks that decimated industrial labor productivity.'",
          options: [
            "i. The sanitary consequences of unregulated urban sprawl",
            "ii. Innovations in nineteenth-century agricultural engineering",
            "iii. Medical breakthroughs in cholera eradication",
            "iv. Economic policies for managing labor migration",
          ],
          correctAnswer: 0, // i
          timeLimitSeconds: 90,
          skillTag: "reading_headings_consequence",
          difficultyWeight: 2,
        },
      ],
    },
    {
      id: "ielts-sec-writing",
      section: "writing",
      title: "Section 3: Writing (Task 1 & Task 2)",
      instruction:
        "You should spend about 20 minutes on Task 1 (150 words) and 40 minutes on Task 2 (250 words). Total time: 60 minutes.",
      durationMinutes: 60,
      questions: [
        {
          id: "ielts-m-w-q1",
          exam: "ielts",
          section: "writing",
          taskType: "writing_task1_academic",
          type: "text_entry",
          instruction:
            "Write a report of at least 150 words summarizing the key features and making comparisons where relevant.",
          prompt:
            "Task 1 Prompt: The chart shows the percentage of electricity generated from renewable sources in four European nations (Germany, Spain, Sweden, UK) between 2010 and 2024.\nSummarize the main trends, highlight key comparisons, and write a formal academic report (150+ words).",
          timeLimitSeconds: 1200,
          skillTag: "writing_task1_data_report",
          difficultyWeight: 3,
        },
        {
          id: "ielts-m-w-q2",
          exam: "ielts",
          section: "writing",
          taskType: "writing_task2_essay",
          type: "text_entry",
          instruction:
            "Write a formal discursive essay of at least 250 words. Give reasons for your answer and include relevant examples.",
          prompt:
            "Task 2 Prompt: Some people argue that technological automation will lead to widespread unemployment and social instability, while others maintain that it will create more fulfilling employment opportunities.\nDiscuss both views and give your own opinion.",
          timeLimitSeconds: 2400,
          skillTag: "writing_task2_discursive_essay",
          difficultyWeight: 3,
        },
      ],
    },
    {
      id: "ielts-sec-speaking",
      section: "speaking",
      title: "Section 4: Speaking (Parts 1, 2, and 3)",
      instruction:
        "Record your responses for Part 1 (Introduction), Part 2 (Cue Card 2-min long turn), and Part 3 (Two-way abstract discussion).",
      durationMinutes: 15,
      questions: [
        {
          id: "ielts-m-s-q1",
          exam: "ielts",
          section: "speaking",
          taskType: "speaking_part1",
          type: "speaking_recording",
          instruction: "Answer the personal question in 2-3 fluent sentences (20-30 seconds).",
          prompt: "Part 1: Do you prefer studying or working in a quiet environment or with background noise? Why?",
          timeLimitSeconds: 45,
          skillTag: "speaking_part1_fluency",
          difficultyWeight: 1,
        },
        {
          id: "ielts-m-s-q2",
          exam: "ielts",
          section: "speaking",
          taskType: "speaking_part2_cue_card",
          type: "speaking_recording",
          instruction:
            "Prepare notes for 1 minute, then speak for between 1 and 2 minutes continuously.",
          prompt:
            "Part 2 Cue Card:\nDescribe an environmental law or initiative you learned about.\nYou should say:\n- What the initiative is\n- How it operates\n- What impact it has had\n- And explain your personal opinion on its effectiveness.",
          timeLimitSeconds: 120,
          skillTag: "speaking_part2_narrative_development",
          difficultyWeight: 3,
        },
        {
          id: "ielts-m-s-q3",
          exam: "ielts",
          section: "speaking",
          taskType: "speaking_part3_discussion",
          type: "speaking_recording",
          instruction:
            "Deliver an extended analytical response using the AREA framework (40-60 seconds).",
          prompt:
            "Part 3: Who bears the primary responsibility for combating global climate change: individual citizens or multinational corporations?",
          timeLimitSeconds: 75,
          skillTag: "speaking_part3_societal_argumentation",
          difficultyWeight: 3,
        },
      ],
    },
  ],
};

export const DET_FULL_MOCK_EXAM: MockExamDefinition = {
  id: "det-mock-full-01",
  exam: "det",
  title: "Duolingo English Test (DET) Full Mock Simulation",
  version: "2026.1",
  totalDurationMinutes: 60,
  sections: [
    {
      id: "det-sec-adaptive-core",
      section: "reading",
      title: "DET Integrated Adaptive Battery",
      instruction:
        "Complete each timed task in sequence. Timers count down automatically. No backtracking is permitted.",
      durationMinutes: 60,
      questions: [
        {
          id: "det-m-q1",
          exam: "det",
          section: "reading",
          taskType: "read_and_select",
          type: "word_selection",
          instruction: "Select the real English words in the grid. Do not select fake words.",
          prompt: "Review the grid and select only authentic English words:",
          options: [
            "phenomenon",
            "improbable",
            "overconfidate",
            "systematically",
            "unprecautious",
            "sophistication",
          ],
          correctAnswer: [0, 1, 3, 5], // phenomenon, improbable, systematically, sophistication
          timeLimitSeconds: 60,
          skillTag: "det_read_select_mastery",
          difficultyWeight: 2,
        },
        {
          id: "det-m-q2",
          exam: "det",
          section: "reading",
          taskType: "fill_in_the_blanks",
          type: "fill_blanks",
          instruction: "Fill in the missing letters in the academic passage.",
          prompt:
            "Passage:\n'Cognitive psy______ [psychologists] have demonstrated that sp____ [spaced] repetition significantly enhances lo__-term [long-term] memory retention compared to mas___ [massed] cramming.'",
          correctAnswer: ["chologists", "aced", "ng", "sed"],
          timeLimitSeconds: 180,
          skillTag: "det_c_test_academic_context",
          difficultyWeight: 3,
        },
        {
          id: "det-m-q3",
          exam: "det",
          section: "listening",
          taskType: "listen_and_type",
          type: "text_entry",
          instruction: "Type the audio transcription accurately with correct capitalization and punctuation.",
          prompt:
            "Audio Prompt (Listen and Type):\n'The international conference on renewable architecture has been rescheduled to next September.'",
          correctAnswer:
            "The international conference on renewable architecture has been rescheduled to next September.",
          timeLimitSeconds: 60,
          skillTag: "det_dictation_speed_accuracy",
          difficultyWeight: 2,
        },
        {
          id: "det-m-q4",
          exam: "det",
          section: "writing",
          taskType: "write_about_photo",
          type: "text_entry",
          instruction:
            "Write 2-3 complex sentences describing the image (minimum 35 words). Time limit: 60 seconds.",
          prompt:
            "Visual Description Prompt: A biomedical researcher looking through an electron microscope in a sterile laboratory, surrounded by test tube racks and digital telemetry monitors.",
          timeLimitSeconds: 60,
          skillTag: "det_photo_writing_rich_imagery",
          difficultyWeight: 3,
        },
        {
          id: "det-m-q5",
          exam: "det",
          section: "speaking",
          taskType: "speak_about_photo",
          type: "speaking_recording",
          instruction:
            "Speak for at least 75 seconds describing the image using the 4-Phase Vision Framework.",
          prompt:
            "Visual Prompt: An expansive organic farm where agricultural workers are harvesting fresh greens under the morning sun, with rolling green hills and wind turbines visible on the horizon.",
          timeLimitSeconds: 90,
          skillTag: "det_photo_spoken_fluency",
          difficultyWeight: 3,
        },
        {
          id: "det-m-q6",
          exam: "det",
          section: "writing",
          taskType: "read_then_write",
          type: "text_entry",
          instruction:
            "Respond to the prompt in at least 75 words within 5 minutes. Support your answer with reasons and examples.",
          prompt:
            "Read, Then Write Prompt:\nDo you believe universities should make remote online attendance a permanent option for all undergraduate courses? Why or why not?",
          timeLimitSeconds: 300,
          skillTag: "det_read_then_write_timed_argument",
          difficultyWeight: 3,
        },
      ],
    },
  ],
};
