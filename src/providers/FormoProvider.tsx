"use client";

import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { FormoAnalytics } from "@formo/analytics";
import { Cluster } from "@solana/web3.js";

// Event log entry type
export interface EventLogEntry {
  id: string;
  timestamp: Date;
  type: string;
  data: Record<string, unknown>;
}

interface FormoContextValue {
  formo: FormoAnalytics | null;
  isInitialized: boolean;
  error: string | null;
  eventLog: EventLogEntry[];
  addEventLog: (type: string, data: Record<string, unknown>) => void;
  clearEventLog: () => void;
}

const FormoContext = createContext<FormoContextValue>({
  formo: null,
  isInitialized: false,
  error: null,
  eventLog: [],
  addEventLog: () => {},
  clearEventLog: () => {},
});

export const useFormo = () => useContext(FormoContext);

interface FormoProviderProps {
  children: ReactNode;
  cluster: Cluster;
}

export const FormoProvider: FC<FormoProviderProps> = ({ children, cluster }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [formo, setFormo] = useState<FormoAnalytics | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);

  const addEventLog = useCallback((type: string, data: Record<string, unknown>) => {
    setEventLog((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        type,
        data,
      },
      ...prev,
    ].slice(0, 50)); // Keep last 50 events
  }, []);

  const clearEventLog = useCallback(() => {
    setEventLog([]);
  }, []);

  useEffect(() => {
    let instance: FormoAnalytics | null = null;
    let mounted = true;

    const initFormo = async () => {
      const writeKey = process.env.NEXT_PUBLIC_FORMO_WRITE_KEY;

      if (!writeKey || writeKey === "your_write_key_here") {
        setError("Missing NEXT_PUBLIC_FORMO_WRITE_KEY environment variable");
        addEventLog("ERROR", { message: "Missing Formo write key" });
        return;
      }

      try {
        addEventLog("INIT_STARTED", {
          cluster,
          hasWallet: !!wallet,
          hasConnection: !!connection,
        });

        instance = await FormoAnalytics.init(writeKey, {
          solana: {
            wallet,
            connection,
            cluster,
          },
        });

        if (mounted) {
          setFormo(instance);
          setIsInitialized(true);
          setError(null);
          addEventLog("INIT_SUCCESS", {
            cluster,
            walletConnected: wallet.connected,
            walletAddress: wallet.publicKey?.toBase58() || null,
          });
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          setError(errorMessage);
          addEventLog("INIT_ERROR", { error: errorMessage });
          console.error("Failed to initialize Formo:", err);
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
  }, [wallet, connection, cluster, addEventLog]);

  // Log wallet connection/disconnection events
  useEffect(() => {
    if (!isInitialized) return;

    if (wallet.connected && wallet.publicKey) {
      addEventLog("WALLET_CONNECTED", {
        address: wallet.publicKey.toBase58(),
        walletName: wallet.wallet?.adapter.name || "Unknown",
      });
    } else if (!wallet.connected && wallet.disconnecting) {
      addEventLog("WALLET_DISCONNECTING", {});
    }
  }, [wallet.connected, wallet.publicKey, wallet.disconnecting, isInitialized, addEventLog]);

  return (
    <FormoContext.Provider
      value={{
        formo,
        isInitialized,
        error,
        eventLog,
        addEventLog,
        clearEventLog,
      }}
    >
      {children}
    </FormoContext.Provider>
  );
};
