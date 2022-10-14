import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    sfdc?: {
      accessToken?: string,
      refreshToken?: string,
      expiredIn?: number,
      instanceURL?: string,
    } & DefaultJWT
  }

  interface Account {
    instance_url?: string,
    access_token?: string,
    refresh_token?: string
  }
}
