import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/",
});

export const uploadFile = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/upload", form);
};

export const getDocuments = () => api.get("/upload");

export const summarizeDoc = (documentId) =>
  api.post("/summarize", { documentId });

export const askQuestion = (documentId, question) =>
  api.post("/ask", { documentId, question });

export const getChatHistory = (documentId) =>
  api.get(`/history?documentId=${documentId}`);