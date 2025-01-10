import { createSignal } from "solid-js";
import type { ThemeManifest } from "../../../@types/themeManifest.js";
import { refreshThemes } from "../settings.js";
import classes from "./ThemesCard.module.css";

const {
    ui: { IconBin, Header, Switch, HeaderTags, IconCog },
} = shelter;

export const ThemesCard = (props: { theme: ThemeManifest }) => {
    const [switchState, setSwitchState] = createSignal(props.theme.enabled);

    function toggleTheme(state: boolean) {
        setSwitchState(state);
        if (props.theme.id) {
            window.legcord.themes.set(props.theme.id, switchState());
        }
        refreshThemes();
    }
    function removeTheme() {
        if (props.theme.id) {
            window.legcord.themes.uninstall(props.theme.id);
        }
        refreshThemes();
    }
    function editTheme() {
        if (props.theme.id) {
            window.legcord.themes.edit(props.theme.id);
        }
    }
    return (
        <div class={classes.card}>
            <div class={classes.info}>
                <Header tag={HeaderTags.H2}>{props.theme.name}</Header>
                <Header class={classes.eyebrow} tag={HeaderTags.EYEBROW}>
                    {props.theme.author}
                </Header>
            </div>
            <div class={classes.btnContainer}>
                <button title="Delete" type="button" onClick={removeTheme} class={classes.btn}>
                    <IconBin />
                </button>
                <button title="Edit" type="button" onClick={editTheme} class={classes.btn}>
                    <IconCog />
                </button>
            </div>
            <div class={classes.switch}>
                <Switch checked={switchState()} onChange={toggleTheme} />
            </div>
        </div>
    );
};
