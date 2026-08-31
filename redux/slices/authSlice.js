import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,

  loading: false,
  error: null,
  message: null,

  // Email verification
  verificationEmail: null,
  emailVerificationRequired: false,

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
    // Registration Success
    // =========================

    registrationSuccess: (state, action) => {
      state.loading = false;
      state.error = null;

      state.message =
        action.payload?.message ||
        "Account created successfully. Please verify your email.";

      state.verificationEmail =
        action.payload?.email || null;

      state.emailVerificationRequired = true;

      /*
       * Registration does NOT authenticate the user.
       */
      state.user = null;
      state.isAuthenticated = false;
    },

    // =========================
    // Email Verification Required
    // =========================

    setEmailVerificationRequired: (state, action) => {
      state.emailVerificationRequired =
        action.payload?.required ?? true;

      if (action.payload?.email) {
        state.verificationEmail =
          action.payload.email;
      }
    },

    // =========================
    // Email Verification Success
    // =========================

    emailVerificationSuccess: (state, action) => {
      state.loading = false;
      state.error = null;

      state.message =
        action.payload?.message ||
        "Email verified successfully.";

      state.emailVerificationRequired = false;
      state.verificationEmail = null;
    },

    // =========================
    // Clear Email Verification
    // =========================

    clearEmailVerification: (state) => {
      state.verificationEmail = null;
      state.emailVerificationRequired = false;
    },

    // =========================
    // Forgot Password Success
    // =========================

    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.error = null;

      state.message =
        action.payload?.message ||
        "Password reset OTP sent successfully.";
    },

    // =========================
    // Authentication Success
    // =========================

    authSuccess: (state, action) => {
      state.loading = false;
      state.error = null;

      state.user = action.payload.user || null;
      state.isAuthenticated =
        !!action.payload.user;

      state.message =
        action.payload.message || null;

      /*
       * A successfully authenticated user no longer
       * needs email verification.
       */
      state.emailVerificationRequired = false;
      state.verificationEmail = null;
    },

    // =========================
    // Authentication Failure
    // =========================

    authFailure: (state, action) => {
      state.loading = false;

      state.error =
        action.payload ||
        "Something went wrong.";

      state.message = null;
    },

    // =========================
    // Set User
    // =========================

    setUser: (state, action) => {
      state.user = action.payload;

      state.isAuthenticated =
        !!action.payload;

      state.loading = false;
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
      state.isAuthenticated = false;

      state.loading = false;
      state.error = null;
      state.message = null;

      state.verificationEmail = null;
      state.emailVerificationRequired = false;

      state.resetEmail = null;
      state.otpVerified = false;
    },
  },
});

export const {
  authRequestStart,

  // Registration / email verification
  registrationSuccess,
  setEmailVerificationRequired,
  emailVerificationSuccess,
  clearEmailVerification,

  // Authentication
  authSuccess,
  authFailure,
  setUser,

  // General auth UI
  clearAuthError,
  clearAuthMessage,

  // Password reset
  setResetEmail,
  otpVerificationSuccess,
  resetPasswordSuccess,
  clearPasswordReset,

  // Logout
  logout,

  // Forgot password
  forgotPasswordSuccess,
} = authSlice.actions;

export default authSlice.reducer;
