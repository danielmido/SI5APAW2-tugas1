import { useState } from "react";
import AuthorsPage from "./AuthorsPage";
import BooksPage from "./BooksPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <span className="navbar-brand fw-semibold">
            Express &amp; React CRUD
          </span>

          <div className="ms-auto">
            <button
              className={`btn me-2 ${
                activeTab === "books" ? "btn-light text-primary" : "btn-outline-light"
              }`}
              onClick={() => setActiveTab("books")}
            >
              Books
            </button>
            <button
              className={`btn ${
                activeTab === "authors" ? "btn-light text-primary" : "btn-outline-light"
              }`}
              onClick={() => setActiveTab("authors")}
            >
              Authors
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mb-4">
        {activeTab === "books" ? <BooksPage /> : <AuthorsPage />}
      </div>

      {/* Footer kecil */}
      <footer className="text-center text-muted py-3 border-top">
        <small>React CRUD menggunakan API Express Tugas 2</small>
      </footer>
    </div>
  );
}
