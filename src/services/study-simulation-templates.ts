/**
 * Dynamic HTML5 Canvas / SVG simulation templates for Study Tutor STEM Presets.
 * These provide benchmark-quality, responsive, interactive physics and math
 * simulations running in the sandboxed execution runner.
 */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function wrapSimulationHtml(options: {
  title: string;
  bodyHtml: string;
  scriptJs: string;
  css?: string;
  isDark?: boolean;
}): string {
  const isDark = options.isDark ?? false;
  const bg = isDark ? "#0F172A" : "#FFFFFF";
  const surface = isDark ? "#1E293B" : "#F8FAFC";
  const text = isDark ? "#F8FAFC" : "#0F172A";
  const muted = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "#334155" : "#E2E8F0";
  const accent = "#2563EB";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>${escapeHtml(options.title)}</title>
  <style>
    :root {
      --bg: ${bg};
      --surface: ${surface};
      --text: ${text};
      --muted: ${muted};
      --border: ${border};
      --accent: ${accent};
      --success: #10B981;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
    }
    canvas {
      display: block;
      touch-action: none;
    }
    .sim-controls {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex-wrap: wrap;
      z-index: 10;
    }
    .sim-btn {
      background-color: var(--surface);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, transform 0.1s;
    }
    .sim-btn:active {
      transform: scale(0.96);
      background-color: var(--border);
    }
    .sim-btn.accent {
      background-color: var(--accent);
      color: #FFFFFF;
      border-color: var(--accent);
    }
    .sim-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.3px;
      background: var(--surface);
      border: 1px solid var(--border);
    }
    .sim-badge.success {
      background: rgba(16, 185, 129, 0.15);
      border-color: #10B981;
      color: #10B981;
    }
    ${options.css || ""}
  </style>
</head>
<body>
  ${options.bodyHtml}
  <script>
    (function() {
      window.sendToTwino = function(data) {
        try {
          var payload = typeof data === 'string' ? data : JSON.stringify(data);
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(payload);
          } else if (window.parent && window.parent !== window) {
            window.parent.postMessage(payload, '*');
          }
        } catch(e) {}
      };

      if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
          var r = typeof radii === 'number' ? radii : ((Array.isArray(radii) && radii[0]) || 0);
          r = Math.min(r, Math.min(w / 2, h / 2));
          this.beginPath();
          this.moveTo(x + r, y);
          this.arcTo(x + w, y, x + w, y + h, r);
          this.arcTo(x + w, y + h, x, y + h, r);
          this.arcTo(x, y + h, x, y, r);
          this.arcTo(x, y, x + w, y, r);
          this.closePath();
          return this;
        };
      }

      window.onerror = function(msg, url, line) {
        window.sendToTwino({ type: 'error', message: String(msg) + ' (line ' + line + ')' });
        return false;
      };

      function handleTwinoMessage(event) {
        try {
          var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data && data.type === 'set_theme') {
            var root = document.documentElement;
            if (data.theme) {
              root.style.setProperty('--bg', data.theme.bg);
              root.style.setProperty('--surface', data.theme.surface);
              root.style.setProperty('--text', data.theme.text);
              root.style.setProperty('--muted', data.theme.muted);
              root.style.setProperty('--border', data.theme.border);
            }
            if (typeof window.onThemeChange === 'function') {
              window.onThemeChange(data.isDark);
            }
          } else if (data && data.type === 'reset') {
            if (typeof window.resetSimulation === 'function') {
              window.resetSimulation();
            } else if (typeof window.reset === 'function') {
              window.reset();
            }
          }
        } catch(e) {}
      }

      window.addEventListener('message', handleTwinoMessage);
      document.addEventListener('message', handleTwinoMessage);

      try {
        ${options.scriptJs}
        window.sendToTwino({ type: 'ready' });
      } catch(err) {
        window.sendToTwino({ type: 'error', message: err.message });
      }
    })();
  </script>
</body>
</html>`;
}

/**
 * Ensures ANY dynamic simulation code or HTML produced by Gemini runs safely
 * in the sandboxed runner with Apple HIG theme variables, viewport responsiveness,
 * roundRect canvas compatibility, and bidirectional Twino bridge messaging.
 */
export function prepareSandboxedHtml(options: {
  html?: string;
  code?: string;
  title?: string;
  isDark?: boolean;
}): string {
  const isDark = options.isDark ?? false;
  const bg = isDark ? "#0F172A" : "#FFFFFF";
  const surface = isDark ? "#1E293B" : "#F8FAFC";
  const text = isDark ? "#F8FAFC" : "#0F172A";
  const muted = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "#334155" : "#E2E8F0";
  const accent = "#2563EB";

  let rawHtml = (options.html || "").trim();
  if (rawHtml.startsWith("```")) {
    rawHtml = rawHtml.replace(/^```(?:html|html5|xml)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  let rawCode = (options.code || "").trim();
  if (rawCode.startsWith("```")) {
    rawCode = rawCode.replace(/^```(?:javascript|js)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  // Swap if LLM inverted html and pure code
  if (
    rawHtml &&
    !rawHtml.includes("<") &&
    (rawHtml.includes("function") ||
      rawHtml.includes("var ") ||
      rawHtml.includes("let ") ||
      rawHtml.includes("const "))
  ) {
    rawCode = rawHtml;
    rawHtml = "";
  }

  if (
    rawCode &&
    (rawCode.includes("<canvas") ||
      rawCode.includes("<svg") ||
      rawCode.includes("<div") ||
      rawCode.includes("<!DOCTYPE") ||
      rawCode.includes("<html"))
  ) {
    rawHtml = rawCode;
    rawCode = "";
  }

  // If no HTML is provided, wrap code in full HTML5 canvas template
  if (!rawHtml || rawHtml.length < 15) {
    return wrapSimulationHtml({
      title: options.title || "Interactive Simulation",
      isDark,
      bodyHtml: `<canvas id="simCanvas" style="width:100%; height:200px; flex:1; display:block; touch-action:none;"></canvas>`,
      scriptJs:
        rawCode ||
        `
        var c = document.getElementById('simCanvas');
        if (c) {
          var ctx = c.getContext('2d');
          var dpr = window.devicePixelRatio || 1;
          var rect = c.getBoundingClientRect();
          c.width = rect.width * dpr;
          c.height = rect.height * dpr;
          ctx.scale(dpr, dpr);
          ctx.fillStyle = '#2563EB';
          ctx.beginPath();
          ctx.arc(rect.width / 2, rect.height / 2, 32, 0, Math.PI * 2);
          ctx.fill();
        }
      `,
    });
  }

  // If rawHtml is a fragment without <!DOCTYPE or <html, wrap it directly
  if (!/<!doctype|<html/i.test(rawHtml)) {
    return wrapSimulationHtml({
      title: options.title || "Interactive Simulation",
      isDark,
      bodyHtml: rawHtml,
      scriptJs: rawCode,
    });
  }

  // Full HTML document: inject Twino bridge, responsive viewport, and HIG styling
  const bridgeScript = `
  <script>
    (function() {
      if (!window.sendToTwino) {
        window.sendToTwino = function(data) {
          try {
            var payload = typeof data === 'string' ? data : JSON.stringify(data);
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(payload);
            } else if (window.parent && window.parent !== window) {
              window.parent.postMessage(payload, '*');
            }
          } catch(e) {}
        };
      }

      if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
          var r = typeof radii === 'number' ? radii : ((Array.isArray(radii) && radii[0]) || 0);
          r = Math.min(r, Math.min(w / 2, h / 2));
          this.beginPath();
          this.moveTo(x + r, y);
          this.arcTo(x + w, y, x + w, y + h, r);
          this.arcTo(x + w, y + h, x, y + h, r);
          this.arcTo(x, y + h, x, y, r);
          this.arcTo(x, y, x + w, y, r);
          this.closePath();
          return this;
        };
      }

      window.onerror = function(msg, url, line) {
        window.sendToTwino({ type: 'error', message: String(msg) + ' (line ' + line + ')' });
        return false;
      };

      function handleTwinoMessage(event) {
        try {
          var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data && data.type === 'set_theme') {
            var root = document.documentElement;
            if (data.theme) {
              root.style.setProperty('--bg', data.theme.bg);
              root.style.setProperty('--surface', data.theme.surface);
              root.style.setProperty('--text', data.theme.text);
              root.style.setProperty('--muted', data.theme.muted);
              root.style.setProperty('--border', data.theme.border);
            }
            if (typeof window.onThemeChange === 'function') {
              window.onThemeChange(data.isDark);
            }
          } else if (data && data.type === 'reset') {
            if (typeof window.resetSimulation === 'function') {
              window.resetSimulation();
            } else if (typeof window.reset === 'function') {
              window.reset();
            }
          }
        } catch(e) {}
      }

      window.addEventListener('message', handleTwinoMessage);
      document.addEventListener('message', handleTwinoMessage);

      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(function() { window.sendToTwino({ type: 'ready' }); }, 50);
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          setTimeout(function() { window.sendToTwino({ type: 'ready' }); }, 50);
        });
      }
    })();
  </script>`;

  const higHeadMeta = `
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    :root {
      --bg: ${bg};
      --surface: ${surface};
      --text: ${text};
      --muted: ${muted};
      --border: ${border};
      --accent: ${accent};
      --success: #10B981;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>`;

  let injected = rawHtml;
  if (/<head[^>]*>/i.test(injected)) {
    injected = injected.replace(/<head[^>]*>/i, (match) => `${match}\n${higHeadMeta}\n${bridgeScript}`);
  } else if (/<html[^>]*>/i.test(injected)) {
    injected = injected.replace(/<html[^>]*>/i, (match) => `${match}\n<head>${higHeadMeta}\n${bridgeScript}</head>`);
  } else {
    injected = `<head>${higHeadMeta}\n${bridgeScript}</head>\n${injected}`;
  }

  return injected;
}

/**
 * 1. Balance Scale Simulation
 */
export function generateBalanceScaleHtml(config: {
  equation?: string;
  initialLeft?: number;
  initialRight?: number;
  variableName?: string;
  solutionValue?: number;
}, isDark = false): string {
  const initLeft = config.initialLeft ?? 4;
  const initRight = config.initialRight ?? 12;
  const eq = config.equation || "2x + 4 = 12";

  return wrapSimulationHtml({
    title: "Balance Scale",
    isDark,
    bodyHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:4px;">
        <div id="statusBadge" class="sim-badge">DIFFERENCE: ${Math.abs(initLeft - initRight)}</div>
        <div class="sim-badge" style="color:var(--accent); font-weight:800;">${eq}</div>
      </div>
      <canvas id="scaleCanvas" style="width:100%; height:180px; flex:1;"></canvas>
      <div class="sim-controls" style="margin-top:6px;">
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:var(--muted)">Left:</span>
          <button class="sim-btn" onclick="addLeft(-1)">-1</button>
          <button class="sim-btn" onclick="addLeft(1)">+1</button>
          <button class="sim-btn accent" onclick="addLeft(4)">+4</button>
        </div>
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:var(--muted)">Right:</span>
          <button class="sim-btn" onclick="addRight(-1)">-1</button>
          <button class="sim-btn" onclick="addRight(1)">+1</button>
          <button class="sim-btn accent" onclick="addRight(4)">+4</button>
        </div>
        <button class="sim-btn" onclick="resetScale()">Reset</button>
      </div>
    `,
    scriptJs: `
      var left = ${initLeft};
      var right = ${initRight};
      var currentAngle = 0;
      var targetAngle = 0;
      var canvas = document.getElementById('scaleCanvas');
      var ctx = canvas.getContext('2d');
      var statusBadge = document.getElementById('statusBadge');

      function resize() {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      window.addEventListener('resize', resize);
      resize();

      function updateStatus() {
        var diff = left - right;
        var isBalanced = (diff === 0);
        targetAngle = Math.max(-0.25, Math.min(0.25, -diff * 0.04));
        if (isBalanced) {
          statusBadge.className = 'sim-badge success';
          statusBadge.innerText = '✓ EQUILIBRIUM BALANCED';
          window.sendToTwino({ type: 'haptic', style: 'success' });
          window.sendToTwino({ type: 'solved', message: 'Scale is balanced!' });
        } else {
          statusBadge.className = 'sim-badge';
          statusBadge.innerText = 'NET DIFFERENCE: ' + Math.abs(diff);
        }
      }

      window.addLeft = function(val) {
        left = Math.max(0, Math.min(30, left + val));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        updateStatus();
      };

      window.addRight = function(val) {
        right = Math.max(0, Math.min(30, right + val));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        updateStatus();
      };

      window.resetScale = function() {
        left = ${initLeft};
        right = ${initRight};
        window.sendToTwino({ type: 'haptic', style: 'medium' });
        updateStatus();
      };
      window.resetSimulation = window.resetScale;

      function render() {
        // Physics spring interpolation
        currentAngle += (targetAngle - currentAngle) * 0.15;

        var rect = canvas.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        ctx.clearRect(0, 0, w, h);

        var cx = w / 2;
        var cy = h * 0.45;
        var armLen = Math.min(w * 0.38, 140);

        // Fulcrum Base
        ctx.fillStyle = '#64748B';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - 24, h - 14);
        ctx.lineTo(cx + 24, h - 14);
        ctx.closePath();
        ctx.fill();

        // Fulcrum Pin
        ctx.fillStyle = '#94A3B8';
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.fill();

        // Tilting Beam
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(currentAngle);

        var isBalanced = (left === right);
        ctx.fillStyle = isBalanced ? '#10B981' : '#2563EB';
        ctx.beginPath();
        ctx.roundRect(-armLen, -4, armLen * 2, 8, 4);
        ctx.fill();

        // Pan strings and trays
        var lx = -armLen + 15;
        var rx = armLen - 15;
        ctx.restore();

        // World coordinates of pan connection points
        var leftPinX = cx + Math.cos(currentAngle) * lx - Math.sin(currentAngle) * 0;
        var leftPinY = cy + Math.sin(currentAngle) * lx + Math.cos(currentAngle) * 0;
        var rightPinX = cx + Math.cos(currentAngle) * rx - Math.sin(currentAngle) * 0;
        var rightPinY = cy + Math.sin(currentAngle) * rx + Math.cos(currentAngle) * 0;

        // Draw Left Suspension & Pan
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftPinX, leftPinY);
        ctx.lineTo(leftPinX, leftPinY + 36);
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(leftPinX - 26, leftPinY + 36, 52, 6, 3);
        ctx.fill();

        // Left Weight Badge
        ctx.fillStyle = isBalanced ? '#10B981' : '#3B82F6';
        ctx.beginPath();
        ctx.arc(leftPinX, leftPinY + 22, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(left, leftPinX, leftPinY + 22);

        // Draw Right Suspension & Pan
        ctx.beginPath();
        ctx.moveTo(rightPinX, rightPinY);
        ctx.lineTo(rightPinX, rightPinY + 36);
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(rightPinX - 26, rightPinY + 36, 52, 6, 3);
        ctx.fill();

        // Right Weight Badge
        ctx.fillStyle = isBalanced ? '#10B981' : '#3B82F6';
        ctx.beginPath();
        ctx.arc(rightPinX, rightPinY + 22, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(right, rightPinX, rightPinY + 22);

        requestAnimationFrame(render);
      }
      updateStatus();
      render();
    `,
  });
}

/**
 * 2. Coordinate Graph Simulation
 */
export function generateCoordinateGraphHtml(config: {
  equation?: string;
  initialSlope?: number;
  initialIntercept?: number;
}, isDark = false): string {
  const m = config.initialSlope ?? 2;
  const b = config.initialIntercept ?? 1;

  return wrapSimulationHtml({
    title: "Linear Coordinate Graph",
    isDark,
    bodyHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:4px;">
        <div id="eqBadge" class="sim-badge" style="color:var(--accent); font-weight:800;">y = ${m}x + ${b}</div>
        <div id="probeBadge" class="sim-badge">Touch graph to probe (x, y)</div>
      </div>
      <canvas id="graphCanvas" style="width:100%; height:180px; flex:1;"></canvas>
      <div class="sim-controls" style="margin-top:6px;">
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:var(--muted)">Slope m:</span>
          <button class="sim-btn" onclick="changeM(-0.5)">-0.5</button>
          <span id="mVal" style="font-weight:800; min-width:24px; text-align:center;">${m}</span>
          <button class="sim-btn" onclick="changeM(0.5)">+0.5</button>
        </div>
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:var(--muted)">Intercept b:</span>
          <button class="sim-btn" onclick="changeB(-1)">-1</button>
          <span id="bVal" style="font-weight:800; min-width:24px; text-align:center;">${b}</span>
          <button class="sim-btn" onclick="changeB(1)">+1</button>
        </div>
        <button class="sim-btn" onclick="resetGraph()">Reset</button>
      </div>
    `,
    scriptJs: `
      var slope = ${m};
      var intercept = ${b};
      var probeX = 1;
      var canvas = document.getElementById('graphCanvas');
      var ctx = canvas.getContext('2d');
      var eqBadge = document.getElementById('eqBadge');
      var probeBadge = document.getElementById('probeBadge');
      var mVal = document.getElementById('mVal');
      var bVal = document.getElementById('bVal');

      function resize() {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        draw();
      }
      window.addEventListener('resize', resize);
      resize();

      function updateLabels() {
        var sign = intercept >= 0 ? ' + ' : ' - ';
        eqBadge.innerText = 'y = ' + slope + 'x' + sign + Math.abs(intercept);
        mVal.innerText = slope;
        bVal.innerText = intercept;
        var probeY = (slope * probeX + intercept).toFixed(1);
        probeBadge.innerText = 'Point: (' + probeX.toFixed(1) + ', ' + probeY + ')';
      }

      window.changeM = function(delta) {
        slope = parseFloat((slope + delta).toFixed(1));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        updateLabels();
        draw();
      };

      window.changeB = function(delta) {
        intercept = parseFloat((intercept + delta).toFixed(1));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        updateLabels();
        draw();
      };

      window.resetGraph = function() {
        slope = ${m};
        intercept = ${b};
        probeX = 1;
        window.sendToTwino({ type: 'haptic', style: 'medium' });
        updateLabels();
        draw();
      };
      window.resetSimulation = window.resetGraph;

      canvas.addEventListener('pointerdown', handlePointer);
      canvas.addEventListener('pointermove', function(e) {
        if (e.buttons === 1) handlePointer(e);
      });

      function handlePointer(e) {
        var rect = canvas.getBoundingClientRect();
        var px = e.clientX - rect.left;
        var cx = rect.width / 2;
        var scale = 22;
        probeX = (px - cx) / scale;
        updateLabels();
        draw();
      }

      function draw() {
        var rect = canvas.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        ctx.clearRect(0, 0, w, h);

        var cx = w / 2;
        var cy = h / 2;
        var scale = 22;

        // Grid lines
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        for (var x = cx % scale; x < w; x += scale) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (var y = cy % scale; y < h; y += scale) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, cy); ctx.lineTo(w, cy); // X axis
        ctx.moveTo(cx, 0); ctx.lineTo(cx, h); // Y axis
        ctx.stroke();

        // Plot function y = m*x + b
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 3;
        ctx.beginPath();
        var xMin = -cx / scale;
        var xMax = (w - cx) / scale;
        var y1 = cy - (slope * xMin + intercept) * scale;
        var y2 = cy - (slope * xMax + intercept) * scale;
        ctx.moveTo(0, y1);
        ctx.lineTo(w, y2);
        ctx.stroke();

        // Y-intercept point (0, b)
        var interceptCanvasY = cy - intercept * scale;
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(cx, interceptCanvasY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Probe Point
        var probeCanvasX = cx + probeX * scale;
        var probeCanvasY = cy - (slope * probeX + intercept) * scale;
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(probeCanvasX, probeCanvasY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      updateLabels();
      draw();
    `,
  });
}

/**
 * 3. Lever Torque Simulation
 */
export function generateLeverTorqueHtml(config: {
  leftWeight?: number;
  leftDistance?: number;
  rightWeight?: number;
  rightDistance?: number;
}, isDark = false): string {
  const lw = config.leftWeight ?? 10;
  const ld = config.leftDistance ?? 2;
  const rw = config.rightWeight ?? 5;
  const rd = config.rightDistance ?? 4;

  return wrapSimulationHtml({
    title: "Torque & Rotational Equilibrium",
    isDark,
    bodyHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:4px;">
        <div id="torqueBadge" class="sim-badge">TORQUE: 0 N·m</div>
        <div class="sim-badge" style="color:var(--accent); font-weight:800;">τ = F · d</div>
      </div>
      <canvas id="torqueCanvas" style="width:100%; height:180px; flex:1;"></canvas>
      <div class="sim-controls" style="margin-top:6px;">
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:var(--muted)">Left Weight:</span>
          <button class="sim-btn" onclick="changeLw(-2)">-2</button>
          <span id="lwVal" style="font-weight:800; min-width:24px; text-align:center;">${lw}</span>
          <button class="sim-btn" onclick="changeLw(2)">+2</button>
        </div>
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:var(--muted)">Right Dist:</span>
          <button class="sim-btn" onclick="changeRd(-1)">-1</button>
          <span id="rdVal" style="font-weight:800; min-width:24px; text-align:center;">${rd}m</span>
          <button class="sim-btn" onclick="changeRd(1)">+1</button>
        </div>
        <button class="sim-btn" onclick="resetTorque()">Reset</button>
      </div>
    `,
    scriptJs: `
      var lw = ${lw};
      var ld = ${ld};
      var rw = ${rw};
      var rd = ${rd};
      var angle = 0;
      var targetAngle = 0;
      var canvas = document.getElementById('torqueCanvas');
      var ctx = canvas.getContext('2d');
      var torqueBadge = document.getElementById('torqueBadge');
      var lwVal = document.getElementById('lwVal');
      var rdVal = document.getElementById('rdVal');

      function resize() {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      window.addEventListener('resize', resize);
      resize();

      function update() {
        var tLeft = lw * ld;
        var tRight = rw * rd;
        var diff = tLeft - tRight;
        targetAngle = Math.max(-0.25, Math.min(0.25, -diff * 0.02));
        lwVal.innerText = lw;
        rdVal.innerText = rd + 'm';
        if (diff === 0) {
          torqueBadge.className = 'sim-badge success';
          torqueBadge.innerText = '✓ BALANCED (' + tLeft + ' N·m = ' + tRight + ' N·m)';
          window.sendToTwino({ type: 'haptic', style: 'success' });
          window.sendToTwino({ type: 'solved', message: 'Torque is in equilibrium!' });
        } else {
          torqueBadge.className = 'sim-badge';
          torqueBadge.innerText = 'NET TORQUE: ' + Math.abs(diff) + ' N·m';
        }
      }

      window.changeLw = function(d) {
        lw = Math.max(2, Math.min(24, lw + d));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        update();
      };
      window.changeRd = function(d) {
        rd = Math.max(1, Math.min(5, rd + d));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        update();
      };
      window.resetTorque = function() {
        lw = ${lw}; ld = ${ld}; rw = ${rw}; rd = ${rd};
        window.sendToTwino({ type: 'haptic', style: 'medium' });
        update();
      };
      window.resetSimulation = window.resetTorque;

      function render() {
        angle += (targetAngle - angle) * 0.12;
        var rect = canvas.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        ctx.clearRect(0, 0, w, h);

        var cx = w / 2;
        var cy = h * 0.55;
        var armLen = Math.min(w * 0.42, 150);

        // Fulcrum
        ctx.fillStyle = '#64748B';
        ctx.beginPath();
        ctx.moveTo(cx, cy); ctx.lineTo(cx - 20, h - 16); ctx.lineTo(cx + 20, h - 16);
        ctx.closePath(); ctx.fill();

        // Beam
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.fillStyle = (lw * ld === rw * rd) ? '#10B981' : '#2563EB';
        ctx.beginPath();
        ctx.roundRect(-armLen, -5, armLen * 2, 10, 4);
        ctx.fill();

        // Distance marks
        ctx.fillStyle = '#FFFFFF';
        for (var m = -4; m <= 4; m++) {
          if (m === 0) continue;
          var x = (m / 5) * armLen;
          ctx.beginPath(); ctx.arc(x, 0, 2, 0, Math.PI * 2); ctx.fill();
        }

        // Left Mass Box
        var lx = (-ld / 5) * armLen;
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.roundRect(lx - 16, -30, 32, 25, 4);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(lw + 'kg', lx, -14);

        // Right Mass Box
        var rx = (rd / 5) * armLen;
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.roundRect(rx - 16, -30, 32, 25, 4);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(rw + 'kg', rx, -14);

        ctx.restore();
        requestAnimationFrame(render);
      }
      update();
      render();
    `,
  });
}

/**
 * 4. Electrical Circuit Simulation
 */
export function generateCircuitSimHtml(config: {
  initialVoltage?: number;
  initialResistance?: number;
  componentName?: string;
}, isDark = false): string {
  const v = config.initialVoltage ?? 9;
  const r = config.initialResistance ?? 3;

  return wrapSimulationHtml({
    title: "Ohm's Law Circuit Simulation",
    isDark,
    bodyHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:4px;">
        <div id="currentBadge" class="sim-badge" style="color:var(--accent); font-weight:800;">Current I = 3.00 A</div>
        <div class="sim-badge">V = I · R</div>
      </div>
      <canvas id="circuitCanvas" style="width:100%; height:180px; flex:1;"></canvas>
      <div class="sim-controls" style="margin-top:6px;">
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:var(--muted)">Voltage (V):</span>
          <button class="sim-btn" onclick="changeV(-3)">-3V</button>
          <span id="vVal" style="font-weight:800; min-width:28px; text-align:center;">${v}V</span>
          <button class="sim-btn" onclick="changeV(3)">+3V</button>
        </div>
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:var(--muted)">Resistance (Ω):</span>
          <button class="sim-btn" onclick="changeR(-1)">-1Ω</button>
          <span id="rVal" style="font-weight:800; min-width:28px; text-align:center;">${r}Ω</span>
          <button class="sim-btn" onclick="changeR(1)">+1Ω</button>
        </div>
        <button class="sim-btn" onclick="resetCircuit()">Reset</button>
      </div>
    `,
    scriptJs: `
      var volts = ${v};
      var ohms = ${r};
      var particles = [];
      var canvas = document.getElementById('circuitCanvas');
      var ctx = canvas.getContext('2d');
      var currentBadge = document.getElementById('currentBadge');
      var vVal = document.getElementById('vVal');
      var rVal = document.getElementById('rVal');

      // Initialize electron particles around the loop
      for (var i = 0; i < 28; i++) {
        particles.push(i / 28);
      }

      function resize() {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      window.addEventListener('resize', resize);
      resize();

      function update() {
        var amps = volts / ohms;
        currentBadge.innerText = 'Current I = ' + amps.toFixed(2) + ' A | Power = ' + (volts * amps).toFixed(1) + ' W';
        vVal.innerText = volts + 'V';
        rVal.innerText = ohms + 'Ω';
      }

      window.changeV = function(d) {
        volts = Math.max(3, Math.min(24, volts + d));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        update();
      };
      window.changeR = function(d) {
        ohms = Math.max(1, Math.min(12, ohms + d));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        update();
      };
      window.resetCircuit = function() {
        volts = ${v}; ohms = ${r};
        window.sendToTwino({ type: 'haptic', style: 'medium' });
        update();
      };
      window.resetSimulation = window.resetCircuit;

      function render() {
        var rect = canvas.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        ctx.clearRect(0, 0, w, h);

        var amps = volts / ohms;
        var speed = amps * 0.002;

        var cx = w / 2;
        var cy = h / 2;
        var rw = Math.min(w * 0.75, 240);
        var rh = Math.min(h * 0.65, 110);
        var x0 = cx - rw / 2;
        var y0 = cy - rh / 2;

        // Draw circuit loop wire
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(x0, y0, rw, rh, 16);
        ctx.stroke();

        // Battery on left side
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.roundRect(x0 - 8, cy - 20, 16, 40, 4);
        ctx.fill();
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+' + volts + 'V', x0 + 26, cy + 4);

        // Light bulb on right side
        var glowRadius = Math.min(40, amps * 7);
        var gradient = ctx.createRadialGradient(x0 + rw, cy, 4, x0 + rw, cy, glowRadius + 10);
        gradient.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x0 + rw, cy, glowRadius + 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(x0 + rw, cy, 14, 0, Math.PI * 2);
        ctx.fill();

        // Resistor on top
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(cx - 24, y0 - 8, 48, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(ohms + 'Ω', cx, y0 + 4);

        // Animate moving electrons
        var perimeter = 2 * (rw + rh);
        ctx.fillStyle = '#60A5FA';
        for (var i = 0; i < particles.length; i++) {
          particles[i] = (particles[i] + speed) % 1;
          var dist = particles[i] * perimeter;
          var px = 0, py = 0;
          if (dist < rw) {
            px = x0 + dist; py = y0;
          } else if (dist < rw + rh) {
            px = x0 + rw; py = y0 + (dist - rw);
          } else if (dist < rw * 2 + rh) {
            px = x0 + rw - (dist - (rw + rh)); py = y0 + rh;
          } else {
            px = x0; py = y0 + rh - (dist - (rw * 2 + rh));
          }
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        requestAnimationFrame(render);
      }
      update();
      render();
    `,
  });
}

/**
 * 5. Atom Builder Simulation
 */
export function generateAtomBuilderHtml(config: {
  initialProtons?: number;
  initialNeutrons?: number;
  initialElectrons?: number;
  elementSymbol?: string;
  elementName?: string;
}, isDark = false): string {
  const p = config.initialProtons ?? 6;
  const n = config.initialNeutrons ?? 6;
  const e = config.initialElectrons ?? 6;

  return wrapSimulationHtml({
    title: "Bohr Model & Atomic Structure",
    isDark,
    bodyHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:4px;">
        <div id="atomBadge" class="sim-badge" style="color:var(--accent); font-weight:800;">Carbon (C) · Neutral</div>
        <div id="chargeBadge" class="sim-badge">Charge: 0</div>
      </div>
      <canvas id="atomCanvas" style="width:100%; height:180px; flex:1;"></canvas>
      <div class="sim-controls" style="margin-top:6px;">
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:#EF4444">P⁺:</span>
          <button class="sim-btn" onclick="changeP(-1)">-1</button>
          <span id="pVal" style="font-weight:800; min-width:20px; text-align:center;">${p}</span>
          <button class="sim-btn" onclick="changeP(1)">+1</button>
        </div>
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:#64748B">N⁰:</span>
          <button class="sim-btn" onclick="changeN(-1)">-1</button>
          <span id="nVal" style="font-weight:800; min-width:20px; text-align:center;">${n}</span>
          <button class="sim-btn" onclick="changeN(1)">+1</button>
        </div>
        <div style="display:flex; gap:4px; align-items:center;">
          <span style="font-size:11px; font-weight:700; color:#3B82F6">e⁻:</span>
          <button class="sim-btn" onclick="changeE(-1)">-1</button>
          <span id="eVal" style="font-weight:800; min-width:20px; text-align:center;">${e}</span>
          <button class="sim-btn" onclick="changeE(1)">+1</button>
        </div>
        <button class="sim-btn" onclick="resetAtom()">Reset</button>
      </div>
    `,
    scriptJs: `
      var protons = ${p};
      var neutrons = ${n};
      var electrons = ${e};
      var angle = 0;
      var canvas = document.getElementById('atomCanvas');
      var ctx = canvas.getContext('2d');
      var atomBadge = document.getElementById('atomBadge');
      var chargeBadge = document.getElementById('chargeBadge');
      var pVal = document.getElementById('pVal');
      var nVal = document.getElementById('nVal');
      var eVal = document.getElementById('eVal');

      var elements = [
        "", "Hydrogen (H)", "Helium (He)", "Lithium (Li)", "Beryllium (Be)", "Boron (B)",
        "Carbon (C)", "Nitrogen (N)", "Oxygen (O)", "Fluorine (F)", "Neon (Ne)", "Sodium (Na)"
      ];

      function resize() {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      window.addEventListener('resize', resize);
      resize();

      function update() {
        var netCharge = protons - electrons;
        var name = elements[protons] || ('Element ' + protons);
        var chargeText = netCharge === 0 ? 'Neutral' : (netCharge > 0 ? '+' + netCharge : '' + netCharge);
        atomBadge.innerText = name + ' · Z=' + protons;
        chargeBadge.innerText = 'Charge: ' + chargeText;
        if (netCharge === 0) {
          chargeBadge.className = 'sim-badge success';
        } else {
          chargeBadge.className = 'sim-badge';
        }
        pVal.innerText = protons;
        nVal.innerText = neutrons;
        eVal.innerText = electrons;
      }

      window.changeP = function(d) {
        protons = Math.max(1, Math.min(10, protons + d));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        update();
      };
      window.changeN = function(d) {
        neutrons = Math.max(0, Math.min(12, neutrons + d));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        update();
      };
      window.changeE = function(d) {
        electrons = Math.max(0, Math.min(10, electrons + d));
        window.sendToTwino({ type: 'haptic', style: 'light' });
        update();
      };
      window.resetAtom = function() {
        protons = ${p}; neutrons = ${n}; electrons = ${e};
        window.sendToTwino({ type: 'haptic', style: 'medium' });
        update();
      };
      window.resetSimulation = window.resetAtom;

      function render() {
        angle += 0.03;
        var rect = canvas.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        ctx.clearRect(0, 0, w, h);

        var cx = w / 2;
        var cy = h / 2;

        // Shell 1 (up to 2 electrons)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.stroke();

        // Shell 2 (up to 8 electrons)
        if (electrons > 2) {
          ctx.beginPath();
          ctx.arc(cx, cy, 70, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Nucleus
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(protons + 'P ' + neutrons + 'N', cx, cy);

        // Shell 1 Electrons
        var s1Count = Math.min(2, electrons);
        for (var i = 0; i < s1Count; i++) {
          var a = angle * 1.5 + (i * Math.PI);
          var ex = cx + Math.cos(a) * 38;
          var ey = cy + Math.sin(a) * 38;
          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Shell 2 Electrons
        var s2Count = Math.max(0, electrons - 2);
        for (var j = 0; j < s2Count; j++) {
          var a2 = -angle + (j * (Math.PI * 2 / Math.max(1, s2Count)));
          var ex2 = cx + Math.cos(a2) * 70;
          var ey2 = cy + Math.sin(a2) * 70;
          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.arc(ex2, ey2, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        requestAnimationFrame(render);
      }
      update();
      render();
    `,
  });
}

/**
 * 6. Chess Tactics Simulation
 */
export function generateChessTacticsHtml(config: {
  puzzleTitle?: string;
  instructions?: string;
  solutionFrom?: string;
  solutionTo?: string;
}, isDark = false): string {
  const instructions = config.instructions || "Tap white knight on e4, then tap f6 to fork king & queen!";

  return wrapSimulationHtml({
    title: "Chess Tactics: Knight Fork",
    isDark,
    bodyHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:4px;">
        <div id="chessBadge" class="sim-badge">MOVE WHITE KNIGHT</div>
        <div class="sim-badge" style="color:var(--accent); font-weight:800;">Knight Fork</div>
      </div>
      <canvas id="chessCanvas" style="width:100%; height:180px; flex:1;"></canvas>
      <div style="font-size:11px; color:var(--muted); text-align:center; margin:4px 0;">${instructions}</div>
      <div class="sim-controls">
        <button class="sim-btn" onclick="resetBoard()">Reset Puzzle</button>
      </div>
    `,
    scriptJs: `
      var knightPos = { col: 4, row: 4 }; // e4 (0-indexed col 4, row 4)
      var targetPos = { col: 5, row: 2 }; // f6 (col 5, row 2)
      var selected = false;
      var solved = false;
      var canvas = document.getElementById('chessCanvas');
      var ctx = canvas.getContext('2d');
      var chessBadge = document.getElementById('chessBadge');

      function resize() {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        draw();
      }
      window.addEventListener('resize', resize);
      resize();

      window.resetBoard = function() {
        knightPos = { col: 4, row: 4 };
        selected = false;
        solved = false;
        chessBadge.className = 'sim-badge';
        chessBadge.innerText = 'MOVE WHITE KNIGHT';
        window.sendToTwino({ type: 'haptic', style: 'medium' });
        draw();
      };
      window.resetSimulation = window.resetBoard;

      canvas.addEventListener('pointerdown', function(e) {
        if (solved) return;
        var rect = canvas.getBoundingClientRect();
        var px = e.clientX - rect.left;
        var py = e.clientY - rect.top;
        var size = Math.min(rect.width, rect.height) * 0.95;
        var sq = size / 8;
        var ox = (rect.width - size) / 2;
        var oy = (rect.height - size) / 2;

        var col = Math.floor((px - ox) / sq);
        var row = Math.floor((py - oy) / sq);
        if (col < 0 || col > 7 || row < 0 || row > 7) return;

        if (col === knightPos.col && row === knightPos.row) {
          selected = !selected;
          window.sendToTwino({ type: 'haptic', style: 'selection' });
          draw();
        } else if (selected && col === targetPos.col && row === targetPos.row) {
          knightPos = { col: col, row: row };
          selected = false;
          solved = true;
          chessBadge.className = 'sim-badge success';
          chessBadge.innerText = '✓ FORK SUCCESS: KING & QUEEN FORKED!';
          window.sendToTwino({ type: 'haptic', style: 'success' });
          window.sendToTwino({ type: 'solved', message: 'Knight fork completed!' });
          draw();
        }
      });

      function draw() {
        var rect = canvas.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        ctx.clearRect(0, 0, w, h);

        var size = Math.min(w, h) * 0.95;
        var sq = size / 8;
        var ox = (w - size) / 2;
        var oy = (h - size) / 2;

        // Draw 8x8 squares
        for (var r = 0; r < 8; r++) {
          for (var c = 0; c < 8; c++) {
            var isLight = (r + c) % 2 === 0;
            ctx.fillStyle = isLight ? '#E2E8F0' : '#475569';
            if (selected && c === knightPos.col && r === knightPos.row) {
              ctx.fillStyle = '#3B82F6';
            } else if (selected && c === targetPos.col && r === targetPos.row) {
              ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
            }
            ctx.fillRect(ox + c * sq, oy + r * sq, sq, sq);
          }
        }

        // Draw pieces
        ctx.font = Math.round(sq * 0.7) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Black King on g8 (col 6, row 0)
        ctx.fillStyle = '#0F172A';
        ctx.fillText('♚', ox + 6 * sq + sq / 2, oy + 0 * sq + sq / 2);

        // Black Queen on d7 (col 3, row 1)
        ctx.fillStyle = '#0F172A';
        ctx.fillText('♛', ox + 3 * sq + sq / 2, oy + 1 * sq + sq / 2);

        // White Knight
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('♞', ox + knightPos.col * sq + sq / 2, oy + knightPos.row * sq + sq / 2);
      }
      draw();
    `,
  });
}

/**
 * 7. Quantum Physics: Double-Slit Wave-Particle Duality Simulation
 */
export function generateQuantumPhysicsHtml(config?: {
  slitDistance?: number;
  wavelength?: number;
  intensity?: number;
}, isDark = false): string {
  const defaultSlitDist = config?.slitDistance ?? 40;
  const defaultWavelength = config?.wavelength ?? 20;

  return wrapSimulationHtml({
    title: "Quantum Physics: Double-Slit Interference",
    isDark,
    bodyHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:4px;">
        <div id="quantumBadge" class="sim-badge">QUANTUM WAVE DUALITY</div>
        <div class="sim-badge" style="color:var(--accent); font-weight:800;" id="particleCountBadge">Photons: 0</div>
      </div>
      <canvas id="quantumCanvas" style="width:100%; height:190px; flex:1;"></canvas>
      <div style="font-size:11px; color:var(--muted); text-align:center; margin:3px 0;">
        Adjust sliders to observe interference fringe spacing Δy = (λL)/d and quantum wavefunction collapse.
      </div>
      <div class="sim-controls">
        <label style="font-size:11px; font-weight:600; display:flex; align-items:center; gap:4px;">
          Slits (d): <input type="range" id="slitRange" min="20" max="70" value="${defaultSlitDist}" style="width:65px;" />
        </label>
        <label style="font-size:11px; font-weight:600; display:flex; align-items:center; gap:4px;">
          Wave (λ): <input type="range" id="waveRange" min="10" max="35" value="${defaultWavelength}" style="width:65px;" />
        </label>
        <button class="sim-btn accent" id="modeBtn" onclick="toggleMode()">Wave Mode</button>
        <button class="sim-btn" onclick="resetSim()">Reset Screen</button>
      </div>
    `,
    scriptJs: `
      var canvas = document.getElementById('quantumCanvas');
      var ctx = canvas.getContext('2d');
      var slitInput = document.getElementById('slitRange');
      var waveInput = document.getElementById('waveRange');
      var modeBtn = document.getElementById('modeBtn');
      var countBadge = document.getElementById('particleCountBadge');

      var slitDist = ${defaultSlitDist};
      var lambda = ${defaultWavelength};
      var isParticleMode = false;
      var hits = [];
      var time = 0;

      function resize() {
        var dpr = window.devicePixelRatio || 1;
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      window.addEventListener('resize', resize);
      resize();

      slitInput.addEventListener('input', function(e) {
        slitDist = parseFloat(e.target.value);
        if (window.sendToTwino) window.sendToTwino({ type: 'haptic', style: 'selection' });
      });

      waveInput.addEventListener('input', function(e) {
        lambda = parseFloat(e.target.value);
        if (window.sendToTwino) window.sendToTwino({ type: 'haptic', style: 'selection' });
      });

      window.toggleMode = function() {
        isParticleMode = !isParticleMode;
        modeBtn.innerText = isParticleMode ? 'Particle Mode' : 'Wave Mode';
        if (window.sendToTwino) window.sendToTwino({ type: 'haptic', style: 'medium' });
      };

      window.resetSim = function() {
        hits = [];
        countBadge.innerText = 'Photons: 0';
        if (window.sendToTwino) window.sendToTwino({ type: 'haptic', style: 'light' });
      };
      window.resetSimulation = window.resetSim;

      function probability(y, L, d, wl) {
        var angle = (Math.PI * d * y) / (wl * L);
        var envelope = Math.exp(-(y * y) / (2 * 50 * 50));
        return Math.cos(angle) * Math.cos(angle) * envelope;
      }

      function sampleHit(L, d, wl, maxH) {
        for (var attempt = 0; attempt < 50; attempt++) {
          var testY = (Math.random() - 0.5) * maxH * 0.85;
          var prob = probability(testY, L, d, wl);
          if (Math.random() < prob) {
            return testY;
          }
        }
        return 0;
      }

      function loop() {
        var rect = canvas.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        if (!w || !h) {
          requestAnimationFrame(loop);
          return;
        }

        ctx.clearRect(0, 0, w, h);
        time += 0.08;

        var sourceX = 25;
        var slitX = w * 0.38;
        var screenX = w - 45;
        var cy = h / 2;
        var slit1Y = cy - slitDist / 2;
        var slit2Y = cy + slitDist / 2;
        var L = screenX - slitX;

        // 1. Slit Barrier
        ctx.fillStyle = '#64748B';
        var wallThickness = 5;
        var slitH = 8;
        ctx.fillRect(slitX - wallThickness/2, 0, wallThickness, slit1Y - slitH/2);
        ctx.fillRect(slitX - wallThickness/2, slit1Y + slitH/2, wallThickness, slit2Y - slitH/2 - (slit1Y + slitH/2));
        ctx.fillRect(slitX - wallThickness/2, slit2Y + slitH/2, wallThickness, h - (slit2Y + slitH/2));

        // 2. Waves or Particles
        if (!isParticleMode) {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
          ctx.lineWidth = 1.5;
          for (var r = (time * 12) % lambda; r < slitX - sourceX; r += lambda) {
            ctx.beginPath();
            ctx.arc(sourceX, cy, r, -Math.PI/3, Math.PI/3);
            ctx.stroke();
          }

          var maxR = Math.sqrt(L * L + h * h);
          var wavePhase = (time * 15) % lambda;

          for (var r1 = wavePhase; r1 < maxR && r1 < screenX - slitX + 40; r1 += lambda) {
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
            ctx.beginPath();
            ctx.arc(slitX, slit1Y, r1, -Math.PI/2.5, Math.PI/2.5);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
            ctx.beginPath();
            ctx.arc(slitX, slit2Y, r1, -Math.PI/2.5, Math.PI/2.5);
            ctx.stroke();
          }
        } else {
          if (hits.length < 500 && Math.random() < 0.7) {
            var hitOffset = sampleHit(L, slitDist, lambda, h);
            hits.push(cy + hitOffset);
            countBadge.innerText = 'Photons: ' + hits.length;
          }

          ctx.fillStyle = 'rgba(59, 130, 246, 0.75)';
          for (var i = 0; i < hits.length; i++) {
            ctx.beginPath();
            ctx.arc(screenX + 10, hits[i], 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 3. Screen and |Psi|^2 probability density curve
        ctx.fillStyle = '#334155';
        ctx.fillRect(screenX, 8, 3, h - 16);

        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        var curveMaxW = 32;
        for (var py = 8; py < h - 8; py += 2) {
          var yOff = py - cy;
          var p = probability(yOff, L, slitDist, lambda);
          var px = screenX + p * curveMaxW;
          if (py === 8) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.fillStyle = '#2563EB';
        ctx.font = '9px sans-serif';
        ctx.fillText('|Ψ|²', screenX + 6, 16);

        requestAnimationFrame(loop);
      }
      loop();
    `,
  });
}

