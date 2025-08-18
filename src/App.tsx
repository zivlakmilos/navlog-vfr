import type { Component } from 'solid-js';

// Get wind: https://aviationweather.gov/api/data/metar?ids=LYBE&format=json

const App: Component = () => {
  return (
    <div class="w-full p-10">
      <div class="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" checked="checked" />
        <div class="collapse-title font-semibold">Wind</div>
        <div class="collapse-content text-sm">
          <div class="overflow-x-auto">
            <table class="table">
              <tbody>
                <tr>
                  <th class="w-50">Location:</th>
                  <td>LYBE</td>
                </tr>
                <tr>
                  <th>Win Direction:</th>
                  <td>yyyy-mm-dd</td>
                </tr>
                <tr>
                  <th>Wind Speed:</th>
                  <td>yyyy-mm-dd</td>
                </tr>
                <tr>
                  <th>METER:</th>
                  <td>yyyy-mm-dd</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div class="collapse-title font-semibold">I forgot my password. What should I do?</div>
        <div class="collapse-content text-sm">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</div>
      </div>
      <div class="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" />
        <div class="collapse-title font-semibold">How do I update my profile information?</div>
        <div class="collapse-content text-sm">Go to "My Account" settings and select "Edit Profile" to make changes.</div>
      </div>
    </div>
  );
};

export default App;
