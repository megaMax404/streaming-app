import { API_URL } from "../config";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

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
            } else if (resumeTime > 0) {
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
          } else if (resumeTime > 0) {
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
  }, [movie, startMovie, resumeTime, forceRestart]);

  useEffect(() => {
    if (!movie) return;
    const list = getContinueWatching();
    const data = list.find(
      (m) => m.slug === movie.slug
    );
    if (data && data.time > 30) {
      setResumeTime(data.time);
      setShowResumePopup(true);
    } else {
      setResumeTime(0);
    }
  }, [movie]);

  const saveProgress = () => {
    if (!videoRef.current || !movie) return;

    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 0;

    // ดูเกิน 95% ให้ลบออกจาก Continue Watching
    if (duration > 0 && current / duration >= 0.95) {
      saveContinueWatching({
        slug: movie.slug,
        title: movie.title,
        image: movie.image,
        time: 0,
        duration: 0,
      });
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
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          padding: "100px",
        }}
      >
        <h2>กำลังโหลด...</h2>
      </div>
    );
  }

  if (notFound) {
    return (
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          padding: "100px",
        }}
      >
        <h1>404</h1>
        <h2>ไม่พบหนังเรื่องนี้</h2>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            background: "#ffd000",
            cursor: "pointer",
            fontWeight: "bold",
          }}
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

      <div style={styles.page}>

        {/* LEFT ADS */}
        <div
          style={styles.sideAds}
          className="hide-mobile"
        >
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
                  style={styles.adImg}
                  alt="ad"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            )
          ))}
        </div>

        {/* MAIN */}
        <div style={styles.main}>

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
                  style={styles.banner}
                  alt="banner"
                  fetchPriority="high"
                />

              </a>
            )
          ))}

          {/* TITLE */}
          <h2 style={styles.pageTitle}>
            {movie.title}{" "}
            {movie.description}
          </h2>

          {/* TOP */}
          <div style={styles.topSection}>

            {/* POSTER */}
            <img
              src={movie.image ||
                "/no-image.jpg"}
              alt={movie.title}
              style={styles.poster}
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
            <div style={styles.movieInfo}>
              {movie.trailer && (
                <iframe
                  src={movie.trailer}
                  title="Trailer"
                  style={styles.trailer}
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
          <div style={styles.metaCard}>

            <div style={styles.metaItem}>
              <span style={styles.icon}>📅</span>
              <div>
                <small>ปีที่ฉาย</small>
                <strong>{movie.year}</strong>
              </div>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.icon}>⭐</span>
              <div>
                <small>IMDb</small>
                <strong>{movie.rating}</strong>
              </div>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.icon}>👁</span>
              <div>
                <small>เข้าชม</small>
                <strong>{movie.views}</strong>
              </div>
            </div>

          </div>

          <div style={styles.categoryText}>
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

          {/* ARTICLE */}
          <div style={styles.articleBox}>
            <h2 style={styles.articleTitle}>
              เรื่องย่อของ {movie.title}{" "}{movie.description}
            </h2>

            <div style={styles.articleText}>
              {movie.content}
            </div>

            {movie.highlights?.length > 0 && (
              <>
                <h3 style={styles.sectionTitle}>
                  จุดเด่น
                </h3>

                <ul style={styles.highlightList}>
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
                <h3 style={styles.sectionTitle}>
                  สรุป
                </h3>

                <p style={styles.summaryText}>
                  {movie.summary}
                </p>
              </>
            )}
          </div>

          {showResumePopup && (
            <div style={styles.resumePopup}>
              <h2 style={{ color: "#fff" }}>
                เล่นต่อจากเดิม?
              </h2>

              <div style={styles.resumeButtonGroup}>

                <button
                  style={styles.resumePlayButton}
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
                    setShowResumePopup(false);
                    setStartMovie(true);
                  }}
                >
                  ▶ เล่นต่อ
                </button>

                <button
                  style={styles.resumeRestartButton}
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
                    removeContinueWatching(movie.slug);

                    setForceRestart(true);
                    setResumeTime(0);

                    setShowResumePopup(false);
                    setStartMovie(true);
                  }}
                >
                  ↺ เริ่มใหม่
                </button>

                <button
                  style={styles.resumeCloseButton}
                  onClick={() => {
                    setResumeTime(0);
                    setShowResumePopup(false);
                  }}
                >
                  ✕ ปิด
                </button>

              </div>
            </div>
          )}

          {/* VIDEO PLAYER */}
          <h2 style={styles.watchTitle}>
            🎬 ดูหนังออนไลน์
          </h2>

          {videoError ? (
            <div style={styles.startBox}>
              <div>
                <h2 style={{ color: "#fff" }}>
                  ❌ ไม่สามารถโหลดหนังได้
                </h2>

                <p style={{ color: "#999" }}>
                  ไฟล์หนังอาจถูกลบ หรือ URL ไม่ถูกต้อง
                </p>
              </div>
            </div>
          ) : (
            <>
              {!startMovie && !showResumePopup && (
                <div style={styles.startBox}>
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
                    style={styles.playButton}
                    onClick={() => {
                      setVideoError(false);
                      setStartMovie(true);
                    }}
                  >
                    ▶ เริ่มเล่นหนัง
                  </button>
                </div>
              )}

              {startMovie && (
                <>
                  {loadingPlayer && (
                    <div style={styles.loadingBox}>
                      <div style={styles.spinner}></div>

                      <h2 style={styles.loadingText}>
                        กำลังโหลดหนัง...
                      </h2>

                      <p style={styles.loadingSub}>
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
                    style={{
                      ...styles.video,
                      display: loadingPlayer ? "none" : "block",
                    }}
                  />
                </>
              )}
            </>
          )}
        </div>

        {/* RIGHT ADS */}
        <div
          style={styles.sideAds}
          className="hide-mobile"
        >
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
                  style={styles.adImg}
                  alt="ad"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            )
          ))}
        </div>
      </div>
    </div >
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "20px",
    background: "#000",
  },

  main: {
    width: "100%",
    maxWidth: "900px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  banner: {
    width: "100%",
    borderRadius: "10px",
  },

  sideAds: {
    width: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  adImg: {
    width: "100%",
    borderRadius: "10px",
  },

  pageTitle: {
    width: "100%",
    color: "white",
    fontSize: "34px",
    fontWeight: "bold",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "12px",
    textAlign: "left",
    marginBottom: "10px",
  },

  topSection: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "24px",
    alignItems: "stretch",
  },

  poster: {
    width: "100%",
    borderRadius: "18px",
    objectFit: "cover",
    boxShadow: "0 15px 40px rgba(0,0,0,.55)",
    border: "1px solid rgba(255,255,255,.08)",

    transition: "all .35s ease",
    cursor: "pointer",
  },

  movieInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  trailer: {
    width: "100%",
    aspectRatio: "16/9",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "18px",
    boxShadow: "0 18px 50px rgba(0,0,0,.45)",
    background: "#000",

    transition: "all .35s ease",
  },

  metaCard: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "linear-gradient(180deg,#151515,#0d0d0d)",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,.08)",
    padding: "22px",
    boxShadow: "0 12px 35px rgba(0,0,0,.45)",
  },

  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    color: "#fff",
    flex: 1,
    justifyContent: "center",
  },

  icon: {
    width: "58px",
    height: "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1b1b1b",
    borderRadius: "50%",
    fontSize: "28px",
  },

  articleBox: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: "14px",
    padding: "22px",
    textAlign: "left",
  },

  articleTitle: {
    color: "white",
    marginBottom: "15px",
    fontSize: "28px",
  },

  articleText: {
    color: "#ccc",
    lineHeight: 1.9,
    fontSize: "16px",
    whiteSpace: "pre-line",
  },

  watchTitle: {
    color: "white",
    fontSize: "26px",
    borderLeft: "5px solid #ffd000",
    paddingLeft: "10px",
  },

  video: {
    width: "100%",
    aspectRatio: "16/9",
    borderRadius: "18px",
    border: "2px solid #2b2b2b",
    boxShadow: "0 25px 70px rgba(0,0,0,.55)",
    background: "#000",
    transition: ".35s",
  },

  startBox: {
    width: "100%",
    minHeight: "520px",
    background: "#111",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #222",
  },

  playButton: {
    background: "linear-gradient(135deg,#ffd000,#ff9800)",
    color: "#111",
    border: "none",
    borderRadius: "18px",
    padding: "18px 48px",
    fontSize: "22px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all .35s ease",
    boxShadow: "0 12px 35px rgba(255,180,0,.35)",
  },

  sectionTitle: {
    color: "#fff",
    marginTop: "25px",
    marginBottom: "10px",
    fontSize: "22px",
    fontWeight: "700",
  },

  highlightList: {
    color: "#ccc",
    paddingLeft: "24px",
    lineHeight: 2,
    textAlign: "left",
  },

  summaryText: {
    color: "#ccc",
    lineHeight: 1.9,
    fontSize: "16px",
  },

  adPlayer: {
    position: "relative",
  },

  categoryCard: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: "14px",
    padding: "20px",
  },

  categoryTitle: {
    color: "#fff",
    margin: "0 0 14px",
    fontSize: "22px",
    fontWeight: "700",
  },

  categoryWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  categoryChip: {
    background:
      "linear-gradient(90deg,#ffd000,#ffb700)",
    color: "#111",
    fontWeight: "700",
    padding: "10px 16px",
    borderRadius: "999px",
    fontSize: "14px",
  },
  categoryText: {
    color: "#ccc",
    fontSize: "16px",
    textAlign: "left",
    marginTop: "4px",
    marginBottom: "12px",
  },

  tagIcon: {
    marginRight: "8px",
    fontSize: "18px",
  },
  loadingBox: {
    width: "100%",
    minHeight: "520px",
    background: "linear-gradient(180deg,#171717,#0f0f0f)",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    border: "1px solid #333",
  },

  spinner: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    border: "6px solid #2b2b2b",
    borderTop: "6px solid #ffd000",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    color: "#fff",
    fontSize: "30px",
    fontWeight: "700",
  },

  loadingSub: {
    color: "#888",
    fontSize: "16px",
  },

  resumePopup: {
    width: "100%",
    minHeight: "250px",
    background: "linear-gradient(180deg,#181818,#111)",
    borderRadius: "22px",
    border: "1px solid #333",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 25px 70px rgba(0,0,0,.45)",
  },

  resumeButtonGroup: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "18px",
    marginTop: "30px",
    flexWrap: "wrap",
  },

  resumePlayButton: {
    background: "linear-gradient(135deg,#FFD54A,#FFB300)",
    color: "#111",
    border: "none",
    padding: "18px 36px",
    borderRadius: "12px",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "180px",
    transition: ".25s",
    boxShadow: "0 6px 18px rgba(255,193,7,.35)",
  },

  resumeRestartButton: {
    background: "#2a2a2a",
    color: "#fff",
    border: "1px solid #444",
    padding: "18px 36px",
    borderRadius: "12px",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "180px",
    transition: ".25s",
  },

  resumeCloseButton: {
    background: "transparent",
    color: "#999",
    border: "1px solid #555",
    padding: "18px 28px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    transition: ".25s",
  },

  resetButton: {
    background: "#262626",
    color: "#fff",
    border: "1px solid #444",
    padding: "18px 40px",
    borderRadius: "18px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "700",
    transition: ".3s",
  },

};

export default MovieDetail;