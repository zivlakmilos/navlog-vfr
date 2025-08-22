import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

type TGeneralStore = {
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

type TWeatherStore = {
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

export const routeStore = createStore([]);
