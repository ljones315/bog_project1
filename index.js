const baseURL = "https://pokeapi.co/api/v2/"
//import fetch from 'node-fetch';
var inputField = document.getElementById('inputField')
var input = 'pikachu';
var current;
var currID;

inputField.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        input = inputField.value;
        getInfo(input)
    }
})


function getInfo(ref) {
    fetch(`${baseURL}pokemon/${ref}`)
    .then((res) => {
      return res.json()
    })
    .then((pokemon) =>{ 
        if (pokemon == null) {
            //set info to warning message
            console.log("he don't exist")
        } else {
            current = pokemon;
            currID = pokemon.id;
            console.log(pokemon)
            let stats = pokemon.stats;
            stats.forEach((stat) => {
                //modify html
                //console.log(stat)
            }) 
        }
    })
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

//add event listener for moves button
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

