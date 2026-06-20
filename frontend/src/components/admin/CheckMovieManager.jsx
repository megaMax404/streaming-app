import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

function CheckMovieManager({
  setAdminTab,
  setEditMovieId
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkMovies = async () => {
    try {
      setLoading(true);

      const token = sessionStorage.getItem("adminToken");

      const res = await axios.post(
        `${API_URL}/api/admin/check-videos`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );

      setResult(res.data);

    } catch (err) {
      console.error(err);
      alert("ตรวจสอบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const deleteBrokenMovie = async (id) => {
    const confirmDelete = window.confirm(
      "ต้องการลบหนังเรื่องนี้หรือไม่ ?"
    );

    if (!confirmDelete) return;

    try {
      const token = sessionStorage.getItem("adminToken");

      await axios.delete(
        `${API_URL}/api/movies/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      );

      alert("ลบสำเร็จ");
      checkMovies();

    } catch (err) {
      console.error(err);
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <div
      style={{
        background: "#111",
        padding: "20px",
        borderRadius: "12px",
        color: "#fff",
      }}
    >
      <h2>🔍 ตรวจสอบไฟล์หนัง</h2>

      <button
        onClick={checkMovies}
        disabled={loading}
        style={{
          background: "#ffd000",
          color: "#000",
          border: "none",
          padding: "12px 24px",
          borderRadius: "10px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {loading
          ? "กำลังตรวจสอบ..."
          : "ตรวจสอบหนังทั้งหมด"}
      </button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>📊 ผลการตรวจสอบ</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "15px",
              marginBottom: "25px",
            }}
          >
            <div style={cardStyle}>
              <div style={{ color: "#999", fontSize: "14px" }}>
                ตรวจทั้งหมด
              </div>
              <div style={numberStyle}>
                {result.total}
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ color: "#00ff66", fontSize: "14px" }}>
                ปกติ
              </div>
              <div style={{ ...numberStyle, color: "#00ff66" }}>
                {result.ok}
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ color: "#ff4444", fontSize: "14px" }}>
                เสีย
              </div>
              <div style={{ ...numberStyle, color: "#ff4444" }}>
                {result.dead}
              </div>
            </div>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#111",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>ชื่อหนัง</th>
                <th style={thStyle}>URL</th>
                <th style={thStyle}>สถานะ</th>
                <th style={thStyle}>จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {result.deadMovies?.map((movie) => (
                <tr key={movie._id}>
                  <td style={tdStyle}>{movie._id}</td>
                  <td style={tdStyle}>{movie.title}</td>

                  <td
                    style={{
                      ...tdStyle,
                      maxWidth: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {movie.video}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        background: "#550000",
                        color: "#ff6666",
                        padding: "6px 12px",
                        borderRadius: "8px",
                      }}
                    >
                      ❌ เสีย
                    </span>
                  </td>

                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditMovieId(movie._id);
                          setAdminTab("movie");
                        }}
                        style={editBtn}
                      >
                        ✏️ แก้ไข
                      </button>

                      <button
                        onClick={() =>
                          deleteBrokenMovie(movie._id)
                        }
                        style={deleteBtn}
                      >
                        🗑 ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: "#111",
  border: "1px solid #222",
  borderRadius: "12px",
  padding: "18px",
  textAlign: "center"
};

const numberStyle = {
  color: "#fff",
  fontSize: "30px",
  fontWeight: "bold"
};

const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #333",
  textAlign: "center"
};

const tdStyle = {
  padding: "12px",
  textAlign: "center"
};

const editBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600"
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600"
};

export default CheckMovieManager;

