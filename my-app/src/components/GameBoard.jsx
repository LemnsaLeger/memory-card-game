import { useState } from "react";
import { useEffect } from "react";

import HomePage from "./HomePage";
import Card from "./Card";
import f from "../../server/images/20240131_194318.jpg";


function GameBoard({ numberOfCards }) {
  const [score, setScore] = useState(0);
  const [highscore, setHighScore] = useState(0);
  const [dataFromServer, setDataFromServer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHome, setHome] = useState(false);

  const SERVER = "server/data.json"; // mock

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
    function fetchPokemonData(){
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=11`)
      .then((response) => response.json())
      .then((allPokemons) => console.log(allPokemons))
    }

    fetchPokemonData();
    setLoading(false)
  }, []); // empty the dependency array


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
            {realData.map((d, k) => (
              <Card label={d} key={k} onClick={() => handleClick(cards[d])}/>
            ))}
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
