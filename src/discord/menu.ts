import { BrowserWindow, Menu, type MenuItemConstructorOptions, app } from "electron";
import type { Keybind, KeybindActions } from "../@types/keybind.js";
import { getConfig } from "../common/config.js";
import { setForceQuit } from "../common/forceQuit.js";
import { runAction } from "../common/keybindActions.js";
import { mainWindows } from "./window.js";

export function setMenu(): void {
    const keybinds = getConfig("keybinds");
    const keybindSubMenu: { label: KeybindActions; accelerator: string; click: () => void }[] = [];
    keybinds.forEach((keybind: Keybind) => {
        if (!keybind.global && keybind.enabled) {
            keybindSubMenu.push({
                label: keybind.action,
                accelerator: keybind.accelerator,
                click: () => {
                    runAction(keybind);
                },
            });
        }
    });

    const template: MenuItemConstructorOptions[] = [
        {
            label: "Legcord",
            submenu: [
                { label: "About Legcord", role: "about" },
                { type: "separator" },
                { role: "services" },
                { type: "separator" },
                {
                    label: "Developer tools",
                    accelerator: process.platform === "darwin" ? "Cmd+Option+I" : "Ctrl+Shift+I",
                    click() {
                        BrowserWindow.getFocusedWindow()!.webContents.toggleDevTools();
                    },
                },
                {
                    label: "Open settings",
                    accelerator: "Cmd+,",
                    click() {
                        mainWindows.forEach((mainWindow) => {
                            mainWindow.show();
                            void mainWindow.webContents.executeJavaScript(`window.shelter.flux.dispatcher.dispatch({
                                "type": "USER_SETTINGS_MODAL_OPEN",
                                "section": "My Account",
                                "subsection": null,
                                "openWithoutBackstack": false
                            })`);
                            void mainWindow.webContents.executeJavaScript(
                                `window.shelter.flux.dispatcher.dispatch({type: "LAYER_PUSH", component: "USER_SETTINGS"})`,
                            );
                            // TODO - open legcord tab in settings
                        });
                    },
                },
                {
                    label: "Reload",
                    accelerator: "CmdOrCtrl+R",
                    click() {
                        mainWindows.forEach((mainWindow) => {
                            mainWindow.webContents.reloadIgnoringCache();
                        });
                    },
                },
                {
                    label: "Restart",
                    accelerator: "CmdOrCtrl+Shift+R",
                    click() {
                        app.relaunch();
                        app.exit();
                    },
                },
                { type: "separator" },
                { role: "hide" },
                { role: "hideOthers" },
                { role: "unhide" },
                { type: "separator" },
                {
                    label: "Quit",
                    accelerator: "CmdOrCtrl+Q",
                    click() {
                        setForceQuit(true);
                        app.quit();
                    },
                },
            ],
        },
        {
            label: "Edit",
            submenu: [
                {
                    label: "Undo",
                    accelerator: "CmdOrCtrl+Z",
                    click() {
                        BrowserWindow.getFocusedWindow()!.webContents.undo();
                    },
                },
                {
                    label: "Redo",
                    accelerator: "Shift+CmdOrCtrl+Z",
                    click() {
                        BrowserWindow.getFocusedWindow()!.webContents.redo();
                    },
                },
                { type: "separator" },
                { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
                { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
                { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectAll" },
            ],
        },
        {
            label: "View",
            submenu: [
                {
                    label: "Toggle Fullscreen",
                    role: "togglefullscreen",
                },
                { label: "Zoom in", accelerator: "CmdOrCtrl+Plus", role: "zoomIn" },
                // Fix for zoom in on keyboards with dedicated + like QWERTZ (or numpad)
                // See https://github.com/electron/electron/issues/14742 and https://github.com/electron/electron/issues/5256
                { label: "Zoom in", accelerator: "CmdOrCtrl+=", role: "zoomIn", visible: false },
                { label: "Zoom out", accelerator: "CmdOrCtrl+-", role: "zoomOut" },
                { type: "separator" },
                { label: "Reset zoom", accelerator: "CmdOrCtrl+0", role: "resetZoom" },
            ],
        },
        {
            label: "Window",
            submenu: [
                { label: "Minimize", accelerator: "Cmd+M", role: "minimize" },
                { label: "Close", accelerator: "Cmd+W", role: "close" },
            ],
        },
        {
            label: "Keybind",
            submenu: keybindSubMenu,
        },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
