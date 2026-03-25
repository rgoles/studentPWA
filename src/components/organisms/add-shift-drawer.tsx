import { Drawer, Modal } from "@mantine/core";
import { ShiftAddForm } from "../forms/shift-add-form";
import { XCircleIcon } from "@phosphor-icons/react";

interface AddShiftLauncherProps {
  userId: string;
  isMobile: boolean;
  opened: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddShiftDrawer = ({
  userId,
  opened,
  isMobile,
  onClose,
  onSuccess,
}: AddShiftLauncherProps) => {
  if (isMobile) {
    return (
      <div>
        <Drawer
          closeButtonProps={{
            icon: <XCircleIcon size={20} />,
          }}
          size={"xl"}
          position="bottom"
          opened={opened}
          onClose={onClose}
          title="Add new shift"
        >
          <ShiftAddForm userId={userId} onSuccess={onSuccess} />
        </Drawer>
      </div>
    );
  }
  return (
    <Modal opened={opened} onClose={close} title="Add new shift">
      <ShiftAddForm userId={userId} onSuccess={onSuccess} />
    </Modal>
  );
};
