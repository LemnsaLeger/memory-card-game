function Card({imgUrl, label, onClick }) {
    return (
        <div className="card" onClick={onClick}>
          <img srcSet={imgUrl} alt={label}/>
          <p>{label}</p>
        </div>
    );
}


export default Card;