/* tslint:disable max-classes-per-file */

import {MapEditorDispatcher, TypedEvent} from '../dispatcher/MapEditorDispatcher';




export class DragStartedEvent extends TypedEvent<any> {}
export class DragStoppedEvent extends TypedEvent<any> {}
export class MapResizeEvent extends TypedEvent<any> {}
export class FocusNodeEvent extends TypedEvent<any> {}
export class FocusAddNodeEvent extends TypedEvent<any> {}
export class BlurAllEvent extends TypedEvent<any> {}

export function startDrag() {
    MapEditorDispatcher.dispatch(new DragStartedEvent(null));
}

export function stopDrag(type:string, params:any) {
    MapEditorDispatcher.dispatch(new DragStoppedEvent({type, params}));
}

export function resize(width: number, height: number, input:HTMLDivElement|null) {
    MapEditorDispatcher.dispatch(new MapResizeEvent({height, width, input}));
}

export function focusNode(id:string){
    MapEditorDispatcher.dispatch(new FocusNodeEvent({id}));
}

export function addNodeToFocus(id:string){
    MapEditorDispatcher.dispatch(new FocusAddNodeEvent({id}));
}

export function blurAll() {
    MapEditorDispatcher.dispatch(new BlurAllEvent(null));
}

