"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/tracking";

/**
 * The Pixel snippet tracks the first PageView itself; client-side navigations
 * don't reload the page, so report each later route change explicitly.
 */
export function PixelPageViews() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  return null;
}
