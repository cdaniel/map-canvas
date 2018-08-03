/* tslint:disable max-classes-per-file */
import {MapEditorDispatcher, TypedEvent} from '../dispatcher/MapEditorDispatcher';
import IMapState from "../types/MapState";


export class NewNodeIntentEvent extends TypedEvent<any> {}
export class LoadMapEvent extends TypedEvent<any> {};

export class NodeDraggedEvent extends TypedEvent<any> {}

export function initiateNewNodeCreationProcess(type:string, coords:any) {
    MapEditorDispatcher.dispatch(new NewNodeIntentEvent({
        coords, type,
    }));
}

export function loadMap(map:IMapState){
    MapEditorDispatcher.dispatch(new LoadMapEvent({
        map,
    }));
}

export function nodeWasMoved(id:string, coords:any){
    MapEditorDispatcher.dispatch(new NodeDraggedEvent({id, coords}));
}