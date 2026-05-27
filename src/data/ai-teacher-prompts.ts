import type { AiTeacherPrompt } from "./ai-teacher-types";

export const AI_TEACHER_PROMPTS: AiTeacherPrompt[] = [
  {
    id: "hometown",
    title: "Describe your hometown",
    scenario:
      "Speak for about one minute. Mention location, what you like, and one change you would make.",
    mode: "speaking",
  },
  {
    id: "opinion",
    title: "Online learning opinion",
    scenario:
      "Do you think online learning is as effective as classroom learning? Explain your view with examples.",
    mode: "writing",
  },
  {
    id: "work",
    title: "Your ideal job",
    scenario:
      "Describe a job you would like to have in the future. Say why it interests you and what skills you need.",
    mode: "speaking",
  },
  {
    id: "letter",
    title: "Formal email",
    scenario:
      "Write a short email to a teacher requesting an extension for an assignment. Use polite, formal English.",
    mode: "writing",
  },
];
