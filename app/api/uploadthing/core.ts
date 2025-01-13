import { auth } from "@clerk/nextjs"
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();
// todo: implement the clerk here.
const handleAuth = () => {
      const {userId} = auth();
      if (!userId) {
            throw new Error('Unauthorized User');
      }
      return { userId: userId };

}
// todo: USE CASE 1 : HUB IMAGE UPLOAD
// FileRouter for  app, it can contain multiple FileRoutes
export const ourFileRouter = {

      hubImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
            .middleware(() => handleAuth())
            .onUploadComplete(() => { }),
      // message files, for the attachment with the file.
      messageFile: f(["image", "pdf"])
            .middleware(() => handleAuth())
            .onUploadComplete(() => { })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;