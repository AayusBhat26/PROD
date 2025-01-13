import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function DELETE(
      req: Request,
      { params }: { params: { memberId: string } }
) {
      try {
            const profile = await currentProfile();
            const { searchParams } = new URL(req.url);

            const serverId = searchParams.get("serverId");

            if (!profile) {
                  return new NextResponse("Unauthorized", { status: 401 });
            }

            if (!serverId) {
                  return new NextResponse("Server ID missing", { status: 400 });
            }

            if (!params.memberId) {
                  return new NextResponse("Member ID missing", { status: 400 });
            }

            const server = await db.server.update({
                  where: {
                        id: serverId,
                        profileId: profile.id,
                  },
                  data: {
                        members: {
                              deleteMany: {
                                    id: params.memberId,
                                    profileId: {
                                          not: profile.id
                                    }
                              }
                        }
                  },
                  include: {
                        members: {
                              include: {
                                    profile: true,
                              },
                              orderBy: {
                                    role: "asc",
                              }
                        },
                  },
            });

            return NextResponse.json(server);
      } catch (error) {
            console.log("delete member from server route.ts", error);
            return new NextResponse("Internal Server Error", { status: 500 });
      }
}
// updat the user role
export async function PATCH(
      req: Request,
      { params }: { params: { memberId: string } }
) {
      try {
            // current profile.
            const profile = await currentProfile();
            const { searchParams } = new URL(req.url);

            const { role } = await req.json();
            const serverId = searchParams.get('serverId');
            console.log(searchParams);

            if (!profile) return new NextResponse('Unauthenticated User', { status: 401 });

            if (!serverId) return new NextResponse('Server not found, server id is not specified', { status: 400 });

            if (!params.memberId) return new NextResponse('Member id not found', { status: 400 });

            const server = await db.server.update({
                  where: {
                        id: serverId,
                        profileId: profile.id
                  },
                  data: {
                        members: {
                              update: {
                                    where: {
                                          // admin cannot change it's role by using only the api.
                                          id: params.memberId,
                                          profileId: {
                                                not: profile.id
                                          }
                                    },
                                    data: {
                                          role
                                    }
                              }
                        }
                  },
                  include: {
                        members: {
                              include: {
                                    profile: true,
                              },
                              orderBy: {
                                    role: "asc"
                              }
                        }
                  }
            })
            return NextResponse.json(server)
      } catch (error) {
            console.log('MEMBERS_ID_TS', error);
            return new NextResponse("Internal Server Error", { status: 500 })
      }
}