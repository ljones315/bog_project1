const baseURL = "https://pokeapi.co/api/v2/";
//import fetch from 'node-fetch';
var inputField = document.getElementById('inputField');
var infoScreen = document.getElementById('info');
var stats = document.getElementsByClassName('stats')[0];  
var input = 'pikachu';
var current;
var currID;
var image = document.getElementById('sprite');
var infoType = document.getElementById('infoType');

inputField.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        input = inputField.value;
        getInfo(input)
    }
})

document.getElementsByClassName("infoButton")[0].addEventListener("click", () => {
    getInfo(inputField.value)
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

//add event listener for getting info
function getInfo(ref) {
    fetch(`${baseURL}pokemon/${ref}`)
    .then((res) => {
      return res.json()
    })
    .then((pokemon) =>{ 
        if (pokemon == null) {
            errorMessage();
        } else {
            clearScreen();
            getImage(pokemon);
            getStats(pokemon);
            current = pokemon;
            currID = pokemon.id;
        }
    }).catch(() => {
        errorMessage();
    })
}

function errorMessage() {
    clearScreen();
    image.src = "error.png";
    infoType.innerHTML = "INVALID"
}

function clearScreen() {
    infoType.innerHTML = "";
    while (infoScreen.firstChild) {
        infoScreen.removeChild(infoScreen.firstChild);
    }
    if (stats.children.length == 3) {
        stats.removeChild(stats.lastChild);
    }
}

function getStats(pokemon) {
    clearScreen();

    infoType.innerHTML = "INFO";

    let height = document.createElement('li');
    height.appendChild(document.createTextNode("height: " + pokemon.height));
    infoScreen.appendChild(height);

    let weight = document.createElement('li');
    weight.appendChild(document.createTextNode("weight: " + pokemon.weight));
    infoScreen.appendChild(weight);

    let stats = pokemon.stats;

    stats.forEach((stat) => {
        let entry = document.createElement('li');
        entry.appendChild(document.createTextNode(stat.stat.name + ": " + stat.base_stat));
        infoScreen.appendChild(entry);
    })
}

function getImage(pokemon) {
    let imgUrl = pokemon.sprites.front_default;
    image.src=imgUrl;
}

//add event listener for moves button
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
                //modify html
                console.log(stage.species.name)
                stage = stage.evolves_to[0];
            }
            console.log(stage.species.name)
        })
    })
}


function getNext() {
    if (currID != 151) {
        currID++;
    } else {
        currID = 1;
    }
    getInfo(currID);
}

//add listener for arrow
function getPrev() {
    if (currID != 1) {
        currID--;
    } else {
        currID = 151;
    }
    getInfo(currID);
}
