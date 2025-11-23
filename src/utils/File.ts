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
