import path from "node:path";
import { app, shell } from "electron";
import type { Keybind } from "../@types/keybind.js";
import { mainWindows } from "../discord/window.js";
let isAudioEngineEnabled = false;

export function runAction(keybind: Keybind) {
    switch (keybind.action) {
        case "mute":
            muteToggle();
            break;
        case "deafen":
            deafenToggle();
            break;
        case "navigateBack":
            navigateBack();
            break;
        case "navigateForward":
            navigateForward();
            break;
        case "openQuickCss":
            openQuickCss();
            break;
        case "runJavascript":
            if (!keybind.js) break;
            runJavascript(keybind.js);
            break;
    }
}

function audioEngineCheck() {
    if (!isAudioEngineEnabled) {
        mainWindows.forEach((window) => {
            void window.webContents.executeJavaScript(`
                window.shelter.flux.dispatcher.dispatch({"type": "MEDIA_ENGINE_SET_AUDIO_ENABLED","enabled": true,"unmute": true });
            `);
            isAudioEngineEnabled = true;
        });
    }
}
export function muteToggle() {
    console.log("[Keybind action] Mute");
    audioEngineCheck();
    mainWindows.forEach((window) => {
        void window.webContents.executeJavaScript(`
                window.shelter.flux.dispatcher.dispatch({
                    "type": "AUDIO_TOGGLE_SELF_MUTE",
                    "context": "default",
                    "syncRemote": true,
                    "skipMuteUnmuteSoundEffect": false
                })
                `);
    });
}

export function deafenToggle() {
    console.log("[Keybind action] Deafen");
    audioEngineCheck();
    mainWindows.forEach((window) => {
        void window.webContents.executeJavaScript(`
        window.shelter.flux.dispatcher.dispatch({
            "type": "AUDIO_TOGGLE_SELF_DEAF",
            "context": "default",
            "syncRemote": true
        })
        `);
    });
}

export function leaveCall() {
    console.log("[Keybind action] Leave call");
    mainWindows.forEach((window) => {
        void window.webContents.executeJavaScript(`
        window.shelter.flux.dispatcher.dispatch({
            "type": "VOICE_CHANNEL_SELECT",
            "channelId": null,
            "currentVoiceChannelId": "",
            "video": false,
            "stream": false
        })
        `);
    });
}

function navigateBack() {
    mainWindows.forEach((window) => {
        window.webContents.navigationHistory.goBack();
    });
}

function navigateForward() {
    mainWindows.forEach((window) => {
        window.webContents.navigationHistory.goForward();
    });
}

function openQuickCss() {
    void shell.openPath(path.join(app.getPath("userData"), "/quickCss.css"));
}

function runJavascript(js: string) {
    mainWindows.forEach((window) => {
        window.webContents.executeJavaScript(js);
    });
}
