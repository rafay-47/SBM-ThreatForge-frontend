import React, { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { getUser, confirmEmail } from "../../services/Auth/auth";
import LoginForm from "../../components/Auth/LoginForm";
import { useTheme } from "../../components/ThemeContext";
// Custom SVG Icons matching the reference design
const DocumentIcon = () => (
  <svg viewBox="0 0 100 100" fill="currentColor">
    <defs>
      <mask id="doc-mask">
        <rect x="0" y="0" width="100" height="100" fill="white" />
        <rect x="25" y="32" width="50" height="8" rx="4" fill="black" />
        <rect x="25" y="47" width="50" height="8" rx="4" fill="black" />
        <rect x="25" y="62" width="35" height="8" rx="4" fill="black" />
      </mask>
    </defs>
    <rect x="10" y="10" width="80" height="80" rx="22" mask="url(#doc-mask)" />
  </svg>
);

const DoubleArrowIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
    {/* Upper Arrow */}
    <path d="M 22 35 L 70 35" />
    <path d="M 54 19 L 70 35 L 54 51" />
    {/* Lower Arrow */}
    <path d="M 22 65 L 70 65" />
    <path d="M 54 49 L 70 65 L 54 81" />
  </svg>
);

const BiohazardIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor">
    <path d="M287.9 112c18.6 0 36.2 3.8 52.8 9.6 15.6 5.5 30.5 13.9 44 24.8-15.5 28.5-24.7 61-24.7 95.6 0 38.6 11.5 74.5 31.1 104.9-38.3 12-83 17.1-131.2 17.1s-92.9-5.1-131.2-17.1c19.6-30.4 31.1-66.3 31.1-104.9 0-34.6-9.2-67.1-24.7-95.6 13.5-10.9 28.4-19.3 44-24.8 16.6-5.8 34.2-9.6 52.8-9.6zM464 240c0-62.9-35.3-117.5-87.3-145.4 12-16 26.6-29.6 43.1-40.4 20-13.1 38.8-21.2 56.2-24.2 3.5-.6 6-3.7 6-7.3v-4.5c0-4.6-4.5-8-8.9-6.6-36.9 12-74.8 41.7-106.8 81.3-33.8-14.8-71.1-23-110.3-23s-76.5 8.2-110.3 23c-32-39.6-69.9-69.3-106.8-81.3-4.4-1.4-8.9 2-8.9 6.6v4.5c0 3.6 2.5 6.7 6 7.3 17.4 3 36.2 11.1 56.2 24.2 16.5 10.8 31.1 24.4 43.1 40.4C55.3 122.5 20 177.1 20 240c0 45 18 85.8 47.2 115.6-22.1 15-46.7 34-60.8 54-1.9 2.7-2.4 6.2-1.3 9.4 1.1 3.2 3.9 5.5 7.3 6 40.3 6.6 86 3.6 130-10.4 27.2 24 61.5 38.9 99.6 43-4.3-18.7-6-37.4-4.8-55.6 1.8-27.1 9.9-52.7 23.3-75.1-41.2-26.3-68.5-72.3-68.5-124.9 0-38.2 14.4-73 38.1-99.3 23.7 26.3 38.1 61.1 38.1 99.3 0 52.6-27.3 98.6-68.5 124.9 13.4 22.4 21.5 48 23.3 75.1 1.2 18.2-.5 36.9-4.8 55.6 38.1-4.1 72.4-19 99.6-43 44 14 89.7 17 130 10.4 3.4-.5 6.2-2.8 7.3-6 1.1-3.2.6-6.7-1.3-9.4-14.1-20-38.7-39-60.8-54 29.2-29.8 47.2-70.6 47.2-115.6z" />
  </svg>
);

const BrainCircuitIcon = () => (
  <svg viewBox="0 0 100 100" fill="currentColor">
    {/* Left hemisphere lobes */}
    <path d="M45 16 C33 16, 22 25, 22 38 C22 43, 25 47, 24 51 C22 55, 23 68, 33 72 C36 73, 40 71, 42 67 L42 61 C40 63, 37 64, 35 63 C30 61, 29 52, 32 49 L34 47 L34 41 L30 38 C28 35, 30 30, 35 30 L40 30 L40 21 L45 21 Z" />
    {/* Right hemisphere lobes */}
    <path d="M55 16 C67 16, 78 25, 78 38 C78 43, 75 47, 76 51 C78 55, 77 68, 67 72 C64 73, 60 71, 58 67 L58 61 C60 63, 63 64, 65 63 C70 61, 71 52, 68 49 L66 47 L66 41 L70 38 C72 35, 70 30, 65 30 L60 30 L60 21 L55 21 Z" />
    {/* Center divider bar representing stem */}
    <rect x="47" y="24" width="6" height="52" rx="3" />
    
    {/* Left circuits */}
    <path d="M 28 34 H 14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="12" cy="34" r="4" />
    
    <path d="M 24 54 H 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="8" cy="54" r="4" />
    
    {/* Right circuits */}
    <path d="M 72 34 H 86" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="88" cy="34" r="4" />
    
    <path d="M 76 54 H 90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="92" cy="54" r="4" />
  </svg>
);

const KnightHelmetIcon = () => (
  <svg viewBox="0 0 100 100" fill="currentColor">
    <defs>
      <mask id="helmet-mask">
        <rect x="0" y="0" width="100" height="100" fill="white" />
        {/* Vertical eye-slit */}
        <rect x="47" y="10" width="6" height="80" rx="3" fill="black" />
        {/* Horizontal eye-slit */}
        <rect x="18" y="44" width="64" height="6" rx="3" fill="black" />
      </mask>
    </defs>
    <path 
      d="M 20 18 L 80 18 L 80 52 C 80 72, 65 84, 50 90 C 35 84, 20 72, 20 52 Z" 
      mask="url(#helmet-mask)" 
    />
  </svg>
);

const LoginPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => (props.isDark ? "#1D1D20" : "#F5F5F4")};
  font-family: Geist, Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
`;

const LoginCard = styled.div`
  display: flex;
  width: min(90vw, 1200px);
  height: min(85vh, 700px);
  min-height: 480px;
  border-radius: 16px;
  box-shadow: ${(props) =>
    props.isDark
      ? `0 4px 12px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3), 0 16px 64px rgba(0, 0, 0, 0.2)`
      : `0 4px 12px rgba(0, 0, 0, 0.12), 0 8px 32px rgba(0, 0, 0, 0.08), 0 16px 64px rgba(0, 0, 0, 0.04)`};
  overflow: hidden;
  position: relative;

  @media (max-width: 900px) {
    flex-direction: column;
    width: min(92vw, 400px);
    height: auto;
    min-height: unset;
    max-height: 90vh;
  }
`;

const LeftSection = styled.div`
  flex: 1.2;
  background: linear-gradient(135deg, #9C3FE4 0%, #2294F7 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: white;
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) {
    flex: none;
    height: auto;
    min-height: 320px;
    max-height: 400px;
    padding: 32px 24px;
  }
`;

const InfoContent = styled.div`
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const IconRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 40px;
  gap: 16px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  color: rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    color: rgba(255, 255, 255, 0.9);
    transform: translateY(-4px) scale(1.05);
    filter: drop-shadow(0 8px 16px rgba(255, 255, 255, 0.15));
  }

  @media (max-width: 900px) {
    width: 48px;
    height: 48px;
  }
`;

const InfoText = styled.p`
  font-family: "Geist", Arial, sans-serif;
  font-size: clamp(14px, 1.3vw, 16px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
  letter-spacing: -0.01em;

  strong {
    font-weight: 600;
    color: #ffffff;
  }
`;

const RightSection = styled.div`
  flex: 0.8;
  background: ${(props) => (props.isDark ? "#18191B" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) {
    flex: none;
    min-height: 400px;
  }
`;

const FormScaleWrapper = styled.div`
  width: 420px;
  max-width: 90%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  flex-shrink: 0;

  @media (max-width: 900px) {
    width: 100%;
    max-width: 340px;
    padding: 20px 0;
  }
`;

const LoginPageInternal = ({ setAuthUser }) => {
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const [confirmationStatus, setConfirmationStatus] = React.useState(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const user = await getUser();
      if (user) {
        setAuthUser();
      }
    } catch {
      // Ignore auth fetch errors on landing page.
    }
  }, [setAuthUser]);

  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (tokenHash && type) {
      confirmEmail({ tokenHash, type })
        .then((result) => {
          if (result.isSignedIn) {
            setAuthUser();
          } else {
            setConfirmationStatus("success");
          }
        })
        .catch(() => {
          setConfirmationStatus("error");
        });
    } else {
      checkAuthStatus();
    }
  }, [searchParams, checkAuthStatus, setAuthUser]);

  const handleSignInSuccess = () => {
    checkAuthStatus();
  };

  return (
    <LoginPageContainer isDark={isDark}>
      <LoginCard isDark={isDark}>
        <LeftSection>
          <InfoContent>
            <IconRow>
              <IconWrapper title="Threat Input">
                <DocumentIcon />
              </IconWrapper>
              <IconWrapper title="Data Flow">
                <DoubleArrowIcon />
              </IconWrapper>
              <IconWrapper title="Threat Identification">
                <BiohazardIcon />
              </IconWrapper>
              <IconWrapper title="AI Brain Circuit">
                <BrainCircuitIcon />
              </IconWrapper>
              <IconWrapper title="Security & Defense">
                <KnightHelmetIcon />
              </IconWrapper>
            </IconRow>
            <InfoText>
              <strong>Threat Designer:</strong> Streamline threat modeling and identify vulnerabilities using agentic AI-powered security analysis.
            </InfoText>
          </InfoContent>
        </LeftSection>

        <RightSection isDark={isDark}>
          <FormScaleWrapper>
            {confirmationStatus === "success" ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <h2 style={{ color: isDark ? "#fff" : "#333", marginBottom: "16px" }}>
                  Email Confirmed
                </h2>
                <p style={{ color: isDark ? "#ccc" : "#555", marginBottom: "24px" }}>
                  Your account has been verified. You can now sign in.
                </p>
                <LoginForm onSignInSuccess={handleSignInSuccess} />
              </div>
            ) : confirmationStatus === "error" ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <h2 style={{ color: isDark ? "#fff" : "#333", marginBottom: "16px" }}>
                  Confirmation Failed
                </h2>
                <p style={{ color: isDark ? "#ccc" : "#555", marginBottom: "24px" }}>
                  The confirmation link is invalid or has expired. Please try signing up again.
                </p>
                <LoginForm onSignInSuccess={handleSignInSuccess} />
              </div>
            ) : (
              <LoginForm onSignInSuccess={handleSignInSuccess} />
            )}
          </FormScaleWrapper>
        </RightSection>
      </LoginCard>
    </LoginPageContainer>
  );
};

export default LoginPageInternal;
