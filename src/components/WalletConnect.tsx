"use client";

import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const WalletConnect: FC = () => {
  const { publicKey, connected, wallet, disconnect } = useWallet();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <WalletMultiButton />
        {connected && (
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>

      {connected && publicKey && (
        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-500">●</span>
            <span className="text-green-500 font-medium">Connected</span>
          </div>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-400">Wallet:</span>{" "}
              <span className="text-white">{wallet?.adapter.name}</span>
            </p>
            <p>
              <span className="text-gray-400">Address:</span>{" "}
              <code className="text-solana-green bg-zinc-700 px-2 py-0.5 rounded text-xs">
                {publicKey.toBase58()}
              </code>
            </p>
          </div>
        </div>
      )}

      {!connected && (
        <p className="text-gray-400 text-sm">
          Connect your Solana wallet to test Formo analytics tracking.
          Supported wallets: Phantom, Solflare, Torus, Ledger.
        </p>
      )}
    </div>
  );
};
