'use strict';



const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


//map, mapEvent does not exist in current scope
//map => define as 'null' => global variable
//mapEvent => access via leaflet map event handler (click) => pass through by copying mapE (leaflet map event) to the global variable (mapEvent) which is then used in then event handler submit
//creating empty map and mapEvent variable => form submit => remove error of undefined variable
// let map, mapEvent; //becomes unnecessary as the app class will create instances with the private fields embedded

/*
////////HOW TO PLAN A WEB PROJECT////////
Steps 1 - 4 ==> Planning Step

1. USER STORIES
- Desciption of the application's functionality from the user's persepctive. Al user stories put together describe the entire application
- High level overview of the whole application

Common Format => As a [type of user], I want [an action] so that [a benefit]
=> 'Who', 'What', 'Why'

-------User Stories: Mapty Example---------
=> Mapty 1: 'As a user, I want to log my running workouts with location, distance, time, pace, and steps/minute, so I can keep a log of all my running'

=> Mapty 2: 'As a user, I want to log my cycling workouts with location, distance, time, speed, and elevation gain, so I can keep a log of all my cycling'

=> Mapty 3: 'As a user, I want to see all my workouts at a glance, so I can easily track my progress over time'

=> Mapty 4: 'As a user, I want to see all my workouts on a map, so I can easily check where I work out the most'

=> Mapty 5: 'As a user, I want to see all my workouts when I leave the app and come back later, so that I can keep using the app over time'


2. FEATURES
- Determine the exact features that are needed to implement in order to make the user stories actually work as intended

-------Features: Mapty Example---------
User stories
=> Mapty 1:
- Map where user clicks to add new workout (best way to get location coordinates)
- Geolocation to display map at current location (more user friendly)
- Form to input distance, time, pace/minute

=> Mapty 2:
- Form to input distance, time, speed, elevation gain

=> Mapty 3:
- Display all workouts in a list

=> Mapty 4:
- Display all workouts on the map

=> Mapty 5:
- Data persistance
- Store workout data in the browser using local storage API


3. FLOW CHART
- WHAT is going to be built
- Visualise the different actions that a user can take and how the program reacts to these actions

4. ARCHITECTURE
- How it is going to be built
- How the code is organised and what JS features will be used
- Giving a project structure to then develop the app's functionality

Mapty
- Main structure to come from classes/objects

Initial Approach
- Decide where and how to store data
- Mapty: Location, distance, time, pace, steps/minute(cadence)
- Mapty: Location, distance, time, speed, elevation gain

-------Workouts------
Parent Class: 
- id
- distance
- duration
- coords
- date
- constructor()

Child Class 1: Running
- name 
- cadence //specific to running
- pace //specific to running
- constructor

Child Class 2: Cycling
- name 
- elevation gain //specific to cycling
- speed //specific to cycling
- constructor

--------Events-------
//Common format of simple JS application => one class to hold all the methods
//Encapsulation
App Class:
- Workouts
- Map
load page - Constructor() => using geolocation to get position
- _getPosition()
receive position - _loadMap(position)
click on map - _showForm()
change input - _toggleElevationField() => cycling or runnning
submit form - _newWorkout() (store all workouts) => new Running() or Cycling()

5. Development Step
- Implementation of our plan using code

*/


/////////USING THE GEOLOCATION API///////////
//Geolocation API => Browser API

/////////DISPLAYING A MAP USING LEAFLET LIBRARY///////////
// L => global variable namespace with a few methods attached which can be accessed from all the other scripts that follows it
// Any global variables written in a JS file and attached to the HTML via the script tag will be accessible across all other followinig scripts (hence global) => i.e. sequential order of scripts

/////////DISPLAYING A MAP MARKER////////
//change location of marker depending on click
//cannot simply add event handler on the map as it does not denote location of click (location of click is tied to the map)

/////////RENDERING WORKOUT INPUT FORM////////

////////MANAGING WORKOUT DATA: CREATING CLASSES///////////

class Workout {

    //public fields => same regardless for any instances
    //note that it is a new modern feature (may not be implemented in some browsers => this.x = x will be available)
    date = new Date()
    //any project should have a kind of unique identifier => convenient for searches
    //best practice to have a library take care of the id creation
    id = (Date.now() + '').slice(-10) //fake id using the last 10 letters of the date

    //playing with public interface - not important to app
    // click = 0;


    constructor(coords, distance, duration) {
        this.coords = coords // [lat, lng]
        this.distance = distance //in km
        this.duration = duration //in min
        // this._setDescription() //should not be placed in parent constructor but instead, child constructor as we need "type"
    }

    //set description => common to both Running and Cycling objects => add to workout class
    _setDescription() {
        // prettier-ignore => prevent from changing to line by line format
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        //Create a Description property
        //_setDescription is being called in the child class and therefore will have access to the 'type' field via the 'this' keyword. This would not work of _setDescription was being called upon a Workout instance (and not Cycling or Running)
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}` //.getMonth() => 0 based position of current Date namespace => can use to retrieve month string from pre-written array
    }

    //playing with public interface - not important to app
    // click() {
    //     this.click++
    // }
}

class Running extends Workout {
    type = 'running'
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration)
        this.cadence = cadence
        this.calcPace();
        this._setDescription() //prototype chain => gain access to scope of parent and therefore will have the _setDescription in its prototype => need to define _setDescription only once in the parent, rather than twice in the child
    }

    //method for calculating pace
    calcPace() {
        //min/km
        //create new pace property
        this.pace = this.duration / this.distance
        return this.pace
    }
}

class Cycling extends Workout {
    type = 'cycling' //defining field => 'type' will be available on all instances of Cycling => can be retrieved in marker display directly rather than passing it through as a parameter every time
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration)
        this.elevationGain = elevationGain
        this.calcSpeed()
        this._setDescription()
    }

    calcSpeed() { //calcSpeed gets added to the __proto__ of Workout 
        //km/hr
        this.speed = this.distance / (this.duration / 60) //min -> hours
        return this.speed;
    }
}

// const run1 = new Running([39, -12], 5.2, 24, 178)
// const cycling1 = new Cycling([39, -12], 27, 95, 5232)
// console.log(run1, cycling1);
// //Running {date: Tue Feb 07 2023 21:49:48 GMT+1100 (Australian Eastern Daylight Time), id: 'ight Time)', coords: Array(2), distance: 5.2, duration: 24, …}
// //Cycling {date: Tue Feb 07 2023 21:50:07 GMT+1100 (Australian Eastern Daylight Time), id: 'ight Time)', coords: Array(2), distance: 27, duration: 95, …}



////////////////////////////////////
//////////APPLICATION ARCHITECTURE

class App {
    #map;
    #mapZoomLevel = 13;
    #mapEvent;
    //constructor method called immediately when a new object is created from this class

    //workout class fields => creation of workout objects
    #workouts = []; //<== initialise empty array for instances

    constructor() {  //no inputs necessary
        //GET USERS POSITION
        this._getPosition()

        //GET LOCAL STORAGE
        this._getLocalStorage()

        //ATTACH EVENT LISTENERS TO CONSTRUCTOR SO THEY ARE IMMEDIATELY CALLED ON LOAD
        //RENDER WORKOUT INPUT FORM => SUBMIT ON ENTER
        //add event listener separately as it has nothing to do with geolocation
        form.addEventListener('submit', this._newWorkout.bind(this)) //callback moved to private method
        //NOTE: 'this' keyword of an event handler will be set to the DOM element onto which it is attached (form element in this case) ===> NEEDS TO POINT TO THE APP OBJECT AND NOT THE FORM 
        // use bind() to tie 'this' to the object itself

        //toggle between running and cycling fields
        inputType.addEventListener('change', this._toggleElevationField)

        //Move marker on click
        //NOTE: In the initial state => workout array is empty => cannot simply attach event listener to target elements as they have not yet been createed => event delegation
        //EVENT DELEGATION => HTML ul element => parent for list
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this))
    }
    _getPosition() {
        if (navigator.geolocation) { //check if geolocation exists first
            //two call back functions => on success and on error
            //getCurrentPosition() => async function
            //must bind 'this' to _loadMap => bind 'this' to the object and not undefined
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), //CB function moved to _loadMap(); able to call using 'this' as it is within the object
                function () {
                    alert('Could not get your position')
                })
        }
    }

    _loadMap(position) {//position parameter
        // console.log(position); //receives geolocation position object
        //coords: GeolocationCoordinates {latitude: -37.9594505, longitude: 145.2699077,...}

        //Use destructuring to obtain coordinates directly out of the object
        const { latitude } = position.coords
        const { longitude } = position.coords
        // console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);

        //array to fit leaflet parameter settings
        const coords = [latitude, longitude]

        //handling clicks on map 
        //map => this.#map => retrieve the variable from outsid method using 'this' keyword
        //note that error will log: cannot set #map on undefined ===> 'this' is undefined
        //_loadMap() is being called by getCurrentPosition() as a callback function AND NOT a method call ==> regualr function call: 'this' keyword set to undefined
        //must bind 'this' to _loadMap => bind 'this' to the object and not undefined ===> THEREFORE changing 'this' from undefined to the 'this' object calling the _loadMap in getCurrentPosition()
        // console.log(this);
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel); //map('id name of an element in our html (where the map will be displayed') => check html: <div id="map"></div>
        //L => main entry point leaflet gives (namespace) which has a few methods it can use
        //([latitude, longitude], zoom)
        //use map variable to ascertain location of any event (i.e. clicks) by adding event listener to map object

        //map is made of small tiles which comes from the following URL
        //openstreetmap => can be replaced with google maps
        //can change map depending on format of url
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this))
        //error: 'this' keyword will be bound to the map itself as it is calling the function ==> FIX using bind()

        //render marker called for async reasons 
        this.#workouts.forEach(work => {
            this._renderWorkoutMarker(work)
        })
    }

    _showForm(mapE) {
        //change variable name from mapEvent to mapE => do not pass the same name of global variable as a parameter
        //copy mapE to the global variable so it can be used (pass through to other functions (i.e. form submit))
        this.#mapEvent = mapE

        //Input form on click 
        form.classList.remove('hidden');
        //add immediate focus on form (i.e. typing cursor immediately shows on input field) => better UE
        inputDistance.focus() //immediately able to start typing
    }

    _hideForm() {
        //empty inputs
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''

        //add hidden class => must disappear and not transition animation
        form.style.display = 'none' //=> display set to 'none' so that immediately disappears (although in reality the transition animation is being performed but just can't be seen by the user)
        form.classList.add('hidden');
        setTimeout(() => (form.style.display = 'grid', 1000)) //bring back display after the transition animation is completed (takes 1s)
    }

    _toggleElevationField() {
        //toggle form__row--hidden class on the div (parents) of the input fields that should change (depending on option) i.e. Cadence <==> Elev Gain
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }

    _newWorkout(e) {
        //helper function for data validation
        //===> Check if Number
        //(...inputs) => arbitrary number of inputs, becomes an array when using rest parameters like so 
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp))
        //every() will loop over array of inputs and person function (check if inp is Number) and return true if all inputs were true

        //===> Check if positive
        const allPositive = (...inputs) => inputs.every(inp => inp > 0)

        //SUBMITTING FORM WILL CREATE NEW WORKOUT => HENCE PLACEMENT OF EVENT LISTENER IN _newWorkout()
        e.preventDefault()


        //get data from the form 

        const type = inputType.value; //each option of the option element has a value => "running" or "cycling"
        const distance = +inputDistance.value //result is string -> convert to number using '+'
        const duration = +inputDuration.value //result is string -> convert to number using '+'


        // console.log(mapEvent); //{originalEvent: PointerEvent, containerPoint: p, layerPoint: p, latlng: v, type: 'click', …} latlng => provides point of click
        const { lat, lng } = this.#mapEvent.latlng;

        //workout variable bound to local if statements => define outside so it can be used
        let workout;



        //if workout running, create running object
        if (type === 'running') {
            const cadence = +inputCadence.value;
            //check if data is valid => number;
            if (
                // !Number.isFinite(distance) || 
                // !Number.isFinite(duration) ||
                // !Number.isFinite(cadence) //cadence and elevation cannot be defined at the same time
                //REFACTOR => validInputs()
                !validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)
            )
                return alert('Inputs have to be positive numbers')

            //create running object 
            //this.#mapEvent.latlng is an object ===> convert to array
            workout = new Running([lat, lng], distance, duration, cadence);

        }


        //if workout cycling, create cycling object
        if (type === 'cycling') {
            const elevation = +inputElevation.value;
            //check if data is valid => number;
            if (
                !validInputs(distance, duration, elevation) || !allPositive(distance, duration)
            )
                return alert('Inputs have to be positive numbers')

            workout = new Cycling([lat, lng], distance, duration, elevation);
        }



        //delegating functionality to other methods

        // add new object to workout array
        //can separate => outside if statement as same method will be performed regardless of type
        this.#workouts.push(workout)
        console.log(workout);

        // render workout on map as a marker
        //note that 'this' is the object that is calling the method, therefore the function is able to use the same 'this' object (no need to call bind)
        this._renderWorkoutMarker(workout) //pass in workout object to display workout information

        //render workout on list
        this._renderWorkout(workout)

        // hide +  clear input field 
        this._hideForm()

        //set local storage to all workouts
        this._setLocalStorage();
    }

    //creation of marker
    _renderWorkoutMarker(workout) {
        //Check documentation => options available
        // L.marker([lat, lng]) //adding the coordinates of click event as the marker; marker() creates marker
        L.marker(workout.coords) //after creating workout object, pass through the coordinates from the specific object
            .addTo(this.#map) //addTo() => adds newly created marker to map
            .bindPopup(L.popup({ //L.popup => adding options
                maxWidth: 250,
                minWidth: 100,
                autoClose: false, //popup closes on new popup by default
                closeOnClick: false, //popup closes on new click by default
                className: `${workout.type}-popup` //toggle html/css between green border and orange border
            })) //binds popup to specific marker
            .setPopupContent(`${workout.type === 'running' ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`)
            .openPopup();
        //leaflet methods are chainable as they all return 'this'
        // render workout on list

    }

    _renderWorkout(workout) {
        //DOM manipulation => HTML that is common to both running and cycling objects
        //note data-id => bridge between UI and application
        let html = `
                <li class="workout workout--${workout.type}" data-id="${workout.id}">
                    <h2 class="workout__title">${workout.description}</h2>
                    <div class="workout__details">
                        <span class="workout__icon">${workout.type === 'running' ? "🏃‍♂️" : "🚴‍♀️"}</span>
                        <span class="workout__value">${workout.distance}</span>
                        <span class="workout__unit">km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${workout.duration}</span>
                        <span class="workout__unit">min</span>
                    </div>
        `;

        if (workout.type === 'running')
            html += `
                    <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.pace.toFixed(1)}</span>
                        <span class="workout__unit">min/km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">🦶🏼</span>
                        <span class="workout__value">${workout.cadence}</span>
                        <span class="workout__unit">spm</span>
                    </div>
                </li>
            `;
        if (workout.type === 'cycling')
            html += `
                    <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.speed.toFixed(1)}</span>
                        <span class="workout__unit">km/h</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⛰</span>
                        <span class="workout__value">${workout.elevationGain}</span>
                        <span class="workout__unit">m</span>
                    </div>
                </li>
        `;

        //cannot simply insert html as a child of the ul element since the first child of the element must be the form element (html insertion to parent can only be firstChild or lastChild => will ruin the sequencing of form )
        //attach html as a sibling to form element
        form.insertAdjacentHTML('afterend', html);
    }

    _moveToPopup(e) { //need to pass through event to match the child element to the target element
        const workoutEl = e.target.closest('.workout') //in object, whether the click occurs on any of the nested child elements of the workout data div, will shift target to the closest parent element containing the class name 'workout' 
        console.log(workoutEl); //able to get the html dataset => 'id' => use id to find the workout

        //clicking outside of the target element (e.g. container) results in null as there is no closest parent with class 'workout'
        if (!workoutEl) return;

        //_moveToPopup is called by addEventListener => 'this' keyword incorrectly bound => use bind method on function
        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id)
        console.log(workout);

        //leaflet method => move to selected marker
        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            //setView options
            animate: true,
            pan: {
                //pan options
                duration: 1,
            }
        })
        //playing with public interface - not important to app
        // workout.click();
    }

    _setLocalStorage() {
        //API provided by the BROWSER=> used for small amount of data (de to blocking)
        //JSON.stringify => convert object to string
        localStorage.setItem('workouts', JSON.stringify(this.#workouts)) //local storage => key value store
        //view in developers console => application tab => local storage
    }

    _getLocalStorage() {
        //JSON.parse(): String => Object
        const data = JSON.parse(localStorage.getItem('workouts')) //all keys have same name so it will retrieve all data
        // console.log(data);

        //check for existence of data 
        if (!data) return;

        //restore workouts array
        this.#workouts = data;

        //re-render
        this.#workouts.forEach(work => {
            this._renderWorkout(work)

            //_getLocalStorage on load => map has not yet been loaded => async (_getPosition and _loadMap must be called before _renderWorkoutMarker)
            // this._renderWorkoutMarker(work) //error: cannot read property 'addLayer' of undefined
            //move _renderWorkoutMarker => _loadMap
        })
    }
    //JSON stringify <=> parse: loses prototype in the process, therefore public interface (click()) is lost on reload

    // reset() {
    //     localStorage.removeItem('workouts'); //remove items with key 'workouts'
    //     location.reload() //reload page
    // }
}


const app = new App();

//trigger _getPosition()
// app._getPosition(); //gets executed immediately as the script loads
//note that this is messy as the _getPosition() is being called outside when it can be called inside right away (upon object creation) ===> change location of method calling to constructor()

/* 

//////////FINAL CONSIDERATIONS//////////

1. Edit a workout 

2. delete a workout 

3. delete all workouts

4. Ability to sort workouts by a certain field (e.g. distance)

5. Re=build Running and Ccling objects from local storage

6. More realistic error and confirmation messages

7. Ability to position the map to show all workouts (zoom) => leaflet library

8. Ability to draw lines and shapes instead of just points

9. Geocode location from coordinates => location data

10. Display weather data for workout time and place

*/
