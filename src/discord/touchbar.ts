import { join } from "node:path";
import { TouchBar, nativeImage } from "electron";
import { deafenToggle, leaveCall, muteToggle } from "../common/keybindActions.js";

const { TouchBarButton, TouchBarSpacer } = TouchBar;

const muteIcon = nativeImage.createFromPath(join(import.meta.dirname, "../", "/assets/mute.png"));
const unmuteIcon = nativeImage.createFromPath(join(import.meta.dirname, "../", "/assets/mute-off.png"));

const deafenIcon = nativeImage.createFromPath(join(import.meta.dirname, "../", "/assets/deafen.png"));
const undeafenIcon = nativeImage.createFromPath(join(import.meta.dirname, "../", "/assets/deafen-off.png"));

const disconnectIcon = nativeImage.createFromPath(join(import.meta.dirname, "../", "/assets/disconnect.png"));

export function setVoiceState(muteState: boolean, deafenState: boolean) {
    console.log("[Touchbar] Setting voice state");

    mute.icon = muteState ? muteIcon : unmuteIcon;
    deafen.icon = deafenState ? deafenIcon : undeafenIcon;
}
const mute = new TouchBarButton({
    icon: muteIcon,
    click: () => {
        muteToggle();
    },
});

const deafen = new TouchBarButton({
    icon: muteIcon,
    click: () => {
        deafenToggle();
    },
});

const disconnect = new TouchBarButton({
    icon: disconnectIcon,
    backgroundColor: "#df4e4b",
    click: () => {
        leaveCall();
    },
});

export const voiceTouchBar = new TouchBar({
    items: [mute, new TouchBarSpacer({ size: "small" }), deafen, new TouchBarSpacer({ size: "large" }), disconnect],
});
