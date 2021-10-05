const baseURL = "https://pokeapi.co/api/v2/";
//import fetch from 'node-fetch';
var inputField = document.getElementById('inputField');
var infoScreen = document.getElementById('info');  
var input = 'pikachu';
var current;
var currID;
var image = document.getElementById('sprite');

inputField.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        input = inputField.value;
        getInfo(input)
    }
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
    let error = document.createElement('h2');
    error.appendChild(document.createTextNode("Invalid!"));
    infoScreen.appendChild(error);
}

function clearScreen() {
    while (infoScreen.firstChild) {
        infoScreen.removeChild(infoScreen.firstChild);
    }
}

function getStats(pokemon) {
    clearScreen();
    
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
    let moves = current.moves
    moves.forEach(move => {
        //modify html
        console.log(move.move)
    })
}

//add event listener for moves button
function getLocation() {
    let locationUrl = current.location_area_encounters;

    fetch(locationUrl)
    .then((res) => {
        return res.json()
      })
    .then((locations) => {
        locations.forEach(location => {
            //modify html
            console.log(location.location_area.name);
        })
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

//add listener for arrow
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
