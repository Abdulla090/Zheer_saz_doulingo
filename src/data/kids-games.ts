// ── Kids interactive lesson authoring (10-step daily-life flow) ───────────────

export type KidsSceneKey =
  | "bedroom"
  | "kitchen"
  | "playground"
  | "closet"
  | "yard"
  | "art"
  | "backyard"
  | "living"
  | "street"
  | "night"
  | "bathroom"
  | "classroom"
  | "livingroom";

export type KidsChoice = {
  id: string;
  emoji: string;
  label: string;
  kurdishLabel?: string;
  arabicLabel?: string;
};

export type KidsGameStep =
  | {
      kind: "scene";
      scene: KidsSceneKey;
      prompt: string;
      promptAr?: string;
      correctId: string;
      choices: KidsChoice[];
    }
  | {
      kind: "bubble";
      prompt: string;
      promptAr?: string;
      correctId: string;
      choices: KidsChoice[];
    }
  | {
      kind: "feed";
      mascotEmoji: string;
      prompt: string;
      promptAr?: string;
      correctId: string;
      choices: KidsChoice[];
    }
  | {
      kind: "shadow";
      prompt: string;
      promptAr?: string;
      items: KidsChoice[];
    }
  | {
      kind: "native";
      kurdishPrompt: string;
      arabicPrompt?: string;
      correctId: string;
      choices: KidsChoice[];
    }
  | {
      kind: "simon";
      phrase: string;
      phraseAr?: string;
      correctId: string;
      choices: KidsChoice[];
    }
  | {
      kind: "train";
      words: string[];
      kurdishHint: string;
      arabicHint?: string;
      arabicWords?: string[];
      extraWords?: string[];
    }
  | {
      kind: "trick";
      showEmoji: string;
      showLabel: string;
      showLabelAr?: string;
      spokenWord: string;
      matches: boolean;
    }
  | {
      kind: "echo";
      prompt: string;
      target: string;
      targetKurdish: string;
      targetArabic?: string;
      imageRequire?: any;
    }
  | {
      kind: "treasure";
      pool: KidsChoice[];
      correctId: string;
    };
