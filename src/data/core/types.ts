export interface Concept {
  id: string;
  category: string;
  difficulty: number;
  targetLanguage: string;
}

export interface VocabularyConcept extends Concept {
  type: "vocabulary";
  phrase: string;
}

export interface GrammarConcept extends Concept {
  type: "grammar";
  rule: string;
  examples: string[];
}

export interface ConversationConcept extends Concept {
  type: "conversation";
  situation: string;
  theyAsk: string;
  correctResponse: string;
  wrongResponses: string[];
}

export interface FillBlankConcept extends Concept {
  type: "fillBlank";
  parts: [string, string];
  answer: string;
  wrongs: string[];
}

export interface LessonTemplate {
  id: string;
  unit: number;
  lessonNumber: number;
  topicId: string;
  concepts: (VocabularyConcept | GrammarConcept | ConversationConcept | FillBlankConcept)[];
}
