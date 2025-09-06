import React, { useEffect, useState } from "react";
import { getSkills } from "../Api/Api";

const Search = ({ onSkillSelect }) => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    getSkills()
      .then((res) => setSkills(res.data))
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">Search Projects by Skill:</label>
      <select
        className="border p-2 rounded w-full"
        onChange={(e) => onSkillSelect(e.target.value)}
      >
        <option value="">-- Select Skill --</option>
        {skills.map((skill) => (
          <option key={skill._id} value={skill.name}>
            {skill.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Search;
