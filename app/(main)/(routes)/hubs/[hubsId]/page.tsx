import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdPageProps {
      params: {
            hubsId: string;
      }
};

const ServerIdPage = async ({
      params
}: ServerIdPageProps) => {
      const profile = await currentProfile();

      if (!profile) {
            return redirectToSignIn();
      }

      const server = await db.server.findUnique({
            where: {
                  id: params.hubsId,
                  members: {
                        some: {
                              profileId: profile.id,
                        }
                  }
            },
            include: {
                  channels: {
                        where: {
                              name: "general"
                        },
                        orderBy: {
                              createdAt: "asc"
                        }
                  }
            }
      })

      const initialChannel = server?.channels[0];

      if (initialChannel?.name !== "general") {
            return null;
      }

      return redirect(`/hubs/${params.hubsId}/channels/${initialChannel?.id}`)
}

export default ServerIdPage;