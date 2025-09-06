const express = require("express");
const router = express.Router();
const { Profile, Education, Skill, Project } = require("../schema");

// Get full profile
router.get("/", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const education = await Education.find({ profileId: profile._id }).sort({
      start_date: -1,
    });

    const skills = await Skill.find({ profileId: profile._id });

    const projects = await Project.find({ profileId: profile._id }).sort({
      is_featured: -1,
      start_date: -1,
    });

    // Group skills by category
    const groupedSkills = {};
    skills.forEach((skill) => {
      if (!groupedSkills[skill.category]) groupedSkills[skill.category] = [];
      groupedSkills[skill.category].push({
        id: skill._id,
        name: skill.name,
        proficiency_level: skill.proficiency_level,
        years_experience: skill.years_experience,
      });
    });

    const response = {
      ...profile.toObject(),
      education,
      skills: groupedSkills,
      projects: projects.map((project) => ({
        ...project.toObject(),
        links: {
          github: project.github_url,
          live: project.live_url,
        },
      })),
      links: {
        github: profile.github_url,
        linkedin: profile.linkedin_url,
        portfolio: profile.portfolio_url,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update profile
router.put("/", async (req, res) => {
  try {
    const updateData = req.body;
    const profile = await Profile.findOneAndUpdate({}, updateData, { new: true });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get basic profile info
router.get("/basic", async (req, res) => {
  try {
    const profile = await Profile.findOne().select("name email bio location");
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    res.json(profile);
  } catch (error) {
    console.error("Error fetching basic profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
