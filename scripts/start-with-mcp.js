process.env.EXPO_UNSTABLE_MCP_SERVER = "1";

const { spawn } = require("child_process");

const child = spawn("npx", ["expo", "start", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
