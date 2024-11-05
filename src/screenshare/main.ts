import path from "node:path";
import {
    BrowserWindow,
    type MessageBoxOptions,
    type Streams,
    desktopCapturer,
    dialog,
    ipcMain,
    session,
} from "electron";
import { getConfig } from "../common/config.js";

let capturerWindow: BrowserWindow;
let isDone: boolean;
const audioDialogOptions: MessageBoxOptions = {
    type: "question",
    buttons: ["Yes", "No"],
    defaultId: 1,
    title: "Screenshare audio",
    message: "Would you like to screenshare audio?",
    detail: 'Selecting "Yes" will allow viewers to hear your entire system audio during the stream. If the screenshare does not start after confirming, audio screenshare may not be available.',
};

function registerCustomHandler(): void {
    session.defaultSession.setDisplayMediaRequestHandler(
        async (request, callback) => {
            console.log(request);
            isDone = false;
            const sources = await desktopCapturer
                .getSources({
                    types: ["window", "screen"],
                })
                .catch((err) => console.error(err));

            if (!sources) return callback({});
            if (process.platform === "linux" && process.env.XDG_SESSION_TYPE?.toLowerCase() === "wayland") {
                console.log("WebRTC Capturer detected, skipping window creation.");
                const options: Streams = { video: sources[0] };
                if (sources[0] === undefined) return callback({});
                void dialog.showMessageBox(capturerWindow, audioDialogOptions).then(({ response }) => {
                    if (response === 0) {
                        callback({ video: sources[0], audio: getConfig("audio") });
                    } else {
                        callback(options);
                    }
                });
            } else {
                capturerWindow = new BrowserWindow({
                    width: 800,
                    height: 600,
                    title: "Legcord Screenshare",
                    darkTheme: true,
                    icon: getConfig("customIcon") ?? path.join(import.meta.dirname, "../", "/assets/desktop.png"),
                    frame: true,
                    autoHideMenuBar: true,
                    webPreferences: {
                        sandbox: false,
                        spellcheck: false,
                        preload: path.join(import.meta.dirname, "screenshare", "preload.mjs"),
                    },
                });
                ipcMain.once("selectScreenshareSource", (_event, id: string, name: string, audio: boolean) => {
                    isDone = true;
                    console.log(`Audio status: ${audio}`);
                    capturerWindow.close();
                    const result = { id, name };
                    let options: Streams = { video: sources[0] };
                    switch (process.platform) {
                        case "win32":
                        case "linux":
                            options = { video: result };
                            if (audio) options = { video: result, audio: getConfig("audio") };
                            callback(options);
                            break;
                        default:
                            callback({ video: result });
                    }
                });
                capturerWindow.on("closed", () => {
                    if (!isDone) callback({});
                });
                void capturerWindow.loadFile(path.join(import.meta.dirname, "html", "picker.html"));
                capturerWindow.webContents.send("getSources", sources);
            }
        },
        { useSystemPicker: true },
    );
}

registerCustomHandler();
