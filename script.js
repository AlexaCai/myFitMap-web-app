'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
    #mapEvent;

    // constructor method is called immediately when a new object is created from this class
    constructor() {
        // Call _getPosition function as soon as the app loads on the page and an app object is created
        this._getPosition();

        // bind.(this) point to the app object when calling _newWorkout
        form.addEventListener('submit', this._newWorout.bind(this))

        inputType.addEventListener('change', this._toggleElevationField)
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
        this.#map = L.map('map').setView(coords, 14);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);


        // on() method is coming from Leaflet librairy
        // This allow to click on the map, get the coordinates of this specific location, and show a form by calling _showForm
        this.#map.on('click', this._showForm.bind(this))
    }

    _showForm(mapClick) {
        // 'this' keyword refers to the 'app' object
        this.#mapEvent = mapClick
        form.classList.remove('hidden')
        inputDistance.focus();

    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }

    _newWorout(event) {
        event.preventDefault();

        // Input fields
        inputDistance.value = '';
        inputDuration.value = '';
        inputCadence.value = '';
        inputElevation.value = '';

        const { lat, lng } = this.#mapEvent.latlng;

        L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup'
            }))
            .setPopupContent('Workout')
            .openPopup();
    }
}

// app variable created out of the class as soon as the app loads on the page
const app = new App();









// Backtick: `
// Curly braces: {}
// Square brackets: []
// Greater than sign: >
// Less than sign: <

