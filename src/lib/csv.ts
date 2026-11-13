type CsvValue = string | number | boolean;

export function csvCell(value: CsvValue): string {
  let text = String(value);
  // Prevent guest-controlled fields from becoming spreadsheet formulas.
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function toCsv(rows: CsvValue[][]): string {
  return "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n");
}
