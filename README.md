# myFitMap-web-app
 
**Table of content**

- [Project description](#project-description)
- [User interface](#user-interface)
- [Technical aspects](#technical-aspects)


## Project description


This web application was created to allow users to record, in a list and on a map, all the workouts they have performed, along with their location. 

To do so, users can click anywhere on the map and add a workout they did there, whether it's a run or a bike ride. They can then indicate the number of kilometers they did and the duration, as well as the pace (for run) or the elevation covered (for bike).

## User interface

The interface is divided into two distinct parts.

On the left sidebar, users can find a form to create workouts after selecting a location on the map. Additionally, the sidebar displays a list of created workouts, along with corresponding buttons for deleting them, and instructions for using the application.

The main portion of the interface comprises an interactive map where users can click on to create new workouts, and view existing ones with pins / markers displayed on it. Users have the flexibility to navigate anywhere on the map and adjust the zoom level according to their preferences.

To ensure workouts persist between sessions, each newly created workout is stored within users' localStorage space. These workouts are then loaded from localStorage each time the web application is opened (if any), and displayed on the UI.
  
## Technical aspects

This web app was developed using HTML, JavaScript, [Leaflet (library for the map)](https://leafletjs.com/), CSS and Bootstrap. Additionally, tools such as Google DevTools, Live-Server extension, and documentation from sources like the Mozilla Developer Network (MDN Web Docs) were also employed during the development process.

The live version of myFitMap web app is [hosted on GitHub gh-pages](https://alexacai.github.io/myFitMap-web-app/). 

*Credits: Idea and initial design (HTML and CSS templates) were made available / created by Jonas Schmedtmann.  
*Developed and design updated later by myself.


