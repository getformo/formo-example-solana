"use client";

import { FC, useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSOLBalanceStore } from "@/stores/useUserSOLBalanceStore";
import { toast } from "sonner";
import { Loader2, Coins } from "lucide-react";

export const RequestAirdrop: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = useCallback(async () => {
    if (!publicKey) {
      toast.error("Wallet not connected!");
      return;
    }

    setIsLoading(true);
    let signature = "";

    try {
      signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature,
      });

      getUserSOLBalance(publicKey, connection);

      toast.success("Airdrop Successful!", {
        description: "1 SOL has been airdropped to your wallet",
        action: {
          label: "View",
          onClick: () => window.open(
            `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
            "_blank"
          ),
        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error("Airdrop Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, getUserSOLBalance]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Request Airdrop
        </CardTitle>
        <CardDescription>
          Get 1 SOL from the devnet faucet. Only works on devnet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="gradient"
          onClick={onClick}
          disabled={!publicKey || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting...
            </>
          ) : publicKey ? (
            "Request 1 SOL Airdrop"
          ) : (
            "Connect Wallet First"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
