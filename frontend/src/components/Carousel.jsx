import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Carousel({ movies }) {
  const trackRef = useRef(null);

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 🔁 auto scroll
  useEffect(() => {
    const interval = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;

      const cardWidth = el.querySelector("img")?.clientWidth || 200;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth + 15, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 🖱️ mouse down
  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // 👈 ความไว
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction) => {
    const el = trackRef.current;
    if (!el) return;

    const cardWidth =
      el.querySelector("img")?.clientWidth || 250;

    const amount = cardWidth + 15;

    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div style={styles.wrapper}>
      <button
        style={{ ...styles.arrow, ...styles.leftArrow }}
        onClick={() => scroll("left")}
      >
        ❮
      </button>

      <div
        ref={trackRef}
        style={styles.track}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {movies.map((movie) => (
          <Link key={movie._id} to={`/movie/${movie._id}`}>
            <img
              src={movie.image || "/no-image.jpg"}
              alt={movie.title}
              style={styles.image}
            />
          </Link>
        ))}
      </div>

      <button
        style={{ ...styles.arrow, ...styles.rightArrow }}
        onClick={() => scroll("right")}
      >
        ❯
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    background: "transparent",
    padding: "10px 0"
  },
  track: {
    display: "flex",
    gap: "15px",
    overflowX: "auto",
    cursor: "grab",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    padding: "0 15px",
  },
  image: {
    width: "clamp(180px, 28vw, 320px)",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    borderRadius: "12px",
    flexShrink: 0,
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(180deg,#1b1b1b,#111)",
    boxShadow: "0 0 15px rgba(255,208,0,.15)",
    color: "#ffd000",
    fontSize: "26px",
    cursor: "pointer",
    zIndex: 5,
    transition: "all 0.25s ease",
  },

  leftArrow: {
    left: "10px",
  },

  rightArrow: {
    right: "10px",
  },
};

export default Carousel;