export function formatDate(value: string | Date, short = false): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: short ? "short" : "long", year: "numeric", timeZone: "UTC"
  }).format(new Date(value));
}

export function formatTime(value: string): string {
  const [hours, minutes] = value.split(":").map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function rsvpIsOpen(wedding: { isOpen: boolean; deadline: string | Date | null }, now = new Date()): boolean {
  if (!wedding.isOpen) return false;
  if (!wedding.deadline) return true;
  const day = new Date(wedding.deadline).toISOString().slice(0, 10);
  // RSVP deadlines end at midnight in India, where this wedding service is based.
  return now.getTime() < new Date(`${day}T23:59:59.999+05:30`).getTime();
}
