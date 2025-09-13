// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/api/*",
    "/assets/*"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "D:\\Web Development\\Projects\\movie-discovery-app\\my-vite-app\\.wrangler\\tmp\\pages-N6v1bP\\functionsWorker-0.13289647144467276.mjs";
import { isRoutingRuleMatch } from "D:\\Web Development\\Projects\\movie-discovery-app\\my-vite-app\\node_modules\\wrangler\\templates\\pages-dev-util.ts";
export * from "D:\\Web Development\\Projects\\movie-discovery-app\\my-vite-app\\.wrangler\\tmp\\pages-N6v1bP\\functionsWorker-0.13289647144467276.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=sx6vrhem81e.js.map
