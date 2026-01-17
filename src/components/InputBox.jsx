import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

const Inputbox = ({ label, type, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false); 

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); 
  };

  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type === "password" && !showPassword ? "password" : "text"} 
          id={label}
          name={label}
          value={value}
          onChange={onChange}
          placeholder={type === "password" ? "********" : `Enter your ${label}`}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
    
        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={handleTogglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="w-6 h-6" />
            ) : (
              <Eye className="w-6 h-6" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Inputbox;
