import { For, createSignal } from "solid-js";
import type { ThemeManifest } from "../../../@types/themeManifest.js";
import { ThemesCard } from "../components/ThemesCard.jsx";
import { refreshThemes } from "../settings.js";
import classes from "./ThemesPages.module.css";

const {
    ui: { Button, Header, HeaderTags, ButtonSizes, Divider, TextBox, showToast },
    plugin: { store },
} = shelter;

export function ThemesPage() {
    const [downloadUrl, setDownloadUrl] = createSignal("");
    refreshThemes();

    function installTheme() {
        window.legcord.themes.install(downloadUrl());
        setDownloadUrl("");
        setTimeout(() => {
            refreshThemes();
        }, 1000);
        showToast({
            title: "Success!",
            content: "BD theme successfully installed!",
            duration: 3000,
        });
    }
    return (
        <>
            <Header tag={HeaderTags.H1}>Themes</Header>
            <Divider mt mb />
            <div class={classes.buttonBox}>
                <Button size={ButtonSizes.LARGE} onClick={window.legcord.themes.openQuickCssFile}>
                    Open Quick CSS file
                </Button>
                <Button size={ButtonSizes.LARGE} onClick={window.legcord.themes.openImportPicker}>
                    Import from file
                </Button>
                <Button size={ButtonSizes.LARGE} onClick={window.legcord.settings.openThemesFolder}>
                    Open themes folder
                </Button>
            </div>
            <div class={classes.addBox}>
                <TextBox
                    value={downloadUrl()}
                    onInput={setDownloadUrl}
                    placeholder="https://raw.githubusercontent.com/... [.theme.css]"
                />
                <Button size={ButtonSizes.MEDIUM} onClick={installTheme}>
                    Import
                </Button>
            </div>
            <For each={store.themes}>{(theme: ThemeManifest) => <ThemesCard theme={theme} />}</For>
        </>
    );
}
