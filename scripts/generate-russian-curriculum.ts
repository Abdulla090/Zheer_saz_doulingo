import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { LessonBank, UnitBank } from "../src/data/types";
import unit0BasicGreetingsAndIntroductions from "../src/data/normal-english/unit-0-basic-greetings-and-introductions";
import unit0bElementarySituations from "../src/data/normal-english/unit-0b-elementary-situations";
import unit1EverydayEssentials from "../src/data/normal-english/unit-1-everyday-essentials";
import unit2SocialAndDailyLife from "../src/data/normal-english/unit-2-social-and-daily-life";
import unit3WorkAndBusiness from "../src/data/normal-english/unit-3-work-and-business";
import unit4DeepConversations from "../src/data/normal-english/unit-4-deep-conversations";
import unit5SpecialEncounters from "../src/data/normal-english/unit-5-special-encounters";
import unit6TravelAndExploring from "../src/data/normal-english/unit-6-travel-and-exploring";
import unit7IdiomsAndSlang from "../src/data/normal-english/unit-7-idioms-and-slang";
import unit8DigitalLife from "../src/data/normal-english/unit-8-digital-life";
import unit9Relationships from "../src/data/normal-english/unit-9-relationships";
import unit10HealthEmergencies from "../src/data/normal-english/unit-10-health-emergencies";
import unit11MoneyShopping from "../src/data/normal-english/unit-11-money-shopping";
import unit12RealWorldMastery from "../src/data/normal-english/unit-12-real-world-mastery";
import unit13OpinionsAndConfidence from "../src/data/normal-english/unit-13-opinions-and-confidence";
import unit14FoodDiningStorytelling from "../src/data/normal-english/unit-14-food-dining-storytelling";
import unit15LogicPlansHypotheticals from "../src/data/normal-english/unit-15-logic-plans-hypotheticals";
import unit16ScienceMediaModernIssues from "../src/data/normal-english/unit-16-science-media-modern-issues";

type Job = { source: string; apply: (translated: string) => void };
type FillRecord = {
  fill: LessonBank["fillBlanks"][number];
  translatedFull?: string;
  translatedAnswer?: string;
};

const outputDir = join(process.env.TEMP ?? process.cwd(), "phingo-russian-curriculum");
const cachePath = join(outputDir, "translation-cache.json");
const canonicalUnits: UnitBank[] = [
  unit0BasicGreetingsAndIntroductions,
  unit0bElementarySituations,
  unit11MoneyShopping,
  unit14FoodDiningStorytelling,
  unit1EverydayEssentials,
  unit2SocialAndDailyLife,
  unit8DigitalLife,
  unit9Relationships,
  unit6TravelAndExploring,
  unit10HealthEmergencies,
  unit15LogicPlansHypotheticals,
  unit3WorkAndBusiness,
  unit13OpinionsAndConfidence,
  unit16ScienceMediaModernIssues,
  unit7IdiomsAndSlang,
  unit4DeepConversations,
  unit12RealWorldMastery,
  unit5SpecialEncounters,
];
const units = structuredClone(canonicalUnits) as UnitBank[];
const jobs: Job[] = [];
const fillRecords: FillRecord[] = [];
const translationCache = new Map<string, string>();
const translationOverrides = new Map<string, string>([
  ["Greetings & Hello", "Приветствия и знакомство"],
]);

function add(source: string, apply: (translated: string) => void) {
  const clean = source.trim();
  if (clean) jobs.push({ source: clean, apply });
}

function collectLesson(lesson: LessonBank) {
  add(lesson.topic, (value) => { lesson.topic = value; });

  lesson.words.forEach((word) => {
    add(word.english, (value) => { word.english = value; });
  });
  lesson.voices.forEach((voice) => {
    add(voice.target, (value) => { voice.target = value; });
  });
  lesson.sentences.forEach((sentence) => {
    add(sentence.english.join(" "), (value) => {
      sentence.english = value.split(/\s+/u).filter(Boolean);
    });
  });
  lesson.fillBlanks.forEach((fill) => {
    const record: FillRecord = { fill };
    fillRecords.push(record);
    add(`${fill.parts[0]} ${fill.answer} ${fill.parts[1]}`, (value) => {
      record.translatedFull = value;
    });
    add(fill.answer, (value) => { record.translatedAnswer = value; });
    fill.wrongs.forEach((wrong, index) => {
      add(wrong, (value) => { fill.wrongs[index] = value; });
    });
  });
  lesson.conversations.forEach((conversation) => {
    (["theyAsk", "correct", "wrong1", "wrong2", "wrong3"] as const).forEach((field) => {
      add(conversation[field], (value) => { conversation[field] = value; });
    });
  });
  lesson.paragraphSpeeches?.forEach((speech) => {
    speech.paragraphs.forEach((paragraph, index) => {
      add(paragraph, (value) => { speech.paragraphs[index] = value; });
    });
  });
}

function finalizeFills() {
  const stopwords = new Set(["это", "она", "они", "его", "ему", "для", "что", "как", "или", "при", "без", "есть"]);
  for (const record of fillRecords) {
    const full = record.translatedFull?.trim();
    if (!full) throw new Error("A translated fill-blank sentence is missing");

    const preferred = record.translatedAnswer?.trim();
    const preferredIndex = preferred ? full.toLocaleLowerCase("ru").indexOf(preferred.toLocaleLowerCase("ru")) : -1;
    let answer = preferredIndex >= 0 ? full.slice(preferredIndex, preferredIndex + preferred!.length) : "";
    let answerIndex = preferredIndex;

    if (!answer) {
      const candidates = [...full.matchAll(/[А-Яа-яЁё][А-Яа-яЁё-]{2,}/gu)]
        .filter((match) => !stopwords.has(match[0].toLocaleLowerCase("ru")))
        .sort((a, b) => b[0].length - a[0].length);
      const candidate = candidates[0];
      if (!candidate || candidate.index == null) throw new Error(`Cannot create Russian blank from: ${full}`);
      answer = candidate[0];
      answerIndex = candidate.index;
    }

    record.fill.parts = [
      full.slice(0, answerIndex).trim(),
      full.slice(answerIndex + answer.length).trim(),
    ];
    record.fill.answer = answer;
  }
}

units.flat().forEach(collectLesson);

function batches(sourceJobs: Job[]) {
  const result: Job[][] = [];
  let current: Job[] = [];
  let chars = 0;
  for (const job of sourceJobs) {
    if (current.length >= 45 || chars + job.source.length > 6200) {
      result.push(current);
      current = [];
      chars = 0;
    }
    current.push(job);
    chars += job.source.length + 20;
  }
  if (current.length) result.push(current);
  return result;
}

async function translateBatch(batch: Job[], attempt = 1): Promise<void> {
  const input = batch
    .map((job, index) => `[[[${String(index).padStart(4, "0")}]]] ${job.source}`)
    .join("\n");
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", "ru");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", input);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json() as unknown[][][];
    const translated = payload[0].map((part) => String(part[0] ?? "")).join("");
    const marker = /\[\[\[(\d{4})\]\]\]\s*/gu;
    const matches = [...translated.matchAll(marker)];
    if (matches.length !== batch.length) {
      throw new Error(`Expected ${batch.length} markers, received ${matches.length}`);
    }
    for (let matchIndex = 0; matchIndex < matches.length; matchIndex += 1) {
      const match = matches[matchIndex];
      const jobIndex = Number(match[1]);
      const start = (match.index ?? 0) + match[0].length;
      const end = matches[matchIndex + 1]?.index ?? translated.length;
      let value = translated.slice(start, end).trim();
      if (!value) value = await translateSingle(batch[jobIndex].source);
      translationCache.set(batch[jobIndex].source, value);
      batch[jobIndex].apply(value);
    }
  } catch (error) {
    if (attempt >= 3) throw error;
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    return translateBatch(batch, attempt + 1);
  }
}

async function translateSingle(source: string): Promise<string> {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", "ru");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", source);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Single translation failed with HTTP ${response.status}`);
  const payload = await response.json() as unknown[][][];
  const value = payload[0].map((part) => String(part[0] ?? "")).join("").trim();
  if (!value) throw new Error(`Empty single translation: ${source}`);
  return value;
}

function targetStrings(unit: UnitBank): string[] {
  return unit.flatMap((lesson) => [
    lesson.topic,
    ...lesson.words.map((word) => word.english),
    ...lesson.voices.map((voice) => voice.target),
    ...lesson.sentences.map((sentence) => sentence.english.join(" ")),
    ...lesson.fillBlanks.flatMap((fill) => [...fill.parts, fill.answer, ...fill.wrongs]),
    ...lesson.conversations.flatMap((conversation) => [
      conversation.theyAsk,
      conversation.correct,
      conversation.wrong1,
      conversation.wrong2,
      conversation.wrong3,
    ]),
    ...(lesson.paragraphSpeeches?.flatMap((speech) => speech.paragraphs) ?? []),
  ]).filter((value) => value.trim().length > 0);
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  try {
    const saved = JSON.parse(await readFile(cachePath, "utf8")) as Record<string, string>;
    Object.entries(saved).forEach(([source, translated]) => translationCache.set(source, translated));
  } catch {
    // The first run starts without a cache.
  }

  const pendingJobs = jobs.filter((job) => {
    const override = translationOverrides.get(job.source);
    if (override) {
      translationCache.set(job.source, override);
      job.apply(override);
      return false;
    }
    const cached = translationCache.get(job.source);
    if (!cached) return true;
    job.apply(cached);
    return false;
  });
  const groupedJobs = batches(pendingJobs);
  for (let index = 0; index < groupedJobs.length; index += 1) {
    await translateBatch(groupedJobs[index]);
    await writeFile(cachePath, JSON.stringify(Object.fromEntries(translationCache)), "utf8");
    if ((index + 1) % 10 === 0 || index === groupedJobs.length - 1) {
      console.log(`Translated ${index + 1}/${groupedJobs.length} batches`);
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  finalizeFills();

  for (let index = 0; index < units.length; index += 1) {
    const unit = units[index];
    if (unit.length !== 10) throw new Error(`Unit ${index + 1} has ${unit.length} lessons`);
    const strings = targetStrings(unit);
    const cyrillic = strings.filter((value) => /[А-Яа-яЁё]/u.test(value)).length;
    if (cyrillic / strings.length < 0.9) {
      throw new Error(`Unit ${index + 1} has insufficient Cyrillic coverage: ${cyrillic}/${strings.length}`);
    }
    await writeFile(
      join(outputDir, `unit-${String(index + 1).padStart(2, "0")}.json`),
      JSON.stringify(unit),
      "utf8",
    );
  }

  await writeFile(join(outputDir, "curriculum.json"), JSON.stringify(units), "utf8");
  console.log(`Wrote ${units.length} validated units to ${outputDir}`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
