import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  exportToExcel<T>(
    data: T[],
    columns: { header: string; accessor: (item: T) => any }[],
    fileName: string,
    sheetName: string
  ): void {
    // Mapea los datos utilizando los accesorios de las columnas
    const formattedData = data.map((item) =>
      columns.reduce((acc, col) => {
        acc[col.header] = col.accessor(item);
        return acc;
      }, {} as { [key: string]: any })
    );

    // Crea una hoja de trabajo de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Ajusta el ancho de las columnas
    const columnWidths = columns.map((col) => {
      const maxLength = Math.max(
        col.header.length,
        ...formattedData.map((row) => (row[col.header] ? row[col.header].toString().length : 0))
      );
      return { wch: maxLength + 2 };
    });

    ws['!cols'] = columnWidths;

    // Agrega la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Genera el archivo Excel
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
