import {Dispatcher} from "flux";
import FluxStore from './FluxStore';

import {Event, MapEditorDispatcher} from '../dispatcher/MapEditorDispatcher';
import IMapState from '../types/MapState';

import {
    InitiateConnection, InitiateConnectionDeletion, InitiateConnectionEdit,
    InitiateNodeDeletionEvent,
    LoadMapEvent,
    NewNodeIntentEvent,
    NodeDraggedEvent
} from "../actions/MapActions";

function makeid() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

class MapStore extends FluxStore<IMapState> {


    constructor(dispatcher: Dispatcher<Event>) {
        const onDispatch = (action: Event) => {
            if (action instanceof LoadMapEvent) {
                this.state = (action as LoadMapEvent).payload.map;
                this.emitChange();
            } else if (action instanceof NewNodeIntentEvent) {
                this.state.nodes.push({
                    evolution: (action as NewNodeIntentEvent).payload.coords.evolution,
                    id: makeid(),
                    name: makeid(),
                    type: (action as NewNodeIntentEvent).payload.type,
                    visibility: (action as NewNodeIntentEvent).payload.coords.visibility,
                });
                this.emitChange();
            } else if (action instanceof NodeDraggedEvent) {
                const coords = action.payload.coords;
                const id = action.payload.id;
                for (const node of this.state.nodes) {
                    if (node.id === id) {
                        node.visibility = coords.visibility;
                        node.evolution = coords.evolution;
                    }
                }
                this.emitChange();
            } else if (action instanceof InitiateNodeDeletionEvent){
                const id = action.payload.id;
                this.state.nodes = this.state.nodes.filter(node => node.id !== id);
                this.emitChange();
            } else if (action instanceof InitiateConnection){
                let found = false;
                for(const existingConnection of this.state.connections){
                    if(existingConnection.scope === action.payload.scope
                        && existingConnection.targetId === action.payload.targetId
                        && existingConnection.sourceId === action.payload.sourceId){
                        found = true;
                    }
                }
                if(!found){
                    this.state.connections.push({
                        scope : action.payload.scope,
                        sourceId : action.payload.sourceId,
                        targetId: action.payload.targetId
                    });
                    this.emitChange();
                }
            } else if (action instanceof InitiateConnectionDeletion){
                this.state.connections = this.state.connections.filter( c=>!( c.scope === action.payload.scope
                    && c.targetId === action.payload.targetId
                    && c.sourceId === action.payload.sourceId));
                this.emitChange();
            } else if (action instanceof InitiateConnectionEdit){
                for(const existingConnection of this.state.connections){
                    if(existingConnection.scope === action.payload.scope
                        && existingConnection.targetId === action.payload.targetId
                        && existingConnection.sourceId === action.payload.sourceId){
                        existingConnection.label = makeid();
                    }
                }
                this.emitChange();
            }
        }
        super(dispatcher, onDispatch, () => ({
            connections : [
                {
                    label: 'important',
                    scope: 'user-userneed-dependency',
                    sourceId: 'id1',
                    targetId: 'id2'
                }
            ],
            nodes: [{
                evolution: 0.5,
                id: 'id1',
                name: 'first name',
                type: 'user-node',
                visibility: 0.13,

            },
                {
                    evolution: 0.5,
                    id: 'id2',
                    name: 'second name',
                    type: 'user-need-node',
                    visibility: 0.5,

                },
                {
                    evolution: 0.7,
                    id: 'id3',
                    name: 'third name',
                    type: 'default',
                    visibility: 0.6,

                },]
        }));
    }

    public getState() {
        return this.state
    }
}

const mapStoreInstance = new MapStore(MapEditorDispatcher);
export default mapStoreInstance;
