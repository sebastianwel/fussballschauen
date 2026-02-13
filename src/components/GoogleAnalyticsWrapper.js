"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useState, useEffect } from "react";

export default function GoogleAnalyticsWrapper() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // 1. Initialer Check beim Laden der Seite
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "true") {
      setHasConsent(true);
    }

    // 2. Event-Listener, falls der Nutzer JETZT gerade im Banner klickt
    // Wir nutzen ein Custom Event, um ohne Page-Reload zu reagieren
    const handleConsentChange = () => {
      setHasConsent(true);
    };

    window.addEventListener("cookie-consent-given", handleConsentChange);
    return () =>
      window.removeEventListener("cookie-consent-given", handleConsentChange);
  }, []);

  if (!hasConsent) return null;

  return <GoogleAnalytics gaId="G-6FDX2Q52GZ" />;
}
