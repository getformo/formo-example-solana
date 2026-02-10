"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Network = "devnet" | "testnet" | "mainnet-beta";

interface NetworkConfigurationContextState {
  networkConfiguration: Network;
  setNetworkConfiguration: (network: Network) => void;
}

const NetworkConfigurationContext = createContext<NetworkConfigurationContextState>({
  networkConfiguration: "devnet",
  setNetworkConfiguration: () => {},
});

export function useNetworkConfiguration() {
  return useContext(NetworkConfigurationContext);
}

export function NetworkConfigurationProvider({ children }: { children: ReactNode }) {
  const [networkConfiguration, setNetworkConfiguration] = useState<Network>(
    (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as Network) || "devnet"
  );

  return (
    <NetworkConfigurationContext.Provider
      value={{ networkConfiguration, setNetworkConfiguration }}
    >
      {children}
    </NetworkConfigurationContext.Provider>
  );
}
