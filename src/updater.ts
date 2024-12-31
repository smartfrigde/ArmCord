import { platform } from "node:os";
import { MacUpdater } from "electron-updater";

if (platform() === "darwin") {
    const autoUpdater = new MacUpdater({ provider: "github", repo: "Legcord", owner: "Legcord" });
    autoUpdater.checkForUpdatesAndNotify();
}
