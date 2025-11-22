import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import { TGeneralStore, THeadingStore, TWeatherStore } from "./Storage";
import { TAirplane } from "./Data";

const intToStr = (num: number, padding?: number, sign?: boolean): string => {
  let res = num.toString();
  if (padding) {
    res = res.padStart(padding, '0');
  }

  if (sign && num >= 0) {
    res = '+' + res;
  }

  return res;
}

const floatToStr = (num: number, decimalPlaces: number): string => {
  let res = num.toFixed(decimalPlaces);
  return res;
}

const timeToStr = (time: number): string => {
  return intToStr(Math.floor(time / 60), 2) + ":" + intToStr(time % 60, 2);
}

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

const printHeadings = (pdf: PDFPage, generalInfo: TGeneralStore, headings: THeadingStore[]) => {
  const heightDif = 29;

  let totalFuel = 0;
  let totalDist = 0;
  let totalTime = 0;

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const height = heightDif * i;

    pdf.moveTo(45, 407 - height);
    pdf.drawText(heading.from, {
      size: 12,
    });

    if (i == headings.length - 1) {
      pdf.moveTo(45, 407 - height - heightDif);
      pdf.drawText(heading.to, {
        size: 12,
      });
    }

    pdf.moveTo(114, 403 - height);
    pdf.drawText(heading.frequency, {
      size: 8,
    });

    pdf.moveTo(114, 390 - height);
    pdf.drawText(heading.frequency, {
      size: 8,
    });

    pdf.moveTo(150, 403 - height);
    pdf.drawText(intToStr(heading.trueCourse, 3), {
      size: 8,
    });
    pdf.moveTo(150, 390 - height);
    pdf.drawText(intToStr(heading.windCorrectionAngle, 0, true), {
      size: 8,
    });

    pdf.moveTo(177, 403 - height);
    pdf.drawText(intToStr(heading.trueHeading, 3), {
      size: 8,
    });
    pdf.moveTo(177, 390 - height);
    pdf.drawText(intToStr(heading.variation, 0, true), {
      size: 8,
    });

    pdf.moveTo(205, 403 - height);
    pdf.drawText(intToStr(heading.magneticHeading, 3), {
      size: 8,
    });
    pdf.moveTo(205, 390 - height);
    pdf.drawText(intToStr(heading.deviation, 0, true), {
      size: 8,
    });

    pdf.moveTo(230, 395 - height);
    pdf.drawText(intToStr(heading.heading, 3), {
      size: 12,
      color: rgb(1, 0, 0),
    });

    pdf.moveTo(285, 403 - height);
    pdf.drawText(intToStr(heading.airSpeed), {
      size: 8,
    });
    pdf.moveTo(285, 390 - height);
    pdf.drawText(intToStr(heading.groudSpeed), {
      size: 8,
    });

    pdf.moveTo(310, 403 - height);
    pdf.drawText(floatToStr(heading.fuelLeg, 2), {
      size: 8,
    });
    pdf.moveTo(310, 390 - height);
    pdf.drawText(floatToStr(heading.fuelRem, 2), {
      size: 8,
      color: rgb(1, 0, 0),
    });

    pdf.moveTo(337, 403 - height);
    pdf.drawText(floatToStr(heading.distLeg, 2), {
      size: 8,
    });
    pdf.moveTo(337, 390 - height);
    pdf.drawText(floatToStr(heading.distRem, 2), {
      size: 8,
    });

    pdf.moveTo(365, 403 - height);
    pdf.drawText(timeToStr(heading.ete), {
      size: 8,
    });
    pdf.moveTo(365, 390 - height);
    pdf.drawText(timeToStr(heading.corr), {
      size: 8,
      color: rgb(1, 0, 0),
    });

    pdf.moveTo(392, 403 - height);
    pdf.drawText(timeToStr(heading.eta), {
      size: 8,
      color: rgb(1, 0, 0),
    });

    totalFuel += heading.fuelLeg;
    totalDist += heading.distLeg;
    totalTime += heading.corr;
  }
}

const printTotals = (pdf: PDFPage, headings: THeadingStore[], airplane: TAirplane) => {
  let totalFuel = 0;
  let totalDist = 0;
  let totalTime = 0;

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    totalFuel += heading.fuelLeg;
    totalDist += heading.distLeg;
    totalTime += heading.corr;
  }

  const contiquency = totalFuel * 5 / 100;
  const fuel45min = airplane.fuelPerH / 60 * 45;
  const required = totalFuel + 2 * fuel45min + contiquency;
  const loaded = airplane.maxFuel;// TODO: add input field for this instead of usinx airplane max hardcoded
  const extraFuel = loaded - required;

  pdf.moveTo(310, 130);
  pdf.drawText(floatToStr(totalFuel, 2), {
    size: 8,
  });
  pdf.moveTo(337, 130);
  pdf.drawText(floatToStr(totalDist, 2), {
    size: 8,
  });
  pdf.moveTo(365, 130);
  pdf.drawText(timeToStr(totalTime), {
    size: 8,
  });

  pdf.moveTo(115, 103);
  pdf.drawText(floatToStr(totalFuel, 2), {
    size: 8,
  });
  pdf.moveTo(147, 103);
  pdf.drawText(timeToStr(Math.ceil(totalFuel / (airplane.fuelPerH / 60))), {
    size: 8,
  });

  pdf.moveTo(115, 92);
  pdf.drawText(floatToStr(fuel45min, 2), {
    size: 8,
  });
  pdf.moveTo(147, 92);
  pdf.drawText(timeToStr(45), {
    size: 8,
  });

  pdf.moveTo(115, 80);
  pdf.drawText(floatToStr(fuel45min, 2), {
    size: 8,
  });
  pdf.moveTo(147, 80);
  pdf.drawText(timeToStr(45), {
    size: 8,
  });

  pdf.moveTo(115, 68);
  pdf.drawText(floatToStr(contiquency, 2), {
    size: 8,
  });
  pdf.moveTo(147, 68);
  pdf.drawText(timeToStr(Math.ceil(contiquency / (airplane.fuelPerH / 60))), {
    size: 8,
  });

  pdf.moveTo(115, 55);
  pdf.drawText(floatToStr(required, 2), {
    size: 8,
  });
  pdf.moveTo(147, 55);
  pdf.drawText(timeToStr(Math.ceil(required / (airplane.fuelPerH / 60))), {
    size: 8,
  });

  pdf.moveTo(115, 43);
  pdf.drawText(floatToStr(loaded, 2), {
    size: 8,
  });
  pdf.moveTo(147, 43);
  pdf.drawText(timeToStr(Math.ceil(loaded / (airplane.fuelPerH / 60))), {
    size: 8,
  });

  pdf.moveTo(115, 31);
  pdf.drawText(floatToStr(extraFuel, 2), {
    size: 8,
  });
  pdf.moveTo(147, 31);
  pdf.drawText(timeToStr(Math.ceil(extraFuel / (airplane.fuelPerH / 60))), {
    size: 8,
  });
}

export const printNavLog = async (generalInfo: TGeneralStore, headings: THeadingStore[], weather: TWeatherStore, airplane: TAirplane): Promise<Uint8Array> => {
  const url = "/documents/navlog.pdf";
  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

  const pdf = await PDFDocument.load(existingPdfBytes);
  const page = pdf.getPage(0);

  printHeader(page, generalInfo, airplane);
  printHeadings(page, generalInfo, headings);
  printTotals(page, headings, airplane);

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

