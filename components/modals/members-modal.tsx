"use client";
// shadcn imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
// local uploads
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "../hooks/use-modal-store";
import { Label } from "../ui/label";
import { Check, CheckIcon, Copy, Frown, Gavel, Loader2, MoreVertical, RefreshCw, Shield, ShieldAlert, ShieldCheck, ShieldEllipsis, ShieldQuestion } from "lucide-react";
import { HubWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import { useState } from "react";
import qs from "query-string";
// actions dropdown imports.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldEllipsis className="h-4 w-4 ml-2 text-blue-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-green-500" />
}
export const MembersModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const [loadingId, setLoadingId] = useState('');
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: HubWithMembersWithProfiles }
  const onKick = async (memberId:string)=>{
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url:`/api/members/${memberId}`, query:{
          serverId: server?.id
        }
      });
      const response = await axios.delete(url);
      router.refresh();
      onOpen('members', {server:response.data})
    } catch (error) {
      console.log("onKick", error);
      
    }finally{
      setLoadingId('')
    }
  }
  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url =  qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} >
      <DialogContent className="bg-white   text-black overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold dark:text-blue-600 ">
            Manage Members Menu
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {
            server?.members?.map((member) => (
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile.imageUrl || ''} />
                <div className="flex flex-col gap-y-1">

                  <div className="text-xs font-semibold flex items-center gap-x-1">
                    {member.profile.name}
                    {
                      roleIconMap[member.role]
                    }
                  </div>
                  <p className="text-xs text-gray-600">
                    {member.profile.email}
                  </p>
                </div>
                {
                  server.profileId !== member.profileId && loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-blue-500" />

                          <DropdownMenuContent side='left'>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center">
                                <ShieldQuestion className="w-4 h-4 mr-2" />
                                <span>ROLE</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem onClick={()=>onRoleChange(member.id, "GUEST")}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    GUEST
                                    {member.role === 'GUEST' && (
                                      <Check className="h-4 w-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem  onClick={()=>onRoleChange(member.id, "MODERATOR")} >
                                    <Shield className="h-4 w-4 mr-2" />
                                    MODERATOR
                                    {member.role === 'MODERATOR' && (
                                      <ShieldCheck className="h-4 w-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={()=>onKick(member.id)}>
                                <Frown className="h-4 w-4 mr-2"/>
                                KICK 
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenuTrigger>
                      </DropdownMenu>
                    </div>
                  )
                }
                {
                  loadingId ===member.id && (
                    <Loader2 className="animate-spin text-rose-500 ml-auto w-4 h-4"/>
                  )
                }
              </div>
            ))
          }
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
