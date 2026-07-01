import { Link, useNavigate } from "react-router-dom";
import { categoryToSlug } from "../data/categoryMap";
import { useState } from "react";

const QUICK_CATEGORIES = [
  "หนังใหม่ล่าสุด",
  "หนังปี 2026",
  "Action บู๊",
  "Comedy ตลก",
  "Horror สยองขวัญ",
  "Romance รักโรแมนติก",
  "Thriller ระทึกขวัญ",
  "หนังมาเวล",
  "Netflix",
  "Animation การ์ตูน",
];

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenu(false);
    setShowCategoryDropdown(false);
  };

  const handleCategory = (category) => {
    const slug = categoryToSlug(category);

    if (slug === "all") {
      navigate("/");
    } else {
      navigate(`/category/${slug}`);
    }

    closeMobileMenu();
  };

  const handleHome = () => {
    handleCategory("หนังทั้งหมด");
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        ☰
      </button>

      {/* Overlay */}
      {mobileMenu && (
        <div className="mobile-overlay" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <div className={`mobile-sidebar ${mobileMenu ? "open" : ""}`}>
        <h3>เมนู</h3>

        <div className="category-item" onClick={handleHome}>
          🏠 หน้าแรก
        </div>

        <div className="category-item" onClick={() => handleCategory("หนังปี 2026")}>
          🔥 ดูหนังชนโรง 2026
        </div>

        <div
          className="category-item"
          onClick={() =>
            setShowCategoryDropdown(!showCategoryDropdown)
          }
        >
          📂 หมวดหมู่หนัง
        </div>

        {showCategoryDropdown && (
          <div style={styles.dropdown}>
            {QUICK_CATEGORIES.map((cat) => (
              <div
                key={cat}
                className="category-item"
                style={styles.dropdownItem}
                onClick={() => handleCategory(cat)}
              >
                • {cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navbar */}
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div style={styles.logoLink} onClick={handleHome}>
            <img
              src="https://img2.pic.in.th/10392e98b172ab32c.png"
              alt="logo"
              style={styles.logoImage}
            />
          </div>

          <div className="navLinks" style={styles.navLinks}>
            <div className="nav-item" onClick={handleHome}>
              หน้าแรก
            </div>

            <div className="nav-item">
              ดูหนังฟรี HD
            </div>

            <div
              className="nav-item"
              onClick={() => handleCategory("หนังปี 2026")}
            >
              ดูหนังชนโรง 2026
            </div>

            <Link to="/categories" className="nav-item">
              แยกหมวดหมู่หนัง
            </Link>
          </div>

          <div className="search-box" style={styles.searchBox}>
            <span style={styles.icon}>🔍</span>

            <input
              type="text"
              placeholder="ค้นหาหนัง..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  wrapper: {
    background: "black",
    borderBottom: "1px solid #222",
  },

  container: {
    width: "min(1400px, calc(100vw - 40px))",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logoLink: {
    cursor: "pointer",
  },

  logoImage: {
    width: "200px",
    height: "100px",
    objectFit: "contain",
  },

  navLinks: {
    display: "flex",
    gap: "20px",
    marginLeft: "20px",
    flex: 1,
    color: "#ddd",
    fontSize: "15px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  searchBox: {
    position: "relative",
    marginLeft: "auto",
    width: "300px",
  },

  input: {
    width: "100%",
    padding: "8px 8px 8px 35px",
    borderRadius: "20px",
    border: "none",
    background: "#222",
    color: "white",
  },

  icon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#aaa",
  },

  dropdown: {
    background: "#181818",
    borderRadius: "10px",
    marginTop: "5px",
  },

  dropdownItem: {
    paddingLeft: "20px",
  },
};

export default Navbar;