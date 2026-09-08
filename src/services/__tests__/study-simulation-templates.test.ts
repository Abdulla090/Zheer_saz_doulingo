import { describe, expect, test } from "@jest/globals";
import {
  generateAtomBuilderHtml,
  generateBalanceScaleHtml,
  generateChessTacticsHtml,
  generateCircuitSimHtml,
  generateCoordinateGraphHtml,
  generateLeverTorqueHtml,
  prepareSandboxedHtml,
  wrapSimulationHtml,
} from "../study-simulation-templates";

describe("Study Simulation Templates & Dynamic Sandboxed Code", () => {
  test("wrapSimulationHtml produces complete HTML5 document with bridge and canvas", () => {
    const html = wrapSimulationHtml({
      title: "Test Simulation",
      bodyHtml: "<canvas id='testCanvas'></canvas>",
      scriptJs: "console.log('running simulation');",
      isDark: true,
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>Test Simulation</title>");
    expect(html).toContain("<canvas id='testCanvas'></canvas>");
    expect(html).toContain("window.sendToTwino");
    expect(html).toContain("window.ReactNativeWebView");
    expect(html).toContain("console.log('running simulation');");
    expect(html).toContain("--bg: #0F172A");
    expect(html).toContain("roundRect");
  });

  test("generateBalanceScaleHtml generates physics spring scale with controls", () => {
    const html = generateBalanceScaleHtml({
      equation: "2x + 4 = 12",
      initialLeft: 4,
      initialRight: 12,
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("scaleCanvas");
    expect(html).toContain("addLeft");
    expect(html).toContain("addRight");
    expect(html).toContain("resetScale");
    expect(html).toContain("2x + 4 = 12");
  });

  test("generateCoordinateGraphHtml generates interactive 2D coordinate plane with slope/intercept", () => {
    const html = generateCoordinateGraphHtml({
      equation: "y = 2x + 1",
      initialSlope: 2,
      initialIntercept: 1,
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("graphCanvas");
    expect(html).toContain("changeM");
    expect(html).toContain("changeB");
    expect(html).toContain("resetGraph");
    expect(html).toContain("y = 2x + 1");
  });

  test("generateLeverTorqueHtml generates rotational equilibrium seesaw", () => {
    const html = generateLeverTorqueHtml({
      leftWeight: 10,
      leftDistance: 2,
      rightWeight: 5,
      rightDistance: 4,
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("torqueCanvas");
    expect(html).toContain("changeLw");
    expect(html).toContain("changeRd");
    expect(html).toContain("resetTorque");
  });

  test("generateCircuitSimHtml generates Ohm's Law circuit with flowing electrons", () => {
    const html = generateCircuitSimHtml({
      initialVoltage: 9,
      initialResistance: 3,
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("circuitCanvas");
    expect(html).toContain("changeV");
    expect(html).toContain("changeR");
    expect(html).toContain("resetCircuit");
  });

  test("generateAtomBuilderHtml generates Bohr model with orbitals and nucleus", () => {
    const html = generateAtomBuilderHtml({
      initialProtons: 6,
      initialNeutrons: 6,
      initialElectrons: 6,
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("atomCanvas");
    expect(html).toContain("changeP");
    expect(html).toContain("changeN");
    expect(html).toContain("changeE");
    expect(html).toContain("Carbon (C)");
  });

  test("generateChessTacticsHtml generates interactive 8x8 chessboard with knight fork", () => {
    const html = generateChessTacticsHtml({
      puzzleTitle: "Royal Knight Fork",
      instructions: "Tap knight on e4 then f6",
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("chessCanvas");
    expect(html).toContain("resetBoard");
    expect(html).toContain("Tap knight on e4 then f6");
  });

  test("prepareSandboxedHtml injects bridge, viewport, and theme into raw HTML documents", () => {
    const rawAiHtml = `<!DOCTYPE html>
<html>
<head><title>Doppler Effect</title></head>
<body><canvas id="c"></canvas><script>console.log('wave');</script></body>
</html>`;

    const prepared = prepareSandboxedHtml({
      html: rawAiHtml,
      title: "Doppler Effect",
      isDark: true,
    });

    expect(prepared).toContain("<!DOCTYPE html>");
    expect(prepared).toContain("viewport");
    expect(prepared).toContain("window.sendToTwino");
    expect(prepared).toContain("roundRect");
    expect(prepared).toContain("--bg: #0F172A");
  });

  test("prepareSandboxedHtml wraps HTML fragments without doctype into full responsive documents", () => {
    const fragment = `<canvas id="pendulum"></canvas><script>var g = 9.8;</script>`;
    const prepared = prepareSandboxedHtml({
      html: fragment,
      title: "Pendulum",
      isDark: false,
    });

    expect(prepared).toContain("<!DOCTYPE html>");
    expect(prepared).toContain("pendulum");
    expect(prepared).toContain("window.sendToTwino");
    expect(prepared).toContain("--bg: #FFFFFF");
  });

  test("prepareSandboxedHtml wraps pure JS simulation code into canvas document", () => {
    const code = "var c = document.getElementById('simCanvas'); console.log(c);";
    const prepared = prepareSandboxedHtml({
      code,
      title: "Pure JS Simulation",
      isDark: true,
    });

    expect(prepared).toContain("<!DOCTYPE html>");
    expect(prepared).toContain("simCanvas");
    expect(prepared).toContain(code);
    expect(prepared).toContain("window.sendToTwino");
  });
});
