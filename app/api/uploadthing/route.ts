import { createNextRouteHandler } from "uploadthing/next";
import { OurFileRouter, ourFileRouter } from "./core";
export const {GET, POST} =createNextRouteHandler({
      router:ourFileRouter
});