import { LessonTemplate } from "./types";

export const unit01Lesson0: LessonTemplate = {
  id: "u1_l0",
  unit: 1,
  lessonNumber: 0,
  topicId: "inviting_friends",
  concepts: [
    {
      id: "u1_l0_v1",
      category: "vocabulary",
      difficulty: 1,
      targetLanguage: "en",
      type: "vocabulary",
      phrase: "Wanna hang out?",
    },
    {
      id: "u1_l0_v2",
      category: "vocabulary",
      difficulty: 1,
      targetLanguage: "en",
      type: "vocabulary",
      phrase: "What time?",
    },
    {
      id: "u1_l0_v3",
      category: "vocabulary",
      difficulty: 1,
      targetLanguage: "en",
      type: "vocabulary",
      phrase: "You down?",
    },
    {
      id: "u1_l0_v4",
      category: "vocabulary",
      difficulty: 1,
      targetLanguage: "en",
      type: "vocabulary",
      phrase: "Come through",
    },
    {
      id: "u1_l0_v5",
      category: "vocabulary",
      difficulty: 1,
      targetLanguage: "en",
      type: "vocabulary",
      phrase: "Where at?",
    },
    {
      id: "u1_l0_c1",
      category: "conversation",
      difficulty: 2,
      targetLanguage: "en",
      type: "conversation",
      situation: "texting_friend_plans",
      theyAsk: "Hey, we're all hanging at Jake's place. You down?",
      correctResponse: "Yeah I'm down! What time should I come through?",
      wrongResponses: [
        "Yes, I would like to attend at Jake's house.",
        "I am available to join the gathering.",
        "No thank you, I cannot come tonight."
      ]
    },
    {
      id: "u1_l0_f1",
      category: "fillBlank",
      difficulty: 2,
      targetLanguage: "en",
      type: "fillBlank",
      parts: ["", "through, it's gonna be fun!"],
      answer: "Come",
      wrongs: ["Go", "Get", "Walk"]
    }
  ]
};
