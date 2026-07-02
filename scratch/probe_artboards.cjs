console.log("Script started");
try {
  const fs = require('fs');
  const path = require('path');

  // Mock browser globals required by Emscripten/Rive JS runtime
  const mockContextBase = {
    isContextLost: () => false,
    getExtension: () => null,
    getParameter: () => 0,
    getShaderParameter: () => true,
    getProgramParameter: () => true,
    getShaderInfoLog: () => '',
    getProgramInfoLog: () => '',
    canvas: { width: 100, height: 100 },
    canvasBorder: 'none',
  };

  const mockContext = new Proxy(mockContextBase, {
    get: (target, prop) => {
      if (prop in target) {
        return target[prop];
      }
      return () => ({});
    }
  });

  global.window = global;
  global.HTMLCanvasElement = class HTMLCanvasElement {};
  global.Image = class Image {};
  global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  global.cancelAnimationFrame = (id) => clearTimeout(id);

  global.document = {
    createElement: (name) => {
      if (name === 'canvas') {
        const canvas = new global.HTMLCanvasElement();
        canvas.getContext = () => mockContext;
        canvas.width = 100;
        canvas.height = 100;
        canvas.style = {};
        canvas.addEventListener = () => {};
        canvas.removeEventListener = () => {};
        return canvas;
      }
      return {};
    },
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  global.navigator = { userAgent: 'Node' };

  const projectRoot = 'c:\\Users\\TOTAL TECH\\Desktop\\My Ai project\\mobile app\\phingo';
  const riveJsPath = path.join(projectRoot, 'node_modules', '@rive-app', 'canvas', 'rive.js');
  const wasmPath = path.join(projectRoot, 'node_modules', '@rive-app', 'canvas', 'rive.wasm');

  console.log("Loading rive.js...");
  const RiveExport = require(riveJsPath);
  console.log("Reading wasm...");
  const wasmBuffer = fs.readFileSync(wasmPath);
  const wasmArrayBuffer = wasmBuffer.buffer.slice(wasmBuffer.byteOffset, wasmBuffer.byteOffset + wasmBuffer.byteLength);

  console.log("Setting WASM binary...");
  RiveExport.RuntimeLoader.setWasmBinary(wasmArrayBuffer);

  console.log("Awaiting instance...");
  RiveExport.RuntimeLoader.awaitInstance().then(async (rive) => {
    console.log("Rive instance loaded successfully!");
    const filePath = path.join(projectRoot, 'assets', 'rive', 'largoapp3.riv');
    console.log("File path:", filePath);
    const fileBytes = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(fileBytes);
    
    console.log("Loading file into Rive loader...");
    let loader;
    try {
      loader = await rive.load(uint8Array);
      console.log("File loaded successfully. Loader keys:", Object.keys(loader));
    } catch (err) {
      console.error("Error loading file in Rive:", err);
      process.exit(1);
    }
    
    try {
      const count = loader.artboardCount();
      console.log(`Artboard Count: ${count}`);
      for (let i = 0; i < count; i++) {
        const artboard = loader.artboardAt(i);
        console.log(`Artboard ${i}: name="${artboard.name}"`);
        
        // Check State Machines
        const smCount = artboard.stateMachineCount ? artboard.stateMachineCount() : 0;
        console.log(`  State Machine Count: ${smCount}`);
        for (let j = 0; j < smCount; j++) {
          const sm = artboard.stateMachineAt(j);
          console.log(`    State Machine ${j}: name="${sm.name}"`);
          try {
            const smi = new rive.StateMachineInstance(sm, artboard);
            const inputCount = smi.inputCount();
            console.log(`      Inputs Count: ${inputCount}`);
            for (let k = 0; k < inputCount; k++) {
              const input = smi.inputAt(k);
              console.log(`        Input ${k}: name="${input.name}" type="${input.type}" value="${input.value}"`);
            }
          } catch (e) {
            console.log("      Error reading inputs:", e.message);
          }
        }
        
        // Check ViewModels
        try {
          const viewModelCount = artboard.viewModelCount ? artboard.viewModelCount() : 0;
          console.log(`  ViewModel Count: ${viewModelCount}`);
          for (let j = 0; j < viewModelCount; j++) {
            const vm = artboard.viewModelAt(j);
            console.log(`    ViewModel ${j}: name="${vm.name}"`);
            const propCount = vm.propertyCount ? vm.propertyCount() : 0;
            console.log(`      Property Count: ${propCount}`);
            for (let k = 0; k < propCount; k++) {
              const prop = vm.propertyAt(k);
              console.log(`        Property ${k}: name="${prop.name}" type="${prop.type}"`);
            }
          }
        } catch (e) {
          console.log("  Error checking ViewModels:", e.message);
        }
      }
    } catch (err) {
      console.error("Error inspecting artboards:", err);
    }
    
    process.exit(0);
  }).catch((err) => {
    console.error('Runtime Loader Error:', err);
    process.exit(1);
  });
} catch (e) {
  console.error("Top-level catch error:", e);
}
