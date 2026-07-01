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

      <h3 style={styles.title}>{movie.title}</h3>
      {/* <p style={styles.desc}>{movie.description}</p> */}
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
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    overflow: "hidden",
    minHeight: "420px"
  },
  image: {
    width: "100%",
    height: "clamp(180px, 40vw, 250px)", // 👈 responsive
    objectFit: "cover",
    borderRadius: "10px"
  },
  title: {
    fontSize: "clamp(14px, 2vw, 22px)",
    fontWeight: 700,
    lineHeight: 1.4,
    margin: "12px 0 8px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word"
  },

  desc: {
    fontSize: "clamp(12px, 1.5vw, 16px)",
    color: "#ccc",
    lineHeight: 1.5,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word"
  }
};

export default MovieCard;