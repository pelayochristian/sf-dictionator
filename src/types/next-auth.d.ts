import { DefaultSession } from "next-auth";
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      isAuthenticated?: boolean;
    } & DefaultSession["user"];
  }

  interface JWT {
    sfdc?: {
      accessToken?: string,
      refreshToken?: string,
      expiredIn?: number,
      instanceURL?: string,
      error?: string
    }
  }

  interface Account {
    instance_url?: string,
    access_token?: string,
    refresh_token?: string
  }
}
