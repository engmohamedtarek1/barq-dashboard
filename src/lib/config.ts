// lib/config.ts

const isVercelPreview =
  typeof window !== "undefined" &&
  window.location.origin === "https://barq-admin.vercel.app";

const isProduction = process.env.NODE_ENV === "production" && !isVercelPreview;

const defaultBase = isProduction
  ? "https://api.barqshipping.com/api/v1"
  : "https://api-staging.barqshipping.com/api/v1";

const defaultSocket = isProduction
  ? "https://api.barqshipping.com"
  : "https://api-staging.barqshipping.com";

// Local override for development against a locally running backend.
// Unset in every deployed environment, so behavior there is unchanged.
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || defaultBase;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || defaultSocket;
