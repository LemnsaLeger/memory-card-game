import { useState } from "react";

import GameBoard from "./GameBoard";

import "../index.css";

function HomePage() {
  const [level, setLevel] = useState("");

  function handleEasy() {
    setLevel("easy");
  }

  function handleMedium() {
    setLevel("medium");
  }

  function handleHard() {
    setLevel("hard");
  }

  if (level === "") {
    return (
      <>
        <h1 className="header">Memory Card Game</h1>
        <p>- play with your memory -</p>
        <h2>Select Your Level</h2>{" "}
        <section className="btns">
          <button onClick={handleEasy}>Easy Peasy</button>{" "}
          <button onClick={handleMedium}>medium</button>{" "}
          <button onClick={handleHard}>Go Harder</button>{" "}
        </section>{" "}
      </>
    );
  } else if (level === "easy") {
    return <GameBoard numberOfCards={12} mode={level} />;
  } else if (level === "medium") {
    return <GameBoard numberOfCards={30} mode={level} />;
  } else {
    return <GameBoard numberOfCards={50} mode={level} />;
  }
}

export default HomePage;
