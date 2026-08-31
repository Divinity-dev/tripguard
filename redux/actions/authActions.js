import API from "../../axios";

import {
  authRequestStart,
  authSuccess,
  authFailure,
  logout,
  setUser,
  setResetEmail,
  otpVerificationSuccess,
  resetPasswordSuccess,
  forgotPasswordSuccess,
} from "../slices/authSlice";

// =========================
// Register
// =========================

export const registerUser = (formData) => async (dispatch) => {
  try {
    dispatch(authRequestStart());

    const response = await API.post(
      "/auth/register",
      formData
    );

    /*
     * IMPORTANT:
     * Registration no longer authenticates the user.
     *
     * The backend creates the account as unverified and
     * sends a verification email.
     *
     * Therefore, do NOT dispatch authSuccess here.
     */
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Unable to create account.";

    dispatch(authFailure(message));

    throw new Error(message);
  }
};

// =========================
// Verify Email
// =========================

export const verifyEmail =
  (token, email) => async (dispatch) => {
    try {
      dispatch(authRequestStart());

      const response = await API.get(
        "/auth/verify-email",
        {
          params: {
            token,
            email,
          },
        }
      );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to verify your email address.";

      dispatch(authFailure(message));

      throw new Error(message);
    }
  };

// =========================
// Resend Verification Email
// =========================

export const resendVerificationEmail =
  (email) => async (dispatch) => {
    try {
      dispatch(authRequestStart());

      const response = await API.post(
        "/auth/resend-verification",
        {
          email,
        }
      );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to resend verification email.";

      dispatch(authFailure(message));

      throw new Error(message);
    }
  };

// =========================
// Login
// =========================

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(authRequestStart());

    const response = await API.post(
      "/auth/login",
      credentials
    );

    // Authentication cookie is set by the backend.
    // No JWT is stored in localStorage.
    dispatch(authSuccess(response.data));

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Unable to log in.";

    dispatch(authFailure(message));

    /*
     * Preserve the complete backend response so the UI can
     * determine whether the user needs email verification.
     */
    const verificationRequired =
      error.response?.data?.emailVerificationRequired;

    const verificationError = new Error(message);

    verificationError.emailVerificationRequired =
      verificationRequired || false;

    verificationError.email =
      credentials.email;

    throw verificationError;
  }
};

// =========================
// Get Current User
// =========================

export const getCurrentUser = () => async (dispatch) => {
  try {
    const response = await API.get("/auth/me");

    dispatch(setUser(response.data.user));

    return response.data;
  } catch (error) {
    console.error(
      "Failed to get current user:",
      error.response?.data || error.message
    );

    return null;
  }
};

// =========================
// Logout
// =========================

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(authRequestStart());

    const response = await API.post("/auth/logout");

    // Backend clears the authentication cookie.
    // Redux authentication state is cleared here.
    dispatch(logout());

    return response.data;
  } catch (error) {
    // Clear local Redux authentication state even if
    // the server-side logout request fails.
    dispatch(logout());

    throw error;
  }
};

// =========================
// Forgot Password
// =========================

export const requestPasswordReset =
  (email) => async (dispatch) => {
    try {
      dispatch(authRequestStart());

      const response = await API.post(
        "/auth/forgot-password",
        { email }
      );

      dispatch(setResetEmail(email));

      dispatch(
        forgotPasswordSuccess({
          message: response.data.message,
        })
      );

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to process password reset request.";

      dispatch(authFailure(message));

      throw new Error(message);
    }
  };

// =========================
// Verify OTP
// =========================

export const verifyResetOtp =
  (email, otp) => async (dispatch) => {
    try {
      dispatch(authRequestStart());

      const response = await API.post(
        "/auth/verify-reset-otp",
        {
          email,
          otp,
        }
      );

      dispatch(otpVerificationSuccess(response.data));

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to verify OTP.";

      dispatch(authFailure(message));

      throw new Error(message);
    }
  };

// =========================
// Reset Password
// =========================

export const resetPassword =
  (email, newPassword) => async (dispatch) => {
    try {
      dispatch(authRequestStart());

      const response = await API.post(
        "/auth/reset-password",
        {
          email,
          newPassword,
        }
      );

      dispatch(resetPasswordSuccess(response.data));

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to reset password.";

      dispatch(authFailure(message));

      throw new Error(message);
    }
  };
