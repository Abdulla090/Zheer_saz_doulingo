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
    let active = true;
    let receivedEvent = false;
    const update = (state: NetInfoState) => {
      if (!active) return;
      const isOnline = computeOnline(state);
      setStatus(previous => previous.isOnline === isOnline && previous.type === state.type
        ? previous : { isOnline, type: state.type });
    };
    const unsubscribe = NetInfo.addEventListener((state) => {
      receivedEvent = true;
      update(state);
    });
    void NetInfo.fetch().then(state => {
      if (!receivedEvent) update(state);
    }).catch(() => { /* Keep the last known connection state. */ });
    return () => { active = false; unsubscribe(); };
  }, []);

  return status;
}
