export const POPUP_CARD_MAX_WIDTH = 268;
export const POPUP_CARD_SIDE_MARGIN = 16;
export const POPUP_CARD_PADDING = 16;
export const POPUP_CARET_SIZE = 10;
export const POPUP_CARET_EDGE_INSET = 20;
export const POPUP_GAP_OFFSET = 14;
export const POPUP_BOTTOM_CLEARANCE = 80;

export type PopupAnchor = {
  x: number;
  y: number;
  nodeTop: number;
  nodeHeight: number;
  rootWidth: number;
  rootHeight: number;
};

export type CalculatePopupLayoutParams = {
  anchor?: PopupAnchor;
  viewportWidth: number;
  viewportHeight: number;
  cardHeight: number;
  bottomInset: number;
  isRtl: boolean;
  isNative: boolean;
};

export type PopupLayoutResult = {
  cardWidth: number;
  /** Physical distance in screen pixels from the left edge of the viewport. */
  cardLeft: number;
  /**
   * The style `left` value to pass to the card View.
   * On Web and LTR native, this equals `cardLeft`.
   * On RTL native, React Native Yoga measures `left` from the right (start) edge,
   * so this is compensated to land at physical `cardLeft`.
   */
  cardPositionLeft: number;
  cardTop?: number;
  cardBottom?: number;
  /** Physical distance from the card's physical left edge to the caret's left edge. */
  caretLeft: number;
  /**
   * The style `left` value to pass to the caret View.
   * Compensated for RTL native so the caret tip points directly at the node's center.
   */
  caretPositionLeft: number;
  placeAbove: boolean;
};

export function calculatePopupLayout(params: CalculatePopupLayoutParams): PopupLayoutResult {
  const {
    anchor,
    viewportWidth,
    viewportHeight,
    cardHeight,
    bottomInset,
    isRtl,
    isNative,
  } = params;

  const cardWidth = Math.min(
    viewportWidth - POPUP_CARD_SIDE_MARGIN * 2,
    POPUP_CARD_MAX_WIDTH,
  );

  const anchorX = anchor?.x ?? viewportWidth / 2;
  const cardLeft = Math.max(
    POPUP_CARD_SIDE_MARGIN,
    Math.min(
      viewportWidth - cardWidth - POPUP_CARD_SIDE_MARGIN,
      anchorX - cardWidth / 2,
    ),
  );

  // In React Native Yoga on native platforms (iOS/Android), an absolute child inside
  // an RTL parent interprets `left` as distance from the parent's START (right) edge.
  // To place the card at physical `cardLeft` from the left edge, the distance
  // from the right edge must be `viewportWidth - cardWidth - cardLeft`.
  const isRtlLayout = isNative && isRtl;
  const cardPositionLeft = isRtlLayout
    ? viewportWidth - cardWidth - cardLeft
    : cardLeft;

  const nodeTop = anchor?.nodeTop ?? 0;
  const nodeHeight = anchor?.nodeHeight ?? 76;
  const nodeBottom = nodeTop + nodeHeight;

  const rootHeight = anchor?.rootHeight ?? viewportHeight;
  const placeAbove =
    Boolean(anchor) &&
    nodeBottom + cardHeight + POPUP_GAP_OFFSET >
      rootHeight - Math.max(bottomInset, 20) - POPUP_BOTTOM_CLEARANCE;

  const maxCardTop = Math.max(16, rootHeight - Math.max(bottomInset, 20) - cardHeight - 16);
  const cardTop = anchor
    ? placeAbove
      ? Math.max(16, nodeTop - cardHeight - POPUP_GAP_OFFSET)
      : Math.min(maxCardTop, nodeBottom + POPUP_GAP_OFFSET)
    : undefined;

  const cardBottom = anchor ? undefined : Math.max(bottomInset + 20, 106);

  const caretLeft = anchor
    ? Math.max(
        POPUP_CARET_EDGE_INSET,
        Math.min(
          cardWidth - POPUP_CARET_EDGE_INSET - POPUP_CARET_SIZE * 2,
          anchorX - cardLeft - POPUP_CARET_SIZE,
        ),
      )
    : 0;

  // Similarly for the caret inside the card: in native RTL, the card is RTL,
  // so `left` measures from the card's right edge.
  const caretPositionLeft = isRtlLayout
    ? cardWidth - caretLeft - POPUP_CARET_SIZE * 2
    : caretLeft;

  return {
    cardWidth,
    cardLeft,
    cardPositionLeft,
    cardTop,
    cardBottom,
    caretLeft,
    caretPositionLeft,
    placeAbove,
  };
}
