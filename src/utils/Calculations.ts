import { TAirplane } from "./Data";
import { TGeneralStore, THeadingStore, TWeatherStore } from "./Storage"

const calculateWindCorrectionAngle = (trueCourse: number, airSpeed: number, windDir: number, windSpeed: number): number => {
  return (180 / Math.PI) * Math.asin((windSpeed / airSpeed) * Math.sin((Math.PI * (windDir - trueCourse)) / 180));
}

const calculateGroundSpeed = (trueCourse: number, airSpeed: number, windDir: number, windSpeed: number, windCorrevctionAngle: number): number => {
  return Math.sqrt(Math.pow(airSpeed, 2) + Math.pow(windSpeed, 2) - 2 * airSpeed * windSpeed * Math.cos((Math.PI * (trueCourse - windDir + windCorrevctionAngle)) / 180));
}

const timeStrToInt = (str: string): number => {
  let res = 0;

  const timeSplit = str.split(":");
  if (timeSplit.length >= 1) {
    res += +timeSplit[timeSplit.length - 1];
    if (timeSplit.length >= 2) {
      res += +timeSplit[timeSplit.length - 2] * 60;
    }
  }

  return res;
}

const roundHeading = (heading: number): number => {
  heading = Math.round(heading);

  if (heading < 0) {
    heading = 360 - heading;
  }

  heading = heading % 360;

  if (heading === 0) {
    heading = 360;
  }

  return heading;
}

export const calculateHeading = (heading: THeadingStore, weather: TWeatherStore, airplane: TAirplane): THeadingStore => {
  const res: THeadingStore = heading;

  const wca = Math.round(calculateWindCorrectionAngle(res.trueCourse, res.airSpeed, weather.windDirection, weather.windSpeed));
  res.windCorrectionAngle = wca;
  res.trueHeading = roundHeading(res.trueCourse + wca);
  res.magneticHeading = roundHeading(res.trueHeading + res.variation);
  res.deviation = airplane.deviationCalc(res.magneticHeading);
  res.heading = roundHeading(res.magneticHeading + res.deviation);

  res.groudSpeed = Math.round(calculateGroundSpeed(res.trueCourse, res.airSpeed, weather.windDirection, weather.windSpeed, wca));
  res.ete = Math.ceil(res.distLeg / res.airSpeed * 60);
  res.corr = Math.ceil(res.distLeg / res.airSpeed * 60);

  res.fuelLeg = res.corr * (airplane.fuelPerH / 60);

  return res
}

export const calculateAll = (generalInfo: TGeneralStore, headings: THeadingStore[], weather: TWeatherStore, airplane: TAirplane): THeadingStore[] => {
  let totalDistance = 0;
  let totalFuel = generalInfo.loadedFuel;

  let currTime = timeStrToInt(generalInfo.time);

  for (let i = 0; i < headings.length; i++) {
    headings[i] = calculateHeading(headings[i], weather, airplane);
    totalDistance += headings[i].distLeg;

    currTime += headings[i].ete;
    headings[i].eta = currTime;
  }

  for (let i = 0; i < headings.length; i++) {
    totalDistance -= headings[i].distLeg;
    totalFuel -= headings[i].fuelLeg;

    headings[i].distRem = Math.abs(totalDistance);
    headings[i].fuelRem = totalFuel;
  }

  return headings
}
