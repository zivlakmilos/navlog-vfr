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

export const routeStore = createStore([]);
