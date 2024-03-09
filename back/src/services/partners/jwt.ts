import jwt from "jsonwebtoken";
import configuration from "../../config";

export interface TokenPayload {
  username: string;
  token?: string;
}

const generateToken = (payload: TokenPayload): string => {
  const token = jwt.sign(
    { username: payload.username },
    configuration.jwtSecret,
    {
      expiresIn: 60 * 120,
    }
  );
  return token;
};

const verifyToken = ({ token }: { token: string }): TokenPayload | null => {
  try {
    const payload = jwt.verify(token, configuration.jwtSecret) as TokenPayload;
    return payload;
  } catch (error) {
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
};
