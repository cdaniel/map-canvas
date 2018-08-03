import {Dispatcher} from "flux";
import FluxStore from './FluxStore';

import {jsPlumbInstance} from "jsplumb";
import {
    BlurAllEvent, BlurNodeEvent,
    DragStartedEvent,
    DragStoppedEvent,
    FocusAddNodeEvent,
    FocusNodeEvent,
    MapResizeEvent, ScopeActivatedEvent, ScopeDectivatedEvent
} from "../actions/MapEditorActions";
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
            } else if (action instanceof FocusNodeEvent){
                this.state.jsPlumbInstance!.clearDragSelection();
                this.state.focusedNodes = [(action as FocusNodeEvent).payload.id];
                this.state.jsPlumbInstance!.addToDragSelection((action as FocusNodeEvent).payload.id);
                this.emitChange();
            } else if (action instanceof FocusAddNodeEvent){
                this.state.focusedNodes.push((action as FocusNodeEvent).payload.id);
                this.state.jsPlumbInstance!.addToDragSelection((action as FocusNodeEvent).payload.id);
                this.emitChange();
            } else if (action instanceof  BlurAllEvent){
                this.state.focusedNodes = [];
                this.state.jsPlumbInstance!.clearDragSelection();
                this.emitChange();
            } else if (action instanceof BlurNodeEvent){
                this.state.jsPlumbInstance!.removeFromDragSelection(action.payload.id);
                const index = this.state.focusedNodes.indexOf(action.payload.id);
                if(index > -1){
                    this.state.focusedNodes.splice(index,1);
                }
                this.emitChange();
            } else if (action instanceof ScopeActivatedEvent){
                this.state.activeScope = action.payload.scopeId;
                this.emitChange();
            } else if (action instanceof ScopeDectivatedEvent){
                this.state.activeScope = null;
                this.emitChange();
            }
        }
        super(dispatcher, onDispatch, () => ({
            activeScope : null,
            dragInProgress: false,
            focusedNodes: [],
            height: 0,
            input: null,
            jsPlumbInstance : null,
            width: 0,
        }));
    }

    public getState() {
        return this.state
    }

    public setJsPlumbInstance(plumb:jsPlumbInstance){
        this.state.jsPlumbInstance = plumb;
    }

    public verifyTarget(params:any){
        const target = params.e.target;
        return target === this.state.input;
    }

    public normalizeCoord(retrievedEvolution:number,retrievedVisibility:number){

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