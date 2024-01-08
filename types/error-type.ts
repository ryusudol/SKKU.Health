export type AuthErrorMessages = {
  "auth/user-not-found": string;
  "auth/wrong-password": string;
  "auth/invalid-login-credentials": string;
  "auth/email-already-in-use": string;
  "auth/weak-password": string;
  "auth/network-request-failed": string;
  "auth/invalid-email": string;
  "auth/internal-error": string;
  "auth/too-many-requests": string;
  [key: string]: string;
};
