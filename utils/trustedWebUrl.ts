const TRUSTED_HOSTS = new Set([
  "yoy0z-maps.com",
  "www.yoy0z-maps.com",
  "buymeacoffee.com",
  "www.buymeacoffee.com",
]);

export function parseTrustedWebUrl(value: unknown): URL | null {
  if (typeof value !== "string") return null;

  try {
    const decoded = decodeURIComponent(value);
    const url = new URL(decoded);
    if (url.protocol !== "https:" || !TRUSTED_HOSTS.has(url.hostname)) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function getTrustedWebTitle(url: URL) {
  if (url.hostname.endsWith("buymeacoffee.com")) return "Donate";
  if (url.pathname.startsWith("/rovoca/privacy")) return "Privacy Policy";
  if (url.pathname.startsWith("/rovoca/terms")) return "Terms of Service";
  return "Rovoca";
}
