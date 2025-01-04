import classes from "./SourceCard.module.css";
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
        <div onClick={() => onSelect(source.id, source.name)} onKeyUp={() => {}} class={classes.card}>
            <img src={source.thumbnail.toDataURL()} alt={source.name} style={{ width: "160px", height: "90px" }} />
            <p class={classes.name}>{source.name}</p>
        </div>
    );
};
