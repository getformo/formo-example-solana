"use client";

import { FC, useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNetworkConfiguration } from "@/contexts/NetworkConfigurationProvider";
import { toast } from "sonner";
import { Loader2, Layers } from "lucide-react";

export const SignAllTransactions: FC = () => {
  const { connection } = useConnection();
  const { publicKey, signAllTransactions } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = useCallback(async () => {
    if (!publicKey) {
      toast.error("Wallet not connected!");
      return;
    }

    if (!signAllTransactions) {
      toast.error("Wallet does not support signing multiple transactions!");
      return;
    }

    setIsLoading(true);

    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      // Create 3 small transactions
      const transactions = Array.from({ length: 3 }, () => {
        const tx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: Keypair.generate().publicKey,
            lamports: 0.0001 * LAMPORTS_PER_SOL, // Very small amount
          })
        );
        tx.recentBlockhash = blockhash;
        tx.feePayer = publicKey;
        return tx;
      });

      toast.info("Signing Batch", {
        description: `Please approve ${transactions.length} transactions in your wallet`,
      });

      // Sign all transactions at once
      const signedTransactions = await signAllTransactions(transactions);

      toast.info("Broadcasting Transactions", {
        description: `Sending ${signedTransactions.length} signed transactions`,
      });

      // Send all signed transactions
      const signatures = await Promise.all(
        signedTransactions.map((tx) => connection.sendRawTransaction(tx.serialize()))
      );

      // Confirm all transactions
      await Promise.all(
        signatures.map((sig) =>
          connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature: sig,
          })
        )
      );

      toast.success("Batch Complete!", {
        description: `Successfully sent ${signatures.length} transactions`,
        action: {
          label: "View First",
          onClick: () => window.open(
            `https://explorer.solana.com/tx/${signatures[0]}?cluster=${networkConfiguration}`,
            "_blank"
          ),
        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      if (errorMessage.includes("User rejected")) {
        toast.warning("Batch Signing Cancelled", {
          description: "You rejected the batch signing request",
        });
      } else {
        toast.error("Batch Transaction Failed", {
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, signAllTransactions, networkConfiguration]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Sign All Transactions (Batch)
        </CardTitle>
        <CardDescription>
          Sign and send 3 transactions in a batch. Tests signAllTransactions capability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="gradient"
          onClick={onClick}
          disabled={!publicKey || !signAllTransactions || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Batch...
            </>
          ) : !signAllTransactions ? (
            "Wallet Doesn't Support Batch Signing"
          ) : publicKey ? (
            "Sign & Send 3 Transactions"
          ) : (
            "Connect Wallet First"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
