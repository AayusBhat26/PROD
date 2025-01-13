import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";
import { NextApiRequest } from "next";
// returns the current profile of the user if they are logged in.
export const currentProfilePages = async (req: NextApiRequest) => {
      const { userId } = getAuth(req);
      if (!userId) {
            return null;
      }
      const profile = await db.profile.findUnique({
            where: {
                  userId
            }
      })
      return profile;
}