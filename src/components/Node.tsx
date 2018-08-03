import * as React from 'react';

// @ts-ignore
import {Connection, ElementGroupRef, ElementRef, Endpoint, jsPlumbInstance} from "jsplumb";
import * as _ from "underscore";

import * as MapEditorActions from '../actions/MapEditorActions'

import {SyntheticEvent} from "react";

// @ts-ignore
import * as jsPlumb from "jsplumb";

import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as MapActions from "../actions/MapActions";
import MapEditorStore from "../stores/MapEditorStore";

export interface INodeProps {
    evolution : number,
    id : string,
    jsPlumbInstance: jsPlumbInstance,
    name : string,
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
    private dependencyStub: Connection | null;
    private sourceEndpoint: jsPlumb.Endpoint | null;
    private targetEndpoint: jsPlumb.Endpoint | null;

    constructor(props: INodeProps) {
        super(props);
        this.jsPlumbInstance = props.jsPlumbInstance;
        this.state = {};
    }



    public render() {
        const left = this.props.evolution * this.props.parentWidth;
        const top = this.props.visibility * this.props.parentHeight;
        const zIndex = 6;
        const position = 'absolute' as 'absolute';
        let componentStyle = {left, top, zIndex, position};
        let injectedComponent = null;
        const computedLook = this.props.styler(this.props.type);
        let movable = false;
        if(computedLook){
            if(computedLook.style){
                componentStyle = _.extend(componentStyle, computedLook.style);
            }
            if(computedLook.component){
                injectedComponent = computedLook.component;
            }
            movable = computedLook.movable;
        }

        let dependencyMenuComponent = null;
        let moveComponent = null;
        if(this.props.focused){
            dependencyMenuComponent = <div id={this.props.id + "-dragMenuParent"} style={{position:'relative', width:0, height:0}}>
                <div id={this.props.id + "dragMenu"} style={{position:'absolute', left:50, top:20}} className="dragMenu"/>
            </div>
            if(movable){
                const color = this.state.hoveredMenu === 'moveMenuItem' ? menuItemHighlightColor : menuItemNormalColor;
                moveComponent = <div id={this.props.id + '-moveMenuItemParent'} style={{position:'relative', width:0, height:0}}>
                    <div id={this.props.id + '-moveMenuItem'} style={{position:'absolute', left:-20, top:-20}} onMouseOver={this.onMoveMenuOver} onMouseLeave={this.onMouseLeave}>
                        <FontAwesomeIcon icon={faArrowsAlt} color={color}/>
                    </div>
                </div>
            }
        }
        return (
            <div id={this.props.id} key={this.props.id} style={componentStyle} ref={this.storeNativeHandle} onClick={this.onClickHandler}>
                {dependencyMenuComponent}
                {moveComponent}


                <div style={{position:'relative', width:0, height:0}}>
                    <div style={{position:'absolute', left:12, top:-15, fontSize:'small', maxWidth:150, width:100}}>
                        {this.props.name}
                    </div>
                </div>
                {injectedComponent}
            </div>
        );
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
        this.reconcileDependencyStub();
        this.updateMovableState();
    }

    public componentDidMount(){
        if(!this.input){
            return;
        }
        this.jsPlumbInstance.draggable(this.input, {
            containment : true,
            stop: this.moveStopped
        } as any)
        if(!this.props.focused){
            return;
        }
        this.reconcileDependencyStub();
        this.updateMovableState();
    }

    public moveStopped = (event:any) => {
        const coords = MapEditorStore.normalizeCoord(event.pos[0], event.pos[1]);
        MapActions.nodeWasMoved(this.props.id, coords);
    }

    public updateMovableState(){
        this.jsPlumbInstance.setDraggable(this.input, this.state.hoveredMenu === 'moveMenuItem');
    }

    public reconcileDependencyStub = () => {
        if(this.props.focused && !this.dependencyStub){
            const sourceEndpoint = {
                connector: ["Straight",{gap: 1}],
                endpoint:[ "Blank", { radius:5 } ],
                isSource:true,
            } as any;
            const targetEndpoint = {
                endpoint:[ "Dot", { radius:5 } ],
                isTarget:true,
                reattach:true
            } as any;
            this.sourceEndpoint = this.jsPlumbInstance.addEndpoint(this.input, sourceEndpoint) as Endpoint;
            this.targetEndpoint = this.jsPlumbInstance.addEndpoint(this.props.id + "dragMenu", targetEndpoint) as Endpoint;
            this.dependencyStub = this.jsPlumbInstance.connect({source:this.sourceEndpoint, target:this.targetEndpoint, deleteEndpointsOnDetach:true});
        }
        this.jsPlumbInstance.revalidate(this.input as ElementRef);
        this.jsPlumbInstance.revalidate(this.props.id + "-dragMenuParent");
        this.jsPlumbInstance.revalidate(this.props.id + "dragMenu");
    }

    public componentWillReceiveProps(nextProps: INodeProps){
        if(this.props.focused && !nextProps.focused && this.dependencyStub !== null){
            this.jsPlumbInstance.deleteConnection(this.dependencyStub!);
            this.dependencyStub = null;
            this.jsPlumbInstance.deleteEndpoint(this.sourceEndpoint!);
            this.sourceEndpoint = null;

            this.jsPlumbInstance.remove(this.props.id + "dragMenu");

            this.jsPlumbInstance.deleteEndpoint(this.targetEndpoint!);

            this.targetEndpoint = null;
        }
        if(this.props.focused && !nextProps.focused){
            // stop highlighting any menu
            this.setState({hoveredMenu:null});
        }
    }


    public storeNativeHandle = (input: any) => {
        this.input = input;
    }


    public onClickHandler = (event : SyntheticEvent) => {
        const isCommandOrCtrlPressed = (event.nativeEvent as any).metaKey || (event.nativeEvent as any).ctrlKey;
        if(!this.props.focused && !isCommandOrCtrlPressed){
            MapEditorActions.focusNode(this.props.id);
        } else if(!this.props.focused && isCommandOrCtrlPressed){
            MapEditorActions.addNodeToFocus(this.props.id);
        }
        event.preventDefault();
        event.stopPropagation();
        if(this.props.focused && this.state.hoveredMenu === 'dragMenu'){
            return;
        }
    }

}