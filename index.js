const baseURL = "https://pokeapi.co/api/v2/";
//import fetch from 'node-fetch';
var inputField = document.getElementById('inputField');
var infoScreen = document.getElementById('info');
var stats = document.getElementsByClassName('stats')[0];  
var input;
var current;
var currID = 0;
var image = document.getElementById('sprite');
var infoType = document.getElementById('infoType');
var type1 = document.getElementById('t1');
var type2 = document.getElementById('t2');

inputField.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        input = inputField.value.toLowerCase();
        getPokemon(input)
    }
})

document.getElementsByClassName("infoButton")[0].addEventListener("click", () => {
    getInfo()
    });

document.getElementsByClassName("movesButton")[0].addEventListener("click", () => {
    getMoves()
    });

document.getElementsByClassName("locationButton")[0].addEventListener("click", () => {
    getLocation()
    });

document.getElementsByClassName("evolutionButton")[0].addEventListener("click", () => {
    getEvolution()
    });

document.getElementById("next").addEventListener("click", () => {
    getNext();
})

document.getElementById("prev").addEventListener("click", () => {
    getPrev();
})

//Makes call to API that returns a pokemon object
//If successful, calls getImage() and getStats() 
//also sets current/currID to the current pokemon object and its id #
//If any error occurs, errorMessage() is called
function getPokemon(ref) {
    fetch(`${baseURL}pokemon/${ref}`)
    .then((res) => {
      return res.json()
    })
    .then((pokemon) =>{ 
        if (pokemon == null) {
            errorMessage();
        } else {
            clearScreen();
            current = pokemon;
            currID = pokemon.id;
            getInfo();
        }
    }).catch(() => {
        errorMessage();
    })
}

//Displays error image on image screen
//Displays "INVALID" on info screen
function errorMessage() {
    clearScreen();
    image.src = "error.png";
    infoType.innerHTML = "DOES NOT EXIST";
    inputField.style = "border: 2px solid red";
}

//Wipes the info screen before adding new info
function clearScreen() {
    infoType.innerHTML = "";
    inputField.style = "border: 2px solid green";
    while (infoScreen.firstChild) {
        infoScreen.removeChild(infoScreen.firstChild);
    }
    if (stats.children.length == 3) {
        stats.removeChild(stats.lastChild);
    }
}

//basically a handler method
function getInfo() {
    getStats();
    getImage();
    getTypes();
    inputField.value = current.name.toUpperCase();
}

//Displays a pokemon's info (weight, height, stats) on the info screen
//on button click or by default (enter on search bar)
function getStats() {
    clearScreen();

    infoType.innerHTML = "INFO";

    let height = document.createElement('li');
    height.appendChild(document.createTextNode("height: " + current.height));
    infoScreen.appendChild(height);

    let weight = document.createElement('li');
    weight.appendChild(document.createTextNode("weight: " + current.weight));
    infoScreen.appendChild(weight);

    let stats = current.stats;

    stats.forEach((stat) => {
        let entry = document.createElement('li');
        entry.appendChild(document.createTextNode(stat.stat.name + ": " + stat.base_stat));
        infoScreen.appendChild(entry);
    })
}

//Displays an image of the pokemon on the image screen
function getImage() {
    let imgUrl = current.sprites.front_default;
    image.src=imgUrl;
}

//Displays types on the type bar
function getTypes() {
    let types = current.types;
    if (types[0]) {
        type1.innerHTML = types[0].type.name;
        type1.style = "background-color: #" + typeColors[types[0].type.name];
    }
    if (types[1]) {
        type2.innerHTML = types[1].type.name;
        type2.style = "background-color: #" + typeColors[types[1].type.name];
    }
}

//Displays pokemon's moves on info screen (on button click)
function getMoves() {
    clearScreen();
    infoType.innerHTML = "MOVES";

    let moves = current.moves
    moves.forEach(move => {
        let entry = document.createElement('li');
        entry.appendChild(document.createTextNode(move.move.name));
        infoScreen.appendChild(entry);
    })
}

//add event listener for moves button
function getLocation() {
    clearScreen();
    infoType.innerHTML = "LOCATIONS";

    let locationUrl = current.location_area_encounters;

    fetch(locationUrl)
    .then((res) => {
        return res.json()
      })
    .then((locations) => {
        if (locations.length == 0) {
            let entry = document.createElement('h5');
            entry.appendChild(document.createTextNode("Cannot be caught in the wild"));
            entry.style = "text-align: center"
            stats.appendChild(entry);
        } else {
            locations.forEach(location => {
                let entry = document.createElement('li');
                entry.appendChild(document.createTextNode(location.location_area.name));
                infoScreen.appendChild(entry);
            })
        }
    })
}

//add event listener for evolution button
function getEvolution() {
    clearScreen();
    infoType.innerHTML = "EVOLUTION";

    let speciesUrl = current.species.url;
    fetch(speciesUrl)
    .then((res) => {
        return res.json()
      })
    .then((species) => {
        let evChainUrl = species.evolution_chain.url;
        fetch(evChainUrl)
        .then((res) => {
            return res.json()
        })
        .then((chain) => {
            var stage = chain.chain;
            while(stage.evolves_to.length != 0) {
                let entry = document.createElement('li');
                entry.appendChild(document.createTextNode(stage.species.name));
                infoScreen.appendChild(entry);
                stage = stage.evolves_to[0];
            }
            let entry = document.createElement('li');
            entry.appendChild(document.createTextNode(stage.species.name));
            infoScreen.appendChild(entry);
        })
    })
}


function getNext() {
    if (currID != 151) {
        currID++;
    } else {
        currID = 1;
    }
    getPokemon(currID);
}

//add listener for arrow
function getPrev() {
    if (currID != 1) {
        currID--;
    } else {
        currID = 151;
    }
    getPokemon(currID);
}


var typeColors = {
    normal : "A8A77A",
fire :  "EE8130",
water :  "6390F0",
electric :  "F7D02C",
grass :  "7AC74C",
ice :  "96D9D6",
fighting :  "C22E28",
poison :  "A33EA1",
ground :  "E2BF65",
flying :  "A98FF3",
psychic :  "F95587",
bug :  "A6B91A",
rock :  "B6A136",
ghost :  "735797",
dragon :  "6F35FC",
dark :  "705746",
steel :  "B7B7CE",
fairy :  "D685AD",
}