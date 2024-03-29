import { Dialog } from "@headlessui/react";
import { useState } from "react";

export default function SimpleDialog({ children, title, description }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Dialog
      className="fixed inset-0 z-10 overflow-y-auto"
      open={isOpen}
      onClose={() => setIsOpen(true)}
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-opacity-50 bg-gray-900" />
        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block w-full max-w-lg p-5 overflow-hidden text-left align-middle transition-all transform bg-gray-100 shadow-xl rounded-2xl dark:bg-gray-800 dark:text-gray-300">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300"
          >
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 pb-2 dark:text-gray-400">{description}</Dialog.Description>

          {children}
        </div>
      </div>
    </Dialog>
  );
}
