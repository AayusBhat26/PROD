"use client";

import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./Navigation-item";
import { ModeToggle } from "../mode-toggle";
import { Indicator } from "../indicator";
// framer motion
import { motion } from "framer-motion";
import { useTaskbarStore } from "@/hooks/use-taskbar-store";

interface Server {
      id: string;
      name: string | null;
      imageUrl: string | null;
      createdAt: Date;
}

// Define the props for the client component
interface TaskbarNavigationClientProps {
      servers: Server[];
}

const TaskbarNavigationClient: React.FC<TaskbarNavigationClientProps> = ({ servers }) => {
      const { isVisible, toggleVisibility } = useTaskbarStore();

      useEffect(() => {
            const handleKeyPress = (event: KeyboardEvent) => {
                  if (event.key === "i" && event.ctrlKey) {
                        toggleVisibility();
                  }
            };

            window.addEventListener("keydown", handleKeyPress);
            return () => window.removeEventListener("keydown", handleKeyPress);
      }, [toggleVisibility]);

      if (!isVisible) return null;

      return (
            <motion.div
                  initial={{ opacity: 0.5, scale: 0.85 }}
                  animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="fixed right-0 top-0 z-30 flex flex-col items-center 
                        h-full w-[72px] 
                        bg-white dark:bg-black 
                        border-l border-gray-200 dark:bg-black
                        py-3"
            >
                  <NavigationAction />
                  <Separator
                        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto my-2"
                  />
                  <ScrollArea className="flex-1 w-full">
                        <div className="px-2 space-y-2">
                              {servers.map((server) => (
                                    <NavigationItem
                                          key={server.id}
                                          id={server.id}
                                          name={server.name || 'Unknown'}
                                          imageUrl={server.imageUrl || '/default-image.png'}
                                          createdAt={server.createdAt}
                                    />
                              ))}
                        </div>
                  </ScrollArea>
                  <div className="flex flex-col items-center mt-auto gap-y-4">
                        <ModeToggle />
                        <UserButton
                              afterSignOutUrl="/"
                              appearance={{
                                    elements: {
                                          avatarBox: "h-[42px] w-[42px]"
                                    }
                              }}
                        />
                        <Indicator />
                  </div>
            </motion.div>
      );
}

export default TaskbarNavigationClient;
