"use client";

import { useAutoConnect } from "@/contexts/AutoConnectProvider";
import { Switch } from "@/components/ui/switch";

export function AutoConnect() {
  const { autoConnect, setAutoConnect } = useAutoConnect();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="auto-connect"
        checked={autoConnect}
        onCheckedChange={setAutoConnect}
      />
      <label
        htmlFor="auto-connect"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Auto Connect
      </label>
    </div>
  );
}
