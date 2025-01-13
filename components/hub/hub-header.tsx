"use client";

import { HubWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { ChevronDown, LogOutIcon, PlusCircle, Settings, Trash2Icon, UserPlus, Users } from "lucide-react";

import { useModal } from "../hooks/use-modal-store";

interface HubHeaderProps {
      server: HubWithMembersWithProfiles;
      role?: MemberRole;
};

export const HubHeader = ({
      server, role
}: HubHeaderProps) => {
      const { onOpen } = useModal();
      const isAdmin = role === MemberRole.ADMIN;
      const isModerator = isAdmin || role === MemberRole.MODERATOR;
      // flow of working
      // we will be creating a new modal in the components/modals folder, now inside the modal provider, we will add the newly created modal. 
      // once the modal provider is provided with the new modal component, then depending on the use case we will add the modal opening to that specific area.
      // in each onClick we will add onOpen and as arguments we will pass modal name and the data .
      return (

            <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none" asChild>
                        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 borderd-b-2 hover:bg-blue-100 dark:hover:bg-slate-800/50 transition">
                              {server.name}


                              <ChevronDown className=" h-5 w-5 ml-auto" />

                        </button>


                  </DropdownMenuTrigger>


                  <DropdownMenuContent className="w-56   text-black dark:text-neutral-100 space-y-[2px] hover:">

                        {
                              isModerator && (
                                    <DropdownMenuItem
                                          onClick={() => onOpen("invite", { server: server })}
                                          className="text-blue-500 dark:text-blue-400 px-3 py-2 text-sm cursor-pointer">
                                          Invite others.
                                          <UserPlus className='h-4 w-5 ml-auto' />

                                    </DropdownMenuItem>
                              )
                        }
                        {
                              isAdmin && (
                                    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer" onClick={()=>onOpen('editHub', {server})} >
                                          Server Settings
                                          <Settings className='h-4 w-5 ml-auto' />

                                    </DropdownMenuItem>
                              )
                        }

                        {
                              isAdmin && (
                                    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer"
                                    onClick={()=>onOpen('members', {server})}
                                    >
                                          Manage Members
                                          <Users className='h-4 w-5 ml-auto' />
                                    </DropdownMenuItem>
                              )
                        }
                        {
                              isModerator && (
                                    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer" onClick={()=>onOpen("createChannel")}>
                                          Create SUB HUB
                                          <PlusCircle className='h-4 w-5 ml-auto' />
                                    </DropdownMenuItem>
                              )
                        }
                        {
                              isModerator && (
                                    <DropdownMenuSeparator />
                              )
                        }
                        {
                              isAdmin && (
                                    <DropdownMenuItem className="text-rose-600 px-3 py-2 text-sm cursor-pointer"
                                    onClick={()=>onOpen("deleteServer", {server})}
                                    >
                                          Delete HUB
                                          <Trash2Icon className='h-4 w-5 ml-auto' />
                                    </DropdownMenuItem>
                              )
                        }
                        {/* admins cannot leave the server, omly moderator and guest users can */}
                        {
                              !isAdmin && (
                                    <DropdownMenuItem className="text-rose-600 px-3 py-2 text-sm cursor-pointer"
                                    onClick={()=>onOpen('leaveServer', {server})} 
                                    // server is passed.
                                    >
                                          Leave The Hub
                                          <LogOutIcon className='h-4 w-5 ml-auto' />
                                    </DropdownMenuItem>
                              )
                        }
                  </DropdownMenuContent>

            </DropdownMenu>

      )
}