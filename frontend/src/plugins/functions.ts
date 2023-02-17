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
    if (chat.type === "direct" && chat.recipient?.avatar?.length > 12) {
      return (
        "https://colubrina.troplo.com/usercontent/" + chat.recipient.avatar
      );
    } else if (chat.type === "direct" && chat.recipient?.avatar) {
      return "https://i.troplo.com/i/" + chat.recipient.avatar;
    } else if (
      chat.type === "direct" &&
      !chat.recipient?.avatar &&
      chat.recipient?.legacyUser
    ) {
      return "https://i.troplo.com/i/055d077e27cf.png";
    } else if (chat.type === "group" && chat.icon?.length > 12) {
      return "https://colubrina.troplo.com/usercontent/" + chat.icon;
    } else if (chat.type === "group" && chat.icon) {
      return "https://i.troplo.com/i/" + chat.icon;
    } else {
      return undefined;
    }
  }
};
