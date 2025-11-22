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
  downloadFile(buff, "navlog.json", "application/json");
}

export const loadNavLog = () => {
}
