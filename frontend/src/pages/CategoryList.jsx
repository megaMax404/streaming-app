import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { categoryToSlug } from "../data/categoryMap";

function CategoryList() {
  const navigate = useNavigate();

  const openCategory = (cat) => {
    if (cat === "หนังทั้งหมด") {
      navigate("/");
      return;
    }

    navigate(`/c/${categoryToSlug(cat)}`);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <div style={styles.topBar}>
          <button
            style={styles.backBtn}
            onClick={() => navigate("/")}
          >
            ← หน้าแรก
          </button>

          <h1 style={styles.title}>
            แยกหมวดหมู่หนัง
          </h1>
        </div>

        <div style={styles.grid}>
          {categories.map((cat) => (
            <button
              key={cat}
              style={styles.tag}
              onClick={() => openCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    minHeight: "100vh",
    background: "#000",
    padding: "30px",
    boxSizing: "border-box",
  },

  box: {
    maxWidth: "1400px",
    margin: "0 auto",
    background: "#111",
    borderRadius: "18px",
    padding: "25px",
    border: "1px solid #222",
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  title: {
    color: "#fff",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "12px",
    margin: 0,
  },

  backBtn: {
    background: "#222",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  tag: {
    background: "#1b1b1b",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
    transition: "0.25s",
  },
};

export default CategoryList;