import axios from "axios";
import { BASE_URL } from "../config";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${BASE_URL}/upload/image`, formData);
  return res.data;
};
