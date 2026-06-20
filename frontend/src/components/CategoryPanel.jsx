function CategoryPanel({
  categories,
  setCategory,
  setCurrentPage
}) {
  return (
    <div style={styles.box}>
      <h2 style={styles.title}>
        แยกหมวดหมู่หนัง
      </h2>

      <div style={styles.grid}>
        {categories.map((cat) => (
          <button
            key={cat}
            style={styles.tag}
            onClick={() => {
              setCategory(cat);
              setCurrentPage(1);
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  box: {
    background: "#0d0d0d",
    border: "1px solid #222",
    borderRadius: "20px",
    padding: "20px",
    marginTop: "30px"
  },

  title: {
    color: "white",
    marginBottom: "20px"
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },

  tag: {
    background: "#111",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer"
  }
};

export default CategoryPanel;