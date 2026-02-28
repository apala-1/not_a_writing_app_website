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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setError("Failed to load profile data");
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setImage(file);
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleUpdateProfile = async () => {
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

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
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          router.push(`/user/profile`);
        }, 1500);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">Loading your profile...</p>
        </div>

        <style jsx global>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">
          
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => router.back()}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 group"
            >
              <span className="text-lg transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">Update your profile information and photo</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Profile Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
              Profile Photo
            </label>
            
            <div className="flex flex-col items-center">
              <div className="relative group mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 overflow-hidden border-4 border-white shadow-xl">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.profilePicture ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${user.profilePicture}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200">
                  <svg className="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-white font-medium">Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image actions */}
              <div className="flex gap-3">
                <label className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 cursor-pointer transition-all duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  Upload New Photo
                </label>
                
                {(preview || user?.profilePicture) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all duration-200"
                  >
                    Remove
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Recommended: Square image, at least 400x400px (max 5MB)
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border-2 border-gray-200 bg-gray-100 rounded-xl px-4 py-3.5 text-gray-600 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 hover:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell us a little about yourself..."
                className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 hover:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200 resize-none"
              />
              <p className="text-xs text-gray-500">{bio.length}/500 characters</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="sm:flex-none px-8 py-4 border-2 border-gray-300 bg-white text-gray-700 rounded-xl font-bold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Profile Privacy</p>
                <p className="text-blue-700">Your profile information is private and only visible to you. You can update it anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditProfilePage;