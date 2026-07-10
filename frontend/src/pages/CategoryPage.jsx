import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../config";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { slugToCategory } from "../data/categoryMap";

const MOVIES_PER_PAGE = 36;

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const categoryName = slugToCategory(category);

  /* ===========================
      LOAD MOVIES
  =========================== */

  useEffect(() => {
    axios
      .get(`${API_URL}/api/movies`)
      .then((res) => {
        setMovies(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ===========================
      RESET PAGE WHEN CATEGORY CHANGES
  =========================== */

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  /* ===========================
      FILTER
  =========================== */

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.category?.includes(categoryName)
    );
  }, [movies, categoryName]);

  /* ===========================
      PAGINATION
  =========================== */

  const totalPages = Math.ceil(
    filteredMovies.length / MOVIES_PER_PAGE
  );

  const currentMovies = useMemo(() => {
    const start =
      (currentPage - 1) * MOVIES_PER_PAGE;

    return filteredMovies.slice(
      start,
      start + MOVIES_PER_PAGE
    );
  }, [filteredMovies, currentPage]);

  /* ===========================
      LOADING
  =========================== */

  if (loading) {
    return (
      <div style={styles.loading}>
        กำลังโหลด...
      </div>
    );
  }

  /* ===========================
      PAGE
  =========================== */

  return (
    <div style={styles.wrapper}>

      <div style={styles.topBar}>
        <button
          style={styles.backBtn}
          onClick={() => navigate("/")}
        >
          ← หน้าแรก
        </button>

        <h2 style={styles.title}>
          {categoryName}
        </h2>
      </div>

      {filteredMovies.length > 0 ? (
        <>
          <div className="movie-grid">
            {currentMovies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div style={styles.empty}>
          ยังไม่มีหนังในหมวดนี้
        </div>
      )}

    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
  },

  title: {
    color: "#fff",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "12px",
    fontSize: "32px",
  },

  backBtn: {
    background: "#222",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
  },

  loading: {
    color: "#fff",
    textAlign: "center",
    padding: "100px",
  },

  empty: {
    color: "#999",
    textAlign: "center",
    padding: "80px",
    fontSize: "18px",
  },
};

export default CategoryPage;