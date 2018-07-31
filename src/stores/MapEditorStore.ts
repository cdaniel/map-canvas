import {Dispatcher} from "flux";
import FluxStore from './FluxStore';

import {DragStartedEvent, DragStoppedEvent} from "../actions/MapEditorActions";
import {Event, MapEditorDispatcher} from '../dispatcher/MapEditorDispatcher';
import IMapEditorState from '../types/MapEditorState';



class MapEditorStore extends FluxStore<IMapEditorState> {


    constructor(dispatcher:  Dispatcher<Event>) {
        const onDispatch = (action: Event) => {
            if (action instanceof DragStartedEvent) {
                this.state.dragInProgress = true;
                this.emitChange();
            } else if (action instanceof DragStoppedEvent) {
                this.state.dragInProgress = false;
                this.emitChange();
            }
        }
        super(dispatcher, onDispatch, () => ({
            dragInProgress: false,
            height: 0,
            width: 0
        }));
    }

    public getState() {
        return this.state
    }
}

const mapEditorStoreInstance = new MapEditorStore(MapEditorDispatcher);
export default mapEditorStoreInstance;