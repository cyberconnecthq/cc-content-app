import ReactDOM from "react-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/router";

const AccessCover = ({ open }: { open: boolean }) => {
  const router = useRouter();
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal className="absolute top-0">
        <Dialog.Overlay className="bg-neutral-400/30 fixed inset-0 backdrop-blur-md" />
        <Dialog.Content className="flex fixed flex-col justify-start items-center w-full h-full top-80">
          <Dialog.Title className="text-5xl">
            🔒 This post is protected.
          </Dialog.Title>
          <Dialog.Description className="mt-6 flex flex-col gap-y-16">
            <button className="text-slate bg-green-400 rounded-md px-2 py-1">
              Collect to view
            </button>
            <button
              className="text-slate bg-black-100 rounded-md px-2 py-1"
              onClick={() => router.back()}
            >
              {"< Back"}
            </button>
          </Dialog.Description>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AccessCover;
