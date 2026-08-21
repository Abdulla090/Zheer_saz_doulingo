import type { ReadinessTestDefinition } from "../../types/exam-center";

export const IELTS_READINESS_TEST: ReadinessTestDefinition = {
  exam: "ielts",
  title: "IELTS Exam Readiness Qualification Test",
  description:
    "A 15-minute diagnostic assessment containing representative tasks across Reading, Listening, Writing, and Speaking. Score 50% or higher to qualify and unlock the Full IELTS Mock Exam.",
  durationMinutes: 15,
  passingScorePercent: 50,
  questions: [
    {
      id: "ielts-qual-q1",
      exam: "ielts",
      section: "reading",
      taskType: "true_false_not_given",
      type: "multiple_choice",
      instruction: "Read the passage excerpt and select TRUE, FALSE, or NOT GIVEN.",
      prompt:
        "Passage:\n'In 2021, an international consortium of glaciologists deployed autonomous acoustic sensors across the Antarctic shelf. While early satellite data had suggested steady ice shelf thinning, the subsurface acoustic recordings revealed unexpected episodic surges in basal melt rates triggered by warm deep-water currents.'\n\nStatement:\n'The acoustic sensors confirmed that Antarctic ice shelves melt at a completely uniform, steady speed throughout the year.'",
      options: ["TRUE", "FALSE", "NOT GIVEN"],
      correctAnswer: 1, // FALSE
      timeLimitSeconds: 90,
      skillTag: "reading_tfng_direct_contradiction",
      difficultyWeight: 2,
    },
    {
      id: "ielts-qual-q2",
      exam: "ielts",
      section: "reading",
      taskType: "matching_headings",
      type: "multiple_choice",
      instruction: "Choose the heading that best captures the central communicative purpose of the paragraph.",
      prompt:
        "Paragraph:\n'Although automated micro-factories were initially marketed as a cost-effective solution for local manufacturing, small business owners have faced unexpected financial hurdles. Maintenance contracts for precision robotics remain prohibitively high, and the shortage of certified maintenance technicians has forced over a third of early adopters to suspend operations during hardware faults.'",
      options: [
        "A. The engineering mechanics of precision robotics",
        "B. The unforeseen operational costs of micro-factories",
        "C. Career opportunities for robotic certified technicians",
        "D. Strategies for marketing automated machinery",
      ],
      correctAnswer: 1, // B
      timeLimitSeconds: 90,
      skillTag: "reading_matching_headings_synthesis",
      difficultyWeight: 2,
    },
    {
      id: "ielts-qual-q3",
      exam: "ielts",
      section: "listening",
      taskType: "multiple_choice",
      type: "multiple_choice",
      instruction: "Listen to the simulated audio transcript and identify the speaker's final decision.",
      prompt:
        "Transcript Excerpt:\nSpeaker: 'We originally considered scheduling the keynote symposium on Thursday morning, but the auditorium is booked for faculty evaluations. Friday afternoon was suggested, but several international delegates depart before midday. So we've officially locked in Wednesday at 2:00 PM in Hall C.'\n\nQuestion:\nWhen will the keynote symposium take place?",
      options: [
        "Thursday morning in the auditorium",
        "Friday afternoon before midday",
        "Wednesday at 2:00 PM in Hall C",
        "Monday morning during faculty evaluations",
      ],
      correctAnswer: 2, // C
      timeLimitSeconds: 60,
      skillTag: "listening_distractor_filtering",
      difficultyWeight: 1,
    },
    {
      id: "ielts-qual-q4",
      exam: "ielts",
      section: "writing",
      taskType: "writing_task2_essay",
      type: "text_entry",
      instruction:
        "Write a 60-80 word academic argument using the PEEL structure (Point, Explanation, Example, Link).",
      prompt:
        "Prompt: Should public libraries receive government funding in the digital age?\nTask: Write a concise body paragraph supporting government funding for public libraries.",
      timeLimitSeconds: 300,
      skillTag: "writing_peel_argumentation",
      difficultyWeight: 3,
    },
    {
      id: "ielts-qual-q5",
      exam: "ielts",
      section: "speaking",
      taskType: "speaking_part3_discussion",
      type: "speaking_recording",
      instruction:
        "Record a 45-60 second spoken response explaining your perspective using the AREA framework.",
      prompt:
        "Question: How has digital communication impacted personal relationships in modern society?",
      timeLimitSeconds: 90,
      skillTag: "speaking_part3_abstract_discourse",
      difficultyWeight: 3,
    },
  ],
};

export const DET_READINESS_TEST: ReadinessTestDefinition = {
  exam: "det",
  title: "DET Exam Readiness Qualification Test",
  description:
    "A 15-minute diagnostic assessment containing representative tasks across Literacy, Comprehension, Conversation, and Production. Score 50% or higher to qualify and unlock the Full DET Mock Exam.",
  durationMinutes: 15,
  passingScorePercent: 50,
  questions: [
    {
      id: "det-qual-q1",
      exam: "det",
      section: "reading",
      taskType: "read_and_select",
      type: "word_selection",
      instruction: "Select ALL the real English words. Do not select fake pseudo-words.",
      prompt: "Identify the authentic English words from the selection below:",
      options: [
        "inevitable",
        "miscomprehend",
        "resilience",
        "unpolitely",
        "fluctuation",
        "satisfactorious",
      ],
      correctAnswer: [0, 2, 4], // inevitable, resilience, fluctuation
      timeLimitSeconds: 60,
      skillTag: "det_lexical_recognition_accuracy",
      difficultyWeight: 2,
    },
    {
      id: "det-qual-q2",
      exam: "det",
      section: "reading",
      taskType: "fill_in_the_blanks",
      type: "fill_blanks",
      instruction: "Complete the missing letters of the partially blank words in the passage.",
      prompt:
        "Passage:\n'Renewable energy sou____ [sources] are crucial for reducing greenhouse g__ [gas] emissions and mitigating the adve____ [adverse] impacts of global warming.'",
      correctAnswer: ["rces", "as", "rse"],
      timeLimitSeconds: 90,
      skillTag: "det_c_test_syntactic_closure",
      difficultyWeight: 2,
    },
    {
      id: "det-qual-q3",
      exam: "det",
      section: "listening",
      taskType: "listen_and_type",
      type: "text_entry",
      instruction: "Transcribe the sentence accurately with correct spelling and punctuation.",
      prompt:
        "Audio Dictation Prompt (Listen and Type):\n'The university library will extend its opening hours during the final examination period.'",
      correctAnswer:
        "The university library will extend its opening hours during the final examination period.",
      timeLimitSeconds: 60,
      skillTag: "det_dictation_acoustic_accuracy",
      difficultyWeight: 2,
    },
    {
      id: "det-qual-q4",
      exam: "det",
      section: "writing",
      taskType: "write_about_photo",
      type: "text_entry",
      instruction:
        "Write 2-3 sophisticated sentences describing the image within 60 seconds (minimum 30 words).",
      prompt:
        "Image Description Prompt: A team of software engineers analyzing code on multiple high-resolution monitors in a modern open-plan office with whiteboard diagrams in the background.",
      timeLimitSeconds: 60,
      skillTag: "det_photo_description_production",
      difficultyWeight: 3,
    },
    {
      id: "det-qual-q5",
      exam: "det",
      section: "speaking",
      taskType: "speak_about_photo",
      type: "speaking_recording",
      instruction:
        "Prepare for 20 seconds, then speak for at least 60 seconds describing the scene.",
      prompt:
        "Visual Prompt: An artisan baker in an apron carefully sliding a fresh loaf of sourdough bread into a rustic stone hearth oven with a wooden peel, surrounded by flour dust and baked baguettes.",
      timeLimitSeconds: 80,
      skillTag: "det_spoken_narration_fluency",
      difficultyWeight: 3,
    },
  ],
};
