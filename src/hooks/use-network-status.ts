import NetInfo, {
  NetInfoStateType,
  type NetInfoState,
} from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export type NetworkStatus = {
  isOnline: boolean;
  type: NetInfoState["type"];
};

function computeOnline(state: NetInfoState): boolean {
  if (state.isConnected === false) return false;
  // Android often reports null while still online — only treat explicit false as offline.
  if (state.isInternetReachable === false) return false;
  return true;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    type: NetInfoStateType.unknown,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus({
        isOnline: computeOnline(state),
        type: state.type,
      });
    });
    void NetInfo.fetch().then((state) => {
      setStatus({
        isOnline: computeOnline(state),
        type: state.type,
      });
    });
    return unsubscribe;
  }, []);

  return status;
}
