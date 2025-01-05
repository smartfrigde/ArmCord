import { ScreensharePicker } from "./components/ScreensharePicker.jsx";
import type { IPCSources } from "./components/SourceCard.jsx";

const {
    util: { log },
    flux: {
        stores: { UserStore, MediaEngineStore },
        dispatcher,
    },
    ui: { openModal },
    plugin: { store },
} = shelter;

store.fps ??= 30; // set default
store.resolution ??= 720; // set default

function onStreamQualityChange() {
    // @ts-expect-error fix types
    const mediaConnections = [...MediaEngineStore.getMediaEngine().connections];
    // @ts-expect-error fix types
    const currentUserId = UserStore.getCurrentUser().id;
    const streamConnection = mediaConnections.find((connection) => connection.streamUserId === currentUserId);
    if (streamConnection) {
        streamConnection.videoStreamParameters[0].maxFrameRate = store.fps;
        streamConnection.videoStreamParameters[0].maxResolution.height = store.resolution;
        streamConnection.videoStreamParameters[0].maxResolution.width = Math.round(store.resolution * (16 / 9));
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateMin =
            window.legcord.settings.getConfig().bitrateMin;
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateMax =
            window.legcord.settings.getConfig().bitrateMax;
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateTarget =
            window.legcord.settings.getConfig().bitrateTarget;
        log(`Patched current user stream with resolution: ${store.resolution} and fps: ${store.fps}`);
    }
}
export function onLoad() {
    log("Legcord Screenshare Module");
    // @ts-expect-error fix types
    window.legcord.screenshare.getSources((_event: Event, sources: IPCSources[]) => {
        openModal(({ close }: { close: () => void }) => <ScreensharePicker sources={sources} close={close} />);
    });
    dispatcher.subscribe("MEDIA_ENGINE_VIDEO_SOURCE_QUALITY_CHANGED", onStreamQualityChange);
}

export function onUnload() {
    dispatcher.unsubscribe("MEDIA_ENGINE_VIDEO_SOURCE_QUALITY_CHANGED", onStreamQualityChange);
}
