import { useState } from "react";
import { useEffect } from "react";

import HomePage from "./HomePage";
import Card from "./Card";

import Modal from "./instructions_modal";

function GameBoard({ numberOfCards, mode }) {
  const [score, setScore] = useState(0);
  const [highscore, setHighScore] = useState(0);
  const [realData, setRealData] = useState([]);
  const [dataFromServer, setDataFromServer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHome, setHome] = useState(false);
  const [clickedCards, setClickedCards] = useState([]);
  const [isGameOver, setGameOver] = useState(false);
  // useState to control the modal visibility
  const [showModal, setShowModal] = useState(true)

  const handleClick = (target) => {
    console.log("handleclick fired");
    const pokemonNames = Object.keys(dataFromServer);
    const pokemonName = pokemonNames[target];

    // shuffle the cards when a card is clicked
    setRealData(prevData => shuffleArray(prevData))

    calculateScore();

    setClickedCards((prevClickedCards) => {
      if(!prevClickedCards.includes(pokemonName) && prevClickedCards.length < numberOfCards) {// check if the card has not been clicked before and if the number of clicked cards is less than the number of cards
        const updatedClickedCards = [...prevClickedCards, pokemonName];
        if(updatedClickedCards.length === numberOfCards) {
          alert("Congratulations! You beat the level! 🎉");
          setClickedCards([]);
          setScore(0);
          setRealData(shuffleArray(realData));
          setHighScore(getHighScore(mode));
          return [];
        }
        return updatedClickedCards;
      } else {
        handleGameOver();
        return []; 
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

  // Game Over
  const handleGameOver = () => {
    setGameOver(true);
    alert("Game Over! Your memory glitched 😂! Try Again 😎 You've got this..");
    setClickedCards([]);
    setScore(0);
    setRealData(shuffleArray(realData)); 
    saveHighScore(mode, highscore);

    const response = prompt("Do you want to play again? (yes/no)");
    if (response && response.toLowerCase() === "yes") {
      setGameOver(false);
      setHome(false);
      setClickedCards([]);
      setScore(0);
      setRealData(shuffleArray(realData)); 
      setHighScore(getHighScore(mode));
    } else {
      setHome(true);
      setClickedCards([]);
      setScore(0);
      setRealData(shuffleArray(realData)); 
      setGameOver(false);
    }
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

  // load high score on mount
  useEffect(() => {
    setHighScore(getHighScore(mode));
  }, [mode]);

  // save high score whenever it changes
  useEffect(() => {
    saveHighScore(mode, highscore);
  }, [highscore, mode]);

  // save game mode high scores to l
  const saveHighScore = (mode, value) => {
      localStorage.setItem(`${mode}_highscore`, JSON.stringify(value));
  }

  // get high score from local storage
  const getHighScore = (mode) => {
    const score = localStorage.getItem(mode + "_highscore");
    return score ? parseInt(score, 10) : 0;
  }

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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}/>
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
