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
  | "night";

export type KidsChoice = {
  id: string;
  emoji: string;
  label: string;
};

export type KidsGameStep =
  | {
      kind: "scene";
      scene: KidsSceneKey;
      prompt: string;
      correctId: string;
      choices: KidsChoice[];
    }
  | {
      kind: "bubble";
      prompt: string;
      correctId: string;
      choices: KidsChoice[];
    }
  | {
      kind: "feed";
      mascotEmoji: string;
      prompt: string;
      correctId: string;
      choices: KidsChoice[];
    }
  | {
      kind: "shadow";
      prompt: string;
      items: KidsChoice[];
    }
  | {
      kind: "native";
      kurdishPrompt: string;
      correctId: string;
      choices: KidsChoice[];
    }
  | {
      kind: "simon";
      phrase: string;
      correctId: string;
      choices: KidsChoice[];
    }
  | {
      kind: "train";
      words: [string, string];
      kurdishHint: string;
      extraWords?: string[];
    }
  | {
      kind: "trick";
      showEmoji: string;
      showLabel: string;
      spokenWord: string;
      matches: boolean;
    }
  | {
      kind: "echo";
      prompt: string;
      target: string;
      targetKurdish: string;
    }
  | {
      kind: "treasure";
      pool: KidsChoice[];
      correctId: string;
    };
