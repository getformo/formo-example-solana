"use client";

import { WalletInfo } from "@/components/WalletInfo";
import {
  RequestAirdrop,
  SendTransaction,
  SendVersionedTransaction,
  SignMessage,
  SignTransaction,
  SignAllTransactions,
} from "@/components/demos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
            Formo + Solana
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Test the Formo Analytics SDK integration with Solana wallet adapter.
          Try wallet connections, message signing, and transactions to see events tracked in real-time.
        </p>
      </div>

      {/* Wallet Info Card */}
      <WalletInfo />

      {/* Demo Sections */}
      {connected && (
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="signing">Signing</TabsTrigger>
            <TabsTrigger value="faucet">Faucet</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <SendTransaction />
              <SendVersionedTransaction />
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="text-sm font-medium mb-2">Transaction Events Tracked</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code className="text-xs">transaction_started</code> - When you initiate a transaction</li>
                <li>• <code className="text-xs">transaction_broadcasted</code> - When transaction is sent to network</li>
                <li>• <code className="text-xs">transaction_confirmed</code> - When transaction is confirmed on-chain</li>
                <li>• <code className="text-xs">transaction_reverted</code> - If transaction fails on-chain</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="signing" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <SignMessage />
              <SignTransaction />
            </div>
            <SignAllTransactions />
            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="text-sm font-medium mb-2">Signature Events Tracked</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code className="text-xs">signature_requested</code> - When signing is initiated</li>
                <li>• <code className="text-xs">signature_confirmed</code> - When user approves the signature</li>
                <li>• <code className="text-xs">signature_rejected</code> - When user rejects the signature</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="faucet" className="space-y-4">
            <div className="max-w-md mx-auto">
              <RequestAirdrop />
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="text-sm font-medium mb-2">Note</h3>
              <p className="text-sm text-muted-foreground">
                Airdrops only work on devnet. Make sure you have the network set to "Devnet" in the header.
                You may need to wait between airdrop requests due to rate limiting.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Getting Started Section (when not connected) */}
      {!connected && (
        <div className="rounded-lg border bg-card p-8 text-center space-y-4">
          <h2 className="text-xl font-semibold">Get Started</h2>
          <ol className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto text-left list-decimal list-inside">
            <li>Click "Select Wallet" in the header to connect your Solana wallet</li>
            <li>Make sure you're on Devnet (change in header if needed)</li>
            <li>Request an airdrop to get test SOL</li>
            <li>Try the transaction and signing demos</li>
            <li>Check the browser console for Formo SDK events</li>
          </ol>
        </div>
      )}

      {/* SDK Info */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Formo SDK Integration</h2>
        <p className="text-sm text-muted-foreground">
          This app tests the Solana wallet adapter support added in{" "}
          <a
            href="https://github.com/getformo/sdk/pull/157"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            PR #157
          </a>.
          The SDK automatically tracks wallet events, signatures, and transaction lifecycle.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-2">Wallet Events</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• wallet_connect</li>
              <li>• wallet_disconnect</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-2">Initialization</h3>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`FormoAnalytics.init(key, {
  solana: {
    wallet,
    connection,
    cluster: "devnet"
  }
})`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
