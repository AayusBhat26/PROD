"use client";
// package imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from 'query-string'
// shadcn imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

} from "../ui/form";

import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";

import { useModal } from "../hooks/use-modal-store";

// todo: form schema
const formSchema = z.object({

  fileUrl: z.string().min(1, {
    message:
      "Attachment is required",
  }),
});
export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === 'messageFile';
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fileUrl: "",
    },
  });
  const handleClose = () => {
    form.reset();
    onClose();
  }

  const isLoading = form.formState.isSubmitting;
  const { apiUrl, query } = data;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      })
      await axios.post(url, {
        ...values,
        content: values.fileUrl
      })
      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.log(error);

    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden text-black bg-white">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-2xl font-bold text-center">
            Attach an Attachment
          </DialogTitle>
          <DialogDescription className="text-center text-blue-300">
            Send File
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            suppressHydrationWarning
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 text-xs"
          >
            <div className="px-6 space-y-8">
              <div className="flex items-center justify-center text-center">
                {/* todo: image uploading, cloudnariy. */}
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

            </div>
            <DialogFooter className="px-6 py-4 bg-gray-100">
              <Button
                className="text-xs"
                variant={"initial"}
                disabled={isLoading}
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
