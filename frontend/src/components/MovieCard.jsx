import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      className="card-hover"
      style={styles.card}
      onClick={() => navigate(`/movie/${movie._id}`)}
    >
      <img
        src={movie.image || "/no-image.jpg"}
        style={styles.image}
        alt={movie.title}
      />

      <h3>{movie.title}</h3>
      <p>{movie.description}</p>
    </div>
  );
}

const styles = {
  card: {
    background: "#1c1c1c",
    color: "white",
    padding: "10px",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s ease",   // 👈 ทำให้ลื่น
    boxShadow: "0 0 10px rgba(0,0,0,0.3)"
  },
  image: {
    width: "100%",
    height: "clamp(180px, 40vw, 250px)", // 👈 responsive
    objectFit: "cover",
    borderRadius: "10px"
  }
};

export default MovieCard;