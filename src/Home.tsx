import { createEffect, type Component } from 'solid-js';
import { generalStore } from './utils/Storage';

// Get wind: https://aviationweather.gov/api/data/metar?ids=LYBE&format=json

const Home: Component = () => {
  const [generalInfo, setGeneralInfo] = generalStore;

  const updateGeneralInfo = (key: string, val: any) => {
    setGeneralInfo(prev => {
      prev[key] = val;
      return prev;
    });
  }

  createEffect(() => {
    console.log(generalInfo());
  });

  return (
    <div class="w-full p-5">
      <div class="collapse collapse-arrow bg-base-100 border border-base-300 m-5">
        <input type="checkbox" name="card-general-info" checked="checked" />
        <div class="collapse-title font-semibold">General Info</div>
        <div class="collapse-content text-sm">
          <form class="w-full">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Airplane:</legend>
              <select class="select">
                <option disabled selected>Airplane</option>
                <option>YU-ZEN</option>
              </select>
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Departure:</legend>
              <input type="text" class="input" value={generalInfo().departure} onInput={e => updateGeneralInfo("departure", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Destination:</legend>
              <input type="text" class="input" value={generalInfo().departure} onInput={e => updateGeneralInfo("destination", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Date:</legend>
              <input type="date" class="input" value={generalInfo().date} onInput={e => updateGeneralInfo("date", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Time:</legend>
              <input type="time" class="input" value={generalInfo().time} onInput={e => updateGeneralInfo("time", e.target.value)} />
            </fieldset>
          </form>
        </div>
      </div>
      <div class="collapse collapse-arrow bg-base-100 border border-base-300 m-5">
        <input type="checkbox" name="card-general-info" checked="checked" />
        <div class="collapse-title font-semibold">Weather</div>
        <div class="collapse-content text-sm">
          <form class="w-full">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">METAR:</legend>
              <input type="text" class="input w-full" readonly="readonly" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">TAF:</legend>
              <input type="text" class="input w-full" readonly="readonly" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Wind Direction:</legend>
              <input type="text" class="input" placeholder="" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Wind Speed:</legend>
              <input type="text" class="input" placeholder="" />
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
                <tr>
                  <th class="text-right">1</th>
                  <td>LYNS</td>
                  <td>KLIS5</td>
                  <td class="text-right">10</td>
                  <td class="text-right">390</td>
                  <td class="text-right"></td>
                  <td>
                    <button class="btn btn-success m-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="currentColor"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" /><path d="M8 5.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0" /></g></svg></button>
                    <button class="btn btn-error m-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" /><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" /></g></svg></button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button class="btn btn-primary mt-5">New Heading</button>
          </div>
        </div>
      </div>
      <div class="collapse collapse-arrow bg-base-100 border border-base-300 m-5">
        <input type="checkbox" name="card-general-info" checked="checked" />
        <div class="collapse-title font-semibold">Repport</div>
        <div class="collapse-content text-sm">
        </div>
      </div>
    </div >
  );
};

export default Home;
