import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  if (!movie) return null;

  return (
    <div
      className="movie-card"
      onClick={() => navigate(`/movie/${movie.slug}`)}
    >
      {/* POSTER */}
      <div className="movie-card-image">
        <img
          src={movie.image || "/no-image.jpg"}
          alt={movie.title || "movie"}
          loading="lazy"
          decoding="async"
        />

        {/* RATING */}
        {movie.rating !== undefined &&
          movie.rating !== null &&
          movie.rating !== "" && (
            <div className="movie-card-rating">
              ⭐ {movie.rating}
            </div>
          )}
      </div>

      {/* INFO */}
      <h3>{movie.title || "Untitled"}</h3>

      <p>{movie.description || "-"}</p>
    </div>
  );
}

export default MovieCard;