import { A, useParams } from '@solidjs/router';
import { createSignal, type Component } from 'solid-js';
import { generalStore, headingStore, type THeadingStore } from './utils/Storage';

const Heading: Component = () => {
  const [generalInfo] = generalStore;
  const [heading, setHeading] = headingStore;

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
      trueHeading: 0,
      magneticHeading: 0,
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

  console.log(params.id, id(), isNew, heading.length);

  const updateHeading = (key: keyof THeadingStore, value: any) => {
    setHeading(h => h.id === id(), key, value);
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

            <A class="btn btn-success m-1 mt-5" href="/">Save</A>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Heading;
