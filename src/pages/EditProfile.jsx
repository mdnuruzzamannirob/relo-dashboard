import React, { useState, useEffect } from "react";
import { Camera, Eye, EyeOff, User, Mail } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components & Services
import { FileUploader } from "../components/FileUploader";
import { ProfileSkeleton } from "../components/shimmer/ProfileSkeleton";
import {
  useGetUserInfoQuery,
  useUploadProfileImageMutation,
  useUpdateProfileMutation,
  useAdminChangePasswordMutation, // Added this
} from "../services/allApi";

export default function ProfileManagement() {
  const [activeTab, setActiveTab] = useState("edit-profile");

  // Local State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    avatar: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // RTK Query Hooks
  const { data, error, isLoading, refetch } = useGetUserInfoQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [uploadProfileImage, { isLoading: isUploadingImage }] =
    useUploadProfileImageMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useAdminChangePasswordMutation();

  // Sync API data to local state
  useEffect(() => {
    if (data?.data) {
      setProfileData({
        name: data.data.name || "",
        email: data.data.email || "",
        role: data.data.role || "",
        avatar: data.data.profileImage || "https://via.placeholder.com/150",
      });
    }
  }, [data]);

  // --- HANDLERS ---

  // 1. Handle Profile Image Upload
  const handleAvatarSelect = async (file) => {
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File is too large. Max 2MB allowed.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const toastId = toast.loading("Uploading image...");
    try {
      await uploadProfileImage(formData).unwrap();
      toast.update(toastId, {
        render: "Profile picture updated!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      refetch();
    } catch (err) {
      toast.update(toastId, {
        render: err?.data?.message || "Upload failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // 2. Handle Name Update (FormData with 'data' field)
  const handleUpdateName = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating profile...");

    try {
      const formData = new FormData();
      // Appending nested name field inside 'data' key as requested
      formData.append("data", JSON.stringify({ name: profileData.name }));

      await updateProfile(formData).unwrap();
      toast.update(toastId, {
        render: "Name updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      refetch();
    } catch (err) {
      toast.update(toastId, {
        render: err?.data?.message || "Update failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // 3. Handle Password Change (JSON structure)
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match!");
    }

    const toastId = toast.loading("Changing password...");
    try {
      const payload = {
        oldPassword: passwords.current,
        newPassword: passwords.new,
        confirmNewPassword: passwords.confirm,
      };

      await changePassword(payload).unwrap();

      toast.update(toastId, {
        render: "Password changed successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Clear password fields
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.update(toastId, {
        render: err?.data?.message || "Failed to change password",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (error)
    return <div className="p-10 text-center">Error loading profile data.</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:pt-20 font-sans text-slate-800">
      <ToastContainer theme="colored" />

      {/* Profile Header Card */}
      <div className="w-full max-w-200 bg-[#333333] rounded-[2.5rem] p-8 mb-10 relative flex flex-col items-center shadow-xl">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-200 transition-opacity ${
              isUploadingImage ? "opacity-50" : "opacity-100"
            }`}
          >
            <img
              src={profileData.avatar}
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>

          <FileUploader onFileSelect={handleAvatarSelect} accept="image/*">
            <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors cursor-pointer">
              {isUploadingImage ? (
                <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={16} className="text-slate-700" />
              )}
            </div>
          </FileUploader>
        </div>
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
          <p className="text-gray-400 text-sm uppercase tracking-wider">
            {profileData.role}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 mb-8 border-b border-gray-100 w-full max-w-125 justify-center">
        {["edit-profile", "change-password"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-bold transition-all capitalize ${
              activeTab === tab
                ? "text-slate-800 border-b-2 border-slate-800"
                : "text-gray-400"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Forms Container */}
      <div className="w-full max-w-125 animate-in fade-in slide-in-from-bottom-2 duration-400">
        {activeTab === "edit-profile" ? (
          <form onSubmit={handleUpdateName} className="space-y-6">
            <h3 className="text-center text-lg font-bold text-slate-800 mb-8">
              Edit Profile Details
            </h3>
            <FormInput
              label="Full Name"
              icon={<User size={18} />}
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
            />
            <FormInput
              label="Email Address"
              icon={<Mail size={18} />}
              value={profileData.email}
              readOnly={true}
            />
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-4 bg-[#2D3139] text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:bg-gray-400"
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <h3 className="text-center text-lg font-bold text-slate-800 mb-8">
              Change Password
            </h3>
            <PasswordInput
              label="Current Password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />
            <PasswordInput
              label="New Password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
            />
            <PasswordInput
              label="Confirm New Password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-4 bg-[#2D3139] text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:bg-gray-400"
            >
              {isChangingPassword ? "Saving..." : "Save & Change"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FormInput({ label, value, onChange, icon, readOnly }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-800 ml-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full p-4 pl-12 border rounded-xl outline-none text-sm transition-all ${
            readOnly
              ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed"
              : "bg-white border-gray-300 focus:border-slate-400"
          }`}
        />
        <div className="absolute left-4 inset-y-0 flex items-center text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange }) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-800 ml-1">{label}</label>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:border-slate-400 outline-none text-sm font-mono"
          placeholder="***********"
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-4 inset-y-0 flex items-center text-gray-400"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
