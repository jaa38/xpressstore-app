export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString(
    "en-GB",
    options ?? {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}
