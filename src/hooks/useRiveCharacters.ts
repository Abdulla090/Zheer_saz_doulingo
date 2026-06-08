/* eslint-disable @typescript-eslint/no-require-imports */
import { useRiveFile } from "@rive-app/react-native";

const useRiveCharacters = () => {
  const { riveFile: duoRiveFile } = useRiveFile(
    require("@/assets/rive/duo.riv"),
  );
  const { riveFile: girlRiveFile } = useRiveFile(
    require("@/assets/rive/girl.riv"),
  );
  const { riveFile: manRiveFile } = useRiveFile(
    require("@/assets/rive/man.riv"),
  );

  return { duoRiveFile, girlRiveFile, manRiveFile };
};

export default useRiveCharacters;

