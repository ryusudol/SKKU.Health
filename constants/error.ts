import { AuthErrorMessages } from "@/types/error-type";

export const errors: AuthErrorMessages = {
  "auth/user-not-found": "Email or password does not match.",
  "auth/wrong-password": "Email or password does not match.",
  "auth/invalid-login-credentials": "Email or password does not match.",
  "auth/email-already-in-use": "This email is already in use.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/network-request-failed": "Network connection failed.",
  "auth/invalid-email": "Invalid email format.",
  "auth/internal-error": "This is an invalid request.",
  "auth/too-many-requests":
    "There are too many requests. Please refresh your browser.",
};
