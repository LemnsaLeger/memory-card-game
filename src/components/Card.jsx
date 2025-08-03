import "../index.css";

function Card({imgUrl, label, onClick }) {
    return (
        <div className="card" onClick={(e) => {
            e.stopPropagation();
            onClick();
            }}>
          <img srcSet={imgUrl} alt={label}/>
          <p>{label}</p>
        </div>
    );
}


export default Card;