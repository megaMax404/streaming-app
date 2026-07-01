console.log("NEW MOVIECARD LOADED");
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  if (!movie) return null;

  return (
    <div
      className="movie-card"
      onClick={() => navigate(`/movie/${movie._id}`)}
    >
      <img
        src={movie.image || "/no-image.jpg"}
        alt={movie.title || "movie"}
      />

      <h3>{movie.title || "Untitled"}</h3>

      <p>{movie.description || "-"}</p>
    </div>
  );
}

export default MovieCard;