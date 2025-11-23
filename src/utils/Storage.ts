import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

export type TGeneralStore = {
  airplane: string,
  departure: string,
  destination: string,
  date: string,
  time: string,
  loadedFuel: number,
  alternate1: string,
  alternate1Frequency: string,
  alternate2: string,
  alternate2Frequency: string,
  alternate3: string,
  alternate3Frequency: string,
}

export const generalStore = createSignal<TGeneralStore>({
  airplane: "YU-ZEN",
  departure: "LYNS",
  destination: "LYNS",
  date: (new Date()).toISOString().split('T')[0],
  time: "12:00",
  loadedFuel: 74,
  alternate1: "",
  alternate1Frequency: "",
  alternate2: "",
  alternate2Frequency: "",
  alternate3: "",
  alternate3Frequency: "",
}, { equals: false });

export type TWeatherStore = {
  airport: string,
  metar: string,
  taf: string,
  windDirection: number,
  windSpeed: number,
}

export const weatherStore = createSignal<TWeatherStore>({
  airport: "LYBT",
  metar: "",
  taf: "",
  windDirection: 0,
  windSpeed: 0,
}, { equals: false });

export type THeadingStore = {
  id: number,
  from: string,
  to: string,
  frequency: string,
  trueCourse: number,
  windCorrectionAngle: number,
  trueHeading: number,
  variation: number,
  magneticHeading: number,
  deviation: number,
  heading: number,
  altitude: number,

  airSpeed: number,
  groudSpeed: number,
  fuelLeg: number,
  fuelRem: number,
  distLeg: number,
  distRem: number,

  ete: number,
  corr: number,
  eta: number,
  ata: number,
}

export const headingStore = createStore<THeadingStore[]>([]);
