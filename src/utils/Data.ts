export type TAirplane = {
  registration: string,
  model: string,
  fuelPerH: number,
  maxFuel: number,
};

export const Airplanes: TAirplane[] = [
  {
    registration: "YU-ZEN",
    model: "DA-20",
    fuelPerH: 17,
    maxFuel: 74,
  },
];

export type TAirport = {
  code: string,
  frequency: number,
  elevation: number,
};

export const Airports: TAirport[] = [
  {
    code: "LYNS",
    frequency: 123.500,
    elevation: 261,
  },
  {
    code: "LYZR",
    frequency: 130.400,
    elevation: 264,
  },
];
