import { For } from "solid-js";
import type { ThemeManifest } from "../../../@types/themeManifest.js";
import { ThemesCard } from "../components/ThemesCard.jsx";

const {
    ui: { Button, Header, HeaderTags, ButtonSizes, Divider },
    plugin: { store },
} = shelter;

export function ThemesPage() {
    return (
        <>
            <Header tag={HeaderTags.H1}>Themes</Header>
            <Divider mt mb />
            <Button size={ButtonSizes.MAX} onClick={window.legcord.themes.openQuickCssFile}>
                Open Quick CSS file
            </Button>
            <Divider mt mb />
            <Button size={ButtonSizes.MAX} onClick={window.legcord.settings.openThemesFolder}>
                Open themes folder
            </Button>
            <For each={store.themes}>{(theme: ThemeManifest) => <ThemesCard theme={theme} />}</For>
        </>
    );
}
