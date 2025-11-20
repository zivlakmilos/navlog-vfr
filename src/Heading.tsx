import { A, useNavigate, useParams } from '@solidjs/router';
import { createSignal, type Component } from 'solid-js';
import { generalStore, headingStore, weatherStore, type THeadingStore } from './utils/Storage';
import { calculateAll } from './utils/Calculations';
import { airplanes } from './utils/Data';

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
    setHeading([...heading, {
      id: newId,
      from: newId === 0 ? generalInfo().departure : heading[newId - 1].to,
      to: "",
      frequency: newId === 0 ? "123.500" : heading[newId - 1].frequency,
      trueCourse: 0,
      windCorrectionAngle: 0,
      trueHeading: 0,
      variation: 0,
      magneticHeading: 0,
      deviation: 0,
      heading: 0,

      airSpeed: 0,
      groudSpeed: 0,
      fuelLeg: 0,
      fuelRem: 0,
      distLeg: 0,
      distRem: 0,

      ete: 0,
      corr: 0,
      eta: "",
      ata: "",
    }]);
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
    setHeading(heading => calculateAll(heading, weather(), airplane));
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
