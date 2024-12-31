import { MacUpdater } from "electron-updater";
import { platform } from "node:os";

if (platform() === "darwin") {
    const autoUpdater = new MacUpdater({ provider: "github", repo: "Legcord", owner: "Legcord" });
    autoUpdater.checkForUpdatesAndNotify();
}
