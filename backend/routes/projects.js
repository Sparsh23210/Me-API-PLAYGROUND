const express = require("express");
const router = express.Router();
const { Project, Profile } = require("../schema");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const { skill, featured, limit } = req.query;
    let query = {};

    if (skill) {
      query.tech_stack = { $in: [new RegExp(skill, "i")] }; // ✅ fix for array field
    }

    if (featured === "true") {
      query.is_featured = true;
    }

    let projectsQuery = Project.find(query)
      .sort({ is_featured: -1, start_date: -1 })
      .lean();

    if (limit && !isNaN(parseInt(limit))) {
      projectsQuery = projectsQuery.limit(parseInt(limit));
    }

    const projects = await projectsQuery.exec();

    res.json(
      projects.map((project) => ({
        ...project,
        links: {
          github: project.github_url,
          live: project.live_url,
        },
      }))
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json({
      ...project,
      links: {
        github: project.github_url,
        live: project.live_url,
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new project
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      github_url,
      live_url,
      tech_stack,
      start_date,
      end_date,
      is_featured,
    } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const project = new Project({
      profileId: profile._id,
      title,
      description,
      github_url,
      live_url,
      tech_stack: Array.isArray(tech_stack) ? tech_stack : [],
      start_date,
      end_date,
      is_featured: is_featured || false,
    });

    await project.save();

    res.status(201).json({
      ...project.toObject(),
      links: {
        github: project.github_url,
        live: project.live_url,
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      lean: true,
    });

    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json({
      ...project,
      links: {
        github: project.github_url,
        live: project.live_url,
      },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json({ message: "Project deleted successfully", id: project._id });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
