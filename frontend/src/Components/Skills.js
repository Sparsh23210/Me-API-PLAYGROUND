import React, { useEffect, useState } from "react";
import { getSkills } from "../Api/Api";

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSkills()
            .then((res) => {
                setSkills(Array.isArray(res.data) ? res.data : res.data.grouped || []);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading skills...</p>;
    if (!skills.length) return <p>No skills found.</p>;

    return (
        <div className="border p-4 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <ul className="grid grid-cols-2 gap-2">
                {skills.map((skill) => (
                    <li key={skill._id} className="p-2 border rounded">
                        <strong>{skill.name}</strong> ({skill.category})  
                        <span className="text-gray-500 ml-2">
                            Level: {skill.proficiency_level}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Skills;
