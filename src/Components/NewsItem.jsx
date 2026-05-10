const FALLBACK_IMAGE = "/news-placeholder.svg";

const truncateText = (value, maxLength, fallback) => {
  const text = value?.trim() || fallback;

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
};

function NewsItem({ title, description, imageUrl, newsUrl, author, publishedAt, source }) {
  const publishedDate = publishedAt
    ? new Date(publishedAt).toLocaleString()
    : "Unknown time";

  return (
    <article className="my-3 w-100">
      <div className="card position-relative h-100">
        <span className="badge rounded-pill bg-danger position-absolute news-source-badge">
          {source || "Unknown Source"}
        </span>

        <img
  src={imageUrl}
  onError={(e) => {
    e.target.src =
      "/news-placeholder.svg";
  }}
  alt="news"
/>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{truncateText(title, 60, "No Title")}</h5>
          <p className="card-text">{truncateText(description, 120, "No Description")}</p>
          <p className="card-text mt-auto">
            <small className="text-muted">
              By {author || "Unknown"} on {publishedDate}
            </small>
          </p>

          <a
            href={newsUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className={`btn btn-sm btn-primary align-self-start${newsUrl ? "" : " disabled"}`}
            aria-disabled={!newsUrl}
          >
            Read More
          </a>
        </div>
      </div>
    </article>
  );
}

export default NewsItem;
