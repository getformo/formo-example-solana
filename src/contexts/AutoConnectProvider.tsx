"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AutoConnectContextState {
  autoConnect: boolean;
  setAutoConnect: (autoConnect: boolean) => void;
}

const AutoConnectContext = createContext<AutoConnectContextState>({
  autoConnect: true,
  setAutoConnect: () => {},
});

export function useAutoConnect() {
  return useContext(AutoConnectContext);
}

export function AutoConnectProvider({ children }: { children: ReactNode }) {
  const [autoConnect, setAutoConnect] = useState(true);

  return (
    <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      {children}
    </AutoConnectContext.Provider>
  );
}
