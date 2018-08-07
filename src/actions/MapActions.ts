/* tslint:disable max-classes-per-file */
import {MapEditorDispatcher, TypedEvent} from '../dispatcher/MapEditorDispatcher';
import IMapState from "../types/MapState";




export class NewNodeIntentEvent extends TypedEvent<any> {}
export class LoadMapEvent extends TypedEvent<any> {};

export class NodeDraggedEvent extends TypedEvent<any> {}

export class InitiateNodeDeletionEvent extends TypedEvent<any> {}
export class InitiateConnection extends TypedEvent<any> {}

export class InitiateConnectionDeletion extends TypedEvent<any> {}

export class InitiateConnectionEdit extends TypedEvent<any> {}

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

export function initiateNodeDeletion(id:string){
    MapEditorDispatcher.dispatch(new InitiateNodeDeletionEvent({id}));
}

export function connectionInitiated(scope: any, sourceId: string | any, targetId: string) {
    MapEditorDispatcher.dispatch(new InitiateConnection({scope, sourceId, targetId}));
}

export function initiateConnectionDeletion(sourceId:string, targetId :string, scope:string) {
    MapEditorDispatcher.dispatch(new InitiateConnectionDeletion({scope, sourceId, targetId}));
}

export function initiateConnectionEdit(sourceId:string, targetId :string, scope:string) {
    MapEditorDispatcher.dispatch(new InitiateConnectionEdit({scope, sourceId, targetId}));
}