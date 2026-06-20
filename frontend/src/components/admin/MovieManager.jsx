import { API_URL } from "../../config";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../styles/Admin.css";
import {
  useNavigate,
} from "react-router-dom";

function MovieManager({
  editMovieId,
  setEditMovieId
}) {

  const navigate = useNavigate();

  const MOVIE_API = `${API_URL}/api/movies`;
  const token = sessionStorage.getItem("adminToken");

  const authHeader = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const [deleteMovieId, setDeleteMovieId] =
    useState(null);

  const [deleteMovieTitle, setDeleteMovieTitle] =
    useState("");

  //เช็คLogin
  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/9x9adm-login");
    }
  }, [navigate]);

  //Converts YOUTUBE//
  function convertYoutubeToEmbed(url) {
    if (!url) return "";

    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
    );

    if (!match) return url;

    return `https://www.youtube.com/embed/${match[1]}`;
  }

  const isUrl = (url) => {
    if (!url) return true;

    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const MOVIES_PER_PAGE = 20;

  const categoryOptions = ["หนังทั้งหมด", "หนังใหม่ล่าสุด",
    "หนังสยองขวัญ",
    "หนังจีน",
    "หนังไทย",
    "การ์ตูน",
    "Action บู๊",
    "Adventure",
    "หนังมาเวล",
    "Adult 18+",
    "Animal",
    "Animation การ์ตูน",
    "Animation การ์ตูน-edit",
    "Apple TV",
    "Apple Tv+edit",
    "Based on a True Story เรื่องจริง",
    "Based on Novel",
    "Betrayal",
    "Biography ชีวประวัติ-edit",
    "Biography ชีวิตจริง",
    "Biography-edit",
    "Black Comedy",
    "Classic คลาสสิค",
    "Classic หนังคลาสสิก",
    "Classic หนังคลาสสิก-edit",
    "Comedy คอมเมดี้",
    "Comedy ตลก",
    "Comedy ตลก-edit",
    "Comedy ตลกขบขัน",
    "Coming of Age ก้าวผ่านวัย",
    "Coming of Age ก้าวพ้นวัย",
    "Coming of Age วัยรุ่น",
    "Coming-of-Age",
    "Coming-of-age ชีวิตวัยรุ่น",
    "Comedies",
    "Crime อาชญากรรม",
    "Crime อาชญากากรรม",
    "Cult Film",
    "Culture",
    "Dance เต้น",
    "Dark Comedy ตลกร้าย",
    "DC",
    "Detective",
    "Detective สืบสวน",
    "Disaster",
    "Disney+",
    "documentaries",
    "Documentary สารคดี",
    "Drama ดราม่า",
    "Dystopian",
    "Emotional",
    "Epic มหากาพย์",
    "Erotic",
    "Erotic อีโรติก",
    "events",
    "Family ครอบครัว",
    "Fantasy จินตนาการ",
    "Fantasy แฟนตาซี",
    "Feel Good ฟีลกู้ด",
    "Feminism",
    "Fiction",
    "Film",
    "Film Noir นัวร์",
    "Friendship มิตรภาพ",
    "Gambling",
    "GMM25",
    "Gothic",
    "Grief",
    "HBO",
    "HBO GO",
    "HBO Max",
    "Healing",
    "Heist",
    "Historical",
    "History ประวัติศาสตร์",
    "Holiday",
    "Horror สยองขวัญ",
    "Human",
    "Human Interest ชีวิต",
    "Indie อินดี้",
    "Inspiration สร้างแรงบันดาลใจ",
    "Inspirational แรงบันดาลใจ",
    "Interest",
    "Investigation",
    "Investigation สืบสวน",
    "iQIYI",
    "Isekai",
    "Kaiju",
    "Kids",
    "Leave empty – will be assigned post-generation",
    "LGBTQ",
    "Life ชีวิต",
    "Love",
    "Martial",
    "Martial Arts",
    "marvel",
    "Melodrama",
    "Military",
    "Mockumentary",
    "MONOMAX",
    "Monster",
    "Movie Collection",
    "Music",
    "Music ดนตรี",
    "ซีรีย์เกาหลี",
    "Musical",
    "Musical เพลง",
    "Mystery ลึกลับ",
    "Mythology เทพนิยาย",
    "nature",
    "Neo-noir นีโอ-นัวร์",
    "NETFLIX",
    "new-movie",
    "Parody",
    "Patriotic ปลุกใจ",
    "Period ย้อนยุค",
    "Political การเมือง",
    "Pop Music เพลงป๊อป",
    "Post-Apocalyptic",
    "Prime Video",
    "Psychological Thriller จิตวิทยา",
    "Psychological จิตวิทยา",
    "Reality ความจริง",
    "Reality-TV",
    "Relationship ดราม่าความสัมพันธ์",
    "Revenge",
    "Road Movie เดินทาง",
    "Road Trip",
    "Romance รักโรแมนติก",
    "Romantic Comedy",
    "Samurai",
    "Satire",
    "Satire เสียดสี",
    "School",
    "Sci-Fi วิทยาศาสตร์",
    "Science",
    "Sensitive",
    "Short",
    "Slapstick ตลกหน้าตาย",
    "Slasher",
    "Slice of Life ชีวิตประจำวัน",
    "Social Issues",
    "Social Issues สังคม",
    "Space",
    "Sport Drama",
    "Sport กีฬา",
    "Sports",
    "Spy",
    "Standup Comedy",
    "Spy Thriller",
    "Superhero",
    "Superhero หนังฮีโร่",
    "Supernatural เหนือธรรมชาติ",
    "survival",
    "survival เอาตัวรอด",
    "Suspense",
    "Tearjerker เรียกน้ำตา",
    "Technology",
    "Teen",
    "Thai ไทย",
    "Theater",
    "Thriller ระทึกขวัญ",
    "Thriller เขย่าขวัญ",
    "Tragedy โศกนาฏกรรม",
    "Travel",
    "TrueID",
    "Underdog",
    "Vampire",
    "Viu",
    "War สงคราม",
    "War สงคราม-edit",
    "War หนังสงคราม-edit",
    "Webtoon",
    "Wedding",
    "WeTV",
    "wildlife",
    "Wuxia",
    "Youth",
    "Zombie",
    "Romantic",
    "ดูซีรี่ย์",
    "ดูซีรีย์ Disney+",
    "ดูซีรีย์ฝรั่ง",
    "ดูซีรีย์เกาหลี",
    "ดูซีรีย์ไทย",
    "ดูหนัง Disney+",
    "ดูหนัง NETFLIX",
    "ดูหนัง Prime Video",
    "ดูหนัง Viu",
    "ดูหนังญี่ปุ่น",
    "ดูหนังภาคต่อ",
    "ดูหนังออนไลน์",
    "ดูหนังอินเดีย",
    "ดูหนังใหม่ชนโรง",
    "พากย์ไทย",
    "มิตรภาพ",
    "รีวิวหนัง",
    "หนัง HD",
    "ซีรีย์แนวตั้ง",
    "หนังปี 1976 ",
    "หนังปี 1978",
    "หนังปี 1980",
    "หนังปี 1981",
    "หนังปี 1982",
    "หนังปี 1984",
    "หนังปี 1985",
    "หนังปี 1986",
    "หนังปี 1987",
    "หนังปี 1988",
    "หนังปี 1989",
    "หนังปี 1990",
    "หนังปี 1991",
    "หนังปี 1992",
    "หนังปี 1993",
    "หนังปี 1994",
    "หนังปี 1995",
    "หนังปี 1996",
    "หนังปี 1997",
    "หนังปี 1998",
    "หนังปี 1999",
    "หนังปี 2000",
    "หนังปี 2001",
    "หนังปี 2002",
    "หนังปี 2003",
    "หนังปี 2004",
    "หนังปี 2005",
    "หนังปี 2006",
    "หนังปี 2007",
    "หนังปี 2008",
    "หนังปี 2009",
    "หนังปี 2010",
    "หนังปี 2011",
    "หนังปี 2012",
    "หนังปี 2013",
    "หนังปี 2014",
    "หนังปี 2015",
    "หนังปี 2016",
    "หนังปี 2017",
    "หนังปี 2018",
    "หนังปี 2019",
    "หนังปี 2020",
    "หนังปี 2021",
    "หนังปี 2022",
    "หนังปี 2023",
    "หนังปี 2024",
    "หนังปี 2025",
    "หนังปี 2026"
  ];

  const emptyForm = {
    title: "",
    image: "",
    video: "",
    trailer: "",
    description: "",
    content: "",
    highlights: "",
    summary: "",
    rating: "",
    year: "",
    views: "",
    language: "",
    subtitle: "",
    category: ["หนังทั้งหมด"],
  };

  const [movies, setMovies] = useState([]);
  const [trashMovies, setTrashMovies] = useState([]);
  const [showTrash, setShowTrash] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory,] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(emptyForm);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(MOVIE_API);

      const sorted = res.data.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setMovies(sorted);
    }
    catch (err) { console.error(err); }
  };

  const fetchTrashMovies = async () => {
    try {
      const res = await axios.get(
        `${MOVIE_API}/trash/list`,
        authHeader
      );

      setTrashMovies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    if (!editMovieId || movies.length === 0)
      return;

    const movie =
      movies.find(
        m => m._id === editMovieId
      );

    if (movie) {

      editMovie(movie);

      setEditMovieId(null);

    }

  }, [
    editMovieId,
    movies,
    setEditMovieId
  ]);

  useEffect(() => {
    fetchMovies();
    fetchTrashMovies();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, });
  };

  const toggleCategory = (cat) => {
    const exists = formData.category.includes(cat);
    setFormData({ ...formData, category: exists ? formData.category.filter((c) => c !== cat) : [...formData.category, cat,], });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); try {
      if (
        !isUrl(formData.image) ||
        !isUrl(formData.video) ||
        !isUrl(formData.trailer)
      ) {
        alert("URL ไม่ถูกต้อง");
        return;
      }
      
      const payload = {
        ...formData,

        trailer:
          convertYoutubeToEmbed(
            formData.trailer
          ),

        highlights:
          formData.highlights
            .split("\n")
            .filter(Boolean),

        rating: Number(
          formData.rating || 0
        ),

        year: Number(
          formData.year || 0
        ),

        views: Number(
          formData.views || 0
        ),
      };

      if (editingId) {
        await axios.put(
          `${MOVIE_API}/${editingId}`,
          payload,
          authHeader
        );
      } else {
        await axios.post(
          MOVIE_API,
          payload,
          authHeader
        );
      }
      setEditingId(null);
      setFormData({
        ...emptyForm,
        category: ["หนังทั้งหมด"],
      });

      fetchMovies();
      fetchTrashMovies();
    } catch (err) { console.error(err); }
  };

  const editMovie = (movie) => {

    setEditingId(movie._id);

    setFormData({
      title: movie.title ?? "",
      image: movie.image ?? "",
      video: movie.video ?? "",
      trailer: movie.trailer ?? "",
      description: movie.description ?? "",
      content: movie.content ?? "",

      highlights: Array.isArray(movie.highlights)
        ? movie.highlights.join("\n")
        : movie.highlights || "",

      summary: movie.summary ?? "",
      rating: movie.rating ?? "",
      year: movie.year ?? "",
      views: movie.views ?? "",
      language: movie.language ?? "",
      subtitle: movie.subtitle ?? "",
      category: movie.category ?? [],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const confirmDeleteMovie =
    async () => {
      try {
        await axios.delete(
          `${MOVIE_API}/${deleteMovieId}`,
          authHeader
        );

        fetchMovies();
        fetchTrashMovies();

        setDeleteMovieId(null);
        setDeleteMovieTitle("");

      } catch (err) {

        console.error(err);

      }
    };
  ////////////////////////////////////////////
  const categories = useMemo(() => {
    const all = movies.flatMap((movie) => movie.category || []);
    return ["All", ...new Set(all),];
  }, [movies]);
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchSearch = movie.title?.toLowerCase().includes(search.toLowerCase());

      const matchCategory = selectedCategory === "All" || movie.category?.includes(selectedCategory);
      return (matchSearch && matchCategory);
    });
  }, [movies, search, selectedCategory,]);

  const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE) || 1;

  const currentMovies = filteredMovies.slice((currentPage - 1) * MOVIES_PER_PAGE, currentPage * MOVIES_PER_PAGE);

  const exportMovies = () => {
    const dataStr = JSON.stringify(
      movies,
      null,
      2
    );

    const blob = new Blob(
      [dataStr],
      {
        type:
          "application/json",
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `movies-backup-${new Date()
        .toISOString()
        .split("T")[0]
      }.json`;

    link.click();

    URL.revokeObjectURL(
      url
    );
  };

  const restoreMovie = async (id) => {
    try {

      await axios.put(
        `${MOVIE_API}/trash/restore/${id}`,
        {},
        authHeader
      );

      fetchMovies();
      fetchTrashMovies();

    } catch (err) {
      console.error(err);
    }
  };

  const permanentDeleteMovie = async (id) => {

    const ok =
      window.confirm(
        "ลบถาวร?"
      );

    if (!ok) return;

    try {

      await axios.delete(
        `${MOVIE_API}/trash/permanent/${id}`,
        authHeader
      );

      fetchTrashMovies();

    } catch (err) {

      console.error(err);

    }
  };

  return (
    <>
      <div className="movie-dashboard-grid">
        {/* LEFT */}

        <div className="admin-card movie-form-card">
          <h2> {editingId ? "แก้ไขหนัง" : "เพิ่มหนัง"}</h2>

          <form onSubmit={handleSubmit} className="admin-form">
            <input name="title" placeholder="ชื่อหนัง" value={formData.title} onChange={handleChange} />

            <input name="image" placeholder="Poster URL" value={formData.image} onChange={handleChange} />

            <input name="video" placeholder="Video URL" value={formData.video} onChange={handleChange} />

            <input
              name="trailer"
              placeholder="YouTube URL"
              value={formData.trailer}
              onChange={handleChange}
            />

            <div className="input-row">
              <input name="rating" placeholder="IMDb" value={formData.rating} onChange={handleChange} />

              <input name="year" placeholder="ปี" value={formData.year} onChange={handleChange} />

              <input name="views" placeholder="Views" value={formData.views} onChange={handleChange} />
            </div>

            <div className="input-row">
              <input name="language" placeholder="ภาษา" value={formData.language} onChange={handleChange} />

              <input name="subtitle" placeholder="ซับ" value={formData.subtitle} onChange={handleChange} /> </div>

            <textarea name="description" placeholder="ชื่อเรื่องภาษาไทย" rows="3" value={formData.description} onChange={handleChange} />

            <textarea name="content" placeholder="เรื่องย่อ" value={formData.content} onChange={handleChange} />

            <textarea name="highlights" placeholder="จุดเด่น (1 บรรทัดต่อ 1 จุด)" value={formData.highlights} onChange={handleChange} />

            <textarea name="summary" placeholder="สรุป" value={formData.summary} onChange={handleChange} />

            <div className="category-wrap"> {categoryOptions.map((cat) => (<button type="button" key={cat} onClick={() => toggleCategory(cat)} className={`category-chip ${formData.category.includes(cat) ? "active" : ""}`} > {cat} </button>))}

            </div> <button className="submit-btn" type="submit" > {editingId ? "บันทึกการแก้ไข" : "เพิ่มหนัง"} </button>

          </form>
        </div>

        {/* CENTER */}
        <div className="admin-card preview-card">
          <h2>Preview</h2>
          {formData.image ? (<img src={formData.image} alt="preview" className="preview-poster" />) : (
            <div className="preview-placeholder"> ไม่มีรูป </div>)}
          {formData.trailer && (
            <iframe
              src={convertYoutubeToEmbed(
                formData.trailer
              )}
              title="Trailer"
              allowFullScreen
              className="preview-trailer"
            />
          )}
        </div>

        {/* RIGHT */}
        <div className="admin-card movie-list-card">
          <div className="movie-tabs">

            <button
              className={
                !showTrash
                  ? "tab-btn active"
                  : "tab-btn"
              }
              onClick={() =>
                setShowTrash(false)
              }
            >
              🎬 หนังทั้งหมด
            </button>

            <button
              className={
                showTrash
                  ? "tab-btn active"
                  : "tab-btn"
              }
              onClick={() =>
                setShowTrash(true)
              }
            >
              🗑 ถังขยะ
            </button>

          </div>

          <h2>
            {showTrash
              ? "ถังขยะ"
              : "รายการหนังทั้งหมด"}
          </h2>

          <p className="movie-count">
            {showTrash
              ? `หนังในถังขยะ ${trashMovies.length} เรื่อง`
              : `หนังทั้งหมด ${movies.length} เรื่อง`}
          </p>


          <div className="search-row">
            <input placeholder="ค้นหาหนัง..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} > {categories.map((cat) => (
              <option key={cat} > {cat} </option>))}
            </select>
          </div>

          <div className="movie-scroll">

            {showTrash ? (

              trashMovies.map((movie) => (

                <div className="movie-row" key={movie._id}>
                  <img src={movie.image ||
                    "/no-image.jpg"} alt={movie.title} />

                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                  </div>

                  <div className="action-buttons">
                    <button
                      onClick={() =>
                        restoreMovie(movie._id)
                      }
                    >
                      ♻ กู้คืน
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        permanentDeleteMovie(movie._id)
                      }
                    >
                      ❌ ลบถาวร
                    </button>
                  </div>
                </div>

              ))

            ) : (

              currentMovies.map((movie) => (

                <div
                  className="movie-row"
                  key={movie._id}
                >
                  <img
                    src={movie.image ||
                      "/no-image.jpg"}
                    alt={movie.title}
                  />

                  <div className="movie-info">
                    <h3>{movie.title}</h3>

                    <p>
                      ⭐ {movie.rating}
                      {" | "}
                      📅 {movie.year}
                    </p>
                  </div>

                  <div className="action-buttons">

                    <button
                      onClick={() =>
                        editMovie(movie)
                      }
                    >
                      แก้ไข
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => {
                        setDeleteMovieId(movie._id);
                        setDeleteMovieTitle(movie.title);
                      }}
                    >
                      🗑 ลบ
                    </button>

                  </div>
                </div>

              ))

            )}

          </div>

          {!showTrash && (
            <div className="pagination">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p) => p - 1)
                }
              >
                Prev
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => p + 1)
                }
              >
                Next
              </button>

            </div>
          )}
        </div>
      </div>
      {deleteMovieId && (
        <div className="modal-overlay">

          <div className="delete-modal">

            <h2>
              ⚠ ยืนยันการลบ
            </h2>

            <p>
              ต้องการลบหนัง
            </p>

            <strong>
              {deleteMovieTitle}
            </strong>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() => {
                  setDeleteMovieId(null);
                  setDeleteMovieTitle("");
                }}
              >
                ยกเลิก
              </button>

              <button
                className="danger-btn"
                onClick={
                  confirmDeleteMovie
                }
              >
                ลบ
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );


} export default MovieManager;