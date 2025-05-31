/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as aipipe from "../aipipe.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as router from "../router.js";
import type * as scraper from "../scraper.js";
import type * as search from "../search.js";
import type * as storage from "../storage.js";
import type * as tds from "../tds.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aipipe: typeof aipipe;
  auth: typeof auth;
  http: typeof http;
  router: typeof router;
  scraper: typeof scraper;
  search: typeof search;
  storage: typeof storage;
  tds: typeof tds;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
