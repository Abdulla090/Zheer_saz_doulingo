import { Platform } from "react-native";

export type GameWindowCoords = {
  x: number;
  y: number;
  w: number;
  h: number;
};

function getWebCoords(element: any): GameWindowCoords | null {
  if (!element) return null;

  try {
    let node = element;
    if (typeof node.getBoundingClientRect === "function") {
      const rect = node.getBoundingClientRect();
      return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
    }
    if (node._component && typeof node._component.getBoundingClientRect === "function") {
      const rect = node._component.getBoundingClientRect();
      return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
    }
    if (typeof node.getHostNode === "function") {
      node = node.getHostNode();
      if (node && typeof node.getBoundingClientRect === "function") {
        const rect = node.getBoundingClientRect();
        return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
      }
    }
  } catch {
    return null;
  }

  return null;
}

/** Measures at press time so native layout has committed before a tile starts flying. */
export function measureGameElement(element: any): Promise<GameWindowCoords | null> {
  if (Platform.OS === "web") {
    return Promise.resolve(getWebCoords(element));
  }

  return new Promise((resolve) => {
    if (!element || typeof element.measureInWindow !== "function") {
      resolve(null);
      return;
    }

    let settled = false;
    const finish = (coords: GameWindowCoords | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(coords);
    };
    const timeout = setTimeout(() => finish(null), 180);

    requestAnimationFrame(() => {
      element.measureInWindow((x: number, y: number, w: number, h: number) => {
        finish(w > 0 && h > 0 ? { x, y, w, h } : null);
      });
    });
  });
}
