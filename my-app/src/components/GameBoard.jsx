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

  // generate card ids (0 to numberOfCards - 1)
  const realData = [];
  for(let i = 0; i < numberOfCards; i++) {
    realData.push(i);
  }

  const handleClick = (target) => {
    alert(realData.indexOf(target))
  }

  // updated fetch logic
  useEffect(() => {
    async function fetchPokemonData() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${numberOfCards}`);
        const allPokemons = await response.json();

        const fetchedPokemon = [];
        const fetchPromises = allPokemons.results.map(async (pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonResponse.json();

          fetchedPokemon.push(pokemonData);
        });

        await Promise.all(fetchPromises);

        const pokenmonMap = {};
        fetchedPokemon.forEach((pokemon) => {
          pokenmonMap[pokemon.species.name] = pokemon;
        });

        setDataFromServer(pokenmonMap);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchPokemonData();

  }, [numberOfCards]);


  // helper function to give the poke's url for the image display
  const pokemonImgUrl = (pokemonId) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  };


  if (loading) return <p className="loading text">Getting things ready Pal 👌..</p>;

  if (error) return <p className="error">Error loading: {error.message}</p>;

  if (isHome) return <HomePage />;

  return (
    <>
    <section className="scoreboard">
      <p className="score">Score: <span>{score}</span></p>
      <p className="highscore">Highest Score: <span>{highscore}</span></p>
      </section>

      <section className="cards">
        {realData.map((_, k) => {
          const pokemonNames = Object.keys(dataFromServer);
          const pokemonName = pokemonNames[k];
          const pokemonData = dataFromServer[pokemonName];

          return (
            <Card
              label={pokemonData.species.name}
              key={k}
              onclick={() => handleClick(k)}
              imgUrl={pokemonImgUrl(pokemonData.id)}
              />
          );
        })}
      </section>

      <button onClick={() => setHome(true)}>Home</button>
      <footer>developed by <a href="">@devlemnsa</a></footer>
    </>
  );
}

export default GameBoard;