"use client";

import { useState, useEffect } from "react";

export function useTelegramUser() {
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [tier, setTier] = useState<string>("free");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const tg = window.Telegram?.WebApp;
    // Fallback logic if testing outside Telegram (optional for dev)
    if (!tg || !tg.initDataUnsafe?.user) {
      if (process.env.NODE_ENV === "development") {
         // Mock development data
         setTelegramId(123456789);
         setTier("free"); // Change to "guardian" or "founder" to test locally
         setIsLoading(false);
         return;
      }
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const initData = tg.initData;

    // Fetch secure user data from our backend
    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData })
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    })
    .then(data => {
      setTelegramId(data.telegramId);
      setTier(data.tier);
      setIsLoading(false);
    })
    .catch(err => {
      console.error("[useTelegramUser] Error:", err);
      setIsError(true);
      setIsLoading(false);
    });

  }, []);

  return { telegramId, tier, isLoading, isError };
}
