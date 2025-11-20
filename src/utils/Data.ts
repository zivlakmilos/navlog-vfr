export type TAirplane = {
  registration: string,
  model: string,
  fuelPerH: number,
  maxFuel: number,
  deviationCalc: (heading: number) => number,
};

export const airplanes: TAirplane[] = [
  {
    registration: "YU-ZEN",
    model: "DA-20",
    fuelPerH: 17,
    maxFuel: 74,
    deviationCalc: function (heading: number): number {
      return 0; // TODO: implement deviation calc
    }
  },
];

export type TAirport = {
  code: string,
  frequency: number,
  elevation: number,
};

export const airports: TAirport[] = [
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
