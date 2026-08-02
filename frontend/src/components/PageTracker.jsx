import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { API_URL } from "../config";

function PageTracker() {
  const location = useLocation();
  const visited = useRef(false);

  useEffect(() => {
    async function track() {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      // ยิง /visit แค่ครั้งแรก
      if (!visited.current) {
        visited.current = true;

        await axios.post(`${API_URL}/api/site/visit`, {
          fingerprint: result.visitorId,
          browser: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          screen: {
            width: window.screen.width,
            height: window.screen.height,
          },
          referrer: document.referrer,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }

      // ยิงทุกครั้งที่เปลี่ยนหน้า
      await axios.post(`${API_URL}/api/site/page-view`, {
        fingerprint: result.visitorId,
        path: location.pathname,
      });
    }

    track();
  }, [location.pathname]);

  return null;
}

export default PageTracker;