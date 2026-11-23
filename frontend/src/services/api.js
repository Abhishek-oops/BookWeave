const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function getAuthHeaders() {
  const token = localStorage.getItem("bookweave_token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

async function request(path, options = {}, { authenticated = false } = {}) {
  const headers = new Headers(options.headers || {});

  if (authenticated) {
    const authHeaders = getAuthHeaders();
    Object.entries(authHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();
  let responseBody = null;

  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }

  if (!response.ok) {
    const validationErrors = responseBody?.error;
    const validationMessage =
      validationErrors && typeof validationErrors === "object"
        ? Object.values(validationErrors).join(" ")
        : null;

    throw new Error(
      validationMessage ||
        responseBody?.message ||
        responseBody?.error ||
        `Request failed with status ${response.status}.`,
    );
  }

  return responseBody;
}

export function login(credentials) {
  return request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export function getPublishedBooks() {
  return request("/api/books");
}

export function submitBook(payload) {
  return request("/api/bookSubmissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function getAdminBooks() {
  return request("/api/admin/book", {}, { authenticated: true });
}

export function createBook(book, coverImage) {
  const formData = new FormData();
  formData.append(
    "book",
    new Blob([JSON.stringify(book)], { type: "application/json" }),
  );
  formData.append("coverImage", coverImage);

  return request(
    "/api/admin/book",
    { method: "POST", body: formData },
    { authenticated: true },
  );
}

export function updateBook(id, book, coverImage) {
  const formData = new FormData();
  formData.append(
    "book",
    new Blob([JSON.stringify(book)], { type: "application/json" }),
  );

  if (coverImage) {
    formData.append("coverImage", coverImage);
  }

  return request(
    `/api/admin/book/${id}`,
    { method: "PUT", body: formData },
    { authenticated: true },
  );
}

export function updatePublishedStatus(id, published) {
  const query = new URLSearchParams({ published: String(published) });

  return request(
    `/api/admin/book/${id}/published?${query}`,
    { method: "PATCH" },
    { authenticated: true },
  );
}

export function getSubmissions() {
  return request(
    "/api/admin/bookSubmissions",
    {},
    { authenticated: true },
  );
}

export function updateSubmissionStatus(id, status) {
  return request(
    `/api/admin/bookSubmission/${id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
    { authenticated: true },
  );
}
