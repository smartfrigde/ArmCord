import { contextBridge, ipcRenderer } from "electron";
import type { Keybind } from "../../@types/keybind.js";
import type { LegcordWindow } from "../../@types/legcordWindow.d.ts";
import type { Settings } from "../../@types/settings.js";
import type { ThemeManifest } from "../../@types/themeManifest.js";

interface IPCSources {
    id: string;
    name: string;
    thumbnail: HTMLCanvasElement;
}

contextBridge.exposeInMainWorld("legcord", {
    window: {
        show: () => ipcRenderer.send("win-show"),
        hide: () => ipcRenderer.send("win-hide"),
        minimize: () => ipcRenderer.send("win-minimize"),
        maximize: () => ipcRenderer.send("win-maximize"),
    },
    settings: {
        getConfig: () => ipcRenderer.sendSync("getEntireConfig") as Settings,
        setConfig: (key: string, value: string) => ipcRenderer.send("setConfig", key, value),
        addKeybind: (keybind: Keybind) => ipcRenderer.send("addKeybind", keybind),
        toggleKeybind: (id: string) => ipcRenderer.send("toggleKeybind", id),
        removeKeybind: (id: string) => ipcRenderer.send("removeKeybind", id),
        openStorageFolder: () => ipcRenderer.send("openStorageFolder"),
        setLang: (lang: string) => ipcRenderer.send("setLang", lang),
        openThemesFolder: () => ipcRenderer.send("openThemesFolder"),
        openCustomIconDialog: () => ipcRenderer.send("openCustomIconDialog"),
        copyDebugInfo: () => ipcRenderer.send("copyDebugInfo"),
        copyGPUInfo: () => ipcRenderer.send("copyGPUInfo"),
    },
    touchbar: {
        setVoiceTouchbar: (state: boolean) => ipcRenderer.send("setVoiceTouchbar", state),
        setVoiceState: (mute: boolean, deafen: boolean) => ipcRenderer.send("setVoiceState", mute, deafen),
        importGuilds: (guilds: Array<string>) => ipcRenderer.send("importGuilds", guilds),
    },
    power: {
        setPowerSaving: (state: boolean) => ipcRenderer.send("setPowerSaving", state),
        isPowerSavingEnabled: () => ipcRenderer.sendSync("isPowerSavingEnabled"),
    },
    electron: process.versions.electron,
    translations: ipcRenderer.sendSync("getTranslations") as string,
    getLang: async (toGet: string) =>
        await ipcRenderer.invoke("getLang", toGet).then((result) => {
            return result as string;
        }),
    screenshare: {
        getSources: (sources: (event: Electron.IpcRendererEvent, ...args: IPCSources[]) => void) => {
            ipcRenderer.on("getSources", sources);
        },
        start: (source: string, name: string, audio: boolean) =>
            ipcRenderer.send("startScreenshare", source, name, audio),
    },
    version: ipcRenderer.sendSync("get-app-version", "app-version") as string,
    platform: ipcRenderer.sendSync("getOS") as string,
    restart: () => ipcRenderer.send("restart"),
    themes: {
        install: async (url: string) => ipcRenderer.invoke("installBDTheme", url) as Promise<null>,
        uninstall: (id: string) => ipcRenderer.send("uninstallTheme", id),
        edit: (id: string) => ipcRenderer.send("editTheme", id),
        getThemes: () => ipcRenderer.sendSync("getThemes") as ThemeManifest[],
        openImportPicker: () => ipcRenderer.send("openImportPicker"),
        set: (id: string, state: boolean) => ipcRenderer.send("setThemeEnabled", id, state),
        folder: (id: string) => ipcRenderer.send("openThemeFolder", id),
        openQuickCssFile: () => ipcRenderer.send("openQuickCssFile"),
    },
} as unknown as LegcordWindow);

let windowCallback: (arg0: object) => void;
contextBridge.exposeInMainWorld("LegcordRPC", {
    // REVIEW - I don't think this is right
    listen: (callback: () => void) => {
        windowCallback = callback;
    },
});
ipcRenderer.on("rpc", (_event, data: object) => {
    console.log(data);
    windowCallback(data);
});
