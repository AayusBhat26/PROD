"use client";

import { HubWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../actions-tooltip";
import { Code, Ear, Mic, Pen, PenTool, PlusCircleIcon, Settings2Icon, Text, Timer, Video } from "lucide-react";
import { useModal } from "../hooks/use-modal-store";

interface SubHubSectionProps {
      label: string;
      role?: MemberRole;
      sectionType: "channels" | "members";
      channelType?: ChannelType;
      server?: HubWithMembersWithProfiles;
}

export const SubHubSection = ({
      label, role, sectionType, channelType, server
}: SubHubSectionProps) => {

      const { onOpen } = useModal();
      return (
            <div className="flex items-center justify-between py-2">
                  <p className="text-xs font-semibold text-blue-700 uppercase dark:text-blue-500">
                        {label}
                  </p>
                  {role !== MemberRole.GUEST && sectionType === "channels" && (
                        <ActionTooltip label="Create Sub Hub" side="top">
                              <button className="transition dark:hover:text-blue-500 hover:bg-gray-800" onClick={() => onOpen("createChannel", { channelType })}>
                                    <PlusCircleIcon className="w-4 h-4" />
                              </button>
                        </ActionTooltip>
                  )}
                  {
                        role === MemberRole.ADMIN && sectionType === "members" && (
                              <ActionTooltip label="Manage Members" side="top">
                                    <button className="transition dark:hover:text-blue-500 hover:bg-gray-800" onClick={() => onOpen("members", { server })}>
                                          <Settings2Icon className="w-4 h-4" />
                                    </button>
                              </ActionTooltip>
                        )
                  }
            </div>
      )
}