import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../config";
import { categories } from "../data/categories";

import MovieCard from "../components/MovieCard";
import Carousel from "../components/Carousel";

const MOVIES_PER_PAGE = 12;

function Home({ search }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("หนังทั้งหมด");

  /* =====================
     FETCH DATA
  ===================== */
  useEffect(() => {
    fetchMovies();
    fetchArticles();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/movies`);

      const sortedMovies = res.data.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

      setMovies(sortedMovies);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/articles`);
      setArticles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* =====================
     CATEGORY FROM URL
  ===================== */
  useEffect(() => {
    const currentCategory =
      searchParams.get("category") || "หนังทั้งหมด";

    setCategory(currentCategory);
    setCurrentPage(1);
  }, [searchParams]);

  const changeCategory = (cat) => {
    setSearchParams({ category: cat });
  };

  /* =====================
     FILTER MOVIES
  ===================== */
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchSearch = movie.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "หนังทั้งหมด" ||
        (movie.category || []).includes(category);

      return matchSearch && matchCategory;
    });
  }, [movies, category, search]);

  /* =====================
     PAGINATION
  ===================== */
  const totalPages = Math.ceil(
    filteredMovies.length / MOVIES_PER_PAGE
  );

  const currentMovies = useMemo(() => {
    const start =
      (currentPage - 1) * MOVIES_PER_PAGE;
    const end = start + MOVIES_PER_PAGE;

    return filteredMovies.slice(start, end);
  }, [filteredMovies, currentPage]);

  const latestMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.category?.includes("หนังใหม่ล่าสุด")
    );
  }, [movies]);

  return (
    <div>
      {/* CAROUSEL */}
      <div style={styles.carouselSection}>
        <div style={styles.sectionTitle}>
          หนังใหม่ล่าสุด (2026)
        </div>

        <Carousel movies={latestMovies} />
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.wrapper}>
        <div style={styles.layout}>
          {/* SIDEBAR */}
          <div
            style={styles.sidebar}
            className="hide-mobile"
          >
            <h3 style={styles.sidebarTitle}>
              หมวดหมู่
            </h3>

            {categories.map((cat) => (
              <div
                key={cat}
                className="category-item"
                style={{
                  ...styles.categoryItem,
                  color:
                    category === cat
                      ? "#fff"
                      : "#aaa",
                  fontWeight:
                    category === cat
                      ? "bold"
                      : "normal",
                }}
                onClick={() =>
                  changeCategory(cat)
                }
              >
                {cat}
              </div>
            ))}
          </div>

          {/* MOVIES */}
          <div style={styles.main}>
            <div style={styles.movieTitle}>
              {category}
            </div>

            <div
              style={styles.container}
              className="movie-grid"
            >
              {currentMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                />
              ))}
            </div>

            <div style={styles.pagination}>
              {Array.from(
                { length: totalPages },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setCurrentPage(i + 1)
                    }
                    className={`page-btn ${
                      currentPage === i + 1
                        ? "active"
                        : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLES */}
      <ArticleSection articles={articles} />
    </div>
  );
}

/* =====================
   ARTICLE COMPONENT
===================== */
function ArticleSection({ articles }) {
  return (
    <>
      <h2 style={styles.articleTitle}>
        เว็บดูหนังออนไลน์ หนังใหม่ชนโรง 2026
      </h2>

      {articles.map((article) => (
        <section
          key={article._id}
          style={styles.articleBox}
        >
          <h2 style={styles.articleTitle}>
            {article.title}
          </h2>

          <p>{article.intro}</p>
        </section>
      ))}
    </>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "10px",
  },
  layout: {
    display: "flex",
    gap: "20px",
    maxWidth: "1200px",
    width: "100%",
  },
  sidebar: {
    width: "200px",
    background: "#111",
    color: "white",
    padding: "15px 10px",
    borderRadius: "10px",
  },
  sidebarTitle: {
    margin: 0,
    marginBottom: "15px",
    paddingLeft: "5px",
  },
  categoryItem: {
    padding: "10px 0 10px 5px",
    cursor: "pointer",
    borderBottom: "1px solid #444",
  },
  main: {
    width: "100%",
    maxWidth: "900px",
  },
  container: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(180px,1fr))",
    gap: "15px",
  },
  pagination: {
    marginTop: "20px",
  },
  carouselSection: {
    width: "100%",
    background:
      "linear-gradient(to bottom,#000,#111827)",
    padding: "20px 0 10px",
    marginBottom: "10px",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "12px",
    margin: "0 0 15px 20px",
  },
  movieTitle: {
    color: "#fff",
    fontSize: "30px",
    fontWeight: "bold",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "12px",
    marginBottom: "20px",
  },
  articleBox: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "30px",
    background: "#111",
    borderRadius: "18px",
  },
  articleTitle: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "12px",
    marginBottom: "25px",
  },
};

export default Home;