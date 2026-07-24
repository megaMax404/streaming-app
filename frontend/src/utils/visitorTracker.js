import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import { API_URL } from "../config";

export async function trackVisitor() {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    await axios.post(`${API_URL}/api/site/visit`, {
      fingerprint: result.visitorId,
    });

    console.log("Visitor tracked:", result.visitorId);
  } catch (err) {
    console.error("Visitor tracking failed:", err);
  }
}