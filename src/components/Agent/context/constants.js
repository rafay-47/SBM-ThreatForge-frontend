const sentryApiUrl = (import.meta.env.VITE_SENTRY_API_URL || "").trim();
const hasSentryEndpoint = sentryApiUrl.length > 0;

export const SENTRY_ENABLED = import.meta.env.VITE_SENTRY_ENABLED === "true" && hasSentryEndpoint;

const buildEndpoint = (path) => {
  if (!SENTRY_ENABLED) {
    return null;
  }
  const base = sentryApiUrl.replace(/\/$/, "");
  return `${base}/${path}`;
};

export const API_ENDPOINT = buildEndpoint("invocations");
export const TOOLS_ENDPOINT = buildEndpoint("invocations");
export const SESSION_HISTORY_ENDPOINT = buildEndpoint("invocations");
export const SESSION_PREPARE_ENDPOINT = buildEndpoint("invocations");
export const SESSION_CLEAR_ENDPOINT = buildEndpoint("invocations");
