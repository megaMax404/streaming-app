import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { API_URL } from "../config";
import { categories } from "../data/categories";
import { slugToCategory, categoryToSlug, } from "../data/categoryMap";

import MovieCard from "../components/MovieCard";
import Carousel from "../components/Carousel";
import Pagination from "../components/Pagination";

const MOVIES_PER_PAGE = 36;
const LATEST_CATEGORY = "หนังใหม่ล่าสุด";
const LATEST_YEAR = 2026;

function Home({ search }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  // ========================= 
  // STATE 
  // =========================
  const [movies, setMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(false);

  // ========================= 
  // CURRENT CATEGORY
  // =========================
  const category = slug ? slugToCategory(slug) : "หนังทั้งหมด";

  // =========================
  // LOAD MOVIES 
  // =========================

  useEffect(() => {
    let cancelled = false;
    const loadMovies = async () => {
      setLoadingMovies(true);

      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(MOVIES_PER_PAGE),
        });

        const res = await axios.get(`${API_URL}/api/movies?${params.toString()}`
        );

        if (cancelled) return;

        setMovies(res.data.movies || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed loading movies:", err);
        setMovies([]);
        setTotalPages(1);

      } finally {
        if (!cancelled) {
          setLoadingMovies(false);
        }
      }
    };

    loadMovies();
    return () => {
      cancelled = true;
    };
  }, [currentPage]);


  // ========================= 
  // LOAD LATEST MOVIES
  // =========================
  useEffect(() => {
    let cancelled = false;
    const loadLatestMovies = async () => {
      setLoadingLatest(true); try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(MOVIES_PER_PAGE),
          category: LATEST_CATEGORY,
        });
        const res = await axios.get(`${API_URL}/api/movies?${params.toString()}`);

        if (cancelled) return;

        const latest = (res.data.movies || []).filter(
          (movie) => Number(movie.year) === LATEST_YEAR);
        setLatestMovies(latest);

      } catch (err) {
        if (cancelled) return;

        console.error("Failed loading latest movies:", err);
        setLatestMovies([]);
      }

      finally {
        if (!cancelled) {
          setLoadingLatest(false);
        }
      }
    };

    loadLatestMovies();
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  // ========================= 
  // LOAD ARTICLES 
  // =========================

  useEffect(() => {
    let cancelled = false;
    const loadArticles = async () => {

      try {
        const res = await axios.get(`${API_URL}/api/articles`);

        if (cancelled) return;
        setArticles(res.data || []);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed loading articles:", err);
        setArticles([]);
      }
    };
    loadArticles();
    return () => {
      cancelled = true;
    };
  }, []);

  // ========================= 
  // RESET PAGE WHEN CATEGORY CHANGES
  // =========================

  useEffect(() => { setCurrentPage(1); }, [slug]);

  // ========================= 
  // CHANGE CATEGORY 
  // =========================

  const changeCategory = (cat) => {
    if (cat === "หนังทั้งหมด") {
      navigate("/");
      return;
    }

    navigate(`/category/${categoryToSlug(cat)}`
    );
  };


  return (
    <div>
      {/* CAROUSEL */}
      {latestMovies.length > 0 && (
        <section style={styles.carouselSection}>
          <h2 style={styles.sectionTitle}>
            หนังใหม่ล่าสุด (2026)
          </h2>

          <Carousel movies={latestMovies} />
        </section>
      )}

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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
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