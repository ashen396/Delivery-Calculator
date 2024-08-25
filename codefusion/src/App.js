import { useEffect, useState } from "react";

function SetComboStates(setStates, setCitites) {
  let url = "http://localhost:3004/states"
  fetch(url).then((data) => {
    data.json().then((val) => {
      setStates(val)
      SetComboCities("QLD", setCitites)
    })
  })
}

function SetComboCities(state, setCitites) {
  let url = "http://localhost:3004/cities"
  fetch(url).then((data) => {
    data.json().then((val) => {
      document.getElementById("state-input").value = state
      setCitites(val)
    })
  })
}

function AddThreshold(button) {
  const thresholdDiv = button.parentElement.cloneNode(true)
  thresholdDiv.addEventListener('click', (ev) => AddThreshold(ev.target))
  thresholdDiv.querySelectorAll('input').forEach(input => input.value = '')
  button.parentElement.parentElement.insertBefore(thresholdDiv, button.parentElement.nextSibling)
}

function AddPickupThreshold(button) {
  const pickupThresholdDiv = button.parentElement.cloneNode(true)
  pickupThresholdDiv.addEventListener('click', (ev) => AddPickupThreshold(ev.target))
  pickupThresholdDiv.querySelectorAll('input').forEach(input => input.value = '')
  button.parentElement.parentElement.insertBefore(pickupThresholdDiv, button.parentElement.nextSibling)
}

function AddCity() {
  const cityContainer = document.getElementById('cityContainer');
  const newCity = cityContainer.querySelector('.city').cloneNode(true);
  newCity.querySelectorAll('input').forEach(input => input.value = '');
  newCity.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
  cityContainer.appendChild(newCity);
}

function SaveData() {
  // let postalCodeType = document.getElementById("postalCodeType").selectedIndex
  // let postalCode = document.getElementById("postalCode").value

  // if (postalCode !== null) {
  //   var postalCodeString = null
  //   if ((postalCodeString = String(postalCode)).length !== 0) {
  //     if (postalCodeType === 1) {
  //       let codes = postalCodeString.split('-')
  //       console.log(codes)
  //     }
  //     if(postalCodeType === 2){
  //       let codes = postalCodeString.split(',')
  //       console.log(codes)
  //     }
  //   }
  // }

  let state_index = document.getElementById("states").selectedIndex
  let selected_state = document.getElementById("states")[state_index]

  let city_index = document.getElementById("cityName").selectedIndex
  let selected_city = document.getElementById("cityName")[city_index]

  var obj = {
    stateId: selected_state.id,
    name: selected_state.innerText,
    cities: [
      {
        cityId: selected_city.id,
        name: selected_city.innerText
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  let url = "http://localhost:3004/save"
  fetch(url, {
    body: JSON.stringify(obj),
    mode: 'cors',
    method: 'POST'
  }).then((data) => {
    data.json().then((val) => {
      console.log(val)
    })
  })
}

function App() {
  const [states, setStates] = useState([])
  const [cities, setCitites] = useState([])

  useEffect(() => {
    SetComboStates(setStates, setCitites)
  }, [])

  return (
    <div className="bg-gray-100 p-10">
      <form onSubmit={() => SaveData()} className="bg-white p-6 rounded shadow-md">
        <h2 className='text-xl font-bold mb-4'>State Information</h2>
        <label htmlFor="stateName" className="block mb-2 font-semibold">State Name:</label>
        <select id="states" name="stateName" required className="border border-gray-300 p-2 w-full mb-4 rounded" onChange={(ev) => SetComboCities(ev.currentTarget.value, setCitites)}>
          {states.map((value, _index, _array) =>
            <option id={value._id} key={value._id} value={value.Key}>{value.Name}</option>
          )}
        </select>

        <h2 className="text-xl font-bold mb-4">City Information</h2>
        <div id='cityContainer'>
          <div className='city border p-4 mb-4 rounded random-bg'>
            <label htmlFor="cityName" className="block mb-2 font-semibold">City Name:</label>
            <select id="cityName" name="cities[0][name]" required className="border border-gray-300 p-2 w-full mb-4 rounded">
              {cities.map((value, index, array) =>
                (value.StateID === document.getElementById("states").value) ? <option id={value._id} key={value._id}>{value.Name}</option> : null
              )}
            </select>

            <h3 className="text-lg font-semibold mb-2">Suburb Information</h3>
            <div className="suburb border p-4 mb-4 rounded random-bg">
              <label htmlFor="suburbName" className="block mb-2 font-semibold">Suburb Name:</label>
              <input type="text" id="suburbName" name="cities[0][suburbs][0][name]" required
                className="border border-gray-300 p-2 w-full mb-4 rounded" />
              <label htmlFor="state" className="block mb-2 font-semibold">State:</label>
              <input type="text" id="state-input" name="cities[0][suburbs][0][state]" defaultValue="QLD" required
                className="border border-gray-300 p-2 w-full mb-4 rounded" />
              <label htmlFor="postalCodeType" className="block mb-2 font-semibold">Postal Code Type:</label>
              <select id="postalCodeType" name="cities[0][suburbs][0][postalCodeType]" required
                className="border border-gray-300 p-2 w-full mb-4 rounded">
                <option value="single">Single</option>
                <option value="range">Range</option>
                <option value="list">List</option>
              </select>
              <div id="postalCodeInput" className="mb-4">
                <label htmlFor="postalCode" className="block mb-2 font-semibold">Postal Code:</label>
                <input type="text" id="postalCode" name="cities[0][suburbs][0][postalCodes]" required
                  className="border border-gray-300 p-2 w-full mb-4 rounded" />
              </div>
              <h4 className="text-lg font-semibold mb-2 delivery-bg p-2 rounded">Delivery Costs</h4>
              <div id="deliveryCosts" className="p-4 mb-4 delivery-bg rounded">
                <div className="threshold mb-4">
                  <label htmlFor="thresholdAmount" className="block mb-2 font-semibold">Order Value Threshold:</label>
                  <input type="number" id="thresholdAmount"
                    name="cities[0][suburbs][0][delivery_costs][fixed][thresholds][0][amount]" required
                    className="border border-gray-300 p-2 w-full mb-2 rounded" />
                  <label htmlFor="costBelowThreshold" className="block mb-2 font-semibold">Cost Below Threshold:</label>
                  <input type="number" step="0.01" id="costBelowThreshold"
                    name="cities[0][suburbs][0][delivery_costs][fixed][thresholds][0][cost]" required
                    className="border border-gray-300 p-2 w-full mb-4 rounded" />
                  <button type="button" onClick={(ev) => AddThreshold(ev.currentTarget)} className="text-blue-500">Add Another Threshold</button>
                </div>
                <label htmlFor="fixedAboveThreshold" className="block mb-2 font-semibold">Fixed Cost (Above Threshold):</label>
                <input type="number" step="0.01" id="fixedAboveThreshold"
                  name="cities[0][suburbs][0][delivery_costs][fixed][above_threshold]" required
                  className="border border-gray-300 p-2 w-full mb-4 rounded" />
              </div>
              <h4 className="text-lg font-semibold mb-2 pickup-bg p-2 rounded">Pickup Options</h4>
              <div id="pickupOptions" className="p-4 mb-4 pickup-bg rounded">
                <div className="threshold mb-4">
                  <label htmlFor="pickupThresholdAmount" className="block mb-2 font-semibold">Order Value Threshold:</label>
                  <input type="number" id="pickupThresholdAmount"
                    name="cities[0][suburbs][0][pickup_options][thresholds][0][amount]" required
                    className="border border-gray-300 p-2 w-full mb-2 rounded" />
                  <label htmlFor="pickupCostBelowThreshold" className="block mb-2 font-semibold">Pickup Cost Below
                    Threshold:</label>
                  <input type="number" step="0.01" id="pickupCostBelowThreshold"
                    name="cities[0][suburbs][0][pickup_options][thresholds][0][cost]" required
                    className="border border-gray-300 p-2 w-full mb-4 rounded" />
                  <button type="button" onClick={(ev) => AddPickupThreshold(ev.currentTarget)} className="text-blue-500">Add Another
                    Threshold</button>
                </div>
                <label htmlFor="pickupAboveThreshold" className="block mb-2 font-semibold">Pickup Cost (Above Threshold):</label>
                <input type="number" step="0.01" id="pickupAboveThreshold"
                  name="cities[0][suburbs][0][pickup_options][above_threshold]" required
                  className="border border-gray-300 p-2 w-full mb-4 rounded" />
              </div>
            </div>
          </div>
        </div>
        <button type="button" onClick={() => AddCity()} className="text-blue-500">Add Another City State</button>
        <br></br>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">Submit</button>
      </form>
    </div>
  );
}
export default App;
