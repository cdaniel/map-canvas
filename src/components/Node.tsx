import * as React from 'react';

// @ts-ignore
import {Connection, ElementGroupRef, ElementRef, Endpoint, jsPlumbInstance} from "jsplumb";
import * as _ from "underscore";

import * as MapEditorActions from '../actions/MapEditorActions'

import {SyntheticEvent} from "react";

// @ts-ignore
import * as jsPlumb from "jsplumb";

import { faArrowsAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as MapActions from "../actions/MapActions";
import MapEditorStore from "../stores/MapEditorStore";

export interface INodeProps {
    activeDragScope : {sourceId:string, scopeId:string} | null,
    evolution : number,
    id : string,
    jsPlumbInstance: jsPlumbInstance,
    multiNodeFocus : boolean, // indicates whether there is more than one node selected in a map
    name : string,
    nodeDroppedOntoId : string | any, // if a node is dropped on, we have to keep it as a target until the connection is recorded
    parentHeight: number,
    parentWidth: number,
    styler:(type:string) => HTMLDivElement | any | null,
    type: string,
    visibility : number,
    focused : boolean
}

const menuItemNormalColor = 'gray';

const menuItemHighlightColor = 'rgb(0,120,155)';

export default class Node extends React.Component<INodeProps, any> {

    private jsPlumbInstance: jsPlumbInstance;
    private input: ElementGroupRef;

    private dependencyStubs: Array<{
        connection : Connection,
        parentName : string,
        sourceEndpoint: jsPlumb.Endpoint,
        targetEndpoint: jsPlumb.Endpoint
    }>;

    constructor(props: INodeProps) {
        super(props);
        this.jsPlumbInstance = props.jsPlumbInstance;
        this.dependencyStubs = [];
        this.state = {};
    }


    public prepareDragConnectionComponents(){
        if(!this.state || !this.state.connections || !this.state.connections.source){
            return null;
        }
        const results = new Array<any>();
        for(const connectionDragStarter of this.state.connections.source){
            results.push(<div id={this.props.id + "-" + connectionDragStarter.name + '-parentMenu'} key={this.props.id + "-" + connectionDragStarter.name + 'parent'} style={{position:'relative', width:0, height:0}}>
                <div id={this.props.id + "-" + connectionDragStarter.name + '-parentMenuItem'} style={{position:'absolute', left:connectionDragStarter.relativePos.left, top:connectionDragStarter.relativePos.top}}/>
            </div>);
        }
        return results;
    }

    public shouldBecomeDragTarget(){
        if(!this.state || !this.state!.connections || !this.state!.connections.target || !this.state!.connections.target.length){
            return false;
        }
        // keep state until connection is processed.
        if(this.props.nodeDroppedOntoId === this.props.id){
            return true;
        }
        if(this.props.activeDragScope) {
            for (const dropTarget of this.state!.connections.target) {
                if (dropTarget === this.props.activeDragScope.scopeId && (this.props.id !== this.props.activeDragScope.sourceId) /* do not hint self*/) {
                    return true;
                }
            }
        }
        return false;
    }

    public render() {
        const left = this.props.evolution * this.props.parentWidth;
        const top = this.props.visibility * this.props.parentHeight;
        const zIndex = 6;
        const position = 'absolute' as 'absolute';
        let componentStyle = {left, top, zIndex, position};

        if(this.state.style) {
            componentStyle = _.extend(componentStyle, this.state.style);
        }

        if(this.shouldBecomeDragTarget()){
            componentStyle = _.extend(componentStyle, {boxShadow:'0 0 7px 7px ' + menuItemHighlightColor, zIndex:100});
            // @ts-ignore
            componentStyle.width = componentStyle.width * 1.5;
            // @ts-ignore
            componentStyle.height = componentStyle.height * 1.5;
            // @ts-ignore
            componentStyle.maxWidth = componentStyle.maxWidth * 1.5;
            // @ts-ignore
            componentStyle.maxHeight = componentStyle.maxHeight * 1.5;
            // @ts-ignore
            componentStyle.borderRadius = componentStyle.borderRadius * 1.5;
            if(this.props.activeDragScope){
                this.jsPlumbInstance.makeTarget(this.input as any, {isTarget:true, scope: this.props.activeDragScope!.scopeId});
            }
        } else if (this.input){
            this.jsPlumbInstance.unmakeTarget(this.input as any);
        }


        let dragConnectionComponents = null;
        let moveComponent = null;
        let deleteComponent = null;
        if(this.props.focused){
            // many nodes, many focused - we can only move them
            if(this.state.movable){
                const color = this.state.hoveredMenu === 'moveMenuItem' ? menuItemHighlightColor : menuItemNormalColor;
                moveComponent = <div id={this.props.id + '-moveMenuItemParent'} key={this.props.id + '-moveMenuItemParent'} style={{position:'relative', width:0, height:0}}>
                    <div id={this.props.id + '-moveMenuItem'} style={{position:'absolute', left:-20, top:-20, zIndex:10}} onMouseOver={this.onMoveMenuOver} onMouseLeave={this.onMouseLeave}>
                        <FontAwesomeIcon icon={faArrowsAlt} color={color}/>
                    </div>
                </div>
            }
        }
        if(this.props.focused && !this.props.multiNodeFocus){
            // single node focused, full menu
            dragConnectionComponents = this.prepareDragConnectionComponents();
            if(this.state.deletable){
                const color = this.state.hoveredMenu === 'deleteMenuItem' ? 'orange' : menuItemNormalColor;
                deleteComponent = <div id={this.props.id + '-deleteMenuItemParent'} key={this.props.id + '-deleteMenuItemParent'} style={{position:'relative', width:0, height:0}}>
                    <div id={this.props.id + '-deleteMenuItem'} style={{backgroundColor:'white',position:'absolute', left:28, boxShadow: '0 0 3px white', top:-20, zIndex:10}} onMouseOver={this.onDeleteMenuOver} onMouseLeave={this.onMouseLeave}>
                        <FontAwesomeIcon icon={faTrashAlt} color={color}/>
                    </div>
                </div>
            }
        }
        return (
            <div id={this.props.id} key={this.props.id} style={componentStyle} ref={this.storeNativeHandle} onMouseDown={this.onMouseDown}>
                {dragConnectionComponents}
                {moveComponent}
                {deleteComponent}


                <div style={{position:'relative', width:0, height:0}} key="name">
                    <div style={{position:'absolute', left:12, top:-15, fontSize:'small', maxWidth:150, width:100}}>
                        {this.props.name}
                    </div>
                </div>
                {this.state.injectedComponent}
            </div>
        );
    }

    public onDeleteMenuOver = () => {
        this.onMouseOver('deleteMenuItem');
    }

    public onMoveMenuOver = () => {
        this.onMouseOver('moveMenuItem');
    }

    public onMouseOver = (hoveredMenu:string) => {
        this.setState({hoveredMenu});
    }

    public onMouseLeave = () => {
        this.setState({hoveredMenu:null});
    }

    public componentDidUpdate(){
        if(!this.input){
            return;
        }
        if(!this.props.focused){
            return;
        }
        this.reconcileDragConnectionStubs();
        this.updateMovableState();
    }

    public componentDidMount(){
        if(!this.input){
            return;
        }
        this.computedLookUpdate(this.props);
        this.jsPlumbInstance.draggable(this.input, {
            containment : true,
            stop: this.moveStopped
        } as any)
        this.jsPlumbInstance.setDraggable(this.input, false);
        if(!this.props.focused){
            return;
        }
        this.reconcileDragConnectionStubs();
        this.updateMovableState();
    }

    public moveStopped = (event:any) => {
        const coords = MapEditorStore.normalizeCoord(event.pos[0], event.pos[1]);
        MapActions.nodeWasMoved(this.props.id, coords);
    }

    public updateMovableState(){
        this.jsPlumbInstance.setDraggable(this.input, this.state.hoveredMenu === 'moveMenuItem');
    }

    public componentWillUnmount(){
        if(this.props.focused && this.dependencyStubs.length !== 0){
            for(const dependencyStub of this.dependencyStubs) {
                this.jsPlumbInstance.deleteConnection(dependencyStub.connection);
                this.jsPlumbInstance.deleteEndpoint(dependencyStub.sourceEndpoint);
                this.jsPlumbInstance.remove(dependencyStub.parentName);
                this.jsPlumbInstance.deleteEndpoint(dependencyStub.targetEndpoint);

            }
            this.dependencyStubs = [];
        }
    }

    public reconcileDragConnectionStubs = () => {
        this.jsPlumbInstance.revalidate(this.input as ElementRef);
        if(!this.state.connections || !this.state.connections.source){
            return;
        }
        for(const connectionDragStarter of this.state.connections.source) {
            this.jsPlumbInstance.revalidate(this.props.id + "-" + connectionDragStarter.name + '-parentMenu');
            this.jsPlumbInstance.revalidate(this.props.id + "-" + connectionDragStarter.name + '-parentMenuItem');
        }

        // only single nodes can get the dependency connection stub
        if(this.props.focused && this.props.multiNodeFocus === false && this.dependencyStubs.length === 0 ){
            for(const connectionDragStarter of this.state.connections.source) {
                const parentName = this.props.id + "-" + connectionDragStarter.name + '-parentMenuItem';
                const newSourceEndpointOptions = connectionDragStarter.sourceEndpoint;
                newSourceEndpointOptions.scope = connectionDragStarter.name;

                const newTargetEndpointOptions = connectionDragStarter.targetEndpoint;
                newTargetEndpointOptions.scope = connectionDragStarter.name;

                const targetEndpoint = this.jsPlumbInstance.addEndpoint(parentName, connectionDragStarter.targetEndpoint) as Endpoint;
                const sourceEndpoint = this.jsPlumbInstance.addEndpoint(this.props.id, connectionDragStarter.sourceEndpoint) as Endpoint;

                const connection = this.jsPlumbInstance.connect({source:sourceEndpoint, target:targetEndpoint, deleteEndpointsOnDetach:true});
                this.dependencyStubs.push({
                    connection,
                    parentName,
                    sourceEndpoint,
                    targetEndpoint,
                });
            }
        }
    }

    public componentWillReceiveProps(nextProps: INodeProps){
        this.computedLookUpdate(nextProps);

        if( (this.props.focused && !this.props.multiNodeFocus /* single node focused */ && !nextProps.focused /* will be unfocused */)
        || (this.props.focused && !this.props.multiNodeFocus /* single node focused */ && nextProps.multiNodeFocus /* will become a part of focus group */)){

            for(const dependencyStub of this.dependencyStubs) {
                this.jsPlumbInstance.deleteConnection(dependencyStub.connection);
                this.jsPlumbInstance.deleteEndpoint(dependencyStub.sourceEndpoint);
                this.jsPlumbInstance.remove(dependencyStub.parentName);
                this.jsPlumbInstance.deleteEndpoint(dependencyStub.targetEndpoint);

            }
            this.dependencyStubs = [];
        }
        if(this.props.focused && !nextProps.focused){
            // stop highlighting any menu
            this.setState({hoveredMenu:null});
        }
    }


    public storeNativeHandle = (input: any) => {
        this.input = input;
    }


    public onMouseDown = (event : SyntheticEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const isCommandOrCtrlPressed = (event.nativeEvent as any).metaKey || (event.nativeEvent as any).ctrlKey;
        if(!this.props.focused && !isCommandOrCtrlPressed){
            MapEditorActions.focusNode(this.props.id);
        } else if(!this.props.focused && isCommandOrCtrlPressed){
            MapEditorActions.addNodeToFocus(this.props.id);
        }
        if(this.props.focused && this.state.hoveredMenu === 'dragMenuItem'){
            return;
        }
        if(this.props.focused && this.state.hoveredMenu === 'deleteMenuItem'){
            MapEditorActions.blurNode(this.props.id);
            MapActions.initiateNodeDeletion(this.props.id);
        }
    }

    private computedLookUpdate = (props : any) => {
        const computedLook = this.props.styler(props.type);
        const newState = {
            connections: computedLook.connections,
            deletable: computedLook.deletable,
            injectedComponent: computedLook.component,
            movable: computedLook.movable,
            style: computedLook.style
        };
        if(computedLook) {
            this.setState(newState);
        };
        return newState;
    }

}