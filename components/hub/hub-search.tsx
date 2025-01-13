"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

import { useParams, useRouter } from "next/navigation";

interface HubSearchProps {
      data: {
            label: string;
            type: 'channel' | 'member';
            data: {
                  icon: React.ReactNode;
                  name: string;
                  id: string;
            }[] | undefined;
      }[];
}
export const HubSearch = ({
      data
}: HubSearchProps) => {
      const [open, setOpen] = useState(false);
      const router = useRouter();
      const params = useParams();
      useEffect(() => {
            const down = (e: KeyboardEvent) => {
                  if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        setOpen((open) => !open);
                  }
            }
            document.addEventListener('keydown', down);
            return () => document.removeEventListener('keydown', down)
      }, []);

      const onClick = ({ id, type }: { id: string, type: "channel" | "member" }) => {
            setOpen(false);
            if (type === 'member') {
                  return router.push(`/hub/${params?.hubsId}/conversations/${id}`)
            }
            if (type === 'channel') {
                  return router.push(`/hub/${params?.hubsId}/channels/${id}`)
            }
      }
      return (
            <>
                  <button onClick={() => setOpen(true)}
                        className="flex items-center w-full px-2 py-2 transition rounded-md group gap-x-2 hover:bg-purple-500 dark:hover:bg-blue-500/10">
                        <SearchIcon className="w-4 h-4 text-blue-400 dark:text-blue-500" />
                        <p className="text-sm font-semibold text-blue-400 transition dark:text-blue-500 group-hover:text-blue-500 dark:group-hover:text-white hover:border-purple-500">
                              searching
                        </p>
                        <kbd
                              className="pointer-events-none inline-block h-5 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground ml-auto"
                        >
                              <span className="text-xs">CTRL</span> B
                        </kbd>
                  </button>
                  <div className="">
                        <CommandDialog open={open} onOpenChange={setOpen} >
                              <CommandInput

                                    placeholder="Search all Hubs or memebrs from here."
                              />
                              {/* {className = "border border-[1px] border-purple-500"} */}
                              <CommandList className="overflow-y-scroll border border-purple-300 rounded no-scrollbar ">
                                    <CommandEmpty>
                                          No results found.
                                    </CommandEmpty>
                                    {data.map(({ label, type, data }) => {
                                          if (!data?.length) return null
                                          return <CommandGroup key={label} heading={label} >
                                                {data?.map(({ id, icon, name }) => {
                                                      return (
                                                            <CommandItem key={id} onSelect={() => onClick({ id, type })} >{icon}

                                                                  <span
                                                                        className="text-blue-400">{name}</span>
                                                            </CommandItem>
                                                      )
                                                })}
                                          </CommandGroup>
                                    })}
                              </CommandList>
                        </CommandDialog>
                  </div>

            </>
      )
}