import { join } from "node:path";
import { Menu, Tray, app, nativeImage } from "electron";
import { getConfig } from "../common/config.js";
import { setForceQuit } from "../common/forceQuit.js";
import { getDisplayVersion } from "../common/version.js";
import { createInviteWindow, mainWindows } from "./window.js";
export let tray: Tray;

export function createTray() {
    let trayIcon = getConfig("tray");
    if (trayIcon === "disabled") {
        return;
    }
    if (trayIcon === "dynamic") {
        trayIcon = "ac_plug_colored";
    }
    let trayImg = nativeImage.createFromPath(join(import.meta.dirname, "../", `/assets/${trayIcon}.png`));
    switch (process.platform) {
        case "win32":
            trayImg = trayImg.resize({ height: 16 });
            break;
        case "darwin":
            trayImg = trayImg.resize({ height: 18 });
            break;
        case "linux":
            trayImg = trayImg.resize({ height: 24 });
            break;
    }

    tray = new Tray(trayImg);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: `Legcord ${getDisplayVersion()}`,
            icon: trayImg,
            enabled: false,
        },
        {
            type: "separator",
        },
        {
            label: "Open Legcord",
            click() {
                mainWindows.forEach((mainWindow) => {
                    mainWindow.show();
                });
            },
        },
        {
            label: "Open Settings",
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
                });
            },
        },
        {
            label: "Support Discord Server",
            click() {
                void createInviteWindow("TnhxcqynZ2");
            },
        },
        {
            type: "separator",
        },
        {
            label: "Quit Legcord",
            click() {
                setForceQuit(true);
                app.quit();
            },
        },
    ]);
    tray.setContextMenu(contextMenu);

    tray.setToolTip("Legcord");
    tray.on("click", () => {
        mainWindows.forEach((mainWindow) => {
            mainWindow.show();
        });
    });
}
