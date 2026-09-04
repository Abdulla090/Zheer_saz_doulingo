import { describe, expect, it } from "@jest/globals";
import {
  calculatePopupLayout,
  POPUP_CARD_MAX_WIDTH,
  POPUP_CARD_SIDE_MARGIN,
  POPUP_CARET_EDGE_INSET,
  POPUP_CARET_SIZE,
} from "../path-lesson-popup-layout";

describe("calculatePopupLayout", () => {
  const viewportWidth = 390;
  const viewportHeight = 844;
  const cardHeight = 168;
  const bottomInset = 34;

  describe("Native RTL layout compensation", () => {
    it("mirrors style left on native RTL so physical card position matches the tapped node on the right", () => {
      // Node is near the right edge (anchorX = 320)
      const anchor = {
        x: 320,
        y: 300,
        nodeTop: 220,
        nodeHeight: 76,
        rootWidth: viewportWidth,
        rootHeight: viewportHeight,
      };

      const nativeRtl = calculatePopupLayout({
        anchor,
        viewportWidth,
        viewportHeight,
        cardHeight,
        bottomInset,
        isRtl: true,
        isNative: true,
      });

      const webRtl = calculatePopupLayout({
        anchor,
        viewportWidth,
        viewportHeight,
        cardHeight,
        bottomInset,
        isRtl: true,
        isNative: false,
      });

      // Both compute the same physical left and card width
      expect(nativeRtl.cardWidth).toBe(POPUP_CARD_MAX_WIDTH);
      expect(nativeRtl.cardLeft).toBe(webRtl.cardLeft);

      // On native RTL, cardPositionLeft is inverted for Yoga's right-edge measurement
      // Yoga physical left = viewportWidth - cardWidth - cardPositionLeft = cardLeft
      const yogaPhysicalLeft =
        viewportWidth - nativeRtl.cardWidth - nativeRtl.cardPositionLeft;
      expect(yogaPhysicalLeft).toBe(nativeRtl.cardLeft);

      // Caret position verification:
      // Yoga physical caret left = cardWidth - (2 * CARET_SIZE) - caretPositionLeft = caretLeft
      const yogaPhysicalCaretLeft =
        nativeRtl.cardWidth -
        2 * POPUP_CARET_SIZE -
        nativeRtl.caretPositionLeft;
      expect(yogaPhysicalCaretLeft).toBe(nativeRtl.caretLeft);

      // Caret center aligns exactly with anchor.x
      const caretCenterPhysical =
        nativeRtl.cardLeft + nativeRtl.caretLeft + POPUP_CARET_SIZE;
      expect(caretCenterPhysical).toBe(anchor.x);
    });

    it("mirrors style left on native RTL when tapped node is on the left", () => {
      // Node is near the left edge (anchorX = 70)
      const anchor = {
        x: 70,
        y: 300,
        nodeTop: 220,
        nodeHeight: 76,
        rootWidth: viewportWidth,
        rootHeight: viewportHeight,
      };

      const nativeRtl = calculatePopupLayout({
        anchor,
        viewportWidth,
        viewportHeight,
        cardHeight,
        bottomInset,
        isRtl: true,
        isNative: true,
      });

      // Physical card left should clamp to margin
      expect(nativeRtl.cardLeft).toBe(POPUP_CARD_SIDE_MARGIN);

      // Yoga physical placement matches
      const yogaPhysicalLeft =
        viewportWidth - nativeRtl.cardWidth - nativeRtl.cardPositionLeft;
      expect(yogaPhysicalLeft).toBe(nativeRtl.cardLeft);

      // Caret center aligns with anchor.x
      const caretCenterPhysical =
        nativeRtl.cardLeft + nativeRtl.caretLeft + POPUP_CARET_SIZE;
      expect(caretCenterPhysical).toBe(anchor.x);
    });

    it("keeps Web RTL coordinates unmirrored because CSS left is physical left", () => {
      const anchor = {
        x: 320,
        y: 300,
        nodeTop: 220,
        nodeHeight: 76,
        rootWidth: viewportWidth,
        rootHeight: viewportHeight,
      };

      const webRtl = calculatePopupLayout({
        anchor,
        viewportWidth,
        viewportHeight,
        cardHeight,
        bottomInset,
        isRtl: true,
        isNative: false,
      });

      expect(webRtl.cardPositionLeft).toBe(webRtl.cardLeft);
      expect(webRtl.caretPositionLeft).toBe(webRtl.caretLeft);
    });
  });

  describe("Vertical placement and clamping", () => {
    it("places popup below when there is sufficient room below node", () => {
      const anchor = {
        x: 195,
        y: 200,
        nodeTop: 120,
        nodeHeight: 76,
        rootWidth: viewportWidth,
        rootHeight: viewportHeight,
      };

      const result = calculatePopupLayout({
        anchor,
        viewportWidth,
        viewportHeight,
        cardHeight,
        bottomInset,
        isRtl: false,
        isNative: true,
      });

      expect(result.placeAbove).toBe(false);
      expect(result.cardTop).toBe(120 + 76 + 14); // nodeBottom + GAP_OFFSET
    });

    it("flips popup above when node is near the bottom clearance boundary", () => {
      const anchor = {
        x: 195,
        y: 720,
        nodeTop: 650,
        nodeHeight: 76,
        rootWidth: viewportWidth,
        rootHeight: viewportHeight,
      };

      const result = calculatePopupLayout({
        anchor,
        viewportWidth,
        viewportHeight,
        cardHeight,
        bottomInset,
        isRtl: false,
        isNative: true,
      });

      expect(result.placeAbove).toBe(true);
      expect(result.cardTop).toBe(650 - cardHeight - 14);
    });

    it("clamps caret within card boundaries even when node center is extreme", () => {
      const anchor = {
        x: 5, // Extreme left
        y: 200,
        nodeTop: 120,
        nodeHeight: 76,
        rootWidth: viewportWidth,
        rootHeight: viewportHeight,
      };

      const result = calculatePopupLayout({
        anchor,
        viewportWidth,
        viewportHeight,
        cardHeight,
        bottomInset,
        isRtl: false,
        isNative: true,
      });

      expect(result.caretLeft).toBe(POPUP_CARET_EDGE_INSET);
    });
  });

  describe("Fallback state without anchor", () => {
    it("centers card horizontally and anchors to bottom clearance when no node is specified", () => {
      const result = calculatePopupLayout({
        viewportWidth,
        viewportHeight,
        cardHeight,
        bottomInset,
        isRtl: true,
        isNative: true,
      });

      const expectedCardLeft = (viewportWidth - POPUP_CARD_MAX_WIDTH) / 2;
      expect(result.cardLeft).toBe(expectedCardLeft);
      // In native RTL, center remains centered
      expect(result.cardPositionLeft).toBe(expectedCardLeft);
      expect(result.cardTop).toBeUndefined();
      expect(result.cardBottom).toBe(Math.max(bottomInset + 20, 106));
    });
  });
});
