function TrailerPlayer({ trailer }) {
  return (
    <iframe
      src={trailer}
      title="Trailer"
      className="movie-trailer"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

export default TrailerPlayer;