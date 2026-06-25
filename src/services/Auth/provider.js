import { createClient } from "@supabase/supabase-js";
import { amplifyConfig } from "../../config";

const AUTH_PROVIDER = (import.meta.env.VITE_AUTH_PROVIDER || "cognito").toLowerCase();
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_RESET_REDIRECT =
  import.meta.env.VITE_SUPABASE_PASSWORD_RESET_REDIRECT || window.location.origin;

let isInitialized = false;
let supabaseClient = null;
let amplifyModules = null;

const ensureSupportedProvider = () => {
  if (!["cognito", "supabase"].includes(AUTH_PROVIDER)) {
    throw new Error(`Unsupported auth provider: ${AUTH_PROVIDER}`);
  }
};

const loadAmplifyModules = async () => {
  if (!amplifyModules) {
    const [{ Amplify }, auth, cognito] = await Promise.all([
      import("aws-amplify"),
      import("@aws-amplify/auth"),
      import("@aws-amplify/auth/cognito"),
    ]);
    amplifyModules = { Amplify, auth, cognito };
  }
  return amplifyModules;
};

const parseJwtPayload = (token) => {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    const decodedPayload = window.atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
};

const getSupabaseClient = () => {
  if (!supabaseClient) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error(
        "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
      );
    }

    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseClient;
};

export const initializeAuth = async () => {
  if (isInitialized) {
    return;
  }

  ensureSupportedProvider();

  if (AUTH_PROVIDER === "cognito") {
    const { Amplify } = await loadAmplifyModules();
    Amplify.configure(amplifyConfig);
  } else {
    getSupabaseClient();
  }

  isInitialized = true;
};

const ensureInitialized = async () => {
  if (!isInitialized) {
    await initializeAuth();
  }
};

export const startRedirectSignIn = async () => {
  await ensureInitialized();

  if (AUTH_PROVIDER === "supabase") {
    throw new Error("Redirect sign-in is not enabled for Supabase in this UI flow.");
  }

  const { cognito } = await loadAmplifyModules();
  return cognito.signInWithRedirect({ provider: "Cognito" });
};

export const signInWithPassword = async ({ username, password }) => {
  await ensureInitialized();

  if (AUTH_PROVIDER === "supabase") {
    return getSupabaseClient()
      .auth.signInWithPassword({ email: username, password })
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        return {
          isSignedIn: Boolean(data.session),
          nextStep: null,
        };
      });
  }

  const { auth } = await loadAmplifyModules();
  return auth.signIn({ username, password });
};

export const signUpWithEmail = async ({ email, password }) => {
  await ensureInitialized();

  if (AUTH_PROVIDER === "supabase") {
    return getSupabaseClient()
      .auth.signUp({ email, password })
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        return {
          user: data.user,
          session: data.session,
          emailConfirmationRequired: !data.session,
        };
      });
  }

  const { auth } = await loadAmplifyModules();
  return auth
    .signUp({
      username: email,
      password,
      options: { userAttributes: { email } },
    })
    .then((result) => ({
      user: result.user,
      session: null,
      emailConfirmationRequired: result.nextStep?.signUpStep === "CONFIRM_SIGN_UP",
    }));
};

export const completeSignInWithNewPassword = async ({ newPassword }) => {
  await ensureInitialized();

  if (AUTH_PROVIDER === "supabase") {
    return getSupabaseClient()
      .auth.updateUser({ password: newPassword })
      .then(({ error }) => {
        if (error) {
          throw error;
        }

        return { isSignedIn: true };
      });
  }

  const { auth } = await loadAmplifyModules();
  return auth.confirmSignIn({ challengeResponse: newPassword });
};

export const requestPasswordReset = async ({ username }) => {
  await ensureInitialized();

  if (AUTH_PROVIDER === "supabase") {
    return getSupabaseClient().auth.resetPasswordForEmail(username, {
      redirectTo: SUPABASE_RESET_REDIRECT,
    });
  }

  const { auth } = await loadAmplifyModules();
  return auth.resetPassword({ username });
};

export const submitPasswordReset = async ({ username, confirmationCode, newPassword }) => {
  await ensureInitialized();

  if (AUTH_PROVIDER === "supabase") {
    return getSupabaseClient()
      .auth.verifyOtp({
        email: username,
        token: confirmationCode,
        type: "recovery",
      })
      .then(({ error }) => {
        if (error) {
          throw error;
        }

        return getSupabaseClient().auth.updateUser({ password: newPassword });
      })
      .then(({ error }) => {
        if (error) {
          throw error;
        }

        return { isSignedIn: true };
      });
  }

  const { auth } = await loadAmplifyModules();
  return auth.confirmResetPassword({ username, confirmationCode, newPassword });
};

export const getCurrentAuthenticatedUser = async () => {
  await ensureInitialized();

  if (AUTH_PROVIDER === "supabase") {
    return getSupabaseClient()
      .auth.getUser()
      .then(({ data, error }) => {
        if (error || !data.user) {
          throw error || new Error("No authenticated user");
        }

        return data.user;
      });
  }

  const { auth } = await loadAmplifyModules();
  return auth.getCurrentUser();
};

export const getCurrentSession = async (options) => {
  await ensureInitialized();

  if (AUTH_PROVIDER === "supabase") {
    return getSupabaseClient()
      .auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        const session = data.session;
        const idTokenPayload = parseJwtPayload(session?.access_token);

        return {
          tokens: session
            ? {
                accessToken: {
                  toString: () => session.access_token,
                },
                idToken: {
                  toString: () => session.access_token,
                  payload: idTokenPayload || {},
                },
              }
            : undefined,
          rawSession: session,
        };
      });
  }

  const { auth } = await loadAmplifyModules();
  return auth.fetchAuthSession(options);
};

export const signOutCurrentUser = async () => {
  await ensureInitialized();

  if (AUTH_PROVIDER === "supabase") {
    return getSupabaseClient()
      .auth.signOut()
      .then(({ error }) => {
        if (error) {
          throw error;
        }
      });
  }

  const { auth } = await loadAmplifyModules();
  return auth.signOut();
};

export const verifyEmailConfirmation = async ({ tokenHash, type = "signup" }) => {
  await ensureInitialized();

  if (AUTH_PROVIDER === "supabase") {
    return getSupabaseClient()
      .auth.verifyOtp({ token_hash: tokenHash, type })
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        return {
          isSignedIn: Boolean(data.session),
          user: data.user,
        };
      });
  }

  throw new Error("Email confirmation verification is not supported for this auth provider.");
};
export const getAuthProvider = () => AUTH_PROVIDER;
