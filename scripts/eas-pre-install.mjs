import { unlinkSync } from "node:fs";

const requiredPublicEnvironment = [
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
];

const missingPublicEnvironment = requiredPublicEnvironment.filter(
  (name) => !process.env[name]?.trim(),
);

if (missingPublicEnvironment.length > 0) {
  throw new Error(
    `EAS build is missing required public environment variables: ${missingPublicEnvironment.join(
      ", ",
    )}`,
  );
}

for (const file of ["bun.lock", "bun.lockb"]) {
  try {
    unlinkSync(file);
  } catch {
    // ignore missing lockfiles
  }
}

console.log(
  "EAS pre-install: release environment verified; removed bun lockfiles (npm + package-lock.json only)",
);
