import { Injectable } from "@nestjs/common";
import * as jose from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-link-secret-change-in-production"
);

export interface JwtPayload extends jose.JWTPayload {
  id: string;
  email: string;
}

@Injectable()
export class JwtService {
  async sign(payload: JwtPayload): Promise<string> {
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);
  }

  async verify(token: string): Promise<JwtPayload | null> {
    try {
      const { payload } = await jose.jwtVerify(token, secret);

      return {
        id: payload.id as string,
        email: payload.email as string,
      };
    } catch {
      return null;
    }
  }
}
