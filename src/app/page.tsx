"use client";

import { WalletConnect } from "@/components/WalletConnect";
import { SignMessageDemo } from "@/components/SignMessageDemo";
import { TransactionDemo } from "@/components/TransactionDemo";
import { EventLog } from "@/components/EventLog";
import { FormoStatus } from "@/components/FormoStatus";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { connected } = useWallet();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
            Formo Solana Example
          </h1>
          <p className="text-gray-400">
            Test the Formo Analytics SDK with Solana wallet adapter integration
          </p>
        </header>

        {/* Formo Status */}
        <FormoStatus />

        {/* Wallet Connection */}
        <section className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4">1. Connect Wallet</h2>
          <WalletConnect />
        </section>

        {/* Sign Message Demo */}
        {connected && (
          <section className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">2. Sign Message</h2>
            <SignMessageDemo />
          </section>
        )}

        {/* Transaction Demo */}
        {connected && (
          <section className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">3. Send Transaction</h2>
            <TransactionDemo />
          </section>
        )}

        {/* Event Log */}
        <section className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4">Event Log</h2>
          <EventLog />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 pt-8 border-t border-zinc-800">
          <p>
            Built to test{" "}
            <a
              href="https://github.com/getformo/sdk/pull/157"
              target="_blank"
              rel="noopener noreferrer"
              className="text-solana-purple hover:text-solana-green transition-colors"
            >
              Formo SDK Solana Support
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
