import ReactDOM from "react-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/router";

const AccessCover = ({ open }: { open: boolean }) => {
  const router = useRouter();
  return <Dialog.Root open={open}></Dialog.Root>;
};

export default AccessCover;
