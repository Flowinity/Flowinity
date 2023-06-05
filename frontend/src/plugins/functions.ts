import md from "./rules";
import mdEmail from "./rulesEmail";
import { useAppStore } from "@/store/app";
import { Chat } from "@/models/chat";
import { User } from "@/models/user";

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
  avatar(chat?: Chat | User) {
    const app = useAppStore();
    if (!chat) return undefined;
    if ("username" in chat) {
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
  richMessage(content: string) {
    const regex = /\\?&lt;(@\d+)&gt;/g;
    const mentions = content.match(regex);
    if (mentions) {
      for (const mention of mentions) {
        const userId = mention.match(/&lt;@(\d+)&gt;/)![1];
        const user = window.tpuInternals.lookupUser(parseInt(userId));
        if (user.id) {
          content = content.replace(
            mention,
            `<span class="pointer unselectable mention" onclick="window.tpuInternals.openUser(${user.id})"><i class="mdi-at mdi v-icon notranslate v-icon--size-small" aria-hidden="true"></i>${user.username}</span>`
          );
        } else {
          content = content.replace(
            mention,
            `<span class="unselectable mention"><i class="mdi-at mdi v-icon notranslate v-icon--size-small" aria-hidden="true"></i>${user.username}</span>`
          );
        }
      }
    }
    const channels = content.match(/\\?&lt;#\d+&gt;/g);
    if (channels) {
      for (const channel of channels) {
        const channelId = channel.match(/&lt;#(\d+)&gt;/)![1];
        const channelData = window.tpuInternals.lookupChat(parseInt(channelId));
        if (channelData.id) {
          content = content.replace(
            channel,
            `<span class="pointer unselectable mention" onclick="window.tpuInternals.setChat(${channelData?.association?.id})"><i class="mdi-pound mdi v-icon notranslate v-icon--size-small" aria-hidden="true"></i>${channelData.name}</span>`
          );
        } else {
          content = content.replace(
            channel,
            `<span class="unselectable mention"><i class="mdi-pound mdi v-icon notranslate v-icon--size-small" aria-hidden="true"></i>${channelData.name}</span>`
          );
        }
      }
    }
    const collections = content.match(/\\?&lt;&amp;\d+&gt;/g);
    if (collections) {
      for (const collection of collections) {
        const collectionId = collection.match(/&lt;&amp;(\d+)&gt;/)![1];
        const collectionData = window.tpuInternals.lookupCollection(
          parseInt(collectionId)
        );
        if (collectionData.id) {
          content = content.replace(
            collection,
            `<span class="pointer unselectable mention" onclick="window.tpuInternals.openCollection(${collectionData.id})"><i class="mdi-folder-multiple-image mdi v-icon notranslate v-icon--size-small" aria-hidden="true"></i> ${collectionData.name}</span>`
          );
        } else {
          content = content.replace(
            collection,
            `<span class="unselectable mention"><i class="mdi-folder-multiple-image mdi v-icon notranslate v-icon--size-small" aria-hidden="true"></i> No Permission</span>`
          );
        }
      }
    }
    return content;
  },
  markdown(text: string): any {
    return this.richMessage(md.render(text));
  },
  markdownEmail(text: string): any {
    return mdEmail.render(text);
  },
  userStatus(status: "online" | "offline" | "idle" | "busy" | "invisible") {
    switch (status) {
      case "online":
        return {
          color: "#4caf50",
          text: "Online"
        };
      case "idle":
        return {
          color: "#ff9800",
          text: "Idle"
        };
      case "busy":
        return {
          color: "#f44336",
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
  checkScope(
    requiredScope: string | undefined | string[],
    scope: string | undefined
  ) {
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
      if (typeof requiredScope === "string") {
        if (scope === requiredScope) {
          return true;
        } else if (scope?.split(".")[0] === requiredScope) {
          return true;
        }
      } else {
        if (requiredScope.includes(scope)) {
          return true;
        } else if (requiredScope.includes(scope?.split(".")[0])) {
          return true;
        }
      }
    }
    return false;
  },
  uuid() {
    return self.crypto.randomUUID();
  },
  charUp(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
