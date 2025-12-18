import { cors } from "@elysiajs/cors";
import { yoga } from "@elysiajs/graphql-yoga";
import { Elysia } from "elysia";
import { ENV_CONFIG } from "./config/env.config";
import {
  getGTRecipeByRecipeId,
  getRecipesThatMakeSingleId,
  getRecipesThatUseSingleId,
  getSidebarItems,
} from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";
import { createLogger } from "./utils/logger";

const logger = createLogger("HTTP");

const app = new Elysia()
  .use(cors({ origin: ENV_CONFIG.cors.origin }))
  .onRequest(({ request }) => {
    const url = new URL(request.url);
    logger.info(`→ ${request.method} ${url.pathname}`);
  })
  .onAfterResponse(({ request, set }) => {
    const url = new URL(request.url);
    const status = typeof set.status === "number" ? set.status : 200;
    logger.info(`← ${request.method} ${url.pathname} ${status}`);
  })
  .use(
    yoga({
      typeDefs,
      resolvers: {
        Query: {
          getGTRecipeByRecipeId: async (
            _: unknown,
            { recipeId }: { recipeId: string },
          ) => {
            return getGTRecipeByRecipeId(recipeId);
          },
          getNSidebarItems: async (
            _: unknown,
            {
              limit,
              search,
              mode,
            }: { limit: number; search: string; mode: string },
          ) => {
            return getSidebarItems(limit, search, mode);
          },
          getRecipesThatMakeSingleId: async (
            _: unknown,
            { itemId }: { itemId: string },
          ) => {
            return getRecipesThatMakeSingleId(itemId);
          },
          getRecipesThatUseSingleId: async (
            _: unknown,
            { itemId }: { itemId: string },
          ) => {
            return getRecipesThatUseSingleId(itemId);
          },
        },
      },
    }),
  )
  .listen(ENV_CONFIG.server.port);

console.log(
  `🦊 Elysia + GraphQL Yoga running at http://${app.server?.hostname}:${app.server?.port}/graphql`,
);
