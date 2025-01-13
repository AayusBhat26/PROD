"use client";
// package imports
import { useForm } from "react-hook-form";
import qs from "query-string"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ChannelType } from "@prisma/client";

// shadcn imports
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// local uploads
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "../hooks/use-modal-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useEffect } from "react";
// todo: form schema
const formSchema = z.object({
  name: z.string().min(1, {
    message: "SUB HUB name is required.",
    // preventing the subname as the general name
  }).refine(name => name !== "Common Chat", {
    message: "Sub Hub name cannot be 'Common Chat '"
  }),
  type: z.nativeEnum(ChannelType)
});
export const CreateChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();

  const isModalOpen = isOpen && type === "createChannel";
  const { channelType } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT,
    }
  });

  useEffect(() => {
    if (channelType) {
      form.setValue("type", channelType);
    } else {
      form.setValue("type", ChannelType.TEXT);
    }
  }, [channelType, form]);
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(params);

      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: params?.hubsId
        }
      });
      await axios.post(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose} >
      <DialogContent className="p-0 overflow-hidden text-white dark:bg-[#161618]">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-2xl font-bold text-center ">
            CREATE A SUB HUB
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            suppressHydrationWarning
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 text-xs"
          >
            <div className="px-6 space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-blue-500 uppercase dark:text-white">
                      SUB-HUB NAME
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="font-bold text-white bg-purple-900 border-0 focus-visible:ring-1 focus-visible:ring-offset-0"
                        placeholder="Enter the SUB-HUB Name."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-bold text-blue-300" />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="type" render={({ field }) => (<FormItem>
                <FormLabel>Sub Hub Type</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className="font-bold text-white capitalize bg-purple-900 border-0 outline-none focus:ring-0 ring-offset-0 focus:rignt-offset-0"
                    >
                      <SelectValue placeholder="Select A Sub Hub Type." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ChannelType).map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {
                          type.toLowerCase()
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>)}
              />
            </div>
            <DialogFooter className=" px-6 py-4 bg-[#161618] ">
              <Button
                className="p-[24px] text-xs"
                variant={"initial"}
                disabled={isLoading}
              >
                GO
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
