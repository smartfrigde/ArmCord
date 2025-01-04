import type { IPCSources } from "../shelter/screenshare/components/SourceCard.tsx";
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
        importGuilds: (array: Array<string>) => void;
    };
    power: {
        setPowerSaving: (state: boolean) => void;
        isPowerSavingEnabled: () => boolean;
    };
    screenshare: {
        getSources: () => void;
        start: (id: string, name: string, audio: boolean) => void;
        cancel: () => void;
    };
}
