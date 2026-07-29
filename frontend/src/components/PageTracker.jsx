import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { API_URL } from "../config";

function PageTracker() {

  const location = useLocation();

  useEffect(() => {

    async function sendPageView() {

      const fp = await FingerprintJS.load();
      const result = await fp.get();

      await axios.post(
        `${API_URL}/api/site/page-view`,
        {
          fingerprint: result.visitorId,
          path: location.pathname
        }
      );

    }

    sendPageView();

  }, [location.pathname]);

  return null;
}

export default PageTracker;