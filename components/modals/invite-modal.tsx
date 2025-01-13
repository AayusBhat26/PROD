"use client";
// shadcn imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
// local uploads
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "../hooks/use-modal-store";
import { Label } from "../ui/label";
import { CheckIcon, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "../hooks/use-origin";
import { useState } from "react";
import axios from "axios";
export const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const origin = useOrigin();
  const isModalOpen = isOpen && type === "invite";
  const { server } = data;
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`
  const onCopy = () => {
    console.log(inviteUrl);

    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false)
    }, 1000);
  }
  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/hubs/${server?.id}/invite-code`);
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} >
      <DialogContent className="bg-white dark:bg-zinc-950  text-black p-0 overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-2xl font-bold text-center dark:text-blue-600 ">
            Invite New Users
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase dark:text-blue-600">
            SUB-HUB INVITE LINK
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input disabled={isLoading} className="text-black border-0 bg-zinc-300/500 focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0" value={inviteUrl}
            />
            <Button disabled={isLoading} size={"icon"} onClick={onCopy} className="transition ease-linear hover:bg-blue-600">
              {copied ? <CheckIcon className="w-4 h-4" /> : <Copy className="w-4 h-4" />}

            </Button>
          </div>
          <Button disabled={isLoading} onClick={onNew} variant={'link'} size={'sm'} className="mt-4 text-xs font-extrabold text-zinc-500">
            Generate A New SUB-HUB Link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
