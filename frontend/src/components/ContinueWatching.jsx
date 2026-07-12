import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContinueWatching } from "../utils/continueWatching";

function ContinueWatching() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setMovies(getContinueWatching());
  }, []);

  if (movies.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>▶ ดูต่อ</h2>

      <div style={styles.grid}>
        {movies.map((movie) => {
          const percent =
            movie.duration > 0
              ? Math.min(
                  100,
                  (movie.time / movie.duration) * 100
                )
              : 0;

          return (
            <div
              key={movie.slug}
              style={styles.card}
              onClick={() =>
                navigate(`/movie/${movie.slug}`)
              }
            >
              <img
                src={movie.image}
                alt={movie.title}
                style={styles.image}
              />

              <div style={styles.info}>
                <div style={styles.movieTitle}>
                  {movie.title}
                </div>

                <div style={styles.progressBg}>
                  <div
                    style={{
                      ...styles.progress,
                      width: `${percent}%`,
                    }}
                  />
                </div>

                <div style={styles.time}>
                  {Math.floor(movie.time)} วินาที
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: 40,
    marginBottom: 40,
  },

  title: {
    color: "#fff",
    marginBottom: 20,
    fontSize: 26,
    borderLeft: "5px solid #ffd000",
    paddingLeft: 10,
  },

  grid: {
    display: "flex",
    gap: 20,
    overflowX: "auto",
  },

  card: {
    width: 220,
    cursor: "pointer",
    flexShrink: 0,
  },

  image: {
    width: "100%",
    borderRadius: 10,
  },

  info: {
    marginTop: 10,
  },

  movieTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },

  progressBg: {
    width: "100%",
    height: 6,
    background: "#333",
    borderRadius: 10,
  },

  progress: {
    height: "100%",
    background: "#ffd000",
    borderRadius: 10,
  },

  time: {
    color: "#999",
    marginTop: 6,
    fontSize: 13,
  },
};

export default ContinueWatching;