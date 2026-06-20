import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { categories } from "../data/categories";

function Navbar({ search, setSearch }) {
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
    "Animation การ์ตูน"
  ];

  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        <div
          style={styles.logoLink}
          onClick={() =>
            navigate("/", {
              state: { category: "หนังทั้งหมด" }
            })
          }
        >
          <h2 style={styles.logo}>
            <img src="https://img2.pic.in.th/10392e98b172ab32c.png"
              alt="logo"
              style={styles.logoImage} />
          </h2>
        </div>

        <div className="navLinks">
          <div
            className="nav-item"
            onClick={() =>
              navigate("/", {
                state: { category: "หนังทั้งหมด" }
              })
            }
          >
            หน้าแรก
          </div>

          <div
            className="nav-item"
            onClick={() =>
              navigate("/", {
                state: { category: "หนังทั้งหมด" }
              })
            }
          >
            ดูหนังฟรี HD
          </div>

          <div
            className="nav-item"
            onClick={() => {
              navigate("/", {
                state: { category: "หนังปี 2026" }
              });
            }}
          >
            ดูหนังชนโรง 2026
          </div>

          <Link to="/categories" className="nav-item">แยกหมวดหมู่หนัง</Link>
        </div>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenu(true)}
        >
          ☰
        </button>

        {mobileMenu && (
          <>
            <div
              className="mobile-overlay"
              onClick={() => setMobileMenu(false)}
            />

            <div className="mobile-sidebar">
              <h3>เมนู</h3>

              <div
                className="category-item"
                onClick={() => {
                  navigate("/", {
                    state: { category: "หนังทั้งหมด" }
                  });
                  setMobileMenu(false);
                }}
              >
                🏠 หน้าแรก
              </div>

              <div
                className="category-item"
                onClick={() => {
                  navigate("/", {
                    state: { category: "หนังทั้งหมด" }
                  });
                  setMobileMenu(false);
                }}
              >
                🎬 ดูหนังฟรี HD
              </div>

              <div
                className="category-item"
                onClick={() => {
                  navigate("/", {
                    state: { category: "หนังปี 2026" }
                  });
                  setMobileMenu(false);
                }}
              >
                🔥 ดูหนังชนโรง 2026
              </div>

              <div
                className="category-item"
                onClick={() =>
                  setShowCategoryDropdown(
                    !showCategoryDropdown
                  )
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
                        navigate("/", {
                          state: { category: cat }
                        });
                        setMobileMenu(false);
                        setShowCategoryDropdown(false);
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
                  setMobileMenu(false);
                }}
              >
                ⭐ แยกหมวดหมู่หนัง
              </div>
            </div>
          </>
        )}

        {/* SEARCH BOX */}
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
    background: "black"
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  logo: {
    flexShrink: 0, // 👈 กัน logo บีบ
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: 0
  },

  logoImage: {
    width: "200px",
    height: "100px",
    objectFit: "contain"
  },

  logoLink: {
    textDecoration: "none",
    color: "white"
  },

  searchBox: {
    position: "relative",
    marginLeft: "auto",   // 👈 ดันไปขวา
    width: "300px"
  },

  input: {
    width: "100%",
    boxSizing: "border-box", // 👈 แก้ล้นตัวจริง 💥
    padding: "8px 8px 8px 35px",
    borderRadius: "20px",
    border: "none",
    background: "#222",
    color: "white"
  },

  icon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#aaa",
    pointerEvents: "none"
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginLeft: "20px",
    flex: 1,
    color: "#ddd",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  dropdown: {
    background: "#181818",
    borderRadius: "10px",
    marginTop: "5px",
    marginBottom: "10px"
  },

  dropdownItem: {
    paddingLeft: "25px",
    fontSize: "14px"
  }
};

export default Navbar;