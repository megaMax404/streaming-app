import { API_URL } from "../config";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/MovieDetailStyle.css";
import PlayerNavbar from "../components/PlayerNavbar";
import {
  getContinueWatching,
  saveContinueWatching,
  removeContinueWatching,
} from "../utils/continueWatching";
function MovieDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [banners, setBanners] = useState([]);
  const [startMovie, setStartMovie] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [resumeTime, setResumeTime] = useState(0);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [forceRestart, setForceRestart] = useState(false);
  const [allowResume, setAllowResume] = useState(false);
  // โหลดข้อมูลหนัง

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    axios
      .get(`${API_URL}/api/movies/slug/${slug}`)
      .then((res) => {
        setMovie(res.data);
      })
      .catch((err) => {
        console.error(err);

        if (err.response?.status === 404) {
          setNotFound(true);
          setMovie(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);


  useEffect(() => {
    axios
      .get(
        `${API_URL}/api/banners`
      )
      .then((res) =>
        setBanners(
          res.data
        )
      )
      .catch(console.error);
  }, []);

  useEffect(() => {
    setStartMovie(false);
    setVideoError(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [slug]);


  // เล่น m3u8
  useEffect(() => {
    if (!movie || !startMovie) return;
    if (!videoRef.current) return;
    let hls;
    const loadPlayer = async () => {
      const { default: Hls } = await import("hls.js");
      setVideoError(false);
      setLoadingPlayer(true);
      if (Hls.isSupported()) {
        hls = new Hls({
          maxLoadingDelay: 4,
          manifestLoadingTimeOut: 30000,
          manifestLoadingMaxRetry: 4,
          levelLoadingTimeOut: 30000,
          fragLoadingTimeOut: 40000,
        });
        hls.loadSource(movie.video);
        hls.attachMedia(videoRef.current);
        // โหลด playlist สำเร็จ
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoadingPlayer(false);
          videoRef.current.onloadedmetadata = null;
          videoRef.current.onloadedmetadata = () => {

            if (forceRestart) {
              videoRef.current.currentTime = 0;
              setForceRestart(false);

            } else if (allowResume && resumeTime > 0) {
              videoRef.current.currentTime = resumeTime;
            }

            videoRef.current.play().catch(() => { });
          };
        });
        // ถ้าไฟล์เสีย / URL ผิด
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log("retry loading...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                setVideoError(true);
                hls.destroy();
                break;
            }
          }
        });
      } else if (
        videoRef.current.canPlayType(
          "application/vnd.apple.mpegurl"
        )
      ) {
        videoRef.current.src = movie.video;
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onloadedmetadata = () => {

          if (forceRestart) {
            videoRef.current.currentTime = 0;
            setForceRestart(false);

          } else if (allowResume && resumeTime > 0) {
            videoRef.current.currentTime = resumeTime;
          }

          videoRef.current.play().catch(() => { });
        };

        videoRef.current.onerror = () => {
          setLoadingPlayer(false);
          setVideoError(true);
        };
      }
    };
    loadPlayer();
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [movie, startMovie, resumeTime, forceRestart, allowResume,]);

  useEffect(() => {
    if (!movie) return;

    const dismissed =
      sessionStorage.getItem(
        `dismiss-${movie.slug}`
      );

    if (dismissed) return;

    const list = getContinueWatching();

    const data =
      list.find(
        (m) => m.slug === movie.slug
      );

    if (data && data.time > 30) {

      setResumeTime(data.time);

      setShowResumePopup(true);

    }

  }, [movie]);

  const saveProgress = () => {
    if (!videoRef.current || !movie) return;

    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 0;

    // ดูเกิน 95% ให้ลบออกจาก Continue Watching
    if (duration > 0 && current / duration >= 0.95) {
      removeContinueWatching(movie.slug);
      return;
    }

    if (current < 5) return;

    saveContinueWatching({
      slug: movie.slug,
      title: movie.title,
      image: movie.image,
      time: current,
      duration,
    });
  };

  useEffect(() => {
    if (!startMovie) return;
    if (!videoRef.current) return;

    const video = videoRef.current;

    const timer = setInterval(() => {
      if (!video.paused) {
        saveProgress();
      }
    }, 10000);
    // เซฟเมื่อกด Pause
    video.addEventListener("pause", saveProgress);

    // เซฟเมื่อเลื่อนเวลา
    video.addEventListener("seeked", saveProgress);

    return () => {
      clearInterval(timer);

      video.removeEventListener("pause", saveProgress);
      video.removeEventListener("seeked", saveProgress);
    };

  }, [startMovie, movie]);

  useEffect(() => {
    return () => {
      saveProgress();
      if (movie) {
        sessionStorage.removeItem(
          `dismiss-${movie.slug}`
        );
      }
    };
  }, [movie]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [movie]);

  if (loading) {
    return (
      <div className="movie-loading-page">
        <h2>กำลังโหลด...</h2>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="movie-notfound-page">
        <h1>404</h1>
        <h2>ไม่พบหนังเรื่องนี้</h2>

        <button
          onClick={() => navigate("/")}
          className="movie-back-home-button"
        >
          กลับหน้าแรก
        </button>
      </div>
    );
  }

  const topBanners =
    banners.filter(
      (b) =>
        b.type === "top"
    );

  const leftAds =
    banners.filter(
      (b) =>
        b.type === "left"
    );

  const rightAds =
    banners.filter(
      (b) =>
        b.type === "right"
    );

  return (
    <div>
      <PlayerNavbar />

      <div className="movie-page">

        {/* LEFT ADS */}
        <div className="movie-side-ads hide-mobile">
          {leftAds.map((ad) => (
            ad.image && (
              <a
                key={ad._id}
                href={ad.link}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={ad.image}
                  className="movie-ad-img"
                  alt="ad"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            )
          ))}
        </div>

        {/* MAIN */}
        <div className="movie-main">

          {/* TOP BANNER */}
          {topBanners.map((banner) => (
            banner.image && (
              <a
                key={banner._id}
                href={banner.link || "#"}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (!banner.link)
                    e.preventDefault();
                }}
              >
                <img
                  src={banner.image}
                  className="movie-banner"
                  alt="banner"
                  fetchPriority="high"
                />

              </a>
            )
          ))}

          {/* VIDEO  */}
          {videoError ? (
            <div className="movie-start-box">
              <div>
                <h2 className="movie-error-title">
                  ❌ ไม่สามารถโหลดหนังได้
                </h2>

                <p className="movie-error-text">
                  ไฟล์หนังอาจถูกลบ หรือ URL ไม่ถูกต้อง
                </p>
              </div>
            </div>
          ) : (
            <>
              {!startMovie && !showResumePopup && (
                <div className="movie-start-box">
                  <button
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                      e.currentTarget.style.boxShadow =
                        "0 18px 45px rgba(255,180,0,.55)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 35px rgba(255,180,0,.35)";
                    }}
                    className="movie-play-button"
                    onClick={() => {

                      sessionStorage.removeItem(`dismiss-${movie.slug}`);

                      removeContinueWatching(movie.slug);

                      setAllowResume(false);

                      setResumeTime(0);

                      setForceRestart(true);

                      setVideoError(false);

                      setStartMovie(true);

                    }}
                  >
                    ▶ เริ่มเล่นหนัง
                  </button>
                </div>
              )}

              {/* TITLE */}
              <h2 className="movie-page-title">
                {movie.title}{" "}
                {movie.description}
              </h2>

              {/* TOP */}
              <div className="movie-top-section">

                {/* POSTER */}
                <img
                  src={movie.image ||
                    "/no-image.jpg"}
                  alt={movie.title}
                  className="movie-poster"
                  fetchPriority="high"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow = "0 25px 60px rgba(255,208,0,.25)";
                  }}

                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,.55)";
                  }}
                />

                {/* TRAILER */}
                <div className="movie-info">
                  {movie.trailer && (
                    <iframe
                      src={movie.trailer}
                      title="Trailer"
                      className="movie-trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.01)";
                      }}

                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  )}
                </div>
              </div>

              {/* META */}
              <div className="movie-meta-card">

                <div className="movie-meta-item">
                  <span className="movie-meta-icon">📅</span>
                  <div>
                    <small>ปีที่ฉาย</small>
                    <strong>{movie.year}</strong>
                  </div>
                </div>

                <div className="movie-meta-item">
                  <span className="movie-meta-icon">⭐</span>
                  <div>
                    <small>IMDb</small>
                    <strong>{movie.rating}</strong>
                  </div>
                </div>

                <div className="movie-meta-item">
                  <span className="movie-meta-icon">👁</span>
                  <div>
                    <small>เข้าชม</small>
                    <strong>{movie.views}</strong>
                  </div>
                </div>

              </div>

              <div className="movie-category-text">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="#888"
                  style={{
                    marginRight: "8px",
                    flexShrink: 0
                  }}
                >
                  <path d="M10.2579783,2.00646794 C10.4381945,2.00646794 10.6109777,2.07617271 10.7380774,2.20015073 L19.7531833,10.998129 C19.9396487,11.2187892 20.0259514,11.4895309 19.9931885,11.7726484 C19.9660869,12.0068439 19.8694718,12.221741 19.6711911,12.4458242 L14.2287007,17.6818114 C14.014199,17.8852817 13.7437457,18 13.4465592,18 C13.1711732,18 12.939837,17.90245 12.6533596,17.6818114 L12.4833001,17.5471465 L13.4243922,16.6050097 L17.8611492,12.3395885 C18.0286813,12.1459284 18.1124474,11.9138855 18.1124474,11.6434597 C18.1124474,11.373034 18.0204901,11.1554326 17.8365755,10.9906557 L9.62658497,3.01503224 C9.23058093,2.64479482 8.82205848,2.38384332 8.40101762,2.23217773 C8.10381231,2.12511968 7.83714915,2.06883797 7.67707624,2.03925146 L7.54597231,2.01595878 C7.51125433,2.00948302 7.51031342,2.00742346 7.55265559,2.00676994 L10.2579783,2.00646794 Z M6.81654766,2 C6.9967639,2 7.16954708,2.06970455 7.29664674,2.19368258 L16.3117527,10.9916608 C16.4982181,11.2123211 16.5845208,11.4830627 16.5517579,11.7661803 C16.5246563,12.0003757 16.4280412,12.2152729 16.2297605,12.439356 L10.78727,17.6753432 C10.5727684,17.8788135 10.302315,17.9935318 10.0051286,17.9935318 C9.72974264,17.9935318 9.47346105,17.8962597 9.18698361,17.6756211 L0.204617964,9.16550767 C0.0740980033,9.04184986 0.000507565033,8.87232643 0.000507565033,8.69531758 L0.000803337996,3.35893737 C-0.00937532279,3.02485784 0.0769825179,2.72037321 0.270699622,2.46921136 C0.500257217,2.17158091 0.848238294,2.02412739 1.29861129,2 L6.81654766,2 Z" />
                </svg>

                {movie.category?.join(" • ")}
              </div>

              {showResumePopup && (
                <div className="resume-popup">
                  <h2 className="resume-title">
                    เล่นต่อจากเดิม?
                  </h2>

                  <div className="resume-button-group">

                    <button
                      className="resume-play-button"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                        e.currentTarget.style.boxShadow =
                          "0 18px 45px rgba(255,180,0,.55)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 35px rgba(255,180,0,.35)";
                      }}
                      onClick={() => {
                        sessionStorage.removeItem(`dismiss-${movie.slug}`);

                        setAllowResume(true);

                        setShowResumePopup(false);
                        setStartMovie(true);
                      }}
                    >
                      ▶ เล่นต่อ
                    </button>

                    <button
                      className="resume-restart-button"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                        e.currentTarget.style.boxShadow =
                          "0 18px 45px rgba(255,180,0,.55)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 35px rgba(255,180,0,.35)";
                      }}
                      onClick={() => {
                        sessionStorage.removeItem(`dismiss-${movie.slug}`);

                        removeContinueWatching(movie.slug);

                        setAllowResume(false);

                        setForceRestart(true);
                        setResumeTime(0);

                        setShowResumePopup(false);
                        setStartMovie(true);
                      }}
                    >
                      ↺ เริ่มใหม่
                    </button>

                    <button
                      className="resume-close-button"
                      onClick={() => {

                        sessionStorage.setItem(
                          `dismiss-${movie.slug}`,
                          "1"
                        );

                        setAllowResume(false);

                        setResumeTime(0);

                        setShowResumePopup(false);
                      }}
                    >
                      ✕ ปิด
                    </button>

                  </div>
                </div>
              )}

              {/* ARTICLE */}
              <div className="movie-article-box">
                <h2 className="movie-article-title">
                  เรื่องย่อของ {movie.title}{" "}{movie.description}
                </h2>

                <div className="movie-article-text">
                  {movie.content}
                </div>


                {startMovie && (
                  <div className="movie-player-wrapper">
                    
                    {loadingPlayer && (
                      <div className="movie-loading-box">
                        <div className="movie-spinner"></div>

                        <h2 className="movie-loading-text">
                          กำลังโหลดหนัง...
                        </h2>

                        <p className="movie-loading-sub">
                          กรุณารอสักครู่
                        </p>
                      </div>
                    )}

                    <video
                      ref={videoRef}
                      controls
                      autoPlay

                      onEnded={() => {
                        removeContinueWatching(movie.slug);
                        setResumeTime(0);
                      }
                      }
                      className="movie-video"
                      style={{
                        display: loadingPlayer ? "none" : "block",
                      }}
                    />
                  </div>
                )}

                {movie.highlights?.length > 0 && (
                  <>
                    <h3 className="movie-section-title">
                      จุดเด่น
                    </h3>

                    <ul className="movie-highlight-list">
                      {movie.highlights.map(
                        (item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}

                {movie.summary && (
                  <>
                    <h3 className="movie-section-title">
                      สรุป
                    </h3>

                    <p className="movie-summary-text">
                      {movie.summary}
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* RIGHT ADS */}
        <div className="movie-side-ads hide-mobile">
          {rightAds.map((ad) => (
            ad.image && (
              <a
                key={ad._id}
                href={ad.link}
                target="_blank"
                rel="noreferrer"

              >
                <img
                  src={ad.image}
                  className="movie-ad-img"
                />
              </a>
            )
          ))}
        </div>
      </div>
    </div >
  );
}

export default MovieDetail;