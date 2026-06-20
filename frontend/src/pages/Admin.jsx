import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ArticleManager from "../components/admin/ArticleManager";
import MovieManager from "../components/admin/MovieManager";
import BannerManager from "../components/admin/BannerManager";
import SettingManager from "../components/admin/SettingManager";
import CheckMovieManager from "../components/admin/CheckMovieManager";

import "../styles/Admin.css";

function Admin() {
  const [editMovieId, setEditMovieId] =
    useState(null);
  const navigate = useNavigate();

  const [adminTab, setAdminTab] =
    useState("movie");

  useEffect(() => {
    const token =
      sessionStorage.getItem(
        "adminToken"
      );

    if (!token) {
      navigate("/9x9adm-login");
    }
  }, [navigate]);

  const logout = () => {
    sessionStorage.clear();

    navigate("/9x9adm-login");
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-dashboard-card">

        <div className="dashboard-top">

          <div>
            <h1 className="dashboard-title">
              🎬 Admin Dashboard
            </h1>

            <p className="dashboard-subtitle">
              จัดการหนัง แบนเนอร์
              และตั้งค่าเว็บไซต์
            </p>
          </div>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        {/* TAB MENU */}
        <div className="dashboard-tabs">

          <button
            className={`dashboard-tab ${adminTab === "movie"
              ? "active"
              : ""
              }`}
            onClick={() =>
              setAdminTab("movie")
            }
          >
            🎬 จัดการหนัง
          </button>

          <button
            className={`dashboard-tab ${adminTab === "banner"
              ? "active"
              : ""
              }`}
            onClick={() =>
              setAdminTab("banner")
            }
          >
            🖼 จัดการแบนเนอร์
          </button>
          <button
            className={`dashboard-tab ${adminTab === "check"
              ? "active"
              : ""
              }`}
            onClick={() =>
              setAdminTab("check")
            }
          >
            🔍 ตรวจหนัง
          </button>

          <button
            className={`dashboard-tab ${adminTab === "article"
                ? "active"
                : ""
              }`}
            onClick={() =>
              setAdminTab("article")
            }
          >
            📰 แก้ไขบทความ
          </button>

          <button
            className={`dashboard-tab ${adminTab === "setting"
                ? "active"
                : ""
              }`}
            onClick={() =>
              setAdminTab("setting")
            }
          >
            ⚙ ตั้งค่าเว็บ
          </button>

        </div>
      </div>




      {/* CONTENT */}
      <div className="admin-content">

        {adminTab === "movie" && (
          <MovieManager
            editMovieId={editMovieId}
            setEditMovieId={setEditMovieId}
          />
        )}

        {adminTab === "banner" && (
          <BannerManager />
        )}

        {adminTab === "check" && (
          <CheckMovieManager
            setAdminTab={setAdminTab}
            setEditMovieId={setEditMovieId}
          />
        )}

        {adminTab === "article" && (
          <ArticleManager />
        )}

        {adminTab === "setting" && (
          <SettingManager />
        )}

      </div>
    </div>
  );
}

export default Admin;