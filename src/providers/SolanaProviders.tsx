"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Cluster } from "@solana/web3.js";
import { FormoProvider } from "./FormoProvider";

import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaProvidersProps {
  children: ReactNode;
}

export const SolanaProviders: FC<SolanaProvidersProps> = ({ children }) => {
  // Get cluster from environment or default to devnet
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet") as Cluster;

  // Use custom RPC URL or default cluster URL
  const endpoint = useMemo(() => {
    const customRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    return customRpc || clusterApiUrl(cluster);
  }, [cluster]);

  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <FormoProvider cluster={cluster}>
            {children}
          </FormoProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
