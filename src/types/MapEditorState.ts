import {jsPlumbInstance} from "jsplumb";

interface IMapEditorState {
    activeScope: string | null;
    dragInProgress  : boolean,
    height: number,
    input: HTMLDivElement | null,
    jsPlumbInstance : jsPlumbInstance | null,
    focusedNodes : string[],
    width: number,
}

export default IMapEditorState;