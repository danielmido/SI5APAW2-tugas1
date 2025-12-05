import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Helper generic buat handle response array / object (pagination)
function extractList(data) {
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.docs && Array.isArray(data.docs)) return data.docs;
  if (data?.results && Array.isArray(data.results)) return data.results;
  return [];
}

export async function fetchAuthors() {
  const res = await api.get("/authors", { params: { limit: 1000 } });
  return extractList(res.data);
}

export async function createAuthor(payload) {
  const res = await api.post("/authors", payload);
  return res.data;
}

export async function updateAuthor(id, payload) {
  const res = await api.patch(`/authors/${id}`, payload);
  return res.data;
}

export async function deleteAuthor(id) {
  const res = await api.delete(`/authors/${id}`);
  return res.data;
}

export async function fetchBooks() {
  const res = await api.get("/books", { params: { limit: 1000 } });
  return extractList(res.data);
}

export async function createBook(payload) {
  const res = await api.post("/books", payload);
  return res.data;
}

export async function updateBook(id, payload) {
  const res = await api.patch(`/books/${id}`, payload);
  return res.data;
}

export async function deleteBook(id) {
  const res = await api.delete(`/books/${id}`);
  return res.data;
}
