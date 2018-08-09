import {jsPlumbInstance} from "jsplumb";

interface IMapEditorState {
    activeScope: {scopeId:string,sourceId:string} | null;
    dragInProgress  : boolean,
    height: number,
    input: HTMLDivElement | null,
    jsPlumbInstance : jsPlumbInstance | null,
    nodeDroppedOntoId : string | null
    focusedConnections: Array<{
        sourceId:string,
        targetId:string,
        scope:string
    }>,
    focusedNodes : string[],
    mouseDrag : boolean,
    mouseDragStart? : {
        left:number,
        top:number,
    } | null,
    mouseDragStop? : {
        left:number,
        top:number,
    } | null,
    width: number,
}

export default IMapEditorState;