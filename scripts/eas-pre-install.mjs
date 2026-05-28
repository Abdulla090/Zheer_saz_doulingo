import { unlinkSync } from "node:fs";

for (const file of ["bun.lock", "bun.lockb"]) {
  try {
    unlinkSync(file);
  } catch {
    // ignore missing lockfiles
  }
}

console.log("EAS pre-install: removed bun lockfiles (npm + package-lock.json only)");
