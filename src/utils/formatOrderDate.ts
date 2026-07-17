export function formatOrderDate(date: string): string {
  const orderDate = new Date(date);
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const orderDay = new Date(
    orderDate.getFullYear(),
    orderDate.getMonth(),
    orderDate.getDate()
  );

  const time = orderDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (orderDay.getTime() === today.getTime()) {
    return `Today, ${time}`;
  }

  if (orderDay.getTime() === yesterday.getTime()) {
    return `Yesterday, ${time}`;
  }

  return orderDate.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}