import { calculateAll } from "./Calculations";
import { TAirplane } from "./Data";
import { TGeneralStore, THeadingStore, TWeatherStore } from "./Storage";

const downloadFile = (data: Uint8Array, filename: string, type: string) => {
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

export const saveNavLog = (generalInfo: TGeneralStore, weatherData: TWeatherStore, headings: THeadingStore[]) => {
  const obj = {
    generalInfo: generalInfo,
    weatherData: weatherData,
    headings: headings,
  };
  const json = JSON.stringify(obj);

  const encoder = new TextEncoder();
  const buff = encoder.encode(json);
  downloadFile(buff, "route.navlog", "application/json");
}

export const loadNavLog = (file: File) => {
  type TRes = {
    generalInfo: TGeneralStore,
    weatherData: TWeatherStore,
    headings: THeadingStore[],
  };

  return new Promise<TRes>((res, rej) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const json = JSON.parse(e.target.result as string);
        res(json);
      } catch (error) {
        rej((`Error parsing JSON: ${error}`));
      }
    };

    reader.onerror = function (e) {
      rej((`Error reading file: ${e.target.error}`));
    };

    reader.readAsText(file);
  });
}

export const importFromLittleNavMap = (file: File, generalInfo: TGeneralStore, weatherData: TWeatherStore, airplane: TAirplane, airSpeed: number) => {
  type TRes = {
    generalInfo: TGeneralStore,
    weatherData: TWeatherStore,
    headings: THeadingStore[],
  };

  return new Promise<TRes>((res, rej) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const data: TRes = {
          generalInfo: { ...generalInfo },
          weatherData: { ...weatherData },
          headings: [],
        }
        const html = e.target.result as string;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const rows = doc.querySelectorAll('tr');

        data.generalInfo.departure = doc.querySelectorAll('tr')[1].querySelectorAll("td")[1].innerText;
        data.generalInfo.destination = doc.querySelectorAll('tr')[rows.length - 1].querySelectorAll("td")[1].innerText;

        for (let i = 2; i < rows.length; i++) {
          const cols = rows[i].querySelectorAll("td");
          const from = rows[i - 1].querySelectorAll("td")[1].innerText;
          const to = cols[1].innerText;
          const trueCourse = cols[11].innerText;
          const distance = cols[12].innerText;
          let altitude = cols[20].innerText;
          const variation = cols[24].innerText;

          if (i === rows.length - 1) {
            altitude = doc.querySelectorAll("tr")[i - 1].querySelectorAll("td")[20].innerText;
          }

          const heading: THeadingStore = {
            id: i - 2,
            from: from,
            to: to,
            frequency: "",
            trueCourse: parseInt(trueCourse),
            windCorrectionAngle: 0,
            trueHeading: 0,
            variation: parseFloat(variation),
            magneticHeading: 0,
            deviation: 0,
            heading: 0,
            altitude: parseFloat(altitude.replaceAll(",", "")),
            airSpeed: airSpeed,
            groudSpeed: 0,
            fuelLeg: 0,
            fuelRem: 0,
            distLeg: parseFloat(distance),
            distRem: 0,
            ete: 0,
            corr: 0,
            eta: 0,
            ata: 0
          }
          data.headings.push(heading);
        }

        data.headings = calculateAll(data.generalInfo, data.headings, data.weatherData, airplane);
        res(data);
      } catch (error) {
        rej((`Error parsing JSON: ${error}`));
      }
    };

    reader.onerror = function (e) {
      rej((`Error reading file: ${e.target.error}`));
    };

    reader.readAsText(file);
  });
}
