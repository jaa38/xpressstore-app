export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions
) {
  return date.toLocaleDateString(
    "en-GB",
    options ?? {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export function formatDateTime(
  date: Date,
  options?: Intl.DateTimeFormatOptions
) {
  return date.toLocaleString(
    "en-GB",
    options ?? {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}