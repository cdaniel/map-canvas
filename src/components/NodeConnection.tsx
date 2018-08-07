import * as React from 'react';

// @ts-ignore
import {Connection, ElementGroupRef, ElementRef, Endpoint, jsPlumbInstance} from "jsplumb";

import * as MapEditorActions from '../actions/MapEditorActions'

export interface IConnectionProps {
    focused:boolean,
    jsPlumbInstance:jsPlumbInstance,
    label? : string,
    scope: string,
    sourceId: string,
    targetId: string,
    styler: (type:string) => string | any;
}

export default class NodeConnection extends React.Component<IConnectionProps, any> {

    private jsPlumbInstance: jsPlumbInstance;

    constructor(props: IConnectionProps) {
        super(props);
        this.jsPlumbInstance = props.jsPlumbInstance;
        this.state = {};
    }

    public render() {
        // this is noop, as connections are rendered using jsplumb
        return null;
    }

    public componentDidMount = () => {
        const computedStyle = this.props.styler(this.props.scope);
        const label = this.props.label || "&nbsp;";
        const params = {
            anchors : [computedStyle.sourceAnchors, computedStyle.targetAnchors],
            connector: computedStyle.connector,

            detachable : false,
            endpoints: [computedStyle.endpoint, computedStyle.endpoint],
            overlays: [[ "Label", {labelStyle: {padding:1, font:'11px  sans-serif'}, label:label as string, id:'Label'}]],
            paintStyle : computedStyle.endpointStyle,
            scope: this.props.scope,
            source:this.props.sourceId,
            target:this.props.targetId,
        };
        if(!params.paintStyle){
            // @ts-ignore
            params.paintStyle = {};
        }
        // @ts-ignore
        if(!params.paintStyle.stroke){
            params.paintStyle!.stroke = 1;
            params.paintStyle!.strokeWidth = 1;
        }

        // @ts-ignore
        params.paintStyle!.outlineStroke = 'transparent';
        // @ts-ignore
        params.paintStyle!.outlineWidth = 10;

        const connection = this.jsPlumbInstance.connect(params as any);

        this.setState({connection});
        // @ts-ignore
        connection.bind('click', this.clickHandler);

    }

    public componentDidUpdate = () => {
        if(!this.state.connection){
            return;
        }
        if(this.props.focused){
            this.state.connection.hideOverlay('Label');
            this.state.connection.addType('focused');
            this.state.connection.addType(this.props.scope + '-focused');
        } else {
            this.state.connection.removeType('focused');
            this.state.connection.removeType(this.props.scope + '-focused');
            this.state.connection.showOverlay('Label');
            this.state.connection.getOverlay('Label').setLabel(this.props.label || '&nbsp;');
        }
        this.jsPlumbInstance.revalidate(this.props.sourceId);
        this.jsPlumbInstance.revalidate(this.props.targetId);
    }

    public componentWillUnmount = () => {
        if(!this.state.connection) {
            return;
        }
        this.state.connection.hideOverlay('Label');
        this.jsPlumbInstance.deleteConnection(this.state.connection);
        this.setState({connection:null});
    }

    private clickHandler = (obj:any, e:any) => {
        e.preventDefault();
        e.stopPropagation();
        if(!this.props.focused){
            MapEditorActions.focusConnection(this.props.sourceId, this.props.targetId, this.props.scope);
            return
        }
        if(obj.component && obj.id !== 'Label'){ // non label overlay clicked
            const connection = obj.component;
            console.log(connection);
            // TODO: do what needs to be done by respective overlay
        }
        MapEditorActions.blurConnection(this.props.sourceId, this.props.targetId, this.props.scope);
    }
}