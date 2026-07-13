import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContinueWatching } from "../utils/continueWatching";

function ContinueWatching() {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setMovies(getContinueWatching());
    }, []);

    if (movies.length === 0) return null;

    return (
        <div style={styles.wrapper}>
            <h2 style={styles.title}>ดูต่อจากที่ค้างไว้</h2>

            <div style={styles.grid}>
                {movies.map((movie) => {
                    const percent =
                        movie.duration > 0
                            ? Math.min(
                                100,
                                (movie.time / movie.duration) * 100
                            )
                            : 0;

                    return (
                        <div
                            key={movie.slug}
                            style={styles.card}
                            onClick={() =>
                                navigate(`/movie/${movie.slug}`)
                            }
                        >
                            <img
                                src={movie.image}
                                alt={movie.title}
                                style={styles.image}
                            />

                            <div style={styles.info}>
                                <div style={styles.movieTitle}>
                                    {movie.title}
                                </div>

                                <div style={styles.progressBg}>
                                    <div
                                        style={{
                                            ...styles.progress,
                                            width: `${percent}%`,
                                        }}
                                    />
                                </div>

                                <div style={styles.time}>
                                    {formatTime(movie.time)} วินาที
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function formatTime(seconds) {
    seconds = Math.floor(seconds);

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
        return `${h} ชม. ${m} นาที`;
    }

    if (m > 0) {
        return `${m} นาที ${s} วินาที`;
    }

    return `${s} วินาที`;
}

const styles = {
    wrapper: {
        marginTop: 40,
        marginBottom: 40,
    },

    title: {
        color: "#fff",
        marginBottom: 20,
        fontSize: 26,
        borderLeft: "5px solid #ffd000",
        paddingLeft: 10,
    },

    grid: {
        display: "flex",
        gap: 20,
        overflowX: "auto",
    },

    card: {
        width: 220,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "#111",
        borderRadius: 10,
        overflow: "hidden",
    },

    image: {
        width: "100%",
        borderRadius: 10,
    },

    info: {
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        flex: 1,
    },

    movieTitle: {
        color: "#fff",
        fontWeight: "bold",

        lineHeight: "22px",

        height: "44px",

        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,

        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    progressBg: {
        width: "100%",
        height: 6,
        marginTop: "auto",
        background: "#333",
        borderRadius: 99,
    },

    progress: {
        height: "100%",
        background: "#ffd000",
        borderRadius: 10,
    },

    time: {
        color: "#999",
        marginTop: 6,
        fontSize: 13,
    },
};

export default ContinueWatching;