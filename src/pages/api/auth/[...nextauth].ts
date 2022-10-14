import NextAuth, { type NextAuthOptions } from "next-auth";
import { env } from "../../../env/server.mjs";
import SalesforceProvider from 'next-auth/providers/salesforce'


export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async jwt({ token }) {
      return token
    }
  },
  // Configure one or more authentication providers
  providers: [
    SalesforceProvider({
      name: 'Salesforce',
      clientId: env.SALESFORCE_CLIENT_ID,
      clientSecret: env.SALESFORCE_CLIENT_SECRET,
      idToken: true,
      wellKnown: `${env.SALESFORCE_URL_LOGIN}/.well-known/openid-configuration`,
      authorization: { params: { scope: 'openid api refresh_token' } },
      userinfo: {
        async request({ provider, tokens, client }) {

          // TODO - Fix type safety
          const userToken: any = tokens
          const userProvider: any = provider;

          return await client.userinfo(userToken, {
            params: userProvider.userinfo.params,
          });
        },
      },
      profile(profile) {
        return { id: profile.email, ...profile };
      }
    })
  ],
};

export default NextAuth(authOptions);
