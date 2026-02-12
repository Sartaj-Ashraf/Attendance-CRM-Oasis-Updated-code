import React from "react";

const ProfileCard = ({ profile, setProfile, onSave }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        name="name"
        value={profile.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full px-4 py-2 rounded-xl border bg-background"
      />

      <input
        type="email"
        name="email"
        value={profile.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full px-4 py-2 rounded-xl border bg-background"
      />

      <input
        type="password"
        name="currentPassword"
        value={profile.currentPassword}
        onChange={handleChange}
        placeholder="Current Password"
        className="w-full px-4 py-2 rounded-xl border bg-background"
      />

      <input
        type="password"
        name="newPassword"
        value={profile.newPassword}
        onChange={handleChange}
        placeholder="New Password"
        className="w-full px-4 py-2 rounded-xl border bg-background"
      />

      <input
        type="password"
        name="confirmPassword"
        value={profile.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm New Password"
        className="w-full px-4 py-2 rounded-xl border bg-background"
      />

      <button
        onClick={onSave}
        className="w-full mt-2 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition"
      >
        Save Profile
      </button>
    </div>
  );
};

export default ProfileCard;
