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
      const table = {
        0: -2,
        30: -1,
        60: -1,
        90: 0,
        120: -1,
        150: 1,
        180: -1,
        210: -1,
        240: -1,
        270: -1,
        300: -2,
        330: -1,
        360: -2,
      };

      let res = 0;
      let minDiff = 9999;
      for (const key in table) {
        const forHeading = +key;
        const diff = Math.abs(forHeading - heading);
        if (diff < minDiff) {
          res = table[key];
          minDiff = diff;
        }
      }

      return res;
    }
  },
];

export type TAirport = {
  code: string,
  frequency: string,
  elevation: number,
};

export const airports: TAirport[] = [
  {
    code: "LYNS",
    frequency: "123.500",
    elevation: 261,
  },
  {
    code: "LYZR",
    frequency: "130.400",
    elevation: 264,
  },
  {
    code: "LYSU",
    frequency: "123.500",
    elevation: 355,
  },
  {
    code: "LYBJ",
    frequency: "119.825",
    elevation: 233,
  },
];
