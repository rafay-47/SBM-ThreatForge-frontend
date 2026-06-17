import React, { useState } from "react";
import {
  passwordSignIn,
  confirmNewPasswordSignIn,
  startPasswordReset,
  completePasswordReset,
  getCurrentAuthProvider,
<<<<<<< HEAD
  signUp,
=======
>>>>>>> a4ad6d0627dfd39aa8d0706ed05abae5b1360549
} from "../../services/Auth/auth";
import GenAiButton from "../ThreatModeling/GenAiButton";
import Shield from "../ThreatModeling/images/shield.png";
import { useTheme } from "../ThemeContext";
import styled from "@emotion/styled";
import "./LoginForm.css";

const Title = styled.h1`
  font-size: 26px;
  font-weight: 200;
  margin-bottom: 40px;
`;

const LoginForm = ({ onSignInSuccess }) => {
  const { isDark } = useTheme();
  const isSupabaseAuth = getCurrentAuthProvider() === "supabase";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [formState, setFormState] = useState("signIn");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    requirements: {
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
  });

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements,
    };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    setPasswordValidation(validatePassword(newPassword));
  };

<<<<<<< HEAD
  const handleSignUpPasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordValidation(validatePassword(val));
  };

=======
>>>>>>> a4ad6d0627dfd39aa8d0706ed05abae5b1360549
  const handleSignIn = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    try {
      const { isSignedIn, nextStep } = await passwordSignIn({ username, password });

      if (nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setFormState("newPassword");
      } else if (isSignedIn) {
        onSignInSuccess?.();
      }
    } catch (error) {
      setError(error.message || "Error signing in");
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    try {
      const { isSignedIn } = await confirmNewPasswordSignIn({
        newPassword,
      });
      if (isSignedIn) {
        onSignInSuccess?.();
      }
    } catch (error) {
      setError(error.message || "Error setting new password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    try {
      await startPasswordReset({ username });
      setConfirmNewPassword("");
      setNewPassword("");
      setFormState("resetPassword");
    } catch (error) {
      setError(error.message || "Error initiating password reset");
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleSignUp = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    try {
      if (!passwordValidation.isValid) {
        setError("Password does not meet requirements");
        setLoading(false);
        return;
      }
      const result = await signUp({ email: username, password });
      if (result.emailConfirmationRequired) {
        setFormState("confirmEmail");
      } else {
        onSignInSuccess?.();
      }
    } catch (error) {
      setError(error.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

=======
>>>>>>> a4ad6d0627dfd39aa8d0706ed05abae5b1360549
  return (
    <div className={`login-container ${isDark ? "dark-theme" : "light-theme"}`}>
      {formState === "signIn" && (
        <div className="form-container">
          <img src={Shield} alt="SBM ThreatForge logo" style={{ width: "80px" }} />
          <Title>Welcome back</Title>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label>{isSupabaseAuth ? "Email" : "Username"}</label>
              <input
                type={isSupabaseAuth ? "email" : "text"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="forgot-password-link">
              <a href="#" onClick={() => setFormState("forgotPassword")}>
                Forgot Password?
              </a>
            </div>
            <div className="button-group">
              <GenAiButton loading={loading}>Sign In</GenAiButton>
            </div>
          </form>
<<<<<<< HEAD
          <div className="signup-link">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              onClick={() => {
                setFormState("signUp");
                setError("");
              }}
            >
              Sign Up
            </a>
          </div>
        </div>
      )}

      {formState === "signUp" && (
        <div className="form-container">
          <img src={Shield} alt="SBM ThreatForge logo" style={{ width: "80px" }} />
          <Title>Create Account</Title>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={handleSignUpPasswordChange}
                required
              />
            </div>
            <div className="password-validation">
              <div className={passwordValidation.requirements.minLength ? "valid" : ""}>
                {passwordValidation.requirements.minLength ? "\u2713" : "\u2717"} At least 8
                characters
              </div>
              <div className={passwordValidation.requirements.hasUpperCase ? "valid" : ""}>
                {passwordValidation.requirements.hasUpperCase ? "\u2713" : "\u2717"} One uppercase
                letter
              </div>
              <div className={passwordValidation.requirements.hasLowerCase ? "valid" : ""}>
                {passwordValidation.requirements.hasLowerCase ? "\u2713" : "\u2717"} One lowercase
                letter
              </div>
              <div className={passwordValidation.requirements.hasNumber ? "valid" : ""}>
                {passwordValidation.requirements.hasNumber ? "\u2713" : "\u2717"} One number
              </div>
              <div className={passwordValidation.requirements.hasSpecialChar ? "valid" : ""}>
                {passwordValidation.requirements.hasSpecialChar ? "\u2713" : "\u2717"} One special
                character
              </div>
            </div>
            <div className="button-group">
              <GenAiButton loading={loading} disabled={!passwordValidation.isValid}>
                Create Account
              </GenAiButton>
            </div>
          </form>
          <div className="signup-link">
            Already have an account?{" "}
            <a
              href="#"
              onClick={() => {
                setFormState("signIn");
                setError("");
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      )}

      {formState === "confirmEmail" && (
        <div className="form-container">
          <img src={Shield} alt="SBM ThreatForge logo" style={{ width: "80px" }} />
          <Title>Check Your Email</Title>
          <div className="confirmation-message">
            We&apos;ve sent a confirmation link to <strong>{username}</strong>.
            <br />
            Please check your inbox and click the link to verify your account.
          </div>
          <div className="button-group">
            <GenAiButton onClick={() => setFormState("signIn")}>Back to Sign In</GenAiButton>
          </div>
=======
>>>>>>> a4ad6d0627dfd39aa8d0706ed05abae5b1360549
        </div>
      )}

      {formState === "newPassword" && (
        <div className="form-container">
          <Title>Set New Password</Title>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleNewPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={handlePasswordChange} required />
            </div>
            <div className="button-group">
              <GenAiButton loading={loading} disabled={!passwordValidation.isValid}>
                Set New Password
              </GenAiButton>
            </div>
          </form>
        </div>
      )}

      {formState === "forgotPassword" && (
        <div className="form-container">
          <Title>Reset Password</Title>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label>{isSupabaseAuth ? "Email" : "Username"}</label>
              <input
                type={isSupabaseAuth ? "email" : "text"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <GenAiButton loading={loading}>
                {isSupabaseAuth ? "Send Reset Email" : "Send Reset Code"}
              </GenAiButton>
            </div>
          </form>
        </div>
      )}

      {formState === "resetPassword" && (
        <div className="form-container">
          <Title>Reset Password</Title>
          {error && <div className="error-message">{error}</div>}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              if (newPassword !== confirmNewPassword) {
                setError("Passwords do not match");
                return;
              }
              if (!passwordValidation.isValid) {
                setError("Password does not meet requirements");
                return;
              }
              try {
                await completePasswordReset({
                  username,
                  confirmationCode,
                  newPassword,
                });
                setFormState("signIn");
              } catch (error) {
                setError(error.message || "Error resetting password");
              }
            }}
          >
            <div className="form-group">
              <label>{isSupabaseAuth ? "Recovery Code" : "Confirmation Code"}</label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={handlePasswordChange} required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <GenAiButton
                loading={loading}
                disabled={
                  !passwordValidation.isValid ||
                  !confirmationCode ||
                  newPassword !== confirmNewPassword
                }
              >
                Reset Password
              </GenAiButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
