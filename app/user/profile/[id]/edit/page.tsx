"use client";

import axios from "@/lib/api/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  profilePicture?: string;
}

const EditProfilePage = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/v1/auth/me");
        if (res.data.success) {
          const userData = res.data.data;
          setUser(userData);
          setName(userData.name);
          setBio(userData.bio || "");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);

      if (image) {
        formData.append("profilePicture", image);
      }

      const res = await axios.put("/api/v1/auth/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        router.push(`/user/profile`);
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

        <h1 className="text-3xl font-bold mb-8 text-center tracking-wide">
          Edit Profile
        </h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8 relative">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                {preview ? (
                    // If user selected new image → show preview
                    <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    />
                ) : user?.profilePicture ? (
                    // Otherwise show DB image
                    <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${user.profilePicture}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    />
                ) : null}
            </div>

            <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
              <span className="text-sm">Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-6">

          <div>
            <label className="block text-sm mb-2 text-gray-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            />
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="mt-4 bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;