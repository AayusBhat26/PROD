import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { ObjectId } from "mongodb";
import { db } from "./db";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export const initialProfile = async () => {
      try {
            const user = await currentUser();
            // console.log(user);

            if (!user) {
                  // If no user, redirect to sign in.
                  return redirectToSignIn();
            }

            // Find the user's profile.
            const profile = await db.profile.findUnique({
                  where:{
                        userId: user.id
                  }
            });

            if (profile) {
                  // If the user's profile is found, return it.
                  return profile;
            }

            // Create a new profile if it doesn't exist.
            // const userObjectId = new ObjectId(user.id);
            // console.log(userObjectId);

            const newProfile = await db.profile.create({
                  data: {
                        userId: user.id,
                        name: `${user.firstName} ${user.lastName}`,
                        imageUrl: user.imageUrl,
                        email: user.emailAddresses[0]?.emailAddress || "", // Check for email existence
                  },
            });

            return newProfile;
      } catch (error) {
            console.error("Error in initialProfile:", error);
            throw error; // or return an error response
      }
};
