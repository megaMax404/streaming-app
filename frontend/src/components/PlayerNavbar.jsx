import { useNavigate } from "react-router-dom";

function PlayerNavbar() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        {/* ปุ่มกลับ */}
        <button
          onClick={() => navigate("/")}
          style={styles.backBtn}
        >
          ← กลับหน้าแรก
        </button>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#000",
    borderBottom: "1px solid #222"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "10px 15px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "white"
  },
  backBtn: {
    background: "#222",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  title: {
    margin: 0
  }
};

export default PlayerNavbar;