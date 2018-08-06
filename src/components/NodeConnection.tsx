import * as React from 'react';

// @ts-ignore
import {Connection, ElementGroupRef, ElementRef, Endpoint, jsPlumbInstance} from "jsplumb";


export interface IConnectionProps {
    jsPlumbInstance:jsPlumbInstance,
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
        const params = {
            anchors : [computedStyle.sourceAnchors, computedStyle.targetAnchors],
            connector: computedStyle.connector,

            detachable : false,
            endpoints: [computedStyle.endpoint, computedStyle.endpoint],
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

        this.setState({connection:this.jsPlumbInstance.connect(params as any)});
    }

    public componentDidUpdate = () => {
        this.jsPlumbInstance.revalidate(this.props.sourceId);
        this.jsPlumbInstance.revalidate(this.props.targetId);
    }

    public componentWillUnmount = () => {
        // this.jsPlumbInstance.detach(this.state.connection);
        this.jsPlumbInstance.deleteConnection(this.state.connection);
        this.setState({connection:null});
    }
}