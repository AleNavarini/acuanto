import { DefaultSession } from "next-auth";

export interface SessionType extends DefaultSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
