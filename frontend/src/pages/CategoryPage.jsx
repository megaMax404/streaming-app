import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";

function CategoryPage() {
    const navigate = useNavigate();



    const selectCategory = (cat) => {
        navigate(`/?category=${encodeURIComponent(cat)}`);
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.box}>
                {/* ปุ่มกลับหน้าแรก */}
                <div style={styles.backWrap}>
                    <button
                        style={styles.backBtn}
                        onClick={() =>
                            navigate("/?category=หนังทั้งหมด")
                        }
                    >
                        ← กลับหน้าแรก
                    </button>
                </div>
                <h1 style={styles.title}>แยกหมวดหมู่หนัง</h1>

                <div style={styles.grid}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            style={styles.tag}
                            onClick={() => selectCategory(cat)}
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
        minHeight: "100vh",
        background: "#000",
        padding: "30px"
    },

    box: {
        maxWidth: "1200px",
        margin: "auto",
        background: "#111",
        border: "1px solid #222",
        borderRadius: "20px",
        padding: "25px"
    },

    title: {
        color: "#fff",
        marginBottom: "25px"
    },

    grid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px"
    },

    tag: {
        background: "#181818",
        color: "#fff",
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "10px 14px",
        cursor: "pointer"
    },
    backWrap: {
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "20px"
    },
    backBtn: {
        background: "#222",
        color: "#fff",
        border: "1px solid #444",
        padding: "10px 16px",
        borderRadius: "10px",
        cursor: "pointer"
    },
};

export default CategoryPage;