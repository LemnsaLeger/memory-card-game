import { useState } from "react";
import { useEffect } from "react";

import HomePage from "./HomePage";
import Card from "./Card";

function GameBoard({ numberOfCards }) {
  const [score, setScore] = useState(0);
  const [highscore, setHighScore] = useState(0);
  const [dataFromServer, setDataFromServer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHome, setHome] = useState(false);

  let data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  let realData = [];

  while (realData.length < numberOfCards) {
    realData[realData.length] = data[realData.length];
  }

  // handle click
  const handleClick = (target) => {
    alert(cards.indexOf(target));
  };

  const cards = Array.from(document.querySelectorAll(".cards .card"));

  console.log(cards);

  useEffect(() => {
    // for dealing with side effects
    function fetchPokemonData() {
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=${numberOfCards}`)
        .then((response) => response.json())
        .then((allPokemons) => {
          console.log(allPokemons);

          // we received a hashed(object[key- value ] pair) data from the server
          // And we have pokemon's name and url
          // so another fetch using the url

          allPokemons.results.forEach((pokemon) => {
            fetchPokemon(pokemon);
          });
        });
    }

    fetchPokemonData();
    setLoading(false);

    // function to fetch pokemon data
    function fetchPokemon(pokemon) {
      let url = pokemon.url;
      fetch(url)
        .then((response) => response.json())
        .then(function (pokemonData) {
          console.log(pokemonData);

          setDataFromServer((prevData) => {
            return {
              ...prevData,
              [pokemonData.species.name]: pokemonData,
            };
          });
        });
    }
  }, []); // empty the dependency array
  console.log(dataFromServer);
  const handleHome = () => {
    setHome(true);
  };

  return (
    <>
      {loading ? (
        <p className="loading text">Getting things ready pal 👌..</p>
      ) : (
        <>
          <section className="scoreboard">
            <p className="score">
              Score: <span>{score}</span>
            </p>
            <p className="highscore">
              Highest Score: <span>{highscore}</span>
            </p>
          </section>

          <section className="cards">
            // map realData to create the required number of cards
            // if dataFromServer is available, desctructure the pokemon data
            // create a card for each pokemon
            {realData.map((d, k) => {
              if (dataFromServer) {
                const pokemonNames = Object.keys(dataFromServer);
                const pokemonName = pokemonNames[k];
                const pokemonData = dataFromServer[pokemonName];
                console.log(pokemonData);
                if (pokemonData) {
                  return (
                    <Card
                      label={pokemonData.species.name}
                      key={k + 1}
                      onClick={() => handleClick(cards[d])}
                    />
                  );
                }
              }
            })}
          </section>

          <button onClick={handleHome}>Home</button>

          <footer>
            developed by <a href="">@devlemnsa</a>
          </footer>
        </>
      )}
    </>
  );
}

export default GameBoard;
