/**
 * Web Deprecations Patch
 * Globally eliminates:
 * 1. "shadow*" style props are deprecated. Use "boxShadow".
 * 2. props.pointerEvents is deprecated. Use style.pointerEvents
 * on the Web platform.
 */

import * as RN from "react-native";
import React from "react";
import { useFontStore } from "../stores/useFontStore";

const { Platform, StyleSheet } = RN;

if (Platform.OS === "web") {
  // 1. Patch console.warn and console.error to filter out specific deprecation warnings
  const suppressWarnings = [
    "style props are deprecated. Use \"boxShadow\".",
    "props.pointerEvents is deprecated. Use style.pointerEvents",
    "[Reanimated] Reading from `value` during component render",
    "Blocked aria-hidden on an element",
  ];

  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (args.length > 0 && typeof args[0] === "string") {
      const msg = args[0];
      if (suppressWarnings.some((w) => msg.includes(w))) {
        return;
      }
    }
    originalWarn(...args);
  };

  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (args.length > 0 && typeof args[0] === "string") {
      const msg = args[0];
      if (suppressWarnings.some((w) => msg.includes(w))) {
        return;
      }
    }
    originalError(...args);
  };

  const convertColorToRgba = (color: string, opacity: number): string => {
    if (!color) return `rgba(0,0,0,${opacity})`;
    if (color.startsWith("rgba")) return color;
    if (color.startsWith("rgb")) {
      return color.replace("rgb", "rgba").replace(")", `, ${opacity})`);
    }
    let c = color.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${opacity})`;
  };

  // 2. Patch StyleSheet.create
  const originalCreate = StyleSheet.create;
  StyleSheet.create = (styles: any) => {
    const processedStyles: any = {};
    for (const key in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, key)) {
        const style = styles[key];
        if (style && typeof style === "object") {
          const newStyle = { ...style };
          let hasShadow = false;
          let shadowColor = newStyle.shadowColor || "#000";
          let shadowOffsetX = 0;
          let shadowOffsetY = 0;
          if (newStyle.shadowOffset) {
            shadowOffsetX = newStyle.shadowOffset.width || 0;
            shadowOffsetY = newStyle.shadowOffset.height || 0;
            delete newStyle.shadowOffset;
          }
          let shadowRadius = newStyle.shadowRadius || 0;
          let shadowOpacity = newStyle.shadowOpacity || 0;

          if (
            newStyle.shadowColor !== undefined ||
            newStyle.shadowRadius !== undefined ||
            newStyle.shadowOpacity !== undefined
          ) {
            hasShadow = true;
            delete newStyle.shadowColor;
            delete newStyle.shadowRadius;
            delete newStyle.shadowOpacity;
          }

          if (hasShadow && shadowOpacity > 0) {
            const rgba = convertColorToRgba(shadowColor, shadowOpacity);
            newStyle.boxShadow = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowRadius * 2}px 0px ${rgba}`;
          }
          processedStyles[key] = newStyle;
        } else {
          processedStyles[key] = style;
        }
      }
    }
    return originalCreate(processedStyles);
  };

  const patchProps = (props: any) => {
    if (!props) return props;
    let newProps = props;
    let mutated = false;

    // Move pointerEvents prop to style
    if (props.pointerEvents !== undefined) {
      newProps = { ...newProps };
      const pointerEvents = newProps.pointerEvents;
      delete newProps.pointerEvents;
      newProps.style = StyleSheet.compose(newProps.style, { pointerEvents });
      mutated = true;
    }

    // Convert inline shadow props in style
    if (props.style) {
      const flatStyle = StyleSheet.flatten(props.style);
      if (
        flatStyle &&
        (flatStyle.shadowColor !== undefined ||
          flatStyle.shadowOpacity !== undefined ||
          flatStyle.shadowOffset !== undefined ||
          flatStyle.shadowRadius !== undefined)
      ) {
        if (!mutated) {
          newProps = { ...newProps };
          mutated = true;
        }
        const newStyle = { ...flatStyle };
        let shadowColor = newStyle.shadowColor || "#000";
        let shadowOffsetX = 0;
        let shadowOffsetY = 0;
        if (newStyle.shadowOffset) {
          shadowOffsetX = newStyle.shadowOffset.width || 0;
          shadowOffsetY = newStyle.shadowOffset.height || 0;
          delete newStyle.shadowOffset;
        }
        let shadowRadius = newStyle.shadowRadius || 0;
        let shadowOpacity = newStyle.shadowOpacity || 0;

        delete newStyle.shadowColor;
        delete newStyle.shadowRadius;
        delete newStyle.shadowOpacity;

        if (shadowOpacity > 0) {
          const rgba = convertColorToRgba(shadowColor, shadowOpacity);
          newStyle.boxShadow = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowRadius * 2}px 0px ${rgba}`;
        }
        newProps.style = newStyle;
      }
    }
    return newProps;
  };

  // 3. Patch React.createElement
  const originalCreateElement = React.createElement;
  (React as any).createElement = function (type: any, newProps: any, ...children: any[]) {
    const patched = newProps ? patchProps(newProps) : newProps;
    return originalCreateElement(type, patched, ...children);
  };

  // 4. Patch React Native components' render functions in-place
  const componentsToPatch = [
    "View",
    "Text",
    "TextInput",
    "ScrollView",
    "Pressable",
    "Image",
    "TouchableOpacity",
    "TouchableWithoutFeedback",
    "TouchableHighlight",
  ];

  const getComponentRender = (Component: any) => {
    if (!Component) return null;
    if (Component.render) return Component;
    if (Component.type && Component.type.render) return Component.type;
    return null;
  };

  componentsToPatch.forEach((name) => {
    const Component = (RN as any)[name];
    const target = getComponentRender(Component);
    if (target) {
      const originalRender = target.render;
      target.render = function (props: any, ref: any) {
        return originalRender(patchProps(props), ref);
      };
    }
  });

  // 5. Try patching the React JSX runtimes (for React 17+ and React 19 / Compiler templates)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jsxRuntime = require("react/jsx-runtime");
    const originalJsx = jsxRuntime.jsx;
    const originalJsxs = jsxRuntime.jsxs;
    if (originalJsx && !originalJsx.__patched) {
      jsxRuntime.jsx = function (type: any, props: any, ...args: any[]) {
        const patchedProps = props ? patchProps(props) : props;
        return originalJsx(type, patchedProps, ...args);
      };
      jsxRuntime.jsx.__patched = true;
    }
    if (originalJsxs && !originalJsxs.__patched) {
      jsxRuntime.jsxs = function (type: any, props: any, ...args: any[]) {
        const patchedProps = props ? patchProps(props) : props;
        return originalJsxs(type, patchedProps, ...args);
      };
      jsxRuntime.jsxs.__patched = true;
    }
  } catch {}

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jsxDevRuntime = require("react/jsx-dev-runtime");
    const originalJsxDEV = jsxDevRuntime.jsxDEV;
    if (originalJsxDEV && !originalJsxDEV.__patched) {
      jsxDevRuntime.jsxDEV = function (type: any, props: any, ...args: any[]) {
        const patchedProps = props ? patchProps(props) : props;
        return originalJsxDEV(type, patchedProps, ...args);
      };
      jsxDevRuntime.jsxDEV.__patched = true;
    }
  } catch {}
}

// ── Global React Native Text Patch (Web Only) ──
// Overrides the default React Native Text component to automatically use the selected Kurdish font on Web.
if (Platform.OS === "web") {
  try {
    const OriginalText = RN.Text as any;

    if (OriginalText) {
      const textDescriptor = Object.getOwnPropertyDescriptor(RN, "Text");
      const canPatchText =
        !textDescriptor || textDescriptor.configurable || Boolean(textDescriptor.writable);

      if (canPatchText) {
        const CustomTextRenderer = (props: any, ref: any) => {
          // Dynamically subscribe to the selected font
          const selectedFont = useFontStore((s) => s.selectedFont);
          const style = props.style;
          let hasFont = false;

          if (style) {
            if (Array.isArray(style)) {
              const flat = RN.StyleSheet.flatten(style);
              hasFont = !!(flat && flat.fontFamily);
            } else {
              hasFont = !!style.fontFamily;
            }
          }

          let newStyle = style;
          if (!hasFont && selectedFont) {
            newStyle = [style, { fontFamily: selectedFont }];
          }

          return React.createElement(OriginalText, {
            ...props,
            style: newStyle,
            ref,
          });
        };

        const CustomText = React.forwardRef(CustomTextRenderer);
        (CustomText as any).displayName = "Text";

        try {
          Object.defineProperty(RN, "Text", {
            get() {
              return CustomText;
            },
            configurable: true,
          });
        } catch {
          (RN as any).Text = CustomText;
        }
      }
    }
  } catch (err) {
    if (err) {
      console.warn("Global RN.Text patch failed:", err);
    }
  }
}
