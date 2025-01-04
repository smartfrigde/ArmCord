import { type MessageBoxOptions, type Streams, desktopCapturer, ipcMain, session } from "electron";
import { getConfig } from "../common/config.js";
import { mainWindows } from "./window.js";

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
                //const options: Streams = { video: sources[0] };
                if (sources[0] === undefined) return callback({});
            } else {
                ipcMain.once("startScreenshare", (_event, id: string, name: string, audio: boolean) => {
                    isDone = true;
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
                });
                mainWindows.every((window) => {
                    window.webContents.send("getSources", sources);
                });
            }
        },
        { useSystemPicker: false },
    );
}

registerCustomHandler();
