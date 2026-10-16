"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TRACKING } from "@/lib/site-config";
import { CONSENT_EVENT, ConsentValue, getStoredConsent } from "@/lib/analytics";

/**
 * Підключає Google Analytics 4, Google Ads (gtag) і Meta Pixel.
 * Коди беруться з lib/site-config.ts (TRACKING). Порожній код = інструмент не вантажиться.
 *
 * Згода на cookie (Google Consent Mode v2):
 *  - gtag завантажується одразу, але з відмовою за замовчуванням (analytics_storage,
 *    ad_storage тощо = denied) — без cookie, доки відвідувач не натисне «Прийняти»;
 *  - Meta Pixel завантажується лише після згоди.
 */
export default function Analytics() {
  const { gaId, googleAdsId, metaPixelId } = TRACKING;
  const gtagId = gaId || googleAdsId;
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const firstPixelView = useRef(true);

  useEffect(() => {
    setConsent(getStoredConsent());
    const onChange = (e: Event) => {
      const value = (e as CustomEvent<ConsentValue>).detail;
      setConsent(value);
      if (typeof window !== "undefined" && window.gtag) {
        const v = value === "granted" ? "granted" : "denied";
        window.gtag("consent", "update", {
          ad_storage: v,
          ad_user_data: v,
          ad_personalization: v,
          analytics_storage: v
        });
      }
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Meta Pixel: PageView при переході між сторінками (перший PageView шле сам код піксела).
  useEffect(() => {
    if (consent !== "granted" || !metaPixelId) return;
    if (firstPixelView.current) {
      firstPixelView.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname, consent, metaPixelId]);

  return (
    <>
      {gtagId && (
        <>
          <Script
            id="gtag-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              var stored = null;
              try { stored = localStorage.getItem('cas-cookie-consent'); } catch (e) {}
              var c = stored === 'granted' ? 'granted' : 'denied';
              gtag('consent', 'default', {
                ad_storage: c, ad_user_data: c, ad_personalization: c, analytics_storage: c
              });
              gtag('js', new Date());
              ${gaId ? `gtag('config', '${gaId}');` : ""}
              ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ""}
            `}
          </Script>
        </>
      )}

      {metaPixelId && consent === "granted" && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
