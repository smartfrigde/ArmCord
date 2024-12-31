import type { Keybind } from "./keybind.js";
import type { Settings } from "./settings.js";

export interface LegcordWindow {
    window: {
        show: () => void;
        hide: () => void;
        minimize: () => void;
        maximize: () => void;
    };
    electron: string;
    getLang: (toGet: string) => Promise<string>;
    getDisplayMediaSelector: () => Promise<string>;
    version: string;
    platform: string;
    openThemesWindow: () => void;
    openQuickCssFile: () => void;
    restart: () => void;
    translations: string;
    settings: {
        getConfig: () => Readonly<Settings>;
        setConfig: <K extends keyof Settings>(object: K, toSet: Settings[K]) => void;
        openStorageFolder: () => void;
        openThemesFolder: () => void;
        openCustomIconDialog: () => void;
        copyDebugInfo: () => void;
        copyGPUInfo: () => void;
        setLang(lang: string): () => void;
        addKeybind: (keybind: Keybind) => void;
        toggleKeybind: (id: string) => void;
        removeKeybind: (id: string) => void;
    };
    touchbar: {
        setVoiceTouchbar: (state: boolean) => void;
        setVoiceState: (mute: boolean, deafen: boolean) => void;
    };
}

declare global {
    interface Window {
        legcord: LegcordWindow;
    }
}
