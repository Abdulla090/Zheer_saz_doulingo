import unit06 from '../src/data/normal-english/unit-6-travel-and-exploring';
import unit07 from '../src/data/normal-english/unit-7-idioms-and-slang';
import unit08 from '../src/data/normal-english/unit-8-digital-life';
import unit09 from '../src/data/normal-english/unit-9-relationships';
import unit10 from '../src/data/normal-english/unit-10-health-emergencies';

const units = [
  { name: 'unit-6-travel-and-exploring', data: unit06 },
  { name: 'unit-7-idioms-and-slang', data: unit07 },
  { name: 'unit-8-digital-life', data: unit08 },
  { name: 'unit-9-relationships', data: unit09 },
  { name: 'unit-10-health-emergencies', data: unit10 },
];

for (const { name, data } of units) {
  console.log(`\n================== ${name} (lessons: ${data.length}) ==================`);
  let missingTopicRu = 0;
  let wordsCount = 0, wordsMissingRu = 0;
  let voicesCount = 0, voicesMissingPromptRu = 0, voicesMissingTargetRu = 0;
  let sentencesCount = 0, sentencesMissingRu = 0;
  let fillBlanksCount = 0, fbMissingHint = 0, fbMissingParts = 0, fbMissingAnswer = 0, fbMissingWrongs = 0;
  let convCount = 0, convMissing = 0;

  // Let's also check for non-Russian / leaked Arabic, Kurdish, English in Russian fields
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const leaks: string[] = [];

  data.forEach((lesson, lIdx) => {
    if (!lesson.topicRu) {
      missingTopicRu++;
    } else if (arabicRegex.test(lesson.topicRu)) {
      leaks.push(`Lesson ${lIdx} topicRu has Arabic/Kurdish: ${lesson.topicRu}`);
    }

    lesson.words.forEach((w, wIdx) => {
      wordsCount++;
      if (!w.russian) {
        wordsMissingRu++;
      } else if (arabicRegex.test(w.russian)) {
        leaks.push(`Lesson ${lIdx} word ${wIdx} (${w.english}) has Arabic/Kurdish in russian: ${w.russian}`);
      }
    });

    lesson.voices.forEach((v, vIdx) => {
      voicesCount++;
      if (!v.promptRu) voicesMissingPromptRu++;
      else if (arabicRegex.test(v.promptRu)) leaks.push(`Lesson ${lIdx} voice ${vIdx} promptRu has Arabic/Kurdish: ${v.promptRu}`);

      if (!v.targetRussian) voicesMissingTargetRu++;
      else if (arabicRegex.test(v.targetRussian)) leaks.push(`Lesson ${lIdx} voice ${vIdx} targetRussian has Arabic/Kurdish: ${v.targetRussian}`);
    });

    lesson.sentences.forEach((s, sIdx) => {
      sentencesCount++;
      if (!s.russian) {
        sentencesMissingRu++;
      } else if (arabicRegex.test(s.russian)) {
        leaks.push(`Lesson ${lIdx} sentence ${sIdx} has Arabic/Kurdish in russian: ${s.russian}`);
      }
    });

    lesson.fillBlanks.forEach((fb, fbIdx) => {
      fillBlanksCount++;
      if (!fb.russianHint) fbMissingHint++;
      else if (arabicRegex.test(fb.russianHint)) leaks.push(`Lesson ${lIdx} fillBlank ${fbIdx} russianHint has Arabic/Kurdish: ${fb.russianHint}`);

      if (!fb.russianParts) fbMissingParts++;
      else {
        if (arabicRegex.test(fb.russianParts[0]) || arabicRegex.test(fb.russianParts[1])) {
          leaks.push(`Lesson ${lIdx} fillBlank ${fbIdx} russianParts has Arabic/Kurdish: ${JSON.stringify(fb.russianParts)}`);
        }
      }

      if (!fb.russianAnswer) fbMissingAnswer++;
      else if (arabicRegex.test(fb.russianAnswer)) leaks.push(`Lesson ${lIdx} fillBlank ${fbIdx} russianAnswer has Arabic/Kurdish: ${fb.russianAnswer}`);

      if (!fb.russianWrongs) fbMissingWrongs++;
      else {
        fb.russianWrongs.forEach((rw, rIdx) => {
          if (arabicRegex.test(rw)) leaks.push(`Lesson ${lIdx} fillBlank ${fbIdx} russianWrongs[${rIdx}] has Arabic/Kurdish: ${rw}`);
        });
      }
    });

    lesson.conversations.forEach((c, cIdx) => {
      convCount++;
      const fields = ['situationRu', 'theyAskRu', 'correctRu', 'wrong1Ru', 'wrong2Ru', 'wrong3Ru', 'explanationRu'] as const;
      for (const f of fields) {
        const val = c[f];
        if (!val) {
          convMissing++;
          break;
        } else if (arabicRegex.test(val)) {
          leaks.push(`Lesson ${lIdx} conv ${cIdx} ${f} has Arabic/Kurdish: ${val}`);
        }
      }
    });
  });

  console.log(JSON.stringify({
    missingTopicRu,
    words: { total: wordsCount, missingRu: wordsMissingRu },
    voices: { total: voicesCount, missingPromptRu: voicesMissingPromptRu, missingTargetRu: voicesMissingTargetRu },
    sentences: { total: sentencesCount, missingRu: sentencesMissingRu },
    fillBlanks: { total: fillBlanksCount, missingHint: fbMissingHint, missingParts: fbMissingParts, missingAnswer: fbMissingAnswer, missingWrongs: fbMissingWrongs },
    conversations: { total: convCount, missing: convMissing },
    leaksCount: leaks.length,
    leaksSample: leaks.slice(0, 10)
  }, null, 2));
}
