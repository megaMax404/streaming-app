import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Admin.css";

function BannerManager() {
  const BANNER_API = `${API_URL}/api/banners`;

  const [banners, setBanners] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("top");

  const fetchBanners = async () => {
    try {
      const res = await axios.get(BANNER_API);
      setBanners(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("adminToken");

      const payload = {
        image,
        link,
        type,
      };

      if (editingId) {
        await axios.put(
          `${BANNER_API}/${editingId}`,
          payload,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          BANNER_API,
          payload,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setImage("");
      setLink("");
      setType("top");
      setEditingId(null);

      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const editBanner = (banner) => {
    setEditingId(banner._id);
    setImage(banner.image || "");
    setLink(banner.link || "");
    setType(banner.type || "top");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteBanner = async (id) => {
    const ok = window.confirm("ลบแบนเนอร์?");
    if (!ok) return;

    try {
      const token = sessionStorage.getItem("adminToken");

      await axios.delete(
        `${BANNER_API}/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="movie-dashboard-grid">
        {/* LEFT */}
        <div className="admin-card">
          <h2>
            {editingId
              ? "แก้ไขแบนเนอร์"
              : "เพิ่มแบนเนอร์"}
          </h2>
          <form
            onSubmit={
              handleSubmit
            }
            className="admin-form"
          >
            <div className="banner-select-box">
              <label>
                ประเภทแบนเนอร์
              </label>
              <select
                className="banner-select"
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value
                  )
                }
              >
                <option value="top">
                  Top Banner
                </option>
                <option value="left">
                  Left Ads
                </option>
                <option value="right">
                  Right Ads
                </option>
              </select>
              <p className="banner-size-text">
                {type === "top" &&
                  "ขนาดแนะนำ 722 × 200 px"}
                {type === "left" &&
                  "ขนาดแนะนำ 200 × 270 px"}
                {type === "right" &&
                  "ขนาดแนะนำ 200 × 270 px"}
              </p>
            </div>
            <input
              placeholder="Banner URL"
              value={image}
              onChange={(e) =>
                setImage(
                  e.target.value
                )
              }
            />
            <input
              placeholder="Link URL"
              value={link}
              onChange={(e) =>
                setLink(
                  e.target.value
                )
              }
            />
            <button
              className="submit-btn"
              type="submit"
            >
              {editingId
                ? "บันทึกการแก้ไข"
                : "เพิ่มแบนเนอร์"}
            </button>
          </form>
        </div>
        {/* CENTER */}
        <div className="admin-card preview-card">
          <h2>
            Preview Banner
          </h2>
          {image ? (
            <img src={image} alt="preview" className="preview-banner" />
          ) : (
            <div className="banner-preview">
              ยังไม่มีรูป
            </div>
          )}
        </div>
        {/* RIGHT */}
        <div className="admin-card movie-list-card">
          <h2>
            รายการแบนเนอร์
          </h2>
          <p className="movie-count">
            แบนเนอร์ทั้งหมด{" "}
            {banners.length}
          </p>
          <div className="movie-scroll">
            {banners.map(
              (banner) => (
                <div
                  className="movie-row"
                  key={
                    banner._id
                  }
                >
                  <img
                    className="banner-thumb"
                    src={banner.image || "/no-image.jpg"}
                    alt="banner"
                  />
                  <div className="movie-info">
                    <h3>
                      {banner.type}
                    </h3>
                    <p>
                      ID :
                      {banner._id}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#999",
                        wordBreak: "break-all"
                      }}
                    >
                      {banner.link}
                    </p>
                  </div>
                  <div className="action-buttons">
                    <button
                      onClick={() =>
                        editBanner(
                          banner
                        )
                      }
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() =>
                        deleteBanner(
                          banner._id
                        )
                      }
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
  );
}


export default BannerManager;
