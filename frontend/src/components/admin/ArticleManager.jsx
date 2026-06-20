import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import "../../styles/Admin.css";

function ArticleManager() {
  const emptyForm = {
  title: "",
  intro: "",
  section1Title: "",
  section1Content: "",
  section2Title: "",
  section2Content: "",
  section3Title: "",
  section3Content: "",
  section4Title: "",
  section4Content: "",
};

  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] =
    useState(emptyForm);

  const fetchArticles = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/articles`
      );
      setArticles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/api/articles/${editingId}`,
          formData
        );
      } else {
        await axios.post(
          `${API_URL}/api/articles`,
          formData
        );
      }

      setEditingId(null);
      setFormData(emptyForm);
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  const editArticle = (article) => {
    setEditingId(article._id);

    setFormData({
      title: article.title || "",
      intro: article.intro || "",
      section1Title: article.section1Title || "",
      section1Content: article.section1Content || "",
      section2Title: article.section2Title || "",
      section2Content: article.section2Content || "",
      section3Title: article.section3Title || "",
      section3Content: article.section3Content || "",
      section4Title: article.section4Title || "",
      section4Content: article.section4Content || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteArticle = async (id) => {
    const ok = window.confirm("ลบบทความนี้?");
    if (!ok) return;

    try {
      await axios.delete(
        `${API_URL}/api/articles/${id}`
      );
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="movie-dashboard-grid">
      {/* LEFT */}
      <div className="admin-card movie-form-card">
        <h2>
          {editingId
            ? "แก้ไขบทความ"
            : "เพิ่มบทความ"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="admin-form"
        >
          <input
            name="title"
            placeholder="หัวข้อหลัก"
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            name="intro"
            placeholder="Intro"
            rows="4"
            value={formData.intro}
            onChange={handleChange}
          />

          <input
            name="section1Title"
            placeholder="Section 1 Title"
            value={formData.section1Title}
            onChange={handleChange}
          />
          <textarea
            name="section1Content"
            placeholder="Section 1 Content"
            value={formData.section1Content}
            onChange={handleChange}
          />

          <input
            name="section2Title"
            placeholder="Section 2 Title"
            value={formData.section2Title}
            onChange={handleChange}
          />
          <textarea
            name="section2Content"
            placeholder="Section 2 Content"
            value={formData.section2Content}
            onChange={handleChange}
          />

          <input
            name="section3Title"
            placeholder="Section 3 Title"
            value={formData.section3Title}
            onChange={handleChange}
          />
          <textarea
            name="section3Content"
            placeholder="Section 3 Content"
            value={formData.section3Content}
            onChange={handleChange}
          />

          <input
            name="section4Title"
            placeholder="Section 4 Title"
            value={formData.section4Title}
            onChange={handleChange}
          />
          <textarea
            name="section4Content"
            placeholder="Section 4 Content"
            value={formData.section4Content}
            onChange={handleChange}
          />

          <button className="submit-btn">
            {editingId
              ? "บันทึกการแก้ไข"
              : "เพิ่มบทความ"}
          </button>
        </form>
      </div>

      {/* RIGHT */}
      <div className="admin-card movie-list-card">
        <h2>บทความทั้งหมด</h2>

        {articles.map((article) => (
          <div
            key={article._id}
            className="movie-row"
          >
            <div className="movie-info">
              <h3>{article.title}</h3>
            </div>

            <div className="action-buttons">
              <button
                onClick={() =>
                  editArticle(article)
                }
              >
                ✏️ แก้ไข
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteArticle(article._id)
                }
              >
                🗑 ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleManager;