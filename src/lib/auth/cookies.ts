export function parseCookieHeader(header: string | undefined): Record<string, string> {
  if (!header) {
    return {};
  }

  return header
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .reduce<Record<string, string>>((cookies, part) => {
      const separatorIndex = part.indexOf("=");

      if (separatorIndex <= 0) {
        return cookies;
      }

      const name = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();

      if (!name) {
        return cookies;
      }

      cookies[name] = value;
      return cookies;
    }, {});
}
