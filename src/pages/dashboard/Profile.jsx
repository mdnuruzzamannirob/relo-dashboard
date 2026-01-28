import { useState } from "react";
import { Camera, Mail, Phone, User, Lock, Save, X } from "lucide-react";
import { toast } from "react-toastify";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    bio: "Full-time merchant",
  });

  const [editProfileData, setEditProfileData] = useState(profileData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        toast.success("Profile image updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!editProfileData.firstName || !editProfileData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    setProfileData(editProfileData);
    setIsEditingProfile(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelProfile = () => {
    setEditProfileData(profileData);
    setIsEditingProfile(false);
  };

  const handleChangePassword = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditingPassword(false);
    toast.success("Password changed successfully!");
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditingPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Card with Image - Enhanced */}
      <div className="bg-linear-to-r from-brand-50 to-brand-100/50 rounded-xl border border-brand-200 p-8">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-brand-200">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-brand-500 text-white p-3 rounded-full cursor-pointer hover:bg-brand-600 transition-all shadow-lg hover:shadow-xl hover:scale-110 transform">
              <Camera size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {profileData.firstName} {profileData.lastName}
          </h2>
          <p className="text-gray-600 text-base mt-2">{profileData.email}</p>
          <p className="text-gray-500 text-sm mt-1 italic">{profileData.bio}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-3 font-semibold transition-all ${
            activeTab === "profile"
              ? "text-brand-500 border-b-2 border-b-brand-500"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User size={18} className="inline mr-2" />
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-3 font-semibold transition-all ${
            activeTab === "password"
              ? "text-brand-500 border-b-2 border-b-brand-500"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Lock size={18} className="inline mr-2" />
          Change Password
        </button>
      </div>

      {/* Edit Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Personal Information
            </h3>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all font-semibold"
              >
                Edit
              </button>
            )}
          </div>

          {!isEditingProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 font-semibold mb-1 uppercase tracking-wide">
                  First Name
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {profileData.firstName}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 font-semibold mb-1 uppercase tracking-wide">
                  Last Name
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {profileData.lastName}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 font-semibold mb-1 uppercase tracking-wide">
                  Email Address
                </p>
                <p className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Mail size={16} className="text-brand-500" />
                  {profileData.email}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 font-semibold mb-1 uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Phone size={16} className="text-brand-500" />
                  {profileData.phone}
                </p>
              </div>
              <div className="md:col-span-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 font-semibold mb-1 uppercase tracking-wide">
                  Location
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {profileData.location}
                </p>
              </div>
              <div className="md:col-span-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600 font-semibold mb-1 uppercase tracking-wide">
                  Bio
                </p>
                <p className="text-lg text-slate-900">{profileData.bio}</p>
              </div>
            </div>
          ) : (
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={editProfileData.firstName}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editProfileData.lastName}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={editProfileData.email}
                  onChange={(e) =>
                    setEditProfileData({
                      ...editProfileData,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                  placeholder="email@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editProfileData.phone}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editProfileData.location}
                    onChange={(e) =>
                      setEditProfileData({
                        ...editProfileData,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={editProfileData.bio}
                  onChange={(e) =>
                    setEditProfileData({
                      ...editProfileData,
                      bio: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all font-semibold"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelProfile}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-all font-semibold"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Change Password
            </h3>
          </div>

          {!isEditingPassword ? (
            <div className="text-center py-8">
              <Lock size={48} className="mx-auto text-brand-500 mb-4" />
              <p className="text-gray-600 mb-6">
                Secure your account by changing your password regularly
              </p>
              <button
                onClick={() => setIsEditingPassword(true)}
                className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all font-semibold"
              >
                Change Password
              </button>
            </div>
          ) : (
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-xs text-blue-700">
                  <strong>Password requirements:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• At least 6 characters long</li>
                    <li>• Mix of uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                  </ul>
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all font-semibold"
                >
                  <Save size={18} />
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={handleCancelPassword}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-all font-semibold"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
