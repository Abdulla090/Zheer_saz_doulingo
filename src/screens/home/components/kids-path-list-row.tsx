import type { LessonListItem } from "@/data/list-items";
import React from "react";
import { View } from "react-native";

import {
  KIDS_CURVE_MASCOT_ROW_INDEX,
  KidsPathCurveMascot,
} from "./kids-path-curve-mascot";
import { ListItem } from "./list-item";
import { getPathCurveOffset } from "./path-curve";

const KIDS_ROW_HEIGHT = 74;
const LESSONS_PER_UNIT = 5;

type Props = {
  item: LessonListItem;
  screenWidth: number;
};

export const KidsPathListRow = React.memo(function KidsPathListRow({
  item,
  screenWidth,
}: Props) {
  const showMascot = item.sectionItemIndex === KIDS_CURVE_MASCOT_ROW_INDEX;
  const unitBase = item.lessonId * LESSONS_PER_UNIT;
  const rowOffset = getPathCurveOffset(
    unitBase + KIDS_CURVE_MASCOT_ROW_INDEX,
    screenWidth,
  );

  return (
    <View
      style={{
        width: "100%",
        height: KIDS_ROW_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showMascot ? (
        <KidsPathCurveMascot
          unitIndex={item.lessonId}
          mascotRowOffsetX={rowOffset}
          screenWidth={screenWidth}
          rowHeight={KIDS_ROW_HEIGHT}
        />
      ) : null}
      <ListItem item={item} screenWidth={screenWidth} pathMode="kids" />
    </View>
  );
});
