const express = require("express");
const router = express.Router();
const { Skill, Profile } = require("../schema");

// Get all skills (with optional filters & grouping)
router.get("/", async (req, res) => {
  try {
    const { category, grouped, top } = req.query;
    let query = {};

    if (category) {
      query.category = new RegExp(category, "i");
    }

    let skillsQuery = Skill.find(query).sort({
      proficiency_level: -1,
      years_experience: -1,
    });

    if (top && !isNaN(parseInt(top))) {
      skillsQuery = skillsQuery.limit(parseInt(top));
    }

    const skills = await skillsQuery.exec();

    if (grouped === "true") {
      const groupedSkills = {};
      skills.forEach((skill) => {
        if (!groupedSkills[skill.category]) groupedSkills[skill.category] = [];
        groupedSkills[skill.category].push(skill);
      });
      return res.json({ grouped: true, data: groupedSkills });
    }

    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get top skills
router.get("/top", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const skills = await Skill.find()
      .sort({ proficiency_level: -1, years_experience: -1 })
      .limit(parseInt(limit));

    res.json(skills);
  } catch (error) {
    console.error("Error fetching top skills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all categories with counts
router.get("/categories", async (req, res) => {
  try {
    const categories = await Skill.aggregate([
      { $group: { _id: "$category", skill_count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      categories.map((c) => ({
        category: c._id,
        skill_count: c.skill_count,
      }))
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get skills by category (keep AFTER /categories route!)
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const skills = await Skill.find({
      category: new RegExp(category, "i"),
    }).sort({ proficiency_level: -1, years_experience: -1 });

    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new skill
router.post("/", async (req, res) => {
  try {
    const { name, category, proficiency_level, years_experience } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Skill name is required" });
    }

    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const existingSkill = await Skill.findOne({
      profileId: profile._id,
      name,
    });

    if (existingSkill) {
      return res.status(409).json({ error: "Skill already exists" });
    }

    const skill = new Skill({
      profileId: profile._id,
      name,
      category: category || "Technical",
      proficiency_level: Math.max(0, proficiency_level || 5), // no negatives
      years_experience: Math.max(0, years_experience || 0),   // no negatives
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error("Error creating skill:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update skill
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updates = req.body;
    if (updates.proficiency_level !== undefined) {
      updates.proficiency_level = Math.max(0, updates.proficiency_level);
    }
    if (updates.years_experience !== undefined) {
      updates.years_experience = Math.max(0, updates.years_experience);
    }

    const skill = await Skill.findByIdAndUpdate(id, updates, { new: true });
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json(skill);
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete skill
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    res.json({ message: "Skill deleted successfully", id: skill._id });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
