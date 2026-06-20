function isValidUrl(url) {
  if (!url || typeof url !== "string") return true;

  try {
    const parsed = new URL(url);

    const allowedProtocols = ["http:", "https:"];

    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

module.exports = { isValidUrl };