import axios from "@/lib/api/axios";

export const getMyBooks = async () => {
  const res = await axios.get("/api/v1/book");
  return res.data.data;
};

export const createBook = async (formData: FormData) => {
  const res = await axios.post("/api/v1/book", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};