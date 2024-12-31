import { existsSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
    type BrowserWindow,
    type SourcesOptions,
    app,
    clipboard,
    desktopCapturer,
    dialog,
    ipcMain,
    shell,
} from "electron";

import isDev from "electron-is-dev";
import type { Keybind } from "../@types/keybind.js";
import type { Settings } from "../@types/settings.js";
import { getConfig, getConfigLocation, setConfig, setConfigBulk } from "../common/config.js";
import { getLang, getLangName, getRawLang, setLang } from "../common/lang.js";
import { getDisplayVersion, getVersion } from "../common/version.js";
import { splashWindow } from "../splash/main.js";
import { createTManagerWindow } from "../themeManager/main.js";
import { refreshGlobalKeybinds } from "./globalKeybinds.js";
import { importGuilds, mainTouchBar, setVoiceState, voiceTouchBar } from "./touchbar.js";

const userDataPath = app.getPath("userData");
const storagePath = path.join(userDataPath, "/storage/");
const themesPath = path.join(userDataPath, "/themes/");
const pluginsPath = path.join(userDataPath, "/plugins/");
const quickCssPath = path.join(userDataPath, "/quickCss.css");

function ifExistsRead(path: string): string | undefined {
    if (existsSync(path)) return readFileSync(path, "utf-8");
}

export function registerIpc(passedWindow: BrowserWindow): void {
    ipcMain.handle("getShelterBundle", () => {
        return {
            js: ifExistsRead(path.join(app.getPath("userData"), "shelter.js")),
            enabled: true,
        };
    });
    ipcMain.handle("getVencordBundle", () => {
        return {
            js: ifExistsRead(path.join(app.getPath("userData"), "vencord.js")),
            css: ifExistsRead(path.join(app.getPath("userData"), "vencord.css")),
            enabled: getConfig("mods").includes("vencord"),
        };
    });
    ipcMain.handle("getEquicordBundle", () => {
        return {
            js: ifExistsRead(path.join(app.getPath("userData"), "equicord.js")),
            css: ifExistsRead(path.join(app.getPath("userData"), "equicord.css")),
            enabled: getConfig("mods").includes("equicord"),
        };
    });
    ipcMain.handle("getCustomBundle", () => {
        const enabled = getConfig("mods").includes("custom");
        if (enabled) {
            return {
                js: ifExistsRead(path.join(app.getPath("userData"), "custom.js")),
                css: ifExistsRead(path.join(app.getPath("userData"), "custom.css")),
                enabled,
            };
        }
    });
    ipcMain.on("splashEnd", () => {
        splashWindow.close();
        if (getConfig("startMinimized")) {
            passedWindow.hide();
        } else {
            passedWindow.show();
        }
    });
    ipcMain.on("setLang", (_event, lang: string) => {
        setLang(lang);
    });
    ipcMain.on("setVoiceTouchbar", (_event, state: boolean) => {
        if (state) {
            passedWindow.setTouchBar(voiceTouchBar);
        } else {
            passedWindow.setTouchBar(mainTouchBar);
        }
    });
    ipcMain.on("importGuilds", (_event, array: Array<string>) => {
        importGuilds(array);
    });
    ipcMain.on("setVoiceState", (_event, mute: boolean, deafen: boolean) => {
        setVoiceState(mute, deafen);
    });
    ipcMain.on("getLangSync", (event, toGet: string) => {
        event.reply("langString", getLang(toGet));
    });
    ipcMain.handle("getLang", (_event, toGet: string) => {
        return getLang(toGet);
    });

    ipcMain.on("win-maximize", () => {
        passedWindow.maximize();
    });
    ipcMain.on("win-isMaximized", (event) => {
        event.returnValue = passedWindow.isMaximized();
    });
    ipcMain.on("win-isNormal", (event) => {
        event.returnValue = passedWindow.isNormal();
    });
    ipcMain.on("win-minimize", () => {
        passedWindow.minimize();
    });
    ipcMain.on("win-unmaximize", () => {
        passedWindow.unmaximize();
    });
    ipcMain.on("win-show", () => {
        passedWindow.show();
    });
    ipcMain.on("win-hide", () => {
        passedWindow.hide();
    });
    ipcMain.on("win-quit", () => {
        app.quit();
    });
    ipcMain.on("get-app-version", (event) => {
        event.returnValue = getVersion();
    });
    ipcMain.on("displayVersion", (event) => {
        event.returnValue = getDisplayVersion();
    });
    ipcMain.on("restart", () => {
        app.relaunch();
        app.exit();
    });
    ipcMain.on("isDev", (event) => {
        event.returnValue = isDev;
    });
    ipcMain.on("setConfig", (_event, key: keyof Settings, value: string) => {
        setConfig(key, value);
    });
    ipcMain.on("addKeybind", (_event, keybind: Keybind) => {
        const keybinds = getConfig("keybinds");
        keybinds.push(keybind);
        setConfig("keybinds", keybinds);
        refreshGlobalKeybinds();
    });
    ipcMain.on("toggleKeybind", (_event, id: string) => {
        const keybinds = getConfig("keybinds");
        const keybind = keybinds[keybinds.findIndex((x) => x.id === id)];
        keybind.enabled = !keybind.enabled;
        setConfig("keybinds", keybinds);
        refreshGlobalKeybinds();
    });
    ipcMain.on("removeKeybind", (_event, id: string) => {
        const keybinds = getConfig("keybinds");
        keybinds.splice(
            keybinds.findIndex((x) => x.id === id),
            1,
        );
        setConfig("keybinds", keybinds);
        refreshGlobalKeybinds();
    });
    ipcMain.on("getEntireConfig", (event) => {
        const rawData = readFileSync(getConfigLocation(), "utf-8");
        event.returnValue = JSON.parse(rawData) as Settings;
    });
    ipcMain.on("getTranslations", (event) => {
        event.returnValue = getRawLang();
    });
    ipcMain.on("getConfig", (event, arg: keyof Settings) => {
        event.returnValue = getConfig(arg);
    });
    ipcMain.on("openThemesWindow", () => {
        void createTManagerWindow();
    });
    // NOTE - I assume this would return sources based on the fact that the function only ingests sources
    ipcMain.handle("DESKTOP_CAPTURER_GET_SOURCES", (_event, opts: SourcesOptions) => desktopCapturer.getSources(opts));
    ipcMain.on("saveSettings", (_event, args: Settings) => {
        console.log(args);
        setConfigBulk(args);
    });
    ipcMain.on("openStorageFolder", () => {
        shell.showItemInFolder(storagePath);
    });
    ipcMain.on("openThemesFolder", () => {
        shell.showItemInFolder(themesPath);
    });
    ipcMain.on("openPluginsFolder", () => {
        shell.showItemInFolder(pluginsPath);
    });
    ipcMain.on("openQuickCssFile", () => {
        void shell.openPath(quickCssPath);
    });
    ipcMain.on("openCrashesFolder", () => {
        shell.showItemInFolder(path.join(app.getPath("temp"), `${app.getName()} Crashes`));
    });
    ipcMain.on("getLangName", (event) => {
        event.returnValue = getLangName();
    });
    ipcMain.on("crash", () => {
        process.crash();
    });
    ipcMain.on("getOS", (event) => {
        event.returnValue = process.platform;
    });
    ipcMain.on("copyDebugInfo", () => {
        const settingsFileContent = readFileSync(getConfigLocation(), "utf-8");
        clipboard.writeText(
            `**OS:** ${os.platform()} ${os.version()}\n**Architecture:** ${os.arch()}\n**Legcord version:** ${getVersion()}\n**Electron version:** ${
                process.versions.electron
            }\n\`${settingsFileContent}\``,
        );
    });
    ipcMain.on("copyGPUInfo", () => {
        clipboard.writeText(JSON.stringify(app.getGPUFeatureStatus()));
    });
    ipcMain.on("openCustomIconDialog", () => {
        dialog
            .showOpenDialog({
                properties: ["openFile"],
                filters: [{ name: "Icons", extensions: ["ico", "png", "icns"] }],
            })
            .then((result) => {
                if (result.canceled) return;
                console.log(result.filePaths[0]);
                setConfig("customIcon", result.filePaths[0]);
            });
    });
}
