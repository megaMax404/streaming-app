import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import { API_URL } from "../config";

let heartbeat = null;

export async function trackVisitor() {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    const fingerprint = result.visitorId;

    // Visit ครั้งแรก
    await axios.post(`${API_URL}/api/site/visit`, {
      fingerprint,
    });

    // Heartbeat ทันที
    await axios.post(`${API_URL}/api/site/heartbeat`, {
      fingerprint,
    });

    // ส่งทุก 30 วินาที
    heartbeat = setInterval(() => {
      axios.post(`${API_URL}/api/site/heartbeat`, {
        fingerprint,
      }).catch(() => {});
    }, 30000);

  } catch (err) {
    console.error("Visitor tracking failed:", err);
  }
}

export function stopTracking() {
  if (heartbeat) {
    clearInterval(heartbeat);
  }
}