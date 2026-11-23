import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
  AdminTitle,
  BookCard,
  BookCover,
  EmptyState,
  ErrorMessage,
  Field,
  LoadingState,
  Status,
} from "../../components/common";
import {
  login,
  getAdminBooks,
  getSubmissions,
  createBook,
  updateBook,
  updatePublishedStatus,
  updateSubmissionStatus,
} from "../../services/api";
import { useAuth } from "../../auth/AuthContext";

const categories = [
  "Fiction", "Mystery", "Romance", "Fantasy", "Science Fiction",
  "Biography", "History", "Self Help", "Other",
];

const submissionStatuses = [
  "NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "REJECTED",
];

function useAdminData(loader) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      const result = await loader();
      setData(Array.isArray(result) ? result : []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { data, setData, loading, error, refresh };
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SubmissionTable({ submissions, onStatusChange, compact = false }) {
  const visibleSubmissions = compact ? submissions.slice(0, 5) : submissions;

  if (!visibleSubmissions.length) {
    return <EmptyState message="No submissions have been received yet." />;
  }

  return (
    <div className="table-card">
      <div className="table-heading">
        <h2>{compact ? "Recent Book Submissions" : "Book Submissions"}</h2>
        {compact && <Link to="/admin/submissions">View All →</Link>}
      </div>
      <table>
        <thead>
          <tr>
            <th>Author</th><th>Book Title</th><th>Category</th>
            <th>Status</th><th>Submitted</th>{!compact && <th>Update Status</th>}
          </tr>
        </thead>
        <tbody>
          {visibleSubmissions.map((submission) => (
            <tr key={submission.id}>
              <td>
                <strong>{submission.authorName}</strong>
                <small>{submission.email}</small>
              </td>
              <td>{submission.bookTitle}</td>
              <td>{submission.bookCategory}</td>
              <td><Status text={submission.status} /></td>
              <td>{formatDate(submission.submittedAt)}</td>
              {!compact && (
                <td>
                  <select
                    value={submission.status}
                    onChange={(event) => onStatusChange(submission.id, event.target.value)}
                    aria-label={`Update status for ${submission.bookTitle}`}
                  >
                    {submissionStatuses.map((status) => (
                      <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                    ))}
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminLogin() {
  const navigate = useNavigate();
  const { saveToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({ username, password });
      if (!response?.token) {
        throw new Error("Login response did not contain an authentication token.");
      }

      saveToken(response.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="login-card">
        <Link className="logo" to="/"><span className="logo-mark">▮</span>BookWeave</Link>
        <span className="eyebrow">Secure administration</span>
        <h1>Admin Login</h1>
        <p>Sign in with your administrator credentials.</p>
        <form onSubmit={handleLogin}>
          <ErrorMessage>{error}</ErrorMessage>
          <Field label="Username" value={username} onChange={(event) => setUsername(event.target.value)} required autoComplete="username" />
          <Field label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
          <button className="btn full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const booksState = useAdminData(getAdminBooks);
  const submissionsState = useAdminData(getSubmissions);
  const books = booksState.data;
  const submissions = submissionsState.data;

  return (
    <AdminLayout>
      <div className="admin-content">
        <AdminTitle title="Dashboard" text="Overview of your books and author submissions." />
        <ErrorMessage>{booksState.error || submissionsState.error}</ErrorMessage>
        <div className="stats">
          {[
            [books.length, "Total Books"],
            [books.filter((book) => book.published).length, "Published Books"],
            [books.filter((book) => !book.published).length, "Unpublished Books"],
            [submissions.filter((item) => item.status === "NEW").length, "New Submissions"],
          ].map(([number, label]) => (
            <div className="stat" key={label}><strong>{number}</strong><span>{label}</span></div>
          ))}
        </div>
        {booksState.loading || submissionsState.loading ? <LoadingState /> : (
          <div className="admin-grid-2">
            <SubmissionTable submissions={submissions} compact />
            <div className="recent-books">
              <h2>Recent Books</h2>
              {books.slice(0, 5).map((book) => (
                <div className="mini-book" key={book.id}>
                  <BookCover book={book} />
                  <div><strong>{book.title}</strong><span>{book.author}</span></div>
                </div>
              ))}
              {!books.length && <p>No books uploaded yet.</p>}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export function AdminBooks() {
  const { data: books, loading, error, refresh } = useAdminData(getAdminBooks);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionError, setActionError] = useState("");

  const filteredBooks = useMemo(() => books.filter((book) => {
    const matchesQuery = `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" ? book.published : !book.published);
    return matchesQuery && matchesStatus;
  }), [books, query, statusFilter]);

  async function togglePublished(book) {
    setActionError("");
    try {
      await updatePublishedStatus(book.id, !book.published);
      await refresh();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  }

  return (
    <AdminLayout>
      <div className="admin-content">
        <AdminTitle
          title="Books Management"
          text="Manage the books stored in your BookWeave database."
          action={<Link className="btn" to="/admin/books/new">+ Add Book</Link>}
        />
        <ErrorMessage>{error || actionError}</ErrorMessage>
        <div className="admin-filters">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="⌕ Search books..." />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="UNPUBLISHED">Unpublished</option>
          </select>
        </div>
        {loading ? <LoadingState /> : !filteredBooks.length ? <EmptyState message="No matching books found." /> : (
          <div className="table-card">
            <table>
              <thead>
                <tr><th>Book</th><th>Author</th><th>Category</th><th>Published Date</th><th>Uploaded</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td><div className="table-book"><BookCover book={book} /><strong>{book.title}</strong></div></td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{formatDate(book.publishedAt)}</td>
                    <td>{formatDate(book.uploadedAt)}</td>
                    <td><Status text={book.published ? "PUBLISHED" : "UNPUBLISHED"} /></td>
                                    
                <td>
                  <div className="book-row-actions">
                    <Link
                      className="book-action book-action-edit"
                      to={`/admin/books/${book.id}/edit`}
                    >
                      <span aria-hidden="true">✎</span>
                      Edit
                    </Link>

                    <button
                      className={`book-action ${
                        book.published
                          ? "book-action-unpublish"
                          : "book-action-publish"
                      }`}
                      type="button"
                      onClick={() => togglePublished(book)}
                    >
                      <span aria-hidden="true">
                        {book.published ? "◉" : "↗"}
                      </span>
                      {book.published ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export function AdminAddBook({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: books, loading: booksLoading, error: loadError } = useAdminData(getAdminBooks);
  const existingBook = books.find((book) => String(book.id) === id);

  const [form, setForm] = useState({
    title: "", author: "", category: "", description: "", publishedAt: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (edit && existingBook && !initialized) {
      setForm({
        title: existingBook.title || "",
        author: existingBook.author || "",
        category: existingBook.category || "",
        description: existingBook.description || "",
        publishedAt: existingBook.publishedAt || "",
      });
      setInitialized(true);
    }
  }, [edit, existingBook, initialized]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");

    if (!edit && !coverImage) {
      setError("Please select a cover image.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        publishedAt: form.publishedAt || null,
      };

      if (edit) {
        await updateBook(id, payload, coverImage);
      } else {
        await createBook(payload, coverImage);
      }
      navigate("/admin/books", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  if (edit && booksLoading) {
    return <AdminLayout><div className="admin-content"><LoadingState /></div></AdminLayout>;
  }

  if (edit && !existingBook && !booksLoading) {
    return <AdminLayout><div className="admin-content"><ErrorMessage>{loadError || "Book not found."}</ErrorMessage><Link to="/admin/books">Back to books</Link></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="admin-content narrow">
        <AdminTitle
          title={edit ? "Edit Book" : "Add New Book"}
          text={edit ? "Update the book details and optional cover image." : "Add a book to your collection."}
        />
        <form className="admin-form" onSubmit={handleSave}>
          <ErrorMessage>{error || loadError}</ErrorMessage>
          <Field label="Book Title" name="title" value={form.title} onChange={updateField} required maxLength={200} />
          <Field label="Author" name="author" value={form.author} onChange={updateField} required maxLength={100} />
          <div className="form-row">
            <Field label="Category" name="category" select value={form.category} onChange={updateField} options={categories} required />
            <Field label="Publication Date" name="publishedAt" type="date" value={form.publishedAt} onChange={updateField} />
          </div>
          <Field label="Description" name="description" textarea value={form.description} onChange={updateField} required maxLength={5000} />
          <label className="upload">
            <span>Cover Image {edit ? "(optional)" : "*"}</span>
            <div className="dropzone">
              ⇧<strong>{coverImage ? coverImage.name : "Choose a cover image"}</strong>
              <small>JPG, PNG or WebP</small>
            </div>
            <input type="file" accept="image/*" onChange={(event) => setCoverImage(event.target.files?.[0] || null)} />
          </label>
          <div className="admin-actions">
            <Link className="btn btn-outline" to="/admin/books">Cancel</Link>
            <button className="btn" disabled={saving}>
              {saving ? "Saving..." : edit ? "Save Changes" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export function AdminSubmissions() {
  const { data, loading, error, refresh } = useAdminData(getSubmissions);
  const [actionError, setActionError] = useState("");

  async function handleStatusChange(id, status) {
    setActionError("");
    try {
      await updateSubmissionStatus(id, status);
      await refresh();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  }

  return (
    <AdminLayout>
      <div className="admin-content">
        <AdminTitle title="Book Submissions" text="Review author submissions and update their status." />
        <ErrorMessage>{error || actionError}</ErrorMessage>
        {loading ? <LoadingState /> : (
          <SubmissionTable submissions={data} onStatusChange={handleStatusChange} />
        )}
      </div>
    </AdminLayout>
  );
}

export function AdminSettings() {
  return (
    <AdminLayout>
      <div className="admin-content narrow">
        <AdminTitle title="Settings" text="Administrator settings are managed by the backend." />
        <div className="settings-card">
          <h2>Admin Account</h2>
          <p>Use your configured administrator username and password to sign in.</p>
          <p>For security, account credentials are not displayed or edited here.</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export function Published() {
  const { data: books, loading, error } = useAdminData(getAdminBooks);
  const publishedBooks = books.filter((book) => book.published);

  return (
    <AdminLayout>
      <div className="admin-content">
        <AdminTitle title="Published Books" text="Books currently visible on the public website." />
        <ErrorMessage>{error}</ErrorMessage>
        {loading ? <LoadingState /> : publishedBooks.length ? (
          <div className="book-grid admin-book-grid">
            {publishedBooks.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        ) : <EmptyState message="There are no published books yet." />}
      </div>
    </AdminLayout>
  );
}
