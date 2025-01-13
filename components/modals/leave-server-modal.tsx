"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "../hooks/use-modal-store";
import { Button } from "../../components/ui/button";

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      
      setIsLoading(true);
      await axios.patch(`/api/hubs/${server?.id}/leave`);
      onClose();
      router.refresh();
      router.push("/");

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="dark:text-white  p-0 overflow-hidden dark:bg-zinc-950 bg-white text-black">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you  <span className="font-semibold text-purple-700 capitalize mr-[5px]">sure</span>you want to <span className="font-semibold text-purple-700 capitalize mr-[5px]">leave</span>
            <span className="font-semibold text-purple-700 capitalize">{server?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className=" text-white px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant="initial"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="initial"
              onClick={onClick}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}