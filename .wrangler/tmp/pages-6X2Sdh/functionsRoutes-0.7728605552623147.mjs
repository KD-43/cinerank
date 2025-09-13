import { onRequest as __api_tierlists___path___js_onRequest } from "D:\\Web Development\\Projects\\movie-discovery-app\\my-vite-app\\functions\\api\\tierlists\\[[path]].js"
import { onRequest as __api___path___js_onRequest } from "D:\\Web Development\\Projects\\movie-discovery-app\\my-vite-app\\functions\\api\\[[path]].js"

export const routes = [
    {
      routePath: "/api/tierlists/:path*",
      mountPath: "/api/tierlists",
      method: "",
      middlewares: [],
      modules: [__api_tierlists___path___js_onRequest],
    },
  {
      routePath: "/api/:path*",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api___path___js_onRequest],
    },
  ]