import { UnitBank, LessonBank } from "../data/types";
import { appStorage } from "../lib/app-storage";

interface GenerationConfig {
  name: string;
  age: string;
  language: string;
  level: string;
  goal: string;
}

export async function generateCustomCurriculum(config: GenerationConfig): Promise<UnitBank[]> {
  // Simulate an AI generation delay for a realistic sleek experience (1.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const isKid = parseInt(config.age) > 0 && parseInt(config.age) <= 12;
  const isTravel = config.goal === "travel";
  const isCareer = config.goal === "career";
  const isBeginner = config.level === "beginner";

  // Build topics based on profile
  let topics: string[] = [];
  
  if (isKid) {
    topics = [
      "Animals & Pets",
      "Colors & Numbers",
      "My Family",
      "School Friends",
      "Playing Games",
      "Yummy Food",
      "Fun Hobbies",
      "Bedtime Stories",
      "Happy Feelings",
      "The Magic Zoo"
    ];
  } else if (isTravel) {
    topics = [
      "Airport & Flights",
      "Booking a Hotel",
      "Asking for Directions",
      "Ordering at a Restaurant",
      "Taking a Taxi",
      "Shopping & Money",
      "Emergencies Abroad",
      "Meeting Locals",
      "Train & Bus Travel",
      "Sightseeing"
    ];
  } else if (isCareer) {
    topics = [
      "Job Interview Basics",
      "Office Introductions",
      "Writing Emails",
      "Meeting Presentations",
      "Discussing Projects",
      "Negotiating Salaries",
      "Networking Events",
      "Working Remotely",
      "Business Calls",
      "Closing Deals"
    ];
  } else {
    // Default / Conversations / Brain
    topics = [
      "Basic Greetings",
      "Everyday Conversations",
      "Talking about Hobbies",
      "Making Plans",
      "Weather & Seasons",
      "Describing People",
      "Sharing Opinions",
      "Expressing Feelings",
      "Telling Stories",
      "Future Dreams"
    ];
  }

  // Adjust complexity based on level
  const wordComplexity = isBeginner ? "simple" : "advanced";

  const createLesson = (topic: string, index: number): LessonBank => {
    // We create realistic mock data tailored to the topic
    return {
      topic: `${topic}`,
      topicKu: `${topic} (وانە)`, // Appended localized generic
      words: [
        { english: isBeginner ? "Hello" : "Greetings", kurdish: "سڵاو" },
        { english: "Welcome", kurdish: "بەخێربێن" },
        { english: "Yes", kurdish: "بەڵێ" },
        { english: "No", kurdish: "نەخێر" },
      ],
      sentences: [
        { english: ["I", "am", "ready", "to", "learn"], kurdish: "من ئامادەم بۆ فێربوون" },
        { english: ["This", "is", "my", "path"], kurdish: "ئەمە ڕێگەی منە" }
      ],
      voices: [
        { prompt: "Say it clearly", target: isBeginner ? "Hello" : "Greetings", targetKurdish: "سڵاو" },
        { prompt: "Translate", target: "Welcome", targetKurdish: "بەخێربێن" }
      ],
      fillBlanks: [
        {
          parts: ["I ", " ready"],
          hint: "من ئامادەم",
          answer: "am",
          wrongs: ["is", "are", "be"]
        }
      ],
      conversations: [
        {
          situation: `Practicing ${topic}`,
          theyAsk: "Are you ready to start?",
          correct: "Yes, absolutely!",
          wrong1: "I like apples.",
          wrong2: "Goodbye.",
          wrong3: "No, tomorrow.",
          explanation: "Choosing the correct response based on context."
        }
      ]
    };
  };

  // Generate 2 Units, each with 10 Lessons
  const customUnits: UnitBank[] = [];
  
  // Unit 1
  const unit1: LessonBank[] = [];
  for (let i = 0; i < 10; i++) {
    const topic = topics[i % topics.length];
    unit1.push(createLesson(topic, i));
  }
  customUnits.push(unit1);

  // Unit 2 (Next Level)
  const unit2: LessonBank[] = [];
  for (let i = 0; i < 10; i++) {
    const topic = topics[(i + 5) % topics.length] + " (Advanced)";
    unit2.push(createLesson(topic, i + 10));
  }
  customUnits.push(unit2);

  // Save the newly generated curriculum to local storage so the loader can access it
  appStorage.setItemSync("twino.curriculum.cache.normal", JSON.stringify(customUnits));

  return customUnits;
}
