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

  return (
    <div style={styles.wrapper}>
      <div
        ref={trackRef}
        style={styles.track}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {movies.map((movie) => (
          <Link
            key={movie._id}
            to={`/movie/${movie._id}`}
          >
            <img
              src={movie.image || "/no-image.jpg"}
              alt={movie.title}
              style={styles.image}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
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
  }
};

export default Carousel;