# BookWeave frontend

React + Vite frontend connected to the BookWeave Spring Boot REST API.

## Requirements

- Node.js 20 or later
- BookWeave Spring Boot backend running on `http://localhost:8080`
- MySQL database configured for the backend

## Run locally

1. Start the Spring Boot backend from the `backend/Bookweave` directory.
2. Open a terminal in this frontend directory.
3. Install dependencies and start Vite:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Vite proxies `/api/*` and `/uploads/*` to `http://localhost:8080`, so local development does not require a separate CORS configuration.

## Connected API routes

- `POST /api/auth/login`
- `GET /api/books`
- `POST /api/bookSubmissions`
- `GET /api/admin/book`
- `POST /api/admin/book`
- `PUT /api/admin/book/{id}`
- `PATCH /api/admin/book/{id}/published?published=true|false`
- `GET /api/admin/bookSubmissions`
- `PATCH /api/admin/bookSubmission/{id}/status`

Admin requests automatically send `Authorization: Bearer <token>` after login. The token is stored in browser local storage and removed on logout.

## Production API URL

For a separately hosted backend, set `VITE_API_BASE_URL` in a `.env` file to the backend origin, for example:

```env
VITE_API_BASE_URL=https://api.example.com
```

When frontend and backend are hosted on different origins, configure CORS on the backend for the deployed frontend origin.

## Important

- The admin routes are hidden behind a frontend login guard, but the backend remains the real security boundary and enforces `ROLE_ADMIN`.
- Public book browsing and public book submission do not send the admin token.
- Book cover images are loaded from the backend `/uploads/books/...` resource path.
- The backend currently has no delete-book API, so the frontend does not display a fake delete action.
