import { Link } from "react-router-dom";

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL ?? "";

export function Logo({ light = false }) {
  return (
    <Link className={`logo ${light ? "logo-light" : ""}`} to="/">
      <span className="logo-mark">▮</span>
      BookWeave
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Logo />
        <p>Discover stories worth reading.</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <Link to="/books">Browse Books</Link>
        <Link to="/submit">Submit Your Book</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div>
        <h4>Contact</h4>
        <span>hello@bookweave.com</span>
        <span>New Delhi, India</span>
      </div>
      <div className="footer-bottom">© 2026 BookWeave. All rights reserved.</div>
    </footer>
  );
}

export function BookCover({ book, large = false }) {
  const imageUrl = book?.coverImageUrl
    ? (book.coverImageUrl.startsWith("http://") || book.coverImageUrl.startsWith("https://")
        ? book.coverImageUrl
        : `${API_ORIGIN}${book.coverImageUrl}`)
    : null;

  if (imageUrl) {
    return (
      <div className={`book-cover book-cover-image ${large ? "book-cover-large" : ""}`}>
        <img src={imageUrl} alt={`Cover of ${book.title}`} />
      </div>
    );
  }

  return (
    <div className={`book-cover cover-placeholder ${large ? "book-cover-large" : ""}`}>
      <span className="cover-small">BOOKWEAVE</span>
      <strong>{book?.title || "Book cover"}</strong>
      <small>{book?.author || "Book author"}</small>
    </div>
  );
}

export function BookCard({ book }) {
  return (
    <article className="book-card">
      <BookCover book={book} />
      <div className="book-card-body">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <div className="book-meta">
          <span>{book.category}</span>
          <span>{book.publishedAt || "Date unavailable"}</span>
        </div>
        <Link className="btn btn-small" to={`/books/${book.id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}

export function EmptyState({ message = "No books found." }) {
  return (
    <div className="empty-state">
      <div>♧</div>
      <h3>{message}</h3>
      <p>Try again after refreshing the page.</p>
    </div>
  );
}

export function Field({
  label,
  select = false,
  textarea = false,
  options = [],
  ...props
}) {
  return (
    <label className="field">
      <span>{label}{props.required ? " *" : ""}</span>
      {select ? (
        <select {...props}>
          <option value="">Select category</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea rows={5} {...props} />
      ) : (
        <input {...props} />
      )}
    </label>
  );
}

export function Status({ text }) {
  const label = String(text || "UNKNOWN")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return <span className={`status status-${String(text).toLowerCase()}`}>{label}</span>;
}

export function AdminTitle({ title, text, action }) {
  return (
    <div className="admin-title">
      <div>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}

export function LoadingState() {
  return <div className="empty-state"><p>Loading...</p></div>;
}

export function ErrorMessage({ children }) {
  if (!children) return null;
  return <div className="alert error" role="alert">{children}</div>;
}
