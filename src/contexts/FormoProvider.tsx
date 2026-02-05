"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { FormoAnalytics } from "@formo/analytics";
import { useNetworkConfiguration } from "./NetworkConfigurationProvider";
import { toast } from "sonner";

interface FormoContextState {
  formo: FormoAnalytics | null;
  isInitialized: boolean;
  error: string | null;
}

const FormoContext = createContext<FormoContextState>({
  formo: null,
  isInitialized: false,
  error: null,
});

export function useFormo() {
  return useContext(FormoContext);
}

export function FormoProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { networkConfiguration } = useNetworkConfiguration();
  const [formo, setFormo] = useState<FormoAnalytics | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let instance: FormoAnalytics | null = null;
    let mounted = true;

    const initFormo = async () => {
      const writeKey = process.env.NEXT_PUBLIC_FORMO_WRITE_KEY;

      if (!writeKey || writeKey === "your_write_key_here") {
        const errorMsg = "Missing NEXT_PUBLIC_FORMO_WRITE_KEY";
        setError(errorMsg);
        console.warn("[Formo]", errorMsg);
        return;
      }

      try {
        instance = await FormoAnalytics.init(writeKey, {
          solana: {
            wallet,
            connection,
            cluster: networkConfiguration,
          },
        });

        if (mounted) {
          setFormo(instance);
          setIsInitialized(true);
          setError(null);
          console.log("[Formo] Initialized with Solana support", {
            cluster: networkConfiguration,
            walletConnected: wallet.connected,
          });
        } else {
          instance.cleanup();
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          setError(errorMessage);
          console.error("[Formo] Initialization failed:", err);
        }
      }
    };

    initFormo();

    return () => {
      mounted = false;
      if (instance) {
        instance.cleanup();
      }
    };
  }, [wallet, connection, networkConfiguration]);

  // Log wallet events
  useEffect(() => {
    if (!isInitialized) return;

    if (wallet.connected && wallet.publicKey) {
      toast.success("Wallet Connected", {
        description: `${wallet.publicKey.toBase58().slice(0, 8)}...${wallet.publicKey.toBase58().slice(-8)}`,
      });
    }
  }, [wallet.connected, wallet.publicKey, isInitialized]);

  return (
    <FormoContext.Provider value={{ formo, isInitialized, error }}>
      {children}
    </FormoContext.Provider>
  );
}
