import { useParams } from '@solidjs/router';
import type { Component } from 'solid-js';

const Heading: Component = () => {
  const params = useParams()
  const isNew = !!params.id;
  const id = params.id;

  return (
    <div class="w-full p-5">
      <div class="collapse collapse-arrow bg-base-100 border border-base-300 m-5">
        <input type="checkbox" name="card-general-info" checked="checked" />
        <div class="collapse-title font-semibold">Route Info</div>
        <div class="collapse-content text-sm">
          <form class="w-full">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">From:</legend>
              <input type="text" class="input" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">To:</legend>
              <input type="text" class="input" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Frequency:</legend>
              <input type="text" class="input" placeholder="Frequency" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">True Course:</legend>
              <input type="text" class="input" placeholder="True Course" />
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Air Speed:</legend>
              <input type="text" class="input" placeholder="Air Speed" />
            </fieldset>

            <button class="btn btn-success m-1 mt-5">Save</button>
            <button class="btn btn-error m-1 mt-5">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Heading;
