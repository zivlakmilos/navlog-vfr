import { For, type Component } from 'solid-js';
import { generalStore, headingStore, TGeneralStore, weatherStore } from './utils/Storage';
import { A, useNavigate } from '@solidjs/router';
import { airplanes, airports } from './utils/Data';
import { printNavLog } from './utils/Print';
import { calculateAll } from './utils/Calculations';
import { importFromLittleNavMap, loadNavLog, saveNavLog } from './utils/File';

// Get wind: https://aviationweather.gov/api/data/metar?ids=LYBE&format=json

const Home: Component = () => {
  const [generalInfo, setGeneralInfo] = generalStore;
  const [weatherInfo, setWeatherInfo] = weatherStore;
  const [heading, setHeading] = headingStore;

  const navigate = useNavigate();

  const fetchWeather = () => {
    const airport = weatherInfo().airport;

    fetch(`https://navlog.zivlak.rs/weather/metar?ids=${airport}&format=json`)
      .then(res => res.json())
      .then(data => {
        if (!data.length) {
          return;
        }
        setWeatherInfo(prev => {
          prev.metar = data[0].rawOb;
          prev.windDirection = data[0].wdir;
          prev.windSpeed = data[0].wspd;
          return prev;
        });
      })
      .catch(err => console.error(err));

    fetch(`https://navlog.zivlak.rs/weather/taf?ids=${airport}&format=json`)
      .then(res => res.json())
      .then(data => {
        if (!data.length) {
          return;
        }
        setWeatherInfo(prev => {
          prev.taf = data[0].rawTAF;
          return prev;
        });
      })
      .catch(err => console.error(err));
  }

  const updateGeneralInfo = (key: keyof TGeneralStore, val: any) => {
    setGeneralInfo(prev => {
      prev[key] = val;
      return prev;
    });
  }

  const updateWeatherInfo = (key: string, val: any) => {
    setWeatherInfo(prev => {
      prev[key] = val;
      return prev;
    });
  }

  const onAirplaneChanged = (value: string) => {
    const airplane = airplanes.find(a => a.registration === value);
    setGeneralInfo(prev => {
      prev.airplane = value;
      if (airplane) {
        prev.loadedFuel = airplane.maxFuel;
      }
      return prev;
    });
  }

  const updateAlternativeAirport = (idx: number, val: string) => {
    setGeneralInfo(prev => {
      const key = `alternate${idx}`;
      prev[key] = val;
      const airport = airports.find(a => a.code === val);
      if (airport) {
        prev[`alternate${idx}Frequency`] = airport.frequency;
      }
      return prev;
    });
  }

  const onFileLoaded = async (files: FileList) => {
    try {
      if (files.length !== 1) {
        return;
      }

      const file = files[0];
      const data = await loadNavLog(file);
      setGeneralInfo(data.generalInfo);
      setWeatherInfo(data.weatherData);
      setHeading(data.headings);
    } catch (ex) {
      console.error(ex);
    }
  }

  const onLittleNavMapLoaded = async (files: FileList) => {
    try {
      if (files.length !== 1) {
        return;
      }

      const file = files[0];
      const data = await importFromLittleNavMap(file);
      setGeneralInfo(prev => ({
        ...prev,
        departure: data.generalInfo.departure,
        destination: data.generalInfo.destination,
      }));
      setWeatherInfo(data.weatherData);
      setHeading(data.headings);
    } catch (ex) {
      console.error(ex);
    }
  }

  const onSaveClicked = () => {
    saveNavLog(generalInfo(), weatherInfo(), heading);
  }

  const onHeadingEditClicked = (id: number) => {
    navigate(`/heading/${id}`);
  }

  const onHeadingDeleteCicked = (id: number) => {
    setHeading(prev => prev.filter(e => e.id !== id).map((e, idx) => ({ ...e, id: idx })));
  }

  const onPrintClicked = async () => {
    const airplane = airplanes.find(a => a.registration === generalInfo().airplane);
    if (!airplane) {
      alert("Airplane not selected!");
    }

    const headings = calculateAll(generalInfo(), heading, weatherInfo(), airplane);
    const bytes = await printNavLog(generalInfo(), headings, weatherInfo(), airplane);

    const blob = new Blob([bytes] as BlobPart[], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  }

  const loadFileInput = <input type="file" onChange={(e) => onFileLoaded(e.target.files)} hidden={true} accept=".navlog" /> as HTMLInputElement;
  const importFromLittleNavMapFileInput = <input type="file" onChange={(e) => onLittleNavMapLoaded(e.target.files)} hidden={true} accept=".html" /> as HTMLInputElement;

  fetchWeather();

  return (
    <div class="w-full p-5">
      <div class="collapse collapse-arrow bg-base-100 border border-base-300 m-5">
        <input type="checkbox" name="card-general-info" checked="checked" />
        <div class="collapse-title font-semibold">General Info</div>
        <div class="collapse-content text-sm">
          <form class="w-full">
            {loadFileInput}
            {importFromLittleNavMapFileInput}
            <button class="btn btn-primary" type="button" onClick={() => loadFileInput.click()}>Load</button>
            &nbsp;&nbsp;&nbsp;
            <button class="btn btn-primary" type="button" onClick={onSaveClicked}>Save</button>
            &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;
            <button class="btn btn-primary" type="button" onClick={() => importFromLittleNavMapFileInput.click()}>Import from LittleNavMap</button>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Airplane:</legend>
              <select class="select" onChange={e => onAirplaneChanged(e.target.value)}>
                <option disabled selected>Airplane</option>
                <For each={airplanes}>{airplane =>
                  <option value={airplane.registration} selected={airplane.registration === generalInfo().airplane}>{airplane.registration} - {airplane.model}</option>
                }
                </For>
              </select>
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Departure:</legend>
              <input type="text" class="input" value={generalInfo().departure} onInput={e => updateGeneralInfo("departure", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Destination:</legend>
              <input type="text" class="input" value={generalInfo().destination} onInput={e => updateGeneralInfo("destination", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Date:</legend>
              <input type="date" class="input" value={generalInfo().date} onInput={e => updateGeneralInfo("date", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Time:</legend>
              <input type="time" class="input" value={generalInfo().time} onInput={e => updateGeneralInfo("time", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Loaded Fuel:</legend>
              <input type="text" class="input" value={generalInfo().loadedFuel} onInput={e => updateGeneralInfo("loadedFuel", +e.target.value)} />
            </fieldset>
          </form>
        </div>
      </div>
      <div class="collapse collapse-arrow bg-base-100 border border-base-300 m-5">
        <input type="checkbox" name="card-general-info" />
        <div class="collapse-title font-semibold">Weather</div>
        <div class="collapse-content text-sm">
          <form class="w-full">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Airport:</legend>
              <input type="text" class="input" value={weatherInfo().airport} onInput={e => updateWeatherInfo("airport", e.target.value)} />
            </fieldset>
            <button type="button" class="btn btn-primary" onClick={fetchWeather}>Get Weather</button>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">METAR:</legend>
              <input type="text" class="input w-full" value={weatherInfo().metar} onInput={e => updateWeatherInfo("metar", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">TAF:</legend>
              <input type="text" class="input w-full" value={weatherInfo().taf} onInput={e => updateWeatherInfo("taf", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Wind Direction:</legend>
              <input type="number" class="input" value={weatherInfo().windDirection} onInput={e => updateWeatherInfo("windDirection", +e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Wind Speed:</legend>
              <input type="number" class="input" value={weatherInfo().windSpeed} onInput={e => updateWeatherInfo("windSpeed", +e.target.value)} />
            </fieldset>
          </form>
        </div>
      </div >
      <div class="collapse collapse-arrow bg-base-100 border border-base-300 m-5">
        <input type="checkbox" name="card-route" checked="checked" />
        <div class="collapse-title font-semibold">Route</div>
        <div class="collapse-content text-sm">
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th class="w-10"></th>
                  <th>From</th>
                  <th>To</th>
                  <th class="w-10">Distance</th>
                  <th class="w-10">Heading</th>
                  <th class="w-10">ETA</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <For each={heading}>{heading =>
                  <tr>
                    <th class="text-right">{heading.id + 1}</th>
                    <td>{heading.from}</td>
                    <td>{heading.to}</td>
                    <td class="text-right"></td>
                    <td class="text-right"></td>
                    <td class="text-right"></td>
                    <td>
                      <button class="btn btn-success m-1" onClick={() => onHeadingEditClicked(heading.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="currentColor"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" /><path d="M8 5.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0" /></g></svg></button>
                      <button class="btn btn-error m-1" onClick={() => onHeadingDeleteClicked(heading.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" /><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" /></g></svg></button>
                    </td>
                  </tr>
                }
                </For>
              </tbody>
            </table>
            <A class="btn btn-primary mt-5" href="/heading/new">New Heading</A>
          </div>
        </div>
      </div>
      <div class="collapse collapse-arrow bg-base-100 border border-base-300 m-5">
        <input type="checkbox" name="card-general-info" />
        <div class="collapse-title font-semibold">Alternate</div>
        <div class="collapse-content text-sm">
          <form class="w-full">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Alternate 1:</legend>
              <input type="text" class="input" value={generalInfo().alternate1} onInput={e => updateAlternativeAirport(1, e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Alternate 1 Frequency:</legend>
              <input type="text" class="input" value={generalInfo().alternate1Frequency} onInput={e => updateGeneralInfo("alternate1Frequency", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Alternate 2:</legend>
              <input type="text" class="input" value={generalInfo().alternate2} onInput={e => updateAlternativeAirport(2, e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Alternate 2 Frequency:</legend>
              <input type="text" class="input" value={generalInfo().alternate2Frequency} onInput={e => updateGeneralInfo("alternate2Frequency", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Alternate 3:</legend>
              <input type="text" class="input" value={generalInfo().alternate3} onInput={e => updateAlternativeAirport(3, e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Alternate 3 Frequency:</legend>
              <input type="text" class="input" value={generalInfo().alternate3Frequency} onInput={e => updateGeneralInfo("alternate3Frequency", e.target.value)} />
            </fieldset>
          </form>
        </div>
      </div>
      <div class="collapse collapse-arrow bg-base-100 border border-base-300 m-5">
        <input type="checkbox" name="card-general-info" checked="checked" />
        <div class="collapse-title font-semibold">Repport</div>
        <div class="collapse-content text-sm">
          <button class="btn btn-primary" type="button" onClick={onPrintClicked}>Print</button>
        </div>
      </div>
    </div >
  );
};

export default Home;
