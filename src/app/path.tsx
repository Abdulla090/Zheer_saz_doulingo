import { Redirect, useLocalSearchParams } from "expo-router";

/** Legacy path entry: the learning path now lives in the Home tab. */
export default function PathRoute() {
  const params = useLocalSearchParams<{ mode?: string }>();

  return (
    <Redirect
      href={{
        pathname: "/(tabs)",
        params: params.mode ? { mode: params.mode } : undefined,
      }}
    />
  );
}
