import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change if backend is hosted elsewhere
});

export default API;

// Profile
export const getProfile = () => API.get("/profile");

// Projects
export const getProjects = (params = {}) => API.get("/projects", { params });
export const getProjectById = (id) => API.get(`/projects/${id}`);

// Skills
export const getSkills = (params = {}) => API.get("/skills", { params });
export const getSkillCategories = () => API.get("/skills/categories");

// Search
export const searchAll = (query) => API.get("/search", { params: { q: query } });
export const searchProjectsBySkill = (skill) =>
  API.get("/search/projects", { params: { skill } }); // ✅ corrected to /projects
