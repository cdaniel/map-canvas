/* tslint:disable max-classes-per-file */

import {MapEditorDispatcher, TypedEvent} from '../dispatcher/MapEditorDispatcher';


export class DragStartedEvent extends TypedEvent<any> {}
export class DragStoppedEvent extends TypedEvent<any> {}
export class MapResizeEvent extends TypedEvent<any> {}

export function startDrag() {
    MapEditorDispatcher.dispatch(new DragStartedEvent(null));
}

export function stopDrag() {
    MapEditorDispatcher.dispatch(new DragStoppedEvent(null));
}

export function resize(width: number, height: number) {
    MapEditorDispatcher.dispatch(new MapResizeEvent({height, width}));
}
