import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../config";
import MovieCard from "../components/MovieCard";
import { slugToCategory } from "../data/categoryMap";

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryName = slugToCategory(category);

  const MOVIES_PER_PAGE = 36;
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    axios
      .get(`${API_URL}/api/movies`)
      .then((res) => {
        setMovies(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.category?.includes(categoryName)
    );
  }, [movies, categoryName]);

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

  const visiblePages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      Math.abs(i - currentPage) <= 2
    ) {
      visiblePages.push(i);
    }
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        กำลังโหลด...
      </div>
    );
  }

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

      <div className="movie-grid">
        {currentMovies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            {"<<"}
          </button>

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((p) =>
                Math.max(1, p - 1)
              )
            }
          >
            {"<"}
          </button>

          {visiblePages.map((page, index) => {
            const prev = visiblePages[index - 1];

            return (
              <div
                key={page}
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                {prev && page - prev > 1 && (
                  <span
                    style={{
                      color: "#aaa",
                      padding: "10px",
                    }}
                  >
                    ...
                  </span>
                )}

                <button
                  className={
                    currentPage === page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              </div>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
          >
            {">"}
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage(totalPages)
            }
          >
            {">>"}
          </button>

        </div>
      )}


      {filteredMovies.length === 0 && (
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
  },
};

export default CategoryPage;