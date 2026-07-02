import { API_URL } from "../config";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Hls from "hls.js";
import PlayerNavbar from "../components/PlayerNavbar";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [banners, setBanners] = useState([]);
  const [startMovie, setStartMovie] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [videoError, setVideoError] = useState(false);
  // โหลดข้อมูลหนัง

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    axios
      .get(`${API_URL}/api/movies/${id}`)
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
  }, [id]);


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
  }, [id]);

  // เล่น m3u8
  useEffect(() => {
    if (!movie || !startMovie) return;

    if (!videoRef.current) return;

    let hls;

    setVideoError(false);
    setLoadingPlayer(true);

    if (Hls.isSupported()) {
      hls = new Hls({
        maxLoadingDelay: 4,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 2,
        levelLoadingTimeOut: 10000,
        fragLoadingTimeOut: 15000,
      });

      hls.loadSource(movie.video);
      hls.attachMedia(videoRef.current);

      // โหลด playlist สำเร็จ
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoadingPlayer(false);

        videoRef.current
          ?.play()
          .catch(() => { });
      });

      // ถ้าไฟล์เสีย / URL ผิด
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS Error:", data);

        if (data.fatal) {
          setLoadingPlayer(false);
          setVideoError(true);

          hls.destroy();
        }
      });
    } else if (
      videoRef.current.canPlayType(
        "application/vnd.apple.mpegurl"
      )
    ) {
      videoRef.current.src = movie.video;

      videoRef.current.onloadeddata = () => {
        setLoadingPlayer(false);
      };

      videoRef.current.onerror = () => {
        setLoadingPlayer(false);
        setVideoError(true);
      };
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [movie, startMovie]);

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
          onClick={() => window.location.href = "/"}
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

  useEffect(() => {
    console.time("movie-api");

    axios.get(`${API_URL}/api/movies/${id}`)
      .then((res) => {
        setMovie(res.data);
      })
      .finally(() => {
        console.timeEnd("movie-api");
      });
  }, [id]);


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
            />

            {/* TRAILER */}
            <div style={styles.movieInfo}>
              {movie.trailer && (
                <iframe
                  src={movie.trailer ||
                    "/no-image.jpg"}
                  title="Trailer"
                  style={styles.trailer}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
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
              {!startMovie && (
                <div style={styles.startBox}>
                  <button
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
                    onError={() => {
                      setLoadingPlayer(false);
                      setVideoError(true);
                    }}
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
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  poster: {
    width: "260px",
    borderRadius: "12px",
    flexShrink: 0,
  },

  movieInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    minWidth: 0,
  },

  trailer: {
    width: "100%",
    minHeight: "420px",
    border: "none",
    borderRadius: "12px",
    background: "#111",
  },

  metaCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    background: "#111",
    border: "1px solid #222",
    borderRadius: "14px",
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
  },

  metaItem: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "white",
    textAlign: "center",
  },

  icon: {
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
    aspectRatio: "16 / 9",
    minHeight: "520px",
    borderRadius: "14px",
    background: "#000",
    objectFit: "contain",
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
    background:
      "linear-gradient(90deg,#ffd000,#ff9900)",
    border: "none",
    color: "#000",
    fontSize: "24px",
    fontWeight: "bold",
    padding: "20px 45px",
    borderRadius: "14px",
    cursor: "pointer",
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

  skipButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#630000",
    fontWeight: "bold",
    cursor: "pointer",
  },

  adPlayer: {
    position: "relative",
  },

  skipButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#630000",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
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
    background: "#111",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    border: "1px solid #222",
  },

  spinner: {
    width: "70px",
    height: "70px",
    border: "6px solid #333",
    borderTop: "6px solid #ffd000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    color: "#fff",
    fontSize: "28px",
    margin: 0,
  },

  loadingSub: {
    color: "#999",
    margin: 0,
  },

};
if (typeof window !== "undefined" && window.innerWidth <= 768) {
  styles.topSection.flexDirection = "column";
  styles.poster.width = "100%";
  styles.trailer.minHeight = "240px";
}
export default MovieDetail;