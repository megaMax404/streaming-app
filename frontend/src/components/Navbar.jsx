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

  const handleNavigateCategories = () => {
    navigate("/categories");
    closeMobileMenu();
  };

  const renderMobileItem = (label, onClick) => (
    <div className="category-item" onClick={onClick}>
      {label}
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoLink} onClick={handleHome}>
          <h2 style={styles.logo}>
            <img
              src="https://img2.pic.in.th/10392e98b172ab32c.png"
              alt="logo"
              style={styles.logoImage}
            />
          </h2>
        </div>

        {/* Desktop Nav */}
        <div className="navLinks" style={styles.navLinks}>
          <div className="nav-item" onClick={handleHome}>
            หน้าแรก
          </div>

          <div className="nav-item" onClick={handleHome}>
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

        {/* Mobile Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenu(true)}
        >
          ☰
        </button>

        {/* Mobile Menu */}
        {mobileMenu && (
          <>
            <div
              className="mobile-overlay"
              onClick={closeMobileMenu}
            />

            <div className="mobile-sidebar">
              <h3>เมนู</h3>

              {renderMobileItem("🏠 หน้าแรก", handleHome)}
              {renderMobileItem("🎬 ดูหนังฟรี HD", handleHome)}
              {renderMobileItem(
                "🔥 ดูหนังชนโรง 2026",
                () => handleCategory("หนังปี 2026")
              )}

              <div
                className="category-item"
                onClick={() =>
                  setShowCategoryDropdown(prev => !prev)
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

              {renderMobileItem(
                "⭐ แยกหมวดหมู่หนัง",
                handleNavigateCategories
              )}
            </div>
          </>
        )}

        {/* Search */}
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
  );
}

const styles = {
  wrapper: {
    background: "black",
  },

  container: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxSizing: "border-box",
  },

  logo: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    margin: 0,
  },

  logoImage: {
    width: "200px",
    height: "100px",
    objectFit: "contain",
  },

  logoLink: {
    cursor: "pointer",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
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
    boxSizing: "border-box",
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
    pointerEvents: "none",
  },

  dropdown: {
    background: "#181818",
    borderRadius: "10px",
    marginTop: "5px",
    marginBottom: "10px",
  },

  dropdownItem: {
    paddingLeft: "25px",
    fontSize: "14px",
  },
};

export default Navbar;