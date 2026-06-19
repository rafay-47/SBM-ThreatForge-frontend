import React, { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { getUser, confirmEmail } from "../../services/Auth/auth";
import LoginForm from "../../components/Auth/LoginForm";
import { useTheme } from "../../components/ThemeContext";
import logoShield from "../../components/ThreatModeling/images/shield.png";
import { Network, Boxes, Search, Globe, ShieldCheck, Sparkles, Activity, Lock, Users, AlertTriangle, CheckCircle2 } from "lucide-react";

const FlowArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IsometricCubeIcon = () => (
  <svg viewBox="0 0 100 100" style={{ width: 38, height: 38, filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))" }}>
    <path d="M 50 18 L 78 32 L 50 46 L 22 32 Z" fill="url(#cube-top)" />
    <path d="M 22 32 L 50 46 L 50 74 L 22 60 Z" fill="url(#cube-left)" />
    <path d="M 50 46 L 78 32 L 78 60 L 50 74 Z" fill="url(#cube-right)" />
    <defs>
      <linearGradient id="cube-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="cube-left" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#312e81" />
      </linearGradient>
      <linearGradient id="cube-right" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4338ca" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
    </defs>
  </svg>
);

const LoginPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => (props.isDark ? "#12131a" : "#F5F5F4")};
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
  width: min(95vw, 1280px);
  height: min(90vh, 760px);
  min-height: 520px;
  border-radius: 16px;
  box-shadow: ${(props) =>
    props.isDark
      ? `0 4px 24px rgba(0, 0, 0, 0.5), 0 8px 48px rgba(0, 0, 0, 0.4)`
      : `0 4px 12px rgba(0, 0, 0, 0.12), 0 8px 32px rgba(0, 0, 0, 0.08)`};
  overflow: hidden;
  position: relative;
  background: ${(props) => (props.isDark ? "#08090f" : "#ffffff")};

  @media (max-width: 900px) {
    flex-direction: column;
    width: min(92vw, 450px);
    height: auto;
    min-height: unset;
    max-height: 95vh;
    overflow-y: auto;
  }
`;

const LeftSection = styled.div`
  flex: 1.35;
  background: ${(props) => (props.isDark ? "#040612" : "linear-gradient(135deg, #f5f3ff 0%, #e0f2fe 100%)")};
  display: flex;
  flex-direction: column;
  padding: clamp(24px, 4vw, 48px);
  color: ${(props) => (props.isDark ? "white" : "#0f172a")};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  @media (max-width: 900px) {
    flex: none;
    height: auto;
    min-height: 520px;
    max-height: unset;
    padding: 32px 24px;
  }
`;

const HexGrid = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${(props) => (props.isDark ? 0.1 : 0.05)};
  pointer-events: none;
  background-image: radial-gradient(circle at 10% 50%, rgba(2, 4, 16, 0) 10%, ${(props) => (props.isDark ? "#040612" : "#f5f3ff")} 80%), 
    url(${(props) => (props.isDark 
      ? `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='41.56' viewBox='0 0 24 41.56'%3E%3Cpath d='M12 0 L24 6.93 L24 20.78 L12 27.71 L0 20.78 L0 6.93 Z M0 27.71 L12 34.64 L12 48.5 M24 27.71 L12 34.64' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E"`
      : `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='41.56' viewBox='0 0 24 41.56'%3E%3Cpath d='M12 0 L24 6.93 L24 20.78 L12 27.71 L0 20.78 L0 6.93 Z M0 27.71 L12 34.64 L12 48.5 M24 27.71 L12 34.64' fill='none' stroke='black' stroke-width='1'/%3E%3C/svg%3E"`
    )});
`;

const DottedWave = ({ isDark }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 1 }} viewBox="0 0 800 600" preserveAspectRatio="none">
    <path 
      d="M -50 480 C 180 430, 280 210, 480 160 C 680 110, 780 210, 880 110" 
      fill="none" 
      stroke="url(#wave-grad)" 
      strokeWidth="2" 
      strokeDasharray="4 8"
      opacity={isDark ? 0.2 : 0.12}
    />
    <path 
      d="M -50 500 C 160 450, 260 230, 460 180 C 660 130, 760 230, 860 130" 
      fill="none" 
      stroke="url(#wave-grad)" 
      strokeWidth="1.5" 
      strokeDasharray="2 6"
      opacity={isDark ? 0.12 : 0.07}
    />
    <defs>
      <linearGradient id="wave-grad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
  </svg>
);

const GlowPurple = styled.div`
  position: absolute;
  top: -100px;
  left: -50px;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(139, 92, 246, ${(props) => (props.isDark ? 0.12 : 0.06)}) 0%, rgba(139, 92, 246, 0) 70%);
  filter: blur(55px);
  pointer-events: none;
  z-index: 2;
`;

const GlowBlue = styled.div`
  position: absolute;
  bottom: -150px;
  right: -50px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(37, 99, 235, ${(props) => (props.isDark ? 0.12 : 0.06)}) 0%, rgba(37, 99, 235, 0) 70%);
  filter: blur(65px);
  pointer-events: none;
  z-index: 2;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 10;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: clamp(24px, 4vh, 48px);
`;

const LogoImg = styled.img`
  height: clamp(26px, 2.5vw, 34px);
  width: auto;
  margin-right: 12px;
`;

const LogoText = styled.span`
  font-family: "Geist", Arial, sans-serif;
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${(props) => (props.isDark ? "#ffffff" : "#0f172a")};
  
  span {
    color: #a855f7;
    font-weight: 500;
  }
`;

const Heading = styled.h1`
  font-family: "Geist", Arial, sans-serif;
  font-size: clamp(32px, 3.8vw, 46px);
  font-weight: 700;
  line-height: 1.15;
  margin: 0 0 16px 0;
  color: ${(props) => (props.isDark ? "#ffffff" : "#0f172a")};
  letter-spacing: -0.02em;

  span.gradient {
    background: linear-gradient(90deg, #3b82f6 0%, #a855f7 55%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const DescriptionText = styled.p`
  font-family: "Geist", Arial, sans-serif;
  font-size: clamp(13px, 1.2vw, 15px);
  line-height: 1.5;
  color: ${(props) => (props.isDark ? "#94a3b8" : "#475569")};
  margin: 0 0 clamp(24px, 4vh, 40px) 0;
  max-width: 580px;
  font-weight: 400;
`;

const FlowSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: clamp(24px, 4vh, 36px);
  gap: 8px;

  @media (max-width: 1100px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
`;

const StepCard = styled.div`
  flex: 1;
  min-width: 105px;
  min-height: 124px; /* Fix dimensions to prevent layout shifts */
  background: ${(props) => (props.isDark ? "rgba(8, 12, 28, 0.65)" : "rgba(255, 255, 255, 0.8)")};
  border: 1px solid ${(props) => (props.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)")};
  border-radius: 12px;
  padding: 24px 8px 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  box-shadow: ${(props) => (props.isDark ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "0 8px 32px rgba(15, 23, 42, 0.05)")};
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${(props) => (props.isDark ? "rgba(99, 102, 241, 0.35)" : "rgba(99, 102, 241, 0.5)")};
    transform: translateY(-4px);
    box-shadow: ${(props) => (props.isDark ? "0 12px 36px rgba(99, 102, 241, 0.18)" : "0 12px 36px rgba(99, 102, 241, 0.12)")};
  }

  @media (max-width: 1100px) {
    flex: unset;
    width: calc(50% - 10px);
    min-width: 140px;
    min-height: 130px;
    padding: 28px 12px 20px 12px;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const StepBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: "Geist Mono", monospace;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  border: 1.5px solid ${(props) => (props.isDark ? "#040612" : "#f5f3ff")};
`;

const StepIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  margin-bottom: 12px;
`;

const StepText = styled.span`
  font-family: "Geist", Arial, sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  color: ${(props) => (props.isDark ? "#cbd5e1" : "#334155")};
  text-align: center;
  display: block;
`;

const FlowArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
  opacity: 0.75;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 1100px) {
    display: none;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-items: center; /* Center the tag container rows */
  margin-bottom: clamp(24px, 4vh, 40px);
`;

const TagsRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center; /* Centering the tags rows */
  flex-wrap: wrap;
`;

const TagPill = styled.div`
  background: ${(props) => (props.isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.03)")};
  border: 1px solid ${(props) => (props.isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.06)")};
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  color: ${(props) => (props.isDark ? "#e2e8f0" : "#334155")};
  font-family: "Geist", Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  box-shadow: ${(props) => (props.isDark ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "0 4px 12px rgba(15, 23, 42, 0.03)")};
  transition: all 0.2s ease-in-out;
  backdrop-filter: blur(4px);

  svg {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    color: ${props => props.iconColor || "#818cf8"};
  }

  &:hover {
    background: ${(props) => (props.isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.06)")};
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-2px) scale(1.02);
    box-shadow: ${(props) => (props.isDark ? "0 4px 16px rgba(99, 102, 241, 0.12)" : "0 4px 16px rgba(99, 102, 241, 0.08)")};
  }
`;

const TrustSection = styled.div`
  display: flex;
  justify-content: center; /* Centered items with small compact gap */
  align-items: center;
  width: 100%;
  margin-top: auto;
  padding-top: clamp(16px, 3vh, 24px);
  border-top: 1px solid ${(props) => (props.isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.08)")};
  gap: clamp(16px, 3vw, 40px); /* Compact space between items */
  z-index: 10;

  @media (max-width: 900px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    margin-top: 32px;
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Geist", Arial, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: ${(props) => (props.isDark ? "#64748b" : "#475569")};
  line-height: 1.35;
  white-space: nowrap;

  svg {
    width: 15px;
    height: 15px;
    color: #6366f1;
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    max-width: 100%;
    width: calc(50% - 8px);
    justify-content: center;
  }

  @media (max-width: 480px) {
    width: 100%;
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
        <LeftSection isDark={isDark}>
          <HexGrid isDark={isDark} />
          <DottedWave isDark={isDark} />
          <GlowPurple isDark={isDark} />
          <GlowBlue isDark={isDark} />
          <ContentWrapper>
            <LogoContainer>
              <LogoImg src={logoShield} alt="SBM ThreatForge Logo" />
              <LogoText isDark={isDark}>SBM <span>THREATFORGE</span></LogoText>
            </LogoContainer>
            
            <Heading isDark={isDark}>
              Threat Modeling,<br />
              <span className="gradient">Reimagined.</span>
            </Heading>
            
            <DescriptionText isDark={isDark}>
              SBM ThreatForge helps security and engineering teams identify, assess, and mitigate threats with confidence.
            </DescriptionText>

            <FlowSection>
              <StepCard isDark={isDark}>
                <StepBadge isDark={isDark}>1</StepBadge>
                <StepIconWrapper>
                  <IsometricCubeIcon />
                </StepIconWrapper>
                <StepText isDark={isDark}>What are we building?</StepText>
              </StepCard>
              
              <FlowArrow>
                <FlowArrowIcon />
              </FlowArrow>

              <StepCard isDark={isDark}>
                <StepBadge isDark={isDark}>2</StepBadge>
                <StepIconWrapper>
                  <AlertTriangle size={36} color="#c084fc" style={{ filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))" }} />
                </StepIconWrapper>
                <StepText isDark={isDark}>What can go wrong?</StepText>
              </StepCard>

              <FlowArrow>
                <FlowArrowIcon />
              </FlowArrow>

              <StepCard isDark={isDark}>
                <StepBadge isDark={isDark}>3</StepBadge>
                <StepIconWrapper>
                  <ShieldCheck size={36} color="#60a5fa" style={{ filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))" }} />
                </StepIconWrapper>
                <StepText isDark={isDark}>What should we do about it?</StepText>
              </StepCard>

              <FlowArrow>
                <FlowArrowIcon />
              </FlowArrow>

              <StepCard isDark={isDark}>
                <StepBadge isDark={isDark}>4</StepBadge>
                <StepIconWrapper>
                  <CheckCircle2 size={36} color="#22d3ee" style={{ filter: "drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))" }} />
                </StepIconWrapper>
                <StepText isDark={isDark}>Did we do a good job?</StepText>
              </StepCard>
            </FlowSection>

            <TagsContainer>
              <TagsRow>
                <TagPill isDark={isDark} iconColor="#ec4899">
                  <Network /> Mission Decomposition
                </TagPill>
                <TagPill isDark={isDark} iconColor="#60a5fa">
                  <Boxes /> System Decomposition
                </TagPill>
                <TagPill isDark={isDark} iconColor="#38bdf8">
                  <Search /> Vulnerability Identification
                </TagPill>
              </TagsRow>
              <TagsRow>
                <TagPill isDark={isDark} iconColor="#3b82f6">
                  <Globe /> Cyber Threat Intelligence
                </TagPill>
                <TagPill isDark={isDark} iconColor="#38bdf8">
                  <ShieldCheck /> Defense & Risk Analysis
                </TagPill>
                <TagPill isDark={isDark} iconColor="#c084fc">
                  <Sparkles /> Mitigation & Remediation
                </TagPill>
              </TagsRow>
              <TagsRow>
                <TagPill isDark={isDark} iconColor="#60a5fa">
                  <Activity /> Monitoring Analysis & Evaluation
                </TagPill>
              </TagsRow>
            </TagsContainer>

            <TrustSection isDark={isDark}>
              <TrustItem isDark={isDark}>
                <ShieldCheck />
                <span>Trusted by security professionals</span>
              </TrustItem>
              <TrustItem isDark={isDark}>
                <Lock />
                <span>Enterprise-grade security</span>
              </TrustItem>
              <TrustItem isDark={isDark}>
                <Users />
                <span>Built for cross-functional collaboration</span>
              </TrustItem>
            </TrustSection>
          </ContentWrapper>
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
