import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  Home,
  Browse,
  BookDetails,
  Submit,
  About,
  Contact,
} from "../pages/public";
import {
  AdminLogin,
  AdminDashboard,
  AdminBooks,
  AdminAddBook,
  AdminSubmissions,
  AdminSettings,
  Published,
} from "../pages/admin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<Browse />} />
      <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<AdminBooks />} />
        <Route path="/admin/books/new" element={<AdminAddBook />} />
        <Route path="/admin/books/:id/edit" element={<AdminAddBook edit />} />
        <Route path="/admin/submissions" element={<AdminSubmissions />} />
        <Route path="/admin/published" element={<Published />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
