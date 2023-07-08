import router from "@/router";
import {useAppStore} from "@/store/app";

export default function setup(): void {
  const core = useAppStore();

  document.addEventListener("paste", (e: ClipboardEvent): void => {
    if (
      ["Communications", "Communication", "Note", "Workspace Item"].includes(
        router.currentRoute.value.name as string
      )
    ) return;

    if (!e.clipboardData) return;

    console.info("[TPU/InstantUpload] Paste detected");

    if (core.dialogs.upload.loading) return;
    if (e.clipboardData.files.length > 0) {
      //@ts-ignore
      core.dialogs.upload.files = [...e.clipboardData.files];
      core.upload();
    }
  });
}
