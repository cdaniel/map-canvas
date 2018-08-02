interface IMapEditorState {
    dragInProgress  : boolean,
    height: number,
    input: HTMLDivElement | null,
    focusedNodes : string[],
    width: number,
}

export default IMapEditorState;