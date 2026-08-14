import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,

  loading: false,
  error: null,
  message: null,

  // Password reset
  resetEmail: null,
  otpVerified: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // =========================
    // Request Started
    // =========================

    authRequestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    // =========================
    // Authentication Success
    // =========================

    authSuccess: (state, action) => {
      state.loading = false;
      state.error = null;

      state.user = action.payload.user || null;
      state.token = action.payload.token || null;

      state.isAuthenticated = true;

      state.message = action.payload.message || null;
    },

    // =========================
    // Authentication Failure
    // =========================

    authFailure: (state, action) => {
      state.loading = false;
      state.error =
        action.payload || "Something went wrong.";
      state.message = null;
    },

    // =========================
    // Set User
    // =========================

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    // =========================
    // Set Token
    // =========================

    setToken: (state, action) => {
      state.token = action.payload;
    },

    // =========================
    // Clear Auth Error
    // =========================

    clearAuthError: (state) => {
      state.error = null;
    },

    // =========================
    // Clear Auth Message
    // =========================

    clearAuthMessage: (state) => {
      state.message = null;
    },

    // =========================
    // Password Reset
    // =========================

    setResetEmail: (state, action) => {
      state.resetEmail = action.payload;
    },

    otpVerificationSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.otpVerified = true;
      state.message =
        action.payload?.message ||
        "OTP verified successfully.";
    },

    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.message =
        action.payload?.message ||
        "Password reset successfully.";

      state.resetEmail = null;
      state.otpVerified = false;
    },

    clearPasswordReset: (state) => {
      state.resetEmail = null;
      state.otpVerified = false;
    },

    // =========================
    // Logout
    // =========================

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      state.loading = false;
      state.error = null;
      state.message = null;

      state.resetEmail = null;
      state.otpVerified = false;
    },
  },
});

export const {
  authRequestStart,
  authSuccess,
  authFailure,
  setUser,
  setToken,
  clearAuthError,
  clearAuthMessage,
  setResetEmail,
  otpVerificationSuccess,
  resetPasswordSuccess,
  clearPasswordReset,
  logout,
} = authSlice.actions;

export default authSlice.reducer;