import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import {
  BookCover,
  BookCard,
  EmptyState,
  Field,
  LoadingState,
  ErrorMessage,
} from "../../components/common";
import { getPublishedBooks, submitBook } from "../../services/api";

const fallbackCategories = [
  "Fiction", "Mystery", "Romance", "Fantasy", "Science Fiction",
  "Biography", "History", "Self Help", "Other",
];

function usePublishedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getPublishedBooks()
      .then((data) => {
        if (active) setBooks(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return { books, loading, error };
}

function PageHero({ eyebrow, title, description }) {
  return (
    <div className="page-hero">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export function Home() {
  const { books, loading, error } = usePublishedBooks();
  const featuredBooks = books.slice(0, 4);
  const categories = [...new Set(books.map((book) => book.category).filter(Boolean))];

  return (
    <PublicLayout>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Books connect people.</span>
            <h1>Discover Stories<br /><em>Worth Reading.</em></h1>
            <p>
              BookWeave helps readers discover meaningful books and gives
              authors a place to share their work with the world.
            </p>
            <div className="hero-actions">
              <Link className="btn" to="/books">Explore Books</Link>
              <Link className="btn btn-outline" to="/submit">Submit Your Book</Link>
            </div>
          </div>
          <div className="hero-art">
            {books[0] ? <div className="hero-book"><BookCover book={books[0]} large /></div> : <div className="hero-leaf">✦</div>}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div><span className="eyebrow">Curated for readers</span><h2>Featured Books</h2></div>
            <Link to="/books">View All →</Link>
          </div>
          <ErrorMessage>{error}</ErrorMessage>
          {loading ? <LoadingState /> : featuredBooks.length ? (
            <div className="book-grid featured-grid">
              {featuredBooks.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          ) : <EmptyState message="No published books are available yet." />}
        </section>

        <section className="section category-section">
          <div className="section-heading">
            <div><span className="eyebrow">Find your next read</span><h2>Browse by Category</h2></div>
          </div>
          <div className="category-grid">
            {(categories.length ? categories : fallbackCategories).map((category) => (
              <Link
                key={category}
                to={`/books?category=${encodeURIComponent(category)}`}
                className="category-card"
              >
                <span>▣</span>{category}
              </Link>
            ))}
          </div>
        </section>

        <section className="why section">
          <div className="section-heading">
            <div><span className="eyebrow">Why BookWeave?</span><h2>A place for stories.</h2></div>
          </div>
          <div className="feature-grid">
            {[
              ["◈", "Discover Great Books", "Explore a growing collection of stories worth your time."],
              ["▤", "Submit Your Story", "Give your book a chance to reach new readers."],
              ["▥", "Curated Collection", "Thoughtfully organized books across categories."],
              ["✦", "Simple & Transparent", "A clear submission and review experience."],
            ].map(([icon, title, text]) => (
              <div className="feature" key={title}>
                <span>{icon}</span><h3>{title}</h3><p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-banner">
          <div>
            <span className="eyebrow">For authors</span>
            <h2>Have a book to share?</h2>
            <p>Join our community of authors and share your story with the world.</p>
            <Link className="btn" to="/submit">Submit Your Book</Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export function Browse() {
  const { books, loading, error } = usePublishedBooks();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All Categories");

  const categories = useMemo(
    () => [...new Set(books.map((book) => book.category).filter(Boolean))],
    [books],
  );

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory =
        category === "All Categories" || book.category === category;
      const matchesQuery =
        `${book.title} ${book.author}`.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [books, category, query]);

  return (
    <PublicLayout>
      <main className="page">
        <PageHero
          eyebrow="Discover your next favorite"
          title="Explore Books"
          description="Find your next favorite from our published collection."
        />
        <div className="filters">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="⌕  Search by title or author..."
            aria-label="Search books"
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All Categories</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <ErrorMessage>{error}</ErrorMessage>
        {loading ? <LoadingState /> : filteredBooks.length ? (
          <div className="book-grid">
            {filteredBooks.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        ) : <EmptyState />}
      </main>
    </PublicLayout>
  );
}

export function BookDetails() {
  const { id } = useParams();
  const { books, loading, error } = usePublishedBooks();
  const book = books.find((item) => String(item.id) === id);

  return (
    <PublicLayout>
      <main className="page">
        {loading ? <LoadingState /> : error ? <ErrorMessage>{error}</ErrorMessage> : !book ? (
          <EmptyState message="This book is not available or has not been published." />
        ) : (
          <>
            <section className="details">
              <BookCover book={book} large />
              <div className="details-copy">
                <span className="pill">{book.category}</span>
                <h1>{book.title}</h1>
                <h3>by {book.author}</h3>
                <p className="muted">Published: {book.publishedAt || "Not specified"}</p>
                <p>{book.description}</p>
                <Link className="btn" to="/books">Browse More Books</Link>
              </div>
            </section>
            <section className="about-book">
              <div><span className="eyebrow">About this book</span><h2>A story worth discovering.</h2></div>
              <p>{book.description}</p>
            </section>
          </>
        )}
      </main>
    </PublicLayout>
  );
}

export function Submit() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    authorName: "",
    email: "",
    phone: "",
    bookTitle: "",
    bookCategory: "",
    bookDescription: "",
    message: "",
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await submitBook(form);
      setSent(true);
      setForm({
        authorName: "", email: "", phone: "", bookTitle: "",
        bookCategory: "", bookDescription: "", message: "",
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <main className="page">
        <PageHero
          eyebrow="For authors"
          title="Submit Your Book"
          description="Share your story with the BookWeave community. No login required."
        />
        <div className="form-layout">
          {sent ? (
            <div className="success-card">
              <div className="success-icon">✓</div>
              <h2>Your submission has been received.</h2>
              <p>Thank you. Our team will review your submission.</p>
              <button className="btn" onClick={() => setSent(false)}>Submit Another</button>
            </div>
          ) : (
            <form className="form-card" onSubmit={handleSubmit}>
              <ErrorMessage>{error}</ErrorMessage>
              <div className="form-row">
                <Field label="Author Name" name="authorName" value={form.authorName} onChange={updateField} required maxLength={100} />
                <Field label="Email" type="email" name="email" value={form.email} onChange={updateField} required />
              </div>
              <div className="form-row">
                <Field label="Phone Number" name="phone" value={form.phone} onChange={updateField} required pattern="[0-9]{10}" maxLength={10} />
                <Field label="Book Title" name="bookTitle" value={form.bookTitle} onChange={updateField} required maxLength={200} />
              </div>
              <Field
                label="Category"
                select
                name="bookCategory"
                value={form.bookCategory}
                onChange={updateField}
                required
                options={fallbackCategories}
              />
              <Field label="Book Description" textarea name="bookDescription" value={form.bookDescription} onChange={updateField} required maxLength={5000} />
              <Field label="Message" textarea name="message" value={form.message} onChange={updateField} maxLength={2000} />
              <button className="btn full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Book"}
              </button>
              <p className="form-note">Your submission will be reviewed by the BookWeave team.</p>
            </form>
          )}
          <aside className="form-aside">
            <div className="aside-art">♧</div>
            <h3>Every story deserves a chance to be heard.</h3>
            <p>Send us your details and our team will review your submission.</p>
          </aside>
        </div>
      </main>
    </PublicLayout>
  );
}

export function About() {
  return (
    <PublicLayout>
      <main className="page">
        <PageHero
          eyebrow="Our story"
          title="About BookWeave"
          description="BookWeave connects readers and talented authors through a shared love of stories."
        />
        <section className="about-grid">
          <div className="about-art">BOOK<br />WEAVE</div>
          <div>
            <h2>Our Mission</h2>
            <p>To build a community where great stories find their readers.</p>
            <h2>How BookWeave Works</h2>
            <ol>
              <li>Authors submit their books.</li>
              <li>Our team reviews submissions.</li>
              <li>Selected books are published.</li>
              <li>Readers discover great stories.</li>
            </ol>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export function Contact() {
  return (
    <PublicLayout>
      <main className="page">
        <PageHero
          eyebrow="We'd love to hear from you"
          title="Get in Touch"
          description="Have a question or want to share feedback? Contact the BookWeave team."
        />
        <div className="contact-grid">
          <div>
            <h2>Contact Information</h2>
            <p>✉ hello@bookweave.com</p>
            <p>⌖ New Delhi, India</p>
          </div>
          <div className="form-card">
            <p>For book submissions, please use our submission form.</p>
            <Link className="btn" to="/submit">Submit Your Book</Link>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
