import { Elysia } from "elysia";
import { yoga } from "@elysiajs/graphql-yoga";
import { typeDefs } from "./graphql/schema";
import {
  getGTRecipeByRecipeId,
  getSidebarItems,
  getRecipesThatMakeSingleId,
  getRecipesThatUseSingleId,
} from "./graphql/resolvers";

const app = new Elysia()
  .use(
    yoga({
      typeDefs,
      resolvers: {
        Query: {
          getGTRecipeByRecipeId: async (
            _: unknown,
            { recipeId }: { recipeId: string }
          ) => {
            return getGTRecipeByRecipeId(recipeId);
          },
          getNSidebarItems: async (
            _: unknown,
            {
              limit,
              search,
              mode,
            }: { limit: number; search: string; mode: string }
          ) => {
            return getSidebarItems(limit, search, mode);
          },
          getRecipesThatMakeSingleId: async (
            _: unknown,
            { itemId }: { itemId: string }
          ) => {
            return getRecipesThatMakeSingleId(itemId);
          },
          getRecipesThatUseSingleId: async (
            _: unknown,
            { itemId }: { itemId: string }
          ) => {
            return getRecipesThatUseSingleId(itemId);
          },
        },
      },
    })
  )
  .listen(process.env.PORT || 5000);

console.log(
  `🦊 Elysia + GraphQL Yoga running at http://${app.server?.hostname}:${app.server?.port}/graphql`
);
