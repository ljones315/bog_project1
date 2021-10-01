const baseURL = "https://pokeapi.co/api/v2/"
import fetch from 'node-fetch';


async function getPokemon(name) {
    try {
        const response = await fetch(`${baseURL}pokemon/${name}`)
        const data = await response.json()
    } catch (e) {
        console.log("That pokemon doesn't exist")
    }
}

getPokemon('pikachu');