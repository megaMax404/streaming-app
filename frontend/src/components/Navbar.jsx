import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const quickCategories = [
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

  const goCategory = (category) => {
    navigate(`/?category=${encodeURIComponent(category)}`);
  };

  const goHome = () => {
    goCategory("หนังทั้งหมด");
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
    setShowCategoryDropdown(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoLink} onClick={goHome}>
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
          <div className="nav-item" onClick={goHome}>
            หน้าแรก
          </div>

          <div className="nav-item" onClick={goHome}>
            ดูหนังฟรี HD
          </div>

          <div
            className="nav-item"
            onClick={() => goCategory("หนังปี 2026")}
          >
            ดูหนังชนโรง 2026
          </div>

          <Link to="/categories" className="nav-item">
            แยกหมวดหมู่หนัง
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenu(true)}
        >
          ☰
        </button>

        {/* Mobile Sidebar */}
        {mobileMenu && (
          <>
            <div
              className="mobile-overlay"
              onClick={closeMobileMenu}
            />

            <div className="mobile-sidebar">
              <h3>เมนู</h3>

              <div className="category-item" onClick={() => {
                goHome();
                closeMobileMenu();
              }}>
                🏠 หน้าแรก
              </div>

              <div className="category-item" onClick={() => {
                goHome();
                closeMobileMenu();
              }}>
                🎬 ดูหนังฟรี HD
              </div>

              <div className="category-item" onClick={() => {
                goCategory("หนังปี 2026");
                closeMobileMenu();
              }}>
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
                  {quickCategories.map((cat) => (
                    <div
                      key={cat}
                      className="category-item"
                      style={styles.dropdownItem}
                      onClick={() => {
                        goCategory(cat);
                        closeMobileMenu();
                      }}
                    >
                      • {cat}
                    </div>
                  ))}
                </div>
              )}

              <div
                className="category-item"
                onClick={() => {
                  navigate("/categories");
                  closeMobileMenu();
                }}
              >
                ⭐ แยกหมวดหมู่หนัง
              </div>
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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
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