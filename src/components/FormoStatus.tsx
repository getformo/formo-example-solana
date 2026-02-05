"use client";

import { FC } from "react";
import { useFormo } from "@/providers/FormoProvider";

export const FormoStatus: FC = () => {
  const { isInitialized, error } = useFormo();

  return (
    <div className="flex items-center justify-center">
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
          error
            ? "bg-red-900/30 text-red-400 border border-red-700"
            : isInitialized
            ? "bg-green-900/30 text-green-400 border border-green-700"
            : "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            error
              ? "bg-red-500"
              : isInitialized
              ? "bg-green-500 animate-pulse"
              : "bg-yellow-500 animate-pulse"
          }`}
        />
        <span>
          {error
            ? `Formo Error: ${error}`
            : isInitialized
            ? "Formo SDK Connected"
            : "Initializing Formo..."}
        </span>
      </div>
    </div>
  );
};
