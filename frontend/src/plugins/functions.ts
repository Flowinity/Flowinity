import md from "./rules";
import mdEmail from "./rulesEmail";
import rules from "@/plugins/rules";
import { useAppStore } from "@/store/app";
export default {
  fileSize(size: number): string {
    let i = -1;
    let byteUnits = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    do {
      size = size / 1024;
      i++;
    } while (size > 1024);

    return Math.max(size, 0.1).toFixed(1) + byteUnits[i];
  },
  copy(text: string): void {
    navigator.clipboard.writeText(text);
  },
  doSinglePulse(type: string, other: object, timeOnPage?: number) {
    window.socket.emit("pulse", {
      action: type,
      timeSpent: timeOnPage || 0,
      route: window.location.pathname,
      device: navigator.platform,
      sysInfo: {
        ua: navigator.userAgent
      },
      name: null,
      other
    });
  },
  avatar(chat: any) {
    const app = useAppStore();
    if (!chat) return undefined;
    if (chat.username) {
      if (chat.avatar?.length > 20) {
        return "https://colubrina.troplo.com/usercontent/" + chat.avatar;
      } else if (chat.avatar) {
        return app.domain + chat.avatar;
      } else {
        return undefined;
      }
    }
    if (chat.type === "direct" && chat.recipient?.avatar?.length > 20) {
      return (
        "https://colubrina.troplo.com/usercontent/" + chat.recipient.avatar
      );
    } else if (chat.type === "direct" && chat.recipient?.avatar) {
      return app.domain + chat.recipient.avatar;
    } else if (
      chat.type === "direct" &&
      !chat.recipient?.avatar &&
      chat.recipient?.legacyUser
    ) {
      return undefined;
    } else if (chat.type === "group" && chat.icon?.length > 20) {
      return "https://colubrina.troplo.com/usercontent/" + chat.icon;
    } else if (chat.type === "group" && chat.icon) {
      return app.domain + chat.icon;
    } else {
      return undefined;
    }
  },
  markdown(text: string): any {
    return md.render(text);
  },
  markdownEmail(text: string): any {
    return mdEmail.render(text);
  },
  userStatus(status: "online" | "offline" | "idle" | "busy" | "invisible") {
    switch (status) {
      case "online":
        return {
          color: "success",
          text: "Online"
        };
      case "idle":
        return {
          color: "warning",
          text: "Idle"
        };
      case "busy":
        return {
          color: "error",
          text: "Busy"
        };
      case "invisible":
        return {
          color: "grey",
          text: "Invisible"
        };
      default:
        return {
          color: "grey",
          text: "Offline"
        };
    }
  },
  base64ToFile(base64: string, fileName: string = "file.png") {
    // Split the base64 string into two parts
    const parts = base64.split(";base64,");

    // Create a byte array from the base64 data
    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob object from the byte array and file type
    const blob = new Blob([byteArray], { type: parts[0].split(":")[1] });

    // Create a File object from the Blob and file name
    return new File([blob], fileName, { type: blob.type });
  },
  checkScope(requiredScope: string | undefined, scope: string | undefined) {
    if (!scope || !requiredScope) {
      return true;
    }
    if (scope === "*") {
      return true;
    }
    // scope is the current session scope, and requiredScope is the scope required for the route, formatted like user.read or user.write
    // check if the required scope is contained in the current scope, comma separated
    const scopes = scope.split(",");
    for (const scope of scopes) {
      if (scope === requiredScope) {
        return true;
      }
      if (scope?.split(".")[0] === requiredScope) {
        return true;
      }
    }
    return false;
  }
};
