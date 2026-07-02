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

const riveJsPath = path.join(__dirname, '..', 'node_modules', '@rive-app', 'canvas', 'rive.js');
const wasmPath = path.join(__dirname, '..', 'node_modules', '@rive-app', 'canvas', 'rive.wasm');
const rivFilePath = path.join(__dirname, '..', 'assets', 'rive', 'kids_interactive.riv');

const RiveExport = require(riveJsPath);

const wasmBuffer = fs.readFileSync(wasmPath);
const wasmArrayBuffer = wasmBuffer.buffer.slice(wasmBuffer.byteOffset, wasmBuffer.byteOffset + wasmBuffer.byteLength);
RiveExport.RuntimeLoader.setWasmBinary(wasmArrayBuffer);

RiveExport.RuntimeLoader.awaitInstance().then(async (rive) => {
  const fileBytes = fs.readFileSync(rivFilePath);
  
  console.log('Loading kids_interactive.riv synchronously...');
  const loader = await rive.load(fileBytes);
  console.log('Loaded!');
  
  console.log('Loader prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(loader)));
  console.log('Loader instance keys:', Object.keys(loader));
  
  // Try common Rive File methods: defaultArtboard, artboardByName, artboardAt
  try {
    const artboard = loader.defaultArtboard();
    console.log('defaultArtboard() worked:', artboard.name);
  } catch(e) { console.log('defaultArtboard() failed:', e.message); }
  
  try {
    const artboard = loader.artboardByName('withLayout') || loader.artboardByName('viewModel');
    console.log('artboardByName() worked:', artboard.name);
  } catch(e) { console.log('artboardByName() failed:', e.message); }

  try {
    const artboard = loader.artboardAt(0);
    console.log('artboardAt(0) worked:', artboard.name);
    console.log('Artboard prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(artboard)));
  } catch(e) { console.log('artboardAt(0) failed:', e.message); }
  
  process.exit(0);
}).catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
