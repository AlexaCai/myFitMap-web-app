'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


// Important 'if' to ensure there's no error if old browsers dont support goelocation like used below
if (navigator.geolocation) {
    // The function takes two callback functions: 1st one is call on succes when browser get coordinates of users, 2nd one is call when error when trying to get coordinate
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        const { latitude } = position.coords;
        const { longitude } = position.coords;

        // URL structure took directly from Google Maps and then modified with dyamic values (lat & lon) - built the same way as a Google Maps URL
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

        const coords = [latitude, longitude]

        // Code structure below taken directly from Leaflet librairy (and then adapted): https://leafletjs.com/index.html
        const map = L.map('map').setView(coords, 14);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(coords).addTo(map)
            .bindPopup('A pretty CSS popup.<br> Easily customizable.')
            .openPopup();

    }, function () {
        alert('Could not get your position.')
    })
}





// Backtick: `
// Curly braces: {}
// Square brackets: []
// Greater than sign: >
// Less than sign: <

