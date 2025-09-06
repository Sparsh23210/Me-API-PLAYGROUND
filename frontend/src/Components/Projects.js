import React, { useEffect, useState } from "react";
import { getProjects } from "../Api/Api";

const Projects = ({ skillFilter }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects(skillFilter ? { skill: skillFilter } : {})
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, [skillFilter]);

  if (!projects.length) return <p>No projects found.</p>;

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <div key={project._id} className="border p-4 rounded shadow">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <p>{project.description}</p>
          <p><strong>Tech:</strong> {project.tech_stack?.join(", ")}</p>
          <div className="flex gap-2 mt-2">
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noreferrer">GitHub</a>
            )}
            {project.links?.live && (
              <a href={project.links.live} target="_blank" rel="noreferrer">Live</a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;
