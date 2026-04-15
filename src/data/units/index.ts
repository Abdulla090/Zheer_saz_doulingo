// Barrel: assembles ALL_UNITS — each entry is an array of 10 unique LessonBanks
// To add a unit: create unit-XX.ts, import here, push to ALL_UNITS.

import unit00 from "./unit-00";
import unit01 from "./unit-01";
import unit02 from "./unit-02";
import unit03 from "./unit-03";
import unit04 from "./unit-04";
import unit05 from "./unit-05";
import unit06 from "./unit-06";
import unit07 from "./unit-07";
import unit08 from "./unit-08";
import unit09 from "./unit-09";
import unit10 from "./unit-10";
import unit11 from "./unit-11";

import { UnitBank } from "../types";

export const ALL_UNITS: UnitBank[] = [
  unit00, // Unit  1: Street Greetings         (10 lessons)
  unit01, // Unit  2: Hanging Out & Plans       (10 lessons)
  unit02, // Unit  3: Daily Talk                (10 lessons)
  unit03, // Unit  4: Café & Fast Food          (10 lessons)
  unit04, // Unit  5: Feelings                  (10 lessons)
  unit05, // Unit  6: Social Media              (10 lessons)
  unit06, // Unit  7: Confrontation             (10 lessons)
  unit07, // Unit  8: Job Interview             (10 lessons)
  unit08, // Unit  9: Academic English          (10 lessons)
  unit09, // Unit 10: Phone & Appointments      (10 lessons)
  unit10, // Unit 11: Emergency & Help          (10 lessons)
  unit11, // Unit 12: Idioms & Expressions      (10 lessons)
];
