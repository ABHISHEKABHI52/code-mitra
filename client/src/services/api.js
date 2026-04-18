import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const explainCode = (input, lang) => {
  return axios.post(
    `${BASE_URL}/api/explain`,
    { input, lang },
    { timeout: 20000 }
  );
};
