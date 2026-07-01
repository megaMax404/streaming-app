import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../config";
import { categories } from "../data/categories";
import {
  slugToCategory,
  categoryToSlug,
} from "../data/categoryMap";

import MovieCard from "../components/MovieCard";
import Carousel from "../components/Carousel";

const MOVIES_PER_PAGE = 36;

function Home({ search }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [articles, setArticles] = useState([]);
  const category = slug
    ? slugToCategory(slug)
    : "หนังทั้งหมด";
  const [currentPage, setCurrentPage] = useState(1);

  /* ======================
     FETCH DATA
  ====================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [movieRes, articleRes] = await Promise.all([
          axios.get(`${API_URL}/api/movies`),
          axios.get(`${API_URL}/api/articles`),
        ]);

        const sortedMovies = [...movieRes.data].sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

        setMovies(sortedMovies);
        setArticles(articleRes.data);
      } catch (err) {
        console.error("Failed loading home data:", err);
      }
    };

    loadData();
  }, []);

  /* ======================
     CATEGORY FROM URL
  ====================== */
  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  const changeCategory = (cat) => {
    if (cat === "หนังทั้งหมด") {
      navigate("/");
      return;
    }

    navigate(`/category/${categoryToSlug(cat)}`);
  };

  /* ======================
     FILTER MOVIES
  ====================== */
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const title = movie.title?.toLowerCase() || "";
      const keyword = (search || "").toLowerCase();

      const matchSearch = title.includes(keyword);

      const matchCategory =
        category === "หนังทั้งหมด" ||
        movie.category?.includes(category);

      return matchSearch && matchCategory;
    });
  }, [movies, category, search]);

  /* ======================
     PAGINATION
  ====================== */
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
  console.log("movies =", movies.length);
  console.log("filtered =", filteredMovies.length);
  console.log("current =", currentMovies.length);
  console.log("totalPages =", totalPages);
  return (
    <div>
      {/* CAROUSEL */}
      <div style={styles.carouselSection}>
        <div style={styles.sectionTitle}>
          หนังใหม่ล่าสุด (2026)
        </div>
        <Carousel movies={latestMovies} />
      </div>

      {/* MAIN */}
      <div style={styles.wrapper}>
        <div style={styles.layout}>
          {/* SIDEBAR */}
          <aside
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
                  color: category === cat ? "#ffd000" : "#aaa",
                  fontWeight: category === cat ? "bold" : "normal",
                  background:
                    category === cat
                      ? "rgba(255,208,0,0.12)"
                      : "transparent",
                  paddingLeft: category === cat ? "18px" : "10px",
                }}
                onClick={() =>
                  changeCategory(cat)
                }
              >
                {cat}
              </div>
            ))}
          </aside>

          {/* MOVIES */}
          <main style={styles.main}>
            <div style={styles.movieTitle}>
              {category}
            </div>

            <div className="movie-grid">
              {currentMovies.length > 0 ? (
                currentMovies.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                  />
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={styles.emptyState}>
                    <div style={styles.emptyBox}>
                      <div style={styles.emptyIcon}>🎬</div>

                      <div style={styles.emptyText}>
                        กำลังทำการอัพเดท
                      </div>

                      <div style={styles.emptySubText}>
                        หมวดหมู่นี้กำลังเพิ่มหนังใหม่ โปรดกลับมาอีกครั้ง
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* PAGINATION */}
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
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                >
                  {"<"}
                </button>

                {visiblePages.map((page, index) => {
                  const prevPage = visiblePages[index - 1];

                  return (
                    <div key={page} style={{ display: "flex", gap: "8px" }}>
                      {prevPage && page - prevPage > 1 && (
                        <span style={{ color: "#aaa", padding: "10px" }}>
                          ...
                        </span>
                      )}

                      <button
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "active" : ""}
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
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {">>"}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <ArticleSection articles={articles} />
    </div>

  );
}

/* ======================
   ARTICLE SECTION
====================== */
function ArticleSection({ articles }) {

  if (!articles || articles.length === 0) {
    return <div style={{ color: "white" }}>No articles</div>;
  }

  return (
    <div style={styles.articleWrapper}>
      <h2 style={styles.articleTitle}>
        เว็บดูหนังออนไลน์ หนังใหม่ชนโรง 2026
      </h2>
      {articles.map((article) => {

        return (
          <section key={article._id} style={styles.articleBox}>
            <h2 style={styles.articleTitle}>{article.title}</h2>

            <p>{article.intro}</p>

            {article.section1Title && (
              <>
                <h3>{article.section1Title}</h3>
                <p>{article.section1Content}</p>
              </>
            )}

            {article.section2Title && (
              <>
                <h3>{article.section2Title}</h3>
                <p>{article.section2Content}</p>
              </>
            )}

            {article.section3Title && (
              <>
                <h3>{article.section3Title}</h3>
                <p>{article.section3Content}</p>
              </>
            )}

            {article.section4Title && (
              <>
                <h3>{article.section4Title}</h3>
                <p>{article.section4Content}</p>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    padding: "10px 0",
    boxSizing: "border-box",
  },
  layout: {
    display: "flex",
    gap: "20px",
    width: "100%",
    alignItems: "flex-start",
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
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
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
    margin: "0 0 15px 0",
    textAlign: "left",
  },
  movieTitle: {
    color: "#fff",
    fontSize: "30px",
    fontWeight: "bold",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "12px",
    marginBottom: "20px",
    textAlign: "left",
    width: "100%",
    display: "block",
    marginLeft: 0,
  },
  articleBox: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto 40px auto",
    padding: "30px",
    background: "#111",
    borderRadius: "18px",
    boxSizing: "border-box"
  },
  articleTitle: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "12px",
    marginBottom: "25px",
  },
  emptyState: {
    width: "100%",
    padding: "80px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBox: {
    background: "linear-gradient(180deg,#111,#0b0b0b)",
    border: "1px solid #2a2a2a",
    borderRadius: "18px",
    padding: "40px 60px",
    textAlign: "center",
    boxShadow: "0 0 30px rgba(0,0,0,0.35)",
  },

  emptyIcon: {
    fontSize: "50px",
    marginBottom: "15px",
  },

  emptyText: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  emptySubText: {
    color: "#aaa",
    fontSize: "15px",
  },

  articleWrapper: {
    width: "100%",
    padding: "40px 20px",
    boxSizing: "border-box",
  },

};

export default Home;