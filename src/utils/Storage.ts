import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

export type TGeneralStore = {
  airplane: string,
  departure: string,
  destination: string,
  date: string,
  time: string,
}

export const generalStore = createSignal<TGeneralStore>({
  airplane: "YU-ZEN",
  departure: "LYNS",
  destination: "LYNS",
  date: (new Date()).toISOString().split('T')[0],
  time: "12:00",
}, { equals: false });

export type TWeatherStore = {
  metar: string,
  taf: string,
  windDirection: number,
  windSpeed: number,
}

export const weatherStore = createSignal<TWeatherStore>({
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
  trueHeading: number,
  magneticHeading: number,
  heading: number,

  airSpeed: number,
  groudSpeed: number,
  fuelLeg: number,
  fuelRem: number,
  distLeg: number,
  distRem: number,

  ete: number,
  corr: number,
  eta: string,
  ata: string,
}

export const headingStore = createStore<THeadingStore[]>([]);
