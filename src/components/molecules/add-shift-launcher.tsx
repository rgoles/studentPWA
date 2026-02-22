import { Button } from "@/components/catalyst/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ShiftAddForm } from "@/components/forms/shift-add-form";

interface AddShiftLauncherProps {
  userId: string;
  isMobile: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddShiftLauncher({
  userId,
  isMobile,
  open,
  onOpenChange,
  onSuccess,
}: Readonly<AddShiftLauncherProps>) {
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button
            className="w-full items-center"
            color={"emerald"}
            onClick={() => onOpenChange(true)}
          >
            Dodaj novu smjenu
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Add shift</DrawerTitle>
            <DrawerDescription>Enter your shift details.</DrawerDescription>
          </DrawerHeader>
          <div className="mx-5">
            <ShiftAddForm userId={userId} onSuccess={onSuccess} />
          </div>
          <DrawerFooter className="mb-8 pt-2">
            <DrawerClose asChild>
              <Button>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="w-full items-center"
          onClick={() => onOpenChange(true)}
        >
          Dodaj novu smjenu
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add shift</DialogTitle>
          <DialogDescription>Enter your shift details.</DialogDescription>
        </DialogHeader>
        <ShiftAddForm userId={userId} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
