import * as React from 'react';

import {ElementGroupRef, ElementRef, Endpoint, jsPlumbInstance} from "jsplumb";


export interface INodeProps {
    evolution : number,
    id : string,
    jsPlumbInstance: jsPlumbInstance,
    name : string,
    parentHeight: number,
    parentWidth: number,
    visibility : number,
}


export default class Node extends React.Component<INodeProps, object> {

    private jsPlumbInstance: jsPlumbInstance;
    private input: ElementGroupRef;

    constructor(props: INodeProps) {
        super(props);
        this.jsPlumbInstance = props.jsPlumbInstance;
    }



    public render() {
        const left = this.props.evolution * this.props.parentWidth;
        const top = this.props.visibility * this.props.parentHeight;
        const zIndex = 6;
        const position = 'absolute' as 'absolute';
        return (
            <div id={this.props.id} key={this.props.id} style={{left, top, zIndex, position}} ref={this.storeNativeHandle}>
                O

                    <div style={{position:'absolute', left:20, top:-30}}>
                        {this.props.name}
                    </div>


                <div id={this.props.id + "dragMenuParent"} style={{position:'relative', width:0, height:0}}>
                    <div id={this.props.id + "dragMenu"} style={{position:'absolute', left:50, top:10}} className="dragMenu"/>
                </div>
            </div>
        );
    }

    public componentDidUpdate(){
        this.jsPlumbInstance.revalidate(this.input as ElementRef);
        this.jsPlumbInstance.revalidate(this.props.id + "dragMenuParent");
        this.jsPlumbInstance.revalidate(this.props.id + "dragMenu");
        this.jsPlumbInstance.recalculateOffsets(this.props.id);
    }

    public componentDidMount(){
        if(!this.input){
            return;
        }
        const sourceEndpoint = {
            connector: ["Straight",{gap: 3}],
            endpoint:[ "Blank", { radius:5 } ],
            isSource:true,
        } as any;
        const targetEndpoint = {
            endpoint:[ "Dot", { radius:5 } ],
            isTarget:true,
            reattach:true
        } as any;
        const source = this.jsPlumbInstance.addEndpoint(this.input, sourceEndpoint) as Endpoint;
        const target = this.jsPlumbInstance.addEndpoint(this.props.id + "dragMenu", targetEndpoint) as Endpoint;
        this.jsPlumbInstance.connect({source, target, deleteEndpointsOnDetach:true});
    }

    public storeNativeHandle = (input: any) => {
        this.input = input;
    }

}