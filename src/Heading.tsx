import { A, useNavigate, useParams } from '@solidjs/router';
import { createSignal, type Component } from 'solid-js';
import { generalStore, headingStore, weatherStore, type THeadingStore } from './utils/Storage';
import { calculateAll } from './utils/Calculations';
import { airplanes, airports } from './utils/Data';

const Heading: Component = () => {
  const [generalInfo] = generalStore;
  const [heading, setHeading] = headingStore;
  const [weather] = weatherStore;

  const navigate = useNavigate();

  const params = useParams()
  const isNew = params.id === undefined;
  const [id, setId] = createSignal(+params.id);

  if (isNew) {
    const newId = heading.length;
    const newHeading: THeadingStore = {
      id: newId,
      from: "",
      to: "",
      frequency: "123.500",
      trueCourse: 0,
      windCorrectionAngle: 0,
      trueHeading: 0,
      variation: -5.5,
      magneticHeading: 0,
      deviation: 0,
      heading: 0,
      altitude: 1500,

      airSpeed: 0,
      groudSpeed: 0,
      fuelLeg: 0,
      fuelRem: 0,
      distLeg: 0,
      distRem: 0,

      ete: 0,
      corr: 0,
      eta: 0,
      ata: 0,
    };

    if (newId === 0) {
      newHeading.from = generalInfo().departure;

      const airport = airports.find(a => a.code === generalInfo().departure);
      if (airport) {
        newHeading.frequency = airport.frequency;
        newHeading.altitude = Math.ceil((airport.elevation + 1000) / 500) * 500;
      }
    } else {
      newHeading.from = heading[newId - 1].to;
      newHeading.frequency = heading[newId - 1].frequency;
      newHeading.variation = heading[newId - 1].variation;
      newHeading.altitude = heading[newId - 1].altitude;
      newHeading.airSpeed = heading[newId - 1].airSpeed;
    }

    setHeading([...heading, newHeading]);
    setId(newId);
  }

  const updateHeading = (key: keyof THeadingStore, value: any) => {
    setHeading(h => h.id === id(), key, value);
  }

  const onSaveClicked = () => {
    let airplane = airplanes.find(v => v.registration === generalInfo().airplane);
    if (!airplane) {
      airplane = airplanes[0];
    }
    setHeading(heading => calculateAll(generalInfo(), heading, weather(), airplane));
    navigate("/", { replace: true });
  }

  return (
    <div class="w-full p-5">
      <div class="collapse collapse-arrow bg-base-100 border border-base-300 m-5">
        <input type="checkbox" name="card-general-info" checked="checked" />
        <div class="collapse-title font-semibold">Route Info</div>
        <div class="collapse-content text-sm">
          <form class="w-full">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">From:</legend>
              <input type="text" class="input" value={heading[id()].from} onInput={e => updateHeading("from", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">To:</legend>
              <input type="text" class="input" value={heading[id()].to} onInput={e => updateHeading("to", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Frequency:</legend>
              <input type="text" class="input" value={heading[id()].frequency} onInput={e => updateHeading("frequency", e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">True Course:</legend>
              <input type="text" class="input" value={heading[id()].trueCourse} onInput={e => updateHeading("trueCourse", +e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Deviation:</legend>
              <input type="text" class="input" value={heading[id()].variation} onInput={e => updateHeading("variation", +e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Altitude:</legend>
              <input type="text" class="input" value={heading[id()].altitude} onInput={e => updateHeading("altitude", +e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Air Speed:</legend>
              <input type="text" class="input" value={heading[id()].airSpeed} onInput={e => updateHeading("airSpeed", +e.target.value)} />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Distance:</legend>
              <input type="text" class="input" value={heading[id()].distLeg} onInput={e => updateHeading("distLeg", +e.target.value)} />
            </fieldset>

            <button type="button" class="btn btn-success m-1 mt-5" onClick={onSaveClicked}>Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Heading
