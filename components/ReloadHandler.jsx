"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";

export default function ReloadHander() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
  }, []);

  const updateOnlineStatus = useCallback(() => {
    setIsOnline(navigator.onLine);
  }, []);

  const handleClientRefresh = useCallback(() => {
    if (isOnline) {
      window.location.reload();
    } else {
      toast.error("Currently Offline", {
        description: "Refresh Prevented",
      });
    }
  }, [isOnline]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!navigator.onLine) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "r" && !navigator.onLine) {
        e.preventDefault();
        handleClientRefresh();
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [updateOnlineStatus, handleClientRefresh]);

  return <></>;
}
