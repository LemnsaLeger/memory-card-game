import "../index.css";

function Modal({isOpen, onClose}) {
    if (!isOpen) return null;

    return (
      <div className="overlay">
        <section className="content">
          <h2>How To Play</h2>
          <p>
            You'll see a grid of Pokémon cards. Click on each card only once—if
            you click the same card twice, you lose the round! The cards shuffle
            every time you click, so pay attention and remember which ones
            you've already picked. Click all cards without repeating to beat the
            level. Have fun!
          </p>
          <button className="btn" onClick={() => onClose()}>
            close
          </button>
        </section>
      </div>
    );
}

export default Modal;