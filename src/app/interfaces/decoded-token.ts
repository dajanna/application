import { JwtPayload } from "jwt-decode";

export interface DecodedToken extends JwtPayload {
    nameid: string;
    name: string;
    email: string;
    role: string[];
  }