import { type Streams, desktopCapturer, ipcMain, session } from "electron";
import { getConfig } from "../common/config.js";
import { mainWindows } from "./window.js";

let isDone: boolean;

export function registerCustomHandler(): void {
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
                console.log("WebRTC Capturer detected, using native window picker.");
                if (sources[0] === undefined) return callback({});
            }
            ipcMain.once("startScreenshare", (_event, id: string, name: string, audio: boolean) => {
                isDone = true;
                console.log(`ID: ${id}`);
                if (id === "none") {
                    try {
                        callback({});
                    } catch (e) {}
                } else {
                    console.log(`Audio status: ${audio}`);
                    const result = { id, name };
                    console.log(result);
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
                }
            });
            mainWindows.every((window) => {
                window.webContents.send("getSources", sources);
            });
        },
        { useSystemPicker: getConfig("useMacSystemPicker") },
    );
}
