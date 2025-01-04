import classes from "./ScreensharePicker.module.css";
export interface IPCSources {
    id: string;
    name: string;
    thumbnail: HTMLCanvasElement;
}
interface SourceCardProps {
    source: IPCSources;
    onSelect: (id: string, name: string) => void;
}

export const SourceCard = ({ source, onSelect }: SourceCardProps) => {
    return (
        <div
            onClick={() => onSelect(source.id, source.name)}
            onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    onSelect(source.id, source.name);
                }
            }}
            class={classes.card}
        >
            <img src={source.thumbnail.toDataURL()} alt={source.name} style={{ width: "160px", height: "90px" }} />
            <div>{source.name}</div>
        </div>
    );
};
