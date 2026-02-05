"use client";

import { FC, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useFormo } from "@/providers/FormoProvider";

export const TransactionDemo: FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { addEventLog } = useFormo();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.001");
  const [isLoading, setIsLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendTransaction = async () => {
    if (!publicKey || !sendTransaction) {
      setError("Wallet not connected");
      return;
    }

    let recipientPubkey: PublicKey;
    try {
      recipientPubkey = new PublicKey(recipient || publicKey.toBase58());
    } catch {
      setError("Invalid recipient address");
      return;
    }

    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
    if (isNaN(lamports) || lamports <= 0) {
      setError("Invalid amount");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxSignature(null);

    addEventLog("TRANSACTION_STARTED", {
      from: publicKey.toBase58(),
      to: recipientPubkey.toBase58(),
      amount: lamports,
    });

    try {
      // Create transfer instruction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      setTxSignature(signature);

      addEventLog("TRANSACTION_BROADCASTED", {
        signature,
        from: publicKey.toBase58(),
        to: recipientPubkey.toBase58(),
        amount: lamports,
      });

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      addEventLog("TRANSACTION_CONFIRMED", {
        signature,
        slot: confirmation.context.slot,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Transaction failed";
      setError(errorMessage);
      addEventLog("TRANSACTION_ERROR", { error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAirdrop = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError(null);
    addEventLog("AIRDROP_REQUESTED", { address: publicKey.toBase58() });

    try {
      const signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature);
      setTxSignature(signature);
      addEventLog("AIRDROP_SUCCESS", {
        signature,
        amount: LAMPORTS_PER_SOL,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Airdrop failed";
      setError(errorMessage);
      addEventLog("AIRDROP_ERROR", { error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm">
        Test SOL transfers. Formo tracks transaction lifecycle: STARTED → BROADCASTED → CONFIRMED/REVERTED.
      </p>

      {/* Airdrop Section */}
      <div className="bg-zinc-800/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Get Devnet SOL</h3>
        <button
          onClick={handleAirdrop}
          disabled={isLoading}
          className="px-4 py-2 bg-solana-green/20 hover:bg-solana-green/30 text-solana-green border border-solana-green/50 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isLoading ? "Requesting..." : "Request 1 SOL Airdrop"}
        </button>
      </div>

      {/* Transfer Section */}
      <div className="space-y-3">
        <div>
          <label htmlFor="recipient" className="block text-sm text-gray-400 mb-1">
            Recipient address (leave empty to send to yourself):
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-solana-purple font-mono text-sm"
            placeholder={publicKey?.toBase58() || "Enter Solana address..."}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm text-gray-400 mb-1">
            Amount (SOL):
          </label>
          <input
            id="amount"
            type="number"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-solana-purple"
          />
        </div>

        <button
          onClick={handleSendTransaction}
          disabled={isLoading}
          className="px-4 py-2 bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-opacity"
        >
          {isLoading ? "Processing..." : "Send Transaction"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {txSignature && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 space-y-2">
          <p className="text-green-400 font-medium">Transaction successful!</p>
          <div className="text-sm">
            <p className="text-gray-400 mb-1">Signature:</p>
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-zinc-800 p-2 rounded text-xs text-solana-purple hover:text-solana-green break-all transition-colors"
            >
              {txSignature}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
