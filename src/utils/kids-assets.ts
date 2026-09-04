/**
 * Helper to resolve premium 3D smooth transparent cartoon assets for kids vocabulary words.
 * Also provides utility to filter words that map to distinct images.
 */

const DOG_IMG = require("../../assets/images/games/dog_3d.png");
const CAT_IMG = require("../../assets/images/games/cat_3d.png");
const BIRD_IMG = require("../../assets/images/games/bird_3d.png");
const FISH_IMG = require("../../assets/images/games/fish_3d.png");
const RABBIT_IMG = require("../../assets/images/games/rabbit_3d.png");

// 3D assets generated and made transparent via Python script
const ZEBRA_IMG = require("../../assets/images/games/zebra_3d.png");
const ELEPHANT_IMG = require("../../assets/images/games/elephant_3d.png");
const MONKEY_IMG = require("../../assets/images/games/monkey_3d.png");
const APPLE_IMG = require("../../assets/images/games/apple_3d.png");
const BANANA_IMG = require("../../assets/images/games/banana_3d.png");
const CAKE_IMG = require("../../assets/images/games/cake_3d.png");
const COOKIE_IMG = require("../../assets/images/games/cookie_3d.png");
const BALLOON_IMG = require("../../assets/images/games/balloon_3d.png");
const BABY_IMG = require("../../assets/images/games/baby_3d.png");
const STAR_IMG = require("../../assets/images/games/star_3d.png");
const CAR_IMG = require("../../assets/images/games/car_3d.png");
const MILK_IMG = require("../../assets/images/games/milk_3d.png");

// 5 additional animal assets processed in this batch
const LION_IMG = require("../../assets/images/games/lion_3d.png");
const TIGER_IMG = require("../../assets/images/games/tiger_3d.png");
const BEAR_IMG = require("../../assets/images/games/bear_3d.png");
const DUCK_IMG = require("../../assets/images/games/duck_3d.png");
const CHICKEN_IMG = require("../../assets/images/games/chicken_3d.png");

// Richer full-color art for words whose *_3d.png files are white line outlines.
const COLOR_PARROT = require("../../assets/images/games/colorful_parrot.png");
const MAGICAL_APPLE_TREE = require("../../assets/images/games/magical_apple_tree.png");

const ALL_IMAGES = [
  DOG_IMG,      // 0
  CAT_IMG,      // 1
  BIRD_IMG,     // 2
  FISH_IMG,     // 3
  RABBIT_IMG,   // 4
  ZEBRA_IMG,    // 5
  ELEPHANT_IMG, // 6
  MONKEY_IMG,   // 7
  APPLE_IMG,    // 8
  BANANA_IMG,   // 9
  CAKE_IMG,     // 10
  COOKIE_IMG,   // 11
  BALLOON_IMG,  // 12
  BABY_IMG,     // 13
  STAR_IMG,     // 14
  CAR_IMG,      // 15
  MILK_IMG,     // 16
  LION_IMG,     // 17
  TIGER_IMG,    // 18
  BEAR_IMG,     // 19
  DUCK_IMG,     // 20
  CHICKEN_IMG   // 21
];

/** Prefer colorful renders when the default *_3d asset is outline-only. */
const RICH_IMAGE_OVERRIDES: Partial<Record<number, number>> = {
  2: COLOR_PARROT,
  8: MAGICAL_APPLE_TREE,
};

/**
 * Returns an image key (0-21) for a given word, used to detect duplicates.
 * Returns -1 if no high-quality matching image is available.
 */
export function getImageKey(englishWord: string): number {
  if (!englishWord) return -1;
  const word = englishWord.toLowerCase().trim();
  // Strip common Arabic definite article "ال" for matching
  const stripped = word.replace(/^ال/, "").trim();
  const has = (...terms: string[]) => terms.some((t) => word === t || stripped === t);

  // 0: dog
  if (has("dog", "dogs", "puppy", "كلب", "چلب", "جرو", "كلاب", "چلاب")) return 0;
  // 1: cat
  if (has("cat", "cats", "kitten", "قطة", "بزونة", "قط", "قطط", "بزازين", "هريرة")) return 1;
  // 2: bird
  if (has("bird", "birds", "parrot", "طير", "طائر", "عصفور", "طيور", "عصافير", "ببغاء")) return 2;
  // 3: fish
  if (has("fish", "fishes", "سمكة", "سمچة", "سمك", "اسماك", "أسماك")) return 3;
  // 4: rabbit
  if (has("rabbit", "rabbits", "bunny", "أرنب", "ارنب", "أرانب", "ارانب")) return 4;
  
  // 5: zebra
  if (has("zebra", "zebras", "حمار وحشي", "حمار الوحش", "حمار_وحشي")) return 5;
  // 6: elephant
  if (has("elephant", "elephants", "فيل", "فيلة", "فيول")) return 6;
  // 7: monkey
  if (has("monkey", "monkeys", "قرد", "قرود", "شادي")) return 7;
  // 8: apple
  if (has("apple", "apples", "red", "تفاحة", "تفاح", "احمر", "أحمر", "حمراء")) return 8;
  // 9: banana
  if (has("banana", "bananas", "yellow", "موزة", "موز", "اصفر", "أصفر", "صفراء")) return 9;
  // 10: cake
  if (has("cake", "cakes", "كعكة", "كيك", "كيكة")) return 10;
  // 11: cookie
  if (has("cookie", "cookies", "بسكويت", "بسكوت", "كوكيز", "كعك")) return 11;
  // 12: balloon
  if (has("balloon", "balloons", "blue", "نفاخة", "بالون", "بالونة", "ازرق", "أزرق", "زرقاء")) return 12;
  // 13: baby
  if (has("baby", "babies", "طفل", "رضيع", "بيبي", "اطفال", "أطفال")) return 13;
  // 14: star
  if (has("star", "stars", "نجمة", "نجم", "نجوم")) return 14;
  // 15: car
  if (has("car", "cars", "toy", "سيارة", "سيارات", "لعبة", "لعبه")) return 15;
  // 16: milk
  if (has("milk", "حليب", "لبن")) return 16;

  // 17: lion
  if (has("lion", "lions", "أسد", "اسد", "اسود", "أسود")) return 17;
  // 18: tiger
  if (has("tiger", "tigers", "نمر", "نمور")) return 18;
  // 19: bear
  if (has("bear", "bears", "دب", "دببة")) return 19;
  // 20: duck
  if (has("duck", "ducks", "بطة", "بط", "بطات")) return 20;
  // 21: chicken
  if (has("chicken", "chickens", "دجاجة", "دجاج", "دياية")) return 21;

  // No high-quality matching image
  return -1;
}

export function getWord3DImage(englishWord: string): number {
  const key = getImageKey(englishWord);
  if (key === -1) {
    return ALL_IMAGES[0];
  }
  return RICH_IMAGE_OVERRIDES[key] ?? ALL_IMAGES[key];
}

/**
 * Filters words so each maps to a different image asset.
 * Returns at most `max` words, each with a unique visual.
 */
export function getWordsWithDistinctImages(
  words: { english: string; kurdish: string; arabic?: string }[],
  max: number = 4
): { english: string; kurdish: string; arabic?: string }[] {
  const usedKeys = new Set<number>();
  const result: { english: string; kurdish: string; arabic?: string }[] = [];

  for (const w of words) {
    let key = getImageKey(w.english);
    if (key === -1 && w.arabic) {
      key = getImageKey(w.arabic);
    }
    if (key !== -1 && !usedKeys.has(key)) {
      usedKeys.add(key);
      result.push(w);
      if (result.length >= max) break;
    }
  }

  // If we couldn't find enough unique ones, just take what we have
  return result;
}
