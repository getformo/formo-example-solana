"use client";

import { ThemeProvider } from "next-themes";
import { WalletContextProvider } from "@/contexts/WalletContextProvider";
import { NetworkConfigurationProvider } from "@/contexts/NetworkConfigurationProvider";
import { AutoConnectProvider } from "@/contexts/AutoConnectProvider";
import { FormoProvider } from "@/contexts/FormoProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NetworkConfigurationProvider>
        <AutoConnectProvider>
          <WalletContextProvider>
            <FormoProvider>
              {children}
            </FormoProvider>
          </WalletContextProvider>
        </AutoConnectProvider>
      </NetworkConfigurationProvider>
    </ThemeProvider>
  );
}
