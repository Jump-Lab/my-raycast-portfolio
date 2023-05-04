import { Action, ActionPanel, Detail, popToRoot } from "@raycast/api";
import { useEffect, useState } from "react";
import { Logout, authorize } from "./oauth/google";

export default function Command() {
  const [appState, setAppState] = useState<"idle" | "auth" | "guest">("idle");

  const handleGetAuth = async () => {
    const req = await authorize();
    if (req) {
      setAppState("auth");
    }
  };

  useEffect(() => {
    handleGetAuth();
  }, []);

  if (appState === "idle") {
    return <Detail markdown={`## Getting auth state`} />;
  }

  if (appState === "guest") {
    return <Detail navigationTitle="Login" markdown={`## You haven't logged in yet`} metadata={<button>Test</button>} />;
  }

  return (
    <Detail
      markdown={`
   ## Logout your google account`}
      actions={
        <ActionPanel>
          <Action
            title="Logout"
            onAction={() =>
              Logout().finally(() => {
                popToRoot();
              })
            }
          />
        </ActionPanel>
      }
    />
  );
}
