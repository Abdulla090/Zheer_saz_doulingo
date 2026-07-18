import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "store-assets/source/twino-feature-background-v1.png");
const output = join(root, "store-assets/google-play/feature-graphic-1024x500.png");
const appIconSource = join(root, "assets/images/real-app-icon.png");
const playIcon = join(root, "store-assets/google-play/app-icon-512.png");
const appStoreIcon = join(root, "store-assets/app-store/app-icon-1024.png");
const emberPath = join(root, "assets/images/mascots/pet-ember.webp");
const violetPath = join(root, "assets/images/mascots/pet-violet.webp");

await mkdir(dirname(output), { recursive: true });

const typography = Buffer.from(`
  <svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#ffffff" flood-opacity="0.92"/>
      </filter>
    </defs>
    <g font-family="Arial, Helvetica, sans-serif" fill="#101828" filter="url(#shadow)">
      <rect x="55" y="48" width="178" height="34" rx="17" fill="#FFFFFF" fill-opacity="0.82"/>
      <circle cx="74" cy="65" r="5" fill="#FF684E"/>
      <text x="88" y="70" font-size="13" font-weight="700" letter-spacing="1.4">KURDISH TO ENGLISH</text>

      <text x="53" y="158" font-size="69" font-weight="900" letter-spacing="2">TWINO</text>
      <rect x="57" y="176" width="72" height="7" rx="3.5" fill="#FF684E"/>
      <rect x="136" y="176" width="28" height="7" rx="3.5" fill="#3157F6"/>

      <text x="55" y="237" font-size="38" font-weight="800" letter-spacing="-0.8">ENGLISH THAT</text>
      <text x="55" y="280" font-size="38" font-weight="800" letter-spacing="-0.8">MOVES WITH YOU.</text>
      <text x="57" y="329" font-size="21" font-weight="600" fill="#344054">Learn. Speak. Grow.</text>

      <text x="57" y="392" font-size="16" font-weight="800" letter-spacing="1.05" fill="#344054">LESSONS  •  SPEAKING  •  DAILY GOALS</text>
    </g>
  </svg>
`);

await sharp(source)
  .resize(1024, 500, { fit: "cover", position: "center" })
  .composite([{ input: typography, left: 0, top: 0 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

await mkdir(dirname(appStoreIcon), { recursive: true });
await sharp(appIconSource)
  .resize(512, 512, { fit: "cover" })
  .flatten({ background: "#F5F5F5" })
  .png({ compressionLevel: 9 })
  .toFile(playIcon);

await sharp(appIconSource)
  .resize(1024, 1024, { fit: "cover" })
  .flatten({ background: "#F5F5F5" })
  .png({ compressionLevel: 9 })
  .toFile(appStoreIcon);

const [ember, violet] = await Promise.all([
  readFile(emberPath),
  readFile(violetPath),
]);
const shell = ({ kicker, title, subtitle, accent, body }) => Buffer.from(`
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FFF9EE"/><stop offset=".58" stop-color="#F8F8FF"/><stop offset="1" stop-color="#EEF2FF"/>
      </linearGradient>
      <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#172033" flood-opacity=".12"/>
      </filter>
    </defs>
    <rect width="1080" height="1920" fill="url(#bg)"/>
    <circle cx="1000" cy="80" r="270" fill="${accent}" opacity=".12"/>
    <circle cx="30" cy="1760" r="330" fill="#3157F6" opacity=".08"/>
    <g font-family="Arial, Helvetica, sans-serif" fill="#101828">
      <rect x="68" y="64" width="210" height="44" rx="22" fill="#FFFFFF" opacity=".9"/>
      <circle cx="91" cy="86" r="7" fill="${accent}"/>
      <text x="110" y="94" font-size="16" font-weight="800" letter-spacing="1.7">${kicker}</text>
      <text x="64" y="205" font-size="82" font-weight="900" letter-spacing="-3">${title}</text>
      <text x="68" y="264" font-size="27" font-weight="600" fill="#475467">${subtitle}</text>
      <g filter="url(#cardShadow)">
        <rect x="48" y="334" width="984" height="1498" rx="64" fill="#FFFFFF"/>
      </g>
      ${body}
    </g>
  </svg>
`);

const screenshots = [
  {
    name: "01-clear-learning-path",
    mascots: [{ source: ember, left: 90, top: 1250, width: 320, height: 320 }],
    svg: shell({
      kicker: "DAILY FLOW",
      title: "One clear next step.",
      subtitle: "A guided path that keeps momentum visible.",
      accent: "#FF684E",
      body: `
        <text x="102" y="430" font-size="20" font-weight="800" fill="#667085">TODAY</text>
        <text x="102" y="486" font-size="35" font-weight="900">Your learning path</text>
        <g transform="translate(764 401)"><rect width="190" height="64" rx="32" fill="#FFF4E8"/><text x="35" y="42" font-size="22" font-weight="800" fill="#D95636">12 DAY STREAK</text></g>
        <path d="M300 600 C720 650 390 820 710 930 C900 998 570 1130 710 1270 C780 1340 620 1450 540 1540" fill="none" stroke="#E7E9F2" stroke-width="18" stroke-linecap="round"/>
        <g>
          <circle cx="300" cy="600" r="78" fill="#3157F6"/><circle cx="300" cy="600" r="58" fill="#5D78FF"/><text x="278" y="616" font-size="48" font-weight="900" fill="#FFFFFF">1</text>
          <rect x="424" y="545" width="420" height="112" rx="32" fill="#F4F6FF"/><text x="462" y="590" font-size="19" font-weight="800" fill="#667085">COMPLETED</text><text x="462" y="628" font-size="27" font-weight="900">Everyday introductions</text>
          <circle cx="710" cy="930" r="86" fill="#FF684E"/><circle cx="710" cy="930" r="63" fill="#FF8A73"/><path d="M690 930 l18 18 34-42" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="130" y="872" width="430" height="126" rx="34" fill="#FFF7EC"/><text x="170" y="918" font-size="19" font-weight="800" fill="#D95636">UP NEXT</text><text x="170" y="960" font-size="29" font-weight="900">Speak in the real world</text>
          <circle cx="710" cy="1270" r="76" fill="#F1EAFE"/><path d="M681 1270 h58 M710 1241 v58" stroke="#8B5CF6" stroke-width="14" stroke-linecap="round"/>
          <circle cx="540" cy="1540" r="70" fill="#F2F4F7"/><path d="M520 1540 h40" stroke="#98A2B3" stroke-width="13" stroke-linecap="round"/>
        </g>
        <rect x="118" y="1650" width="844" height="92" rx="46" fill="#101828"/><text x="360" y="1707" font-size="25" font-weight="900" fill="#FFFFFF">CONTINUE LEARNING</text>
      `,
    }),
  },
  {
    name: "02-speaking-feedback",
    mascots: [{ source: violet, left: 682, top: 1310, width: 280, height: 280 }],
    svg: shell({
      kicker: "SPEAK",
      title: "Practice. Get sharper.",
      subtitle: "Useful feedback after every real speaking turn.",
      accent: "#8B5CF6",
      body: `
        <text x="102" y="430" font-size="20" font-weight="800" fill="#667085">LIVE PRACTICE</text>
        <text x="102" y="486" font-size="35" font-weight="900">Your speaking feedback</text>
        <rect x="100" y="550" width="880" height="270" rx="46" fill="#111827"/>
        <text x="146" y="614" font-size="18" font-weight="800" fill="#A5B4FC">YOU SAID</text>
        <text x="146" y="674" font-size="31" font-weight="700" fill="#FFFFFF">“I’d like to reserve a table.”</text>
        <g transform="translate(146 734)">
          <rect width="620" height="8" rx="4" fill="#344054"/>
          <rect width="516" height="8" rx="4" fill="#8B5CF6"/>
          <circle cx="70" cy="4" r="20" fill="#C4B5FD"/><circle cx="180" cy="4" r="28" fill="#A78BFA"/><circle cx="300" cy="4" r="17" fill="#DDD6FE"/><circle cx="420" cy="4" r="30" fill="#8B5CF6"/><circle cx="520" cy="4" r="21" fill="#C4B5FD"/>
        </g>
        <g transform="translate(100 870)">
          <rect width="425" height="190" rx="40" fill="#F5F3FF"/><text x="38" y="55" font-size="20" font-weight="800" fill="#7C3AED">FLUENCY</text><text x="38" y="124" font-size="58" font-weight="900">92</text><text x="135" y="124" font-size="24" font-weight="700" fill="#667085">/ 100</text>
          <rect x="455" width="425" height="190" rx="40" fill="#FFF7ED"/><text x="493" y="55" font-size="20" font-weight="800" fill="#EA580C">PRONUNCIATION</text><text x="493" y="124" font-size="58" font-weight="900">88</text><text x="590" y="124" font-size="24" font-weight="700" fill="#667085">/ 100</text>
        </g>
        <rect x="100" y="1095" width="880" height="300" rx="44" fill="#FAFAFA" stroke="#EAECF0" stroke-width="2"/>
        <text x="144" y="1160" font-size="20" font-weight="800" fill="#667085">A MORE NATURAL WAY</text>
        <text x="144" y="1225" font-size="31" font-weight="800">“Could I reserve a table for two?”</text>
        <rect x="144" y="1282" width="235" height="58" rx="29" fill="#EDE9FE"/><text x="180" y="1319" font-size="18" font-weight="800" fill="#7C3AED">LISTEN AND REPEAT</text>
        <rect x="118" y="1650" width="844" height="92" rx="46" fill="#8B5CF6"/><text x="380" y="1707" font-size="25" font-weight="900" fill="#FFFFFF">TRY ANOTHER TURN</text>
      `,
    }),
  },
  {
    name: "03-progress-and-streaks",
    mascots: [
      { source: violet, left: 565, top: 1544, width: 220, height: 220 },
      { source: ember, left: 730, top: 1518, width: 240, height: 240 },
    ],
    svg: shell({
      kicker: "GROW",
      title: "See the progress.",
      subtitle: "Daily goals, streaks, quests, and XP in one view.",
      accent: "#3157F6",
      body: `
        <text x="102" y="430" font-size="20" font-weight="800" fill="#667085">YOUR WEEK</text>
        <text x="102" y="486" font-size="35" font-weight="900">Momentum that feels real</text>
        <g transform="translate(100 548)">
          <rect width="880" height="270" rx="48" fill="#101828"/>
          <text x="48" y="66" font-size="20" font-weight="800" fill="#98A2B3">CURRENT STREAK</text><text x="48" y="158" font-size="78" font-weight="900" fill="#FFFFFF">12 DAYS</text><text x="48" y="207" font-size="22" font-weight="700" fill="#FDBA74">Best streak: 18 days</text>
          <circle cx="735" cy="135" r="86" fill="#FF684E"/><path d="M735 82 C775 130 785 176 735 190 C680 175 695 127 735 82Z" fill="#FFF" opacity=".95"/><path d="M735 120 C756 148 755 168 735 174 C715 168 714 148 735 120Z" fill="#FFB29F"/>
        </g>
        <g transform="translate(100 858)">
          <rect width="880" height="212" rx="42" fill="#F3F5FF"/>
          <text x="40" y="58" font-size="20" font-weight="800" fill="#3157F6">DAILY XP</text><text x="40" y="128" font-size="52" font-weight="900">780</text><text x="160" y="128" font-size="22" font-weight="700" fill="#667085">of 1,000 XP</text>
          <rect x="40" y="158" width="800" height="18" rx="9" fill="#D9DEFF"/><rect x="40" y="158" width="624" height="18" rx="9" fill="#3157F6"/>
        </g>
        <text x="100" y="1148" font-size="21" font-weight="800" fill="#667085">TODAY'S QUESTS</text>
        <g transform="translate(100 1182)">
          <rect width="880" height="112" rx="34" fill="#FFF7ED"/><circle cx="62" cy="56" r="30" fill="#FF684E"/><path d="M48 56 l10 10 19-24" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><text x="112" y="49" font-size="26" font-weight="900">Finish one speaking lesson</text><text x="112" y="79" font-size="18" font-weight="700" fill="#667085">Complete • +40 XP</text>
          <rect y="132" width="880" height="112" rx="34" fill="#F5F3FF"/><circle cx="62" cy="188" r="30" fill="#8B5CF6"/><text x="51" y="197" font-size="27" font-weight="900" fill="#fff">2</text><text x="112" y="181" font-size="26" font-weight="900">Learn ten useful words</text><text x="112" y="211" font-size="18" font-weight="700" fill="#667085">8 of 10 • +60 XP</text>
          <rect y="264" width="880" height="112" rx="34" fill="#EFF6FF"/><circle cx="62" cy="320" r="30" fill="#3157F6"/><text x="51" y="329" font-size="27" font-weight="900" fill="#fff">3</text><text x="112" y="313" font-size="26" font-weight="900">Review your next step</text><text x="112" y="343" font-size="18" font-weight="700" fill="#667085">Ready • +30 XP</text>
        </g>
      `,
    }),
  },
];

const playScreensDir = join(root, "store-assets/google-play/phone-screenshots");
const appStoreScreensDir = join(root, "store-assets/app-store/iphone-6.9-screenshots");
await Promise.all([mkdir(playScreensDir, { recursive: true }), mkdir(appStoreScreensDir, { recursive: true })]);

for (const screenshot of screenshots) {
  const playPath = join(playScreensDir, `${screenshot.name}-1080x1920.png`);
  const applePath = join(appStoreScreensDir, `${screenshot.name}-1290x2796.png`);
  const base = await sharp(screenshot.svg)
    .flatten({ background: "#FFF9EE" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const mascotLayers = await Promise.all(
    screenshot.mascots.map(async ({ source: mascotSource, left, top, width, height }) => ({
      input: await sharp(mascotSource)
        .resize(width, height, { fit: "contain" })
        .png()
        .toBuffer(),
      left,
      top,
    })),
  );
  const playScreenshot = await sharp(base)
    .composite(mascotLayers)
    .png({ compressionLevel: 9 })
    .toBuffer();
  await sharp(playScreenshot).toFile(playPath);
  await sharp(playScreenshot)
    .resize(1290, 2293, { fit: "fill" })
    .extend({
      top: 252,
      bottom: 251,
      left: 0,
      right: 0,
      background: "#FFF9EE",
    })
    .flatten({ background: "#FFF9EE" })
    .png({ compressionLevel: 9 })
    .toFile(applePath);
}

console.log([output, playIcon, appStoreIcon, ...screenshots.map(({ name }) => name)].join("\n"));
