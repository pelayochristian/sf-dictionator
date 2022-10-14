import NextAuth, { Account, JWT, type NextAuthOptions } from "next-auth";
import { env } from "../../../env/server.mjs";
import SalesforceProvider from 'next-auth/providers/salesforce'
import axios from 'axios'
import { DefaultJWT } from "next-auth/jwt/types.js";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async jwt({ token, account }) {
      const userToken = token as JWT;

      /**
       * Setting up use token after initial login.
       */
      if (account) {
        console.log('Use New Token...');

        const acct = account as Account;
        userToken.sfdc = {
          accessToken: acct.access_token,
          refreshToken: acct.refresh_token,
          instanceURL: acct.instance_url
        }
        const { exp } = await tokenIntrospection(token as JWT);
        userToken.sfdc.expiredIn = exp;

        return Promise.resolve(userToken as DefaultJWT);
      }


      /**
       * Reuse Token if auth token is not expired.
       */
      console.log('Use Previous Token...');
      const authExpiredIn = userToken.sfdc?.expiredIn;
      if (authExpiredIn && Date.now() < (authExpiredIn * 1000)) {
        return Promise.resolve(userToken as DefaultJWT);
      }

      /**
       * Get a refresh token to use.
       */
      console.log('Use Refresh Token...');
      userToken.sfdc = await refreshAccessToken(userToken);
      return Promise.resolve(userToken as DefaultJWT);
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
  pages: {
    signIn: "/signin",
  },
};

/**
 * Method to check the token expire date by calling the 
 * Salesforce End point fot Token Introspection.
 * @param token 
 */
const tokenIntrospection = async (token: JWT) => {
  try {
    const data = {
      'token': token.sfdc?.accessToken,
      'token_type_hint': 'access_token',
      'client_id': env.SALESFORCE_CLIENT_ID,
      'client_secret': env.SALESFORCE_CLIENT_SECRET
    };

    const tokenResponse = await axios({
      method: 'post',
      url: `${env.SALESFORCE_URL_LOGIN}/services/oauth2/introspect`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: data
    });

    const { exp } = await tokenResponse.data
    return { exp: exp }
  } catch (error) {
    return {
      error: "TokenIntrospectionError",
    }
  }
}

/**
 * Consume token object and returns a new updated `accessToken`.
 * @param tokenObject 
 */
const refreshAccessToken = async (token: JWT) => {
  try {
    const data = {
      'grant_type': 'refresh_token',
      'client_id': env.SALESFORCE_CLIENT_ID,
      'client_secret': env.SALESFORCE_CLIENT_SECRET,
      'refresh_token': token.sfdc?.refreshToken
    };


    const tokenResponse = await axios({
      method: 'post',
      url: `${env.SALESFORCE_URL_LOGIN}/services/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    });

    // Get Response data.
    const { access_token, refresh_token, instance_url } = await tokenResponse.data;

    // Get expire date from token introspection end point.
    const { exp } = await tokenIntrospection(token);

    return {
      accessToken: access_token,
      refreshToken: refresh_token ?? token.sfdc?.refreshToken,
      expiredIn: exp,
      instanceURL: instance_url
    }
  } catch (error) {
    return {
      error: "RefreshAccessTokenError",
    }
  }
}

export default NextAuth(authOptions);
