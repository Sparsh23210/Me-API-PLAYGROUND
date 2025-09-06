// schema.js - All MongoDB Schemas & Models
const mongoose = require("mongoose");

// ================== Profile Schema ==================
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    bio: { type: String, trim: true },
    location: { type: String, trim: true },

    github_url: { type: String, trim: true },
    linkedin_url: { type: String, trim: true },
    portfolio_url: { type: String, trim: true },
  },
  { timestamps: true }
);

// ================== Education Schema ==================
const educationSchema = new mongoose.Schema(
  {
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field_of_study: { type: String, trim: true },
    start_date: { type: Date },
    end_date: { type: Date },
    grade: { type: String, trim: true },
  },
  { timestamps: true }
);

// ================== Skill Schema ==================
const skillSchema = new mongoose.Schema(
  {
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, default: "Technical", trim: true, index: true },
    proficiency_level: { type: Number, default: 5, min: 1, max: 10 }, // 1-10 scale
    years_experience: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// ================== Project Schema ==================
const projectSchema = new mongoose.Schema(
  {
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    github_url: { type: String, trim: true },
    live_url: { type: String, trim: true },
    tech_stack: { type: [String], default: [], index: true },
    start_date: { type: Date },
    end_date: { type: Date },
    is_featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// ================== Export Models ==================
const Profile = mongoose.model("Profile", profileSchema);
const Education = mongoose.model("Education", educationSchema);
const Skill = mongoose.model("Skill", skillSchema);
const Project = mongoose.model("Project", projectSchema);

module.exports = {
  Profile,
  Education,
  Skill,
  Project,
};
