'use client';
import {
      Form, FormControl, FormField, FormItem
} from "@/components/ui/form";
import * as z from "zod";
import axios from "axios"
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, Profile, MemberRole } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../actions-tooltip";
import { Edit, Edit2, FileIcon, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "../hooks/use-modal-store";
import { useRouter, useParams } from "next/navigation";

// form schema 
const formSchema = z.object({
      content: z.string().min(1)
})

const roleIconMap = {
      "GUEST": null,
      "MODERATOR": <ShieldCheck className="w-4 h-4 ml-2 text-indigo-400" />,
      "ADMIN": <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
}
interface ChatItemsProps {
      id: string;
      content: string;
      member: Member & {
            profile: Profile
      };
      timestamp: string;
      fileUrl: string | null;
      deleted: boolean;
      currentMember: Member;
      isUpdated: boolean;
      socketUrl: string;
      socketQuery: Record<string, string>;
}
export const ChatItems = ({ id, content, member, timestamp, fileUrl, deleted, currentMember, isUpdated, socketUrl, socketQuery }: ChatItemsProps) => {
      const { onOpen } = useModal();
      const params = useParams();
      const router = useRouter();
      const onMemberClick = () => {
            if (member.id === currentMember.id) {
                  return;
            }
            router.push(
                  `/hubs/${params?.hubsId}/conversation/${member.id}`
            )
      }
      const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                  content: content,
            }
      })
      useEffect(() => {
            // i forgot to add the content as the dependency, becauuse of that whenever i was editing the messagee, the edited message was not updated in the frontend only.
            form.reset({
                  content: content,
            })
      }, [content]);



      const [isEditing, setIsEditing] = useState(false);
      // mai js ka concept bhul gya tha ki const wale vairables ki hosting nhi hoti hai, isliye ye keydown chal nhi rha tha.
      useEffect(() => {
            const handleKeyDown = (event: any) => {
                  if (event.key === 'Escape' || event.keyCode === 27) {
                        setIsEditing(false);
                  }
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                  window.removeEventListener('keydown', handleKeyDown);
            };
      }, []);
      const fileType = fileUrl?.split('.').pop();
      const isAdmin = currentMember.role === MemberRole.ADMIN;
      const isModerator = currentMember.role === MemberRole.MODERATOR;
      const isOwner = currentMember.id === member.id;
      const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
      const editMessage = !deleted && (isOwner) && !fileUrl
      const isPDF = fileType === 'pdf' && fileUrl;
      const isImage = !isPDF && fileUrl;
      const isLoading = form.formState.isSubmitting;
      const onSubmit = async (values: z.infer<typeof formSchema>) => {
            // console.log(values);

            try {
                  const url = qs.stringifyUrl({
                        url: `${socketUrl}/${id}`,
                        query: socketQuery
                  });
                  await axios.patch(url, values);
                  form.reset()
                  setIsEditing(false);
            } catch (error) {
                  console.log(error);
            }

      }

      return (
            <div className="relative flex w-full p-4 transition group itens-center hover:bg-black/5">
                  <div className="flex items-start w-full group gap-x-2">
                        <div onClick={onMemberClick} className="transition cursor-pointer hover:drop-shadow-md">
                              <UserAvatar src={member.profile.imageUrl || ''} />
                        </div>
                        <div className="flex flex-col w-full">
                              <div className="flex items-center gap-x-2">
                                    <div className="flex items-center">
                                          <p onClick={onMemberClick} className="text-sm font-semibold cursor-pointer hover:underline" >
                                                {member.profile.name}
                                          </p>
                                          <ActionTooltip label={member.role}>
                                                {roleIconMap[member.role]}
                                          </ActionTooltip>
                                    </div>
                                    <span className="text-[10px] text-zinc-600 dark:text-blue-300 font-semibold" >
                                          {timestamp}
                                    </span>
                              </div>
                              {isImage && (
                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md aspect-square bg-secondary">
                                          <Image src={fileUrl} alt={content} fill className="object-cover" />
                                    </a>
                              )}
                              {
                                    isPDF && (
                                          <div className="relative flex items-center p-2 mt-2 rounded-md bg-zinc-800">
                                                <FileIcon className="w-10 h-10 fill-purple-400 stroke-transparent" />
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-600 dark:text-white hover:underline">
                                                      PDF FILE
                                                </a>
                                          </div>
                                    )
                              }
                              {!fileUrl && !isEditing && (
                                    <p className={cn(
                                          "text-sm text-zinc-500 dark:text-zinc-200",
                                          deleted && "italic text-black dark:text-white text-xs mt-1"
                                    )} >
                                          {content}
                                          {
                                                isUpdated && !deleted && (
                                                      <span className="mx-2 text-zinc-600">
                                                            <span className="font-extrabold font-[20px] mr-[10px]">*Note: </span>message is different from original message
                                                      </span>
                                                )
                                          }
                                    </p>
                              )}
                              {
                                    !fileUrl && isEditing && (
                                          <Form {...form}>
                                                <form
                                                      className="flex items-center w-full pt-2 gap-x-2"
                                                      onSubmit={form.handleSubmit(onSubmit)}>
                                                      <FormField
                                                            control={form.control}
                                                            name='content'
                                                            render={({ field }) => (
                                                                  <FormItem
                                                                        className="flex-1"
                                                                  >
                                                                        <FormControl>
                                                                              <div className="relative w-full">
                                                                                    <Input
                                                                                          className="p-2 text-white bg-black border-0 dark:bg-zinc-800border-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                                                                          placeholder="Edited Message" {...field}
                                                                                          disabled={isLoading}
                                                                                    />

                                                                              </div>
                                                                        </FormControl>
                                                                  </FormItem>
                                                            )}
                                                      />
                                                      <Button disabled={isLoading} size={'sm'} variant={'initial'}>
                                                            Save
                                                      </Button>
                                                </form>
                                                <span className="text-[12px] font-semibold mt-1 text-gray-400">
                                                      Espace: Cancel, Enter: Save
                                                </span>
                                          </Form>
                                    )
                              }
                        </div>
                  </div>
                  {
                        canDeleteMessage && (
                              <div className="absolute items-center justify-between hidden p-1 bg-white border rounded-sm group-hover:flex gap-x-2 -top-2 right-5 ">
                                    {editMessage && (
                                          <ActionTooltip label="EDIT">
                                                <Edit2 className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-600 hover:text-zinc-900"
                                                      onClick={() => setIsEditing(true)}
                                                />
                                          </ActionTooltip>
                                    )}
                                    <ActionTooltip label="Delete">
                                          <Trash2 className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-600 hover:text-zinc-900" onClick={() => onOpen("deleteMessage", {
                                                apiUrl: `${socketUrl}/${id}`,
                                                query: socketQuery

                                          })} />
                                    </ActionTooltip>
                              </div>
                        )
                  }
            </div >
      )
}