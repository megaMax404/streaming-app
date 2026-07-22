const url = import.meta.env.VITE_API_URL;

if (!url) {
  throw new Error("VITE_API_URL is missing");
}

export const API_URL = url;