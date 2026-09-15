import {
  BookOpen01Icon,
  BubbleChatIcon,
  HeadphonesIcon,
  Idea01Icon,
  MaskTheater01Icon,
  Mortarboard02Icon,
} from "@hugeicons/core-free-icons";
import type { GameModeKey } from "./games-theme";

export const GAME_MODES = [
  {
    key: "reading-practice",
    mode: "reading-practice" as GameModeKey,
    titleKey: "games.paragraphSpeechTitle",
    blurbKey: "games.readingBlurb",
    href: "/reading-practice" as const,
    icon: BookOpen01Icon,
  },
  {
    key: "podcast",
    mode: "podcast" as GameModeKey,
    titleKey: "games.podcastTitle",
    blurbKey: "games.podcastBlurb",
    href: "/podcast" as const,
    icon: HeadphonesIcon,
  },
  {
    key: "slang",
    mode: "slang" as GameModeKey,
    titleKey: "games.slangTitle",
    blurbKey: "games.slangBlurb",
    href: "/slang" as const,
    icon: BubbleChatIcon,
  },
  {
    key: "roleplay",
    mode: "roleplay" as GameModeKey,
    titleKey: "games.rolePlayTitle",
    blurbKey: "games.rolePlaySub",
    href: "/roleplay" as const,
    icon: MaskTheater01Icon,
  },
  {
    key: "ai-teacher",
    mode: "ai-teacher" as GameModeKey,
    titleKey: "games.teacherTitle",
    blurbKey: "games.teacherBlurb",
    href: "/ai-teacher" as const,
    icon: Mortarboard02Icon,
  },
  {
    key: "study-tutor",
    mode: "study-tutor" as GameModeKey,
    titleKey: "games.studyTutorTitle",
    blurbKey: "games.studyTutorBlurb",
    href: "/study-tutor" as const,
    icon: Idea01Icon,
  },
] as const;
