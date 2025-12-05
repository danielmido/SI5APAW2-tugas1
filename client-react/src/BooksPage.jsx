import { useEffect, useState } from "react";
import {
  fetchBooks,
  fetchAuthors,
  createBook,
  updateBook,
  deleteBook,
} from "./api";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({
    title: "",
    year: "",
    price: "",
    author: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [booksData, authorsData] = await Promise.all([
        fetchBooks(),
        fetchAuthors(),
      ]);
      setBooks(booksData);
      setAuthors(authorsData);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(book) {
    setEditingId(book._id);
    setForm({
      title: book.title || "",
      year: book.year || "",
      price: book.price || "",
      author: book.author?._id || book.author || "",
    });
    setError("");
    setMessage("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm({ title: "", year: "", price: "", author: "" });
    setError("");
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.title || !form.author) {
      setError("Title dan author wajib diisi.");
      return;
    }

    const payload = {
      title: form.title,
      year: form.year ? Number(form.year) : undefined,
      price: form.price ? Number(form.price) : undefined,
      author: form.author,
    };

    try {
      setLoading(true);
      if (editingId) {
        await updateBook(editingId, payload);
        setMessage("Buku berhasil di-update.");
      } else {
        await createBook(payload);
        setMessage("Buku baru berhasil ditambahkan.");
      }
      await loadData();
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Gagal menyimpan data buku.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin hapus buku ini?")) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");
      await deleteBook(id);
      setMessage("Buku berhasil dihapus.");
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus buku.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row">
      {/* Form */}
      <div className="col-md-4 mb-3">
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">
              {editingId ? "Edit Book" : "Tambah Book"}
            </h5>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger py-2">{error}</div>
            )}
            {message && (
              <div className="alert alert-success py-2">{message}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  name="title"
                  className="form-control"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Judul buku"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Year</label>
                <input
                  name="year"
                  type="number"
                  className="form-control"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="Tahun terbit"
                  min="0"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Price</label>
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <input
                    name="price"
                    type="number"
                    className="form-control"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Harga"
                    min="0"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Author</label>
                <select
                  name="author"
                  className="form-select"
                  value={form.author}
                  onChange={handleChange}
                >
                  <option value="">-- pilih author --</option>
                  {authors.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {editingId ? "Update" : "Simpan"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancelEdit}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="col-md-8">
        <div className="card shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Daftar Books</h5>
            {loading && (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "5%" }}>#</th>
                    <th>Judul</th>
                    <th>Tahun</th>
                    <th>Harga</th>
                    <th>Author</th>
                    <th style={{ width: "15%" }} className="text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((b, idx) => (
                    <tr key={b._id || idx}>
                      <td>{idx + 1}</td>
                      <td>{b.title}</td>
                      <td>{b.year}</td>
                      <td>
                        {b.price != null
                          ? `Rp ${Number(b.price).toLocaleString("id-ID")}`
                          : "-"}
                      </td>
                      <td>
                        {typeof b.author === "object"
                          ? `${b.author.name} (${b.author.email})`
                          : b.author}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleEdit(b)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(b._id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {books.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="text-center py-3 text-muted">
                        Belum ada data buku.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
