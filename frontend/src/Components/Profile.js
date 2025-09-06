import React, { useEffect, useState } from "react";
import { getProfile } from "../Api/Api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="border p-4 rounded shadow mb-6">
      <h2 className="text-2xl font-semibold">{profile.name}</h2>
      <p className="text-gray-600">{profile.bio}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Location:</strong> {profile.location}</p>
      <div className="flex gap-4 mt-2">
        {profile.links?.github && (
          <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
        )}
        {profile.links?.linkedin && (
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        )}
        {profile.links?.portfolio && (
          <a href={profile.links.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
        )}
      </div>
    </div>
  );
};

export default Profile;
