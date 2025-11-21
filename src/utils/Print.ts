import { PDFDocument, PDFPage } from "pdf-lib";
import { TGeneralStore, THeadingStore, TWeatherStore } from "./Storage";
import { TAirplane } from "./Data";

const printHeader = (pdf: PDFPage, generalInfo: TGeneralStore, airplane: TAirplane) => {
  pdf.moveTo(360, 545);
  pdf.drawText(airplane.model, {
    size: 12,
  });

  pdf.moveTo(70, 530);
  pdf.drawText(airplane.registration, {
    size: 10,
  });

  pdf.moveTo(135, 530);
  pdf.drawText(generalInfo.departure, {
    size: 10,
  });

  pdf.moveTo(210, 530);
  pdf.drawText(generalInfo.departure, {
    size: 10,
  });

  pdf.moveTo(350, 530);
  pdf.drawText(generalInfo.date, {
    size: 10,
  });
}

export const printNavLog = async (generalInfo: TGeneralStore, headings: THeadingStore[], weather: TWeatherStore, airplane: TAirplane): Promise<Uint8Array> => {
  const url = "/documents/navlog.pdf";
  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

  const pdf = await PDFDocument.load(existingPdfBytes);
  const page = pdf.getPage(0);

  printHeader(page, generalInfo, airplane);

  return pdf.save();
}

export const downloadFile = (data: Uint8Array, filename: string, type: string) => {
  const blob = new Blob([data] as BlobPart[], { type: type });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, 0);
}

