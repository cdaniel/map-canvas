import {Dispatcher} from "flux";
import FluxStore from './FluxStore';

import {jsPlumbInstance} from "jsplumb";
import {
    BlurAllEvent, BlurConnectionEvent, BlurNodeEvent, ConnectionSendForProcessing,
    DragStartedEvent,
    DragStoppedEvent,
    FocusAddNodeEvent, FocusConnectionEvent,
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

                this.state.focusedConnections = [];

                this.emitChange();
            } else if (action instanceof FocusAddNodeEvent){
                this.state.focusedNodes.push((action as FocusNodeEvent).payload.id);
                this.state.jsPlumbInstance!.addToDragSelection((action as FocusNodeEvent).payload.id);

                this.state.focusedConnections = [];

                this.emitChange();
            } else if (action instanceof  BlurAllEvent){
                this.state.focusedNodes = [];
                this.state.focusedConnections = [];
                this.state.jsPlumbInstance!.clearDragSelection();
                this.emitChange();
            } else if (action instanceof BlurNodeEvent){
                this.state.jsPlumbInstance!.removeFromDragSelection(action.payload.id);
                const index = this.state.focusedNodes.indexOf(action.payload.id);
                if(index > -1){
                    this.state.focusedNodes.splice(index,1);
                }
                this.emitChange();
            } else if (action instanceof FocusConnectionEvent) {
                // first - clear node selection
                this.state.focusedNodes = [];
                this.state.jsPlumbInstance!.clearDragSelection();
                // focus on a single connection
                // this.state.focusedConnections.push({
                //     scope: action.payload.scope,
                //     sourceId : action.payload.sourceId,
                //     targetId: action.payload.targetId
                // });
                this.state.focusedConnections = [{
                    scope: action.payload.scope,
                    sourceId : action.payload.sourceId,
                    targetId: action.payload.targetId
                }];
                this.emitChange();
            } else if (action instanceof BlurConnectionEvent) {
                this.state.focusedConnections = this.state.focusedConnections.filter((connection)=>{
                    if(connection.sourceId === action.payload.sourceId &&
                    connection.targetId === action.payload.targetId
                    && connection.scope === action.payload.scope){
                        return false;
                    }
                    return true;
                });
                this.emitChange();
            } else if (action instanceof ScopeActivatedEvent){
                this.state.activeScope = {
                    scopeId : action.payload.scopeId,
                    sourceId : action.payload.sourceId,
                } ;
                this.emitChange();
            } else if (action instanceof ScopeDectivatedEvent){
                // drag was stopped, but we have to remember WHERE it was stored. If it was stopped on the target node
                // the node will toggle the target state before the connection is processed. We have to postpone that,
                // so we store the target id and clean it after the connection is established. Or not.
                this.state.nodeDroppedOntoId = action.payload.targetId;
                this.state.activeScope = null;
                this.emitChange();
            } else if (action instanceof ConnectionSendForProcessing){
                // connection captured, clear the target flag
                this.state.nodeDroppedOntoId = null;
                this.emitChange();
            }
        }
        super(dispatcher, onDispatch, () => ({
            activeScope : null,
            dragInProgress: false,
            focusedConnections: [],
            focusedNodes: [],
            height: 0,
            input: null,
            jsPlumbInstance : null,
            nodeDroppedOntoId:null,
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