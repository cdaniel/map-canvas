import {Dispatcher} from "flux";
import FluxStore from './FluxStore';

import {Event, MapEditorDispatcher} from '../dispatcher/MapEditorDispatcher';
import IMapState from '../types/MapState';

import {LoadMapEvent, NewNodeIntentEvent} from "../actions/MapActions";

function makeid() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
class MapStore extends FluxStore<IMapState> {


    constructor(dispatcher:  Dispatcher<Event>) {
        const onDispatch = (action: Event) => {
            if (action instanceof LoadMapEvent) {
                this.state = (action as LoadMapEvent).payload.map;
                this.emitChange();
            } else if (action instanceof NewNodeIntentEvent) {
                this.state.nodes.push({
                    evolution : (action as NewNodeIntentEvent).payload.coords.evolution,
                    id: makeid(),
                    name: makeid(),
                    type:(action as NewNodeIntentEvent).payload.type,
                    visibility: (action as NewNodeIntentEvent).payload.coords.visibility,
                });
                this.emitChange();
            }
        }
        super(dispatcher, onDispatch, () => ({nodes:[{
                evolution : 0.5,
                id : 'id1',
                name : 'first name',
                type: 'default',
                visibility : 0.5,

            },
                {
                    evolution : 0.5,
                    id : 'id2',
                    name : 'second name',
                    type: 'default',
                    visibility : 0.2,

                },
                {
                    evolution : 0.7,
                    id : 'id3',
                    name : 'third name',
                    type: 'default',
                    visibility : 0.6,

                },]}));
    }

    public getState() {
        return this.state
    }
}

const mapStoreInstance = new MapStore(MapEditorDispatcher);
export default mapStoreInstance;