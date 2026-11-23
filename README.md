# BookWeave — Full-stack project

This package contains the React frontend and the Spring Boot backend connected to each other.

## Project structure

```text
BookWeave-Integration/
├── frontend/                 # React + Vite
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    └── Bookweave/             # Spring Boot + MySQL
        ├── src/
        ├── pom.xml
        └── mvnw.cmd
```

## 1. Configure and start the backend

The backend needs these environment variables:

| Variable | Purpose |
|---|---|
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `ADMIN_USERNAME` | Initial admin username (defaults to `admin`) |
| `ADMIN_PASSWORD` | Initial admin password |
| `JWT_SECRET` | Base64-encoded random key (at least 32 decoded bytes) |

In PowerShell, open the backend folder and set values for the current terminal session:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "YOUR_NEW_MYSQL_PASSWORD"
$env:ADMIN_USERNAME = "admin"
$env:ADMIN_PASSWORD = "YOUR_STRONG_ADMIN_PASSWORD"

$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
$rng.Dispose()

.\mvnw.cmd spring-boot:run
```

Keep this terminal open while developing. The backend starts at `http://localhost:8080`.

If you start the backend using IntelliJ's Run button instead, add the same variables under **Run → Edit Configurations → Environment variables**.

The initial admin is created once. If that username already exists in the database, `AdminInitializer` will not reset its password.

## 2. Install and start the frontend

Open a second terminal in the `frontend` folder:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`.

Vite proxies `/api` and `/uploads` to `http://localhost:8080`. For local development, this avoids needing a separate CORS configuration.

## 3. What is connected

### Public website

- Published books are fetched from `GET /api/books`.
- Book details are populated from the published-books API response.
- Public book submissions are saved using `POST /api/bookSubmissions`.
- Cover images load from the backend `/uploads/books/...` path.

### Admin panel

- Login calls `POST /api/auth/login`.
- The JWT returned by the backend is stored in browser local storage.
- Admin API requests automatically send `Authorization: Bearer <token>`.
- Admin can list all books, add books with multipart cover images, edit books, and publish/unpublish books.
- Admin can list submissions and update their status.
- Logout removes the JWT.

The backend enforces `ROLE_ADMIN`. The frontend route guard only improves navigation; it is not a replacement for backend authorization.

## 4. Backend endpoint added

Your original backend did not have an API for the admin panel to list unpublished books. This integration adds:

`GET /api/admin/book`

It returns all books and is protected by the existing `/api/admin/**` `ROLE_ADMIN` rule.

## 5. Important security note

The uploaded original `application.properties` contained a database password in plain text. In this integrated copy, database and admin credentials are read from environment variables instead. Since the old database password was included in the uploaded archive, rotate/change it in MySQL before continuing. Do not commit real database passwords, admin passwords, or JWT secrets.

## 6. Build verification

JavaScript/JSX syntax and local frontend imports were checked. A full Vite production build and Maven build could not be completed in this environment because package/dependency downloads were unavailable. Run the commands above on your computer to install dependencies and verify both applications locally.
