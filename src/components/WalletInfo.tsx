"use client";

import { useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useUserSOLBalanceStore } from "@/stores/useUserSOLBalanceStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutoConnect } from "@/components/wallet/AutoConnect";

export function WalletInfo() {
  const { publicKey, connected, wallet, disconnect } = useWallet();
  const { connection } = useConnection();
  const { balance, isLoading, getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (publicKey) {
      getUserSOLBalance(publicKey, connection);
    }
  }, [publicKey, connection, getUserSOLBalance]);

  if (!connected || !publicKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Status
          </CardTitle>
          <CardDescription>
            Connect your wallet to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">
              No wallet connected. Click the button in the header to connect.
            </p>
          </div>
          <AutoConnect />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connected
        </CardTitle>
        <CardDescription>
          Connected via {wallet?.adapter.name || "Unknown Wallet"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Address</span>
            <code className="rounded bg-muted px-2 py-1 text-xs">
              {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">
                {isLoading ? "..." : balance.toFixed(4)} SOL
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => getUserSOLBalance(publicKey, connection)}
                disabled={isLoading}
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <AutoConnect />
          <Button variant="outline" size="sm" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
