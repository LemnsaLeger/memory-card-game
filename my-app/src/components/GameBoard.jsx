import { useState } from "react";
import { useEffect } from "react";

import HomePage from "./HomePage";
import Card from "./Card";

function GameBoard({ numberOfCards }) {
  const [score, setScore] = useState(0);
  const [highscore, setHighScore] = useState(0);
  const [realData, setRealData] = useState([]);
  const [dataFromServer, setDataFromServer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHome, setHome] = useState(false);
  const [clickedCards, setClickedCards] = useState([]);

  const handleClick = (target) => {
    console.log("handleclick fired");
    const pokemonNames = Object.keys(dataFromServer);
    const pokemonName = pokemonNames[target];
    
    // shuffle the cards when a card is clicked
    setRealData(prevData => shuffleArray(prevData))

    calculateScore();

    setClickedCards((prevClickedCards) => {
      if(!prevClickedCards.includes(pokemonName) && prevClickedCards.length < numberOfCards) {// check if the card has not been clicked before and if the number of clicked cards is less than the number of cards
        return [...prevClickedCards, pokemonName];
      } else{
        alert("Game Over! Your memory glitched 😂! Try Again 😎 You've got this..");
        return prevClickedCards; // return the previous to prevent the alert twice
      }
    }
  );
  };

  // helper function to calculate score and highscore
  const calculateScore = () => {
    setScore((prevScore) => {
      const newScore = prevScore + 1;
      if (newScore > highscore) {
        setHighScore(newScore);
      }
      return newScore;
    });
  }

  // function to shuffle cards in array(Fisher-Yates shuffle algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array]; // copy the array to avoid mutating the original
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // updated fetch logic
  useEffect(() => {
    async function fetchPokemonData() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${numberOfCards}`
        );
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
        // this functions like a for loop which iterates through the number of cards
        // and creates an array of indices based on the number of pokemons fetched
        const indices = Array.from(
          { length: Object.keys(pokenmonMap).length },
          (_, i) => i
        ); // create an array of indices based on the number of pokemons fetched
        // shuffle the indices to randomize the card order
        setRealData(shuffleArray(indices));
        setLoading(false);
        console.log("Data fetched successfully:", pokenmonMap);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchPokemonData();
  }, [numberOfCards]);

  useEffect(() => {
    console.log("Data from server updated:", dataFromServer);
  }, [dataFromServer, realData]);

  // helper function to give the poke's url for the image display
  const pokemonImgUrl = (pokemonId) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  };

  if (loading)
    return <p className="loading text">Getting things ready Pal 👌..</p>;

  if (error) return <p className="error">Error loading: {error.message}</p>;

  if (isHome) return <HomePage />;

  return (
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
        {dataFromServer &&
          realData.length > 0 &&
          Object.keys(dataFromServer).length > 0 &&
          realData.map((i, k) => {
            //se shuffledIndex to get the correct index
            const pokemonNames = Object.keys(dataFromServer);
            const pokemonName = pokemonNames[i];
            const pokemonData = dataFromServer[pokemonName];

            if (pokemonData) {
              return (
                <Card
                  label={pokemonData.species.name}
                  key={k}
                  onClick={() => handleClick(i)}
                  imgUrl={pokemonImgUrl(pokemonData.id)}
                />
              );
            }
            return null;
          })}
      </section>

      <button onClick={() => setHome(true)}>Home</button>
      <footer>
        developed by <a href="">@devlemnsa</a>
      </footer>
    </>
  );
}

export default GameBoard;
