function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const visiblePages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      Math.abs(i - currentPage) <= 2
    ) {
      visiblePages.push(i);
    }
  }

  return (
    <div className="pagination">

      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        {"<<"}
      </button>

      <button
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(
            Math.max(1, currentPage - 1)
          )
        }
      >
        {"<"}
      </button>

      {visiblePages.map((page, index) => {
        const prev = visiblePages[index - 1];

        return (
          <div
            key={page}
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            {prev &&
              page - prev > 1 && (
                <span
                  style={{
                    color: "#999",
                    padding: "10px",
                  }}
                >
                  ...
                </span>
              )}

            <button
              className={
                currentPage === page
                  ? "active"
                  : ""
              }
              onClick={() =>
                onPageChange(page)
              }
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          onPageChange(
            Math.min(
              totalPages,
              currentPage + 1
            )
          )
        }
      >
        {">"}
      </button>

      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          onPageChange(totalPages)
        }
      >
        {">>"}
      </button>

    </div>
  );
}

export default Pagination;