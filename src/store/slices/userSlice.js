import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  preferences: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateUserProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setUserPreferences: (state, action) => {
      state.preferences = action.payload;
    },
    clearAdminData: (state) => {
      state.profile = null;
      state.preferences = {};
    },
  },
});

export const {
  setUserProfile,
  updateUserProfile,
  setUserPreferences,
  clearAdminData,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserPreferences = (state) => state.user.preferences;
