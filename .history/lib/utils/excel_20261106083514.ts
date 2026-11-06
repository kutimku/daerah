// ============================================================
// Ekspor data ke file Excel (.xlsx)
// ============================================================
import * as XLSX from "xlsx";

/**
 * Ekspor array of object ke file Excel.
 * @param rows    array data
 * @param headers mapping { key: 'Judul Kolom' }
 * @param filename nama file tanpa .xlsx
 */
export function exportKeExcel(
  rows: Record<string, any>[],
  headers: Record<string, string>,
  filename: string,
) {
  // Susun ulang data sesuai urutan headers
  const data = rows.map((row) => {
    const obj: Record<string, any> = {};
    for (const key of Object.keys(headers)) {
      obj[headers[key]] = row[key] ?? "";
    }
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Auto lebar kolom (perkiraan sederhana)
  const colWidths = Object.values(headers).map((h) => ({
    wch: Math.max(h.length + 2, 15),
  }));
  (worksheet as any)["!cols"] = colWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
