/** Named Kids-path illustrations supplied for the voice/image game prompts. */
const KIDS_IMAGES = {
  apple: require("../../assets/images/games/kids/apple.png"),
  book: require("../../assets/images/games/kids/book.png"),
  clock: require("../../assets/images/games/kids/clock.png"),
  familyHome: require("../../assets/images/games/kids/home.png"),
  happy: require("../../assets/images/games/kids/happy boy.png"),
  hungry: require("../../assets/images/games/kids/hungryboy.png"),
  mom: require("../../assets/images/games/kids/here is my mom.png"),
  student: require("../../assets/images/games/kids/student boy.png"),
  school: require("../../assets/images/games/kids/go to school.png"),
  familyDad: require("../../assets/images/games/kids/here is my dad.png"),
  familyBrother: require("../../assets/images/games/kids/here is my little brother.png"),
  familySister: require("../../assets/images/games/kids/here is my sister.png"),
  fruit: require("../../assets/images/games/kids/buying fruits.png"),
  food: require("../../assets/images/games/kids/nice food.png"),
  gift: require("../../assets/images/games/kids/giving gift.png"),
  sad: require("../../assets/images/games/kids/sad girl.png"),
  greeting: require("../../assets/images/games/kids/greetings.png"),
  location: require("../../assets/images/games/kids/giging location.png"),
  right: require("../../assets/images/games/kids/turn right.png"),
  straight: require("../../assets/images/games/kids/go straight.png"),
  library: require("../../assets/images/games/kids/library.png"),
  shop: require("../../assets/images/games/kids/shop.png"),
  hospital: require("../../assets/images/games/kids/hospital.png"),
} as const;

/**
 * Keep the existing illustrated fallback for animal lessons; the supplied
 * named scenes cover the daily-life, food, school, family, and street units.
 */
export function getKidsVoiceImage(
  target: string,
  unitIndex: number,
  lessonIndex: number,
): any | undefined {
  const phrase = target.toLowerCase();

  if (unitIndex === 1) {
    if (phrase.includes("shares an apple")) return KIDS_IMAGES.apple;
    if (phrase.includes("many apples")) return KIDS_IMAGES.apple;
    if (phrase.includes("good student")) return KIDS_IMAGES.student;
    if (phrase.includes("help my mother")) return KIDS_IMAGES.mom;
    if (phrase.includes("forgive my friend")) return KIDS_IMAGES.greeting;
  }

  if (unitIndex === 2) {
    if (phrase.includes("wake up")) return KIDS_IMAGES.clock;
    if (phrase.includes("eat an apple")) return KIDS_IMAGES.hungry;
    if (phrase.includes("wear a shirt")) return KIDS_IMAGES.student;
    if (phrase.includes("family at home")) return KIDS_IMAGES.familyHome;
    if (phrase.includes("read a book")) return KIDS_IMAGES.book;
    if (phrase.includes("feel very happy")) return KIDS_IMAGES.happy;
  }

  if (unitIndex === 3) {
    if (phrase.includes("eat an apple")) return KIDS_IMAGES.hungry;
    if (phrase.includes("drink water")) return KIDS_IMAGES.food;
    if (phrase.includes("eat fruit")) return KIDS_IMAGES.fruit;
    if (phrase.includes("eat a carrot")) return KIDS_IMAGES.fruit;
    if (phrase.includes("wake up")) return KIDS_IMAGES.clock;
    if (phrase.includes("read a book")) return KIDS_IMAGES.book;
    if (phrase.includes("help my mom")) return KIDS_IMAGES.mom;
  }

  if (unitIndex === 4) {
    if (phrase.includes("family at home")) return KIDS_IMAGES.familyHome;
    if (phrase.includes("grandma")) return KIDS_IMAGES.familyHome;
    if (phrase.includes("baby is crying")) return KIDS_IMAGES.sad;
    if (phrase.includes("shares an apple")) return KIDS_IMAGES.apple;
    if (phrase.includes("feel very happy")) return KIDS_IMAGES.happy;
    if (phrase.includes("clean my room")) return KIDS_IMAGES.familyHome;
    if (phrase.includes("my party")) return KIDS_IMAGES.gift;
    if (phrase.includes("read a book")) return KIDS_IMAGES.book;
    if (phrase.includes("my dog")) return KIDS_IMAGES.familyHome;
  }

  // Keep the parameter explicit so adding unit-specific named scenes remains
  // a local change instead of changing every lesson bank.
  void lessonIndex;
  return undefined;
}

