// src/server/router/context.ts
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { JWT, Session } from "next-auth";
import { getServerAuthSession, getServerSideAuthJWT } from "../common/get-server-auth-session";

type CreateContextOptions = {
  session: Session | null;
  jwt: JWT | null
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    jwt: opts.jwt,
    session: opts.session,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });
  const jwt = await getServerSideAuthJWT({ req, res }) as JWT;

  return await createContextInner({
    jwt,
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
