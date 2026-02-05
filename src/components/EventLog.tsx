"use client";

import { FC } from "react";
import { useFormo } from "@/providers/FormoProvider";

export const EventLog: FC = () => {
  const { eventLog, clearEventLog } = useFormo();

  const getEventColor = (type: string): string => {
    if (type.includes("ERROR") || type.includes("REVERTED")) {
      return "text-red-400";
    }
    if (type.includes("SUCCESS") || type.includes("CONFIRMED")) {
      return "text-green-400";
    }
    if (type.includes("STARTED") || type.includes("REQUESTED")) {
      return "text-yellow-400";
    }
    if (type.includes("BROADCASTED")) {
      return "text-blue-400";
    }
    if (type.includes("INIT")) {
      return "text-solana-purple";
    }
    if (type.includes("WALLET")) {
      return "text-solana-green";
    }
    return "text-gray-400";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Real-time log of Formo analytics events.
        </p>
        {eventLog.length > 0 && (
          <button
            onClick={clearEventLog}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Clear log
          </button>
        )}
      </div>

      <div className="bg-zinc-950 rounded-lg border border-zinc-800 h-64 overflow-y-auto font-mono text-xs">
        {eventLog.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No events yet. Connect wallet and interact to see events.
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {eventLog.map((entry) => (
              <div key={entry.id} className="border-b border-zinc-800 pb-2 last:border-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-600">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`font-semibold ${getEventColor(entry.type)}`}>
                    {entry.type}
                  </span>
                </div>
                {Object.keys(entry.data).length > 0 && (
                  <pre className="text-gray-400 mt-1 whitespace-pre-wrap break-all">
                    {JSON.stringify(entry.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs">
        💡 These are local UI events. Check your browser console and Formo dashboard for SDK-tracked events.
      </p>
    </div>
  );
};
