import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

/**
 * BookingInquiryDialog — shell only. The submit handler is a TODO for
 * Stage 3 once Supabase is provisioned (see NEXT_STEPS.md). Structure and
 * fields are preserved so Stage 3 can wire supabase.functions.invoke
 * ("send-booking-inquiry") without reshaping the form.
 */

export type BookingInquiryDialogProps = {
  triggerLabel?: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
};

export const BookingInquiryDialog = ({
  triggerLabel = "Send an inquiry",
  variant = "default",
  className,
}: BookingInquiryDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO (Stage 3): wire to supabase.functions.invoke("send-booking-inquiry").
    toast.success("Inquiry form not yet wired. Returning in Stage 3.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-light">Send an inquiry</DialogTitle>
          <DialogDescription>
            A named specialist will respond personally. No queue, no auto-reply.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-2" onSubmit={handleSubmit}>
          {/* Honeypot — bots fill this in; we reject server-side once wired. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={4} required />
          </div>
          <DialogFooter>
            <Button type="submit" className="rounded-full">
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingInquiryDialog;
