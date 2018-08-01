import {Dispatcher} from "flux";
import FluxStore from './FluxStore';

import {DragStartedEvent, DragStoppedEvent, MapResizeEvent} from "../actions/MapEditorActions";
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
            } else if (action instanceof MapResizeEvent){
                this.state.width = (action as MapResizeEvent).payload.width;
                this.state.height = (action as MapResizeEvent).payload.height;
                this.state.input = (action as MapResizeEvent).payload.input;
                this.emitChange();
            }
        }
        super(dispatcher, onDispatch, () => ({
            dragInProgress: false,
            height: 0,
            input: null,
            width: 0,
        }));
    }

    public getState() {
        return this.state
    }

    public verifyTarget(params:any){
        const target = params.e.target;
        return target === this.state.input;
    }

    public normalizeCoord(params:any){
        const retrievedEvolution = params.e.offsetX;
        const retrievedVisibility = params.e.offsetY;

        const evolution = retrievedEvolution / this.state.width;
        const visibility = retrievedVisibility / this.state.height;
        return {
            evolution,
            visibility
        };
    }
}

const mapEditorStoreInstance = new MapEditorStore(MapEditorDispatcher);
export default mapEditorStoreInstance;