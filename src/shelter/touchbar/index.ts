/// <reference path="../../../node_modules/@uwu/shelter-defs/dist/shelter-defs/rootdefs.d.ts" />

const {
    util: { log },
    flux: { dispatcher, storesFlat },
} = shelter;

function updateVoiceState() {
    const { mute, deaf } = storesFlat.MediaEngineStore.getSettings();
    log(`[Touchbar] Setting voice state: mute: ${mute}, deaf: ${deaf}`);
    window.legcord.touchbar.setVoiceState(mute, deaf);
}

function track(payload: { event: string; properties: { enabled: string } }) {
    if (payload.event === "join_voice_channel") {
        window.legcord.touchbar.setVoiceTouchbar(true);
    } else if (payload.event === "leave_voice_channel") {
        window.legcord.touchbar.setVoiceTouchbar(false);
    }
}

export function onLoad() {
    log("Legcord Touchbar Integration");
    updateVoiceState();
    dispatcher.subscribe("TRACK", track);
    dispatcher.subscribe("AUDIO_TOGGLE_SELF_MUTE", updateVoiceState);
    dispatcher.subscribe("AUDIO_TOGGLE_SELF_DEAF", updateVoiceState);
}
export function onUnload() {
    dispatcher.unsubscribe("TRACK", track);
}
