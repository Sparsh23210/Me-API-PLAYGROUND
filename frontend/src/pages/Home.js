import React, { useState } from "react";
import Profile from "../Components/Profile";
import Skills from "../Components/Skills";
import Projects from "../Components/Projects";
import SkillSearch from "../Components/Search";

const Home = () => {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // default tab

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        {["profile", "skills", "projects", "search"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg font-semibold ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "profile" && <Profile />}
        {activeTab === "skills" && <Skills />}
        {activeTab === "projects" && <Projects />}
        {activeTab === "search" && (
          <>
            <SkillSearch onSkillSelect={setSelectedSkill} />
            <Projects skillFilter={selectedSkill} />
          </>
        )}
      </div>
      <div> Health check: http://localhost:5000/api/health</div>
    </div>
  );
};

export default Home;
