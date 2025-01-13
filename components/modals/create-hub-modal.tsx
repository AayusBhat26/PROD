"use client";
// package imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import { useModal } from "../hooks/use-modal-store";

// todo: form schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: "HUB with this personality requires a better Name!!!",
  }),
  imageUrl: z.string().min(1, {
    message:
      "To build a better HUB, profile picture works as the cherry on the Cake.",
  }),
});
export const CreateHubModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();


  const isModalOpen = isOpen && type === "createServer";

  // todo: form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {
      const data = await axios.post("/api/hubs/", values)
      // console.log(data);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);

    }
  };
  const handleClose = () => {
    form.reset();
    onClose();
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden text-black bg-white">
        <Dialog>
          <DialogTitle className="text-2xl font-bold text-center">
            CREATE A HUB
          </DialogTitle>
          <DialogDescription className="text-center text-blue-300">
            Provide your HUB a personality make over.
          </DialogDescription>
        </Dialog>
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
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="hubImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-blue-500 uppercase dark:text-secondary/60">
                      HUB NAME
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="text-black border-0 bg-zinc-300/40 focus-visible:ring-1 focus-visible:ring-offset-0"
                        placeholder="Enter the HUB Name."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-bold text-blue-300" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-4 bg-gray-100">
              <Button
                className="text-xs"
                variant={"initial"}
                disabled={isLoading}
              >
                Create the DAMN HUB!!!
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
