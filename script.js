'use strict';

// Parent class for the workouts containing shared info for running and cycling
class Workout {
    date = new Date();
    id = Date.now() + ''.slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords; // array [lat, lon]
        this.distance = distance; // in km
        this.duration = duration; // in min
    }

    _setWorkoutDescription() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}, ${this.date.getFullYear()}`;
    }
}

// Child class of parent Workout class, specific to running workout
class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration)
        this.cadence = cadence;
        this.type = 'running';
        this.calcPace();
        this._setWorkoutDescription();
    }

    calcPace() {
        // min / km
        this.pace = this.distance / this.duration;
        return this.pace;
    }
}

// Child class of parent Workout class, specific to cycling workout
class Cycling extends Workout {

    constructor(coords, distance, duration, elevation) {
        super(coords, distance, duration)
        this.elevation = elevation;
        this.type = 'cycling';
        this.calcSpeed();
        this._setWorkoutDescription();
    }

    calcSpeed() {
        // km / h
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}


// const run1 = new Running([39, -12], 5.2, 24, 178)
// const cycling1 = new Cycling([39, -12], 27, 95, 523)
// console.log(run1, cycling1);




//////////////////////////////////
// APP architecture

const removeWorkouts = document.querySelector('.remove-workouts');
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {

    // Properties of the object, as private class field (#). Both are private instance property (property present on all instances created through this class)
    #map;
    #mapZoomLevel = 14;
    #mapEvent;
    #workout = [];

    // constructor method is called immediately when a new object is created from this class
    constructor() {
        // Call _getPosition function as soon as the app loads on the page and an app object is created
        this._getPosition();

        // Get data from localStorage
        this._getlocalStorage();

        // bind.(this) point to the app object when calling _newWorkout
        form.addEventListener('submit', this._newWorkout.bind(this))

        inputType.addEventListener('change', this._toggleElevationField)

        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this))

        removeWorkouts.addEventListener('click', this._reset)
    }

    _getPosition() {
        // Important 'if' to ensure there's no error if old browsers dont support goelocation like used below
        if (navigator.geolocation) {
            // The function takes two callback functions: 1st one is call on succes when browser get coordinates of users, 2nd one is call when error when trying to get coordinate
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('Could not get your position.')
            })
        }
    }

    _loadMap(position) {
        console.log(position);
        const { latitude } = position.coords;
        const { longitude } = position.coords;

        // URL structure took directly from Google Maps and then modified with dyamic values (lat & lon) - built the same way as a Google Maps URL
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

        const coords = [latitude, longitude]

        // Code structure below taken directly from Leaflet librairy (and then adapted): https://leafletjs.com/index.html
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);


        // on() method is coming from Leaflet librairy
        // This allow to click on the map, get the coordinates of this specific location, and show a form by calling _showForm
        this.#map.on('click', this._showForm.bind(this))

        this.#workout.forEach(work => {
            this._renderWorkoutMarker(work);
        });
    }

    _showForm(mapClick) {
        // 'this' keyword refers to the 'app' object
        this.#mapEvent = mapClick
        form.classList.remove('hidden')
        inputDistance.focus();
    }

    _hideForm() {
        inputDistance.value = '';
        inputDuration.value = '';
        inputCadence.value = '';
        inputElevation.value = '';

        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(function () {
            return form.style.display = 'grid'
        }, 1000)
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }

    _newWorkout(event) {
        event.preventDefault();

        // Function used to validate each inputs on workout form are numbers
        const validNumberInput = function (...inputs) {
            // Loop over the ...inputs array and check is each number is finite or not. every( ) method return true only if all element in the array are finite.
            return inputs.every(input => Number.isFinite(input))
        }

        const numberAllPositive = function (...inputs) {
            return inputs.every(input => input > 0)
        }

        // Get data from UI form
        const type = inputType.value;
        const distance = Number(inputDistance.value);
        const duration = Number(inputDuration.value);
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;

        // If running workout, create Running object
        if (type === 'running') {
            const cadence = Number(inputCadence.value);
            if (!validNumberInput(distance, duration, cadence) || !numberAllPositive(distance, duration, cadence)) {
                return alert('Inputs have to be a positive number')
            }

            workout = new Running([lat, lng], distance, duration, cadence);
        }

        // If cycling workout, create Cycling object
        if (type === 'cycling') {
            const elevation = Number(inputElevation.value);
            if (!validNumberInput(distance, duration, elevation) || !numberAllPositive(distance, duration)) {
                return alert('Inputs have to be a positive number')
            }
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }

        // Add new object to Workout array
        this.#workout.push(workout);
        console.log(workout)

        // Render workout on map as marker
        this._renderWorkoutMarker(workout);

        // Render workout on the side part of UI (workouts lit outside the map)
        this._renderWorkout(workout)

        // Hide the form and clear input fields
        this._hideForm();

        // Set localStorage to all workouts
        this._setLocalStorage();

    }

    // Function used to display popup over workouts in map
    _renderWorkoutMarker(workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`
            }))
            .setPopupContent(`${workout.type === 'running' ? '🏃' : '🚴‍♀️'} ${workout.description}`
            )
            .openPopup();
    }

    // Function used to display workouts on the left side of the screen
    _renderWorkout(workout) {
        // Part for running AND cycling objects
        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃' : '🚴‍♀️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
        `;

        if (workout.type === 'running') {
            html = html + ` 
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">km/min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
        `;
        }

        if (workout.type === 'cycling') {
            html = html + ` 
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
        `;
        }

        form.insertAdjacentHTML('afterend', html);

        removeWorkouts.classList.remove('hidden')
    }

    _moveToPopup(event) {
        const workoutElement = event.target.closest('.workout');
        console.log(workoutElement);

        if (!workoutElement) {
            return
        }

        const workout = this.#workout.find(function (work) {
            return work.id === workoutElement.dataset.id
        })
        console.log(workout)

        // setView() is a method available on all 'map' objects, and its taken from Leaflet librairy
        // First argument needed: coordinates
        // Second argument needed: zoom level
        // Third arugment: object of options (if wanted)
        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate: true,
            pan: {
                duration: 1
            }
        });
    }

    _setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workout));
    }

    _getlocalStorage() {
        const data = JSON.parse(localStorage.getItem('workouts'));
        console.log(data)

        if (!data) {
            return
        }

        this.#workout = data;

        this.#workout.forEach(work => {
            this._renderWorkout(work);
        })
    }

    // Remove workouts from local storage
    _reset() {
        localStorage.removeItem('workouts');
        location.reload();
        removeWorkouts.classList.add('.hidden')
    }
}

// app variable created out of the class as soon as the app loads on the page
const app = new App();









// Backtick: `
// Curly braces: {}
// Square brackets: []
// Greater than sign: >
// Less than sign: <

