import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server"
const msg_Batch = 26;
export async function GET(
      req: Request
) {
      try {
            const profile = await currentProfile();
            const { searchParams } = new URL(req.url)
            const cursor = searchParams.get('cursor');
            const conversationId = searchParams.get('conversationId');

            if (!profile) return new NextResponse('unauthorized user', { status: 401 })

            if (!conversationId) return new NextResponse('channel not found', { status: 400 })

            let messages: DirectMessage[] = [];
            if (cursor) {
                  messages = await db.directMessage.findMany({
                        take: msg_Batch, skip: 1,
                        cursor: {
                              id: cursor,
                        },
                        where: {
                              conversationId
                        },
                        include: {
                              member: {
                                    include: {
                                          profile: true,
                                    }
                              }
                        },
                        orderBy: {
                              createdAt: "desc"
                        }
                  })
            }
            else {
                  messages = await db.directMessage.findMany({
                        take: msg_Batch,
                        where: {
                              conversationId,
                        },
                        include: {
                              member: {
                                    include: {
                                          profile: true,
                                    }
                              }
                        },
                        orderBy: {
                              createdAt: "desc"
                        }
                  })
            }
            let nextCursor = null;
            if (messages.length === msg_Batch) {
                  nextCursor = messages[msg_Batch - 1].id;
            }
            return NextResponse.json({
                  items: messages,
                  nextCursor
            })
      } catch (error) {
            console.log(error, 'error in message fetchiing (direct)')
            return new NextResponse("Internal server error", { status: 500 })
      }
}