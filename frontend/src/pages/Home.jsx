import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import Carousel from "../components/Carousel";
import { categories } from "../data/categories";

function Home({ search }) {
  
  console.log("API_URL =", API_URL);

  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("หนังทั้งหมด");
  const [articles, setArticles] = useState([]);
  const location = useLocation();
  const moviesPerPage = 12;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/movies`)
      .then((res) => {
        // เรียง id จากน้อย -> มาก
        const sortedMovies = res.data.sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

        setMovies(sortedMovies);
      })
      .catch((err) =>
        console.error(err)
      );

    axios
      .get(`${API_URL}/api/articles`)
      .then((res) => {
        setArticles(res.data);
      });
  }, []);

  useEffect(() => {
    if (location.state?.category) {
      setCategory(location.state.category);
      setCurrentPage(1);
    } else {
      setCategory("หนังทั้งหมด");
    }
  }, [location]);

  // 🔍 filter
  const filteredMovies = movies.filter(movie => {
    const matchSearch = movie.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "หนังทั้งหมด" ||
      (movie.category || []).includes(category);
    return matchSearch && matchCategory;
  });

  // 📄 pagination
  const indexOfLast = currentPage * moviesPerPage;
  const indexOfFirst = indexOfLast - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);



  return (
    <div>
      <div style={styles.carouselSection}>
        <div style={styles.sectionTitle}>
          หนังใหม่ล่าสุด(2026)
        </div>

        <Carousel
          movies={movies.filter((movie) =>
            movie.category?.includes("หนังใหม่ล่าสุด")
          )}
        />
      </div>

      <div style={styles.wrapper}>
        <div style={styles.layout}>

          {/* SIDEBAR */}
          <div style={styles.sidebar} className="hide-mobile">
            <h3 style={{ margin: 0, marginBottom: "15px", paddingLeft: "5px" }}>
              หมวดหมู่
            </h3>
            {categories.map(cat => (
              <div
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setCurrentPage(1);
                }}
                className="category-item"
                style={{
                  ...styles.categoryItem,
                  color: category === cat ? "#fff" : "#aaa",
                  fontWeight: category === cat ? "bold" : "normal"
                }}
              >
                {cat}
              </div>
            ))}
          </div>

          {/* MAIN */}
          <div style={styles.main}>

            {/* TITLE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px"
              }}
            >

              <div style={styles.movieTitle}>
                {category}
              </div>
            </div>


            {/* GRID */}
            <div style={styles.container} className="movie-grid">
              {currentMovies.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>

            {/* PAGINATION */}
            <div style={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ARTICLE SECTION */}
      <h2 style={styles.articleTitle}>
        เว็บดูหนังออนไลน์ หนังใหม่ชนโรง 2026
      </h2>
      <p>เว็บดูหนังออนไลน์ฟรี ไม่มีโฆษณา 24hd.com สำหรับคนรักหนัง ในยุคโควิด 19 คุณไม่จำเป็นต้องออกจากบ้าน เราขอแนะนำเว็บดูหนังออนไลน์ 24hd เว็บดูหนังใหม่ ที่มีหนังให้เลือกดูกว่า 4000 เรื่อง ดูฟรีไม่สะดุด ไม่มีโฆษณากวนใจ สามารถดูได้ผ่าน Smart TV , Android , iOS ได้ทุกเครือข่าย มีให้คุณเลือกดูครบไม่ว่าจะเป็น หนังไทย หนังฝรั่ง หนังจีน เกาหลี หรือจะเป็น หนัง Netflix คุณไม่จำเป็นต้องเสียเงินอีกต่อไป ระบบดูหนังของเรานั้นมีให้เลือก ทั้งหนังพากย์ไทย และ ซับไทย มีตัวเล่นหนังสำรองป้องกันหนังเสีย ระบบซ่อมหนังอัตโนมัติ และที่สำคัญสามารถ ดาวน์โหลดหนังฟรี ได้ครบทุกเรื่อง</p>
      {articles.map(article => (
        <section
          key={article._id}
          style={styles.articleBox}
        >
          <h2 style={styles.articleTitle}>
            {article.title}
          </h2>

          <p>{article.intro}</p>

          {article.section1Title &&
            article.section1Content && (
              <div style={styles.articleCategory}>
                <h3>{article.section1Title}</h3>
                <ul>
                  <li>{article.section1Content}</li>
                </ul>
              </div>
            )}

          {article.section2Title &&
            article.section2Content && (
              <div style={styles.articleCategory}>
                <h3>{article.section2Title}</h3>
                <ul>
                  <li>{article.section2Content}</li>
                </ul>
              </div>
            )}

          {article.section3Title &&
            article.section3Content && (
              <div style={styles.articleCategory}>
                <h3>{article.section3Title}</h3>
                <ul>
                  <li>{article.section3Content}</li>
                </ul>
              </div>
            )}

          {article.section4Title &&
            article.section4Content && (
              <div style={styles.articleCategory}>
                <h3>{article.section4Title}</h3>
                <ul>
                  <li>{article.section4Content}</li>
                </ul>
              </div>
            )}
        </section>


      ))}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "10px"
  },

  layout: {
    display: "flex",
    gap: "20px",
    maxWidth: "1200px",
    width: "100%"
  },

  sidebar: {
    width: "200px",
    background: "#111",
    color: "white",
    padding: "15px 10px",
    borderRadius: "10px",
    textAlign: "left"
  },

  categoryItem: {
    padding: "10px 0 10px 5px",
    cursor: "pointer",
    borderBottom: "1px solid #444",
    transition: "0.3s",
    textAlign: "left"
  },

  main: {
    width: "100%",
    maxWidth: "900px"
  },

  container: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "15px",
    width: "100%",
  },

  pagination: {
    marginTop: "20px"
  },

  carouselSection: {
    width: "100%",
    background:
      "linear-gradient(to bottom, #000, #111827)",
    //background: "0d1020",  
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
    textAlign: "left",
  },

  movieTitle: {
    color: "#fff",
    fontSize: "30px",
    fontWeight: "bold",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "12px",
    textAlign: "left",
  },

  articleBox: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "30px",
    background: "linear-gradient(180deg,#111,#0b0b0b)",
    borderRadius: "18px",
    border: "1px solid #2a2a2a",
    textAlign: "left",
    boxShadow: "0 0 30px rgba(0,0,0,0.35)",
  },

  articleTitle: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "12px",
    marginBottom: "25px",
  },

  articleList: {
    color: "#ccc",
    fontSize: "18px",
    lineHeight: "2",
    paddingLeft: "20px",
  },

  articleCategory: {
    marginBottom: "28px",
    color: "#ddd",
  },

  articleLi: {
    color: "#cfcfcf",
    fontSize: "16px",
    lineHeight: "1.9",
    padding: "14px 18px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    listStyle: "none",
    boxShadow: "0 0 12px rgba(0,0,0,0.25)",
  },

};



export default Home;