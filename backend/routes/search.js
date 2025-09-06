const express = require("express");
const router = express.Router();
const { Project, Skill } = require("../schema");

// Search projects by skill (moved above "/")
router.get("/project", async (req, res) => {
  try {
    const { skill, featured, limit = 10 } = req.query;
    let query = {};

    if (skill) {
      const regex = new RegExp(skill, "i");
      query.$or = [
        { title: regex },
        { description: regex },
        { tech_stack: { $in: [regex] } }, // ✅ fixed for array field
      ];
    }

    if (featured === "true") {
      query.is_featured = true;
    }

    const projects = await Project.find(query)
      .sort({ is_featured: -1, start_date: -1 })
      .limit(parseInt(limit));

    res.json(projects);
  } catch (error) {
    console.error("Error searching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Global search endpoint
router.get("/", async (req, res) => {
  try {
    const { q, type, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const regex = new RegExp(q.trim(), "i");

    const results = {
      query: q,
      results: { projects: [], skills: [] },
      total: 0,
    };

    // Search projects
    if (!type || type === "projects") {
      const projects = await Project.find({
        $or: [
          { title: regex },
          { description: regex },
          { tech_stack: { $in: [regex] } }, // ✅ fixed
        ],
      })
        .sort({ is_featured: -1, title: 1 })
        .limit(parseInt(limit));

      results.results.projects = projects.map((p) => ({
        type: "project",
        id: p._id,
        name: p.title,
        description: p.description,
        url: p.github_url,
        tech_stack: p.tech_stack,
        is_featured: p.is_featured,
      }));
    }

    // Search skills
    if (!type || type === "skills") {
      const skills = await Skill.find({
        $or: [{ name: regex }, { category: regex }],
      })
        .sort({ proficiency_level: -1, name: 1 })
        .limit(parseInt(limit));

      results.results.skills = skills.map((s) => ({
        type: "skill",
        id: s._id,
        name: s.name,
        description: s.category,
        proficiency_level: s.proficiency_level,
        years_experience: s.years_experience,
      }));
    }

    results.total =
      results.results.projects.length + results.results.skills.length;

    res.json(results);
  } catch (error) {
    console.error("Error performing search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Quick suggestions endpoint
router.get("/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // ✅ escape regex chars
    const regex = new RegExp("^" + safeQ, "i");

    const skillSuggestions = await Skill.find({ name: regex })
      .limit(5)
      .select("name");

    const projectSuggestions = await Project.find({ title: regex })
      .limit(5)
      .select("title");

    const suggestions = [
      ...skillSuggestions.map((s) => ({ suggestion: s.name, type: "skill" })),
      ...projectSuggestions.map((p) => ({
        suggestion: p.title,
        type: "project",
      })),
    ];

    res.json(suggestions);
  } catch (error) {
    console.error("Error getting suggestions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
