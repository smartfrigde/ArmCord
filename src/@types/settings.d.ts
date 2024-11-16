import type { Keybind } from "./keybind.js";

export type ValidMods = "vencord" | "equicord" | "custom" | "shelter";

export type ValidTrayIcons =
    | "dynamic"
    | "dsc-tray"
    | "clsc-dsc-tray"
    | "ac_plug_colored"
    | "ac_white_plug"
    | "ac_white_plug_hollow"
    | "ac_black_plug"
    | "ac_black_plug_hollow"
    | "disabled";

export interface Settings {
    // Referenced for detecting a broken config.
    "0"?: string;
    // Only used for external url warning dialog.
    ignoreProtocolWarning?: boolean;
    customIcon: string;
    windowStyle: "default" | "native" | "overlay" | "transparent";
    channel: "stable" | "ptb" | "canary";
    audio: "loopback" | "loopbackWithMute";
    transparency: "universal" | "modern" | "none";
    legcordCSP: boolean;
    minimizeToTray: boolean;
    multiInstance: boolean;
    spellcheck: boolean;
    mods: ValidMods[];
    mobileMode: boolean;
    skipSplash: boolean;
    performanceMode: string;
    customJsBundle: RequestInfo | URL | string;
    customCssBundle: RequestInfo | URL | string;
    startMinimized: boolean;
    useLegacyCapturer: boolean;
    keybinds: Keybind[];
    hardwareAcceleration: boolean;
    inviteWebsocket: boolean;
    disableAutogain: boolean;
    disableHttpCache: boolean;
    tray: ValidTrayIcons;
    doneSetup: boolean;
    smoothScroll: boolean;
    autoScroll: boolean;
    modCache?: Record<ValidMods, string>;
}
