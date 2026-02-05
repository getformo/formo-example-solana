"use client";

import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useFormo } from "@/providers/FormoProvider";
import bs58 from "bs58";

export const SignMessageDemo: FC = () => {
  const { signMessage, publicKey } = useWallet();
  const { addEventLog } = useFormo();
  const [message, setMessage] = useState("Hello from Formo Solana Example!");
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignMessage = async () => {
    if (!signMessage || !publicKey) {
      setError("Wallet does not support message signing");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSignature(null);

    addEventLog("SIGN_MESSAGE_REQUESTED", { message });

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const sig = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(sig);

      setSignature(signatureBase58);
      addEventLog("SIGN_MESSAGE_SUCCESS", {
        message,
        signature: signatureBase58,
        signer: publicKey.toBase58(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign message";
      setError(errorMessage);
      addEventLog("SIGN_MESSAGE_ERROR", { message, error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm">
        Test message signing. Formo tracks signature requests and outcomes.
      </p>

      <div className="space-y-3">
        <div>
          <label htmlFor="message" className="block text-sm text-gray-400 mb-1">
            Message to sign:
          </label>
          <input
            id="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-solana-purple"
            placeholder="Enter a message to sign..."
          />
        </div>

        <button
          onClick={handleSignMessage}
          disabled={isLoading || !signMessage}
          className="px-4 py-2 bg-solana-purple hover:bg-solana-purple/80 disabled:bg-zinc-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          {isLoading ? "Signing..." : "Sign Message"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {signature && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 space-y-2">
          <p className="text-green-400 font-medium">Message signed successfully!</p>
          <div className="text-sm">
            <p className="text-gray-400 mb-1">Signature:</p>
            <code className="block bg-zinc-800 p-2 rounded text-xs text-solana-green break-all">
              {signature}
            </code>
          </div>
        </div>
      )}

      {!signMessage && (
        <p className="text-yellow-500 text-sm">
          ⚠️ Your wallet does not support message signing.
        </p>
      )}
    </div>
  );
};
