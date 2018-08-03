import {jsPlumbInstance} from "jsplumb";

interface IMapEditorState {
    dragInProgress  : boolean,
    height: number,
    input: HTMLDivElement | null,
    jsPlumbInstance : jsPlumbInstance | null,
    focusedNodes : string[],
    width: number,
}

export default IMapEditorState;