process.env.EXPO_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??= "test-anon-key";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("expo-secure-store", () => ({
  AFTER_FIRST_UNLOCK: "AFTER_FIRST_UNLOCK",
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: "WHEN_UNLOCKED_THIS_DEVICE_ONLY",
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}));

jest.mock("react-native-webview", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    WebView: React.forwardRef((props, ref) => {
      return React.createElement(View, { ...props, ref, testID: props.testID || "mock-webview" });
    }),
  };
});

jest.mock("react-native-worklets", () => ({
  scheduleOnUI: (fn) => {
    if (typeof fn === "function") fn();
  },
  scheduleOnRN: (fn) => {
    if (typeof fn === "function") fn();
  },
  createWorklet: (fn) => fn,
}));

jest.mock("@jamsch/react-native-duo-drag-drop", () => {
  const React = require("react");
  const { View, Pressable } = require("react-native");

  const DuoDragDropMock = React.forwardRef((props, ref) => {
    const {
      words = [],
      renderWord,
      renderLines,
      renderPlaceholder,
      onDrop,
      gesturesDisabled,
    } = props;

    const offsetsRef = React.useRef(words.map(() => -1));
    const [offsets, setOffsets] = React.useState(() => words.map(() => -1));

    React.useEffect(() => {
      offsetsRef.current = words.map(() => -1);
      setOffsets(words.map(() => -1));
    }, [words]);

    React.useImperativeHandle(ref, () => ({
      getWords: () => ({
        answered: words.filter((_, i) => offsetsRef.current[i] !== -1),
        bank: words.filter((_, i) => offsetsRef.current[i] === -1),
      }),
      getAnsweredWords: () => {
        const items = words
          .map((word, idx) => ({ word, order: offsetsRef.current[idx] }))
          .filter((x) => x.order !== -1)
          .sort((a, b) => a.order - b.order);
        return items.map((x) => x.word);
      },
      getOffsets: () => offsetsRef.current,
      setOffsets: (newOffsets) => {
        offsetsRef.current = newOffsets;
        setOffsets(newOffsets);
      },
    }));

    const handleWordTap = (index) => {
      if (gesturesDisabled) return;
      const currentOrder = offsetsRef.current[index];
      const newOffsets = [...offsetsRef.current];
      let destination;
      let position;

      if (currentOrder === -1) {
        const placedCount = offsetsRef.current.filter((o) => o !== -1).length;
        newOffsets[index] = placedCount;
        destination = "answered";
        position = placedCount;
      } else {
        newOffsets[index] = -1;
        const remaining = newOffsets
          .map((o, idx) => ({ order: o, idx }))
          .filter((x) => x.order !== -1)
          .sort((a, b) => a.order - b.order);
        remaining.forEach((item, newOrd) => {
          newOffsets[item.idx] = newOrd;
        });
        destination = "bank";
        position = -1;
      }
      offsetsRef.current = newOffsets;
      setOffsets(newOffsets);
      onDrop?.({ index, destination, position });
    };

    return (
      <View testID="duo-drag-drop-mock">
        {renderLines?.({ numLines: 2, containerHeight: 124, lineHeight: 62 })}
        <View testID="duo-placeholders">
          {words.map((word, index) => (
            <View key={`placeholder-${word}-${index}`}>
              {renderPlaceholder?.({ style: {} })}
            </View>
          ))}
        </View>
        <View testID="duo-words">
          {words.map((word, index) => (
            <Pressable
              key={`word-${word}-${index}`}
              testID={`duo-word-${index}`}
              disabled={gesturesDisabled}
              onPress={() => handleWordTap(index)}
            >
              {renderWord ? renderWord(word, index) : null}
            </Pressable>
          ))}
        </View>
      </View>
    );
  });

  return {
    __esModule: true,
    default: DuoDragDropMock,
  };
});

