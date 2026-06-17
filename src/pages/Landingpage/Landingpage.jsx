import React, { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { getUser, confirmEmail } from "../../services/Auth/auth";
import LoginForm from "../../components/Auth/LoginForm";
import { useTheme } from "../../components/ThemeContext";
import rightArrowIcon from "../../../assets/icons/right-arrow.svg";

const threatModelQuestions = [
  { label: "QUESTION 1", text: ["What are we", "working on?"] },
  { label: "QUESTION 2", text: ["What could", "go wrong?"] },
  { label: "QUESTION 3", text: ["What are we", "going to do", "about it?"] },
  { label: "QUESTION 4", text: ["Did we do", "a good job?"] },
];

const analysisTags = [
  "Mission Decomposition",
  "System Decomposition",
  "Vulnerability Identification",
  "Cyber Threat Intelligence",
  "Defense & Risk Analysis",
  "Mitigation & Remediation",
  "Monitoring Analysis & Evaluation",
];

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
  display: flex;
  flex-direction: column;
  color: white;
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) {
    flex: none;
    height: auto;
    min-height: 320px;
    max-height: 400px;
  }
`;

const HeroHeader = styled.div`
  background: linear-gradient(180deg, #0a0c1f 0%, #141836 100%);
  padding: clamp(16px, 3vw, 28px) clamp(20px, 3vw, 32px);
  text-align: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 4px,
      rgba(255, 255, 255, 0.02) 4px,
      rgba(255, 255, 255, 0.02) 5px
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed);
  }
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-family: "Geist", Arial, sans-serif;
  font-size: clamp(22px, 3.2vw, 40px);
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
  line-height: 1.1;
  position: relative;
  z-index: 1;
`;

const PurpleContent = styled.div`
  flex: 1;
  background:
    radial-gradient(circle at 18% 30%, rgba(255, 255, 255, 0.12), transparent 20%),
    radial-gradient(circle at 72% 44%, rgba(255, 255, 255, 0.08), transparent 18%),
    linear-gradient(
      180deg,
      rgba(88, 28, 175, 0.95) 0%,
      rgba(107, 33, 168, 0.9) 50%,
      rgba(88, 28, 175, 0.95) 100%
    );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: clamp(14px, 2vw, 22px) clamp(16px, 2vw, 24px);
  gap: clamp(20px, 3vw, 32px);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.04) 25%, transparent 25%) 0 0 / 20px 20px,
      linear-gradient(135deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%) 0 0 / 20px 20px;
    opacity: 0.3;
    pointer-events: none;
  }
`;

const QuestionsSection = styled.div`
  position: relative;
  z-index: 1;
`;

const LabelsRow = styled.div`
  display: flex;
  align-items: flex-end;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LabelCell = styled.div`
  flex: 1;
  text-align: center;
  padding-bottom: clamp(6px, 0.8vw, 10px);
  font-family: "Geist Mono", Arial, sans-serif;
  font-size: clamp(7px, 0.7vw, 10px);
  letter-spacing: 0.2em;
  font-weight: 500;
  opacity: 0.9;
  text-transform: uppercase;
`;

const QuestionsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: clamp(6px, 0.8vw, 10px);
  margin-top: clamp(8px, 1vw, 14px);

  @media (max-width: 900px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
  }
`;

const QuestionCell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media (max-width: 900px) {
    flex: 0 0 calc(50% - 4px);
    min-width: 120px;
  }
`;

const QuestionText = styled.div`
  margin-top: clamp(6px, 0.8vw, 10px);
  font-family: "Avenue Mono", Arial, sans-serif;

  span {
    display: block;
    font-size: clamp(11px, 1.2vw, 16px);
    font-weight: 400;
    line-height: 1.25;
    text-align: center;
  }
`;

const ArrowBubble = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(28px, 2.8vw, 40px);
  height: clamp(28px, 2.8vw, 40px);
  margin-top: clamp(8px, 1vw, 14px);
  border-radius: 999px;
  background: rgba(15, 20, 50, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 4px 12px rgba(4, 6, 22, 0.4);
  flex-shrink: 0;

  img {
    width: 50%;
    height: 50%;
    filter: brightness(0) invert(1);
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const TagStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(4px, 0.5vw, 6px);
  justify-content: center;
  position: relative;
  z-index: 1;

  @media (max-width: 900px) {
    gap: 5px;
  }
`;

const TagChip = styled.div`
  padding: clamp(4px, 0.5vw, 6px) clamp(6px, 0.8vw, 10px);
  border-radius: 3px;
  background: rgba(139, 92, 246, 0.95);
  color: #fcfcfc;
  font-family: "Geist Mono", Arial, sans-serif;
  font-size: clamp(8px, 0.7vw, 11px);
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
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
          <HeroHeader>
            <HeroTitle>SBM ThreatForge</HeroTitle>
          </HeroHeader>
          <PurpleContent>
            <QuestionsSection>
              <LabelsRow>
                {threatModelQuestions.map((item) => (
                  <LabelCell key={item.label}>{item.label}</LabelCell>
                ))}
              </LabelsRow>
              <QuestionsRow>
                {threatModelQuestions.map((item, index) => (
                  <React.Fragment key={item.label}>
                    <QuestionCell>
                      <QuestionText>
                        {item.text.map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </QuestionText>
                    </QuestionCell>
                    {index < threatModelQuestions.length - 1 && (
                      <ArrowBubble>
                        <img src={rightArrowIcon} alt="arrow" />
                      </ArrowBubble>
                    )}
                  </React.Fragment>
                ))}
              </QuestionsRow>
            </QuestionsSection>
            <TagStrip>
              {analysisTags.map((tag) => (
                <TagChip key={tag}>{tag}</TagChip>
              ))}
            </TagStrip>
          </PurpleContent>
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
