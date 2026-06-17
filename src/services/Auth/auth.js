import {
  startRedirectSignIn,
  signInWithPassword,
  completeSignInWithNewPassword,
  requestPasswordReset,
  submitPasswordReset,
  getCurrentAuthenticatedUser,
  getCurrentSession,
  signOutCurrentUser,
  getAuthProvider,
  signUpWithEmail,
  verifyEmailConfirmation,
} from "./provider";

export const signIn = () => {
  return startRedirectSignIn();
};

export const passwordSignIn = ({ username, password }) => {
  return signInWithPassword({ username, password });
};

export const signUp = ({ email, password }) => {
  return signUpWithEmail({ email, password });
};

export const confirmEmail = ({ tokenHash, type }) => {
  return verifyEmailConfirmation({ tokenHash, type });
};

export const confirmNewPasswordSignIn = ({ newPassword }) => {
  return completeSignInWithNewPassword({ newPassword });
};

export const startPasswordReset = ({ username }) => {
  return requestPasswordReset({ username });
};

export const completePasswordReset = ({ username, confirmationCode, newPassword }) => {
  return submitPasswordReset({ username, confirmationCode, newPassword });
};

export const logOut = () => {
  return signOutCurrentUser().then(() => {
    return null;
  });
};

export const getUser = async () => {
  try {
    const user = await getCurrentAuthenticatedUser();
    const session = await getCurrentSession();

    if (session.tokens) {
      const payload = session.tokens.idToken.payload;
      const provider = getAuthProvider();

      if (provider === "supabase") {
        return {
          ...user,
          given_name: payload.name || user.user_metadata?.given_name || "",
          family_name: user.user_metadata?.family_name || "",
        };
      }

      return {
        ...user,
        given_name: payload.given_name,
        family_name: payload.family_name,
      };
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const getSession = () => {
  return getCurrentSession();
};

export const getAuthToken = async () => {
  const session = await getCurrentSession();
  const accessToken = session.tokens?.accessToken?.toString();
  const idToken = session.tokens?.idToken?.toString();
  const token = accessToken || idToken;

  if (!token) {
    throw new Error("No authentication token available");
  }

  return token;
};

export const validateUser = () => {
  return getCurrentSession({ forceRefresh: true });
};

export const getCurrentAuthProvider = () => {
  return getAuthProvider();
};
