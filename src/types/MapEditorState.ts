import {jsPlumbInstance} from "jsplumb";

interface IMapEditorState {
    activeScope: {scopeId:string,sourceId:string} | null;
    dragInProgress  : boolean,
    height: number,
    input: HTMLDivElement | null,
    jsPlumbInstance : jsPlumbInstance | null,
    nodeDroppedOntoId : string | null
    focusedNodes : string[],
    width: number,
}

export default IMapEditorState;