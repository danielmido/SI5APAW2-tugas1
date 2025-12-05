import { useEffect, useState } from "react";
import {
  fetchAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "./api";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadAuthors() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAuthors();
      setAuthors(data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data author.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(author) {
    setEditingId(author._id);
    setForm({
      name: author.name || "",
      email: author.email || "",
      bio: author.bio || "",
    });
    setError("");
    setMessage("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm({ name: "", email: "", bio: "" });
    setError("");
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name || !form.email) {
      setError("Name dan email wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await updateAuthor(editingId, form);
        setMessage("Author berhasil di-update.");
      } else {
        await createAuthor(form);
        setMessage("Author baru berhasil ditambahkan.");
      }
      await loadAuthors();
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Gagal menyimpan data author.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin hapus author ini?")) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");
      await deleteAuthor(id);
      setMessage("Author berhasil dihapus.");
      await loadAuthors();
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus author.");
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
              {editingId ? "Edit Author" : "Tambah Author"}
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
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama author"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  className="form-control"
                  rows="3"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Deskripsi singkat"
                />
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
            <h5 className="card-title mb-0">Daftar Authors</h5>
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
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Bio</th>
                    <th style={{ width: "15%" }} className="text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((a, idx) => (
                    <tr key={a._id || idx}>
                      <td>{idx + 1}</td>
                      <td>{a.name}</td>
                      <td>{a.email}</td>
                      <td style={{ maxWidth: 250 }}>{a.bio}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleEdit(a)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(a._id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {authors.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" className="text-center py-3 text-muted">
                        Belum ada data author.
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
