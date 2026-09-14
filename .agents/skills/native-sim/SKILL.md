---
name: native-sim
description: Stream and drive a live, cloud-hosted iOS Simulator for React Native / Expo apps on Windows using GitHub Actions runners, native-sim, and agent-device. Use when previewing, testing, taking UI snapshots, or automating iOS simulator actions without a local Mac.
---

# native-sim (iOS Simulator in the Cloud for Agents)

Stream a real, cloud-hosted iOS Simulator from GitHub Actions macOS runners directly to the browser, and drive it programmatically via `agent-device`.

## 1. Prerequisites & Setup

Run one-time installation:
```bash
npm install -g native-sim
npm install -g agent-device
gh auth login
native-sim doctor
```

Verify GitHub CLI authentication:
```bash
gh auth status
```

## 2. Start a Cloud Session with Agent Control

Inside the Expo / React Native project root:
```bash
native-sim up --public --agent --minutes 60
```
- `--public`: Free unlimited GitHub Actions minutes on public repos.
- `--agent`: Enables the `agent-device` daemon control surface.
- Output will display:
  1. Live browser stream URL (for visual inspection).
  2. The exact `agent-device connect proxy ...` command with credentials.

## 3. Connect the Agent

Execute the command printed by `native-sim`:
```bash
agent-device connect proxy \
  --daemon-base-url https://xxxxx.trycloudflare.com/agent-device \
  --daemon-auth-token <the-key>
```

## 4. Simulator Driving Commands (`agent-device`)

Once connected, drive the simulator:

### Device & App Management
```bash
# Verify active iOS simulator
agent-device devices --platform ios

# Open app using bundle identifier
agent-device open com.your.app --platform ios
```

### UI Inspection & Interaction
```bash
# Get structured accessibility tree (token-efficient, preferred over screenshots)
agent-device snapshot -i

# Tap / Press by label or element ref
agent-device press 'label="Explore"' --settle
agent-device press @e15 --settle

# Scrolling & Input
agent-device scroll down --settle
agent-device type "hello" --settle

# Visual verification screenshot
agent-device screenshot evidence.png
```

### Teardown & Cleanup
```bash
agent-device close
agent-device disconnect
native-sim down
# Or cancel all active runs:
native-sim down --all
```

## 5. Critical Rules & Performance Tips

1. **Token Efficiency**: Always prefer `agent-device snapshot -i` over `screenshot`. Use screenshots only for visual regression or final proof.
2. **Always `--settle`**: Every press/type/scroll interaction should include `--settle` to wait for animations and state updates to settle.
3. **Element Referencing**: Prefer accessibility labels or element ref identifiers (`@e12`) over raw coordinates.
4. **Never Build iOS Locally on Windows**: Compilation happens entirely on GitHub Actions macOS arm64 runners (`macos-15`/`macos-26`).
5. **Caching & Timings**:
   - **Cold Build**: ~33 minutes (full native compilation).
   - **Warm Cache (JS changes)**: ~7 minutes (re-uses cached binary via `@expo/fingerprint` and embeds JS bundle).
6. **Session Lifecycle**: Sessions are ephemeral. When the timer expires or `native-sim down` runs, runner and tunnel are destroyed.
