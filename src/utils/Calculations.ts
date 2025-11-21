import { TAirplane } from "./Data";
import { THeadingStore, TWeatherStore } from "./Storage"

const calculateWindCorrectionAngle = (trueCourse: number, airSpeed: number, windDir: number, windSpeed: number): number => {
  return (180 / Math.PI) * Math.asin((windSpeed / airSpeed) * Math.sin((Math.PI * (windDir - trueCourse)) / 180));
}

const calculateGroundSpeed = (trueCourse: number, airSpeed: number, windDir: number, windSpeed: number, windCorrevctionAngle: number): number => {
  return Math.sqrt(Math.pow(airSpeed, 2) + Math.pow(windSpeed, 2) - 2 * airSpeed * windSpeed * Math.cos((Math.PI * (trueCourse - windDir + windCorrevctionAngle)) / 180));
}

export const calculateHeading = (heading: THeadingStore, weather: TWeatherStore, airplane: TAirplane): THeadingStore => {
  const res: THeadingStore = heading;

  const wca = Math.round(calculateWindCorrectionAngle(res.trueCourse, res.airSpeed, weather.windDirection, weather.windSpeed));
  res.windCorrectionAngle = wca;
  res.trueHeading = Math.round(res.trueCourse + wca);
  res.magneticHeading = Math.round(res.trueHeading + res.variation);
  res.deviation = airplane.deviationCalc(res.magneticHeading);
  res.heading = Math.round(res.magneticHeading + res.deviation);

  res.groudSpeed = Math.round(calculateGroundSpeed(res.trueCourse, res.airSpeed, weather.windDirection, weather.windSpeed, wca));
  res.ete = Math.ceil(res.distLeg / res.airSpeed * 60);
  res.corr = Math.ceil(res.distLeg / res.airSpeed * 60);

  res.fuelLeg = res.corr * (airplane.fuelPerH / 60);

  return res
}

export const calculateAll = (headings: THeadingStore[], weather: TWeatherStore, airplane: TAirplane): THeadingStore[] => {
  let totalDistance = 0;
  let totalFuel = airplane.maxFuel;

  for (let i = 0; i < headings.length; i++) {
    headings[i] = calculateHeading(headings[i], weather, airplane);
  }

  for (let i = 0; i < headings.length; i++) {
    totalDistance -= headings[i].distLeg;
    totalFuel -= headings[i].fuelLeg;

    headings[i].distRem = totalDistance;
    headings[i].fuelRem = totalFuel;
  }

  return headings
}
