import { getAuthToken as getSharedAuthToken } from "../../../services/Auth/auth";

export const getAuthToken = async () => {
  try {
    return await getSharedAuthToken();
  } catch (error) {
    console.error("Failed to get auth token:", error);
    throw new Error("Authentication required");
  }
};

const checkForInterruptInTurn = (turn) => {
  if (!turn || !turn.aiMessage || !Array.isArray(turn.aiMessage)) {
    return null;
  }

  return turn.aiMessage.find((message) => message.type === "interrupt");
};

export const checkForInterruptInChatTurns = (chatTurns) => {
  if (!chatTurns || chatTurns.length === 0) {
    return null;
  }

  const lastTurn = chatTurns[chatTurns.length - 1];
  return checkForInterruptInTurn(lastTurn);
};
