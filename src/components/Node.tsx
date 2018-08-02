import * as React from 'react';

import {Connection, ElementGroupRef, ElementRef, Endpoint, jsPlumbInstance} from "jsplumb";
import * as _ from "underscore";

import * as MapEditorActions from '../actions/MapEditorActions'

import {SyntheticEvent} from "react";

import * as jsPlumb from "jsplumb";

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


export default class Node extends React.Component<INodeProps, any> {

    private jsPlumbInstance: jsPlumbInstance;
    private input: ElementGroupRef;
    private dependencyStub: Connection | null;
    private sourceEndpoint: jsPlumb.Endpoint | null;
    private targetEndpoint: jsPlumb.Endpoint | null;

    constructor(props: INodeProps) {
        super(props);
        this.jsPlumbInstance = props.jsPlumbInstance;
    }



    public render() {
        const left = this.props.evolution * this.props.parentWidth;
        const top = this.props.visibility * this.props.parentHeight;
        const zIndex = 6;
        const position = 'absolute' as 'absolute';
        let componentStyle = {left, top, zIndex, position};
        let injectedComponent = null;
        const computedLook = this.props.styler(this.props.type);
        if(computedLook){
            if(computedLook.style){
                componentStyle = _.extend(componentStyle, computedLook.style);
            }
            if(computedLook.component){
                injectedComponent = computedLook.component;
            }
        }

        let dependencyMenuComponent = null;
        if(this.props.focused){
            dependencyMenuComponent = <div id={this.props.id + "dragMenuParent"} style={{position:'relative', width:0, height:0}}>
                <div id={this.props.id + "dragMenu"} style={{position:'absolute', left:50, top:20}} className="dragMenu"/>
            </div>
        }
        return (
            <div id={this.props.id} key={this.props.id} style={componentStyle} ref={this.storeNativeHandle} onClick={this.onClickHandler}>
                {dependencyMenuComponent}


                <div style={{position:'relative', width:0, height:0}}>
                    <div style={{position:'absolute', left:12, top:-15, fontSize:'small', maxWidth:150, width:100}}>
                        {this.props.name}
                    </div>
                </div>
                {injectedComponent}
            </div>
        );
    }

    public componentDidUpdate(){
        if(!this.input){
            return;
        }
        if(!this.props.focused){
            return;
        }
        this.reconcileDependencyStub();
    }

    public componentDidMount(){
        if(!this.input){
            return;
        }
        if(!this.props.focused){
            return;
        }
        this.reconcileDependencyStub();
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
        this.jsPlumbInstance.revalidate(this.props.id + "dragMenuParent");
        this.jsPlumbInstance.revalidate(this.props.id + "dragMenu");
    }

    public componentWillReceiveProps(nextProps: INodeProps){
        if(!nextProps.focused && this.dependencyStub !== null){
            this.jsPlumbInstance.deleteConnection(this.dependencyStub!);
            this.dependencyStub = null;
            this.jsPlumbInstance.deleteEndpoint(this.sourceEndpoint!);
            this.sourceEndpoint = null;

            this.jsPlumbInstance.remove(this.props.id + "dragMenu");

            this.jsPlumbInstance.deleteEndpoint(this.targetEndpoint!);

            this.targetEndpoint = null;
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
    }

}