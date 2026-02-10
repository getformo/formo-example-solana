"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
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

  // Use ref to hold the current wallet to avoid re-init on every wallet state change
  const walletRef = useRef(wallet);
  walletRef.current = wallet;

  // Only re-initialize when connection or network actually changes
  // The wallet adapter's connection changes when the endpoint changes
  const connectionEndpoint = connection.rpcEndpoint;

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
        // Use the ref to get current wallet state without causing re-renders
        instance = await FormoAnalytics.init(writeKey, {
          solana: {
            wallet: walletRef.current,
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
            endpoint: connectionEndpoint,
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
  }, [connection, connectionEndpoint, networkConfiguration]);

  // Update SDK when wallet state changes (connect/disconnect)
  // This is critical for the SDK to emit connect/disconnect events
  useEffect(() => {
    if (!formo) return;

    // Update the SDK's wallet reference so it can track connect/disconnect
    formo.setSolanaWallet(wallet);
  }, [formo, wallet]);

  // Show toast notifications for wallet events
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
